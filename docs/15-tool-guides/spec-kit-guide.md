# GitHub Spec-Kit: Spec-Driven Development with Claude

## What is Spec-Kit?

Spec-Kit is GitHub's open-source toolkit for **Spec-Driven Development (SDD)** -- a methodology that puts specifications at the center of AI-assisted software development. Instead of jumping straight to code ("vibe coding"), you describe what to build, refine it through structured phases, and let Claude implement it precisely.

```
┌─────────────────────────────────────────────────────────┐
│              Without Spec-Kit ("Vibe Coding")           │
│                                                         │
│  Developer: "Add authentication"                        │
│  Claude: *guesses requirements, adds random features*   │
│  Developer: "No, that's not what I wanted..."           │
│  Claude: *rewrites with different assumptions*           │
│  (Repeat 5-10 times)                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              With Spec-Kit                              │
│                                                         │
│  Developer: /speckit.specify Add OAuth2 authentication  │
│  Claude: *creates structured spec with requirements*    │
│  Developer: *reviews and approves spec*                 │
│  Developer: /speckit.plan Use Passport.js               │
│  Claude: *creates detailed implementation plan*         │
│  Developer: /speckit.implement                          │
│  Claude: *implements exactly what was specified*         │
└─────────────────────────────────────────────────────────┘
```

### Why Spec-Kit Matters

Created by **Den Delimarsky and John Lam at GitHub**, spec-kit addresses the fundamental flaw in how most people use AI coding assistants:

> "We treat coding agents like search engines when we should be treating them more like literal-minded pair programmers."

**The core insight**: Separate the stable "what" from the flexible "how." Specifications become the source of truth; code becomes a generated expression of those specifications.

### When to Use vs. When to Skip

| Use Spec-Kit | Skip Spec-Kit |
|-------------|---------------|
| New greenfield projects | Small bug fixes |
| Adding multiple features | Quick UI tweaks |
| Complex features with clear boundaries | Changes in 1-2 files |
| Projects requiring structured decisions | Simple one-off tasks |
| Team onboarding (specs serve as docs) | Urgent hotfixes |

## Prerequisites

- **Python 3.11+**
- **Git**
- **uv** (recommended) or **pipx**
- **Claude Code** CLI installed and authenticated

## Step 1: Install Spec-Kit

=== "Using uv (Recommended)"

    ```bash
    # Persistent installation
    uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

    # Or one-shot execution without installing
    uvx --from git+https://github.com/github/spec-kit.git specify init my-project
    ```

=== "Using pipx"

    ```bash
    pipx install git+https://github.com/github/spec-kit.git
    ```

=== "Pinned Version"

    ```bash
    uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.8.7
    ```

Verify installation:

```bash
specify version
specify check    # Verifies prerequisites (Git, agent CLIs)
```

## Step 2: Initialize Your Project

### New Project (Greenfield)

```bash
# Create new project with Claude Code integration
specify init my-project --integration claude
cd my-project
```

### Existing Project (Brownfield)

```bash
cd my-existing-project

# Initialize in current directory
specify init --here

# Or force-initialize
specify init . --force
```

### What Gets Generated

```
my-project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md          # Project principles (governance)
│   ├── scripts/
│   │   └── bash/                    # Helper scripts
│   ├── specs/                       # Feature specifications
│   └── templates/
│       ├── plan-template.md
│       ├── spec-template.md
│       └── tasks-template.md
├── .claude/
│   └── skills/                      # Claude Code slash commands
│       ├── speckit.constitution/
│       │   └── SKILL.md
│       ├── speckit.specify/
│       │   └── SKILL.md
│       ├── speckit.clarify/
│       │   └── SKILL.md
│       ├── speckit.plan/
│       │   └── SKILL.md
│       ├── speckit.tasks/
│       │   └── SKILL.md
│       └── ...
└── [project files]
```

Each skill file has frontmatter that makes it available as a Claude Code slash command:

```yaml
---
user-invocable: true
disable-model-invocation: false
argument-hint: "Describe what you want to build"
---
```

## Step 3: Define Your Constitution

The **constitution** establishes non-negotiable rules for your project. Every subsequent command cross-references it for compliance.

```
/speckit.constitution Create principles focused on code quality, 
testing standards, and performance requirements
```

### Example Constitution

