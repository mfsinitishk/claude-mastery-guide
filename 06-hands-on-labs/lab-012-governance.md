# Lab 012: Implementing AI Governance

## Learning Objectives

- Establish AI usage policies and guidelines
- Implement access controls and audit logging
- Ensure compliance with security requirements
- Monitor AI usage and costs
- Create approval workflows for sensitive operations
- Document and communicate governance policies

## Prerequisites

- Understanding of security and compliance concepts
- Familiarity with organizational policies
- 45-60 minutes to complete

## Exercise 1: Policy Definition (15 minutes)

### Create AI Usage Policy

```markdown
# AI Usage Policy v1.0

## Purpose
Define acceptable and secure use of AI tools (Claude) within our organization.

## Scope
Applies to all employees, contractors, and systems using Claude.

## Approved Use Cases

### ✅ Allowed
- Code review and analysis
- Documentation generation
- Test case generation
- Bug investigation
- Architecture design assistance
- Learning and skill development
- Refactoring suggestions

### ⚠️ Requires Approval
- Access to production databases
- Deployment to production systems
- Customer data analysis
- Security vulnerability scanning
- API integrations with external services

### ❌ Prohibited
- Sharing customer PII
- Sharing authentication credentials
- Sharing proprietary algorithms
- Decision-making without human review
- Bypassing code review process
- Automated commits to main/master

## Data Classification

### Public Data ✅
- Open source code
- Public documentation
- General programming questions

### Internal Data ⚠️
- Internal documentation (requires approval)
- Non-sensitive architecture diagrams
- Anonymized performance metrics

### Confidential Data ❌
- Customer data
- Authentication credentials
- API keys and secrets
- Proprietary algorithms
- Financial information
- Personal information

## Security Requirements

1. **Authentication**
   - Use SSO when available
   - Multi-factor authentication required
   - Regular access review

2. **Data Protection**
   - No sharing of secrets or credentials
   - Sanitize code before sharing (remove keys)
   - Use environment variables, never hardcode

3. **Audit Logging**
   - All AI interactions logged
   - Quarterly audit reviews
   - Anomaly detection enabled

4. **Access Control**
   - Role-based access
   - Principle of least privilege
   - Regular access certification

## Compliance Requirements

- GDPR compliance for EU data
- SOC 2 compliance
- HIPAA compliance (if applicable)
- Industry-specific regulations

## Monitoring and Enforcement

- Monthly usage reviews
- Automated policy violation detection
- Incident response procedures
- Regular training and awareness

## Review and Updates
- Policy reviewed quarterly
- Updated as needed for new use cases
- Communicated to all users
```

### Risk Assessment Matrix

```markdown
## AI Usage Risk Matrix

| Use Case | Data Sensitivity | Risk Level | Controls Required |
|----------|-----------------|------------|-------------------|
| Code Review | Public/Internal | Low | Standard logging |
| Bug Investigation | Internal | Medium | Approval required |
| Database Queries | Confidential | High | Multi-approval + audit |
| Production Deployment | Confidential | Critical | Manual review + approval |
```

## Exercise 2: Access Control Implementation (20 minutes)

### Role-Based Access Control

```javascript
// governance/access-control.js

const ROLES = {
  DEVELOPER: 'developer',
  SENIOR_DEVELOPER: 'senior_developer',
  TECH_LEAD: 'tech_lead',
  ADMIN: 'admin'
};

const PERMISSIONS = {
  // Read permissions
  READ_CODE: 'read:code',
  READ_INTERNAL_DOCS: 'read:internal_docs',
  READ_PROD_LOGS: 'read:prod_logs',
  
  // Write permissions
  REVIEW_CODE: 'review:code',
  DEPLOY_STAGING: 'deploy:staging',
  DEPLOY_PRODUCTION: 'deploy:production',
  
  // Admin permissions
  MANAGE_USERS: 'admin:users',
  VIEW_AUDIT_LOGS: 'admin:audit',
  CONFIGURE_POLICIES: 'admin:policies'
};

const ROLE_PERMISSIONS = {
  [ROLES.DEVELOPER]: [
    PERMISSIONS.READ_CODE,
    PERMISSIONS.REVIEW_CODE
  ],
  [ROLES.SENIOR_DEVELOPER]: [
    PERMISSIONS.READ_CODE,
    PERMISSIONS.REVIEW_CODE,
    PERMISSIONS.READ_INTERNAL_DOCS,
    PERMISSIONS.DEPLOY_STAGING
  ],
  [ROLES.TECH_LEAD]: [
    PERMISSIONS.READ_CODE,
    PERMISSIONS.REVIEW_CODE,
    PERMISSIONS.READ_INTERNAL_DOCS,
    PERMISSIONS.DEPLOY_STAGING,
    PERMISSIONS.DEPLOY_PRODUCTION,
    PERMISSIONS.READ_PROD_LOGS
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS)
};

class AccessControl {
  constructor() {
    this.userRoles = new Map();
  }
  
  assignRole(userId, role) {
    if (!Object.values(ROLES).includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }
    this.userRoles.set(userId, role);
  }
  
  hasPermission(userId, permission) {
    const role = this.userRoles.get(userId);
    if (!role) return false;
    
    const permissions = ROLE_PERMISSIONS[role];
    return permissions.includes(permission);
  }
  
  requirePermission(userId, permission) {
    if (!this.hasPermission(userId, permission)) {
      throw new Error(
        `User ${userId} does not have permission: ${permission}`
      );
    }
  }
  
  getPermissions(userId) {
    const role = this.userRoles.get(userId);
    return ROLE_PERMISSIONS[role] || [];
  }
}

export { AccessControl, ROLES, PERMISSIONS };
```

