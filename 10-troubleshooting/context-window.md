# Context Window Management Issues

## Overview

Context window management is critical for maintaining conversation coherence while avoiding token limits and performance degradation. This guide addresses issues related to context size, conversation history, and intelligent context management strategies.

## Understanding Context Windows

### Context Window Specifications

| Model | Context Window | Optimal Range | Max Output |
|-------|----------------|---------------|------------|
| Claude Opus 4 | 200K tokens | 50-150K | 16K tokens |
| Claude Sonnet 4.5 | 200K tokens | 50-150K | 16K tokens |
| Claude Haiku 4 | 200K tokens | 20-100K | 16K tokens |

### Context Components

1. **System Prompts:** Instructions and role definitions
2. **Conversation History:** Previous messages and responses
3. **Attachments:** Files, code, documentation
4. **Dynamic Context:** Runtime information, state
5. **Tool Definitions:** MCP tools and capabilities

## Common Context Window Issues

### Issue: Context Limit Exceeded

**Problem Description:**
Requests fail with "context_length_exceeded" error when conversation history or attachments push beyond the 200K token limit.

**Diagnostic Steps:**

1. Calculate current context size
```bash
# Count tokens in current session
claude --show-tokens --session current
```

2. Identify context contributors
```javascript
// Break down context by component
const anthropic = require('@anthropic-ai/sdk');
const client = new anthropic.Anthropic();

async function analyzeContext(messages, system) {
  const systemTokens = await client.count_tokens(system);
  
  let messageTokens = 0;
  for (const msg of messages) {
    const tokens = await client.count_tokens(msg.content);
    console.log(`${msg.role}: ${tokens} tokens`);
    messageTokens += tokens;
  }
  
  console.log(`System: ${systemTokens} tokens`);
  console.log(`Messages: ${messageTokens} tokens`);
  console.log(`Total: ${systemTokens + messageTokens} tokens`);
}
```

3. Review file attachments
```bash
# Check size of attached files
find . -type f -name "*.txt" -o -name "*.md" | \
  xargs wc -w | \
  sort -n
```

4. Track context growth over time
```javascript
// Monitor context accumulation
let contextHistory = [];

function trackContext(request) {
  const size = estimateTokens(request);
  contextHistory.push({ timestamp: Date.now(), size });
  
  // Alert if growing too fast
  if (contextHistory.length > 10) {
    const growth = size - contextHistory[0].size;
    if (growth > 50000) {
      console.warn('Context growing rapidly:', growth, 'tokens');
    }
  }
}
```

**Solutions:**

Step 1: Implement Context Summarization
```javascript
class ContextManager {
  constructor(maxTokens = 150000) {
    this.maxTokens = maxTokens;
    this.messages = [];
    this.systemPrompt = '';
  }

  async add(message) {
    this.messages.push(message);
    
    const totalTokens = await this.estimateTotal();
    if (totalTokens > this.maxTokens) {
      await this.summarizeOldContext();
    }
  }

  async summarizeOldContext() {
    // Keep system prompt and recent messages
    const recentMessages = this.messages.slice(-10);
    const oldMessages = this.messages.slice(0, -10);
    
    if (oldMessages.length === 0) return;

    // Summarize old conversation
    const summary = await anthropic.messages.create({
      model: 'claude-haiku-4-0', // Use fast model for summarization
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Summarize this conversation history concisely, preserving key decisions and context:
          
${JSON.stringify(oldMessages, null, 2)}`
        }
      ]
    });

    // Replace old messages with summary
    this.messages = [
      {
        role: 'user',
        content: `Previous conversation summary: ${summary.content[0].text}`
      },
      {
        role: 'assistant',
        content: 'I understand the previous context. Please continue.'
      },
      ...recentMessages
    ];
  }

  async estimateTotal() {
    let total = await client.count_tokens(this.systemPrompt);
    for (const msg of this.messages) {
      total += await client.count_tokens(msg.content);
    }
    return total;
  }
}
```

Step 2: Use Sliding Window Approach
```javascript
class SlidingWindowContext {
  constructor(windowSize = 20) {
    this.windowSize = windowSize;
    this.messages = [];
    this.pinnedMessages = []; // Important messages to keep
  }

  addPinned(message) {
    this.pinnedMessages.push(message);
  }

