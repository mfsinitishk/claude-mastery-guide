# OpenSpec: Spec-Driven Development with Claude Code

## What is OpenSpec?

OpenSpec is an open-source, lightweight Spec-Driven Development (SDD) framework that adds a structured specification layer on top of AI coding assistants like Claude Code. Instead of letting AI guess what to build, you and your AI **agree on what to build before any code is written**.

```
┌────────────────────────────────────────────────────────┐
│                Without OpenSpec                        │
│                                                        │
│  Developer: "Add authentication"                       │
│  Claude: *guesses requirements, adds random features*  │
│  Developer: "No, that's not what I wanted..."          │
│  Claude: *rewrites with different assumptions*         │
│  (Repeat 5-10 times)                                   │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│                With OpenSpec                           │
│                                                        │
│  Developer: /opsx:propose add-auth                     │
│  Claude: *creates spec with requirements + scenarios*  │
│  Developer: *reviews and approves spec*                │
│  Claude: /opsx:apply add-auth                          │
│  Claude: *implements exactly what was specified*       │
│  Developer: "Perfect."                                 │
└────────────────────────────────────────────────────────┘
```

### Why OpenSpec Matters

Without structured specs, AI coding assistants suffer from:

- **Hallucination-code**: Implementing features that were never requested
- **Scope creep**: Adding unrequested functionality
- **Context loss**: Forgetting project decisions between conversations
- **Inconsistency**: Producing different implementations across sessions
- **Re-explanation fatigue**: Requiring the developer to repeat project context

OpenSpec solves these by providing **persistent, filesystem-based context** that survives between AI sessions.

### Core Philosophy

OpenSpec follows four guiding principles:

| Principle | Meaning |
|-----------|---------|
| **Fluid not rigid** | No phase gates -- work on what makes sense |
| **Iterative not waterfall** | Learn as you build, refine as you go |
| **Easy not complex** | Lightweight setup, minimal ceremony |
| **Brownfield-first** | Works with existing codebases, not just greenfield |

## Prerequisites

- **Node.js** 20.19.0 or higher
- **Claude Code** CLI installed and authenticated
- A **Git-managed** project repository
- No API keys or MCP servers required -- OpenSpec is purely file-based

## Step 1: Installation

### Install OpenSpec CLI

```bash
# Install globally (recommended)
npm install -g @fission-ai/openspec@latest

# Verify installation
openspec --version
```

!!! tip "Alternative Package Managers"
    OpenSpec supports npm, pnpm, yarn, bun, and nix. Use whichever your project prefers.

## Step 2: Initialize in Your Project

```bash
# Navigate to your project
cd your-project

# Initialize with Claude Code integration
openspec init --tools claude
```

!!! info "Multi-Tool Support"
    If you use multiple AI tools, you can initialize for all of them:
    ```bash
    openspec init --tools claude,cursor    # Claude + Cursor
    openspec init --tools all              # All 28+ supported tools
    ```

### What Gets Generated

After initialization, your project gains the following structure:

```
your-project/
├── openspec/
│   ├── specs/              # Source of truth for system behavior
│   │   └── <domain>/
│   │       └── spec.md
│   ├── changes/            # Active proposed changes
│   │   └── <change-name>/
│   │       ├── proposal.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── specs/      # Delta specifications
│   │           └── <domain>/
│   │               └── spec.md
│   └── config.yaml         # Project configuration
├── .claude/
│   ├── skills/openspec-*/SKILL.md    # Claude Code skills
│   └── commands/opsx/<id>.md         # Slash commands
```

### Key Directories Explained

| Directory | Purpose |
|-----------|---------|
| `openspec/specs/` | The **source of truth** -- what the system currently does |
| `openspec/changes/` | **Active proposals** -- what you're planning to change |
| `openspec/changes/archive/` | **Completed changes** -- historical record |
| `.claude/skills/` | **Claude Code skills** -- enables slash commands |
| `.claude/commands/opsx/` | **Slash commands** -- the `/opsx:*` commands |

## Step 3: Configure Your Project

Edit `openspec/config.yaml` to describe your project:

