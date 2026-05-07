# Repository Workflows

## Mastering Repository-Scale Development with Claude

---

## 🎯 Learning Objectives

By the end of this section, you will be able to:

- ✅ Quickly understand the structure and organization of any repository
- ✅ Navigate large codebases efficiently using AI assistance
- ✅ Identify architectural patterns and coding conventions
- ✅ Analyze dependencies and relationships between components
- ✅ Create comprehensive repository documentation
- ✅ Onboard to new codebases 5-10x faster
- ✅ Find relevant code without knowing exact file locations

---

## 📖 Understanding Repository Workflows

### What Makes Repository-Scale Different?

**Single-File Development (Level 1):**
- Work with one file at a time
- Limited context needed
- Isolated changes
- Simple validation

**Repository-Scale Development (Level 2):**
- Work with entire codebase
- Complex interdependencies
- Coordinated changes across files
- System-wide impact analysis
- Architectural understanding required

### The Repository Analysis Challenge

When you join a new project or start working with an unfamiliar codebase:

**Traditional Approach (Days to Weeks):**
- Read through files randomly
- Ask teammates for explanations
- Trace code manually
- Make incorrect assumptions
- Break things accidentally

**AI-Assisted Approach (Hours):**
- Get instant architectural overview
- Understand patterns and conventions
- Locate relevant code quickly
- Analyze dependencies accurately
- Ask targeted questions

---

## 🏗️ Repository Structure Analysis

### Phase 1: Initial Repository Scan

**Objective:** Get a high-level understanding of the repository structure.

#### Prompt Template: Initial Repository Overview

```
Analyze this repository structure and provide:

1. Primary purpose and type (backend API, frontend app, full-stack, library, etc.)
2. Technology stack and frameworks used
3. Key directories and their purposes
4. Entry points and main files
5. Build and deployment approach
6. Testing strategy and location

Repository tree:
[paste output of: tree -L 3 -I 'node_modules|.git|dist|build']
```

#### Example Analysis Request

```
I'm new to this repository. Help me understand its structure.

Here's the top-level directory structure:

```
myapp/
├── src/
│   ├── api/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── index.ts
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
├── package.json
├── tsconfig.json
└── README.md
```

What's the architecture and organization pattern?
```

**Expected AI Response:**
- Repository type identification
- Technology stack summary
- Directory purpose explanation
- Architectural pattern recognition
- Suggested exploration path

### Phase 2: Dependency Analysis

**Objective:** Understand how components depend on each other.

#### Prompt Template: Dependency Mapping

```
Analyze dependencies in this codebase:

1. What are the main external dependencies? (from package.json/requirements.txt)
2. What are the key internal modules and how do they relate?
3. Are there circular dependencies I should be aware of?
4. What's the dependency flow (which layers depend on which)?

[paste package.json or relevant dependency files]
[paste key import statements from main files]
```

#### Practical Example: Analyzing a React Application

```
Here's the package.json dependencies section:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "axios": "^1.3.0",
    "zustand": "^4.3.0",
    "@tanstack/react-query": "^4.24.0"
  }
}
```

And here are the main import patterns I see:

From `src/components/UserDashboard.tsx`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { useUserStore } from '../stores/userStore';
```

What's the data flow architecture?
```

**Key Questions to Ask:**
- What state management approach is used?
- How is API communication handled?
- What routing strategy is implemented?
- Are there shared utility patterns?

### Phase 3: Convention Discovery

**Objective:** Learn the coding patterns and conventions used.

#### Prompt Template: Pattern Analysis

```
Analyze these code samples and identify:

1. Naming conventions (files, functions, variables)
2. Code organization patterns
3. Common coding patterns and idioms
4. Testing conventions
5. Documentation standards
6. Error handling approaches

[paste 3-5 representative files from different parts of the codebase]
```

#### Example: Discovering API Patterns

```
Here are three API endpoint files from this repository:

File 1: src/api/users.ts
[paste content]

File 2: src/api/orders.ts
[paste content]

File 3: src/api/products.ts
[paste content]

What patterns and conventions should I follow when adding new endpoints?
```

