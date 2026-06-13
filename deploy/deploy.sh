#!/bin/bash

# Deployment script for Project Haribon API services to Lightsail
# Usage: ./deploy.sh [lightsail-ip]

set -e

LIGHTSAIL_IP=${1:-"your-lightsail-ip"}
PROJECT_DIR="/home/ec2-user/b-prism"
NGINX_CONF="/etc/nginx/conf.d/api.projectharibon.martinatole.com.conf"

echo "🚀 Starting deployment to Lightsail: $LIGHTSAIL_IP"

# Step 1: SSH and setup directory structure
echo "📁 Setting up project directory on Lightsail..."
ssh ec2-user@$LIGHTSAIL_IP "mkdir -p $PROJECT_DIR"

# Step 2: Copy only essential files to Lightsail
echo "📦 Copying essential files to Lightsail..."
rsync -avz --progress \
  --exclude node_modules \
  --exclude .git \
  --exclude .nx \
  --exclude dataset \
  --exclude notebooks \
  --exclude dist \
  --exclude build \
  --exclude apps \
  --exclude libs/backend/database-services \
  ./ ec2-user@$LIGHTSAIL_IP:$PROJECT_DIR/

# Copy authentication service lib specifically
echo "📦 Copying authentication service lib..."
rsync -avz --progress \
  libs/backend/database-services/authentication-mongodb-lib/ \
  ec2-user@$LIGHTSAIL_IP:$PROJECT_DIR/libs/backend/database-services/authentication-mongodb-lib/

# Step 3: Copy nginx configuration
echo "⚙️  Copying nginx configuration..."
scp deploy/nginx.conf ec2-user@$LIGHTSAIL_IP:/tmp/nginx.conf

# Step 4: Copy .env file (if exists)
if [ -f ".env.production" ]; then
  echo "🔐 Copying production .env file..."
  scp .env.production ec2-user@$LIGHTSAIL_IP:$PROJECT_DIR/.env
else
  echo "⚠️  Warning: .env.production not found. Please create it first."
  exit 1
fi

# Step 5: Execute deployment commands on Lightsail
echo "🔧 Running deployment commands on Lightsail..."
ssh ec2-user@$LIGHTSAIL_IP << ENDSSH
  set -e

  cd /home/ec2-user/b-prism

  # Stop existing containers
  echo "🛑 Stopping existing Docker containers..."
  docker-compose down || true

  # Start containers with existing images
  echo "🚀 Starting Docker containers..."
  docker-compose up -d

  # Wait for services to be healthy
  echo "⏳ Waiting for services to start..."
  sleep 30

  # Configure nginx
  echo "🌐 Configuring nginx..."
  sudo cp /tmp/nginx.conf /etc/nginx/conf.d/api.projectharibon.martinatole.com.conf
  sudo nginx -t
  sudo systemctl reload nginx

  # Check service status
  echo "📊 Checking service status..."
  docker-compose ps

  echo "✅ Deployment completed successfully!"
ENDSSH

echo "🎉 Deployment finished!"
