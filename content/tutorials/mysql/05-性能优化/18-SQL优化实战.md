---
title: 第18章：SQL优化实战 ⭐⭐⭐⭐⭐
description: 第18章：SQL优化实战 ⭐⭐⭐⭐⭐ 本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧 18.1
  SQL优化的重要性 性能问题的根源： 80%的性能问题来自于SQL语句 一条慢SQL可能拖垮整个系统 SQL优化是成本最低、效果最好的优化手段 优化目标：
  减少查询时间 降低CPU和内存消耗 减少磁盘I/O 提高并发能力 18.2 EX...
url: /mysql/05/18-sql.html
layout: tutorial
contentType: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 180
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第18章：SQL优化实战 ⭐⭐⭐⭐⭐

> 本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧

## 18.1 SQL优化的重要性

**性能问题的根源：**
- 80%的性能问题来自于SQL语句
- 一条慢SQL可能拖垮整个系统
- SQL优化是成本最低、效果最好的优化手段

**优化目标：**
- 减少查询时间
- 降低CPU和内存消耗
- 减少磁盘I/O
- 提高并发能力

---

## 18.2 EXPLAIN执行计划详解 ⭐⭐⭐⭐⭐

### 18.2.1 EXPLAIN基本用法

```sql
-- 查看SQL执行计划
EXPLAIN SELECT * FROM users WHERE age > 20;

-- 查看详细信息（MySQL 5.7+）
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age > 20;

-- 查看实际执行情况（MySQL 8.0+）
EXPLAIN ANALYZE SELECT * FROM users WHERE age > 20;
```

### 18.2.2 EXPLAIN输出详解

**示例输出：**
```
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra       |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
|  1 | SIMPLE      | users | ALL  | NULL          | NULL | NULL    | NULL | 1000 | Using where |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
```

#### 1. id（查询序列号）

- **相同id**：执行顺序从上到下
- **不同id**：id越大越先执行
- **id为NULL**：通常是UNION结果

**示例：**
```sql
EXPLAIN 
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 1000
);

-- 输出：
-- id=2: 子查询先执行
-- id=1: 外层查询后执行
```

#### 2. select_type（查询类型）

| 类型 | 说明 |
|------|------|
| **SIMPLE** | 简单查询，不包含子查询或UNION |
| **PRIMARY** | 最外层查询 |
| **SUBQUERY** | 子查询 |
| **DERIVED** | 派生表（FROM子句中的子查询） |
| **UNION** | UNION中的第二个或后面的查询 |
| **UNION RESULT** | UNION的结果 |

#### 3. table（表名）

显示这一行数据是关于哪张表的。

#### 4. type（访问类型）⭐⭐⭐⭐⭐

**性能从好到差：**
```
system > const > eq_ref > ref > range > index > ALL
```

**详细说明：**

| type | 说明 | 示例 |
|------|------|------|
| **system** | 表只有一行记录（系统表） | 极少见 |
| **const** | 通过主键或唯一索引查询，最多返回一行 | `WHERE id=1` |
| **eq_ref** | 唯一索引扫描，对于每个索引键，表中只有一条记录匹配 | JOIN时使用主键或唯一索引 |
| **ref** | 非唯一索引扫描，返回匹配某个单独值的所有行 | `WHERE name='张三'` |
| **range** | 索引范围扫描 | `WHERE id > 100` |
| **index** | 全索引扫描 | 扫描整个索引树 |
| **ALL** | 全表扫描 | ⚠️ 需要优化 |

**示例：**
```sql
-- const（最优）
EXPLAIN SELECT * FROM users WHERE id = 1;

-- ref（良好）
EXPLAIN SELECT * FROM users WHERE name = '张三';

-- range（可接受）
EXPLAIN SELECT * FROM users WHERE age > 20;

-- ALL（需要优化）
EXPLAIN SELECT * FROM users WHERE YEAR(create_time) = 2024;
```

#### 5. possible_keys（可能使用的索引）

显示查询可能使用的索引。

#### 6. key（实际使用的索引）⭐⭐⭐⭐

- **NULL**：没有使用索引，需要优化
- **索引名**：使用了该索引

#### 7. key_len（索引长度）⭐⭐⭐

- 使用的索引字节数
- 在联合索引中，可以判断使用了几个字段

