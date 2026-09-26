import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');
const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@attri.test';
const adminPassword = process.env.ADMIN_PASSWORD || 'correct-horse-battery';

async function jsonRequest(url, options = {}) {
  const { headers: extraHeaders = {}, ...rest } = options;
  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders
    }
  });

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: Object.fromEntries(response.headers.entries()),
    data
  };
}

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

async function main() {
  console.log('Testing backend at:', baseUrl);
  console.log('\n--- GET /api/health ---');
  const health = await jsonRequest(`${baseUrl}/api/health`);
  console.log('Status:', health.status);
  console.log(pretty(health.data));

  console.log('\n--- POST /api/auth/login ---');
  const login = await jsonRequest(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  console.log('Status:', login.status);
  console.log(pretty(login.data));

  let token = null;
  if (login.data && login.data.success && login.data.token) {
    token = login.data.token;
  }

  console.log('\n--- GET /api/products ---');
  const products = await jsonRequest(`${baseUrl}/api/products`);
  console.log('Status:', products.status);
  console.log(pretty(products.data));

  if (!token) {
    console.log('\nNo auth token. Skipping upload test.');
    return;
  }

  const imagePath = path.join(repoRoot, 'frontend', 'public', 'images', 'branding', 'logo.jpg');
  if (!fs.existsSync(imagePath)) {
    console.log(`\nImage file not found: ${imagePath}`);
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const fileBase64 = imageBuffer.toString('base64');

  console.log('\n--- POST /api/upload-image ---');
  const upload = await jsonRequest(`${baseUrl}/api/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      fileBase64,
      fileName: 'logo.jpg',
      contentType: 'image/jpeg'
    })
  });

  console.log('Status:', upload.status);
  console.log(pretty(upload.data));
}

main().catch((error) => {
  console.error('API test failed with unexpected error:');
  console.error(error);
  process.exit(1);
});
