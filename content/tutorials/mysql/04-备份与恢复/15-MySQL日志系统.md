---
title: 第15章：MySQL日志系统 ⭐⭐⭐
description: 第15章：MySQL日志系统 ⭐⭐⭐ 本章是MySQL专家必须精通的核心内容，尤其是binlog机制 15.1 MySQL日志系统概述
  MySQL有多种日志类型，每种日志都有其特定的用途： 日志类型 作用 重要程度 binlog（二进制日志） 记录所有DDL和DML语句，用于复制和恢复
  ⭐⭐⭐⭐⭐ redo log（重做日志） InnoDB引擎特有，保证事务...
url: /mysql/04/15-mysql.html
layout: tutorial
contentType: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 150
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第15章：MySQL日志系统 ⭐⭐⭐

> 本章是MySQL专家必须精通的核心内容，尤其是binlog机制

## 15.1 MySQL日志系统概述

MySQL有多种日志类型，每种日志都有其特定的用途：

| 日志类型 | 作用 | 重要程度 |
|---------|------|---------|
| **binlog（二进制日志）** | 记录所有DDL和DML语句，用于复制和恢复 | ⭐⭐⭐⭐⭐ |
| **redo log（重做日志）** | InnoDB引擎特有，保证事务持久性 | ⭐⭐⭐⭐⭐ |
| **undo log（回滚日志）** | 保证事务原子性，实现MVCC | ⭐⭐⭐⭐⭐ |
| **slow query log（慢查询日志）** | 记录慢查询，用于性能优化 | ⭐⭐⭐⭐ |
| **error log（错误日志）** | 记录MySQL启动、运行、停止时的错误信息 | ⭐⭐⭐⭐ |
| **general log（通用查询日志）** | 记录所有SQL语句 | ⭐⭐ |
| **relay log（中继日志）** | 主从复制时，从库使用 | ⭐⭐⭐⭐ |

---

## 15.2 binlog（二进制日志）详解 ⭐⭐⭐⭐⭐

### 15.2.1 binlog的作用

binlog是MySQL最重要的日志之一，主要用途：

1. **主从复制**：主库的binlog传输到从库进行重放，实现数据同步
2. **数据恢复**：通过binlog进行时间点恢复（Point-In-Time Recovery）
3. **数据审计**：记录所有数据变更操作

### 15.2.2 binlog vs redo log

这是面试高频问题，必须理解：

| 特性 | binlog | redo log |
|------|--------|----------|
| **层级** | MySQL Server层，所有引擎都可用 | InnoDB引擎层 |
| **内容** | 逻辑日志，记录SQL语句或行变更 | 物理日志，记录数据页的修改 |
| **写入方式** | 追加写入，不会覆盖 | 循环写入，空间固定 |
| **用途** | 复制、恢复 | 崩溃恢复 |
| **格式** | ROW/STATEMENT/MIXED | 固定格式 |

**两阶段提交：**
为了保证binlog和redo log的一致性，MySQL使用两阶段提交：
```
1. prepare阶段：写入redo log，状态为prepare
2. commit阶段：写入binlog，然后提交redo log
```

### 15.2.3 binlog的三种格式

#### 1. STATEMENT格式（语句模式）

**特点：**
- 记录执行的SQL语句
- 日志量小
- 可能导致主从数据不一致

**示例：**
```sql
UPDATE users SET login_count = login_count + 1 WHERE id = 100;
```

binlog记录：
```
UPDATE users SET login_count = login_count + 1 WHERE id = 100
```

**问题场景：**
```sql
-- 主库执行
DELETE FROM users WHERE create_time < NOW() LIMIT 10;

-- 如果主从库的数据顺序不同，删除的数据可能不一样
-- 使用UUID()、RAND()等函数也会导致不一致
```

#### 2. ROW格式（行模式）⭐ 推荐

**特点：**
- 记录每一行数据的变化
- 日志量大
- 数据一致性最好
- MySQL 5.7默认格式

**示例：**
```sql
UPDATE users SET login_count = login_count + 1 WHERE id = 100;
```

binlog记录（简化）：
```
### UPDATE `test`.`users`
### WHERE
###   @1=100 /* id */
###   @2=5 /* login_count */
### SET
###   @1=100 /* id */
###   @2=6 /* login_count */
```

**优点：**
- 任何情况下都能保证主从一致
- 可以精确恢复每一行数据
- 适合数据审计

