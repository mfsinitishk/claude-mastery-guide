# CLI and Tool Issues

## Overview

Command-line interface (CLI) and tool integration issues can disrupt workflows and prevent effective use of Claude Code. This guide addresses common CLI problems, tool execution failures, and configuration issues.

## CLI Installation and Configuration

### Issue: CLI Commands Not Recognized

**Problem Description:**
Claude CLI commands are not recognized by the shell, PATH issues prevent execution, or commands fail with "command not found" errors.

**Diagnostic Steps:**

1. Verify installation
```bash
# Check if Claude is installed
which claude
type claude

# Check npm global packages
npm list -g --depth=0 | grep claude

# Verify installation directory
npm root -g
```

2. Check PATH configuration
```bash
# Display current PATH
echo $PATH

# Check if npm global bin is in PATH
npm config get prefix
```

3. Test with full path
```bash
# Find Claude installation
find /usr -name "claude" 2>/dev/null

# Try executing with full path
/full/path/to/claude --version
```

**Solutions:**

Step 1: Fix PATH Configuration
```bash
# For bash - add to ~/.bashrc
export PATH="$PATH:$(npm config get prefix)/bin"

# For zsh - add to ~/.zshrc
export PATH="$PATH:$(npm config get prefix)/bin"

# For fish - add to ~/.config/fish/config.fish
set -gx PATH $PATH (npm config get prefix)/bin

# Reload configuration
source ~/.zshrc  # or ~/.bashrc
```

Step 2: Reinstall with Proper Permissions
```bash
# Option 1: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to shell config
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc

# Reinstall
npm install -g @anthropic-ai/claude-code

# Option 2: Use npx (no installation needed)
npx @anthropic-ai/claude-code --version
```

Step 3: Create Alias or Wrapper
```bash
# If installation in non-standard location
# Add to shell config
alias claude='/full/path/to/claude'

# Or create wrapper script
cat > ~/bin/claude << 'EOF'
#!/bin/bash
/full/path/to/claude "$@"
EOF

chmod +x ~/bin/claude
```

**Prevention Strategies:**
- Use consistent installation method across team
- Document installation steps in project README
- Use nvm for Node.js version management
- Check PATH configuration during onboarding
- Consider using Docker for consistent environment

**Related Issues:** Permission denied, installation failures, version conflicts

**When to Escalate:** If PATH is correct but command still not found, check for shell-specific configuration issues.

---

### Issue: Configuration File Errors

**Problem Description:**
Configuration files are invalid, settings don't take effect, or CLI fails to parse configuration.

**Diagnostic Steps:**

1. Validate configuration syntax
```bash
# Check JSON validity
jq empty ~/.claude/config.json

# Display current configuration
claude config list

# Check for syntax errors
cat ~/.claude/config.json | python -m json.tool
```

2. Identify configuration location
```bash
# Find all Claude config files
find ~ -name ".claude" -type d 2>/dev/null

# Check which config is being used
claude config path
```

3. Test with default configuration
```bash
# Backup current config
cp ~/.claude/config.json ~/.claude/config.backup.json

# Reset to defaults
claude config reset

# Test if issue persists
claude --version
```

**Solutions:**

Step 1: Fix Configuration Syntax
```javascript
// Valid configuration structure
{
  "apiKey": "sk-ant-...",
  "model": "claude-sonnet-4-5",
  "maxTokens": 4096,
  "temperature": 0.7,
  "streaming": true,
  "cache": {
    "enabled": true,
    "ttl": 300
  },
  "tools": {
    "enabled": ["bash", "read", "write"],
    "disabled": []
  },
  "logging": {
    "level": "info",
    "file": "~/.claude/logs/claude.log"
  }
}
```

