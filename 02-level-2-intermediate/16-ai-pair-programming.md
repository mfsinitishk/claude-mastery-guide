# AI Pair Programming

## Real-Time Collaboration with Claude as Your Programming Partner

---

## 🎯 Overview

AI pair programming treats Claude as your collaborative coding partner rather than just a code generator. Like traditional pair programming, you work together iteratively: Claude writes code, you review and guide, Claude refines based on your feedback. This creates a collaborative flow that produces higher quality results than one-shot generation.

**Time to Master:** 3-4 hours  
**Outcome:** Develop fluency in collaborative coding with AI

---

## 💡 The Pair Programming Model

### Traditional Pair Programming

**Driver-Navigator Roles:**
```
Driver: Types the code
Navigator: Reviews, suggests, thinks ahead
```

**Benefits:**
- Immediate code review
- Knowledge sharing
- Fewer bugs
- Better design decisions
- Learning opportunity

### AI Pair Programming

**Your Role (Navigator):**
```
- Define requirements
- Review code quality
- Guide design decisions
- Catch issues
- Request improvements
```

**Claude's Role (Driver):**
```
- Write code implementations
- Suggest approaches
- Explain decisions
- Refactor on request
- Generate tests
```

---

## 🔄 The AI Pairing Workflow

### Phase 1: Planning Together

**You (Navigator):**
```
Let's build a user authentication system. 
What approach do you recommend?
```

**Claude (Driver):**
```
I suggest this architecture:

1. JWT-based authentication
2. bcrypt for password hashing
3. Refresh token rotation
4. Role-based access control

Layers:
- AuthController (API endpoints)
- AuthService (business logic)
- TokenService (JWT management)
- User model (database)

Should we:
A) Start with basic login/register
B) Include 2FA from the start
C) Add OAuth providers immediately

What's the priority?
```

**You:**
```
A - basic first. We'll add 2FA in phase 2.
```

### Phase 2: Incremental Development

**You:**
```
Start with the User model
```

**Claude:**
```typescript
// src/models/User.ts
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

Thoughts on this model?
```

**You:**
```
Good start. Add email validation and ensure email is lowercase.
Also, we'll need a "isActive" field for soft deletes.
```

**Claude:**
```typescript
// src/models/User.ts (updated)
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;          // stored lowercase
  passwordHash: string;
  role: 'user' | 'admin';
  isActive: boolean;      // for soft deletes
  createdAt: Date;
  updatedAt: Date;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

Better? Ready for AuthService?
```

### Phase 3: Test-Driven Development

**You:**
```
Before we write AuthService, let's write the tests.
```

**Claude:**
```typescript
// __tests__/services/AuthService.test.ts

describe('AuthService', () => {
  describe('register', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'secure123',
        name: 'Test User'
      };
      
      const user = await authService.register(userData);
      
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).not.toBe('secure123');
      expect(await bcrypt.compare('secure123', user.passwordHash)).toBe(true);
    });
    
    it('should normalize email to lowercase', async () => {
      const user = await authService.register({
        email: 'TEST@EXAMPLE.COM',
        password: 'secure123',
        name: 'Test'
      });
      
      expect(user.email).toBe('test@example.com');
    });
    
    it('should reject duplicate email', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'secure123',
        name: 'Test'
      });
      
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'another',
          name: 'Another'
        })
      ).rejects.toThrow('Email already registered');
    });
  });
  
  describe('login', () => {
    it('should return token for valid credentials', async () => {
      // Setup: create user
      await authService.register({
        email: 'test@example.com',
        password: 'secure123',
        name: 'Test'
      });
      
      const result = await authService.login(
        'test@example.com',
        'secure123'
      );
      
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });
    
    it('should reject invalid password', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'secure123',
        name: 'Test'
      });
      
      await expect(
        authService.login('test@example.com', 'wrong')
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

These tests define the AuthService contract. Ready to implement?
```

**You:**
```
Perfect. Now implement AuthService to pass these tests.
```

### Phase 4: Refinement and Review

**Claude:** [Implements AuthService]

**You:**
```
I see a few issues:
1. No rate limiting - vulnerable to brute force
2. Error messages too specific (security issue)
3. Should we add account lockout after failed attempts?
```

**Claude:**
```
Good catches! Let me update:

1. Rate limiting:
```typescript
// Add rate limiting decorator
@RateLimit({ windowMs: 15 * 60 * 1000, max: 5 })
async login(email: string, password: string) {
  // ...
}
```

2. Generic error messages:
```typescript
// Before: 'Invalid password' or 'User not found'
// After: 'Invalid credentials' (for both cases)
```

3. Account lockout:
```typescript
interface User {
  // ... existing fields
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

async login(email: string, password: string) {
  const user = await this.findByEmail(email);
  
  if (!user || !user.isActive) {
    throw new AuthenticationError('Invalid credentials');
  }
  
  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AuthenticationError('Account temporarily locked');
  }
  
  const isValid = await comparePassword(password, user.passwordHash);
  
  if (!isValid) {
    await this.handleFailedLogin(user);
    throw new AuthenticationError('Invalid credentials');
  }
  
  await this.handleSuccessfulLogin(user);
  return this.generateTokens(user);
}

private async handleFailedLogin(user: User) {
  user.failedLoginAttempts++;
  
  // Lock after 5 failed attempts
  if (user.failedLoginAttempts >= 5) {
    user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
  }
  
  await this.updateUser(user);
}

private async handleSuccessfulLogin(user: User) {
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  await this.updateUser(user);
}
```

How's this?
```

---

## 🎯 Effective Pairing Patterns

