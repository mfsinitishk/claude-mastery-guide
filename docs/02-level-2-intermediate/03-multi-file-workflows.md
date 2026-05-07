# Multi-File Workflows

## Coordinating Changes Across Multiple Files with Claude

---

## 🎯 Learning Objectives

By the end of this section, you will be able to:

- ✅ Plan and execute coordinated changes across 5+ files simultaneously
- ✅ Maintain consistency across related components
- ✅ Analyze impact of changes across the entire codebase
- ✅ Refactor safely at repository scale
- ✅ Manage complex dependencies during multi-file changes
- ✅ Validate integration between modified files
- ✅ Use AI assistance to track and coordinate complex changes

---

## 📖 Understanding Multi-File Workflows

### The Multi-File Challenge

**Single-File Changes:**
- Isolated impact
- Easy to validate
- Simple to review
- Low risk

**Multi-File Changes:**
- Coordinated impact across components
- Complex validation requirements
- Challenging to review comprehensively
- Higher risk of integration issues
- Must maintain consistency

### Why Multi-File Workflows Are Critical

Most real-world features require changes across multiple files:

**Example: Adding User Profile Picture Feature**

Files to modify:
1. `src/models/User.ts` - Add profilePictureUrl field
2. `src/api/users.ts` - Add upload endpoint
3. `src/services/uploadService.ts` - Handle file upload
4. `src/components/ProfilePicture.tsx` - Display component
5. `src/components/ProfileEditor.tsx` - Upload UI
6. `tests/api/users.test.ts` - API tests
7. `tests/components/ProfilePicture.test.tsx` - Component tests
8. `database/migrations/add_profile_picture.sql` - DB migration

That's 8 files that must work together perfectly!

---

## 🎯 Planning Multi-File Changes

### Phase 1: Change Impact Analysis

Before making any changes, understand the full scope.

#### Prompt Template: Impact Analysis

```
I need to make this change: [describe change]

Current repository structure:
[paste relevant tree output]

Analyze the complete impact:
1. Which files definitely need modification?
2. Which files might be affected indirectly?
3. What's the dependency chain?
4. What tests need to be added/updated?
5. What documentation needs updating?
6. Are there any database schema changes?

Provide a comprehensive change checklist.
```

#### Example: Adding Authentication to API

```
I need to add JWT authentication to our REST API.

Current structure:
```
src/
├── api/
│   ├── users.ts
│   ├── orders.ts
│   ├── products.ts
├── middleware/
│   └── errorHandler.ts
├── models/
│   └── User.ts
├── services/
│   └── database.ts
└── index.ts
```

What files need to be modified? What new files are needed?
Provide a complete implementation plan.
```

**Expected Response Structure:**
```markdown
## Files to Create:
1. src/middleware/authMiddleware.ts
2. src/services/authService.ts
3. src/utils/jwtHelper.ts
4. tests/middleware/authMiddleware.test.ts
5. tests/services/authService.test.ts

## Files to Modify:
1. src/api/*.ts (all endpoints need auth middleware)
2. src/models/User.ts (add password, refreshToken fields)
3. src/index.ts (register auth routes)
4. package.json (add jwt dependencies)
5. .env.example (add JWT_SECRET)

## Testing Impact:
1. Update all API tests to include auth tokens
2. Add auth-specific test suite
3. Update integration tests

## Documentation Impact:
1. Update API documentation with auth requirements
2. Add auth setup guide
3. Update README with JWT configuration
```

### Phase 2: Creating Implementation Plan

#### Prompt Template: Multi-File Implementation Plan

```
Create a step-by-step implementation plan for:
[describe feature/change]

Files involved:
[list files from impact analysis]

For each step, specify:
1. Which file(s) to modify
2. What changes to make
3. Dependencies on other steps
4. How to test the change
5. Potential issues to watch for

Order steps to minimize integration problems.
```

#### Example Implementation Plan

