# Building and Using Custom Skills

## Overview

Custom skills extend Claude's capabilities for your specific workflows, enabling reusable, shareable automation patterns across teams.

## Understanding Skills

### What Are Skills?

Skills are packaged capabilities that:
- Encapsulate domain-specific knowledge
- Provide reusable workflow patterns
- Can be shared across teams
- Integrate with existing tools

### Skill Architecture

```
skill/
├── skill.json          # Skill metadata and configuration
├── handlers/           # Command handlers
│   ├── analyze.js
│   └── validate.js
├── prompts/           # Prompt templates
│   └── templates/
├── tools/             # Custom tool integrations
│   └── custom-tool.js
└── tests/             # Skill tests
    └── skill.test.js
```

## Creating Custom Skills

### Basic Skill Structure

```json
{
  "name": "database-analyzer",
  "version": "1.0.0",
  "description": "Database schema analysis and optimization",
  "author": "DevOps Team",
  "commands": {
    "analyze": {
      "description": "Analyze database schema for issues",
      "handler": "handlers/analyze.js",
      "parameters": {
        "schema": {
          "type": "string",
          "required": true,
          "description": "Path to schema file"
        },
        "format": {
          "type": "string",
          "enum": ["json", "sql", "yaml"],
          "default": "sql"
        }
      }
    },
    "optimize": {
      "description": "Generate optimization recommendations",
      "handler": "handlers/optimize.js"
    }
  },
  "tools": [
    "tools/schema-parser.js",
    "tools/index-analyzer.js"
  ],
  "dependencies": {
    "sql-parser": "^3.0.0",
    "schema-inspector": "^2.0.0"
  }
}
```

### Skill Handler Example

```javascript
// handlers/analyze.js
const { SchemaParser } = require('../tools/schema-parser');
const { IndexAnalyzer } = require('../tools/index-analyzer');

module.exports = async function analyzeHandler(context, params) {
  const { schema, format } = params;
  
  // Load and parse schema
  const parser = new SchemaParser(format);
  const schemaData = await parser.parse(schema);
  
  // Analyze for issues
  const issues = {
    missingIndexes: [],
    redundantIndexes: [],
    normalizationIssues: [],
    performanceWarnings: []
  };
  
  // Check for missing indexes on foreign keys
  for (const table of schemaData.tables) {
    for (const fk of table.foreignKeys) {
      if (!hasIndex(table, fk.columns)) {
        issues.missingIndexes.push({
          table: table.name,
          columns: fk.columns,
          reason: 'Foreign key without index',
          impact: 'high',
          suggestion: `CREATE INDEX idx_${table.name}_${fk.columns.join('_')} ON ${table.name}(${fk.columns.join(', ')})`
        });
      }
    }
  }
  
  // Check for redundant indexes
  const indexAnalyzer = new IndexAnalyzer(schemaData);
  issues.redundantIndexes = indexAnalyzer.findRedundant();
  
  // Generate report
  return {
    summary: {
      totalTables: schemaData.tables.length,
      totalIssues: Object.values(issues).flat().length,
      criticalIssues: countCritical(issues)
    },
    issues,
    recommendations: generateRecommendations(issues),
    metadata: {
      analyzedAt: new Date().toISOString(),
      schemaVersion: schemaData.version
    }
  };
};

function hasIndex(table, columns) {
  return table.indexes.some(idx => 
    idx.columns.length === columns.length &&
    idx.columns.every((col, i) => col === columns[i])
  );
}

function countCritical(issues) {
  return Object.values(issues)
    .flat()
    .filter(issue => issue.impact === 'high')
    .length;
}

function generateRecommendations(issues) {
  const recs = [];
  
  if (issues.missingIndexes.length > 0) {
    recs.push({
      priority: 1,
      category: 'Performance',
      title: 'Add missing foreign key indexes',
      description: `${issues.missingIndexes.length} foreign keys lack indexes`,
      actions: issues.missingIndexes.map(i => i.suggestion)
    });
  }
  
  if (issues.redundantIndexes.length > 0) {
    recs.push({
      priority: 2,
      category: 'Optimization',
      title: 'Remove redundant indexes',
      description: `${issues.redundantIndexes.length} indexes are redundant`,
      actions: issues.redundantIndexes.map(i => `DROP INDEX ${i.name}`)
    });
  }
  
  return recs;
}
```

