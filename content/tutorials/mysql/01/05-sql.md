---
title: "第05章：SQL进阶查询"
permalink: "/mysql/01/05-sql.html"
description: "第05章：SQL进阶查询 掌握多表连接、子查询、联合查询等高级查询技巧 5.1 多表连接概述 为什么需要多表连接？ 数据库设计遵循范式，数据分散在多个表中 需要从多个表中组合数据进行查询 避免数据冗余，提高数据一致性 连接类型： INNER JOIN：内连接（最常用） LEFT JOIN：左外连接 RIGHT JOIN：右外连接 CROSS JOIN：交叉连..."
---

<h1>第05章：SQL进阶查询</h1>
<blockquote>
<p>掌握多表连接、子查询、联合查询等高级查询技巧</p>
</blockquote>
<h2>5.1 多表连接概述</h2>
<p><strong>为什么需要多表连接？</strong></p>
<ul>
<li>数据库设计遵循范式，数据分散在多个表中</li>
<li>需要从多个表中组合数据进行查询</li>
<li>避免数据冗余，提高数据一致性</li>
</ul>
<p><strong>连接类型：</strong></p>
<ul>
<li><strong>INNER JOIN</strong>：内连接（最常用）</li>
<li><strong>LEFT JOIN</strong>：左外连接</li>
<li><strong>RIGHT JOIN</strong>：右外连接</li>
<li><strong>CROSS JOIN</strong>：交叉连接（笛卡尔积）</li>
</ul>
<hr>
<h2>5.2 准备测试数据</h2>
<pre><code class="language-sql">-- 创建用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    age INT,
    city VARCHAR(50)
);
<p>-- 创建订单表
CREATE TABLE orders (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
product_name VARCHAR(100),
amount DECIMAL(10,2),
order_date DATE
);</p>
<p>-- 创建产品表
CREATE TABLE products (
id INT PRIMARY KEY AUTO_INCREMENT,
product_name VARCHAR(100),
category VARCHAR(50),
price DECIMAL(10,2)
);</p>
<p>-- 插入用户数据
INSERT INTO users (username, age, city) VALUES
('张三', 25, '北京'),
('李四', 30, '上海'),
('王五', 28, '广州'),
('赵六', 35, '深圳'),
('钱七', 22, '杭州');</p>
<p>-- 插入订单数据
INSERT INTO orders (user_id, product_name, amount, order_date) VALUES
(1, 'iPhone', 5999.00, '2024-01-15'),
(1, 'iPad', 3999.00, '2024-02-20'),
(2, 'MacBook', 9999.00, '2024-01-10'),
(2, 'AirPods', 1299.00, '2024-03-05'),
(3, 'iPhone', 5999.00, '2024-02-01'),
(NULL, 'Apple Watch', 2999.00, '2024-01-20');  -- 游客订单</p>
<p>-- 插入产品数据
INSERT INTO products (product_name, category, price) VALUES
('iPhone', '手机', 5999.00),
('iPad', '平板', 3999.00),
('MacBook', '电脑', 9999.00),
('AirPods', '耳机', 1299.00),
('Apple Watch', '手表', 2999.00),
('iMac', '电脑', 12999.00);  -- 没有订单的产品
</code></pre></p>
<hr>
<h2>5.3 INNER JOIN - 内连接</h2>
<h3>5.3.1 基本语法</h3>
<pre><code class="language-sql">-- 语法1：显式内连接（推荐）
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
<p>-- 语法2：隐式内连接（不推荐）
SELECT columns
FROM table1, table2
WHERE table1.column = table2.column;
</code></pre></p>
<h3>5.3.2 两表内连接</h3>
<pre><code class="language-sql">-- 查询所有订单及对应的用户信息
SELECT 
    u.id AS user_id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
