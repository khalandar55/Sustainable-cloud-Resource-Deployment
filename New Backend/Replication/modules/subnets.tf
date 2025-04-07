data "aws_subnets" "all" {}

output "subnets" {
  value = data.aws_subnets.all.ids
}
