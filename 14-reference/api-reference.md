# API Reference and Examples

*Complete API reference for Claude with practical examples*

---

## Table of Contents

1. [Authentication](#authentication)
2. [Messages API](#messages-api)
3. [Streaming](#streaming)
4. [Tool Use](#tool-use)
5. [Vision](#vision)
6. [Batch API](#batch-api)
7. [Model Management](#model-management)
8. [Error Handling](#error-handling)
9. [Rate Limits](#rate-limits)
10. [Code Examples](#code-examples)

---

## Authentication

### API Key Setup

```bash
# Set environment variable
export ANTHROPIC_API_KEY='your-api-key-here'
```

### Authentication Headers

```http
POST /v1/messages HTTP/1.1
Host: api.anthropic.com
x-api-key: your-api-key-here
anthropic-version: 2023-06-01
Content-Type: application/json
```

### SDKs

**Python:**
```python
import anthropic

client = anthropic.Anthropic(
    api_key="your-api-key-here"
)
```

**TypeScript:**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
```

**cURL:**
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json"
```

---

## Messages API

### Basic Message

**Endpoint:** `POST /v1/messages`

#### Request

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "Hello, Claude!"
    }
  ]
}
```

#### Response

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5-20250514",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 12,
    "output_tokens": 10
  }
}
```

### Message Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | string | Yes | Model identifier |
| `messages` | array | Yes | Conversation messages |
| `max_tokens` | integer | Yes | Maximum tokens to generate |
| `temperature` | float | No | Randomness (0.0-1.0) |
| `top_p` | float | No | Nucleus sampling (0.0-1.0) |
| `top_k` | integer | No | Top-k sampling |
| `stop_sequences` | array | No | Custom stop sequences |
| `stream` | boolean | No | Enable streaming |
| `system` | string | No | System prompt |
| `metadata` | object | No | Additional metadata |

### System Prompt

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "system": "You are a helpful AI assistant specialized in Python programming.",
  "messages": [
    {
      "role": "user",
      "content": "How do I read a CSV file?"
    }
  ]
}
```

### Multi-Turn Conversation

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": "What's the capital of France?"
    },
    {
      "role": "assistant",
      "content": "The capital of France is Paris."
    },
    {
      "role": "user",
      "content": "What's its population?"
    }
  ]
}
```

---

## Streaming

### Streaming Request

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "stream": true,
  "messages": [
    {
      "role": "user",
      "content": "Write a haiku about coding."
    }
  ]
}
```

### Stream Events

#### Message Start
```json
{
  "type": "message_start",
  "message": {
    "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
    "type": "message",
    "role": "assistant",
    "content": [],
    "model": "claude-sonnet-4-5-20250514",
    "stop_reason": null,
    "usage": {
      "input_tokens": 15,
      "output_tokens": 0
    }
  }
}
```

#### Content Block Start
```json
{
  "type": "content_block_start",
  "index": 0,
  "content_block": {
    "type": "text",
    "text": ""
  }
}
```

#### Content Block Delta
```json
{
  "type": "content_block_delta",
  "index": 0,
  "delta": {
    "type": "text_delta",
    "text": "Code "
  }
}
```

#### Message Delta
```json
{
  "type": "message_delta",
  "delta": {
    "stop_reason": "end_turn",
    "stop_sequence": null
  },
  "usage": {
    "output_tokens": 23
  }
}
```

### Python Streaming Example

```python
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Write a story."}
    ]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### TypeScript Streaming Example

```typescript
const stream = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  stream: true,
  messages: [
    { role: 'user', content: 'Write a story.' }
  ]
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text);
  }
}
```

---

## Tool Use

### Defining Tools

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "input_schema": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "City name, e.g. 'San Francisco'"
          },
          "unit": {
            "type": "string",
            "enum": ["celsius", "fahrenheit"],
            "description": "Temperature unit"
          }
        },
        "required": ["location"]
      }
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "What's the weather in Paris?"
    }
  ]
}
```

### Tool Use Response

```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_01A09q90qw90lq917835lq9",
      "name": "get_weather",
      "input": {
        "location": "Paris",
        "unit": "celsius"
      }
    }
  ],
  "stop_reason": "tool_use"
}
```

### Providing Tool Results

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "tools": [...],
  "messages": [
    {
      "role": "user",
      "content": "What's the weather in Paris?"
    },
    {
      "role": "assistant",
      "content": [
        {
          "type": "tool_use",
          "id": "toolu_01A09q90qw90lq917835lq9",
          "name": "get_weather",
          "input": {
            "location": "Paris",
            "unit": "celsius"
          }
        }
      ]
    },
    {
      "role": "user",
      "content": [
        {
          "type": "tool_result",
          "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
          "content": "15°C, partly cloudy"
        }
      ]
    }
  ]
}
```

