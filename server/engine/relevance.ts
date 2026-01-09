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
  const reasons: string[] = [];
  
  // 1. Base: Start with hotnessScore * 0.6
  let score = (game.hotnessScore || 0) * 0.6;

  if (!preferences) {
    return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
  }

  // 2. Additive Boosts
  
  // Home Team Boost (+15)
  const favoriteTeams = preferences.favoriteTeams ?? [];
  const hasFavoriteTeam = favoriteTeams.some(team => 
    team && (
      game.teamA?.toLowerCase().includes(team.toLowerCase()) || 
      game.teamB?.toLowerCase().includes(team.toLowerCase())
    )
  );
  if (hasFavoriteTeam) {
    score += 15;
    reasons.push("Includes a preferred home team");
  }

  // League Priority Boosts
  const leaguePriority = preferences.leaguePriority ?? ["NFL", "NBA", "MLB", "NHL"];
  const league = game.league?.toUpperCase() || "";
  const priorityIndex = leaguePriority.findIndex(l => l.toUpperCase() === league);
  
  if (priorityIndex === 0) {
    score += 10;
    reasons.push(`Top league priority (${league})`);
  } else if (priorityIndex === 1) {
    score += 5;
    reasons.push(`High league priority (${league})`);
  }

  // Platform Popularity Boost (+10 if assignedTvCount > 0)
  const assignedCount = stats?.[game.id] || 0;
  if (assignedCount > 0) {
    score += 10;
    reasons.push("Currently showing on venue TVs");
  }

  // Live Boost (+5)
  if (game.status === "Live") {
    score += 5;
    reasons.push("Live action");
  }

  // 3. Penalties
  
  // Scheduled Proximity Penalty (-15 if > 4 hours out)
  if (game.status === "Upcoming" || game.status === "Scheduled") {
    const now = new Date();
    const startTime = new Date(game.startTime);
    const diffHours = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours > 4) {
      score -= 15;
      reasons.push("Game is more than 4 hours away");
    }
  }

  // Lowest Priority Penalty (-10)
  if (priorityIndex !== -1 && priorityIndex === leaguePriority.length - 1) {
    score -= 10;
    reasons.push(`Lowest league priority (${league})`);
  }

  // 4. Guardrails: Clamp final score to 0–100 and round
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
