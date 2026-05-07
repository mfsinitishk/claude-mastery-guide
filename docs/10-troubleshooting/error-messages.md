# Error Messages Reference

## Overview

This comprehensive reference covers common error messages encountered when using Claude Code, their meanings, causes, and solutions. Errors are organized by category for quick lookup.

## Authentication and API Errors

### Error: "Invalid API key"

**Error Code:** 401 Unauthorized

**Full Message:**
```
Authentication error: Invalid API key provided
```

**Causes:**
- API key is incorrect or malformed
- API key has been revoked
- Using wrong environment variable name
- Extra whitespace in API key
- API key not set

**Solutions:**

```bash
# Verify API key format
echo $ANTHROPIC_API_KEY

# Should start with "sk-ant-"
# If not, set correct key
export ANTHROPIC_API_KEY="sk-ant-your-actual-key"

# Test key validity
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5","max_tokens":1024,"messages":[{"role":"user","content":"test"}]}'
```

**Prevention:**
- Store API key in secure credential manager
- Use environment variables consistently
- Validate key format before use
- Never commit API keys to version control

---

### Error: "Rate limit exceeded"

**Error Code:** 429 Too Many Requests

**Full Message:**
```
Rate limit exceeded. Please retry after {seconds} seconds
```

**Causes:**
- Too many requests in short time period
- Exceeded plan's rate limits
- Multiple concurrent requests
- Rapid retry attempts

**Solutions:**

```javascript
// Implement exponential backoff
async function callWithBackoff(fn, maxRetries = 5) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && attempt < maxRetries - 1) {
        const retryAfter = error.headers?.['retry-after'];
        const delay = retryAfter 
          ? parseInt(retryAfter) * 1000
          : Math.min(1000 * Math.pow(2, attempt), 30000);
        
        console.log(`Rate limited. Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// Usage
const response = await callWithBackoff(() => 
  anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello' }]
  })
);
```

**Prevention:**
- Implement rate limiting in your application
- Use request queuing
- Monitor rate limit headers
- Consider upgrading plan for higher limits

---

### Error: "Quota exceeded"

**Error Code:** 429 or 403

**Full Message:**
```
Monthly quota exceeded. Please upgrade your plan or wait until next billing cycle.
```

**Causes:**
- Used all monthly tokens
- Exceeded request count limit
- Hit spending limit

**Solutions:**

```javascript
// Monitor quota usage
class QuotaMonitor {
  constructor(monthlyLimit) {
    this.monthlyLimit = monthlyLimit;
    this.currentUsage = 0;
    this.warningThreshold = 0.8;
  }

  recordUsage(tokens) {
    this.currentUsage += tokens;
    
    const percentage = this.currentUsage / this.monthlyLimit;
    
    if (percentage >= this.warningThreshold) {
      console.warn(`⚠️  Quota usage at ${(percentage * 100).toFixed(1)}%`);
    }

    if (percentage >= 1) {
      throw new Error('Monthly quota exceeded');
    }
  }

  getRemaining() {
    return Math.max(0, this.monthlyLimit - this.currentUsage);
  }

  reset() {
    this.currentUsage = 0;
  }
}

// Usage
const monitor = new QuotaMonitor(1000000); // 1M tokens

// Before each request
if (monitor.getRemaining() < estimatedTokens) {
  throw new Error('Insufficient quota remaining');
}

// After each request
monitor.recordUsage(response.usage.total_tokens);
```

**Prevention:**
- Monitor quota usage proactively
- Set up alerts at 80% usage
- Implement token budgets
- Optimize prompts to reduce token usage
- Consider higher tier plan

---

## Request and Response Errors

### Error: "Context length exceeded"

**Error Code:** 400 Bad Request

**Full Message:**
```
Request too large: total tokens (X) exceeds maximum context length (200000)
```

**Causes:**
- Input + output tokens exceed 200K limit
- Large file attachments
- Excessive conversation history
- Very large system prompts

**Solutions:**

```javascript
class ContextManager {
  constructor(maxTokens = 150000) { // Leave room for response
    this.maxTokens = maxTokens;
    this.messages = [];
  }

