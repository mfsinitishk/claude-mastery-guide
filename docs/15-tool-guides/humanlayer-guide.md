# HumanLayer: Human-in-the-Loop Development with Claude

## What is HumanLayer?

HumanLayer is an open-source platform that adds **deterministic human oversight** to AI agent workflows. It ensures that high-stakes operations -- sending emails, deploying code, modifying production data -- always require human approval before execution.

```
┌─────────────────────────────────────────────────────────┐
│              Without HumanLayer                         │
│                                                         │
│  Claude: "I'll deploy to production now."               │
│  *deploys broken code*                                  │
│  Developer: "WAIT! I didn't approve that!"              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              With HumanLayer                            │
│                                                         │
│  Claude: "I'd like to deploy to production."            │
│  HumanLayer: [Approval Request] Deploy v2.3.1?          │
│  Developer: [Reviews changes] -> Approved               │
│  Claude: *deploys approved version*                     │
│  Developer: "Perfect, exactly what I wanted."           │
└─────────────────────────────────────────────────────────┘
```

### Why HumanLayer Matters

Even the best LLMs can hallucinate, misinterpret instructions, or make errors. HumanLayer's key insight is that **the approval mechanism is baked into the tool itself**, not bolted on as an afterthought. Even if the AI hallucinates, the approval gate catches it before any damage occurs.

### What HumanLayer Provides

HumanLayer is actually two interconnected products:

| Product | Description |
|---------|-------------|
| **HumanLayer SDK** | Open-source Python/TypeScript/Go SDK for adding human approval gates to AI agent workflows |
| **CodeLayer IDE** | Desktop application for orchestrating multiple Claude Code sessions with approval flows |

### The 12 Factor Agents Philosophy

HumanLayer's creators developed the [12 Factor Agents](https://www.humanlayer.dev/blog/12-factor-agents) methodology. The most relevant principles:

1. **Own Your Context Window** -- Curate what enters the LLM's attention
2. **Contact Humans with Tool Calls** -- Use structured JSON for human interactions
3. **Small, Focused Agents** -- 3-20 steps maximum per agent
4. **Make Your Agent a Stateless Reducer** -- Predictable, reproducible behavior

## Prerequisites

- **Claude Code** CLI installed and authenticated
- **Python 3.10+** (for Python SDK) or **Node.js 18+** (for TypeScript SDK)
- **Anthropic API key** (for programmatic Claude sessions)
- Optional: **Slack workspace** (for Slack approval channels)

## Part 1: HumanLayer SDK -- Adding Approval Gates

### Step 1: Install the SDK

=== "Python"

    ```bash
    pip install humanlayer
    ```

=== "TypeScript"

    ```bash
    npm install humanlayer
    # or
    npm install @humanlayer/sdk
    ```

=== "Go"

    ```bash
    go get github.com/humanlayer/humanlayer/claudecode-go
    ```

### Step 2: Basic Approval Pattern

The core pattern is the `@require_approval` decorator. Any function wrapped with it will pause execution and wait for human approval before running.

=== "Python"

    ```python
    from humanlayer import HumanLayer

    hl = HumanLayer()

    @hl.require_approval()
    def send_email(to: str, subject: str, body: str) -> str:
        """Send an email to a customer."""
        # This function will NOT execute until a human approves
        email_service.send(to=to, subject=subject, body=body)
        return f"Email sent to {to}"

    @hl.require_approval()
    def deploy_to_production(version: str) -> str:
        """Deploy a specific version to production."""
        deploy_service.deploy(version)
        return f"Deployed {version} to production"

    # Use these tools with your LLM
    run_llm_task(
        prompt="Send a welcome email to new-user@example.com",
        tools=[send_email, deploy_to_production],
        llm="claude-sonnet-4-6"
    )
    ```

=== "TypeScript"

    ```typescript
    import { HumanLayer } from "humanlayer";

    const hl = new HumanLayer();

    const sendEmail = hl.requireApproval()(
      async (to: string, subject: string, body: string) => {
        await emailService.send({ to, subject, body });
        return `Email sent to ${to}`;
      }
    );
    ```

### Step 3: Human as a Tool (Contact Human)

Beyond approvals, HumanLayer lets the AI **ask humans questions** during execution:

```python
from humanlayer import HumanLayer

hl = HumanLayer()

# Create a "contact human" tool the AI can use
contact_a_human = hl.human_as_tool()

run_llm_task(
    prompt="""Draft a marketing email for our new feature.
    Get feedback from the team before sending.""",
    tools=[send_email, contact_a_human],
    llm="claude-sonnet-4-6"
)
```

