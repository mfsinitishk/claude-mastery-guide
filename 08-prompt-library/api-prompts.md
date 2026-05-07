# API Development Prompts

Prompts for designing, developing, and documenting APIs.

## Table of Contents
- [API Design](#api-design)
- [REST APIs](#rest-apis)
- [GraphQL APIs](#graphql-apis)
- [API Documentation](#api-documentation)

---

## API Design

### 1. RESTful API Design
```
Design a RESTful API for:

Domain: [describe business domain]
Resources: [list main entities]
Operations: [CRUD and custom operations needed]
Clients: [web/mobile/third-party]
Scale: [expected usage]

Design:
1. Resource naming and hierarchy
2. HTTP methods mapping
3. URL structure
4. Request/response formats
5. Status code usage
6. Pagination strategy
7. Filtering and sorting
8. Versioning approach
9. Error response format
10. Authentication method
```

**Usage Context**: Designing REST APIs from scratch.

**Example Input**:
```
Domain: E-commerce order management
Resources: Orders, OrderItems, Customers, Products
Operations: Create order, get order, list orders, update order status, cancel order
Clients: Web app, mobile app, admin dashboard
Scale: 1000 orders/day
```

**Example Output**:
```
RESTFUL API DESIGN

Base URL: https://api.example.com/v1

RESOURCE HIERARCHY:

/customers
  /{customerId}
    /orders
      /{orderId}
        /items
          /{itemId}

ENDPOINTS:

## Orders

### Create Order
POST /orders
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "customerId": "string",
  "items": [
    {
      "productId": "string",
      "quantity": integer,
      "price": decimal
    }
  ],
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string"
  },
  "paymentMethod": "string"
}

Response (201 Created):
{
  "id": "ord_abc123",
  "customerId": "cust_xyz789",
  "status": "pending",
  "items": [...],
  "subtotal": 99.99,
  "tax": 8.00,
  "total": 107.99,
  "createdAt": "2026-05-05T10:00:00Z",
  "updatedAt": "2026-05-05T10:00:00Z"
}

### Get Order
GET /orders/{orderId}
Authorization: Bearer {token}

Response (200 OK):
{
  "id": "ord_abc123",
  ...full order details
}

Response (404 Not Found):
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order with ID ord_abc123 not found"
  }
}

### List Orders
GET /orders?customerId={id}&status={status}&page={n}&limit={m}&sort={field}
Authorization: Bearer {token}

Query Parameters:
- customerId (optional): Filter by customer
- status (optional): Filter by status (pending|confirmed|shipped|delivered|cancelled)
- page (optional, default: 1): Page number
- limit (optional, default: 20, max: 100): Results per page
- sort (optional, default: -createdAt): Sort field (prefix - for desc)

Response (200 OK):
{
  "data": [
    { order objects }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "links": {
    "self": "/orders?page=1&limit=20",
    "next": "/orders?page=2&limit=20",
    "prev": null,
    "first": "/orders?page=1&limit=20",
    "last": "/orders?page=8&limit=20"
  }
}

### Update Order Status
PATCH /orders/{orderId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "confirmed"
}

Response (200 OK):
{
  "id": "ord_abc123",
  "status": "confirmed",
  "updatedAt": "2026-05-05T10:30:00Z"
}

### Cancel Order
DELETE /orders/{orderId}
Authorization: Bearer {token}

Response (204 No Content)

Response (409 Conflict) - if order already shipped:
{
  "error": {
    "code": "ORDER_CANNOT_BE_CANCELLED",
    "message": "Orders that have been shipped cannot be cancelled"
  }
}

## Order Items

### Get Order Items
GET /orders/{orderId}/items
Authorization: Bearer {token}

Response (200 OK):
{
  "data": [
    {
      "id": "item_123",
      "orderId": "ord_abc123",
      "productId": "prod_xyz",
      "productName": "Widget",
      "quantity": 2,
      "unitPrice": 49.99,
      "total": 99.98
    }
  ]
}

HTTP STATUS CODE USAGE:

- 200 OK: Successful GET, PATCH
- 201 Created: Successful POST
- 204 No Content: Successful DELETE
- 400 Bad Request: Invalid request data
- 401 Unauthorized: Missing/invalid authentication
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 409 Conflict: Business rule violation
- 422 Unprocessable Entity: Validation errors
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Server error
- 503 Service Unavailable: Service temporarily down

ERROR RESPONSE FORMAT:

{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {
      "field": "specific error details"
    },
    "requestId": "req_abc123",
    "timestamp": "2026-05-05T10:00:00Z"
  }
}

VERSIONING:

Strategy: URL path versioning
- Current: /v1/orders
- Next: /v2/orders
- Deprecation: 6-month notice, support for 1 year

AUTHENTICATION:

- Method: JWT Bearer tokens
- Header: Authorization: Bearer {token}
- Token expiry: 1 hour
- Refresh token: 30 days

RATE LIMITING:

- Limit: 1000 requests/hour per API key
- Headers:
  - X-RateLimit-Limit: 1000
  - X-RateLimit-Remaining: 950
  - X-RateLimit-Reset: 1651756800

PAGINATION:

- Default limit: 20
- Maximum limit: 100
- Cursor-based for large datasets (optional)

SORTING:

- Format: ?sort=field or ?sort=-field (descending)
- Multiple: ?sort=status,-createdAt
- Default: -createdAt

FILTERING:

- Exact match: ?status=pending
- Multiple values: ?status=pending,confirmed
- Range: ?createdAt[gte]=2026-01-01&createdAt[lte]=2026-12-31
```

**Language Variations**:
- Include framework-specific routing (Express, Spring, Django)
- Add middleware for auth, validation, logging

---

### 2. GraphQL Schema Design
```
Design GraphQL schema for:

Domain: [business domain]
Entities: [list entities]
Relationships: [how entities relate]
Use Cases: [queries and mutations needed]

Create:
1. Type definitions
2. Query definitions
3. Mutation definitions
4. Input types
5. Resolvers structure
6. Authentication/authorization
7. Pagination approach
8. Error handling
9. Subscription (if needed)
10. Schema documentation
```

**Usage Context**: Designing GraphQL APIs.

---

### 3. API Versioning Strategy
```
Design API versioning strategy:

API: [current API]
Changes Needed: [breaking changes planned]
Clients: [who uses the API]
Constraints: [backward compatibility needs]

Design:
1. Versioning method (URL/header/content negotiation)
2. Version numbering scheme
3. Deprecation policy
4. Migration path
5. Version support timeline
6. Breaking vs non-breaking changes
7. Communication strategy
8. Monitoring and metrics
```

**Usage Context**: Planning API evolution.

---

### 4. API Rate Limiting Design
```
Design rate limiting for:

API: [endpoints]
Expected Usage: [requests/sec]
Abuse Scenarios: [what to prevent]

Design:
1. Rate limit tiers
2. Limit algorithm (token bucket/leaky bucket/fixed window)
3. Limit by (IP/API key/user)
4. Response headers
5. Error responses
6. Bypass mechanism (for trusted clients)
7. Dynamic rate limiting
8. Monitoring and alerting
```

**Usage Context**: Implementing rate limiting.

---

## REST APIs

### 5. REST API Implementation
```
Implement REST API endpoint:

Endpoint: [method and path]
Purpose: [what it does]
Framework: [Express/FastAPI/Spring/etc]

Implement:
1. Route handler
2. Request validation
3. Business logic
4. Response formatting
5. Error handling
6. Authentication
7. Authorization
8. Logging
9. Tests
10. Documentation
```

**Usage Context**: Implementing API endpoints.

**Example Input**:
```
Endpoint: POST /api/v1/users
Purpose: Create new user account
Framework: Express.js
```

**Example Output**:
```javascript
const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * @route   POST /api/v1/users
 * @desc    Create new user account
 * @access  Public
 */
router.post(
  '/users',
  
  // Validation middleware
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email required'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be 2-100 characters')
  ],
  
  // Rate limiting
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 accounts per window
  }),
  
  async (req, res, next) => {
    try {
      // Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: errors.array()
          }
        });
      }
      
      const { email, password, name } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists'
          }
        });
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const user = new User({
        email,
        passwordHash,
        name,
        createdAt: new Date()
      });
      
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      // Log user creation
      logger.info('User created', {
        userId: user.id,
        email: user.email,
        ip: req.ip
      });
      
      // Send welcome email (async, don't wait)
      emailService.sendWelcomeEmail(user.email, user.name)
        .catch(err => logger.error('Welcome email failed', err));
      
      // Return response (don't include password hash)
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        token
      });
      
    } catch (error) {
      // Log error with context
      logger.error('User creation failed', {
        error: error.message,
        stack: error.stack,
        body: req.body
      });
      
      // Pass to error handler
      next(error);
    }
  }
);

module.exports = router;

// Tests (Jest)
describe('POST /api/v1/users', () => {
  
  it('should create user with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
    expect(response.body.email).toBe('test@example.com');
    expect(response.body).not.toHaveProperty('passwordHash');
  });
  
  it('should reject weak password', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User'
      })
      .expect(422);
    
    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
  
  it('should reject duplicate email', async () => {
    // Create first user
    await createUser({ email: 'test@example.com' });
    
    // Try to create duplicate
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
        name: 'Test User'
      })
      .expect(409);
    
    expect(response.body.error.code).toBe('USER_EXISTS');
  });
});
```

---

### 6. API Error Handling
```
Design comprehensive error handling for API:

API Type: [REST/GraphQL]
Framework: [framework]
Error Scenarios: [list expected errors]

Design:
1. Error response format
2. HTTP status code mapping
3. Error codes/types
4. Error messages (user-friendly)
5. Validation errors
6. Authentication errors
7. Authorization errors
8. Business logic errors
9. System errors
10. Error logging
```

**Usage Context**: Standardizing API error handling.

---

### 7. API Testing Strategy
```
Create API testing strategy:

API: [description]
Endpoints: [list key endpoints]
Testing Framework: [Jest/Pytest/etc]

Create tests for:
1. Success scenarios
2. Validation errors
3. Authentication/authorization
4. Rate limiting
5. Concurrent requests
6. Edge cases
7. Performance
8. Contract testing
9. Integration testing
10. Load testing
```

**Usage Context**: Comprehensive API testing.

---

## GraphQL APIs

### 8. GraphQL Resolver Implementation
```
Implement GraphQL resolvers:

Schema: [paste GraphQL schema]
Data Sources: [databases, APIs, etc]
Framework: [Apollo/graphql-js/etc]

Implement:
1. Query resolvers
2. Mutation resolvers
3. Field resolvers
4. Data loader (N+1 prevention)
5. Error handling
6. Authentication
7. Authorization
8. Pagination
9. Caching
10. Tests
```

**Usage Context**: Implementing GraphQL backend.

---

### 9. GraphQL Query Optimization
```
Optimize GraphQL queries:

Schema: [paste schema]
Slow Queries: [paste slow queries]
Performance Data: [metrics]

Optimize:
1. N+1 query problems
2. DataLoader implementation
3. Query complexity limits
4. Depth limiting
5. Pagination
6. Caching strategy
7. Batch loading
8. Database query optimization
```

**Usage Context**: Improving GraphQL performance.

---

## API Documentation

### 10. OpenAPI Specification
```
Generate OpenAPI 3.0 specification:

API: [description]
Endpoints: [list endpoints]
Authentication: [method]

Generate complete spec including:
1. Info and metadata
2. Servers configuration
3. Paths and operations
4. Request/response schemas
5. Security schemes
6. Examples
7. Tags and descriptions
8. Components (reusable schemas)
9. Webhooks (if applicable)
```

**Usage Context**: Creating OpenAPI docs.

---

## API Best Practices Template

```
API DEVELOPMENT REQUEST:

API Type:
[REST/GraphQL/gRPC]

Purpose:
[what the API does]

Requirements:
- Resources/Entities: [list]
- Operations: [CRUD and custom]
- Authentication: [method]
- Authorization: [RBAC/ABAC]
- Rate Limiting: [requirements]
- Versioning: [needed or not]

Clients:
- Types: [web/mobile/third-party]
- Expected Usage: [requests/sec]

Technical Stack:
- Language: [language]
- Framework: [framework]
- Database: [database]
- Infrastructure: [hosting]

Standards:
- REST: RESTful principles
- Status Codes: Proper HTTP usage
- Error Format: Consistent errors
- Documentation: OpenAPI/GraphQL schema

Please Provide:
1. API design (endpoints/schema)
2. Request/response formats
3. Error handling
4. Authentication/authorization
5. Implementation code
6. Tests
7. Documentation
8. Security considerations
```

## Best Practices for API Prompts

1. **Specify API Type**: REST, GraphQL, gRPC
2. **Define Resources**: Clear entity definitions
3. **Include Use Cases**: What operations are needed
4. **Request Examples**: Show expected usage
5. **Specify Standards**: RESTful, OpenAPI, etc.
6. **Include Auth Requirements**: Security needs
7. **Define Error Handling**: Consistent approach
8. **Request Tests**: Include test scenarios
9. **Ask for Documentation**: OpenAPI/GraphQL schema
10. **Consider Versioning**: Future evolution
