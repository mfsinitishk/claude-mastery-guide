# Code Quality Best Practices

## Overview

Maintaining high code quality is essential when working with AI-generated code. This guide provides comprehensive strategies for ensuring that Claude produces maintainable, readable, and robust code that meets professional standards.

## Core Principles

### 1. Readability First

Code is read far more often than it's written. Optimize for human comprehension.

**Key Guidelines:**
- Clear naming conventions
- Consistent formatting
- Appropriate comments
- Logical organization
- Self-documenting code

### 2. Maintainability Over Cleverness

Simple, straightforward code is better than clever, complex code.

**Philosophy:**
- Prefer explicit over implicit
- Choose clarity over brevity
- Avoid premature optimization
- Design for change
- Follow established patterns

### 3. Consistency is King

Consistent code is predictable and easier to maintain.

**Standards:**
- Follow team conventions
- Use linters and formatters
- Maintain style guides
- Apply patterns uniformly
- Document deviations

## Do's and Don'ts

### Code Structure

#### Do's

- **Request clear file organization:**
  ```
  "Organize the code following this structure:
  /src
    /features
      /auth
        auth.service.ts
        auth.controller.ts
        auth.types.ts
        auth.test.ts
    /shared
      /utils
      /types
      /constants
  
  Each feature is self-contained with related files together."
  ```

- **Demand meaningful names:**
  ```
  "Use descriptive names:
  - Functions: verbs (getUserById, calculateTotal, validateEmail)
  - Classes: nouns (UserService, PaymentProcessor, EmailValidator)
  - Booleans: questions (isActive, hasPermission, canEdit)
  - Constants: UPPER_SNAKE_CASE (MAX_RETRY_ATTEMPTS, DEFAULT_TIMEOUT)"
  ```

- **Specify complexity limits:**
  ```
  "Keep functions under 50 lines:
  - Single responsibility
  - Extract complex logic to helper functions
  - Maximum 3 levels of nesting
  - Cyclomatic complexity < 10"
  ```

- **Request documentation:**
  ```
  "Add JSDoc comments for:
  - All public functions
  - Complex algorithms
  - Non-obvious logic
  - Type definitions
  - API contracts
  
  Include: description, params, returns, examples, edge cases"
  ```

#### Don'ts

- **Don't accept generic names:**
  ```
  DON'T:
  function process(data) { ... }
  let temp = x + y;
  const arr = users.map(u => u.id);
  
  DO:
  function processUserPayment(paymentData) { ... }
  const totalAmount = basePrice + taxAmount;
  const userIds = users.map(user => user.id);
  ```

- **Don't allow deep nesting:**
  ```
  DON'T:
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        if (user.emailVerified) {
          // Do something
        }
      }
    }
  }
  
  DO:
  if (!user?.isActive) return;
  if (!user.hasPermission) return;
  if (!user.emailVerified) return;
  // Do something
  ```

- **Don't tolerate magic numbers:**
  ```
  DON'T:
  setTimeout(callback, 86400000);
  if (users.length > 100) { ... }
  
  DO:
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const MAX_USERS_PER_REQUEST = 100;
  
  setTimeout(callback, ONE_DAY_MS);
  if (users.length > MAX_USERS_PER_REQUEST) { ... }
  ```

- **Don't permit code duplication:**
  ```
  DON'T:
  function createUser(data) {
    validate(data);
    transform(data);
    save(data);
  }
  
  function updateUser(data) {
    validate(data);
    transform(data);
    update(data);
  }
  
  DO:
  function processUserData(data) {
    const validated = validate(data);
    return transform(validated);
  }
  
  function createUser(data) {
    const processed = processUserData(data);
    return save(processed);
  }
  
  function updateUser(data) {
    const processed = processUserData(data);
    return update(processed);
  }
  ```

## Real-World Examples

### Example 1: Clean Function Design

**Poor Quality:**
```typescript
function f(u, o) {
  if (!u) return null;
  let r = { ...u };
  if (o && o.inc) {
    r.f = u.f + " " + u.l;
  }
  if (o && o.age) {
    let d = new Date();
    r.age = d.getFullYear() - new Date(u.dob).getFullYear();
  }
  return r;
}
```

