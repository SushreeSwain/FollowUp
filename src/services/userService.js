import { apiFetch } from './api';

export async function updateEmail(email) {
  return apiFetch('/users/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });
}

export async function updatePassword(currentPassword, newPassword) {
  return apiFetch('/users/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}