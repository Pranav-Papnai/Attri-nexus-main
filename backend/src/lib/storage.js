import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
} from '../config.js';

export const isStorageConfigured = () =>
  Boolean(CLOUDINARY_URL || (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET));

export const STORAGE_MISSING_MESSAGE =
  'CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET are not set on the server, so image uploads are unavailable.';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

const EXTENSION_FOR = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif'
};

// The uploaded filename never reaches the storage path. Only its extension is
// consulted, and even that is overridden by the verified content type where
// one is known - so a name like "../../evil.html" cannot traverse anywhere or
// overwrite an existing object.
export function buildImagePath(fileName, contentType) {
  const fromType = EXTENSION_FOR[contentType];
  const fromName = String(fileName || '')
    .split('.')
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  const ext = fromType || fromName || 'jpg';
  const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return `products/${unique}.${ext}`;
}

export async function uploadProductImage({ buffer, fileName, contentType }) {
  const pathname = buildImagePath(fileName, contentType);
  const publicId = pathname.replace(/^products\//, '').replace(/\.[^/.]+$/, '');
  const dataUri = `data:${contentType};base64,${buffer.toString('base64')}`;

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME || undefined,
    api_key: CLOUDINARY_API_KEY || undefined,
    api_secret: CLOUDINARY_API_SECRET || undefined,
    secure: true
  });

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'products',
    public_id: publicId,
    resource_type: 'image'
  });

  return result.secure_url || result.url;
}
