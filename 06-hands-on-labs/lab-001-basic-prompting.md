# Lab 001: Basic Prompting Techniques

## Learning Objectives

By the end of this lab, you will be able to:
- Craft clear and specific prompts that yield precise results
- Apply the CRISP framework for structured prompting
- Use context effectively to improve Claude's responses
- Implement iterative refinement techniques
- Recognize and avoid common prompting pitfalls

## Prerequisites

- Access to Claude (Web, Desktop, or API)
- Basic understanding of software development concepts
- A code editor for testing generated code
- 30-45 minutes to complete the lab

## Setup

1. Open Claude in your preferred interface
2. Create a new conversation for this lab
3. Have a text editor ready to save your best prompts
4. Optional: Set up a small test project to validate code generation

## Exercise 1: Clarity and Specificity (10 minutes)

### Objective
Learn how vague vs. specific prompts impact output quality.

### Instructions

**Step 1: Vague Prompt**

Try this prompt:
```
Write a function to process data.
```

**Observation**: Note the assumptions Claude makes and the generic nature of the response.

**Step 2: Specific Prompt**

Now try:
```
Write a Python function that takes a list of dictionaries containing user data 
(name, email, age) and returns only users over 18 years old, sorted by name 
alphabetically. Include error handling for missing fields.
```

**Validation Checkpoint**: 
- Does the specific version include all requested features?
- Is the code immediately usable?
- Are edge cases handled?

**Step 3: Add Context**

Enhance with context:
```
I'm building a user registration system for a social media platform. Write a 
Python function that filters and processes user data with these requirements:

Context:
- Input: List of dictionaries with keys: name, email, age, country
- Business rule: Only users 18+ can register
- Output should be sorted alphabetically by name
- Must handle missing/invalid data gracefully
- Should log filtering actions for audit purposes

Include unit tests and docstrings.
```

**Expected Outcome**: A production-ready function with comprehensive error handling, logging, tests, and documentation.

### Solution

The progression shows how specificity improves output quality:
1. Vague prompt → Generic, minimal code
2. Specific prompt → Functional code with requirements met
3. Context-rich prompt → Production-ready code with tests and documentation

### Key Takeaways
- Always specify input/output formats
- Include edge cases and error handling requirements
- Provide business context when relevant
- Request additional artifacts (tests, docs) explicitly

## Exercise 2: CRISP Framework Application (15 minutes)

### Objective
Practice using the CRISP framework for structured prompting.

### CRISP Components
- **C**ontext: Background information
- **R**ole: Who Claude should act as
- **I**nstructions: Clear, numbered steps
- **S**pecifics: Format, constraints, requirements
- **P**urpose: Why this task matters

### Instructions

**Step 1: Identify a Task**

Choose a real task from your work. Example: Creating a database migration script.

**Step 2: Build CRISP Prompt**

```
Context: 
We're migrating our user authentication system from MongoDB to PostgreSQL. 
The current schema stores users with embedded roles. We need to normalize 
this to a many-to-many relationship.

Role: 
You are a senior database architect with expertise in PostgreSQL and data 
migration strategies.

Instructions:
1. Analyze the current MongoDB schema structure
2. Design a normalized PostgreSQL schema with proper foreign keys
3. Create a migration script that preserves all data integrity
4. Generate rollback procedures
5. Include validation queries to verify migration success

Specifics:
- Use PostgreSQL 14+ features
- Follow naming convention: snake_case for tables/columns
- Include indexes for performance
- Transaction handling for data safety
- Output as SQL with inline comments

Purpose:
This migration script will run on our production database with 2M+ users. 
Data integrity and rollback capability are critical for business continuity.
```

**Step 3: Execute and Evaluate**

Run your CRISP prompt and evaluate the response against each component.

**Validation Checkpoint**:
- [ ] Does the response acknowledge the context?
- [ ] Does the output match the specified role's expertise level?
- [ ] Are all instructions addressed in order?
- [ ] Do specifics (format, constraints) match your needs?
- [ ] Does the solution address the stated purpose?

**Step 4: Practice Variations**

Create CRISP prompts for these scenarios:

1. **API Integration**
   - Context: Third-party payment gateway integration
   - Role: Full-stack developer
   - Purpose: Process customer payments securely

2. **Code Review**
   - Context: Pull request with authentication changes
   - Role: Security-focused senior developer
   - Purpose: Identify security vulnerabilities