```markdown
## Step-by-Step Plan: Add Authentication

### Step 1: Dependencies and Configuration
- Modify: package.json
- Add: jsonwebtoken, bcrypt
- Add: JWT_SECRET to .env
- Test: Verify dependencies install
- No dependencies

### Step 2: JWT Utilities
- Create: src/utils/jwtHelper.ts
- Functions: generateToken, verifyToken, refreshToken
- Test: Unit tests for token operations
- Depends on: Step 1

### Step 3: Auth Service
- Create: src/services/authService.ts
- Functions: login, register, validateToken
- Test: Service unit tests
- Depends on: Step 2

### Step 4: Auth Middleware
- Create: src/middleware/authMiddleware.ts
- Function: verifyAuthToken middleware
- Test: Middleware tests
- Depends on: Step 2, Step 3

### Step 5: User Model Updates
- Modify: src/models/User.ts
- Add: password, refreshToken fields
- Add: password hashing methods
- Test: Model tests
- Depends on: None (can run in parallel)

### Step 6: Auth Routes
- Create: src/api/auth.ts
- Routes: /login, /register, /refresh
- Test: Auth endpoint tests
- Depends on: Step 3, Step 4, Step 5

### Step 7: Protect Existing Routes
- Modify: All files in src/api/
- Add: authMiddleware to protected routes
- Test: Update all API tests
- Depends on: Step 4, Step 6

### Step 8: Integration Testing
- Create: tests/integration/auth.test.ts
- Test: Complete auth flow
- Depends on: All previous steps

### Step 9: Documentation
- Update: README.md, API docs
- Add: Auth setup guide
- Depends on: All previous steps
```

---

## 🔄 Executing Multi-File Changes

### Strategy 1: Layer-by-Layer Implementation

Implement changes in architectural layers to maintain testability.

**Order:**
1. Data models and types
2. Services and business logic
3. API endpoints and middleware
4. Frontend components
5. Tests for each layer
6. Integration tests

#### Example: Layer-by-Layer Prompt Pattern

```
Let's implement this feature layer by layer.

Layer 1 - Data Models:
Create the User model with these fields:
[specify fields]

Make sure it follows the pattern used in existing models:
[paste sample existing model]

Include proper TypeScript types and validation.
```

Then move to next layer:

```
Layer 2 - Service:
Now create the authService that uses the User model.

Required functions:
- register(email, password)
- login(email, password)
- validateToken(token)

Follow the pattern from this existing service:
[paste sample service]

Use the User model from the previous step.
```

### Strategy 2: Vertical Slice Implementation

Implement one complete feature slice before moving to the next.

**Example:** User Registration Flow

```
Implement complete user registration flow:

1. Backend: POST /api/auth/register endpoint
2. Service: User registration logic
3. Database: User creation
4. Frontend: Registration form component
5. Tests: Registration tests
6. Integration: End-to-end registration test

Provide code for all files needed for this slice.
```

#### Vertical Slice Prompt Template

```
Implement a complete vertical slice for: [feature]

Include:
1. Backend API endpoint
   - Route definition
   - Request validation
   - Business logic
   - Response formatting

2. Service layer
   - Core logic
   - Error handling
   - Data validation

3. Data layer
   - Database operations
   - Model updates if needed

4. Frontend (if applicable)
   - Component
   - API integration
   - State management

5. Tests
   - Unit tests for each layer
   - Integration test for complete flow

Maintain consistency with existing patterns:
[paste sample existing code]
```

---

## 🔍 Maintaining Consistency

### Consistency Checklist

When making multi-file changes, ensure:

**Naming Consistency:**
- [ ] Variable names follow existing conventions
- [ ] Function names match patterns
- [ ] File names consistent with structure
- [ ] Type/interface names aligned

**Pattern Consistency:**
- [ ] Error handling matches existing approach
- [ ] API response format consistent
- [ ] Validation patterns aligned
- [ ] Logging approach uniform

**Style Consistency:**
- [ ] Code formatting matches
- [ ] Comments follow convention
- [ ] Import organization consistent
- [ ] File structure aligned

#### Prompt Template: Consistency Check

```
I've made changes to these files:

File 1: [filename]
[paste relevant changed code]

File 2: [filename]
[paste relevant changed code]

File 3: [filename]
[paste relevant changed code]

Check consistency across these changes:
1. Do naming conventions match?
2. Are patterns consistent?
3. Is error handling uniform?
4. Do types align correctly?
5. Are there any inconsistencies?

Compare with existing code patterns:
[paste samples of existing code]
```

### Cross-File Type Safety

Ensure TypeScript types are consistent across files.

