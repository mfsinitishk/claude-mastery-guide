# Token Optimization Best Practices

## Overview

Token optimization is critical for efficient AI-assisted development. This guide provides comprehensive strategies for minimizing token usage while maximizing information density and maintaining context quality.

## Understanding Token Economics

### Token Basics

**What is a token?**
- Fundamental unit of text processing
- Not exactly a word or character
- Language model's atomic unit of meaning
- Average: 1 token ~4 characters in English

**Token counting examples:**
```
"Hello" = 1 token
"Hello, world!" = 4 tokens
"console.log('hello')" = 6 tokens
"const x = 42;" = 7 tokens
```

### Cost Implications

Token usage affects:

1. **Response Time:** More tokens = longer processing
2. **Context Limits:** 200K token window shared between input/output
3. **API Costs:** Charged per token (input + output)
4. **Memory Usage:** Larger contexts require more resources
5. **Conversation Length:** Fewer tokens = longer conversations

## Core Principles

### 1. Information Density

Maximize information per token. Every token should carry meaningful content.

**Low density:**
```
"The function that we have created, which is responsible for the 
validation of the user's input data before it gets stored in our 
database system, needs to be updated."
```
Tokens: ~30

**High density:**
```
"Update validateUserInput() before database insert."
```
Tokens: ~8
Information retained: 100%

### 2. Strategic Verbosity

Be verbose where it matters, concise everywhere else.

**Be verbose for:**
- Complex requirements
- Ambiguous scenarios
- Critical constraints
- Novel patterns

**Be concise for:**
- Standard operations
- Well-known patterns
- File references
- Status updates

### 3. Avoid Redundancy

Say things once. Reference, don't repeat.

**Redundant:**
```
Message 1: "We use React with TypeScript and Tailwind CSS"
Message 2: "For the new component, use React with TypeScript and Tailwind CSS"
Message 3: "Another component with React, TypeScript, and Tailwind CSS"
```

**Optimized:**
```
Message 1: "Stack: React + TypeScript + Tailwind CSS"
Message 2: "New component following our stack"
Message 3: "Another component"
```

## Do's and Don'ts

### Token-Efficient Communication

#### Do's

- **Use technical shorthand:**
  ```
  "Impl OAuth2 auth with PKCE for SPA. Store tokens in httpOnly cookies."
  vs.
  "Implement an OAuth2 authentication flow with Proof Key for Code Exchange 
  specifically designed for Single Page Applications. Make sure to store the 
  tokens securely using cookies with the httpOnly flag enabled."
  ```

- **Reference file paths instead of pasting code:**
  ```
  "Review error handling in /src/utils/errors.ts:45-67"
  vs.
  [Pasting 23 lines of code]
  ```

- **Use structured formats:**
  ```
  ISSUE: Login fails
  CAUSE: Expired session
  FIX: Extend timeout to 1h
  FILE: /src/auth/session.ts:89
  
  vs.
  "There's an issue with the login functionality where users are experiencing 
  failures. After investigation, we found that the cause is related to expired 
  sessions. The fix we need is to extend the timeout to one hour. This change 
  should be made in the session.ts file in the auth directory on line 89."
  ```

- **Leverage Claude's knowledge:**
  ```
  "Use standard OAuth2 authorization code flow"
  vs.
  [Explaining what OAuth2 is and how authorization code flow works]
  ```

#### Don'ts

- **Avoid unnecessary pleasantries:**
  ```
  "Hello! I hope you're having a wonderful day! I would really appreciate 
  it if you could possibly help me with something when you get a chance..."
  
  vs.
  "Need help implementing rate limiting."
  ```

- **Don't explain obvious context:**
  ```
  "JavaScript is a programming language used for web development. In JavaScript, 
  we can create functions. I need you to create a function..."
  
  vs.
  "Create a function that validates email addresses."
  ```

