import { Request, Response } from "express";
import { storage } from "../storage";
import { scoreGame } from "../engine/relevance";
import { computeHotness } from "../engine/hotness";
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
    const gamesToProcess = sourceData.length > 0 
      ? sourceData.map((eg, idx) => ({
          id: -(idx + 1), // Negative IDs for external games to avoid conflicts
          title: `${eg.homeTeam} vs ${eg.awayTeam}`,
          teamA: eg.homeTeam,
          teamB: eg.awayTeam,
          league: eg.league,
          channel: eg.broadcastNetwork || "Unknown",
          startTime: new Date(eg.startTime),
          status: eg.isLive ? "Live" : "Scheduled",
          relevance: 0, // Will be scored below
          broadcastNetwork: eg.broadcastNetwork
        }))
      : mockGames;

    console.log(`[api/games] Serving from: ${dataSourceName} (${gamesToProcess.length} games)`);

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

      // MOCK DATA FOR MVP TESTING: Simulate game state for hotness calculation
      const mockFields = (g.id === 1 || g.id === -1) ? {
        scoreDiff: 3,        // Close game (+30)
        timeRemaining: 120,   // Late in game (+30)
        isOvertime: true      // Overtime (+40) -> Total 100
      } : {
        scoreDiff: 15,
        timeRemaining: 1200,
        isOvertime: false
      };

      return {
        ...g,
        ...mockFields,
        relevanceScore: scoreGame(g, prefs),
        hotnessScore: computeHotness({ ...g, ...mockFields }),
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
