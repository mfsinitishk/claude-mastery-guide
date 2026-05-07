# Unit Test Generation

## From Code to Comprehensive Test Coverage with AI

---

## 🎯 Overview

Writing tests is essential but time-consuming. Claude can generate comprehensive test suites that cover happy paths, edge cases, and error scenarios, transforming testing from a chore into a quick, systematic process.

**Time to Master:** 4-5 hours of practice  
**Outcome:** Generate thorough test suites quickly and confidently

---

## 💡 Why AI-Assisted Test Generation?

### The Testing Challenge

**Traditional Approach:**
```
Write function → Manually think of test cases →
Write tests one by one → Realize you missed edge cases →
Add more tests → Still not confident

Time: 1-2 hours for thorough testing
Coverage: 60-80%
```

**AI-Assisted Approach:**
```
Write function → Ask Claude for comprehensive tests →
Review and refine → Add domain-specific cases →
High confidence

Time: 15-30 minutes
Coverage: 85-95%
```

### Benefits

**Speed:** 5-10x faster test generation  
**Coverage:** Identifies edge cases you might miss  
**Consistency:** Standardized test structure  
**Learning:** See testing best practices in action  

---

## 🔧 Test Generation Patterns

### Pattern 1: Comprehensive Test Suite

**Template:**
```
Generate comprehensive unit tests for this function:

Testing framework: [Jest, pytest, JUnit, etc.]
Coverage needed:
- Happy path (normal usage)
- Edge cases (boundaries, empty inputs)
- Error cases (invalid inputs, exceptions)
- Special cases (nulls, negatives, etc.)

Include:
- Test setup/teardown if needed
- Clear test names
- Arrange-Act-Assert structure
- Assertions that verify behavior

[Function code]
```

**Example:**

**Code to Test:**
```python
def calculate_discount(price, discount_percent, customer_type='regular'):
    """
    Calculate final price after discount.
    
    Args:
        price: Original price (must be positive)
        discount_percent: Discount percentage (0-100)
        customer_type: 'regular', 'premium', or 'vip'
    
    Returns:
        Final price after discount
    
    Raises:
        ValueError: If price is negative or discount invalid
    """
    if price < 0:
        raise ValueError("Price cannot be negative")
    
    if discount_percent < 0 or discount_percent > 100:
        raise ValueError("Discount must be between 0 and 100")
    
    # VIP customers get extra 5% off
    if customer_type == 'vip':
        discount_percent += 5
    # Premium customers get extra 2% off
    elif customer_type == 'premium':
        discount_percent += 2
    
    # Cap at 100% discount
    discount_percent = min(discount_percent, 100)
    
    discount_amount = price * (discount_percent / 100)
    final_price = price - discount_amount
    
    return round(final_price, 2)
```

**Prompt:**
```
Generate comprehensive pytest tests for this function:

Cover:
- Normal usage with different customer types
- Boundary values (0, 100% discount)
- Edge cases (very small prices, large prices)
- Invalid inputs (negative price, invalid discount)
- Invalid customer types
- Rounding edge cases

Use descriptive test names and organize into test class.

[code above]
```