**Claude will identify:**
- Request/response patterns
- Error handling conventions
- Validation approaches
- Authentication patterns
- Naming conventions
- Documentation standards

---

## 🔍 Navigation and Code Discovery

### Finding Code Without Knowing Locations

One of Claude's superpowers is helping you find code when you don't know where it is.

#### Technique 1: Functional Search

**Instead of:** "Where is the user authentication code?"

**Use:**
```
I need to understand how user authentication works in this codebase.

Based on this repository structure [paste tree output],
where would I find:
1. Authentication logic
2. Login/logout endpoints
3. Token management
4. Protected route handling

Help me locate the relevant files and explain the authentication flow.
```

#### Technique 2: Feature Tracing

```
I want to understand how the "export to PDF" feature works.

Given these potentially relevant files:
- src/components/ExportButton.tsx
- src/services/pdfService.ts
- src/utils/formatters.ts

Help me trace the complete flow from button click to PDF generation.
What other files might be involved?
```

#### Technique 3: Pattern-Based Discovery

```
I see this pattern used in several places:

```typescript
const { data, error } = await api.get('/endpoint');
```

Find all locations where this API pattern is used and explain:
1. How the `api` object is defined
2. Error handling conventions
3. Response transformation
4. Type safety approach
```

### Creating a Mental Map

**Prompt Template: Mental Model Building**

```
Help me build a mental model of this codebase.

Based on [repository tree/key files], create:

1. A layer diagram (presentation → business logic → data access)
2. Key modules and their responsibilities
3. Data flow for a typical user action
4. File naming and organization rules
5. Where to make common types of changes

Repository context:
[paste relevant information]
```

---

## 📋 Repository Documentation

### Creating Repository Overview Documents

#### Template: Repository README Enhancement

```
Enhance this README with a comprehensive developer guide section:

Current README:
[paste current README]

Repository structure:
[paste tree output]

Add sections for:
1. Architecture overview
2. Directory structure explanation
3. Getting started for developers
4. Common development workflows
5. Where to make common changes
6. Testing guidelines
7. Deployment process

Make it friendly for new developers joining the team.
```

#### Template: Architecture Documentation

```
Create architecture documentation for this repository:

Technology Stack:
[list technologies]

Key Components:
[list main modules/components]

Generate:
1. High-level architecture diagram (in Mermaid format)
2. Component responsibility matrix
3. Data flow diagrams for key features
4. Integration points with external services
5. Technology decision rationale

Keep it concise but comprehensive - suitable for new team members.
```

**Example Mermaid Diagram Request:**

```
Create a Mermaid architecture diagram showing:

Frontend: React components → React Query → API Service
Backend: Express → Controllers → Services → Database
External: Third-party APIs (Stripe, SendGrid)

Include data flow for "user places order" scenario.
```

### Creating Onboarding Guides

#### Prompt Template: Developer Onboarding

```
Create a developer onboarding guide for this repository:

Project: [project name and description]
Tech Stack: [list]
Team Size: [number]

Include:
1. Setup instructions (environment, dependencies)
2. Repository structure walkthrough
3. Key concepts to understand
4. Common workflows (feature development, testing, deployment)
5. Where to find help
6. First tasks for new developers

Make it welcoming and practical.
```

---

## 🛠️ Practical Workflows

### Workflow 1: Rapid Repository Analysis (30 minutes)

**Goal:** Understand a new repository quickly.

```markdown
## Step 1: Get Repository Tree (5 min)
```bash
tree -L 3 -I 'node_modules|.git|dist|build' > repo-structure.txt
```

## Step 2: Analyze Structure with Claude (10 min)
Prompt:
"Analyze this repository structure and explain:
1. What type of application is this?
2. What's the tech stack?
3. How is code organized?
4. What are the main entry points?

[paste repo-structure.txt]"

## Step 3: Understand Dependencies (5 min)
Prompt:
"Analyze dependencies and explain:
1. Key external libraries and their purposes
2. Internal module structure
3. Data flow patterns

[paste package.json or equivalent]"

## Step 4: Discover Conventions (10 min)
Prompt:
"Review these sample files and identify:
1. Naming conventions
2. Code organization patterns
3. Testing approaches

[paste 3-5 representative files]"

## Result:
- Architectural understanding
- Navigation confidence
- Convention knowledge
- Ready to make first changes
```