**缺点：**
- 批量操作时日志量大
- 例如：`UPDATE users SET status=1` 更新100万行，会记录100万行的变化

#### 3. MIXED格式（混合模式）

**特点：**
- 默认使用STATEMENT格式
- 遇到可能导致不一致的语句时，自动切换到ROW格式
- 平衡了日志大小和一致性

**自动切换到ROW的场景：**
- 使用UUID()、USER()、CURRENT_USER()等函数
- 使用AUTO_INCREMENT列
- 使用LIMIT且没有ORDER BY
- 使用触发器或存储过程

### 15.2.4 binlog的配置

#### 开启binlog

**配置文件（my.cnf/my.ini）：**
```ini
[mysqld]
# 开启binlog（必须）
log-bin=mysql-bin

# binlog格式（推荐ROW）
binlog_format=ROW

# 每个binlog文件的最大大小（默认1G）
max_binlog_size=1G

# binlog过期时间（天），0表示不自动删除
expire_logs_days=7

# MySQL 8.0使用这个参数（秒）
# binlog_expire_logs_seconds=604800

# 同步binlog到磁盘的策略
# 0: 由操作系统决定何时刷新（性能最好，安全性最差）
# 1: 每次事务提交都刷新（最安全，性能较差）⭐ 推荐
# N: 每N个事务刷新一次
sync_binlog=1

# binlog缓存大小
binlog_cache_size=4M

# 单个事务的binlog缓存大小
max_binlog_cache_size=512M

# 指定哪些数据库记录binlog（可选）
# binlog-do-db=mydb

# 指定哪些数据库不记录binlog（可选）
# binlog-ignore-db=test

# server_id（主从复制必须，每个MySQL实例唯一）
server-id=1
```

**重启MySQL使配置生效：**
```bash
sudo systemctl restart mysqld
```

#### 查看binlog配置

```sql
-- 查看binlog是否开启
SHOW VARIABLES LIKE 'log_bin';

-- 查看binlog格式
SHOW VARIABLES LIKE 'binlog_format';

-- 查看所有binlog相关配置
SHOW VARIABLES LIKE 'binlog%';

-- 查看sync_binlog配置
SHOW VARIABLES LIKE 'sync_binlog';
```

### 15.2.5 binlog的管理

#### 查看binlog文件

```sql
-- 查看所有binlog文件
SHOW BINARY LOGS;
-- 或
SHOW MASTER LOGS;

-- 输出示例：
-- +------------------+-----------+
-- | Log_name         | File_size |
-- +------------------+-----------+
-- | mysql-bin.000001 | 177       |
-- | mysql-bin.000002 | 1547      |
-- | mysql-bin.000003 | 154       |
-- +------------------+-----------+

-- 查看当前正在写入的binlog
SHOW MASTER STATUS;

-- 输出示例：
-- +------------------+----------+--------------+------------------+
-- | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
-- +------------------+----------+--------------+------------------+
-- | mysql-bin.000003 | 154      |              |                  |
-- +------------------+----------+--------------+------------------+
```

#### 查看binlog内容

**使用mysqlbinlog工具：**

```bash
# 查看binlog内容（基本格式）
mysqlbinlog mysql-bin.000001

# 查看binlog内容（详细格式，ROW格式必须加-v）
mysqlbinlog -v mysql-bin.000001

# 查看binlog内容（超详细格式）
mysqlbinlog -vv mysql-bin.000001

# 指定开始位置
mysqlbinlog --start-position=154 mysql-bin.000001

# 指定结束位置
mysqlbinlog --stop-position=500 mysql-bin.000001

# 指定时间范围
mysqlbinlog --start-datetime="2024-01-01 00:00:00" \
            --stop-datetime="2024-01-01 23:59:59" \
            mysql-bin.000001

# 输出到文件
mysqlbinlog mysql-bin.000001 > binlog.sql

# 查看多个binlog文件
mysqlbinlog mysql-bin.000001 mysql-bin.000002 > all_binlog.sql

# 只查看指定数据库的binlog
mysqlbinlog --database=mydb mysql-bin.000001

# 解析ROW格式的binlog（必须加-v或-vv）
mysqlbinlog -vv --base64-output=DECODE-ROWS mysql-bin.000001
```

**binlog内容示例：**

STATEMENT格式：
```
# at 123
#241101 10:30:45 server id 1  end_log_pos 250  Query   thread_id=5
SET TIMESTAMP=1698825045/*!*/;
UPDATE users SET login_count = login_count + 1 WHERE id = 100
/*!*/;
```