<p>-- 结果：只返回有订单的用户（user_id为NULL的订单不会显示）
-- 张三的2个订单、李四的2个订单、王五的1个订单</p>
<p>-- 使用表别名简化查询
SELECT u.username, o.product_name, o.amount
FROM users u
INNER JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id;
</code></pre></p>
<h3>5.3.3 多表内连接</h3>
<pre><code class="language-sql">-- 查询订单、用户、产品信息
SELECT 
    u.username,
    o.product_name,
    o.amount,
    p.category,
    p.price
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.product_name = p.product_name;
<p>-- 连接顺序：users → orders → products
</code></pre></p>
<h3>5.3.4 内连接 + WHERE条件</h3>
<pre><code class="language-sql">-- 查询购买了iPhone的用户
SELECT u.username, o.product_name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.product_name = 'iPhone';
<p>-- 查询2024年1月的订单及用户信息
SELECT u.username, o.product_name, o.amount, o.order_date
FROM users u
INNER JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id
WHERE o.order_date &gt;= '2024-01-01' AND o.order_date &lt; '2024-02-01';
</code></pre></p>
<h3>5.3.5 内连接 + 聚合函数</h3>
<pre><code class="language-sql">-- 查询每个用户的订单数量和总金额
SELECT 
    u.id,
    u.username,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY total_amount DESC;
<p>-- 注意：只显示有订单的用户（钱七和赵六不会显示）
</code></pre></p>
<hr>
<h2>5.4 LEFT JOIN - 左外连接</h2>
<h3>5.4.1 基本概念</h3>
<pre><code class="language-sql">-- LEFT JOIN：返回左表所有记录，右表没有匹配的显示NULL
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;
<p>-- 特点：
-- 1. 左表（table1）的所有记录都会返回
-- 2. 右表（table2）没有匹配的记录，对应列显示NULL
</code></pre></p>
<h3>5.4.2 基本用法</h3>
<pre><code class="language-sql">-- 查询所有用户及其订单信息（包括没有订单的用户）
SELECT 
    u.id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
<p>-- 结果：
-- 张三的2个订单
-- 李四的2个订单
-- 王五的1个订单
-- 赵六：NULL（没有订单）
-- 钱七：NULL（没有订单）
</code></pre></p>
<h3>5.4.3 查询没有订单的用户</h3>
<pre><code class="language-sql">-- 查询没有下过订单的用户
SELECT u.id, u.username
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
<p>-- 结果：赵六、钱七
</code></pre></p>
<h3>5.4.4 LEFT JOIN + 聚合函数</h3>
<pre><code class="language-sql">-- 查询所有用户的订单数量和总金额（包括没有订单的用户）
SELECT
    u.id,
    u.username,
    COUNT(o.id) AS order_count,  -- 使用COUNT(o.id)而不是COUNT(*)
    IFNULL(SUM(o.amount), 0) AS total_amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username
ORDER BY total_amount DESC;
<p>-- 注意：
-- COUNT(<a href="http://o.id">o.id</a>)：统计订单数（NULL不计数）
-- COUNT(*)：统计所有行（包括NULL）
-- IFNULL(SUM(o.amount), 0)：将NULL转换为0
</code></pre></p>
<hr>
<h2>5.5 RIGHT JOIN - 右外连接</h2>
<h3>5.5.1 基本概念</h3>
<pre><code class="language-sql">-- RIGHT JOIN：返回右表所有记录，左表没有匹配的显示NULL
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;
<p>-- 特点：与LEFT JOIN相反
-- 实际开发中很少使用，通常用LEFT JOIN代替
</code></pre></p>
<h3>5.5.2 基本用法</h3>
<pre><code class="language-sql">-- 查询所有订单及对应的用户信息（包括游客订单）
SELECT
    u.id,
    u.username,
    o.id AS order_id,
    o.product_name,
    o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
