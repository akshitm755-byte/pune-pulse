terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Create 5 ECR repositories
resource "aws_ecr_repository" "frontend" {
  name = "pune-pulse-frontend"
  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "user_service" {
  name = "pune-pulse-user-service"
  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "hangout_service" {
  name = "pune-pulse-hangout-service"
  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "filter_service" {
  name = "pune-pulse-filter-service"
  image_tag_mutability = "MUTABLE"
}
resource "aws_ecr_repository" "schedule_service" {
  name = "pune-pulse-schedule-service"
  image_tag_mutability = "MUTABLE"
}

# Create 5 CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "frontend" {
  name = "/ecs/pune-pulse-frontend"
  retention_in_days = 7
}
resource "aws_cloudwatch_log_group" "user_service" {
  name = "/ecs/pune-pulse-user-service"
  retention_in_days = 7
}
resource "aws_cloudwatch_log_group" "hangout_service" {
  name = "/ecs/pune-pulse-hangout-service"
  retention_in_days = 7
}
resource "aws_cloudwatch_log_group" "filter_service" {
  name = "/ecs/pune-pulse-filter-service"
  retention_in_days = 7
}
resource "aws_cloudwatch_log_group" "schedule_service" {
  name = "/ecs/pune-pulse-schedule-service"
  retention_in_days = 7
}