```yaml
# openspec/config.yaml
schema: spec-driven          # Workflow schema (default is fine)
context: |
  Tech stack: TypeScript, React 18, Node.js, PostgreSQL
  API conventions: RESTful with JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript
  Architecture: Monorepo with shared packages
rules:
  proposal:
    - Include rollback plan for breaking changes
    - Identify affected teams and services
  specs:
    - Use Given/When/Then format for all scenarios
    - Reference existing patterns from the codebase
  design:
    - Include sequence diagrams for complex flows
    - Document API contracts explicitly
```

!!! warning "Be Specific"
    The more specific your `context` field, the better Claude's output. Instead of "web app", write "Next.js 14 app with App Router, Prisma ORM, and Tailwind CSS". This context is injected into every Claude interaction.

## Step 4: Understanding the Spec Format

Specs use **RFC 2119 keywords** (MUST, SHALL, SHOULD, MAY) with **Given/When/Then scenarios**:

### Example: Authentication Spec

```markdown
# auth-session Specification

## Purpose
Manage user session lifecycle for the application.

## Requirements

### Requirement: Session creation
The system MUST create a session token upon successful authentication.

#### Scenario: Successful login
- GIVEN a user submits valid credentials
- WHEN the authentication service validates them
- THEN a JWT access token (15min TTL) is returned
- AND a refresh token (7d TTL) is stored in an httpOnly cookie

#### Scenario: Invalid credentials
- GIVEN a user submits invalid credentials
- WHEN the authentication service rejects them
- THEN a 401 response with error message is returned
- AND no session token is created

### Requirement: Session expiration
The system SHALL expire sessions after a configured duration.

#### Scenario: Default session timeout
- GIVEN a user has authenticated
- WHEN 24 hours pass without activity
- THEN invalidate the session token
- AND redirect to login on next request

### Requirement: Session renewal
The system SHOULD allow session renewal via refresh token.

#### Scenario: Valid refresh token
- GIVEN a user has a valid refresh token
- WHEN the access token expires
- THEN issue a new access token without re-authentication
```

### RFC 2119 Requirement Levels

| Keyword | Meaning | When to Use |
|---------|---------|-------------|
| **MUST / SHALL** | Absolute requirement | Core functionality that cannot be skipped |
| **SHOULD** | Recommended, but exceptions exist | Best practices with valid edge cases |
| **MAY** | Truly optional | Nice-to-have features |

### What Belongs in Specs vs. What Doesn't

| In Specs | NOT in Specs |
|----------|-------------|
| Observable behavior | Internal class/function names |
| Inputs, outputs, error conditions | Library choices (React vs Vue) |
| External constraints (security, privacy) | Step-by-step implementation details |
| Testable scenarios | Code architecture decisions |
| Business rules | Performance implementation details |

!!! tip "Rule of Thumb"
    If you can write a test for it, it belongs in a spec. If it's about *how* to implement (not *what* to implement), it goes in `design.md`.

## Step 5: Your First Change -- The Core Workflow

The OpenSpec lifecycle follows this flow:

```
proposal ──> specs ──> design ──> tasks ──> implement
   why         what      how       steps      code
```

### Quick Path (Recommended for Most Changes)

#### 5.1: Propose a Change

```
/opsx:propose add-dark-mode
```

Claude will create `openspec/changes/add-dark-mode/` with:

**`proposal.md`** -- Captures the *why*:
```markdown
# Proposal: Add Dark Mode

## Problem Statement
Users have requested a dark mode to reduce eye strain during
nighttime usage. Currently, the app only supports a light theme.

## Scope
### In Scope
- Theme toggle in settings
- Dark color palette
- Persistent preference (localStorage)
- System preference detection

### Out of Scope
- Custom theme builder
- Per-component theme overrides
- Theme API for third-party plugins

## Approach
Implement CSS custom properties with a theme provider component.
```

