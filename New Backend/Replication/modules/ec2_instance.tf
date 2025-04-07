data "aws_instances" "all" {
  filter {
    name   = "instance-state-name"
    values = ["running"]
  }
}

output "ec2_instances" {
  value = data.aws_instances.all.ids
}
