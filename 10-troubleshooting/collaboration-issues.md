# Team Collaboration Issues

## Overview

Collaboration challenges arise when multiple team members use Claude Code together. This guide addresses issues with shared configurations, workflow coordination, permission management, and maintaining consistency across team members.

## Configuration and Setup Issues

### Issue: Inconsistent Configurations Across Team

**Problem Description:**
Team members have different Claude configurations leading to inconsistent behavior, conflicting settings, or non-reproducible issues.

**Diagnostic Steps:**

1. Compare configurations
```bash
# Export current configuration
claude config export > my-config.json

# Compare with team member
diff my-config.json teammate-config.json

# Check for differences in key settings
jq -S . my-config.json > my-sorted.json
jq -S . teammate-config.json > teammate-sorted.json
diff my-sorted.json teammate-sorted.json
```

2. Identify configuration sources
```bash
# List all configuration files
find ~ -name "*.claude*" -type f 2>/dev/null

# Check which config is active
claude config path

# Show effective configuration
claude config list --show-source
```

3. Verify environment variables
```bash
# List Claude-related env vars
env | grep -i claude
env | grep -i anthropic

# Compare across team
printenv | grep -E "(CLAUDE|ANTHROPIC)" | sort
```

**Solutions:**

Step 1: Create Shared Configuration Template
```json
{
  "version": "1.0.0",
  "team": "engineering",
  "defaults": {
    "model": "claude-sonnet-4-5",
    "maxTokens": 4096,
    "temperature": 0.7,
    "streaming": true
  },
  "tools": {
    "enabled": [
      "bash",
      "read",
      "write",
      "git"
    ],
    "permissions": {
      "bash": {
        "allowedCommands": ["git", "npm", "node"],
        "restrictedPaths": ["/etc", "/sys", "/proc"]
      },
      "write": {
        "allowedPaths": ["./src", "./tests", "./docs"],
        "deniedPatterns": ["*.env", "*.key", "*.pem"]
      }
    }
  },
  "mcp": {
    "servers": {
      "internal-tools": {
        "command": "node",
        "args": ["${WORKSPACE}/mcp-server/index.js"],
        "env": {
          "API_KEY": "${TEAM_API_KEY}"
        }
      }
    }
  },
  "logging": {
    "level": "info",
    "format": "json",
    "destination": "${WORKSPACE}/.claude/logs"
  }
}
```

