import { Game, Preference } from "@shared/schema";
import { TEAMS, matchTeamByName, getTeamById } from "../../shared/data/teams";
import { MARKETS, getMarketById } from "../../shared/data/markets";
import { LEAGUES, getLeagueById, getDefaultLeaguePriority, isCollegeLeague } from "../../shared/data/leagues";

export interface RelevanceResult {
  score: number;
  reasons: string[];
}

/**
 * Pure function to calculate game relevance score and generate human-readable reasons.
 * Combines hotness, preferences, and platform signals.
 * 
 * Scoring weights:
 * - Preferred team match: +40 (with priority decay)
 * - Preferred market match: +25 (with priority decay)
 * - League priority: +15 to +2 based on position
 * - College boost: +10 for NCAA games
 * - Live game: +5
 * - Hotness factor: hotnessScore * 0.4
 */
export function calculateRelevance(
  game: any,
  preferences?: Preference,
  stats?: Record<number, number>,
  tvContext?: { lastUpdated?: Date | null }
): RelevanceResult {
  const reasons: string[] = [];
  
  // 1. Base: Start with hotnessScore * 0.4
  let score = (game.hotnessScore || 0) * 0.4;

  if (!preferences) {
    return { score: Math.max(0, Math.min(100, Math.round(score))), reasons };
  }

  // Rapid Switching Penalty
  if (preferences.preventRapidSwitching && tvContext?.lastUpdated) {
    const lastUpdated = new Date(tvContext.lastUpdated);
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdated.getTime()) / (1000 * 60);
    
    if (diffMinutes < 15) {
      score -= 20;
      reasons.push("Recently updated (preventing rapid flipping)");
    }
  }

  // 2. Additive Boosts
  
  // Match game teams to structured team IDs
  const teamAMatch = matchTeamByName(game.teamA || "");
  const teamBMatch = matchTeamByName(game.teamB || "");
  const gameTeamIds = [teamAMatch?.id, teamBMatch?.id].filter(Boolean) as string[];
  const gameMarketIds = [teamAMatch?.marketId, teamBMatch?.marketId].filter(Boolean) as string[];

  // Preferred Teams Boost (+40 base with priority decay)
  const favoriteTeams = (preferences.favoriteTeams as { id: string; priority: number }[]) ?? [];
  const preferredTeamIds = favoriteTeams.map(t => t.id);
  
  const matchedTeamFav = favoriteTeams.find(fav => gameTeamIds.includes(fav.id));
  if (matchedTeamFav) {
    const teamData = getTeamById(matchedTeamFav.id);
    const priority = matchedTeamFav.priority ?? 0;
    // Priority 0 = +40, Priority 1 = +35, Priority 2 = +30, etc.
    const boost = Math.max(10, 40 - (priority * 5));
    score += boost;
    reasons.push(`Home team: ${teamData?.name || matchedTeamFav.id} (+${boost})`);
  }

  // Preferred Markets Boost (+25 base with priority decay)
  const favoriteMarkets = (preferences.favoriteMarkets as { id: string; priority: number }[]) ?? [];
  const preferredMarketIds = favoriteMarkets.map(m => m.id);
  
  const matchedMarketFav = favoriteMarkets.find(fav => gameMarketIds.includes(fav.id));
  if (matchedMarketFav) {
    const marketData = getMarketById(matchedMarketFav.id);
    const priority = matchedMarketFav.priority ?? 0;
    // Priority 0 = +25, Priority 1 = +22, Priority 2 = +19, etc.
    const boost = Math.max(5, 25 - (priority * 3));
    score += boost;
    reasons.push(`Local market: ${marketData?.name || matchedMarketFav.id} (+${boost})`);
  }

  // League Priority Boost (including NCAA leagues)
  const leaguePriority = preferences.leaguePriority?.length 
    ? preferences.leaguePriority 
    : getDefaultLeaguePriority();
  
  const gameLeagueId = game.league?.toUpperCase() || "";
  const leagueData = getLeagueById(gameLeagueId);
  const priorityIndex = leaguePriority.findIndex(l => l.toUpperCase() === gameLeagueId);
  const totalLeagues = leaguePriority.length || 7;
  
  // Calculate league priority weight: Top league = +15, decreasing by position
  if (priorityIndex !== -1) {
    const leagueWeight = Math.max(2, 15 - (priorityIndex * 2));
    score += leagueWeight;
    if (priorityIndex <= 2) {
      reasons.push(`${leagueData?.shortName || gameLeagueId} priority #${priorityIndex + 1} (+${leagueWeight})`);
    }
  }

  // College Boost (+10 for NCAA games)
  const isCollegeGame = leagueData?.isCollege || isCollegeLeague(gameLeagueId);
  if (isCollegeGame) {
    score += 10;
    reasons.push("College game boost (+10)");
  }

  // Platform Popularity Boost (+8 if assigned to other TVs)
  const assignedCount = stats?.[game.id] || 0;
  if (assignedCount > 0) {
    score += 8;
    reasons.push(`Popular (${assignedCount} other TVs)`);
  }

  // Live Boost (+5)
  const now = new Date();
  const startTime = new Date(game.startTime);
  const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

  if (game.status === "Live") {
    score += 5;
    reasons.push("Live now");
  } else if (diffMinutes > 0 && diffMinutes <= 30) {
    score += 3;
    reasons.push("Starting soon");
  }

  // Hotness indicator (for display, not scoring - already factored into base)
  if (game.hotnessScore > 80) {
    reasons.push("High excitement");
  }

  // 3. Penalties
  
  // Scheduled Proximity Penalty (-15 if > 4 hours out)
  if (game.status === "Upcoming" || game.status === "Scheduled") {
    const diffHours = diffMinutes / 60;
    if (diffHours > 4) {
      score -= 15;
      reasons.push("More than 4 hours away");
    } else if (diffHours > 2) {
      score -= 5;
    }
  }

  // Lowest Priority League Penalty (-8)
  if (priorityIndex !== -1 && priorityIndex === totalLeagues - 1) {
    score -= 8;
  }

  // 4. Sort reasons by importance
  const reasonPriority = ["Home team", "Local market", "priority", "College", "Live", "Starting", "Popular", "excitement"];
  const sortedReasons = reasons.sort((a, b) => {
    const indexA = reasonPriority.findIndex(o => a.includes(o));
    const indexB = reasonPriority.findIndex(o => b.includes(o));
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  // 5. Clamp final score to 0–100 and round
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
