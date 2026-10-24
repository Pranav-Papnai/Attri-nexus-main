/**
 * Single source of truth for the legal pages. Bump PRIVACY_POLICY_VERSION
 * whenever the Privacy Policy text changes - it is stored with every enquiry
 * so we can prove which version a person consented to (DPDP Act 2023 s.6).
 */
export const PRIVACY_POLICY_VERSION = '2026-10.2';
export const LEGAL_LAST_UPDATED = '21 October 2026';

/** Closed enquiries are purged this long after they are marked closed. */
export const INQUIRY_RETENTION_MONTHS = 24;

/**
 * DPDP Act 2023 s.8(10): a Data Fiduciary must publish the contact of the
 * person who answers data-protection questions. TODO (Phase 2): replace the
 * placeholder name with the real officer and use a business-domain mailbox.
 */
export const GRIEVANCE_OFFICER = {
  name: 'Koe Naiwo',
  email: 'attrinexus@gmail.com'
};
