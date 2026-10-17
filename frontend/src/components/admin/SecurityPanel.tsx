import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, KeyRound, Copy, Download, RefreshCw } from 'lucide-react';
import {
  fetchCurrentAdmin,
  startMfaSetup,
  enableMfa,
  disableMfa,
  regenerateRecoveryCodes
} from '@/services/api/auth';

interface SecurityPanelProps {
  isDark: boolean;
  // Called after the stored session changes (two-factor on or off).
  onSessionChanged: () => void;
}

type Stage = 'loading' | 'off' | 'setup' | 'codes' | 'on';

const groupKey = (secret: string) => secret.replace(/(.{4})/g, '$1 ').trim();

export const SecurityPanel: React.FC<SecurityPanelProps> = ({ isDark, onSessionChanged }) => {
  const [stage, setStage] = useState<Stage>('loading');
  const [secret, setSecret] = useState('');
  const [otpauthUrl, setOtpauthUrl] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentAdmin().then((res) => setStage(res.user?.mfaEnabled ? 'on' : 'off'));
  }, []);

  const card = isDark ? 'bg-[#131922] border-white/10' : 'bg-white border-[#E8E2D6]';
  const input = `w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-[#8A6828] ${
    isDark ? 'bg-[#0B0F15] border-white/15 text-white' : 'bg-white border-[#D6CEC0] text-[#1E232B]'
  }`;
  const primary =
    'px-4 py-2.5 rounded-xl bg-[#0D3B2E] hover:bg-[#134D3D] text-[#DFD1BA] border border-[#C5A059]/40 font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50';
  const muted = isDark ? 'text-gray-400' : 'text-[#64748B]';

  const reset = () => {
    setCode('');
    setPassword('');
    setError(null);
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  const begin = () =>
    run(async () => {
      const res = await startMfaSetup();
      if (!res.success || !res.secret) {
        setError(res.error || 'Could not start setup.');
        return;
      }
      setSecret(res.secret);
      setOtpauthUrl(res.otpauthUrl || '');
      reset();
      setStage('setup');
    });

  const confirmEnable = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const res = await enableMfa(code);
      if (!res.success) {
        setError(res.error || 'That code did not work.');
        return;
      }
      setRecoveryCodes(res.recoveryCodes || []);
      setSecret('');
      reset();
      onSessionChanged();
      setStage('codes');
    });
  };

  const confirmDisable = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      const res = await disableMfa(password, code);
      if (!res.success) {
        setError(res.error || 'Could not turn off two-factor authentication.');
        return;
      }
      reset();
      onSessionChanged();
      setNotice('Two-factor authentication is now off.');
      setStage('off');
    });
  };

  const newCodes = () =>
    run(async () => {
      const res = await regenerateRecoveryCodes(code);
      if (!res.success) {
        setError(res.error || 'Could not create new recovery codes.');
        return;
      }
      setRecoveryCodes(res.recoveryCodes || []);
      reset();
      setStage('codes');
    });

  const downloadCodes = () => {
    const text = `Attri Nexus admin recovery codes\nEach code works once.\n\n${recoveryCodes.join('\n')}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attri-nexus-recovery-codes.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border ${card}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-2">
          {stage === 'on' || stage === 'codes' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#0D3B2E]'}`}>Two-factor authentication</h3>
            <p className={`text-[11px] ${muted}`}>
              {stage === 'on' || stage === 'codes'
                ? 'On — signing in needs your password and a code from your phone.'
                : 'Off — anyone with your password can sign in. Turn it on to protect customer data.'}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-xs text-rose-500">{error}</p>}
      {notice && <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400">{notice}</p>}

      {stage === 'off' && (
        <button type="button" onClick={begin} disabled={busy} className={`${primary} mt-4`}>
          Turn on two-factor
        </button>
      )}

      {stage === 'setup' && (
        <form onSubmit={confirmEnable} className="mt-4 space-y-3">
          <ol className={`text-xs space-y-1 list-decimal list-inside ${muted}`}>
            <li>Open Google Authenticator, Microsoft Authenticator, Authy or 1Password on your phone.</li>
            <li>Add an account → <strong>Enter a setup key</strong>, and type the key below (time-based).</li>
            <li>Enter the 6-digit code the app shows.</li>
          </ol>
          <div className={`p-3 rounded-xl font-mono text-sm tracking-wider break-all ${isDark ? 'bg-[#0B0F15] text-[#DFD1BA]' : 'bg-[#FAF8F5] text-[#0D3B2E]'}`}>
            {groupKey(secret)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(secret)}
              className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#8A6828] dark:text-[#DFD1BA] cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy key</span>
            </button>
            {otpauthUrl && (
              <a href={otpauthUrl} className="text-[11px] font-bold text-[#8A6828] dark:text-[#DFD1BA] underline">
                Open in authenticator app (on this phone)
              </a>
            )}
          </div>
          <input
            className={input}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
          />
          <div className="flex gap-2">
            <button type="submit" disabled={busy || code.length !== 6} className={primary}>
              Confirm & turn on
            </button>
            <button type="button" onClick={() => { reset(); setStage('off'); }} className={`text-xs ${muted} cursor-pointer`}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {stage === 'codes' && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            Save these recovery codes somewhere safe. Each one signs you in once if you lose your phone. They will not be shown again.
          </p>
          <div className={`grid grid-cols-2 gap-2 p-3 rounded-xl font-mono text-xs ${isDark ? 'bg-[#0B0F15] text-[#DFD1BA]' : 'bg-[#FAF8F5] text-[#0D3B2E]'}`}>
            {recoveryCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={downloadCodes} className={`${primary} inline-flex items-center space-x-1`}>
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button type="button" onClick={() => { setRecoveryCodes([]); setStage('on'); }} className={`text-xs ${muted} cursor-pointer`}>
              I have saved them
            </button>
          </div>
        </div>
      )}

      {stage === 'on' && (
        <form onSubmit={confirmDisable} className="mt-4 space-y-3">
          <p className={`text-[11px] ${muted}`}>
            To turn it off or get new recovery codes, confirm with a current code (or a recovery code).
          </p>
          <input
            className={input}
            placeholder="Authenticator code or recovery code"
            maxLength={11}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 items-center">
            <button type="button" onClick={newCodes} disabled={busy || code.trim().length < 6} className={`${primary} inline-flex items-center space-x-1`}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New recovery codes</span>
            </button>
          </div>
          <div className="pt-2 border-t border-dashed border-gray-300/40 space-y-2">
            <input
              className={input}
              type="password"
              autoComplete="current-password"
              placeholder="Your password (needed to turn off)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy || !password || code.trim().length < 6}
              className="inline-flex items-center space-x-1 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Turn off two-factor</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
