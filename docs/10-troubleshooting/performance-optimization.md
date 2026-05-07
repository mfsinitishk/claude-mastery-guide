# Performance Optimization

## Overview

Performance optimization for Claude Code involves understanding token usage, response times, caching strategies, and resource management. This guide provides systematic approaches to diagnose and resolve performance bottlenecks while maximizing efficiency and minimizing costs.

## Understanding Performance Metrics

### Key Performance Indicators

1. **Response Latency:** Time from request to first token
2. **Total Response Time:** Complete request-response cycle
3. **Token Throughput:** Tokens processed per second
4. **Cache Hit Rate:** Percentage of cached prompt reuse
5. **Cost Efficiency:** Quality per dollar spent
6. **Resource Utilization:** CPU, memory, network usage

### Performance Baseline Expectations

| Model | Typical Latency | Throughput | Best For |
|-------|----------------|------------|----------|
| Claude Opus 4 | 2-5s | ~40 tokens/s | Complex reasoning, highest quality |
| Claude Sonnet 4.5 | 1-3s | ~60 tokens/s | Balanced performance and quality |
| Claude Haiku 4 | 0.5-1s | ~100 tokens/s | Speed-critical, simple tasks |

## Diagnosing Performance Issues

### Issue: High Response Latency

**Problem Description:**
First token arrives slowly, causing poor user experience and long wait times for initial feedback.

**Diagnostic Steps:**

1. Measure baseline latency with simple request
```bash
time claude "What is 2+2?"
# Should complete in <2 seconds for Haiku, <4 for Sonnet
```

2. Test network connectivity
```bash
# Measure API endpoint latency
curl -w "@curl-format.txt" -o /dev/null -s https://api.anthropic.com/v1/messages

# curl-format.txt contents:
# time_namelookup:  %{time_namelookup}\n
# time_connect:  %{time_connect}\n
# time_appconnect:  %{time_appconnect}\n
# time_pretransfer:  %{time_pretransfer}\n
# time_starttransfer:  %{time_starttransfer}\n
# time_total:  %{time_total}\n
```

3. Profile request composition time
```bash
# Enable timing logs
export CLAUDE_DEBUG=1
claude --verbose "complex prompt"
```

4. Check system resource constraints
```bash
# Monitor during request
top -l 1 | grep -E "CPU|PhysMem"
```

**Solutions:**

Step 1: Use Streaming Responses
```javascript
// Enable streaming for faster perceived performance
const stream = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  messages: [{role: 'user', content: 'Your prompt'}],
  stream: true
});

for await (const chunk of stream) {
  // Process tokens as they arrive
  process.stdout.write(chunk.delta?.text || '');
}
```

Step 2: Implement Request Queueing
```javascript
// Batch and queue requests to avoid cold starts
class RequestQueue {
  constructor(concurrency = 5) {
    this.queue = [];
    this.active = 0;
    this.concurrency = concurrency;
  }

  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.active >= this.concurrency || this.queue.length === 0) return;
    
    this.active++;
    const { request, resolve, reject } = this.queue.shift();
    
    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.active--;
      this.process();
    }
  }
}
```

Step 3: Optimize Network Path
```bash
# Use regional endpoints if available
export ANTHROPIC_API_URL="https://api-eu.anthropic.com"

# Enable HTTP/2
# Most modern clients use this by default

# Use persistent connections
# Configure in your HTTP client
```

**Prevention Strategies:**
- Always use streaming for interactive applications
- Implement connection pooling
- Monitor latency trends over time
- Use CDN/edge caching where appropriate
- Consider geographic proximity to API servers

**Related Issues:** Timeout errors, poor user experience, streaming delays

**When to Escalate:** If latency consistently exceeds 10 seconds for simple requests across different networks.

---

### Issue: Token Usage Excessive

**Problem Description:**
Requests consume more tokens than expected, leading to high costs and hitting context limits unnecessarily.

**Diagnostic Steps:**

1. Analyze token breakdown
```bash
# Enable token counting
claude --show-tokens "Your prompt"
```

