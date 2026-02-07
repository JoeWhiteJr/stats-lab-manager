#!/bin/bash
# Sets up daily backup cron job
# Run this once on the EC2 instance

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Add cron job for daily backup at 2 AM
(crontab -l 2>/dev/null | grep -v "backup.sh"; echo "0 2 * * * ${SCRIPT_DIR}/backup.sh >> /var/log/uvrl-backup.log 2>&1") | crontab -

echo "Cron job installed. Daily backup at 2 AM."
echo "Logs: /var/log/uvrl-backup.log"
crontab -l | grep backup
