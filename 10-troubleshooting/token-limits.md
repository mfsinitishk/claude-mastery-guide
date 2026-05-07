# Token Limit Problems

## Overview

Token limit issues are among the most common challenges when working with Claude. Understanding token economics, implementing efficient strategies, and managing limits effectively is crucial for successful applications. This guide covers token-related problems and their solutions.

## Understanding Token Limits

### Token Specifications by Model

| Model | Input Limit | Output Limit | Cost per 1M Input | Cost per 1M Output |
|-------|-------------|--------------|-------------------|-------------------|
| Claude Opus 4 | 200K | 16K | $15 | $75 |
| Claude Sonnet 4.5 | 200K | 16K | $3 | $15 |
| Claude Haiku 4 | 200K | 16K | $0.80 | $4 |

### Token Counting Fundamentals

Approximate token counts:
- 1 token ≈ 4 characters (English text)
- 1 token ≈ 0.75 words (English text)
- Code is generally more token-dense
- Special characters and formatting count as tokens

## Common Token Limit Issues

### Issue: Output Truncated at Token Limit

**Problem Description:**
Claude's response is cut off mid-sentence or mid-code block when hitting the 16K output token limit, resulting in incomplete or unusable responses.

**Diagnostic Steps:**

1. Check if response was truncated
```javascript
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 16384,
  messages: [{ role: 'user', content: prompt }]
});

// Check stop reason
if (response.stop_reason === 'max_tokens') {
  console.log('Response truncated at token limit');
  console.log('Tokens used:', response.usage.output_tokens);
}
```

2. Measure typical response sizes
```javascript
// Track response sizes over time
const responseSizes = [];

function trackResponseSize(response) {
  responseSizes.push({
    timestamp: Date.now(),
    tokens: response.usage.output_tokens,
    truncated: response.stop_reason === 'max_tokens'
  });

  // Alert if frequently hitting limit
  const recentTruncations = responseSizes
    .slice(-10)
    .filter(r => r.truncated).length;
  
  if (recentTruncations > 3) {
    console.warn('Frequently hitting output limit');
  }
}
```

3. Analyze request patterns
```bash
# Review logs for truncation patterns
grep "max_tokens" ~/.claude/logs/*.log | \
  awk '{print $2}' | \
  sort | uniq -c | sort -rn
```

**Solutions:**

Step 1: Request Chunked Responses
```javascript
async function getChunkedResponse(prompt) {
  const chunks = [];
  let continueToken = null;
  let iteration = 0;
  const maxIterations = 5;

  while (iteration < maxIterations) {
    const currentPrompt = continueToken
      ? `${prompt}\n\nContinue from where you left off.`
      : prompt;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 16384,
      messages: [{ role: 'user', content: currentPrompt }]
    });

    chunks.push(response.content[0].text);

    if (response.stop_reason === 'end_turn') {
      break; // Complete response
    }

    // Prepare for continuation
    continueToken = response.content[0].text;
    iteration++;
  }

  return chunks.join('\n\n');
}
```

Step 2: Break Task into Smaller Subtasks
```javascript
async function decomposeTask(largeTask) {
  // First, ask Claude to break down the task
  const decomposition = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: `Break this large task into smaller, independent subtasks 
        that can each be completed within 5000 tokens:
        
        ${largeTask}
        
        Return as JSON array of subtasks.`
      }
    ]
  });

  const subtasks = JSON.parse(decomposition.content[0].text);

  // Execute each subtask
  const results = [];
  for (const subtask of subtasks) {
    const result = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 8000,
      messages: [
        {
          role: 'user',
          content: subtask
        }
      ]
    });

    results.push({
      task: subtask,
      result: result.content[0].text
    });
  }

  // Optionally combine results
  return results;
}
```

Step 3: Use Streaming to Handle Interruptions
```javascript
async function streamWithContinuation(prompt) {
  let fullResponse = '';
  let shouldContinue = true;

  while (shouldContinue) {
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 16384,
      messages: [
        {
          role: 'user',
          content: shouldContinue === true 
            ? prompt 
            : `Continue from: "${fullResponse.slice(-200)}"`
        }
      ],
      stream: true
    });

    let currentChunk = '';
    let hitLimit = false;

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        currentChunk += event.delta.text;
        process.stdout.write(event.delta.text);
      }
      
      if (event.type === 'message_stop') {
        if (event.message.stop_reason === 'max_tokens') {
          hitLimit = true;
        }
      }
    }

    fullResponse += currentChunk;
    shouldContinue = hitLimit;
  }

  return fullResponse;
}
```

