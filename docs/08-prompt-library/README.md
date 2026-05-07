# Prompt Library

A comprehensive collection of 100+ curated prompts for software development with Claude.

## Overview

This prompt library provides ready-to-use templates for common development tasks, organized into 15 specialized categories. Each prompt is designed to get the most effective responses from Claude for specific coding scenarios.

## Categories

### 1. [Debugging Prompts](debugging-prompts.md) - 15+ prompts
- Root cause analysis
- Stack trace decoding
- Production issue investigation
- Performance debugging
- Integration debugging
- Memory leak detection
- Flaky test debugging

### 2. [Refactoring Prompts](refactoring-prompts.md) - 20+ prompts
- Code cleanup and duplication removal
- Design pattern implementation
- Architecture refactoring
- Performance refactoring
- Modernization strategies
- Async/await conversion
- Functional programming refactoring

### 3. [Architecture Prompts](architecture-prompts.md) - 15+ prompts
- System design
- Microservices architecture
- Event-driven architecture
- API architecture
- Database architecture
- Scalability planning
- CQRS and circuit breaker patterns

### 4. [Testing Prompts](testing-prompts.md) - 15+ prompts
- Unit test generation
- Integration testing
- Test design strategies
- Mocking and fixtures
- Contract testing
- Property-based testing
- Test coverage improvement

### 5. [Code Review Prompts](code-review-prompts.md) - 12+ prompts
- Comprehensive code review
- Security review
- Performance review
- API design review
- Pull request review
- Best practices review

### 6. [Documentation Prompts](documentation-prompts.md) - 12+ prompts
- Function/class documentation
- API documentation (REST, GraphQL)
- Architecture documentation
- README creation
- Tutorial writing
- OpenAPI specifications

### 7. [Performance Prompts](performance-prompts.md) - 10+ prompts
- Performance profiling analysis
- Algorithm optimization
- Query optimization
- Memory usage analysis
- React component optimization
- Database performance tuning

### 8. [Security Prompts](security-prompts.md) - 12+ prompts
- Security auditing
- Vulnerability detection
- Input validation review
- Cryptography review
- Authentication/authorization review
- GDPR and PCI DSS compliance

### 9. [API Prompts](api-prompts.md) - 10+ prompts
- RESTful API design
- GraphQL schema design
- API versioning
- Rate limiting
- API error handling
- OpenAPI specification

### 10. [Database Prompts](database-prompts.md) - 8+ prompts
- Schema design (SQL and NoSQL)
- Query optimization
- Index strategy
- Database migration
- Partitioning strategies

### 11. [DevOps Prompts](devops-prompts.md) - 10+ prompts
- CI/CD pipeline design
- Kubernetes deployment
- Docker optimization
- Infrastructure as Code
- Monitoring and alerting
- Deployment strategies

### 12. [Migration Prompts](migration-prompts.md) - 10+ prompts
- Language/framework migration
- Monolith to microservices
- Database migration
- Cloud migration
- Version upgrades
- Legacy modernization

### 13. [Analysis Prompts](analysis-prompts.md) - 8+ prompts
- Code quality analysis
- Complexity analysis
- Technical debt assessment
- Dependency audit
- Bundle size analysis

### 14. [Planning Prompts](planning-prompts.md) - 8+ prompts
- Project planning
- Feature design
- Technical spikes
- Estimation
- Risk assessment
- Technology selection

### 15. [Collaboration Prompts](collaboration-prompts.md) - 8+ prompts
- Code review requests
- Onboarding documentation
- Knowledge transfer
- ADR creation
- Retrospectives
- Mentoring plans

## How to Use This Library

### Quick Start
1. Identify your task category
2. Find the relevant prompt template
3. Fill in the bracketed placeholders [like this]
4. Customize based on your specific context
5. Use with Claude for optimal results

### Customization Tips
- **Be Specific**: Replace all [placeholders] with your actual details
- **Add Context**: Include relevant code, error messages, or metrics
- **Set Constraints**: Mention limitations, requirements, or preferences
- **Request Format**: Specify desired output format (code, explanation, steps)

### Example Usage

**Bad Prompt:**
```
How do I make this code faster?
[paste code]
```

**Good Prompt (using Performance template):**
```
Optimize this database query performance:

Query: SELECT * FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE country = 'US')
Database: PostgreSQL 15
Schema: orders (10M rows), customers (1M rows)
Current Performance: 5 seconds
Target: <500ms

Analyze:
1. Query execution plan
2. Index recommendations
3. Query rewrite options
4. Expected improvement
```

## Language-Specific Variations

