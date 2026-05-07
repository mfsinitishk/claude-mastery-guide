# Common Issues and Quick Fixes

## Overview

This guide covers the most frequently encountered issues when working with Claude Code and provides quick, actionable solutions. These problems represent 80% of user-reported issues and can typically be resolved in minutes with the right approach.

## Installation and Setup Issues

### Issue: Claude Code Won't Install

**Problem Description:**
Installation fails with npm errors, permission issues, or incomplete downloads. Users report "command not found" after installation or the CLI doesn't recognize commands.

**Diagnostic Steps:**

1. Check Node.js version: `node --version` (requires v18 or higher)
2. Verify npm installation: `npm --version`
3. Check installation location: `which claude` or `where claude`
4. Review installation logs for error messages
5. Verify system PATH includes npm global bin directory

**Solutions:**

Step 1: Clean Install
```bash
# Uninstall completely
npm uninstall -g @anthropic-ai/claude-code

# Clear npm cache
npm cache clean --force

# Reinstall
npm install -g @anthropic-ai/claude-code
```

Step 2: Fix Permissions (macOS/Linux)
```bash
# Change npm global directory ownership
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER /usr/local/bin

# Or use npx without global install
npx @anthropic-ai/claude-code
```

Step 3: Use Alternative Package Manager
```bash
# Try with yarn
yarn global add @anthropic-ai/claude-code

# Or with pnpm
pnpm add -g @anthropic-ai/claude-code
```

**Prevention Strategies:**
- Use node version manager (nvm) to manage Node.js versions
- Set up proper npm permissions before installation
- Document your installation method for team consistency
- Keep Node.js and npm updated to latest LTS versions

**Related Issues:** CLI won't start, command not found errors, PATH configuration problems

**When to Escalate:** If installation fails after trying all methods, check system compatibility requirements or report bug with full system details.

---

### Issue: Authentication Failures

**Problem Description:**
Cannot authenticate with API key, receives "Invalid API key" or "Unauthorized" errors, or authentication expires unexpectedly during sessions.

**Diagnostic Steps:**

1. Verify API key format (starts with "sk-ant-")
2. Check key is active in Anthropic Console
3. Test key with curl command
4. Verify no extra spaces or characters in key
5. Check environment variable configuration

**Solutions:**

Step 1: Verify API Key
```bash
# Test API key directly
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-sonnet-4-5","max_tokens":1024,"messages":[{"role":"user","content":"test"}]}'
```

Step 2: Set Environment Variable Correctly
```bash
# For bash/zsh (add to ~/.bashrc or ~/.zshrc)
export ANTHROPIC_API_KEY="sk-ant-your-actual-key"

# For Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-your-actual-key"

# Reload shell configuration
source ~/.zshrc  # or source ~/.bashrc
```

Step 3: Use Configuration File
```bash
# Create/edit Claude config
claude config set api-key "sk-ant-your-actual-key"

# Verify configuration
claude config list
```

**Prevention Strategies:**
- Store API keys in secure credential manager
- Use environment variables instead of hardcoding
- Rotate keys periodically
- Never commit API keys to version control
- Use different keys for development/production

**Related Issues:** Rate limiting, quota exceeded, permission denied errors

**When to Escalate:** If valid key consistently fails, contact Anthropic support to verify account status and key validity.

---

## Operational Issues

### Issue: Slow Response Times

**Problem Description:**
Claude takes longer than expected to respond, requests timeout, or performance degrades over time during extended sessions.

**Diagnostic Steps:**

1. Check internet connection speed
2. Monitor API latency with timing tools
3. Review request complexity (token count)
4. Check for prompt caching opportunities
5. Verify model selection (Opus vs Sonnet vs Haiku)

**Solutions:**

Step 1: Optimize Request Size
```bash
# Use faster model for simple tasks
claude --model claude-haiku-4-0 "simple question"

# Break large requests into smaller chunks
# Instead of processing 10k lines at once, batch in 2k chunks
```

