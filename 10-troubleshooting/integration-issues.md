# Integration Troubleshooting

## Overview

Integration issues occur when connecting Claude Code with external systems, APIs, databases, and third-party services. This guide covers common integration problems and provides systematic approaches to diagnose and resolve them.

## API Integration Issues

### Issue: Third-Party API Authentication Failures

**Problem Description:**
Claude cannot authenticate with external APIs, receives 401/403 errors, or authentication tokens expire during operations.

**Diagnostic Steps:**

1. Test API credentials independently
```bash
# Test API endpoint directly
curl -H "Authorization: Bearer $API_TOKEN" \
  https://api.example.com/v1/endpoint

# Check token validity
curl -H "Authorization: Bearer $API_TOKEN" \
  https://api.example.com/v1/auth/validate
```

2. Verify credential format
```javascript
function validateCredentials(apiKey) {
  const checks = {
    notEmpty: apiKey && apiKey.length > 0,
    correctPrefix: apiKey.startsWith('expected_prefix_'),
    noWhitespace: !/\s/.test(apiKey),
    correctLength: apiKey.length >= 32
  };

  const issues = Object.entries(checks)
    .filter(([_, passed]) => !passed)
    .map(([check, _]) => check);

  return {
    valid: issues.length === 0,
    issues
  };
}
```

3. Check token expiration
```javascript
function checkTokenExpiration(token) {
  try {
    // For JWT tokens
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    const expiresAt = new Date(payload.exp * 1000);
    const now = new Date();

    return {
      expired: expiresAt < now,
      expiresAt,
      remainingMs: expiresAt - now
    };
  } catch (error) {
    return { error: 'Invalid token format' };
  }
}
```

**Solutions:**

Step 1: Implement Robust Authentication
```javascript
class APIAuthManager {
  constructor(config) {
    this.config = config;
    this.token = null;
    this.tokenExpiry = null;
  }

  async getToken() {
    // Return cached token if valid
    if (this.token && !this.isTokenExpired()) {
      return this.token;
    }

    // Refresh token
    return await this.refreshToken();
  }

  async refreshToken() {
    try {
      const response = await fetch(this.config.authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'client_credentials'
        })
      });

      if (!response.ok) {
        throw new Error(`Auth failed: ${response.status}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return this.token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  isTokenExpired() {
    if (!this.tokenExpiry) return true;
    
    // Refresh 5 minutes before actual expiry
    return Date.now() >= (this.tokenExpiry - 300000);
  }

  async makeAuthenticatedRequest(url, options = {}) {
    const token = await this.getToken();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
  }
}
```

Step 2: Handle Authentication Errors with Retry
```javascript
class RetryableAPIClient {
  constructor(authManager, maxRetries = 3) {
    this.auth = authManager;
    this.maxRetries = maxRetries;
  }

