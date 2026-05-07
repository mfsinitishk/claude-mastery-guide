# Debugging Prompts

A comprehensive collection of prompts for debugging code issues across different scenarios and languages.

## Table of Contents
- [General Debugging](#general-debugging)
- [Stack Trace Analysis](#stack-trace-analysis)
- [Production Issues](#production-issues)
- [Performance Debugging](#performance-debugging)
- [Integration Issues](#integration-issues)

---

## General Debugging

### 1. Root Cause Analysis
```
Analyze this error and provide a root cause analysis:

Error: [paste error message]
Code: [paste relevant code]

Please provide:
1. Root cause explanation
2. Why this error occurs
3. Step-by-step fix
4. Prevention strategies
5. Related edge cases to consider
```

**Usage Context**: Use when you have an error but don't understand the underlying cause.

**Example Input**:
```javascript
Error: Cannot read property 'map' of undefined
Code:
const users = data.users;
const names = users.map(u => u.name);
```

**Example Output**:
1. Root Cause: `data.users` is undefined, likely because the API response doesn't have a `users` property
2. Why: API might be returning different structure, or request failed
3. Fix: Add null/undefined checks and default values
4. Prevention: Use optional chaining, validate API responses
5. Edge cases: Empty arrays, null vs undefined, nested properties

**Language Variations**:
- **Python**: Replace `map` with list comprehensions
- **Java**: Focus on NullPointerException patterns
- **Go**: Check for nil pointers and error handling

**Tips for Customization**:
- Add context about environment (dev/staging/prod)
- Include recent changes or deployments
- Provide API documentation if available

**Common Mistakes to Avoid**:
- Not providing enough surrounding code context
- Omitting error stack traces
- Not mentioning what you've already tried

---

### 2. Intermittent Bug Investigation
```
Help me debug an intermittent issue that occurs [frequency]:

Symptom: [describe what happens]
Environment: [dev/staging/prod]
Frequency: [happens X% of time or under Y conditions]
Steps to reproduce: [if known]
What I've tried: [list debugging steps taken]

Please help me:
1. Identify potential race conditions or timing issues
2. Suggest logging/monitoring strategies
3. Design reproduction scenarios
4. Recommend debugging tools
```

**Usage Context**: Perfect for bugs that don't happen consistently.

**Example Input**:
```
Symptom: Users occasionally see stale data after update
Environment: Production
Frequency: ~5% of update requests
Steps to reproduce: Unknown - seems random
What I've tried: Added logging, can't reproduce locally
```

**Tips for Customization**:
- Note any patterns (time of day, specific users, load conditions)
- Include system architecture (caching layers, databases, services)
- Mention concurrent users or load when issue occurs

---

### 3. Regression Bug Analysis
```
A feature that was working broke after recent changes:

Working Version: [commit/version]
Broken Version: [commit/version]
What Changed: [describe changes or paste git diff]
Symptom: [what's broken]

Please:
1. Analyze the changes that likely caused the regression
2. Explain the relationship between changes and symptom
3. Suggest fix with minimal impact
4. Recommend tests to prevent future regressions
```

**Usage Context**: When something breaks after a deployment or merge.

**Language Variations**:
- Include language-specific build/deployment artifacts
- Framework-specific state management issues

---

### 4. Silent Failure Debugging
```
Code executes without errors but doesn't produce expected results:

Expected: [describe expected behavior]
Actual: [describe actual behavior]
Code: [paste code]
Tests passing: [yes/no]

Help me:
1. Identify where logic diverges from expectations
2. Find silent failures or swallowed errors
3. Add appropriate error handling
4. Design test cases to catch this
```

**Usage Context**: When code runs but produces wrong results silently.

**Common Mistakes to Avoid**:
- Not providing the expected vs actual comparison
- Missing assertions or validation logic
- Not showing how you're observing the output

---

## Stack Trace Analysis

### 5. Complex Stack Trace Decoder
```
Decode this stack trace and explain the execution flow:

[paste full stack trace]

Please provide:
1. Plain English explanation of what happened
2. Sequence of function calls leading to error
3. Exact line/function where error originated
4. Related code areas to investigate
5. Similar error patterns to watch for
```

**Usage Context**: For understanding complex or nested stack traces.

**Example Input**:
```
Error: Invalid JWT token
  at jwt.verify (/node_modules/jsonwebtoken/verify.js:123)
  at authenticateToken (middleware/auth.js:45)
  at Layer.handle [as handle_request] (express/lib/router/layer.js:95)
  at trim_prefix (express/lib/router/index.js:317)
  at Router.handle (express/lib/router/index.js:284)
```

**Language Variations**:
- **Python**: Include full traceback with locals
- **Java**: Include nested exceptions and causes
- **.NET**: Include inner exceptions

---

### 6. Multi-Thread Stack Analysis
```
Analyze these concurrent stack traces:

Thread 1: [paste trace]
Thread 2: [paste trace]
Thread N: [paste trace]

Help identify:
1. Deadlock conditions
2. Race conditions
3. Thread interaction issues
4. Lock contention points
5. Resolution strategies
```

**Usage Context**: For concurrent programming issues.

**Tips for Customization**:
- Include thread dumps at different time intervals
- Add thread states (WAITING, BLOCKED, RUNNABLE)
- Mention synchronization mechanisms in use

---

## Production Issues

### 7. Production Crash Post-Mortem
```
Production system crashed with the following:

Time: [timestamp]
Error: [error message/logs]
System State: [metrics before crash]
Recent Changes: [deployments/config changes]
Impact: [affected users/services]

Perform a post-mortem analysis:
1. Identify root cause
2. Explain failure cascade if applicable
3. Immediate mitigation steps
4. Long-term prevention
5. Monitoring improvements needed
```

**Usage Context**: After-action analysis for production incidents.

**Example Input**:
```
Time: 2026-05-05 14:30 UTC
Error: OutOfMemoryError: Java heap space
System State: Memory usage at 95%, CPU at 60%
Recent Changes: Deployed v2.3.0 with new caching
Impact: 500 errors for 15 minutes, 10K users affected
```

---

### 8. Memory Leak Detection
```
Suspected memory leak in [application/service]:

Memory Pattern: [gradually increasing/sudden spikes]
Duration: [how long until OOM]
Heap Dumps: [available/not available]
Code Area: [suspected component]

Help me:
1. Analyze potential leak sources
2. Design memory profiling strategy
3. Identify common leak patterns in this code
4. Suggest fix and verification approach
```

**Usage Context**: For diagnosing memory consumption issues.

**Language Variations**:
- **Java**: Focus on heap analysis, GC logs
- **Python**: Reference counting, circular references
- **JavaScript**: Event listeners, closures, DOM references

---

## Performance Debugging

### 9. Slow Query Debugging
```
This operation is slow:

Operation: [describe operation]
Expected Time: [X ms/seconds]
Actual Time: [Y ms/seconds]
Code: [paste code]
Data Volume: [record count, data size]

Analyze:
1. Performance bottlenecks
2. Algorithm complexity issues
3. Optimization opportunities
4. Benchmark improvements
```

**Usage Context**: When specific operations are slower than expected.

**Tips for Customization**:
- Include profiler output if available
- Add database query plans
- Mention infrastructure specs

---

### 10. API Latency Investigation
```
API endpoint experiencing high latency:

Endpoint: [URL/path]
p50: [Xms] p95: [Yms] p99: [Zms]
Request Volume: [requests/sec]
Database Queries: [count and patterns]
External Calls: [third-party APIs]

Investigate:
1. Request processing bottlenecks
2. Database query optimization
3. Caching opportunities
4. Architecture improvements
```

**Usage Context**: For debugging slow API responses.

---

## Integration Issues

### 11. Third-Party API Failures
```
Integration with [service] is failing:

API: [endpoint]
Error: [response/error message]
Request: [payload]
Response: [headers and body]
Frequency: [always/intermittent]

Debug:
1. API contract compliance
2. Authentication/authorization issues
3. Payload format problems
4. Retry and fallback strategies
```

**Usage Context**: When external service integrations break.

---

### 12. Data Serialization Issues
```
Data corruption during serialization/deserialization:

Format: [JSON/XML/Protobuf/etc]
Source: [code/system sending data]
Destination: [code/system receiving data]
Issue: [describe corruption/error]
Sample Data: [paste examples]

Analyze:
1. Encoding/decoding mismatches
2. Schema version conflicts
3. Type conversion issues
4. Fix and validation approach
```

**Usage Context**: For data format transformation problems.

---

### 13. Message Queue Debugging
```
Issues with message processing:

Queue: [name/type]
Issue: [messages not processed/duplicates/lost messages]
Consumer Code: [paste code]
Message Format: [schema]
Error Logs: [paste errors]

Debug:
1. Message delivery guarantees
2. Acknowledgment issues
3. Dead letter queue analysis
4. Consumer scaling problems
```

**Usage Context**: For debugging async messaging systems.

---

### 14. Database Connection Issues
```
Database connectivity problems:

Database: [type and version]
Error: [connection error]
Connection Pool: [settings]
Frequency: [constant/intermittent]
Load: [concurrent connections]

Investigate:
1. Connection pool exhaustion
2. Network/timeout issues
3. Database server capacity
4. Configuration tuning
```

**Usage Context**: For database connection problems.

---

### 15. Authentication/Authorization Failures
```
Users experiencing auth issues:

Auth System: [JWT/OAuth/SAML/etc]
Error: [message]
User Impact: [specific users/all users]
Auth Flow: [describe flow]
Recent Changes: [any auth updates]

Debug:
1. Token validation issues
2. Session management problems
3. Permission/role configuration
4. Identity provider integration
```

**Usage Context**: For authentication and authorization bugs.

**Tips for Customization**:
- Include token/session details (expiry, scopes)
- Add IdP logs if available
- Note browser/client environment

---

## Best Practices for Debugging Prompts

1. **Provide Complete Context**: Always include error messages, stack traces, and relevant code
2. **State What You've Tried**: List debugging steps already taken to avoid repetition
3. **Include Environment Details**: OS, language version, framework versions
4. **Add Reproduction Steps**: Even if intermittent, share any patterns observed
5. **Specify Impact**: Production vs development, user impact, urgency
6. **Request Structured Output**: Ask for numbered lists, explanations, and action items
7. **Include Sample Data**: Sanitized examples help identify data-related issues
8. **Mention Constraints**: Time limits, can't restart services, production environment limitations

## Advanced Debugging Prompt Template

```
Debug this [type] issue in [environment]:

CONTEXT:
- Language/Framework: [details]
- Environment: [dev/staging/prod]
- Affected: [scope of impact]

PROBLEM:
- Expected: [behavior]
- Actual: [behavior]
- Error: [message/trace]

INVESTIGATION:
- Tried: [steps taken]
- Findings: [observations]
- Logs: [relevant logs]

CONSTRAINTS:
- [limitations on debugging approach]

REQUEST:
1. Root cause analysis
2. Step-by-step fix
3. Verification approach
4. Prevention measures
5. Monitoring recommendations
```

This template ensures you provide all necessary information for effective debugging assistance.