The AI can now:
1. Draft the email
2. Use `contact_a_human` to ask "Does this email look good?"
3. Receive feedback: "Change the subject line to be more specific"
4. Revise the email
5. Use `send_email` (which requires approval) to send the final version

### Step 4: Approval Channels

Route approvals to different channels based on the operation:

```python
from humanlayer import (
    HumanLayer,
    ContactChannel,
    SlackContactChannel,
    EmailContactChannel,
)

# Define approval channels
dm_with_ceo = ContactChannel(
    slack=SlackContactChannel(
        channel_or_user_id="U123456",
        context_about_channel_or_user="a DM with the CEO",
    )
)

engineering_channel = ContactChannel(
    slack=SlackContactChannel(
        channel_or_user_id="C789012",
        context_about_channel_or_user="the #engineering Slack channel",
    )
)

compliance_email = ContactChannel(
    email=EmailContactChannel(
        address="compliance@example.com",
        context_about_user="the compliance team",
    )
)

hl = HumanLayer()

# Route different operations to different approvers
@hl.require_approval(contact_channel=dm_with_ceo)
def approve_budget(amount: float, purpose: str) -> str:
    """Approve a budget expenditure."""
    return f"Budget of ${amount} approved for {purpose}"

@hl.require_approval(contact_channel=engineering_channel)
def deploy_to_production(version: str) -> str:
    """Deploy to production."""
    return f"Deployed {version}"

@hl.require_approval(contact_channel=compliance_email)
def modify_customer_data(customer_id: str, changes: dict) -> str:
    """Modify customer PII data."""
    return f"Updated customer {customer_id}"
```

### Step 5: Handling Denials

When a human denies a request, the AI receives feedback and can adapt:

```python
# When a human denies with a message:
# "Use 500 instead of 1000 for the budget"

# The AI receives:
# "User denied approve_budget with message: Use 500 instead of 1000"

# The AI can then retry with the corrected value:
approve_budget(amount=500, purpose="marketing campaign")
```

This creates a natural feedback loop where the AI learns from human corrections within the same session.

### Step 6: Stakes-Based Classification

Classify operations by risk level to determine what needs approval:

```python
from humanlayer import HumanLayer

hl = HumanLayer()

# LOW STAKES: No approval needed
def search_products(query: str) -> list:
    """Search public product catalog."""
    return product_db.search(query)

# MEDIUM STAKES: Optional approval
@hl.require_approval()
def read_customer_profile(customer_id: str) -> dict:
    """Read private customer data."""
    return customer_db.get(customer_id)

# HIGH STAKES: Mandatory approval, routed to specific channel
@hl.require_approval(contact_channel=engineering_channel)
def delete_customer_account(customer_id: str) -> str:
    """Permanently delete a customer account."""
    customer_db.delete(customer_id)
    return f"Account {customer_id} deleted"
```

| Stakes Level | Examples | Approval |
|-------------|----------|----------|
| **Low** | Read public data, search docs | None needed |
| **Medium** | Read private data, internal APIs | Optional |
| **High** | Write production data, deploy, send emails | Mandatory |

## Part 2: Programmatic Claude Code Sessions (Go SDK)

HumanLayer's Go SDK (`claudecode-go`) lets you programmatically launch and manage Claude Code sessions with built-in approval flows.

### Step 1: Install the Go SDK

```bash
go get github.com/humanlayer/humanlayer/claudecode-go
```

### Step 2: Simple Blocking Session

```go
package main

import (
    "fmt"
    "log"

    claudecode "github.com/humanlayer/humanlayer/claudecode-go"
)

func main() {
    client, err := claudecode.NewClient()
    if err != nil {
        log.Fatal(err)
    }

    result, err := client.LaunchAndWait(claudecode.SessionConfig{
        Query: "Write a hello world HTTP server in Go",
        Model: claudecode.ModelSonnet,
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Result:", result.Result)
    fmt.Printf("Cost: $%.4f\n", result.CostUSD)
}
```

### Step 3: Streaming Session with Events

```go
session, err := client.Launch(claudecode.SessionConfig{
    Query:        "Build a REST API with authentication",
    Model:        claudecode.ModelSonnet,
    OutputFormat: claudecode.OutputStreamJSON,
    MaxTurns:     50,
    WorkingDir:   "/path/to/project",
})
if err != nil {
    log.Fatal(err)
}

for event := range session.Events {
    switch event.Type {
    case "assistant":
        for _, block := range event.Message.Content {
            if block.Text != "" {
                fmt.Println("Claude:", block.Text)
            }
        }
    case "result":
        fmt.Printf("Done! Cost: $%.4f\n", event.Result.CostUSD)
    }
}
```

