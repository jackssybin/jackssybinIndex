---
title: 第03章：SQL基础 - MySQL教程
description: 第03章：SQL基础 DML数据操作语言 DML (Data Manipulation Language) 用于操作数据库中的数据
  3.1 DML概述 DML主要包括三个语句： INSERT ：插入数据 UPDATE ：更新数据 DELETE ：删除数据 3.2 INSERT 插入数据
  3.2.1 基本语法 语法1：指定列名 INSERT INTO tabl...
url: /mysql/01/03-sql-dml.html
kind: page
---

<header>
    <div class="banner">
        <div class="fn-clear wrapper">
            <h1 class="fn-inline"><a href="/" rel="start">jackssybin 的个人博客</a></h1>
            <small> &nbsp; 记录精彩的程序人生</small>
        </div>
    </div>
    <div class="navbar">
        <div class="fn-clear wrapper">
            <nav class="fn-left">
                <a href="/"><i class="icon-home"></i> 首页</a>
                <a href="/my-github-repos" target="_self" rel="section"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
<a href="https://blog.csdn.net/jackssybin" target="_self" rel="section">我的scdn</a>
                <a href="/tutorials.html" rel="section"><i class="icon-list"></i> 教程中心</a>
                <a href="/news.html" rel="section"><i class="icon-list"></i> 实时新闻</a>
                <a href="/topics.html" rel="section"><i class="icon-list"></i> 专题</a>
                <a href="/nav.html" rel="section"><i class="icon-link"></i> 网址导航</a>
                <a href="/tags.html" rel="section"><i class="icon-tags"></i> 标签墙</a>
                <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
                <a href="/about.html" rel="section"><i class="icon-user"></i> 关于本站</a>
                <a rel="archive" href="/links.html"><i class="icon-link"></i> 友情链接</a>
                <a rel="alternate" href="/rss.xml" rel="section"><i class="icon-rss"></i> RSS</a>
            </nav>
            <div class="fn-right">
                <button class="theme-toggle" type="button" aria-label="切换黑夜模式" title="切换黑夜模式" data-theme-toggle>夜</button>
                <form class="form" action="/search.html" method="get">
                    <input placeholder="搜索文章标题" id="search" type="text" name="keyword">
                    <button type="submit"><i class="icon-search"></i></button>
                </form>
            </div>
        </div>
    </div>
</header>
<div class="wrapper">
    <div class="main-wrap">
        <main class="other">
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第03章：SQL基础</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>MySQL教程目录</h3>
    <section>
      <h4>入门导航</h4>
      <a class="" href="/mysql/mysql.html">MySQL从新手到专家完整学习路线图</a>
    </section>
<section>
      <h4>01</h4>
      <a class="" href="/mysql/01/01-mysql.html">第01章：MySQL概述与安装</a>
<a class="" href="/mysql/01/02-sql-ddl.html">第02章：SQL基础</a>
<a class="current" href="/mysql/01/03-sql-dml.html">第03章：SQL基础</a>
<a class="" href="/mysql/01/04-sql-dql.html">第04章：SQL基础</a>
<a class="" href="/mysql/01/05-sql.html">第05章：SQL进阶查询</a>
    </section>
<section>
      <h4>02</h4>
      <a class="" href="/mysql/02/06.html">第06章：索引原理与优化 ⭐⭐⭐⭐⭐</a>
<a class="" href="/mysql/02/07.html">第07章：存储引擎深入理解</a>
<a class="" href="/mysql/02/08.html">第08章：事务与并发控制 ⭐⭐⭐⭐⭐</a>
<a class="" href="/mysql/02/09.html">第09章：锁机制 ⭐⭐⭐⭐⭐</a>
<a class="" href="/mysql/02/10-mysql.html">第10章：MySQL架构与执行流程</a>
<a class="" href="/mysql/02/11.html">第11章：视图、存储过程与函数</a>
    </section>
<section>
      <h4>03</h4>
      <a class="" href="/mysql/03/12.html">第12章：触发器与事件</a>
<a class="" href="/mysql/03/13.html">第13章：分区表</a>
<a class="" href="/mysql/03/14.html">第14章：字符集与排序规则</a>
    </section>
<section>
      <h4>04</h4>
      <a class="" href="/mysql/04/15-mysql.html">第15章：MySQL日志系统 ⭐⭐⭐</a>
<a class="" href="/mysql/04/16.html">第16章：备份策略与实践</a>
<a class="" href="/mysql/04/17.html">第17章：数据恢复实战</a>
    </section>
