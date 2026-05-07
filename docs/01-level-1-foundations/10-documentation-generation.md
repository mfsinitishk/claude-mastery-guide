# Documentation Generation

## From Code to Clear Documentation with AI

---

## 🎯 Overview

Good documentation is critical but often neglected. Claude can generate comprehensive, accurate documentation from your code, making documentation creation fast and maintaining it painless.

**Time to Master:** 3-4 hours of practice  
**Outcome:** Generate and maintain high-quality documentation effortlessly

---

## 💡 Why Documentation Matters

### The Documentation Problem

**Common Excuses:**
- "I don't have time"
- "The code is self-documenting"
- "I'll document it later" (never happens)
- "Documentation gets outdated anyway"

**Reality:**
- Future you won't remember
- Teammates can't read your mind
- Users need guidance
- Onboarding takes forever without docs

### The AI Solution

**Traditional:** 2-4 hours to document a module  
**AI-Assisted:** 15-30 minutes for better results

**Traditional:** Docs get outdated  
**AI-Assisted:** Regenerate docs in seconds when code changes

---

## 📚 Types of Documentation

### 1. README Files
Project overview, setup, and usage

### 2. Code Comments
Inline explanation of complex logic

### 3. API Documentation
Endpoint descriptions, parameters, responses

### 4. Function/Method Documentation
Docstrings, JSDoc, JavaDoc

### 5. Architecture Documentation
System design, data flow, decisions

### 6. User Guides
How to use the software

---

## 🔧 Documentation Prompt Patterns

### Pattern 1: README Generation

**Template:**
```
Create a comprehensive README.md for this project:

PROJECT DETAILS:
- Name: [Project name]
- Purpose: [What it does]
- Tech stack: [Languages, frameworks]
- Target audience: [Developers, users, both]

Include:
- Project title and description
- Features
- Installation instructions
- Usage examples
- Configuration
- API reference (if applicable)
- Contributing guidelines
- License

Code structure:
[File/folder structure]

Key files:
[Important files to document]
```

**Example:**
```
Create a comprehensive README.md for this project:

PROJECT DETAILS:
- Name: TaskMaster API
- Purpose: REST API for task management
- Tech stack: Node.js, Express, PostgreSQL, JWT
- Target audience: Frontend developers

Include:
- Clear description
- Features list
- Setup instructions
- API endpoints with examples
- Authentication guide
- Environment variables
- Testing instructions

Main files:
- server.js (entry point)
- routes/tasks.js (task endpoints)
- middleware/auth.js (authentication)
```

**Generated README:**
```markdown
# TaskMaster API

A RESTful API for task management with user authentication and real-time updates.

## Features

- 🔐 JWT-based authentication
- ✅ Create, read, update, delete tasks
- 🏷️ Task categories and tags
- 📅 Due dates and reminders
- 👥 Task assignment and collaboration
- 🔍 Advanced search and filtering

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express 4.x
- **Database:** PostgreSQL 14+
- **Authentication:** JWT
- **Testing:** Jest + Supertest

## Installation

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourorg/taskmaster-api.git
cd taskmaster-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run database migrations
```bash
npm run migrate
```

5. Start the server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskmaster

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

## API Reference

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Tasks

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer {token}
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the API documentation",
  "due_date": "2024-12-31",
  "category": "work"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer {token}
```

## Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run specific test file:
```bash
npm test auth.test.js
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details
```

### Pattern 2: Function Documentation

**Template:**
```
Generate documentation for this function:

Function purpose: [What it does]
Documentation style: [JSDoc, docstring, JavaDoc, etc.]

Include:
- Description
- Parameters with types
- Return value with type
- Exceptions/errors
- Usage examples
- Notes/warnings if applicable

[Function code]
```

**Example - Python:**
```python
def calculate_shipping_cost(weight, distance, is_express=False):
    base_rate = 5.0
    weight_rate = 0.5
    distance_rate = 0.1
    express_multiplier = 1.5
    
    cost = base_rate + (weight * weight_rate) + (distance * distance_rate)
    
    if is_express:
        cost *= express_multiplier
    
    return round(cost, 2)
```

**Prompt:**
```
Generate Python docstring for this function following Google style:

[code above]
```

