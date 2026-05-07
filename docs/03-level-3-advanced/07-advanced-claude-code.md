# Advanced Claude Code Features: Mastering the Platform

## Overview

Claude Code is more than a CLI interface - it's a comprehensive development platform with powerful extensibility features that most users never discover. This section reveals the advanced capabilities that transform Claude from a helpful assistant into a fully customized development environment tailored to your workflow.

**What You'll Learn:**
- Hooks system for automated behaviors
- Plugin architecture and development
- Custom skills and commands
- Configuration management
- Advanced debugging and introspection
- Performance optimization techniques

## The Hooks System

Hooks are Claude Code's automation backbone - they allow you to define behaviors that trigger automatically based on events, without manual intervention.

### Understanding Hook Types

```typescript
// Hook types in Claude Code
interface HookTypes {
  // Lifecycle hooks
  'session.start': () => void;
  'session.end': () => void;
  'file.read': (path: string) => void;
  'file.write': (path: string, content: string) => void;
  
  // Tool execution hooks  
  'tool.before': (toolName: string, params: any) => void;
  'tool.after': (toolName: string, result: any) => void;
  'tool.error': (toolName: string, error: Error) => void;
  
  // Git hooks
  'git.commit.before': (files: string[]) => void;
  'git.commit.after': (commitHash: string) => void;
  'git.push.before': (branch: string) => void;
  
  // Task hooks
  'task.create': (task: Task) => void;
  'task.complete': (task: Task, result: any) => void;
  'task.fail': (task: Task, error: Error) => void;
  
  // Agent hooks
  'agent.spawn': (agentId: string, purpose: string) => void;
  'agent.complete': (agentId: string, result: any) => void;
}
```

### Hook Configuration

Hooks are defined in `.claude/settings.json`:

```json
{
  "hooks": {
    "session.start": {
      "command": "echo 'Starting Claude session...'",
      "description": "Session initialization"
    },
    
    "file.write": {
      "command": "npx prettier --write ${file}",
      "description": "Auto-format files on write",
      "pattern": "*.{ts,tsx,js,jsx}"
    },
    
    "git.commit.before": {
      "command": "./scripts/pre-commit-checks.sh",
      "description": "Run pre-commit validations",
      "failOnError": true
    },
    
    "tool.after": {
      "command": "./scripts/log-tool-usage.sh ${tool} ${duration}",
      "description": "Track tool usage metrics",
      "async": true
    }
  }
}
```

### Advanced Hook Patterns

#### 1. Conditional Hooks

Execute hooks only when conditions are met:

```json
{
  "hooks": {
    "file.write": [
      {
        "condition": "${file.ext} === 'ts'",
        "command": "tsc --noEmit ${file}",
        "description": "Type check TypeScript files"
      },
      {
        "condition": "${file.path}.includes('test')",
        "command": "npm test ${file}",
        "description": "Run tests for test files"
      },
      {
        "condition": "${file.size} > 10000",
        "command": "./scripts/check-file-size.sh ${file}",
        "description": "Warn on large files"
      }
    ]
  }
}
```

#### 2. Chained Hooks

Execute multiple commands in sequence:

```json
{
  "hooks": {
    "git.commit.before": {
      "chain": [
        {
          "command": "npm run lint",
          "description": "Lint code"
        },
        {
          "command": "npm test",
          "description": "Run tests"
        },
        {
          "command": "./scripts/security-scan.sh",
          "description": "Security scan"
        },
        {
          "command": "./scripts/check-secrets.sh",
          "description": "Check for secrets"
        }
      ],
      "failFast": true,
      "timeout": 300000
    }
  }
}
```

#### 3. Parallel Hook Execution

Run multiple hooks concurrently:

```json
{
  "hooks": {
    "task.complete": {
      "parallel": [
        {
          "command": "./scripts/notify-slack.sh ${task.id}",
          "description": "Send Slack notification"
        },
        {
          "command": "./scripts/update-dashboard.sh ${task.id}",
          "description": "Update metrics dashboard"
        },
        {
          "command": "./scripts/archive-logs.sh ${task.id}",
          "description": "Archive task logs"
        }
      ],
      "waitForAll": false
    }
  }
}
```