### Workflow 2: Feature Location and Understanding

**Scenario:** You need to modify the "user notification" feature but don't know where the code is.

```markdown
## Step 1: Locate Feature Code
Prompt:
"I need to modify the user notification feature.

Repository structure:
[paste tree output]

Help me locate:
1. Where notifications are triggered
2. Where notification logic lives
3. Where notification UI is defined
4. Any notification-related configuration

Guide me to the relevant files."

## Step 2: Understand Current Implementation
Prompt:
"Now that we've found these files:
- src/services/notificationService.ts
- src/components/NotificationToast.tsx
- src/hooks/useNotifications.ts

Explain:
1. How notifications currently work
2. The complete flow from trigger to display
3. What data structures are used
4. Any external dependencies"

## Step 3: Plan Modification
Prompt:
"I need to add email notifications in addition to in-app notifications.

Based on the current architecture, suggest:
1. Where to add email notification logic
2. How to maintain consistency with in-app notifications
3. What files need to be modified
4. Potential issues to watch for"
```

### Workflow 3: Code Review Preparation

**Objective:** Quickly understand a PR's impact on the repository.

```markdown
## Step 1: Get PR Context
Prompt:
"I'm reviewing a PR that changes these files:
- src/api/authentication.ts
- src/middleware/authMiddleware.ts
- tests/auth.test.ts

In the context of this repository [paste structure],
help me understand:
1. What parts of the system are affected?
2. What else might be impacted by these changes?
3. What should I look for in review?"

## Step 2: Analyze Changes
[Review the actual code changes]

## Step 3: Impact Analysis
Prompt:
"Given these changes to authentication:

[paste diff or summary]

What are the potential impacts on:
1. Existing authenticated endpoints
2. User sessions
3. Other authentication-related code
4. Test coverage

What files should I check for side effects?"
```

---

## 🎯 Advanced Techniques

### Technique 1: Cross-Repository Pattern Recognition

When working with multiple repositories:

```
I'm familiar with Repository A's architecture:
[describe architecture]

Now I'm looking at Repository B's structure:
[paste Repository B structure]

Help me:
1. Identify similarities and differences
2. Map concepts from A to B
3. Understand what's unique to B
4. Predict where common features are located
```

### Technique 2: Legacy Code Understanding

For older or poorly documented codebases:

```
This is legacy code with minimal documentation.

Here's what I found:
- File structure: [paste]
- Sample files: [paste 2-3 files]
- Dependencies: [paste package.json]

Help me reverse-engineer:
1. The original architecture intent
2. Key design decisions
3. Data flow patterns
4. Why things are structured this way
5. What modern patterns this resembles

Be a code archaeologist!
```

### Technique 3: Monorepo Navigation

For monorepos with multiple packages:

```
This is a monorepo with packages:
- packages/api/
- packages/web/
- packages/mobile/
- packages/shared/

Structure:
[paste tree output]

Help me understand:
1. How packages relate to each other
2. Shared dependencies management
3. Build and deployment strategy
4. Where to make changes for feature X
5. Testing approach across packages
```

---

## 📊 Repository Health Analysis

### Analyzing Code Quality and Maintainability

```
Analyze this repository's health:

Key indicators:
- Number of files: [number]
- Lines of code: [number]
- Test coverage: [percentage]
- Number of dependencies: [number]
- Last major refactor: [date]

Sample files:
[paste 5 representative files showing different patterns]

Assess:
1. Code organization quality
2. Consistency across codebase
3. Test coverage adequacy
4. Potential technical debt
5. Areas needing improvement
6. Modernization opportunities

Provide specific, actionable recommendations.
```

### Identifying Refactoring Opportunities

```
Looking at this repository structure and these sample files:

[paste structure and samples]

Identify refactoring opportunities:
1. Code duplication patterns
2. Overly complex files/functions
3. Inconsistent patterns
4. Missing abstractions
5. Outdated approaches
6. Quick wins vs. major refactors

Prioritize by impact and effort.
```

