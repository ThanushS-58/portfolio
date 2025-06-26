import { type Profile, type InsertProfile, type UpdateProfile } from "@shared/schema";
import { db } from "./lowdb";

export interface IStorage {
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: number, profile: UpdateProfile): Promise<Profile | undefined>;
  deleteProfile(id: number): Promise<boolean>;
  getAllProfiles(): Promise<Profile[]>;
}

export class LowDBStorage implements IStorage {
  async getProfile(id: number): Promise<Profile | undefined> {
    await db.read();
    return db.data.profiles.find(p => p.id === id);
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    await db.read();
    return db.data.profiles.find(p => p.email === email);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    await db.read();
    
    const newId = Math.max(...db.data.profiles.map(p => p.id), 0) + 1;
    const newProfile: Profile = {
      ...insertProfile,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    db.data.profiles.push(newProfile);
    await db.write();
    
    return newProfile;
  }

  async updateProfile(id: number, updateProfile: UpdateProfile): Promise<Profile | undefined> {
    await db.read();
    
    const index = db.data.profiles.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    
    db.data.profiles[index] = {
      ...db.data.profiles[index],
      ...updateProfile,
      updatedAt: new Date().toISOString(),
    };
    
    await db.write();
    return db.data.profiles[index];
  }

  async deleteProfile(id: number): Promise<boolean> {
    await db.read();
    
    const initialLength = db.data.profiles.length;
    db.data.profiles = db.data.profiles.filter(p => p.id !== id);
    
    if (db.data.profiles.length < initialLength) {
      await db.write();
      return true;
    }
    
    return false;
  }

  async getAllProfiles(): Promise<Profile[]> {
    await db.read();
    return db.data.profiles;
  }
}

export const storage = new LowDBStorage();