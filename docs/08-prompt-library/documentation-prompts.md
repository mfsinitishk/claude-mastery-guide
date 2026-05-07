# Documentation Prompts

Prompts for creating clear, comprehensive technical documentation.

## Table of Contents
- [Code Documentation](#code-documentation)
- [API Documentation](#api-documentation)
- [Architecture Documentation](#architecture-documentation)
- [User Documentation](#user-documentation)

---

## Code Documentation

### 1. Generate Function/Method Documentation
```
Create comprehensive documentation for this function:

Code: [paste function/method]
Language: [programming language]
Doc Format: [JSDoc/Javadoc/Docstring/XML Comments]

Include:
1. Brief description
2. Detailed explanation
3. Parameters with types and descriptions
4. Return value
5. Exceptions/errors thrown
6. Usage examples
7. Edge cases and constraints
8. Related functions
9. Complexity (if relevant)
```

**Usage Context**: Documenting functions and methods.

**Example Input**:
```python
def calculate_route_cost(waypoints, vehicle_type, time_of_day):
    base_rate = get_base_rate(vehicle_type)
    distance = calculate_total_distance(waypoints)
    surge = get_surge_multiplier(time_of_day)
    return base_rate * distance * surge
```

**Example Output**:
```python
def calculate_route_cost(waypoints, vehicle_type, time_of_day):
    """
    Calculate the total cost for a route based on waypoints, vehicle type, and time.
    
    This function computes the total cost by considering the base rate for the
    vehicle type, the total distance of the route, and any surge pricing that
    applies at the specified time of day.
    
    Args:
        waypoints (List[Tuple[float, float]]): List of (latitude, longitude) tuples
            representing the route points. Must contain at least 2 points.
        vehicle_type (str): Type of vehicle. Valid values: 'economy', 'premium', 
            'luxury'. Case-insensitive.
        time_of_day (datetime): The datetime when the trip starts. Used to 
            determine surge pricing.
    
    Returns:
        Decimal: The total cost in USD, rounded to 2 decimal places.
    
    Raises:
        ValueError: If waypoints has fewer than 2 points.
        ValueError: If vehicle_type is not recognized.
        InvalidTimeError: If time_of_day is in the past.
    
    Examples:
        >>> waypoints = [(40.7128, -74.0060), (40.7580, -73.9855)]
        >>> vehicle = 'economy'
        >>> time = datetime(2026, 5, 5, 18, 0)  # 6 PM
        >>> calculate_route_cost(waypoints, vehicle, time)
        Decimal('25.50')
        
        >>> # Peak hours with surge pricing
        >>> time = datetime(2026, 5, 5, 8, 0)  # 8 AM rush hour
        >>> calculate_route_cost(waypoints, vehicle, time)
        Decimal('38.25')  # 1.5x surge multiplier
    
    Notes:
        - Base rates are determined by vehicle type configuration
        - Distance is calculated using Haversine formula
        - Surge multipliers range from 1.0x to 3.0x
        - Minimum charge is $5.00 regardless of distance
    
    See Also:
        get_base_rate: Retrieves base rate for vehicle type
        calculate_total_distance: Computes route distance
        get_surge_multiplier: Determines surge pricing
    
    Complexity:
        Time: O(n) where n is number of waypoints
        Space: O(1)
    """
    base_rate = get_base_rate(vehicle_type)
    distance = calculate_total_distance(waypoints)
    surge = get_surge_multiplier(time_of_day)
    return base_rate * distance * surge
```

**Language Variations**:
- **JavaScript**: JSDoc format with @param, @returns, @throws
- **Java**: Javadoc with @param, @return, @throws
- **C#**: XML documentation comments
- **Go**: Doc comments following Go conventions

**Tips for Customization**:
- Specify documentation standard for your organization
- Request specific sections (security notes, performance hints)
- Include examples relevant to your domain

---

### 2. Class/Interface Documentation
```
Document this class/interface:

Code: [paste class code]
Language: [language]

Document:
1. Class purpose and responsibility
2. Design pattern used (if any)
3. Constructor parameters
4. Public methods (brief)
5. Properties/fields
6. Usage examples
7. Thread safety notes
8. Inheritance hierarchy
9. Implemented interfaces
10. Related classes
```

**Usage Context**: Documenting classes and types.

**Example Input**:
```java
public class UserRepository {
    private final DatabaseConnection db;
    
    public UserRepository(DatabaseConnection db) {
        this.db = db;
    }
    
    public User findById(Long id) { ... }
    public List<User> findByEmail(String email) { ... }
    public void save(User user) { ... }
    public void delete(Long id) { ... }
}
```

**Example Output**:
```java
/**
 * Repository for managing User entity persistence operations.
 * 
 * This class implements the Repository pattern to provide a clean abstraction
 * over database operations for User entities. It handles all CRUD operations
 * and common queries for users.
 * 
 * <p>This class is thread-safe when used with a thread-safe DatabaseConnection.
 * All methods use the underlying connection's transaction management.
 * 
 * <h2>Design Pattern</h2>
 * Implements the Repository pattern from Domain-Driven Design (DDD).
 * 
 * <h2>Example Usage</h2>
 * <pre>{@code
 * DatabaseConnection db = new DatabaseConnection(config);
 * UserRepository userRepo = new UserRepository(db);
 * 
 * // Find user by ID
 * User user = userRepo.findById(123L);
 * 
 * // Create new user
 * User newUser = new User("john@example.com", "John Doe");
 * userRepo.save(newUser);
 * 
 * // Find by email
 * List<User> users = userRepo.findByEmail("john@example.com");
 * }</pre>
 * 
 * @author Development Team
 * @version 2.0
 * @since 1.0
 * @see User
 * @see DatabaseConnection
 */
public class UserRepository {
    
    /**
     * Database connection for executing queries.
     * Injected via constructor for testability.
     */
    private final DatabaseConnection db;
    
    /**
     * Constructs a UserRepository with the specified database connection.
     * 
     * @param db the database connection to use for all operations
     * @throws NullPointerException if db is null
     */
    public UserRepository(DatabaseConnection db) {
        this.db = Objects.requireNonNull(db, "Database connection cannot be null");
    }
    
    /**
     * Finds a user by their unique identifier.
     * 
     * @param id the user ID to search for
     * @return the User if found
     * @throws UserNotFoundException if no user exists with given ID
     * @throws DatabaseException if database error occurs
     */
    public User findById(Long id) { ... }
    
    // ... other methods documented similarly
}
```

---

### 3. Module/Package Documentation
```
Create module/package documentation:

Module: [name]
Files: [list main files]
Purpose: [what the module does]

Document:
1. Module overview
2. Main components
3. Exports/public API
4. Dependencies
5. Usage guide
6. Configuration options
7. Examples
8. Architecture notes
```

**Usage Context**: Documenting modules or packages.

---

### 4. Inline Comment Guidelines
```
Add appropriate inline comments to this code:

Code: [paste code]

Add comments for:
1. Complex logic explanation
2. Why decisions were made (not what)
3. TODO/FIXME items
4. Performance considerations
5. Security implications
6. Non-obvious behavior
7. Workarounds and hacks

Avoid:
- Obvious comments (what the code does)
- Redundant comments
- Outdated comments
```

**Usage Context**: Improving code readability with comments.

**Example Input**:
```python
def merge_user_data(primary, secondary):
    result = primary.copy()
    for key in secondary:
        if key not in result or result[key] is None:
            result[key] = secondary[key]
    return result
```

**Example Output**:
```python
def merge_user_data(primary, secondary):
    """Merge two user data dictionaries, preferring primary values."""
    # Start with a copy to avoid mutating the input
    result = primary.copy()
    
    # Fill in missing values from secondary source
    # We prefer primary values even if they're empty strings,
    # but we'll use secondary if primary has None or key is missing.
    # This handles partial updates from multiple data sources.
    for key in secondary:
        if key not in result or result[key] is None:
            result[key] = secondary[key]
    
    return result
```

---

## API Documentation

### 5. REST API Endpoint Documentation
```
Document this REST API endpoint:

Endpoint: [URL pattern]
Method: [HTTP method]
Purpose: [what it does]

Document:
1. Endpoint description
2. Authentication requirements
3. Request format (headers, body, query params)
4. Request example
5. Success response format
6. Success response example
7. Error responses (codes and formats)
8. Rate limiting
9. Permissions required
10. Notes and caveats
```

**Usage Context**: Documenting REST APIs.

**Example Output**:
```markdown
## Create User

Creates a new user account.

**Endpoint:** `POST /api/v1/users`

**Authentication:** Required (Bearer token)

**Permissions:** `users:create` or Admin role

**Rate Limiting:** 10 requests per minute per IP

### Request

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body:**
```json
{
  "email": "string (required, valid email)",
  "name": "string (required, 2-100 characters)",
  "role": "string (optional, default: 'user', values: 'user'|'admin')",
  "metadata": "object (optional, additional user data)"
}
```

**Example Request:**
```bash
curl -X POST https://api.example.com/api/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer abc123..." \
  -d '{
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user"
  }'
```

### Response

**Success (201 Created):**
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "string",
  "createdAt": "ISO 8601 datetime",
  "metadata": "object"
}
```

**Example Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2026-05-05T10:30:00Z",
  "metadata": {}
}
```

**Error Responses:**

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{"error": "VALIDATION_ERROR", "message": "Invalid email format", "field": "email"}` |
| 401 | Missing/invalid token | `{"error": "UNAUTHORIZED", "message": "Valid authentication required"}` |
| 403 | Insufficient permissions | `{"error": "FORBIDDEN", "message": "Missing required permission: users:create"}` |
| 409 | Email already exists | `{"error": "CONFLICT", "message": "User with this email already exists"}` |
| 429 | Rate limit exceeded | `{"error": "RATE_LIMIT", "message": "Too many requests", "retryAfter": 60}` |
| 500 | Server error | `{"error": "INTERNAL_ERROR", "message": "An unexpected error occurred"}` |

**Notes:**
- Email addresses are case-insensitive and stored in lowercase
- Name field is trimmed of leading/trailing whitespace
- Created users receive a welcome email asynchronously
- User IDs are UUIDs v4
```

---

### 6. OpenAPI/Swagger Documentation
```
Generate OpenAPI 3.0 specification for:

API: [name]
Base URL: [URL]
Endpoints: [list or describe]

Generate complete OpenAPI spec including:
1. Info section
2. Servers
3. Paths and operations
4. Request/response schemas
5. Security schemes
6. Examples
7. Tags and descriptions
```

**Usage Context**: Creating API specifications.

---

### 7. GraphQL Schema Documentation
```
Document this GraphQL schema:

Schema: [paste GraphQL schema]

Document:
1. Type descriptions
2. Field descriptions
3. Arguments
4. Query examples
5. Mutation examples
6. Authentication requirements
7. Rate limiting
8. Error handling
9. Deprecation notices
```

**Usage Context**: Documenting GraphQL APIs.

---

## Architecture Documentation

### 8. System Architecture Documentation
```
Create architecture documentation for:

System: [name]
Components: [list main components]
Tech Stack: [technologies used]

Create documentation covering:
1. System overview
2. Architecture diagram (describe textually)
3. Component descriptions
4. Data flow
5. Integration points
6. Deployment architecture
7. Security architecture
8. Scalability approach
9. Technology choices rationale
10. Future considerations
```

**Usage Context**: Documenting overall system architecture.

**Example Output Structure**:
```markdown
# E-Commerce Platform Architecture

## System Overview
The e-commerce platform is a microservices-based system handling product catalogs, 
orders, payments, and inventory management for a multi-tenant retail operation.

## Architecture Diagram
```
[Client Apps] → [API Gateway] → [Microservices]
                                      ↓
                                [Message Queue]
                                      ↓
                              [Background Workers]
                                      ↓
                                 [Databases]
```

## Components

### API Gateway (Kong)
- Entry point for all client requests
- Handles authentication, rate limiting, routing
- Implemented using Kong Gateway
- Scales horizontally behind load balancer

### Product Service
- Manages product catalog and inventory
- Tech: Node.js, Express, MongoDB
- Handles: CRUD operations, search, categories
- Scaling: Horizontal with Redis caching

[Continue with each component...]

## Data Flow

### Order Creation Flow
1. Client sends order to API Gateway
2. Gateway validates auth token, routes to Order Service
3. Order Service validates cart, creates order record
4. Publishes OrderCreated event to message queue
5. Inventory Service consumes event, reserves stock
6. Payment Service processes payment
7. Fulfillment Service receives order for processing
8. Client receives order confirmation

[Continue with other flows...]
```

---

### 9. Database Schema Documentation
```
Document database schema:

Database: [name and type]
Schema: [DDL or description]

Document:
1. Schema overview
2. Entity-relationship diagram (textual)
3. Table descriptions
4. Column descriptions and constraints
5. Indexes
6. Relationships
7. Data dictionary
8. Example queries
9. Migration notes
```

**Usage Context**: Documenting database schemas.

---

### 10. Decision Records (ADR)
```
Create an Architecture Decision Record for:

Decision: [what was decided]
Context: [situation and problem]

Create ADR with:
1. Title
2. Status (proposed/accepted/deprecated/superseded)
3. Context (forces at play, constraints)
4. Decision (what was decided)
5. Consequences (positive and negative)
6. Alternatives considered
7. Related decisions
```

**Usage Context**: Recording architectural decisions.

**Example Output**:
```markdown
# ADR-015: Use PostgreSQL for Primary Data Store

**Status:** Accepted

**Date:** 2026-05-05

**Deciders:** Engineering Team, CTO

## Context

We need to choose a primary database for our new microservices platform. 
Requirements:
- ACID transactions for order processing
- Complex queries for reporting
- 10M+ records expected
- Strong consistency required
- Team has SQL expertise
- Budget: $5K/month for DB hosting

## Decision

We will use PostgreSQL as our primary relational database.

## Consequences

### Positive
- Strong ACID guarantees for transactions
- Excellent query capabilities with advanced SQL
- JSON support for flexible schemas where needed
- Mature ecosystem and tooling
- Team expertise available
- Cost-effective (can use managed services)
- Strong community support

### Negative
- Vertical scaling limits (need sharding for extreme scale)
- More complex to operate than managed NoSQL
- Query performance requires careful index management
- Replication lag in read replicas

## Alternatives Considered

### MongoDB
- Pros: Flexible schema, easy horizontal scaling
- Cons: Eventual consistency by default, weaker transactions, less suitable for complex joins
- Rejected: ACID requirements make PostgreSQL better fit

### MySQL
- Pros: Similar to PostgreSQL, wide adoption
- Cons: Less advanced features, licensing concerns (Oracle ownership)
- Rejected: PostgreSQL offers more features we need

### DynamoDB
- Pros: Fully managed, infinite scale, predictable performance
- Cons: Higher cost, limited query capabilities, vendor lock-in
- Rejected: Complex queries requirement makes SQL database better

## Implementation Notes

- Use PostgreSQL 15+
- Deploy on AWS RDS with Multi-AZ
- Configure connection pooling (PgBouncer)
- Set up read replicas for reporting queries
- Use partitioning for large tables (orders, events)

## Related Decisions

- ADR-012: Microservices architecture
- ADR-016: Caching strategy with Redis
```

---

## User Documentation

### 11. README Documentation
```
Create a comprehensive README for:

Project: [name]
Type: [library/application/tool]
Language: [language]

Include:
1. Project title and description
2. Key features
3. Installation instructions
4. Quick start guide
5. Usage examples
6. Configuration options
7. API reference (brief)
8. Contributing guidelines
9. License
10. Support and community links
```

**Usage Context**: Creating project README files.

---

### 12. Tutorial/Guide Documentation
```
Create a tutorial for:

Task: [what users want to accomplish]
Audience: [skill level]
Prerequisites: [required knowledge/tools]

Create tutorial with:
1. Introduction and learning objectives
2. Prerequisites and setup
3. Step-by-step instructions
4. Code examples
5. Expected output
6. Troubleshooting common issues
7. Next steps
8. Additional resources
```

**Usage Context**: Teaching users how to use features.

---

## Documentation Best Practices Template

```
DOCUMENTATION REQUEST:

Subject:
[code/API/architecture/tutorial]

Context:
- Audience: [developers/users/architects]
- Existing Documentation: [what exists already]
- Documentation Format: [Markdown/HTML/JSDoc/etc]

Requirements:
1. Documentation Type: [reference/guide/tutorial/API]
2. Depth: [brief/comprehensive/detailed]
3. Examples: [simple/real-world/both]
4. Diagrams: [yes/no, what kind]

Style:
- Tone: [formal/conversational]
- Technical Level: [beginner/intermediate/advanced]
- Organization Standard: [Google/Microsoft/etc]

Please Create:
1. Overview/introduction
2. Main content sections
3. Code examples
4. Best practices
5. Common pitfalls
6. Related resources
7. Changelog (if updating)

Special Requirements:
[any specific needs]
```

## Best Practices for Documentation Prompts

1. **Specify Audience**: Know who will read the documentation
2. **Choose Format**: Request specific doc format (Markdown, JSDoc, etc.)
3. **Request Examples**: Always ask for usage examples
4. **Include Context**: Explain what the code/system does
5. **Set Depth Level**: Specify brief vs comprehensive
6. **Request Structure**: Ask for specific sections
7. **Mention Standards**: Reference style guides if applicable
8. **Consider Maintenance**: Ask for documentation that's easy to update
9. **Request Visuals**: Diagrams, flowcharts (even textual descriptions)
10. **Include Edge Cases**: Document limitations and constraints
