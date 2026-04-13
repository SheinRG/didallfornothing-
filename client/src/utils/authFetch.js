/**
 * authFetch — a drop-in replacement for fetch() that automatically
 * attaches the Bearer token from localStorage to every request.
 * 
 * Usage: import { authFetch } from '../utils/authFetch';
 *        const res = await authFetch(`${API}/sessions`);
 *        const res = await authFetch(`${API}/sessions`, { method: 'POST', body: ... });
 */

const TOKEN_KEY = 'orion_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
