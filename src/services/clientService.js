import * as offline from '../storage/clients';

export async function getAllClients() {
  return offline.getAllClients();
}

export async function getClientById(id) {
  return offline.getClientById(id);
}

export async function addClient(data) {
  return offline.addClient(data);
}

export async function updateClient(id, data) {
  return offline.updateClient(id, data);
}

export async function deleteClient(id) {
  return offline.deleteClient(id);
}