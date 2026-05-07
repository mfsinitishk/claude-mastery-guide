# Exercises and Examples

## Practice Problems for Intermediate Skills

---

## 🎯 Overview

These hands-on exercises build practical skills across all intermediate topics. Each exercise includes context, requirements, solution approach, and validation criteria. Work through progressively to reinforce concepts.

**Time to Complete:** 8-12 hours (all exercises)  
**Outcome:** Hands-on proficiency with intermediate AI-assisted development patterns

---

## 📚 Exercise Structure

Each exercise includes:
- **Context**: Scenario and background
- **Requirements**: What to build/fix/improve
- **Starting Point**: Initial code (if applicable)
- **Success Criteria**: How to validate completion
- **Tips**: Hints and best practices
- **Solution Approach**: General guidance (not full solution)

---

## 🔧 Section 1: Repository Workflows

### Exercise 1.1: Repository Analysis

**Context:**
You've joined a project and need to understand the codebase structure.

**Task:**
Using Claude, analyze an unfamiliar repository and create a comprehensive architecture document.

**Repository:**
Use any medium-sized open source project (50-200 files)

**Deliverables:**
1. Architecture diagram (ASCII art or description)
2. Component dependency map
3. Data flow documentation
4. Key entry points and their purposes
5. Technology stack summary
6. Suggested improvement areas

**Success Criteria:**
- ✓ All major components identified
- ✓ Dependencies mapped correctly
- ✓ Entry points documented
- ✓ At least 3 improvement suggestions

**Tips:**
- Start with directory structure
- Identify main entry point(s)
- Trace key user flows
- Look for configuration files
- Check package dependencies

### Exercise 1.2: Cross-File Refactoring

**Context:**
A UserService class has spread across multiple files and needs consolidation.

**Starting Code:**
```
src/services/user/create.ts
src/services/user/update.ts
src/services/user/delete.ts
src/services/user/find.ts
src/services/user/validate.ts
```

**Task:**
Refactor into a cohesive UserService class while maintaining all functionality.

**Requirements:**
- Single UserService class
- Proper dependency injection
- Maintain existing tests (update as needed)
- Improve error handling
- Add comprehensive documentation

**Success Criteria:**
- ✓ All functionality in single service
- ✓ Tests pass
- ✓ No duplicate code
- ✓ Improved error messages
- ✓ JSDoc on all public methods

---

## 🔄 Section 2: Git Workflows

### Exercise 2.1: Feature Branch Development

**Task:**
Develop a complete feature using proper git workflow with Claude's assistance.

**Feature:**
Add user profile image upload functionality

**Requirements:**
1. Create feature branch
2. Implement backend endpoint
3. Implement frontend component
4. Write tests
5. Create meaningful commits
6. Prepare for PR

**Git Workflow:**
```bash
git checkout -b feature/profile-image-upload
# Develop with Claude
git add [files]
git commit -m "meaningful message"
# Continue until complete
```

**Success Criteria:**
- ✓ Feature branch created
- ✓ 3-5 logical commits
- ✓ Conventional commit messages
- ✓ All tests pass
- ✓ No merge conflicts with main
- ✓ Ready for code review

### Exercise 2.2: Conflict Resolution

**Context:**
Your feature branch conflicts with changes merged to main.

**Starting State:**
```
Your branch: Modified src/services/UserService.ts (added methods)
Main branch: Modified src/services/UserService.ts (refactored existing)
```

**Task:**
Use Claude to analyze conflicts and resolve them correctly.

**Success Criteria:**
- ✓ Conflicts resolved correctly
- ✓ Both sets of changes preserved
- ✓ Tests pass after merge
- ✓ No regressions

---

## 🧪 Section 3: Test Strategy

### Exercise 3.1: Comprehensive Test Suite

**Context:**
A PaymentProcessor class has no tests.

**Code:**
```typescript
class PaymentProcessor {
  async processPayment(
    amount: number,
    cardToken: string,
    currency: string
  ): Promise<PaymentResult> {
    // Validation
    // Call payment gateway
    // Handle response
    // Save transaction
  }
  
  async refundPayment(
    transactionId: string,
    amount?: number
  ): Promise<RefundResult> {
    // Fetch transaction
    // Validate refund
    // Process refund
    // Update records
  }
}
```

