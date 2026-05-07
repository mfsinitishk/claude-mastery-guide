# Context Management Best Practices

## Overview

Effective context management is crucial for maintaining productive conversations with Claude. This guide covers strategies for maximizing context efficiency, managing long conversations, and ensuring Claude has the right information at the right time.

## Understanding Context Windows

### Context Limits

Claude's context window determines how much information can be processed in a single conversation:

- **Current window size:** 200K tokens (~150K words)
- **Effective working size:** 150K tokens (reserving space for responses)
- **Token efficiency:** 1 token ≈ 4 characters on average

### Context Consumption

Different content types consume tokens at different rates:

| Content Type | Approximate Token Cost |
|--------------|------------------------|
| Plain text | 1 token per 4 characters |
| Code (formatted) | 1 token per 3 characters |
| JSON data | 1 token per 3-4 characters |
| Compressed data | Higher efficiency |
| Repeated patterns | Cached efficiently |

## Core Principles

### 1. Information Hierarchy

Organize context by importance and relevance:

**Priority 1 - Essential Context:**
- Current task requirements
- Directly relevant code
- Critical constraints
- Recent changes

**Priority 2 - Supporting Context:**
- Related systems
- Dependencies
- Background information
- Historical context

**Priority 3 - Reference Context:**
- Documentation links
- Similar patterns
- Optional examples
- Nice-to-have details

### 2. Progressive Context Loading

Don't frontload all information. Introduce context as needed:

```
Initial: "I need to optimize our user search API"
Follow-up: "It uses PostgreSQL full-text search"
When relevant: "Here's the current implementation: [code]"
As needed: "The database has 2M users with these indexes: [details]"
```

### 3. Context Freshness

Keep context current and remove outdated information:

- Reference most recent code versions
- Update requirements as they change
- Remove obsolete workarounds
- Clarify superseded decisions

## Do's and Don'ts

### Context Inclusion

#### Do's

- **Provide file paths explicitly:**
  ```
  "Review the authentication logic in /src/auth/jwt.ts, 
  particularly the token validation function on lines 45-67"
  ```

- **Include relevant error messages:**
  ```
  "The deployment fails with: 
  Error: ECONNREFUSED connecting to database on port 5432
  Environment: production, Region: us-east-1"
  ```

- **Share configuration snippets:**
  ```
  "Our TypeScript config uses:
  {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }"
  ```

- **Reference recent changes:**
  ```
  "In the last commit (abc123), we migrated from REST to GraphQL 
  for user queries. Now we need to update the caching layer."
  ```

#### Don'ts

- **Avoid dumping entire files:**
  ```
  [Pasting 2000 lines of code without highlighting relevant sections]
  ```

- **Don't include redundant information:**
  ```
  "We use Node.js. Node.js is a JavaScript runtime. Our Node.js 
  version is 18. Node.js 18 has feature X..."
  ```

- **Skip obvious context:**
  ```
  "TypeScript is a superset of JavaScript that adds static typing..."
  [Claude already knows this]
  ```

- **Don't repeat unnecessarily:**
  ```
  Every message: "Our database is PostgreSQL 14, we use Docker, 
  our framework is Express..." [Say once, reference later]
  ```

## Real-World Examples

### Example 1: Large Codebase Navigation

**Poor Approach:**
```
"Here's our entire codebase: [dumps 50 files]
Find the bug."
```

**Optimal Approach:**
```
"Bug in user authentication:

SYMPTOM: Users logged out unexpectedly after 5 minutes

RELEVANT FILES:
- /src/auth/session.ts (session management)
- /src/middleware/auth.ts (auth middleware)  
- /config/redis.ts (session storage)

START HERE: /src/auth/session.ts lines 23-45 (session timeout logic)

RECENT CHANGES: 
- Commit def456: Changed session timeout from 30m to 5m
- This might be related but seems intentional

Please investigate the session lifecycle."
```

### Example 2: Multi-File Refactoring

**Poor Approach:**
```
"Refactor everything to use the new pattern"
[No indication of what the pattern is or what files are affected]
```

**Optimal Approach:**
```
"Migrate authentication to OAuth2:

SCOPE:
- Phase 1: Update /src/auth/* (5 files)
- Phase 2: Update API middleware (3 files)
- Phase 3: Update tests

CURRENT PATTERN (in /src/auth/jwt.ts):
[30 lines showing current JWT implementation]

TARGET PATTERN (reference /docs/oauth2-design.md):
- Use authorization code flow
- Implement PKCE
- Support refresh tokens

START WITH: /src/auth/oauth.ts (create new)
THEN: Update /src/auth/middleware.ts to use new OAuth client
```

