#!/usr/bin/env bash
# deploy-ec2.sh - Deploy Stats Lab Manager to EC2
# Usage: ssh ubuntu@<EC2_IP> 'bash -s' < deploy/deploy-ec2.sh
#    OR: Run directly on the EC2 instance: bash /opt/stats-lab-manager/deploy/deploy-ec2.sh
set -euo pipefail

APP_DIR="/opt/stats-lab-manager"
SWAP_SIZE="2G"
SWAP_FILE="/swapfile"

echo "=== Stats Lab Manager EC2 Deployment ==="

# -------------------------------------------------------
# 1. Set up swap space (prevents OOM during Vite build)
# -------------------------------------------------------
if [ ! -f "$SWAP_FILE" ]; then
    echo "[1/5] Setting up ${SWAP_SIZE} swap space..."
    sudo fallocate -l "$SWAP_SIZE" "$SWAP_FILE"
    sudo chmod 600 "$SWAP_FILE"
    sudo mkswap "$SWAP_FILE"
    sudo swapon "$SWAP_FILE"
    # Persist across reboots
    if ! grep -q "$SWAP_FILE" /etc/fstab; then
        echo "${SWAP_FILE} none swap sw 0 0" | sudo tee -a /etc/fstab
    fi
    echo "    Swap enabled: $(swapon --show)"
else
    echo "[1/5] Swap already configured, ensuring it's active..."
    sudo swapon "$SWAP_FILE" 2>/dev/null || true
fi

# -------------------------------------------------------
# 2. Pull latest code
# -------------------------------------------------------
echo "[2/5] Pulling latest code..."
cd "$APP_DIR"
git pull origin main

# -------------------------------------------------------
# 3. Build and start containers
# -------------------------------------------------------
echo "[3/5] Building and starting containers..."
docker compose -f docker-compose.ec2.yml up -d --build --remove-orphans

# -------------------------------------------------------
# 4. Wait for DB and run migrations
# -------------------------------------------------------
echo "[4/5] Waiting for database to be healthy..."
RETRIES=30
until docker exec statslab-db pg_isready -U statslab -q 2>/dev/null; do
    RETRIES=$((RETRIES - 1))
    if [ "$RETRIES" -le 0 ]; then
        echo "    ERROR: Database did not become healthy in time"
        exit 1
    fi
    sleep 2
done
echo "    Database is ready. Running migrations..."

for f in database/migrations/*.sql; do
    echo "    Running $(basename "$f")..."
    docker exec -i statslab-db psql -U statslab -d statslab < "$f" || true
done
echo "    Migrations complete."

# -------------------------------------------------------
# 5. Verify deployment
# -------------------------------------------------------
echo "[5/5] Verifying deployment..."
sleep 3

# Check all containers are running
RUNNING=$(docker compose -f docker-compose.ec2.yml ps --format json 2>/dev/null | grep -c '"running"' || true)
EXPECTED=4
if [ "$RUNNING" -ge "$EXPECTED" ]; then
    echo "    All $EXPECTED containers are running."
else
    echo "    WARNING: Only $RUNNING of $EXPECTED containers are running."
    docker compose -f docker-compose.ec2.yml ps
fi

# Check health endpoint (try HTTPS first, fall back to HTTP)
HTTP_STATUS=$(curl -sk -o /dev/null -w "%{http_code}" https://localhost/health 2>/dev/null || echo "000")
if [ "$HTTP_STATUS" = "200" ]; then
    echo "    Health check passed (HTTPS 200)."
else
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health 2>/dev/null || echo "000")
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ]; then
        echo "    Health check passed (HTTP redirecting to HTTPS)."
    else
        echo "    WARNING: Health check returned HTTP $HTTP_STATUS"
    fi
fi

# Clean up dangling images
docker system prune -f 2>/dev/null || true

echo ""
echo "=== Deployment complete! ==="
echo "Site should be live at: https://utahvalleyresearchlab.com"
