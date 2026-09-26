import http from 'k6/http';
import { check, sleep } from 'k6';

// k6 Load Test Configuration
export const options = {
  // Ramp up traffic in stages
  stages: [
    { duration: '10s', target: 20 },  // Ramp up to 20 virtual users over 10s
    { duration: '30s', target: 50 },  // Ramp up to 50 concurrent users over 30s
    { duration: '15s', target: 100 }, // Stress test spike to 100 users over 15s
    { duration: '10s', target: 0 },   // Cool-down back to 0 users
  ],
  // Performance Quality Gates (Thresholds)
  thresholds: {
    // 95% of requests must complete under 250ms
    http_req_duration: ['p(95)<250'],
    // Less than 1% errors allowed
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';

export default function () {
  // 1. Health Probe
  const healthRes = http.get(`${BASE_URL}/api/health`, {
    tags: { name: 'HealthCheck' }
  });
  
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'dbConnected is true': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.dbConnected === true;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(0.5);

  // 2. Fetch Products
  const productsRes = http.get(`${BASE_URL}/api/products`, {
    tags: { name: 'ProductsList' }
  });

  check(productsRes, {
    'products status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // 3. Fetch Swagger Docs Specification
  const docsRes = http.get(`${BASE_URL}/api/docs.json`, {
    tags: { name: 'DocsJSON' }
  });

  check(docsRes, {
    'docs status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
