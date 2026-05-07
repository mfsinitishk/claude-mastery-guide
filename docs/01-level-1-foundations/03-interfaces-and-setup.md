# Interfaces and Setup

## Getting Claude Ready for Daily Use

---

## 🎯 Overview

Claude is available through multiple interfaces, each optimized for different workflows and use cases. Understanding these interfaces and setting them up correctly is crucial for maximizing productivity.

**Time to Complete:** 30-60 minutes  
**Outcome:** Claude set up and ready across all interfaces

---

## 🌐 Claude Interfaces Overview

### Interface Comparison

| Interface | Best For | Pros | Cons | Access |
|-----------|----------|------|------|--------|
| **Web (claude.ai)** | Quick queries, exploration, learning | Easy access, no installation, artifacts | Context not saved locally, requires internet | Browser only |
| **Desktop App** | Daily development, deep work | Native experience, better performance, local context | Requires installation | Mac, Windows |
| **CLI (Command Line)** | Automation, scripting, CI/CD | Scriptable, fast, integrates with tools | Terminal-based, less visual | Mac, Windows, Linux |
| **Claude Code** | Complex coding tasks, repo work | Deep codebase integration, multi-file edits | Learning curve, specific use case | CLI + IDE integration |
| **IDE Extensions** | In-editor assistance | Contextual help, inline suggestions | Limited compared to full Claude | VS Code, JetBrains |

---

## 🌍 1. Claude Web Interface

### Setup and Access

