# AWS Region
variable "region" {
  description = "The AWS region to deploy resources in"
  type        = string
}

# VPC Name
variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
}

# NAT Gateway Toggle
variable "create_nat_gateway" {
  description = "Whether to create a NAT gateway"
  type        = bool
}

# Instance Count
variable "instance_count" {
  description = "Number of EC2 instances to create"
  type        = number
  default     = 1  # Default to 1 if not provided
}

variable "ec2_instances" {
  description = "List of EC2 instances to create"
  type = list(object({
    ami_id         = string
    instance_type  = string
    key_pair_name  = string
    subnet_type    = string
    name           = string
    sg_name        = string
    ingress_rules  = list(object({
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_block  = string
    }))
    egress_rules  = list(object({
      from_port   = number
      to_port     = number
      protocol    = string
      cidr_block  = string
    }))
  }))
}

# AWS Access Key
variable "access_key" {
  description = "The AWS access key"
  type        = string
}

# AWS Secret Key
variable "secret_key" {
  description = "The AWS secret key"
  type        = string
}