Step 2: Enable Prompt Caching
```javascript
// In your API calls, structure for caching
{
  "model": "claude-sonnet-4-5",
  "system": [
    {
      "type": "text",
      "text": "Long context that doesn't change",
      "cache_control": {"type": "ephemeral"}
    }
  ],
  "messages": [{"role": "user", "content": "New query"}]
}
```

Step 3: Check Network Issues
```bash
# Test API latency
time curl -o /dev/null -s -w '%{time_total}\n' https://api.anthropic.com/v1/messages

# Use faster DNS
# Switch to 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)
```

**Prevention Strategies:**
- Use appropriate model for task complexity
- Implement prompt caching for repeated contexts
- Monitor and optimize token usage
- Use streaming responses for real-time feedback
- Consider geographic API endpoint proximity

**Related Issues:** Timeouts, streaming delays, connection drops

**When to Escalate:** If latency is consistently >10 seconds for simple queries across different networks, report to Anthropic support.

---

### Issue: Unexpected Responses

**Problem Description:**
Claude provides incorrect, incomplete, or inconsistent responses. May hallucinate facts, refuse valid requests, or misunderstand instructions.

**Diagnostic Steps:**

1. Review prompt clarity and specificity
2. Check for contradictory instructions
3. Verify context is complete and relevant
4. Test with simplified version of request
5. Compare results across different model versions

**Solutions:**

Step 1: Improve Prompt Clarity
```markdown
# Vague prompt
"Fix the bug"

# Clear prompt
"In the file src/auth.js, fix the bug where users can't log in 
when their email contains a plus sign (+). The error occurs in 
the validateEmail function at line 42. Preserve existing error 
handling and add test cases."
```

Step 2: Use Structured Output
```bash
# Request specific format
claude "Analyze this code and respond in this format:
1. Issues Found: [list]
2. Severity: [Critical/High/Medium/Low]
3. Recommendations: [list]
4. Code Example: [corrected code]"
```

Step 3: Add Context and Examples
```bash
# Provide examples of expected behavior
claude "Convert these dates to ISO format. 
Examples:
- Input: '12/25/2024' → Output: '2024-12-25'
- Input: 'Jan 5, 2024' → Output: '2024-01-05'

Now convert: '3/15/2025'"
```

**Prevention Strategies:**
- Write explicit, unambiguous prompts
- Provide relevant context and examples
- Use system prompts to set behavior expectations
- Break complex tasks into smaller steps
- Verify outputs with automated tests where possible

**Related Issues:** Hallucinations, refusals, misinterpretations

**When to Escalate:** If Claude consistently fails at tasks within its capabilities, document examples and report pattern.

---

## File and Project Issues

### Issue: File Access Denied

**Problem Description:**
Claude cannot read, write, or modify files. Receives permission errors or claims files don't exist when they clearly do.

**Diagnostic Steps:**

1. Check file permissions: `ls -la filename`
2. Verify Claude has directory access permissions
3. Check file paths (absolute vs relative)
4. Test with manual file operations
5. Review system security settings (macOS Gatekeeper, etc.)

**Solutions:**

Step 1: Fix File Permissions
```bash
# Make file readable
chmod 644 filename

# Make directory accessible
chmod 755 directory_name

# Recursive permissions for project
chmod -R u+rw project_directory
```

Step 2: Grant System Permissions
```bash
# macOS: System Settings > Privacy & Security > Files and Folders
# Grant Terminal/Claude access to necessary directories

# Linux: Add user to appropriate groups
sudo usermod -a -G groupname $USER

# Windows: Right-click > Properties > Security
# Add user with appropriate permissions
```

Step 3: Use Absolute Paths
```bash
# Instead of relative paths
claude "read file.txt"

# Use absolute paths
claude "read /Users/username/projects/myapp/file.txt"
```

**Prevention Strategies:**
- Set up project with correct permissions from start
- Use .gitignore to exclude sensitive files
- Document required permissions in project README
- Use workspace settings to define accessible directories
- Consider running from project root directory

