# Tool Guides

## Overview

This section provides comprehensive, step-by-step guides for integrating powerful development tools with Claude Code. Each guide covers installation, configuration, workflows, and real-world examples to help you master these tools in your AI-assisted development practice.

## Available Guides

### OpenSpec - Spec-Driven Development

OpenSpec brings structured specification-driven development to Claude Code. Instead of letting AI guess what to build, you define clear specifications first, then let Claude implement them precisely. This eliminates hallucination-code, scope creep, and inconsistent implementations.

**Best for**: Medium-to-large features, architecture changes, cross-team collaboration, and any work where requirements clarity matters.

[Read the OpenSpec Guide](openspec-guide.md)

### HumanLayer - Human-in-the-Loop Development

HumanLayer adds deterministic human oversight to AI agent workflows. It ensures that high-stakes operations (deployments, emails, data modifications) always require human approval before execution, preventing costly mistakes from AI autonomy.

**Best for**: Production workflows, multi-agent orchestration, approval gates, and teams that need auditable AI-assisted processes.

[Read the HumanLayer Guide](humanlayer-guide.md)

### Spec-Kit - GitHub's SDD Toolkit

GitHub's official Spec-Driven Development toolkit with a complete pipeline: constitution, specify, clarify, checklist, plan, tasks, analyze, and implement. Provides slash commands in Claude Code for a structured requirements-to-code workflow with cross-artifact consistency checking.

**Best for**: Greenfield projects, complex multi-feature development, team standardization, and projects requiring formal requirement validation.

[Read the Spec-Kit Guide](spec-kit-guide.md)

### Superpowers - Disciplined AI Development

An agentic skills framework that transforms Claude Code into a disciplined development partner. Ships 14 markdown skills enforcing TDD, systematic debugging, structured planning, and code review -- with built-in anti-rationalization to prevent Claude from skipping steps.

**Best for**: Solo developers wanting engineering discipline, TDD-driven development, systematic debugging, and subagent-driven parallel execution.

[Read the Superpowers Guide](superpowers-guide.md)

## How These Tools Compare

```
┌────────────────────────────────────────────────────────────────────┐
│                     Tool Comparison Matrix                        │
├──────────────┬──────────┬────────────┬──────────┬────────────────┤
│              │ OpenSpec │ HumanLayer │ Spec-Kit │  Superpowers   │
├──────────────┼──────────┼────────────┼──────────┼────────────────┤
│ Focus        │ Specs    │ Approvals  │ Pipeline │  Discipline    │
│ Phase        │ Define   │ Deploy     │ End-to-  │  Execute       │
│              │          │            │ end      │                │
│ Integration  │ MCP      │ MCP + SDK  │ Skills   │  Plugin        │
│ Style        │ Server   │            │ (CLI)    │  (Markdown)    │
│ TDD          │ -        │ -          │ -        │  Built-in      │
│ Approvals    │ -        │ Core       │ -        │  -             │
│ Debugging    │ -        │ -          │ -        │  Built-in      │
│ Best With    │ Any size │ Teams      │ New      │  Solo devs     │
│              │ project  │            │ projects │                │
└──────────────┴──────────┴────────────┴──────────┴────────────────┘
```

## How These Tools Complement Each Other

```
┌─────────────────────────────────────────────────────────────────┐
│                    Development Lifecycle                         │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Spec-Kit │─>│Superpowers│─>│  Claude  │─>│HumanLayer│       │
│  │ or       │  │ (TDD +   │  │   Code   │  │ (Approve │       │
│  │ OpenSpec │  │  Debug)  │  │  Build   │  │ & Deploy)│       │
│  │ (Define) │  │          │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│  What to build  How to build  Code output   Safe to ship        │
└─────────────────────────────────────────────────────────────────┘
```

- **OpenSpec / Spec-Kit** govern the *input* side: ensuring Claude knows exactly what to build before writing code
- **Superpowers** governs the *process* side: enforcing TDD, debugging discipline, and structured planning
- **HumanLayer** governs the *output* side: ensuring humans approve high-stakes actions before they execute
- Together, they create a complete guardrail system for AI-assisted development

## Prerequisites

- Claude Code CLI installed and configured
- Node.js 20+ (for OpenSpec)
- Python 3.10+ or Node.js (for HumanLayer SDK)
- Python 3.11+ (for Spec-Kit)
- A Git-managed project repository
