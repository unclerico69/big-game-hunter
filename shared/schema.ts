import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const tvs = pgTable("tvs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // e.g., "Bar Left 65"
  location: text("location").notNull(), // e.g., "Main Bar", "Patio"
  priority: text("priority").default("Secondary"), // Main, Secondary, Overflow
  allowedChannels: text("allowed_channels").array(), // ["ESPN", "Local", "TNT"]
  currentChannel: text("current_channel"),
  currentGameId: integer("current_game_id"),
  lockedUntil: timestamp("locked_until"),
  manualOverride: boolean("manual_override").default(false),
  status: text("status").default("active"), // active, error, off
});

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // e.g., "Lakers vs Warriors"
  teamA: text("team_a"),
  teamB: text("team_b"),
  league: text("league").notNull(), // NBA, NFL, etc.
  channel: text("channel").notNull(),
  startTime: timestamp("start_time").notNull(),
  relevance: integer("relevance").default(0), // 0-100 score
  status: text("status").default("Scheduled"), // Scheduled, Live, Ended
});

export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  favoriteTeams: text("favorite_teams").array(),
  leaguePriority: text("league_priority").array(), // ["NFL", "NBA", "MLB"]
  hardRules: jsonb("hard_rules"), // e.g., { "no_channel_flip_under_mins": 15 }
});

// === SCHEMAS ===

export const insertTvSchema = createInsertSchema(tvs).omit({ id: true });
export const insertGameSchema = createInsertSchema(games).omit({ id: true });
export const insertPreferencesSchema = createInsertSchema(preferences).omit({ id: true });

// === TYPES ===

export type Tv = typeof tvs.$inferSelect;
export type InsertTv = z.infer<typeof insertTvSchema>;

export type Game = typeof games.$inferSelect;
export type InsertGame = z.infer<typeof insertGameSchema>;

export type Preference = typeof preferences.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferencesSchema>;

// === API SPECIFIC TYPES ===

export type UpdateTvRequest = Partial<InsertTv> & {
  lockDuration?: number; // minutes to lock
};

export type Recommendation = {
  tvId: number;
  gameId: number;
  reason: string;
  score: number;
};
