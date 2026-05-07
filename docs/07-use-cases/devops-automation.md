# DevOps and Automation with Claude

## Overview and Context

DevOps encompasses continuous integration, continuous deployment, infrastructure automation, monitoring, and maintaining reliable systems at scale. Claude assists with writing Infrastructure as Code, creating CI/CD pipelines, automating routine tasks, troubleshooting production issues, and optimizing deployment workflows.

This guide focuses on practical DevOps workflows using tools like Docker, Kubernetes, Terraform, Ansible, GitHub Actions, and cloud platforms (AWS, GCP, Azure).

### Target Audience

- DevOps engineers managing infrastructure
- SREs maintaining production systems
- Platform engineers building developer platforms
- Backend developers handling deployments

## Common Challenges

### 1. Infrastructure as Code Complexity

Writing and maintaining Terraform, CloudFormation, or Pulumi configurations for complex infrastructure.

### 2. CI/CD Pipeline Design

Creating efficient, reliable pipelines with proper testing stages and deployment strategies.

### 3. Container Orchestration

Managing Kubernetes manifests, Helm charts, and container configurations.

### 4. Monitoring and Alerting

Setting up comprehensive monitoring, logging, and alerting systems.

### 5. Security and Compliance

Implementing security best practices, secrets management, and compliance requirements.

### 6. Incident Response

Quickly diagnosing and resolving production issues with limited context.

### 7. Cost Optimization

Managing cloud costs while maintaining performance and reliability.

## AI-Assisted Workflows

### Workflow 1: Infrastructure Provisioning

**Scenario**: Provisioning AWS infrastructure for a new microservice.

**Steps**:
1. Design infrastructure architecture
2. Write Terraform configurations
3. Set up VPC, subnets, security groups
4. Provision RDS, ElastiCache, Load Balancers
5. Configure Auto Scaling
6. Set up monitoring and alerts
7. Document infrastructure

### Workflow 2: CI/CD Pipeline Creation

**Scenario**: Setting up GitHub Actions pipeline for Node.js application.

**Steps**:
1. Define pipeline stages (lint, test, build, deploy)
2. Configure caching strategies
3. Set up multi-environment deployments
4. Implement deployment approvals
5. Add rollback mechanisms
6. Configure notifications
7. Optimize for speed

### Workflow 3: Kubernetes Deployment

**Scenario**: Deploying microservices to Kubernetes.

**Steps**:
1. Create Dockerfile with multi-stage builds
2. Write Kubernetes manifests (Deployments, Services, Ingress)
3. Configure ConfigMaps and Secrets
4. Set up health checks and resource limits
5. Implement HorizontalPodAutoscaler
6. Configure service mesh (Istio/Linkerd)
7. Set up monitoring with Prometheus

### Workflow 4: Disaster Recovery Setup

**Scenario**: Implementing backup and disaster recovery.

**Steps**:
1. Design backup strategy
2. Automate database backups
3. Set up cross-region replication
4. Create disaster recovery runbooks
5. Automate recovery testing
6. Document RTO/RPO targets
7. Implement failover procedures

### Workflow 5: Performance Optimization

**Scenario**: Optimizing application and infrastructure performance.

**Steps**:
1. Analyze performance metrics
2. Identify bottlenecks
3. Optimize resource allocation
4. Implement caching strategies
5. Configure CDN
6. Database query optimization
7. Load testing and validation

## Sample Prompts

### Infrastructure as Code

**Prompt 1: AWS Infrastructure with Terraform**
```
Create Terraform configuration for a production-ready 3-tier web application on AWS:

Requirements:
- VPC with public and private subnets across 3 AZs
- Application Load Balancer
- ECS Fargate for containers
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis cluster
- S3 bucket for static assets
- CloudFront distribution
- Route53 DNS configuration
- Security groups following least privilege
- Auto-scaling policies
- CloudWatch alarms

Include:
- Modular structure
- Variable definitions
- Outputs
- Backend configuration for remote state
- Best practices for production
```

**Prompt 2: Kubernetes Manifests**
```
Create Kubernetes manifests for a microservices application:

Services:
- API service (3 replicas, CPU/memory limits)
- Worker service (HPA based on queue length)
- Redis (StatefulSet)
- PostgreSQL (StatefulSet with persistent volumes)

Include:
- Deployments with rolling update strategy
- Services (ClusterIP, LoadBalancer)
- ConfigMaps for application config
- Secrets for sensitive data
- Ingress with TLS
- NetworkPolicies for isolation
- PodDisruptionBudgets
- Resource quotas
- Liveness and readiness probes
```

