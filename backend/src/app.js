import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './docs/swagger.js';
import { CORS_ORIGINS, JSON_BODY_LIMIT, NODE_ENV, IS_PROD } from './config.js';
import { isConfigured, isConnected } from './db/connect.js';
import { isStorageConfigured } from './lib/storage.js';
import { isTurnstileConfigured } from './lib/turnstile.js';
import { isEmailConfigured } from './lib/email.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import inquiryRoutes from './routes/inquiries.js';
import uploadRoutes from './routes/upload.js';
import { requireDatabase } from './middleware/requireDatabase.js';
import { notFound, errorHandler } from './middleware/errors.js';
import { sanitizeRequest } from './middleware/sanitize.js';

export function createApp() {
  const app = express();

  // Behind one proxy (Render/Railway/Fly/nginx) so req.ip is the real client
  // rather than the proxy - the login and enquiry rate limits key off it, and
  // would otherwise treat every visitor as the same address.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // contentSecurityPolicy is off because this process serves JSON only; the
  // CSP that matters belongs on whatever serves the frontend HTML.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));

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
  app.use(express.json({ limit: JSON_BODY_LIMIT }));

  // Sanitize incoming body, query, and params against NoSQL injection,
  // property traversal, prototype pollution, and stored script injection
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

  // Paths match exactly what the frontend already calls, so no frontend file
  // changes. requireDatabase fronts the three routers that read or write the
  // database; /api/upload-image only writes to object storage and reports its
  // own configuration problems.
  app.use('/api/auth', requireDatabase, authRoutes);
  app.use('/api/products', requireDatabase, productRoutes);
  app.use('/api/inquiries', requireDatabase, inquiryRoutes);
  app.use('/api/upload-image', uploadRoutes);

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

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
