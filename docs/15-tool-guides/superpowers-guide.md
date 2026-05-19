# Superpowers: Disciplined AI Development with Claude

## What is Superpowers?

Superpowers is an open-source **agentic skills framework** created by **Jesse Vincent** (obra) that transforms Claude Code from a reactive code generator into a disciplined, structured development partner. It ships as a set of 14 markdown skill files that enforce engineering best practices like TDD, systematic debugging, and structured planning.

```
┌─────────────────────────────────────────────────────────┐
│              Without Superpowers                        │
│                                                         │
│  Developer: "Build a CSV parser"                        │
│  Claude: *immediately writes 500 lines of code*         │
│  Claude: "Here's your parser! It should work."          │
│  Developer: *finds 12 edge case bugs*                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              With Superpowers                           │
│                                                         │
│  Developer: "Build a CSV parser"                        │
│  Claude: "Before we code, let me understand:            │
│           - RFC 4180 compliance needed?                  │
│           - Custom delimiters?                           │
│           - Streaming for large files?"                  │
│  Developer: "Yes, yes, and yes"                         │
│  Claude: *creates design doc, writes plan, then*        │
│          *implements with TDD -- test first, code after* │
└─────────────────────────────────────────────────────────┘
```

### The Core Insight

> "What AI coding agents lack is not capability but **discipline**. And discipline can be distributed as plain text."

Left alone, AI agents skip tests, implement features before understanding requirements, apply quick fixes to undiagnosed bugs, and solve the wrong problem. Superpowers fixes this by injecting structured workflows via markdown files that Claude reads and follows.

### Key Facts

- **197,000+ GitHub stars**, 17,600+ forks
- **Zero dependencies** -- entirely markdown files, no npm packages or build steps
- **14 skills** covering the full development lifecycle
- Part of the **official Anthropic Claude Code plugin marketplace**
- Created by Jesse Vincent (creator of Request Tracker, former Perl 6 manager, co-founder of Keyboardio)
- MIT licensed, version 5.1.0

## Step 1: Install Superpowers

=== "Official Marketplace (Recommended)"

    ```
    /plugin install superpowers@claude-plugins-official
    ```

=== "Superpowers Marketplace"

    ```
    # Register the marketplace first
    /plugin marketplace add obra/superpowers-marketplace

    # Then install
    /plugin install superpowers@superpowers-marketplace
    ```

After installation, **restart Claude Code** with `/exit` and start a new session.

### Verify Installation

Start a new Claude Code session and describe a project:

```
"I want to build a REST API for a bookstore"
```

If Superpowers is working, Claude will **NOT** immediately write code. Instead, it will ask clarifying questions -- the brainstorming skill fires automatically.

### Update

```
/plugin update superpowers
```

## Step 2: Understand the 14 Skills

Superpowers ships 14 skills that activate automatically based on context. You don't need to invoke them manually.

### Core Workflow Skills

#### 1. Brainstorming

Activates before writing any code. Refines rough ideas through Socratic questioning.

**What it does:**
- Asks clarifying questions one at a time
- Explores multiple design approaches
- Presents design in digestible sections for validation
- Saves a design document
- **Hard gate**: Prevents ANY implementation before design approval

**Example:**
```
You: "Build a notification system"

Claude [brainstorming skill active]:
"Before we start coding, I want to understand your needs:

1. What types of notifications? (email, push, in-app, SMS?)
2. Real-time or batched delivery?
3. Do users need notification preferences/muting?
4. Expected volume? (10/day or 10,000/second?)
5. Any compliance requirements? (GDPR opt-out, CAN-SPAM?)"
```

#### 2. Test-Driven Development (TDD)

Enforces the RED-GREEN-REFACTOR cycle for every piece of code.

**The Iron Law:**

> "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST."

**The cycle:**
```
1. RED    -- Write a failing test
2. FAIL   -- Run it, watch it fail (confirms test validity)
3. GREEN  -- Write minimal code to make it pass
4. PASS   -- Run it, watch it pass
5. REFACTOR -- Clean up, commit
6. REPEAT
```

**What happens if you try to skip tests:**
```
You: "Just write the parser, we'll add tests later"

Claude [TDD skill active]:
"I understand the urgency, but the TDD skill requires me to 
write tests first. This actually saves time -- finding bugs 
in tests is 10x faster than finding them in production.

Let me start with the first test case: parsing a simple 
single-row CSV..."
```

#### 3. Writing Plans

Breaks work into bite-sized tasks (2-5 minutes each).

**Every task includes:**
- Exact file paths
- Complete runnable code (no pseudocode)
- Terminal commands
- Verification steps
- Git commit messages

