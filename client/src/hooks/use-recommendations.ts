import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRecommendations() {
  return useQuery({
    queryKey: [api.recommendations.list.path],
    queryFn: async () => {
      const res = await fetch(api.recommendations.list.path);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return api.recommendations.list.responses[200].parse(await res.json());
    },
  });
}

export function useApplyRecommendation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tvId, gameId }: { tvId: number; gameId: number }) => {
      const res = await fetch(api.recommendations.apply.path, {
        method: api.recommendations.apply.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tvId, gameId }),
      });
      if (!res.ok) throw new Error("Failed to apply recommendation");
      return api.recommendations.apply.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.recommendations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.tvs.list.path] });
    },
  });
}
