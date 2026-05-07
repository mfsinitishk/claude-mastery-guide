# Claude Code Usage

## Mastering the Claude Code CLI

---

## 🎯 Overview

Claude Code is Anthropic's official CLI tool that brings Claude's capabilities directly into your terminal and development workflow. It provides persistent context, file system access, command execution, and deep integration with your codebase—all through a conversational interface.

**Time to Master:** 3-4 hours  
**Outcome:** Leverage Claude Code for efficient terminal-based development workflows

---

## 💡 What is Claude Code?

### Core Capabilities

**Claude Code provides:**
- **File System Access**: Read, write, and modify files directly
- **Command Execution**: Run shell commands, git operations, build tools
- **Persistent Context**: Maintains conversation history and codebase understanding
- **Tool Integration**: Git, package managers, build systems, testing frameworks
- **Project Memory**: Remembers project structure, conventions, and decisions
- **Multi-File Operations**: Coordinate changes across multiple files atomically

**vs. Web Claude:**
```
Web Claude          →  Claude Code CLI
----------------      -----------------
Manual file copy    →  Direct file access
No command exec     →  Run any command
Context loss        →  Persistent sessions
Single file focus   →  Multi-file workflows
Generic answers     →  Project-aware responses
```

---

## 🚀 Getting Started

### Installation

```bash
# macOS/Linux
brew install claude-code

# npm (cross-platform)
npm install -g @anthropic-ai/claude-code

# Verify installation
claude --version
```

### Authentication

```bash
# Set API key
export ANTHROPIC_API_KEY=your-key-here

# Or use interactive login
claude login

# Verify
claude whoami
```

### First Session

```bash
# Start in project directory
cd /path/to/your/project

# Launch Claude Code
claude

# You'll see:
# Claude Code v1.0.0
# Project: /path/to/your/project
# Model: claude-sonnet-4.5
# 
# Ready to assist. What would you like to work on?
```

---

## 🔧 Core Workflows

### Workflow 1: Code Analysis

**Session:**
```
You: Analyze this codebase structure and explain the architecture

Claude Code: [Automatically reads directory structure]

This is a Node.js/TypeScript application with the following architecture:

src/
  api/          → REST API routes (Express.js)
  services/     → Business logic layer
  models/       → Data models (Prisma ORM)
  utils/        → Shared utilities
  
Key patterns:
- Layered architecture (API → Service → Model)
- Dependency injection via constructor
- Error handling with custom error classes
- Validation using Zod schemas

Entry point: src/index.ts
API documentation: docs/api.md
Tests: __tests__/ (Jest)

Would you like me to analyze any specific component in detail?
```

### Workflow 2: Multi-File Refactoring

**Session:**
```
You: Refactor the authentication logic to use a separate AuthService

Claude Code: I'll refactor the auth logic. This will involve:
1. Creating new AuthService class
2. Extracting logic from auth middleware
3. Updating route handlers to use service
4. Adding tests

[Reads current files]
[Creates src/services/AuthService.ts]
[Modifies src/middleware/auth.ts]
[Modifies src/api/auth.ts]
[Creates __tests__/services/AuthService.test.ts]

Refactoring complete. Changes:
✓ Created AuthService with login/register/verify methods
✓ Updated middleware to use AuthService
✓ Simplified route handlers
✓ Added comprehensive tests

Run tests?
```

```
You: yes

Claude Code: [Executes: npm test]

PASS  __tests__/services/AuthService.test.ts
  AuthService
    ✓ should hash password on registration
    ✓ should validate credentials on login
    ✓ should verify JWT tokens
    ✓ should reject invalid tokens

Tests: 4 passed, 4 total

All tests passing. Refactoring successful.
```

### Workflow 3: Feature Development

**Session:**
```
You: Add password reset functionality

Claude Code: I'll implement password reset. This requires:

Backend:
1. Add reset_token and reset_expires to User model
2. Create POST /api/auth/forgot-password endpoint
3. Create POST /api/auth/reset-password endpoint
4. Email service for sending reset links

Frontend:
5. ForgotPassword component
6. ResetPassword component  
7. Email templates

Should I proceed with all components, or backend-only first?
```

```
You: Backend first

Claude Code: 
[Reads src/models/User.ts]
[Creates migration: add-password-reset-fields.sql]
[Updates src/models/User.ts]
[Creates src/services/PasswordResetService.ts]
[Creates src/api/password-reset.ts]
[Adds routes to src/index.ts]
[Creates tests]

Backend implementation complete.

New endpoints:
- POST /api/auth/forgot-password
  Body: { email }
  Sends reset email with token
  
- POST /api/auth/reset-password
  Body: { token, newPassword }
  Validates token and updates password

Next: Run migration?
```

```
You: yes

Claude Code: [Executes: npm run migrate]

Running migration: add-password-reset-fields.sql
✓ Added reset_token column
✓ Added reset_expires column
✓ Added index on reset_token

Migration successful.

Ready to implement frontend or test the API?
```

