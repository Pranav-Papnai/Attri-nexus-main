import test, { before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;
let server;
let base;
let Product;
let Inquiry;
let AdminUser;
let LoginAttempt;
let adminToken;

const ADMIN_EMAIL = 'admin@attri.test';
const ADMIN_PASSWORD = 'correct-horse-battery';

before(async () => {
  mongo = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongo.getUri('attri_verification_test');
  process.env.JWT_SECRET = 'verification-test-jwt-secret';
  process.env.NODE_ENV = 'test';

  const { connectDB } = await import('../src/db/connect.js');
  const { createApp } = await import('../src/app.js');
  ({ Product } = await import('../src/db/models/Product.js'));
  ({ Inquiry } = await import('../src/db/models/Inquiry.js'));
  ({ AdminUser } = await import('../src/db/models/AdminUser.js'));
  ({ LoginAttempt } = await import('../src/db/models/LoginAttempt.js'));

  await connectDB();

  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;

  const bcrypt = (await import('bcryptjs')).default;
  await AdminUser.create({
    email: ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
    name: 'Verification Admin'
  });

  const jwt = (await import('jsonwebtoken')).default;
  adminToken = jwt.sign(
    { id: 'admin_verify', email: ADMIN_EMAIL, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  const { disconnectDB } = await import('../src/db/connect.js');
  await disconnectDB();
  if (mongo) await mongo.stop();
});

const asAdmin = () => ({ Authorization: `Bearer ${adminToken}` });

describe('1. MongoDB Indexes in Production & Models', () => {
  test('Product and Inquiry models must have required production indexes built', async () => {
    // Force index build if not already triggered
    await Promise.all([Product.init(), Inquiry.init()]);

    const productIndexes = await Product.collection.indexes();
    const productKeyNames = productIndexes.map((idx) => Object.keys(idx.key).join('_'));

    assert.ok(
      productKeyNames.includes('createdAt'),
      `Product collection must have createdAt index. Found: ${productKeyNames.join(', ')}`
    );
    assert.ok(
      productKeyNames.includes('slug'),
      `Product collection must have slug index. Found: ${productKeyNames.join(', ')}`
    );
    assert.ok(
      productKeyNames.includes('category_isActive'),
      `Product collection must have category_isActive index. Found: ${productKeyNames.join(', ')}`
    );

    const inquiryIndexes = await Inquiry.collection.indexes();
    const inquiryKeyNames = inquiryIndexes.map((idx) => Object.keys(idx.key).join('_'));

    assert.ok(
      inquiryKeyNames.includes('status_created_at'),
      `Inquiry collection must have status_created_at index. Found: ${inquiryKeyNames.join(', ')}`
    );
    assert.ok(
      inquiryKeyNames.includes('phone') || inquiryKeyNames.includes('phone_created_at'),
      `Inquiry collection must have phone-based index (email is now optional). Found: ${inquiryKeyNames.join(', ')}`
    );
  });
});

describe('2. Compression Verification & Actual Measured Size', () => {
  test('gzip compression is enabled and reduces payload size', async () => {
    // Seed some products so payload is > 1024 bytes (compression threshold)
    for (let i = 1; i <= 5; i++) {
      await Product.create({
        _id: `verify_prod_${i}`,
        slug: `verify-product-${i}`,
        name: `Verification Product Grade A ${i}`,
        variety: `Variety ${i}`,
        brandLine: 'Attri Nexus Global Test',
        description: 'Detailed high-quality export-grade description text repeated to simulate realistic catalog payload size. '.repeat(10),
        image: 'https://cdn.example.com/test.jpg',
        category: 'Basmati',
        features: ['100% Sortex Clean', 'Extra Long Grain', 'Aged 2 Years'],
        specifications: { origin: 'India', moisture: '12% max', purity: '95%' }
      });
    }

    // Use node:http to measure actual wire transfer bytes before client-side decompression
    const http = await import('node:http');

    const getWireBytes = (acceptEncoding) => {
      return new Promise((resolve, reject) => {
        const url = new URL(`${base}/api/products`);
        const req = http.get(
          {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            headers: { 'Accept-Encoding': acceptEncoding }
          },
          (res) => {
            let total = 0;
            res.on('data', (chunk) => {
              total += chunk.length;
            });
            res.on('end', () => {
              resolve({
                bytes: total,
                encoding: res.headers['content-encoding'],
                status: res.statusCode
              });
            });
          }
        );
        req.on('error', reject);
      });
    };

    const raw = await getWireBytes('identity');
    const gzipped = await getWireBytes('gzip');

    assert.equal(gzipped.encoding, 'gzip', 'Response must be encoded with gzip');
    assert.ok(
      gzipped.bytes < raw.bytes,
      `Gzip wire payload (${gzipped.bytes} bytes) must be smaller than raw (${raw.bytes} bytes)`
    );

    const reductionPct = Math.round((1 - gzipped.bytes / raw.bytes) * 100);
    console.log(
      `\n[MEASURED COMPRESSION OVER WIRE]\n  Raw uncompressed bytes: ${raw.bytes} bytes\n  Gzip compressed bytes:   ${gzipped.bytes} bytes\n  Wire transfer reduction: ${reductionPct}%\n`
    );
  });
});

describe('3. ETag & 304 Handling', () => {
  test('ETag is present and returns 304 on strong match', async () => {
    const res1 = await fetch(`${base}/api/products`);
    assert.equal(res1.status, 200);
    const etag = res1.headers.get('etag');
    assert.ok(etag, 'ETag header must be returned');

    const res2 = await fetch(`${base}/api/products`, {
      headers: { 'If-None-Match': etag }
    });
    assert.equal(res2.status, 304, 'Repeat request with same ETag must return 304 Not Modified');
    const body2 = await res2.text();
    assert.equal(body2, '', '304 response body must be empty');
  });

  test('ETag handles weak ETag prefix (W/) correctly', async () => {
    const res1 = await fetch(`${base}/api/products`);
    const etag = res1.headers.get('etag');
    const weakETag = etag.startsWith('W/') ? etag : `W/${etag}`;

    const res2 = await fetch(`${base}/api/products`, {
      headers: { 'If-None-Match': weakETag }
    });
    // This will test if current implementation supports weak ETags
    console.log(`[ETAG WEAK MATCH TEST] Client sent ${weakETag} -> Server returned HTTP ${res2.status}`);
    assert.equal(res2.status, 304, 'Weak ETag comparison must return 304 per RFC 7232');
  });
});

describe('4. Cache Invalidation on Product Edits', () => {
  test('Cache invalidates immediately when a product is created, updated, or deleted', async () => {
    // 1. Initial GET to populate cache
    const res1 = await fetch(`${base}/api/products`);
    const etag1 = res1.headers.get('etag');
    const body1 = await res1.json();
    const count1 = body1.data.length;

    // 2. Create a new product via POST /api/products
    const newProd = {
      id: 'verify_inval_new',
      slug: 'verify-inval-new',
      name: 'Newly Added Product',
      variety: 'New Variety',
      brandLine: 'Attri Nexus Test',
      description: 'Newly added test product for cache invalidation verification.',
      image: 'https://cdn.example.com/new.jpg'
    };

    const createRes = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...asAdmin() },
      body: JSON.stringify(newProd)
    });
    assert.equal(createRes.status, 200);

    // 3. Next GET must return updated list immediately (not cached old list)
    const res2 = await fetch(`${base}/api/products`);
    const etag2 = res2.headers.get('etag');
    const body2 = await res2.json();
    assert.equal(body2.data.length, count1 + 1, 'Catalog must contain newly added product');
    assert.notEqual(etag1, etag2, 'ETag must change after product creation');

    // 4. Update the product
    const updateRes = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...asAdmin() },
      body: JSON.stringify({ id: 'verify_inval_new', name: 'Updated Product Name' })
    });
    assert.equal(updateRes.status, 200);

    const res3 = await fetch(`${base}/api/products`);
    const etag3 = res3.headers.get('etag');
    const body3 = await res3.json();
    const updatedItem = body3.data.find((p) => p.id === 'verify_inval_new');
    assert.equal(updatedItem.name, 'Updated Product Name', 'GET must return updated product immediately');
    assert.notEqual(etag2, etag3, 'ETag must change after product update');

    // 5. Delete the product
    const deleteRes = await fetch(`${base}/api/products/verify_inval_new`, {
      method: 'DELETE',
      headers: asAdmin()
    });
    assert.equal(deleteRes.status, 200);

    const res4 = await fetch(`${base}/api/products`);
    const etag4 = res4.headers.get('etag');
    const body4 = await res4.json();
    assert.equal(body4.data.length, count1, 'Catalog count must reflect deleted product');
    assert.notEqual(etag3, etag4, 'ETag must change after product deletion');
  });
});

