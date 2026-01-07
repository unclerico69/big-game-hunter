import { Game } from "@shared/schema";

/**
 * Pure function to calculate game "hotness" based on platform-wide engagement.
 * Returns a score between 0 and 100.
 */
export function computeHotness(game: Game, platformStats?: any): number {
  // Base hotness is related to relevance
  let hotness = (game.relevance ?? 0) * 0.8;

  // Simulate platform engagement (e.g. how many other bars are watching this)
  // Since we aren't storing stats yet, we use a deterministic "hotness"
  // based on the game ID to ensure stability across polling.
  const pseudoEngagement = (game.id * 13) % 20;
  hotness += pseudoEngagement;

  // League specific multipliers
  if (game.league === "NFL") hotness += 10;
  if (game.league === "NBA") hotness += 5;

  return Math.min(100, Math.round(hotness));
}
