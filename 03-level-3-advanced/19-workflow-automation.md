# Workflow Automation

## Overview

Automate complex development workflows using Claude to orchestrate multi-step processes, integrate tools, and maintain consistency across teams.

## Understanding Workflow Automation

### Key Components

```
Workflow System
├── Triggers         # Events that start workflows
├── Steps            # Individual actions
├── Conditions       # Decision points
├── Tools            # External integrations
└── Artifacts        # Generated outputs
```

### Workflow Types

1. **Linear Workflows**: Sequential steps
2. **Conditional Workflows**: Branch based on conditions
3. **Parallel Workflows**: Concurrent execution
4. **Iterative Workflows**: Loops and retries
5. **Event-Driven Workflows**: Triggered by external events

## Basic Workflow Patterns

### Linear Workflow

```yaml
# .claude/workflows/deploy.yml
name: Deploy Application
description: Deploy application through environments

trigger:
  manual: true
  schedule: "0 2 * * *"  # Daily at 2 AM

steps:
  - name: Validate Configuration
    action: validate-config
    params:
      config: deployment-config.yml
    
  - name: Run Tests
    action: run-tests
    params:
      suite: integration
      coverage: true
    
  - name: Build Artifacts
    action: build
    params:
      platforms:
        - linux-amd64
        - darwin-arm64
    
  - name: Deploy to Staging
    action: deploy
    params:
      environment: staging
      healthcheck: true
      timeout: 600
    
  - name: Run Smoke Tests
    action: smoke-test
    params:
      environment: staging
      tests: smoke-tests/
    
  - name: Deploy to Production
    action: deploy
    params:
      environment: production
      strategy: blue-green
      approval: required
      approvers:
        - devops-team
        - engineering-lead
    
  - name: Verify Deployment
    action: verify
    params:
      environment: production
      duration: 300
      rollback-on-failure: true

on_failure:
  notify:
    - slack: "#deployments"
    - pagerduty: critical
  rollback: true

on_success:
  notify:
    - slack: "#deployments"
  tag-release: true
```

### Conditional Workflow

```yaml
# .claude/workflows/code-review.yml
name: Automated Code Review
description: Review code changes with conditional checks

trigger:
  github:
    event: pull_request
    action: [opened, synchronize]

steps:
  - name: Fetch PR Details
    action: github.get-pr
    output: pr_data
    
  - name: Determine Review Scope
    action: evaluate
    script: |
      const { files, additions, deletions } = context.pr_data;
      
      return {
        is_large: additions + deletions > 500,
        has_migrations: files.some(f => f.includes('migration')),
        has_security: files.some(f => f.includes('auth') || f.includes('security')),
        has_tests: files.some(f => f.includes('.test.') || f.includes('.spec.'))
      };
    output: scope
    
  - name: Static Analysis
    action: run-linters
    parallel:
      - name: ESLint
        tool: eslint
        config: .eslintrc.json
      - name: TypeScript
        tool: tsc
        config: tsconfig.json
      - name: Prettier
        tool: prettier
        check: true
    
  - name: Security Scan
    action: security-scan
    when: scope.has_security
    params:
      tools:
        - semgrep
        - snyk
      fail-on: high
    
  - name: Large PR Analysis
    action: analyze-complexity
    when: scope.is_large
    params:
      metrics:
        - cyclomatic-complexity
        - cognitive-complexity
        - maintainability-index
      thresholds:
        cyclomatic: 10
        cognitive: 15
    
  - name: Database Migration Review
    action: review-migrations
    when: scope.has_migrations
    params:
      checks:
        - reversibility
        - data-safety
        - performance-impact
        - index-coverage
    
  - name: Test Coverage Analysis
    action: coverage-check
    params:
      threshold: 80
      diff-coverage: 90
      report-path: coverage/
    
  - name: AI Code Review
    action: claude.review-code
    params:
      context: |
        Project: ${PROJECT_NAME}
        Type: ${scope}
        Standards: .github/CODING_STANDARDS.md
      focus:
        - code-quality
        - security
        - performance
        - maintainability
    output: review_results
    
  - name: Post Review
    action: github.create-review
    params:
      pr: ${pr_data.number}
      review: ${review_results}
      approve-if: ${review_results.severity} == 'none'
      request-changes-if: ${review_results.severity} == 'high'
```

### Parallel Workflow

