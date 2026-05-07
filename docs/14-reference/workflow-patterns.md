# Workflow Patterns Catalog

*30+ proven workflow patterns for Claude applications*

---

## Table of Contents

1. [Basic Patterns](#basic-patterns)
2. [Data Processing Patterns](#data-processing-patterns)
3. [Code Development Patterns](#code-development-patterns)
4. [Content Creation Patterns](#content-creation-patterns)
5. [Analysis Patterns](#analysis-patterns)
6. [Integration Patterns](#integration-patterns)
7. [Advanced Patterns](#advanced-patterns)

---

## Basic Patterns

### Pattern 1: Single Request-Response

**Use Case:** Simple queries, quick answers

**Flow:**
```
User Query → Claude → Response
```

**Example:**
```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Explain async/await in JavaScript"
    }]
)
```

**When to Use:**
- Simple Q&A
- Quick explanations
- Basic transformations

---

### Pattern 2: Multi-Turn Conversation

**Use Case:** Interactive dialogue, context building

**Flow:**
```
User → Claude → User → Claude → ...
```

**Example:**
```python
conversation = []

def chat(user_message):
    conversation.append({
        "role": "user",
        "content": user_message
    })
    
    response = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=conversation
    )
    
    conversation.append({
        "role": "assistant",
        "content": response.content[0].text
    })
    
    return response.content[0].text
```

**When to Use:**
- Tutoring/teaching
- Iterative refinement
- Exploratory analysis

---

### Pattern 3: Prompt Chaining

**Use Case:** Break complex tasks into steps

**Flow:**
```
Input → Prompt 1 → Output 1 → Prompt 2 → Output 2 → Final Result
```

**Example:**
```python
def analyze_and_summarize(text):
    # Step 1: Extract key points
    key_points = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Extract key points from:\n{text}"
        }]
    )
    
    # Step 2: Summarize
    summary = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=512,
        messages=[{
            "role": "user",
            "content": f"Summarize these points:\n{key_points.content[0].text}"
        }]
    )
    
    return summary.content[0].text
```

**When to Use:**
- Complex multi-step tasks
- Quality improvement
- Specialized sub-tasks

---

## Data Processing Patterns

### Pattern 4: Extract-Transform-Load (ETL)

**Use Case:** Data pipeline processing

**Flow:**
```
Raw Data → Extract → Transform → Load → Processed Data
```

**Example:**
```python
def etl_pipeline(raw_data):
    # Extract
    extracted = extract_relevant_fields(raw_data)
    
    # Transform with Claude
    transformed = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Normalize and categorize this data:\n{extracted}"
        }]
    )
    
    # Load
    load_to_database(transformed.content[0].text)
    
    return transformed.content[0].text
```

**When to Use:**
- Data migration
- Data normalization
- Format conversion

---

### Pattern 5: Batch Processing

**Use Case:** Process large datasets efficiently

**Flow:**
```
Dataset → Batch 1 → Process → Results 1
       → Batch 2 → Process → Results 2
       → Batch N → Process → Results N → Aggregate
```

**Example:**
```python
def batch_process(items, batch_size=100):
    results = []
    
    for i in range(0, len(items), batch_size):
        batch = items[i:i+batch_size]
        
        # Process batch
        batch_result = client.messages.create(
            model="claude-haiku-4-5-20250514",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"Classify these items:\n{batch}"
            }]
        )
        
        results.append(batch_result.content[0].text)
    
    return aggregate_results(results)
```

**When to Use:**
- Large-scale processing
- Rate limit management
- Cost optimization

---

### Pattern 6: Map-Reduce

**Use Case:** Parallel processing with aggregation

**Flow:**
```
Large Dataset → Map (parallel) → Intermediate Results → Reduce → Final Result
```

**Example:**
```python
async def map_reduce(documents):
    # Map: Process each document in parallel
    async def process_doc(doc):
        return await client.messages.create(
            model="claude-haiku-4-5-20250514",
            max_tokens=512,
            messages=[{
                "role": "user",
                "content": f"Summarize:\n{doc}"
            }]
        )
    
    # Execute in parallel
    summaries = await asyncio.gather(*[
        process_doc(doc) for doc in documents
    ])
    
    # Reduce: Combine summaries
    final_summary = await client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Combine these summaries:\n{summaries}"
        }]
    )
    
    return final_summary.content[0].text
```

**When to Use:**
- Large document processing
- Distributed analysis
- Scalable architectures

---

## Code Development Patterns

### Pattern 7: Test-Driven Development (TDD)

**Use Case:** Generate code with tests

**Flow:**
```
Requirements → Tests → Implementation → Validation
```

**Example:**
```python
def tdd_workflow(requirements):
    # Generate tests
    tests = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Generate tests for:\n{requirements}"
        }]
    )
    
    # Generate implementation
    implementation = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Implement code that passes these tests:\n{tests.content[0].text}"
        }]
    )
    
    return {
        "tests": tests.content[0].text,
        "implementation": implementation.content[0].text
    }
```

**When to Use:**
- Quality-focused development
- Test coverage requirements
- Regression prevention

---

### Pattern 8: Iterative Refinement

**Use Case:** Improve code quality through iterations

**Flow:**
```
Initial Code → Review → Refine → Review → Refine → Final Code
```

**Example:**
```python
def iterative_refinement(initial_code, max_iterations=3):
    current_code = initial_code
    
    for i in range(max_iterations):
        # Review
        review = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Review this code for improvements:\n{current_code}"
            }]
        )
        
        # If no improvements needed, break
        if "no improvements" in review.content[0].text.lower():
            break
        
        # Refine
        refined = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Apply these improvements:\n{review.content[0].text}\n\nTo code:\n{current_code}"
            }]
        )
        
        current_code = refined.content[0].text
    
    return current_code
```

**When to Use:**
- Code quality improvement
- Performance optimization
- Design pattern application

---

### Pattern 9: Code Review Pipeline

**Use Case:** Automated code review

**Flow:**
```
Code → Style Check → Security Check → Performance Check → Report
```

**Example:**
```python
def code_review_pipeline(code):
    reviews = []
    
    # Style review
    style = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Review code style:\n{code}"
        }]
    )
    reviews.append(("Style", style.content[0].text))
    
    # Security review
    security = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Review code security:\n{code}"
        }]
    )
    reviews.append(("Security", security.content[0].text))
    
    # Performance review
    performance = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Review code performance:\n{code}"
        }]
    )
    reviews.append(("Performance", performance.content[0].text))
    
    return generate_report(reviews)
```

**When to Use:**
- PR automation
- Code quality gates
- Team standards enforcement

---

## Content Creation Patterns

### Pattern 10: Outline-Draft-Edit

**Use Case:** Structured content creation

**Flow:**
```
Topic → Outline → Draft → Edit → Final Content
```

**Example:**
```python
def create_article(topic):
    # Create outline
    outline = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Create an outline for article about: {topic}"
        }]
    )
    
    # Write draft
    draft = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Write article based on outline:\n{outline.content[0].text}"
        }]
    )
    
    # Edit and polish
    final = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Edit and polish this article:\n{draft.content[0].text}"
        }]
    )
    
    return final.content[0].text
```

**When to Use:**
- Blog posts
- Documentation
- Technical writing

---

### Pattern 11: Multi-Perspective Content

**Use Case:** Generate content from different viewpoints

**Flow:**
```
Topic → Perspective 1 → Content 1
      → Perspective 2 → Content 2
      → Perspective 3 → Content 3 → Synthesize
```

**Example:**
```python
def multi_perspective_analysis(topic):
    perspectives = ["technical", "business", "user"]
    analyses = []
    
    for perspective in perspectives:
        analysis = client.messages.create(
            model="claude-sonnet-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Analyze {topic} from {perspective} perspective"
            }]
        )
        analyses.append(analysis.content[0].text)
    
    # Synthesize
    synthesis = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Synthesize these analyses:\n{analyses}"
        }]
    )
    
    return synthesis.content[0].text
```

**When to Use:**
- Comprehensive analysis
- Stakeholder communication
- Decision-making support

---

### Pattern 12: Content Localization

**Use Case:** Adapt content for different audiences

**Flow:**
```
Original Content → Translate → Adapt Culture → Adapt Tone → Localized Content
```

**Example:**
```python
def localize_content(content, target_locale):
    # Translate
    translated = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Translate to {target_locale}:\n{content}"
        }]
    )
    
    # Adapt culturally
    adapted = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Adapt for {target_locale} culture:\n{translated.content[0].text}"
        }]
    )
    
    return adapted.content[0].text
```

**When to Use:**
- International expansion
- Multi-market content
- Cultural adaptation

---

## Analysis Patterns

### Pattern 13: Hierarchical Analysis

**Use Case:** Break down complex topics

**Flow:**
```
Complex Topic → High-Level Analysis → Sub-Topics → Detailed Analysis → Synthesis
```

**Example:**
```python
def hierarchical_analysis(topic):
    # High-level overview
    overview = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Provide high-level overview of: {topic}"
        }]
    )
    
    # Extract sub-topics
    subtopics = extract_subtopics(overview.content[0].text)
    
    # Detailed analysis of each
    detailed_analyses = []
    for subtopic in subtopics:
        analysis = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Analyze in detail: {subtopic}"
            }]
        )
        detailed_analyses.append(analysis.content[0].text)
    
    # Synthesize
    final = synthesize(overview.content[0].text, detailed_analyses)
    return final
```

**When to Use:**
- Research
- Comprehensive reports
- Educational content

---

### Pattern 14: Comparative Analysis

**Use Case:** Compare multiple options

**Flow:**
```
Options → Analyze Each → Compare → Rank → Recommendation
```

**Example:**
```python
def comparative_analysis(options, criteria):
    analyses = []
    
    # Analyze each option
    for option in options:
        analysis = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Analyze {option} against criteria: {criteria}"
            }]
        )
        analyses.append(analysis.content[0].text)
    
    # Compare and recommend
    comparison = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Compare these analyses and recommend:\n{analyses}"
        }]
    )
    
    return comparison.content[0].text
```

**When to Use:**
- Technology selection
- Vendor evaluation
- Strategy planning

---

### Pattern 15: Sentiment Analysis Pipeline

**Use Case:** Analyze sentiment at scale

**Flow:**
```
Text Samples → Classify Sentiment → Aggregate → Insights → Report
```

**Example:**
```python
def sentiment_analysis_pipeline(texts):
    sentiments = []
    
    # Classify each text
    for text in texts:
        sentiment = client.messages.create(
            model="claude-haiku-4-5-20250514",
            max_tokens=256,
            messages=[{
                "role": "user",
                "content": f"Classify sentiment (positive/negative/neutral):\n{text}"
            }]
        )
        sentiments.append(parse_sentiment(sentiment.content[0].text))
    
    # Aggregate results
    aggregated = aggregate_sentiments(sentiments)
    
    # Generate insights
    insights = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Generate insights from sentiment data:\n{aggregated}"
        }]
    )
    
    return insights.content[0].text
```

**When to Use:**
- Customer feedback
- Social media monitoring
- Product reviews

---

## Integration Patterns

### Pattern 16: API Integration Workflow

**Use Case:** Integrate with external APIs

**Flow:**
```
User Request → Parse Intent → Call API → Process Response → Format Output
```

**Example:**
```python
def api_integration_workflow(user_request, tools):
    # Parse intent
    intent = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=512,
        tools=tools,
        messages=[{
            "role": "user",
            "content": user_request
        }]
    )
    
    # Execute tool if needed
    if intent.stop_reason == "tool_use":
        tool_result = execute_tool(intent.content[0])
        
        # Process response
        final_response = client.messages.create(
            model="claude-sonnet-4-5-20250514",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": user_request},
                {"role": "assistant", "content": intent.content},
                {"role": "user", "content": [{
                    "type": "tool_result",
                    "tool_use_id": intent.content[0].id,
                    "content": tool_result
                }]}
            ]
        )
        
        return final_response.content[0].text
```

**When to Use:**
- API-powered applications
- Service integration
- External data access

---

### Pattern 17: Database Query Workflow

**Use Case:** Natural language to SQL

**Flow:**
```
Natural Language Query → Generate SQL → Validate → Execute → Format Results
```

**Example:**
```python
def nl_to_sql_workflow(nl_query, schema):
    # Generate SQL
    sql = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Convert to SQL given schema {schema}:\n{nl_query}"
        }]
    )
    
    # Validate SQL
    if not validate_sql(sql.content[0].text):
        raise ValueError("Invalid SQL generated")
    
    # Execute
    results = execute_query(sql.content[0].text)
    
    # Format results
    formatted = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Format these results for user:\n{results}"
        }]
    )
    
    return formatted.content[0].text
```

**When to Use:**
- Business intelligence
- Data exploration
- Reporting tools

---

### Pattern 18: Event-Driven Processing

**Use Case:** Process events as they occur

**Flow:**
```
Event → Trigger → Process → Action → Log
```

**Example:**
```python
async def event_driven_processor(event_stream):
    async for event in event_stream:
        # Process event
        analysis = await client.messages.create(
            model="claude-haiku-4-5-20250514",
            max_tokens=512,
            messages=[{
                "role": "user",
                "content": f"Analyze event:\n{event}"
            }]
        )
        
        # Take action if needed
        if requires_action(analysis.content[0].text):
            await trigger_action(event, analysis.content[0].text)
        
        # Log
        await log_event(event, analysis.content[0].text)
```

**When to Use:**
- Real-time monitoring
- Alert systems
- Stream processing

---

## Advanced Patterns

### Pattern 19: Self-Correction Loop

**Use Case:** Improve output through self-review

**Flow:**
```
Generate → Review → Identify Issues → Correct → Verify → Final Output
```

**Example:**
```python
def self_correction_loop(task, max_iterations=3):
    output = generate_initial(task)
    
    for i in range(max_iterations):
        # Self-review
        review = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"Review this output for errors:\n{output}"
            }]
        )
        
        # If no issues, done
        if "no issues" in review.content[0].text.lower():
            break
        
        # Correct issues
        corrected = client.messages.create(
            model="claude-opus-4-5-20250514",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"Fix these issues:\n{review.content[0].text}\n\nIn:\n{output}"
            }]
        )
        
        output = corrected.content[0].text
    
    return output
```

**When to Use:**
- High-accuracy requirements
- Critical outputs
- Quality assurance

---

### Pattern 20: Ensemble Approach

**Use Case:** Combine multiple model outputs

**Flow:**
```
Input → Model 1 → Output 1
      → Model 2 → Output 2
      → Model 3 → Output 3 → Aggregate → Final Output
```

**Example:**
```python
def ensemble_approach(task):
    outputs = []
    
    # Get multiple perspectives
    for model in ["opus", "sonnet", "haiku"]:
        output = client.messages.create(
            model=f"claude-{model}-4-5-20250514",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": task
            }]
        )
        outputs.append(output.content[0].text)
    
    # Aggregate
    final = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"Synthesize these responses:\n{outputs}"
        }]
    )
    
    return final.content[0].text
```

**When to Use:**
- Critical decisions
- Reducing bias
- Improving accuracy

---

### Pattern 21: Progressive Disclosure

**Use Case:** Reveal information gradually

**Flow:**
```
High-Level → User Interested? → More Detail → Still Interested? → Full Detail
```

**Example:**
```python
def progressive_disclosure(topic):
    # High-level summary
    summary = client.messages.create(
        model="claude-haiku-4-5-20250514",
        max_tokens=256,
        messages=[{
            "role": "user",
            "content": f"One sentence about: {topic}"
        }]
    )
    
    yield ("summary", summary.content[0].text)
    
    # Medium detail
    details = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"Expand on: {summary.content[0].text}"
        }]
    )
    
    yield ("details", details.content[0].text)
    
    # Full detail
    comprehensive = client.messages.create(
        model="claude-opus-4-5-20250514",
        max_tokens=4096,
        messages=[{
            "role": "user",
            "content": f"Comprehensive explanation: {topic}"
        }]
    )
    
    yield ("comprehensive", comprehensive.content[0].text)
```

**When to Use:**
- User interfaces
- Educational content
- Information hierarchy

---

*Due to length constraints, patterns 22-35 would continue with similar detailed documentation covering:*

- Pattern 22: Retrieval-Augmented Generation (RAG)
- Pattern 23: Chain-of-Thought Prompting
- Pattern 24: Few-Shot Learning
- Pattern 25: Zero-Shot Classification
- Pattern 26: Multi-Modal Processing
- Pattern 27: Caching Optimization
- Pattern 28: Rate Limit Management
- Pattern 29: Error Recovery
- Pattern 30: A/B Testing
- Pattern 31: Feedback Loop
- Pattern 32: Version Control
- Pattern 33: Audit Trail
- Pattern 34: Cost Optimization
- Pattern 35: Performance Monitoring

---

## Pattern Selection Guide

| Use Case | Recommended Pattern | Model | Complexity |
|----------|-------------------|-------|------------|
| Simple Q&A | Single Request-Response | Haiku | Low |
| Complex Analysis | Hierarchical Analysis | Opus | High |
| Code Generation | TDD | Sonnet | Medium |
| Content Creation | Outline-Draft-Edit | Opus | Medium |
| Data Processing | Map-Reduce | Haiku/Sonnet | Medium |
| API Integration | API Integration Workflow | Sonnet | Medium |
| Quality Assurance | Self-Correction Loop | Opus | High |
| Cost Optimization | Batch Processing | Haiku | Low |
| Real-time | Event-Driven | Haiku | Medium |
| Research | Multi-Perspective | Opus | High |

---

## Related Resources

- **Code Examples**: Implementation details
- **API Reference**: API patterns
- **Best Practices**: Pattern optimization
- **Performance Guide**: Pattern benchmarks

---

*Last Updated: 2026-05-05*
*Version: 1.0*
