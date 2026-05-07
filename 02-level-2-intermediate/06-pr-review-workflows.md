# PR Review Workflows

## Mastering Pull Request Reviews with AI Assistance

---

## 🎯 Learning Objectives

By the end of this section, you will be able to:

- ✅ Review pull requests 5-10x faster with AI assistance
- ✅ Identify bugs, security issues, and code quality problems
- ✅ Provide constructive, actionable feedback
- ✅ Understand code changes deeply without prior context
- ✅ Create automated PR review workflows
- ✅ Write comprehensive PR review comments
- ✅ Ensure consistent code quality across teams
- ✅ Build reusable review checklists and templates

---

## 📖 Understanding PR Review Workflows

### Why AI-Assisted PR Reviews Matter

**Traditional PR Review (30-60 minutes per PR):**
- Read through all changes manually
- Try to understand context without familiarity
- Miss subtle bugs or edge cases
- Provide inconsistent feedback
- Struggle with large PRs

**AI-Assisted PR Review (5-15 minutes per PR):**
- Quick context understanding
- Comprehensive issue detection
- Consistent quality checks
- Detailed, constructive feedback
- Handle large PRs efficiently

### The Review Mindset

**What Makes a Good Review:**
- 🎯 Focuses on important issues, not nitpicks
- 🧠 Understands the change's purpose and context
- 🔍 Identifies bugs, security issues, performance problems
- 📚 Suggests improvements with rationale
- 🤝 Provides constructive, respectful feedback
- ⚡ Completed quickly to unblock the author

**What to Avoid:**
- ❌ Nitpicking style preferences
- ❌ Rewriting the PR to match your preferences
- ❌ Blocking on non-critical issues
- ❌ Vague feedback without suggestions
- ❌ Ignoring the PR's context and goals

---

## 🔍 The AI-Assisted Review Process

### Phase 1: Initial Understanding (2-3 minutes)

**Objective:** Quickly understand what the PR is trying to accomplish.

#### Prompt Template: PR Context Analysis

```
Analyze this pull request and help me understand:

PR Title: [title]
PR Description: [description]

Files Changed:
[paste list of changed files or git diff --name-only output]

Help me understand:
1. What is this PR trying to accomplish?
2. What type of change is this? (feature, bugfix, refactor, etc.)
3. Which parts of the system are affected?
4. What should I focus on during review?
5. Are there any red flags I should investigate?
```

**Example:**

```
PR Title: Add email verification to user registration
PR Description: Implements email verification flow for new users using SendGrid

Files Changed:
- src/api/auth/register.ts
- src/services/emailService.ts
- src/models/User.ts
- src/templates/verificationEmail.html
- tests/auth/registration.test.ts

What should I focus on in this review?
```

**Expected AI Response:**
- Change type identification
- Key areas to review (security, data handling, testing)
- Potential risk areas
- Review priorities

### Phase 2: Code Quality Analysis (5-8 minutes)

#### Prompt Template: Comprehensive Code Review

```
Review this code change for:

1. **Bugs and Logic Errors:**
   - Edge cases not handled
   - Null/undefined handling
   - Error handling gaps
   - Race conditions

2. **Security Issues:**
   - Input validation
   - SQL injection risks
   - XSS vulnerabilities
   - Authentication/authorization
   - Sensitive data exposure

3. **Performance:**
   - Inefficient algorithms
   - Database query optimization
   - Memory leaks
   - Unnecessary operations

4. **Code Quality:**
   - Readability and clarity
   - Maintainability
   - Consistency with codebase
   - Proper abstractions

5. **Testing:**
   - Test coverage adequacy
   - Edge cases tested
   - Test quality

Here's the code:
[paste diff or changed code]

Existing codebase context:
[paste relevant existing files if needed]
```

#### Real Example: Reviewing Authentication Code

```
Review this registration endpoint change:

```typescript
// src/api/auth/register.ts
export async function registerUser(req: Request, res: Response) {
  const { email, password, name } = req.body;
  
  // Create user
  const user = await User.create({
    email,
    password,
    name,
    verified: false
  });
  
  // Send verification email
  const verificationToken = generateToken(user.id);
  await emailService.sendVerificationEmail(email, verificationToken);
  
  res.status(201).json({ 
    message: 'User registered. Check email for verification.',
    userId: user.id 
  });
}
```

Focus on security and error handling.
```