<p>-- 结果：包括user_id为NULL的订单（游客订单）</p>
<p>-- 等价的LEFT JOIN写法（推荐）
SELECT
<a href="http://u.id">u.id</a>,
u.username,
<a href="http://o.id">o.id</a> AS order_id,
o.product_name,
o.amount
FROM orders o
LEFT JOIN users u ON o.user_id = <a href="http://u.id">u.id</a>;
</code></pre></p>
<hr>
<h2>5.6 子查询</h2>
<h3>5.6.1 WHERE子查询</h3>
<pre><code class="language-sql">-- 查询订单金额大于平均订单金额的订单
SELECT * FROM orders
WHERE amount &gt; (SELECT AVG(amount) FROM orders);
<p>-- 查询购买过iPhone的用户信息
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders WHERE product_name = 'iPhone');</p>
<p>-- 查询没有下过订单的用户
SELECT * FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders WHERE user_id IS NOT NULL);
</code></pre></p>
<h3>5.6.2 FROM子查询</h3>
<pre><code class="language-sql">-- 查询每个用户的订单统计，然后筛选订单数大于1的用户
SELECT * FROM (
    SELECT
        user_id,
        COUNT(*) AS order_count,
        SUM(amount) AS total_amount
    FROM orders
    GROUP BY user_id
) AS user_stats
WHERE order_count &gt; 1;
<p>-- 注意：FROM子查询必须使用别名
</code></pre></p>
<h3>5.6.3 SELECT子查询</h3>
<pre><code class="language-sql">-- 查询用户信息及其订单数量
SELECT
    u.id,
    u.username,
    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;
