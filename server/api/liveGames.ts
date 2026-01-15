import { Request, Response } from "express";
import { storage } from "../storage";
import { calculateRelevance } from "../engine/relevance";
import { computeBaseHotness, computeFinalHotness } from "../engine/hotness";
import { fetchLiveGames } from "../integrations/oddsApi";

/**
 * GET /api/live-games
 * Returns a list of games with relevance scores, hotness scores, and broadcast network info.
 */
export async function getLiveGames(req: Request, res: Response) {
  try {
    const mockGames = await storage.getGames();
    const prefs = await storage.getPreferences();
    const stats = await storage.getPlatformStats();
    
    // Fetch external enrichment data (Cached within Odds API integration)
    const externalGames = await fetchLiveGames();
    
    let sourceData = externalGames.length > 0 ? externalGames : [];
    let dataSourceName = externalGames.length > 0 ? "Odds API" : "Mock Fallback";

    // If we have Odds API data, we prefer it. 
    // If not, we fall back to mock games for development/testing.
    const now = new Date();
    const gamesToProcess = sourceData.length > 0 
      ? await Promise.all(sourceData.map(async (eg, idx) => {
          const startTime = new Date(eg.startTime);
          const hasStarted = startTime <= now;
          // Determine status based on schedule and live flag
          const status = (hasStarted && eg.isLive) ? "Live" : "Upcoming";

          // UPSERT game into database so it has a real ID for assignment
          const title = `${eg.homeTeam} vs ${eg.awayTeam}`;
          const existingGames = await storage.getGames();
          
          // Match by title and start time (within a small window to handle precision issues)
          let dbGame = existingGames.find(g => 
            g.title === title && 
            Math.abs(g.startTime.getTime() - startTime.getTime()) < 60000
          );
          
          if (!dbGame) {
            console.log(`[api/games] Creating persistent record for: ${title}`);
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
          } else {
            // Update status if it changed
            if (dbGame.status !== status) {
              await storage.updateGameStatus(dbGame.id, status);
              dbGame.status = status;
            }
          }

          return {
            ...dbGame,
            broadcastNetwork: eg.broadcastNetwork
          };
        }))
      : mockGames.map(g => {
          const startTime = new Date(g.startTime);
          const hasStarted = startTime <= now;
          return {
            ...g,
            status: hasStarted ? "Live" : "Upcoming"
          };
        });

    console.log(`[api/games] Serving from: ${dataSourceName} (${gamesToProcess.length} games)`);

    const tvIdParam = req.query.tvId;
    const tvContext = tvIdParam ? await storage.getTv(Number(tvIdParam)) : null;

    // Process games and mock them with relevance/hotness for MVP
    const processedGames = gamesToProcess.map(g => {
      // If using mock games, we still try to enrich with broadcast network if available
      let broadcastNetwork = (g as any).broadcastNetwork || null;
      if (dataSourceName === "Mock Fallback") {
        const externalMatch = externalGames.find(eg => 
          (eg.homeTeam === g.teamA && eg.awayTeam === g.teamB) ||
          (eg.homeTeam === g.teamB && eg.awayTeam === g.teamA)
        );
        broadcastNetwork = externalMatch?.broadcastNetwork || null;
      }

      const isLive = g.status === "Live";

      // MOCK DATA FOR MVP TESTING: Simulate game state for hotness calculation
      // Only apply mock score/time fields if the game is Live
      const mockFields = isLive ? ((g.id === 1 || g.id === -1) ? {
        scoreDiff: 3,        // Close game (+30)
        timeRemaining: 120,   // Late in game (+30)
        isOvertime: true      // Overtime (+40) -> Total 100
      } : {
        scoreDiff: 15,
        timeRemaining: 1200,
        isOvertime: false
      }) : {
        scoreDiff: null,
        timeRemaining: null,
        isOvertime: false
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
        assignedTvCount: stats[g.id] || 0,
        broadcastNetwork
      };
    });

    // Group by status but maintain relevance sorting for Live games
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
