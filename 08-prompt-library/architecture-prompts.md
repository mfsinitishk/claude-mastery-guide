# Architecture Prompts

Prompts for analyzing, designing, and improving software architecture.

## Table of Contents
- [System Design](#system-design)
- [Architecture Analysis](#architecture-analysis)
- [Scalability](#scalability)
- [Architecture Patterns](#architecture-patterns)

---

## System Design

### 1. High-Level System Design
```
Design a system for [application description]:

Requirements:
- Users: [expected user count]
- Key Features: [list main features]
- Performance: [latency, throughput requirements]
- Scale: [requests/day, data volume]
- Reliability: [uptime, consistency needs]

Please provide:
1. High-level architecture diagram (textual)
2. Component breakdown
3. Technology stack recommendations
4. Data flow description
5. API design outline
6. Deployment architecture
7. Scaling considerations
```

**Usage Context**: Starting a new project or redesigning existing system.

**Example Input**:
```
Design a system for a real-time collaborative document editor like Google Docs:

Requirements:
- Users: 1M active users, 100K concurrent
- Key Features: Real-time editing, version history, comments, sharing
- Performance: <100ms latency for edits, real-time sync
- Scale: 10M documents, 1B operations/day
- Reliability: 99.9% uptime, eventual consistency OK for non-critical features
```

**Example Output**:
```
High-Level Architecture:

1. Client Layer
   - Web app (React/Vue)
   - WebSocket connections for real-time updates
   - Offline-first with local storage

2. API Gateway
   - Load balancing
   - Authentication/Authorization
   - Rate limiting
   - WebSocket connection handling

3. Application Services
   - Document Service (CRUD operations)
   - Collaboration Service (operational transformation)
   - Version Control Service (change tracking)
   - Notification Service (comments, mentions)

4. Real-Time Layer
   - WebSocket servers (Socket.io/SignalR)
   - Redis Pub/Sub for message distribution
   - Operational Transform engine

5. Data Layer
   - PostgreSQL (document metadata, users)
   - MongoDB (document content, versions)
   - Redis (active sessions, presence)
   - S3 (document snapshots, exports)

6. Infrastructure
   - Kubernetes for orchestration
   - CloudFront CDN
   - Multi-region deployment
```

**Tips for Customization**:
- Specify cloud provider preferences (AWS/Azure/GCP)
- Mention budget constraints
- Include compliance requirements (HIPAA, GDPR)
- State team expertise level

---

### 2. Microservices Architecture Design
```
Design microservices architecture for [application]:

Current State: [monolith/existing services]
Business Domains: [list domains]
Team Structure: [number and size of teams]

Design:
1. Service boundaries (bounded contexts)
2. Communication patterns (sync/async)
3. Data ownership per service
4. API gateway strategy
5. Service discovery approach
6. Inter-service communication
7. Shared infrastructure services
8. Migration strategy (if from monolith)
```

**Usage Context**: Breaking down monolith or designing service-oriented architecture.

**Language Variations**:
- **Java**: Spring Boot, Spring Cloud ecosystem
- **.NET**: .NET Core, Dapr patterns
- **Node.js**: Express, NestJS patterns
- **Go**: Go-kit, gRPC patterns

**Common Mistakes to Avoid**:
- Too many small services (distributed monolith)
- Sharing databases between services
- Synchronous coupling everywhere
- Ignoring distributed transaction complexity

---

### 3. Event-Driven Architecture
```
Design event-driven architecture for [system]:

Use Cases: [scenarios requiring events]
Event Sources: [what generates events]
Event Consumers: [who needs to react]
Consistency Requirements: [eventual/strong]

Design:
1. Event schema and naming
2. Event broker selection (Kafka/RabbitMQ/etc)
3. Event sourcing approach (if applicable)
4. CQRS pattern implementation
5. Saga pattern for distributed transactions
6. Event versioning strategy
7. Error handling and dead letter queues
8. Event replay and recovery
```

**Usage Context**: Designing asynchronous, decoupled systems.

**Example Input**:
```
Design event-driven architecture for an e-commerce order system:

Use Cases: Order placement, payment, inventory, shipping, notifications
Event Sources: Order service, payment service, inventory service
Event Consumers: Multiple services need order events
Consistency Requirements: Eventual consistency acceptable, idempotency required
```

---

### 4. API Architecture Design
```
Design API architecture for [application]:

API Type: [REST/GraphQL/gRPC]
Consumers: [web/mobile/third-party]
Auth Requirements: [authentication needs]
Scale: [requests/second]

Design:
1. API structure and endpoints
2. Authentication/authorization strategy
3. Versioning approach
4. Rate limiting and throttling
5. Caching strategy
6. Error handling standards
7. Documentation approach
8. SDK/client library needs
9. Backward compatibility plan
```

**Usage Context**: Designing public or internal APIs.

**Tips for Customization**:
- Specify OpenAPI/Swagger requirements
- Mention existing API standards in organization
- Include SLA requirements

---

## Architecture Analysis

### 5. Architecture Review
```
Review this architecture for potential issues:

Current Architecture: [describe or paste diagram]
Technologies: [list tech stack]
Scale: [current and projected]
Pain Points: [known issues]

Analyze:
1. Architecture smells and anti-patterns
2. Single points of failure
3. Scalability bottlenecks
4. Security concerns
5. Operational complexity
6. Technology choices appropriateness
7. Cost optimization opportunities
8. Improvement recommendations (prioritized)
```

**Usage Context**: Auditing existing architecture.

**Example Input**:
```
Current Architecture:
- Monolithic Java application
- Single PostgreSQL database
- All services in one codebase
- Deployed on single EC2 instance
- 10K users, growing 50% yearly
- Response times degrading
- Deployment takes 2 hours, downtime required
```

**Common Mistakes to Avoid**:
- Not providing enough context about business requirements
- Omitting current pain points
- Not mentioning team size and capabilities

---

### 6. Technology Stack Evaluation
```
Evaluate technology choices for [project]:

Current/Proposed Stack:
- Frontend: [tech]
- Backend: [tech]
- Database: [tech]
- Infrastructure: [tech]

Evaluate against:
1. Team expertise
2. Performance requirements
3. Scalability needs
4. Community support and ecosystem
5. Long-term maintainability
6. Hiring and training considerations
7. Total cost of ownership
8. Alternative recommendations
```

**Usage Context**: Validating technology decisions.

---

### 7. Database Architecture Review
```
Review database architecture:

Current Setup:
- Database Type: [SQL/NoSQL/both]
- Schema: [describe key tables/collections]
- Access Patterns: [common queries]
- Scale: [data volume, query volume]
- Performance Issues: [if any]

Analyze:
1. Data model appropriateness
2. Indexing strategy
3. Partitioning/sharding needs
4. Read/write scalability
5. Backup and recovery
6. Caching opportunities
7. Query optimization
8. Alternative database suggestions
```

**Usage Context**: Optimizing database layer.

**Tips for Customization**:
- Include query patterns and frequencies
- Mention read vs write ratio
- Add data growth projections

---

### 8. Security Architecture Assessment
```
Assess security architecture:

System: [description]
Current Security Measures: [list what's in place]
Sensitive Data: [types of data handled]
Compliance: [requirements like PCI, HIPAA]

Evaluate:
1. Authentication and authorization
2. Data encryption (at rest and in transit)
3. Network security
4. API security
5. Secret management
6. Audit logging
7. Vulnerability management
8. Security gaps and recommendations
```

**Usage Context**: Security audit of architecture.

---

## Scalability

### 9. Horizontal Scaling Strategy
```
Design horizontal scaling approach for:

Component: [service/database/etc]
Current Capacity: [throughput, users]
Target Capacity: [desired scale]
State: [stateless/stateful]

Design:
1. Stateless component design
2. Load balancing strategy
3. Session management
4. Database scaling (read replicas, sharding)
5. Cache distribution
6. Auto-scaling triggers
7. Configuration management
8. Deployment strategy
```

**Usage Context**: Planning for growth.

**Example Input**:
```
Component: Web API service
Current: 100 req/sec, 1 server
Target: 10,000 req/sec
State: Currently stateful (in-memory sessions)
```

---

### 10. Caching Architecture
```
Design comprehensive caching strategy:

Application: [description]
Data Types: [what needs caching]
Access Patterns: [read frequency, update frequency]
Consistency: [requirements]

Design:
1. Cache layers (CDN, application, database)
2. Cache technology selection
3. Cache invalidation strategy
4. TTL policies
5. Cache warming approach
6. Fallback handling
7. Cache stampede prevention
8. Monitoring and metrics
```

**Usage Context**: Improving performance through caching.

**Language Variations**:
- **Redis**: Most common distributed cache
- **Memcached**: Simple key-value caching
- **Hazelcast**: Java-specific distributed caching
- **CDN**: Cloudflare, CloudFront, Akamai

---

### 11. Database Sharding Strategy
```
Design database sharding approach:

Database: [type]
Current Size: [data volume]
Growth Rate: [projection]
Access Patterns: [queries]

Design:
1. Sharding key selection
2. Sharding algorithm (range/hash/geographic)
3. Shard count and sizing
4. Cross-shard queries handling
5. Rebalancing strategy
6. Application-level changes
7. Migration approach
8. Backup and recovery per shard
```

**Usage Context**: Scaling database beyond single server.

---

## Architecture Patterns

### 12. CQRS Implementation
```
Implement CQRS pattern for:

Domain: [business domain]
Read Requirements: [query patterns]
Write Requirements: [command patterns]
Consistency: [immediate/eventual]

Design:
1. Command model
2. Query model
3. Synchronization mechanism
4. Event store (if event sourcing)
5. Read model updates
6. Technology choices
7. Complexity vs benefits analysis
```

**Usage Context**: Separating read and write models.

**Common Mistakes to Avoid**:
- Using CQRS everywhere (only use where needed)
- Over-complicating simple domains
- Not handling eventual consistency properly

---

### 13. Circuit Breaker Pattern
```
Implement circuit breaker for resilience:

Service: [calling service]
Dependencies: [external services called]
Failure Modes: [types of failures]

Implement:
1. Circuit breaker configuration
2. Failure thresholds
3. Timeout settings
4. Fallback strategies
5. Half-open state handling
6. Monitoring and alerting
7. Testing approach
```

**Usage Context**: Building fault-tolerant service communication.

---

### 14. API Gateway Pattern
```
Design API Gateway:

Backend Services: [list services]
Clients: [web/mobile/third-party]
Requirements: [auth, rate limiting, etc]

Design:
1. Routing rules
2. Authentication/authorization
3. Request/response transformation
4. Rate limiting and throttling
5. Caching at gateway
6. Service aggregation
7. Technology choice (Kong, Apigee, custom)
8. High availability setup
```

**Usage Context**: Unifying access to microservices.

---

### 15. Strangler Fig Pattern
```
Design migration strategy using Strangler Fig pattern:

Legacy System: [description]
Target System: [new architecture]
Migration Constraints: [timeline, risk tolerance]

Design:
1. Functionality prioritization for migration
2. Proxy/routing layer
3. Phase-by-phase migration plan
4. Data synchronization strategy
5. Rollback plan
6. Testing strategy
7. Feature flag approach
8. Success metrics
```

**Usage Context**: Incremental migration from legacy systems.

**Tips for Customization**:
- Include business continuity requirements
- Mention team capacity for parallel maintenance
- Add regulatory constraints

---

## Architecture Documentation Template

```
ARCHITECTURE DESIGN REQUEST:

System Overview:
- Purpose: [what the system does]
- Users: [who uses it]
- Scale: [usage metrics]

Requirements:
- Functional: [key features]
- Non-Functional:
  - Performance: [latency, throughput]
  - Scalability: [growth expectations]
  - Availability: [uptime requirements]
  - Security: [compliance, sensitivity]
  - Maintainability: [team size, skills]

Constraints:
- Technology: [must use / cannot use]
- Budget: [infrastructure costs]
- Timeline: [when needed]
- Team: [current expertise]

Please Provide:
1. Architecture overview
2. Component design
3. Data architecture
4. API design
5. Deployment architecture
6. Scalability approach
7. Security measures
8. Operational considerations
9. Trade-offs and alternatives considered
10. Migration plan (if applicable)
```

## Best Practices for Architecture Prompts

1. **Provide Business Context**: Explain why, not just what
2. **Quantify Requirements**: Use numbers for scale, performance, availability
3. **State Constraints**: Technology, budget, team, timeline
4. **Include Current State**: For migrations or improvements
5. **Request Trade-off Analysis**: Ask for pros/cons of approaches
6. **Consider Operations**: Ask about monitoring, deployment, maintenance
7. **Think Long-term**: Mention growth projections and evolution
8. **Be Realistic**: Match complexity to actual needs
