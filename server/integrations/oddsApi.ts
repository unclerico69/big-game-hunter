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
    const SPORTS = ['americanfootball_nfl', 'icehockey_nhl', 'basketball_nba', 'baseball_mlb']; 
    const normalizedData: NormalizedGame[] = [];

    for (const sport of SPORTS) {
      const response = await fetch(`${BASE_URL}/${sport}/scores/?apiKey=${API_KEY}`);
      console.log(`Odds API Status for ${sport}: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const sportNormalized = data.map((game: any) => ({
            id: game.id,
            league: game.sport_title,
            homeTeam: game.home_team,
            awayTeam: game.away_team,
            startTime: game.commence_time,
            isLive: game.completed === false,
            broadcastNetwork: game.broadcast_network || game.network || (game.bookmakers?.[0]?.title) || null
          }));
          normalizedData.push(...sportNormalized);
        }
      }
    }

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
