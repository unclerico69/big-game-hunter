/**
 * Computes base hotness score derived only from game state.
 * Returns a number between 0 and 100.
 */
export function computeBaseHotness(game: any): number {
  let score = 30; // Start with a base score

  const now = new Date();
  const startTime = new Date(game.startTime);
  const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

  // Status-based boost
  if (game.status === "Live") {
    score += 30;
  }

  // Time-based proximity boost
  if (diffMinutes > 0) {
    if (diffMinutes <= 60) {
      score += 10;
    } else if (diffMinutes <= 180) {
      score += 5;
    }
  }

  // League-neutral popularity boost
  const leagueBoosts: Record<string, number> = {
    "NFL": 10,
    "NBA": 8,
    "NHL": 5,
    "MLB": 3
  };
  
  const league = game.league?.toUpperCase() || "";
  score += leagueBoosts[league] || 0;

  return Math.min(score, 100);
}

/**
 * Computes the final hotness score by applying venue preferences on top of base hotness.
 * Returns a rounded integer between 0 and 100.
 */
export function computeFinalHotness(game: any, preferences: any): number {
  let score = computeBaseHotness(game);

  if (!preferences) return Math.round(score);

  // 1. League Priority Multipliers
  const leaguePriority = preferences.leaguePriority || ["NFL", "NBA", "MLB", "NHL"];
  const league = game.league?.toUpperCase() || "";
  
  const multipliers = [1.25, 1.15, 1.05, 1.0];
  const leagueIndex = leaguePriority.findIndex((l: string) => l.toUpperCase() === league);
  
  // Apply multiplier if found in top 4, otherwise use 1.0
  const multiplier = (leagueIndex >= 0 && leagueIndex < multipliers.length) 
    ? multipliers[leagueIndex] 
    : 1.0;
    
  score *= multiplier;

  // 2. Home Teams Boost
  const favoriteTeams = preferences.favoriteTeams || [];
  const isFavorite = favoriteTeams.some((team: string) => 
    team.toLowerCase() === game.teamA?.toLowerCase() || 
    team.toLowerCase() === game.teamB?.toLowerCase()
  );

  if (isFavorite) {
    score += 20;
  }

  // Guardrails: Clamp 0-100 and round to integer
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeHotness(game: any): number {
  // Legacy function for backward compatibility
  return computeBaseHotness(game);
}
