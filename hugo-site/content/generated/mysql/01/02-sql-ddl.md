---
title: 第02章：SQL基础 - MySQL教程
description: 第02章：SQL基础 DDL数据定义语言 DDL (Data Definition Language) 用于定义和管理数据库对象
  2.1 SQL语言分类 类型 全称 说明 主要语句 DDL Data Definition Language 数据定义语言
  CREATE、ALTER、DROP、TRUNCATE DML Data Manipulation Lang...
url: /mysql/01/02-sql-ddl.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第02章：SQL基础</h2></div>
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
<a class="current" href="/mysql/01/02-sql-ddl.html">第02章：SQL基础</a>
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
            <h2><a rel="bookmark" href="/mysql/01/02-sql-ddl.html">第02章：SQL基础</a></h2>
            <div class="meta"><span>MySQL教程 / 01</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第02章：SQL基础 - DDL数据定义语言</h1>
<blockquote>
<p>DDL (Data Definition Language) 用于定义和管理数据库对象</p>
</blockquote>
<h2>2.1 SQL语言分类</h2>
<table>
<thead>
<tr>
<th>类型</th>
<th>全称</th>
<th>说明</th>
<th>主要语句</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>DDL</strong></td>
<td>Data Definition Language</td>
<td>数据定义语言</td>
<td>CREATE、ALTER、DROP、TRUNCATE</td>
</tr>
<tr>
<td><strong>DML</strong></td>
<td>Data Manipulation Language</td>
<td>数据操作语言</td>
<td>INSERT、UPDATE、DELETE</td>
</tr>
<tr>
<td><strong>DQL</strong></td>
<td>Data Query Language</td>
<td>数据查询语言</td>
<td>SELECT</td>
</tr>
<tr>
<td><strong>DCL</strong></td>
<td>Data Control Language</td>
<td>数据控制语言</td>
<td>GRANT、REVOKE</td>
</tr>
<tr>
<td><strong>TCL</strong></td>
<td>Transaction Control Language</td>
<td>事务控制语言</td>
<td>COMMIT、ROLLBACK、SAVEPOINT</td>
</tr>
</tbody>
</table>
<hr>
<h2>2.2 数据库操作</h2>
<h3>2.2.1 创建数据库</h3>
<pre><code class="language-sql">-- 基本语法
CREATE DATABASE database_name;
<p>-- 指定字符集
CREATE DATABASE mydb CHARACTER SET utf8mb4;</p>
<p>-- 指定字符集和排序规则
CREATE DATABASE mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;</p>
<p>-- 如果不存在则创建
CREATE DATABASE IF NOT EXISTS mydb;</p>
<p>-- 完整示例
CREATE DATABASE IF NOT EXISTS mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
</code></pre></p>
<h3>2.2.2 查看数据库</h3>
<pre><code class="language-sql">-- 查看所有数据库
SHOW DATABASES;
<p>-- 查看数据库创建语句
SHOW CREATE DATABASE mydb;</p>
<p>-- 查看当前使用的数据库
SELECT DATABASE();
</code></pre></p>
<h3>2.2.3 修改数据库</h3>
<pre><code class="language-sql">-- 修改字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4;
<p>-- 修改排序规则
ALTER DATABASE mydb COLLATE utf8mb4_unicode_ci;
</code></pre></p>
<h3>2.2.4 删除数据库</h3>
<pre><code class="language-sql">-- 删除数据库（危险操作！）
DROP DATABASE mydb;
<p>-- 如果存在则删除
DROP DATABASE IF EXISTS mydb;
</code></pre></p>
<h3>2.2.5 使用数据库</h3>
<pre><code class="language-sql">-- 切换到指定数据库
USE mydb;
</code></pre>
<hr>
<h2>2.3 数据表操作</h2>
<h3>2.3.1 创建表</h3>
<p><strong>基本语法：</strong></p>
<pre><code class="language-sql">CREATE TABLE table_name (
    column1 datatype constraints,
    column2 datatype constraints,
    ...
    table_constraints
);
</code></pre>
<p><strong>示例1：简单表</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT,
    name VARCHAR(50),
    age INT
);
</code></pre>
<p><strong>示例2：完整表定义</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码',
    email VARCHAR(100) COMMENT '邮箱',
    phone CHAR(11) COMMENT '手机号',
    age INT DEFAULT 0 COMMENT '年龄',
    gender ENUM('M', 'F', 'U') DEFAULT 'U' COMMENT '性别',
    status TINYINT DEFAULT 1 COMMENT '状态：1-正常，0-禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
