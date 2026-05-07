# Performance Prompts

Prompts for analyzing and optimizing code performance across different layers.

## Table of Contents
- [Performance Analysis](#performance-analysis)
- [Algorithm Optimization](#algorithm-optimization)
- [Database Performance](#database-performance)
- [Frontend Performance](#frontend-performance)

---

## Performance Analysis

### 1. Performance Profiling Analysis
```
Analyze this performance profile:

Profiling Data: [paste profiler output or metrics]
Code: [paste relevant code]
Performance Target: [expected performance]
Current Performance: [actual measurements]

Analyze:
1. Hotspots and bottlenecks
2. Time/memory complexity
3. Resource consumption patterns
4. Optimization opportunities (prioritized)
5. Expected improvements from each optimization
6. Trade-offs to consider
7. Benchmark before/after
```

**Usage Context**: Analyzing profiler output to find bottlenecks.

**Example Input**:
```
Function: process_orders()
Total Time: 5.2 seconds
Calls: 1

Breakdown:
- load_orders(): 0.8s (15%)
- validate_orders(): 3.2s (62%) ← HOTSPOT
  - validate_address(): 2.8s (54%)
    - geocode_address(): 2.5s (48%)
- save_orders(): 1.2s (23%)

Target: <1 second for 1000 orders
Current: 5.2 seconds for 1000 orders
```

**Example Output**:
```
PERFORMANCE ANALYSIS:

Primary Bottleneck: geocode_address() taking 2.5s (48% of total time)

Root Cause:
- Making individual API calls to geocoding service for each order
- 1000 orders = 1000 API calls at ~2.5ms each
- Network latency compounds the issue

Optimization Strategy (Prioritized):

1. BATCH GEOCODING (Expected: 80% improvement)
   Impact: 5.2s → 1.5s
   
   Current:
   ```python
   for order in orders:
       order.location = geocode_address(order.address)
   ```
   
   Optimized:
   ```python
   # Batch geocode all addresses in single API call
   addresses = [order.address for order in orders]
   locations = geocode_batch(addresses)  # Single API call
   for order, location in zip(orders, locations):
       order.location = location
   ```
   
   Trade-offs:
   - Requires batch API support (check API limits)
   - All-or-nothing: one failure affects batch
   - Mitigation: Implement batch chunking (100 addresses per call)

2. CACHING (Expected: 60% additional improvement on repeated addresses)
   Impact: 1.5s → 0.6s (for 60% cache hit rate)
   
   ```python
   address_cache = {}
   
   def geocode_with_cache(address):
       if address not in address_cache:
           address_cache[address] = geocode_address(address)
       return address_cache[address]
   ```
   
   Trade-offs:
   - Memory usage increases
   - Cache invalidation strategy needed
   - Consider Redis for distributed caching

3. PARALLEL PROCESSING (If batching not available)
   Impact: 2.5s → 0.5s (with 5 workers)
   
   ```python
   from concurrent.futures import ThreadPoolExecutor
   
   with ThreadPoolExecutor(max_workers=5) as executor:
       locations = list(executor.map(geocode_address, addresses))
   ```
   
   Trade-offs:
   - API rate limits may apply
   - Increased API costs
   - Complexity in error handling

Combined Approach:
1. Implement caching (quick win, no API changes)
2. Add batching if API supports it
3. Use parallel processing for cache misses

Expected Final Performance:
- With 60% cache hit rate: 0.4s (92% improvement)
- Meets <1s target with margin

Additional Observations:
- save_orders() at 1.2s should be investigated next
- Consider database batch inserts
- validate_orders() time reduced from 3.2s to 0.5s with above changes
```

**Tips for Customization**:
- Include actual profiler output (cProfile, YourKit, Chrome DevTools)
- Specify performance targets (latency, throughput)
- Mention constraints (memory, API limits, cost)

---

### 2. Memory Usage Analysis
```
Analyze memory consumption:

Code: [paste code]
Memory Profile: [heap dump or memory metrics]
Current Usage: [memory consumption]
Environment: [heap size, constraints]

Analyze:
1. Memory hotspots
2. Memory leaks
3. Object retention
4. Unnecessary allocations
5. Memory-efficient alternatives
6. GC pressure (if applicable)
7. Optimization recommendations
```

**Usage Context**: Investigating memory issues.

**Example Input**:
```python
def process_log_file(filename):
    with open(filename) as f:
        lines = f.readlines()  # Loads entire file into memory
    
    results = []
    for line in lines:
        if 'ERROR' in line:
            results.append({
                'line': line,
                'timestamp': extract_timestamp(line),
                'message': extract_message(line)
            })
    
    return results

# Called on 10GB log file
```

**Example Output**:
```
MEMORY ANALYSIS:

Issue: Loading entire 10GB file into memory

Current Memory Usage:
- lines list: ~10GB
- results list: ~2GB (20% of lines are errors)
- Peak memory: ~12GB
- Python overhead: ~1GB
- Total: ~13GB

Problems:
1. Unnecessary memory allocation (reading entire file)
2. Duplicate data storage (line stored in results dict)
3. No memory release until function completes

Optimized Solution:

```python
def process_log_file(filename):
    """Process log file with streaming to minimize memory."""
    for line in open(filename):  # Streaming, one line at a time
        if 'ERROR' in line:
            yield {
                'timestamp': extract_timestamp(line),
                'message': extract_message(line)
                # Don't store full line, just extracted data
            }

# Usage
results = list(process_log_file('large.log'))
# Or better, process as stream:
for error in process_log_file('large.log'):
    handle_error(error)
```

Memory Improvement:
- Peak memory: ~100MB (single line + result object)
- Reduction: 99.2% (from 13GB to 100MB)

Additional Optimizations:

1. If results list is large, write to file instead:
```python
def process_log_file_to_output(input_file, output_file):
    with open(output_file, 'w') as out:
        for line in open(input_file):
            if 'ERROR' in line:
                error_data = extract_error_data(line)
                out.write(json.dumps(error_data) + '\n')
```

2. Use generators throughout pipeline:
```python
def read_errors(filename):
    for line in open(filename):
        if 'ERROR' in line:
            yield line

def parse_errors(error_lines):
    for line in error_lines:
        yield {
            'timestamp': extract_timestamp(line),
            'message': extract_message(line)
        }

# Fully streaming pipeline
errors = parse_errors(read_errors('large.log'))
for error in errors:
    process(error)  # One at a time
```

Memory: Constant O(1) regardless of file size
```

---

### 3. Latency Optimization
```
Optimize latency for this operation:

Operation: [describe operation]
Current Latency: [p50, p95, p99]
Target Latency: [desired latency]
Code: [paste code]
Architecture: [describe components involved]

Analyze and optimize:
1. Network latency
2. Database query time
3. CPU-bound operations
4. I/O operations
5. Serialization overhead
6. Caching opportunities
7. Async opportunities
8. Priority optimizations
```

**Usage Context**: Reducing operation latency.

---

### 4. Throughput Optimization
```
Increase throughput for:

Operation: [describe]
Current Throughput: [requests/sec]
Target Throughput: [desired]
Bottleneck: [if known]
Code: [paste code]

Optimize for:
1. Concurrent processing
2. Batch processing
3. Resource utilization
4. Queuing strategy
5. Load distribution
6. Backpressure handling
7. Scalability approach
```

**Usage Context**: Increasing system throughput.

---

## Algorithm Optimization

### 5. Algorithm Complexity Improvement
```
Optimize algorithm complexity:

Current Algorithm: [paste code]
Input Size: [typical and maximum]
Current Complexity: [if known]
Performance Issue: [describe problem]

Provide:
1. Complexity analysis (time and space)
2. Optimization opportunities
3. Better algorithm/data structure
4. Optimized implementation
5. Complexity comparison
6. Trade-offs
```

**Usage Context**: Improving algorithmic efficiency.

**Example Input**:
```python
def find_duplicates(items):
    """Find duplicate items in list."""
    duplicates = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j] and items[i] not in duplicates:
                duplicates.append(items[i])
    return duplicates

# Called with 10,000 items - takes 30 seconds
```

**Example Output**:
```
COMPLEXITY ANALYSIS:

Current Algorithm:
- Time Complexity: O(n³)
  - Outer loop: O(n)
  - Inner loop: O(n)
  - `not in duplicates`: O(n) for list lookup
  - Total: O(n) × O(n) × O(n) = O(n³)
- Space Complexity: O(n) for duplicates list

Performance:
- 10,000 items: ~30 seconds
- 100,000 items: ~50 minutes (estimated)

OPTIMIZED SOLUTION:

Approach 1: Using Set (Best for Most Cases)
```python
def find_duplicates(items):
    """Find duplicate items - O(n) solution."""
    seen = set()
    duplicates = set()
    
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    
    return list(duplicates)
```

- Time Complexity: O(n) - single pass
- Space Complexity: O(n) - for seen and duplicates sets
- Performance: 10,000 items in ~0.003 seconds
- Improvement: 10,000× faster

Approach 2: Using Counter (If count needed)
```python
from collections import Counter

def find_duplicates(items):
    """Find duplicates with counts."""
    counts = Counter(items)
    return [item for item, count in counts.items() if count > 1]
```

- Time Complexity: O(n)
- Space Complexity: O(n)
- Bonus: Also provides duplicate counts

Approach 3: For Sorted Data
```python
def find_duplicates_sorted(items):
    """Find duplicates in sorted list - O(n) time, O(1) extra space."""
    duplicates = []
    for i in range(1, len(items)):
        if items[i] == items[i-1] and (not duplicates or duplicates[-1] != items[i]):
            duplicates.append(items[i])
    return duplicates
```

- Time Complexity: O(n)
- Space Complexity: O(1) extra space (assuming sorted)
- Use when: Input is already sorted or can be sorted efficiently

COMPLEXITY COMPARISON:

| Approach | Time | Space | 10K items | 100K items |
|----------|------|-------|-----------|------------|
| Original | O(n³) | O(n) | 30s | 50min |
| Set-based | O(n) | O(n) | 0.003s | 0.03s |
| Counter | O(n) | O(n) | 0.003s | 0.03s |
| Sorted | O(n log n) | O(1) | 0.01s | 0.1s |

Recommendation: Use Set-based approach (Approach 1)
- Fastest for unsorted data
- Simple and readable
- Handles any hashable type
```

**Language Variations**:
- **Java**: Emphasize ArrayList vs HashSet performance
- **C++**: STL containers and iterators
- **JavaScript**: Array methods vs Set/Map

---

### 6. Data Structure Selection
```
Recommend optimal data structure:

Use Case: [describe operations needed]
Operations: [insert, lookup, delete, iterate, etc.]
Frequency: [which operations are most common]
Data Size: [expected size]
Current Structure: [what's being used]

Recommend:
1. Optimal data structure
2. Complexity analysis
3. Implementation example
4. Migration approach
5. Performance comparison
```

**Usage Context**: Choosing the right data structure.

**Example Input**:
```
Use Case: User session storage
Operations:
- Insert: on login (100/sec)
- Lookup by session_id: on request (1000/sec)
- Lookup by user_id: on admin dashboard (10/sec)
- Delete: on logout (50/sec)
- TTL: auto-delete after 30 min
Data Size: ~10,000 active sessions
Current: List of session objects
```

**Example Output**:
```
RECOMMENDATION: Composite Data Structure

Current Problem with List:
- Lookup by session_id: O(n) - slow at 1000/sec
- Lookup by user_id: O(n) - slow even at low frequency
- Delete: O(n) - requires scanning

Optimal Solution: Multi-index approach

```python
from collections import defaultdict
import time

class SessionStore:
    def __init__(self):
        # Primary index: session_id -> session object
        self.sessions = {}  # O(1) lookup by session_id
        
        # Secondary index: user_id -> list of session_ids
        self.user_sessions = defaultdict(list)  # O(1) lookup by user_id
        
        # Expiry index: timestamp -> list of session_ids
        self.expiry_queue = []  # For TTL management
    
    def add_session(self, session):
        """Add session - O(1)"""
        self.sessions[session.id] = session
        self.user_sessions[session.user_id].append(session.id)
        self.expiry_queue.append((session.expires_at, session.id))
    
    def get_by_session_id(self, session_id):
        """Get by session ID - O(1)"""
        return self.sessions.get(session_id)
    
    def get_by_user_id(self, user_id):
        """Get all sessions for user - O(k) where k is user's session count"""
        session_ids = self.user_sessions.get(user_id, [])
        return [self.sessions[sid] for sid in session_ids if sid in self.sessions]
    
    def delete_session(self, session_id):
        """Delete session - O(1) amortized"""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            del self.sessions[session_id]
            
            # Remove from user index
            user_sessions = self.user_sessions[session.user_id]
            user_sessions.remove(session_id)
            if not user_sessions:
                del self.user_sessions[session.user_id]
    
    def cleanup_expired(self):
        """Remove expired sessions - O(k) where k is expired count"""
        current_time = time.time()
        while self.expiry_queue and self.expiry_queue[0][0] <= current_time:
            expires_at, session_id = self.expiry_queue.pop(0)
            self.delete_session(session_id)
```

COMPLEXITY COMPARISON:

| Operation | List | Optimized | Improvement |
|-----------|------|-----------|-------------|
| Insert | O(1) | O(1) | Same |
| Lookup by session_id | O(n) | O(1) | 10,000× faster |
| Lookup by user_id | O(n) | O(k)* | 1,000× faster |
| Delete | O(n) | O(1) | 10,000× faster |
| Expire | O(n) | O(k) | Targeted cleanup |

*k = number of sessions for that user (typically 1-3)

PERFORMANCE AT SCALE:

10,000 sessions:
- List lookup: ~10ms per lookup
- Hash lookup: ~0.001ms per lookup

At 1000 lookups/sec:
- List: 10,000ms CPU time (impossible)
- Hash: 1ms CPU time (easy)

Memory Trade-off:
- Additional memory: ~2× (indexes)
- But necessary for required performance

Alternative for Distributed Systems:
If sessions need to be shared across servers, use Redis:

```python
import redis
import json

class RedisSessionStore:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def add_session(self, session):
        # Store session data
        self.redis.setex(
            f"session:{session.id}",
            1800,  # 30 min TTL
            json.dumps(session.__dict__)
        )
        
        # Add to user's session set
        self.redis.sadd(f"user_sessions:{session.user_id}", session.id)
        self.redis.expire(f"user_sessions:{session.user_id}", 1800)
    
    def get_by_session_id(self, session_id):
        data = self.redis.get(f"session:{session_id}")
        return json.loads(data) if data else None
    
    def get_by_user_id(self, user_id):
        session_ids = self.redis.smembers(f"user_sessions:{user_id}")
        return [self.get_by_session_id(sid) for sid in session_ids]
```

Benefits:
- Built-in TTL (automatic expiry)
- O(1) operations
- Shared across servers
- Persistent across restarts
```

---

## Database Performance

### 7. Query Optimization
```
Optimize this database query:

Query: [paste SQL/query]
Database: [type and version]
Table Schema: [relevant tables]
Indexes: [existing indexes]
Query Plan: [EXPLAIN output if available]
Performance: [current execution time]

Optimize:
1. Query rewrite
2. Index recommendations
3. Query plan analysis
4. Join optimization
5. Subquery elimination
6. Performance comparison
```

**Usage Context**: Optimizing slow database queries.

**Example Input**:
```sql
-- Takes 15 seconds on 1M orders
SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01'
  AND o.status = 'completed'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 100;

-- Existing indexes:
-- users: PRIMARY KEY (id)
-- orders: PRIMARY KEY (id), INDEX (user_id)
```

**Example Output**:
```
QUERY ANALYSIS:

Current Issues:
1. Missing index on orders.created_at - requires full table scan
2. Missing index on orders.status - filters after join
3. LEFT JOIN unnecessary (HAVING requires orders)
4. Filtering after join (should filter first)

QUERY PLAN (Estimated):
1. Full scan of orders table (1M rows)
2. Filter by created_at and status
3. Join with users
4. Group and aggregate
5. Filter by count > 5
6. Sort by total_spent
7. Limit 100

OPTIMIZED QUERY:

```sql
-- Optimized version
SELECT 
    u.name, 
    COUNT(*) as order_count, 
    SUM(o.total) as total_spent
FROM orders o
INNER JOIN users u ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01'
  AND o.status = 'completed'
GROUP BY u.id, u.name
HAVING COUNT(*) > 5
ORDER BY total_spent DESC
LIMIT 100;
```

Key Changes:
1. Changed LEFT JOIN to INNER JOIN (HAVING makes LEFT JOIN pointless)
2. Start from orders table (smaller after filtering)
3. Filter before join

RECOMMENDED INDEXES:

```sql
-- Composite index for filtering
CREATE INDEX idx_orders_lookup 
ON orders(created_at, status, user_id);

-- Alternative if orders by status are few:
CREATE INDEX idx_orders_status_date 
ON orders(status, created_at, user_id);
```

INDEX SELECTION RATIONALE:

Option 1: (created_at, status, user_id)
- Best for date range queries
- Covers all filter and join columns

Option 2: (status, created_at, user_id)
- Better if most orders are 'completed'
- Efficient for status-first filtering

Recommendation: Test both, use Option 1 if date range is selective

ADDITIONAL OPTIMIZATIONS:

For very frequent queries, consider materialized view:

```sql
CREATE MATERIALIZED VIEW user_order_stats AS
SELECT 
    u.id,
    u.name,
    COUNT(o.id) as order_count,
    SUM(o.total) as total_spent,
    MAX(o.created_at) as last_order
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.name;

-- Refresh periodically
REFRESH MATERIALIZED VIEW user_order_stats;

-- Query becomes:
SELECT name, order_count, total_spent
FROM user_order_stats
WHERE last_order >= '2026-01-01'
  AND order_count > 5
ORDER BY total_spent DESC
LIMIT 100;
```

PERFORMANCE COMPARISON:

| Version | Execution Time | Improvement |
|---------|---------------|-------------|
| Original | 15s | Baseline |
| Optimized query | 3s | 5× faster |
| With indexes | 0.2s | 75× faster |
| Materialized view | 0.01s | 1500× faster |

Recommendation: 
1. Implement optimized query immediately
2. Add indexes (minimal overhead)
3. Consider materialized view if query runs >100 times/day
```

---

### 8. Database Schema Optimization
```
Optimize database schema for performance:

Current Schema: [paste DDL]
Access Patterns: [how data is queried]
Performance Issues: [specific problems]
Data Volume: [table sizes]

Optimize:
1. Normalization/denormalization
2. Partitioning strategy
3. Index strategy
4. Data type optimization
5. Constraint optimization
```

**Usage Context**: Improving schema design for performance.

---

## Frontend Performance

### 9. JavaScript Performance Optimization
```
Optimize JavaScript performance:

Code: [paste JS code]
Performance Issue: [description]
Measurements: [profiler data if available]
Browser: [target browsers]

Optimize:
1. DOM manipulation
2. Event handlers
3. Memory leaks
4. Render blocking
5. Bundle size
6. Async operations
7. Caching strategies
```

**Usage Context**: Optimizing client-side JavaScript.

---

### 10. React Component Performance
```
Optimize React component performance:

Component: [paste component code]
Issue: [re-renders, slow rendering, etc.]
Props: [typical prop values]

Optimize:
1. Re-render prevention (memo, useMemo, useCallback)
2. Virtual list for large lists
3. Code splitting
4. Lazy loading
5. State management
6. Event handler optimization
```

**Usage Context**: Optimizing React performance.

**Example Input**:
```jsx
function UserList({ users, onUserClick }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.id} onClick={() => onUserClick(user)}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <ExpensiveComponent data={user.stats} />
        </div>
      ))}
    </div>
  );
}

// Re-renders all 1000 users every time parent updates
```

**Example Output**:
```jsx
OPTIMIZATION STRATEGY:

Issues:
1. All users re-render when any prop changes
2. Creating new onClick handlers on every render
3. ExpensiveComponent re-renders unnecessarily
4. Rendering 1000 items (performance issue)

Optimized Component:

```jsx
import React, { memo, useCallback, useMemo } from 'react';
import { FixedSizeList } from 'react-window';

// Memoize individual user row
const UserRow = memo(({ user, onClick }) => {
  return (
    <div onClick={onClick}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <ExpensiveComponent data={user.stats} />
    </div>
  );
});

function UserList({ users, onUserClick }) {
  // Memoize click handler creation
  const handleClick = useCallback(
    (user) => () => onUserClick(user),
    [onUserClick]
  );
  
  // Virtual list for large datasets
  const Row = useCallback(
    ({ index, style }) => {
      const user = users[index];
      return (
        <div style={style}>
          <UserRow user={user} onClick={handleClick(user)} />
        </div>
      );
    },
    [users, handleClick]
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={100}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

export default memo(UserList);
```

Further Optimization with ExpensiveComponent:

```jsx
const ExpensiveComponent = memo(({ data }) => {
  // Memoize expensive calculation
  const processedData = useMemo(
    () => expensiveCalculation(data),
    [data]
  );
  
  return <div>{processedData}</div>;
});
```

PERFORMANCE IMPROVEMENT:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Initial render | 1200ms | 150ms | 8× faster |
| Re-render (1 user change) | 1200ms | 10ms | 120× faster |
| Scroll performance | Laggy | Smooth | 60 FPS |
| Memory usage | High | Low | Virtual scrolling |

Key Techniques Used:
1. memo() - Prevent unnecessary re-renders
2. useCallback() - Stable function references
3. useMemo() - Cache expensive calculations
4. react-window - Virtual scrolling for large lists
```

---

## Performance Best Practices Template

```
PERFORMANCE OPTIMIZATION REQUEST:

Code/System:
[paste code or describe system]

Performance Issue:
- Symptom: [slow/memory/CPU/etc]
- Measurements: [current metrics]
- Target: [desired performance]

Environment:
- Language/Framework: [details]
- Infrastructure: [servers, databases]
- Scale: [users, data volume, requests]

Constraints:
- Cannot change: [limitations]
- Must maintain: [requirements]

Profiling Data:
[profiler output if available]

Please Analyze:
1. Identify bottlenecks
2. Complexity analysis
3. Optimization recommendations (prioritized)
4. Expected improvements
5. Trade-offs
6. Implementation approach
7. Benchmarking strategy
```

## Best Practices for Performance Prompts

1. **Provide Metrics**: Include actual measurements
2. **Share Profiler Data**: Stack traces, flame graphs, timing
3. **Specify Targets**: Define acceptable performance
4. **Include Scale**: Current and projected size
5. **Show Full Context**: Dependencies, infrastructure
6. **Request Prioritization**: Ask for biggest wins first
7. **Ask for Trade-offs**: Understand compromises
8. **Include Benchmarks**: Request before/after comparisons