**Prevention Strategies:**
- Design prompts that naturally fit within limits
- Request structured outputs with known size bounds
- Use iterative approaches for large generations
- Set max_tokens conservatively and use continuation
- Monitor and alert on frequent truncations

**Related Issues:** Incomplete code, cut-off explanations, malformed outputs

**When to Escalate:** If task genuinely requires >16K output in single response, redesign approach or split task.

---

### Issue: Input Context Too Large

**Problem Description:**
Total input (system + messages + attachments) exceeds 200K token limit, causing request rejection.

**Diagnostic Steps:**

1. Calculate total input tokens
```javascript
async function calculateInputTokens(system, messages, attachments) {
  let total = 0;
  
  // System prompt
  total += await client.count_tokens(system);
  
  // Messages
  for (const msg of messages) {
    total += await client.count_tokens(msg.content);
  }
  
  // Attachments
  for (const file of attachments) {
    const content = await fs.readFile(file, 'utf-8');
    total += await client.count_tokens(content);
  }
  
  console.log(`Total input tokens: ${total}`);
  console.log(`Remaining capacity: ${200000 - total}`);
  
  return total;
}
```

2. Identify largest contributors
```javascript
async function analyzeInputComposition(request) {
  const breakdown = {
    system: await client.count_tokens(request.system),
    messages: {},
    attachments: {}
  };

  for (let i = 0; i < request.messages.length; i++) {
    breakdown.messages[`message_${i}`] = 
      await client.count_tokens(request.messages[i].content);
  }

  // Sort by size
  const sorted = Object.entries(breakdown.messages)
    .sort((a, b) => b[1] - a[1]);

  console.log('Input composition:');
  console.log(`System: ${breakdown.system} tokens`);
  sorted.forEach(([key, tokens]) => {
    console.log(`${key}: ${tokens} tokens`);
  });

  return breakdown;
}
```

3. Track input growth over session
```javascript
class InputTracker {
  constructor() {
    this.history = [];
  }

  record(tokens) {
    this.history.push({
      timestamp: Date.now(),
      tokens,
      delta: this.history.length > 0 
        ? tokens - this.history[this.history.length - 1].tokens 
        : 0
    });
  }

  getGrowthRate() {
    if (this.history.length < 2) return 0;
    
    const recent = this.history.slice(-5);
    const avgDelta = recent.reduce((sum, h) => sum + h.delta, 0) / recent.length;
    
    return avgDelta;
  }

  predictLimit(currentTokens) {
    const growthRate = this.getGrowthRate();
    if (growthRate <= 0) return Infinity;
    
    const remaining = 200000 - currentTokens;
    return Math.floor(remaining / growthRate);
  }
}
```

**Solutions:**

Step 1: Implement Aggressive Summarization
```javascript
class AggressiveSummarizer {
  async reduce(content, targetTokens) {
    const currentTokens = await client.count_tokens(content);
    
    if (currentTokens <= targetTokens) {
      return content;
    }

    // Use Claude to aggressively compress
    const compressionRatio = targetTokens / currentTokens;
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-0', // Use fast model
      max_tokens: targetTokens,
      messages: [
        {
          role: 'user',
          content: `Compress this content to approximately ${targetTokens} tokens 
          (${(compressionRatio * 100).toFixed(0)}% of original size) while preserving 
          all critical information:
          
          ${content}
          
          Focus on facts, decisions, and actionable information.
          Remove redundancy, examples, and verbosity.`
        }
      ]
    });

    return response.content[0].text;
  }

  async extractEssentials(content) {
    // Extract only essential information
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-0',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Extract ONLY essential information from this content:
          - Key facts
          - Critical decisions
          - Required actions
          - Important constraints
          
          ${content}
          
          Format as concise bullet points.`
        }
      ]
    });

    return response.content[0].text;
  }
}
```

Step 2: Use External Storage with References
```javascript
class ExternalContextStore {
  constructor() {
    this.store = new Map();
    this.nextId = 0;
  }

  store(content) {
    const id = `ctx_${this.nextId++}`;
    this.store.set(id, {
      content,
      tokens: content.length / 4,
      created: Date.now(),
      accessed: Date.now()
    });
    
    return id;
  }

  retrieve(id) {
    const item = this.store.get(id);
    if (item) {
      item.accessed = Date.now();
      return item.content;
    }
    return null;
  }

  createReference(content, summary) {
    const id = this.store(content);
    
    return {
      type: 'reference',
      id,
      summary,
      tokens: summary.length / 4
    };
  }

