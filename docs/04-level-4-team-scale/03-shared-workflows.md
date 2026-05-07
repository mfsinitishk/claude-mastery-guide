# Creating Shared Team Workflows

## Introduction to Shared Workflows

Shared workflows represent the codification of team best practices into reusable, AI-powered processes that any team member can execute consistently. While individual engineers may develop personal AI workflows, shared workflows ensure that the entire team benefits from collective expertise and maintains consistency across all work.

A shared workflow is more than a template or prompt; it's a complete, executable process that combines prompts, context, validation, and output formatting into a cohesive unit that delivers predictable results regardless of who invokes it.

## The Value of Workflow Standardization

Organizations that successfully implement shared workflows typically see:

**Consistency**: All team members produce similar quality output following the same standards, regardless of experience level or expertise in the specific domain.

**Velocity**: Engineers spend less time figuring out how to approach routine tasks and more time delivering value. New team members reach productivity faster.

**Knowledge Capture**: Senior engineers' expertise gets encoded into workflows, making their knowledge accessible to the entire team without creating bottlenecks.

**Quality Gates**: Workflows can enforce quality checks, security scans, and compliance requirements automatically, reducing the likelihood of defects or policy violations.

**Measurability**: Standardized workflows produce consistent metrics, enabling organizations to measure productivity, identify bottlenecks, and optimize processes.

Consider a typical team workflow: creating a new microservice. Without standardization, different engineers might:
- Use different project structures
- Apply inconsistent naming conventions
- Include varying levels of observability
- Implement different error handling patterns
- Create incompatible API designs
- Miss security requirements

A shared workflow ensures every new microservice follows team standards from the start.

## Anatomy of an Effective Shared Workflow

Effective shared workflows have five core components:

### 1. Input Specification

Clear definition of what information the workflow needs to execute successfully.

**Example: New Microservice Workflow Input**
```yaml
workflow: create-microservice
inputs:
  required:
    - service_name: "Name of the service (kebab-case)"
    - domain: "Business domain (catalog/payments/identity)"
    - owner_team: "Owning team identifier"
    - purpose: "One-sentence service description"
  
  optional:
    - data_stores: "Required data stores (postgres/redis/elasticsearch)"
    - external_deps: "External service dependencies"
    - auth_requirements: "Authentication/authorization needs"
    - slo_target: "Service level objective (default: 99.9%)"
```

### 2. Context Assembly

Gathering and organizing all relevant context the AI needs to execute the workflow properly.

**Context Sources**:
- **Team Standards**: Coding conventions, architecture patterns, technology choices
- **Organizational Policies**: Security requirements, compliance rules, operational standards
- **Domain Knowledge**: Business rules, domain models, integration patterns
- **Technical Constraints**: Infrastructure capabilities, performance requirements, scale considerations
- **Historical Patterns**: Previous successful implementations, lessons learned

**Example Context Assembly**:
```
# Context for Microservice Creation

## Team Standards
{load: team-standards/service-structure.md}
{load: team-standards/api-design.md}
{load: team-standards/error-handling.md}

## Domain Patterns
{load: domains/${domain}/patterns.md}
{load: domains/${domain}/common-models.md}

## Infrastructure
{load: infrastructure/service-template.yaml}
{load: infrastructure/observability-requirements.md}

## Examples
{load: examples/reference-service/}
```

### 3. Execution Logic

The actual AI prompts and processing steps that transform inputs and context into outputs.

**Workflow Steps**:
1. Validation: Verify inputs meet requirements
2. Generation: Create core artifacts
3. Enhancement: Add quality improvements
4. Validation: Check outputs against standards
5. Packaging: Organize outputs for delivery

**Example Execution Prompt**:
```
Create a new microservice following our team standards:

Service Definition:
- Name: ${service_name}
- Domain: ${domain}
- Owner: ${owner_team}
- Purpose: ${purpose}

Requirements:
${requirements}

Team Standards:
${team_standards}

Generate:
1. Service structure following our standard layout
2. Core domain models
3. API endpoints with OpenAPI spec
4. Configuration files
5. Docker and Kubernetes manifests
6. Observability instrumentation
7. README with quickstart guide
8. Test structure and examples

Ensure:
- All security requirements satisfied
- Observability hooks in place
- Error handling follows team patterns
- API design follows REST/gRPC standards
- Infrastructure-as-code included
- CI/CD pipeline configuration ready

For each generated file:
- Include file path
- Add explanatory comments
- Follow team coding standards
- Include relevant tests
```