### Custom Tool Integration

```javascript
// tools/schema-parser.js
const fs = require('fs').promises;
const sqlParser = require('sql-parser');
const yaml = require('yaml');

class SchemaParser {
  constructor(format) {
    this.format = format;
  }
  
  async parse(schemaPath) {
    const content = await fs.readFile(schemaPath, 'utf8');
    
    switch (this.format) {
      case 'sql':
        return this.parseSql(content);
      case 'json':
        return JSON.parse(content);
      case 'yaml':
        return yaml.parse(content);
      default:
        throw new Error(`Unsupported format: ${this.format}`);
    }
  }
  
  parseSql(sql) {
    const tables = [];
    const statements = sqlParser.parse(sql);
    
    for (const stmt of statements) {
      if (stmt.type === 'CREATE_TABLE') {
        tables.push(this.parseTable(stmt));
      }
    }
    
    return {
      tables,
      version: this.extractVersion(sql)
    };
  }
  
  parseTable(stmt) {
    return {
      name: stmt.table,
      columns: stmt.columns.map(col => ({
        name: col.name,
        type: col.type,
        nullable: !col.notNull,
        primaryKey: col.primaryKey,
        unique: col.unique,
        default: col.default
      })),
      foreignKeys: stmt.foreignKeys || [],
      indexes: stmt.indexes || [],
      constraints: stmt.constraints || []
    };
  }
  
  extractVersion(sql) {
    const match = sql.match(/-- Version: (.+)/);
    return match ? match[1] : 'unknown';
  }
}

module.exports = { SchemaParser };
```

## Advanced Skill Patterns

### Multi-Step Workflow Skill

```javascript
// skill.json for deployment-orchestrator
{
  "name": "deployment-orchestrator",
  "version": "2.0.0",
  "description": "Orchestrate complex deployment workflows",
  "commands": {
    "deploy": {
      "description": "Execute deployment workflow",
      "handler": "handlers/deploy.js",
      "workflow": true,
      "steps": [
        "validate-config",
        "run-tests",
        "build-artifacts",
        "deploy-staging",
        "smoke-test",
        "deploy-production",
        "verify-health"
      ]
    }
  }
}
```

