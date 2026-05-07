# MCP Servers: Setup and Configuration

## Introduction

MCP servers are the bridge between Claude and your development ecosystem. This section provides comprehensive guidance on installing, configuring, and managing MCP servers for maximum effectiveness. You'll learn to compose multiple servers, troubleshoot issues, and optimize performance.

## Installation Methods

### Method 1: NPM-Based Servers

Most official MCP servers are published to npm and can be used directly with `npx`:

**Installation:**
```bash
# No installation needed - npx downloads on first use
# Configured in ~/.claude/mcp-config.json

# To pre-install for faster startup:
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-aws
```

**Configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}
```

**Pros:**
- No installation required
- Always uses latest version
- Simple configuration

**Cons:**
- Slower first startup
- Requires internet connection
- Less version control

### Method 2: Python-Based Servers

Python MCP servers use pip and virtual environments:

**Installation:**
```bash
# Create virtual environment for MCP servers
python3 -m venv ~/.claude/mcp-venv
source ~/.claude/mcp-venv/bin/activate

# Install servers
pip install mcp-server-datadog
pip install mcp-server-redis
pip install mcp-server-custom
```

**Configuration:**
```json
{
  "mcpServers": {
    "datadog": {
      "command": "/Users/yourname/.claude/mcp-venv/bin/python",
      "args": [
        "-m",
        "mcp_server_datadog"
      ],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}"
      }
    }
  }
}
```

**Pros:**
- Controlled versions
- Offline usage
- Faster startup

**Cons:**
- Manual installation required
- Must manage updates
- Path dependencies

### Method 3: Compiled Binary Servers

Go, Rust, and other compiled servers:

**Installation:**
```bash
# Download and install binary
curl -L https://github.com/org/mcp-server/releases/download/v1.0/mcp-server-linux -o ~/.claude/bin/mcp-server
chmod +x ~/.claude/bin/mcp-server

# Or build from source
git clone https://github.com/org/mcp-server
cd mcp-server
go build -o ~/.claude/bin/mcp-server
```

**Configuration:**
```json
{
  "mcpServers": {
    "custom": {
      "command": "/Users/yourname/.claude/bin/mcp-server",
      "args": [
        "--config",
        "/Users/yourname/.claude/custom-config.yaml"
      ]
    }
  }
}
```

**Pros:**
- Excellent performance
- No runtime dependencies
- Compact deployment

**Cons:**
- Platform-specific binaries
- Manual update process
- Build complexity

## Common MCP Server Configurations

### PostgreSQL Server

**Basic Configuration:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "postgres-prod": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres"
      ],
      "env": {
        "DATABASE_URL": "${PROD_DATABASE_URL}",
        "PGSSL": "true",
        "PGSSLMODE": "require",
        "PGCONNECT_TIMEOUT": "10",
        "PGSTATEMENT_TIMEOUT": "30000",
        "MAX_ROWS": "1000",
        "ALLOWED_SCHEMAS": "public,analytics",
        "READONLY": "true"
      }
    }
  }
}
```

**Features Available:**
- `query(sql)` - Execute SQL queries
- `describe_table(table_name)` - Get table schema
- `list_tables()` - List all tables
- `explain_query(sql)` - Get query execution plan
- `table_stats(table_name)` - Get table statistics

**Usage Example:**
```
You: "Show me the schema for the users table"

Claude uses: postgres.describe_table("users")

Response:
Table: users
Columns:
- id: integer, primary key
- email: varchar(255), unique, not null
- created_at: timestamp, not null
- last_login: timestamp

Indexes:
- users_pkey on (id)
- users_email_idx on (email)
```

### GitHub Server

**Basic Configuration:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "github-org": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "GITHUB_OWNER": "your-org",
        "GITHUB_REPOS": "repo1,repo2,repo3",
        "CACHE_TTL": "300",
        "RATE_LIMIT_BUFFER": "100"
      }
    }
  }
}
```

**Features Available:**
- `get_file(repo, path, ref)` - Fetch file contents
- `search_code(query, repo)` - Search code
- `list_pull_requests(repo, state)` - List PRs
- `get_pull_request(repo, number)` - Get PR details
- `create_issue(repo, title, body)` - Create issue
- `update_pull_request(repo, number, updates)` - Update PR

**Usage Example:**
```
You: "Review PR #123 in the api-service repo"