### Python Tool Use Example

```python
import anthropic

client = anthropic.Anthropic()

def get_weather(location: str, unit: str = "celsius") -> str:
    # Call actual weather API
    return f"Weather in {location}: 15°{unit[0].upper()}"

tools = [{
    "name": "get_weather",
    "description": "Get current weather",
    "input_schema": {
        "type": "object",
        "properties": {
            "location": {"type": "string"},
            "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
        },
        "required": ["location"]
    }
}]

messages = [{"role": "user", "content": "What's the weather in Tokyo?"}]

response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    tools=tools,
    messages=messages
)

# Process tool use
if response.stop_reason == "tool_use":
    tool_use = next(block for block in response.content if block.type == "tool_use")
    
    # Execute tool
    result = get_weather(**tool_use.input)
    
    # Send result back
    messages.extend([
        {"role": "assistant", "content": response.content},
        {"role": "user", "content": [
            {
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": result
            }
        ]}
    ])
    
    # Get final response
    final_response = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        tools=tools,
        messages=messages
    )
    
    print(final_response.content[0].text)
```

---

## Vision

### Image Input (Base64)

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "base64",
            "media_type": "image/jpeg",
            "data": "/9j/4AAQSkZJRg..."
          }
        },
        {
          "type": "text",
          "text": "What's in this image?"
        }
      ]
    }
  ]
}
```

### Image Input (URL)

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image",
          "source": {
            "type": "url",
            "url": "https://example.com/image.jpg"
          }
        },
        {
          "type": "text",
          "text": "Describe this image"
        }
      ]
    }
  ]
}
```

### Multiple Images

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 1024,
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Compare these two images:"
        },
        {
          "type": "image",
          "source": {
            "type": "url",
            "url": "https://example.com/image1.jpg"
          }
        },
        {
          "type": "image",
          "source": {
            "type": "url",
            "url": "https://example.com/image2.jpg"
          }
        }
      ]
    }
  ]
}
```

### Python Vision Example

```python
import anthropic
import base64

client = anthropic.Anthropic()

# Read and encode image
with open("image.jpg", "rb") as image_file:
    image_data = base64.standard_b64encode(image_file.read()).decode("utf-8")

message = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[
        {
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
                {
                    "type": "text",
                    "text": "Analyze this image"
                }
            ]
        }
    ]
)

print(message.content[0].text)
```

---

## Batch API

### Create Batch

**Endpoint:** `POST /v1/messages/batches`

```json
{
  "requests": [
    {
      "custom_id": "request-1",
      "params": {
        "model": "claude-sonnet-4-5-20250514",
        "max_tokens": 1024,
        "messages": [
          {"role": "user", "content": "Translate 'Hello' to French"}
        ]
      }
    },
    {
      "custom_id": "request-2",
      "params": {
        "model": "claude-sonnet-4-5-20250514",
        "max_tokens": 1024,
        "messages": [
          {"role": "user", "content": "Translate 'Goodbye' to Spanish"}
        ]
      }
    }
  ]
}
```

### Response

```json
{
  "id": "batch_01Hw4V7FQywHR9zXxKZZQY2K",
  "type": "message_batch",
  "processing_status": "in_progress",
  "request_counts": {
    "processing": 2,
    "succeeded": 0,
    "errored": 0,
    "canceled": 0,
    "expired": 0
  },
  "created_at": "2024-05-05T12:00:00.000000Z",
  "expires_at": "2024-05-06T12:00:00.000000Z"
}
```

### Retrieve Batch

**Endpoint:** `GET /v1/messages/batches/{batch_id}`

```bash
curl https://api.anthropic.com/v1/messages/batches/batch_01Hw4V7FQywHR9zXxKZZQY2K \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01"
```

### Retrieve Results

**Endpoint:** `GET /v1/messages/batches/{batch_id}/results`

```jsonl
{"custom_id": "request-1", "result": {"type": "succeeded", "message": {...}}}
{"custom_id": "request-2", "result": {"type": "succeeded", "message": {...}}}
```

### Python Batch Example

```python
import anthropic

