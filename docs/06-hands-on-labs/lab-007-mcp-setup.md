# Lab 007: MCP Server Setup

## Learning Objectives

By the end of this lab, you will be able to:
- Understand Model Context Protocol (MCP) architecture
- Set up and configure MCP servers
- Integrate MCP servers with Claude Desktop
- Create custom MCP tools for your workflow
- Debug MCP server connections
- Use MCP for database access, file operations, and APIs

## Prerequisites

- Completion of Lab 001
- Claude Desktop installed
- Node.js 18+ or Python 3.10+
- Basic understanding of client-server architecture
- 45-60 minutes to complete the lab

## Setup

```bash
# Create lab directory
mkdir claude-lab-007-mcp
cd claude-lab-007-mcp

# Install MCP SDK
npm install @modelcontextprotocol/sdk

# Or for Python
pip install mcp
```

## Exercise 1: Understanding MCP Architecture (10 minutes)

### Objective
Understand how MCP works and its components.

### Instructions

**Step 1: Learn MCP Concepts**

Ask Claude:
```
Explain the Model Context Protocol (MCP) architecture:

1. What problem does MCP solve?
2. What are the main components (client, server, transport)?
3. How does Claude Desktop use MCP?
4. What are the key capabilities (tools, resources, prompts)?
5. When should I use MCP vs direct API calls?

Provide examples and diagrams where helpful.
```

**Step 2: Explore Available MCP Servers**

```
List and describe popular MCP servers:

Categories:
- Filesystem operations
- Database access
- API integrations
- Development tools
- Cloud services

For each, describe:
- Purpose
- Key capabilities
- Setup complexity
- Use cases
```

**Validation Checkpoint**:
- [ ] Understand MCP client-server model
- [ ] Know different transport mechanisms
- [ ] Understand tools vs resources vs prompts
- [ ] Can identify good MCP use cases

### Solution

MCP enables Claude to:
- Access external systems securely
- Read files and databases
- Execute commands safely
- Integrate with APIs
- Extend capabilities dynamically

### Key Takeaways
- MCP provides structured, secure context access
- Servers run separately from Claude
- Transport can be stdio, HTTP, or SSE
- Tools are functions Claude can call
- Resources provide static or dynamic data

## Exercise 2: Set Up First MCP Server (15 minutes)

### Objective
Configure and use the filesystem MCP server.

### Instructions

**Step 1: Install Filesystem Server**

```bash
# Using npx (no installation needed)
npx @modelcontextprotocol/server-filesystem
```

**Step 2: Configure Claude Desktop**

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourusername/projects"
      ]
    }
  }
}
```

**Step 3: Restart Claude Desktop**

Restart Claude Desktop to load the MCP server.

**Step 4: Test Filesystem Access**

In Claude Desktop:
```
List all Python files in my projects directory.
```

**Step 5: Advanced Filesystem Operations**

```
Using the filesystem MCP server:

1. Create a directory structure for a new project
2. Read the contents of package.json files
3. Search for TODO comments across all files
4. Create a summary of file types and counts

Show me what tools are available and how to use them.
```

**Validation Checkpoint**:
- [ ] MCP server configured in Claude Desktop
- [ ] Can read files through MCP
- [ ] Can list directories
- [ ] Can search file contents
- [ ] Understand permission model

### Solution

Filesystem MCP provides safe file access:
- Read files
- List directories
- Search contents
- Scoped to allowed paths
- Cannot write (read-only for safety)

### Key Takeaways
- MCP servers must be configured in Claude Desktop
- Servers have specific permissions/scopes
- Restart required after config changes
- Test with simple operations first
- Check MCP logs if issues occur

## Exercise 3: Database MCP Server (15 minutes)

### Objective
Set up database access through MCP.

### Instructions

**Step 1: Set Up SQLite MCP Server**

```bash
# Install SQLite MCP server
npm install -g @modelcontextprotocol/server-sqlite
```

**Step 2: Create Test Database**

```bash
# Create a test database
sqlite3 test.db <<EOF
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('Alice Smith', 'alice@example.com'),
  ('Bob Jones', 'bob@example.com'),
  ('Carol White', 'carol@example.com');

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  total DECIMAL(10,2),
  status TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO orders (user_id, total, status) VALUES
  (1, 99.99, 'completed'),
  (1, 149.99, 'pending'),
  (2, 49.99, 'completed');
EOF
```

**Step 3: Configure Database MCP**

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourusername/projects"]
    },
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/test.db"]
    }
  }
}
```

**Step 4: Query Database Through MCP**

In Claude Desktop:
```
Using the SQLite MCP server:

1. Show me the schema of all tables
2. List all users and their total order value
3. Find users with pending orders
4. Analyze the data and suggest insights

Use the database tools available through MCP.
```

**Step 5: Safe Query Practices**

```
Create safe database queries for these tasks:

1. User report: name, email, order count, total spent
2. Order status summary by user
3. Find inactive users (no orders)

Ensure queries:
- Use proper JOINs
- Handle NULL values
- Format results clearly
- Include appropriate aggregations

Explain each query's purpose and results.
```

**Validation Checkpoint**:
- [ ] Database MCP server configured
- [ ] Can query tables
- [ ] Can perform JOINs
- [ ] Results formatted clearly
- [ ] Understand read-only access

