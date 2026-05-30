---
title: "第04章：SQL基础"
permalink: "/mysql/01/04-sql-dql.html"
description: "第04章：SQL基础 DQL数据查询语言 DQL (Data Query Language) 是SQL中最常用的部分，用于从数据库中查询数据 4.1 DQL概述 DQL主要语句： SELECT：查询数据（最核心、最常用） SELECT语句的执行顺序： 4.2 SELECT基本查询 4.2.1 查询所有列 4.2.2 查询指定列 4.2.3 列别名 4.2.4..."
---

<h1>第04章：SQL基础 - DQL数据查询语言</h1>
<blockquote>
<p>DQL (Data Query Language) 是SQL中最常用的部分，用于从数据库中查询数据</p>
</blockquote>
<h2>4.1 DQL概述</h2>
<p><strong>DQL主要语句：</strong></p>
<ul>
<li><strong>SELECT</strong>：查询数据（最核心、最常用）</li>
</ul>
<p><strong>SELECT语句的执行顺序：</strong></p>
<pre><code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
</code></pre>
<hr>
<h2>4.2 SELECT基本查询</h2>
<h3>4.2.1 查询所有列</h3>
<pre><code class="language-sql">-- 查询表中所有列的所有数据
SELECT * FROM users;
<p>-- ⚠️ 生产环境不推荐使用SELECT *，原因：
-- 1. 性能差：查询不需要的列浪费资源
-- 2. 网络传输：传输不需要的数据
-- 3. 索引失效：无法使用覆盖索引
</code></pre></p>
<h3>4.2.2 查询指定列</h3>
<pre><code class="language-sql">-- 推荐：只查询需要的列
SELECT id, username, email FROM users;
<p>-- 查询结果中使用表达式
SELECT id, username, age, age + 1 AS next_year_age FROM users;</p>
<p>-- 查询结果中使用函数
SELECT id, username, UPPER(email) AS email_upper FROM users;
</code></pre></p>
<h3>4.2.3 列别名</h3>
<pre><code class="language-sql">-- 使用AS关键字（推荐）
SELECT id AS user_id, username AS name FROM users;
<p>-- 省略AS关键字
SELECT id user_id, username name FROM users;</p>
<p>-- 别名包含空格时使用引号
SELECT id AS 'user id', username AS '用户名' FROM users;
</code></pre></p>
<h3>4.2.4 去重查询</h3>
<pre><code class="language-sql">-- 创建测试数据
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    product_name VARCHAR(100),
    amount DECIMAL(10,2)
);
<p>INSERT INTO orders (user_id, product_name, amount) VALUES
(1, 'iPhone', 5999.00),
(1, 'iPad', 3999.00),
(2, 'iPhone', 5999.00),
(3, 'MacBook', 9999.00),
(2, 'AirPods', 1299.00);</p>
<p>-- 查询所有下单的用户ID（有重复）
SELECT user_id FROM orders;
-- 结果：1, 1, 2, 3, 2</p>
<p>-- 使用DISTINCT去重
SELECT DISTINCT user_id FROM orders;
-- 结果：1, 2, 3</p>
<p>-- 多列去重（组合去重）
SELECT DISTINCT user_id, product_name FROM orders;
</code></pre></p>
<hr>
<h2>4.3 WHERE条件过滤</h2>
<h3>4.3.1 比较运算符</h3>
<pre><code class="language-sql">-- 等于
SELECT * FROM users WHERE age = 25;
<p>-- 不等于（两种写法）
SELECT * FROM users WHERE age != 25;
SELECT * FROM users WHERE age &lt;&gt; 25;</p>
<p>-- 大于、小于
SELECT * FROM users WHERE age &gt; 25;
SELECT * FROM users WHERE age &lt; 25;
SELECT * FROM users WHERE age &gt;= 25;
SELECT * FROM users WHERE age &lt;= 25;
</code></pre></p>
<h3>4.3.2 逻辑运算符</h3>
<pre><code class="language-sql">-- AND：多个条件同时满足
SELECT * FROM users WHERE age &gt;= 18 AND age &lt;= 30;
<p>-- OR：满足任一条件
SELECT * FROM users WHERE age &lt; 18 OR age &gt; 60;</p>
<p>-- NOT：取反
SELECT * FROM users WHERE NOT (age &lt; 18);</p>
<p>-- 组合使用（注意优先级，AND优先于OR）
SELECT * FROM users WHERE (age &lt; 18 OR age &gt; 60) AND status = 1;
</code></pre></p>
<h3>4.3.3 范围查询</h3>
<pre><code class="language-sql">-- BETWEEN...AND（包含边界值）
SELECT * FROM users WHERE age BETWEEN 18 AND 30;
-- 等价于：WHERE age &gt;= 18 AND age &lt;= 30
<p>-- NOT BETWEEN
SELECT * FROM users WHERE age NOT BETWEEN 18 AND 30;</p>
<p>-- IN：在指定列表中
SELECT * FROM users WHERE age IN (18, 20, 25, 30);
-- 等价于：WHERE age = 18 OR age = 20 OR age = 25 OR age = 30</p>
<p>-- NOT IN
SELECT * FROM users WHERE age NOT IN (18, 20, 25);
</code></pre></p>
<h3>4.3.4 模糊查询</h3>
<pre><code class="language-sql">-- LIKE模糊匹配
-- %：匹配任意多个字符（包括0个）
-- _：匹配单个字符
<p>-- 查询姓张的用户
SELECT * FROM users WHERE username LIKE '张%';</p>
<p>-- 查询名字中包含&quot;明&quot;的用户
SELECT * FROM users WHERE username LIKE '%明%';</p>
<p>-- 查询姓张且名字是两个字的用户
SELECT * FROM users WHERE username LIKE '张_';</p>
<p>-- 查询姓张且名字是三个字的用户
SELECT * FROM users WHERE username LIKE '张__';</p>
<p>-- ⚠️ 性能警告：前导模糊查询无法使用索引
-- ❌ 慢：SELECT * FROM users WHERE username LIKE '%张%';
-- ✅ 快：SELECT * FROM users WHERE username LIKE '张%';
</code></pre></p>
<h3>4.3.5 NULL值查询</h3>
<pre><code class="language-sql">-- 查询email为NULL的用户
SELECT * FROM users WHERE email IS NULL;
<p>-- 查询email不为NULL的用户
SELECT * FROM users WHERE email IS NOT NULL;</p>
<p>-- ⚠️ 错误写法（NULL不能用=比较）
-- ❌ SELECT * FROM users WHERE email = NULL;  -- 查不到数据
-- ✅ SELECT * FROM users WHERE email IS NULL;
</code></pre></p>
<hr>
<h2>4.4 ORDER BY排序</h2>
<h3>4.4.1 单列排序</h3>
<pre><code class="language-sql">-- 升序排序（ASC，默认）
SELECT * FROM users ORDER BY age ASC;
SELECT * FROM users ORDER BY age;  -- 省略ASC
<p>-- 降序排序（DESC）
SELECT * FROM users ORDER BY age DESC;</p>
<p>-- 按创建时间倒序（最新的在前）
SELECT * FROM users ORDER BY create_time DESC;
</code></pre></p>
<h3>4.4.2 多列排序</h3>
<pre><code class="language-sql">-- 先按年龄升序，年龄相同时按创建时间降序
SELECT * FROM users ORDER BY age ASC, create_time DESC;
<p>-- 先按状态，再按年龄
SELECT * FROM users ORDER BY status, age DESC;
</code></pre></p>
<h3>4.4.3 按表达式排序</h3>
<pre><code class="language-sql">-- 按列别名排序
SELECT id, username, age, age + 1 AS next_age 
FROM users 
ORDER BY next_age DESC;
<p>-- 按函数结果排序
SELECT * FROM users ORDER BY LENGTH(username) DESC;
</code></pre></p>
<h3>4.4.4 NULL值排序</h3>
<pre><code class="language-sql">-- MySQL中NULL值排序规则：
-- ASC：NULL值排在最前面
-- DESC：NULL值排在最后面
<p>SELECT * FROM users ORDER BY email ASC;  -- NULL在前
SELECT * FROM users ORDER BY email DESC; -- NULL在后
</code></pre></p>
<hr>
<h2>4.5 LIMIT分页</h2>
<h3>4.5.1 基本用法</h3>
<pre><code class="language-sql">-- 查询前5条记录
SELECT * FROM users LIMIT 5;
<p>-- 查询前10条记录
SELECT * FROM users ORDER BY create_time DESC LIMIT 10;
</code></pre></p>
<h3>4.5.2 分页查询</h3>
<pre><code class="language-sql">-- 语法：LIMIT offset, count
-- offset：偏移量（从0开始）
-- count：返回的记录数
<p>-- 第1页（每页10条）
SELECT * FROM users LIMIT 0, 10;</p>
<p>-- 第2页（每页10条）
SELECT * FROM users LIMIT 10, 10;</p>
<p>-- 第3页（每页10条）
SELECT * FROM users LIMIT 20, 10;</p>
<p>-- 通用公式：第n页
-- LIMIT (n-1) * pageSize, pageSize
</code></pre></p>
<h3>4.5.3 另一种语法</h3>
<pre><code class="language-sql">-- LIMIT count OFFSET offset（MySQL 5.7支持）
SELECT * FROM users LIMIT 10 OFFSET 0;  -- 第1页
SELECT * FROM users LIMIT 10 OFFSET 10; -- 第2页
SELECT * FROM users LIMIT 10 OFFSET 20; -- 第3页
</code></pre>
<h3>4.5.4 深分页性能问题</h3>
<pre><code class="language-sql">-- ⚠️ 性能问题：深分页很慢
-- ❌ 慢：SELECT * FROM users LIMIT 1000000, 10;
-- 原因：MySQL需要扫描前1000010条记录，然后丢弃前1000000条
<p>-- ✅ 优化方案1：使用主键过滤
SELECT * FROM users WHERE id &gt; 1000000 LIMIT 10;</p>
<p>-- ✅ 优化方案2：延迟关联
SELECT u.* FROM users u
INNER JOIN (SELECT id FROM users LIMIT 1000000, 10) t ON <a href="http://u.id">u.id</a> = <a href="http://t.id">t.id</a>;
</code></pre></p>
<hr>
<h2>4.6 聚合函数</h2>
<h3>4.6.1 COUNT - 计数</h3>
<pre><code class="language-sql">-- 统计总记录数
SELECT COUNT(*) FROM users;
<p>-- 统计指定列非NULL的记录数
SELECT COUNT(email) FROM users;</p>
<p>-- 统计去重后的记录数
SELECT COUNT(DISTINCT user_id) FROM orders;</p>
<p>-- COUNT(<em>)、COUNT(1)、COUNT(列名)的区别：
-- COUNT(</em>)：统计所有行（包括NULL）
-- COUNT(1)：统计所有行（包括NULL），性能与COUNT(*)相同
-- COUNT(列名)：统计该列非NULL的行数
</code></pre></p>
<h3>4.6.2 SUM - 求和</h3>
<pre><code class="language-sql">-- 计算订单总金额
SELECT SUM(amount) FROM orders;
<p>-- SUM会忽略NULL值
SELECT SUM(age) FROM users;  -- NULL不参与计算</p>
<p>-- 结合WHERE使用
SELECT SUM(amount) FROM orders WHERE user_id = 1;
</code></pre></p>
<h3>4.6.3 AVG - 平均值</h3>
<pre><code class="language-sql">-- 计算平均年龄
SELECT AVG(age) FROM users;
<p>-- 计算平均订单金额
SELECT AVG(amount) FROM orders;</p>
<p>-- AVG会忽略NULL值
-- 如果所有值都是NULL，返回NULL
</code></pre></p>
<h3>4.6.4 MAX和MIN - 最大值和最小值</h3>
<pre><code class="language-sql">-- 查询最大年龄
SELECT MAX(age) FROM users;
<p>-- 查询最小年龄
SELECT MIN(age) FROM users;</p>
<p>-- 查询最高订单金额
SELECT MAX(amount) FROM orders;</p>
<p>-- 查询最早的注册时间
SELECT MIN(create_time) FROM users;
</code></pre></p>
<h3>4.6.5 聚合函数组合使用</h3>
<pre><code class="language-sql">-- 一次查询多个聚合结果
SELECT
    COUNT(*) AS total_users,
    AVG(age) AS avg_age,
    MAX(age) AS max_age,
    MIN(age) AS min_age