ROW格式（需要-v参数）：
```
# at 123
#241101 10:30:45 server id 1  end_log_pos 250  Update_rows: table id 108 flags: STMT_END_F
### UPDATE `test`.`users`
### WHERE
###   @1=100 /* INT meta=0 nullable=0 is_null=0 */
###   @2='张三' /* VARSTRING(200) meta=200 nullable=1 is_null=0 */
###   @3=5 /* INT meta=0 nullable=1 is_null=0 */
### SET
###   @1=100
###   @2='张三'
###   @3=6
```

#### 删除binlog

```sql
-- 删除指定binlog之前的所有binlog
PURGE BINARY LOGS TO 'mysql-bin.000003';

-- 删除指定时间之前的binlog
PURGE BINARY LOGS BEFORE '2024-01-01 00:00:00';

-- 删除所有binlog（危险操作！）
RESET MASTER;

-- 查看binlog占用空间
SELECT
    CONCAT(ROUND(SUM(File_size)/1024/1024, 2), 'MB') AS binlog_size
FROM information_schema.BINARY_LOGS;
```

**自动清理配置：**
```ini
# 配置文件中设置
expire_logs_days=7  # MySQL 5.7
binlog_expire_logs_seconds=604800  # MySQL 8.0（7天）
```

#### 刷新binlog

```sql
-- 手动切换到新的binlog文件
FLUSH LOGS;

-- 或使用命令行
mysqladmin -u root -p flush-logs
```

**使用场景：**
- 备份前刷新，方便管理
- binlog文件过大时手动切换
- 定期归档binlog

### 15.2.6 binlog实战案例

#### 案例1：查看某个表的所有变更

```bash
# 查看users表的所有变更
mysqlbinlog -vv --base64-output=DECODE-ROWS mysql-bin.* | grep -A 20 "users"
```

#### 案例2：统计某个时间段的操作

```bash
# 统计今天的INSERT、UPDATE、DELETE数量
mysqlbinlog --start-datetime="2024-11-01 00:00:00" \
            --stop-datetime="2024-11-01 23:59:59" \
            mysql-bin.* | grep -E "INSERT|UPDATE|DELETE" | wc -l
```

#### 案例3：找出误删除的数据

```bash
# 假设在10:30误删了数据，查看10:00-11:00的binlog
mysqlbinlog -vv --start-datetime="2024-11-01 10:00:00" \
                --stop-datetime="2024-11-01 11:00:00" \
                mysql-bin.000003 | grep -A 50 "DELETE FROM users"
```

#### 案例4：恢复误删除的数据

```bash
# 1. 找到误删除的位置
mysqlbinlog -vv mysql-bin.000003 | grep -B 5 -A 20 "DELETE FROM users"

# 2. 提取误删除之前的binlog（假设误删除位置是500）
mysqlbinlog --stop-position=500 mysql-bin.000003 > before_delete.sql

# 3. 提取误删除之后的binlog（假设误删除结束位置是600）
mysqlbinlog --start-position=600 mysql-bin.000003 > after_delete.sql

# 4. 恢复数据
mysql -u root -p < before_delete.sql
# 手动恢复被删除的数据
mysql -u root -p < after_delete.sql
```

---

## 15.3 redo log（重做日志）详解 ⭐⭐⭐⭐⭐

### 15.3.1 redo log的作用

redo log是InnoDB存储引擎特有的日志，用于实现**事务的持久性（Durability）**。

**核心问题：**
如果每次事务提交都将数据刷新到磁盘，性能会很差。redo log解决了这个问题。

**工作原理：**
1. 事务提交时，先写redo log（顺序写，速度快）
2. 数据页的修改可以延迟写入磁盘（随机写，速度慢）
3. MySQL崩溃后，通过redo log恢复未刷盘的数据

这就是**WAL（Write-Ahead Logging）**机制。

### 15.3.2 redo log的结构

**物理结构：**
- redo log由一组文件组成（默认2个）
- 文件名：`ib_logfile0`、`ib_logfile1`
- 循环写入，空间固定

**逻辑结构：**
```
+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  ← redo log文件（循环）
+---+---+---+---+---+---+---+---+
  ↑               ↑
  write pos      checkpoint

write pos: 当前写入位置
checkpoint: 当前擦除位置（已刷盘的数据）
```

