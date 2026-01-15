import { Request, Response } from "express";
import { storage } from "../storage";
import { calculateRelevance } from "../engine/relevance";
import { computeBaseHotness, computeFinalHotness } from "../engine/hotness";
import { fetchLiveGames } from "../integrations/oddsApi";
import { fetchAllNcaaGames } from "../services/espnNcaaApi";

/**
 * GET /api/live-games
 * Returns a list of games with relevance scores, hotness scores, and broadcast network info.
 */
export async function getLiveGames(req: Request, res: Response) {
  try {
    const mockGames = await storage.getGames();
    const prefs = await storage.getPreferences();
    const stats = await storage.getPlatformStats();
    
    // Fetch from all sources in parallel
    const [externalGames, ncaaGames] = await Promise.all([
      fetchLiveGames(),
      fetchAllNcaaGames()
    ]);
    
    let sourceData = externalGames.length > 0 ? externalGames : [];
    let dataSourceName = externalGames.length > 0 ? "Odds API" : "Mock Fallback";

    // Process Pro Games
    const now = new Date();
    const proGamesProcessed = await Promise.all(sourceData.map(async (eg, idx) => {
      const startTime = new Date(eg.startTime);
      const hasStarted = startTime <= now;
      const status = (hasStarted && eg.isLive) ? "Live" : "Upcoming";

      const title = `${eg.homeTeam} vs ${eg.awayTeam}`;
      const existingGames = await storage.getGames();
      
      let dbGame = existingGames.find(g => 
        g.title === title && 
        Math.abs(g.startTime.getTime() - startTime.getTime()) < 60000
      );
      
      if (!dbGame) {
        dbGame = await storage.createGame({
          title,
          teamA: eg.homeTeam,
          teamB: eg.awayTeam,
          league: eg.league,
          channel: eg.broadcastNetwork || "Unknown",
          startTime,
          status,
          relevance: 0,
          assignedTvCount: 0
        });
      } else if (dbGame.status !== status) {
        await storage.updateGameStatus(dbGame.id, status);
        dbGame.status = status;
      }

      return {
        ...dbGame,
        broadcastNetwork: eg.broadcastNetwork,
        isCollege: false
      };
    }));

    // Process NCAA Games
    const processedNcaaGames = await Promise.all(ncaaGames.map(async (ng) => {
      const title = `${ng.homeTeam} vs ${ng.awayTeam}`;
      const existingGames = await storage.getGames();
      
      let dbGame = existingGames.find(g => 
        g.title === title && 
        Math.abs(g.startTime.getTime() - ng.startTime.getTime()) < 60000
      );
      
      if (!dbGame) {
        dbGame = await storage.createGame({
          title,
          teamA: ng.homeTeam,
          teamB: ng.awayTeam,
          league: ng.league,
          channel: "ESPN",
          startTime: ng.startTime,
          status: ng.status,
          relevance: 0,
          assignedTvCount: 0
        });
      } else if (dbGame.status !== ng.status) {
        await storage.updateGameStatus(dbGame.id, ng.status);
        dbGame.status = ng.status;
      }

      return {
        ...dbGame,
        scoreDiff: Math.abs(ng.homeScore - ng.awayScore),
        timeRemaining: ng.timeRemaining,
        isOvertime: ng.isOvertime,
        isCollege: true,
        broadcastNetwork: "ESPN"
      };
    }));

    const gamesToProcess = proGamesProcessed.length > 0 ? [...proGamesProcessed, ...processedNcaaGames] : [...processedNcaaGames, ...mockGames.map(g => ({ ...g, isCollege: false }))];

    const tvIdParam = req.query.tvId;
    const tvContext = tvIdParam ? await storage.getTv(Number(tvIdParam)) : null;

    const processedGames = gamesToProcess.map(g => {
      const isLive = g.status === "Live";
      
      // MOCK DATA for Pro games if they don't have real-time scores yet
      const mockFields = (isLive && !g.isCollege) ? ((g.id === 1 || g.id === -1) ? {
        scoreDiff: 3,
        timeRemaining: 120,
        isOvertime: true
      } : {
        scoreDiff: 15,
        timeRemaining: 1200,
        isOvertime: false
      }) : {
        scoreDiff: (g as any).scoreDiff ?? null,
        timeRemaining: (g as any).timeRemaining ?? null,
        isOvertime: (g as any).isOvertime ?? false
      };

      const gameForScoring = { 
        ...g, 
        ...mockFields,
        assignedTvCount: stats[g.id] || 0 
      };

      const hotnessScore = computeFinalHotness(gameForScoring, prefs);
      const relevanceResult = calculateRelevance(
        { ...gameForScoring, hotnessScore }, 
        prefs, 
        stats,
        tvContext ? { lastUpdated: tvContext.lastUpdated } : undefined
      );

      return {
        ...g,
        ...mockFields,
        relevanceScore: relevanceResult.score,
        reasons: relevanceResult.reasons,
        hotnessScore,
        assignedTvCount: stats[g.id] || 0
      };
    });

    const liveGames = processedGames
      .filter(g => g.status === 'Live')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
      
    const otherGames = processedGames
      .filter(g => g.status !== 'Live')
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json([...liveGames, ...otherGames]);
  } catch (error) {
    console.error("Error fetching live games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
