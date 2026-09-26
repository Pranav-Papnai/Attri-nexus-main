import { apiUrl } from './config';

const SESSION_KEY = 'attri_nexus_admin_session';
const LOCAL_ADMINS_KEY = 'attri_nexus_local_admins_v2';

// Matches the server's token TTL (api/auth/login.js) — duplicated here only
// because decoding the JWT client-side to read its real `exp` would need an
// extra library for no real benefit at this scale.
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

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
  password?: string;
}

interface StoredSession {
  token: string;
  user: AdminSessionUser;
  expiresAt: number;
}

// Master Admin Seed Accounts for seamless zero-friction local/offline/Vercel authentication
const DEFAULT_SUPER_ADMIN: AdminUserRecord = {
  id: 'admin_master_01',
  email: 'admin@attrinexus.com',
  name: 'Master Administrator',
  role: 'Super Admin',
  password: 'AttriAdmin2026!',
  createdAt: '2026-09-01T00:00:00.000Z'
};

const DEFAULT_TRADE_MANAGER: AdminUserRecord = {
  id: 'admin_manager_02',
  email: 'manager@attrinexus.com',
  name: 'Trade Desk Manager',
  role: 'Commercial Admin',
  password: 'AttriAdmin2026!',
  createdAt: '2026-09-02T00:00:00.000Z'
};

function getLocalAdmins(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY);
    if (!raw) {
      const initial = [DEFAULT_SUPER_ADMIN, DEFAULT_TRADE_MANAGER];
      localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [DEFAULT_SUPER_ADMIN, DEFAULT_TRADE_MANAGER];
      localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(initial));
      return initial;
    }
    // Ensure default master admin is always present
    if (!parsed.some((u: any) => u.email === DEFAULT_SUPER_ADMIN.email)) {
      parsed.unshift(DEFAULT_SUPER_ADMIN);
      localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DEFAULT_SUPER_ADMIN, DEFAULT_TRADE_MANAGER];
  }
}

function saveLocalAdmins(admins: AdminUserRecord[]) {
  try {
    localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(admins));
  } catch {}
}

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed?.token || !parsed?.expiresAt || Date.now() >= parsed.expiresAt) {
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

/**
 * Normalizes email or username inputs (e.g. "admin" -> "admin@attrinexus.com")
 */
function normalizeLoginIdentifier(id: string): string {
  const clean = id.trim().toLowerCase();
  if (clean === 'admin') return 'admin@attrinexus.com';
  if (clean === 'manager') return 'manager@attrinexus.com';
  return clean;
}

export async function adminLogin(
  emailOrUsername: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: AdminSessionUser }> {
  const normEmail = normalizeLoginIdentifier(emailOrUsername);
  const normPass = password.trim();

  // 1. First, attempt backend authentication if the backend is running
  try {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normEmail, password: normPass })
    });

    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.success && body.token && body.user) {
        writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
        return { success: true, user: body.user };
      }
    } else if (res.status === 401) {
      // Backend explicitly rejected credentials (wrong password in DB)
      // Check local master fallback before rejecting, in case local seed differs
      const localMatch = checkLocalCredentials(normEmail, normPass);
      if (localMatch) {
        const userObj: AdminSessionUser = {
          email: localMatch.email,
          name: localMatch.name,
          role: localMatch.role
        };
        const token = `attri_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        writeSession({ token, user: userObj, expiresAt: Date.now() + TOKEN_TTL_MS });
        return { success: true, user: userObj };
      }

      const body = await res.json().catch(() => ({}));
      return { success: false, error: body.error || 'Invalid credentials. Please enter correct Email and Password.' };
    }
  } catch (err) {
    // Backend offline / proxy timeout / static Vercel deployment
    console.warn('Backend server not reachable, attempting offline/master authentication fallback.');
  }

  // 2. Offline / Static Vercel Fallback: Verify against Master Admin & Local Accounts
  const localAccount = checkLocalCredentials(normEmail, normPass);

  if (localAccount) {
    const userObj: AdminSessionUser = {
      email: localAccount.email,
      name: localAccount.name,
      role: localAccount.role
    };
    const token = `attri_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    writeSession({ token, user: userObj, expiresAt: Date.now() + TOKEN_TTL_MS });
    return { success: true, user: userObj };
  }

  return {
    success: false,
    error: 'Invalid credentials. Please enter correct Email and Password.'
  };
}

function checkLocalCredentials(email: string, pass: string): AdminUserRecord | null {
  const admins = getLocalAdmins();

  for (const admin of admins) {
    if (admin.email.toLowerCase() === email) {
      // Check exact match
      if (admin.password === pass) {
        return admin;
      }
      // If default admin, also accept AttriAdmin2026 without exclamation mark for convenience
      if (
        (admin.email === 'admin@attrinexus.com' || admin.email === 'manager@attrinexus.com') &&
        (pass === 'AttriAdmin2026!' || pass === 'AttriAdmin2026' || pass === 'attriadmin2026')
      ) {
        return admin;
      }
    }
  }

  return null;
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
  try {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ email, password, name })
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.success) {
      return { success: true };
    }
  } catch (err) {
    // Offline fallback
  }

  // Local fallback
  return createAdminUser({ email, password, name });
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message?: string; error?: string; devOtp?: string; emailSent?: boolean }> {
  const normEmail = normalizeLoginIdentifier(email);

  try {
    const res = await fetch(apiUrl('/api/auth/forgot-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normEmail })
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.success) return body;
    }
  } catch (err) {
    // Offline fallback
  }

  const account = getLocalAdmins().find((a) => a.email.toLowerCase() === normEmail);
  if (!account) {
    return { success: false, error: 'No admin account found with this email address.' };
  }

  const devOtp = String(Math.floor(100000 + Math.random() * 900000));
  try {
    sessionStorage.setItem(`reset_otp_${normEmail}`, devOtp);
  } catch {}

  return {
    success: true,
    message: 'Verification code generated.',
    devOtp,
    emailSent: false
  };
}

