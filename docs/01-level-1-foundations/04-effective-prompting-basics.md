# Effective Prompting Basics

## The Art and Science of Communicating with AI

---

## 🎯 Overview

Prompting is the fundamental skill of AI-assisted development. A well-crafted prompt is the difference between getting exactly what you need in seconds versus spending minutes iterating on vague responses.

**Time to Master:** 4-6 hours of practice  
**Outcome:** Write prompts that consistently produce high-quality, useful results

---

## 💡 What Makes a Good Prompt?

### The Four Pillars of Effective Prompting

**1. Clarity** - Be specific and unambiguous  
**2. Context** - Provide relevant background information  
**3. Constraints** - Define boundaries and requirements  
**4. Examples** - Show what good looks like (when needed)

###

 Poor vs. Good Prompts

**❌ Poor Prompt:**
```
"Fix this code"
```
Why it fails:
- No context about what's broken
- No specification of desired behavior
- No code provided
- Ambiguous about what "fix" means

**✅ Good Prompt:**
```
"This Python function is supposed to validate email addresses,
but it's rejecting valid emails with plus signs (user+tag@domain.com).
Fix the regex pattern to allow plus signs while still rejecting invalid emails.

[code here]
```
Why it works:
- Clear problem statement
- Specific issue identified
- Expected behavior defined
- Code context provided

---

## 📋 The Anatomy of a Great Prompt

### Basic Structure

```
[Role/Context] (optional)
[Task/Request] (required)
[Constraints/Requirements] (when applicable)
[Format/Output] (when applicable)
[Examples] (when helpful)
```

### Example Breakdown

```
You are an expert Python developer reviewing code for security issues.

Analyze the following authentication function for potential security
vulnerabilities, particularly around SQL injection, XSS, and authentication
bypass.

Requirements:
- Identify each vulnerability
- Explain the risk level (critical/high/medium/low)
- Provide specific fix recommendations
- Include code examples of fixes

Output format:
- List vulnerabilities in order of severity
- For each: description, risk level, fix

[code here]
```

**Components:**
1. **Role**: "Expert Python developer" - sets context
2. **Task**: "Analyze... for security vulnerabilities" - clear objective
3. **Constraints**: "particularly around..." - focus areas
4. **Requirements**: Bullet list - specific expectations
5. **Format**: How to structure output
6. **Input**: Code to analyze

---

## 🎨 Prompting Techniques

### 1. Be Specific and Detailed

**❌ Vague:**
```
"Write a function"
```

**✅ Specific:**
```
"Write a TypeScript function named `validatePassword` that:
- Takes a string parameter
- Returns a boolean
- Checks if password has:
  * At least 12 characters
  * One uppercase letter
  * One lowercase letter
  * One number
  * One special character
- Include JSDoc documentation
- Include error examples in comments"
```

### 2. Provide Context

**❌ No Context:**
```
"How do I handle errors here?"
[code snippet]
```

**✅ With Context:**
```
"I'm building a Node.js Express API that processes payments.
This error handling needs to:
- Log errors for debugging
- Return appropriate HTTP status codes
- Not expose sensitive payment details to clients
- Trigger alerts for payment failures

How should I handle errors in this payment processing function?
[code snippet]
```

### 3. Use Examples (When Helpful)

**❌ Abstract:**
```
"Format this data nicely"
```

**✅ With Example:**
```
"Format this user data for display. Example output:

Name: John Doe
Email: john@example.com
Member Since: January 15, 2024
Status: Active

Input data:
{user_data}
```

### 4. Break Down Complex Tasks

**❌ Everything at Once:**
```
"Build a complete user authentication system with
login, registration, password reset, email verification,
2FA, session management, and admin panel"
```

**✅ Step by Step:**
```
"Let's build user authentication step by step.

First step: Create a user registration function that:
- Accepts email and password
- Validates email format
- Checks password strength
- Hashes password with bcrypt
- Stores in database
- Returns success/error

We'll add login, password reset, etc. in subsequent steps."
```

### 5. Specify Output Format

