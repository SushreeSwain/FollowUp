import { apiFetch } from './api';

function isOnline() {
  return localStorage.getItem('mode') === 'online';
}

// ADD SESSION
export async function addSession(data) {
  if (isOnline()) {
    return apiFetch('/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } else {
    const { addSession } = await import('../storage/sessions');
    return addSession(data);
  }
}

// GET SESSIONS BY CLIENT
export async function getSessionsByClientId(clientId) {
  if (isOnline()) {
    return apiFetch(`/sessions/client/${clientId}`);
  } else {
    const { getSessionsByClientId } = await import('../storage/sessions');
    return getSessionsByClientId(Number(clientId));
  }
}

// GET SINGLE SESSION
export async function getSessionById(id) {
  if (isOnline()) {
    return apiFetch(`/sessions/${id}`);
  } else {
    const { getSessionById } = await import('../storage/sessions');
    return getSessionById(Number(id));
  }
}

// UPDATE SESSION
export async function updateSession(id, data) {
  if (isOnline()) {
    return apiFetch(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } else {
    const { updateSession } = await import('../storage/sessions');
    return updateSession(Number(id), data);
  }
}