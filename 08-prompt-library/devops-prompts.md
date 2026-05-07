# DevOps Prompts

Prompts for CI/CD, infrastructure, deployment, and operations.

## Table of Contents
- [CI/CD](#cicd)
- [Infrastructure as Code](#infrastructure-as-code)
- [Containerization](#containerization)
- [Monitoring](#monitoring)

---

## CI/CD

### 1. CI/CD Pipeline Design
```
Design CI/CD pipeline for:

Application: [type and stack]
Repository: [GitHub/GitLab/Bitbucket]
Deployment Target: [AWS/Azure/GCP/on-prem]
CI/CD Tool: [Jenkins/GitLab CI/GitHub Actions/CircleCI]

Design:
1. Build stage
2. Test stages (unit/integration/e2e)
3. Security scanning
4. Artifact creation
5. Deployment stages (dev/staging/prod)
6. Rollback procedure
7. Approval gates
8. Notification strategy
9. Environment variables management
10. Pipeline as code (YAML/Jenkinsfile)
```

**Usage Context**: Setting up deployment pipelines.

**Example Output**:
```yaml
# GitHub Actions CI/CD Pipeline
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Build application
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run dependency audit
        run: npm audit --audit-level=high
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      
      - name: Run SAST scan
        uses: github/codeql-action/analyze@v2

  build-docker:
    needs: [build-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ github.repository }}:latest
            ${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
          cache-from: type=registry,ref=${{ env.REGISTRY }}/${{ github.repository }}:buildcache
          cache-to: type=registry,ref=${{ env.REGISTRY }}/${{ github.repository }}:buildcache,mode=max

  deploy-staging:
    needs: build-docker
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - name: Deploy to staging
        uses: azure/webapps-deploy@v2
        with:
          app-name: myapp-staging
          images: ${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
      
      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/health || exit 1

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to production
        uses: azure/webapps-deploy@v2
        with:
          app-name: myapp-production
          images: ${{ env.REGISTRY }}/${{ github.repository }}:${{ github.sha }}
      
      - name: Run smoke tests
        run: |
          curl -f https://example.com/health || exit 1
      
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

### 2. Deployment Strategy
```
Design deployment strategy for:

Application: [description]
Current Process: [manual/automated]
Requirements: [zero downtime, rollback capability]
Infrastructure: [cloud provider]

Design:
1. Deployment pattern (blue-green/canary/rolling)
2. Smoke tests
3. Health checks
4. Rollback procedure
5. Database migrations handling
6. Feature flags
7. Gradual rollout
8. Monitoring during deployment
```

**Usage Context**: Planning deployment approaches.

---

### 3. Rollback Strategy
```
Design rollback strategy for:

Application: [description]
Deployment Method: [how you deploy]
Database: [if applicable]

Design:
1. Rollback triggers
2. Automated vs manual rollback
3. Database rollback approach
4. Traffic routing
5. Data consistency
6. Communication plan
7. Testing rollback procedure
```

**Usage Context**: Planning failure recovery.

---

## Infrastructure as Code

### 4. Terraform Infrastructure
```
Create Terraform configuration for:

Infrastructure: [AWS/Azure/GCP resources]
Environment: [dev/staging/prod]
Requirements: [high availability, scalability]

Create:
1. Provider configuration
2. Resource definitions
3. Variables and outputs
4. Modules (if applicable)
5. State management
6. Environment separation
7. Security configurations
8. Networking setup
```

**Usage Context**: Infrastructure automation.

---

### 5. Kubernetes Deployment
```
Create Kubernetes manifests for:

Application: [description]
Requirements: [replicas, resources, etc]
Environment: [cluster details]

Create:
1. Deployment manifest
2. Service manifest
3. ConfigMap
4. Secrets
5. Ingress
6. HorizontalPodAutoscaler
7. Resource limits
8. Health probes
9. Rolling update strategy
```

**Usage Context**: Deploying to Kubernetes.

**Example Output**:
```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1.0.0
    spec:
      containers:
      - name: myapp
        image: myregistry/myapp:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: NODE_ENV
          value: production
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
  namespace: production
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP

---
# HorizontalPodAutoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

---

### 6. Docker Optimization
```
Optimize Dockerfile for:

Application: [language and framework]
Current Dockerfile: [paste Dockerfile]
Goals: [smaller size, faster builds, security]

Optimize:
1. Multi-stage builds
2. Layer caching
3. Base image selection
4. Package manager optimization
5. Security hardening
6. .dockerignore
7. Build arguments
8. Health checks
```

**Usage Context**: Improving Docker images.

---

## Containerization

### 7. Docker Compose Setup
```
Create Docker Compose configuration for:

Application: [services needed]
Environment: [local development]

Create:
1. Service definitions
2. Network configuration
3. Volume mounts
4. Environment variables
5. Dependencies
6. Health checks
7. Development overrides
```

**Usage Context**: Local development environment.

---

### 8. Container Security
```
Harden container security:

Dockerfile: [paste Dockerfile]
Deployment: [Kubernetes/ECS/etc]

Implement:
1. Non-root user
2. Minimal base image
3. Vulnerability scanning
4. Secret management
5. Network policies
6. Resource limits
7. Read-only filesystem
8. Security context
```

**Usage Context**: Securing containers.

---

## Monitoring

### 9. Monitoring Setup
```
Design monitoring strategy for:

Application: [description]
Infrastructure: [hosting environment]
Tools: [Prometheus/Datadog/CloudWatch/etc]

Design:
1. Metrics to collect
2. Dashboards
3. Alerting rules
4. SLIs/SLOs
5. Log aggregation
6. Distributed tracing
7. Error tracking
8. Performance monitoring
```

**Usage Context**: Setting up observability.

---

### 10. Alerting Strategy
```
Design alerting strategy for:

Services: [list services]
On-call: [team structure]
Tools: [PagerDuty/Opsgenie/etc]

Design:
1. Alert rules
2. Severity levels
3. Escalation policy
4. Notification channels
5. Alert grouping
6. Alert fatigue prevention
7. Runbooks
8. Post-incident reviews
```

**Usage Context**: Setting up alerts.

---

## DevOps Prompt Template

```
DEVOPS REQUEST:

Type:
[CI/CD/Infrastructure/Monitoring/Deployment]

Application/Service:
[description and tech stack]

Current State:
[what exists now]

Requirements:
- Environment: [dev/staging/prod]
- Infrastructure: [AWS/Azure/GCP/on-prem]
- Tools: [specific tools to use]
- Constraints: [zero downtime, budget, etc]

Goals:
1. [primary goal]
2. [secondary goals]

Please Provide:
1. Design/architecture
2. Configuration files
3. Implementation steps
4. Testing approach
5. Rollback procedures
6. Documentation
7. Best practices
```

## Best Practices

1. **Specify Tools**: Exact CI/CD and infrastructure tools
2. **Include Requirements**: Uptime, performance, security
3. **Request Rollback Plans**: Always plan for failures
4. **Ask for Security**: Secrets management, scanning
5. **Include Monitoring**: Observability from the start
6. **Request Documentation**: Runbooks and procedures
7. **Specify Environments**: Dev, staging, production
8. **Ask for Tests**: Pipeline testing and validation
