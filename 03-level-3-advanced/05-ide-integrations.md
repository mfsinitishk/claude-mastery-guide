# IDE Integrations

## Introduction

IDE integration brings Claude's capabilities directly into your development environment, enabling context-aware assistance without breaking your flow. This section covers setup and best practices for integrating Claude with VS Code, JetBrains IDEs, and other popular editors.

## VS Code Integration

### Claude Extension Setup

**Installation:**
```bash
# Method 1: VS Code Marketplace
code --install-extension anthropic.claude-vscode

# Method 2: Manual Installation
# Download .vsix from releases
code --install-extension claude-vscode-1.0.0.vsix
```

**Configuration:**
```json
// .vscode/settings.json
{
  "claude.apiKey": "${CLAUDE_API_KEY}",
  "claude.model": "claude-sonnet-4.5",
  "claude.maxTokens": 4096,
  "claude.temperature": 0.7,
  
  // MCP Integration
  "claude.mcp.enabled": true,
  "claude.mcp.configPath": "~/.claude/mcp-config.json",
  
  // Code Context
  "claude.context.includeOpenFiles": true,
  "claude.context.includeWorkspace": true,
  "claude.context.maxFiles": 10,
  
  // Inline Suggestions
  "claude.inlineSuggestions.enabled": true,
  "claude.inlineSuggestions.debounce": 500,
  
  // Code Actions
  "claude.codeActions.enabled": true,
  "claude.codeActions.quickFix": true,
  "claude.codeActions.refactor": true
}
```

### Features

#### 1. Inline Code Completion

**Basic Usage:**
```typescript
// Start typing, Claude suggests completions
function calculateTotalPrice(items, tax|  // <-- Trigger completion here

// Claude suggests:
function calculateTotalPrice(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const taxAmount = subtotal * taxRate;
  return subtotal + taxAmount;
}
```

**Advanced Context:**
```typescript
// Claude uses surrounding code for context
class ShoppingCart {
  private items: CartItem[] = [];
  
  addItem(item: CartItem) {
    this.items.push(item);
  }
  
  // Type comment for specific implementation
  // TODO: Calculate total with discount and tax
  calculateTotal|  // Claude generates context-aware method
}

// Claude generates:
calculateTotal(discountPercentage: number = 0, taxRate: number = 0.08): number {
  const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * (discountPercentage / 100);
  const discountedTotal = subtotal - discountAmount;
  const tax = discountedTotal * taxRate;
  return discountedTotal + tax;
}
```

#### 2. Code Actions and Quick Fixes

**Right-click Menu Integration:**
```
Selected Code:
  function processData(data) {
    return data.map(x => x * 2)
  }

Right-click > Claude Actions:
  - Add TypeScript types
  - Add error handling
  - Add JSDoc comments
  - Refactor for readability
  - Generate unit tests
  - Optimize performance
```

**Example: Add TypeScript Types:**
```typescript
// Before (Select function and trigger "Add TypeScript types")
function processData(data) {
  return data.map(x => x * 2)
}

// After
function processData(data: number[]): number[] {
  return data.map((x: number) => x * 2)
}
```

**Example: Add Error Handling:**
```typescript
// Before
function processData(data) {
  return data.map(x => x * 2)
}

// After
function processData(data: number[]): number[] {
  if (!Array.isArray(data)) {
    throw new TypeError('Expected data to be an array');
  }
  
  if (data.some(x => typeof x !== 'number')) {
    throw new TypeError('All elements must be numbers');
  }
  
  return data.map(x => x * 2);
}
```

#### 3. Chat Interface

**Sidebar Chat:**
```
Chat Panel:
┌─────────────────────────────────────────┐
│ Claude                              [x] │
├─────────────────────────────────────────┤
│ You: Explain the CartService class     │
│                                         │
│ Claude: The CartService class manages  │
│ shopping cart operations. It provides: │
│                                         │
│ 1. addItem() - Adds items to cart      │
│ 2. removeItem() - Removes by ID        │
│ 3. calculateTotal() - Computes total   │
│                                         │
│ Current context: 3 files open          │
│ - cart.service.ts                       │
│ - cart.model.ts                         │
│ - cart.controller.ts                    │
│                                         │
│ [Attach file] [Attach selection]       │
│                                         │
│ You: ____________________________       │
└─────────────────────────────────────────┘
```

**Context Attachment:**
```typescript
// Select code and click "Add to Claude context"
class UserService {
  async getUser(id: string): Promise<User> {
    return this.db.users.findOne({ id });
  }
}

// Then ask in chat:
// "Create a similar service for Products"
// Claude generates with matching patterns:

class ProductService {
  async getProduct(id: string): Promise<Product> {
    return this.db.products.findOne({ id });
  }
  
  async listProducts(filters?: ProductFilters): Promise<Product[]> {
    return this.db.products.find(filters || {});
  }
}
```

