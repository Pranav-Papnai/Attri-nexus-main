import { Product } from '@/types';
import { PRODUCTS } from '@/constants/products';
import { getAdminAuthHeader } from './auth';
import { apiUrl } from './config';
import { BUSINESS_CONFIG } from '@/constants/business';

// Inquiry Interface
export interface InquiryRecord {
  id: string;
  name: string;
  /** Optional - phone is the required contact channel on every form. */
  email?: string;
  phone: string;
  company_name?: string;
  product_id?: string;
  quantity?: string;
  message: string;
  source: 'contact' | 'bulk' | 'modal' | 'quick_quote';
  status: 'new' | 'contacted' | 'quoted' | 'closed';
  notes?: string;
  created_at: string;
  /** DPDP Act consent captured by the form checkbox. Server rejects false. */
  consent: boolean;
  consent_version?: string;
}

// Local Storage Keys
const LOCAL_PRODUCTS_KEY = 'attri_nexus_local_products_v17';
const LOCAL_LAST_SUBMIT_KEY = 'attri_nexus_last_submit_ts';

// Minimum time a real visitor must wait between two enquiry submissions from the
// same browser. Slows down basic spam scripts without needing a captcha service.
const MIN_SUBMIT_INTERVAL_MS = 20000;

// Prevent duplicate enquiries from the same person within 5 minutes (catches
// accidental double-submissions and basic spam). Key is email+phone hash.
// Also enforced server-side in api/inquiries/index.js, since this client-side
// check alone is trivially bypassed by anyone calling the API directly.
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const LOCAL_LAST_SUBMIT_BY_KEY = 'attri_nexus_recent_submits';

// Older builds kept a copy of every visitor's enquiry (name, phone, message)
// in their own browser when the API was unreachable. Nothing reads it any
// more, so remove it rather than leave personal data lying around.
try {
  localStorage.removeItem('attri_nexus_local_inquiries');
} catch {}

const SEND_FAILED_MESSAGE =
  `We couldn't send your enquiry right now. Please try again in a minute, or call us on ${BUSINESS_CONFIG.phonePrimary} or message us on WhatsApp.`;

// Lets the visitor retry immediately after a failed send instead of hitting
// the client-side throttle meant for successful submissions.
function forgetSubmitAttempt(phone: string) {
  try {
    localStorage.removeItem(LOCAL_LAST_SUBMIT_KEY);
    const recent = JSON.parse(localStorage.getItem(LOCAL_LAST_SUBMIT_BY_KEY) || '{}');
    delete recent[`dup_${phone}`];
    localStorage.setItem(LOCAL_LAST_SUBMIT_BY_KEY, JSON.stringify(recent));
  } catch {}
}

// -------------------------------------------------------------
// INQUIRIES / LEADS API
// -------------------------------------------------------------

export const saveInquiry = async (
  inquiry: Omit<InquiryRecord, 'id' | 'created_at' | 'status'>,
  honeypot?: string,
  captchaToken?: string | null
): Promise<{ success: boolean; data?: InquiryRecord; error?: string }> => {
  // Honeypot: this field is hidden from real visitors via CSS, so only bots that
  // blindly auto-fill every form field will populate it. Fake a success response
  // (so the bot doesn't learn to adapt) but never actually persist the data.
  if (honeypot && honeypot.trim().length > 0) {
    return { success: true };
  }

  try {
    const lastSubmit = Number(localStorage.getItem(LOCAL_LAST_SUBMIT_KEY) || '0');
    if (Date.now() - lastSubmit < MIN_SUBMIT_INTERVAL_MS) {
      return {
        success: false,
        error: 'Please wait a few seconds before submitting another enquiry.'
      };
    }
    localStorage.setItem(LOCAL_LAST_SUBMIT_KEY, String(Date.now()));

    // Duplicate detection: same email+phone within 5 minutes is likely an
    // accidental resubmit or a spam bot testing the same target. Block it.
    const dupKey = `dup_${inquiry.phone}`;
    const recentSubs = (() => {
      try {
        return JSON.parse(localStorage.getItem(LOCAL_LAST_SUBMIT_BY_KEY) || '{}');
      } catch {
        return {};
      }
    })();
    if (recentSubs[dupKey] && Date.now() - recentSubs[dupKey] < DUPLICATE_WINDOW_MS) {
      return {
        success: false,
        error: 'We already received an enquiry from this email/phone recently. Please check your inbox or contact us directly.'
      };
    }
    recentSubs[dupKey] = Date.now();
    localStorage.setItem(LOCAL_LAST_SUBMIT_BY_KEY, JSON.stringify(recentSubs));
  } catch (e) {}

  const newRecord: InquiryRecord = {
    ...inquiry,
    id: `inq_${crypto.randomUUID()}`,
    status: 'new',
    created_at: new Date().toISOString()
  };

  try {
    const res = await fetch(apiUrl('/api/inquiries'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...inquiry, captcha_token: captchaToken })
    });

    if (res.status === 409) {
      const body = await res.json().catch(() => ({}));
      return {
        success: false,
        error: body.error || 'We already received an enquiry from this email/phone recently.'
      };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      forgetSubmitAttempt(inquiry.phone);
      // 400s and 429s carry a message written for the visitor (invalid phone,
      // captcha, consent, slow down); anything else is our fault, so offer
      // other ways to reach us.
      const visitorFacing = (res.status === 400 || res.status === 429) && body.error;
      return { success: false, error: visitorFacing ? body.error : SEND_FAILED_MESSAGE };
    }

    return { success: true, data: newRecord };
  } catch (err) {
    console.error('Error saving inquiry:', err);
    forgetSubmitAttempt(inquiry.phone);
    return { success: false, error: SEND_FAILED_MESSAGE };
  }
};