### 4. Quality Validation

Automated checks to ensure workflow outputs meet team quality standards.

**Validation Categories**:
- **Structural**: Files in correct locations, naming conventions followed
- **Syntactic**: Code compiles, configs are valid, no syntax errors
- **Semantic**: Business logic makes sense, patterns applied correctly
- **Standards**: Team conventions followed, required elements present
- **Security**: No obvious vulnerabilities, secrets management correct
- **Completeness**: All required artifacts generated

**Example Validation Checklist**:
```yaml
validations:
  structural:
    - service_directory_exists
    - required_files_present
    - directory_structure_matches_template
  
  syntactic:
    - code_compiles
    - openapi_spec_valid
    - kubernetes_manifests_valid
  
  semantic:
    - api_endpoints_follow_conventions
    - error_codes_in_valid_range
    - metrics_properly_tagged
  
  standards:
    - readme_includes_required_sections
    - dockerfile_follows_template
    - logging_configuration_complete
  
  security:
    - no_hardcoded_secrets
    - authentication_configured
    - tls_enabled
  
  completeness:
    - tests_present
    - documentation_complete
    - deployment_pipeline_configured
```

### 5. Output Formatting

Consistent presentation of workflow results for easy consumption and integration.

**Output Components**:
- **Summary**: High-level overview of what was generated
- **Artifacts**: List of files created with descriptions
- **Next Steps**: What the engineer should do next
- **Review Checklist**: Items to verify before committing
- **Integration Points**: How to integrate with existing systems

## Building Your First Shared Workflow

Let's walk through creating a complete shared workflow for a common team task: implementing a new REST API endpoint.

### Step 1: Define the Workflow Scope

**Workflow Name**: `add-rest-endpoint`

**Purpose**: Generate a complete REST endpoint implementation following team standards

**Success Criteria**:
- Endpoint implements required business logic
- Input validation included
- Error handling follows team patterns
- Tests provide good coverage
- OpenAPI spec updated
- Documentation complete

### Step 2: Specify Inputs

```yaml
workflow: add-rest-endpoint
version: 1.0.0
inputs:
  required:
    service: "Target service name"
    resource: "Resource being exposed (e.g., 'order', 'customer')"
    operation: "HTTP method + action (e.g., 'GET list', 'POST create')"
    description: "Business purpose of the endpoint"
  
  optional:
    query_params: "Query parameter specifications"
    path_params: "Path parameter specifications"
    request_body: "Request body schema"
    response_codes: "Expected HTTP response codes"
    auth_required: "Authentication requirements (default: true)"
```

### Step 3: Create Context Templates

**Team Standards Context**:
```markdown
# REST API Team Standards

## Endpoint Structure
- Base path: /api/v{version}/{resource}
- Version in URL, not header
- Use plural nouns for collections
- Use HTTP methods semantically

## Request/Response Format
- JSON only (content-type: application/json)
- ISO 8601 for dates
- Snake_case for field names
- Include pagination for lists (limit, offset, total)

## Error Handling
- Use standard error response format:
  {
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable message",
      "details": []
    }
  }
- Error codes: [team error code registry]

## Authentication
- JWT bearer tokens
- Include user context in all logs
- Validate permissions before operation

## Validation
- Validate all inputs
- Return 400 with details for validation errors
- Sanitize user inputs

## Testing
- Unit tests for business logic
- Integration tests for endpoint
- Contract tests for API spec
- Minimum 80% coverage
```

### Step 4: Design Execution Prompts

**Main Generation Prompt**:
```
Implement a REST API endpoint following our team standards:

Service: ${service}
Resource: ${resource}
Operation: ${operation}
Description: ${description}

Specifications:
${specifications}

Team Standards:
${team_standards}

Current Service Structure:
${service_structure}

Existing Models:
${existing_models}

Generate complete implementation including:

1. **Controller/Handler**
   - Route definition
   - Input validation
   - Business logic invocation
   - Response formatting
   - Error handling

2. **Service Layer**
   - Business logic implementation
   - Data access
   - Transaction management
   - Domain model interaction

3. **Request/Response Models**
   - DTO definitions
   - Validation rules
   - Serialization logic
   - OpenAPI annotations

4. **Tests**
   - Unit tests for service logic
   - Integration tests for endpoint
   - Test fixtures and helpers
   - Edge case coverage

5. **OpenAPI Specification**
   - Endpoint documentation
   - Request/response schemas
   - Error responses
   - Examples

6. **Documentation**
   - API usage guide
   - Business logic explanation
   - Integration notes
   - Migration guide if needed

For each component:
- Follow team coding standards
- Include comprehensive comments
- Handle all error cases
- Consider performance implications
- Ensure security requirements met
```