- **Skip filler content:**
  ```
  "So, basically, what I'm trying to say is that, you know, we kind of need 
  to, sort of, improve the performance."
  
  vs.
  "Improve performance."
  ```

- **Don't duplicate information:**
  ```
  ERROR: TypeError: Cannot read property 'id' of undefined
  ERROR DETAILS: TypeError: Cannot read property 'id' of undefined
  FULL ERROR: TypeError: Cannot read property 'id' of undefined
  
  vs.
  ERROR: TypeError: Cannot read property 'id' of undefined
  ```

## Real-World Examples

### Example 1: Bug Report

**Token-Heavy (450 tokens):**
```
Hello! I've encountered what appears to be a rather significant issue with 
our application that I was hoping you could help me investigate and resolve. 
The problem seems to be related to the user authentication system that we 
have implemented in our application.

Specifically, when users attempt to log into the system using their credentials, 
sometimes the login process works perfectly fine and they can access the 
application without any problems. However, at other times, the login process 
fails unexpectedly and users receive an error message.

The error message that appears says "Authentication failed" but doesn't provide 
much additional detail about what specifically went wrong. This is happening 
intermittently, which makes it particularly difficult to debug because it's 
not consistent.

I've noticed this problem started occurring after we deployed the latest version 
of our application to the production environment last Friday. Before that 
deployment, we didn't see this issue in our testing environment or in production.

Could you please help me figure out what's causing this problem and how we can 
fix it? I've attached the relevant code files below. The authentication logic 
is primarily in the auth.service.ts file in the src/services directory...
```

**Token-Optimized (85 tokens):**
```
BUG: Intermittent login failures since v2.1.0 deploy (2026-05-01)

SYMPTOM: "Authentication failed" error (random, ~30% of attempts)
WORKED BEFORE: v2.0.9 (no issues in staging)
LOCATION: /src/services/auth.service.ts

RELEVANT CHANGES (v2.0.9 -> v2.1.0):
- Added Redis session caching
- Updated JWT library to 9.0.0
- Modified token expiry logic

HYPOTHESIS: Race condition in Redis session check

LOGS: /var/log/auth-errors.log (last 100 entries showing pattern)

Investigate token validation flow in auth.service.ts:validateSession()
```

### Example 2: Feature Request

**Token-Heavy (520 tokens):**
```
I would like to request the implementation of a new feature for our application. 
This feature would be a comprehensive search functionality that allows users to 
search through all of the different types of content that we have in our system.

Currently, users can only view content by browsing through different categories 
or by accessing content directly if they know the exact link. This is not very 
user-friendly and we've received feedback from our users that they would like 
to be able to search for content instead.

The search feature should allow users to type in keywords and then display 
relevant results. The results should be sorted by relevance, with the most 
relevant results appearing first. Users should be able to filter the results 
by different categories if they want to narrow down their search.

From a technical perspective, we have a PostgreSQL database that stores all 
of our content. The content is spread across multiple tables including posts, 
comments, and user profiles. We would need the search to work across all of 
these different tables.

For the frontend, we're using React and we would want the search to be fast 
and responsive. Ideally, we could show search suggestions as the user types, 
similar to how Google's search works.

In terms of performance, we have about 100,000 posts, 500,000 comments, and 
50,000 user profiles in our database currently, and this is growing every day. 
So the search needs to be able to handle this scale efficiently...
```

**Token-Optimized (110 tokens):**
```
FEATURE: Full-text search across content

SCOPE:
- Posts (100K)
- Comments (500K)  
- User profiles (50K)

REQUIREMENTS:
- Real-time suggestions (as-you-type)
- Relevance ranking
- Category filters
- <200ms response time

TECH STACK:
- Backend: PostgreSQL 14 (current DB)
- Frontend: React (existing)
- Consider: pg_trgm + GIN indexes OR Elasticsearch

UX REFERENCE:
Similar to Google search (autocomplete + instant results)

IMPLEMENTATION PRIORITY:
1. Basic search (posts only)
2. Add comments + profiles
3. Add filters + suggestions

Review /docs/search-requirements.md for detailed specs
```

