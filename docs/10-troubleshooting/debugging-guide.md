# Systematic Debugging Approach

## Overview

Systematic debugging is essential for efficiently resolving complex issues with Claude Code. This guide provides structured methodologies, debugging tools, and best practices for troubleshooting any problem.

## Debugging Methodology

### The Systematic Debugging Process

**Step 1: Define the Problem**

Clearly articulate what is wrong:

```javascript
class ProblemDefinition {
  constructor() {
    this.problem = {
      description: '',
      expectedBehavior: '',
      actualBehavior: '',
      whenItOccurs: '',
      frequency: '',
      impact: '',
      environment: {}
    };
  }

  define(details) {
    Object.assign(this.problem, details);
    return this;
  }

  validate() {
    const required = ['description', 'expectedBehavior', 'actualBehavior'];
    const missing = required.filter(field => !this.problem[field]);

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  }

  toString() {
    return `
Problem: ${this.problem.description}

Expected Behavior:
${this.problem.expectedBehavior}

Actual Behavior:
${this.problem.actualBehavior}

Occurs: ${this.problem.whenItOccurs || 'Unknown'}
Frequency: ${this.problem.frequency || 'Unknown'}
Impact: ${this.problem.impact || 'Unknown'}

Environment:
${JSON.stringify(this.problem.environment, null, 2)}
    `.trim();
  }
}

// Usage
const problem = new ProblemDefinition();
problem.define({
  description: 'Claude responses are slow and sometimes timeout',
  expectedBehavior: 'Responses should arrive within 5 seconds',
  actualBehavior: 'Responses take 30+ seconds or timeout',
  whenItOccurs: 'When processing large files (>10KB)',
  frequency: 'Every time with large files',
  impact: 'Blocks development workflow',
  environment: {
    model: 'claude-sonnet-4-5',
    platform: 'macOS',
    nodeVersion: '18.16.0',
    claudeVersion: '1.2.3'
  }
});

console.log(problem.toString());
```

**Step 2: Gather Information**

```javascript
class InformationGatherer {
  constructor() {
    this.data = {
      logs: [],
      environment: {},
      configuration: {},
      metrics: {},
      traces: []
    };
  }

  async gather() {
    await Promise.all([
      this.collectLogs(),
      this.collectEnvironment(),
      this.collectConfiguration(),
      this.collectMetrics()
    ]);

    return this.data;
  }

  async collectLogs() {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const logDir = path.join(process.env.HOME, '.claude/logs');
      const files = await fs.readdir(logDir);
      
      // Get most recent logs
      const recentLogs = files
        .filter(f => f.endsWith('.log'))
        .sort()
        .reverse()
        .slice(0, 3);

      for (const file of recentLogs) {
        const content = await fs.readFile(
          path.join(logDir, file),
          'utf-8'
        );
        
        this.data.logs.push({
          file,
          content: content.split('\n').slice(-100).join('\n'), // Last 100 lines
          size: content.length
        });
      }
    } catch (error) {
      this.data.logs.push({
        error: `Failed to collect logs: ${error.message}`
      });
    }
  }

  async collectEnvironment() {
    this.data.environment = {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cwd: process.cwd(),
      user: process.env.USER,
      shell: process.env.SHELL,
      path: process.env.PATH,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  async collectConfiguration() {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const configPath = path.join(process.env.HOME, '.claude/config.json');
      const content = await fs.readFile(configPath, 'utf-8');
      
      this.data.configuration = JSON.parse(content);
      
      // Redact sensitive information
      if (this.data.configuration.apiKey) {
        this.data.configuration.apiKey = '***REDACTED***';
      }
    } catch (error) {
      this.data.configuration = {
        error: `Failed to load configuration: ${error.message}`
      };
    }
  }

  async collectMetrics() {
    this.data.metrics = {
      timestamp: Date.now(),
      cpu: process.cpuUsage(),
      memory: process.memoryUsage(),
      resourceUsage: process.resourceUsage ? process.resourceUsage() : null
    };
  }

  export(filepath) {
    const fs = require('fs');
    fs.writeFileSync(
      filepath,
      JSON.stringify(this.data, null, 2)
    );
  }
}

// Usage
const gatherer = new InformationGatherer();
const info = await gatherer.gather();
gatherer.export('./debug-info.json');
```

