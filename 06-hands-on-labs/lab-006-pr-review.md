# Lab 006: Pull Request Review Workflow

## Learning Objectives

By the end of this lab, you will be able to:
- Use Claude to perform comprehensive PR reviews
- Identify security, performance, and maintainability issues
- Provide constructive feedback with code examples
- Automate parts of the review process
- Review different types of changes (features, bugs, refactoring)
- Create PR review checklists and templates
- Balance thoroughness with review speed

## Prerequisites

- Completion of Labs 001-005
- Understanding of git and PR workflows
- Knowledge of code review best practices
- Access to GitHub/GitLab or similar
- 60 minutes to complete the lab

## Setup

```bash
# Clone a repository with existing PRs or create test PRs
git clone https://github.com/your-org/sample-project
cd sample-project

# Create a test PR
git checkout -b feature/test-review
# Make some changes...
git commit -am "Add feature"
git push origin feature/test-review
```

## Exercise 1: Feature PR Review (20 minutes)

### Objective
Conduct a thorough review of a feature pull request.

### Instructions

**Step 1: Gather PR Context**

```
Review this pull request:

Title: Add user notification system
Branch: feature/notifications → main
Files changed: 12 files, +450 lines, -20 lines

Description:
- Implements email and in-app notifications
- Adds notification preferences
- Includes tests and documentation

Changed files:
[paste git diff --stat]

Please provide:
1. Summary of changes
2. Architecture impact analysis
3. Potential risks
4. Suggested review focus areas
```

**Step 2: Deep Code Review**

For each changed file:

```
Review this file for issues:

[paste git diff of file]

Check for:
1. Security vulnerabilities
2. Performance issues
3. Error handling gaps
4. Code style violations
5. Test coverage gaps
6. Documentation needs
7. Breaking changes
8. Edge cases not handled

For each issue:
- Severity (Critical/High/Medium/Low)
- Line number
- Problem description
- Suggested fix with code example
- Rationale
```

**Step 3: Generate Review Comments**

```
Generate GitHub review comments for these issues:

Issues found:
[paste issues from Step 2]

For each issue, create:
1. Comment text (constructive, specific)
2. Suggested code change
3. Line number reference
4. Severity tag

Format as GitHub review comment syntax.
```

**Example Review Comment**:

```markdown
### 🔴 Critical: SQL Injection Vulnerability

**File**: `src/services/notificationService.js`
**Line**: 45

**Issue**: Raw string concatenation in SQL query allows SQL injection.

**Current Code**:
```javascript
const query = `SELECT * FROM notifications WHERE user_id = '${userId}'`;
```

**Suggested Fix**:
```javascript
const query = 'SELECT * FROM notifications WHERE user_id = $1';
const result = await db.query(query, [userId]);
```

**Rationale**: Parameterized queries prevent SQL injection attacks by separating SQL logic from data.

**References**: [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
```

**Validation Checkpoint**:
- [ ] All files reviewed
- [ ] Security issues identified
- [ ] Performance concerns noted
- [ ] Constructive feedback provided
- [ ] Code examples included
- [ ] Severity appropriately assigned

### Solution

Effective PR reviews:
1. Start with high-level architecture review
2. Then review each file systematically
3. Provide specific, actionable feedback
4. Include code examples for fixes
5. Acknowledge good practices too

### Key Takeaways
- Review systematically, not randomly
- Focus on high-impact issues first
- Provide solutions, not just problems
- Be specific with line numbers
- Use severity levels for prioritization

## Exercise 2: Review Automation (15 minutes)

### Objective
Create automated review scripts and checklists.

### Instructions

**Step 1: Create Review Checklist**

```
Create a comprehensive PR review checklist for my team:

Project context:
- Node.js backend API
- React frontend
- MongoDB database
- Microservices architecture

Include checklists for:
1. General (applies to all PRs)
2. Backend changes
3. Frontend changes
4. Database migrations
5. Security-sensitive changes
6. Performance-critical changes

Format as markdown checkboxes.
```

**Example Checklist**:

```markdown
## General PR Review Checklist

### Code Quality
- [ ] Code follows project style guide
- [ ] Functions are small and focused
- [ ] Variable names are descriptive
- [ ] No commented-out code
- [ ] No debugging statements (console.log, etc.)

### Testing
- [ ] All new code has tests
- [ ] Tests are meaningful and comprehensive
- [ ] Edge cases are tested
- [ ] Test coverage meets threshold (>80%)
- [ ] Tests pass locally

### Documentation
- [ ] Public APIs are documented
- [ ] Complex logic has comments
- [ ] README updated if needed
- [ ] CHANGELOG updated

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Authentication/authorization correct
- [ ] No SQL injection vulnerabilities
- [ ] Dependencies are up to date

### Performance
- [ ] No N+1 query problems
- [ ] Database indexes present
- [ ] Large operations are paginated
- [ ] Caching used appropriately

## Backend-Specific Checklist

- [ ] API versioning followed
- [ ] Error responses are consistent
- [ ] Logging is appropriate
- [ ] Transactions used where needed
- [ ] Rate limiting implemented if public endpoint

## Database Migration Checklist

- [ ] Migration is reversible (rollback script)
- [ ] Migration tested on copy of production data
- [ ] Indexes added for new columns
- [ ] No breaking changes without deprecation period
- [ ] Migration execution time estimated
```

**Step 2: Automated Static Analysis**

Create script to run automated checks:

```bash
#!/bin/bash
# pr-checks.sh

echo "Running automated PR checks..."

# Linting
echo "→ Running linter..."
npm run lint || exit 1

# Security audit
echo "→ Running security audit..."
npm audit --audit-level=moderate || exit 1

# Tests
echo "→ Running tests..."
npm test || exit 1

# Test coverage
echo "→ Checking coverage..."
npm run test:coverage || exit 1

# Check for secrets
echo "→ Scanning for secrets..."
git diff origin/main...HEAD | grep -iE '(password|secret|api_key|token).*=.*["\047]' && echo "⚠️  Possible secret found" && exit 1

# Check for TODOs
echo "→ Checking for TODOs..."
git diff origin/main...HEAD | grep -i 'TODO' && echo "ℹ️  TODOs found (review needed)"

# Check bundle size (frontend)
if [ -f "package.json" ]; then
  echo "→ Analyzing bundle size..."
  npm run analyze-bundle
fi

echo "✅ All automated checks passed!"
```

**Step 3: Prompt Templates for Common Scenarios**

```
Create Claude prompt templates for reviewing:

1. Bug fix PRs
2. Refactoring PRs
3. Database migration PRs
4. Security patch PRs
5. Performance optimization PRs

Each template should:
- Ask the right questions
- Focus on scenario-specific concerns
- Generate actionable feedback
```

**Example Template - Bug Fix Review**:

```
Review this bug fix PR:

Title: [PR title]
Bug ticket: [ticket number]
Files changed: [list]
Changes: [git diff]

Bug fix specific checks:
1. Does the fix address the root cause or just symptoms?
2. Are there tests that would have caught this bug?
3. Could this fix introduce new bugs?
4. Are there similar bugs elsewhere in the codebase?
5. Is the fix minimal and focused?
6. Does it handle edge cases properly?

Provide:
- Root cause analysis
- Fix quality assessment
- Suggestions for preventing similar bugs
- Recommended additional tests
```

**Validation Checkpoint**:
- [ ] Checklist covers all important areas
- [ ] Automated checks are reliable
- [ ] Templates are reusable
- [ ] False positives minimized

### Solution

Review automation includes:
1. Static analysis tools
2. Comprehensive checklists
3. Reusable prompt templates
4. CI/CD integration
5. Consistent standards

### Key Takeaways
- Automate what can be automated
- Checklists prevent missing important items
- Templates ensure consistency
- Focus human review on complex logic
- Iterate and improve process over time

## Exercise 3: Review Different PR Types (15 minutes)

### Objective
Practice reviewing different types of changes with appropriate focus.

### Instructions

**Scenario 1: Performance Optimization PR**

```
Review this performance optimization PR:

Title: Optimize database queries for user dashboard
Description: Reduced dashboard load time from 3s to 300ms

Changes:
- Added database indexes
- Implemented query result caching
- Optimized N+1 queries with joins
- Added pagination

[paste relevant code changes]

Review focus:
1. Verify performance claims (benchmark results)
2. Check for new issues introduced
3. Validate caching strategy
4. Assess memory usage impact
5. Review index choices
6. Check pagination implementation

Provide performance-specific feedback.
```

**Scenario 2: Refactoring PR**

```
Review this refactoring PR:

Title: Extract user service layer
Description: Separate business logic from controllers

Changes:
- Created UserService class
- Moved logic from controllers to service
- Updated tests
- No functional changes

[paste changes]

Refactoring-specific review:
1. Is functionality preserved? (no behavior changes)
2. Is code more maintainable after refactoring?
3. Are tests still comprehensive?
4. Is the service layer properly abstracted?
5. Are there opportunities for further refactoring?

Validate this is a safe refactoring.
```

