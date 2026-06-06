---
title: 第15章：MySQL日志系统 ⭐⭐⭐ - MySQL教程
description: 第15章：MySQL日志系统 ⭐⭐⭐ 本章是MySQL专家必须精通的核心内容，尤其是binlog机制 15.1 MySQL日志系统概述
  MySQL有多种日志类型，每种日志都有其特定的用途： 日志类型 作用 重要程度 binlog（二进制日志） 记录所有DDL和DML语句，用于复制和恢复
  ⭐⭐⭐⭐⭐ redo log（重做日志） InnoDB引擎特有，保证事务...
url: /mysql/04/15-mysql.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第15章：MySQL日志系统 ⭐⭐⭐</h2></div>
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
<a class="" href="/mysql/01/03-sql-dml.html">第03章：SQL基础</a>
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
      <a class="current" href="/mysql/04/15-mysql.html">第15章：MySQL日志系统 ⭐⭐⭐</a>
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
            <h2><a rel="bookmark" href="/mysql/04/15-mysql.html">第15章：MySQL日志系统 ⭐⭐⭐</a></h2>
            <div class="meta"><span>MySQL教程 / 04</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第15章：MySQL日志系统 ⭐⭐⭐</h1>
<blockquote>
<p>本章是MySQL专家必须精通的核心内容，尤其是binlog机制</p>
</blockquote>
<h2>15.1 MySQL日志系统概述</h2>
<p>MySQL有多种日志类型，每种日志都有其特定的用途：</p>
<table>
<thead>
<tr>
<th>日志类型</th>
<th>作用</th>
<th>重要程度</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>binlog（二进制日志）</strong></td>
<td>记录所有DDL和DML语句，用于复制和恢复</td>
<td>⭐⭐⭐⭐⭐</td>
</tr>
<tr>
<td><strong>redo log（重做日志）</strong></td>
<td>InnoDB引擎特有，保证事务持久性</td>
<td>⭐⭐⭐⭐⭐</td>
</tr>
<tr>
<td><strong>undo log（回滚日志）</strong></td>
<td>保证事务原子性，实现MVCC</td>
<td>⭐⭐⭐⭐⭐</td>
</tr>
<tr>
<td><strong>slow query log（慢查询日志）</strong></td>
<td>记录慢查询，用于性能优化</td>
<td>⭐⭐⭐⭐</td>
</tr>
<tr>
<td><strong>error log（错误日志）</strong></td>
<td>记录MySQL启动、运行、停止时的错误信息</td>
<td>⭐⭐⭐⭐</td>
</tr>
<tr>
<td><strong>general log（通用查询日志）</strong></td>
<td>记录所有SQL语句</td>
<td>⭐⭐</td>
</tr>
<tr>
<td><strong>relay log（中继日志）</strong></td>
<td>主从复制时，从库使用</td>
<td>⭐⭐⭐⭐</td>
</tr>
</tbody>
</table>
<hr>
<h2>15.2 binlog（二进制日志）详解 ⭐⭐⭐⭐⭐</h2>
<h3>15.2.1 binlog的作用</h3>
<p>binlog是MySQL最重要的日志之一，主要用途：</p>
<ol>
<li><strong>主从复制</strong>：主库的binlog传输到从库进行重放，实现数据同步</li>
<li><strong>数据恢复</strong>：通过binlog进行时间点恢复（Point-In-Time Recovery）</li>
<li><strong>数据审计</strong>：记录所有数据变更操作</li>
</ol>
<h3>15.2.2 binlog vs redo log</h3>
<p>这是面试高频问题，必须理解：</p>
<table>
<thead>
<tr>
<th>特性</th>
<th>binlog</th>
<th>redo log</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>层级</strong></td>
<td>MySQL Server层，所有引擎都可用</td>
<td>InnoDB引擎层</td>
</tr>
<tr>
<td><strong>内容</strong></td>
<td>逻辑日志，记录SQL语句或行变更</td>
<td>物理日志，记录数据页的修改</td>
</tr>
<tr>
<td><strong>写入方式</strong></td>
<td>追加写入，不会覆盖</td>
<td>循环写入，空间固定</td>
</tr>
<tr>
<td><strong>用途</strong></td>
<td>复制、恢复</td>
<td>崩溃恢复</td>
</tr>
<tr>
<td><strong>格式</strong></td>
<td>ROW/STATEMENT/MIXED</td>
<td>固定格式</td>
</tr>
</tbody>
</table>
<p><strong>两阶段提交：</strong>
为了保证binlog和redo log的一致性，MySQL使用两阶段提交：</p>
<pre><code>1. prepare阶段：写入redo log，状态为prepare
2. commit阶段：写入binlog，然后提交redo log
</code></pre>
<h3>15.2.3 binlog的三种格式</h3>
<h4>1. STATEMENT格式（语句模式）</h4>
<p><strong>特点：</strong></p>
<ul>
<li>记录执行的SQL语句</li>
<li>日志量小</li>
<li>可能导致主从数据不一致</li>
</ul>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">UPDATE users SET login_count = login_count + 1 WHERE id = 100;
</code></pre>
<p>binlog记录：</p>
<pre><code>UPDATE users SET login_count = login_count + 1 WHERE id = 100
</code></pre>
<p><strong>问题场景：</strong></p>
<pre><code class="language-sql">-- 主库执行
DELETE FROM users WHERE create_time &lt; NOW() LIMIT 10;
<p>-- 如果主从库的数据顺序不同，删除的数据可能不一样
-- 使用UUID()、RAND()等函数也会导致不一致
</code></pre></p>
<h4>2. ROW格式（行模式）⭐ 推荐</h4>
<p><strong>特点：</strong></p>
<ul>
<li>记录每一行数据的变化</li>
<li>日志量大</li>
<li>数据一致性最好</li>
<li>MySQL 5.7默认格式</li>
</ul>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">UPDATE users SET login_count = login_count + 1 WHERE id = 100;
</code></pre>
<p>binlog记录（简化）：</p>
<pre><code>### UPDATE `test`.`users`
### WHERE
###   @1=100 /* id */
###   @2=5 /* login_count */
### SET
###   @1=100 /* id */
###   @2=6 /* login_count */
</code></pre>
<p><strong>优点：</strong></p>
<ul>
<li>任何情况下都能保证主从一致</li>
<li>可以精确恢复每一行数据</li>
<li>适合数据审计</li>
</ul>
<p><strong>缺点：</strong></p>
<ul>
<li>批量操作时日志量大</li>
<li>例如：<code>UPDATE users SET status=1</code> 更新100万行，会记录100万行的变化</li>
</ul>
<h4>3. MIXED格式（混合模式）</h4>
<p><strong>特点：</strong></p>
<ul>
<li>默认使用STATEMENT格式</li>
<li>遇到可能导致不一致的语句时，自动切换到ROW格式</li>
<li>平衡了日志大小和一致性</li>
</ul>
<p><strong>自动切换到ROW的场景：</strong></p>
<ul>
<li>使用UUID()、USER()、CURRENT_USER()等函数</li>
<li>使用AUTO_INCREMENT列</li>
<li>使用LIMIT且没有ORDER BY</li>
<li>使用触发器或存储过程</li>
</ul>
<h3>15.2.4 binlog的配置</h3>
<h4>开启binlog</h4>
<p><strong>配置文件（my.cnf/my.ini）：</strong></p>
<pre><code class="language-ini">[mysqld]
# 开启binlog（必须）
log-bin=mysql-bin
<h1>binlog格式（推荐ROW）</h1>
<p>binlog_format=ROW</p>
<h1>每个binlog文件的最大大小（默认1G）</h1>
<p>max_binlog_size=1G</p>
<h1>binlog过期时间（天），0表示不自动删除</h1>
<p>expire_logs_days=7</p>
<h1>MySQL 8.0使用这个参数（秒）</h1>
<h1>binlog_expire_logs_seconds=604800</h1>
<h1>同步binlog到磁盘的策略</h1>
<h1>0: 由操作系统决定何时刷新（性能最好，安全性最差）</h1>
<h1>1: 每次事务提交都刷新（最安全，性能较差）⭐ 推荐</h1>
<h1>N: 每N个事务刷新一次</h1>
<p>sync_binlog=1</p>
<h1>binlog缓存大小</h1>
<p>binlog_cache_size=4M</p>
<h1>单个事务的binlog缓存大小</h1>
<p>max_binlog_cache_size=512M</p>
<h1>指定哪些数据库记录binlog（可选）</h1>
<h1>binlog-do-db=mydb</h1>
<h1>指定哪些数据库不记录binlog（可选）</h1>
<h1>binlog-ignore-db=test</h1>
<h1>server_id（主从复制必须，每个MySQL实例唯一）</h1>
<p>server-id=1
</code></pre></p>
<p><strong>重启MySQL使配置生效：</strong></p>
<pre><code class="language-bash">sudo systemctl restart mysqld
</code></pre>
<h4>查看binlog配置</h4>
<pre><code class="language-sql">-- 查看binlog是否开启
SHOW VARIABLES LIKE 'log_bin';
<p>-- 查看binlog格式
SHOW VARIABLES LIKE 'binlog_format';</p>
<p>-- 查看所有binlog相关配置
SHOW VARIABLES LIKE 'binlog%';</p>
<p>-- 查看sync_binlog配置
SHOW VARIABLES LIKE 'sync_binlog';
</code></pre></p>
<h3>15.2.5 binlog的管理</h3>
<h4>查看binlog文件</h4>
<pre><code class="language-sql">-- 查看所有binlog文件
SHOW BINARY LOGS;
-- 或
SHOW MASTER LOGS;
<p>-- 输出示例：
-- +------------------+-----------+
-- | Log_name         | File_size |
-- +------------------+-----------+
-- | mysql-bin.000001 | 177       |
-- | mysql-bin.000002 | 1547      |
-- | mysql-bin.000003 | 154       |
-- +------------------+-----------+</p>
<p>-- 查看当前正在写入的binlog
SHOW MASTER STATUS;</p>
<p>-- 输出示例：
-- +------------------+----------+--------------+------------------+
-- | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
-- +------------------+----------+--------------+------------------+
-- | mysql-bin.000003 | 154      |              |                  |
-- +------------------+----------+--------------+------------------+
</code></pre></p>
<h4>查看binlog内容</h4>
<p><strong>使用mysqlbinlog工具：</strong></p>
<pre><code class="language-bash"># 查看binlog内容（基本格式）
mysqlbinlog mysql-bin.000001
<h1>查看binlog内容（详细格式，ROW格式必须加-v）</h1>
<p>mysqlbinlog -v mysql-bin.000001</p>
<h1>查看binlog内容（超详细格式）</h1>
<p>mysqlbinlog -vv mysql-bin.000001</p>
<h1>指定开始位置</h1>
<p>mysqlbinlog --start-position=154 mysql-bin.000001</p>
<h1>指定结束位置</h1>
<p>mysqlbinlog --stop-position=500 mysql-bin.000001</p>
<h1>指定时间范围</h1>
<p>mysqlbinlog --start-datetime=&quot;2024-01-01 00:00:00&quot; <br>
--stop-datetime=&quot;2024-01-01 23:59:59&quot; <br>
mysql-bin.000001</p>
<h1>输出到文件</h1>
<p>mysqlbinlog mysql-bin.000001 &gt; binlog.sql</p>
<h1>查看多个binlog文件</h1>
<p>mysqlbinlog mysql-bin.000001 mysql-bin.000002 &gt; all_binlog.sql</p>
<h1>只查看指定数据库的binlog</h1>
<p>mysqlbinlog --database=mydb mysql-bin.000001</p>
<h1>解析ROW格式的binlog（必须加-v或-vv）</h1>
<p>mysqlbinlog -vv --base64-output=DECODE-ROWS mysql-bin.000001
</code></pre></p>
<p><strong>binlog内容示例：</strong></p>
<p>STATEMENT格式：</p>
<pre><code># at 123
#241101 10:30:45 server id 1  end_log_pos 250  Query   thread_id=5
SET TIMESTAMP=1698825045/*!*/;
UPDATE users SET login_count = login_count + 1 WHERE id = 100
/*!*/;
</code></pre>
<p>ROW格式（需要-v参数）：</p>
<pre><code># at 123
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
</code></pre>
<h4>删除binlog</h4>
<pre><code class="language-sql">-- 删除指定binlog之前的所有binlog
PURGE BINARY LOGS TO 'mysql-bin.000003';
<p>-- 删除指定时间之前的binlog
PURGE BINARY LOGS BEFORE '2024-01-01 00:00:00';</p>
<p>-- 删除所有binlog（危险操作！）
RESET MASTER;</p>
<p>-- 查看binlog占用空间
SELECT
CONCAT(ROUND(SUM(File_size)/1024/1024, 2), 'MB') AS binlog_size
FROM information_schema.BINARY_LOGS;
</code></pre></p>
<p><strong>自动清理配置：</strong></p>
<pre><code class="language-ini"># 配置文件中设置
expire_logs_days=7  # MySQL 5.7
binlog_expire_logs_seconds=604800  # MySQL 8.0（7天）
</code></pre>
<h4>刷新binlog</h4>
<pre><code class="language-sql">-- 手动切换到新的binlog文件
FLUSH LOGS;
<p>-- 或使用命令行
mysqladmin -u root -p flush-logs
</code></pre></p>
<p><strong>使用场景：</strong></p>
<ul>
<li>备份前刷新，方便管理</li>
<li>binlog文件过大时手动切换</li>
<li>定期归档binlog</li>
</ul>
<h3>15.2.6 binlog实战案例</h3>
<h4>案例1：查看某个表的所有变更</h4>
<pre><code class="language-bash"># 查看users表的所有变更
mysqlbinlog -vv --base64-output=DECODE-ROWS mysql-bin.* | grep -A 20 &quot;users&quot;
</code></pre>
<h4>案例2：统计某个时间段的操作</h4>
<pre><code class="language-bash"># 统计今天的INSERT、UPDATE、DELETE数量
mysqlbinlog --start-datetime=&quot;2024-11-01 00:00:00&quot; \
            --stop-datetime=&quot;2024-11-01 23:59:59&quot; \
            mysql-bin.* | grep -E &quot;INSERT|UPDATE|DELETE&quot; | wc -l
