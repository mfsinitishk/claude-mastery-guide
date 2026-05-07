# AI-Assisted Coding Basics

## From Idea to Implementation with AI

---

## 🎯 Overview

AI-assisted coding transforms how you write software. Instead of typing every line manually, you describe what you need and Claude generates high-quality code. This section teaches you how to effectively use Claude for code generation across common development tasks.

**Time to Master:** 4-6 hours of hands-on practice  
**Outcome:** Confidently generate, understand, and modify AI-generated code

---

## 💡 The AI-Assisted Coding Workflow

### Traditional vs. AI-Assisted

**Traditional Coding:**
```
Idea → Research → Design → Type Code → Debug → Refactor
(2-4 hours for a moderate function)
```

**AI-Assisted Coding:**
```
Idea → Describe to AI → Review & Refine → Test → Integrate
(15-30 minutes for the same function)
```

### The Core Loop

```
1. Describe what you need
   ↓
2. Get AI-generated code
   ↓
3. Review and understand it
   ↓
4. Test it
   ↓
5. Refine if needed (iterate)
   ↓
6. Integrate into your codebase
```

---

## 🔧 Code Generation Patterns

### Pattern 1: Function Generation

**Basic Structure:**
```
Create a {language} function that {purpose}.

Inputs: {parameters}
Outputs: {return value}
Requirements: {constraints}

Include {additional items}
```

**Example Request:**
```
Create a Python function that validates email addresses.

Inputs: email string
Outputs: boolean (True if valid, False otherwise)
Requirements:
- Check format (user@domain.com)
- Allow plus signs in local part (user+tag@domain.com)
- Reject obviously invalid patterns
- No external dependencies

Include:
- Type hints
- Docstring with examples
- Handle edge cases (None, empty string)
```

**Expected Output:**
```python
def validate_email(email: str | None) -> bool:
    """
    Validates email address format.
    
    Args:
        email: Email address to validate
    
    Returns:
        True if email is valid, False otherwise
    
    Examples:
        >>> validate_email("user@example.com")
        True
        >>> validate_email("user+tag@example.com")
        True
        >>> validate_email("invalid.email")
        False
        >>> validate_email(None)
        False
    """
    if not email:
        return False
    
    import re
    # Pattern allows: alphanumeric, dots, plus, and hyphens in local part
    # Requires @ symbol
    # Domain must have at least one dot and valid TLD
    pattern = r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    return bool(re.match(pattern, email))
```

### Pattern 2: Class Generation

**Request:**
```
Create a TypeScript class for managing a shopping cart.

Features:
- Add items (with ID, name, price, quantity)
- Remove items
- Update quantity
- Calculate total
- Clear cart

Requirements:
- Type-safe
- Immutable operations (return new cart)
- Handle edge cases
- Include JSDoc

Return type: {items: CartItem[], total: number}
```

**Output:**
```typescript
/**
 * Represents an item in the shopping cart
 */
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Shopping cart manager with immutable operations
 */
class ShoppingCart {
  private items: Map<string, CartItem>;

  constructor(items: CartItem[] = []) {
    this.items = new Map(items.map(item => [item.id, item]));
  }

  /**
   * Adds an item to the cart or updates quantity if it exists
   */
  addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }): ShoppingCart {
    const newItems = new Map(this.items);
    const existing = newItems.get(item.id);
    
    if (existing) {
      newItems.set(item.id, {
        ...existing,
        quantity: existing.quantity + (item.quantity || 1)
      });
    } else {
      newItems.set(item.id, {
        ...item,
        quantity: item.quantity || 1
      });
    }
    
    return new ShoppingCart(Array.from(newItems.values()));
  }

  /**
   * Removes an item from the cart
   */
  removeItem(itemId: string): ShoppingCart {
    const newItems = new Map(this.items);
    newItems.delete(itemId);
    return new ShoppingCart(Array.from(newItems.values()));
  }

  /**
   * Updates the quantity of an item
   */
  updateQuantity(itemId: string, quantity: number): ShoppingCart {
    if (quantity <= 0) {
      return this.removeItem(itemId);
    }
    
    const newItems = new Map(this.items);
    const item = newItems.get(itemId);
    
    if (item) {
      newItems.set(itemId, { ...item, quantity });
    }
    
    return new ShoppingCart(Array.from(newItems.values()));
  }

  /**
   * Calculates the total price of all items in cart
   */
  getTotal(): number {
    return Array.from(this.items.values())
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  /**
   * Returns all items in the cart
   */
  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Clears all items from the cart
   */
  clear(): ShoppingCart {
    return new ShoppingCart([]);
  }

  /**
   * Returns cart summary
   */
  getSummary() {
    return {
      items: this.getItems(),
      total: this.getTotal()
    };
  }
}

// Usage example
const cart = new ShoppingCart();
const withItem = cart.addItem({ id: '1', name: 'Widget', price: 19.99 });
const updated = withItem.updateQuantity('1', 3);
console.log(updated.getSummary());
```

