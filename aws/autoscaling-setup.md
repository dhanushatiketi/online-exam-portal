# AWS Deployment and Auto Scaling Setup Guide

This guide provides step-by-step instructions to deploy the Online Examination Portal using AWS services to ensure it is secure, highly available, and scalable.

## 1. Amazon S3 Configuration

The application uses S3 to store student exam results as JSON files.

### Steps:
1. Open the **Amazon S3 Console**.
2. Click **Create bucket**.
3. **Bucket name**: e.g., `online-exam-portal-results` (must be globally unique).
4. **Region**: Select your preferred region (e.g., `us-east-1`).
5. **Block Public Access**: Keep "Block all public access" checked since the backend will access it securely via IAM roles.
6. Click **Create bucket**.
7. Create folder structures inside the bucket:
   - `students/`
   - `exams/`
   - `results/`

---

## 2. IAM Role Creation

We need to allow the EC2 instances to write to the S3 bucket securely without hardcoding access keys.

### Steps:
1. Open the **IAM Console**.
2. Navigate to **Roles** -> **Create role**.
3. Select **AWS service** -> **EC2** as the use case.
4. Attach the following permission policies:
   - `AmazonS3FullAccess` (or a custom restrictive policy just for the specific bucket).
5. Name the role: e.g., `EC2-S3-ExamPortal-Role`.
6. Click **Create role**.

---

## 3. EC2 Instance and Node.js Deployment (Launch Template)

To use Auto Scaling, we first need a baseline configuration, which we save as a Launch Template.

### Steps:
1. Open the **EC2 Console**.
2. Go to **Launch Templates** -> **Create launch template**.
3. **Template name**: `ExamPortal-Backend-Template`.
4. **AMI**: Select `Ubuntu Server 22.04 LTS`.
5. **Instance type**: `t2.micro` or `t3.micro`.
6. **Key pair**: Create or select an existing `.pem` key.
7. **Network settings**: Create a Security Group allowing:
   - SSH (Port 22)
   - HTTP (Port 80)
   - Custom TCP (Port 5000) for the Node.js backend
8. **Advanced details -> IAM instance profile**: Select `EC2-S3-ExamPortal-Role`.
9. **Advanced details -> User data**: Paste the following configuration script to auto-start the server on launch:
   ```bash
   #!/bin/bash
   # Update and install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs git
   
   # Setup app directory
   mkdir -p /app
   cd /app
   # Here you would clone your repo or download your code from S3
   # git clone <your-repo-url> .
   
   # For example purposes, assuming code is in /app/backend
   cd /app/backend
   npm install
   
   # Set environment variables
   export PORT=5000
   export MONGODB_URI="<your-mongodb-atlas-url>"
   export AWS_REGION="us-east-1"
   export AWS_S3_BUCKET_NAME="online-exam-portal-results"
   export JWT_SECRET="yourSuperSecretKey"
   
   # Start the application using PM2 to keep it alive
   sudo npm install -g pm2
   pm2 start server.js --name "exam-backend"
   pm2 startup systemd
   pm2 save
   ```
10. Click **Create launch template**.

---

## 4. Application Load Balancer (ALB) Configuration

The ALB distributes incoming traffic across multiple EC2 instances.

### Steps:
1. In the **EC2 Console**, go to **Load Balancers** -> **Create Load Balancer**.
2. Choose **Application Load Balancer**.
3. **Name**: `ExamPortal-ALB`.
4. **Scheme**: Internet-facing.
5. **Network mapping**: Select your VPC and at least two Subnets in different Availability Zones.
6. **Security Groups**: Create/Select a security group allowing HTTP (80) and HTTPS (443) from anywhere.
7. **Listeners and Routing**: 
   - Protocol HTTP, Port 80.
   - Click **Create target group**.
     - Target type: Instances.
     - Name: `ExamPortal-TG`.
     - Protocol: HTTP, Port: 5000.
     - Health checks path: `/` (Our Node script has `app.get('/')` returning status 200).
   - Return to ALB creation and select `ExamPortal-TG` as the listener target.
8. Click **Create load balancer**.

---

## 5. Auto Scaling Group (ASG) Setup

Automatically scale EC2 instances based on traffic.

### Steps:
1. In the **EC2 Console**, go to **Auto Scaling Groups** -> **Create Auto Scaling group**.
2. **Name**: `ExamPortal-ASG`.
3. **Launch template**: Select `ExamPortal-Backend-Template`.
4. **Network**: Select your VPC and the same subnets as your Load Balancer.
5. **Load balancing**: Select **Attach to an existing load balancer** -> choose `ExamPortal-TG`.
6. Enable **ELB health checks**.
7. **Group size**: 
   - Desired capacity: 1
   - Minimum capacity: 1
   - Maximum capacity: 3 (or 5)
8. **Scaling policies**: Select **Target tracking scaling policy**.
   - Metric type: `Average CPU utilization`.
   - Target value: `70%`.
9. Click **Create Auto Scaling group**.

---

## 6. CloudWatch Monitoring

By default, the ASG creates a target tracking policy, which automatically creates CloudWatch Alarms. 

### To configure explicit Alarms (Optional):
1. Open the **CloudWatch Console**.
2. Go to **Alarms** -> **Create alarm**.
3. **Select metric**: `EC2` -> `By Auto Scaling Group` -> `CPUUtilization`.
4. Select `ExamPortal-ASG`.
5. **Threshold**: Greater than 80% for 1 data point.
6. Configure action: **Auto Scaling action** -> Scale out (add instances).

*Following these steps ensures that when students start their exams concurrently, the ASG will spin up new EC2 backend servers to handle the load, the ALB will route traffic properly, and the results will be securely pushed to S3 using the instances' IAM Role.*