**Claude's Analysis Might Include:**

```markdown
🔴 CRITICAL ISSUES:

1. **Missing Input Validation**
   - Email format not validated
   - Password strength not checked
   - No sanitization of user inputs
   - Vulnerable to malformed data

2. **Password Security**
   - Password appears to be stored directly
   - Should hash password before storing
   - No check for common/weak passwords

3. **Error Handling**
   - No try-catch block
   - Database errors exposed to client
   - Email service failures not handled

🟡 SECURITY CONCERNS:

4. **User ID Exposure**
   - Returning user.id in response may expose internal IDs
   - Consider using UUIDs or not returning IDs

5. **Rate Limiting**
   - No rate limiting on registration
   - Vulnerable to spam/DoS attacks

6. **Duplicate Registration**
   - No check for existing email
   - Could cause database errors

🟢 SUGGESTIONS:

7. **Better Error Messages**
   - Current error handling would expose stack traces
   - Implement user-friendly error responses

8. **Email Verification Timeout**
   - Token should have expiration
   - No mention of token TTL

RECOMMENDED FIXES:

```typescript
export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;
    
    // Validate inputs
    const validation = validateRegistrationInput(email, password, name);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }
    
    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verified: false
    });
    
    // Send verification email
    const verificationToken = generateToken(user.id, { expiresIn: '24h' });
    await emailService.sendVerificationEmail(email, verificationToken);
    
    res.status(201).json({ 
      message: 'User registered. Check email for verification.'
      // Don't expose user.id
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
```
```

### Phase 3: Architectural and Design Review (3-5 minutes)

#### Prompt Template: Design and Architecture Analysis

```
Analyze this PR from an architectural perspective:

Changes:
[paste code changes]

Codebase context:
[paste relevant existing patterns/architecture]

Evaluate:
1. **Consistency:** Does this follow existing patterns?
2. **Design:** Are there better design alternatives?
3. **Modularity:** Is the code properly separated?
4. **Dependencies:** Are new dependencies justified?
5. **Maintainability:** Will this be easy to maintain?
6. **Scalability:** Any scalability concerns?
7. **Testability:** Is the code easily testable?

Suggest specific improvements.
```

**Example: Reviewing a Service Layer Addition**

```
This PR adds a new PaymentService:

```typescript
// src/services/PaymentService.ts
export class PaymentService {
  private stripeClient: Stripe;
  private db: Database;
  
  constructor(db: Database) {
    this.db = db;
    this.stripeClient = new Stripe(process.env.STRIPE_KEY);
  }
  
  async processPayment(userId: string, amount: number, currency: string) {
    const user = await this.db.users.findById(userId);
    const charge = await this.stripeClient.charges.create({
      amount,
      currency,
      customer: user.stripeCustomerId
    });
    
    await this.db.payments.create({
      userId,
      chargeId: charge.id,
      amount,
      status: 'completed'
    });
    
    return charge;
  }
}
```

Existing services follow this pattern:
```typescript
export class UserService {
  constructor(
    private db: Database,
    private emailService: EmailService
  ) {}
}
```

Does this fit our architecture?
```

**Claude's Architectural Review:**

```markdown
🏗️ ARCHITECTURAL CONCERNS:

1. **Dependency Injection Inconsistency**
   ❌ Current: Stripe client created in constructor
   ✅ Suggested: Inject Stripe client like other dependencies
   
   ```typescript
   constructor(
     private db: Database,
     private paymentProvider: PaymentProvider // abstraction
   ) {}
   ```

2. **Hard-Coded Payment Provider**
   - Direct Stripe dependency makes switching providers hard
   - Violates dependency inversion principle
   
   Suggestion: Create PaymentProvider interface

3. **Mixed Responsibilities**
   - Service handles both payment processing AND database operations
   - Consider separating persistence logic
   
4. **Error Handling**
   - No rollback mechanism if database save fails
   - Should use transactions or compensating actions

5. **Testing Challenges**
   - Environment variable dependency in constructor
   - Difficult to mock Stripe client

RECOMMENDED ARCHITECTURE:

```typescript
// interfaces/PaymentProvider.ts
export interface PaymentProvider {
  createCharge(params: ChargeParams): Promise<Charge>;
}

// services/StripeProvider.ts
export class StripeProvider implements PaymentProvider {
  constructor(private config: StripeConfig) {}
  
  async createCharge(params: ChargeParams): Promise<Charge> {
    const stripe = new Stripe(this.config.apiKey);
    return stripe.charges.create(params);
  }
}

// services/PaymentService.ts
export class PaymentService {
  constructor(
    private db: Database,
    private paymentProvider: PaymentProvider,
    private auditLogger: AuditLogger
  ) {}
  
  async processPayment(request: PaymentRequest): Promise<Payment> {
    // Use transaction for atomicity
    return this.db.transaction(async (trx) => {
      const charge = await this.paymentProvider.createCharge({
        amount: request.amount,
        currency: request.currency,
        customerId: request.customerId
      });
      
      const payment = await trx.payments.create({
        userId: request.userId,
        chargeId: charge.id,
        amount: request.amount,
        status: 'completed'
      });
      
      await this.auditLogger.log('payment_processed', payment);
      
      return payment;
    });
  }
}
```

BENEFITS:
- ✅ Easily switch payment providers
- ✅ Better testability (mock PaymentProvider)
- ✅ Follows existing patterns
- ✅ Proper transaction handling
- ✅ Separation of concerns
```

### Phase 4: Testing Review (2-3 minutes)

#### Prompt Template: Test Coverage Analysis

```
Review the test coverage for this PR:

Code Changes:
[paste implementation code]

Tests:
[paste test code]

Analyze:
1. **Coverage:** What's tested? What's missing?
2. **Edge Cases:** Are edge cases covered?
3. **Error Scenarios:** Are failures tested?
4. **Test Quality:** Are tests well-written?
5. **Mocking:** Are mocks appropriate?
6. **Integration:** Are integrations tested?

Identify gaps and suggest additional tests.
```

**Example:**

```
Implementation:
```typescript
export async function getUserProfile(userId: string): Promise<UserProfile> {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  if (!user.verified) {
    throw new UnauthorizedError('Email not verified');
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}
```

Tests:
```typescript
describe('getUserProfile', () => {
  it('returns user profile for valid user', async () => {
    const profile = await getUserProfile('user-123');
    expect(profile).toHaveProperty('email');
  });
});
```

Are these tests sufficient?
```

**Claude's Test Review:**

```markdown
🔴 CRITICAL TEST GAPS:

1. **Missing Error Cases:**
   ❌ No test for NotFoundError (user doesn't exist)
   ❌ No test for UnauthorizedError (unverified user)
   ❌ No test for invalid userId format

2. **Incomplete Assertions:**
   - Only checks for email property
   - Doesn't verify all returned fields
   - Doesn't verify data correctness

3. **No Edge Cases:**
   - Null/undefined userId
   - Empty string userId
   - Malformed userId

RECOMMENDED TEST SUITE:

```typescript
describe('getUserProfile', () => {
  describe('successful retrieval', () => {
    it('returns complete profile for verified user', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        verified: true,
        createdAt: new Date('2024-01-01')
      };
      
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
      
      const profile = await getUserProfile(userId);
      
      expect(profile).toEqual({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: mockUser.createdAt
      });
      expect(User.findById).toHaveBeenCalledWith(userId);
    });
  });
  
  describe('error handling', () => {
    it('throws NotFoundError when user does not exist', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(null);
      
      await expect(getUserProfile('nonexistent'))
        .rejects
        .toThrow(NotFoundError);
    });
    
    it('throws UnauthorizedError when user is not verified', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        verified: false
      };
      
      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
      
      await expect(getUserProfile('user-123'))
        .rejects
        .toThrow(UnauthorizedError);
    });
    
    it('handles database errors gracefully', async () => {
      jest.spyOn(User, 'findById').mockRejectedValue(
        new Error('Database connection failed')
      );
      
      await expect(getUserProfile('user-123'))
        .rejects
        .toThrow('Database connection failed');
    });
  });
  
  describe('input validation', () => {
    it('handles null userId', async () => {
      await expect(getUserProfile(null as any))
        .rejects
        .toThrow();
    });
    
    it('handles undefined userId', async () => {
      await expect(getUserProfile(undefined as any))
        .rejects
        .toThrow();
    });
    
    it('handles empty string userId', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(null);
      
      await expect(getUserProfile(''))
        .rejects
        .toThrow(NotFoundError);
    });
  });
});
```

COVERAGE IMPROVEMENT:
- Before: ~20% code coverage
- After: ~95% code coverage
- All error paths tested
- All edge cases covered
```

