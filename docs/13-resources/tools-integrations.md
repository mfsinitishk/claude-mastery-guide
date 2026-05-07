# Tools and Integrations Directory

## Overview
Comprehensive catalog of tools, plugins, integrations, and utilities for Claude AI development, testing, deployment, and monitoring.

**Last Updated:** May 2026
**Total Tools:** 150+
**Categories:** 15+

---

## Table of Contents
- [Development Tools](#development-tools)
- [IDE Extensions](#ide-extensions)
- [Testing Tools](#testing-tools)
- [Monitoring & Observability](#monitoring--observability)
- [Vector Databases](#vector-databases)
- [Framework Integrations](#framework-integrations)
- [API Tools](#api-tools)
- [Deployment Tools](#deployment-tools)
- [Security Tools](#security-tools)
- [Cost Management](#cost-management)
- [Productivity Tools](#productivity-tools)
- [Data Processing](#data-processing)
- [Workflow Automation](#workflow-automation)
- [Browser Extensions](#browser-extensions)
- [Mobile Tools](#mobile-tools)

---

## Development Tools

### Code Editors & IDEs
| Tool | Type | Claude Support | Platform | Price | Link |
|------|------|----------------|----------|-------|------|
| VS Code | IDE | Extensions available | Cross-platform | Free | [code.visualstudio.com](https://code.visualstudio.com) |
| Cursor | AI-native IDE | Native integration | Cross-platform | $20/mo | [cursor.sh](https://cursor.sh) |
| JetBrains IDEs | IDE Suite | Plugin support | Cross-platform | $149-$649/yr | [jetbrains.com](https://jetbrains.com) |
| Zed | Modern editor | API integration | macOS/Linux | Free | [zed.dev](https://zed.dev) |
| Neovim | Terminal editor | Plugin ecosystem | Cross-platform | Free | [neovim.io](https://neovim.io) |

**Community Rating:** 4.7/5.0 average
**Setup Time:** 5-30 minutes
**Best For:** Different development preferences

### CLI Tools
| Tool | Purpose | Language | Stars | Install |
|------|---------|----------|-------|---------|
| claude-cli | Official CLI | TypeScript | 3.4K | `npm i -g @anthropic-ai/claude-cli` |
| aichat | Multi-model CLI | Rust | 2.8K | `cargo install aichat` |
| llm | LLM management | Python | 5.2K | `pip install llm` |
| ai-shell | Shell assistant | TypeScript | 1.9K | `npm i -g @builder.io/ai-shell` |
| chatgpt-cli | Terminal chat | Python | 3.1K | `pip install chatgpt-cli` |

**Platform:** Linux, macOS, Windows (WSL)
**Integration:** Scriptable, pipeable
**Use Cases:** Automation, quick queries

### API Clients
| Client | Platform | Features | Price | Link |
|--------|----------|----------|-------|------|
| Postman | Cross-platform | Collections, testing | Free-$49/mo | [postman.com](https://postman.com) |
| Insomnia | Cross-platform | GraphQL, REST | Free-$15/mo | [insomnia.rest](https://insomnia.rest) |
| Paw | macOS | Native, beautiful | $49.99 | [paw.cloud](https://paw.cloud) |
| HTTPie | CLI/Desktop | User-friendly | Free-$99/yr | [httpie.io](https://httpie.io) |
| Bruno | Open-source | Offline-first | Free | [usebruno.com](https://usebruno.com) |

**Claude Collections:** Pre-built API collections available
**Testing:** Environment variables, scripts
**Collaboration:** Team workspaces

---

## IDE Extensions

### VS Code Extensions
| Extension | Downloads | Rating | Features | Install |
|-----------|-----------|--------|----------|---------|
| Claude AI | 125K+ | 4.8/5 | Inline assistance, chat | Search in Marketplace |
| Continue | 85K+ | 4.7/5 | Code completion | Search in Marketplace |
| Anthropic Helper | 45K+ | 4.6/5 | API snippets, docs | Search in Marketplace |
| Prompt Snippets | 32K+ | 4.5/5 | Prompt templates | Search in Marketplace |
| LLM Lens | 28K+ | 4.7/5 | Token counting | Search in Marketplace |

**Installation:** Extensions marketplace
**Configuration:** Settings.json
**Key Bindings:** Customizable shortcuts

### JetBrains Plugins
| Plugin | IDE Support | Features | Price |
|--------|-------------|----------|-------|
| AI Assistant | All IDEs | Chat, generation | Free trial |
| Claude Integration | IntelliJ, PyCharm | API calls | Free |
| Prompt Builder | All IDEs | Templates | $29/yr |
| Code Review AI | All IDEs | PR analysis | $49/yr |

**Compatibility:** 2023.1+
**Updates:** Automatic
**Settings:** Per-project configuration

### Other IDEs
| IDE | Extension | Features | Support |
|-----|-----------|----------|---------|
| Sublime Text | Claude Package | Basic integration | Community |
| Atom | atom-claude | Chat, snippets | Deprecated |
| Vim/Neovim | claude.nvim | Terminal UI | Active |
| Emacs | claude-mode | Org-mode integration | Active |

---

## Testing Tools

### Prompt Testing
| Tool | Purpose | Features | Price | Link |
|------|---------|----------|-------|------|
| PromptLayer | Prompt management | Versioning, A/B testing | Free-$99/mo | [promptlayer.com](https://promptlayer.com) |
| Helicone | Observability | Testing, analytics | Free-$50/mo | [helicone.ai](https://helicone.ai) |
| Humanloop | Evaluation | Metrics, datasets | $99-$499/mo | [humanloop.com](https://humanloop.com) |
| Braintrust | Testing platform | Evals, CI/CD | Free-$199/mo | [braintrustdata.com](https://braintrustdata.com) |

**Evaluation Metrics:** Accuracy, latency, cost
**Integration:** CI/CD pipelines
**Collaboration:** Team features

### Unit Testing Frameworks
| Framework | Language | Claude Support | Stars |
|-----------|----------|----------------|-------|
| pytest-claude | Python | Native | 1.2K |
| jest-anthropic | JavaScript | Plugin | 890 |
| claude-test | TypeScript | Built-in | 650 |
| rspec-claude | Ruby | Extension | 420 |

**Fixtures:** Pre-built test data
**Mocking:** API response simulation
**Coverage:** Integration with coverage tools

### End-to-End Testing
| Tool | Framework | Features | Use Case |
|------|-----------|----------|----------|
| Playwright + Claude | Playwright | Browser automation | UI testing |
| Cypress | Cypress | Visual testing | Web apps |
| Selenium | Selenium | Cross-browser | Legacy apps |
| Puppeteer | Puppeteer | Headless testing | Node.js apps |

**AI Integration:** Natural language test writing
**Recording:** Test generation from actions
**Reporting:** Detailed test reports

---

## Monitoring & Observability

### Application Performance Monitoring
| Platform | Features | Pricing | Integration | Link |
|----------|----------|---------|-------------|------|
| Datadog | Full observability | $15-$23/host/mo | Native | [datadoghq.com](https://datadoghq.com) |
| New Relic | APM, logging | Free-$99/user/mo | SDK | [newrelic.com](https://newrelic.com) |
| Dynatrace | AI-powered | $69-$79/host/mo | Auto-discovery | [dynatrace.com](https://dynatrace.com) |
| Sentry | Error tracking | Free-$26/mo | SDK | [sentry.io](https://sentry.io) |

**Metrics:** Latency, errors, throughput
**Alerts:** Real-time notifications
**Dashboards:** Custom visualizations

### LLM-Specific Monitoring
| Tool | Focus | Features | Price |
|------|-------|----------|-------|
| LangSmith | LangChain apps | Tracing, debugging | $39-$199/mo |
| Weights & Biases | ML experiments | Tracking, versioning | Free-$50/user/mo |
| Arize AI | Model monitoring | Drift detection | Quote-based |
| WhyLabs | Data quality | Profiling, alerts | Quote-based |

**Visibility:** Full request/response logging
**Analytics:** Usage patterns, performance
**Debugging:** Trace issues to source

### Logging Solutions
| Service | Storage | Query | Retention | Cost |
|---------|---------|-------|-----------|------|
| CloudWatch | AWS | CloudWatch Insights | Configurable | Pay-as-you-go |
| Stackdriver | GCP | Log Explorer | 30-400 days | Pay-as-you-go |
| Elasticsearch | Self-hosted | Kibana | Unlimited | Infrastructure |
| Loggly | Cloud | Advanced search | 7-90 days | $79-$319/mo |

**Integration:** Standard logging libraries
**Search:** Full-text, structured
**Compliance:** Data retention policies

---

## Vector Databases

### Production Vector DBs
| Database | Type | Deployment | Pricing | Best For |
|----------|------|------------|---------|----------|
| Pinecone | Cloud-native | Managed | $70-$500/mo | Scalability |
| Weaviate | Open-source | Self/managed | Free-Custom | Flexibility |
| Qdrant | High-performance | Self/cloud | Free-Custom | Speed |
| Milvus | Enterprise | Self/cloud | Free-Custom | Large-scale |
| Chroma | Embedded | Local/cloud | Free | Development |

**Dimensions:** Up to 3072 (Claude embeddings)
**Scaling:** Horizontal scaling support
**Features:** Filtering, hybrid search

### Managed Services
| Service | Provider | Integration | SLA | Link |
|---------|----------|-------------|-----|------|
| Pinecone | Pinecone | Native SDK | 99.9% | [pinecone.io](https://pinecone.io) |
| Weaviate Cloud | Weaviate | GraphQL, REST | 99.9% | [weaviate.io](https://weaviate.io) |
| Qdrant Cloud | Qdrant | gRPC, HTTP | 99.95% | [qdrant.tech](https://qdrant.tech) |
| Azure AI Search | Microsoft | Azure SDK | 99.9% | [azure.microsoft.com](https://azure.microsoft.com) |

**Backup:** Automated backups
**Monitoring:** Built-in dashboards
**Support:** Email, chat, phone

### Embedding Tools
| Tool | Purpose | Features | Price |
|------|---------|----------|-------|
| OpenAI Embeddings | Text embeddings | 1536 dimensions | $0.0001/1K tokens |
| Cohere Embed | Multilingual | 1024 dimensions | $0.0001/1K tokens |
| Sentence Transformers | Local embeddings | Open-source models | Free |
| Jina AI | Multimodal | Text, images | Free-Custom |

**Quality:** Semantic similarity
**Speed:** Batch processing available
**Cost:** Token-based pricing

---

## Framework Integrations

### LangChain Ecosystem
| Tool | Purpose | Integration | Stars |
|------|---------|-------------|-------|
| LangChain | Framework | Native support | 85K+ |
| LangSmith | Debugging | Built-in | N/A |
| LangServe | Deployment | FastAPI-based | 1.5K+ |
| LangGraph | Agents | Stateful graphs | 3.2K+ |

**Documentation:** Comprehensive guides
**Community:** Active Discord, forums
**Updates:** Frequent releases

### LlamaIndex
| Component | Function | Claude Support | Link |
|-----------|----------|----------------|------|
| Core | Data indexing | Native | [llamaindex.ai](https://llamaindex.ai) |
| Query Engines | Retrieval | Optimized | [Docs](https://docs.llamaindex.ai) |
| Agents | Task automation | Supported | [GitHub](https://github.com/run-llama) |
| Callbacks | Monitoring | Integrated | [Examples](https://docs.llamaindex.ai/examples) |

**Data Connectors:** 100+ sources
**Index Types:** Vector, graph, tree
**Evaluation:** Built-in metrics

### Web Frameworks
| Framework | Language | Claude Package | Difficulty |
|-----------|----------|----------------|------------|
| Streamlit | Python | st-claude | Beginner |
| Gradio | Python | gradio-anthropic | Beginner |
| FastAPI | Python | anthropic-sdk | Intermediate |
| Next.js | TypeScript | @anthropic-ai/sdk | Intermediate |
| Django | Python | django-claude | Advanced |

**Templates:** Starter projects available
**Deployment:** Platform-specific guides
**Examples:** GitHub repositories

---

## API Tools

### API Development
| Tool | Purpose | Features | Price | Link |
|------|---------|----------|-------|------|
| Swagger/OpenAPI | API documentation | Auto-generation | Free | [swagger.io](https://swagger.io) |
| Stoplight | API design | Mocking, testing | $0-$99/mo | [stoplight.io](https://stoplight.io) |
| Kong | API gateway | Rate limiting, auth | Free-Enterprise | [konghq.com](https://konghq.com) |
| Apigee | API management | Analytics, security | Quote-based | [cloud.google.com/apigee](https://cloud.google.com/apigee) |

**Standards:** OpenAPI 3.0
**Versioning:** API version management
**Documentation:** Interactive docs

### Rate Limiting
| Tool | Type | Features | Integration |
|------|------|----------|-------------|
| Upstash | Redis-based | Serverless | SDK, REST |
| Redis | In-memory | Self-hosted | Client libraries |
| Rate Limiter Flexible | Node.js | Middleware | npm package |
| django-ratelimit | Django | Decorator-based | pip package |

**Strategies:** Token bucket, sliding window
**Distribution:** Multi-server support
**Monitoring:** Real-time tracking

---

## Deployment Tools

### Container Platforms
| Platform | Type | Claude Support | Pricing |
|----------|------|----------------|---------|
| Docker | Containerization | Full | Free |
| Kubernetes | Orchestration | YAML configs | Free |
| Docker Compose | Multi-container | docker-compose.yml | Free |
| Podman | Alternative | Compatible | Free |

**Images:** Official base images
**Optimization:** Multi-stage builds
**Secrets:** Environment management

### PaaS Solutions
| Platform | Deployment | Scaling | Pricing | Link |
|----------|------------|---------|---------|------|
| Vercel | Git-based | Auto | Free-$20/mo | [vercel.com](https://vercel.com) |
| Netlify | Git-based | Auto | Free-$19/mo | [netlify.com](https://netlify.com) |
| Heroku | Git/Docker | Manual/Auto | $5-$500/mo | [heroku.com](https://heroku.com) |
| Railway | Git-based | Auto | $5-$50/mo | [railway.app](https://railway.app) |
| Render | Git/Docker | Auto | Free-$85/mo | [render.com](https://render.com) |

**CI/CD:** Built-in pipelines
**Environment:** Preview environments
**Domains:** Custom domain support

### Serverless
| Platform | Runtime | Cold Start | Free Tier |
|----------|---------|------------|-----------|
| AWS Lambda | Multiple | ~100-500ms | 1M requests/mo |
| Google Cloud Functions | Multiple | ~100-400ms | 2M invocations/mo |
| Azure Functions | Multiple | ~50-200ms | 1M executions/mo |
| Cloudflare Workers | JavaScript | <1ms | 100K requests/day |

**Concurrency:** Configurable limits
**Timeout:** Up to 15 minutes
**Integration:** Trigger-based execution

---

## Security Tools

### API Security
| Tool | Purpose | Features | Price |
|------|---------|----------|-------|
| API Shield | DDoS protection | Rate limiting, WAF | Cloudflare plans |
| Salt Security | API protection | Threat detection | Enterprise |
| 42Crunch | API security | Vulnerability scanning | $99-$999/mo |
| Traceable | Runtime protection | Anomaly detection | Quote-based |

**Compliance:** OWASP API Security
**Scanning:** Automated vulnerability checks
**Reporting:** Security dashboards

### Secret Management
| Service | Provider | Features | Integration |
|---------|----------|----------|-------------|
| AWS Secrets Manager | AWS | Rotation, encryption | AWS SDK |
| Google Secret Manager | GCP | Versioning, audit | GCP SDK |
| Azure Key Vault | Microsoft | HSM-backed | Azure SDK |
| HashiCorp Vault | HashiCorp | Multi-cloud | CLI, API |
| Doppler | Doppler | Sync, sharing | CLI, SDK |

**Encryption:** AES-256
**Access Control:** IAM integration
**Audit:** Full audit logs

### Data Privacy
| Tool | Focus | Features | Compliance |
|------|-------|----------|------------|
| OneTrust | Privacy management | GDPR, CCPA | Multi-region |
| TrustArc | Assessment | Data mapping | Global |
| BigID | Discovery | PII detection | GDPR, HIPAA |
| DataGrail | Automation | DSR workflows | CCPA, GDPR |

**Regulations:** GDPR, CCPA, HIPAA
**Scanning:** Automated data discovery
**Reporting:** Compliance reports

---

## Cost Management

### Usage Tracking
| Tool | Features | Platform | Price |
|------|----------|----------|-------|
| LLM Monitor | Token tracking | Web app | Free-$29/mo |
| Anthropic Console | Official dashboard | Web | Free |
| Custom Dashboard | DIY solution | Self-hosted | Free |
| CloudWatch | AWS tracking | AWS | Pay-as-you-go |

**Metrics:** Tokens, requests, cost
**Alerts:** Budget notifications
**Reports:** Monthly summaries

### Cost Optimization Tools
| Tool | Purpose | Savings | Link |
|------|---------|---------|------|
| Prompt Compressor | Reduce tokens | 30-50% | [GitHub](https://github.com) |
| Cache Manager | Response caching | 60-80% | [NPM](https://npmjs.com) |
| Batch Processor | Async operations | 20-40% | [PyPI](https://pypi.org) |
| Token Counter | Pre-validation | 10-20% | [Web](https://platform.anthropic.com) |

**ROI:** Quick payback period
**Implementation:** Low effort
**Impact:** Significant cost reduction

---

## Productivity Tools

### Chrome Extensions
| Extension | Function | Users | Rating | Link |
|-----------|----------|-------|--------|------|
| Claude Sidebar | Quick access | 50K+ | 4.7/5 | Chrome Web Store |
| AI Assistant | Page summarization | 120K+ | 4.8/5 | Chrome Web Store |
| Prompt Library | Template access | 35K+ | 4.6/5 | Chrome Web Store |
| Token Counter | Count before send | 22K+ | 4.5/5 | Chrome Web Store |

**Permissions:** Minimal required
**Privacy:** No data collection
**Updates:** Regular improvements

### Desktop Apps
| App | Platform | Features | Price |
|-----|----------|----------|-------|
| Claude Desktop | macOS, Windows | Native interface | Free |
| Raycast | macOS | Quick launcher | Free-$10/mo |
| Alfred | macOS | Workflow automation | £34 |
| Wox | Windows | Launcher | Free |

**Shortcuts:** Keyboard-first
**Customization:** Themes, plugins
**Performance:** Native speed

---

## Data Processing

### Document Processing
| Tool | Formats | Features | Price |
|------|---------|----------|-------|
| PyPDF2 | PDF | Extraction | Free |
| pdfplumber | PDF | Tables, text | Free |
| Apache Tika | Multiple | Content extraction | Free |
| Textract | Cloud | OCR, forms | Pay-as-you-go |

**Quality:** High accuracy
**Speed:** Batch processing
**Integration:** Library-based

### Data Transformation
| Tool | Purpose | Language | Stars |
|------|---------|----------|-------|
| Pandas | Data manipulation | Python | 40K+ |
| Polars | Fast dataframes | Python/Rust | 25K+ |
| dplyr | Data wrangling | R | 4.5K+ |
| Apache Spark | Big data | Scala/Python | 38K+ |

**Scale:** Small to massive datasets
**Performance:** Optimized operations
**Learning Curve:** Beginner to advanced

---

## Workflow Automation

### No-Code/Low-Code
| Platform | Complexity | Claude Integration | Pricing |
|----------|------------|-------------------|---------|
| Zapier | Low | Native | $0-$599/mo |
| Make (Integromat) | Medium | API integration | $0-$299/mo |
| n8n | Medium | Custom nodes | Free-$50/mo |
| Pipedream | Medium | Built-in | $0-$50/mo |

**Triggers:** 1000+ integrations
**Actions:** Custom logic
**Scheduling:** Time-based triggers

### Code-Based Automation
| Tool | Language | Features | Use Case |
|------|----------|----------|----------|
| Apache Airflow | Python | DAG workflows | Data pipelines |
| Prefect | Python | Modern orchestration | ML workflows |
| Temporal | Multiple | Durable execution | Complex workflows |
| Celery | Python | Distributed tasks | Background jobs |

**Reliability:** Retry logic, error handling
**Monitoring:** Web UI dashboards
**Scaling:** Distributed execution

---

**Tool Selection Guidelines:**
1. **Identify needs:** Development, testing, deployment, monitoring
2. **Evaluate options:** Compare features, pricing, integration
3. **Trial period:** Test before committing
4. **Start simple:** Add tools as needed
5. **Monitor ROI:** Track time/cost savings

**Integration Strategy:**
- Start with official tools
- Add framework integrations
- Implement monitoring early
- Automate repetitive tasks
- Optimize costs continuously

---

**Last Updated:** May 2026
**Next Review:** June 2026
**Maintainer:** Claude Mastery Guide Team
