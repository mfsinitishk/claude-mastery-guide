# Sub-Agents

## Delegating Tasks to Specialized AI Agents

---

## 🎯 Overview

Sub-agents are specialized AI instances that handle specific tasks independently, then report results back to you or a parent agent. Instead of doing everything yourself, you delegate discrete work to sub-agents running in parallel or sequence, dramatically improving efficiency and specialization.

**Time to Master:** 3-4 hours  
**Outcome:** Effectively delegate work to specialized sub-agents

---

## 💡 What Are Sub-Agents?

### Concept

**Traditional Approach:**
```
You → Claude → Does everything sequentially
```

**Sub-Agent Approach:**
```
You → Claude (orchestrator)
       ↓
       ├─→ Agent 1 (code analysis)
       ├─→ Agent 2 (test generation)
       ├─→ Agent 3 (documentation)
       └─→ Agent 4 (security review)
       
All work in parallel, report back
```

### Benefits

**Parallelization:**
- Multiple tasks simultaneously
- Faster completion
- Better resource utilization

**Specialization:**
- Each agent optimized for specific task
- Focused context
- Better quality output

**Isolation:**
- Errors in one agent don't affect others
- Independent context windows
- Clean separation of concerns

---

## 🔧 Sub-Agent Patterns

### Pattern 1: Parallel Research

**Scenario:** Research multiple technologies for a decision

**Orchestration:**
```
Main Request: "Which database should we use: PostgreSQL, MongoDB, or DynamoDB?"

Spawn 3 agents in parallel:
├─ Agent 1: Research PostgreSQL
│  Context: Our use case, scale requirements
│  Task: Evaluate fit, pros/cons, costs
│
├─ Agent 2: Research MongoDB  
│  Context: Our use case, scale requirements
│  Task: Evaluate fit, pros/cons, costs
│
└─ Agent 3: Research DynamoDB
   Context: Our use case, scale requirements
   Task: Evaluate fit, pros/cons, costs

Wait for all to complete, then synthesize recommendations
```

**Example:**
```
You: I need to choose a database for a social media app 
(1M users, heavy read, moderate write, real-time feeds).

Research PostgreSQL, MongoDB, and DynamoDB in parallel.

Claude (orchestrator):
Spawning 3 research agents...

[Agent 1 - PostgreSQL Expert]
Analyzing PostgreSQL for your use case...

Strengths:
- ACID compliance
- Complex queries (JOINs for feed generation)
- Proven scalability (Instagram uses it)
- Strong consistency

Weaknesses:
- Requires sharding for 1M+ users
- Vertical scaling limits
- Cache layer needed for real-time

Cost: ~$500/month for 1M users (AWS RDS)
Recommendation: Strong fit for relational data

[Agent 2 - MongoDB Expert]
Analyzing MongoDB for your use case...

Strengths:
- Horizontal scaling (sharding)
- Flexible schema
- Good for user profiles
- Fast reads

Weaknesses:
- No JOINs (denormalization needed)
- Eventual consistency
- More complex feed queries

Cost: ~$800/month for 1M users (Atlas)
Recommendation: Good for user data, challenging for feeds

[Agent 3 - DynamoDB Expert]
Analyzing DynamoDB for your use case...

Strengths:
- Infinite scale
- Single-digit ms latency
- Fully managed
- Good for feeds (time-series data)

Weaknesses:
- Expensive at scale
- Limited query patterns
- Learning curve

Cost: ~$1,200/month for 1M users
Recommendation: Best for real-time, costs more

[Orchestrator - Synthesizing]
Based on all three analyses:

RECOMMENDED: PostgreSQL + Redis
- PostgreSQL for core data (ACID, relationships)
- Redis for real-time feeds (caching)
- Best balance of cost, capability, maturity

ALTERNATIVE: DynamoDB if cost isn't primary concern
```

### Pattern 2: Sequential Processing Pipeline

**Scenario:** Multi-stage code transformation

**Pipeline:**
```
Input: Legacy JavaScript code

Stage 1 (Agent 1): Convert JS → TypeScript
   ↓
Stage 2 (Agent 2): Add type safety & validation
   ↓
Stage 3 (Agent 3): Refactor for best practices
   ↓
Stage 4 (Agent 4): Generate tests
   ↓
Output: Modern TypeScript with tests
```

