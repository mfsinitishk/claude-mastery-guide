# Tool Integrations

## Introduction

Tool integrations extend Claude's capabilities beyond MCP servers to encompass your entire development toolchain. This section teaches you to connect Claude with CI/CD systems, testing frameworks, linters, build tools, and custom services - creating seamless workflows that leverage AI across every stage of development.

## Integration Architecture

### The Tool Integration Stack

```
┌─────────────────────────────────────────────────────────┐
│ Claude (AI Assistant)                                   │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────┼────────────┬──────────────┐
    │            │            │              │
┌───▼───┐  ┌────▼────┐  ┌────▼─────┐  ┌────▼─────┐
│  MCP  │  │  CLI    │  │   API    │  │  Hooks   │
│ Tools │  │ Tools   │  │  Tools   │  │  Tools   │
└───┬───┘  └────┬────┘  └────┬─────┘  └────┬─────┘
    │           │            │              │
┌───▼──────────────────────────────────────────────┐
│ Development Tools Ecosystem                      │
│                                                   │
│ Build: webpack, vite, gradle, maven             │
│ Test: jest, pytest, junit, selenium             │
│ Lint: eslint, pylint, checkstyle                │
│ CI/CD: GitHub Actions, GitLab CI, Jenkins       │
│ Deploy: Docker, Kubernetes, Terraform           │
│ Monitor: Datadog, Prometheus, Sentry            │
└──────────────────────────────────────────────────┘
```

### Integration Types

**1. Direct MCP Integration**
- Purpose-built MCP servers for specific tools
- Native protocol support
- Best performance and features

**2. CLI Wrapper Integration**
- Execute CLI commands via shell
- Parse and structure output
- Universal compatibility

**3. API Integration**
- REST/GraphQL API calls
- Requires authentication management
- Rich feature access

**4. Hook-Based Integration**
- Git hooks, CI/CD hooks, IDE hooks
- Event-driven automation
- Context-aware triggering

## CI/CD Integrations

### GitHub Actions Integration