### Example 3: Debugging Session

**Poor Approach:**
```
Message 1: "Fix this error: [error message]"
Message 2: "Oh, I forgot to mention we use Docker"
Message 3: "Actually, it's Docker Compose"
Message 4: "The error is on production, not local"
Message 5: "Production uses Kubernetes, not Compose"
```

**Optimal Approach:**
```
"Production error investigation:

ERROR:
Error: Connection pool exhausted
at Database.connect (db.ts:45)
Occurred: 2026-05-05 14:23:00 UTC

ENVIRONMENT:
- Platform: Kubernetes (AWS EKS)
- Database: PostgreSQL 14 (RDS)
- Connection pool: max 20 connections
- Current load: ~500 req/s

RECENT CHANGES:
- Deployed v2.3.0 an hour ago
- Added new analytics queries
- No infrastructure changes

RELEVANT CODE:
/src/database/pool.ts (connection pooling)
/src/services/analytics.ts (new queries)

HYPOTHESIS:
New analytics queries might not be releasing connections properly.
Let's review /src/services/analytics.ts first."
```

## Advanced Techniques

### 1. Context Layering

Structure information in layers for efficient access:

```
LAYER 1 - SUMMARY:
"Migrate payment processing from Stripe v2 to v3 API"

LAYER 2 - SCOPE:
"Affects 4 services: checkout, subscriptions, refunds, webhooks"

LAYER 3 - DETAILS:
[Provide details only for the current service being worked on]

LAYER 4 - REFERENCE:
[Link to full Stripe v3 docs, only if specific questions arise]
```

### 2. Context Compression

Summarize verbose information efficiently:

**Instead of full logs:**
```
[1000 lines of logs]
```

**Provide summary:**
```
ERROR PATTERN (appears 47 times in last hour):
"TypeError: Cannot read property 'userId' of undefined"
  at UserService.getProfile (user.service.ts:89)
  
Context: Always occurs when session.user is null
Frequency: 47 errors / 3000 requests (1.5%)
Users affected: 12 unique session IDs
```

### 3. Reference by Location

Use file paths and line numbers instead of pasting code:

**Instead of:**
```
"This code has an issue:
[50 lines of code]
What's wrong?"
```

**Use:**
```
"Issue in /src/api/users.ts lines 145-160, specifically the error 
handling in the catch block. The current implementation swallows 
database errors. Should we propagate them or log and return generic error?"
```

### 4. Contextual Bookmarking

Create reference points in long conversations:

```
"Let's call this approach 'Strategy A: Event-Driven Architecture'
[Discussion of Strategy A]

Now for 'Strategy B: Microservices with Saga Pattern'
[Discussion of Strategy B]

Compare Strategy A vs B considering our use case..."
```

### 5. Delta Updates

When context changes, provide only the delta:

**Instead of:**
```
"Here's the updated complete file: [entire file]"
```

**Use:**
```
"Update to /src/auth/jwt.ts:

CHANGED: Lines 45-52 (token validation)
OLD: validate(token) returns boolean
NEW: validate(token) returns { valid: boolean, payload?: TokenPayload }

ADDED: Lines 78-95 (refresh token logic)
REMOVED: Lines 120-135 (deprecated session handling)"
```

## Common Pitfalls

### 1. Context Overload

**Problem:**
Starting every message with full system context regardless of relevance.

**Impact:**
- Wastes context window
- Delays responses
- Obscures relevant details

**Solution:**
```
First mention: "Our system uses microservices architecture with 
12 services, event-driven communication via Kafka, deployed on Kubernetes."

Later references: "In the user-service microservice..."
[Claude remembers the architecture]
```

### 2. Missing Critical Context

**Problem:**
Assuming Claude knows your specific implementation details.

**Impact:**
- Generic solutions that don't fit your system
- Multiple clarification rounds
- Incorrect assumptions

**Solution:**
```
Always specify:
- Framework/library versions
- Your specific configuration
- Custom implementations
- Team conventions
- Non-standard patterns
```

### 3. Scattered Context

**Problem:**
```
Message 1: "We use PostgreSQL"
Message 15: "Our tables are partitioned by month"
Message 27: "We have 500M rows"
Message 42: "The slow query is a JOIN"
```

**Impact:**
- Fragmented understanding
- Delayed insights
- Repeated questions

**Solution:**
```
Initial context:
"Database: PostgreSQL 14
Scale: 500M rows, partitioned by month
Query pattern: Complex JOINs across partitions
Issue: Specific JOIN query taking 45 seconds
Target: Under 1 second"
```

