# Prompt Engineering Best Practices

## Overview

Prompt engineering is the foundation of effective AI-assisted development. This guide provides comprehensive best practices for crafting prompts that maximize Claude's capabilities while minimizing ambiguity and errors.

## Core Principles

### 1. Clarity and Specificity

The most effective prompts are clear, specific, and unambiguous. Claude performs best when given precise instructions with well-defined expectations.

**Key Guidelines:**
- State your goal explicitly at the beginning
- Define success criteria before starting
- Specify output format and structure
- Include relevant constraints and requirements
- Provide context about the broader system

### 2. Progressive Disclosure

Introduce complexity gradually rather than overwhelming Claude with all requirements at once.

**Approach:**
1. Start with the core requirement
2. Add constraints incrementally
3. Refine based on initial outputs
4. Build upon successful patterns

### 3. Context-First Thinking

Always provide necessary context before making requests. Claude needs to understand the "why" to deliver optimal "how" solutions.

## Do's and Don'ts

### Prompt Structure

#### Do's

- **Start with a clear objective:**
  ```
  "Create a REST API endpoint for user authentication that supports JWT tokens, 
  rate limiting, and integrates with our existing PostgreSQL database."
  ```

- **Provide relevant examples:**
  ```
  "Similar to how we implemented the product search endpoint in 
  /api/products/search.ts, create a user search endpoint with pagination."
  ```

- **Specify technical requirements:**
  ```
  "Use TypeScript with strict mode, follow our existing error handling patterns 
  in /utils/errors.ts, and ensure all database queries use parameterized statements."
  ```

- **Define acceptance criteria:**
  ```
  "The solution must: 
  1. Handle at least 1000 requests per second
  2. Return responses under 200ms
  3. Include comprehensive error handling
  4. Pass all existing security tests"
  ```

#### Don'ts

- **Avoid vague requests:**
  ```
  "Make the code better" (What aspect? Performance? Readability? Security?)
  ```

- **Don't assume implicit knowledge:**
  ```
  "Fix the bug" (Which bug? What's the expected behavior?)
  ```

- **Avoid conflicting instructions:**
  ```
  "Make it simple but include all advanced features" (Contradictory)
  ```

- **Don't omit critical constraints:**
  ```
  "Add authentication" (What type? What about existing users? Database schema?)
  ```

## Real-World Examples

### Example 1: Database Schema Design

#### Poor Prompt:
```
"Create a database for users"
```

#### Excellent Prompt:
```
"Design a PostgreSQL database schema for a multi-tenant SaaS application with:

REQUIREMENTS:
- User management (authentication, profiles, preferences)
- Organization/workspace support (1 user can belong to multiple orgs)
- Role-based access control (3 levels: admin, editor, viewer)
- Audit logging for all data modifications
- Soft deletes for compliance

CONSTRAINTS:
- Must support 100K+ users per organization
- Query performance for user lookups must be under 10ms
- Follow our naming conventions in /docs/database-standards.md
- Include appropriate indexes for common query patterns

DELIVERABLES:
- SQL migration scripts
- ER diagram
- Index strategy documentation
- Example queries for common operations
```

### Example 2: API Refactoring

#### Poor Prompt:
```
"Refactor the API code"
```

#### Excellent Prompt:
```
"Refactor the user management API in /src/api/users/ following these objectives:

CURRENT ISSUES:
- Mixed async/sync patterns causing race conditions
- No request validation
- Direct database access instead of using repositories
- Inconsistent error handling

TARGET ARCHITECTURE:
- Implement repository pattern (see /src/repositories/BaseRepository.ts)
- Add Zod schema validation for all endpoints
- Use async/await consistently
- Implement standardized error responses (format in /types/api.ts)
- Add request/response logging

MAINTAIN:
- Existing API contract (no breaking changes)
- Current authentication mechanism
- Database schema

TESTING:
- Ensure all existing tests pass
- Add integration tests for validation
- Test error scenarios
```

### Example 3: Performance Optimization

#### Poor Prompt:
```
"Make it faster"
```