**Generated:**
```python
def calculate_shipping_cost(weight: float, distance: float, is_express: bool = False) -> float:
    """
    Calculates shipping cost based on package weight and delivery distance.
    
    The cost is calculated using a base rate plus additional charges for weight
    and distance. Express shipping applies a 1.5x multiplier to the total cost.
    
    Args:
        weight: Package weight in kilograms (must be positive)
        distance: Delivery distance in kilometers (must be positive)
        is_express: Whether to use express shipping (default: False)
    
    Returns:
        Total shipping cost in dollars, rounded to 2 decimal places
    
    Raises:
        ValueError: If weight or distance is negative
    
    Examples:
        >>> calculate_shipping_cost(5, 100)
        57.50
        
        >>> calculate_shipping_cost(5, 100, is_express=True)
        86.25
        
        >>> calculate_shipping_cost(0, 50)
        10.0
    
    Note:
        - Base rate: $5.00
        - Weight rate: $0.50 per kg
        - Distance rate: $0.10 per km
        - Express multiplier: 1.5x
    """
    if weight < 0 or distance < 0:
        raise ValueError("Weight and distance must be non-negative")
    
    base_rate = 5.0
    weight_rate = 0.5
    distance_rate = 0.1
    express_multiplier = 1.5
    
    cost = base_rate + (weight * weight_rate) + (distance * distance_rate)
    
    if is_express:
        cost *= express_multiplier
    
    return round(cost, 2)
```

### Pattern 3: API Documentation

**Template:**
```
Generate API documentation for these endpoints:

Format: [OpenAPI/Swagger, Markdown, etc.]

Include for each endpoint:
- HTTP method and path
- Description
- Request parameters (path, query, body)
- Request examples
- Response schema
- Response examples (success and error)
- Status codes
- Authentication requirements

[API code]
```

**Example:**
```
Generate OpenAPI (Swagger) documentation for this Express endpoint:

```typescript
router.get('/api/users/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```
```

**Generated:**
```yaml
/api/users/{id}:
  get:
    summary: Get user by ID
    description: Retrieves a single user's information by their unique identifier
    tags:
      - Users
    security:
      - bearerAuth: []
    parameters:
      - in: path
        name: id
        required: true
        schema:
          type: integer
          example: 123
        description: Unique user identifier
    responses:
      '200':
        description: User found and returned successfully
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: integer
                  example: 123
                name:
                  type: string
                  example: "John Doe"
                email:
                  type: string
                  format: email
                  example: "john@example.com"
                created_at:
                  type: string
                  format: date-time
                  example: "2024-01-15T10:30:00Z"
            example:
              id: 123
              name: "John Doe"
              email: "john@example.com"
              created_at: "2024-01-15T10:30:00Z"
      '401':
        description: Authentication required
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
            example:
              error: "Authentication required"
      '404':
        description: User not found
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
            example:
              error: "User not found"
      '500':
        description: Internal server error
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
            example:
              error: "Internal server error"
```

### Pattern 4: Code Comments

**Template:**
```
Add clear, helpful comments to this code:

Comment style: [inline, block, both]
Audience: [junior devs, maintainers, etc.]

Guidelines:
- Explain WHY, not WHAT
- Comment complex logic
- Document assumptions
- Highlight edge cases
- Note performance considerations

[Code without comments]
```

**Example:**
```javascript
function findOptimalRoute(start, end, obstacles) {
  const queue = [[start, [start]]];
  const visited = new Set([start.toString()]);
  
  while (queue.length > 0) {
    const [current, path] = queue.shift();
    
    if (current[0] === end[0] && current[1] === end[1]) {
      return path;
    }
    
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const next = [current[0] + dx, current[1] + dy];
      const key = next.toString();
      
      if (!visited.has(key) && !isObstacle(next, obstacles)) {
        visited.add(key);
        queue.push([next, [...path, next]]);
      }
    }
  }
  
  return null;
}
```

**Prompt:**
```
Add helpful comments to this pathfinding function:
- Explain the algorithm being used
- Comment on key steps
- Note edge cases

[code above]
```

**Generated:**
```javascript
/**
 * Finds the shortest path between two points using BFS algorithm.
 * 
 * Uses breadth-first search to guarantee the shortest path in an unweighted
 * grid. Time complexity: O(n) where n is number of cells explored.
 * 
 * @param {[number, number]} start - Starting coordinates [x, y]
 * @param {[number, number]} end - Target coordinates [x, y]
 * @param {Array} obstacles - List of obstacle coordinates
 * @returns {Array|null} Path as array of coordinates, or null if no path exists
 */