**❌ No Format Specified:**
```
"Explain how React hooks work"
```

**✅ Format Specified:**
```
"Explain how React hooks work using this format:

1. What: Brief definition (2-3 sentences)
2. Why: Why they were introduced (2-3 sentences)
3. How: Basic example with useState
4. Common Pitfalls: 3 most common mistakes
5. Best Practices: 3 key recommendations

Keep the total response under 300 words."
```

### 6. Iterate and Refine

**First Prompt:**
```
"Create a sorting function"
```

**Refined After Response:**
```
"Good start! Please modify to:
- Use TypeScript with proper types
- Support ascending/descending order
- Handle null/undefined values
- Add unit tests
- Include performance notes for large arrays"
```

---

## 🔧 Practical Prompting Patterns

### Pattern 1: Code Generation

```
Create a {language} {type} that {purpose}.

Requirements:
- {requirement 1}
- {requirement 2}
- {requirement 3}

Include:
- Type annotations/hints
- Error handling
- Docstrings/comments
- Usage example
```

**Example:**
```
Create a Python class that manages a connection pool for PostgreSQL.

Requirements:
- Supports min/max connection limits
- Implements connection health checks
- Auto-reconnects on connection loss
- Thread-safe operations

Include:
- Type hints
- Error handling for connection failures
- Class docstring
- Usage example with context manager
```

### Pattern 2: Code Review

```
Review this {language} code for:
- {concern 1}
- {concern 2}
- {concern 3}

For each issue found:
1. Describe the problem
2. Explain the impact
3. Provide a fix

[code]
```

**Example:**
```
Review this JavaScript React component for:
- Performance issues
- Accessibility problems
- Best practice violations
- Potential bugs

For each issue:
1. Describe what's wrong
2. Explain why it matters
3. Show corrected code

[component code]
```

### Pattern 3: Debugging

```
This {language} code should {expected behavior},
but instead it {actual behavior}.

Error message (if any): {error}

Debug approach needed:
- Identify root cause
- Explain why it's happening
- Provide fix
- Suggest how to prevent similar issues

[code]
```

**Example:**
```
This Python function should return a sorted list of unique emails,
but instead it's returning duplicates and the order is wrong.

Error: No error, just incorrect output

Debug approach needed:
- Find the bug
- Explain the logic error
- Provide corrected code
- Suggest unit tests to catch this

[function code]
```

### Pattern 4: Explanation

```
Explain {topic} as if I'm a {experience level}.

Cover:
- {aspect 1}
- {aspect 2}
- {aspect 3}

Use {analogy type} analogies and include
a simple code example.
```

**Example:**
```
Explain Python decorators as if I'm a junior developer
who understands functions but not closures yet.

Cover:
- What decorators are
- Why they're useful
- How they work
- Common use cases

Use real-world analogies (not technical)
and include a simple, practical example.
```

### Pattern 5: Refactoring

```
Refactor this {language} code to improve:
- {aspect 1}
- {aspect 2}
- {aspect 3}

Requirements:
- Maintain exact same functionality
- {constraint 1}
- {constraint 2}

Show before/after comparison and explain
each significant change.

[code]
```

**Example:**
```
Refactor this JavaScript function to improve:
- Readability
- Maintainability
- Performance

Requirements:
- Keep the same API
- Use modern ES6+ features
- No external dependencies

Explain each refactoring step and why it's better.

[function code]
```

### Pattern 6: Test Generation

```
Generate {test framework} tests for this {language} code.

Test coverage needed:
- Happy path: {scenarios}
- Edge cases: {scenarios}
- Error cases: {scenarios}

Include:
- Test setup/teardown
- Mocks for {dependencies}
- Clear test descriptions

[code to test]
```

**Example:**
```
Generate Jest tests for this TypeScript user service.

Test coverage:
- Happy path: successful user creation, retrieval, update
- Edge cases: empty strings, very long inputs, special characters
- Error cases: duplicate emails, invalid data, database errors

Include:
- Mock database calls
- Mock email service
- Clear "should..." descriptions

[UserService code]
```

---

## 🎯 Common Prompting Mistakes