### Example 3: Code Review Request

**Token-Heavy (680 tokens):**
```
Hello, I was wondering if you could please review some code that I've written 
for our application. I want to make sure that it follows best practices and 
doesn't have any potential issues before I merge it into the main branch.

The code is for a new payment processing feature that we're adding to our 
e-commerce platform. It handles the integration with our payment provider's 
API and processes credit card transactions.

Here's the code:

[200 lines of code pasted in full]

I'm particularly concerned about a few things:

First, I want to make sure that the error handling is robust enough. We can't 
afford to have payments fail silently or to lose track of transactions.

Second, I'm worried about security. We're handling sensitive payment information 
so we need to make sure everything is properly secured and we're following 
PCI compliance requirements.

Third, I want to ensure that the code is performant enough. We expect to process 
hundreds of transactions per minute during peak times, so we can't have any 
bottlenecks.

Fourth, I want to make sure the code is maintainable and follows our team's 
coding standards. It needs to be easy for other developers to understand and 
modify in the future.

Also, I'm not entirely sure if I've structured the code in the best way. Maybe 
there's a better pattern I could use for organizing the payment processing logic.

Could you please review this code and let me know what you think? I'd appreciate 
any feedback you can provide about potential issues, improvements, or best 
practices that I should follow.
```

**Token-Optimized (95 tokens):**
```
CODE REVIEW: Payment processing integration

FILE: /src/payments/processor.ts (200 lines)
CHANGES: New Stripe integration for credit card processing

FOCUS AREAS:
1. Error handling (no silent failures, transaction integrity)
2. Security (PCI compliance, sensitive data handling)
3. Performance (100s txn/min peak load)
4. Code structure (maintainability, team standards)

CONCERNS:
- Async error handling in processPayment():156-178
- Token storage approach:89-102
- Retry logic:203-215

Review against /docs/payment-security-checklist.md
```

## Advanced Techniques

### 1. Semantic Compression

Convey the same meaning with fewer tokens:

**Verbose (45 tokens):**
```
"We need to make sure that when a user attempts to perform an action that 
they don't have permission to do, the system prevents them from doing it and 
shows them an appropriate error message"
```

**Compressed (12 tokens):**
```
"Enforce permissions with user-friendly error messages"
```

### 2. Structured Data Formats

Use efficient formats for complex information:

**Inefficient (180 tokens):**
```
The API endpoint is located at /api/v1/users and it accepts GET requests. 
When you make a GET request, you can include query parameters for pagination. 
The page parameter specifies which page of results you want, and the limit 
parameter specifies how many results per page. You need to include an 
Authorization header with a Bearer token for authentication. The response 
will be in JSON format and includes an array of user objects along with 
pagination metadata.
```

**Efficient (65 tokens):**
```
ENDPOINT: GET /api/v1/users
PARAMS: ?page=1&limit=20
HEADERS: Authorization: Bearer {token}
RESPONSE: {
  users: User[],
  pagination: { page, limit, total, pages }
}
```

### 3. Reference-Based Context

Point to information rather than duplicating:

**Duplication (300+ tokens):**
```
Message 1: "Our error handling uses this pattern: [50 lines of code]"
Message 5: "Remember to use our error pattern: [50 lines of code]"
Message 10: "Apply the error pattern: [50 lines of code]"
```

**Reference (30 tokens):**
```
Message 1: "Error pattern in /src/utils/errorHandler.ts"
Message 5: "Use errorHandler pattern"
Message 10: "Apply errorHandler pattern"
```

### 4. Progressive Detailing

Start high-level, add detail only when needed:

**All-at-once (400 tokens):**
```
[Dumping entire database schema, all table definitions, all relationships, 
all indexes, all constraints in first message]
```

