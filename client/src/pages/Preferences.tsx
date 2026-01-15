import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { Loader2, Save, ArrowUp, ArrowDown, Trash2, Trophy, MapPin, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TEAMS } from "@shared/data/teams";
import { MARKETS } from "@shared/data/markets";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  const [leagues, setLeagues] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<{ id: string; priority: number }[]>([]);
  const [favoriteMarkets, setFavoriteMarkets] = useState<{ id: string; priority: number }[]>([]);
  const [preventRapidSwitching, setPreventRapidSwitching] = useState(true);

  useEffect(() => {
    if (prefs) {
      setLeagues(prefs.leaguePriority || []);
      setFavoriteTeams((prefs.favoriteTeams as any[]) || []);
      setFavoriteMarkets((prefs.favoriteMarkets as any[]) || []);
      setPreventRapidSwitching(prefs.preventRapidSwitching ?? true);
    }
  }, [prefs]);

  const handleSave = () => {
    updatePrefs.mutate({
      venueId: 1, // Default for MVP
      version: prefs?.version || 1,
      leaguePriority: leagues,
      favoriteTeams,
      favoriteMarkets,
      preventRapidSwitching,
    }, {
      onSuccess: () => toast({ title: "Preferences Saved", description: "Algorithm weights updated." })
    });
  };

  const addTeam = (teamId: string) => {
    if (!favoriteTeams.some(t => t.id === teamId)) {
      setFavoriteTeams(prev => [...prev, { id: teamId, priority: prev.length }]);
    }
    setTeamSearch("");
    setShowTeamResults(false);
  };

  const removeTeam = (teamId: string) => {
    const updated = favoriteTeams.filter(t => t.id !== teamId)
      .map((t, i) => ({ ...t, priority: i }));
    setFavoriteTeams(updated);
  };

  const addMarket = (marketId: string) => {
    if (!favoriteMarkets.some(m => m.id === marketId)) {
      setFavoriteMarkets(prev => [...prev, { id: marketId, priority: prev.length }]);
    }
    setMarketSearch("");
    setShowMarketResults(false);
  };

  const removeMarket = (marketId: string) => {
    const updated = favoriteMarkets.filter(m => m.id !== marketId)
      .map((m, i) => ({ ...m, priority: i }));
    setFavoriteMarkets(updated);
  };

  const moveTeam = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...favoriteTeams];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setFavoriteTeams(newOrder.map((t, i) => ({ ...t, priority: i })));
  };

  const moveMarket = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...favoriteMarkets];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setFavoriteMarkets(newOrder.map((m, i) => ({ ...m, priority: i })));
  };

  const moveLeague = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...leagues];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setLeagues(newOrder);
  };

  const [teamSearch, setTeamSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");
  const [showTeamResults, setShowTeamResults] = useState(false);
  const [showMarketResults, setShowMarketResults] = useState(false);

  const filteredTeams = teamSearch.length >= 2 
    ? TEAMS.filter(t => 
        !favoriteTeams.some(fav => fav.id === t.id) &&
        (t.name.toLowerCase().includes(teamSearch.toLowerCase()) || 
         t.league.toLowerCase().includes(teamSearch.toLowerCase()))
      ).slice(0, 10)
    : [];

  const filteredMarkets = marketSearch.length >= 1
    ? MARKETS.filter(m => 
        !favoriteMarkets.some(fav => fav.id === m.id) &&
        m.name.toLowerCase().includes(marketSearch.toLowerCase())
      ).slice(0, 10)
    : [];

  if (isLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Preferences</h1>
          <p className="text-muted-foreground">Customize the algorithm for your crowd</p>
        </div>
        <Button onClick={handleSave} disabled={updatePrefs.isPending} className="gap-2">
          {updatePrefs.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favorite Teams Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Home Teams
            </CardTitle>
            <CardDescription>Search and rank your favorite teams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search teams (e.g. Lakers)..." 
                className="pl-9"
                value={teamSearch}
                onChange={e => {
                  setTeamSearch(e.target.value);
                  setShowTeamResults(true);
                }}
                onBlur={() => setTimeout(() => setShowTeamResults(false), 200)}
                onFocus={() => setShowTeamResults(true)}
              />
              {showTeamResults && (teamSearch.length >= 2 || filteredTeams.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                  {filteredTeams.length > 0 ? filteredTeams.map(team => (
                    <button
                      key={team.id}
                      className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center justify-between text-sm transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTeam(team.id);
                      }}
                    >
                      <span>{team.name} <span className="text-xs text-muted-foreground">({team.league})</span></span>
                      <Plus className="w-3 h-3 text-primary" />
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground italic">No matches found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ranked Priority (Top = Highest)</p>
              {favoriteTeams.length > 0 ? (
                <div className="space-y-2">
                  {favoriteTeams.map((fav, idx) => {
                    const team = TEAMS.find(t => t.id === fav.id);
                    if (!team) return null;
                    return (
                      <div key={fav.id} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                          <span className="text-sm font-medium">{team.name} <span className="text-[10px] text-muted-foreground">({team.league})</span></span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveTeam(idx, 'up')} disabled={idx === 0}>
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveTeam(idx, 'down')} disabled={idx === favoriteTeams.length - 1}>
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeTeam(fav.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground italic">No teams added yet. Use search above.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Markets Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Local Markets
            </CardTitle>
            <CardDescription>Search and rank priority regions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search markets (e.g. Seattle)..." 
                className="pl-9"
                value={marketSearch}
                onChange={e => {
                  setMarketSearch(e.target.value);
                  setShowMarketResults(true);
                }}
                onBlur={() => setTimeout(() => setShowMarketResults(false), 200)}
                onFocus={() => setShowMarketResults(true)}
              />
              {showMarketResults && (marketSearch.length >= 1 || filteredMarkets.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-[200px] overflow-y-auto">
                  {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
                    <button
                      key={market.id}
                      className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center justify-between text-sm transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addMarket(market.id);
                      }}
                    >
                      <span>{market.name}</span>
                      <Plus className="w-3 h-3 text-primary" />
                    </button>
                  )) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground italic">No matches found</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ranked Priority (Top = Highest)</p>
              {favoriteMarkets.length > 0 ? (
                <div className="space-y-2">
                  {favoriteMarkets.map((fav, idx) => {
                    const market = MARKETS.find(m => m.id === fav.id);
                    if (!market) return null;
                    return (
                      <div key={fav.id} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 group hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                          <span className="text-sm font-medium">{market.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveMarket(idx, 'up')} disabled={idx === 0}>
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveMarket(idx, 'down')} disabled={idx === favoriteMarkets.length - 1}>
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeMarket(fav.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground italic">No markets added yet. Use search above.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* League Priority Card */}
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader>
            <CardTitle>League Priority</CardTitle>
            <CardDescription>Order determines which games take precedence when times conflict.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leagues.map((league, idx) => (
                <div key={league} className="flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border">
                  <span className="font-bold">{league}</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8" 
                      onClick={() => moveLeague(idx, 'up')}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => moveLeague(idx, 'down')}
                      disabled={idx === leagues.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Rules Card */}
        <Card className="bg-card border-border md:col-span-2">
           <CardHeader>
            <CardTitle>System Rules</CardTitle>
            <CardDescription>Hard constraints for the automation engine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Prevent rapid switching</Label>
                <p className="text-sm text-muted-foreground">Keep a game on for at least 15 minutes before switching.</p>
              </div>
              <Switch 
                checked={preventRapidSwitching} 
                onCheckedChange={setPreventRapidSwitching}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Audio Priority</Label>
                <p className="text-sm text-muted-foreground">Main Bar TV 1 always dictates house audio.</p>
              </div>
              <Switch checked={false} />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
