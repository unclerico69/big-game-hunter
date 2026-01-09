import { Game, Preference } from "@shared/schema";
import { TEAMS } from "../../shared/data/teams";
import { MARKETS } from "../../shared/data/markets";

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
  
  // Structured Team Boost
  const favoriteTeams = (preferences.favoriteTeams as any[]) ?? [];
  const matchedFavorite = favoriteTeams.find(fav => {
    const teamData = TEAMS.find(t => t.id === fav.id);
    if (!teamData) return false;
    return (
      game.teamA?.toLowerCase().includes(teamData.name.toLowerCase()) || 
      game.teamB?.toLowerCase().includes(teamData.name.toLowerCase())
    );
  });

  if (matchedFavorite) {
    const teamData = TEAMS.find(t => t.id === matchedFavorite.id);
    const priority = matchedFavorite.priority || 0;
    const boost = 25 - (priority * 2); // Priority 0 = +25, Priority 5 = +15
    score += Math.max(5, boost);
    reasons.push(`Preferred team (${teamData?.name})`);
  }

  // Market Boost
  const favoriteMarkets = (preferences.favoriteMarkets as any[]) ?? [];
  // Find markets associated with the teams in this game
  const gameTeamIds = TEAMS.filter(t => 
    game.teamA?.toLowerCase().includes(t.name.toLowerCase()) || 
    game.teamB?.toLowerCase().includes(t.name.toLowerCase())
  ).map(t => t.market);

  const matchedMarketFav = favoriteMarkets.find(fav => gameTeamIds.includes(fav.id));

  if (matchedMarketFav) {
    const marketData = MARKETS.find(m => m.id === matchedMarketFav.id);
    const priority = matchedMarketFav.priority || 0;
    const boost = 15 - priority;
    score += Math.max(5, boost);
    reasons.push(`Local interest (${marketData?.name})`);
  }

  // League Priority Boosts
  const leaguePriority = preferences.leaguePriority ?? ["NFL", "NBA", "MLB", "NHL"];
  const league = game.league?.toUpperCase() || "";
  const priorityIndex = leaguePriority.findIndex(l => l.toUpperCase() === league);
  
  if (priorityIndex === 0) {
    score += 10;
    reasons.push(`High league priority (${league})`);
  } else if (priorityIndex === 1) {
    score += 5;
    reasons.push(`Preferred league (${league})`);
  }

  // Platform Popularity Boost (+10 if assignedTvCount > 0)
  const assignedCount = stats?.[game.id] || 0;
  if (assignedCount > 0) {
    score += 10;
    reasons.push("Popular with other TVs");
  }

  // Live Boost (+5)
  const now = new Date();
  const startTime = new Date(game.startTime);
  const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

  if (game.status === "Live") {
    score += 5;
    reasons.push("Live game");
  } else if (diffMinutes > 0 && diffMinutes <= 60) {
    reasons.push("Starting soon");
  }

  // Hotness Boost
  if (game.hotnessScore > 80) {
    reasons.push("High in-game excitement");
  }

  // 3. Penalties
  
  // Scheduled Proximity Penalty (-15 if > 4 hours out)
  if (game.status === "Upcoming" || game.status === "Scheduled") {
    const diffHours = diffMinutes / 60;
    if (diffHours > 4) {
      score -= 15;
      reasons.push("Game is more than 4 hours away");
    }
  }

  // Lowest Priority Penalty (-10)
  if (priorityIndex !== -1 && priorityIndex === leaguePriority.length - 1) {
    score -= 10;
  }

  // 4. Guardrails: Clamp final score to 0–100 and round
  // Importance-based sorting (Home Team > Priority > Live > Popularity > Hotness)
  const sortedReasons = reasons.sort((a, b) => {
    const order = ["preferred home team", "league priority", "Live game", "Starting soon", "Popular with", "excitement"];
    const indexA = order.findIndex(o => a.includes(o));
    const indexB = order.findIndex(o => b.includes(o));
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reasons: sortedReasons.slice(0, 4)
  };
}

/**
 * Legacy wrapper for backward compatibility
 */
export function scoreGame(game: Game, preferences?: Preference): number {
  return calculateRelevance(game, preferences).score;
}
