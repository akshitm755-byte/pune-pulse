variable "aws_region" {
  description = "The AWS region to deploy to."
  type        = string
  default     = "ap-south-1" # <<< MAKE SURE THIS IS YOUR REGION
}

variable "github_oidc_thumbprint" {
  description = "The thumbprint for the GitHub OIDC provider."
  type        = string
  default     = "6938fd4d98bab03faadb97b34396831e3780c34a" # Standard thumbprint
}

variable "github_repo" {
  description = "Your GitHub repo in format 'owner/repo'"
  type        = string
  default     = "akshitm755/pune-pulse" # <<< EDIT THIS LATER
}

# --- Image URI variables ---
# These are placeholders. The CI/CD pipeline will populate them.
variable "frontend_image_uri" {
  type    = string
  default = "placeholder"
}
variable "user_service_image_uri" {
  type    = string
  default = "placeholder"
}
variable "hangout_service_image_uri" {
  type    = string
  default = "placeholder"
}
variable "filter_service_image_uri" {
  type    = string
  default = "placeholder"
}
variable "schedule_service_image_uri" {
  type    = string
  default = "placeholder"
}