---

## 🛠️ Review Workflow Templates

### Template 1: Quick Review (Small PRs, < 200 lines)

```markdown
## Step 1: Context (1 min)
Prompt:
"Quick review context:
- PR: [title]
- Files: [list]
What's the main change?"

## Step 2: Code Scan (3 min)
Prompt:
"Review this code for:
1. Bugs or logic errors
2. Security issues
3. Missing error handling
[paste code]"

## Step 3: Tests (2 min)
Prompt:
"Are these tests adequate?
[paste tests]
What's missing?"

## Step 4: Comment (1 min)
Write review comment with findings

Total: ~7 minutes
```

### Template 2: Comprehensive Review (Medium PRs, 200-1000 lines)

```markdown
## Step 1: Overview (2 min)
- Read PR description
- Review file list
- Understand change scope

Prompt:
"Analyze this PR:
[PR details]
What are the high-level concerns?"

## Step 2: Critical Files (5 min)
Focus on high-risk files first

Prompt:
"Review these critical changes:
[paste security-sensitive/complex code]
Find bugs, security issues, edge cases"

## Step 3: Architecture (3 min)
Prompt:
"Evaluate architectural approach:
[paste key changes]
Existing patterns:
[paste relevant code]
Does this fit? Suggestions?"

## Step 4: Tests (3 min)
Prompt:
"Test coverage analysis:
Implementation: [paste]
Tests: [paste]
Gaps and recommendations?"

## Step 5: Detailed Review (4 min)
- Review remaining files
- Check consistency
- Verify integration points

## Step 6: Summary (2 min)
Compile findings into structured comment

Total: ~15-20 minutes
```

