export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Attri Nexus Global Trade API',
    version: '1.0.0',
    description: `
**Attri Nexus Official REST API Documentation**

Agricultural commodity export and trade management backend powered by Express and MongoDB.
Features full JWT Authentication, Token Revocation, Dynamic Product Catalog, Inquiry & Lead Capture with Turnstile Bot Protection, and Cloud Storage.

---
### Authentication
Endpoints marked with **BearerAuth** require an Authorization header:
\`Authorization: Bearer <your_jwt_token>\`

You can obtain a JWT token by calling \`POST /api/auth/login\`, then click the **Authorize 🔓** button at the top of Swagger UI.
    `,
    contact: {
      name: 'Attri Nexus Engineering',
      email: 'admin@attrinexus.com'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Current Environment (/api proxy / base)'
    },
    {
      url: 'http://localhost:3001/api',
      description: 'Local Backend Direct (Port 3001)'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from POST /api/auth/login'
      }
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          uptime: { type: 'number', example: 342 },
          dbConfigured: { type: 'boolean', example: true },
          dbConnected: { type: 'boolean', example: true },
          env: { type: 'string', example: 'development' },
          features: {
            type: 'object',
            properties: {
              storage: { type: 'boolean', example: true },
              captcha: { type: 'boolean', example: true },
              email: { type: 'boolean', example: true }
            }
          }
        }
      },
      Product: {
        type: 'object',
        required: ['id', 'slug', 'name', 'category'],
        properties: {
          id: { type: 'string', example: 'ir64-raw-rice' },
          slug: { type: 'string', example: 'ir64-raw-rice' },
          name: { type: 'string', example: 'IR 64 Non-Basmati Raw Rice' },
          variety: { type: 'string', example: 'IR 64' },
          brandLine: { type: 'string', example: 'Attri Nexus Commercial' },
          category: { type: 'string', example: 'Rice' },
          subCategory: { type: 'string', example: 'Non-Basmati' },
          processingTypes: {
            type: 'array',
            items: { type: 'string' },
            example: ['5% Broken', '15% Broken', '25% Broken']
          },
          description: { type: 'string', example: 'Export grade long grain parboiled/raw white rice.' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1586201375761-83865001e31c' },
          features: {
            type: 'array',
            items: { type: 'string' },
            example: ['100% Sortex Cleaned', 'Max 14% Moisture', 'Purity 95% Min']
          },
          specifications: {
            type: 'object',
            properties: {
              origin: { type: 'string', example: 'India' },
              grainType: { type: 'string', example: 'Long Grain Non-Basmati' },
              brokenRatio: { type: 'string', example: '5% Max' },
              moisture: { type: 'string', example: '14% Max' },
              cropYear: { type: 'string', example: 'Current Year' }
            }
          },
          packagingSizes: {
            type: 'array',
            items: { type: 'string' },
            example: ['25kg PP Bags', '50kg Jute Bags', 'Container Bulk']
          },
          isFeatured: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          themePrimary: { type: 'string', example: '#0D3B2E' },
          themeAccent: { type: 'string', example: '#C5A059' }
        }
      },
      InquiryInput: {
        type: 'object',
        required: ['name', 'phone', 'message', 'source', 'consent'],
        properties: {
          name: { type: 'string', example: 'Ahmed Al-Mansoor' },
          email: { type: 'string', example: 'ahmed@tradecorp.ae', description: 'Optional - phone is the required contact channel' },
          consent: { type: 'boolean', example: true, description: 'Must be true. Records DPDP Act consent to process the enquiry.' },
          consent_version: { type: 'string', example: '2026-09', description: 'Privacy Policy version the person agreed to' },
          phone: { type: 'string', example: '+971501234567' },
          company_name: { type: 'string', example: 'Gulf Trading LLC' },
          product_id: { type: 'string', example: 'ir64-raw-rice' },
          quantity: { type: 'string', example: '500 Metric Tons' },
          message: { type: 'string', example: 'Looking for CIF Dubai port quotation for 500 MT IR 64 5% broken.' },
          source: { type: 'string', enum: ['contact', 'bulk', 'modal', 'quick_quote'], example: 'bulk' },
          captcha_token: { type: 'string', example: '0.sample_turnstile_token' },
          notes: { type: 'string', example: 'Honeypot trap field (must be empty)', description: 'Bot trap: keep empty' }
        }
      },
      InquiryRecord: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '6aa39c44474f31e9ea202996' },
          name: { type: 'string', example: 'Ahmed Al-Mansoor' },
          email: { type: 'string', example: 'ahmed@tradecorp.ae' },
          phone: { type: 'string', example: '+971501234567' },
          company_name: { type: 'string', example: 'Gulf Trading LLC' },
          product_id: { type: 'string', example: 'ir64-raw-rice' },
          quantity: { type: 'string', example: '500 Metric Tons' },
          message: { type: 'string', example: 'Looking for CIF quotation...' },
          source: { type: 'string', example: 'bulk' },
          status: { type: 'string', enum: ['new', 'contacted', 'quoted', 'closed'], example: 'new' },
          notes: { type: 'string', example: 'Assigned to international trade desk' },
          created_at: { type: 'string', example: '2026-09-11T10:00:00.000Z' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@attrinexus.com' },
          password: { type: 'string', example: 'AttriAdmin2026!' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'admin@attrinexus.com' },
              name: { type: 'string', example: 'Master Administrator' },
              role: { type: 'string', example: 'Super Admin' }
            }
          }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'System Health & Readiness Probe',
        description: 'Returns server uptime, database connection state, and active feature flags.',
        responses: {
          '200': {
            description: 'System healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthResponse' } } }
          }
        }
      }
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List active catalog products',
        description: 'Fetches full product catalog with specifications, varieties, and packaging sizes.',
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number', example: 12 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create or update a product',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } }
        },
        responses: {
          '200': { description: 'Product saved successfully' },
          '401': { description: 'Unauthorized - Missing or invalid JWT' }
        }
      }
    },
    '/products/{id}': {
      delete: {
        tags: ['Products'],
        summary: 'Delete a product by ID or Slug',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: 'ir64-raw-rice' }
        ],
        responses: {
          '200': { description: 'Product removed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/inquiries': {
      post: {
        tags: ['Inquiries & Leads'],
        summary: 'Submit a new trade enquiry (Public)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/InquiryInput' } } }
        },
        responses: {
          '200': { description: 'Inquiry received' },
          '400': { description: 'Validation failed or Turnstile CAPTCHA rejected' },
          '409': { description: 'Duplicate submission within 5 minutes' }
        }
      },
      get: {
        tags: ['Inquiries & Leads'],
        summary: 'List all buyer enquiries (Admin Only)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of inquiries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'number', example: 5 },
                    data: { type: 'array', items: { $ref: '#/components/schemas/InquiryRecord' } }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/inquiries/{id}': {
      patch: {
        tags: ['Inquiries & Leads'],
        summary: 'Update enquiry status or admin notes',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6aa39c44474f31e9ea202996' }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', enum: ['new', 'contacted', 'quoted', 'closed'], example: 'quoted' },
                  notes: { type: 'string', example: 'Sent CIF Jebel Ali quotation via email.' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Inquiry updated' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Inquiries & Leads'],
        summary: 'Delete an enquiry record',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '6aa39c44474f31e9ea202996' }
        ],
        responses: {
          '200': { description: 'Inquiry deleted' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/upload-image': {
      post: {
        tags: ['Storage & Media'],
        summary: 'Upload product photo to Cloudinary / Object Storage',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['fileBase64', 'fileName'],
                properties: {
                  fileBase64: { type: 'string', description: 'Base64 encoded image string' },
                  fileName: { type: 'string', example: 'product-photo.jpg' },
                  contentType: { type: 'string', example: 'image/jpeg' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Image uploaded',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    url: { type: 'string', example: 'https://res.cloudinary.com/.../product.jpg' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Admin login (Generates JWT session token)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } }
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } }
          },
          '401': { description: 'Invalid email or password' },
          '429': { description: 'Too many failed login attempts - Rate limited' }
        }
      }
    },
    '/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout (Server-side JWT token revocation)',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Session revoked successfully' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current admin session details',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Active session info' },
          '401': { description: 'Token expired or invalid' }
        }
      }
    },
    '/auth/users': {
      get: {
        tags: ['Authentication'],
        summary: 'List all administrative accounts',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': { description: 'Admin user list' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register new admin account (Admin Only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'manager@attrinexus.com' },
                  password: { type: 'string', example: 'AttriAdmin2026!' },
                  name: { type: 'string', example: 'Trade Desk Manager' },
                  role: { type: 'string', example: 'Commercial Admin' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Account created' },
          '409': { description: 'Email already exists' }
        }
      }
    }
  }
};
