---
title: "第18章：SQL优化实战 ⭐⭐⭐⭐⭐"
permalink: "/mysql/05/18-sql.html"
description: "第18章：SQL优化实战 ⭐⭐⭐⭐⭐ 本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧 18.1 SQL优化的重要性 性能问题的根源： 80%的性能问题来自于SQL语句 一条慢SQL可能拖垮整个系统 SQL优化是成本最低、效果最好的优化手段 优化目标： 减少查询时间 降低CPU和内存消耗 减少磁盘I/O 提高并发能力 18.2 EX..."
---

<h1>第18章：SQL优化实战 ⭐⭐⭐⭐⭐</h1>
<blockquote>
<p>本章是MySQL性能优化的核心，必须精通EXPLAIN和各种SQL优化技巧</p>
</blockquote>
<h2>18.1 SQL优化的重要性</h2>
<p><strong>性能问题的根源：</strong></p>
<ul>
<li>80%的性能问题来自于SQL语句</li>
<li>一条慢SQL可能拖垮整个系统</li>
<li>SQL优化是成本最低、效果最好的优化手段</li>
</ul>
<p><strong>优化目标：</strong></p>
<ul>
<li>减少查询时间</li>
<li>降低CPU和内存消耗</li>
<li>减少磁盘I/O</li>
<li>提高并发能力</li>
</ul>
<hr>
<h2>18.2 EXPLAIN执行计划详解 ⭐⭐⭐⭐⭐</h2>
<h3>18.2.1 EXPLAIN基本用法</h3>
<pre><code class="language-sql">-- 查看SQL执行计划
EXPLAIN SELECT * FROM users WHERE age &gt; 20;
<p>-- 查看详细信息（MySQL 5.7+）
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age &gt; 20;</p>
<p>-- 查看实际执行情况（MySQL 8.0+）
EXPLAIN ANALYZE SELECT * FROM users WHERE age &gt; 20;
</code></pre></p>
<h3>18.2.2 EXPLAIN输出详解</h3>
<p><strong>示例输出：</strong></p>
<pre><code>+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
| id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra       |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
|  1 | SIMPLE      | users | ALL  | NULL          | NULL | NULL    | NULL | 1000 | Using where |
+----+-------------+-------+------+---------------+------+---------+------+------+-------------+
</code></pre>
<h4>1. id（查询序列号）</h4>
<ul>
<li><strong>相同id</strong>：执行顺序从上到下</li>
<li><strong>不同id</strong>：id越大越先执行</li>
<li><strong>id为NULL</strong>：通常是UNION结果</li>
</ul>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">EXPLAIN 
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount &gt; 1000
);
<p>-- 输出：
-- id=2: 子查询先执行
-- id=1: 外层查询后执行
</code></pre></p>
<h4>2. select_type（查询类型）</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SIMPLE</strong></td>
<td>简单查询，不包含子查询或UNION</td>
</tr>
<tr>
<td><strong>PRIMARY</strong></td>
<td>最外层查询</td>
</tr>
<tr>
<td><strong>SUBQUERY</strong></td>
<td>子查询</td>
</tr>
<tr>
<td><strong>DERIVED</strong></td>
<td>派生表（FROM子句中的子查询）</td>
</tr>
<tr>
<td><strong>UNION</strong></td>
<td>UNION中的第二个或后面的查询</td>
</tr>
<tr>
<td><strong>UNION RESULT</strong></td>
<td>UNION的结果</td>
</tr>
</tbody>
</table>
<h4>3. table（表名）</h4>
<p>显示这一行数据是关于哪张表的。</p>
<h4>4. type（访问类型）⭐⭐⭐⭐⭐</h4>
<p><strong>性能从好到差：</strong></p>
<pre><code>system &gt; const &gt; eq_ref &gt; ref &gt; range &gt; index &gt; ALL
</code></pre>
<p><strong>详细说明：</strong></p>
<table>
<thead>
<tr>
<th>type</th>
<th>说明</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>system</strong></td>
<td>表只有一行记录（系统表）</td>
<td>极少见</td>
</tr>
<tr>
<td><strong>const</strong></td>
<td>通过主键或唯一索引查询，最多返回一行</td>
<td><code>WHERE id=1</code></td>
</tr>
<tr>
<td><strong>eq_ref</strong></td>
<td>唯一索引扫描，对于每个索引键，表中只有一条记录匹配</td>
<td>JOIN时使用主键或唯一索引</td>
</tr>
<tr>
<td><strong>ref</strong></td>
<td>非唯一索引扫描，返回匹配某个单独值的所有行</td>
<td><code>WHERE name='张三'</code></td>
</tr>
<tr>
<td><strong>range</strong></td>
<td>索引范围扫描</td>
<td><code>WHERE id &gt; 100</code></td>
</tr>
<tr>
<td><strong>index</strong></td>
<td>全索引扫描</td>
<td>扫描整个索引树</td>
</tr>
<tr>
<td><strong>ALL</strong></td>
<td>全表扫描</td>
<td>⚠️ 需要优化</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">-- const（最优）
EXPLAIN SELECT * FROM users WHERE id = 1;
<p>-- ref（良好）
EXPLAIN SELECT * FROM users WHERE name = '张三';</p>
<p>-- range（可接受）
EXPLAIN SELECT * FROM users WHERE age &gt; 20;</p>
<p>-- ALL（需要优化）
EXPLAIN SELECT * FROM users WHERE YEAR(create_time) = 2024;
</code></pre></p>
<h4>5. possible_keys（可能使用的索引）</h4>
<p>显示查询可能使用的索引。</p>
<h4>6. key（实际使用的索引）⭐⭐⭐⭐</h4>
<ul>
<li><strong>NULL</strong>：没有使用索引，需要优化</li>
<li><strong>索引名</strong>：使用了该索引</li>
</ul>
<h4>7. key_len（索引长度）⭐⭐⭐</h4>
<ul>
<li>使用的索引字节数</li>
<li>在联合索引中，可以判断使用了几个字段</li>
</ul>
<p><strong>计算方法：</strong></p>
<pre><code>字符类型：
- char(n): n * 字符集字节数
- varchar(n): n * 字符集字节数 + 2（存储长度）
<p>数字类型：</p>
<ul>
<li>int: 4字节</li>
<li>bigint: 8字节</li>
<li>datetime: 8字节</li>
</ul>
<p>NULL：</p>
<ul>
<li>允许NULL: +1字节
</code></pre></li>
</ul>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">-- 联合索引 (name, age)
-- name: varchar(50), utf8mb4 (4字节)
-- age: int (4字节)
<p>-- 只使用name
EXPLAIN SELECT * FROM users WHERE name = '张三';
-- key_len = 50*4 + 2 + 1 = 203</p>
<p>-- 使用name和age
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20;
-- key_len = 50*4 + 2 + 1 + 4 + 1 = 208
</code></pre></p>
<h4>8. ref（索引的哪一列被使用）</h4>
<p>显示索引的哪一列被使用了，如果可能的话，是一个常数。</p>
<h4>9. rows（扫描行数）⭐⭐⭐⭐</h4>
<ul>
<li>预计需要扫描的行数</li>
<li><strong>越少越好</strong></li>
<li>只是估算值，不是精确值</li>
</ul>
<h4>10. Extra（额外信息）⭐⭐⭐⭐⭐</h4>
<table>
<thead>
<tr>
<th>Extra</th>
<th>说明</th>
<th>优化建议</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Using index</strong></td>
<td>使用覆盖索引，不需要回表</td>
<td>✅ 最优</td>
</tr>
<tr>
<td><strong>Using where</strong></td>
<td>使用WHERE过滤</td>
<td>✅ 正常</td>
</tr>
<tr>
<td><strong>Using index condition</strong></td>
<td>使用索引下推</td>
<td>✅ 良好</td>
</tr>
<tr>
<td><strong>Using filesort</strong></td>
<td>使用文件排序</td>
<td>⚠️ 需要优化</td>
</tr>
<tr>
<td><strong>Using temporary</strong></td>
<td>使用临时表</td>
<td>⚠️ 需要优化</td>
</tr>
<tr>
<td><strong>Using join buffer</strong></td>
<td>使用连接缓冲</td>
<td>⚠️ 考虑添加索引</td>
</tr>
<tr>
<td><strong>Impossible WHERE</strong></td>
<td>WHERE条件总是false</td>
<td>⚠️ 检查SQL逻辑</td>
</tr>
<tr>
<td><strong>Select tables optimized away</strong></td>
<td>优化器优化掉了</td>
<td>✅ 很好</td>
</tr>
</tbody>
</table>
<p><strong>重点关注：</strong></p>
<p><strong>Using filesort（文件排序）：</strong></p>
<pre><code class="language-sql">-- 不好：没有使用索引排序
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using filesort
<p>-- 优化：在age上创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using index
</code></pre></p>
<p><strong>Using temporary（使用临时表）：</strong></p>
<pre><code class="language-sql">-- 不好：GROUP BY字段没有索引
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using temporary; Using filesort
<p>-- 优化：在age上创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using index
</code></pre></p>
<p><strong>Using index（覆盖索引）：</strong></p>
<pre><code class="language-sql">-- 创建联合索引
CREATE INDEX idx_name_age ON users(name, age);
<p>-- 覆盖索引：只查询索引中的字段
EXPLAIN SELECT name, age FROM users WHERE name = '张三';
-- Extra: Using index（不需要回表，性能最优）</p>
<p>-- 非覆盖索引：查询了索引外的字段
EXPLAIN SELECT name, age, email FROM users WHERE name = '张三';
-- Extra: NULL（需要回表查询email）
</code></pre></p>
<h3>18.2.3 EXPLAIN实战案例</h3>
<h4>案例1：全表扫描优化</h4>
<p><strong>问题SQL：</strong></p>
<pre><code class="language-sql">EXPLAIN SELECT * FROM orders WHERE YEAR(create_time) = 2024;
<p>-- 结果：
-- type: ALL
-- rows: 1000000
-- Extra: Using where
</code></pre></p>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 方法1：改写SQL，避免在索引列上使用函数
EXPLAIN SELECT * FROM orders 
WHERE create_time &gt;= '2024-01-01' AND create_time &lt; '2025-01-01';
<p>-- 结果：
-- type: range
-- rows: 50000
-- Extra: Using index condition</p>
<p>-- 方法2：创建函数索引（MySQL 8.0+）
CREATE INDEX idx_year ON orders((YEAR(create_time)));
</code></pre></p>
<h4>案例2：索引失效</h4>
<p><strong>问题SQL：</strong></p>
<pre><code class="language-sql">-- 联合索引 (name, age, city)
CREATE INDEX idx_name_age_city ON users(name, age, city);
<p>-- 索引失效：跳过了age
EXPLAIN SELECT * FROM users WHERE name = '张三' AND city = '北京';</p>
<p>-- 结果：
-- key_len: 203（只使用了name）
-- 没有使用age和city
</code></pre></p>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 遵循最左前缀原则
EXPLAIN SELECT * FROM users WHERE name = '张三' AND age = 20 AND city = '北京';
<p>-- 结果：
-- key_len: 完整使用索引</p>
<p>-- 或者调整索引顺序
CREATE INDEX idx_name_city ON users(name, city);
</code></pre></p>
<hr>
<h2>18.3 SQL优化的一般步骤</h2>
<h3>步骤1：发现慢SQL</h3>
<p><strong>方法1：慢查询日志</strong></p>
<pre><code class="language-sql">-- 开启慢查询日志
SET GLOBAL slow_query_log=1;
SET GLOBAL long_query_time=2;
<p>-- 分析慢查询日志
pt-query-digest /var/lib/mysql/slow.log
</code></pre></p>
<p><strong>方法2：SHOW PROCESSLIST</strong></p>
<pre><code class="language-sql">-- 查看当前正在执行的SQL
SHOW PROCESSLIST;
<p>-- 查看执行时间超过2秒的SQL
SELECT * FROM information_schema.PROCESSLIST
WHERE TIME &gt; 2 AND COMMAND != 'Sleep';
</code></pre></p>
<p><strong>方法3：Performance Schema</strong></p>
<pre><code class="language-sql">-- 查看执行最慢的SQL
SELECT
    DIGEST_TEXT,
    COUNT_STAR,
    AVG_TIMER_WAIT/1000000000000 AS avg_sec,
    MAX_TIMER_WAIT/1000000000000 AS max_sec
