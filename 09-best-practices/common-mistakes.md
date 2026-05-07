# Common Mistakes and Solutions

## Overview

Even experienced developers make mistakes when working with AI-assisted development. This guide identifies common mistakes and provides practical solutions.

## Top 10 Common Mistakes

### 1. Insufficient Context

**Mistake:**
Not providing enough information for Claude to generate appropriate code.

**Example:**
```
"Create an API endpoint"
```

**Problem:**
- Unclear requirements
- Missing technical details
- No constraints specified
- Unknown expectations

**Solution:**
```
"Create a REST API endpoint for user registration:

REQUIREMENTS:
- POST /api/auth/register
- Accept: email, password, firstName, lastName
- Validate email format and password strength
- Hash password with bcrypt (12 rounds)
- Store in PostgreSQL database
- Send verification email
- Return JWT token

CONSTRAINTS:
- Use Express.js
- TypeScript with strict mode
- Include Zod validation
- Follow existing auth patterns in /src/auth/login.ts

INCLUDE:
- Implementation
- Unit tests
- Integration tests
- OpenAPI spec update"
```

### 2. Not Validating Outputs

**Mistake:**
Using AI-generated code without verification.

**Problem:**
- May contain bugs
- Might not meet requirements
- Could have security issues
- May violate standards

**Solution:**
Always validate:
- Run tests locally
- Review code line-by-line
- Check security implications
- Verify against requirements
- Test edge cases manually

### 3. Unclear Error Messages

**Mistake:**
Not providing complete error information when debugging.

**Example:**
```
"Fix the error in my code"
```

**Problem:**
- Unknown error location
- Missing error message
- No stack trace
- Unclear context

**Solution:**
```
"Fix error in /src/services/payment.ts:

ERROR MESSAGE:
TypeError: Cannot read property 'amount' of undefined
  at processPayment (/src/services/payment.ts:45:28)
  at async POST /api/payments (handler.ts:23:15)

CONTEXT:
- Occurs when processing refunds
- Payment object is sometimes undefined
- Added refund feature in last commit
- Works fine for new payments

CODE (lines 40-50):
[paste relevant code section]

What's causing this and how to fix?"
```

### 4. Ignoring Performance

**Mistake:**
Not specifying performance requirements.

**Problem:**
- Generates inefficient code
- May not scale
- Could be slow
- Resource intensive

**Solution:**
Always specify:
- Response time targets
- Throughput requirements
- Resource constraints
- Scalability needs
- Performance benchmarks

### 5. Skipping Tests

**Mistake:**
Accepting implementation without tests.

**Problem:**
- Unknown correctness
- Regression risk
- Hard to refactor
- No safety net

**Solution:**
Request tests with implementation:
```
"Implement feature X with:
- Unit tests (100% coverage)
- Integration tests
- Edge case testing
- Performance tests
- Error scenario tests"
```

### 6. Over-Complicating

**Mistake:**
Requesting overly complex solutions.

**Example:**
```
"Create an enterprise-grade, microservices-based, event-sourced, 
CQRS architecture for user CRUD operations"
```

**Problem:**
- Over-engineered
- Hard to maintain
- Unnecessary complexity
- Longer development time

**Solution:**
```
"Create a simple user service with CRUD operations:
- RESTful API
- PostgreSQL storage
- Basic validation
- Standard error handling

Keep it simple, we can add complexity if needed later."
```

### 7. Not Iterating

**Mistake:**
Expecting perfect code on first try.

**Problem:**
- Unrealistic expectations
- Misses improvement opportunities
- Doesn't leverage feedback loop
- Results in suboptimal code

**Solution:**
Plan for iteration:
```
"First iteration: Basic working implementation
Second iteration: Add error handling and validation
Third iteration: Optimize performance
Fourth iteration: Add comprehensive tests"
```

### 8. Ignoring Security

**Mistake:**
Not explicitly requesting security measures.

**Problem:**
- Vulnerable code
- Security holes
- Compliance issues
- Data exposure risks

**Solution:**
Always specify security requirements:
```
"Implement with security:
- Input validation (Zod schemas)
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- Authentication (JWT verification)
- Authorization (role-based)
- Rate limiting (100 req/hour)
- Audit logging"
```

### 9. Poor Prompt Structure

**Mistake:**
Unorganized, rambling prompts.

**Problem:**
- Hard to understand
- Missing key information
- Unclear priorities
- Confusing requirements

**Solution:**
Use structured format:
```
GOAL: [What you want to achieve]

CONTEXT: [Background information]

REQUIREMENTS:
- [Requirement 1]
- [Requirement 2]

CONSTRAINTS:
- [Constraint 1]
- [Constraint 2]

EXPECTED OUTPUT:
- [Output 1]
- [Output 2]
```

### 10. Not Sharing Knowledge

**Mistake:**
Keeping AI-generated solutions to yourself.

**Problem:**
- Team doesn't benefit
- Repeated work
- No knowledge transfer
- Missed improvements

**Solution:**
Share with team:
- Document successful prompts
- Update team wiki
- Present at meetings
- Create reusable templates
- Contribute to knowledge base