Step 2: Validate Configuration Programmatically
```javascript
const fs = require('fs');
const path = require('path');

class ConfigValidator {
  constructor(configPath) {
    this.configPath = configPath;
    this.schema = {
      apiKey: { type: 'string', required: true, pattern: /^sk-ant-/ },
      model: { type: 'string', enum: ['claude-opus-4', 'claude-sonnet-4-5', 'claude-haiku-4'] },
      maxTokens: { type: 'number', min: 1, max: 16384 },
      temperature: { type: 'number', min: 0, max: 1 },
      streaming: { type: 'boolean' }
    };
  }

  validate() {
    const errors = [];

    try {
      // Read and parse config
      const content = fs.readFileSync(this.configPath, 'utf-8');
      const config = JSON.parse(content);

      // Validate each field
      for (const [key, rules] of Object.entries(this.schema)) {
        const value = config[key];

        // Check if required
        if (rules.required && value === undefined) {
          errors.push(`Missing required field: ${key}`);
          continue;
        }

        if (value === undefined) continue;

        // Check type
        if (rules.type && typeof value !== rules.type) {
          errors.push(`Invalid type for ${key}: expected ${rules.type}, got ${typeof value}`);
        }

        // Check enum
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`Invalid value for ${key}: must be one of ${rules.enum.join(', ')}`);
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`Invalid format for ${key}`);
        }

        // Check numeric ranges
        if (rules.min !== undefined && value < rules.min) {
          errors.push(`${key} must be >= ${rules.min}`);
        }

        if (rules.max !== undefined && value > rules.max) {
          errors.push(`${key} must be <= ${rules.max}`);
        }
      }

    } catch (error) {
      if (error instanceof SyntaxError) {
        errors.push(`Invalid JSON syntax: ${error.message}`);
      } else {
        errors.push(`Error reading config: ${error.message}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  fix() {
    // Attempt to fix common issues
    let content = fs.readFileSync(this.configPath, 'utf-8');
    let modified = false;

    // Remove comments (not valid JSON)
    const withoutComments = content.replace(/\/\/.*$/gm, '');
    if (withoutComments !== content) {
      content = withoutComments;
      modified = true;
    }

    // Remove trailing commas
    const withoutTrailingCommas = content.replace(/,(\s*[}\]])/g, '$1');
    if (withoutTrailingCommas !== content) {
      content = withoutTrailingCommas;
      modified = true;
    }

    if (modified) {
      const backupPath = `${this.configPath}.backup`;
      fs.copyFileSync(this.configPath, backupPath);
      fs.writeFileSync(this.configPath, content);
      console.log('Configuration fixed. Backup saved to:', backupPath);
    }

    return modified;
  }
}

// Usage
const validator = new ConfigValidator('~/.claude/config.json');
const result = validator.validate();

if (!result.valid) {
  console.error('Configuration errors:');
  result.errors.forEach(err => console.error('  -', err));
  
  // Try to fix
  if (validator.fix()) {
    console.log('Auto-fix applied. Please review changes.');
  }
}
```

Step 3: Environment-Specific Configuration
```javascript
// config-manager.js
class ConfigManager {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
    this.configPaths = {
      base: '~/.claude/config.json',
      env: `~/.claude/config.${this.env}.json`,
      local: '~/.claude/config.local.json'
    };
  }

  load() {
    const configs = [];

    // Load base config
    if (fs.existsSync(this.expandPath(this.configPaths.base))) {
      configs.push(this.readConfig(this.configPaths.base));
    }

    // Load environment-specific config
    if (fs.existsSync(this.expandPath(this.configPaths.env))) {
      configs.push(this.readConfig(this.configPaths.env));
    }

    // Load local overrides (not committed to git)
    if (fs.existsSync(this.expandPath(this.configPaths.local))) {
      configs.push(this.readConfig(this.configPaths.local));
    }

    // Merge configurations (later configs override earlier)
    return Object.assign({}, ...configs);
  }

  readConfig(configPath) {
    const fullPath = this.expandPath(configPath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  }

  expandPath(configPath) {
    return configPath.replace('~', process.env.HOME);
  }

  save(config) {
    const fullPath = this.expandPath(this.configPaths.local);
    fs.writeFileSync(fullPath, JSON.stringify(config, null, 2));
  }
}
```

**Prevention Strategies:**
- Use configuration validation tools
- Provide configuration templates
- Document all configuration options
- Use environment-specific configs
- Add configuration to version control (except secrets)

**Related Issues:** Settings not applied, unexpected behavior, crashes

**When to Escalate:** If configuration is valid but settings don't apply, may be CLI bug.

---

## Tool Execution Issues

### Issue: External Tool Failures

**Problem Description:**
External tools invoked by Claude fail, timeout, or produce unexpected errors.

**Diagnostic Steps:**

1. Test tool independently
```bash
# Run tool manually
git status
npm test
python script.py

