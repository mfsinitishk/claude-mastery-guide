# Context Optimization

## Maximizing AI Understanding with Efficient Context

---

## 🎯 Overview

Context is everything an AI knows about your request. Optimizing context means providing the right information in the right format to get the best results while staying within token limits. Master context optimization to work with larger codebases, maintain longer conversations, and get more accurate responses.

**Time to Master:** 3-4 hours  
**Outcome:** Efficiently manage context to maximize AI effectiveness

---

## 💡 Understanding Context

### What is Context?

**Context includes:**
```
System Instructions    → Who Claude is, how to behave
Conversation History   → Previous messages and responses
Current Request        → Your latest message
Attached Files         → Code, documents, data
Tool Results           → Output from previous tool calls
Memory/State           → Project structure, conventions
```

### Context Window

**Limits:**
- Claude Sonnet 4.5: 200K tokens (~150K words)
- Claude Opus 4.7: 200K tokens (~150K words)
- Claude Haiku 4.5: 200K tokens (~150K words)

**Implications:**
```
Small project (<100 files)     → Rarely hit limits
Medium project (100-500 files) → Need optimization
Large project (>500 files)     → Must optimize carefully
Monorepos                      → Critical optimization required
```

---

## 🔧 Context Optimization Strategies

### Strategy 1: Selective File Inclusion

**❌ Bad - Including entire codebase:**
```
Include all files in the context
```

**✅ Good - Include only relevant files:**
```
For refactoring UserService:
- src/services/UserService.ts (target file)
- src/models/User.ts (dependency)
- src/interfaces/IUserService.ts (contract)
- __tests__/services/UserService.test.ts (tests)

Skip:
- Unrelated services
- UI components
- Configuration files
- Dependencies
```

**Pattern:**
```
Focus on:
1. Target file(s)
2. Direct dependencies
3. Related tests
4. Relevant interfaces/types

Skip:
- Transitive dependencies
- Unmodified files
- Generated code
- Third-party libraries
```

### Strategy 2: Hierarchical Context

**Start broad, then narrow:**

**Phase 1 - Overview:**
```
You: Explain the architecture of this authentication system

Claude: [Reads directory structure only]

The auth system has:
- src/auth/
  - controllers/ (HTTP handlers)
  - services/ (business logic)
  - middleware/ (JWT verification)
  - models/ (user/session)
  
Key flows:
1. Registration → UserService → Database
2. Login → AuthService → JWT token
3. Protected routes → Auth middleware → verify token

What aspect would you like to explore?
```

**Phase 2 - Specific:**
```
You: Show me how JWT verification works

Claude: [Now reads src/auth/middleware/verify.ts]

The JWT verification middleware:
...
```

**Benefit:** Don't load entire codebase upfront; fetch details on demand.

### Strategy 3: Summarization

**For large files, provide summaries:**

**❌ Bad - 500-line file:**
```
[Paste entire 500-line service file]
```

**✅ Good - Summary + relevant section:**
```
This is UserService (500 lines). Key methods:
- createUser(data): Creates user with validation
- getUserById(id): Fetches user
- updateUser(id, data): Updates with merge
- deleteUser(id): Soft delete
- validateEmail(email): Checks format + uniqueness

I need help with the updateUser method (lines 145-180):

[Paste only lines 145-180]
```

**Pattern:**
```
For each large file:
1. Class/module name and purpose
2. Public API (method signatures)
3. Key dependencies
4. Relevant section only (for modification)
```

### Strategy 4: Incremental Context

**Build context incrementally as needed:**

```
Request 1: "Explain how authentication works at high level"
Context: Architecture overview only

Request 2: "How does password hashing work?"
Context: + AuthService.hashPassword method

Request 3: "Update to use argon2 instead of bcrypt"
Context: + package.json, + argon2 docs, + migration plan

Request 4: "Write the migration script"
Context: + Previous migration examples
```

**Benefit:** Start minimal, add context only when needed.

### Strategy 5: Context Compression

**Compress repetitive or verbose information:**

**❌ Verbose:**
```
The User interface has these fields:
- id: string - The unique identifier for the user
- email: string - The email address of the user  
- name: string - The full name of the user
- createdAt: Date - When the user was created
- updatedAt: Date - When the user was last updated
- passwordHash: string - The bcrypt hash of user password
- isActive: boolean - Whether the user account is active
- role: Role - The role assigned to the user
```

**✅ Compressed:**
```
User interface:
{
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
  isActive: boolean;
  role: Role;
}
```

**Pattern:** Show code directly instead of describing it verbally.

---

## 📊 Context Optimization Techniques

