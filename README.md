# Instructions

## AWS secret

Create "MicrobloggingSecrets" witth the keys:

OPENAI_API_KEY
DB_FILE

## Policy

Create "microbloggingPolicy" with the content:
{
"Version": "2012-10-17",
"Statement": [
{
"Effect": "Allow",
"Action": [
"ec2:CreateSecurityGroup",
"ec2:DescribeSecurityGroups",
"ec2:DescribeVpcs",
"ec2:AuthorizeSecurityGroupIngress",
"ec2:AuthorizeSecurityGroupEgress",
"ec2:RevokeSecurityGroupEgress",
"ec2:RevokeSecurityGroupIngress",
"ec2:DeleteSecurityGroup",
"ec2:DescribeInstanceTypes",
"ec2:CreateTags",
"ec2:DescribeTags",
"ec2:DescribeInstanceAttribute",
"ec2:RunInstances",
"ec2:DescribeInstances",
"ec2:TerminateInstances",
"ec2:DescribeVolumes",
"ec2:DescribeInstanceCreditSpecifications",
"ec2:StopInstances",
"ec2:StartInstances",
"ec2:ModifyInstanceAttribute",
"ec2:DescribeNetworkInterfaces",
"ec2:ModifyNetworkInterfaceAttribute"
],
"Resource": "\*"
},
{
"Effect": "Allow",
"Action": [
"secretsmanager:GetSecretValue",
"secretsmanager:DescribeSecret",
"secretsmanager:ListSecretVersionIds"
],
"Resource": "\*"
},
{
"Effect": "Allow",
"Action": [
"iam:CreateInstanceProfile",
"iam:GetInstanceProfile",
"iam:AddRoleToInstanceProfile",
"iam:PassRole",
"iam:GetRole",
"iam:ListInstanceProfiles",
"iam:DeleteInstanceProfile",
"iam:RemoveRoleFromInstanceProfile"
],
"Resource": "\*"
}
]
}

The secretsmanager and iam sections should use a more restricted Resource than "\*"
Example for secretmanager (replace the \*\*\*\*\* for the AWS user ID):
"Resource": "arn:aws:secretsmanager:eu-west-2:\*\*\*\*\*:secret:MicrobloggingSecrets-\*"

Example for iam:
"Resource": [
"arn:aws:iam::**************:role/microbloggingRole",
"arn:aws:iam::**************:instance-profile/*",
"arn:aws:iam::**************:role/*"
]

## Role

Create microbloggingRole and attach to it microbloggingPolicy.

## VisualStudio

Also need a VisualStudio user with the policy microbloggingPolicy attached.
