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
    // Using /v4/sports/upcoming/scores endpoint often requires a specific sport key.
    // Switching to /v4/sports which is free and quota-safe to test connectivity,
    // or /v4/sports/americanfootball_nfl/scores if we want scores.
    // The previous 404 was likely because /upcoming/scores isn't a valid path; it's /sports/{sport}/scores.
    
    // Using a more reliable free-tier approach: fetch all in-season sports first or a specific major one
    const SPORT = 'americanfootball_nfl'; 
    const response = await fetch(`${BASE_URL}/${SPORT}/scores/?apiKey=${API_KEY}`);
    
    console.log(`Odds API Status: ${response.status}`);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Odds API error: ${response.status} ${response.statusText}`, errorBody);
      return [];
    }

    const data = await response.json();
    console.log(`Odds API Response Length: ${Array.isArray(data) ? data.length : 'not an array'}`);
    
    if (!Array.isArray(data)) {
      return [];
    }

    // Broadcast network info is often sparsely available or needs specific mapping
    // We attempt to find it in common metadata locations
    return data.map((game: any) => ({
      id: game.id,
      league: game.sport_title,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      startTime: game.commence_time,
      isLive: game.completed === false,
      broadcastNetwork: game.broadcast_network || game.network || (game.bookmakers?.[0]?.title) || null
    }));
  } catch (error) {
    console.error('Failed to fetch from Odds API:', error);
    return [];
  }
}