```javascript
// handlers/deploy.js
const { WorkflowExecutor } = require('../lib/workflow');

module.exports = async function deployHandler(context, params) {
  const workflow = new WorkflowExecutor(context);
  
  // Step 1: Validate configuration
  await workflow.step('validate-config', async () => {
    const config = await loadConfig(params.configPath);
    const validation = validateDeploymentConfig(config);
    
    if (!validation.valid) {
      throw new Error(`Invalid config: ${validation.errors.join(', ')}`);
    }
    
    return { config };
  });
  
  // Step 2: Run tests
  await workflow.step('run-tests', async (ctx) => {
    const testResults = await runTestSuite(ctx.config);
    
    if (testResults.failed > 0) {
      throw new Error(`${testResults.failed} tests failed`);
    }
    
    return { testResults };
  });
  
  // Step 3: Build artifacts
  await workflow.step('build-artifacts', async (ctx) => {
    const artifacts = await buildApplication(ctx.config);
    
    return { artifacts };
  });
  
  // Step 4: Deploy to staging
  await workflow.step('deploy-staging', async (ctx) => {
    const deployment = await deployToEnvironment('staging', ctx.artifacts);
    
    // Wait for deployment to be ready
    await waitForHealthy(deployment, { timeout: 300000 });
    
    return { stagingDeployment: deployment };
  });
  
  // Step 5: Run smoke tests
  await workflow.step('smoke-test', async (ctx) => {
    const results = await runSmokeTests(ctx.stagingDeployment);
    
    if (!results.passed) {
      // Automatic rollback
      await rollback(ctx.stagingDeployment);
      throw new Error('Smoke tests failed, rolled back');
    }
    
    return { smokeTestResults: results };
  });
  
  // Step 6: Deploy to production (requires approval)
  await workflow.step('deploy-production', async (ctx) => {
    // Request approval
    const approved = await requestApproval({
      deployment: ctx.stagingDeployment,
      testResults: ctx.smokeTestResults,
      approvers: ctx.config.approvers
    });
    
    if (!approved) {
      throw new Error('Deployment not approved');
    }
    
    // Blue-green deployment
    const prodDeployment = await blueGreenDeploy('production', ctx.artifacts);
    
    return { productionDeployment: prodDeployment };
  });
  
  // Step 7: Verify health
  await workflow.step('verify-health', async (ctx) => {
    const health = await verifyProductionHealth(ctx.productionDeployment);
    
    if (!health.healthy) {
      // Automatic rollback
      await rollback(ctx.productionDeployment);
      throw new Error('Health check failed, rolled back');
    }
    
    // Complete the blue-green deployment
    await completeDeployment(ctx.productionDeployment);
    
    return { health };
  });
  
  return workflow.getResults();
};
```

### Context-Aware Skill

```javascript
// handlers/code-review.js
module.exports = async function codeReviewHandler(context, params) {
  const { files, branch } = params;
  
  // Gather context
  const projectContext = await gatherProjectContext(context);
  const gitContext = await gatherGitContext(branch);
  const fileContext = await analyzeFiles(files);
  
  // Build review prompt with context
  const reviewPrompt = `
# Code Review Request

## Project Context
- Language: ${projectContext.language}
- Framework: ${projectContext.framework}
- Coding Standards: ${projectContext.codingStandards}

## Changes
${gitContext.diff}

## Files Changed
${fileContext.summary}

## Review Checklist
1. Code quality and readability
2. Adherence to coding standards
3. Test coverage
4. Security vulnerabilities
5. Performance implications
6. Breaking changes

Please provide:
1. Overall assessment
2. Specific issues found
3. Recommendations
4. Test coverage analysis
`;

  // Execute review using Claude
  const review = await context.ask(reviewPrompt);
  
  // Parse and structure review results
  const structuredReview = parseReviewResults(review);
  
  // Generate actionable items
  const actionItems = generateActionItems(structuredReview);
  
  // Create GitHub review comment
  if (params.createGithubReview) {
    await createGitHubReview(gitContext.pr, structuredReview, actionItems);
  }
  
  return {
    review: structuredReview,
    actionItems,
    metrics: {
      filesReviewed: files.length,
      issuesFound: structuredReview.issues.length,
      severity: calculateSeverity(structuredReview.issues)
    }
  };
};
```

## Skill Testing

### Test Framework

