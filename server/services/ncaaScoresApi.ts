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

const LEAGUE_MAP: Record<string, string> = {
  "football/college-football": "NCAA_FB",
  "basketball/mens-college-basketball": "NCAA_MBB",
  "basketball/womens-college-basketball": "NCAA_WBB",
};

async function fetchEspnLeague(sportPath: string): Promise<NormalizedGame[]> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard`;
    const response = await fetch(url);
    if (!response.ok) return [];
    
    const data = await response.json();
    const league = LEAGUE_MAP[sportPath];
    
    return data.events.map((event: any): NormalizedGame => {
      const competition = event.competitions[0];
      const home = competition.competitors.find((c: any) => c.homeAway === "home");
      const away = competition.competitors.find((c: any) => c.homeAway === "away");
      
      const state = event.status.type.state;
      let status: NormalizedGame["status"] = "Scheduled";
      if (state === "in") status = "Live";
      if (state === "post") status = "Final";

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
        homeTeam: home.team.displayName,
        awayTeam: away.team.displayName,
        homeScore: parseInt(home.score) || 0,
        awayScore: parseInt(away.score) || 0,
        status,
        period: event.status.type.detail,
        timeRemaining,
        isOvertime: event.status.period > (league === "NCAA_FB" ? 4 : 2),
        startTime: new Date(event.date),
      };
    });
  } catch (error) {
    console.error(`ESPN NCAA fetch error:`, error);
    return [];
  }
}

export async function fetchNcaaScores(): Promise<NormalizedGame[]> {
  const sports = [
    "football/college-football",
    "basketball/mens-college-basketball",
    "basketball/womens-college-basketball"
  ];
  
  const results = await Promise.all(sports.map(fetchEspnLeague));
  return results.flat();
}