**Task:**
Generate comprehensive test suite covering all scenarios.

**Test Categories Required:**
- Unit tests (mocked gateway)
- Integration tests (test mode gateway)
- Happy path tests
- Error scenarios
- Edge cases
- Security tests

**Success Criteria:**
- ✓ ≥90% code coverage
- ✓ All methods tested
- ✓ Payment failures handled
- ✓ Idempotency tested
- ✓ Refund edge cases covered
- ✓ Tests independent and fast

---

## 🌐 Section 4: API Development

### Exercise 4.1: RESTful Resource

**Task:**
Create a complete RESTful API for a "Project" resource.

**Resource Schema:**
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

**Endpoints Required:**
```
GET    /api/projects       (list with pagination)
GET    /api/projects/:id   (get single)
POST   /api/projects       (create)
PUT    /api/projects/:id   (update)
DELETE /api/projects/:id   (soft delete)
```

**Requirements:**
- Input validation (Zod)
- Authentication (JWT)
- Authorization (owner only)
- Pagination and filtering
- Error handling
- API documentation
- Integration tests

**Success Criteria:**
- ✓ All CRUD operations work
- ✓ Validation prevents invalid data
- ✓ Auth/authz enforced
- ✓ Pagination works
- ✓ Tests cover all endpoints
- ✓ Documentation complete

### Exercise 4.2: GraphQL API

**Task:**
Create equivalent GraphQL API for Projects resource.

**Requirements:**
- GraphQL schema definition
- Resolvers for all operations
- TypeScript types generated from schema
- DataLoader for N+1 prevention
- Authentication context
- Error handling
- Tests

**Success Criteria:**
- ✓ Schema compiles
- ✓ All operations work
- ✓ No N+1 queries
- ✓ Auth works
- ✓ Type-safe end-to-end

---

## 🔗 Section 5: Backend-Frontend Integration

### Exercise 5.1: Full-Stack Feature

**Task:**
Implement complete "Comments" feature across stack.

**Requirements:**

**Backend:**
- Comment model (belongs to Project)
- API endpoints (CRUD)
- Real-time updates (WebSocket)
- Validation

**Frontend:**
- CommentList component
- CommentForm component
- Real-time updates
- Optimistic UI
- Error handling

**Shared:**
- Type definitions
- API client
- WebSocket client

**Success Criteria:**
- ✓ CRUD works
- ✓ Real-time updates appear
- ✓ Optimistic UI responsive
- ✓ Type-safe end-to-end
- ✓ Error states handled
- ✓ Tests pass

---

## 🎯 Section 6: Context Optimization

### Exercise 6.1: Large Codebase Navigation

**Context:**
You need to add a feature to a 500-file codebase.

**Task:**
Use context optimization techniques to work efficiently.

**Feature to Add:**
Export functionality for reports (PDF generation)

**Requirements:**
- Identify relevant files (without reading all 500)
- Load minimal context
- Implement feature
- Track token usage

**Challenge:**
Complete task using <20K tokens total

**Success Criteria:**
- ✓ Feature implemented
- ✓ Context under 20K tokens
- ✓ All relevant files found
- ✓ No unnecessary files loaded

**Tips:**
- Start with directory structure
- Use file search
- Load files incrementally
- Summarize large files

---

## 📝 Section 7: Structured Prompting

### Exercise 7.1: Prompt Engineering

**Task:**
Convert vague requirements into structured prompts.

**Vague Requirement 1:**
"Add search to the app"

**Your Task:**
Create comprehensive structured prompt including:
- Context
- Requirements (functional & non-functional)
- Constraints
- Success criteria
- Deliverables

**Vague Requirement 2:**
"Make the API faster"

**Your Task:**
Create structured prompt for performance optimization.

**Success Criteria:**
- ✓ All context provided
- ✓ Requirements specific
- ✓ Constraints defined
- ✓ Success measurable
- ✓ Deliverables clear

---

## 🔁 Section 8: Reusable Prompts

### Exercise 8.1: Build Personal Library

**Task:**
Create a personal prompt library for your common tasks.