### Pattern 3: API Endpoint

**Request:**
```
Create an Express.js POST endpoint for user registration.

Route: /api/auth/register
Input (body):
- email: string
- password: string
- name: string

Process:
1. Validate input
2. Hash password (bcrypt)
3. Check if user exists
4. Save to database
5. Return JWT token

Include:
- TypeScript types
- Error handling
- Input validation
- Status codes
- Comments
```

**Output:**
```typescript
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './models/User';

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

/**
 * User registration endpoint
 * POST /api/auth/register
 */
router.post('/api/auth/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields: email, password, and name are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '7d' }
    );

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Internal server error during registration'
    });
  }
});
```

### Pattern 4: Algorithm Implementation

**Request:**
```
Implement the QuickSort algorithm in JavaScript.

Requirements:
- In-place sorting (no extra arrays)
- Handle duplicates correctly
- Ascending order
- Work with numbers
- Include comments explaining the algorithm
- Add example usage
- Time/space complexity in comments
```

**Output:**
```javascript
/**
 * QuickSort implementation (in-place)
 * 
 * Time Complexity:
 * - Average: O(n log n)
 * - Worst: O(n²) - when array is already sorted
 * 
 * Space Complexity: O(log n) - due to recursion stack
 * 
 * @param {number[]} arr - Array to sort
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Partition the array and get pivot index
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after partition
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

/**
 * Partitions the array around a pivot
 * Elements smaller than pivot go left, larger go right
 * 
 * @param {number[]} arr - Array to partition
 * @param {number} low - Starting index
 * @param {number} high - Ending index
 * @returns {number} Final pivot position
 */
function partition(arr, low, high) {
  // Choose rightmost element as pivot
  const pivot = arr[high];
  
  // Index of smaller element
  let i = low - 1;
  
  // Rearrange array: move elements smaller than pivot to left
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place pivot in its correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
  return i + 1;
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90, 88];
console.log('Original:', numbers);

quickSort(numbers);
console.log('Sorted:', numbers);
// Output: [11, 12, 22, 25, 34, 64, 88, 90]

// Works with duplicates
const withDuplicates = [5, 2, 8, 2, 9, 1, 5, 5];
quickSort(withDuplicates);
console.log('With duplicates:', withDuplicates);
// Output: [1, 2, 2, 5, 5, 5, 8, 9]
```

### Pattern 5: Data Structure

**Request:**
```
Create a generic Stack data structure in Java.

Operations:
- push(item)
- pop()
- peek()
- isEmpty()
- size()

Requirements:
- Generic type parameter
- Handle empty stack appropriately
- Include JavaDoc
- Thread-safe not required
- Example usage in main method
```