<p>-- 查询用户信息及其总消费金额
SELECT
<a href="http://u.id">u.id</a>,
u.username,
(SELECT IFNULL(SUM(amount), 0) FROM orders o WHERE o.user_id = <a href="http://u.id">u.id</a>) AS total_spent
FROM users u;
</code></pre></p>
<h3>5.6.4 EXISTS子查询</h3>
<pre><code class="language-sql">-- 查询有订单的用户
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
<p>-- 查询没有订单的用户
SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = <a href="http://u.id">u.id</a>);</p>
<p>-- EXISTS vs IN：
-- EXISTS：只判断是否存在，性能通常更好
-- IN：返回具体值，适合小数据集
</code></pre></p>
<hr>
<h2>5.7 UNION - 联合查询</h2>
<h3>5.7.1 UNION基本用法</h3>
<pre><code class="language-sql">-- UNION：合并多个查询结果，自动去重
SELECT username FROM users WHERE city = '北京'
UNION
SELECT username FROM users WHERE age &gt; 30;
<p>-- UNION ALL：合并多个查询结果，不去重（性能更好）
SELECT username FROM users WHERE city = '北京'
UNION ALL
SELECT username FROM users WHERE age &gt; 30;
</code></pre></p>
<h3>5.7.2 UNION注意事项</h3>
<pre><code class="language-sql">-- 要求：
-- 1. 每个SELECT的列数必须相同
-- 2. 对应列的数据类型必须兼容
-- 3. 列名以第一个SELECT为准
<p>-- ✅ 正确示例
SELECT id, username FROM users WHERE city = '北京'
UNION
SELECT id, username FROM users WHERE age &gt; 30;</p>
<p>-- ❌ 错误示例：列数不同
SELECT id, username FROM users
UNION
SELECT id FROM orders;  -- 错误！列数不同
</code></pre></p>
<h3>5.7.3 UNION实际应用</h3>
<pre><code class="language-sql">-- 合并不同表的数据
SELECT 'user' AS type, id, username AS name FROM users
UNION ALL
SELECT 'product' AS type, id, product_name AS name FROM products;
<p>-- 分类统计
SELECT '北京' AS city, COUNT(<em>) AS user_count FROM users WHERE city = '北京'
UNION ALL
SELECT '上海' AS city, COUNT(</em>) AS user_count FROM users WHERE city = '上海'
UNION ALL
SELECT '其他' AS city, COUNT(*) AS user_count FROM users WHERE city NOT IN ('北京', '上海');
</code></pre></p>
<hr>
<h2>5.8 常用函数</h2>
<h3>5.8.1 字符串函数</h3>
<pre><code class="language-sql">-- CONCAT：字符串拼接
SELECT CONCAT(username, '(', city, ')') AS user_info FROM users;
-- 结果：张三(北京)
<p>-- CONCAT_WS：使用分隔符拼接
SELECT CONCAT_WS('-', id, username, city) FROM users;
-- 结果：1-张三-北京</p>
<p>-- LENGTH：字符串长度（字节数）
SELECT username, LENGTH(username) FROM users;</p>
<p>-- CHAR_LENGTH：字符串长度（字符数）
SELECT username, CHAR_LENGTH(username) FROM users;</p>
<p>-- SUBSTRING：截取字符串
SELECT SUBSTRING(username, 1, 1) AS first_char FROM users;  -- 第一个字符
SELECT SUBSTRING(product_name, 1, 5) FROM products;</p>
<p>-- UPPER/LOWER：大小写转换
SELECT UPPER(username), LOWER(username) FROM users;</p>
<p>-- TRIM：去除空格
SELECT TRIM('  hello  ');  -- 'hello'
SELECT LTRIM('  hello');   -- 'hello  '
SELECT RTRIM('hello  ');   -- '  hello'</p>
<p>-- REPLACE：替换字符串
SELECT REPLACE(product_name, 'iPhone', 'iPhone 15') FROM products;</p>
<p>-- LEFT/RIGHT：从左/右取字符
SELECT LEFT(username, 1) FROM users;   -- 第一个字符
SELECT RIGHT(username, 1) FROM users;  -- 最后一个字符
</code></pre></p>
<h3>5.8.2 日期函数</h3>
<pre><code class="language-sql">-- NOW：当前日期时间
SELECT NOW();  -- 2024-11-11 10:30:45
<p>-- CURDATE：当前日期
SELECT CURDATE();  -- 2024-11-11</p>
<p>-- CURTIME：当前时间
SELECT CURTIME();  -- 10:30:45</p>
<p>-- DATE：提取日期部分
SELECT DATE(NOW());  -- 2024-11-11</p>
<p>-- TIME：提取时间部分
SELECT TIME(NOW());  -- 10:30:45</p>
<p>-- YEAR/MONTH/DAY：提取年月日
SELECT YEAR(order_date), MONTH(order_date), DAY(order_date) FROM orders;</p>
<p>-- DATE_FORMAT：格式化日期
SELECT DATE_FORMAT(order_date, '%Y年%m月%d日') FROM orders;
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s');</p>
<p>-- DATEDIFF：日期差（天数）
SELECT DATEDIFF(NOW(), order_date) AS days_ago FROM orders;</p>
<p>-- DATE_ADD/DATE_SUB：日期加减
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);   -- 7天后
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH); -- 1个月前</p>
<p>-- TIMESTAMPDIFF：时间差
SELECT TIMESTAMPDIFF(DAY, order_date, NOW()) AS days_ago FROM orders;
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-12-31') AS months;
</code></pre></p>
<h3>5.8.3 数学函数</h3>
<pre><code class="language-sql">-- ROUND：四舍五入
SELECT ROUND(3.14159, 2);  -- 3.14
SELECT ROUND(amount, 0) FROM orders;
<p>-- CEIL：向上取整
SELECT CEIL(3.14);  -- 4</p>
<p>-- FLOOR：向下取整
SELECT FLOOR(3.99);  -- 3</p>
<p>-- ABS：绝对值
SELECT ABS(-10);  -- 10</p>
<p>-- MOD：取余
SELECT MOD(10, 3);  -- 1</p>
<p>-- RAND：随机数（0-1之间）
SELECT RAND();
SELECT FLOOR(RAND() * 100);  -- 0-99的随机整数</p>
<p>-- POWER：幂运算
SELECT POWER(2, 3);  -- 8</p>
<p>-- SQRT：平方根
SELECT SQRT(16);  -- 4
</code></pre></p>
<h3>5.8.4 条件函数</h3>
<pre><code class="language-sql">-- IF：条件判断
SELECT
    username,
    age,
    IF(age &gt;= 18, '成年', '未成年') AS age_status
