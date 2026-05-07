# Common Anti-Patterns to Avoid

## Overview

Anti-patterns are common approaches that seem reasonable but lead to problems. This guide identifies anti-patterns specific to AI-assisted development and provides better alternatives.

## Core Anti-Patterns

### 1. Blind Code Acceptance

**Anti-Pattern:**
Accepting and committing AI-generated code without review or testing.

**Why It's Bad:**
- Introduces bugs and vulnerabilities
- Violates coding standards
- Creates technical debt
- Bypasses quality controls

**Better Approach:**
Always review AI-generated code with same rigor as human-written code. Run tests, check security, verify logic, and ensure it meets standards.

### 2. Context Dumping

**Anti-Pattern:**
Pasting entire files or large codebases without focusing on relevant parts.

**Why It's Bad:**
- Wastes context window
- Obscures relevant information
- Reduces response quality
- Slows iteration

**Better Approach:**
Provide focused context: file paths with line numbers, specific functions, relevant excerpts only. Reference full files by path when needed.

### 3. Vague Requirements

**Anti-Pattern:**
"Make it better" or "Fix the code" without specifics.

**Why It's Bad:**
- Unclear success criteria
- Multiple iterations needed
- Doesn't address actual issues
- Wastes time

**Better Approach:**
Specify exactly what needs improvement: "Reduce response time from 2s to <200ms by optimizing database queries in getUserDashboard function."

### 4. Copy-Paste Programming

**Anti-Pattern:**
Copying AI-generated code snippets across multiple locations without adaptation.

**Why It's Bad:**
- Creates code duplication
- Doesn't fit context
- Hard to maintain
- Introduces inconsistencies

**Better Approach:**
Request reusable patterns. Extract to shared functions. Adapt code to your specific context. Use inheritance or composition.

### 5. Ignoring Security

**Anti-Pattern:**
Not explicitly requesting security considerations in prompts.

**Why It's Bad:**
- Introduces vulnerabilities
- Exposes sensitive data
- Violates compliance
- Creates attack vectors

**Better Approach:**
Always specify security requirements: input validation, authentication, authorization, encryption, secure defaults.

### 6. No Testing Strategy

**Anti-Pattern:**
Accepting code without tests or test strategy.

**Why It's Bad:**
- Regression risks
- Unknown edge cases
- Hard to refactor
- Quality uncertainty

**Better Approach:**
Request tests with implementation. Specify test scenarios including happy paths, edge cases, and error conditions.

### 7. Premature Optimization

**Anti-Pattern:**
Asking for "maximum performance" without profiling.

**Why It's Bad:**
- Optimizes wrong things
- Adds complexity
- Reduces readability
- Wastes effort

**Better Approach:**
Profile first, identify bottlenecks, then optimize specific hot paths with measurable targets.

### 8. Single-Iteration Expectation

**Anti-Pattern:**
Expecting perfect code on first attempt.

**Why It's Bad:**
- Leads to disappointment
- Misses refinement opportunities
- Doesn't leverage iterative improvement
- Results in suboptimal solutions

**Better Approach:**
Plan for iteration. Start with working solution, then refine. Provide feedback for improvement. Build incrementally.

### 9. Ignoring Team Standards

**Anti-Pattern:**
Not informing Claude about team conventions and standards.

**Why It's Bad:**
- Inconsistent code style
- Violates team patterns
- Extra review burden
- Requires rework

**Better Approach:**
Reference team style guide, coding standards, existing patterns. Point to example files. Specify conventions explicitly.

### 10. Documentation Neglect

**Anti-Pattern:**
Generating code without requesting documentation.

**Why It's Bad:**
- Hard to understand later
- Onboarding difficulty
- Knowledge loss
- Maintenance challenges

**Better Approach:**
Request documentation with code: JSDoc comments, README updates, architecture decisions, usage examples.

## Specific Anti-Patterns

### Database Anti-Patterns

**Anti-Pattern: Direct String Concatenation**
```typescript
// DON'T
const query = `SELECT * FROM users WHERE email = '${email}'`;
```

**Better Approach:**
```typescript
// DO
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]);
```

**Anti-Pattern: Loading Everything**
```typescript
// DON'T
const users = await db.query('SELECT * FROM users');
const filtered = users.filter(u => u.active);
```

**Better Approach:**
```typescript
// DO
const users = await db.query('SELECT * FROM users WHERE active = true');
```

### API Anti-Patterns

**Anti-Pattern: No Error Handling**
```typescript
// DON'T
async function getUser(id) {
  const user = await api.fetchUser(id);
  return user.data;
}
```

**Better Approach:**
```typescript
// DO
async function getUser(id: string): Promise<User> {
  try {
    const user = await api.fetchUser(id);
    if (!user.data) {
      throw new NotFoundError(`User ${id} not found`);
    }
    return user.data;
  } catch (error) {
    if (error instanceof NetworkError) {
      throw new ServiceUnavailableError('API temporarily unavailable');
    }
    throw error;
  }
}
```

### Testing Anti-Patterns

**Anti-Pattern: Testing Implementation Details**
```typescript
// DON'T
it('should call internal helper', () => {
  const spy = jest.spyOn(service, '_internalHelper');
  service.publicMethod();
  expect(spy).toHaveBeenCalled();
});
```

**Better Approach:**
```typescript
// DO
it('should return correct result', () => {
  const result = service.publicMethod();
  expect(result).toEqual(expectedOutput);
});
```

## Checklists

### Pre-Implementation Checklist

Before accepting AI-generated implementation:

- [ ] Requirements are specific and measurable
- [ ] Security requirements specified
- [ ] Testing strategy defined
- [ ] Performance targets set
- [ ] Team standards referenced
- [ ] Context is focused and relevant
- [ ] Edge cases identified
- [ ] Error handling requirements clear

### Code Review Checklist

Before merging AI-generated code:

- [ ] Code reviewed thoroughly
- [ ] Tests present and passing
- [ ] Security verified
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Follows team standards
- [ ] No code duplication
- [ ] Error handling appropriate

## Warning Signs

Watch for these indicators of anti-patterns:

1. **Code works but unclear why**: Lack of understanding
2. **Lots of comments explaining code**: Code not self-documenting
3. **Nested callbacks/promises**: Poor async handling
4. **Giant functions**: Violates single responsibility
5. **Magic numbers everywhere**: Lacks constants
6. **Try-catch around everything**: Defensive programming gone wrong
7. **No type checking**: Ignoring type safety
8. **Repeated code blocks**: Should be extracted
9. **Complex conditionals**: Needs simplification
10. **No tests**: Quality uncertainty

## Metrics for Success

Track anti-pattern frequency:

1. **Code Review Rejections**: <10% due to anti-patterns
2. **Bugs from AI Code**: <5% of total bugs
3. **Refactoring Frequency**: <20% of AI code needs refactoring
4. **Security Issues**: Zero security issues from AI code
5. **Standards Violations**: <5% violations in AI code

## Recovery from Anti-Patterns

If you've fallen into anti-patterns:

1. **Acknowledge the Issue**: Identify what went wrong
2. **Learn the Pattern**: Understand why it's an anti-pattern
3. **Refactor**: Fix the code properly
4. **Document**: Share learnings with team
5. **Update Prompts**: Improve future prompts to avoid it
6. **Review Process**: Strengthen review checklist

## Conclusion

Avoiding anti-patterns requires awareness, discipline, and continuous improvement. Learn to recognize these patterns, understand why they're problematic, and apply better approaches. Share knowledge with your team to prevent recurrence.

Remember: AI is a powerful tool, but it requires informed guidance to produce quality results.
