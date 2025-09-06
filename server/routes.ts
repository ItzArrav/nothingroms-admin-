import type { Express } from "express";
import { createServer, type Server } from "http";
import { database } from "./database";
import { insertRomSchema } from "@shared/schema";
import { z } from "zod";
import { registerAuthRoutes } from "./routes/auth";
import { registerUploadRoutes } from "./routes/upload";
import { registerAdminRoutes } from "./routes/admin";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register authentication routes
  registerAuthRoutes(app);
  
  // Register upload routes
  registerUploadRoutes(app);
  
  // Register admin routes
  registerAdminRoutes(app);
  // Get all approved ROMs
  app.get("/api/roms", async (req, res) => {
    try {
      const roms = database.getApprovedRoms();
      res.json(roms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ROMs" });
    }
  });

  // Get featured ROMs (top 3 by download count)
  app.get("/api/roms/featured", async (req, res) => {
    try {
      const roms = database.getApprovedRoms();
      const featured = roms
        .sort((a, b) => b.downloadCount - a.downloadCount)
        .slice(0, 3);
      res.json(featured);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured ROMs" });
    }
  });

  // Get ROM by ID
  app.get("/api/roms/:id", async (req, res) => {
    try {
      const rom = database.getRomById(req.params.id);
      if (!rom) {
        return res.status(404).json({ message: "ROM not found" });
      }
      res.json(rom);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ROM" });
    }
  });

  // Search ROMs
  app.get("/api/roms/search/:query", async (req, res) => {
    try {
      const roms = await storage.searchRoms(req.params.query);
      res.json(roms);
    } catch (error) {
      res.status(500).json({ message: "Failed to search ROMs" });
    }
  });

  // Filter ROMs
  app.post("/api/roms/filter", async (req, res) => {
    try {
      const filters = req.body;
      const roms = await storage.filterRoms(filters);
      res.json(roms);
    } catch (error) {
      res.status(500).json({ message: "Failed to filter ROMs" });
    }
  });

  // Download ROM (increment counter)
  app.post("/api/roms/:id/download", async (req, res) => {
    try {
      const rom = database.getRomById(req.params.id);
      if (!rom) {
        return res.status(404).json({ message: "ROM not found" });
      }
      
      database.incrementDownloadCount(req.params.id);
      res.json({ message: "Download tracked", downloadUrl: rom.downloadUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to track download" });
    }
  });

  // Submit ROM (from Google Sheets webhook)
  app.post("/api/roms", async (req, res) => {
    try {
      const validatedData = insertRomSchema.parse(req.body);
      const rom = await storage.createRom(validatedData);
      res.status(201).json(rom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ROM data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ROM" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
