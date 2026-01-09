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

export function computeHotness(game: any): number {
  // Legacy function for backward compatibility if needed elsewhere
  return computeBaseHotness(game);
}