</code></pre>
<h4>案例3：找出误删除的数据</h4>
<pre><code class="language-bash"># 假设在10:30误删了数据，查看10:00-11:00的binlog
mysqlbinlog -vv --start-datetime=&quot;2024-11-01 10:00:00&quot; \
                --stop-datetime=&quot;2024-11-01 11:00:00&quot; \
                mysql-bin.000003 | grep -A 50 &quot;DELETE FROM users&quot;
</code></pre>
<h4>案例4：恢复误删除的数据</h4>
<pre><code class="language-bash"># 1. 找到误删除的位置
mysqlbinlog -vv mysql-bin.000003 | grep -B 5 -A 20 &quot;DELETE FROM users&quot;
<h1>2. 提取误删除之前的binlog（假设误删除位置是500）</h1>
<p>mysqlbinlog --stop-position=500 mysql-bin.000003 &gt; before_delete.sql</p>
<h1>3. 提取误删除之后的binlog（假设误删除结束位置是600）</h1>
<p>mysqlbinlog --start-position=600 mysql-bin.000003 &gt; after_delete.sql</p>
<h1>4. 恢复数据</h1>
<p>mysql -u root -p &lt; before_delete.sql</p>
<h1>手动恢复被删除的数据</h1>
<p>mysql -u root -p &lt; after_delete.sql
</code></pre></p>
<hr>
<h2>15.3 redo log（重做日志）详解 ⭐⭐⭐⭐⭐</h2>
<h3>15.3.1 redo log的作用</h3>
<p>redo log是InnoDB存储引擎特有的日志，用于实现<strong>事务的持久性（Durability）</strong>。</p>
<p><strong>核心问题：</strong>
如果每次事务提交都将数据刷新到磁盘，性能会很差。redo log解决了这个问题。</p>
<p><strong>工作原理：</strong></p>
<ol>
<li>事务提交时，先写redo log（顺序写，速度快）</li>
<li>数据页的修改可以延迟写入磁盘（随机写，速度慢）</li>
<li>MySQL崩溃后，通过redo log恢复未刷盘的数据</li>
</ol>
<p>这就是**WAL（Write-Ahead Logging）**机制。</p>
<h3>15.3.2 redo log的结构</h3>
<p><strong>物理结构：</strong></p>
<ul>
<li>redo log由一组文件组成（默认2个）</li>
<li>文件名：<code>ib_logfile0</code>、<code>ib_logfile1</code></li>
<li>循环写入，空间固定</li>
</ul>
<p><strong>逻辑结构：</strong></p>
<pre><code>+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |  ← redo log文件（循环）
+---+---+---+---+---+---+---+---+
  ↑               ↑
  write pos      checkpoint