<section>
      <h4>05</h4>
      <a class="" href="/mysql/05/18-sql.html">第18章：SQL优化实战 ⭐⭐⭐⭐⭐</a>
<a class="" href="/mysql/05/19.html">第19章：索引优化进阶</a>
<a class="" href="/mysql/05/20.html">第20章：MySQL服务器优化</a>
<a class="" href="/mysql/05/21.html">第21章：硬件与操作系统优化</a>
    </section>
<section>
      <h4>06</h4>
      <a class="" href="/mysql/06/22.html">第22章：主从复制 ⭐⭐⭐⭐⭐</a>
<a class="" href="/mysql/06/23.html">第23章：读写分离</a>
<a class="" href="/mysql/06/24.html">第24章：高可用方案</a>
<a class="" href="/mysql/06/25.html">第25章：分库分表</a>
    </section>
<section>
      <h4>07</h4>
      <a class="" href="/mysql/07/26.html">第26章：MySQL监控体系</a>
<a class="" href="/mysql/07/27.html">第27章：性能诊断工具</a>
<a class="" href="/mysql/07/28.html">第28章：故障排查实战</a>
    </section>
<section>
      <h4>08</h4>
      <a class="" href="/mysql/08/29.html">第29章：用户与权限管理</a>
<a class="" href="/mysql/08/30.html">第30章：MySQL安全加固</a>
    </section>
<section>
      <h4>09</h4>
      <a class="" href="/mysql/09/31.html">第31章：企业级实战案例</a>
<a class="" href="/mysql/09/32.html">第32章：MySQL面试题精选</a>
<a class="" href="/mysql/09/33.html">第33章：疑难问题解决方案</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/mysql/01/03-sql-dml.html">第03章：SQL基础</a></h2>
            <div class="meta"><span>MySQL教程 / 01</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第03章：SQL基础 - DML数据操作语言</h1>
