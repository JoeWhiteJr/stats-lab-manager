#!/bin/bash
# Database restore script for UVRL
# Usage: ./restore.sh <backup_file.dump>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file.dump>"
  echo ""
  echo "Available backups:"
  ls -lh /home/ubuntu/backups/backup_*.dump 2>/dev/null || echo "  No backups found"
  exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="statslab-db"
DB_USER="${DB_USER:-statslab}"
DB_NAME="${DB_NAME:-statslab}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will overwrite the current database!"
echo "Backup: $BACKUP_FILE"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Cancelled."
  exit 0
fi

echo "[$(date)] Restoring from $BACKUP_FILE..."

# Drop and recreate database
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "
  SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();
"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};"
docker exec "$CONTAINER_NAME" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

# Restore
cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" pg_restore -U "$DB_USER" -d "$DB_NAME" --no-owner --no-privileges

echo "[$(date)] Restore complete!"
