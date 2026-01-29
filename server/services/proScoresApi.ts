export interface NormalizedGame {
  league: string;
  isCollege: boolean;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "Scheduled" | "Live" | "Final";
  period: string;
  timeRemaining: number | null;
  isOvertime: boolean;
  startTime: Date;
}

const API_KEY = process.env.API_SPORTS_KEY;
const BASE_URL = "https://v1.basketball.api-sports.io"; // Note: API-Sports has different subdomains per sport

async function fetchFromApiSports(endpoint: string, leagueId: number, season: string) {
  if (!API_KEY) return [];
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?league=${leagueId}&season=${season}`, {
      headers: { "x-apisports-key": API_KEY }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.response || [];
  } catch (error) {
    console.error(`API-Sports fetch error:`, error);
    return [];
  }
}

export async function fetchProScores(): Promise<NormalizedGame[]> {
  // Simplified for MVP turn - focusing on NBA as example for API-Sports integration
  // Real implementation would handle multiple subdomains (nfl.api-sports.io, etc)
  const nbaGames = await fetchFromApiSports("games", 12, "2025-2026");
  
  return nbaGames.map((g: any) => ({
    league: "NBA",
    isCollege: false,
    homeTeam: g.teams.home.name,
    awayTeam: g.teams.away.name,
    homeScore: g.scores.home.total || 0,
    awayScore: g.scores.away.total || 0,
    status: g.status.short === "FT" ? "Final" : (g.status.short === "NS" ? "Scheduled" : "Live"),
    period: g.status.timer || g.status.short,
    timeRemaining: null, // API-Sports provides timer string
    isOvertime: g.scores.home.over_time > 0 || g.scores.away.over_time > 0,
    startTime: new Date(g.date)
  }));
}