### Approval Workflow

```javascript
// governance/approval-workflow.js

class ApprovalWorkflow {
  constructor() {
    this.pendingApprovals = new Map();
  }
  
  async requestApproval(operation) {
    const approvalId = this.generateApprovalId();
    
    const approval = {
      id: approvalId,
      operation: operation,
      requestedBy: operation.userId,
      requestedAt: new Date(),
      status: 'pending',
      approvers: this.getRequiredApprovers(operation),
      approvals: []
    };
    
    this.pendingApprovals.set(approvalId, approval);
    
    await this.notifyApprovers(approval);
    
    return approvalId;
  }
  
  async approve(approvalId, approverId) {
    const approval = this.pendingApprovals.get(approvalId);
    
    if (!approval) {
      throw new Error('Approval request not found');
    }
    
    if (!approval.approvers.includes(approverId)) {
      throw new Error('Not authorized to approve this request');
    }
    
    approval.approvals.push({
      approverId,
      timestamp: new Date(),
      decision: 'approved'
    });
    
    if (this.isFullyApproved(approval)) {
      approval.status = 'approved';
      await this.executeOperation(approval.operation);
    }
  }
  
  getRequiredApprovers(operation) {
    const { risk } = operation;
    
    switch (risk) {
      case 'low':
        return []; // No approval needed
      case 'medium':
        return ['tech_lead'];
      case 'high':
        return ['tech_lead', 'security_lead'];
      case 'critical':
        return ['tech_lead', 'security_lead', 'cto'];
      default:
        return ['tech_lead'];
    }
  }
  
  isFullyApproved(approval) {
    const approvedBy = approval.approvals.map(a => a.approverId);
    return approval.approvers.every(req => approvedBy.includes(req));
  }
}
```

## Exercise 3: Audit Logging (15 minutes)

### Comprehensive Audit System

```javascript
// governance/audit-logger.js

class AuditLogger {
  constructor(storage) {
    this.storage = storage;
  }
  
  async logInteraction(event) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventId: this.generateEventId(),
      userId: event.userId,
      action: event.action,
      resource: event.resource,
      details: {
        prompt: this.sanitizePrompt(event.prompt),
        response: event.response ? 'generated' : null,
        tokensUsed: event.tokensUsed,
        duration: event.duration
      },
      metadata: {
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        sessionId: event.sessionId
      },
      classification: this.classifyInteraction(event),
      riskLevel: this.assessRisk(event)
    };
    
    await this.storage.save(auditEntry);
    
    if (auditEntry.riskLevel === 'high' || auditEntry.riskLevel === 'critical') {
      await this.alertSecurityTeam(auditEntry);
    }
    
    return auditEntry.eventId;
  }
  
  sanitizePrompt(prompt) {
    // Remove potential secrets from audit logs
    let sanitized = prompt;
    
    // Remove API keys
    sanitized = sanitized.replace(/api[_-]?key['\"]?\s*[:=]\s*['\"]?[a-zA-Z0-9_-]+/gi, 'api_key=***');
    
    // Remove passwords
    sanitized = sanitized.replace(/password['\"]?\s*[:=]\s*['\"]?[^'\s]+/gi, 'password=***');
    
    // Remove tokens
    sanitized = sanitized.replace(/token['\"]?\s*[:=]\s*['\"]?[a-zA-Z0-9_-]+/gi, 'token=***');
    
    return sanitized;
  }
  
  classifyInteraction(event) {
    // Classify based on content
    if (this.containsPII(event.prompt)) {
      return 'contains_pii';
    }
    if (this.containsSecrets(event.prompt)) {
      return 'contains_secrets';
    }
    if (this.isProductionAccess(event)) {
      return 'production_access';
    }
    return 'standard';
  }
  
  assessRisk(event) {
    const factors = {
      hasPII: this.containsPII(event.prompt),
      hasSecrets: this.containsSecrets(event.prompt),
      isProduction: this.isProductionAccess(event),
      largeDataAccess: event.tokensUsed > 100000,
      offHours: this.isOffHours(event.timestamp)
    };
    
    const riskScore = Object.values(factors).filter(Boolean).length;
    
    if (riskScore >= 3) return 'critical';
    if (riskScore >= 2) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }
  
  async generateReport(startDate, endDate) {
    const entries = await this.storage.query({ startDate, endDate });
    
    return {
      period: { startDate, endDate },
      totalInteractions: entries.length,
      byUser: this.groupByUser(entries),
      byRiskLevel: this.groupByRisk(entries),
      violations: this.findViolations(entries),
      recommendations: this.generateRecommendations(entries)
    };
  }
}
```

