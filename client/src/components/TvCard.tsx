import { type Tv, type Game } from "@shared/schema";
import { Lock, Unlock, Monitor, Power, MoreVertical, RefreshCw, XCircle } from "lucide-react";
import { clsx } from "clsx";
import { useUpdateTv, useClearTv } from "@/hooks/use-tvs";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TvCardProps {
  tv: Tv;
  game?: Game;
}

export function TvCard({ tv, game }: TvCardProps) {
  const updateTv = useUpdateTv();
  const clearTv = useClearTv();
  const { toast } = useToast();
  const isLocked = tv.lockedUntil && new Date(tv.lockedUntil) > new Date();
  
  const handleLock = (minutes: number) => {
    updateTv.mutate(
      { id: tv.id, lockDuration: minutes, manualOverride: true },
      {
        onSuccess: () => {
          toast({ title: "TV Locked", description: `Locked ${tv.name} for ${minutes} minutes.` });
        }
      }
    );
  };

  const handleUnlock = () => {
    updateTv.mutate(
      { id: tv.id, lockDuration: 0, manualOverride: false },
      {
        onSuccess: () => {
          toast({ title: "TV Unlocked", description: `${tv.name} returned to auto mode.` });
        }
      }
    );
  };

  const handleClear = () => {
    clearTv.mutate(tv.id, {
      onSuccess: () => {
        toast({ title: "TV Cleared", description: `${tv.name} is now available.` });
      }
    });
  };


  const statusColor = 
    tv.status === "error" ? "bg-red-500" :
    tv.status === "off" ? "bg-slate-600" :
    isLocked ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden flex flex-col h-full group">
      {/* Header */}
      <div className="p-4 bg-secondary/20 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            <div className={clsx("absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-card", statusColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-none text-foreground">{tv.name}</h3>
            <span className="text-xs text-muted-foreground">{tv.location}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-secondary/80">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {isLocked ? (
              <DropdownMenuItem onClick={handleUnlock}>
                <Unlock className="w-4 h-4 mr-2" /> Unlock (Auto)
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onClick={() => handleLock(30)}>
                  <Lock className="w-4 h-4 mr-2" /> Lock for 30m
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLock(60)}>
                  <Lock className="w-4 h-4 mr-2" /> Lock for 1h
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLock(120)}>
                  <Lock className="w-4 h-4 mr-2" /> Lock for 2h
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator className="bg-border" />
            {tv.currentGameId && (
              <DropdownMenuItem onClick={handleClear}>
                <XCircle className="w-4 h-4 mr-2" /> Clear Game
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-500 focus:text-red-500">
              <Power className="w-4 h-4 mr-2" /> Turn Off
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-center items-center text-center relative">
        {game ? (
          <>
            <div className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">{game.league}</div>
            <h4 className="text-lg font-display font-bold mb-1 line-clamp-2">
              {game.teamA} vs {game.teamB}
            </h4>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 text-xs font-mono text-muted-foreground mt-2 border border-border/50">
              CH: {game.channel}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <RefreshCw className="w-8 h-8 animate-spin-slow" />
            <span className="text-sm">Tuning...</span>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="px-4 py-3 bg-secondary/10 border-t border-border flex justify-between items-center">
        <div className="text-xs font-medium">
          {isLocked ? (
             <span className="text-amber-500 flex items-center gap-1">
               <Lock className="w-3 h-3" /> Manual
             </span>
          ) : (
            <span className="text-green-500 flex items-center gap-1">
               <RefreshCw className="w-3 h-3" /> Auto
             </span>
          )}
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          {tv.priority} Priority
        </div>
      </div>
    </div>
  );
}
