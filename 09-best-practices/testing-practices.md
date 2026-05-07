# Testing Best Practices

## Overview

Effective testing is critical for AI-generated code quality. This guide covers comprehensive strategies for ensuring Claude produces well-tested, reliable code with appropriate test coverage and testing approaches.

## Core Principles

### 1. Test-Driven Mindset

Always consider testability when requesting code generation.

**Key Guidelines:**
- Request tests alongside implementation
- Specify test requirements upfront
- Design for testability
- Include edge cases
- Cover error scenarios

### 2. Comprehensive Coverage

Tests should cover happy paths, edge cases, and error conditions.

**Coverage Areas:**
- Unit tests: Individual functions/methods
- Integration tests: Component interactions
- End-to-end tests: Complete user flows
- Performance tests: Speed and scalability
- Security tests: Vulnerabilities

### 3. Maintainable Tests

Tests are code too. They need to be readable and maintainable.

**Quality Standards:**
- Clear test names
- Arrange-Act-Assert pattern
- One assertion per test (generally)
- No test interdependencies
- Fast execution

## Do's and Don'ts

### Test Generation

#### Do's

- **Request tests with implementation:**
  ```
  "Implement email validation function with:
  
  FUNCTION:
  - Name: validateEmail
  - Input: string
  - Output: boolean
  - Rules: RFC 5322 compliant
  
  TESTS:
  - Valid emails (standard, with +, subdomains)
  - Invalid emails (no @, multiple @, invalid domain)
  - Edge cases (empty string, null, undefined, very long)
  - Special characters
  - Internationalized domains"
  ```

- **Specify test framework:**
  ```
  "Use Jest with TypeScript:
  - Test file: user.service.test.ts
  - Mock database calls
  - Use describe/it structure
  - Include beforeEach/afterEach cleanup
  - Add test coverage report"
  ```

- **Demand specific scenarios:**
  ```
  "Test the payment processing with:
  
  SUCCESS SCENARIOS:
  - Valid credit card
  - Valid debit card
  - International cards
  
  FAILURE SCENARIOS:
  - Expired card
  - Insufficient funds
  - Network timeout
  - Invalid CVV
  
  EDGE CASES:
  - Exactly zero amount
  - Maximum allowed amount
  - Concurrent payment attempts
  - Retry after failure"
  ```

- **Request mocking strategy:**
  ```
  "Mock external dependencies:
  - Database: Use test database or mock
  - APIs: Mock with predetermined responses
  - Time: Mock Date.now() for consistency
  - File system: Use in-memory implementation
  - Email service: Capture without sending"
  ```

#### Don'ts

- **Don't accept untested code:**
  ```
  DON'T: Accept code without tests
  DO: "Include comprehensive tests for all public functions"
  ```

- **Don't allow flaky tests:**
  ```
  DON'T: Tests that randomly fail
  DO: "Ensure deterministic tests with proper mocking"
  ```

- **Don't permit slow tests:**
  ```
  DON'T: Unit tests taking seconds
  DO: "Unit tests should complete in <100ms each"
  ```

- **Don't skip error cases:**
  ```
  DON'T: Only test happy paths
  DO: "Test both success and all failure modes"
  ```

## Real-World Examples

### Example 1: Comprehensive Unit Tests

**Request:**
```
"Create a UserService with comprehensive tests:

SERVICE METHODS:
- createUser(data: CreateUserDto): Promise<User>
- getUserById(id: string): Promise<User>
- updateUser(id: string, data: UpdateUserDto): Promise<User>
- deleteUser(id: string): Promise<void>

TEST REQUIREMENTS:

For createUser:
- Success: Valid user data
- Validation errors: Missing fields, invalid email, weak password
- Duplicate errors: Email already exists
- Database errors: Connection failure

For getUserById:
- Success: User exists
- Not found: Invalid ID
- Database errors: Query failure

For updateUser:
- Success: Valid updates
- Validation errors: Invalid data
- Not found: User doesn't exist
- Concurrent updates: Version conflict

For deleteUser:
- Success: User deleted
- Not found: User doesn't exist
- Constraint errors: User has dependencies

MOCKING:
- Database operations
- Password hashing
- Email service

STRUCTURE:
- Use describe blocks per method
- Clear test names
- AAA pattern
- Proper cleanup"
```