  async call(url, options = {}, attempt = 1) {
    try {
      const response = await this.auth.makeAuthenticatedRequest(url, options);

      if (response.status === 401 && attempt < this.maxRetries) {
        // Force token refresh and retry
        this.auth.token = null;
        return await this.call(url, options, attempt + 1);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.log(`Attempt ${attempt} failed, retrying...`);
        await this.delay(Math.pow(2, attempt) * 1000);
        return await this.call(url, options, attempt + 1);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

Step 3: Implement Secure Credential Management
```javascript
const keytar = require('keytar');

class SecureCredentialStore {
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  async store(account, credential) {
    await keytar.setPassword(this.serviceName, account, credential);
  }

  async retrieve(account) {
    return await keytar.getPassword(this.serviceName, account);
  }

  async delete(account) {
    return await keytar.deletePassword(this.serviceName, account);
  }
}

// Usage
const store = new SecureCredentialStore('my-app');
await store.store('api_token', process.env.API_TOKEN);
const token = await store.retrieve('api_token');
```

**Prevention Strategies:**
- Use secure credential storage (not environment variables)
- Implement automatic token refresh
- Test authentication independently before integration
- Monitor auth failures and set up alerts
- Document authentication requirements clearly

**Related Issues:** 403 Forbidden, token expiry, credential leaks

**When to Escalate:** If authentication works manually but fails programmatically, check API client library compatibility.

---

### Issue: API Rate Limiting and Throttling

**Problem Description:**
External API imposes rate limits causing request failures, delays, or degraded service when integrating with Claude.

**Diagnostic Steps:**

1. Identify rate limit configuration
```javascript
async function detectRateLimits(apiUrl) {
  const response = await fetch(apiUrl);
  
  const rateLimitInfo = {
    limit: response.headers.get('X-RateLimit-Limit'),
    remaining: response.headers.get('X-RateLimit-Remaining'),
    reset: response.headers.get('X-RateLimit-Reset'),
    retryAfter: response.headers.get('Retry-After')
  };

  console.log('Rate limit info:', rateLimitInfo);
  return rateLimitInfo;
}
```

2. Monitor request patterns
```javascript
class RequestMonitor {
  constructor() {
    this.requests = [];
  }

  record(timestamp = Date.now()) {
    this.requests.push(timestamp);
  }

  getRate(windowMs = 60000) {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    const recentRequests = this.requests.filter(t => t >= windowStart);
    
    return {
      count: recentRequests.length,
      rate: recentRequests.length / (windowMs / 1000),
      perMinute: recentRequests.length / (windowMs / 60000)
    };
  }

  cleanup(retentionMs = 3600000) {
    const cutoff = Date.now() - retentionMs;
    this.requests = this.requests.filter(t => t >= cutoff);
  }
}
```

3. Analyze throttling patterns
```bash
# Extract rate limit errors from logs
grep "429\|rate.limit" ~/.claude/logs/*.log | \
  awk '{print $1}' | uniq -c

# Identify peak usage times
grep "API request" ~/.claude/logs/*.log | \
  awk '{print $2}' | cut -d: -f1 | sort | uniq -c
```

**Solutions:**

Step 1: Implement Rate Limiter
```javascript
class RateLimiter {
  constructor(requestsPerWindow, windowMs) {
    this.limit = requestsPerWindow;
    this.windowMs = windowMs;
    this.queue = [];
    this.processing = false;
  }

  async throttle(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      await this.waitForSlot();
      
      const { fn, resolve, reject } = this.queue.shift();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  async waitForSlot() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Clean old requests
    this.requests = (this.requests || []).filter(t => t >= windowStart);

    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.waitForSlot();
      }
    }

    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(100, 60000); // 100 req/min

const result = await limiter.throttle(async () => {
  return await fetch('https://api.example.com/data');
});
```

Step 2: Implement Request Queueing with Priority
```javascript
class PriorityQueue {
  constructor(rateLimiter) {
    this.limiter = rateLimiter;
    this.queues = {
      high: [],
      medium: [],
      low: []
    };
  }

  async add(fn, priority = 'medium') {
    return new Promise((resolve, reject) => {
      this.queues[priority].push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    // Process high priority first
    for (const priority of ['high', 'medium', 'low']) {
      while (this.queues[priority].length > 0) {
        const { fn, resolve, reject } = this.queues[priority].shift();
        
        try {
          const result = await this.limiter.throttle(fn);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    }
  }
}

// Usage
const queue = new PriorityQueue(limiter);

// High priority request
await queue.add(async () => {
  return await fetchCriticalData();
}, 'high');

// Low priority request
await queue.add(async () => {
  return await fetchAnalytics();
}, 'low');
```

Step 3: Implement Adaptive Rate Limiting
```javascript
class AdaptiveRateLimiter {
  constructor(initialRate, windowMs) {
    this.currentRate = initialRate;
    this.windowMs = windowMs;
    this.successCount = 0;
    this.failureCount = 0;
    this.lastAdjustment = Date.now();
  }

  async execute(fn) {
    try {
      const result = await this.throttledExecute(fn);
      this.recordSuccess();
      return result;
    } catch (error) {
      if (error.status === 429) {
        this.recordFailure();
        
        // Retry after backing off
        await this.backoff();
        return await this.execute(fn);
      }
      throw error;
    }
  }

  recordSuccess() {
    this.successCount++;
    
    // Gradually increase rate if stable
    if (this.successCount > 100 && this.failureCount === 0) {
      this.adjustRate(1.1); // Increase by 10%
      this.successCount = 0;
    }
  }

  recordFailure() {
    this.failureCount++;
    
    // Immediately reduce rate on failure
    this.adjustRate(0.5); // Reduce by 50%
    this.failureCount = 0;
  }

  adjustRate(factor) {
    const now = Date.now();
    
    // Don't adjust more than once per minute
    if (now - this.lastAdjustment < 60000) return;
    
    this.currentRate = Math.max(1, Math.floor(this.currentRate * factor));
    this.lastAdjustment = now;
    
    console.log(`Rate adjusted to ${this.currentRate} req/${this.windowMs}ms`);
  }

  async backoff() {
    const delay = Math.min(30000, 1000 * Math.pow(2, this.failureCount));
    console.log(`Backing off for ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async throttledExecute(fn) {
    // Simple rate limiting logic
    await this.waitForSlot();
    return await fn();
  }

  async waitForSlot() {
    // Implementation similar to previous RateLimiter
    // but using this.currentRate instead of fixed limit
  }
}
```

**Prevention Strategies:**
- Understand API rate limits before integration
- Implement rate limiting from start
- Use request queueing for high-volume operations
- Monitor rate limit headers in responses
- Consider caching to reduce API calls

**Related Issues:** 429 errors, request delays, service degradation

**When to Escalate:** If rate limits are too restrictive for legitimate use case, contact API provider about higher limits.

---

## Database Integration Issues

### Issue: Database Connection Failures

**Problem Description:**
Claude cannot connect to database, connections timeout, or fail with authentication or network errors.

**Diagnostic Steps:**

1. Test database connectivity
```bash
# Test PostgreSQL connection
psql -h hostname -U username -d database -c "SELECT 1"

# Test MongoDB connection
mongosh "mongodb://hostname:27017/database" --eval "db.runCommand({ping: 1})"

# Test MySQL connection
mysql -h hostname -u username -p -e "SELECT 1"
```

2. Verify connection parameters
```javascript
function validateConnectionString(connStr) {
  const urlPattern = /^(postgres|mongodb|mysql):\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/;
  const match = connStr.match(urlPattern);

  if (!match) {
    return { valid: false, error: 'Invalid connection string format' };
  }

  const [_, protocol, username, password, host, port, database] = match;

  return {
    valid: true,
    protocol,
    username,
    host,
    port: parseInt(port),
    database,
    passwordProvided: password.length > 0
  };
}
```

3. Check network connectivity
```bash
# Test port connectivity
nc -zv hostname port

# Check DNS resolution
nslookup hostname

# Test with timeout
timeout 5 telnet hostname port
```

**Solutions:**

Step 1: Implement Connection Pooling
```javascript
const { Pool } = require('pg');

class DatabasePool {
  constructor(config) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      max: 20, // Maximum pool size
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err, client) => {
      console.error('Unexpected pool error:', err);
    });
  }