---

## ✅ Best Practices

### Do's ✅

**Repository Analysis:**
- ✅ Start with high-level structure before diving into details
- ✅ Use tree commands to get organized snapshots
- ✅ Analyze 3-5 representative files to understand patterns
- ✅ Document your findings for future reference
- ✅ Create architectural diagrams early
- ✅ Ask about conventions before making changes

**Code Discovery:**
- ✅ Describe what you're looking for functionally
- ✅ Provide repository context in prompts
- ✅ Ask for related files and dependencies
- ✅ Verify understanding by explaining back to Claude
- ✅ Build mental models of data flow

**Documentation:**
- ✅ Keep repository documentation up to date
- ✅ Create onboarding guides for new developers
- ✅ Document non-obvious architectural decisions
- ✅ Include Mermaid diagrams for visual understanding
- ✅ Maintain a developer guide section in README

### Don'ts ❌

**Repository Analysis:**
- ❌ Don't paste entire large files into prompts
- ❌ Don't skip understanding the overall structure
- ❌ Don't assume patterns without verification
- ❌ Don't make changes without understanding impact
- ❌ Don't ignore existing conventions

**Code Discovery:**
- ❌ Don't search for files by name alone
- ❌ Don't analyze code in isolation
- ❌ Don't skip checking for related code
- ❌ Don't assume patterns are consistent
- ❌ Don't forget to trace dependencies

**Documentation:**
- ❌ Don't create documentation and never update it
- ❌ Don't over-document obvious things
- ❌ Don't write documentation only you can understand
- ❌ Don't skip diagram creation
- ❌ Don't forget to explain "why" decisions

---

## 🏋️ Exercises

### Exercise 1: Open Source Repository Analysis

**Difficulty:** Beginner  
**Time:** 45 minutes

**Task:**
1. Choose a popular open source repository (e.g., React, Vue, Express)
2. Use Claude to analyze its structure
3. Create a 1-page architectural overview document
4. Identify 3 key patterns used
5. Create a Mermaid diagram of the main components

**Deliverable:** Architecture overview document with diagram

### Exercise 2: Legacy Codebase Investigation

**Difficulty:** Intermediate  
**Time:** 90 minutes

