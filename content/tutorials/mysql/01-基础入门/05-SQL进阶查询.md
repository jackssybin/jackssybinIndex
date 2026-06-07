---
title: 第05章：SQL进阶查询
description: 第05章：SQL进阶查询 掌握多表连接、子查询、联合查询等高级查询技巧 5.1 多表连接概述 为什么需要多表连接？
  数据库设计遵循范式，数据分散在多个表中 需要从多个表中组合数据进行查询 避免数据冗余，提高数据一致性 连接类型： INNER JOIN ：内连接（最常用）
  LEFT JOIN ：左外连接 RIGHT JOIN ：右外连接 CROSS JOIN ...
url: /mysql/01/05-sql.html
layout: tutorial
contentType: tutorial
series: mysql
seriesTitle: MySQL教程
weight: 50
tags:
  - MySQL
  - SQL
  - 数据库
  - 教程
draft: false
---

# 第05章：SQL进阶查询

> 掌握多表连接、子查询、联合查询等高级查询技巧

## 5.1 多表连接概述

**为什么需要多表连接？**
- 数据库设计遵循范式，数据分散在多个表中
- 需要从多个表中组合数据进行查询
- 避免数据冗余，提高数据一致性

**连接类型：**
- **INNER JOIN**：内连接（最常用）
- **LEFT JOIN**：左外连接
- **RIGHT JOIN**：右外连接
- **CROSS JOIN**：交叉连接（笛卡尔积）

---

## 5.2 准备测试数据

```sql
-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    age INT,
    city VARCHAR(50)
);

-- 创建订单表
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_name VARCHAR(100),
    amount DECIMAL(10,2),
    order_date DATE
);

-- 创建产品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2)
);

-- 插入用户数据
INSERT INTO users (username, age, city) VALUES
('张三', 25, '北京'),
('李四', 30, '上海'),
('王五', 28, '广州'),
('赵六', 35, '深圳'),
('钱七', 22, '杭州');

-- 插入订单数据
INSERT INTO orders (user_id, product_name, amount, order_date) VALUES
(1, 'iPhone', 5999.00, '2024-01-15'),
(1, 'iPad', 3999.00, '2024-02-20'),
(2, 'MacBook', 9999.00, '2024-01-10'),
(2, 'AirPods', 1299.00, '2024-03-05'),
(3, 'iPhone', 5999.00, '2024-02-01'),
(NULL, 'Apple Watch', 2999.00, '2024-01-20');  -- 游客订单

-- 插入产品数据
INSERT INTO products (product_name, category, price) VALUES
('iPhone', '手机', 5999.00),
('iPad', '平板', 3999.00),
('MacBook', '电脑', 9999.00),
('AirPods', '耳机', 1299.00),
('Apple Watch', '手表', 2999.00),
('iMac', '电脑', 12999.00);  -- 没有订单的产品
```

---

## 5.3 INNER JOIN - 内连接

### 5.3.1 基本语法

```sql
-- 语法1：显式内连接（推荐）
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;

-- 语法2：隐式内连接（不推荐）
SELECT columns
FROM table1, table2
WHERE table1.column = table2.column;
```

### 5.3.2 两表内连接

```sql
-- 查询所有订单及对应的用户信息
SELECT 
    u.id AS user_id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 结果：只返回有订单的用户（user_id为NULL的订单不会显示）
-- 张三的2个订单、李四的2个订单、王五的1个订单

-- 使用表别名简化查询
SELECT u.username, o.product_name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

### 5.3.3 多表内连接

```sql
-- 查询订单、用户、产品信息
SELECT 
    u.username,
    o.product_name,
    o.amount,
    p.category,
    p.price
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.product_name = p.product_name;

-- 连接顺序：users → orders → products
```

### 5.3.4 内连接 + WHERE条件

```sql
-- 查询购买了iPhone的用户
SELECT u.username, o.product_name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.product_name = 'iPhone';

