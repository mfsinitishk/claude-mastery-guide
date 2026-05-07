# Lab 008: Building Custom Tools

## Learning Objectives

- Design custom tools for specific workflows
- Implement tools following best practices
- Handle errors and edge cases robustly
- Create tool documentation and examples
- Test and validate custom tools
- Package tools for team distribution

## Prerequisites

- Completion of Lab 007 (MCP Setup)
- Understanding of your team's workflows
- Programming skills (JavaScript/Python)
- 60 minutes to complete

## Exercise 1: Tool Design (20 minutes)

### Workflow Analysis

Identify repetitive tasks in your workflow:

```
Analyze my development workflow and suggest 5 custom tools:

Daily tasks:
- Deploy to staging/production
- Run database migrations
- Generate API documentation
- Create release notes from git commits
- Check service health across environments

For each tool, specify:
1. Tool name and purpose
2. Input parameters needed
3. Expected output format
4. Error scenarios to handle
5. Dependencies required
```

### Tool Specification

Create detailed spec for deployment tool:

```javascript
// deploy-tool-spec.json
{
  "name": "deploy_service",
  "description": "Deploy service to specified environment with safety checks",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service": {
        "type": "string",
        "description": "Service name",
        "enum": ["api", "worker", "frontend"]
      },
      "environment": {
        "type": "string",
        "description": "Target environment",
        "enum": ["staging", "production"]
      },
      "version": {
        "type": "string",
        "description": "Version tag or commit SHA"
      },
      "skipTests": {
        "type": "boolean",
        "description": "Skip pre-deployment tests (not recommended)",
        "default": false
      }
    },
    "required": ["service", "environment", "version"]
  },
  "safety": {
    "requiresConfirmation": true,
    "productionChecks": [
      "All tests must pass",
      "Staging deployment must be successful",
      "Approval from team lead required"
    ]
  }
}
```

## Exercise 2: Implementation (25 minutes)

### Deploy Tool Implementation

```javascript
// tools/deploy.js
import { execSync } from 'child_process';
import fs from 'fs';

export class DeployTool {
  async execute({ service, environment, version, skipTests = false }) {
    const steps = [];
    
    try {
      // Step 1: Validate inputs
      steps.push('Validating inputs...');
      await this.validateInputs(service, environment, version);
      
      // Step 2: Pre-deployment checks
      if (!skipTests) {
        steps.push('Running tests...');
        await this.runTests(service);
      }
      
      // Step 3: Production safety checks
      if (environment === 'production') {
        steps.push('Performing production safety checks...');
        await this.productionChecks(service, version);
      }
      
      // Step 4: Build and package
      steps.push('Building application...');
      const artifact = await this.build(service, version);
      
      // Step 5: Deploy
      steps.push(`Deploying to ${environment}...`);
      const deploymentUrl = await this.deploy(service, environment, artifact);
      
      // Step 6: Health check
      steps.push('Verifying deployment...');
      await this.healthCheck(deploymentUrl);
      
      // Step 7: Update deployment records
      await this.recordDeployment(service, environment, version);
      
      return {
        success: true,
        message: `Successfully deployed ${service} v${version} to ${environment}`,
        url: deploymentUrl,
        steps: steps
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        completedSteps: steps,
        rollbackRequired: environment === 'production'
      };
    }
  }
  
  async validateInputs(service, environment, version) {
    const validServices = ['api', 'worker', 'frontend'];
    const validEnvs = ['staging', 'production'];
    
    if (!validServices.includes(service)) {
      throw new Error(`Invalid service. Must be one of: ${validServices.join(', ')}`);
    }
    
    if (!validEnvs.includes(environment)) {
      throw new Error(`Invalid environment. Must be one of: ${validEnvs.join(', ')}`);
    }
    
    // Verify version exists
    const tagExists = execSync(`git tag -l ${version}`).toString().trim();
    if (!tagExists && !version.match(/^[0-9a-f]{40}$/)) {
      throw new Error(`Version ${version} not found. Must be a git tag or commit SHA.`);
    }
  }
  
  async runTests(service) {
    try {
      execSync(`npm run test:${service}`, { stdio: 'inherit' });
    } catch (error) {
      throw new Error(`Tests failed for ${service}. Deployment aborted.`);
    }
  }
  
  async productionChecks(service, version) {
    // Check staging deployment exists
    const stagingDeployment = await this.getDeploymentInfo(service, 'staging');
    if (stagingDeployment.version !== version) {
      throw new Error(
        `Version ${version} not deployed to staging. Deploy to staging first.`
      );
    }
    
    // Check staging health
    if (stagingDeployment.status !== 'healthy') {
      throw new Error('Staging deployment is not healthy. Fix staging before production deployment.');
    }
    
    // Verify approval
    const approvals = await this.getApprovals(service, version);
    if (approvals.length === 0) {
      throw new Error('Production deployment requires approval. Run: approve-deployment ' + version);
    }
  }
  
  async build(service, version) {
    const buildCmd = `npm run build:${service} -- --version=${version}`;
    execSync(buildCmd, { stdio: 'inherit' });
    return `${service}-${version}.tar.gz`;
  }
  
  async deploy(service, environment, artifact) {
    // Deployment logic varies by infrastructure
    // This is a simplified example
    const cmd = `kubectl set image deployment/${service} ${service}=${artifact} -n ${environment}`;
    execSync(cmd);
    
    return `https://${environment}-${service}.example.com`;
  }
  
  async healthCheck(url) {
    const maxRetries = 10;
    const retryDelay = 5000;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(`${url}/health`);
        if (response.ok) {
          return true;
        }
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error('Deployment health check failed. Service is not responding.');
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
  
  async recordDeployment(service, environment, version) {
    const record = {
      service,
      environment,
      version,
      timestamp: new Date().toISOString(),
      deployedBy: process.env.USER
    };
    
    const logFile = `.deployments/${service}-${environment}.json`;
    const logs = JSON.parse(fs.readFileSync(logFile, 'utf8') || '[]');
    logs.push(record);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
  }
  
  // Helper methods
  async getDeploymentInfo(service, environment) {
    // Fetch from deployment tracking system
    return { version: '1.2.3', status: 'healthy' };
  }
  
  async getApprovals(service, version) {
    // Check approval system
    return [{ approver: 'tech-lead', timestamp: new Date() }];
  }
}
```

### Integration with MCP Server

```javascript
// mcp-server.js
import { DeployTool } from './tools/deploy.js';