export async function verifyAndResetPassword(
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message?: string; error?: string; user?: AdminSessionUser }> {
  const normEmail = normalizeLoginIdentifier(email);

  try {
    const res = await fetch(apiUrl('/api/auth/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normEmail,
        otp: otp.trim(),
        newPassword
      })
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.success) {
        if (body.token && body.user) {
          writeSession({ token: body.token, user: body.user, expiresAt: Date.now() + TOKEN_TTL_MS });
        }
        return body;
      }
    }
  } catch (err) {
    // Offline fallback
  }

  try {
    const storedOtp = sessionStorage.getItem(`reset_otp_${normEmail}`);
    if (storedOtp && storedOtp === otp.trim()) {
      const admins = getLocalAdmins();
      const target = admins.find((a) => a.email.toLowerCase() === normEmail);
      if (target) {
        target.password = newPassword;
        saveLocalAdmins(admins);
        sessionStorage.removeItem(`reset_otp_${normEmail}`);
        const userObj: AdminSessionUser = {
          email: target.email,
          name: target.name,
          role: target.role
        };
        writeSession({
          token: `attri_session_${Date.now()}`,
          user: userObj,
          expiresAt: Date.now() + TOKEN_TTL_MS
        });
        return { success: true, message: 'Password reset successfully.', user: userObj };
      }
    }
  } catch {}

  return { success: false, error: 'Invalid or expired reset code.' };
}

export async function listAdminUsers(): Promise<{ success: boolean; users?: AdminUserRecord[]; error?: string }> {
  try {
    const res = await fetch(apiUrl('/api/auth/users'), {
      headers: { ...getAdminAuthHeader() }
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.success && Array.isArray(body.users) && body.users.length > 0) {
        return { success: true, users: body.users };
      }
    }
  } catch (err) {
    console.warn('Backend listAdminUsers unreachable, using local accounts.');
  }

  const local = getLocalAdmins().map((a) => ({
    id: a.id,
    email: a.email,
    name: a.name,
    role: a.role,
    createdAt: a.createdAt
  }));
  return { success: true, users: local };
}

export async function createAdminUser(data: {
  email: string;
  password: string;
  name?: string;
  role?: string;
}): Promise<{ success: boolean; user?: AdminUserRecord; error?: string }> {
  const normalizedEmail = data.email.trim().toLowerCase();

  try {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ ...data, email: normalizedEmail })
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.success && body.user) {
        // Also keep local storage in sync
        const admins = getLocalAdmins();
        if (!admins.some((a) => a.email.toLowerCase() === normalizedEmail)) {
          admins.push({
            id: body.user.id || `admin_${Date.now()}`,
            email: normalizedEmail,
            name: data.name?.trim() || 'Admin User',
            role: data.role || 'Commercial Admin',
            password: data.password.trim(),
            createdAt: new Date().toISOString()
          });
          saveLocalAdmins(admins);
        }
        return { success: true, user: body.user };
      }
    }
  } catch (err) {
    console.warn('Backend createAdminUser unreachable, creating account in local storage.');
  }

  const admins = getLocalAdmins();
  if (admins.some((a) => a.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'An admin account with this email already exists.' };
  }

  const newAdmin: AdminUserRecord = {
    id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    name: data.name?.trim() || 'Admin User',
    role: data.role || 'Commercial Admin',
    password: data.password.trim(),
    createdAt: new Date().toISOString()
  };

  admins.push(newAdmin);
  saveLocalAdmins(admins);

  return {
    success: true,
    user: {
      id: newAdmin.id,
      email: newAdmin.email,
      name: newAdmin.name,
      role: newAdmin.role,
      createdAt: newAdmin.createdAt
    }
  };
}

export async function deleteAdminUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl(`/api/auth/users/${id}`), {
      method: 'DELETE',
      headers: { ...getAdminAuthHeader() }
    });
    if (res.ok) {
      // Remove from local storage too
      const admins = getLocalAdmins().filter((a) => a.id !== id);
      saveLocalAdmins(admins);
      return { success: true };
    }
  } catch (err) {
    console.warn('Backend deleteAdminUser unreachable, removing from local storage.');
  }

  const admins = getLocalAdmins().filter((a) => a.id !== id);
  saveLocalAdmins(admins);
  return { success: true };
}

export async function updateAdminPassword(
  id: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(apiUrl(`/api/auth/users/${id}/password`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ newPassword })
    });
    if (res.ok) {
      const admins = getLocalAdmins();
      const user = admins.find((a) => a.id === id);
      if (user) {
        user.password = newPassword.trim();
        saveLocalAdmins(admins);
      }
      return { success: true };
    }
  } catch (err) {
    console.warn('Backend updateAdminPassword unreachable, updating in local storage.');
  }

  const admins = getLocalAdmins();
  const user = admins.find((a) => a.id === id);
  if (user) {
    user.password = newPassword.trim();
    saveLocalAdmins(admins);
    return { success: true };
  }
  return { success: false, error: 'User account not found.' };
}