</code></pre>
<p><strong>示例3：外键约束</strong></p>
<pre><code class="language-sql">-- 创建部门表
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
<p>-- 创建员工表（带外键）
CREATE TABLE employees (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
department_id INT,
salary DECIMAL(10, 2),
hire_date DATE,
FOREIGN KEY (department_id) REFERENCES departments(id)
ON DELETE CASCADE
ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
</code></pre></p>
<p><strong>如果不存在则创建：</strong></p>
<pre><code class="language-sql">CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
</code></pre>
<p><strong>复制表结构：</strong></p>
<pre><code class="language-sql">-- 只复制结构，不复制数据
CREATE TABLE users_copy LIKE users;
<p>-- 复制结构和数据
CREATE TABLE users_backup AS SELECT * FROM users;</p>
<p>-- 复制部分数据
CREATE TABLE users_active AS
SELECT * FROM users WHERE status = 1;
</code></pre></p>
<h3>2.3.2 查看表</h3>
<pre><code class="language-sql">-- 查看所有表
SHOW TABLES;
<p>-- 查看表结构
DESC users;
-- 或
DESCRIBE users;
-- 或
SHOW COLUMNS FROM users;</p>
<p>-- 查看表创建语句
SHOW CREATE TABLE users;</p>
<p>-- 查看表状态
SHOW TABLE STATUS LIKE 'users'\G
</code></pre></p>
<h3>2.3.3 修改表</h3>
<p><strong>添加列：</strong></p>
<pre><code class="language-sql">-- 添加列到最后
ALTER TABLE users ADD COLUMN address VARCHAR(200);
<p>-- 添加列到第一个位置
ALTER TABLE users ADD COLUMN id_card CHAR(18) FIRST;</p>
<p>-- 添加列到指定位置之后
ALTER TABLE users ADD COLUMN city VARCHAR(50) AFTER address;</p>
<p>-- 添加多列
ALTER TABLE users
ADD COLUMN province VARCHAR(50),
ADD COLUMN country VARCHAR(50);
</code></pre></p>
<p><strong>修改列：</strong></p>
<pre><code class="language-sql">-- 修改列数据类型
ALTER TABLE users MODIFY COLUMN age TINYINT;
<p>-- 修改列名和数据类型
ALTER TABLE users CHANGE COLUMN age user_age INT;</p>
<p>-- 修改列默认值
ALTER TABLE users ALTER COLUMN status SET DEFAULT 1;</p>
<p>-- 删除列默认值
ALTER TABLE users ALTER COLUMN status DROP DEFAULT;
</code></pre></p>
<p><strong>删除列：</strong></p>
<pre><code class="language-sql">-- 删除列
ALTER TABLE users DROP COLUMN address;
<p>-- 删除多列
ALTER TABLE users
DROP COLUMN city,
DROP COLUMN province;
</code></pre></p>
<p><strong>修改表名：</strong></p>
<pre><code class="language-sql">-- 方法1
ALTER TABLE users RENAME TO members;
<p>-- 方法2
RENAME TABLE members TO users;</p>
<p>-- 重命名多个表
RENAME TABLE
old_table1 TO new_table1,
old_table2 TO new_table2;
</code></pre></p>
<p><strong>修改表字符集：</strong></p>
<pre><code class="language-sql">ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;
</code></pre>
<p><strong>修改表引擎：</strong></p>
<pre><code class="language-sql">ALTER TABLE users ENGINE=InnoDB;
</code></pre>
<h3>2.3.4 删除表</h3>
<pre><code class="language-sql">-- 删除表
DROP TABLE users;
<p>-- 如果存在则删除
DROP TABLE IF EXISTS users;</p>
<p>-- 删除多个表
DROP TABLE IF EXISTS users, orders, products;
</code></pre></p>
<h3>2.3.5 清空表</h3>
<pre><code class="language-sql">-- 方法1：TRUNCATE（快速，不能回滚）
TRUNCATE TABLE users;
<p>-- 方法2：DELETE（慢，可以回滚）
DELETE FROM users;
</code></pre></p>
<p><strong>TRUNCATE vs DELETE：</strong></p>
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
<td>速度</td>
<td>快</td>
<td>慢</td>
</tr>
<tr>
<td>自增ID</td>
<td>重置为1</td>
<td>不重置</td>
</tr>
<tr>
<td>事务回滚</td>
<td>不能回滚</td>
<td>可以回滚</td>
</tr>
<tr>
<td>触发器</td>
<td>不触发</td>
<td>触发</td>
</tr>
<tr>
<td>WHERE条件</td>
<td>不支持</td>
<td>支持</td>
</tr>
</tbody>
</table>
<hr>
<h2>2.4 数据类型详解</h2>
<h3>2.4.1 数值类型</h3>
<h4>整数类型</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>字节</th>
<th>有符号范围</th>
<th>无符号范围</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>TINYINT</strong></td>
<td>1</td>
<td>-128 ~ 127</td>
<td>0 ~ 255</td>
<td>年龄、状态</td>
</tr>
<tr>
<td><strong>SMALLINT</strong></td>
<td>2</td>
<td>-32768 ~ 32767</td>
<td>0 ~ 65535</td>
<td>小数值</td>
</tr>
<tr>
<td><strong>MEDIUMINT</strong></td>
<td>3</td>
<td>-8388608 ~ 8388607</td>
<td>0 ~ 16777215</td>
<td>中等数值</td>
</tr>
<tr>
<td><strong>INT</strong></td>
<td>4</td>
<td>-2147483648 ~ 2147483647</td>
<td>0 ~ 4294967295</td>
<td>常用整数</td>
</tr>
<tr>
<td><strong>BIGINT</strong></td>
<td>8</td>
<td>-2^63 ~ 2^63-1</td>
<td>0 ~ 2^64-1</td>
<td>大整数</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">CREATE TABLE number_demo (
    tiny_col TINYINT,                    -- -128 ~ 127
    tiny_unsigned TINYINT UNSIGNED,      -- 0 ~ 255
    small_col SMALLINT,
    int_col INT,
    big_col BIGINT,
    age TINYINT UNSIGNED,                -- 年龄 0-255
    status TINYINT DEFAULT 1             -- 状态
);
</code></pre>
<h4>浮点数和定点数</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>字节</th>
<th>说明</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>FLOAT</strong></td>
<td>4</td>
<td>单精度浮点数</td>
<td>不精确</td>
</tr>
<tr>
<td><strong>DOUBLE</strong></td>
<td>8</td>
<td>双精度浮点数</td>
<td>不精确</td>
</tr>
<tr>
<td><strong>DECIMAL(M,D)</strong></td>
<td>变长</td>
<td>定点数</td>
<td>精确（金额）</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">CREATE TABLE price_demo (
    price1 FLOAT(10, 2),           -- 不推荐用于金额
    price2 DOUBLE(10, 2),          -- 不推荐用于金额
    price3 DECIMAL(10, 2),         -- 推荐用于金额 ⭐
    salary DECIMAL(10, 2)          -- 工资
);
<p>-- 精度问题演示
INSERT INTO price_demo VALUES (1.23, 1.23, 1.23, 10000.50);
SELECT * FROM price_demo;
</code></pre></p>
<p><strong>重要：金额必须使用DECIMAL！</strong></p>
<h3>2.4.2 字符串类型</h3>
<h4>定长和变长字符串</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>最大长度</th>
<th>说明</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>CHAR(N)</strong></td>
<td>255字符</td>
<td>定长，不足补空格</td>
<td>固定长度（手机号、身份证）</td>
</tr>
<tr>
<td><strong>VARCHAR(N)</strong></td>
<td>65535字节</td>
<td>变长，节省空间</td>
<td>变长字符串（姓名、地址）</td>
</tr>
</tbody>
</table>
<p><strong>CHAR vs VARCHAR：</strong></p>
<pre><code class="language-sql">CREATE TABLE string_demo (
    phone CHAR(11),              -- 手机号固定11位
    id_card CHAR(18),            -- 身份证固定18位
    name VARCHAR(50),            -- 姓名变长
    address VARCHAR(200)         -- 地址变长
);
<p>-- CHAR会补空格
INSERT INTO string_demo (phone) VALUES ('13800138000');
-- 存储：'13800138000'（11字节）</p>
<p>-- VARCHAR不补空格
INSERT INTO string_demo (name) VALUES ('张三');
-- 存储：'张三' + 长度信息（2字符 + 1字节长度）
</code></pre></p>
<p><strong>选择建议：</strong></p>
<ul>
<li>固定长度 → CHAR（手机号、邮编、MD5）</li>
<li>变长 → VARCHAR（姓名、地址、描述）</li>
<li>长度差异大 → VARCHAR</li>
</ul>
<h4>文本类型</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>最大长度</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>TINYTEXT</strong></td>
<td>255字节</td>
<td>短文本</td>
</tr>
<tr>
<td><strong>TEXT</strong></td>
<td>65535字节 (64KB)</td>
<td>文章、评论</td>
</tr>
<tr>
<td><strong>MEDIUMTEXT</strong></td>
<td>16MB</td>
<td>长文章</td>
</tr>
<tr>
<td><strong>LONGTEXT</strong></td>
<td>4GB</td>
<td>超长文本</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    summary TEXT,              -- 摘要
    content MEDIUMTEXT,        -- 正文
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</code></pre>
<h4>二进制类型</h4>
<table>
<thead>
<tr>
<th>类型</th>
<th>最大长度</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>BINARY(N)</strong></td>
<td>255字节</td>
<td>定长二进制</td>
</tr>
<tr>
<td><strong>VARBINARY(N)</strong></td>
<td>65535字节</td>
<td>变长二进制</td>
</tr>
<tr>
<td><strong>BLOB</strong></td>
<td>65535字节</td>
<td>二进制大对象</td>
</tr>
<tr>
<td><strong>MEDIUMBLOB</strong></td>
<td>16MB</td>
<td>图片、文件</td>
</tr>
<tr>
<td><strong>LONGBLOB</strong></td>
<td>4GB</td>
<td>大文件</td>
</tr>
</tbody>
</table>
<p><strong>注意：</strong> 不推荐在数据库中存储文件，应该存储文件路径。</p>
<h3>2.4.3 日期和时间类型</h3>
<table>
<thead>
<tr>
<th>类型</th>
<th>格式</th>
<th>范围</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>DATE</strong></td>
<td>YYYY-MM-DD</td>
<td>1000-01-01 ~ 9999-12-31</td>
<td>日期</td>
</tr>
<tr>
<td><strong>TIME</strong></td>
<td>HH:MM:SS</td>
<td>-838:59:59 ~ 838:59:59</td>
<td>时间</td>
</tr>
<tr>
<td><strong>DATETIME</strong></td>
<td>YYYY-MM-DD HH:MM:SS</td>
<td>1000-01-01 ~ 9999-12-31</td>
<td>日期时间</td>
</tr>
<tr>
<td><strong>TIMESTAMP</strong></td>
<td>YYYY-MM-DD HH:MM:SS</td>
<td>1970-01-01 ~ 2038-01-19</td>
<td>时间戳</td>
</tr>
<tr>
<td><strong>YEAR</strong></td>
<td>YYYY</td>
<td>1901 ~ 2155</td>
<td>年份</td>
</tr>
</tbody>
</table>
<p><strong>DATETIME vs TIMESTAMP：</strong></p>
<table>
<thead>
<tr>
<th>特性</th>
<th>DATETIME</th>
<th>TIMESTAMP</th>
</tr>
</thead>
<tbody>
<tr>
<td>存储空间</td>
<td>8字节</td>
<td>4字节</td>
</tr>
<tr>
<td>时区</td>
<td>不转换</td>
<td>自动转换</td>
</tr>
<tr>
<td>范围</td>
<td>1000-9999年</td>
<td>1970-2038年</td>
</tr>
<tr>
<td>默认值</td>
<td>不能自动更新</td>
<td>可以自动更新</td>
</tr>
</tbody>
</table>
<p><strong>示例：</strong></p>
<pre><code class="language-sql">CREATE TABLE time_demo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    birth_date DATE,                    -- 出生日期
    work_time TIME,                     -- 工作时长
    meeting_time DATETIME,              -- 会议时间
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,              -- 创建时间
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 更新时间
);
<p>-- 插入数据
INSERT INTO time_demo (birth_date, work_time, meeting_time)
VALUES ('1990-01-01', '08:30:00', '2024-11-01 14:00:00');</p>
<p>-- 查询
SELECT
birth_date,
work_time,
meeting_time,
create_time,
update_time
FROM time_demo;
</code></pre></p>
<p><strong>自动时间戳：</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    -- 创建时自动设置，不会更新
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- 创建和更新时都自动设置
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
</code></pre>
<h3>2.4.4 枚举和集合类型</h3>
<p><strong>ENUM（枚举）：</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    gender ENUM('M', 'F', 'U') DEFAULT 'U',  -- 性别：男、女、未知
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active'
);
<p>-- 插入数据
INSERT INTO users (name, gender, status)
VALUES ('张三', 'M', 'active');</p>
<p>-- 可以使用索引
INSERT INTO users (name, gender)
VALUES ('李四', 1);  -- 1代表'M'
</code></pre></p>
<p><strong>SET（集合）：</strong></p>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    hobbies SET('reading', 'sports', 'music', 'travel')
);
<p>-- 插入数据（可以选择多个）
INSERT INTO users (name, hobbies)
VALUES ('张三', 'reading,sports');</p>
<p>INSERT INTO users (name, hobbies)
VALUES ('李四', 'music,travel,reading');</p>
<p>-- 查询包含某个爱好的用户
SELECT * FROM users WHERE FIND_IN_SET('reading', hobbies);
</code></pre></p>
<h3>2.4.5 JSON类型（MySQL 5.7+）</h3>
<pre><code class="language-sql">CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    attributes JSON
);
<p>-- 插入JSON数据
INSERT INTO products (name, attributes) VALUES
('iPhone 15', '{&quot;color&quot;: &quot;black&quot;, &quot;storage&quot;: &quot;256GB&quot;, &quot;price&quot;: 7999}'),
('MacBook Pro', '{&quot;cpu&quot;: &quot;M3&quot;, &quot;ram&quot;: &quot;16GB&quot;, &quot;ssd&quot;: &quot;512GB&quot;}');</p>
<p>-- 查询JSON字段
SELECT
name,
attributes-&gt;'$.color' AS color,
attributes-&gt;'$.price' AS price
FROM products;</p>
<p>-- 更新JSON字段
UPDATE products
SET attributes = JSON_SET(attributes, '$.price', 7499)
WHERE name = 'iPhone 15';
</code></pre></p>
<hr>
<h2>2.5 约束详解</h2>
<h3>2.5.1 主键约束（PRIMARY KEY）</h3>
<p><strong>特点：</strong></p>
<ul>
<li>唯一标识每一行</li>
<li>不能为NULL</li>
<li>一个表只能有一个主键</li>
<li>自动创建索引</li>
</ul>
<p><strong>单列主键：</strong></p>
<pre><code class="language-sql">-- 方法1：列级约束
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
<p>-- 方法2：表级约束
CREATE TABLE users (
id INT,
name VARCHAR(50),
PRIMARY KEY (id)
);
</code></pre></p>
<p><strong>复合主键：</strong></p>
<pre><code class="language-sql">CREATE TABLE order_items (
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    PRIMARY KEY (order_id, product_id)
);
</code></pre>
<p><strong>添加/删除主键：</strong></p>
<pre><code class="language-sql">-- 添加主键
ALTER TABLE users ADD PRIMARY KEY (id);
<p>-- 删除主键
ALTER TABLE users DROP PRIMARY KEY;</p>
<p>-- 修改主键（先删除再添加）
ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE users ADD PRIMARY KEY (id);
</code></pre></p>
<h3>2.5.2 自增约束（AUTO_INCREMENT）</h3>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
<p>-- 插入数据（id自动增长）
INSERT INTO users (name) VALUES ('张三');
INSERT INTO users (name) VALUES ('李四');</p>
<p>-- 查看当前自增值
SHOW TABLE STATUS LIKE 'users';</p>
<p>-- 修改自增起始值
ALTER TABLE users AUTO_INCREMENT = 1000;</p>
<p>-- 重置自增值
TRUNCATE TABLE users;  -- 重置为1
</code></pre></p>
<h3>2.5.3 非空约束（NOT NULL）</h3>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,      -- 不能为NULL
    email VARCHAR(100),                 -- 可以为NULL
    age INT NOT NULL DEFAULT 0          -- 不能为NULL，默认0
);
<p>-- 添加非空约束
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NOT NULL;</p>
<p>-- 删除非空约束
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NULL;
</code></pre></p>
<h3>2.5.4 唯一约束（UNIQUE）</h3>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,  -- 唯一
    email VARCHAR(100) UNIQUE,             -- 唯一，可以为NULL
    phone CHAR(11),
    UNIQUE KEY uk_phone (phone)            -- 表级唯一约束
);
<p>-- 复合唯一约束
CREATE TABLE user_roles (
user_id INT,
role_id INT,
UNIQUE KEY uk_user_role (user_id, role_id)
);</p>
<p>-- 添加唯一约束
ALTER TABLE users ADD UNIQUE KEY uk_email (email);</p>
<p>-- 删除唯一约束
ALTER TABLE users DROP INDEX uk_email;
</code></pre></p>
<h3>2.5.5 默认值约束（DEFAULT）</h3>
<pre><code class="language-sql">CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    gender ENUM('M', 'F', 'U') DEFAULT 'U',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
<p>-- 添加默认值
ALTER TABLE users ALTER COLUMN age SET DEFAULT 18;</p>
<p>-- 删除默认值
ALTER TABLE users ALTER COLUMN age DROP DEFAULT;
</code></pre></p>
<h3>2.5.6 外键约束（FOREIGN KEY）</h3>
<p><strong>创建外键：</strong></p>
<pre><code class="language-sql">-- 父表
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB;
<p>-- 子表
CREATE TABLE employees (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES departments(id)
) ENGINE=InnoDB;
</code></pre></p>
<p><strong>外键约束选项：</strong></p>
<pre><code class="language-sql">CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
        ON DELETE CASCADE      -- 删除父表记录时，删除子表记录
        ON UPDATE CASCADE      -- 更新父表记录时，更新子表记录
) ENGINE=InnoDB;
</code></pre>
<p><strong>外键约束动作：</strong></p>
<table>
<thead>
<tr>
<th>动作</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>CASCADE</strong></td>
<td>级联操作（删除/更新父表时，同步子表）</td>
</tr>
<tr>
<td><strong>SET NULL</strong></td>
<td>设置为NULL</td>
</tr>
<tr>
<td><strong>RESTRICT</strong></td>
<td>拒绝操作（默认）</td>
</tr>
<tr>
<td><strong>NO ACTION</strong></td>
<td>不做任何操作</td>
</tr>
</tbody>
</table>
<p><strong>添加/删除外键：</strong></p>
<pre><code class="language-sql">-- 添加外键
ALTER TABLE employees
ADD CONSTRAINT fk_dept
FOREIGN KEY (department_id) REFERENCES departments(id);
<p>-- 删除外键
ALTER TABLE employees DROP FOREIGN KEY fk_dept;</p>
<p>-- 查看外键
SHOW CREATE TABLE employees;
</code></pre></p>
<p><strong>注意：</strong> 生产环境中，外键约束可能影响性能，很多公司不使用外键，而是在应用层保证数据一致性。</p>
<h3>2.5.7 检查约束（CHECK）- MySQL 8.0+</h3>
<pre><code class="language-sql">-- MySQL 8.0支持CHECK约束
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT CHECK (age &gt;= 0 AND age &lt;= 150),
    email VARCHAR(100) CHECK (email LIKE '%@%')
);
<p>-- MySQL 5.7不支持CHECK，可以使用触发器实现
</code></pre></p>
<hr>
<h2>2.6 字符集和排序规则</h2>
<h3>2.6.1 字符集（Character Set）</h3>
<p><strong>常用字符集：</strong></p>
<table>
<thead>
<tr>
<th>字符集</th>
<th>说明</th>
<th>每字符字节数</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>latin1</strong></td>
<td>西欧字符集</td>
<td>1</td>
</tr>
<tr>
<td><strong>gbk</strong></td>
<td>简体中文</td>
<td>2</td>
</tr>
<tr>
<td><strong>utf8</strong></td>
<td>Unicode（最多3字节）</td>
<td>1-3</td>
</tr>
<tr>
<td><strong>utf8mb4</strong></td>
<td>Unicode（最多4字节）⭐ 推荐</td>
<td>1-4</td>
</tr>
</tbody>
</table>
<p><strong>utf8 vs utf8mb4：</strong></p>
<ul>
<li><strong>utf8</strong>：最多3字节，不支持emoji和部分生僻字</li>
<li><strong>utf8mb4</strong>：最多4字节，支持emoji ⭐ 推荐使用</li>
</ul>
<p><strong>查看字符集：</strong></p>
<pre><code class="language-sql">-- 查看支持的字符集
SHOW CHARACTER SET;
<p>-- 查看当前字符集
SHOW VARIABLES LIKE 'character%';</p>
<p>-- 查看数据库字符集
SHOW CREATE DATABASE mydb;</p>
<p>-- 查看表字符集
SHOW CREATE TABLE users;
</code></pre></p>
<p><strong>设置字符集：</strong></p>
<pre><code class="language-sql">-- 服务器级别（my.cnf）
[mysqld]
character-set-server=utf8mb4
<p>-- 数据库级别
CREATE DATABASE mydb CHARACTER SET utf8mb4;
ALTER DATABASE mydb CHARACTER SET utf8mb4;</p>
<p>-- 表级别
CREATE TABLE users (
id INT,
name VARCHAR(50)
) CHARACTER SET utf8mb4;</p>
<p>ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4;</p>
<p>-- 列级别
CREATE TABLE users (
id INT,
name VARCHAR(50) CHARACTER SET utf8mb4
);
</code></pre></p>
<h3>2.6.2 排序规则（Collation）</h3>
<p><strong>常用排序规则：</strong></p>
<table>
<thead>
<tr>
<th>排序规则</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>utf8mb4_general_ci</strong></td>
<td>不区分大小写，性能好</td>
</tr>
<tr>
<td><strong>utf8mb4_unicode_ci</strong></td>
<td>不区分大小写，准确性好 ⭐ 推荐</td>
</tr>
<tr>
<td><strong>utf8mb4_bin</strong></td>
<td>区分大小写，二进制比较</td>
</tr>
</tbody>
</table>
<p><strong>查看排序规则：</strong></p>
<pre><code class="language-sql">-- 查看支持的排序规则
SHOW COLLATION LIKE 'utf8mb4%';
<p>-- 查看当前排序规则
SHOW VARIABLES LIKE 'collation%';
</code></pre></p>
<p><strong>设置排序规则：</strong></p>
<pre><code class="language-sql">-- 数据库级别
CREATE DATABASE mydb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
<p>-- 表级别
CREATE TABLE users (
id INT,
name VARCHAR(50)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;</p>
<p>-- 列级别
CREATE TABLE users (
id INT,
name VARCHAR(50) COLLATE utf8mb4_bin  -- 区分大小写
);
</code></pre></p>
<p><strong>排序规则影响：</strong></p>
<pre><code class="language-sql">-- 创建测试表
CREATE TABLE test (
    name VARCHAR(50)
) COLLATE utf8mb4_general_ci;
<p>INSERT INTO test VALUES ('ABC'), ('abc'), ('Abc');</p>
<p>-- 不区分大小写查询
SELECT * FROM test WHERE name = 'abc';
-- 返回所有3条记录</p>
<p>-- 如果使用utf8mb4_bin
ALTER TABLE test COLLATE utf8mb4_bin;
SELECT * FROM test WHERE name = 'abc';
-- 只返回1条记录
</code></pre></p>
<hr>
<h2>2.7 存储引擎</h2>
<h3>2.7.1 查看存储引擎</h3>
<pre><code class="language-sql">-- 查看支持的存储引擎
SHOW ENGINES;
<p>-- 查看默认存储引擎
SHOW VARIABLES LIKE 'default_storage_engine';</p>
<p>-- 查看表的存储引擎
SHOW TABLE STATUS LIKE 'users';
</code></pre></p>
<h3>2.7.2 指定存储引擎</h3>
<pre><code class="language-sql">-- 创建表时指定
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
) ENGINE=InnoDB;
<p>-- 修改表的存储引擎
ALTER TABLE users ENGINE=MyISAM;
</code></pre></p>
<p><strong>常用存储引擎：</strong></p>
<ul>
<li><strong>InnoDB</strong>：默认引擎，支持事务、外键 ⭐ 推荐</li>
<li><strong>MyISAM</strong>：不支持事务，查询速度快</li>
<li><strong>Memory</strong>：内存表，速度快但数据易丢失</li>
</ul>
<p>详细内容见：<a href="/mysql/02/07.html">第07章：存储引擎</a></p>
<hr>
<h2>2.8 实战练习</h2>
<h3>练习1：创建电商数据库</h3>
<pre><code class="language-sql">-- 创建数据库
CREATE DATABASE IF NOT EXISTS shop
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
<p>USE shop;</p>
<p>-- 用户表
CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(100) NOT NULL,
email VARCHAR(100),
phone CHAR(11),
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
INDEX idx_phone (phone)
) ENGINE=InnoDB COMMENT='用户表';</p>
<p>-- 商品分类表
CREATE TABLE categories (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(50) NOT NULL,
parent_id INT DEFAULT 0,
sort_order INT DEFAULT 0,
INDEX idx_parent (parent_id)
) ENGINE=InnoDB COMMENT='商品分类表';</p>
<p>-- 商品表
CREATE TABLE products (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(200) NOT NULL,
category_id INT,
price DECIMAL(10, 2) NOT NULL,
stock INT DEFAULT 0,
description TEXT,
status TINYINT DEFAULT 1,
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
INDEX idx_category (category_id),
INDEX idx_price (price)
) ENGINE=InnoDB COMMENT='商品表';</p>
<p>-- 订单表
CREATE TABLE orders (
id INT PRIMARY KEY AUTO_INCREMENT,
order_no VARCHAR(50) NOT NULL UNIQUE,
user_id INT NOT NULL,
total_amount DECIMAL(10, 2) NOT NULL,
status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
INDEX idx_user (user_id),
INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='订单表';</p>
<p>-- 订单明细表
CREATE TABLE order_items (
id INT PRIMARY KEY AUTO_INCREMENT,
order_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL,
price DECIMAL(10, 2) NOT NULL,
INDEX idx_order (order_id),
INDEX idx_product (product_id)
) ENGINE=InnoDB COMMENT='订单明细表';
</code></pre></p>
<h3>练习2：修改表结构</h3>
<pre><code class="language-sql">-- 1. 给users表添加地址字段
ALTER TABLE users ADD COLUMN address VARCHAR(200);
<p>-- 2. 修改phone字段为非空
ALTER TABLE users MODIFY COLUMN phone CHAR(11) NOT NULL;</p>
<p>-- 3. 给products表添加销量字段
ALTER TABLE products ADD COLUMN sales INT DEFAULT 0 AFTER stock;</p>
<p>-- 4. 创建索引
CREATE INDEX idx_sales ON products(sales);</p>
<p>-- 5. 修改订单表，添加收货地址
ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(200);
</code></pre></p>
<hr>
<h2>2.9 小结</h2>
<p>本章学习了DDL数据定义语言：</p>
<ul>
<li>✅ 数据库的创建、修改、删除</li>
<li>✅ 数据表的创建、修改、删除</li>
<li>✅ 所有数据类型及使用场景</li>
<li>✅ 各种约束的使用</li>
<li>✅ 字符集和排序规则</li>
<li>✅ 存储引擎的选择</li>
</ul>
<p><strong>重点掌握：</strong></p>
<ol>
<li>数据类型的选择（金额用DECIMAL，日期用TIMESTAMP）</li>
<li>字符集使用utf8mb4</li>
<li>主键、唯一、非空约束</li>
<li>自动时间戳的使用</li>
</ol>
<p><strong>下一章预告：</strong> SQL基础 - DML数据操作语言</p>
<hr>
<h2>练习题</h2>
<ol>
<li>创建一个博客系统的数据库，包含用户表、文章表、评论表</li>
<li>为表添加合适的约束和索引</li>
<li>使用utf8mb4字符集</li>
<li>设置自动时间戳字段</li>
<li>练习修改表结构的各种操作</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/01/03-sql-dml.html">第03章：SQL基础-DML</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/mysql/01/01-mysql.html" class="fn-left">上一篇：第01章：MySQL概述与安装</a>
            <a href="/mysql/01/03-sql-dml.html" class="fn-right">下一篇：第03章：SQL基础</a>
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
