# Testing Prompts

Comprehensive prompts for writing, improving, and debugging tests across all testing types.

## Table of Contents
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Test Design](#test-design)
- [Test Coverage](#test-coverage)
- [Test Debugging](#test-debugging)

---

## Unit Testing

### 1. Generate Unit Tests
```
Generate comprehensive unit tests for this code:

Code: [paste function/class/module]
Language: [language and test framework]

Please create tests that:
1. Cover happy path scenarios
2. Test edge cases
3. Verify error handling
4. Check boundary conditions
5. Use appropriate assertions
6. Follow [framework] conventions
7. Include setup/teardown if needed
8. Add descriptive test names
```

**Usage Context**: Creating tests for new or existing code.

**Example Input**:
```python
def calculate_discount(price, customer_tier, quantity):
    if price <= 0:
        raise ValueError("Price must be positive")
    
    tier_discounts = {"bronze": 0.05, "silver": 0.10, "gold": 0.15}
    base_discount = tier_discounts.get(customer_tier, 0)
    
    volume_discount = 0.05 if quantity >= 10 else 0
    total_discount = min(base_discount + volume_discount, 0.25)
    
    return price * (1 - total_discount)
```

**Example Output**:
```python
import pytest

class TestCalculateDiscount:
    
    def test_bronze_customer_single_item(self):
        result = calculate_discount(100, "bronze", 1)
        assert result == 95.0
    
    def test_gold_customer_bulk_order(self):
        result = calculate_discount(100, "gold", 10)
        assert result == 80.0  # 15% + 5% = 20% discount
    
    def test_unknown_tier_defaults_to_zero(self):
        result = calculate_discount(100, "platinum", 1)
        assert result == 100.0
    
    def test_discount_capped_at_25_percent(self):
        # Gold (15%) + volume (5%) would be 20%, within cap
        result = calculate_discount(100, "gold", 10)
        assert result == 80.0
    
    def test_zero_price_raises_error(self):
        with pytest.raises(ValueError, match="Price must be positive"):
            calculate_discount(0, "bronze", 1)
    
    def test_negative_price_raises_error(self):
        with pytest.raises(ValueError, match="Price must be positive"):
            calculate_discount(-10, "bronze", 1)
    
    def test_boundary_quantity_for_volume_discount(self):
        # 9 items - no volume discount
        result_9 = calculate_discount(100, "bronze", 9)
        assert result_9 == 95.0
        
        # 10 items - gets volume discount
        result_10 = calculate_discount(100, "bronze", 10)
        assert result_10 == 90.0
    
    def test_decimal_prices(self):
        result = calculate_discount(99.99, "silver", 1)
        assert result == pytest.approx(89.991, rel=1e-2)
```

**Language Variations**:
- **JavaScript/Jest**: Use `describe`, `it`, `expect`
- **Java/JUnit**: Use `@Test`, assertions from JUnit 5
- **C#/xUnit**: Use `[Fact]`, `[Theory]` with `[InlineData]`
- **Go**: Use table-driven tests

**Tips for Customization**:
- Specify mocking framework (Mockito, Moq, unittest.mock)
- Mention code coverage targets
- Request specific assertion styles

---

### 2. Mock External Dependencies
```
Create tests with mocked dependencies:

Code: [paste code with external dependencies]
Dependencies to Mock: [databases, APIs, file system, etc]
Test Framework: [framework]
Mocking Library: [library]

Please:
1. Identify all external dependencies
2. Create appropriate mocks/stubs
3. Set up mock behaviors
4. Verify interactions with mocks
5. Test different mock scenarios
6. Ensure tests are isolated
```

**Usage Context**: Testing code that depends on external systems.

**Example Input**:
```javascript
class UserService {
  constructor(database, emailService) {
    this.db = database;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    const user = await this.db.insert('users', userData);
    await this.emailService.sendWelcomeEmail(user.email);
    return user;
  }
}
```

**Example Output**:
```javascript
const { jest } = require('@jest/globals');

describe('UserService', () => {
  let userService;
  let mockDatabase;
  let mockEmailService;
  
  beforeEach(() => {
    mockDatabase = {
      insert: jest.fn()
    };
    mockEmailService = {
      sendWelcomeEmail: jest.fn()
    };
    userService = new UserService(mockDatabase, mockEmailService);
  });
  
  test('createUser inserts user and sends welcome email', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const createdUser = { id: 1, ...userData };
    
    mockDatabase.insert.mockResolvedValue(createdUser);
    mockEmailService.sendWelcomeEmail.mockResolvedValue(true);
    
    const result = await userService.createUser(userData);
    
    expect(mockDatabase.insert).toHaveBeenCalledWith('users', userData);
    expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith('john@example.com');
    expect(result).toEqual(createdUser);
  });
  
  test('createUser handles email service failure gracefully', async () => {
    const userData = { name: 'John', email: 'john@example.com' };
    const createdUser = { id: 1, ...userData };
    
    mockDatabase.insert.mockResolvedValue(createdUser);
    mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service down'));
    
    await expect(userService.createUser(userData)).rejects.toThrow('Email service down');
  });
});
```

**Common Mistakes to Avoid**:
- Over-mocking (mocking what you control)
- Not resetting mocks between tests
- Testing mock implementation instead of behavior

---

### 3. Parameterized/Data-Driven Tests
```
Create parameterized tests for this function:

Function: [paste function]
Test Framework: [framework with parameterization support]

Generate:
1. Test data covering various scenarios
2. Parameterized test structure
3. Clear test case descriptions
4. Edge cases in test data
5. Expected results for each input
```

**Usage Context**: Testing same logic with multiple inputs.

**Example Input**:
```java
public boolean isValidEmail(String email) {
    return email != null && 
           email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
}
```

**Example Output**:
```java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import static org.junit.jupiter.api.Assertions.*;

class EmailValidatorTest {
    
    @ParameterizedTest(name = "Valid email: {0}")
    @CsvSource({
        "user@example.com",
        "user.name@example.com",
        "user+tag@example.co.uk",
        "user_123@test-domain.com",
        "123@example.com"
    })
    void testValidEmails(String email) {
        assertTrue(isValidEmail(email));
    }
    
    @ParameterizedTest(name = "Invalid email: {0}")
    @CsvSource({
        "invalid",
        "@example.com",
        "user@",
        "user @example.com",
        "user@.com",
        "user..name@example.com"
    })
    void testInvalidEmails(String email) {
        assertFalse(isValidEmail(email));
    }
    
    @ParameterizedTest
    @NullAndEmptySource
    void testNullAndEmptyEmails(String email) {
        assertFalse(isValidEmail(email));
    }
}
```

**Language Variations**:
- **Python/pytest**: Use `@pytest.mark.parametrize`
- **JavaScript/Jest**: Use `test.each`
- **C#/xUnit**: Use `[Theory]` and `[InlineData]`

---

### 4. Test Fixtures and Setup
```
Create proper test fixtures and setup for:

Test Suite: [describe tests]
Shared Data: [what data is needed across tests]
Framework: [testing framework]

Design:
1. Fixture/setup structure
2. Before/after hooks
3. Shared vs isolated fixtures
4. Cleanup procedures
5. Fixture factories if needed
6. Resource management
```

**Usage Context**: Setting up test data and environment.

---

### 5. Exception and Error Testing
```
Create tests for error handling:

Code: [paste code with error handling]
Expected Errors: [list error conditions]

Test:
1. Each error condition
2. Error messages
3. Error types/codes
4. Stack traces (if relevant)
5. Cleanup on errors
6. Partial success scenarios
```

**Usage Context**: Verifying error handling works correctly.

---

## Integration Testing

### 6. API Integration Tests
```
Create integration tests for API endpoints:

API: [endpoint details]
Method: [GET/POST/PUT/DELETE]
Request Format: [JSON/XML/etc]
Response Format: [format]
Authentication: [method]

Test:
1. Successful requests
2. Invalid inputs
3. Authentication failures
4. Rate limiting
5. Response validation
6. Status codes
7. Headers
8. Performance assertions
```

**Usage Context**: Testing HTTP APIs.

**Example Input**:
```
API: POST /api/users
Request: { "name": "string", "email": "string" }
Response: { "id": "uuid", "name": "string", "email": "string", "createdAt": "datetime" }
Authentication: Bearer token
```

**Example Output**:
```javascript
const request = require('supertest');
const app = require('../app');

describe('POST /api/users', () => {
  const validToken = 'valid-jwt-token';
  
  test('creates user with valid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'John Doe',
        email: 'john@example.com'
      })
      .expect(201)
      .expect('Content-Type', /json/);
    
    expect(response.body).toMatchObject({
      name: 'John Doe',
      email: 'john@example.com'
    });
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('createdAt');
  });
  
  test('returns 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'John Doe',
        email: 'invalid-email'
      })
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('email');
  });
  
  test('returns 401 without authentication', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com'
      })
      .expect(401);
  });
});
```

---

### 7. Database Integration Tests
```
Create database integration tests:

Database: [type]
ORM: [if any]
Schema: [describe tables/collections]
Test Data: [fixtures needed]

Test:
1. CRUD operations
2. Transactions
3. Constraints (unique, foreign key)
4. Complex queries
5. Database migrations
6. Connection handling
7. Cleanup between tests
```

**Usage Context**: Testing database interactions.

**Tips for Customization**:
- Specify if using in-memory DB for tests
- Mention transaction rollback strategy
- Include test data seeding approach

---

### 8. Message Queue Integration Tests
```
Create tests for message queue operations:

Queue System: [RabbitMQ/Kafka/SQS/etc]
Message Format: [schema]
Producers: [what sends messages]
Consumers: [what processes messages]

Test:
1. Message production
2. Message consumption
3. Message format validation
4. Error handling and DLQ
5. Idempotency
6. Ordering guarantees
7. At-least-once/exactly-once delivery
```

**Usage Context**: Testing async messaging.

---

### 9. External Service Integration
```
Create integration tests for external service:

Service: [third-party API/service]
Integration Points: [endpoints used]
Test Environment: [sandbox/test environment]

Test:
1. Successful integrations
2. Service unavailability
3. Timeout handling
4. Retry logic
5. Circuit breaker
6. Response validation
7. Fallback mechanisms
```

**Usage Context**: Testing third-party integrations.

---

## Test Design

### 10. Test Strategy for Complex Logic
```
Design test strategy for complex business logic:

Logic: [describe or paste code]
Business Rules: [list rules]
Edge Cases: [known edge cases]

Create:
1. Test categories (equivalence partitions)
2. Boundary value tests
3. Decision table tests
4. State transition tests
5. Error path tests
6. Integration scenarios
7. Test prioritization
```

**Usage Context**: Planning tests for complex scenarios.

---

### 11. Contract Testing
```
Create contract tests for:

Provider: [service providing API]
Consumer: [service consuming API]
Contract: [API specification]

Design:
1. Provider contract tests
2. Consumer contract tests
3. Schema validation
4. Breaking change detection
5. Contract versioning
6. Pact/contract test framework setup
```

**Usage Context**: Testing service agreements in microservices.

---

### 12. Property-Based Testing
```
Create property-based tests for:

Function: [paste function]
Properties/Invariants: [what should always be true]
Framework: [Hypothesis/QuickCheck/fast-check]

Design:
1. Property definitions
2. Input generators
3. Invariants to verify
4. Shrinking strategies
5. Example seed values
```

**Usage Context**: Testing with random/generated inputs.

**Example Input**:
```python
def sort_list(items):
    return sorted(items)
```

**Example Output**:
```python
from hypothesis import given, strategies as st

class TestSortList:
    
    @given(st.lists(st.integers()))
    def test_sort_is_idempotent(self, items):
        """Sorting twice should give same result as sorting once"""
        sorted_once = sort_list(items)
        sorted_twice = sort_list(sorted_once)
        assert sorted_once == sorted_twice
    
    @given(st.lists(st.integers()))
    def test_sort_preserves_length(self, items):
        """Sorted list should have same length"""
        assert len(sort_list(items)) == len(items)
    
    @given(st.lists(st.integers(), min_size=1))
    def test_sort_is_ordered(self, items):
        """Each element should be <= next element"""
        sorted_items = sort_list(items)
        for i in range(len(sorted_items) - 1):
            assert sorted_items[i] <= sorted_items[i + 1]
    
    @given(st.lists(st.integers()))
    def test_sort_preserves_elements(self, items):
        """Same elements, just reordered"""
        from collections import Counter
        assert Counter(items) == Counter(sort_list(items))
```

---

## Test Coverage

### 13. Improve Test Coverage
```
Analyze and improve test coverage:

Current Coverage: [percentage]
Code: [paste untested or poorly covered code]
Coverage Report: [paste gaps]

Please:
1. Identify untested code paths
2. Prioritize coverage improvements
3. Generate tests for gaps
4. Focus on critical paths
5. Avoid testing trivial code
6. Recommend coverage targets
```

**Usage Context**: Increasing test coverage strategically.

**Common Mistakes to Avoid**:
- Chasing 100% coverage blindly
- Testing getters/setters
- Not prioritizing critical business logic

---

### 14. Mutation Testing Analysis
```
Analyze mutation testing results:

Code: [paste code]
Surviving Mutants: [describe mutations that survived]

Improve tests to catch:
1. Each surviving mutation
2. Logic operator changes
3. Boundary condition changes
4. Return value modifications
5. Conditional changes
```

**Usage Context**: Improving test quality beyond coverage.

---

## Test Debugging

### 15. Debug Flaky Tests
```
Debug this flaky test:

Test: [paste test code]
Failure Rate: [percentage or pattern]
Error Messages: [varied errors or consistent]
Environment: [where it fails]

Investigate:
1. Race conditions
2. Non-deterministic behavior
3. External dependencies
4. Test isolation issues
5. Timing dependencies
6. Shared state
7. Suggest fixes
```

**Usage Context**: Fixing unreliable tests.

**Example Input**:
```javascript
test('user count updates correctly', async () => {
  await createUser({ name: 'Alice' });
  const count = await getUserCount();
  expect(count).toBe(1);
});
```

**Common Causes**:
- Async operations not properly awaited
- Tests not isolated (shared database state)
- Time-dependent logic
- Network requests to real services

---

## Testing Best Practices Template

```
TEST GENERATION REQUEST:

Code to Test:
[paste code]

Context:
- Language/Framework: [details]
- Test Framework: [Jest/JUnit/pytest/etc]
- Mocking Library: [if needed]
- Coverage Target: [percentage]

Requirements:
1. Test Types: [unit/integration/e2e]
2. Focus Areas: [happy path/edge cases/errors]
3. Dependencies: [what needs mocking]
4. Test Data: [fixtures/factories]

Preferences:
- Assertion Style: [preferred syntax]
- Test Structure: [AAA/given-when-then]
- Naming Convention: [convention]

Please Provide:
1. Test suite structure
2. Individual test cases
3. Setup/teardown code
4. Test data/fixtures
5. Mock configurations
6. Assertions with meaningful messages
7. Coverage analysis
8. Edge cases identified
```

## Best Practices for Testing Prompts

1. **Provide Complete Code**: Include dependencies and context
2. **Specify Framework**: Mention testing framework and version
3. **Define Coverage Goals**: What needs testing vs what doesn't
4. **Request Meaningful Names**: Ask for descriptive test names
5. **Include Business Rules**: Explain what behavior is correct
6. **Ask for Edge Cases**: Request boundary and error scenarios
7. **Mention Mocking Needs**: Identify external dependencies
8. **Request Documentation**: Ask for test purpose comments