describe('5. API Race Conditions & Concurrency on Product Upsert', () => {
  test('Concurrent creations with the same ID do not fail or crash', async () => {
    const concurrentPayload = {
      id: 'verify_concurrent_prod',
      slug: 'verify-concurrent-prod',
      name: 'Concurrent Product Test',
      variety: 'Basmati',
      brandLine: 'Attri Nexus Global',
      description: 'Testing concurrency on product upsert.',
      image: 'https://cdn.example.com/concurrent.jpg'
    };

    // Fire 5 simultaneous requests creating the same product ID
    const promises = Array.from({ length: 5 }, () =>
      fetch(`${base}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...asAdmin() },
        body: JSON.stringify(concurrentPayload)
      })
    );

    const responses = await Promise.all(promises);
    for (const r of responses) {
      assert.equal(r.status, 200, `Concurrent creation must succeed with 200. Got ${r.status}`);
    }

    // Verify only one product exists in database
    const dbDocs = await Product.find({ _id: 'verify_concurrent_prod' });
    assert.equal(dbDocs.length, 1, 'Only one document should exist for ID');
  });
});

describe('6. Authentication & Security Invariance', () => {
  test('Admin endpoints reject unauthenticated or tampered requests', async () => {
    const endpoints = [
      { method: 'POST', path: '/api/products', body: { id: 'x' } },
      { method: 'DELETE', path: '/api/products/test' },
      { method: 'GET', path: '/api/inquiries' },
      { method: 'PATCH', path: '/api/inquiries/some_id', body: { status: 'contacted' } },
      { method: 'DELETE', path: '/api/inquiries/some_id' },
      { method: 'POST', path: '/api/auth/register', body: { email: 'hack@test.com', password: '123' } },
      { method: 'POST', path: '/api/upload-image', body: {} }
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${base}${ep.path}`, {
        method: ep.method,
        headers: { 'Content-Type': 'application/json' },
        body: ep.body ? JSON.stringify(ep.body) : undefined
      });
      assert.equal(
        res.status,
        401,
        `Unauthenticated ${ep.method} ${ep.path} must return 401. Got ${res.status}`
      );
    }
  });

  test('Admin endpoints reject invalid/tampered JWT tokens', async () => {
    const res = await fetch(`${base}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid.fake.token'
      },
      body: JSON.stringify({ id: 'x' })
    });
    assert.equal(res.status, 401, 'Tampered token must return 401');
  });

  test('Server-side logout revokes token immediately and blocks subsequent requests, while re-login succeeds', async () => {
    // 1. Log in to obtain a fresh token
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    assert.equal(loginRes.status, 200);
    const { token: sessionToken } = await loginRes.json();
    assert.ok(sessionToken, 'Login must yield a valid token');

    // 2. Access protected endpoint before logout (should be 200)
    const meRes1 = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    assert.equal(meRes1.status, 200);

    // 3. Call server-side logout
    const logoutRes = await fetch(`${base}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    assert.equal(logoutRes.status, 200);

    // 4. Access protected endpoint again with the same token (must now be 401)
    const meRes2 = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${sessionToken}` }
    });
    assert.equal(meRes2.status, 401, 'Revoked token must be rejected with 401');

    // 5. Logging in again produces a fresh valid token that works cleanly
    const reLoginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    assert.equal(reLoginRes.status, 200);
    const { token: newToken } = await reLoginRes.json();
    assert.notEqual(newToken, sessionToken);

    const meRes3 = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    assert.equal(meRes3.status, 200, 'New token must work normally');
  });
});

describe('7. Serverless / Multi-Instance CDN & Cache-Control Headers', () => {
  test('Cache-Control headers do not trap updates behind s-maxage CDN cache', async () => {
    const res = await fetch(`${base}/api/products`);
    const cacheControl = res.headers.get('cache-control');
    console.log(`[CURRENT CACHE-CONTROL] ${cacheControl}`);

    // Verify if s-maxage > 0 exists
    const hasLongSMaxAge = /s-maxage=[1-9]\d*/.test(cacheControl || '');
    assert.ok(
      !hasLongSMaxAge,
      `Cache-Control should not set s-maxage > 0 on dynamic product catalog because CDN edge cannot be invalidated by origin memory. Current: ${cacheControl}`
    );
  });
});