FROM performance_schema.events_statements_summary_by_digest
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 10;
</code></pre>
<h3>步骤2：分析SQL执行计划</h3>
<pre><code class="language-sql">-- 使用EXPLAIN分析
EXPLAIN SELECT * FROM users WHERE age &gt; 20;
<p>-- 关注以下指标：
-- 1. type: 是否为ALL（全表扫描）
-- 2. key: 是否使用了索引
-- 3. rows: 扫描行数是否过多
-- 4. Extra: 是否有Using filesort、Using temporary
</code></pre></p>
<h3>步骤3：优化SQL</h3>
<p>根据执行计划，采取相应的优化措施。</p>
<h3>步骤4：验证优化效果</h3>
<pre><code class="language-sql">-- 对比优化前后的执行时间
SET profiling=1;
<p>-- 执行SQL
SELECT * FROM users WHERE age &gt; 20;</p>
<p>-- 查看执行时间
SHOW PROFILES;</p>
<p>-- 查看详细信息
SHOW PROFILE FOR QUERY 1;
</code></pre></p>
<hr>
<h2>18.4 常见SQL优化技巧</h2>
<h3>18.4.1 避免SELECT *</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：查询所有字段
SELECT * FROM users WHERE id = 1;
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：只查询需要的字段
SELECT id, name, age FROM users WHERE id = 1;
</code></pre>
<p><strong>原因：</strong></p>
<ol>
<li>减少网络传输</li>
<li>可能使用覆盖索引，避免回表</li>
<li>减少内存消耗</li>
</ol>
<h3>18.4.2 避免在WHERE中使用函数</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：索引失效
SELECT * FROM orders WHERE YEAR(create_time) = 2024;
SELECT * FROM users WHERE UPPER(name) = 'ZHANGSAN';
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：改写SQL
SELECT * FROM orders
WHERE create_time &gt;= '2024-01-01' AND create_time &lt; '2025-01-01';
<p>-- 或者存储大写字段
ALTER TABLE users ADD COLUMN name_upper VARCHAR(100);
UPDATE users SET name_upper = UPPER(name);
CREATE INDEX idx_name_upper ON users(name_upper);
</code></pre></p>
<h3>18.4.3 避免隐式类型转换</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- phone字段是VARCHAR类型
-- 不好：隐式转换，索引失效
SELECT * FROM users WHERE phone = 13800138000;
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：使用正确的类型
SELECT * FROM users WHERE phone = '13800138000';
</code></pre>
<p><strong>验证：</strong></p>
<pre><code class="language-sql">EXPLAIN SELECT * FROM users WHERE phone = 13800138000;
-- type: ALL（全表扫描）
<p>EXPLAIN SELECT * FROM users WHERE phone = '13800138000';
-- type: ref（使用索引）
</code></pre></p>
<h3>18.4.4 避免使用!=或&lt;&gt;</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：可能不走索引
SELECT * FROM users WHERE status != 1;
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：使用IN或其他条件
SELECT * FROM users WHERE status IN (0, 2, 3);
<p>-- 或者使用NOT IN（小心NULL）
SELECT * FROM users WHERE status NOT IN (1);
</code></pre></p>
<h3>18.4.5 避免使用OR</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：可能不走索引
SELECT * FROM users WHERE name = '张三' OR age = 20;
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：使用UNION ALL
SELECT * FROM users WHERE name = '张三'
UNION ALL
SELECT * FROM users WHERE age = 20 AND name != '张三';
<p>-- 或者使用IN（如果是同一字段）
SELECT * FROM users WHERE id IN (1, 2, 3);
</code></pre></p>
<h3>18.4.6 避免使用LIKE '%xxx'</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：前导模糊查询，索引失效
SELECT * FROM users WHERE name LIKE '%张%';
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：后导模糊查询，可以使用索引
SELECT * FROM users WHERE name LIKE '张%';
<p>-- 如果必须前导模糊查询，考虑：
-- 1. 使用全文索引
-- 2. 使用ElasticSearch等搜索引擎
-- 3. 使用反向索引
</code></pre></p>
<h3>18.4.7 优化IN和NOT IN</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：IN中的值过多
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 10000);
<p>-- 不好：NOT IN可能不走索引，且有NULL陷阱
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blacklist);
</code></pre></p>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：分批查询
SELECT * FROM users WHERE id IN (1, 2, 3, ..., 1000);
<p>-- 好：使用JOIN代替NOT IN
SELECT u.* FROM users u
LEFT JOIN blacklist b ON <a href="http://u.id">u.id</a> = b.user_id
WHERE b.user_id IS NULL;</p>
<p>-- 好：使用NOT EXISTS
SELECT * FROM users u
WHERE NOT EXISTS (
SELECT 1 FROM blacklist b WHERE b.user_id = <a href="http://u.id">u.id</a>
);
</code></pre></p>
<h3>18.4.8 优化ORDER BY</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：没有索引，产生filesort
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using filesort
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 方法1：创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT * FROM users ORDER BY age;
-- Extra: Using index
<p>-- 方法2：利用联合索引
CREATE INDEX idx_age_name ON users(age, name);
EXPLAIN SELECT * FROM users ORDER BY age, name;
-- Extra: Using index</p>
<p>-- 方法3：如果必须filesort，增加sort_buffer_size
SET SESSION sort_buffer_size = 2097152; -- 2MB
</code></pre></p>
<p><strong>ORDER BY优化原则：</strong></p>
<ol>
<li>ORDER BY字段要有索引</li>
<li>多字段排序时，顺序要和索引顺序一致</li>
<li>排序方向要一致（都是ASC或都是DESC）</li>
</ol>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">-- 索引：idx_age_name (age, name)
<p>-- ✅ 可以使用索引
ORDER BY age, name
ORDER BY age
ORDER BY age DESC, name DESC</p>
<p>-- ❌ 不能使用索引
ORDER BY name, age  -- 顺序不对
ORDER BY age ASC, name DESC  -- 方向不一致
</code></pre></p>
<h3>18.4.9 优化GROUP BY</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：产生临时表和filesort
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using temporary; Using filesort
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 方法1：创建索引
CREATE INDEX idx_age ON users(age);
EXPLAIN SELECT age, COUNT(*) FROM users GROUP BY age;
-- Extra: Using index
<p>-- 方法2：如果不需要排序，使用ORDER BY NULL
SELECT age, COUNT(*) FROM users GROUP BY age ORDER BY NULL;
</code></pre></p>
<h3>18.4.10 优化LIMIT分页</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：深分页，扫描大量数据
SELECT * FROM users ORDER BY id LIMIT 1000000, 10;
-- 需要扫描1000010行数据
</code></pre>
<p><strong>优化方法1：使用子查询</strong></p>
<pre><code class="language-sql">-- 好：先查询ID，再关联
SELECT * FROM users
WHERE id &gt;= (SELECT id FROM users ORDER BY id LIMIT 1000000, 1)
LIMIT 10;
</code></pre>
<p><strong>优化方法2：使用上次查询的最大ID</strong></p>
<pre><code class="language-sql">-- 第一页
SELECT * FROM users ORDER BY id LIMIT 10;
-- 假设最后一条记录的id是10
<p>-- 第二页
SELECT * FROM users WHERE id &gt; 10 ORDER BY id LIMIT 10;
-- 假设最后一条记录的id是20</p>
<p>-- 第三页
SELECT * FROM users WHERE id &gt; 20 ORDER BY id LIMIT 10;
</code></pre></p>
<p><strong>优化方法3：使用延迟关联</strong></p>
<pre><code class="language-sql">-- 好：先查询ID（覆盖索引），再关联
SELECT u.* FROM users u
INNER JOIN (
    SELECT id FROM users ORDER BY id LIMIT 1000000, 10
) AS t ON u.id = t.id;
</code></pre>
<hr>
<h2>18.5 JOIN优化</h2>
<h3>18.5.1 JOIN的执行原理</h3>
<p><strong>嵌套循环连接（Nested-Loop Join）：</strong></p>
<pre><code>for each row in t1 matching range {
    for each row in t2 matching reference key {
        if row satisfies join conditions, send to client
    }
}
</code></pre>
<p><strong>驱动表和被驱动表：</strong></p>
<ul>
<li><strong>驱动表</strong>：外层循环的表（小表）</li>
<li><strong>被驱动表</strong>：内层循环的表（大表）</li>
</ul>
<p><strong>优化原则：</strong></p>
<ol>
<li>小表驱动大表</li>
<li>被驱动表的JOIN字段要有索引</li>
</ol>
<h3>18.5.2 JOIN优化技巧</h3>
<p><strong>技巧1：小表驱动大表</strong></p>
<pre><code class="language-sql">-- 假设：users表100万行，orders表1000行
<p>-- 不好：大表驱动小表
SELECT * FROM users u
INNER JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id;</p>
<p>-- 好：小表驱动大表
SELECT * FROM orders o
INNER JOIN users u ON o.user_id = <a href="http://u.id">u.id</a>;
</code></pre></p>
<p><strong>技巧2：被驱动表JOIN字段要有索引</strong></p>
<pre><code class="language-sql">-- 创建索引
CREATE INDEX idx_user_id ON orders(user_id);
<p>-- 验证
EXPLAIN SELECT * FROM orders o
INNER JOIN users u ON o.user_id = <a href="http://u.id">u.id</a>;
-- type: ref（使用索引）
</code></pre></p>
<p><strong>技巧3：避免JOIN太多表</strong></p>
<pre><code class="language-sql">-- 不好：JOIN太多表
SELECT * FROM t1
JOIN t2 ON t1.id = t2.t1_id
JOIN t3 ON t2.id = t3.t2_id
JOIN t4 ON t3.id = t4.t3_id
JOIN t5 ON t4.id = t5.t4_id;
<p>-- 建议：不超过3个表
-- 如果必须JOIN多表，考虑：
-- 1. 分步查询
-- 2. 数据冗余
-- 3. 缓存
</code></pre></p>
<p><strong>技巧4：使用STRAIGHT_JOIN控制JOIN顺序</strong></p>
<pre><code class="language-sql">-- 强制指定JOIN顺序
SELECT * FROM orders
STRAIGHT_JOIN users ON orders.user_id = users.id;
</code></pre>
<h3>18.5.3 子查询优化</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：子查询可能产生临时表
SELECT * FROM users WHERE id IN (
    SELECT user_id FROM orders WHERE amount &gt; 1000
);
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：改写为JOIN
SELECT DISTINCT u.* FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.amount &gt; 1000;
<p>-- 或使用EXISTS
SELECT * FROM users u
WHERE EXISTS (
SELECT 1 FROM orders o
WHERE o.user_id = <a href="http://u.id">u.id</a> AND o.amount &gt; 1000
);
</code></pre></p>
<p><strong>IN vs EXISTS：</strong></p>
<ul>
<li><strong>IN</strong>：适合外表大、内表小的情况</li>
<li><strong>EXISTS</strong>：适合外表小、内表大的情况</li>
</ul>
<hr>
<h2>18.6 COUNT优化</h2>
<h3>18.6.1 COUNT的几种用法</h3>
<pre><code class="language-sql">-- COUNT(*)：统计行数（推荐）
SELECT COUNT(*) FROM users;
<p>-- COUNT(1)：统计行数（与COUNT(*)性能相同）
SELECT COUNT(1) FROM users;</p>
<p>-- COUNT(字段)：统计字段非NULL的行数
SELECT COUNT(email) FROM users;</p>
<p>-- COUNT(DISTINCT 字段)：统计字段去重后的行数
SELECT COUNT(DISTINCT city) FROM users;
</code></pre></p>
<p><strong>性能对比：</strong></p>
<pre><code>COUNT(*) ≈ COUNT(1) &gt; COUNT(主键) &gt; COUNT(字段)
</code></pre>
<h3>18.6.2 COUNT优化技巧</h3>
<p><strong>技巧1：使用覆盖索引</strong></p>
<pre><code class="language-sql">-- 不好：全表扫描
SELECT COUNT(*) FROM users;
<p>-- 好：使用覆盖索引
CREATE INDEX idx_id ON users(id);
SELECT COUNT(*) FROM users;
-- 扫描索引树，比扫描数据表快
</code></pre></p>
<p><strong>技巧2：使用近似值</strong></p>
<pre><code class="language-sql">-- 对于InnoDB，使用近似值
SELECT TABLE_ROWS FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mydb' AND TABLE_NAME = 'users';
-- 注意：这是估算值，不精确
</code></pre>
<p><strong>技巧3：维护计数表</strong></p>
<pre><code class="language-sql">-- 创建计数表
CREATE TABLE user_count (
    count INT NOT NULL
) ENGINE=InnoDB;
<p>INSERT INTO user_count VALUES (0);</p>
<p>-- 插入用户时更新计数
START TRANSACTION;
INSERT INTO users (name, age) VALUES ('张三', 20);
UPDATE user_count SET count = count + 1;
COMMIT;</p>
<p>-- 查询总数
SELECT count FROM user_count;
-- 非常快
</code></pre></p>
<p><strong>技巧4：使用Redis缓存</strong></p>
<pre><code class="language-python"># 伪代码
def get_user_count():
    count = redis.get('user_count')
    if count is None:
        count = db.query('SELECT COUNT(*) FROM users')
        redis.set('user_count', count, expire=3600)
    return count