#### 4. Testing Integration

**Generate Tests:**
```typescript
// Right-click on function > Generate Tests

// Original function
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Generated test file: validateEmail.test.ts
import { validateEmail } from './validation';

describe('validateEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co.uk')).toBe(true);
  });
  
  it('returns false for invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });
  
  it('handles edge cases', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
  });
});
```

#### 5. Documentation Generation

**Generate JSDoc:**
```typescript
// Before (select function and trigger "Add Documentation")
function calculateShippingCost(items, destination, priority) {
  const baseRate = getBaseRate(destination);
  const weight = items.reduce((sum, item) => sum + item.weight, 0);
  const multiplier = priority ? 1.5 : 1.0;
  return baseRate * weight * multiplier;
}

// After
/**
 * Calculates the shipping cost for a set of items
 * 
 * @param {Array<{weight: number}>} items - Array of items with weight property
 * @param {string} destination - Shipping destination code (e.g., 'US', 'UK')
 * @param {boolean} priority - Whether to use priority shipping
 * @returns {number} Total shipping cost in dollars
 * 
 * @example
 * const cost = calculateShippingCost(
 *   [{weight: 2.5}, {weight: 1.0}],
 *   'US',
 *   true
 * );
 * // Returns: 52.5 (assuming US base rate of 10)
 */
function calculateShippingCost(items, destination, priority) {
  const baseRate = getBaseRate(destination);
  const weight = items.reduce((sum, item) => sum + item.weight, 0);
  const multiplier = priority ? 1.5 : 1.0;
  return baseRate * weight * multiplier;
}
```

### Custom Workflows

**Snippet Integration:**
```json
// .vscode/claude-snippets.json
{
  "Claude React Component": {
    "prefix": "claude-component",
    "body": [
      "// Ask Claude to generate a React component",
      "// Component name: $1",
      "// Props: $2",
      "// Description: $3"
    ],
    "description": "Generate React component with Claude"
  }
}
```

**Task Provider:**
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude: Review Changed Files",
      "type": "shell",
      "command": "claude",
      "args": [
        "review",
        "--files",
        "${command:git.getChangedFiles}",
        "--output",
        "review.md"
      ],
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Claude: Generate API Documentation",
      "type": "shell",
      "command": "claude",
      "args": [
        "document-api",
        "--openapi",
        "api/swagger.yml",
        "--output",
        "docs/api.md"
      ]
    }
  ]
}
```

## JetBrains IDEs Integration

### Setup (IntelliJ IDEA, WebStorm, PyCharm, etc.)

**Plugin Installation:**
```
File > Settings > Plugins
Search: "Claude AI Assistant"
Install > Restart IDE
```

**Configuration:**
```xml
<!-- .idea/claude-config.xml -->
<component name="ClaudeConfiguration">
  <option name="apiKey" value="$CLAUDE_API_KEY$" />
  <option name="model" value="claude-sonnet-4.5" />
  <option name="maxTokens" value="4096" />
  
  <mcpIntegration enabled="true">
    <configPath>~/.claude/mcp-config.json</configPath>
  </mcpIntegration>
  
  <contextOptions>
    <includeProjectStructure>true</includeProjectStructure>
    <includeGradleConfig>true</includeGradleConfig>
    <includeMavenConfig>true</includeMavenConfig>
  </contextOptions>
</component>
```

### Features

#### 1. Intentions and Quick Fixes

**Alt+Enter Actions:**
```java
// Place cursor on method, press Alt+Enter

public void processOrder(Order order) {
    // Implementation
}

// Available Claude intentions:
// - Generate implementation
// - Add JavaDoc
// - Add parameter validation
// - Generate unit tests
// - Extract to service
// - Add logging
// - Add error handling
```

**Example: Add Parameter Validation:**
```java
// Before
public void processOrder(Order order) {
    this.repository.save(order);
}

// After (Alt+Enter > Add parameter validation)
public void processOrder(Order order) {
    Objects.requireNonNull(order, "order must not be null");
    
    if (order.getItems().isEmpty()) {
        throw new IllegalArgumentException("Order must contain at least one item");
    }
    
    if (order.getTotal() <= 0) {
        throw new IllegalArgumentException("Order total must be positive");
    }
    
    this.repository.save(order);
}
```

#### 2. Code Generation

**Generate Menu Integration:**
```
Alt+Insert (Generate menu)

Available generators:
- Constructor with Claude suggestions
- Getters/Setters with validation
- equals/hashCode with all fields
- toString with formatting
- Builder pattern
- Factory method
- Test class with comprehensive cases
```

**Example: Generate Builder:**
```java
// Original class
public class User {
    private String id;
    private String email;
    private String name;
    private Set<Role> roles;
}

