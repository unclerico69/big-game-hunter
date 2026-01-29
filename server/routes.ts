import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scoreGame } from "./engine/relevance";
import { getLiveGames } from "./api/liveGames";
import { listLocks, createLock } from "./api/locks";
import { TEAMS, getTeamById } from "../shared/data/teams";
import { MARKETS } from "../shared/data/markets";
import { LEAGUES, getDefaultLeaguePriority } from "../shared/data/leagues";
import { seedProviderData, resolveChannel } from "./services/channelResolver";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Health Check ===
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // === TVs ===
  app.get(api.tvs.list.path, async (req, res) => {
    const tvs = await storage.getTvs();
    res.json(tvs);
  });

  app.get(api.tvs.get.path, async (req, res) => {
    const tv = await storage.getTv(Number(req.params.id));
    if (!tv) return res.status(404).json({ message: 'TV not found' });
    res.json(tv);
  });

  app.patch(api.tvs.update.path, async (req, res) => {
    try {
      const input = api.tvs.update.input.parse(req.body);
      const tv = await storage.updateTv(Number(req.params.id), input);
      res.json(tv);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post(api.tvs.assign.path, async (req, res) => {
    try {
      const tvId = Number(req.params.id);
      const { gameId } = api.tvs.assign.input.parse(req.body);
      
      console.log(`[api/tvs/assign] Assigning game ${gameId} to TV ${tvId}`);
      
      let game = await storage.getGame(gameId);
      
      if (!game) {
        console.error(`Assignment failed: Game ${gameId} not found in database`);
        return res.status(404).json({ message: `Game ${gameId} not found in system storage` });
      }

      console.log(`[api/tvs/assign] Found game: ${game.title}`);
      
      // Resolve channel number based on provider
      const prefs = await storage.getPreferences();
      const providerId = (prefs as any)?.tvProviderId ?? null;
      let resolvedChannel = game.channel;
      
      if (providerId && game.channel) {
        const resolution = await resolveChannel([game.channel], providerId);
        if (resolution.resolvedChannelNumber) {
          resolvedChannel = `${resolution.resolvedNetwork} (Ch. ${resolution.resolvedChannelNumber})`;
          console.log(`[api/tvs/assign] Resolved channel: ${resolvedChannel}`);
        }
      }

      const tv = await storage.updateTv(tvId, {
        currentGameId: game.id,
        currentChannel: resolvedChannel,
        manualOverride: true
      });
      res.json(tv);
    } catch (err) {
      console.error("[api/tvs/assign] Unexpected error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post(api.tvs.clear.path, async (req, res) => {
    try {
      const tvId = Number(req.params.id);
      const tv = await storage.updateTv(tvId, {
        currentGameId: null,
        currentChannel: null,
        manualOverride: false
      });
      res.json(tv);
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get(api.games.list.path, getLiveGames);

  // === Locks ===
  app.get("/api/locks", listLocks);
  app.post("/api/locks", createLock);

  // === Preferences ===
  app.get(api.preferences.get.path, async (req, res) => {
    let prefs = await storage.getPreferences();
    if (!prefs) {
        // Return defaults if none exist with all leagues
        prefs = await storage.updatePreferences({
            venueId: 1,
            favoriteTeams: [],
            favoriteMarkets: [],
            leaguePriority: getDefaultLeaguePriority(),
            preventRapidSwitching: true,
            version: 1
        } as any);
    }
    
    // Log preferences stats
    const favTeams = (prefs.favoriteTeams as any[]) || [];
    const favMarkets = (prefs.favoriteMarkets as any[]) || [];
    const ncaaTeams = favTeams.filter(t => {
      const team = getTeamById(t.id);
      return team?.isCollege;
    });
    
    console.log(`[Preferences] Loaded ${favTeams.length} teams, ${favMarkets.length} markets`);
    if (ncaaTeams.length > 0) {
      console.log(`[Preferences] NCAA teams configured: ${ncaaTeams.map(t => t.id).join(', ')}`);
    }
    
    // Log available NCAA teams count
    const availableNcaaTeams = TEAMS.filter(t => t.isCollege).length;
    console.log(`[Preferences] NCAA teams available: ${availableNcaaTeams}`);
    
    res.json(prefs);
  });

  app.post(api.preferences.update.path, async (req, res) => {
    try {
      const input = api.preferences.update.input.parse(req.body);
      const prefs = await storage.updatePreferences(input);
      
      // Log updated preferences
      const favTeams = (prefs.favoriteTeams as any[]) || [];
      const favMarkets = (prefs.favoriteMarkets as any[]) || [];
      const ncaaTeams = favTeams.filter(t => {
        const team = getTeamById(t.id);
        return team?.isCollege;
      });
      
      console.log(`[Preferences] Updated: ${favTeams.length} teams, ${favMarkets.length} markets, ${prefs.leaguePriority?.length || 0} leagues`);
      if (ncaaTeams.length > 0) {
        console.log(`[Preferences] NCAA teams saved: ${ncaaTeams.map(t => t.id).join(', ')}`);
      }
      
      res.json(prefs);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payload: " + err.message });
      }
      // Check for database constraint errors (e.g. JSONB array check)
      if (err instanceof Error && err.message.includes("check constraint")) {
        return res.status(400).json({ message: "Invalid payload: favorite teams, markets, and league priority must be arrays" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === Recommendations (Mock Engine) ===
  app.get(api.recommendations.list.path, async (req, res) => {
    const tvs = await storage.getTvs();
    const games = await storage.getGames();
    
    // Simple mock logic: Find high relevance games not currently on Main TVs
    const recommendations = [];
    const mainTvs = tvs.filter(t => t.priority === 'Main');
    const prefs = await storage.getPreferences();
    
    const gamesWithScores = games.map(g => ({
      ...g,
      relevance: scoreGame(g, prefs)
    }));

    const liveGames = gamesWithScores.filter(g => g.status === 'Live' && (g.relevance ?? 0) > 70);

    // If there's a highly relevant game not on a main TV, suggest it
    for (const game of liveGames) {
        // Check if already on a main TV
        const isOnMain = mainTvs.some(tv => tv.currentGameId === game.id);
        if (!isOnMain && mainTvs.length > 0) {
            // Find a candidate TV (e.g. one not locked)
            const targetTv = mainTvs.find(tv => !tv.lockedUntil && tv.currentGameId !== game.id);
            if (targetTv) {
                recommendations.push({
                    tvId: targetTv.id,
                    gameId: game.id,
                    reason: `High relevance game (${game.relevance}) not shown on Main TV`,
                    score: game.relevance
                });
            }
        }
    }
    
    res.json(recommendations);
  });

  app.post(api.recommendations.apply.path, async (req, res) => {
    const { tvId, gameId } = req.body;
    const game = await storage.getGame(gameId);
    if (game) {
        // Resolve channel number based on provider
        const prefs = await storage.getPreferences();
        const providerId = (prefs as any)?.tvProviderId ?? null;
        let resolvedChannel = game.channel;
        
        if (providerId && game.channel) {
          const resolution = await resolveChannel([game.channel], providerId);
          if (resolution.resolvedChannelNumber) {
            resolvedChannel = `${resolution.resolvedNetwork} (Ch. ${resolution.resolvedChannelNumber})`;
          }
        }
        
        await storage.updateTv(tvId, {
            currentGameId: game.id,
            currentChannel: resolvedChannel,
            manualOverride: true
        });
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: "Game not found" });
    }
  });

  // === Manual Assignment ===
  app.post("/api/tvs/:tvId/assign-game", async (req, res) => {
    try {
      const tvId = Number(req.params.tvId);
      const { gameId } = req.body;
      
      const game = await storage.getGame(gameId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }

      // Resolve channel number based on provider
      const prefs = await storage.getPreferences();
      const providerId = (prefs as any)?.tvProviderId ?? null;
      let resolvedChannel = game.channel;
      
      if (providerId && game.channel) {
        const resolution = await resolveChannel([game.channel], providerId);
        if (resolution.resolvedChannelNumber) {
          resolvedChannel = `${resolution.resolvedNetwork} (Ch. ${resolution.resolvedChannelNumber})`;
        }
      }

      const updatedTv = await storage.updateTv(tvId, {
        currentGameId: game.id,
        currentChannel: resolvedChannel,
        manualOverride: true
      });

      res.json(updatedTv);
    } catch (error) {
      console.error("Manual assignment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // === Requests ===
  app.get(api.requests.list.path, async (_req, res) => {
    const requests = await storage.getTvRequests();
    res.json(requests);
  });

  app.post(api.requests.create.path, async (req, res) => {
    const input = api.requests.create.input.parse(req.body);
    const request = await storage.createTvRequest(input);
    res.status(201).json(request);
  });

  // === Beers ===
  app.post(api.beers.order.path, async (req, res) => {
    const input = api.beers.order.input.parse(req.body);
    const order = await storage.createBeerOrder(input.type, input.tableNumber);
    res.status(201).json(order);
  });

  // === TV Providers ===
  app.get("/api/providers", async (_req, res) => {
    const providers = await storage.getTvProviders();
    res.json(providers);
  });

  app.get("/api/providers/:id", async (req, res) => {
    const provider = await storage.getTvProvider(Number(req.params.id));
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  });

  // === Channel Resolution ===
  app.post("/api/resolve-channel", async (req, res) => {
    try {
      const { networks, providerId } = req.body;
      if (!networks || !Array.isArray(networks)) {
        return res.status(400).json({ message: "networks must be an array" });
      }
      const result = await resolveChannel(networks, providerId || null);
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Channel resolution failed" });
    }
  });

  // Seed Data on Startup
  seedDatabase();
  seedProviderData().catch(err => console.error("[Seed] Provider seed error:", err));

  return httpServer;
}

async function seedDatabase() {
    const tvs = await storage.getTvs();
    if (tvs.length === 0) {
        console.log("Seeding database...");
        
        // Seed TVs
        await storage.createTv({ name: "Bar Left 65", location: "Main Bar", priority: "Main", allowedChannels: ["ESPN", "TNT", "Local"], currentChannel: "ESPN", status: "active" });
        await storage.createTv({ name: "Bar Right 65", location: "Main Bar", priority: "Main", allowedChannels: ["ESPN", "TNT", "Local"], currentChannel: "TNT", status: "active" });
        await storage.createTv({ name: "Booth 1", location: "Booths", priority: "Secondary", allowedChannels: ["Local", "News"], currentChannel: "Local", status: "active" });
        await storage.createTv({ name: "Patio 1", location: "Patio", priority: "Overflow", allowedChannels: ["All"], currentChannel: "ESPN2", status: "active" });
        await storage.createTv({ name: "Patio 2", location: "Patio", priority: "Overflow", allowedChannels: ["All"], currentChannel: "NBATV", status: "active" });

        // Seed Games
        const now = new Date();
        const later = new Date(now.getTime() + 60 * 60 * 1000);
        
        await storage.createGame({ 
            title: "Lakers vs Warriors", 
            teamA: "Lakers", teamB: "Warriors", 
            league: "NBA", channel: "ESPN", 
            startTime: now, relevance: 95, status: "Live" 
        });
        
        await storage.createGame({ 
            title: "Chiefs vs Bills", 
            teamA: "Chiefs", teamB: "Bills", 
            league: "NFL", channel: "CBS", 
            startTime: now, relevance: 88, status: "Live" 
        });

        await storage.createGame({ 
            title: "Yankees vs Red Sox", 
            teamA: "Yankees", teamB: "Red Sox", 
            league: "MLB", channel: "FOX", 
            startTime: later, relevance: 75, status: "Scheduled" 
        });

        await storage.createGame({ 
            title: "Local News", 
            teamA: "", teamB: "", 
            league: "News", channel: "Local", 
            startTime: now, relevance: 10, status: "Live" 
        });
    }
}