**Related Issues:** Directory not found, write failures, symlink issues

**When to Escalate:** If permissions are correct but access still denied, may be OS-level security policy requiring admin intervention.

---

### Issue: Git Integration Problems

**Problem Description:**
Claude cannot commit changes, push to remote, or encounters merge conflicts. Git operations fail or produce unexpected results.

**Diagnostic Steps:**

1. Verify git is installed: `git --version`
2. Check repository status: `git status`
3. Test git operations manually
4. Review git configuration: `git config --list`
5. Check remote connectivity: `git remote -v`

**Solutions:**

Step 1: Configure Git Properly
```bash
# Set user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure credential helper
git config --global credential.helper store

# Set default branch name
git config --global init.defaultBranch main
```

Step 2: Fix Authentication
```bash
# For HTTPS (use token, not password)
git remote set-url origin https://username:TOKEN@github.com/user/repo.git

# For SSH
ssh-keygen -t ed25519 -C "your.email@example.com"
# Add key to GitHub/GitLab

# Test connection
ssh -T git@github.com
```

Step 3: Resolve Common Issues
```bash
# Uncommitted changes blocking operations
git stash
git pull
git stash pop

# Detached HEAD state
git checkout main
git pull

# Rejected push
git pull --rebase
git push
```

**Prevention Strategies:**
- Configure git before starting project
- Use SSH keys instead of password auth
- Keep repository clean with regular commits
- Use .gitignore to prevent tracking unwanted files
- Document git workflow for team

**Related Issues:** Merge conflicts, push rejections, credential failures

**When to Escalate:** If git operations work manually but fail through Claude, report with specific command sequence.

---

## Configuration Issues

### Issue: MCP Servers Not Connecting

**Problem Description:**
Model Context Protocol servers fail to start, disconnect unexpectedly, or don't respond to requests. Claude reports MCP tools unavailable.

**Diagnostic Steps:**

1. Check MCP server configuration file
2. Verify server process is running
3. Test server endpoint manually
4. Review server logs for errors
5. Check network connectivity and ports

**Solutions:**

Step 1: Verify Configuration
```json
// ~/.claude/mcp-servers.json
{
  "myserver": {
    "command": "node",
    "args": ["/path/to/server/index.js"],
    "env": {
      "API_KEY": "your-key"
    }
  }
}
```

Step 2: Test Server Manually
```bash
# Run server directly
node /path/to/server/index.js

# Check for errors in output
# Verify port bindings and dependencies
```

Step 3: Debug Connection
```bash
# Enable debug logging
export CLAUDE_DEBUG=1
claude --verbose

# Check server health endpoint
curl http://localhost:SERVER_PORT/health
```

**Prevention Strategies:**
- Validate MCP configuration before use
- Use absolute paths in server configuration
- Monitor server logs regularly
- Implement health checks for servers
- Document server dependencies clearly

**Related Issues:** Tool unavailable, server timeouts, authentication failures

**When to Escalate:** If server works standalone but not with Claude, provide logs and configuration for debugging.

---

### Issue: Environment Variables Not Working

**Problem Description:**
Environment variables aren't recognized, have wrong values, or don't persist across sessions.

**Diagnostic Steps:**

1. Print environment: `printenv` or `echo $VAR_NAME`
2. Check shell configuration files
3. Verify variable export syntax
4. Test in new terminal session
5. Review shell type (bash vs zsh vs fish)

**Solutions:**

Step 1: Set Variables Correctly
```bash
# Temporary (current session only)
export MY_VAR="value"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc

# For Windows
setx MY_VAR "value"
```

Step 2: Create .env File
```bash
# Project .env file
# .env
API_KEY=your-key-here
DATABASE_URL=postgresql://localhost/mydb
DEBUG=true

# Load with claude
claude --env-file .env
```

Step 3: Use Claude Config
```bash
# Set in Claude configuration
claude config set env.MY_VAR "value"

# Verify
claude config get env.MY_VAR
```