**Step 3: Reproduce the Problem**

```javascript
class ReproductionTest {
  constructor(problem) {
    this.problem = problem;
    this.attempts = [];
  }

  async attempt() {
    const start = Date.now();
    
    try {
      // Execute the problematic operation
      const result = await this.executeOperation();
      
      const attempt = {
        timestamp: start,
        duration: Date.now() - start,
        success: true,
        result
      };

      this.attempts.push(attempt);
      return attempt;

    } catch (error) {
      const attempt = {
        timestamp: start,
        duration: Date.now() - start,
        success: false,
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code
        }
      };

      this.attempts.push(attempt);
      return attempt;
    }
  }

  async executeOperation() {
    // Override this method with actual operation
    throw new Error('executeOperation must be implemented');
  }

  async testReproducibility(iterations = 5) {
    console.log(`Testing reproducibility with ${iterations} iterations...`);

    for (let i = 0; i < iterations; i++) {
      console.log(`\nAttempt ${i + 1}/${iterations}:`);
      const result = await this.attempt();
      
      console.log(`  Success: ${result.success}`);
      console.log(`  Duration: ${result.duration}ms`);
      
      if (!result.success) {
        console.log(`  Error: ${result.error.message}`);
      }

      // Delay between attempts
      if (i < iterations - 1) {
        await this.delay(1000);
      }
    }

    return this.analyzeReproducibility();
  }

  analyzeReproducibility() {
    const successful = this.attempts.filter(a => a.success).length;
    const failed = this.attempts.filter(a => !a.success).length;
    const totalTime = this.attempts.reduce((sum, a) => sum + a.duration, 0);
    const avgTime = totalTime / this.attempts.length;

    return {
      total: this.attempts.length,
      successful,
      failed,
      successRate: successful / this.attempts.length,
      avgDuration: avgTime,
      reproducible: failed > 0 && (failed / this.attempts.length) > 0.8,
      details: this.attempts
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
class SlowResponseTest extends ReproductionTest {
  async executeOperation() {
    // Simulate the problematic operation
    const response = await callClaude('Analyze this large file: ' + largeContent);
    return response;
  }
}

const test = new SlowResponseTest();
const analysis = await test.testReproducibility(5);

console.log('\nReproducibility Analysis:');
console.log(`Success Rate: ${(analysis.successRate * 100).toFixed(1)}%`);
console.log(`Average Duration: ${analysis.avgDuration.toFixed(0)}ms`);
console.log(`Reproducible: ${analysis.reproducible ? 'YES' : 'NO'}`);
```

**Step 4: Isolate the Cause**

```javascript
class CauseIsolator {
  constructor() {
    this.variables = [];
    this.tests = [];
  }

  addVariable(name, values) {
    this.variables.push({ name, values });
  }

  async testVariable(variable) {
    console.log(`\nTesting variable: ${variable.name}`);
    const results = [];

    for (const value of variable.values) {
      console.log(`  Testing ${variable.name}=${value}...`);
      
      const result = await this.runTestWithValue(variable.name, value);
      results.push({
        value,
        ...result
      });
    }

    return {
      variable: variable.name,
      results,
      conclusion: this.analyzeResults(results)
    };
  }

  async runTestWithValue(variableName, value) {
    // Override this with actual test implementation
    const start = Date.now();
    
    try {
      // Simulate test
      await this.executeWithVariable(variableName, value);
      
      return {
        success: true,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        success: false,
        duration: Date.now() - start,
        error: error.message
      };
    }
  }

  async executeWithVariable(name, value) {
    // Override with actual implementation
    throw new Error('executeWithVariable must be implemented');
  }

  analyzeResults(results) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (failed.length === 0) {
      return {
        impact: 'none',
        message: 'Variable does not affect the issue'
      };
    }

    if (successful.length === 0) {
      return {
        impact: 'blocking',
        message: 'Issue occurs with all values'
      };
    }

    // Check for specific values that cause issues
    const problematicValues = failed.map(r => r.value);

    return {
      impact: 'partial',
      message: `Issue occurs with values: ${problematicValues.join(', ')}`,
      problematicValues
    };
  }

  async isolateCause() {
    const findings = [];

    for (const variable of this.variables) {
      const result = await this.testVariable(variable);
      findings.push(result);

      if (result.conclusion.impact === 'blocking' || 
          result.conclusion.impact === 'partial') {
        console.log(`\n⚠️  ${variable.name} impacts the issue:`);
        console.log(`   ${result.conclusion.message}`);
      }
    }

    return findings;
  }
}

// Usage
class FileProcessingIsolator extends CauseIsolator {
  async executeWithVariable(name, value) {
    const settings = {};
    settings[name] = value;

    // Execute with specific setting
    return await processFile(testFile, settings);
  }
}

const isolator = new FileProcessingIsolator();

isolator.addVariable('fileSize', [1000, 5000, 10000, 50000]);
isolator.addVariable('model', ['claude-haiku-4', 'claude-sonnet-4-5', 'claude-opus-4']);
isolator.addVariable('streaming', [true, false]);

const findings = await isolator.isolateCause();
```