```javascript
// tests/skill.test.js
const { SkillTester } = require('@claude/skill-testing');
const analyzeHandler = require('../handlers/analyze');

describe('Database Analyzer Skill', () => {
  let tester;
  
  beforeEach(() => {
    tester = new SkillTester();
  });
  
  test('detects missing foreign key indexes', async () => {
    const schema = `
      CREATE TABLE users (
        id INT PRIMARY KEY,
        email VARCHAR(255) UNIQUE
      );
      
      CREATE TABLE orders (
        id INT PRIMARY KEY,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
    
    const result = await tester.execute(analyzeHandler, {
      schema: await tester.createFile('schema.sql', schema),
      format: 'sql'
    });
    
    expect(result.issues.missingIndexes).toHaveLength(1);
    expect(result.issues.missingIndexes[0]).toMatchObject({
      table: 'orders',
      columns: ['user_id'],
      impact: 'high'
    });
  });
  
  test('identifies redundant indexes', async () => {
    const schema = `
      CREATE TABLE products (
        id INT PRIMARY KEY,
        category_id INT,
        name VARCHAR(255),
        INDEX idx_category (category_id),
        INDEX idx_category_name (category_id, name)
      );
    `;
    
    const result = await tester.execute(analyzeHandler, {
      schema: await tester.createFile('schema.sql', schema),
      format: 'sql'
    });
    
    expect(result.issues.redundantIndexes).toHaveLength(1);
  });
  
  test('generates correct optimization recommendations', async () => {
    const schema = await tester.loadFixture('complex-schema.sql');
    
    const result = await tester.execute(analyzeHandler, {
      schema,
      format: 'sql'
    });
    
    expect(result.recommendations).toBeDefined();
    expect(result.recommendations[0].priority).toBe(1);
    expect(result.recommendations[0].actions).toBeArray();
  });
});
```

## Sharing and Distribution

### Publishing Skills

```bash
# Package skill
claude skill pack database-analyzer/

# Publish to registry
claude skill publish database-analyzer-1.0.0.skill

# Install skill
claude skill install database-analyzer

# List installed skills
claude skill list

# Update skill
claude skill update database-analyzer
```

### Skill Registry Configuration

```json
{
  "registries": [
    {
      "name": "company-private",
      "url": "https://skills.company.com",
      "auth": {
        "type": "token",
        "token": "${SKILL_REGISTRY_TOKEN}"
      }
    },
    {
      "name": "public",
      "url": "https://skills.claude.ai",
      "auth": {
        "type": "none"
      }
    }
  ],
  "defaultRegistry": "company-private"
}
```

## Enterprise Skill Patterns

### Security Scanning Skill

```javascript
// skills/security-scanner/handlers/scan.js
const { SecurityScanner } = require('../tools/scanner');
const { VulnerabilityDB } = require('../tools/vuln-db');

module.exports = async function scanHandler(context, params) {
  const scanner = new SecurityScanner();
  const vulnDB = new VulnerabilityDB();
  
  // Scan different layers
  const results = {
    dependencies: await scanner.scanDependencies(params.project),
    code: await scanner.scanCode(params.project),
    secrets: await scanner.scanSecrets(params.project),
    containers: await scanner.scanContainers(params.project),
    infrastructure: await scanner.scanInfrastructure(params.project)
  };
  
  // Cross-reference with vulnerability database
  const enrichedResults = await vulnDB.enrichFindings(results);
  
  // Prioritize findings
  const prioritized = prioritizeVulnerabilities(enrichedResults);
  
  // Generate remediation plan
  const remediationPlan = await generateRemediationPlan(prioritized);
  
  // Create security report
  const report = {
    summary: {
      critical: countBySeverity(prioritized, 'critical'),
      high: countBySeverity(prioritized, 'high'),
      medium: countBySeverity(prioritized, 'medium'),
      low: countBySeverity(prioritized, 'low')
    },
    findings: prioritized,
    remediation: remediationPlan,
    compliance: await checkCompliance(enrichedResults, params.standards)
  };
  
  // Export to SARIF format for CI integration
  if (params.exportSarif) {
    await exportSARIF(report, params.sarifPath);
  }
  
  return report;
};
```

### Performance Profiling Skill

```javascript
// skills/performance-profiler/handlers/profile.js
module.exports = async function profileHandler(context, params) {
  const profiler = new ApplicationProfiler(params);
  
  // Start profiling
  await profiler.start();
  
  // Execute load test
  const loadTest = await runLoadTest({
    target: params.target,
    duration: params.duration,
    rps: params.requestsPerSecond,
    scenarios: params.scenarios
  });
  
  // Collect metrics
  const metrics = await profiler.collect();
  
  // Stop profiling
  await profiler.stop();
  
  // Analyze results
  const analysis = {
    responseTime: analyzeResponseTimes(metrics),
    throughput: analyzeThroughput(metrics),
    resources: analyzeResourceUsage(metrics),
    bottlenecks: identifyBottlenecks(metrics),
    errors: analyzeErrors(loadTest.errors)
  };
  
  // Generate optimization recommendations
  const recommendations = await generateOptimizations(analysis);
  
  // Create flame graphs
  if (params.generateFlameGraphs) {
    await generateFlameGraphs(metrics, params.outputDir);
  }
  
  return {
    metrics,
    analysis,
    recommendations,
    artifacts: {
      rawData: `${params.outputDir}/metrics.json`,
      flameGraphs: params.generateFlameGraphs ? `${params.outputDir}/flames/` : null
    }
  };
};
```

## Best Practices

### Skill Design Principles

1. **Single Responsibility**: Each skill should have one clear purpose
2. **Composability**: Skills should work well together
3. **Error Handling**: Graceful degradation and clear error messages
4. **Documentation**: Comprehensive examples and use cases
5. **Testing**: Thorough test coverage
6. **Versioning**: Semantic versioning for compatibility

### Performance Optimization

```javascript
// Cache expensive operations
const cache = new LRUCache({ max: 100 });

