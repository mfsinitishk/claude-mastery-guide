# Quick Reference Cheat Sheet

*Fast reference for Claude essentials - print-friendly*

---

## Model Quick Reference

| Model | Best For | Speed | Cost | Context |
|-------|----------|-------|------|---------|
| **Opus** | Complex reasoning, analysis | Slower | High | 200K |
| **Sonnet** | Balanced tasks, general use | Medium | Medium | 200K |
| **Haiku** | Quick responses, simple tasks | Fast | Low | 200K |

---

## Essential Commands

### Start Chat
```bash
claude                          # Interactive mode
claude chat                     # New conversation
claude --model opus             # Specific model
```

### File Operations
```bash
claude file process app.py      # Process file
claude file review src/         # Review directory
claude file analyze *.py        # Analyze pattern
```

### Configuration
```bash
claude config set model sonnet  # Set default model
claude config get model         # Get setting
claude config list              # Show all settings
```

---

## API Quick Start

### Python
```python
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)
print(response.content[0].text)
```

### TypeScript
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();
const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  messages: [{role: 'user', content: 'Hello'}]
});
console.log(response.content[0].text);
```

### cURL
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-5-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

## Key Parameters

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| **temperature** | 0.0-1.0 | 1.0 | Lower = more focused |
| **max_tokens** | 1-4096+ | Required | Output length limit |
| **top_p** | 0.0-1.0 | - | Nucleus sampling |
| **top_k** | 1-500 | - | Token filtering |

---

## Prompt Engineering Patterns

### Basic Structure
```
[ROLE] You are an expert [DOMAIN] developer.

[CONTEXT] Here is the current situation:
{context}

[TASK] Please {action} by following these steps:
1. {step1}
2. {step2}

[FORMAT] Provide output as {format}.
```

### Few-Shot Example
```
Task: Classify sentiment

Examples:
- "I love this!" → Positive
- "Terrible experience" → Negative
- "It's okay" → Neutral

Now classify: "{user_input}"
```

### Chain-of-Thought
```
Let's solve this step by step:

1. First, identify {x}
2. Then, calculate {y}
3. Finally, determine {z}

Show your reasoning at each step.
```

---

## Common Use Cases

### Code Review
```bash
claude file review app.py --task "security,performance,style"
```

### Documentation
```bash
claude generate docs src/ --format markdown
```

### Translation
```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": "Translate to French: 'Hello, world!'"
    }]
)
```

### Data Extraction
```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [{
    "role": "user",
    "content": "Extract name, email, phone from:\nJohn Doe\njohn@example.com\n555-0123"
  }]
}
```

---

## Streaming

### Python
```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript
```typescript
const stream = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  stream: true,
  messages: [{role: 'user', content: 'Story'}]
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

---

## Tool Use Pattern

### Define Tool
```json
{
  "name": "calculator",
  "description": "Perform calculation",
  "input_schema": {
    "type": "object",
    "properties": {
      "operation": {"type": "string"},
      "a": {"type": "number"},
      "b": {"type": "number"}
    },
    "required": ["operation", "a", "b"]
  }
}
```

### Handle Tool Use
```python
# 1. Send request with tools
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    tools=[tool_definition],
    messages=messages
)

# 2. Execute tool if requested
if response.stop_reason == "tool_use":
    tool_use = response.content[0]
    result = execute_tool(tool_use.name, tool_use.input)
    
# 3. Send result back
    messages.append({"role": "assistant", "content": response.content})
    messages.append({
        "role": "user",
        "content": [{
            "type": "tool_result",
            "tool_use_id": tool_use.id,
            "content": result
        }]
    })
```

---

## Vision

### Image Analysis
```python
import base64

with open("image.jpg", "rb") as f:
    image_data = base64.b64encode(f.read()).decode()

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_data
                }
            },
            {"type": "text", "text": "Describe this"}
        ]
    }]
)
```

---

## Error Handling

### Python
```python
from anthropic import RateLimitError, APIError

try:
    response = client.messages.create(...)
except RateLimitError:
    # Wait and retry
    time.sleep(60)
except APIError as e:
    print(f"Error: {e}")
```

### TypeScript
```typescript
try {
  const response = await client.messages.create(...);
} catch (error) {
  if (error.status === 429) {
    // Rate limited
  } else if (error.status === 500) {
    // Server error
  }
}
```

---

## Environment Variables

```bash
# Required
export ANTHROPIC_API_KEY='your-key'