## Domain-Specific Mistakes

### Database Mistakes

**Mistake: N+1 Queries**
```typescript
// DON'T
for (const user of users) {
  const posts = await db.query('SELECT * FROM posts WHERE user_id = $1', [user.id]);
  user.posts = posts;
}
```

**Solution: Batch Loading**
```typescript
// DO
const userIds = users.map(u => u.id);
const posts = await db.query('SELECT * FROM posts WHERE user_id = ANY($1)', [userIds]);
const postsByUser = groupBy(posts, 'user_id');
users.forEach(user => {
  user.posts = postsByUser[user.id] || [];
});
```

**Mistake: Missing Indexes**
```sql
-- DON'T: Query without index
SELECT * FROM orders WHERE customer_id = 123;
-- (no index on customer_id)
```

**Solution: Add Appropriate Indexes**
```sql
-- DO: Create index
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
```

### API Mistakes

**Mistake: No Pagination**
```typescript
// DON'T: Return all records
app.get('/api/users', async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users);
});
```

**Solution: Implement Pagination**
```typescript
// DO: Paginate results
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  
  const users = await db.query(
    'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  
  const total = await db.query('SELECT COUNT(*) FROM users');
  
  res.json({
    data: users,
    pagination: {
      page,
      limit,
      total: total.count,
      pages: Math.ceil(total.count / limit)
    }
  });
});
```

**Mistake: Exposing Internal IDs**
```typescript
// DON'T: Use sequential IDs in URLs
GET /api/users/1
GET /api/users/2  // Easy to enumerate
```

**Solution: Use UUIDs or Add Authorization**
```typescript
// DO: Use UUIDs
GET /api/users/550e8400-e29b-41d4-a716-446655440000

// OR: Verify authorization for sequential IDs
app.get('/api/users/:id', authenticate, async (req, res) => {
  // Check if user has permission to access this ID
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  // ...
});
```

### Testing Mistakes

**Mistake: Flaky Tests**
```typescript
// DON'T: Time-dependent tests
it('should process within 100ms', async () => {
  const start = Date.now();
  await processData();
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(100); // Flaky!
});
```

**Solution: Mock Time**
```typescript
// DO: Use fake timers
it('should process data', async () => {
  jest.useFakeTimers();
  const promise = processData();
  jest.advanceTimersByTime(1000);
  await promise;
  expect(result).toBeDefined();
  jest.useRealTimers();
});
```

**Mistake: Interdependent Tests**
```typescript
// DON'T: Tests depend on order
describe('user tests', () => {
  let userId;
  
  it('creates user', async () => {
    userId = await createUser(); // Sets global state
  });
  
  it('updates user', async () => {
    await updateUser(userId); // Depends on previous test
  });
});
```

**Solution: Independent Tests**
```typescript
// DO: Each test standalone
describe('user tests', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });
  
  it('creates user', async () => {
    const userId = await createUser();
    expect(userId).toBeDefined();
  });
  
  it('updates user', async () => {
    const userId = await createUser(); // Create fresh user
    await updateUser(userId);
    const user = await getUser(userId);
    expect(user.updated).toBe(true);
  });
});
```

## Prevention Strategies

### 1. Checklist-Driven Development

Use checklists for every task:
- [ ] Requirements clear and specific
- [ ] Context provided
- [ ] Security considered
- [ ] Performance targets set
- [ ] Tests requested
- [ ] Documentation included
- [ ] Edge cases identified
- [ ] Error handling planned

### 2. Peer Review

Always get second opinion:
- Share prompts with team
- Review AI outputs together
- Discuss trade-offs
- Validate assumptions
- Cross-check requirements

### 3. Incremental Approach

Build in small steps:
1. Start with minimal viable solution
2. Verify it works
3. Add one feature at a time
4. Test after each addition
5. Refine based on feedback

### 4. Documentation Habit

Document everything:
- Prompt patterns that work
- Common mistakes encountered
- Solutions that helped
- Team learnings
- Best practices evolved

### 5. Continuous Learning

Stay updated:
- Review AI-generated code regularly
- Learn from mistakes
- Share knowledge
- Improve prompts
- Refine processes

## Recovery Strategies

When mistakes happen:

1. **Identify**: Recognize the mistake
2. **Analyze**: Understand root cause
3. **Fix**: Correct the issue
4. **Test**: Verify the fix
5. **Document**: Record the learning
6. **Share**: Prevent team recurrence
7. **Improve**: Update processes

## Metrics for Success

Track mistake frequency:

1. **Bugs Introduced**: <5% from AI code
2. **Rework Rate**: <10% of AI code needs significant rework
3. **Security Issues**: Zero security bugs from AI code
4. **Code Review Time**: <2 hours average per PR
5. **Time to Production**: <1 week from generation to deployment

## Conclusion

Mistakes are learning opportunities. Recognize common patterns, apply solutions systematically, share knowledge with your team, and continuously improve your approach to AI-assisted development.

Remember: The goal isn't perfection on first try, but continuous improvement and learning.
