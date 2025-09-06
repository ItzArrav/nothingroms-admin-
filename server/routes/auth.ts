import type { Express } from "express";
import bcrypt from "bcryptjs";
import { database } from "../database";
import { insertDeveloperSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { generateToken } from "../middleware/auth";

export function registerAuthRoutes(app: Express) {
  // Developer registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertDeveloperSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingByUsername = database.getDeveloperByUsername(validatedData.username);
      const existingByEmail = database.getDeveloperByEmail(validatedData.email);
      
      if (existingByUsername || existingByEmail) {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);
      
      const developer = database.createDeveloper({
        ...validatedData,
        password: hashedPassword,
      });

      // Generate token
      const token = generateToken({
        id: developer.id,
        username: developer.username,
        email: developer.email,
        isAdmin: developer.isAdmin,
      });

      res.status(201).json({
        message: "Developer registered successfully",
        token,
        developer: {
          id: developer.id,
          username: developer.username,
          email: developer.email,
          displayName: developer.displayName,
          isVerified: developer.isVerified,
          isAdmin: developer.isAdmin,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid registration data", 
          errors: error.errors 
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register developer" });
    }
  });

  // Developer login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Try to find developer by username first, then by email
      let developer = database.getDeveloperByUsername(username);
      
      // If not found by username, try by email (for admin login)
      if (!developer && username.includes('@')) {
        developer = database.getDeveloperByEmail(username);
      }
      
      if (!developer) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, developer.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken({
        id: developer.id,
        username: developer.username,
        email: developer.email,
        isAdmin: developer.isAdmin,
      });

      res.json({
        message: "Login successful",
        token,
        developer: {
          id: developer.id,
          username: developer.username,
          email: developer.email,
          displayName: developer.displayName,
          isVerified: developer.isVerified,
          isAdmin: developer.isAdmin,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid login data", 
          errors: error.errors 
        });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Get developer profile
  app.get("/api/auth/profile", async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      const developer = database.getDeveloperById(decoded.id);
      
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }

      res.json({
        id: developer.id,
        username: developer.username,
        email: developer.email,
        displayName: developer.displayName,
        bio: developer.bio,
        telegramHandle: developer.telegramHandle,
        githubHandle: developer.githubHandle,
        isVerified: developer.isVerified,
        isAdmin: developer.isAdmin,
        createdAt: developer.createdAt,
      });
    } catch (error) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  });
}
