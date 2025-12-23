import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertTv } from "@shared/schema";
import { z } from "zod";

export function useTvs() {
  return useQuery({
    queryKey: [api.tvs.list.path],
    queryFn: async () => {
      const res = await fetch(api.tvs.list.path);
      if (!res.ok) throw new Error("Failed to fetch TVs");
      return api.tvs.list.responses[200].parse(await res.json());
    },
  });
}

export function useTv(id: number) {
  return useQuery({
    queryKey: [api.tvs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.tvs.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch TV");
      return api.tvs.get.responses[200].parse(await res.json());
    },
  });
}

type UpdateTvInput = z.infer<typeof api.tvs.update.input>;

export function useUpdateTv() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateTvInput) => {
      const url = buildUrl(api.tvs.update.path, { id });
      const res = await fetch(url, {
        method: api.tvs.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update TV");
      return api.tvs.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.tvs.list.path] });
    },
  });
}