**计算方法：**
```
字符类型：
- char(n): n * 字符集字节数
- varchar(n): n * 字符集字节数 + 2（存储长度）

数字类型：
- int: 4字节
- bigint: 8字节
- datetime: 8字节

NULL：
- 允许NULL: +1字节
```

**示例：**
```sql
-- 联合索引 (name, age)
-- name: varchar(50), utf8mb4 (4字节)
-- age: int (4字节)

-- 只使用name
EXPLAIN SELECT * FROM users WHERE name = '张三';
-- key_len = 50*4 + 2 + 1 = 203

-- 使用name和age
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20;
-- key_len = 50*4 + 2 + 1 + 4 + 1 = 208
```

#### 8. ref（索引的哪一列被使用）

显示索引的哪一列被使用了，如果可能的话，是一个常数。

#### 9. rows（扫描行数）⭐⭐⭐⭐

- 预计需要扫描的行数
- **越少越好**
- 只是估算值，不是精确值

#### 10. Extra（额外信息）⭐⭐⭐⭐⭐

| Extra | 说明 | 优化建议 |
|-------|------|---------|
| **Using index** | 使用覆盖索引，不需要回表 | ✅ 最优 |
| **Using where** | 使用WHERE过滤 | ✅ 正常 |
| **Using index condition** | 使用索引下推 | ✅ 良好 |
| **Using filesort** | 使用文件排序 | ⚠️ 需要优化 |
| **Using temporary** | 使用临时表 | ⚠️ 需要优化 |
| **Using join buffer** | 使用连接缓冲 | ⚠️ 考虑添加索引 |
| **Impossible WHERE** | WHERE条件总是false | ⚠️ 检查SQL逻辑 |
| **Select tables optimized away** | 优化器优化掉了 | ✅ 很好 |

**重点关注：**

**Using filesort（文件排序）：**
```sql
-- 不好：没有使用索引排序
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using filesort

-- 优化：在age上创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using index
```

**Using temporary（使用临时表）：**
```sql
-- 不好：GROUP BY字段没有索引
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using temporary; Using filesort

-- 优化：在age上创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using index
```

**Using index（覆盖索引）：**
```sql
-- 创建联合索引
CREATE INDEX idx_name_age ON users(name, age);

-- 覆盖索引：只查询索引中的字段
EXPLAIN SELECT name, age FROM users WHERE name = '张三';
-- Extra: Using index（不需要回表，性能最优）

-- 非覆盖索引：查询了索引外的字段
EXPLAIN SELECT name, age, email FROM users WHERE name = '张三';
-- Extra: NULL（需要回表查询email）
```

### 18.2.3 EXPLAIN实战案例

#### 案例1：全表扫描优化

**问题SQL：**
```sql
EXPLAIN SELECT * FROM orders WHERE YEAR(create_time) = 2024;

-- 结果：
-- type: ALL
-- rows: 1000000
-- Extra: Using where
```

**优化：**
```sql
-- 方法1：改写SQL，避免在索引列上使用函数
EXPLAIN SELECT * FROM orders 
WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01';

-- 结果：
-- type: range
-- rows: 50000
-- Extra: Using index condition

-- 方法2：创建函数索引（MySQL 8.0+）
CREATE INDEX idx_year ON orders((YEAR(create_time)));
```

#### 案例2：索引失效

**问题SQL：**
```sql
-- 联合索引 (name, age, city)
CREATE INDEX idx_name_age_city ON users(name, age, city);

-- 索引失效：跳过了age
EXPLAIN SELECT * FROM users WHERE name = '张三' AND city = '北京';

-- 结果：
-- key_len: 203（只使用了name）
-- 没有使用age和city
```

**优化：**
```sql
-- 遵循最左前缀原则
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20 AND city = '北京';

-- 结果：
-- key_len: 完整使用索引

-- 或者调整索引顺序
CREATE INDEX idx_name_city ON users(name, city);
```

---

## 18.3 SQL优化的一般步骤

### 步骤1：发现慢SQL

**方法1：慢查询日志**
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log=1;
SET GLOBAL long_query_time=2;

-- 分析慢查询日志
pt-query-digest /var/lib/mysql/slow.log
```

**方法2：SHOW PROCESSLIST**
```sql
-- 查看当前正在执行的SQL
SHOW PROCESSLIST;

