import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { roms, developers, users } from "@shared/schema";
import type { IStorage, InsertRom, InsertDeveloper, InsertUser, Rom, Developer, User } from "./storage";
import { eq, like, and, or, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Database connection
const connection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nothingroms',
  port: parseInt(process.env.DB_PORT || '3306'),
});

const db = drizzle(connection);

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      // Create admin user if not exists
      await this.createDefaultAdmin();
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      // Continue with in-memory storage as fallback
    }
  }

  private async createDefaultAdmin() {
    try {
      // Check if admin user already exists
      const existingAdmin = await db.select().from(developers).where(eq(developers.email, 'admin@next-gen')).limit(1);
      
      if (existingAdmin.length === 0) {
        // Hash the password
        const hashedPassword = await bcrypt.hash('himveroro', 12);
        
        // Create admin developer
        await db.insert(developers).values({
          username: 'admin',
          email: 'admin@next-gen',
          password: hashedPassword,
          displayName: 'Administrator',
          bio: 'System Administrator',
          isAdmin: true,
          isVerified: true,
        });

        // Create admin user
        await db.insert(users).values({
          username: 'admin',
          password: hashedPassword,
          isAdmin: true,
        });

        console.log('✅ Admin user created successfully');
        console.log('📧 Email: admin@next-gen');
        console.log('🔑 Password: himveroro');
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
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
      const result = await db.insert(users).values(user);
      const newUser = await this.getUser(result.insertId.toString());
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
      const developerWithDefaults = {
        ...developer,
        isAdmin: false,
        isVerified: false,
      };
      const result = await db.insert(developers).values(developerWithDefaults);
      const newDeveloper = await this.getDeveloper(result.insertId.toString());
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
        updatedAt: new Date()
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
      const romWithDefaults = {
        ...rom,
        developerId: developerId || null,
        isApproved: isApproved !== undefined ? isApproved : false,
        downloadCount: 0,
        buildStatus: rom.buildStatus || 'stable',
      };
      const result = await db.insert(roms).values(romWithDefaults);
      const newRom = await this.getRomById(result.insertId.toString());
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
        updatedAt: new Date()
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
      let query = db.select().from(roms).where(eq(roms.isApproved, true));
      
      if (filters.androidVersion && filters.androidVersion !== 'all') {
        query = query.where(eq(roms.androidVersion, filters.androidVersion));
      }
      
      if (filters.romType && filters.romType !== 'all') {
        query = query.where(eq(roms.romType, filters.romType));
      }
      
      if (filters.maintainer) {
        query = query.where(eq(roms.maintainer, filters.maintainer));
      }
      
      const result = await query.orderBy(desc(roms.updatedAt));
      return result;
    } catch (error) {
      console.error('Error filtering ROMs:', error);
      return [];
    }
  }
}

export const dbStorage = new DatabaseStorage();