<blockquote>
<p>DML (Data Manipulation Language) 用于操作数据库中的数据</p>
</blockquote>
<h2>3.1 DML概述</h2>
<p><strong>DML主要包括三个语句：</strong></p>
<ul>
<li><strong>INSERT</strong>：插入数据</li>
<li><strong>UPDATE</strong>：更新数据</li>
<li><strong>DELETE</strong>：删除数据</li>
</ul>
<hr>
<h2>3.2 INSERT - 插入数据</h2>
<h3>3.2.1 基本语法</h3>
<pre><code class="language-sql">-- 语法1：指定列名
INSERT INTO table_name (column1, column2, ...) 
VALUES (value1, value2, ...);
<p>-- 语法2：不指定列名（必须提供所有列的值）
INSERT INTO table_name
VALUES (value1, value2, ...);
</code></pre></p>
<h3>3.2.2 插入单行数据</h3>
<p><strong>准备测试表：</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    age INT,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</code></pre>
<p><strong>插入数据：</strong></p>
<pre><code class="language-sql">-- 方法1：指定列名（推荐）
INSERT INTO users (username, password, email, age) 
VALUES ('zhangsan', '123456', 'zhangsan@example.com', 25);
<p>-- 方法2：不指定列名
INSERT INTO users
VALUES (NULL, 'lisi', '123456', 'lisi@example.com', 30, 1, NOW());</p>
<p>-- 方法3：部分列
INSERT INTO users (username, password)
VALUES ('wangwu', '123456');
-- email、age为NULL，status使用默认值1，create_time自动设置
</code></pre></p>
<h3>3.2.3 插入多行数据</h3>
<pre><code class="language-sql">-- 一次插入多行（推荐，性能好）
INSERT INTO users (username, password, email, age) VALUES
('user1', 'pass1', 'user1@example.com', 20),
('user2', 'pass2', 'user2@example.com', 22),
('user3', 'pass3', 'user3@example.com', 24),
('user4', 'pass4', 'user4@example.com', 26);
<p>-- 性能对比
-- 方法1：插入1000行，执行1000次INSERT（慢）
-- 方法2：插入1000行，执行1次INSERT（快10倍以上）
</code></pre></p>
<h3>3.2.4 插入查询结果</h3>
<pre><code class="language-sql">-- 从另一个表插入数据
INSERT INTO users_backup (username, password, email, age)
SELECT username, password, email, age FROM users WHERE age &gt; 25;
<p>-- 创建表并插入数据
CREATE TABLE users_active AS
SELECT * FROM users WHERE status = 1;
</code></pre></p>
<h3>3.2.5 INSERT IGNORE</h3>
<pre><code class="language-sql">-- 忽略重复键错误
INSERT IGNORE INTO users (username, password) 
VALUES ('zhangsan', '123456');
-- 如果username已存在，不会报错，也不会插入
<p>-- 对比：普通INSERT会报错
INSERT INTO users (username, password)
VALUES ('zhangsan', '123456');
-- ERROR 1062: Duplicate entry 'zhangsan' for key 'username'
</code></pre></p>
<h3>3.2.6 REPLACE INTO</h3>
<pre><code class="language-sql">-- 如果存在则替换，不存在则插入
REPLACE INTO users (id, username, password) 
VALUES (1, 'zhangsan', 'newpass');
<p>-- 等价于
DELETE FROM users WHERE id = 1;
INSERT INTO users (id, username, password) VALUES (1, 'zhangsan', 'newpass');
</code></pre></p>
<h3>3.2.7 ON DUPLICATE KEY UPDATE</h3>
<pre><code class="language-sql">-- 如果主键或唯一键冲突，则更新
INSERT INTO users (username, password, email) 
VALUES ('zhangsan', '123456', 'new@example.com')
ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    email = VALUES(email);
<p>-- 实战示例：统计访问次数
CREATE TABLE page_views (
page_id INT PRIMARY KEY,
view_count INT DEFAULT 0
);</p>
<p>-- 每次访问，计数+1
INSERT INTO page_views (page_id, view_count)
VALUES (1, 1)
ON DUPLICATE KEY UPDATE
view_count = view_count + 1;
</code></pre></p>
<hr>
<h2>3.3 UPDATE - 更新数据</h2>
<h3>3.3.1 基本语法</h3>
<pre><code class="language-sql">UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
</code></pre>
<p><strong>⚠️ 警告：</strong> 如果不加WHERE条件，会更新所有行！</p>
<h3>3.3.2 更新单行</h3>
<pre><code class="language-sql">-- 更新单个字段
UPDATE users 
SET email = 'newemail@example.com' 
WHERE id = 1;
<p>-- 更新多个字段
UPDATE users
SET email = 'newemail@example.com', age = 26
WHERE id = 1;
</code></pre></p>
<h3>3.3.3 更新多行</h3>
<pre><code class="language-sql">-- 更新所有年龄小于18的用户状态
UPDATE users 
SET status = 0 
WHERE age &lt; 18;
<p>-- 更新所有用户（危险！）
UPDATE users
SET status = 1;
</code></pre></p>
<h3>3.3.4 使用表达式更新</h3>
<pre><code class="language-sql">-- 年龄+1
UPDATE users 
SET age = age + 1 
WHERE id = 1;
<p>-- 字符串拼接
UPDATE users
SET username = CONCAT(username, '_old')
WHERE status = 0;</p>
<p>-- 使用函数
UPDATE users
SET email = LOWER(email);
</code></pre></p>
<h3>3.3.5 基于其他表更新</h3>
<pre><code class="language-sql">-- 根据另一个表的数据更新
UPDATE users u
INNER JOIN user_profiles p ON u.id = p.user_id
SET u.age = p.age
WHERE p.age IS NOT NULL;
<p>-- 示例：更新订单总金额
UPDATE orders o
SET o.total_amount = (
SELECT SUM(quantity * price)
FROM order_items
WHERE order_id = <a href="http://o.id">o.id</a>
);
</code></pre></p>
<h3>3.3.6 LIMIT限制更新行数</h3>
<pre><code class="language-sql">-- 只更新前10行
UPDATE users 
SET status = 0 
WHERE age &lt; 18 
LIMIT 10;
</code></pre>
<h3>3.3.7 安全模式</h3>
<pre><code class="language-sql">-- 查看安全模式状态
SHOW VARIABLES LIKE 'sql_safe_updates';
<p>-- 开启安全模式（防止误操作）
SET sql_safe_updates = 1;</p>
<p>-- 此时必须带WHERE条件且包含主键或索引列
UPDATE users SET status = 0;  -- 报错
UPDATE users SET status = 0 WHERE id = 1;  -- 正常</p>
<p>-- 关闭安全模式
SET sql_safe_updates = 0;
</code></pre></p>
<hr>
<h2>3.4 DELETE - 删除数据</h2>
<h3>3.4.1 基本语法</h3>
<pre><code class="language-sql">DELETE FROM table_name
WHERE condition;
</code></pre>
<p><strong>⚠️ 警告：</strong> 如果不加WHERE条件，会删除所有行！</p>
<h3>3.4.2 删除单行</h3>
<pre><code class="language-sql">-- 删除指定ID的用户
DELETE FROM users WHERE id = 1;
<p>-- 删除指定用户名的用户
DELETE FROM users WHERE username = 'zhangsan';
</code></pre></p>
<h3>3.4.3 删除多行</h3>
<pre><code class="language-sql">-- 删除所有状态为0的用户
DELETE FROM users WHERE status = 0;
<p>-- 删除年龄小于18的用户
DELETE FROM users WHERE age &lt; 18;</p>
<p>-- 删除所有用户（危险！）
DELETE FROM users;
</code></pre></p>
<h3>3.4.4 LIMIT限制删除行数</h3>
<pre><code class="language-sql">-- 只删除前10行
DELETE FROM users 
WHERE status = 0 
LIMIT 10;
<p>-- 删除最早的100条记录
DELETE FROM logs
ORDER BY create_time ASC
LIMIT 100;
</code></pre></p>
<h3>3.4.5 基于其他表删除</h3>
<pre><code class="language-sql">-- 删除没有订单的用户
DELETE FROM users 
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);
<p>-- 使用JOIN删除
DELETE u FROM users u
LEFT JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id
WHERE <a href="http://o.id">o.id</a> IS NULL;
</code></pre></p>
<hr>
<h2>3.5 TRUNCATE - 清空表</h2>
<h3>3.5.1 基本语法</h3>
<pre><code class="language-sql">TRUNCATE TABLE table_name;
</code></pre>
<h3>3.5.2 TRUNCATE vs DELETE</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>TRUNCATE</th>
<th>DELETE</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>速度</strong></td>
<td>快（直接删除表，重建）</td>
<td>慢（逐行删除）</td>
</tr>
<tr>
<td><strong>WHERE条件</strong></td>
<td>不支持</td>
<td>支持</td>
</tr>
<tr>
<td><strong>自增ID</strong></td>
<td>重置为1</td>
<td>不重置</td>
</tr>
<tr>
<td><strong>事务回滚</strong></td>
<td>不能回滚（DDL）</td>
<td>可以回滚（DML）</td>
</tr>
<tr>
<td><strong>触发器</strong></td>
<td>不触发</td>
<td>触发</td>
</tr>
<tr>
<td><strong>返回值</strong></td>
<td>不返回删除行数</td>
<td>返回删除行数</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">-- 创建测试表
CREATE TABLE test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
<p>INSERT INTO test (name) VALUES ('A'), ('B'), ('C');
SELECT * FROM test;  -- id: 1, 2, 3</p>
<p>-- 使用DELETE
DELETE FROM test;
INSERT INTO test (name) VALUES ('D');
SELECT * FROM test;  -- id: 4（继续增长）</p>
<p>-- 使用TRUNCATE
TRUNCATE TABLE test;
INSERT INTO test (name) VALUES ('E');
SELECT * FROM test;  -- id: 1（重置）
</code></pre></p>
<p><strong>使用建议：</strong></p>
<ul>
<li>清空整个表 → TRUNCATE（快）</li>
<li>删除部分数据 → DELETE</li>
<li>需要回滚 → DELETE</li>
<li>需要触发器 → DELETE</li>
</ul>
<hr>
<h2>3.6 实战案例</h2>
<h3>案例1：用户注册</h3>
<pre><code class="language-sql">-- 插入新用户
INSERT INTO users (username, password, email, phone) 
VALUES ('newuser', MD5('password123'), 'user@example.com', '13800138000');
<p>-- 获取插入的ID
SELECT LAST_INSERT_ID();</p>
<p>-- 插入用户资料
INSERT INTO user_profiles (user_id, real_name, age, gender)
VALUES (LAST_INSERT_ID(), '张三', 25, 'M');
</code></pre></p>
<h3>案例2：批量导入数据</h3>
<pre><code class="language-sql">-- 批量插入商品
INSERT INTO products (name, category_id, price, stock) VALUES
('iPhone 15', 1, 7999.00, 100),
('MacBook Pro', 1, 15999.00, 50),
('iPad Air', 1, 4999.00, 80),
('AirPods Pro', 1, 1999.00, 200),
('Apple Watch', 1, 3299.00, 150);
<p>-- 查看影响的行数
SELECT ROW_COUNT();
</code></pre></p>
<h3>案例3：更新库存</h3>
<pre><code class="language-sql">-- 下单时减少库存
UPDATE products
SET stock = stock - 1
WHERE id = 1 AND stock &gt; 0;
<p>-- 检查是否更新成功
SELECT ROW_COUNT();  -- 返回1表示成功，0表示库存不足</p>
<p>-- 更安全的方式：使用事务
START TRANSACTION;</p>
<p>UPDATE products
SET stock = stock - 1
WHERE id = 1 AND stock &gt; 0;</p>
<p>-- 检查库存是否足够
IF ROW_COUNT() = 0 THEN
ROLLBACK;
SELECT '库存不足' AS message;
ELSE
COMMIT;
SELECT '下单成功' AS message;
END IF;
</code></pre></p>
<h3>案例4：软删除</h3>
<pre><code class="language-sql">-- 不真正删除数据，只标记为已删除
UPDATE users
SET status = 0, deleted_at = NOW()
WHERE id = 1;
<p>-- 查询时过滤已删除的数据
SELECT * FROM users WHERE status = 1;</p>
<p>-- 恢复删除的数据
UPDATE users
SET status = 1, deleted_at = NULL
WHERE id = 1;
</code></pre></p>
<h3>案例5：数据迁移</h3>
<pre><code class="language-sql">-- 将旧表数据迁移到新表
INSERT INTO users_new (username, email, age, create_time)
SELECT username, email, age, create_time
FROM users_old
WHERE create_time &gt;= '2024-01-01';
<p>-- 查看迁移的行数
SELECT ROW_COUNT();
</code></pre></p>
<h3>案例6：去重</h3>
<pre><code class="language-sql">-- 删除重复的用户（保留ID最小的）
DELETE u1 FROM users u1
INNER JOIN users u2
WHERE u1.username = u2.username
  AND u1.id &gt; u2.id;
