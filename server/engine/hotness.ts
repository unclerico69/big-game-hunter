import { TEAMS } from "../../shared/data/teams";

export interface HotnessResult {
  score: number;
  reasons: string[];
}

/**
 * New Hotness Algorithm (Simple, Expressive)
 * 
 * Step 1: Zero the Baseline - hotness = 0
 * Step 2: Status Gate - Scheduled games capped at 40
 * Step 3: Live Game Core - Live adds +25
 */
export function computeBaseHotnessWithReasons(game: any): HotnessResult {
  let hotness = 0;
  const reasons: string[] = [];

  // Step 1: Zero the Baseline
  // No league, no preference, no hype yet.

  // Step 2: Status Gate (Critical)
  // Scheduled games can never exceed 40
  if (game.status === "Scheduled" || game.status === "Upcoming") {
    const now = new Date();
    const startTime = new Date(game.startTime);
    const timeUntilStart = (startTime.getTime() - now.getTime()) / 1000; // seconds

    if (timeUntilStart > 60 * 60) {
      // More than 60 minutes away
      return { score: 10, reasons: ["Scheduled (>1hr away)"] };
    }
    if (timeUntilStart > 30 * 60) {
      // 30-60 minutes away
      return { score: 20, reasons: ["Starting within the hour"] };
    }
    if (timeUntilStart > 10 * 60) {
      // 10-30 minutes away
      return { score: 30, reasons: ["Starting soon"] };
    }
    // Less than 10 minutes away
    return { score: 40, reasons: ["About to start"] };
  }

  // Step 3: Live Game Core
  // Live ≠ hot — just eligible for more hotness
  if (game.status === "Live") {
    hotness += 25;
    reasons.push("Live game");
  }

  // Score difference boost (additive)
  if (game.scoreDiff !== null && game.scoreDiff !== undefined) {
    if (game.scoreDiff <= 3) {
      hotness += 30;
      reasons.push("Nail-biter");
    } else if (game.scoreDiff <= 7) {
      hotness += 15;
      reasons.push("Close game");
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
    reasons.length = 0;
    reasons.push("Overtime");
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