**Prompt 3: Docker Multi-Stage Build**
```
Create an optimized Dockerfile for a Node.js application:

Requirements:
- Multi-stage build (build stage + production stage)
- Minimize final image size
- Run as non-root user
- Use specific Node version (18-alpine)
- Include security scanning
- Cache npm dependencies efficiently
- Health check configuration
- Production-ready best practices

Application uses TypeScript and needs to be built before running.
```

### CI/CD Pipelines

**Prompt 4: GitHub Actions Workflow**
```
Create a comprehensive GitHub Actions workflow for a full-stack application:

Stages:
1. Code quality (lint, format check, type check)
2. Unit tests with coverage
3. Integration tests
4. Build Docker images
5. Security scanning (Snyk, Trivy)
6. Deploy to staging (automatic)
7. Run E2E tests against staging
8. Deploy to production (manual approval)
9. Run smoke tests
10. Notify team on Slack

Include:
- Matrix builds for multiple Node versions
- Caching for dependencies and Docker layers
- Parallel job execution
- Environment-specific secrets
- Rollback on failure
- Deployment notifications
```

**Prompt 5: GitLab CI Pipeline**
```
Create a GitLab CI/CD pipeline for a Python Django application:

Stages:
- Test (pytest, coverage, linting)
- Build (Docker image)
- Security scan
- Deploy to dev
- Deploy to staging
- Deploy to production

Include:
- DinD (Docker-in-Docker) configuration
- Database migrations
- Static file collection
- Cache configuration
- Manual approval for production
- Rollback job
- Notification on failure
```

### Monitoring and Observability

**Prompt 6: Prometheus Configuration**
```
Set up Prometheus monitoring for a Kubernetes cluster:

Metrics to collect:
- Node metrics (CPU, memory, disk, network)
- Pod metrics (resource usage, restart count)
- Application metrics (request rate, latency, errors)
- Database metrics (connections, query time)
- Custom business metrics

Include:
- Prometheus configuration
- ServiceMonitor definitions
- AlertManager rules for critical issues
- Recording rules for aggregations
- Grafana dashboard JSON
- Integration with PagerDuty
```

**Prompt 7: ELK Stack Setup**
```
Create Docker Compose configuration for ELK stack (Elasticsearch, Logstash, Kibana):

Requirements:
- Elasticsearch cluster (3 nodes)
- Logstash with input plugins (filebeat, syslog)
- Kibana with authentication
- Filebeat configuration for log shipping
- Log parsing and filtering
- Index lifecycle management
- Retention policies
- Security (SSL/TLS)

Include sample Logstash pipelines for:
- Application logs
- Nginx access logs
- System logs
```

### Automation Scripts

**Prompt 8: Backup Automation**
```
Create a bash script for automated PostgreSQL backups:

Features:
- Full database backup
- Compress with gzip
- Upload to S3 with versioning
- Keep last 30 days of backups
- Verify backup integrity
- Send notification on success/failure (Slack webhook)
- Log all operations
- Handle errors gracefully
- Support for multiple databases

Include:
- Systemd timer for scheduling
- Configuration file for settings
- Restoration script
- Testing procedures
```

**Prompt 9: Certificate Renewal Automation**
```
Create an Ansible playbook for SSL certificate management with Let's Encrypt:

Tasks:
- Install certbot
- Request certificates for multiple domains
- Configure auto-renewal with cron
- Deploy certificates to load balancers
- Restart services after renewal
- Verify certificate validity
- Send alerts before expiration
- Handle renewal failures

Support both nginx and Apache web servers.
```

### Troubleshooting and Incident Response

**Prompt 10: Log Analysis**
```
Analyze these application error logs and provide:

[Paste error logs]

1. Root cause analysis
2. Immediate remediation steps
3. Long-term fixes
4. Prevention measures
5. Monitoring improvements
6. Runbook updates

Consider common issues like:
- Memory leaks
- Database connection pool exhaustion
- API rate limiting
- Disk space issues
```

**Prompt 11: Performance Investigation**
```
Help debug a performance issue with these metrics:

Application: Node.js API
Symptoms:
- Response times increased from 50ms to 500ms
- CPU usage at 80%
- Memory usage stable
- Database query time normal
- No recent deployments

Metrics:
[Paste Prometheus/CloudWatch metrics]

Provide:
- Hypothesis for root cause
- Investigation steps
- Queries to run
- Profiling recommendations
- Potential fixes
```