<p>-- 或使用子查询
DELETE FROM users
WHERE id NOT IN (
SELECT * FROM (
SELECT MIN(id) FROM users GROUP BY username
) AS temp
);
</code></pre></p>
<h3>案例7：批量更新</h3>
<pre><code class="language-sql">-- 批量更新用户等级
UPDATE users
SET level = CASE
    WHEN total_amount &gt;= 10000 THEN 'VIP'
    WHEN total_amount &gt;= 5000 THEN 'Gold'
    WHEN total_amount &gt;= 1000 THEN 'Silver'
    ELSE 'Bronze'
END;
<p>-- 根据年龄段更新分组
UPDATE users
SET age_group = CASE
WHEN age &lt; 18 THEN '未成年'
WHEN age BETWEEN 18 AND 30 THEN '青年'
WHEN age BETWEEN 31 AND 50 THEN '中年'
ELSE '老年'
END;
</code></pre></p>
<h3>案例8：定期清理日志</h3>
<pre><code class="language-sql">-- 删除30天前的日志
DELETE FROM logs
WHERE create_time &lt; DATE_SUB(NOW(), INTERVAL 30 DAY);
<p>-- 分批删除（避免锁表时间过长）
DELETE FROM logs
WHERE create_time &lt; DATE_SUB(NOW(), INTERVAL 30 DAY)
LIMIT 1000;</p>
<p>-- 循环执行直到删除完毕
WHILE (SELECT COUNT(*) FROM logs WHERE create_time &lt; DATE_SUB(NOW(), INTERVAL 30 DAY)) &gt; 0 DO
DELETE FROM logs
WHERE create_time &lt; DATE_SUB(NOW(), INTERVAL 30 DAY)
LIMIT 1000;</p>
<pre><code>-- 暂停一下，避免影响性能
SELECT SLEEP(0.1);
</code></pre>
<p>END WHILE;
</code></pre></p>
<hr>
<h2>3.7 性能优化建议</h2>
<h3>3.7.1 INSERT优化</h3>
<p><strong>1. 批量插入</strong></p>
<pre><code class="language-sql">-- ❌ 慢：逐条插入
INSERT INTO users (name) VALUES ('user1');
INSERT INTO users (name) VALUES ('user2');
INSERT INTO users (name) VALUES ('user3');
<p>-- ✅ 快：批量插入
INSERT INTO users (name) VALUES ('user1'), ('user2'), ('user3');
</code></pre></p>
<p><strong>2. 禁用索引和约束（大批量导入时）</strong></p>
<pre><code class="language-sql">-- 禁用索引
ALTER TABLE users DISABLE KEYS;
<p>-- 导入数据
INSERT INTO users ...</p>
<p>-- 启用索引
ALTER TABLE users ENABLE KEYS;
</code></pre></p>
<p><strong>3. 使用LOAD DATA（最快）</strong></p>
<pre><code class="language-sql">-- 从CSV文件导入
LOAD DATA INFILE '/path/to/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
</code></pre>
<p><strong>4. 调整参数</strong></p>
<pre><code class="language-sql">-- 增加批量插入缓冲区
SET bulk_insert_buffer_size = 256 * 1024 * 1024;  -- 256MB
</code></pre>
<h3>3.7.2 UPDATE优化</h3>
<p><strong>1. 使用索引</strong></p>
<pre><code class="language-sql">-- ❌ 慢：没有索引
UPDATE users SET status = 1 WHERE email = 'user@example.com';
<p>-- ✅ 快：在email上创建索引
CREATE INDEX idx_email ON users(email);
UPDATE users SET status = 1 WHERE email = 'user@example.com';
</code></pre></p>
<p><strong>2. 避免更新索引列</strong></p>
<pre><code class="language-sql">-- ❌ 慢：更新索引列
UPDATE users SET username = 'newname' WHERE id = 1;
<p>-- ✅ 快：更新非索引列
UPDATE users SET age = 26 WHERE id = 1;
</code></pre></p>
<p><strong>3. 分批更新</strong></p>
<pre><code class="language-sql">-- ❌ 慢：一次更新100万行
UPDATE users SET status = 1 WHERE create_time &lt; '2024-01-01';
<p>-- ✅ 快：分批更新
UPDATE users SET status = 1
WHERE create_time &lt; '2024-01-01'
LIMIT 1000;
-- 多次执行
</code></pre></p>
<h3>3.7.3 DELETE优化</h3>
<p><strong>1. 使用索引</strong></p>
<pre><code class="language-sql">-- 在WHERE条件列上创建索引
CREATE INDEX idx_status ON users(status);
DELETE FROM users WHERE status = 0;
</code></pre>
<p><strong>2. 分批删除</strong></p>
<pre><code class="language-sql">-- 分批删除，避免长时间锁表
DELETE FROM users WHERE status = 0 LIMIT 1000;
</code></pre>
<p><strong>3. 清空表用TRUNCATE</strong></p>
<pre><code class="language-sql">-- ❌ 慢
DELETE FROM users;
<p>-- ✅ 快
TRUNCATE TABLE users;
</code></pre></p>
<p><strong>4. 使用分区表</strong></p>
<pre><code class="language-sql">-- 删除整个分区（非常快）
ALTER TABLE logs DROP PARTITION p202401;
</code></pre>
<hr>
<h2>3.8 事务处理</h2>
<h3>3.8.1 基本事务</h3>
<pre><code class="language-sql">-- 开始事务
START TRANSACTION;
-- 或
BEGIN;
<p>-- 执行操作
INSERT INTO users (username, password) VALUES ('test', '123456');
UPDATE users SET age = 26 WHERE id = 1;
DELETE FROM users WHERE id = 2;</p>
<p>-- 提交事务
COMMIT;</p>
<p>-- 或回滚事务
ROLLBACK;
</code></pre></p>
<h3>3.8.2 保存点</h3>
<pre><code class="language-sql">START TRANSACTION;
<p>INSERT INTO users (username, password) VALUES ('user1', 'pass1');</p>
<p>-- 设置保存点
SAVEPOINT sp1;</p>
<p>INSERT INTO users (username, password) VALUES ('user2', 'pass2');</p>
<p>-- 回滚到保存点
ROLLBACK TO sp1;</p>
<p>-- 提交事务
COMMIT;
-- 结果：只插入了user1
</code></pre></p>
<h3>3.8.3 自动提交</h3>
<pre><code class="language-sql">-- 查看自动提交状态
SHOW VARIABLES LIKE 'autocommit';
<p>-- 关闭自动提交
SET autocommit = 0;</p>
<p>-- 此时每个语句都需要手动COMMIT
INSERT INTO users (username, password) VALUES ('test', '123456');
COMMIT;</p>
<p>-- 开启自动提交
SET autocommit = 1;
</code></pre></p>
<h3>3.8.4 实战：转账事务</h3>
<pre><code class="language-sql">-- 创建账户表
CREATE TABLE accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    UNIQUE KEY uk_user (user_id)
);
<p>-- 插入测试数据
INSERT INTO accounts (user_id, balance) VALUES (1, 1000.00), (2, 500.00);</p>
<p>-- 转账：用户1给用户2转账100元
START TRANSACTION;</p>
<p>-- 扣款
UPDATE accounts SET balance = balance - 100 WHERE user_id = 1;</p>
<p>-- 检查余额是否足够
SELECT balance FROM accounts WHERE user_id = 1;</p>
<p>-- 加款
UPDATE accounts SET balance = balance + 100 WHERE user_id = 2;</p>
<p>-- 提交事务
COMMIT;</p>
<p>-- 查看结果
SELECT * FROM accounts;
</code></pre></p>
<hr>
<h2>3.9 常见错误和解决方案</h2>
<h3>错误1：主键冲突</h3>
<pre><code class="language-sql">-- 错误
INSERT INTO users (id, username) VALUES (1, 'test');
-- ERROR 1062: Duplicate entry '1' for key 'PRIMARY'
<p>-- 解决方案1：使用INSERT IGNORE
INSERT IGNORE INTO users (id, username) VALUES (1, 'test');</p>
<p>-- 解决方案2：使用REPLACE
REPLACE INTO users (id, username) VALUES (1, 'test');</p>
<p>-- 解决方案3：使用ON DUPLICATE KEY UPDATE
INSERT INTO users (id, username) VALUES (1, 'test')
ON DUPLICATE KEY UPDATE username = 'test';
</code></pre></p>
<h3>错误2：外键约束</h3>
<pre><code class="language-sql">-- 错误：删除被引用的记录
DELETE FROM departments WHERE id = 1;
-- ERROR 1451: Cannot delete or update a parent row
<p>-- 解决方案1：先删除子表记录
DELETE FROM employees WHERE department_id = 1;
DELETE FROM departments WHERE id = 1;</p>
<p>-- 解决方案2：使用CASCADE
ALTER TABLE employees
DROP FOREIGN KEY fk_dept;</p>
<p>ALTER TABLE employees
ADD CONSTRAINT fk_dept
FOREIGN KEY (department_id) REFERENCES departments(id)
ON DELETE CASCADE;</p>
<p>-- 现在可以直接删除
DELETE FROM departments WHERE id = 1;
</code></pre></p>
<h3>错误3：数据截断</h3>
<pre><code class="language-sql">-- 错误：数据过长
INSERT INTO users (username) VALUES ('这是一个非常非常非常长的用户名超过了50个字符的限制');
-- ERROR 1406: Data too long for column 'username'
<p>-- 解决方案：截断数据
INSERT INTO users (username) VALUES (LEFT('这是一个非常非常非常长的用户名', 50));
</code></pre></p>
<h3>错误4：NULL值错误</h3>
<pre><code class="language-sql">-- 错误：NOT NULL列插入NULL
INSERT INTO users (username, password) VALUES ('test', NULL);
-- ERROR 1048: Column 'password' cannot be null
<p>-- 解决方案：提供默认值
INSERT INTO users (username, password) VALUES ('test', '');
</code></pre></p>
<hr>
<h2>3.10 小结</h2>
<p>本章学习了DML数据操作语言：</p>
<ul>
<li>✅ INSERT：插入数据（单行、多行、批量）</li>
<li>✅ UPDATE：更新数据（单行、多行、基于表达式）</li>
<li>✅ DELETE：删除数据（单行、多行、基于条件）</li>
<li>✅ TRUNCATE：清空表</li>
<li>✅ 事务处理（COMMIT、ROLLBACK、SAVEPOINT）</li>
<li>✅ 性能优化技巧</li>
<li>✅ 常见错误处理</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li>批量插入比逐条插入快10倍以上</li>
<li>UPDATE和DELETE必须加WHERE条件</li>
<li>清空表用TRUNCATE比DELETE快</li>
<li>使用事务保证数据一致性</li>
<li>开启sql_safe_updates防止误操作</li>
</ol>
<p><strong>最佳实践：</strong></p>
<ul>
<li>✅ 批量操作使用批量INSERT</li>
<li>✅ 重要操作使用事务</li>
<li>✅ 生产环境开启安全模式</li>
<li>✅ 大批量操作分批执行</li>
<li>✅ 软删除优于硬删除</li>
</ul>
<p><strong>下一章预告：</strong> SQL基础 - DQL数据查询语言</p>
<hr>
<h2>练习题</h2>
<h3>基础练习</h3>
<ol>
<li>插入10个用户到users表</li>
<li>更新所有年龄小于18的用户状态为0</li>
<li>删除所有状态为0的用户</li>
<li>使用TRUNCATE清空测试表</li>
</ol>
<h3>进阶练习</h3>
<ol>
<li>使用事务实现转账功能</li>
<li>批量插入1000条商品数据</li>
<li>实现软删除功能</li>
<li>使用ON DUPLICATE KEY UPDATE实现upsert</li>
<li>分批删除30天前的日志数据</li>
</ol>
<h3>实战练习</h3>
<p>创建一个简单的电商系统，实现：</p>
<ol>
<li>用户注册（插入用户和用户资料）</li>
<li>商品上架（批量插入商品）</li>
<li>下单（减少库存，创建订单）</li>
<li>取消订单（恢复库存，更新订单状态）</li>
<li>定期清理过期订单</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/01/04-sql-dql.html">第04章：SQL基础-DQL</a></p>
<pre><code>
<p></code></pre></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/mysql/01/02-sql-ddl.html" class="fn-left">上一篇：第02章：SQL基础</a>
            <a href="/mysql/01/04-sql-dql.html" class="fn-right">下一篇：第04章：SQL基础</a>
          </footer>
        </article>
      </main>
    </section>