### Step 4: Sessions with MCP Approval Integration

Connect Claude Code sessions to HumanLayer's approval system:

```go
mcpConfig := &claudecode.MCPConfig{
    MCPServers: map[string]claudecode.MCPServer{
        "approvals": {
            Command: "npx",
            Args:    []string{"humanlayer", "mcp", "claude_approvals"},
        },
    },
}

session, err := client.Launch(claudecode.SessionConfig{
    Query:                "Deploy the latest version to production",
    MCPConfig:            mcpConfig,
    PermissionPromptTool: "mcp__approvals__request_permission",
    AllowedTools:         []string{"mcp__approvals__*"},
})
```

Now when Claude tries to perform a risky action, it calls the MCP approval tool, which routes to a human for verification.

### Session Lifecycle

Sessions progress through these states:

```
draft -> starting -> running -> waiting_input -> completed
                        │                           │
                        └── interrupting ──> interrupted
                                                    │
                                              failed / discarded
```

## Part 3: Context Engineering Best Practices

HumanLayer's team pioneered the concept of **context engineering** -- the discipline of carefully managing what enters an AI's context window. This is critical for effective Claude Code usage.

### The "Dumb Zone"

When context window utilization exceeds ~40%, LLM performance degrades significantly:

```
Context Utilization    Performance
0%   ─────────────     (empty - no context)
10%  ████░░░░░░░░░     Good
20%  ████████░░░░░     Good
40%  ████████████░     SWEET SPOT (40-60%)
60%  ████████████████  Starting to degrade
80%  ████████████████  "Dumb Zone" - errors increase
100% ████████████████  Maximum degradation
```

### The RPI Workflow (Research, Plan, Implement)

Structure your Claude Code sessions in three phases:

#### Phase 1: Research

```
Research the authentication module. Do NOT write any code.
Examine:
- Current auth flow in src/auth/
- Database schema for users and sessions
- Existing test coverage
- Error handling patterns

Return structured findings as a summary.
```

#### Phase 2: Plan

```
Based on the research, create a detailed implementation plan for
adding OAuth2 support. Include:
- Specific files to create/modify (with line numbers)
- Database migration steps
- Testing strategy
- Rollback approach

Write the plan to docs/plans/oauth2-plan.md
```

**Human reviews the plan here** -- this is the critical checkpoint.

#### Phase 3: Implement

```
Implement the OAuth2 support following the plan in
docs/plans/oauth2-plan.md exactly. Check off each item
as you complete it.
```

### Frequent Intentional Compaction (FIC)

After completing each phase, compact the context:

```
Summarize what we've accomplished so far. Update the plan file
with: current status, completed steps, remaining work, and any
issues encountered. Then we'll continue with fresh context.
```

### Sub-Agents as "Context Firewalls"

Use sub-agents to isolate context-heavy research:

```
I need to understand the database schema before making changes.
Please launch a sub-agent to:
1. Read all migration files in db/migrations/
2. Map table relationships
3. Return a concise schema summary

Don't load the full migration content into this conversation.
```

### CLAUDE.md Best Practices (from HumanLayer)

HumanLayer's team found specific guidance on CLAUDE.md effectiveness:

**Keep it under 60 lines.** Their research showed:

- Agents spent **14-22% more reasoning tokens** on bloated CLAUDE.md files without improving resolution rates
- **Codebase overviews and directory listings did not help** -- agents discover structure on their own
- Auto-generated CLAUDE.md files performed poorly

**What to include:**

```markdown
# CLAUDE.md

## Build & Test
make setup          # First-time setup
make check-test     # All checks and tests
make test           # Tests only

## Code Conventions
- Use TODO(0-4) annotations for priority tracking
- Prefer composition over inheritance
- All public APIs must have integration tests

## Architecture Decisions
- Event sourcing for audit trail (see ADR-003)
- PostgreSQL for OLTP, BigQuery for analytics
```

**What NOT to include:**

- Directory listings (`src/`, `lib/`, `tests/` -- the agent can `ls`)
- Codebase overviews ("This is a Node.js app that..." -- the agent can read `package.json`)
- Exhaustive style guides (point to `.eslintrc` instead)
- Copy-pasted documentation (link to it instead)

## Part 4: Framework Integrations

