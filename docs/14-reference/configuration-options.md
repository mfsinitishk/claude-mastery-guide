# Configuration Options Reference

*Complete configuration reference for Claude across all interfaces*

---

## Table of Contents

1. [Global Configuration](#global-configuration)
2. [Model Configuration](#model-configuration)
3. [API Configuration](#api-configuration)
4. [CLI Configuration](#cli-configuration)
5. [Desktop App Configuration](#desktop-app-configuration)
6. [Project Configuration](#project-configuration)
7. [Environment Variables](#environment-variables)
8. [Advanced Configuration](#advanced-configuration)

---

## Global Configuration

### Configuration File Locations

| Platform | Location |
|----------|----------|
| **macOS** | `~/.claude/config.json` |
| **Windows** | `%APPDATA%\Claude\config.json` |
| **Linux** | `~/.config/claude/config.json` |
| **Project** | `./.claude/config.json` |

### Basic Configuration Structure

```json
{
  "version": "1.0",
  "model": "claude-sonnet-4-5-20250514",
  "apiKey": "sk-ant-...",
  "preferences": {
    "theme": "auto",
    "language": "en",
    "autoSave": true,
    "streaming": true
  },
  "limits": {
    "maxTokens": 4096,
    "temperature": 1.0,
    "topP": null,
    "topK": null
  },
  "features": {
    "caching": true,
    "vision": true,
    "tools": true
  }
}
```

---

## Model Configuration

### Model Selection

```json
{
  "model": {
    "default": "claude-sonnet-4-5-20250514",
    "fallback": "claude-haiku-4-5-20250514",
    "options": {
      "complex": "claude-opus-4-5-20250514",
      "balanced": "claude-sonnet-4-5-20250514",
      "fast": "claude-haiku-4-5-20250514"
    }
  }
}
```

### Model Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `temperature` | float | 0.0-1.0 | 1.0 | Randomness in generation |
| `max_tokens` | int | 1-4096+ | 4096 | Maximum output length |
| `top_p` | float | 0.0-1.0 | null | Nucleus sampling threshold |
| `top_k` | int | 1-500 | null | Top-k sampling limit |
| `stop_sequences` | array | - | [] | Custom stop sequences |

### Example Configuration

```json
{
  "models": {
    "creative": {
      "model": "claude-opus-4-5-20250514",
      "temperature": 0.9,
      "max_tokens": 4096,
      "top_p": 0.95
    },
    "precise": {
      "model": "claude-sonnet-4-5-20250514",
      "temperature": 0.2,
      "max_tokens": 2048,
      "top_k": 10
    },
    "quick": {
      "model": "claude-haiku-4-5-20250514",
      "temperature": 0.7,
      "max_tokens": 1024
    }
  }
}
```

---

## API Configuration

### API Settings

```json
{
  "api": {
    "baseUrl": "https://api.anthropic.com",
    "version": "2023-06-01",
    "timeout": 60000,
    "retries": 3,
    "retryDelay": 1000,
    "maxRetryDelay": 10000
  }
}
```

### Authentication

```json
{
  "auth": {
    "method": "api_key",
    "apiKey": "${ANTHROPIC_API_KEY}",
    "keySource": "environment"
  }
}
```

### Rate Limiting

```json
{
  "rateLimits": {
    "enabled": true,
    "requestsPerMinute": 50,
    "tokensPerMinute": 100000,
    "tokensPerDay": 1000000,
    "backoff": {
      "strategy": "exponential",
      "initialDelay": 1000,
      "maxDelay": 60000,
      "multiplier": 2
    }
  }
}
```

### Proxy Configuration

```json
{
  "proxy": {
    "enabled": true,
    "http": "http://proxy.company.com:8080",
    "https": "https://proxy.company.com:8443",
    "bypass": ["localhost", "127.0.0.1"],
    "auth": {
      "username": "${PROXY_USER}",
      "password": "${PROXY_PASS}"
    }
  }
}
```

---

## CLI Configuration

### CLI-Specific Settings

```json
{
  "cli": {
    "editor": "vim",
    "pager": "less",
    "shell": "zsh",
    "colorScheme": "auto",
    "promptStyle": "default",
    "historySize": 1000,
    "autoComplete": true,
    "syntaxHighlight": true
  }
}
```

### Output Formatting

```json
{
  "output": {
    "format": "auto",
    "color": true,
    "unicode": true,
    "emoji": false,
    "markdown": true,
    "codeHighlight": true,
    "lineNumbers": true,
    "wordWrap": true,
    "maxWidth": 120
  }
}
```

### File Processing

```json
{
  "fileProcessing": {
    "maxSize": 10485760,
    "allowedTypes": [
      ".txt", ".md", ".py", ".js", ".ts",
      ".java", ".cpp", ".c", ".h", ".json"
    ],
    "encoding": "utf-8",
    "autoDetectEncoding": true,
    "preserveFormatting": true
  }
}
```

### Command Aliases

```json
{
  "aliases": {
    "c": "chat",
    "a": "ask",
    "r": "review",
    "g": "generate",
    "f": "file",
    "p": "project"
  }
}
```

---

## Desktop App Configuration

### Appearance

```json
{
  "appearance": {
    "theme": "auto",
    "fontSize": 14,
    "fontFamily": "system-ui",
    "lineHeight": 1.5,
    "accentColor": "#0066cc",
    "compactMode": false,
    "sidebarWidth": 250,
    "codeTheme": "github-dark"
  }
}
```

### Behavior

```json
{
  "behavior": {
    "autoSave": true,
    "autoSaveInterval": 30000,
    "confirmBeforeDelete": true,
    "confirmBeforeClear": true,
    "showWelcomeScreen": true,
    "rememberWindowSize": true,
    "rememberWindowPosition": true,
    "minimizeToTray": false,
    "closeToTray": false,
    "startMinimized": false,
    "startOnBoot": false
  }
}
```

### Notifications

```json
{
  "notifications": {
    "enabled": true,
    "sound": true,
    "badge": true,
    "types": {
      "responseComplete": true,
      "error": true,
      "rateLimit": true,
      "update": true
    },
    "position": "top-right",
    "duration": 5000
  }
}
```

### Privacy

```json
{
  "privacy": {
    "analytics": false,
    "crashReports": true,
    "localStorageOnly": false,
    "clearOnExit": false,
    "encryptLocal": true
  }
}
```

---

## Project Configuration

### Project Settings

```json
{
  "project": {
    "name": "My Project",
    "description": "Project description",
    "type": "web",
    "version": "1.0.0",
    "created": "2024-05-05T00:00:00Z",
    "modified": "2024-05-05T12:00:00Z"
  }
}
```

### Context Configuration

```json
{
  "context": {
    "files": [
      "src/**/*.py",
      "docs/**/*.md"
    ],
    "exclude": [
      "node_modules/**",
      "*.log",
      "*.tmp"
    ],
    "maxFiles": 100,
    "maxFileSize": 1048576,
    "autoInclude": true,
    "watchChanges": true
  }
}
```

### System Prompt

```json
{
  "systemPrompt": {
    "enabled": true,
    "template": "default",
    "custom": "You are an expert developer...",
    "includeProjectContext": true,
    "includeFileContext": true
  }
}
```

### Tools and Features

```json
{
  "tools": {
    "codeAnalysis": true,
    "testing": true,
    "documentation": true,
    "refactoring": true,
    "debugging": true
  },
  "integrations": {
    "git": true,
    "npm": true,
    "docker": false,
    "kubernetes": false
  }
}
```

---

## Environment Variables

### Core Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ANTHROPIC_API_KEY` | API authentication key | None | `sk-ant-...` |
| `CLAUDE_MODEL` | Default model | `sonnet` | `opus` |
| `CLAUDE_MAX_TOKENS` | Default max tokens | `4096` | `2048` |
| `CLAUDE_TEMPERATURE` | Default temperature | `1.0` | `0.7` |

### Configuration Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_CONFIG_PATH` | Config file path | Platform-specific | `~/my-config.json` |
| `CLAUDE_CACHE_DIR` | Cache directory | `~/.claude/cache` | `/tmp/claude` |
| `CLAUDE_LOG_DIR` | Log directory | `~/.claude/logs` | `/var/log/claude` |
| `CLAUDE_LOG_LEVEL` | Logging level | `info` | `debug` |

### Network Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_API_URL` | API base URL | Official URL | Custom endpoint |
| `CLAUDE_PROXY` | HTTP proxy | None | `http://proxy:8080` |
| `CLAUDE_TIMEOUT` | Request timeout (ms) | `60000` | `30000` |
| `CLAUDE_RETRY_COUNT` | Max retry attempts | `3` | `5` |

### Feature Toggles

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLAUDE_STREAMING` | Enable streaming | `true` | `false` |
| `CLAUDE_CACHING` | Enable caching | `true` | `false` |
| `CLAUDE_ANALYTICS` | Enable analytics | `false` | `true` |
| `CLAUDE_DEBUG` | Debug mode | `false` | `true` |

### Setting Environment Variables

**Temporary (current session):**
```bash
export ANTHROPIC_API_KEY='sk-ant-...'
export CLAUDE_MODEL='opus'
```

**Permanent (add to ~/.bashrc or ~/.zshrc):**
```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-..."' >> ~/.bashrc
echo 'export CLAUDE_MODEL="opus"' >> ~/.bashrc
source ~/.bashrc
```

**Per-command:**
```bash
CLAUDE_MODEL=opus claude chat
```

**Windows:**
```cmd
set ANTHROPIC_API_KEY=sk-ant-...
setx ANTHROPIC_API_KEY "sk-ant-..."
```

**PowerShell:**
```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
[Environment]::SetEnvironmentVariable("ANTHROPIC_API_KEY", "sk-ant-...", "User")
```

---

## Advanced Configuration

### Prompt Caching

```json
{
  "caching": {
    "enabled": true,
    "ttl": 300,
    "maxSize": 104857600,
    "strategy": "lru",
    "compress": true,
    "persistent": true,
    "location": "~/.claude/cache"
  }
}
```

### Performance Tuning

```json
{
  "performance": {
    "streaming": true,
    "parallelRequests": 5,
    "connectionPool": 10,
    "keepAlive": true,
    "compression": true,
    "prefetch": false,
    "lazyLoad": true
  }
}
```

### Security

```json
{
  "security": {
    "validateCertificates": true,
    "allowInsecure": false,
    "keyStorage": "system",
    "encryptionAlgorithm": "AES-256",
    "sensitiveDataMasking": true,
    "auditLog": true
  }
}
```

### Logging

```json
{
  "logging": {
    "enabled": true,
    "level": "info",
    "format": "json",
    "outputs": ["file", "console"],
    "rotation": {
      "enabled": true,
      "maxSize": 10485760,
      "maxFiles": 10,
      "compress": true
    },
    "filters": {
      "excludePatterns": ["password", "api_key", "token"],
      "includeLevels": ["error", "warn", "info"]
    }
  }
}
```

### Custom Integrations

```json
{
  "integrations": {
    "webhook": {
      "enabled": false,
      "url": "https://webhook.example.com",
      "events": ["completion", "error"],
      "headers": {
        "Authorization": "Bearer ${WEBHOOK_TOKEN}"
      }
    },
    "database": {
      "enabled": false,
      "type": "postgres",
      "connection": "${DATABASE_URL}",
      "storeConversations": true,
      "storeMetrics": true
    }
  }
}
```

---

## Configuration Profiles

### Multiple Profiles

```json
{
  "profiles": {
    "default": {
      "model": "claude-sonnet-4-5-20250514",
      "temperature": 1.0,
      "max_tokens": 4096
    },
    "development": {
      "model": "claude-haiku-4-5-20250514",
      "temperature": 0.7,
      "max_tokens": 2048,
      "debug": true
    },
    "production": {
      "model": "claude-opus-4-5-20250514",
      "temperature": 0.3,
      "max_tokens": 4096,
      "logging": {
        "level": "warn"
      }
    }
  },
  "activeProfile": "default"
}
```

### Profile Switching

**CLI:**
```bash
# Use specific profile
claude --profile production chat

# Set default profile
claude config set profile production

# List profiles
claude config profiles list
```

**API:**
```python
from anthropic import Anthropic

# Load profile
client = Anthropic.from_profile("production")
```

---

## Configuration Validation

### Schema Validation

```json
{
  "$schema": "https://claude.ai/schemas/config-v1.json",
  "version": "1.0",
  "model": "claude-sonnet-4-5-20250514"
}
```

### Validation Commands

```bash
# Validate configuration
claude config validate

# Check for errors
claude config check

# Show effective configuration
claude config show --resolved

# Test configuration
claude config test
```

---

## Configuration Migration

### Version Migration

```bash
# Migrate from v0.9 to v1.0
claude config migrate --from 0.9 --to 1.0

# Backup before migration
claude config backup

# Restore from backup
claude config restore backup-2024-05-05.json
```

### Import/Export

```bash
# Export configuration
claude config export > config.json

# Import configuration
claude config import config.json

# Merge configurations
claude config merge other-config.json
```

---

## Configuration Best Practices

### Security Best Practices

1. **Never commit API keys**
   ```bash
   # Use environment variables
   export ANTHROPIC_API_KEY='...'
   
   # Or use .env file (gitignored)
   echo "ANTHROPIC_API_KEY=..." >> .env
   ```

2. **Encrypt sensitive data**
   ```json
   {
     "security": {
       "encryptLocal": true,
       "sensitiveDataMasking": true
     }
   }
   ```

3. **Use separate keys per environment**
   ```json
   {
     "profiles": {
       "dev": {"apiKey": "${DEV_API_KEY}"},
       "prod": {"apiKey": "${PROD_API_KEY}"}
     }
   }
   ```

### Performance Best Practices

1. **Enable caching**
   ```json
   {
     "caching": {"enabled": true, "ttl": 300}
   }
   ```

2. **Use streaming for long responses**
   ```json
   {
     "streaming": true
   }
   ```

3. **Optimize token usage**
   ```json
   {
     "limits": {
       "max_tokens": 2048  // Only what you need
     }
   }
   ```

### Organization Best Practices

1. **Use project-specific configs**
   ```
   project/
   ├── .claude/
   │   └── config.json
   └── src/
   ```

2. **Version control non-sensitive configs**
   ```bash
   # .gitignore
   .claude/config.local.json
   .env
   
   # Track template
   .claude/config.template.json
   ```

3. **Document custom configurations**
   ```json
   {
     "_comment": "Custom config for API project",
     "model": "claude-opus-4-5-20250514",
     "_reasoning": "Need high accuracy for API generation"
   }
   ```

---

## Troubleshooting Configuration

### Common Issues

#### Configuration Not Loading

```bash
# Check config path
claude config path

# Verify file exists
ls -la ~/.claude/config.json

# Check permissions
chmod 600 ~/.claude/config.json
```

#### Invalid Configuration

```bash
# Validate syntax
claude config validate

# Show errors
claude config check --verbose

# Reset to defaults
claude config reset
```

#### Environment Variables Not Working

```bash
# Check if set
echo $ANTHROPIC_API_KEY

# Verify shell profile
cat ~/.bashrc | grep ANTHROPIC

# Re-source profile
source ~/.bashrc
```

---

## Configuration Templates

### Minimal Configuration

```json
{
  "model": "claude-sonnet-4-5-20250514",
  "apiKey": "${ANTHROPIC_API_KEY}"
}
```

### Recommended Configuration

```json
{
  "version": "1.0",
  "model": "claude-sonnet-4-5-20250514",
  "apiKey": "${ANTHROPIC_API_KEY}",
  "limits": {
    "max_tokens": 4096,
    "temperature": 1.0
  },
  "features": {
    "streaming": true,
    "caching": true
  },
  "logging": {
    "level": "info"
  }
}
```

### Production Configuration

```json
{
  "version": "1.0",
  "model": "claude-opus-4-5-20250514",
  "apiKey": "${ANTHROPIC_API_KEY}",
  "limits": {
    "max_tokens": 4096,
    "temperature": 0.3
  },
  "features": {
    "streaming": true,
    "caching": true
  },
  "rateLimits": {
    "enabled": true,
    "requestsPerMinute": 50,
    "backoff": {
      "strategy": "exponential"
    }
  },
  "logging": {
    "level": "warn",
    "outputs": ["file"],
    "rotation": {
      "enabled": true,
      "maxSize": 10485760
    }
  },
  "security": {
    "encryptLocal": true,
    "auditLog": true
  }
}
```

---

## Related Resources

- **Command Reference**: CLI commands
- **API Reference**: API configuration
- **Environment Variables**: Complete variable list
- **Quick Reference**: Configuration quick start

---

*Last Updated: 2026-05-05*
*Version: 1.0*
