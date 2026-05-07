# CLI Workflows

## Terminal-Based AI Development Patterns

---

## 🎯 Overview

Command-line workflows combine shell scripts, git operations, build tools, and AI assistance to create efficient development pipelines. Learn how to leverage Claude through the terminal for everything from code generation to deployment automation.

**Time to Master:** 3-4 hours  
**Outcome:** Master CLI-based AI-assisted development workflows

---

## 💡 CLI vs. Web Interface

### Why CLI Matters

**Advantages:**
```
✓ Direct file system access
✓ Execute commands immediately
✓ Integrate with existing tools (git, npm, etc.)
✓ Scriptable and automatable
✓ Persistent context
✓ Faster iteration cycles
✓ Better for large codebases
```

**When to use CLI:**
- Multi-file changes
- Git workflows
- Build/test automation
- Deployment tasks
- Repository analysis
- Refactoring projects

**When to use Web:**
- Quick questions
- Learning/exploration
- Code snippets
- No local project
- Sharing conversations

---

## 🔧 Core CLI Patterns

### Pattern 1: Git-Integrated Development

**Workflow:**
```bash
# Start feature work
$ claude "Create feature branch for user notifications"

Claude: [Executes: git checkout -b feature/user-notifications]
Branch created. What should the notification system do?

$ claude "Add real-time notifications using WebSockets"

Claude: I'll implement this:
1. Backend WebSocket server
2. Notification model
3. Frontend WebSocket client
4. React notification component

[Creates files]
[Modifies existing files]

Files changed:
  src/server/websocket.ts (new)
  src/models/Notification.ts (new)
  src/hooks/useNotifications.ts (new)
  src/components/NotificationBadge.tsx (new)
  
$ claude "Commit this work"

Claude: [Proposes commit message]
feat(notifications): add real-time WebSocket notifications

- Implement WebSocket server for push notifications
- Add Notification model and database schema
- Create React hook for notification subscription
- Add NotificationBadge component

Proceed? (y/n)

$ y

Claude: [Executes: git add -A]
[Executes: git commit -m "..."]
Committed: feat(notifications): add real-time WebSocket notifications
```

### Pattern 2: Test-Driven Development

**Workflow:**
```bash
$ claude "Write tests for email validation function"

Claude: [Creates __tests__/utils/email.test.ts]

Created 8 tests:
✓ Valid email formats
✓ Invalid email formats  
✓ Edge cases (null, empty, unicode)
✓ Plus addressing
✓ Multiple @ symbols
✓ Missing domain
✓ Missing local part
✓ Special characters

Run tests?

$ y

Claude: [Executes: npm test email.test.ts]

FAIL __tests__/utils/email.test.ts
  ✗ 8 tests (implementation not found)

$ claude "Implement the email validation function to pass these tests"

Claude: [Creates src/utils/email.ts]

function validateEmail(email: string | null): boolean {
  if (!email) return false;
  
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

Run tests again?

$ y

Claude: [Executes: npm test email.test.ts]

PASS __tests__/utils/email.test.ts
  ✓ All 8 tests passing

Tests: 8 passed
```

### Pattern 3: Code Review Workflow

**Workflow:**
```bash
$ git diff main

$ claude "Review this diff for issues"

Claude: [Reads git diff]

Code Review Findings:

🔴 Critical Issues:
1. Line 45: SQL injection vulnerability
   - User input directly in query string
   - Fix: Use parameterized query

2. Line 78: Password stored in plain text
   - Should be hashed with bcrypt
   - Security risk

🟡 Warnings:
1. Line 23: Missing error handling
   - API call can throw
   - Add try/catch

2. Line 56: Inefficient N+1 query
   - Loop making individual DB calls
   - Use bulk query instead

✅ Good:
- Proper TypeScript types
- Tests included
- Clear variable names

Shall I fix the critical issues?

$ y

Claude: [Modifies files to fix issues]

Fixed:
✓ Replaced string interpolation with parameterized query
✓ Added bcrypt password hashing
✓ Added error handling
✓ Optimized database queries

Run tests to verify fixes?

$ y

Claude: [Executes: npm test]

PASS  All tests still passing
```

### Pattern 4: Dependency Management

**Workflow:**
```bash
$ claude "Audit dependencies for security issues"

Claude: [Executes: npm audit]

Found 3 vulnerabilities:

High: lodash < 4.17.21
  Path: lodash@4.17.19
  Fix: npm update lodash

Moderate: axios < 0.21.1
  Path: axios@0.20.0  
  Fix: npm update axios

Low: dot-prop < 5.2.0
  Path: dot-prop@4.2.1
  Fix: npm update dot-prop

Update all? (y/n)

$ y

Claude: [Executes: npm update lodash axios dot-prop]
[Executes: npm audit]

✓ All vulnerabilities fixed
[Executes: npm test]
✓ All tests still passing

$ claude "Commit dependency updates"

Claude: [Creates commit]
chore(deps): update dependencies to fix security vulnerabilities

- lodash 4.17.19 → 4.17.21 (high severity)
- axios 0.20.0 → 0.21.1 (moderate severity)  
- dot-prop 4.2.1 → 5.2.0 (low severity)

All tests passing after updates.
```

