# Exercises and Examples

## Hands-On Practice for AI-Assisted Development

---

## 🎯 Overview

Theory without practice is incomplete. This section provides progressive exercises, real-world scenarios, and a comprehensive prompt library to solidify your Level 1 skills.

**Time Investment:** 10-15 hours of hands-on practice  
**Outcome:** Confidence and muscle memory for AI-assisted development

---

## 📚 How to Use This Section

### Learning Approach

1. **Start with Beginner Exercises** - Build confidence
2. **Progress to Intermediate** - Tackle realistic scenarios
3. **Challenge Yourself with Advanced** - Push your limits
4. **Review Sample Prompts** - Build your intuition
5. **Create Your Own** - Apply to your real work

### Practice Protocol

For Each Exercise:
```
1. Try writing the prompt yourself first
2. Compare with provided solution
3. Run your prompt with Claude
4. Compare results
5. Iterate and improve
6. Save your best version
```

---

## 🎯 Beginner Exercises

### Exercise 1: Basic Function Generation

**Objective:** Generate a simple function with clear requirements

**Task:**
Create a Python function that takes a list of numbers and returns:
- The sum
- The average
- The min and max values

**Your Prompt:**
```
[Write your prompt here before looking at solution]
```

**Sample Solution:**
```
Create a Python function called `analyze_numbers` that processes a list of numbers.

Requirements:
- Input: List of numbers (integers or floats)
- Output: Dictionary with sum, average, min, max
- Handle empty list (return None or raise exception)
- Include type hints
- Add docstring with examples
- Handle edge cases (single number, negatives)

Return format:
{
  'sum': <total>,
  'average': <mean>,
  'min': <minimum>,
  'max': <maximum>
}
```

**Expected Code:**
```python
from typing import List, Dict, Optional

def analyze_numbers(numbers: List[float]) -> Optional[Dict[str, float]]:
    """
    Analyzes a list of numbers and returns statistical summary.
    
    Args:
        numbers: List of integers or floats to analyze
        
    Returns:
        Dictionary with sum, average, min, max or None if empty
        
    Examples:
        >>> analyze_numbers([1, 2, 3, 4, 5])
        {'sum': 15, 'average': 3.0, 'min': 1, 'max': 5}
        
        >>> analyze_numbers([])
        None
    """
    if not numbers:
        return None
    
    return {
        'sum': sum(numbers),
        'average': sum(numbers) / len(numbers),
        'min': min(numbers),
        'max': max(numbers)
    }
```

### Exercise 2: Code Explanation

**Objective:** Get clear explanation of unfamiliar code

**Task:**
Explain this JavaScript code:

```javascript
const memoize = fn => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
```

**Your Prompt:**
```
[Write your prompt here]
```

**Sample Solution:**
```
Explain this JavaScript memoization function:

For someone who knows JavaScript basics but not advanced patterns:
- What is memoization?
- How does this implementation work?
- What's the purpose of JSON.stringify?
- What are the trade-offs?
- When would I use this?
- What are the limitations?
- Show a usage example

[code above]
```

### Exercise 3: Simple Debugging

**Objective:** Debug a simple logic error

**Task:**
This function should return even numbers but doesn't work:

```python
def get_even_numbers(numbers):
    result = []
    for num in numbers:
        if num % 2 == 1:
            result.append(num)
    return result
```

**Your Prompt:**
```
[Write your debugging prompt here]
```

**Sample Solution:**
```
Debug this Python function:

EXPECTED: Return list of even numbers
ACTUAL: Returns odd numbers

Input: [1, 2, 3, 4, 5, 6]
Expected output: [2, 4, 6]
Actual output: [1, 3, 5]

Find the bug and provide corrected code.

[code above]
```

### Exercise 4: Basic Refactoring

**Objective:** Improve code readability

**Task:**
Refactor this messy code:

```javascript
function p(d) {
  let t = 0;
  for (let i = 0; i < d.length; i++) {
    t += d[i].p * d[i].q;
  }
  if (t > 100) t = t * 0.9;
  return t;
}
```

**Your Prompt:**
```
[Write your refactoring prompt here]
```

**Sample Solution:**
```
Refactor this JavaScript function for better readability:

Improvements needed:
- Descriptive variable names
- Clear function name
- Add JSDoc documentation
- Extract magic numbers to constants
- Add type hints (JSDoc or TypeScript)

Keep the same functionality.

[code above]
```

### Exercise 5: Test Generation

**Objective:** Generate basic tests

**Task:**
Create tests for this email validator:

```python
def is_valid_email(email):
    if not email or '@' not in email:
        return False
    
    parts = email.split('@')
    if len(parts) != 2:
        return False
    
    local, domain = parts
    if not local or not domain:
        return False
    
    if '.' not in domain:
        return False
    
    return True
```

**Your Prompt:**
```
[Write your test generation prompt here]
```

**Sample Solution:**
```
Generate pytest tests for this email validation function:

Test cases needed:
- Valid emails: user@example.com, user.name@example.com
- Invalid emails: missing @, no domain, no local, no TLD
- Edge cases: None, empty string, multiple @

Use descriptive test names and include:
- Happy path tests
- Invalid format tests
- Edge case tests

[code above]
```

---

## 🎯 Intermediate Exercises

### Exercise 6: API Endpoint Design

**Objective:** Create a RESTful API endpoint

**Task:**
Design a POST endpoint for creating blog posts in an Express.js app.

Requirements:
- Endpoint: `/api/posts`
- Authentication required
- Validate: title (required, max 200 chars), content (required), tags (optional array)
- Save to database
- Return created post with ID and timestamp

**Your Prompt:**
```
[Write your prompt here]
```

**Sample Solution:**
```
Create an Express.js POST endpoint for blog post creation:

Route: POST /api/posts

Authentication: JWT required (use middleware)

Request body:
{
  "title": "string (required, max 200 chars)",
  "content": "string (required)",
  "tags": ["optional", "array"]
}

Process:
1. Authenticate user
2. Validate input
3. Save to database
4. Return created post

Response (201):
{
  "id": "generated_id",
  "title": "...",
  "content": "...",
  "tags": [...],
  "author_id": "from_token",
  "created_at": "timestamp"
}

Error responses:
- 401: Not authenticated
- 400: Validation failed
- 500: Server error

Include:
- TypeScript types
- Error handling
- Input validation
- Status codes
```

### Exercise 7: Complex Refactoring

**Objective:** Refactor nested conditional logic

**Task:**
Refactor this pricing logic:

```python
def calculate_price(user, product, quantity):
    price = product.base_price * quantity
    
    if user.type == 'premium':
        if quantity > 10:
            if product.category == 'electronics':
                price = price * 0.7
            else:
                price = price * 0.75
        else:
            price = price * 0.85
    elif user.type == 'regular':
        if quantity > 20:
            price = price * 0.9
        elif quantity > 10:
            price = price * 0.95
    
    if user.has_coupon:
        if user.coupon_type == 'percent':
            price = price * (1 - user.coupon_value / 100)
        else:
            price = price - user.coupon_value
    
    return max(price, 0)
```

**Your Prompt:**
```
[Write your refactoring prompt here]
```

**Sample Solution:**
```
Refactor this pricing calculation for better maintainability:

Current issues:
- Deep nesting (hard to follow)
- Business logic mixed with implementation
- Hard to test individual discount rules
- Difficult to add new discount types

Refactoring approach:
1. Extract discount calculation methods
2. Use strategy pattern or discount chain
3. Separate concerns (user discount, quantity discount, coupon)
4. Make rules explicit and testable

Preserve exact functionality.

[code above]
```

### Exercise 8: Database Query Optimization

**Objective:** Optimize a slow database query

**Task:**
This query is slow:

```sql
SELECT 
    u.id,
    u.name,
    u.email,
    (SELECT COUNT(*) FROM posts WHERE author_id = u.id) as post_count,
    (SELECT COUNT(*) FROM comments WHERE user_id = u.id) as comment_count,
    (SELECT AVG(rating) FROM reviews WHERE reviewer_id = u.id) as avg_rating
FROM users u
WHERE u.active = true
ORDER BY post_count DESC
LIMIT 100;
```

**Your Prompt:**
```
[Write your optimization prompt here]
```

**Sample Solution:**
```
Optimize this slow PostgreSQL query:

Current performance: 2.5 seconds for 10,000 users

Problem: N+1 query pattern with subqueries

Requirements:
- Same result set
- Better performance
- Explain the optimization
- Suggest indexes

Context:
- users table: 10,000 rows
- posts table: 50,000 rows
- comments table: 200,000 rows
- reviews table: 30,000 rows

Provide:
1. Optimized query using JOINs
2. Required indexes
3. Expected performance improvement
4. EXPLAIN output interpretation

[query above]
```

### Exercise 9: React Component with State

**Objective:** Create a functional component with complex state

**Task:**
Create a React shopping cart component with:
- Add/remove items
- Update quantities
- Calculate total
- Apply coupon codes
- Local storage persistence

**Your Prompt:**
```
[Write your prompt here]
```

### Exercise 10: Async Error Handling