Claude uses:
1. github.get_pull_request("api-service", 123)
2. github.get_file("api-service", "path/to/changed/file.js", "pr-branch")

Response: [Comprehensive review with context from PR description,
changed files, and related code]
```

### AWS Server

**Basic Configuration:**
```json
{
  "mcpServers": {
    "aws": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-aws"
      ],
      "env": {
        "AWS_REGION": "us-east-1",
        "AWS_PROFILE": "default"
      }
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "aws-prod": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-aws"
      ],
      "env": {
        "AWS_REGION": "us-east-1",
        "AWS_PROFILE": "production",
        "ENABLED_SERVICES": "ec2,rds,s3,lambda,cloudwatch",
        "READONLY_MODE": "true",
        "CACHE_DURATION": "60"
      }
    }
  }
}
```

**Features Available:**
- `list_instances()` - List EC2 instances
- `describe_instance(instance_id)` - Get instance details
- `get_cloudwatch_metrics(namespace, metric, dimensions)` - Fetch metrics
- `list_s3_buckets()` - List S3 buckets
- `get_lambda_function(name)` - Get Lambda details
- `describe_rds_instances()` - List RDS instances

### Datadog Server

**Basic Configuration:**
```json
{
  "mcpServers": {
    "datadog": {
      "command": "python",
      "args": [
        "-m",
        "mcp_server_datadog"
      ],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}",
        "DD_SITE": "datadoghq.com"
      }
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "datadog-monitoring": {
      "command": "/Users/yourname/.claude/mcp-venv/bin/python",
      "args": [
        "-m",
        "mcp_server_datadog"
      ],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}",
        "DD_SITE": "datadoghq.com",
        "DEFAULT_TIMEFRAME": "1h",
        "SERVICES": "checkout,payment,notification",
        "CACHE_METRICS": "true"
      }
    }
  }
}
```

**Features Available:**
- `query_metrics(query, from, to)` - Query metrics
- `get_service_health(service)` - Check service status
- `list_monitors()` - List active monitors
- `get_monitor(id)` - Get monitor details
- `search_logs(query, from, to)` - Search logs
- `get_trace(trace_id)` - Get distributed trace

### Kubernetes Server

**Basic Configuration:**
```json
{
  "mcpServers": {
    "kubernetes": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-kubernetes"
      ],
      "env": {
        "KUBECONFIG": "${HOME}/.kube/config",
        "CONTEXT": "production"
      }
    }
  }
}
```

**Advanced Configuration:**
```json
{
  "mcpServers": {
    "k8s-prod": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-kubernetes"
      ],
      "env": {
        "KUBECONFIG": "/Users/yourname/.kube/prod-config",
        "CONTEXT": "production-us-east",
        "NAMESPACE": "default,monitoring,ingress",
        "READONLY": "true",
        "TIMEOUT": "10s"
      }
    }
  }
}
```

**Features Available:**
- `list_pods(namespace)` - List pods
- `get_pod_logs(namespace, pod, container)` - Get logs
- `describe_pod(namespace, pod)` - Get pod details
- `list_deployments(namespace)` - List deployments
- `get_deployment(namespace, deployment)` - Get deployment
- `list_services(namespace)` - List services

## Composing Multiple MCP Servers

### Strategy 1: Layered Architecture

Organize servers by architectural layer:

```json
{
  "mcpServers": {
    // Data Layer
    "postgres-main": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${MAIN_DB_URL}"}
    },
    "redis-cache": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-redis"],
      "env": {"REDIS_URL": "${REDIS_URL}"}
    },
    
    // Application Layer
    "kubernetes": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-kubernetes"],
      "env": {"KUBECONFIG": "${KUBECONFIG}"}
    },
    
    // Monitoring Layer
    "datadog": {
      "command": "python",
      "args": ["-m", "mcp_server_datadog"],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}"
      }
    },
    
    // Source Control Layer
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {"GITHUB_TOKEN": "${GITHUB_TOKEN}"}
    }
  }
}
```

**Usage:**
```
You: "Why is the checkout service slow?"