### Template 3: Large PR Review (> 1000 lines)

```markdown
## Step 1: Break Down (3 min)
Prompt:
"This PR has [number] files changed.
Group them by:
1. Critical (security, data, core logic)
2. Important (features, integration)
3. Minor (formatting, docs, config)

Files: [list files]"

## Step 2: Critical Review (10 min)
Focus on critical files only

## Step 3: Important Review (8 min)
Review important files

## Step 4: Spot Check (4 min)
Sample minor files

## Step 5: Integration Analysis (5 min)
Prompt:
"How do these changes integrate?
Files changed: [list]
Potential integration issues?"

## Step 6: Summary (3 min)
Structured feedback

Total: ~30 minutes

Note: Consider requesting PR split if > 2000 lines
```

---

## 📝 Review Comment Templates

### Constructive Feedback Template

```markdown
## 🔴 Critical Issues
[Issues that must be fixed before merge]

**1. [Issue Title]**
- **Problem:** [What's wrong]
- **Impact:** [Why it matters]
- **Suggestion:** [How to fix]
```python
# Example fix
```

---

## 🟡 Important Suggestions
[Issues that should be addressed]

**1. [Suggestion Title]**
- **Current:** [What it does now]
- **Improvement:** [What would be better]
- **Benefit:** [Why make the change]

---

## 🟢 Minor Notes
[Nice-to-haves and observations]

- [Minor point 1]
- [Minor point 2]

---

## ✅ Positive Highlights
[Things done well]

- [Good practice 1]
- [Good practice 2]

---

## 📊 Summary

**Overall Assessment:** [Approve/Request Changes/Comment]

**Estimated Fix Time:** [time estimate]

**Test Coverage:** [assessment]

**Documentation:** [assessment]
```

### Security-Focused Review Template

```markdown
## 🔒 Security Review

**Authentication & Authorization:**
- [ ] Authentication checks present
- [ ] Authorization verified
- [ ] Role-based access correct
- [ ] Session handling secure

**Input Validation:**
- [ ] All inputs validated
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Path traversal protection

**Data Protection:**
- [ ] Sensitive data encrypted
- [ ] PII handling compliant
- [ ] Secure data transmission
- [ ] Proper access controls

**Error Handling:**
- [ ] No sensitive data in errors
- [ ] Proper logging
- [ ] Generic error messages
- [ ] No stack traces exposed

**Dependencies:**
- [ ] No vulnerable dependencies
- [ ] Minimal new dependencies
- [ ] Dependencies justified
- [ ] Versions pinned

**Issues Found:** [list or "None"]

**Risk Level:** [Low/Medium/High/Critical]
```

### Performance Review Template

