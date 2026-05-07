# Git Workflows

## Mastering Git with AI Assistance

---

## 🎯 Learning Objectives

By the end of this section, you will be able to:

- ✅ Create well-structured, atomic commits with AI assistance
- ✅ Write clear, meaningful commit messages following best practices
- ✅ Manage feature branches effectively
- ✅ Resolve merge conflicts using AI-powered analysis
- ✅ Use git hooks for automation and quality checks
- ✅ Create comprehensive pull request descriptions
- ✅ Understand and follow git workflows (Git Flow, GitHub Flow, Trunk-Based)
- ✅ Use AI to analyze git history and identify patterns

---

## 📖 Understanding Git Workflows

### Why Git Workflows Matter

Git is not just a version control tool - it's a collaboration and communication mechanism.

**Good Git Practices:**
- Clear history of changes
- Easy to understand what changed and why
- Simple to review code
- Safe to roll back changes
- Effective team collaboration

**Poor Git Practices:**
- Confusing commit history
- Unclear what changed
- Difficult code reviews
- Risky rollbacks
- Team friction

### Common Git Workflows

**Git Flow:**
```
main (production)
  ↓
develop (integration)
  ↓
feature/* (individual features)
  ↓
release/* (release preparation)
  ↓
hotfix/* (emergency fixes)
```

**GitHub Flow (simpler):**
```
main (always deployable)
  ↓
feature/* (short-lived branches)
```

**Trunk-Based Development:**
```
main (continuous integration)
  ↓
short-lived feature branches (< 1 day)
```

---

## 📝 Commit Message Best Practices

### The Anatomy of a Good Commit Message

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Example:**
```
feat(auth): add JWT refresh token mechanism

Implement automatic token refresh to improve user experience.
Tokens are refreshed 5 minutes before expiration.

- Add refreshToken endpoint
- Update auth middleware to check expiration
- Add token refresh logic to frontend interceptor

Closes #123
```

### Conventional Commits Standard

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, no code change
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvement
- `test:` Adding missing tests
- `chore:` Maintenance tasks
- `ci:` CI/CD changes
- `build:` Build system changes

### AI-Assisted Commit Messages

#### Prompt Template: Generate Commit Message

```
Generate a commit message for these changes:

```bash
$ git diff --staged
```

[paste git diff output]

Follow conventional commits format:
- Use appropriate type (feat, fix, refactor, etc.)
- Include scope if relevant
- Write clear subject (50 chars or less)
- Add descriptive body if needed
- Reference related issues

Provide 2-3 options with different levels of detail.
```

#### Example Request

```
Generate commit message for these changes:

```diff
diff --git a/src/services/authService.ts b/src/services/authService.ts
index 1234567..abcdefg 100644
--- a/src/services/authService.ts
+++ b/src/services/authService.ts
@@ -10,6 +10,15 @@ export class AuthService {
     return this.jwtHelper.generateToken(user);
   }
   