```
I have these type definitions across multiple files:

// src/types/user.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

// src/api/users.ts
interface UserResponse {
  user: User;
  token: string;
}

// src/components/UserProfile.tsx
type UserProfileProps = {
  user: User;
  onUpdate: (user: User) => void;
}

Verify:
1. Are these types consistent?
2. Should any be consolidated?
3. Are there missing fields?
4. Any type safety issues?

Suggest improvements for type consistency.
```

---

## 🧪 Testing Multi-File Changes

### Test Planning for Multi-File Features

#### Prompt Template: Test Strategy

```
I've implemented a feature across these files:
[list files with brief description]

Create a comprehensive test strategy:
1. Unit tests needed for each file
2. Integration tests for file interactions
3. E2E tests for complete feature
4. Edge cases to cover
5. Test data requirements

Provide specific test cases and structure.
```

#### Example Test Plan Output

```markdown
## Unit Tests

### src/services/authService.ts
- ✅ register() with valid data creates user
- ✅ register() with existing email throws error
- ✅ login() with valid credentials returns token
- ✅ login() with invalid credentials throws error
- ✅ validateToken() with valid token returns user
- ✅ validateToken() with expired token throws error

### src/middleware/authMiddleware.ts
- ✅ Allows requests with valid token
- ✅ Rejects requests without token
- ✅ Rejects requests with invalid token
- ✅ Adds user to request object

## Integration Tests

### Auth Flow
- ✅ Register → Login → Access Protected Route
- ✅ Register → Login → Token Refresh → Access Protected Route
- ✅ Login → Logout → Rejected Access

## E2E Tests

### Complete User Journey
- ✅ User registers → redirects to dashboard
- ✅ User logs in → sees personalized content
- ✅ User token expires → redirects to login
```

### Testing Changes Together

```
I've modified these three related functions across different files:

// File 1: src/services/orderService.ts
async function createOrder(orderData) {
  // implementation
}

// File 2: src/api/orders.ts
app.post('/orders', async (req, res) => {
  // uses createOrder
})

// File 3: src/models/Order.ts
class Order {
  // updated with new fields
}

Generate integration tests that verify:
1. All three work together correctly
2. Data flows properly through all layers
3. Error handling is consistent
4. Types are compatible

Provide complete test code.
```

---

## 🔧 Refactoring Across Multiple Files

### Safe Multi-File Refactoring

#### Strategy: Extract Shared Logic

**Scenario:** Same logic duplicated across multiple files.

```
I found this pattern duplicated in three files:

// src/api/users.ts
if (!req.headers.authorization) {
  return res.status(401).json({ error: 'Unauthorized' });
}
const token = req.headers.authorization.split(' ')[1];

// src/api/orders.ts
if (!req.headers.authorization) {
  return res.status(401).json({ error: 'Unauthorized' });
}
const token = req.headers.authorization.split(' ')[1];

// src/api/products.ts
[same pattern]

Help me:
1. Extract this to a shared utility
2. Update all three files to use it
3. Ensure tests still pass
4. Handle edge cases consistently

Provide the refactored code for all files.
```

#### Strategy: Rename Across Files

```
I need to rename `getUserData()` to `fetchUserProfile()` across the codebase.

Files where it's used:
1. src/services/userService.ts (definition)
2. src/api/users.ts (called here)
3. src/components/UserProfile.tsx (called here)
4. tests/services/userService.test.ts (tested here)
5. tests/api/users.test.ts (tested here)

Provide the updated code for each file ensuring:
- Function definition updated
- All call sites updated
- Tests updated
- Types updated if needed
- No references to old name remain
```

### Refactoring Template: Move Function to New File

```
I want to move this function to a new utility file:

Current location: src/services/userService.ts
```typescript
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

This function is also used in:
- src/api/users.ts
- src/components/RegistrationForm.tsx

Help me:
1. Create new file src/utils/validators.ts
2. Move function there
3. Update imports in all files
4. Move related tests
5. Ensure nothing breaks

Provide all updated file contents.
```

---

## 📋 Coordination Patterns

### Pattern 1: Interface-Driven Changes

Define interfaces first, then implement across files.

```
Step 1: Define Interface
Create the interface for our new payment system:

```typescript
// src/types/payment.ts
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  userId: string;
  createdAt: Date;
}

export interface PaymentService {
  createPayment(data: CreatePaymentDTO): Promise<Payment>;
  getPayment(id: string): Promise<Payment>;
  processPayment(id: string): Promise<Payment>;
}
```

Step 2: Implement Service
Now implement PaymentService in src/services/paymentService.ts
following this interface.

Step 3: Create API Endpoint
Create API endpoint using the service.

Step 4: Add Frontend
Create React component using the API.
```

### Pattern 2: Test-Driven Multi-File Changes

Write tests first, then implementation across files.

```
Let's implement payment feature TDD-style.

Step 1: Write Tests First
Create comprehensive tests for:
- src/services/paymentService.ts
- src/api/payments.ts
- src/components/PaymentForm.tsx

Tests should define expected behavior.

Step 2: Implement to Pass Tests
Now implement each file to pass its tests.

Step 3: Integration Tests
Finally, create integration tests for complete flow.
```

### Pattern 3: Migration Pattern

For large-scale changes affecting many files.

```
I need to migrate from class components to functional components.

Files affected (20+ components):
[list files]

Create a migration strategy:
1. Template for converting class to function component
2. Order of migration (least to most complex)
3. Testing approach for each migration
4. Rollback strategy if issues occur
5. Validation checklist

Then help me migrate them in batches of 3-5 files.
```

---

## 🎯 Real-World Examples

### Example 1: Adding Feature Flag System

**Complete Implementation Across Multiple Files**

```markdown
## Feature: Feature Flag System

### Files to Create:
1. src/services/featureFlagService.ts
2. src/middleware/featureFlag.ts
3. src/hooks/useFeatureFlag.tsx
4. src/contexts/FeatureFlagContext.tsx
5. tests/services/featureFlagService.test.ts
6. tests/hooks/useFeatureFlag.test.tsx

### Files to Modify:
1. src/index.ts - Add feature flag initialization
2. src/App.tsx - Add FeatureFlagProvider
3. All feature components - Add flag checks

### Implementation Order:
1. Service layer (core logic)
2. React context and hooks
3. Middleware for API
4. Update components
5. Add tests
6. Documentation
```

**Prompt for Each Step:**

```
Step 1: Create Feature Flag Service

Create src/services/featureFlagService.ts with:
- loadFlags() - fetch from backend
- isEnabled(flagName) - check if enabled
- getAllFlags() - get all flags
- Subscribe to flag changes

Use this pattern from our existing services:
[paste sample service]

Include proper TypeScript types.
```

### Example 2: Database Migration with Code Changes

**Coordinating DB and Application Code**

```
I need to change the User model from storing name as single field
to firstName and lastName.

This affects:
1. Database schema
2. User model
3. All API endpoints using User
4. All React components displaying user name
5. All tests

Help me plan and execute this migration:
1. Create database migration
2. Update model
3. Update all usages
4. Handle backward compatibility during rollout
5. Update tests

Provide step-by-step plan with code for each change.
```

### Example 3: API Version Migration

**Moving from /api/v1 to /api/v2**

```
We're releasing API v2 with breaking changes.

Need to:
1. Create new v2 endpoints alongside v1
2. Share business logic between versions
3. Update frontend to use v2
4. Deprecate v1 (not remove yet)
5. Update all tests

Structure:
```
src/api/
├── v1/
│   ├── users.ts
│   └── orders.ts
└── v2/
    ├── users.ts
    └── orders.ts
```

