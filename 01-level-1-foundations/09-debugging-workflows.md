# Debugging Workflows

## From Error Messages to Solutions with AI

---

## 🎯 Overview

Debugging is detective work. Claude acts as your expert debugging partner, helping you identify root causes, understand error messages, and generate fix hypotheses faster than traditional trial-and-error approaches.

**Time to Master:** 4-6 hours of practice  
**Outcome:** Systematically debug issues using AI-assisted analysis and fix generation

---

## 💡 The AI-Assisted Debugging Advantage

### Traditional Debugging

```
Error appears → Stack Overflow search → Try random solutions →
Still broken → Google more → Copy paste fixes →
Hours later... maybe it works?

Time: 2-4 hours (or days)
Success rate: 50-70%
Understanding: Low
```

### AI-Assisted Debugging

```
Error appears → Describe to Claude → Get root cause analysis →
Understand the issue → Review fix suggestions → Apply and test →
Working code + understanding

Time: 15-30 minutes
Success rate: 80-95%
Understanding: High
```

---

## 🔧 Describing Bugs Effectively

### The Bug Report Formula

```
WHAT: What's happening (unexpected behavior)
EXPECTED: What should happen
CONTEXT: Environment, versions, setup
ERROR: Error messages, stack traces
CODE: Relevant code sections
ATTEMPTED: What you've already tried
```

### Example: Poor Bug Description

**❌ Bad:**
```
"My code doesn't work. Help."
```

**Problems:**
- No specifics
- No error information
- No context
- No code
- Impossible to help effectively

### Example: Good Bug Description

**✅ Good:**
```
PROBLEM:
My React component crashes when I click the submit button.

EXPECTED BEHAVIOR:
Form should submit data to API and show success message.

ACTUAL BEHAVIOR:
App crashes with "Cannot read property 'email' of undefined"

ENVIRONMENT:
- React 18.2.0
- TypeScript 4.9.5
- Chrome 120

ERROR MESSAGE:
```
TypeError: Cannot read property 'email' of undefined
  at handleSubmit (UserForm.tsx:42)
  at onClick (Button.tsx:18)
