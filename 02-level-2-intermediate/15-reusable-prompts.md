# Reusable Prompts

## Building a Personal Prompt Library for Efficiency

---

## 🎯 Overview

Reusable prompts are templates for common development tasks that you can invoke repeatedly with minimal customization. Build a prompt library to standardize workflows, save time, ensure consistency, and capture best practices across your team.

**Time to Master:** 2-3 hours  
**Outcome:** Create and maintain a personal library of production-ready prompts

---

## 💡 Why Reusable Prompts

### Benefits

**Efficiency:**
```
Ad-hoc prompt: 5-10 minutes crafting
Reusable prompt: 30 seconds customizing
Savings: 90% time reduction
```

**Consistency:**
```
Every developer uses the same prompt structure
→ Consistent code quality
→ Predictable outputs
→ Easier code reviews
```

**Knowledge Capture:**
```
Best practices embedded in prompts
→ Institutional knowledge preserved
→ Onboarding accelerated
→ Quality maintained
```

---

## 🔧 Prompt Template Structure

### Basic Template Format

```markdown
# {Prompt Name}

## Purpose
{One-line description of what this prompt does}

## When to Use
- {Scenario 1}
- {Scenario 2}

## Template

```
{Prompt text with placeholders in {curly braces}}
```

## Placeholders
- `{placeholder1}`: {Description}
- `{placeholder2}`: {Description}

## Example

```
{Example with placeholders filled in}
```

## Expected Output
{Description of what Claude will produce}

## Tips
- {Tip 1}
- {Tip 2}
```

---

## 📚 Essential Prompt Library

### Category: Code Refactoring

**refactor-extract-method.md:**
```markdown
# Extract Method Refactoring

## Purpose
Extract complex logic into well-named methods

## Template

Refactor this code by extracting {description} into a separate method.

Current code:
```{language}
{paste code here}
```

Requirements:
- Method name: {suggestedName} (or suggest better)
- Keep original behavior identical
- Add JSDoc/docstring
- Update tests if needed

Constraints:
- Maintain same public API
- No external dependencies added
- {additional constraints}

## Placeholders
- `{description}`: What logic to extract (e.g., "validation logic")
- `{language}`: Programming language
- `{suggestedName}`: Proposed method name or leave blank
- `{additional constraints}`: Any specific constraints

## Example

Refactor this code by extracting email validation into a separate method.

Current code:
```typescript
function createUser(email: string, name: string) {
  // Validation logic - extract this
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  return db.users.create({ email, name });
}
```

Requirements:
- Method name: validateEmail (or suggest better)
- Keep original behavior identical
- Add JSDoc
- Update tests if needed

Constraints:
- Maintain same public API
- No external dependencies added
- Throw same error types

## Expected Output
- Extracted validation method
- Updated original method using extracted method
- JSDoc comments
- Suggestions for test updates

## Tips
- Be specific about what to extract
- Mention if the extracted method should be private/public
- Specify if it should be pure function or can have side effects
```

**refactor-reduce-complexity.md:**
```markdown
# Reduce Cyclomatic Complexity

## Template

Reduce the complexity of this code:

```{language}
{paste code}
```

Current complexity: {number} (measured by {tool})
Target complexity: <{target}

Techniques to use:
- Early returns
- Extract conditional logic
- Replace nested ifs with guard clauses
- Simplify boolean expressions
- {other techniques}

Constraints:
- Preserve exact behavior
- Keep same function signature
- {other constraints}

## Placeholders
- `{language}`: Programming language
- `{number}`: Current complexity score
- `{tool}`: Tool used to measure (e.g., ESLint, SonarQube)
- `{target}`: Target complexity score
- `{other techniques}`: Additional refactoring techniques
- `{other constraints}`: Additional constraints

## Example

Reduce the complexity of this code:

```typescript
function calculatePrice(item: Item, user: User, discount?: Discount) {
  if (item.price > 0) {
    if (user.isPremium) {
      if (discount && discount.isValid) {
        if (discount.type === 'percentage') {
          return item.price * (1 - discount.value / 100);
        } else {
          return item.price - discount.value;
        }
      } else {
        return item.price * 0.9; // 10% premium discount
      }
    } else {
      if (discount && discount.isValid) {
        if (discount.type === 'percentage') {
          return item.price * (1 - discount.value / 100);
        } else {
          return item.price - discount.value;
        }
      } else {
        return item.price;
      }
    }
  }
  return 0;
}
```

Current complexity: 11
Target complexity: <5

Techniques to use:
- Early returns
- Extract discount calculation
- Remove duplicate logic
- Guard clauses for invalid states

Constraints:
- Preserve exact behavior
- Keep same function signature
- Maintain type safety
```

### Category: Testing