### Security and Compliance

**Prompt 12: Security Hardening**
```
Review and harden this Kubernetes deployment:

[Paste deployment YAML]

Check for:
- Running as root
- Privileged containers
- Host network/PID namespace
- Resource limits missing
- Security contexts
- Image pull policies
- Secret management
- Network policies
- RBAC configurations

Provide hardened version following CIS benchmarks and security best practices.
```

**Prompt 13: Secrets Management**
```
Implement secrets management for a Kubernetes application using HashiCorp Vault:

Requirements:
- Vault deployment in HA mode
- Kubernetes auth method
- Dynamic database credentials
- Secret injection via sidecar
- Automatic rotation
- Audit logging
- Backup and disaster recovery

Include:
- Vault configuration
- Kubernetes service account setup
- Application integration example
- Rotation policies
- Monitoring and alerting
```

### Cost Optimization

**Prompt 14: AWS Cost Analysis**
```
Analyze AWS costs and provide optimization recommendations:

Current setup:
- 10 EC2 instances (t3.large, on-demand)
- RDS Multi-AZ (db.m5.xlarge)
- ElastiCache (cache.r5.large)
- S3 storage: 5TB
- Data transfer: 2TB/month
- CloudFront: 1TB/month

Provide:
- Reserved instance recommendations
- Right-sizing opportunities
- Storage optimization (S3 tiers, lifecycle policies)
- Data transfer reduction strategies
- Alternative services (Fargate vs EC2)
- Estimated monthly savings
```

**Prompt 15: Kubernetes Resource Optimization**
```
Optimize Kubernetes cluster resources:

Current state:
- 20 nodes (8 core, 32GB RAM each)
- Cluster utilization: 40% CPU, 50% memory
- Many pods with no resource limits
- Several overprovisioned deployments

Analyze and provide:
- Right-sizing recommendations per deployment
- Node pool optimization
- HPA configurations
- Cluster autoscaler settings
- Spot instance opportunities
- Cost savings estimate
```

## Real Examples with Code

### Example 1: Complete Terraform AWS Infrastructure

**Context**: Provisioning production infrastructure for a web application.

**Prompt to Claude**:
```
Create production-ready Terraform configuration for a 3-tier web application on AWS 
with high availability, security, and monitoring.
```

**Generated Code**:

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Environment = var.environment
      Project     = var.project_name
      ManagedBy   = "Terraform"
    }
  }
}

# terraform/variables.tf
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "project_name" {
  description = "Project name"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 3000
}

# terraform/vpc.tf
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "${var.project_name}-${var.environment}-vpc"
  cidr = var.vpc_cidr

  azs             = var.availability_zones
  private_subnets = [for k, v in var.availability_zones : cidrsubnet(var.vpc_cidr, 8, k)]
  public_subnets  = [for k, v in var.availability_zones : cidrsubnet(var.vpc_cidr, 8, k + 10)]
  database_subnets = [for k, v in var.availability_zones : cidrsubnet(var.vpc_cidr, 8, k + 20)]

  enable_nat_gateway   = true
  single_nat_gateway   = false
  enable_dns_hostnames = true
  enable_dns_support   = true

  create_database_subnet_group = true

  tags = {
    Name = "${var.project_name}-${var.environment}-vpc"
  }
}

# terraform/security_groups.tf
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "${var.project_name}-${var.environment}-ecs-tasks-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Application port from ALB"
    from_port       = var.app_port
    to_port         = var.app_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-ecs-tasks-sg"
  }
}

resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for RDS"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

resource "aws_security_group" "redis" {
  name        = "${var.project_name}-${var.environment}-redis-sg"
  description = "Security group for ElastiCache Redis"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Redis from ECS tasks"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-redis-sg"
  }
}

# terraform/alb.tf
resource "aws_lb" "main" {
  name               = "${var.project_name}-${var.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets

  enable_deletion_protection = true
  enable_http2              = true
  enable_cross_zone_load_balancing = true

  access_logs {
    bucket  = aws_s3_bucket.alb_logs.id
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-alb"
  }
}

resource "aws_lb_target_group" "app" {
  name        = "${var.project_name}-${var.environment}-tg"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 3
  }

  deregistration_delay = 30

  tags = {
    Name = "${var.project_name}-${var.environment}-tg"
  }
}

resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_lb.main.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS-1-2-2017-01"
  certificate_arn   = aws_acm_certificate.main.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# terraform/ecs.tf
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-cluster"
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-${var.environment}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:latest"
      
      portMappings = [
        {
          containerPort = var.app_port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = tostring(var.app_port)
        }
      ]

      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = "${aws_secretsmanager_secret.db_url.arn}"
        },
        {
          name      = "REDIS_URL"
          valueFrom = "${aws_secretsmanager_secret.redis_url.arn}"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.app_port}/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-${var.environment}-app-task"
  }
}

resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-${var.environment}-app-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 3
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = var.app_port
  }

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
    deployment_circuit_breaker {
      enable   = true
      rollback = true
    }
  }

  enable_execute_command = true

  depends_on = [aws_lb_listener.https]

  tags = {
    Name = "${var.project_name}-${var.environment}-app-service"
  }
}

# terraform/rds.tf
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-db-subnet-group"
  subnet_ids = module.vpc.database_subnets

  tags = {
    Name = "${var.project_name}-${var.environment}-db-subnet-group"
  }
}

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-${var.environment}-db"

  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"

  allocated_storage     = 100
  max_allocated_storage = 500
  storage_type          = "gp3"
  storage_encrypted     = true

  db_name  = "appdb"
  username = "dbadmin"
  password = random_password.db_password.result

  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  performance_insights_enabled    = true
  monitoring_interval            = 60
  monitoring_role_arn            = aws_iam_role.rds_monitoring.arn

  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "${var.project_name}-${var.environment}-db-final-snapshot"

  tags = {
    Name = "${var.project_name}-${var.environment}-db"
  }
}

# terraform/elasticache.tf
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-${var.environment}-redis-subnet-group"
  subnet_ids = module.vpc.private_subnets

  tags = {
    Name = "${var.project_name}-${var.environment}-redis-subnet-group"
  }
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "${var.project_name}-${var.environment}-redis"
  replication_group_description = "Redis cluster for ${var.project_name}"

  engine         = "redis"
  engine_version = "7.0"
  node_type      = "cache.t3.medium"

  num_cache_clusters = 3
  automatic_failover_enabled = true
  multi_az_enabled = true

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                = random_password.redis_password.result

  snapshot_retention_limit = 5
  snapshot_window         = "03:00-05:00"
  maintenance_window      = "mon:05:00-mon:07:00"

  auto_minor_version_upgrade = true
  apply_immediately         = false

  tags = {
    Name = "${var.project_name}-${var.environment}-redis"
  }
}

# terraform/autoscaling.tf
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 10
  min_capacity       = 3
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_cpu" {
  name               = "${var.project_name}-${var.environment}-cpu-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

resource "aws_appautoscaling_policy" "ecs_memory" {
  name               = "${var.project_name}-${var.environment}-memory-scaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 80.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}

# terraform/cloudwatch.tf
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}-${var.environment}/app"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-${var.environment}-app-logs"
  }
}

resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-${var.environment}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ECS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "${var.project_name}-${var.environment}-high-memory"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "85"
  alarm_description   = "This metric monitors ECS memory utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }
}