```

CODE:
```tsx
function UserForm() {
  const [formData, setFormData] = useState({});
  
  const handleSubmit = () => {
    // Line 42 - crashes here
    console.log(formData.email);
    submitToAPI(formData);
  };
  
  return (
    <form>
      <input name="email" onChange={e => setFormData({email: e.target.value})} />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
}
```

ATTEMPTS:
- Tried adding console.log - shows formData is undefined
- Checked React docs on useState
- Still not sure why formData loses its value
```

---

## 🎨 Debugging Prompt Patterns

### Pattern 1: Error Message Analysis

**Template:**
```
I'm getting this error and don't understand it:

Error: [full error message]

Stack trace:
[full stack trace]

Context:
- [What you were doing]
- [Language/framework versions]

Please explain:
1. What this error means in plain English
2. What's causing it
3. How to fix it
4. How to prevent it in the future

[Relevant code]
```

**Example:**
```
I'm getting this error in my Node.js app:

Error: EADDRINUSE: address already in use :::3000

Context:
- Node.js 18.16.0
- Express 4.18.2
- Happened after I restarted the server

Please explain:
1. What does EADDRINUSE mean?
2. Why is this happening?
3. How do I fix it?
4. How do I prevent it?
```

**Expected Response:**
```
WHAT IT MEANS:
EADDRINUSE = "Error: Address Already in Use"
Port 3000 is being used by another process.

WHY IT'S HAPPENING:
Your previous Node.js process didn't shut down properly
and is still holding port 3000.

HOW TO FIX:
Option 1 - Kill the process:
```bash
# Find process using port 3000
lsof -i :3000

# Kill it (replace PID with actual number)
kill -9 <PID>
```

Option 2 - Use a different port:
```javascript
const PORT = process.env.PORT || 3001;
app.listen(PORT);
```

PREVENTION:
1. Properly close processes (Ctrl+C, not closing terminal)
2. Use nodemon for auto-restart during development
3. Implement graceful shutdown:
```javascript
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```
```

### Pattern 2: Unexpected Behavior

**Template:**
```
My code produces unexpected results:

EXPECTED: [What should happen]
ACTUAL: [What's happening]

Steps to reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Code:
[Minimal code that reproduces the issue]

Variables at point of error:
[Values of relevant variables]

Debug this issue:
1. Identify the root cause
2. Explain why it's happening
3. Provide a fix
4. Suggest tests to catch this
```

**Example:**
```
My sorting function produces wrong results:

EXPECTED: [1, 2, 3, 10, 20]
ACTUAL: [1, 10, 2, 20, 3]

Steps to reproduce:
1. Call sortNumbers([20, 1, 10, 3, 2])
2. Get wrong order

Code:
```javascript
function sortNumbers(arr) {
  return arr.sort();
}

const result = sortNumbers([20, 1, 10, 3, 2]);
console.log(result); // [1, 10, 2, 20, 3]
```

Why is this happening and how do I fix it?
```

### Pattern 3: Performance Issues

**Template:**
```
My code is too slow:

PROBLEM: [What's slow]
SCALE: [How much data, how slow]
EXPECTATION: [How fast it should be]

Code:
[Code with performance issue]

Profiling data (if available):
[Performance measurements]

Help me:
1. Identify bottlenecks
2. Explain why it's slow
3. Suggest optimizations
4. Show optimized version
```

**Example:**
```
My data processing is too slow:

PROBLEM: Processing 10,000 users takes 45 seconds
SCALE: 10,000 users, ~4.5ms per user
EXPECTATION: Should handle 10,000 in under 5 seconds

Code:
```python
def process_users(users):
    results = []
    for user in users:
        if is_active_user(user['id']):  # Database query
            if has_valid_subscription(user['id']):  # Another DB query
                enriched = add_user_metadata(user['id'])  # Third DB query
                results.append(enriched)
    return results
```

Why so slow? How to optimize?
```

### Pattern 4: Intermittent Bugs

**Template:**
```
I have a bug that only happens sometimes:

PROBLEM: [Description]
FREQUENCY: [How often - 50% of time, only on Tuesdays, etc.]
PATTERN: [When it happens vs. when it doesn't]

When it works: [Conditions]
When it fails: [Conditions]

Code:
[Relevant code]

Help me:
1. Identify race conditions or timing issues
2. Find the root cause
3. Make it consistently reproducible
4. Fix it
```

**Example:**
```
Button click sometimes doesn't work:

PROBLEM: Submit button sometimes doesn't trigger form submission
FREQUENCY: About 30% of clicks
PATTERN: Seems to fail more on first click after page load

When it works: Most subsequent clicks work fine
When it fails: Often the first click, sometimes random clicks

Code:
```javascript
function Form() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchInitialData().then(setData);
  }, []);
  
  const handleSubmit = () => {
    submitForm(data);
  };
  
  return <button onClick={handleSubmit}>Submit</button>;
}
```

Why is this intermittent?
```

### Pattern 5: Integration Issues

**Template:**
```
My code works locally but fails in [environment]:

LOCAL BEHAVIOR: [What happens locally]
[ENVIRONMENT] BEHAVIOR: [What happens in prod/staging/test]

Differences:
- [Environment variable differences]
- [Version differences]
- [Configuration differences]

Error in [environment]:
[Error message]

Code:
[Relevant code]

Help me identify environment-specific issues.
```

---

## 🔍 Systematic Debugging Strategies

### Strategy 1: Binary Search Debugging

**When:** Large codebase, unclear where bug is

**Prompt:**
```
I have a bug somewhere in this workflow:
[List of steps/functions]

The bug appears at step X.

Help me use binary search debugging:
1. Where should I add logging first?
2. What should I log to narrow it down?
3. Based on log output, where to look next?

Code:
[Workflow code]
```

**Example:**
```
Bug in user registration flow:

1. User submits form
2. Validate input
3. Hash password
4. Save to database
5. Send welcome email
6. Return success

User isn't receiving welcome email (step 5).

Where should I start investigating?
```

### Strategy 2: Rubber Duck Debugging with Claude

**When:** Stuck, need to think through the problem

**Prompt:**
```
I'm stuck on this bug. Let me explain my code step by step:

[Explain your code line by line]

What am I missing?
```