</main>
        <aside>
    <section>
        <div class="module">
            <header><h2>专题</h2></header>
            <main class="topic-list">
                <a href="/topics/java-jvm.html">Java 与 JVM</a>
<a href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
<a href="/topics/ai-agent.html">AI、Agent 与本地模型</a>
<a href="/topics/mysql-data.html">MySQL 与数据架构</a>
<a href="/topics/linux-ops.html">Linux 运维与部署</a>
<a href="/topics/python-crawler.html">Python 爬虫与自动化</a>
<a href="/topics/middleware-distributed.html">中间件与分布式</a>
<a href="/topics/tools-blog.html">工具、效率与博客建设</a>
            </main>
        </div>
        <div class="module">
            <header><h2>标签</h2></header>
            <main>
                <a rel="tag" href="/tags/Python.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="24 篇文章">Python</a>
<a rel="tag" href="/tags/Java.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="18 篇文章">Java</a>
<a rel="tag" href="/tags/CentOS.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">CentOS</a>
<a rel="tag" href="/tags/MySQL.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">MySQL</a>
<a rel="tag" href="/tags/Python_20_E7_88_AC_E8_99_AB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="9 篇文章">Python 爬虫</a>
<a rel="tag" href="/tags/JVM.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="8 篇文章">JVM</a>
<a rel="tag" href="/tags/Linux.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Linux</a>
<a rel="tag" href="/tags/Scrapy.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Scrapy</a>
<a rel="tag" href="/tags/E5_9E_83_E5_9C_BE_E5_9B_9E_E6_94_B6_E7_AE_97_E6_B3_95.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">垃圾回收算法</a>
<a rel="tag" href="/tags/Spring_20Batch.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Batch</a>
<a rel="tag" href="/tags/Spring_20Boot.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Boot</a>
<a rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">大表优化</a>
<a rel="tag" href="/tags/E8_B0_83_E4_BC_98.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">调优</a>
<a rel="tag" href="/tags/E9_AB_98_E5_B9_B6_E5_8F_91.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">高并发</a>
<a rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">冷热分离</a>
<a rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">千万级表优化</a>
<a rel="tag" href="/tags/E7_BA_BF_E7_A8_8B.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">线程</a>
<a rel="tag" href="/tags/Nginx.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">Nginx</a>
<a rel="tag" href="/tags/E5_BE_85_E5_88_86_E7_B1_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">待分类</a>
<a rel="tag" href="/tags/E5_BC_80_E6_BA_90.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">开源</a>
            </main>
        </div>
        <div class="module tutorial-sidebar">
            <header><h2>教程中心</h2></header>
            <main>
                <a class="tutorial-sidebar-card" href="/mysql.html">
        <strong>MySQL</strong>
        <span>34 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/springboot4.html">
        <strong>Spring Boot 4</strong>
        <span>21 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/netty.html">
        <strong>Netty</strong>
        <span>16 篇教程</span>
    </a>
                <a class="tutorial-sidebar-more" href="/tutorials.html">查看全部教程 &raquo;</a>
            </main>
        </div>
        <div class="module meta">
            <header><h2 class="ft__center"><a href="https://github.com/jackssybin" target="_blank" rel="noopener">GitHub</a></h2></header>
            <main class="fn__clear">
                <img src="/images/sidebar-avatar.jpg" aria-label="88250">
                <div class="fn-right">
                    <a href="/archives.html">106 <span class="ft-gray">文章</span></a><br>
                    3 <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
    </section>
</aside>
    </div>
</div>
<footer class="footer fn-clear">
    &copy; 2026
    <a href="/">jackssybin 的个人博客</a>
    <br>
    Powered by <a href="https://github.com/adlered/bolo-solo" target="_blank" rel="noopener">Bolo</a>
    <span class="ft-warn">&heartsuit;</span>
    Theme bolo-9IPHP
    <sup>[<a href="https://github.com/9IPHP/9IPHP" target="_blank" rel="noopener">ref</a>]</sup>
    by <a href="http://vanessa.b3log.org" target="_blank" rel="noopener">Vanessa</a>
</footer>
