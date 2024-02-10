# Define the AWS provider 
provider "aws" {
  region = "eu-west-2"
}

#Create EC2 Instance
resource "aws_instance" "app_instance" {
  ami           = "ami-027d95b1c717e8c5d"  # Example AMI, replace with a current one
  instance_type = "t2.micro"

  key_name = "microblogginKeyPair"

  # Security group to allow SSH and web traffic
 vpc_security_group_ids = [aws_security_group.app_sg.id]

user_data = <<-EOF
   #!/bin/bash
            sudo yum update -y
            
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="/home/ec2-user/.nvm"

            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
            nvm install node
            npm install -g npm@latest
            sudo yum install git -y

            mkdir -p /home/ec2-user/ServerDB-ZPAO
            chown ec2-user:ec2-user /home/ec2-user/ServerDB-ZPAO
            git clone https://github.com/FAC29A/ServerDB-ZPAO.git
            cd /home/ec2-user/ServerDB-ZPAO
            npm install
            npm install -g pm2
            pm2 start src/index.js --name Microblogging
            pm2 save
            pm2 startup
            EOF



  tags = {
    Name = "MicrobloggingTerraform"
  }
}

#Define Security Group
resource "aws_security_group" "app_sg" {
  name        = "app_sg"
  description = "Allow SSH, HTTP, and custom app port access"

  # SSH Access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Custom App Port (8080)
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "app_sg"
  }
}

output "app_url" {
  value = "http://${aws_instance.app_instance.public_ip}:8080/"
  description = "URL to access the application"
}


