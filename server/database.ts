import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import path from "path";

// Create database file in project root
const dbPath = path.join(process.cwd(), "nothingroms.db");
const db = new Database(dbPath);

// Initialize database
export function initializeDatabase() {
  console.log(`📁 Initializing SQLite database at: ${dbPath}`);

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS developers (
      id TEXT PRIMARY KEY,
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
    );

    CREATE TABLE IF NOT EXISTS roms (
      id TEXT PRIMARY KEY,
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
    );
  `);

  // Create admin user
  createAdminUser();
  
  // Create sample ROMs
  createSampleROMs();

  console.log("✅ Database initialized successfully");
}

async function createAdminUser() {
  const existingAdmin = db.prepare("SELECT * FROM developers WHERE email = ?").get("admin@next-gen");
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("himveroro", 12);
    const adminId = randomUUID();
    const adminDevId = randomUUID();

    // Create admin user
    db.prepare(`
      INSERT INTO users (id, username, password, is_admin) 
      VALUES (?, ?, ?, 1)
    `).run(adminId, "admin", hashedPassword);

    // Create admin developer
    db.prepare(`
      INSERT INTO developers (
        id, username, email, password, display_name, bio, 
        is_admin, is_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, 1, datetime('now'), datetime('now'))
    `).run(
      adminDevId,
      "admin", 
      "admin@next-gen", 
      hashedPassword, 
      "Administrator", 
      "System Administrator"
    );

    console.log("✅ Admin user created successfully");
    console.log("📧 Email: admin@next-gen");
    console.log("🔑 Password: himveroro");
  }
}

function createSampleROMs() {
  const existingRoms = db.prepare("SELECT COUNT(*) as count FROM roms").get();
  
  if (existingRoms.count === 0) {
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
        downloadUrl: "https://sourceforge.net/projects/lineageos/files/lineage-21.zip",
        checksum: "sha256:1234567890abcdef...",
        changelog: "- Fixed WiFi issues\\n- Improved battery life\\n- Updated security patches",
        isApproved: 1,
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
        downloadUrl: "https://sourceforge.net/projects/pixelos/files/pixelos-14.zip",
        checksum: "sha256:abcdef1234567890...",
        changelog: "- Pixel Experience features\\n- Smooth performance\\n- Latest Android 14 features",
        isApproved: 1,
        downloadCount: 980,
        fileSize: "920 MB",
        fileName: "pixelos-14-pacman.zip",
      }
    ];

    const insertRom = db.prepare(`
      INSERT INTO roms (
        id, name, codename, maintainer, version, android_version, rom_type,
        build_status, download_url, checksum, changelog, is_approved,
        download_count, file_size, file_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    for (const rom of sampleRoms) {
      insertRom.run(
        rom.id, rom.name, rom.codename, rom.maintainer, rom.version, 
        rom.androidVersion, rom.romType, rom.buildStatus, rom.downloadUrl, 
        rom.checksum, rom.changelog, rom.isApproved, rom.downloadCount,
        rom.fileSize, rom.fileName
      );
    }
    
    console.log("✅ Sample ROMs created");
  }
}

// Helper functions to convert SQLite field names to match expected format
function convertDeveloperFields(dbResult: any) {
  return {
    ...dbResult,
    displayName: dbResult.display_name,
    telegramHandle: dbResult.telegram_handle,
    githubHandle: dbResult.github_handle,
    isVerified: Boolean(dbResult.is_verified),
    isAdmin: Boolean(dbResult.is_admin),
    createdAt: dbResult.created_at,
    updatedAt: dbResult.updated_at
  };
}

function convertRomFields(dbResult: any) {
  return {
    ...dbResult,
    androidVersion: dbResult.android_version,
    romType: dbResult.rom_type,
    buildStatus: dbResult.build_status,
    downloadUrl: dbResult.download_url,
    isApproved: Boolean(dbResult.is_approved),
    downloadCount: dbResult.download_count,
    developerId: dbResult.developer_id,
    fileSize: dbResult.file_size,
    fileName: dbResult.file_name,
    createdAt: dbResult.created_at,
    updatedAt: dbResult.updated_at
  };
}

function convertUserFields(dbResult: any) {
  return {
    ...dbResult,
    isAdmin: Boolean(dbResult.is_admin)
  };
}

// Database query functions
export const database = {
  // Users
  getUserByUsername: (username: string) => {
    const result = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    return result ? convertUserFields(result) : undefined;
  },
  
  createUser: (user: any) => {
    const id = randomUUID();
    db.prepare("INSERT INTO users (id, username, password, is_admin) VALUES (?, ?, ?, ?)")
      .run(id, user.username, user.password, user.isAdmin ? 1 : 0);
    return { ...user, id };
  },

  // Developers
  getDeveloperByUsername: (username: string) => {
    const result = db.prepare("SELECT * FROM developers WHERE username = ?").get(username);
    return result ? convertDeveloperFields(result) : undefined;
  },
    
  getDeveloperByEmail: (email: string) => {
    const result = db.prepare("SELECT * FROM developers WHERE email = ?").get(email);
    return result ? convertDeveloperFields(result) : undefined;
  },
    
  getDeveloperById: (id: string) => {
    const result = db.prepare("SELECT * FROM developers WHERE id = ?").get(id);
    return result ? convertDeveloperFields(result) : undefined;
  },

  createDeveloper: (developer: any) => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO developers (
        id, username, email, password, display_name, bio, 
        telegram_handle, github_handle, is_verified, is_admin,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      id, developer.username, developer.email, developer.password,
      developer.displayName, developer.bio, developer.telegramHandle,
      developer.githubHandle, developer.isVerified ? 1 : 0, 
      developer.isAdmin ? 1 : 0
    );
    return { ...developer, id };
  },

  // ROMs
  getAllRoms: () => {
    const results = db.prepare("SELECT * FROM roms ORDER BY created_at DESC").all();
    return results.map(convertRomFields);
  },
    
  getApprovedRoms: () => {
    const results = db.prepare("SELECT * FROM roms WHERE is_approved = 1 ORDER BY created_at DESC").all();
    return results.map(convertRomFields);
  },
    
  getRomById: (id: string) => {
    const result = db.prepare("SELECT * FROM roms WHERE id = ?").get(id);
    return result ? convertRomFields(result) : undefined;
  },

  createRom: (rom: any, developerId?: string, isApproved?: boolean) => {
    const id = randomUUID();
    db.prepare(`
      INSERT INTO roms (
        id, name, codename, maintainer, version, android_version, rom_type,
        build_status, download_url, checksum, changelog, is_approved,
        download_count, developer_id, file_size, file_name,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      id, rom.name, rom.codename, rom.maintainer, rom.version,
      rom.androidVersion, rom.romType, rom.buildStatus || 'stable',
      rom.downloadUrl, rom.checksum, rom.changelog,
      isApproved ? 1 : 0, 0, developerId, rom.fileSize, rom.fileName
    );
    return { ...rom, id, isApproved: isApproved || false, downloadCount: 0 };
  },

  updateRom: (id: string, updates: any) => {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    db.prepare(`UPDATE roms SET ${fields}, updated_at = datetime('now') WHERE id = ?`)
      .run(...values, id);
    return db.prepare("SELECT * FROM roms WHERE id = ?").get(id);
  },

  incrementDownloadCount: (id: string) => {
    db.prepare("UPDATE roms SET download_count = download_count + 1 WHERE id = ?").run(id);
  },

  deleteRom: (id: string) => {
    const result = db.prepare("DELETE FROM roms WHERE id = ?").run(id);
    return result.changes > 0;
  }
};

// Initialize database on import
initializeDatabase();
