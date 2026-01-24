import Dexie from 'dexie';

export const db = new Dexie('followup_db');

db.version(1).stores({
  clients: '++id, name, createdAt, updatedAt',
  sessions: '++id, clientId, date, createdAt, updatedAt'
});

// Explicitly open the database
db.open().catch((err) => {
  console.error('Failed to open IndexedDB:', err);
});