#### 4. Dynamic Hook Generation

Generate hooks programmatically based on project state:

```javascript
// .claude/hooks.js
module.exports = {
  generateHooks: (context) => {
    const hooks = {};
    
    // Add hooks based on project type
    if (context.hasPackageJson) {
      hooks['file.write'] = {
        condition: "${file} === 'package.json'",
        command: "npm install",
        description: "Auto-install dependencies"
      };
    }
    
    // Add hooks for each microservice
    context.services.forEach(service => {
      hooks[`deploy.${service}`] = {
        command: `./scripts/deploy.sh ${service}`,
        description: `Deploy ${service}`
      };
    });
    
    // Environment-specific hooks
    if (context.env === 'production') {
      hooks['git.push.before'] = {
        command: "./scripts/production-safety-check.sh",
        failOnError: true
      };
    }
    
    return hooks;
  }
};
```

### Real-World Hook Examples

#### Automated Code Quality

```json
{
  "hooks": {
    "file.write": {
      "chain": [
        {
          "name": "format",
          "command": "prettier --write ${file}",
          "pattern": "*.{ts,tsx,js,jsx,json,md}"
        },
        {
          "name": "lint",
          "command": "eslint --fix ${file}",
          "pattern": "*.{ts,tsx,js,jsx}"
        },
        {
          "name": "type-check",
          "command": "tsc --noEmit",
          "pattern": "*.ts",
          "async": true
        }
      ]
    },
    
    "session.start": {
      "command": "npm run type-check",
      "description": "Validate types on session start",
      "async": true,
      "suppressErrors": true
    }
  }
}
```

#### Deployment Safety

```json
{
  "hooks": {
    "git.push.before": {
      "condition": "${branch} === 'main'",
      "chain": [
        {
          "command": "npm run build",
          "description": "Verify build succeeds"
        },
        {
          "command": "npm test -- --coverage --threshold=80",
          "description": "Ensure test coverage"
        },
        {
          "command": "./scripts/e2e-tests.sh",
          "description": "Run E2E tests"
        },
        {
          "command": "./scripts/security-scan.sh",
          "description": "Security vulnerability scan"
        },
        {
          "command": "git diff origin/main --stat",
          "description": "Show changes being pushed"
        },
        {
          "command": "./scripts/confirm-push.sh",
          "description": "Manual confirmation required",
          "interactive": true
        }
      ],
      "failFast": true
    }
  }
}
```

#### Observability and Metrics

```json
{
  "hooks": {
    "tool.after": {
      "command": "node .claude/scripts/track-metrics.js",
      "env": {
        "TOOL_NAME": "${tool}",
        "DURATION_MS": "${duration}",
        "SUCCESS": "${success}",
        "TIMESTAMP": "${timestamp}"
      },
      "async": true,
      "suppressErrors": true
    },
    
    "session.end": {
      "command": "node .claude/scripts/session-summary.js",
      "description": "Generate session summary",
      "async": false
    }
  }
}
```

## Plugin System

Plugins extend Claude Code with new capabilities, integrations, and workflows.

### Plugin Architecture

```
┌─────────────────────────────────────────────────┐
│ Claude Code Core                                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Plugin API   │  │ Plugin       │            │
│  │              │◄─┤ Registry     │            │
│  └──────────────┘  └──────────────┘            │
│         ▲                  ▲                    │
│         │                  │                    │
├─────────┼──────────────────┼────────────────────┤
│         │                  │                    │
│  ┌──────┴──────┐    ┌──────┴──────┐            │
│  │   Plugin    │    │   Plugin    │            │
│  │   AWS       │    │   K8s       │            │
│  └─────────────┘    └─────────────┘            │
│                                                 │
│  ┌─────────────┐    ┌─────────────┐            │
│  │   Plugin    │    │   Plugin    │            │
│  │   Datadog   │    │   Slack     │            │
│  └─────────────┘    └─────────────┘            │
└─────────────────────────────────────────────────┘
```

### Creating a Custom Plugin