**What it enforces:** DRY, YAGNI, TDD, and frequent commits.

#### 4. Subagent-Driven Development

Dispatches a fresh subagent per task for maximum efficiency.

**How it works:**
```
Main Claude Session
    │
    ├── Subagent 1: "Implement Task 1 (project scaffolding)"
    │   └── Two-stage review: spec compliance → code quality
    │
    ├── Subagent 2: "Implement Task 2 (data model)"
    │   └── Two-stage review: spec compliance → code quality
    │
    ├── Subagent 3: "Implement Task 3 (API routes)"
    │   └── Two-stage review: spec compliance → code quality
    │
    └── ... continues for all tasks
```

**Benefits:**
- Fresh context window per task (no accumulated noise)
- Two-stage review catches both spec deviations and code quality issues
- Continuous execution without human intervention
- Matches model complexity to task complexity

#### 5. Using Git Worktrees

Creates isolated workspaces for development.

**What it does:**
1. Detects existing isolation (are we already in a worktree?)
2. Creates a new worktree on a feature branch
3. Runs project setup with auto-detection (npm, pip, cargo, etc.)
4. Verifies a clean test baseline before changes begin

#### 6. Requesting Code Review

Dispatches a code reviewer subagent after implementation.

**When it fires:**
- After each task in subagent-driven development
- After major features
- Before merges

**Severity levels:**
- **Critical** -- Fix immediately, blocks progress
- **Important** -- Fix before proceeding
- **Minor** -- Note for later improvement

### Supporting Skills

| Skill | Purpose |
|-------|---------|
| **Executing Plans** | Sequential task execution (for platforms without subagent support) |
| **Dispatching Parallel Agents** | Run 2+ independent tasks simultaneously |
| **Receiving Code Review** | Handle review feedback professionally -- push back on incorrect feedback |
| **Finishing a Development Branch** | Verify tests, present options (merge/PR/keep/discard), clean up |
| **Systematic Debugging** | 4-phase root cause analysis before any fix attempt |
| **Verification Before Completion** | Fresh evidence required -- no "should work" claims |
| **Writing Skills** | Meta-skill for creating new skills using TDD |
| **Using Superpowers** | Bootstrap meta-skill loaded at session start |

## Step 3: The Complete Development Workflow

Here's how a typical Superpowers session flows:

### Phase 1: Brainstorming (Automatic)

```
You: "I want to build a CLI tool for managing dotfiles"

Claude: "Great idea! Let me understand your needs before we design anything.

What dotfiles do you want to manage? (shell configs, git, vim, 
tmux, all of the above?)

What's your sync strategy? (git repo, symlinks, copy-on-write?)

Do you need per-machine profiles? (work laptop vs personal vs server?)"
```

You answer each question. Claude presents a design document in sections for your approval.

### Phase 2: Worktree Setup (Automatic)

```
Claude: "Creating an isolated workspace for this feature..."

Created worktree: .worktrees/dotfiles-manager
Branch: feature/dotfiles-manager
Running: npm install
Verifying: All 0 tests pass (clean baseline) ✓
```

### Phase 3: Plan Creation

```
Claude: "Here's the implementation plan with 12 tasks:

Task 1: Project scaffolding [P]
  - Create package.json with TypeScript config
  - Set up Vitest
  - Create src/ directory structure
  Files: package.json, tsconfig.json, vitest.config.ts
  Verify: npm run build && npm test
  Commit: 'chore: initialize project scaffolding'

Task 2: CLI argument parser [P]
  - Implement command parsing with Commander.js
  - Support: init, link, unlink, status, sync
  Files: src/cli.ts, src/commands/index.ts
  Verify: npm test (CLI parsing tests)
  Commit: 'feat: add CLI argument parser'

Task 3: Dotfile scanner
  - Depends on: Task 2
  ..."
```

You review and approve the plan.

### Phase 4: Implementation (TDD + Subagents)

Each task is implemented with the TDD cycle:

```
[Subagent for Task 2: CLI argument parser]

Step 1 (RED): Writing test...
  ✏️  test/cli.test.ts - "should parse 'init' command"

Step 2 (FAIL): Running test...
  ❌ FAIL: Cannot find module '../src/cli'

Step 3 (GREEN): Writing implementation...
  ✏️  src/cli.ts - Commander.js setup with init command

Step 4 (PASS): Running test...
  ✅ PASS: 1 test passed

Step 5 (REFACTOR): Code review...
  ✅ No issues found

Step 6: Committing...
  📝 "feat: add CLI argument parser"
```

### Phase 5: Code Review (Automatic)