3. **Documentation**
   - Context: Internal REST API used by mobile apps
   - Role: Technical writer
   - Purpose: Onboard new mobile developers

### Solution Template

```
Context: [What's the background? What exists already?]

Role: [What expertise should Claude bring?]

Instructions:
1. [First step]
2. [Second step]
3. [Third step]

Specifics:
- Format: [How should output be structured?]
- Constraints: [What limitations apply?]
- Requirements: [What must be included?]

Purpose: [Why does this matter? What's the impact?]
```

### Key Takeaways
- CRISP provides a consistent framework for complex tasks
- Each component serves a specific purpose
- Complete prompts reduce back-and-forth iterations
- The framework scales from simple to complex requests

## Exercise 3: Iterative Refinement (10 minutes)

### Objective
Master the art of refining prompts through iteration.

### Instructions

**Step 1: Initial Prompt**

Start with a basic prompt:
```
Create a REST API endpoint for user login.
```

**Step 2: First Refinement - Add Technical Details**

```
Create a REST API endpoint for user login using Node.js and Express. 
Include JWT token generation.
```

**Step 3: Second Refinement - Add Security**

```
Create a REST API endpoint for user login using Node.js and Express. 
Include JWT token generation, password hashing with bcrypt, rate limiting, 
and input validation.
```

**Step 4: Third Refinement - Production Ready**

```
Create a production-ready REST API endpoint for user login with these specs:

Technical Stack:
- Node.js 18+, Express 4.x
- JWT for authentication (RS256 algorithm)
- bcrypt for password hashing (cost factor 12)

Security Requirements:
- Rate limiting: 5 attempts per 15 minutes per IP
- Input validation using Joi
- SQL injection prevention
- CORS configuration
- Secure HTTP headers (helmet.js)

Features:
- Return JWT access token (15min) and refresh token (7 days)
- Log authentication attempts
- Return appropriate HTTP status codes
- Include error handling middleware

Output:
- Complete endpoint code
- Middleware functions
- Configuration file structure
- Unit tests using Jest
```

**Validation Checkpoint**:
Compare all four versions. Each iteration should add:
- More specific technical requirements
- Security considerations
- Production concerns
- Testing and validation

**Step 5: Practice Iteration**

Take this starting prompt and refine it three times:
```
Write a function to send emails.
```

Your iterations should add:
1. Technical implementation details
2. Error handling and validation
3. Production features (templates, logging, retry logic)

### Solution Pattern

**Iteration 1**: Basic functionality
**Iteration 2**: Add technology stack and core features
**Iteration 3**: Add error handling and edge cases
**Iteration 4**: Production-ready with tests, docs, security

### Key Takeaways
- Start simple, then layer complexity
- Each iteration should add value
- Know when to stop (diminishing returns)
- Save successful prompts for reuse

## Exercise 4: Context Management (10 minutes)

### Objective
Learn to provide relevant context without overwhelming the prompt.

### Instructions

**Step 1: Context Overload (What NOT to Do)**

```
I'm working on a project that uses React, TypeScript, Node.js, Express, 
PostgreSQL, Redis, Docker, Kubernetes, AWS, Terraform, GitHub Actions, 
Jest, Cypress, ESLint, Prettier, Webpack, and about 50 other dependencies. 
Our team has 12 developers across 3 time zones. We follow agile methodology 
with 2-week sprints. Our tech lead prefers functional programming. We have 
microservices architecture with 23 services. The database has 147 tables.

Write a function to validate email addresses.
```

**Problem**: Too much irrelevant context buries the actual task.

**Step 2: Essential Context Only**

```
I need an email validation function for our user registration form.

Relevant Context:
- Technology: TypeScript
- Requirements: RFC 5322 compliant validation
- Must check for common typos (e.g., gmail.con → gmail.com)
- Should allow internationalized email addresses

Write the validation function with these specifications.
```

**Validation Checkpoint**: Does the context directly relate to the task?

**Step 3: Layered Context Technique**

For complex tasks, provide context in layers:

```
Task: Create a user authentication service

Layer 1 - Immediate Context:
- Language: Node.js with TypeScript
- Framework: Express
- Auth method: JWT tokens

Layer 2 - Integration Context (if needed):
- Integrates with existing PostgreSQL user database
- Must work with current Redis session store
- API versioning: /api/v1/auth

Layer 3 - Constraints (if asked):
- Token expiry: 15 minutes (access), 7 days (refresh)
- Password requirements: 12+ chars, mixed case, numbers, symbols
- Rate limiting: 5 failed attempts = 15 minute lockout
```

