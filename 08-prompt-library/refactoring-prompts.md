# Refactoring Prompts

Expert prompts for code refactoring, improving code quality, and implementing design patterns.

## Table of Contents
- [Code Cleanup](#code-cleanup)
- [Design Patterns](#design-patterns)
- [Architecture Refactoring](#architecture-refactoring)
- [Performance Refactoring](#performance-refactoring)
- [Modernization](#modernization)

---

## Code Cleanup

### 1. Remove Code Duplication
```
Identify and eliminate code duplication:

Code: [paste code with duplications]

Please:
1. Identify all duplicated code blocks
2. Extract common functionality
3. Suggest appropriate abstraction (function/class/module)
4. Provide refactored code
5. Explain benefits and trade-offs
6. Suggest naming conventions
```

**Usage Context**: When you notice repetitive code patterns.

**Example Input**:
```javascript
function getUserByEmail(email) {
  const user = database.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('User not found');
  return user;
}

function getUserById(id) {
  const user = database.query('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) throw new Error('User not found');
  return user;
}
```

**Example Output**:
```javascript
function findUser(field, value) {
  const user = database.query(`SELECT * FROM users WHERE ${field} = ?`, [value]);
  if (!user) throw new Error('User not found');
  return user;
}

// Or better with specific methods
class UserRepository {
  private findBy(field, value) {
    const user = database.query(`SELECT * FROM users WHERE ${field} = ?`, [value]);
    if (!user) throw new Error('User not found');
    return user;
  }
  
  findByEmail(email) { return this.findBy('email', email); }
  findById(id) { return this.findBy('id', id); }
}
```

**Tips for Customization**:
- Specify your preferred abstraction level (function/class/module)
- Mention framework-specific patterns you're using
- Indicate if you prefer functional or OOP approach

---

### 2. Simplify Complex Conditionals
```
Refactor these complex conditionals for readability:

Code: [paste code with complex if/else or switch]

Transform to:
1. Early returns where appropriate
2. Guard clauses
3. Extracted boolean methods
4. Strategy pattern if applicable
5. More readable structure
```

**Usage Context**: When if/else chains or nested conditionals become hard to follow.

**Example Input**:
```python
def calculate_price(item, user):
    if user.is_premium:
        if item.category == 'electronics':
            if item.price > 1000:
                return item.price * 0.85
            else:
                return item.price * 0.90
        else:
            return item.price * 0.95
    else:
        if item.category == 'electronics':
            return item.price * 0.98
        else:
            return item.price
```

**Language Variations**:
- **Java**: Use enums and switch expressions (Java 14+)
- **TypeScript**: Leverage type guards and discriminated unions
- **Go**: Use type switches and early returns

---

### 3. Extract Method/Function
```
This method/function is too long. Help me extract smaller, focused functions:

Code: [paste long function]

Please:
1. Identify distinct responsibilities
2. Extract to separate functions with clear names
3. Determine appropriate parameters
4. Suggest organization (same class/module or separate)
5. Maintain backward compatibility
```

**Usage Context**: When functions exceed 30-50 lines or do multiple things.

**Common Mistakes to Avoid**:
- Creating too many tiny functions (micro-optimization)
- Poor naming of extracted functions
- Breaking cohesion by splitting related logic

---

### 4. Improve Variable Naming
```
Improve variable, function, and class names in this code:

Code: [paste code]

For each rename:
1. Suggest better name
2. Explain why it's better
3. Consider naming conventions for [language/framework]
4. Ensure consistency with surrounding code
```

**Usage Context**: When code has unclear or misleading names.

**Example Input**:
```javascript
function proc(d) {
  let temp = [];
  for (let i = 0; i < d.length; i++) {
    if (d[i].s === 'active') {
      temp.push(d[i]);
    }
  }
  return temp;
}
```

**Example Output**:
```javascript
function filterActiveUsers(users) {
  const activeUsers = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].status === 'active') {
      activeUsers.push(users[i]);
    }
  }
  return activeUsers;
}

// Or more concise
function filterActiveUsers(users) {
  return users.filter(user => user.status === 'active');
}
```

---

### 5. Remove Magic Numbers and Strings
```
Replace magic numbers and strings with named constants:

Code: [paste code]

Please:
1. Identify all magic values
2. Suggest meaningful constant names
3. Determine appropriate scope (local/module/global)
4. Group related constants
5. Follow [language] conventions
```

**Usage Context**: When code contains hardcoded values without explanation.

**Tips for Customization**:
- Specify where constants should live (config file, enum, const)
- Mention if values might become configurable
- Indicate naming convention preference (UPPER_CASE, camelCase)

---

## Design Patterns

### 6. Implement Strategy Pattern
```
Replace conditional logic with Strategy pattern:

Current Code: [paste code with type-based conditionals]
Context: [explain business logic]

Please:
1. Design strategy interface
2. Create concrete strategy implementations
3. Refactor to use strategies
4. Show how to configure/inject strategies
5. Compare before/after complexity
```

**Usage Context**: When you have different algorithms based on type/state.

**Example Input**:
```java
public class PaymentProcessor {
  public void processPayment(String type, double amount) {
    if (type.equals("credit_card")) {
      // credit card logic
    } else if (type.equals("paypal")) {
      // paypal logic
    } else if (type.equals("crypto")) {
      // crypto logic
    }
  }
}
```

---

### 7. Apply Repository Pattern
```
Refactor data access to use Repository pattern:

Current Code: [paste data access code]
Database: [type]
ORM: [if any]

Implement:
1. Repository interface
2. Concrete repository implementation
3. Separate business logic from data access
4. Unit testing approach with mocks
5. Transaction handling
```

**Usage Context**: When database queries are scattered throughout code.

**Language Variations**:
- **C#**: Follow Entity Framework patterns
- **Java**: Spring Data repository patterns
- **Python**: SQLAlchemy or Django ORM patterns

---

### 8. Introduce Factory Pattern
```
Replace complex object creation with Factory:

Current Code: [paste object creation code]
Object Types: [list types being created]

Design:
1. Factory interface/class
2. Creation logic
3. Registration mechanism (if applicable)
4. Dependency injection integration
5. Comparison of approaches
```

**Usage Context**: When object creation logic is complex or varies.

---

### 9. Apply Dependency Injection
```
Refactor hardcoded dependencies to use DI:

Code: [paste code with tight coupling]
Framework: [if using DI framework]

Please:
1. Identify dependencies to inject
2. Design interfaces for dependencies
3. Refactor to constructor/setter injection
4. Show testing improvements
5. Configure DI container (if applicable)
```

**Usage Context**: For improving testability and reducing coupling.

**Tips for Customization**:
- Specify DI framework (Spring, .NET Core, Guice)
- Mention if you prefer constructor vs setter vs interface injection
- Indicate if you need manual DI or framework-based

---

### 10. Implement Observer Pattern
```
Add event-driven communication using Observer pattern:

Scenario: [describe event source and listeners]
Current Code: [paste tightly coupled code]

Implement:
1. Observer interface
2. Subject/Observable class
3. Registration/deregistration
4. Event notification mechanism
5. Thread safety (if needed)
```

**Usage Context**: When components need to react to state changes.

---

## Architecture Refactoring

### 11. Split Monolithic Class
```
This class has too many responsibilities. Help me split it:

Class: [paste large class]

Please:
1. Identify distinct responsibilities (SRP analysis)
2. Suggest how to split into multiple classes
3. Define clear interfaces between classes
4. Maintain existing public API if possible
5. Suggest package/module organization
```

**Usage Context**: When classes violate Single Responsibility Principle.

**Common Mistakes to Avoid**:
- Over-splitting into too many tiny classes
- Breaking encapsulation during split
- Losing cohesion between related functionality

---

### 12. Layer Architecture Cleanup
```
Reorganize code into proper layers:

Current Structure: [describe current organization]
Code: [paste mixed-concern code]

Refactor to:
1. Presentation layer
2. Business logic layer
3. Data access layer
4. Clear layer boundaries and dependencies
5. Dependency direction (top-down)
```

**Usage Context**: When layer boundaries are unclear or violated.

---

### 13. Introduce Service Layer
```
Extract business logic to a Service layer:

Current Code: [paste controller/view code with business logic]

Create:
1. Service interface/class
2. Move business logic to service
3. Keep controllers/views thin
4. Transaction boundaries
5. Error handling strategy
```

**Usage Context**: When controllers/views contain business logic.

---

### 14. Modularize Codebase
```
Break this code into modules/packages:

Code: [paste code]
Current Structure: [describe]

Design:
1. Module boundaries
2. Public APIs for each module
3. Dependencies between modules
4. Module organization
5. Migration path from current state
```

**Usage Context**: For organizing large codebases.

---

## Performance Refactoring

### 15. Optimize Database Queries
```
Optimize these database operations:

Code: [paste code with DB queries]
Database: [type]
Performance Issue: [N+1, missing indexes, etc]

Optimize:
1. Eliminate N+1 queries
2. Add appropriate eager loading
3. Suggest indexes
4. Batch operations
5. Query result comparison (before/after)
```

**Usage Context**: When database operations are slow.

**Example Input**:
```ruby
# N+1 query problem
users = User.all
users.each do |user|
  puts user.posts.count  # Separate query for each user
end
```

**Example Output**:
```ruby
# Optimized with eager loading
users = User.includes(:posts).all
users.each do |user|
  puts user.posts.size  # No additional query
end
```

**Tips for Customization**:
- Include query execution plans
- Mention database type and ORM
- Add performance metrics if available

---

### 16. Reduce Algorithm Complexity
```
Optimize algorithm complexity:

Code: [paste algorithm]
Current Complexity: [if known]
Input Size: [typical and max]

Improve:
1. Analyze current time/space complexity
2. Suggest algorithmic improvements
3. Provide optimized implementation
4. Compare performance characteristics
5. Discuss trade-offs
```

**Usage Context**: When operations are slow due to algorithm efficiency.

---

### 17. Lazy Loading Implementation
```
Implement lazy loading for expensive operations:

Code: [paste eager loading code]
Expensive Operation: [describe what's expensive]

Implement:
1. Lazy initialization
2. Cache loaded results
3. Thread safety (if needed)
4. Clear API for forced loading
5. Memory implications
```

**Usage Context**: When expensive operations happen unnecessarily.

---

## Modernization

### 18. Async/Await Conversion
```
Convert callback/promise code to async/await:

Code: [paste callback hell or promise chains]
Language: [JavaScript/TypeScript/C#/Python/etc]

Refactor:
1. Convert to async/await syntax
2. Improve error handling
3. Maintain same behavior
4. Add proper try/catch
5. Consider concurrent operations
```

**Usage Context**: Modernizing asynchronous code.

**Example Input**:
```javascript
function getUserData(userId) {
  return fetchUser(userId)
    .then(user => fetchPosts(user.id))
    .then(posts => posts.map(post => post.title))
    .catch(error => console.error(error));
}
```

**Example Output**:
```javascript
async function getUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    return posts.map(post => post.title);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

---

### 19. Functional Programming Refactor
```
Refactor to functional programming style:

Code: [paste imperative code]
Language: [JavaScript/Python/Scala/etc]

Transform to:
1. Pure functions
2. Immutable data
3. Higher-order functions
4. Function composition
5. Avoid side effects
```

**Usage Context**: Improving code with functional principles.

---

### 20. Generic/Template Implementation
```
Create generic/template version for type safety and reusability:

Code: [paste type-specific code]
Language: [TypeScript/Java/C#/C++/etc]

Generalize:
1. Identify generic type parameters
2. Create generic implementation
3. Add type constraints if needed
4. Provide usage examples
5. Maintain type safety
```

**Usage Context**: Making code reusable across types.

---

## Advanced Refactoring Template

```
REFACTORING REQUEST:

Current Code:
[paste code]

Context:
- Language/Framework: [details]
- Code Purpose: [what it does]
- Pain Points: [what's wrong]
- Constraints: [limitations]

Goals:
1. [primary goal - readability/performance/testability]
2. [secondary goals]

Preferences:
- Design Patterns: [preferred patterns]
- Style: [functional/OOP/mixed]
- Breaking Changes: [acceptable/not acceptable]

Please Provide:
1. Analysis of current issues
2. Refactoring strategy
3. Step-by-step transformation
4. Refactored code
5. Benefits and trade-offs
6. Testing approach
7. Migration path (if breaking changes)
```

## Best Practices for Refactoring Prompts

1. **Start Small**: Request incremental refactorings rather than complete rewrites
2. **Specify Constraints**: Mention if you can't break existing APIs
3. **Request Comparisons**: Ask for before/after complexity analysis
4. **Include Tests**: Share existing tests to ensure behavior preservation
5. **State Preferences**: Mention preferred patterns, style guides
6. **Consider Context**: Production code needs different approach than prototypes
7. **Ask for Steps**: Request migration path for large refactorings
8. **Backward Compatibility**: Specify if you need to maintain existing interfaces

## Refactoring Anti-Patterns to Avoid

1. Refactoring without tests
2. Changing behavior while refactoring
3. Over-engineering simple solutions
4. Premature optimization
5. Breaking encapsulation for convenience
6. Creating unnecessary abstractions
7. Ignoring language/framework idioms
