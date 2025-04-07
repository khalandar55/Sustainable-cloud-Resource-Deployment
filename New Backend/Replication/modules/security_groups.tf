data "aws_security_groups" "all" {}

output "security_groups" {
  value = data.aws_security_groups.all.ids
}
