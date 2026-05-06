# dezelisoftware Deployment

## Current Routing

Traffic currently flows through Cloudflare Tunnel into the compose-local nginx:

`cloudflared -> dezelisoftware.com -> localhost:80 -> dezelisoftware_web nginx`

The nginx container serves:

- `/` from the React build at `/usr/share/nginx/html`
- `/api/` to `http://backend:8000/api/`
- `/admin/` to `http://backend:8000/admin/`
- `/static/` from `/app/static/`
- `/media/` from `/app/media/`

React Router refreshes are handled with `try_files $uri $uri/ /index.html`.
The current nginx config does not include websocket proxy headers.

The compose file intentionally keeps nginx on `80:80` until a central nginx takes ownership of host port 80.

## Environment Files

Create production env files from the templates and keep real values out of Git:

- `back/.env.example` -> `back/.env.prod`
- `front/.env.production.example` -> `front/.env.production`

If `www.dezelisoftware.com` will be used, include it in `ALLOWED_HOSTS` before deployment.

## Deploy

Validate the compose file:

```bash
docker-compose -f dezelisoftware/docker-compose.yml config
```

Build and start:

```bash
docker-compose -f dezelisoftware/docker-compose.yml up -d --build
```

Check container state:

```bash
docker-compose -f dezelisoftware/docker-compose.yml ps
```

## Logs

```bash
docker-compose -f dezelisoftware/docker-compose.yml logs -f nginx
docker-compose -f dezelisoftware/docker-compose.yml logs -f backend
docker-compose -f dezelisoftware/docker-compose.yml logs -f db
```

## Restart

Restart the app stack:

```bash
docker-compose -f dezelisoftware/docker-compose.yml restart
```

Check or restart Cloudflare Tunnel:

```bash
sudo systemctl status cloudflared
sudo systemctl restart cloudflared
```

## Backup

Run the backup script from the parent directory that contains the repo:

```bash
./dezelisoftware/scripts/backup.sh
```

Or from inside the repo:

```bash
./scripts/backup.sh
```

Backups are written outside Git under:

```text
/home/dezeli/backups/dezelisoftware/YYYYMMDD-HHMMSS/
```

The backup includes:

- PostgreSQL dump from `dezelisoftware_db`
- `media_volume`
- `back/.env.prod`
- `nginx/default.conf`
- Rendered compose config

## Restore

1. Stop the stack if it is running:

```bash
docker-compose -f dezelisoftware/docker-compose.yml down
```

2. Restore `back/.env.prod`:

```bash
cp /home/dezeli/backups/dezelisoftware/YYYYMMDD-HHMMSS/back.env.prod dezelisoftware/back/.env.prod
```

3. Restore media:

```bash
docker volume create dezelisoftware_media_volume
docker run --rm -v dezelisoftware_media_volume:/media -v /home/dezeli/backups/dezelisoftware/YYYYMMDD-HHMMSS:/backup alpine:3.20 sh -c 'tar -xzf /backup/media.tar.gz -C /media'
```

4. Start the database and restore the dump:

```bash
docker-compose -f dezelisoftware/docker-compose.yml up -d db
cat /home/dezeli/backups/dezelisoftware/YYYYMMDD-HHMMSS/db.dump | docker exec -i dezelisoftware_db sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
```

5. Start the full stack:

```bash
docker-compose -f dezelisoftware/docker-compose.yml up -d --build
docker-compose -f dezelisoftware/docker-compose.yml ps
```

## Verification

Before committing locally:

```bash
docker-compose -f dezelisoftware/docker-compose.yml config
```

After pulling on the server:

```bash
docker-compose -f dezelisoftware/docker-compose.yml up -d --build
docker-compose -f dezelisoftware/docker-compose.yml ps
curl -I https://dezelisoftware.com
curl -I https://dezelisoftware.com/api/
```
