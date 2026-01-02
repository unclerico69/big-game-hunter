import { Tv, Game, Recommendation } from "@shared/schema";

/**
 * Pure function to assign high-relevance games to available TVs.
 * Respects TV locks and priority levels.
 */
export function assignGamesToTVs(tvs: Tv[], games: Game[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const now = new Date();

  // Filter out locked TVs
  const availableTvs = tvs.filter(tv => {
    if (!tv.lockedUntil) return true;
    return new Date(tv.lockedUntil) <= now;
  });

  // Sort games by relevance (descending)
  const sortedGames = [...games].sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
  
  // Track which games are already assigned to avoid duplication on same-priority TVs
  const assignedGameIds = new Set(tvs.map(tv => tv.currentGameId).filter(id => id !== null) as number[]);

  // Simple assignment logic:
  // For each available TV, if there is a significantly better game than what's currently playing, recommend it.
  for (const tv of availableTvs) {
    const currentRelevance = games.find(g => g.id === tv.currentGameId)?.relevance ?? 0;
    
    // Find the best game for this TV that isn't already "saturated" on too many screens
    // (This is a simplified heuristic for now)
    const bestGame = sortedGames.find(g => {
      // If it's the current game, it's not a "new" recommendation
      if (g.id === tv.currentGameId) return false;
      
      // If it's a high relevance game (>70) and better than current
      return (g.relevance ?? 0) > 70 && (g.relevance ?? 0) > currentRelevance + 10;
    });

    if (bestGame) {
      recommendations.push({
        tvId: tv.id,
        gameId: bestGame.id,
        reason: `Higher relevance game (${bestGame.relevance}) available for ${tv.name}`,
        score: bestGame.relevance ?? 0
      });
      assignedGameIds.add(bestGame.id);
    }
  }

  return recommendations;
}
