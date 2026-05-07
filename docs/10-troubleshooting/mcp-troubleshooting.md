# MCP Server Troubleshooting

## Overview

Model Context Protocol (MCP) servers extend Claude's capabilities by providing custom tools and resources. This guide covers troubleshooting MCP server issues, from configuration problems to runtime errors and performance optimization.

## MCP Server Configuration Issues

### Issue: MCP Server Won't Start

**Problem Description:**
MCP server fails to initialize, exits immediately, or doesn't respond to requests from Claude Code.

**Diagnostic Steps:**

1. Test server manually
```bash
# Run MCP server directly
node /path/to/mcp-server/index.js

# Check for immediate errors
echo $?  # Exit code (0 = success)
```

2. Verify configuration file
```bash
# Check MCP configuration
cat ~/.claude/mcp-servers.json | jq '.'

# Validate JSON syntax
jq empty ~/.claude/mcp-servers.json
```

3. Check server dependencies
```bash
# Navigate to server directory
cd /path/to/mcp-server

# Verify dependencies installed
npm list --depth=0

# Check for missing packages
npm install
```

4. Review server logs
```bash
# Enable MCP debug logging
export MCP_DEBUG=1

# Check Claude logs for MCP errors
grep "MCP" ~/.claude/logs/*.log | tail -20
```

**Solutions:**

Step 1: Fix Configuration
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["/absolute/path/to/server/index.js"],
      "env": {
        "API_KEY": "${API_KEY}",
        "DEBUG": "true"
      },
      "cwd": "/absolute/path/to/server",
      "disabled": false
    }
  }
}
```

Step 2: Create Server Wrapper with Error Handling
```javascript
// server-wrapper.js
const { spawn } = require('child_process');
const fs = require('fs');

class MCPServerWrapper {
  constructor(config) {
    this.config = config;
    this.process = null;
    this.restartCount = 0;
    this.maxRestarts = 5;
  }