**Progressive (50 -> 100 -> 150 tokens as needed):**
```
Message 1: "PostgreSQL schema: users, posts, comments tables"
[If needed] Message 2: "users: id, email, password_hash, created_at"
[If needed] Message 3: "Indexes: users(email), posts(user_id, created_at)"
```

### 5. Abbreviation Strategies

Use industry-standard abbreviations:

**Full form (35 tokens):**
```
"Application Programming Interface"
"Database Management System"
"Continuous Integration/Continuous Deployment"
"Object-Relational Mapping"
```

**Abbreviated (4 tokens):**
```
"API"
"DBMS"
"CI/CD"
"ORM"
```

## Common Pitfalls

### 1. Over-Explanation

**Problem:**
Explaining concepts Claude already knows.

**Example:**
```
"React is a JavaScript library for building user interfaces, created by Facebook. 
It uses a component-based architecture where you create reusable components. 
Components can have state and props. State is internal to the component while 
props are passed from parent components..."
```

**Solution:**
```
"Create a React component with state for user preferences"
```

**Savings:** 50+ tokens -> 8 tokens

### 2. Excessive Metadata

**Problem:**
Including unnecessary metadata in every request.

**Example:**
```
"Project: E-commerce Platform
Version: 2.3.1
Date: 2026-05-05
Author: John Doe
Environment: Production
Server: AWS EC2
Database: PostgreSQL 14.2
Framework: Express 4.18.2
Node Version: 18.16.0

[Then the actual request]"
```

**Solution:**
```
"[The actual request]"
[Include metadata only when relevant to the specific task]
```

### 3. Redundant Examples

**Problem:**
Providing too many similar examples.

**Example:**
```
"Format dates like:
- '2026-01-15T10:30:00Z'
- '2026-02-20T14:45:00Z'
- '2026-03-25T09:15:00Z'
- '2026-04-10T16:20:00Z'
- '2026-05-05T11:55:00Z'"
```

**Solution:**
```
"Format dates as ISO 8601: '2026-05-05T11:55:00Z'"
```

**Savings:** 40 tokens -> 10 tokens

### 4. Conversational Padding

**Problem:**
Including social niceties and filler words.

**Example:**
```
"Hey there! Hope you're doing well today. I was wondering if maybe you could 
possibly help me out with something if you have time. So, basically, I kind 
of need to implement this feature, and I was thinking that perhaps we could..."
```

**Solution:**
```
"Implement user notification feature with:"
```

### 5. Copy-Paste Overload

**Problem:**
Pasting entire files instead of highlighting relevant sections.

**Example:**
```
[1000 lines of code]
"Something's wrong here, can you find it?"
```

**Solution:**
```
"Bug in /src/services/user.ts:validateEmail():145-160
Issue: Regex fails for emails with + character
Current: /^[a-z0-9._%]+@[a-z0-9.-]+\.[a-z]{2,}$/
Expected: Should allow + in local part"
```

## Checklists

### Pre-Message Token Optimization Checklist

Before sending a message:

- [ ] Remove filler words (just, basically, actually, etc.)
- [ ] Use abbreviations for common terms
- [ ] Reference files instead of pasting code
- [ ] Eliminate redundant explanations
- [ ] Remove conversational padding
- [ ] Use structured formats (lists, tables)
- [ ] Compress verbose descriptions
- [ ] Check for duplicate information
- [ ] Remove obvious context
- [ ] Verify all content is necessary

### Code Sharing Checklist

When sharing code:

- [ ] Share file path + line numbers instead of full code
- [ ] If pasting, include only relevant sections
- [ ] Remove comments if they're not essential
- [ ] Use code fences with language specification
- [ ] Highlight the specific issue/area of focus
- [ ] Trim unnecessary whitespace
- [ ] Remove debug console.logs
- [ ] Collapse repetitive patterns
- [ ] Use "..." for omitted sections
- [ ] Provide context in description, not code

### Data Sharing Checklist