HumanLayer works with multiple AI frameworks:

### LangChain Integration

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from humanlayer import HumanLayer

hl = HumanLayer()

@hl.require_approval()
def book_flight(destination: str, date: str) -> str:
    """Book a flight to a destination."""
    return f"Flight booked to {destination} on {date}"

# Create LangChain tools from the decorated function
tools = [book_flight]

llm = ChatOpenAI(model="gpt-4o")
agent = create_openai_tools_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools)

executor.invoke({"input": "Book a flight to NYC for next Friday"})
```

### CrewAI Integration

```python
from crewai import Agent, Task, Crew
from humanlayer import HumanLayer

hl = HumanLayer()

@hl.require_approval()
def publish_article(title: str, content: str) -> str:
    """Publish an article to the blog."""
    return f"Published: {title}"

writer = Agent(
    role="Content Writer",
    tools=[publish_article, hl.human_as_tool()],
)

review_task = Task(
    description="Write and publish a blog post about AI safety",
    agent=writer,
)

crew = Crew(agents=[writer], tasks=[review_task])
crew.kickoff()
```

### Vercel AI SDK Integration (TypeScript)

```typescript
import { HumanLayer } from "@humanlayer/sdk";
import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

const hl = new HumanLayer();

const tools = {
  sendEmail: hl.requireApproval()(
    async ({ to, subject, body }) => {
      await emailService.send({ to, subject, body });
      return `Sent to ${to}`;
    }
  ),
};

const result = await generateText({
  model: anthropic("claude-sonnet-4-6"),
  prompt: "Send a welcome email to user@example.com",
  tools,
});
```

## Part 5: Multi-Agent Orchestration

### Running Parallel Claude Sessions

HumanLayer supports running multiple Claude Code sessions simultaneously:

```go
package main

import (
    "sync"
    claudecode "github.com/humanlayer/humanlayer/claudecode-go"
)

func main() {
    client, _ := claudecode.NewClient()
    var wg sync.WaitGroup

    // Launch parallel agents for different tasks
    tasks := []claudecode.SessionConfig{
        {
            Query:      "Implement the database migration for user preferences",
            Model:      claudecode.ModelSonnet,
            WorkingDir: "/project",
        },
        {
            Query:      "Write unit tests for the auth module",
            Model:      claudecode.ModelHaiku,
            WorkingDir: "/project",
        },
        {
            Query:      "Update API documentation for v2 endpoints",
            Model:      claudecode.ModelHaiku,
            WorkingDir: "/project",
        },
    }

    for _, task := range tasks {
        wg.Add(1)
        go func(cfg claudecode.SessionConfig) {
            defer wg.Done()
            result, _ := client.LaunchAndWait(cfg)
            fmt.Printf("Completed: %s (cost: $%.4f)\n",
                cfg.Query[:40], result.CostUSD)
        }(task)
    }

    wg.Wait()
}
```

### Agent Specialization

Assign different roles to different agents:

```go
// Database specialist (uses Sonnet for complex reasoning)
dbAgent := claudecode.SessionConfig{
    Query: "Analyze query performance and suggest index optimizations",
    Model: claudecode.ModelSonnet,
    SystemPrompt: "You are a database performance specialist.",
}

// Test writer (uses Haiku for cost efficiency)
testAgent := claudecode.SessionConfig{
    Query: "Write integration tests for the payment module",
    Model: claudecode.ModelHaiku,
    SystemPrompt: "You are a test engineering specialist.",
}
```

## Part 6: TODO Priority System

HumanLayer uses a structured TODO annotation system in their codebase that you can adopt:

```
TODO(0): Critical - never merge with these present
TODO(1): High - architectural flaws, major bugs
TODO(2): Medium - minor bugs, missing features
TODO(3): Low - polish, tests, documentation
TODO(4): Questions/investigations needed
PERF:    Performance optimization opportunities
```

### Usage in Code

```python
# TODO(0): This bypasses auth checks -- must fix before merge
def get_admin_data():
    return db.query("SELECT * FROM admin_settings")

# TODO(2): Add rate limiting to this endpoint
@app.route("/api/search")
def search():
    ...