  async query(text, params) {
    const start = Date.now();
    let client;

    try {
      client = await this.pool.connect();
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  async close() {
    await this.pool.end();
  }
}
```

Step 2: Add Connection Retry Logic
```javascript
class ResilientDatabaseConnection {
  constructor(config, maxRetries = 5) {
    this.config = config;
    this.maxRetries = maxRetries;
    this.pool = null;
  }

  async connect(attempt = 1) {
    try {
      this.pool = new DatabasePool(this.config);
      
      // Test connection
      await this.pool.query('SELECT 1');
      console.log('Database connected successfully');
      
      return this.pool;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);

      if (attempt < this.maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        console.log(`Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return await this.connect(attempt + 1);
      }

      throw new Error(`Failed to connect after ${this.maxRetries} attempts`);
    }
  }

  async ensureConnected() {
    if (!this.pool) {
      await this.connect();
    }

    try {
      // Verify connection is alive
      await this.pool.query('SELECT 1');
    } catch (error) {
      console.log('Connection lost, reconnecting...');
      this.pool = null;
      await this.connect();
    }
  }

  async query(text, params) {
    await this.ensureConnected();
    return await this.pool.query(text, params);
  }
}
```

Step 3: Implement Health Checks
```javascript
class DatabaseHealthCheck {
  constructor(db) {
    this.db = db;
    this.lastCheck = null;
    this.isHealthy = false;
  }

  async check() {
    try {
      const start = Date.now();
      await this.db.query('SELECT 1');
      const responseTime = Date.now() - start;

      this.isHealthy = responseTime < 1000; // Consider healthy if <1s
      this.lastCheck = Date.now();

      return {
        healthy: this.isHealthy,
        responseTime,
        timestamp: this.lastCheck
      };
    } catch (error) {
      this.isHealthy = false;
      this.lastCheck = Date.now();

      return {
        healthy: false,
        error: error.message,
        timestamp: this.lastCheck
      };
    }
  }

  async startMonitoring(intervalMs = 30000) {
    setInterval(async () => {
      const health = await this.check();
      
      if (!health.healthy) {
        console.error('Database unhealthy:', health);
        // Trigger alerts or recovery procedures
      }
    }, intervalMs);
  }
}
```

**Prevention Strategies:**
- Use connection pooling for all database access
- Implement health checks and monitoring
- Set appropriate timeouts
- Use retry logic with exponential backoff
- Document connection requirements and credentials

**Related Issues:** Timeout errors, connection leaks, performance degradation

**When to Escalate:** If connections fail despite correct configuration, check firewall rules and network policies.

---

### Issue: Query Performance Problems

**Problem Description:**
Database queries execute slowly, timeout, or cause performance bottlenecks when integrating with Claude workflows.

**Diagnostic Steps:**

1. Profile query performance
```javascript
class QueryProfiler {
  async profile(query, params) {
    const start = Date.now();
    const startMem = process.memoryUsage();

    try {
      const result = await db.query(query, params);
      const duration = Date.now() - start;
      const endMem = process.memoryUsage();

      return {
        success: true,
        duration,
        rows: result.rows.length,
        memoryDelta: {
          heapUsed: endMem.heapUsed - startMem.heapUsed,
          external: endMem.external - startMem.external
        }
      };
    } catch (error) {
      return {
        success: false,
        duration: Date.now() - start,
        error: error.message
      };
    }
  }

  async analyze(query) {
    // Get query execution plan
    const explainQuery = `EXPLAIN ANALYZE ${query}`;
    const result = await db.query(explainQuery);
    
    return this.parseExplainPlan(result.rows);
  }

  parseExplainPlan(rows) {
    const plan = rows.map(row => row['QUERY PLAN']).join('\n');
    
    return {
      plan,
      hasSeqScan: plan.includes('Seq Scan'),
      hasIndexScan: plan.includes('Index Scan'),
      estimatedCost: this.extractCost(plan)
    };
  }

  extractCost(plan) {
    const match = plan.match(/cost=([\d.]+)\.\.([\d.]+)/);
    return match ? { start: parseFloat(match[1]), end: parseFloat(match[2]) } : null;
  }
}
```

2. Identify slow queries
```bash
# PostgreSQL slow query log
tail -f /var/log/postgresql/postgresql-slow.log

# MySQL slow query log
mysqldumpslow /var/log/mysql/slow.log | head -20
```

3. Monitor database metrics
```javascript
async function collectDatabaseMetrics() {
  const metrics = await db.query(`
    SELECT 
      schemaname,
      tablename,
      n_tup_ins as inserts,
      n_tup_upd as updates,
      n_tup_del as deletes,
      seq_scan,
      idx_scan
    FROM pg_stat_user_tables
    ORDER BY seq_scan DESC
    LIMIT 10
  `);

  return metrics.rows;
}
```

**Solutions:**

Step 1: Implement Query Optimization
```javascript
class QueryOptimizer {
  constructor(db) {
    this.db = db;
    this.cache = new Map();
  }

  async execute(query, params, options = {}) {
    // Use prepared statements for repeated queries
    if (options.prepare) {
      return await this.executePrepared(query, params);
    }

    // Use query cache for read-only queries
    if (options.cache && this.isSelectQuery(query)) {
      return await this.executeCached(query, params, options.cacheTTL);
    }

    // Execute normally
    return await this.db.query(query, params);
  }

  async executePrepared(query, params) {
    const queryHash = this.hashQuery(query);
    const preparedName = `prep_${queryHash}`;

    try {
      return await this.db.query({
        name: preparedName,
        text: query,
        values: params
      });
    } catch (error) {
      console.error('Prepared query error:', error);
      throw error;
    }
  }

  async executeCached(query, params, ttl = 60000) {
    const cacheKey = this.getCacheKey(query, params);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.result;
    }

    const result = await this.db.query(query, params);
    
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    return result;
  }

  isSelectQuery(query) {
    return query.trim().toLowerCase().startsWith('select');
  }

  hashQuery(query) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(query).digest('hex').substring(0, 8);
  }

  getCacheKey(query, params) {
    return `${this.hashQuery(query)}:${JSON.stringify(params)}`;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

Step 2: Add Query Batching
```javascript
class QueryBatcher {
  constructor(db, batchSize = 100, flushInterval = 100) {
    this.db = db;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.queue = [];
    this.timer = null;
  }

  async insert(table, data) {
    return new Promise((resolve, reject) => {
      this.queue.push({ table, data, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.flushInterval);
      }
    });
  }

  async flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.queue.length === 0) return;

    // Group by table
    const grouped = new Map();
    this.queue.forEach(item => {
      if (!grouped.has(item.table)) {
        grouped.set(item.table, []);
      }
      grouped.get(item.table).push(item);
    });

    this.queue = [];

    // Execute batch inserts
    for (const [table, items] of grouped.entries()) {
      try {
        await this.batchInsert(table, items);
        items.forEach(item => item.resolve());
      } catch (error) {
        items.forEach(item => item.reject(error));
      }
    }
  }

  async batchInsert(table, items) {
    const data = items.map(item => item.data);
    const columns = Object.keys(data[0]);
    
    const values = data.map((row, i) => {
      const placeholders = columns.map((_, j) => `$${i * columns.length + j + 1}`);
      return `(${placeholders.join(', ')})`;
    }).join(', ');

    const flatValues = data.flatMap(row => columns.map(col => row[col]));

    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES ${values}
    `;

    await this.db.query(query, flatValues);
  }
}

// Usage
const batcher = new QueryBatcher(db);

// These will be batched together
await batcher.insert('users', { name: 'Alice', email: 'alice@example.com' });
await batcher.insert('users', { name: 'Bob', email: 'bob@example.com' });
```

Step 3: Implement Connection Monitoring
```javascript
class ConnectionMonitor {
  constructor(db) {
    this.db = db;
    this.metrics = {
      activeConnections: 0,
      totalQueries: 0,
      slowQueries: 0,
      errors: 0
    };
  }

  async monitorConnections() {
    const result = await this.db.query(`
      SELECT 
        count(*) as total,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle,
        count(*) FILTER (WHERE wait_event_type IS NOT NULL) as waiting
      FROM pg_stat_activity
      WHERE datname = current_database()
    `);

    return result.rows[0];
  }

  async getSlowQueries(thresholdMs = 1000) {
    const result = await this.db.query(`
      SELECT 
        pid,
        now() - query_start as duration,
        query,
        state
      FROM pg_stat_activity
      WHERE state = 'active'
        AND now() - query_start > interval '${thresholdMs} milliseconds'
      ORDER BY duration DESC
    `);

    return result.rows;
  }

  async startMonitoring(intervalMs = 30000) {
    setInterval(async () => {
      const connections = await this.monitorConnections();
      const slowQueries = await this.getSlowQueries();

      console.log('Database connections:', connections);
      
      if (slowQueries.length > 0) {
        console.warn(`${slowQueries.length} slow queries detected`);
        slowQueries.forEach(q => {
          console.warn(`  ${q.duration}: ${q.query.substring(0, 100)}`);
        });
      }
    }, intervalMs);
  }
}
```

**Prevention Strategies:**
- Use proper indexes on frequently queried columns
- Optimize queries before deployment
- Implement query caching for read-heavy workloads
- Use connection pooling efficiently
- Monitor and profile query performance regularly

**Related Issues:** Timeouts, high CPU usage, slow responses

**When to Escalate:** If optimizations don't improve performance, consider database scaling or architecture redesign.

---

## Webhook and Event Integration Issues

### Issue: Webhook Delivery Failures

**Problem Description:**
Webhooks from external systems fail to reach Claude application, arrive out of order, or get lost during processing.

**Diagnostic Steps:**

1. Test webhook endpoint
```bash
# Simulate webhook delivery
curl -X POST https://your-app.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"event": "test", "data": {}}'
```

2. Verify webhook signature
```javascript
function verifyWebhookSignature(payload, signature, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const expected = hmac.update(payload).digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

3. Check webhook logs
```bash
# Review webhook delivery attempts
grep "webhook" /var/log/app.log | tail -50
```

**Solutions:**

Step 1: Implement Reliable Webhook Handler
```javascript
class WebhookHandler {
  constructor(secret) {
    this.secret = secret;
    this.processors = new Map();
  }

  register(eventType, handler) {
    this.processors.set(eventType, handler);
  }

  async handle(req, res) {
    try {
      // Verify signature
      const signature = req.headers['x-webhook-signature'];
      const payload = JSON.stringify(req.body);
      
      if (!this.verifySignature(payload, signature)) {
        res.status(401).json({ error: 'Invalid signature' });
        return;
      }

      // Process webhook
      const { event, data } = req.body;
      const processor = this.processors.get(event);

      if (!processor) {
        res.status(400).json({ error: 'Unknown event type' });
        return;
      }

      // Process asynchronously
      this.processAsync(event, data);

      // Respond immediately (don't wait for processing)
      res.status(200).json({ received: true });

    } catch (error) {
      console.error('Webhook handling error:', error);
      res.status(500).json({ error: 'Internal error' });
    }
  }

  async processAsync(event, data) {
    try {
      const processor = this.processors.get(event);
      await processor(data);
    } catch (error) {
      console.error(`Error processing ${event}:`, error);
      // Store failed webhook for retry
      await this.storeFailedWebhook(event, data, error);
    }
  }

  verifySignature(payload, signature) {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.secret);
    const expected = hmac.update(payload).digest('hex');
    
    return signature === expected;
  }

  async storeFailedWebhook(event, data, error) {
    // Store in database or queue for retry
    await db.query(
      'INSERT INTO failed_webhooks (event, data, error, created_at) VALUES ($1, $2, $3, NOW())',
      [event, JSON.stringify(data), error.message]
    );
  }
}
```

Step 2: Add Webhook Retry Mechanism
```javascript
class WebhookRetryQueue {
  constructor(maxRetries = 5) {
    this.maxRetries = maxRetries;
  }

  async retry(webhook) {
    let attempt = 0;

    while (attempt < this.maxRetries) {
      try {
        await this.process(webhook);
        
        // Mark as processed
        await db.query(
          'DELETE FROM failed_webhooks WHERE id = $1',
          [webhook.id]
        );
        
        return;
      } catch (error) {
        attempt++;
        
        if (attempt < this.maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 60000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Give up after max retries
    console.error(`Failed to process webhook ${webhook.id} after ${this.maxRetries} attempts`);
  }

  async process(webhook) {
    // Process the webhook
    const handler = getHandlerForEvent(webhook.event);
    await handler(JSON.parse(webhook.data));
  }

  async retryAll() {
    const failed = await db.query(
      'SELECT * FROM failed_webhooks ORDER BY created_at ASC'
    );

    for (const webhook of failed.rows) {
      await this.retry(webhook);
    }
  }
}
```

**Prevention Strategies:**
- Implement idempotency in webhook handlers
- Use queue systems for reliable processing
- Validate and verify all incoming webhooks
- Log all webhook events for debugging
- Set up monitoring and alerts for failures

**Related Issues:** Missing events, duplicate processing, timing issues

**When to Escalate:** If webhooks are being sent but not received, check network configuration and firewall rules.

---

This comprehensive integration troubleshooting guide provides solutions for common integration challenges with external APIs, databases, and webhook systems when working with Claude Code.
