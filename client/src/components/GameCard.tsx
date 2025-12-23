import { type Game } from "@shared/schema";
import { Clock, Tv, Star, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

interface GameCardProps {
  game: Game;
  compact?: boolean;
}

export function GameCard({ game, compact = false }: GameCardProps) {
  const isLive = game.status === "Live";
  const relevanceColor = 
    game.relevance! > 80 ? "bg-green-500" :
    game.relevance! > 50 ? "bg-yellow-500" : "bg-slate-500";

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-slate-500"}`} />
          <div>
            <div className="text-sm font-medium text-foreground">
              {game.teamA} <span className="text-muted-foreground text-xs">vs</span> {game.teamB}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="font-bold text-primary/80">{game.league}</span>
              <span>•</span>
              <span>{game.channel}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
           <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1 bg-secondary`}>
             {game.relevance}% Match
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      {/* Relevance Stripe */}
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-secondary">
        <div 
          className={clsx("w-full transition-all duration-500", relevanceColor)} 
          style={{ height: `${game.relevance}%` }} 
        />
      </div>

      <div className="pl-5 p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground">
              {game.league}
            </span>
            {isLive && (
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 animate-pulse border border-red-500/20">
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            <Tv className="w-3 h-3" />
            {game.channel}
          </div>
        </div>

        <h3 className="text-lg font-display font-bold leading-tight mb-1">
          {game.teamA} <span className="text-muted-foreground font-normal mx-1">vs</span> {game.teamB}
        </h3>
        
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {format(new Date(game.startTime), "h:mm a")}
          {!isLive && <span className="text-xs opacity-60">({format(new Date(game.startTime), "MMM d")})</span>}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Star className={clsx("w-4 h-4", game.relevance! > 80 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
            <span className="text-sm font-semibold">{game.relevance}</span>
            <span className="text-xs text-muted-foreground">Relevance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
