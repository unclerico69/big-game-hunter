import { useGames } from "@/hooks/use-games";
import { Layout } from "@/components/Layout";
import { GameCard } from "@/components/GameCard";
import { Loader2, Calendar } from "lucide-react";

export default function Games() {
  const { data: games, isLoading } = useGames();

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
                <GameCard key={game.id} game={game} />
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
                <GameCard key={game.id} game={game} />
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
    </Layout>
  );
}
