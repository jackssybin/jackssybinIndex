---
title: "第13章:FTP文件传输"
description: "第13章:FTP文件传输 掌握FTP文件传输,实现高效的文件上传下载 本章目标 理解FTP协议的工作原理 掌握FTP客户端命令行工具 学会配置和使用SFTP(安全FTP) 能够搭建简单的FTP服务器 了解现代文件传输替代方案 13.1 FTP基础概念 13.1.1 什么是FTP FTP (File Transfer P..."
url: /linux/13/13-linux.html
layout: tutorial
contentType: tutorial
series: linux
seriesTitle: Linux教程
weight: 130
tags:
  - Linux
  - Shell
  - Git
  - 教程
draft: false
---

# 第13章:FTP文件传输

> 掌握FTP文件传输,实现高效的文件上传下载

## 本章目标

- 理解FTP协议的工作原理
- 掌握FTP客户端命令行工具
- 学会配置和使用SFTP(安全FTP)
- 能够搭建简单的FTP服务器
- 了解现代文件传输替代方案

---

## 13.1 FTP基础概念

### 13.1.1 什么是FTP

**FTP** (File Transfer Protocol) 是用于在网络上传输文件的标准协议

**特点**:
- 基于TCP协议
- 使用两个端口:
  - **21**: 控制连接(命令)
  - **20**: 数据连接(文件传输)
- 支持主动模式和被动模式
- 明文传输(不安全)

**FTP变体**:
- **FTPS**: FTP over SSL/TLS(加密)
- **SFTP**: SSH File Transfer Protocol(更安全,推荐)

### 13.1.2 主动模式 vs 被动模式

**主动模式** (Active Mode):
- 客户端打开随机端口,告诉服务器
- 服务器从端口20主动连接客户端
- 问题:客户端防火墙可能阻止

**被动模式** (Passive Mode):
- 服务器打开随机端口,告诉客户端
- 客户端主动连接服务器
- 推荐使用,兼容性好

---

## 13.2 FTP客户端命令

### 13.2.1 连接FTP服务器

```bash
# 连接到FTP服务器
ftp hostname

# 指定端口
ftp hostname port

# 示例
ftp ftp.example.com
# 输入用户名和密码

# 匿名登录
# 用户名: anonymous
# 密码: 任意邮箱地址
```

### 13.2.2 基本FTP命令

**连接和认证**:
```bash
# 在ftp>提示符下:

# 登录
ftp> user username
Password: 

# 查看当前目录
ftp> pwd

# 列出文件
ftp> ls
ftp> dir  # 详细列表

# 切换目录
ftp> cd /path/to/directory

# 返回上级目录
ftp> cd ..

# 切换到主目录
ftp> cd ~
```

**文件传输**:
```bash
# 下载文件
ftp> get remote-file.txt
ftp> get remote-file.txt local-file.txt  # 重命名

# 下载多个文件
ftp> mget *.txt

# 上传文件
ftp> put local-file.txt
ftp> put local-file.txt remote-file.txt  # 重命名

# 上传多个文件
ftp> mput *.txt

# 删除远程文件
ftp> delete remote-file.txt

# 删除多个文件
ftp> mdelete *.txt

# 重命名远程文件
ftp> rename old-name.txt new-name.txt
```

**目录操作**:
```bash
# 创建目录
ftp> mkdir new-directory

# 删除目录
ftp> rmdir directory-name

# 查看本地目录
ftp> !pwd

# 列出本地文件
ftp> !ls

# 切换本地目录
ftp> lcd /local/path
```

**传输模式**:
```bash
# 二进制模式(图片、压缩包等)
ftp> binary
ftp> bin

# ASCII模式(文本文件)
ftp> ascii

# 查看当前模式
ftp> status
```

**其他命令**:
```bash
# 查看帮助
ftp> help
ftp> help command  # 查看特定命令帮助

# 查看服务器信息
ftp> system

# 断开连接
ftp> bye
ftp> quit
ftp> exit

# 切换被动模式
ftp> passive
```

### 13.2.3 非交互式FTP