FROM users;
<p>-- IFNULL：NULL值处理
SELECT
username,
IFNULL(email, '未填写') AS email
FROM users;</p>
<p>-- CASE WHEN：多条件判断
SELECT
username,
age,
CASE
WHEN age &lt; 18 THEN '未成年'
WHEN age &gt;= 18 AND age &lt; 60 THEN '成年'
ELSE '老年'
END AS age_group
FROM users;</p>
<p>-- CASE简单形式
SELECT
product_name,
CASE category
WHEN '手机' THEN '电子产品'
WHEN '电脑' THEN '电子产品'
ELSE '其他'
END AS product_type
FROM products;
</code></pre></p>
<hr>
<h2>5.9 综合实战案例</h2>
<h3>5.9.1 案例1：用户消费排行榜</h3>
<pre><code class="language-sql">-- 查询用户消费排行榜（前10名）
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
</code></pre>
<h3>5.9.2 案例2：产品销售统计</h3>
<pre><code class="language-sql">-- 查询每个产品的销售情况
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
</code></pre>
<h3>5.9.3 案例3：月度销售报表</h3>
<pre><code class="language-sql">-- 按月统计销售数据
SELECT
    DATE_FORMAT(order_date, '%Y-%m') AS month,
    COUNT(*) AS order_count,
    COUNT(DISTINCT user_id) AS customer_count,
    SUM(amount) AS total_sales,
    AVG(amount) AS avg_order_amount
