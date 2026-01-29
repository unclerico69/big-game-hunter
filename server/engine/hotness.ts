import { TEAMS } from "../../shared/data/teams";

export interface HotnessResult {
  score: number;
  reasons: string[];
}

/**
 * Computes base hotness score derived only from game state.
 * Uses the simplified score-driven formula:
 * - Live games: +20
 * - Close score (<=7): +20, Very close (<=3): +30 additional
 * - Late game (<5 mins): +25
 * - Overtime: sets to 100
 * - Assigned TVs: +15 per TV
 * Returns score (0-100) and array of reasons.
 */
export function computeBaseHotnessWithReasons(game: any): HotnessResult {
  let hotness = 0;
  const reasons: string[] = [];

  // Live game boost
  if (game.status === "Live") {
    hotness += 20;
    reasons.push("Live game");
  }

  // Score difference boost (additive)
  if (game.scoreDiff !== null && game.scoreDiff !== undefined) {
    if (game.scoreDiff <= 3) {
      hotness += 50; // 20 + 30
      reasons.push("Close score");
    } else if (game.scoreDiff <= 7) {
      hotness += 20;
      reasons.push("Close score");
    }
  }

  // Late game boost (under 5 minutes remaining)
  if (game.timeRemaining !== null && game.timeRemaining !== undefined && game.timeRemaining < 300) {
    hotness += 25;
    reasons.push("Final minutes");
  }

  // Overtime override - max hotness
  if (game.isOvertime === true) {
    hotness = 100;
    reasons.push("Overtime");
  }

  // Platform popularity boost (+15 per assigned TV)
  const assignedCount = game.assignedTvCount || 0;
  if (assignedCount > 0) {
    hotness += assignedCount * 15;
    reasons.push("Popular across TVs");
  }

  return {
    score: Math.min(hotness, 100),
    reasons
  };
}

/**
 * Legacy function - returns just the score
 */
export function computeBaseHotness(game: any): number {
  return computeBaseHotnessWithReasons(game).score;
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
