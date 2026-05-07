# Lab 014: AI Development Platform Setup

## Learning Objectives

- Set up enterprise AI development platform
- Configure team collaboration features
- Implement SSO and security
- Set up monitoring and analytics
- Create developer onboarding flow
- Establish best practices and standards

## Prerequisites

- System administration access
- Understanding of enterprise architecture
- 60 minutes to complete

## Exercise 1: Platform Architecture (15 minutes)

### Design Platform Components

```markdown
# AI Platform Architecture

## Components

### 1. API Gateway
- Handles all Claude API requests
- Rate limiting and quotas
- Request routing
- Authentication/authorization
- Audit logging

### 2. Prompt Management
- Centralized prompt library
- Version control
- A/B testing capabilities
- Analytics on prompt performance

### 3. User Management
- SSO integration
- Role-based access control
- Team organization
- Usage tracking per user/team

### 4. Monitoring & Analytics
- Usage dashboards
- Cost tracking
- Performance metrics
- Quality metrics

### 5. Development Tools
- CLI tools
- IDE integrations
- Testing frameworks
- CI/CD integrations

### 6. Governance
- Policy enforcement
- Compliance monitoring
- Audit trails
- Approval workflows
```

## Exercise 2: Infrastructure Setup (25 minutes)

### API Gateway Configuration

```javascript
// platform/api-gateway.js

import express from 'express';
import rateLimit from 'express-rate-limit';
import { Anthropic } from '@anthropic-ai/sdk';

class AIGateway {
  constructor(config) {
    this.app = express();
    this.anthropic = new Anthropic({ apiKey: config.apiKey });
    this.setupMiddleware();
    this.setupRoutes();
  }
  
  setupMiddleware() {
    // Authentication
    this.app.use(this.authenticateUser.bind(this));
    
    // Rate limiting per user/team
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      keyGenerator: (req) => req.user.id
    });
    this.app.use('/api/', limiter);
    
    // Audit logging
    this.app.use(this.auditLog.bind(this));
    
    // Request validation
    this.app.use(express.json());
    this.app.use(this.validateRequest.bind(this));
  }
  
  setupRoutes() {
    this.app.post('/api/v1/messages', this.handleMessage.bind(this));
    this.app.get('/api/v1/usage', this.getUsage.bind(this));
    this.app.get('/api/v1/analytics', this.getAnalytics.bind(this));
  }
  
  async handleMessage(req, res) {
    try {
      // Check quota
      await this.checkQuota(req.user);
      
      // Get prompt from library if template used
      const prompt = req.body.template 
        ? await this.getPromptTemplate(req.body.template)
        : req.body.messages;
      
      // Call Claude
      const response = await this.anthropic.messages.create({
        model: req.body.model || 'claude-sonnet-4-5',
        max_tokens: req.body.max_tokens || 4096,
        messages: prompt
      });
      
      // Track usage
      await this.trackUsage(req.user, response);
      
      res.json(response);
      
    } catch (error) {
      await this.handleError(error, req, res);
    }
  }
  
  async authenticateUser(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    try {
      const user = await this.verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
  
  async checkQuota(user) {
    const usage = await this.getUserUsage(user.id);
    const quota = await this.getUserQuota(user.id);
    
    if (usage.tokensThisMonth >= quota.monthlyTokens) {
      throw new Error('Monthly token quota exceeded');
    }
  }
  
  async trackUsage(user, response) {
    await this.db.usage.create({
      userId: user.id,
      teamId: user.teamId,
      model: response.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      cost: this.calculateCost(response.usage, response.model),
      timestamp: new Date()
    });
  }
}
```

### SSO Integration

```javascript
// platform/sso.js

import { Strategy as SAMLStrategy } from 'passport-saml';

class SSOIntegration {
  constructor(config) {
    this.strategy = new SAMLStrategy({
      entryPoint: config.idpEntryPoint,
      issuer: config.issuer,
      callbackUrl: config.callbackUrl,
      cert: config.cert
    }, this.verifyUser.bind(this));
  }
  
  async verifyUser(profile, done) {
    try {
      let user = await this.findUserByEmail(profile.email);
      
      if (!user) {
        user = await this.createUser({
          email: profile.email,
          name: profile.displayName,
          department: profile.department,
          role: this.determineRole(profile)
        });
      }
      
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
  
  determineRole(profile) {
    // Map IdP groups to application roles
    const groupMappings = {
      'Engineering': 'developer',
      'Engineering-Senior': 'senior_developer',
      'Engineering-Lead': 'tech_lead',
      'IT-Admins': 'admin'
    };
    
    for (const [group, role] of Object.entries(groupMappings)) {
      if (profile.groups?.includes(group)) {
        return role;
      }
    }
    
    return 'developer'; // Default role
  }
}
```

### Monitoring Dashboard