**使用脚本自动化**:
```bash
# 方法1: 使用here document
ftp -n hostname <<EOF
user username password
binary
cd /remote/path
get file.txt
bye
EOF

# 方法2: 从文件读取命令
cat > ftp-commands.txt <<EOF
user username password
binary
cd /remote/path
mget *.txt
bye
EOF

ftp -n hostname < ftp-commands.txt

# 方法3: 使用expect(需要安装)
#!/usr/bin/expect
spawn ftp hostname
expect "Name"
send "username\r"
expect "Password:"
send "password\r"
expect "ftp>"
send "get file.txt\r"
expect "ftp>"
send "bye\r"
interact
```

---

## 13.3 SFTP - 安全文件传输

### 13.3.1 SFTP基础

SFTP基于SSH,比FTP更安全:
- 加密传输
- 使用SSH认证(密码或密钥)
- 只需一个端口(22)
- 推荐使用

### 13.3.2 SFTP命令

```bash
# 连接到SFTP服务器
sftp username@hostname

# 指定端口
sftp -P 2222 username@hostname

# 使用密钥
sftp -i ~/.ssh/id_rsa username@hostname

# 示例
sftp user@example.com
```

**SFTP交互命令**:
```bash
# 在sftp>提示符下:

# 查看远程目录
sftp> pwd
sftp> ls
sftp> ls -la

# 切换远程目录
sftp> cd /remote/path

# 查看本地目录
sftp> lpwd
sftp> lls

# 切换本地目录
sftp> lcd /local/path

# 下载文件
sftp> get remote-file.txt
sftp> get remote-file.txt local-file.txt

# 下载目录(递归)
sftp> get -r remote-directory

# 上传文件
sftp> put local-file.txt
sftp> put local-file.txt remote-file.txt

# 上传目录(递归)
sftp> put -r local-directory

# 创建目录
sftp> mkdir new-directory

# 删除文件
sftp> rm remote-file.txt

# 删除目录
sftp> rmdir directory-name

# 修改权限
sftp> chmod 644 file.txt

# 修改所有者
sftp> chown user file.txt

# 查看帮助
sftp> help

# 退出
sftp> bye
sftp> quit
sftp> exit
```

### 13.3.3 SFTP批处理

```bash
# 创建批处理文件
cat > sftp-batch.txt <<EOF
cd /remote/path
lcd /local/path
get *.txt
put *.log
bye
EOF

# 执行批处理
sftp -b sftp-batch.txt username@hostname

# 或使用管道
echo "get /remote/file.txt" | sftp username@hostname
```

---

## 13.4 lftp - 强大的FTP客户端

### 13.4.1 安装lftp

```bash
# Ubuntu/Debian
sudo apt-get install lftp

# CentOS/RHEL
sudo yum install lftp

# macOS
brew install lftp
```

### 13.4.2 lftp基本用法

```bash
# 连接FTP
lftp ftp://username:password@hostname

# 连接SFTP
lftp sftp://username@hostname

# 交互式连接
lftp hostname
lftp> user username password
```

**lftp命令**:
```bash
# 在lftp>提示符下:

# 列出文件
lftp> ls
lftp> ls -la

# 下载文件
lftp> get file.txt

# 下载目录(镜像)
lftp> mirror remote-dir local-dir

# 上传文件
lftp> put file.txt

# 上传目录(镜像)
lftp> mirror -R local-dir remote-dir

# 并行下载(4个连接)
lftp> pget -n 4 large-file.iso

# 断点续传
lftp> get -c file.txt

# 同步目录(只传输新文件)
lftp> mirror --only-newer remote-dir local-dir

# 删除远程文件
lftp> rm file.txt

# 退出
lftp> bye
```

### 13.4.3 lftp脚本

```bash
# 一行命令下载
lftp -c "open ftp://user:pass@host; get file.txt; bye"

# 镜像整个目录
lftp -c "open ftp://user:pass@host; mirror /remote/path /local/path; bye"

# 上传目录
lftp -c "open ftp://user:pass@host; mirror -R /local/path /remote/path; bye"

# 使用配置文件
cat > ~/.lftprc <<EOF
set ftp:passive-mode true
set net:timeout 30
set net:max-retries 3
EOF
```

---

## 13.5 搭建FTP服务器