**状态：**
- `write pos` 和 `checkpoint` 之间：可以写入的空间
- `checkpoint` 和 `write pos` 之间：已写入但未刷盘的数据
- 如果 `write pos` 追上 `checkpoint`，需要先刷盘，腾出空间

### 15.3.3 redo log的配置

```ini
[mysqld]
# redo log文件大小（每个文件）
innodb_log_file_size=512M

# redo log文件数量
innodb_log_files_in_group=2

# redo log缓冲区大小
innodb_log_buffer_size=16M

# redo log刷盘策略
# 0: 每秒刷一次（性能最好，可能丢失1秒数据）
# 1: 每次事务提交都刷盘（最安全）⭐ 推荐
# 2: 每次事务提交写到OS缓存，每秒刷盘
innodb_flush_log_at_trx_commit=1
```

**查看配置：**
```sql
SHOW VARIABLES LIKE 'innodb_log%';
```

### 15.3.4 redo log与binlog的两阶段提交

**为什么需要两阶段提交？**

假设执行：`UPDATE users SET age=20 WHERE id=1`

**如果没有两阶段提交：**
1. 先写redo log，再写binlog
   - 如果写完redo log后崩溃，重启后数据已更新，但binlog没记录
   - 主从复制时，从库不会执行这个更新，导致主从不一致

2. 先写binlog，再写redo log
   - 如果写完binlog后崩溃，重启后数据未更新，但binlog已记录
   - 主从复制时，从库会执行这个更新，导致主从不一致

**两阶段提交流程：**
```
1. prepare阶段：
   - 写入redo log，标记为prepare状态
   - 此时事务还未提交

2. commit阶段：
   - 写入binlog
   - 提交redo log，标记为commit状态
   - 事务提交完成

崩溃恢复时：
- 如果redo log是prepare状态，且binlog完整 → 提交事务
- 如果redo log是prepare状态，但binlog不完整 → 回滚事务
- 如果redo log是commit状态 → 事务已提交
```

**图示：**
```
事务执行流程：
┌─────────┐
│ 执行SQL  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ 写入redo log    │ ← prepare阶段
│ (prepare状态)   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ 写入binlog      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ 提交redo log    │ ← commit阶段
│ (commit状态)    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ 事务提交完成     │
└─────────────────┘
```

### 15.3.5 redo log性能优化

**参数调优：**
```ini
# 增大redo log文件大小，减少checkpoint频率
innodb_log_file_size=1G

# 增大redo log缓冲区
innodb_log_buffer_size=32M

# 根据业务场景调整刷盘策略
# 金融系统：innodb_flush_log_at_trx_commit=1（最安全）
# 一般系统：innodb_flush_log_at_trx_commit=1（推荐）
# 高性能要求：innodb_flush_log_at_trx_commit=2（可能丢失1秒数据）
```

**监控redo log：**
```sql
-- 查看redo log使用情况
SHOW ENGINE INNODB STATUS\G

-- 关注以下指标：
-- Log sequence number: 当前LSN
-- Log flushed up to: 已刷盘的LSN
-- Pages flushed up to: 已刷盘的页LSN
-- Last checkpoint at: 最后一次checkpoint的LSN
```

---

## 15.4 undo log（回滚日志）详解 ⭐⭐⭐⭐⭐

### 15.4.1 undo log的作用

undo log有两个重要作用：

1. **事务回滚**：保证事务的原子性（Atomicity）
2. **MVCC（多版本并发控制）**：实现一致性非锁定读

### 15.4.2 undo log的工作原理

**记录内容：**
- INSERT操作：记录主键，回滚时删除这条记录
- DELETE操作：记录整行数据，回滚时插入这条记录
- UPDATE操作：记录修改前的值，回滚时恢复

**示例：**
```sql
-- 原始数据
id=1, name='张三', age=20

-- 执行UPDATE
UPDATE users SET age=30 WHERE id=1;

-- undo log记录
UPDATE users SET age=20 WHERE id=1;  -- 回滚时执行这个
```

### 15.4.3 undo log与MVCC

**MVCC原理：**
每行数据都有两个隐藏列：
- `DB_TRX_ID`：最后修改该行的事务ID
- `DB_ROLL_PTR`：指向undo log的指针

**版本链：**
```
当前版本: id=1, name='张三', age=30, trx_id=100
           ↓ (DB_ROLL_PTR)
undo log: id=1, name='张三', age=20, trx_id=90
           ↓
undo log: id=1, name='张三', age=10, trx_id=80
```