### Solution

Database MCP enables:
- Safe, read-only database access
- Schema inspection
- Complex queries with JOINs
- Data analysis
- No write access (security)

### Key Takeaways
- Database MCP is read-only for safety
- Can work with SQLite, PostgreSQL, MySQL
- Supports complex SQL queries
- Schema introspection available
- Great for data analysis

## Exercise 4: Custom MCP Server (15 minutes)

### Objective
Create a simple custom MCP server with tools.

### Instructions

**Step 1: Create Custom Server**

Create `custom-mcp-server.js`:

```javascript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";

// Custom MCP server with weather and calculator tools
class CustomMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: "custom-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_weather",
          description: "Get current weather for a city",
          inputSchema: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "City name",
              },
            },
            required: ["city"],
          },
        },
        {
          name: "calculate",
          description: "Perform mathematical calculations",
          inputSchema: {
            type: "object",
            properties: {
              expression: {
                type: "string",
                description: "Mathematical expression (e.g., '2 + 2')",
              },
            },
            required: ["expression"],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case "get_weather":
          return await this.getWeather(args.city);
        
        case "calculate":
          return await this.calculate(args.expression);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async getWeather(city) {
    try {
      // Using a free weather API (example)
      const response = await axios.get(
        `https://wttr.in/${encodeURIComponent(city)}?format=j1`
      );
      
      const data = response.data;
      const current = data.current_condition[0];
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              city,
              temperature: `${current.temp_C}°C (${current.temp_F}°F)`,
              condition: current.weatherDesc[0].value,
              humidity: `${current.humidity}%`,
              windSpeed: `${current.windspeedKmph} km/h`,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error fetching weather: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async calculate(expression) {
    try {
      // Safe eval alternative: use Function constructor with limited scope
      const allowed = /^[\d\s+\-*/.()]+$/;
      if (!allowed.test(expression)) {
        throw new Error("Invalid expression - only numbers and operators allowed");
      }
      
      const result = Function(`"use strict"; return (${expression})`)();
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              expression,
              result,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Custom MCP Server running on stdio");
  }
}

const server = new CustomMCPServer();
server.run().catch(console.error);
```

**Step 2: Make Executable and Configure**

```bash
chmod +x custom-mcp-server.js
```

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["/path/to/custom-mcp-server.js"]
    }
  }
}
```

**Step 3: Test Custom Tools**

In Claude Desktop:
```
Using the custom MCP tools:

1. Get the weather for San Francisco
2. Calculate: (42 * 7) + (100 / 5)
3. Get weather for multiple cities and compare
4. Perform a series of calculations

Show me what tools are available.
```

**Validation Checkpoint**:
- [ ] Custom MCP server running
- [ ] Tools listed in Claude
- [ ] Weather tool works
- [ ] Calculator tool works
- [ ] Error handling works

### Solution

Custom MCP server:
- Defines custom tools
- Handles tool execution
- Returns structured results
- Includes error handling
- Extends Claude's capabilities

### Key Takeaways
- MCP servers can provide any functionality
- Tools are defined with JSON schema
- Input validation is critical
- Error handling must be robust
- Servers run as separate processes

## Common Issues and Troubleshooting

### Issue 1: MCP Server Not Appearing

**Solution**:
```
Debug MCP server configuration:

1. Check config file syntax (valid JSON)
2. Verify command path is correct
3. Check server process can start independently
4. Review Claude Desktop logs: ~/Library/Logs/Claude/
5. Restart Claude Desktop
6. Test server with MCP inspector tool
```

### Issue 2: Permission Errors

**Solution**:
```
Fix permission issues:

1. Verify file paths are absolute
2. Check user has read/execute permissions
3. For filesystem: ensure path is within allowed scope
4. For database: verify file permissions
5. Check security settings (macOS may block unsigned executables)
```

### Issue 3: Server Crashes

**Solution**:
```
Diagnose server crashes:

1. Run server standalone to see error messages
2. Check for missing dependencies
3. Verify Node.js/Python version compatibility
4. Review error logs
5. Add logging to custom servers
6. Use try-catch for error handling
```

## Extensions for Advanced Learners

### Extension 1: Multi-Tool Server

Create MCP server with:
- File operations
- API calls
- Database queries
- System commands
- Data transformations

### Extension 2: MCP with Authentication

Build MCP server that:
- Connects to authenticated APIs
- Manages OAuth tokens
- Handles API rate limiting
- Caches responses

### Extension 3: MCP Server for Your Stack

Create domain-specific MCP:
- Your company's internal APIs
- Custom database schema exploration
- Deployment automation
- Monitoring and metrics access

## Summary

You've learned to:
- Understand MCP architecture
- Configure MCP servers in Claude Desktop
- Use filesystem and database MCP servers
- Create custom MCP servers
- Debug MCP configurations
- Extend Claude with domain-specific tools

## Next Steps

1. Set up MCP servers for your daily workflow
2. Create custom MCP server for your team's tools
3. Share MCP configurations with team
4. Proceed to Lab 008: Custom Tools

---

**Lab Completion**: You've completed Lab 007. You can now extend Claude's capabilities through MCP servers for your specific needs.
