# Level 2 Assessment

## Intermediate Engineering Skills Evaluation

---

## 🎯 Assessment Overview

This assessment validates your intermediate AI-assisted development capabilities across 9 core competency areas. Complete all sections to demonstrate mastery before advancing to Level 3.

**Time Required:** 3-4 hours  
**Passing Score:** 80% or higher  
**Format:** Practical exercises + conceptual questions

---

## 📊 Competency Areas

### 1. Repository Workflows (10 points)
### 2. Multi-File Changes (10 points)
### 3. Architectural Analysis (10 points)
### 4. Git Integration (10 points)
### 5. PR Review Workflows (10 points)
### 6. Feature Development (15 points)
### 7. Test Strategy (10 points)
### 8. API Development (10 points)
### 9. Context & Prompting (15 points)

**Total:** 100 points  
**Pass:** ≥80 points

---

## 🔧 Part 1: Repository Workflows (10 points)

### Question 1.1 (5 points)
Given an unfamiliar codebase, describe your step-by-step approach using Claude to understand its architecture.

**Required in answer:**
- Initial exploration strategy
- What to analyze first
- How to map dependencies
- How to identify key components

**Scoring:**
- Systematic approach: 2 pts
- Correct prioritization: 2 pts
- Dependency mapping: 1 pt

### Question 1.2 (5 points)
You need to trace how data flows from API request to database and back. Outline your methodology.

**Provide:**
- Specific files to examine
- Order of analysis
- How to document findings

**Scoring:**
- Correct entry point: 1 pt
- Proper flow tracing: 2 pts
- Documentation approach: 2 pts

---

## 🔄 Part 2: Multi-File Changes (10 points)

### Practical Exercise 2.1 (10 points)

**Scenario:**
Rename `UserModel` to `User` across your codebase.

**Affected Files:**
```
src/models/UserModel.ts
src/services/UserService.ts (3 references)
src/api/users.ts (5 references)
src/api/auth.ts (2 references)
__tests__/models/UserModel.test.ts (rename file + 8 references)
__tests__/services/UserService.test.ts (12 references)
```

**Task:**
Write the prompt you would use with Claude for this refactoring.

**Your Prompt:**
```
[Write your prompt here]
```

**Scoring:**
- Identifies all affected files: 3 pts
- Specifies rename strategy: 3 pts
- Includes test verification: 2 pts
- Handles imports/exports: 2 pts

---

## 🏗️ Part 3: Architectural Analysis (10 points)

### Question 3.1 (5 points)

**Code Snippet:**
```typescript
// Current implementation
class OrderController {
  async createOrder(req, res) {
    const { items, userId } = req.body;
    
    // Calculate total
    let total = 0;
    for (const item of items) {
      const product = await db.query('SELECT * FROM products WHERE id = ?', [item.id]);
      total += product.price * item.quantity;
    }
    
    // Apply discount
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (user.isPremium) {
      total *= 0.9;
    }
    
    // Save order
    const order = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, total, 'pending']
    );
    
    res.json(order);
  }
}
```

**Identify architectural issues and suggest improvements.**

**Scoring:**
- Identifies N+1 query: 1 pt
- Identifies mixed concerns: 1 pt
- Identifies lack of error handling: 1 pt
- Suggests service layer: 1 pt
- Suggests transaction: 1 pt

### Question 3.2 (5 points)

Propose a better architecture for the above code using:
- Controllers
- Services
- Repositories
- Models

**Scoring:**
- Proper layer separation: 2 pts
- Service layer design: 2 pts
- Repository pattern: 1 pt

---

## 🔀 Part 4: Git Integration (10 points)

### Practical Exercise 4.1 (10 points)

**Scenario:**
You've completed a feature. Create the prompt for Claude to help you commit it properly.

**Feature Changes:**
- Added 3 new files
- Modified 2 existing files
- All tests passing

**Task:**
Write the prompt to generate an appropriate commit message.

**Your Prompt:**
```
[Write your prompt here]
```

**Required Elements:**
- Review changes
- Follow conventional commits
- Include co-author tag
- Descriptive message

**Scoring:**
- Asks for change review: 2 pts
- Specifies commit format: 3 pts
- Includes context: 2 pts
- Co-author attribution: 2 pts
- Checks test status: 1 pt

