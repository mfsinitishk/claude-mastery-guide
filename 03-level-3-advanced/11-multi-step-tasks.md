# Multi-Step Tasks

## Breaking Down Complex Work into Manageable Sequences

---

## 🎯 Overview

Multi-step tasks involve coordinating multiple sequential or parallel actions to achieve a complex goal. Claude can plan, execute, and track progress through elaborate workflows.

**Time to Master:** 2-3 hours

---

## 🔧 Core Patterns

### Sequential Steps
```
Task: Deploy feature end-to-end

Step 1: Run tests → Step 2: Build → Step 3: Deploy staging
→ Step 4: Smoke test → Step 5: Deploy production
```

### Parallel Steps
```
Task: Setup new service

Parallel:
- Provision infrastructure
- Setup CI/CD
- Create database
- Configure monitoring

Then: Deploy application
```

### Conditional Steps
```
IF tests pass:
  Deploy to staging
ELSE:
  Fix tests, retry

IF staging healthy:
  Deploy to production
ELSE:
  Rollback, investigate
```

---

## 🎯 Examples

### Example 1: Feature Development
```
1. Design API contract
2. Generate backend code
3. Generate frontend code
4. Write tests
5. Run tests
6. Fix any failures
7. Generate documentation
8. Create PR
```

### Example 2: Database Migration
```
1. Analyze schema changes
2. Generate migration script
3. Test on dev database
4. Review for safety
5. Backup production
6. Apply to staging
7. Verify staging
8. Apply to production
9. Verify production
```

---

## ✅ Best Practices

✅ Break complex tasks into clear steps  
✅ Define dependencies between steps  
✅ Handle errors at each step  
✅ Track progress  
✅ Allow rollback points  

---

**Next:** [Multi-Repo Workflows →](./12-multi-repo-workflows.md)