**Validation Prompt**:
```
Review the generated endpoint implementation:

Code: ${generated_code}
Tests: ${generated_tests}
Spec: ${openapi_spec}

Team Standards: ${team_standards}

Validate:

1. **Code Quality**
   - Follows team style guide
   - No code smells
   - Proper error handling
   - Appropriate logging
   - Security best practices

2. **Testing**
   - Adequate coverage
   - Tests are meaningful
   - Edge cases included
   - Fixtures are maintainable

3. **API Design**
   - RESTful principles
   - Consistent with existing endpoints
   - Proper HTTP status codes
   - Clear error messages

4. **Documentation**
   - OpenAPI spec complete
   - Examples provided
   - Integration guide clear

5. **Security**
   - Input validation present
   - SQL injection prevention
   - XSS prevention
   - Authorization checks

Report:
- Issues found (critical/major/minor)
- Recommendations for improvement
- Compliance with team standards
- Overall quality score (1-10)
```

### Step 5: Implement Workflow Orchestration

**Workflow Execution Script**:
```python
#!/usr/bin/env python3
"""Shared workflow: Add REST endpoint"""

import sys
import yaml
from pathlib import Path
from workflow_framework import (
    WorkflowBase, 
    InputValidator,
    ContextAssembler,
    AIExecutor,
    OutputValidator,
    ResultFormatter
)

class AddRestEndpointWorkflow(WorkflowBase):
    """Generate a complete REST endpoint implementation"""
    
    def __init__(self):
        super().__init__("add-rest-endpoint", "1.0.0")
    
    def validate_inputs(self, inputs):
        """Validate required inputs are present and well-formed"""
        validator = InputValidator(self.input_schema)
        return validator.validate(inputs)
    
    def assemble_context(self, inputs):
        """Gather all context needed for generation"""
        assembler = ContextAssembler()
        
        # Load team standards
        assembler.add_document("team-standards/rest-api.md")
        assembler.add_document("team-standards/error-handling.md")
        assembler.add_document("team-standards/testing.md")
        
        # Load service-specific context
        service_path = f"services/{inputs['service']}"
        assembler.add_directory(f"{service_path}/src")
        assembler.add_document(f"{service_path}/openapi.yaml")
        
        # Load domain models
        assembler.add_directory(f"domains/{inputs['domain']}/models")
        
        # Load reference examples
        assembler.add_document("examples/reference-endpoint.py")
        assembler.add_document("examples/reference-tests.py")
        
        return assembler.build()
    
    def execute(self, inputs, context):
        """Generate the endpoint implementation"""
        executor = AIExecutor()
        
        # Generate main implementation
        implementation = executor.execute_template(
            "templates/rest-endpoint-generation.md",
            inputs=inputs,
            context=context
        )
        
        # Generate tests
        tests = executor.execute_template(
            "templates/endpoint-tests-generation.md",
            inputs=inputs,
            context=context,
            implementation=implementation
        )
        
        # Update OpenAPI spec
        openapi_update = executor.execute_template(
            "templates/openapi-update.md",
            inputs=inputs,
            implementation=implementation
        )
        
        return {
            "implementation": implementation,
            "tests": tests,
            "openapi": openapi_update
        }
    
    def validate_output(self, outputs):
        """Validate generated artifacts meet standards"""
        validator = OutputValidator()
        
        # Structural validation
        validator.check_files_present([
            "controller",
            "service", 
            "models",
            "tests"
        ])
        
        # Code quality validation
        validator.run_linter(outputs["implementation"])
        validator.check_test_coverage(outputs["tests"], minimum=0.8)
        
        # Standards compliance
        validator.check_patterns(
            outputs["implementation"],
            self.required_patterns
        )
        
        # Security validation
        validator.check_security(outputs["implementation"])
        
        return validator.results()
    
    def format_output(self, outputs, validation_results):
        """Format results for developer consumption"""
        formatter = ResultFormatter()
        
        formatter.add_section("Summary", self._create_summary(outputs))
        formatter.add_section("Files Generated", self._list_files(outputs))
        formatter.add_section("Integration Steps", self._integration_steps())
        formatter.add_section("Review Checklist", self._review_checklist())
        formatter.add_section("Validation Results", validation_results)
        
        return formatter.render()

if __name__ == "__main__":
    workflow = AddRestEndpointWorkflow()
    workflow.run(sys.argv[1:])
```