**High Quality Request:**
```
"Create a user formatting function with:

NAME: formatUserData
PURPOSE: Transform user object for display
PARAMS:
  - user: User object
  - options: { includeFullName?: boolean, calculateAge?: boolean }
RETURNS: Formatted user object

REQUIREMENTS:
- Descriptive parameter names
- Clear return type
- Handle null/undefined gracefully
- Extract calculations to helper functions
- Add JSDoc comments
- Use constants for magic values
- Implement proper type guards"
```

**High Quality Result:**
```typescript
interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface FormatOptions {
  includeFullName?: boolean;
  calculateAge?: boolean;
}

interface FormattedUser extends User {
  fullName?: string;
  age?: number;
}

/**
 * Formats user data for display purposes
 * 
 * @param user - User object to format
 * @param options - Formatting options
 * @returns Formatted user object with additional fields
 * @throws {Error} If user is null or invalid
 * 
 * @example
 * const formatted = formatUserData(user, { includeFullName: true });
 * console.log(formatted.fullName); // "John Doe"
 */
function formatUserData(
  user: User | null,
  options: FormatOptions = {}
): FormattedUser | null {
  if (!user) {
    return null;
  }

  const formattedUser: FormattedUser = { ...user };

  if (options.includeFullName) {
    formattedUser.fullName = buildFullName(user.firstName, user.lastName);
  }

  if (options.calculateAge) {
    formattedUser.age = calculateAge(user.dateOfBirth);
  }

  return formattedUser;
}

function buildFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Adjust if birthday hasn't occurred this year
  const birthdayThisYear = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );
  
  return today < birthdayThisYear ? age - 1 : age;
}
```

### Example 2: Error Handling

**Poor Quality:**
```typescript
async function getUser(id) {
  try {
    const user = await db.users.findOne({ id });
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
}
```

**High Quality Request:**
```
"Implement robust error handling for user retrieval:

REQUIREMENTS:
- Distinguish between different error types
- Provide meaningful error messages
- Use custom error classes
- Log errors appropriately (level, context)
- Don't swallow errors silently
- Preserve error stack traces
- Return typed errors or results"
```

**High Quality Result:**
```typescript
class UserNotFoundError extends Error {
  constructor(userId: string) {
    super(`User not found: ${userId}`);
    this.name = 'UserNotFoundError';
  }
}

class DatabaseError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

type UserResult = 
  | { success: true; data: User }
  | { success: false; error: UserNotFoundError | DatabaseError };

/**
 * Retrieves a user by ID with comprehensive error handling
 * 
 * @param id - User ID to retrieve
 * @returns Result object with user data or error
 * 
 * @example
 * const result = await getUser('123');
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
async function getUser(id: string): Promise<UserResult> {
  try {
    const user = await db.users.findOne({ id });
    
    if (!user) {
      const error = new UserNotFoundError(id);
      logger.warn('User not found', { userId: id });
      return { success: false, error };
    }
    
    logger.debug('User retrieved successfully', { userId: id });
    return { success: true, data: user };
    
  } catch (error) {
    const dbError = new DatabaseError(
      'Failed to retrieve user from database',
      error as Error
    );
    
    logger.error('Database error while retrieving user', {
      userId: id,
      error: dbError.message,
      cause: error,
      stack: dbError.stack
    });
    
    return { success: false, error: dbError };
  }
}
```

### Example 3: Configuration Management

**Poor Quality:**
```typescript
const config = {
  db: 'mongodb://localhost/mydb',
  port: 3000,
  secret: 'mysecret123'
};

export default config;
```

**High Quality Request:**
```
"Create type-safe configuration with:

REQUIREMENTS:
- Environment-based configuration
- Type safety (TypeScript)
- Validation on startup
- Default values
- Required vs optional settings
- Configuration documentation
- Secrets from environment variables
- Error messages for missing config"
```

