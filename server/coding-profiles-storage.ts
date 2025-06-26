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
    await codingProfilesDb.read();
    return codingProfilesDb.data.profiles.filter(profile => 
      profile.id.startsWith(`${profileId}-`)
    );
  }

  async createCodingProfile(profileId: number, codingProfile: Omit<CodingProfile, 'id'>): Promise<CodingProfile> {
    await codingProfilesDb.read();
    
    const newProfile: CodingProfile = {
      ...codingProfile,
      id: `${profileId}-${codingProfile.platform}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    codingProfilesDb.data.profiles.push(newProfile);
    await codingProfilesDb.write();
    
    return newProfile;
  }

  async updateCodingProfile(id: string, updates: Partial<CodingProfile>): Promise<CodingProfile | null> {
    await codingProfilesDb.read();
    
    const index = codingProfilesDb.data.profiles.findIndex(profile => profile.id === id);
    if (index === -1) return null;
    
    codingProfilesDb.data.profiles[index] = { ...codingProfilesDb.data.profiles[index], ...updates };
    await codingProfilesDb.write();
    
    return codingProfilesDb.data.profiles[index];
  }

  async deleteCodingProfile(id: string): Promise<boolean> {
    await codingProfilesDb.read();
    
    const initialLength = codingProfilesDb.data.profiles.length;
    codingProfilesDb.data.profiles = codingProfilesDb.data.profiles.filter(profile => profile.id !== id);
    
    if (codingProfilesDb.data.profiles.length < initialLength) {
      await codingProfilesDb.write();
      return true;
    }
    
    return false;
  }

  async getAllCodingProfiles(): Promise<CodingProfile[]> {
    await codingProfilesDb.read();
    return codingProfilesDb.data.profiles;
  }

  async getCodingProfilesByPlatform(profileId: number, platform: string): Promise<CodingProfile[]> {
    await codingProfilesDb.read();
    return codingProfilesDb.data.profiles.filter(profile => 
      profile.id.startsWith(`${profileId}-`) && profile.platform === platform
    );
  }
}

export const codingProfileStorage = new CodingProfileStorage();