# Performance Optimization Best Practices

## Overview

Performance optimization with AI-assisted development requires understanding both code efficiency and how to effectively communicate performance requirements to Claude. This guide covers strategies for generating high-performance code and optimizing existing implementations.

## Core Principles

### 1. Measure Before Optimizing

Never optimize without data. Always profile first.

**Key Practices:**
- Profile before changes
- Establish baselines
- Measure after optimization
- Compare results objectively
- Document improvements

### 2. Optimize Critical Paths

Focus on code that runs frequently or blocks users.

**Priority Order:**
1. User-facing operations
2. High-frequency operations
3. Resource-intensive operations
4. Background tasks

### 3. Trade-offs Understanding

Performance optimization involves trade-offs.

**Common Trade-offs:**
- Speed vs. memory
- Latency vs. throughput
- Complexity vs. performance
- Development time vs. execution time

## Do's and Don'ts

### Performance Requirements

#### Do's

- **Specify performance targets:**
  ```
  "Optimize search endpoint with targets:
  - P95 response time <200ms
  - P99 response time <500ms
  - Handle 1000 req/s
  - Memory usage <100MB per request
  - Database queries <5 per request
  
  Current performance:
  - P95: 2.3s
  - P99: 4.1s
  - Max throughput: 50 req/s"
  ```

- **Request profiling approach:**
  ```
  "Before optimizing, profile the search function:
  1. Use Chrome DevTools Performance panel
  2. Identify bottlenecks
  3. Measure database query times
  4. Check memory allocations
  5. Document findings
  
  Then propose optimizations based on data"
  ```

- **Demand benchmarks:**
  ```
  "Create performance benchmarks:
  - Test with 100, 1K, 10K, 100K records
  - Measure response time, memory, CPU
  - Compare before/after optimization
  - Use Apache Bench or Artillery
  - Include results in PR"
  ```

#### Don'ts

- **Don't optimize prematurely:**
  ```
  DON'T: "Make this as fast as possible"
  DO: "Profile first, optimize if P95 >200ms"
  ```

- **Don't sacrifice readability:**
  ```
  DON'T: "Use every optimization trick possible"
  DO: "Optimize hot paths, keep readable code elsewhere"
  ```

## Real-World Examples

### Example 1: Database Query Optimization

**Request:**
```
"Optimize slow user search query:

CURRENT IMPLEMENTATION:
```sql
SELECT u.*, p.*, a.* 
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN addresses a ON u.id = a.user_id
WHERE u.email LIKE '%@example.com'
   OR u.name LIKE '%John%'
ORDER BY u.created_at DESC
LIMIT 20 OFFSET 0;
```

PERFORMANCE:
- Execution time: 3.2s
- Rows scanned: 2M
- Database: PostgreSQL 14

REQUIREMENTS:
- Target: <100ms
- Maintain functionality
- Explain optimization strategy
```

**High-Quality Result:**
```sql
-- OPTIMIZATION ANALYSIS:
-- 
-- Issues identified:
-- 1. LIKE with leading wildcard prevents index usage
-- 2. Multiple JOINs load unnecessary data
-- 3. No indexes on search columns
-- 4. OR condition prevents index usage
-- 5. OFFSET becomes slow with large offsets

-- RECOMMENDED INDEXES:
CREATE INDEX idx_users_email_trgm ON users USING gin(email gin_trgm_ops);
CREATE INDEX idx_users_name_trgm ON users USING gin(name gin_trgm_ops);
CREATE INDEX idx_users_created_at_desc ON users(created_at DESC);

-- OPTIMIZED QUERY (for email domain search):
SELECT 
  u.id,
  u.email,
  u.name,
  u.created_at,
  jsonb_build_object(
    'bio', p.bio,
    'avatar', p.avatar_url
  ) as profile,
  jsonb_agg(
    jsonb_build_object(
      'street', a.street,
      'city', a.city
    )
  ) as addresses
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN addresses a ON u.id = a.user_id
WHERE u.email ILIKE '%@example.com'
GROUP BY u.id, u.email, u.name, u.created_at, p.bio, p.avatar_url
ORDER BY u.created_at DESC
LIMIT 20;

-- BETTER: Use domain column if searching by domain frequently
ALTER TABLE users ADD COLUMN email_domain TEXT;
CREATE INDEX idx_users_email_domain ON users(email_domain);

UPDATE users SET email_domain = split_part(email, '@', 2);

-- Then search becomes:
SELECT u.id, u.email, u.name
FROM users u
WHERE u.email_domain = 'example.com'
ORDER BY u.created_at DESC
LIMIT 20;

-- OPTIMIZATION FOR NAME SEARCH:
-- Use full-text search instead of LIKE
ALTER TABLE users ADD COLUMN name_search tsvector;

UPDATE users SET name_search = to_tsvector('english', name);

CREATE INDEX idx_users_name_search ON users USING gin(name_search);

SELECT u.id, u.email, u.name
FROM users u
WHERE name_search @@ to_tsquery('english', 'John:*')
ORDER BY u.created_at DESC
LIMIT 20;

-- CURSOR-BASED PAGINATION (better than OFFSET for large datasets):
-- First page:
SELECT u.id, u.email, u.name, u.created_at
FROM users u
WHERE u.email_domain = 'example.com'
ORDER BY u.created_at DESC, u.id DESC
LIMIT 20;

-- Next pages (using last created_at and id as cursor):
SELECT u.id, u.email, u.name, u.created_at
FROM users u
WHERE u.email_domain = 'example.com'
  AND (u.created_at, u.id) < ('2026-05-01 10:00:00', 'last_id')
ORDER BY u.created_at DESC, u.id DESC
LIMIT 20;

-- EXPECTED IMPROVEMENT:
-- Query time: 3.2s → <50ms (98% improvement)
-- Index scan instead of sequential scan
-- Minimal rows examined
```