---

## ✅ Part 5: PR Review Workflows (10 points)

### Question 5.1 (10 points)

**Given this PR diff, create a comprehensive review prompt:**

```diff
diff --git a/src/auth.ts b/src/auth.ts
+ async function login(email: string, password: string) {
+   const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
+   if (user && user.password === password) {
+     return { token: generateToken(user.id) };
+   }
+   throw new Error('Login failed');
+ }
```

**Write the prompt you'd use for Claude to review this PR.**

**Your Prompt:**
```
[Write your prompt here]
```

**Scoring:**
- Identifies SQL injection: 3 pts
- Identifies plain text password: 3 pts
- Identifies generic error message: 2 pts
- Requests security review: 2 pts

---

## 🎨 Part 6: Feature Development (15 points)

### Practical Exercise 6.1 (15 points)

**Task:**
Create a structured prompt for building a "password reset" feature.

**Requirements:**
- Forgot password endpoint (email)
- Reset password endpoint (token + new password)
- Token expiration (1 hour)
- Email with reset link
- Security best practices

**Your Prompt:**
```
[Write comprehensive feature development prompt]
```

**Scoring:**
- Context provided: 2 pts
- Requirements clear: 3 pts
- Security considerations: 3 pts
- Deliverables specified: 2 pts
- Success criteria defined: 2 pts
- Format specified: 2 pts
- Includes validation: 1 pt

---

## 🧪 Part 7: Test Strategy (10 points)

### Question 7.1 (5 points)

**For a function that validates credit card numbers, list all test cases needed.**

**Function:**
```typescript
function validateCreditCard(number: string): {
  valid: boolean;
  type: 'visa' | 'mastercard' | 'amex' | 'unknown';
  errors: string[];
}
```

**Your Test Cases:**
```
[List test cases here]
```

**Required Coverage:**
- Valid cards (each type)
- Invalid format
- Invalid checksum
- Edge cases
- Error messages

**Scoring:**
- Happy path (all card types): 1 pt
- Invalid formats: 1 pt
- Luhn algorithm validation: 1 pt
- Edge cases (null, empty, spaces): 1 pt
- Error message validation: 1 pt

### Question 7.2 (5 points)

**Create a prompt to generate the above test suite.**

**Your Prompt:**
```
[Write prompt here]
```

**Scoring:**
- Specifies test framework: 1 pt
- Lists all scenarios: 2 pts
- Requests descriptive names: 1 pt
- Includes edge cases: 1 pt

---

## 🌐 Part 8: API Development (10 points)

### Practical Exercise 8.1 (10 points)

**Task:**
Write a prompt to create a RESTful endpoint: `GET /api/products`

**Requirements:**
- Pagination (page, limit)
- Filtering (category, minPrice, maxPrice)
- Sorting (name, price, createdAt)
- Response format: `{ data: Product[], total: number, page: number, pages: number }`

**Your Prompt:**
```
[Write API endpoint creation prompt]
```

**Scoring:**
- Endpoint specification: 2 pts
- Query parameters: 2 pts
- Response format: 2 pts
- Validation requirements: 2 pts
- Error handling: 2 pts

---

## 📝 Part 9: Context & Prompting (15 points)

### Question 9.1: Context Optimization (5 points)

**Scenario:**
500-file project, need to add logging to all API endpoints.

**How do you minimize context usage?**

**Your Answer:**
```
[Describe your approach]
```

**Scoring:**
- Identifies pattern: 1 pt
- Selective file loading: 2 pts
- Incremental approach: 1 pt
- Token awareness: 1 pt

### Question 9.2: Structured Prompting (5 points)

**Convert this vague request into a structured prompt:**

*"Add caching to the app"*

**Your Structured Prompt:**
```
[Write full structured prompt]
```

**Scoring:**
- Context section: 1 pt
- Specific requirements: 2 pts
- Technical constraints: 1 pt
- Success criteria: 1 pt

### Question 9.3: Reusable Prompts (5 points)

**Create a reusable template for "Add input validation to endpoint"**

**Your Template:**
```markdown
[Write reusable prompt template with placeholders]
```

