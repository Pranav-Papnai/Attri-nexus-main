import { apiUrl } from './config';

const SESSION_KEY = 'attri_nexus_admin_session';

// Older builds kept admin accounts, including plaintext passwords, in this
// key. Removed on load so those passwords do not linger in the browser.
const LEGACY_LOCAL_ADMINS_KEY = 'attri_nexus_local_admins_v2';

// Matches the server's token TTL (backend/src/config.js) — duplicated here only
// because decoding the JWT client-side to read its real `exp` would need an
// extra library for no real benefit at this scale.
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const UNREACHABLE = 'Could not reach the server. Please check your connection and try again.';

export interface AdminSessionUser {
  email: string;
  name: string;
  role: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: string;
}

interface StoredSession {
  token: string;
  user: AdminSessionUser;
  expiresAt: number;
}

try {
  localStorage.removeItem(LEGACY_LOCAL_ADMINS_KEY);
} catch {}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    // Sessions minted by the old client-side fallback carry a fake
    // "attri_session_" token that the server never issued.
    if (
      !parsed?.token ||
      parsed.token.startsWith('attri_session_') ||
      !parsed?.expiresAt ||
      Date.now() >= parsed.expiresAt
    ) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable — session just won't persist across reloads
  }
}

export function clearAdminSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

// Synchronous — just a localStorage read, no network round-trip needed to
// know whether the caller currently has an admin session.
export function getStoredAdminUser(): AdminSessionUser | null {
  return readSession()?.user ?? null;
}

export function getAdminAuthHeader(): Record<string, string> {
  const session = readSession();
  return session ? { Authorization: `Bearer ${session.token}` } : {};
}

async function readBody(res: Response): Promise<any> {
  return res.json().catch(() => ({}));
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminSessionUser }> {
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    });
    const body = await readBody(res);

    if (res.ok && body.success && body.token && body.user) {
      writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
      return { success: true, user: body.user };
    }

    return { success: false, error: body.error || 'Invalid credentials. Please enter correct Email and Password.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export function adminLogout() {
  try {
    const headers = getAdminAuthHeader();
    if (headers.Authorization) {
      fetch(apiUrl('/api/auth/logout'), { method: 'POST', headers }).catch(() => {});
    }
  } catch {
    // Fail-safe
  } finally {
    clearAdminSession();
  }
}

export async function registerAdmin(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const res = await createAdminUser({ email, password, name });
  return { success: res.success, error: res.error };
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(apiUrl('/api/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() })
    });
    const body = await readBody(res);
    if (res.ok && body.success) {
      return { success: true, message: body.message };
    }
    return { success: false, error: body.error || 'Could not request a reset code. Please try again.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function verifyAndResetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string; user?: AdminSessionUser }> {
  try {
    const res = await fetch(apiUrl('/api/auth/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword
      })
    });
    const body = await readBody(res);
    if (res.ok && body.success) {
      if (body.token && body.user) {
        writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
      }
      return body;
    }
    return { success: false, error: body.error || 'Invalid or expired reset code.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function listAdminUsers(): Promise<{ success: boolean; users?: AdminUserRecord[]; error?: string }> {
  try {
    const res = await fetch(apiUrl('/api/auth/users'), {
      headers: { ...getAdminAuthHeader() }
    });
    const body = await readBody(res);
    if (res.ok && body.success && Array.isArray(body.users)) {
      return { success: true, users: body.users };
    }
    return { success: false, error: body.error || 'Could not load admin accounts.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function createAdminUser(data: {
  email: string;
  password: string;
  name?: string;
  role?: string;
}): Promise<{ success: boolean; user?: AdminUserRecord; error?: string }> {
  try {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ ...data, email: data.email.trim().toLowerCase() })
    });
    const body = await readBody(res);
    if (res.ok && body.success && body.user) {
      return { success: true, user: body.user };
    }
    return { success: false, error: body.error || 'Could not create admin account.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl(`/api/auth/users/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: { ...getAdminAuthHeader() }
    });
    const body = await readBody(res);
    if (res.ok && body.success) return { success: true };
    return { success: false, error: body.error || 'Could not delete admin account.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl(`/api/auth/users/${encodeURIComponent(id)}/password`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ newPassword })
    });
    const body = await readBody(res);
    if (res.ok && body.success) {
      // Changing your own password ends every session, this one included; the
      // server hands back a replacement token so the dashboard stays signed in.
      const current = readSession();
      if (body.token && current) {
        writeSession({ token: body.token, user: current.user, expiresAt: Date.now() + TOKEN_TTL_MS });
      }
      return { success: true };
    }
    return { success: false, error: body.error || 'Could not update password.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}
