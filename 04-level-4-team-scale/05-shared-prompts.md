# Building Team Prompt Libraries

## Introduction to Shared Prompt Libraries

A team prompt library is a curated collection of reusable, tested prompts that encode team expertise and best practices. Unlike individual prompt collections, shared libraries are collaboratively maintained, systematically organized, and designed for consistent use across the entire team.

Prompt libraries serve multiple critical functions: they standardize how teams interact with AI, capture expert knowledge in reusable form, accelerate onboarding, ensure quality and consistency, and enable continuous improvement through collective learning.

## The Business Case for Prompt Libraries

Organizations that implement shared prompt libraries typically realize significant benefits:

**Productivity Gains**: Engineers spend less time crafting prompts and more time on value delivery. Well-tested prompts produce better results faster, reducing iteration cycles.

**Quality Consistency**: All team members benefit from expert-crafted prompts, regardless of their AI proficiency. This eliminates the quality variance between AI power users and novices.

**Knowledge Preservation**: Expert techniques get captured in prompt form rather than remaining tacit knowledge. When experts leave, their expertise remains accessible.

**Faster Onboarding**: New team members immediately access battle-tested prompts that embody team standards and patterns. Time-to-productivity decreases dramatically.

**Continuous Improvement**: Teams can systematically test, measure, and refine prompts. Improvements benefit everyone immediately.

**Reduced Risk**: Prompts can encode security requirements, compliance checks, and quality gates, ensuring consistent application across all AI interactions.

## Anatomy of a Library Prompt

Effective library prompts have five key components:

### 1. Metadata and Classification

Information that helps users find and understand the prompt:

```yaml
---
id: rest-endpoint-complete-v2
name: "Generate Complete REST Endpoint"
category: api-development
subcategory: rest
tags: [python, flask, openapi, testing]
version: 2.1.0
author: engineering-team
created: 2026-01-15
last_updated: 2026-04-20
maturity: stable
usage_count: 347
avg_rating: 4.7
success_rate: 0.89
---
```

### 2. Purpose and Scope

Clear description of what the prompt does and when to use it:

```markdown
## Purpose
Generates a complete, production-ready REST API endpoint including:
- Controller/handler implementation
- Request/response models with validation
- OpenAPI specification
- Comprehensive test suite
- Error handling
- Documentation

## When to Use
- Creating new REST endpoints
- Ensuring consistency with team API standards
- Generating boilerplate for rapid prototyping

## When NOT to Use
- Modifying existing endpoints (use `rest-endpoint-modify` instead)
- GraphQL APIs (use `graphql-resolver` instead)
- Non-standard API patterns
```

### 3. Parameters and Inputs

Definition of required and optional inputs:

```yaml
parameters:
  required:
    service_name:
      type: string
      description: "Name of the service containing the endpoint"
      example: "order-service"
    
    resource:
      type: string
      description: "Resource being exposed (singular noun)"
      example: "order"
      pattern: "^[a-z][a-z0-9-]*$"
    
    operation:
      type: string
      description: "HTTP method and action"
      example: "POST create"
      enum: ["GET list", "GET retrieve", "POST create", "PUT update", "PATCH partial-update", "DELETE delete"]
    
    description:
      type: string
      description: "Business purpose of the endpoint"
      example: "Create a new customer order"
  
  optional:
    request_schema:
      type: object
      description: "Request body schema (JSON Schema format)"
    
    response_schema:
      type: object
      description: "Response body schema (JSON Schema format)"
    
    query_params:
      type: array
      description: "Query parameter specifications"
    
    auth_required:
      type: boolean
      default: true
      description: "Whether authentication is required"
```

### 4. Prompt Template

The actual prompt with variable interpolation:

```markdown
## Prompt Template

Generate a complete REST API endpoint following our team standards.

### Service Context
Service: {{service_name}}
Resource: {{resource}}
Operation: {{operation}}
Purpose: {{description}}

### Requirements
{{#if request_schema}}
Request Schema:
```json
{{request_schema}}
```
{{/if}}

{{#if response_schema}}
Response Schema:
```json
{{response_schema}}
```
{{/if}}

{{#if query_params}}
Query Parameters:
{{#each query_params}}
- {{name}} ({{type}}): {{description}}{{#if required}} [required]{{/if}}
{{/each}}
{{/if}}

### Team Standards
{{include: standards/api-design.md}}
{{include: standards/error-handling.md}}
{{include: standards/testing.md}}

### Reference Example
{{include: examples/reference-endpoint.py}}

### Generate

Create complete implementation including:

1. **Controller/Handler** ({{service_name}}/controllers/{{resource}}_controller.py)
   - Route definition following URL pattern: /api/v1/{{resource}}
   - Input validation using Pydantic models
   - Business logic invocation
   - Response formatting
   - Error handling with standard error format
   - OpenAPI annotations

2. **Request/Response Models** ({{service_name}}/models/{{resource}}_models.py)
   - DTOs with complete validation
   - Field-level documentation
   - Example values
   - Serialization logic

3. **Service Layer** ({{service_name}}/services/{{resource}}_service.py)
   - Business logic implementation
   - Data access
   - Transaction management
   - Domain model interaction

4. **Tests** (tests/{{service_name}}/test_{{resource}}_endpoint.py)
   - Unit tests for service logic
   - Integration tests for endpoint
   - Edge case coverage
   - Minimum 85% coverage
   - Test fixtures and helpers

5. **OpenAPI Specification Update**
   - Add endpoint documentation
   - Include request/response schemas
   - Document error responses
   - Provide usage examples

### Quality Requirements

Ensure implementation:
- Follows team Python style guide (Black formatting, type hints)
- Uses standard error codes and messages
- Includes comprehensive logging
- Handles all edge cases
- Validates all inputs
- Returns appropriate HTTP status codes
- Includes performance considerations
{{#if auth_required}}
- Implements authentication/authorization checks
{{/if}}

### Output Format

For each file:
1. Full file path
2. Complete implementation
3. Brief explanation of key decisions
4. Test coverage notes
```

### 5. Usage Examples and Best Practices

Real examples showing how to use the prompt effectively:

```markdown
## Usage Examples

### Example 1: Simple CRUD Endpoint

**Input:**
```yaml
service_name: order-service
resource: order
operation: POST create
description: Create a new customer order
request_schema:
  type: object
  properties:
    customer_id:
      type: string
      format: uuid
    items:
      type: array
      items:
        type: object
        properties:
          product_id:
            type: string
          quantity:
            type: integer
auth_required: true
```

**Result:** Complete endpoint implementation with order creation logic, validation, tests.

### Example 2: List Endpoint with Filtering

**Input:**
```yaml
service_name: catalog-service
resource: product
operation: GET list
description: List products with filtering and pagination
query_params:
  - name: category
    type: string
    required: false
  - name: min_price
    type: number
    required: false
  - name: limit
    type: integer
    required: false
  - name: offset
    type: integer
    required: false
```

**Result:** List endpoint with query param handling, filtering, pagination.

## Best Practices

### Customization
- Review generated code before committing
- Adjust business logic to match specific requirements
- Add domain-specific validation rules

### Common Issues
- **Issue:** Generated tests don't cover edge case X
  **Solution:** Add explicit edge case in prompt or manually enhance tests

- **Issue:** Error handling doesn't match specific service needs
  **Solution:** Customize error handling section or use service-specific template

### Integration
1. Run generated tests: `pytest tests/{{service_name}}/test_{{resource}}_endpoint.py`
2. Review OpenAPI spec: `http://localhost:8000/docs`
3. Test manually with curl/Postman
4. Create PR and request review
```

## Organizing Your Prompt Library

### Directory Structure

```
team-prompts/
├── README.md                          # Library overview
├── index.yaml                         # Master index
├── api-development/
│   ├── rest/
│   │   ├── endpoint-complete.md      # Complete endpoint generation
│   │   ├── endpoint-modify.md        # Modify existing endpoint
│   │   ├── endpoint-test.md          # Add tests to endpoint
│   │   └── openapi-spec.md           # Generate/update OpenAPI spec
│   ├── graphql/
│   │   ├── resolver-create.md
│   │   └── schema-update.md
│   └── grpc/
│       ├── service-create.md
│       └── proto-update.md
├── database/
│   ├── migration-create.md
│   ├── model-generate.md
│   └── query-optimize.md
├── testing/
│   ├── unit-test-generate.md
│   ├── integration-test-generate.md
│   ├── e2e-test-generate.md
│   └── test-data-create.md
├── code-quality/
│   ├── refactor-suggest.md
│   ├── code-review.md
│   └── security-scan.md
├── documentation/
│   ├── readme-generate.md
│   ├── api-docs-generate.md
│   └── architecture-doc.md
└── troubleshooting/
    ├── debug-issue.md
    ├── performance-analyze.md
    └── error-investigate.md