2. Review prompt structure
```python
import anthropic

# Count tokens before sending
client = anthropic.Anthropic()
count = client.count_tokens("Your very long prompt text...")
print(f"Tokens: {count}")
```

3. Identify inefficiencies
```bash
# Compare equivalent prompts
claude --show-tokens "Analyze this code: [100 lines]"
claude --show-tokens "Review for bugs: [same 100 lines]"
# Check if token counts differ unexpectedly
```

4. Track token usage over time
```bash
# Parse logs for token usage patterns
grep "tokens_used" ~/.claude/logs/*.log | awk '{sum+=$NF} END {print sum}'
```

**Solutions:**

Step 1: Optimize Prompt Structure
```markdown
# Inefficient: Repetitive context
"""
You are a senior software engineer. As a senior software engineer, 
you should write clean code. Senior software engineers always consider 
performance. Remember you are a senior software engineer.

Now, as a senior software engineer, analyze this code...
"""

# Efficient: Concise context
"""
You are a senior software engineer focused on clean, performant code.

Analyze this code...
"""
```

Step 2: Use Prompt Caching
```javascript
// Cache static context
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: 'Large static context like documentation, style guides, etc.',
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: [
    { role: 'user', content: 'New query using cached context' }
  ]
});

// Subsequent requests reuse cached context
// Pay only for cache read (10% of cache write cost)
```

Step 3: Implement Token Budget Management
```javascript
class TokenBudget {
  constructor(maxTokens) {
    this.maxTokens = maxTokens;
    this.used = 0;
  }

  canAfford(estimatedTokens) {
    return (this.used + estimatedTokens) <= this.maxTokens;
  }

  async execute(prompt, estimatedTokens) {
    if (!this.canAfford(estimatedTokens)) {
      throw new Error('Token budget exceeded');
    }

    const response = await callClaude(prompt);
    this.used += response.usage.total_tokens;
    return response;
  }

  getRemaining() {
    return this.maxTokens - this.used;
  }
}

// Usage
const budget = new TokenBudget(100000);
await budget.execute(prompt, 5000);
```

**Prevention Strategies:**
- Audit prompts regularly for verbosity
- Use templates for consistent, optimized prompts
- Implement automatic token counting in workflows
- Set up alerts for unusual token consumption
- Train team on token-efficient prompt engineering

**Related Issues:** High costs, context limit errors, budget overruns

**When to Escalate:** If token usage is correct but pricing seems incorrect, verify with billing support.

---

### Issue: Poor Cache Utilization

**Problem Description:**
Prompt caching delivers low hit rates, failing to reduce costs and improve performance as expected.

**Diagnostic Steps:**

1. Check cache statistics
```javascript
// Review response headers for cache info
const response = await anthropic.messages.create({...});
console.log(response.usage);
// {
//   input_tokens: 100,
//   cache_creation_input_tokens: 50,
//   cache_read_input_tokens: 50,
//   output_tokens: 200
// }
```

2. Analyze cache hit patterns
```bash
# Extract cache metrics from logs
grep "cache_hit" ~/.claude/logs/*.log | \
  awk '{hits+=$1; total++} END {print "Hit rate:", (hits/total)*100"%"}'
```

3. Review cache key stability
```python
# Verify cached content isn't changing
import hashlib

def cache_key(content):
    return hashlib.sha256(content.encode()).hexdigest()

key1 = cache_key(system_prompt_v1)
key2 = cache_key(system_prompt_v2)
if key1 != key2:
    print("Cache will miss due to content change")
```

**Solutions:**

Step 1: Structure for Caching
```javascript
// Bad: Entire prompt changes
const prompt = `
Current time: ${new Date()}
User: ${userName}
Context: ${largeContext}
Question: ${userQuestion}
`;

// Good: Cache stable parts
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  system: [
    {
      type: 'text',
      text: largeContext,  // Stable, cache this
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: [
    {
      role: 'user',
      content: `User: ${userName}\nTime: ${new Date()}\nQuestion: ${userQuestion}`
      // Dynamic parts not cached
    }
  ]
});
```