<p>write pos: 当前写入位置
checkpoint: 当前擦除位置（已刷盘的数据）
</code></pre></p>
<p><strong>状态：</strong></p>
<ul>
<li><code>write pos</code> 和 <code>checkpoint</code> 之间：可以写入的空间</li>
<li><code>checkpoint</code> 和 <code>write pos</code> 之间：已写入但未刷盘的数据</li>
<li>如果 <code>write pos</code> 追上 <code>checkpoint</code>，需要先刷盘，腾出空间</li>
</ul>
<h3>15.3.3 redo log的配置</h3>
<pre><code class="language-ini">[mysqld]
# redo log文件大小（每个文件）
innodb_log_file_size=512M
<h1>redo log文件数量</h1>
<p>innodb_log_files_in_group=2</p>
<h1>redo log缓冲区大小</h1>
<p>innodb_log_buffer_size=16M</p>
<h1>redo log刷盘策略</h1>
<h1>0: 每秒刷一次（性能最好，可能丢失1秒数据）</h1>
<h1>1: 每次事务提交都刷盘（最安全）⭐ 推荐</h1>
<h1>2: 每次事务提交写到OS缓存，每秒刷盘</h1>
<p>innodb_flush_log_at_trx_commit=1
</code></pre></p>
<p><strong>查看配置：</strong></p>
<pre><code class="language-sql">SHOW VARIABLES LIKE 'innodb_log%';
</code></pre>
<h3>15.3.4 redo log与binlog的两阶段提交</h3>
<p><strong>为什么需要两阶段提交？</strong></p>
<p>假设执行：<code>UPDATE users SET age=20 WHERE id=1</code></p>
<p><strong>如果没有两阶段提交：</strong></p>
<ol>
<li>
<p>先写redo log，再写binlog</p>
<ul>
<li>如果写完redo log后崩溃，重启后数据已更新，但binlog没记录</li>
<li>主从复制时，从库不会执行这个更新，导致主从不一致</li>
</ul>
</li>
<li>
<p>先写binlog，再写redo log</p>
<ul>
<li>如果写完binlog后崩溃，重启后数据未更新，但binlog已记录</li>
<li>主从复制时，从库会执行这个更新，导致主从不一致</li>
</ul>
</li>
</ol>
<p><strong>两阶段提交流程：</strong></p>
<pre><code>1. prepare阶段：
   - 写入redo log，标记为prepare状态
   - 此时事务还未提交