### 13.5.1 安装vsftpd

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install vsftpd

# CentOS/RHEL
sudo yum install vsftpd

# 启动服务
sudo systemctl start vsftpd
sudo systemctl enable vsftpd
```

### 13.5.2 配置vsftpd

```bash
# 备份原配置
sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.bak

# 编辑配置
sudo nano /etc/vsftpd.conf
```

**基本配置**:
```ini
# 禁用匿名登录
anonymous_enable=NO

# 允许本地用户登录
local_enable=YES

# 允许写操作
write_enable=YES

# 本地用户umask
local_umask=022

# 限制用户在主目录
chroot_local_user=YES
allow_writeable_chroot=YES

# 被动模式端口范围
pasv_min_port=40000
pasv_max_port=50000

# 欢迎消息
ftpd_banner=Welcome to My FTP Server

# 日志
xferlog_enable=YES
xferlog_file=/var/log/vsftpd.log

# 监听IPv4
listen=YES
listen_ipv6=NO
```

**重启服务**:
```bash
sudo systemctl restart vsftpd
```

### 13.5.3 创建FTP用户

```bash
# 创建FTP专用用户
sudo useradd -m -s /bin/bash ftpuser
sudo passwd ftpuser

# 创建FTP目录
sudo mkdir -p /home/ftpuser/ftp/upload
sudo chown nobody:nogroup /home/ftpuser/ftp
sudo chmod a-w /home/ftpuser/ftp
sudo chown ftpuser:ftpuser /home/ftpuser/ftp/upload

# 测试连接
ftp localhost
# 用户名: ftpuser
# 密码: (设置的密码)
```

### 13.5.4 配置防火墙

```bash
# Ubuntu (ufw)
sudo ufw allow 20/tcp
sudo ufw allow 21/tcp
sudo ufw allow 40000:50000/tcp  # 被动模式端口

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=ftp
sudo firewall-cmd --permanent --add-port=40000-50000/tcp
sudo firewall-cmd --reload
```

---

## 13.6 现代替代方案

### 13.6.1 scp - 简单文件复制

```bash
# 上传文件
scp local-file.txt user@host:/remote/path/

# 下载文件
scp user@host:/remote/file.txt /local/path/

# 上传目录
scp -r local-directory user@host:/remote/path/

# 指定端口
scp -P 2222 file.txt user@host:/path/

# 使用压缩
scp -C large-file.tar.gz user@host:/path/

# 限速(KB/s)
scp -l 1000 file.txt user@host:/path/
```

### 13.6.2 rsync - 增量同步

```bash
# 基本同步
rsync -avz source/ user@host:/destination/

# 常用选项:
# -a: 归档模式(保留权限、时间等)
# -v: 详细输出
# -z: 压缩传输
# -P: 显示进度,支持断点续传
# --delete: 删除目标中多余的文件
# --exclude: 排除文件

# 实战示例:
# 同步网站文件
rsync -avz --delete public/ user@server:/var/www/html/

# 排除特定文件
rsync -avz --exclude='*.log' --exclude='node_modules' source/ user@host:/dest/

# 只同步新文件
rsync -avz --update source/ user@host:/dest/

# 模拟运行(不实际传输)
rsync -avz --dry-run source/ user@host:/dest/
```

### 13.6.3 rclone - 云存储同步

```bash
# 安装rclone
curl https://rclone.org/install.sh | sudo bash

# 配置云存储
rclone config

# 列出远程文件
rclone ls remote:path

# 同步到云存储
rclone sync local-dir remote:bucket/path

# 从云存储同步
rclone sync remote:bucket/path local-dir

# 支持的云服务:
# - Google Drive
# - Dropbox
# - Amazon S3
# - OneDrive
# - 阿里云OSS
# - 腾讯云COS
```

---

## 13.7 实战场景

### 场景1: 自动化网站部署

**使用SFTP批处理**:
```bash
#!/bin/bash
# deploy.sh

# 构建网站
npm run build

# 创建SFTP批处理文件
cat > sftp-deploy.txt <<EOF
cd /var/www/html
lcd ./dist
put -r *
chmod 755 /var/www/html
bye
EOF