```

### Master Index

```yaml
# index.yaml
library:
  name: "Engineering Team Prompt Library"
  version: "1.0.0"
  last_updated: "2026-05-05"
  
categories:
  api-development:
    description: "API design and implementation"
    subcategories:
      rest: "REST API development"
      graphql: "GraphQL API development"
      grpc: "gRPC service development"
  
  database:
    description: "Database design and operations"
  
  testing:
    description: "Test generation and quality assurance"
  
  code-quality:
    description: "Code review and improvement"
  
  documentation:
    description: "Technical documentation"
  
  troubleshooting:
    description: "Debugging and problem solving"

prompts:
  - id: rest-endpoint-complete
    file: api-development/rest/endpoint-complete.md
    name: "Generate Complete REST Endpoint"
    category: api-development
    subcategory: rest
    maturity: stable
    tags: [python, rest, api, testing]
    
  - id: database-migration-create
    file: database/migration-create.md
    name: "Create Database Migration"
    category: database
    maturity: stable
    tags: [database, migration, sql]
```

## Building Prompts Collaboratively

### Contribution Workflow

```markdown
# CONTRIBUTING.md

## Adding a New Prompt

1. **Check if prompt already exists**
   - Search the library
   - Ask in #team-ai-prompts channel

2. **Create prompt using template**
   - Copy `templates/prompt-template.md`
   - Fill in all sections
   - Add realistic examples

3. **Test thoroughly**
   - Use prompt on at least 3 real scenarios
   - Document results
   - Measure success rate

4. **Submit for review**
   - Create PR with prompt
   - Include test results
   - Request reviews from 2+ team members

5. **Iterate based on feedback**
   - Address reviewer comments
   - Update examples
   - Refine prompt based on testing

## Improving Existing Prompts

1. **Document the issue**
   - What's not working?
   - What's the desired behavior?
   - Example where prompt falls short

2. **Propose improvement**
   - Create branch
   - Modify prompt
   - Test improvement

3. **Version appropriately**
   - Patch version for bug fixes
   - Minor version for enhancements
   - Major version for breaking changes

4. **Update documentation**
   - Changelog entry
   - Updated examples
   - Migration guide if breaking
```

### Review Criteria

```yaml
review_checklist:
  metadata:
    - Complete and accurate metadata
    - Appropriate category and tags
    - Clear version number
  
  purpose:
    - Clear purpose statement
    - Well-defined scope
    - Guidance on when to use
    - Guidance on when NOT to use
  
  parameters:
    - All parameters documented
    - Types and constraints specified
    - Examples provided
    - Defaults defined for optional params
  
  prompt:
    - Clear and unambiguous instructions
    - Properly references team context
    - Includes quality requirements
    - Specifies output format
  
  examples:
    - At least 2 realistic examples
    - Show different use cases
    - Include expected outputs
    - Document common issues
  
  testing:
    - Tested on multiple scenarios
    - Success rate documented
    - Edge cases considered
    - Performance acceptable
```

## Prompt Library Tools

### Discovery and Search

```python
class PromptLibrary:
    """Interface to team prompt library"""
    
    def __init__(self, library_path="team-prompts"):
        self.library_path = Path(library_path)
        self.index = self.load_index()
    
    def search(self, query, filters=None):
        """Search prompts by query and filters"""
        results = []
        
        # Full-text search
        for prompt in self.index['prompts']:
            if self.matches_query(prompt, query):
                results.append(prompt)
        
        # Apply filters
        if filters:
            results = self.apply_filters(results, filters)
        
        # Rank by relevance and quality
        results = self.rank_results(results, query)
        
        return results
    
    def get_prompt(self, prompt_id):
        """Retrieve a specific prompt by ID"""
        prompt_meta = self.index['prompts'].get(prompt_id)
        if not prompt_meta:
            raise ValueError(f"Prompt {prompt_id} not found")
        
        # Load full prompt
        prompt_path = self.library_path / prompt_meta['file']
        return Prompt.load(prompt_path)
    
    def get_by_category(self, category, subcategory=None):
        """Get all prompts in a category"""
        prompts = [
            p for p in self.index['prompts']
            if p['category'] == category
        ]
        
        if subcategory:
            prompts = [
                p for p in prompts
                if p.get('subcategory') == subcategory
            ]
        
        return prompts
    
    def get_popular(self, limit=10):
        """Get most-used prompts"""
        return sorted(
            self.index['prompts'],
            key=lambda p: p.get('usage_count', 0),
            reverse=True
        )[:limit]
    
    def get_recommended(self, context):
        """Get prompts recommended for current context"""
        # Analyze context
        file_type = self.detect_file_type(context.get('current_file'))
        task_type = self.infer_task_type(context.get('task_description'))
        
        # Find matching prompts
        candidates = self.search(
            query=task_type,
            filters={'tags': [file_type]}
        )
        
        return candidates[:5]