**generate-unit-tests.md:**
```markdown
# Generate Unit Tests

## Template

Generate unit tests for:

File: {filePath}
Function/Class: {name}

Test cases to cover:
- Happy path: {scenarios}
- Edge cases: {scenarios}
- Error cases: {scenarios}

Test framework: {framework}
Mocking: {strategy}

Requirements:
- {coverage target}% code coverage
- Descriptive test names
- AAA pattern (Arrange, Act, Assert)
- {other requirements}

## Placeholders
- `{filePath}`: Path to file being tested
- `{name}`: Function or class name
- `{scenarios}`: List of scenarios to test
- `{framework}`: Testing framework (Jest, Mocha, pytest, etc.)
- `{strategy}`: Mocking strategy (mock dependencies, use test doubles, etc.)
- `{coverage target}`: Target percentage
- `{other requirements}`: Additional requirements

## Example

Generate unit tests for:

File: src/services/PaymentService.ts
Function/Class: PaymentService

Test cases to cover:
- Happy path: Successful payment, successful refund
- Edge cases: Zero amount, maximum amount, duplicate transaction
- Error cases: Invalid card, network timeout, insufficient funds

Test framework: Jest with TypeScript
Mocking: Mock Stripe SDK, mock database

Requirements:
- 90% code coverage
- Descriptive test names
- AAA pattern
- Each test should be independent
- Use beforeEach for setup
```

**generate-integration-tests.md:**
```markdown
# Generate Integration Tests

## Template

Generate integration tests for:

Feature: {featureName}
Endpoints: {endpoints}

Test scenarios:
1. {scenario1}
2. {scenario2}

Setup requirements:
- {database state}
- {external services}
- {authentication}

Assertions:
- {what to verify}

Framework: {framework}

## Example

Generate integration tests for:

Feature: User registration
Endpoints: POST /api/auth/register

Test scenarios:
1. Register new user successfully
2. Reject duplicate email
3. Validate input format
4. Send welcome email

Setup requirements:
- Clean database before each test
- Mock email service
- No authentication required

Assertions:
- User created in database
- Password is hashed
- Welcome email sent
- JWT token returned
- Proper error codes for invalid inputs

Framework: Supertest with Jest
```

### Category: Feature Development

**create-api-endpoint.md:**
```markdown
# Create API Endpoint

## Template

Create a {method} {path} endpoint for {purpose}.

Request:
- Method: {method}
- Path: {path}
- Body/Params: {schema}
- Headers: {headers}

Processing:
1. {step1}
2. {step2}
3. {step3}

Response:
- Success ({statusCode}): {successSchema}
- Errors:
  - {errorCode1}: {errorCondition1}
  - {errorCode2}: {errorCondition2}

Requirements:
- Validation: {validation}
- Authentication: {authRequired}
- Rate limiting: {rateLimits}
- {other requirements}

Include:
- TypeScript types
- Input validation
- Error handling
- JSDoc comments
- Example request/response

## Example

Create a POST /api/products endpoint for creating new products.

Request:
- Method: POST
- Path: /api/products
- Body: { name: string, price: number, category: string }
- Headers: Authorization: Bearer {token}

Processing:
1. Validate JWT token
2. Validate product data (Zod schema)
3. Check for duplicate product name
4. Save to database
5. Return created product

Response:
- Success (201): { id, name, price, category, createdAt }
- Errors:
  - 400: Invalid input data
  - 401: Unauthorized
  - 409: Product name already exists
  - 500: Server error

Requirements:
- Validation: Use Zod schema
- Authentication: Required (JWT)
- Rate limiting: 100 requests per minute
- Audit log all product creations

Include:
- TypeScript types
- Zod validation schema
- Error handling
- JSDoc comments
- Example curl request
```

**create-react-component.md:**
```markdown
# Create React Component

## Template

Create a {componentName} component for {purpose}.

Props:
```typescript
{propTypes}
```

Behavior:
- {behavior1}
- {behavior2}

Styling:
- {stylingApproach}
- {styleDetails}

State management:
- {stateApproach}

Requirements:
- TypeScript
- {additional requirements}

Include:
- Component file
- Types file
- Test file
- Storybook story (if applicable)

## Example

Create a ProductCard component for displaying product information.

Props:
```typescript
{
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  onAddToCart: (productId: string) => void;
  isLoading?: boolean;
}
```

Behavior:
- Display product image, name, and price
- Show "Add to Cart" button
- Disable button when loading
- Call onAddToCart when button clicked
- Show loading spinner on button when isLoading=true

Styling:
- Tailwind CSS
- Card with shadow and hover effect
- Responsive (mobile-first)

State management:
- No internal state (controlled component)

Requirements:
- TypeScript
- Accessible (ARIA labels)
- Mobile-responsive
- Loading state visual feedback

Include:
- ProductCard.tsx
- ProductCard.types.ts
- ProductCard.test.tsx
- ProductCard.stories.tsx
```

### Category: Code Review

