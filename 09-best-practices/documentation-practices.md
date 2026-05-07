# Documentation Best Practices

## Overview

Effective documentation is crucial for maintaining AI-generated code. This guide provides strategies for creating clear, comprehensive, and maintainable documentation that enhances code understanding and team collaboration.

## Core Principles

### 1. Documentation as Code

Treat documentation with the same rigor as production code.

**Key Guidelines:**
- Store docs with code
- Version control documentation
- Review docs in PRs
- Update docs with code changes
- Automate doc generation where possible

### 2. Audience-Aware Documentation

Different audiences need different documentation.

**Target Audiences:**
- Developers (API docs, architecture)
- Users (user guides, tutorials)
- Operations (runbooks, deployment)
- Management (overviews, decisions)

### 3. Living Documentation

Documentation must evolve with the codebase.

**Practices:**
- Regular doc reviews
- Deprecation notices
- Version-specific docs
- Automated doc testing
- Community contributions

## Do's and Don'ts

### Code Documentation

#### Do's

- **Request inline documentation:**
  ```
  "Add comprehensive JSDoc comments:
  
  /**
   * Processes user payment with retry logic
   * 
   * @param userId - User identifier (UUID format)
   * @param amount - Payment amount in cents (positive integer)
   * @param currency - ISO 4217 currency code (e.g., 'USD')
   * @returns Promise resolving to payment confirmation
   * @throws {InsufficientFundsError} When user balance is too low
   * @throws {PaymentGatewayError} When external payment fails
   * 
   * @example
   * ```typescript
   * const result = await processPayment(
   *   '123e4567-e89b-12d3-a456-426614174000',
   *   1099,
   *   'USD'
   * );
   * ```
   * 
   * @see {@link https://docs.stripe.com/api Stripe API}
   * @since 2.1.0
   */
  ```

- **Document complex algorithms:**
  ```
  "Add explanation for sorting algorithm:
  
  // Using merge sort for stable O(n log n) performance
  // Stability important for maintaining relative order of equal elements
  // Trade-off: O(n) space complexity for temporary arrays
  // Alternative considered: quicksort (faster average, unstable)
  function stableMergeSort<T>(arr: T[]): T[] {
    // Implementation...
  }
  ```

- **Explain non-obvious decisions:**
  ```
  "Document why we use this approach:
  
  // Using polling instead of WebSocket because:
  // 1. Firewall restrictions prevent WebSocket connections
  // 2. Update frequency is low (every 30s acceptable)
  // 3. Simpler error handling and recovery
  // 4. Considered WebSocket but deployment constraints won out
  // TODO: Migrate to WebSocket when infrastructure supports it
  ```

- **Add architecture documentation:**
  ```
  "Create architecture documentation:
  
  /docs/architecture/
    overview.md           # System overview
    data-flow.md          # How data flows through system
    components.md         # Major components
    decisions/            # ADRs (Architecture Decision Records)
      001-database.md
      002-authentication.md
    diagrams/             # Architecture diagrams
      system-context.mmd
      component-diagram.mmd
  ```

#### Don'ts

- **Don't document obvious code:**
  ```
  DON'T:
  // Increment counter by 1
  counter++;
  
  // Get user by ID
  const user = getUserById(id);
  
  DO:
  // Increment retry counter before exponential backoff
  retryCounter++;
  
  // Fetch user to verify permissions before deletion
  const user = getUserById(id);
  ```

- **Don't leave stale comments:**
  ```
  DON'T:
  // TODO: Fix this hack (written 3 years ago, never fixed)
  // Using deprecated API (API still deprecated, comment unhelpful)
  
  DO:
  // Using legacy API until v3 migration (ETA: Q3 2026)
  // Tracked in: JIRA-1234
  ```

- **Don't document implementation in interface:**
  ```
  DON'T:
  interface UserService {
    // This uses bcrypt with 12 rounds to hash password
    // then stores in PostgreSQL users table
    createUser(data: CreateUserDto): Promise<User>;
  }
  
  DO:
  interface UserService {
    /**
     * Creates a new user account
     * @throws {DuplicateEmailError} If email already registered
     */
    createUser(data: CreateUserDto): Promise<User>;
  }
  ```

## Real-World Examples

