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

// MVP Caching Strategy: Stale-while-revalidate pattern to respect free-tier limits
interface ApiCache {
  data: NormalizedGame[];
  lastFetched: number;
}

let oddsCache: ApiCache | null = null;
const CACHE_TTL = 90 * 60 * 1000; // 90 minutes in milliseconds

export async function fetchLiveGames(): Promise<NormalizedGame[]> {
  const now = Date.now();

  // Return cached data if valid
  if (oddsCache && (now - oddsCache.lastFetched) < CACHE_TTL) {
    console.log("Odds API: Serving from cache");
    return oddsCache.data;
  }

  if (!API_KEY) {
    console.error('ODDS_API_KEY is not defined in environment variables.');
    return oddsCache?.data || [];
  }

  try {
    console.log("Odds API: Fetching fresh data...");
    
    // Using a more reliable free-tier approach: fetch major sports
    const SPORT = 'americanfootball_nfl'; 
    const response = await fetch(`${BASE_URL}/${SPORT}/scores/?apiKey=${API_KEY}`);
    
    console.log(`Odds API Status: ${response.status}`);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Odds API error: ${response.status} ${response.statusText}`, errorBody);
      // Fallback to cache on error
      return oddsCache?.data || [];
    }

    const data = await response.json();
    console.log(`Odds API Response Length: ${Array.isArray(data) ? data.length : 'not an array'}`);
    
    if (!Array.isArray(data)) {
      return oddsCache?.data || [];
    }

    const normalizedData: NormalizedGame[] = data.map((game: any) => ({
      id: game.id,
      league: game.sport_title,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      startTime: game.commence_time,
      isLive: game.completed === false,
      broadcastNetwork: game.broadcast_network || game.network || (game.bookmakers?.[0]?.title) || null
    }));

    // Update cache
    oddsCache = {
      data: normalizedData,
      lastFetched: now
    };

    return normalizedData;
  } catch (error) {
    console.error('Failed to fetch from Odds API:', error);
    // Fallback to cache on error
    return oddsCache?.data || [];
  }
}
