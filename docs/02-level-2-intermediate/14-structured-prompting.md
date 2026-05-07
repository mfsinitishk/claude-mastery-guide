# Structured Prompting

## Engineering Prompts for Consistent, High-Quality Results

---

## 🎯 Overview

Structured prompting applies software engineering principles to prompt design: clear specifications, reusable templates, validation criteria, and predictable outputs. Move beyond ad-hoc requests to systematic prompt engineering that delivers consistent, production-quality results.

**Time to Master:** 3-4 hours  
**Outcome:** Design prompts that reliably produce exactly what you need

---

## 💡 Why Structure Matters

### Unstructured vs. Structured

**❌ Unstructured:**
```
Make this code better
```
- Vague intent
- Unpredictable results
- Hard to iterate
- Not reusable

**✅ Structured:**
```
Refactor this authentication code to improve:

Current issues:
- Mixed concerns (validation + business logic)
- No error handling
- Tightly coupled to database

Goals:
- Separate validation layer
- Add comprehensive error handling
- Use dependency injection

Constraints:
- Keep existing API contract
- Maintain backward compatibility
- Don't change database schema

Success criteria:
- All tests pass
- Code coverage ≥ 80%
- No linter errors
```
- Clear intent
- Predictable output
- Iteratable
- Reusable pattern

---

## 🔧 Core Structure Elements

### 1. Context Setting

**Provide necessary background:**

```
{ROLE}
You are a {expertise level} {role}.

{PROJECT CONTEXT}
Project: {project name and description}
Tech stack: {technologies}
Architecture: {architectural pattern}
Current phase: {development stage}

{SPECIFIC CONTEXT}
Working on: {feature/component}
Previous work: {what's been done}
Current state: {what exists now}
```

**Example:**
```
You are a senior backend engineer.

Project: E-commerce API (Node.js/TypeScript/PostgreSQL)
Architecture: Layered (API → Service → Repository → Database)
Current phase: Adding payment processing

Working on: Stripe integration
Previous work: Order management complete
Current state: Order model exists, needs payment flow
```

### 2. Task Definition

**Specify exactly what to do:**

```
{PRIMARY GOAL}
[One clear sentence describing the main task]

{SUB-TASKS}
1. {specific sub-task}
2. {specific sub-task}
3. {specific sub-task}

{DELIVERABLES}
- {expected output 1}
- {expected output 2}
- {expected output 3}
```

**Example:**
```
PRIMARY GOAL:
Implement Stripe payment processing for orders

SUB-TASKS:
1. Create PaymentService with charge/refund methods
2. Add payment webhook endpoint
3. Update Order model with payment status
4. Add payment failure handling

DELIVERABLES:
- src/services/PaymentService.ts
- src/api/webhooks/stripe.ts
- Updated src/models/Order.ts
- Tests for all payment flows
```

### 3. Constraints and Requirements

**Define boundaries:**

```
{MUST HAVE}
- {non-negotiable requirement}
- {non-negotiable requirement}

{MUST NOT}
- {prohibited approach}
- {prohibited approach}

{SHOULD HAVE}
- {preferred but not required}

{TECHNICAL CONSTRAINTS}
- {technical limitation}
- {compatibility requirement}
```

**Example:**
```
MUST HAVE:
- Idempotent payment operations
- Retry logic with exponential backoff
- Comprehensive error handling
- Webhook signature verification

MUST NOT:
- Store full credit card numbers
- Make synchronous payment calls in request handlers
- Expose Stripe API keys in logs

SHOULD HAVE:
- Payment status notifications
- Admin dashboard integration

TECHNICAL CONSTRAINTS:
- Use existing Stripe SDK v10+
- Compatible with PostgreSQL transactions
- Must work with current error handling middleware
```

### 4. Format Specification

**Define output structure:**

