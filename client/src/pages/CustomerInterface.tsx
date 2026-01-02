import { useQuery, useMutation } from "@tanstack/react-query";
import { Game, Tv } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { GiBeerStein } from "react-icons/gi";
import { Loader2, Tv2, Trophy } from "lucide-react";

export default function CustomerInterface() {
  const { toast } = useToast();
  const [selectedTv, setSelectedTv] = useState<string>("");
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [tableNumber, setTableNumber] = useState("");

  const { data: tvs, isLoading: loadingTvs } = useQuery<Tv[]>({
    queryKey: ["/api/tvs"],
  });

  const { data: games, isLoading: loadingGames } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const requestMutation = useMutation({
    mutationFn: async (data: { tvId: number; gameId: number }) => {
      const res = await apiRequest("POST", "/api/requests", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Sent!",
        description: "Our staff will review your request shortly.",
      });
      setSelectedTv("");
      setSelectedGame("");
    },
  });

  const beerMutation = useMutation({
    mutationFn: async (data: { type: string; tableNumber: string }) => {
      const res = await apiRequest("POST", "/api/beers/order", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Creamy Boy Inbound!",
        description: "A fresh one is being poured for table " + tableNumber,
      });
    },
  });

  const handleRequest = () => {
    if (!selectedTv || !selectedGame) return;
    requestMutation.mutate({
      tvId: parseInt(selectedTv),
      gameId: parseInt(selectedGame),
    });
  };

  const handleBeerOrder = () => {
    if (!tableNumber) {
      toast({
        title: "Table Number Required",
        description: "Please enter your table number first.",
        variant: "destructive",
      });
      return;
    }
    beerMutation.mutate({ type: "Creamy Boy", tableNumber });
  };

  if (loadingTvs || loadingGames) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-display font-bold text-primary">Customer Portal</h1>
        <p className="text-muted-foreground">Request a game on any TV and enjoy a cold one.</p>
      </div>

      <Card className="glass-panel border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tv2 className="w-5 h-5 text-primary" />
            Request a TV Station
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select a TV</label>
            <Select value={selectedTv} onValueChange={setSelectedTv}>
              <SelectTrigger>
                <SelectValue placeholder="Which screen?" />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Select a Game</label>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger>
                <SelectValue placeholder="What do you want to watch?" />
              </SelectTrigger>
              <SelectContent>
                {games?.map((game) => (
                  <SelectItem key={game.id} value={game.id.toString()}>
                    {game.title} - {game.league}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full h-12 text-lg font-bold"
            onClick={handleRequest}
            disabled={!selectedTv || !selectedGame || requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trophy className="w-5 h-5 mr-2" />
            )}
            Submit Request
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GiBeerStein className="w-6 h-6 text-primary" />
            Liquid Gold
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Table Number</label>
            <Input 
              placeholder="e.g. 42" 
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <Button 
            variant="default" 
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-lg shadow-primary/20"
            onClick={handleBeerOrder}
            disabled={beerMutation.isPending}
          >
            <GiBeerStein className="w-8 h-8 mr-3 animate-bounce" />
            Deliver a Creamy Boy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
