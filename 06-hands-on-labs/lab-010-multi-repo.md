# Lab 010: Multi-Repository Workflow

## Learning Objectives

- Work across multiple repositories efficiently
- Coordinate changes across related repos
- Maintain consistency in multi-repo projects
- Automate cross-repo operations
- Track dependencies between repositories

## Prerequisites

- Understanding of git and monorepo concepts
- Experience with microservices or multi-package projects
- 45 minutes to complete

## Exercise 1: Multi-Repo Analysis (15 minutes)

### Map Repository Dependencies

```
Analyze these related repositories:

1. api-gateway (Node.js)
2. user-service (Node.js)
3. order-service (Python)
4. shared-types (TypeScript)
5. deployment-configs (YAML)

Task: Create a dependency map showing:
- Which repos depend on which
- Shared code/types between repos
- Deployment order requirements
- Communication patterns (REST, gRPC, message queue)
```

### Cross-Repo Change Planning

```
Plan a cross-repo feature implementation:

Feature: Add user preferences
Impacts:
- shared-types: New UserPreferences interface
- user-service: New endpoints and storage
- api-gateway: New routes
- order-service: Use preferences for recommendations

Create:
1. Implementation order
2. Version compatibility matrix
3. Rollback strategy
4. Testing approach
```

## Exercise 2: Automated Cross-Repo Operations (20 minutes)

### Multi-Repo Update Script

```bash
#!/bin/bash
# update-all-repos.sh

REPOS=(
  "api-gateway"
  "user-service"
  "order-service"
  "shared-types"
)

for repo in "${REPOS[@]}"; do
  echo "Updating $repo..."
  
  cd "$repo" || exit
  
  # Update from remote
  git fetch origin
  git pull origin main
  
  # Update dependencies
  if [ -f "package.json" ]; then
    npm install
  elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
  fi
  
  # Run tests
  npm test || python -m pytest
  
  cd ..
done
```

### Dependency Version Sync

```javascript
// scripts/sync-dependencies.js
import fs from 'fs';
import path from 'path';

const REPOS = [
  'api-gateway',
  'user-service',
  'order-service'
];

const SHARED_DEPS = {
  'shared-types': '^2.0.0',
  'logger': '^1.5.0',
  'config': '^3.0.0'
};

function syncDependencies() {
  REPOS.forEach(repo => {
    const pkgPath = path.join(repo, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    let updated = false;
    Object.entries(SHARED_DEPS).forEach(([name, version]) => {
      if (pkg.dependencies[name] !== version) {
        pkg.dependencies[name] = version;
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(`Updated ${repo}`);
    }
  });
}
```

## Exercise 3: Cross-Repo Testing (10 minutes)

### Integration Test Suite

```javascript
// tests/integration/cross-repo.test.js
describe('Cross-Repo Integration', () => {
  beforeAll(async () => {
    // Start all services
    await startService('api-gateway');
    await startService('user-service');
    await startService('order-service');
  });
  
  it('should handle user creation across services', async () => {
    // Create user via API gateway
    const user = await apiGateway.post('/users', {
      name: 'Test User',
      email: 'test@example.com'
    });
    
    // Verify in user-service
    const userRecord = await userService.get(`/users/${user.id}`);
    expect(userRecord).toBeDefined();
    
    // Create order in order-service
    const order = await orderService.post('/orders', {
      userId: user.id,
      items: [{ id: 1, quantity: 2 }]
    });
    
    // Verify order linked to user
    expect(order.userId).toBe(user.id);
  });
});
```

## Common Issues

### Version Mismatch

```
Problem: Repos use incompatible versions of shared code

Solution:
1. Implement version compatibility matrix
2. Use semantic versioning strictly
3. Automated dependency checks
4. Lock file management
```

### Deployment Order

```
Problem: Services fail when deployed in wrong order

Solution:
1. Document deployment dependencies
2. Implement health checks
3. Use feature flags for gradual rollout
4. Backward compatibility requirements
```

## Summary

You've learned to:
- Analyze multi-repo dependencies
- Automate cross-repo operations
- Coordinate changes across repos
- Test multi-repo integrations
- Maintain version consistency

## Next Steps

- Implement multi-repo automation for your project
- Create dependency tracking system
- Proceed to Lab 011: Prompt Library

---

**Lab Completion**: You can now manage complex multi-repository projects effectively.
