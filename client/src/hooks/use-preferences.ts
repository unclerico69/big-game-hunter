import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type InsertPreference } from "@shared/schema";

export function usePreferences() {
  return useQuery({
    queryKey: [api.preferences.get.path],
    queryFn: async () => {
      const res = await fetch(api.preferences.get.path);
      if (!res.ok) throw new Error("Failed to fetch preferences");
      return api.preferences.get.responses[200].parse(await res.json());
    },
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPreference) => {
      const res = await fetch(api.preferences.update.path, {
        method: api.preferences.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      return api.preferences.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.preferences.get.path] });
    },
  });
}