**Example:**
```
I'm stuck on why this counter doesn't increment:

1. I have state: const [count, setCount] = useState(0)
2. I have a button: <button onClick={increment}>
3. My increment function: const increment = () => { setCount(count + 1); }
4. I call it twice: increment(); increment();
5. But count only goes up by 1, not 2

What am I missing?
```

### Strategy 3: Diff-Based Debugging

**When:** Code worked before, broke recently

**Prompt:**
```
This code worked yesterday but is broken today.

What changed:
[List of changes]

Old behavior: [What worked]
New behavior: [What's broken]

Old code:
[Previous version]

New code:
[Current version]

What broke and why?
```

### Strategy 4: Hypothesis Testing

**When:** Multiple potential causes

**Prompt:**
```
I have a bug with multiple possible causes:

Hypothesis 1: [Potential cause]
Hypothesis 2: [Potential cause]
Hypothesis 3: [Potential cause]

For each hypothesis:
1. How to test it?
2. What evidence supports/refutes it?
3. How likely is it?

Code:
[Relevant code]

Help me prioritize what to test first.
```

### Strategy 5: Error-Driven Development

**When:** Error messages provide clues

**Prompt:**
```
I'm getting this error:
[Error message and stack trace]

Walk me through debugging this:
1. Interpret the error message
2. Identify the exact line causing it
3. Explain what's wrong on that line
4. Show me how to fix it
5. Explain how to prevent similar errors

Code:
[Code from stack trace]
```

---

## 🐛 Common Bug Categories

### Category 1: Logic Errors

**Example:**
```python
def calculate_discount(price, is_premium):
    if is_premium:
        discount = 0.2
    else:
        discount = 0.1
    
    # Bug: returns original price, not discounted
    return price
```

**Debugging Prompt:**
```
This discount function isn't working:
- Premium users should get 20% off
- Regular users should get 10% off
- But everyone pays full price

Find the bug:
[code above]
```

### Category 2: Off-by-One Errors

**Example:**
```javascript
function getLastNItems(arr, n) {
  return arr.slice(arr.length - n, arr.length - 1);
  // Bug: misses the last element
}
```

**Debugging Prompt:**
```
This function should return last 3 items but only returns 2:

Input: [1, 2, 3, 4, 5], n=3
Expected: [3, 4, 5]
Actual: [3, 4]

Find the off-by-one error:
[code above]
```

### Category 3: Async/Timing Issues

**Example:**
```javascript
async function loadData() {
  let data;
  fetchData().then(result => {
    data = result;
  });
  return data; // Bug: returns undefined
}
```

**Debugging Prompt:**
```
This async function returns undefined:

Expected: Should return fetched data
Actual: Returns undefined

What's wrong with the async handling?
[code above]
```

### Category 4: State Management

**Example:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  const incrementThreeTimes = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Bug: only increments by 1
  };
}
```

**Debugging Prompt:**
```
This function should increment by 3 but only increments by 1:

Why doesn't this work?
[code above]

How should it be written?
```

### Category 5: Scope/Closure Issues

**Example:**
```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i); // Bug: prints 5 five times
  }, 100);
}
```

**Debugging Prompt:**
```
This should print 0, 1, 2, 3, 4 but prints 5 five times:

Explain the closure issue and how to fix it:
[code above]
```

---

## 🎓 Practice Exercises

### Exercise 1: Debug the Authentication

```typescript
async function login(email: string, password: string) {
  const user = await User.findOne({ email: email });
  
  if (user.password === password) {
    return generateToken(user.id);
  }
  
  return null;
}
```

**Issues:**
- Security problem (password comparison)
- Error handling missing
- What if user not found?

**Your Debugging Prompt:**
```
[Write your debugging request here]
```

### Exercise 2: Debug the Data Processing

```python
def process_sales_data(sales):
    total = 0
    for sale in sales:
        if sale['amount'] > 100:
            total += sale['amount'] * 1.1
    return total