# Check tool availability
which git
which npm
which python

# Verify tool versions
git --version
npm --version
python --version
```

2. Check tool permissions
```bash
# Verify execute permissions
ls -la /path/to/tool

# Test with explicit permissions
chmod +x /path/to/tool
./tool
```

3. Review tool output
```bash
# Capture full output
tool-command 2>&1 | tee output.log

# Check exit code
tool-command
echo $?
```

**Solutions:**

Step 1: Implement Tool Wrapper
```javascript
const { spawn } = require('child_process');

class ToolExecutor {
  constructor(toolConfig) {
    this.config = {
      timeout: toolConfig.timeout || 30000,
      retries: toolConfig.retries || 3,
      cwd: toolConfig.cwd || process.cwd(),
      env: { ...process.env, ...toolConfig.env }
    };
  }

  async execute(command, args = []) {
    let attempt = 0;

    while (attempt < this.config.retries) {
      try {
        return await this.runCommand(command, args);
      } catch (error) {
        attempt++;
        
        if (attempt < this.config.retries) {
          console.log(`Attempt ${attempt} failed, retrying...`);
          await this.delay(1000 * attempt);
        } else {
          throw error;
        }
      }
    }
  }

  async runCommand(command, args) {
    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        cwd: this.config.cwd,
        env: this.config.env,
        shell: true
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, exitCode: code });
        } else {
          reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });

      // Timeout
      const timer = setTimeout(() => {
        proc.kill();
        reject(new Error('Command timeout'));
      }, this.config.timeout);

      proc.on('close', () => clearTimeout(timer));
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const executor = new ToolExecutor({
  timeout: 60000,
  retries: 3,
  cwd: '/project/dir'
});

const result = await executor.execute('git', ['status']);
console.log(result.stdout);
```

Step 2: Add Tool Validation
```javascript
class ToolValidator {
  static async checkAvailability(toolName) {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
      // Try 'which' on Unix-like systems
      await execPromise(`which ${toolName}`);
      return { available: true };
    } catch (error) {
      try {
        // Try 'where' on Windows
        await execPromise(`where ${toolName}`);
        return { available: true };
      } catch (winError) {
        return {
          available: false,
          error: `Tool '${toolName}' not found in PATH`
        };
      }
    }
  }

  static async checkVersion(toolName, requiredVersion) {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
      const { stdout } = await execPromise(`${toolName} --version`);
      const version = this.extractVersion(stdout);

      const meetsRequirement = this.compareVersions(version, requiredVersion) >= 0;

      return {
        installed: true,
        version,
        meetsRequirement,
        required: requiredVersion
      };
    } catch (error) {
      return {
        installed: false,
        error: error.message
      };
    }
  }

  static extractVersion(versionString) {
    const match = versionString.match(/(\d+\.\d+\.\d+)/);
    return match ? match[1] : null;
  }

  static compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;

      if (p1 > p2) return 1;
      if (p1 < p2) return -1;
    }

    return 0;
  }

  static async validateToolchain(requirements) {
    const results = [];

    for (const [tool, version] of Object.entries(requirements)) {
      const availability = await this.checkAvailability(tool);
      
      if (!availability.available) {
        results.push({
          tool,
          status: 'missing',
          message: availability.error
        });
        continue;
      }

      if (version) {
        const versionCheck = await this.checkVersion(tool, version);
        
        if (!versionCheck.meetsRequirement) {
          results.push({
            tool,
            status: 'version_mismatch',
            installed: versionCheck.version,
            required: version
          });
        } else {
          results.push({
            tool,
            status: 'ok',
            version: versionCheck.version
          });
        }
      } else {
        results.push({
          tool,
          status: 'ok'
        });
      }
    }

    return {
      valid: results.every(r => r.status === 'ok'),
      results
    };
  }
}

// Usage
const requirements = {
  'node': '18.0.0',
  'npm': '8.0.0',
  'git': '2.30.0',
  'python': '3.9.0'
};