**读取数据时：**
- 根据事务隔离级别和事务ID
- 通过版本链找到对应版本的数据
- 实现了不加锁的一致性读

详细内容见：[第08章：事务与并发控制](/mysql/02/08.html)

### 15.4.4 undo log的配置

```ini
[mysqld]
# undo表空间数量（MySQL 5.7）
innodb_undo_tablespaces=2

# undo日志目录
innodb_undo_directory=/var/lib/mysql/undo

# undo日志回收（MySQL 5.7.5+）
innodb_undo_log_truncate=ON

# undo表空间最大大小
innodb_max_undo_log_size=1G
```

**查看undo log：**
```sql
-- 查看undo log配置
SHOW VARIABLES LIKE 'innodb_undo%';

-- 查看undo log使用情况
SELECT
    tablespace_name,
    file_name,
    file_size/1024/1024 AS size_mb
FROM information_schema.FILES
WHERE tablespace_name LIKE 'innodb_undo%';
```

---

## 15.5 慢查询日志（Slow Query Log）⭐⭐⭐⭐

### 15.5.1 慢查询日志的作用

记录执行时间超过阈值的SQL语句，用于性能优化。

### 15.5.2 配置慢查询日志

```ini
[mysqld]
# 开启慢查询日志
slow_query_log=1

# 慢查询日志文件
slow_query_log_file=/var/lib/mysql/slow.log

# 慢查询时间阈值（秒）
long_query_time=2

# 记录没有使用索引的查询
log_queries_not_using_indexes=1

# 限制每分钟记录的未使用索引的查询数量
log_throttle_queries_not_using_indexes=10

# 记录管理语句（如ALTER TABLE）
log_slow_admin_statements=1

# 记录从库上的慢查询
log_slow_slave_statements=1
```

**动态开启：**
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log=1;

-- 设置慢查询时间阈值
SET GLOBAL long_query_time=2;

-- 查看配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';
```

### 15.5.3 分析慢查询日志

**查看慢查询日志：**
```bash
# 直接查看
tail -f /var/lib/mysql/slow.log

# 使用mysqldumpslow工具分析
# 按查询次数排序，显示前10条
mysqldumpslow -s c -t 10 /var/lib/mysql/slow.log

# 按查询时间排序
mysqldumpslow -s t -t 10 /var/lib/mysql/slow.log

# 按锁定时间排序
mysqldumpslow -s l -t 10 /var/lib/mysql/slow.log

# 按返回记录数排序
mysqldumpslow -s r -t 10 /var/lib/mysql/slow.log

# 组合使用
mysqldumpslow -s t -t 10 -g "SELECT" /var/lib/mysql/slow.log
```

**使用pt-query-digest工具（推荐）：**
```bash
# 安装percona-toolkit
yum install percona-toolkit

# 分析慢查询日志
pt-query-digest /var/lib/mysql/slow.log

# 输出到文件
pt-query-digest /var/lib/mysql/slow.log > slow_report.txt

# 只分析最近1小时的日志
pt-query-digest --since=1h /var/lib/mysql/slow.log

# 分析并输出到数据库
pt-query-digest --review h=localhost,D=test,t=query_review \
                --history h=localhost,D=test,t=query_history \
                /var/lib/mysql/slow.log
```

**慢查询日志示例：**
```
# Time: 2024-11-01T10:30:45.123456Z
# User@Host: root[root] @ localhost []  Id:     5
# Query_time: 3.123456  Lock_time: 0.000123 Rows_sent: 100  Rows_examined: 1000000
SET timestamp=1698825045;
SELECT * FROM users WHERE age > 20 ORDER BY create_time DESC LIMIT 100;
```

---

## 15.6 错误日志（Error Log）⭐⭐⭐⭐

### 15.6.1 错误日志的作用

记录MySQL启动、运行、停止过程中的错误、警告和注意信息。

### 15.6.2 配置错误日志

```ini
[mysqld]
# 错误日志文件
log-error=/var/log/mysqld.log

# 日志级别（MySQL 8.0）
# 1: ERROR
# 2: ERROR, WARNING
# 3: ERROR, WARNING, INFORMATION
log_error_verbosity=2
```

**查看错误日志位置：**
```sql
SHOW VARIABLES LIKE 'log_error';
```

**查看错误日志：**
```bash
# 查看最新的错误
tail -f /var/log/mysqld.log

# 查看最近100行
tail -n 100 /var/log/mysqld.log

# 搜索错误
grep -i error /var/log/mysqld.log