**Generated Tests:**
```python
import pytest
from decimal import Decimal

class TestCalculateDiscount:
    """Test suite for calculate_discount function."""
    
    # Happy Path Tests
    def test_regular_customer_with_valid_discount(self):
        """Regular customer should get exact discount specified."""
        result = calculate_discount(100, 10, 'regular')
        assert result == 90.0
    
    def test_premium_customer_gets_extra_discount(self):
        """Premium customer should get additional 2% off."""
        result = calculate_discount(100, 10, 'premium')
        assert result == 88.0  # 10% + 2% = 12%
    
    def test_vip_customer_gets_maximum_extra_discount(self):
        """VIP customer should get additional 5% off."""
        result = calculate_discount(100, 10, 'vip')
        assert result == 85.0  # 10% + 5% = 15%
    
    def test_zero_discount(self):
        """Zero discount should return original price."""
        result = calculate_discount(100, 0)
        assert result == 100.0
    
    def test_full_discount(self):
        """100% discount should return zero."""
        result = calculate_discount(100, 100)
        assert result == 0.0
    
    # Edge Cases
    def test_zero_price(self):
        """Zero price should return zero regardless of discount."""
        result = calculate_discount(0, 50)
        assert result == 0.0
    
    def test_very_small_price(self):
        """Small prices should be calculated correctly."""
        result = calculate_discount(0.01, 50)
        assert result == 0.01  # Rounds to 0.01
    
    def test_large_price(self):
        """Large prices should be calculated correctly."""
        result = calculate_discount(999999.99, 10)
        assert result == 899999.99
    
    def test_vip_discount_capped_at_100_percent(self):
        """VIP discount + original shouldn't exceed 100%."""
        result = calculate_discount(100, 96, 'vip')
        assert result == 0.0  # 96% + 5% = 101%, capped at 100%
    
    def test_premium_discount_capped_at_100_percent(self):
        """Premium discount + original shouldn't exceed 100%."""
        result = calculate_discount(100, 99, 'premium')
        assert result == 0.0  # 99% + 2% = 101%, capped at 100%
    
    def test_rounding_to_two_decimals(self):
        """Result should be rounded to 2 decimal places."""
        result = calculate_discount(10.00, 33.333)
        assert result == 6.67  # 10 - 3.3333 = 6.6667 → 6.67
    
    # Error Cases
    def test_negative_price_raises_error(self):
        """Negative price should raise ValueError."""
        with pytest.raises(ValueError, match="Price cannot be negative"):
            calculate_discount(-10, 10)
    
    def test_negative_discount_raises_error(self):
        """Negative discount should raise ValueError."""
        with pytest.raises(ValueError, match="Discount must be between 0 and 100"):
            calculate_discount(100, -5)
    
    def test_discount_over_100_raises_error(self):
        """Discount over 100% should raise ValueError."""
        with pytest.raises(ValueError, match="Discount must be between 0 and 100"):
            calculate_discount(100, 101)
    
    def test_invalid_customer_type_defaults_to_regular(self):
        """Invalid customer type should be treated as regular."""
        result = calculate_discount(100, 10, 'invalid')
        assert result == 90.0  # Same as regular
    
    # Parametrized Tests for Multiple Scenarios
    @pytest.mark.parametrize("price,discount,customer_type,expected", [
        (100, 10, 'regular', 90.0),
        (100, 10, 'premium', 88.0),
        (100, 10, 'vip', 85.0),
        (50, 20, 'regular', 40.0),
        (75.50, 15, 'premium', 62.67),
    ])
    def test_various_valid_combinations(self, price, discount, customer_type, expected):
        """Test multiple valid input combinations."""
        result = calculate_discount(price, discount, customer_type)
        assert result == expected
```

### Pattern 2: Testing with Mocks

**Code to Test:**
```typescript
class UserService {
  constructor(private db: Database, private emailService: EmailService) {}
  
  async createUser(email: string, name: string): Promise<User> {
    // Check if user exists
    const existing = await this.db.findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    
    // Create user
    const user = await this.db.createUser({ email, name });
    
    // Send welcome email
    await this.emailService.sendWelcomeEmail(email, name);
    
    return user;
  }
}
```

**Prompt:**
```
Generate Jest tests for this TypeScript class:

Requirements:
- Mock the database and email service
- Test happy path (successful creation)
- Test duplicate user error
- Test email sending failure
- Verify method calls and arguments
- Use proper TypeScript types

[code above]
```

