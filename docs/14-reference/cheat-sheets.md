# Visual Cheat Sheets and Quick Guides

*Print-friendly visual reference guides for Claude*

---

## Table of Contents

1. [API Quick Start](#api-quick-start)
2. [Prompt Engineering](#prompt-engineering)
3. [Model Selection](#model-selection)
4. [Error Handling](#error-handling)
5. [Performance Optimization](#performance-optimization)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

---

## API Quick Start

### Python Quick Reference

```python
# ============================================
# SETUP
# ============================================
import anthropic

client = anthropic.Anthropic(
    api_key="sk-ant-..."  # or env: ANTHROPIC_API_KEY
)

# ============================================
# BASIC MESSAGE
# ============================================
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.content[0].text)

# ============================================
# WITH SYSTEM PROMPT
# ============================================
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    system="You are a Python expert",
    messages=[
        {"role": "user", "content": "Explain async"}
    ]
)

# ============================================
# CONVERSATION
# ============================================
messages = [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"},
    {"role": "user", "content": "How are you?"}
]
response = client.messages.create(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=messages
)

# ============================================
# STREAMING
# ============================================
with client.messages.stream(
    model="claude-sonnet-4-5-20250514",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# ============================================
# ERROR HANDLING
# ============================================
from anthropic import RateLimitError, APIError

try:
    response = client.messages.create(...)
except RateLimitError:
    # Handle rate limit
    time.sleep(60)
except APIError as e:
    # Handle API error
    print(f"Error: {e}")
```

### TypeScript Quick Reference

```typescript
// ============================================
// SETUP
// ============================================
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ============================================
// BASIC MESSAGE
// ============================================
const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});
console.log(response.content[0].text);

// ============================================
// WITH SYSTEM PROMPT
// ============================================
const response = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  system: 'You are a TypeScript expert',
  messages: [
    { role: 'user', content: 'Explain async/await' }
  ]
});

// ============================================
// STREAMING
// ============================================
const stream = await client.messages.create({
  model: 'claude-sonnet-4-5-20250514',
  max_tokens: 1024,
  stream: true,
  messages: [{ role: 'user', content: 'Story' }]
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text);
  }
}

// ============================================
// ERROR HANDLING
// ============================================
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

## Prompt Engineering

### Basic Template

```
┌─────────────────────────────────────────┐
│ [ROLE]                                  │
│ You are a [expertise] with [skills]    │
│                                         │
│ [CONTEXT]                               │
│ Current situation:                      │
│ - Point 1                               │
│ - Point 2                               │
│                                         │
│ [TASK]                                  │
│ Please [action] by:                     │
│ 1. Step 1                               │
│ 2. Step 2                               │
│                                         │
│ [CONSTRAINTS]                           │
│ - Keep it concise                       │
│ - Use examples                          │
│                                         │
│ [OUTPUT FORMAT]                         │
│ Provide output as [format]              │
└─────────────────────────────────────────┘
```

### Prompt Quality Checklist

```
✓ Clear objective
✓ Specific instructions
✓ Relevant context
✓ Constraints defined
✓ Output format specified
✓ Examples provided (if needed)
✓ Edge cases covered
✓ No ambiguity
```

### Common Techniques

| Technique | Use When | Example |
|-----------|----------|---------|
| **Zero-Shot** | Simple, clear task | "Translate to French: Hello" |
| **Few-Shot** | Pattern needed | "Happy→Positive, Sad→Negative, Angry→?" |
| **Chain-of-Thought** | Complex reasoning | "Let's solve step by step:" |
| **System Prompt** | Consistent behavior | "You are a helpful assistant" |
| **XML Tags** | Structure clarity | `<context>...</context>` |

---

## Model Selection

### Decision Tree

```
                    START
                      │
          ┌───────────┼───────────┐
          │                       │
    Need Speed?              Need Quality?
          │                       │
        YES                     YES
          │                       │
          ▼                       ▼
      ┌────────┐            ┌────────┐
      │ HAIKU  │            │  OPUS  │
      └────────┘            └────────┘
          │                       │
       < 1s                   Best
     response                results
          
          │
        NO? → SONNET (Balanced)
                  │
            Good quality
         Reasonable cost
```

### Quick Comparison

```
╔══════════════════════════════════════════╗
║              MODEL MATRIX                ║
╠══════════════════════════════════════════╣
║                                          ║
║  OPUS      ████████████  Capability     ║
║            ████          Speed          ║
║            ████████████  Cost           ║
║                                          ║
║  SONNET    ████████      Capability     ║
║            ████████      Speed          ║
║            ████████      Cost           ║
║                                          ║
║  HAIKU     ████████      Capability     ║
║            ████████████  Speed          ║
║            ████          Cost           ║
║                                          ║
╚══════════════════════════════════════════╝
```

### Use Case Guide

```
┌─────────────────────────────────────────┐
│ SIMPLE TASKS                            │
│ • FAQ answering           → Haiku       │
│ • Classification          → Haiku       │
│ • Simple extraction       → Haiku       │
├─────────────────────────────────────────┤
│ BALANCED TASKS                          │
│ • Code generation         → Sonnet      │
│ • Content writing         → Sonnet      │
│ • Data analysis           → Sonnet      │
├─────────────────────────────────────────┤
│ COMPLEX TASKS                           │
│ • Research                → Opus        │
│ • Architecture design     → Opus        │
│ • Novel problem solving   → Opus        │
└─────────────────────────────────────────┘
```

---

## Error Handling

### HTTP Status Codes

```
┌──────┬────────────────┬────────────────┐
│ Code │ Meaning        │ Action         │
├──────┼────────────────┼────────────────┤
│ 200  │ Success        │ Process result │
│ 400  │ Bad Request    │ Fix parameters │
│ 401  │ Unauthorized   │ Check API key  │
│ 429  │ Rate Limited   │ Wait & retry   │
│ 500  │ Server Error   │ Retry later    │
│ 529  │ Overloaded     │ Exponential BO │
└──────┴────────────────┴────────────────┘
```

### Retry Strategy

```python
# ============================================
# EXPONENTIAL BACKOFF
# ============================================
import time

def retry_with_backoff(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except RateLimitError:
            if i == max_retries - 1:
                raise
            delay = 2 ** i  # 1s, 2s, 4s
            time.sleep(delay)

# ============================================
# USAGE
# ============================================
result = retry_with_backoff(
    lambda: client.messages.create(...)
)
```

### Error Response Template

```json
{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded"
  }
}
```

---

## Performance Optimization

### Speed Optimization

```
┌─────────────────────────────────────────┐
│ FAST RESPONSE TECHNIQUES                │
├─────────────────────────────────────────┤
│ 1. Use Haiku for simple tasks           │
│    Speed gain: 3-5x                     │
│                                         │
│ 2. Enable streaming                     │
│    Perceived latency: -50%              │
│                                         │
│ 3. Reduce max_tokens                    │
│    Only request what you need           │
│                                         │
│ 4. Optimize prompt length               │
│    Shorter prompts = faster start       │
│                                         │
│ 5. Use prompt caching                   │
│    Cache common context                 │
└─────────────────────────────────────────┘
```

### Cost Optimization

```
┌─────────────────────────────────────────┐
│ COST REDUCTION STRATEGIES               │
├─────────────────────────────────────────┤
│ 1. Right-size model                     │
│    Use Haiku when possible              │
│    Savings: Up to 95%                   │
│                                         │
│ 2. Batch processing                     │
│    Use Batch API                        │
│    Savings: 50%                         │
│                                         │
│ 3. Prompt caching                       │
│    Cache common prefixes                │
│    Savings: 90% on cached tokens        │
│                                         │
│ 4. Output optimization                  │
│    Set appropriate max_tokens           │
│    Savings: 20-40%                      │
│                                         │
│ 5. Smart routing                        │
│    Haiku for screening                  │
│    Savings: 60-80% overall              │
└─────────────────────────────────────────┘
```

### Token Usage

```
┌─────────────────────────────────────────┐
│ TOKEN ESTIMATION                        │
├─────────────────────────────────────────┤
│ 1 word        ≈ 1.3 tokens              │
│ 100 words     ≈ 130 tokens              │
│ 1 page text   ≈ 500 tokens              │
│ 1 code file   ≈ 1000-5000 tokens        │
│                                         │
│ FORMULA:                                │
│ tokens ≈ words × 1.3                    │
│                                         │
│ COST CALCULATION:                       │
│ Input:  tokens × $3/1M  (Sonnet)        │
│ Output: tokens × $15/1M (Sonnet)        │
└─────────────────────────────────────────┘
```

---

## Common Patterns

### Pattern: Single Request

```
┌─────────┐
│  User   │
└────┬────┘
     │ Query
     ▼
┌─────────┐
│ Claude  │
└────┬────┘
     │ Response
     ▼
┌─────────┐
│  User   │
└─────────┘
```

### Pattern: Chain

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│ Input   │────▶│Process 1│────▶│Process 2│
└─────────┘     └─────────┘     └─────────┘
                     │               │
                     ▼               ▼
                ┌─────────┐     ┌─────────┐
                │ Result 1│────▶│ Final   │
                └─────────┘     └─────────┘
```

### Pattern: Tool Use

```
┌─────────┐
│  User   │
└────┬────┘
     │ Request
     ▼
┌─────────┐
│ Claude  │──┐
└────┬────┘  │
     │       │ Tool Call
     │       ▼
     │  ┌─────────┐
     │  │  Tool   │
     │  └────┬────┘
     │       │ Result
     │  ┌────▼────┐
     │  │ Claude  │
     │  └────┬────┘
     │       │ Response
     ▼       ▼
┌─────────────┐
│    User     │
└─────────────┘
```

### Pattern: Batch

```
┌────────────────────────────────┐
│         Input Items            │
│  [Item1, Item2, ..., ItemN]    │
└────────┬───────────────────────┘
         │
    ┌────┼────┬────────┬────────┐
    │    │    │        │        │
    ▼    ▼    ▼        ▼        ▼
 ┌───┐┌───┐┌───┐    ┌───┐    ┌───┐
 │ C ││ C ││ C │ .. │ C │    │ C │
 └─┬─┘└─┬─┘└─┬─┘    └─┬─┘    └─┬─┘
   │    │    │        │        │
   └────┼────┴────────┴────────┘
        │
        ▼
   ┌─────────┐
   │Aggregate│
   └─────────┘
```

---

## Troubleshooting

### Diagnostic Flowchart

```
Problem?
   │
   ├─ Connection Error
   │  ├─ Check API key
   │  ├─ Check network
   │  └─ Check firewall
   │
   ├─ Rate Limited
   │  ├─ Implement backoff
   │  ├─ Reduce requests
   │  └─ Use Batch API
   │
   ├─ Slow Response
   │  ├─ Use Haiku
   │  ├─ Enable streaming
   │  └─ Reduce context
   │
   ├─ Poor Quality
   │  ├─ Use Opus
   │  ├─ Improve prompt
   │  └─ Add examples
   │
   └─ High Cost
      ├─ Use Haiku
      ├─ Optimize tokens
      └─ Enable caching
```

### Quick Fixes

```
┌─────────────────────────────────────────┐
│ ISSUE: API key invalid                  │
│ FIX:   export ANTHROPIC_API_KEY="..."   │
├─────────────────────────────────────────┤
│ ISSUE: Rate limited                     │
│ FIX:   time.sleep(60) and retry         │
├─────────────────────────────────────────┤
│ ISSUE: Response too slow                │
│ FIX:   Use Haiku or streaming           │
├─────────────────────────────────────────┤
│ ISSUE: Context too large                │
│ FIX:   Reduce input or summarize        │
├─────────────────────────────────────────┤
│ ISSUE: Poor output quality              │
│ FIX:   Better prompt or use Opus        │
└─────────────────────────────────────────┘
```

### Debug Checklist

```
[ ] API key is set
[ ] Model name is correct
[ ] Messages format is valid
[ ] max_tokens is specified
[ ] Within rate limits
[ ] Within context window
[ ] Network connectivity OK
[ ] Error handling implemented
[ ] Logging enabled
[ ] Timeout set appropriately
```

---

## Parameter Reference

### Common Parameters

```
┌──────────────┬──────────┬─────────┬──────────┐
│ Parameter    │ Type     │ Range   │ Default  │
├──────────────┼──────────┼─────────┼──────────┤
│ model        │ string   │ -       │ required │
│ max_tokens   │ int      │ 1-4096+ │ required │
│ temperature  │ float    │ 0.0-1.0 │ 1.0      │
│ top_p        │ float    │ 0.0-1.0 │ -        │
│ top_k        │ int      │ 1-500   │ -        │
│ stream       │ bool     │ T/F     │ false    │
└──────────────┴──────────┴─────────┴──────────┘
```

### Temperature Guide

```
0.0  ──────────────────────────────── 1.0
│         │         │         │         │
│         │         │         │         │
Deterministic   Balanced   Creative   Random
│         │         │         │         │
Code      Tech     Content   Fiction  Poetry
Review    Docs     Writing   Writing
```

### Model IDs

```
OPUS:   claude-opus-4-5-20250514
SONNET: claude-sonnet-4-5-20250514
HAIKU:  claude-haiku-4-5-20250514
```

---

## Cost Calculator

### Quick Cost Estimate

```python
# ============================================
# COST CALCULATOR
# ============================================
def estimate_cost(input_tokens, output_tokens, model="sonnet"):
    rates = {
        "opus": {"input": 15, "output": 75},
        "sonnet": {"input": 3, "output": 15},
        "haiku": {"input": 0.25, "output": 1.25}
    }
    
    rate = rates[model]
    input_cost = (input_tokens / 1_000_000) * rate["input"]
    output_cost = (output_tokens / 1_000_000) * rate["output"]
    
    return input_cost + output_cost

# Example: 1000 input, 500 output with Sonnet
cost = estimate_cost(1000, 500, "sonnet")
# Result: $0.0105
```

### Cost Comparison Table

```
┌──────────┬─────────┬─────────┬─────────┐
│ Scenario │  Opus   │ Sonnet  │  Haiku  │
├──────────┼─────────┼─────────┼─────────┤
│ 1K calls │ $20.00  │  $4.00  │  $0.35  │
│ 10K      │ $200    │  $40    │  $3.50  │
│ 100K     │ $2,000  │  $400   │  $35    │
│ 1M       │ $20,000 │  $4,000 │  $350   │
└──────────┴─────────┴─────────┴─────────┘

Assumptions:
- 100 input + 50 output tokens per call
- No caching applied
```

---

## Environment Setup

### Quick Setup Script

```bash
#!/bin/bash
# ============================================
# CLAUDE SETUP SCRIPT
# ============================================

# Install SDK
pip install anthropic
# or: npm install @anthropic-ai/sdk

# Set API key
export ANTHROPIC_API_KEY='sk-ant-...'

# Add to shell profile
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
source ~/.bashrc

# Verify
python -c "import anthropic; print('Setup OK')"
```

### Configuration File

```json
{
  "version": "1.0",
  "model": "claude-sonnet-4-5-20250514",
  "max_tokens": 4096,
  "temperature": 1.0,
  "streaming": true,
  "caching": true
}
```

---

## Print-Friendly Summary

```
╔════════════════════════════════════════════╗
║       CLAUDE QUICK REFERENCE CARD          ║
╠════════════════════════════════════════════╣
║                                            ║
║ MODELS:                                    ║
║   Opus   - Most capable, slowest          ║
║   Sonnet - Balanced (recommended)         ║
║   Haiku  - Fastest, cheapest              ║
║                                            ║
║ BASIC API CALL (Python):                   ║
║   client.messages.create(                  ║
║     model="claude-sonnet-4-5-20250514",    ║
║     max_tokens=1024,                       ║
║     messages=[{                            ║
║       "role": "user",                      ║
║       "content": "Hello"                   ║
║     }]                                     ║
║   )                                        ║
║                                            ║
║ KEY PARAMETERS:                            ║
║   max_tokens   - Output length (required)  ║
║   temperature  - 0 (focused) to 1 (random) ║
║   system       - System instructions       ║
║   stream       - Enable streaming          ║
║                                            ║
║ COMMON ERRORS:                             ║
║   401 - Check API key                      ║
║   429 - Rate limited, wait & retry         ║
║   500 - Server error, retry later          ║
║                                            ║
║ BEST PRACTICES:                            ║
║   ✓ Use appropriate model for task         ║
║   ✓ Implement error handling               ║
║   ✓ Enable streaming for better UX         ║
║   ✓ Set reasonable max_tokens              ║
║   ✓ Use prompt caching when possible       ║
║                                            ║
║ RESOURCES:                                 ║
║   Docs: docs.anthropic.com                 ║
║   API:  api.anthropic.com                  ║
║                                            ║
╚════════════════════════════════════════════╝
```

---

## Related Resources

- **API Reference**: Complete API documentation
- **Command Reference**: CLI commands
- **Quick Reference**: Text-based cheat sheet
- **Glossary**: Term definitions

---

*Print this page in landscape mode for best results*

---

*Last Updated: 2026-05-05*
*Version: 1.0*