### Example 1: API Documentation

**Request:**
```
"Create comprehensive API documentation for user endpoints:

ENDPOINTS:
- GET /api/users/:id
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

DOCUMENTATION SHOULD INCLUDE:
- Endpoint description
- Authentication requirements
- Request parameters
- Request body schema
- Response schema (success and errors)
- Status codes
- Example requests/responses
- Rate limiting
- Common errors and solutions

FORMAT: OpenAPI 3.0 specification
GENERATE: Both YAML spec and HTML docs"
```

**High-Quality Result:**
```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: |
    API for managing user accounts in the system.
    
    ## Authentication
    All endpoints require Bearer token authentication.
    Include token in Authorization header: `Bearer <token>`
    
    ## Rate Limiting
    - 100 requests per minute per user
    - 1000 requests per hour per user
    - Rate limit headers included in responses
    
    ## Versioning
    API version specified in URL path (/api/v1/)
    
  contact:
    name: API Support
    email: api@example.com
    
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      description: |
        Retrieves a single user by their unique identifier.
        
        **Authorization Rules:**
        - Users can retrieve their own data
        - Admins can retrieve any user data
        
        **Performance:**
        - Cached for 5 minutes
        - Average response time: <50ms
        
      operationId: getUserById
      tags:
        - Users
      security:
        - bearerAuth: []
      parameters:
        - name: userId
          in: path
          required: true
          description: User's unique identifier (UUID format)
          schema:
            type: string
            format: uuid
            example: "123e4567-e89b-12d3-a456-426614174000"
      responses:
        '200':
          description: User found and returned successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
              example:
                id: "123e4567-e89b-12d3-a456-426614174000"
                email: "john.doe@example.com"
                firstName: "John"
                lastName: "Doe"
                createdAt: "2026-01-15T10:30:00Z"
                role: "user"
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          description: Forbidden - insufficient permissions
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                error: "Forbidden"
                message: "You don't have permission to access this user"
                code: "INSUFFICIENT_PERMISSIONS"
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                error: "Not Found"
                message: "User with ID 123e4567... not found"
                code: "USER_NOT_FOUND"
        '429':
          $ref: '#/components/responses/RateLimitExceeded'

  /users:
    post:
      summary: Create new user
      description: |
        Creates a new user account.
        
        **Validation Rules:**
        - Email must be unique
        - Password minimum 12 characters
        - Password must contain uppercase, lowercase, number, symbol
        - FirstName and LastName required (2-50 characters)
        
        **Side Effects:**
        - Sends verification email
        - Creates audit log entry
        - Initializes user preferences with defaults
        
      operationId: createUser
      tags:
        - Users
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            example:
              email: "jane.smith@example.com"
              password: "SecurePass123!"
              firstName: "Jane"
              lastName: "Smith"
      responses:
        '201':
          description: User created successfully
          headers:
            Location:
              description: URL of the created user
              schema:
                type: string
                example: "/api/v1/users/987fcdeb-51a2-43d7-b456-123456789012"
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'
              example:
                error: "Validation Failed"
                message: "Request validation failed"
                code: "VALIDATION_ERROR"
                details:
                  - field: "password"
                    message: "Password must be at least 12 characters"
                  - field: "email"
                    message: "Email format invalid"
        '409':
          description: Email already registered
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                error: "Conflict"
                message: "Email already registered"
                code: "DUPLICATE_EMAIL"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        JWT token obtained from /api/auth/login endpoint.
        Token expires after 1 hour.
        
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - firstName
        - lastName
        - createdAt
        - role
      properties:
        id:
          type: string
          format: uuid
          description: Unique user identifier
        email:
          type: string
          format: email
          description: User's email address (unique)
        firstName:
          type: string
          minLength: 2
          maxLength: 50
          description: User's first name
        lastName:
          type: string
          minLength: 2
          maxLength: 50
          description: User's last name
        createdAt:
          type: string
          format: date-time
          description: Account creation timestamp (ISO 8601)
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp (ISO 8601)
        role:
          type: string
          enum: [user, admin, moderator]
          description: User's role in the system
          
    CreateUserRequest:
      type: object
      required:
        - email
        - password
        - firstName
        - lastName
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          minLength: 12
          description: |
            Must contain:
            - At least one uppercase letter
            - At least one lowercase letter
            - At least one number
            - At least one special character
        firstName:
          type: string
          minLength: 2
          maxLength: 50
        lastName:
          type: string
          minLength: 2
          maxLength: 50
          
    Error:
      type: object
      required:
        - error
        - message
        - code
      properties:
        error:
          type: string
          description: Error type
        message:
          type: string
          description: Human-readable error description
        code:
          type: string
          description: Machine-readable error code
        requestId:
          type: string
          description: Request ID for debugging
          
    ValidationError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
  
  responses:
    Unauthorized:
      description: Authentication required or token invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "Unauthorized"
            message: "Authentication token missing or invalid"
            code: "AUTHENTICATION_REQUIRED"
            
    RateLimitExceeded:
      description: Rate limit exceeded
      headers:
        X-RateLimit-Limit:
          description: Request limit per window
          schema:
            type: integer
            example: 100
        X-RateLimit-Remaining:
          description: Remaining requests in current window
          schema:
            type: integer
            example: 0
        X-RateLimit-Reset:
          description: Time when rate limit resets (Unix timestamp)
          schema:
            type: integer
            example: 1640995200
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "Too Many Requests"
            message: "Rate limit exceeded. Try again in 42 seconds."
            code: "RATE_LIMIT_EXCEEDED"
```