client = anthropic.Anthropic()

# Create batch
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": f"request-{i}",
            "params": {
                "model": "claude-sonnet-4-5-20250514",
                "max_tokens": 1024,
                "messages": [
                    {"role": "user", "content": f"Summarize item {i}"}
                ]
            }
        }
        for i in range(100)
    ]
)

print(f"Batch ID: {batch.id}")

# Check status
status = client.messages.batches.retrieve(batch.id)
print(f"Status: {status.processing_status}")

# Get results when complete
if status.processing_status == "ended":
    results = client.messages.batches.results(batch.id)
    for result in results:
        print(f"{result.custom_id}: {result.result.message.content[0].text}")
```

---

## Model Management

### Available Models

| Model ID | Name | Context | Use Case |
|----------|------|---------|----------|
| `claude-opus-4-5-20250514` | Opus 4.5 | 200K | Most capable |
| `claude-sonnet-4-5-20250514` | Sonnet 4.5 | 200K | Balanced |
| `claude-haiku-4-5-20250514` | Haiku 4.5 | 200K | Fast & efficient |

### Model Selection

```python
# For complex reasoning
response = client.messages.create(
    model="claude-opus-4-5-20250514",
    max_tokens=4096,
    messages=[...]
)

# For balanced performance
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=2048,
    messages=[...]
)

# For quick responses
response = client.messages.create(
    model="claude-haiku-4-5-20250514",
    max_tokens=1024,
    messages=[...]
)
```

---

## Error Handling

### Error Response Format

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "messages: field required"
  }
}
```

### Error Types

| Error Type | HTTP Status | Description |
|------------|-------------|-------------|
| `invalid_request_error` | 400 | Invalid request parameters |
| `authentication_error` | 401 | Invalid or missing API key |
| `permission_error` | 403 | Insufficient permissions |
| `not_found_error` | 404 | Resource not found |
| `rate_limit_error` | 429 | Rate limit exceeded |
| `api_error` | 500 | Internal server error |
| `overloaded_error` | 529 | Service overloaded |

### Python Error Handling

```python
import anthropic
from anthropic import (
    APIError,
    RateLimitError,
    AuthenticationError,
    BadRequestError
)

client = anthropic.Anthropic()

try:
    message = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except RateLimitError as e:
    print(f"Rate limit exceeded: {e}")
    # Implement backoff/retry
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
    # Check API key
except BadRequestError as e:
    print(f"Bad request: {e}")
    # Fix request parameters
except APIError as e:
    print(f"API error: {e}")
    # Handle server errors
```

### Retry Logic

```python
import time
from anthropic import RateLimitError

def create_message_with_retry(client, **kwargs):
    max_retries = 3
    base_delay = 1
    
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt)
            print(f"Rate limited. Retrying in {delay}s...")
            time.sleep(delay)
```

---

## Rate Limits

### Rate Limit Headers

```http
HTTP/1.1 200 OK
anthropic-ratelimit-requests-limit: 1000
anthropic-ratelimit-requests-remaining: 950
anthropic-ratelimit-requests-reset: 2024-05-05T00:00:00Z
anthropic-ratelimit-tokens-limit: 100000
anthropic-ratelimit-tokens-remaining: 85000
anthropic-ratelimit-tokens-reset: 2024-05-05T00:00:00Z
```

### Rate Limit Tiers

| Tier | Requests/min | Tokens/min | Tokens/day |
|------|-------------|------------|------------|
| Free | 5 | 10,000 | 100,000 |
| Build | 50 | 100,000 | 1,000,000 |
| Scale | 1,000 | 400,000 | 4,000,000 |
| Enterprise | Custom | Custom | Custom |