**Step 5: Test Solutions**

```javascript
class SolutionTester {
  constructor(problem, cause) {
    this.problem = problem;
    this.cause = cause;
    this.solutions = [];
    this.results = [];
  }

  proposeSolution(name, description, implementation) {
    this.solutions.push({
      name,
      description,
      implementation
    });
  }

  async testSolution(solution) {
    console.log(`\nTesting solution: ${solution.name}`);
    console.log(`Description: ${solution.description}`);

    const iterations = 5;
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const result = await this.executeSolutionTest(solution, i + 1);
      results.push(result);
    }

    const analysis = this.analyzeSolutionResults(results);

    this.results.push({
      solution: solution.name,
      analysis,
      results
    });

    return analysis;
  }

  async executeSolutionTest(solution, iteration) {
    const start = Date.now();

    try {
      // Apply solution
      await solution.implementation();

      // Test if problem is resolved
      const resolved = await this.verifyProblemResolved();

      return {
        iteration,
        success: resolved,
        duration: Date.now() - start
      };

    } catch (error) {
      return {
        iteration,
        success: false,
        duration: Date.now() - start,
        error: error.message
      };
    }
  }

  async verifyProblemResolved() {
    // Override with actual verification
    return true;
  }

  analyzeSolutionResults(results) {
    const successful = results.filter(r => r.success).length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    const effectiveness = successful / results.length;

    return {
      effectiveness,
      avgDuration,
      successful,
      total: results.length,
      rating: this.rateSolution(effectiveness, avgDuration)
    };
  }

  rateSolution(effectiveness, avgDuration) {
    if (effectiveness === 1 && avgDuration < 5000) {
      return 'excellent';
    }
    
    if (effectiveness >= 0.8) {
      return 'good';
    }

    if (effectiveness >= 0.5) {
      return 'partial';
    }

    return 'ineffective';
  }

  async testAllSolutions() {
    console.log(`Testing ${this.solutions.length} solutions...\n`);

    for (const solution of this.solutions) {
      await this.testSolution(solution);
    }

    return this.getBestSolution();
  }

  getBestSolution() {
    if (this.results.length === 0) {
      return null;
    }

    const sorted = this.results
      .filter(r => r.analysis.effectiveness > 0)
      .sort((a, b) => {
        // Sort by effectiveness first, then by duration
        if (b.analysis.effectiveness !== a.analysis.effectiveness) {
          return b.analysis.effectiveness - a.analysis.effectiveness;
        }
        return a.analysis.avgDuration - b.analysis.avgDuration;
      });

    return sorted[0] || null;
  }

  generateReport() {
    const best = this.getBestSolution();

    return {
      problem: this.problem,
      cause: this.cause,
      solutionsTested: this.solutions.length,
      bestSolution: best ? {
        name: best.solution,
        effectiveness: best.analysis.effectiveness,
        rating: best.analysis.rating
      } : null,
      allResults: this.results
    };
  }
}

// Usage
const tester = new SolutionTester(problem, cause);

tester.proposeSolution(
  'Increase timeout',
  'Increase request timeout to 60 seconds',
  async () => {
    config.timeout = 60000;
  }
);

tester.proposeSolution(
  'Enable streaming',
  'Use streaming responses for faster initial feedback',
  async () => {
    config.streaming = true;
  }
);

tester.proposeSolution(
  'Chunk large files',
  'Process large files in smaller chunks',
  async () => {
    config.chunkSize = 5000;
  }
);

await tester.testAllSolutions();
const report = tester.generateReport();

console.log('\n=== Solution Report ===');
if (report.bestSolution) {
  console.log(`\nBest Solution: ${report.bestSolution.name}`);
  console.log(`Effectiveness: ${(report.bestSolution.effectiveness * 100).toFixed(1)}%`);
  console.log(`Rating: ${report.bestSolution.rating}`);
}
```

