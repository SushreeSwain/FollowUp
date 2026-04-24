import { apiFetch } from './api';

export async function updateEmail(email) {
  return apiFetch('/users/email', {
    method: 'PUT',
    body: JSON.stringify({ email }),
  });
}