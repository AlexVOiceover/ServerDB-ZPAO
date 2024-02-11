#!/bin/bash
# This script initializes Terraform, plans the infrastructure changes, and applies them automatically.

terraform init
terraform plan
terraform apply -auto-approve
