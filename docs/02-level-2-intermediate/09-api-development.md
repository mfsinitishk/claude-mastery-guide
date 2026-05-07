# API Development with Claude

## Building REST and GraphQL APIs with AI Assistance

---

## 🎯 Overview

Claude accelerates API development by generating endpoints, request/response schemas, validation logic, documentation, and tests. This section covers REST and GraphQL API development patterns.

**Time to Master:** 3-4 hours
**Outcome:** Build production-ready APIs efficiently with Claude

---

## 🔧 REST API Development

### Pattern: Endpoint Generation

**Prompt Template:**
```
Create a {METHOD} endpoint for {resource} in {framework}.

Endpoint: {path}
Request: {body/params schema}
Response: {response schema}
Business logic: {description}

Include:
- Input validation
- Error handling  
- Status codes
- OpenAPI documentation
- Unit tests
```

### Example: User Creation Endpoint

**Request:**
```
Create a POST endpoint for user registration in Express.js with TypeScript.

Endpoint: POST /api/users
Request body:
- email: string (required, valid email)
- password: string (required, min 12 chars)
- name: string (required)

Response:
- 201: { id, email, name, createdAt }
- 400: validation errors
- 409: email already exists

Business logic:
- Validate input
- Hash password with bcrypt
- Check email uniqueness
- Save to database
- Return user (no password)
- Send welcome email (async)

Include Joi validation and Jest tests
```

**Claude generates complete implementation with validation, error handling, tests, and documentation.**

---

## 📊 GraphQL API Development

### Pattern: Schema-First Design

**Prompt:**
```
Design GraphQL schema for {domain}.

Types needed:
- {type1} with fields {fields}
- {type2} with fields {fields}

Queries:
- {query1}: {description}
- {query2}: {description}

Mutations:
- {mutation1}: {description}
- {mutation2}: {description}

Include:
- Type definitions
- Resolvers
- Input validation
- Error handling
- DataLoader for N+1 prevention
```

---

## ✅ Best Practices

### API Design
✅ Use consistent naming conventions
✅ Version your APIs (/v1/, /v2/)
✅ Implement proper HTTP status codes
✅ Use pagination for lists
✅ Include rate limiting
✅ Provide comprehensive error messages

### Security
✅ Validate all inputs
✅ Use parameterized queries (prevent SQL injection)
✅ Implement authentication/authorization
✅ Use HTTPS only
✅ Implement CORS properly
✅ Never expose sensitive data in responses

### Documentation
✅ Use OpenAPI/Swagger for REST
✅ Provide schema introspection for GraphQL
✅ Include example requests/responses
✅ Document error codes
✅ Keep documentation up-to-date

---

## 🎓 Practice Exercise

Use Claude to:
1. Design a blog API with posts, comments, users
2. Implement CRUD operations
3. Add pagination and filtering
4. Generate OpenAPI documentation
5. Create integration tests

---

**Next:** [Backend-Frontend Workflows →](./10-backend-frontend-workflows.md)
