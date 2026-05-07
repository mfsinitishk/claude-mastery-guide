# Refactoring Workflows

## Transforming Messy Code into Maintainable Software

---

## 🎯 Overview

Refactoring is the art of improving code structure without changing its behavior. With Claude as your refactoring partner, you can transform complex, messy code into clean, maintainable software in minutes instead of hours.

**Time to Master:** 4-5 hours of practice  
**Outcome:** Systematically improve code quality using AI-assisted refactoring techniques

---

## 💡 What is Refactoring?

### Definition

**Refactoring:** Restructuring existing code to improve its internal structure while preserving its external behavior.

**Key Principle:** Change HOW code works internally, not WHAT it does externally.

### Why Refactor?

**Improve Readability**
```
Before: 2 hours to understand a function
After: 10 minutes to understand a function
```

**Reduce Complexity**
```
Before: 200-line function with 5 nested loops
After: 5 small functions, each doing one thing
```

**Eliminate Duplication**
```
Before: Same logic copied 7 times
After: One reusable function
```

**Prevent Bugs**
```
Before: Complex code = more bugs
After: Simple code = fewer bugs
```

**Enable Change**
```
Before: Fear to touch code
After: Confident to modify
```

---

## 🔧 AI-Assisted Refactoring Workflow

### The Process

```
1. Identify code smell
   ↓
2. Describe desired improvement to Claude
   ↓
3. Review refactored code
   ↓
4. Verify behavior unchanged
   ↓
5. Test thoroughly
   ↓
6. Commit with clear message
```

### Safety First

**Always Before Refactoring:**
- ✅ Have tests (or write them first)
- ✅ Commit working code
- ✅ Understand current behavior
- ✅ Have rollback plan

**Never:**
- ❌ Refactor without tests
- ❌ Change behavior during refactoring
- ❌ Refactor and add features together
- ❌ Refactor without version control

---

## 🎨 Common Refactoring Patterns

### Pattern 1: Extract Function

**Code Smell:** Long method doing multiple things

**Before:**
```python
def process_order(order_data):
    # Validate
    if not order_data.get('email'):
        raise ValueError("Email required")
    if not order_data.get('items'):
        raise ValueError("Items required")
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', order_data['email']):
        raise ValueError("Invalid email")
    
    # Calculate total
    total = 0
    for item in order_data['items']:
        total += item['price'] * item['quantity']
    
    # Apply discount
    if total > 100:
        total *= 0.9
    
    # Save to database
    order = Order(
        email=order_data['email'],
        items=order_data['items'],
        total=total,
        created_at=datetime.now()
    )
    db.session.add(order)
    db.session.commit()
    
    # Send email
    msg = f"Order confirmed. Total: ${total}"
    send_email(order_data['email'], "Order Confirmation", msg)
    
    return order
```

**Prompt:**
```
Refactor this function using the Extract Function technique:
- Break into smaller, single-purpose functions
- Each function should do one thing well
- Use descriptive names
- Maintain the same external behavior
- Include docstrings

[code above]
```

**After:**
```python
def validate_order_data(order_data: dict) -> None:
    """Validates order data has required fields with correct format."""
    if not order_data.get('email'):
        raise ValueError("Email required")
    if not order_data.get('items'):
        raise ValueError("Items required")
    
    email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_pattern, order_data['email']):
        raise ValueError("Invalid email")

def calculate_order_total(items: list) -> float:
    """Calculates total price from order items."""
    return sum(item['price'] * item['quantity'] for item in items)

def apply_discount(total: float) -> float:
    """Applies 10% discount for orders over $100."""
    return total * 0.9 if total > 100 else total

def save_order(email: str, items: list, total: float) -> Order:
    """Persists order to database."""
    order = Order(
        email=email,
        items=items,
        total=total,
        created_at=datetime.now()
    )
    db.session.add(order)
    db.session.commit()
    return order

def send_order_confirmation(email: str, total: float) -> None:
    """Sends order confirmation email to customer."""
    message = f"Order confirmed. Total: ${total:.2f}"
    send_email(email, "Order Confirmation", message)

def process_order(order_data: dict) -> Order:
    """
    Processes a customer order from validation through confirmation.
    
    Args:
        order_data: Dictionary containing email and items
        
    Returns:
        Created Order object
        
    Raises:
        ValueError: If order data is invalid
    """
    validate_order_data(order_data)
    
    total = calculate_order_total(order_data['items'])
    total = apply_discount(total)
    
    order = save_order(order_data['email'], order_data['items'], total)
    send_order_confirmation(order_data['email'], total)
    
    return order
```