### Pattern 5: Build and Deploy

**Workflow:**
```bash
$ claude "Run production build and verify"

Claude: [Executes: npm run build]

Building for production...
✓ TypeScript compilation complete
✓ Webpack bundle created
✓ Assets optimized

Bundle size: 245 KB (gzipped)

[Executes: npm run lint]
✓ No linting errors

[Executes: npm test]
✓ All tests passing (42/42)

Production build verified. Ready to deploy?

$ claude "Deploy to staging"

Claude: [Executes: ./scripts/deploy.sh staging]

Deploying to staging...
✓ Docker image built
✓ Pushed to registry
✓ Deployed to staging cluster
✓ Health check passed

Staging URL: https://staging.example.com

Run smoke tests?

$ y

Claude: [Executes: npm run test:e2e:staging]

E2E Tests:
✓ Login flow
✓ Create resource
✓ Update resource  
✓ Delete resource

All smoke tests passing. Safe to deploy to production.
```

---

## ⚡ Advanced CLI Workflows

### Workflow: Codebase Migration

**Scenario: Migrate from JavaScript to TypeScript**

```bash
$ claude "Plan migration from JS to TypeScript"

Claude: Migration plan:

1. Setup (1-2 hours)
   - Install TypeScript
   - Configure tsconfig.json
   - Add type definitions

2. Incremental conversion (by module):
   - utils/ (5 files, ~500 lines)
   - models/ (8 files, ~1000 lines)
   - services/ (12 files, ~2000 lines)
   - api/ (15 files, ~1500 lines)
   - components/ (25 files, ~3000 lines)

3. Testing & validation
   - Fix type errors
   - Update tests
   - Verify builds

Estimated total: 2-3 days
Start with utils/ (smallest, most isolated)?

$ y

Claude: [Installs TypeScript]
[Creates tsconfig.json]
[Renames utils/*.js to *.ts]
[Adds type annotations]

Converted utils/:
✓ validation.ts (added 12 type annotations)
✓ formatting.ts (added 8 type annotations)  
✓ parsing.ts (added 15 type annotations)
✓ helpers.ts (added 10 type annotations)
✓ constants.ts (added 5 type annotations)

[Executes: tsc --noEmit]

TypeScript compilation successful.
[Executes: npm test utils]
✓ All utils tests passing

utils/ migration complete. Continue with models/?
```

### Workflow: Performance Optimization

```bash
$ claude "Profile and optimize API performance"

Claude: I'll analyze performance:

[Executes: npm run benchmark]

Benchmark results:
GET /api/users       - 245ms (slow)
GET /api/products    - 89ms  
POST /api/orders     - 456ms (very slow)
GET /api/analytics   - 1200ms (critical)

Analyzing slow endpoints...

[Reads src/api/users.ts]
[Reads src/api/orders.ts]
[Reads src/api/analytics.ts]

Found performance issues:

1. GET /api/users (245ms)
   - N+1 query (loading related data in loop)
   - Fix: Use JOIN or include in initial query

2. POST /api/orders (456ms)
   - Multiple sequential database calls
   - Fix: Use transaction with batch insert

3. GET /api/analytics (1200ms)
   - Computing aggregations on every request
   - No caching
   - Fix: Add Redis cache with 5-minute TTL

Implement all fixes? (y/n)

$ y

Claude: [Optimizes queries]
[Adds caching]
[Implements transactions]

[Executes: npm run benchmark]

New results:
GET /api/users       - 45ms  (82% faster)
GET /api/products    - 89ms  (unchanged)
POST /api/orders     - 95ms  (79% faster)
GET /api/analytics   - 120ms (90% faster)

All tests still passing. Commit optimizations?
```

### Workflow: Database Schema Evolution

```bash
$ claude "Create migration to add user roles"

Claude: I'll create a migration for user roles:

Schema changes:
1. Create roles table
2. Create user_roles junction table
3. Add default 'user' role
4. Seed admin/moderator roles

[Creates migrations/005_add_user_roles.sql]

-- Create roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create junction table  
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  granted_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- Seed default roles
INSERT INTO roles (name, description) VALUES
  ('user', 'Standard user'),
  ('moderator', 'Can moderate content'),
  ('admin', 'Full system access');

-- Give existing users the 'user' role
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id 
FROM users u
CROSS JOIN roles r
WHERE r.name = 'user';

Review migration? (y/n)

$ y

Claude: Migration looks good. Run on development DB?

$ y

Claude: [Executes: npm run migrate]

Running migration 005_add_user_roles.sql
✓ Created roles table
✓ Created user_roles table
✓ Seeded 3 default roles
✓ Assigned 127 users the 'user' role

Migration successful.

Update code to use roles?
```

---

## 🎯 Pipeline Automation

