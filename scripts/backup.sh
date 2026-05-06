#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_ROOT="${BACKUP_ROOT:-/home/dezeli/backups/dezelisoftware}"
BACKUP_DIR="${BACKUP_ROOT}/${TIMESTAMP}"

mkdir -p "${BACKUP_DIR}"

cd "${PROJECT_ROOT}"

echo "Writing backup to ${BACKUP_DIR}"

docker exec dezelisoftware_db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
    > "${BACKUP_DIR}/db.dump"

docker run --rm \
    -v dezelisoftware_media_volume:/media:ro \
    -v "${BACKUP_DIR}:/backup" \
    alpine:3.20 \
    tar -czf /backup/media.tar.gz -C /media .

if [ -f back/.env.prod ]; then
    cp back/.env.prod "${BACKUP_DIR}/back.env.prod"
fi

if [ -f nginx/default.conf ]; then
    cp nginx/default.conf "${BACKUP_DIR}/nginx.default.conf"
fi

docker-compose -f "${COMPOSE_FILE}" config > "${BACKUP_DIR}/docker-compose.config.yml"

echo "Backup complete: ${BACKUP_DIR}"