```markdown
## ⚡ Performance Analysis

**Database Operations:**
- [ ] Queries optimized
- [ ] Indexes appropriate
- [ ] N+1 queries avoided
- [ ] Batch operations used

**API Efficiency:**
- [ ] Response times acceptable
- [ ] Pagination implemented
- [ ] Caching considered
- [ ] Rate limiting present

**Frontend Performance:**
- [ ] Bundle size impact
- [ ] Lazy loading used
- [ ] Memoization appropriate
- [ ] No memory leaks

**Scalability:**
- [ ] Handles high load
- [ ] No bottlenecks
- [ ] Resource usage reasonable
- [ ] Concurrent requests safe

**Metrics:**
- Estimated response time: [ms]
- Database queries: [count]
- Bundle size change: [KB]

**Performance Impact:** [Positive/Neutral/Negative]
```

---

## 🤖 Automated Review Workflows

### Setting Up Automated Reviews

#### GitHub Actions PR Review

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Get PR diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > pr-diff.txt
      
      - name: AI Review
        uses: anthropic/claude-code-review@v1
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          diff-file: pr-diff.txt
          review-template: .github/review-template.md
      
      - name: Post Comment
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review-output.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

### Pre-Review Checklist Generator

```typescript
// scripts/generate-review-checklist.ts
import { Anthropic } from '@anthropic-ai/sdk';

async function generateReviewChecklist(prData: PRData): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const prompt = `
Generate a review checklist for this PR:

Title: ${prData.title}
Description: ${prData.description}
Files Changed: ${prData.files.join(', ')}
Lines Changed: ${prData.additions + prData.deletions}

Create a checklist covering:
1. Security considerations
2. Performance implications
3. Testing requirements
4. Documentation needs
5. Breaking changes
6. Deployment considerations

Format as markdown checklist.
  `;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: prompt
    }]
  });

  return message.content[0].text;
}

// Usage
const prChecklist = await generateReviewChecklist({
  title: 'Add user authentication',
  description: 'Implements JWT-based authentication',
  files: ['src/auth/*', 'src/middleware/*'],
  additions: 450,
  deletions: 20
});

console.log(prChecklist);
```

---

## ✅ Best Practices

### Do's ✅

**Review Process:**
- ✅ Start with understanding the PR's purpose
- ✅ Focus on critical issues first (security, bugs, data loss)
- ✅ Provide specific, actionable feedback
- ✅ Include code examples for suggestions
- ✅ Acknowledge good practices in the PR
- ✅ Complete reviews within 24 hours
- ✅ Use AI to understand unfamiliar code quickly

**Feedback Quality:**
- ✅ Explain why something is a problem
- ✅ Suggest concrete improvements
- ✅ Link to documentation or examples
- ✅ Differentiate between blocking and non-blocking issues
- ✅ Be respectful and constructive
- ✅ Ask questions when unclear

**Efficiency:**
- ✅ Use review templates for consistency
- ✅ Leverage AI for comprehensive analysis
- ✅ Batch similar comments
- ✅ Focus on what matters most
- ✅ Automate repetitive checks

### Don'ts ❌

**Review Process:**
- ❌ Don't approve without actually reviewing
- ❌ Don't block on stylistic preferences
- ❌ Don't rewrite the entire PR
- ❌ Don't review while distracted
- ❌ Don't ignore test coverage
- ❌ Don't skip security considerations

**Feedback Quality:**
- ❌ Don't be vague ("this is bad")
- ❌ Don't be condescending
- ❌ Don't demand your way without explanation
- ❌ Don't ignore context
- ❌ Don't focus only on negatives
- ❌ Don't make it personal

**Efficiency:**
- ❌ Don't leave PRs sitting for days
- ❌ Don't review everything with same depth
- ❌ Don't nitpick formatting (use linters)
- ❌ Don't review in one massive comment
- ❌ Don't forget to consider the author's experience level

---

## 🏋️ Exercises

### Exercise 1: Review a Small PR

**Difficulty:** Beginner  
**Time:** 15 minutes

**Task:**
1. Find a small open-source PR (< 200 lines)
2. Use AI to review for bugs and issues
3. Write a constructive review comment
4. Compare with actual reviews on the PR

**Deliverable:** Review comment document

### Exercise 2: Security-Focused Review

**Difficulty:** Intermediate  
**Time:** 30 minutes