**High-Quality Result:**
```typescript
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { EmailService } from '../email/email.service';
import { PasswordHasher } from '../auth/password-hasher';

// Mock dependencies
jest.mock('./user.repository');
jest.mock('../email/email.service');
jest.mock('../auth/password-hasher');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;
  let emailService: jest.Mocked<EmailService>;
  let passwordHasher: jest.Mocked<PasswordHasher>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create fresh instances
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    emailService = new EmailService() as jest.Mocked<EmailService>;
    passwordHasher = new PasswordHasher() as jest.Mocked<PasswordHasher>;
    
    userService = new UserService(
      userRepository,
      emailService,
      passwordHasher
    );
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe'
    };

    it('should create a user with valid data', async () => {
      // Arrange
      const hashedPassword = 'hashed_password';
      const createdUser = {
        id: '123',
        ...validUserData,
        password: hashedPassword,
        createdAt: new Date()
      };

      passwordHasher.hash.mockResolvedValue(hashedPassword);
      userRepository.create.mockResolvedValue(createdUser);
      emailService.sendWelcome.mockResolvedValue(undefined);

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toEqual(createdUser);
      expect(passwordHasher.hash).toHaveBeenCalledWith(validUserData.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...validUserData,
        password: hashedPassword
      });
      expect(emailService.sendWelcome).toHaveBeenCalledWith(validUserData.email);
    });

    it('should throw error for invalid email', async () => {
      // Arrange
      const invalidData = { ...validUserData, email: 'invalid-email' };

      // Act & Assert
      await expect(userService.createUser(invalidData))
        .rejects.toThrow('Invalid email format');
      
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error for weak password', async () => {
      // Arrange
      const weakPasswordData = { ...validUserData, password: '123' };

      // Act & Assert
      await expect(userService.createUser(weakPasswordData))
        .rejects.toThrow('Password does not meet complexity requirements');
      
      expect(passwordHasher.hash).not.toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      userRepository.findByEmail.mockResolvedValue({
        id: 'existing',
        email: validUserData.email
      } as any);

      // Act & Assert
      await expect(userService.createUser(validUserData))
        .rejects.toThrow('Email already registered');
      
      expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('should handle database connection errors', async () => {
      // Arrange
      const dbError = new Error('Connection failed');
      passwordHasher.hash.mockResolvedValue('hashed');
      userRepository.create.mockRejectedValue(dbError);

      // Act & Assert
      await expect(userService.createUser(validUserData))
        .rejects.toThrow('Failed to create user');
      
      expect(emailService.sendWelcome).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const user = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };
      userRepository.findById.mockResolvedValue(user as any);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should throw error when user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById('nonexistent'))
        .rejects.toThrow('User not found');
    });

    it('should throw error for invalid ID format', async () => {
      // Act & Assert
      await expect(userService.getUserById(''))
        .rejects.toThrow('Invalid user ID');
      
      expect(userRepository.findById).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    const userId = '123';
    const updateData = {
      firstName: 'Jane',
      lastName: 'Smith'
    };

    it('should update user with valid data', async () => {
      // Arrange
      const existingUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        version: 1
      };
      const updatedUser = { ...existingUser, ...updateData, version: 2 };
      
      userRepository.findById.mockResolvedValue(existingUser as any);
      userRepository.update.mockResolvedValue(updatedUser as any);

      // Act
      const result = await userService.updateUser(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
    });

    it('should throw error if user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateUser(userId, updateData))
        .rejects.toThrow('User not found');
      
      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should handle concurrent update conflicts', async () => {
      // Arrange
      const existingUser = { id: userId, version: 1 };
      userRepository.findById.mockResolvedValue(existingUser as any);
      userRepository.update.mockRejectedValue(new Error('Version conflict'));

      // Act & Assert
      await expect(userService.updateUser(userId, updateData))
        .rejects.toThrow('User was modified by another process');
    });
  });

  describe('deleteUser', () => {
    const userId = '123';

    it('should delete existing user', async () => {
      // Arrange
      const existingUser = { id: userId };
      userRepository.findById.mockResolvedValue(existingUser as any);
      userRepository.delete.mockResolvedValue(undefined);

      // Act
      await userService.deleteUser(userId);

      // Assert
      expect(userRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user not found', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.deleteUser(userId))
        .rejects.toThrow('User not found');
      
      expect(userRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle foreign key constraint violations', async () => {
      // Arrange
      userRepository.findById.mockResolvedValue({ id: userId } as any);
      userRepository.delete.mockRejectedValue(
        new Error('FOREIGN KEY constraint failed')
      );

      // Act & Assert
      await expect(userService.deleteUser(userId))
        .rejects.toThrow('Cannot delete user with existing dependencies');
    });
  });
});
```

