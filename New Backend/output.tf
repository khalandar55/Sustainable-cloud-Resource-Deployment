
# # Output VPC ID and CIDR Block
# output "vpc_id" {
#   description = "The ID of the created VPC"
#   value       = aws_vpc.custom_vpc.id
# }

# # Output EC2 Instance IDs and Public IPs
# output "instance_ids" {
#   description = "The IDs of all EC2 instances"
#   value       = aws_instance.custom_instance[*].id
# }

# output "instance_public_ips" {
#   description = "The public IPs of all EC2 instances"
#   value       = aws_instance.custom_instance[*].public_ip
# }

# # Placeholders for EC2 instance usernames and passwords
# output "instance_usernames" {
#   description = "Placeholders for EC2 instance usernames"
#   value       = ["username1", "username2"]  # Update accordingly
# }

# output "instance_passwords" {
#   description = "Placeholders for EC2 instance passwords"
#   value       = ["password1", "password2"]  # Update accordingly
# }

# # Output NAT Gateway (if created)
# output "nat_gateway_id" {
#   description = "The ID of the created NAT Gateway (if applicable)"
#   value       = length(aws_nat_gateway.nat_gw) > 0 ? aws_nat_gateway.nat_gw[0].id : null
# }
output "vpc_id" {
  value = aws_vpc.custom_vpc.id
}

output "nat_gateway_id" {
  value = length(aws_nat_gateway.nat_gw) > 0 ? aws_nat_gateway.nat_gw[0].id : null
}


output "ec2_instances" {
  value = [
    for instance in aws_instance.custom_instance: {
      id        = instance.id
      key_name  = instance.key_name
      name      = instance.tags["Name"]
      public_ip = instance.public_ip
    }
  ]
}
