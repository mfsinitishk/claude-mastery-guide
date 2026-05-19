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

## How These Tools Complement Each Other

```
┌─────────────────────────────────────────────────────────────┐
│                    Development Lifecycle                     │
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ OpenSpec  │───>│  Claude  │───>│HumanLayer│              │
│  │  Define   │    │   Code   │    │ Approve  │              │
│  │  specs    │    │  Build   │    │ & Deploy │              │
│  └──────────┘    └──────────┘    └──────────┘              │
│                                                             │
│  What to build    How to build   Safe to ship               │
└─────────────────────────────────────────────────────────────┘
```

- **OpenSpec** governs the *input* side: ensuring Claude knows exactly what to build before writing code
- **HumanLayer** governs the *output* side: ensuring humans approve high-stakes actions before they execute
- Together, they create a complete guardrail system for AI-assisted development

## Prerequisites

- Claude Code CLI installed and configured
- Node.js 20+ (for OpenSpec)
- Python 3.10+ or Node.js (for HumanLayer SDK)
- A Git-managed project repository