**Prevention Strategies:**
- Use .env files for project-specific variables
- Document required environment variables
- Use dotenv or similar tools for consistency
- Never commit sensitive variables to version control
- Validate variables before running operations

**Related Issues:** Configuration not loading, secrets exposure, platform differences

**When to Escalate:** If variables are correctly set but not accessible to Claude, may be shell integration issue.

---

## Tool and Command Issues

### Issue: Tool Execution Failures

**Problem Description:**
External tools called by Claude fail to execute, return errors, or produce unexpected output.

**Diagnostic Steps:**

1. Test tool directly in terminal
2. Check tool installation and PATH
3. Verify tool version compatibility
4. Review tool output and error messages
5. Check for missing dependencies

**Solutions:**

Step 1: Verify Tool Installation
```bash
# Check if tool exists
which toolname
type toolname

# Install if missing
npm install -g toolname
# or
pip install toolname
# or
brew install toolname
```

Step 2: Fix PATH Issues
```bash
# Add tool location to PATH
export PATH="$PATH:/path/to/tool/bin"

# Make permanent
echo 'export PATH="$PATH:/path/to/tool/bin"' >> ~/.zshrc
source ~/.zshrc

# Verify
echo $PATH
```

Step 3: Check Dependencies
```bash
# For Node.js tools
npm install

# For Python tools
pip install -r requirements.txt

# For system tools
brew install dependencies
apt-get install dependencies
```

**Prevention Strategies:**
- Document all required tools and versions
- Use package.json or requirements.txt
- Provide installation scripts for team
- Use Docker for consistent environments
- Validate tool availability before operations

**Related Issues:** Command not found, version conflicts, dependency errors

**When to Escalate:** If tool works manually but fails when called by Claude, provide exact command sequence.

---

## Quick Reference: Common Error Codes

| Error Code | Meaning | Quick Fix |
|------------|---------|-----------|
| 401 | Authentication failed | Check API key |
| 429 | Rate limit exceeded | Wait or upgrade plan |
| 500 | Server error | Retry request |
| 503 | Service unavailable | Check status page |
| EACCES | Permission denied | Fix file permissions |
| ENOENT | File not found | Verify path |
| ECONNREFUSED | Connection refused | Check server running |
| ETIMEDOUT | Request timeout | Check network |

## Recovery Procedures

### When Everything Fails

1. **Restart Claude CLI:** Close and reopen terminal
2. **Clear cache:** Remove `~/.claude/cache`
3. **Reset configuration:** Backup and recreate config files
4. **Update Claude:** Run `npm update -g @anthropic-ai/claude-code`
5. **Check system resources:** Ensure adequate memory and disk space
6. **Review logs:** Check `~/.claude/logs` for detailed errors

### Emergency Rollback

```bash
# If update breaks functionality
npm install -g @anthropic-ai/claude-code@previous-version

# Restore configuration from backup
cp ~/.claude/config.backup.json ~/.claude/config.json

# Clear corrupted state
rm -rf ~/.claude/cache
rm -rf ~/.claude/sessions
```

## Getting Help

When troubleshooting independently doesn't resolve the issue:

1. **Search Documentation:** Check official docs first
2. **Community Forums:** Look for similar issues reported
3. **GitHub Issues:** Search existing issues, file new one if needed
4. **Support Channels:** Contact Anthropic support with detailed information
5. **Provide Context:** Include OS, Claude version, error messages, and reproduction steps

## Diagnostic Information Collection

Gather this information before reporting issues:

```bash
# System information
uname -a
node --version
npm --version
claude --version

# Configuration
claude config list

# Recent logs
tail -n 100 ~/.claude/logs/latest.log

# Environment
printenv | grep CLAUDE
printenv | grep ANTHROPIC
```

This collection of common issues and quick fixes should resolve most day-to-day problems encountered with Claude Code. For issues not covered here, consult the specialized troubleshooting sections for deeper diagnostics.