Claude orchestrates:
1. datadog: Check service metrics
2. postgres-main: Analyze slow queries
3. redis-cache: Check cache hit rates
4. kubernetes: Review pod resource usage
5. github: Check recent changes to checkout service

Result: Root cause analysis across full stack
```

### Strategy 2: Environment-Based

Separate servers for different environments:

```json
{
  "mcpServers": {
    "postgres-dev": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${DEV_DATABASE_URL}"}
    },
    "postgres-staging": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${STAGING_DATABASE_URL}"}
    },
    "postgres-prod": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${PROD_DATABASE_URL}",
        "READONLY": "true"
      },
      "requiresExplicitPermission": true
    }
  }
}
```

### Strategy 3: Service-Based

Organize by microservice:

```json
{
  "mcpServers": {
    "checkout-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${CHECKOUT_DB_URL}"}
    },
    "checkout-monitoring": {
      "command": "python",
      "args": ["-m", "mcp_server_datadog"],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}",
        "SERVICE_FILTER": "checkout"
      }
    },
    "payment-db": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {"DATABASE_URL": "${PAYMENT_DB_URL}"}
    },
    "payment-monitoring": {
      "command": "python",
      "args": ["-m", "mcp_server_datadog"],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}",
        "SERVICE_FILTER": "payment"
      }
    }
  }
}
```

## Troubleshooting MCP Servers

### Common Issues and Solutions

#### Issue 1: Server Won't Start

**Symptoms:**
```
Error: MCP server 'postgres' failed to start
Exit code: 1
```

**Diagnosis:**
```bash
# Test server manually
npx @modelcontextprotocol/server-postgres

# Check environment variables
echo $DATABASE_URL

# Verify connectivity
psql $DATABASE_URL -c "SELECT 1"
```

**Solutions:**
- Verify command and args are correct
- Check environment variables are set
- Ensure network connectivity
- Verify credentials and permissions
- Check server logs for details

#### Issue 2: Slow MCP Responses

**Symptoms:**
- Long delays when Claude uses MCP tools
- Timeout errors

**Diagnosis:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "DEBUG": "true",  // Enable debug logging
        "LOG_QUERIES": "true"
      }
    }
  }
}
```

**Solutions:**
- Add connection pooling
- Implement caching
- Optimize queries
- Increase timeouts if appropriate
- Check network latency

#### Issue 3: Permission Denied

**Symptoms:**
```
Error: Permission denied when accessing resource
```

**Diagnosis:**
- Check MCP server has necessary credentials
- Verify database/API user permissions
- Review audit logs

**Solutions:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://readonly_user:pass@localhost/db",
        "ALLOWED_OPERATIONS": "SELECT,EXPLAIN"
      }
    }
  }
}
```

#### Issue 4: Rate Limiting

**Symptoms:**
```
Error: Rate limit exceeded (GitHub, Datadog, etc.)
```

**Solutions:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}",
        "RATE_LIMIT_BUFFER": "200",  // Keep buffer
        "CACHE_ENABLED": "true",     // Enable caching
        "CACHE_TTL": "300"            // 5 minute cache
      }
    }
  }
}
```

### Debugging Techniques

**Enable Debug Logging:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DEBUG": "*",
        "LOG_LEVEL": "debug",
        "LOG_FILE": "/tmp/mcp-postgres.log"
      }
    }
  }
}
```

**Test Server Independently:**
```bash
# Run server in standalone mode
DEBUG=* npx @modelcontextprotocol/server-postgres

# Send test request
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{"method":"list_tables","params":{}}'
```

**Monitor Resource Usage:**
```bash
# Check process memory/CPU
ps aux | grep mcp-server

# Monitor network connections
netstat -an | grep :5432

# Check file descriptors
lsof -p <mcp-server-pid>
```

## Performance Optimization

### Caching Strategies

**1. Result Caching:**
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "CACHE_ENABLED": "true",
        "CACHE_TTL": "300",
        "CACHE_MAX_SIZE": "100MB"
      }
    }
  }
}
```