**Benefits:**
- ✅ Each function has clear purpose
- ✅ Easy to test individually
- ✅ Easy to reuse components
- ✅ Main function reads like documentation
- ✅ Easy to modify one aspect

### Pattern 2: Simplify Conditionals

**Code Smell:** Complex nested if-else statements

**Before:**
```javascript
function getUserDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.orderCount > 10) {
        return 0.25;
      } else {
        return 0.15;
      }
    } else {
      if (user.orderCount > 20) {
        return 0.10;
      } else {
        if (user.orderCount > 5) {
          return 0.05;
        } else {
          return 0;
        }
      }
    }
  } else {
    return 0;
  }
}
```

**Prompt:**
```
Refactor these nested conditionals to improve readability:
- Reduce nesting depth
- Use early returns
- Make logic clearer
- Consider extracting conditions to named variables

[code above]
```

**After:**
```javascript
function getUserDiscount(user) {
  // Guard clause: no user = no discount
  if (!user) return 0;
  
  // Premium users
  if (user.isPremium) {
    return user.orderCount > 10 ? 0.25 : 0.15;
  }
  
  // Regular users
  if (user.orderCount > 20) return 0.10;
  if (user.orderCount > 5) return 0.05;
  return 0;
}

// Even better: Extract to clear rules
function getUserDiscount(user) {
  if (!user) return 0;
  
  const isFrequentPremium = user.isPremium && user.orderCount > 10;
  const isPremium = user.isPremium;
  const isLoyalCustomer = user.orderCount > 20;
  const isRegularCustomer = user.orderCount > 5;
  
  if (isFrequentPremium) return 0.25;
  if (isPremium) return 0.15;
  if (isLoyalCustomer) return 0.10;
  if (isRegularCustomer) return 0.05;
  return 0;
}
```

### Pattern 3: Remove Duplication

**Code Smell:** Similar code repeated multiple times

**Before:**
```java
public class UserService {
    public User createUser(String email, String name) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        // ... create user
    }
    
    public User updateUser(Long id, String email, String name) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        // ... update user
    }
    
    public Post createPost(String title, String content) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Content is required");
        }
        // ... create post
    }
}
```

**Prompt:**
```
Remove duplication from this code:
- Extract common validation logic
- Create reusable helper methods
- Maintain all validation rules
- Preserve error messages

[code above]
```

**After:**
```java
public class UserService {
    private void validateRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
    }
    
    private void validateUserFields(String email, String name) {
        validateRequired(email, "Email");
        validateRequired(name, "Name");
    }
    
    public User createUser(String email, String name) {
        validateUserFields(email, name);
        // ... create user
    }
    
    public User updateUser(Long id, String email, String name) {
        validateUserFields(email, name);
        // ... update user
    }
    
    public Post createPost(String title, String content) {
        validateRequired(title, "Title");
        validateRequired(content, "Content");
        // ... create post
    }
}
```

### Pattern 4: Improve Naming

**Code Smell:** Unclear, cryptic, or misleading names

**Before:**
```typescript
function calc(d: any, t: number): number {
  let r = d.p * d.q;
  if (t === 1) {
    r = r * 0.9;
  } else if (t === 2) {
    r = r * 0.85;
  }
  return r + d.s;
}
```

**Prompt:**
```
Improve naming in this code:
- Use descriptive variable names
- Use clear function names
- Add types
- Make purpose obvious from names alone

[code above]
```