export const getInquiries = async (): Promise<InquiryRecord[]> => {
  const res = await fetch(apiUrl('/api/inquiries'), { headers: getAdminAuthHeader() });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success || !Array.isArray(body.data)) {
    throw new Error(body.error || `Could not load enquiries (HTTP ${res.status})`);
  }
  // Zero rows is real data (a fresh account, or every lead deleted).
  return body.data as InquiryRecord[];
};

export const updateInquiryStatus = async (
  id: string,
  status: InquiryRecord['status'],
  notes?: string
): Promise<boolean> => {
  try {
    const res = await fetch(apiUrl(`/api/inquiries/${encodeURIComponent(id)}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ status, notes })
    });
    return res.ok;
  } catch (err) {
    console.warn('Inquiry update failed:', err);
    return false;
  }
};

export const deleteInquiry = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(apiUrl(`/api/inquiries/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    return res.ok;
  } catch (err) {
    console.warn('Inquiry delete failed:', err);
    return false;
  }
};

// -------------------------------------------------------------
// PRODUCTS DATABASE API
// -------------------------------------------------------------

export const getProductsFromDb = async (): Promise<Product[]> => {
  try {
    const res = await fetch(apiUrl('/api/products'));

    // Zero rows from a successful query is a real catalog state (e.g. the
    // admin intentionally deleted every product) — it must be honored
    // instead of silently falling back to stale cached/demo products below.
    if (res.ok) {
      const body = await res.json();
      if (body.success && body.data) {
        return body.data
          .filter((d: any) => !d.id?.includes('idea1') && !d.slug?.includes('idea1'))
          .map((d: any) => {
          const base = PRODUCTS.find((p) => p.id === d.id || p.slug === d.slug);
          return {
            ...(base || {}),
            id: d.id,
            slug: d.slug,
            name: base ? base.name : d.name,
            variety: base ? base.variety : (d.variety || ''),
            brandLine: d.brandLine || (base ? base.brandLine : 'Attri Nexus Global'),
            category: d.category || (base ? base.category : 'Rice'),
            subCategory: d.subCategory || (base ? base.subCategory : undefined),
            processingTypes: d.processingTypes || (base ? base.processingTypes : undefined),
            shortDescription: d.description || (base ? base.shortDescription : ''),
            fullDescription: d.fullDescription || d.description || (base ? base.fullDescription : ''),
            image: d.image || (base ? base.image : ''),
            features: d.features && d.features.length ? d.features : (base ? base.features : []),
            specifications: d.specifications || (base ? base.specifications : {
              origin: 'India',
              grainType: 'Commercial Grade',
              aroma: 'Natural Fresh',
              texture: 'Standard Specification',
              cookingTime: '15-18 mins',
              bestFor: ['Commercial Supply', 'Household Consumption']
            }),
            packSizes: d.packagingSizes && d.packagingSizes.length ? d.packagingSizes : (base ? base.packSizes : ['1kg', '5kg', '10kg', '25kg']),
            cookingInstructions: d.cookingInstructions || (base ? base.cookingInstructions : [
              { step: 1, title: 'Inspect & Prep', desc: 'Standard inspection and preparation according to product class.' }
            ]),
            isFeatured: Boolean(d.isFeatured !== undefined ? d.isFeatured : (base ? base.isFeatured : false)),
            isActive: d.isActive !== undefined ? Boolean(d.isActive) : true,
            enquiryEnabled: true,
            themeColor: base ? base.themeColor : {
              primary: d.themePrimary || '#0D3B2E',
              dark: '#08261E',
              light: '#E6F0EC',
              accent: d.themeAccent || '#C5A059',
              border: '#B8D4C8',
              badgeBg: '#0D3B2E',
              badgeText: '#FFFFFF'
            }
          };
        });
      }
    }
  } catch (err) {
    console.warn('Could not load products from backend:', err);
  }

  // Fallback to local products or initial catalog
  return getLocalProducts();
};

// Images over this size are rejected client-side before upload — Vercel's
// serverless functions cap total request bodies around 4.5MB, and base64
// encoding inflates the file by ~33%, leaving roughly this much headroom.
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Uploads a product photo via our backend, which stores it in Vercel Blob
// Storage and returns its public URL — the browser never talks to Blob
// directly, and never sees the token that makes the upload possible.
export const uploadProductImage = async (
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      success: false,
      error: 'Image too large — please upload a photo under 3MB (JPG/PNG, ideally exported at web resolution).'
    };
  }

  try {
    const fileBase64 = await fileToBase64(file);
    const res = await fetch(apiUrl('/api/upload-image'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify({ fileBase64, fileName: file.name, contentType: file.type })
    });
    const body = await res.json().catch(() => ({}));

    if (!res.ok || !body.success) {
      return { success: false, error: body.error || 'Image upload failed.' };
    }
    return { success: true, url: body.url };
  } catch (err) {
    console.error('Image upload failed:', err);
    return { success: false, error: 'Image upload failed.' };
  }
};