### Example 2: Architecture Decision Record

**Request:**
```
"Create an Architecture Decision Record (ADR) for choosing PostgreSQL over MongoDB:

INCLUDE:
- Decision context
- Options considered
- Decision made
- Rationale
- Consequences (positive and negative)
- Status
- Date
```

**High-Quality Result:**
```markdown
# ADR 003: Use PostgreSQL as Primary Database

## Status
Accepted

## Date
2026-05-01

## Context
We need to select a database for our new user management and financial transaction system. The system must:
- Handle complex relationships between users, accounts, and transactions
- Ensure ACID compliance for financial transactions
- Support complex queries with joins
- Scale to millions of records
- Provide strong consistency guarantees
- Support backup and point-in-time recovery

## Decision Drivers
- **Data Integrity**: Financial data requires ACID guarantees
- **Query Complexity**: Need for complex joins and aggregations
- **Team Expertise**: Team has PostgreSQL experience
- **Cost**: Budget constraints favor open-source solutions
- **Compliance**: Must meet financial regulations (SOC 2, PCI DSS)
- **Scalability**: Must handle 10K+ transactions per second

## Options Considered

### Option 1: PostgreSQL
**Pros:**
- Strong ACID guarantees
- Excellent support for complex queries and joins
- JSON support for flexible schema where needed
- Mature ecosystem and tooling
- Team expertise
- Cost-effective (open source)
- Proven at scale (used by major financial institutions)
- Strong backup/recovery options
- Row-level security for multi-tenancy
- Extensions (PostGIS for location data)

**Cons:**
- Vertical scaling limits (eventually need partitioning)
- Write-heavy workloads require tuning
- Complex sharding for extreme scale
- Schema migrations can be complex

### Option 2: MongoDB
**Pros:**
- Flexible schema
- Horizontal scaling built-in
- Good for rapid prototyping
- JSON-native storage

**Cons:**
- Weaker consistency guarantees (eventual consistency)
- Limited transaction support across documents
- Complex queries less efficient than SQL
- Less team expertise
- ACID transactions only within documents
- Financial industry less accepting

### Option 3: MySQL
**Pros:**
- ACID compliant
- Strong relational support
- Large community
- Cost-effective

**Cons:**
- Less feature-rich than PostgreSQL
- Weaker JSON support
- Some features proprietary (in certain versions)
- Team prefers PostgreSQL

## Decision
We will use **PostgreSQL** as our primary database.

## Rationale
1. **ACID Compliance**: PostgreSQL provides the strong consistency and transaction guarantees required for financial data

2. **Complex Queries**: Our domain model has complex relationships (users, accounts, transactions, permissions) that are naturally relational. PostgreSQL's query optimizer and join performance are excellent.

3. **Proven Track Record**: PostgreSQL is battle-tested in financial systems. Companies like Stripe, Robinhood, and Coinbase use PostgreSQL for financial transactions.

4. **Team Expertise**: Our team has 5+ years of PostgreSQL experience. This reduces risk and accelerates development.

5. **Compliance**: PostgreSQL has features (row-level security, audit logging, encryption) that help meet compliance requirements.

6. **Cost**: Open-source with no licensing fees. Cloud providers (AWS RDS, GCP Cloud SQL) offer managed PostgreSQL at reasonable prices.

7. **Future-Proofing**: PostgreSQL scales to our projected needs (10M users, 100M transactions). Sharding strategies exist for extreme scale if needed.

## Consequences

### Positive
- **Data Integrity**: Strong guarantees prevent data corruption
- **Query Performance**: Efficient joins and aggregations
- **Developer Productivity**: Team can move quickly with familiar tech
- **Compliance**: Easier to meet regulatory requirements
- **Tooling**: Excellent monitoring, backup, migration tools available
- **Extensions**: Can add PostGIS, TimescaleDB if needed

### Negative
- **Vertical Scaling Limits**: Will eventually need read replicas and partitioning
- **Schema Changes**: Migrations require planning for large tables
- **Learning Curve**: New team members must learn SQL and relational design
- **Flexibility**: Schema changes slower than schemaless databases

### Risks and Mitigations
| Risk | Mitigation |
|------|------------|
| Performance degradation at scale | Implement connection pooling, read replicas, partitioning strategy from day one |
| Schema migration downtime | Use tools like pg-online-schema-change; plan migrations carefully; use blue-green deployments |
| Vendor lock-in | Use standard SQL; abstract database layer; regular backups |
| Team member unfamiliar with PostgreSQL | Onboarding documentation; pair programming; training budget |

## Implementation Plan
1. **Week 1**: Set up PostgreSQL on staging
   - Configure connection pooling (PgBouncer)
   - Set up automated backups
   - Configure monitoring (pg_stat_statements)

2. **Week 2**: Design schema
   - Create migration strategy
   - Document schema in dbdiagram.io
   - Review with team

3. **Week 3**: Implement core models
   - Users, accounts, transactions
   - Add indexes for common queries
   - Set up audit logging

4. **Week 4**: Performance testing
   - Load test with realistic data
   - Optimize slow queries
   - Tune PostgreSQL configuration

## References
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Use The Index, Luke (SQL Performance)](https://use-the-index-luke.com/)
- [PostgreSQL High Performance Guide](https://www.postgresql.org/docs/current/performance-tips.html)

## Review History
- 2026-05-01: Initial decision
- 2026-06-15: Added performance testing results (decision confirmed)

## Notes
This decision specifically applies to the core transactional database. For analytics and reporting, we may consider a separate data warehouse (e.g., BigQuery, Snowflake) in the future. This would follow a CQRS pattern where PostgreSQL handles writes and the data warehouse handles complex analytics.
```

