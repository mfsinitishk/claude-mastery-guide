# Tool Capabilities Matrix

*Comprehensive matrix of Claude's tool use capabilities and patterns*

---

## Table of Contents

1. [Tool Use Overview](#tool-use-overview)
2. [Built-in Tools](#built-in-tools)
3. [Custom Tools](#custom-tools)
4. [Tool Categories](#tool-categories)
5. [Integration Patterns](#integration-patterns)
6. [Tool Examples](#tool-examples)
7. [Best Practices](#best-practices)

---

## Tool Use Overview

### What is Tool Use?

Tool use (also called function calling) allows Claude to interact with external systems, APIs, and functions to accomplish tasks beyond text generation.

### Capabilities Matrix

| Capability | Supported | Notes |
|------------|-----------|-------|
| **Function Calling** | ✓ Yes | Define custom functions |
| **API Integration** | ✓ Yes | Call external APIs |
| **Database Queries** | ✓ Yes | Execute SQL queries |
| **File Operations** | ✓ Yes | Read/write files |
| **Web Search** | ✓ Yes | Search the web |
| **Code Execution** | ✓ Yes | Run code in sandbox |
| **Multi-Tool Use** | ✓ Yes | Chain multiple tools |
| **Parallel Tools** | ✓ Yes | Execute tools concurrently |
| **Conditional Logic** | ✓ Yes | Decide which tools to use |
| **Error Handling** | ✓ Yes | Handle tool failures |

---

## Built-in Tools

### Core Tools

| Tool | Purpose | Input | Output | Use Case |
|------|---------|-------|--------|----------|
| **calculator** | Perform calculations | Expression | Result | Math operations |
| **web_search** | Search the internet | Query | Results | Current information |
| **code_interpreter** | Execute code | Code + Language | Output | Data analysis |
| **file_reader** | Read files | Path | Content | Document processing |
| **file_writer** | Write files | Path + Content | Status | Save outputs |
| **database_query** | Query database | SQL | Rows | Data retrieval |
| **api_call** | Call external API | Endpoint + Params | Response | Integration |
| **image_analyzer** | Analyze images | Image | Description | Vision tasks |

### Tool Availability by Model

| Tool | Opus | Sonnet | Haiku |
|------|------|--------|-------|
| **Basic Tools** | ✓ | ✓ | ✓ |
| **Advanced Tools** | ✓ | ✓ | Limited |
| **Parallel Execution** | ✓ | ✓ | ✓ |
| **Complex Chaining** | ✓ | ✓ | Limited |
| **Error Recovery** | Advanced | Standard | Basic |

---

## Custom Tools

### Tool Definition Schema

```json
{
  "name": "tool_name",
  "description": "What the tool does",
  "input_schema": {
    "type": "object",
    "properties": {
      "param1": {
        "type": "string",
        "description": "Parameter description"
      },
      "param2": {
        "type": "number",
        "description": "Another parameter"
      }
    },
    "required": ["param1"]
  }
}
```

### Common Tool Templates

#### API Call Tool

```json
{
  "name": "call_api",
  "description": "Call a REST API endpoint",
  "input_schema": {
    "type": "object",
    "properties": {
      "endpoint": {
        "type": "string",
        "description": "API endpoint URL"
      },
      "method": {
        "type": "string",
        "enum": ["GET", "POST", "PUT", "DELETE"],
        "description": "HTTP method"
      },
      "headers": {
        "type": "object",
        "description": "Request headers"
      },
      "body": {
        "type": "object",
        "description": "Request body"
      }
    },
    "required": ["endpoint", "method"]
  }
}
```

#### Database Query Tool

```json
{
  "name": "query_database",
  "description": "Execute a SQL query",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "SQL query to execute"
      },
      "database": {
        "type": "string",
        "description": "Database name"
      },
      "readonly": {
        "type": "boolean",
        "description": "Whether query is read-only",
        "default": true
      }
    },
    "required": ["query"]
  }
}
```

#### File Operations Tool

```json
{
  "name": "file_operation",
  "description": "Perform file operations",
  "input_schema": {
    "type": "object",
    "properties": {
      "operation": {
        "type": "string",
        "enum": ["read", "write", "append", "delete"],
        "description": "Operation to perform"
      },
      "path": {
        "type": "string",
        "description": "File path"
      },
      "content": {
        "type": "string",
        "description": "Content for write/append"
      }
    },
    "required": ["operation", "path"]
  }
}
```

---

## Tool Categories

### Data & Analytics

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **SQL Query** | Execute database queries | Medium | Data retrieval |
| **Data Analysis** | Analyze datasets | High | Insights generation |
| **CSV Parser** | Parse CSV files | Low | Data import |
| **JSON Processor** | Process JSON data | Low | Data transformation |
| **Statistics** | Calculate statistics | Medium | Data summary |
| **Visualization** | Create charts | High | Data presentation |

### Web & APIs

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **HTTP Request** | Make HTTP requests | Low | API calls |
| **Web Scraper** | Extract web data | Medium | Content extraction |
| **RSS Reader** | Read RSS feeds | Low | Content aggregation |
| **GraphQL** | Execute GraphQL queries | Medium | API queries |
| **Webhook** | Trigger webhooks | Low | Event notifications |
| **OAuth** | OAuth authentication | High | Secure auth |

### File & Document

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **PDF Reader** | Read PDF files | Medium | Document processing |
| **Image OCR** | Extract text from images | High | Text extraction |
| **Markdown Parser** | Parse Markdown | Low | Documentation |
| **Excel Reader** | Read Excel files | Medium | Spreadsheet data |
| **ZIP Handler** | Handle archives | Low | File compression |
| **File Search** | Search file systems | Medium | File discovery |

### Communication

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **Email Send** | Send emails | Medium | Notifications |
| **SMS Send** | Send text messages | Low | Alerts |
| **Slack Post** | Post to Slack | Low | Team communication |
| **Discord Bot** | Discord integration | Medium | Community engagement |
| **Teams Message** | Microsoft Teams | Low | Enterprise chat |

### Development

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **Git Operations** | Git commands | Medium | Version control |
| **Docker Commands** | Container management | High | DevOps |
| **Package Install** | Install packages | Medium | Dependencies |
| **Test Runner** | Run tests | Medium | QA |
| **Linter** | Code linting | Low | Code quality |
| **Debugger** | Debug assistance | High | Troubleshooting |

### Cloud & Infrastructure

| Tool | Description | Complexity | Use Case |
|------|-------------|------------|----------|
| **AWS CLI** | AWS operations | High | Cloud management |
| **Azure CLI** | Azure operations | High | Cloud management |
| **GCP CLI** | GCP operations | High | Cloud management |
| **Kubernetes** | K8s management | Very High | Container orchestration |
| **Terraform** | Infrastructure as code | High | Provisioning |

---

## Integration Patterns

### Single Tool Use

```python
# Simple tool call
tools = [{
    "name": "get_weather",
    "description": "Get current weather",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"}
        },
        "required": ["location"]
    }
}]

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "What's the weather in Paris?"
    }]
)
```

### Sequential Tool Chain

```python
# Tool chain: search → analyze → summarize
def tool_chain(query):
    # Step 1: Search
    search_results = search_tool(query)
    
    # Step 2: Analyze
    analysis = analyze_tool(search_results)
    
    # Step 3: Summarize
    summary = summarize_tool(analysis)
    
    return summary
```

### Parallel Tool Execution

```python
# Execute multiple tools in parallel
async def parallel_tools(tasks):
    tools_to_execute = [
        weather_tool("New York"),
        news_tool("technology"),
        stock_tool("AAPL")
    ]
    
    results = await asyncio.gather(*tools_to_execute)
    return results
```

### Conditional Tool Selection

```python
# Decide which tool to use based on context
def smart_tool_selection(task):
    if task.type == "data_analysis":
        return sql_query_tool
    elif task.type == "web_research":
        return web_search_tool
    elif task.type == "calculation":
        return calculator_tool
    else:
        return general_tool
```

### Error Handling Pattern

```python
# Robust error handling
def execute_with_fallback(primary_tool, fallback_tool, input_data):
    try:
        return primary_tool(input_data)
    except ToolError as e:
        logger.warning(f"Primary tool failed: {e}")
        try:
            return fallback_tool(input_data)
        except ToolError as e2:
            logger.error(f"Fallback also failed: {e2}")
            return default_response()
```

---

## Tool Examples

### Example 1: Weather API

**Tool Definition:**
```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name"
      },
      "units": {
        "type": "string",
        "enum": ["metric", "imperial"],
        "description": "Temperature units",
        "default": "metric"
      }
    },
    "required": ["location"]
  }
}
```

**Implementation:**
```python
def get_weather(location: str, units: str = "metric"):
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"https://api.weather.com/v1/current"
    params = {
        "location": location,
        "units": units,
        "apikey": api_key
    }
    response = requests.get(url, params=params)
    return response.json()
```

**Usage:**
```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    tools=[weather_tool],
    messages=[{
        "role": "user",
        "content": "What's the weather in Tokyo in Celsius?"
    }]
)
```

### Example 2: Database Query

**Tool Definition:**
```json
{
  "name": "query_users",
  "description": "Query user database",
  "input_schema": {
    "type": "object",
    "properties": {
      "filters": {
        "type": "object",
        "properties": {
          "status": {"type": "string"},
          "created_after": {"type": "string"},
          "limit": {"type": "integer"}
        }
      }
    }
  }
}
```

**Implementation:**
```python
def query_users(filters: dict):
    query = "SELECT * FROM users WHERE 1=1"
    params = []
    
    if status := filters.get("status"):
        query += " AND status = ?"
        params.append(status)
    
    if created_after := filters.get("created_after"):
        query += " AND created_at > ?"
        params.append(created_after)
    
    if limit := filters.get("limit"):
        query += f" LIMIT {limit}"
    
    return execute_query(query, params)
```

### Example 3: File Processing

**Tool Definition:**
```json
{
  "name": "process_csv",
  "description": "Process and analyze CSV file",
  "input_schema": {
    "type": "object",
    "properties": {
      "file_path": {
        "type": "string",
        "description": "Path to CSV file"
      },
      "operations": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["summarize", "filter", "aggregate", "sort"]
        }
      }
    },
    "required": ["file_path"]
  }
}
```

**Implementation:**
```python
import pandas as pd

def process_csv(file_path: str, operations: list):
    df = pd.read_csv(file_path)
    results = {}
    
    if "summarize" in operations:
        results["summary"] = df.describe().to_dict()
    
    if "filter" in operations:
        # Apply filters
        pass
    
    if "aggregate" in operations:
        results["aggregates"] = df.groupby('category').sum().to_dict()
    
    return results
```

### Example 4: Multi-Tool Workflow

**Scenario:** Research → Analyze → Report

```python
tools = [
    {
        "name": "web_search",
        "description": "Search the web",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string"}
            }
        }
    },
    {
        "name": "analyze_data",
        "description": "Analyze data",
        "input_schema": {
            "type": "object",
            "properties": {
                "data": {"type": "array"}
            }
        }
    },
    {
        "name": "create_report",
        "description": "Generate report",
        "input_schema": {
            "type": "object",
            "properties": {
                "findings": {"type": "object"},
                "format": {"type": "string"}
            }
        }
    }
]

# Claude will orchestrate: search → analyze → report
response = client.messages.create(
    model="claude-opus-4-5-20250514",
    max_tokens=4096,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "Research AI trends in 2025 and create a report"
    }]
)
```

---

## Best Practices

### Tool Design Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **Single Responsibility** | One tool, one purpose | Separate read/write tools |
| **Clear Naming** | Descriptive tool names | `get_user_by_id` not `query` |
| **Comprehensive Descriptions** | Detailed tool descriptions | Include examples, limitations |
| **Type Safety** | Strong type definitions | Use JSON Schema validation |
| **Error Messages** | Helpful error responses | Specific error details |
| **Idempotency** | Safe to retry | READ operations |
| **Rate Limiting** | Prevent abuse | Built-in throttling |

### Security Considerations

```python
# Tool security checklist
class SecureTool:
    def __init__(self):
        self.allowed_operations = ["read", "list"]
        self.max_results = 1000
        self.rate_limiter = RateLimiter()
    
    def execute(self, operation, params):
        # 1. Validate operation
        if operation not in self.allowed_operations:
            raise SecurityError("Operation not allowed")
        
        # 2. Rate limiting
        if not self.rate_limiter.check():
            raise RateLimitError("Too many requests")
        
        # 3. Input validation
        validated_params = self.validate_input(params)
        
        # 4. Execute with limits
        results = self.perform_operation(
            operation,
            validated_params,
            limit=self.max_results
        )
        
        # 5. Sanitize output
        return self.sanitize_output(results)
```

### Performance Optimization

| Strategy | Benefit | Implementation |
|----------|---------|----------------|
| **Caching** | Reduce API calls | Cache frequent queries |
| **Batching** | Reduce overhead | Batch multiple operations |
| **Async Operations** | Parallel execution | Use async/await |
| **Connection Pooling** | Reuse connections | Pool database connections |
| **Result Pagination** | Memory efficiency | Paginate large results |
| **Timeouts** | Prevent hangs | Set reasonable timeouts |

### Error Handling

```python
# Comprehensive error handling
def robust_tool_execution(tool, params):
    try:
        # Validate input
        validated = validate_params(params)
        
        # Execute with timeout
        result = execute_with_timeout(tool, validated, timeout=30)
        
        # Validate output
        return validate_result(result)
        
    except ValidationError as e:
        return {
            "error": "Invalid input",
            "details": str(e),
            "type": "validation_error"
        }
    except TimeoutError:
        return {
            "error": "Operation timed out",
            "type": "timeout_error"
        }
    except ToolError as e:
        return {
            "error": "Tool execution failed",
            "details": str(e),
            "type": "tool_error"
        }
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return {
            "error": "Internal error",
            "type": "internal_error"
        }
```

### Testing Tools

```python
# Unit test example
def test_weather_tool():
    # Test normal operation
    result = get_weather("London", "metric")
    assert "temperature" in result
    assert result["units"] == "metric"
    
    # Test error handling
    with pytest.raises(ValueError):
        get_weather("", "metric")
    
    # Test edge cases
    result = get_weather("Unknown City")
    assert "error" in result
```

---

## Tool Patterns Catalog

### Pattern 1: Read-Process-Write

```python
def data_pipeline():
    # Read
    data = file_reader.read("input.csv")
    
    # Process
    processed = data_processor.transform(data)
    
    # Write
    file_writer.write("output.csv", processed)
```

### Pattern 2: Search-Analyze-Report

```python
def research_workflow(topic):
    # Search
    results = web_search.search(topic)
    
    # Analyze
    insights = analyzer.analyze(results)
    
    # Report
    return report_generator.create(insights)
```

### Pattern 3: Validate-Execute-Verify

```python
def safe_execution(command):
    # Validate
    if not validator.is_safe(command):
        raise SecurityError("Unsafe command")
    
    # Execute
    result = executor.run(command)
    
    # Verify
    if not verifier.check(result):
        raise ValidationError("Invalid result")
    
    return result
```

### Pattern 4: Try-Fallback-Default

```python
def resilient_lookup(key):
    # Try primary
    try:
        return cache.get(key)
    except CacheError:
        # Fallback to database
        try:
            return database.query(key)
        except DatabaseError:
            # Default value
            return default_value(key)
```

---

## Tool Limitations

### Current Limitations

| Limitation | Impact | Workaround |
|------------|--------|------------|
| **Max Tools Per Request** | 64 tools | Group related tools |
| **Max Tool Name Length** | 64 characters | Use abbreviations |
| **No Nested Tools** | Can't call tools from tools | Use sequential calls |
| **Stateless Execution** | No persistent state | Pass context in parameters |
| **Synchronous Only** | No streaming from tools | Return incremental data |

### Safety Restrictions

| Restriction | Reason | Alternative |
|-------------|--------|-------------|
| **No File System Access** | Security | Provide file content |
| **No Network Access** | Security | Use explicit API tools |
| **No Code Execution** | Security | Use sandboxed interpreter |
| **Rate Limiting** | Resource protection | Implement queuing |

---

## Related Resources

- **API Reference**: Tool use API details
- **Code Examples**: Complete tool implementations
- **Security Guide**: Tool security best practices
- **Performance Guide**: Tool optimization techniques

---

*Last Updated: 2026-05-05*
*Version: 1.0*
