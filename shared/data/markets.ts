import { TEAMS } from "./teams";

export interface Market {
  id: string;
  name: string;
  region: string;
  type: "pro" | "college" | "both";
}

export const MARKETS: Market[] = [
  // Major US Markets (Pro teams, some also have college programs)
  { id: "us-nyc", name: "New York City", region: "Northeast", type: "pro" },
  { id: "us-la", name: "Los Angeles", region: "West", type: "both" },
  { id: "us-chicago", name: "Chicago", region: "Midwest", type: "both" },
  { id: "us-dallas", name: "Dallas-Fort Worth", region: "South", type: "both" },
  { id: "us-houston", name: "Houston", region: "South", type: "pro" },
  { id: "us-phoenix", name: "Phoenix", region: "West", type: "pro" },
  { id: "us-philadelphia", name: "Philadelphia", region: "Northeast", type: "both" },
  { id: "us-san-antonio", name: "San Antonio", region: "South", type: "pro" },
  { id: "us-san-diego", name: "San Diego", region: "West", type: "pro" },
  { id: "us-san-jose", name: "San Jose", region: "West", type: "pro" },
  { id: "us-austin", name: "Austin", region: "South", type: "both" },
  { id: "us-jacksonville", name: "Jacksonville", region: "South", type: "both" },
  { id: "us-san-francisco", name: "San Francisco", region: "West", type: "pro" },
  { id: "us-columbus", name: "Columbus", region: "Midwest", type: "pro" },
  { id: "us-charlotte", name: "Charlotte", region: "South", type: "both" },
  { id: "us-indianapolis", name: "Indianapolis", region: "Midwest", type: "pro" },
  { id: "us-seattle", name: "Seattle", region: "West", type: "both" },
  { id: "us-denver", name: "Denver", region: "West", type: "pro" },
  { id: "us-washington", name: "Washington D.C.", region: "Northeast", type: "both" },
  { id: "us-boston", name: "Boston", region: "Northeast", type: "both" },
  { id: "us-nashville", name: "Nashville", region: "South", type: "both" },
  { id: "us-detroit", name: "Detroit", region: "Midwest", type: "pro" },
  { id: "us-oklahoma-city", name: "Oklahoma City", region: "South", type: "pro" },
  { id: "us-portland", name: "Portland", region: "West", type: "pro" },
  { id: "us-las-vegas", name: "Las Vegas", region: "West", type: "pro" },
  { id: "us-memphis", name: "Memphis", region: "South", type: "pro" },
  { id: "us-louisville", name: "Louisville", region: "South", type: "pro" },
  { id: "us-baltimore", name: "Baltimore", region: "Northeast", type: "pro" },
  { id: "us-milwaukee", name: "Milwaukee", region: "Midwest", type: "both" },
  { id: "us-albuquerque", name: "Albuquerque", region: "West", type: "pro" },
  { id: "us-tucson", name: "Tucson", region: "West", type: "pro" },
  { id: "us-fresno", name: "Fresno", region: "West", type: "pro" },
  { id: "us-sacramento", name: "Sacramento", region: "West", type: "pro" },
  { id: "us-kansas-city", name: "Kansas City", region: "Midwest", type: "pro" },
  { id: "us-mesa", name: "Mesa", region: "West", type: "pro" },
  { id: "us-atlanta", name: "Atlanta", region: "South", type: "both" },
  { id: "us-miami", name: "Miami", region: "South", type: "both" },
  { id: "us-oakland", name: "Oakland", region: "West", type: "pro" },
  { id: "us-minneapolis", name: "Minneapolis", region: "Midwest", type: "both" },
  { id: "us-tulsa", name: "Tulsa", region: "South", type: "both" },
  { id: "us-cleveland", name: "Cleveland", region: "Midwest", type: "pro" },
  { id: "us-new-orleans", name: "New Orleans", region: "South", type: "pro" },
  { id: "us-tampa", name: "Tampa", region: "South", type: "pro" },
  { id: "us-pittsburgh", name: "Pittsburgh", region: "Northeast", type: "both" },
  { id: "us-cincinnati", name: "Cincinnati", region: "Midwest", type: "pro" },
  { id: "us-st-louis", name: "St. Louis", region: "Midwest", type: "pro" },
  { id: "us-green-bay", name: "Green Bay", region: "Midwest", type: "pro" },
  { id: "us-buffalo", name: "Buffalo", region: "Northeast", type: "both" },
  { id: "us-raleigh", name: "Raleigh", region: "South", type: "both" },
  { id: "us-orlando", name: "Orlando", region: "South", type: "pro" },
  { id: "us-salt-lake-city", name: "Salt Lake City", region: "West", type: "pro" },
  // Canadian Markets
  { id: "ca-toronto", name: "Toronto", region: "Canada", type: "pro" },
  { id: "ca-vancouver", name: "Vancouver", region: "Canada", type: "pro" },
  { id: "ca-montreal", name: "Montreal", region: "Canada", type: "pro" },
  { id: "ca-calgary", name: "Calgary", region: "Canada", type: "pro" },
  { id: "ca-edmonton", name: "Edmonton", region: "Canada", type: "pro" },
  { id: "ca-ottawa", name: "Ottawa", region: "Canada", type: "pro" },
  { id: "ca-winnipeg", name: "Winnipeg", region: "Canada", type: "pro" },
  // College Markets (dedicated college towns)
  { id: "us-tuscaloosa", name: "Tuscaloosa", region: "South", type: "college" },
  { id: "us-ann-arbor", name: "Ann Arbor", region: "Midwest", type: "college" },
  { id: "us-columbus-oh", name: "Columbus (Ohio State)", region: "Midwest", type: "college" },
  { id: "us-athens", name: "Athens", region: "South", type: "college" },
  { id: "us-norman", name: "Norman", region: "South", type: "college" },
  { id: "us-eugene", name: "Eugene", region: "West", type: "college" },
  { id: "us-baton-rouge", name: "Baton Rouge", region: "South", type: "college" },
  { id: "us-gainesville", name: "Gainesville", region: "South", type: "college" },
  { id: "us-auburn", name: "Auburn", region: "South", type: "college" },
  { id: "us-college-station", name: "College Station", region: "South", type: "college" },
  { id: "us-state-college", name: "State College", region: "Northeast", type: "college" },
  { id: "us-south-bend", name: "South Bend", region: "Midwest", type: "college" },
  { id: "us-clemson", name: "Clemson", region: "South", type: "college" },
  { id: "us-knoxville", name: "Knoxville", region: "South", type: "college" },
  { id: "us-lexington", name: "Lexington", region: "South", type: "college" },
  { id: "us-chapel-hill", name: "Chapel Hill", region: "South", type: "college" },
  { id: "us-durham", name: "Durham", region: "South", type: "college" },
  { id: "us-storrs", name: "Storrs", region: "Northeast", type: "college" },
  { id: "us-lawrence", name: "Lawrence", region: "Midwest", type: "college" },
  { id: "us-tempe", name: "Tempe", region: "West", type: "college" },
  { id: "us-iowa-city", name: "Iowa City", region: "Midwest", type: "college" },
  { id: "us-west-lafayette", name: "West Lafayette", region: "Midwest", type: "college" },
  { id: "us-bloomington", name: "Bloomington", region: "Midwest", type: "college" },
  { id: "us-madison", name: "Madison", region: "Midwest", type: "college" },
  { id: "us-champaign", name: "Champaign", region: "Midwest", type: "college" },
  { id: "us-east-lansing", name: "East Lansing", region: "Midwest", type: "college" },
  { id: "us-lincoln", name: "Lincoln", region: "Midwest", type: "college" },
  { id: "us-columbia-sc", name: "Columbia (SC)", region: "South", type: "college" },
  { id: "us-columbia-mo", name: "Columbia (MO)", region: "Midwest", type: "college" },
  { id: "us-fayetteville", name: "Fayetteville", region: "South", type: "college" },
  { id: "us-starkville", name: "Starkville", region: "South", type: "college" },
  { id: "us-oxford", name: "Oxford", region: "South", type: "college" },
  { id: "us-waco", name: "Waco", region: "South", type: "college" },
  { id: "us-provo", name: "Provo", region: "West", type: "college" },
  { id: "us-morgantown", name: "Morgantown", region: "South", type: "college" },
  { id: "us-blacksburg", name: "Blacksburg", region: "South", type: "college" },
  { id: "us-charlottesville", name: "Charlottesville", region: "South", type: "college" },
  { id: "us-louisville-ky", name: "Louisville (KY)", region: "South", type: "college" },
  { id: "us-tucson-az", name: "Tucson (Arizona)", region: "West", type: "college" },
  { id: "us-boulder", name: "Boulder", region: "West", type: "college" },
  { id: "us-palo-alto", name: "Palo Alto", region: "West", type: "college" },
  { id: "us-corvallis", name: "Corvallis", region: "West", type: "college" },
  { id: "us-pullman", name: "Pullman", region: "West", type: "college" },
  { id: "us-berkeley", name: "Berkeley", region: "West", type: "college" },
  { id: "us-los-angeles-ucla", name: "Los Angeles (UCLA)", region: "West", type: "college" },
  { id: "us-los-angeles-usc", name: "Los Angeles (USC)", region: "West", type: "college" },
  { id: "us-houston-uh", name: "Houston (UH)", region: "South", type: "college" },
  { id: "us-cincinnati-uc", name: "Cincinnati (UC)", region: "Midwest", type: "college" },
  { id: "us-orlando-ucf", name: "Orlando (UCF)", region: "South", type: "college" },
  { id: "us-ames", name: "Ames", region: "Midwest", type: "college" },
  { id: "us-manhattan-ks", name: "Manhattan (KS)", region: "Midwest", type: "college" },
  { id: "us-lubbock", name: "Lubbock", region: "South", type: "college" },
];

// Lookup by ID
export const MARKET_BY_ID: Record<string, Market> = MARKETS.reduce((acc, market) => {
  acc[market.id] = market;
  return acc;
}, {} as Record<string, Market>);

export function getMarketById(id: string): Market | undefined {
  return MARKET_BY_ID[id];
}

export function getMarketsByRegion(region: string): Market[] {
  return MARKETS.filter(m => m.region === region);
}

export function getMarketsByType(type: "pro" | "college" | "both"): Market[] {
  if (type === "both") {
    return MARKETS;
  }
  return MARKETS.filter(m => m.type === type || m.type === "both");
}

export function getProMarkets(): Market[] {
  return MARKETS.filter(m => m.type === "pro" || m.type === "both");
}

export function getCollegeMarkets(): Market[] {
  return MARKETS.filter(m => m.type === "college" || m.type === "both");
}

export function getTeamsByMarketId(marketId: string): typeof TEAMS {
  return TEAMS.filter(t => t.marketId === marketId);
}

export function searchMarkets(query: string): Market[] {
  const q = query.toLowerCase();
  return MARKETS.filter(m => 
    m.name.toLowerCase().includes(q) || 
    m.region.toLowerCase().includes(q)
  );
}
