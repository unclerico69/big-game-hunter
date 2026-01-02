import { storage } from "../storage";
import { Tv } from "@shared/schema";

/**
 * Checks if a TV is currently locked.
 * A lock is active if lockedUntil exists and is in the future.
 */
export async function isTvLocked(tvId: number): Promise<boolean> {
  const tv = await storage.getTv(tvId);
  if (!tv || !tv.lockedUntil) return false;
  return new Date(tv.lockedUntil) > new Date();
}

/**
 * Gets all active locks across the venue.
 */
export async function getActiveLocks(): Promise<{ tvId: number; lockedUntil: Date }[]> {
  const tvs = await storage.getTvs();
  const now = new Date();
  return tvs
    .filter(tv => tv.lockedUntil && new Date(tv.lockedUntil) > now)
    .map(tv => ({
      tvId: tv.id,
      lockedUntil: new Date(tv.lockedUntil!)
    }));
}

/**
 * Applies a lock to a specific TV for a given duration.
 */
export async function applyTvLock(tvId: number, durationMinutes: number): Promise<Tv> {
  return await storage.updateTv(tvId, {
    lockDuration: durationMinutes
  });
}