# 执行部署
sftp -b sftp-deploy.txt user@server

# 清理
rm sftp-deploy.txt

echo "Deployment completed!"
```

**使用rsync(推荐)**:
```bash
#!/bin/bash
# deploy-rsync.sh

# 构建网站
npm run build

# 同步到服务器
rsync -avz --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  ./dist/ user@server:/var/www/html/

echo "Deployment completed!"
```

### 场景2: 定时备份

```bash
#!/bin/bash
# backup.sh

# 配置
BACKUP_DIR="/var/backups/website"
REMOTE_USER="backup"
REMOTE_HOST="backup-server.com"
REMOTE_PATH="/backups/website"
DATE=$(date +%Y%m%d)

# 创建备份
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" /var/www/html

# 上传到备份服务器
sftp $REMOTE_USER@$REMOTE_HOST <<EOF
cd $REMOTE_PATH
put $BACKUP_DIR/backup-$DATE.tar.gz
bye
EOF

# 删除本地7天前的备份
find $BACKUP_DIR -name "backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup-$DATE.tar.gz"
```

**添加到crontab**:
```bash
# 编辑crontab
crontab -e

# 每天凌晨2点执行备份
0 2 * * * /path/to/backup.sh
```

### 场景3: 批量下载文件

```bash
#!/bin/bash
# batch-download.sh

# 使用lftp镜像整个目录
lftp -c "
open ftp://user:pass@ftp.example.com
mirror --parallel=4 /remote/directory /local/directory
bye
"

# 或使用wget递归下载
wget -r -np -nH --cut-dirs=2 \
  ftp://user:pass@ftp.example.com/remote/directory/
```

### 场景4: 监控FTP上传

```bash
#!/bin/bash
# watch-ftp.sh

# 监控本地目录,自动上传新文件

WATCH_DIR="/home/user/uploads"
REMOTE_USER="ftpuser"
REMOTE_HOST="ftp.example.com"
REMOTE_PATH="/uploads"

# 使用inotifywait监控
sudo apt-get install inotify-tools

inotifywait -m -e create -e moved_to "$WATCH_DIR" |
while read path action file; do
    echo "New file detected: $file"
    
    # 上传文件
    lftp -c "
    open sftp://$REMOTE_USER@$REMOTE_HOST
    cd $REMOTE_PATH
    put $path$file
    bye
    "
    
    echo "Uploaded: $file"
done
```

### 场景5: FTP服务器健康检查

```bash
#!/bin/bash
# ftp-health-check.sh

FTP_HOST="ftp.example.com"
FTP_USER="testuser"
FTP_PASS="testpass"
TEST_FILE="/tmp/ftp-test-$(date +%s).txt"

# 创建测试文件
echo "FTP Health Check" > $TEST_FILE

# 测试上传
ftp -n $FTP_HOST <<EOF
user $FTP_USER $FTP_PASS
binary
put $TEST_FILE
delete $(basename $TEST_FILE)
bye
EOF

if [ $? -eq 0 ]; then
    echo "FTP server is healthy"
    rm $TEST_FILE
    exit 0
else
    echo "FTP server is down!"
    rm $TEST_FILE
    exit 1
fi
```

---

## 13.8 安全最佳实践

### 13.8.1 使用SFTP而非FTP

```bash
# ❌ 不安全:FTP明文传输
ftp user@host

# ✅ 安全:SFTP加密传输
sftp user@host
```

### 13.8.2 限制FTP用户权限

```bash
# 创建FTP专用用户,限制在特定目录
sudo useradd -m -d /var/ftp/user1 -s /sbin/nologin ftpuser1

# 配置vsftpd chroot
# /etc/vsftpd.conf:
chroot_local_user=YES
allow_writeable_chroot=YES
```

### 13.8.3 使用密钥认证

```bash
# SFTP使用SSH密钥
ssh-keygen -t ed25519
ssh-copy-id user@host

# 禁用密码登录
# /etc/ssh/sshd_config:
PasswordAuthentication no
```

### 13.8.4 监控FTP日志

```bash
# 查看vsftpd日志
sudo tail -f /var/log/vsftpd.log