**Setup: GitHub MCP Server**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_OWNER": "your-org",
        "GITHUB_REPOS": "repo1,repo2"
      }
    }
  }
}
```

**Workflow: Automated PR Review**
```yaml
# .github/workflows/claude-review.yml
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Claude CLI
        run: |
          npm install -g @anthropic-ai/claude-cli
          claude configure --api-key ${{ secrets.CLAUDE_API_KEY }}
      
      - name: Run Claude Review
        run: |
          claude review-pr \
            --repo ${{ github.repository }} \
            --pr ${{ github.event.pull_request.number }} \
            --output pr-review.md
      
      - name: Post Review
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('pr-review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

**Example Review Prompt:**
```
Review this PR:
- Check code quality and best practices
- Identify potential bugs or security issues
- Verify test coverage
- Suggest improvements
- Ensure documentation is updated

Use the github MCP server to access:
- PR files and diffs
- Existing codebase for context
- Related issues and discussions
```

### GitLab CI Integration

**Setup: GitLab MCP Server**
```json
{
  "mcpServers": {
    "gitlab": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gitlab"],
      "env": {
        "GITLAB_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "${GITLAB_TOKEN}",
        "GITLAB_PROJECT_ID": "12345"
      }
    }
  }
}
```

**Pipeline Configuration:**
```yaml
# .gitlab-ci.yml
claude-review:
  stage: review
  image: node:18
  script:
    - npm install -g @anthropic-ai/claude-cli
    - |
      claude review-mr \
        --project ${CI_PROJECT_ID} \
        --mr ${CI_MERGE_REQUEST_IID} \
        --config .claude/review-config.yml
  only:
    - merge_requests
```

### Jenkins Integration

**Jenkinsfile:**
```groovy
pipeline {
    agent any
    
    environment {
        CLAUDE_API_KEY = credentials('claude-api-key')
    }
    
    stages {
        stage('Code Analysis') {
            steps {
                script {
                    sh '''
                        claude analyze-codebase \
                            --path ${WORKSPACE} \
                            --output analysis.json \
                            --checks security,quality,performance
                    '''
                    
                    def analysis = readJSON file: 'analysis.json'
                    
                    if (analysis.critical_issues > 0) {
                        error "Critical issues found: ${analysis.critical_issues}"
                    }
                }
            }
        }
        
        stage('Generate Documentation') {
            steps {
                sh '''
                    claude document-api \
                        --openapi api/swagger.yml \
                        --output docs/api-guide.md
                '''
            }
        }
    }
}
```

## Testing Framework Integrations

### Jest Integration

**Setup: Custom Test Analysis Tool**
```javascript
// tools/claude-test-analyzer.js
import { Claude } from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';

async function analyzeTestResults(testOutputPath) {
  const claude = new Claude({
    apiKey: process.env.CLAUDE_API_KEY
  });
  
  const testOutput = readFileSync(testOutputPath, 'utf8');
  
  const analysis = await claude.messages.create({
    model: 'claude-sonnet-4.5',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Analyze these Jest test results and provide:
1. Summary of failures and their root causes
2. Suggested fixes for failing tests
3. Recommendations for improving test coverage

Test Results:
${testOutput}`
    }]
  });
  
  return analysis.content[0].text;
}
```

**Jest Configuration:**
```javascript
// jest.config.js
module.exports = {
  testResultsProcessor: './tools/claude-test-analyzer.js',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

**Usage:**
```bash
npm test -- --json --outputFile=test-results.json
node tools/claude-test-analyzer.js test-results.json
```

### Pytest Integration

**pytest Plugin:**
```python
# conftest.py
import pytest
import json
from anthropic import Anthropic

client = Anthropic(api_key=os.environ.get("CLAUDE_API_KEY"))

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    
    if report.when == "call" and report.failed:
        # Analyze failure with Claude
        failure_info = {
            'test': item.nodeid,
            'error': str(report.longrepr),
            'code': inspect.getsource(item.function)
        }
        
        analysis = analyze_failure(failure_info)
        report.sections.append(("Claude Analysis", analysis))

def analyze_failure(failure_info):
    message = client.messages.create(
        model="claude-sonnet-4.5",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Analyze this test failure:

Test: {failure_info['test']}
Error: {failure_info['error']}
Code: {failure_info['code']}

Provide:
1. Root cause analysis
2. Suggested fix
3. Whether this indicates a test or code issue"""
        }]
    )
    
    return message.content[0].text
```

### Selenium Integration

**Automated Test Generation:**
```python
# tools/claude_selenium_gen.py
from anthropic import Anthropic
from selenium import webdriver
from selenium.webdriver.common.by import By

class ClaudeTestGenerator:
    def __init__(self):
        self.claude = Anthropic(api_key=os.environ["CLAUDE_API_KEY"])
        self.driver = webdriver.Chrome()
    
    def generate_tests_for_page(self, url):
        """Generate Selenium tests for a web page"""
        
        # Capture page structure
        self.driver.get(url)
        page_html = self.driver.page_source
        
        # Ask Claude to generate tests
        message = self.claude.messages.create(
            model="claude-sonnet-4.5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""Generate Selenium test cases for this page.
Focus on:
- Form validation
- Navigation flows
- Critical user actions
- Error handling

Page HTML:
{page_html}

Generate Python pytest tests using Selenium."""
            }]
        )
        
        return message.content[0].text
```

## Linter and Code Quality Integrations

### ESLint Integration

**Custom ESLint Rule with Claude:**
```javascript
// eslint-rules/claude-best-practices.js
module.exports = {
  rules: {
    'check-with-claude': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Use Claude to check for best practice violations',
        },
      },
      create(context) {
        return {
          FunctionDeclaration(node) {
            const code = context.getSourceCode().getText(node);
            
            // Send complex functions to Claude for review
            if (code.length > 100) {
              analyzeFunctionWithClaude(code, context, node);
            }
          },
        };
      },
    },
  },
};

async function analyzeFunctionWithClaude(code, context, node) {
  const analysis = await claude.analyzeCode(code);
  
  if (analysis.issues.length > 0) {
    context.report({
      node,
      message: `Claude suggests improvements: ${analysis.summary}`,
      data: analysis.issues,
    });
  }
}
```

**ESLint Configuration:**
```json
{
  "plugins": ["claude"],
  "rules": {
    "claude/check-with-claude": ["warn", {
      "minComplexity": 10,
      "checkSecurity": true,
      "checkPerformance": true
    }]
  }
}
```

### SonarQube Integration

**Quality Gate Analysis:**
```python
# tools/sonar_claude_analysis.py
import requests
from anthropic import Anthropic

class SonarClaudeIntegration:
    def __init__(self, sonar_url, sonar_token):
        self.sonar_url = sonar_url
        self.sonar_token = sonar_token
        self.claude = Anthropic()
    
    def analyze_project(self, project_key):
        # Fetch SonarQube issues
        issues = self.fetch_sonar_issues(project_key)
        
        # Group and prioritize with Claude
        analysis = self.claude.messages.create(
            model="claude-sonnet-4.5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""Analyze these SonarQube issues:

{json.dumps(issues, indent=2)}

Provide:
1. Critical issues requiring immediate attention
2. Grouped issues by root cause
3. Recommended remediation order
4. Estimated effort for fixes"""
            }]
        )
        
        return analysis.content[0].text
    
    def fetch_sonar_issues(self, project_key):
        response = requests.get(
            f"{self.sonar_url}/api/issues/search",
            params={"componentKeys": project_key},
            auth=(self.sonar_token, '')
        )
        return response.json()
```

## Build Tool Integrations

### Webpack Integration

**Claude-Powered Bundle Analysis:**
```javascript
// webpack.config.js
const { ClaudeBundleAnalyzerPlugin } = require('claude-webpack-plugin');

module.exports = {
  // ... other config
  plugins: [
    new ClaudeBundleAnalyzerPlugin({
      apiKey: process.env.CLAUDE_API_KEY,
      analyze: {
        unusedCode: true,
        duplicateDependencies: true,
        optimizationOpportunities: true
      },
      report: {
        output: 'bundle-analysis.md',
        recommendations: true
      }
    })
  ]
};
```

**Plugin Implementation:**
```javascript
// claude-webpack-plugin.js
class ClaudeBundleAnalyzerPlugin {
  constructor(options) {
    this.options = options;
    this.claude = new Anthropic({ apiKey: options.apiKey });
  }
  
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'ClaudeBundleAnalyzer',
      async (compilation, callback) => {
        const stats = compilation.getStats().toJson();
        
        const analysis = await this.analyzeBundleWithClaude(stats);
        
        fs.writeFileSync(
          this.options.report.output,
          analysis
        );
        
        callback();
      }
    );
  }
  
  async analyzeBundleWithClaude(stats) {
    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4.5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Analyze this webpack bundle and suggest optimizations:

Bundle size: ${stats.assets.reduce((sum, a) => sum + a.size, 0)} bytes
Modules: ${stats.modules.length}
Chunks: ${stats.chunks.length}

Assets: ${JSON.stringify(stats.assets, null, 2)}

Identify:
1. Largest dependencies
2. Duplicate code
3. Unnecessary includes
4. Code splitting opportunities
5. Tree shaking improvements`
      }]
    });
    
    return message.content[0].text;
  }
}
```

### Gradle Integration

**Gradle Plugin:**
```groovy
// buildSrc/src/main/groovy/ClaudeAnalysisPlugin.groovy
class ClaudeAnalysisPlugin implements Plugin<Project> {
    void apply(Project project) {
        project.extensions.create('claudeAnalysis', ClaudeAnalysisExtension)
        
        project.task('analyzeWithClaude') {
            doLast {
                def analysis = analyzeProject(project)
                new File('build/claude-analysis.md').text = analysis
            }
        }
    }
    