Help me:
1. Create v2 endpoint structure
2. Extract shared logic
3. Update frontend components
4. Create migration guide
5. Update tests for both versions
```

---

## ✅ Best Practices

### Do's ✅

**Planning:**
- ✅ Always start with impact analysis
- ✅ Create implementation plan before coding
- ✅ Identify all affected files upfront
- ✅ Plan testing strategy early
- ✅ Consider rollback strategy

**Execution:**
- ✅ Make changes in logical layers
- ✅ Test each layer before moving to next
- ✅ Commit related changes together
- ✅ Use feature flags for risky changes
- ✅ Validate integration points

**Quality:**
- ✅ Maintain consistency across files
- ✅ Update all affected tests
- ✅ Verify type safety across files
- ✅ Check for breaking changes
- ✅ Update documentation

### Don'ts ❌

**Planning:**
- ❌ Don't start coding without full impact analysis
- ❌ Don't skip creating implementation plan
- ❌ Don't forget about test files
- ❌ Don't ignore indirect dependencies
- ❌ Don't forget documentation impact

**Execution:**
- ❌ Don't change all files simultaneously
- ❌ Don't skip intermediate testing
- ❌ Don't make unrelated changes in same commit
- ❌ Don't ignore compiler/linter warnings
- ❌ Don't deploy without integration tests

**Quality:**
- ❌ Don't create inconsistent patterns
- ❌ Don't leave failing tests
- ❌ Don't ignore type errors
- ❌ Don't forget backward compatibility
- ❌ Don't skip code review

---

## 🏋️ Exercises

### Exercise 1: Simple Multi-File Feature

**Difficulty:** Beginner  
**Time:** 60 minutes

**Task:** Add "favorite" functionality to a blog app
- Backend: API endpoint, database update
- Frontend: Favorite button component
- Tests: Unit and integration tests

**Files to modify:**
- src/models/Post.ts
- src/api/posts.ts
- src/components/FavoriteButton.tsx
- tests/api/posts.test.ts
- tests/components/FavoriteButton.test.tsx

### Exercise 2: Cross-Cutting Refactor

**Difficulty:** Intermediate  
**Time:** 90 minutes

**Task:** Extract error handling into centralized utility
- Find all error handling code
- Create error utility
- Update all files to use it
- Ensure consistent behavior
- Update tests

### Exercise 3: Feature Flag Implementation

**Difficulty:** Intermediate  
**Time:** 2 hours

**Task:** Implement complete feature flag system
- Service layer
- React hooks and context
- Backend API
- Admin UI
- Tests for all layers

### Exercise 4: API Versioning

**Difficulty:** Advanced  
**Time:** 3 hours

**Task:** Create API v2 alongside v1
- Design v2 with breaking changes
- Share business logic
- Support both versions
- Create migration path
- Update all clients

---

## 📚 Checklists

### Pre-Implementation Checklist

- [ ] Impact analysis completed
- [ ] All affected files identified
- [ ] Implementation plan created
- [ ] Dependencies mapped
- [ ] Test strategy defined
- [ ] Rollback plan considered
- [ ] Review approach planned

### During Implementation Checklist

- [ ] Following implementation plan
- [ ] Testing each layer as completed
- [ ] Maintaining consistency
- [ ] Committing logical chunks
- [ ] Updating tests
- [ ] Checking type safety
- [ ] Handling errors consistently

### Post-Implementation Checklist

- [ ] All planned files updated
- [ ] All tests passing
- [ ] Integration tests added
- [ ] Types consistent across files
- [ ] No compiler warnings
- [ ] Documentation updated
- [ ] Code review requested
- [ ] CI/CD passing

---

## 🎓 Key Takeaways

1. **Plan First:** Always analyze impact and create implementation plan before coding

2. **Layer by Layer:** Implement in architectural layers for better testability

3. **Maintain Consistency:** Ensure patterns, naming, and types are consistent across files

4. **Test Continuously:** Test each layer before moving to next, then test integration

5. **Use AI Strategically:** Let Claude help with planning, consistency checks, and test generation

6. **Commit Logically:** Group related changes together in commits

7. **Think Integration:** Always consider how files work together, not in isolation

8. **Rollback Ready:** Have a plan for rolling back if integration issues occur

9. **Document Changes:** Keep documentation in sync with multi-file changes

10. **Review Thoroughly:** Multi-file changes need comprehensive review

---

## ✅ Mastery Checklist

By the end of this section, you should be able to:

- [ ] Analyze impact of changes across 10+ files
- [ ] Create detailed implementation plans for multi-file features
- [ ] Execute coordinated changes across full stack
- [ ] Maintain consistency across all modified files
- [ ] Write comprehensive tests for multi-file changes
- [ ] Refactor safely across multiple files
- [ ] Handle database migrations with code changes
- [ ] Implement features layer-by-layer or as vertical slices
- [ ] Use AI assistance to plan and coordinate complex changes

---

**Next:** [Architectural Analysis →](./04-architectural-analysis.md)

---

*"Think in systems, code in layers, test in integration."*

*Master multi-file workflows, ship complex features confidently.*
