import { type User, type InsertUser, type Rom, type InsertRom, type Developer, type InsertDeveloper } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Developer methods
  getDeveloper(id: string): Promise<Developer | undefined>;
  getDeveloperById(id: string): Promise<Developer | undefined>;
  getDeveloperByUsername(username: string): Promise<Developer | undefined>;
  getDeveloperByEmail(email: string): Promise<Developer | undefined>;
  getDeveloperByUsernameOrEmail(username: string, email: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloper(id: string, updates: Partial<Developer>): Promise<Developer | undefined>;
  getDeveloperRoms(developerId: string): Promise<Rom[]>;
  
  // ROM methods
  getAllRoms(): Promise<Rom[]>;
  getApprovedRoms(): Promise<Rom[]>;
  getRomById(id: string): Promise<Rom | undefined>;
  createRom(rom: InsertRom): Promise<Rom>;
  updateRom(id: string, updates: Partial<Rom>): Promise<Rom | undefined>;
  deleteRom(id: string): Promise<boolean>;
  incrementDownloadCount(id: string): Promise<void>;
  searchRoms(query: string): Promise<Rom[]>;
  filterRoms(filters: { androidVersion?: string; romType?: string; maintainer?: string }): Promise<Rom[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private developers: Map<string, Developer>;
  private roms: Map<string, Rom>;

  constructor() {
    this.users = new Map();
    this.developers = new Map();
    this.roms = new Map();
    
    // Add some initial approved ROMs for demo
    this.initializeRoms();
    
    // Create default admin user
    this.createDefaultAdmin().catch(console.error);
  }

  private initializeRoms() {
    const sampleRoms: Rom[] = [
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
        developerId: null,
        fileSize: "890 MB",
        fileName: "lineage-21-pacman.zip",
        createdAt: new Date(),
        updatedAt: new Date(),
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
        developerId: null,
        fileSize: "920 MB",
        fileName: "pixelos-14-pacman.zip",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "crDroid 10",
        codename: "Pacman",
        maintainer: "@crdroid_team",
        version: "v10.1-beta",
        androidVersion: "Android 14",
        romType: "crDroid",
        buildStatus: "stable",
        downloadUrl: "https://example.com/crdroid-10.zip",
        checksum: "sha256:fedcba0987654321...",
        changelog: "- Custom features\n- Performance optimizations\n- Bug fixes",
        isApproved: true,
        downloadCount: 750,
        developerId: null,
        fileSize: "875 MB",
        fileName: "crdroid-10-pacman.zip",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleRoms.forEach(rom => this.roms.set(rom.id, rom));
  }

  private async createDefaultAdmin() {
    // Create a default admin user for initial setup with your specified credentials
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('himveroro', 12); // Your specified password
    
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      username: 'admin',
      password: hashedPassword,
      isAdmin: true
    };
    this.users.set(adminId, adminUser);

    // Also create admin developer account with your specified email and password
    const adminDevId = randomUUID();
    const adminDeveloper: Developer = {
      id: adminDevId,
      username: 'admin',
      email: 'admin@next-gen', // Your specified email
      password: hashedPassword, // Your specified password: himveroro
      displayName: 'Administrator',
      bio: 'System Administrator',
      telegramHandle: null,
      githubHandle: null,
      isVerified: true,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.developers.set(adminDevId, adminDeveloper);
    
    console.log('✅ Admin user created with your credentials:');
    console.log('📧 Email: admin@next-gen');
    console.log('🔑 Password: himveroro');
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Developer methods
  async getDeveloper(id: string): Promise<Developer | undefined> {
    return this.developers.get(id);
  }

  async getDeveloperById(id: string): Promise<Developer | undefined> {
    return this.developers.get(id);
  }

  async getDeveloperByUsername(username: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(
      (dev) => dev.username === username,
    );
  }

  async getDeveloperByEmail(email: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(
      (dev) => dev.email === email,
    );
  }

  async getDeveloperByUsernameOrEmail(username: string, email: string): Promise<Developer | undefined> {
    return Array.from(this.developers.values()).find(
      (dev) => dev.username === username || dev.email === email,
    );
  }

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = randomUUID();
    const developer: Developer = {
      ...insertDeveloper,
      id,
      bio: insertDeveloper.bio || null,
      telegramHandle: insertDeveloper.telegramHandle || null,
      githubHandle: insertDeveloper.githubHandle || null,
      isVerified: false,
      isAdmin: false, // Regular developers are not admin by default
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.developers.set(id, developer);
    return developer;
  }

  async updateDeveloper(id: string, updates: Partial<Developer>): Promise<Developer | undefined> {
    const developer = this.developers.get(id);
    if (!developer) return undefined;
    
    const updatedDeveloper = { ...developer, ...updates, updatedAt: new Date() };
    this.developers.set(id, updatedDeveloper);
    return updatedDeveloper;
  }

  async getDeveloperRoms(developerId: string): Promise<Rom[]> {
    return Array.from(this.roms.values())
      .filter(rom => rom.developerId === developerId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getAllRoms(): Promise<Rom[]> {
    return Array.from(this.roms.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getApprovedRoms(): Promise<Rom[]> {
    return Array.from(this.roms.values())
      .filter(rom => rom.isApproved)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getRomById(id: string): Promise<Rom | undefined> {
    return this.roms.get(id);
  }

  async createRom(insertRom: InsertRom, developerId?: string, isApproved?: boolean): Promise<Rom> {
    const id = randomUUID();
    const rom: Rom = {
      ...insertRom,
      id,
      changelog: insertRom.changelog || null,
      buildStatus: insertRom.buildStatus || "stable",
      isApproved: isApproved !== undefined ? isApproved : false,
      downloadCount: 0,
      developerId: developerId || null,
      fileSize: null,
      fileName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.roms.set(id, rom);
    return rom;
  }

  async updateRom(id: string, updates: Partial<Rom>): Promise<Rom | undefined> {
    const rom = this.roms.get(id);
    if (!rom) return undefined;
    
    const updatedRom = { ...rom, ...updates, updatedAt: new Date() };
    this.roms.set(id, updatedRom);
    return updatedRom;
  }

  async deleteRom(id: string): Promise<boolean> {
    return this.roms.delete(id);
  }

  async incrementDownloadCount(id: string): Promise<void> {
    const rom = this.roms.get(id);
    if (rom) {
      rom.downloadCount += 1;
      this.roms.set(id, rom);
    }
  }

  async searchRoms(query: string): Promise<Rom[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.roms.values())
      .filter(rom => 
        rom.isApproved && (
          rom.name.toLowerCase().includes(lowercaseQuery) ||
          rom.maintainer.toLowerCase().includes(lowercaseQuery) ||
          rom.romType.toLowerCase().includes(lowercaseQuery)
        )
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async filterRoms(filters: { androidVersion?: string; romType?: string; maintainer?: string }): Promise<Rom[]> {
    return Array.from(this.roms.values())
      .filter(rom => {
        if (!rom.isApproved) return false;
        if (filters.androidVersion && filters.androidVersion !== "all" && rom.androidVersion !== filters.androidVersion) return false;
        if (filters.romType && filters.romType !== "all" && rom.romType !== filters.romType) return false;
        if (filters.maintainer && rom.maintainer !== filters.maintainer) return false;
        return true;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}

// FORCE SQLite database - no fallback to memory storage
export * from './sqlite-db';

// Re-export storage from SQLite
const { sqliteStorage } = await import('./sqlite-db.js');
export const storage = sqliteStorage;
