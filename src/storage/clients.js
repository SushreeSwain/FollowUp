import { db } from './db';

/**
 * Add a new client to the database
 */
export async function addClient({ name, contactInfo = '', info = '' }) {
  if (!name || name.trim() === '') {
    throw new Error('Client name is required');
  }

  const now = new Date().toISOString();

  const client = {
    name: name.trim(),
    contactInfo,
    info,
    createdAt: now,
    updatedAt: now
  };

  const id = await db.clients.add(client);
  return id;
}



/**
 * Get all clients from the database
 */
export async function getClients() {
  const clients = await db.clients
    .orderBy('createdAt')
    .reverse()
    .toArray();

  return clients;
}


/**
 * Get a single client by ID
 */
export async function getClientById(id) {
  if (!id) {
    throw new Error('Client ID is required');
  }

  const client = await db.clients.get(Number(id));
  return client;
}



/**
 * Update an existing client
 */
export async function updateClient(id, updates = {}) {
  if (!id) {
    throw new Error('Client ID is required');
  }

  const allowedFields = ['name', 'contactInfo', 'info'];
  const filteredUpdates = {};

  for (const key of allowedFields) {
    if (key in updates) {
      filteredUpdates[key] = updates[key];
    }
  }

  if (
    'name' in filteredUpdates &&
    (!filteredUpdates.name || filteredUpdates.name.trim() === '')
  ) {
    throw new Error('Client name cannot be empty');
  }

  filteredUpdates.updatedAt = new Date().toISOString();

  await db.clients.update(Number(id), filteredUpdates);
}



/**
 * Delete a client by ID
 */
export async function deleteClient(id) {
  if (!id) {
    throw new Error('Client ID is required');
  }

  await db.clients.delete(Number(id));
}