```

**Issue:**
Running on large dataset returns `inf` (infinity)

**Your Debugging Prompt:**
```
[Write your debugging request here]
```

### Exercise 3: Debug the UI Component

```javascript
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    search(query).then(setResults);
  }, []);
  
  return (
    <ul>
      {results.map(r => <li>{r.title}</li>)}
    </ul>
  );
}
```

**Issue:**
Search doesn't update when query changes

**Your Debugging Prompt:**
```
[Write your debugging request here]
```

---

## 🚀 Real-World Debugging Scenarios

### Scenario 1: Production Memory Leak

**Symptoms:**
- Server memory grows continuously
- Eventually crashes (OOM)
- Happens after ~6 hours of uptime

**Debugging Prompt:**
```
My Node.js server has a memory leak:

SYMPTOMS:
- Memory grows from 100MB to 2GB over 6 hours
- Crashes with "JavaScript heap out of memory"
- Happens in production, hard to reproduce locally

RECENT CHANGES:
- Added caching layer
- New WebSocket connections for real-time updates
- Background job processing

CODE - Cache implementation:
```javascript
const cache = new Map();

app.get('/api/data/:id', (req, res) => {
  const cached = cache.get(req.params.id);
  if (cached) return res.json(cached);
  
  const data = fetchData(req.params.id);
  cache.set(req.params.id, data);
  res.json(data);
});
```

CODE - WebSocket:
```javascript
io.on('connection', (socket) => {
  const interval = setInterval(() => {
    socket.emit('update', getData());
  }, 1000);
});
```

Help me find the memory leak.
```

### Scenario 2: Race Condition in Payment Processing

**Symptoms:**
- Occasional duplicate charges
- ~1% of transactions affected
- Only under load

**Debugging Prompt:**
```
I have a race condition in payment processing:

PROBLEM:
- Sometimes users are charged twice
- Happens when they click "Pay" multiple times quickly
- Only ~1% of transactions, but critical

CODE:
```javascript
async function processPayment(orderId) {
  const order = await Order.findById(orderId);
  
  if (order.status === 'pending') {
    const charge = await stripe.charges.create({
      amount: order.total,
      source: order.paymentToken
    });
    
    await order.update({ status: 'paid', chargeId: charge.id });
  }
}
```

FRONT END:
```javascript
<button onClick={() => processPayment(orderId)}>
  Pay Now
</button>
```

How do I prevent duplicate charges?
```

### Scenario 3: Mysterious Database Query Slow-Down

**Symptoms:**
- Query was fast, now slow
- No code changes
- Data volume increased

**Debugging Prompt:**
```
Database query suddenly became slow:

BEFORE: 50ms
NOW: 5000ms (100x slower)

QUERY:
```sql
SELECT u.*, 
       COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id
ORDER BY post_count DESC
LIMIT 100;
```

CONTEXT:
- No code changes
- User count went from 10K to 100K
- Post count went from 50K to 1M
- MySQL 8.0

EXPLAIN output:
[paste EXPLAIN output]

Help me optimize this.
```

---

## ✅ Debugging Best Practices

### Before Debugging
- [ ] Reproduce the bug reliably
- [ ] Isolate the problem (minimal reproduction)
- [ ] Gather error messages and logs
- [ ] Document expected vs. actual behavior
- [ ] Note recent changes

### During Debugging
- [ ] Form hypothesis before changing code
- [ ] Test one thing at a time
- [ ] Add logging strategically
- [ ] Use debugger/breakpoints
- [ ] Document findings

### After Debugging
- [ ] Verify fix works
- [ ] Write test to prevent regression
- [ ] Document root cause
- [ ] Clean up debug code
- [ ] Consider similar bugs elsewhere

---

## 💡 Pro Tips

**Tip 1: Start Simple**
Check the obvious first: typos, syntax errors, missing imports.

**Tip 2: Read Error Messages Carefully**
Error messages often tell you exactly what's wrong.

**Tip 3: Use Process of Elimination**
Remove code until bug disappears, then add back until it returns.

**Tip 4: Take Breaks**
Fresh eyes often spot issues immediately.

**Tip 5: Keep a Bug Journal**
Document bugs and solutions for future reference.

---

## 🚀 Next Steps

Now that you can debug effectively with AI, let's learn how to generate comprehensive documentation.

**Next:** [Documentation Generation →](./10-documentation-generation.md)

---

*"Debugging is twice as hard as writing code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it." - Brian Kernighan*

*Debug systematically. Understand deeply. Prevent relentlessly.*
