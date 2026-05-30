---
title: "第10章：MySQL架构与执行流程"
permalink: "/mysql/02/10-mysql.html"
description: "第10章：MySQL架构与执行流程 深入理解MySQL的整体架构和SQL执行流程，是成为MySQL专家的必经之路 10.1 MySQL整体架构 ⭐⭐⭐⭐⭐ 10.1.1 MySQL架构分层 10.1.2 各层功能详解 1. 连接层（Connection Layer） 客户端连接处理 用户认证和权限验证 连接池管理 线程管理 2. 服务层（SQL Layer）..."
---

<h1>第10章：MySQL架构与执行流程</h1>
<blockquote>
<p>深入理解MySQL的整体架构和SQL执行流程，是成为MySQL专家的必经之路</p>
</blockquote>
<h2>10.1 MySQL整体架构 ⭐⭐⭐⭐⭐</h2>
<h3>10.1.1 MySQL架构分层</h3>
<pre><code>┌─────────────────────────────────────────┐
│         客户端（Client）                 │
│   MySQL Workbench、Navicat、应用程序     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         连接层（Connection Layer）       │
│   连接处理、认证、安全                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         服务层（SQL Layer）              │
│   ┌──────────────────────────────────┐  │
│   │  查询缓存（Query Cache）         │  │
│   └──────────────────────────────────┘  │
│   ┌──────────────────────────────────┐  │
│   │  解析器（Parser）                │  │
│   └──────────────────────────────────┘  │
│   ┌──────────────────────────────────┐  │
│   │  优化器（Optimizer）             │  │
│   └──────────────────────────────────┘  │
│   ┌──────────────────────────────────┐  │
│   │  执行器（Executor）              │  │
│   └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      存储引擎层（Storage Engine Layer）  │
│   InnoDB、MyISAM、Memory等               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         文件系统（File System）          │
│   数据文件、日志文件、配置文件           │
└─────────────────────────────────────────┘
</code></pre>
<h3>10.1.2 各层功能详解</h3>
<p><strong>1. 连接层（Connection Layer）</strong></p>
<ul>
<li>客户端连接处理</li>
<li>用户认证和权限验证</li>
<li>连接池管理</li>
<li>线程管理</li>
</ul>
<p><strong>2. 服务层（SQL Layer）</strong></p>
<ul>
<li>查询缓存（MySQL 5.7有，8.0移除）</li>
<li>SQL解析和语法分析</li>
<li>SQL优化</li>
<li>SQL执行</li>
</ul>
<p><strong>3. 存储引擎层（Storage Engine Layer）</strong></p>
<ul>
<li>数据存储和读取</li>
<li>索引管理</li>
<li>事务管理</li>
<li>锁管理</li>
</ul>
<p><strong>4. 文件系统层</strong></p>
<ul>
<li>数据文件存储</li>
<li>日志文件存储</li>
<li>配置文件管理</li>
</ul>
<hr>
<h2>10.2 连接器（Connector）</h2>
<h3>10.2.1 连接过程</h3>
<pre><code class="language-sql">-- 1. 客户端发起连接
mysql -h localhost -u root -p
<p>-- 2. 服务器验证用户名和密码
-- 3. 验证成功后，查询用户权限
-- 4. 建立连接，分配连接ID</p>
<p>-- 查看当前连接
SHOW PROCESSLIST;</p>
<p>-- 查看连接数
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
</code></pre></p>
<h3>10.2.2 连接管理</h3>
<pre><code class="language-sql">-- 查看最大连接数
SHOW VARIABLES LIKE 'max_connections';
<p>-- 设置最大连接数
SET GLOBAL max_connections = 500;</p>
<p>-- 查看连接超时时间
SHOW VARIABLES LIKE 'wait_timeout';
SHOW VARIABLES LIKE 'interactive_timeout';</p>
<p>-- 设置连接超时时间（秒）
SET GLOBAL wait_timeout = 28800;  -- 8小时
SET GLOBAL interactive_timeout = 28800;
</code></pre></p>
<h3>10.2.3 连接池</h3>
<pre><code class="language-sql">-- MySQL没有内置连接池，需要应用层实现
-- 常用连接池：
-- - Java: HikariCP、Druid、C3P0
-- - Python: SQLAlchemy、PyMySQL
-- - PHP: PDO、MySQLi
<p>-- 连接池的好处：
-- 1. 减少连接创建和销毁的开销
-- 2. 控制并发连接数
-- 3. 提高性能
</code></pre></p>
<hr>
<h2>10.3 查询缓存（Query Cache）⚠️</h2>
<h3>10.3.1 查询缓存概述</h3>
<pre><code class="language-sql">-- ⚠️ 注意：MySQL 8.0已移除查询缓存
-- MySQL 5.7仍然支持，但不推荐使用
<p>-- 查询缓存的工作原理：
-- 1. 客户端发送SQL
-- 2. 服务器计算SQL的hash值
-- 3. 查找缓存中是否有相同的hash
-- 4. 如果有，直接返回缓存结果
-- 5. 如果没有，执行SQL并缓存结果</p>
<p>-- 查看查询缓存配置
SHOW VARIABLES LIKE 'query_cache%';</p>
<p>-- 查看查询缓存状态
SHOW STATUS LIKE 'Qcache%';
</code></pre></p>
<h3>10.3.2 查询缓存的问题</h3>
<pre><code class="language-sql">-- 问题1：缓存失效频繁
-- 表数据发生任何变化，该表的所有缓存都会失效
UPDATE users SET age = 26 WHERE id = 1;  -- 所有users表的缓存失效
<p>-- 问题2：SQL必须完全相同
-- 以下两个SQL不会命中同一个缓存
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE id=1;  -- 空格不同</p>
<p>-- 问题3：性能问题
-- 缓存的维护成本高于收益</p>
<p>-- 建议：
-- ✅ MySQL 5.7：关闭查询缓存
-- ✅ MySQL 8.0：已移除
-- ✅ 使用Redis等外部缓存
</code></pre></p>
<h3>10.3.3 关闭查询缓存</h3>
<pre><code class="language-ini"># my.cnf配置文件
[mysqld]
query_cache_type = 0
query_cache_size = 0
</code></pre>
<hr>
<h2>10.4 解析器（Parser）⭐⭐⭐⭐</h2>
<h3>10.4.1 词法分析</h3>
<pre><code class="language-sql">-- SQL: SELECT id, username FROM users WHERE id = 1;
<p>-- 词法分析：将SQL分解为token
-- SELECT  -&gt; 关键字
-- id      -&gt; 标识符
-- ,       -&gt; 分隔符
-- username-&gt; 标识符
-- FROM    -&gt; 关键字
-- users   -&gt; 标识符
-- WHERE   -&gt; 关键字
-- id      -&gt; 标识符
-- =       -&gt; 运算符
-- 1       -&gt; 数字
-- ;       -&gt; 结束符
</code></pre></p>
<h3>10.4.2 语法分析</h3>
<pre><code class="language-sql">-- 语法分析：检查SQL语法是否正确
-- 构建语法树（Parse Tree）
<p>-- ✅ 正确的SQL
SELECT id, username FROM users WHERE id = 1;</p>
<p>-- ❌ 语法错误
SELECT id, username users WHERE id = 1;  -- 缺少FROM
-- ERROR 1064: You have an error in your SQL syntax</p>
<p>-- ❌ 语法错误
SELECT id, username FROM WHERE id = 1;  -- 缺少表名
-- ERROR 1064: You have an error in your SQL syntax
</code></pre></p>
<h3>10.4.3 语义分析</h3>
<pre><code class="language-sql">-- 语义分析：检查SQL是否有意义
<p>-- ❌ 表不存在
SELECT * FROM non_exist_table;
-- ERROR 1146: Table 'database.non_exist_table' doesn't exist</p>
<p>-- ❌ 列不存在
SELECT non_exist_column FROM users;
-- ERROR 1054: Unknown column 'non_exist_column' in 'field list'</p>
<p>-- ❌ 权限不足
SELECT * FROM mysql.user;
-- ERROR 1142: SELECT command denied to user
</code></pre></p>
<hr>
<h2>10.5 优化器（Optimizer）⭐⭐⭐⭐⭐</h2>
<h3>10.5.1 优化器的作用</h3>
<pre><code class="language-sql">-- 优化器的任务：
-- 1. 选择最优的执行计划
-- 2. 选择使用哪个索引
-- 3. 决定表的连接顺序
-- 4. 优化子查询
-- 5. 优化排序和分组
<p>-- 示例：多个索引选择
CREATE TABLE users (
id INT PRIMARY KEY,
username VARCHAR(50),
age INT,
city VARCHAR(50),
INDEX idx_age (age),
INDEX idx_city (city)
);</p>
<p>-- SQL: SELECT * FROM users WHERE age = 25 AND city = '北京';
-- 优化器需要决定：
-- 1. 使用idx_age索引？
-- 2. 使用idx_city索引？
-- 3. 使用全表扫描？
</code></pre></p>
<h3>10.5.2 查看执行计划</h3>
<pre><code class="language-sql">-- 使用EXPLAIN查看优化器的选择
EXPLAIN SELECT * FROM users WHERE age = 25 AND city = '北京';
<p>-- 关键字段：
-- type: 访问类型（ALL、index、range、ref、const等）
-- key: 使用的索引
-- rows: 预计扫描的行数
-- Extra: 额外信息
</code></pre></p>
<h3>10.5.3 优化器的优化策略</h3>
<pre><code class="language-sql">-- 1. 索引选择
-- 优化器会根据统计信息选择最优索引
<p>-- 2. 表连接顺序优化
-- 小表驱动大表
SELECT * FROM small_table s
INNER JOIN large_table l ON <a href="http://s.id">s.id</a> = l.small_id;</p>
<p>-- 3. 子查询优化
-- 将子查询转换为JOIN
-- 优化前：
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);
-- 优化后（优化器自动转换）：
SELECT DISTINCT u.* FROM users u INNER JOIN orders o ON <a href="http://u.id">u.id</a> = o.user_id;</p>
<p>-- 4. 排序优化
-- 使用索引避免排序
CREATE INDEX idx_age ON users(age);
SELECT * FROM users ORDER BY age;  -- 使用索引，避免filesort</p>
<p>-- 5. 分组优化
-- 使用索引优化GROUP BY
CREATE INDEX idx_city ON users(city);
SELECT city, COUNT(*) FROM users GROUP BY city;  -- 使用索引
</code></pre></p>
<h3>10.5.4 优化器统计信息</h3>
<pre><code class="language-sql">-- 优化器依赖统计信息做决策
-- 统计信息包括：
-- 1. 表的行数
-- 2. 索引的基数（cardinality）
-- 3. 数据分布
<p>-- 查看表统计信息
SHOW TABLE STATUS LIKE 'users';</p>
<p>-- 查看索引统计信息
SHOW INDEX FROM users;</p>
<p>-- 更新统计信息
ANALYZE TABLE users;</p>
<p>-- 强制使用指定索引
SELECT * FROM users FORCE INDEX(idx_age) WHERE age = 25;</p>
<p>-- 忽略指定索引
SELECT * FROM users IGNORE INDEX(idx_age) WHERE age = 25;
</code></pre></p>
<hr>
<h2>10.6 执行器（Executor）⭐⭐⭐⭐</h2>
<h3>10.6.1 执行器的作用</h3>
<pre><code class="language-sql">-- 执行器的任务：
-- 1. 检查用户权限
-- 2. 调用存储引擎接口
-- 3. 返回结果集
<p>-- 执行流程：
-- 1. 检查用户是否有查询权限
-- 2. 打开表
-- 3. 调用存储引擎接口读取数据
-- 4. 过滤数据（WHERE条件）
-- 5. 返回结果
</code></pre></p>
<h3>10.6.2 执行过程示例</h3>
<pre><code class="language-sql">-- SQL: SELECT * FROM users WHERE age = 25;
<p>-- 执行步骤：
-- 1. 检查用户是否有users表的SELECT权限
-- 2. 调用InnoDB引擎接口
-- 3. 如果有索引，使用索引查找
-- 4. 如果没有索引，全表扫描
-- 5. 对每一行判断age是否等于25
-- 6. 将符合条件的行返回给客户端</p>
<p>-- 查看执行过程
SHOW PROFILES;  -- 需要先开启profiling
SET profiling = 1;
SELECT * FROM users WHERE age = 25;
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
</code></pre></p>
<hr>
<h2>10.7 SQL执行流程详解 ⭐⭐⭐⭐⭐</h2>
<h3>10.7.1 查询语句执行流程</h3>
<pre><code class="language-sql">-- SQL: SELECT * FROM users WHERE id = 1;
<p>-- 完整执行流程：
-- 1. 客户端发送SQL到服务器
-- 2. 连接器：验证用户身份和权限
-- 3. 查询缓存：检查是否有缓存（MySQL 5.7）
-- 4. 解析器：词法分析、语法分析、语义分析
-- 5. 优化器：生成执行计划，选择索引
-- 6. 执行器：调用存储引擎接口
-- 7. 存储引擎：读取数据
-- 8. 执行器：返回结果给客户端
</code></pre></p>
<h3>10.7.2 更新语句执行流程</h3>
<pre><code class="language-sql">-- SQL: UPDATE users SET age = 26 WHERE id = 1;
<p>-- 完整执行流程：
-- 1. 连接器：验证用户身份和权限
-- 2. 解析器：词法分析、语法分析、语义分析
-- 3. 优化器：生成执行计划
-- 4. 执行器：调用存储引擎接口
-- 5. 存储引擎（InnoDB）：
--    a. 查找id=1的记录（使用主键索引）
--    b. 将旧值写入undo log（用于回滚）
--    c. 更新记录
--    d. 将新值写入redo log（用于崩溃恢复）
--    e. 写入binlog（用于主从复制）
-- 6. 提交事务
-- 7. 返回影响的行数
</code></pre></p>
<h3>10.7.3 两阶段提交</h3>
<pre><code class="language-sql">-- InnoDB的两阶段提交（2PC）
-- 保证redo log和binlog的一致性
<p>-- 执行流程：
-- 1. 写入redo log（prepare状态）
-- 2. 写入binlog
-- 3. 提交事务，redo log改为commit状态</p>
<p>-- 为什么需要两阶段提交？
-- 保证redo log和binlog的一致性
-- 详见第15章：MySQL日志系统
</code></pre></p>
<hr>
<h2>10.8 InnoDB架构详解 ⭐⭐⭐⭐⭐</h2>
<h3>10.8.1 InnoDB整体架构</h3>
<pre><code>┌─────────────────────────────────────────┐
│         InnoDB内存结构                   │
│  ┌────────────────────────────────────┐ │
│  │  Buffer Pool（缓冲池）              │ │
│  │  - 数据页缓存                       │ │
│  │  - 索引页缓存                       │ │
│  │  - undo页缓存                       │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Change Buffer（写缓冲）            │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Adaptive Hash Index（自适应哈希）  │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Log Buffer（日志缓冲）             │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         InnoDB磁盘结构                   │
│  ┌────────────────────────────────────┐ │
│  │  System Tablespace（系统表空间）    │ │
│  │  - ibdata1                          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  File-Per-Table Tablespace          │ │
│  │  - table_name.ibd                   │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Redo Log（重做日志）               │ │
│  │  - ib_logfile0, ib_logfile1         │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Undo Tablespace（undo表空间）      │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
</code></pre>
<h3>10.8.2 Buffer Pool（缓冲池）</h3>
<pre><code class="language-sql">-- Buffer Pool是InnoDB最重要的内存结构
-- 作用：缓存数据页和索引页，减少磁盘I/O
<p>-- 查看Buffer Pool配置
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';</p>
<p>-- 设置Buffer Pool大小（建议物理内存的50%-70%）
-- my.cnf
[mysqld]
innodb_buffer_pool_size = 1G</p>
<p>-- 查看Buffer Pool状态
SHOW ENGINE INNODB STATUS;</p>
<p>-- Buffer Pool的管理：
-- 1. 使用LRU算法管理页面
-- 2. 分为young区和old区
-- 3. 预读机制
-- 4. 刷脏页机制
</code></pre></p>
<h3>10.8.3 Change Buffer（写缓冲）</h3>
<pre><code class="language-sql">-- Change Buffer：缓存对二级索引的修改
-- 作用：减少随机I/O，提高写入性能
<p>-- 适用场景：
-- ✅ 二级索引的INSERT、UPDATE、DELETE
-- ❌ 主键索引（直接写入Buffer Pool）
-- ❌ 唯一索引（需要检查唯一性）</p>
<p>-- 查看Change Buffer配置
SHOW VARIABLES LIKE 'innodb_change_buffer%';</p>
<p>-- 配置Change Buffer
[mysqld]
innodb_change_buffer_max_size = 25  -- 占Buffer Pool的百分比
</code></pre></p>
<h3>10.8.4 Redo Log（重做日志）</h3>
<pre><code class="language-sql">-- Redo Log：保证事务的持久性
-- 作用：崩溃恢复
<p>-- 查看Redo Log配置
SHOW VARIABLES LIKE 'innodb_log%';</p>
<p>-- 配置Redo Log
[mysqld]
innodb_log_file_size = 512M  -- 单个日志文件大小
innodb_log_files_in_group = 2  -- 日志文件数量
innodb_flush_log_at_trx_commit = 1  -- 刷新策略</p>
<p>-- Redo Log的写入流程：
-- 1. 事务修改数据
-- 2. 写入redo log buffer
-- 3. 根据innodb_flush_log_at_trx_commit刷新到磁盘
-- 4. 提交事务</p>
<p>-- 详见第15章：MySQL日志系统
</code></pre></p>
<h3>10.8.5 Undo Log（回滚日志）</h3>
<pre><code class="language-sql">-- Undo Log：保证事务的原子性
-- 作用：
-- 1. 事务回滚
-- 2. MVCC（多版本并发控制）
<p>-- Undo Log的作用：
-- 1. 记录数据的旧版本
-- 2. 事务回滚时恢复数据
-- 3. 实现MVCC的快照读</p>
<p>-- 详见第08章：事务与并发控制
</code></pre></p>
<hr>
<h2>10.9 MySQL执行流程实战</h2>
<h3>10.9.1 查询执行分析</h3>
<pre><code class="language-sql">-- 开启profiling
SET profiling = 1;
<p>-- 执行查询
SELECT * FROM users WHERE age = 25;</p>
<p>-- 查看执行时间
SHOW PROFILES;</p>
<p>-- 查看详细执行过程
SHOW PROFILE FOR QUERY 1;</p>
<p>-- 查看CPU、IO等信息
SHOW PROFILE CPU, BLOCK IO FOR QUERY 1;
</code></pre></p>
<h3>10.9.2 慢查询分析</h3>
<pre><code class="language-sql">-- 开启慢查询日志
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1;  -- 超过1秒的查询
<p>-- 查看慢查询日志位置
SHOW VARIABLES LIKE 'slow_query_log_file';</p>
<p>-- 分析慢查询
-- 使用pt-query-digest工具
-- pt-query-digest /var/lib/mysql/slow.log
</code></pre></p>
<h3>10.9.3 执行计划分析</h3>
<pre><code class="language-sql">-- 使用EXPLAIN分析执行计划
EXPLAIN SELECT * FROM users WHERE age = 25;
<p>-- 使用EXPLAIN FORMAT=JSON获取详细信息
EXPLAIN FORMAT=JSON SELECT * FROM users WHERE age = 25;</p>
<p>-- 详见第18章：SQL优化实战
</code></pre></p>
<hr>
<h2>10.10 本章总结</h2>
<p><strong>本章学习内容：</strong></p>
<ul>
<li>✅ <strong>MySQL整体架构</strong>（连接层、服务层、存储引擎层）⭐⭐⭐⭐⭐</li>
<li>✅ 连接器（连接管理、权限验证）</li>
<li>✅ 查询缓存（MySQL 5.7有，8.0移除）</li>
<li>✅ <strong>解析器</strong>（词法分析、语法分析、语义分析）⭐⭐⭐⭐</li>
<li>✅ <strong>优化器</strong>（执行计划、索引选择）⭐⭐⭐⭐⭐</li>
<li>✅ <strong>执行器</strong>（权限检查、调用存储引擎）⭐⭐⭐⭐</li>
<li>✅ <strong>SQL执行流程</strong>（查询和更新）⭐⭐⭐⭐⭐</li>
<li>✅ <strong>InnoDB架构</strong>（内存结构、磁盘结构）⭐⭐⭐⭐⭐</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li><strong>MySQL分为连接层、服务层、存储引擎层</strong></li>
<li><strong>SQL执行流程：连接器→解析器→优化器→执行器→存储引擎</strong></li>
<li><strong>优化器负责选择最优执行计划和索引</strong></li>
<li><strong>InnoDB的Buffer Pool是最重要的内存结构</strong></li>
<li><strong>Redo Log保证持久性，Undo Log保证原子性</strong></li>
<li><strong>两阶段提交保证redo log和binlog的一致性</strong></li>
</ol>
<p><strong>SQL执行流程：</strong></p>
<pre><code>客户端 → 连接器 → 查询缓存 → 解析器 → 优化器 → 执行器 → 存储引擎 → 返回结果
</code></pre>
<p><strong>InnoDB核心组件：</strong></p>
<ul>
<li>Buffer Pool：缓存数据页和索引页</li>
<li>Change Buffer：缓存二级索引的修改</li>
<li>Redo Log：保证持久性</li>
<li>Undo Log：保证原子性和MVCC</li>
</ul>
<p><strong>面试重点：</strong></p>
<ul>
<li>MySQL的架构分层</li>
<li>SQL的执行流程</li>
<li>优化器如何选择索引</li>
<li>InnoDB的Buffer Pool作用</li>
<li>Redo Log和Binlog的区别</li>
<li>两阶段提交的原理</li>
</ul>
<p><strong>下一章预告：</strong> 视图、存储过程与函数</p>
<hr>
<h2>练习题</h2>
<ol>
<li>说明MySQL的架构分层</li>
<li>SQL执行流程是怎样的？</li>
<li>优化器的作用是什么？</li>
<li>什么是两阶段提交？为什么需要？</li>
<li>InnoDB的Buffer Pool有什么作用？</li>
<li>Redo Log和Undo Log的区别是什么？</li>
<li>如何查看SQL的执行计划？</li>
<li>如何分析慢查询？</li>
<li>Change Buffer适用于什么场景？</li>
<li>为什么MySQL 8.0移除了查询缓存？</li>
</ol>
<p><strong>继续学习：</strong> <a href="../03-%E9%AB%98%E7%BA%A7%E7%89%B9%E6%80%A7/11-%E8%A7%86%E5%9B%BE%E5%AD%98%E5%82%A8%E8%BF%87%E7%A8%8B%E5%87%BD%E6%95%B0.md">第11章：视图、存储过程与函数</a></p>
