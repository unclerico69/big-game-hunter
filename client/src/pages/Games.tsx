import { useState } from "react";
import { useGames } from "@/hooks/use-games";
import { useTvs } from "@/hooks/use-tvs";
import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Games() {
  const { data: games, isLoading } = useGames();
  const { data: tvs } = useTvs();
  const { toast } = useToast();
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedTvId, setSelectedTvId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedGameId || !selectedTvId) return;
    
    setIsAssigning(true);
    try {
      await apiRequest("POST", `/api/tvs/${selectedTvId}/assign-game`, {
        gameId: selectedGameId,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/tvs"] });
      
      toast({
        title: "Success",
        description: "Game assigned successfully. Auto-mode disabled for this TV.",
      });
      
      setIsModalOpen(false);
      setSelectedGameId(null);
      setSelectedTvId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
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

  const liveGames = games?.filter((g) => g.status === "Live") || [];
  const upcomingGames = games?.filter((g) => g.status === "Upcoming") || [];

  return (
    <Layout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Schedule</h1>
          <p className="text-muted-foreground">All sporting events across available networks</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-card rounded-lg border border-border flex flex-col items-center min-w-[100px]">
            <span className="text-2xl font-display font-bold text-primary">{liveGames.length}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider text-center">Live</span>
          </div>
          <div className="px-4 py-2 bg-card rounded-lg border border-border flex flex-col items-center min-w-[100px]">
             <span className="text-2xl font-display font-bold text-foreground">{upcomingGames.length}</span>
             <span className="text-xs text-muted-foreground uppercase tracking-wider text-center">Upcoming</span>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {liveGames.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-6 bg-red-500 rounded-sm" />
              <h2 className="text-xl font-bold text-foreground">Live Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  action={
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Assign to TV
                    </Button>
                  }
                />
              ))}
            </div>
          </section>
        )}

        {upcomingGames.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-6 bg-primary rounded-sm" />
              <h2 className="text-xl font-bold text-foreground">Upcoming Games</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  action={
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedGameId(game.id);
                        setIsModalOpen(true);
                      }}
                    >
                      Assign to TV
                    </Button>
                  }
                />
              ))}
            </div>
          </section>
        )}

        {liveGames.length === 0 && upcomingGames.length === 0 && (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground text-lg">No games found in the schedule.</p>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Game to TV</DialogTitle>
            <DialogDescription>
              Select a TV display to broadcast this game.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedTvId} onValueChange={setSelectedTvId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a TV..." />
              </SelectTrigger>
              <SelectContent>
                {tvs?.map((tv) => (
                  <SelectItem key={tv.id} value={tv.id.toString()}>
                    {tv.name} ({tv.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isAssigning}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedTvId || isAssigning}>
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Confirm Assignment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
