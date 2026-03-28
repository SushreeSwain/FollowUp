import * as offline from '../storage/sessions';

// Get sessions by client
export async function getSessionsByClientId(clientId) {
  return offline.getSessionsByClientId(clientId);
}

// Get single session
export async function getSessionById(id) {
  return offline.getSessionById(id);
}

// Add session
export async function addSession(data) {
  return offline.addSession(data);
}

// Update session
export async function updateSession(id, data) {
  return offline.updateSession(id, data);
}

// Delete session
export async function deleteSession(id) {
  return offline.deleteSession(id);
}