#### Excellent Prompt:
```
"Optimize the product search functionality in /src/services/search/ProductSearch.ts

CURRENT PERFORMANCE:
- Average query time: 2.3 seconds
- Database queries: 15+ per search
- Memory usage: 500MB per request
- No caching implemented

PERFORMANCE TARGETS:
- Reduce query time to under 300ms (P95)
- Minimize to 3-5 database queries maximum
- Memory usage under 50MB per request
- Implement Redis caching for frequent searches

CONSTRAINTS:
- Must maintain search accuracy
- Cannot change database schema
- Must work with existing React frontend
- Backward compatible with mobile apps

APPROACH:
1. Profile current implementation
2. Identify bottlenecks
3. Implement query optimization
4. Add caching layer
5. Benchmark improvements
6. Document changes
```

## Advanced Techniques

### 1. Chain-of-Thought Prompting

Guide Claude through complex reasoning by explicitly requesting step-by-step analysis.

```
"Before implementing the solution, first:
1. Analyze the existing codebase structure
2. Identify potential integration points
3. Evaluate security implications
4. Propose the architecture
5. Wait for approval before proceeding with implementation"
```

### 2. Role-Based Prompting

Frame requests within specific expertise contexts:

```
"As a senior security engineer reviewing this authentication system, identify:
- Potential vulnerabilities
- OWASP Top 10 violations
- Missing security headers
- Weak cryptographic practices
- Session management issues"
```

### 3. Constraint-Driven Design

Use constraints to guide better solutions:

```
"Design a solution that must:
- Work offline (service worker + IndexedDB)
- Support real-time sync when online
- Handle conflict resolution
- Maintain data consistency
- Work on low-bandwidth connections
- Support 10,000+ offline records"
```

### 4. Iterative Refinement

Build complex solutions through iteration:

```
"Phase 1: Create basic CRUD operations
Phase 2: Add validation and error handling
Phase 3: Implement caching
Phase 4: Add monitoring and logging
Phase 5: Optimize for scale

Start with Phase 1, then wait for review before proceeding."
```

### 5. Example-Driven Development

Provide concrete examples of desired behavior:

```
"Create a validation function that behaves like:

Input: { email: 'test@example.com', age: 25 }
Output: { valid: true, errors: [] }

Input: { email: 'invalid', age: -5 }
Output: { 
  valid: false, 
  errors: [
    { field: 'email', message: 'Invalid email format' },
    { field: 'age', message: 'Age must be positive' }
  ]
}
```

## Common Pitfalls

### 1. Ambiguous Success Criteria

**Problem:**
```
"Improve the performance"
```

**Why it fails:** No measurable target, unclear what aspect to improve.

**Solution:**
```
"Reduce API response time from current 800ms to under 200ms for the /api/products endpoint, 
measured at P95, while maintaining current throughput of 500 req/s."
```

### 2. Missing Context

**Problem:**
```
"Add error handling to the function"
```

**Why it fails:** Unknown which function, what errors to handle, existing patterns.

**Solution:**
```
"Add error handling to the processPayment function in /src/services/payment.ts.
Handle these scenarios:
- Network timeouts (retry 3x with exponential backoff)
- Invalid payment details (return user-friendly message)
- Payment gateway errors (log for investigation, show generic error)
- Database failures (rollback transaction, alert on-call)

Follow the error handling pattern established in /src/utils/errorHandler.ts"
```

### 3. Scope Creep in Single Prompt

**Problem:**
```
"Build a complete e-commerce platform with product catalog, shopping cart, checkout, 
payment processing, inventory management, shipping integration, customer service 
chat, analytics dashboard, and admin panel."
```

**Why it fails:** Too broad, overwhelming, no clear starting point.

**Solution:**
```
"Create the foundation for an e-commerce platform. Start with:
1. Product catalog API (CRUD operations)
2. Basic data models
3. Database schema

After review, we'll add cart functionality, then checkout, etc."
```

### 4. Implicit Assumptions

**Problem:**
```
"Connect to the database"
```

**Why it fails:** Unknown database type, connection details, schema, ORM preference.

**Solution:**
```
"Set up PostgreSQL database connection using TypeORM:
- Database: PostgreSQL 14+
- Connection pooling: max 20 connections
- Use environment variables from .env.example
- Connection timeout: 30 seconds
- Enable query logging in development
- Follow connection pattern in /src/database/config.ts"
```

