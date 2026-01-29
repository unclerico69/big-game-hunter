import { TEAMS } from "../../shared/data/teams";

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

    // Only apply score/time boosts if we have real data
    if (game.scoreDiff !== null && game.scoreDiff !== undefined) {
      // Score difference boost (Max +30)
      // Close games (0-7 points diff) get the most boost
      const diff = Math.abs(game.scoreDiff);
      if (diff <= 3) score += 30;
      else if (diff <= 7) score += 20;
      else if (diff <= 14) score += 10;
    }

    // Time-based boost (Max +30)
    // Late in game (under 5 mins remaining or deep in periods)
    if (game.timeRemaining !== null && game.timeRemaining !== undefined) {
      if (game.timeRemaining <= 300) score += 30; // 5 mins left
      else if (game.timeRemaining <= 600) score += 15; // 10 mins left
    } else if (game.period) {
      const p = game.period.toLowerCase();
      if (p.includes("4th") || p.includes("2nd half") || p.includes("3rd period")) score += 20;
    }

    // Overtime boost - only if explicitly true
    if (game.isOvertime === true) {
      score += 40;
    }
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
    "MLB": 3,
    "NCAA_FB": 7,
    "NCAA_MBB": 6,
    "NCAA_WBB": 4
  };
  
  const league = game.league?.toUpperCase() || "";
  score += leagueBoosts[league] || 0;

  // College specific logic
  if (game.isCollege) {
    // High scoring college basketball boost
    if ((league === "NCAA_MBB" || league === "NCAA_WBB") && game.status === "Live") {
      const totalScore = (game.homeScore || 0) + (game.awayScore || 0);
      if (totalScore > 140) score += 5;
    }
  }

  return Math.min(score, 100);
}

/**
 * Computes the final hotness score by applying venue preferences on top of base hotness.
 * Returns a rounded integer between 0 and 100.
 */
export function computeFinalHotness(game: any, preferences: any): number {
  const baseScore = computeBaseHotness(game);
  let score = baseScore;

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
  const isFavorite = favoriteTeams.some((fav: any) => {
    const teamData = TEAMS.find(t => t.id === fav.id);
    if (!teamData) return false;
    return teamData.name.toLowerCase() === game.teamA?.toLowerCase() || 
           teamData.name.toLowerCase() === game.teamB?.toLowerCase();
  });

  let homeBoost = 0;
  if (isFavorite) {
    homeBoost = 20;
    score += homeBoost;
  }

  // 3. Assigned TVs Boost (+15 per TV)
  const assignedCount = game.assignedTvCount || 0;
  if (assignedCount > 0) {
    const platformBoost = assignedCount * 15;
    score += platformBoost;
    console.log(`[hotness] ${game.title}: PlatformBoost=+${platformBoost}`);
  }

  // Minimal logging for debugging
  console.log(`[hotness] ${game.title}: Base=${baseScore.toFixed(1)}, LeagueMult=${multiplier}x, HomeBoost=+${homeBoost}, Final=${Math.round(score)}`);

  // Guardrails: Clamp 0-100 and round to integer
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeHotness(game: any): number {
  // Legacy function for backward compatibility
  return computeBaseHotness(game);
}