**`specs/ui-theme/spec.md`** -- Delta specs capturing the *what*:
```markdown
## ADDED Requirements

### Requirement: Dark mode toggle
The system MUST provide a toggle to switch between light and dark modes.

#### Scenario: User enables dark mode
- GIVEN the user is on the settings page
- WHEN they click the dark mode toggle
- THEN the UI switches to dark color scheme
- AND the preference is persisted to localStorage

### Requirement: System preference detection
The system SHOULD detect the OS color scheme preference on first visit.

#### Scenario: OS prefers dark mode
- GIVEN a new user visits the app for the first time
- WHEN their OS is set to dark mode
- THEN the app defaults to dark mode

## REMOVED Requirements

### Requirement: Fixed light theme
(Previously the app had a hardcoded light theme)
```

**`design.md`** -- Technical approach (*how*):
```markdown
# Design: Add Dark Mode

## Architecture
Use CSS custom properties with a React context provider.

## Data Flow
1. ThemeProvider reads preference from localStorage
2. Falls back to `prefers-color-scheme` media query
3. Applies CSS class to document root
4. Components use CSS variables for colors

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/themes.css` (new)
- `src/styles/global.css` (modified)
- `src/pages/Settings.tsx` (modified)
```

**`tasks.md`** -- Implementation checklist:
```markdown
# Tasks: Add Dark Mode

- [ ] Create CSS custom properties for light/dark themes
- [ ] Build ThemeProvider context component
- [ ] Implement ThemeToggle component
- [ ] Add system preference detection
- [ ] Update global styles to use CSS variables
- [ ] Add toggle to Settings page
- [ ] Write unit tests for ThemeProvider
- [ ] Write e2e test for theme switching
- [ ] Update component documentation
```

#### 5.2: Review the Proposal

Read through the generated artifacts. This is your chance to refine requirements before any code is written:

```
Please review the proposal at openspec/changes/add-dark-mode/.
I want to also add support for a "high contrast" mode in addition
to light and dark. Update the specs accordingly.
```

Claude will update the specs to include the new requirement.

#### 5.3: Implement the Change

```
/opsx:apply add-dark-mode
```

Claude reads the specs, design, and tasks, then implements each task. It checks off tasks as they're completed, following the technical approach described in `design.md`.

#### 5.4: Verify the Implementation

```
/opsx:verify add-dark-mode
```

This validates across three dimensions:

1. **Completeness**: All tasks checked off
2. **Correctness**: Each requirement from the spec is properly implemented
3. **Coherence**: Design decisions are reflected in code, naming is consistent

#### 5.5: Sync Specs to Source of Truth

```
/opsx:sync add-dark-mode
```

This merges the delta specs into the main `openspec/specs/` directory:
- **ADDED** requirements are appended to main specs
- **MODIFIED** requirements replace existing versions
- **REMOVED** requirements are deleted from main specs

#### 5.6: Archive the Change

```
/opsx:archive add-dark-mode
```

Moves the completed change to `openspec/changes/archive/` for historical reference.

### Complete Quick Path Summary

```bash
# 1. Propose (creates all planning artifacts)
/opsx:propose add-dark-mode

# 2. Review and refine (human reviews, asks for changes)
# ... iterate until satisfied ...

# 3. Implement (Claude writes code following the spec)
/opsx:apply add-dark-mode

# 4. Verify (validate against spec)
/opsx:verify add-dark-mode

# 5. Sync specs (merge deltas into source of truth)
/opsx:sync add-dark-mode

# 6. Archive (move to archive)
/opsx:archive add-dark-mode
```

## Step 6: Advanced Workflows

### Expanded Path (For Complex Changes)

For larger or more complex changes, use the expanded workflow:

```bash
# 1. Scaffold the change (just the folder + metadata)
/opsx:new add-payment-system

# 2. Create artifacts step by step
/opsx:continue add-payment-system   # Creates proposal
/opsx:continue add-payment-system   # Creates specs
/opsx:continue add-payment-system   # Creates design
/opsx:continue add-payment-system   # Creates tasks

# Or fast-forward all artifacts at once
/opsx:ff add-payment-system

# 3. Implement
/opsx:apply add-payment-system

# 4. Verify and archive
/opsx:verify add-payment-system
/opsx:archive add-payment-system
```

### Exploratory Path (For Unclear Requirements)

When you're not sure what to build yet:

```bash
# 1. Explore the idea first (no artifacts created)
/opsx:explore "Should we use WebSockets or SSE for real-time updates?"