-- 查询2024年1月的订单及用户信息
SELECT u.username, o.product_name, o.amount, o.order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.order_date >= '2024-01-01' AND o.order_date < '2024-02-01';
```

### 5.3.5 内连接 + 聚合函数

```sql
-- 查询每个用户的订单数量和总金额
SELECT 
    u.id,
    u.username,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY total_amount DESC;

-- 注意：只显示有订单的用户（钱七和赵六不会显示）
```

---

## 5.4 LEFT JOIN - 左外连接

### 5.4.1 基本概念

```sql
-- LEFT JOIN：返回左表所有记录，右表没有匹配的显示NULL
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;

-- 特点：
-- 1. 左表（table1）的所有记录都会返回
-- 2. 右表（table2）没有匹配的记录，对应列显示NULL
```

### 5.4.2 基本用法

```sql
-- 查询所有用户及其订单信息（包括没有订单的用户）
SELECT 
    u.id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- 结果：
-- 张三的2个订单
-- 李四的2个订单
-- 王五的1个订单
-- 赵六：NULL（没有订单）
-- 钱七：NULL（没有订单）
```

### 5.4.3 查询没有订单的用户

```sql
-- 查询没有下过订单的用户
SELECT u.id, u.username
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;

-- 结果：赵六、钱七
```

### 5.4.4 LEFT JOIN + 聚合函数

```sql
-- 查询所有用户的订单数量和总金额（包括没有订单的用户）
SELECT
    u.id,
    u.username,
    COUNT(o.id) AS order_count,  -- 使用COUNT(o.id)而不是COUNT(*)
    IFNULL(SUM(o.amount), 0) AS total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY total_amount DESC;

-- 注意：
-- COUNT(o.id)：统计订单数（NULL不计数）
-- COUNT(*)：统计所有行（包括NULL）
-- IFNULL(SUM(o.amount), 0)：将NULL转换为0
```

---

## 5.5 RIGHT JOIN - 右外连接

### 5.5.1 基本概念

```sql
-- RIGHT JOIN：返回右表所有记录，左表没有匹配的显示NULL
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;

-- 特点：与LEFT JOIN相反
-- 实际开发中很少使用，通常用LEFT JOIN代替
```

### 5.5.2 基本用法

```sql
-- 查询所有订单及对应的用户信息（包括游客订单）
SELECT
    u.id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;

-- 结果：包括user_id为NULL的订单（游客订单）

-- 等价的LEFT JOIN写法（推荐）
SELECT
    u.id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;
```

---

## 5.6 子查询

### 5.6.1 WHERE子查询

```sql
-- 查询订单金额大于平均订单金额的订单
SELECT * FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);

-- 查询购买过iPhone的用户信息
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE product_name = 'iPhone');

-- 查询没有下过订单的用户
SELECT * FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders WHERE user_id IS NOT NULL);
```

### 5.6.2 FROM子查询

```sql
-- 查询每个用户的订单统计，然后筛选订单数大于1的用户
SELECT * FROM (
    SELECT
        user_id,
        COUNT(*) AS order_count,
        SUM(amount) AS total_amount
    FROM orders
    GROUP BY user_id
) AS user_stats
WHERE order_count > 1;

-- 注意：FROM子查询必须使用别名
```

### 5.6.3 SELECT子查询

```sql
-- 查询用户信息及其订单数量
SELECT
    u.id,
    u.username,
    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- 查询用户信息及其总消费金额
SELECT
    u.id,
    u.username,
    (SELECT IFNULL(SUM(amount), 0) FROM orders o WHERE o.user_id = u.id) AS total_spent
FROM users u;
```

### 5.6.4 EXISTS子查询

```sql
-- 查询有订单的用户
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- 查询没有订单的用户
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- EXISTS vs IN：
-- EXISTS：只判断是否存在，性能通常更好
-- IN：返回具体值，适合小数据集
```

---

## 5.7 UNION - 联合查询

### 5.7.1 UNION基本用法

```sql
-- UNION：合并多个查询结果，自动去重
SELECT username FROM users WHERE city = '北京'
UNION
SELECT username FROM users WHERE age > 30;