  async expandReferences(text) {
    // Replace references with actual content when needed
    const refPattern = /\[REF:(\w+)\]/g;
    
    return text.replace(refPattern, (match, id) => {
      return this.retrieve(id) || match;
    });
  }
}

// Usage
const store = new ExternalContextStore();

// Store large context externally
const refId = store.store(largeDocumentation);

// Use small reference in prompt
const prompt = `Using the documentation [REF:${refId}], answer: ${question}`;

// Expand when needed
const expandedPrompt = await store.expandReferences(prompt);
```

Step 3: Implement Token-Aware Message Queue
```javascript
class TokenAwareMessageQueue {
  constructor(maxTokens = 150000) {
    this.maxTokens = maxTokens;
    this.messages = [];
    this.systemTokens = 0;
  }

  async setSystem(systemPrompt) {
    this.systemTokens = await client.count_tokens(systemPrompt);
  }

  async add(message) {
    const tokens = await client.count_tokens(message.content);
    
    this.messages.push({
      ...message,
      tokens
    });

    await this.enforceLimit();
  }

  async enforceLimit() {
    let total = this.systemTokens;
    
    // Calculate total from end to start
    for (let i = this.messages.length - 1; i >= 0; i--) {
      total += this.messages[i].tokens;
    }

    // Remove oldest messages until under limit
    while (total > this.maxTokens && this.messages.length > 1) {
      const removed = this.messages.shift();
      total -= removed.tokens;
    }
  }

  async get() {
    return this.messages.map(({ tokens, ...message }) => message);
  }

  getTokenCount() {
    return this.systemTokens + 
      this.messages.reduce((sum, msg) => sum + msg.tokens, 0);
  }
}
```

**Prevention Strategies:**
- Monitor input size proactively
- Implement automatic summarization before limits
- Use external storage for large references
- Design conversations to stay within limits
- Set up alerts at 80% capacity

**Related Issues:** Request rejection, context loss, performance degradation

**When to Escalate:** If legitimate use case requires >200K input, consider RAG or alternative architecture.

---

### Issue: Inefficient Token Usage

**Problem Description:**
Requests consume more tokens than necessary due to verbose prompts, redundant context, or inefficient formatting.

**Diagnostic Steps:**

1. Audit prompt efficiency
```javascript
async function auditPrompt(prompt) {
  const tokens = await client.count_tokens(prompt);
  
  // Identify inefficiencies
  const issues = [];
  
  // Check for repetition
  const words = prompt.toLowerCase().split(/\s+/);
  const frequency = new Map();
  words.forEach(word => {
    frequency.set(word, (frequency.get(word) || 0) + 1);
  });
  
  const repeated = Array.from(frequency.entries())
    .filter(([word, count]) => count > 5 && word.length > 3)
    .sort((a, b) => b[1] - a[1]);
  
  if (repeated.length > 0) {
    issues.push({
      type: 'repetition',
      details: repeated.slice(0, 5)
    });
  }

  // Check for verbosity
  const sentences = prompt.split(/[.!?]+/);
  const avgWordsPerSentence = words.length / sentences.length;
  
  if (avgWordsPerSentence > 25) {
    issues.push({
      type: 'verbosity',
      avgLength: avgWordsPerSentence
    });
  }

  // Check for unnecessary whitespace
  const whitespaceTokens = (prompt.match(/\s+/g) || []).length;
  const whitespaceRatio = whitespaceTokens / tokens;
  
  if (whitespaceRatio > 0.15) {
    issues.push({
      type: 'whitespace',
      ratio: whitespaceRatio
    });
  }

  return {
    tokens,
    issues,
    estimatedSavings: this.calculatePotentialSavings(issues, tokens)
  };
}