</code></pre>
<hr>
<h2>18.7 INSERT优化</h2>
<h3>18.7.1 批量插入</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：逐条插入
INSERT INTO users (name, age) VALUES ('张三', 20);
INSERT INTO users (name, age) VALUES ('李四', 21);
INSERT INTO users (name, age) VALUES ('王五', 22);
-- 每次插入都要建立连接、提交事务
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：批量插入
INSERT INTO users (name, age) VALUES
('张三', 20),
('李四', 21),
('王五', 22);
<p>-- 建议：每批不超过1000条
</code></pre></p>
<h3>18.7.2 使用LOAD DATA</h3>
<p><strong>最快的导入方式：</strong></p>
<pre><code class="language-sql">-- 从CSV文件导入
LOAD DATA INFILE '/tmp/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(name, age);
<p>-- 比INSERT快10-20倍
</code></pre></p>
<h3>18.7.3 关闭自动提交</h3>
<pre><code class="language-sql">-- 关闭自动提交
SET autocommit=0;
<p>-- 批量插入
INSERT INTO users (name, age) VALUES ('张三', 20);
INSERT INTO users (name, age) VALUES ('李四', 21);
-- ... 更多插入</p>
<p>-- 手动提交
COMMIT;</p>
<p>-- 恢复自动提交
SET autocommit=1;
</code></pre></p>
<h3>18.7.4 禁用索引（大批量导入时）</h3>
<pre><code class="language-sql">-- 禁用索引
ALTER TABLE users DISABLE KEYS;
<p>-- 批量插入
INSERT INTO users (name, age) VALUES ...;</p>
<p>-- 启用索引
ALTER TABLE users ENABLE KEYS;
</code></pre></p>
<hr>
<h2>18.8 UPDATE和DELETE优化</h2>
<h3>18.8.1 批量操作</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：逐条更新
UPDATE users SET status=1 WHERE id=1;
UPDATE users SET status=1 WHERE id=2;
-- ...
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：批量更新
UPDATE users SET status=1 WHERE id IN (1, 2, 3, ...);
<p>-- 或使用范围
UPDATE users SET status=1 WHERE id BETWEEN 1 AND 1000;
</code></pre></p>
<h3>18.8.2 分批操作（大批量）</h3>
<p><strong>问题：</strong></p>
<pre><code class="language-sql">-- 不好：一次更新100万行，锁表时间长
UPDATE users SET status=1 WHERE create_time &lt; '2020-01-01';
</code></pre>
<p><strong>优化：</strong></p>
<pre><code class="language-sql">-- 好：分批更新，每批1000行
DELIMITER $$
CREATE PROCEDURE batch_update()
BEGIN
    DECLARE done INT DEFAULT 0;
    WHILE done = 0 DO
        UPDATE users SET status=1
        WHERE create_time &lt; '2020-01-01' AND status=0
        LIMIT 1000;