When sharing data:

- [ ] Use sample data instead of full datasets
- [ ] Provide schema instead of full examples
- [ ] Use summary statistics for large datasets
- [ ] Compress JSON (remove whitespace)
- [ ] Show representative examples only
- [ ] Use tables for structured data
- [ ] Provide counts instead of full lists
- [ ] Reference external files for large data
- [ ] Trim unnecessary fields
- [ ] Use abbreviations in keys

## Metrics for Success

### Token Efficiency Metrics

Track these indicators:

1. **Token-to-Value Ratio**
   - Target: <100 tokens per meaningful exchange
   - Measure: Tokens used / outcome achieved
   - Good: Concise requests, precise responses

2. **Redundancy Rate**
   - Target: <5% repeated information
   - Measure: Duplicate content tokens / total tokens
   - Indicates: Communication efficiency

3. **Context Reuse**
   - Target: >80% reference existing context
   - Measure: New context / total context
   - Shows: Building on previous information

4. **Response Efficiency**
   - Target: Useful answer in <2000 tokens
   - Measure: Average response length
   - Indicates: Question clarity

5. **Conversation Length**
   - Target: >20 exchanges before context limit
   - Measure: Messages before new session needed
   - Shows: Token budget management

### Optimization Benchmarks

| Metric | Poor | Good | Excellent |
|--------|------|------|-----------|
| Avg message size | >1500 tokens | 500-1000 | <500 |
| Code sharing | Full files | Key sections | File paths |
| Redundancy | >20% | 5-10% | <5% |
| Metadata overhead | >30% | 10-20% | <10% |
| First-pass success | <50% | 70-80% | >80% |

## Token Optimization Strategies

### Strategy 1: The 50% Rule

After writing a prompt, try to cut it by 50% without losing meaning:

**Original (200 tokens):**
```
"I would like to implement a new feature in our application that allows 
users to upload profile pictures. The feature should support common image 
formats like JPEG and PNG. We need to make sure the images are not too large, 
so there should be a file size limit. Also, we should validate that the 
uploaded files are actually images and not some other type of file. The 
images should be stored in our S3 bucket, and we need to generate thumbnails 
for display in the UI. Can you help me implement this feature?"
```

**Optimized (85 tokens):**
```
"Implement profile picture upload:
- Formats: JPEG, PNG
- Max size: 5MB
- Validation: File type + dimensions
- Storage: S3 bucket
- Generate: Thumbnails (150x150)
- Stack: Node.js + multer + sharp

Follow pattern in /src/uploads/documentUpload.ts"
```

### Strategy 2: The Acronym Database

Create a project-specific acronym list:

```
COMMON ABBREVIATIONS:
- Auth: Authentication
- DB: Database
- API: API endpoint
- FE: Frontend
- BE: Backend
- Impl: Implementation
- Cfg: Configuration
- Env: Environment
- Prod: Production
- Stg: Staging
- Dev: Development
```

Use consistently to save tokens.

### Strategy 3: The Template Method

Create reusable message templates:

**Bug Report Template (30 tokens):**
```
BUG: [description]
WHERE: [file:line]
WHEN: [conditions]
EXPECTED: [behavior]
ACTUAL: [behavior]
```

**Feature Request Template (25 tokens):**
```
FEATURE: [name]
GOAL: [objective]
SCOPE: [boundaries]
SPECS: [requirements]
REF: [similar feature]
```

### Strategy 4: The Diff Approach

For updates, show only changes:

**Instead of (300 tokens):**
```
[Complete updated file]
```

**Use (50 tokens):**
```
CHANGES to /src/api/users.ts:

+45: Add email validation
-67: Remove old auth check
~89: Update error message
```

### Strategy 5: The Link Strategy

Use external references for stable content:

**Instead of (500 tokens):**
```
[Entire API documentation pasted]
```

**Use (15 tokens):**
```
"Follow API spec in /docs/api.md section 3.2"
```

