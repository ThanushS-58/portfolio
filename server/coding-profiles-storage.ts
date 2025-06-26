import { JSONFilePreset } from 'lowdb/node';
import type { CodingProfile } from '@shared/schema';

interface CodingProfileDatabase {
  profiles: CodingProfile[];
}

const defaultData: CodingProfileDatabase = { profiles: [] };

let codingProfilesDb: any;

export async function initCodingProfilesDb() {
  if (!codingProfilesDb) {
    codingProfilesDb = await JSONFilePreset('db/coding-profiles.json', defaultData);
  }
  return codingProfilesDb;
}

export class CodingProfileStorage {
  async getProfilesByUserId(profileId: number): Promise<CodingProfile[]> {
    const db = await initCodingProfilesDb();
    await db.read();
    return db.data.profiles.filter((profile: CodingProfile) => 
      profile.id.startsWith(`${profileId}-`)
    );
  }

  async createCodingProfile(profileId: number, codingProfile: Omit<CodingProfile, 'id'>): Promise<CodingProfile> {
    const db = await initCodingProfilesDb();
    await db.read();
    
    const newProfile: CodingProfile = {
      ...codingProfile,
      id: `${profileId}-${codingProfile.platform}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    db.data.profiles.push(newProfile);
    await db.write();
    
    return newProfile;
  }

  async updateCodingProfile(id: string, updates: Partial<CodingProfile>): Promise<CodingProfile | null> {
    const db = await initCodingProfilesDb();
    await db.read();
    
    const index = db.data.profiles.findIndex((profile: CodingProfile) => profile.id === id);
    if (index === -1) return null;
    
    db.data.profiles[index] = { ...db.data.profiles[index], ...updates };
    await db.write();
    
    return db.data.profiles[index];
  }

  async deleteCodingProfile(id: string): Promise<boolean> {
    const db = await initCodingProfilesDb();
    await db.read();
    
    const initialLength = db.data.profiles.length;
    db.data.profiles = db.data.profiles.filter((profile: CodingProfile) => profile.id !== id);
    
    if (db.data.profiles.length < initialLength) {
      await db.write();
      return true;
    }
    
    return false;
  }

  async getAllCodingProfiles(): Promise<CodingProfile[]> {
    const db = await initCodingProfilesDb();
    await db.read();
    return db.data.profiles;
  }

  async getCodingProfilesByPlatform(profileId: number, platform: string): Promise<CodingProfile[]> {
    const db = await initCodingProfilesDb();
    await db.read();
    return db.data.profiles.filter((profile: CodingProfile) => 
      profile.id.startsWith(`${profileId}-`) && profile.platform === platform
    );
  }
}

export const codingProfileStorage = new CodingProfileStorage();