### Technique 1: Directory Trees vs. Full Files

**Use directory trees for navigation:**

```
You: What's the structure of the project?

[Include directory tree only - very token-efficient]

project/
├── src/
│   ├── api/
│   │   ├── users.ts
│   │   ├── products.ts
│   │   └── orders.ts
│   ├── services/
│   │   ├── UserService.ts
│   │   ├── ProductService.ts
│   │   └── OrderService.ts
│   └── models/
│       ├── User.ts
│       ├── Product.ts
│       └── Order.ts
└── tests/
    └── ...
```

**Then drill down:**
```
You: Show me the UserService implementation

[Now include just src/services/UserService.ts]
```

### Technique 2: Type Signatures Over Implementation

**For understanding APIs:**

**❌ Full implementation (100+ lines):**
```typescript
class UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    // 30 lines of validation
    // 20 lines of business logic
    // 15 lines of database operations
    // 10 lines of error handling
  }
  
  async getUser(id: string): Promise<User | null> {
    // 25 lines...
  }
  
  // ... more methods
}
```

**✅ Interface only (20 lines):**
```typescript
interface IUserService {
  createUser(data: CreateUserDTO): Promise<User>;
  getUser(id: string): Promise<User | null>;
  updateUser(id: string, updates: UpdateUserDTO): Promise<User>;
  deleteUser(id: string): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  listUsers(filters: UserFilters): Promise<User[]>;
}
```

**Use when:** Understanding API contracts, not implementation details.

### Technique 3: Diff vs. Full File

**For code changes:**

**❌ Full file (before and after):**
```
Before (200 lines):
[entire file]

After (200 lines):
[entire file with changes]
```

**✅ Diff only:**
```diff
@@ -45,7 +45,10 @@ class UserService {
   async updateUser(id: string, updates: UpdateUserDTO): Promise<User> {
-    const user = await this.db.findById(id);
+    const user = await this.db.findById(id);
+    if (!user) {
+      throw new NotFoundError('User not found');
+    }
     
     return this.db.update(id, updates);
   }
```

**Savings:** ~95% fewer tokens for typical changes.

### Technique 4: Example-Based Context

**Instead of full documentation:**

**❌ Full API docs (500+ lines):**
```
[Complete API reference]
```

**✅ Example usage:**
```typescript
// Example: How we typically use the API

// Create user
const user = await userService.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  password: 'secure123'
});

// Fetch user
const found = await userService.getUser(user.id);

// Update
await userService.updateUser(user.id, {
  name: 'Jane Doe'
});

// Delete
await userService.deleteUser(user.id);
```

**Use when:** Showing typical usage patterns.

### Technique 5: Progressive Disclosure

**Reveal details only when asked:**

```
Level 1 - Component exists
"We have a UserService for user management"

Level 2 - Component interface  
"UserService has createUser, getUser, updateUser, deleteUser"

Level 3 - Method signature
"createUser(data: CreateUserDTO): Promise<User>"

Level 4 - Implementation
[Full method code]

Level 5 - Tests
[Test file]
```

---

## 🎯 Practical Patterns

### Pattern: Large File Modification

**Scenario:** Modify method in 800-line file

**❌ Inefficient:**
```
Here's the entire 800-line file:
[paste all 800 lines]

Update the calculatePrice method.
```

**✅ Efficient:**
```
File: src/services/OrderService.ts (800 lines)

Public methods:
- createOrder
- getOrder  
- updateOrder
- deleteOrder
- calculatePrice (lines 456-489) ← needs update
- processPayment
- sendConfirmation

Current calculatePrice implementation (lines 456-489):

[paste only lines 456-489]

Request: Add support for discount codes
```

**Context saved:** ~85% reduction in tokens.

### Pattern: Multi-File Refactoring

**Scenario:** Rename interface across files

**❌ Inefficient:**
```
[Include 15 full files that use the interface]
```

**✅ Efficient:**
```
Need to rename IUserService → UserServiceInterface

Files affected (15 total):
1. src/services/UserService.ts - line 5 (interface definition)
2. src/api/users.ts - line 12 (import)
3. src/api/auth.ts - line 8 (import)
4. [list remaining 12 files with line numbers]

Show implementation for first file:
[src/services/UserService.ts - only the interface part]

For others, just update imports - same pattern as file #2.
```

### Pattern: Architecture Understanding

**Scenario:** Understand how data flows through system

**❌ Inefficient:**
```
[Include all 50 source files]
```

