# Lightsail Deployment Guide

## Prerequisites

1. **Lightsail Instance** with:
   - Amazon Linux 2023
   - Docker and Docker Compose installed
   - Nginx installed
   - SSH access configured

2. **Domain Configuration**:
   - `api.projectharibon.martinatole.com` should point to your Lightsail public IP

3. **Local Requirements**:
   - `rsync` installed
   - SSH access to Lightsail instance (user: ec2-user)

## Initial Lightsail Setup (One-time)

### 1. Install Docker and Docker Compose

```bash
# SSH into your Lightsail instance
ssh ec2-user@your-lightsail-ip

# Update system
sudo dnf update -y

# Install Docker
sudo dnf install docker -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker ec2-user

# Install Docker Compose standalone
sudo dnf install -y curl
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version

# Log out and back in for group changes to take effect
exit
```

### 2. Install and Configure Nginx

```bash
# SSH back into Lightsail
ssh ec2-user@your-lightsail-ip

# Install Nginx
sudo dnf install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Amazon Linux uses conf.d instead of sites-enabled
# Remove default config if needed
sudo rm /etc/nginx/conf.d/default.conf 2>/dev/null || true
```

### 3. Configure Firewall

Amazon Linux 2023 uses AWS Security Groups instead of local firewall. Configure your Lightsail Security Group to allow:
- HTTP (port 80)
- HTTPS (port 443)
- SSH (port 22)

This is done through the AWS Lightsail console, not via command line.

## Deployment Steps

### 1. Update JWT Secrets

Edit `.env.production` and replace the placeholder JWT secrets with secure random strings:

```bash
# Generate secure random strings
openssl rand -base64 32
```

Update these lines in `.env.production`:
```
JWT_SECRET=your-generated-secret-here
JWT_REFRESH_SECRET=your-generated-secret-here
```

### 2. Run Deployment Script

```bash
# From your local project directory
cd /home/kaiju/development/b-prism

# Run deployment (replace with your actual Lightsail IP)
./deploy/deploy.sh your-lightsail-ip
```

The script will:
- Copy project files to Lightsail (excluding node_modules, .git, etc.)
- Copy nginx configuration
- Copy production .env file
- Build and start all Docker containers
- Configure and reload nginx

### 3. Verify Deployment

```bash
# SSH into Lightsail
ssh ec2-user@your-lightsail-ip

# Check container status
cd /home/ec2-user/b-prism
docker-compose ps

# Check nginx status
sudo systemctl status nginx

# Test individual services
curl http://localhost:3001/health  # auth service
curl http://localhost:3003/health  # user service
# ... etc for other services
```

### 4. Test from External

```bash
# Test API endpoints
curl https://api.projectharibon.martinatole.com/health
curl https://api.projectharibon.martinatole.com/api/v1/auth/health
```

## Service Ports Reference

| Service | Port | API Path |
|---------|------|----------|
| Authentication Service | 3001 | /api/v1/auth/ |
| Verification Service | 3002 | /api/v1/verification/ |
| User Service | 3003 | /api/v1/users/ |
| Warehouse Service | 3004 | /api/v1/warehouses/ |
| Dispensing Point Service | 3005 | /api/v1/dispensing-points/ |
| Rescue Post Service | 3006 | /api/v1/rescue-posts/ |
| Activity Log Service | 3007 | /api/v1/activity-logs/ |
| Mailer Service | 3008 | /api/v1/mailer/ |
| Road Network Service | 3009 | /api/v1/road-network/ |
| Role Service | 3010 | /api/v1/roles/ |

## Troubleshooting

### Containers not starting

```bash
# Check logs
docker-compose logs authentication-service
docker-compose logs user-service
# ... etc

# Restart specific service
docker-compose restart authentication-service
```

### Nginx not working

```bash
# Test nginx configuration
sudo nginx -t

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Reload nginx
sudo systemctl reload nginx
```

### Port conflicts

```bash
# Check what's using ports
sudo netstat -tulpn | grep LISTEN
```

### Database connection issues

- Verify MongoDB is accessible from Lightsail
- Check DATABASE_URL in .env.production
- Ensure MongoDB IP whitelist includes Lightsail IP

## Manual Deployment (Alternative)

If the script fails, you can deploy manually:

```bash
# 1. Copy files
rsync -avz --progress \
  --exclude node_modules \
  --exclude .git \
  --exclude .nx \
  --exclude dataset \
  --exclude notebooks \
  ./ ec2-user@your-lightsail-ip:/home/ec2-user/b-prism/

# 2. SSH into Lightsail
ssh ec2-user@your-lightsail-ip

# 3. Navigate to project
cd /home/ec2-user/b-prism

# 4. Copy .env file manually
# (create .env from .env.production)

# 5. Build and start
docker-compose build --no-cache
docker-compose up -d

# 6. Configure nginx
sudo cp deploy/nginx.conf /etc/nginx/conf.d/api.projectharibon.martinatole.com.conf
sudo nginx -t
sudo systemctl reload nginx
```

## SSL/HTTPS Setup (Optional but Recommended)

For production, you should set up SSL using Let's Encrypt:

```bash
# On Lightsail
sudo dnf install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d api.projectharibon.martinatole.com

# Certbot will automatically configure nginx for HTTPS
```

## Monitoring

To monitor your services:

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f authentication-service

# Check resource usage
docker stats
```