# terraform/outputs.tf
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis primary endpoint"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
  sensitive   = true
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}
```

**Outcome**: Complete, production-ready infrastructure with high availability, security, monitoring, and autoscaling.

### Example 2: GitHub Actions CI/CD Pipeline

**Context**: Complete CI/CD pipeline for a Node.js application.

**Prompt to Claude**:
```
Create a comprehensive GitHub Actions workflow with testing, building, security scanning,
and deployment to AWS ECS.
```

**Generated Workflow**:

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  AWS_REGION: us-east-1
  ECR_REPOSITORY: my-app

permissions:
  contents: read
  id-token: write
  pull-requests: write

jobs:
  code-quality:
    name: Code Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Type check
        run: npm run type-check

  test:
    name: Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16, 18, 20]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage

      - name: Upload coverage
        if: matrix.node-version == 18
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-${{ github.sha }}

  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
          POSTGRES_USER: testuser
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        run: npm run migrate
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

  security-scan:
    name: Security Scanning
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [code-quality, test, integration-tests]
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=sha,prefix={{branch}}-

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NODE_VERSION=${{ env.NODE_VERSION }}

      - name: Scan Docker image
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.meta.outputs.tags }}
          format: 'sarif'
          output: 'trivy-image-results.sarif'

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster my-app-staging-cluster \
            --service my-app-staging-service \
            --force-new-deployment \
            --desired-count 2

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster my-app-staging-cluster \
            --services my-app-staging-service

      - name: Run smoke tests
        run: |
          npm ci
          npm run test:smoke -- --base-url=https://staging.example.com

      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: deploy-staging
    if: github.ref == 'refs/heads/develop'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: https://staging.example.com

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security-scan, e2e-tests]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to ECS (Blue/Green)
        run: |
          # Update task definition with new image
          TASK_DEFINITION=$(aws ecs describe-task-definition \
            --task-definition my-app-prod \
            --query taskDefinition)
          
          NEW_TASK_DEF=$(echo $TASK_DEFINITION | \
            jq --arg IMAGE "${{ needs.build.outputs.image-tag }}" \
            '.containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')
          
          NEW_TASK_INFO=$(aws ecs register-task-definition \
            --cli-input-json "$NEW_TASK_DEF")
          
          NEW_REVISION=$(echo $NEW_TASK_INFO | jq -r '.taskDefinition.revision')
          
          # Update service
          aws ecs update-service \
            --cluster my-app-prod-cluster \
            --service my-app-prod-service \
            --task-definition my-app-prod:${NEW_REVISION} \
            --desired-count 3

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster my-app-prod-cluster \
            --services my-app-prod-service

      - name: Run smoke tests
        run: |
          npm ci
          npm run test:smoke -- --base-url=https://example.com

      - name: Rollback on failure
        if: failure()
        run: |
          aws ecs update-service \
            --cluster my-app-prod-cluster \
            --service my-app-prod-service \
            --force-new-deployment

      - name: Create GitHub release
        if: success()
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Deployed to production
            SHA: ${{ github.sha }}
          draft: false
          prerelease: false

      - name: Notify deployment
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Outcome**: Comprehensive CI/CD pipeline with testing, security scanning, and multi-environment deployments.

## Best Practices

### 1. Infrastructure as Code

**Use Modules**:
- Reusable modules for common patterns
- Version control for modules
- Clear input/output contracts

**State Management**:
- Remote state with locking
- Separate state per environment
- State backup and recovery

### 2. CI/CD Pipelines

**Fast Feedback**:
- Fail fast on errors
- Parallel job execution
- Efficient caching

**Security**:
- Scan dependencies
- Scan Docker images
- Secret scanning
- SAST/DAST tools

### 3. Containers

**Optimize Images**:
- Multi-stage builds
- Minimal base images
- Layer caching
- Security scanning

### 4. Monitoring

**Comprehensive Coverage**:
- Application metrics
- Infrastructure metrics
- Business metrics
- User experience metrics

**Actionable Alerts**:
- Alert on symptoms, not causes
- Appropriate thresholds
- Clear runbooks
- Escalation paths

## Metrics and Outcomes

### Deployment Frequency

**Before**:
- Manual deployments
- 2-3 deployments per week
- 2-4 hours per deployment

**With Claude**:
- Automated deployments
- 20+ deployments per day
- 10-15 minutes per deployment

### Infrastructure Provisioning

**Before**:
- Manual configuration: 2-3 days
- Terraform setup: 1-2 days
- Documentation: 1 day

**With Claude**:
- Complete infrastructure: 2-4 hours
- Production-ready configurations
- Auto-generated documentation

### Incident Response

- **MTTR reduction**: 60% faster
- **Automated remediation**: 40% of incidents
- **Documentation**: Automatic runbook generation

## Tools and Integrations

### Infrastructure

- **Terraform / Pulumi / CloudFormation**
- **Ansible / Chef / Puppet**
- **Docker / Kubernetes / ECS**

### CI/CD

- **GitHub Actions / GitLab CI**
- **Jenkins / CircleCI**
- **ArgoCD / Flux**

### Monitoring

- **Prometheus / Grafana**
- **Datadog / New Relic**
- **ELK Stack / Splunk**

### Cloud Platforms

- **AWS / GCP / Azure**
- **DigitalOcean / Linode**

## Conclusion

Claude accelerates DevOps workflows by generating production-ready Infrastructure as Code, comprehensive CI/CD pipelines, and monitoring configurations. Success comes from combining AI-generated code with your operational expertise, security requirements, and reliability standards.

Start with isolated components, validate in non-production environments, implement monitoring and alerting, and gradually expand to full production workflows.