# Claude investigates the codebase, considers trade-offs,
# and provides a recommendation without committing to artifacts

# 2. Once clear, create the change
/opsx:new add-real-time-updates

# 3. Continue from exploration insights
/opsx:continue add-real-time-updates
```

### Bulk Operations

```bash
# Archive all completed changes at once
/opsx:bulk-archive
```

## Step 7: CLI Reference

### Browsing and Inspection

```bash
# List all specs and changes
openspec list

# List only specs
openspec list --specs

# List only active changes
openspec list --changes

# Show a specific spec or change
openspec show auth-session --type spec

# Interactive dashboard
openspec view
```

### Validation

```bash
# Validate all specs and changes
openspec validate --all

# Strict validation (fails on warnings)
openspec validate --strict

# Validate specific changes
openspec validate --changes

# JSON output for CI integration
openspec validate --all --json
```

### Schema Management

```bash
# See which schema is active
openspec schema which

# Create a custom schema
openspec schema init

# Fork an existing schema to customize
openspec schema fork

# Validate schema integrity
openspec schema validate
```

### Configuration

```bash
# View config file path
openspec config path

# List all config values
openspec config list

# Get specific value
openspec config get context

# Set specific value
openspec config set schema research-first
```

## Step 8: Custom Schemas

For teams with specialized workflows, create custom schemas:

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
version: 1
description: Research-first workflow for data-heavy features

artifacts:
  - id: research
    generates: research.md
    description: Background research and data analysis
    template: research.md
    instruction: "Research the topic thoroughly before proposing"
    requires: []

  - id: proposal
    generates: proposal.md
    description: Change proposal informed by research
    requires: [research]

  - id: specs
    generates: specs/
    description: Behavioral specifications
    requires: [proposal]

  - id: design
    generates: design.md
    description: Technical design document
    requires: [specs]

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    requires: [design]
```

**Schema resolution order**:

1. CLI flag (`--schema research-first`)
2. Change metadata (`.openspec.yaml` in the change folder)
3. Project config (`config.yaml`)
4. Default schema

## Step 9: Real-World Examples

### Example 1: Adding a REST API Endpoint

```bash
/opsx:propose add-user-preferences-api
```

**Generated spec** (`specs/api-user-preferences/spec.md`):
```markdown
# api-user-preferences Specification

## Purpose
Provide CRUD operations for user preference management.

## Requirements

### Requirement: Get preferences
The system MUST return user preferences via GET /api/v1/users/:id/preferences.

#### Scenario: Authenticated user requests own preferences
- GIVEN an authenticated user with ID "user-123"
- WHEN they send GET /api/v1/users/user-123/preferences
- THEN return 200 with JSON body containing all preferences
- AND include default values for unset preferences

#### Scenario: User requests another user's preferences
- GIVEN an authenticated user with ID "user-123"
- WHEN they send GET /api/v1/users/user-456/preferences
- THEN return 403 Forbidden

### Requirement: Update preferences
The system MUST allow partial updates via PATCH /api/v1/users/:id/preferences.

#### Scenario: Valid preference update
- GIVEN an authenticated user with ID "user-123"
- WHEN they send PATCH with {"theme": "dark", "language": "fr"}
- THEN return 200 with updated preferences
- AND persist changes to the database
- AND publish a PreferencesUpdated event

#### Scenario: Invalid preference key
- GIVEN an authenticated user
- WHEN they send PATCH with {"invalidKey": "value"}
- THEN return 422 with error details listing invalid keys
```

### Example 2: Database Migration

```bash
/opsx:propose migrate-users-to-uuid
```

**Generated proposal** includes rollback plan:
```markdown
# Proposal: Migrate Users to UUID

## Problem Statement
The users table uses auto-increment integer IDs, which leak
information about user count and creation order.

## Rollback Plan
1. Keep integer `id` column as `legacy_id` during migration
2. Add UUID `id` column alongside
3. Update all foreign keys to reference UUID
4. Only drop `legacy_id` after 30-day verification period
5. Database backup taken before migration starts
```

