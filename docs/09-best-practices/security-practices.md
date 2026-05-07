# Security Best Practices

## Overview

Security is paramount when working with AI-assisted development. This guide provides comprehensive best practices for maintaining security while leveraging Claude for code generation, code review, and system design.

## Core Principles

### 1. Zero Trust with AI

Never assume AI-generated code is secure by default. Every output requires security review.

**Key Tenets:**
- Verify all generated code before deployment
- Assume vulnerabilities until proven otherwise
- Apply defense in depth
- Follow principle of least privilege
- Maintain human oversight

### 2. Data Minimization

Share only what's necessary. Protect sensitive information at all costs.

**Guidelines:**
- Redact credentials, tokens, keys
- Mask PII (Personally Identifiable Information)
- Use synthetic data for examples
- Avoid sharing production secrets
- Sanitize logs and error messages

### 3. Security by Design

Incorporate security from the start, not as an afterthought.

**Approach:**
- Specify security requirements upfront
- Request threat modeling
- Demand secure defaults
- Require input validation
- Implement proper error handling

## Do's and Don'ts

### Credential Management

#### Do's

- **Use environment variables:**
  ```
  "Configure the app to read DB credentials from environment variables:
  - DATABASE_URL
  - DATABASE_PASSWORD
  - DATABASE_SSL_CERT_PATH"
  ```

- **Request secure storage patterns:**
  ```
  "Implement credential storage using:
  - AWS Secrets Manager for production
  - Encrypted config files for local dev
  - Vault integration for secrets rotation"
  ```

- **Demand secret scanning:**
  ```
  "Add pre-commit hooks to scan for:
  - API keys
  - Private keys
  - Passwords
  - Tokens
  Use tools like gitleaks or trufflehog"
  ```

#### Don'ts

- **Never paste actual credentials:**
  ```
  DON'T: "My API key is sk_live_51H..."
  DO: "Configure API_KEY from environment"
  ```

- **Don't commit secrets:**
  ```
  DON'T: "Add this to config.json: { apiKey: 'abc123' }"
  DO: "Load apiKey from env vars, add config.json to .gitignore"
  ```

- **Don't log sensitive data:**
  ```
  DON'T: "Log user password for debugging"
  DO: "Log authentication attempt (success/failure) without credentials"
  ```

### Authentication & Authorization

#### Do's

- **Specify security requirements:**
  ```
  "Implement authentication with:
  - Bcrypt password hashing (cost factor 12)
  - JWT with RS256 signing
  - Refresh token rotation
  - Account lockout after 5 failed attempts
  - Rate limiting: 5 req/min per IP"
  ```

- **Request security headers:**
  ```
  "Add security headers:
  - Content-Security-Policy
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security
  - Permissions-Policy"
  ```

- **Demand RBAC implementation:**
  ```
  "Implement role-based access control:
  - Roles: admin, editor, viewer
  - Permission model: resource-action pairs
  - Middleware for route protection
  - Audit logging for privilege escalation attempts"
  ```

#### Don'ts

- **Don't use weak authentication:**
  ```
  DON'T: "Simple password check with MD5"
  DO: "Bcrypt with salt, minimum 12 rounds"
  ```

- **Don't skip authorization checks:**
  ```
  DON'T: "Trust client-side permissions"
  DO: "Verify permissions on every API request"
  ```

- **Don't expose internal IDs:**
  ```
  DON'T: "Use sequential user IDs in URLs"
  DO: "Use UUIDs or implement authorization checks"
  ```

### Input Validation

#### Do's

- **Request comprehensive validation:**
  ```
  "Validate all inputs with:
  - Type checking (Zod schema)
  - Length limits (email: 320 chars max)
  - Format validation (regex for email)
  - Whitelist allowed characters
  - Sanitize HTML content (DOMPurify)"
  ```

- **Specify XSS prevention:**
  ```
  "Prevent XSS attacks:
  - Escape all user content for display
  - Use Content-Security-Policy
  - Validate and sanitize rich text
  - Implement output encoding
  - Use framework's built-in protections"
  ```

- **Demand SQL injection protection:**
  ```
  "Protect against SQL injection:
  - Use parameterized queries only
  - Never concatenate SQL strings
  - Implement ORM with query builders
  - Validate data types before queries
  - Use prepared statements"
  ```

#### Don'ts

- **Don't trust user input:**
  ```
  DON'T: "Use user input directly in queries"
  DO: "Validate, sanitize, then use with parameters"
  ```

- **Don't use blocklists:**
  ```
  DON'T: "Reject inputs containing <script>"
  DO: "Whitelist allowed patterns, escape everything else"
  ```

