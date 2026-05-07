# Lab 009: Agent Orchestration

## Learning Objectives

- Design multi-agent workflows
- Coordinate agents for complex tasks
- Implement agent communication patterns
- Handle agent failures and retries
- Optimize agent collaboration

## Prerequisites

- Completion of Labs 007-008
- Understanding of async patterns
- Familiarity with orchestration concepts
- 60 minutes to complete

## Exercise 1: Multi-Agent Design (20 minutes)

### Design Agent Workflow

```
Design a multi-agent system for code review automation:

Agents needed:
1. Analyzer: Performs static analysis
2. Tester: Runs tests and checks coverage
3. Reviewer: Reviews code quality
4. Documenter: Checks/generates documentation
5. Orchestrator: Coordinates all agents

For each agent, specify:
- Inputs and outputs
- Dependencies on other agents
- Failure handling
- Communication method
```

### Agent Communication Patterns

```javascript
// patterns/agent-orchestration.js

// Pattern 1: Sequential Pipeline
class SequentialOrchestrator {
  async execute(task) {
    const result1 = await this.agent1.process(task);
    const result2 = await this.agent2.process(result1);
    const result3 = await this.agent3.process(result2);
    return result3;
  }
}

// Pattern 2: Parallel Execution
class ParallelOrchestrator {
  async execute(task) {
    const [result1, result2, result3] = await Promise.all([
      this.agent1.process(task),
      this.agent2.process(task),
      this.agent3.process(task)
    ]);
    return this.combineResults([result1, result2, result3]);
  }
}

// Pattern 3: Hierarchical Delegation
class HierarchicalOrchestrator {
  async execute(task) {
    const subtasks = await this.planner.decompose(task);
    const results = await Promise.all(
      subtasks.map(st => this.delegateToAgent(st))
    );
    return this.aggregator.combine(results);
  }
}
```

## Exercise 2: Code Review Orchestration (25 minutes)

### Implement Orchestrator

```javascript
// orchestrator/code-review.js
import { StaticAnalyzer } from './agents/analyzer.js';
import { TestRunner } from './agents/tester.js';
import { CodeReviewer } from './agents/reviewer.js';
import { Documenter } from './agents/documenter.js';

export class CodeReviewOrchestrator {
  constructor() {
    this.analyzer = new StaticAnalyzer();
    this.tester = new TestRunner();
    this.reviewer = new CodeReviewer();
    this.documenter = new Documenter();
  }
  
  async orchestrateReview(pullRequest) {
    const results = {
      pr: pullRequest,
      timestamp: new Date(),
      phases: []
    };
    
    try {
      // Phase 1: Quick checks (parallel)
      results.phases.push(await this.runQuickChecks(pullRequest));
      
      // Phase 2: Deep analysis (sequential)
      results.phases.push(await this.runDeepAnalysis(pullRequest, results.phases[0]));
      
      // Phase 3: Generate report
      results.summary = await this.generateSummary(results);
      
      return results;
      
    } catch (error) {
      return this.handleFailure(error, results);
    }
  }
  
  async runQuickChecks(pr) {
    const startTime = Date.now();
    
    // Run in parallel for speed
    const [lintResults, formatResults, basicTests] = await Promise.allSettled([
      this.analyzer.runLinter(pr.files),
      this.analyzer.checkFormatting(pr.files),
      this.tester.runUnitTests()
    ]);
    
    return {
      phase: 'quick-checks',
      duration: Date.now() - startTime,
      results: {
        lint: this.unwrapResult(lintResults),
        format: this.unwrapResult(formatResults),
        tests: this.unwrapResult(basicTests)
      },
      passed: [lintResults, formatResults, basicTests].every(r => r.status === 'fulfilled')
    };
  }
  
  async runDeepAnalysis(pr, quickCheckResults) {
    // Only run if quick checks passed
    if (!quickCheckResults.passed) {
      return {
        phase: 'deep-analysis',
        skipped: true,
        reason: 'Quick checks failed'
      };
    }
    
    const startTime = Date.now();
    
    // Sequential for thorough review
    const securityScan = await this.analyzer.securityScan(pr.files);
    const performanceCheck = await this.analyzer.performanceAnalysis(pr.files);
    const codeReview = await this.reviewer.reviewCode(pr.files);
    const docCheck = await this.documenter.verifyDocumentation(pr.files);
    
    return {
      phase: 'deep-analysis',
      duration: Date.now() - startTime,
      results: {
        security: securityScan,
        performance: performanceCheck,
        review: codeReview,
        documentation: docCheck
      }
    };
  }
  
  async generateSummary(results) {
    const issues = this.collectIssues(results);
    const recommendations = await this.generateRecommendations(issues);
    
    return {
      totalIssues: issues.length,
      issuesBySeverity: this.groupBySeverity(issues),
      recommendations,
      approvalStatus: this.determineApproval(issues),
      nextSteps: this.suggestNextSteps(issues)
    };
  }
  
  collectIssues(results) {
    const issues = [];
    
    for (const phase of results.phases) {
      if (phase.results) {
        Object.entries(phase.results).forEach(([check, result]) => {
          if (result.issues) {
            issues.push(...result.issues.map(i => ({ ...i, check, phase: phase.phase })));
          }
        });
      }
    }
    
    return issues;
  }
  
  determineApproval(issues) {
    const critical = issues.filter(i => i.severity === 'critical').length;
    const high = issues.filter(i => i.severity === 'high').length;
    
    if (critical > 0) return 'REJECTED';
    if (high > 3) return 'CHANGES_REQUESTED';
    return 'APPROVED';
  }
  
  handleFailure(error, partialResults) {
    return {
      success: false,
      error: error.message,
      partialResults,
      recovery: this.suggestRecovery(error)
    };
  }
  
  unwrapResult(promiseResult) {
    return promiseResult.status === 'fulfilled' 
      ? promiseResult.value 
      : { error: promiseResult.reason.message };
  }
}
```