### Example 3: Runbook Documentation

**Request:**
```
"Create a runbook for handling database failover:

SCENARIOS:
- Primary database becomes unresponsive
- Planned maintenance
- Performance degradation

INCLUDE:
- Symptoms and detection
- Severity assessment
- Step-by-step procedures
- Rollback procedures
- Communication templates
- Post-incident checklist"
```

**High-Quality Result:**
```markdown
# Runbook: PostgreSQL Database Failover

## Overview
This runbook covers procedures for handling PostgreSQL database failover scenarios, including both planned and unplanned events.

**Audience**: On-call engineers, DBAs, DevOps team  
**Last Updated**: 2026-05-05  
**Review Frequency**: Quarterly

## Quick Reference

### Emergency Contacts
- **On-Call Engineer**: PagerDuty rotation
- **Database Team**: #db-team Slack channel
- **Manager**: John Doe (john@example.com, +1-555-0100)
- **AWS Support**: Premium support hotline

### Critical Information
- **Primary DB**: prod-postgres-primary.us-east-1.rds.amazonaws.com
- **Replica DB**: prod-postgres-replica.us-east-1.rds.amazonaws.com
- **Monitoring**: https://grafana.example.com/d/postgres
- **Runbook Location**: /docs/runbooks/database-failover.md

## Scenarios

### Scenario 1: Unplanned Primary Database Outage

#### Detection
**Symptoms:**
- Application errors: "Connection refused" or "Connection timeout"
- Monitoring alerts: "Database connection failed"
- Health check failures: /health endpoint returns 500
- Grafana shows: Connection pool exhausted

**Severity Assessment:**
- **P1 (Critical)**: All database writes failing
- **P2 (High)**: Intermittent failures, degraded performance
- **P3 (Medium)**: Single replica down, primary healthy

#### Immediate Actions (First 5 Minutes)

1. **Acknowledge the alert** (30 seconds)
   ```bash
   # Acknowledge in PagerDuty
   # Post in #incidents Slack channel
   "Database failover in progress. Investigating. Updates every 5 min."
   ```

2. **Verify the outage** (1 minute)
   ```bash
   # Check database connectivity
   psql -h prod-postgres-primary.us-east-1.rds.amazonaws.com \
        -U admin -d production -c "SELECT 1;"
   
   # Check RDS console
   # AWS Console > RDS > prod-postgres-primary > Status
   
   # Check monitoring
   # https://grafana.example.com/d/postgres
   ```

3. **Assess impact** (1 minute)
   - Check error rates in application logs
   - Check user-facing impact in Sentry
   - Estimate number of affected users

4. **Decide on failover** (2 minutes)
   **Fail over if:**
   - Primary unresponsive for >2 minutes
   - RDS shows "Failing" status
   - No signs of automatic recovery
   
   **Wait if:**
   - Intermittent connectivity (may be network blip)
   - RDS shows "Performing automated backup" (wait 5 min)
   - Primary shows signs of recovery

#### Failover Procedure (5-10 Minutes)

**Prerequisites:**
- [ ] Notified #incidents channel
- [ ] Confirmed primary is down
- [ ] Confirmed replica is healthy
- [ ] Second person available to verify steps

**Step-by-Step:**

1. **Enable read-only mode** (1 minute)
   ```bash
   # Prevent new writes during failover
   kubectl set env deployment/api-server READ_ONLY_MODE=true
   
   # Verify
   curl https://api.example.com/health
   # Should show: {"status": "read_only"}
   ```

2. **Verify replica lag** (30 seconds)
   ```bash
   # Check replication lag on replica
   psql -h prod-postgres-replica.us-east-1.rds.amazonaws.com \
        -U admin -d production \
        -c "SELECT NOW() - pg_last_xact_replay_timestamp() AS replication_lag;"
   
   # Acceptable: <10 seconds
   # If >60 seconds: Wait for replica to catch up
   ```

3. **Promote replica to primary** (2 minutes)
   ```bash
   # Via AWS CLI
   aws rds promote-read-replica \
       --db-instance-identifier prod-postgres-replica \
       --region us-east-1
   
   # Monitor promotion status
   aws rds describe-db-instances \
       --db-instance-identifier prod-postgres-replica \
       --query 'DBInstances[0].DBInstanceStatus' \
       --region us-east-1
   
   # Wait for status: "available"
   ```

4. **Update application configuration** (2 minutes)
   ```bash
   # Update Kubernetes secret
   kubectl create secret generic database-url \
       --from-literal=url="postgresql://prod-postgres-replica.us-east-1.rds.amazonaws.com:5432/production" \
       --dry-run=client -o yaml | kubectl apply -f -
   
   # Restart application pods
   kubectl rollout restart deployment/api-server
   kubectl rollout status deployment/api-server
   
   # Verify pods connecting to new primary
   kubectl logs -l app=api-server --tail=20 | grep "Database connected"
   ```

5. **Disable read-only mode** (30 seconds)
   ```bash
   kubectl set env deployment/api-server READ_ONLY_MODE=false
   
   # Verify write capability
   curl -X POST https://api.example.com/api/health-check/write-test
   ```

6. **Verify system health** (2 minutes)
   ```bash
   # Check application health
   curl https://api.example.com/health
   # Expected: {"status": "healthy", "database": "connected"}
   
   # Check error rates
   # Grafana: https://grafana.example.com/d/api-errors
   # Expected: Error rate back to normal (<0.1%)
   
   # Check database connections
   psql -h prod-postgres-replica.us-east-1.rds.amazonaws.com \
        -U admin -d production \
        -c "SELECT count(*) FROM pg_stat_activity WHERE state = 'active';"
   ```

#### Communication

**Initial Alert (Within 2 minutes):**
```
Subject: [P1] Database Failover in Progress