```javascript
// platform/monitoring.js

class PlatformMonitoring {
  async getDashboard() {
    return {
      overview: await this.getOverview(),
      usage: await this.getUsageMetrics(),
      performance: await this.getPerformanceMetrics(),
      costs: await this.getCostMetrics(),
      quality: await this.getQualityMetrics(),
      alerts: await this.getActiveAlerts()
    };
  }
  
  async getOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      activeUsers: await this.countActiveUsers(startOfMonth),
      totalRequests: await this.countRequests(startOfMonth),
      averageResponseTime: await this.getAverageResponseTime(startOfMonth),
      errorRate: await this.calculateErrorRate(startOfMonth),
      costThisMonth: await this.getTotalCost(startOfMonth)
    };
  }
  
  async getUsageMetrics() {
    return {
      requestsByModel: await this.groupByModel(),
      requestsByTeam: await this.groupByTeam(),
      requestsByUser: await this.getTopUsers(10),
      tokenUsageTrend: await this.getTokenTrend(30), // 30 days
      peakUsageHours: await this.getPeakHours()
    };
  }
  
  async getCostMetrics() {
    return {
      totalCost: await this.getTotalCost(),
      costByTeam: await this.getCostByTeam(),
      costByModel: await this.getCostByModel(),
      costTrend: await this.getCostTrend(30),
      projectedMonthlyCost: await this.projectCost(),
      budgetUtilization: await this.getBudgetUtilization()
    };
  }
  
  async getQualityMetrics() {
    return {
      averagePromptTokens: await this.getAveragePromptSize(),
      averageResponseTokens: await this.getAverageResponseSize(),
      cacheHitRate: await this.getCacheHitRate(),
      errorRate: await this.getErrorRate(),
      retryRate: await this.getRetryRate()
    };
  }
  
  setupAlerts() {
    // Cost alerts
    this.alertOnThreshold('cost', {
      daily: 1000,
      monthly: 25000
    });
    
    // Usage alerts
    this.alertOnThreshold('requests', {
      perMinute: 100,
      perHour: 5000
    });
    
    // Error alerts
    this.alertOnThreshold('errorRate', {
      threshold: 0.05 // 5%
    });
  }
}
```

## Exercise 3: Developer Tools (15 minutes)

### CLI Tool

```javascript
#!/usr/bin/env node
// platform/cli.js

import { Command } from 'commander';

const program = new Command();

program
  .name('ai-platform')
  .description('AI Platform CLI')
  .version('1.0.0');

program
  .command('login')
  .description('Authenticate with the platform')
  .action(async () => {
    const token = await authenticate();
    saveToken(token);
    console.log('Successfully authenticated!');
  });

program
  .command('prompt <action>')
  .description('Manage prompts (list|get|create)')
  .action(async (action, options) => {
    switch (action) {
      case 'list':
        const prompts = await listPrompts();
        console.table(prompts);
        break;
      case 'get':
        const prompt = await getPrompt(options.id);
        console.log(prompt);
        break;
      case 'create':
        await createPrompt(options);
        console.log('Prompt created!');
        break;
    }
  });

program
  .command('usage')
  .description('View your usage statistics')
  .action(async () => {
    const usage = await getUsage();
    console.log(`Tokens used: ${usage.tokens}`);
    console.log(`Cost: $${usage.cost}`);
    console.log(`Quota: ${usage.tokens}/${usage.quota}`);
  });

program.parse();
```

### IDE Extension (VS Code)

```javascript
// platform/vscode-extension/extension.js

import * as vscode from 'vscode';

export function activate(context) {
  // Register commands
  const commands = [
    vscode.commands.registerCommand('aiplatform.reviewCode', reviewCode),
    vscode.commands.registerCommand('aiplatform.generateTests', generateTests),
    vscode.commands.registerCommand('aiplatform.explainCode', explainCode)
  ];
  
  context.subscriptions.push(...commands);
  
  // Add status bar
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBar.text = '$(robot) AI Platform';
  statusBar.command = 'aiplatform.showMenu';
  statusBar.show();
}

async function reviewCode() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  
  const code = editor.document.getText();
  const review = await callPlatform('code-review', { code });
  
  showReviewPanel(review);
}
```

## Exercise 4: Team Onboarding (5 minutes)

### Onboarding Workflow

```markdown
# Developer Onboarding Checklist

## Day 1: Access Setup
- [ ] SSO account created
- [ ] Added to appropriate team
- [ ] Role assigned
- [ ] API key generated
- [ ] CLI tool installed

## Day 2: Training
- [ ] Watch platform overview video
- [ ] Complete prompt engineering tutorial
- [ ] Review usage policies
- [ ] Read best practices guide

## Day 3: First Project
- [ ] Clone starter template
- [ ] Run first Claude API call
- [ ] Submit first code review
- [ ] Generate first test suite

## Week 1: Integration
- [ ] Install IDE extensions
- [ ] Set up local development
- [ ] Join team Slack channel
- [ ] Attend weekly office hours

## Ongoing
- [ ] Review monthly usage reports
- [ ] Participate in prompt library
- [ ] Share learnings with team
```

## Common Issues

### Authentication Failures

```
Solutions:
1. Verify SSO configuration
2. Check token expiration
3. Validate certificate
4. Review firewall rules
```

### Rate Limit Issues

```
Solutions:
1. Implement proper rate limiting
2. Add queue for burst traffic
3. Cache common responses
4. Optimize prompt usage
```

## Summary

You've learned to:
- Design AI platform architecture
- Set up API gateway and authentication
- Implement monitoring and analytics
- Create developer tools
- Establish onboarding process

## Next Steps

1. Deploy platform to staging
2. Pilot with small team
3. Gather feedback and iterate
4. Proceed to Lab 015: Enterprise Integration

---

**Lab Completion**: You can now set up and manage an enterprise AI development platform.