### Agent Implementation Example

```javascript
// agents/analyzer.js
export class StaticAnalyzer {
  async runLinter(files) {
    const issues = [];
    
    for (const file of files) {
      const result = await this.lintFile(file);
      issues.push(...result.issues);
    }
    
    return {
      totalIssues: issues.length,
      issues: issues,
      passed: issues.filter(i => i.severity === 'error').length === 0
    };
  }
  
  async securityScan(files) {
    // Use security scanning tools
    const vulnerabilities = await this.scanForVulnerabilities(files);
    const secrets = await this.detectSecrets(files);
    
    return {
      vulnerabilities,
      secrets,
      severity: this.calculateMaxSeverity([...vulnerabilities, ...secrets])
    };
  }
  
  async performanceAnalysis(files) {
    const hotspots = [];
    
    for (const file of files) {
      const complexity = await this.calculateComplexity(file);
      if (complexity.score > 10) {
        hotspots.push({
          file: file.path,
          complexity: complexity.score,
          recommendation: 'Consider refactoring to reduce complexity'
        });
      }
    }
    
    return { hotspots };
  }
}
```

## Exercise 3: Error Handling and Retry (15 minutes)

### Resilient Agent Communication

```javascript
// utils/resilient-execution.js
export class ResilientExecutor {
  constructor(maxRetries = 3, backoffMs = 1000) {
    this.maxRetries = maxRetries;
    this.backoffMs = backoffMs;
  }
  
  async executeWithRetry(agentFunction, context) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await agentFunction(context);
        
        if (attempt > 0) {
          console.log(`Succeeded on attempt ${attempt + 1}`);
        }
        
        return result;
        
      } catch (error) {
        lastError = error;
        
        if (attempt < this.maxRetries) {
          const delay = this.backoffMs * Math.pow(2, attempt);
          console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(`Failed after ${this.maxRetries + 1} attempts: ${lastError.message}`);
  }
  
  async executeWithCircuitBreaker(agentFunction, context) {
    if (this.circuitOpen) {
      if (Date.now() - this.circuitOpenedAt < this.circuitResetMs) {
        throw new Error('Circuit breaker is open');
      }
      // Try to close circuit
      this.circuitOpen = false;
    }
    
    try {
      const result = await agentFunction(context);
      this.resetCircuit();
      return result;
      
    } catch (error) {
      this.recordFailure();
      
      if (this.failureCount >= this.failureThreshold) {
        this.openCircuit();
      }
      
      throw error;
    }
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

## Common Issues and Troubleshooting

### Agent deadlock or hanging

```
Solutions:
1. Implement timeouts for each agent
2. Use Promise.race with timeout
3. Add circuit breakers
4. Monitor agent health
5. Implement cancellation tokens
```

### Inconsistent results

```
Solutions:
1. Ensure agents are stateless
2. Pass all context explicitly
3. Version agent implementations
4. Add result validation
5. Implement idempotency
```

## Extensions for Advanced Learners

### Extension 1: Dynamic Agent Selection

```javascript
// Select agents based on task characteristics
class DynamicOrchestrator {
  async execute(task) {
    const agents = this.selectAgents(task);
    const workflow = this.planWorkflow(task, agents);
    return await this.executeWorkflow(workflow);
  }
  
  selectAgents(task) {
    // Choose agents based on task type, priority, etc.
    if (task.type === 'urgent') {
      return this.fastAgents;
    }
    return this.thoroughAgents;
  }
}
```

### Extension 2: Agent Learning

```javascript
// Agents learn from previous executions
class LearningAgent {
  async process(task) {
    const strategy = this.selectStrategy(task);
    const result = await this.execute(task, strategy);
    await this.recordOutcome(task, strategy, result);
    return result;
  }
  
  selectStrategy(task) {
    const history = this.getHistory(task);
    return this.chooseBestStrategy(history);
  }
}
```

## Summary

You've learned to:
- Design multi-agent systems
- Coordinate agents effectively
- Handle failures gracefully
- Optimize agent collaboration
- Implement resilient communication

## Next Steps

1. Build agent orchestration for your workflows
2. Monitor and optimize agent performance
3. Implement advanced patterns
4. Proceed to Lab 010: Multi-Repo Workflow

---

**Lab Completion**: You can now orchestrate multiple agents to solve complex tasks collaboratively.