**Access:** [claude.ai](https://claude.ai)

**Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Anthropic account (free tier available)
- Internet connection

**Getting Started:**

1. **Create Account**
   - Navigate to claude.ai
   - Sign up with email or Google/OAuth
   - Verify email address
   - Choose plan (Free, Pro, Team)

2. **Initial Configuration**
   - Set display preferences (light/dark mode)
   - Configure default model (Sonnet 4.6 recommended)
   - Review privacy settings
   - Enable/disable data sharing for training

### Web Interface Features

**Conversations:**
- Create new conversations
- Name and organize conversations
- Search conversation history
- Share conversations (Pro feature)
- Export conversations

**Artifacts:**
- Interactive code previews
- Rendered markdown
- Data visualizations
- Editable generated content

**Context Management:**
- Paste code directly
- Upload files (Pro feature)
- Attach images for analysis
- Provide URLs for reference

**Keyboard Shortcuts:**
- `Cmd/Ctrl + K` - New conversation
- `Cmd/Ctrl + /` - Focus search
- `Shift + Enter` - New line in input
- `Enter` - Send message

### Best Practices for Web Interface

**✅ DO:**
- Use for learning and exploration
- Quick one-off queries
- Sharing findings with teammates
- Experimenting with prompts
- Code explanations and documentation

**❌ DON'T:**
- Paste sensitive data or credentials
- Rely solely on web for production work
- Use for large multi-file projects
- Expect persistent local state

### Example Workflows

**Learning a New Concept:**
```
1. Open new conversation
2. Ask: "Explain React hooks with examples"
3. Follow-up with specific questions
4. Save useful examples to notes
```

**Quick Code Generation:**
```
1. Describe what you need
2. Get generated code in artifact
3. Copy to your editor
4. Test and modify
```

**Documentation Review:**
```
1. Paste documentation
2. Ask for clarification on specific sections
3. Request examples
4. Get simplified explanations
```

---

## 💻 2. Claude Desktop App

### Installation

**Mac:**
```bash
# Download from claude.ai/desktop
# Or use Homebrew
brew install --cask claude
```

**Windows:**
```powershell
# Download installer from claude.ai/desktop
# Run installer
# Follow installation wizard
```

### Initial Setup

**First Launch:**
1. Sign in with your Anthropic account
2. Grant necessary permissions (file access, clipboard)
3. Configure preferences
4. Set up shortcuts

**Preferences Configuration:**

```
Settings > General:
- Theme: Auto/Light/Dark
- Default model: Sonnet 4.6
- Font size: Medium
- Auto-save conversations: On

Settings > Privacy:
- Crash reporting: Your preference
- Analytics: Your preference
- Improve Claude: Your preference

Settings > Advanced:
- Context window: Extended
- Code execution: Enabled
- File upload: Enabled
- Shortcuts: Customize as needed
```

### Desktop App Features

**Local Context:**
- Access local files and directories
- Persistent conversation history
- Offline conversation viewing
- Local search across conversations

**File Operations:**
- Drag and drop files
- Browse and select files
- Read multiple files at once
- Context from file system

**System Integration:**
- Global keyboard shortcuts
- Menu bar access (Mac)
- System tray (Windows)
- Quick access from anywhere

**Performance:**
- Faster than web interface
- Better for large inputs
- Smoother scrolling
- Native notifications

### Configuration Tips

**Keyboard Shortcuts (Customizable):**
```
Global:
- Cmd/Ctrl + Shift + Space - Show/Hide Claude
- Cmd/Ctrl + N - New conversation
- Cmd/Ctrl + F - Search

In-App:
- Cmd/Ctrl + , - Preferences
- Cmd/Ctrl + W - Close conversation
- Cmd/Ctrl + [ / ] - Navigate conversations
```

**Optimizing for Development:**
```
1. Enable file access for your project directories
2. Set default model to Sonnet or Opus
3. Configure auto-save for important conversations
4. Set up quick access shortcut
5. Enable code syntax highlighting
```

### Best Practices

**✅ DO:**
- Use for daily development work
- Leverage file access for context
- Organize conversations by project
- Use global shortcuts for quick access
- Keep desktop app running

**❌ DON'T:**
- Grant unnecessary file permissions
- Ignore software updates
- Use for sensitive data without review
- Disable important security features

### Example Daily Workflow

**Morning Routine:**
```
1. Launch Claude desktop app
2. Review yesterday's conversations
3. Start new conversation for today's work
4. Drag project files for context
5. Begin development with AI assistance
```

**Active Development:**
```
1. Use global shortcut to open Claude
2. Paste code or drag files
3. Ask questions or request changes
4. Get responses with full context
5. Copy code back to IDE
6. Repeat as needed
```

---

## ⚙️ 3. Claude CLI (Command Line Interface)

### Installation

**Mac/Linux:**
```bash
# Using npm (requires Node.js)
npm install -g @anthropic-ai/claude-cli

# Or using Homebrew (Mac)
brew install claude-cli

# Verify installation
claude --version
```

**Windows:**
```powershell
# Using npm
npm install -g @anthropic-ai/claude-cli

# Or download binary from releases
# Add to PATH

# Verify
claude --version
```

### Authentication

**API Key Setup:**
```bash
# Get API key from console.anthropic.com
# Set environment variable
export ANTHROPIC_API_KEY='your-api-key-here'

# Or configure via CLI
claude auth login

# Verify authentication
claude auth whoami
```

**Configuration File:**
```bash
# Create config file
mkdir -p ~/.config/claude
nano ~/.config/claude/config.json
```

```json
{
  "apiKey": "your-api-key",
  "defaultModel": "claude-sonnet-4-6",
  "maxTokens": 4096,
  "temperature": 1.0
}
```

### Basic CLI Usage

**Interactive Mode:**
```bash
# Start interactive session
claude

# With specific model
claude --model claude-opus-4-7

# With context from file
claude --context src/app.py
```

**Single Query Mode:**
```bash
# Ask a question
claude "Explain this error: TypeError: undefined is not a function"

# Generate code
claude "Create a Python function to parse JSON"

# Code review
claude --context src/feature.js "Review this code for issues"
```

**File Operations:**
```bash
# Read file and ask question
claude --file src/app.py "What does this code do?"

# Multiple files
claude --file src/*.py "Find all TODO comments"

# Output to file
claude "Generate README" > README.md
```

### Advanced CLI Features

**Piping and Streaming:**
```bash
# Pipe file content
cat src/app.py | claude "Explain this code"

# Chain commands
git diff | claude "Summarize these changes"

# Process multiple files
find . -name "*.py" -exec claude --file {} "Check for security issues" \;
```

**Scripting:**
```bash
#!/bin/bash
# auto-document.sh

for file in src/**/*.py; do
  echo "Documenting $file"
  claude --file "$file" "Generate docstrings" > "${file}.docs"
done
```

**Configuration Options:**
```bash
# Set model
claude --model claude-haiku-4-5

# Adjust temperature (creativity)
claude --temperature 0.3  # More focused
claude --temperature 1.0  # More creative

# Max tokens
claude --max-tokens 8192

# System prompt
claude --system "You are a Python expert"

# JSON output
claude --format json "List Python best practices"
```

### CLI Best Practices

**✅ DO:**
- Use for automation and scripting
- Pipe commands for efficiency
- Set up aliases for common tasks
- Use environment variables for API keys
- Version control your scripts

**❌ DON'T:**
- Hardcode API keys in scripts
- Share scripts with embedded keys
- Use for interactive debugging (use desktop app)
- Ignore rate limits

### Example Automation Scripts

**Auto-Generate Commit Messages:**
```bash
#!/bin/bash
# commit-msg.sh

DIFF=$(git diff --staged)
MSG=$(echo "$DIFF" | claude "Generate a concise commit message")
git commit -m "$MSG"
```

**Bulk Documentation:**
```bash
#!/bin/bash
# document-all.sh

find src -name "*.py" | while read file; do
  claude --file "$file" \
    "Add docstrings to all functions" \
    > "${file}.temp"
  mv "${file}.temp" "$file"
done
```

**Code Review Automation:**
```bash
#!/bin/bash
# review-pr.sh

PR_NUMBER=$1
gh pr diff $PR_NUMBER | claude \
  "Review this code for:
   - Bugs
   - Security issues
   - Performance problems
   - Best practice violations"
```

---

## 🔧 4. Claude Code

### What is Claude Code?

Claude Code is an advanced CLI and IDE integration that provides deep codebase understanding and multi-file editing capabilities.

**Key Features:**
- Full repository context
- Multi-file edits
- Git integration
- Autonomous task execution
- MCP (Model Context Protocol) support

### Installation

**Prerequisites:**
- Node.js 18+ or Python 3.10+
- Git installed
- Code editor (VS Code recommended)

**Install via npm:**
```bash
npm install -g @anthropic-ai/claude-code

# Verify installation
claude-code --version
```

**Install via pip:**
```bash
pip install claude-code

# Verify
claude-code --version
```

### Initial Setup

**Authentication:**
```bash
# Login (opens browser)
claude-code auth login

# Verify
claude-code auth status
```

**Repository Initialization:**
```bash
# Navigate to your project
cd /path/to/your/project

# Initialize Claude Code
claude-code init

# This creates .claude/ directory with:
# - settings.json
# - memory/
# - context/
```

### Basic Usage

**Start Interactive Session:**
```bash
# In project directory
claude-code

# With specific task
claude-code "Refactor the authentication module"

# With context
claude-code --context "src/**/*.ts" "Add error handling"
```

**Task Execution:**
```bash
# Execute a coding task
claude-code task "Add user authentication to the API"

# Review changes before applying
claude-code task --dry-run "Optimize database queries"

# Apply suggested changes
claude-code apply
```

### IDE Integration (VS Code)

**Install Extension:**
```bash
# Via VS Code marketplace
code --install-extension anthropic.claude-code

# Or search "Claude Code" in Extensions
```

**Extension Features:**
- Inline suggestions
- Code explanations
- Refactoring assistance
- Documentation generation
- Chat panel in sidebar

**Keyboard Shortcuts (VS Code):**
```
Cmd/Ctrl + Shift + L - Ask Claude
Cmd/Ctrl + Shift + E - Explain selection
Cmd/Ctrl + Shift + R - Refactor selection
Cmd/Ctrl + Shift + T - Generate tests
Cmd/Ctrl + Shift + D - Generate docs
```

### Configuration

**Settings (.claude/settings.json):**
```json
{
  "model": "claude-sonnet-4-6",
  "contextFiles": [
    "src/**/*.ts",
    "tests/**/*.test.ts",
    "README.md"
  ],
  "excludePatterns": [
    "node_modules/**",
    "dist/**",
    "*.log"
  ],
  "autoSave": true,
  "gitIntegration": true,
  "mcpServers": []
}
```

### Best Practices

**✅ DO:**
- Initialize in repository root
- Configure context patterns
- Review changes before applying
- Use git to track Claude changes
- Leverage MCP servers for enhanced capabilities

**❌ DON'T:**
- Apply changes without review
- Include sensitive files in context
- Ignore .claude directory in git
- Use for repositories with secrets

---

## 📱 5. IDE Extensions

### VS Code Extension

**Installation:**
```
1. Open VS Code
2. Go to Extensions (Cmd/Ctrl + Shift + X)
3. Search "Claude AI"
4. Click Install
5. Sign in when prompted
```

**Features:**
- Inline code completion
- Chat sidebar
- Code explanation tooltips
- Refactoring suggestions
- Documentation generation

**Usage:**
```
1. Select code
2. Right-click → "Ask Claude"
3. Or use keyboard shortcut
4. Get response in sidebar
5. Apply suggestions to code
```

### JetBrains IDEs Extension

**Installation:**
```
1. Open IntelliJ/PyCharm/WebStorm
2. Go to Settings/Preferences
3. Plugins → Marketplace
4. Search "Claude AI"
5. Install and restart
6. Sign in
```

**Features:**
- Similar to VS Code extension
- Native IDE integration
- Language-specific features
- Framework awareness

---

## 🎯 Choosing the Right Interface

### Decision Matrix

**For Quick Questions:**
→ Web interface

**For Daily Development:**
→ Desktop app

**For Automation:**
→ CLI

**For Deep Codebase Work:**
→ Claude Code

**For In-Editor Help:**
→ IDE extension

### Multi-Interface Workflow

**Typical Developer Setup:**
```
Morning: Desktop app for planning
Active coding: IDE extension for inline help
Complex tasks: Claude Code for multi-file changes
Automation: CLI for scripts and CI/CD
Learning: Web interface for exploration
```

---

## ✅ Setup Checklist

Complete this checklist to ensure you're ready:

**Account and Access:**
- [ ] Created Anthropic account
- [ ] Verified email
- [ ] Chose appropriate plan
- [ ] Set up billing (if Pro/Team)

**Interfaces Installed:**
- [ ] Tested web interface
- [ ] Installed desktop app
- [ ] Installed and authenticated CLI
- [ ] Set up Claude Code (optional)
- [ ] Installed IDE extension (optional)

**Configuration:**
- [ ] Set preferences in desktop app
- [ ] Created CLI config file
- [ ] Set ANTHROPIC_API_KEY environment variable
- [ ] Configured IDE extension settings
- [ ] Tested each interface with simple query

**Security:**
- [ ] Reviewed privacy settings
- [ ] Understood data sharing policies
- [ ] Set up secure API key storage
- [ ] Configured file access permissions
- [ ] Reviewed organization policies

**Organization:**
- [ ] Created folder structure for conversations
- [ ] Set up naming conventions
- [ ] Configured auto-save settings
- [ ] Bookmarked important resources
- [ ] Joined community channels

---

## 🚀 First Steps After Setup

**Test Each Interface:**

1. **Web Interface Test:**
   ```
   Ask: "Explain the difference between let, const, and var in JavaScript"
   Verify you get a clear response
   ```

2. **Desktop App Test:**
   ```
   Create new conversation
   Drag a code file into the window
   Ask: "What does this code do?"
   ```

3. **CLI Test:**
   ```bash
   claude "Write a Python function to reverse a string"
   ```

4. **Claude Code Test (if installed):**
   ```bash
   cd your-project
   claude-code "Explain the project structure"
   ```

**Next Actions:**
1. Create your first prompt library
2. Organize conversations by category
3. Set up keyboard shortcuts
4. Bookmark useful conversations
5. Start using Claude for real work

---

## 🛠️ Troubleshooting

### Common Issues

**Authentication Failures:**
```
Issue: "Invalid API key"
Solution: Regenerate API key from console.anthropic.com
          Update environment variable
          Restart terminal/app
```

**Desktop App Won't Launch:**
```
Issue: App crashes on startup
Solution: Clear cache and preferences
          Reinstall application
          Check system requirements
```

**CLI Not Found:**
```
Issue: "command not found: claude"
Solution: Verify installation path
          Add to PATH
          Restart terminal
```

**Rate Limiting:**
```
Issue: "Too many requests"
Solution: Wait for rate limit reset
          Upgrade plan if needed
          Implement backoff in scripts
```

---

## 📚 Additional Resources

**Official Documentation:**
- [Claude Web Docs](https://docs.anthropic.com/claude/web)
- [CLI Documentation](https://docs.anthropic.com/claude/cli)
- [Claude Code Guide](https://docs.anthropic.com/claude/code)

**Video Tutorials:**
- "Getting Started with Claude" (YouTube)
- "Claude Desktop App Tour" (YouTube)
- "CLI Power User Guide" (YouTube)

**Community:**
- Discord: Anthropic Community
- Reddit: r/ClaudeAI
- GitHub: anthropics/claude-code

---

## ✅ You're Ready!

With Claude set up across all interfaces, you're ready to start learning effective prompting and AI-assisted development.

**Next:** [Effective Prompting Basics →](./04-effective-prompting-basics.md)

---

*"The right tools in the right hands can change the world."*

*You now have those tools. Let's learn to wield them effectively.*