- **Don't validate only client-side:**
  ```
  DON'T: "JavaScript form validation only"
  DO: "Validate on both client and server"
  ```

## Real-World Examples

### Example 1: Secure API Endpoint

**Insecure Request:**
```
"Create a REST API endpoint for user data retrieval"
```

**Secure Request:**
```
"Create a secure REST API endpoint for user data:

AUTHENTICATION:
- Require valid JWT in Authorization header
- Verify token signature with RS256
- Check token expiration
- Validate token issuer

AUTHORIZATION:
- Users can only access their own data
- Admins can access any user data
- Implement role-based middleware

INPUT VALIDATION:
- userId: UUID format required
- Reject invalid formats with 400
- Rate limit: 100 req/hour per user

SECURITY HEADERS:
- Content-Type: application/json
- X-Content-Type-Options: nosniff
- Cache-Control: private, no-store

ERROR HANDLING:
- Generic messages (no stack traces)
- Log detailed errors server-side
- Return 401 for auth failures
- Return 403 for authorization failures

DATA PROTECTION:
- Redact sensitive fields (SSN, password)
- Hash PII in logs
- Implement field-level encryption for sensitive data

ENDPOINT SPEC:
GET /api/v1/users/:userId
Headers: Authorization: Bearer {token}
Response: User object (sanitized)
```

### Example 2: Secure Database Migration

**Insecure Request:**
```
"Add a column for credit card numbers"
```

**Secure Request:**
```
"Add secure storage for payment methods:

ENCRYPTION:
- Use application-level encryption (AES-256-GCM)
- Store encrypted values in BYTEA column
- Key management via AWS KMS
- Implement key rotation strategy

SCHEMA:
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  encrypted_card_data BYTEA NOT NULL,
  last_four CHAR(4) NOT NULL,
  card_type VARCHAR(20),
  key_version INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

SECURITY MEASURES:
- Never log decrypted values
- Implement audit trail
- Restrict column permissions
- Use views to control access
- Enable row-level security

COMPLIANCE:
- PCI DSS requirements
- Tokenization for display
- Secure deletion procedures

ACCESS CONTROL:
- Payment service only
- Admin readonly access (encrypted)
- Audit all access attempts"
```

### Example 3: Secure File Upload

**Insecure Request:**
```
"Allow users to upload images"
```

**Secure Request:**
```
"Implement secure image upload:

VALIDATION:
- File type: JPEG, PNG, WebP only
- Magic number verification (not just extension)
- Max size: 5MB
- Max dimensions: 4096x4096
- Reject executable content

SANITIZATION:
- Strip EXIF data (ImageMagick)
- Re-encode images (prevent polyglot attacks)
- Generate new filename (UUIDs)
- Scan for malware (ClamAV)

STORAGE:
- S3 bucket with:
  - Private ACL (not public)
  - Versioning enabled
  - Server-side encryption
  - Lifecycle policies
- Serve via CloudFront with signed URLs

ACCESS CONTROL:
- Presigned URLs (15 min expiration)
- CORS: whitelist our domains only
- Rate limit: 10 uploads/hour per user
- Require authentication

UPLOAD FLOW:
1. Client requests upload URL
2. Server validates user + quota
3. Generate presigned S3 URL
4. Client uploads directly to S3
5. S3 triggers Lambda for processing
6. Lambda validates + scans
7. Update DB with status

ERROR HANDLING:
- Don't expose S3 bucket names
- Generic upload failure messages
- Log details server-side

MONITORING:
- Alert on unusual upload patterns
- Track quota per user
- Monitor file type distribution"
```

## Advanced Techniques

### 1. Threat Modeling with Claude

Request structured threat analysis:

```
"Perform threat modeling for user authentication:

Use STRIDE framework:

SPOOFING:
- Attack: Attacker impersonates legitimate user
- Mitigation: ?

TAMPERING:
- Attack: Modify authentication tokens
- Mitigation: ?

REPUDIATION:
- Attack: User denies actions
- Mitigation: ?

INFORMATION DISCLOSURE:
- Attack: Leak user credentials
- Mitigation: ?

DENIAL OF SERVICE:
- Attack: Brute force login attempts
- Mitigation: ?

ELEVATION OF PRIVILEGE:
- Attack: Gain admin access
- Mitigation: ?

For each, identify:
1. Attack vectors
2. Risk level (Critical/High/Medium/Low)
3. Mitigations
4. Detection mechanisms"
```

### 2. Security Code Review

Request focused security analysis:

