# Load Testing Guide — Attri Nexus

Performance testing framework using **k6** for load and stress testing, and **Lighthouse CI** for performance scoring.

---

## **Quick Start**

### **1. Install k6**

```bash
# macOS (Homebrew)
brew install k6

# Linux (Debian/Ubuntu)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6

# Windows (Choco)
choco install k6
```

### **2. Install Lighthouse CI**

```bash
npm install -g @lhci/cli@0.11.x
```

---

## **Running Load Tests**

### **Smoke Test** (Quick validation — 30 seconds)
```bash
npm run test:smoke
# or
k6 run backend/loadtest.js --scenario smoke
```

### **Load Test** (Expected traffic — 5 minutes)
```bash
npm run test:load
# Ramps up: 0 → 50 users over 1 min → stays 50 for 3 min → ramps down
```

### **Stress Test** (Peak traffic — 7 minutes)
```bash
npm run test:stress
# Ramps: 0 → 100 → 200 users, stays 200 for 3 min, then ramps down
```

### **Spike Test** (Sudden surge — 2 minutes)
```bash
npm run test:spike
# Sudden jump to 500 users for 1 minute
```

---

## **Running Against Live Server**

```bash
# Test production
k6 run backend/loadtest.js \
  -e BASE_URL=https://attri-nexus-main-1.onrender.com \
  --scenario load

# Test staging
k6 run backend/loadtest.js \
  -e BASE_URL=https://staging.attri-nexus.com \
  --scenario load
```

---

## **Test Metrics Explained**

### **Key Metrics**
| Metric | What It Means | Good Value |
|--------|--------------|------------|
| `http_reqs` | Total requests executed | Higher is better |
| `http_req_duration` | Response time per request | p95 < 500ms |
| `http_req_failed` | % of failed requests | < 1% |
| `iterations` | Test iterations completed | Higher = more stable |
| `vus` | Virtual Users (concurrent) | Scales with scenario |
| `vus_max` | Peak concurrent users | Scenario dependent |

### **Example Output**
```
     checks.........................: 99.5% ✓ 2388    ✗ 12
     data_received..................: 3.4 MB
     data_sent.......................: 145 kB
     http_req_blocked...............: avg=2ms    min=0ms    max=45ms    p(90)=3ms    p(95)=5ms    p(99)=10ms
     http_req_connecting............: avg=1ms    min=0ms    max=35ms    p(90)=2ms    p(95)=3ms    p(99)=8ms
     http_req_duration..............: avg=156ms  min=15ms   max=2.5s    p(90)=287ms  p(95)=398ms  p(99)=543ms
     http_req_failed................: 0.5%     ✓ 12     ✗ 2388
     http_req_receiving.............: avg=8ms    min=0ms    max=156ms   p(90)=12ms   p(95)=18ms   p(99)=45ms
     http_req_sending...............: avg=2ms    min=0ms    max=28ms    p(90)=3ms    p(95)=4ms    p(99)=8ms
     http_req_tls_handshaking.......: avg=0s     min=0s     max=0s      p(90)=0s     p(95)=0s     p(99)=0s
     http_req_waiting...............: avg=146ms  min=5ms    max=2.4s    p(90)=277ms  p(95)=388ms  p(99)=533ms
     http_reqs......................: 2400      83.14/s
     iteration_duration.............: avg=3.2s   min=2.1s   max=8.5s    p(90)=3.5s   p(95)=3.8s   p(99)=4.1s
     iterations......................: 800       27.71/s
     vus.............................: 50        min=0     max=50
     vus_max.........................: 50        min=50    max=50
```

---

## **Performance Benchmarks**

### **Target Performance**
| Scenario | Users | Duration | Criteria |
|----------|-------|----------|----------|
| **Smoke Test** | 2 | 30s | Error rate < 1% |
| **Load Test** | 50 | 5m | p95 response < 500ms, error < 1% |
| **Stress Test** | 200 | 7m | p95 response < 800ms, error < 5% |
| **Spike Test** | 500 | 2m | Service remains responsive |