```
{OUTPUT FORMAT}
Language: {programming language}
Style: {code style guide}
Structure: {file/class structure}

{CODE REQUIREMENTS}
- {requirement 1}
- {requirement 2}

{DOCUMENTATION}
- {doc requirement 1}
- {doc requirement 2}
```

**Example:**
```
OUTPUT FORMAT:
Language: TypeScript
Style: Airbnb ESLint config
Structure: Service class with dependency injection

CODE REQUIREMENTS:
- Type all parameters and returns
- Use async/await (no callbacks)
- JSDoc comments for public methods
- Handle all error cases explicitly

DOCUMENTATION:
- Method-level JSDoc with @param and @returns
- Inline comments for complex logic
- Example usage in comment block
```

### 5. Success Criteria

**Define what "done" looks like:**

```
{VALIDATION CRITERIA}
✓ {criterion 1}
✓ {criterion 2}
✓ {criterion 3}

{TEST REQUIREMENTS}
✓ {test requirement 1}
✓ {test requirement 2}

{QUALITY GATES}
✓ {quality check 1}
✓ {quality check 2}
```

**Example:**
```
VALIDATION CRITERIA:
✓ Payment successfully processed on Stripe test account
✓ Webhooks update order status correctly
✓ Failed payments are retried 3 times
✓ All error cases return appropriate error codes

TEST REQUIREMENTS:
✓ Unit tests for PaymentService (all methods)
✓ Integration tests with Stripe test mode
✓ Webhook signature validation tests
✓ Error scenario tests (network failures, declined cards)

QUALITY GATES:
✓ All tests pass
✓ Code coverage ≥ 85%
✓ No TypeScript errors
✓ No ESLint warnings
✓ Successfully processes test payment end-to-end
```

---

## 📋 Prompt Templates

### Template 1: Feature Implementation

```
CONTEXT:
Project: {project name}
Tech stack: {stack}
Current state: {what exists}

TASK:
Implement {feature name}

REQUIREMENTS:
Functional:
- {requirement 1}
- {requirement 2}

Non-functional:
- {requirement 1}
- {requirement 2}

CONSTRAINTS:
- {constraint 1}
- {constraint 2}

DELIVERABLES:
- {file 1}
- {file 2}
- {file 3}

SUCCESS CRITERIA:
✓ {criterion 1}
✓ {criterion 2}

OUTPUT FORMAT:
{format specification}
```

**Example Usage:**
```
CONTEXT:
Project: Task Management API
Tech stack: Express.js, TypeScript, MongoDB
Current state: User authentication and basic task CRUD exist

TASK:
Implement task assignment and collaboration features

REQUIREMENTS:
Functional:
- Users can assign tasks to other users
- Users can add collaborators to tasks
- Collaborators can comment on tasks
- Task owner can remove collaborators
- Email notifications for assignments

Non-functional:
- Real-time updates for collaborators
- Permissions: only owner and collaborators can access task
- Audit log for all task changes

CONSTRAINTS:
- Use existing User and Task models (extend, don't replace)
- WebSocket for real-time updates
- Compatible with existing authentication middleware

DELIVERABLES:
- Updated Task model with collaborators field
- TaskCollaborationService
- WebSocket event handlers
- Email notification templates
- Tests

SUCCESS CRITERIA:
✓ Task can be assigned to user
✓ Collaborators receive real-time updates
✓ Notifications sent on assignment
✓ Permissions enforce access control
✓ All collaboration events logged

OUTPUT FORMAT:
TypeScript with JSDoc, async/await, dependency injection
```

### Template 2: Code Refactoring

```
TARGET:
File: {file path}
Function/Class: {name}
Lines: {line range}

CURRENT ISSUES:
- {issue 1}
- {issue 2}

REFACTORING GOALS:
- {goal 1}
- {goal 2}

CONSTRAINTS:
- {constraint 1}
- {constraint 2}

APPROACH:
1. {step 1}
2. {step 2}

VALIDATION:
- Tests must pass
- {other validation}
```

