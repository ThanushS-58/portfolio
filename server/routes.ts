import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, updateProfileSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Get all profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  // Get profile by ID
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const profile = await storage.getProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Create new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      
      // Check if email already exists
      const existingProfile = await storage.getProfileByEmail(validatedData.email);
      if (existingProfile) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create profile" });
      }
    }
  });

  // Update profile
  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const validatedData = updateProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(id, validatedData);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const success = await storage.deleteProfile(id);
      if (!success) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json({ message: "Profile deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });

  // Upload profile photo
  app.post("/api/profiles/:id/photo", upload.single('photo'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const filename = `profile-${id}-${Date.now()}${fileExtension}`;
      const newPath = path.join(uploadDir, filename);

      // Move file to permanent location
      fs.renameSync(req.file.path, newPath);

      const photoUrl = `/uploads/${filename}`;
      
      // Update profile with photo URL
      const profile = await storage.updateProfile(id, { profilePhotoUrl: photoUrl });
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json({ photoUrl, profile });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  const httpServer = createServer(app);
  // Import the storage modules
  const { cocurricularStorage } = await import('./cocurricular-storage.js');
  const { codingProfileStorage } = await import('./coding-profiles-storage.js');

  // Co-curricular Activities routes
  app.get('/api/profiles/:id/cocurricular', async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const activities = await cocurricularStorage.getActivitiesByProfileId(profileId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  app.post('/api/profiles/:id/cocurricular', async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const activity = await cocurricularStorage.createActivity(profileId, req.body);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activity' });
    }
  });

  app.put('/api/profiles/:id/cocurricular/:activityId', async (req, res) => {
    try {
      const activity = await cocurricularStorage.updateActivity(req.params.activityId, req.body);
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update activity' });
    }
  });

  app.delete('/api/profiles/:id/cocurricular/:activityId', async (req, res) => {
    try {
      const deleted = await cocurricularStorage.deleteActivity(req.params.activityId);
      if (!deleted) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete activity' });
    }
  });

  // Coding Profiles routes
  app.get('/api/profiles/:id/coding-profiles', async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const profiles = await codingProfileStorage.getProfilesByUserId(profileId);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch coding profiles' });
    }
  });

  app.post('/api/profiles/:id/coding-profiles', async (req, res) => {
    try {
      const profileId = parseInt(req.params.id);
      const profile = await codingProfileStorage.createCodingProfile(profileId, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create coding profile' });
    }
  });

  app.put('/api/profiles/:id/coding-profiles/:profileId', async (req, res) => {
    try {
      const profile = await codingProfileStorage.updateCodingProfile(req.params.profileId, req.body);
      if (!profile) {
        return res.status(404).json({ error: 'Coding profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update coding profile' });
    }
  });

  app.delete('/api/profiles/:id/coding-profiles/:profileId', async (req, res) => {
    try {
      const deleted = await codingProfileStorage.deleteCodingProfile(req.params.profileId);
      if (!deleted) {
        return res.status(404).json({ error: 'Coding profile not found' });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete coding profile' });
    }
  });

  return httpServer;
}