```yaml
# .claude/workflows/multi-env-deploy.yml
name: Multi-Environment Deployment
description: Deploy to multiple environments in parallel

trigger:
  manual: true
  inputs:
    version:
      description: Version to deploy
      required: true
    environments:
      description: Environments to deploy
      type: choice
      options:
        - dev
        - staging
        - production
      multiple: true

steps:
  - name: Build Once
    action: build
    params:
      version: ${inputs.version}
      cache: true
    output: artifacts
    
  - name: Deploy to Environments
    action: parallel
    jobs:
      - name: Deploy Dev
        when: "'dev' in inputs.environments"
        steps:
          - action: deploy
            params:
              environment: dev
              artifacts: ${artifacts}
          - action: smoke-test
            params:
              environment: dev
      
      - name: Deploy Staging
        when: "'staging' in inputs.environments"
        steps:
          - action: deploy
            params:
              environment: staging
              artifacts: ${artifacts}
          - action: smoke-test
            params:
              environment: staging
          - action: integration-test
            params:
              environment: staging
      
      - name: Deploy Production
        when: "'production' in inputs.environments"
        steps:
          - action: request-approval
            params:
              approvers: [ops-team, engineering-lead]
              timeout: 3600
          - action: deploy
            params:
              environment: production
              artifacts: ${artifacts}
              strategy: canary
              canary-percentage: 10
          - action: monitor
            params:
              environment: production
              duration: 600
              metrics:
                - error-rate
                - response-time
                - throughput
          - action: promote-canary
            when: monitor.healthy
            params:
              environment: production
              percentage: 100
    
  - name: Verify All Deployments
    action: verify-deployments
    params:
      environments: ${inputs.environments}
      artifacts: ${artifacts}
```

## Advanced Automation Patterns

### Event-Driven Workflow