FROM orders
GROUP BY DATE_FORMAT(order_date, '%Y-%m')
ORDER BY month DESC;
</code></pre>
<h3>5.9.4 案例4：用户购买行为分析</h3>
<pre><code class="language-sql">-- 分析用户购买行为
SELECT
    u.username,
    u.city,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_spent,
    MIN(o.order_date) AS first_order_date,
    MAX(o.order_date) AS last_order_date,
    DATEDIFF(MAX(o.order_date), MIN(o.order_date)) AS active_days,
    CASE
        WHEN COUNT(o.id) &gt;= 3 THEN '高价值客户'
        WHEN COUNT(o.id) &gt;= 2 THEN '中价值客户'
        WHEN COUNT(o.id) &gt;= 1 THEN '低价值客户'
        ELSE '潜在客户'
    END AS customer_level
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username, u.city
ORDER BY total_spent DESC;
</code></pre>
<h3>5.9.5 案例5：复杂子查询</h3>
<pre><code class="language-sql">-- 查询购买金额超过平均值的订单及用户信息
SELECT
    u.username,
    o.product_name,
    o.amount,
    (SELECT AVG(amount) FROM orders) AS avg_amount,
    o.amount - (SELECT AVG(amount) FROM orders) AS diff
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount &gt; (SELECT AVG(amount) FROM orders)
ORDER BY o.amount DESC;
</code></pre>
<hr>
<h2>5.10 JOIN性能优化</h2>
<h3>5.10.1 优化建议</h3>
<pre><code class="language-sql">-- ✅ 1. 在连接列上创建索引
CREATE INDEX idx_user_id ON orders(user_id);
<p>-- ✅ 2. 小表驱动大表
-- 推荐：小表在前，大表在后
SELECT * FROM small_table s
INNER JOIN large_table l ON <a href="http://s.id">s.id</a> = l.small_id;</p>
<p>-- ✅ 3. 避免SELECT *
SELECT <a href="http://u.id">u.id</a>, u.username, o.amount
FROM users u
INNER JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id;</p>
<p>-- ✅ 4. 使用STRAIGHT_JOIN强制连接顺序（特殊情况）
SELECT * FROM users u
STRAIGHT_JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id;</p>
<p>-- ✅ 5. 合理使用子查询 vs JOIN
-- 简单场景用JOIN，复杂逻辑用子查询
</code></pre></p>
<h3>5.10.2 常见性能问题</h3>
<pre><code class="language-sql">-- ❌ 问题1：没有索引的连接
-- 解决：在连接列上创建索引
<p>-- ❌ 问题2：连接条件使用函数
-- 慢：
SELECT * FROM users u
INNER JOIN orders o ON YEAR(u.create_time) = YEAR(o.order_date);</p>
<p>-- 快：
SELECT * FROM users u
INNER JOIN orders o ON DATE(u.create_time) = DATE(o.order_date);</p>
<p>-- ❌ 问题3：过多的表连接
-- 建议：不要超过5个表的连接
</code></pre></p>
<hr>
<h2>5.11 本章总结</h2>
<p><strong>本章学习内容：</strong></p>
<ul>
<li>✅ INNER JOIN内连接（返回匹配的记录）</li>
<li>✅ LEFT JOIN左外连接（返回左表所有记录）</li>
<li>✅ RIGHT JOIN右外连接（返回右表所有记录）</li>
<li>✅ 子查询（WHERE、FROM、SELECT、EXISTS）</li>
<li>✅ UNION联合查询（合并结果集）</li>
<li>✅ 常用函数（字符串、日期、数学、条件）</li>
<li>✅ 综合实战案例</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li><strong>INNER JOIN</strong>：只返回两表都有的数据</li>
<li><strong>LEFT JOIN</strong>：返回左表所有数据，右表没有的显示NULL</li>
<li><strong>子查询</strong>：可以在WHERE、FROM、SELECT中使用</li>
<li><strong>UNION vs UNION ALL</strong>：UNION去重，UNION ALL不去重</li>
<li><strong>常用函数</strong>：CONCAT、DATE_FORMAT、IF、CASE WHEN</li>
</ol>
<p><strong>连接类型对比：</strong></p>
<table>
<thead>
<tr>
<th>连接类型</th>
<th>说明</th>
<th>使用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td>INNER JOIN</td>
<td>返回匹配的记录</td>
<td>查询有关联的数据</td>
</tr>
<tr>
<td>LEFT JOIN</td>
<td>返回左表所有记录</td>
<td>查询包括没有关联的数据</td>
</tr>
<tr>
<td>RIGHT JOIN</td>
<td>返回右表所有记录</td>
<td>很少使用，用LEFT JOIN代替</td>
</tr>
</tbody>
</table>
<p><strong>性能优化要点：</strong></p>
<ul>
<li>在连接列上创建索引</li>
<li>小表驱动大表</li>
<li>避免SELECT *</li>
<li>避免在连接条件中使用函数</li>
<li>控制连接表的数量</li>
</ul>
<p><strong>下一章预告：</strong> 索引原理与优化</p>
<hr>
<h2>练习题</h2>
<h3>基础练习</h3>
<ol>
<li>查询所有用户及其订单信息（使用INNER JOIN）</li>
<li>查询所有用户及其订单信息，包括没有订单的用户（使用LEFT JOIN）</li>
<li>查询没有下过订单的用户</li>
<li>查询购买过&quot;iPhone&quot;的用户信息</li>
<li>使用子查询查询订单金额大于平均值的订单</li>
</ol>
<h3>进阶练习</h3>
<ol start="6">
<li>查询每个用户的订单数量和总消费金额</li>
<li>查询每个产品的销售数量和总销售额</li>
<li>查询消费金额前5名的用户</li>
<li>使用UNION查询北京和上海的用户</li>
<li>使用CASE WHEN将用户按年龄分组（未成年、成年、老年）</li>
</ol>
<h3>综合练习</h3>
<ol start="11">
<li>查询2024年1月的订单及用户信息，按金额降序</li>
<li>查询购买过2种以上产品的用户</li>
<li>查询每个城市的用户数量和总消费金额</li>
<li>查询最近30天有订单的用户</li>
<li>查询每个月的新增用户数量</li>
</ol>
<h3>实战练习</h3>
<ol start="16">
<li>实现用户消费排行榜（包括订单数、总金额、平均金额）</li>
<li>实现产品销售排行榜</li>
<li>分析用户购买行为，划分客户等级</li>
<li>统计每个月的销售数据（订单数、销售额、客户数）</li>
<li>查询连续3个月都有购买的用户</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/02/06.html">第06章：索引原理与优化</a></p>
