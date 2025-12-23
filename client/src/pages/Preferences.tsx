import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { Loader2, Save, ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();

  // Local state for form
  const [leagues, setLeagues] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [newTeam, setNewTeam] = useState("");

  // Sync state when data loads
  useEffect(() => {
    if (prefs) {
      setLeagues(prefs.leaguePriority || []);
      setTeams(prefs.favoriteTeams || []);
    }
  }, [prefs]);

  const handleSave = () => {
    updatePrefs.mutate({
      leaguePriority: leagues,
      favoriteTeams: teams,
      hardRules: prefs?.hardRules || {}
    }, {
      onSuccess: () => toast({ title: "Preferences Saved", description: "Algorithm weights updated." })
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

  const addTeam = () => {
    if (newTeam && !teams.includes(newTeam)) {
      setTeams([...teams, newTeam]);
      setNewTeam("");
    }
  };

  const removeTeam = (team: string) => {
    setTeams(teams.filter(t => t !== team));
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
        
        {/* League Priority Card */}
        <Card className="bg-card border-border">
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
              {leagues.length === 0 && <p className="text-muted-foreground text-sm">No leagues configured.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Favorite Teams Card */}
        <Card className="bg-card border-border">
           <CardHeader>
            <CardTitle>Home Teams</CardTitle>
            <CardDescription>Always prioritize games featuring these teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Input 
                placeholder="Add team (e.g. Lakers)" 
                value={newTeam} 
                onChange={e => setNewTeam(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTeam()}
              />
              <Button size="icon" onClick={addTeam}><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {teams.map(team => (
                <span key={team} className="inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium animate-in fade-in zoom-in">
                  {team}
                  <button onClick={() => removeTeam(team)} className="hover:text-foreground">
                    <Trash2 className="w-3 h-3 ml-1" />
                  </button>
                </span>
              ))}
               {teams.length === 0 && <p className="text-muted-foreground text-sm italic">No favorites added.</p>}
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