```javascript
// .claude/workflows/handlers/event-driven.js
const { WorkflowEngine } = require('@claude/workflow');

class EventDrivenWorkflow {
  constructor() {
    this.engine = new WorkflowEngine();
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    // GitHub events
    this.engine.on('github.push', async (event) => {
      if (event.branch === 'main') {
        await this.handleMainBranchPush(event);
      } else if (event.branch.startsWith('release/')) {
        await this.handleReleaseBranchPush(event);
      }
    });
    
    this.engine.on('github.pull_request.opened', async (event) => {
      await this.handleNewPullRequest(event);
    });
    
    this.engine.on('github.pull_request.labeled', async (event) => {
      if (event.label === 'ready-for-review') {
        await this.handleReadyForReview(event);
      }
    });
    
    // Monitoring events
    this.engine.on('monitoring.alert.critical', async (event) => {
      await this.handleCriticalAlert(event);
    });
    
    this.engine.on('monitoring.threshold.breached', async (event) => {
      await this.handleThresholdBreach(event);
    });
    
    // Build events
    this.engine.on('build.completed', async (event) => {
      if (event.status === 'success') {
        await this.handleSuccessfulBuild(event);
      } else {
        await this.handleFailedBuild(event);
      }
    });
  }
  
  async handleMainBranchPush(event) {
    const workflow = this.engine.createWorkflow('main-branch-deployment');
    
    // Determine what changed
    const changes = await this.analyzeChanges(event.commits);
    
    // Run appropriate tests
    if (changes.hasBackendChanges) {
      await workflow.step('run-backend-tests', async () => {
        return await this.runTests('backend');
      });
    }
    
    if (changes.hasFrontendChanges) {
      await workflow.step('run-frontend-tests', async () => {
        return await this.runTests('frontend');
      });
    }
    
    if (changes.hasInfraChanges) {
      await workflow.step('validate-infrastructure', async () => {
        return await this.validateInfrastructure();
      });
    }
    
    // Deploy to dev environment
    await workflow.step('deploy-dev', async () => {
      return await this.deploy('dev', event.commit);
    });
    
    // Auto-promote to staging if all tests pass
    if (workflow.allStepsSuccessful()) {
      await workflow.step('deploy-staging', async () => {
        return await this.deploy('staging', event.commit);
      });
    }
    
    return workflow.getResults();
  }
  
  async handleNewPullRequest(event) {
    const workflow = this.engine.createWorkflow('pr-automation');
    
    // Assign reviewers based on file changes
    await workflow.step('assign-reviewers', async () => {
      const reviewers = await this.determineReviewers(event.files);
      await this.assignReviewers(event.pr, reviewers);
      return { reviewers };
    });
    
    // Label PR based on changes
    await workflow.step('auto-label', async () => {
      const labels = await this.determineLabels(event.files);
      await this.addLabels(event.pr, labels);
      return { labels };
    });
    
    // Check for breaking changes
    await workflow.step('check-breaking-changes', async () => {
      const breaking = await this.detectBreakingChanges(event.pr);
      
      if (breaking.length > 0) {
        await this.addComment(event.pr, {
          title: 'Potential Breaking Changes Detected',
          body: this.formatBreakingChanges(breaking)
        });
        await this.addLabel(event.pr, 'breaking-change');
      }
      
      return { breaking };
    });
    
    // Estimate review time
    await workflow.step('estimate-review-time', async () => {
      const estimate = await this.estimateReviewTime(event.files);
      
      await this.addComment(event.pr, {
        title: 'Review Estimate',
        body: `Estimated review time: ${estimate.minutes} minutes`
      });
      
      return { estimate };
    });
    
    return workflow.getResults();
  }
  
  async handleCriticalAlert(event) {
    const workflow = this.engine.createWorkflow('incident-response');
    
    // Create incident
    await workflow.step('create-incident', async () => {
      const incident = await this.createIncident({
        severity: 'critical',
        alert: event,
        service: event.service
      });
      
      return { incident };
    });
    
    // Gather diagnostics
    await workflow.step('gather-diagnostics', async (ctx) => {
      const diagnostics = await Promise.all([
        this.fetchLogs(event.service, { lookback: '15m' }),
        this.fetchMetrics(event.service, { lookback: '1h' }),
        this.fetchTraces(event.traceId),
        this.checkDependencies(event.service)
      ]);
      
      return { diagnostics };
    });
    
    // Analyze with AI
    await workflow.step('ai-analysis', async (ctx) => {
      const analysis = await this.analyzeIncident({
        incident: ctx.incident,
        diagnostics: ctx.diagnostics
      });
      
      return { analysis };
    });
    
    // Auto-mitigate if possible
    await workflow.step('auto-mitigate', async (ctx) => {
      if (ctx.analysis.confidence > 0.95) {
        const mitigation = await this.executeMitigation(
          ctx.analysis.recommendation
        );
        
        return { mitigation };
      }
      
      return { mitigation: 'manual-required' };
    });
    
    // Notify team
    await workflow.step('notify', async (ctx) => {
      await this.notify({
        channels: ['#incidents', '#engineering'],
        incident: ctx.incident,
        analysis: ctx.analysis,
        mitigation: ctx.mitigation
      });
    });
    
    return workflow.getResults();
  }
  
  async analyzeChanges(commits) {
    const files = commits.flatMap(c => c.files);
    
    return {
      hasBackendChanges: files.some(f => f.startsWith('backend/')),
      hasFrontendChanges: files.some(f => f.startsWith('frontend/')),
      hasInfraChanges: files.some(f => 
        f.includes('terraform/') || 
        f.includes('kubernetes/') ||
        f.includes('docker')
      ),
      hasDBChanges: files.some(f => f.includes('migration')),
      hasConfigChanges: files.some(f => 
        f.endsWith('.yml') || 
        f.endsWith('.yaml') || 
        f.endsWith('.json')
      )
    };
  }
  
  async determineReviewers(files) {
    const codeowners = await this.loadCodeowners();
    const reviewers = new Set();
    
    for (const file of files) {
      const owners = codeowners.getOwners(file);
      owners.forEach(owner => reviewers.add(owner));
    }
    
    // Ensure at least 2 reviewers
    if (reviewers.size < 2) {
      const defaultReviewers = await this.getDefaultReviewers();
      defaultReviewers.slice(0, 2 - reviewers.size).forEach(r => 
        reviewers.add(r)
      );
    }
    
    return Array.from(reviewers);
  }
  
  async determineLabels(files) {
    const labels = [];
    
    if (files.some(f => f.startsWith('backend/'))) {
      labels.push('backend');
    }
    if (files.some(f => f.startsWith('frontend/'))) {
      labels.push('frontend');
    }
    if (files.some(f => f.includes('test'))) {
      labels.push('tests');
    }
    if (files.some(f => f.includes('docs/'))) {
      labels.push('documentation');
    }
    if (files.some(f => f.includes('migration'))) {
      labels.push('database');
    }
    
    // Size labels
    const totalChanges = files.reduce((sum, f) => 
      sum + f.additions + f.deletions, 0
    );
    
    if (totalChanges < 50) {
      labels.push('size/small');
    } else if (totalChanges < 200) {
      labels.push('size/medium');
    } else {
      labels.push('size/large');
    }
    
    return labels;
  }
}

module.exports = { EventDrivenWorkflow };
```

