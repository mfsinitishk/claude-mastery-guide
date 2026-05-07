# MCP Servers Directory and Catalog

## Overview
Model Context Protocol (MCP) servers enable Claude to interact with external tools, data sources, and services. This directory catalogs available MCP servers and integration patterns.

**Last Updated:** May 2026
**Total Servers:** 80+
**Categories:** 12+

---

## Table of Contents
- [What is MCP](#what-is-mcp)
- [Official MCP Servers](#official-mcp-servers)
- [Data Source Servers](#data-source-servers)
- [Development Tool Servers](#development-tool-servers)
- [Cloud Service Servers](#cloud-service-servers)
- [Database Servers](#database-servers)
- [API Integration Servers](#api-integration-servers)
- [File System Servers](#file-system-servers)
- [Custom MCP Servers](#custom-mcp-servers)
- [Enterprise Servers](#enterprise-servers)
- [Building Your Own MCP Server](#building-your-own-mcp-server)

---

## What is MCP

### Model Context Protocol Overview
**Purpose:** Standardized protocol for Claude to access external resources
**Architecture:** Client-server model with JSON-RPC communication
**Benefits:**
- Extensible tool integration
- Secure resource access
- Standardized interface
- Community ecosystem

### Key Concepts
| Concept | Description | Example |
|---------|-------------|---------|
| Resources | Data Claude can access | Files, databases, APIs |
| Tools | Actions Claude can perform | Search, create, update |
| Prompts | Predefined prompt templates | Common workflows |
| Sampling | Claude requests for next steps | Multi-turn interactions |

**Documentation:** [modelcontextprotocol.io](https://modelcontextprotocol.io)
**Specification:** [MCP Spec](https://spec.modelcontextprotocol.io)
**GitHub:** [MCP Repository](https://github.com/anthropics/mcp)

---

## Official MCP Servers

### Anthropic-Maintained Servers
| Server | Purpose | Language | Status | Repository |
|--------|---------|----------|--------|------------|
| filesystem | File operations | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/filesystem) |
| git | Git operations | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/git) |
| github | GitHub integration | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/github) |
| postgres | PostgreSQL access | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/postgres) |
| sqlite | SQLite access | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/sqlite) |
| slack | Slack integration | TypeScript | Beta | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/slack) |
| puppeteer | Browser automation | TypeScript | Stable | [GitHub](https://github.com/anthropics/mcp-servers/tree/main/src/puppeteer) |

**Installation:** npm install @modelcontextprotocol/server-{name}
**Configuration:** MCP settings.json
**Authentication:** API keys, OAuth tokens
**Support:** Community + official

### Reference Implementations
| Server | Purpose | Use Case | Complexity |
|--------|---------|----------|------------|
| memory | Persistent memory | Long-running conversations | Medium |
| fetch | HTTP requests | API integration | Low |
| brave-search | Web search | Information retrieval | Low |
| google-drive | Drive access | Document management | Medium |
| google-maps | Maps API | Location services | Medium |

**Documentation:** Inline + README files
**Examples:** Sample configurations provided
**Testing:** Unit tests included

---

## Data Source Servers

### Database Servers
| Database | Server | Features | Authentication | Link |
|----------|--------|----------|----------------|------|
| PostgreSQL | mcp-postgres | Query, schema, analytics | Connection string | [npm](https://npmjs.com) |
| MySQL | mcp-mysql | CRUD, transactions | Credentials | [npm](https://npmjs.com) |
| MongoDB | mcp-mongodb | Document operations | MongoDB URI | [npm](https://npmjs.com) |
| Redis | mcp-redis | Key-value ops, pub/sub | Redis URL | [npm](https://npmjs.com) |
| SQLite | mcp-sqlite | Local database | File path | [npm](https://npmjs.com) |
| Snowflake | mcp-snowflake | Data warehouse queries | Account + auth | [GitHub](https://github.com) |

**Features:**
- Read-only or read-write modes
- Schema introspection
- Query building assistance
- Result formatting

**Security:**
- Credential encryption
- Query validation
- Rate limiting
- Audit logging

### Cloud Storage
| Provider | Server | Operations | Authentication |
|----------|--------|------------|----------------|
| AWS S3 | mcp-s3 | List, read, write | AWS credentials |
| Google Drive | mcp-gdrive | Files, folders | OAuth 2.0 |
| Dropbox | mcp-dropbox | Sync, share | API token |
| OneDrive | mcp-onedrive | Office docs | Microsoft auth |
| Azure Blob | mcp-azure-blob | Container ops | Connection string |

**Capabilities:**
- File upload/download
- Metadata retrieval
- Search functionality
- Sharing management

### APIs & Services
| Service | Server | Endpoints | Rate Limits |
|---------|--------|-----------|-------------|
| REST APIs | mcp-rest | Custom endpoints | Configurable |
| GraphQL | mcp-graphql | Schema queries | Per-service |
| Stripe | mcp-stripe | Payments | API limits |
| Twilio | mcp-twilio | SMS, voice | Account limits |
| SendGrid | mcp-sendgrid | Email | Plan-based |

---

## Development Tool Servers

### Version Control
| Tool | Server | Features | Repository |
|------|--------|----------|------------|
| Git | mcp-git | Status, commit, push | [GitHub](https://github.com/anthropics/mcp-servers) |
| GitHub | mcp-github | Issues, PRs, repos | [GitHub](https://github.com/anthropics/mcp-servers) |
| GitLab | mcp-gitlab | CI/CD, merge requests | [npm](https://npmjs.com) |
| Bitbucket | mcp-bitbucket | Pipelines, repos | [npm](https://npmjs.com) |

**Operations:**
- Repository management
- Branch operations
- Code review
- CI/CD integration

**Permissions:**
- Read/write access control
- Organization scoping
- Token management

### CI/CD & DevOps
| Platform | Server | Capabilities | Link |
|----------|--------|--------------|------|
| Jenkins | mcp-jenkins | Build, deploy | [GitHub](https://github.com) |
| CircleCI | mcp-circleci | Pipeline management | [npm](https://npmjs.com) |
| GitHub Actions | mcp-gh-actions | Workflow automation | [GitHub](https://github.com) |
| Docker | mcp-docker | Container ops | [GitHub](https://github.com) |
| Kubernetes | mcp-k8s | Cluster management | [GitHub](https://github.com) |

**Use Cases:**
- Pipeline triggers
- Deployment status
- Log retrieval
- Resource management

### Issue Tracking
| Platform | Server | Features | Authentication |
|----------|--------|----------|----------------|
| Jira | mcp-jira | Issues, sprints | API token |
| Linear | mcp-linear | Issues, projects | API key |
| Asana | mcp-asana | Tasks, projects | OAuth/token |
| Trello | mcp-trello | Boards, cards | API key + token |

**Capabilities:**
- Issue CRUD operations
- Status updates
- Comment management
- Project tracking

---

## Cloud Service Servers

### AWS Services
| Service | Server | Operations | Authentication |
|---------|--------|------------|----------------|
| S3 | mcp-s3 | Bucket operations | IAM credentials |
| Lambda | mcp-lambda | Function invocation | IAM role |
| DynamoDB | mcp-dynamodb | Table operations | IAM credentials |
| CloudWatch | mcp-cloudwatch | Logs, metrics | IAM credentials |
| EC2 | mcp-ec2 | Instance management | IAM credentials |

**Setup:** AWS credentials configuration
**Regions:** Multi-region support
**Permissions:** IAM policy requirements

### Google Cloud
| Service | Server | Features | Link |
|---------|--------|----------|------|
| Cloud Storage | mcp-gcs | Bucket ops | [npm](https://npmjs.com) |
| BigQuery | mcp-bigquery | Data warehouse | [npm](https://npmjs.com) |
| Cloud Functions | mcp-gcf | Serverless | [npm](https://npmjs.com) |
| Firestore | mcp-firestore | NoSQL database | [npm](https://npmjs.com) |

**Authentication:** Service account JSON
**Quota:** Project quotas apply
**Pricing:** GCP pricing model

### Azure
| Service | Server | Capabilities | Authentication |
|---------|--------|--------------|----------------|
| Blob Storage | mcp-azure-blob | File storage | Connection string |
| Cosmos DB | mcp-cosmos | Multi-model DB | Key/token |
| Functions | mcp-azure-functions | Serverless | Function key |
| DevOps | mcp-azure-devops | Pipelines | PAT |

---

## Database Servers

### SQL Databases
| Database | Server | Query Language | Features |
|----------|--------|----------------|----------|
| PostgreSQL | mcp-postgres | SQL | JSONB, arrays, CTEs |
| MySQL | mcp-mysql | SQL | Full-text search |
| SQL Server | mcp-mssql | T-SQL | Stored procedures |
| Oracle | mcp-oracle | PL/SQL | Enterprise features |

**Safety Features:**
- Query validation
- Read-only mode option
- Transaction support
- Connection pooling

### NoSQL Databases
| Database | Server | Data Model | Query Pattern |
|----------|--------|------------|---------------|
| MongoDB | mcp-mongodb | Document | Aggregation pipeline |
| Cassandra | mcp-cassandra | Wide-column | CQL |
| DynamoDB | mcp-dynamodb | Key-value | Primary/sort keys |
| Redis | mcp-redis | Key-value | Commands |

**Optimization:**
- Index recommendations
- Query optimization
- Caching strategies

### Vector Databases
| Database | Server | Features | Link |
|----------|--------|----------|------|
| Pinecone | mcp-pinecone | Similarity search | [GitHub](https://github.com) |
| Weaviate | mcp-weaviate | Hybrid search | [GitHub](https://github.com) |
| Qdrant | mcp-qdrant | High performance | [GitHub](https://github.com) |
| Chroma | mcp-chroma | Embedded | [GitHub](https://github.com) |

**Use Cases:**
- Semantic search
- RAG applications
- Recommendation systems

---

## API Integration Servers

### Communication
| Service | Server | Features | Pricing |
|---------|--------|----------|---------|
| Slack | mcp-slack | Messages, channels | Free-Enterprise |
| Discord | mcp-discord | Server management | Free |
| Microsoft Teams | mcp-teams | Chat, meetings | Microsoft 365 |
| Zoom | mcp-zoom | Meetings, recordings | Free-Enterprise |

**Webhooks:** Event subscriptions
**Bots:** Bot user integration
**Permissions:** OAuth scopes

### CRM & Sales
| Platform | Server | Capabilities | Link |
|----------|--------|--------------|------|
| Salesforce | mcp-salesforce | Leads, opportunities | [npm](https://npmjs.com) |
| HubSpot | mcp-hubspot | Contacts, deals | [npm](https://npmjs.com) |
| Pipedrive | mcp-pipedrive | Pipeline management | [GitHub](https://github.com) |
| Zendesk | mcp-zendesk | Tickets, support | [npm](https://npmjs.com) |

**Integration:**
- Data sync
- Workflow automation
- Reporting

### Marketing & Analytics
| Tool | Server | Features | Authentication |
|------|--------|----------|----------------|
| Google Analytics | mcp-ga4 | Traffic, events | Service account |
| Mailchimp | mcp-mailchimp | Campaigns, lists | API key |
| Segment | mcp-segment | Event tracking | Write key |
| Amplitude | mcp-amplitude | Product analytics | API key |

---

## File System Servers

### Local File Operations
| Server | Operations | Security | Platform |
|--------|------------|----------|----------|
| filesystem | Read, write, list | Path restrictions | All |
| watch | File monitoring | Event-based | All |
| search | Content search | Indexed | All |

**Permissions:**
- Whitelist directories
- Read-only mode
- File type restrictions

### Document Processing
| Type | Server | Formats | Features |
|------|--------|---------|----------|
| PDF | mcp-pdf | PDF | Text extraction, metadata |
| Office | mcp-office | DOCX, XLSX | Content parsing |
| Markdown | mcp-markdown | MD | Rendering, TOC |
| Images | mcp-image | PNG, JPG | Metadata, OCR |

**Processing:**
- Batch operations
- Format conversion
- Content extraction

---

## Custom MCP Servers

### Server Templates
| Template | Language | Complexity | Use Case |
|----------|----------|------------|----------|
| Basic Server | TypeScript | Simple | Learning MCP |
| REST API Proxy | TypeScript | Medium | API integration |
| Database Connector | Python | Medium | Custom DB |
| Tool Server | Python | Advanced | Custom tools |

**Repository:** [MCP Templates](https://github.com/anthropics/mcp-templates)
**Documentation:** [Building MCP Servers](https://modelcontextprotocol.io/docs)

### Community Servers
| Server | Purpose | Language | Stars | Link |
|--------|---------|----------|-------|------|
| mcp-weather | Weather API | TypeScript | 340 | [GitHub](https://github.com) |
| mcp-news | News aggregation | Python | 280 | [GitHub](https://github.com) |
| mcp-calendar | Calendar integration | TypeScript | 420 | [GitHub](https://github.com) |
| mcp-notion | Notion API | TypeScript | 580 | [GitHub](https://github.com) |

**Quality:** Community-maintained
**Support:** Issue-based
**Updates:** Variable frequency

---

## Enterprise Servers

### Enterprise Integrations
| System | Server | Features | Support |
|--------|--------|----------|---------|
| SAP | mcp-sap | ERP operations | Commercial |
| Oracle EBS | mcp-oracle-ebs | Business suite | Commercial |
| ServiceNow | mcp-servicenow | ITSM | Commercial |
| Workday | mcp-workday | HCM/Finance | Commercial |

**Licensing:** Enterprise licensing required
**Compliance:** SOC 2, GDPR compliant
**SLA:** Enterprise support agreements

### Security & Compliance
| Tool | Server | Capabilities | Compliance |
|------|--------|--------------|------------|
| Vault | mcp-vault | Secret management | SOC 2 |
| Okta | mcp-okta | Identity management | Multiple |
| OneLogin | mcp-onelogin | SSO | GDPR |
| Auth0 | mcp-auth0 | Authentication | ISO 27001 |

**Features:**
- Audit logging
- Access control
- Encryption
- Compliance reporting

---

## Building Your Own MCP Server

### Development Requirements
**Languages Supported:**
- TypeScript/JavaScript (Node.js)
- Python
- Go (community)
- Rust (community)

**Core Dependencies:**
```json
{
  "@modelcontextprotocol/sdk": "^1.0.0"
}
```

### Server Structure
| Component | Purpose | Required |
|-----------|---------|----------|
| Server Class | Main server instance | Yes |
| Resources | Data providers | Optional |
| Tools | Action handlers | Optional |
| Prompts | Prompt templates | Optional |
| Transports | Communication layer | Yes |

### Example Server (TypeScript)
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0"
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "my_tool",
    description: "Tool description",
    inputSchema: { /* JSON Schema */ }
  }]
}));

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### Best Practices
1. **Error Handling:** Comprehensive error messages
2. **Validation:** Input validation with JSON Schema
3. **Security:** Sanitize inputs, validate credentials
4. **Logging:** Detailed logging for debugging
5. **Documentation:** Clear README and examples
6. **Testing:** Unit and integration tests
7. **Versioning:** Semantic versioning

### Publishing
**npm Package:**
```bash
npm publish --access public
```

**Registry:** [npm Registry](https://npmjs.com)
**Naming:** mcp-{your-server-name}
**Documentation:** README.md with examples

### Testing Your Server
**Tools:**
- MCP Inspector (official debugging tool)
- Unit test frameworks (Jest, pytest)
- Integration test suites

**Testing Checklist:**
- ✓ Tool invocation
- ✓ Resource access
- ✓ Error handling
- ✓ Authentication
- ✓ Rate limiting

---

## MCP Server Configuration

### Claude Desktop Configuration
**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Example Configuration:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token-here"
      }
    }
  }
}
```

### Environment Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| API_KEY | Service authentication | ghp_xxxx |
| DATABASE_URL | Database connection | postgres://... |
| LOG_LEVEL | Logging verbosity | debug, info, error |
| TIMEOUT | Request timeout | 30000 (ms) |

### Security Configuration
**Recommendations:**
- Use environment variables for secrets
- Restrict file system access paths
- Implement rate limiting
- Enable audit logging
- Use OAuth when available

---

## MCP Ecosystem Resources

### Official Resources
| Resource | Link | Description |
|----------|------|-------------|
| MCP Specification | [spec.modelcontextprotocol.io](https://spec.modelcontextprotocol.io) | Technical spec |
| SDK Documentation | [modelcontextprotocol.io/docs](https://modelcontextprotocol.io/docs) | Developer docs |
| GitHub Repository | [github.com/anthropics/mcp](https://github.com/anthropics/mcp) | Source code |
| Community Servers | [github.com/topics/mcp-server](https://github.com/topics/mcp-server) | Server catalog |

### Community Resources
**Discord:** MCP Developers channel in Anthropic Discord
**Forums:** [community.anthropic.com](https://community.anthropic.com)
**GitHub Discussions:** MCP repository discussions
**Stack Overflow:** Tag: [model-context-protocol]

### Contributing
**Ways to Contribute:**
1. Build and share MCP servers
2. Improve documentation
3. Report bugs and issues
4. Submit feature requests
5. Help other developers

---

## Server Quality Ratings

### Rating Criteria
- **5 Stars:** Production-ready, well-maintained, comprehensive docs
- **4 Stars:** Stable, good documentation, active maintenance
- **3 Stars:** Functional, basic docs, maintained
- **2 Stars:** Experimental, limited docs, sporadic updates
- **1 Star:** Proof of concept, minimal support

### Maintenance Status
- ✅ **Active:** Updated within 30 days
- ⚠️ **Maintained:** Updated within 90 days
- ⏸️ **Slow:** Updated within 180 days
- ❌ **Unmaintained:** No recent updates

---

## Troubleshooting Guide

### Common Issues
| Issue | Solution |
|-------|----------|
| Server not found | Check npm installation, verify command path |
| Authentication failed | Verify API keys, check environment variables |
| Timeout errors | Increase timeout, check network connectivity |
| Permission denied | Review file permissions, check access scopes |

### Debug Mode
**Enable Logging:**
```bash
export LOG_LEVEL=debug
```

**MCP Inspector:**
```bash
npx @modelcontextprotocol/inspector
```

---

**Last Updated:** May 2026
**Next Review:** June 2026
**MCP Version:** 1.0
**Maintainer:** Claude Mastery Guide Team
