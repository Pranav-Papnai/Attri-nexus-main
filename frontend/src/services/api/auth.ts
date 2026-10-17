import { apiUrl } from './config';

const SESSION_KEY = 'attri_nexus_admin_session';

// Older builds kept admin accounts, including plaintext passwords, in this
// key. Removed on load so those passwords do not linger in the browser.
const LEGACY_LOCAL_ADMINS_KEY = 'attri_nexus_local_admins_v2';

// Matches the server's token TTL (backend/src/config.js TOKEN_TTL) — duplicated
// here only because decoding the JWT client-side to read its real `exp` would
// need an extra library for no real benefit at this scale.
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000;

const UNREACHABLE = 'Could not reach the server. Please check your connection and try again.';

export interface AdminSessionUser {
  email: string;
  name: string;
  role: string;
  mfaEnabled?: boolean;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  mfaEnabled?: boolean;
  createdAt?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  action: string;
  actorEmail?: string;
  targetType?: string;
  targetId?: string;
  ip?: string;
  meta?: Record<string, unknown>;
}

export type LoginResult = {
  success: boolean;
  error?: string;
  user?: AdminSessionUser;
  mfaRequired?: boolean;
  mfaToken?: string;
};

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

export async function adminLogin(email: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    });
    const body = await readBody(res);

    if (res.ok && body.success && body.mfaRequired && body.mfaToken) {
      return { success: false, mfaRequired: true, mfaToken: body.mfaToken };
    }

    if (res.ok && body.success && body.token && body.user) {
      writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
      return { success: true, user: body.user };
    }

    return { success: false, error: body.error || 'Invalid credentials. Please enter correct Email and Password.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

// Second step of a two-factor login: an authenticator code or a recovery code.
export async function completeMfaLogin(mfaToken: string, code: string): Promise<LoginResult> {
  try {
    const res = await fetch(apiUrl('/api/auth/login/mfa'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaToken, code: code.trim() })
    });
    const body = await readBody(res);
    if (res.ok && body.success && body.token && body.user) {
      writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
      return { success: true, user: body.user };
    }
    return { success: false, error: body.error || 'Invalid authentication code.' };
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
  newPassword: string,
  currentPassword?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl(`/api/auth/users/${encodeURIComponent(id)}/password`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ newPassword, currentPassword })
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

// Replaces the stored session after a change that ends other sessions
// (enabling two-factor), keeping this browser signed in.
function replaceSession(token: string | undefined, patch: Partial<AdminSessionUser>) {
  const current = readSession();
  if (current) {
    writeSession({
      token: token || current.token,
      user: { ...current.user, ...patch },
      expiresAt: token ? Date.now() + TOKEN_TTL_MS : current.expiresAt
    });
  }
}

async function authedJson(path: string, method: 'GET' | 'POST' | 'DELETE', payload?: unknown) {
  const res = await fetch(apiUrl(path), {
    method,
    headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}), ...getAdminAuthHeader() },
    body: payload ? JSON.stringify(payload) : undefined
  });
  return { ok: res.ok, status: res.status, body: await readBody(res) };
}

export async function fetchCurrentAdmin(): Promise<{
  success: boolean;
  user?: AdminSessionUser & { id: string };
  error?: string;
}> {
  try {
    const { ok, body } = await authedJson('/api/auth/me', 'GET');
    return ok && body.user ? { success: true, user: body.user } : { success: false, error: body.error };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function startMfaSetup(): Promise<{ success: boolean; secret?: string; otpauthUrl?: string; error?: string }> {
  try {
    const { ok, body } = await authedJson('/api/auth/mfa/setup', 'POST', {});
    return ok ? { success: true, secret: body.secret, otpauthUrl: body.otpauthUrl } : { success: false, error: body.error };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function enableMfa(code: string): Promise<{ success: boolean; recoveryCodes?: string[]; error?: string }> {
  try {
    const { ok, body } = await authedJson('/api/auth/mfa/enable', 'POST', { code: code.trim() });
    if (!ok) return { success: false, error: body.error || 'Could not turn on two-factor authentication.' };
    replaceSession(body.token, { mfaEnabled: true });
    return { success: true, recoveryCodes: body.recoveryCodes };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function disableMfa(password: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { ok, body } = await authedJson('/api/auth/mfa/disable', 'POST', { password, code: code.trim() });
    if (!ok) return { success: false, error: body.error || 'Could not turn off two-factor authentication.' };
    replaceSession(undefined, { mfaEnabled: false });
    return { success: true };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function regenerateRecoveryCodes(code: string): Promise<{ success: boolean; recoveryCodes?: string[]; error?: string }> {
  try {
    const { ok, body } = await authedJson('/api/auth/mfa/recovery-codes', 'POST', { code: code.trim() });
    return ok ? { success: true, recoveryCodes: body.recoveryCodes } : { success: false, error: body.error };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function resetAdminMfa(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { ok, body } = await authedJson(`/api/auth/users/${encodeURIComponent(id)}/mfa`, 'DELETE');
    return ok ? { success: true } : { success: false, error: body.error || 'Could not reset two-factor authentication.' };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

export async function fetchAuditLog(limit = 200): Promise<{ success: boolean; entries?: AuditEntry[]; error?: string }> {
  try {
    const { ok, body } = await authedJson(`/api/audit?limit=${limit}`, 'GET');
    return ok && Array.isArray(body.data) ? { success: true, entries: body.data } : { success: false, error: body.error };
  } catch {
    return { success: false, error: UNREACHABLE };
  }
}

// Lead CSVs are built in the browser, so each export is reported to the
// audit log first. Exporting is refused when that fails, so the log stays complete.
export async function recordLeadExport(count: number, range: string): Promise<boolean> {
  try {
    const { ok } = await authedJson('/api/audit/lead-export', 'POST', { count, range });
    return ok;
  } catch {
    return false;
  }
}