```

### Execution Engine

```python
class PromptExecutor:
    """Execute prompts with parameter interpolation"""
    
    def __init__(self, library, ai_client):
        self.library = library
        self.ai_client = ai_client
    
    def execute(self, prompt_id, parameters, context=None):
        """Execute a prompt with given parameters"""
        # Load prompt
        prompt = self.library.get_prompt(prompt_id)
        
        # Validate parameters
        self.validate_parameters(prompt, parameters)
        
        # Interpolate template
        rendered_prompt = self.render_prompt(prompt, parameters, context)
        
        # Execute with AI
        result = self.ai_client.execute(rendered_prompt)
        
        # Validate output
        validation = self.validate_output(prompt, result)
        
        # Track usage
        self.track_usage(prompt_id, parameters, result, validation)
        
        return {
            'output': result,
            'validation': validation,
            'metadata': {
                'prompt_id': prompt_id,
                'prompt_version': prompt.version,
                'timestamp': datetime.now()
            }
        }
    
    def render_prompt(self, prompt, parameters, context):
        """Render prompt template with parameters and context"""
        template = prompt.template
        
        # Interpolate parameters
        for key, value in parameters.items():
            template = template.replace(f"{{{{{key}}}}}", str(value))
        
        # Include context files
        template = self.include_context_files(template, context)
        
        # Handle conditionals
        template = self.process_conditionals(template, parameters)
        
        return template
    
    def validate_output(self, prompt, output):
        """Validate AI output against prompt requirements"""
        issues = []
        
        # Check required outputs present
        for required in prompt.required_outputs:
            if required not in output:
                issues.append(f"Missing required output: {required}")
        
        # Run custom validators
        for validator in prompt.validators:
            result = validator.validate(output)
            if not result.passed:
                issues.append(result.message)
        
        return {
            'passed': len(issues) == 0,
            'issues': issues
        }
```

### Metrics and Analytics

```python
class PromptAnalytics:
    """Track and analyze prompt usage and effectiveness"""
    
    def __init__(self, db):
        self.db = db
    
    def track_usage(self, prompt_id, parameters, output, validation):
        """Record prompt usage"""
        self.db.insert('prompt_usage', {
            'prompt_id': prompt_id,
            'parameters': json.dumps(parameters),
            'success': validation['passed'],
            'timestamp': datetime.now(),
            'user': self.get_current_user()
        })
    
    def get_effectiveness(self, prompt_id, days=30):
        """Calculate prompt effectiveness metrics"""
        usage = self.db.query(f"""
            SELECT 
                COUNT(*) as total_uses,
                SUM(CASE WHEN success THEN 1 ELSE 0 END) as successes,
                AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
                COUNT(DISTINCT user) as unique_users
            FROM prompt_usage
            WHERE prompt_id = '{prompt_id}'
            AND timestamp > NOW() - INTERVAL '{days} days'
        """)
        
        return usage
    
    def get_trending(self, days=7):
        """Get prompts with increasing usage"""
        return self.db.query(f"""
            WITH weekly AS (
                SELECT 
                    prompt_id,
                    EXTRACT(WEEK FROM timestamp) as week,
                    COUNT(*) as uses
                FROM prompt_usage
                WHERE timestamp > NOW() - INTERVAL '{days*2} days'
                GROUP BY prompt_id, week
            )
            SELECT 
                prompt_id,
                MAX(uses) - MIN(uses) as growth
            FROM weekly
            GROUP BY prompt_id
            HAVING MAX(uses) - MIN(uses) > 0
            ORDER BY growth DESC
            LIMIT 10
        """)
    
    def identify_gaps(self):
        """Identify common tasks without good prompts"""
        # Find failed executions
        failures = self.db.query("""
            SELECT prompt_id, parameters
            FROM prompt_usage
            WHERE success = FALSE
            AND timestamp > NOW() - INTERVAL '30 days'
        """)
        
        # Analyze patterns
        prompt = f"""
        Analyze these prompt failures to identify gaps in our library:
        
        {failures}
        
        For each pattern:
        - What task were users trying to accomplish?
        - Why did existing prompts fail?
        - What new prompt should we create?
        - What improvements to existing prompts would help?
        """
        
        return self.ai_client.execute(prompt)
