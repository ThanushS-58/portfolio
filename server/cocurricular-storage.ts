import { JSONFilePreset } from 'lowdb/node';
import type { CocurricularActivity } from '@shared/schema';

interface CocurricularDatabase {
  activities: CocurricularActivity[];
}

const defaultData: CocurricularDatabase = { activities: [] };

let cocurricularDb: any;

export async function initCocurricularDb() {
  if (!cocurricularDb) {
    cocurricularDb = await JSONFilePreset('db/cocurricular.json', defaultData);
  }
  return cocurricularDb;
}

export class CocurricularActivityStorage {
  async getActivitiesByProfileId(profileId: number): Promise<CocurricularActivity[]> {
    const db = await initCocurricularDb();
    await db.read();
    return db.data.activities.filter((activity: CocurricularActivity) => 
      activity.id.startsWith(`${profileId}-`)
    );
  }

  async createActivity(profileId: number, activity: Omit<CocurricularActivity, 'id'>): Promise<CocurricularActivity> {
    await cocurricularDb.read();
    
    const newActivity: CocurricularActivity = {
      ...activity,
      id: `${profileId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    cocurricularDb.data.activities.push(newActivity);
    await cocurricularDb.write();
    
    return newActivity;
  }

  async updateActivity(id: string, updates: Partial<CocurricularActivity>): Promise<CocurricularActivity | null> {
    await cocurricularDb.read();
    
    const index = cocurricularDb.data.activities.findIndex(activity => activity.id === id);
    if (index === -1) return null;
    
    cocurricularDb.data.activities[index] = { ...cocurricularDb.data.activities[index], ...updates };
    await cocurricularDb.write();
    
    return cocurricularDb.data.activities[index];
  }

  async deleteActivity(id: string): Promise<boolean> {
    await cocurricularDb.read();
    
    const initialLength = cocurricularDb.data.activities.length;
    cocurricularDb.data.activities = cocurricularDb.data.activities.filter(activity => activity.id !== id);
    
    if (cocurricularDb.data.activities.length < initialLength) {
      await cocurricularDb.write();
      return true;
    }
    
    return false;
  }

  async getAllActivities(): Promise<CocurricularActivity[]> {
    await cocurricularDb.read();
    return cocurricularDb.data.activities;
  }
}

export const cocurricularStorage = new CocurricularActivityStorage();