**Scoring:**
- Clear placeholders: 2 pts
- Reusability: 1 pt
- Examples included: 1 pt
- Documentation: 1 pt

---

## 🏆 Bonus Questions (+10 points max)

### Bonus 1: Advanced Git (5 points)

**Scenario:**
Your feature branch is 20 commits behind main with conflicts in 5 files.

**Create a prompt for Claude to help resolve this safely.**

**Your Prompt:**
```
[Write prompt]
```

### Bonus 2: Performance Optimization (5 points)

**Given a slow API endpoint, write a diagnostic prompt.**

**Endpoint:**
`GET /api/analytics/dashboard` (takes 8 seconds)

**Your Diagnostic Prompt:**
```
[Write prompt to identify and fix performance issues]
```

---

## 📊 Scoring Rubric

### Grading Scale

**90-100 points:** Excellent - Advanced to Level 3  
**80-89 points:** Good - Passed, ready for Level 3  
**70-79 points:** Fair - Review weak areas, retake  
**Below 70:** Needs improvement - Review material, practice exercises

### Competency Requirements

To pass, you must score:
- ≥7/10 in Repository & Multi-File Changes
- ≥7/10 in Git & PR Review
- ≥12/15 in Feature Development
- ≥8/10 in Testing
- ≥12/15 in Context & Prompting

---

## ✅ Self-Check Questions

Before submitting, ensure you can answer "yes" to:

**Repository Workflows:**
- [ ] I can analyze an unfamiliar codebase systematically
- [ ] I can trace data flows through multiple files
- [ ] I can identify architectural patterns

**Multi-File & Git:**
- [ ] I can coordinate changes across multiple files
- [ ] I can write proper commit messages
- [ ] I can handle merge conflicts

**Testing & Quality:**
- [ ] I can design comprehensive test strategies
- [ ] I can identify test coverage gaps
- [ ] I can write test cases for edge scenarios

**API Development:**
- [ ] I can create RESTful endpoints
- [ ] I can design proper error handling
- [ ] I can implement pagination and filtering

**Context & Prompting:**
- [ ] I can optimize context for large codebases
- [ ] I can write structured prompts
- [ ] I can create reusable prompt templates
- [ ] I understand AI pair programming

---

## 📝 Submission Format

### Required Deliverables

1. **Written Answers:**
   - All questions answered
   - Prompts written clearly
   - Explanations provided

2. **Practical Code:**
   - Exercise solutions
   - Test results
   - Git commit examples

3. **Self-Assessment:**
   - Score calculation
   - Competency ratings
   - Areas for improvement

---

## 🎓 Next Steps

### If You Pass (≥80 points):

✅ **Congratulations!** You've demonstrated intermediate AI-assisted development skills.

**Ready for Level 3:** Advanced Engineering
- MCP and tool integrations
- Sub-agents and orchestration
- Autonomous workflows
- Advanced Claude Code features

**Recommended:**
- Complete any weak areas
- Practice exercises in low-scoring sections
- Build the capstone project

### If You Need Improvement (<80 points):

**Review these sections based on your scores:**
- <7 pts: Repository/Multi-File → Re-read sections 2-3
- <7 pts: Git/PR Review → Re-read sections 5-6
- <12 pts: Feature Development → Re-read section 7
- <8 pts: Testing → Re-read section 8
- <12 pts: Context/Prompting → Re-read sections 13-16

**Then:**
1. Complete recommended exercises
2. Practice with real projects
3. Retake assessment

---

## 🏆 Certification

Upon passing (≥80 points), you've achieved:

**Level 2: Intermediate Engineering with AI**

**Validated Skills:**
✓ Repository analysis and navigation  
✓ Multi-file refactoring  
✓ Git workflow automation  
✓ PR review with AI assistance  
✓ Feature development end-to-end  
✓ Test strategy design  
✓ API development  
✓ Context optimization  
✓ Structured prompting  

**You are now qualified to:**
- Lead AI-assisted development efforts
- Mentor junior developers
- Establish team best practices
- Design AI-assisted workflows

---

**Continue to:** [Level 3 - Advanced Engineering →](../03-level-3-advanced/01-overview.md)

---

*Complete this assessment honestly. Your growth depends on accurate self-evaluation.*