// Alt+Insert > Generate > Builder (Claude)
public class User {
    private String id;
    private String email;
    private String name;
    private Set<Role> roles;
    
    private User(Builder builder) {
        this.id = builder.id;
        this.email = builder.email;
        this.name = builder.name;
        this.roles = Collections.unmodifiableSet(new HashSet<>(builder.roles));
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String id;
        private String email;
        private String name;
        private Set<Role> roles = new HashSet<>();
        
        public Builder id(String id) {
            this.id = id;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder addRole(Role role) {
            this.roles.add(role);
            return this;
        }
        
        public Builder roles(Set<Role> roles) {
            this.roles = new HashSet<>(roles);
            return this;
        }
        
        public User build() {
            if (id == null || id.isBlank()) {
                throw new IllegalStateException("id is required");
            }
            if (email == null || email.isBlank()) {
                throw new IllegalStateException("email is required");
            }
            return new User(this);
        }
    }
}
```

#### 3. Refactoring Assistant

**Refactor Menu Integration:**
```
Ctrl+Alt+Shift+T (Refactor This)

Claude-powered refactorings:
- Extract Method (intelligent naming)
- Introduce Variable (semantic names)
- Inline (preserve semantics)
- Change Signature (update all usages)
- Move Members (suggest better location)
- Extract Interface (identify contracts)
- Replace Conditional with Polymorphism
```

**Example: Extract Method:**
```java
// Before (select code block)
public OrderTotal calculateTotal(Order order) {
    double subtotal = 0;
    for (OrderItem item : order.getItems()) {
        subtotal += item.getPrice() * item.getQuantity();
    }
    
    double discount = 0;
    if (order.hasDiscountCode()) {
        discount = subtotal * order.getDiscountPercentage();
    }
    
    double tax = (subtotal - discount) * order.getTaxRate();
    
    return new OrderTotal(subtotal, discount, tax);
}

// After (Refactor > Extract Method > Claude suggests)
public OrderTotal calculateTotal(Order order) {
    double subtotal = calculateSubtotal(order);
    double discount = calculateDiscount(order, subtotal);
    double tax = calculateTax(order, subtotal, discount);
    
    return new OrderTotal(subtotal, discount, tax);
}

private double calculateSubtotal(Order order) {
    return order.getItems().stream()
        .mapToDouble(item -> item.getPrice() * item.getQuantity())
        .sum();
}

private double calculateDiscount(Order order, double subtotal) {
    return order.hasDiscountCode() 
        ? subtotal * order.getDiscountPercentage() 
        : 0;
}

private double calculateTax(Order order, double subtotal, double discount) {
    return (subtotal - discount) * order.getTaxRate();
}
```

#### 4. Testing Tools

**Create Test:**
```java
// Right-click class > Create Test (Claude)

// Original class
public class EmailValidator {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    public boolean isValid(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}

// Generated: EmailValidatorTest.java
class EmailValidatorTest {
    private EmailValidator validator;
    
    @BeforeEach
    void setUp() {
        validator = new EmailValidator();
    }
    
    @Nested
    @DisplayName("Valid email tests")
    class ValidEmailTests {
        @ParameterizedTest
        @ValueSource(strings = {
            "user@example.com",
            "test.user@domain.co.uk",
            "admin+tag@company.org"
        })
        void shouldAcceptValidEmails(String email) {
            assertTrue(validator.isValid(email));
        }
    }
    
    @Nested
    @DisplayName("Invalid email tests")
    class InvalidEmailTests {
        @ParameterizedTest
        @ValueSource(strings = {
            "invalid",
            "@example.com",
            "user@",
            "user name@example.com"
        })
        void shouldRejectInvalidEmails(String email) {
            assertFalse(validator.isValid(email));
        }
        