**Objective:** Properly handle async operations

**Task:**
Improve error handling in this async code:

```javascript
async function loadUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(user.id);
  
  return { user, posts, comments };
}
```

**Your Prompt:**
```
[Write your error handling improvement prompt here]
```

---

## 🎯 Advanced Exercises

### Exercise 11: Design Pattern Implementation

**Objective:** Implement Observer pattern

**Task:**
Create an event system using the Observer pattern in TypeScript.

Requirements:
- Publishers emit events
- Subscribers listen to specific event types
- Type-safe event data
- Support unsubscribe
- Support once-only listeners

**Your Prompt:**
```
[Write your prompt here]
```

### Exercise 12: Performance Optimization

**Objective:** Optimize a computationally expensive function

**Task:**
This function calculates Fibonacci numbers but is slow:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

Make it handle n=50 efficiently.

**Your Prompt:**
```
[Write your optimization prompt here]
```

### Exercise 13: Comprehensive API Documentation

**Objective:** Create full API documentation

**Task:**
Document this entire API module:

```typescript
// Payment API endpoints
router.post('/api/payments', createPayment);
router.get('/api/payments/:id', getPayment);
router.get('/api/payments', listPayments);
router.post('/api/payments/:id/refund', refundPayment);
router.post('/api/payments/:id/capture', capturePayment);
```

Create OpenAPI/Swagger specification.

**Your Prompt:**
```
[Write your documentation prompt here]
```

### Exercise 14: Testing Strategy

**Objective:** Create comprehensive test strategy

**Task:**
Design a complete testing strategy for a user authentication system including:
- Unit tests
- Integration tests
- Security tests
- Performance tests

**Your Prompt:**
```
[Write your test strategy prompt here]
```

### Exercise 15: Architecture Design

**Objective:** Design system architecture

**Task:**
Design architecture for a real-time chat application with:
- 10,000+ concurrent users
- Message persistence
- User presence
- Typing indicators
- File sharing

**Your Prompt:**
```
[Write your architecture design prompt here]
```

---

## 📝 Sample Prompts Library (50+)

### Code Generation Prompts

**1. REST API Endpoint**
```
Create a [METHOD] endpoint: [path]
Input: [request structure]
Output: [response structure]
Validation: [rules]
Errors: [error cases]
Framework: [Express/Flask/FastAPI/etc]
```

**2. React Component**
```
Create a React component: [ComponentName]
Props: [prop list with types]
State: [state needed]
Functionality: [what it does]
Styling: [CSS modules/styled-components/Tailwind]
```

**3. Database Model**
```
Create a [ORM] model for [entity]:
Fields: [field list with types and constraints]
Relationships: [relations to other models]
Indexes: [what needs indexing]
Validation: [validation rules]
```

**4. Utility Function**
```
Create a [language] utility function that [purpose]
Input: [parameters]
Output: [return value]
Edge cases: [special cases to handle]
Performance: [any requirements]
```

**5. Data Transformation**
```
Transform this data structure:
From: [input format]
To: [output format]
Rules: [transformation rules]
Edge cases: [how to handle special cases]
```

### Debugging Prompts

**6. Error Analysis**
```
I'm getting this error:
[error message]

Stack trace:
[stack trace]

Context:
[what I was doing]

Help me:
1. Understand the error
2. Find root cause
3. Fix it
4. Prevent it

[relevant code]
```

**7. Performance Investigation**
```
This code is slow:
Current performance: [metrics]
Expected: [target]
Scale: [data size]

Help me:
1. Identify bottlenecks
2. Suggest optimizations
3. Estimate improvements

[code]
```

**8. Logic Error**
```
Expected behavior: [what should happen]
Actual behavior: [what's happening]

Test case that fails:
Input: [input]
Expected: [expected output]
Actual: [actual output]

Find the bug in:
[code]
```

### Refactoring Prompts

**9. Code Simplification**
```
Simplify this code while maintaining functionality:
Issues: [what's complex]
Goals: [what to improve]
Constraints: [what to preserve]

[code]
```

**10. Extract Function**
```
Extract functions from this code:
Identify logical sections
Create well-named functions
Maintain same behavior

[long function]
```

**11. Improve Naming**
```
Improve variable and function names:
Make purpose obvious
Follow [language] conventions
Avoid abbreviations

[code with poor names]
```

### Testing Prompts

**12. Unit Test Suite**
```
Generate [framework] tests for:
Happy path: [scenarios]
Edge cases: [scenarios]
Errors: [error cases]
Coverage: [target %]

[code to test]
```

**13. Integration Test**
```
Generate integration test for:
System: [description]
Components: [list]
Interactions: [what to test]
Setup: [test environment]
```

