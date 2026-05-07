# Agent and Sub-Agent Problems

## Overview

Agent-based workflows in Claude Code involve coordinating multiple agents, managing context, and handling complex multi-step tasks. This guide addresses common issues with agents, sub-agents, and agent orchestration.

## Agent Lifecycle Issues

### Issue: Agent Not Spawning Correctly

**Problem Description:**
Sub-agents fail to initialize, don't receive proper context, or exit prematurely without completing their tasks.

**Diagnostic Steps:**

1. Verify agent configuration
```javascript
function validateAgentConfig(config) {
  const required = ['name', 'role', 'capabilities'];
  const missing = required.filter(field => !config[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missing.join(', ')}`]
    };
  }

  return { valid: true };
}
```

2. Check agent logs
```bash
# Review agent spawn attempts
grep "agent.*spawn" ~/.claude/logs/*.log | tail -20

# Check for initialization errors
grep "agent.*error\|agent.*fail" ~/.claude/logs/*.log
```

3. Test agent independently
```javascript
// Test agent creation directly
async function testAgentSpawn() {
  try {
    const agent = await createAgent({
      name: 'test-agent',
      role: 'analyzer',
      capabilities: ['code-analysis']
    });

    console.log('Agent spawned successfully:', agent.id);
    return agent;
  } catch (error) {
    console.error('Agent spawn failed:', error);
    throw error;
  }
}
```

**Solutions:**

Step 1: Implement Robust Agent Spawning
```javascript
class AgentManager {
  constructor() {
    this.agents = new Map();
    this.maxAgents = 10;
    this.spawnTimeout = 30000;
  }

  async spawn(config) {
    // Validate configuration
    const validation = validateAgentConfig(config);
    if (!validation.valid) {
      throw new Error(`Invalid agent config: ${validation.errors.join(', ')}`);
    }

    // Check agent limit
    if (this.agents.size >= this.maxAgents) {
      throw new Error('Maximum agent limit reached');
    }

    const agentId = this.generateAgentId();
    
    try {
      // Create agent with timeout
      const agent = await Promise.race([
        this.createAgent(agentId, config),
        this.timeout(this.spawnTimeout, `Agent spawn timeout for ${config.name}`)
      ]);

      this.agents.set(agentId, agent);
      
      console.log(`Agent spawned: ${agentId} (${config.name})`);
      return agent;

    } catch (error) {
      console.error(`Failed to spawn agent: ${error.message}`);
      throw error;
    }
  }

  async createAgent(agentId, config) {
    const agent = {
      id: agentId,
      name: config.name,
      role: config.role,
      capabilities: config.capabilities,
      state: 'initializing',
      context: {},
      createdAt: Date.now()
    };

    // Initialize agent
    await this.initializeAgent(agent, config);
    
    agent.state = 'ready';
    return agent;
  }

  async initializeAgent(agent, config) {
    // Set up agent context
    agent.context = {
      systemPrompt: config.systemPrompt || this.getDefaultSystemPrompt(config.role),
      conversationHistory: [],
      tools: config.tools || [],
      maxTokens: config.maxTokens || 100000
    };

    // Run initialization tasks
    if (config.onInit) {
      await config.onInit(agent);
    }
  }

  getDefaultSystemPrompt(role) {
    const prompts = {
      'analyzer': 'You are a code analysis agent. Analyze code for bugs, performance issues, and best practices.',
      'writer': 'You are a code writing agent. Write clean, well-documented code following best practices.',
      'reviewer': 'You are a code review agent. Review code for quality, security, and maintainability.',
      'tester': 'You are a testing agent. Create comprehensive test cases and verify functionality.'
    };

    return prompts[role] || 'You are a helpful AI agent.';
  }

  async terminate(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    agent.state = 'terminating';
    
    // Cleanup agent resources
    await this.cleanupAgent(agent);
    
    this.agents.delete(agentId);
    console.log(`Agent terminated: ${agentId}`);
  }

  async cleanupAgent(agent) {
    // Close any open connections
    // Release resources
    // Save state if needed
  }

  generateAgentId() {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  timeout(ms, message) {
    return new Promise((_, reject) => 
      setTimeout(() => reject(new Error(message)), ms)
    );
  }
}
```

Step 2: Add Agent Health Monitoring
```javascript
class AgentHealthMonitor {
  constructor(agentManager) {
    this.manager = agentManager;
    this.healthChecks = new Map();
  }

  async checkAgent(agentId) {
    const agent = this.manager.agents.get(agentId);
    if (!agent) {
      return { healthy: false, reason: 'Agent not found' };
    }

    const checks = {
      state: agent.state === 'ready',
      responsive: await this.testResponsiveness(agent),
      resources: await this.checkResources(agent),
      uptime: Date.now() - agent.createdAt < 3600000 // Less than 1 hour
    };

    const healthy = Object.values(checks).every(check => check);

    return {
      healthy,
      checks,
      timestamp: Date.now()
    };
  }

  async testResponsiveness(agent) {
    try {
      const start = Date.now();
      // Send simple request to agent
      await this.sendTestMessage(agent);
      const responseTime = Date.now() - start;
      
      return responseTime < 5000; // Should respond within 5s
    } catch (error) {
      return false;
    }
  }

  async checkResources(agent) {
    // Check if agent is consuming reasonable resources
    const contextSize = JSON.stringify(agent.context).length;
    const historySize = agent.context.conversationHistory.length;

    return contextSize < 1000000 && historySize < 100;
  }

  startMonitoring(intervalMs = 30000) {
    setInterval(async () => {
      for (const [agentId, agent] of this.manager.agents.entries()) {
        const health = await this.checkAgent(agentId);
        
        if (!health.healthy) {
          console.warn(`Agent ${agentId} unhealthy:`, health);
          
          // Attempt recovery
          await this.recoverAgent(agentId, health);
        }
      }
    }, intervalMs);
  }

  async recoverAgent(agentId, healthStatus) {
    const agent = this.manager.agents.get(agentId);
    
    if (!healthStatus.checks.responsive) {
      console.log(`Restarting unresponsive agent ${agentId}`);
      await this.manager.terminate(agentId);
      // Optionally respawn with same config
    }

    if (!healthStatus.checks.resources) {
      console.log(`Clearing resources for agent ${agentId}`);
      agent.context.conversationHistory = agent.context.conversationHistory.slice(-10);
    }
  }
}
```

**Prevention Strategies:**
- Validate agent configurations before spawning
- Implement health checks and monitoring
- Set resource limits for agents
- Use timeouts for all agent operations
- Log agent lifecycle events

**Related Issues:** Agent hangs, resource leaks, state corruption

**When to Escalate:** If agents consistently fail to spawn with valid configurations, check system resources.

---

### Issue: Agent Context Loss

**Problem Description:**
Agents lose important context between tasks, provide inconsistent responses, or forget previous instructions.

**Diagnostic Steps:**

1. Inspect agent context
```javascript
function inspectAgentContext(agent) {
  return {
    systemPrompt: agent.context.systemPrompt?.length || 0,
    historySize: agent.context.conversationHistory?.length || 0,
    totalTokens: estimateTokens(agent.context),
    tools: agent.context.tools?.length || 0
  };
}
```

2. Track context changes
```javascript
class ContextTracker {
  constructor() {
    this.snapshots = [];
  }

  capture(agent) {
    this.snapshots.push({
      timestamp: Date.now(),
      agentId: agent.id,
      context: JSON.parse(JSON.stringify(agent.context))
    });

    // Keep only recent snapshots
    if (this.snapshots.length > 50) {
      this.snapshots.shift();
    }
  }

  compareSnapshots(index1, index2) {
    const snap1 = this.snapshots[index1];
    const snap2 = this.snapshots[index2];

    const diff = {
      historyDelta: snap2.context.conversationHistory.length - snap1.context.conversationHistory.length,
      systemPromptChanged: snap1.context.systemPrompt !== snap2.context.systemPrompt,
      toolsChanged: JSON.stringify(snap1.context.tools) !== JSON.stringify(snap2.context.tools)
    };

    return diff;
  }
}
```

**Solutions:**

Step 1: Implement Context Persistence
```javascript
class PersistentAgentContext {
  constructor(agent) {
    this.agent = agent;
    this.checkpointInterval = 5; // Checkpoint every 5 interactions
    this.interactionCount = 0;
  }

  async add(message) {
    this.agent.context.conversationHistory.push(message);
    this.interactionCount++;

    // Checkpoint periodically
    if (this.interactionCount % this.checkpointInterval === 0) {
      await this.checkpoint();
    }
  }

  async checkpoint() {
    try {
      const checkpoint = {
        agentId: this.agent.id,
        timestamp: Date.now(),
        context: this.agent.context,
        interactionCount: this.interactionCount
      };

      // Save to storage
      await this.saveCheckpoint(checkpoint);
      
      console.log(`Context checkpoint saved for agent ${this.agent.id}`);
    } catch (error) {
      console.error('Checkpoint failed:', error);
    }
  }

  async saveCheckpoint(checkpoint) {
    const fs = require('fs').promises;
    const path = `./checkpoints/${checkpoint.agentId}_${checkpoint.timestamp}.json`;
    
    await fs.writeFile(path, JSON.stringify(checkpoint, null, 2));
  }

  async restore(checkpointPath) {
    const fs = require('fs').promises;
    const data = await fs.readFile(checkpointPath, 'utf-8');
    const checkpoint = JSON.parse(data);

    this.agent.context = checkpoint.context;
    this.interactionCount = checkpoint.interactionCount;

    console.log(`Context restored from checkpoint`);
  }

  async getLatestCheckpoint() {
    const fs = require('fs').promises;
    const files = await fs.readdir('./checkpoints');
    
    const agentFiles = files
      .filter(f => f.startsWith(this.agent.id))
      .sort()
      .reverse();

    return agentFiles[0] ? `./checkpoints/${agentFiles[0]}` : null;
  }
}
```

Step 2: Use Structured Context Management
```javascript
class StructuredContextManager {
  constructor(agent) {
    this.agent = agent;
    this.context = {
      core: {}, // Never cleared
      working: {}, // Cleared periodically
      metadata: {} // Agent metadata
    };
  }

  setCoreContext(key, value) {
    // Core context persists for agent lifetime
    this.context.core[key] = value;
  }

  setWorkingContext(key, value) {
    // Working context can be cleared
    this.context.working[key] = value;
  }

  getCoreContext(key) {
    return this.context.core[key];
  }

  getWorkingContext(key) {
    return this.context.working[key];
  }

  clearWorking() {
    this.context.working = {};
  }

  buildPrompt() {
    // Combine contexts into system prompt
    const parts = [
      this.agent.context.systemPrompt,
      '\nCore Context:',
      JSON.stringify(this.context.core, null, 2),
    ];

    if (Object.keys(this.context.working).length > 0) {
      parts.push('\nCurrent Task Context:');
      parts.push(JSON.stringify(this.context.working, null, 2));
    }

    return parts.join('\n');
  }

  summarize() {
    // Create summary of working context before clearing
    const summary = {
      timestamp: Date.now(),
      keysPresent: Object.keys(this.context.working),
      summary: this.generateSummary(this.context.working)
    };

    return summary;
  }

  generateSummary(context) {
    // Simple summary - could use Claude to generate better one
    return JSON.stringify(context, null, 2).substring(0, 500);
  }
}
```

Step 3: Implement Context Synchronization
```javascript
class MultiAgentContextSync {
  constructor() {
    this.sharedContext = new Map();
    this.subscribers = new Map();
  }

  share(key, value, publisherId) {
    this.sharedContext.set(key, {
      value,
      publisher: publisherId,
      timestamp: Date.now()
    });

    // Notify subscribers
    const subscribers = this.subscribers.get(key) || [];
    subscribers.forEach(subscriber => {
      if (subscriber !== publisherId) {
        this.notifySubscriber(subscriber, key, value);
      }
    });
  }

  subscribe(agentId, key) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, []);
    }

    this.subscribers.get(key).push(agentId);
  }

  get(key) {
    const entry = this.sharedContext.get(key);
    return entry ? entry.value : null;
  }

  notifySubscriber(agentId, key, value) {
    // Update subscriber's context
    console.log(`Notifying agent ${agentId} of ${key} update`);
    
    // Would trigger actual context update in agent
    this.updateAgentContext(agentId, key, value);
  }

  updateAgentContext(agentId, key, value) {
    // Implementation depends on agent architecture
  }
}

// Usage
const sync = new MultiAgentContextSync();

// Agent 1 shares findings
sync.share('codeAnalysis', analysisResults, 'agent1');
sync.subscribe('agent2', 'codeAnalysis'); // Agent 2 subscribes

// Agent 2 automatically receives update
```

**Prevention Strategies:**
- Checkpoint context regularly
- Use structured context with core/working separation
- Implement context synchronization for multi-agent scenarios
- Monitor context size and quality
- Test context retention across agent lifecycle

**Related Issues:** Inconsistent behavior, forgotten instructions, repeated questions

**When to Escalate:** If context loss occurs despite proper management, may be underlying framework issue.

---

## Agent Coordination Issues

### Issue: Agent Communication Failures

**Problem Description:**
Agents fail to communicate with each other, messages get lost, or coordination breaks down in multi-agent workflows.

**Diagnostic Steps:**

1. Test agent messaging
```javascript
async function testAgentMessaging(agent1, agent2) {
  const testMessage = {
    from: agent1.id,
    to: agent2.id,
    type: 'test',
    content: 'ping',
    timestamp: Date.now()
  };

  try {
    const response = await sendMessage(testMessage);
    console.log('Message delivered:', response);
    return true;
  } catch (error) {
    console.error('Message failed:', error);
    return false;
  }
}
```

2. Monitor message queue
```javascript
class MessageQueueMonitor {
  constructor(queue) {
    this.queue = queue;
  }

  getStats() {
    return {
      pending: this.queue.length,
      oldestMessage: this.queue[0]?.timestamp || null,
      newestMessage: this.queue[this.queue.length - 1]?.timestamp || null,
      avgAge: this.calculateAvgAge()
    };
  }

  calculateAvgAge() {
    if (this.queue.length === 0) return 0;
    
    const now = Date.now();
    const totalAge = this.queue.reduce((sum, msg) => 
      sum + (now - msg.timestamp), 0
    );
    
    return totalAge / this.queue.length;
  }

  findStuckMessages(thresholdMs = 30000) {
    const now = Date.now();
    return this.queue.filter(msg => 
      now - msg.timestamp > thresholdMs
    );
  }
}
```

**Solutions:**

Step 1: Implement Reliable Messaging
```javascript
class AgentMessageBus {
  constructor() {
    this.queues = new Map(); // Per-agent message queues
    this.handlers = new Map(); // Message handlers
    this.pendingAcks = new Map(); // Pending acknowledgments
  }

  async send(message) {
    const messageId = this.generateMessageId();
    message.id = messageId;
    message.timestamp = Date.now();
    message.attempts = 0;

    // Add to recipient's queue
    if (!this.queues.has(message.to)) {
      this.queues.set(message.to, []);
    }
    
    this.queues.get(message.to).push(message);

    // Wait for acknowledgment
    return await this.waitForAck(messageId, 5000);
  }

  async deliver(agentId) {
    const queue = this.queues.get(agentId) || [];
    const messages = [...queue];
    
    // Clear queue
    this.queues.set(agentId, []);

    // Deliver messages
    for (const message of messages) {
      try {
        await this.handleMessage(agentId, message);
        this.acknowledge(message.id);
      } catch (error) {
        console.error(`Message delivery failed:`, error);
        
        // Retry logic
        if (message.attempts < 3) {
          message.attempts++;
          queue.push(message);
        }
      }
    }
  }

  async handleMessage(agentId, message) {
    const handler = this.handlers.get(message.type);
    
    if (!handler) {
      throw new Error(`No handler for message type: ${message.type}`);
    }

    await handler(agentId, message);
  }

  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }

  acknowledge(messageId) {
    const resolve = this.pendingAcks.get(messageId);
    if (resolve) {
      resolve(true);
      this.pendingAcks.delete(messageId);
    }
  }

  waitForAck(messageId, timeoutMs) {
    return new Promise((resolve, reject) => {
      this.pendingAcks.set(messageId, resolve);
      
      setTimeout(() => {
        if (this.pendingAcks.has(messageId)) {
          this.pendingAcks.delete(messageId);
          reject(new Error('Message acknowledgment timeout'));
        }
      }, timeoutMs);
    });
  }

  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

Step 2: Add Message Routing
```javascript
class AgentRouter {
  constructor(messageBus) {
    this.messageBus = messageBus;
    this.routes = new Map();
  }

  registerRoute(pattern, handler) {
    this.routes.set(pattern, handler);
  }

  async route(message) {
    // Find matching route
    for (const [pattern, handler] of this.routes.entries()) {
      if (this.matches(message, pattern)) {
        return await handler(message);
      }
    }

    // Default routing - direct to recipient
    return await this.messageBus.send(message);
  }

  matches(message, pattern) {
    // Simple pattern matching
    if (pattern.type && message.type !== pattern.type) {
      return false;
    }

    if (pattern.from && message.from !== pattern.from) {
      return false;
    }

    if (pattern.to && message.to !== pattern.to) {
      return false;
    }

    return true;
  }
}

// Usage
const router = new AgentRouter(messageBus);

// Route analysis requests to analyzer agent
router.registerRoute(
  { type: 'analyze' },
  async (message) => {
    message.to = findAvailableAnalyzer();
    return await messageBus.send(message);
  }
);

// Broadcast announcements to all agents
router.registerRoute(
  { type: 'broadcast' },
  async (message) => {
    const agents = getAllAgentIds();
    return await Promise.all(
      agents.map(agentId => 
        messageBus.send({ ...message, to: agentId })
      )
    );
  }
);
```

Step 3: Implement Coordination Patterns
```javascript
class AgentCoordinator {
  constructor(messageBus) {
    this.messageBus = messageBus;
    this.workflows = new Map();
  }

  // Pattern: Request-Response
  async requestResponse(fromAgent, toAgent, request, timeoutMs = 10000) {
    const requestId = this.generateId();

    const responsePromise = new Promise((resolve, reject) => {
      // Register response handler
      const handler = (agentId, message) => {
        if (message.inReplyTo === requestId) {
          resolve(message);
        }
      };

      this.messageBus.registerHandler('response', handler);

      // Timeout
      setTimeout(() => {
        reject(new Error('Response timeout'));
      }, timeoutMs);
    });

    // Send request
    await this.messageBus.send({
      id: requestId,
      from: fromAgent,
      to: toAgent,
      type: 'request',
      content: request
    });

    return await responsePromise;
  }

  // Pattern: Fan-out, Fan-in
  async fanOut(fromAgent, toAgents, task) {
    const taskId = this.generateId();
    const results = [];

    // Send task to all agents
    const promises = toAgents.map(async (agentId) => {
      const result = await this.requestResponse(
        fromAgent,
        agentId,
        { taskId, ...task }
      );
      return { agentId, result };
    });

    // Collect results
    const settled = await Promise.allSettled(promises);
    
    settled.forEach((outcome, i) => {
      if (outcome.status === 'fulfilled') {
        results.push(outcome.value);
      } else {
        console.error(`Agent ${toAgents[i]} failed:`, outcome.reason);
      }
    });

    return results;
  }

  // Pattern: Pipeline
  async pipeline(agents, initialData) {
    let data = initialData;

    for (const agent of agents) {
      const result = await this.requestResponse(
        'coordinator',
        agent,
        { data, stage: agents.indexOf(agent) }
      );

      data = result.content;
    }

    return data;
  }

  // Pattern: Leader Election
  async electLeader(agents) {
    // Simple leader election - highest priority or random
    const votes = new Map();

    const voteRequests = agents.map(agent =>
      this.messageBus.send({
        from: 'coordinator',
        to: agent,
        type: 'vote-request'
      })
    );

    await Promise.all(voteRequests);

    // Collect votes (simplified)
    // In real implementation, would wait for responses
    const leader = agents[Math.floor(Math.random() * agents.length)];

    // Announce leader
    await this.messageBus.send({
      from: 'coordinator',
      to: 'all',
      type: 'leader-elected',
      content: { leader }
    });

    return leader;
  }

  generateId() {
    return `coord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
```

**Prevention Strategies:**
- Use reliable messaging with acknowledgments
- Implement message routing for complex workflows
- Use proven coordination patterns
- Monitor message queues for stuck messages
- Add timeouts to all agent communications

**Related Issues:** Deadlocks, message loss, coordination failures

**When to Escalate:** If coordination issues persist despite proper implementation, consider simpler architecture.

---

## Agent Performance Issues

### Issue: Agent Response Degradation

**Problem Description:**
Agent responses become slower over time, consume excessive resources, or produce lower quality outputs.

**Diagnostic Steps:**

1. Profile agent performance
```javascript
class AgentPerformanceProfiler {
  constructor(agent) {
    this.agent = agent;
    this.metrics = [];
  }

  async profileTask(task) {
    const startTime = Date.now();
    const startMem = process.memoryUsage().heapUsed;

    try {
      const result = await this.agent.execute(task);
      
      const metric = {
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        memoryDelta: process.memoryUsage().heapUsed - startMem,
        success: true,
        contextSize: JSON.stringify(this.agent.context).length
      };

      this.metrics.push(metric);
      return result;

    } catch (error) {
      this.metrics.push({
        timestamp: Date.now(),
        duration: Date.now() - startTime,
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  getStats() {
    const successful = this.metrics.filter(m => m.success);
    
    return {
      totalTasks: this.metrics.length,
      successRate: successful.length / this.metrics.length,
      avgDuration: successful.reduce((sum, m) => sum + m.duration, 0) / successful.length,
      avgMemory: successful.reduce((sum, m) => sum + m.memoryDelta, 0) / successful.length,
      trend: this.analyzeTrend()
    };
  }

  analyzeTrend() {
    if (this.metrics.length < 10) return 'insufficient_data';

    const recent = this.metrics.slice(-5);
    const earlier = this.metrics.slice(-10, -5);

    const recentAvg = recent.reduce((sum, m) => sum + m.duration, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, m) => sum + m.duration, 0) / earlier.length;

    const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;

    if (change > 20) return 'degrading';
    if (change < -20) return 'improving';
    return 'stable';
  }
}
```

2. Monitor resource usage
```bash
# Monitor agent process
ps aux | grep "agent"

# Check memory usage over time
while true; do
  ps -p PID -o %mem,%cpu,rss
  sleep 5
done
```

**Solutions:**

Step 1: Implement Agent Reset
```javascript
class ResettableAgent {
  constructor(config) {
    this.config = config;
    this.resetThreshold = {
      interactions: 100,
      memoryMB: 500,
      durationHours: 2
    };
    
    this.stats = {
      interactions: 0,
      startTime: Date.now()
    };
  }

  async execute(task) {
    // Check if reset needed
    if (this.shouldReset()) {
      await this.reset();
    }

    this.stats.interactions++;
    return await this.performTask(task);
  }

  shouldReset() {
    const memUsed = process.memoryUsage().heapUsed / 1024 / 1024;
    const uptime = (Date.now() - this.stats.startTime) / 1000 / 3600;

    return (
      this.stats.interactions >= this.resetThreshold.interactions ||
      memUsed >= this.resetThreshold.memoryMB ||
      uptime >= this.resetThreshold.durationHours
    );
  }

  async reset() {
    console.log(`Resetting agent ${this.id}...`);

    // Save important context
    const coreContext = this.extractCoreContext();

    // Clear agent state
    this.context = {
      systemPrompt: this.config.systemPrompt,
      conversationHistory: [],
      ...coreContext
    };

    // Reset statistics
    this.stats = {
      interactions: 0,
      startTime: Date.now()
    };

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    console.log(`Agent reset complete`);
  }

  extractCoreContext() {
    // Extract only essential context to preserve
    return {
      preferences: this.context.preferences,
      knownFacts: this.context.knownFacts
    };
  }
}
```

Step 2: Add Response Caching
```javascript
class CachedAgent {
  constructor(agent) {
    this.agent = agent;
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
    this.maxCacheSize = 100;
  }

  async execute(task) {
    const cacheKey = this.getCacheKey(task);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log('Cache hit');
      return cached.result;
    }

    const result = await this.agent.execute(task);

    // Cache result
    this.cache.set(cacheKey, {
      result,
      timestamp: Date.now()
    });

    // Manage cache size
    if (this.cache.size > this.maxCacheSize) {
      this.evictOldest();
    }

    return result;
  }

  getCacheKey(task) {
    // Create cache key from task
    return JSON.stringify({
      type: task.type,
      params: task.params
    });
  }

  evictOldest() {
    // Remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = Math.floor(this.maxCacheSize * 0.2); // Remove 20%
    
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
}
```

**Prevention Strategies:**
- Monitor agent performance continuously
- Implement automatic reset mechanisms
- Use caching for repeated operations
- Set resource limits and enforce them
- Profile regularly to identify bottlenecks

**Related Issues:** Slow responses, high memory usage, degraded quality

**When to Escalate:** If performance degrades despite optimization, may need to scale agent infrastructure.

---

This comprehensive guide covers agent and sub-agent troubleshooting including lifecycle management, context handling, coordination, and performance optimization in Claude Code workflows.