calculatePotentialSavings(issues, currentTokens) {
  let savings = 0;
  
  issues.forEach(issue => {
    switch (issue.type) {
      case 'repetition':
        savings += currentTokens * 0.1; // Est 10% from reducing repetition
        break;
      case 'verbosity':
        savings += currentTokens * 0.15; // Est 15% from conciseness
        break;
      case 'whitespace':
        savings += currentTokens * issue.ratio;
        break;
    }
  });
  
  return Math.floor(savings);
}
```

2. Compare equivalent prompts
```javascript
async function comparePrompts(prompts) {
  const results = await Promise.all(
    prompts.map(async (prompt) => ({
      prompt: prompt.substring(0, 100) + '...',
      tokens: await client.count_tokens(prompt),
      response: await callClaude(prompt)
    }))
  );

  // Find most efficient (lowest tokens, good response)
  results.forEach((result, i) => {
    console.log(`Prompt ${i + 1}:`);
    console.log(`  Tokens: ${result.tokens}`);
    console.log(`  Response quality: ${assessQuality(result.response)}`);
  });

  return results;
}
```

3. Analyze token density
```javascript
function analyzeTokenDensity(content) {
  const lines = content.split('\n');
  const analysis = lines.map(line => ({
    line: line.substring(0, 50),
    chars: line.length,
    tokens: line.length / 4,
    density: (line.length / 4) / Math.max(1, line.split(/\s+/).length)
  }));

  // Sort by density to find inefficient lines
  analysis.sort((a, b) => b.density - a.density);

  console.log('High token density lines (check for optimization):');
  analysis.slice(0, 10).forEach(a => {
    console.log(`${a.line}... (${a.tokens.toFixed(0)} tokens)`);
  });

  return analysis;
}
```

**Solutions:**

Step 1: Optimize Prompt Structure
```javascript
class PromptOptimizer {
  optimize(prompt) {
    let optimized = prompt;

    // Remove excessive whitespace
    optimized = optimized.replace(/\s+/g, ' ');
    optimized = optimized.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Remove redundant words
    const redundantPhrases = [
      ['in order to', 'to'],
      ['due to the fact that', 'because'],
      ['at this point in time', 'now'],
      ['for the purpose of', 'for'],
      ['in the event that', 'if'],
      ['please be advised that', ''],
      ['it should be noted that', ''],
    ];

    redundantPhrases.forEach(([verbose, concise]) => {
      const regex = new RegExp(verbose, 'gi');
      optimized = optimized.replace(regex, concise);
    });

    // Simplify instructions
    optimized = optimized.replace(
      /please\s+(ensure|make\s+sure|verify)\s+that\s+you\s+/gi,
      ''
    );

    return optimized;
  }

  async compareEfficiency(original) {
    const optimized = this.optimize(original);
    
    const originalTokens = await client.count_tokens(original);
    const optimizedTokens = await client.count_tokens(optimized);
    
    return {
      original: { text: original, tokens: originalTokens },
      optimized: { text: optimized, tokens: optimizedTokens },
      savings: originalTokens - optimizedTokens,
      savingsPercent: ((originalTokens - optimizedTokens) / originalTokens * 100).toFixed(1)
    };
  }
}
```

Step 2: Use Templates and Variables
```javascript
class PromptTemplate {
  constructor(template) {
    this.template = template;
    this.baseTokens = null;
  }

  async init() {
    // Calculate base template tokens once
    this.baseTokens = await client.count_tokens(this.template);
  }

  async render(variables) {
    let rendered = this.template;
    
    // Replace variables
    for (const [key, value] of Object.entries(variables)) {
      rendered = rendered.replace(
        new RegExp(`{{${key}}}`, 'g'),
        value
      );
    }

    return rendered;
  }

  async estimateTokens(variables) {
    // Estimate without full render
    let variableTokens = 0;
    
    for (const value of Object.values(variables)) {
      variableTokens += await client.count_tokens(String(value));
    }

    return this.baseTokens + variableTokens;
  }
}

// Usage
const template = new PromptTemplate(`
Analyze the following {{type}}:

{{content}}

Focus on:
{{criteria}}

Provide {{output_format}}.
`);

await template.init();

// Efficient reuse
const prompt = await template.render({
  type: 'code',
  content: sourceCode,
  criteria: 'bugs, performance, security',
  output_format: 'JSON'
});
```

Step 3: Implement Smart Caching
```javascript
class SmartTokenCache {
  constructor() {
    this.cache = new Map();
  }

  async getCached(key, generator) {
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      
      // Check if still valid (5 min TTL)
      if (Date.now() - cached.timestamp < 300000) {
        return {
          content: cached.content,
          tokens: cached.tokens,
          fromCache: true
        };
      }
    }

    // Generate and cache
    const content = await generator();
    const tokens = await client.count_tokens(content);
    
    this.cache.set(key, {
      content,
      tokens,
      timestamp: Date.now()
    });

    return {
      content,
      tokens,
      fromCache: false
    };
  }

  clear() {
    this.cache.clear();
  }
}

// Usage
const cache = new SmartTokenCache();