  start() {
    try {
      this.process = spawn(this.config.command, this.config.args, {
        env: { ...process.env, ...this.config.env },
        cwd: this.config.cwd,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.process.stdout.on('data', (data) => {
        this.log('stdout', data.toString());
      });

      this.process.stderr.on('data', (data) => {
        this.log('stderr', data.toString());
      });

      this.process.on('exit', (code) => {
        this.log('exit', `Process exited with code ${code}`);
        
        if (code !== 0 && this.restartCount < this.maxRestarts) {
          this.restartCount++;
          setTimeout(() => {
            this.log('info', `Restarting (attempt ${this.restartCount})...`);
            this.start();
          }, 1000 * this.restartCount);
        }
      });

      this.process.on('error', (error) => {
        this.log('error', `Failed to start: ${error.message}`);
      });

    } catch (error) {
      this.log('error', `Start error: ${error.message}`);
    }
  }

  log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    fs.appendFileSync(
      `${this.config.cwd}/server.log`,
      logMessage
    );
    
    console.log(logMessage.trim());
  }

  stop() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

// Usage
const wrapper = new MCPServerWrapper({
  command: 'node',
  args: ['index.js'],
  env: { DEBUG: 'true' },
  cwd: __dirname
});

wrapper.start();
```

Step 3: Implement Health Checks
```javascript
// health-check.js
class MCPHealthChecker {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
  }

  async check() {
    try {
      const response = await fetch(`${this.serverUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        return {
          healthy: true,
          status: data.status,
          uptime: data.uptime
        };
      }

      return {
        healthy: false,
        error: `HTTP ${response.status}`
      };

    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async waitForReady(timeoutMs = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const health = await this.check();
      
      if (health.healthy) {
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Server failed to become ready');
  }
}

// Usage
const checker = new MCPHealthChecker('http://localhost:3000');
await checker.waitForReady();
```

**Prevention Strategies:**
- Use absolute paths in configuration
- Validate configuration before deployment
- Implement proper error logging
- Add health check endpoints to servers
- Document all required environment variables

**Related Issues:** Server crashes, connection refused, timeout errors

**When to Escalate:** If server works standalone but not with Claude, check Claude MCP client implementation.

---

### Issue: MCP Tool Not Available

**Problem Description:**
Custom MCP tools don't appear in Claude's available tools list or fail when invoked.

**Diagnostic Steps:**

1. List available tools
```bash
# Check what tools Claude sees
claude tools list
```

2. Verify tool registration
```javascript
// In your MCP server code
console.log('Registered tools:', server.listTools());
```

3. Test tool directly
```javascript
// Test tool invocation
const result = await server.callTool('tool-name', { arg: 'value' });
console.log('Tool result:', result);
```

4. Check tool schema
```javascript
// Verify tool definition
function validateToolSchema(toolDef) {
  const required = ['name', 'description', 'inputSchema'];
  const missing = required.filter(field => !toolDef[field]);
  
  if (missing.length > 0) {
    console.error('Missing required fields:', missing);
    return false;
  }

  // Validate JSON schema
  if (!toolDef.inputSchema.type) {
    console.error('inputSchema missing type');
    return false;
  }

  return true;
}
```

**Solutions:**

Step 1: Implement Proper Tool Registration
```javascript
// mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

class MyMCPServer {
  constructor() {
    this.server = new Server({
      name: 'my-mcp-server',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {}
      }
    });

    this.setupTools();
  }

  setupTools() {
    // Register list_tools handler
    this.server.setRequestHandler('tools/list', async () => {
      return {
        tools: [
          {
            name: 'analyze_data',
            description: 'Analyzes data and returns insights',
            inputSchema: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  description: 'Data to analyze'
                },
                options: {
                  type: 'object',
                  description: 'Analysis options'
                }
              },
              required: ['data']
            }
          }
        ]
      };
    });

    // Register call_tool handler
    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'analyze_data':
          return await this.analyzeData(args);
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async analyzeData(args) {
    try {
      // Tool implementation
      const result = performAnalysis(args.data, args.options);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start server
const server = new MyMCPServer();
server.run().catch(console.error);
```

Step 2: Add Tool Validation
```javascript
class ToolValidator {
  static validate(toolDef) {
    const errors = [];

    // Check required fields
    if (!toolDef.name || typeof toolDef.name !== 'string') {
      errors.push('Invalid or missing tool name');
    }

    if (!toolDef.description || typeof toolDef.description !== 'string') {
      errors.push('Invalid or missing description');
    }

    if (!toolDef.inputSchema || typeof toolDef.inputSchema !== 'object') {
      errors.push('Invalid or missing inputSchema');
    }

    // Validate input schema
    if (toolDef.inputSchema) {
      if (!toolDef.inputSchema.type) {
        errors.push('inputSchema missing type');
      }

      if (toolDef.inputSchema.type === 'object') {
        if (!toolDef.inputSchema.properties) {
          errors.push('Object schema missing properties');
        }

        if (toolDef.inputSchema.required) {
          if (!Array.isArray(toolDef.inputSchema.required)) {
            errors.push('required must be an array');
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateArgs(inputSchema, args) {
    const errors = [];

    // Check required parameters
    if (inputSchema.required) {
      for (const param of inputSchema.required) {
        if (!(param in args)) {
          errors.push(`Missing required parameter: ${param}`);
        }
      }
    }

    // Check parameter types
    if (inputSchema.properties) {
      for (const [param, schema] of Object.entries(inputSchema.properties)) {
        if (param in args) {
          const value = args[param];
          const expectedType = schema.type;
          const actualType = Array.isArray(value) ? 'array' : typeof value;

          if (actualType !== expectedType) {
            errors.push(`Parameter ${param} expected ${expectedType}, got ${actualType}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

Step 3: Debug Tool Discovery
```javascript
class MCPToolDebugger {
  constructor(serverConfig) {
    this.config = serverConfig;
  }

  async testToolDiscovery() {
    console.log('Testing MCP server tool discovery...\n');

    // Start server
    const server = await this.startServer();

    // Test list tools
    console.log('1. Testing tools/list request...');
    const listResult = await this.sendRequest(server, {
      method: 'tools/list'
    });
    console.log(`Found ${listResult.tools.length} tools\n`);

    // Validate each tool
    console.log('2. Validating tool definitions...');
    for (const tool of listResult.tools) {
      const validation = ToolValidator.validate(tool);
      
      if (validation.valid) {
        console.log(`✓ ${tool.name} - Valid`);
      } else {
        console.log(`✗ ${tool.name} - Invalid:`);
        validation.errors.forEach(err => console.log(`  - ${err}`));
      }
    }

    // Test each tool
    console.log('\n3. Testing tool invocation...');
    for (const tool of listResult.tools) {
      try {
        const testArgs = this.generateTestArgs(tool.inputSchema);
        const result = await this.sendRequest(server, {
          method: 'tools/call',
          params: {
            name: tool.name,
            arguments: testArgs
          }
        });

        console.log(`✓ ${tool.name} - Invocation successful`);
      } catch (error) {
        console.log(`✗ ${tool.name} - Invocation failed: ${error.message}`);
      }
    }

    await this.stopServer(server);
  }

  generateTestArgs(schema) {
    const args = {};

    if (schema.properties) {
      for (const [param, propSchema] of Object.entries(schema.properties)) {
        if (schema.required?.includes(param)) {
          args[param] = this.generateTestValue(propSchema);
        }
      }
    }

    return args;
  }

  generateTestValue(schema) {
    switch (schema.type) {
      case 'string': return 'test';
      case 'number': return 42;
      case 'boolean': return true;
      case 'array': return [];
      case 'object': return {};
      default: return null;
    }
  }
}

// Usage
const debugger = new MCPToolDebugger(serverConfig);
await debugger.testToolDiscovery();
```

**Prevention Strategies:**
- Validate tool schemas before registration
- Test tools independently before integration
- Use TypeScript for type safety
- Document tool requirements clearly
- Implement comprehensive tool testing

**Related Issues:** Tools missing, invocation errors, schema validation failures

**When to Escalate:** If tools are correctly defined but not discovered, check MCP protocol version compatibility.

---

## MCP Runtime Issues

### Issue: MCP Server Performance Degradation

**Problem Description:**
MCP server becomes slow over time, consumes excessive memory, or experiences high CPU usage.

**Diagnostic Steps:**

1. Monitor server resources
```javascript
class ResourceMonitor {
  constructor() {
    this.samples = [];
  }

  sample() {
    const usage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    this.samples.push({
      timestamp: Date.now(),
      memory: {
        heapUsed: usage.heapUsed / 1024 / 1024, // MB
        heapTotal: usage.heapTotal / 1024 / 1024,
        external: usage.external / 1024 / 1024,
        rss: usage.rss / 1024 / 1024
      },
      cpu: {
        user: cpuUsage.user / 1000, // ms
        system: cpuUsage.system / 1000
      }
    });

    // Keep only recent samples
    if (this.samples.length > 100) {
      this.samples.shift();
    }
  }

  getStats() {
    if (this.samples.length === 0) return null;

    const latest = this.samples[this.samples.length - 1];
    const first = this.samples[0];

    return {
      current: latest,
      trend: {
        memoryGrowth: latest.memory.heapUsed - first.memory.heapUsed,
        duration: latest.timestamp - first.timestamp
      }
    };
  }

  startMonitoring(intervalMs = 5000) {
    setInterval(() => {
      this.sample();
      const stats = this.getStats();
      
      if (stats.current.memory.heapUsed > 500) {
        console.warn('High memory usage:', stats.current.memory.heapUsed, 'MB');
      }

      if (stats.trend.memoryGrowth > 100) {
        console.warn('Memory growing rapidly:', stats.trend.memoryGrowth, 'MB');
      }
    }, intervalMs);
  }
}

const monitor = new ResourceMonitor();
monitor.startMonitoring();
```

2. Profile tool execution
```javascript
class ToolProfiler {
  constructor() {
    this.metrics = new Map();
  }

  async profile(toolName, fn) {
    const start = Date.now();
    const startMem = process.memoryUsage().heapUsed;

    try {
      const result = await fn();
      const duration = Date.now() - start;
      const memDelta = process.memoryUsage().heapUsed - startMem;

      this.recordMetric(toolName, {
        duration,
        memoryDelta: memDelta / 1024 / 1024,
        success: true
      });

      return result;
    } catch (error) {
      this.recordMetric(toolName, {
        duration: Date.now() - start,
        success: false,
        error: error.message
      });
      throw error;
    }
  }

  recordMetric(toolName, metric) {
    if (!this.metrics.has(toolName)) {
      this.metrics.set(toolName, []);
    }

    this.metrics.get(toolName).push({
      ...metric,
      timestamp: Date.now()
    });

    // Keep only recent metrics
    const metrics = this.metrics.get(toolName);
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  getStats(toolName) {
    const metrics = this.metrics.get(toolName);
    if (!metrics || metrics.length === 0) return null;

    const successful = metrics.filter(m => m.success);
    
    return {
      totalCalls: metrics.length,
      successRate: successful.length / metrics.length,
      avgDuration: successful.reduce((sum, m) => sum + m.duration, 0) / successful.length,
      avgMemory: successful.reduce((sum, m) => sum + m.memoryDelta, 0) / successful.length,
      p95Duration: this.percentile(successful.map(m => m.duration), 0.95)
    };
  }

  percentile(values, p) {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }
}
```

3. Identify memory leaks
```bash
# Generate heap snapshot
node --inspect mcp-server.js &

# Connect Chrome DevTools to node inspect
# Take heap snapshots before and after operations
# Compare to find retained objects
```

**Solutions:**

Step 1: Implement Resource Limits
```javascript
class ResourceLimitedServer {
  constructor(limits) {
    this.limits = {
      maxMemoryMB: limits.maxMemoryMB || 512,
      maxConcurrentTools: limits.maxConcurrentTools || 10,
      toolTimeoutMs: limits.toolTimeoutMs || 30000
    };
    
    this.activeTools = 0;
    this.toolQueue = [];
  }

  async executeTool(toolName, args) {
    // Check memory
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    if (currentMemory > this.limits.maxMemoryMB) {
      if (global.gc) {
        global.gc(); // Force garbage collection if enabled
      }
      throw new Error('Memory limit exceeded');
    }

    // Check concurrency
    if (this.activeTools >= this.limits.maxConcurrentTools) {
      // Queue the request
      return new Promise((resolve, reject) => {
        this.toolQueue.push({ toolName, args, resolve, reject });
      });
    }

    return await this.executeWithLimits(toolName, args);
  }

  async executeWithLimits(toolName, args) {
    this.activeTools++;

    try {
      // Execute with timeout
      const result = await Promise.race([
        this.invokeTool(toolName, args),
        this.timeout(this.limits.toolTimeoutMs)
      ]);

      return result;
    } finally {
      this.activeTools--;
      this.processQueue();
    }
  }

  async timeout(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    throw new Error('Tool execution timeout');
  }

  processQueue() {
    if (this.toolQueue.length > 0 && this.activeTools < this.limits.maxConcurrentTools) {
      const { toolName, args, resolve, reject } = this.toolQueue.shift();
      
      this.executeWithLimits(toolName, args)
        .then(resolve)
        .catch(reject);
    }
  }
}
```

Step 2: Add Caching Layer
```javascript
class CachingMCPServer {
  constructor() {
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
  }

  async callTool(name, args) {
    const cacheKey = this.getCacheKey(name, args);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log(`Cache hit for ${name}`);
      return cached.result;
    }

    const result = await this.executeToolUncached(name, args);
    
    // Cache if cacheable
    if (this.isCacheable(name)) {
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });

      // Cleanup old entries
      this.cleanupCache();
    }

    return result;
  }

  getCacheKey(name, args) {
    return `${name}:${JSON.stringify(args)}`;
  }

  isCacheable(toolName) {
    // Define which tools can be cached
    const cacheableTools = ['search', 'lookup', 'analyze'];
    return cacheableTools.includes(toolName);
  }

  cleanupCache() {
    const now = Date.now();
    
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }

    // Limit cache size
    if (this.cache.size > 1000) {
      // Remove oldest entries
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      entries.slice(0, 500).forEach(([key]) => {
        this.cache.delete(key);
      });
    }
  }
}
```

Step 3: Implement Connection Pooling
```javascript
class ConnectionPool {
  constructor(createConnection, options = {}) {
    this.createConnection = createConnection;
    this.maxSize = options.maxSize || 10;
    this.minSize = options.minSize || 2;
    this.pool = [];
    this.waiting = [];
    
    this.initialize();
  }

  async initialize() {
    // Create minimum connections
    for (let i = 0; i < this.minSize; i++) {
      const conn = await this.createConnection();
      this.pool.push({ conn, inUse: false, created: Date.now() });
    }
  }

  async acquire() {
    // Find available connection
    const available = this.pool.find(c => !c.inUse);
    
    if (available) {
      available.inUse = true;
      return available.conn;
    }

    // Create new connection if under limit
    if (this.pool.length < this.maxSize) {
      const conn = await this.createConnection();
      this.pool.push({ conn, inUse: true, created: Date.now() });
      return conn;
    }

    // Wait for connection to become available
    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(conn) {
    const poolEntry = this.pool.find(c => c.conn === conn);
    
    if (poolEntry) {
      poolEntry.inUse = false;

      // Give to waiting request
      if (this.waiting.length > 0) {
        const resolve = this.waiting.shift();
        poolEntry.inUse = true;
        resolve(conn);
      }
    }
  }

  async cleanup() {
    // Close idle connections beyond minimum
    const idle = this.pool
      .filter(c => !c.inUse)
      .sort((a, b) => a.created - b.created);

    while (idle.length > this.minSize && this.pool.length > this.minSize) {
      const conn = idle.shift();
      await conn.conn.close();
      this.pool = this.pool.filter(c => c !== conn);
    }
  }

  startCleanup(intervalMs = 60000) {
    setInterval(() => this.cleanup(), intervalMs);
  }
}

// Usage
const pool = new ConnectionPool(
  async () => await createDatabaseConnection(),
  { maxSize: 20, minSize: 5 }
);

pool.startCleanup();

// In tool implementation
const conn = await pool.acquire();
try {
  const result = await conn.query('SELECT * FROM data');
  return result;
} finally {
  pool.release(conn);
}
```

**Prevention Strategies:**
- Set resource limits from the start
- Implement caching for expensive operations
- Use connection pooling for external resources
- Monitor performance continuously
- Profile and optimize hot paths

**Related Issues:** High memory usage, slow responses, crashes

**When to Escalate:** If resource usage is unreasonable despite optimization, may need architectural redesign.

---

## MCP Security Issues

### Issue: Unauthorized MCP Server Access

**Problem Description:**
MCP server is accessed by unauthorized clients or exposes sensitive information through tools.

**Diagnostic Steps:**

1. Check authentication configuration
```javascript
function validateServerAuth(config) {
  const issues = [];

  if (!config.authentication) {
    issues.push('No authentication configured');
  }

  if (config.authentication?.type === 'none') {
    issues.push('Authentication explicitly disabled');
  }

  if (!config.tls) {
    issues.push('TLS not enabled - connections not encrypted');
  }

  return { secure: issues.length === 0, issues };
}
```

2. Audit tool permissions
```javascript
function auditToolPermissions(tools) {
  const risks = [];

  for (const tool of tools) {
    // Check for dangerous operations
    if (tool.name.includes('delete') || tool.name.includes('remove')) {
      risks.push({
        tool: tool.name,
        level: 'high',
        reason: 'Destructive operation'
      });
    }

    // Check for system access
    if (tool.description.match(/file|system|execute|shell/i)) {
      risks.push({
        tool: tool.name,
        level: 'medium',
        reason: 'System access'
      });
    }

    // Check for data exposure
    if (tool.description.match(/password|secret|key|token/i)) {
      risks.push({
        tool: tool.name,
        level: 'critical',
        reason: 'Potential credential exposure'
      });
    }
  }

  return risks;
}
```

**Solutions:**

Step 1: Implement Authentication
```javascript
class AuthenticatedMCPServer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.setupServer();
  }

  setupServer() {
    this.server.setRequestHandler('authenticate', async (request) => {
      const { key } = request.params;
      
      if (!this.validateKey(key)) {
        throw new Error('Invalid API key');
      }

      return {
        authenticated: true,
        sessionId: this.generateSessionId()
      };
    });

    // Validate all other requests
    this.server.setRequestHandler('*', async (request) => {
      if (!request.sessionId) {
        throw new Error('Not authenticated');
      }

      if (!this.isValidSession(request.sessionId)) {
        throw new Error('Session expired');
      }

      // Process request
    });
  }

  validateKey(key) {
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256').update(key).digest('hex');
    const expectedHash = crypto.createHash('sha256').update(this.apiKey).digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(expectedHash)
    );
  }

  generateSessionId() {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }
}
```

Step 2: Add Input Validation
```javascript
class SecureMCPServer {
  validateToolInput(toolName, args) {
    const schema = this.getToolSchema(toolName);
    const errors = [];

    // Validate against schema
    const validation = ToolValidator.validateArgs(schema.inputSchema, args);
    if (!validation.valid) {
      return validation;
    }

    // Additional security checks
    for (const [param, value] of Object.entries(args)) {
      // Check for path traversal
      if (typeof value === 'string' && value.includes('..')) {
        errors.push(`Potential path traversal in ${param}`);
      }

      // Check for command injection
      if (typeof value === 'string' && /[;&|`$]/.test(value)) {
        errors.push(`Potential command injection in ${param}`);
      }

      // Check for SQL injection
      if (typeof value === 'string' && /('|"|;|--|\bunion\b|\bselect\b)/i.test(value)) {
        errors.push(`Potential SQL injection in ${param}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  sanitizeInput(value) {
    if (typeof value !== 'string') return value;

    // Remove dangerous characters
    return value
      .replace(/[<>]/g, '')
      .replace(/[;&|`$]/g, '')
      .replace(/\.\./g, '');
  }
}
```

Step 3: Implement Access Control
```javascript
class AccessControlledMCPServer {
  constructor() {
    this.permissions = new Map();
    this.setupPermissions();
  }

  setupPermissions() {
    // Define which tools require which permissions
    this.permissions.set('read_file', ['file:read']);
    this.permissions.set('write_file', ['file:write']);
    this.permissions.set('execute_command', ['system:execute']);
    this.permissions.set('delete_data', ['data:delete']);
  }

  async callTool(name, args, userPermissions) {
    // Check if user has required permissions
    const required = this.permissions.get(name) || [];
    const hasPermission = required.every(perm => 
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      throw new Error(`Insufficient permissions for ${name}`);
    }

    // Log access attempt
    this.auditLog({
      timestamp: new Date(),
      user: userPermissions.userId,
      tool: name,
      granted: true
    });

    return await this.executeTool(name, args);
  }

  auditLog(entry) {
    // Log to file or monitoring system
    console.log('[AUDIT]', JSON.stringify(entry));
  }
}
```

**Prevention Strategies:**
- Always use authentication for production servers
- Implement principle of least privilege
- Validate and sanitize all inputs
- Audit sensitive operations
- Use TLS for encrypted communications

**Related Issues:** Data breaches, unauthorized access, injection attacks

**When to Escalate:** Any suspected security breach should be escalated immediately to security team.

---

This comprehensive MCP troubleshooting guide covers configuration, runtime, performance, and security issues when working with Model Context Protocol servers in Claude Code.