**14. Mock Generation**
```
Create mocks for these dependencies:
[dependency list]

Framework: [testing framework]
Mock behavior: [what mocks should do]
```

### Documentation Prompts

**15. README Creation**
```
Create README.md for:
Project: [name and description]
Tech stack: [technologies]
Audience: [users/developers/both]

Include: setup, usage, API, contributing
```

**16. Function Documentation**
```
Generate [docstring/JSDoc/JavaDoc] for:
[function code]

Include:
- Description
- Parameters
- Returns
- Examples
- Edge cases
```

**17. API Documentation**
```
Document this API endpoint:
Method: [GET/POST/etc]
Path: [endpoint path]
Purpose: [what it does]

Include request/response examples
```

### Code Review Prompts

**18. Security Review**
```
Review for security issues:
Focus: [SQL injection/XSS/auth/etc]
Framework: [framework name]
Threat model: [who might attack]

[code]
```

**19. Best Practices Check**
```
Check against [language/framework] best practices:
Style guide: [link or name]
Patterns: [preferred patterns]

[code]
```

**20. Performance Review**
```
Review for performance issues:
Scale: [data size/user count]
Bottlenecks to check: [database/network/CPU]

[code]
```

### Learning Prompts

**21. Concept Explanation**
```
Explain [concept] for someone who knows [background]:
Use analogies
Provide code examples
Cover common pitfalls
```

**22. Framework Learning**
```
I'm learning [framework]. Explain this code:
- Key concepts used
- Framework features
- Best practices
- How to modify it

[code]
```

**23. Pattern Explanation**
```
What design pattern is this?
Explain:
- Pattern name
- When to use
- Benefits
- Drawbacks

[code]
```

### Architecture Prompts

**24. System Design**
```
Design architecture for:
Requirements: [functional requirements]
Scale: [users/data/requests]
Constraints: [budget/tech/time]

Include: components, data flow, tech choices
```

**25. Database Schema**
```
Design database schema for:
Entities: [list]
Relationships: [how they relate]
Queries: [common queries]
Scale: [data size]
```

### Conversion Prompts

**26. Language Translation**
```
Convert this [source language] code to [target language]:
Maintain functionality
Use [target] idioms
Follow [target] best practices

[code]
```

**27. Framework Migration**
```
Migrate from [old framework] to [new framework]:
Component: [what to migrate]
Preserve: [what must stay same]
Improve: [what to enhance]

[code]
```

---

## 🎯 Real-World Scenarios

### Scenario 1: Emergency Bug Fix

**Context:** Production is down. Users can't log in.

**Error:** "TypeError: Cannot read property 'id' of undefined"

**Your Task:**
1. Write debugging prompt
2. Analyze the issue
3. Create fix
4. Generate tests to prevent recurrence

**Practice:**
```
[Write your complete workflow prompts here]
```

### Scenario 2: Feature Implementation

**Context:** Implement password reset flow

**Requirements:**
- User requests reset via email
- Generate secure token
- Email reset link
- Validate token
- Update password
- Invalidate token

**Your Task:**
Create complete implementation with tests and docs

**Practice:**
```
[Write your implementation prompts here]
```

### Scenario 3: Code Review

**Context:** New team member submitted PR

**Code:** 300 lines of new feature code

**Your Task:**
1. Review for bugs
2. Check security
3. Verify tests
4. Suggest improvements

**Practice:**
```
[Write your code review prompts here]
```

---

## ✅ Self-Assessment Activities

### Activity 1: Prompt Quality Check

Review your recent prompts against this checklist:

- [ ] Clear and specific
- [ ] Includes context
- [ ] Defines success criteria
- [ ] Specifies format
- [ ] Includes examples (when helpful)
- [ ] One main focus per prompt

### Activity 2: Code Review Exercise

Generate code for a feature, then:
1. Review it yourself
2. List issues found
3. Compare with Claude's review
4. Identify what you missed

### Activity 3: Speed Challenge

Time yourself:
- Generate 5 CRUD endpoints
- Write tests for all
- Generate documentation
- Target: Under 30 minutes

### Activity 4: No-AI Day

Pick one day:
- Code without AI assistance
- Note what feels different
- Identify skills to maintain
- Appreciate AI more

---

## 🚀 Next Steps

Complete these exercises to build confidence. Then move to the final assessment to validate your Level 1 mastery.

**Next:** [Level 1 Assessment →](./14-assessment.md)

---

*"I hear and I forget. I see and I remember. I do and I understand." - Confucius*

*Practice deliberately. Learn actively. Build confidently.*
