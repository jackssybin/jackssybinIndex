---
title: 第03章：SQL基础 - DML数据操作语言
description: 第03章：SQL基础 DML数据操作语言 DML (Data Manipulation Language) 用于操作数据库中的数据
  3.1 DML概述 DML主要包括三个语句： INSERT ：插入数据 UPDATE ：更新数据 DELETE ：删除数据 3.2 INSERT 插入数据
  3.2.1 基本语法 3.2.2 插入单行数据 准备测试表： 插入数据：...
url: /mysql/01/03-sql-dml.html
layout: tutorial
contentType: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 30
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第03章：SQL基础 - DML数据操作语言

> DML (Data Manipulation Language) 用于操作数据库中的数据

## 3.1 DML概述

**DML主要包括三个语句：**
- **INSERT**：插入数据
- **UPDATE**：更新数据
- **DELETE**：删除数据

---

## 3.2 INSERT - 插入数据

### 3.2.1 基本语法

```sql
-- 语法1：指定列名
INSERT INTO table_name (column1, column2, ...) 
VALUES (value1, value2, ...);

-- 语法2：不指定列名（必须提供所有列的值）
INSERT INTO table_name 
VALUES (value1, value2, ...);
```

### 3.2.2 插入单行数据

**准备测试表：**
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    age INT,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**插入数据：**
```sql
-- 方法1：指定列名（推荐）
INSERT INTO users (username, password, email, age) 
VALUES ('zhangsan', '123456', 'zhangsan@example.com', 25);

-- 方法2：不指定列名
INSERT INTO users 
VALUES (NULL, 'lisi', '123456', 'lisi@example.com', 30, 1, NOW());

-- 方法3：部分列
INSERT INTO users (username, password) 
VALUES ('wangwu', '123456');
-- email、age为NULL，status使用默认值1，create_time自动设置
```

### 3.2.3 插入多行数据

```sql
-- 一次插入多行（推荐，性能好）
INSERT INTO users (username, password, email, age) VALUES
('user1', 'pass1', 'user1@example.com', 20),
('user2', 'pass2', 'user2@example.com', 22),
('user3', 'pass3', 'user3@example.com', 24),
('user4', 'pass4', 'user4@example.com', 26);

-- 性能对比
-- 方法1：插入1000行，执行1000次INSERT（慢）
-- 方法2：插入1000行，执行1次INSERT（快10倍以上）
```

### 3.2.4 插入查询结果

```sql
-- 从另一个表插入数据
INSERT INTO users_backup (username, password, email, age)
SELECT username, password, email, age FROM users WHERE age > 25;

-- 创建表并插入数据
CREATE TABLE users_active AS 
SELECT * FROM users WHERE status = 1;
```

### 3.2.5 INSERT IGNORE

```sql
-- 忽略重复键错误
INSERT IGNORE INTO users (username, password) 
VALUES ('zhangsan', '123456');
-- 如果username已存在，不会报错，也不会插入

-- 对比：普通INSERT会报错
INSERT INTO users (username, password) 
VALUES ('zhangsan', '123456');
-- ERROR 1062: Duplicate entry 'zhangsan' for key 'username'
```

### 3.2.6 REPLACE INTO

```sql
-- 如果存在则替换，不存在则插入
REPLACE INTO users (id, username, password) 
VALUES (1, 'zhangsan', 'newpass');

-- 等价于
DELETE FROM users WHERE id = 1;
INSERT INTO users (id, username, password) VALUES (1, 'zhangsan', 'newpass');
```

### 3.2.7 ON DUPLICATE KEY UPDATE

```sql
-- 如果主键或唯一键冲突，则更新
INSERT INTO users (username, password, email) 
VALUES ('zhangsan', '123456', 'new@example.com')
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    email = VALUES(email);

-- 实战示例：统计访问次数
CREATE TABLE page_views (
    page_id INT PRIMARY KEY,
    view_count INT DEFAULT 0
);

-- 每次访问，计数+1
INSERT INTO page_views (page_id, view_count) 
VALUES (1, 1)
ON DUPLICATE KEY UPDATE 
    view_count = view_count + 1;
```

---

## 3.3 UPDATE - 更新数据