### Iterative Workflow with Retries

```javascript
// .claude/workflows/handlers/iterative.js
class IterativeWorkflow {
  async deployWithRetries(environment, config) {
    const maxRetries = 3;
    const backoff = [5000, 15000, 30000]; // Exponential backoff
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Deploy
        const deployment = await this.deploy(environment, config);
        
        // Verify health
        const health = await this.waitForHealthy(deployment, {
          timeout: 300000,
          interval: 5000
        });
        
        if (health.healthy) {
          return {
            success: true,
            deployment,
            attempts: attempt + 1
          };
        }
        
        // Unhealthy, rollback and retry
        await this.rollback(deployment);
        
        if (attempt < maxRetries - 1) {
          console.log(`Attempt ${attempt + 1} failed, retrying in ${backoff[attempt]}ms`);
          await sleep(backoff[attempt]);
        }
        
      } catch (error) {
        console.error(`Deployment attempt ${attempt + 1} failed:`, error);
        
        if (attempt === maxRetries - 1) {
          throw new Error(`Deployment failed after ${maxRetries} attempts: ${error.message}`);
        }
        
        await sleep(backoff[attempt]);
      }
    }
    
    throw new Error(`Deployment failed after ${maxRetries} attempts`);
  }
  
  async waitForHealthy(deployment, options = {}) {
    const { timeout = 300000, interval = 5000 } = options;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const health = await this.checkHealth(deployment);
      
      if (health.healthy) {
        return health;
      }
      
      await sleep(interval);
    }
    
    return { healthy: false, reason: 'timeout' };
  }
  
  async processInBatches(items, batchSize, processor) {
    const results = [];
    const failed = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
      
      const batchResults = await Promise.allSettled(
        batch.map(item => processor(item))
      );
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          failed.push({
            item: batch[index],
            error: result.reason
          });
        }
      });
      
      // Small delay between batches
      if (i + batchSize < items.length) {
        await sleep(1000);
      }
    }
    
    return { results, failed };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { IterativeWorkflow };
```

## CI/CD Integration

### GitHub Actions Integration

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pull-requests: write
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Claude
        uses: anthropic/setup-claude@v1
        with:
          api-key: ${{ secrets.ANTHROPIC_API_KEY }}
      
      - name: Run Claude Review
        id: review
        run: |
          claude workflow run code-review \
            --pr ${{ github.event.pull_request.number }} \
            --output review-results.json
      
      - name: Post Review Results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('review-results.json', 'utf8'));
            
            const body = `## AI Code Review
            
            **Overall Assessment:** ${results.assessment}
            
            ### Issues Found
            ${results.issues.map(i => `- **${i.severity}**: ${i.message} (${i.file}:${i.line})`).join('\n')}
            
            ### Recommendations
            ${results.recommendations.map(r => `- ${r}`).join('\n')}
            
            ### Test Coverage
            - Overall: ${results.coverage.overall}%
            - Diff Coverage: ${results.coverage.diff}%
            `;
            
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body
            });
      
      - name: Check Quality Gate
        run: |
          SEVERITY=$(jq -r '.highestSeverity' review-results.json)
          
          if [ "$SEVERITY" = "critical" ] || [ "$SEVERITY" = "high" ]; then
            echo "Quality gate failed: $SEVERITY severity issues found"
            exit 1
          fi
```

### GitLab CI Integration

```yaml
# .gitlab-ci.yml
stages:
  - analyze
  - build
  - test
  - deploy

variables:
  CLAUDE_VERSION: "latest"

claude:analyze:
  stage: analyze
  image: anthropic/claude:${CLAUDE_VERSION}
  script:
    - claude workflow run code-analysis
        --output analysis-results.json
        --format gitlab-codequality
  artifacts:
    reports:
      codequality: analysis-results.json
    paths:
      - analysis-results.json
    expire_in: 1 week

claude:security-scan:
  stage: analyze
  image: anthropic/claude:${CLAUDE_VERSION}
  script:
    - claude workflow run security-scan
        --output security-results.json
        --format gitlab-sast
  artifacts:
    reports:
      sast: security-results.json
    expire_in: 1 week

claude:deploy-staging:
  stage: deploy
  image: anthropic/claude:${CLAUDE_VERSION}
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - main
  script:
    - claude workflow run deploy
        --environment staging
        --auto-approve
  when: manual