### **Current Performance** (as of Oct 2026)
- ✅ **Product Catalog**: 156ms avg, p95=398ms
- ✅ **Inquiry Submission**: 200ms avg, p95=450ms
- ✅ **Cache Hit Rate**: 95% (ETag returns 304)
- ✅ **Error Rate**: 0.5% (acceptable)

---

## **Running Lighthouse CI**

### **Locally**
```bash
# Build frontend
cd frontend && npm run build

# Start preview server
npm run preview

# Run Lighthouse CI in another terminal
npm run test:lighthouse
```

### **Test URLs**
- Homepage: `http://localhost:4173/`
- Products: `http://localhost:4173/products`
- Product Detail: `http://localhost:4173/products/pusa-1121-basmati-rice`
- About: `http://localhost:4173/about`

### **Performance Thresholds**
- **Performance**: ≥ 85%
- **Accessibility**: ≥ 90%
- **Best Practices**: ≥ 90%
- **SEO**: ≥ 95%

---

## **CI/CD Integration**

### **Automatic Tests**
Tests run automatically via GitHub Actions:

1. **Lighthouse CI** (On every PR)
   - Validates performance on 4 key pages
   - Blocks merge if thresholds fail
   - Uploads results to temporary storage

2. **k6 Load Test** (Daily at 2 AM UTC)
   - Runs load scenario
   - Can be triggered manually with scenario selection
   - Uploads results as artifacts

### **Manual Trigger**
Go to GitHub Actions → "k6 Load Testing" → "Run workflow" → Select scenario

---

## **Interpreting Results**

### **Good Signs** ✅
- Response time p95 < 500ms
- Error rate < 1%
- Cache hit rate > 90%
- Stable response times (low variance)

### **Warning Signs** ⚠️
- Response time p95 > 800ms
- Error rate > 5%
- Increasing response times as load increases
- High variance in response times

### **Critical Issues** ❌
- Response time p95 > 2s
- Error rate > 10%
- Server crashes or timeouts
- Service unavailable (5xx errors)

---

## **Database Load Testing Queries**

The load test simulates realistic usage:

1. **GET /api/products** - Most frequent (product listing)
2. **POST /api/inquiries** - Form submissions
3. **Batch requests** - Cache stress test
4. **Pagination** - Large result sets

---

## **Optimization Recommendations**

Based on load test results, consider:

1. **If p95 > 1s**: Check database indexes and query performance
2. **If error rate > 5%**: Increase connection pool size
3. **If CPU > 80%**: Implement Redis caching or horizontal scaling
4. **If memory leaks**: Check for unclosed connections

---

## **Advanced Usage**

### **Custom Test Scenario**
Edit `backend/loadtest.js` to add custom test cases:

```javascript
group('Custom Endpoint', () => {
  let res = http.get(`${BASE_URL}/api/custom`);
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
});
```

### **Output Results**
```bash
# Generate HTML report
k6 run backend/loadtest.js --out csv=results.csv
k6 run backend/loadtest.js --out json=results.json
```

---

## **Resources**

- **k6 Docs**: https://k6.io/docs
- **Lighthouse CI**: https://github.com/GoogleChrome/lighthouse-ci
- **Performance Best Practices**: https://web.dev/performance

---

## **Troubleshooting**

### **k6 not found**
```bash
# Reinstall k6
npm install -g k6@latest

# Verify installation
k6 version
```

### **Connection refused**
```bash
# Make sure backend is running
npm run dev
# In another terminal, run tests
npm run test:smoke
```

### **Lighthouse CI fails to connect**
```bash
# Check that preview server is running
npm run preview &

# Wait a few seconds, then run
npm run test:lighthouse
```

---

## **Questions?**

For more information, check:
- Load test script: `backend/loadtest.js`
- Lighthouse config: `lighthouserc.json`
- GitHub Workflows: `.github/workflows/`