Step 2: Implement Cache Warming
```javascript
// Pre-warm cache with common contexts
async function warmCache() {
  const commonContexts = [
    'Product documentation...',
    'API reference...',
    'Code style guide...'
  ];

  for (const context of commonContexts) {
    await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      system: [
        {
          type: 'text',
          text: context,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 10
    });
  }
}

// Run at application startup
await warmCache();
```

Step 3: Monitor Cache TTL
```javascript
// Cache lasts 5 minutes, keep it alive
class CacheKeepAlive {
  constructor(interval = 4 * 60 * 1000) { // 4 minutes
    this.interval = interval;
    this.contexts = new Map();
  }

  register(key, context) {
    this.contexts.set(key, context);
    this.refresh(key);
  }

  refresh(key) {
    setTimeout(async () => {
      const context = this.contexts.get(key);
      if (context) {
        await this.pingCache(context);
        this.refresh(key); // Schedule next refresh
      }
    }, this.interval);
  }

  async pingCache(context) {
    await anthropic.messages.create({
      system: [{ 
        type: 'text', 
        text: context,
        cache_control: { type: 'ephemeral' }
      }],
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1
    });
  }
}
```

**Prevention Strategies:**
- Design prompts with caching in mind from start
- Separate stable and dynamic content
- Monitor cache hit rates continuously
- Document what should be cached
- Use cache warming for critical paths

**Related Issues:** High costs despite caching attempts, inconsistent performance

**When to Escalate:** If cache hit rate is unexpectedly low despite proper implementation, report with examples.

---

## Resource Optimization

### Issue: Memory Constraints

**Problem Description:**
Application runs out of memory when processing large contexts or multiple concurrent requests.

**Diagnostic Steps:**

1. Profile memory usage
```bash
# Monitor Node.js heap
node --expose-gc --max-old-space-size=4096 app.js &
PID=$!

while kill -0 $PID 2>/dev/null; do
  node -e "console.log(process.memoryUsage())"
  sleep 5
done
```

2. Identify memory leaks
```javascript
// Use heapdump for analysis
const heapdump = require('heapdump');

// Take snapshot before operation
heapdump.writeSnapshot(`./before-${Date.now()}.heapsnapshot`);

// Perform operation
await largeOperation();

// Take snapshot after
heapdump.writeSnapshot(`./after-${Date.now()}.heapsnapshot`);

// Compare in Chrome DevTools
```

3. Check context accumulation
```bash
# Review context sizes in sessions
grep "context_size" ~/.claude/logs/*.log | \
  sort -n -k2 | tail -20
```

**Solutions:**

Step 1: Implement Streaming Processing
```javascript
// Bad: Load entire response into memory
const response = await anthropic.messages.create({...});
const fullText = response.content[0].text;
processLargeText(fullText);

// Good: Stream and process chunks
const stream = await anthropic.messages.create({
  stream: true,
  ...
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    processChunk(chunk.delta.text);
    // Don't accumulate in memory
  }
}
```

Step 2: Use Context Windowing
```javascript
class ContextWindow {
  constructor(maxTokens = 50000) {
    this.maxTokens = maxTokens;
    this.messages = [];
  }

  add(message) {
    this.messages.push(message);
    this.trim();
  }

  trim() {
    let totalTokens = this.estimateTokens();
    
    // Keep system message and recent messages
    while (totalTokens > this.maxTokens && this.messages.length > 2) {
      // Remove oldest user-assistant pair (not system message)
      this.messages.splice(1, 2);
      totalTokens = this.estimateTokens();
    }
  }

  estimateTokens() {
    return this.messages.reduce((sum, msg) => 
      sum + msg.content.length / 4, 0
    );
  }

  get() {
    return this.messages;
  }
}
```

Step 3: Optimize Data Structures
```javascript
// Use WeakMap for automatic garbage collection
class ResponseCache {
  constructor() {
    this.cache = new WeakMap();
  }

  set(key, value) {
    // Automatically GC'd when key has no references
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}

// Use streams for large files
const fs = require('fs');
const readline = require('readline');

async function processLargeFile(filename) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    await processLine(line);
    // Line eligible for GC after processing
  }
}
```