async function analyzeWithCache(schema) {
  const cacheKey = hashSchema(schema);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const result = await expensiveAnalysis(schema);
  cache.set(cacheKey, result);
  
  return result;
}

// Parallel execution
async function analyzeMultipleSchemas(schemas) {
  return await Promise.all(
    schemas.map(schema => analyzeWithCache(schema))
  );
}

// Stream large results
async function streamLargeReport(report, outputPath) {
  const stream = createWriteStream(outputPath);
  
  for await (const chunk of generateReportChunks(report)) {
    stream.write(chunk);
  }
  
  stream.end();
}
```

## Real-World Examples

### Infrastructure Provisioning Skill

```javascript
// Complete example: terraform-provisioner skill
{
  "name": "terraform-provisioner",
  "version": "1.0.0",
  "commands": {
    "plan": {
      "handler": "handlers/plan.js",
      "description": "Generate Terraform plan with analysis"
    },
    "apply": {
      "handler": "handlers/apply.js",
      "description": "Apply infrastructure changes with safety checks"
    },
    "analyze-costs": {
      "handler": "handlers/cost-analysis.js",
      "description": "Estimate infrastructure costs"
    }
  }
}
```

### Incident Response Skill

```javascript
// Automated incident triage and response
module.exports = async function incidentHandler(context, params) {
  const incident = await fetchIncident(params.incidentId);
  
  // Gather diagnostic information
  const diagnostics = await gatherDiagnostics({
    logs: await fetchLogs(incident.service, incident.timeRange),
    metrics: await fetchMetrics(incident.service, incident.timeRange),
    traces: await fetchTraces(incident.traceId),
    events: await fetchEvents(incident.service, incident.timeRange)
  });
  
  // Analyze with Claude
  const analysis = await context.ask(`
    Analyze this incident:
    
    ${JSON.stringify(incident, null, 2)}
    
    Diagnostics:
    ${JSON.stringify(diagnostics, null, 2)}
    
    Provide:
    1. Root cause analysis
    2. Impact assessment
    3. Immediate mitigation steps
    4. Long-term remediation plan
  `);
  
  // Execute automated mitigation
  if (params.autoMitigate && analysis.confidence > 0.9) {
    await executeMitigation(analysis.mitigationSteps);
  }
  
  // Create incident report
  return {
    incident,
    analysis,
    diagnostics,
    timeline: constructTimeline(diagnostics),
    recommendations: analysis.remediation
  };
};
```

## Summary

Custom skills enable teams to:
- Codify domain expertise
- Automate complex workflows
- Share best practices
- Maintain consistency across projects
- Accelerate development cycles

Next: [Workflow Automation](19-workflow-automation.md) for orchestrating complex development processes.
