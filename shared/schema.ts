import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const tvs = pgTable("tvs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  priority: text("priority").default("Secondary"),
  allowedChannels: text("allowed_channels").array(),
  currentChannel: text("current_channel"),
  currentGameId: integer("current_game_id"),
  lockedUntil: timestamp("locked_until"),
  manualOverride: boolean("manual_override").default(false),
  status: text("status").default("active"),
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  teamA: text("team_a"),
  teamB: text("team_b"),
  league: text("league").notNull(),
  channel: text("channel").notNull(),
  startTime: timestamp("start_time").notNull(),
  relevance: integer("relevance").default(0),
  status: text("status").default("Scheduled"),
});

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  favoriteTeams: jsonb("favorite_teams").$type<{ id: string; priority: number }[]>().default([]),
  favoriteMarkets: jsonb("favorite_markets").$type<{ id: string; priority: number }[]>().default([]),
  leaguePriority: text("league_priority").array(),
  hardRules: jsonb("hard_rules"),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  tvId: integer("tv_id").notNull(),
  gameId: integer("game_id").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const beerOrders = pgTable("beer_orders", {
  id: serial("id").primaryKey(),
  type: text("type"),
  tableNumber: text("table_number").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertTvSchema = createInsertSchema(tvs).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertPreferencesSchema = createInsertSchema(preferences).omit({ id: true });
export const insertRequestSchema = createInsertSchema(requests).omit({ id: true, createdAt: true });
export const insertBeerOrderSchema = createInsertSchema(beerOrders).omit({ id: true, createdAt: true });

// === TYPES ===

export type Tv = typeof tvs.$inferSelect;
export type InsertTv = z.infer<typeof insertTvSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Preference = typeof preferences.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferencesSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

export type BeerOrder = typeof beerOrders.$inferSelect;
export type InsertBeerOrder = z.infer<typeof insertBeerOrderSchema>;

// === API SPECIFIC TYPES ===

export type UpdateTvRequest = Partial<InsertTv> & {
  lockDuration?: number;
};

export type Recommendation = {
  tvId: number;
  gameId: number;
  reason: string;
  score: number;
};
