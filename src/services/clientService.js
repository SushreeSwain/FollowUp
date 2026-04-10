import { apiFetch } from './api';

function isOnline() {
  return localStorage.getItem('mode')?.trim() === 'online';
}

// ✅ GET ALL CLIENTS
export async function getClients() {
  if (isOnline()) {
    return apiFetch('/clients');
  } else {
    const { getClients } = await import('../storage/clients');
    return getClients();
  }
}

// ✅ ADD CLIENT
export async function addClient(data) {
  if (isOnline()) {
    return apiFetch('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } else {
    const { addClient: addOfflineClient } = await import('../storage/clients');
    return addOfflineClient(data);
  }
}

// ✅ GET BY ID
export async function getClientById(id) {
  if (isOnline()) {
    return apiFetch(`/clients/${id}`);
  } else {
    const { getClientById: getOfflineClientById } = await import('../storage/clients');
    return getOfflineClientById(Number(id)); // ✅ FIX
  }
}

// ✅ UPDATE
export async function updateClient(id, data) {
  if (isOnline()) {
    return apiFetch(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } else {
    const { updateClient: updateOfflineClient } = await import('../storage/clients');
    return updateOfflineClient(Number(id), data); // ✅ FIX
  }
}

// ✅ DELETE
export async function deleteClient(clientId) {
  if (isOnline()) {
    return apiFetch(`/clients/${clientId}`, {
      method: 'DELETE',
    });
  } else {
    const { deleteClient: deleteOfflineClient } = await import('../storage/clients');
    return deleteOfflineClient(Number(clientId)); // ✅ FIX
  }
}