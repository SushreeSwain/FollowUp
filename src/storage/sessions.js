import { db } from './db';

/**
 * Add a new session for a client
 */
export async function addSession({ clientId, date, notes = '', title = '' }) {
  if (!clientId) {
    throw new Error('clientId is required');
  }

  if (!date) {
    throw new Error('session date is required');
  }

  const now = new Date().toISOString();

  const session = {
    clientId: Number(clientId), // ✅ FIX
    date,
    title,
    notes,
    createdAt: now,
    updatedAt: now,
  };

  const id = await db.sessions.add(session);
  return id;
}

/**
 * Get all sessions for a client
 */
export async function getSessionsByClientId(clientId) {
  if (!clientId) {
    throw new Error('clientId is required');
  }

  return db.sessions
    .where('clientId')
    .equals(Number(clientId)) // ✅ FIX
    .reverse() // newest first
    .sortBy('date');
}

/**
 * Get a single session by ID
 */
export async function getSessionById(id) {
  if (!id) {
    throw new Error('session id is required');
  }

  return db.sessions.get(Number(id)); // ✅ FIX
}

/**
 * Update an existing session
 */
export async function updateSession(id, updates = {}) {
  if (!id) {
    throw new Error('session id is required');
  }

  const allowedFields = ['date', 'notes', 'title'];
  const filteredUpdates = {};

  for (const key of allowedFields) {
    if (key in updates) {
      filteredUpdates[key] = updates[key];
    }
  }

  if ('date' in filteredUpdates && !filteredUpdates.date) {
    throw new Error('session date is required');
  }

  filteredUpdates.updatedAt = new Date().toISOString();

  await db.sessions.update(Number(id), filteredUpdates); // ✅ FIX
}

/**
 * Delete a session by ID
 */
export async function deleteSession(id) {
  if (!id) {
    throw new Error('session id is required');
  }

  await db.sessions.delete(Number(id)); // ✅ FIX
}