```
"Security review of /src/auth/oauth.ts:

FOCUS AREAS:

1. AUTHENTICATION BYPASS:
- Can authentication be circumvented?
- Are there timing vulnerabilities?
- Is state parameter validated?

2. TOKEN SECURITY:
- Proper JWT validation?
- Token expiration enforced?
- Refresh token rotation?
- Secure storage?

3. SESSION MANAGEMENT:
- Session fixation prevention?
- Proper logout implementation?
- Session timeout configured?

4. INJECTION VULNERABILITIES:
- SQL injection possible?
- Command injection vectors?
- LDAP injection risks?

5. CRYPTOGRAPHY:
- Using secure algorithms?
- Proper random number generation?
- No hardcoded secrets?

6. ERROR HANDLING:
- Information leakage in errors?
- Stack traces exposed?
- Verbose error messages?

Provide:
- Vulnerability list (severity rated)
- Exploit scenarios
- Remediation steps
- Code examples for fixes"
```

### 3. Secure Configuration Generation

Request hardened configurations:

```
"Generate production-ready nginx config:

SECURITY REQUIREMENTS:

SSL/TLS:
- TLS 1.2+ only
- Strong cipher suites (no weak ciphers)
- HSTS header (max-age=31536000)
- OCSP stapling
- Perfect forward secrecy

HEADERS:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictive
- CSP: strict policy

RATE LIMITING:
- 100 req/min per IP
- 1000 req/hour per IP
- Burst allowance: 20

ACCESS CONTROL:
- Block known bad bots
- Geo-blocking if needed
- IP whitelist for admin routes

FILE UPLOAD:
- Max body size: 10MB
- Timeout: 30s
- Temp file cleanup

LOGGING:
- Access logs with user agents
- Error logs
- Security event logs
- Log rotation

DDoS PROTECTION:
- Connection limits
- Request rate limits
- Slow loris protection"
```

### 4. Secure API Design

Request security-first API design:

```
"Design secure REST API for financial transactions:

SECURITY LAYERS:

L1 - NETWORK:
- TLS 1.3 required
- Certificate pinning
- IP whitelist for webhooks

L2 - AUTHENTICATION:
- OAuth2 + OpenID Connect
- Multi-factor authentication
- Client credentials flow
- Token expiration: 15 min

L3 - AUTHORIZATION:
- Scope-based permissions
- Transaction limits per role
- Approval workflows for high-value
- Time-based restrictions

L4 - INPUT VALIDATION:
- Schema validation (JSON Schema)
- Amount limits (min/max)
- Currency validation
- Account ownership verification

L5 - DATA PROTECTION:
- Field-level encryption
- PII masking in responses
- Audit logging
- Data retention policies

L6 - FRAUD PREVENTION:
- Velocity checks
- Geographic anomaly detection
- Device fingerprinting
- Risk scoring

L7 - MONITORING:
- Failed auth attempts
- Unusual transaction patterns
- API abuse detection
- Real-time alerts

ENDPOINTS:
POST /api/v1/transactions
- Idempotency keys required
- Duplicate detection
- Webhook signatures
- Replay attack prevention"
```

### 5. Dependency Security

Request secure dependency management:

```
"Set up secure dependency management for Node.js project:

SECURITY MEASURES:

INSTALLATION:
- Use package-lock.json
- Verify package integrity (npm audit)
- Use npm ci in production
- Configure npm registry authentication

VULNERABILITY SCANNING:
- npm audit in CI/CD
- Snyk integration
- GitHub Dependabot alerts
- WhiteSource Bolt

UPDATE POLICY:
- Security patches: immediate
- Minor versions: monthly
- Major versions: quarterly with testing
- Automated PR for security fixes

RESTRICTIONS:
- Whitelist allowed licenses
- Ban packages with high CVE count
- Require maintainer verification
- Block deprecated packages

MONITORING:
- Track dependency tree changes
- Alert on new vulnerabilities
- Monitor package health scores
- Watch for typosquatting

TOOLING:
- socket.dev for supply chain security
- npm-check-updates for monitoring
- license-checker for compliance
- package-lock-verify in pre-commit

RISK MITIGATION:
- Pin exact versions in production
- Use private npm registry
- Implement SRI for CDN dependencies
- Regular security audits"
```

## Common Pitfalls

### 1. Hardcoded Secrets

**Problem:**
```
DON'T:
const API_KEY = 'sk_live_51H2x...'; // Hardcoded secret
const DB_PASSWORD = 'mypassword123';
```

**Solution:**
```
DO:
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Validate env vars on startup
if (!API_KEY || !DB_PASSWORD) {
  throw new Error('Missing required environment variables');
}
```