**2. Connection Pooling:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "POOL_MIN": "2",
        "POOL_MAX": "10",
        "POOL_IDLE_TIMEOUT": "30000"
      }
    }
  }
}
```

**3. Batch Operations:**
```json
{
  "mcpServers": {
    "datadog": {
      "command": "python",
      "args": ["-m", "mcp_server_datadog"],
      "env": {
        "DD_API_KEY": "${DATADOG_API_KEY}",
        "DD_APP_KEY": "${DATADOG_APP_KEY}",
        "BATCH_METRICS": "true",
        "BATCH_SIZE": "50"
      }
    }
  }
}
```

### Resource Limits

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "MAX_QUERY_TIME": "30000",
        "MAX_ROWS": "10000",
        "MAX_MEMORY": "512MB"
      }
    }
  }
}
```

## Security Hardening

### Principle of Least Privilege

```json
{
  "mcpServers": {
    "postgres-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://ro_user:pass@localhost/db",
        "ALLOWED_OPERATIONS": "SELECT,EXPLAIN",
        "FORBIDDEN_SCHEMAS": "pg_catalog,information_schema",
        "MAX_ROWS": "1000"
      }
    }
  }
}
```

### Network Security

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "SSL_MODE": "require",
        "SSL_CERT": "${HOME}/.postgresql/postgresql.crt",
        "SSL_KEY": "${HOME}/.postgresql/postgresql.key",
        "SSL_ROOT_CERT": "${HOME}/.postgresql/root.crt"
      }
    }
  }
}
```

### Audit Logging

```json
{
  "mcpServers": {
    "postgres-audited": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}",
        "AUDIT_LOG": "true",
        "AUDIT_LOG_FILE": "/var/log/mcp/postgres-audit.jsonl",
        "LOG_QUERIES": "true",
        "LOG_RESULTS_SUMMARY": "true"
      }
    }
  }
}
```

## Best Practices

### 1. Configuration Management

**Use Environment-Specific Configs:**
```bash
# ~/.claude/mcp-config.dev.json
# ~/.claude/mcp-config.staging.json
# ~/.claude/mcp-config.prod.json

# Switch configs
ln -sf ~/.claude/mcp-config.dev.json ~/.claude/mcp-config.json
```

### 2. Secrets Management

**Never Hardcode Secrets:**
```json
{
  "mcpServers": {
    "postgres": {
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"  // ✓ Good
        // "DATABASE_URL": "postgresql://..." // ✗ Bad
      }
    }
  }
}
```

**Use Secret Manager:**
```bash
# Store in 1Password, Vault, etc.
export DATABASE_URL=$(op read "op://vault/db/url")
export GITHUB_TOKEN=$(op read "op://vault/github/token")
```

### 3. Version Pinning

**Pin Critical Servers:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres@1.2.3"  // Pinned version
      ]
    }
  }
}
```

### 4. Health Checks

**Implement Health Monitoring:**
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "HEALTH_CHECK_ENABLED": "true",
        "HEALTH_CHECK_INTERVAL": "60",
        "HEALTH_CHECK_QUERY": "SELECT 1"
      }
    }
  }
}
```

### 5. Documentation

**Document Your MCP Setup:**
```markdown
# MCP Configuration

## Servers

### postgres-prod
- Purpose: Production database access
- Permissions: Read-only
- Contact: dba-team@company.com

### datadog-monitoring
- Purpose: Production monitoring metrics
- Permissions: Read metrics, list monitors
- Contact: sre-team@company.com

## Environment Variables Required

- DATABASE_URL: PostgreSQL connection string
- DATADOG_API_KEY: Datadog API key
- DATADOG_APP_KEY: Datadog application key
```

## Next Steps

You now have comprehensive knowledge of MCP server configuration and management. In the next section, **Tool Integrations**, you'll learn:

- Integrating MCP with development tools
- Building workflows that combine multiple tools
- Custom tool development
- Advanced integration patterns

This will enable you to create seamless workflows that leverage Claude across your entire toolchain.