### Handling Rate Limits

```python
def check_rate_limits(response_headers):
    requests_remaining = int(response_headers.get(
        'anthropic-ratelimit-requests-remaining', 0
    ))
    tokens_remaining = int(response_headers.get(
        'anthropic-ratelimit-tokens-remaining', 0
    ))
    
    if requests_remaining < 10:
        print(f"Warning: Only {requests_remaining} requests remaining")
    
    if tokens_remaining < 1000:
        print(f"Warning: Only {tokens_remaining} tokens remaining")
```

---

## Code Examples

### Complete Python Application

```python
import anthropic
import os
from typing import List, Dict

class ClaudeAssistant:
    def __init__(self, model: str = "claude-sonnet-4-5-20250514"):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )
        self.model = model
        self.conversation: List[Dict] = []
    
    def send_message(self, content: str, system: str = None) -> str:
        """Send a message and get response"""
        self.conversation.append({
            "role": "user",
            "content": content
        })
        
        kwargs = {
            "model": self.model,
            "max_tokens": 2048,
            "messages": self.conversation
        }
        
        if system:
            kwargs["system"] = system
        
        try:
            response = self.client.messages.create(**kwargs)
            
            assistant_message = response.content[0].text
            self.conversation.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return assistant_message
            
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def stream_message(self, content: str):
        """Stream a message response"""
        self.conversation.append({
            "role": "user",
            "content": content
        })
        
        full_response = ""
        
        with self.client.messages.stream(
            model=self.model,
            max_tokens=2048,
            messages=self.conversation
        ) as stream:
            for text in stream.text_stream:
                print(text, end="", flush=True)
                full_response += text
        
        print()  # New line after stream
        
        self.conversation.append({
            "role": "assistant",
            "content": full_response
        })
    
    def clear_conversation(self):
        """Clear conversation history"""
        self.conversation = []
    
    def get_usage(self) -> Dict:
        """Get token usage statistics"""
        # Implement usage tracking
        pass

# Usage
if __name__ == "__main__":
    assistant = ClaudeAssistant()
    
    # Regular message
    response = assistant.send_message(
        "Explain quantum computing in simple terms"
    )
    print(response)
    
    # Streaming message
    assistant.stream_message(
        "Now explain it to a 5-year-old"
    )
```

### Complete TypeScript Application

```typescript
import Anthropic from '@anthropic-ai/sdk';

class ClaudeAssistant {
  private client: Anthropic;
  private model: string;
  private conversation: Anthropic.MessageParam[];

  constructor(model: string = 'claude-sonnet-4-5-20250514') {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.model = model;
    this.conversation = [];
  }

  async sendMessage(content: string, system?: string): Promise<string> {
    this.conversation.push({
      role: 'user',
      content: content
    });

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 2048,
        messages: this.conversation,
        ...(system && { system })
      });

      const assistantMessage = response.content[0].text;
      
      this.conversation.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async streamMessage(content: string): Promise<void> {
    this.conversation.push({
      role: 'user',
      content: content
    });

    let fullResponse = '';

    const stream = await this.client.messages.create({
      model: this.model,
      max_tokens: 2048,
      messages: this.conversation,
      stream: true
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && 
          event.delta.type === 'text_delta') {
        process.stdout.write(event.delta.text);
        fullResponse += event.delta.text;
      }
    }

    console.log();  // New line

    this.conversation.push({
      role: 'assistant',
      content: fullResponse
    });
  }

  clearConversation(): void {
    this.conversation = [];
  }
}

// Usage
async function main() {
  const assistant = new ClaudeAssistant();

  // Regular message
  const response = await assistant.sendMessage(
    'Explain quantum computing'
  );
  console.log(response);

  // Streaming message
  await assistant.streamMessage(
    'Explain it simply'
  );
}

main();
```

---

## Related Resources

- **Command Reference**: CLI commands
- **Configuration Options**: API configuration
- **Model Comparison**: Model capabilities
- **Tool Matrix**: Tool use patterns

---

*Last Updated: 2026-05-05*
*Version: 1.0*