```markdown
# Project Constitution

## Tech Stack
- Frontend: Next.js 14+ (App Router)
- Styling: Tailwind CSS only
- Database: PostgreSQL with Prisma ORM
- Testing: Vitest with 80%+ coverage

## Code Standards
- TypeScript strict mode -- no `any` types
- Functional programming paradigm preferred
- All public APIs must have JSDoc documentation
- Maximum function length: 30 lines

## Security
- All user inputs must be validated with Zod
- No secrets in code -- use environment variables
- OWASP Top 10 compliance required

## Performance
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- API response time: < 200ms for reads, < 500ms for writes
```

!!! tip "Spend Time on the Constitution"
    The constitution is the most impactful artifact in the entire workflow. A well-crafted constitution prevents classes of mistakes before they happen. Treat it as a governance document the AI must obey.

## Step 4: Write Your Specification

```
/speckit.specify Build a team productivity platform with projects, 
tasks, and Kanban-style boards
```

This command:

1. Creates a **numbered Git branch** (e.g., `001-team-productivity-platform`)
2. Initializes `specs/001-team-productivity-platform/spec.md`
3. Generates requirements focusing on "what" and "why" -- NOT "how"

### What a Good Spec Includes

```markdown
# Team Productivity Platform

## Goals
- Enable teams to organize work into projects
- Provide Kanban-style task management
- Support real-time collaboration

## User Stories
- As a team lead, I want to create projects so I can organize work
- As a developer, I want to drag tasks between columns so I can
  update status quickly
- As a PM, I want to see progress metrics so I can report status

## Acceptance Criteria
- Users can create, edit, and delete projects
- Each project has configurable Kanban columns
- Tasks support assignees, due dates, labels, and descriptions
- Drag-and-drop moves tasks between columns
- Changes persist immediately (no save button)

## Constraints
- Must work offline (PWA)
- Must support 50+ concurrent users per board
- Must meet WCAG 2.1 AA accessibility standards

## Out of Scope
- Time tracking
- Invoicing
- External integrations (Phase 2)
```

## Step 5: Clarify Ambiguities

```
/speckit.clarify
```

This performs a **structured ambiguity scan** across 10 categories:

| Category | What It Checks |
|----------|---------------|
| Functional scope | Missing features, unclear boundaries |
| Domain model | Entity relationships, data lifecycle |
| UX flow | Navigation gaps, interaction patterns |
| Non-functional | Performance targets, scalability needs |
| Integration | API contracts, third-party dependencies |
| Edge cases | Error scenarios, boundary conditions |
| Constraints | Technical/business limitations |
| Terminology | Ambiguous terms, undefined concepts |
| Completion signals | Definition of done, success metrics |
| Placeholders | TODOs, TBDs, unresolved decisions |

Claude asks up to **5 targeted questions**, one at a time. For each question:

1. Claude presents the ambiguity
2. Proposes a recommended answer with reasoning
3. You accept, modify, or provide your own answer
4. The answer is written back into `spec.md` under `## Clarifications`

### Example Clarification

```
Claude: "The spec mentions 'configurable Kanban columns' but doesn't 
specify defaults. What should the default columns be when a new 
project is created?"

Recommended answer: "Default columns: Backlog, To Do, In Progress, 
Review, Done. Users can rename, add, remove, and reorder columns."

Your answer: [Accept / Modify / Custom]
```

## Step 6: Validate Requirements with a Checklist

```
/speckit.checklist
```

This generates **"unit tests for your requirements"** -- not code tests, but requirement quality tests:

- Are requirements **complete** (no missing scenarios)?
- Are they **clear** (no ambiguous language)?
- Are they **consistent** (no contradictions)?
- Are they **measurable** (testable acceptance criteria)?

!!! note "Test Your Spec, Not Your Code"
    The checklist validates the quality of your specification, not the implementation. Think of it as a code review for your requirements document.

## Step 7: Create the Technical Plan

```
/speckit.plan Use Vite with React and TypeScript. Use localStorage 
for persistence initially
```

This translates your spec into a technical implementation plan, generating multiple artifacts:

```
specs/001-team-productivity-platform/
├── spec.md           # Requirements (from Step 4-6)
├── plan.md           # Technical implementation plan
├── research.md       # Technology research and decisions
├── data-model.md     # Entity relationships and schemas
├── quickstart.md     # Getting started guide
└── contracts/
    ├── api-spec.json  # API contract definitions
    └── events.md      # Event/message contracts
```

### What the Plan Contains