We are experiencing a database outage. The team is performing a failover to our replica database.

Impact: All write operations are temporarily unavailable. Read operations may be degraded.
ETA: Failover expected to complete within 10 minutes.
Updates: Every 5 minutes in #incidents

Actions:
- Acknowledged alert: [Engineer Name] @ [Time]
- Failover initiated: [Time]
- Expected resolution: [Time + 10min]
```

**Resolution (After successful failover):**
```
Subject: [RESOLVED] Database Failover Complete

The database failover has been completed successfully. All systems are operational.

Timeline:
- Outage detected: [Time]
- Failover initiated: [Time]
- System restored: [Time]
- Total duration: [X] minutes

Impact: ~[X] users experienced errors during failover window.

Next Steps:
- Root cause analysis: [Date]
- Post-mortem: [Date]
- Old primary investigation: In progress
```

#### Post-Failover Checklist

- [ ] Verify all services healthy
- [ ] Check error logs for anomalies
- [ ] Monitor database performance
- [ ] Create new read replica
- [ ] Schedule post-mortem
- [ ] Update incident log
- [ ] Notify stakeholders of resolution

### Scenario 2: Planned Maintenance Failover

#### Preparation (1 week before)

1. **Schedule maintenance window** (Week -1)
   - Choose low-traffic time (Sunday 2-4 AM EST)
   - Notify team via email and Slack
   - Create calendar holds for on-call engineers

2. **Verify replica health** (Day -1)
   ```bash
   # Check replication lag
   # Check replica disk space
   # Verify backup recency
   ```

3. **Prepare rollback plan** (Day -1)
   - Document steps to revert
   - Test failback procedure in staging

#### Execution (Maintenance window)

Follow same failover procedure as unplanned outage, but with:
- No time pressure
- Advance notification to users
- Scheduled downtime window
- Full team available

## Rollback Procedure

If issues arise after failover:

1. **Stop all writes immediately**
   ```bash
   kubectl set env deployment/api-server READ_ONLY_MODE=true
   ```

2. **Assess data consistency**
   - Check for split-brain scenarios
   - Verify no writes went to old primary
   - Compare transaction IDs

3. **Fail back to original primary** (if healthy)
   - Only if new primary is corrupted
   - Only if no writes occurred on new primary
   - Follow same failover procedure in reverse

## Common Issues

### Issue: Replica lag too high
**Solution:**
- Wait for replica to catch up
- If urgent, proceed with failover but expect small data loss
- Document lost transaction window

### Issue: Application can't connect to new primary
**Solution:**
- Verify DNS propagation
- Check security groups
- Verify connection string format
- Check application logs for specific errors

### Issue: Performance degraded after failover
**Solution:**
- Check connection pool settings
- Verify replica was properly sized
- Run VACUUM ANALYZE
- Check for missing indexes

## Testing

**Quarterly drill:**
- Perform planned failover in staging
- Time each step
- Update runbook based on learnings
- Train new team members

## Appendix

### Useful Commands
```bash
# Check replication status
SELECT * FROM pg_stat_replication;

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check database size
SELECT pg_database_size('production');

# Check slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Related Runbooks
- Database Performance Degradation
- Connection Pool Exhaustion
- Backup and Recovery
```

## Metrics for Success

### Documentation Quality Metrics

1. **Documentation Coverage**
   - Target: >80% of public APIs documented
   - Measure: Documented functions / total public functions

2. **Documentation Accuracy**
   - Target: <5% outdated documentation
   - Measure: Incorrect docs / total docs

3. **Time to Onboard**
   - Target: <1 week for new developers
   - Measure: Time until productive contribution

4. **Documentation Usage**
   - Target: >70% of questions answered by docs
   - Measure: Questions in docs vs. Slack/email

## Conclusion

Comprehensive documentation is essential for maintaining AI-generated code. Always request documentation alongside implementation, keep it updated, and make it accessible to all team members. Good documentation saves time, reduces errors, and improves team productivity.
