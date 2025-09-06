import type { Express } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "../storage";
import { insertRomSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateToken, type AuthenticatedRequest } from "../middleware/auth";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'roms');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept only zip files
  if (file.mimetype === 'application/zip' || 
      file.mimetype === 'application/x-zip-compressed' ||
      file.originalname.toLowerCase().endsWith('.zip')) {
    cb(null, true);
  } else {
    cb(new Error('Only ZIP files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage_multer,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
  }
});

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function registerUploadRoutes(app: Express) {
  // Upload ROM file and metadata
  app.post("/api/developer/roms/upload", 
    authenticateToken, 
    upload.single('romFile'), 
    async (req: AuthenticatedRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "ROM file is required" });
        }

        if (!req.developer) {
          return res.status(401).json({ message: "Authentication required" });
        }

        // Parse and validate ROM metadata
        const romData = {
          name: req.body.name,
          codename: req.body.codename,
          maintainer: req.body.maintainer || req.developer.displayName,
          version: req.body.version,
          androidVersion: req.body.androidVersion,
          romType: req.body.romType,
          buildStatus: req.body.buildStatus || "stable",
          downloadUrl: `/api/download/${req.file.filename}`, // We'll serve files from uploads
          checksum: req.body.checksum || null,
          changelog: req.body.changelog,
        };

        const validatedData = insertRomSchema.parse(romData);

        // Create ROM with developer ID and file info
        const rom = await storage.createRom(validatedData, req.developer.id);

        // Update ROM with file information
        await storage.updateRom(rom.id, {
          fileName: req.file.filename,
          fileSize: formatFileSize(req.file.size),
          downloadUrl: `/api/download/${req.file.filename}`,
        });

        res.status(201).json({
          message: "ROM uploaded successfully! It will be reviewed before being published.",
          rom: {
            id: rom.id,
            name: rom.name,
            version: rom.version,
            fileName: req.file.filename,
            fileSize: formatFileSize(req.file.size),
            isApproved: rom.isApproved,
            uploadedAt: rom.createdAt,
          }
        });

      } catch (error) {
        // Clean up uploaded file if ROM creation failed
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        if (error instanceof z.ZodError) {
          return res.status(400).json({ 
            message: "Invalid ROM data", 
            errors: error.errors 
          });
        }

        if (error instanceof multer.MulterError) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large. Maximum size is 2GB." });
          }
          return res.status(400).json({ message: error.message });
        }

        console.error("ROM upload error:", error);
        res.status(500).json({ message: "Failed to upload ROM" });
      }
    }
  );

  // Get developer's uploaded ROMs
  app.get("/api/developer/roms", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.developer) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const roms = await storage.getDeveloperRoms(req.developer.id);
      
      res.json({
        roms: roms.map(rom => ({
          id: rom.id,
          name: rom.name,
          version: rom.version,
          androidVersion: rom.androidVersion,
          romType: rom.romType,
          isApproved: rom.isApproved,
          downloadCount: rom.downloadCount,
          fileName: rom.fileName,
          fileSize: rom.fileSize,
          createdAt: rom.createdAt,
          updatedAt: rom.updatedAt,
        }))
      });
    } catch (error) {
      console.error("Get developer ROMs error:", error);
      res.status(500).json({ message: "Failed to fetch ROMs" });
    }
  });

  // Update ROM metadata (developer can only update their own ROMs)
  app.put("/api/developer/roms/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.developer) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const rom = await storage.getRomById(req.params.id);
      
      if (!rom) {
        return res.status(404).json({ message: "ROM not found" });
      }

      if (rom.developerId !== req.developer.id) {
        return res.status(403).json({ message: "You can only update your own ROMs" });
      }

      const updates = {
        name: req.body.name,
        version: req.body.version,
        androidVersion: req.body.androidVersion,
        changelog: req.body.changelog,
      };

      // Remove undefined values
      Object.keys(updates).forEach(key => 
        (updates as any)[key] === undefined && delete (updates as any)[key]
      );

      const updatedRom = await storage.updateRom(req.params.id, updates);

      res.json({
        message: "ROM updated successfully",
        rom: updatedRom
      });

    } catch (error) {
      console.error("Update ROM error:", error);
      res.status(500).json({ message: "Failed to update ROM" });
    }
  });

  // Delete ROM (developer can only delete their own ROMs)
  app.delete("/api/developer/roms/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.developer) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const rom = await storage.getRomById(req.params.id);
      
      if (!rom) {
        return res.status(404).json({ message: "ROM not found" });
      }

      if (rom.developerId !== req.developer.id) {
        return res.status(403).json({ message: "You can only delete your own ROMs" });
      }

      // Delete file from disk if it exists
      if (rom.fileName) {
        const filePath = path.join(uploadDir, rom.fileName);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // Delete ROM from storage
      await storage.deleteRom(req.params.id);

      res.json({ message: "ROM deleted successfully" });

    } catch (error) {
      console.error("Delete ROM error:", error);
      res.status(500).json({ message: "Failed to delete ROM" });
    }
  });

  // Serve ROM files for download
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(uploadDir, filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Set appropriate headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/zip');

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      console.error("File download error:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });
}