  async add(message) {
    this.messages.push(message);
    
    // Check if over limit
    const total = await this.estimateTotal();
    
    if (total > this.maxTokens) {
      await this.reduce();
    }
  }

  async estimateTotal() {
    let total = 0;
    for (const msg of this.messages) {
      total += await this.estimateTokens(msg.content);
    }
    return total;
  }

  async reduce() {
    // Remove oldest messages (keep system prompt)
    if (this.messages.length > 1) {
      // Keep first (system) and last few messages
      const keep = 10;
      this.messages = [
        this.messages[0],
        ...this.messages.slice(-keep)
      ];
    }
  }

  async estimateTokens(text) {
    // Rough estimate: 4 chars per token
    return Math.ceil(text.length / 4);
  }
}
```

**Prevention:**
- Implement automatic context management
- Summarize old conversations
- Use external storage for large documents
- Monitor context size proactively

---

### Error: "Invalid request format"

**Error Code:** 400 Bad Request

**Full Message:**
```
Invalid request body: {specific error details}
```

**Causes:**
- Malformed JSON
- Missing required fields
- Invalid parameter types
- Unsupported parameter values

**Solutions:**

```javascript
class RequestValidator {
  static validate(request) {
    const errors = [];

    // Check required fields
    if (!request.model) {
      errors.push('Missing required field: model');
    }

    if (!request.messages || !Array.isArray(request.messages)) {
      errors.push('Invalid or missing messages array');
    }

    if (!request.max_tokens || typeof request.max_tokens !== 'number') {
      errors.push('Invalid or missing max_tokens');
    }

    // Check message format
    if (request.messages) {
      request.messages.forEach((msg, i) => {
        if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
          errors.push(`Message ${i}: invalid role`);
        }

        if (!msg.content || typeof msg.content !== 'string') {
          errors.push(`Message ${i}: invalid content`);
        }
      });
    }

    // Check parameter ranges
    if (request.temperature !== undefined) {
      if (request.temperature < 0 || request.temperature > 1) {
        errors.push('temperature must be between 0 and 1');
      }
    }

