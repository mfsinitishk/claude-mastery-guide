# Command Reference Guide

*Complete CLI command reference for Claude Code and related tools*

---

## Table of Contents

1. [Claude Code CLI](#claude-code-cli)
2. [Configuration Commands](#configuration-commands)
3. [Project Management](#project-management)
4. [Conversation Management](#conversation-management)
5. [File Operations](#file-operations)
6. [API Commands](#api-commands)
7. [Developer Tools](#developer-tools)
8. [System Commands](#system-commands)
9. [Troubleshooting](#troubleshooting)

---

## Claude Code CLI

### Basic Usage

```bash
claude [command] [options]
```

### Global Options

| Option | Alias | Description | Example |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show help information | `claude --help` |
| `--version` | `-v` | Show version number | `claude --version` |
| `--verbose` | `-V` | Enable verbose output | `claude --verbose chat` |
| `--quiet` | `-q` | Suppress non-essential output | `claude --quiet process` |
| `--debug` | `-d` | Enable debug mode | `claude --debug` |
| `--config` | `-c` | Specify config file | `claude -c custom.json` |

### Interactive Mode

```bash
# Start interactive session
claude

# Start with specific model
claude --model opus

# Start with custom system prompt
claude --system "You are a senior developer"

# Start with file context
claude --file README.md --file src/app.py
```

---

## Configuration Commands

### Setup and Initialization

```bash
# Initialize Claude in current directory
claude init

# Initialize with specific configuration
claude init --model sonnet --features all

# Reconfigure existing setup
claude config reset

# Show current configuration
claude config show
```

### Configuration Management

| Command | Description | Example |
|---------|-------------|---------|
| `claude config get [key]` | Get configuration value | `claude config get model` |
| `claude config set [key] [value]` | Set configuration value | `claude config set model opus` |
| `claude config list` | List all configuration | `claude config list` |
| `claude config reset` | Reset to defaults | `claude config reset` |
| `claude config path` | Show config file path | `claude config path` |

### Configuration File

Default location: `~/.claude/config.json`

```json
{
  "model": "sonnet",
  "temperature": 1.0,
  "maxTokens": 4096,
  "streaming": true,
  "caching": true,
  "defaultProject": null,
  "editor": "vim",
  "theme": "auto"
}
```

### Model Configuration

```bash
# Set default model
claude config set model opus|sonnet|haiku

# Set model for current session
claude --model opus

# View available models
claude models list

# Show model details
claude models info sonnet
```

---

## Project Management

### Project Commands

```bash
# Create new project
claude project create [name]

# Options:
#   --description "Project description"
#   --template basic|web|api|data
#   --path /custom/path

# List projects
claude project list

# Switch to project
claude project use [name]

# Show current project
claude project current

# Delete project
claude project delete [name]

# Rename project
claude project rename [old-name] [new-name]

# Archive project
claude project archive [name]
```

### Project Structure

```bash
# Initialize project structure
claude project init

# Add files to project
claude project add [files...]

# Remove files from project
claude project remove [files...]

# List project files
claude project files

# Show project info
claude project info
```

### Project Templates

| Template | Description | Use Case |
|----------|-------------|----------|
| `basic` | Basic project setup | General purpose |
| `web` | Web development | Frontend/Backend |
| `api` | API development | REST/GraphQL APIs |
| `data` | Data analysis | Data science, ML |
| `mobile` | Mobile development | iOS/Android |
| `devops` | DevOps/Infrastructure | CI/CD, Cloud |

---

## Conversation Management

### Chat Commands

```bash
# Start new conversation
claude chat

# Continue last conversation
claude chat continue

# Resume specific conversation
claude chat resume [id]

# List conversations
claude chat list

# Options:
#   --limit N          Show N most recent
#   --project [name]   Filter by project
#   --date [YYYY-MM-DD] Filter by date

# Search conversations
claude chat search [query]

# Delete conversation
claude chat delete [id]

# Export conversation
claude chat export [id] --format json|markdown|text
```

### Conversation Options

```bash
# Start chat with specific options
claude chat \
  --model opus \
  --temperature 0.7 \
  --max-tokens 8192 \
  --system "Custom system prompt"
```

### Message Management

| Command | Description | Example |
|---------|-------------|---------|
| `claude send [message]` | Send single message | `claude send "Explain async/await"` |
| `claude ask [question]` | Ask question (expects answer) | `claude ask "What is REST?"` |
| `claude complete [prompt]` | Complete text/code | `claude complete "def factorial"` |
| `claude edit [instruction]` | Edit previous response | `claude edit "Make it shorter"` |

---

## File Operations

### File Processing

```bash
# Process single file
claude file process [path]

# Process multiple files
claude file process [paths...]

# Options:
#   --task analyze|summarize|review|document
#   --output [path]
#   --format json|markdown|text

# Analyze code file
claude file analyze src/app.py

# Review multiple files
claude file review src/*.py --output review.md

# Generate documentation
claude file document src/ --recursive
```

### File Context

```bash
# Add files to context
claude context add [files...]

# Remove files from context
claude context remove [files...]

# List context files
claude context list

# Clear all context
claude context clear

# Show context size
claude context size
```

### Batch Operations

```bash
# Process directory
claude batch process [directory] \
  --pattern "*.py" \
  --task analyze \
  --output results/

# Apply transformation
claude batch transform [directory] \
  --pattern "*.js" \
  --instruction "Add JSDoc comments"

# Batch rename
claude batch rename [directory] \
  --pattern "*.test.js" \
  --replacement "*.spec.js"
```

---

## API Commands

### API Interaction

```bash
# Direct API call
claude api call [endpoint] \
  --method GET|POST|PUT|DELETE \
  --data '[json]' \
  --headers '[json]'

# Test API endpoint
claude api test [endpoint]

# Show API status
claude api status

# View API usage
claude api usage \
  --period today|week|month \
  --format table|json
```

### API Key Management

```bash
# Set API key
claude auth login [key]

# Show current auth status
claude auth status

# Logout
claude auth logout

# Validate API key
claude auth validate

# Rotate API key
claude auth rotate
```

### Rate Limits

```bash
# Show rate limits
claude api limits

# Show current usage
claude api quota

# Example output:
# Requests: 850/1000 (85%)
# Tokens: 450K/500K (90%)
# Reset: 2024-05-05 00:00:00 UTC
```

---

## Developer Tools

### Code Generation

```bash
# Generate code from description
claude generate [description] \
  --language python|javascript|typescript|java \
  --output [path]

# Generate tests
claude generate tests [source-file] \
  --framework jest|pytest|junit \
  --coverage full|basic

# Generate documentation
claude generate docs [source-files...] \
  --format markdown|html|rst

# Generate API client
claude generate client [api-spec] \
  --language typescript \
  --output src/client/
```

### Code Analysis

```bash
# Analyze code quality
claude analyze quality [files...] \
  --metrics complexity|maintainability|security

# Find bugs
claude analyze bugs [files...] \
  --severity high|medium|low|all

# Security scan
claude analyze security [files...] \
  --standards owasp|cwe

# Performance analysis
claude analyze performance [files...] \
  --profile cpu|memory|io
```

### Refactoring

```bash
# Refactor code
claude refactor [file] \
  --task extract-function|rename|modernize \
  --output [path]

# Modernize codebase
claude refactor modernize [directory] \
  --target es2023 \
  --preserve-behavior

# Extract functions
claude refactor extract [file] \
  --threshold 10 \
  --prefix extracted_
```

---

## System Commands

### Cache Management

```bash
# Show cache stats
claude cache stats

# Clear cache
claude cache clear [--all|--expired]

# Optimize cache
claude cache optimize

# Set cache size
claude cache size [MB]
```

### Logging

```bash
# View logs
claude logs show \
  --level debug|info|warn|error \
  --lines 100 \
  --follow

# Clear logs
claude logs clear

# Export logs
claude logs export [path]

# Set log level
claude logs level [level]
```

### Updates

```bash
# Check for updates
claude update check

# Update to latest version
claude update install

# Update to specific version
claude update install [version]

# Show version history
claude update history

# Rollback to previous version
claude update rollback
```

### Diagnostics

```bash
# Run diagnostics
claude doctor

# Test connectivity
claude ping

# System information
claude info

# Performance benchmark
claude benchmark
```

---

## Troubleshooting

### Common Issues

#### Connection Issues

```bash
# Test API connectivity
claude api test

# Check network configuration
claude config get proxy
claude config set proxy http://proxy:8080

# Verify authentication
claude auth validate
```

#### Performance Issues

```bash
# Clear cache
claude cache clear

# Reduce context size
claude context clear

# Use faster model
claude config set model haiku

# Enable streaming
claude config set streaming true
```

#### Configuration Issues

```bash
# Reset configuration
claude config reset

# Verify configuration
claude config validate

# Show effective configuration
claude config show --resolved

# Repair configuration
claude config repair
```

### Debug Mode

```bash
# Enable debug logging
claude --debug [command]

# Save debug log
claude --debug [command] 2> debug.log

# Verbose output
claude --verbose [command]
```

### Getting Help

```bash
# General help
claude help

# Command-specific help
claude help [command]

# Show examples
claude examples [command]

# Open documentation
claude docs [topic]
```

---

## Environment Variables

### Configuration via Environment

| Variable | Description | Default |
|----------|-------------|---------|
| `CLAUDE_API_KEY` | API authentication key | None (required) |
| `CLAUDE_MODEL` | Default model | `sonnet` |
| `CLAUDE_TEMPERATURE` | Default temperature | `1.0` |
| `CLAUDE_MAX_TOKENS` | Default max tokens | `4096` |
| `CLAUDE_CONFIG_PATH` | Config file location | `~/.claude/config.json` |
| `CLAUDE_CACHE_DIR` | Cache directory | `~/.claude/cache` |
| `CLAUDE_LOG_LEVEL` | Logging level | `info` |
| `CLAUDE_EDITOR` | Preferred editor | `$EDITOR` or `vim` |
| `CLAUDE_PROXY` | HTTP proxy | None |
| `CLAUDE_TIMEOUT` | Request timeout (sec) | `60` |

### Setting Environment Variables

```bash
# Temporary (current session)
export CLAUDE_MODEL=opus

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export CLAUDE_MODEL=opus' >> ~/.bashrc

# Per-command
CLAUDE_MODEL=opus claude chat
```

---

## Keyboard Shortcuts

*Available in interactive mode*

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Cancel current operation |
| `Ctrl+D` | Exit interactive mode |
| `Ctrl+L` | Clear screen |
| `Ctrl+R` | Search command history |
| `Ctrl+U` | Clear current line |
| `Up/Down` | Navigate history |
| `Tab` | Auto-complete |
| `Esc` | Cancel current input |

---

## Aliases and Shortcuts

### Commonly Used Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc

alias c='claude'
alias cc='claude chat'
alias cf='claude file'
alias cg='claude generate'
alias ca='claude analyze'
alias cp='claude project'

# Quick actions
alias cask='claude ask'
alias csend='claude send'
alias ccode='claude generate code'
alias cdocs='claude generate docs'
```

---

## Exit Codes

| Code | Meaning | Typical Cause |
|------|---------|---------------|
| 0 | Success | Command completed successfully |
| 1 | General error | Unspecified error occurred |
| 2 | Invalid usage | Wrong arguments or options |
| 3 | Authentication error | Invalid or missing API key |
| 4 | Network error | Connection issues |
| 5 | Rate limit | API rate limit exceeded |
| 6 | Invalid input | Malformed input data |
| 7 | File error | File not found or permission denied |
| 8 | Configuration error | Invalid configuration |
| 9 | Timeout | Request timeout |
| 10 | Interrupted | User cancelled operation |

---

## Advanced Usage

### Piping and Redirection

```bash
# Pipe input to Claude
echo "Explain this code" | cat script.py - | claude

# Redirect output
claude send "Generate README" > README.md

# Process file through Claude
cat input.txt | claude process > output.txt

# Chain commands
claude generate tests app.py | claude review - > review.md
```

### Scripting with Claude

```bash
#!/bin/bash

# Automated code review script
for file in src/*.py; do
    echo "Reviewing $file..."
    claude file review "$file" \
        --output "reviews/$(basename $file .py).md"
done

# Combine reviews
claude send "Summarize these reviews" \
    --context reviews/*.md \
    > summary.md
```

### Integration Examples

```bash
# Git pre-commit hook
#!/bin/bash
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep '\.py$')
if [ -n "$changed_files" ]; then
    claude analyze quality $changed_files || exit 1
fi

# Continuous documentation
#!/bin/bash
find src -name '*.py' -newer docs/last_update.txt | \
    xargs claude generate docs --output docs/
touch docs/last_update.txt
```

---

## Related Resources

- **API Reference**: Detailed API endpoint documentation
- **Configuration Options**: Complete configuration reference
- **Keyboard Shortcuts**: Full shortcut reference
- **Quick Reference**: Condensed command cheat sheet

---

*Last Updated: 2026-05-05*
*Version: 1.0*