**Output:**
```java
import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;

/**
 * Generic Stack implementation using ArrayList
 * 
 * @param <T> The type of elements in the stack
 */
public class Stack<T> {
    private final List<T> items;
    
    /**
     * Creates an empty stack
     */
    public Stack() {
        this.items = new ArrayList<>();
    }
    
    /**
     * Pushes an item onto the top of the stack
     * 
     * @param item The item to push
     * @throws IllegalArgumentException if item is null
     */
    public void push(T item) {
        if (item == null) {
            throw new IllegalArgumentException("Cannot push null item");
        }
        items.add(item);
    }
    
    /**
     * Removes and returns the top item from the stack
     * 
     * @return The top item
     * @throws EmptyStackException if stack is empty
     */
    public T pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return items.remove(items.size() - 1);
    }
    
    /**
     * Returns the top item without removing it
     * 
     * @return The top item
     * @throws EmptyStackException if stack is empty
     */
    public T peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return items.get(items.size() - 1);
    }
    
    /**
     * Checks if the stack is empty
     * 
     * @return true if empty, false otherwise
     */
    public boolean isEmpty() {
        return items.isEmpty();
    }
    
    /**
     * Returns the number of items in the stack
     * 
     * @return The stack size
     */
    public int size() {
        return items.size();
    }
    
    /**
     * Example usage
     */
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        
        // Push items
        stack.push("First");
        stack.push("Second");
        stack.push("Third");
        
        System.out.println("Size: " + stack.size()); // 3
        System.out.println("Peek: " + stack.peek()); // "Third"
        
        // Pop items
        System.out.println("Pop: " + stack.pop()); // "Third"
        System.out.println("Pop: " + stack.pop()); // "Second"
        
        System.out.println("Size: " + stack.size()); // 1
        System.out.println("Empty: " + stack.isEmpty()); // false
        
        stack.pop(); // "First"
        System.out.println("Empty: " + stack.isEmpty()); // true
        
        // This would throw EmptyStackException
        // stack.pop();
    }
}
```

---

## 🎯 Common Coding Tasks

### Task 1: Data Parsing

**Request:**
```
Write a Python function to parse CSV data into a list of dictionaries.

Handle:
- Header row as keys
- Empty values (convert to None)
- Type conversion (numbers as int/float)
- Quoted values with commas
- Comments (lines starting with #)

Example input:
name,age,email
John,30,john@example.com
Jane,25,jane@example.com
```

### Task 2: API Client

**Request:**
```
Create a TypeScript class for making HTTP requests to a REST API.

Features:
- GET, POST, PUT, DELETE methods
- Automatic JSON parsing
- Error handling
- Base URL configuration
- Headers management
- Timeout support

Use native fetch API
```

### Task 3: Form Validation

**Request:**
```
Create a React hook for form validation.

Support:
- Multiple fields
- Custom validation rules
- Async validation (e.g., email uniqueness)
- Error messages
- Touch/blur validation
- Submit handling

Return: values, errors, handleChange, handleSubmit, isValid
```

### Task 4: Database Query

**Request:**
```
Write a SQL query to find top 10 customers by total purchase amount.

Tables:
- customers (id, name, email)
- orders (id, customer_id, total, created_at)

Requirements:
- Join tables
- Sum order totals per customer
- Sort descending
- Include customer details
- Only last 12 months
```

### Task 5: File I/O

**Request:**
```
Create a Go function to read a JSON file and unmarshal into a struct.

Handle:
- File not found
- Invalid JSON
- Missing fields
- Type mismatches

Return error if any issues, struct if successful
```

---

## ✅ Code Review Best Practices

### Always Review AI-Generated Code

**Check For:**

1. **Correctness**
   - Does it do what you asked?
   - Are edge cases handled?
   - Logic errors?

2. **Security**
   - SQL injection vulnerabilities?
   - XSS vulnerabilities?
   - Insecure dependencies?
   - Hard-coded secrets?

3. **Performance**
   - Inefficient algorithms?
   - Memory leaks?
   - Unnecessary loops?
   - Database N+1 queries?