    if (request.max_tokens > 16384) {
      errors.push('max_tokens cannot exceed 16384');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  static validateAndThrow(request) {
    const validation = this.validate(request);
    
    if (!validation.valid) {
      throw new Error(`Invalid request: ${validation.errors.join(', ')}`);
    }
  }
}

// Usage
try {
  RequestValidator.validateAndThrow(request);
  const response = await anthropic.messages.create(request);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

**Prevention:**
- Always validate requests before sending
- Use TypeScript for type safety
- Test with schema validation
- Log and review failed requests

---

### Error: "Model not found"

**Error Code:** 404 Not Found

**Full Message:**
```
Model 'model-name' not found or not available
```

**Causes:**
- Model name typo
- Using deprecated model
- Model not available in region
- Beta model without access

**Solutions:**

```javascript
const VALID_MODELS = {
  'claude-opus-4': {
    name: 'Claude Opus 4',
    available: true,
    contextWindow: 200000
  },
  'claude-sonnet-4-5': {
    name: 'Claude Sonnet 4.5',
    available: true,
    contextWindow: 200000
  },
  'claude-haiku-4': {
    name: 'Claude Haiku 4',
    available: true,
    contextWindow: 200000
  }
};

function validateModel(modelName) {
  if (!VALID_MODELS[modelName]) {
    const available = Object.keys(VALID_MODELS).join(', ');
    throw new Error(
      `Invalid model '${modelName}'. Available models: ${available}`
    );
  }

  if (!VALID_MODELS[modelName].available) {
    throw new Error(`Model '${modelName}' is not currently available`);
  }

  return VALID_MODELS[modelName];
}

// Usage
const model = 'claude-sonnet-4-5';
validateModel(model);

const response = await anthropic.messages.create({
  model,
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello' }]
});
```

**Prevention:**
- Use constants for model names
- Validate model before use
- Keep track of model deprecations
- Test with available models

---

## Tool and MCP Errors

### Error: "Tool execution failed"

**Error Code:** 500 Internal Server Error

**Full Message:**
```
Tool 'tool-name' execution failed: {error details}
```

**Causes:**
- Tool implementation error
- Missing tool dependencies
- Invalid tool arguments
- Tool timeout
- Permission issues

**Solutions:**

```javascript
class ToolExecutor {
  async executeSafely(toolName, args) {
    try {
      // Validate arguments
      this.validateArgs(toolName, args);

      // Execute with timeout
      return await Promise.race([
        this.executeTool(toolName, args),
        this.timeout(30000)
      ]);

    } catch (error) {
      console.error(`Tool execution failed: ${toolName}`, error);

      return {
        success: false,
        error: {
          message: error.message,
          tool: toolName,
          args,
          stack: error.stack
        }
      };
    }
  }

  validateArgs(toolName, args) {
    const schema = this.getToolSchema(toolName);
    
    if (!schema) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    // Validate required arguments
    if (schema.required) {
      for (const param of schema.required) {
        if (!(param in args)) {
          throw new Error(`Missing required parameter: ${param}`);
        }
      }
    }

    // Validate argument types
    if (schema.properties) {
      for (const [param, propSchema] of Object.entries(schema.properties)) {
        if (param in args) {
          this.validateType(args[param], propSchema.type, param);
        }
      }
    }
  }

  validateType(value, expectedType, paramName) {
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    
    if (actualType !== expectedType) {
      throw new Error(
        `Invalid type for ${paramName}: expected ${expectedType}, got ${actualType}`
      );
    }
  }

  timeout(ms) {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tool execution timeout')), ms)
    );
  }

  async executeTool(toolName, args) {
    // Actual tool implementation
    throw new Error('Not implemented');
  }

  getToolSchema(toolName) {
    // Return tool schema
    return null;
  }
}
```

**Prevention:**
- Validate tool arguments
- Implement proper error handling
- Add timeouts to tool execution
- Test tools independently
- Log all tool executions

---

### Error: "MCP server not responding"

**Full Message:**
```
MCP server 'server-name' is not responding
```

**Causes:**
- Server not running
- Network connectivity issues
- Server crashed
- Port conflict
- Firewall blocking

**Solutions:**

```bash
# Check if server is running
ps aux | grep mcp-server

# Check port binding
lsof -i :PORT

# Test server connectivity
curl http://localhost:PORT/health

# Restart server
pkill -f mcp-server
node mcp-server/index.js &

# Check server logs
tail -f mcp-server.log
```

```javascript
class MCPServerMonitor {
  constructor(serverConfig) {
    this.config = serverConfig;
    this.retryAttempts = 0;
    this.maxRetries = 3;
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.config.url}/health`, {
        timeout: 5000
      });

      if (response.ok) {
        this.retryAttempts = 0;
        return { healthy: true };
      }

      return {
        healthy: false,
        status: response.status
      };

    } catch (error) {
      return {
        healthy: false,
        error: error.message
      };
    }
  }

  async ensureAvailable() {
    const health = await this.checkHealth();

    if (health.healthy) {
      return true;
    }

    if (this.retryAttempts >= this.maxRetries) {
      throw new Error('MCP server not available after max retries');
    }

    this.retryAttempts++;
    console.log(`Server not healthy, restarting (attempt ${this.retryAttempts})...`);

    await this.restart();
    await this.waitForReady();

    return this.ensureAvailable();
  }

  async restart() {
    // Kill existing server
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
      await execPromise(`pkill -f ${this.config.name}`);
    } catch (error) {
      // Server might not be running
    }

    // Start server
    const { spawn } = require('child_process');
    
    const server = spawn(this.config.command, this.config.args, {
      detached: true,
      stdio: 'ignore'
    });

    server.unref();
  }

  async waitForReady(timeout = 30000) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const health = await this.checkHealth();
      
      if (health.healthy) {
        return true;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Server failed to start within timeout');
  }
}
```

**Prevention:**
- Implement server health checks
- Auto-restart failed servers
- Monitor server logs
- Use process managers (PM2, systemd)
- Set up alerts for server failures

---

## File and Permission Errors

### Error: "Permission denied"

**Error Code:** EACCES

**Full Message:**
```
Error: EACCES: permission denied, open '/path/to/file'
```

**Causes:**
- Insufficient file permissions
- Directory not accessible
- File owned by different user
- Read-only filesystem
- Security policy restrictions

**Solutions:**

```bash
# Check file permissions
ls -la /path/to/file