<ol start="2">
<li>commit阶段：
<ul>
<li>写入binlog</li>
<li>提交redo log，标记为commit状态</li>
<li>事务提交完成</li>
</ul>
</li>
</ol>
<p>崩溃恢复时：</p>
<ul>
<li>如果redo log是prepare状态，且binlog完整 → 提交事务</li>
<li>如果redo log是prepare状态，但binlog不完整 → 回滚事务</li>
<li>如果redo log是commit状态 → 事务已提交
</code></pre></li>
</ul>
<p><strong>图示：</strong></p>
<pre><code>事务执行流程：
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
</code></pre>
<h3>15.3.5 redo log性能优化</h3>
<p><strong>参数调优：</strong></p>
<pre><code class="language-ini"># 增大redo log文件大小，减少checkpoint频率
innodb_log_file_size=1G
<h1>增大redo log缓冲区</h1>
<p>innodb_log_buffer_size=32M</p>
<h1>根据业务场景调整刷盘策略</h1>
<h1>金融系统：innodb_flush_log_at_trx_commit=1（最安全）</h1>
<h1>一般系统：innodb_flush_log_at_trx_commit=1（推荐）</h1>
<h1>高性能要求：innodb_flush_log_at_trx_commit=2（可能丢失1秒数据）</h1>
<p></code></pre></p>
<p><strong>监控redo log：</strong></p>
<pre><code class="language-sql">-- 查看redo log使用情况
SHOW ENGINE INNODB STATUS\G
<p>-- 关注以下指标：
-- Log sequence number: 当前LSN
-- Log flushed up to: 已刷盘的LSN
-- Pages flushed up to: 已刷盘的页LSN
-- Last checkpoint at: 最后一次checkpoint的LSN
</code></pre></p>
<hr>
<h2>15.4 undo log（回滚日志）详解 ⭐⭐⭐⭐⭐</h2>
<h3>15.4.1 undo log的作用</h3>
<p>undo log有两个重要作用：</p>
<ol>
<li><strong>事务回滚</strong>：保证事务的原子性（Atomicity）</li>
<li><strong>MVCC（多版本并发控制）</strong>：实现一致性非锁定读</li>
</ol>
<h3>15.4.2 undo log的工作原理</h3>
<p><strong>记录内容：</strong></p>
<ul>
<li>INSERT操作：记录主键，回滚时删除这条记录</li>
<li>DELETE操作：记录整行数据，回滚时插入这条记录</li>
<li>UPDATE操作：记录修改前的值，回滚时恢复</li>
</ul>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">-- 原始数据
id=1, name='张三', age=20
<p>-- 执行UPDATE
UPDATE users SET age=30 WHERE id=1;</p>
<p>-- undo log记录
UPDATE users SET age=20 WHERE id=1;  -- 回滚时执行这个
</code></pre></p>
<h3>15.4.3 undo log与MVCC</h3>
<p><strong>MVCC原理：</strong>
每行数据都有两个隐藏列：</p>
<ul>
<li><code>DB_TRX_ID</code>：最后修改该行的事务ID</li>
<li><code>DB_ROLL_PTR</code>：指向undo log的指针</li>
</ul>
<p><strong>版本链：</strong></p>
<pre><code>当前版本: id=1, name='张三', age=30, trx_id=100
           ↓ (DB_ROLL_PTR)