        @Test
        void shouldRejectNullEmail() {
            assertFalse(validator.isValid(null));
        }
    }
}
```

### Project-Level Features

**Architecture Analysis:**
```
Tools > Claude > Analyze Project Architecture

Output:
┌─────────────────────────────────────────────────┐
│ Project Architecture Analysis                   │
├─────────────────────────────────────────────────┤
│ Layers Detected:                                │
│ - Presentation (controllers)                    │
│ - Business Logic (services)                     │
│ - Data Access (repositories)                    │
│                                                  │
│ Issues:                                          │
│ 1. Controller directly accessing Repository     │
│    (bypasses service layer)                      │
│    Files: OrderController.java:45               │
│                                                  │
│ 2. Circular dependency detected                 │
│    UserService <-> NotificationService          │
│                                                  │
│ Recommendations:                                 │
│ 1. Enforce layered architecture                 │
│ 2. Introduce events to break circular deps      │
│ 3. Add architectural tests                      │
└─────────────────────────────────────────────────┘
```

## Vim/Neovim Integration

### Setup with CoC (Conquer of Completion)

**Installation:**
```vim
" In ~/.vimrc or ~/.config/nvim/init.vim

" Install coc.nvim
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" Install Claude extension
:CocInstall coc-claude
```

**Configuration:**
```json
// ~/.config/nvim/coc-settings.json
{
  "claude.enable": true,
  "claude.apiKey": "${CLAUDE_API_KEY}",
  "claude.model": "claude-sonnet-4.5",
  
  "claude.keybindings": {
    "explain": "<leader>ce",
    "refactor": "<leader>cr",
    "document": "<leader>cd",
    "test": "<leader>ct"
  },
  
  "claude.mcp": {
    "enabled": true,
    "configPath": "~/.claude/mcp-config.json"
  }
}
```

**Key Bindings:**
```vim
" Custom Claude bindings
nnoremap <leader>ce :CocCommand claude.explain<CR>
nnoremap <leader>cr :CocCommand claude.refactor<CR>
nnoremap <leader>cd :CocCommand claude.document<CR>
nnoremap <leader>ct :CocCommand claude.generateTest<CR>

" Visual mode: explain selection
vnoremap <leader>ce :<C-u>CocCommand claude.explainSelection<CR>
```

## Sublime Text Integration

### Setup

**Package Installation:**
```
Ctrl+Shift+P > Install Package > Claude AI
```

**Configuration:**
```json
// Preferences > Package Settings > Claude > Settings
{
  "api_key": "${CLAUDE_API_KEY}",
  "model": "claude-sonnet-4.5",
  "max_tokens": 4096,
  
  "features": {
    "inline_completion": true,
    "code_actions": true,
    "documentation": true
  },
  
  "keybindings": {
    "explain_code": ["ctrl+alt+e"],
    "refactor": ["ctrl+alt+r"],
    "generate_test": ["ctrl+alt+t"]
  }
}
```

## Best Practices

### 1. Context Management

**Optimize Context Size:**
```json
{
  "claude.context": {
    "maxFiles": 10,
    "excludePatterns": [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.min.js",
      "**/coverage/**"
    ],
    "prioritize": [
      "*.ts",
      "*.tsx",
      "*.js",
      "*.jsx"
    ]
  }
}
```

### 2. Performance

**Debounce Settings:**
```json
{
  "claude.inlineSuggestions": {
    "debounce": 500,  // Wait 500ms after typing stops
    "minChars": 3,     // Require 3 chars before suggesting
    "cache": true      // Cache recent suggestions
  }
}
```

### 3. Security

**API Key Management:**
```bash
# Don't commit API keys
echo "CLAUDE_API_KEY=your-key" >> ~/.env

# Reference in IDE config
"claude.apiKey": "${CLAUDE_API_KEY}"
```

**Code Scanning:**
```json
{
  "claude.security": {
    "scanBeforeSend": true,
    "excludePatterns": [
      "*.key",
      "*.pem",
      "*secret*",
      "*password*"
    ]
  }
}
```

### 4. Team Settings

**Shared Configuration:**
```json
// .vscode/settings.json (committed to repo)
{
  "claude.model": "claude-sonnet-4.5",
  "claude.codeStyle": "team-standards",
  "claude.lint": {
    "eslintConfig": ".eslintrc.json",
    "prettierConfig": ".prettierrc"
  }
}
```

**User-Specific:**
```json
// .vscode/settings.local.json (gitignored)
{
  "claude.apiKey": "${CLAUDE_API_KEY}"
}
```

## Troubleshooting

### Issue: Slow Completions

**Solution:**
```json
{
  "claude.performance": {
    "debounce": 800,
    "cache": {
      "enabled": true,
      "ttl": 300
    },
    "parallel": {
      "maxRequests": 3
    }
  }
}
```

### Issue: Context Too Large

**Solution:**
```json
{
  "claude.context": {
    "smart": true,  // Auto-select relevant files
    "maxTokens": 50000,
    "summarize": true  // Summarize large files
  }
}
```

### Issue: Conflicts with Other Extensions

**Solution:**
```json
{
  "claude.compatibility": {
    "copilot": {
      "enabled": true,
      "priority": "claude"  // or "copilot"
    },
    "tabnine": {
      "enabled": false
    }
  }
}
```

## Next Steps

You now have Claude integrated into your IDE for seamless AI assistance. In the next section, **Parallel Execution**, you'll learn:

- Running multiple AI tasks simultaneously
- Coordinating parallel workflows
- Optimizing for throughput
- Managing resource constraints

This will enable you to maximize productivity by parallelizing independent AI operations.