### Workflow 4: Debugging

**Session:**
```
You: Users report 500 error on login

Claude Code: Let me investigate.

[Reads recent error logs]
[Examines src/api/auth.ts]
[Checks src/services/AuthService.ts]

Found the issue:

src/services/AuthService.ts:45
When password is null/undefined, bcrypt.compare throws.

The user table allows null passwords (legacy migration issue).

Fix options:
A. Add null check before bcrypt.compare
B. Add database constraint + migration
C. Both A and B (recommended)

Which approach?
```

```
You: C

Claude Code: 
[Modifies src/services/AuthService.ts - adds null check]
[Creates migration: password-not-null-constraint.sql]
[Updates tests]

Fix implemented:

1. Added guard clause:
   if (!user.password) {
     throw new AuthenticationError('Account not properly configured');
   }

2. Migration will:
   - Update null passwords to random hash (force reset)
   - Add NOT NULL constraint
   
3. Added test for null password case

Run migration in production with caution - will affect accounts with null passwords.

Ready to test?
```

### Workflow 5: Testing

**Session:**
```
You: Write tests for the UserService

Claude Code: 
[Reads src/services/UserService.ts]
[Analyzes methods and dependencies]
[Creates __tests__/services/UserService.test.ts]

Created comprehensive test suite:

✓ createUser tests (5 tests)
  - Should create user with valid data
  - Should hash password
  - Should reject duplicate email
  - Should validate email format
  - Should handle database errors

✓ getUser tests (3 tests)
  - Should get user by ID
  - Should return null for missing user
  - Should not expose password

✓ updateUser tests (4 tests)
  - Should update user fields
  - Should not update email to existing
  - Should validate updates
  - Should update timestamp

Run tests?
```

```
You: yes

Claude Code: [Executes: npm test UserService]

PASS  __tests__/services/UserService.test.ts
  UserService
    createUser
      ✓ should create user with valid data
      ✓ should hash password
      ✓ should reject duplicate email
      ✓ should validate email format
      ✓ should handle database errors
    getUser
      ✓ should get user by ID
      ✓ should return null for missing user
      ✓ should not expose password
    updateUser
      ✓ should update user fields
      ✓ should not update email to existing
      ✓ should validate updates
      ✓ should update timestamp

Tests: 12 passed, 12 total
Time: 2.453s

All tests passing!
```

---

## ⚡ Advanced Features

### Memory and Context

**Claude Code maintains:**

```
Project Context:
- File structure
- Dependencies
- Build configuration
- Testing setup
- Recent changes

Conversation History:
- Previous requests
- Code changes made
- Decisions and rationale
- Current task state
```

**Example:**
```
Session 1:
You: Add email validation to user registration
Claude Code: [Implements validation]

[Next day, new session]

Session 2:
You: Apply the same email validation to profile updates

Claude Code: I'll use the same validation pattern from the 
user registration (validateEmail function in utils/validation.ts).

[Applies consistent pattern]
```

### Command Execution

**Available commands:**
```bash
# Git operations
You: Create a feature branch for this work
Claude Code: [Executes: git checkout -b feature/password-reset]

# Package management
You: Install zod for validation
Claude Code: [Executes: npm install zod]

# Build and test
You: Run the build
Claude Code: [Executes: npm run build]

# Database
You: Run migrations
Claude Code: [Executes: npm run migrate]

# Custom scripts
You: Run the development server
Claude Code: [Executes: npm run dev]
```

### Multi-File Coordination

**Atomic changes across files:**
```
You: Rename UserModel to User everywhere

Claude Code: I'll rename across all files:

Files to modify:
✓ src/models/UserModel.ts → User.ts
✓ src/services/UserService.ts (3 references)
✓ src/api/users.ts (5 references)
✓ __tests__/models/User.test.ts (8 references)
✓ __tests__/services/UserService.test.ts (12 references)

[Makes all changes]
[Updates imports]
[Runs tests to verify]

Rename complete. All 28 references updated.
Tests still passing.
```

### Git Integration

**Smart git workflows:**
```
You: Commit these changes

Claude Code: I'll create a commit. Let me review the changes:

Modified files:
  src/services/AuthService.ts
  src/api/auth.ts
  __tests__/services/AuthService.test.ts

Changes:
- Refactored authentication logic to AuthService
- Updated route handlers to use service
- Added comprehensive tests

Suggested commit message:
"refactor(auth): extract authentication logic to AuthService

- Create AuthService class with login/register/verify methods
- Update middleware to use AuthService
- Simplify route handlers
- Add comprehensive unit tests

Tests: All passing (12/12)"

Approve this message? (y/n or provide custom message)
```

```
You: y

Claude Code: [Executes: git add -A]
[Executes: git commit -m "..."]

✓ Committed: refactor(auth): extract authentication logic to AuthService
```

---

## 🎯 Best Practices

### Session Management

