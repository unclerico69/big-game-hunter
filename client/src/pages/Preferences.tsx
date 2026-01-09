import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { Loader2, Save, ArrowUp, ArrowDown, Trophy, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TEAMS } from "@shared/data/teams";
import { MARKETS } from "@shared/data/markets";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  const [leagues, setLeagues] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<{ id: string; priority: number }[]>([]);
  const [favoriteMarkets, setFavoriteMarkets] = useState<{ id: string; priority: number }[]>([]);

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

  const moveLeague = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...leagues];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setLeagues(newOrder);
  };

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
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Home Teams
            </CardTitle>
            <CardDescription>Select teams to prioritize.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TEAMS.map(team => (
                <div key={team.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={team.id} 
                    checked={favoriteTeams.some(t => t.id === team.id)}
                    onCheckedChange={() => toggleTeam(team.id)}
                  />
                  <Label htmlFor={team.id} className="text-sm font-medium leading-none">
                    {team.name} ({team.league})
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Local Markets
            </CardTitle>
            <CardDescription>Boost games of interest for these regions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MARKETS.map(market => (
                <div key={market.id} className="flex items-center space-x-3">
                  <Checkbox 
                    id={market.id} 
                    checked={favoriteMarkets.some(m => m.id === market.id)}
                    onCheckedChange={() => toggleMarket(market.id)}
                  />
                  <Label htmlFor={market.id} className="text-sm font-medium leading-none">
                    {market.name}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
