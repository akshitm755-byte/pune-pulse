# Security Group for the ALB (allows public web traffic)
resource "aws_security_group" "alb" {
  name        = "pune-pulse-alb-sg"
  description = "Allow HTTP traffic to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
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
}

# The Application Load Balancer
resource "aws_lb" "main" {
  name               = "pune-pulse-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [for subnet in aws_subnet.public : subnet.id]
}

# --- Target Group 1: Frontend ---
resource "aws_lb_target_group" "frontend" {
  name        = "pune-pulse-frontend-tg"
  port        = 80 # Nginx port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check { path = "/" } # Nginx serves /
}

# --- Target Group 2: User Service ---
resource "aws_lb_target_group" "user_service" {
  name        = "pune-pulse-user-tg"
  port        = 8080 # Node app port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check { path = "/api/users/health" }
}

# --- Target Group 3: Hangout Service ---
resource "aws_lb_target_group" "hangout_service" {
  name        = "pune-pulse-hangout-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check { path = "/api/hangouts/health" }
}

# --- Target Group 4: Filter Service ---
resource "aws_lb_target_group" "filter_service" {
  name        = "pune-pulse-filter-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check { path = "/api/filter/health" }
}

# --- Target Group 5: Schedule Service ---
resource "aws_lb_target_group" "schedule_service" {
  name        = "pune-pulse-schedule-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"
  health_check { path = "/api/schedule/health" }
}

# The ALB Listener (Listens on Port 80)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  # DEFAULT ACTION: Send to Frontend
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# --- Listener RULE 1: User Service ---
resource "aws_lb_listener_rule" "user_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 100
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.user_service.arn
  }
  condition {
    path_pattern {
      values = ["/api/users/*"]
    }
  }
}

# --- Listener RULE 2: Hangout Service ---
resource "aws_lb_listener_rule" "hangout_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 101
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.hangout_service.arn
  }
  condition {
    path_pattern {
      values = ["/api/hangouts/*"]
    }
  }
}

# --- Listener RULE 3: Filter Service ---
resource "aws_lb_listener_rule" "filter_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 102
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.filter_service.arn
  }
  condition {
    path_pattern {
      values = ["/api/filter/*"]
    }
  }
}

# --- Listener RULE 4: Schedule Service ---
resource "aws_lb_listener_rule" "schedule_service" {
  listener_arn = aws_lb_listener.http.arn
  priority     = 103
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.schedule_service.arn
  }
  condition {
    path_pattern {
      values = ["/api/schedule/*"]
    }
  }
}

# Output the DNS name of the ALB so we can access our app
output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.main.dns_name
}