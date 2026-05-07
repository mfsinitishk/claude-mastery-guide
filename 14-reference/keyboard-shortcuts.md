# Keyboard Shortcuts Reference

*Complete keyboard shortcuts for all Claude interfaces*

---

## Table of Contents

1. [Claude Code CLI](#claude-code-cli)
2. [Claude Desktop](#claude-desktop)
3. [Claude.ai Web Interface](#claudeai-web-interface)
4. [Text Editor Integration](#text-editor-integration)
5. [Browser Extensions](#browser-extensions)
6. [Platform-Specific Shortcuts](#platform-specific-shortcuts)

---

## Claude Code CLI

### Interactive Mode

#### Navigation & Editing

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+A` | Beginning of Line | Move cursor to start |
| `Ctrl+E` | End of Line | Move cursor to end |
| `Ctrl+B` | Backward | Move cursor left |
| `Ctrl+F` | Forward | Move cursor right |
| `Alt+B` | Backward Word | Move one word left |
| `Alt+F` | Forward Word | Move one word right |
| `Up Arrow` | Previous Command | Navigate history up |
| `Down Arrow` | Next Command | Navigate history down |

#### Text Manipulation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+K` | Kill Line | Delete from cursor to end |
| `Ctrl+U` | Kill Line Backward | Delete from cursor to start |
| `Ctrl+W` | Kill Word Backward | Delete word before cursor |
| `Alt+D` | Kill Word Forward | Delete word after cursor |
| `Ctrl+Y` | Yank | Paste last killed text |
| `Ctrl+T` | Transpose Chars | Swap current and previous char |
| `Alt+T` | Transpose Words | Swap current and previous word |

#### Command Control

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+C` | Cancel | Interrupt current operation |
| `Ctrl+D` | Exit | Exit interactive mode (or EOF) |
| `Ctrl+Z` | Suspend | Suspend to background |
| `Ctrl+L` | Clear Screen | Clear terminal display |
| `Ctrl+R` | Reverse Search | Search command history |
| `Ctrl+S` | Forward Search | Forward search history |
| `Ctrl+G` | Abort | Abort current edit |

#### Special Commands

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Tab` | Autocomplete | Complete command/path |
| `Tab Tab` | List Completions | Show all completions |
| `Esc` | Cancel Input | Cancel current input |
| `!!` | Repeat Last | Repeat last command |
| `!$` | Last Argument | Use last argument |

### Command Mode

| Shortcut | Action | Description |
|----------|--------|-------------|
| `q` | Quit | Exit viewer/pager |
| `/` | Search | Search forward |
| `?` | Search Backward | Search backward |
| `n` | Next Match | Next search result |
| `N` | Previous Match | Previous search result |
| `g` | Go to Top | Jump to beginning |
| `G` | Go to Bottom | Jump to end |
| `Space` | Page Down | Scroll down one page |
| `b` | Page Up | Scroll up one page |

---

## Claude Desktop

### macOS Shortcuts

#### Application Control

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+N` | New Chat | Start new conversation |
| `Cmd+Shift+N` | New Project | Create new project |
| `Cmd+O` | Open | Open conversation/project |
| `Cmd+W` | Close Tab | Close current tab |
| `Cmd+Q` | Quit | Quit application |
| `Cmd+,` | Preferences | Open settings |
| `Cmd+H` | Hide | Hide application |
| `Cmd+M` | Minimize | Minimize window |

#### Conversation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+Return` | Send Message | Send current message |
| `Shift+Return` | New Line | Add line break in message |
| `Cmd+K` | Clear Context | Clear conversation |
| `Cmd+R` | Regenerate | Regenerate last response |
| `Cmd+E` | Edit Message | Edit last message |
| `Cmd+D` | Delete Message | Delete selected message |
| `Cmd+/` | Show Commands | Show command palette |

#### Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+[` | Back | Navigate back |
| `Cmd+]` | Forward | Navigate forward |
| `Cmd+{` | Previous Tab | Switch to previous tab |
| `Cmd+}` | Next Tab | Switch to next tab |
| `Cmd+1-9` | Tab Number | Jump to tab N |
| `Cmd+B` | Toggle Sidebar | Show/hide sidebar |
| `Cmd+Shift+F` | Find | Search in conversation |

#### Editing

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+C` | Copy | Copy selected text |
| `Cmd+V` | Paste | Paste from clipboard |
| `Cmd+X` | Cut | Cut selected text |
| `Cmd+A` | Select All | Select all text |
| `Cmd+Z` | Undo | Undo last action |
| `Cmd+Shift+Z` | Redo | Redo last undone action |
| `Cmd+F` | Find | Find in current view |

#### File Operations

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+Shift+U` | Upload File | Upload file to chat |
| `Cmd+S` | Save | Save conversation |
| `Cmd+Shift+S` | Save As | Save with new name |
| `Cmd+P` | Print | Print conversation |
| `Cmd+Shift+E` | Export | Export conversation |

### Windows/Linux Shortcuts

#### Application Control

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+N` | New Chat | Start new conversation |
| `Ctrl+Shift+N` | New Project | Create new project |
| `Ctrl+O` | Open | Open conversation/project |
| `Ctrl+W` | Close Tab | Close current tab |
| `Alt+F4` | Quit | Quit application |
| `Ctrl+,` | Preferences | Open settings |
| `Alt+F` | File Menu | Open file menu |

#### Conversation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Return` | Send Message | Send current message |
| `Shift+Return` | New Line | Add line break |
| `Ctrl+K` | Clear Context | Clear conversation |
| `Ctrl+R` | Regenerate | Regenerate response |
| `Ctrl+E` | Edit Message | Edit last message |
| `Ctrl+D` | Delete Message | Delete message |
| `Ctrl+/` | Commands | Command palette |

#### Navigation

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Alt+Left` | Back | Navigate back |
| `Alt+Right` | Forward | Navigate forward |
| `Ctrl+Tab` | Next Tab | Switch to next tab |
| `Ctrl+Shift+Tab` | Previous Tab | Switch to previous tab |
| `Ctrl+1-9` | Tab Number | Jump to tab N |
| `Ctrl+B` | Toggle Sidebar | Show/hide sidebar |
| `Ctrl+Shift+F` | Find | Search in conversation |

#### Editing

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+C` | Copy | Copy selected text |
| `Ctrl+V` | Paste | Paste from clipboard |
| `Ctrl+X` | Cut | Cut selected text |
| `Ctrl+A` | Select All | Select all text |
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Y` | Redo | Redo last undone action |
| `Ctrl+F` | Find | Find in current view |

---

## Claude.ai Web Interface

### Universal Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+Return` | Send | Send message |
| `Shift+Return` | New Line | Add line break |
| `Ctrl/Cmd+K` | Clear | Clear conversation |
| `Ctrl/Cmd+/` | Commands | Show shortcuts |
| `Esc` | Cancel | Cancel current action |
| `?` | Help | Show help overlay |

### Message Control

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+R` | Regenerate | Regenerate response |
| `Ctrl/Cmd+E` | Edit | Edit last message |
| `Ctrl/Cmd+C` | Copy | Copy message/code |
| `Alt+Up` | Previous Message | Navigate to previous |
| `Alt+Down` | Next Message | Navigate to next |

### Code Blocks

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+Shift+C` | Copy Code | Copy code block |
| `Ctrl/Cmd+Shift+V` | Paste Code | Paste as code |
| `Alt+C` | Toggle Code | Toggle code formatting |

### Projects

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+P` | Projects | Open projects |
| `Ctrl/Cmd+Shift+P` | New Project | Create project |
| `Ctrl/Cmd+J` | Jump to Project | Quick switch |

### Accessibility

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Tab` | Next Element | Focus next element |
| `Shift+Tab` | Previous Element | Focus previous |
| `Space` | Activate | Activate focused item |
| `Return` | Submit | Submit form/action |
| `Esc` | Close | Close modal/dialog |

---

## Text Editor Integration

### VS Code

#### Claude Extension

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+Shift+A` | Ask Claude | Open Claude panel |
| `Ctrl/Cmd+Shift+C` | Code Review | Review selection |
| `Ctrl/Cmd+Shift+D` | Document | Generate docs |
| `Ctrl/Cmd+Shift+E` | Explain | Explain code |
| `Ctrl/Cmd+Shift+T` | Test | Generate tests |
| `Ctrl/Cmd+Shift+R` | Refactor | Refactor code |

#### Editor Integration

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Alt+A` | Ask About | Ask about selection |
| `Alt+E` | Explain | Explain selection |
| `Alt+F` | Fix | Fix selection |
| `Alt+I` | Implement | Implement TODO |
| `Alt+O` | Optimize | Optimize code |

### JetBrains IDEs

#### Claude Plugin

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd+Shift+L` | Claude Panel | Toggle Claude panel |
| `Ctrl/Cmd+Alt+A` | Ask | Ask Claude |
| `Ctrl/Cmd+Alt+C` | Context | Add to context |
| `Ctrl/Cmd+Alt+R` | Review | Code review |
| `Ctrl/Cmd+Alt+D` | Document | Generate docs |
| `Ctrl/Cmd+Alt+T` | Test | Generate tests |

### Vim/Neovim

#### Claude.vim Plugin

| Shortcut | Action | Description |
|----------|--------|-------------|
| `<Leader>ca` | Ask | Ask Claude |
| `<Leader>ce` | Explain | Explain code |
| `<Leader>cr` | Review | Code review |
| `<Leader>cd` | Document | Generate docs |
| `<Leader>ct` | Test | Generate tests |
| `<Leader>cf` | Fix | Fix code |
| `<Leader>cc` | Clear | Clear context |

### Emacs

#### Claude-mode

| Shortcut | Action | Description |
|----------|--------|-------------|
| `C-c c a` | Ask | Ask Claude |
| `C-c c e` | Explain | Explain code |
| `C-c c r` | Review | Code review |
| `C-c c d` | Document | Generate docs |
| `C-c c t` | Test | Generate tests |
| `C-c c f` | Fix | Fix code |

---

## Browser Extensions

### Chrome/Edge Extension

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Alt+Shift+C` | Open Claude | Open extension |
| `Alt+Shift+S` | Summarize | Summarize page |
| `Alt+Shift+E` | Explain | Explain selection |
| `Alt+Shift+T` | Translate | Translate text |
| `Alt+Shift+A` | Ask | Ask about page |

### Firefox Extension

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Shift+Space` | Open Claude | Open extension |
| `Ctrl+Alt+S` | Summarize | Summarize page |
| `Ctrl+Alt+E` | Explain | Explain selection |
| `Ctrl+Alt+T` | Translate | Translate text |

---

## Platform-Specific Shortcuts

### macOS Specific

#### System Integration

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+Space` | Spotlight + Claude | Quick search |
| `Cmd+Tab` | App Switcher | Switch to Claude |
| `F3` | Mission Control | Show all windows |
| `Cmd+` | Full Screen | Toggle full screen |
| `Cmd+Ctrl+F` | Maximize | Maximize window |

#### Text Editing (macOS)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Cmd+Delete` | Delete Line | Delete to line start |
| `Option+Delete` | Delete Word | Delete word backward |
| `Cmd+Up` | Document Start | Jump to start |
| `Cmd+Down` | Document End | Jump to end |
| `Option+Up` | Paragraph Up | Previous paragraph |
| `Option+Down` | Paragraph Down | Next paragraph |

### Windows Specific

#### System Integration

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Win+S` | Search + Claude | Windows search |
| `Alt+Tab` | App Switcher | Switch to Claude |
| `Win+D` | Desktop | Show desktop |
| `F11` | Full Screen | Toggle full screen |
| `Win+Up` | Maximize | Maximize window |

#### Text Editing (Windows)

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Home` | Document Start | Jump to start |
| `Ctrl+End` | Document End | Jump to end |
| `Ctrl+Backspace` | Delete Word | Delete word backward |
| `Ctrl+Delete` | Delete Word Fwd | Delete word forward |
| `Ctrl+Up` | Paragraph Up | Previous paragraph |
| `Ctrl+Down` | Paragraph Down | Next paragraph |

### Linux Specific

#### System Integration

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Super+S` | Search | System search |
| `Alt+Tab` | App Switcher | Switch applications |
| `F11` | Full Screen | Toggle full screen |
| `Super+Up` | Maximize | Maximize window |

---

## Custom Shortcuts

### Configuring Custom Shortcuts

#### Claude Desktop

1. Open Preferences (`Cmd/Ctrl+,`)
2. Navigate to Keyboard Shortcuts
3. Click on action to rebind
4. Press desired key combination
5. Save changes

#### Example Custom Shortcuts

```json
{
  "shortcuts": {
    "newChat": "Cmd+T",
    "send": "Cmd+Return",
    "regenerate": "Cmd+R",
    "clear": "Cmd+Shift+K",
    "export": "Cmd+E",
    "search": "Cmd+Shift+F"
  }
}
```

### CLI Shortcuts (.bashrc/.zshrc)

```bash
# Claude CLI shortcuts
alias c='claude'
alias cc='claude chat'
alias cf='claude file'
alias cg='claude generate'
alias cr='claude review'

# Quick commands
alias ask='claude ask'
alias explain='claude explain'
alias review='claude review'

# Functions
claude-file() {
  claude file process "$1" --output "${1}.analysis"
}

claude-review() {
  claude file review "$@" --format markdown
}
```

---

## Productivity Tips

### Multi-Key Sequences

#### Vim-Style Commands (where supported)

| Sequence | Action | Description |
|----------|--------|-------------|
| `g g` | Go to Top | Jump to beginning |
| `G G` | Go to Bottom | Jump to end |
| `d d` | Delete Line | Delete current line |
| `y y` | Yank Line | Copy current line |
| `c c` | Change Line | Change current line |

### Chord Shortcuts

#### Custom Chord Examples

```json
{
  "chords": {
    "Ctrl+K Ctrl+C": "copyCode",
    "Ctrl+K Ctrl+E": "explain",
    "Ctrl+K Ctrl+R": "review",
    "Ctrl+K Ctrl+D": "document",
    "Ctrl+K Ctrl+T": "test"
  }
}
```

---

## Accessibility Shortcuts

### Screen Reader Support

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Alt+R` | Read Message | Read current message |
| `Ctrl+Alt+N` | Next Message | Jump to next |
| `Ctrl+Alt+P` | Previous Message | Jump to previous |
| `Ctrl+Alt+H` | Read Header | Read message header |

### High Contrast Mode

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+Alt+H` | Toggle High Contrast | Toggle contrast mode |
| `Ctrl+=` | Zoom In | Increase text size |
| `Ctrl+-` | Zoom Out | Decrease text size |
| `Ctrl+0` | Reset Zoom | Reset to default size |

---

## Troubleshooting

### Shortcut Conflicts

#### Check for Conflicts

1. Test shortcut in Claude
2. Check system-wide shortcuts
3. Check application-specific shortcuts
4. Disable conflicting shortcuts

#### Common Conflicts

| Shortcut | Conflict With | Solution |
|----------|---------------|----------|
| `Ctrl+R` | Browser Reload | Use `Ctrl+Shift+R` |
| `Cmd+W` | Close Tab | Confirm before closing |
| `Ctrl+Q` | Quit | Use `Alt+F4` instead |
| `F5` | Refresh | Use `Ctrl+R` |

### Reset Shortcuts

#### Claude Desktop
```bash
# macOS
rm ~/Library/Application\ Support/Claude/shortcuts.json

# Windows
del %APPDATA%\Claude\shortcuts.json

# Linux
rm ~/.config/Claude/shortcuts.json
```

#### CLI
```bash
claude config reset shortcuts
```

---

## Quick Reference Card

### Most Used Shortcuts

| Action | macOS | Windows/Linux |
|--------|-------|---------------|
| **Send** | `Cmd+Return` | `Ctrl+Return` |
| **New Chat** | `Cmd+N` | `Ctrl+N` |
| **Clear** | `Cmd+K` | `Ctrl+K` |
| **Regenerate** | `Cmd+R` | `Ctrl+R` |
| **Copy** | `Cmd+C` | `Ctrl+C` |
| **Paste** | `Cmd+V` | `Ctrl+V` |
| **Find** | `Cmd+F` | `Ctrl+F` |
| **Settings** | `Cmd+,` | `Ctrl+,` |

---

## Related Resources

- **Command Reference**: CLI commands
- **Configuration Options**: Settings and customization
- **Quick Reference**: General cheat sheet
- **API Reference**: API documentation

---

*Last Updated: 2026-05-05*
*Version: 1.0*
