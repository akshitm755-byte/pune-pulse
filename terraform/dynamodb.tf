resource "aws_dynamodb_table" "users" {
  name         = "pune-pulse-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S" # S = String
  }
}

resource "aws_dynamodb_table" "hangouts" {
  name         = "pune-pulse-hangouts"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "hangoutId"

  attribute {
    name = "hangoutId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "schedule" {
  name         = "pune-pulse-schedule"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"    # Partition Key
  range_key    = "hangoutId" # Sort Key

  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name = "hangoutId"
    type = "S"
  }
}