Provide Layer 1 first. Add Layer 2 if Claude asks for integration details. Add Layer 3 if specifics are needed.

**Step 4: Practice Context Filtering**

For each scenario, identify what context is essential:

**Scenario A**: Creating a date formatting utility
- Project uses React (relevant? no)
- Need MM/DD/YYYY format (relevant? yes)
- Database is PostgreSQL (relevant? no)
- Must handle timezones (relevant? yes)

**Scenario B**: Writing database migration script
- Using Sequelize ORM (relevant? yes)
- Team uses Slack for communication (relevant? no)
- PostgreSQL version 14 (relevant? yes)
- Need to add 'verified_at' column (relevant? yes)

### Solution Checklist

Before adding context, ask:
- [ ] Does this directly affect the implementation?
- [ ] Would the output differ without this information?
- [ ] Is this a constraint or requirement?
- [ ] Could this be provided later if needed?

Only include context that passes 2+ of these checks.

### Key Takeaways
- More context isn't always better
- Provide context in layers for complex tasks
- Remove project metadata unless it affects implementation
- Focus on technical requirements and constraints

## Exercise 5: Common Pitfalls and Fixes (10 minutes)

### Objective
Recognize and avoid common prompting mistakes.

### Instructions

**Pitfall 1: Ambiguous Pronouns**

Bad:
```
I have a user service and payment service. It needs to call it when transactions 
complete.
```

Good:
```
The payment service needs to call the user service's /update-balance endpoint 
when transactions complete.
```

**Pitfall 2: Assuming Claude Knows Your Codebase**

Bad:
```
Update the authenticateUser function to use the new token system.
```

Good:
```
Here's my current authentication function:
[paste code]

Update it to use JWT tokens instead of session cookies. Requirements:
- Generate RS256 signed tokens
- Include user_id and role in payload
- Set 15-minute expiration
```

**Pitfall 3: Multiple Unrelated Tasks**

Bad:
```
Create a login form, set up the database, write API documentation, configure 
CI/CD, and deploy to AWS.
```

Good:
```
Task 1: Create a login form component
[complete this first]

Then separately:
Task 2: Create database schema for users
Task 3: Write API documentation for auth endpoints
[etc.]
```

**Pitfall 4: Vague Quality Requirements**

Bad:
```
Make it better and more efficient.
```

Good:
```
Optimize this function for performance:
- Reduce time complexity from O(n²) to O(n log n) or better
- Minimize memory allocations
- Add memoization for repeated calls with same inputs
- Benchmark before and after
```

**Pitfall 5: No Success Criteria**

Bad:
```
Create tests for the user service.
```

Good:
```
Create comprehensive tests for the user service:

Coverage Requirements:
- Minimum 80% code coverage
- All public methods tested
- Edge cases: null inputs, duplicate emails, invalid data
- Integration tests for database operations
- Mock external API calls

Use Jest testing framework.
```

**Step: Identify and Fix**

Review these prompts and rewrite them to fix the issues:

1. "Make the code faster and add some validation."

2. "The API isn't working. Fix it."

3. "I need that feature we discussed implemented in the component."

### Solutions

1. Fixed:
```
Optimize the data processing function for performance:
- Current: Processes 1000 records in 5 seconds
- Target: Process 1000 records in under 1 second
- Add input validation for: email format, required fields, data types
- Use schema validation library (Joi or Zod)
```

2. Fixed:
```
The /api/users/create endpoint returns 500 errors. Here's the code:
[paste code]

Error message: "Cannot read property 'email' of undefined"

Expected behavior: Should create user and return 201 status
Actual behavior: Returns 500 error

Debug and fix the issue.
```

3. Fixed:
```
Implement the user profile editing feature in the UserProfile component.

Requirements:
- Allow editing: name, email, bio, avatar
- Real-time validation with error messages
- Save button (disabled until valid changes)
- Cancel button (revert unsaved changes)
- Success/error notifications

Current component code:
[paste code]
```

### Key Takeaways
- Be specific about what "better" means
- Provide actual code when referencing existing work
- Break complex requests into focused tasks
- Define clear success criteria
- Avoid pronouns; use explicit names