# Optional
export CLAUDE_MODEL='claude-sonnet-4-5-20250514'
export CLAUDE_MAX_TOKENS='2048'
export CLAUDE_TEMPERATURE='0.7'
```

---

## Rate Limits (Build Tier)

| Resource | Limit |
|----------|-------|
| Requests/min | 50 |
| Tokens/min | 100,000 |
| Tokens/day | 1,000,000 |

**Tip:** Use Batch API for bulk processing (50% cost reduction)

---

## Token Estimation

| Type | ~Tokens |
|------|---------|
| 1 word | ~1.3 tokens |
| 100 words | ~130 tokens |
| 1 page text | ~500 tokens |
| 1 code file | ~1000-5000 tokens |

**Tool:** Use `client.count_tokens(text)` for exact count

---

## Best Practices

### Do's
- ✓ Use system prompts for consistent behavior
- ✓ Provide clear, specific instructions
- ✓ Include examples for complex tasks
- ✓ Use appropriate model for task
- ✓ Implement retry logic
- ✓ Stream for better UX
- ✓ Monitor token usage

### Don'ts
- ✗ Don't exceed context window
- ✗ Don't ignore error handling
- ✗ Don't hard-code API keys
- ✗ Don't skip input validation
- ✗ Don't use wrong model for task
- ✗ Don't forget rate limits

---

## Performance Optimization

### Speed
```python
# Use Haiku for simple tasks
model = "claude-haiku-4-5-20250514"

# Enable streaming
stream = True

# Reduce max_tokens
max_tokens = 512  # Only what you need
```

### Cost
```python
# Use appropriate model
model = "claude-haiku-4-5-20250514"  # vs Opus

# Use prompt caching
# Reuse common context

# Use Batch API for bulk
# 50% cost reduction
```

### Quality
```python
# Use Opus for complex tasks
model = "claude-opus-4-5-20250514"

# Lower temperature for precision
temperature = 0.2

# Provide more context
# Include examples
```

---

## Common Patterns

### Retry with Backoff
```python
import time

def retry_with_backoff(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            if i == max_retries - 1:
                raise
            time.sleep(2 ** i)
```

### Conversation Manager
```python
class Conversation:
    def __init__(self):
        self.messages = []
    
    def add_user_message(self, content):
        self.messages.append({
            "role": "user",
            "content": content
        })
    
    def add_assistant_message(self, content):
        self.messages.append({
            "role": "assistant",
            "content": content
        })
    
    def get_messages(self):
        return self.messages
```

### Token Counter
```python
def estimate_tokens(text: str) -> int:
    """Rough estimation: 1 token ≈ 0.75 words"""
    words = len(text.split())
    return int(words * 1.3)

def fits_in_context(text: str, context_size: int = 200000) -> bool:
    return estimate_tokens(text) < context_size
```

---

## Keyboard Shortcuts (CLI)

| Key | Action |
|-----|--------|
| `Ctrl+C` | Cancel/Exit |
| `Ctrl+D` | End input |
| `Ctrl+L` | Clear screen |
| `Ctrl+R` | Search history |
| `Up/Down` | Navigate history |
| `Tab` | Auto-complete |

---

## HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process response |
| 400 | Bad Request | Fix parameters |
| 401 | Unauthorized | Check API key |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Retry later |

---

## Useful Snippets

### Read File and Ask
```python
with open("data.txt") as f:
    content = f.read()

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": f"Analyze this:\n\n{content}"
    }]
)
```

### JSON Output
```python
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": """Extract as JSON:
        Name: John Doe
        Email: john@example.com
        
        Return only valid JSON."""
    }]
)

import json
data = json.loads(response.content[0].text)
```

### Batch Processing
```python
requests = [
    {
        "custom_id": f"req-{i}",
        "params": {
            "model": "claude-sonnet-4-5-20250514",
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": item}]
        }
    }
    for i, item in enumerate(items)
]

batch = client.messages.batches.create(requests=requests)
```

---

## Debug Checklist

- [ ] API key is set correctly
- [ ] Model name is valid
- [ ] Messages format is correct
- [ ] Max tokens is specified
- [ ] Within rate limits
- [ ] Within context window
- [ ] Error handling implemented
- [ ] Retry logic in place
- [ ] Token usage monitored

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "field required" | Missing parameter | Add required field |
| "invalid api key" | Wrong/missing key | Check ANTHROPIC_API_KEY |
| "rate limit exceeded" | Too many requests | Implement backoff |
| "context length exceeded" | Too much input | Reduce context |
| "timeout" | Request too slow | Reduce max_tokens |

---

## Resources

- **API Docs**: https://docs.anthropic.com
- **Discord**: https://discord.gg/anthropic
- **Status**: https://status.anthropic.com
- **Support**: support@anthropic.com

---

## Print Version

*Optimized for printing - use landscape mode for best results*

---

*Last Updated: 2026-05-05*
*Version: 1.0*
