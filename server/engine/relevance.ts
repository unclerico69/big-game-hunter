import { Game, Preference } from "@shared/schema";

/**
 * Pure function to calculate game relevance score based on venue preferences.
 * Returns a score between 0 and 100.
 */
export function scoreGame(game: Game, preferences?: Preference): number {
  let score = game.relevance ?? 0;

  if (!preferences) return score;

  // Boost for favorite teams
  const teams = [game.teamA, game.teamB];
  const favoriteTeams = preferences.favoriteTeams ?? [];
  
  const hasFavoriteTeam = teams.some(team => 
    team && favoriteTeams.some(fav => team.toLowerCase().includes(fav.toLowerCase()))
  );

  if (hasFavoriteTeam) {
    score += 50;
  }

  // Multiplier for league priority
  const leaguePriority = preferences.leaguePriority ?? [];
  const priorityIndex = leaguePriority.indexOf(game.league);
  
  if (priorityIndex !== -1) {
    // Top priority (index 0) gets most boost
    const boost = (leaguePriority.length - priorityIndex) * 5;
    score += boost;
  }

  // Hard rules (e.g., "Never show News on Main Bar")
  // This is a placeholder for more complex rule logic
  
  return Math.min(100, score);
}
