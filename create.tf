# Define the AWS provider 
provider "aws" {
  region = "eu-west-2"
}

# Create an IAM instance profile for the microbloggingRole
resource "aws_iam_instance_profile" "microblogging_profile" {
  name = "microbloggingProfile"
  role = "microbloggingRole"
  }

#Create EC2 Instance
resource "aws_instance" "app_instance" {
  ami           = "ami-027d95b1c717e8c5d"
  instance_type = "t2.micro"
  key_name = "microblogginKeyPair"
  iam_instance_profile   = aws_iam_instance_profile.microblogging_profile.name
  # Security group to allow SSH and web traffic
 vpc_security_group_ids = [aws_security_group.app_sg.id]

user_data = <<-EOF
#!/bin/bash
sudo yum update -y
sudo yum install git -y

# Install a simple web server to serve the static index.html
sudo yum install -y httpd
# Start the web server
sudo service httpd start
# Enable httpd to start on boot
sudo systemctl enable httpd



# Install NVM as the ec2-user
sudo -u ec2-user bash <<'EOF2'
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
EOF2

# Ensure .bashrc exists, append NVM initialization to it for ec2-user, and ensure ownership is correct
touch /home/ec2-user/.bashrc
echo 'export NVM_DIR="$HOME/.nvm"' >> /home/ec2-user/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/ec2-user/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> /home/ec2-user/.bashrc
chown ec2-user:ec2-user /home/ec2-user/.bashrc

# Append the NVM source string to .bash_profile to ensure it's sourced for login shells
echo 'export NVM_DIR="$HOME/.nvm"' >> /home/ec2-user/.bash_profile
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/ec2-user/.bash_profile
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> /home/ec2-user/.bash_profile

# Run the rest of the commands as ec2-user in a login shell
sudo -i -u ec2-user bash <<'EOF3'
source $HOME/.bashrc
nvm install node
nvm alias default node

npm install -g npm@latest 

mkdir -p $HOME/ServerDB-ZPAO
git clone -b AWSSecrets https://github.com/FAC29A/ServerDB-ZPAO.git $HOME/ServerDB-ZPAO
cd $HOME/ServerDB-ZPAO
# Copy the index.html from your project to the web server's document root
sudo cp index.html /var/www/html/index.html

npm install
npm run start
# npm install -g pm2
# pm2 start src/index.js --name Microblogging
# pm2 save
# pm2 startup
EOF3
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

  # Port (80)
  ingress {
    from_port   = 80
    to_port     = 80
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

output "waiting_page" {
  value = "http://${aws_instance.app_instance.public_ip}/"
  description = "URL to access the waiting "
}

output "app_url" {
  value = "http://${aws_instance.app_instance.public_ip}:8080/"
  description = "URL to access the application"
}