**Task:**
1. Review authentication/authorization PR
2. Use security review template
3. Identify all security issues
4. Suggest secure alternatives

**Deliverable:** Security review report

### Exercise 3: Create Review Automation

**Difficulty:** Advanced  
**Time:** 60 minutes

**Task:**
1. Set up automated PR review workflow
2. Create custom review templates
3. Test on sample PRs
4. Refine based on results

**Deliverable:** Working automated review system

### Exercise 4: Large PR Analysis

**Difficulty:** Advanced  
**Time:** 45 minutes

**Task:**
1. Review a large PR (> 1000 lines)
2. Break down into reviewable chunks
3. Identify integration issues
4. Provide structured feedback

**Deliverable:** Comprehensive review document

---

## 🎓 Real-World Scenarios

### Scenario 1: Emergency Security Fix Review

**Context:** Critical security patch needs immediate review.

**Approach:**
```markdown
1. Focus exclusively on security (5 min)
   - Verify fix addresses vulnerability
   - Check for new vulnerabilities
   - Validate input sanitization

2. Quick integration check (2 min)
   - Breaking changes?
   - Deployment considerations?

3. Fast-track approval or concerns (1 min)

Total: 8 minutes for critical path
```

### Scenario 2: Junior Developer's First PR

**Context:** First PR from new team member.

**Approach:**
```markdown
1. Be extra encouraging
2. Explain "why" behind every suggestion
3. Link to documentation
4. Offer to pair on fixes
5. Highlight what they did well
6. Use as teaching opportunity

Review comment should be:
- Educational
- Supportive
- Clear
- Encouraging
```

### Scenario 3: Architectural Change Review

**Context:** PR proposes significant architectural refactoring.

**Approach:**
```markdown
1. Understand the motivation (Why change?)
2. Evaluate alternatives (Other approaches?)
3. Assess impact (What breaks? Migration path?)
4. Consider team implications (Learning curve?)
5. Long-term maintainability

May require:
- Design discussion meeting
- Architecture decision record
- Phased rollout plan
```

---

## 📊 Review Metrics

### Measuring Review Quality

```typescript
interface ReviewMetrics {
  timeToReview: number;           // hours
  issuesFound: {
    critical: number;
    important: number;
    minor: number;
  };
  commentQuality: {
    hasExplanation: boolean;
    hasSuggestions: boolean;
    hasCodeExamples: boolean;
  };
  coverage: {
    securityChecked: boolean;
    performanceChecked: boolean;
    testsReviewed: boolean;
  };
}

// Good review metrics
const goodReview: ReviewMetrics = {
  timeToReview: 0.25,  // 15 minutes
  issuesFound: {
    critical: 1,
    important: 3,
    minor: 5
  },
  commentQuality: {
    hasExplanation: true,
    hasSuggestions: true,
    hasCodeExamples: true
  },
  coverage: {
    securityChecked: true,
    performanceChecked: true,
    testsReviewed: true
  }
};
```

---

## 🎯 Key Takeaways

1. **Speed AND Quality:** AI enables fast, thorough reviews

2. **Constructive Feedback:** Always explain and suggest, never just criticize

3. **Prioritize Issues:** Critical bugs before style nitpicks

4. **Context Matters:** Understand the PR's purpose before reviewing

5. **Be Consistent:** Use templates and checklists

6. **Automate Repetitive Checks:** Let AI handle common patterns

7. **Teach, Don't Just Correct:** Reviews are learning opportunities

8. **Act Quickly:** Don't let PRs sit – momentum matters

9. **Security First:** Always check for security implications

10. **Test Coverage:** Ensure changes are well-tested

---

## ✅ Mastery Checklist

- [ ] Review PRs in under 15 minutes with comprehensive feedback
- [ ] Identify security issues, bugs, and performance problems
- [ ] Provide constructive, actionable feedback with examples
- [ ] Use review templates for consistency
- [ ] Understand code changes without prior context
- [ ] Create automated review workflows
- [ ] Balance speed with thoroughness
- [ ] Adapt review depth to PR size and risk
- [ ] Mentor junior developers through reviews
- [ ] Maintain team code quality standards

---

**Next:** [Feature Development →](./07-feature-development.md)

---

*"Code review is not about finding mistakes. It's about sharing knowledge and improving quality together."*

*Master PR reviews, accelerate your team, ship better code.*
