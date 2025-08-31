import { type User, type InsertUser, type Rom, type InsertRom } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  private roms: Map<string, Rom>;

  constructor() {
    this.users = new Map();
    this.roms = new Map();
    
    // Add some initial approved ROMs for demo
    this.initializeRoms();
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
        downloadUrl: "https://example.com/lineage-21.zip",
        checksum: "sha256:1234567890abcdef...",
        changelog: "- Fixed WiFi issues\n- Improved battery life\n- Updated security patches",
        isApproved: true,
        downloadCount: 1520,
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
        downloadUrl: "https://example.com/pixelos-14.zip",
        checksum: "sha256:abcdef1234567890...",
        changelog: "- Pixel Experience features\n- Smooth performance\n- Latest Android 14 features",
        isApproved: true,
        downloadCount: 980,
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
        downloadUrl: "https://example.com/crdroid-10.zip",
        checksum: "sha256:fedcba0987654321...",
        changelog: "- Custom features\n- Performance optimizations\n- Bug fixes",
        isApproved: true,
        downloadCount: 750,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleRoms.forEach(rom => this.roms.set(rom.id, rom));
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

  async createRom(insertRom: InsertRom): Promise<Rom> {
    const id = randomUUID();
    const rom: Rom = {
      ...insertRom,
      id,
      changelog: insertRom.changelog || null,
      isApproved: false,
      downloadCount: 0,
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

export const storage = new MemStorage();