**Example Usage:**
```
TARGET:
File: src/services/OrderService.ts
Function: calculateOrderTotal
Lines: 145-230

CURRENT ISSUES:
- 85 lines (too long)
- Multiple responsibilities (calc tax, shipping, discounts, totals)
- Nested conditionals (4 levels deep)
- Duplicated discount calculation logic
- No test coverage for edge cases

REFACTORING GOALS:
- Extract sub-calculations into separate methods
- Reduce cyclomatic complexity (currently 15, target <7)
- Make testable (pure functions where possible)
- Improve readability

CONSTRAINTS:
- Keep existing function signature (public API)
- Maintain backward compatibility
- Don't change calculation logic (preserve current behavior)
- Must work with existing discount system

APPROACH:
1. Extract tax calculation → calculateTax()
2. Extract shipping calculation → calculateShipping()
3. Extract discount calculation → applyDiscounts()
4. Simplify conditionals using early returns
5. Add unit tests for each extracted function
6. Integration test for calculateOrderTotal

VALIDATION:
- All existing tests pass
- New unit tests cover all sub-methods
- Code coverage ≥ 90% for this module
- Linter passes
- Calculation results identical to before
```

### Template 3: Bug Fix

```
BUG DESCRIPTION:
{what's broken}

REPRODUCTION:
Steps:
1. {step 1}
2. {step 2}

Expected: {expected behavior}
Actual: {actual behavior}

CONTEXT:
Affected file(s): {files}
Recent changes: {what changed}
Environment: {environment details}

INVESTIGATION:
- Check {location 1}
- Verify {aspect 1}
- Test {scenario 1}

FIX REQUIREMENTS:
- {requirement 1}
- {requirement 2}

VALIDATION:
- {how to verify fix}
- {regression test}
```

**Example Usage:**
```
BUG DESCRIPTION:
Users can't update their email address - API returns 500 error

REPRODUCTION:
Steps:
1. Log in as existing user
2. Navigate to profile settings
3. Change email to new address
4. Click "Save"

Expected: Email updated, success message displayed
Actual: 500 Internal Server Error

CONTEXT:
Affected file(s): src/api/profile.ts, src/services/UserService.ts
Recent changes: Added email uniqueness validation last week
Environment: Production (PostgreSQL 14, Node 20)
Error log: "TypeError: Cannot read property 'toLowerCase' of undefined"

INVESTIGATION:
- Check email validation logic in UserService
- Verify database query for email uniqueness check
- Test with null/undefined email values
- Review recent commits affecting email handling

FIX REQUIREMENTS:
- Handle null/undefined email gracefully
- Preserve email uniqueness validation
- Add comprehensive error handling
- Return user-friendly error messages

VALIDATION:
- Update email successfully with valid new email
- Handle duplicate email with 409 error
- Handle invalid email format with 400 error
- Handle null/undefined without 500 error
- Add regression test for this scenario
```

### Template 4: Test Generation

```
TEST TARGET:
Component: {what to test}
File: {file path}

COVERAGE REQUIREMENTS:
- {scenario 1}
- {scenario 2}

TEST CASES:
Happy Path:
- {case 1}
- {case 2}

Edge Cases:
- {case 1}
- {case 2}

Error Cases:
- {case 1}
- {case 2}

TEST FRAMEWORK:
{framework and tools}

ASSERTIONS:
{what to assert}
```

**Example Usage:**
```
TEST TARGET:
Component: PasswordValidator class
File: src/utils/PasswordValidator.ts

COVERAGE REQUIREMENTS:
- All public methods
- All validation rules
- All error paths

TEST CASES:
Happy Path:
- Valid strong password (8+ chars, uppercase, lowercase, number, special)
- Valid password at minimum length (exactly 8 chars)

Edge Cases:
- Password exactly 8 characters (boundary)
- Password with unicode characters
- Very long password (100+ characters)
- Empty string
- null/undefined input
- Whitespace only

Error Cases:
- Too short (< 8 chars)
- Missing uppercase
- Missing lowercase
- Missing number
- Missing special character
- Common password (password123, admin, etc.)

TEST FRAMEWORK:
Jest with TypeScript

ASSERTIONS:
- validate() returns expected {isValid: boolean, errors: string[]}
- Specific error messages for each violated rule
- No false positives
- Performance <10ms per validation
```

