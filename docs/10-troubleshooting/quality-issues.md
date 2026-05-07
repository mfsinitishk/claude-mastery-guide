# Quality and Accuracy Problems

## Overview

Quality issues affect the usefulness and reliability of Claude's outputs. This guide addresses problems with accuracy, consistency, hallucinations, and output quality, providing systematic approaches to diagnose and improve results.

## Output Quality Issues

### Issue: Inconsistent or Contradictory Responses

**Problem Description:**
Claude provides different answers to the same question, contradicts previous statements, or gives inconsistent recommendations across conversations.

**Diagnostic Steps:**

1. Test response consistency
```javascript
class ConsistencyTester {
  async testConsistency(prompt, iterations = 5) {
    const responses = [];

    for (let i = 0; i < iterations; i++) {
      const response = await callClaude(prompt);
      responses.push(response);
      
      // Delay between requests
      await this.delay(1000);
    }

    return {
      responses,
      consistency: this.analyzeConsistency(responses)
    };
  }

  analyzeConsistency(responses) {
    // Simple comparison - check for similar content
    const first = responses[0].toLowerCase();
    
    const similarities = responses.map(r => 
      this.calculateSimilarity(first, r.toLowerCase())
    );

    const avgSimilarity = similarities.reduce((a, b) => a + b) / similarities.length;

    return {
      averageSimilarity: avgSimilarity,
      consistent: avgSimilarity > 0.8,
      variance: this.calculateVariance(similarities)
    };
  }

  calculateSimilarity(str1, str2) {
    // Simple word-based similarity
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(v => Math.pow(v - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b) / values.length);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const tester = new ConsistencyTester();
const result = await tester.testConsistency(
  "What are the best practices for error handling in Node.js?"
);

console.log(`Consistency: ${result.consistency.consistent ? 'PASS' : 'FAIL'}`);
console.log(`Similarity: ${(result.consistency.averageSimilarity * 100).toFixed(1)}%`);
```

2. Compare responses over time
```javascript
class ResponseTracker {
  constructor() {
    this.history = new Map();
  }

  record(prompt, response) {
    const key = this.normalizePrompt(prompt);
    
    if (!this.history.has(key)) {
      this.history.set(key, []);
    }

    this.history.get(key).push({
      timestamp: Date.now(),
      response,
      hash: this.hashResponse(response)
    });
  }

  analyzePrompt(prompt) {
    const key = this.normalizePrompt(prompt);
    const entries = this.history.get(key) || [];

    if (entries.length < 2) {
      return { insufficientData: true };
    }

    const uniqueHashes = new Set(entries.map(e => e.hash));
    const consistencyRate = 1 - (uniqueHashes.size - 1) / entries.length;

    return {
      totalResponses: entries.length,
      uniqueResponses: uniqueHashes.size,
      consistencyRate,
      consistent: consistencyRate > 0.8,
      firstSeen: entries[0].timestamp,
      lastSeen: entries[entries.length - 1].timestamp
    };
  }

  normalizePrompt(prompt) {
    // Remove whitespace variations
    return prompt.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  hashResponse(response) {
    const crypto = require('crypto');
    // Hash normalized response
    const normalized = response.toLowerCase().replace(/\s+/g, ' ').trim();
    return crypto.createHash('md5').update(normalized).digest('hex');
  }
}
```

3. Check for contradictions
```javascript
async function detectContradictions(statements) {
  // Use Claude to check for contradictions
  const prompt = `Analyze these statements for contradictions or inconsistencies:

${statements.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Identify any contradictions and explain them.`;

  const response = await callClaude(prompt);
  return response;
}
```

**Solutions:**

Step 1: Use Explicit Constraints
```javascript
class ConstrainedPrompt {
  constructor() {
    this.constraints = [];
    this.context = [];
  }

  addConstraint(constraint) {
    this.constraints.push(constraint);
  }

  addContext(context) {
    this.context.push(context);
  }

  build(question) {
    const parts = [];

    // Add context
    if (this.context.length > 0) {
      parts.push('Context:');
      parts.push(...this.context.map(c => `- ${c}`));
      parts.push('');
    }

    // Add constraints
    if (this.constraints.length > 0) {
      parts.push('Constraints:');
      parts.push(...this.constraints.map(c => `- ${c}`));
      parts.push('');
    }

    // Add question
    parts.push(question);

    // Add consistency instruction
    parts.push('');
    parts.push('Ensure your response is consistent with the context and constraints above.');

    return parts.join('\n');
  }
}

// Usage
const prompt = new ConstrainedPrompt();
prompt.addContext('We are building a REST API with Node.js and Express');
prompt.addContext('The project uses TypeScript');
prompt.addConstraint('Use async/await, not callbacks');
prompt.addConstraint('Include error handling');
prompt.addConstraint('Follow RESTful conventions');

const fullPrompt = prompt.build('How should we structure the user endpoints?');
```

Step 2: Maintain Conversation Context
```javascript
class ContextualConversation {
  constructor() {
    this.facts = new Set();
    this.decisions = new Map();
    this.history = [];
  }

  recordFact(fact) {
    this.facts.add(fact);
  }

  recordDecision(topic, decision) {
    this.decisions.set(topic, decision);
  }

  async ask(question) {
    // Build context-aware prompt
    const prompt = this.buildPrompt(question);
    const response = await callClaude(prompt);

    // Extract and record new facts/decisions
    await this.extractAndRecord(response);

    this.history.push({ question, response, timestamp: Date.now() });
    return response;
  }

  buildPrompt(question) {
    const parts = [
      'Important facts established in this conversation:'
    ];

    // Add established facts
    if (this.facts.size > 0) {
      this.facts.forEach(fact => parts.push(`- ${fact}`));
    } else {
      parts.push('- None yet');
    }

    parts.push('');
    parts.push('Decisions made:');

    // Add decisions
    if (this.decisions.size > 0) {
      this.decisions.forEach((decision, topic) => {
        parts.push(`- ${topic}: ${decision}`);
      });
    } else {
      parts.push('- None yet');
    }

    parts.push('');
    parts.push('IMPORTANT: Your response must be consistent with the facts and decisions above.');
    parts.push('');
    parts.push(question);

    return parts.join('\n');
  }

  async extractAndRecord(response) {
    // Use simple pattern matching or Claude to extract facts
    const factPattern = /(?:we (?:are|will|should|must)|the project (?:uses|requires))[^.]+\./gi;
    const matches = response.match(factPattern) || [];

    matches.forEach(fact => this.recordFact(fact.trim()));
  }

  getContext() {
    return {
      facts: Array.from(this.facts),
      decisions: Object.fromEntries(this.decisions),
      historyLength: this.history.length
    };
  }
}

// Usage
const conversation = new ContextualConversation();

conversation.recordFact('The application is a microservices architecture');
conversation.recordDecision('database', 'PostgreSQL');

const response = await conversation.ask('What should our authentication strategy be?');
```

Step 3: Implement Response Validation
```javascript
class ResponseValidator {
  constructor(conversation) {
    this.conversation = conversation;
    this.validationRules = [];
  }

  addRule(rule) {
    this.validationRules.push(rule);
  }

  async validate(response) {
    const violations = [];

    for (const rule of this.validationRules) {
      const result = await rule.check(response, this.conversation);
      
      if (!result.valid) {
        violations.push({
          rule: rule.name,
          reason: result.reason,
          severity: rule.severity
        });
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  async validateAndRetry(question, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const response = await this.conversation.ask(question);
      const validation = await this.validate(response);

      if (validation.valid) {
        return { response, attempt };
      }

      console.log(`Attempt ${attempt} failed validation:`, validation.violations);

      if (attempt < maxAttempts) {
        // Add validation feedback to next attempt
        const feedback = this.buildValidationFeedback(validation.violations);
        question = `${question}\n\nPrevious response had issues: ${feedback}. Please correct.`;
      }
    }

    throw new Error('Failed to get valid response after maximum attempts');
  }

  buildValidationFeedback(violations) {
    return violations
      .map(v => `${v.rule}: ${v.reason}`)
      .join('; ');
  }
}

// Example validation rules
class ConsistencyRule {
  constructor() {
    this.name = 'consistency';
    this.severity = 'high';
  }

  async check(response, conversation) {
    const facts = conversation.facts;
    
    // Check if response contradicts known facts
    for (const fact of facts) {
      if (this.contradicts(response, fact)) {
        return {
          valid: false,
          reason: `Contradicts known fact: ${fact}`
        };
      }
    }

    return { valid: true };
  }

  contradicts(response, fact) {
    // Simple contradiction detection
    // In production, would use more sophisticated NLP
    const negationPattern = /(?:not|never|doesn't|don't|isn't|aren't)/i;
    
    // If fact appears with negation in response, might be contradiction
    const factWords = fact.toLowerCase().split(/\s+/);
    const responseText = response.toLowerCase();
    
    return factWords.some(word => {
      const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
      const match = responseText.match(wordPattern);
      if (match) {
        const context = responseText.substring(
          Math.max(0, match.index - 30),
          Math.min(responseText.length, match.index + word.length + 30)
        );
        return negationPattern.test(context);
      }
      return false;
    });
  }
}

// Usage
const validator = new ResponseValidator(conversation);
validator.addRule(new ConsistencyRule());

const result = await validator.validateAndRetry(
  'Should we use MongoDB or PostgreSQL?'
);
```

**Prevention Strategies:**
- Maintain explicit conversation context
- Use structured prompts with constraints
- Validate responses against established facts
- Record and reference previous decisions
- Implement consistency checks

**Related Issues:** Hallucinations, unreliable outputs, user confusion

**When to Escalate:** If inconsistency persists despite proper context management, document specific examples.

---

### Issue: Hallucinations and Factual Errors

**Problem Description:**
Claude generates plausible-sounding but incorrect information, makes up API names, or confidently states false facts.

**Diagnostic Steps:**

1. Identify hallucination patterns
```javascript
class HallucinationDetector {
  async analyze(response, groundTruth) {
    const claims = await this.extractClaims(response);
    const verifications = [];

    for (const claim of claims) {
      const verification = await this.verifyClaim(claim, groundTruth);
      verifications.push({
        claim,
        ...verification
      });
    }

    const hallucinations = verifications.filter(v => !v.verified);

    return {
      totalClaims: claims.length,
      verified: verifications.filter(v => v.verified).length,
      hallucinations: hallucinations.length,
      hallucinationRate: hallucinations.length / claims.length,
      details: hallucinations
    };
  }

  async extractClaims(response) {
    // Extract factual statements
    // Simplified - in production would use NLP
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    
    return sentences.filter(s => {
      // Filter for likely factual claims
      return /\b(is|are|has|have|was|were|will|can|must)\b/i.test(s);
    });
  }

  async verifyClaim(claim, groundTruth) {
    // Simple keyword matching against ground truth
    const claimWords = new Set(
      claim.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );
    
    const truthWords = new Set(
      groundTruth.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    const overlap = new Set([...claimWords].filter(w => truthWords.has(w)));
    const similarity = overlap.size / claimWords.size;

    return {
      verified: similarity > 0.3,
      confidence: similarity,
      method: 'keyword_matching'
    };
  }
}

// Usage
const detector = new HallucinationDetector();
const documentation = fs.readFileSync('api-docs.md', 'utf-8');

const analysis = await detector.analyze(claudeResponse, documentation);

if (analysis.hallucinationRate > 0.2) {
  console.warn('High hallucination rate detected:', analysis.hallucinationRate);
}
```

2. Verify against documentation
```javascript
class DocumentationVerifier {
  constructor(docs) {
    this.docs = docs;
    this.index = this.buildIndex(docs);
  }

  buildIndex(docs) {
    // Build searchable index of documentation
    const index = new Map();

    // Simple word-based index
    const words = docs.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) {
        if (!index.has(word)) {
          index.set(word, 0);
        }
        index.set(word, index.get(word) + 1);
      }
    });

    return index;
  }

  verify(claim) {
    const claimWords = claim.toLowerCase().split(/\s+/);
    const foundWords = claimWords.filter(word => 
      this.index.has(word)
    );

    const coverage = foundWords.length / claimWords.length;

    return {
      verified: coverage > 0.5,
      coverage,
      foundWords: foundWords.length,
      totalWords: claimWords.length
    };
  }

  findSupport(claim) {
    // Find supporting documentation
    const claimWords = new Set(
      claim.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    const paragraphs = this.docs.split(/\n\n+/);
    const scored = paragraphs.map(para => {
      const paraWords = new Set(para.toLowerCase().split(/\s+/));
      const overlap = new Set([...claimWords].filter(w => paraWords.has(w)));
      
      return {
        paragraph: para,
        score: overlap.size
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(s => s.score > 0);
  }
}
```

**Solutions:**

Step 1: Ground Responses in Documentation
```javascript
class GroundedResponseGenerator {
  constructor(documentation) {
    this.docs = documentation;
    this.verifier = new DocumentationVerifier(documentation);
  }

  async generateGrounded(question) {
    // Include relevant documentation in prompt
    const relevantDocs = await this.findRelevantDocs(question);
    
    const prompt = `Using ONLY the following documentation as reference, answer the question.
Do not make assumptions or add information not in the documentation.
If the answer is not in the documentation, say so.

Documentation:
${relevantDocs}

Question: ${question}

Answer based strictly on the documentation above:`;

    const response = await callClaude(prompt);

    // Verify response
    const verification = await this.verifyResponse(response);

    if (!verification.grounded) {
      console.warn('Response may not be fully grounded:', verification);
    }

    return {
      response,
      verification,
      sources: relevantDocs
    };
  }

  async findRelevantDocs(question) {
    // Simple relevance scoring
    const questionWords = new Set(
      question.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );

    const sections = this.docs.split(/\n##/);
    const scored = sections.map(section => {
      const sectionWords = new Set(
        section.toLowerCase().split(/\s+/)
      );
      const overlap = new Set([...questionWords].filter(w => sectionWords.has(w)));
      
      return {
        section,
        score: overlap.size
      };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(s => s.section)
      .join('\n\n');
  }

  async verifyResponse(response) {
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [];
    const verifications = sentences.map(sentence => 
      this.verifier.verify(sentence)
    );

    const grounded = verifications.filter(v => v.verified).length;
    const total = verifications.length;

    return {
      grounded: total > 0 && grounded / total > 0.8,
      groundedPercentage: total > 0 ? grounded / total : 0,
      totalStatements: total,
      groundedStatements: grounded,
      ungroundedStatements: verifications
        .map((v, i) => ({ sentence: sentences[i], ...v }))
        .filter(v => !v.verified)
    };
  }
}

// Usage
const docs = fs.readFileSync('api-documentation.md', 'utf-8');
const generator = new GroundedResponseGenerator(docs);

const result = await generator.generateGrounded(
  'What authentication methods are supported?'
);

console.log(result.response);
console.log('Grounded:', result.verification.groundedPercentage * 100 + '%');
```

Step 2: Add Citations
```javascript
class CitationGenerator {
  async generateWithCitations(question, sources) {
    const prompt = `Answer the question using the provided sources.
After each claim, add a citation like [Source 1] or [Source 2].

Sources:
${sources.map((s, i) => `[Source ${i + 1}]: ${s}`).join('\n\n')}

Question: ${question}

Answer with citations:`;

    const response = await callClaude(prompt);

    return {
      response,
      citations: this.extractCitations(response),
      sources
    };
  }

  extractCitations(text) {
    const citationPattern = /\[Source (\d+)\]/g;
    const citations = [];
    let match;

    while ((match = citationPattern.exec(text)) !== null) {
      citations.push({
        sourceId: parseInt(match[1]),
        position: match.index
      });
    }

    return citations;
  }

  verifyCitations(response, sources) {
    const citations = this.extractCitations(response);
    const valid = citations.every(c => c.sourceId > 0 && c.sourceId <= sources.length);

    return {
      valid,
      totalCitations: citations.length,
      uniqueSources: new Set(citations.map(c => c.sourceId)).size,
      coverage: citations.length > 0
    };
  }
}
```

Step 3: Implement Fact-Checking
```javascript
class FactChecker {
  async check(response, knownFacts) {
    const claims = await this.extractFactualClaims(response);
    const checks = [];

    for (const claim of claims) {
      const result = await this.checkClaim(claim, knownFacts);
      checks.push({
        claim,
        ...result
      });
    }

    return {
      totalClaims: claims.length,
      verified: checks.filter(c => c.status === 'verified').length,
      contradicted: checks.filter(c => c.status === 'contradicted').length,
      unknown: checks.filter(c => c.status === 'unknown').length,
      details: checks
    };
  }

  async extractFactualClaims(response) {
    const prompt = `Extract factual claims from this text as a JSON array:

${response}

Return only claims that can be verified as true or false.
Format: ["claim 1", "claim 2", ...]`;

    const result = await callClaude(prompt);
    
    try {
      return JSON.parse(result);
    } catch {
      return [];
    }
  }

  async checkClaim(claim, knownFacts) {
    // Check against known facts
    for (const fact of knownFacts) {
      if (this.areEquivalent(claim, fact)) {
        return { status: 'verified', matchedFact: fact };
      }
      
      if (this.areContradictory(claim, fact)) {
        return { status: 'contradicted', contradictedFact: fact };
      }
    }

    return { status: 'unknown' };
  }

  areEquivalent(claim1, claim2) {
    // Simplified equivalence check
    const norm1 = this.normalize(claim1);
    const norm2 = this.normalize(claim2);
    
    return norm1 === norm2;
  }

  areContradictory(claim1, claim2) {
    // Check for contradictions
    const norm1 = this.normalize(claim1);
    const norm2 = this.normalize(claim2);

    // Look for negation patterns
    const hasNegation1 = /\b(not|no|never|isn't|aren't|doesn't|don't)\b/i.test(claim1);
    const hasNegation2 = /\b(not|no|never|isn't|aren't|doesn't|don't)\b/i.test(claim2);

    if (hasNegation1 !== hasNegation2) {
      // One is negated, check if otherwise similar
      const content1 = norm1.replace(/\b(not|no|never|isnt|arent|doesnt|dont)\b/gi, '');
      const content2 = norm2.replace(/\b(not|no|never|isnt|arent|doesnt|dont)\b/gi, '');
      
      return this.similarity(content1, content2) > 0.8;
    }

    return false;
  }

  normalize(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  similarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }
}

// Usage
const checker = new FactChecker();
const knownFacts = [
  'The application uses PostgreSQL database',
  'The API supports OAuth 2.0 authentication',
  'The service runs on port 3000'
];

const check = await checker.check(claudeResponse, knownFacts);

if (check.contradicted > 0) {
  console.error('Response contains contradicted claims:');
  check.details
    .filter(d => d.status === 'contradicted')
    .forEach(d => {
      console.error(`  Claim: "${d.claim}"`);
      console.error(`  Contradicts: "${d.contradictedFact}"`);
    });
}
```

**Prevention Strategies:**
- Always ground responses in provided documentation
- Use citations to trace claims to sources
- Implement fact-checking against known truths
- Explicitly instruct Claude not to speculate
- Verify critical information independently

**Related Issues:** Incorrect code examples, wrong API usage, misleading advice

**When to Escalate:** Document specific hallucinations with examples for model improvement feedback.

---

This comprehensive quality and accuracy troubleshooting guide provides tools and techniques for detecting and preventing common quality issues including inconsistencies, hallucinations, and factual errors in Claude's responses.