**Requirements:**
1. Identify 5 most common development tasks
2. Create prompt template for each
3. Test with real code
4. Refine based on results
5. Document in library

**Structure:**
```
prompts/
  refactoring/
    [your-prompt-1].md
  testing/
    [your-prompt-2].md
  features/
    [your-prompt-3].md
  README.md
```

**Success Criteria:**
- ✓ 5 templates created
- ✓ Each tested on real code
- ✓ Documentation complete
- ✓ Examples included
- ✓ Placeholders documented

---

## 🤝 Section 9: AI Pair Programming

### Exercise 9.1: TDD Session

**Task:**
Build a feature using Test-Driven Development with Claude.

**Feature:**
Shopping cart with add/remove/update quantity/calculate total

**Workflow:**
1. You: Write first test
2. Claude: Implement to pass
3. Claude: Write next test
4. You: Implement to pass
5. Repeat until feature complete

**Requirements:**
- Alternate writing tests
- Implement only enough to pass
- Refactor together
- End with complete test coverage

**Success Criteria:**
- ✓ All tests pass
- ✓ 100% code coverage
- ✓ Clean, refactored code
- ✓ Tests written first

### Exercise 9.2: Code Review Loop

**Starting Code:**
[Intentionally flawed implementation provided]

**Task:**
Work with Claude to identify and fix all issues through iterative review.

**Review Checklist:**
- Security vulnerabilities
- Performance problems
- Code quality issues
- Missing error handling
- Test coverage gaps
- Documentation needs

**Success Criteria:**
- ✓ All security issues fixed
- ✓ Performance optimized
- ✓ Code quality improved
- ✓ Comprehensive error handling
- ✓ Tests added
- ✓ Documentation complete

---

## 🏆 Capstone Project

### Full-Stack Application

**Build:** Task Management System

**Features:**
1. User authentication (JWT)
2. Project CRUD
3. Task CRUD with assignment
4. Comments on tasks
5. Real-time updates
6. File attachments
7. Search and filtering
8. Email notifications

**Stack:**
- Backend: Node.js + TypeScript + PostgreSQL
- Frontend: React + TypeScript
- Real-time: WebSocket
- File storage: AWS S3

**Requirements:**
- Use all intermediate techniques
- Proper git workflow
- Comprehensive tests
- API documentation
- Deployment ready

**Success Criteria:**
- ✓ All features work
- ✓ ≥80% test coverage
- ✓ No security vulnerabilities
- ✓ Production-ready code
- ✓ Complete documentation
- ✓ Built using AI pair programming

**Time Estimate:**
20-30 hours

---

## ✅ Validation Checklist

For each completed exercise:

**Code Quality:**
- [ ] Follows language conventions
- [ ] No linter errors
- [ ] Proper error handling
- [ ] Meaningful variable names
- [ ] Appropriate comments

**Testing:**
- [ ] Tests pass
- [ ] Coverage meets target
- [ ] Edge cases covered
- [ ] Tests are maintainable

**Documentation:**
- [ ] README updated
- [ ] API documented
- [ ] Inline docs complete
- [ ] Examples provided

**AI Collaboration:**
- [ ] Effective prompts used
- [ ] Iterative refinement applied
- [ ] Context optimized
- [ ] Structured approach followed

---

## 📊 Self-Assessment

After completing exercises, rate yourself:

**Repository Workflows:** ⬜⬜⬜⬜⬜ (1-5)  
**Git Integration:** ⬜⬜⬜⬜⬜ (1-5)  
**Test Strategy:** ⬜⬜⬜⬜⬜ (1-5)  
**API Development:** ⬜⬜⬜⬜⬜ (1-5)  
**Full-Stack:** ⬜⬜⬜⬜⬜ (1-5)  
**Context Optimization:** ⬜⬜⬜⬜⬜ (1-5)  
**Structured Prompting:** ⬜⬜⬜⬜⬜ (1-5)  
**Reusable Prompts:** ⬜⬜⬜⬜⬜ (1-5)  
**Pair Programming:** ⬜⬜⬜⬜⬜ (1-5)  

**Target:** 4+ in all areas before advancing to Level 3

---

**Next:** [Assessment →](./18-assessment.md)
