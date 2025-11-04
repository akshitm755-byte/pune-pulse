# --- General ECS Stuff ---
resource "aws_security_group" "ecs_service" {
  name        = "pune-pulse-ecs-sg"
  description = "Allow traffic from ALB to ECS"
  vpc_id      = aws_vpc.main.id
  ingress {
    from_port       = 0 # Allow all ports from ALB
    to_port         = 0
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_cluster" "main" {
  name = "pune-pulse-cluster"
}

# --- 1. FRONTEND Service ---
resource "aws_ecs_task_definition" "frontend" {
  family                   = "pune-pulse-frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "frontend-container"
      image     = var.frontend_image_uri
      essential = true
      portMappings = [{ containerPort = 80 }] # Nginx port
      logConfiguration = {
        logDriver = "awslogs",
        options = { "awslogs-group" = aws_cloudwatch_log_group.frontend.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "ecs" }
      }
    }
  ])
}
resource "aws_ecs_service" "frontend" {
  name            = "pune-pulse-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id]
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend-container"
    container_port   = 80
  }
}

# --- 2. USER Service ---
resource "aws_ecs_task_definition" "user_service" {
  family                   = "pune-pulse-user-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn # Gives DynamoDB access
  container_definitions = jsonencode([
    {
      name      = "user-service-container"
      image     = var.user_service_image_uri
      essential = true
      portMappings = [{ containerPort = 8080 }] # Node app port
      logConfiguration = {
        logDriver = "awslogs",
        options = { "awslogs-group" = aws_cloudwatch_log_group.user_service.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "ecs" }
      }
    }
  ])
}
resource "aws_ecs_service" "user_service" {
  name            = "pune-pulse-user-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.user_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id]
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.user_service.arn
    container_name   = "user-service-container"
    container_port   = 8080
  }
}

# --- 3. HANGOUT Service ---
resource "aws_ecs_task_definition" "hangout_service" {
  family                   = "pune-pulse-hangout-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "hangout-service-container"
      image     = var.hangout_service_image_uri
      essential = true
      portMappings = [{ containerPort = 8080 }]
      logConfiguration = {
        logDriver = "awslogs",
        options = { "awslogs-group" = aws_cloudwatch_log_group.hangout_service.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "ecs" }
      }
    }
  ])
}
resource "aws_ecs_service" "hangout_service" {
  name            = "pune-pulse-hangout-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.hangout_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id]
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.hangout_service.arn
    container_name   = "hangout-service-container"
    container_port   = 8080
  }
}

# --- 4. FILTER Service ---
resource "aws_ecs_task_definition" "filter_service" {
  family                   = "pune-pulse-filter-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "filter-service-container"
      image     = var.filter_service_image_uri
      essential = true
      portMappings = [{ containerPort = 8080 }]
      logConfiguration = {
        logDriver = "awslogs",
        options = { "awslogs-group" = aws_cloudwatch_log_group.filter_service.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "ecs" }
      }
    }
  ])
}
resource "aws_ecs_service" "filter_service" {
  name            = "pune-pulse-filter-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.filter_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id]
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.filter_service.arn
    container_name   = "filter-service-container"
    container_port   = 8080
  }
}

# --- 5. SCHEDULE Service ---
resource "aws_ecs_task_definition" "schedule_service" {
  family                   = "pune-pulse-schedule-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "schedule-service-container"
      image     = var.schedule_service_image_uri
      essential = true
      portMappings = [{ containerPort = 8080 }]
      logConfiguration = {
        logDriver = "awslogs",
        options = { "awslogs-group" = aws_cloudwatch_log_group.schedule_service.name, "awslogs-region" = var.aws_region, "awslogs-stream-prefix" = "ecs" }
      }
    }
  ])
}
resource "aws_ecs_service" "schedule_service" {
  name            = "pune-pulse-schedule-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.schedule_service.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [for subnet in aws_subnet.public : subnet.id]
    security_groups = [aws_security_group.ecs_service.id]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.schedule_service.arn
    container_name   = "schedule-service-container"
    container_port   = 8080
  }
}