### Example 2: API Response Time Optimization

**Request:**
```
"Optimize API endpoint response time:

ENDPOINT: GET /api/users/:id/dashboard
CURRENT: 1.8s average response time
TARGET: <200ms

WHAT IT DOES:
1. Fetch user profile
2. Get recent activities (last 50)
3. Calculate statistics
4. Get notifications (unread count)
5. Get friend suggestions

Analyze and optimize"
```

**High-Quality Result:**
```typescript
// ANALYSIS:
// Original implementation makes sequential calls (waterfall)
// Each operation takes: Profile(200ms) + Activities(600ms) + 
// Stats(800ms) + Notifications(100ms) + Suggestions(400ms) = 2.1s

// OPTIMIZATION 1: Parallel Execution
async function getUserDashboard(userId: string): Promise<Dashboard> {
  // Execute all queries in parallel
  const [profile, activities, stats, notifications, suggestions] = 
    await Promise.all([
      getUserProfile(userId),
      getRecentActivities(userId, 50),
      calculateStatistics(userId),
      getUnreadNotifications(userId),
      getFriendSuggestions(userId)
    ]);

  return {
    profile,
    activities,
    stats,
    notifications,
    suggestions
  };
}
// Expected improvement: 2.1s → ~800ms (slowest query)

// OPTIMIZATION 2: Caching
import { Redis } from 'ioredis';
const redis = new Redis();

async function getUserDashboard(userId: string): Promise<Dashboard> {
  // Check cache first
  const cacheKey = `dashboard:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  // Parallel execution
  const dashboard = await Promise.all([...]);

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(dashboard));

  return dashboard;
}
// Expected improvement: Cache hit <10ms, Miss ~800ms

// OPTIMIZATION 3: Query Optimization
async function getRecentActivities(
  userId: string, 
  limit: number
): Promise<Activity[]> {
  // Original: Multiple queries
  // Optimized: Single query with JOIN
  
  return db.query(`
    SELECT 
      a.id,
      a.type,
      a.created_at,
      jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'avatar', u.avatar_url
      ) as actor
    FROM activities a
    JOIN users u ON a.actor_id = u.id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2
  `, [userId, limit]);
}
// Expected improvement: 600ms → 150ms

// OPTIMIZATION 4: Incremental Statistics
// Instead of calculating on every request
async function calculateStatistics(userId: string): Promise<Stats> {
  // Check if stats are current (updated in background job)
  const stats = await redis.get(`stats:${userId}`);
  
  if (stats) {
    const parsed = JSON.parse(stats);
    
    // If less than 1 hour old, use cached
    if (Date.now() - parsed.timestamp < 3600000) {
      return parsed.data;
    }
  }

  // Calculate and cache
  const computed = await computeStats(userId);
  await redis.setex(
    `stats:${userId}`,
    3600, // 1 hour
    JSON.stringify({
      data: computed,
      timestamp: Date.now()
    })
  );

  return computed;
}