### Pattern 1: Iterative Refinement

**Round 1:**
```
You: Create a product search function

Claude: [Basic implementation with simple string match]

You: Add fuzzy matching and ranking

Claude: [Adds Levenshtein distance, relevance scoring]

You: Cache results for common queries

Claude: [Adds Redis caching with TTL]

You: Perfect. Add tests.

Claude: [Generates comprehensive test suite]
```

### Pattern 2: Question-Driven Development

**You ask, Claude explores:**

```
You: What's the best way to handle file uploads?

Claude: Several options:
1. Direct to cloud storage (S3)
2. Via your API with streaming
3. Pre-signed URLs for client-direct upload

Trade-offs:
- Option 1: Serverless, scalable, but requires client-side SDK
- Option 2: Full control, but loads your server
- Option 3: Best performance, secure, recommended

Which fits your architecture?

You: We use AWS, go with option 3

Claude: Here's the implementation...
```

### Pattern 3: Code Review Loop

**Claude writes, you review:**

```
Claude: [Implements feature X]

You: Review for:
- Security issues
- Performance problems
- Edge cases

Claude: Found issues:
- SQL injection risk on line 45 (fixed)
- N+1 query problem (optimized)
- Missing null check for optional param (added)

Updated code: [...]

You: Looks good. Ship it.
```

### Pattern 4: Exploratory Programming

**Experimenting together:**

```
You: What if we tried a different data structure here?

Claude: Current: Array with O(n) lookup
Alternative: Map with O(1) lookup

Here's how it would look...
[Shows implementation]

Performance comparison:
- 1,000 items: 10x faster
- 10,000 items: 100x faster

Trade-off: Higher memory usage (acceptable?)

You: Yes, the speed is worth it. Let's use Map.

Claude: Updated with Map implementation.
```

---

## 💬 Communication Patterns

### Giving Effective Feedback

**❌ Vague:**
```
This code is bad
Make it better
Fix the issues
```

**✅ Specific:**
```
Line 23: This loop is O(n²). Use a Map for O(n).
Line 45: Missing input validation. Add email format check.
Line 67: Should handle the case where user is null.
```

### Asking Better Questions

**❌ Too Broad:**
```
How do I make this faster?
What's wrong with this code?
How should I structure this?
```

**✅ Specific:**
```
This query takes 2 seconds on 10k rows. What indexes would help?
My component re-renders 100 times. Where's the performance issue?
Should this be a service class or a set of utility functions?
```

### Requesting Alternatives

**Effective pattern:**
```
You: Show me 3 ways to implement caching here

Claude: 
Option 1: In-memory Map
  Pros: Simple, no dependencies
  Cons: Lost on restart, not shared across instances

Option 2: Redis
  Pros: Persistent, shared, distributed
  Cons: External dependency, network overhead

Option 3: In-memory with write-through to Redis
  Pros: Best of both (fast reads, persistent)
  Cons: More complex, cache invalidation needed

Which fits your needs?

You: Option 3. Show implementation.

Claude: [Implements hybrid caching]
```

---

## 🚀 Advanced Pairing Techniques

### Technique 1: Design by Contract

**Define contracts first:**

```
You: Define the interface for OrderService

Claude: 
```typescript
interface OrderService {
  createOrder(items: CartItem[], userId: string): Promise<Order>;
  getOrder(orderId: string): Promise<Order | null>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
  cancelOrder(orderId: string, reason: string): Promise<void>;
  calculateTotal(items: CartItem[]): Promise<number>;
}
```

You: Good. Now implement with these rules:
- Orders can't be cancelled if status is 'shipped'
- calculateTotal must apply discounts and tax
- All operations must be transactional

Claude: [Implements with constraints]
```

### Technique 2: Ping-Pong Testing

**You write test, Claude implements, repeat:**

```
You: [Writes first test]
test('should create order with items', () => {
  // ...
});

Claude: [Implements to pass test]

Claude: [Writes next test]
test('should calculate order total with tax', () => {
  // ...
});

You: [Implements to pass test]

[Continue alternating]
```

### Technique 3: Rubber Duck Debugging

**Explain problem to Claude:**

```
You: 
I'm getting intermittent null pointer errors on user.profile.avatar.
Here's the code:
[paste code]

I think it's happening when profile is undefined, but I have a check...

Claude:
Looking at line 23, you check `if (user.profile)` but then 
on line 25 you access `user.profile.avatar` outside the if block.

The check doesn't protect the access because...

Fix:
[Shows corrected code with proper null-safe access]

You: Ah! Thanks, I see it now.
```

---

## ✅ Best Practices

### DO:
✅ Start with clear requirements  
✅ Iterate in small steps  
✅ Review every suggestion  
✅ Ask "why" for design decisions  
✅ Provide specific feedback  
✅ Request alternatives  
✅ Write tests together  
✅ Refactor collaboratively  

### DON'T:
❌ Accept code without understanding  
❌ Skip testing  
❌ Ignore security concerns  
❌ Rush to "done" without review  
❌ Forget to document decisions  
❌ Avoid asking questions  

---

## 🎓 Practice Exercise

**Pair with Claude to build a todo list API:**

**Start:**
```
You: Let's build a todo list API together. 
I want your thoughts on the approach first.
```

**Continue through:**
1. Discuss architecture
2. Define data models
3. Write tests (TDD)
4. Implement endpoints
5. Review for issues
6. Refactor for quality
7. Add error handling
8. Write documentation

**Goal:** Experience a full pairing session from start to finish.

---

**Next:** [Exercises and Examples →](./17-exercises-and-examples.md)
