/**
 * Single source of truth for the legal pages. Bump PRIVACY_POLICY_VERSION
 * whenever the Privacy Policy text changes - it is stored with every enquiry
 * so we can prove which version a person consented to (DPDP Act 2023 s.6).
 */
export const PRIVACY_POLICY_VERSION = '2026-09';
export const LEGAL_LAST_UPDATED = '26 September 2026';

/** Closed enquiries are purged this long after they are marked closed. */
export const INQUIRY_RETENTION_MONTHS = 24;

/**
 * DPDP Act 2023 s.8(10): a Data Fiduciary must publish the contact of the
 * person who answers data-protection questions. TODO (Phase 2): replace the
 * placeholder name with the real officer and use a business-domain mailbox.
 */
export const GRIEVANCE_OFFICER = {
  name: '[Grievance Officer name – to be confirmed]',
  email: 'akashiseijuro1b@gmail.com'
};

/**
 * Third parties that process visitor data on our behalf. Listed in the
 * Privacy Policy and Cookie Policy - keep in sync with what the code actually
 * loads (frontend/index.html, components/ui/Turnstile.tsx, backend/src/lib).
 */
export const DATA_PROCESSORS = [
  { name: 'MongoDB Atlas', purpose: 'Stores enquiry records', location: 'Mumbai, India (AWS ap-south-1)' },
  { name: 'Resend', purpose: 'Emails new enquiries to our sales team', location: 'United States' },
  { name: 'Cloudflare Turnstile', purpose: 'Bot protection on enquiry forms', location: 'Global (Cloudflare network)' },
  { name: 'Vercel / AWS', purpose: 'Hosts the website and API', location: 'Global edge network / Mumbai, India' },
  { name: 'Google Fonts', purpose: 'Delivers the website typefaces', location: 'Global (Google network)' },
  { name: 'Cloudinary', purpose: 'Stores product images uploaded by our admin team (no visitor data)', location: 'United States / EU' }
] as const;