FROM users;
<p>-- 订单统计
SELECT
COUNT(*) AS order_count,
SUM(amount) AS total_amount,
AVG(amount) AS avg_amount,
MAX(amount) AS max_amount,
MIN(amount) AS min_amount
FROM orders;
</code></pre></p>
<hr>
<h2>4.7 GROUP BY分组查询</h2>
<h3>4.7.1 基本分组</h3>
<pre><code class="language-sql">-- 按用户ID分组，统计每个用户的订单数
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id;
<p>-- 按用户ID分组，统计每个用户的订单总金额
SELECT user_id, SUM(amount) AS total_amount
FROM orders
GROUP BY user_id;
</code></pre></p>
<h3>4.7.2 多列分组</h3>
<pre><code class="language-sql">-- 按用户ID和产品名称分组
SELECT user_id, product_name, COUNT(*) AS buy_count
FROM orders
GROUP BY user_id, product_name;
<p>-- 按日期分组统计
SELECT DATE(create_time) AS order_date, COUNT(*) AS order_count
FROM orders
GROUP BY DATE(create_time);
</code></pre></p>
<h3>4.7.3 GROUP BY注意事项</h3>
<pre><code class="language-sql">-- ⚠️ 重要规则：SELECT后的列必须是：
-- 1. GROUP BY中的列
-- 2. 聚合函数
<p>-- ❌ 错误示例：
-- SELECT user_id, username, COUNT(*) FROM orders GROUP BY user_id;
-- 错误原因：username不在GROUP BY中，也不是聚合函数</p>
<p>-- ✅ 正确示例：
SELECT user_id, COUNT(*) FROM orders GROUP BY user_id;
</code></pre></p>
<hr>
<h2>4.8 HAVING分组过滤</h2>
<h3>4.8.1 HAVING vs WHERE</h3>
<pre><code class="language-sql">-- WHERE：在分组前过滤（过滤行）
-- HAVING：在分组后过滤（过滤组）
<p>-- 查询订单数量大于2的用户
SELECT user_id, COUNT(<em>) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(</em>) &gt; 2;</p>
<p>-- 查询总消费金额大于10000的用户
SELECT user_id, SUM(amount) AS total_amount
FROM orders
GROUP BY user_id
HAVING SUM(amount) &gt; 10000;
</code></pre></p>
<h3>4.8.2 WHERE和HAVING结合使用</h3>
<pre><code class="language-sql">-- 查询2024年订单数量大于2的用户
SELECT user_id, COUNT(*) AS order_count
FROM orders
WHERE YEAR(create_time) = 2024  -- 分组前过滤
GROUP BY user_id
HAVING COUNT(*) &gt; 2;            -- 分组后过滤
<p>-- 执行顺序：WHERE → GROUP BY → HAVING
</code></pre></p>
<h3>4.8.3 HAVING中使用别名</h3>
<pre><code class="language-sql">-- 可以在HAVING中使用SELECT中定义的别名
SELECT user_id, COUNT(*) AS order_count
FROM orders
GROUP BY user_id
HAVING order_count &gt; 2;  -- 使用别名
<p>-- 也可以直接使用聚合函数
SELECT user_id, COUNT(<em>) AS order_count
FROM orders
GROUP BY user_id
HAVING COUNT(</em>) &gt; 2;
</code></pre></p>
<hr>
<h2>4.9 完整查询示例</h2>
<h3>4.9.1 综合示例1：用户订单统计</h3>
<pre><code class="language-sql">-- 准备测试数据
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    age INT,
    city VARCHAR(50),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