**Prevention:**
```
"Configure environment-based secrets management:
- Use dotenv for local development
- AWS Secrets Manager for production
- Never commit .env files
- Add secret scanning to pre-commit hooks"
```

### 2. Insufficient Input Validation

**Problem:**
```
DON'T:
app.post('/api/users', (req, res) => {
  const { email, age } = req.body;
  // Direct DB insert without validation
  db.insert({ email, age });
});
```

**Solution:**
```
DO:
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email().max(320),
  age: z.number().int().min(13).max(120)
});

app.post('/api/users', (req, res) => {
  try {
    const validated = UserSchema.parse(req.body);
    db.insert(validated);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

**Prevention:**
```
"Implement input validation with Zod:
- Define schemas for all endpoints
- Validate before processing
- Return 400 for invalid input
- Log validation failures
- Use strict type checking"
```

### 3. Inadequate Error Handling

**Problem:**
```
DON'T:
try {
  await processPayment();
} catch (error) {
  res.status(500).json({ error: error.stack }); // Leaks internal details
}
```

**Solution:**
```
DO:
try {
  await processPayment();
} catch (error) {
  logger.error('Payment processing failed', {
    error: error.message,
    stack: error.stack,
    userId: req.user.id
  });
  res.status(500).json({ 
    error: 'Payment processing failed. Please try again.' 
  });
}
```

**Prevention:**
```
"Implement secure error handling:
- Generic messages to users
- Detailed logs server-side only
- No stack traces in production
- Sanitize error messages
- Use error codes for debugging"
```

### 4. Missing Authentication

**Problem:**
```
DON'T:
app.get('/api/admin/users', (req, res) => {
  // No authentication check
  const users = db.getAllUsers();
  res.json(users);
});
```

**Solution:**
```
DO:
app.get('/api/admin/users', 
  authenticateToken,
  requireRole('admin'),
  async (req, res) => {
    const users = await db.getAllUsers();
    res.json(users);
  }
);
```

**Prevention:**
```
"Implement authentication middleware:
- Verify JWT on all protected routes
- Check user roles/permissions
- Log authentication failures
- Rate limit auth attempts
- Use middleware consistently"
```

### 5. Weak Password Policies

**Problem:**
```
DON'T:
const hashedPassword = md5(password); // Weak hashing
// No password requirements
```

**Solution:**
```
DO:
import bcrypt from 'bcrypt';

// Validate password strength
const passwordSchema = z.string()
  .min(12)
  .regex(/[A-Z]/, 'Must contain uppercase')
  .regex(/[a-z]/, 'Must contain lowercase')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[^A-Za-z0-9]/, 'Must contain special char');