### Example 3: Refactoring a Module

```bash
/opsx:propose refactor-notification-service
```

**Delta spec** shows what changes:
```markdown
## MODIFIED Requirements

### Requirement: Send notification (modified)
The system MUST support multiple notification channels
(previously only email was supported).

#### Scenario: Send via preferred channel
- GIVEN a user has set their preferred channel to "slack"
- WHEN a notification is triggered
- THEN deliver via Slack API
- AND log the delivery attempt

## ADDED Requirements

### Requirement: Channel fallback
The system SHOULD fall back to email if the preferred
channel delivery fails.

#### Scenario: Slack delivery fails
- GIVEN a notification was sent via Slack
- WHEN the Slack API returns an error
- THEN retry via email
- AND log the fallback event
```

## Step 10: Best Practices

### Naming Conventions

Use verb prefixes for change names:
```
add-dark-mode          # New feature
update-auth-flow       # Enhancement to existing feature
remove-legacy-api      # Removing functionality
fix-session-expiry     # Bug fix
refactor-data-layer    # Internal restructuring
migrate-to-postgres    # Technology migration
```

### Keep Changes Focused

Each change should represent **one logical unit of work**. If you find yourself writing specs for unrelated requirements, split into multiple changes.

!!! warning "Anti-Pattern: Kitchen Sink Changes"
    ```
    # Bad: Too many concerns
    /opsx:propose update-everything

    # Good: Focused changes
    /opsx:propose add-dark-mode
    /opsx:propose update-auth-flow
    /opsx:propose add-notification-preferences
    ```

### Always Read Specs Before Working

When starting a new Claude session, always tell Claude to read existing specs:

```
Please read openspec/specs/ to understand the current system
specifications before we start working.
```

### Use Explore for Uncertainty

If you're not sure about requirements, explore first:

```
/opsx:explore "What's the best approach for real-time sync --
WebSockets, SSE, or polling? Consider our existing infrastructure."
```

### Validate Before Archiving

```bash
# Always validate in strict mode before archiving
openspec validate --strict --changes
```

### Context Window Management

Large spec directories can consume significant context. Tips:

- Keep individual spec files focused on one domain
- Use `openspec show <spec> --deltas-only` to see only changes
- Archive completed changes promptly to reduce active change count

## When to Use OpenSpec vs. Direct Editing

| Use OpenSpec | Direct Edit is Fine |
|-------------|-------------------|
| New major features | Bug fixes |
| Breaking changes | Small enhancements |
| Architecture shifts | Config changes |
| Cross-team collaboration | Non-breaking updates |
| Complex multi-phase changes | Documentation updates |
| Features requiring stakeholder sign-off | Dependency updates |

## Onboarding Tutorial

For an interactive guided walkthrough:

```
/opsx:onboard
```

This will walk you through creating your first change step by step.

## Troubleshooting

### Common Issues

**"Command not found: openspec"**
```bash
# Ensure global install
npm install -g @fission-ai/openspec@latest
# Or use npx
npx @fission-ai/openspec init --tools claude
```

**"Slash commands not available in Claude Code"**
```bash
# Re-initialize to regenerate skill files
openspec init --tools claude --force
```

**"Validation fails on well-formed specs"**
```bash
# Check schema integrity
openspec schema validate
# View active schema
openspec schema which
```

### Telemetry

OpenSpec collects anonymous usage statistics (command names and version only -- no arguments, file paths, or content). To opt out:

```bash
export OPENSPEC_TELEMETRY=0
# or
export DO_NOT_TRACK=1
```

## Additional Resources

- [OpenSpec Website](https://openspec.dev)
- [OpenSpec GitHub Repository](https://github.com/Fission-AI/OpenSpec)
- [OpenSpec Documentation](https://github.com/Fission-AI/OpenSpec/tree/main/docs)
- [Community Skills for Claude Code](https://github.com/chyiiiiiiiiiiii/openspec-skills)
- [Spec-Driven Development Blog Post](https://medium.com/@rajanonly98/spec-driven-development-with-openspec-and-claude-code-c289c4882541)