const validation = await ToolValidator.validateToolchain(requirements);

if (!validation.valid) {
  console.error('Toolchain validation failed:');
  validation.results
    .filter(r => r.status !== 'ok')
    .forEach(r => {
      console.error(`  ${r.tool}: ${r.message || r.status}`);
    });
}
```

Step 3: Create Tool Sandbox
```javascript
class ToolSandbox {
  constructor(config) {
    this.config = {
      allowedCommands: config.allowedCommands || [],
      forbiddenPatterns: config.forbiddenPatterns || [
        /rm\s+-rf\s+\//, // Prevent deleting root
        /dd\s+if=.*of=\/dev/, // Prevent disk wiping
        /:(){ :|:& };:/, // Fork bomb
      ],
      maxOutputSize: config.maxOutputSize || 1024 * 1024, // 1MB
      workingDir: config.workingDir || '/tmp/claude-sandbox'
    };
  }

  async execute(command, args) {
    // Validate command
    if (!this.isCommandAllowed(command)) {
      throw new Error(`Command '${command}' not allowed`);
    }

    // Check for dangerous patterns
    const fullCommand = `${command} ${args.join(' ')}`;
    if (this.containsDangerousPattern(fullCommand)) {
      throw new Error('Command contains forbidden pattern');
    }

    // Execute in sandbox
    return await this.executeInSandbox(command, args);
  }

  isCommandAllowed(command) {
    if (this.config.allowedCommands.length === 0) {
      return true; // Allow all if no restrictions
    }

    return this.config.allowedCommands.includes(command);
  }

  containsDangerousPattern(command) {
    return this.config.forbiddenPatterns.some(pattern =>
      pattern.test(command)
    );
  }

  async executeInSandbox(command, args) {
    const { spawn } = require('child_process');

    return new Promise((resolve, reject) => {
      const proc = spawn(command, args, {
        cwd: this.config.workingDir,
        env: this.getSandboxEnv(),
        shell: false // Prevent shell injection
      });

      let stdout = '';
      let stderr = '';
      let outputSize = 0;

      proc.stdout.on('data', (data) => {
        outputSize += data.length;
        
        if (outputSize > this.config.maxOutputSize) {
          proc.kill();
          reject(new Error('Output size limit exceeded'));
          return;
        }

        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr, exitCode: code });
        } else {
          reject(new Error(`Command failed: ${stderr}`));
        }
      });

      proc.on('error', reject);
    });
  }

  getSandboxEnv() {
    // Restricted environment
    return {
      PATH: '/usr/local/bin:/usr/bin:/bin',
      HOME: this.config.workingDir,
      USER: 'sandbox'
    };
  }
}

// Usage
const sandbox = new ToolSandbox({
  allowedCommands: ['git', 'npm', 'node', 'python'],
  workingDir: '/tmp/claude-sandbox'
});

const result = await sandbox.execute('git', ['status']);
```

**Prevention Strategies:**
- Validate tool availability before execution
- Use sandboxing for untrusted commands
- Set appropriate timeouts
- Implement retry logic
- Log all tool executions

**Related Issues:** Security vulnerabilities, resource exhaustion, permission errors

**When to Escalate:** If tool works manually but fails through CLI, check process spawning configuration.

---

## CLI Performance Issues

### Issue: Slow CLI Startup

**Problem Description:**
Claude CLI takes excessive time to start, commands have high latency, or operations feel sluggish.

**Diagnostic Steps:**

1. Profile startup time
```bash
# Measure total startup time
time claude --version

# Profile with detailed timing
NODE_OPTIONS="--prof" claude --version

# Analyze profile
node --prof-process isolate-*.log > profile.txt
```

2. Check for blocking operations
```bash
# Trace system calls
strace -c claude --version 2>&1 | tail -20

# Monitor file access
fs_usage -w -f filesystem | grep claude
```

3. Identify slow components
```javascript
// Add timing instrumentation
const timings = {};

function timeOperation(name, fn) {
  const start = Date.now();
  const result = fn();
  timings[name] = Date.now() - start;
  return result;
}