**High Quality Result:**
```typescript
import { z } from 'zod';

/**
 * Configuration schema with validation rules
 */
const ConfigSchema = z.object({
  server: z.object({
    port: z.number().int().min(1024).max(65535).default(3000),
    host: z.string().default('localhost'),
    env: z.enum(['development', 'staging', 'production']).default('development')
  }),
  
  database: z.object({
    url: z.string().url(),
    poolSize: z.number().int().positive().default(10),
    timeout: z.number().int().positive().default(30000)
  }),
  
  security: z.object({
    jwtSecret: z.string().min(32),
    jwtExpiresIn: z.string().default('1h'),
    bcryptRounds: z.number().int().min(10).max(15).default(12)
  }),
  
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    pretty: z.boolean().default(false)
  })
});

type Config = z.infer<typeof ConfigSchema>;

/**
 * Loads and validates configuration from environment variables
 * 
 * @throws {Error} If required configuration is missing or invalid
 * @returns Validated configuration object
 */
function loadConfig(): Config {
  const rawConfig = {
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
      host: process.env.HOST,
      env: process.env.NODE_ENV
    },
    database: {
      url: process.env.DATABASE_URL,
      poolSize: process.env.DB_POOL_SIZE 
        ? parseInt(process.env.DB_POOL_SIZE, 10) 
        : undefined,
      timeout: process.env.DB_TIMEOUT 
        ? parseInt(process.env.DB_TIMEOUT, 10) 
        : undefined
    },
    security: {
      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN,
      bcryptRounds: process.env.BCRYPT_ROUNDS 
        ? parseInt(process.env.BCRYPT_ROUNDS, 10) 
        : undefined
    },
    logging: {
      level: process.env.LOG_LEVEL,
      pretty: process.env.LOG_PRETTY === 'true'
    }
  };

  try {
    return ConfigSchema.parse(rawConfig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingFields = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      throw new Error(
        `Invalid configuration:\n${missingFields}\n\n` +
        `Please check your environment variables.`
      );
    }
    throw error;
  }
}

// Validate configuration on module load
const config = loadConfig();

// Prevent modification
export default Object.freeze(config);
```

## Advanced Techniques

### 1. Code Quality Specifications

Request specific quality attributes:

```
"Implement user service with these quality attributes:

READABILITY:
- Maximum function length: 50 lines
- Maximum file length: 300 lines
- Meaningful variable names (no abbreviations except standard ones)
- Clear function purposes (single responsibility)

MAINTAINABILITY:
- Modular design (each file <300 lines)
- Dependency injection for testability
- Interface-based design
- Clear separation of concerns

TESTABILITY:
- Pure functions where possible
- No hidden dependencies
- Mockable external dependencies
- Deterministic behavior

PERFORMANCE:
- O(n log n) or better for data operations
- Lazy loading for heavy resources
- Caching for expensive operations
- Avoid premature optimization

SECURITY:
- Input validation on all public methods
- No sensitive data in logs
- Parameterized queries only
- Error messages don't leak internals"
```

### 2. Code Review Criteria

Request code review with specific focus:

```
"Review this code for quality issues:

FILE: /src/services/payment.ts

REVIEW CRITERIA:

1. SOLID PRINCIPLES:
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

2. CODE SMELLS:
   - Long methods
   - Large classes
   - Duplicate code
   - Dead code
   - Magic numbers
   - Deeply nested logic

3. NAMING:
   - Consistent conventions
   - Descriptive names
   - Appropriate length
   - Clear intent

4. ERROR HANDLING:
   - Appropriate exceptions
   - Proper logging
   - Recovery strategies
   - User-friendly messages

5. TESTING:
   - Test coverage
   - Edge cases
   - Error scenarios
   - Integration points

Provide:
- Issues found (severity: high/medium/low)
- Specific recommendations
- Code examples for fixes
- Rationale for changes"
```

### 3. Refactoring Requests

Request structured refactoring:

```
"Refactor /src/legacy/userManager.js for quality:

CURRENT ISSUES:
- 800 lines in single file
- Mixed concerns (DB, business logic, presentation)
- No error handling
- Global state
- No tests

TARGET STRUCTURE:
/src/users/
  user.types.ts          # Types and interfaces
  user.repository.ts     # Database operations
  user.service.ts        # Business logic
  user.controller.ts     # HTTP handlers
  user.validator.ts      # Input validation
  user.test.ts           # Unit tests

REFACTORING STEPS:
1. Extract types and interfaces
2. Separate database layer (repository pattern)
3. Extract business logic (service layer)
4. Create controller layer
5. Add validation
6. Write tests for each layer
7. Remove global state
8. Add error handling

MAINTAIN:
- Existing API contract
- Current functionality
- Database schema

IMPROVE:
- Type safety
- Testability
- Modularity
- Error handling
- Documentation"
```