-- 查看执行时间超过2秒的SQL
SELECT * FROM information_schema.PROCESSLIST
WHERE TIME > 2 AND COMMAND != 'Sleep';
```

**方法3：Performance Schema**
```sql
-- 查看执行最慢的SQL
SELECT
    DIGEST_TEXT,
    COUNT_STAR,
    AVG_TIMER_WAIT/1000000000000 AS avg_sec,
    MAX_TIMER_WAIT/1000000000000 AS max_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;
```

### 步骤2：分析SQL执行计划

```sql
-- 使用EXPLAIN分析
EXPLAIN SELECT * FROM users WHERE age > 20;

-- 关注以下指标：
-- 1. type: 是否为ALL（全表扫描）
-- 2. key: 是否使用了索引
-- 3. rows: 扫描行数是否过多
-- 4. Extra: 是否有Using filesort、Using temporary
```

### 步骤3：优化SQL

根据执行计划，采取相应的优化措施。

### 步骤4：验证优化效果

```sql
-- 对比优化前后的执行时间
SET profiling=1;

-- 执行SQL
SELECT * FROM users WHERE age > 20;

-- 查看执行时间
SHOW PROFILES;

-- 查看详细信息
SHOW PROFILE FOR QUERY 1;
```

---

## 18.4 常见SQL优化技巧

### 18.4.1 避免SELECT *

**问题：**
```sql
-- 不好：查询所有字段
SELECT * FROM users WHERE id = 1;
```

**优化：**
```sql
-- 好：只查询需要的字段
SELECT id, name, age FROM users WHERE id = 1;
```

**原因：**
1. 减少网络传输
2. 可能使用覆盖索引，避免回表
3. 减少内存消耗

### 18.4.2 避免在WHERE中使用函数

**问题：**
```sql
-- 不好：索引失效
SELECT * FROM orders WHERE YEAR(create_time) = 2024;
SELECT * FROM users WHERE UPPER(name) = 'ZHANGSAN';
```

**优化：**
```sql
-- 好：改写SQL
SELECT * FROM orders
WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01';

-- 或者存储大写字段
ALTER TABLE users ADD COLUMN name_upper VARCHAR(100);
UPDATE users SET name_upper = UPPER(name);
CREATE INDEX idx_name_upper ON users(name_upper);
```

### 18.4.3 避免隐式类型转换

**问题：**
```sql
-- phone字段是VARCHAR类型
-- 不好：隐式转换，索引失效
SELECT * FROM users WHERE phone = 13800138000;
```

**优化：**
```sql
-- 好：使用正确的类型
SELECT * FROM users WHERE phone = '13800138000';
```

**验证：**
```sql
EXPLAIN SELECT * FROM users WHERE phone = 13800138000;
-- type: ALL（全表扫描）

EXPLAIN SELECT * FROM users WHERE phone = '13800138000';
-- type: ref（使用索引）
```

### 18.4.4 避免使用!=或<>

**问题：**
```sql
-- 不好：可能不走索引
SELECT * FROM users WHERE status != 1;
```

**优化：**
```sql
-- 好：使用IN或其他条件
SELECT * FROM users WHERE status IN (0, 2, 3);

-- 或者使用NOT IN（小心NULL）
SELECT * FROM users WHERE status NOT IN (1);
```

### 18.4.5 避免使用OR

**问题：**
```sql
-- 不好：可能不走索引
SELECT * FROM users WHERE name = '张三' OR age = 20;
```

**优化：**
```sql
-- 好：使用UNION ALL
SELECT * FROM users WHERE name = '张三'
UNION ALL
SELECT * FROM users WHERE age = 20 AND name != '张三';

-- 或者使用IN（如果是同一字段）
SELECT * FROM users WHERE id IN (1, 2, 3);
```

### 18.4.6 避免使用LIKE '%xxx'

**问题：**
```sql
-- 不好：前导模糊查询，索引失效
SELECT * FROM users WHERE name LIKE '%张%';
```

**优化：**
```sql
-- 好：后导模糊查询，可以使用索引
SELECT * FROM users WHERE name LIKE '张%';

-- 如果必须前导模糊查询，考虑：
-- 1. 使用全文索引
-- 2. 使用ElasticSearch等搜索引擎
-- 3. 使用反向索引
```

### 18.4.7 优化IN和NOT IN

**问题：**
```sql
-- 不好：IN中的值过多
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 10000);

