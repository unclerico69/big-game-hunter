import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scoreGame } from "./engine/relevance";
import { getLiveGames } from "./api/liveGames";
import { listLocks, createLock } from "./api/locks";

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

  app.get(api.games.list.path, getLiveGames);

  // === Locks ===
  app.get("/api/locks", listLocks);
  app.post("/api/locks", createLock);

  // === Preferences ===
  app.get(api.preferences.get.path, async (req, res) => {
    let prefs = await storage.getPreferences();
    if (!prefs) {
        // Return defaults if none exist
        prefs = await storage.updatePreferences({
            venueId: 1,
            favoriteTeams: [],
            favoriteMarkets: [],
            leaguePriority: ["NFL", "NBA", "MLB", "NHL"],
            preventRapidSwitching: true
        });
    }
    res.json(prefs);
  });

  app.post(api.preferences.update.path, async (req, res) => {
    const input = api.preferences.update.input.parse(req.body);
    const prefs = await storage.updatePreferences(input);
    res.json(prefs);
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
        await storage.updateTv(tvId, {
            currentGameId: game.id,
            currentChannel: game.channel,
            manualOverride: true // Explicitly disable auto-tuner
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

      const updatedTv = await storage.updateTv(tvId, {
        currentGameId: game.id,
        currentChannel: game.channel,
        manualOverride: true // Disable auto-tuner for this TV
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

  // Seed Data on Startup
  seedDatabase();

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
