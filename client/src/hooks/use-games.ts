import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

export function useGames(status?: 'Live' | 'Scheduled' | 'Ended' | 'All') {
  return useQuery({
    queryKey: [api.games.list.path, status],
    queryFn: async () => {
      const url = new URL(api.games.list.path, window.location.origin);
      if (status) {
        url.searchParams.append("status", status);
      }
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch games");
      return api.games.list.responses[200].parse(await res.json());
    },
  });
}