```typescript
// .claude/plugins/custom-deployment/plugin.ts
import { Plugin, PluginContext, Tool } from '@claude/plugin-sdk';

export default class DeploymentPlugin extends Plugin {
  name = 'custom-deployment';
  version = '1.0.0';
  description = 'Custom deployment automation';
  
  async onLoad(context: PluginContext) {
    // Register tools
    context.registerTool({
      name: 'deploy-service',
      description: 'Deploy a microservice',
      parameters: {
        service: { type: 'string', required: true },
        environment: { type: 'string', required: true },
        version: { type: 'string', required: false }
      },
      execute: this.deployService.bind(this)
    });
    
    // Register hooks
    context.registerHook('git.push.after', async (branch) => {
      if (branch === 'main') {
        await this.autoDeployProduction();
      }
    });
    
    // Register commands
    context.registerCommand('deploy', {
      description: 'Interactive deployment',
      execute: this.interactiveDeploy.bind(this)
    });
    
    // Add MCP server
    context.registerMCPServer({
      name: 'deployment-api',
      url: process.env.DEPLOYMENT_API_URL,
      auth: {
        type: 'bearer',
        token: process.env.DEPLOYMENT_API_TOKEN
      }
    });
  }
  
  private async deployService(params: any): Promise<any> {
    const { service, environment, version } = params;
    
    // Pre-deployment checks
    await this.runPreDeploymentChecks(service, environment);
    
    // Execute deployment
    const deployment = await this.executeDeployment(
      service,
      environment,
      version || 'latest'
    );
    
    // Post-deployment validation
    await this.validateDeployment(deployment.id);
    
    return {
      success: true,
      deploymentId: deployment.id,
      url: deployment.url,
      duration: deployment.duration
    };
  }
  
  private async runPreDeploymentChecks(
    service: string,
    environment: string
  ): Promise<void> {
    const checks = [
      this.checkServiceHealth(service),
      this.checkResourceAvailability(environment),
      this.checkSecurityCompliance(service),
      this.checkDependencies(service)
    ];
    
    const results = await Promise.all(checks);
    
    const failures = results.filter(r => !r.passed);
    if (failures.length > 0) {
      throw new Error(
        `Pre-deployment checks failed: ${failures.map(f => f.reason).join(', ')}`
      );
    }
  }
  
  private async executeDeployment(
    service: string,
    environment: string,
    version: string
  ): Promise<Deployment> {
    // Implementation details...
    return {
      id: 'deploy-123',
      service,
      environment,
      version,
      url: `https://${service}.${environment}.example.com`,
      duration: 45000
    };
  }
  
  private async validateDeployment(deploymentId: string): Promise<void> {
    // Health checks, smoke tests, etc.
  }
  
  private async autoDeployProduction(): Promise<void> {
    // Automated production deployment logic
  }
  
  private async interactiveDeploy(): Promise<void> {
    // Interactive CLI deployment wizard
  }
  
  // Helper methods
  private async checkServiceHealth(service: string): Promise<CheckResult> {
    // Implementation
    return { passed: true };
  }
  
  private async checkResourceAvailability(env: string): Promise<CheckResult> {
    // Implementation
    return { passed: true };
  }
  
  private async checkSecurityCompliance(service: string): Promise<CheckResult> {
    // Implementation
    return { passed: true };
  }
  
  private async checkDependencies(service: string): Promise<CheckResult> {
    // Implementation
    return { passed: true };
  }
}
```

### Plugin Configuration

```json
// .claude/plugins/custom-deployment/config.json
{
  "name": "custom-deployment",
  "version": "1.0.0",
  "enabled": true,
  
  "settings": {
    "defaultEnvironment": "staging",
    "autoDeployOnMerge": true,
    "requireApproval": {
      "staging": false,
      "production": true
    },
    "healthCheckTimeout": 60000,
    "rollbackOnFailure": true
  },
  
  "environments": [
    {
      "name": "development",
      "k8sContext": "dev-cluster",
      "namespace": "dev",
      "autoScale": true
    },
    {
      "name": "staging",
      "k8sContext": "staging-cluster",
      "namespace": "staging",
      "autoScale": true
    },
    {
      "name": "production",
      "k8sContext": "prod-cluster",
      "namespace": "prod",
      "autoScale": true,
      "requireApproval": true,
      "deploymentWindow": {
        "start": "02:00",
        "end": "06:00",
        "timezone": "UTC"
      }
    }
  ],
  
  "integrations": {
    "slack": {
      "enabled": true,
      "channel": "#deployments",
      "notifyOn": ["start", "success", "failure"]
    },
    "datadog": {
      "enabled": true,
      "trackDeployments": true,
      "tags": ["team:platform", "service:${service}"]
    },
    "pagerduty": {
      "enabled": true,
      "escalateOn": ["deployment_failure", "rollback"]
    }
  }
}
```

### Plugin Installation and Management

```bash
# Install plugin from registry
claude plugin install @claude/aws-plugin