// At application exit
process.on('exit', () => {
  console.log('Timing breakdown:');
  Object.entries(timings)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, time]) => {
      console.log(`  ${name}: ${time}ms`);
    });
});
```

**Solutions:**

Step 1: Implement Lazy Loading
```javascript
// Instead of loading everything at startup
const tools = require('./tools');
const config = require('./config');
const plugins = require('./plugins');

// Load on demand
class LazyLoader {
  constructor() {
    this._tools = null;
    this._config = null;
    this._plugins = null;
  }

  get tools() {
    if (!this._tools) {
      const start = Date.now();
      this._tools = require('./tools');
      console.log(`Tools loaded in ${Date.now() - start}ms`);
    }
    return this._tools;
  }

  get config() {
    if (!this._config) {
      this._config = require('./config');
    }
    return this._config;
  }

  get plugins() {
    if (!this._plugins) {
      this._plugins = require('./plugins');
    }
    return this._plugins;
  }
}

const lazy = new LazyLoader();

// Use: lazy.tools.execute(...)
```

Step 2: Cache Expensive Operations
```javascript
const fs = require('fs');
const crypto = require('crypto');

class StartupCache {
  constructor(cachePath = '~/.claude/cache/startup.json') {
    this.cachePath = cachePath.replace('~', process.env.HOME);
    this.cache = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.cachePath)) {
        const content = fs.readFileSync(this.cachePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      console.warn('Cache load failed:', error.message);
    }
    return {};
  }

  save() {
    try {
      const dir = require('path').dirname(this.cachePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.cachePath, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('Cache save failed:', error.message);
    }
  }

  get(key, generator) {
    if (key in this.cache) {
      const cached = this.cache[key];
      
      // Check if still valid
      if (cached.expiresAt && cached.expiresAt > Date.now()) {
        return cached.value;
      }
    }

    // Generate and cache
    const value = generator();
    this.set(key, value, 3600000); // Cache for 1 hour
    return value;
  }

  set(key, value, ttl) {
    this.cache[key] = {
      value,
      expiresAt: Date.now() + ttl,
      updatedAt: Date.now()
    };
    this.save();
  }

  invalidate(key) {
    delete this.cache[key];
    this.save();
  }

  clear() {
    this.cache = {};
    this.save();
  }
}

// Usage
const cache = new StartupCache();

const config = cache.get('user-config', () => {
  // Expensive configuration parsing
  return loadAndParseConfig();
});
```

Step 3: Optimize Initialization
```javascript
class OptimizedCLI {
  constructor() {
    this.initialized = false;
    this.essentialOnly = process.argv.includes('--fast');
  }

  async init() {
    if (this.initialized) return;

    // Essential initialization (always run)
    await this.initEssentials();

    // Full initialization (skip if --fast)
    if (!this.essentialOnly) {
      await this.initFull();
    }

    this.initialized = true;
  }

  async initEssentials() {
    // Only what's absolutely necessary
    this.config = this.loadMinimalConfig();
    this.logger = this.createLogger();
  }

  async initFull() {
    // Everything else
    await Promise.all([
      this.loadPlugins(),
      this.connectMCPServers(),
      this.initializeTools(),
      this.loadHistory()
    ]);
  }

  loadMinimalConfig() {
    // Load only essential config keys
    return {
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: 'claude-sonnet-4-5'
    };
  }

  async execute(command) {
    // Initialize only what's needed for this command
    await this.initForCommand(command);
    
    // Execute
    return await this.runCommand(command);
  }

  async initForCommand(command) {
    // Command-specific initialization
    if (command.needsPlugins) {
      await this.loadPlugins();
    }

    if (command.needsMCP) {
      await this.connectMCPServers();
    }
  }
}
```

**Prevention Strategies:**
- Profile startup regularly
- Use lazy loading for non-critical components
- Cache expensive operations
- Minimize dependencies
- Use asynchronous initialization

**Related Issues:** High CPU usage, slow commands, poor responsiveness

**When to Escalate:** If startup time exceeds 5 seconds despite optimization, profile for specific bottlenecks.

---

This comprehensive CLI and tool troubleshooting guide covers installation, configuration, tool execution, and performance optimization for Claude Code command-line operations.
