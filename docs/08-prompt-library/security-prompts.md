# Security Prompts

Comprehensive prompts for security analysis, vulnerability assessment, and secure coding.

## Table of Contents
- [Security Auditing](#security-auditing)
- [Vulnerability Detection](#vulnerability-detection)
- [Secure Implementation](#secure-implementation)
- [Compliance](#compliance)

---

## Security Auditing

### 1. Comprehensive Security Audit
```
Perform comprehensive security audit on:

Code/System: [paste code or describe system]
Language/Framework: [details]
Trust Boundaries: [user inputs, external systems]
Sensitive Data: [what needs protection]

Audit for:
1. OWASP Top 10 vulnerabilities
2. Authentication/authorization flaws
3. Input validation issues
4. Data exposure risks
5. Cryptography weaknesses
6. Configuration issues
7. Logging and monitoring gaps
8. Third-party dependency risks
9. Infrastructure security
10. Compliance violations

Provide:
- Vulnerabilities (categorized by severity: Critical/High/Medium/Low)
- Exploitation scenarios
- Remediation steps
- Security best practices
```

**Usage Context**: Complete security assessment of code or system.

**Example Input**:
```python
from flask import Flask, request, render_template
import sqlite3

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    result = cursor.execute(query).fetchone()
    
    if result:
        session['user_id'] = result[0]
        return "Login successful"
    return "Login failed"

@app.route('/user/<user_id>')
def get_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    user = cursor.execute(f"SELECT * FROM users WHERE id={user_id}").fetchone()
    return render_template('user.html', user=user)
```

**Example Output**:
```
SECURITY AUDIT RESULTS

CRITICAL VULNERABILITIES:

1. SQL Injection (OWASP A03:2021 - Injection)
   Location: login() function, line 11
   
   Vulnerability:
   - User input directly concatenated into SQL query
   - No parameterization or escaping
   
   Exploitation:
   ```
   Username: admin' OR '1'='1' --
   Password: anything
   
   Resulting query:
   SELECT * FROM users WHERE username='admin' OR '1'='1' --' AND password='anything'
   
   Result: Bypasses authentication completely
   ```
   
   Remediation:
   ```python
   # Use parameterized queries
   query = "SELECT * FROM users WHERE username=? AND password=?"
   result = cursor.execute(query, (username, password)).fetchone()
   ```

2. Plaintext Password Storage (OWASP A02:2021 - Cryptographic Failures)
   Location: login() function
   
   Vulnerability:
   - Passwords stored and compared in plaintext
   - No hashing or salting
   
   Impact:
   - Database breach exposes all passwords
   - Passwords usable on other sites (credential stuffing)
   
   Remediation:
   ```python
   from werkzeug.security import generate_password_hash, check_password_hash
   
   # When creating user:
   hashed_password = generate_password_hash(password)
   
   # When verifying:
   query = "SELECT * FROM users WHERE username=?"
   user = cursor.execute(query, (username,)).fetchone()
   if user and check_password_hash(user['password'], password):
       # Login successful
   ```

HIGH VULNERABILITIES:

3. SQL Injection (Secondary Instance)
   Location: get_user() function, line 22
   
   Vulnerability:
   - user_id parameter not validated or parameterized
   
   Exploitation:
   ```
   GET /user/1%20OR%201=1
   
   Resulting query:
   SELECT * FROM users WHERE id=1 OR 1=1
   
   Result: Returns all users
   ```
   
   Remediation:
   ```python
   # Validate and parameterize
   try:
       user_id = int(user_id)  # Type validation
   except ValueError:
       return "Invalid user ID", 400
   
   query = "SELECT * FROM users WHERE id=?"
   user = cursor.execute(query, (user_id,)).fetchone()
   ```

4. Missing Authentication on Sensitive Endpoint
   Location: get_user() function
   
   Vulnerability:
   - No authentication check
   - Any user can view any other user's data
   
   Impact:
   - Privacy violation
   - Information disclosure
   
   Remediation:
   ```python
   from functools import wraps
   
   def require_login(f):
       @wraps(f)
       def decorated_function(*args, **kwargs):
           if 'user_id' not in session:
               return redirect(url_for('login'))
           return f(*args, **kwargs)
       return decorated_function
   
   @app.route('/user/<user_id>')
   @require_login
   def get_user(user_id):
       # Also check authorization
       if session['user_id'] != int(user_id) and not is_admin():
           return "Forbidden", 403
       # ... rest of code
   ```

5. Insecure Session Management
   Location: login() function, line 15
   
   Vulnerability:
   - Session not configured with security flags
   - No secret key visible in code
   - No session timeout
   - No CSRF protection
   
   Remediation:
   ```python
   import secrets
   from datetime import timedelta
   
   app.secret_key = secrets.token_hex(32)  # Strong random key
   app.config.update(
       SESSION_COOKIE_SECURE=True,      # HTTPS only
       SESSION_COOKIE_HTTPONLY=True,    # Prevent XSS access
       SESSION_COOKIE_SAMESITE='Lax',   # CSRF protection
       PERMANENT_SESSION_LIFETIME=timedelta(hours=1)
   )
   ```

MEDIUM VULNERABILITIES:

6. Missing HTTPS Enforcement
   
   Vulnerability:
   - No HTTPS enforcement in code
   - Sensitive data transmitted in clear text
   
   Remediation:
   ```python
   from flask_talisman import Talisman
   
   Talisman(app, force_https=True)
   ```

7. Information Disclosure in Error Messages
   Location: All error responses
   
   Vulnerability:
   - Detailed error messages reveal system information
   
   Remediation:
   ```python
   app.config['PROPAGATE_EXCEPTIONS'] = False
   
   @app.errorhandler(Exception)
   def handle_error(e):
       # Log detailed error server-side
       app.logger.error(f"Error: {str(e)}", exc_info=True)
       # Return generic error to user
       return "An error occurred", 500
   ```

8. No Rate Limiting
   
   Vulnerability:
   - No protection against brute force attacks
   
   Remediation:
   ```python
   from flask_limiter import Limiter
   
   limiter = Limiter(app, key_func=lambda: request.remote_addr)
   
   @app.route('/login', methods=['POST'])
   @limiter.limit("5 per minute")
   def login():
       # ... login code
   ```

LOW VULNERABILITIES:

9. Missing Security Headers
   
   Add security headers:
   ```python
   @app.after_request
   def add_security_headers(response):
       response.headers['X-Content-Type-Options'] = 'nosniff'
       response.headers['X-Frame-Options'] = 'DENY'
       response.headers['X-XSS-Protection'] = '1; mode=block'
       response.headers['Strict-Transport-Security'] = 'max-age=31536000'
       return response
   ```

10. No Input Validation
    
    Add comprehensive validation:
    ```python
    from wtforms import Form, StringField, validators
    
    class LoginForm(Form):
        username = StringField('Username', [
            validators.Length(min=3, max=50),
            validators.Regexp('^[a-zA-Z0-9_]+$')
        ])
        password = StringField('Password', [
            validators.Length(min=8, max=128)
        ])
    ```

SECURITY IMPROVEMENTS SUMMARY:

Priority 1 (Immediate):
- Fix SQL injection vulnerabilities
- Implement password hashing
- Add authentication/authorization

Priority 2 (This Week):
- Implement rate limiting
- Add CSRF protection
- Configure session security

Priority 3 (This Month):
- Add comprehensive logging
- Implement input validation
- Add security headers
- Set up HTTPS

OWASP Top 10 Mapping:
- A01: Broken Access Control ✓
- A02: Cryptographic Failures ✓
- A03: Injection ✓
- A04: Insecure Design ✓
- A05: Security Misconfiguration ✓
- A06: Vulnerable Components (check dependencies)
- A07: Authentication Failures ✓
- A08: Software and Data Integrity Failures
- A09: Security Logging Failures ✓
- A10: Server-Side Request Forgery (not applicable)
```

**Tips for Customization**:
- Specify compliance requirements (PCI DSS, HIPAA, SOC 2)
- Include threat model if available
- Mention existing security controls

---

### 2. Authentication Security Review
```
Review authentication implementation:

Authentication Code: [paste auth code]
Auth Method: [JWT/Session/OAuth/etc]
User Data: [what's being protected]

Review:
1. Password storage (hashing, salting)
2. Password requirements
3. Token generation and validation
4. Session management
5. Multi-factor authentication
6. Account lockout
7. Password reset flow
8. Remember me functionality
9. Logout implementation
10. Security event logging
```

**Usage Context**: Auditing authentication systems.

---

### 3. Authorization Security Review
```
Review authorization implementation:

Code: [paste authorization code]
Access Control Model: [RBAC/ABAC/ACL]
Resources: [what needs protection]
Roles/Permissions: [access levels]

Check:
1. Access control enforcement
2. Privilege escalation risks
3. Insecure direct object references
4. Missing function level access control
5. Role/permission management
6. Default deny approach
7. Separation of duties
8. Audit logging
```

**Usage Context**: Reviewing access control.

---

### 4. API Security Audit
```
Audit API security:

API: [endpoints or OpenAPI spec]
Authentication: [method]
Data Sensitivity: [classification]

Audit:
1. Authentication enforcement
2. Authorization per endpoint
3. Input validation
4. Output encoding
5. Rate limiting
6. CORS configuration
7. API versioning security
8. Error handling
9. Logging and monitoring
10. API key management
```

**Usage Context**: Securing APIs.

---

## Vulnerability Detection

### 5. Input Validation Review
```
Review input validation:

Code: [paste code handling user input]
Input Sources: [forms, APIs, files, etc]
Input Types: [string, number, file, JSON]

Check for:
1. Missing validation
2. Inadequate validation
3. Client-side only validation
4. SQL injection
5. XSS vulnerabilities
6. Command injection
7. Path traversal
8. XXE attacks
9. Deserialization attacks
10. Buffer overflows
```

**Usage Context**: Ensuring proper input validation.

**Example Input**:
```javascript
app.post('/upload', (req, res) => {
  const filename = req.body.filename;
  const content = req.body.content;
  
  fs.writeFileSync(`./uploads/${filename}`, content);
  res.send('File uploaded');
});
```

**Example Output**:
```
INPUT VALIDATION VULNERABILITIES:

CRITICAL: Path Traversal (CWE-22)

Vulnerability:
- filename parameter not validated
- No sanitization of path components

Exploitation:
```bash
POST /upload
{
  "filename": "../../etc/passwd",
  "content": "malicious content"
}

Result: Writes to /etc/passwd instead of ./uploads/
```

Impact:
- Arbitrary file write
- System compromise
- Privilege escalation

Remediation:
```javascript
const path = require('path');
const { body, validationResult } = require('express-validator');

app.post('/upload',
  // Validation middleware
  body('filename')
    .trim()
    .isLength({ min: 1, max: 255 })
    .matches(/^[a-zA-Z0-9_.-]+$/)  // Only safe characters
    .withMessage('Invalid filename'),
  body('content')
    .isLength({ max: 10485760 })  // 10MB limit
    .withMessage('Content too large'),
  
  (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const filename = req.body.filename;
    const content = req.body.content;
    
    // Sanitize filename - remove any path components
    const sanitizedFilename = path.basename(filename);
    
    // Ensure upload directory exists and is correct
    const uploadDir = path.resolve('./uploads');
    const filePath = path.join(uploadDir, sanitizedFilename);
    
    // Verify final path is still within upload directory
    if (!filePath.startsWith(uploadDir)) {
      return res.status(400).send('Invalid file path');
    }
    
    // Check file extension whitelist
    const allowedExtensions = ['.txt', '.pdf', '.jpg', '.png'];
    const ext = path.extname(sanitizedFilename).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).send('File type not allowed');
    }
    
    try {
      fs.writeFileSync(filePath, content, { mode: 0o644 });
      res.send('File uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).send('Upload failed');
    }
  }
);
```

Additional Security Measures:

1. File Size Limits:
```javascript
app.use(express.json({ limit: '10mb' }));
```

2. Content Type Validation:
```javascript
const fileType = require('file-type');

const buffer = Buffer.from(content, 'base64');
const type = await fileType.fromBuffer(buffer);

if (!['image/jpeg', 'image/png', 'application/pdf'].includes(type?.mime)) {
  return res.status(400).send('Invalid file type');
}
```

3. Virus Scanning:
```javascript
const NodeClam = require('clamscan');
const clamscan = await new NodeClam().init();
const { isInfected } = await clamscan.scanFile(filePath);

if (isInfected) {
  fs.unlinkSync(filePath);
  return res.status(400).send('Malicious file detected');
}
```

4. Rate Limiting:
```javascript
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // 10 uploads per window
});

app.post('/upload', uploadLimiter, ...);
```
```

---

### 6. XSS Vulnerability Detection
```
Detect XSS vulnerabilities in:

Code: [paste code]
Framework: [frontend framework]
Context: [where user input is displayed]

Check for:
1. Unescaped output
2. DOM-based XSS
3. Stored XSS
4. Reflected XSS
5. Template injection
6. JavaScript protocol in URLs
7. Event handler injection
8. CSP bypass
```

**Usage Context**: Finding cross-site scripting vulnerabilities.

---

### 7. Cryptography Review
```
Review cryptographic implementation:

Code: [paste crypto code]
Use Case: [encryption/hashing/signing]
Data Sensitivity: [classification]

Review:
1. Algorithm selection
2. Key management
3. IV/nonce generation
4. Padding schemes
5. Random number generation
6. Certificate validation
7. Secure defaults
8. Key rotation
9. Deprecated algorithms
10. Side-channel risks
```

**Usage Context**: Auditing cryptographic code.

---

### 8. Dependency Vulnerability Scan
```
Analyze security of dependencies:

Dependencies: [package.json/requirements.txt/etc]
Language: [language]

Check:
1. Known vulnerabilities (CVEs)
2. Outdated versions
3. Unmaintained packages
4. License compliance
5. Transitive dependencies
6. Supply chain risks
7. Update recommendations
8. Alternative secure packages
```

**Usage Context**: Reviewing third-party dependencies.

---

## Secure Implementation

### 9. Implement Secure Authentication
```
Implement secure authentication for:

Application Type: [web/mobile/API]
Requirements: [MFA, SSO, etc]
User Base: [size and type]

Implement:
1. Password policy enforcement
2. Secure password storage (bcrypt/Argon2)
3. Session management
4. CSRF protection
5. Rate limiting
6. Account lockout
7. Secure password reset
8. MFA implementation
9. Security logging
10. Token-based auth (if API)
```

**Usage Context**: Building secure authentication.

---

### 10. Implement Secure Data Storage
```
Design secure data storage for:

Data Types: [PII, financial, health, etc]
Compliance: [GDPR, PCI DSS, HIPAA]
Database: [type]

Implement:
1. Encryption at rest
2. Encryption in transit
3. Field-level encryption for sensitive data
4. Key management
5. Access control
6. Audit logging
7. Data masking
8. Backup encryption
9. Secure deletion
10. Data retention policies
```

**Usage Context**: Protecting sensitive data.

---

## Compliance

### 11. GDPR Compliance Review
```
Review GDPR compliance:

System: [description]
Personal Data: [what's collected]
Data Processing: [how it's used]

Check:
1. Lawful basis for processing
2. Consent management
3. Data minimization
4. Purpose limitation
5. Right to access
6. Right to erasure
7. Right to portability
8. Data breach procedures
9. Privacy by design
10. DPO requirements
```

**Usage Context**: Ensuring GDPR compliance.

---

### 12. PCI DSS Compliance
```
Review PCI DSS compliance for payment processing:

Payment Flow: [describe]
Cardholder Data: [what's stored/transmitted]
Infrastructure: [environment]

Check all 12 requirements:
1. Firewall configuration
2. No default passwords
3. Protect stored cardholder data
4. Encrypt transmission
5. Anti-virus
6. Secure systems and applications
7. Restrict access by business need
8. Unique IDs
9. Restrict physical access
10. Track and monitor access
11. Test security systems
12. Security policy
```

**Usage Context**: Payment security compliance.

---

## Security Best Practices Template

```
SECURITY REVIEW REQUEST:

Code/System:
[paste code or describe system]

Scope:
- Type: [authentication/API/data storage/etc]
- Language/Framework: [details]
- Environment: [production/staging/dev]

Sensitivity:
- Data Classification: [public/internal/confidential/restricted]
- User Impact: [scope of users affected]
- Regulatory: [GDPR/HIPAA/PCI/etc]

Current Security Measures:
[list what's already in place]

Threat Model:
- Attackers: [who might attack]
- Attack Vectors: [how they might attack]
- Assets to Protect: [what needs protection]

Please Review:
1. OWASP Top 10 vulnerabilities
2. Authentication/authorization flaws
3. Input validation issues
4. Data protection
5. Cryptography usage
6. Configuration security
7. Logging and monitoring
8. Third-party risks
9. Compliance requirements
10. Remediation priorities

Provide:
- Severity ratings
- Exploitation scenarios
- Specific fixes with code
- Prevention strategies
```

## Best Practices for Security Prompts

1. **Provide Full Context**: Include all code paths
2. **Specify Threat Model**: Define attacker capabilities
3. **Include Compliance Needs**: Mention regulatory requirements
4. **Request Severity Ratings**: Critical/High/Medium/Low
5. **Ask for Exploitation Scenarios**: Understand real-world impact
6. **Request Specific Fixes**: Want code examples, not general advice
7. **Include Current Controls**: What security is already in place
8. **Specify Environment**: Production vs development considerations
9. **Request Prioritization**: What to fix first
10. **Ask for Prevention**: How to avoid issues going forward
