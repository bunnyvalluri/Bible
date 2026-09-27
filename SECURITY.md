# 🛡️ Vachanam Security Policy & Architecture

## Security Overview

Vachanam is engineered with a multi-layered security strategy protecting application data, API endpoints, and AI pipelines while providing friction-free, public access to scripture.

---

## 🔒 Security Implementations

### 1. HTTP Headers & Transport Security
- **Helmet**: Secures Express HTTP response headers (HSTS, DNS prefetch control, frameguard X-Frame-Options against clickjacking, and referrer policy).
- **CORS**: Strict cross-origin resource sharing policy restricting API access to authorized frontend origins.
- **Content Security Policy (CSP)**: Mitigates XSS attacks by restricting script and media evaluation sources.

### 2. Injection Protection & Data Sanitation
- **Parameterized SQL Queries**: All database operations utilize Prisma ORM, preventing SQL injection vulnerabilities.
- **Input Validation & Sanitization**: Incoming request parameters, search queries, and route variables are sanitized and bounded.

### 3. API Rate Limiting & Abuse Prevention
- **IP Rate Limiting**: Global sliding-window rate limiters prevent API scraping and denial-of-service attempts.
- **AI Route Rate Limiting**: Specialized token-bucket throttlers protect AI generation endpoints and third-party quota limits.

### 4. Public Access & Zero-Auth Architecture
- Scripture reading, bookmarks, highlights, and notes are client-owned and stored in **IndexedDB**.
- No sensitive user PII or passwords are stored on servers, eliminating user credential breach vectors.

### 5. Administrative Access Control
- Maintenance and cache invalidation endpoints (`/api/admin/*`) require server-side secret API tokens (`ADMIN_API_KEY`) passed in headers.

### 6. Environment & Secret Management
- All API keys (OpenAI, Gemini, Cloudinary, AWS S3) are loaded via environment variables and never exposed to the client bundle.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please send details to `security@vachanam.org` with steps to reproduce.