```
Claude [code review subagent]:
"Review of dotfiles-manager implementation:

✅ All 36 tests passing
✅ TypeScript strict mode compliance
✅ No lint warnings

⚠️  Important: src/sync.ts line 45 -- the recursive symlink 
    check doesn't handle circular references. Add a visited 
    set to prevent infinite loops.

ℹ️  Minor: Consider adding --dry-run flag to the sync command 
    for safety."
```

### Phase 6: Finishing (Automatic)

```
Claude: "All tasks complete. Tests passing. Options:

1. Merge into main locally
2. Push and create a Pull Request
3. Keep the branch for more work
4. Discard everything

Which would you like?"
```

## Step 4: The Anti-Rationalization System

One of Superpowers' most distinctive features is the **Red Flags table** -- a built-in system that prevents Claude from rationalizing its way out of following the structured process:

| What Claude Thinks | What Superpowers Says |
|---|---|
| "This is just a simple question" | Questions are tasks. Check for applicable skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. Period. |
| "I remember this skill" | Skills evolve. Read the current version. |
| "The skill is overkill for this" | Simple things become complex. Use it anyway. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |
| "This feels productive" | Undisciplined action wastes time. Skills prevent this. |

This table is loaded into Claude's context at every session start, making it extremely difficult for Claude to skip the structured process.

## Step 5: Systematic Debugging

When you encounter a bug, the **systematic-debugging** skill enforces a 4-phase process:

### The Iron Law

> "NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST."

### The 4 Phases

```
Phase 1: Root Cause Investigation
  │  - Reproduce the bug reliably
  │  - Read error messages completely
  │  - Trace the execution path
  │  - Identify the EXACT line/condition causing the failure
  │
Phase 2: Pattern Analysis
  │  - Is this a known pattern? (race condition, null reference, etc.)
  │  - Has this bug appeared before?
  │  - Are there related symptoms elsewhere?
  │
Phase 3: Hypothesis and Testing
  │  - Form a specific hypothesis
  │  - Change ONE variable at a time
  │  - Verify the hypothesis with a test
  │
Phase 4: Implementation
     - Write a test that reproduces the bug
     - Fix the root cause (not the symptom)
     - Verify the fix doesn't break anything else
```

### What This Prevents

```
Without Superpowers:
  "Getting TypeError? Let me add a null check."
  (Masks the real problem -- the data should never be null here)

With Superpowers:
  "TypeError at line 45. Let me trace where this value comes from...
   The API response is missing the 'user' field when the session 
   expires. The real fix is to handle expired sessions in the 
   auth middleware, not add null checks everywhere."
```

## Step 6: Instruction Priority

Superpowers establishes a clear hierarchy when instructions conflict:

```
Priority 1 (Highest): Your explicit instructions
  - CLAUDE.md, AGENTS.md, direct requests
  - "Don't use TDD for this file" → Superpowers obeys

Priority 2: Superpowers skills
  - Override default Claude behavior
  - Enforce TDD, planning, debugging process

Priority 3 (Lowest): Default system prompt
  - Claude's built-in behavior
  - Only applies when nothing above overrides it
```

**You are always in control.** If your CLAUDE.md says "skip TDD," Superpowers respects that.

## Step 7: Verification Before Completion

The **verification-before-completion** skill enforces one final Iron Law:

> "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE."

**What this means in practice:**

```
❌ WRONG:
  Claude: "I've implemented the feature. It should work because 
  the logic looks correct."

✅ RIGHT:
  Claude: "Implementation complete. Verification:
  
  $ npm test
  ✅ 47 tests passed, 0 failed
  
  $ npm run build  
  ✅ Build succeeded, 0 errors, 0 warnings
  
  $ npm run lint
  ✅ No lint issues
  
  Manual test: Created a project, added 3 tasks, dragged between 
  columns, refreshed page -- all data persisted correctly."
```

**Banned language:**
- "should work"
- "probably fine"
- "I believe this is correct"
- "based on the changes, it should..."

## Step 8: Creating Custom Skills

The **writing-skills** meta-skill lets you create your own skills using a TDD approach:

### Skill Structure

```markdown
---
description: "One-line description of what this skill does"
user-invocable: true
---

# Skill Name

## When to Use
Specific triggers and conditions.

## Process
Step-by-step instructions.

## Iron Laws
Non-negotiable rules.

## Anti-Patterns
What NOT to do.
```

### Example: Custom Deployment Skill

