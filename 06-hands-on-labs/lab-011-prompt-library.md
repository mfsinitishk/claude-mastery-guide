# Lab 011: Building a Team Prompt Library

## Learning Objectives

- Create reusable prompt templates
- Organize prompts by category and use case
- Share prompts across team
- Version and improve prompts over time
- Measure prompt effectiveness

## Prerequisites

- Completion of Lab 001 (Basic Prompting)
- Understanding of your team's common tasks
- 45 minutes to complete

## Exercise 1: Prompt Collection and Categorization (15 minutes)

### Identify Common Use Cases

```
Analyze our team's common Claude interactions and categorize them:

Common tasks:
- Code reviews
- Bug investigation
- Feature implementation
- Documentation generation
- Test writing
- Refactoring
- API design
- Database queries

For each category, identify:
1. Most frequent prompts
2. Variations in approach
3. Success patterns
4. Areas for standardization
```

### Create Prompt Template Structure

```markdown
# Prompt Template Format

## Template ID: [unique-id]
## Category: [code-review | debugging | documentation | etc.]
## Version: [semver]
## Author: [name]
## Last Updated: [date]

### Purpose
[What this prompt accomplishes]

### When to Use
[Scenarios where this prompt is appropriate]

### Prerequisites
[What information/context is needed]

### Prompt Template
```
[The actual prompt with {{placeholders}}]
```

### Example Usage
```
[Filled-in example]
```

### Expected Output
[What kind of response to expect]

### Tips
- [Tip 1]
- [Tip 2]

### Related Templates
- [Template ID]
```

## Exercise 2: Create Core Prompt Library (20 minutes)

### Code Review Template

```markdown
# Template ID: code-review-feature
# Category: code-review
# Version: 1.0.0

### Purpose
Comprehensive code review for feature PRs

### Prompt Template
```
Review this pull request for a new feature:

**Feature**: {{feature_name}}
**Files Changed**: {{file_count}} files

**Changes**:
{{git_diff}}

**Review Criteria**:
1. Code Quality
   - SOLID principles
   - Naming conventions
   - Code organization
   
2. Security
   - Input validation
   - Authentication/authorization
   - Data exposure
   
3. Performance
   - Database queries
   - Algorithm efficiency
   - Caching opportunities
   
4. Testing
   - Test coverage
   - Edge cases
   - Integration tests
   
5. Documentation
   - API documentation
   - Inline comments
   - README updates

For each issue found:
- **Severity**: Critical | High | Medium | Low
- **File:Line**: Location
- **Issue**: Description
- **Recommendation**: How to fix
- **Example**: Code sample

Provide:
1. Overall assessment
2. Critical issues (blocking)
3. Recommendations (non-blocking)
4. Positive observations
```

### Example Usage
```
Review this pull request for a new feature:

**Feature**: User Profile Management
**Files Changed**: 8 files

**Changes**:
[paste git diff]

[rest of template filled in]
```
```

### Bug Investigation Template

```markdown
# Template ID: debug-production-issue
# Category: debugging
# Version: 1.0.0

### Prompt Template
```
Help debug this production issue:

**Symptom**: {{error_description}}
**Frequency**: {{frequency}}
**Environment**: {{environment}}
**First Occurred**: {{timestamp}}

**Error Message**:
```
{{error_message}}
```

**Stack Trace**:
```
{{stack_trace}}
```

**Related Logs**:
```
{{logs}}
```

**Recent Changes**:
{{recent_deployments}}

**Analysis Needed**:
1. Root cause identification
2. Immediate mitigation steps
3. Long-term fix recommendations
4. Prevention strategies
5. Monitoring improvements

Provide:
- Hypothesis for root cause
- Step-by-step debugging approach
- Queries to run / logs to check
- Quick fix if available
- Permanent solution design
```
```

### Test Generation Template

```markdown
# Template ID: generate-tests
# Category: testing
# Version: 1.0.0

### Prompt Template
```
Generate comprehensive tests for this code:

**File**: {{file_path}}
**Code**:
```{{language}}
{{code}}
```

**Requirements**:
1. Framework: {{test_framework}}
2. Coverage Target: {{coverage_percentage}}%
3. Include:
   - Happy path scenarios
   - Edge cases
   - Error conditions
   - Boundary values
   - Integration scenarios

**Output Format**:
- Test file with descriptive test names
- Setup/teardown as needed
- Mocks for dependencies
- Assertions with clear messages
- Comments explaining complex test logic

Generate tests that would catch:
- Logic errors
- Type errors
- Null/undefined handling
- Async issues
- Integration problems
```
```

### Documentation Template

```markdown
# Template ID: api-documentation
# Category: documentation
# Version: 1.0.0

### Prompt Template
```
Generate API documentation for these endpoints:

**Service**: {{service_name}}
**Base URL**: {{base_url}}

**Endpoints**:
{{endpoint_list}}

**Code**:
```{{language}}
{{implementation_code}}
```

**Generate**:
1. OpenAPI 3.0 specification
2. Endpoint descriptions
3. Request/response examples
4. Error responses
5. Authentication requirements
6. Rate limiting info
7. Code examples in curl, JavaScript, Python

**Format**: Markdown with code blocks

Include:
- Overview of service purpose
- Authentication guide
- Common use cases
- Error handling guide
- Best practices
```
```

## Exercise 3: Prompt Library Management (10 minutes)

### Version Control for Prompts

```bash
# prompts/
├── README.md
├── CHANGELOG.md
├── templates/
│   ├── code-review/
│   │   ├── feature-pr.md
│   │   ├── bug-fix-pr.md
│   │   └── refactoring-pr.md
│   ├── debugging/
│   │   ├── production-issue.md
│   │   ├── performance-issue.md
│   │   └── memory-leak.md
│   ├── testing/
│   │   ├── unit-tests.md
│   │   ├── integration-tests.md
│   │   └── e2e-tests.md
│   └── documentation/
│       ├── api-docs.md
│       ├── architecture.md
│       └── onboarding.md
├── examples/
│   └── [example-outputs]
└── metrics/
    └── usage-stats.json
```

### Prompt CLI Tool

```javascript
// prompt-cli.js
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class PromptLibrary {
  constructor(libraryPath = './prompts/templates') {
    this.libraryPath = libraryPath;
  }
  
  list(category = null) {
    const templates = this.loadAllTemplates();
    
    if (category) {
      return templates.filter(t => t.category === category);
    }
    
    return templates;
  }
  
  get(templateId) {
    const templates = this.loadAllTemplates();
    return templates.find(t => t.id === templateId);
  }
  
  fill(templateId, variables) {
    const template = this.get(templateId);
    
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    let prompt = template.content;
    
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    
    return prompt;
  }
  
  add(template) {
    const filePath = path.join(
      this.libraryPath,
      template.category,
      `${template.id}.md`
    );
    
    fs.writeFileSync(filePath, this.formatTemplate(template));
    this.recordUsage(template.id, 'created');
  }
  
  recordUsage(templateId, action) {
    const statsPath = './prompts/metrics/usage-stats.json';
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8') || '{}');
    
    if (!stats[templateId]) {
      stats[templateId] = { uses: 0, created: new Date() };
    }
    
    stats[templateId].uses++;
    stats[templateId].lastUsed = new Date();
    
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  }
}

// CLI interface
const command = process.argv[2];
const library = new PromptLibrary();

switch (command) {
  case 'list':
    console.log(library.list());
    break;
    
  case 'get':
    const template = library.get(process.argv[3]);
    console.log(template.content);
    break;
    
  case 'fill':
    const filled = library.fill(
      process.argv[3],
      JSON.parse(process.argv[4])
    );
    console.log(filled);
    break;
    
  default:
    console.log('Usage: prompt-cli [list|get|fill] [args]');
}
```

### Usage Tracking

```javascript
// Track which prompts are most valuable
{
  "code-review-feature": {
    "uses": 234,
    "created": "2026-01-15",
    "lastUsed": "2026-05-05",
    "avgSatisfaction": 4.5,
    "improvements": 3
  },
  "debug-production-issue": {
    "uses": 89,
    "created": "2026-02-01",
    "lastUsed": "2026-05-04",
    "avgSatisfaction": 4.8,
    "improvements": 1
  }
}
```

## Common Issues

### Prompts Too Generic

```
Solution:
1. Add more specific placeholders
2. Include domain context
3. Provide example outputs
4. Iterate based on usage
```

### Hard to Find Right Prompt

```
Solution:
1. Clear categorization
2. Searchable tags
3. CLI tool with search
4. Documentation with examples
```

## Extensions

### Extension 1: Prompt Analytics

Track:
- Usage frequency
- Success rate
- Time saved
- Quality metrics
- User feedback

### Extension 2: Team Sharing

Implement:
- Centralized repository
- Review process for new prompts
- Version control
- Contribution guidelines

### Extension 3: IDE Integration

Create plugins for:
- VS Code
- IntelliJ
- Vim
- Quick prompt insertion

## Summary

You've learned to:
- Create reusable prompt templates
- Organize prompts systematically
- Build CLI tools for prompt management
- Track prompt effectiveness
- Share prompts across team

## Next Steps

1. Build prompt library for your team
2. Establish contribution process
3. Measure and improve prompts
4. Proceed to Lab 012: AI Governance

---

**Lab Completion**: You now have a systematic approach to building and managing a team prompt library.