**Generated Tests:**
```typescript
import { UserService } from './UserService';
import { Database } from './Database';
import { EmailService } from './EmailService';

// Mock the dependencies
jest.mock('./Database');
jest.mock('./EmailService');

describe('UserService', () => {
  let userService: UserService;
  let mockDb: jest.Mocked<Database>;
  let mockEmailService: jest.Mocked<EmailService>;
  
  beforeEach(() => {
    // Create fresh mocks before each test
    mockDb = new Database() as jest.Mocked<Database>;
    mockEmailService = new EmailService() as jest.Mocked<EmailService>;
    userService = new UserService(mockDb, mockEmailService);
    
    // Clear mock call history
    jest.clearAllMocks();
  });
  
  describe('createUser', () => {
    it('should create user successfully when email is unique', async () => {
      // Arrange
      const email = 'test@example.com';
      const name = 'Test User';
      const expectedUser = { id: 1, email, name };
      
      mockDb.findUserByEmail.mockResolvedValue(null);
      mockDb.createUser.mockResolvedValue(expectedUser);
      mockEmailService.sendWelcomeEmail.mockResolvedValue(undefined);
      
      // Act
      const result = await userService.createUser(email, name);
      
      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockDb.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockDb.createUser).toHaveBeenCalledWith({ email, name });
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(email, name);
    });
    
    it('should throw error when user already exists', async () => {
      // Arrange
      const email = 'existing@example.com';
      const name = 'Existing User';
      const existingUser = { id: 1, email, name };
      
      mockDb.findUserByEmail.mockResolvedValue(existingUser);
      
      // Act & Assert
      await expect(userService.createUser(email, name))
        .rejects.toThrow('User already exists');
      
      // Should not create user or send email
      expect(mockDb.createUser).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });
    
    it('should create user even if email sending fails', async () => {
      // Arrange
      const email = 'test@example.com';
      const name = 'Test User';
      const expectedUser = { id: 1, email, name };
      
      mockDb.findUserByEmail.mockResolvedValue(null);
      mockDb.createUser.mockResolvedValue(expectedUser);
      mockEmailService.sendWelcomeEmail.mockRejectedValue(
        new Error('Email service down')
      );
      
      // Act & Assert
      // Currently throws - might want to handle email errors differently
      await expect(userService.createUser(email, name))
        .rejects.toThrow('Email service down');
      
      // User was created before email failed
      expect(mockDb.createUser).toHaveBeenCalled();
    });
    
    it('should handle database errors gracefully', async () => {
      // Arrange
      const email = 'test@example.com';
      const name = 'Test User';
      
      mockDb.findUserByEmail.mockRejectedValue(
        new Error('Database connection failed')
      );
      
      // Act & Assert
      await expect(userService.createUser(email, name))
        .rejects.toThrow('Database connection failed');
    });
  });
});
```

### Pattern 3: Testing React Components

**Component to Test:**
```tsx
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

**Prompt:**
```
Generate React Testing Library tests for this component:

Test:
- Initial render with default placeholder
- Custom placeholder
- Typing into input updates state
- Form submission calls onSearch with trimmed query
- Empty/whitespace query doesn't call onSearch
- Form submission clears input (if that's expected behavior)

Use user events and proper queries.

[component code]
```

**Generated Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });
  
  it('renders with custom placeholder', () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} placeholder="Find users..." />);
    
    const input = screen.getByPlaceholderText('Find users...');
    expect(input).toBeInTheDocument();
  });
  
  it('updates input value when user types', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    await user.type(input, 'test query');
    
    expect(input).toHaveValue('test query');
  });
  
  it('calls onSearch with trimmed query on form submission', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '  test query  ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onSearch when query is empty', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /search/i });
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
  
  it('does not call onSearch when query is only whitespace', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, '   ');
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });
  
  it('submits form when pressing Enter key', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    
    await user.type(input, 'test query{Enter}');
    
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });
});
```

---

## 🎯 Test Coverage Strategies

### 1. Happy Path Testing

**What:** Normal, expected usage

**Example:**
```python
def test_valid_login():
    """User can login with correct credentials."""
    result = login('user@example.com', 'password123')
    assert result.success == True
    assert result.token is not None
```

### 2. Edge Case Testing

**What:** Boundary values, extremes

**Examples:**
```python
def test_empty_input():
    """Handle empty string input."""
    
def test_null_input():
    """Handle null/None input."""
    
def test_very_large_input():
    """Handle input at maximum size."""
    
def test_minimum_value():
    """Handle minimum allowed value."""
    
def test_maximum_value():
    """Handle maximum allowed value."""
```

### 3. Error Case Testing

**What:** Invalid inputs, failure scenarios

**Examples:**
```python
def test_invalid_email_format():
    """Reject improperly formatted emails."""
    
def test_unauthorized_access():
    """Block access without authentication."""
    
def test_database_connection_failure():
    """Handle database unavailability gracefully."""
```

### 4. State Testing

**What:** Different object states, sequences

**Examples:**
```python
def test_order_lifecycle():
    """Test order from creation through completion."""
    order = create_order()
    assert order.status == 'pending'
    
    order.process_payment()
    assert order.status == 'paid'
    
    order.ship()
    assert order.status == 'shipped'
    
    order.deliver()
    assert order.status == 'delivered'
```

---

## 📋 Test Generation Prompt Templates

### Template 1: Basic Test Suite

```
Generate [framework] tests for this [language] function:

Function: [name and brief description]

Test coverage needed:
- Happy path: [2-3 scenarios]
- Edge cases: [2-3 scenarios]
- Error cases: [2-3 scenarios]

Style:
- Clear test names
- Arrange-Act-Assert pattern
- One assertion per test (when possible)

[code]
```

### Template 2: Integration Tests

```
Generate integration tests for this module:

Module: [description]
Dependencies: [list of external dependencies]
Testing framework: [framework name]

Test:
- Successful integration scenarios
- Dependency failure handling
- Data flow between components
- Side effects and state changes

Mock: [what to mock]
Real: [what to use real implementations]

[code]
```

### Template 3: TDD - Tests First

```
I want to implement: [feature description]

Generate tests first (TDD approach) for:

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Include tests for:
- All requirements met
- Edge cases
- Error handling

Then show a simple implementation that passes these tests.
```

---

## 🎓 Practice Exercises

### Exercise 1: Test This Validator

```javascript
function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain number' };
  }
  
  return { valid: true };
}
```

**Your Task:** Write a prompt to generate comprehensive tests

**Your Prompt:**
```
[Write your test generation request here]
```

### Exercise 2: Test This Async Function

```python
async def fetch_user_profile(user_id: int) -> dict:
    user = await db.get_user(user_id)
    if not user:
        raise UserNotFoundError(f"User {user_id} not found")
    
    posts = await db.get_user_posts(user_id)
    followers = await db.get_user_followers(user_id)
    
    return {
        'user': user,
        'post_count': len(posts),
        'follower_count': len(followers)
    }
```

**Your Task:** Generate tests with mocking

**Your Prompt:**
```
[Write your test generation request here]
```

---

## 🚀 Advanced Testing Patterns

### Pattern: Snapshot Testing

**Prompt:**
```
Generate snapshot tests for this React component:

Component: [name]
What to snapshot: [rendered output, props variations]

Include snapshots for:
- Default state
- All prop combinations
- Different data scenarios

[component code]
```

### Pattern: Property-Based Testing

**Prompt:**
```
Generate property-based tests (using hypothesis/fast-check):

Function: [name]
Properties to test:
- [Property 1: e.g., reversing twice returns original]
- [Property 2: e.g., output always positive]
- [Property 3: e.g., idempotent operation]

[code]
```

### Pattern: Performance Testing

**Prompt:**
```
Generate performance tests for this function:

Benchmarks needed:
- Small input (10 items)
- Medium input (1000 items)
- Large input (100000 items)

Assertions:
- Execution time under X ms
- Memory usage under Y MB
- No memory leaks

[code]
```

---

## ✅ Test Quality Checklist

### Good Tests Are:
- [ ] **Fast** - Run quickly
- [ ] **Independent** - No test depends on another
- [ ] **Repeatable** - Same result every time
- [ ] **Self-validating** - Clear pass/fail
- [ ] **Timely** - Written close to code

### Each Test Should:
- [ ] Have a clear, descriptive name
- [ ] Test one thing
- [ ] Be easy to understand
- [ ] Follow Arrange-Act-Assert
- [ ] Not depend on execution order
- [ ] Clean up after itself

---

## 💡 Pro Tips

**Tip 1: Start with Happy Path**
Get the basic functionality tested first, then add edge cases.

**Tip 2: Test Behavior, Not Implementation**
Test what the code does, not how it does it.

**Tip 3: Keep Tests Simple**
If a test is complex, the code might be too complex.

**Tip 4: Use Descriptive Names**
Test names should explain what's being tested and expected outcome.

**Tip 5: Review Generated Tests**
AI-generated tests are great starting points but review for your specific domain logic.

---

## 🚀 Next Steps

You now have all the core AI-assisted development skills. Let's learn how to build productive daily workflows.

**Next:** [Productivity Fundamentals →](./12-productivity-fundamentals.md)

---

*"Code without tests is broken by design." - Jacob Kaplan-Moss*

*Test first. Test often. Test with confidence.*
