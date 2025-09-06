import type { Express } from "express";
import { database } from "../database";
import { requireAdmin, authenticateWithRole, type AuthenticatedRequest } from "../middleware/auth";

// In-memory storage for demo (replace with real database)
let submissions: any[] = [];

export function registerAdminRoutes(app: Express) {
  
  // Submit new ROM for review (public endpoint)
  app.post("/api/submissions", async (req, res) => {
    try {
      const submissionData = req.body;
      
      // Add unique ID and timestamp
      const newSubmission = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...submissionData,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Store in database (for now, in memory)
      submissions.push(newSubmission);
      
      console.log('New ROM submission:', newSubmission.id);
      
      res.status(201).json({
        id: newSubmission.id,
        message: 'ROM submitted successfully for review',
        status: 'pending'
      });
    } catch (error) {
      console.error('Error submitting ROM:', error);
      res.status(500).json({ message: 'Failed to submit ROM' });
    }
  });
  
  // Get all ROM submissions (pending and reviewed) - Admin only
  app.get("/api/admin/submissions", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      // Return real submissions from database + some mock data
      const allSubmissions = [
        ...submissions.map(sub => ({
          ...sub,
          submittedBy: {
            id: "user1",
            username: sub.submitterName?.toLowerCase().replace(/\s+/g, '') || "anonymous",
            displayName: sub.submitterName || "Anonymous",
            email: sub.submitterContact || "no-contact"
          }
        })),
        // Keep one mock example
        {
          id: "demo_sub",
          name: "PixelOS Demo",
          version: "14.0-DEMO",
          codename: "Pacman Pro",
          androidVersion: "Android 14",
          romType: "PixelOS",
          buildStatus: "beta",
          downloadUrl: "https://sourceforge.net/projects/demo/files/pixel-os.zip",
          fileSize: "2.8 GB",
          changelog: "- Demo ROM submission\n- Shows approved status",
          maintainer: "DemoUser",
          submittedBy: {
            id: "demo",
            username: "demouser",
            displayName: "Demo User",
            email: "demo@example.com"
          },
          submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: "approved",
          reviewNote: "Demo submission - already approved"
        }
      ];

      res.json({ submissions: allSubmissions });
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Approve a ROM submission - Admin only
  app.post("/api/admin/submissions/:id/approve", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { reviewNote } = req.body;

      // Find submission in database
      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const submission = submissions[submissionIndex];
      
      // Update submission status
      submissions[submissionIndex] = {
        ...submission,
        status: 'approved',
        reviewNote: reviewNote || 'Approved by admin',
        approvedAt: new Date().toISOString()
      };

      // Create ROM data in correct schema format
      const romData = {
        name: submission.name,
        version: submission.version,
        codename: submission.codename,
        androidVersion: submission.androidVersion,
        romType: submission.romType,
        buildStatus: submission.buildStatus || "stable",
        downloadUrl: submission.downloadUrl,
        maintainer: submission.maintainer || submission.submitterName,
        checksum: submission.checksum || null,
        changelog: submission.changelog || null,
        developerId: null,
        fileSize: submission.fileSize || null,
        fileName: null
      };

      // Add to database with approval status = true
      const newRom = database.createRom(romData, undefined, true);

      console.log(`✅ Approved submission ${id} - ROM now live on website`);

      res.json({ 
        message: "ROM approved and published successfully!",
        submissionId: id,
        romId: newRom.id,
        status: "approved",
        reviewNote: reviewNote
      });
    } catch (error) {
      console.error("Error approving submission:", error);
      res.status(500).json({ message: "Failed to approve submission" });
    }
  });

  // Reject a ROM submission - Admin only
  app.post("/api/admin/submissions/:id/reject", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { reviewNote } = req.body;

      // Find submission in database
      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return res.status(404).json({ message: "Submission not found" });
      }

      const submission = submissions[submissionIndex];
      
      // Update submission status
      submissions[submissionIndex] = {
        ...submission,
        status: 'rejected',
        reviewNote: reviewNote || 'Rejected by admin',
        rejectedAt: new Date().toISOString()
      };

      console.log(`❌ Rejected submission ${id} - ROM will not appear on website`);

      res.json({ 
        message: "ROM submission rejected",
        submissionId: id,
        status: "rejected",
        reviewNote: reviewNote
      });
    } catch (error) {
      console.error("Error rejecting submission:", error);
      res.status(500).json({ message: "Failed to reject submission" });
    }
  });

  // Submit ROM for review (called from the updated upload form)
  app.post("/api/developer/roms/submit", async (req, res) => {
    try {
      const submissionData = req.body;
      
      // In production, you would:
      // 1. Validate the submission data
      // 2. Save to submissions table with status 'pending'
      // 3. Send notification to admins
      // 4. Return success message

      console.log("New ROM submission received:", submissionData);

      // For now, just return success
      res.status(201).json({ 
        message: "ROM submission received successfully",
        submissionId: `sub_${Date.now()}`,
        status: "pending"
      });
    } catch (error) {
      console.error("Error submitting ROM:", error);
      res.status(500).json({ message: "Failed to submit ROM for review" });
    }
  });

  // Get submissions by developer (for "My ROMs" page)
  app.get("/api/developer/roms/submissions", async (req, res) => {
    try {
      // In production, filter submissions by authenticated user
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      // Mock data for now
      const submissions = [
        {
          id: "sub1",
          name: "LineageOS 21",
          version: "21.0-20241106",
          status: "pending",
          submittedAt: new Date().toISOString(),
          reviewNote: null
        }
      ];

      res.json({ submissions });
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      res.status(500).json({ message: "Failed to fetch your submissions" });
    }
  });

  // Admin ROM Management Routes
  
  // Add new ROM (Admin only)
  app.post("/api/admin/roms", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const romData = req.body;
      
      // In production, you would:
      // 1. Validate admin authentication
      // 2. Validate ROM data
      // 3. Save to database
      // 4. Return created ROM

      console.log("Adding new ROM:", romData);

      // Mock response
      const newRom = {
        id: `rom_${Date.now()}`,
        ...romData,
        downloadCount: 0,
        createdAt: new Date().toISOString(),
      };

      res.status(201).json(newRom);
    } catch (error) {
      console.error("Error adding ROM:", error);
      res.status(500).json({ message: "Failed to add ROM" });
    }
  });

  // Update ROM (Admin only)
  app.put("/api/admin/roms/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const romData = req.body;
      
      // In production, you would:
      // 1. Validate admin authentication
      // 2. Validate ROM data
      // 3. Update in database
      // 4. Return updated ROM

      console.log(`Updating ROM ${id}:`, romData);

      res.json({ 
        message: "ROM updated successfully",
        romId: id,
        ...romData
      });
    } catch (error) {
      console.error("Error updating ROM:", error);
      res.status(500).json({ message: "Failed to update ROM" });
    }
  });

  // Delete ROM (Admin only)
  app.delete("/api/admin/roms/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      
      // In production, you would:
      // 1. Validate admin authentication
      // 2. Delete from database
      // 3. Clean up any associated files

      console.log(`Deleting ROM ${id}`);

      res.json({ 
        message: "ROM deleted successfully",
        romId: id
      });
    } catch (error) {
      console.error("Error deleting ROM:", error);
      res.status(500).json({ message: "Failed to delete ROM" });
    }
  });

  // Get all ROMs (including unapproved ones) - Admin only
  app.get("/api/admin/roms/all", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const allRoms = database.getAllRoms();
      
      // Add approval status and additional metadata for admin view
      const romsWithMeta = allRoms.map(rom => ({
        ...rom,
        approvalStatus: rom.is_approved ? 'approved' : 'pending',
        lastUpdated: rom.updated_at,
        isPublic: rom.is_approved, // For clarity in admin interface
        isApproved: Boolean(rom.is_approved) // Convert SQLite integer to boolean
      }));
      
      res.json({ 
        roms: romsWithMeta,
        totalCount: allRoms.length,
        approvedCount: allRoms.filter(r => r.is_approved).length,
        pendingCount: allRoms.filter(r => !r.is_approved).length
      });
    } catch (error) {
      console.error("Error fetching all ROMs:", error);
      res.status(500).json({ message: "Failed to fetch ROMs" });
    }
  });

  // Approve/Disapprove existing ROM - Admin only
  app.patch("/api/admin/roms/:id/approval", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { isApproved, reviewNote } = req.body;
      
      const updatedRom = database.updateRom(id, { 
        is_approved: Boolean(isApproved) ? 1 : 0
      });
      
      if (!updatedRom) {
        return res.status(404).json({ message: "ROM not found" });
      }
      
      console.log(`ROM ${id} ${isApproved ? 'approved' : 'disapproved'} by admin ${req.user?.username}`);
      
      res.json({ 
        message: `ROM ${isApproved ? 'approved' : 'disapproved'} successfully`,
        rom: { ...updatedRom, isApproved: Boolean(updatedRom.is_approved) },
        reviewNote
      });
    } catch (error) {
      console.error("Error updating ROM approval:", error);
      res.status(500).json({ message: "Failed to update ROM approval status" });
    }
  });
}
