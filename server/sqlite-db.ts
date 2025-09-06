import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { roms, developers, users } from "@shared/schema";
import type { IStorage, InsertRom, InsertDeveloper, InsertUser, Rom, Developer, User } from "./storage";
import { eq, like, and, or, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import path from "path";

// Create database file in project root
const dbPath = path.join(process.cwd(), "nothingroms.db");
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

export class SQLiteStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Create tables
      this.createTables();
      
      // Create admin user if not exists
      await this.createDefaultAdmin();
      
      // Create sample ROMs
      await this.createSampleROMs();
      
      console.log('✅ SQLite database initialized successfully');
      console.log(`📁 Database file: ${dbPath}`);
    } catch (error) {
      console.error('❌ SQLite database initialization failed:', error);
      throw error; // Don't continue if database fails
    }
  }

  private async createTables() {
    // Create users table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin INTEGER DEFAULT 0 NOT NULL
      )
    `);

    // Create developers table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS developers (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        display_name TEXT NOT NULL,
        bio TEXT,
        telegram_handle TEXT,
        github_handle TEXT,
        is_verified INTEGER DEFAULT 0 NOT NULL,
        is_admin INTEGER DEFAULT 0 NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);

    // Create roms table
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS roms (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        codename TEXT NOT NULL,
        maintainer TEXT NOT NULL,
        version TEXT NOT NULL,
        android_version TEXT NOT NULL,
        rom_type TEXT NOT NULL,
        build_status TEXT DEFAULT 'stable' NOT NULL,
        download_url TEXT NOT NULL,
        checksum TEXT,
        changelog TEXT,
        is_approved INTEGER DEFAULT 0 NOT NULL,
        download_count INTEGER DEFAULT 0 NOT NULL,
        developer_id TEXT,
        file_size TEXT,
        file_name TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
  }

  private async createDefaultAdmin() {
    try {
      // Check if admin user already exists
      const existingAdmin = await db.select().from(developers).where(eq(developers.email, 'admin@next-gen')).limit(1);
      
      if (existingAdmin.length === 0) {
        // Hash the password
        const hashedPassword = await bcrypt.hash('himveroro', 12);
        const adminId = randomUUID();
        const adminDevId = randomUUID();
        
        // Create admin user
        await db.insert(users).values({
          id: adminId,
          username: 'admin',
          password: hashedPassword,
          isAdmin: true,
        });

        // Create admin developer
        await db.insert(developers).values({
          id: adminDevId,
          username: 'admin',
          email: 'admin@next-gen',
          password: hashedPassword,
          displayName: 'Administrator',
          bio: 'System Administrator',
          isAdmin: true,
          isVerified: true,
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@next-gen');
        console.log('🔑 Password: himveroro');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
    }
  }

  private async createSampleROMs() {
    try {
      const existingRoms = await db.select().from(roms).limit(1);
      
      if (existingRoms.length === 0) {
        const sampleRoms = [
          {
            id: randomUUID(),
            name: "LineageOS 21",
            codename: "Pacman",
            maintainer: "@dev_xyz",
            version: "v21.0-20240115",
            androidVersion: "Android 14",
            romType: "LineageOS",
            buildStatus: "stable",
            downloadUrl: "https://example.com/lineage-21.zip",
            checksum: "sha256:1234567890abcdef...",
            changelog: "- Fixed WiFi issues\n- Improved battery life\n- Updated security patches",
            isApproved: true,
            downloadCount: 1520,
            fileSize: "890 MB",
            fileName: "lineage-21-pacman.zip",
          },
          {
            id: randomUUID(),
            name: "PixelOS 14",
            codename: "Pacman",
            maintainer: "@pixel_dev",
            version: "v14.0.5-stable",
            androidVersion: "Android 14",
            romType: "PixelOS",
            buildStatus: "beta",
            downloadUrl: "https://example.com/pixelos-14.zip",
            checksum: "sha256:abcdef1234567890...",
            changelog: "- Pixel Experience features\n- Smooth performance\n- Latest Android 14 features",
            isApproved: true,
            downloadCount: 980,
            fileSize: "920 MB",
            fileName: "pixelos-14-pacman.zip",
          }
        ];

        for (const rom of sampleRoms) {
          await db.insert(roms).values(rom);
        }
        
        console.log('✅ Sample ROMs created');
      }
    } catch (error) {
      console.error('Error creating sample ROMs:', error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      await db.insert(users).values({ ...user, id });
      const newUser = await this.getUser(id);
      return newUser!;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getDeveloper(id: string): Promise<Developer | undefined> {
    try {
      const result = await db.select().from(developers).where(eq(developers.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting developer:', error);
      return undefined;
    }
  }

  async getDeveloperById(id: string): Promise<Developer | undefined> {
    return this.getDeveloper(id);
  }

  async getDeveloperByUsername(username: string): Promise<Developer | undefined> {
    try {
      const result = await db.select().from(developers).where(eq(developers.username, username)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting developer by username:', error);
      return undefined;
    }
  }

  async getDeveloperByEmail(email: string): Promise<Developer | undefined> {
    try {
      const result = await db.select().from(developers).where(eq(developers.email, email)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting developer by email:', error);
      return undefined;
    }
  }

  async getDeveloperByUsernameOrEmail(username: string, email: string): Promise<Developer | undefined> {
    try {
      const result = await db.select().from(developers).where(
        or(
          eq(developers.username, username),
          eq(developers.email, email)
        )
      ).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting developer by username or email:', error);
      return undefined;
    }
  }

  async createDeveloper(developer: InsertDeveloper): Promise<Developer> {
    try {
      const id = randomUUID();
      const developerWithDefaults = {
        ...developer,
        id,
        isAdmin: false,
        isVerified: false,
      };
      await db.insert(developers).values(developerWithDefaults);
      const newDeveloper = await this.getDeveloper(id);
      return newDeveloper!;
    } catch (error) {
      console.error('Error creating developer:', error);
      throw error;
    }
  }

  async updateDeveloper(id: string, updates: Partial<Developer>): Promise<Developer | undefined> {
    try {
      await db.update(developers).set({
        ...updates,
        updatedAt: new Date().toISOString()
      }).where(eq(developers.id, id));
      return await this.getDeveloper(id);
    } catch (error) {
      console.error('Error updating developer:', error);
      return undefined;
    }
  }

  async getDeveloperRoms(developerId: string): Promise<Rom[]> {
    try {
      const result = await db.select().from(roms).where(eq(roms.developerId, developerId)).orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error getting developer ROMs:', error);
      return [];
    }
  }

  async getAllRoms(): Promise<Rom[]> {
    try {
      const result = await db.select().from(roms).orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error getting all ROMs:', error);
      return [];
    }
  }

  async getApprovedRoms(): Promise<Rom[]> {
    try {
      const result = await db.select().from(roms).where(eq(roms.isApproved, true)).orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error getting approved ROMs:', error);
      return [];
    }
  }

  async getRomById(id: string): Promise<Rom | undefined> {
    try {
      const result = await db.select().from(roms).where(eq(roms.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error('Error getting ROM by ID:', error);
      return undefined;
    }
  }

  async createRom(rom: InsertRom, developerId?: string, isApproved?: boolean): Promise<Rom> {
    try {
      const id = randomUUID();
      const romWithDefaults = {
        ...rom,
        id,
        developerId: developerId || null,
        isApproved: isApproved !== undefined ? isApproved : false,
        downloadCount: 0,
        buildStatus: rom.buildStatus || 'stable',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.insert(roms).values(romWithDefaults);
      const newRom = await this.getRomById(id);
      return newRom!;
    } catch (error) {
      console.error('Error creating ROM:', error);
      throw error;
    }
  }

  async updateRom(id: string, updates: Partial<Rom>): Promise<Rom | undefined> {
    try {
      await db.update(roms).set({
        ...updates,
        updatedAt: new Date().toISOString()
      }).where(eq(roms.id, id));
      return await this.getRomById(id);
    } catch (error) {
      console.error('Error updating ROM:', error);
      return undefined;
    }
  }

  async deleteRom(id: string): Promise<boolean> {
    try {
      await db.delete(roms).where(eq(roms.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting ROM:', error);
      return false;
    }
  }

  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const rom = await this.getRomById(id);
      if (rom) {
        await db.update(roms).set({
          downloadCount: rom.downloadCount + 1
        }).where(eq(roms.id, id));
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }

  async searchRoms(query: string): Promise<Rom[]> {
    try {
      const result = await db.select().from(roms).where(
        and(
          eq(roms.isApproved, true),
          like(roms.name, `%${query}%`)
        )
      ).orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error searching ROMs:', error);
      return [];
    }
  }

  async filterRoms(filters: { androidVersion?: string; romType?: string; maintainer?: string }): Promise<Rom[]> {
    try {
      let whereConditions = [eq(roms.isApproved, true)];
      
      if (filters.androidVersion && filters.androidVersion !== 'all') {
        whereConditions.push(eq(roms.androidVersion, filters.androidVersion));
      }
      
      if (filters.romType && filters.romType !== 'all') {
        whereConditions.push(eq(roms.romType, filters.romType));
      }
      
      if (filters.maintainer) {
        whereConditions.push(eq(roms.maintainer, filters.maintainer));
      }
      
      const result = await db.select().from(roms).where(and(...whereConditions)).orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error filtering ROMs:', error);
      return [];
    }
  }
}

export const sqliteStorage = new SQLiteStorage();
