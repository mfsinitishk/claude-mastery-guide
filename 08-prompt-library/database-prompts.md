# Database Prompts

Prompts for database design, optimization, and management.

## Table of Contents
- [Database Design](#database-design)
- [Query Optimization](#query-optimization)
- [Database Administration](#database-administration)

---

## Database Design

### 1. Database Schema Design
```
Design database schema for:

Domain: [business domain]
Entities: [list main entities]
Relationships: [how entities relate]
Requirements: [performance, scale, etc]
Database Type: [SQL/NoSQL]

Design:
1. Entity-relationship diagram (textual)
2. Table/collection definitions
3. Primary and foreign keys
4. Indexes
5. Constraints
6. Data types
7. Normalization level
8. Partitioning strategy (if needed)
9. Migration scripts
10. Sample queries
```

**Usage Context**: Designing new database schemas.

**Example Output**:
```sql
-- E-commerce Database Schema

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_category (category_id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Orders table
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_status (status),
    FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_status CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'))
);

-- Order items table
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Indexing Strategy:
-- 1. Primary keys: Automatic B-tree indexes
-- 2. Foreign keys: Indexed for join performance
-- 3. Commonly filtered fields: status, email, sku
-- 4. Composite index: (user_id, created_at) for user's order history
```

---

### 2. NoSQL Schema Design
```
Design NoSQL schema for:

Database: [MongoDB/Cassandra/DynamoDB/etc]
Domain: [business domain]
Access Patterns: [how data will be queried]
Scale: [expected data volume]

Design:
1. Collection/table structure
2. Document/record schema
3. Embedded vs referenced data
4. Indexes
5. Sharding key (if applicable)
6. Denormalization strategy
7. Query patterns
8. Consistency model
9. Sample documents
```

**Usage Context**: Designing NoSQL databases.

---

### 3. Database Migration
```
Create database migration for:

Current State: [current schema]
Desired State: [new schema]
Database: [type]
Constraints: [zero downtime, etc]

Create:
1. Migration scripts (up and down)
2. Data transformation logic
3. Index creation (concurrent if needed)
4. Rollback procedure
5. Testing strategy
6. Deployment plan
7. Performance considerations
```

**Usage Context**: Planning schema changes.

---

## Query Optimization

### 4. SQL Query Optimization
```
Optimize this SQL query:

Query: [paste SQL]
Database: [PostgreSQL/MySQL/etc]
Schema: [relevant table structures]
Query Plan: [EXPLAIN output]
Performance: [current execution time]

Optimize:
1. Query rewrite
2. Index recommendations
3. Join optimization
4. Subquery elimination
5. Query plan analysis
6. Statistics update
7. Expected improvement
```

**Usage Context**: Fixing slow queries.

---

### 5. Index Strategy
```
Design indexing strategy for:

Tables: [list tables]
Query Patterns: [common queries]
Database: [type]
Constraints: [write vs read ratio]

Design:
1. Single-column indexes
2. Composite indexes
3. Covering indexes
4. Partial indexes
5. Index order for composites
6. Index maintenance strategy
7. Trade-offs analysis
```

**Usage Context**: Planning database indexes.

---

### 6. Query Performance Analysis
```
Analyze query performance:

Queries: [paste slow queries]
Database: [type]
Query Plans: [EXPLAIN output]
Metrics: [execution time, rows scanned]

Analyze:
1. Execution plan breakdown
2. Bottlenecks identification
3. Index usage
4. Table scan vs index scan
5. Join efficiency
6. Optimization opportunities
7. Expected improvements
```

**Usage Context**: Understanding query performance.

---

## Database Administration

### 7. Database Backup Strategy
```
Design backup strategy for:

Database: [type]
Size: [database size]
RTO/RPO: [recovery objectives]
Environment: [on-prem/cloud]

Design:
1. Backup types (full/incremental/differential)
2. Backup frequency
3. Retention policy
4. Backup storage
5. Encryption
6. Testing procedure
7. Restore procedure
8. Disaster recovery plan
```

**Usage Context**: Planning backups.

---

### 8. Database Partitioning
```
Design partitioning strategy for:

Table: [table name]
Size: [current and projected]
Access Pattern: [how data is queried]
Database: [type]

Design:
1. Partition type (range/list/hash)
2. Partition key selection
3. Number of partitions
4. Partition maintenance
5. Query modifications
6. Migration from non-partitioned
7. Performance expectations
```

**Usage Context**: Implementing table partitioning.

---

## Database Prompt Template

```
DATABASE REQUEST:

Type:
[SQL/NoSQL - specific database]

Purpose:
[schema design/optimization/migration]

Domain:
[business domain and requirements]

Current State (if applicable):
[existing schema or queries]

Requirements:
- Scale: [data volume, growth rate]
- Performance: [latency requirements]
- Access Patterns: [how data is accessed]
- Consistency: [ACID/eventual]
- Availability: [uptime requirements]

Constraints:
[zero downtime, backward compatibility, etc]

Please Provide:
1. Design or optimizations
2. SQL/schema definitions
3. Migration approach
4. Performance analysis
5. Trade-offs
6. Testing strategy
```

## Best Practices

1. **Specify Database Type**: PostgreSQL vs MySQL vs MongoDB
2. **Include Access Patterns**: How data will be queried
3. **Mention Scale**: Current and projected size
4. **Request Query Plans**: EXPLAIN output for analysis
5. **Define Constraints**: Downtime, compatibility
6. **Ask for Trade-offs**: Understand compromises
7. **Include Performance Metrics**: Current vs target
8. **Request Migration Path**: How to get from A to B
