# Database Engineering with Claude

## Overview

Database engineering encompasses schema design, query optimization, migration management, performance tuning, and data integrity. Claude assists with creating normalized schemas, optimizing complex queries, writing migrations, and troubleshooting performance issues.

## Common Challenges

- **Schema Design**: Creating normalized, scalable database structures
- **Query Optimization**: Improving slow queries and reducing database load  
- **Migration Management**: Safe schema changes without downtime
- **Data Integrity**: Maintaining referential integrity and constraints
- **Performance Tuning**: Optimizing indexes, connections, and caching
- **Backup and Recovery**: Ensuring data safety and disaster recovery

## Sample Prompts

### Schema Design
```
Design a PostgreSQL schema for a multi-tenant SaaS CRM:

Entities:
- Organizations (tenants)
- Users (multiple orgs)
- Contacts
- Deals (with stages)
- Activities (calls, emails, meetings)
- Custom fields per organization

Requirements:
- Tenant isolation
- Soft deletes
- Audit trail
- Full-text search
- Optimized for reporting queries

Include indexes, constraints, and partitioning strategy.
```

### Query Optimization
```
Optimize this slow query:

SELECT u.*, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
  AND EXISTS (SELECT 1 FROM orders WHERE user_id = u.id AND status = 'completed')
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 100;

Provide:
- Optimized query
- Required indexes
- Explain plan analysis
- Alternative approaches (CTEs, subqueries, window functions)
```

### Migration Scripts
```
Create a zero-downtime migration to add a new column with default value:

Table: users (10M rows)
Change: Add column 'subscription_tier' (enum: free, pro, enterprise)
Default: 'free'

Include:
- PostgreSQL migration
- Backfill strategy
- Rollback procedure
- Performance considerations
- Index creation
```

### Performance Tuning
```
Database: PostgreSQL 15, 500GB data, 1000 queries/sec

Issues:
- Slow query response times (>1s for reports)
- Connection pool exhaustion
- High CPU during business hours
- Disk I/O spikes

Analyze and provide:
- Configuration tuning (shared_buffers, work_mem, etc.)
- Connection pooling setup (PgBouncer)
- Query optimization suggestions
- Index recommendations
- Partitioning strategy
- Caching approach (Redis)
```

## Real Example: E-Commerce Database

```sql
-- Schema Design
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(organization_id, email)
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    inventory_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024_q1 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE orders_2024_q2 PARTITION OF orders
    FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Indexes
CREATE INDEX idx_users_org_id ON users(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_org_id ON products(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Full-text search
ALTER TABLE products ADD COLUMN search_vector tsvector;
CREATE INDEX idx_products_search ON products USING gin(search_vector);

CREATE OR REPLACE FUNCTION products_search_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_search_update BEFORE INSERT OR UPDATE
  ON products FOR EACH ROW EXECUTE FUNCTION products_search_trigger();
```

## Best Practices

1. **Schema Design**: Normalize to 3NF, denormalize for performance only when measured
2. **Indexing**: Index foreign keys, WHERE clauses, ORDER BY columns
3. **Constraints**: Use database constraints for data integrity
4. **Partitioning**: Partition large tables by time or tenant
5. **Migrations**: Always test migrations on production-like data
6. **Backups**: Automated daily backups with point-in-time recovery
7. **Monitoring**: Track slow queries, connection pool, cache hit rates

## Metrics

- **Query Performance**: 95% of queries < 100ms
- **Index Hit Rate**: > 99%
- **Connection Pool**: < 80% utilization
- **Backup Recovery Time**: < 4 hours for full restore
- **Migration Downtime**: Zero downtime for schema changes

## Tools

- **PostgreSQL / MySQL / MongoDB**
- **Prisma / TypeORM / Sequelize**: ORMs
- **PgBouncer / ProxySQL**: Connection pooling
- **pgAdmin / DBeaver**: Management tools
- **Flyway / Liquibase**: Migration management
- **Datadog / New Relic**: Database monitoring

## Conclusion

Claude accelerates database engineering by generating optimized schemas, identifying performance bottlenecks, and creating safe migration scripts. Success requires combining AI assistance with database expertise, performance testing, and production monitoring.