undo log: id=1, name='张三', age=20, trx_id=90
           ↓
undo log: id=1, name='张三', age=10, trx_id=80
</code></pre>
<p><strong>读取数据时：</strong></p>
<ul>
<li>根据事务隔离级别和事务ID</li>
<li>通过版本链找到对应版本的数据</li>
<li>实现了不加锁的一致性读</li>
</ul>
<p>详细内容见：<a href="/mysql/02/08.html">第08章：事务与并发控制</a></p>
<h3>15.4.4 undo log的配置</h3>
<pre><code class="language-ini">[mysqld]
# undo表空间数量（MySQL 5.7）
innodb_undo_tablespaces=2
<h1>undo日志目录</h1>
<p>innodb_undo_directory=/var/lib/mysql/undo</p>
<h1>undo日志回收（MySQL 5.7.5+）</h1>
<p>innodb_undo_log_truncate=ON</p>
<h1>undo表空间最大大小</h1>
<p>innodb_max_undo_log_size=1G
</code></pre></p>
<p><strong>查看undo log：</strong></p>
<pre><code class="language-sql">-- 查看undo log配置
SHOW VARIABLES LIKE 'innodb_undo%';
<p>-- 查看undo log使用情况
SELECT
tablespace_name,
file_name,
file_size/1024/1024 AS size_mb
FROM information_schema.FILES
WHERE tablespace_name LIKE 'innodb_undo%';
</code></pre></p>
<hr>
<h2>15.5 慢查询日志（Slow Query Log）⭐⭐⭐⭐</h2>
<h3>15.5.1 慢查询日志的作用</h3>
<p>记录执行时间超过阈值的SQL语句，用于性能优化。</p>
<h3>15.5.2 配置慢查询日志</h3>
<pre><code class="language-ini">[mysqld]
# 开启慢查询日志
slow_query_log=1
<h1>慢查询日志文件</h1>
<p>slow_query_log_file=/var/lib/mysql/slow.log</p>
<h1>慢查询时间阈值（秒）</h1>
<p>long_query_time=2</p>
<h1>记录没有使用索引的查询</h1>
<p>log_queries_not_using_indexes=1</p>
<h1>限制每分钟记录的未使用索引的查询数量</h1>
<p>log_throttle_queries_not_using_indexes=10</p>
<h1>记录管理语句（如ALTER TABLE）</h1>
<p>log_slow_admin_statements=1</p>
<h1>记录从库上的慢查询</h1>
<p>log_slow_slave_statements=1
</code></pre></p>
<p><strong>动态开启：</strong></p>
<pre><code class="language-sql">-- 开启慢查询日志
SET GLOBAL slow_query_log=1;
<p>-- 设置慢查询时间阈值
SET GLOBAL long_query_time=2;</p>
<p>-- 查看配置
SHOW VARIABLES LIKE 'slow_query%';
SHOW VARIABLES LIKE 'long_query_time';
</code></pre></p>
<h3>15.5.3 分析慢查询日志</h3>
<p><strong>查看慢查询日志：</strong></p>
<pre><code class="language-bash"># 直接查看
tail -f /var/lib/mysql/slow.log
<h1>使用mysqldumpslow工具分析</h1>
<h1>按查询次数排序，显示前10条</h1>
<p>mysqldumpslow -s c -t 10 /var/lib/mysql/slow.log</p>
<h1>按查询时间排序</h1>
<p>mysqldumpslow -s t -t 10 /var/lib/mysql/slow.log</p>
<h1>按锁定时间排序</h1>
<p>mysqldumpslow -s l -t 10 /var/lib/mysql/slow.log</p>
<h1>按返回记录数排序</h1>
<p>mysqldumpslow -s r -t 10 /var/lib/mysql/slow.log</p>
<h1>组合使用</h1>
<p>mysqldumpslow -s t -t 10 -g &quot;SELECT&quot; /var/lib/mysql/slow.log
</code></pre></p>
<p><strong>使用pt-query-digest工具（推荐）：</strong></p>
<pre><code class="language-bash"># 安装percona-toolkit
yum install percona-toolkit
<h1>分析慢查询日志</h1>
<p>pt-query-digest /var/lib/mysql/slow.log</p>
<h1>输出到文件</h1>
<p>pt-query-digest /var/lib/mysql/slow.log &gt; slow_report.txt</p>
<h1>只分析最近1小时的日志</h1>
<p>pt-query-digest --since=1h /var/lib/mysql/slow.log</p>
<h1>分析并输出到数据库</h1>
<p>pt-query-digest --review h=localhost,D=test,t=query_review <br>
--history h=localhost,D=test,t=query_history <br>
/var/lib/mysql/slow.log
</code></pre></p>
<p><strong>慢查询日志示例：</strong></p>
<pre><code># Time: 2024-11-01T10:30:45.123456Z
# User@Host: root[root] @ localhost []  Id:     5
# Query_time: 3.123456  Lock_time: 0.000123 Rows_sent: 100  Rows_examined: 1000000
SET timestamp=1698825045;
SELECT * FROM users WHERE age &gt; 20 ORDER BY create_time DESC LIMIT 100;
</code></pre>
<hr>
<h2>15.6 错误日志（Error Log）⭐⭐⭐⭐</h2>
<h3>15.6.1 错误日志的作用</h3>
<p>记录MySQL启动、运行、停止过程中的错误、警告和注意信息。</p>
<h3>15.6.2 配置错误日志</h3>
<pre><code class="language-ini">[mysqld]
# 错误日志文件
log-error=/var/log/mysqld.log
<h1>日志级别（MySQL 8.0）</h1>
<h1>1: ERROR</h1>
<h1>2: ERROR, WARNING</h1>
<h1>3: ERROR, WARNING, INFORMATION</h1>
<p>log_error_verbosity=2
</code></pre></p>
<p><strong>查看错误日志位置：</strong></p>
<pre><code class="language-sql">SHOW VARIABLES LIKE 'log_error';
</code></pre>
<p><strong>查看错误日志：</strong></p>
<pre><code class="language-bash"># 查看最新的错误
tail -f /var/log/mysqld.log
<h1>查看最近100行</h1>
<p>tail -n 100 /var/log/mysqld.log</p>
<h1>搜索错误</h1>
<p>grep -i error /var/log/mysqld.log</p>
<h1>搜索警告</h1>
<p>grep -i warning /var/log/mysqld.log
</code></pre></p>
<hr>
<h2>15.7 通用查询日志（General Query Log）</h2>
<h3>15.7.1 通用查询日志的作用</h3>
<p>记录所有SQL语句，包括SELECT、INSERT、UPDATE、DELETE等。</p>
<p><strong>注意：</strong> 生产环境不建议开启，会严重影响性能！</p>
<h3>15.7.2 配置通用查询日志</h3>
<pre><code class="language-ini">[mysqld]
# 开启通用查询日志
general_log=1
<h1>日志文件</h1>
<p>general_log_file=/var/lib/mysql/general.log
</code></pre></p>
<p><strong>动态开启（临时调试用）：</strong></p>
<pre><code class="language-sql">-- 开启
SET GLOBAL general_log=1;
<p>-- 关闭
SET GLOBAL general_log=0;</p>
<p>-- 查看配置
SHOW VARIABLES LIKE 'general_log%';
</code></pre></p>
<hr>
<h2>15.8 中继日志（Relay Log）</h2>
<h3>15.8.1 中继日志的作用</h3>
<p>主从复制时，从库使用中继日志：</p>
<ol>
<li>从库的IO线程从主库读取binlog</li>
<li>写入从库的relay log</li>
<li>从库的SQL线程读取relay log并执行</li>
</ol>
<p>详细内容见：<a href="/mysql/06/22.html">第22章：主从复制</a></p>
<hr>
<h2>15.9 日志系统最佳实践</h2>
<h3>15.9.1 生产环境推荐配置</h3>
<pre><code class="language-ini">[mysqld]
# binlog配置
log-bin=mysql-bin
binlog_format=ROW
sync_binlog=1
expire_logs_days=7
max_binlog_size=1G
<h1>redo log配置</h1>
<p>innodb_log_file_size=1G
innodb_log_files_in_group=2
innodb_flush_log_at_trx_commit=1</p>
<h1>慢查询日志</h1>
<p>slow_query_log=1
long_query_time=2
log_queries_not_using_indexes=1</p>
<h1>错误日志</h1>
<p>log-error=/var/log/mysqld.log
</code></pre></p>
<h3>15.9.2 日志监控</h3>
<p><strong>监控指标：</strong></p>
<ul>
<li>binlog生成速度</li>
<li>binlog磁盘占用</li>
<li>慢查询数量</li>
<li>错误日志中的ERROR和WARNING</li>
</ul>
<p><strong>监控脚本示例：</strong></p>
<pre><code class="language-bash">#!/bin/bash
# 检查binlog大小
binlog_size=$(mysql -e &quot;SELECT CONCAT(ROUND(SUM(File_size)/1024/1024, 2), 'MB') FROM information_schema.BINARY_LOGS;&quot; -N)
echo &quot;Binlog total size: $binlog_size&quot;
<h1>检查慢查询数量</h1>
<p>slow_queries=$(mysql -e &quot;SHOW GLOBAL STATUS LIKE 'Slow_queries';&quot; -N | awk '{print $2}')
echo &quot;Slow queries: $slow_queries&quot;</p>
<h1>检查错误日志</h1>
<p>error_count=$(grep -c &quot;ERROR&quot; /var/log/mysqld.log)
echo &quot;Error count: $error_count&quot;
</code></pre></p>
<h3>15.9.3 日志归档</h3>
<p><strong>binlog归档脚本：</strong></p>
<pre><code class="language-bash">#!/bin/bash
# binlog归档脚本
<p>BACKUP_DIR=&quot;/backup/binlog&quot;
MYSQL_BIN_DIR=&quot;/var/lib/mysql&quot;
DATE=$(date +%Y%m%d)</p>
<h1>创建归档目录</h1>
<p>mkdir -p $BACKUP_DIR/$DATE</p>
<h1>刷新binlog</h1>
<p>mysql -e &quot;FLUSH LOGS;&quot;</p>
<h1>获取当前binlog文件</h1>
<p>current_binlog=$(mysql -e &quot;SHOW MASTER STATUS\G&quot; | grep File | awk '{print $2}')</p>
<h1>复制除当前binlog外的所有binlog</h1>
<p>for binlog in $(ls $MYSQL_BIN_DIR/mysql-bin.* | grep -v $current_binlog); do
cp $binlog $BACKUP_DIR/$DATE/
done</p>
<h1>删除7天前的归档</h1>
<p>find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} ;</p>
<p>echo &quot;Binlog archived to $BACKUP_DIR/$DATE&quot;
</code></pre></p>
<hr>
<h2>15.10 小结</h2>
<p>本章学习了MySQL的日志系统：</p>
<ul>
<li>✅ <strong>binlog</strong>：主从复制和数据恢复的核心，必须精通</li>
<li>✅ <strong>redo log</strong>：保证事务持久性，理解WAL机制</li>
<li>✅ <strong>undo log</strong>：事务回滚和MVCC的基础</li>
<li>✅ <strong>慢查询日志</strong>：性能优化的重要工具</li>
<li>✅ <strong>错误日志</strong>：故障排查的第一手资料</li>
<li>✅ <strong>两阶段提交</strong>：保证binlog和redo log的一致性</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li>binlog的三种格式及应用场景</li>
<li>binlog的查看和管理</li>
<li>redo log与binlog的区别</li>
<li>两阶段提交的原理</li>
<li>慢查询日志的分析</li>
</ol>
<p><strong>下一章预告：</strong> 备份策略与实践</p>
<hr>
<h2>练习题</h2>
<ol>
<li>配置MySQL开启binlog，格式为ROW</li>
<li>执行一些DML操作，使用mysqlbinlog查看binlog内容</li>
<li>配置慢查询日志，找出执行时间超过1秒的SQL</li>
<li>理解并画出两阶段提交的流程图</li>
<li>编写脚本定期归档binlog</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/04/16.html">第16章：备份策略与实践</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/mysql/03/14.html" class="fn-left">上一篇：第14章：字符集与排序规则</a>
            <a href="/mysql/04/16.html" class="fn-right">下一篇：第16章：备份策略与实践</a>
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
