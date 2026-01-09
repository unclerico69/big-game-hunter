import { Game, Preference } from "@shared/schema";

export interface RelevanceResult {
  score: number;
  reasons: string[];
}

/**
 * Pure function to calculate game relevance score and generate human-readable reasons.
 * Combines hotness, preferences, and platform signals.
 */
export function calculateRelevance(game: any, preferences?: Preference, stats?: Record<number, number>): RelevanceResult {
  let score = 0;
  const reasons: string[] = [];

  // 1. Status Base
  if (game.status === "Live") {
    score += 40;
    reasons.push("Live game");
  } else if (game.status === "Upcoming") {
    score += 10;
    reasons.push("Upcoming game");
  }

  if (!preferences) {
    return { score: Math.min(100, score), reasons };
  }

  // 2. League Priority
  const leaguePriority = preferences.leaguePriority ?? ["NFL", "NBA", "MLB", "NHL"];
  const league = game.league?.toUpperCase() || "";
  const priorityIndex = leaguePriority.findIndex(l => l.toUpperCase() === league);
  
  if (priorityIndex !== -1) {
    // Top 2 leagues get significant boosts
    if (priorityIndex === 0) {
      score += 30;
      reasons.push(`High league priority (${league})`);
    } else if (priorityIndex === 1) {
      score += 20;
      reasons.push(`Preferred league (${league})`);
    } else {
      score += 10;
      reasons.push(`Standard league (${league})`);
    }
  }

  // 3. Favorite Teams
  const favoriteTeams = preferences.favoriteTeams ?? [];
  const hasFavoriteTeam = favoriteTeams.some(team => 
    team && (
      game.teamA?.toLowerCase().includes(team.toLowerCase()) || 
      game.teamB?.toLowerCase().includes(team.toLowerCase())
    )
  );

  if (hasFavoriteTeam) {
    score += 30;
    reasons.push("Includes a preferred home team");
  }

  // 4. Platform Popularity (Social Signal)
  const assignedCount = stats?.[game.id] || 0;
  if (assignedCount >= 2) {
    score += 10;
    reasons.push("Highly watched by other TVs");
  } else if (assignedCount === 1) {
    score += 5;
    reasons.push("Currently showing on another TV");
  }

  // 5. Hotness Influence (capped contribution to relevance)
  if (game.hotnessScore > 80) {
    score += 15;
    reasons.push("High excitement level");
  }

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons: reasons.slice(0, 4) // Keep reasons concise
  };
}

/**
 * Legacy wrapper for backward compatibility
 */
export function scoreGame(game: Game, preferences?: Preference): number {
  return calculateRelevance(game, preferences).score;
}