<p>CREATE TABLE orders (
id INT PRIMARY KEY AUTO_INCREMENT,
user_id INT,
product_name VARCHAR(100),
amount DECIMAL(10,2),
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);</p>
<p>INSERT INTO users (username, age, city) VALUES
('张三', 25, '北京'),
('李四', 30, '上海'),
('王五', 28, '广州'),
('赵六', 35, '深圳'),
('钱七', 22, '杭州');</p>
<p>INSERT INTO orders (user_id, product_name, amount) VALUES
(1, 'iPhone', 5999.00),
(1, 'iPad', 3999.00),
(2, 'MacBook', 9999.00),
(2, 'AirPods', 1299.00),
(3, 'iPhone', 5999.00),
(1, 'Apple Watch', 2999.00),
(4, 'iPad', 3999.00);</p>
<p>-- 查询每个用户的订单数量和总金额，按总金额降序
SELECT
user_id,
COUNT(*) AS order_count,
SUM(amount) AS total_amount,
AVG(amount) AS avg_amount
FROM orders
GROUP BY user_id
HAVING total_amount &gt; 5000
ORDER BY total_amount DESC;
</code></pre></p>
<h3>4.9.2 综合示例2：销售数据分析</h3>
<pre><code class="language-sql">-- 查询购买次数大于1次的用户，显示购买次数和总金额
SELECT
    user_id,
    COUNT(*) AS buy_times,
    SUM(amount) AS total_spent,
    MAX(amount) AS max_order,
    MIN(amount) AS min_order
