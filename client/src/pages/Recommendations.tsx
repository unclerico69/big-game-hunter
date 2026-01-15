import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useGames } from "@/hooks/use-games";
import { useTvs, useAssignTv } from "@/hooks/use-tvs";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2, AlertOctagon, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Recommendations() {
  const { data: recs, isLoading: recsLoading } = useRecommendations();
  const { data: games } = useGames("Live");
  const { data: tvs } = useTvs();
  const assignTv = useAssignTv();
  
  const [selectedRec, setSelectedRec] = useState<{tvId: number, gameId: number} | null>(null);

  const handleApply = (tvId: number, gameId: number) => {
    assignTv.mutate({ id: tvId, gameId }, {
      onSuccess: () => {
        toast({ title: "Optimized", description: "Recommendation applied successfully." });
        setSelectedRec(null);
      }
    });
  };

  if (recsLoading) {
     return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  // Combine data for display
  const richRecs = recs?.map(rec => {
    const game = games?.find(g => g.id === rec.gameId);
    const tv = tvs?.find(t => t.id === rec.tvId);
    return { ...rec, game, tv };
  }).filter(r => r.game && r.tv); // Ensure we have data

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Auto-Tuner</h1>
        <p className="text-muted-foreground">AI-driven channel optimization</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Left Column: Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Suggested Actions
            </h2>
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {richRecs?.length} Opportunities
            </span>
          </div>

          <div className="space-y-4">
            {richRecs?.length === 0 && (
              <div className="p-8 border border-dashed border-border rounded-xl text-center text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>System is fully optimized.</p>
              </div>
            )}
            
            {richRecs?.map((rec, idx) => (
              <div key={`${rec.tvId}-${rec.gameId}`} className="bg-card border border-border p-5 rounded-xl hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase">
                      Score: {rec.score}
                    </span>
                    <span className="text-xs text-muted-foreground border-l border-border pl-2">
                      {rec.reason}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Current TV</div>
                    <div className="font-bold text-foreground">{rec.tv?.name}</div>
                    <div className="text-xs opacity-60">{rec.tv?.location}</div>
                  </div>

                  <ArrowRight className="w-6 h-6 text-muted-foreground/50" />

                  <div className="flex-1 text-right">
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Switch To</div>
                    <div className="font-bold text-primary">{rec.game?.teamA} vs {rec.game?.teamB}</div>
                    <div className="text-xs opacity-60">{rec.game?.channel}</div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex justify-end">
                   <Dialog>
                    <DialogTrigger asChild>
                       <Button variant="default" className="w-full sm:w-auto" onClick={() => setSelectedRec({tvId: rec.tvId, gameId: rec.gameId})}>
                        Apply Optimization
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Channel Change</DialogTitle>
                        <DialogDescription>
                          This will immediately switch <strong>{rec.tv?.name}</strong> to channel <strong>{rec.game?.channel}</strong> for the {rec.game?.teamA} game.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedRec(null)}>Cancel</Button>
                        <Button onClick={() => handleApply(rec.tvId, rec.gameId)} disabled={assignTv.isPending}>
                          {assignTv.isPending ? "Applying..." : "Confirm Switch"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                   </Dialog>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Games Context */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
             <AlertOctagon className="w-5 h-5 text-blue-500" />
             Live High-Priority Events
          </h2>
          <div className="grid gap-4">
            {games?.filter(g => (g.relevance || 0) > 70).map(game => (
              <GameCard key={game.id} game={game} />
            ))}
             {(!games || games.length === 0) && (
              <div className="text-muted-foreground text-sm">No live games found.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