# Install local plugin
claude plugin install ./plugins/custom-deployment

# List installed plugins
claude plugin list

# Enable/disable plugin
claude plugin enable custom-deployment
claude plugin disable custom-deployment

# Update plugin
claude plugin update custom-deployment

# Uninstall plugin
claude plugin uninstall custom-deployment

# Plugin configuration
claude plugin config custom-deployment --set defaultEnvironment=production
```

## Skills System

Skills are reusable workflows that can be invoked with slash commands.

### Anatomy of a Skill

```typescript
// .claude/skills/code-review.ts
import { Skill, SkillContext, SkillResult } from '@claude/sdk';

export default class CodeReviewSkill extends Skill {
  name = 'code-review';
  description = 'Comprehensive code review workflow';
  
  parameters = {
    pr: { 
      type: 'string', 
      description: 'PR number or URL',
      required: false 
    },
    depth: { 
      type: 'enum',
      values: ['quick', 'standard', 'thorough'],
      default: 'standard'
    },
    focus: {
      type: 'array',
      items: ['security', 'performance', 'style', 'tests'],
      default: ['security', 'performance']
    }
  };
  
  async execute(context: SkillContext): Promise<SkillResult> {
    const { pr, depth, focus } = context.params;
    
    // Get PR details
    const prDetails = pr 
      ? await this.getPRDetails(pr)
      : await this.getCurrentBranch();
    
    // Run review based on depth
    const review = await this.runReview(prDetails, depth, focus);
    
    // Generate report
    const report = await this.generateReport(review);
    
    // Post results
    if (pr) {
      await this.postToGitHub(pr, report);
    }
    
    return {
      success: true,
      data: report,
      artifacts: [
        { type: 'file', path: 'reports/code-review.md' },
        { type: 'metrics', data: review.metrics }
      ]
    };
  }
  
  private async runReview(
    prDetails: PRDetails,
    depth: string,
    focus: string[]
  ): Promise<Review> {
    const agents = this.createAgents(focus);
    
    const tasks = this.createReviewTasks(prDetails, depth, agents);
    
    // Execute tasks in parallel
    const results = await Promise.all(
      tasks.map(task => this.executeTask(task))
    );
    
    return this.aggregateResults(results);
  }
  
  private createAgents(focus: string[]): Agent[] {
    const agentMap = {
      security: new SecurityAgent(),
      performance: new PerformanceAgent(),
      style: new StyleAgent(),
      tests: new TestAgent()
    };
    
    return focus.map(f => agentMap[f]);
  }
  
  private createReviewTasks(
    prDetails: PRDetails,
    depth: string,
    agents: Agent[]
  ): Task[] {
    const files = prDetails.changedFiles;
    
    const tasksPerAgent = {
      quick: 1,      // High-level overview only
      standard: 3,   // Key areas
      thorough: 10   // Comprehensive deep dive
    }[depth];
    
    return agents.flatMap(agent =>
      this.createAgentTasks(agent, files, tasksPerAgent)
    );
  }
  
  // Additional helper methods...
}
```

### Skill Composition

Skills can call other skills:

```typescript
// .claude/skills/deploy-and-monitor.ts
export default class DeployAndMonitorSkill extends Skill {
  name = 'deploy-and-monitor';
  