### Monitoring Dashboard

```javascript
// governance/monitoring.js

class GovernanceMonitoring {
  async getDashboard() {
    return {
      usage: await this.getUsageMetrics(),
      compliance: await this.getComplianceMetrics(),
      risks: await this.getRiskMetrics(),
      costs: await this.getCostMetrics()
    };
  }
  
  async getUsageMetrics() {
    return {
      totalInteractions: 1234,
      activeUsers: 45,
      averageTokensPerDay: 125000,
      topUsers: [
        { userId: 'user1', interactions: 89 },
        { userId: 'user2', interactions: 67 }
      ],
      topUseCase: 'code_review'
    };
  }
  
  async getComplianceMetrics() {
    return {
      policyViolations: 2,
      unauthorizedAccess: 0,
      dataLeakage: 0,
      complianceScore: 98,
      lastAudit: '2026-04-01'
    };
  }
  
  async getRiskMetrics() {
    return {
      highRiskInteractions: 12,
      flaggedForReview: 3,
      securityIncidents: 0,
      averageRiskScore: 2.3
    };
  }
  
  async getCostMetrics() {
    return {
      totalCost: 4567.89,
      costPerUser: 101.51,
      budgetUtilization: 0.76,
      projectedMonthlyCost: 6000
    };
  }
}
```

## Exercise 4: Compliance Validation (10 minutes)

### Automated Compliance Checks

```javascript
// governance/compliance-checker.js

class ComplianceChecker {
  async validateInteraction(event) {
    const checks = [
      this.checkDataClassification(event),
      this.checkAccessAuthorization(event),
      this.checkApprovalRequirements(event),
      this.checkDataRetention(event),
      this.checkEncryption(event)
    ];
    
    const results = await Promise.all(checks);
    const violations = results.filter(r => !r.passed);
    
    return {
      compliant: violations.length === 0,
      violations: violations,
      recommendations: this.generateRecommendations(violations)
    };
  }
  
  checkDataClassification(event) {
    // Ensure data is properly classified
    const classification = this.classifyData(event.prompt);
    
    if (classification === 'confidential' && !event.approved) {
      return {
        passed: false,
        rule: 'data_classification',
        message: 'Confidential data requires approval'
      };
    }
    
    return { passed: true };
  }
  
  checkAccessAuthorization(event) {
    // Verify user has appropriate permissions
    const required = this.getRequiredPermission(event.action);
    const hasPermission = this.accessControl.hasPermission(
      event.userId,
      required
    );
    
    if (!hasPermission) {
      return {
        passed: false,
        rule: 'access_control',
        message: `Missing permission: ${required}`
      };
    }
    
    return { passed: true };
  }
}
```

## Common Issues

### Policy Too Restrictive

```
Solution:
1. Start with strict policies
2. Gather feedback from users
3. Adjust based on real usage
4. Document exceptions
5. Regular review cycles
```

### Lack of Adoption

```
Solution:
1. Communicate benefits clearly
2. Provide training
3. Make compliance easy
4. Automate where possible
5. Leadership buy-in
```

## Summary

You've learned to:
- Define AI usage policies
- Implement access controls
- Set up audit logging
- Monitor compliance
- Create approval workflows
- Validate compliance automatically

## Next Steps

1. Customize governance for your organization
2. Implement monitoring dashboards
3. Train team on policies
4. Proceed to Lab 013: Autonomous Testing

---

**Lab Completion**: You can now implement comprehensive AI governance for enterprise use.
