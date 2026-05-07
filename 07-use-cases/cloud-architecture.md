# Cloud Architecture and Infrastructure as Code with Claude

## Overview

Cloud architecture involves designing scalable, reliable, and cost-effective systems on cloud platforms (AWS, GCP, Azure). Claude assists with architecture design, Infrastructure as Code, cost optimization, multi-region deployments, and cloud-native patterns.

## Common Challenges

- **Architecture Design**: Choosing the right cloud services and patterns
- **Cost Optimization**: Managing cloud spend while maintaining performance
- **Multi-Region**: Designing for high availability across regions
- **Security**: Implementing zero-trust architecture and compliance
- **Scalability**: Auto-scaling and handling traffic spikes
- **Disaster Recovery**: RTO/RPO requirements and backup strategies

## Sample Prompts

### Architecture Design
```
Design a cloud architecture for a global SaaS platform on AWS:

Requirements:
- 1M+ users across 5 continents
- < 100ms latency for 95% of requests
- 99.99% uptime SLA
- GDPR and SOC 2 compliance
- Real-time analytics dashboard
- Cost budget: $50k/month

Include:
- Multi-region setup
- Database replication strategy
- CDN configuration
- Load balancing
- Auto-scaling policies
- Disaster recovery plan
- Cost estimation
```

### Infrastructure as Code
```
Create Terraform modules for a 3-tier web application on AWS:

Tiers:
- Web (ALB + ECS Fargate)
- Application (ECS with auto-scaling)
- Data (RDS Multi-AZ, ElastiCache Redis)

Requirements:
- VPC with public/private subnets
- Security groups with least privilege
- SSL/TLS encryption
- CloudWatch monitoring and alarms
- S3 for static assets with CloudFront
- Secrets Manager for credentials
- Modular and reusable code
```

### Cost Optimization
```
Analyze and optimize AWS infrastructure costs:

Current monthly spend: $75,000

Resources:
- 50 EC2 instances (t3.xlarge, on-demand)
- RDS PostgreSQL (db.r5.2xlarge, Multi-AZ)
- S3: 10TB storage, 5TB monthly transfer
- CloudFront: 20TB monthly transfer
- ElastiCache: 5 cache.r5.xlarge nodes

Provide:
- Reserved instance recommendations
- Right-sizing opportunities
- S3 lifecycle policies
- Data transfer optimization
- Alternative services (Fargate vs EC2)
- Estimated savings
```

### Serverless Architecture
```
Design a serverless event-driven architecture on AWS:

Use case: Image processing pipeline
- Users upload images to S3
- Generate thumbnails (3 sizes)
- Extract metadata
- Run object detection (ML)
- Store results in DynamoDB
- Send notification via SNS

Include:
- Lambda functions design
- S3 event notifications
- SQS for queue management
- Step Functions workflow
- Error handling and retries
- Cost estimation
- CloudFormation or SAM template
```

## Real Example: Multi-Region Architecture

```hcl
# terraform/main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Primary region
provider "aws" {
  alias  = "primary"
  region = "us-east-1"
}

# DR region
provider "aws" {
  alias  = "dr"
  region = "us-west-2"
}

# Global resources
module "route53" {
  source = "./modules/route53"
  
  domain_name = var.domain_name
  primary_alb_dns = module.primary_app.alb_dns_name
  dr_alb_dns      = module.dr_app.alb_dns_name
  
  # Failover routing policy
  health_check_enabled = true
}

# Primary region infrastructure
module "primary_app" {
  source = "./modules/app-infrastructure"
  
  providers = {
    aws = aws.primary
  }
  
  environment = "production"
  region      = "us-east-1"
  
  vpc_cidr = "10.0.0.0/16"
  
  app_config = {
    min_capacity = 3
    max_capacity = 20
    desired_capacity = 5
  }
  
  database_config = {
    instance_class = "db.r5.xlarge"
    multi_az       = true
    backup_retention = 30
    replicate_to_region = "us-west-2"
  }
}

# DR region infrastructure
module "dr_app" {
  source = "./modules/app-infrastructure"
  
  providers = {
    aws = aws.dr
  }
  
  environment = "production-dr"
  region      = "us-west-2"
  
  vpc_cidr = "10.1.0.0/16"
  
  app_config = {
    min_capacity = 2
    max_capacity = 10
    desired_capacity = 2
  }
  
  database_config = {
    instance_class = "db.r5.large"
    multi_az       = false
    replica_source = module.primary_app.database_arn
  }
}

# Global CloudFront distribution
module "cdn" {
  source = "./modules/cloudfront"
  
  origins = [
    {
      domain_name = module.primary_app.alb_dns_name
      origin_id   = "primary"
      priority    = 1
    },
    {
      domain_name = module.dr_app.alb_dns_name
      origin_id   = "dr"
      priority    = 2
    }
  ]
  
  s3_bucket_name = var.static_assets_bucket
  ssl_certificate_arn = var.acm_certificate_arn
}

# Cross-region S3 replication
resource "aws_s3_bucket_replication_configuration" "assets" {
  provider = aws.primary
  bucket   = module.primary_app.assets_bucket_id
  role     = aws_iam_role.replication.arn

  rule {
    id     = "replicate-all"
    status = "Enabled"

    destination {
      bucket        = module.dr_app.assets_bucket_arn
      storage_class = "STANDARD_IA"
      
      replication_time {
        status = "Enabled"
        time {
          minutes = 15
        }
      }
    }
  }
}
```

## Best Practices

1. **Well-Architected Framework**: Follow AWS/GCP/Azure best practices
2. **Infrastructure as Code**: All infrastructure in version control
3. **Multi-Region**: Active-active or active-passive for critical services
4. **Monitoring**: CloudWatch/Stackdriver/Azure Monitor with actionable alerts
5. **Cost Management**: Tagging, budgets, and regular optimization reviews
6. **Security**: Least privilege IAM, encryption at rest/transit, security groups
7. **Disaster Recovery**: Regular DR drills and documented procedures

## Metrics

- **Availability**: 99.99% uptime (< 52 minutes downtime/year)
- **Latency**: p95 < 200ms, p99 < 500ms
- **Cost Efficiency**: < $0.10 per 1000 requests
- **Recovery Time**: RTO < 1 hour, RPO < 15 minutes
- **Deployment Frequency**: Multiple deploys per day with zero downtime

## Tools

- **Terraform / Pulumi**: Infrastructure as Code
- **CloudFormation / ARM / Deployment Manager**: Cloud-native IaC
- **AWS CDK**: Infrastructure in programming languages
- **Packer**: Machine image automation
- **Cloud Cost Management**: AWS Cost Explorer, GCP Billing, Azure Cost Management
- **Multi-cloud**: Kubernetes, service mesh (Istio)

## Conclusion

Claude accelerates cloud architecture by generating Infrastructure as Code, optimizing costs, and designing resilient multi-region systems. Success requires combining AI assistance with cloud expertise, cost awareness, and operational experience.