## Validation and Testing

### Self-Assessment Checklist

For each prompt you create, verify:

- [ ] Is the desired output clearly specified?
- [ ] Have I included relevant context?
- [ ] Are technical requirements explicit?
- [ ] Have I specified the format/structure?
- [ ] Are success criteria defined?
- [ ] Did I avoid ambiguous language?
- [ ] Is the scope focused and manageable?

### Practical Test

Create a prompt for this scenario and evaluate it:

**Scenario**: You need a function to calculate shipping costs based on package weight, destination, and shipping speed.

**Your Prompt**:
[Write your prompt here]

**Evaluation**:
- Does it specify input parameters and types?
- Does it define the pricing logic?
- Does it request error handling?
- Does it specify the return format?
- Does it include test cases?

## Common Issues and Troubleshooting

### Issue 1: Responses Too Generic

**Symptom**: Claude provides basic, textbook-style answers.

**Solution**: Add specificity and context. Instead of "create a sorting function," say "create a sorting function for product catalog items (name, price, rating) with toggleable sort direction and case-insensitive string comparison."

### Issue 2: Missing Error Handling

**Symptom**: Generated code lacks validation or error handling.

**Solution**: Explicitly request it: "Include input validation, error handling for network failures, and appropriate error messages for users."

### Issue 3: Wrong Technology Stack

**Symptom**: Claude uses a different framework or language than needed.

**Solution**: Specify exact versions and technologies upfront: "Using Python 3.11 with FastAPI 0.104.x" instead of just "Python."

### Issue 4: Inconsistent Style

**Symptom**: Code doesn't match your project's conventions.

**Solution**: Provide style guidelines: "Follow PEP 8, use type hints, prefer list comprehensions over loops, use descriptive variable names (no single letters)."

## Extensions for Advanced Learners

### Extension 1: Prompt Templates

Create reusable prompt templates for common tasks:

**Template: Feature Implementation**
```
Feature: [Feature name]

Context:
- Current state: [What exists now]
- Technology stack: [Languages, frameworks]
- Integration points: [What this connects to]

Requirements:
- Functional: [What it should do]
- Non-functional: [Performance, security, etc.]
- Constraints: [Limitations, rules]

Deliverables:
- [ ] Implementation code
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests
- [ ] Documentation
- [ ] Migration script (if database changes)

Success Criteria:
- [How to verify it works]
```

### Extension 2: Multi-Turn Conversation Strategy

Practice building solutions through conversation:

1. **Turn 1**: High-level design
2. **Turn 2**: Detailed implementation of component A
3. **Turn 3**: Integration with component B
4. **Turn 4**: Testing strategy
5. **Turn 5**: Refinement and optimization

### Extension 3: Comparative Prompting

Request multiple approaches:

```
Provide three different implementations for calculating user engagement scores:

Approach 1: Simple weighted average (fast, easy to maintain)
Approach 2: Machine learning-based scoring (accurate, requires training data)
Approach 3: Rule-based expert system (explainable, requires domain expertise)

For each approach, provide:
- Implementation code
- Pros and cons
- Performance characteristics
- Maintenance considerations

Recommend the best approach for a startup with 10K users.
```

### Extension 4: Domain-Specific Prompting

Develop expertise in prompting for your domain:

- **DevOps**: Infrastructure as code, CI/CD pipelines
- **Frontend**: Component design, state management
- **Backend**: API design, database optimization
- **Data Science**: Algorithm selection, data preprocessing
- **Security**: Threat modeling, vulnerability assessment

## Summary

You've learned to:
- Craft specific, actionable prompts
- Apply the CRISP framework systematically
- Refine prompts iteratively for better results
- Manage context effectively
- Avoid common prompting pitfalls

## Next Steps

1. Apply these techniques to real work tasks
2. Build a personal library of effective prompts
3. Experiment with advanced techniques in Extension exercises
4. Proceed to Lab 002: Code Refactoring

## Additional Resources

- CRISP framework detailed guide (see main documentation)
- Prompt engineering best practices
- Claude API documentation for programmatic prompting
- Community prompt library examples

## Time Investment

- Core exercises: 45 minutes
- Extensions: 30-60 minutes
- Real-world practice: Ongoing

---

**Lab Completion**: You've completed Lab 001. Save your best prompts and templates for future reference. The techniques learned here will be foundational for all subsequent labs.