# 查看SFTP日志
sudo tail -f /var/log/auth.log | grep sftp

# 查看失败的登录尝试
sudo grep "Failed password" /var/log/auth.log
```

---

## 13.9 常见问题

### Q1: FTP连接超时怎么办?

**A**:
```bash
# 1. 检查防火墙
sudo ufw status
sudo ufw allow 21/tcp

# 2. 检查FTP服务
sudo systemctl status vsftpd

# 3. 使用被动模式
ftp> passive

# 4. 检查网络连通性
ping ftp-server
telnet ftp-server 21
```

### Q2: SFTP和SCP有什么区别?

**A**:
- **SCP**: 简单文件复制,一次性传输
- **SFTP**: 交互式文件管理,支持浏览、删除等操作
- **推荐**: 简单传输用SCP,复杂操作用SFTP

### Q3: 如何加快大文件传输?

**A**:
```bash
# 1. 使用压缩
scp -C large-file.tar.gz user@host:/path/

# 2. 使用并行下载(lftp)
lftp> pget -n 4 large-file.iso

# 3. 使用rsync增量传输
rsync -avz --partial large-file user@host:/path/

# 4. 调整SSH加密算法(更快但安全性稍低)
scp -c aes128-ctr file user@host:/path/
```

### Q4: 如何恢复中断的传输?

**A**:
```bash
# SFTP
sftp> reget remote-file.txt  # 继续下载
sftp> reput local-file.txt   # 继续上传

# lftp
lftp> get -c file.txt

# rsync(自动断点续传)
rsync -avzP file user@host:/path/
```

### Q5: 如何传输大量小文件?

**A**:
```bash
# 先打包再传输(更快)
tar -czf files.tar.gz files/
scp files.tar.gz user@host:/path/
ssh user@host "cd /path && tar -xzf files.tar.gz"

# 或使用rsync
rsync -avz files/ user@host:/path/
```

---

## 本章总结

### 核心命令回顾

| 命令 | 用途 | 示例 |
|------|------|------|
| `ftp` | FTP客户端 | `ftp ftp.example.com` |
| `sftp` | 安全FTP | `sftp user@host` |
| `lftp` | 强大的FTP客户端 | `lftp ftp://user@host` |
| `scp` | 安全文件复制 | `scp file user@host:/path/` |
| `rsync` | 增量同步 | `rsync -avz src/ user@host:/dest/` |

### 文件传输方式对比

| 方式 | 安全性 | 速度 | 功能 | 推荐场景 |
|------|--------|------|------|----------|
| FTP | ❌ 低 | 快 | 基础 | 不推荐 |
| FTPS | ✅ 高 | 中 | 基础 | 兼容旧系统 |
| SFTP | ✅ 高 | 中 | 丰富 | 交互式操作 |
| SCP | ✅ 高 | 快 | 简单 | 快速传输 |
| rsync | ✅ 高 | 最快 | 最强 | 同步部署 |

### 最佳实践

- ✅ 优先使用SFTP/SCP,避免使用FTP
- ✅ 使用SSH密钥认证
- ✅ 大文件先压缩再传输
- ✅ 使用rsync进行增量同步
- ✅ 定期备份重要数据

### 下一步

- 学习环境变量与软件管理(第14章)
- 掌握系统配置技巧
- 了解包管理器使用

---

**练习题**:

1. 使用SFTP上传一个文件到服务器
2. 使用rsync同步本地目录到远程服务器
3. 编写脚本自动化备份数据库到FTP服务器
4. 配置一个简单的vsftpd服务器

**参考答案**:
```bash
# 1.
sftp user@server
sftp> put local-file.txt /remote/path/

# 2.
rsync -avz local-dir/ user@server:/remote/dir/

# 3.
#!/bin/bash
mysqldump -u root -p database > backup.sql
gzip backup.sql
sftp user@ftp-server <<EOF
put backup.sql.gz /backups/
bye
EOF

# 4.
sudo apt-get install vsftpd
sudo nano /etc/vsftpd.conf
# (配置文件)
sudo systemctl restart vsftpd
```

---

> 💡 **提示**: 虽然FTP仍在使用,但SFTP和rsync是现代开发中更推荐的选择!