**Example:**
```
You: Migrate this legacy JavaScript file to modern TypeScript

[Agent 1 - TypeScript Converter]
Converting to TypeScript...
- Added type annotations
- Converted var → const/let
- Updated module syntax
Output: basic-typescript.ts

[Agent 2 - Type Safety Expert]
Adding strict typing...
- Replaced 'any' with specific types
- Added interface definitions
- Enabled strict mode
Output: typed-typescript.ts

[Agent 3 - Code Quality Expert]
Refactoring for best practices...
- Extracted functions
- Removed duplication
- Improved naming
Output: refactored-typescript.ts

[Agent 4 - Test Generator]
Generating test suite...
- Unit tests for all functions
- Edge case coverage
- Mocking dependencies
Output: complete-with-tests/

Final result: Production-ready TypeScript module
```

### Pattern 3: Divide and Conquer

**Scenario:** Large codebase analysis

**Division:**
```
Codebase (500 files)
   ↓
Split by module:
├─ Agent 1: /api (100 files)
├─ Agent 2: /services (120 files)
├─ Agent 3: /models (80 files)
├─ Agent 4: /utils (50 files)
└─ Agent 5: /components (150 files)

Each analyzes independently, reports findings
Orchestrator merges insights
```

**Example:**
```
You: Analyze this codebase for security vulnerabilities

Claude (orchestrator):
Dividing codebase into 5 modules...
Spawning 5 security review agents...

[Agent 1 - API Security]
Reviewing /api (100 files)...

Found:
- 3 SQL injection risks (users.ts, products.ts, orders.ts)
- 2 missing authentication checks
- 1 CORS misconfiguration

[Agent 2 - Service Layer Security]
Reviewing /services (120 files)...

Found:
- Password hashing inconsistency
- Sensitive data in logs (3 files)
- Unvalidated user input (5 services)

[Agent 3 - Models Security]
Reviewing /models (80 files)...

Found:
- PII not encrypted at rest
- Missing data validation
- Weak password requirements

[Agent 4 - Utils Security]
Reviewing /utils (50 files)...

Found:
- Insecure random number generation
- Deprecated crypto functions
- Hardcoded secrets (2 files)

[Agent 5 - Components Security]
Reviewing /components (150 files)...

Found:
- XSS vulnerabilities (8 components)
- Missing input sanitization
- Unsafe innerHTML usage

[Orchestrator - Summary]
CRITICAL: 15 issues
HIGH: 23 issues  
MEDIUM: 12 issues

Top priorities:
1. Fix SQL injection (Agent 1)
2. Remove hardcoded secrets (Agent 4)
3. Fix XSS vulnerabilities (Agent 5)
```

### Pattern 4: Expert Consultation

**Scenario:** Get multiple expert opinions

**Experts:**
```
Problem: API performance degradation

Consult:
├─ Agent 1: Database Expert
├─ Agent 2: Caching Expert
├─ Agent 3: Network Expert
└─ Agent 4: Code Optimization Expert

Each analyzes from their domain perspective
```

**Example:**
```
You: Our API response time jumped from 200ms to 2000ms.
Help diagnose the issue.

Claude (orchestrator):
Consulting 4 domain experts...

[Agent 1 - Database Expert]
Analyzing database queries...

Findings:
- Missing index on users.email (causing full table scan)
- N+1 query in order retrieval
- No connection pooling

Impact: ~1200ms of the slowdown
Fix: Add index, optimize queries, add pooling

[Agent 2 - Caching Expert]
Analyzing cache usage...

Findings:
- Cache hit rate dropped from 80% to 20%
- Redis evicting entries too aggressively
- No cache warming after deploys

Impact: ~400ms of the slowdown
Fix: Increase Redis memory, add cache warming

[Agent 3 - Network Expert]
Analyzing network calls...

Findings:
- External API timeout increased (3rd party)
- No circuit breaker
- Sequential calls (should be parallel)

Impact: ~300ms of the slowdown
Fix: Add circuit breaker, parallelize calls

[Agent 4 - Code Optimization Expert]
Analyzing code efficiency...

Findings:
- Synchronous file I/O in request handler
- Large JSON serialization
- No response compression

Impact: ~100ms of the slowdown
Fix: Async I/O, stream responses, enable gzip

[Orchestrator - Diagnosis]
Total slowdown: ~2000ms (explained)

Priority fixes:
1. Add database index (1200ms saved) - 5 min
2. Fix cache eviction (400ms saved) - 30 min
3. Add circuit breaker (300ms saved) - 1 hour
4. Enable compression (100ms saved) - 5 min

Estimated recovery: Back to <300ms response time
```

