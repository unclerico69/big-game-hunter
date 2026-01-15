import { storage } from "../storage";

interface EspnEvent {
  id: string;
  status: {
    type: {
      name: string;
      state: "pre" | "in" | "post";
      detail: string;
    };
    period: number;
    displayClock: string;
  };
  competitions: Array<{
    competitors: Array<{
      homeAway: "home" | "away";
      team: {
        displayName: string;
      };
      score: string;
    }>;
  }>;
}

export interface NcaaGame {
  league: "NCAA_FB" | "NCAA_MBB" | "NCAA_WBB";
  isCollege: true;
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

const LEAGUE_MAP: Record<string, NcaaGame["league"]> = {
  "football/college-football": "NCAA_FB",
  "basketball/mens-college-basketball": "NCAA_MBB",
  "basketball/womens-college-basketball": "NCAA_WBB",
};

async function fetchEspnLeague(sportPath: string): Promise<NcaaGame[]> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${sportPath}`);
    
    const data = await response.json();
    const league = LEAGUE_MAP[sportPath];
    
    return data.events.map((event: any): NcaaGame => {
      const competition = event.competitions[0];
      const homeCompetitor = competition.competitors.find((c: any) => c.homeAway === "home");
      const awayCompetitor = competition.competitors.find((c: any) => c.homeAway === "away");
      
      const statusState = event.status.type.state;
      let normalizedStatus: NcaaGame["status"] = "Scheduled";
      if (statusState === "in") normalizedStatus = "Live";
      if (statusState === "post") normalizedStatus = "Final";

      // Parse time remaining (mm:ss) into seconds
      let timeRemaining = null;
      if (event.status.displayClock) {
        const parts = event.status.displayClock.split(":");
        if (parts.length === 2) {
          timeRemaining = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
      }

      return {
        league,
        isCollege: true,
        homeTeam: homeCompetitor.team.displayName,
        awayTeam: awayCompetitor.team.displayName,
        homeScore: parseInt(homeCompetitor.score) || 0,
        awayScore: parseInt(awayCompetitor.score) || 0,
        status: normalizedStatus,
        period: event.status.type.detail,
        timeRemaining,
        isOvertime: event.status.period > (league === "NCAA_FB" ? 4 : 2),
        startTime: new Date(event.date),
      };
    });
  } catch (error) {
    console.error(`Error fetching ESPN NCAA data for ${sportPath}:`, error);
    return [];
  }
}

export async function fetchAllNcaaGames(): Promise<NcaaGame[]> {
  const sports = [
    "football/college-football",
    "basketball/mens-college-basketball",
    "basketball/womens-college-basketball"
  ];
  
  const results = await Promise.all(sports.map(fetchEspnLeague));
  return results.flat();
}
