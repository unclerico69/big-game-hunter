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
    const games = await storage.getGames();
    const prefs = await storage.getPreferences();
    const stats = await storage.getPlatformStats();
    
    // Fetch external enrichment data
    const externalGames = await fetchLiveGames();
    
    const liveGames = games
      .filter(g => g.status === 'Live')
      .map(g => {
        // Try to find matching game from external API to get broadcast network
        const externalMatch = externalGames.find(eg => 
          (eg.homeTeam === g.teamA && eg.awayTeam === g.teamB) ||
          (eg.homeTeam === g.teamB && eg.awayTeam === g.teamA)
        );

        return {
          ...g,
          relevanceScore: scoreGame(g, prefs),
          hotnessScore: computeHotness(g),
          assignedTvCount: stats[g.id] || 0,
          broadcastNetwork: externalMatch?.broadcastNetwork || null
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json(liveGames);
  } catch (error) {
    console.error("Error fetching live games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