-- UNION ALL：合并多个查询结果，不去重（性能更好）
SELECT username FROM users WHERE city = '北京'
UNION ALL
SELECT username FROM users WHERE age > 30;
```

### 5.7.2 UNION注意事项

```sql
-- 要求：
-- 1. 每个SELECT的列数必须相同
-- 2. 对应列的数据类型必须兼容
-- 3. 列名以第一个SELECT为准

-- ✅ 正确示例
SELECT id, username FROM users WHERE city = '北京'
UNION
SELECT id, username FROM users WHERE age > 30;

-- ❌ 错误示例：列数不同
SELECT id, username FROM users
UNION
SELECT id FROM orders;  -- 错误！列数不同
```

### 5.7.3 UNION实际应用

```sql
-- 合并不同表的数据
SELECT 'user' AS type, id, username AS name FROM users
UNION ALL
SELECT 'product' AS type, id, product_name AS name FROM products;

-- 分类统计
SELECT '北京' AS city, COUNT(*) AS user_count FROM users WHERE city = '北京'
UNION ALL
SELECT '上海' AS city, COUNT(*) AS user_count FROM users WHERE city = '上海'
UNION ALL
SELECT '其他' AS city, COUNT(*) AS user_count FROM users WHERE city NOT IN ('北京', '上海');
```

---

## 5.8 常用函数

### 5.8.1 字符串函数

```sql
-- CONCAT：字符串拼接
SELECT CONCAT(username, '(', city, ')') AS user_info FROM users;
-- 结果：张三(北京)

-- CONCAT_WS：使用分隔符拼接
SELECT CONCAT_WS('-', id, username, city) FROM users;
-- 结果：1-张三-北京

-- LENGTH：字符串长度（字节数）
SELECT username, LENGTH(username) FROM users;

-- CHAR_LENGTH：字符串长度（字符数）
SELECT username, CHAR_LENGTH(username) FROM users;

-- SUBSTRING：截取字符串
SELECT SUBSTRING(username, 1, 1) AS first_char FROM users;  -- 第一个字符
SELECT SUBSTRING(product_name, 1, 5) FROM products;

-- UPPER/LOWER：大小写转换
SELECT UPPER(username), LOWER(username) FROM users;

-- TRIM：去除空格
SELECT TRIM('  hello  ');  -- 'hello'
SELECT LTRIM('  hello');   -- 'hello  '
SELECT RTRIM('hello  ');   -- '  hello'

-- REPLACE：替换字符串
SELECT REPLACE(product_name, 'iPhone', 'iPhone 15') FROM products;

-- LEFT/RIGHT：从左/右取字符
SELECT LEFT(username, 1) FROM users;   -- 第一个字符
SELECT RIGHT(username, 1) FROM users;  -- 最后一个字符
```

### 5.8.2 日期函数

```sql
-- NOW：当前日期时间
SELECT NOW();  -- 2024-11-11 10:30:45

-- CURDATE：当前日期
SELECT CURDATE();  -- 2024-11-11

-- CURTIME：当前时间
SELECT CURTIME();  -- 10:30:45

-- DATE：提取日期部分
SELECT DATE(NOW());  -- 2024-11-11

-- TIME：提取时间部分
SELECT TIME(NOW());  -- 10:30:45

-- YEAR/MONTH/DAY：提取年月日
SELECT YEAR(order_date), MONTH(order_date), DAY(order_date) FROM orders;

-- DATE_FORMAT：格式化日期
SELECT DATE_FORMAT(order_date, '%Y年%m月%d日') FROM orders;
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s');

-- DATEDIFF：日期差（天数）
SELECT DATEDIFF(NOW(), order_date) AS days_ago FROM orders;

-- DATE_ADD/DATE_SUB：日期加减
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);   -- 7天后
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH); -- 1个月前