**Prevention Strategies:**
- Set memory limits appropriately for workload
- Use streaming for large data processing
- Implement proper cleanup in long-running processes
- Monitor memory usage in production
- Use worker threads for CPU-intensive tasks

**Related Issues:** Crashes, slow performance, OOM errors

**When to Escalate:** If memory usage grows unbounded despite proper cleanup, investigate for SDK memory leaks.

---

### Issue: Request Rate Limiting

**Problem Description:**
Hitting rate limits causes request failures, delays, and degraded service quality.

**Diagnostic Steps:**

1. Check current rate limit status
```bash
# Review response headers
curl -i https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  | grep -i "x-ratelimit"
```

2. Calculate request rate
```bash
# Count requests per minute
grep "API request" ~/.claude/logs/latest.log | \
  awk '{print $1}' | uniq -c
```

3. Identify request spikes
```javascript
// Log request timing
const requestLog = [];
setInterval(() => {
  console.log(`Requests in last minute: ${requestLog.length}`);
  requestLog.length = 0;
}, 60000);

// Before each request
requestLog.push(Date.now());
```

**Solutions:**

Step 1: Implement Rate Limiting
```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );

    if (this.requests.length >= this.maxRequests) {
      // Wait until oldest request expires
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.acquire(); // Retry
    }

    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(50, 60000); // 50 req/min

await limiter.acquire();
const response = await callClaude(prompt);
```

Step 2: Use Exponential Backoff
```javascript
async function callWithBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 30000);
        console.log(`Rate limited, waiting ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// Usage
const response = await callWithBackoff(() => 
  anthropic.messages.create({...})
);
```

Step 3: Implement Request Batching
```javascript
class RequestBatcher {
  constructor(batchSize = 10, flushInterval = 1000) {
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;
    this.queue = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
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

    const batch = this.queue.splice(0, this.batchSize);
    
    // Process batch with controlled concurrency
    const results = await Promise.allSettled(
      batch.map(item => item.request())
    );

    batch.forEach((item, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        item.resolve(result.value);
      } else {
        item.reject(result.reason);
      }
    });
  }
}
```

**Prevention Strategies:**
- Design systems within rate limits from start
- Use queueing for variable workloads
- Monitor rate limit headers
- Implement graceful degradation
- Consider upgrading plan for higher limits

**Related Issues:** 429 errors, request failures, service degradation

**When to Escalate:** If hitting rate limits despite staying within documented limits, contact support.

---

## Performance Monitoring

### Setting Up Performance Tracking

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      totalLatency: 0,
      totalTokens: 0,
      cacheHits: 0,
      errors: 0
    };
  }

  recordRequest(response, latency) {
    this.metrics.requests++;
    this.metrics.totalLatency += latency;
    this.metrics.totalTokens += response.usage.total_tokens;
    
    if (response.usage.cache_read_input_tokens > 0) {
      this.metrics.cacheHits++;
    }
  }

  recordError() {
    this.metrics.errors++;
  }

  getStats() {
    return {
      avgLatency: this.metrics.totalLatency / this.metrics.requests,
      avgTokens: this.metrics.totalTokens / this.metrics.requests,
      cacheHitRate: this.metrics.cacheHits / this.metrics.requests,
      errorRate: this.metrics.errors / this.metrics.requests,
      throughput: this.metrics.requests / (Date.now() / 1000)
    };
  }

  reset() {
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = 0;
    });
  }
}
```

### Performance Optimization Checklist

- [ ] Use appropriate model for task (Haiku for simple, Opus for complex)
- [ ] Implement streaming for interactive experiences
- [ ] Enable prompt caching for repeated contexts
- [ ] Optimize prompts for conciseness without losing clarity
- [ ] Implement rate limiting and backoff strategies
- [ ] Monitor token usage and set budgets
- [ ] Use connection pooling and persistent connections
- [ ] Implement proper error handling and retries
- [ ] Profile and optimize memory usage
- [ ] Set up performance monitoring and alerting
- [ ] Review and optimize regularly based on metrics
- [ ] Document performance requirements and SLAs

This comprehensive performance optimization guide provides the tools and techniques needed to maximize Claude Code efficiency while maintaining quality and controlling costs.