Step 2: Implement Configuration Sync
```javascript
const fs = require('fs');
const path = require('path');

class ConfigSync {
  constructor(options = {}) {
    this.baseConfigPath = options.baseConfigPath || './.claude/team-config.json';
    this.localConfigPath = options.localConfigPath || 
      path.join(process.env.HOME, '.claude/config.json');
    this.allowLocalOverrides = options.allowLocalOverrides !== false;
  }

  sync() {
    console.log('Syncing configuration from team template...');

    // Load team configuration
    const teamConfig = this.loadTeamConfig();
    
    // Load existing local configuration
    const localConfig = this.loadLocalConfig();

    // Merge configurations
    const merged = this.merge(teamConfig, localConfig);

    // Validate merged configuration
    const validation = this.validate(merged);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(', ')}`);
    }

    // Save merged configuration
    this.saveLocalConfig(merged);

    console.log('Configuration synced successfully');
    return merged;
  }

  loadTeamConfig() {
    if (!fs.existsSync(this.baseConfigPath)) {
      throw new Error(`Team configuration not found: ${this.baseConfigPath}`);
    }

    const content = fs.readFileSync(this.baseConfigPath, 'utf-8');
    return JSON.parse(this.expandVariables(content));
  }

  loadLocalConfig() {
    if (!fs.existsSync(this.localConfigPath)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.localConfigPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.warn('Failed to load local config:', error.message);
      return {};
    }
  }

  merge(teamConfig, localConfig) {
    if (!this.allowLocalOverrides) {
      return teamConfig;
    }

    // Deep merge, with local overrides
    return this.deepMerge(teamConfig, localConfig);
  }

  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  expandVariables(content) {
    // Expand environment variables
    return content.replace(/\$\{(\w+)\}/g, (match, varName) => {
      return process.env[varName] || match;
    });
  }

  validate(config) {
    const errors = [];

    // Validate required fields
    if (!config.defaults) {
      errors.push('Missing required field: defaults');
    }

    if (!config.tools) {
      errors.push('Missing required field: tools');
    }

    // Validate model
    const validModels = ['claude-opus-4', 'claude-sonnet-4-5', 'claude-haiku-4'];
    if (config.defaults?.model && !validModels.includes(config.defaults.model)) {
      errors.push(`Invalid model: ${config.defaults.model}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  saveLocalConfig(config) {
    const dir = path.dirname(this.localConfigPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      this.localConfigPath,
      JSON.stringify(config, null, 2)
    );
  }

  checkForUpdates() {
    const teamConfig = this.loadTeamConfig();
    const localConfig = this.loadLocalConfig();

    // Compare versions
    if (teamConfig.version !== localConfig.version) {
      return {
        updateAvailable: true,
        currentVersion: localConfig.version,
        latestVersion: teamConfig.version
      };
    }

    // Check for configuration drift
    const drift = this.detectDrift(teamConfig, localConfig);

    return {
      updateAvailable: drift.length > 0,
      drift
    };
  }

  detectDrift(teamConfig, localConfig) {
    const drift = [];

    // Compare critical settings
    const criticalPaths = [
      'defaults.model',
      'tools.enabled',
      'mcp.servers'
    ];

    for (const path of criticalPaths) {
      const teamValue = this.getByPath(teamConfig, path);
      const localValue = this.getByPath(localConfig, path);

      if (JSON.stringify(teamValue) !== JSON.stringify(localValue)) {
        drift.push({
          path,
          teamValue,
          localValue
        });
      }
    }

    return drift;
  }

  getByPath(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Usage
const sync = new ConfigSync({
  baseConfigPath: './.claude/team-config.json'
});

// Sync configuration
const config = sync.sync();

// Check for updates periodically
const updates = sync.checkForUpdates();
if (updates.updateAvailable) {
  console.log('Team configuration has been updated. Run sync to update.');
}
```

Step 3: Setup Git Hooks for Configuration Validation
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Validate Claude configuration before commit
if [ -f ".claude/team-config.json" ]; then
  echo "Validating Claude team configuration..."
  
  # Check JSON syntax
  if ! jq empty .claude/team-config.json 2>/dev/null; then
    echo "Error: Invalid JSON in team-config.json"
    exit 1
  fi
  
  # Validate required fields
  if ! jq -e '.defaults' .claude/team-config.json > /dev/null; then
    echo "Error: Missing required field 'defaults'"
    exit 1
  fi
  
  # Check for sensitive data
  if grep -qE "(api[_-]?key|password|secret|token)\s*:\s*\"[^$]" .claude/team-config.json; then
    echo "Error: Possible sensitive data in configuration"
    echo "Use environment variables like \${API_KEY} instead"
    exit 1
  fi
  
  echo "Configuration validation passed"
fi

exit 0
```

**Prevention Strategies:**
- Use version-controlled team configuration template
- Implement automated configuration sync
- Document configuration standards clearly
- Use git hooks to validate configuration changes
- Regular configuration audits

**Related Issues:** Inconsistent behavior, permission errors, workflow conflicts

**When to Escalate:** If team configurations need complex inheritance, consider configuration management tools.

---

### Issue: Conflicting Workflow Patterns

**Problem Description:**
Team members use different workflows, leading to conflicts, redundant work, or incompatible approaches.

**Diagnostic Steps:**

1. Document current workflows
```javascript
class WorkflowAuditor {
  constructor() {
    this.workflows = [];
  }

  recordWorkflow(teamMember, workflow) {
    this.workflows.push({
      teamMember,
      workflow,
      timestamp: Date.now()
    });
  }

  analyze() {
    // Group by workflow type
    const grouped = new Map();

    this.workflows.forEach(({ teamMember, workflow }) => {
      const key = workflow.type;
      
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }

      grouped.get(key).push({ teamMember, workflow });
    });

    // Identify conflicts
    const conflicts = [];

    grouped.forEach((entries, type) => {
      if (entries.length > 1) {
        const variations = new Set(entries.map(e => 
          JSON.stringify(e.workflow)
        ));

        if (variations.size > 1) {
          conflicts.push({
            type,
            variations: Array.from(variations).map(v => JSON.parse(v)),
            teamMembers: entries.map(e => e.teamMember)
          });
        }
      }
    });

    return {
      totalWorkflows: this.workflows.length,
      types: grouped.size,
      conflicts: conflicts.length,
      details: conflicts
    };
  }
}

// Usage
const auditor = new WorkflowAuditor();

auditor.recordWorkflow('Alice', {
  type: 'code-review',
  steps: ['analyze', 'test', 'comment'],
  tools: ['bash', 'git']
});

auditor.recordWorkflow('Bob', {
  type: 'code-review',
  steps: ['lint', 'analyze', 'approve'],
  tools: ['bash', 'git', 'prettier']
});

const analysis = auditor.analyze();
console.log('Workflow conflicts:', analysis.conflicts);
```

2. Identify pattern mismatches
```bash
# Extract workflow patterns from logs
grep "workflow" ~/.claude/logs/*.log | \
  awk '{print $3}' | \
  sort | uniq -c | sort -rn
```

**Solutions:**

Step 1: Define Standard Workflows
```javascript
// workflows.js
const workflows = {
  'code-review': {
    name: 'Code Review',
    description: 'Standard code review process',
    steps: [
      {
        name: 'analyze',
        description: 'Analyze code for issues',
        tools: ['read', 'bash'],
        prompts: [
          'Review this code for bugs, security issues, and best practices'
        ]
      },
      {
        name: 'test',
        description: 'Verify tests are adequate',
        tools: ['read', 'bash'],
        prompts: [
          'Check test coverage and quality'
        ]
      },
      {
        name: 'document',
        description: 'Check documentation',
        tools: ['read'],
        prompts: [
          'Verify code is properly documented'
        ]
      },
      {
        name: 'approve',
        description: 'Provide approval decision',
        tools: ['git'],
        prompts: [
          'Summarize findings and recommendation'
        ]
      }
    ]
  },

  'feature-development': {
    name: 'Feature Development',
    description: 'Standard feature development process',
    steps: [
      {
        name: 'design',
        description: 'Design feature architecture',
        tools: ['read', 'write'],
        prompts: [
          'Design the feature following our architecture patterns'
        ]
      },
      {
        name: 'implement',
        description: 'Implement feature',
        tools: ['read', 'write', 'bash'],
        prompts: [
          'Implement the feature according to design'
        ]
      },
      {
        name: 'test',
        description: 'Create tests',
        tools: ['write', 'bash'],
        prompts: [
          'Create comprehensive tests for the feature'
        ]
      },
      {
        name: 'document',
        description: 'Document feature',
        tools: ['write'],
        prompts: [
          'Document the feature for users and developers'
        ]
      }
    ]
  },

  'bug-fix': {
    name: 'Bug Fix',
    description: 'Standard bug fixing process',
    steps: [
      {
        name: 'reproduce',
        description: 'Reproduce the bug',
        tools: ['read', 'bash'],
        prompts: [
          'Analyze the code to understand how to reproduce the bug'
        ]
      },
      {
        name: 'diagnose',
        description: 'Identify root cause',
        tools: ['read', 'bash'],
        prompts: [
          'Identify the root cause of the bug'
        ]
      },
      {
        name: 'fix',
        description: 'Implement fix',
        tools: ['read', 'write'],
        prompts: [
          'Implement a fix for the identified root cause'
        ]
      },
      {
        name: 'test',
        description: 'Test the fix',
        tools: ['bash', 'write'],
        prompts: [
          'Create tests to verify the fix and prevent regression'
        ]
      }
    ]
  }
};

class WorkflowExecutor {
  constructor(workflowName) {
    this.workflow = workflows[workflowName];
    if (!this.workflow) {
      throw new Error(`Unknown workflow: ${workflowName}`);
    }
    
    this.currentStep = 0;
    this.results = [];
  }

  async executeStep(stepIndex, context = {}) {
    const step = this.workflow.steps[stepIndex];
    if (!step) {
      throw new Error(`Invalid step index: ${stepIndex}`);
    }

    console.log(`\nExecuting step: ${step.name}`);
    console.log(`Description: ${step.description}`);

    const results = [];

    for (const prompt of step.prompts) {
      const response = await this.executePrompt(prompt, context);
      results.push({
        prompt,
        response
      });
    }

    this.results.push({
      step: step.name,
      results,
      timestamp: Date.now()
    });

    return results;
  }

  async executePrompt(prompt, context) {
    // Add context to prompt
    const fullPrompt = this.buildPrompt(prompt, context);
    
    // Execute with Claude
    return await callClaude(fullPrompt);
  }

  buildPrompt(prompt, context) {
    let fullPrompt = prompt;

    if (context.files) {
      fullPrompt += `\n\nFiles to review:\n${context.files.join('\n')}`;
    }

    if (context.constraints) {
      fullPrompt += `\n\nConstraints:\n${context.constraints.join('\n')}`;
    }

    return fullPrompt;
  }

  async executeAll(context = {}) {
    for (let i = 0; i < this.workflow.steps.length; i++) {
      await this.executeStep(i, context);
      this.currentStep = i + 1;
    }

    return this.results;
  }

  getProgress() {
    return {
      workflow: this.workflow.name,
      currentStep: this.currentStep,
      totalSteps: this.workflow.steps.length,
      percentage: (this.currentStep / this.workflow.steps.length) * 100,
      completed: this.currentStep === this.workflow.steps.length
    };
  }
}

// Usage
const executor = new WorkflowExecutor('code-review');

const results = await executor.executeAll({
  files: ['src/auth.js', 'src/users.js'],
  constraints: [
    'Follow our security guidelines',
    'Ensure test coverage > 80%'
  ]
});

console.log('Workflow completed:', executor.getProgress());
```

Step 2: Implement Workflow Templates
```javascript
class WorkflowTemplate {
  constructor(name, config) {
    this.name = name;
    this.config = config;
  }

  customize(overrides) {
    return new WorkflowTemplate(
      this.name,
      this.deepMerge(this.config, overrides)
    );
  }

  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  export() {
    return {
      name: this.name,
      version: '1.0.0',
      ...this.config
    };
  }

  save(filepath) {
    const fs = require('fs');
    fs.writeFileSync(
      filepath,
      JSON.stringify(this.export(), null, 2)
    );
  }

  static load(filepath) {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    return new WorkflowTemplate(data.name, data);
  }
}

// Create and customize templates
const baseReview = new WorkflowTemplate('code-review', workflows['code-review']);

const securityReview = baseReview.customize({
  steps: [
    ...workflows['code-review'].steps,
    {
      name: 'security-scan',
      description: 'Run security analysis',
      tools: ['bash'],
      prompts: ['Analyze code for security vulnerabilities']
    }
  ]
});

// Save for team use
securityReview.save('./.claude/workflows/security-review.json');
```

Step 3: Workflow Validation and Enforcement
```javascript
class WorkflowValidator {
  constructor(requiredWorkflow) {
    this.requiredWorkflow = requiredWorkflow;
  }

  validate(executedSteps) {
    const required = this.requiredWorkflow.steps.map(s => s.name);
    const executed = executedSteps.map(s => s.step);

    const missing = required.filter(r => !executed.includes(r));
    const extra = executed.filter(e => !required.includes(e));
    const outOfOrder = !this.isOrdered(required, executed);

    return {
      valid: missing.length === 0 && !outOfOrder,
      missing,
      extra,
      outOfOrder,
      compliance: executed.length / required.length
    };
  }

  isOrdered(required, executed) {
    let requiredIndex = 0;

    for (const step of executed) {
      const index = required.indexOf(step, requiredIndex);
      
      if (index === -1) continue;
      if (index < requiredIndex) return false;
      
      requiredIndex = index + 1;
    }

    return true;
  }

  async enforce(executor) {
    const validation = this.validate(executor.results);

    if (!validation.valid) {
      const issues = [];

      if (validation.missing.length > 0) {
        issues.push(`Missing required steps: ${validation.missing.join(', ')}`);
      }

      if (validation.outOfOrder) {
        issues.push('Steps executed out of order');
      }

      throw new Error(`Workflow validation failed: ${issues.join('; ')}`);
    }

    return true;
  }
}

// Usage in CI/CD
const validator = new WorkflowValidator(workflows['code-review']);

try {
  await validator.enforce(executor);
  console.log('Workflow compliance verified');
} catch (error) {
  console.error('Workflow compliance failed:', error.message);
  process.exit(1);
}
```

**Prevention Strategies:**
- Document standard workflows clearly
- Provide workflow templates
- Implement workflow validation
- Train team on standard processes
- Regular workflow reviews and updates

**Related Issues:** Inconsistent quality, missed steps, team friction

**When to Escalate:** If workflows are too rigid for team needs, reassess and adjust standards.

---

## Permission and Access Control Issues

### Issue: Inconsistent Permission Settings

**Problem Description:**
Team members have different permission levels, some operations work for certain members but not others, or permissions are overly restrictive/permissive.

**Diagnostic Steps:**

1. Audit current permissions
```javascript
class PermissionAuditor {
  constructor() {
    this.permissions = new Map();
  }

  recordPermissions(user, permissions) {
    this.permissions.set(user, {
      permissions,
      timestamp: Date.now()
    });
  }

  analyze() {
    const allUsers = Array.from(this.permissions.keys());
    const permissionTypes = new Set();

    // Collect all permission types
    this.permissions.forEach(({ permissions }) => {
      Object.keys(permissions).forEach(type => permissionTypes.add(type));
    });

    // Compare permissions across users
    const comparison = {};

    permissionTypes.forEach(type => {
      comparison[type] = {};
      
      allUsers.forEach(user => {
        const userPerms = this.permissions.get(user).permissions;
        comparison[type][user] = userPerms[type] || 'none';
      });
    });

    // Find inconsistencies
    const inconsistencies = [];

    Object.entries(comparison).forEach(([type, userPerms]) => {
      const values = new Set(Object.values(userPerms));
      
      if (values.size > 1) {
        inconsistencies.push({
          permission: type,
          variations: Object.entries(userPerms)
        });
      }
    });

    return {
      totalUsers: allUsers.length,
      permissionTypes: permissionTypes.size,
      inconsistencies: inconsistencies.length,
      details: inconsistencies
    };
  }
}

// Usage
const auditor = new PermissionAuditor();

auditor.recordPermissions('alice', {
  read: 'all',
  write: 'src',
  bash: 'allowed',
  git: 'allowed'
});

auditor.recordPermissions('bob', {
  read: 'all',
  write: 'all',
  bash: 'restricted',
  git: 'allowed'
});

const analysis = auditor.analyze();
console.log('Permission inconsistencies:', analysis.inconsistencies);
```

**Solutions:**

Step 1: Define Role-Based Permissions
```javascript
// permissions.js
const roles = {
  'developer': {
    description: 'Standard developer permissions',
    permissions: {
      read: {
        paths: ['./src', './tests', './docs', './config']
      },
      write: {
        paths: ['./src', './tests', './docs'],
        denied: ['./config/production.json', '**/*.env']
      },
      bash: {
        allowed: ['git', 'npm', 'node', 'yarn', 'pnpm'],
        denied: ['rm -rf /', 'dd', 'mkfs']
      },
      git: {
        operations: ['status', 'diff', 'log', 'branch', 'commit', 'push'],
        branches: {
          create: true,
          delete: false,
          force-push: false
        }
      }
    }
  },

  'senior-developer': {
    description: 'Senior developer with additional permissions',
    inherits: 'developer',
    permissions: {
      write: {
        paths: ['./src', './tests', './docs', './config'],
        denied: ['./config/production.json']
      },
      bash: {
        allowed: ['git', 'npm', 'node', 'yarn', 'pnpm', 'docker'],
        denied: ['rm -rf /']
      },
      git: {
        operations: ['all'],
        branches: {
          create: true,
          delete: true,
          force-push: true,
          protected: ['main', 'production']
        }
      }
    }
  },

  'reviewer': {
    description: 'Code reviewer permissions',
    permissions: {
      read: {
        paths: ['all']
      },
      write: {
        paths: ['./docs/reviews']
      },
      bash: {
        allowed: ['git'],
        denied: ['all-except-git']
      },
      git: {
        operations: ['status', 'diff', 'log'],
        branches: {
          create: false,
          delete: false,
          force-push: false
        }
      }
    }
  }
};

