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
    const db = await initCocurricularDb();
    await db.read();
    
    const newActivity: CocurricularActivity = {
      ...activity,
      id: `${profileId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    db.data.activities.push(newActivity);
    await db.write();
    
    return newActivity;
  }

  async updateActivity(id: string, updates: Partial<CocurricularActivity>): Promise<CocurricularActivity | null> {
    const db = await initCocurricularDb();
    await db.read();
    
    const index = db.data.activities.findIndex((activity: CocurricularActivity) => activity.id === id);
    if (index === -1) return null;
    
    db.data.activities[index] = { ...db.data.activities[index], ...updates };
    await db.write();
    
    return db.data.activities[index];
  }

  async deleteActivity(id: string): Promise<boolean> {
    const db = await initCocurricularDb();
    await db.read();
    
    const initialLength = db.data.activities.length;
    db.data.activities = db.data.activities.filter((activity: CocurricularActivity) => activity.id !== id);
    
    if (db.data.activities.length < initialLength) {
      await db.write();
      return true;
    }
    
    return false;
  }

  async getAllActivities(): Promise<CocurricularActivity[]> {
    const db = await initCocurricularDb();
    await db.read();
    return db.data.activities;
  }
}

export const cocurricularStorage = new CocurricularActivityStorage();