### Mistake 1: Being Too Vague

**Problem:**
```
"Make this better"
```

**Why it fails:**
- "Better" is subjective
- No direction on what to improve
- Claude must guess your priorities

**Solution:**
```
"Improve this function's:
1. Performance (currently O(n²), target O(n log n))
2. Readability (too nested, hard to follow)
3. Error handling (currently throws, should return errors)"
```

### Mistake 2: No Context

**Problem:**
```
"Is this secure?"
[code snippet]
```

**Why it fails:**
- Security depends on context
- Threat model unclear
- Usage pattern unknown

**Solution:**
```
"This code handles user passwords in a web application.
Users might try SQL injection or brute force attacks.
Review for security issues, particularly:
- Password storage
- SQL injection
- Timing attacks
[code]"
```

### Mistake 3: Assuming Knowledge

**Problem:**
```
"Use the pattern from before"
```

**Why it fails:**
- Claude doesn't remember previous conversations
- Each conversation is independent
- "Before" is ambiguous

**Solution:**
```
"Use the Repository pattern we discussed:
- Interface defining data operations
- Concrete implementation with database
- Dependency injection for testability

Apply this pattern to the User entity:
[requirements]"
```

### Mistake 4: Multiple Unrelated Requests

**Problem:**
```
"1. Explain closures
2. Fix this bug [code]
3. Write a sorting algorithm
4. Review my architecture [diagram]"
```

**Why it fails:**
- Attention diluted across topics
- Responses may be superficial
- Hard to follow up on any single item

**Solution:**
Separate conversations for separate topics, or:
```
"Let's work through these in order:

First: Explain JavaScript closures with an example
[wait for response, then continue]

Next: Fix this bug...
[and so on]"
```

### Mistake 5: Not Reviewing Output

**Problem:**
Copy-pasting AI output without understanding or testing

**Why it fails:**
- Code may have subtle bugs
- May not match your exact requirements
- Could have security issues
- Might not follow your conventions

**Solution:**
- Always read and understand the code
- Test thoroughly
- Adapt to your specific needs
- Validate assumptions

---

## ✨ Advanced Prompting Tips

### Tip 1: Use Role-Based Prompting

```
"As a senior security engineer reviewing this code,
identify potential vulnerabilities..."
```

Benefits:
- Sets expertise level
- Frames perspective
- Improves relevance

### Tip 2: Request Explanations

```
"Implement this feature AND explain your design decisions:
- Why you chose this approach
- What alternatives you considered
- Trade-offs involved"
```

Benefits:
- Learn while coding
- Understand reasoning
- Make informed modifications

### Tip 3: Ask for Comparisons

```
"Show me three ways to implement this,
with pros/cons of each approach"
```

Benefits:
- Understand options
- Make better decisions
- Learn different patterns

### Tip 4: Specify Programming Style

```
"Write this in functional programming style:
- Pure functions
- Immutable data
- No side effects
- Higher-order functions"
```

Benefits:
- Match your codebase
- Learn specific paradigms
- Maintain consistency

### Tip 5: Request Incremental Improvements

```
"First, write a basic working version.
Then, optimize for performance.
Finally, add error handling.

Show each iteration with explanation."
```

Benefits:
- Understand evolution
- See trade-offs
- Learn incrementally

---

## 📊 Prompt Templates Library

### Template 1: Feature Implementation

```
Implement a {feature name} in {language/framework}.

Functional Requirements:
- {requirement 1}
- {requirement 2}
- {requirement 3}

Technical Requirements:
- {tech requirement 1}
- {tech requirement 2}

Constraints:
- {constraint 1}
- {constraint 2}

Deliverables:
- Fully commented code
- Unit tests
- Usage example
- Brief documentation
```

### Template 2: Code Review

```
Code Review Request for {module/component name}

Focus Areas:
1. {focus 1}
2. {focus 2}
3. {focus 3}

Standards to Check:
- {standard 1}
- {standard 2}

Output Format:
For each issue:
- Location (file:line)
- Severity (critical/high/medium/low)
- Description
- Recommended fix

[code]
```