### Step 6: Create Usage Documentation

**Workflow README**:
```markdown
# Add REST Endpoint Workflow

## Purpose
Generate a complete REST API endpoint implementation following team standards.

## Usage

### Command Line
```bash
./workflows/add-rest-endpoint.py \
  --service order-service \
  --resource order \
  --operation "POST create" \
  --description "Create a new customer order"
```

### IDE Integration
Use the command palette: `Team Workflows > Add REST Endpoint`

### From Code
```python
from workflows import AddRestEndpointWorkflow

workflow = AddRestEndpointWorkflow()
result = workflow.run({
    "service": "order-service",
    "resource": "order",
    "operation": "POST create",
    "description": "Create a new customer order"
})
```

## Inputs

### Required
- `service`: Name of the service to add endpoint to
- `resource`: Resource being exposed (singular noun)
- `operation`: HTTP method + action (e.g., "GET list", "POST create")
- `description`: Business purpose of the endpoint

### Optional
- `query_params`: Query parameter specifications
- `path_params`: Path parameter specifications
- `request_body`: Request body schema
- `response_codes`: Expected HTTP response codes
- `auth_required`: Authentication requirements (default: true)

## Outputs

The workflow generates:
- Controller/handler implementation
- Service layer business logic
- Request/response models
- Comprehensive test suite
- Updated OpenAPI specification
- Integration documentation

## Validation

The workflow automatically validates:
- Code quality and standards compliance
- Test coverage (minimum 80%)
- Security requirements
- API design consistency
- Documentation completeness

## Next Steps

After running the workflow:
1. Review generated code
2. Customize business logic as needed
3. Run tests locally
4. Review and commit changes
5. Create pull request

## Examples

See `examples/workflow-outputs/add-rest-endpoint/` for sample outputs.

## Support

Questions? Check #team-ai-workflows or contact the AI Engineering team.
```

## Workflow Distribution and Discovery

Once you've created shared workflows, teams need easy ways to discover and use them.

### Workflow Registry

Create a central registry that catalogs all available workflows:

```yaml
# team-workflows/registry.yaml
workflows:
  - name: add-rest-endpoint
    version: 1.0.0
    category: api-development
    description: Generate REST API endpoint
    maturity: stable
    usage_count: 247
    avg_satisfaction: 4.6
    
  - name: create-microservice
    version: 2.1.0
    category: service-creation
    description: Bootstrap new microservice
    maturity: stable
    usage_count: 34
    avg_satisfaction: 4.8
    
  - name: add-database-migration
    version: 1.2.0
    category: data
    description: Create database migration
    maturity: beta
    usage_count: 156
    avg_satisfaction: 4.3
```

### IDE Integration

Integrate workflows into developer tools for frictionless access:

**VS Code Extension Example**:
```json
{
  "contributes": {
    "commands": [
      {
        "command": "teamWorkflows.addRestEndpoint",
        "title": "Add REST Endpoint",
        "category": "Team Workflows"
      },
      {
        "command": "teamWorkflows.browse",
        "title": "Browse Workflows",
        "category": "Team Workflows"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "teamWorkflows.addRestEndpoint",
          "when": "inTeamProject"
        }
      ]
    }
  }
}
```

### Command-Line Interface

Provide a CLI for terminal-based workflows:

```bash
# List available workflows
team-workflows list

# Get workflow details
team-workflows info add-rest-endpoint

# Run workflow interactively
team-workflows run add-rest-endpoint

# Run with arguments
team-workflows run add-rest-endpoint \
  --service=order-service \
  --resource=order \
  --operation="POST create"

# Update workflows
team-workflows update
```

## Workflow Version Management

As teams evolve, workflows need to evolve too. Implement versioning to manage changes safely.

### Semantic Versioning

