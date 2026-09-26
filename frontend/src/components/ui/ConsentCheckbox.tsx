import React from 'react';
import { Link } from 'react-router-dom';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  /** Slightly smaller type for the compact modals. */
  compact?: boolean;
}

/**
 * DPDP Act 2023 s.6 consent control shared by every public enquiry form.
 * Unchecked by default on purpose - pre-ticked boxes are not valid consent.
 */
export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ id, checked, onChange, error, compact = false }) => {
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#B22234] cursor-pointer"
        />
        <label htmlFor={id} className={`${compact ? 'text-[11px]' : 'text-xs'} leading-relaxed text-slate-600 cursor-pointer`}>
          I consent to Attri Nexus storing and using the details I have entered to respond to this enquiry, as described in the{' '}
          <Link
            to="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#8C6D2B] underline underline-offset-2 hover:text-[#B22234]"
          >
            Privacy Policy
          </Link>
          . I can withdraw this consent at any time.{' '}
          <span className="text-[#B22234]" aria-hidden="true">*</span>
        </label>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-rose-600 font-semibold">
          {error}
        </p>
      )}
    </div>
  );
};