claude:deploy-production:
  stage: deploy
  image: anthropic/claude:${CLAUDE_VERSION}
  environment:
    name: production
    url: https://example.com
  only:
    - main
  script:
    - claude workflow run deploy
        --environment production
        --require-approval
        --approvers "ops-team,engineering-lead"
  when: manual
```

## Monitoring and Observability

### Workflow Telemetry

```javascript
// .claude/workflows/lib/telemetry.js
const { metrics, traces } = require('@opentelemetry/api');

class WorkflowTelemetry {
  constructor(workflow) {
    this.workflow = workflow;
    this.meter = metrics.getMeter('claude-workflow');
    this.tracer = traces.getTracer('claude-workflow');
    
    this.setupMetrics();
  }
  
  setupMetrics() {
    this.counters = {
      started: this.meter.createCounter('workflow.started'),
      completed: this.meter.createCounter('workflow.completed'),
      failed: this.meter.createCounter('workflow.failed'),
      stepExecuted: this.meter.createCounter('workflow.step.executed')
    };
    
    this.histograms = {
      duration: this.meter.createHistogram('workflow.duration'),
      stepDuration: this.meter.createHistogram('workflow.step.duration')
    };
  }
  
  recordWorkflowStart(workflow) {
    this.counters.started.add(1, {
      workflow: workflow.name,
      trigger: workflow.trigger
    });
    
    this.startTime = Date.now();
  }
  
  recordWorkflowComplete(workflow, result) {
    const duration = Date.now() - this.startTime;
    
    this.counters.completed.add(1, {
      workflow: workflow.name,
      status: result.status
    });
    
    this.histograms.duration.record(duration, {
      workflow: workflow.name
    });
  }
  
  recordWorkflowFailure(workflow, error) {
    const duration = Date.now() - this.startTime;
    
    this.counters.failed.add(1, {
      workflow: workflow.name,
      error: error.constructor.name
    });
    
    this.histograms.duration.record(duration, {
      workflow: workflow.name,
      failed: true
    });
  }
  
  recordStepExecution(step, duration, status) {
    this.counters.stepExecuted.add(1, {
      workflow: this.workflow.name,
      step: step.name,
      status
    });
    
    this.histograms.stepDuration.record(duration, {
      workflow: this.workflow.name,
      step: step.name
    });
  }
  
  createTrace(workflow) {
    return this.tracer.startSpan('workflow.execute', {
      attributes: {
        'workflow.name': workflow.name,
        'workflow.trigger': workflow.trigger
      }
    });
  }
  
  createStepSpan(parentSpan, step) {
    return this.tracer.startSpan('workflow.step', {
      attributes: {
        'step.name': step.name,
        'step.action': step.action
      },
      parent: parentSpan
    });
  }
}

module.exports = { WorkflowTelemetry };
```

### Dashboard Configuration

```yaml
# monitoring/grafana/dashboards/workflows.json
{
  "dashboard": {
    "title": "Claude Workflows",
    "panels": [
      {
        "title": "Workflow Execution Rate",
        "targets": [
          {
            "expr": "rate(workflow_started_total[5m])",
            "legendFormat": "{{ workflow }}"
          }
        ]
      },
      {
        "title": "Workflow Success Rate",
        "targets": [
          {
            "expr": "rate(workflow_completed_total{status=\"success\"}[5m]) / rate(workflow_started_total[5m])",
            "legendFormat": "{{ workflow }}"
          }
        ]
      },
      {
        "title": "Workflow Duration (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, workflow_duration_bucket)",
            "legendFormat": "{{ workflow }}"
          }
        ]
      },
      {
        "title": "Step Failures",
        "targets": [
          {
            "expr": "rate(workflow_step_executed_total{status=\"failed\"}[5m])",
            "legendFormat": "{{ workflow }}/{{ step }}"
          }
        ]
      }
    ]
  }
}
```

## Best Practices

### Error Handling

```javascript
class RobustWorkflow {
  async executeWithRecovery(workflow) {
    const checkpoint = new WorkflowCheckpoint(workflow);
    
    try {
      for (const step of workflow.steps) {
        // Save checkpoint before each step
        await checkpoint.save();
        
        try {
          const result = await this.executeStep(step);
          checkpoint.recordSuccess(step, result);
        } catch (error) {
          // Step-level error handling
          if (step.retryable && step.retries < step.maxRetries) {
            await this.retryStep(step);
          } else if (step.optional) {
            checkpoint.recordSkipped(step, error);
            continue;
          } else {
            throw error;
          }
        }
      }
      
      return checkpoint.getResults();
      
    } catch (error) {
      // Workflow-level error handling
      if (workflow.rollbackOnFailure) {
        await this.rollback(checkpoint);
      }
      
      await this.notifyFailure(workflow, error);
      
      throw error;
    } finally {
      await checkpoint.cleanup();
    }
  }
  