### 3.3.1 基本语法

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**⚠️ 警告：** 如果不加WHERE条件，会更新所有行！

### 3.3.2 更新单行

```sql
-- 更新单个字段
UPDATE users 
SET email = 'newemail@example.com' 
WHERE id = 1;

-- 更新多个字段
UPDATE users 
SET email = 'newemail@example.com', age = 26 
WHERE id = 1;
```

### 3.3.3 更新多行

```sql
-- 更新所有年龄小于18的用户状态
UPDATE users 
SET status = 0 
WHERE age < 18;

-- 更新所有用户（危险！）
UPDATE users 
SET status = 1;
```

### 3.3.4 使用表达式更新

```sql
-- 年龄+1
UPDATE users 
SET age = age + 1 
WHERE id = 1;

-- 字符串拼接
UPDATE users 
SET username = CONCAT(username, '_old') 
WHERE status = 0;

-- 使用函数
UPDATE users 
SET email = LOWER(email);
```

### 3.3.5 基于其他表更新

```sql
-- 根据另一个表的数据更新
UPDATE users u
INNER JOIN user_profiles p ON u.id = p.user_id
SET u.age = p.age
WHERE p.age IS NOT NULL;

-- 示例：更新订单总金额
UPDATE orders o
SET o.total_amount = (
    SELECT SUM(quantity * price) 
    FROM order_items 
    WHERE order_id = o.id
);
```

### 3.3.6 LIMIT限制更新行数

```sql
-- 只更新前10行
UPDATE users 
SET status = 0 
WHERE age < 18 
LIMIT 10;
```

### 3.3.7 安全模式

```sql
-- 查看安全模式状态
SHOW VARIABLES LIKE 'sql_safe_updates';

-- 开启安全模式（防止误操作）
SET sql_safe_updates = 1;

-- 此时必须带WHERE条件且包含主键或索引列
UPDATE users SET status = 0;  -- 报错
UPDATE users SET status = 0 WHERE id = 1;  -- 正常

-- 关闭安全模式
SET sql_safe_updates = 0;
```

---

## 3.4 DELETE - 删除数据

### 3.4.1 基本语法

```sql
DELETE FROM table_name
WHERE condition;
```

**⚠️ 警告：** 如果不加WHERE条件，会删除所有行！

### 3.4.2 删除单行

```sql
-- 删除指定ID的用户
DELETE FROM users WHERE id = 1;

-- 删除指定用户名的用户
DELETE FROM users WHERE username = 'zhangsan';
```

### 3.4.3 删除多行

```sql
-- 删除所有状态为0的用户
DELETE FROM users WHERE status = 0;

-- 删除年龄小于18的用户
DELETE FROM users WHERE age < 18;

-- 删除所有用户（危险！）
DELETE FROM users;
```

### 3.4.4 LIMIT限制删除行数

```sql
-- 只删除前10行
DELETE FROM users 
WHERE status = 0 
LIMIT 10;

-- 删除最早的100条记录
DELETE FROM logs 
ORDER BY create_time ASC 
LIMIT 100;
```

### 3.4.5 基于其他表删除

```sql
-- 删除没有订单的用户
DELETE FROM users 
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- 使用JOIN删除
DELETE u FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

---

## 3.5 TRUNCATE - 清空表

### 3.5.1 基本语法

```sql
TRUNCATE TABLE table_name;
```

### 3.5.2 TRUNCATE vs DELETE

| 特性 | TRUNCATE | DELETE |
|------|----------|--------|
| **速度** | 快（直接删除表，重建） | 慢（逐行删除） |
| **WHERE条件** | 不支持 | 支持 |
| **自增ID** | 重置为1 | 不重置 |
| **事务回滚** | 不能回滚（DDL） | 可以回滚（DML） |
| **触发器** | 不触发 | 触发 |
| **返回值** | 不返回删除行数 | 返回删除行数 |

**示例：**
```sql
-- 创建测试表
CREATE TABLE test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);

INSERT INTO test (name) VALUES ('A'), ('B'), ('C');
SELECT * FROM test;  -- id: 1, 2, 3

-- 使用DELETE
DELETE FROM test;
INSERT INTO test (name) VALUES ('D');
SELECT * FROM test;  -- id: 4（继续增长）

