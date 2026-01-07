/**
 * Odds API Integration for Big Game Hunter
 * Fetches live sporting events and broadcast network metadata.
 */

const API_KEY = process.env.ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export interface NormalizedGame {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  isLive: boolean;
  broadcastNetwork: string | null;
}

export async function fetchLiveGames(): Promise<NormalizedGame[]> {
  if (!API_KEY) {
    console.error('ODDS_API_KEY is not defined in environment variables.');
    return [];
  }

  try {
    // Note: In a real implementation, we would call the actual endpoint.
    // For this task, we implement the structure to call the Odds API.
    // The Odds API usually provides event data including 'bookmakers' or 'scores'.
    // Broadcast info is sometimes in the 'extra' or specific metadata fields if available.
    
    // Example endpoint for scores/live:
    // GET /v4/sports/upcoming/scores/?apiKey={apiKey}&daysFrom=1
    
    const response = await fetch(`${BASE_URL}/upcoming/scores/?apiKey=${API_KEY}&daysFrom=1`);
    
    if (!response.ok) {
      console.error(`Odds API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((game: any) => ({
      id: game.id,
      league: game.sport_title,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      startTime: game.commence_time,
      isLive: game.completed === false,
      // Broadcast network info is often sparsely available or needs specific mapping
      // Here we look for common metadata locations or return null if unknown
      broadcastNetwork: game.broadcast_network || game.network || null
    }));
  } catch (error) {
    console.error('Failed to fetch from Odds API:', error);
    return [];
  }
}