+  async refreshToken(oldToken: string): Promise<string> {
+    const decoded = this.jwtHelper.verifyToken(oldToken);
+    const user = await this.userRepository.findById(decoded.userId);
+    if (!user) {
+      throw new UnauthorizedError('Invalid token');
+    }
+    return this.jwtHelper.generateToken(user);
+  }
+
   async validateToken(token: string): Promise<User> {
     const decoded = this.jwtHelper.verifyToken(token);
     return this.userRepository.findById(decoded.userId);
```

Give me 3 commit message options.
```

**AI Response:**

```
**Option 1 (Concise):**
feat(auth): add token refresh functionality

**Option 2 (Detailed):**
feat(auth): implement JWT token refresh mechanism

Add refreshToken method to AuthService that generates a new
token from an existing valid token. This improves UX by
allowing seamless token renewal.

**Option 3 (Very Detailed):**
feat(auth): add JWT refresh token mechanism

Implement automatic token refresh to improve user experience.
Users will no longer be logged out when their token expires.

Changes:
- Add refreshToken method to AuthService
- Verify existing token before issuing new one
- Retrieve user from database to ensure still active
- Return new token with extended expiration

Related: #123
```

---

## 🔀 Branch Management

### Feature Branch Workflow

#### Creating Feature Branches with AI

**Prompt Template: Branch Naming**

```
I'm working on [describe feature/task].

Ticket: JIRA-123
Summary: Add user profile picture upload

Suggest a good feature branch name following our convention:
- Lowercase with hyphens
- Include ticket number
- Descriptive but concise
- Max 50 characters

Provide 3 options.
```

**AI Response:**
```
1. feature/JIRA-123-profile-picture-upload
2. feature/JIRA-123-user-avatar-support
3. feature/JIRA-123-add-profile-images
```

### Keeping Branches Updated

#### Merging vs. Rebasing

**When to Merge:**
- Public/shared branches
- Want to preserve complete history
- Working with team on same branch

**When to Rebase:**
- Private feature branches
- Want clean, linear history
- Before creating pull request

#### AI-Assisted Rebase Planning

```
I have a feature branch with 15 commits that needs rebasing onto main.

My commits:
[paste git log output]

Main branch has moved forward with:
[paste main branch log]

Help me plan the rebase:
1. Should I squash any commits?
2. What order should commits be in?
3. Are there potential conflicts?
4. Should I split any large commits?

Provide rebase strategy.
```

---

## 🔧 Resolving Merge Conflicts

### Understanding Merge Conflicts

Conflicts occur when:
- Same lines changed in both branches
- File deleted in one branch, modified in other
- Different changes to same file structure

### AI-Powered Conflict Resolution

#### Prompt Template: Conflict Analysis

```
I have a merge conflict in this file:

```conflict
<<<<<<< HEAD
function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
=======
function calculateTotal(items: Item[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  return subtotal + tax;
}
>>>>>>> feature/add-tax-calculation
```

Context:
- HEAD: main branch with original calculation
- feature/add-tax-calculation: adds tax calculation

Help me resolve this conflict:
1. Explain what each version does
2. Suggest best resolution
3. Provide resolved code
4. Explain the rationale
```

**AI Response:**

```markdown
## Conflict Analysis

**HEAD (main) version:**
- Simple total calculation
- Multiplies price by quantity
- No tax included

**Feature branch version:**
- Calculates subtotal same way
- Adds 10% tax
- Returns total with tax

## Recommended Resolution

Keep the feature branch version (with tax) as it:
1. Maintains backward compatibility (still calculates correctly)
2. Adds the new required functionality
3. Is more complete

## Resolved Code

```typescript
function calculateTotal(items: Item[]): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  return subtotal + tax;
}
```

## Follow-up Actions
- Update tests to expect tax in total
- Document that totals now include tax
- Update API documentation if this is exposed
```

### Complex Conflict Resolution

#### Multi-File Conflict Strategy

```
I have merge conflicts in 5 files:

1. src/models/Order.ts - different field additions
2. src/services/orderService.ts - different method implementations
3. src/api/orders.ts - different endpoint modifications
4. tests/orderService.test.ts - different test additions
5. package.json - different dependency versions

Files content:
[paste conflict sections for each file]

Provide a resolution strategy:
1. Which conflicts to resolve first?
2. Dependencies between files?
3. Resolution approach for each
4. Testing strategy after resolution
```

---

## 🪝 Git Hooks and Automation

### Pre-Commit Hooks

Automate checks before allowing commits.

#### Setting Up Pre-Commit Hooks with AI

```
Help me create a pre-commit hook that:
1. Runs ESLint on staged files
2. Runs Prettier formatting
3. Runs TypeScript type checking
4. Checks for console.log statements
5. Validates commit message format

Provide:
- .husky/pre-commit script
- Package.json configuration
- Installation instructions
```

**Generated Pre-Commit Hook:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run ESLint
echo "Running ESLint..."
npm run lint-staged || {
  echo "❌ ESLint failed. Please fix errors before committing."
  exit 1
}

# Run Prettier
echo "Running Prettier..."
npm run prettier-check || {
  echo "❌ Prettier formatting issues found. Run 'npm run prettier-fix'."
  exit 1
}

# TypeScript check
echo "Running TypeScript check..."
npm run type-check || {
  echo "❌ TypeScript errors found. Please fix type issues."
  exit 1
}

# Check for console.log
echo "Checking for console.log..."
if git diff --cached --name-only | xargs grep -n "console.log" 2>/dev/null; then
  echo "❌ console.log statements found. Please remove them."
  exit 1
fi

echo "✅ All pre-commit checks passed!"
```

### Commit Message Validation Hook

```
Create a commit-msg hook that validates:
1. Follows conventional commits format
2. Subject line <= 50 characters
3. Body lines <= 72 characters
4. References issue number if fixing a bug
5. No WIP or fixup commits on main branch

Provide the hook script.
```

---

## 📤 Pull Request Workflows

### Creating Comprehensive PR Descriptions

#### Prompt Template: PR Description Generator

```
Generate a pull request description for:

Branch: feature/JIRA-123-user-notifications
Base: main

Changes:
[paste git log or summary]

Files changed:
[paste file list]

Generate PR description including:
1. Title (following conventional commits)
2. Summary of changes
3. Motivation and context
4. Type of change (feature/bug fix/refactor)
5. How has this been tested?
6. Checklist for reviewer
7. Related issues/tickets
8. Screenshots (if UI changes)
9. Breaking changes (if any)

Follow our team's PR template.
```

**Generated PR Description:**

```markdown
# feat(notifications): implement real-time user notifications

## Summary
This PR adds a complete real-time notification system allowing users to receive instant updates about important events.

## Motivation and Context
Users currently have to refresh the page to see new notifications. This creates a poor UX and increases server load. 

Implements: JIRA-123

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Add WebSocket connection for real-time updates
- Create notification service with backend support
- Implement notification bell UI component
- Add notification preferences to user settings
- Create notification database schema and migrations

## How Has This Been Tested?
- [x] Unit tests for notification service (95% coverage)
- [x] Integration tests for WebSocket connection
- [x] Manual testing on dev environment
- [x] Tested with 100+ concurrent users
- [x] Tested notification delivery reliability
- [x] Cross-browser testing (Chrome, Firefox, Safari)

## Checklist for Reviewers
Please verify:
- [ ] Code follows project style guidelines
- [ ] Tests cover edge cases
- [ ] WebSocket connection handles disconnections gracefully
- [ ] Notification preferences are persisted correctly
- [ ] No performance regression
- [ ] Database migration is reversible
- [ ] Documentation is updated

## Screenshots
[Include screenshots of notification UI]

## Database Changes
- New table: `notifications`
- New columns in `users`: `notification_preferences`
- Migration file: `migrations/20260505_add_notifications.sql`

## Breaking Changes
None - this is a new feature with no impact on existing functionality.

## Performance Impact
- Adds WebSocket connection (minimal overhead)
- Database queries optimized with indexes
- Notification polling reduced by 90%

## Follow-up Tasks
- [ ] Add email notification fallback (JIRA-124)
- [ ] Implement notification grouping (JIRA-125)
- [ ] Add push notifications for mobile app (JIRA-126)

## Related Links
- Design doc: [link]
- API documentation: [link]
- Figma designs: [link]
```

### PR Review Checklist Generation

```
Create a PR review checklist for:

PR Type: New feature - Payment integration
Tech Stack: Node.js, TypeScript, React, PostgreSQL
Changes: 15 files, +800 lines

Generate checklist covering:
1. Code quality
2. Testing
3. Security
4. Performance
5. Documentation
6. Dependencies
7. Database changes
8. API contracts
9. Error handling
10. Logging

Make it specific to this type of change.
```

---

## 🔍 Git History Analysis

### Understanding Codebase Evolution

#### Prompt Template: Git History Analysis

```
Analyze git history for this file:

```bash
$ git log --follow --oneline -- src/services/authService.ts
```

[paste git log output]

Analyze:
1. How has this file evolved?
2. What were major changes?
3. Who are main contributors?
4. Are there patterns in changes?
5. Any concerning trends?
6. Recommendations for future?
```

### Identifying Code Churn

```
Analyze code churn for our authentication module:

```bash
$ git log --since="3 months ago" --numstat -- src/auth/
```

[paste output showing frequent changes]

Identify:
1. Which files change most frequently?
2. Is high churn a problem?
3. What might be causing it?
4. How to reduce churn?
5. Refactoring opportunities?
```

### Finding Bug Introduction

```
Help me find when this bug was introduced:

Bug: Users can't log in with special characters in password

Last known working: 2 weeks ago
Current: Not working

Relevant files:
- src/services/authService.ts
- src/utils/validators.ts
- src/middleware/authMiddleware.ts

Strategy to find the bug:
1. Which commits to check?
2. Git bisect strategy?
3. What to look for?
4. How to verify fix?
```

---

## 🎯 Practical Workflows

### Workflow 1: Feature Development with Git

```markdown
## Day 1: Start Feature

### 1. Create Branch
```bash
git checkout -b feature/JIRA-123-notifications
```

### 2. Make Initial Commits
Use AI for commit messages as you go:
- Setup files
- Add dependencies
- Create base structure

### 3. Push Branch
```bash
git push -u origin feature/JIRA-123-notifications
```

## Day 2-4: Development

### 1. Regular Commits
Make atomic commits for each logical change:
- Add notification model
- Create notification service
- Implement API endpoints
- Add frontend components
- Write tests

### 2. Keep Branch Updated
```bash
git fetch origin
git rebase origin/main
```

## Day 5: Prepare for PR

### 1. Clean Up Commits
Use AI to help decide:
- Which commits to squash?
- Better commit messages needed?
- Logical commit order?

### 2. Final Rebase
```bash
git rebase -i origin/main
```

### 3. Run Pre-PR Checks
- All tests pass
- Linting clean
- Types check
- No console.logs
- Documentation updated

### 4. Create PR
Use AI to generate comprehensive PR description

## Day 6+: Code Review

### 1. Address Feedback
Make commits addressing review comments

### 2. Update PR
Push changes, update PR description

### 3. Merge
Squash and merge when approved
```

### Workflow 2: Hotfix Process

```markdown
## Emergency Fix Process

### 1. Create Hotfix Branch from Main
```bash
git checkout main
git pull
git checkout -b hotfix/fix-login-error
```

### 2. Make Fix
- Identify root cause
- Implement fix
- Add test to prevent regression

### 3. Commit with Clear Message
Use AI to create excellent commit message explaining:
- What was broken
- Root cause
- How fix works
- Why this approach

### 4. Fast-Track Review
- Create PR immediately
- Tag as hotfix/urgent
- Request immediate review
- Include incident details

### 5. Deploy
- Merge to main
- Deploy immediately
- Monitor for issues
- Backport to release branches if needed
```

### Workflow 3: Resolving Complex Conflicts

```markdown
## Strategy for Complex Conflict Resolution

### 1. Understand Both Sides
```bash
git log --oneline main..feature-branch
git log --oneline feature-branch..main
```

Use AI to analyze what changed in each branch

### 2. Create Backup
```bash
git branch feature-branch-backup
```

### 3. Start Merge
```bash
git merge main
```

### 4. Resolve File by File
For each conflicted file:
- Use AI to analyze conflict
- Understand intent of both changes
- Resolve intelligently
- Test after each resolution

### 5. Verify Integration
- Run all tests
- Manual testing
- Check for subtle issues
- Verify nothing broken

### 6. Commit Resolution
Write clear merge commit message explaining resolutions
```

---

## 🏋️ Exercises

### Exercise 1: Commit Message Practice

**Difficulty:** Beginner  
**Time:** 30 minutes

**Task:**
1. Make 5 different types of changes to a project
2. Generate commit messages with AI for each
3. Manually refine the messages
4. Create a personal commit message style guide

**Deliverable:** 5 excellent commit messages + style guide

### Exercise 2: Interactive Rebase

**Difficulty:** Intermediate  
**Time:** 45 minutes

**Task:**
1. Create a feature branch with 10+ messy commits
2. Use AI to plan a clean commit history
3. Perform interactive rebase
4. Result: 3-5 clean, logical commits

**Deliverable:** Clean commit history

### Exercise 3: Conflict Resolution

**Difficulty:** Intermediate  
**Time:** 60 minutes

**Task:**
1. Create two branches with conflicting changes
2. Use AI to analyze conflicts
3. Resolve conflicts intelligently
4. Document resolution rationale

**Deliverable:** Resolved code + resolution doc

### Exercise 4: Git Hook Setup

**Difficulty:** Advanced  
**Time:** 90 minutes

**Task:**
1. Set up comprehensive git hooks for a project
2. Pre-commit: linting, formatting, tests
3. Commit-msg: message validation
4. Pre-push: additional checks

**Deliverable:** Working git hooks setup

---

## ✅ Best Practices

### Do's ✅

**Commits:**
- ✅ Make atomic commits (one logical change)
- ✅ Write clear, descriptive commit messages
- ✅ Commit frequently (easy to review, easy to revert)
- ✅ Follow conventional commits format
- ✅ Test before committing

**Branches:**
- ✅ Use descriptive branch names
- ✅ Keep branches short-lived
- ✅ Rebase regularly to stay current
- ✅ Delete merged branches
- ✅ Protect main/production branches

**PRs:**
- ✅ Write comprehensive PR descriptions
- ✅ Keep PRs focused and reviewable
- ✅ Respond promptly to review feedback
- ✅ Update PR as you address comments
- ✅ Ensure CI passes before requesting review

### Don'ts ❌

**Commits:**
- ❌ Don't commit untested code
- ❌ Don't make giant commits with multiple changes
- ❌ Don't use vague messages like "fix bug" or "update"
- ❌ Don't commit sensitive data or secrets
- ❌ Don't force push to shared branches

**Branches:**
- ❌ Don't keep long-lived feature branches
- ❌ Don't commit directly to main/master
- ❌ Don't leave stale branches hanging
- ❌ Don't rebase public/shared branches
- ❌ Don't forget to pull before starting work

**PRs:**
- ❌ Don't create massive PRs (1000+ lines)
- ❌ Don't mix unrelated changes in one PR
- ❌ Don't ignore review feedback
- ❌ Don't merge your own PRs without review
- ❌ Don't merge with failing CI

---

## 📚 Additional Resources

**Git Tools:**
- GitKraken - Visual git client
- Sourcetree - Free git GUI
- Git Graph (VS Code) - Visualize git history
- Conventional Commits extension

**Learning Resources:**
- "Pro Git" book (free online)
- Git documentation
- GitHub Git guides
- Atlassian Git tutorials

**Git Flow Resources:**
- Git Flow cheat sheet
- GitHub Flow guide
- Trunk-Based Development site

---

## 🎯 Key Takeaways

1. **Atomic Commits:** One logical change per commit makes history clear

2. **Good Messages:** Clear commit messages are documentation for future you

3. **Branch Strategy:** Follow team's workflow consistently

4. **Regular Rebasing:** Stay current to avoid big merge conflicts

5. **Use AI Wisely:** AI excels at commit messages and conflict analysis

6. **Automate with Hooks:** Catch issues before they reach main branch

7. **Comprehensive PRs:** Great PR descriptions speed up reviews

8. **Clean History:** Rebase/squash before merging for readable history

9. **Communicate Intent:** Git is a communication tool, use it well

10. **Practice Makes Perfect:** Git mastery comes from daily use

---

## ✅ Mastery Checklist

By the end of this section, you should be able to:

- [ ] Create atomic commits with perfect messages
- [ ] Use conventional commits format consistently
- [ ] Manage feature branches effectively
- [ ] Resolve merge conflicts confidently
- [ ] Set up and use git hooks
- [ ] Create comprehensive PR descriptions
- [ ] Perform interactive rebases
- [ ] Analyze git history for insights
- [ ] Use AI assistance for all git workflows

---

**Next:** [PR Review Workflows →](./06-pr-review-workflows.md)

---

*"Commit often, perfect later, publish once." - Git wisdom*

*Master git workflows, collaborate effectively, ship quality code.*
