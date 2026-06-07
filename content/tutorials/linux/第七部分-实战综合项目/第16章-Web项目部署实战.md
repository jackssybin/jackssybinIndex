---
title: "第16章:Web项目部署实战"
description: "第16章:Web项目部署实战 从零开始部署完整的Web应用,掌握生产环境配置 本章目标 掌握完整的Web项目部署流程 学会配置Nginx反向代理 能够部署Node.js/Python/Java应用 了解SSL证书配置和HTTPS 掌握自动化部署脚本编写 16.1 部署准备 16.1.1 服务器环境检查 16.1.2 创..."
url: /linux/16/16-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 160
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第16章:Web项目部署实战

> 从零开始部署完整的Web应用,掌握生产环境配置

## 本章目标

- 掌握完整的Web项目部署流程
- 学会配置Nginx反向代理
- 能够部署Node.js/Python/Java应用
- 了解SSL证书配置和HTTPS
- 掌握自动化部署脚本编写

---

## 16.1 部署准备

### 16.1.1 服务器环境检查

```bash
# 检查系统信息
cat /etc/os-release
uname -a

# 检查可用资源
free -h
df -h
nproc

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装基础工具
sudo apt install -y \
    git \
    curl \
    wget \
    vim \
    htop \
    ufw
```

### 16.1.2 创建部署用户

```bash
# 创建专用部署用户
sudo useradd -m -s /bin/bash deploy
sudo passwd deploy

# 添加sudo权限(可选)
sudo usermod -aG sudo deploy

# 配置SSH密钥登录
sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh

# 从本地复制公钥
ssh-copy-id deploy@server-ip

# 测试登录
ssh deploy@server-ip
```

### 16.1.3 配置防火墙

```bash
# 启用UFW
sudo ufw enable

# 允许SSH
sudo ufw allow 22/tcp

# 允许HTTP和HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 查看状态
sudo ufw status
```

---

## 16.2 部署Node.js应用

### 16.2.1 安装Node.js

```bash
# 方法1: 使用NodeSource仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 方法2: 使用nvm(推荐)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证安装
node --version
npm --version
```

### 16.2.2 部署Express应用

**项目结构**:
```
my-app/
├── package.json
├── server.js
├── .env
└── public/
```

**部署步骤**:
```bash
# 1. 克隆代码
cd /home/deploy
git clone https://github.com/username/my-app.git
cd my-app

# 2. 安装依赖
npm install --production

# 3. 配置环境变量
cat > .env <<EOF
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost/dbname
EOF

# 4. 测试运行
node server.js

# 5. 使用PM2管理进程
sudo npm install -g pm2

# 启动应用
pm2 start server.js --name my-app

# 查看状态
pm2 status

# 查看日志
pm2 logs my-app

# 设置开机自启
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u deploy --hp /home/deploy
pm2 save

# 重启应用
pm2 restart my-app

# 停止应用
pm2 stop my-app
```