  add(message) {
    this.messages.push(message);
    
    // Keep only recent messages within window
    if (this.messages.length > this.windowSize) {
      this.messages = this.messages.slice(-this.windowSize);
    }
  }

  getContext() {
    // Combine pinned and windowed messages
    return [...this.pinnedMessages, ...this.messages];
  }

  clear() {
    this.messages = [];
    // Pinned messages remain
  }
}

// Usage
const context = new SlidingWindowContext(20);

// Pin important information
context.addPinned({
  role: 'user',
  content: 'Working on authentication system for Node.js app'
});

// Add regular messages (automatically managed)
context.add({ role: 'user', content: 'How do I hash passwords?' });
context.add({ role: 'assistant', content: 'Use bcrypt...' });
```

Step 3: Implement Intelligent Context Pruning
```javascript
class SmartContextPruner {
  async prune(messages, maxTokens) {
    // Score each message by importance
    const scored = await Promise.all(
      messages.map(async (msg, idx) => ({
        message: msg,
        index: idx,
        score: await this.scoreMessage(msg, idx, messages)
      }))
    );

    // Sort by importance
    scored.sort((a, b) => b.score - a.score);

    // Keep messages until token limit
    let kept = [];
    let tokens = 0;
    
    for (const item of scored) {
      const msgTokens = await client.count_tokens(item.message.content);
      if (tokens + msgTokens <= maxTokens) {
        kept.push(item);
        tokens += msgTokens;
      }
    }

    // Re-sort by original order
    kept.sort((a, b) => a.index - b.index);
    
    return kept.map(item => item.message);
  }

