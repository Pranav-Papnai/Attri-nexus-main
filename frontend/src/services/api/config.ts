/**
 * Centralized API configuration for Attri Nexus Frontend.
 *
 * In local development or same-origin production (via Nginx / Vite proxy),
 * VITE_API_BASE_URL is empty (''), and requests use relative paths like '/api/products'.
 *
 * If hosting frontend and backend on separate domains/subdomains (e.g.
 * Frontend: https://attrinexus.com, Backend: https://api.attrinexus.com),
 * set VITE_API_BASE_URL=https://api.attrinexus.com in frontend/.env.local or production env.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
