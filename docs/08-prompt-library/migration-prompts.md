# Migration Prompts

Prompts for code migrations, technology upgrades, and system modernization.

## Table of Contents
- [Language/Framework Migration](#languageframework-migration)
- [Database Migration](#database-migration)
- [Cloud Migration](#cloud-migration)
- [Version Upgrades](#version-upgrades)

---

## Language/Framework Migration

### 1. Language Migration
```
Plan migration from [source language] to [target language]:

Current Codebase: [size and structure]
Source Language: [language and version]
Target Language: [language and version]
Reason for Migration: [why migrating]
Timeline: [available time]

Create migration plan:
1. Codebase analysis
2. Migration strategy (big bang/incremental)
3. Translation patterns
4. Dependency mapping
5. Test migration approach
6. Risk assessment
7. Phased rollout plan
8. Rollback strategy
9. Success metrics
```

**Usage Context**: Moving between programming languages.

---

### 2. Framework Migration
```
Migrate from [old framework] to [new framework]:

Application: [description]
Current Framework: [name and version]
Target Framework: [name and version]
Codebase Size: [LOC, modules]

Plan:
1. Feature inventory
2. API mapping (old → new)
3. Migration phases
4. Parallel running strategy
5. Data migration
6. Testing strategy
7. Training needs
8. Timeline and milestones
```

**Usage Context**: Upgrading or changing frameworks.

**Example Input**:
```
Application: Web application
Current: AngularJS 1.x
Target: React 18
Codebase: 50K LOC, 200 components
```

**Example Output**:
```
ANGULARJS TO REACT MIGRATION PLAN

Phase 1: Preparation (Weeks 1-2)
1. Audit AngularJS codebase
   - Inventory all controllers, services, directives
   - Identify shared utilities and services
   - Document data flow and state management
   - List external dependencies

2. Set up React environment
   - Create React app with TypeScript
   - Configure build system (Webpack/Vite)
   - Set up state management (Redux/Context)
   - Configure routing (React Router)

3. Create mapping document
   AngularJS → React equivalents:
   - Controllers → Functional Components
   - $scope → useState/useReducer
   - Services → Custom Hooks/Context
   - Directives → Components/Hooks
   - $http → fetch/axios
   - ng-repeat → map()
   - ng-if/ng-show → conditional rendering

Phase 2: Hybrid Setup (Weeks 3-4)
1. Install ngReact or react2angular
2. Create wrapper components
3. Set up shared state mechanism
4. Implement routing bridge

Example hybrid component:
```javascript
// AngularJS module
angular.module('app').directive('reactUserList', function(react2angular) {
  return react2angular(UserListComponent, ['users', 'onUserClick']);
});

// Use in AngularJS template
<react-user-list users="$ctrl.users" on-user-click="$ctrl.handleClick">
</react-user-list>
```

Phase 3: Incremental Migration (Weeks 5-16)
Migrate in this order:
1. Leaf components (no dependencies)
2. Utility services → Custom hooks
3. Container components
4. Routing
5. State management

Week 5-6: Migrate simple components
- Buttons, inputs, cards
- No business logic

Week 7-8: Migrate services to hooks
```javascript
// AngularJS service
angular.module('app').service('UserService', function($http) {
  this.getUsers = function() {
    return $http.get('/api/users');
  };
});

// React hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);
  
  return { users, loading };
}
```

Week 9-12: Migrate feature modules
- User management
- Product catalog
- Shopping cart
- Checkout process

Week 13-14: State management
- Migrate from $scope to Redux/Context
- Implement Redux Toolkit
- Connect components to store

Week 15-16: Routing migration
- Move from ui-router to React Router
- Implement route guards
- Handle route parameters

Phase 4: Testing (Weeks 17-18)
1. Unit tests for all components
2. Integration tests for features
3. E2E tests for critical flows
4. Performance testing
5. Accessibility testing

Phase 5: Cleanup (Weeks 19-20)
1. Remove AngularJS dependencies
2. Remove hybrid code
3. Optimize bundle size
4. Update documentation
5. Train team on React

RISK MITIGATION:

High Risk: Breaking functionality
- Mitigation: Feature flags, incremental rollout
- Testing: Comprehensive test coverage

Medium Risk: Performance degradation
- Mitigation: Performance budgets, monitoring
- Testing: Lighthouse, bundle analysis

Low Risk: User confusion
- Mitigation: Maintain UI consistency
- Training: User guides if UI changes

SUCCESS METRICS:
- All features migrated and tested
- Bundle size reduction: Target 30%
- Performance improvement: Target 20% faster
- Zero critical bugs post-migration
- Team velocity maintained

ROLLBACK STRATEGY:
- Keep AngularJS version running in parallel
- Feature flags for each migrated section
- Database/API backward compatible
- Quick rollback procedure documented
```

---

### 3. Monolith to Microservices
```
Plan migration from monolith to microservices:

Monolith: [description and tech stack]
Size: [users, requests, data]
Pain Points: [current problems]
Team Size: [developers]

Design migration:
1. Service boundary identification
2. Strangler fig pattern implementation
3. Data decomposition strategy
4. API gateway setup
5. Service extraction order
6. Inter-service communication
7. Distributed transaction handling
8. Testing strategy
9. Deployment approach
```

**Usage Context**: Breaking down monolithic applications.

---

### 4. Legacy Code Modernization
```
Modernize legacy codebase:

Current State: [language, age, size]
Issues: [maintenance problems]
Target State: [desired modernization]
Constraints: [time, budget, team]

Create modernization plan:
1. Code assessment
2. Priority areas
3. Refactoring strategy
4. Dependency updates
5. Test coverage improvement
6. Documentation
7. Incremental rollout
8. Training plan
```

**Usage Context**: Updating old codebases.

---

## Database Migration

### 5. Database Platform Migration
```
Migrate database from [source] to [target]:

Source Database: [type and version]
Target Database: [type and version]
Data Volume: [size]
Downtime Tolerance: [acceptable downtime]

Plan:
1. Schema conversion
2. Data type mapping
3. Migration tools selection
4. Data validation strategy
5. Cutover plan
6. Rollback procedure
7. Performance testing
8. Application code changes
```

**Usage Context**: Moving between database systems.

---

### 6. Database Schema Migration
```
Migrate database schema:

Current Schema: [DDL or description]
Target Schema: [new design]
Data Volume: [record counts]
Constraints: [zero downtime required]

Create:
1. Migration scripts (forward and backward)
2. Data transformation logic
3. Index recreation strategy
4. Deployment sequence
5. Validation queries
6. Performance impact analysis
7. Rollback scripts
```

**Usage Context**: Changing database structure.

---

## Cloud Migration

### 7. Cloud Migration Strategy
```
Plan cloud migration:

Current Infrastructure: [on-prem/other cloud]
Target Cloud: [AWS/Azure/GCP]
Applications: [list applications]
Migration Deadline: [date]

Design:
1. Migration pattern (rehost/replatform/refactor)
2. Application prioritization
3. Network architecture
4. Security and compliance
5. Cost optimization
6. Migration tools
7. Testing strategy
8. Cutover plan
9. Post-migration optimization
```

**Usage Context**: Moving to cloud.

---

### 8. Multi-Cloud Strategy
```
Design multi-cloud approach:

Current Cloud: [provider]
Additional Cloud: [provider]
Reason: [disaster recovery/vendor lock-in/etc]

Design:
1. Service distribution strategy
2. Data replication
3. Networking setup
4. Identity management
5. Cost management
6. Disaster recovery
7. Compliance
8. Management tools
```

**Usage Context**: Implementing multi-cloud.

---

## Version Upgrades

### 9. Major Version Upgrade
```
Upgrade [framework/language] from v[X] to v[Y]:

Current Version: [version]
Target Version: [version]
Breaking Changes: [list known breaking changes]
Codebase Size: [LOC]

Plan:
1. Breaking changes analysis
2. Deprecation warnings review
3. Dependency updates
4. Code modifications needed
5. Testing strategy
6. Gradual rollout approach
7. Rollback plan
8. Timeline
```

**Usage Context**: Major version upgrades.

**Example Output**:
```
NODE.JS 16 TO 20 UPGRADE PLAN

Breaking Changes Analysis:

1. Removed APIs
   - require('url').parse() → Use URL constructor
   - crypto.DEFAULT_ENCODING → Not used
   
2. Changed Behaviors
   - crypto.createCipheriv() default changed
   - Buffer behavior updates
   - Stream API changes

3. Deprecated Features
   - Various legacy crypto methods
   - process.binding() access

Migration Steps:

Step 1: Update dependencies
```bash
# Update package.json
npm outdated
npm update

# Check for incompatibilities
npm install --engine-strict
```

Step 2: Code changes
```javascript
// Before (Node 16)
const url = require('url');
const parsed = url.parse('https://example.com/path');

// After (Node 20)
const url = new URL('https://example.com/path');
```

Step 3: Testing
1. Run full test suite on Node 20
2. Integration tests
3. Performance tests
4. Security scans

Step 4: Deployment
1. Deploy to dev environment
2. Monitor for 1 week
3. Deploy to staging
4. Monitor for 1 week
5. Deploy to production (canary)
6. Full production rollout

Rollback Plan:
- Keep Node 16 containers
- Feature flag for version
- Quick switch if issues
```

---

### 10. Dependency Updates
```
Update project dependencies:

Project: [description]
Package Manager: [npm/pip/maven/etc]
Current State: [outdated count]
Target: [latest/LTS/specific versions]

Plan:
1. Dependency audit
2. Security vulnerabilities
3. Breaking changes review
4. Update strategy (all at once/incremental)
5. Testing approach
6. Deployment plan
```

**Usage Context**: Updating dependencies.

---

## Migration Prompt Template

```
MIGRATION REQUEST:

Migration Type:
[language/framework/database/cloud/version]

Current State:
- Technology: [current tech and version]
- Size: [codebase/data size]
- Users: [user count, load]
- Issues: [problems with current state]

Target State:
- Technology: [target tech and version]
- Goals: [what you want to achieve]
- Timeline: [deadline]

Constraints:
- Downtime: [acceptable downtime]
- Budget: [if relevant]
- Team: [size and expertise]
- Business: [cannot break X, must maintain Y]

Risks:
- Known risks: [list known risks]
- Concerns: [what worries you]

Please Provide:
1. Migration strategy
2. Step-by-step plan
3. Code examples (before/after)
4. Testing approach
5. Rollback procedure
6. Timeline with milestones
7. Risk mitigation
8. Success metrics
```

## Best Practices

1. **Start with Assessment**: Understand current state fully
2. **Plan Incrementally**: Avoid big bang migrations
3. **Test Thoroughly**: Each phase needs testing
4. **Plan Rollbacks**: Always have a way back
5. **Monitor Closely**: Watch metrics during migration
6. **Communicate**: Keep stakeholders informed
7. **Document Everything**: Migration steps and decisions
8. **Train Team**: Ensure team understands new tech