**After:**
```typescript
interface OrderDetails {
  price: number;
  quantity: number;
  shippingCost: number;
}

enum CustomerType {
  REGULAR = 0,
  PREMIUM = 1,
  VIP = 2
}

function calculateOrderTotal(
  order: OrderDetails, 
  customerType: CustomerType
): number {
  let subtotal = order.price * order.quantity;
  
  // Apply customer discount
  const discount = getCustomerDiscount(customerType);
  subtotal = subtotal * (1 - discount);
  
  return subtotal + order.shippingCost;
}

function getCustomerDiscount(customerType: CustomerType): number {
  switch (customerType) {
    case CustomerType.PREMIUM: return 0.10;
    case CustomerType.VIP: return 0.15;
    default: return 0;
  }
}
```

### Pattern 5: Extract Class

**Code Smell:** Class doing too many things

**Before:**
```python
class Order:
    def __init__(self, items):
        self.items = items
        self.customer_email = None
        self.shipping_address = None
        self.payment_method = None
    
    def calculate_total(self):
        return sum(item['price'] * item['quantity'] for item in self.items)
    
    def validate_email(self):
        return '@' in self.customer_email
    
    def format_address(self):
        return f"{self.shipping_address['street']}, {self.shipping_address['city']}"
    
    def charge_payment(self):
        # Payment processing logic
        pass
    
    def send_confirmation(self):
        # Email sending logic
        pass
```

**Prompt:**
```
This class has too many responsibilities. Refactor using Extract Class:
- Separate concerns (order, customer, shipping, payment)
- Create focused classes
- Maintain relationships
- Follow single responsibility principle

[code above]
```

**After:**
```python
class Customer:
    def __init__(self, email: str):
        self.email = email
    
    def validate_email(self) -> bool:
        return '@' in self.email and '.' in self.email

class Address:
    def __init__(self, street: str, city: str, state: str, zip_code: str):
        self.street = street
        self.city = city
        self.state = state
        self.zip_code = zip_code
    
    def format(self) -> str:
        return f"{self.street}, {self.city}, {self.state} {self.zip_code}"

class PaymentProcessor:
    def __init__(self, payment_method: str):
        self.payment_method = payment_method
    
    def charge(self, amount: float) -> bool:
        # Payment processing logic
        pass

class EmailService:
    @staticmethod
    def send_confirmation(email: str, order_id: str):
        # Email sending logic
        pass

class Order:
    def __init__(
        self, 
        items: list,
        customer: Customer,
        shipping_address: Address,
        payment_processor: PaymentProcessor
    ):
        self.items = items
        self.customer = customer
        self.shipping_address = shipping_address
        self.payment_processor = payment_processor
        self.order_id = None
    
    def calculate_total(self) -> float:
        return sum(item['price'] * item['quantity'] for item in self.items)
    
    def process(self) -> bool:
        if not self.customer.validate_email():
            return False
        
        total = self.calculate_total()
        if not self.payment_processor.charge(total):
            return False
        
        EmailService.send_confirmation(self.customer.email, self.order_id)
        return True
```

---

## 🔍 Identifying Code Smells

### Smell 1: Long Method

**Indicators:**
- Function over 20-30 lines
- Multiple levels of abstraction
- Many comments explaining sections
- Hard to name concisely

**Prompt:**
```
This function is too long. Break it into smaller functions:
- Identify logical sections
- Extract each section to named function
- Main function should read like high-level steps

[long method]
```

### Smell 2: Large Class

**Indicators:**
- Class over 200-300 lines
- Many unrelated methods
- Hard to summarize class purpose
- Many private methods

**Prompt:**
```
This class is too large. Identify separate responsibilities:
- List distinct concerns
- Suggest how to split into multiple classes
- Show new class structure
- Preserve functionality

[large class]
```

### Smell 3: Primitive Obsession

**Indicators:**
- Using primitives instead of small objects
- Phone number as string
- Money as float
- Address as multiple strings

**Before:**
```typescript
function sendInvoice(
  email: string,
  amount: number,
  street: string,
  city: string,
  zip: string
) { }
```

**Prompt:**
```
Replace primitives with value objects:
- Create Email, Money, Address classes
- Add validation to constructors
- Update function signature

[code above]
```

