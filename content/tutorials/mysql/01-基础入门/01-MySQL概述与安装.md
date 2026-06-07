---
title: 第01章：MySQL概述与安装
description: 第01章：MySQL概述与安装 1.1 MySQL简介 1.1.1 什么是MySQL
  MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL
  AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。 1.1.2
  MySQL的特点 开源免费 ：社区版完全免费 性...
url: /mysql/01/01-mysql.html
layout: tutorial
contentType: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 10
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第01章：MySQL概述与安装

## 1.1 MySQL简介

### 1.1.1 什么是MySQL
MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。

### 1.1.2 MySQL的特点
- **开源免费**：社区版完全免费
- **性能卓越**：执行速度快，适合高并发场景
- **可靠性高**：成熟稳定，被广泛应用
- **使用简单**：易于安装和使用
- **跨平台**：支持多种操作系统
- **支持大型数据库**：可以处理拥有上千万条记录的大型数据库

### 1.1.3 MySQL版本选择

**主要版本：**
- **MySQL 5.5**：较老版本，不推荐新项目使用
- **MySQL 5.6**：改进了性能和复制功能
- **MySQL 5.7**：⭐ 本教程重点，生产环境广泛使用
  - 性能提升显著
  - 支持JSON数据类型
  - 改进的复制功能
  - 更好的性能模式（Performance Schema）
- **MySQL 8.0**：最新版本
  - 默认字符集改为utf8mb4
  - 支持窗口函数
  - 支持CTE（公共表表达式）
  - 移除了查询缓存

**本教程选择MySQL 5.7的原因：**
1. 生产环境使用最广泛
2. 稳定性经过充分验证
3. 大量企业仍在使用
4. 学习5.7后升级到8.0很容易

---

## 1.2 MySQL 5.7 在Windows上的安装

### 1.2.1 下载MySQL 5.7

1. 访问MySQL官网：https://dev.mysql.com/downloads/mysql/5.7.html
2. 选择Windows版本
3. 下载ZIP Archive版本（推荐）或MSI Installer版本

**推荐下载：** `mysql-5.7.44-winx64.zip`

### 1.2.2 ZIP版本安装步骤

#### 步骤1：解压文件
```
解压到：D:\mysql-5.7.44
```

#### 步骤2：创建配置文件
在MySQL根目录下创建 `my.ini` 文件：

```ini
[mysqld]
# 设置MySQL的安装目录
basedir=D:\\mysql-5.7.44
# 设置MySQL数据库的数据存放目录
datadir=D:\\mysql-5.7.44\\data
# 设置端口
port=3306
# 允许最大连接数
max_connections=200
# 允许连接失败的次数
max_connect_errors=10
# 服务端使用的字符集
character-set-server=utf8mb4
# 默认存储引擎
default-storage-engine=INNODB
# 默认使用"mysql_native_password"插件认证
default_authentication_plugin=mysql_native_password

[mysql]
# 客户端使用的字符集
default-character-set=utf8mb4

[client]
# 客户端默认端口
port=3306
default-character-set=utf8mb4
```

#### 步骤3：初始化MySQL
以**管理员身份**打开CMD，进入MySQL的bin目录：

```cmd
cd D:\mysql-5.7.44\bin

# 初始化MySQL（会生成随机密码）
mysqld --initialize --console
```

**重要：** 记录控制台输出的临时密码，类似：
```
[Note] A temporary password is generated for root@localhost: kq7wK>iu(3pN
```

#### 步骤4：安装MySQL服务
```cmd
# 安装服务
mysqld --install MySQL57

# 启动服务
net start MySQL57
```

#### 步骤5：修改root密码
```cmd
# 登录MySQL（使用临时密码）
mysql -u root -p

# 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';

# 刷新权限
FLUSH PRIVILEGES;
```

#### 步骤6：配置环境变量（可选）
将 `D:\mysql-5.7.44\bin` 添加到系统环境变量PATH中，方便在任意位置使用mysql命令。