# 搜索警告
grep -i warning /var/log/mysqld.log
```

---

## 15.7 通用查询日志（General Query Log）

### 15.7.1 通用查询日志的作用

记录所有SQL语句，包括SELECT、INSERT、UPDATE、DELETE等。

**注意：** 生产环境不建议开启，会严重影响性能！

### 15.7.2 配置通用查询日志

```ini
[mysqld]
# 开启通用查询日志
general_log=1

# 日志文件
general_log_file=/var/lib/mysql/general.log
```

**动态开启（临时调试用）：**
```sql
-- 开启
SET GLOBAL general_log=1;

-- 关闭
SET GLOBAL general_log=0;

-- 查看配置
SHOW VARIABLES LIKE 'general_log%';
```

---

## 15.8 中继日志（Relay Log）

### 15.8.1 中继日志的作用

主从复制时，从库使用中继日志：
1. 从库的IO线程从主库读取binlog
2. 写入从库的relay log
3. 从库的SQL线程读取relay log并执行

详细内容见：[第22章：主从复制](/mysql/06/22.html)

---

## 15.9 日志系统最佳实践

### 15.9.1 生产环境推荐配置

```ini
[mysqld]
# binlog配置
log-bin=mysql-bin
binlog_format=ROW
sync_binlog=1
expire_logs_days=7
max_binlog_size=1G

# redo log配置
innodb_log_file_size=1G
innodb_log_files_in_group=2
innodb_flush_log_at_trx_commit=1

# 慢查询日志
slow_query_log=1
long_query_time=2
log_queries_not_using_indexes=1

# 错误日志
log-error=/var/log/mysqld.log
```

### 15.9.2 日志监控

**监控指标：**
- binlog生成速度
- binlog磁盘占用
- 慢查询数量
- 错误日志中的ERROR和WARNING

**监控脚本示例：**
```bash
#!/bin/bash
# 检查binlog大小
binlog_size=$(mysql -e "SELECT CONCAT(ROUND(SUM(File_size)/1024/1024, 2), 'MB') FROM information_schema.BINARY_LOGS;" -N)
echo "Binlog total size: $binlog_size"

# 检查慢查询数量
slow_queries=$(mysql -e "SHOW GLOBAL STATUS LIKE 'Slow_queries';" -N | awk '{print $2}')
echo "Slow queries: $slow_queries"

# 检查错误日志
error_count=$(grep -c "ERROR" /var/log/mysqld.log)
echo "Error count: $error_count"
```

### 15.9.3 日志归档

**binlog归档脚本：**
```bash
#!/bin/bash
# binlog归档脚本

BACKUP_DIR="/backup/binlog"
MYSQL_BIN_DIR="/var/lib/mysql"
DATE=$(date +%Y%m%d)

# 创建归档目录
mkdir -p $BACKUP_DIR/$DATE

# 刷新binlog
mysql -e "FLUSH LOGS;"

# 获取当前binlog文件
current_binlog=$(mysql -e "SHOW MASTER STATUS\G" | grep File | awk '{print $2}')

# 复制除当前binlog外的所有binlog
for binlog in $(ls $MYSQL_BIN_DIR/mysql-bin.* | grep -v $current_binlog); do
    cp $binlog $BACKUP_DIR/$DATE/
done

# 删除7天前的归档
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

echo "Binlog archived to $BACKUP_DIR/$DATE"
```

---

## 15.10 小结

本章学习了MySQL的日志系统：

- ✅ **binlog**：主从复制和数据恢复的核心，必须精通
- ✅ **redo log**：保证事务持久性，理解WAL机制
- ✅ **undo log**：事务回滚和MVCC的基础
- ✅ **慢查询日志**：性能优化的重要工具
- ✅ **错误日志**：故障排查的第一手资料
- ✅ **两阶段提交**：保证binlog和redo log的一致性

**重点掌握：**
1. binlog的三种格式及应用场景
2. binlog的查看和管理
3. redo log与binlog的区别
4. 两阶段提交的原理
5. 慢查询日志的分析

**下一章预告：** 备份策略与实践

---

## 练习题

1. 配置MySQL开启binlog，格式为ROW
2. 执行一些DML操作，使用mysqlbinlog查看binlog内容
3. 配置慢查询日志，找出执行时间超过1秒的SQL
4. 理解并画出两阶段提交的流程图
5. 编写脚本定期归档binlog

**继续学习：** [第16章：备份策略与实践](/mysql/04/16.html)
