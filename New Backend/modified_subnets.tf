# Get the list of availability zones for the specified region
data "aws_availability_zones" "available" {
  state = "available"
}

# Public Subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.custom_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]  # Use the first available AZ
  map_public_ip_on_launch = true

  tags = {
    Name = "PublicSubnet"
  }
}

# Private Subnet
resource "aws_subnet" "private_subnet" {
  vpc_id                  = aws_vpc.custom_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = data.aws_availability_zones.available.names[1]  # Use the second available AZ
  map_public_ip_on_launch = false

  tags = {
    Name = "PrivateSubnet"
  }
}