// Reuse system prompts efficiently
const systemPrompt = await cache.getCached('system_prompt_v1', () => 
  fs.readFile('prompts/system.txt', 'utf-8')
);
```

**Prevention Strategies:**
- Use concise, clear language
- Avoid redundancy and repetition
- Template common prompt patterns
- Remove unnecessary formatting
- Regular prompt audits for efficiency

**Related Issues:** High costs, slow responses, wasted capacity

**When to Escalate:** If optimizations don't significantly reduce token usage, may need prompt redesign.

---

## Token Budget Management

### Implementing Budget Controls

```javascript
class TokenBudgetManager {
  constructor(budget) {
    this.dailyBudget = budget.daily || 1000000;
    this.monthlyBudget = budget.monthly || 30000000;
    this.perRequestMax = budget.perRequest || 50000;
    
    this.usage = {
      today: 0,
      month: 0,
      lastReset: Date.now()
    };
  }

  async checkBudget(estimatedTokens) {
    this.resetIfNeeded();

    const checks = {
      perRequest: estimatedTokens <= this.perRequestMax,
      daily: (this.usage.today + estimatedTokens) <= this.dailyBudget,
      monthly: (this.usage.month + estimatedTokens) <= this.monthlyBudget
    };

    const canProceed = Object.values(checks).every(check => check);

    if (!canProceed) {
      const failures = Object.entries(checks)
        .filter(([_, passed]) => !passed)
        .map(([type, _]) => type);

      throw new Error(`Budget exceeded: ${failures.join(', ')}`);
    }

    return true;
  }

  recordUsage(tokens) {
    this.usage.today += tokens;
    this.usage.month += tokens;
  }

  resetIfNeeded() {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    // Reset daily
    if (now - this.usage.lastReset > dayMs) {
      this.usage.today = 0;
      this.usage.lastReset = now;
    }

    // Reset monthly (simplified - first of month)
    const currentMonth = new Date().getMonth();
    const lastResetMonth = new Date(this.usage.lastReset).getMonth();
    
    if (currentMonth !== lastResetMonth) {
      this.usage.month = 0;
    }
  }

  getStatus() {
    return {
      daily: {
        used: this.usage.today,
        budget: this.dailyBudget,
        remaining: this.dailyBudget - this.usage.today,
        percentUsed: (this.usage.today / this.dailyBudget * 100).toFixed(1)
      },
      monthly: {
        used: this.usage.month,
        budget: this.monthlyBudget,
        remaining: this.monthlyBudget - this.usage.month,
        percentUsed: (this.usage.month / this.monthlyBudget * 100).toFixed(1)
      }
    };
  }
}
```

### Token Cost Optimization

```javascript
class TokenCostOptimizer {
  constructor() {
    this.costs = {
      'claude-opus-4': { input: 15, output: 75 },
      'claude-sonnet-4-5': { input: 3, output: 15 },
      'claude-haiku-4': { input: 0.8, output: 4 }
    };
  }

  calculateCost(model, inputTokens, outputTokens) {
    const rates = this.costs[model];
    const inputCost = (inputTokens / 1000000) * rates.input;
    const outputCost = (outputTokens / 1000000) * rates.output;
    
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  }

  recommendModel(estimatedInput, estimatedOutput, qualityNeeded) {
    const costs = {};
    
    Object.keys(this.costs).forEach(model => {
      costs[model] = this.calculateCost(
        model,
        estimatedInput,
        estimatedOutput
      ).total;
    });

    // If high quality needed, use Opus
    if (qualityNeeded === 'high') return 'claude-opus-4';
    
    // If low quality sufficient, use Haiku
    if (qualityNeeded === 'low') return 'claude-haiku-4';
    
    // Otherwise use Sonnet (best balance)
    return 'claude-sonnet-4-5';
  }

  async optimizeCaching(systemPrompt, messages) {
    const systemTokens = await client.count_tokens(systemPrompt);
    
    // Only cache if system prompt is large enough
    if (systemTokens < 1000) {
      return { useCache: false, reason: 'System prompt too small' };
    }

    // Calculate break-even point
    const cacheCost = systemTokens * 1.25; // Cache write cost
    const cacheReadCost = systemTokens * 0.1;
    const normalCost = systemTokens;
    
    // Break even after 2 requests
    const breakevenRequests = Math.ceil(
      (cacheCost - normalCost) / (normalCost - cacheReadCost)
    );

    return {
      useCache: true,
      breakevenRequests,
      reason: `Will save after ${breakevenRequests} requests`
    };
  }
}
```

This comprehensive guide provides strategies and tools for effectively managing token limits, optimizing usage, and controlling costs in Claude Code applications.