### Example 2: Integration Tests

**Request:**
```
"Create integration tests for user authentication flow:

FLOW:
1. User registers
2. Email verification
3. User logs in
4. Access protected resource
5. Refresh token
6. Logout

SETUP:
- Use test database (Docker container)
- Seed test data
- Clean up after tests
- Real HTTP requests (supertest)

TEST SCENARIOS:
- Complete happy path
- Invalid credentials
- Unverified email attempt
- Expired token
- Invalid refresh token
- Concurrent sessions"
```

**High-Quality Result:**
```typescript
import request from 'supertest';
import { app } from '../app';
import { DatabaseHelper } from '../test/database-helper';
import { EmailCapture } from '../test/email-capture';

describe('Authentication Flow (Integration)', () => {
  let dbHelper: DatabaseHelper;
  let emailCapture: EmailCapture;

  beforeAll(async () => {
    // Start test database container
    dbHelper = new DatabaseHelper();
    await dbHelper.start();
    
    // Setup email capture
    emailCapture = new EmailCapture();
    app.set('emailService', emailCapture);
  });

  afterAll(async () => {
    await dbHelper.stop();
  });

  beforeEach(async () => {
    // Clean database before each test
    await dbHelper.clean();
    emailCapture.clear();
  });

  describe('Complete authentication flow', () => {
    it('should complete full registration and login flow', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe'
      };

      // Step 1: Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body).toMatchObject({
        message: 'Registration successful',
        userId: expect.any(String)
      });

      // Step 2: Verify email
      const verificationEmail = emailCapture.getLastEmail();
      expect(verificationEmail.to).toBe(userData.email);
      
      const verificationToken = extractToken(verificationEmail.body);
      
      await request(app)
        .get(`/api/auth/verify-email?token=${verificationToken}`)
        .expect(200);

      // Step 3: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      const { accessToken, refreshToken } = loginResponse.body;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();

      // Step 4: Access protected resource
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(profileResponse.body.email).toBe(userData.email);

      // Step 5: Refresh token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      const newAccessToken = refreshResponse.body.accessToken;
      expect(newAccessToken).toBeDefined();
      expect(newAccessToken).not.toBe(accessToken);

      // Step 6: Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(200);

      // Verify token is invalidated
      await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${newAccessToken}`)
        .expect(401);
    });
  });

  describe('Error scenarios', () => {
    it('should reject login with unverified email', async () => {
      // Register without verifying
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'unverified@example.com',
          password: 'SecurePass123!',
          firstName: 'Test',
          lastName: 'User'
        });

      // Attempt login
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unverified@example.com',
          password: 'SecurePass123!'
        })
        .expect(403)
        .expect(res => {
          expect(res.body.error).toBe('Email not verified');
        });
    });

    it('should reject invalid credentials', async () => {
      // Setup: Create and verify user
      const email = 'test@example.com';
      await registerAndVerifyUser(email, 'SecurePass123!');

      // Test: Wrong password
      await request(app)
        .post('/api/auth/login')
        .send({ email, password: 'WrongPassword' })
        .expect(401)
        .expect(res => {
          expect(res.body.error).toBe('Invalid credentials');
        });
    });

    it('should reject expired access token', async () => {
      // This test uses time manipulation
      jest.useFakeTimers();
      
      const { accessToken } = await loginUser('test@example.com');

      // Fast-forward 2 hours (token expires in 1 hour)
      jest.advanceTimersByTime(2 * 60 * 60 * 1000);

      await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(401)
        .expect(res => {
          expect(res.body.error).toBe('Token expired');
        });

      jest.useRealTimers();
    });

    it('should prevent concurrent session attacks', async () => {
      const { accessToken, refreshToken } = await loginUser('test@example.com');

      // Use refresh token
      const refresh1 = request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      // Try to reuse same refresh token concurrently
      const refresh2 = request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      const [response1, response2] = await Promise.all([refresh1, refresh2]);

      // One should succeed, one should fail
      const results = [response1.status, response2.status].sort();
      expect(results).toEqual([200, 401]);
    });
  });

  // Helper functions
  async function registerAndVerifyUser(
    email: string,
    password: string
  ): Promise<void> {
    await request(app)
      .post('/api/auth/register')
      .send({
        email,
        password,
        firstName: 'Test',
        lastName: 'User'
      });

    const verificationEmail = emailCapture.getLastEmail();
    const token = extractToken(verificationEmail.body);
    
    await request(app)
      .get(`/api/auth/verify-email?token=${token}`);
  }

  async function loginUser(email: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'SecurePass123!' });

    return response.body;
  }

  function extractToken(emailBody: string): string {
    const match = emailBody.match(/token=([a-zA-Z0-9-_]+)/);
    return match ? match[1] : '';
  }
});
```

### Example 3: Performance Tests

**Request:**
```
"Create performance tests for search API:

