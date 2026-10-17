import React, { useCallback, useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { fetchAuditLog, AuditEntry } from '@/services/api/auth';

const LABELS: Record<string, string> = {
  'auth.login.success': 'Signed in',
  'auth.login.failure': 'Failed sign-in',
  'auth.login.mfa_challenge': 'Password accepted, code requested',
  'auth.mfa.failure': 'Wrong two-factor code',
  'auth.mfa.recovery_code_used': 'Signed in with a recovery code',
  'auth.logout': 'Signed out',
  'auth.password.changed': 'Password changed',
  'auth.password.change_failed': 'Password change refused (wrong current password)',
  'auth.password_reset.requested': 'Password reset email sent',
  'auth.password_reset.unknown_email': 'Reset requested for unknown email',
  'auth.password_reset.cooldown': 'Reset request ignored (too soon)',
  'auth.password_reset.failure': 'Wrong reset code',
  'auth.password_reset.completed': 'Password reset completed',
  'admin.created': 'Admin created',
  'admin.deleted': 'Admin deleted',
  'admin.mfa_reset': 'Two-factor reset for an admin',
  'mfa.enabled': 'Two-factor turned on',
  'mfa.disabled': 'Two-factor turned off',
  'mfa.disable_failed': 'Two-factor turn-off refused',
  'mfa.recovery_codes_regenerated': 'New recovery codes created',
  'inquiry.updated': 'Lead updated',
  'inquiry.deleted': 'Lead deleted',
  'inquiries.exported': 'Leads exported to CSV',
  'product.created': 'Product created',
  'product.updated': 'Product updated',
  'product.deleted': 'Product deleted',
  'upload.image': 'Image uploaded'
};

const ALERT_ACTIONS = new Set([
  'auth.login.failure',
  'auth.mfa.failure',
  'auth.password.change_failed',
  'auth.password_reset.failure',
  'mfa.disable_failed',
  'admin.deleted',
  'admin.mfa_reset',
  'mfa.disabled',
  'inquiry.deleted',
  'inquiries.exported'
]);

const describeMeta = (entry: AuditEntry) => {
  const meta = entry.meta || {};
  if (entry.action === 'inquiries.exported') return `${meta.count ?? '?'} leads${meta.range ? `, ${meta.range}` : ''}`;
  if (typeof meta.email === 'string') return meta.email;
  if (entry.action === 'inquiry.updated' && meta.status) return `status → ${meta.status}`;
  return entry.targetId ? `${entry.targetType || 'item'} ${String(entry.targetId).slice(-8)}` : '';
};

export const AuditLogPanel: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAuditLog(200);
    setLoading(false);
    if (res.success && res.entries) {
      setEntries(res.entries);
      setError(null);
    } else {
      setError(res.error || 'Could not load the security log.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const card = isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]';
  const head = isDark ? 'bg-[#0B0F15]/70 border-white/10 text-[#DFD1BA]' : 'bg-[#FAF8F5] border-[#E8E2D6] text-[#0D3B2E]';

  return (
    <div className={`rounded-2xl border overflow-hidden ${card}`}>
      <div className={`p-4 border-b flex items-center justify-between ${head}`}>
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Security activity (last 200 events)</span>
        </div>
        <button type="button" onClick={load} disabled={loading} className="p-1.5 rounded-lg border text-xs cursor-pointer" title="Refresh">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      {error ? (
        <p className="p-4 text-xs text-rose-500">{error}</p>
      ) : (
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-[11px]">
            <thead className={`sticky top-0 uppercase tracking-wider font-bold ${head}`}>
              <tr>
                <th className="px-4 py-2.5">When</th>
                <th className="px-4 py-2.5">Event</th>
                <th className="px-4 py-2.5">By</th>
                <th className="px-4 py-2.5">Details</th>
                <th className="px-4 py-2.5">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {entries.map((entry) => (
                <tr key={entry.id} className={ALERT_ACTIONS.has(entry.action) ? 'text-amber-600 dark:text-amber-400' : isDark ? 'text-gray-300' : 'text-[#1E232B]'}>
                  <td className="px-4 py-2 font-mono whitespace-nowrap">{new Date(entry.at).toLocaleString()}</td>
                  <td className="px-4 py-2">{LABELS[entry.action] || entry.action}</td>
                  <td className="px-4 py-2 font-mono">{entry.actorEmail || '—'}</td>
                  <td className="px-4 py-2">{describeMeta(entry)}</td>
                  <td className="px-4 py-2 font-mono">{entry.ip || ''}</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    No events yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