**After:**
```typescript
class Email {
  constructor(private value: string) {
    if (!value.includes('@')) throw new Error('Invalid email');
  }
  toString() { return this.value; }
}

class Money {
  constructor(private cents: number) {
    if (cents < 0) throw new Error('Negative amount');
  }
  toDollars() { return this.cents / 100; }
}

class Address {
  constructor(
    private street: string,
    private city: string,
    private zip: string
  ) {
    if (!zip.match(/^\d{5}$/)) throw new Error('Invalid ZIP');
  }
  format() { return `${this.street}, ${this.city} ${this.zip}`; }
}

function sendInvoice(
  email: Email,
  amount: Money,
  address: Address
) { }
```

### Smell 4: Comments Everywhere

**Indicator:** Excessive comments explaining what code does

**Before:**
```python
# Calculate the total price
total = 0
# Loop through all items
for item in items:
    # Multiply price by quantity
    total += item.price * item.quantity

# Apply 10% discount
total = total * 0.9

# Return the total
return total
```

**Prompt:**
```
Remove unnecessary comments by making code self-explanatory:
- Use descriptive names
- Extract to functions with clear names
- Keep only "why" comments, not "what"

[code above]
```

**After:**
```python
def calculate_discounted_total(items: list[Item]) -> float:
    BULK_DISCOUNT = 0.9
    subtotal = sum(item.price * item.quantity for item in items)
    return subtotal * BULK_DISCOUNT
```

### Smell 5: Feature Envy

**Indicator:** Method uses another class's data more than its own

**Before:**
```java
class OrderReport {
    public void printReport(Order order) {
        System.out.println("Customer: " + order.getCustomer().getName());
        System.out.println("Email: " + order.getCustomer().getEmail());
        System.out.println("Items: " + order.getItems().size());
        System.out.println("Total: $" + order.getTotal());
    }
}
```

**Prompt:**
```
This method is too interested in Order's internals. Refactor:
- Move logic closer to the data
- Follow "Tell, Don't Ask" principle
- Reduce coupling

[code above]
```

**After:**
```java
class Order {
    public String generateReport() {
        return String.format(
            "Customer: %s\nEmail: %s\nItems: %d\nTotal: $%.2f",
            customer.getName(),
            customer.getEmail(),
            items.size(),
            getTotal()
        );
    }
}

class OrderReport {
    public void printReport(Order order) {
        System.out.println(order.generateReport());
    }
}
```

---

## 📋 Refactoring Prompt Templates

### Template 1: General Refactoring

```
Refactor this code to improve:
- [Aspect 1: e.g., readability]
- [Aspect 2: e.g., maintainability]
- [Aspect 3: e.g., performance]

Requirements:
- Preserve exact functionality
- Maintain all edge case handling
- Keep or improve test coverage
- Follow [language/framework] best practices

Show:
- Before/after comparison
- Explanation of each change
- Why each change improves the code

[code]
```

### Template 2: Specific Pattern

```
Apply the [Pattern Name] refactoring to this code:

Pattern: [Brief description]
Goal: [What you want to achieve]

Requirements:
- [Requirement 1]
- [Requirement 2]

[code]
```

### Template 3: Code Smell Fix

```
This code has [Code Smell Name]:
[Description of the smell]

Fix by:
- [Approach 1]
- [Approach 2]

Ensure:
- Same behavior
- Better structure
- Easier to test

[code]
```

---

## ✅ Refactoring Checklist

### Before Refactoring
- [ ] Code is under version control
- [ ] All tests pass
- [ ] Understand current behavior
- [ ] Identify code smell
- [ ] Know desired outcome

### During Refactoring
- [ ] Make small changes
- [ ] Run tests after each change
- [ ] Commit frequently
- [ ] Don't add features
- [ ] Don't fix bugs (note them separately)

### After Refactoring
- [ ] All tests still pass
- [ ] Behavior unchanged
- [ ] Code is clearer
- [ ] Complexity reduced
- [ ] No new warnings/errors
- [ ] Documentation updated if needed

---

## 🎓 Practice Exercises