## Debugging Tools and Techniques

### Logging and Tracing

```javascript
class DebugLogger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.output = options.output || console.log;
    this.timestamps = options.timestamps !== false;
    this.contexts = [];
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  log(level, message, data) {
    if (!this.shouldLog(level)) return;

    const timestamp = this.timestamps ? new Date().toISOString() : '';
    const context = this.contexts.length > 0 
      ? `[${this.contexts.join(' > ')}]` 
      : '';

    const prefix = `${timestamp} [${level.toUpperCase()}]${context}`;
    
    if (data) {
      this.output(`${prefix} ${message}`, data);
    } else {
      this.output(`${prefix} ${message}`);
    }
  }

  error(message, data) {
    this.log('error', message, data);
  }

  warn(message, data) {
    this.log('warn', message, data);
  }

  info(message, data) {
    this.log('info', message, data);
  }

  debug(message, data) {
    this.log('debug', message, data);
  }

  trace(message, data) {
    this.log('trace', message, data);
  }

  pushContext(context) {
    this.contexts.push(context);
  }

  popContext() {
    this.contexts.pop();
  }

  async withContext(context, fn) {
    this.pushContext(context);
    
    try {
      return await fn();
    } finally {
      this.popContext();
    }
  }

  async time(label, fn) {
    const start = Date.now();
    this.debug(`${label} started`);

    try {
      const result = await fn();
      const duration = Date.now() - start;
      this.debug(`${label} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.error(`${label} failed after ${duration}ms`, { error });
      throw error;
    }
  }
}

// Usage
const logger = new DebugLogger({ level: 'debug' });

await logger.withContext('FileProcessing', async () => {
  logger.info('Starting file processing');
  
  const result = await logger.time('ReadFile', async () => {
    return await fs.readFile('large-file.txt', 'utf-8');
  });

  logger.debug('File read successfully', { size: result.length });
});
```

### Performance Profiling

```javascript
class PerformanceProfiler {
  constructor() {
    this.marks = new Map();
    this.measures = [];
  }

  mark(name) {
    this.marks.set(name, {
      timestamp: Date.now(),
      memory: process.memoryUsage()
    });
  }

  measure(name, startMark, endMark) {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (!start || !end) {
      throw new Error(`Missing marks: ${startMark} or ${endMark}`);
    }

    const measure = {
      name,
      duration: end.timestamp - start.timestamp,
      memoryDelta: {
        heapUsed: end.memory.heapUsed - start.memory.heapUsed,
        external: end.memory.external - start.memory.external
      },
      startTime: start.timestamp,
      endTime: end.timestamp
    };

    this.measures.push(measure);
    return measure;
  }

  async profile(name, fn) {
    const startMark = `${name}-start`;
    const endMark = `${name}-end`;

    this.mark(startMark);

    try {
      const result = await fn();
      this.mark(endMark);
      
      const measure = this.measure(name, startMark, endMark);
      
      return {
        result,
        profile: measure
      };

    } catch (error) {
      this.mark(endMark);
      this.measure(name, startMark, endMark);
      throw error;
    }
  }

  getReport() {
    const totalDuration = this.measures.reduce((sum, m) => sum + m.duration, 0);
    const avgDuration = totalDuration / this.measures.length;

    const sorted = [...this.measures].sort((a, b) => b.duration - a.duration);

    return {
      totalDuration,
      avgDuration,
      measureCount: this.measures.length,
      slowest: sorted.slice(0, 5),
      all: this.measures
    };
  }