-- 不好：NOT IN可能不走索引，且有NULL陷阱
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blacklist);
```

**优化：**
```sql
-- 好：分批查询
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 1000);

-- 好：使用JOIN代替NOT IN
SELECT u.* FROM users u
LEFT JOIN blacklist b ON u.id = b.user_id
WHERE b.user_id IS NULL;

-- 好：使用NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM blacklist b WHERE b.user_id = u.id
);
```

### 18.4.8 优化ORDER BY

**问题：**
```sql
-- 不好：没有索引，产生filesort
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using filesort
```

**优化：**
```sql
-- 方法1：创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using index

-- 方法2：利用联合索引
CREATE INDEX idx_age_name ON users(age, name);
EXPLAIN SELECT * FROM users ORDER BY age, name;
-- Extra: Using index

-- 方法3：如果必须filesort，增加sort_buffer_size
SET SESSION sort_buffer_size = 2097152; -- 2MB
```

**ORDER BY优化原则：**
1. ORDER BY字段要有索引
2. 多字段排序时，顺序要和索引顺序一致
3. 排序方向要一致（都是ASC或都是DESC）

**示例：**
```sql
-- 索引：idx_age_name (age, name)

-- ✅ 可以使用索引
ORDER BY age, name
ORDER BY age
ORDER BY age DESC, name DESC

-- ❌ 不能使用索引
ORDER BY name, age  -- 顺序不对
ORDER BY age ASC, name DESC  -- 方向不一致
```

### 18.4.9 优化GROUP BY

**问题：**
```sql
-- 不好：产生临时表和filesort
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using temporary; Using filesort
```

**优化：**
```sql
-- 方法1：创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using index

-- 方法2：如果不需要排序，使用ORDER BY NULL
SELECT age, COUNT(*) FROM users GROUP BY age ORDER BY NULL;
```

### 18.4.10 优化LIMIT分页

**问题：**
```sql
-- 不好：深分页，扫描大量数据
SELECT * FROM users ORDER BY id LIMIT 1000000, 10;
-- 需要扫描1000010行数据
```

**优化方法1：使用子查询**
```sql
-- 好：先查询ID，再关联
SELECT * FROM users
WHERE id >= (SELECT id FROM users ORDER BY id LIMIT 1000000, 1)
LIMIT 10;
```

**优化方法2：使用上次查询的最大ID**
```sql
-- 第一页
SELECT * FROM users ORDER BY id LIMIT 10;
-- 假设最后一条记录的id是10

-- 第二页
SELECT * FROM users WHERE id > 10 ORDER BY id LIMIT 10;
-- 假设最后一条记录的id是20

-- 第三页
SELECT * FROM users WHERE id > 20 ORDER BY id LIMIT 10;
```

**优化方法3：使用延迟关联**
```sql
-- 好：先查询ID（覆盖索引），再关联
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 1000000, 10
) AS t ON u.id = t.id;
```

---

## 18.5 JOIN优化

### 18.5.1 JOIN的执行原理

**嵌套循环连接（Nested-Loop Join）：**
```
for each row in t1 matching range {
    for each row in t2 matching reference key {
        if row satisfies join conditions, send to client
    }
}
```

**驱动表和被驱动表：**
- **驱动表**：外层循环的表（小表）
- **被驱动表**：内层循环的表（大表）

**优化原则：**
1. 小表驱动大表
2. 被驱动表的JOIN字段要有索引

### 18.5.2 JOIN优化技巧

**技巧1：小表驱动大表**
```sql
-- 假设：users表100万行，orders表1000行

-- 不好：大表驱动小表
SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 好：小表驱动大表
SELECT * FROM orders o
INNER JOIN users u ON o.user_id = u.id;
```

**技巧2：被驱动表JOIN字段要有索引**
```sql
-- 创建索引
CREATE INDEX idx_user_id ON orders(user_id);

-- 验证
EXPLAIN SELECT * FROM orders o
INNER JOIN users u ON o.user_id = u.id;
-- type: ref（使用索引）
```

**技巧3：避免JOIN太多表**
```sql
-- 不好：JOIN太多表
SELECT * FROM t1
JOIN t2 ON t1.id = t2.t1_id
JOIN t3 ON t2.id = t3.t2_id
JOIN t4 ON t3.id = t4.t3_id
JOIN t5 ON t4.id = t5.t4_id;