REQUIREMENTS:
- Measure response time under load
- Test with different data sizes (100, 1K, 10K, 100K results)
- Concurrent requests (1, 10, 50, 100 concurrent)
- Memory usage profiling
- Database query performance

ACCEPTANCE CRITERIA:
- P95 response time <200ms for 1K results
- P99 response time <500ms for 10K results
- Support 100 concurrent requests
- Memory usage <100MB per request

TOOLS:
- Artillery for load testing
- Clinic.js for profiling
- Custom metrics collection"
```

## Advanced Techniques

### 1. Property-Based Testing

```
"Implement property-based tests for sort function:

Use fast-check library to test properties:

PROPERTIES:
1. Output length equals input length
2. All input elements present in output
3. Output is sorted (each element <= next element)
4. Idempotent (sorting twice gives same result)
5. Empty input gives empty output

GENERATE TEST CASES:
- Various array sizes (0 to 1000 elements)
- Different data types (numbers, strings, objects)
- Edge cases (all same, already sorted, reverse sorted)
- Random data distributions"
```

### 2. Mutation Testing

```
"Set up mutation testing with Stryker:

CONFIGURATION:
- Mutate arithmetic operators (+, -, *, /)
- Mutate comparison operators (<, >, <=, >=, ==, !=)
- Mutate boolean logic (&&, ||, !)
- Mutate return values

TARGET:
- Mutation score >80%
- Identify weak tests
- Improve test quality based on results

FOCUS AREAS:
- Critical business logic
- Security-sensitive code
- Error handling paths"
```

### 3. Contract Testing

```
"Implement contract tests for API:

PROVIDER SIDE:
- Define API contract (OpenAPI spec)
- Generate contract tests from spec
- Verify implementation matches contract

CONSUMER SIDE:
- Test against contract
- Ensure compatibility
- Catch breaking changes

TOOLS:
- Pact for contract testing
- Automated contract verification
- CI/CD integration"
```

## Common Pitfalls

### 1. Testing Implementation Details

**Problem:**
```typescript
// Testing internal implementation
it('should call helper function', () => {
  const spy = jest.spyOn(service, '_internalHelper');
  service.publicMethod();
  expect(spy).toHaveBeenCalled();
});
```

**Solution:**
```typescript
// Test observable behavior
it('should return correct result', () => {
  const result = service.publicMethod();
  expect(result).toEqual(expectedOutput);
});
```

### 2. Interdependent Tests

**Problem:**
```typescript
// Tests depend on execution order
describe('bad tests', () => {
  let sharedState;
  
  it('test 1', () => {
    sharedState = createData();
    expect(sharedState).toBeDefined();
  });
  
  it('test 2', () => {
    // Fails if test 1 doesn't run first
    expect(sharedState).toHaveProperty('id');
  });
});
```

**Solution:**
```typescript
// Independent tests
describe('good tests', () => {
  let testData;
  
  beforeEach(() => {
    testData = createData();
  });
  
  it('test 1', () => {
    expect(testData).toBeDefined();
  });
  
  it('test 2', () => {
    expect(testData).toHaveProperty('id');
  });
});
```

## Metrics for Success

### Test Quality Metrics

1. **Code Coverage**
   - Target: >80% line coverage, >70% branch coverage
   - Measure: Lines/branches executed during tests

2. **Test-to-Code Ratio**
   - Target: 1:1 to 3:1
   - Measure: Test code lines / production code lines

3. **Test Execution Time**
   - Target: Unit tests <10s, Integration tests <1min
   - Measure: Total test suite run time

4. **Test Reliability**
   - Target: <1% flaky tests
   - Measure: Test failures not caused by code changes

5. **Defect Escape Rate**
   - Target: <5% bugs reach production
   - Measure: Production bugs / total bugs found

## Conclusion

Comprehensive testing ensures code reliability and maintainability. Always request tests with implementation, cover edge cases, and maintain test quality. Good tests are the safety net that allows confident refactoring and rapid development.