---

## 🎯 Orchestration Strategies

### Strategy 1: Fire and Forget

**When:** Independent tasks, results not needed immediately

```
Spawn agents for:
- Generate documentation
- Run security audit
- Analyze dependencies
- Create test report

Don't wait, continue with other work
Check results later
```

### Strategy 2: Wait for All

**When:** Results needed before proceeding

```
Spawn agents for:
- Research option A
- Research option B  
- Research option C

Wait for all 3 to complete
Compare results
Make decision
```

### Strategy 3: First to Respond

**When:** Speed matters, any valid answer works

```
Spawn 3 agents with same task (different approaches)
Use first valid response
Cancel remaining agents
```

### Strategy 4: Reduction Pattern

**When:** Aggregating many results

```
Spawn 10 agents (analyze 10 files each)
Each returns: list of issues

Reduction agent:
- Deduplicates issues
- Prioritizes by severity
- Creates unified report
```

---

## 🔧 Practical Examples

### Example 1: Code Review Pipeline

```
Input: Pull Request with 15 changed files

Parallel Review:
├─ Agent 1: Security review (all files)
├─ Agent 2: Performance review (all files)
├─ Agent 3: Test coverage review (all files)
└─ Agent 4: Code quality review (all files)

Each agent reviews from their perspective
Results merged into comprehensive review

Output: 
- Security: 2 issues found
- Performance: 3 optimizations suggested
- Test coverage: 4 files missing tests
- Code quality: 12 minor improvements

Consolidated report with priorities
```

### Example 2: Feature Implementation

```
Task: Implement user notification system

Sequential Pipeline:
1. Agent 1: Design database schema
   Output: migrations, models

2. Agent 2: Implement backend API (uses output from 1)
   Output: endpoints, services

3. Agent 3: Create frontend components (uses output from 2)
   Output: React components, hooks

4. Agent 4: Write tests (uses outputs from 1-3)
   Output: test suite

Each agent builds on previous work
Final: Complete feature, fully tested
```

### Example 3: Dependency Audit

```
Project: 150 dependencies

Divide by type:
├─ Agent 1: Check production deps (80 packages)
├─ Agent 2: Check dev deps (50 packages)
└─ Agent 3: Check optional deps (20 packages)

Each checks:
- Security vulnerabilities
- Outdated versions
- License compatibility
- Bundle size impact

Results combined:
- 5 critical vulnerabilities
- 23 major updates available
- 2 license issues
- 15 packages bloating bundle

Action plan generated
```

---

## ✅ Best Practices

### DO:
✅ Clearly define each agent's task  
✅ Provide necessary context to each agent  
✅ Use parallelization when tasks are independent  
✅ Set timeouts for long-running agents  
✅ Handle agent failures gracefully  
✅ Validate agent outputs  
✅ Consolidate results effectively  

### DON'T:
❌ Over-parallelize (too many agents at once)  
❌ Create circular dependencies between agents  
❌ Ignore error handling  
❌ Duplicate context across all agents  
❌ Forget to cancel unnecessary agents  
❌ Blindly trust all agent outputs  

---

## 🚀 Advanced Patterns

### Hierarchical Agents

```
Main Orchestrator
   ↓
Manager Agent 1 (Backend)
   ├─ Worker: API implementation
   ├─ Worker: Database design
   └─ Worker: Testing
   
Manager Agent 2 (Frontend)
   ├─ Worker: Components
   ├─ Worker: Styling
   └─ Worker: Integration
   
Manager Agent 3 (DevOps)
   ├─ Worker: CI/CD
   ├─ Worker: Infrastructure
   └─ Worker: Monitoring
```

### Consensus Pattern

```
Spawn 5 agents with same task
Each proposes solution
Voting mechanism picks best
Or: blend best parts of each solution
```

---

## 🎓 Practice Exercise

**Task:** Analyze a codebase for migration to microservices

**Approach:**
1. Spawn agents to analyze different modules
2. Each identifies potential service boundaries
3. Aggregate findings
4. Propose microservice architecture

**Sub-agents:**
- Domain expert (business logic analysis)
- Data expert (database dependencies)
- Integration expert (external APIs)
- Infrastructure expert (deployment considerations)

---

**Next:** [Agent Orchestration →](./09-agent-orchestration.md)
