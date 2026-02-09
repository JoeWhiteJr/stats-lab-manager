#!/bin/bash
# init-ssl.sh - Obtain initial SSL certificate from Let's Encrypt
# Run this ONCE on the EC2 instance BEFORE starting the Docker stack.
#
# Usage: bash deploy/init-ssl.sh your-email@example.com
#
# Prerequisites:
#   - Domain DNS must already point to this server's IP
#   - Port 80 must be open and not in use
#   - certbot must be installed (run setup-ec2.sh first)

set -euo pipefail

DOMAIN="utahvalleyresearchlab.com"
EMAIL="${1:-}"

if [ -z "$EMAIL" ]; then
    echo "Usage: bash deploy/init-ssl.sh your-email@example.com"
    echo ""
    echo "This script obtains an SSL certificate from Let's Encrypt."
    echo "Run it ONCE before starting the Docker stack."
    exit 1
fi

echo "=== Obtaining SSL certificate for $DOMAIN ==="

# Check certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "ERROR: certbot is not installed. Run setup-ec2.sh first."
    exit 1
fi

# Stop anything on port 80 so certbot can use standalone mode
echo "Stopping any services on port 80..."
sudo docker compose -f docker-compose.ec2.yml down 2>/dev/null || true

# Obtain certificate using standalone mode
echo "Requesting certificate..."
sudo certbot certonly --standalone \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL"

# Set up auto-renewal via cron (runs daily at 3am, reloads nginx after renewal)
echo "Setting up auto-renewal cron job..."
CRON_CMD="0 3 * * * certbot renew --quiet --deploy-hook 'docker exec statslab-nginx nginx -s reload'"
(sudo crontab -l 2>/dev/null | grep -v "certbot renew" ; echo "$CRON_CMD") | sudo crontab -

echo ""
echo "=== SSL certificate obtained successfully! ==="
echo ""
echo "Certificate files:"
echo "  /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
echo "  /etc/letsencrypt/live/$DOMAIN/privkey.pem"
echo ""
echo "Auto-renewal cron job installed (daily at 3am)."
echo ""
echo "Next: Start the application with:"
echo "  docker compose -f docker-compose.ec2.yml up -d --build"