### 4. Design Pattern Application

Request specific patterns:

```
"Implement notification system using appropriate design patterns:

REQUIREMENTS:
- Support multiple channels (email, SMS, push)
- Extensible for new channels
- Template-based messages
- Retry mechanism
- Logging and monitoring

DESIGN PATTERNS TO USE:

1. STRATEGY PATTERN:
   - Different notification strategies per channel
   - Runtime channel selection
   - Common interface for all channels

2. FACTORY PATTERN:
   - Create appropriate notifier based on channel
   - Centralized creation logic
   - Configuration-based instantiation

3. TEMPLATE METHOD PATTERN:
   - Common notification flow
   - Channel-specific customization
   - Hook points for extension

4. OBSERVER PATTERN:
   - Subscribe to notification events
   - Monitoring and logging hooks
   - Asynchronous notification

5. RETRY PATTERN:
   - Exponential backoff
   - Maximum retry limits
   - Dead letter queue

STRUCTURE:
- Clear interfaces
- Loose coupling
- High cohesion
- Easy to test
- Well documented"
```

### 5. Performance Optimization

Request performance-focused quality:

```
"Optimize search functionality for quality and performance:

CURRENT STATE:
- Response time: 2.5s average
- Memory usage: 500MB per request
- Multiple database round-trips
- No caching
- Inefficient algorithms

OPTIMIZATION TARGETS:

PERFORMANCE:
- Response time: <200ms (P95)
- Memory usage: <50MB per request
- Minimize database queries
- Implement caching
- Optimize algorithms

CODE QUALITY:
- Maintain readability
- Add performance tests
- Document optimization decisions
- Profile before/after
- Preserve functionality

APPROACH:
1. Profile current implementation
2. Identify bottlenecks
3. Optimize critical paths
4. Add caching layer
5. Implement pagination
6. Add performance tests
7. Document changes

CONSTRAINTS:
- Don't sacrifice readability for micro-optimizations
- Maintain test coverage
- Keep code maintainable
- Document trade-offs"
```

## Common Pitfalls

### 1. Over-Engineering

**Problem:**
```typescript
// Over-engineered for simple use case
class AbstractFactoryProxyBuilder<T extends BaseEntity> {
  private strategies: Map<string, Strategy<T>>;
  private observers: Observer<T>[];
  // ... 500 lines of complexity for a simple CRUD operation
}
```

**Solution:**
```typescript
// Appropriate complexity for the use case
class UserRepository {
  async findById(id: string): Promise<User | null> {
    return this.db.users.findOne({ id });
  }
  
  async save(user: User): Promise<User> {
    return this.db.users.save(user);
  }
}
```

**Prevention:**
"Keep implementations simple. Add complexity only when requirements justify it. Start with the simplest solution that works."

### 2. Insufficient Comments

**Problem:**
```typescript
// Calculate score
const s = (a + b) * c / d - e;
```

**Solution:**
```typescript
/**
 * Calculates user engagement score based on:
 * - Post interactions (likes + shares)
 * - Multiplied by recency factor
 * - Normalized by total posts
 * - Adjusted for spam penalties
 */
const engagementScore = 
  (likes + shares) * recencyFactor / totalPosts - spamPenalty;
```

**Prevention:**
"Add comments explaining WHY, not WHAT. Document complex algorithms, business rules, and non-obvious decisions."

### 3. Inconsistent Style

**Problem:**
```typescript
function getUserById(id) { ... }    // camelCase
function GetUserByEmail(email) { ... } // PascalCase
function get_user_by_name(name) { ... } // snake_case
```

**Solution:**
```typescript
// Consistent camelCase for functions
function getUserById(id: string): Promise<User> { ... }
function getUserByEmail(email: string): Promise<User> { ... }
function getUserByName(name: string): Promise<User[]> { ... }
```

**Prevention:**
"Follow established style guide. Use linters (ESLint) and formatters (Prettier) to enforce consistency."

### 4. Poor Error Messages

**Problem:**
```typescript
throw new Error('Error');
throw new Error('Failed');
throw new Error('Invalid');
```