### CI/CD Integration

**`.github/workflows/ai-review.yml`:**
```yaml
name: AI Code Review

on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: AI Code Review
        run: |
          claude "Review this PR for:
          - Security vulnerabilities
          - Performance issues
          - Best practice violations
          - Test coverage gaps
          
          PR diff: $(git diff origin/main...HEAD)"
          
      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              body: process.env.CLAUDE_OUTPUT
            })
```

### Pre-commit Hooks

**`.husky/pre-commit`:**
```bash
#!/bin/sh

# AI-powered pre-commit validation
claude "Review staged changes for:
- Syntax errors
- Type errors
- Linting issues
- Security problems
- Missing tests

Staged files: $(git diff --cached --name-only)"

if [ $? -ne 0 ]; then
  echo "❌ AI review found issues. Commit blocked."
  exit 1
fi

echo "✅ AI review passed"
```

### Release Automation

```bash
$ claude "Prepare release v2.0.0"

Claude: Release preparation checklist:

[Executes: git fetch]
✓ On latest main branch

[Executes: npm run test]
✓ All tests passing (156/156)

[Executes: npm run build]
✓ Production build successful

[Executes: npm audit]
✓ No vulnerabilities

[Reads CHANGELOG.md]

Generating changelog for v2.0.0...

# v2.0.0 (2026-05-07)

## ✨ Features
- Add real-time notifications (#45)
- Implement user roles and permissions (#52)
- Add dark mode support (#48)

## 🐛 Bug Fixes  
- Fix memory leak in WebSocket connection (#50)
- Correct timezone handling in reports (#49)

## 🔧 Performance
- Optimize database queries (82% faster)
- Add Redis caching for analytics

## 📝 Documentation
- Update API documentation
- Add deployment guide

[Creates git tag v2.0.0]
[Updates package.json version]

Ready to push release? (y/n)
```

---

## 📚 Shell Script Integration

### Custom Scripts

**`scripts/ai-review.sh`:**
```bash
#!/bin/bash

# AI-powered code review script

FILES=$(git diff --name-only main)

echo "🤖 AI Review Starting..."
echo "Files changed: $(echo $FILES | wc -w)"

claude "Review these changes:

Files: $FILES

Check for:
1. Breaking changes
2. Security issues
3. Performance regressions
4. Test coverage
5. Documentation updates needed

Diff:
$(git diff main)"

echo "✅ AI Review Complete"
```

**Usage:**
```bash
$ ./scripts/ai-review.sh

🤖 AI Review Starting...
Files changed: 7

Review Results:
✅ No breaking changes
⚠️  1 security issue (see details)
✅ No performance regressions
⚠️  2 files lack test coverage
⚠️  API change needs documentation

Details:
...

✅ AI Review Complete
```

---

## ✅ Best Practices

### Effective CLI Usage

**DO:**
✅ Use Claude for complex multi-step tasks  
✅ Let Claude execute commands directly  
✅ Review generated code before committing  
✅ Use Claude for code reviews  
✅ Integrate with existing tools  
✅ Maintain conversation context  
✅ Ask for explanations when needed  

**DON'T:**
❌ Paste large file contents (let Claude read)  
❌ Run destructive commands without review  
❌ Skip testing after AI changes  
❌ Ignore AI suggestions without understanding  
❌ Use for simple one-liner tasks  

### Security Considerations

**Always review:**
- Database migrations
- Security-related code
- Credential management
- API endpoint changes
- Permission/authorization logic

**Never blindly execute:**
- Destructive commands (rm -rf, DROP TABLE)
- Production deployments
- Security configuration changes
- Dependency removals

---

## 🚀 Pro Tips

### Tip 1: Context Files

Create `.claude/context.md`:
```markdown
# Project Conventions

## Git
- Branch naming: feature/*, bugfix/*, hotfix/*
- Commit format: Conventional Commits
- Always squash feature branches

## Testing
- Minimum 80% coverage
- Tests required for all new features
- E2E tests for critical paths

## Deployment
- Staging before production
- Run smoke tests after deploy
- Rollback if any test fails
```

### Tip 2: Command Aliases

```bash
# ~/.bashrc or ~/.zshrc

alias cai='claude'
alias car='claude "Review my staged changes"'
alias cat='claude "Run all tests"'
alias cad='claude "Deploy to staging"'
```

### Tip 3: Workflow Templates

```bash
$ claude "Start feature workflow for user-settings"

Claude: Starting feature workflow...

[Creates branch: feature/user-settings]
[Creates src/features/user-settings/]
[Creates tests]
[Sets up component structure]

Feature scaffold ready. What should user settings include?
```

---

## 🎓 Practice Exercise

**Build a CLI workflow for:**

1. Create feature branch
2. Generate boilerplate
3. Implement feature with tests
4. Run linting and tests
5. Review code quality
6. Commit with conventional message
7. Push and create PR

**Do this all through CLI with Claude assistance.**

---

**Next:** [Context Optimization →](./13-context-optimization.md)
