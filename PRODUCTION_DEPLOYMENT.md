# Production Deployment Guide

## Prerequisites

- Python 3.10+
- PostgreSQL 14+
- Redis 7+
- Node.js 18+ (for frontend)
- Domain with SSL certificate
- Cloud hosting (AWS/GCP/Azure/Heroku)

## Step 1: Environment Setup

### 1.1 Generate Secrets
```bash
python3 -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python3 -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

### 1.2 Create .env File
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 1.3 Set Environment Variables
```bash
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:password@host:5432/miningai
export REDIS_URL=redis://host:6379/0
export GEMINI_API_KEY=your_key_here
export SECRET_KEY=your_secret_here
export JWT_SECRET_KEY=your_jwt_secret_here
export ALLOWED_ORIGINS=https://yourdomain.com
export SENTRY_DSN=your_sentry_dsn
```

## Step 2: Database Setup

### 2.1 Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

### 2.2 Create Database
```bash
sudo -u postgres psql
CREATE DATABASE miningai;
CREATE USER miningai_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE miningai TO miningai_user;
\q
```

### 2.3 Run Migrations
```bash
python3 -c "from database import init_db; init_db('postgresql://user:pass@localhost/miningai')"
```

## Step 3: Redis Setup

### 3.1 Install Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

### 3.2 Configure Redis
```bash
# Edit /etc/redis/redis.conf
requirepass your_redis_password
bind 127.0.0.1
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### 3.3 Start Redis
```bash
sudo systemctl start redis
sudo systemctl enable redis
```

## Step 4: Application Deployment

### 4.1 Install Dependencies
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 4.2 Process PDFs
```bash
# Place your PDF files in pdfs/ directory
python3 pdf_processor.py
```

### 4.3 Test Application
```bash
python3 main_production.py
# Visit http://localhost:5001/api/health
```

## Step 5: Production Server (Gunicorn)

### 5.1 Create Gunicorn Config
```python
# gunicorn_config.py
bind = "0.0.0.0:5001"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 50
preload_app = True
accesslog = "/var/log/gunicorn/access.log"
errorlog = "/var/log/gunicorn/error.log"
loglevel = "info"
```

### 5.2 Start Gunicorn
```bash
gunicorn -c gunicorn_config.py main_production:app
```

### 5.3 Create Systemd Service
```ini
# /etc/systemd/system/miningai.service
[Unit]
Description=MiningAI API
After=network.target postgresql.service redis.service

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/var/www/miningai
Environment="PATH=/var/www/miningai/venv/bin"
Environment="FLASK_ENV=production"
EnvironmentFile=/var/www/miningai/.env
ExecStart=/var/www/miningai/venv/bin/gunicorn -c gunicorn_config.py main_production:app
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start miningai
sudo systemctl enable miningai
sudo systemctl status miningai
```

## Step 6: Nginx Reverse Proxy

### 6.1 Install Nginx
```bash
sudo apt-get install nginx
```

### 6.2 Configure Nginx
```nginx
# /etc/nginx/sites-available/miningai
upstream miningai_backend {
    server 127.0.0.1:5001;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 10M;

    location /api/ {
        proxy_pass http://miningai_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    location / {
        root /var/www/miningai/frontend/out;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/miningai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
```

## Step 8: Monitoring Setup

### 8.1 Sentry
```bash
# Sign up at sentry.io
# Add SENTRY_DSN to .env
```

### 8.2 Log Rotation
```bash
# /etc/logrotate.d/miningai
/var/log/gunicorn/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload miningai
    endscript
}
```

### 8.3 Health Check Monitoring
```bash
# Add to crontab
*/5 * * * * curl -f https://yourdomain.com/api/health || echo "Health check failed" | mail -s "MiningAI Down" admin@yourdomain.com
```

## Step 9: Backup Strategy

### 9.1 Database Backups
```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/var/backups/miningai"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U miningai_user miningai | gzip > $BACKUP_DIR/db_$DATE.sql.gz
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
```

### 9.2 File Backups
```bash
# Backup PDFs and knowledge base
tar -czf /var/backups/miningai/files_$(date +%Y%m%d).tar.gz \
    /var/www/miningai/pdfs \
    /var/www/miningai/knowledge_base
```

## Step 10: Security Hardening

### 10.1 Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 10.2 Fail2Ban
```bash
sudo apt-get install fail2ban
# Configure /etc/fail2ban/jail.local
```

### 10.3 Security Updates
```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get dist-upgrade
```

## Step 11: Performance Optimization

### 11.1 Database Indexing
```sql
CREATE INDEX idx_chat_history_user_created ON chat_history(user_id, created_at DESC);
CREATE INDEX idx_api_usage_user_created ON api_usage(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);
```

### 11.2 Redis Caching
```python
# Cache frequently accessed data
# Implement in main_production.py
```

### 11.3 CDN Setup
- Use CloudFlare or AWS CloudFront for static assets
- Enable caching for frontend files

## Step 12: Scaling

### 12.1 Horizontal Scaling
- Use load balancer (AWS ELB, Nginx)
- Run multiple Gunicorn instances
- Share session state via Redis

### 12.2 Database Scaling
- Set up read replicas
- Implement connection pooling
- Use pgBouncer

### 12.3 Caching Strategy
- Cache PDF search results
- Cache Gemini API responses
- Implement request deduplication

## Troubleshooting

### Check Logs
```bash
sudo journalctl -u miningai -f
tail -f /var/log/gunicorn/error.log
tail -f /var/log/nginx/error.log
```

### Test Database Connection
```bash
psql -U miningai_user -d miningai -h localhost
```

### Test Redis Connection
```bash
redis-cli -a your_password ping
```

### Check Service Status
```bash
sudo systemctl status miningai
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis
```

## Maintenance

### Update Dependencies
```bash
pip install --upgrade -r requirements.txt
sudo systemctl restart miningai
```

### Database Maintenance
```bash
# Vacuum and analyze
psql -U miningai_user -d miningai -c "VACUUM ANALYZE;"
```

### Monitor Performance
```bash
# Check CPU/Memory
htop

# Check disk space
df -h

# Check database size
psql -U miningai_user -d miningai -c "SELECT pg_size_pretty(pg_database_size('miningai'));"
```

## Support

For deployment issues:
- Email: support@minegpt.com
- Documentation: https://docs.minegpt.com
- GitHub Issues: https://github.com/yourusername/miningai/issues