function findOptimalRoute(start, end, obstacles) {
  // Queue stores [current position, path to current position]
  // Starting with the initial position and a path containing just that position
  const queue = [[start, [start]]];
  
  // Track visited positions to avoid cycles and redundant exploration
  // Using toString() to create unique keys for coordinate pairs
  const visited = new Set([start.toString()]);
  
  // BFS: Process positions in order of discovery (shortest path first)
  while (queue.length > 0) {
    const [current, path] = queue.shift();
    
    // Goal check: Have we reached the destination?
    if (current[0] === end[0] && current[1] === end[1]) {
      return path;
    }
    
    // Explore all 4 adjacent cells (right, down, left, up)
    // Could be extended to 8 directions for diagonal movement
    for (const [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      const next = [current[0] + dx, current[1] + dy];
      const key = next.toString();
      
      // Only explore if: not visited before AND not an obstacle
      if (!visited.has(key) && !isObstacle(next, obstacles)) {
        visited.add(key);
        
        // Add to queue with updated path (includes previous path + new position)
        queue.push([next, [...path, next]]);
      }
    }
  }
  
  // No path found after exploring all reachable positions
  return null;
}
```

### Pattern 5: Architecture Documentation

**Template:**
```
Create architecture documentation for this system:

Include:
- System overview
- Components and their responsibilities
- Data flow
- Technology choices and rationale
- Design patterns used
- Key decisions and trade-offs
- Diagrams (in text/ASCII format)

Code/structure:
[Project structure or key files]

Context:
[What problem it solves, constraints, etc.]
```

**Example:**
```
Document the architecture of this microservices application:

Services:
- auth-service (Node.js + JWT)
- user-service (Node.js + PostgreSQL)
- task-service (Node.js + PostgreSQL)
- notification-service (Node.js + Redis + SendGrid)

Communication: REST + Message Queue (RabbitMQ)
Frontend: React SPA

Create comprehensive architecture documentation.
```

---

## 🎨 Maintaining Documentation

### Pattern: Updating Existing Docs

**Template:**
```
Update this documentation to reflect code changes:

OLD CODE:
[Previous version]

NEW CODE:
[Current version]

CURRENT DOCS:
[Existing documentation]

Update the documentation to:
- Reflect new functionality
- Remove outdated information
- Maintain same format and style
- Add notes about breaking changes if any
```

### Pattern: Documentation Audit

**Template:**
```
Audit this documentation for accuracy:

DOCUMENTATION:
[Current docs]

CODE:
[Current code]

Check for:
- Incorrect information
- Outdated examples
- Missing features
- Inconsistencies
- Unclear sections

Provide:
- List of issues found
- Corrected version
- Suggestions for improvement
```

---

## 📊 Documentation Best Practices

### What to Document

**DO Document:**
- ✅ Public APIs and interfaces
- ✅ Complex algorithms
- ✅ Business logic and rules
- ✅ Setup and configuration
- ✅ Edge cases and gotchas
- ✅ Performance considerations
- ✅ Security concerns

**DON'T Document:**
- ❌ Obvious code (getters/setters)
- ❌ Self-explanatory variable names
- ❌ Standard language features
- ❌ Already covered by type system

### Documentation Principles

**1. Audience-Aware**
```
For developers: Technical details, API references
For users: How-to guides, examples
For maintainers: Architecture, decisions
```

**2. Example-Driven**
```
Always include working examples
Show common use cases
Demonstrate edge cases
```

**3. Keep It Updated**
```
Update docs when code changes
Use version tags for API docs
Mark deprecated features clearly
```

**4. Make It Scannable**
```
Use clear headings
Include table of contents
Highlight important information
Use code blocks effectively
```

---

## 🎓 Practice Exercises

### Exercise 1: Document This Class

```java
public class CacheManager<K, V> {
    private final Map<K, CacheEntry<V>> cache;
    private final long ttl;
    
    public CacheManager(long ttl) {
        this.cache = new ConcurrentHashMap<>();
        this.ttl = ttl;
    }
    
    public void put(K key, V value) {
        cache.put(key, new CacheEntry<>(value, System.currentTimeMillis() + ttl));
    }
    
    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null || entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        return entry.value;
    }
    
    private static class CacheEntry<V> {
        final V value;
        final long expiresAt;
        
        CacheEntry(V value, long expiresAt) {
            this.value = value;
            this.expiresAt = expiresAt;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
```

**Your Task:** Write a prompt to generate JavaDoc

**Your Prompt:**
```
[Write your documentation request here]
```

### Exercise 2: Create README

You have a project with these files:
- `server.py` - Flask API server
- `models.py` - SQLAlchemy models
- `auth.py` - Authentication middleware
- `requirements.txt` - Dependencies
- `config.py` - Configuration

**Your Task:** Write a prompt to generate README.md

**Your Prompt:**
```
[Write your documentation request here]
```

### Exercise 3: Document API Endpoint

```python
@app.route('/api/products/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    category = request.args.get('category')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    page = request.args.get('page', 1, type=int)
    
    products = Product.query.filter(
        Product.name.contains(query)
    )
    
    if category:
        products = products.filter_by(category=category)
    if min_price:
        products = products.filter(Product.price >= min_price)
    if max_price:
        products = products.filter(Product.price <= max_price)
    
    products = products.paginate(page=page, per_page=20)
    
    return jsonify({
        'products': [p.to_dict() for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    })
```

**Your Task:** Generate API documentation

**Your Prompt:**
```
[Write your documentation request here]
```

---

## 🚀 Real-World Documentation Scenarios

### Scenario 1: Open Source Project

Your project needs documentation for GitHub:
- README.md
- CONTRIBUTING.md
- API.md
- Examples folder

**Prompt:**
```
Create comprehensive documentation for my open-source project:

PROJECT: React component library for data visualization

FILES:
- 15 components (Chart, Graph, Table, etc.)
- Utils for data processing
- Hooks for data fetching

AUDIENCE:
- React developers
- Data analysts
- Contributors

Create:
1. README.md with installation, quick start, examples
2. CONTRIBUTING.md with guidelines
3. API.md with all component props
4. Example code snippets

Focus on making it easy for first-time users.
```

### Scenario 2: Internal Tool Documentation

**Prompt:**
```
Document this internal deployment tool for the DevOps team:

TOOL PURPOSE:
Automates deployment to Kubernetes clusters

FEATURES:
- Multi-environment support (dev, staging, prod)
- Secret management
- Rollback capability
- Health checks

TARGET AUDIENCE:
- DevOps engineers (familiar with K8s)
- Developers (need simple commands)

Create documentation that:
- Explains architecture
- Shows common workflows
- Lists all commands
- Includes troubleshooting guide
```

---

## ✅ Documentation Checklist

### README Quality Check
- [ ] Clear project description
- [ ] Installation instructions
- [ ] Quick start example
- [ ] Feature list
- [ ] API/usage reference
- [ ] Contributing guidelines
- [ ] License information
- [ ] Contact/support info

### Code Documentation Check
- [ ] All public APIs documented
- [ ] Complex logic explained
- [ ] Examples included
- [ ] Edge cases noted
- [ ] Parameters typed
- [ ] Return values described
- [ ] Exceptions documented

### API Documentation Check
- [ ] All endpoints documented
- [ ] Request/response examples
- [ ] Authentication explained
- [ ] Error codes listed
- [ ] Rate limits noted
- [ ] Versioning strategy clear

---

## 💡 Pro Tips

**Tip 1: Document as You Code**
Generate documentation immediately after writing code while it's fresh in your mind.

**Tip 2: Use Examples Liberally**
One good example is worth a thousand words of description.

**Tip 3: Version Your Docs**
Tag documentation versions to match code releases.

**Tip 4: Make It Searchable**
Use clear headings and consistent terminology.

**Tip 5: Get Feedback**
Ask users what's confusing and improve those sections.

---

## 🚀 Next Steps

Now that you can generate documentation, let's learn how to generate comprehensive unit tests.

**Next:** [Unit Test Generation →](./11-unit-test-generation.md)

---

*"Code tells you how. Comments tell you why." - Jeff Atwood*

*Write code for machines. Write documentation for humans.*