export const upsertProductInDb = async (product: Product): Promise<{ success: boolean; error?: string }> => {
  const dbPayload = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    variety: product.variety,
    brandLine: product.brandLine,
    category: product.category,
    description: product.fullDescription || product.shortDescription || '',
    image: product.image,
    features: product.features,
    specifications: product.specifications,
    packagingSizes: product.packSizes,
    culinaryUses: product.features || [],
    isFeatured: product.isFeatured,
    isActive: product.isActive !== false,
    themePrimary: product.themeColor?.primary || '#0D3B2E',
    themeAccent: product.themeColor?.accent || '#C5A059'
  };

  try {
    const res = await fetch(apiUrl('/api/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAdminAuthHeader() },
      body: JSON.stringify(dbPayload)
    });
    const body = await res.json().catch(() => ({}));

    if (res.ok && body.success) {
      saveLocalProduct(product);
      return { success: true };
    }

    console.error('Product upsert failed:', body.error);
    return { success: false, error: body.error || 'Save failed' };
  } catch (err) {
    console.warn('Could not reach backend:', err);
    return { success: false, error: 'Could not reach the server. Nothing was saved.' };
  }
};

export const deleteProductFromDb = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(id)}`), {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (res.ok) removeLocalProduct(id);
    return res.ok;
  } catch (err) {
    console.warn('Product delete failed:', err);
    return false;
  }
};

// -------------------------------------------------------------
// LOCAL STORAGE HELPERS
// -------------------------------------------------------------

function getLocalProducts(): Product[] {
  try {
    // Clear obsolete legacy keys
    localStorage.removeItem('attri_nexus_local_products_v14');
    localStorage.removeItem('attri_nexus_local_products_v15');
    localStorage.removeItem('attri_nexus_local_products_v16');

    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const parsed: Product[] = JSON.parse(raw);
      // Ensure no obsolete cattle feed items, legacy idea1/idea2 entries, or mismatch exist
      const hasObsolete = parsed.some((p) => p.id === 'attri-nutricattle-feed' || p.id === 'attri-de-oiled-rice-bran');
      const hasOldWheatCat = parsed.some((p) => p.category === 'Wheat and Wheat Flour');
      const flourCount = parsed.filter((p) => p.category === 'Wheat Flour').length;
      const hasOldSharbatiSortex = parsed.some((p) => p.id === 'attri-mp-sharbati-wheat-grain' && p.processingTypes?.includes('Sortex Clean'));
      const hasOldFeedButtons = parsed.some((p) => p.category === 'Animal Feed' && p.processingTypes?.includes('Solvent Extracted Coarse Meal'));
      const hasIdeaArtifacts = parsed.some((p) => p.id.includes('idea1') || p.slug.includes('idea1') || (p.name && p.name.includes('Idea 1')) || (p.name && p.name.includes('Idea 2')));
      if (!hasObsolete && !hasOldWheatCat && !hasOldSharbatiSortex && !hasOldFeedButtons && !hasIdeaArtifacts && flourCount >= 4 && parsed.length === PRODUCTS.length) {
        return parsed;
      }
    }
  } catch (e) {}

  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(PRODUCTS));
  return PRODUCTS;
}

function saveLocalProduct(product: Product) {
  const current = getLocalProducts();
  const existingIdx = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = product;
  } else {
    updated = [...current, product];
  }
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
}

function removeLocalProduct(id: string) {
  const current = getLocalProducts();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
}