**DO:**
✅ Start sessions in project root  
✅ One session per logical task  
✅ Use descriptive task names  
✅ Review changes before committing  
✅ Let Claude Code read files (don't paste)  

**DON'T:**
❌ Switch projects mid-session  
❌ Run destructive commands without confirmation  
❌ Override Claude Code's safety checks  
❌ Work on multiple unrelated tasks in one session  

### Effective Prompts

**Good:**
```
"Add input validation to the registration endpoint using Zod"
"Fix the TypeScript errors in UserService"
"Write integration tests for the auth flow"
"Refactor the database queries to use Prisma"
```

**Better:**
```
"Add Zod validation to POST /api/auth/register:
- Email format
- Password min 8 chars
- Name required
Return 400 with error details on validation failure"

"Fix TypeScript errors in UserService, ensuring:
- All return types are explicit
- No 'any' types
- Proper error handling types"
```

### Safety and Review

**Always review:**
- Database migrations
- Dependency changes
- Security-related code
- Production configuration
- Destructive operations

**Use confirmation:**
```
You: Drop the staging database

Claude Code: ⚠️  This is a destructive operation that will permanently 
delete all data in the staging database.

Are you sure? Type 'yes' to confirm:
```

---

## 🔧 Configuration

### Project-Level Config

**`.clauderc`:**
```json
{
  "model": "claude-sonnet-4.5",
  "context": {
    "include": ["src/**/*", "tests/**/*"],
    "exclude": ["node_modules", "dist", ".git"]
  },
  "commands": {
    "test": "npm test",
    "build": "npm run build",
    "lint": "npm run lint"
  },
  "conventions": {
    "indent": "2 spaces",
    "quotes": "single",
    "testFramework": "jest"
  }
}
```

### User-Level Config

**`~/.claude/config.json`:**
```json
{
  "defaultModel": "claude-sonnet-4.5",
  "editor": "vscode",
  "theme": "dark",
  "confirmDestructive": true,
  "autoSave": true
}
```

---

## 🚀 Pro Tips

### Tip 1: Project Context Files

Create `.claude/context.md`:
```markdown
# Project Context

## Architecture
- Layered architecture (API → Service → Model)
- PostgreSQL database via Prisma ORM
- JWT authentication
- Express.js REST API

## Conventions
- Use async/await (no callbacks)
- Zod for validation
- Jest for testing
- ESLint + Prettier
- Conventional commits

## Common Tasks
- Tests: npm test
- Dev server: npm run dev
- Build: npm run build
- Migrations: npm run migrate
```

Claude Code will automatically use this context.

### Tip 2: Custom Commands

```json
{
  "commands": {
    "setup": "npm install && npm run migrate && npm run seed",
    "clean": "rm -rf dist node_modules && npm install",
    "deploy": "./scripts/deploy.sh"
  }
}
```

Then:
```
You: Run setup
Claude Code: [Executes: npm install && npm run migrate && npm run seed]
```

### Tip 3: Iterative Development

```
You: Let's add a comments feature

Claude Code: I'll break this down:

1. Database schema
2. Backend API
3. Frontend components
4. Tests

Should I tackle these in order, or would you like to review 
the schema first?
```

```
You: Schema first

Claude Code: [Proposes schema]

Here's the proposed schema:

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

Thoughts? Any changes before I proceed?
```

### Tip 4: Code Navigation

```
You: Where is the email validation logic?

Claude Code: Email validation is in src/utils/validation.ts:12-18

Would you like me to:
A. Show the function
B. Explain how it works
C. Suggest improvements
D. Find all usages
```

---

## 📚 Common Patterns

### Pattern: Feature Branch Workflow

```bash
You: Start work on user profile feature

Claude Code:
[Creates: git checkout -b feature/user-profile]
Created branch: feature/user-profile

What aspects of the profile should we implement first?
```

[Work on feature...]

```bash
You: Ready to commit

Claude Code:
[Reviews changes]
[Creates commit]
[Suggests: Ready to push to origin?]
```

### Pattern: Bug Investigation

```bash
You: Investigate login timeout issue

Claude Code:
Let me check:
1. Recent error logs
2. Login endpoint code
3. Database query performance
4. Network configuration

[Analyzes multiple files]

Found: Database query in AuthService.ts:45 has no timeout.
Under high load, queries hang indefinitely.

Fix: Add query timeout of 5 seconds?
```

### Pattern: Dependency Update

```bash
You: Update to React 19

Claude Code:
This will require updates to:
- package.json
- React component patterns (new hooks)
- TypeScript types
- Tests (React Testing Library)

Proceed with full update, or run compatibility check first?
```

---

## 🎓 Practice Exercise

**Challenge: Build a feature end-to-end using only Claude Code**

1. Start Claude Code in a project
2. Ask it to add a "favorites" feature
3. Let it guide the implementation (DB, API, UI, tests)
4. Use iterative development
5. Review each step
6. Commit when complete

**Goal:** Experience the full workflow in one session.

---

**Next:** [CLI Workflows →](./12-cli-workflows.md)