### Exercise 1: Refactor This God Class

```python
class UserManager:
    def __init__(self):
        self.users = []
        self.db = Database()
        self.mailer = EmailService()
    
    def create_user(self, email, password, name):
        if not email or '@' not in email:
            raise ValueError("Invalid email")
        if len(password) < 8:
            raise ValueError("Password too short")
        
        hashed = hashlib.sha256(password.encode()).hexdigest()
        user = {'email': email, 'password': hashed, 'name': name}
        self.users.append(user)
        self.db.save('users', user)
        
        msg = f"Welcome {name}! Your account is ready."
        self.mailer.send(email, "Welcome", msg)
        
        return user
    
    def login(self, email, password):
        hashed = hashlib.sha256(password.encode()).hexdigest()
        for user in self.users:
            if user['email'] == email and user['password'] == hashed:
                token = jwt.encode({'email': email}, 'secret')
                return token
        return None
```

**Your Task:** Write a refactoring prompt

**Your Prompt:**
```
[Write your refactoring request here]
```

### Exercise 2: Simplify This Logic

```javascript
function calculatePrice(product, user, coupon) {
  let price = product.basePrice;
  
  if (product.category === 'electronics') {
    if (product.brand === 'premium') {
      price = price * 1.2;
    }
  }
  
  if (user.isPremium) {
    price = price * 0.9;
  } else {
    if (user.orderCount > 10) {
      price = price * 0.95;
    }
  }
  
  if (coupon) {
    if (coupon.type === 'percent') {
      price = price * (1 - coupon.value / 100);
    } else {
      price = price - coupon.value;
    }
  }
  
  return price;
}
```

**Your Task:** Write a refactoring prompt

**Your Prompt:**
```
[Write your refactoring request here]
```

---

## 🚀 Real-World Refactoring Scenarios

### Scenario 1: Legacy API Endpoint

**Found in production:**
```php
<?php
function api_get_user_data() {
    $id = $_GET['id'];
    $conn = mysqli_connect("localhost", "root", "password", "db");
    $result = mysqli_query($conn, "SELECT * FROM users WHERE id = $id");
    $user = mysqli_fetch_assoc($result);
    echo json_encode($user);
    mysqli_close($conn);
}
```

**Issues:**
- SQL injection vulnerability
- Hard-coded credentials
- No error handling
- Direct database access in API
- Mixing concerns

**Refactoring Prompt:**
```
Refactor this legacy PHP API endpoint to modern standards:
- Fix SQL injection vulnerability
- Add proper error handling
- Separate concerns (database, API, validation)
- Use environment variables for config
- Add input validation
- Return proper HTTP status codes
- Follow REST best practices

Show a complete, production-ready implementation.
```

### Scenario 2: Frontend Component

**React component that grew:**
```typescript
function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name');
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);
  
  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );
  
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'email') return a.email.localeCompare(b.email);
    return 0;
  });
  
  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <select value={sort} onChange={e => setSort(e.target.value)}>
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {sorted.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

**Refactoring Prompt:**
```
Refactor this React component:
- Extract custom hooks (useUsers, useFilter, useSort)
- Extract child components (UserList, FilterBar, UserCard)
- Improve data fetching (loading/error states)
- Add TypeScript types
- Follow React best practices
- Make it more testable

Show the refactored component structure.
```

---

## 💡 Pro Tips

**Tip 1: Refactor in Small Steps**
Don't try to fix everything at once. One smell at a time.

**Tip 2: Tests Are Your Safety Net**
Write tests before refactoring if they don't exist.

**Tip 3: Use Git Wisely**
Commit after each small refactoring. Easy to rollback if needed.

**Tip 4: Review Before Committing**
Even AI-refactored code needs human review.

**Tip 5: Know When to Stop**
Perfect is the enemy of done. Good enough is often good enough.

---

## 🚀 Next Steps

Now that you can refactor code effectively, let's learn how to debug issues systematically.

**Next:** [Debugging Workflows →](./09-debugging-workflows.md)

---

*"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler*

*Refactor relentlessly. Your future self will thank you.*