**✅ Efficient:**
```
Data flow for user registration:

1. POST /api/auth/register
   ↓
2. AuthController.register (src/api/auth.ts:45)
   ↓
3. UserService.createUser (src/services/UserService.ts:78)
   ↓
4. User.create (src/models/User.ts:23)
   ↓
5. Database INSERT
   ↓
6. EmailService.sendWelcome (src/services/EmailService.ts:12)

Key files:
- src/api/auth.ts (lines 45-67)
- src/services/UserService.ts (lines 78-95)
- src/models/User.ts (lines 23-40)

[Include only these relevant sections]
```

---

## 📈 Token Budget Management

### Estimating Token Usage

**Rough estimates:**
```
1 word        ≈ 1.3 tokens
1 line code   ≈ 4-6 tokens
1 KB text     ≈ 300 tokens
100 line file ≈ 500 tokens
```

**Examples:**
```
README.md (50 lines)           → ~250 tokens
UserService.ts (200 lines)     → ~1,000 tokens
Full project (100 files)       → ~50,000 tokens
```

### Budget Allocation

**For 200K token limit:**

```
Reserve for system:     10K tokens (5%)
Conversation history:   50K tokens (25%)
Current request:        10K tokens (5%)
Working context:        130K tokens (65%)
```

**Working context breakdown:**
```
Target files:           30K tokens (23%)
Dependencies:           40K tokens (31%)
Tests:                  20K tokens (15%)
Documentation:          20K tokens (15%)
Examples:               20K tokens (16%)
```

### Context Rotation

**When nearing limits:**

```
Approach 1 - Summarize history
Old: Full conversation (50K tokens)
New: Summary of decisions (5K tokens)
Freed: 45K tokens

Approach 2 - Remove transitive deps
Old: All dependencies (40K tokens)
New: Direct dependencies only (15K tokens)  
Freed: 25K tokens

Approach 3 - Archive completed work
Old: Files from completed features (30K tokens)
New: Summary of changes (3K tokens)
Freed: 27K tokens
```

---

## ✅ Best Practices

### DO:
✅ Start with minimal context  
✅ Add details incrementally  
✅ Use summaries for large files  
✅ Prefer diffs over full files  
✅ Include only relevant tests  
✅ Compress repetitive content  
✅ Use directory trees for navigation  
✅ Monitor token usage  

### DON'T:
❌ Include entire codebase upfront  
❌ Paste verbose documentation  
❌ Include generated files  
❌ Repeat information  
❌ Include unrelated files  
❌ Paste full files when summary suffices  
❌ Ignore token budget  

---

## 🔧 Tools and Techniques

### Claude Code Auto-Context

Claude Code automatically:
- Selects relevant files
- Manages context window
- Loads dependencies on demand
- Summarizes large files

**You can optimize further:**
```
Use .claudeignore to exclude:
- node_modules/
- dist/
- .git/
- *.log
- *.lock
```

### Context Window Indicators

**Monitor context usage:**
```
[Context: 45K / 200K tokens (22%)]
✓ Plenty of space

[Context: 180K / 200K tokens (90%)]
⚠️ Consider summarizing or rotating context

[Context: 198K / 200K tokens (99%)]  
🔴 Must reduce context before next operation
```

---

## 🚀 Advanced Optimization

### Caching Strategies

**For repeated information:**

```
Session 1:
You: Here's the User model [paste]

Session 2 (later):
You: Use the User model from earlier

Claude: [Retrieves from conversation history]
```

**File references:**
```
Instead of:
"Here's UserService.ts: [500 lines]"

Use:
"See src/services/UserService.ts"
[Claude Code reads it directly]
```

### Context Compression

**Compress common patterns:**

**Before:**
```
The GET /api/users endpoint accepts query parameters:
- page: number - The page number for pagination  
- limit: number - Number of results per page
- sort: string - Field to sort by
- order: 'asc' | 'desc' - Sort direction
- filter: string - Filter query

Returns:
- data: User[] - Array of users
- total: number - Total count
- page: number - Current page
- pages: number - Total pages
```

**After:**
```
GET /api/users

Query: page, limit, sort, order, filter
Response: { data: User[], total, page, pages }
```

---

## 🎓 Practice Exercise

**Optimize this scenario:**

You have a 200-file project and need to:
1. Understand how authentication works
2. Add 2FA support
3. Update tests
4. Document changes

**Challenge:** Do this using <30K tokens of context.

**Strategy:**
1. Start with architecture overview (5K tokens)
2. Drill into auth flow (10K tokens)
3. Modify specific methods (8K tokens)
4. Update tests (5K tokens)
5. Document (2K tokens)

Total: 30K tokens (vs. 100K+ for full project)

---

**Next:** [Structured Prompting →](./14-structured-prompting.md)