FROM orders
WHERE amount &gt; 1000  -- 只统计金额大于1000的订单
GROUP BY user_id
HAVING buy_times &gt; 1  -- 购买次数大于1次
ORDER BY total_spent DESC
LIMIT 10;  -- 只显示前10名
</code></pre>
<h3>4.9.3 综合示例3：日期统计</h3>
<pre><code class="language-sql">-- 按日期统计每天的订单数量和金额
SELECT
    DATE(create_time) AS order_date,
    COUNT(*) AS order_count,
    SUM(amount) AS daily_amount,
    AVG(amount) AS avg_amount
FROM orders
GROUP BY DATE(create_time)
ORDER BY order_date DESC;
<p>-- 按月份统计
SELECT
DATE_FORMAT(create_time, '%Y-%m') AS order_month,
COUNT(*) AS order_count,
SUM(amount) AS monthly_amount
FROM orders
GROUP BY DATE_FORMAT(create_time, '%Y-%m')
ORDER BY order_month DESC;
</code></pre></p>
<hr>
<h2>4.10 查询执行顺序详解</h2>
<h3>4.10.1 SQL执行顺序</h3>
<pre><code class="language-sql">-- 书写顺序：
SELECT column_list
FROM table_name
WHERE condition
GROUP BY column_list
HAVING condition
ORDER BY column_list
LIMIT offset, count;
<p>-- 实际执行顺序：
-- 1. FROM：确定数据来源
-- 2. WHERE：过滤行
-- 3. GROUP BY：分组
-- 4. HAVING：过滤分组
-- 5. SELECT：选择列
-- 6. ORDER BY：排序
-- 7. LIMIT：限制结果数量
</code></pre></p>
<h3>4.10.2 理解执行顺序的重要性</h3>
<pre><code class="language-sql">-- 示例：为什么WHERE不能使用聚合函数？
-- ❌ 错误：
SELECT user_id, COUNT(*) AS cnt
FROM orders
WHERE COUNT(*) &gt; 2  -- 错误！WHERE执行时还没有分组
GROUP BY user_id;
<p>-- ✅ 正确：
SELECT user_id, COUNT(<em>) AS cnt
FROM orders
GROUP BY user_id
HAVING COUNT(</em>) &gt; 2;  -- HAVING在分组后执行</p>
<p>-- 示例：为什么WHERE不能使用SELECT中的别名？
-- ❌ 错误：
SELECT age, age + 1 AS next_age
FROM users
WHERE next_age &gt; 30;  -- 错误！WHERE执行时还没有SELECT</p>
<p>-- ✅ 正确：
SELECT age, age + 1 AS next_age
FROM users
WHERE age + 1 &gt; 30;  -- 直接使用表达式
</code></pre></p>
<hr>
<h2>4.11 常见问题与最佳实践</h2>
<h3>4.11.1 性能优化建议</h3>
<pre><code class="language-sql">-- ✅ 1. 避免SELECT *
-- ❌ 慢：SELECT * FROM users WHERE id = 1;
-- ✅ 快：SELECT id, username, email FROM users WHERE id = 1;
<p>-- ✅ 2. 避免在WHERE中使用函数
-- ❌ 慢：SELECT * FROM users WHERE YEAR(create_time) = 2024;
-- ✅ 快：SELECT * FROM users WHERE create_time &gt;= '2024-01-01' AND create_time &lt; '2025-01-01';</p>
<p>-- ✅ 3. 避免前导模糊查询
-- ❌ 慢：SELECT * FROM users WHERE username LIKE '%张%';
-- ✅ 快：SELECT * FROM users WHERE username LIKE '张%';</p>
<p>-- ✅ 4. 使用LIMIT限制结果集
SELECT * FROM users ORDER BY create_time DESC LIMIT 100;</p>
<p>-- ✅ 5. 合理使用索引
-- 在WHERE、ORDER BY、GROUP BY的列上创建索引
</code></pre></p>
<h3>4.11.2 常见错误</h3>
<pre><code class="language-sql">-- 错误1：NULL值比较
-- ❌ SELECT * FROM users WHERE email = NULL;
-- ✅ SELECT * FROM users WHERE email IS NULL;
<p>-- 错误2：GROUP BY后选择非聚合列
-- ❌ SELECT user_id, username, COUNT(<em>) FROM orders GROUP BY user_id;
-- ✅ SELECT user_id, COUNT(</em>) FROM orders GROUP BY user_id;</p>
<p>-- 错误3：WHERE中使用聚合函数
-- ❌ SELECT user_id FROM orders WHERE COUNT(<em>) &gt; 2 GROUP BY user_id;
-- ✅ SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(</em>) &gt; 2;</p>
<p>-- 错误4：ORDER BY使用不存在的列
-- ❌ SELECT id, username FROM users ORDER BY age;  -- age未在SELECT中
-- ✅ SELECT id, username, age FROM users ORDER BY age;
</code></pre></p>
<hr>
<h2>4.12 本章总结</h2>
<p><strong>本章学习内容：</strong></p>
<ul>
<li>✅ SELECT基本查询（指定列、别名、去重）</li>
<li>✅ WHERE条件过滤（比较、逻辑、范围、模糊、NULL）</li>
<li>✅ ORDER BY排序（单列、多列、表达式）</li>
<li>✅ LIMIT分页（基本用法、深分页优化）</li>
<li>✅ 聚合函数（COUNT、SUM、AVG、MAX、MIN）</li>
<li>✅ GROUP BY分组查询</li>
<li>✅ HAVING分组过滤</li>
<li>✅ SQL执行顺序</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li>SELECT只查询需要的列，避免SELECT *</li>
<li>WHERE条件过滤的各种运算符</li>
<li>LIKE模糊查询的性能问题</li>
<li>NULL值必须用IS NULL判断</li>
<li>聚合函数的使用场景</li>
<li>GROUP BY和HAVING的区别</li>
<li>SQL的执行顺序</li>
</ol>
<p><strong>性能优化要点：</strong></p>
<ul>
<li>避免SELECT *</li>
<li>避免在WHERE中使用函数</li>
<li>避免前导模糊查询（LIKE '%xxx'）</li>
<li>深分页使用主键过滤优化</li>
<li>合理使用索引</li>
</ul>
<p><strong>下一章预告：</strong> SQL进阶查询（多表连接、子查询、联合查询）</p>
<hr>
<h2>练习题</h2>
<h3>基础练习</h3>
<ol>
<li>查询年龄在20-30岁之间的用户</li>
<li>查询用户名以&quot;张&quot;开头的用户</li>
<li>查询email不为空的用户，按年龄降序排列</li>
<li>查询前10个最新注册的用户</li>
<li>统计用户总数、平均年龄、最大年龄、最小年龄</li>
</ol>
<h3>进阶练习</h3>
<ol start="6">
<li>按城市分组，统计每个城市的用户数量</li>
<li>查询用户数量大于5的城市</li>
<li>查询每个用户的订单数量和总消费金额</li>
<li>查询消费总金额大于10000的用户</li>
<li>按日期统计每天的订单数量和总金额</li>
</ol>
<h3>综合练习</h3>
<ol start="11">
<li>查询2024年消费金额前10名的用户</li>
<li>查询购买过iPhone的用户ID（去重）</li>
<li>统计每个产品的销售数量和总金额，按销售额降序</li>
<li>查询平均订单金额大于5000的用户</li>
<li>查询每个月的订单数量和总金额，按月份降序</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/01/05-sql.html">第05章：SQL进阶查询</a></p>