4. **Style**
   - Matches your codebase style?
   - Naming conventions?
   - Code organization?
   - Comments helpful?

5. **Dependencies**
   - Are imported libraries appropriate?
   - Are they up-to-date?
   - Are they necessary?

### Testing AI-Generated Code

**Minimum Testing:**
```
1. Happy path - normal usage
2. Edge cases - boundaries
3. Error cases - invalid input
4. Integration - with existing code
```

**Example Test Plan:**
```
For email validation function:
✓ Valid email: "user@example.com"
✓ Valid with plus: "user+tag@example.com"
✓ Invalid: "invalid", "@example.com", "user@"
✓ Edge: null, undefined, empty string
✓ Special: Unicode characters
```

---

## 🚀 Advanced Code Generation

### Technique 1: Incremental Development

**Instead of:**
```
"Build a complete user authentication system"
```

**Do This:**
```
Step 1: "Create a user model with email and password"
Step 2: "Add password hashing to the model"
Step 3: "Create registration endpoint"
Step 4: "Create login endpoint"
Step 5: "Add JWT token generation"
```

### Technique 2: Specify Patterns

```
"Create a user service following the Repository pattern:

1. IUserRepository interface
2. UserRepository implementation
3. UserService that uses the repository
4. Dependency injection setup

Use TypeScript and include interfaces for all types"
```

### Technique 3: Provide Examples

```
"Create a function similar to this pattern:

function fetchUser(id) {
  return api.get(`/users/${id}`)
    .then(response => response.data)
    .catch(handleError);
}

But for products, with additional filtering by category"
```

### Technique 4: Request Variations

```
"Show me 3 ways to implement caching for API requests:
1. In-memory Map
2. localStorage
3. Redis

Compare pros/cons and recommend which to use"
```

---

## 📚 Language-Specific Tips

### Python
- Request type hints
- Ask for docstrings
- Specify Python version
- Mention async/await if needed

### JavaScript/TypeScript
- Specify TypeScript for types
- Request ESLint compliance
- Ask for JSDoc
- Mention modern ES features

### Java
- Request JavaDoc
- Specify Java version
- Ask for interface-based design
- Mention design patterns

### Go
- Request idiomatic Go
- Ask for error handling
- Mention goroutines if needed
- Request interface definitions

### C#
- Request XML documentation
- Specify .NET version
- Ask for LINQ usage
- Mention async/await

---

## ✅ Quick Reference

### Effective Code Generation Formula

```
{Action} a {Language} {Type} that {Purpose}

Requirements:
- {Requirement 1}
- {Requirement 2}

Include:
- {Documentation type}
- {Testing approach}
- {Example usage}

Constraints:
- {Constraint 1}
- {Constraint 2}
```

### Common Pitfalls to Avoid

❌ Vague requirements  
❌ No testing  
❌ Blindly copying code  
❌ Ignoring security  
❌ No error handling  
❌ Outdated patterns  
❌ Not reviewing output  

✅ Specific requirements  
✅ Thorough testing  
✅ Understanding code  
✅ Security review  
✅ Comprehensive error handling  
✅ Modern best practices  
✅ Careful code review  

---

## 🎓 Practice Exercises

Complete these exercises to reinforce learning:

**Exercise 1:** Generate a function to reverse a linked list (language of choice)

**Exercise 2:** Create a RESTful API endpoint for creating a blog post

**Exercise 3:** Implement a binary search algorithm with comments

**Exercise 4:** Generate a React component for a login form with validation

**Exercise 5:** Create a database migration script for adding a new table

For each:
- Write the prompt
- Review the generated code
- Test it
- Identify any issues
- Refine if needed

---

## 🚀 Next Steps

You now know how to generate code with AI. Next, learn how to use AI to understand existing code.

**Next:** [Code Explanation and Understanding →](./07-code-explanation.md)

---

*"AI writes the code. You provide the wisdom."*

*Generate fast, review carefully, integrate thoughtfully.*
