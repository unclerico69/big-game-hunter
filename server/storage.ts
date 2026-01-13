import { db } from "./db";
import {
  tvs, games, preferences, requests, beerOrders,
  type Tv, type InsertTv, type UpdateTvRequest,
  type Game, type InsertGame,
  type Preference, type InsertPreference,
  type Request, type BeerOrder
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getTvs(): Promise<Tv[]>;
  getTv(id: number): Promise<Tv | undefined>;
  updateTv(id: number, updates: UpdateTvRequest): Promise<Tv>;
  createTv(tv: InsertTv): Promise<Tv>;
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  getPreferences(): Promise<Preference | undefined>;
  updatePreferences(prefs: InsertPreference): Promise<Preference>;
  createTvRequest(req: { tvId: number, gameId: number }): Promise<Request>;
  getTvRequests(): Promise<Request[]>;
  createBeerOrder(type: string, tableNumber: string): Promise<BeerOrder>;
  getPlatformStats(): Promise<Record<number, number>>;
}

export class DatabaseStorage implements IStorage {
  async getPlatformStats(): Promise<Record<number, number>> {
    const tvsList = await this.getTvs();
    const stats: Record<number, number> = {};
    tvsList.forEach(tv => {
      if (tv.currentGameId) {
        stats[tv.currentGameId] = (stats[tv.currentGameId] || 0) + 1;
      }
    });
    return stats;
  }

  async getTvs(): Promise<Tv[]> {
    return await db.select().from(tvs).orderBy(tvs.id);
  }

  async getTv(id: number): Promise<Tv | undefined> {
    const [tv] = await db.select().from(tvs).where(eq(tvs.id, id));
    return tv;
  }

  async updateTv(id: number, updates: UpdateTvRequest): Promise<Tv> {
    const { lockDuration, ...fields } = updates;
    if (lockDuration) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + lockDuration);
      (fields as any).lockedUntil = lockUntil;
      (fields as any).manualOverride = true;
    } else if (lockDuration === 0) {
       (fields as any).lockedUntil = null;
       (fields as any).manualOverride = false;
    }
    const [updated] = await db.update(tvs).set(fields).where(eq(tvs.id, id)).returning();
    return updated;
  }

  async createTv(tv: InsertTv): Promise<Tv> {
    const [created] = await db.insert(tvs).values(tv).returning();
    return created;
  }

  async getGames(): Promise<Game[]> {
    return await db.select().from(games).orderBy(desc(games.relevance), games.startTime);
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async createGame(game: InsertGame): Promise<Game> {
    const [created] = await db.insert(games).values(game).returning();
    return created;
  }

  async getPreferences(): Promise<Preference | undefined> {
    const [pref] = await db.select().from(preferences).orderBy(desc(preferences.updatedAt)).limit(1);
    return pref;
  }

  async updatePreferences(prefs: InsertPreference): Promise<Preference> {
    const existing = await this.getPreferences();
    if (existing) {
        const [updated] = await db.update(preferences).set({
          ...prefs,
          updatedAt: new Date(),
          version: (existing.version || 1) + 1
        } as any).where(eq(preferences.id, existing.id)).returning();
        return updated;
    } else {
        const [created] = await db.insert(preferences).values({
          ...prefs,
          venueId: 1, // Default for MVP
          version: 1
        } as any).returning();
        return created;
    }
  }

  async createTvRequest(req: { tvId: number, gameId: number }): Promise<Request> {
    const [created] = await db.insert(requests).values(req).returning();
    return created;
  }

  async getTvRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }

  async createBeerOrder(type: string, tableNumber: string): Promise<BeerOrder> {
    const [created] = await db.insert(beerOrders).values({ type, tableNumber }).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
