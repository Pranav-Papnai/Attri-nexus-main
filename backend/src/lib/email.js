import { RESEND_API_KEY, ADMIN_NOTIFICATION_EMAIL, FROM_EMAIL } from '../config.js';

const RESEND_URL = 'https://api.resend.com/emails';

export const isEmailConfigured = () => Boolean(RESEND_API_KEY && ADMIN_NOTIFICATION_EMAIL);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label, value) {
  if (!value) return '';
  return `<tr><td style="padding:6px 12px;font-weight:600;">${escapeHtml(label)}</td>` +
    `<td style="padding:6px 12px;">${escapeHtml(value)}</td></tr>`;
}

// Called fire-and-forget from the enquiry route: a slow or failing mail
// provider must never delay or fail the response to the person submitting the
// form - their lead is already saved by the time this runs.
//
// Failures are logged rather than swallowed. A silently dropped notification
// looks identical to "no enquiries came in", which is the worst possible
// failure mode for a lead-capture form.
export async function notifyNewInquiry(inquiry) {
  if (!isEmailConfigured()) return { sent: false, reason: 'not configured' };

  const subject = `New ${inquiry.source} enquiry - ${inquiry.name}`;
  const html = `
    <h2 style="font-family:sans-serif;">New enquiry from the website</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;">
      ${row('Name', inquiry.name)}
      ${row('Email', inquiry.email)}
      ${row('Phone', inquiry.phone)}
      ${row('Company', inquiry.company_name)}
      ${row('Product', inquiry.product_id)}
      ${row('Quantity', inquiry.quantity)}
      ${row('Source', inquiry.source)}
    </table>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;">${escapeHtml(inquiry.message)}</p>
  `;

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_NOTIFICATION_EMAIL],
        ...(inquiry.email ? { reply_to: inquiry.email } : {}),
        subject,
        html
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Resend rejected the notification (${res.status}):`, detail);
      return { sent: false, reason: `resend ${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error('Could not send enquiry notification:', err);
    return { sent: false, reason: 'request failed' };
  }
}

export async function sendPasswordResetEmail({ email, name, otp }) {
  if (!RESEND_API_KEY) return { sent: false, reason: 'not configured' };

  const subject = `Attri Nexus Security - Password Reset Code: ${otp}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; background-color: #0C1015; color: #FFFFFF; border-radius: 16px; border: 1px solid rgba(197, 160, 89, 0.3);">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #DFD1BA; font-size: 20px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 4px 0;">ATTRI NEXUS</h1>
        <p style="color: #C5A059; font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; margin: 0;">Security Operations</p>
      </div>

      <p style="font-size: 14px; line-height: 1.6; color: #D1D5DB;">
        Hello <strong>${escapeHtml(name || 'Admin')}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; color: #D1D5DB;">
        A request was received to reset your password for the Attri Nexus Executive Admin Portal.
      </p>

      <div style="background-color: #141B24; border: 1px solid rgba(197, 160, 89, 0.4); border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #9CA3AF; margin-bottom: 8px;">Verification Code</span>
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.3em; color: #DFD1BA; font-family: monospace;">${escapeHtml(otp)}</span>
        <span style="display: block; font-size: 11px; color: #C5A059; margin-top: 8px;">Valid for 15 minutes</span>
      </div>

      <p style="font-size: 12px; line-height: 1.5; color: #9CA3AF;">
        If you did not initiate this request, please disregard this email or notify your system administrator immediately.
      </p>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin-top: 24px; padding-top: 16px; text-align: center;">
        <p style="font-size: 10px; color: #6B7280; letter-spacing: 0.1em; text-transform: uppercase; margin: 0;">
          Attri Nexus Commercial Suite · Confidential
        </p>
      </div>
    </div>
  `;

  try {
    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Resend rejected password reset email (${res.status}):`, detail);
      return { sent: false, reason: `resend ${res.status}` };
    }

    return { sent: true };
  } catch (err) {
    console.error('Could not send password reset email:', err);
    return { sent: false, reason: 'request failed' };
  }
}

