import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { Loader2, Save, ArrowUp, ArrowDown, Trash2, Trophy, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TEAMS } from "@shared/data/teams";
import { MARKETS } from "@shared/data/markets";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  const [leagues, setLeagues] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<{ id: string; priority: number }[]>([]);
  const [favoriteMarkets, setFavoriteMarkets] = useState<{ id: string; priority: number }[]>([]);
  
  const [teamSearch, setTeamSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");

  useEffect(() => {
    if (prefs) {
      setLeagues(prefs.leaguePriority || []);
      setFavoriteTeams((prefs.favoriteTeams as any[]) || []);
      setFavoriteMarkets((prefs.favoriteMarkets as any[]) || []);
    }
  }, [prefs]);

  const handleSave = () => {
    updatePrefs.mutate({
      leaguePriority: leagues,
      favoriteTeams,
      favoriteMarkets,
      hardRules: prefs?.hardRules || {}
    }, {
      onSuccess: () => toast({ title: "Preferences Saved", description: "Algorithm weights updated." })
    });
  };

  const toggleTeam = (teamId: string) => {
    setFavoriteTeams(prev => {
      const exists = prev.find(t => t.id === teamId);
      if (exists) {
        return prev.filter(t => t.id !== teamId);
      }
      return [...prev, { id: teamId, priority: prev.length }];
    });
  };

  const toggleMarket = (marketId: string) => {
    setFavoriteMarkets(prev => {
      const exists = prev.find(m => m.id === marketId);
      if (exists) {
        return prev.filter(m => m.id !== marketId);
      }
      return [...prev, { id: marketId, priority: prev.length }];
    });
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

  const filteredTeams = TEAMS.filter(t => 
    t.name.toLowerCase().includes(teamSearch.toLowerCase()) || 
    t.league.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredMarkets = MARKETS.filter(m => 
    m.name.toLowerCase().includes(marketSearch.toLowerCase())
  );

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
            <CardDescription>Search and prioritize teams.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search teams..." 
                className="pl-9"
                value={teamSearch}
                onChange={e => setTeamSearch(e.target.value)}
              />
            </div>
            
            {/* Selected Teams with Reordering */}
            {favoriteTeams.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Priority Order</p>
                {favoriteTeams.map((fav, idx) => {
                  const team = TEAMS.find(t => t.id === fav.id);
                  if (!team) return null;
                  return (
                    <div key={fav.id} className="flex items-center justify-between bg-primary/5 p-2 rounded border border-primary/10">
                      <span className="text-sm font-medium">{team.name}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveTeam(idx, 'up')} disabled={idx === 0}>
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveTeam(idx, 'down')} disabled={idx === favoriteTeams.length - 1}>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => toggleTeam(fav.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border/50 max-h-[300px] overflow-y-auto pr-2">
              {filteredTeams.map(team => (
                <div key={team.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={team.id} 
                    checked={favoriteTeams.some(t => t.id === team.id)}
                    onCheckedChange={() => toggleTeam(team.id)}
                  />
                  <Label htmlFor={team.id} className="text-sm font-normal cursor-pointer flex-1">
                    {team.name} <span className="text-xs text-muted-foreground ml-1">({team.league})</span>
                  </Label>
                </div>
              ))}
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
            <CardDescription>Search and prioritize regions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search markets..." 
                className="pl-9"
                value={marketSearch}
                onChange={e => setMarketSearch(e.target.value)}
              />
            </div>

            {/* Selected Markets with Reordering */}
            {favoriteMarkets.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Priority Order</p>
                {favoriteMarkets.map((fav, idx) => {
                  const market = MARKETS.find(m => m.id === fav.id);
                  if (!market) return null;
                  return (
                    <div key={fav.id} className="flex items-center justify-between bg-primary/5 p-2 rounded border border-primary/10">
                      <span className="text-sm font-medium">{market.name}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveMarket(idx, 'up')} disabled={idx === 0}>
                          <ArrowUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveMarket(idx, 'down')} disabled={idx === favoriteMarkets.length - 1}>
                          <ArrowDown className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => toggleMarket(fav.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-border/50 max-h-[300px] overflow-y-auto pr-2">
              {filteredMarkets.map(market => (
                <div key={market.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={market.id} 
                    checked={favoriteMarkets.some(m => m.id === market.id)}
                    onCheckedChange={() => toggleMarket(market.id)}
                  />
                  <Label htmlFor={market.id} className="text-sm font-normal cursor-pointer flex-1">
                    {market.name}
                  </Label>
                </div>
              ))}
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
              <Switch checked={true} />
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