  async rollback(checkpoint) {
    const completedSteps = checkpoint.getCompletedSteps().reverse();
    
    for (const step of completedSteps) {
      if (step.rollback) {
        try {
          await step.rollback(checkpoint.getStepResult(step));
        } catch (error) {
          console.error(`Rollback failed for step ${step.name}:`, error);
        }
      }
    }
  }
}
```

### Performance Optimization

```javascript
// Parallel execution with concurrency limits
async function executeStepsWithLimit(steps, concurrencyLimit = 5) {
  const results = [];
  const queue = [...steps];
  const active = new Set();
  
  while (queue.length > 0 || active.size > 0) {
    // Start new tasks up to the limit
    while (queue.length > 0 && active.size < concurrencyLimit) {
      const step = queue.shift();
      const promise = executeStep(step)
        .then(result => {
          active.delete(promise);
          results.push({ step, result, status: 'fulfilled' });
        })
        .catch(error => {
          active.delete(promise);
          results.push({ step, error, status: 'rejected' });
        });
      
      active.add(promise);
    }
    
    // Wait for at least one task to complete
    if (active.size > 0) {
      await Promise.race(active);
    }
  }
  
  return results;
}
```

## Real-World Examples

### Complete Release Workflow

```yaml
# .claude/workflows/release.yml
name: Release Management
description: Automate the entire release process

trigger:
  github:
    tag: 'v*'

inputs:
  release_notes:
    description: Path to release notes
    default: CHANGELOG.md

steps:
  - name: Parse Version
    action: parse-semver
    params:
      tag: ${github.tag}
    output: version
    
  - name: Run Full Test Suite
    action: parallel
    jobs:
      - name: Unit Tests
        action: test
        params:
          suite: unit
      - name: Integration Tests
        action: test
        params:
          suite: integration
      - name: E2E Tests
        action: test
        params:
          suite: e2e
      - name: Security Scan
        action: security-scan
      - name: License Check
        action: license-check
    
  - name: Build Release Artifacts
    action: build
    params:
      version: ${version}
      platforms:
        - linux-amd64
        - linux-arm64
        - darwin-amd64
        - darwin-arm64
        - windows-amd64
      outputs:
        - binary
        - docker-image
        - helm-chart
    output: artifacts
    
  - name: Sign Artifacts
    action: sign
    params:
      artifacts: ${artifacts}
      key: ${secrets.SIGNING_KEY}
      algorithm: RSA-4096
    
  - name: Generate SBOM
    action: sbom-generate
    params:
      artifacts: ${artifacts}
      format: cyclonedx
    output: sbom
    
  - name: Publish to Registries
    action: parallel
    jobs:
      - name: Docker Hub
        action: publish-docker
        params:
          image: ${artifacts.docker_image}
          registry: docker.io
      - name: GitHub Container Registry
        action: publish-docker
        params:
          image: ${artifacts.docker_image}
          registry: ghcr.io
      - name: Helm Repository
        action: publish-helm
        params:
          chart: ${artifacts.helm_chart}
    
  - name: Create GitHub Release
    action: github-release
    params:
      tag: ${github.tag}
      name: Release ${version}
      notes: ${inputs.release_notes}
      artifacts: ${artifacts}
      sbom: ${sbom}
    
  - name: Update Documentation
    action: deploy-docs
    params:
      version: ${version}
      artifacts: ${artifacts}
    
  - name: Notify Stakeholders
    action: notify
    params:
      channels:
        - email: engineering@example.com
        - slack: "#releases"
        - twitter: "@example_app"
      template: release-announcement
      variables:
        version: ${version}
        highlights: ${parse_release_notes(inputs.release_notes)}
```

## Summary

Workflow automation enables:
- Consistent execution of complex processes
- Reduced manual errors
- Faster development cycles
- Better auditability
- Scalable operations

Next: [Task Decomposition](20-task-decomposition.md) for breaking down complex problems systematically.