-- 使用TRUNCATE
TRUNCATE TABLE test;
INSERT INTO test (name) VALUES ('E');
SELECT * FROM test;  -- id: 1（重置）
```

**使用建议：**
- 清空整个表 → TRUNCATE（快）
- 删除部分数据 → DELETE
- 需要回滚 → DELETE
- 需要触发器 → DELETE

---

## 3.6 实战案例

### 案例1：用户注册

```sql
-- 插入新用户
INSERT INTO users (username, password, email, phone) 
VALUES ('newuser', MD5('password123'), 'user@example.com', '13800138000');

-- 获取插入的ID
SELECT LAST_INSERT_ID();

-- 插入用户资料
INSERT INTO user_profiles (user_id, real_name, age, gender)
VALUES (LAST_INSERT_ID(), '张三', 25, 'M');
```

### 案例2：批量导入数据

```sql
-- 批量插入商品
INSERT INTO products (name, category_id, price, stock) VALUES
('iPhone 15', 1, 7999.00, 100),
('MacBook Pro', 1, 15999.00, 50),
('iPad Air', 1, 4999.00, 80),
('AirPods Pro', 1, 1999.00, 200),
('Apple Watch', 1, 3299.00, 150);

-- 查看影响的行数
SELECT ROW_COUNT();
```

### 案例3：更新库存

```sql
-- 下单时减少库存
UPDATE products
SET stock = stock - 1
WHERE id = 1 AND stock > 0;

-- 检查是否更新成功
SELECT ROW_COUNT();  -- 返回1表示成功，0表示库存不足

-- 更安全的方式：使用事务
START TRANSACTION;

UPDATE products
SET stock = stock - 1
WHERE id = 1 AND stock > 0;

-- 检查库存是否足够
IF ROW_COUNT() = 0 THEN
    ROLLBACK;
    SELECT '库存不足' AS message;
ELSE
    COMMIT;
    SELECT '下单成功' AS message;
END IF;
```

### 案例4：软删除

```sql
-- 不真正删除数据，只标记为已删除
UPDATE users
SET status = 0, deleted_at = NOW()
WHERE id = 1;

-- 查询时过滤已删除的数据
SELECT * FROM users WHERE status = 1;

-- 恢复删除的数据
UPDATE users
SET status = 1, deleted_at = NULL
WHERE id = 1;
```

### 案例5：数据迁移

```sql
-- 将旧表数据迁移到新表
INSERT INTO users_new (username, email, age, create_time)
SELECT username, email, age, create_time
FROM users_old
WHERE create_time >= '2024-01-01';

-- 查看迁移的行数
SELECT ROW_COUNT();
```

### 案例6：去重

```sql
-- 删除重复的用户（保留ID最小的）
DELETE u1 FROM users u1
INNER JOIN users u2
WHERE u1.username = u2.username
  AND u1.id > u2.id;

-- 或使用子查询
DELETE FROM users
WHERE id NOT IN (
    SELECT * FROM (
        SELECT MIN(id) FROM users GROUP BY username
    ) AS temp
);
```

### 案例7：批量更新

```sql
-- 批量更新用户等级
UPDATE users
SET level = CASE
    WHEN total_amount >= 10000 THEN 'VIP'
    WHEN total_amount >= 5000 THEN 'Gold'
    WHEN total_amount >= 1000 THEN 'Silver'
    ELSE 'Bronze'
END;

-- 根据年龄段更新分组
UPDATE users
SET age_group = CASE
    WHEN age < 18 THEN '未成年'
    WHEN age BETWEEN 18 AND 30 THEN '青年'
    WHEN age BETWEEN 31 AND 50 THEN '中年'
    ELSE '老年'
END;
```

### 案例8：定期清理日志

```sql
-- 删除30天前的日志
DELETE FROM logs
WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- 分批删除（避免锁表时间过长）
DELETE FROM logs
WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY)
LIMIT 1000;

-- 循环执行直到删除完毕
WHILE (SELECT COUNT(*) FROM logs WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY)) > 0 DO
    DELETE FROM logs
    WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY)
    LIMIT 1000;

    -- 暂停一下，避免影响性能
    SELECT SLEEP(0.1);