this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  if (name === 'deploy_service') {
    const deployTool = new DeployTool();
    const result = await deployTool.execute(args);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }],
      isError: !result.success
    };
  }
});
```

## Exercise 3: Testing and Validation (15 minutes)

### Unit Tests for Tools

```javascript
// tools/deploy.test.js
import { DeployTool } from './deploy.js';

describe('DeployTool', () => {
  let deployTool;
  
  beforeEach(() => {
    deployTool = new DeployTool();
  });
  
  describe('validateInputs', () => {
    it('should accept valid inputs', async () => {
      await expect(
        deployTool.validateInputs('api', 'staging', 'v1.0.0')
      ).resolves.not.toThrow();
    });
    
    it('should reject invalid service', async () => {
      await expect(
        deployTool.validateInputs('invalid', 'staging', 'v1.0.0')
      ).rejects.toThrow('Invalid service');
    });
    
    it('should reject invalid environment', async () => {
      await expect(
        deployTool.validateInputs('api', 'dev', 'v1.0.0')
      ).rejects.toThrow('Invalid environment');
    });
    
    it('should reject non-existent version', async () => {
      await expect(
        deployTool.validateInputs('api', 'staging', 'v99.99.99')
      ).rejects.toThrow('Version v99.99.99 not found');
    });
  });
  
  describe('productionChecks', () => {
    it('should require staging deployment first', async () => {
      // Mock staging deployment status
      deployTool.getDeploymentInfo = jest.fn().mockResolvedValue({
        version: 'v1.0.0',
        status: 'healthy'
      });
      
      await expect(
        deployTool.productionChecks('api', 'v2.0.0')
      ).rejects.toThrow('not deployed to staging');
    });
    
    it('should require healthy staging', async () => {
      deployTool.getDeploymentInfo = jest.fn().mockResolvedValue({
        version: 'v1.0.0',
        status: 'unhealthy'
      });
      
      await expect(
        deployTool.productionChecks('api', 'v1.0.0')
      ).rejects.toThrow('not healthy');
    });
  });
});
```

### Integration Testing

```javascript
// Test the complete MCP tool flow
describe('Deploy MCP Tool Integration', () => {
  it('should deploy to staging successfully', async () => {
    const request = {
      params: {
        name: 'deploy_service',
        arguments: {
          service: 'api',
          environment: 'staging',
          version: 'v1.0.0',
          skipTests: true // For testing
        }
      }
    };
    
    const result = await mcpServer.handleRequest(request);
    const response = JSON.parse(result.content[0].text);
    
    expect(response.success).toBe(true);
    expect(response.url).toContain('staging');
  });
});
```

## Common Issues and Troubleshooting

### Tool doesn't appear in Claude

```
Debug checklist:
1. Verify tool is listed in ListToolsRequestSchema handler
2. Check inputSchema is valid JSON Schema
3. Restart Claude Desktop
4. Check MCP server logs
5. Test tool standalone (outside MCP)
```

### Errors not handled gracefully

```
Implement comprehensive error handling:

1. Validate all inputs
2. Use try-catch blocks
3. Return structured error responses
4. Log errors with context
5. Provide actionable error messages
```

## Extensions for Advanced Learners

### Extension 1: Tool Composition

Create meta-tools that combine multiple tools:
- Full release workflow (test → build → deploy → notify)
- Data pipeline (extract → transform → load)
- Incident response (detect → diagnose → remediate)

### Extension 2: Interactive Tools

Build tools with multi-step interactions:
- Request confirmation at critical steps
- Provide progress updates
- Allow cancellation mid-execution
- Support dry-run mode

### Extension 3: Tool Analytics

Track tool usage:
- Execution frequency
- Success/failure rates
- Performance metrics
- User feedback

## Summary

You've learned to:
- Design tools for specific workflows
- Implement robust tool logic
- Handle errors comprehensively
- Test tools thoroughly
- Integrate tools with MCP servers

## Next Steps

1. Build tools for your team's workflows
2. Share tools across team
3. Collect feedback and iterate
4. Proceed to Lab 009: Agent Orchestration

---

**Lab Completion**: You can now create custom tools that extend Claude's capabilities for your specific needs.