**PM2配置文件** (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'my-app',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js
```

---

## 16.3 部署Python应用

### 16.3.1 安装Python和依赖

```bash
# 安装Python
sudo apt install -y python3 python3-pip python3-venv

# 创建虚拟环境
cd /home/deploy/my-flask-app
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 16.3.2 部署Flask应用

**使用Gunicorn**:
```bash
# 安装Gunicorn
pip install gunicorn

# 测试运行
gunicorn --bind 0.0.0.0:8000 app:app

# 创建systemd服务
sudo nano /etc/systemd/system/myapp.service
```

```ini
[Unit]
Description=My Flask Application
After=network.target

[Service]
User=deploy
Group=deploy
WorkingDirectory=/home/deploy/my-flask-app
Environment="PATH=/home/deploy/my-flask-app/venv/bin"
ExecStart=/home/deploy/my-flask-app/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:8000 \
    --access-logfile /var/log/myapp/access.log \
    --error-logfile /var/log/myapp/error.log \
    app:app

Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# 创建日志目录
sudo mkdir -p /var/log/myapp
sudo chown deploy:deploy /var/log/myapp

# 启动服务
sudo systemctl daemon-reload
sudo systemctl start myapp
sudo systemctl enable myapp

# 查看状态
sudo systemctl status myapp

# 查看日志
sudo journalctl -u myapp -f
```

---

## 16.4 配置Nginx反向代理

### 16.4.1 安装Nginx

```bash
# 安装Nginx
sudo apt install -y nginx

# 启动Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证
curl http://localhost
```

### 16.4.2 配置反向代理

**Node.js应用配置**:
```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/myapp
```

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # 日志
    access_log /var/log/nginx/myapp_access.log;
    error_log /var/log/nginx/myapp_error.log;

    # 反向代理到Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态文件
    location /static/ {
        alias /home/deploy/my-app/public/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重新加载Nginx
sudo systemctl reload nginx
```

### 16.4.3 负载均衡配置

```nginx
# 定义上游服务器
upstream myapp_backend {
    least_conn;  # 最少连接负载均衡
    server 127.0.0.1:3000 weight=1;
    server 127.0.0.1:3001 weight=1;
    server 127.0.0.1:3002 weight=1;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://myapp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 16.5 配置HTTPS

### 16.5.1 使用Let's Encrypt免费证书

```bash
# 安装Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取证书(自动配置Nginx)
sudo certbot --nginx -d example.com -d www.example.com

# 测试自动续期
sudo certbot renew --dry-run

# 查看证书信息
sudo certbot certificates
```

**Certbot会自动修改Nginx配置**:
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000;
        # ... 其他配置
    }
}
```

### 16.5.2 手动配置SSL

```bash
# 生成自签名证书(测试用)
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt
```

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/nginx.crt;
    ssl_certificate_key /etc/nginx/ssl/nginx.key;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## 16.6 数据库配置

### 16.6.1 安装MySQL

```bash
# 安装MySQL
sudo apt install -y mysql-server

# 安全配置
sudo mysql_secure_installation

# 登录MySQL
sudo mysql

# 创建数据库和用户
CREATE DATABASE myapp_db;
CREATE USER 'myapp_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON myapp_db.* TO 'myapp_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 测试连接
mysql -u myapp_user -p myapp_db
```

### 16.6.2 安装PostgreSQL

```bash
# 安装PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 切换到postgres用户
sudo -u postgres psql

# 创建数据库和用户
CREATE DATABASE myapp_db;
CREATE USER myapp_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE myapp_db TO myapp_user;
\q

# 配置远程访问(如需要)
sudo nano /etc/postgresql/14/main/postgresql.conf
# listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# host    all             all             0.0.0.0/0               md5

# 重启PostgreSQL
sudo systemctl restart postgresql
```

### 16.6.3 安装Redis

```bash
# 安装Redis
sudo apt install -y redis-server

# 配置Redis
sudo nano /etc/redis/redis.conf
# bind 127.0.0.1
# requirepass your_strong_password

# 重启Redis
sudo systemctl restart redis-server

# 测试连接
redis-cli
AUTH your_strong_password
PING
```

---

## 16.7 自动化部署脚本

### 16.7.1 简单部署脚本

```bash
#!/bin/bash
# deploy.sh - 自动化部署脚本

set -e

# 配置
APP_DIR="/home/deploy/my-app"
APP_NAME="my-app"
BRANCH="main"

echo "====== Starting Deployment ======"

# 1. 拉取最新代码
echo "Pulling latest code..."
cd $APP_DIR
git pull origin $BRANCH

# 2. 安装依赖
echo "Installing dependencies..."
npm install --production

# 3. 运行数据库迁移(如果有)
echo "Running database migrations..."
npm run migrate

# 4. 构建项目(如果需要)
echo "Building project..."
npm run build

# 5. 重启应用
echo "Restarting application..."
pm2 restart $APP_NAME

# 6. 验证
echo "Verifying deployment..."
sleep 3
if pm2 list | grep -q "$APP_NAME.*online"; then
    echo "✓ Deployment successful!"
else
    echo "✗ Deployment failed!"
    exit 1
fi

echo "====== Deployment Completed ======"
```

### 16.7.2 零停机部署脚本

```bash
#!/bin/bash
# zero-downtime-deploy.sh

set -e

APP_DIR="/home/deploy/my-app"
APP_NAME="my-app"
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "====== Zero-Downtime Deployment ======"

# 1. 备份当前版本
echo "Backing up current version..."
mkdir -p $BACKUP_DIR
cp -r $APP_DIR "${BACKUP_DIR}/backup_${DATE}"

# 2. 拉取新代码
echo "Pulling new code..."
cd $APP_DIR
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# 3. 安装依赖
echo "Installing dependencies..."
npm install --production

# 4. 运行测试
echo "Running tests..."
npm test || {
    echo "Tests failed! Rolling back..."
    rm -rf $APP_DIR
    cp -r "${BACKUP_DIR}/backup_${DATE}" $APP_DIR
    exit 1
}

# 5. 平滑重启(PM2集群模式)
echo "Reloading application..."
pm2 reload $APP_NAME

# 6. 健康检查
echo "Health check..."
sleep 5
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ $response -eq 200 ]; then
    echo "✓ Deployment successful!"
    # 清理旧备份(保留最近5个)
    ls -t $BACKUP_DIR | tail -n +6 | xargs -I {} rm -rf "$BACKUP_DIR/{}"
else
    echo "✗ Health check failed! Rolling back..."
    rm -rf $APP_DIR
    cp -r "${BACKUP_DIR}/backup_${DATE}" $APP_DIR
    pm2 restart $APP_NAME
    exit 1
fi