**Solution:**
```typescript
throw new Error(
  `User not found with ID: ${userId}. ` +
  `Please verify the ID and try again.`
);

throw new Error(
  `Invalid email format: "${email}". ` +
  `Expected format: user@domain.com`
);

throw new Error(
  `Database connection failed: ${dbError.message}. ` +
  `Retrying in ${retryDelay}ms...`
);
```

**Prevention:**
"Provide context in error messages. Include what went wrong, why, and what to do next."

### 5. Tight Coupling

**Problem:**
```typescript
class UserService {
  processUser(userId: string) {
    const db = new PostgresDatabase('connection-string');
    const user = db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const email = new EmailService('smtp://...');
    email.send(user.email, 'Welcome!');
  }
}
```

**Solution:**
```typescript
interface Database {
  findUser(id: string): Promise<User>;
}

interface EmailService {
  sendWelcome(email: string): Promise<void>;
}

class UserService {
  constructor(
    private db: Database,
    private emailService: EmailService
  ) {}

  async processUser(userId: string): Promise<void> {
    const user = await this.db.findUser(userId);
    await this.emailService.sendWelcome(user.email);
  }
}
```

**Prevention:**
"Use dependency injection. Program to interfaces, not implementations. Keep classes loosely coupled."

## Checklists

### Code Quality Checklist

For every code generation:

- [ ] Meaningful, descriptive names
- [ ] Functions under 50 lines
- [ ] Files under 300 lines
- [ ] Maximum 3 levels of nesting
- [ ] No magic numbers
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Type safety (TypeScript)
- [ ] Input validation
- [ ] Appropriate comments
- [ ] Consistent formatting
- [ ] Single responsibility
- [ ] Testable design
- [ ] No global state
- [ ] Clear dependencies

### Code Review Checklist

Before accepting generated code:

- [ ] Follows team style guide
- [ ] Meets linter requirements
- [ ] Passes type checking
- [ ] Has unit tests
- [ ] Handles errors properly
- [ ] Validates inputs
- [ ] Documents complex logic
- [ ] Uses appropriate patterns
- [ ] Avoids premature optimization
- [ ] Maintains backward compatibility
- [ ] No security vulnerabilities
- [ ] Proper logging
- [ ] Resource cleanup
- [ ] Thread safety (if applicable)
- [ ] Performance acceptable

### Refactoring Checklist

When refactoring code:

- [ ] Identify code smells
- [ ] Write tests first (if missing)
- [ ] Refactor in small steps
- [ ] Run tests after each step
- [ ] Maintain functionality
- [ ] Improve one thing at a time
- [ ] Update documentation
- [ ] Review with team
- [ ] Performance regression check
- [ ] Deploy incrementally

## Metrics for Success

### Code Quality Metrics

Track these indicators:

1. **Cyclomatic Complexity**
   - Target: <10 per function
   - Measure: Code paths through function
   - Tools: SonarQube, Code Climate

2. **Code Coverage**
   - Target: >80% for critical code
   - Measure: Lines/branches covered by tests
   - Tools: Jest, NYC, Codecov

3. **Maintainability Index**
   - Target: >65 (good), >85 (excellent)
   - Measure: Composite of complexity, volume, comments
   - Tools: SonarQube, Code Climate

4. **Technical Debt Ratio**
   - Target: <5%
   - Measure: Remediation cost / development cost
   - Tools: SonarQube

5. **Code Duplication**
   - Target: <3%
   - Measure: Duplicate code blocks / total code
   - Tools: PMD, SonarQube

### Quality Indicators

| Metric | Poor | Good | Excellent |
|--------|------|------|-----------|
| Avg function length | >100 lines | 20-50 lines | <20 lines |
| Avg file length | >500 lines | 200-300 lines | <200 lines |
| Test coverage | <50% | 70-80% | >80% |
| Cyclomatic complexity | >15 | 5-10 | <5 |
| Code duplication | >10% | 3-5% | <3% |
| Comment density | <5% or >40% | 15-25% | 10-20% |

## Conclusion

High-quality code is maintainable, readable, testable, and robust. When working with Claude, always specify quality requirements upfront, review generated code carefully, and refactor when necessary. Quality is not an accident—it's a deliberate choice.

Remember: Code is for humans first, machines second. Write code that your future self will thank you for.
