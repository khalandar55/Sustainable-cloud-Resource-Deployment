# Create multiple security groups dynamically, one for each instance
resource "aws_security_group" "instance_sg" {
  count  = var.instance_count
  vpc_id = aws_vpc.custom_vpc.id

  # Ingress rules specific to each instance
  dynamic "ingress" {
    for_each = var.ec2_instances[count.index].ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = [ingress.value.cidr_block]
    }
  }

  # Egress rules specific to each instance
  dynamic "egress" {
    for_each = var.ec2_instances[count.index].egress_rules
    content {
      from_port   = egress.value.from_port
      to_port     = egress.value.to_port
      protocol    = egress.value.protocol
      cidr_blocks = [egress.value.cidr_block]
    }
  }

  tags = {
    Name = var.ec2_instances[count.index].sg_name
  }
}

# Create multiple EC2 instances dynamically
resource "aws_instance" "custom_instance" {
  count           = var.instance_count
  ami             = var.ec2_instances[count.index].ami_id
  instance_type   = var.ec2_instances[count.index].instance_type
  key_name        = var.ec2_instances[count.index].key_pair_name
  subnet_id       = var.ec2_instances[count.index].subnet_type == "public" ? aws_subnet.public_subnet.id : aws_subnet.private_subnet.id
  associate_public_ip_address = var.ec2_instances[count.index].subnet_type == "public" ? true : false

  # Attach the security group specific to each instance
  vpc_security_group_ids = [aws_security_group.instance_sg[count.index].id]

  tags = {
    Name = var.ec2_instances[count.index].name
  }
}
