export interface League {
  id: string;
  name: string;
  shortName: string;
  isCollege: boolean;
  defaultPriority: number;
}

export const LEAGUES: League[] = [
  { id: "NFL", name: "National Football League", shortName: "NFL", isCollege: false, defaultPriority: 1 },
  { id: "NBA", name: "National Basketball Association", shortName: "NBA", isCollege: false, defaultPriority: 2 },
  { id: "NHL", name: "National Hockey League", shortName: "NHL", isCollege: false, defaultPriority: 3 },
  { id: "MLB", name: "Major League Baseball", shortName: "MLB", isCollege: false, defaultPriority: 4 },
  { id: "NCAA_FB", name: "NCAA Football", shortName: "NCAAF", isCollege: true, defaultPriority: 5 },
  { id: "NCAA_MBB", name: "NCAA Men's Basketball", shortName: "NCAAM", isCollege: true, defaultPriority: 6 },
  { id: "NCAA_WBB", name: "NCAA Women's Basketball", shortName: "NCAAW", isCollege: true, defaultPriority: 7 },
];

export const LEAGUE_BY_ID: Record<string, League> = LEAGUES.reduce((acc, league) => {
  acc[league.id] = league;
  return acc;
}, {} as Record<string, League>);

export function getLeagueById(id: string): League | undefined {
  return LEAGUE_BY_ID[id.toUpperCase()];
}

export function getDefaultLeaguePriority(): string[] {
  return LEAGUES
    .sort((a, b) => a.defaultPriority - b.defaultPriority)
    .map(l => l.id);
}

export function isCollegeLeague(leagueId: string): boolean {
  const league = getLeagueById(leagueId);
  return league?.isCollege ?? false;
}