const hashedPassword = await bcrypt.hash(password, 12);
```

**Prevention:**
```
"Implement strong password security:
- Minimum 12 characters
- Complexity requirements
- Bcrypt with cost factor 12+
- Check against breached passwords (haveibeenpwned API)
- Implement password history
- Force periodic resets for sensitive accounts"
```

## Checklists

### Pre-Development Security Checklist

Before starting development:

- [ ] Define security requirements
- [ ] Identify sensitive data
- [ ] Plan authentication strategy
- [ ] Design authorization model
- [ ] Review compliance requirements
- [ ] Plan encryption approach
- [ ] Define logging strategy
- [ ] Establish security testing plan
- [ ] Identify third-party dependencies
- [ ] Plan incident response

### Code Generation Security Checklist

When requesting code generation:

- [ ] Specify authentication requirements
- [ ] Define authorization rules
- [ ] Request input validation
- [ ] Demand output encoding
- [ ] Require parameterized queries
- [ ] Specify error handling
- [ ] Request security headers
- [ ] Define rate limiting
- [ ] Require audit logging
- [ ] Specify encryption needs

### Code Review Security Checklist

When reviewing generated code:

- [ ] Verify authentication implementation
- [ ] Check authorization logic
- [ ] Review input validation
- [ ] Examine SQL queries (injection)
- [ ] Check for XSS vulnerabilities
- [ ] Verify CSRF protection
- [ ] Review error messages
- [ ] Check password handling
- [ ] Verify session management
- [ ] Review logging (no secrets)
- [ ] Check encryption usage
- [ ] Verify secure defaults
- [ ] Review third-party libraries
- [ ] Check for hardcoded secrets
- [ ] Verify secure communication

### Deployment Security Checklist

Before deploying AI-generated code:

- [ ] Run security scanners (SAST)
- [ ] Perform dependency audit
- [ ] Review environment variables
- [ ] Test authentication flows
- [ ] Verify authorization rules
- [ ] Test rate limiting
- [ ] Review security headers
- [ ] Check SSL/TLS configuration
- [ ] Test error handling
- [ ] Verify logging configuration
- [ ] Review access controls
- [ ] Test backup/recovery
- [ ] Document security decisions
- [ ] Plan monitoring/alerting
- [ ] Prepare incident response

## Metrics for Success

### Security Metrics

Track these indicators:

1. **Vulnerability Detection Rate**
   - Target: >95% of vulnerabilities caught pre-production
   - Measure: Vulnerabilities found in review / total vulnerabilities
   - Tools: SAST, DAST, manual review

2. **Secret Exposure Incidents**
   - Target: Zero secrets in code/logs/repos
   - Measure: Monthly secret scanning results
   - Tools: git-secrets, trufflehog, gitleaks

3. **Authentication Failure Rate**
   - Target: <1% failed auth attempts (excluding brute force)
   - Measure: Failed auths / total auth attempts
   - Indicates: Implementation quality

4. **Authorization Bypass Attempts**
   - Target: Zero successful bypass attempts
   - Measure: Unauthorized access attempts detected
   - Tools: WAF logs, application logs

5. **Security Test Coverage**
   - Target: >80% of critical paths tested
   - Measure: Security tests / total critical paths
   - Focus: Authentication, authorization, data access

### Security Quality Indicators

| Metric | Poor | Good | Excellent |
|--------|------|------|-----------|
| Auth implementation | Weak passwords | Strong hashing | MFA + passwordless |
| Input validation | Client-side only | Server validation | Schema + sanitization |
| Error handling | Stack traces | Generic messages | Secure logging |
| Secrets management | Hardcoded | Env vars | Secrets manager |
| Dependency security | No scanning | Monthly audit | Automated CI checks |

## Security-First Development Workflow

### Phase 1: Requirements

```
"Security requirements for [FEATURE]:

AUTHENTICATION:
- Who can access?
- How do they authenticate?
- Session management approach?

AUTHORIZATION:
- Role-based or attribute-based?
- Permission granularity?
- Access control matrix?

DATA PROTECTION:
- Sensitive data identified?
- Encryption requirements?
- Data retention policy?

COMPLIANCE:
- GDPR, HIPAA, PCI DSS?
- Data residency requirements?
- Audit logging needs?

THREAT MODEL:
- Primary threats?
- Attack vectors?
- Risk assessment?"
```

### Phase 2: Design

```
"Security design for [FEATURE]:

ARCHITECTURE:
- Defense in depth layers
- Trust boundaries
- Security components

AUTHENTICATION FLOW:
- Login process
- Token management
- Session handling
- Logout process

AUTHORIZATION MODEL:
- Permission structure
- Role hierarchy
- Access decision logic

DATA FLOW:
- Sensitive data identification
- Encryption points
- Secure transmission
- Secure storage

ERROR HANDLING:
- Error categories
- User messages
- Logging strategy
- Alerting rules"
```

### Phase 3: Implementation

```
"Implement [FEATURE] with security controls:

SECURITY REQUIREMENTS:
[From Phase 1]

SECURITY DESIGN:
[From Phase 2]

IMPLEMENTATION NOTES:
- Use secure libraries (specify versions)
- Follow OWASP guidelines
- Implement defense in depth
- Add comprehensive logging
- Include security tests

CODE REVIEW FOCUS:
- Authentication correctness
- Authorization enforcement
- Input validation
- Output encoding
- Secure defaults"
```

### Phase 4: Testing

```
"Security testing for [FEATURE]:

UNIT TESTS:
- Authentication logic
- Authorization rules
- Input validation
- Encryption/decryption
- Error handling

INTEGRATION TESTS:
- End-to-end auth flows
- Permission enforcement
- Data protection
- Security headers

SECURITY TESTS:
- Injection attempts (SQL, XSS, etc.)
- Authentication bypass attempts
- Authorization bypass attempts
- Session hijacking scenarios
- CSRF attacks
- Rate limit enforcement

TOOLS:
- OWASP ZAP for dynamic testing
- Semgrep for static analysis
- Burp Suite for manual testing
- npm audit for dependencies"
```

## Conclusion

Security must be integral to AI-assisted development, not an afterthought. Always specify security requirements upfront, review all generated code with a security lens, and never trust outputs blindly. Claude is a powerful tool, but security remains a human responsibility.

Remember: The most secure code is code that never exposes sensitive data, validates all inputs, authenticates all users, authorizes all actions, and fails securely.