```markdown
---
description: "Structured deployment process with safety checks"
user-invocable: true
---

# Deployment Checklist

## When to Use
When deploying to staging or production environments.

## Process
1. Run full test suite -- ALL tests must pass
2. Check for uncommitted changes -- working tree must be clean
3. Verify environment variables are set
4. Run database migration dry-run
5. Deploy to staging first
6. Run smoke tests against staging
7. Get human approval for production
8. Deploy to production
9. Run smoke tests against production
10. Monitor error rates for 15 minutes

## Iron Laws
- NEVER deploy with failing tests
- NEVER skip staging
- NEVER deploy on Fridays after 3pm

## Anti-Patterns
- "It works on my machine" is not verification
- Skipping smoke tests because "nothing changed"
- Deploying multiple PRs simultaneously
```

## Superpowers in the Ecosystem

Superpowers is one of three major frameworks for structured AI development:

```
┌────────────────┬──────────────────┬──────────────────┐
│   Superpowers   │       GSD        │      gstack      │
├────────────────┼──────────────────┼──────────────────┤
│ Focus:         │ Focus:           │ Focus:           │
│ EXECUTION      │ STABILITY        │ THINKING         │
│                │                  │                  │
│ Target:        │ Target:          │ Target:          │
│ Solo devs      │ Complex projects │ Founder-         │
│ lacking        │ exceeding one    │ engineers who    │
│ discipline     │ context window   │ need product     │
│                │                  │ thinking + code  │
│                │                  │                  │
│ Strength:      │ Strength:        │ Strength:        │
│ TDD, debugging,│ Context mgmt,   │ Product specs,   │
│ structured     │ multi-session    │ design thinking, │
│ workflows      │ stability        │ roadmapping      │
└────────────────┴──────────────────┴──────────────────┘

Summary: "gstack thinks, GSD stabilizes, Superpowers executes."
```

## Best Practices

### Getting the Most from Superpowers

1. **Trust the process** -- Let brainstorming complete before pushing for code. The cost of planning is near zero; wrong code costs hours.

2. **Review plans carefully** -- It's much faster to fix a plan than to fix code. Keep revising until the plan is right.

3. **Don't skip verification** -- The verification skill exists because agents love to declare victory prematurely.

4. **Use `/rewind` and `/clear`** -- When Claude goes in the wrong direction, rewind to the last good state rather than trying to fix mid-conversation.

5. **Step-by-step execution** -- Don't say "implement everything." Ask for one task, review it, then proceed.

6. **Watch context window size** -- After ~400k tokens, agent quality drops. Start fresh sessions for long tasks.

7. **Update regularly** -- Active development with frequent releases. Use `/plugin update superpowers`.

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Rushing past brainstorming | Let Claude finish asking questions |
| "Just write the code" | Follow the plan-first workflow |
| Ignoring code review findings | Fix Critical and Important issues before proceeding |
| One massive implementation session | Break into focused sessions per feature |
| Not verifying at the end | Always run tests and build before claiming done |

## Troubleshooting

**"Skills aren't activating"**
```bash
# Restart Claude Code
/exit

# Verify plugin is installed
/plugin list

# Reinstall if needed
/plugin install superpowers@claude-plugins-official
```

**"Claude is skipping TDD"**
```
# Remind Claude explicitly
"Please follow the TDD skill. Write the test first."

# If it persists, the Red Flags table may not have loaded.
# Start a fresh session.
```

**"Subagents aren't being dispatched"**
```
# Subagent support requires Claude Code with subagent capability.
# If unavailable, Superpowers falls back to the 
# "executing-plans" skill (sequential, same-session execution).
```

**"Plans are too granular / not granular enough"**
```
# Provide guidance in your CLAUDE.md:
"When writing plans, target 5-10 tasks per feature.
Each task should take 5-10 minutes, not 2-3."
```

## Cross-Platform Support

Superpowers works across multiple AI coding agents:

| Platform | Installation |
|----------|-------------|
| **Claude Code** | `/plugin install superpowers@claude-plugins-official` |
| **Cursor** | `/add-plugin superpowers` |
| **Codex CLI** | `/plugins` then search "superpowers" |
| **Gemini CLI** | `gemini extensions install https://github.com/obra/superpowers` |
| **GitHub Copilot CLI** | Via marketplace |

## Additional Resources

- [Superpowers GitHub Repository](https://github.com/obra/superpowers)
- [Jesse Vincent's Blog -- Original Announcement](https://blog.fsck.com/2025/10/09/superpowers/)
- [Builder.io -- Structured Workflow That Actually Works](https://www.builder.io/blog/claude-code-superpowers-plugin)
- [Release Notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md)
- [AGENTS.md -- Contributor Guidelines](https://github.com/obra/superpowers/blob/main/AGENTS.md)
