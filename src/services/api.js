const BASE_URL = 'https://followup-backend-90z3.onrender.com/api';
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    if (res.status === 403) {
        const token = localStorage.getItem('token');

        if (token) {
            window.location.href = '/403';
        } else {
            window.location.href = '/login';
        }

        return;
        }

        const error = new Error(data?.error || 'Request failed');
        error.status = res.status;
        throw error;
    }

  return data;
}