-- 建议：不超过3个表
-- 如果必须JOIN多表，考虑：
-- 1. 分步查询
-- 2. 数据冗余
-- 3. 缓存
```

**技巧4：使用STRAIGHT_JOIN控制JOIN顺序**
```sql
-- 强制指定JOIN顺序
SELECT * FROM orders
STRAIGHT_JOIN users ON orders.user_id = users.id;
```

### 18.5.3 子查询优化

**问题：**
```sql
-- 不好：子查询可能产生临时表
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount > 1000
);
```

**优化：**
```sql
-- 好：改写为JOIN
SELECT DISTINCT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount > 1000;

-- 或使用EXISTS
SELECT * FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id AND o.amount > 1000
);
```

**IN vs EXISTS：**
- **IN**：适合外表大、内表小的情况
- **EXISTS**：适合外表小、内表大的情况

---

## 18.6 COUNT优化

### 18.6.1 COUNT的几种用法

```sql
-- COUNT(*)：统计行数（推荐）
SELECT COUNT(*) FROM users;

-- COUNT(1)：统计行数（与COUNT(*)性能相同）
SELECT COUNT(1) FROM users;

-- COUNT(字段)：统计字段非NULL的行数
SELECT COUNT(email) FROM users;

-- COUNT(DISTINCT 字段)：统计字段去重后的行数
SELECT COUNT(DISTINCT city) FROM users;
```

**性能对比：**
```
COUNT(*) ≈ COUNT(1) > COUNT(主键) > COUNT(字段)
```

### 18.6.2 COUNT优化技巧

**技巧1：使用覆盖索引**
```sql
-- 不好：全表扫描
SELECT COUNT(*) FROM users;

-- 好：使用覆盖索引
CREATE INDEX idx_id ON users(id);
SELECT COUNT(*) FROM users;
-- 扫描索引树，比扫描数据表快
```

**技巧2：使用近似值**
```sql
-- 对于InnoDB，使用近似值
SELECT TABLE_ROWS FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mydb' AND TABLE_NAME = 'users';
-- 注意：这是估算值，不精确
```

**技巧3：维护计数表**
```sql
-- 创建计数表
CREATE TABLE user_count (
    count INT NOT NULL
) ENGINE=InnoDB;

INSERT INTO user_count VALUES (0);

-- 插入用户时更新计数
START TRANSACTION;
INSERT INTO users (name, age) VALUES ('张三', 20);
UPDATE user_count SET count = count + 1;
COMMIT;

-- 查询总数
SELECT count FROM user_count;
-- 非常快
```

**技巧4：使用Redis缓存**
```python
# 伪代码
def get_user_count():
    count = redis.get('user_count')
    if count is None:
        count = db.query('SELECT COUNT(*) FROM users')
        redis.set('user_count', count, expire=3600)
    return count
```

---

## 18.7 INSERT优化

### 18.7.1 批量插入

**问题：**
```sql
-- 不好：逐条插入
INSERT INTO users (name, age) VALUES ('张三', 20);
INSERT INTO users (name, age) VALUES ('李四', 21);
INSERT INTO users (name, age) VALUES ('王五', 22);
-- 每次插入都要建立连接、提交事务
```

**优化：**
```sql
-- 好：批量插入
INSERT INTO users (name, age) VALUES
('张三', 20),
('李四', 21),
('王五', 22);

-- 建议：每批不超过1000条
```

### 18.7.2 使用LOAD DATA

**最快的导入方式：**
```sql
-- 从CSV文件导入
LOAD DATA INFILE '/tmp/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(name, age);

-- 比INSERT快10-20倍
```

### 18.7.3 关闭自动提交

```sql
-- 关闭自动提交
SET autocommit=0;

-- 批量插入
INSERT INTO users (name, age) VALUES ('张三', 20);
INSERT INTO users (name, age) VALUES ('李四', 21);
-- ... 更多插入

-- 手动提交
COMMIT;

-- 恢复自动提交
SET autocommit=1;
```

### 18.7.4 禁用索引（大批量导入时）

```sql
-- 禁用索引
ALTER TABLE users DISABLE KEYS;

-- 批量插入
INSERT INTO users (name, age) VALUES ...;