-- TIMESTAMPDIFF：时间差
SELECT TIMESTAMPDIFF(DAY, order_date, NOW()) AS days_ago FROM orders;
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-12-31') AS months;
```

### 5.8.3 数学函数

```sql
-- ROUND：四舍五入
SELECT ROUND(3.14159, 2);  -- 3.14
SELECT ROUND(amount, 0) FROM orders;

-- CEIL：向上取整
SELECT CEIL(3.14);  -- 4

-- FLOOR：向下取整
SELECT FLOOR(3.99);  -- 3

-- ABS：绝对值
SELECT ABS(-10);  -- 10

-- MOD：取余
SELECT MOD(10, 3);  -- 1

-- RAND：随机数（0-1之间）
SELECT RAND();
SELECT FLOOR(RAND() * 100);  -- 0-99的随机整数

-- POWER：幂运算
SELECT POWER(2, 3);  -- 8

-- SQRT：平方根
SELECT SQRT(16);  -- 4
```

### 5.8.4 条件函数

```sql
-- IF：条件判断
SELECT
    username,
    age,
    IF(age >= 18, '成年', '未成年') AS age_status
FROM users;

-- IFNULL：NULL值处理
SELECT
    username,
    IFNULL(email, '未填写') AS email
FROM users;

-- CASE WHEN：多条件判断
SELECT
    username,
    age,
    CASE
        WHEN age < 18 THEN '未成年'
        WHEN age >= 18 AND age < 60 THEN '成年'
        ELSE '老年'
    END AS age_group
FROM users;

-- CASE简单形式
SELECT
    product_name,
    CASE category
        WHEN '手机' THEN '电子产品'
        WHEN '电脑' THEN '电子产品'
        ELSE '其他'
    END AS product_type
FROM products;
```

---

## 5.9 综合实战案例

### 5.9.1 案例1：用户消费排行榜

```sql
-- 查询用户消费排行榜（前10名）
SELECT
    u.id,
    u.username,
    u.city,
    COUNT(o.id) AS order_count,
    IFNULL(SUM(o.amount), 0) AS total_spent,
    IFNULL(AVG(o.amount), 0) AS avg_order_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.city
ORDER BY total_spent DESC
LIMIT 10;
```

### 5.9.2 案例2：产品销售统计

```sql
-- 查询每个产品的销售情况
SELECT
    p.product_name,
    p.category,
    p.price,
    COUNT(o.id) AS sales_count,
    IFNULL(SUM(o.amount), 0) AS total_sales
FROM products p
LEFT JOIN orders o ON p.product_name = o.product_name
GROUP BY p.product_name, p.category, p.price
ORDER BY sales_count DESC;
```

### 5.9.3 案例3：月度销售报表

```sql
-- 按月统计销售数据
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS order_count,
    COUNT(DISTINCT user_id) AS customer_count,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_amount
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month DESC;
```

### 5.9.4 案例4：用户购买行为分析

```sql
-- 分析用户购买行为
SELECT
    u.username,
    u.city,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_spent,
    MIN(o.order_date) AS first_order_date,
    MAX(o.order_date) AS last_order_date,
    DATEDIFF(MAX(o.order_date), MIN(o.order_date)) AS active_days,
    CASE
        WHEN COUNT(o.id) >= 3 THEN '高价值客户'
        WHEN COUNT(o.id) >= 2 THEN '中价值客户'
        WHEN COUNT(o.id) >= 1 THEN '低价值客户'
        ELSE '潜在客户'
    END AS customer_level
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.city
ORDER BY total_spent DESC;
```

### 5.9.5 案例5：复杂子查询

```sql
-- 查询购买金额超过平均值的订单及用户信息
SELECT
    u.username,
    o.product_name,
    o.amount,
    (SELECT AVG(amount) FROM orders) AS avg_amount,
    o.amount - (SELECT AVG(amount) FROM orders) AS diff
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount > (SELECT AVG(amount) FROM orders)
ORDER BY o.amount DESC;
```

---

## 5.10 JOIN性能优化

### 5.10.1 优化建议

```sql
-- ✅ 1. 在连接列上创建索引
CREATE INDEX idx_user_id ON orders(user_id);

