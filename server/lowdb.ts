import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import type { Profile } from '@shared/schema';

// Database structure
interface DatabaseSchema {
  profiles: Profile[];
}

// Initialize database
const adapter = new JSONFile<DatabaseSchema>('db.json');
export const db = new Low(adapter, { profiles: [] });

// Initialize database with default data
export async function initDatabase() {
  await db.read();
  
  // If database is empty, initialize with default structure
  if (!db.data) {
    db.data = { profiles: [] };
    await db.write();
  }
}

// Auto-initialize on import
initDatabase();