-- 启用索引
ALTER TABLE users ENABLE KEYS;
```

---

## 18.8 UPDATE和DELETE优化

### 18.8.1 批量操作

**问题：**
```sql
-- 不好：逐条更新
UPDATE users SET status=1 WHERE id=1;
UPDATE users SET status=1 WHERE id=2;
-- ...
```

**优化：**
```sql
-- 好：批量更新
UPDATE users SET status=1 WHERE id IN (1, 2, 3, ...);

-- 或使用范围
UPDATE users SET status=1 WHERE id BETWEEN 1 AND 1000;
```

### 18.8.2 分批操作（大批量）

**问题：**
```sql
-- 不好：一次更新100万行，锁表时间长
UPDATE users SET status=1 WHERE create_time < '2020-01-01';
```

**优化：**
```sql
-- 好：分批更新，每批1000行
DELIMITER $$
CREATE PROCEDURE batch_update()
BEGIN
    DECLARE done INT DEFAULT 0;
    WHILE done = 0 DO
        UPDATE users SET status=1
        WHERE create_time < '2020-01-01' AND status=0
        LIMIT 1000;

        IF ROW_COUNT() = 0 THEN
            SET done = 1;
        END IF;

        -- 休息一下，避免影响其他查询
        DO SLEEP(0.1);
    END WHILE;
END$$
DELIMITER ;

CALL batch_update();
```

### 18.8.3 避免全表更新

```sql
-- 危险：全表更新
UPDATE users SET status=1;

-- 建议：加WHERE条件
UPDATE users SET status=1 WHERE status=0;
```

---

## 18.9 SQL优化工具

### 18.9.1 慢查询分析工具

**mysqldumpslow：**
```bash
mysqldumpslow -s t -t 10 /var/lib/mysql/slow.log
```

**pt-query-digest（推荐）：**
```bash
pt-query-digest /var/lib/mysql/slow.log
```

### 18.9.2 EXPLAIN工具

**MySQL Workbench：**
- 图形化显示执行计划
- 可视化分析

**EXPLAIN FORMAT=JSON：**
```sql
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age > 20\G
```

### 18.9.3 性能分析工具

**SHOW PROFILE：**
```sql
SET profiling=1;
SELECT * FROM users WHERE age > 20;
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
```

**Performance Schema：**
```sql
-- 查看最慢的SQL
SELECT * FROM sys.statement_analysis
ORDER BY avg_latency DESC LIMIT 10;
```

---

## 18.10 SQL优化检查清单

**执行计划检查：**
- [ ] type是否为ALL（全表扫描）
- [ ] key是否为NULL（未使用索引）
- [ ] rows是否过大
- [ ] Extra是否有Using filesort
- [ ] Extra是否有Using temporary

**SQL语句检查：**
- [ ] 是否使用了SELECT *
- [ ] WHERE条件是否在索引列上使用了函数
- [ ] 是否有隐式类型转换
- [ ] 是否使用了!=或<>
- [ ] 是否使用了OR
- [ ] 是否使用了LIKE '%xxx'
- [ ] ORDER BY字段是否有索引
- [ ] GROUP BY字段是否有索引
- [ ] JOIN字段是否有索引
- [ ] 是否有深分页问题

**索引检查：**
- [ ] WHERE条件字段是否有索引
- [ ] JOIN字段是否有索引
- [ ] ORDER BY字段是否有索引
- [ ] GROUP BY字段是否有索引
- [ ] 是否遵循最左前缀原则
- [ ] 是否使用了覆盖索引

---

## 18.11 小结

本章学习了SQL优化的核心内容：

- ✅ **EXPLAIN执行计划**：必须精通，面试高频
- ✅ **SQL优化步骤**：发现、分析、优化、验证
- ✅ **常见优化技巧**：避免全表扫描、使用索引、优化JOIN等
- ✅ **特定场景优化**：分页、COUNT、批量操作等

**重点掌握：**
1. EXPLAIN的每个字段含义
2. type的各种类型及性能差异
3. Extra中的关键信息
4. 索引失效的场景
5. 深分页优化方案

**下一章预告：** 索引优化进阶

---

## 练习题

1. 使用EXPLAIN分析一个慢SQL，找出性能瓶颈
2. 优化一个深分页查询（LIMIT 1000000, 10）
3. 将一个使用子查询的SQL改写为JOIN
4. 优化一个产生filesort的ORDER BY查询
5. 编写一个批量更新的存储过程

**继续学习：** [第19章：索引优化进阶](/mysql/05/19.html)