# Fix file permissions
chmod 644 /path/to/file  # Read/write for owner, read for others

# Fix directory permissions
chmod 755 /path/to/directory

# Change ownership if needed
sudo chown $USER:$USER /path/to/file

# Grant access to Claude (macOS)
# System Settings > Privacy & Security > Files and Folders
# Grant Terminal access to required directories
```

```javascript
class SafeFileAccess {
  async readFileSafely(filepath) {
    try {
      // Check if file exists
      await fs.access(filepath, fs.constants.F_OK);

      // Check if readable
      await fs.access(filepath, fs.constants.R_OK);

      // Read file
      return await fs.readFile(filepath, 'utf-8');

    } catch (error) {
      if (error.code === 'EACCES') {
        throw new Error(
          `Permission denied: cannot read ${filepath}. ` +
          `Check file permissions with: ls -la ${filepath}`
        );
      }

      if (error.code === 'ENOENT') {
        throw new Error(`File not found: ${filepath}`);
      }

      throw error;
    }
  }

  async writeFileSafely(filepath, content) {
    try {
      const dir = path.dirname(filepath);

      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });

      // Check if directory is writable
      await fs.access(dir, fs.constants.W_OK);

      // Write file
      await fs.writeFile(filepath, content);

    } catch (error) {
      if (error.code === 'EACCES') {
        throw new Error(
          `Permission denied: cannot write to ${filepath}. ` +
          `Check directory permissions with: ls -ld ${path.dirname(filepath)}`
        );
      }

      throw error;
    }
  }
}
```

**Prevention:**
- Set proper permissions during setup
- Use user-owned directories
- Document required permissions
- Test file access before operations
- Avoid system directories

---

### Error: "File not found"

**Error Code:** ENOENT

**Full Message:**
```
Error: ENOENT: no such file or directory, open '/path/to/file'
```

**Causes:**
- File doesn't exist
- Wrong file path
- Typo in filename
- Relative vs absolute path confusion
- File was deleted

**Solutions:**

```javascript
class PathResolver {
  static resolve(filepath) {
    const fs = require('fs');
    const path = require('path');

    // Handle tilde expansion
    if (filepath.startsWith('~')) {
      filepath = filepath.replace('~', process.env.HOME);
    }

    // Convert to absolute path
    const absolutePath = path.resolve(filepath);

    // Check if exists
    if (!fs.existsSync(absolutePath)) {
      // Try to find similar files
      const dir = path.dirname(absolutePath);
      const basename = path.basename(absolutePath);

      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        const similar = files.filter(f => 
          f.toLowerCase().includes(basename.toLowerCase())
        );

        if (similar.length > 0) {
          throw new Error(
            `File not found: ${absolutePath}\n` +
            `Did you mean one of these?\n` +
            similar.map(f => `  - ${path.join(dir, f)}`).join('\n')
          );
        }
      }

      throw new Error(`File not found: ${absolutePath}`);
    }

    return absolutePath;
  }

  static async findFile(filename, searchPaths = [process.cwd()]) {
    const fs = require('fs').promises;
    const path = require('path');

    for (const searchPath of searchPaths) {
      const fullPath = path.join(searchPath, filename);

      try {
        await fs.access(fullPath);
        return fullPath;
      } catch {
        // Continue searching
      }
    }

    throw new Error(
      `File '${filename}' not found in any of these locations:\n` +
      searchPaths.map(p => `  - ${p}`).join('\n')
    );
  }
}

