import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './docs/swagger.js';
import querystring from 'node:querystring';
import {
  CORS_ORIGINS,
  JSON_BODY_LIMIT,
  UPLOAD_BODY_LIMIT,
  NODE_ENV,
  IS_PROD,
  TRUST_PROXY_HOPS,
  API_DOCS_ENABLED
} from './config.js';
import { isConfigured, isConnected } from './db/connect.js';
import { isStorageConfigured } from './lib/storage.js';
import { isTurnstileConfigured } from './lib/turnstile.js';
import { isEmailConfigured } from './lib/email.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inquiryRoutes from './routes/inquiries.js';
import uploadRoutes from './routes/upload.js';
import auditRoutes from './routes/audit.js';
import { requireDatabase } from './middleware/requireDatabase.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { sanitizeRequest, parseQuerySafely } from './middleware/sanitize.js';

export function createApp() {
  const app = express();

  // req.ip must be the real client rather than the proxy - the login and
  // enquiry rate limits key off it. See TRUST_PROXY_HOPS in config.js.
  app.set('trust proxy', TRUST_PROXY_HOPS);
  // helmet() below also removes it; disabling here covers responses sent
  // before helmet runs.
  app.disable('x-powered-by');
  // Flat parsing only (a[b]=c stays a literal key, never a nested object),
  // with operator and prototype keys dropped at parse time.
  app.set('query parser', (str) => parseQuerySafely(str, querystring.parse));

  // API responses are JSON and must never be rendered as a page, so they get
  // the strictest possible CSP. Swagger UI (development, or ENABLE_API_DOCS)
  // is the one HTML page served here and gets just enough to render.
  const apiHelmet = helmet({
    contentSecurityPolicy: { useDefaults: false, directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] } },
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  });
  const docsHelmet = helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        frameAncestors: ["'none'"]
      }
    }
  });
  app.use((req, res, next) => (req.path.startsWith('/api/docs') ? docsHelmet : apiHelmet)(req, res, next));

  app.use(
    cors({
      origin(origin, callback) {
        // No Origin header means same-origin, curl, or a server-to-server
        // call - none of which CORS is meant to stop.
        if (!origin || CORS_ORIGINS.includes(origin)) return callback(null, true);
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      },
      credentials: false
    })
  );

  app.use(compression());
  // The upload route's parser must run first: once a body is parsed, later
  // express.json() calls skip it, so the small global limit never sees it.
  app.use('/api/upload-image', express.json({ limit: UPLOAD_BODY_LIMIT }));
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  // Strip NoSQL operator, dotted-path and prototype keys from JSON bodies.
  app.use(sanitizeRequest);

  if (!IS_PROD) {
    app.use((req, res, next) => {
      const startedAt = Date.now();
      res.on('finish', () => {
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
      });
      next();
    });
  }

  // Readiness probe. In production it reports only whether the database is
  // live; the per-feature detail is useful while setting the server up but is
  // not something to hand to the public.
  app.get('/api/health', (req, res) => {
    const body = {
      success: true,
      uptime: Math.round(process.uptime()),
      dbConfigured: isConfigured,
      dbConnected: isConnected()
    };

    if (!IS_PROD) {
      body.env = NODE_ENV;
      body.features = {
        storage: isStorageConfigured(),
        captcha: isTurnstileConfigured(),
        email: isEmailConfigured()
      };
    }

    res.status(200).json(body);
  });

  // requireDatabase fronts every router: all of them read or write the
  // database, if only for authentication, rate-limit counters and audit logs.
  app.use('/api/auth', requireDatabase, authRoutes);
  app.use('/api/products', requireDatabase, productRoutes);
  app.use('/api/inquiries', requireDatabase, inquiryRoutes);
  app.use('/api/upload-image', requireDatabase, uploadRoutes);
  app.use('/api/audit', requireDatabase, auditRoutes);

  if (API_DOCS_ENABLED) {
    // OpenAPI JSON Specification
    app.get('/api/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.json(openapiSpec);
    });

    // Swagger UI Interactive API Documentation
    app.use(
      '/api/docs',
      swaggerUi.serve,
      swaggerUi.setup(openapiSpec, {
        customSiteTitle: 'Attri Nexus REST API Docs & Swagger UI',
        customCss: `
          .topbar { background-color: #0D3B2E !important; border-bottom: 2px solid #C5A059; }
          .swagger-ui .btn.authorize { background-color: #0D3B2E; color: #FFFFFF; border-color: #C5A059; }
          .swagger-ui .btn.authorize svg { fill: #C5A059; }
        `
      })
    );
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