  printReport() {
    const report = this.getReport();

    console.log('\n=== Performance Profile ===');
    console.log(`Total Duration: ${report.totalDuration}ms`);
    console.log(`Average Duration: ${report.avgDuration.toFixed(2)}ms`);
    console.log(`Measures: ${report.measureCount}`);

    console.log('\nSlowest Operations:');
    report.slowest.forEach((measure, i) => {
      console.log(`${i + 1}. ${measure.name}: ${measure.duration}ms`);
      console.log(`   Memory Delta: ${(measure.memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    });
  }
}

// Usage
const profiler = new PerformanceProfiler();

const { result, profile } = await profiler.profile('processLargeFile', async () => {
  return await processFile('large.txt');
});

console.log(`Operation completed in ${profile.duration}ms`);

profiler.printReport();
```

### State Inspector

```javascript
class StateInspector {
  constructor(target) {
    this.target = target;
    this.snapshots = [];
  }

  snapshot(label) {
    const snapshot = {
      label,
      timestamp: Date.now(),
      state: this.captureState()
    };

    this.snapshots.push(snapshot);
    return snapshot;
  }

  captureState() {
    // Deep clone state
    return JSON.parse(JSON.stringify(this.target));
  }

  compare(label1, label2) {
    const snap1 = this.snapshots.find(s => s.label === label1);
    const snap2 = this.snapshots.find(s => s.label === label2);

    if (!snap1 || !snap2) {
      throw new Error('Snapshot not found');
    }

    return this.diff(snap1.state, snap2.state);
  }

  diff(obj1, obj2, path = []) {
    const differences = [];

    const allKeys = new Set([
      ...Object.keys(obj1 || {}),
      ...Object.keys(obj2 || {})
    ]);

    for (const key of allKeys) {
      const currentPath = [...path, key];
      const val1 = obj1?.[key];
      const val2 = obj2?.[key];

      if (val1 === undefined && val2 !== undefined) {
        differences.push({
          path: currentPath.join('.'),
          type: 'added',
          value: val2
        });
      } else if (val1 !== undefined && val2 === undefined) {
        differences.push({
          path: currentPath.join('.'),
          type: 'removed',
          value: val1
        });
      } else if (typeof val1 === 'object' && typeof val2 === 'object') {
        const nested = this.diff(val1, val2, currentPath);
        differences.push(...nested);
      } else if (val1 !== val2) {
        differences.push({
          path: currentPath.join('.'),
          type: 'changed',
          before: val1,
          after: val2
        });
      }
    }

    return differences;
  }

  printDiff(label1, label2) {
    const differences = this.compare(label1, label2);

    console.log(`\n=== State Diff: ${label1} -> ${label2} ===`);

    if (differences.length === 0) {
      console.log('No changes detected');
      return;
    }

    differences.forEach(diff => {
      switch (diff.type) {
        case 'added':
          console.log(`+ ${diff.path}: ${JSON.stringify(diff.value)}`);
          break;
        case 'removed':
          console.log(`- ${diff.path}: ${JSON.stringify(diff.value)}`);
          break;
        case 'changed':
          console.log(`~ ${diff.path}:`);
          console.log(`  Before: ${JSON.stringify(diff.before)}`);
          console.log(`  After:  ${JSON.stringify(diff.after)}`);
          break;
      }
    });
  }
}

// Usage
const state = {
  user: 'alice',
  settings: {
    theme: 'dark',
    notifications: true
  },
  data: []
};

const inspector = new StateInspector(state);

inspector.snapshot('initial');

// Modify state
state.settings.theme = 'light';
state.data.push('item1');

inspector.snapshot('after-changes');

inspector.printDiff('initial', 'after-changes');
```

## Debugging Checklist

### Pre-Debug Checklist

- [ ] Problem clearly defined
- [ ] Expected vs actual behavior documented
- [ ] Reproduction steps identified
- [ ] Environment details collected
- [ ] Recent changes reviewed
- [ ] Logs collected
- [ ] Configuration verified

### Debug Process Checklist

- [ ] Reproduced problem consistently
- [ ] Isolated variables
- [ ] Tested hypotheses
- [ ] Identified root cause
- [ ] Proposed solutions
- [ ] Tested solutions
- [ ] Verified fix

### Post-Debug Checklist

- [ ] Solution documented
- [ ] Tests added to prevent regression
- [ ] Configuration updated if needed
- [ ] Team notified of findings
- [ ] Knowledge base updated
- [ ] Monitoring added for similar issues

This systematic debugging guide provides comprehensive methodologies, tools, and checklists for efficiently troubleshooting any Claude Code issue.