  async execute(context: SkillContext): Promise<SkillResult> {
    // Call deployment skill
    const deployResult = await context.runSkill('deploy', {
      service: context.params.service,
      environment: context.params.environment
    });
    
    if (!deployResult.success) {
      return {
        success: false,
        error: 'Deployment failed'
      };
    }
    
    // Call monitoring skill
    const monitorResult = await context.runSkill('monitor-health', {
      service: context.params.service,
      duration: '10m',
      metrics: ['error_rate', 'latency', 'throughput']
    });
    
    if (!monitorResult.healthy) {
      // Rollback
      await context.runSkill('rollback', {
        deploymentId: deployResult.deploymentId
      });
      
      return {
        success: false,
        error: 'Health check failed, rolled back'
      };
    }
    
    return {
      success: true,
      message: 'Deployment successful and healthy'
    };
  }
}
```

### Skill Discovery and Usage

```bash
# List available skills
claude skills list

# Get skill details
claude skills info code-review

# Run skill with parameters
claude /code-review --pr 123 --depth thorough --focus security,performance

# Interactive skill execution
claude /code-review

# Skill help
claude /code-review --help
```

## Advanced Configuration

### Environment-Specific Settings

```json
// .claude/settings.json
{
  "environments": {
    "development": {
      "debug": true,
      "logLevel": "verbose",
      "hooks": {
        "file.write": {
          "command": "echo 'File written: ${file}'"
        }
      },
      "plugins": {
        "security-scan": {
          "enabled": false
        }
      }
    },
    
    "staging": {
      "debug": false,
      "logLevel": "info",
      "hooks": {
        "git.push.before": {
          "command": "./scripts/staging-checks.sh"
        }
      },
      "plugins": {
        "security-scan": {
          "enabled": true,
          "level": "standard"
        }
      }
    },
    
    "production": {
      "debug": false,
      "logLevel": "warn",
      "hooks": {
        "git.push.before": {
          "chain": [
            "./scripts/production-safety-check.sh",
            "./scripts/require-approval.sh"
          ],
          "failFast": true
        }
      },
      "plugins": {
        "security-scan": {
          "enabled": true,
          "level": "strict"
        },
        "compliance-check": {
          "enabled": true
        }
      },
      "requireApproval": true
    }
  },
  
  "currentEnvironment": "development"
}
```

### Team Settings and Inheritance

```json
// .claude/settings.json (team-wide)
{
  "team": {
    "name": "platform-team",
    "settings": {
      "codeStyle": "airbnb",
      "testCoverage": 80,
      "securityLevel": "high",
      "autoFormat": true
    },
    
    "hooks": {
      "git.commit.before": {
        "command": "./scripts/team-pre-commit.sh"
      }
    },
    
    "plugins": [
      "@team/security-plugin",
      "@team/monitoring-plugin"
    ]
  },
  
  "user": {
    "name": "john.doe",
    "overrides": {
      "logLevel": "debug",
      "additionalPlugins": [
        "@personal/productivity-plugin"
      ]
    }
  }
}
```

### Project-Specific Configuration

```json
// .claude/projects/microservice-a.json
{
  "name": "microservice-a",
  "type": "nodejs",
  
  "paths": {
    "source": "src/",
    "tests": "tests/",
    "build": "dist/"
  },
  
  "commands": {
    "build": "npm run build",
    "test": "npm test",
    "deploy": "./scripts/deploy.sh"
  },
  
  "mcp": {
    "servers": [
      {
        "name": "service-database",
        "type": "postgresql",
        "connection": "${DATABASE_URL}"
      },
      {
        "name": "service-cache",
        "type": "redis",
        "connection": "${REDIS_URL}"
      }
    ]
  },
  
  "agents": {
    "reviewer": {
      "type": "code-review",
      "focus": ["security", "performance"],
      "autoRun": true
    },
    "tester": {
      "type": "test-generation",
      "coverage": 80,
      "autoRun": false
    }
  },
  
  "workflows": {
    "pr-review": {
      "steps": [
        "run-tests",
        "security-scan",
        "code-review",
        "coverage-check"
      ]
    },
    "deploy": {
      "steps": [
        "build",
        "test",
        "security-scan",
        "deploy-staging",
        "smoke-test",
        "deploy-production"
      ]
    }
  }
}
```

## Debugging and Introspection

### Debug Mode

```bash
# Enable debug logging
export CLAUDE_DEBUG=true
claude /code-review