  async scoreMessage(message, index, allMessages) {
    let score = 0;
    
    // Recent messages are important
    score += (index / allMessages.length) * 100;
    
    // Questions and answers are important
    if (message.content.includes('?')) score += 50;
    if (message.role === 'assistant') score += 30;
    
    // Code blocks are important
    if (message.content.includes('```')) score += 40;
    
    // Error messages and warnings are important
    if (message.content.match(/error|warning|issue/i)) score += 60;
    
    // Short acknowledgments are less important
    if (message.content.length < 50) score -= 20;
    
    return score;
  }
}
```

**Prevention Strategies:**
- Monitor context size proactively
- Implement automatic summarization
- Use external storage for large reference material
- Design prompts to be context-efficient
- Set up alerts before hitting limits

**Related Issues:** Performance degradation, high costs, conversation loss

**When to Escalate:** If legitimate use cases consistently exceed limits, consider architectural redesign.

---

### Issue: Context Coherence Loss

**Problem Description:**
After context management operations like summarization or pruning, Claude loses important context and provides less relevant responses.

**Diagnostic Steps:**

1. Test context retention
```javascript
// Before context management
const response1 = await claude('What was the user's name?');

// After context management
await contextManager.summarize();
const response2 = await claude('What was the user's name?');

// Compare accuracy
console.log('Before:', response1);
console.log('After:', response2);
```

2. Identify lost information
```javascript
// Track what gets removed
class ContextTracker {
  removed = [];

  onRemove(messages) {
    this.removed.push({
      timestamp: Date.now(),
      messages: messages,
      reason: 'context_limit'
    });
  }

  analyzeLoss() {
    // Extract key information from removed messages
    const keyInfo = this.removed.flatMap(batch => 
      batch.messages.filter(msg => 
        msg.content.match(/important|decision|agreed|requirement/i)
      )
    );
    
    return keyInfo;
  }
}
```

3. Measure response quality degradation
```javascript
// Compare response relevance over time
function measureRelevance(response, expectedTopics) {
  let score = 0;
  for (const topic of expectedTopics) {
    if (response.includes(topic)) score++;
  }
  return score / expectedTopics.length;
}
```

**Solutions:**

Step 1: Extract and Preserve Key Information
```javascript
class KeyInformationExtractor {
  async extract(messages) {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Extract key information from this conversation in structured format:

Conversation:
${JSON.stringify(messages, null, 2)}

Extract:
1. User requirements and goals
2. Important decisions made
3. Technical constraints mentioned
4. Action items and TODOs
5. Context that future messages might reference

Format as JSON.`
        }
      ]
    });

    return JSON.parse(response.content[0].text);
  }

  async compress(keyInfo) {
    // Convert to concise format
    return {
      requirements: keyInfo.requirements?.join('; '),
      decisions: keyInfo.decisions?.join('; '),
      constraints: keyInfo.constraints?.join('; '),
      actions: keyInfo.actions?.join('; '),
      context: keyInfo.context?.join('; ')
    };
  }
}

// Usage
const extractor = new KeyInformationExtractor();
const keyInfo = await extractor.extract(oldMessages);
const compressed = await extractor.compress(keyInfo);

// Add as system context
systemPrompt += `\n\nPrevious Context:\n${JSON.stringify(compressed, null, 2)}`;
```

Step 2: Use Hierarchical Summarization
```javascript
class HierarchicalSummarizer {
  async summarize(messages, levels = 3) {
    let current = messages;
    const summaries = [];

    for (let level = 0; level < levels; level++) {
      if (current.length <= 2) break;

      const chunkSize = Math.ceil(current.length / 4);
      const chunks = [];
      
      for (let i = 0; i < current.length; i += chunkSize) {
        chunks.push(current.slice(i, i + chunkSize));
      }

      const levelSummaries = await Promise.all(
        chunks.map(chunk => this.summarizeChunk(chunk, level))
      );

      summaries.push({
        level,
        summaries: levelSummaries
      });

      current = levelSummaries.map(s => ({
        role: 'user',
        content: s
      }));
    }

    return this.buildHierarchy(summaries);
  }

  async summarizeChunk(messages, level) {
    const detail = level === 0 ? 'detailed' : 'high-level';
    
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-0',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `Provide a ${detail} summary of this conversation segment:
          
${JSON.stringify(messages, null, 2)}`
        }
      ]
    });

    return response.content[0].text;
  }

  buildHierarchy(summaries) {
    // Most detailed at top, most abstract at bottom
    return summaries.map(level => 
      `Level ${level.level}: ${level.summaries.join(' | ')}`
    ).join('\n\n');
  }
}
```

Step 3: Implement Semantic Chunking
```javascript
class SemanticChunker {
  async chunk(messages) {
    // Group messages by topic/theme
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `Analyze this conversation and identify distinct topics/themes. 
          Group messages by topic and assign each message a topic ID.
          
${JSON.stringify(messages.map((m, i) => ({ id: i, ...m })), null, 2)}

Return JSON: { topics: [{id, name, messageIds}] }`
        }
      ]
    });

    const analysis = JSON.parse(response.content[0].text);
    
    // Create chunks based on topics
    return analysis.topics.map(topic => ({
      topic: topic.name,
      messages: topic.messageIds.map(id => messages[id])
    }));
  }

  selectRelevant(chunks, currentQuery, maxTokens) {
    // Score chunks by relevance to current query
    const scored = chunks.map(chunk => ({
      chunk,
      score: this.relevanceScore(chunk, currentQuery)
    }));

    scored.sort((a, b) => b.score - a.score);

    // Select until token limit
    let selected = [];
    let tokens = 0;
    
    for (const item of scored) {
      const chunkTokens = this.estimateChunkTokens(item.chunk);
      if (tokens + chunkTokens <= maxTokens) {
        selected.push(item.chunk);
        tokens += chunkTokens;
      }
    }

    return selected;
  }

  relevanceScore(chunk, query) {
    const queryWords = query.toLowerCase().split(/\s+/);
    const chunkText = JSON.stringify(chunk.messages).toLowerCase();
    
    return queryWords.filter(word => chunkText.includes(word)).length;
  }

  estimateChunkTokens(chunk) {
    return JSON.stringify(chunk.messages).length / 4;
  }
}
```

**Prevention Strategies:**
- Design context management with preservation in mind
- Test context retention after management operations
- Use structured formats for key information
- Implement gradual degradation rather than abrupt cuts
- Monitor conversation quality metrics

**Related Issues:** Confusion, repeated questions, lost progress

**When to Escalate:** If summarization consistently loses critical context, may need custom solution.

---

### Issue: File Attachment Token Overflow

**Problem Description:**
Large file attachments consume excessive context window, leaving little room for conversation.

**Diagnostic Steps:**

1. Calculate file token costs
```bash
# Estimate tokens in file (rough: chars/4)
wc -c largefile.txt | awk '{print $1/4 " estimated tokens"}'
```

2. Identify unnecessary attachments
```javascript
// Track which files are actually referenced
class AttachmentTracker {
  constructor() {
    this.attachments = new Map();
  }

  add(filename, content) {
    this.attachments.set(filename, {
      content,
      tokens: this.estimateTokens(content),
      references: 0,
      lastUsed: null
    });
  }

  recordReference(filename) {
    const attachment = this.attachments.get(filename);
    if (attachment) {
      attachment.references++;
      attachment.lastUsed = Date.now();
    }
  }

  getUnused(sinceMs = 300000) { // 5 minutes
    const now = Date.now();
    return Array.from(this.attachments.entries())
      .filter(([_, data]) => 
        !data.lastUsed || (now - data.lastUsed) > sinceMs
      )
      .map(([filename, _]) => filename);
  }

  estimateTokens(content) {
    return content.length / 4;
  }
}
```

3. Analyze file content density
```javascript
// Check if file contains mostly useful information
function analyzeContentDensity(content) {
  const lines = content.split('\n');
  const meaningfulLines = lines.filter(line => 
    line.trim().length > 0 && 
    !line.trim().startsWith('//') &&
    !line.trim().startsWith('/*')
  );

  return {
    totalLines: lines.length,
    meaningfulLines: meaningfulLines.length,
    density: meaningfulLines.length / lines.length,
    estimatedTokens: content.length / 4
  };
}
```

**Solutions:**

Step 1: Implement Selective File Loading
```javascript
class SmartFileLoader {
  async load(filepath, query) {
    const content = await fs.readFile(filepath, 'utf-8');
    const analysis = this.analyzeFile(content);

    // For large files, extract relevant sections
    if (analysis.tokens > 10000) {
      return await this.extractRelevant(content, query);
    }

    return content;
  }

  async extractRelevant(content, query) {
    // Use Claude to extract relevant portions
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-0',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: `Extract sections of this file relevant to: "${query}"

File:
${content}

Return only relevant sections with line numbers.`
        }
      ]
    });

    return response.content[0].text;
  }

  analyzeFile(content) {
    return {
      tokens: content.length / 4,
      lines: content.split('\n').length,
      size: Buffer.byteLength(content)
    };
  }
}
```

Step 2: Use File Chunking with Indexing
```javascript
class FileChunker {
  constructor(chunkSize = 5000) {
    this.chunkSize = chunkSize; // tokens
    this.index = new Map();
  }

  async chunkFile(filepath) {
    const content = await fs.readFile(filepath, 'utf-8');
    const chunks = [];
    let currentChunk = '';
    let currentTokens = 0;

    for (const line of content.split('\n')) {
      const lineTokens = line.length / 4;
      
      if (currentTokens + lineTokens > this.chunkSize) {
        chunks.push(currentChunk);
        currentChunk = line + '\n';
        currentTokens = lineTokens;
      } else {
        currentChunk += line + '\n';
        currentTokens += lineTokens;
      }
    }

    if (currentChunk) chunks.push(currentChunk);

    // Index chunks
    await this.indexChunks(filepath, chunks);
    
    return chunks;
  }

  async indexChunks(filepath, chunks) {
    const summaries = await Promise.all(
      chunks.map(async (chunk, i) => {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-0',
          max_tokens: 200,
          messages: [
            {
              role: 'user',
              content: `Summarize this code section in one sentence:\n${chunk}`
            }
          ]
        });

        return {
          chunkId: i,
          summary: response.content[0].text,
          keywords: this.extractKeywords(chunk)
        };
      })
    );

    this.index.set(filepath, summaries);
  }

  extractKeywords(chunk) {
    // Simple keyword extraction
    const words = chunk.match(/\b[a-z_][a-z0-9_]*\b/gi) || [];
    const frequency = new Map();
    
    words.forEach(word => {
      frequency.set(word, (frequency.get(word) || 0) + 1);
    });

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, _]) => word);
  }

  async findRelevantChunks(filepath, query) {
    const index = this.index.get(filepath);
    if (!index) return [];

    const queryWords = query.toLowerCase().split(/\s+/);
    
    const scored = index.map(chunk => ({
      ...chunk,
      score: chunk.keywords.filter(keyword =>
        queryWords.some(word => keyword.toLowerCase().includes(word))
      ).length
    }));

    scored.sort((a, b) => b.score - a.score);
    
    return scored.slice(0, 3).map(c => c.chunkId);
  }
}
```

Step 3: Implement File Summarization
```javascript
class FileSummarizer {
  async summarize(filepath, maxTokens = 2000) {
    const content = await fs.readFile(filepath, 'utf-8');
    const tokens = content.length / 4;

    if (tokens <= maxTokens) {
      return { type: 'full', content };
    }

    // Generate structured summary
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: maxTokens,
      messages: [
        {
          role: 'user',
          content: `Summarize this file in ${maxTokens} tokens or less. Include:
1. Purpose and overview
2. Key functions/classes/components
3. Important algorithms or logic
4. Dependencies and integrations
5. Notable patterns or approaches

File (${filepath}):
${content}`
        }
      ]
    });

    return {
      type: 'summary',
      content: response.content[0].text,
      originalTokens: tokens,
      summaryTokens: maxTokens
    };
  }

  async createStructuredDigest(filepath) {
    // For code files, extract structure without implementation
    const content = await fs.readFile(filepath, 'utf-8');
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: `Extract the structure of this code file (no implementation details):
- Function signatures
- Class definitions
- Imports/exports
- Type definitions
- Comments/documentation

File:
${content}`
        }
      ]
    });

    return response.content[0].text;
  }
}
```

**Prevention Strategies:**
- Chunk large files before attaching
- Attach only relevant sections when possible
- Use file summaries for overview
- Implement on-demand section loading
- Monitor attachment token usage

**Related Issues:** Context overflow, slow responses, high costs

**When to Escalate:** If legitimate use cases require multiple large files, consider RAG approach.

---

## Context Management Best Practices

### Context Budget Management

```javascript
class ContextBudget {
  constructor(totalBudget = 150000) {
    this.totalBudget = totalBudget;
    this.allocation = {
      system: 0.1,        // 15K tokens
      history: 0.4,       // 60K tokens
      attachments: 0.3,   // 45K tokens
      working: 0.2        // 30K tokens (for response)
    };
  }

  getBudgets() {
    return {
      system: this.totalBudget * this.allocation.system,
      history: this.totalBudget * this.allocation.history,
      attachments: this.totalBudget * this.allocation.attachments,
      working: this.totalBudget * this.allocation.working
    };
  }

  adjust(component, percentage) {
    // Dynamically adjust allocation based on usage
    const total = Object.values(this.allocation).reduce((a, b) => a + b, 0);
    this.allocation[component] = percentage / 100;
    
    // Rebalance others
    const remaining = 1 - this.allocation[component];
    const otherComponents = Object.keys(this.allocation)
      .filter(k => k !== component);
    
    otherComponents.forEach(comp => {
      this.allocation[comp] = (this.allocation[comp] / (total - this.allocation[component])) * remaining;
    });
  }

  checkCompliance(actual) {
    const budgets = this.getBudgets();
    const violations = [];

    Object.keys(budgets).forEach(component => {
      if (actual[component] > budgets[component]) {
        violations.push({
          component,
          budget: budgets[component],
          actual: actual[component],
          overage: actual[component] - budgets[component]
        });
      }
    });

    return {
      compliant: violations.length === 0,
      violations
    };
  }
}
```

### Monitoring and Alerts

```javascript
class ContextMonitor {
  constructor(warningThreshold = 0.8, criticalThreshold = 0.95) {
    this.warningThreshold = warningThreshold;
    this.criticalThreshold = criticalThreshold;
    this.maxContext = 200000;
  }

  check(currentTokens) {
    const usage = currentTokens / this.maxContext;

    if (usage >= this.criticalThreshold) {
      return {
        level: 'critical',
        message: `Context at ${(usage * 100).toFixed(1)}% - immediate action required`,
        action: 'summarize_now'
      };
    }

    if (usage >= this.warningThreshold) {
      return {
        level: 'warning',
        message: `Context at ${(usage * 100).toFixed(1)}% - prepare for summarization`,
        action: 'prepare_summarization'
      };
    }

    return {
      level: 'ok',
      message: `Context at ${(usage * 100).toFixed(1)}%`,
      action: 'none'
    };
  }

  predict(currentTokens, growthRate) {
    // Estimate when limit will be reached
    const remaining = this.maxContext - currentTokens;
    const turnsRemaining = remaining / growthRate;
    
    return {
      turnsRemaining: Math.floor(turnsRemaining),
      estimatedLimit: new Date(Date.now() + (turnsRemaining * 60000)) // Assume 1 min per turn
    };
  }
}
```

This comprehensive guide provides the tools and strategies needed to effectively manage context windows, maintain conversation coherence, and optimize token usage in Claude Code applications.