### 1.2.3 MSI安装器安装（简化版）

1. 双击下载的MSI文件
2. 选择"Custom"自定义安装
3. 选择安装组件（MySQL Server、MySQL Workbench等）
4. 配置MySQL Server
   - 选择端口（默认3306）
   - 设置root密码
   - 配置Windows服务
5. 完成安装

### 1.2.4 验证安装

```cmd
# 查看MySQL版本
mysql --version

# 登录MySQL
mysql -u root -p

# 查看数据库
SHOW DATABASES;

# 查看当前用户
SELECT USER();
```

---

## 1.3 MySQL 5.7 在Linux上的安装

### 1.3.1 CentOS/RHEL安装（YUM方式）

#### 步骤1：下载MySQL YUM Repository
```bash
# 下载MySQL YUM Repository
wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm

# 安装Repository
sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm

# 验证Repository
yum repolist enabled | grep mysql
```

#### 步骤2：安装MySQL
```bash
# 安装MySQL服务器
sudo yum install mysql-community-server

# 启动MySQL服务
sudo systemctl start mysqld

# 设置开机自启
sudo systemctl enable mysqld
```

#### 步骤3：获取临时密码
```bash
# 查看临时密码
sudo grep 'temporary password' /var/log/mysqld.log
```

#### 步骤4：安全配置
```bash
# 登录MySQL
mysql -u root -p

# 修改密码（MySQL 5.7密码策略较严格）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourPassword@123';

# 或者运行安全配置脚本
mysql_secure_installation
```

**安全配置脚本会提示：**
- 修改root密码
- 删除匿名用户
- 禁止root远程登录
- 删除test数据库
- 重新加载权限表

### 1.3.2 Ubuntu/Debian安装（APT方式）

```bash
# 更新包索引
sudo apt update

# 安装MySQL服务器
sudo apt install mysql-server-5.7

# 启动MySQL服务
sudo systemctl start mysql

# 设置开机自启
sudo systemctl enable mysql

# 运行安全配置
sudo mysql_secure_installation
```

### 1.3.3 通用二进制包安装

#### 步骤1：下载并解压
```bash
# 下载
wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.44-linux-glibc2.12-x86_64.tar.gz

# 解压
tar -zxvf mysql-5.7.44-linux-glibc2.12-x86_64.tar.gz

# 移动到安装目录
sudo mv mysql-5.7.44-linux-glibc2.12-x86_64 /usr/local/mysql
```

#### 步骤2：创建MySQL用户和组
```bash
# 创建mysql用户组
sudo groupadd mysql

# 创建mysql用户
sudo useradd -r -g mysql -s /bin/false mysql
```

#### 步骤3：创建数据目录并设置权限
```bash
# 创建数据目录
sudo mkdir -p /usr/local/mysql/data

# 设置所有者
sudo chown -R mysql:mysql /usr/local/mysql
```

#### 步骤4：初始化MySQL
```bash
cd /usr/local/mysql

# 初始化
sudo bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data

# 记录输出的临时密码
```

#### 步骤5：配置my.cnf
```bash
sudo vi /etc/my.cnf
```

添加以下内容：
```ini
[mysqld]
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
socket=/tmp/mysql.sock
port=3306
user=mysql
character-set-server=utf8mb4
default-storage-engine=INNODB

[mysql]
default-character-set=utf8mb4

[client]
port=3306
socket=/tmp/mysql.sock
default-character-set=utf8mb4
```

#### 步骤6：配置系统服务
```bash
# 复制启动脚本
sudo cp support-files/mysql.server /etc/init.d/mysqld

# 设置执行权限
sudo chmod +x /etc/init.d/mysqld

# 启动MySQL
sudo /etc/init.d/mysqld start

# 设置开机自启
sudo chkconfig --add mysqld
sudo chkconfig mysqld on
```

#### 步骤7：配置环境变量
```bash
# 编辑profile
sudo vi /etc/profile

# 添加以下内容
export PATH=$PATH:/usr/local/mysql/bin

# 使配置生效
source /etc/profile
```