### 5. Conflicting Requirements

**Problem:**
```
"Make it production-ready immediately but also experimental"
```

**Why it fails:** Contradictory expectations about stability vs. innovation.

**Solution:**
```
"Create a feature-flagged implementation:
- Core functionality: production-ready, thoroughly tested
- Experimental features: behind 'experimental_mode' flag
- Clear separation between stable and experimental code
- Documented migration path for graduating experiments"
```

## Checklists

### Pre-Prompt Checklist

Before submitting a prompt, verify:

- [ ] Clear objective stated in first sentence
- [ ] Relevant file paths provided
- [ ] Technical constraints specified
- [ ] Success criteria defined
- [ ] Expected output format described
- [ ] Relevant context included
- [ ] Examples provided (if applicable)
- [ ] Edge cases mentioned
- [ ] Testing requirements specified
- [ ] Documentation expectations set

### Prompt Quality Checklist

Evaluate your prompt:

- [ ] Could someone else understand the request?
- [ ] Are there any ambiguous terms?
- [ ] Have I provided enough context?
- [ ] Are requirements prioritized?
- [ ] Is the scope manageable?
- [ ] Have I referenced relevant code?
- [ ] Are constraints realistic?
- [ ] Is success measurable?
- [ ] Have I considered edge cases?
- [ ] Is the timeline reasonable?

### Code Request Checklist

For code-generation prompts:

- [ ] Specified programming language/framework
- [ ] Defined coding standards/style
- [ ] Referenced existing patterns
- [ ] Included error handling requirements
- [ ] Specified testing approach
- [ ] Mentioned performance requirements
- [ ] Defined security considerations
- [ ] Requested documentation
- [ ] Specified file organization
- [ ] Included integration points

## Metrics for Success

### Prompt Effectiveness Metrics

Track these indicators to improve prompting skills:

1. **First-Pass Success Rate**
   - Target: >80% of prompts produce usable output on first attempt
   - Measure: Percentage of prompts requiring no significant revision

2. **Iteration Count**
   - Target: <3 iterations per feature
   - Measure: Average number of back-and-forth exchanges

3. **Specification Completeness**
   - Target: >95% of requirements captured in initial prompt
   - Measure: Percentage of requirements not needing clarification

4. **Context Efficiency**
   - Target: <2000 tokens for typical prompt
   - Measure: Average token count per prompt

5. **Ambiguity Rate**
   - Target: <5% of prompts require clarification
   - Measure: Percentage of prompts with unclear requirements

### Quality Indicators

Successful prompts typically exhibit:

- **Specificity Score:** All technical terms defined (>90%)
- **Context Ratio:** Appropriate context-to-request ratio (1:2 to 1:4)
- **Constraint Clarity:** All constraints explicitly stated (100%)
- **Example Coverage:** At least 2 examples for complex requests
- **Testability:** Clear success criteria defined (100%)

## Pattern Library

### Pattern 1: Architecture Review

```
"Review the architecture of [COMPONENT] for:
- Scalability issues (current load: X, expected: Y)
- Security vulnerabilities (OWASP focus)
- Maintainability concerns
- Performance bottlenecks
- Integration weaknesses

Provide:
1. Issues found (severity: critical/high/medium/low)
2. Recommended solutions
3. Implementation priority
4. Estimated effort"
```

### Pattern 2: Migration Task

```
"Migrate [COMPONENT] from [OLD_TECH] to [NEW_TECH]:

CURRENT STATE:
- [Describe current implementation]
- Dependencies: [list]
- Known issues: [list]

TARGET STATE:
- [Describe desired outcome]
- New dependencies: [list]
- Benefits: [list]

MIGRATION STRATEGY:
1. Create parallel implementation
2. Implement feature parity
3. Add integration tests
4. Gradual rollout plan
5. Rollback mechanism

CONSTRAINTS:
- Zero downtime required
- Maintain API compatibility
- Data migration plan needed"
```

### Pattern 3: Bug Investigation