---

## 🎯 Advanced Patterns

### Pattern: Chain-of-Thought Prompting

**Guide Claude through reasoning:**

```
Task: Optimize this database query

Think through this step-by-step:

1. Analysis
   - What is the current query doing?
   - What indexes exist?
   - What's the execution plan?

2. Identify bottlenecks
   - Where are the performance issues?
   - What's causing the slowdown?

3. Solution options
   - Option A: {approach 1}
   - Option B: {approach 2}
   - Compare tradeoffs

4. Recommendation
   - Which option is best and why?
   - What's the expected improvement?

5. Implementation
   - Show the optimized query
   - Explain changes

Show your reasoning at each step.
```

### Pattern: Few-Shot Learning

**Provide examples of desired output:**

```
Generate API endpoint handlers following this pattern:

Example 1 - GET endpoint:
```typescript
/**
 * Get user by ID
 * GET /api/users/:id
 */
router.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUser(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

Example 2 - POST endpoint:
```typescript
/**
 * Create new user
 * POST /api/users
 */
router.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate
    const validation = validateUser(userData);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

Now generate endpoints for:
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Follow the same pattern.
```

### Pattern: Constraint-Based Generation

**Define strict boundaries:**

```
Generate React component with these constraints:

MUST use:
✓ Functional component (no class)
✓ TypeScript with explicit prop types
✓ React hooks (useState, useEffect)
✓ Tailwind CSS for styling

MUST NOT use:
✗ External state management (Redux, MobX)
✗ Class-based components
✗ Inline styles
✗ any type

MUST include:
✓ PropTypes validation
✓ Loading state
✓ Error handling
✓ Accessibility attributes

FORMATTING:
✓ 2-space indentation
✓ Single quotes
✓ Semicolons
✓ Max line length 80
```

---

## ✅ Best Practices

### DO:
✅ Be specific and explicit  
✅ Provide context upfront  
✅ Define success criteria  
✅ Include examples  
✅ Specify format requirements  
✅ List constraints clearly  
✅ Break complex tasks into steps  
✅ Validate outputs  

### DON'T:
❌ Use vague language  
❌ Assume context  
❌ Leave success criteria ambiguous  
❌ Skip format specification  
❌ Ignore constraints  
❌ Combine unrelated tasks  
❌ Accept first output without review  

---

## 🚀 Pro Tips

### Tip 1: Version Your Prompts

Track prompts like code:
```
v1: "Make the code better"
→ Too vague

v2: "Refactor for readability"
→ Better, but incomplete

v3: "Refactor for readability: extract methods, improve names, add comments"
→ Specific and actionable

v4: [Full structured prompt with context, goals, constraints]
→ Production-ready
```

### Tip 2: Build a Prompt Library

Collect reusable templates:
```
/prompts
  /refactoring
    - extract-method.md
    - reduce-complexity.md
    - improve-naming.md
  /testing
    - unit-test-generation.md
    - integration-test-generation.md
  /features
    - api-endpoint.md
    - react-component.md
```

### Tip 3: Iterate and Refine

```
Iteration 1: Get basic output
Iteration 2: Add constraints for quality
Iteration 3: Add format requirements
Iteration 4: Add validation criteria
Iteration 5: Template for reuse
```

---

## 🎓 Practice Exercise

Transform this vague prompt into a structured one:

**Vague:**
```
Add authentication to the API
```

**Your task:**
Create a fully structured prompt including:
- Context
- Task definition
- Requirements
- Constraints
- Deliverables
- Success criteria
- Output format

---

**Next:** [Reusable Prompts →](./15-reusable-prompts.md)