// Usage
try {
  const filepath = PathResolver.resolve('~/project/src/main.js');
  const content = await fs.readFile(filepath, 'utf-8');
} catch (error) {
  console.error(error.message);
}
```

**Prevention:**
- Use absolute paths
- Validate file existence before operations
- Provide helpful error messages
- Suggest similar filenames
- Log file access patterns

---

## Network and Connection Errors

### Error: "Connection timeout"

**Error Code:** ETIMEDOUT

**Full Message:**
```
Error: connect ETIMEDOUT {ip}:{port}
```

**Causes:**
- Network connectivity issues
- Firewall blocking
- Server not responding
- DNS resolution failure
- Slow network

**Solutions:**

```javascript
class ResilientHttpClient {
  constructor(options = {}) {
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;
    this.retryDelay = options.retryDelay || 1000;
  }

  async request(url, options = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.timeout
        );

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response;

      } catch (error) {
        lastError = error;

        if (error.name === 'AbortError') {
          console.log(`Request timeout (attempt ${attempt}/${this.retries})`);
        } else {
          console.log(`Request failed (attempt ${attempt}/${this.retries}):`, error.message);
        }

        if (attempt < this.retries) {
          const delay = this.retryDelay * attempt;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}

// Usage
const client = new ResilientHttpClient({
  timeout: 30000,
  retries: 3
});

try {
  const response = await client.request('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
} catch (error) {
  console.error('Request failed after all retries:', error.message);
}
```

**Prevention:**
- Set appropriate timeouts
- Implement retry logic
- Monitor network connectivity
- Use connection pooling
- Test with poor network conditions

---

## Error Code Quick Reference

| Code | Type | Common Cause | Quick Fix |
|------|------|--------------|-----------|
| 400 | Bad Request | Invalid request format | Validate request structure |
| 401 | Unauthorized | Invalid API key | Check API key configuration |
| 403 | Forbidden | Insufficient permissions | Verify account status |
| 404 | Not Found | Invalid endpoint/model | Check URL and model name |
| 429 | Too Many Requests | Rate limit exceeded | Implement backoff strategy |
| 500 | Internal Server Error | Server issue | Retry request |
| 503 | Service Unavailable | Temporary outage | Check status page |
| EACCES | Permission Denied | File permissions | Fix file/directory permissions |
| ENOENT | File Not Found | Wrong path | Verify file path |
| ETIMEDOUT | Timeout | Network issue | Check connectivity |
| ECONNREFUSED | Connection Refused | Server not running | Start server |

## Error Recovery Patterns

### Automatic Recovery

```javascript
class ErrorRecovery {
  static async withRecovery(operation, recoveryStrategies) {
    let lastError;

    for (const strategy of recoveryStrategies) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        console.log(`Error occurred: ${error.message}`);
        console.log(`Attempting recovery: ${strategy.name}`);

        try {
          await strategy.recover(error);
          console.log('Recovery successful, retrying operation...');
        } catch (recoveryError) {
          console.log(`Recovery failed: ${recoveryError.message}`);
        }
      }
    }

    throw new Error(
      `Operation failed after all recovery attempts. Last error: ${lastError.message}`
    );
  }
}

// Recovery strategies
const strategies = [
  {
    name: 'Clear cache and retry',
    async recover(error) {
      if (error.code === 'EACCES') {
        await clearCache();
      }
    }
  },
  {
    name: 'Reset connection',
    async recover(error) {
      if (error.code === 'ETIMEDOUT') {
        await resetConnection();
      }
    }
  },
  {
    name: 'Exponential backoff',
    async recover(error) {
      if (error.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
];

// Usage
const result = await ErrorRecovery.withRecovery(
  async () => await riskyOperation(),
  strategies
);
```

This comprehensive error reference provides quick lookup for common errors, their causes, and solutions, enabling faster troubleshooting and resolution.