### 4. Stale Context

**Problem:**
Continuing conversation after significant changes without update.

**Impact:**
- Suggestions based on outdated information
- Conflicts with current state
- Confusion about system state

**Solution:**
```
"UPDATE: We've migrated from MongoDB to PostgreSQL since 
our last discussion. The previous recommendations about 
document modeling no longer apply. Now we need relational 
schema design for [new requirement]."
```

### 5. Over-Precision

**Problem:**
```
"In file /src/components/UserProfile.tsx, on line 147, character 
position 23-45, there is a variable named 'userData' which is 
declared as type 'UserData' which is defined in /src/types/user.ts 
on line 8, columns 1-156, and this type extends from BaseEntity 
which is in /src/types/base.ts..."
```

**Impact:**
- Excessive detail obscures the actual issue
- Wastes context on unnecessary precision
- Harder to identify the core problem

**Solution:**
```
"The userData variable in UserProfile.tsx (line 147) has type 
mismatch issues with the API response. The component expects 
UserData but receives BaseUser from the API."
```

## Checklists

### Context Planning Checklist

Before starting a complex task:

- [ ] Identify all relevant files/systems
- [ ] Determine what Claude needs to know first
- [ ] Plan information flow (what to share when)
- [ ] Prepare code snippets (relevant sections only)
- [ ] List key constraints upfront
- [ ] Identify potential follow-up questions
- [ ] Gather error messages/logs if applicable
- [ ] Note recent changes that might be relevant
- [ ] Prepare configuration details
- [ ] Have documentation links ready

### Mid-Conversation Checklist

During long sessions, periodically verify:

- [ ] Is the current context still relevant?
- [ ] Has anything changed that Claude should know?
- [ ] Are we operating on outdated assumptions?
- [ ] Should we summarize progress so far?
- [ ] Is the conversation scope appropriate?
- [ ] Do we need to prune irrelevant details?
- [ ] Are we approaching context limits?
- [ ] Should we start a fresh conversation?
- [ ] Have we documented decisions made?
- [ ] Is the next step clear?

### Context Efficiency Checklist

Optimize context usage:

- [ ] Remove boilerplate explanations
- [ ] Reference previous context instead of repeating
- [ ] Use file paths instead of pasting code
- [ ] Summarize verbose logs/data
- [ ] Link to docs instead of copying
- [ ] Highlight specific lines/sections
- [ ] Use concise technical language
- [ ] Eliminate redundant background
- [ ] Structure information hierarchically
- [ ] Compress repetitive patterns

## Metrics for Success

### Context Efficiency Metrics

Track these indicators:

1. **Context Utilization Rate**
   - Target: 60-80% of context window
   - Measure: Average tokens used per session
   - Sweet spot: Enough info, not wasteful

2. **Information Relevance Score**
   - Target: >90% of provided context used in solution
   - Measure: Percentage of context actually referenced
   - Indicates: Focused vs. scattered context

3. **Clarification Request Rate**
   - Target: <2 clarifications per major task
   - Measure: Questions Claude asks for missing info
   - Indicates: Context completeness

4. **Context Revision Frequency**
   - Target: <1 significant update per 10 messages
   - Measure: How often context needs correction
   - Indicates: Initial context quality

5. **Session Continuation Success**
   - Target: >80% of multi-session tasks continue smoothly
   - Measure: Successful context carryover
   - Indicates: Documentation quality

### Quality Indicators

Effective context management shows:

- **First Response Accuracy:** >75% require no major correction
- **Token Efficiency:** <30% waste on redundant info
- **Context Density:** High signal-to-noise ratio
- **Progressive Disclosure:** Information arrives when needed
- **Clarity Index:** Minimal ambiguity in specifications

## Context Management Strategies

### Strategy 1: The Onion Pattern

Reveal context in layers from core to periphery:

```
CORE (Message 1):
"Implement rate limiting for API endpoints"

LAYER 1 (When implementation starts):
"Use Redis for distributed rate limiting"

LAYER 2 (When relevant):
"Current Redis config: [specific settings]"

LAYER 3 (If issues arise):
"Full Redis cluster topology: [details]"
```

### Strategy 2: The Breadcrumb Trail

Leave markers for complex multi-step tasks:

```
Step 1: "First, let's design the database schema [SCHEMA-DONE]"
Step 2: "Now implement the repository layer [REPO-DONE]"
Step 3: "Add the service layer [SERVICE-DONE]"
Step 4: "Finally, create the API endpoints [PENDING]"

[Can reference SCHEMA-DONE when working on PENDING]
```

### Strategy 3: The Snapshot Technique

Periodically summarize state:

```
"PROGRESS SNAPSHOT:

COMPLETED:
- User authentication with JWT
- Password reset flow
- Email verification

IN PROGRESS:
- OAuth2 integration (70% done)

BLOCKED:
- MFA (waiting for security review)

NEXT:
- Session management
- Remember me functionality"
```

### Strategy 4: The Reference Frame

Establish a shared vocabulary:

```
"Let's define terms for this conversation:

'Legacy System': Old PHP monolith (being phased out)
'New Platform': Node.js microservices
'Migration Window': Friday night deployments
'Safe Mode': Feature flag for gradual rollout

Now: 'Implement user sync between Legacy System and New Platform 
during Migration Window with Safe Mode enabled'"
```

### Strategy 5: The Context Cache

For repetitive tasks, create reusable context blocks:

```
CONTEXT_BLOCK_API_STANDARDS:
- RESTful design
- JSON:API specification
- OAuth2 authentication
- Rate limiting: 1000 req/hour
- Pagination: cursor-based
- Error format: RFC 7807

Usage: "Create new endpoint following CONTEXT_BLOCK_API_STANDARDS"
```

## Managing Long Conversations

### When to Continue vs. Start Fresh

**Continue existing conversation when:**
- Working on the same feature/component
- Building upon previous decisions
- Context is still relevant
- Token budget allows
- Clear progression from previous work

**Start new conversation when:**
- Switching to different system/component
- Previous context no longer relevant
- Approaching context limits (>80% used)
- Starting new phase of project
- Need fresh perspective on problem

### Conversation Splitting Strategies

For large projects, split conversations by:

1. **By Component:**
   - Conversation A: Frontend implementation
   - Conversation B: Backend API
   - Conversation C: Database design

2. **By Phase:**
   - Conversation 1: Requirements and design
   - Conversation 2: Core implementation
   - Conversation 3: Testing and optimization

3. **By Concern:**
   - Thread 1: Feature functionality
   - Thread 2: Security review
   - Thread 3: Performance optimization

### Cross-Conversation References

When splitting conversations, create bridges:

```
NEW CONVERSATION:
"Continuing from previous session where we designed the authentication 
system (see /docs/auth-design.md created in that session).

DECISIONS CARRIED FORWARD:
- JWT with refresh tokens
- Redis session storage
- OAuth2 for social login

NOW IMPLEMENTING: The session management layer"
```

## File-Based Context Management

### Externalizing Context

Move stable context to files:

```
Instead of repeating in every message:
"Our API uses these patterns: [long list]"

Create: /docs/api-patterns.md
Reference: "Following patterns in /docs/api-patterns.md, 
implement the new user search endpoint"
```

### Context Documents

Create dedicated context files:

**Project context file:**
```
/docs/CONTEXT.md

# System Architecture
- Microservices: 12 services
- Message bus: Kafka
- Databases: PostgreSQL (main), Redis (cache)
- Deployment: Kubernetes on AWS

# Key Conventions
- All APIs use REST + JSON:API
- Authentication via JWT
- Rate limiting: 1000/hour
- Pagination: cursor-based

# Common Patterns
- Error handling: /src/utils/errors.ts
- Logging: /src/utils/logger.ts
- Validation: Zod schemas
```

Reference: "Following our architecture in /docs/CONTEXT.md..."

## Token Optimization

### Efficient Information Encoding

**Instead of verbose:**
```
"The function takes three parameters. The first parameter is called 
'userId' and it is a string type that represents the user's unique 
identifier. The second parameter is called 'options' and it is an 
object type containing configuration options. The third parameter..."
```

**Use concise:**
```
"Function signature:
processUser(userId: string, options: UserOptions, callback?: Function)"
```

### Data Compression Techniques

For large datasets:

**Instead of full data:**
```json
{
  "users": [
    {"id": 1, "name": "Alice", "email": "alice@example.com", ...},
    {"id": 2, "name": "Bob", "email": "bob@example.com", ...},
    ... [500 more entries]
  ]
}
```

**Use representative sample:**
```json
{
  "users": [
    {"id": 1, "name": "Alice", "email": "alice@example.com"},
    {"id": 2, "name": "Bob", "email": "bob@example.com"}
  ],
  "totalCount": 502,
  "schema": "id: number, name: string, email: string, createdAt: ISO8601, role: enum"
}
```

## Conclusion

Effective context management is about providing the right information at the right time in the right amount. Master these techniques to have more productive conversations, get better results faster, and make optimal use of Claude's capabilities.

Remember: Context is a limited resource. Use it wisely, structure it carefully, and maintain it actively for best results.