## Advanced Token-Saving Patterns

### Pattern 1: Symbolic References

Create shorthand for complex concepts:

```
Message 1: "Let's call our microservices architecture 'MSA'"
Message 2: "In MSA, add new service for payments"
Message 3: "Update MSA service discovery"
```

### Pattern 2: Implicit Context

Rely on conversation history:

```
Message 1: "Working on user authentication in /src/auth/"
Message 2: "Add password reset" [implies /src/auth/]
Message 3: "Add email verification" [still in same context]
```

### Pattern 3: Bullet Point Mastery

Use bullets instead of prose:

**Prose (100 tokens):**
```
"The new feature should include the ability to sort by name, it should also 
allow filtering by date range, and we need pagination support with 20 items 
per page, plus we should add search functionality."
```

**Bullets (25 tokens):**
```
Add:
- Sort by name
- Filter by date range  
- Pagination (20/page)
- Search
```

### Pattern 4: Code Comments as Documentation

When sharing code, let comments explain:

**Separate explanation (150 tokens):**
```
Code: [50 tokens]
Explanation: [100 tokens explaining what code does]
```

**Integrated (70 tokens):**
```
Code with inline comments: [70 tokens total]
```

### Pattern 5: The Matrix Format

Use tables for multi-dimensional data:

**Prose (200 tokens):**
```
"For users, we need read and write permissions. For admins, we need read, 
write, and delete permissions. For viewers, we only need read permissions..."
```

**Table (60 tokens):**
```
| Role | Read | Write | Delete |
|------|------|-------|--------|
| User | ✓ | ✓ | ✗ |
| Admin | ✓ | ✓ | ✓ |
| Viewer | ✓ | ✗ | ✗ |
```

## Measuring Token Usage

### Token Estimation Techniques

Estimate before sending:

1. **Character count / 4 = rough token count**
   - "Hello, world!" = 13 chars / 4 ≈ 3-4 tokens (actual: 4)

2. **Word count × 1.3 = rough token count**
   - "The quick brown fox" = 4 words × 1.3 ≈ 5 tokens (actual: 5)

3. **Use token counters for precision**
   - Online tools: tiktoken, token-count
   - API responses include exact counts

### Budget Allocation

For 200K token window:

- **Reserve 50K for responses** (25%)
- **Use 150K for context** (75%)

Within 150K context budget:
- Core requirements: 40K (27%)
- Code/examples: 60K (40%)
- Supporting context: 30K (20%)
- Buffer: 20K (13%)

## Practical Exercises

### Exercise 1: Compression Challenge

Take this verbose prompt and reduce tokens by 60%:

**Original:**
```
"Hello! I need your help with something. We have a website and we want to add 
a feature where users can leave comments on blog posts. The comments should 
be displayed below each post, and users should be able to reply to other 
comments to create threaded discussions. We also need to make sure that users 
are logged in before they can comment, and we should validate the comment text 
to make sure it's not empty and doesn't contain inappropriate content. Can 
you help me build this feature?"
```

**Challenge:** Reduce to <60 tokens while retaining all requirements.

### Exercise 2: Reference Optimization

Convert this code-heavy message to a reference-based approach:

**Original:**
```
"Here's the user model:
[80 lines of code]

Here's the post model:
[120 lines of code]

Here's the comment model:
[90 lines of code]

I need to add relationships between these models."
```

**Challenge:** Reduce to <30 tokens.

### Exercise 3: Data Summarization

Compress this data sample:

**Original:**
```
[500 rows of CSV data with 20 columns]
```

**Challenge:** Represent the same information in <100 tokens.

## Conclusion

Token optimization is not about being terse to the point of losing clarity. It's about maximizing information density while maintaining precision and context. Master these techniques to have longer, more productive conversations with Claude while staying well within token budgets.

Remember: Every token is valuable. Use them wisely to communicate clearly, efficiently, and effectively.
