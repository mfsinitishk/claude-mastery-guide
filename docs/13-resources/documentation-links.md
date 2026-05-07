# Official Documentation and API References

## Overview
This document provides comprehensive links to official documentation, API references, and technical specifications for Claude and related technologies.

**Last Updated:** May 2026
**Total Resources:** 45+

---

## Table of Contents
- [Official Anthropic Documentation](#official-anthropic-documentation)
- [API References](#api-references)
- [SDK Documentation](#sdk-documentation)
- [Model Documentation](#model-documentation)
- [Integration Guides](#integration-guides)
- [Migration Guides](#migration-guides)
- [Security & Compliance](#security--compliance)
- [Developer Tools](#developer-tools)

---

## Official Anthropic Documentation

### Core Documentation
| Resource | Description | Difficulty | Last Updated |
|----------|-------------|------------|--------------|
| [Anthropic Documentation](https://docs.anthropic.com) | Official comprehensive documentation | Beginner | May 2026 |
| [Claude API Overview](https://docs.anthropic.com/claude/reference) | Complete API reference and guides | Intermediate | May 2026 |
| [Getting Started Guide](https://docs.anthropic.com/claude/docs/intro-to-claude) | Introduction to Claude capabilities | Beginner | May 2026 |
| [Prompt Engineering Guide](https://docs.anthropic.com/claude/docs/prompt-engineering) | Official prompt engineering techniques | Intermediate | May 2026 |
| [Best Practices](https://docs.anthropic.com/claude/docs/best-practices) | Recommended implementation patterns | Intermediate | May 2026 |

**Community Rating:** 4.9/5.0
**Prerequisites:** Basic understanding of APIs
**Time Commitment:** 3-5 hours for initial review

### Advanced Documentation
| Resource | Description | Difficulty | Last Updated |
|----------|-------------|------------|--------------|
| [System Prompts Guide](https://docs.anthropic.com/claude/docs/system-prompts) | System prompt design and optimization | Advanced | April 2026 |
| [Context Window Management](https://docs.anthropic.com/claude/docs/context-windows) | Working with 200K+ context windows | Advanced | March 2026 |
| [Streaming Responses](https://docs.anthropic.com/claude/docs/streaming) | Real-time streaming implementation | Intermediate | May 2026 |
| [Error Handling](https://docs.anthropic.com/claude/docs/errors) | Comprehensive error handling guide | Intermediate | April 2026 |

---

## API References

### REST API
| Resource | Description | Difficulty | Last Updated |
|----------|-------------|------------|--------------|
| [Messages API](https://docs.anthropic.com/claude/reference/messages) | Core messaging API reference | Intermediate | May 2026 |
| [Streaming API](https://docs.anthropic.com/claude/reference/streaming) | Server-sent events streaming | Advanced | April 2026 |
| [Vision API](https://docs.anthropic.com/claude/reference/vision) | Image analysis capabilities | Intermediate | May 2026 |
| [Tool Use API](https://docs.anthropic.com/claude/reference/tool-use) | Function calling and tools | Advanced | May 2026 |
| [Batch API](https://docs.anthropic.com/claude/reference/batch) | Async batch processing | Advanced | March 2026 |

**API Version:** 2024-04-01
**Rate Limits:** Tier-based (documented)
**Authentication:** API key-based

### GraphQL API
| Resource | Description | Difficulty | Last Updated |
|----------|-------------|------------|--------------|
| [GraphQL Schema](https://docs.anthropic.com/claude/graphql/schema) | Complete GraphQL schema | Advanced | February 2026 |
| [Query Examples](https://docs.anthropic.com/claude/graphql/examples) | Sample queries and mutations | Intermediate | March 2026 |

---

## SDK Documentation

### Official SDKs
| SDK | Language | Documentation | GitHub | Latest Version |
|-----|----------|---------------|--------|----------------|
| Python SDK | Python | [Docs](https://github.com/anthropics/anthropic-sdk-python) | [Repo](https://github.com/anthropics/anthropic-sdk-python) | 0.25.0 |
| TypeScript SDK | TypeScript/JS | [Docs](https://github.com/anthropics/anthropic-sdk-typescript) | [Repo](https://github.com/anthropics/anthropic-sdk-typescript) | 0.20.0 |
| CLI | Command Line | [Docs](https://docs.anthropic.com/claude/docs/cli) | [Repo](https://github.com/anthropics/claude-cli) | 1.5.0 |

**Community Rating:** 4.8/5.0
**Prerequisites:** Language proficiency
**Maintenance:** Actively maintained

### Community SDKs
| SDK | Language | Maintainer | Stars | Last Updated |
|-----|----------|------------|-------|--------------|
| [anthropic-go](https://github.com/anthropics/anthropic-go) | Go | Community | 850+ | April 2026 |
| [anthropic-ruby](https://github.com/alexrudall/ruby-anthropic) | Ruby | alexrudall | 420+ | March 2026 |
| [anthropic-java](https://github.com/anthropics/anthropic-java) | Java | Community | 680+ | April 2026 |
| [anthropic-dotnet](https://github.com/anthropics/anthropic-dotnet) | .NET/C# | Community | 540+ | May 2026 |

---

## Model Documentation

### Claude Models
| Model | Context Window | Documentation | Use Cases | Status |
|-------|----------------|---------------|-----------|--------|
| Claude 3.5 Sonnet | 200K tokens | [Docs](https://docs.anthropic.com/claude/docs/models-overview#claude-3-5-sonnet) | Balanced performance | Current |
| Claude 3 Opus | 200K tokens | [Docs](https://docs.anthropic.com/claude/docs/models-overview#claude-3-opus) | Complex reasoning | Current |
| Claude 3 Haiku | 200K tokens | [Docs](https://docs.anthropic.com/claude/docs/models-overview#claude-3-haiku) | Fast responses | Current |
| Claude 3.5 Haiku | 200K tokens | [Docs](https://docs.anthropic.com/claude/docs/models-overview#claude-3-5-haiku) | Speed optimized | Beta |
| Claude Instant | 100K tokens | [Docs](https://docs.anthropic.com/claude/docs/models-overview#claude-instant) | Legacy model | Deprecated |

**Model Comparison Chart:** [View Comparison](https://docs.anthropic.com/claude/docs/models-comparison)
**Pricing Calculator:** [Calculate Costs](https://docs.anthropic.com/claude/pricing)

### Model Capabilities
| Capability | Documentation | Difficulty | Models |
|------------|---------------|------------|--------|
| Vision/Image Analysis | [Docs](https://docs.anthropic.com/claude/docs/vision) | Intermediate | Opus, Sonnet |
| Function Calling | [Docs](https://docs.anthropic.com/claude/docs/tool-use) | Advanced | All Claude 3+ |
| JSON Mode | [Docs](https://docs.anthropic.com/claude/docs/json-mode) | Intermediate | All Claude 3+ |
| Extended Thinking | [Docs](https://docs.anthropic.com/claude/docs/thinking) | Advanced | Opus, Sonnet |

---

## Integration Guides

### Platform Integrations
| Platform | Guide | Difficulty | Time Required |
|----------|-------|------------|---------------|
| AWS Bedrock | [Integration Guide](https://docs.anthropic.com/claude/docs/claude-on-amazon-bedrock) | Intermediate | 2-3 hours |
| Google Vertex AI | [Integration Guide](https://docs.anthropic.com/claude/docs/claude-on-vertex-ai) | Intermediate | 2-3 hours |
| LangChain | [Integration Guide](https://python.langchain.com/docs/integrations/chat/anthropic) | Advanced | 3-4 hours |
| LlamaIndex | [Integration Guide](https://docs.llamaindex.ai/en/stable/examples/llm/anthropic/) | Advanced | 3-4 hours |
| Vercel AI SDK | [Integration Guide](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic) | Intermediate | 2 hours |

**Prerequisites:** Platform-specific knowledge
**Support:** Community and official support available

### Framework Integrations
| Framework | Documentation | Use Case | Difficulty |
|-----------|---------------|----------|------------|
| Streamlit | [Guide](https://docs.streamlit.io/knowledge-base/tutorials/llm-quickstart) | UI Applications | Beginner |
| FastAPI | [Guide](https://fastapi.tiangolo.com/advanced/middleware/) | API Services | Intermediate |
| Next.js | [Guide](https://nextjs.org/docs/app/building-your-application/data-fetching) | Web Apps | Intermediate |
| Django | [Guide](https://docs.djangoproject.com/en/5.0/) | Full Stack | Advanced |

---

## Migration Guides

### Version Migrations
| Migration | Guide | Breaking Changes | Effort Level |
|-----------|-------|------------------|--------------|
| Claude 2 to Claude 3 | [Migration Guide](https://docs.anthropic.com/claude/docs/migrating-from-claude-2-to-claude-3) | Moderate | Medium |
| API v1 to v2 | [Migration Guide](https://docs.anthropic.com/claude/docs/api-migration) | Significant | High |
| Legacy to Extended Thinking | [Guide](https://docs.anthropic.com/claude/docs/thinking-migration) | Minor | Low |

**Migration Tools:** CLI migration assistant available
**Support Period:** 6 months for deprecated features

---

## Security & Compliance

### Security Documentation
| Topic | Documentation | Importance | Last Updated |
|-------|---------------|------------|--------------|
| API Security | [Security Guide](https://docs.anthropic.com/claude/docs/security) | Critical | May 2026 |
| Data Privacy | [Privacy Policy](https://www.anthropic.com/privacy) | Critical | April 2026 |
| SOC 2 Compliance | [Compliance Docs](https://trust.anthropic.com/) | High | March 2026 |
| GDPR Compliance | [GDPR Guide](https://docs.anthropic.com/claude/docs/gdpr) | High | April 2026 |
| HIPAA Compliance | [HIPAA Guide](https://docs.anthropic.com/claude/docs/hipaa) | High | February 2026 |

**Trust Center:** [Visit Trust Center](https://trust.anthropic.com/)
**Security Contacts:** security@anthropic.com

### Authentication & Authorization
| Method | Documentation | Security Level | Use Case |
|--------|---------------|----------------|----------|
| API Keys | [API Key Guide](https://docs.anthropic.com/claude/docs/authentication) | Medium | Development |
| OAuth 2.0 | [OAuth Guide](https://docs.anthropic.com/claude/docs/oauth) | High | Production |
| Service Accounts | [Service Account Guide](https://docs.anthropic.com/claude/docs/service-accounts) | High | Automation |

---

## Developer Tools

### Official Tools
| Tool | Description | Platform | Link |
|------|-------------|----------|------|
| Claude Console | Web-based playground | Web | [console.anthropic.com](https://console.anthropic.com) |
| API Dashboard | Usage monitoring | Web | [console.anthropic.com/dashboard](https://console.anthropic.com/dashboard) |
| Token Counter | Calculate token usage | Web | [console.anthropic.com/tokens](https://console.anthropic.com/tokens) |
| Prompt Library | Pre-built prompts | Web | [docs.anthropic.com/claude/prompt-library](https://docs.anthropic.com/claude/prompt-library) |

**Community Rating:** 4.7/5.0
**Updates:** Monthly feature releases

### Development Resources
| Resource | Type | Difficulty | Link |
|----------|------|------------|------|
| Prompt Engineering Workbench | Interactive Tool | Intermediate | [Available in Console](https://console.anthropic.com) |
| Rate Limit Calculator | Utility | Beginner | [Docs](https://docs.anthropic.com/claude/docs/rate-limits) |
| Cost Estimator | Utility | Beginner | [Calculator](https://docs.anthropic.com/claude/pricing) |
| Model Benchmarks | Reference | Advanced | [Benchmarks](https://docs.anthropic.com/claude/docs/benchmarks) |

---

## Additional Resources

### Release Notes & Changelogs
- [Product Updates](https://www.anthropic.com/product) - Official product announcements
- [API Changelog](https://docs.anthropic.com/claude/changelog) - API version changes
- [SDK Releases](https://github.com/anthropics) - SDK version history

### Support & Help
- [Support Portal](https://support.anthropic.com) - Official support tickets
- [Status Page](https://status.anthropic.com) - Service status monitoring
- [Developer Forum](https://community.anthropic.com) - Community discussions

### Legal & Policies
- [Terms of Service](https://www.anthropic.com/terms) - Usage terms
- [Commercial Terms](https://www.anthropic.com/commercial-terms) - Enterprise agreements
- [Acceptable Use Policy](https://www.anthropic.com/aup) - Usage guidelines

---

## Quick Reference Card

### Essential Links
```
Documentation:     https://docs.anthropic.com
API Reference:     https://docs.anthropic.com/claude/reference
Console:           https://console.anthropic.com
Python SDK:        https://github.com/anthropics/anthropic-sdk-python
TypeScript SDK:    https://github.com/anthropics/anthropic-sdk-typescript
Support:           https://support.anthropic.com
Status:            https://status.anthropic.com
```

### API Endpoints
```
Production:        https://api.anthropic.com
Messages:          POST /v1/messages
Streaming:         POST /v1/messages (stream: true)
API Version:       2024-04-01
```

---

**Note:** All links and resources are actively maintained. Report broken links to the documentation team or submit a pull request to update this guide.

**Contribution:** To suggest additional resources, please submit an issue or pull request to the Claude Mastery Guide repository.