**security-review.md:**
```markdown
# Security Review

## Template

Review this code for security vulnerabilities:

```{language}
{paste code}
```

Check for:
- SQL injection
- XSS vulnerabilities
- CSRF protection
- Authentication/authorization issues
- Sensitive data exposure
- Insecure dependencies
- {other security concerns}

For each issue found, provide:
- Severity (Critical/High/Medium/Low)
- Location (file:line)
- Description
- Recommended fix
- Example secure code

## Example

Review this code for security vulnerabilities:

```typescript
app.post('/api/search', (req, res) => {
  const query = req.body.query;
  const sql = `SELECT * FROM products WHERE name LIKE '%${query}%'`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err.message);
    res.send(results);
  });
});
```

Check for:
- SQL injection
- XSS vulnerabilities
- Input validation
- Error message exposure
- Authentication/authorization
- Rate limiting

For each issue found, provide:
- Severity
- Location
- Description
- Recommended fix
- Example secure code
```

---

## 🎯 Organizing Your Prompt Library

### Directory Structure

```
prompts/
├── README.md (index of all prompts)
├── refactoring/
│   ├── extract-method.md
│   ├── reduce-complexity.md
│   ├── improve-naming.md
│   └── remove-duplication.md
├── testing/
│   ├── generate-unit-tests.md
│   ├── generate-integration-tests.md
│   ├── generate-e2e-tests.md
│   └── test-edge-cases.md
├── features/
│   ├── create-api-endpoint.md
│   ├── create-react-component.md
│   ├── create-database-migration.md
│   └── create-service-layer.md
├── review/
│   ├── security-review.md
│   ├── performance-review.md
│   ├── code-quality-review.md
│   └── accessibility-review.md
├── debugging/
│   ├── diagnose-error.md
│   ├── performance-profiling.md
│   └── memory-leak-investigation.md
└── documentation/
    ├── generate-api-docs.md
    ├── generate-readme.md
    └── generate-inline-comments.md
```

### README.md Index

```markdown
# Prompt Library

## Quick Access

### Refactoring
- [Extract Method](refactoring/extract-method.md) - Extract logic into separate methods
- [Reduce Complexity](refactoring/reduce-complexity.md) - Simplify complex code
- [Improve Naming](refactoring/improve-naming.md) - Better variable/function names
- [Remove Duplication](refactoring/remove-duplication.md) - DRY principle

### Testing
- [Unit Tests](testing/generate-unit-tests.md) - Generate comprehensive unit tests
- [Integration Tests](testing/generate-integration-tests.md) - API integration tests
- [E2E Tests](testing/generate-e2e-tests.md) - End-to-end test scenarios

### Features
- [API Endpoint](features/create-api-endpoint.md) - REST API endpoints
- [React Component](features/create-react-component.md) - React components
- [Database Migration](features/create-database-migration.md) - DB schema changes

### Review
- [Security Review](review/security-review.md) - Security vulnerability check
- [Performance Review](review/performance-review.md) - Performance analysis
- [Code Quality](review/code-quality-review.md) - Quality assessment

## Usage

1. Find the prompt template for your task
2. Copy the template
3. Fill in placeholders with your specific details
4. Run with Claude
5. Review and refine output

## Contributing

When adding new prompts:
- Use the template structure
- Include examples
- Document placeholders
- Test with real code
```

---

## 🚀 Advanced Prompt Patterns

### Chained Prompts

**Workflow: Feature Development**

```
Prompt 1: Design
→ Output: API design, database schema

Prompt 2: Implementation  
→ Input: Prompt 1 output
→ Output: Code implementation

Prompt 3: Tests
→ Input: Prompt 2 output
→ Output: Test suite

Prompt 4: Documentation
→ Input: Prompts 1-3 outputs
→ Output: API docs, README updates
```

### Conditional Prompts

**Example: Language-Specific Testing**

```markdown
# Generate Tests (Language-Aware)

{if language === "TypeScript"}
  Use Jest with TypeScript
  Include type assertions
  Use ts-jest transformer
{endif}

{if language === "Python"}
  Use pytest
  Include type hints
  Use fixtures for setup
{endif}

{if language === "Go"}
  Use testing package
  Include table-driven tests
  Use t.Run for subtests
{endif}
```

---

## ✅ Best Practices

### Creating Prompts

**DO:**
✅ Start with common tasks  
✅ Include examples  
✅ Document placeholders clearly  
✅ Version your prompts  
✅ Test with real code  
✅ Gather team feedback  
✅ Keep prompts focused (single responsibility)  

**DON'T:**
❌ Make prompts too generic  
❌ Skip examples  
❌ Use unclear placeholders  
❌ Create prompts for rare tasks  
❌ Forget to update when patterns change  

### Using Prompts

**DO:**
✅ Customize for your specific case  
✅ Review AI output  
✅ Iterate if needed  
✅ Update prompt if output is consistently off  
✅ Share successful prompts with team  

**DON'T:**
❌ Use prompts blindly  
❌ Skip reviewing output  
❌ Expect perfect results every time  
❌ Forget to adapt to context  

---

## 🎓 Practice Exercise

**Build your first prompt library:**

1. Create directory structure
2. Write 3 prompts for your most common tasks:
   - One refactoring prompt
   - One testing prompt
   - One feature creation prompt
3. Test each prompt on real code
4. Refine based on results
5. Document in README

**Bonus:** Share with your team and collect their feedback.

---

**Next:** [AI Pair Programming →](./16-ai-pair-programming.md)
