import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roms = sqliteTable("roms", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  codename: text("codename").notNull(),
  maintainer: text("maintainer").notNull(),
  version: text("version").notNull(),
  androidVersion: text("android_version").notNull(),
  romType: text("rom_type").notNull(),
  buildStatus: text("build_status").notNull().default("stable"),
  downloadUrl: text("download_url").notNull(),
  checksum: text("checksum"),
  changelog: text("changelog"),
  isApproved: integer("is_approved", { mode: 'boolean' }).notNull().default(false),
  downloadCount: integer("download_count").notNull().default(0),
  developerId: text("developer_id"),
  fileSize: text("file_size"),
  fileName: text("file_name"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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

export const developers = sqliteTable("developers", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  telegramHandle: text("telegram_handle"),
  githubHandle: text("github_handle"),
  isVerified: integer("is_verified", { mode: 'boolean' }).notNull().default(false),
  isAdmin: integer("is_admin", { mode: 'boolean' }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: integer("is_admin", { mode: 'boolean' }).notNull().default(false),
});

export const insertDeveloperSchema = createInsertSchema(developers).pick({
  username: true,
  email: true,
  password: true,
  displayName: true,
  bio: true,
  telegramHandle: true,
  githubHandle: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertDeveloper = z.infer<typeof insertDeveloperSchema>;
export type Developer = typeof developers.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
