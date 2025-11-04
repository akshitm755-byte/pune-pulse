# Get all Availability Zones in the region
data "aws_availability_zones" "available" {}

# Create a new VPC for our project
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "pune-pulse-vpc"
  }
}

# Create Public Subnets
resource "aws_subnet" "public" {
  count             = 2 // Create 2 public subnets in different AZs
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${1 + count.index}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true // Instances here get a public IP

  tags = {
    Name = "pune-pulse-public-${count.index + 1}"
  }
}

# Create an Internet Gateway for public traffic
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "pune-pulse-igw" }
}

# Create a Route Table for public traffic
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" // Route all traffic
    gateway_id = aws_internet_gateway.gw.id
  }
  
  tags = { Name = "pune-pulse-public-rt" }
}

# Associate public subnets with the public route table
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}