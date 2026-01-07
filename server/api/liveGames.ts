import { Request, Response } from "express";
import { storage } from "../storage";
import { scoreGame } from "../engine/relevance";
import { computeHotness } from "../engine/hotness";

/**
 * GET /api/live-games
 * Returns a list of games with relevance scores and hotness scores based on venue preferences.
 */
export async function getLiveGames(req: Request, res: Response) {
  try {
    const games = await storage.getGames();
    const prefs = await storage.getPreferences();
    const stats = await storage.getPlatformStats();
    
    const liveGames = games
      .filter(g => g.status === 'Live')
      .map(g => ({
        ...g,
        relevanceScore: scoreGame(g, prefs),
        hotnessScore: computeHotness(g),
        assignedTvCount: stats[g.id] || 0
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    res.json(liveGames);
  } catch (error) {
    console.error("Error fetching live games:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
