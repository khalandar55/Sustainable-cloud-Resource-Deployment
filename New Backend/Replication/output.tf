output "ec2_instances" {
  value = module.aws_resources.ec2_instances
}

output "subnets" {
  value = module.aws_resources.subnets
}

output "security_groups" {
  value = module.aws_resources.security_groups
}
