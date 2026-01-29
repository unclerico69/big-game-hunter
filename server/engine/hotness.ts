import { TEAMS } from "../../shared/data/teams";

/**
 * Computes base hotness score derived only from game state.
 * Uses the simplified score-driven formula:
 * - Live games: +20
 * - Close score (<=7): +20, Very close (<=3): +30 additional
 * - Late game (<5 mins): +25
 * - Overtime: sets to 100
 * - Assigned TVs: +15 per TV
 * Returns a number between 0 and 100.
 */
export function computeBaseHotness(game: any): number {
  let hotness = 0;

  // Live game boost
  if (game.status === "Live") {
    hotness += 20;
  }

  // Score difference boost (additive)
  if (game.scoreDiff !== null && game.scoreDiff !== undefined) {
    if (game.scoreDiff <= 7) hotness += 20;
    if (game.scoreDiff <= 3) hotness += 30;
  }

  // Late game boost (under 5 minutes remaining)
  if (game.timeRemaining !== null && game.timeRemaining !== undefined && game.timeRemaining < 300) {
    hotness += 25;
  }

  // Overtime override - max hotness
  if (game.isOvertime === true) {
    hotness = 100;
  }

  // Platform popularity boost (+15 per assigned TV)
  const assignedCount = game.assignedTvCount || 0;
  hotness += assignedCount * 15;

  return Math.min(hotness, 100);
}

/**
 * Computes the final hotness score.
 * Hotness is now purely score-driven (game state only).
 * Preferences affect relevance, not hotness.
 * Returns a rounded integer between 0 and 100.
 */
export function computeFinalHotness(game: any, _preferences: any): number {
  return computeBaseHotness(game);
}

export function computeHotness(game: any): number {
  // Legacy function for backward compatibility
  return computeBaseHotness(game);
}