<pre><code>    IF ROW_COUNT() = 0 THEN
        SET done = 1;
    END IF;
<pre><code>-- 休息一下，避免影响其他查询
DO SLEEP(0.1);
</code></pre>
<p>END WHILE;
</code></pre></p>
<p>END$$
DELIMITER ;</p>
<p>CALL batch_update();
</code></pre></p>
<h3>18.8.3 避免全表更新</h3>
<pre><code class="language-sql">-- 危险：全表更新
UPDATE users SET status=1;
<p>-- 建议：加WHERE条件
UPDATE users SET status=1 WHERE status=0;
</code></pre></p>
<hr>
<h2>18.9 SQL优化工具</h2>
<h3>18.9.1 慢查询分析工具</h3>
<p><strong>mysqldumpslow：</strong></p>
<pre><code class="language-bash">mysqldumpslow -s t -t 10 /var/lib/mysql/slow.log
</code></pre>
<p><strong>pt-query-digest（推荐）：</strong></p>
<pre><code class="language-bash">pt-query-digest /var/lib/mysql/slow.log
</code></pre>
<h3>18.9.2 EXPLAIN工具</h3>
<p><strong>MySQL Workbench：</strong></p>
<ul>
<li>图形化显示执行计划</li>
<li>可视化分析</li>
</ul>
<p><strong>EXPLAIN FORMAT=JSON：</strong></p>
<pre><code class="language-sql">EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age &gt; 20\G
</code></pre>
<h3>18.9.3 性能分析工具</h3>
<p><strong>SHOW PROFILE：</strong></p>
<pre><code class="language-sql">SET profiling=1;
SELECT * FROM users WHERE age &gt; 20;
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
</code></pre>
<p><strong>Performance Schema：</strong></p>
<pre><code class="language-sql">-- 查看最慢的SQL
SELECT * FROM sys.statement_analysis
ORDER BY avg_latency DESC LIMIT 10;
</code></pre>
<hr>
<h2>18.10 SQL优化检查清单</h2>
<p><strong>执行计划检查：</strong></p>
<ul>
<li>[ ] type是否为ALL（全表扫描）</li>
<li>[ ] key是否为NULL（未使用索引）</li>
<li>[ ] rows是否过大</li>
<li>[ ] Extra是否有Using filesort</li>
<li>[ ] Extra是否有Using temporary</li>
</ul>
<p><strong>SQL语句检查：</strong></p>
<ul>
<li>[ ] 是否使用了SELECT *</li>
<li>[ ] WHERE条件是否在索引列上使用了函数</li>
<li>[ ] 是否有隐式类型转换</li>
<li>[ ] 是否使用了!=或&lt;&gt;</li>
<li>[ ] 是否使用了OR</li>
<li>[ ] 是否使用了LIKE '%xxx'</li>
<li>[ ] ORDER BY字段是否有索引</li>
<li>[ ] GROUP BY字段是否有索引</li>
<li>[ ] JOIN字段是否有索引</li>
<li>[ ] 是否有深分页问题</li>
</ul>
<p><strong>索引检查：</strong></p>
<ul>
<li>[ ] WHERE条件字段是否有索引</li>
<li>[ ] JOIN字段是否有索引</li>
<li>[ ] ORDER BY字段是否有索引</li>
<li>[ ] GROUP BY字段是否有索引</li>
<li>[ ] 是否遵循最左前缀原则</li>
<li>[ ] 是否使用了覆盖索引</li>
</ul>
<hr>
<h2>18.11 小结</h2>
<p>本章学习了SQL优化的核心内容：</p>
<ul>
<li>✅ <strong>EXPLAIN执行计划</strong>：必须精通，面试高频</li>
<li>✅ <strong>SQL优化步骤</strong>：发现、分析、优化、验证</li>
<li>✅ <strong>常见优化技巧</strong>：避免全表扫描、使用索引、优化JOIN等</li>
<li>✅ <strong>特定场景优化</strong>：分页、COUNT、批量操作等</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li>EXPLAIN的每个字段含义</li>
<li>type的各种类型及性能差异</li>
<li>Extra中的关键信息</li>
<li>索引失效的场景</li>
<li>深分页优化方案</li>
</ol>
<p><strong>下一章预告：</strong> 索引优化进阶</p>
<hr>
<h2>练习题</h2>
<ol>
<li>使用EXPLAIN分析一个慢SQL，找出性能瓶颈</li>
<li>优化一个深分页查询（LIMIT 1000000, 10）</li>
<li>将一个使用子查询的SQL改写为JOIN</li>
<li>优化一个产生filesort的ORDER BY查询</li>
<li>编写一个批量更新的存储过程</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/05/19.html">第19章：索引优化进阶</a></p>