-- ✅ 2. 小表驱动大表
-- 推荐：小表在前，大表在后
SELECT * FROM small_table s
INNER JOIN large_table l ON s.id = l.small_id;

-- ✅ 3. 避免SELECT *
SELECT u.id, u.username, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- ✅ 4. 使用STRAIGHT_JOIN强制连接顺序（特殊情况）
SELECT * FROM users u
STRAIGHT_JOIN orders o ON u.id = o.user_id;

-- ✅ 5. 合理使用子查询 vs JOIN
-- 简单场景用JOIN，复杂逻辑用子查询
```

### 5.10.2 常见性能问题

```sql
-- ❌ 问题1：没有索引的连接
-- 解决：在连接列上创建索引

-- ❌ 问题2：连接条件使用函数
-- 慢：
SELECT * FROM users u
INNER JOIN orders o ON YEAR(u.create_time) = YEAR(o.order_date);

-- 快：
SELECT * FROM users u
INNER JOIN orders o ON DATE(u.create_time) = DATE(o.order_date);

-- ❌ 问题3：过多的表连接
-- 建议：不要超过5个表的连接
```

---

## 5.11 本章总结

**本章学习内容：**
- ✅ INNER JOIN内连接（返回匹配的记录）
- ✅ LEFT JOIN左外连接（返回左表所有记录）
- ✅ RIGHT JOIN右外连接（返回右表所有记录）
- ✅ 子查询（WHERE、FROM、SELECT、EXISTS）
- ✅ UNION联合查询（合并结果集）
- ✅ 常用函数（字符串、日期、数学、条件）
- ✅ 综合实战案例

**重点掌握：**
1. **INNER JOIN**：只返回两表都有的数据
2. **LEFT JOIN**：返回左表所有数据，右表没有的显示NULL
3. **子查询**：可以在WHERE、FROM、SELECT中使用
4. **UNION vs UNION ALL**：UNION去重，UNION ALL不去重
5. **常用函数**：CONCAT、DATE_FORMAT、IF、CASE WHEN

**连接类型对比：**

| 连接类型 | 说明 | 使用场景 |
|---------|------|---------|
| INNER JOIN | 返回匹配的记录 | 查询有关联的数据 |
| LEFT JOIN | 返回左表所有记录 | 查询包括没有关联的数据 |
| RIGHT JOIN | 返回右表所有记录 | 很少使用，用LEFT JOIN代替 |

**性能优化要点：**
- 在连接列上创建索引
- 小表驱动大表
- 避免SELECT *
- 避免在连接条件中使用函数
- 控制连接表的数量

**下一章预告：** 索引原理与优化

---

## 练习题

### 基础练习

1. 查询所有用户及其订单信息（使用INNER JOIN）
2. 查询所有用户及其订单信息，包括没有订单的用户（使用LEFT JOIN）
3. 查询没有下过订单的用户
4. 查询购买过"iPhone"的用户信息
5. 使用子查询查询订单金额大于平均值的订单

### 进阶练习

6. 查询每个用户的订单数量和总消费金额
7. 查询每个产品的销售数量和总销售额
8. 查询消费金额前5名的用户
9. 使用UNION查询北京和上海的用户
10. 使用CASE WHEN将用户按年龄分组（未成年、成年、老年）

### 综合练习

11. 查询2024年1月的订单及用户信息，按金额降序
12. 查询购买过2种以上产品的用户
13. 查询每个城市的用户数量和总消费金额
14. 查询最近30天有订单的用户
15. 查询每个月的新增用户数量

### 实战练习

16. 实现用户消费排行榜（包括订单数、总金额、平均金额）
17. 实现产品销售排行榜
18. 分析用户购买行为，划分客户等级
19. 统计每个月的销售数据（订单数、销售额、客户数）
20. 查询连续3个月都有购买的用户

**继续学习：** [第06章：索引原理与优化](/mysql/02/06.html)