### Template 3: Bug Fix

```
Bug Report

Expected Behavior:
{what should happen}

Actual Behavior:
{what's happening}

Steps to Reproduce:
1. {step 1}
2. {step 2}
3. {step 3}

Error Messages:
{errors if any}

Environment:
- {language/framework} version
- {other relevant info}

Code:
[relevant code]

Requested:
- Root cause analysis
- Fix with explanation
- Prevention strategy
```

### Template 4: Learning/Explanation

```
Teach me {concept/technology}

My Background:
- I understand: {what you know}
- I'm unclear on: {what confuses you}

Please explain:
1. {specific question 1}
2. {specific question 2}
3. {specific question 3}

Teaching Approach:
- Use analogies
- Provide code examples
- Start simple, build complexity
- Highlight common pitfalls
```

---

## 🎓 Practice Exercises

### Exercise 1: Improve These Prompts

Rewrite these poor prompts to be more effective:

**Poor Prompt A:**
```
"Help with Python"
```

**Your Improved Version:**
```
[Your answer here]
```

**Poor Prompt B:**
```
"Code not working"
[100 lines of code]
```

**Your Improved Version:**
```
[Your answer here]
```

**Poor Prompt C:**
```
"Best way to do authentication?"
```

**Your Improved Version:**
```
[Your answer here]
```

### Exercise 2: Write Prompts for These Scenarios

**Scenario A:** You need to implement user authentication for a Node.js Express app

**Your Prompt:**
```
[Your answer here]
```

**Scenario B:** You have a slow database query that needs optimization

**Your Prompt:**
```
[Your answer here]
```

**Scenario C:** You want to learn about React hooks

**Your Prompt:**
```
[Your answer here]
```

### Exercise 3: Chain of Prompts

For building a REST API endpoint, write a sequence of 3-4 prompts that build on each other:

**Prompt 1:**
```
[Your answer here]
```

**Prompt 2:**
```
[Your answer here]
```

**Prompt 3:**
```
[Your answer here]
```

**Prompt 4 (optional):**
```
[Your answer here]
```

---

## ✅ Prompting Checklist

Before sending a prompt, check:

**Clarity:**
- [ ] Request is specific and unambiguous
- [ ] No vague terms like "better," "good," "nice"
- [ ] Clear success criteria

**Context:**
- [ ] Provided relevant background
- [ ] Included necessary code/data
- [ ] Specified language/framework/version
- [ ] Explained the broader goal

**Constraints:**
- [ ] Listed requirements
- [ ] Specified limitations
- [ ] Defined what to avoid
- [ ] Set quality expectations

**Format:**
- [ ] Specified desired output format
- [ ] Indicated structure preferences
- [ ] Requested examples if needed
- [ ] Set length expectations

**Quality:**
- [ ] Prompt is well-organized
- [ ] Easy to understand
- [ ] Focused on one main task
- [ ] Ready for iteration if needed

---

## 🚀 Next Steps

### Immediate Actions

1. **Practice with Real Tasks**
   - Take a coding task you're working on
   - Write 3 different prompts for it
   - Compare results
   - Identify what works best

2. **Build Your Prompt Library**
   - Save effective prompts
   - Create templates for common tasks
   - Organize by category
   - Share with team

3. **Experiment with Variations**
   - Try different structures
   - Test various levels of detail
   - Compare role-based vs. direct prompts
   - Find your personal style

### Continuing Your Journey

Now that you understand effective prompting, let's learn about managing context for even better results.

**Next:** [Context Management Fundamentals →](./05-context-management-fundamentals.md)

---

## 📚 Additional Resources

**Anthropic's Prompt Engineering Guide:**
- https://docs.anthropic.com/prompting

**Community Prompt Libraries:**
- GitHub: awesome-claude-prompts
- Reddit: r/ClaudeAI prompt sharing

**Practice Platforms:**
- Claude Playground (claude.ai)
- Prompt engineering challenges

---

*"The quality of the output is determined by the quality of the input."*

*Master prompting, and you master AI-assisted development.*
