import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-preferences";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Save, Trash2, Trophy, MapPin, Search, Plus, GripVertical, Layers, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { TEAMS, getTeamById } from "@shared/data/teams";
import { MARKETS, getMarketById } from "@shared/data/markets";
import { LEAGUES, getLeagueById, getDefaultLeaguePriority } from "@shared/data/leagues";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TvProvider {
  id: number;
  name: string;
  country: string;
}
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
        data-testid={`drag-handle-${id}`}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      {children}
    </div>
  );
}

export default function Preferences() {
  const { data: prefs, isLoading } = usePreferences();
  const updatePrefs = useUpdatePreferences();
  
  const { data: providers = [] } = useQuery<TvProvider[]>({
    queryKey: ["/api/providers"],
  });

  const [leagues, setLeagues] = useState<string[]>([]);
  const [favoriteTeams, setFavoriteTeams] = useState<{ id: string; priority: number }[]>([]);
  const [favoriteMarkets, setFavoriteMarkets] = useState<{ id: string; priority: number }[]>([]);
  const [preventRapidSwitching, setPreventRapidSwitching] = useState(true);
  const [tvProviderId, setTvProviderId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (prefs) {
      const savedLeagues = prefs.leaguePriority || [];
      if (savedLeagues.length === 0) {
        setLeagues(getDefaultLeaguePriority());
      } else {
        const allLeagueIds = LEAGUES.map(l => l.id);
        const missing = allLeagueIds.filter(id => !savedLeagues.includes(id));
        setLeagues([...savedLeagues, ...missing]);
      }
      setFavoriteTeams((prefs.favoriteTeams as any[]) || []);
      setFavoriteMarkets((prefs.favoriteMarkets as any[]) || []);
      setPreventRapidSwitching(prefs.preventRapidSwitching ?? true);
      setTvProviderId((prefs as any).tvProviderId ?? null);
    }
  }, [prefs]);

  const handleSave = () => {
    updatePrefs.mutate({
      venueId: 1,
      version: prefs?.version || 1,
      leaguePriority: leagues,
      favoriteTeams,
      favoriteMarkets,
      preventRapidSwitching,
      tvProviderId,
    } as any, {
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

  const handleTeamDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFavoriteTeams((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((t, i) => ({ ...t, priority: i }));
      });
    }
  };

  const handleMarketDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setFavoriteMarkets((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((m, i) => ({ ...m, priority: i }));
      });
    }
  };

  const handleLeagueDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLeagues((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const [teamSearch, setTeamSearch] = useState("");
  const [marketSearch, setMarketSearch] = useState("");
  const [showTeamResults, setShowTeamResults] = useState(false);
  const [showMarketResults, setShowMarketResults] = useState(false);

  const filteredTeams = teamSearch.length >= 2 
    ? TEAMS.filter(t => 
        !favoriteTeams.some(fav => fav.id === t.id) &&
        (t.name.toLowerCase().includes(teamSearch.toLowerCase()) || 
         t.shortName.toLowerCase().includes(teamSearch.toLowerCase()) ||
         t.leagueId.toLowerCase().includes(teamSearch.toLowerCase()) ||
         (t.conference?.toLowerCase().includes(teamSearch.toLowerCase()) ?? false))
      ).slice(0, 10)
    : [];

  const filteredMarkets = marketSearch.length >= 1
    ? MARKETS.filter(m => 
        !favoriteMarkets.some(fav => fav.id === m.id) &&
        (m.name.toLowerCase().includes(marketSearch.toLowerCase()) ||
         m.region.toLowerCase().includes(marketSearch.toLowerCase()))
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
        <Button onClick={handleSave} disabled={updatePrefs.isPending} className="gap-2" data-testid="button-save-preferences">
          {updatePrefs.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Favorite Teams Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Home Teams
            </CardTitle>
            <CardDescription>Search and rank your favorite teams. Drag to reorder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search teams..." 
                className="pl-9"
                value={teamSearch}
                onChange={e => {
                  setTeamSearch(e.target.value);
                  setShowTeamResults(true);
                }}
                onBlur={() => setTimeout(() => setShowTeamResults(false), 200)}
                onFocus={() => setShowTeamResults(true)}
                data-testid="input-team-search"
              />
              {showTeamResults && teamSearch.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-[250px] overflow-y-auto">
                  {filteredTeams.length > 0 ? filteredTeams.map(team => {
                    const league = getLeagueById(team.leagueId);
                    return (
                      <button
                        key={team.id}
                        className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center justify-between text-sm transition-colors"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTeam(team.id);
                        }}
                        data-testid={`button-add-team-${team.id}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{team.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {league?.shortName || team.leagueId} {team.conference && `• ${team.conference}`}
                          </span>
                        </div>
                        <Plus className="w-4 h-4 text-primary" />
                      </button>
                    );
                  }) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground italic">No matches found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority Order (Drag to reorder)
              </p>
              {favoriteTeams.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleTeamDragEnd}>
                  <SortableContext items={favoriteTeams.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {favoriteTeams.map((fav, idx) => {
                        const team = getTeamById(fav.id);
                        if (!team) return null;
                        const league = getLeagueById(team.leagueId);
                        return (
                          <SortableItem key={fav.id} id={fav.id}>
                            <div className="flex-1 flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground w-5">{idx + 1}</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{team.name}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {league?.shortName} {team.isCollege && <Badge variant="outline" className="ml-1 text-[8px] py-0 px-1">NCAA</Badge>}
                                  </span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                onClick={() => removeTeam(fav.id)}
                                data-testid={`button-remove-team-${fav.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </SortableItem>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground italic">No teams added yet</p>
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
            <CardDescription>Search and rank priority regions. Drag to reorder.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search markets..." 
                className="pl-9"
                value={marketSearch}
                onChange={e => {
                  setMarketSearch(e.target.value);
                  setShowMarketResults(true);
                }}
                onBlur={() => setTimeout(() => setShowMarketResults(false), 200)}
                onFocus={() => setShowMarketResults(true)}
                data-testid="input-market-search"
              />
              {showMarketResults && marketSearch.length >= 1 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-[250px] overflow-y-auto">
                  {filteredMarkets.length > 0 ? filteredMarkets.map(market => (
                    <button
                      key={market.id}
                      className="w-full px-4 py-2 text-left hover:bg-secondary/50 flex items-center justify-between text-sm transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addMarket(market.id);
                      }}
                      data-testid={`button-add-market-${market.id}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{market.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {market.region} • {market.type === "college" ? "College" : market.type === "both" ? "Pro + College" : "Pro"}
                        </span>
                      </div>
                      <Plus className="w-4 h-4 text-primary" />
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-muted-foreground italic">No matches found</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority Order (Drag to reorder)
              </p>
              {favoriteMarkets.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleMarketDragEnd}>
                  <SortableContext items={favoriteMarkets.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {favoriteMarkets.map((fav, idx) => {
                        const market = getMarketById(fav.id);
                        if (!market) return null;
                        return (
                          <SortableItem key={fav.id} id={fav.id}>
                            <div className="flex-1 flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-muted-foreground w-5">{idx + 1}</span>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{market.name}</span>
                                  <span className="text-[10px] text-muted-foreground">{market.region}</span>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
                                onClick={() => removeMarket(fav.id)}
                                data-testid={`button-remove-market-${fav.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </SortableItem>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
                  <p className="text-sm text-muted-foreground italic">No markets added yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* League Priority Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              League Priority
            </CardTitle>
            <CardDescription>Order determines which games take precedence. Drag to reorder.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority Order (Top = Highest)
              </p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleLeagueDragEnd}>
                <SortableContext items={leagues} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {leagues.map((leagueId, idx) => {
                      const league = getLeagueById(leagueId);
                      if (!league) return null;
                      return (
                        <SortableItem key={leagueId} id={leagueId}>
                          <div className="flex-1 flex items-center justify-between bg-secondary/30 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-muted-foreground w-5">{idx + 1}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">{league.shortName}</span>
                                <span className="text-xs text-muted-foreground">{league.name}</span>
                                {league.isCollege && (
                                  <Badge variant="secondary" className="text-[10px] py-0">NCAA</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </CardContent>
        </Card>

        {/* System Rules Card */}
        <Card className="bg-card border-border lg:col-span-3">
          <CardHeader>
            <CardTitle>System Rules</CardTitle>
            <CardDescription>Hard constraints for the automation engine.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-primary" />
                <Label className="text-base">TV Provider</Label>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Select your cable/streaming provider for channel numbers.</p>
              <Select
                value={tvProviderId?.toString() || "none"}
                onValueChange={(value) => setTvProviderId(value === "none" ? null : parseInt(value))}
              >
                <SelectTrigger data-testid="select-tv-provider">
                  <SelectValue placeholder="Select provider..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No provider selected</SelectItem>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Prevent rapid switching</Label>
                <p className="text-sm text-muted-foreground">Keep a game on for at least 15 minutes before switching.</p>
              </div>
              <Switch 
                checked={preventRapidSwitching} 
                onCheckedChange={setPreventRapidSwitching}
                data-testid="switch-prevent-rapid-switching"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Audio Priority</Label>
                <p className="text-sm text-muted-foreground">Main Bar TV 1 always dictates house audio.</p>
              </div>
              <Switch checked={false} data-testid="switch-audio-priority" />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