# Verbose logging
export CLAUDE_LOG_LEVEL=verbose
claude /deploy

# Trace mode (very detailed)
export CLAUDE_TRACE=true
claude /complex-workflow
```

### Introspection Tools

```bash
# Show current configuration
claude config show

# Show loaded plugins
claude plugin list --verbose

# Show active hooks
claude hooks list

# Show skill details
claude skills info --all

# Show MCP servers
claude mcp list

# Performance profiling
claude profile /code-review --pr 123

# View session logs
claude logs --tail 100

# Analyze tool usage
claude analytics tools --last 7d
```

### Performance Monitoring

```typescript
// .claude/scripts/performance-monitor.ts
class PerformanceMonitor {
  private metrics: Map<string, Metric[]> = new Map();
  
  trackTool(toolName: string, duration: number): void {
    if (!this.metrics.has(toolName)) {
      this.metrics.set(toolName, []);
    }
    
    this.metrics.get(toolName)!.push({
      duration,
      timestamp: Date.now()
    });
  }
  
  getReport(): PerformanceReport {
    const report = {};
    
    for (const [tool, metrics] of this.metrics) {
      const durations = metrics.map(m => m.duration);
      
      report[tool] = {
        count: metrics.length,
        avgDuration: avg(durations),
        minDuration: Math.min(...durations),
        maxDuration: Math.max(...durations),
        p50: percentile(durations, 0.5),
        p95: percentile(durations, 0.95),
        p99: percentile(durations, 0.99)
      };
    }
    
    return report;
  }
  
  getBottlenecks(threshold: number = 1000): string[] {
    const bottlenecks = [];
    
    for (const [tool, stats] of Object.entries(this.getReport())) {
      if (stats.avgDuration > threshold) {
        bottlenecks.push({
          tool,
          avgDuration: stats.avgDuration,
          impact: stats.count * stats.avgDuration
        });
      }
    }
    
    return bottlenecks
      .sort((a, b) => b.impact - a.impact)
      .map(b => b.tool);
  }
}
```

## Best Practices

### 1. Modular Hook Design

Keep hooks small and focused:

```json
{
  "hooks": {
    // Good: Specific, single purpose
    "file.write.format": {
      "command": "prettier --write ${file}"
    },
    "file.write.lint": {
      "command": "eslint --fix ${file}"
    },
    
    // Avoid: Monolithic, hard to debug
    "file.write": {
      "command": "./scripts/do-everything.sh ${file}"
    }
  }
}
```

### 2. Error Handling in Hooks

Always handle errors gracefully:

```json
{
  "hooks": {
    "git.commit.before": {
      "command": "./scripts/pre-commit.sh",
      "onError": {
        "action": "warn",
        "message": "Pre-commit check failed, but allowing commit",
        "log": true
      }
    }
  }
}
```

### 3. Performance Considerations

Avoid blocking hooks when possible:

```json
{
  "hooks": {
    // Good: Non-blocking
    "tool.after": {
      "command": "./scripts/log-metrics.sh",
      "async": true,
      "suppressErrors": true
    },
    
    // Careful: Blocks user action
    "file.write": {
      "command": "npm test",
      "async": false
    }
  }
}
```

### 4. Testing Hooks and Plugins

```bash
# Test hook execution
claude hooks test file.write --file test.ts

# Test plugin
claude plugin test custom-deployment

# Dry run
claude --dry-run /deploy

# Validation mode
claude validate config
```

## Conclusion

Advanced Claude Code features - hooks, plugins, and skills - transform the CLI from a tool you use into a platform that works for you. By mastering these capabilities, you can automate repetitive tasks, enforce team standards, and create custom workflows tailored to your specific needs.

**Key Takeaways:**

1. **Hooks automate behaviors** - Define once, execute automatically
2. **Plugins extend functionality** - Add integrations and capabilities
3. **Skills encapsulate workflows** - Reusable, composable automation
4. **Configuration is code** - Version control, review, and share
5. **Monitor and optimize** - Track performance and improve over time

**Next Section:**

We'll explore sub-agents - specialized AI agents that can be delegated specific tasks, enabling true multi-agent workflows.