// Background job updates stats periodically
setInterval(async () => {
  const activeUsers = await getActiveUsers();
  for (const user of activeUsers) {
    await calculateStatistics(user.id);
  }
}, 300000); // Every 5 minutes

// OPTIMIZATION 5: Lazy Loading
interface Dashboard {
  profile: Profile;
  activities: Activity[];
  // Load these only when user expands section
  stats?: Stats;
  notifications?: Notification[];
  suggestions?: User[];
}

// Initial load only essential data
async function getDashboardInitial(userId: string): Promise<Dashboard> {
  const [profile, activities] = await Promise.all([
    getUserProfile(userId),
    getRecentActivities(userId, 50)
  ]);

  return { profile, activities };
}

// Separate endpoints for on-demand data
app.get('/api/users/:id/dashboard/stats', async (req, res) => {
  const stats = await calculateStatistics(req.params.id);
  res.json(stats);
});

// FINAL ARCHITECTURE:
// 
// 1. Initial load (critical path): <200ms
//    - Profile (cached): 10ms
//    - Activities (optimized query): 150ms
//
// 2. Secondary data (loaded on demand):
//    - Stats (cached): <50ms
//    - Notifications (simple count): <30ms
//    - Suggestions (cached): <80ms
//
// Total improvement: 1.8s → <200ms (89% faster)

// MONITORING:
const metrics = {
  'dashboard.load.time': async (duration: number) => {
    statsd.timing('dashboard.load', duration);
  },
  'dashboard.cache.hit': () => {
    statsd.increment('dashboard.cache.hit');
  },
  'dashboard.cache.miss': () => {
    statsd.increment('dashboard.cache.miss');
  }
};

// Add to dashboard function
const startTime = Date.now();
const result = await getUserDashboard(userId);
const duration = Date.now() - startTime;
metrics['dashboard.load.time'](duration);
```

## Advanced Techniques

### 1. Request Profiling and Bottleneck Analysis

```
"Profile the checkout flow and identify bottlenecks:

FLOW:
1. Validate cart items
2. Check inventory
3. Calculate tax
4. Process payment
5. Create order
6. Send confirmation email
7. Update inventory

REQUIREMENTS:
- Use Chrome DevTools
- Identify slowest operations
- Measure each step
- Propose targeted optimizations
- Keep transaction integrity"
```

### 2. Memory Optimization

```
"Optimize memory usage for large dataset processing:

CURRENT:
- Processing 1M records
- Loading all into memory
- Memory usage: 2GB
- OOM errors on large datasets

OPTIMIZE:
- Stream processing
- Batch operations
- Memory-efficient data structures
- Garbage collection tuning
- Monitor heap usage"
```

### 3. Caching Strategy

```
"Design caching strategy for product catalog:

REQUIREMENTS:
- 100K products
- Updated hourly
- High read ratio (1000:1 read/write)
- Multi-level caching (Redis + CDN)
- Cache invalidation strategy
- Stale-while-revalidate pattern"
```

## Common Pitfalls

### 1. Premature Optimization

**Problem:**
Optimizing before identifying actual bottlenecks.

**Solution:**
```
"First profile the application:
1. Use profiling tools
2. Identify top 3 bottlenecks
3. Optimize only those
4. Measure improvement
5. Repeat if needed"
```

### 2. Over-Caching

**Problem:**
Caching everything, including rarely accessed data.

**Solution:**
```
"Cache only:
- Frequently accessed data (>100 req/min)
- Expensive computations (>100ms)
- Relatively static data (changes <1/hour)

Monitor cache hit rates, remove low-value caches"
```

### 3. Ignoring Network Latency

**Problem:**
Optimizing code but ignoring network round-trips.

**Solution:**
```
"Reduce network calls:
- Batch API requests
- Use GraphQL for precise data fetching
- Implement HTTP/2 multiplexing
- Add CDN for static assets
- Compress responses (gzip/brotli)"
```

## Metrics for Success

### Performance Metrics

1. **Response Time**
   - P50: <100ms
   - P95: <200ms
   - P99: <500ms

2. **Throughput**
   - Requests per second
   - Concurrent users supported

3. **Resource Usage**
   - CPU utilization <70%
   - Memory usage <80%
   - Database connections <80% pool

4. **Cache Efficiency**
   - Hit rate >80%
   - Eviction rate <5%

## Conclusion

Performance optimization requires data-driven decisions, targeted improvements, and continuous monitoring. Use Claude to analyze bottlenecks, propose optimizations, and implement efficient solutions while maintaining code quality.
