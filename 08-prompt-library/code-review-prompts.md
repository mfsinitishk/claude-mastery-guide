# Code Review Prompts

Prompts for conducting thorough code reviews and providing constructive feedback.

## Table of Contents
- [General Code Review](#general-code-review)
- [Security Review](#security-review)
- [Performance Review](#performance-review)
- [Best Practices Review](#best-practices-review)

---

## General Code Review

### 1. Comprehensive Code Review
```
Perform a comprehensive code review:

Code: [paste code or PR diff]
Context: [what the code does]
Language/Framework: [details]

Review for:
1. Correctness and logic errors
2. Code organization and structure
3. Readability and maintainability
4. Error handling
5. Edge cases
6. Performance issues
7. Security concerns
8. Test coverage
9. Documentation
10. Best practices adherence

Provide:
- Issues found (categorized by severity: critical/major/minor)
- Specific line-by-line feedback
- Suggested improvements with examples
- Positive observations
```

**Usage Context**: Comprehensive review of new or changed code.

**Example Input**:
```python
def process_payment(user_id, amount, card_number):
    user = db.query("SELECT * FROM users WHERE id = " + str(user_id))
    
    if amount > 0:
        card = card_number.replace(" ", "")
        
        # Process payment
        result = payment_api.charge(card, amount)
        
        if result:
            db.query("INSERT INTO payments VALUES (" + str(user_id) + ", " + str(amount) + ")")
            return True
    
    return False
```

**Example Output**:
```
CRITICAL ISSUES:

1. SQL Injection Vulnerability (Lines 2, 10)
   - Current: String concatenation in SQL queries
   - Risk: Allows SQL injection attacks
   - Fix: Use parameterized queries
   ```python
   user = db.query("SELECT * FROM users WHERE id = ?", (user_id,))
   db.query("INSERT INTO payments (user_id, amount) VALUES (?, ?)", 
            (user_id, amount))
   ```

2. PCI DSS Violation (Line 6)
   - Current: Handling raw card numbers
   - Risk: PCI compliance violation, data breach risk
   - Fix: Use payment tokenization service
   ```python
   token = payment_api.tokenize(card_number)
   result = payment_api.charge(token, amount)
   ```

MAJOR ISSUES:

3. Missing Input Validation (Lines 1-2)
   - No validation of user_id, amount, card_number
   - Add validation before processing
   ```python
   if not user_id or not isinstance(user_id, int):
       raise ValueError("Invalid user_id")
   if amount <= 0:
       raise ValueError("Amount must be positive")
   ```

4. No Error Handling (Line 8)
   - Payment API call can fail without handling
   - Add try-catch and proper error handling
   ```python
   try:
       result = payment_api.charge(card, amount)
   except PaymentException as e:
       logger.error(f"Payment failed: {e}")
       return False
   ```

MINOR ISSUES:

5. Magic Number (Line 3)
   - Hardcoded 0 for amount check
   - Extract to named constant: MIN_PAYMENT_AMOUNT = 0

6. Missing Logging
   - No audit trail for payments
   - Add logging for payment attempts and results

POSITIVE OBSERVATIONS:
- Function name is clear and descriptive
- Return values are boolean (simple interface)

RECOMMENDED REFACTORING:
```python
import logging
from decimal import Decimal

MIN_PAYMENT_AMOUNT = Decimal('0.01')
logger = logging.getLogger(__name__)

def process_payment(user_id: int, amount: Decimal, 
                   payment_token: str) -> bool:
    """
    Process a payment for a user.
    
    Args:
        user_id: The user's ID
        amount: Payment amount (must be positive)
        payment_token: Tokenized payment method
        
    Returns:
        True if payment successful, False otherwise
        
    Raises:
        ValueError: If inputs are invalid
    """
    # Validate inputs
    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError("Invalid user_id")
    if amount < MIN_PAYMENT_AMOUNT:
        raise ValueError(f"Amount must be at least {MIN_PAYMENT_AMOUNT}")
    
    # Verify user exists
    user = db.query("SELECT id FROM users WHERE id = ?", (user_id,))
    if not user:
        logger.warning(f"Payment attempted for non-existent user: {user_id}")
        return False
    
    try:
        # Process payment
        result = payment_api.charge(payment_token, amount)
        
        if result.success:
            # Record payment
            db.query(
                "INSERT INTO payments (user_id, amount, transaction_id, created_at) "
                "VALUES (?, ?, ?, NOW())",
                (user_id, amount, result.transaction_id)
            )
            logger.info(f"Payment processed: user={user_id}, "
                       f"amount={amount}, txn={result.transaction_id}")
            return True
        else:
            logger.warning(f"Payment declined: user={user_id}, "
                          f"reason={result.decline_reason}")
            return False
            
    except PaymentException as e:
        logger.error(f"Payment error: user={user_id}, error={e}")
        return False
```
```

**Tips for Customization**:
- Specify style guide (PEP 8, Airbnb, Google)
- Mention architectural patterns in use
- Include project-specific requirements

**Common Mistakes to Avoid**:
- Being too harsh or personal in feedback
- Not providing specific examples
- Focusing only on negatives
- Ignoring context of the change

---

### 2. Pull Request Review
```
Review this Pull Request:

PR Title: [title]
Description: [PR description]
Changes: [diff or summary]
Related Issue: [issue number]

Evaluate:
1. Does it solve the stated problem?
2. Is the approach appropriate?
3. Are changes minimal and focused?
4. Code quality issues
5. Test coverage adequate?
6. Breaking changes?
7. Documentation updated?
8. Performance implications
9. Security considerations
10. Backward compatibility

Provide:
- Approval recommendation (approve/request changes/comment)
- Specific feedback
- Questions for clarification
- Suggestions for improvement
```

**Usage Context**: Reviewing pull requests before merge.

**Language Variations**:
- Adapt to different VCS platforms (GitHub, GitLab, Bitbucket)
- Include CI/CD pipeline considerations

---

### 3. API Design Review
```
Review this API design:

Endpoint(s): [list endpoints]
Methods: [HTTP methods]
Request/Response Format: [schemas]
Authentication: [method]

Review:
1. RESTful principles adherence
2. Naming conventions
3. HTTP method appropriateness
4. Status code usage
5. Error response format
6. Versioning strategy
7. Pagination approach
8. Rate limiting
9. Documentation completeness
10. Backward compatibility
```

**Usage Context**: Reviewing API design and implementation.

**Example Input**:
```
POST /api/getUser
Request: { "userId": "123" }
Response: { "status": "success", "user": {...} }
```

**Example Output**:
```
ISSUES:

1. Incorrect HTTP Method
   - Current: POST /api/getUser
   - Issue: Using POST for read operation
   - Fix: Use GET /api/users/123

2. Inconsistent Naming
   - Current: camelCase in path (getUser)
   - Issue: REST conventions use kebab-case or lowercase
   - Fix: GET /api/users/{userId}

3. Redundant Response Wrapper
   - Current: {"status": "success", "user": {...}}
   - Issue: HTTP status code already indicates success
   - Fix: Return user object directly, use 200 status

RECOMMENDED:
GET /api/users/{userId}

Success Response (200):
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}

Error Response (404):
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found"
  }
}
```

---

### 4. Database Schema Review
```
Review database schema:

Schema: [DDL or description]
Use Cases: [how data will be accessed]
Expected Volume: [row counts]

Review:
1. Normalization level appropriateness
2. Primary key design
3. Foreign key constraints
4. Index strategy
5. Data types selection
6. NULL handling
7. Default values
8. Constraints (unique, check)
9. Naming conventions
10. Migration strategy
```

**Usage Context**: Reviewing database design.

---

### 5. Frontend Component Review
```
Review this frontend component:

Component: [paste component code]
Framework: [React/Vue/Angular/etc]
Purpose: [what it does]

Review:
1. Component structure
2. Props/state management
3. Re-rendering optimization
4. Accessibility (a11y)
5. Error boundaries
6. Loading states
7. Event handlers
8. Styling approach
9. Testing
10. Performance
```

**Usage Context**: Reviewing UI components.

**Tips for Customization**:
- Mention component library in use (Material-UI, Ant Design)
- Include accessibility requirements (WCAG level)
- Specify browser support requirements

---

## Security Review

### 6. Security Code Review
```
Perform security-focused code review:

Code: [paste code]
Trust Boundaries: [user input points, external data]

Check for:
1. SQL Injection vulnerabilities
2. XSS vulnerabilities
3. CSRF protection
4. Authentication/authorization flaws
5. Sensitive data exposure
6. Insecure deserialization
7. Unvalidated redirects
8. Security misconfiguration
9. Cryptography issues
10. Logging sensitive data

Categorize by OWASP Top 10 where applicable.
```

**Usage Context**: Security-focused code review.

**Example Input**:
```javascript
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const user = db.query(`SELECT * FROM users WHERE id = ${userId}`);
  res.send(`<h1>Welcome ${user.name}</h1>`);
});
```

**Example Output**:
```
CRITICAL SECURITY VULNERABILITIES:

1. SQL Injection (OWASP A03:2021 - Injection)
   - Line: db.query(\`SELECT * FROM users WHERE id = ${userId}\`)
   - Risk: Attacker can execute arbitrary SQL
   - Exploit: /user/1%20OR%201=1
   - Fix: Use parameterized queries
   ```javascript
   const user = db.query('SELECT * FROM users WHERE id = ?', [userId]);
   ```

2. Cross-Site Scripting (OWASP A03:2021 - Injection)
   - Line: res.send(\`<h1>Welcome ${user.name}</h1>\`)
   - Risk: Stored XSS if user.name contains script tags
   - Exploit: user.name = "<script>alert('XSS')</script>"
   - Fix: Use proper templating with auto-escaping
   ```javascript
   res.render('user', { name: user.name }); // or
   res.send(`<h1>Welcome ${escapeHtml(user.name)}</h1>`);
   ```

3. Missing Authorization (OWASP A01:2021 - Broken Access Control)
   - Issue: No verification that requester can access this user
   - Risk: Any user can view any other user's data
   - Fix: Add authorization check
   ```javascript
   if (req.user.id !== userId && !req.user.isAdmin) {
     return res.status(403).json({ error: 'Forbidden' });
   }
   ```

4. Information Disclosure
   - Issue: SELECT * exposes all user fields
   - Risk: May leak sensitive data (password hash, etc.)
   - Fix: Specify exact fields needed
   ```javascript
   const user = db.query(
     'SELECT id, name, email FROM users WHERE id = ?', 
     [userId]
   );
   ```
```

---

### 7. Authentication Review
```
Review authentication implementation:

Code: [paste auth code]
Auth Type: [JWT/Session/OAuth/etc]

Review:
1. Password storage (hashing algorithm)
2. Token generation and validation
3. Session management
4. Password reset flow
5. Rate limiting on auth endpoints
6. Multi-factor authentication
7. Secure token storage
8. Token expiration
9. Logout implementation
10. Account lockout policy
```

**Usage Context**: Reviewing authentication systems.

---

### 8. Data Privacy Review
```
Review for data privacy compliance:

Code: [paste code handling personal data]
Regulations: [GDPR/CCPA/HIPAA/etc]

Check:
1. Data minimization
2. Consent management
3. Right to erasure implementation
4. Data encryption
5. Audit logging
6. Data retention policies
7. Third-party data sharing
8. Privacy by design
9. Data breach procedures
10. Documentation
```

**Usage Context**: Ensuring privacy compliance.

---

## Performance Review

### 9. Performance Code Review
```
Review code for performance issues:

Code: [paste code]
Performance Requirements: [latency, throughput]
Expected Load: [users, requests/sec]

Identify:
1. N+1 query problems
2. Inefficient algorithms
3. Memory leaks
4. Unnecessary loops
5. Missing caching
6. Blocking operations
7. Large object copying
8. Inefficient data structures
9. Missing indexes
10. Resource leaks

Provide metrics where possible.
```

**Usage Context**: Performance-focused review.

**Example Input**:
```python
def get_user_posts(user_id):
    user = User.query.get(user_id)
    posts = []
    for post_id in user.post_ids:
        post = Post.query.get(post_id)  # N+1 query
        posts.append({
            'title': post.title,
            'author': post.author.name  # Additional query per post
        })
    return posts
```

**Example Output**:
```
PERFORMANCE ISSUES:

1. N+1 Query Problem (Severity: HIGH)
   - Lines: 4-5
   - Issue: Separate query for each post
   - Impact: 1 + N queries for N posts
   - For 100 posts: 101 database queries
   - Fix: Use eager loading
   ```python
   def get_user_posts(user_id):
       user = User.query.options(
           joinedload(User.posts).joinedload(Post.author)
       ).get(user_id)
       
       return [{
           'title': post.title,
           'author': post.author.name
       } for post in user.posts]
   ```
   - Result: 1 query instead of 101

2. Inefficient Data Structure (Severity: MEDIUM)
   - Line: 3
   - Issue: Building list with append in loop
   - Fix: Use list comprehension (more efficient)

Performance Comparison:
- Before: O(N) database queries
- After: O(1) database queries (with joins)
- Expected improvement: 90%+ reduction in DB time for N > 10
```

---

### 10. Scalability Review
```
Review code for scalability:

Code: [paste code]
Current Scale: [users, data volume]
Target Scale: [growth projection]

Evaluate:
1. Horizontal scaling capability
2. State management
3. Database scaling strategy
4. Caching approach
5. Async processing
6. Resource pooling
7. Load distribution
8. Bottlenecks
9. Single points of failure
10. Infrastructure requirements
```

**Usage Context**: Ensuring code can scale.

---

## Best Practices Review

### 11. Clean Code Review
```
Review for clean code principles:

Code: [paste code]
Language Style Guide: [PEP 8, Airbnb, etc]

Check:
1. Meaningful names
2. Function size and complexity
3. Code duplication
4. Comments quality
5. Abstraction levels
6. Error handling
7. Code formatting
8. SOLID principles
9. Design patterns usage
10. Technical debt

Use metrics: cyclomatic complexity, function length, etc.
```

**Usage Context**: Code quality and maintainability review.

---

### 12. Test Quality Review
```
Review test code quality:

Tests: [paste test code]
Coverage: [percentage]

Review:
1. Test completeness (happy paths, edge cases, errors)
2. Test independence
3. Test readability
4. Proper assertions
5. Mock usage appropriateness
6. Test data quality
7. Setup/teardown
8. Test naming
9. Flaky test risks
10. Test performance
```

**Usage Context**: Reviewing test code.

---

## Code Review Template

```
CODE REVIEW REQUEST:

Code/PR:
[paste code or link]

Context:
- Purpose: [what problem does it solve]
- Related Issue: [issue number]
- Type of Change: [feature/bugfix/refactor]

Review Focus:
- Primary: [security/performance/correctness/etc]
- Secondary: [other concerns]

Requirements:
- Style Guide: [link or name]
- Architecture: [patterns in use]
- Framework Version: [details]

Please Review:
1. Correctness and logic
2. Security vulnerabilities
3. Performance implications
4. Code organization
5. Error handling
6. Test coverage
7. Documentation
8. Best practices
9. Potential edge cases
10. Maintainability

Provide:
- Issues categorized by severity
- Specific suggestions with code examples
- Questions for clarification
- Approval recommendation
```

## Best Practices for Code Review Prompts

1. **Provide Full Context**: Include the purpose and background
2. **Specify Review Type**: Security, performance, general, etc.
3. **Include Requirements**: Style guides, standards, regulations
4. **Request Specific Output**: Categories, severity levels, examples
5. **Ask for Examples**: Request code snippets for suggestions
6. **Be Constructive**: Ask for positive observations too
7. **Consider Scale**: Mention current and expected load
8. **Include Constraints**: Backward compatibility, breaking changes
9. **Request Prioritization**: Critical vs nice-to-have improvements
10. **Specify Format**: How you want feedback organized