# TODO(4): Should we use Redis or Memcached for session storage?
# PERF: This query scans the full table -- needs an index
```

## Part 7: Harness Engineering

HumanLayer introduced the concept of **harness engineering** -- optimizing Claude Code's configuration for better results.

### The Formula

```
coding agent = AI model(s) + harness
```

The model is only one part. The **harness** -- CLAUDE.md, MCP servers, skills, sub-agents, hooks -- determines how effectively the model is used.

### Five Configuration Points

```
┌──────────────────────────────────────────────┐
│              Claude Code Harness             │
│                                              │
│  1. CLAUDE.md    - Static context (< 60 LOC) │
│  2. MCP Servers  - External tool access      │
│  3. Skills       - Reusable knowledge bundles │
│  4. Sub-Agents   - Context isolation          │
│  5. Hooks        - Lifecycle automation       │
│                                              │
│  Principle: Add config only when agents      │
│  consistently fail. Less is more.            │
└──────────────────────────────────────────────┘
```

### Key Insights

1. **Bias towards shipping code** -- Don't over-engineer the harness
2. **Add configurations only when agents consistently fail** -- Not proactively
3. **Optimize for iteration speed** -- Fast feedback loops beat perfect setups
4. **Implement context-efficient back-pressure** -- Use verification tools (type checks, tests) instead of verbose instructions
5. **Too many MCP tools bloat the context** -- Each tool definition consumes tokens

!!! warning "The 'Dumb Zone' in Practice"
    If you add 15 MCP servers with 200+ tools, the tool definitions alone can push your context into the dumb zone before the conversation even starts. Start with 2-3 essential MCP servers and add more only when needed.

## Part 8: Webhook-Driven Stateless Agents

For production systems, use webhook-driven agents that can pause and resume:

```python
from fastapi import FastAPI
from humanlayer import HumanLayer

app = FastAPI()
hl = HumanLayer()

@app.post("/webhook/process-order")
async def process_order(order: dict):
    """Process an order with human approval for high-value items."""

    @hl.require_approval()
    def charge_customer(amount: float, customer_id: str):
        return payment_service.charge(amount, customer_id)

    # The agent runs, but pauses at charge_customer
    # waiting for human approval via Slack/email
    result = await run_agent(
        prompt=f"Process order {order['id']}",
        tools=[charge_customer, hl.human_as_tool()],
    )

    return {"status": "processed", "result": result}
```

## Putting It All Together: A Complete Workflow

Here's how OpenSpec and HumanLayer complement each other in a real project:

```
1. SPECIFY (OpenSpec)
   /opsx:propose add-payment-processing
   - Define requirements with specs
   - Human reviews and approves proposal

2. IMPLEMENT (Claude Code)
   /opsx:apply add-payment-processing
   - Claude implements following the spec
   - Code is written with approval gates

3. APPROVE (HumanLayer)
   @hl.require_approval()
   def process_payment(amount, customer_id):
       ...
   - High-stakes functions require human approval
   - Approvals routed to appropriate channels

4. VERIFY (Both)
   /opsx:verify add-payment-processing
   - Specs validated against implementation
   - Approval flows tested end-to-end

5. DEPLOY (HumanLayer)
   @hl.require_approval(contact_channel=engineering)
   def deploy(version):
       ...
   - Deployment requires engineering approval
   - Rollback plan from OpenSpec proposal
```

## Troubleshooting

### Common Issues

**"HumanLayer approval times out"**
```python
# Increase timeout for approvals that take longer
hl = HumanLayer(http_timeout_seconds=300)  # 5 minutes
```

**"Slack notifications not arriving"**
```python
# Verify channel ID (not channel name)
# Use Slack API to find the correct ID:
# GET https://slack.com/api/conversations.list
```

**"Claude Code session fails to start"**
```go
// Ensure Claude Code CLI is installed and authenticated
// Run: claude --version
// Run: claude auth status
```

**"MCP approval server won't connect"**
```bash
# Test the MCP server manually
npx humanlayer mcp claude_approvals
# Check logs for connection errors
```

## Additional Resources

- [HumanLayer Website](https://www.humanlayer.dev)
- [HumanLayer GitHub](https://github.com/humanlayer/humanlayer)
- [12 Factor Agents](https://www.humanlayer.dev/blog/12-factor-agents)
- [Advanced Context Engineering](https://www.humanlayer.dev/blog/advanced-context-engineering)
- [Harness Engineering Blog](https://www.humanlayer.dev/blog/skill-issue-harness-engineering-for-coding-agents)
- [claudecode-go Package Docs](https://pkg.go.dev/github.com/humanlayer/humanlayer/claudecode-go)
- ["No Vibes Allowed" Talk (YouTube)](https://www.youtube.com/watch?v=rmvDxxNubIg)
- [PyPI Package](https://pypi.org/project/humanlayer/)