**Scenario 3: Database Migration PR**

```
Review this database migration PR:

Title: Add user_verified column
Description: Track email verification status

Migration:
[paste migration up/down scripts]

Migration-specific checks:
1. Is migration reversible?
2. What happens to existing data?
3. Is there a default value?
4. Are indexes needed?
5. What's the execution time on production-sized data?
6. Is there a data backfill plan?
7. Are there breaking changes?

Assess migration safety and provide deployment recommendations.
```

**Validation Checkpoint**:
- [ ] Review adapted to PR type
- [ ] Type-specific concerns addressed
- [ ] Deployment risks identified
- [ ] Rollback plan validated

### Solution

Different PR types need different review focus:
- **Feature**: Functionality, tests, docs
- **Bug fix**: Root cause, test coverage, regression risk
- **Refactoring**: Behavior preservation, maintainability
- **Performance**: Benchmarks, trade-offs, monitoring
- **Migration**: Reversibility, data safety, execution time

### Key Takeaways
- Adapt review style to change type
- Each type has specific risks
- Deployment strategy matters
- Consider rollback scenarios
- Validate claims with evidence

## Exercise 4: Constructive Feedback (10 minutes)

### Objective
Learn to provide feedback that's helpful and constructive.

### Instructions

**Transform Negative to Constructive**

```
Rewrite these review comments to be more constructive:

1. "This code is terrible."

2. "Why didn't you use async/await?"

3. "This will never scale."

4. "You clearly don't understand how this works."

5. "This is the wrong approach."

For each, provide:
- Constructive version
- Specific issue identified
- Suggested improvement
- Rationale
- Encouraging note if applicable
```

**Example Transformations**:

Before:
```
This code is terrible.
```

After:
```
I see some opportunities to improve this code:

1. Extract the business logic into a separate service for better testability
2. Add input validation to prevent invalid data
3. Consider error handling for the database call

Would you like help refactoring this? I can provide examples of the pattern we typically use for this type of operation.
```

**Guidelines for Constructive Feedback**:

```
Create guidelines for constructive PR feedback:

Include:
1. How to phrase critical feedback
2. When to suggest vs require changes
3. How to acknowledge good work
4. How to explain rationale
5. When to discuss synchronously vs async

Provide examples of good vs bad feedback.
```

**Validation Checkpoint**:
- [ ] Feedback is specific and actionable
- [ ] Tone is helpful, not critical
- [ ] Solutions provided, not just problems
- [ ] Rationale explained
- [ ] Encouragement included

### Solution

Constructive feedback:
1. Describes the issue specifically
2. Explains why it matters
3. Suggests concrete improvements
4. Provides examples or references
5. Acknowledges what was done well

### Key Takeaways
- Focus on code, not the person
- Be specific about problems
- Always suggest solutions
- Explain your reasoning
- Recognize good practices

## Common Issues and Troubleshooting

### Issue 1: Review Taking Too Long

**Solution**:
- Use checklists to stay focused
- Automate routine checks
- Review in multiple sessions
- Focus on high-impact issues first
- Use Claude for initial analysis

### Issue 2: Missing Context

**Solution**:
- Ask PR author for clarification
- Review related issues/tickets
- Check commit history
- Run code locally
- Request design doc for large changes

### Issue 3: Too Many Minor Comments

**Solution**:
- Distinguish blocking vs non-blocking
- Group related comments
- Use automated linting for style
- Focus on substantive issues
- Save minor issues for later

## Extensions for Advanced Learners

### Extension 1: CI/CD Integration

Integrate Claude-assisted reviews into CI:
- Automated initial review
- Security scanning
- Performance regression detection
- Suggested reviewers based on changes

### Extension 2: Review Metrics

Track and improve review quality:
- Time to first review
- Number of review iterations
- Bugs found in review vs production
- Review coverage completeness

### Extension 3: Team Review Standards

Create team-wide standards:
- Review SLAs
- Approval requirements
- Review assignment strategy
- Escalation process

## Summary

You've learned to:
- Perform comprehensive PR reviews
- Automate routine review tasks
- Adapt reviews to different change types
- Provide constructive, actionable feedback
- Use checklists and templates
- Balance thoroughness with speed

## Next Steps

1. Review actual PRs using these techniques
2. Create review templates for your team
3. Set up automated review checks
4. Proceed to Lab 007: MCP Setup

---

**Lab Completion**: You've completed Lab 006. You can now conduct thorough, constructive PR reviews efficiently using Claude as your review assistant.