    String analyzeProject(Project project) {
        // Collect project info
        def info = [
            dependencies: project.configurations.compile.dependencies,
            tasks: project.tasks.names,
            plugins: project.plugins.collect { it.class.simpleName }
        ]
        
        // Send to Claude for analysis
        def client = new ClaudeClient(apiKey: project.claudeAnalysis.apiKey)
        return client.analyze("""
Analyze this Gradle project:

${JsonOutput.prettyPrint(JsonOutput.toJson(info))}

Suggest:
1. Dependency optimizations
2. Build performance improvements
3. Plugin recommendations
4. Best practice violations
""")
    }
}
```

**Usage:**
```groovy
// build.gradle
plugins {
    id 'claude-analysis'
}

claudeAnalysis {
    apiKey = System.getenv('CLAUDE_API_KEY')
}
```

## Monitoring Tool Integrations

### Datadog Integration

**Automated Incident Analysis:**
```python
# tools/datadog_claude_integration.py
from datadog import initialize, api
from anthropic import Anthropic

class DatadogClaudeAnalyzer:
    def __init__(self):
        initialize(
            api_key=os.environ['DD_API_KEY'],
            app_key=os.environ['DD_APP_KEY']
        )
        self.claude = Anthropic()
    
    def analyze_incident(self, monitor_id):
        """Analyze an incident using Datadog metrics and Claude"""
        
        # Fetch monitor details
        monitor = api.Monitor.get(monitor_id)
        
        # Fetch related metrics
        metrics = self.fetch_related_metrics(monitor)
        
        # Fetch recent events
        events = api.Event.query(
            start=time.time() - 3600,
            end=time.time(),
            tags=monitor['tags']
        )
        
        # Analyze with Claude
        analysis = self.claude.messages.create(
            model="claude-sonnet-4.5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""Analyze this production incident:

Monitor: {monitor['name']}
Alert: {monitor['message']}
State: {monitor['overall_state']}

Metrics (last hour):
{self.format_metrics(metrics)}

Recent Events:
{self.format_events(events)}

Provide:
1. Root cause analysis
2. Immediate mitigation steps
3. Long-term prevention measures
4. Related incidents to investigate"""
            }]
        )
        
        return analysis.content[0].text
```

### Prometheus Integration

**Alert Rule Generation:**
```python
# tools/prometheus_claude_rules.py
from anthropic import Anthropic
import yaml

class PrometheusRuleGenerator:
    def __init__(self):
        self.claude = Anthropic()
    
    def generate_rules(self, service_spec):
        """Generate Prometheus alerting rules for a service"""
        
        response = self.claude.messages.create(
            model="claude-sonnet-4.5",
            max_tokens=4096,
            messages=[{
                "role": "user",
                "content": f"""Generate Prometheus alerting rules for this service:

Service: {service_spec['name']}
Type: {service_spec['type']}
SLOs: {service_spec['slos']}

Generate rules for:
1. Error rate thresholds
2. Latency percentiles
3. Resource utilization
4. Dependency failures

Format as Prometheus YAML."""
            }]
        )
        
        # Parse and validate the generated YAML
        rules = yaml.safe_load(response.content[0].text)
        return self.validate_rules(rules)
```

## Custom Tool Development

### Building a Custom Claude Tool

**Tool Specification:**
```typescript
// tools/custom-deployment-tool.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class DeploymentTool {
  private claude: Anthropic;
  
  constructor(apiKey: string) {
    this.claude = new Anthropic({ apiKey });
  }
  
  /**
   * Intelligent deployment with pre-flight checks
   */
  async deploy(service: string, version: string, environment: string) {
    // Step 1: Pre-flight analysis
    const analysis = await this.analyzeDeployment(service, version, environment);
    
    if (analysis.risks.high.length > 0) {
      throw new Error(`High risk deployment: ${analysis.risks.high.join(', ')}`);
    }
    
    // Step 2: Generate deployment plan
    const plan = await this.generateDeploymentPlan(service, version, environment);
    
    // Step 3: Execute deployment
    await this.executePlan(plan);
    
    // Step 4: Post-deployment verification
    await this.verifyDeployment(service, environment);
    
    return {
      success: true,
      plan,
      verification: await this.getVerificationResults()
    };
  }
  
  private async analyzeDeployment(
    service: string,
    version: string,
    environment: string
  ) {
    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4.5',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Analyze this deployment for risks:

Service: ${service}
Version: ${version}
Environment: ${environment}

Check:
1. Recent incidents in target environment
2. Dependency compatibility
3. Breaking changes in version
4. Traffic patterns and timing
5. Rollback readiness

Provide risk assessment (high/medium/low) with details.`
      }]
    });
    
    return this.parseRiskAnalysis(message.content[0].text);
  }
  
  private async generateDeploymentPlan(
    service: string,
    version: string,
    environment: string
  ) {
    const message = await this.claude.messages.create({
      model: 'claude-sonnet-4.5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Generate a deployment plan:

Service: ${service}
Version: ${version}
Environment: ${environment}

Include:
1. Pre-deployment checks
2. Deployment steps (with rollback points)
3. Health check commands
4. Success criteria
5. Rollback procedure

Format as executable shell commands.`
      }]
    });
    
    return this.parsePlan(message.content[0].text);
  }
}
```

**Usage:**
```typescript
const tool = new DeploymentTool(process.env.CLAUDE_API_KEY);

await tool.deploy('checkout-service', 'v2.1.0', 'production');
```

### Tool Registration

**MCP Tool Definition:**
```typescript
// mcp-tools/deployment-tool.ts
import { Tool } from '@modelcontextprotocol/sdk';

export const deploymentTool: Tool = {
  name: 'deploy_service',
  description: 'Deploy a service with intelligent pre-flight checks and verification',
  inputSchema: {
    type: 'object',
    properties: {
      service: {
        type: 'string',
        description: 'Service name to deploy'
      },
      version: {
        type: 'string',
        description: 'Version to deploy (semver)'
      },
      environment: {
        type: 'string',
        enum: ['development', 'staging', 'production'],
        description: 'Target environment'
      }
    },
    required: ['service', 'version', 'environment']
  },
  execute: async (params) => {
    const tool = new DeploymentTool(process.env.CLAUDE_API_KEY);
    return await tool.deploy(params.service, params.version, params.environment);
  }
};
```

## Best Practices

### 1. Error Handling

```typescript
async function callToolWithRetry(tool, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await tool.execute(params);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 2. Caching Results

```typescript
class CachedTool {
  private cache = new Map();
  
  async execute(params) {
    const key = JSON.stringify(params);
    
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const result = await this.actualExecute(params);
    this.cache.set(key, result);
    
    // Cache expiration
    setTimeout(() => this.cache.delete(key), 5 * 60 * 1000);
    
    return result;
  }
}
```

### 3. Rate Limiting

```typescript
class RateLimitedTool {
  private queue: Promise<any>[] = [];
  private maxConcurrent = 5;
  
  async execute(params) {
    while (this.queue.length >= this.maxConcurrent) {
      await Promise.race(this.queue);
    }
    
    const promise = this.actualExecute(params);
    this.queue.push(promise);
    
    promise.finally(() => {
      const index = this.queue.indexOf(promise);
      if (index > -1) this.queue.splice(index, 1);
    });
    
    return promise;
  }
}
```

### 4. Logging and Observability

```typescript
class ObservableTool {
  async execute(params) {
    const startTime = Date.now();
    const traceId = generateTraceId();
    
    logger.info('Tool execution started', {
      traceId,
      tool: this.name,
      params
    });
    
    try {
      const result = await this.actualExecute(params);
      
      logger.info('Tool execution completed', {
        traceId,
        duration: Date.now() - startTime,
        success: true
      });
      
      return result;
    } catch (error) {
      logger.error('Tool execution failed', {
        traceId,
        duration: Date.now() - startTime,
        error: error.message
      });
      
      throw error;
    }
  }
}
```

## Next Steps

You now understand how to integrate Claude with your development toolchain. In the next section, **IDE Integrations**, you'll learn:

- Setting up Claude in VS Code, JetBrains IDEs
- Custom IDE extensions
- Inline AI assistance
- Context-aware code completions

This will bring Claude's capabilities directly into your development environment for maximum productivity.