```

## Advanced Library Features

### Prompt Chains

Combine multiple prompts into workflows:

```yaml
# prompt-chains/implement-feature.yaml
chain:
  name: "Implement Complete Feature"
  description: "End-to-end feature implementation"
  
  steps:
    - prompt: database-migration-create
      inputs:
        table_name: "{{feature_table}}"
        columns: "{{table_schema}}"
      output_var: migration
    
    - prompt: domain-model-generate
      inputs:
        entity: "{{feature_entity}}"
        schema: "{{migration.schema}}"
      output_var: model
    
    - prompt: rest-endpoint-complete
      inputs:
        resource: "{{feature_entity}}"
        operation: "{{endpoint_operation}}"
      output_var: endpoint
    
    - prompt: integration-test-generate
      inputs:
        endpoint: "{{endpoint.path}}"
        scenarios: "{{test_scenarios}}"
      output_var: tests
```

### Versioned Prompt Sets

Maintain multiple versions for gradual rollout:

```yaml
prompt_sets:
  stable:
    api-development/rest/endpoint-complete: "2.1.0"
    database/migration-create: "1.5.0"
    testing/unit-test-generate: "3.0.0"
  
  beta:
    api-development/rest/endpoint-complete: "2.2.0-beta.1"
    database/migration-create: "1.5.0"
    testing/unit-test-generate: "3.1.0-beta.2"
  
  experimental:
    api-development/rest/endpoint-complete: "3.0.0-alpha.1"
    database/migration-create: "2.0.0-alpha.1"
    testing/unit-test-generate: "3.1.0-beta.2"
```

### A/B Testing Framework

Compare prompt variants:

```python
class PromptABTest:
    """A/B test different prompt versions"""
    
    def __init__(self, prompt_id, variant_a, variant_b):
        self.prompt_id = prompt_id
        self.variant_a = variant_a
        self.variant_b = variant_b
        self.assignment_rate = 0.5  # 50/50 split
    
    def execute(self, parameters):
        """Execute assigned variant"""
        variant = self.assign_variant()
        
        result = self.executor.execute(
            f"{self.prompt_id}:{variant}",
            parameters
        )
        
        self.track_result(variant, result)
        
        return result
    
    def analyze_results(self):
        """Compare variant performance"""
        results_a = self.get_results('variant_a')
        results_b = self.get_results('variant_b')
        
        comparison = {
            'success_rate': {
                'variant_a': results_a['success_rate'],
                'variant_b': results_b['success_rate'],
                'difference': results_b['success_rate'] - results_a['success_rate']
            },
            'avg_execution_time': {
                'variant_a': results_a['avg_time'],
                'variant_b': results_b['avg_time']
            },
            'user_satisfaction': {
                'variant_a': results_a['avg_rating'],
                'variant_b': results_b['avg_rating']
            }
        }
        
        # Statistical significance test
        comparison['significant'] = self.test_significance(
            results_a, results_b
        )
        
        return comparison
```

## Conclusion

Shared prompt libraries are essential infrastructure for team-scale AI usage. They standardize interactions, capture expertise, ensure quality, and enable continuous improvement. Building an effective library requires:

- Clear organization and classification
- Comprehensive documentation
- Collaborative contribution processes
- Usage tracking and analytics
- Continuous refinement

Teams that invest in prompt libraries typically see:
- 40-60% reduction in prompt engineering time
- 50-70% improvement in output quality consistency
- 30-50% faster onboarding for new team members
- 20-40% increase in AI adoption rates

Start small with your team's most common tasks. Build prompts collaboratively. Measure effectiveness. Refine based on usage patterns. Over time, your library becomes a strategic asset that compounds team capabilities.

In the next section, we'll explore how to create custom workflow plugins that integrate prompt libraries, shared context, and team tooling into seamless, automated processes.