END WHILE;
```

---

## 3.7 性能优化建议

### 3.7.1 INSERT优化

**1. 批量插入**
```sql
-- ❌ 慢：逐条插入
INSERT INTO users (name) VALUES ('user1');
INSERT INTO users (name) VALUES ('user2');
INSERT INTO users (name) VALUES ('user3');

-- ✅ 快：批量插入
INSERT INTO users (name) VALUES ('user1'), ('user2'), ('user3');
```

**2. 禁用索引和约束（大批量导入时）**
```sql
-- 禁用索引
ALTER TABLE users DISABLE KEYS;

-- 导入数据
INSERT INTO users ...

-- 启用索引
ALTER TABLE users ENABLE KEYS;
```

**3. 使用LOAD DATA（最快）**
```sql
-- 从CSV文件导入
LOAD DATA INFILE '/path/to/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

**4. 调整参数**
```sql
-- 增加批量插入缓冲区
SET bulk_insert_buffer_size = 256 * 1024 * 1024;  -- 256MB
```

### 3.7.2 UPDATE优化

**1. 使用索引**
```sql
-- ❌ 慢：没有索引
UPDATE users SET status = 1 WHERE email = 'user@example.com';

-- ✅ 快：在email上创建索引
CREATE INDEX idx_email ON users(email);
UPDATE users SET status = 1 WHERE email = 'user@example.com';
```

**2. 避免更新索引列**
```sql
-- ❌ 慢：更新索引列
UPDATE users SET username = 'newname' WHERE id = 1;

-- ✅ 快：更新非索引列
UPDATE users SET age = 26 WHERE id = 1;
```

**3. 分批更新**
```sql
-- ❌ 慢：一次更新100万行
UPDATE users SET status = 1 WHERE create_time < '2024-01-01';

-- ✅ 快：分批更新
UPDATE users SET status = 1
WHERE create_time < '2024-01-01'
LIMIT 1000;
-- 多次执行
```

### 3.7.3 DELETE优化

**1. 使用索引**
```sql
-- 在WHERE条件列上创建索引
CREATE INDEX idx_status ON users(status);
DELETE FROM users WHERE status = 0;
```

**2. 分批删除**
```sql
-- 分批删除，避免长时间锁表
DELETE FROM users WHERE status = 0 LIMIT 1000;
```

**3. 清空表用TRUNCATE**
```sql
-- ❌ 慢
DELETE FROM users;

-- ✅ 快
TRUNCATE TABLE users;
```

**4. 使用分区表**
```sql
-- 删除整个分区（非常快）
ALTER TABLE logs DROP PARTITION p202401;
```

---

## 3.8 事务处理

### 3.8.1 基本事务

```sql
-- 开始事务
START TRANSACTION;
-- 或
BEGIN;

-- 执行操作
INSERT INTO users (username, password) VALUES ('test', '123456');
UPDATE users SET age = 26 WHERE id = 1;
DELETE FROM users WHERE id = 2;

-- 提交事务
COMMIT;

-- 或回滚事务
ROLLBACK;
```

### 3.8.2 保存点

```sql
START TRANSACTION;

INSERT INTO users (username, password) VALUES ('user1', 'pass1');

-- 设置保存点
SAVEPOINT sp1;

INSERT INTO users (username, password) VALUES ('user2', 'pass2');

-- 回滚到保存点
ROLLBACK TO sp1;

-- 提交事务
COMMIT;
-- 结果：只插入了user1
```

### 3.8.3 自动提交

```sql
-- 查看自动提交状态
SHOW VARIABLES LIKE 'autocommit';

-- 关闭自动提交
SET autocommit = 0;

-- 此时每个语句都需要手动COMMIT
INSERT INTO users (username, password) VALUES ('test', '123456');
COMMIT;

-- 开启自动提交
SET autocommit = 1;
```

### 3.8.4 实战：转账事务

