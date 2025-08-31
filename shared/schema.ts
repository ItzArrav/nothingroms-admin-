import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roms = pgTable("roms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  codename: text("codename").notNull(),
  maintainer: text("maintainer").notNull(),
  version: text("version").notNull(),
  androidVersion: text("android_version").notNull(),
  romType: text("rom_type").notNull(),
  downloadUrl: text("download_url").notNull(),
  checksum: text("checksum").notNull(),
  changelog: text("changelog"),
  isApproved: boolean("is_approved").notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertRomSchema = createInsertSchema(roms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  downloadCount: true,
  isApproved: true,
});

export type Rom = typeof roms.$inferSelect;
export type InsertRom = z.infer<typeof insertRomSchema>;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