### 1.3.4 防火墙配置

**CentOS 7/8 (firewalld):**
```bash
# 开放3306端口
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

**Ubuntu (ufw):**
```bash
# 开放3306端口
sudo ufw allow 3306/tcp
```

**iptables:**
```bash
# 开放3306端口
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
sudo service iptables save
```

---

## 1.4 MySQL配置文件详解

### 1.4.1 配置文件位置

**Windows:**
- `my.ini` 在MySQL安装目录下

**Linux:**
MySQL按以下顺序读取配置文件：
1. `/etc/my.cnf`
2. `/etc/mysql/my.cnf`
3. `/usr/local/mysql/etc/my.cnf`
4. `~/.my.cnf`

查看配置文件读取顺序：
```bash
mysql --help | grep my.cnf
```

### 1.4.2 重要配置参数详解

#### 基础配置
```ini
[mysqld]
# MySQL安装目录
basedir=/usr/local/mysql

# 数据存放目录
datadir=/usr/local/mysql/data

# 端口号
port=3306

# socket文件位置
socket=/tmp/mysql.sock

# 进程ID文件
pid-file=/usr/local/mysql/data/mysqld.pid

# 错误日志
log-error=/usr/local/mysql/data/error.log
```

#### 字符集配置
```ini
# 服务器字符集（推荐utf8mb4，支持emoji）
character-set-server=utf8mb4

# 排序规则
collation-server=utf8mb4_unicode_ci

# 初始化连接字符集
init_connect='SET NAMES utf8mb4'
```

#### 连接配置
```ini
# 最大连接数
max_connections=500

# 最大错误连接数
max_connect_errors=100

# 连接超时时间（秒）
wait_timeout=28800

# 交互式连接超时时间
interactive_timeout=28800
```

#### InnoDB配置（重要）
```ini
# 默认存储引擎
default-storage-engine=INNODB

# InnoDB缓冲池大小（建议设置为物理内存的50%-70%）
innodb_buffer_pool_size=1G

# InnoDB日志文件大小
innodb_log_file_size=256M

# InnoDB日志缓冲区大小
innodb_log_buffer_size=16M

# InnoDB刷新日志到磁盘的策略（1最安全但性能较低）
innodb_flush_log_at_trx_commit=1

# InnoDB数据文件刷新方法
innodb_flush_method=O_DIRECT

# InnoDB文件每表独立
innodb_file_per_table=1
```

#### 日志配置
```ini
# 开启慢查询日志
slow_query_log=1

# 慢查询日志文件
slow_query_log_file=/usr/local/mysql/data/slow.log

# 慢查询时间阈值（秒）
long_query_time=2

# 记录没有使用索引的查询
log_queries_not_using_indexes=1

# 开启二进制日志（主从复制必须）
log-bin=mysql-bin

# 二进制日志格式（ROW/STATEMENT/MIXED）
binlog_format=ROW

# 二进制日志过期时间（天）
expire_logs_days=7
```

### 1.4.3 查看和修改配置

**查看配置：**
```sql
-- 查看所有配置
SHOW VARIABLES;

-- 查看特定配置
SHOW VARIABLES LIKE 'max_connections';

-- 查看字符集配置
SHOW VARIABLES LIKE 'character%';
```

**动态修改配置（临时生效）：**
```sql
-- 修改最大连接数
SET GLOBAL max_connections=1000;
```

**永久修改：**
修改配置文件后重启MySQL服务。

---

## 1.5 常用客户端工具

### 1.5.1 命令行客户端

**mysql命令行：**
```bash
# 基本登录
mysql -u root -p

# 指定主机和端口
mysql -h 192.168.1.100 -P 3306 -u root -p

# 执行SQL文件
mysql -u root -p < script.sql

# 执行SQL语句
mysql -u root -p -e "SHOW DATABASES;"
```

**mysqladmin工具：**
```bash
# 查看服务器状态
mysqladmin -u root -p status