```
"Investigate and fix [BUG_DESCRIPTION]:

SYMPTOMS:
- [What users observe]
- Frequency: [how often]
- Impact: [severity, affected users]

REPRODUCTION STEPS:
1. [Step 1]
2. [Step 2]
3. [Expected vs actual behavior]

ENVIRONMENT:
- Version: [version]
- Platform: [platform]
- Configuration: [config]

INVESTIGATION APPROACH:
1. Review relevant code sections
2. Check logs for patterns
3. Reproduce locally
4. Identify root cause
5. Propose fix
6. Add regression test"
```

### Pattern 4: Performance Analysis

```
"Analyze performance of [FEATURE]:

CURRENT METRICS:
- Response time: [current]
- Throughput: [current]
- Resource usage: [current]
- Error rate: [current]

TARGET METRICS:
- Response time: [target]
- Throughput: [target]
- Resource usage: [target]
- Error rate: [target]

ANALYSIS NEEDED:
1. Profile current implementation
2. Identify bottlenecks
3. Propose optimizations
4. Estimate improvements
5. Consider trade-offs

TOOLS AVAILABLE:
- [List profiling tools]
- [List monitoring tools]"
```

## Advanced Strategies

### 1. Multi-Stage Prompting

For complex projects, break into stages:

```
STAGE 1 - ANALYSIS:
"Analyze the existing system and identify all integration points"

STAGE 2 - DESIGN:
"Based on the analysis, design the new architecture"

STAGE 3 - PLANNING:
"Create an implementation plan with milestones"

STAGE 4 - IMPLEMENTATION:
"Implement Phase 1 from the approved plan"

STAGE 5 - VALIDATION:
"Test and validate the implementation"
```

### 2. Constraint Relaxation

Start strict, relax selectively:

```
"Design a solution with these hard constraints:
- Zero data loss
- Sub-second response time
- Full ACID compliance

If impossible, identify which constraint could be relaxed and the trade-offs."
```

### 3. Comparative Analysis

Request multiple approaches:

```
"Propose three different solutions for [PROBLEM]:

Solution A: Optimized for performance
Solution B: Optimized for maintainability  
Solution C: Optimized for cost

For each, provide:
- Architecture overview
- Pros and cons
- Implementation complexity
- Operational costs
- Recommendation ranking"
```

### 4. Risk-Aware Planning

Incorporate risk assessment:

```
"Implement [FEATURE] with risk mitigation:

IDENTIFY:
- Technical risks
- Security risks
- Performance risks
- Integration risks

FOR EACH RISK:
- Probability (high/medium/low)
- Impact (critical/major/minor)
- Mitigation strategy
- Fallback plan"
```

## Continuous Improvement

### Prompt Retrospectives

After major features, review:

1. **What worked well:**
   - Which prompts were most effective?
   - What patterns emerged?
   - What context was most valuable?

2. **What could improve:**
   - Which prompts needed multiple iterations?
   - What information was missing?
   - What assumptions were incorrect?

3. **Lessons learned:**
   - Document successful patterns
   - Update team guidelines
   - Share with team members

### Building Prompt Templates

Create reusable templates for common tasks:

```
TEMPLATE: New API Endpoint
---
"Create a new [METHOD] endpoint at /api/[path]:

FUNCTIONALITY:
- [Primary function]
- [Secondary functions]

REQUEST FORMAT:
- Method: [GET/POST/PUT/DELETE]
- Body: [schema]
- Headers: [required headers]

RESPONSE FORMAT:
- Success: [schema]
- Error: [error format]

VALIDATION:
- [Validation rules]

SECURITY:
- [Auth requirements]
- [Rate limiting]
- [Input sanitization]

TESTS:
- [Test scenarios]"
```

### Knowledge Accumulation

Maintain a prompt pattern library:

- Categorize by task type
- Document success rates
- Note team preferences
- Include examples
- Update regularly
- Share across team

## Conclusion

Effective prompt engineering is a skill that improves with practice. Focus on clarity, provide comprehensive context, and continuously refine your approach based on results. The investment in crafting better prompts pays dividends in reduced iterations, higher quality outputs, and more efficient development workflows.

Remember: The goal is not just to get Claude to produce code, but to establish a collaborative problem-solving partnership where clear communication leads to optimal solutions.
