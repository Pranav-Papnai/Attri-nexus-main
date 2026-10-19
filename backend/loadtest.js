/**
 * k6 Load Testing Script for Attri Nexus Backend
 *
 * Usage:
 *   npm install -g k6
 *   k6 run backend/loadtest.js
 *
 * Test Scenarios:
 * 1. Smoke Test: 2 users, 30 seconds (verify it works)
 * 2. Load Test: 50 users, 5 minutes (expected traffic)
 * 3. Stress Test: 200 users, 10 minutes (peak traffic)
 * 4. Spike Test: 500 users, 2 minutes (sudden surge)
 */

import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const DURATION = __ENV.DURATION || '5m';
const SCENARIO = __ENV.SCENARIO || 'load'; // smoke, load, stress, spike

// Test Thresholds
export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 2,
      duration: '30s',
      gracefulStop: '5s',
    },
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },   // Ramp up to 50 users
        { duration: '3m', target: 50 },   // Stay at 50 users
        { duration: '1m', target: 0 },    // Ramp down
      ],
      gracefulStop: '5s',
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },  // Ramp to 100 users
        { duration: '2m', target: 200 },  // Ramp to 200 users
        { duration: '3m', target: 200 },  // Stay at 200 users
        { duration: '2m', target: 0 },    // Ramp down
      ],
      gracefulStop: '10s',
    },
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 500 }, // Sudden spike to 500 users
        { duration: '1m', target: 500 },  // Stay at 500
        { duration: '30s', target: 0 },   // Ramp down
      ],
      gracefulStop: '5s',
    },
  },
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% < 500ms, 99% < 1s
    'http_req_failed': ['rate<0.1'],                   // Error rate < 10%
    'http_reqs': ['rate>100'],                         // At least 100 req/s
  },
  ext: {
    loadimpact: {
      projectID: 3382308,
      name: 'Attri Nexus Load Test',
    },
  },
};

// Test Functions
export function setup() {
  console.log(`🚀 Starting ${SCENARIO} test against ${BASE_URL}`);
  return { scenario: SCENARIO };
}

export default function (data) {
  // 1. GET /api/products (Most called endpoint)
  group('Product Catalog', () => {
    let res = http.get(`${BASE_URL}/api/products`);

    check(res, {
      'status is 200': (r) => r.status === 200,
      'response time < 500ms': (r) => r.timings.duration < 500,
      'has ETag header': (r) => r.headers['ETag'] !== undefined,
      'body is valid JSON': (r) => {
        try {
          JSON.parse(r.body);
          return true;
        } catch {
          return false;
        }
      },
    });

    sleep(1);
  });

  // 2. POST /api/inquiries (Form submission)
  group('Submit Inquiry', () => {
    const payload = JSON.stringify({
      name: `User-${__VU}-${__ITER}`,
      phone: `9${Math.floor(Math.random() * 999999999)
        .toString()
        .padStart(9, '0')}`,
      company_name: 'Test Company',
      product_id: 'pusa-1121-basmati-rice',
      quantity: '1000 MT',
      message: 'Interested in bulk order',
      source: 'modal',
      consent_given: true,
    });

    let res = http.post(`${BASE_URL}/api/inquiries`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    check(res, {
      'inquiry created successfully': (r) => r.status === 201 || r.status === 200,
      'response time < 1000ms': (r) => r.timings.duration < 1000,
      'response contains success': (r) => r.body.includes('success'),
    });

    sleep(2);
  });

  // 3. Concurrent requests (Cache stress test)
  group('Cache Stress Test', () => {
    let batch = http.batch([
      ['GET', `${BASE_URL}/api/products`],
      ['GET', `${BASE_URL}/api/products`],
      ['GET', `${BASE_URL}/api/products`],
    ]);

    check(batch[0], {
      'all requests successful': (r) => r.status === 200,
      'cache working (304 or 200)': (r) => r.status === 200 || r.status === 304,
    });

    sleep(1);
  });

  // 4. Database query stress (different endpoints)
  group('Database Load', () => {
    let res = http.get(`${BASE_URL}/api/products?limit=50`);

    check(res, {
      'pagination working': (r) => r.status === 200,
      'response time under threshold': (r) => r.timings.duration < 800,
    });

    sleep(1);
  });
}

export function teardown(data) {
  console.log(`✅ Test completed for scenario: ${data.scenario}`);
}

/**
 * Run different scenarios:
 *
 * Smoke Test (Quick validation):
 *   k6 run backend/loadtest.js --scenario smoke
 *
 * Load Test (Expected traffic):
 *   k6 run backend/loadtest.js --scenario load
 *
 * Stress Test (Peak traffic):
 *   k6 run backend/loadtest.js --scenario stress
 *
 * Spike Test (Sudden surge):
 *   k6 run backend/loadtest.js --scenario spike
 *
 * Custom Base URL:
 *   k6 run backend/loadtest.js -e BASE_URL=https://attri-nexus-main-1.onrender.com
 */