Use semantic versioning (MAJOR.MINOR.PATCH) for workflows:

- **MAJOR**: Breaking changes (input/output format changes)
- **MINOR**: New features (additional optional inputs)
- **PATCH**: Bug fixes and improvements

### Version Migration

Provide migration guides when breaking changes occur:

```markdown
# Migration Guide: add-rest-endpoint v1 → v2

## Breaking Changes

### Input Format
**v1:**
```yaml
operation: "create"
method: "POST"
```

**v2:**
```yaml
operation: "POST create"
```

### Output Structure
**v1:** Files returned as flat list
**v2:** Files organized by category

## Migration Steps

1. Update workflow invocations to use new input format
2. Update any automation that parses workflow outputs
3. Review new validation checks and address any issues

## Timeline

- v1 deprecated: 2026-06-01
- v1 sunset: 2026-09-01
```

## Measuring Workflow Effectiveness

Track metrics to understand workflow value and identify improvement opportunities:

**Usage Metrics**:
- Invocations per workflow per week
- Unique users per workflow
- Adoption rate (% of team using each workflow)

**Quality Metrics**:
- Validation success rate
- Post-generation changes required
- Defects in workflow-generated code

**Satisfaction Metrics**:
- User ratings (1-5 scale)
- Time saved vs. manual approach
- Likelihood to recommend

**Business Metrics**:
- Cycle time reduction
- Consistency improvement
- Onboarding acceleration

## Advanced Workflow Patterns

### Composite Workflows

Combine multiple workflows into higher-level processes:

```yaml
workflow: implement-feature
steps:
  - workflow: create-branch
    inputs: {feature_name, base_branch}
  
  - workflow: update-domain-model
    inputs: {model_changes}
  
  - workflow: add-rest-endpoint
    inputs: {endpoint_spec}
  
  - workflow: generate-tests
    inputs: {test_spec}
  
  - workflow: update-documentation
    inputs: {doc_updates}
  
  - workflow: create-pull-request
    inputs: {title, description}
```

### Conditional Workflows

Workflows that adapt based on context:

```python
def execute(self, inputs, context):
    # Different logic for different service types
    if context.service_type == "grpc":
        return self.execute_grpc_workflow(inputs, context)
    elif context.service_type == "graphql":
        return self.execute_graphql_workflow(inputs, context)
    else:
        return self.execute_rest_workflow(inputs, context)
```

### Interactive Workflows

Workflows that prompt for additional input during execution:

```python
def execute(self, inputs, context):
    # Generate initial implementation
    impl = self.generate_implementation(inputs, context)
    
    # Ask user for feedback
    feedback = self.prompt_user(
        "Review the generated implementation. " +
        "What changes are needed?",
        default="Looks good"
    )
    
    if feedback != "Looks good":
        # Refine based on feedback
        impl = self.refine_implementation(impl, feedback, context)
    
    return impl
```

## Workflow Governance

Establish processes for workflow quality and evolution:

### Review Process

All new workflows undergo review:
1. Technical review: Code quality, error handling, testing
2. Standards review: Compliance with team conventions
3. Security review: No vulnerabilities introduced
4. User testing: Pilot with representative users
5. Documentation review: Clear usage instructions

### Ownership Model

Assign ownership for each workflow:
- **Creator**: Initial author
- **Maintainer**: Person responsible for updates
- **Reviewers**: Team members who approve changes
- **Users**: Team providing feedback

### Deprecation Process

When workflows become obsolete:
1. Mark as deprecated in registry
2. Display warning when used
3. Provide migration guide to replacement
4. Set sunset date (minimum 90 days out)
5. Remove after sunset date

## Conclusion

Shared workflows transform team AI capabilities from individual experimentation into systematic organizational practices. They capture expert knowledge, enforce standards, ensure quality, and democratize AI capabilities across teams.

Building effective shared workflows requires balancing standardization with flexibility, automation with human judgment, and consistency with innovation. Start with high-value, frequently-used processes. Prove value. Iterate based on feedback. Gradually expand to cover more of the team's workflow.

Teams that successfully implement shared workflows typically see 30-50% reduction in time spent on routine tasks, 40-60% improvement in consistency, and 50-70% faster onboarding for new team members.

In the next section, we'll explore how to build shared context systems that enable teams to maintain consistent, high-quality AI interactions across all workflows and use cases.