**Task:**
1. Find an older codebase (your company's or open source)
2. Use Claude to understand its architecture
3. Identify technical debt areas
4. Create a modernization proposal
5. Prioritize refactoring opportunities

**Deliverable:** Technical debt analysis and refactoring roadmap

### Exercise 3: Monorepo Deep Dive

**Difficulty:** Advanced  
**Time:** 2 hours

**Task:**
1. Analyze a monorepo structure (e.g., Nx, Turborepo example)
2. Map dependencies between packages
3. Understand shared code patterns
4. Document build and deployment flow
5. Create package relationship diagram

**Deliverable:** Monorepo architecture documentation

### Exercise 4: Personal Repository Audit

**Difficulty:** Intermediate  
**Time:** 60 minutes

**Task:**
1. Choose one of your work repositories
2. Analyze structure and patterns with Claude
3. Identify inconsistencies and improvements
4. Create/update repository README
5. Generate architecture diagrams

**Deliverable:** Enhanced repository documentation

---

## 🎓 Real-World Scenarios

### Scenario 1: Joining a New Team

**Context:** You just joined a team with a large codebase you've never seen.

**Approach:**
```markdown
Day 1 Morning: Repository Structure
- Get repository tree
- Analyze with Claude
- Understand tech stack
- Identify entry points

Day 1 Afternoon: Convention Discovery
- Review sample files
- Identify patterns
- Understand testing approach
- Learn deployment process

Day 2: Feature Tracing
- Pick a feature to understand
- Trace code flow with Claude
- Document your findings
- Ask team for validation

Day 3: Make First Contribution
- Find a small bug or documentation issue
- Fix with AI assistance
- Submit PR
- Learn review process

Result: Productive in 3 days instead of 3 weeks
```

### Scenario 2: Incident Response

**Context:** Production issue in code you didn't write.

**Approach:**
```markdown
Step 1: Locate Relevant Code (5 min)
Prompt:
"Production error: 'User authentication failing for OAuth users'

Repository structure: [paste]

Help me quickly locate:
1. OAuth authentication code
2. User authentication flow
3. Recent changes to auth
4. Where to add logging"

Step 2: Understand Context (10 min)
Prompt:
"Here's the auth code: [paste]

Explain:
1. How OAuth flow works
2. Where it could fail
3. What the error means
4. Potential root causes"

Step 3: Diagnose and Fix (20 min)
[Investigate with Claude's help]
[Implement fix]
[Test]

Result: Issue resolved in 35 minutes with full understanding
```

### Scenario 3: Feature Planning

**Context:** Need to add a major feature to existing codebase.

**Approach:**
```markdown
Phase 1: Understand Current Architecture
- Analyze repository structure
- Identify relevant existing features
- Map out dependencies
- Understand data models

Phase 2: Locate Extension Points
Prompt:
"I need to add [feature description].

Based on current architecture [paste context],
where should this feature be implemented?
What existing patterns should I follow?
What files need modification?"

Phase 3: Impact Analysis
Prompt:
"What's the impact of adding this feature on:
1. Existing features
2. Database schema
3. API contracts
4. Frontend components
5. Test coverage"

Phase 4: Implementation Plan
[Create detailed plan with Claude]
[Review with team]
[Execute]

Result: Well-planned feature that fits architecture
```

---

## 📚 Additional Resources

### Tools for Repository Analysis

**Command-Line Tools:**
```bash
# Repository structure
tree -L 3 -I 'node_modules|.git|dist|build'

# File statistics
cloc . --exclude-dir=node_modules,dist,build

# Git statistics
git log --oneline --graph --all --decorate

# Find large files
find . -type f -size +1M -not -path "*/node_modules/*"

# Dependency graph (Node.js)
npx madge --circular --extensions ts,tsx src/
```

**IDE Plugins:**
- Project tree visualization
- Dependency graph viewers
- Code structure analyzers
- Architecture diagram generators

### Recommended Reading

- "Working Effectively with Legacy Code" by Michael Feathers
- "Software Architecture: The Hard Parts" by Ford et al.
- "Domain-Driven Design" by Eric Evans
- "The Pragmatic Programmer" by Hunt & Thomas

### Practice Repositories

**For Learning:**
- React (facebook/react)
- Vue.js (vuejs/core)
- Express (expressjs/express)
- NestJS (nestjs/nest)

**For Exercises:**
- Any large open source project in your tech stack
- Company repositories (with permission)
- Personal projects to improve

---

## 🎯 Key Takeaways

1. **Start High-Level:** Always analyze overall structure before diving into details

2. **Use Context Strategically:** Provide just enough context for Claude to help effectively

3. **Build Mental Models:** Don't just find code, understand architecture and patterns

4. **Document Discoveries:** Create documentation for yourself and future developers

5. **Verify Understanding:** Ask Claude to explain back to ensure you understood correctly

6. **Respect Conventions:** Discover and follow existing patterns before introducing new ones

7. **Think in Flows:** Understand data flow and dependencies, not just individual files

8. **Create Diagrams:** Visual representations accelerate understanding

9. **Continuous Learning:** Each repository teaches new patterns and approaches

10. **Share Knowledge:** Document what you learn to help others

---

## ✅ Mastery Checklist

By the end of this section, you should be able to:

- [ ] Analyze any repository and understand its architecture in under 30 minutes
- [ ] Create comprehensive repository documentation and diagrams
- [ ] Locate any feature or functionality without knowing file locations
- [ ] Identify architectural patterns and conventions quickly
- [ ] Understand dependencies and relationships between components
- [ ] Create onboarding guides for new developers
- [ ] Perform repository health analysis and identify tech debt
- [ ] Navigate monorepos and complex project structures
- [ ] Use AI assistance to accelerate repository understanding 5-10x

---

**Next:** [Multi-File Workflows →](./03-multi-file-workflows.md)

---

*"Understanding the forest is more important than memorizing individual trees."*

*Master repository workflows, accelerate your onboarding, ship features faster.*
