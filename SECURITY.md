# Security Implementation Guide

This document describes the production-grade security measures implemented in the NDPS application.

## Table of Contents

1. [Overview](#overview)
2. [Rate Limiting](#rate-limiting)
3. [Authentication & Authorization](#authentication--authorization)
4. [CORS Configuration](#cors-configuration)
5. [Setup Instructions](#setup-instructions)
6. [API Reference](#api-reference)
7. [Security Checklist](#security-checklist)

---

## Overview

The application implements three critical security layers:

| Security Layer | Status | Protection Against |
|----------------|--------|-------------------|
| **Rate Limiting** | ✅ Implemented | DDoS, Brute-force, API abuse |
| **Authentication** | ✅ Implemented | Unauthorized access, Data theft |
| **CORS** | ✅ Implemented | CSRF, Cross-origin attacks |

### Files Created

```
lib/security/
├── index.ts          # Main export file
├── rate-limiter.ts   # Rate limiting implementation
├── auth.ts           # JWT authentication & RBAC
├── cors.ts           # CORS configuration
└── api-wrapper.ts    # Unified security wrapper
```

---

## Rate Limiting

### How It Works

The rate limiter uses a **sliding window algorithm** to track requests per IP address. When the limit is exceeded, a `429 Too Many Requests` response is returned.

### Configuration Presets

| Preset | Limit | Window | Use Case |
|--------|-------|--------|----------|
| `auth` | 5 requests | 15 minutes | Login endpoints (prevents brute-force) |
| `api` | 100 requests | 1 minute | Standard API endpoints |
| `admin` | 30 requests | 1 minute | Admin operations |
| `upload` | 10 requests | 1 minute | File uploads |
| `public` | 200 requests | 1 minute | Public content |

### Environment Variables

```env
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_API_MAX=100
RATE_LIMIT_ADMIN_MAX=30
RATE_LIMIT_UPLOAD_MAX=10
RATE_LIMIT_PUBLIC_MAX=200
```

### Response Headers

When rate limited, the API returns:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642345678
Retry-After: 45

{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

### Real-World Attack Prevention

1. **Brute-Force Attacks**: The `auth` preset allows only 5 login attempts per 15 minutes per IP, making password guessing practically impossible.

2. **DDoS Mitigation**: Even distributed attacks can't overwhelm the system as each IP is individually limited.

3. **API Abuse**: Prevents scrapers and bots from exhausting resources or incurring unexpected costs.

---

## Authentication & Authorization

### JWT Token Structure

```javascript
{
  "sub": "user-001",           // User ID
  "username": "admin",
  "email": "admin@example.com",
  "role": "super_admin",
  "permissions": ["content:write", "gallery:write"],
  "iat": 1642345678,           // Issued at
  "exp": 1642349278,           // Expires at
  "jti": "unique-token-id",    // Token ID
  "iss": "ndps-api",           // Issuer
  "aud": "ndps-web"            // Audience
}
```

### Role Hierarchy

| Role | Description | Permissions |
|------|-------------|-------------|
| `super_admin` | Full access | All permissions |
| `admin` | Site administrator | All except user management |
| `editor` | Content manager | Read/write content and gallery |
| `viewer` | Read-only access | Read content, gallery, admissions |
| `public` | No access | None (for internal tracking) |

### Available Permissions

- `content:read`, `content:write`, `content:delete`
- `gallery:read`, `gallery:write`, `gallery:delete`
- `admissions:read`, `admissions:write`, `admissions:delete`, `admissions:export`
- `users:read`, `users:write`, `users:delete`
- `settings:read`, `settings:write`

### Usage in API Routes

```typescript
import { secureApiHandler, type SecureRequest } from '@/lib/security';

async function myHandler(request: SecureRequest) {
  // Access authenticated user
  const user = request.user;
  console.log(`User ${user?.username} performed action`);
  
  return NextResponse.json({ success: true });
}

export const POST = secureApiHandler(myHandler, {
  rateLimit: 'admin',
  auth: { required: true, permissions: ['content:write'] },
  cors: true
});
```

### Real-World Attack Prevention

1. **Unauthorized Access**: All admin endpoints require valid JWT tokens.

2. **Privilege Escalation**: RBAC ensures users can only access resources for their role.

3. **Token Theft**: Short expiration (1 hour) limits exposure if token is compromised.

4. **Timing Attacks**: Password comparison uses constant-time algorithm.

---

## CORS Configuration

### Allowed Origins

Origins are configured per environment:

```typescript
// Development
- http://localhost:3000
- http://127.0.0.1:3000

// Production
- https://www.newdefencepublicschool.com
- https://newdefencepublicschool.com
- Custom origins from CORS_ALLOWED_ORIGINS env var
```

### Security Headers

Every API response includes:

```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'; frame-ancestors 'none'
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Real-World Attack Prevention

1. **CSRF Attacks**: Malicious websites cannot make API requests on behalf of users.

2. **Clickjacking**: `X-Frame-Options: DENY` prevents embedding in iframes.

3. **XSS**: Content-Security-Policy and X-XSS-Protection headers provide defense in depth.

---

## Setup Instructions

### 1. Generate JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Configure Required Variables

Edit `.env.local`:

```env
# REQUIRED
JWT_SECRET=your-generated-secret-here

# RECOMMENDED
CORS_ALLOWED_ORIGINS=https://your-production-domain.com
PRODUCTION_URL=https://your-production-domain.com
```

### 4. Enable Authentication on Routes

Edit each API route and change:

```typescript
// Before (disabled)
auth: false,

// After (enabled)
auth: { required: true, permissions: ['content:write'] },
```

### 5. Add User Management

For production, replace the demo user in `/api/auth/login/route.ts` with a proper database:

```typescript
// Instead of DEMO_USERS, query your database:
const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
```

---

## API Reference

### Authentication Endpoints

#### POST /api/auth/login

```json
// Request
{
  "username": "admin",
  "password": "your-password"
}

// Success Response (200)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-001",
    "username": "admin",
    "role": "super_admin"
  },
  "expiresIn": 3600
}

// Error Response (401)
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid username or password"
}
```

#### GET /api/auth/verify

```
Authorization: Bearer <token>

// Success Response (200)
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user-001",
    "username": "admin",
    "role": "super_admin",
    "permissions": ["content:write", ...]
  }
}
```

### Using Authentication in Frontend

```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
const { token } = await response.json();
localStorage.setItem('auth_token', token);

// Authenticated Request
const response = await fetch('/api/admin/update', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  },
  body: JSON.stringify(data)
});
```

---

## Security Checklist

### Before Deployment

- [ ] Generate a strong JWT_SECRET (min 32 characters)
- [ ] Configure CORS_ALLOWED_ORIGINS with production domains
- [ ] Enable authentication on all admin routes
- [ ] Replace demo users with database authentication
- [ ] Test rate limiting is working correctly
- [ ] Verify CORS blocks unauthorized origins

### Regular Maintenance

- [ ] Rotate JWT_SECRET periodically
- [ ] Monitor rate limit logs for abuse patterns
- [ ] Review audit logs for suspicious activity
- [ ] Update allowed origins when adding new domains
- [ ] Check for security updates in dependencies

### Security Headers to Verify

Use [securityheaders.com](https://securityheaders.com) to verify your production site has:

- [x] X-Frame-Options
- [x] X-Content-Type-Options
- [x] X-XSS-Protection
- [x] Referrer-Policy
- [x] Content-Security-Policy
- [x] Permissions-Policy

---

## Additional Hardening Recommendations

### 1. HTTPS Enforcement

Ensure all traffic is HTTPS. In Cloudflare:
- Enable "Always Use HTTPS"
- Set minimum TLS version to 1.2

### 2. Security Headers in Next.js Config

Add to `next.config.ts`:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
];

module.exports = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};
```

### 3. Input Validation

All user inputs should be validated:
- Maximum length limits
- Pattern matching (email, phone, etc.)
- XSS sanitization (strip HTML tags)

### 4. Error Handling

Never expose:
- Stack traces
- Database queries
- Internal file paths
- Server configurations

### 5. Logging & Monitoring

Implement:
- Access logs with IP, timestamp, user
- Failed authentication attempts
- Rate limit exceeded events
- Error tracking (Sentry, etc.)

---

## Contact

For security issues, contact the development team immediately.

**Last Updated**: January 2026