echo "====== Deployment Completed ======"
```

### 16.7.3 使用GitHub Actions自动部署

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /home/deploy/my-app
          git pull origin main
          npm install --production
          pm2 reload my-app
```

---

## 16.8 监控和日志

### 16.8.1 应用监控

```bash
# PM2监控
pm2 monit

# PM2 Web界面
pm2 install pm2-server-monit

# 查看资源使用
pm2 list
pm2 show my-app
```

### 16.8.2 日志管理

```bash
# PM2日志
pm2 logs my-app
pm2 logs my-app --lines 100
pm2 logs my-app --err  # 只看错误日志

# 日志轮转
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -u myapp -f
sudo journalctl -u nginx -f
```

### 16.8.3 性能监控

```bash
# 安装htop
sudo apt install htop
htop

# 查看网络连接
sudo netstat -tulpn
sudo ss -tulpn

# 查看磁盘IO
sudo iotop

# 查看进程
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10
```

---

## 16.9 备份策略

### 16.9.1 数据库备份

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backup/database"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="myapp_db"
DB_USER="myapp_user"

mkdir -p $BACKUP_DIR

# MySQL备份
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > "${BACKUP_DIR}/mysql_${DATE}.sql.gz"

# PostgreSQL备份
pg_dump -U $DB_USER $DB_NAME | gzip > "${BACKUP_DIR}/postgres_${DATE}.sql.gz"

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Database backup completed: ${DATE}"
```

### 16.9.2 文件备份

```bash
#!/bin/bash
# backup-files.sh

BACKUP_DIR="/backup/files"
DATE=$(date +%Y%m%d_%H%M%S)
SOURCE_DIR="/home/deploy/my-app"

mkdir -p $BACKUP_DIR

# 备份应用文件
tar -czf "${BACKUP_DIR}/app_${DATE}.tar.gz" \
    --exclude='node_modules' \
    --exclude='.git' \
    $SOURCE_DIR

# 上传到远程服务器(可选)
# rsync -avz "${BACKUP_DIR}/app_${DATE}.tar.gz" user@backup-server:/backups/

# 删除30天前的备份
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +30 -delete

echo "File backup completed: ${DATE}"
```

### 16.9.3 定时备份

```bash
# 编辑crontab
crontab -e

# 每天凌晨2点备份数据库
0 2 * * * /home/deploy/scripts/backup-db.sh

# 每周日凌晨3点备份文件
0 3 * * 0 /home/deploy/scripts/backup-files.sh
```

---

## 16.10 故障排查

### 16.10.1 常见问题检查清单

```bash
# 1. 检查应用是否运行
pm2 status
sudo systemctl status myapp

# 2. 检查端口是否监听
sudo netstat -tulpn | grep :3000
sudo lsof -i :3000

# 3. 检查Nginx配置
sudo nginx -t
sudo systemctl status nginx

# 4. 检查防火墙
sudo ufw status

# 5. 检查磁盘空间
df -h

# 6. 检查内存
free -h

# 7. 查看日志
pm2 logs my-app --err
sudo journalctl -u nginx -n 50
```

### 16.10.2 性能优化

```bash
# Node.js优化
# 1. 启用集群模式
pm2 start app.js -i max

# 2. 增加内存限制
pm2 start app.js --max-memory-restart 500M

# Nginx优化
sudo nano /etc/nginx/nginx.conf
```

```nginx
# worker进程数(通常等于CPU核心数)
worker_processes auto;

# 每个worker的最大连接数
events {
    worker_connections 1024;
}

http {
    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # 缓存配置
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g;
    
    # 连接超时
    keepalive_timeout 65;
    client_max_body_size 10M;
}
```

---

## 本章总结

### 部署流程回顾

1. **准备阶段**
   - 配置服务器环境
   - 创建部署用户
   - 配置防火墙

2. **应用部署**
   - 安装运行时环境
   - 部署应用代码
   - 配置进程管理器

3. **反向代理**
   - 安装配置Nginx
   - 设置反向代理
   - 配置HTTPS

4. **数据库**
   - 安装数据库
   - 创建用户和数据库
   - 配置连接

5. **自动化**
   - 编写部署脚本
   - 配置CI/CD
   - 设置监控和备份

### 最佳实践

- ✅ 使用专用部署用户
- ✅ 配置HTTPS加密
- ✅ 使用进程管理器(PM2/systemd)
- ✅ 配置反向代理和负载均衡
- ✅ 实施备份策略
- ✅ 设置监控和日志
- ✅ 编写自动化部署脚本

### 下一步

- 学习日常开发工作流(第17章)
- 掌握更多运维技巧
- 优化部署流程

---

**练习题**:

1. 部署一个简单的Node.js应用并配置Nginx反向代理
2. 配置Let's Encrypt SSL证书
3. 编写一个自动化部署脚本
4. 设置数据库定时备份

---

> 💡 **提示**: 部署是一个系统工程,需要考虑安全、性能、可靠性等多个方面!