```markdown
# Implementation Plan

## Architecture
- React 18 with Vite build system
- Zustand for state management
- localStorage for persistence (Phase 1)
- React Beautiful DnD for Kanban drag-and-drop

## Phase 1: Foundation (Tasks 1-8)
1. Project scaffolding and tooling setup
2. Data model and type definitions
3. localStorage adapter with CRUD operations
4. Project listing page
5. Kanban board component
6. Task card component
7. Drag-and-drop functionality
8. Column management (add/remove/reorder)

## Phase 2: Collaboration (Tasks 9-15)
...

## Constitution Compliance
✅ TypeScript strict mode
✅ Vitest test framework
✅ Tailwind CSS styling
✅ No `any` types in data model
```

## Step 8: Break Down into Tasks

```
/speckit.tasks
```

Converts the plan into a **dependency-ordered, actionable task list**:

```markdown
# Tasks

## Task 1: Project Scaffolding [P]
- Create Vite project with React + TypeScript template
- Configure Tailwind CSS
- Set up Vitest with Testing Library
- Create initial folder structure
- **Verify**: `npm run build` succeeds, `npm test` passes

## Task 2: Data Model and Types [P]
- Define Project, Column, Task interfaces
- Create Zod validation schemas
- Add factory functions for creating entities
- **Verify**: Type tests pass

## Task 3: localStorage Adapter
- Depends on: Task 2
- Implement CRUD operations for projects
- Add migration support for schema changes
- **Verify**: Adapter unit tests pass

## Task 4: Project Listing Page
- Depends on: Tasks 1, 3
- Create ProjectList component
- Add create/edit/delete project flows
- **Verify**: Component tests pass, manual review
```

Tasks marked with `[P]` are **independent** and safe for parallel execution.

## Step 9: Analyze Cross-Artifact Consistency

```
/speckit.analyze
```

This is a **non-destructive** cross-artifact analysis that validates alignment between:

- `spec.md` (requirements)
- Clarifications
- `plan.md` (technical plan)
- `tasks.md` (task breakdown)
- `constitution.md` (project principles)

Findings are categorized by severity:

| Severity | Meaning |
|----------|---------|
| **CRITICAL** | Constitution violation -- must fix |
| **HIGH** | Spec-plan misalignment -- should fix |
| **MEDIUM** | Missing coverage -- review needed |
| **LOW** | Style/consistency suggestions |

### Example Analysis Output

```
CRITICAL: Plan uses Material UI but constitution specifies 
"Tailwind CSS only"

HIGH: Spec requires "offline support (PWA)" but plan doesn't 
include a service worker task

MEDIUM: Task 7 (drag-and-drop) has no accessibility test coverage, 
but constitution requires WCAG 2.1 AA

LOW: Task naming inconsistency -- some use imperative, 
others use gerunds
```

## Step 10: Implement

```
/speckit.implement
```

Claude implements tasks based on the specification and plan. At this point:

- Requirements are clear and validated
- Technical decisions are documented
- Tasks are ordered by dependency
- Constitution compliance is verified

The implementation is **focused and specific** because every decision was already made in the planning phases.

## The Complete Workflow Pipeline

```
┌──────────────────────────────────────────────────────────────┐
│                    Spec-Kit Pipeline                         │
│                                                              │
│  /speckit.constitution ─── Define project principles         │
│         │                                                    │
│  /speckit.specify ──────── Write requirements (what + why)   │
│         │                                                    │
│  /speckit.clarify ──────── Resolve ambiguities (5 questions) │
│         │                                                    │
│  /speckit.checklist ────── Validate requirement quality      │
│         │                                                    │
│  /speckit.plan ─────────── Create technical plan (how)       │
│         │                                                    │
│  /speckit.tasks ────────── Break into ordered tasks          │
│         │                                                    │
│  /speckit.analyze ──────── Cross-artifact consistency check  │
│         │                                                    │
│  /speckit.implement ────── Execute implementation            │
│         │                                                    │
│  /speckit.issues ───────── Create GitHub Issues (optional)   │
└──────────────────────────────────────────────────────────────┘

Commands follow a strict left-to-right dependency order.
You cannot plan before you specify.
```

## Extensions and Presets

Spec-Kit has a rich ecosystem of extensions and presets.

### Extensions (Add New Capabilities)

```bash
# Search available extensions
specify extension search

# Install an extension (e.g., Jira integration)
specify extension add jira-integration

# List installed extensions
specify extension list
```

91 community extensions are available, including:

- **Jira integration** -- Sync specs with Jira tickets
- **Code review phase** -- Add post-implementation review
- **V-Model testing** -- Formal verification workflows
- **Health diagnostics** -- Project health monitoring

### Presets (Customize Existing Behavior)

```bash
# Search available presets
specify preset search

# Install a preset
specify preset add compliance-oriented

# View template resolution order
specify preset resolve
```

18 presets are available for compliance, domain-specific terminology, and organizational standards.

### Template Resolution Priority

When multiple sources provide templates, this priority applies (highest first):

1. **Project-local overrides** (your files)
2. **Presets** (by priority number)
3. **Extensions**
4. **Core defaults**

## CLI Reference

Beyond slash commands, the `specify` CLI provides project management:

```bash
# Project setup
specify init <name>                    # Initialize new project
specify init --here                    # Initialize in current directory
specify check                          # Verify prerequisites

# Integration management
specify integration list               # List available AI integrations
specify integration install            # Install new integration
specify integration switch             # Switch between integrations
specify integration upgrade            # Upgrade integration files

# Extension management
specify extension search               # Search extensions
specify extension add <name>           # Install extension
specify extension list                 # List installed
specify extension remove <id>          # Remove extension

# Preset management
specify preset search                  # Search presets
specify preset add <name>              # Install preset
specify preset list                    # List installed

# Workflow management
specify workflow run                   # Run a workflow
specify workflow resume                # Resume interrupted workflow
specify workflow status                # Check workflow status
```

## Real-World Example: Building a To-Do App

Here's a complete walkthrough of building a React To-Do app with spec-kit:

### 1. Initialize

```bash
specify init todo-app --integration claude
cd todo-app
```

### 2. Set the Constitution

```
/speckit.constitution Create principles: Vite + React + TypeScript, 
Vitest for testing, Tailwind for styling, localStorage for data, 
no external state management libraries
```

### 3. Specify

```
/speckit.specify Build a simple To-Do List React application. Users 
can add, complete, and delete tasks. Tasks persist across page reloads.
```

### 4. Plan

```
/speckit.plan Create a simple implementation plan using Vite + React + 
TypeScript. Use localStorage for persistence.
```

### 5. Generate Tasks and Implement

```
/speckit.tasks
/speckit.implement
```

### Results

One user reported these results from this exact workflow:

- **29 automated tasks** generated and executed
- **36 test cases** written
- **93%+ test coverage**
- **Zero ESLint warnings**
- **Zero TypeScript errors**

## Best Practices

### During Specification

- Be **extremely detailed** -- ambiguity costs more to fix later than to specify now
- Focus on **"what" and "why"**, not "how" -- save technical decisions for the plan phase
- Use `/speckit.clarify` before planning -- it catches gaps you didn't know existed
- Don't treat the first draft as final -- iterate and refine

### During Planning

- **Review data models carefully** before proceeding -- schema changes cascade
- Run `/speckit.analyze` to catch constitution violations early
- Specify tech stack constraints explicitly in the plan command

### During Implementation

- Review focused, specific code changes -- not thousand-line dumps
- Use the interaction to ask clarifying questions
- For Claude Code: consider enabling bypass permissions after establishing a solid foundation

### Constitution Design

- **Spend more time here than anywhere else** -- it's the highest-leverage artifact
- Include: tech stack, code quality standards, testing strategy, security requirements
- Treat it as a living document -- update as the project evolves

## Troubleshooting

**"Slash commands not showing up in Claude Code"**
```bash
# Verify the .claude/skills/ directory was created
ls -la .claude/skills/

# Reinitialize the integration
specify integration upgrade
```

**"Constitution not being enforced"**
```bash
# Run analysis to check compliance
/speckit.analyze

# Re-read the constitution in the current session
/speckit.constitution
```

**"Brownfield project: existing code not understood"**
```
# Currently a known limitation -- spec-kit doesn't auto-scan
# existing code. Document existing architecture manually in
# the constitution or create a research.md file.
```

## Additional Resources

- [Spec-Kit GitHub Repository](https://github.com/github/spec-kit)
- [Den Delimarsky's Blog -- SDD Methodology](https://den.dev)
- [Community Extensions Catalog](https://github.com/github/spec-kit/tree/main/extensions)
- [Community Presets Catalog](https://github.com/github/spec-kit/tree/main/presets)
- [spec-kit-claude (Claude-optimized fork)](https://github.com/wiltonn/spec-kit-claude)