Many prompts include language-specific examples for:
- **JavaScript/TypeScript**: Node.js, React, Jest
- **Python**: Django, Flask, pytest
- **Java**: Spring Boot, JUnit
- **C#**: .NET Core, xUnit
- **Go**: Standard library patterns

## Advanced Techniques

### Combining Prompts
Chain multiple prompts for complex tasks:
1. Use Analysis prompt to understand code
2. Use Refactoring prompt to improve it
3. Use Testing prompt to add tests
4. Use Documentation prompt to document changes

### Iterative Refinement
1. Start with a broad prompt
2. Review Claude's response
3. Use follow-up prompts for specific areas
4. Refine based on feedback

### Context Building
For large codebases:
1. Start with Architecture Analysis prompt
2. Use component-specific prompts
3. Reference previous responses for context

## Best Practices

### General Guidelines
1. **Provide Complete Context**: Include all relevant code, errors, and requirements
2. **Be Specific About Goals**: State what you want to achieve
3. **Include Constraints**: Mention limitations and requirements
4. **Request Structured Output**: Ask for numbered lists, sections, or specific formats
5. **Specify Standards**: Mention style guides, frameworks, or conventions

### What to Include
- ✅ Actual code snippets
- ✅ Error messages and stack traces
- ✅ Performance metrics
- ✅ Environment details
- ✅ Current and desired state
- ✅ Constraints and requirements

### What to Avoid
- ❌ Vague descriptions without examples
- ❌ Missing context about the problem
- ❌ No mention of what you've tried
- ❌ Unclear success criteria
- ❌ No specification of technology stack

## Common Patterns

### The 5-Part Prompt Structure
```
[CONTEXT]
What: [what you're working with]
Why: [why you need help]

[CURRENT STATE]
Code: [paste relevant code]
Issue: [describe problem]

[DESIRED STATE]
Goal: [what you want to achieve]
Requirements: [must-haves]

[CONSTRAINTS]
Cannot: [limitations]
Must maintain: [requirements]

[REQUEST]
Please provide:
1. [specific output]
2. [specific output]
```

### The Analysis-Action Pattern
```
1. First prompt: "Analyze [code/system] for [concern]"
2. Review analysis
3. Second prompt: "Implement fixes for issues #1, #3, #5"
```

### The Iterative Pattern
```
1. "Design high-level [solution]"
2. "Detail the [specific component]"
3. "Implement [feature] using previous design"
4. "Add tests for [implementation]"
```

## Troubleshooting

### If responses are too generic:
- Add more specific context
- Include code examples
- Specify technology versions
- Mention your constraints

### If responses are too verbose:
- Request "concise" or "brief" explanations
- Ask for "just the code" or "key points only"
- Specify output length

### If missing important details:
- Use follow-up prompts
- Ask "What about [specific aspect]?"
- Request "comprehensive" or "detailed" analysis

## Contributing

This library is designed to evolve. Common patterns for extending it:
- Add language-specific variations
- Include domain-specific prompts (ML, mobile, embedded)
- Add framework-specific templates
- Include project lifecycle prompts

## Quick Reference

| Task | Prompt Category | Key Prompts |
|------|----------------|-------------|
| Fix bug | Debugging | Root Cause Analysis, Stack Trace |
| Improve code | Refactoring | Code Cleanup, Design Patterns |
| Design system | Architecture | System Design, API Architecture |
| Add tests | Testing | Unit Tests, Integration Tests |
| Review code | Code Review | Comprehensive Review, Security |
| Write docs | Documentation | Function Docs, API Docs |
| Speed up code | Performance | Profiling, Query Optimization |
| Secure code | Security | Security Audit, Vulnerability Detection |
| Build API | API | REST Design, GraphQL Schema |
| Database work | Database | Schema Design, Query Optimization |
| Deploy | DevOps | CI/CD, Kubernetes |
| Migrate | Migration | Language Migration, Cloud Migration |
| Understand code | Analysis | Code Quality, Complexity |
| Plan work | Planning | Project Planning, Estimation |
| Team work | Collaboration | Code Review, Knowledge Transfer |

## Tips for Maximum Effectiveness

1. **Start Specific**: Use targeted prompts rather than generic ones
2. **Build Context**: Reference previous responses in follow-ups
3. **Iterate**: Use responses to refine next prompts
4. **Combine**: Chain prompts for complex multi-step tasks
5. **Customize**: Adapt templates to your specific needs
6. **Validate**: Always review and test generated code
7. **Learn**: Study response patterns to improve future prompts

## License

This prompt library is part of the Claude Mastery Guide.