```sql
-- 创建账户表
CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user (user_id)
);

-- 插入测试数据
INSERT INTO accounts (user_id, balance) VALUES (1, 1000.00), (2, 500.00);

-- 转账：用户1给用户2转账100元
START TRANSACTION;

-- 扣款
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;

-- 检查余额是否足够
SELECT balance FROM accounts WHERE user_id = 1;

-- 加款
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;

-- 提交事务
COMMIT;

-- 查看结果
SELECT * FROM accounts;
```

---

## 3.9 常见错误和解决方案

### 错误1：主键冲突

```sql
-- 错误
INSERT INTO users (id, username) VALUES (1, 'test');
-- ERROR 1062: Duplicate entry '1' for key 'PRIMARY'

-- 解决方案1：使用INSERT IGNORE
INSERT IGNORE INTO users (id, username) VALUES (1, 'test');

-- 解决方案2：使用REPLACE
REPLACE INTO users (id, username) VALUES (1, 'test');

-- 解决方案3：使用ON DUPLICATE KEY UPDATE
INSERT INTO users (id, username) VALUES (1, 'test')
ON DUPLICATE KEY UPDATE username = 'test';
```

### 错误2：外键约束

```sql
-- 错误：删除被引用的记录
DELETE FROM departments WHERE id = 1;
-- ERROR 1451: Cannot delete or update a parent row

-- 解决方案1：先删除子表记录
DELETE FROM employees WHERE department_id = 1;
DELETE FROM departments WHERE id = 1;

-- 解决方案2：使用CASCADE
ALTER TABLE employees
DROP FOREIGN KEY fk_dept;

ALTER TABLE employees
ADD CONSTRAINT fk_dept
FOREIGN KEY (department_id) REFERENCES departments(id)
ON DELETE CASCADE;

-- 现在可以直接删除
DELETE FROM departments WHERE id = 1;
```

### 错误3：数据截断

```sql
-- 错误：数据过长
INSERT INTO users (username) VALUES ('这是一个非常非常非常长的用户名超过了50个字符的限制');
-- ERROR 1406: Data too long for column 'username'

-- 解决方案：截断数据
INSERT INTO users (username) VALUES (LEFT('这是一个非常非常非常长的用户名', 50));
```

### 错误4：NULL值错误

```sql
-- 错误：NOT NULL列插入NULL
INSERT INTO users (username, password) VALUES ('test', NULL);
-- ERROR 1048: Column 'password' cannot be null

-- 解决方案：提供默认值
INSERT INTO users (username, password) VALUES ('test', '');
```

---

## 3.10 小结

本章学习了DML数据操作语言：

- ✅ INSERT：插入数据（单行、多行、批量）
- ✅ UPDATE：更新数据（单行、多行、基于表达式）
- ✅ DELETE：删除数据（单行、多行、基于条件）
- ✅ TRUNCATE：清空表
- ✅ 事务处理（COMMIT、ROLLBACK、SAVEPOINT）
- ✅ 性能优化技巧
- ✅ 常见错误处理

**重点掌握：**
1. 批量插入比逐条插入快10倍以上
2. UPDATE和DELETE必须加WHERE条件
3. 清空表用TRUNCATE比DELETE快
4. 使用事务保证数据一致性
5. 开启sql_safe_updates防止误操作

**最佳实践：**
- ✅ 批量操作使用批量INSERT
- ✅ 重要操作使用事务
- ✅ 生产环境开启安全模式
- ✅ 大批量操作分批执行
- ✅ 软删除优于硬删除

**下一章预告：** SQL基础 - DQL数据查询语言

---

## 练习题

### 基础练习

1. 插入10个用户到users表
2. 更新所有年龄小于18的用户状态为0
3. 删除所有状态为0的用户
4. 使用TRUNCATE清空测试表

### 进阶练习

1. 使用事务实现转账功能
2. 批量插入1000条商品数据
3. 实现软删除功能
4. 使用ON DUPLICATE KEY UPDATE实现upsert
5. 分批删除30天前的日志数据

### 实战练习

创建一个简单的电商系统，实现：
1. 用户注册（插入用户和用户资料）
2. 商品上架（批量插入商品）
3. 下单（减少库存，创建订单）
4. 取消订单（恢复库存，更新订单状态）
5. 定期清理过期订单

**继续学习：** [第04章：SQL基础-DQL](/mysql/01/04-sql-dql.html)
```
