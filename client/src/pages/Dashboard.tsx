import { useTvs } from "@/hooks/use-tvs";
import { useGames } from "@/hooks/use-games";
import { TvCard } from "@/components/TvCard";
import { Layout } from "@/components/Layout";
import { Loader2, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const { data: tvs, isLoading: tvsLoading, error: tvsError } = useTvs();
  const { data: games, isLoading: gamesLoading } = useGames("Live");

  if (tvsLoading || gamesLoading) {
    return (
      <Layout>
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (tvsError) {
    return (
      <Layout>
        <div className="p-8 text-center text-destructive">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Failed to load system status</h2>
          <p className="opacity-80">Please check your connection and try again.</p>
        </div>
      </Layout>
    );
  }

  // Helper to find the game playing on a TV
  const getGameForTv = (gameId: number | null) => {
    if (!gameId) return undefined;
    const game = games?.find(g => g.id === gameId);
    return game;
  };

  const activeTvs = tvs?.filter(tv => tv.status !== "off") || [];
  const offTvs = tvs?.filter(tv => tv.status === "off") || [];

  return (
    <Layout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Live monitor of venue screens</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-card rounded-lg border border-border flex flex-col items-center min-w-[100px]">
            <span className="text-2xl font-display font-bold text-primary">{activeTvs.length}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Active TVs</span>
          </div>
          <div className="px-4 py-2 bg-card rounded-lg border border-border flex flex-col items-center min-w-[100px]">
             <span className="text-2xl font-display font-bold text-foreground">{games?.length || 0}</span>
             <span className="text-xs text-muted-foreground uppercase tracking-wider">Live Games</span>
          </div>
        </div>
      </header>

      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-primary rounded-sm" />
          <h2 className="text-xl font-bold text-foreground">Main Floor</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTvs.filter(tv => tv.location === "Main Bar" || tv.location === "Patio").map(tv => (
            <TvCard key={tv.id} tv={tv} game={getGameForTv(tv.currentGameId)} />
          ))}
        </div>
      </section>

      <section>
         <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 bg-secondary rounded-sm" />
          <h2 className="text-xl font-bold text-foreground">Secondary Areas</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeTvs.filter(tv => tv.location !== "Main Bar" && tv.location !== "Patio").map(tv => (
            <TvCard key={tv.id} tv={tv} game={getGameForTv(tv.currentGameId)} />
          ))}
          {/* Render OFF TVs here with opacity */}
          {offTvs.map(tv => (
             <div key={tv.id} className="opacity-50 grayscale pointer-events-none">
                <TvCard tv={tv} />
             </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