# 查看变量
mysqladmin -u root -p variables

# 刷新权限
mysqladmin -u root -p flush-privileges

# 关闭MySQL
mysqladmin -u root -p shutdown
```

### 1.5.2 图形化客户端

**MySQL Workbench（官方）：**
- 免费开源
- 功能强大
- 支持数据建模、SQL开发、服务器管理
- 下载：https://dev.mysql.com/downloads/workbench/

**Navicat for MySQL（商业）：**
- 界面友好
- 功能丰富
- 支持数据同步、备份、导入导出

**DBeaver（免费）：**
- 开源免费
- 支持多种数据库
- 功能全面

**HeidiSQL（免费，Windows）：**
- 轻量级
- 界面简洁
- 适合日常使用

**phpMyAdmin（Web）：**
- 基于Web的管理工具
- 适合远程管理
- 需要PHP环境

### 1.5.3 推荐工具组合

**开发环境：**
- MySQL Workbench（数据建模）
- Navicat或DBeaver（日常开发）

**生产环境：**
- 命令行工具（脚本自动化）
- MySQL Workbench（紧急查看）

---

## 1.6 安装后的验证和测试

### 1.6.1 基本验证

```sql
-- 查看版本
SELECT VERSION();

-- 查看当前时间
SELECT NOW();

-- 查看当前用户
SELECT USER();

-- 查看数据库
SHOW DATABASES;

-- 查看存储引擎
SHOW ENGINES;

-- 查看字符集
SHOW VARIABLES LIKE 'character%';

-- 查看排序规则
SHOW VARIABLES LIKE 'collation%';
```

### 1.6.2 性能测试

```sql
-- 创建测试数据库
CREATE DATABASE test_db;
USE test_db;

-- 创建测试表
CREATE TABLE test_table (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO test_table (name) VALUES ('test1'), ('test2'), ('test3');

-- 查询测试
SELECT * FROM test_table;

-- 删除测试数据库
DROP DATABASE test_db;
```

---

## 1.7 常见安装问题

### 问题1：无法启动MySQL服务

**Windows:**
```cmd
# 查看错误日志
type D:\mysql-5.7.44\data\*.err

# 常见原因：
# 1. 端口被占用
# 2. data目录权限问题
# 3. 配置文件错误
```

**Linux:**
```bash
# 查看错误日志
tail -f /var/log/mysqld.log

# 查看服务状态
systemctl status mysqld
```

### 问题2：忘记root密码

**解决方法：**
```bash
# 1. 停止MySQL服务
sudo systemctl stop mysqld

# 2. 跳过权限验证启动
sudo mysqld_safe --skip-grant-tables &

# 3. 登录MySQL（无需密码）
mysql -u root

# 4. 修改密码
USE mysql;
UPDATE user SET authentication_string=PASSWORD('新密码') WHERE User='root';
FLUSH PRIVILEGES;

# 5. 重启MySQL
sudo systemctl restart mysqld
```

### 问题3：远程连接被拒绝

```sql
-- 1. 创建远程用户或授权
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码';
FLUSH PRIVILEGES;

-- 2. 检查防火墙
-- 3. 检查bind-address配置（注释掉或设置为0.0.0.0）
```

---

## 1.8 小结

本章学习了：
- ✅ MySQL的基本概念和版本选择
- ✅ Windows和Linux上的安装方法
- ✅ 配置文件的详细说明
- ✅ 常用客户端工具
- ✅ 安装验证和常见问题

**下一章预告：** SQL基础 - DDL数据定义语言

---

## 练习题

1. 在你的系统上安装MySQL 5.7
2. 修改root密码并创建一个新用户
3. 配置MySQL允许远程连接
4. 安装一个图形化客户端工具并连接到MySQL
5. 查看并记录你的MySQL配置参数

**继续学习：** [第02章：SQL基础-DDL](/mysql/01/02-sql-ddl.html)
