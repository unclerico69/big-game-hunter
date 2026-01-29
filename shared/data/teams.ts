export interface Team {
  id: string;
  name: string;
  shortName: string;
  leagueId: string;
  isCollege: boolean;
  marketId: string;
  conference?: string;
  ranking?: number;
}

export const TEAMS: Team[] = [
  // ========== NFL TEAMS ==========
  { id: "nfl-ari", name: "Arizona Cardinals", shortName: "Cardinals", leagueId: "NFL", isCollege: false, marketId: "us-phoenix", conference: "NFC West" },
  { id: "nfl-atl", name: "Atlanta Falcons", shortName: "Falcons", leagueId: "NFL", isCollege: false, marketId: "us-atlanta", conference: "NFC South" },
  { id: "nfl-bal", name: "Baltimore Ravens", shortName: "Ravens", leagueId: "NFL", isCollege: false, marketId: "us-baltimore", conference: "AFC North" },
  { id: "nfl-buf", name: "Buffalo Bills", shortName: "Bills", leagueId: "NFL", isCollege: false, marketId: "us-buffalo", conference: "AFC East" },
  { id: "nfl-car", name: "Carolina Panthers", shortName: "Panthers", leagueId: "NFL", isCollege: false, marketId: "us-charlotte", conference: "NFC South" },
  { id: "nfl-chi", name: "Chicago Bears", shortName: "Bears", leagueId: "NFL", isCollege: false, marketId: "us-chicago", conference: "NFC North" },
  { id: "nfl-cin", name: "Cincinnati Bengals", shortName: "Bengals", leagueId: "NFL", isCollege: false, marketId: "us-cincinnati", conference: "AFC North" },
  { id: "nfl-cle", name: "Cleveland Browns", shortName: "Browns", leagueId: "NFL", isCollege: false, marketId: "us-cleveland", conference: "AFC North" },
  { id: "nfl-dal", name: "Dallas Cowboys", shortName: "Cowboys", leagueId: "NFL", isCollege: false, marketId: "us-dallas", conference: "NFC East" },
  { id: "nfl-den", name: "Denver Broncos", shortName: "Broncos", leagueId: "NFL", isCollege: false, marketId: "us-denver", conference: "AFC West" },
  { id: "nfl-det", name: "Detroit Lions", shortName: "Lions", leagueId: "NFL", isCollege: false, marketId: "us-detroit", conference: "NFC North" },
  { id: "nfl-gb", name: "Green Bay Packers", shortName: "Packers", leagueId: "NFL", isCollege: false, marketId: "us-green-bay", conference: "NFC North" },
  { id: "nfl-hou", name: "Houston Texans", shortName: "Texans", leagueId: "NFL", isCollege: false, marketId: "us-houston", conference: "AFC South" },
  { id: "nfl-ind", name: "Indianapolis Colts", shortName: "Colts", leagueId: "NFL", isCollege: false, marketId: "us-indianapolis", conference: "AFC South" },
  { id: "nfl-jax", name: "Jacksonville Jaguars", shortName: "Jaguars", leagueId: "NFL", isCollege: false, marketId: "us-jacksonville", conference: "AFC South" },
  { id: "nfl-kc", name: "Kansas City Chiefs", shortName: "Chiefs", leagueId: "NFL", isCollege: false, marketId: "us-kansas-city", conference: "AFC West" },
  { id: "nfl-lv", name: "Las Vegas Raiders", shortName: "Raiders", leagueId: "NFL", isCollege: false, marketId: "us-las-vegas", conference: "AFC West" },
  { id: "nfl-lac", name: "Los Angeles Chargers", shortName: "Chargers", leagueId: "NFL", isCollege: false, marketId: "us-la", conference: "AFC West" },
  { id: "nfl-lar", name: "Los Angeles Rams", shortName: "Rams", leagueId: "NFL", isCollege: false, marketId: "us-la", conference: "NFC West" },
  { id: "nfl-mia", name: "Miami Dolphins", shortName: "Dolphins", leagueId: "NFL", isCollege: false, marketId: "us-miami", conference: "AFC East" },
  { id: "nfl-min", name: "Minnesota Vikings", shortName: "Vikings", leagueId: "NFL", isCollege: false, marketId: "us-minneapolis", conference: "NFC North" },
  { id: "nfl-ne", name: "New England Patriots", shortName: "Patriots", leagueId: "NFL", isCollege: false, marketId: "us-boston", conference: "AFC East" },
  { id: "nfl-no", name: "New Orleans Saints", shortName: "Saints", leagueId: "NFL", isCollege: false, marketId: "us-new-orleans", conference: "NFC South" },
  { id: "nfl-nyg", name: "New York Giants", shortName: "Giants", leagueId: "NFL", isCollege: false, marketId: "us-nyc", conference: "NFC East" },
  { id: "nfl-nyj", name: "New York Jets", shortName: "Jets", leagueId: "NFL", isCollege: false, marketId: "us-nyc", conference: "AFC East" },
  { id: "nfl-phi", name: "Philadelphia Eagles", shortName: "Eagles", leagueId: "NFL", isCollege: false, marketId: "us-philadelphia", conference: "NFC East" },
  { id: "nfl-pit", name: "Pittsburgh Steelers", shortName: "Steelers", leagueId: "NFL", isCollege: false, marketId: "us-pittsburgh", conference: "AFC North" },
  { id: "nfl-sf", name: "San Francisco 49ers", shortName: "49ers", leagueId: "NFL", isCollege: false, marketId: "us-san-francisco", conference: "NFC West" },
  { id: "nfl-sea", name: "Seattle Seahawks", shortName: "Seahawks", leagueId: "NFL", isCollege: false, marketId: "us-seattle", conference: "NFC West" },
  { id: "nfl-tb", name: "Tampa Bay Buccaneers", shortName: "Buccaneers", leagueId: "NFL", isCollege: false, marketId: "us-tampa", conference: "NFC South" },
  { id: "nfl-ten", name: "Tennessee Titans", shortName: "Titans", leagueId: "NFL", isCollege: false, marketId: "us-nashville", conference: "AFC South" },
  { id: "nfl-was", name: "Washington Commanders", shortName: "Commanders", leagueId: "NFL", isCollege: false, marketId: "us-washington", conference: "NFC East" },

  // ========== NBA TEAMS ==========
  { id: "nba-atl", name: "Atlanta Hawks", shortName: "Hawks", leagueId: "NBA", isCollege: false, marketId: "us-atlanta", conference: "Eastern" },
  { id: "nba-bos", name: "Boston Celtics", shortName: "Celtics", leagueId: "NBA", isCollege: false, marketId: "us-boston", conference: "Eastern" },
  { id: "nba-bkn", name: "Brooklyn Nets", shortName: "Nets", leagueId: "NBA", isCollege: false, marketId: "us-nyc", conference: "Eastern" },
  { id: "nba-cha", name: "Charlotte Hornets", shortName: "Hornets", leagueId: "NBA", isCollege: false, marketId: "us-charlotte", conference: "Eastern" },
  { id: "nba-chi", name: "Chicago Bulls", shortName: "Bulls", leagueId: "NBA", isCollege: false, marketId: "us-chicago", conference: "Eastern" },
  { id: "nba-cle", name: "Cleveland Cavaliers", shortName: "Cavaliers", leagueId: "NBA", isCollege: false, marketId: "us-cleveland", conference: "Eastern" },
  { id: "nba-dal", name: "Dallas Mavericks", shortName: "Mavericks", leagueId: "NBA", isCollege: false, marketId: "us-dallas", conference: "Western" },
  { id: "nba-den", name: "Denver Nuggets", shortName: "Nuggets", leagueId: "NBA", isCollege: false, marketId: "us-denver", conference: "Western" },
  { id: "nba-det", name: "Detroit Pistons", shortName: "Pistons", leagueId: "NBA", isCollege: false, marketId: "us-detroit", conference: "Eastern" },
  { id: "nba-gsw", name: "Golden State Warriors", shortName: "Warriors", leagueId: "NBA", isCollege: false, marketId: "us-san-francisco", conference: "Western" },
  { id: "nba-hou", name: "Houston Rockets", shortName: "Rockets", leagueId: "NBA", isCollege: false, marketId: "us-houston", conference: "Western" },
  { id: "nba-ind", name: "Indiana Pacers", shortName: "Pacers", leagueId: "NBA", isCollege: false, marketId: "us-indianapolis", conference: "Eastern" },
  { id: "nba-lac", name: "LA Clippers", shortName: "Clippers", leagueId: "NBA", isCollege: false, marketId: "us-la", conference: "Western" },
  { id: "nba-lal", name: "Los Angeles Lakers", shortName: "Lakers", leagueId: "NBA", isCollege: false, marketId: "us-la", conference: "Western" },
  { id: "nba-mem", name: "Memphis Grizzlies", shortName: "Grizzlies", leagueId: "NBA", isCollege: false, marketId: "us-memphis", conference: "Western" },
  { id: "nba-mia", name: "Miami Heat", shortName: "Heat", leagueId: "NBA", isCollege: false, marketId: "us-miami", conference: "Eastern" },
  { id: "nba-mil", name: "Milwaukee Bucks", shortName: "Bucks", leagueId: "NBA", isCollege: false, marketId: "us-milwaukee", conference: "Eastern" },
  { id: "nba-min", name: "Minnesota Timberwolves", shortName: "Timberwolves", leagueId: "NBA", isCollege: false, marketId: "us-minneapolis", conference: "Western" },
  { id: "nba-nop", name: "New Orleans Pelicans", shortName: "Pelicans", leagueId: "NBA", isCollege: false, marketId: "us-new-orleans", conference: "Western" },
  { id: "nba-nyk", name: "New York Knicks", shortName: "Knicks", leagueId: "NBA", isCollege: false, marketId: "us-nyc", conference: "Eastern" },
  { id: "nba-okc", name: "Oklahoma City Thunder", shortName: "Thunder", leagueId: "NBA", isCollege: false, marketId: "us-oklahoma-city", conference: "Western" },
  { id: "nba-orl", name: "Orlando Magic", shortName: "Magic", leagueId: "NBA", isCollege: false, marketId: "us-orlando", conference: "Eastern" },
  { id: "nba-phi", name: "Philadelphia 76ers", shortName: "76ers", leagueId: "NBA", isCollege: false, marketId: "us-philadelphia", conference: "Eastern" },
  { id: "nba-phx", name: "Phoenix Suns", shortName: "Suns", leagueId: "NBA", isCollege: false, marketId: "us-phoenix", conference: "Western" },
  { id: "nba-por", name: "Portland Trail Blazers", shortName: "Trail Blazers", leagueId: "NBA", isCollege: false, marketId: "us-portland", conference: "Western" },
  { id: "nba-sac", name: "Sacramento Kings", shortName: "Kings", leagueId: "NBA", isCollege: false, marketId: "us-sacramento", conference: "Western" },
  { id: "nba-sas", name: "San Antonio Spurs", shortName: "Spurs", leagueId: "NBA", isCollege: false, marketId: "us-san-antonio", conference: "Western" },
  { id: "nba-tor", name: "Toronto Raptors", shortName: "Raptors", leagueId: "NBA", isCollege: false, marketId: "ca-toronto", conference: "Eastern" },
  { id: "nba-uta", name: "Utah Jazz", shortName: "Jazz", leagueId: "NBA", isCollege: false, marketId: "us-salt-lake-city", conference: "Western" },
  { id: "nba-was", name: "Washington Wizards", shortName: "Wizards", leagueId: "NBA", isCollege: false, marketId: "us-washington", conference: "Eastern" },

  // ========== NHL TEAMS ==========
  { id: "nhl-ana", name: "Anaheim Ducks", shortName: "Ducks", leagueId: "NHL", isCollege: false, marketId: "us-la", conference: "Western" },
  { id: "nhl-ari", name: "Arizona Coyotes", shortName: "Coyotes", leagueId: "NHL", isCollege: false, marketId: "us-phoenix", conference: "Central" },
  { id: "nhl-bos", name: "Boston Bruins", shortName: "Bruins", leagueId: "NHL", isCollege: false, marketId: "us-boston", conference: "Eastern" },
  { id: "nhl-buf", name: "Buffalo Sabres", shortName: "Sabres", leagueId: "NHL", isCollege: false, marketId: "us-buffalo", conference: "Eastern" },
  { id: "nhl-cgy", name: "Calgary Flames", shortName: "Flames", leagueId: "NHL", isCollege: false, marketId: "ca-calgary", conference: "Western" },
  { id: "nhl-car", name: "Carolina Hurricanes", shortName: "Hurricanes", leagueId: "NHL", isCollege: false, marketId: "us-raleigh", conference: "Eastern" },
  { id: "nhl-chi", name: "Chicago Blackhawks", shortName: "Blackhawks", leagueId: "NHL", isCollege: false, marketId: "us-chicago", conference: "Central" },
  { id: "nhl-col", name: "Colorado Avalanche", shortName: "Avalanche", leagueId: "NHL", isCollege: false, marketId: "us-denver", conference: "Central" },
  { id: "nhl-cbj", name: "Columbus Blue Jackets", shortName: "Blue Jackets", leagueId: "NHL", isCollege: false, marketId: "us-columbus", conference: "Eastern" },
  { id: "nhl-dal", name: "Dallas Stars", shortName: "Stars", leagueId: "NHL", isCollege: false, marketId: "us-dallas", conference: "Central" },
  { id: "nhl-det", name: "Detroit Red Wings", shortName: "Red Wings", leagueId: "NHL", isCollege: false, marketId: "us-detroit", conference: "Eastern" },
  { id: "nhl-edm", name: "Edmonton Oilers", shortName: "Oilers", leagueId: "NHL", isCollege: false, marketId: "ca-edmonton", conference: "Western" },
  { id: "nhl-fla", name: "Florida Panthers", shortName: "Panthers", leagueId: "NHL", isCollege: false, marketId: "us-miami", conference: "Eastern" },
  { id: "nhl-lak", name: "Los Angeles Kings", shortName: "Kings", leagueId: "NHL", isCollege: false, marketId: "us-la", conference: "Western" },
  { id: "nhl-min", name: "Minnesota Wild", shortName: "Wild", leagueId: "NHL", isCollege: false, marketId: "us-minneapolis", conference: "Central" },
  { id: "nhl-mtl", name: "Montreal Canadiens", shortName: "Canadiens", leagueId: "NHL", isCollege: false, marketId: "ca-montreal", conference: "Eastern" },
  { id: "nhl-nsh", name: "Nashville Predators", shortName: "Predators", leagueId: "NHL", isCollege: false, marketId: "us-nashville", conference: "Central" },
  { id: "nhl-njd", name: "New Jersey Devils", shortName: "Devils", leagueId: "NHL", isCollege: false, marketId: "us-nyc", conference: "Eastern" },
  { id: "nhl-nyi", name: "New York Islanders", shortName: "Islanders", leagueId: "NHL", isCollege: false, marketId: "us-nyc", conference: "Eastern" },
  { id: "nhl-nyr", name: "New York Rangers", shortName: "Rangers", leagueId: "NHL", isCollege: false, marketId: "us-nyc", conference: "Eastern" },
  { id: "nhl-ott", name: "Ottawa Senators", shortName: "Senators", leagueId: "NHL", isCollege: false, marketId: "ca-ottawa", conference: "Eastern" },
  { id: "nhl-phi", name: "Philadelphia Flyers", shortName: "Flyers", leagueId: "NHL", isCollege: false, marketId: "us-philadelphia", conference: "Eastern" },
  { id: "nhl-pit", name: "Pittsburgh Penguins", shortName: "Penguins", leagueId: "NHL", isCollege: false, marketId: "us-pittsburgh", conference: "Eastern" },
  { id: "nhl-sjs", name: "San Jose Sharks", shortName: "Sharks", leagueId: "NHL", isCollege: false, marketId: "us-san-jose", conference: "Western" },
  { id: "nhl-sea", name: "Seattle Kraken", shortName: "Kraken", leagueId: "NHL", isCollege: false, marketId: "us-seattle", conference: "Western" },
  { id: "nhl-stl", name: "St. Louis Blues", shortName: "Blues", leagueId: "NHL", isCollege: false, marketId: "us-st-louis", conference: "Central" },
  { id: "nhl-tbl", name: "Tampa Bay Lightning", shortName: "Lightning", leagueId: "NHL", isCollege: false, marketId: "us-tampa", conference: "Eastern" },
  { id: "nhl-tor", name: "Toronto Maple Leafs", shortName: "Maple Leafs", leagueId: "NHL", isCollege: false, marketId: "ca-toronto", conference: "Eastern" },
  { id: "nhl-uta", name: "Utah Hockey Club", shortName: "Utah HC", leagueId: "NHL", isCollege: false, marketId: "us-salt-lake-city", conference: "Central" },
  { id: "nhl-van", name: "Vancouver Canucks", shortName: "Canucks", leagueId: "NHL", isCollege: false, marketId: "ca-vancouver", conference: "Western" },
  { id: "nhl-vgk", name: "Vegas Golden Knights", shortName: "Golden Knights", leagueId: "NHL", isCollege: false, marketId: "us-las-vegas", conference: "Western" },
  { id: "nhl-wpg", name: "Winnipeg Jets", shortName: "Jets", leagueId: "NHL", isCollege: false, marketId: "ca-winnipeg", conference: "Central" },
  { id: "nhl-wsh", name: "Washington Capitals", shortName: "Capitals", leagueId: "NHL", isCollege: false, marketId: "us-washington", conference: "Eastern" },

  // ========== MLB TEAMS ==========
  { id: "mlb-ari", name: "Arizona Diamondbacks", shortName: "D-backs", leagueId: "MLB", isCollege: false, marketId: "us-phoenix", conference: "NL West" },
  { id: "mlb-atl", name: "Atlanta Braves", shortName: "Braves", leagueId: "MLB", isCollege: false, marketId: "us-atlanta", conference: "NL East" },
  { id: "mlb-bal", name: "Baltimore Orioles", shortName: "Orioles", leagueId: "MLB", isCollege: false, marketId: "us-baltimore", conference: "AL East" },
  { id: "mlb-bos", name: "Boston Red Sox", shortName: "Red Sox", leagueId: "MLB", isCollege: false, marketId: "us-boston", conference: "AL East" },
  { id: "mlb-chc", name: "Chicago Cubs", shortName: "Cubs", leagueId: "MLB", isCollege: false, marketId: "us-chicago", conference: "NL Central" },
  { id: "mlb-chw", name: "Chicago White Sox", shortName: "White Sox", leagueId: "MLB", isCollege: false, marketId: "us-chicago", conference: "AL Central" },
  { id: "mlb-cin", name: "Cincinnati Reds", shortName: "Reds", leagueId: "MLB", isCollege: false, marketId: "us-cincinnati", conference: "NL Central" },
  { id: "mlb-cle", name: "Cleveland Guardians", shortName: "Guardians", leagueId: "MLB", isCollege: false, marketId: "us-cleveland", conference: "AL Central" },
  { id: "mlb-col", name: "Colorado Rockies", shortName: "Rockies", leagueId: "MLB", isCollege: false, marketId: "us-denver", conference: "NL West" },
  { id: "mlb-det", name: "Detroit Tigers", shortName: "Tigers", leagueId: "MLB", isCollege: false, marketId: "us-detroit", conference: "AL Central" },
  { id: "mlb-hou", name: "Houston Astros", shortName: "Astros", leagueId: "MLB", isCollege: false, marketId: "us-houston", conference: "AL West" },
  { id: "mlb-kc", name: "Kansas City Royals", shortName: "Royals", leagueId: "MLB", isCollege: false, marketId: "us-kansas-city", conference: "AL Central" },
  { id: "mlb-laa", name: "Los Angeles Angels", shortName: "Angels", leagueId: "MLB", isCollege: false, marketId: "us-la", conference: "AL West" },
  { id: "mlb-lad", name: "Los Angeles Dodgers", shortName: "Dodgers", leagueId: "MLB", isCollege: false, marketId: "us-la", conference: "NL West" },
  { id: "mlb-mia", name: "Miami Marlins", shortName: "Marlins", leagueId: "MLB", isCollege: false, marketId: "us-miami", conference: "NL East" },
  { id: "mlb-mil", name: "Milwaukee Brewers", shortName: "Brewers", leagueId: "MLB", isCollege: false, marketId: "us-milwaukee", conference: "NL Central" },
  { id: "mlb-min", name: "Minnesota Twins", shortName: "Twins", leagueId: "MLB", isCollege: false, marketId: "us-minneapolis", conference: "AL Central" },
  { id: "mlb-nym", name: "New York Mets", shortName: "Mets", leagueId: "MLB", isCollege: false, marketId: "us-nyc", conference: "NL East" },
  { id: "mlb-nyy", name: "New York Yankees", shortName: "Yankees", leagueId: "MLB", isCollege: false, marketId: "us-nyc", conference: "AL East" },
  { id: "mlb-oak", name: "Oakland Athletics", shortName: "Athletics", leagueId: "MLB", isCollege: false, marketId: "us-oakland", conference: "AL West" },
  { id: "mlb-phi", name: "Philadelphia Phillies", shortName: "Phillies", leagueId: "MLB", isCollege: false, marketId: "us-philadelphia", conference: "NL East" },
  { id: "mlb-pit", name: "Pittsburgh Pirates", shortName: "Pirates", leagueId: "MLB", isCollege: false, marketId: "us-pittsburgh", conference: "NL Central" },
  { id: "mlb-sd", name: "San Diego Padres", shortName: "Padres", leagueId: "MLB", isCollege: false, marketId: "us-san-diego", conference: "NL West" },
  { id: "mlb-sf", name: "San Francisco Giants", shortName: "Giants", leagueId: "MLB", isCollege: false, marketId: "us-san-francisco", conference: "NL West" },
  { id: "mlb-sea", name: "Seattle Mariners", shortName: "Mariners", leagueId: "MLB", isCollege: false, marketId: "us-seattle", conference: "AL West" },
  { id: "mlb-stl", name: "St. Louis Cardinals", shortName: "Cardinals", leagueId: "MLB", isCollege: false, marketId: "us-st-louis", conference: "NL Central" },
  { id: "mlb-tb", name: "Tampa Bay Rays", shortName: "Rays", leagueId: "MLB", isCollege: false, marketId: "us-tampa", conference: "AL East" },
  { id: "mlb-tex", name: "Texas Rangers", shortName: "Rangers", leagueId: "MLB", isCollege: false, marketId: "us-dallas", conference: "AL West" },
  { id: "mlb-tor", name: "Toronto Blue Jays", shortName: "Blue Jays", leagueId: "MLB", isCollege: false, marketId: "ca-toronto", conference: "AL East" },
  { id: "mlb-was", name: "Washington Nationals", shortName: "Nationals", leagueId: "MLB", isCollege: false, marketId: "us-washington", conference: "NL East" },

  // ========== NCAA FOOTBALL (FBS Power Conference Teams) ==========
  // SEC
  { id: "ncaa-fb-alabama", name: "Alabama Crimson Tide", shortName: "Alabama", leagueId: "NCAA_FB", isCollege: true, marketId: "us-tuscaloosa", conference: "SEC" },
  { id: "ncaa-fb-auburn", name: "Auburn Tigers", shortName: "Auburn", leagueId: "NCAA_FB", isCollege: true, marketId: "us-auburn", conference: "SEC" },
  { id: "ncaa-fb-arkansas", name: "Arkansas Razorbacks", shortName: "Arkansas", leagueId: "NCAA_FB", isCollege: true, marketId: "us-fayetteville", conference: "SEC" },
  { id: "ncaa-fb-florida", name: "Florida Gators", shortName: "Florida", leagueId: "NCAA_FB", isCollege: true, marketId: "us-gainesville", conference: "SEC" },
  { id: "ncaa-fb-georgia", name: "Georgia Bulldogs", shortName: "Georgia", leagueId: "NCAA_FB", isCollege: true, marketId: "us-athens", conference: "SEC" },
  { id: "ncaa-fb-kentucky", name: "Kentucky Wildcats", shortName: "Kentucky", leagueId: "NCAA_FB", isCollege: true, marketId: "us-lexington", conference: "SEC" },
  { id: "ncaa-fb-lsu", name: "LSU Tigers", shortName: "LSU", leagueId: "NCAA_FB", isCollege: true, marketId: "us-baton-rouge", conference: "SEC" },
  { id: "ncaa-fb-mississippi-state", name: "Mississippi State Bulldogs", shortName: "Miss State", leagueId: "NCAA_FB", isCollege: true, marketId: "us-starkville", conference: "SEC" },
  { id: "ncaa-fb-missouri", name: "Missouri Tigers", shortName: "Missouri", leagueId: "NCAA_FB", isCollege: true, marketId: "us-columbia-mo", conference: "SEC" },
  { id: "ncaa-fb-ole-miss", name: "Ole Miss Rebels", shortName: "Ole Miss", leagueId: "NCAA_FB", isCollege: true, marketId: "us-oxford", conference: "SEC" },
  { id: "ncaa-fb-oklahoma", name: "Oklahoma Sooners", shortName: "Oklahoma", leagueId: "NCAA_FB", isCollege: true, marketId: "us-norman", conference: "SEC" },
  { id: "ncaa-fb-south-carolina", name: "South Carolina Gamecocks", shortName: "S. Carolina", leagueId: "NCAA_FB", isCollege: true, marketId: "us-columbia-sc", conference: "SEC" },
  { id: "ncaa-fb-tennessee", name: "Tennessee Volunteers", shortName: "Tennessee", leagueId: "NCAA_FB", isCollege: true, marketId: "us-knoxville", conference: "SEC" },
  { id: "ncaa-fb-texas", name: "Texas Longhorns", shortName: "Texas", leagueId: "NCAA_FB", isCollege: true, marketId: "us-austin", conference: "SEC" },
  { id: "ncaa-fb-texas-am", name: "Texas A&M Aggies", shortName: "Texas A&M", leagueId: "NCAA_FB", isCollege: true, marketId: "us-college-station", conference: "SEC" },
  { id: "ncaa-fb-vanderbilt", name: "Vanderbilt Commodores", shortName: "Vanderbilt", leagueId: "NCAA_FB", isCollege: true, marketId: "us-nashville", conference: "SEC" },
  // Big Ten
  { id: "ncaa-fb-illinois", name: "Illinois Fighting Illini", shortName: "Illinois", leagueId: "NCAA_FB", isCollege: true, marketId: "us-champaign", conference: "Big Ten" },
  { id: "ncaa-fb-indiana", name: "Indiana Hoosiers", shortName: "Indiana", leagueId: "NCAA_FB", isCollege: true, marketId: "us-bloomington", conference: "Big Ten" },
  { id: "ncaa-fb-iowa", name: "Iowa Hawkeyes", shortName: "Iowa", leagueId: "NCAA_FB", isCollege: true, marketId: "us-iowa-city", conference: "Big Ten" },
  { id: "ncaa-fb-maryland", name: "Maryland Terrapins", shortName: "Maryland", leagueId: "NCAA_FB", isCollege: true, marketId: "us-washington", conference: "Big Ten" },
  { id: "ncaa-fb-michigan", name: "Michigan Wolverines", shortName: "Michigan", leagueId: "NCAA_FB", isCollege: true, marketId: "us-ann-arbor", conference: "Big Ten" },
  { id: "ncaa-fb-michigan-state", name: "Michigan State Spartans", shortName: "Michigan St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-east-lansing", conference: "Big Ten" },
  { id: "ncaa-fb-minnesota", name: "Minnesota Golden Gophers", shortName: "Minnesota", leagueId: "NCAA_FB", isCollege: true, marketId: "us-minneapolis", conference: "Big Ten" },
  { id: "ncaa-fb-nebraska", name: "Nebraska Cornhuskers", shortName: "Nebraska", leagueId: "NCAA_FB", isCollege: true, marketId: "us-lincoln", conference: "Big Ten" },
  { id: "ncaa-fb-northwestern", name: "Northwestern Wildcats", shortName: "Northwestern", leagueId: "NCAA_FB", isCollege: true, marketId: "us-chicago", conference: "Big Ten" },
  { id: "ncaa-fb-ohio-state", name: "Ohio State Buckeyes", shortName: "Ohio State", leagueId: "NCAA_FB", isCollege: true, marketId: "us-columbus-oh", conference: "Big Ten" },
  { id: "ncaa-fb-oregon", name: "Oregon Ducks", shortName: "Oregon", leagueId: "NCAA_FB", isCollege: true, marketId: "us-eugene", conference: "Big Ten" },
  { id: "ncaa-fb-penn-state", name: "Penn State Nittany Lions", shortName: "Penn State", leagueId: "NCAA_FB", isCollege: true, marketId: "us-state-college", conference: "Big Ten" },
  { id: "ncaa-fb-purdue", name: "Purdue Boilermakers", shortName: "Purdue", leagueId: "NCAA_FB", isCollege: true, marketId: "us-west-lafayette", conference: "Big Ten" },
  { id: "ncaa-fb-rutgers", name: "Rutgers Scarlet Knights", shortName: "Rutgers", leagueId: "NCAA_FB", isCollege: true, marketId: "us-nyc", conference: "Big Ten" },
  { id: "ncaa-fb-usc", name: "USC Trojans", shortName: "USC", leagueId: "NCAA_FB", isCollege: true, marketId: "us-los-angeles-usc", conference: "Big Ten" },
  { id: "ncaa-fb-ucla", name: "UCLA Bruins", shortName: "UCLA", leagueId: "NCAA_FB", isCollege: true, marketId: "us-los-angeles-ucla", conference: "Big Ten" },
  { id: "ncaa-fb-washington", name: "Washington Huskies", shortName: "Washington", leagueId: "NCAA_FB", isCollege: true, marketId: "us-seattle", conference: "Big Ten" },
  { id: "ncaa-fb-wisconsin", name: "Wisconsin Badgers", shortName: "Wisconsin", leagueId: "NCAA_FB", isCollege: true, marketId: "us-madison", conference: "Big Ten" },
  // Big 12
  { id: "ncaa-fb-arizona", name: "Arizona Wildcats", shortName: "Arizona", leagueId: "NCAA_FB", isCollege: true, marketId: "us-tucson-az", conference: "Big 12" },
  { id: "ncaa-fb-arizona-state", name: "Arizona State Sun Devils", shortName: "Arizona St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-tempe", conference: "Big 12" },
  { id: "ncaa-fb-baylor", name: "Baylor Bears", shortName: "Baylor", leagueId: "NCAA_FB", isCollege: true, marketId: "us-waco", conference: "Big 12" },
  { id: "ncaa-fb-byu", name: "BYU Cougars", shortName: "BYU", leagueId: "NCAA_FB", isCollege: true, marketId: "us-provo", conference: "Big 12" },
  { id: "ncaa-fb-cincinnati", name: "Cincinnati Bearcats", shortName: "Cincinnati", leagueId: "NCAA_FB", isCollege: true, marketId: "us-cincinnati-uc", conference: "Big 12" },
  { id: "ncaa-fb-colorado", name: "Colorado Buffaloes", shortName: "Colorado", leagueId: "NCAA_FB", isCollege: true, marketId: "us-boulder", conference: "Big 12" },
  { id: "ncaa-fb-houston", name: "Houston Cougars", shortName: "Houston", leagueId: "NCAA_FB", isCollege: true, marketId: "us-houston-uh", conference: "Big 12" },
  { id: "ncaa-fb-iowa-state", name: "Iowa State Cyclones", shortName: "Iowa State", leagueId: "NCAA_FB", isCollege: true, marketId: "us-ames", conference: "Big 12" },
  { id: "ncaa-fb-kansas", name: "Kansas Jayhawks", shortName: "Kansas", leagueId: "NCAA_FB", isCollege: true, marketId: "us-lawrence", conference: "Big 12" },
  { id: "ncaa-fb-kansas-state", name: "Kansas State Wildcats", shortName: "Kansas St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-manhattan-ks", conference: "Big 12" },
  { id: "ncaa-fb-oklahoma-state", name: "Oklahoma State Cowboys", shortName: "Oklahoma St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-tulsa", conference: "Big 12" },
  { id: "ncaa-fb-tcu", name: "TCU Horned Frogs", shortName: "TCU", leagueId: "NCAA_FB", isCollege: true, marketId: "us-dallas", conference: "Big 12" },
  { id: "ncaa-fb-texas-tech", name: "Texas Tech Red Raiders", shortName: "Texas Tech", leagueId: "NCAA_FB", isCollege: true, marketId: "us-lubbock", conference: "Big 12" },
  { id: "ncaa-fb-ucf", name: "UCF Knights", shortName: "UCF", leagueId: "NCAA_FB", isCollege: true, marketId: "us-orlando-ucf", conference: "Big 12" },
  { id: "ncaa-fb-west-virginia", name: "West Virginia Mountaineers", shortName: "West Virginia", leagueId: "NCAA_FB", isCollege: true, marketId: "us-morgantown", conference: "Big 12" },
  // ACC
  { id: "ncaa-fb-boston-college", name: "Boston College Eagles", shortName: "Boston College", leagueId: "NCAA_FB", isCollege: true, marketId: "us-boston", conference: "ACC" },
  { id: "ncaa-fb-clemson", name: "Clemson Tigers", shortName: "Clemson", leagueId: "NCAA_FB", isCollege: true, marketId: "us-clemson", conference: "ACC" },
  { id: "ncaa-fb-duke", name: "Duke Blue Devils", shortName: "Duke", leagueId: "NCAA_FB", isCollege: true, marketId: "us-durham", conference: "ACC" },
  { id: "ncaa-fb-florida-state", name: "Florida State Seminoles", shortName: "Florida St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-jacksonville", conference: "ACC" },
  { id: "ncaa-fb-georgia-tech", name: "Georgia Tech Yellow Jackets", shortName: "Georgia Tech", leagueId: "NCAA_FB", isCollege: true, marketId: "us-atlanta", conference: "ACC" },
  { id: "ncaa-fb-louisville", name: "Louisville Cardinals", shortName: "Louisville", leagueId: "NCAA_FB", isCollege: true, marketId: "us-louisville-ky", conference: "ACC" },
  { id: "ncaa-fb-miami", name: "Miami Hurricanes", shortName: "Miami", leagueId: "NCAA_FB", isCollege: true, marketId: "us-miami", conference: "ACC" },
  { id: "ncaa-fb-nc-state", name: "NC State Wolfpack", shortName: "NC State", leagueId: "NCAA_FB", isCollege: true, marketId: "us-raleigh", conference: "ACC" },
  { id: "ncaa-fb-north-carolina", name: "North Carolina Tar Heels", shortName: "UNC", leagueId: "NCAA_FB", isCollege: true, marketId: "us-chapel-hill", conference: "ACC" },
  { id: "ncaa-fb-notre-dame", name: "Notre Dame Fighting Irish", shortName: "Notre Dame", leagueId: "NCAA_FB", isCollege: true, marketId: "us-south-bend", conference: "ACC" },
  { id: "ncaa-fb-pitt", name: "Pittsburgh Panthers", shortName: "Pitt", leagueId: "NCAA_FB", isCollege: true, marketId: "us-pittsburgh", conference: "ACC" },
  { id: "ncaa-fb-syracuse", name: "Syracuse Orange", shortName: "Syracuse", leagueId: "NCAA_FB", isCollege: true, marketId: "us-buffalo", conference: "ACC" },
  { id: "ncaa-fb-virginia", name: "Virginia Cavaliers", shortName: "Virginia", leagueId: "NCAA_FB", isCollege: true, marketId: "us-charlottesville", conference: "ACC" },
  { id: "ncaa-fb-virginia-tech", name: "Virginia Tech Hokies", shortName: "Virginia Tech", leagueId: "NCAA_FB", isCollege: true, marketId: "us-blacksburg", conference: "ACC" },
  { id: "ncaa-fb-wake-forest", name: "Wake Forest Demon Deacons", shortName: "Wake Forest", leagueId: "NCAA_FB", isCollege: true, marketId: "us-charlotte", conference: "ACC" },
  // Pac-12 Remnants
  { id: "ncaa-fb-cal", name: "California Golden Bears", shortName: "Cal", leagueId: "NCAA_FB", isCollege: true, marketId: "us-berkeley", conference: "ACC" },
  { id: "ncaa-fb-stanford", name: "Stanford Cardinal", shortName: "Stanford", leagueId: "NCAA_FB", isCollege: true, marketId: "us-palo-alto", conference: "ACC" },
  { id: "ncaa-fb-oregon-state", name: "Oregon State Beavers", shortName: "Oregon St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-corvallis", conference: "Pac-12" },
  { id: "ncaa-fb-washington-state", name: "Washington State Cougars", shortName: "Wash St", leagueId: "NCAA_FB", isCollege: true, marketId: "us-pullman", conference: "Pac-12" },

  // ========== NCAA MEN'S BASKETBALL (Major Programs) ==========
  // Using same schools as football plus basketball powerhouses
  { id: "ncaa-mbb-alabama", name: "Alabama Crimson Tide", shortName: "Alabama", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-tuscaloosa", conference: "SEC" },
  { id: "ncaa-mbb-auburn", name: "Auburn Tigers", shortName: "Auburn", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-auburn", conference: "SEC" },
  { id: "ncaa-mbb-arkansas", name: "Arkansas Razorbacks", shortName: "Arkansas", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-fayetteville", conference: "SEC" },
  { id: "ncaa-mbb-duke", name: "Duke Blue Devils", shortName: "Duke", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-durham", conference: "ACC" },
  { id: "ncaa-mbb-florida", name: "Florida Gators", shortName: "Florida", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-gainesville", conference: "SEC" },
  { id: "ncaa-mbb-gonzaga", name: "Gonzaga Bulldogs", shortName: "Gonzaga", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-seattle", conference: "WCC" },
  { id: "ncaa-mbb-houston", name: "Houston Cougars", shortName: "Houston", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-houston-uh", conference: "Big 12" },
  { id: "ncaa-mbb-illinois", name: "Illinois Fighting Illini", shortName: "Illinois", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-champaign", conference: "Big Ten" },
  { id: "ncaa-mbb-indiana", name: "Indiana Hoosiers", shortName: "Indiana", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-bloomington", conference: "Big Ten" },
  { id: "ncaa-mbb-iowa", name: "Iowa Hawkeyes", shortName: "Iowa", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-iowa-city", conference: "Big Ten" },
  { id: "ncaa-mbb-iowa-state", name: "Iowa State Cyclones", shortName: "Iowa State", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-ames", conference: "Big 12" },
  { id: "ncaa-mbb-kansas", name: "Kansas Jayhawks", shortName: "Kansas", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-lawrence", conference: "Big 12" },
  { id: "ncaa-mbb-kentucky", name: "Kentucky Wildcats", shortName: "Kentucky", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-lexington", conference: "SEC" },
  { id: "ncaa-mbb-lsu", name: "LSU Tigers", shortName: "LSU", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-baton-rouge", conference: "SEC" },
  { id: "ncaa-mbb-marquette", name: "Marquette Golden Eagles", shortName: "Marquette", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-milwaukee", conference: "Big East" },
  { id: "ncaa-mbb-michigan", name: "Michigan Wolverines", shortName: "Michigan", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-ann-arbor", conference: "Big Ten" },
  { id: "ncaa-mbb-michigan-state", name: "Michigan State Spartans", shortName: "Michigan St", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-east-lansing", conference: "Big Ten" },
  { id: "ncaa-mbb-north-carolina", name: "North Carolina Tar Heels", shortName: "UNC", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-chapel-hill", conference: "ACC" },
  { id: "ncaa-mbb-ohio-state", name: "Ohio State Buckeyes", shortName: "Ohio State", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-columbus-oh", conference: "Big Ten" },
  { id: "ncaa-mbb-oregon", name: "Oregon Ducks", shortName: "Oregon", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-eugene", conference: "Big Ten" },
  { id: "ncaa-mbb-purdue", name: "Purdue Boilermakers", shortName: "Purdue", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-west-lafayette", conference: "Big Ten" },
  { id: "ncaa-mbb-tennessee", name: "Tennessee Volunteers", shortName: "Tennessee", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-knoxville", conference: "SEC" },
  { id: "ncaa-mbb-texas", name: "Texas Longhorns", shortName: "Texas", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-austin", conference: "SEC" },
  { id: "ncaa-mbb-uconn", name: "UConn Huskies", shortName: "UConn", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-storrs", conference: "Big East" },
  { id: "ncaa-mbb-ucla", name: "UCLA Bruins", shortName: "UCLA", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-los-angeles-ucla", conference: "Big Ten" },
  { id: "ncaa-mbb-villanova", name: "Villanova Wildcats", shortName: "Villanova", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-philadelphia", conference: "Big East" },
  { id: "ncaa-mbb-virginia", name: "Virginia Cavaliers", shortName: "Virginia", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-charlottesville", conference: "ACC" },
  { id: "ncaa-mbb-washington", name: "Washington Huskies", shortName: "Washington", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-seattle", conference: "Big Ten" },
  { id: "ncaa-mbb-wisconsin", name: "Wisconsin Badgers", shortName: "Wisconsin", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-madison", conference: "Big Ten" },
  { id: "ncaa-mbb-colorado", name: "Colorado Buffaloes", shortName: "Colorado", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-boulder", conference: "Big 12" },
  { id: "ncaa-mbb-tcu", name: "TCU Horned Frogs", shortName: "TCU", leagueId: "NCAA_MBB", isCollege: true, marketId: "us-dallas", conference: "Big 12" },

  // ========== NCAA WOMEN'S BASKETBALL (Major Programs) ==========
  { id: "ncaa-wbb-uconn", name: "UConn Huskies", shortName: "UConn", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-storrs", conference: "Big East" },
  { id: "ncaa-wbb-south-carolina", name: "South Carolina Gamecocks", shortName: "S. Carolina", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-columbia-sc", conference: "SEC" },
  { id: "ncaa-wbb-lsu", name: "LSU Tigers", shortName: "LSU", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-baton-rouge", conference: "SEC" },
  { id: "ncaa-wbb-iowa", name: "Iowa Hawkeyes", shortName: "Iowa", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-iowa-city", conference: "Big Ten" },
  { id: "ncaa-wbb-stanford", name: "Stanford Cardinal", shortName: "Stanford", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-palo-alto", conference: "ACC" },
  { id: "ncaa-wbb-notre-dame", name: "Notre Dame Fighting Irish", shortName: "Notre Dame", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-south-bend", conference: "ACC" },
  { id: "ncaa-wbb-tennessee", name: "Tennessee Lady Volunteers", shortName: "Tennessee", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-knoxville", conference: "SEC" },
  { id: "ncaa-wbb-baylor", name: "Baylor Lady Bears", shortName: "Baylor", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-waco", conference: "Big 12" },
  { id: "ncaa-wbb-ucla", name: "UCLA Bruins", shortName: "UCLA", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-los-angeles-ucla", conference: "Big Ten" },
  { id: "ncaa-wbb-usc", name: "USC Trojans", shortName: "USC", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-los-angeles-usc", conference: "Big Ten" },
  { id: "ncaa-wbb-maryland", name: "Maryland Terrapins", shortName: "Maryland", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-washington", conference: "Big Ten" },
  { id: "ncaa-wbb-oregon", name: "Oregon Ducks", shortName: "Oregon", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-eugene", conference: "Big Ten" },
  { id: "ncaa-wbb-ohio-state", name: "Ohio State Buckeyes", shortName: "Ohio State", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-columbus-oh", conference: "Big Ten" },
  { id: "ncaa-wbb-indiana", name: "Indiana Hoosiers", shortName: "Indiana", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-bloomington", conference: "Big Ten" },
  { id: "ncaa-wbb-texas", name: "Texas Longhorns", shortName: "Texas", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-austin", conference: "SEC" },
  { id: "ncaa-wbb-michigan", name: "Michigan Wolverines", shortName: "Michigan", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-ann-arbor", conference: "Big Ten" },
  { id: "ncaa-wbb-louisville", name: "Louisville Cardinals", shortName: "Louisville", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-louisville-ky", conference: "ACC" },
  { id: "ncaa-wbb-duke", name: "Duke Blue Devils", shortName: "Duke", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-durham", conference: "ACC" },
  { id: "ncaa-wbb-nc-state", name: "NC State Wolfpack", shortName: "NC State", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-raleigh", conference: "ACC" },
  { id: "ncaa-wbb-virginia-tech", name: "Virginia Tech Hokies", shortName: "Virginia Tech", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-blacksburg", conference: "ACC" },
  { id: "ncaa-wbb-purdue", name: "Purdue Boilermakers", shortName: "Purdue", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-west-lafayette", conference: "Big Ten" },
  { id: "ncaa-wbb-michigan-state", name: "Michigan State Spartans", shortName: "Michigan St", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-east-lansing", conference: "Big Ten" },
  { id: "ncaa-wbb-wisconsin", name: "Wisconsin Badgers", shortName: "Wisconsin", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-madison", conference: "Big Ten" },
  { id: "ncaa-wbb-georgia", name: "Georgia Lady Bulldogs", shortName: "Georgia", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-athens", conference: "SEC" },
  { id: "ncaa-wbb-alabama", name: "Alabama Crimson Tide", shortName: "Alabama", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-tuscaloosa", conference: "SEC" },
  { id: "ncaa-wbb-florida", name: "Florida Gators", shortName: "Florida", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-gainesville", conference: "SEC" },
  { id: "ncaa-wbb-mississippi-state", name: "Mississippi State Bulldogs", shortName: "Miss State", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-starkville", conference: "SEC" },
  { id: "ncaa-wbb-oklahoma", name: "Oklahoma Sooners", shortName: "Oklahoma", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-norman", conference: "SEC" },
  { id: "ncaa-wbb-texas-am", name: "Texas A&M Aggies", shortName: "Texas A&M", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-college-station", conference: "SEC" },
  { id: "ncaa-wbb-arkansas", name: "Arkansas Razorbacks", shortName: "Arkansas", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-fayetteville", conference: "SEC" },
  { id: "ncaa-wbb-auburn", name: "Auburn Tigers", shortName: "Auburn", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-auburn", conference: "SEC" },
  { id: "ncaa-wbb-miami", name: "Miami Hurricanes", shortName: "Miami", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-miami", conference: "ACC" },
  { id: "ncaa-wbb-kansas", name: "Kansas Jayhawks", shortName: "Kansas", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-lawrence", conference: "Big 12" },
  { id: "ncaa-wbb-tcu", name: "TCU Horned Frogs", shortName: "TCU", leagueId: "NCAA_WBB", isCollege: true, marketId: "us-dallas", conference: "Big 12" },
];

// Lookup helpers
export const TEAM_BY_ID: Record<string, Team> = TEAMS.reduce((acc, team) => {
  acc[team.id] = team;
  return acc;
}, {} as Record<string, Team>);

export function getTeamById(id: string): Team | undefined {
  return TEAM_BY_ID[id];
}

export function getTeamsByLeague(leagueId: string): Team[] {
  return TEAMS.filter(t => t.leagueId === leagueId);
}

export function getTeamsByMarket(marketId: string): Team[] {
  return TEAMS.filter(t => t.marketId === marketId);
}

export function getTeamsByConference(conference: string): Team[] {
  return TEAMS.filter(t => t.conference === conference);
}

export function searchTeams(query: string): Team[] {
  const q = query.toLowerCase();
  return TEAMS.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.shortName.toLowerCase().includes(q) ||
    t.conference?.toLowerCase().includes(q)
  );
}

export function matchTeamByName(name: string): Team | undefined {
  const normalized = name.toLowerCase().trim();
  return TEAMS.find(t => 
    t.name.toLowerCase() === normalized ||
    t.shortName.toLowerCase() === normalized ||
    normalized.includes(t.shortName.toLowerCase()) ||
    normalized.includes(t.name.toLowerCase())
  );
}
