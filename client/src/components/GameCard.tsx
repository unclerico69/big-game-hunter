import { type Game } from "@shared/schema";
import { Clock, Tv, Star, Flame } from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

interface GameCardProps {
  game: Game & { hotnessScore?: number; relevanceScore?: number; reasons?: string[] };
  compact?: boolean;
  action?: React.ReactNode;
}

export function GameCard({ game, compact = false, action }: GameCardProps) {
  const isLive = game.status === "Live";
  const hotness = game.hotnessScore ?? 0;
  const relevance = game.relevanceScore ?? game.relevance ?? 0;
  const isHot = hotness > 50;

  const relevanceColor = 
    relevance > 80 ? "bg-green-500" :
    relevance > 50 ? "bg-yellow-500" : "bg-slate-500";

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors border border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-red-500 animate-pulse" : "bg-slate-500"}`} />
          <div>
            <div className="text-sm font-medium text-foreground flex items-center gap-2">
              {game.teamA} <span className="text-muted-foreground text-xs">vs</span> {game.teamB}
              {isHot && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />}
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
             {relevance}% Match
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
          style={{ height: `${relevance}%` }} 
        />
      </div>

      <div className="pl-5 p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground">
              {game.league}
            </span>
            {isLive && (
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500 animate-pulse border border-red-500/20 flex items-center gap-1">
                LIVE
                {isHot && <Flame className="w-2.5 h-2.5 fill-red-500" />}
              </span>
            )}
            {game.assignedTvCount && game.assignedTvCount > 0 ? (
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground flex items-center gap-1 shadow-sm">
                <Tv className="w-2.5 h-2.5" />
                On {game.assignedTvCount} TV{game.assignedTvCount > 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
            <Tv className="w-3 h-3" />
            {game.channel}
          </div>
        </div>

        {/* Score display for live games */}
        {isLive && (game as any).homeScore !== null && (game as any).awayScore !== null ? (
          <div className="space-y-1 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-display font-bold leading-tight flex items-center gap-2">
                {game.teamA}
              </span>
              <span className="text-2xl font-black tabular-nums">{(game as any).homeScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-display font-bold leading-tight">
                {game.teamB}
              </span>
              <span className="text-2xl font-black tabular-nums">{(game as any).awayScore}</span>
            </div>
            {(game as any).period && (
              <div className="text-xs font-medium text-muted-foreground mt-1">
                {(game as any).period}
                {(game as any).timeRemaining !== null && ` • ${Math.floor((game as any).timeRemaining / 60)}:${String((game as any).timeRemaining % 60).padStart(2, '0')}`}
                {(game as any).isOvertime && <span className="text-orange-500 font-bold ml-2">OT</span>}
              </div>
            )}
            {isHot && <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />}
          </div>
        ) : (
          <h3 className="text-lg font-display font-bold leading-tight mb-1 flex items-center gap-2">
            {game.teamA} <span className="text-muted-foreground font-normal mx-1">vs</span> {game.teamB}
            {isHot && <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />}
          </h3>
        )}
        
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {format(new Date(game.startTime), "h:mm a")}
          {!isLive && <span className="text-xs opacity-60">({format(new Date(game.startTime), "MMM d")})</span>}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <Star className={clsx("w-4 h-4", relevance > 80 ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")} />
            <span className="text-sm font-semibold">{relevance}</span>
            <span className="text-xs text-muted-foreground">Relevance</span>
          </div>
          {isHot && (
            <div className="flex items-center gap-1 text-orange-500 font-bold text-xs uppercase tracking-tighter">
              <Flame className="w-3 h-3 fill-orange-500" />
              Hotness: {hotness}
            </div>
          )}
          {action && <div className="ml-auto">{action}</div>}
        </div>
        {(game as any).reasons && (game as any).reasons.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-1.5">
              {(game as any).reasons.map((reason: string, i: number) => (
                <span 
                  key={i} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary/50 text-secondary-foreground border border-secondary"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