class PermissionManager {
  constructor() {
    this.roles = roles;
    this.userRoles = new Map();
  }

  assignRole(user, roleName) {
    const role = this.roles[roleName];
    if (!role) {
      throw new Error(`Unknown role: ${roleName}`);
    }

    this.userRoles.set(user, roleName);
  }

  getPermissions(user) {
    const roleName = this.userRoles.get(user);
    if (!roleName) {
      throw new Error(`No role assigned to user: ${user}`);
    }

    return this.resolvePermissions(roleName);
  }

  resolvePermissions(roleName) {
    const role = this.roles[roleName];
    let permissions = { ...role.permissions };

    // Handle inheritance
    if (role.inherits) {
      const parentPerms = this.resolvePermissions(role.inherits);
      permissions = this.mergePermissions(parentPerms, permissions);
    }

    return permissions;
  }

  mergePermissions(parent, child) {
    const merged = { ...parent };

    for (const [key, value] of Object.entries(child)) {
      if (value instanceof Object && !Array.isArray(value)) {
        merged[key] = this.mergePermissions(merged[key] || {}, value);
      } else {
        merged[key] = value;
      }
    }

    return merged;
  }

  checkPermission(user, resource, operation) {
    const permissions = this.getPermissions(user);
    const resourcePerms = permissions[resource];

    if (!resourcePerms) {
      return { allowed: false, reason: `No permissions for resource: ${resource}` };
    }

    // Check specific operation
    if (resourcePerms.denied) {
      if (Array.isArray(resourcePerms.denied) && 
          resourcePerms.denied.includes(operation)) {
        return { allowed: false, reason: `Operation explicitly denied: ${operation}` };
      }
    }

    if (resourcePerms.allowed) {
      if (Array.isArray(resourcePerms.allowed) && 
          !resourcePerms.allowed.includes(operation)) {
        return { allowed: false, reason: `Operation not in allowed list: ${operation}` };
      }
    }

    return { allowed: true };
  }

  exportUserConfig(user) {
    const permissions = this.getPermissions(user);
    const roleName = this.userRoles.get(user);

    return {
      user,
      role: roleName,
      permissions,
      generated: new Date().toISOString()
    };
  }
}

// Usage
const manager = new PermissionManager();

manager.assignRole('alice', 'developer');
manager.assignRole('bob', 'senior-developer');
manager.assignRole('charlie', 'reviewer');

// Check permission
const check = manager.checkPermission('alice', 'bash', 'docker');
console.log('Can Alice use docker?', check.allowed);

// Export for Claude configuration
const aliceConfig = manager.exportUserConfig('alice');
fs.writeFileSync(
  '.claude/permissions/alice.json',
  JSON.stringify(aliceConfig, null, 2)
);
```

**Prevention Strategies:**
- Use role-based access control (RBAC)
- Document permission levels clearly
- Regular permission audits
- Automated permission synchronization
- Principle of least privilege

**Related Issues:** Security risks, operational blocks, inconsistent access

**When to Escalate:** If RBAC is insufficient, consider attribute-based access control (ABAC).

---

This comprehensive collaboration troubleshooting guide addresses configuration consistency, workflow standardization, and permission management issues that arise when teams use Claude Code together.
