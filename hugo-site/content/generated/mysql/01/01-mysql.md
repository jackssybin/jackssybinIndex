---
title: 第01章：MySQL概述与安装 - MySQL教程
description: 第01章：MySQL概述与安装 1.1 MySQL简介 1.1.1 什么是MySQL
  MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL
  AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。 1.1.2
  MySQL的特点 开源免费 ：社区版完全免费 性...
url: /mysql/01/01-mysql.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第01章：MySQL概述与安装</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>MySQL教程目录</h3>
    <section>
      <h4>入门导航</h4>
      <a class="" href="/mysql/mysql.html">MySQL从新手到专家完整学习路线图</a>
    </section>
<section>
      <h4>01</h4>
      <a class="current" href="/mysql/01/01-mysql.html">第01章：MySQL概述与安装</a>
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
            <h2><a rel="bookmark" href="/mysql/01/01-mysql.html">第01章：MySQL概述与安装</a></h2>
            <div class="meta"><span>MySQL教程 / 01</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第01章：MySQL概述与安装</h1>
<h2>1.1 MySQL简介</h2>
<h3>1.1.1 什么是MySQL</h3>
<p>MySQL是一个开源的关系型数据库管理系统（RDBMS），由瑞典MySQL AB公司开发，目前属于Oracle公司。MySQL是最流行的关系型数据库管理系统之一，在Web应用方面，MySQL是最好的应用软件之一。</p>
<h3>1.1.2 MySQL的特点</h3>
<ul>
<li><strong>开源免费</strong>：社区版完全免费</li>
<li><strong>性能卓越</strong>：执行速度快，适合高并发场景</li>
<li><strong>可靠性高</strong>：成熟稳定，被广泛应用</li>
<li><strong>使用简单</strong>：易于安装和使用</li>
<li><strong>跨平台</strong>：支持多种操作系统</li>
<li><strong>支持大型数据库</strong>：可以处理拥有上千万条记录的大型数据库</li>
</ul>
<h3>1.1.3 MySQL版本选择</h3>
<p><strong>主要版本：</strong></p>
<ul>
<li><strong>MySQL 5.5</strong>：较老版本，不推荐新项目使用</li>
<li><strong>MySQL 5.6</strong>：改进了性能和复制功能</li>
<li><strong>MySQL 5.7</strong>：⭐ 本教程重点，生产环境广泛使用
<ul>
<li>性能提升显著</li>
<li>支持JSON数据类型</li>
<li>改进的复制功能</li>
<li>更好的性能模式（Performance Schema）</li>
</ul>
</li>
<li><strong>MySQL 8.0</strong>：最新版本
<ul>
<li>默认字符集改为utf8mb4</li>
<li>支持窗口函数</li>
<li>支持CTE（公共表表达式）</li>
<li>移除了查询缓存</li>
</ul>
</li>
</ul>
<p><strong>本教程选择MySQL 5.7的原因：</strong></p>
<ol>
<li>生产环境使用最广泛</li>
<li>稳定性经过充分验证</li>
<li>大量企业仍在使用</li>
<li>学习5.7后升级到8.0很容易</li>
</ol>
<hr>
<h2>1.2 MySQL 5.7 在Windows上的安装</h2>
<h3>1.2.1 下载MySQL 5.7</h3>
<ol>
<li>访问MySQL官网：<a href="https://dev.mysql.com/downloads/mysql/5.7.html">https://dev.mysql.com/downloads/mysql/5.7.html</a></li>
<li>选择Windows版本</li>
<li>下载ZIP Archive版本（推荐）或MSI Installer版本</li>
</ol>
<p><strong>推荐下载：</strong> <code>mysql-5.7.44-winx64.zip</code></p>
<h3>1.2.2 ZIP版本安装步骤</h3>
<h4>步骤1：解压文件</h4>
<pre><code>解压到：D:\mysql-5.7.44
</code></pre>
<h4>步骤2：创建配置文件</h4>
<p>在MySQL根目录下创建 <code>my.ini</code> 文件：</p>
<pre><code class="language-ini">[mysqld]
# 设置MySQL的安装目录
basedir=D:\\mysql-5.7.44
# 设置MySQL数据库的数据存放目录
datadir=D:\\mysql-5.7.44\\data
# 设置端口
port=3306
# 允许最大连接数
max_connections=200
# 允许连接失败的次数
max_connect_errors=10
# 服务端使用的字符集
character-set-server=utf8mb4
# 默认存储引擎
default-storage-engine=INNODB
# 默认使用&quot;mysql_native_password&quot;插件认证
default_authentication_plugin=mysql_native_password
<p>[mysql]</p>
<h1>客户端使用的字符集</h1>
<p>default-character-set=utf8mb4</p>
<p>[client]</p>
<h1>客户端默认端口</h1>
<p>port=3306
default-character-set=utf8mb4
</code></pre></p>
<h4>步骤3：初始化MySQL</h4>
<p>以<strong>管理员身份</strong>打开CMD，进入MySQL的bin目录：</p>
<pre><code class="language-cmd">cd D:\mysql-5.7.44\bin
<h1>初始化MySQL（会生成随机密码）</h1>
<p>mysqld --initialize --console
</code></pre></p>
<p><strong>重要：</strong> 记录控制台输出的临时密码，类似：</p>
<pre><code>[Note] A temporary password is generated for root@localhost: kq7wK&gt;iu(3pN
</code></pre>
<h4>步骤4：安装MySQL服务</h4>
<pre><code class="language-cmd"># 安装服务
mysqld --install MySQL57
<h1>启动服务</h1>
<p>net start MySQL57
</code></pre></p>
<h4>步骤5：修改root密码</h4>
<pre><code class="language-cmd"># 登录MySQL（使用临时密码）
mysql -u root -p
<h1>修改密码</h1>
<p>ALTER USER 'root'@'localhost' IDENTIFIED BY '你的新密码';</p>
<h1>刷新权限</h1>
<p>FLUSH PRIVILEGES;
</code></pre></p>
<h4>步骤6：配置环境变量（可选）</h4>
<p>将 <code>D:\mysql-5.7.44\bin</code> 添加到系统环境变量PATH中，方便在任意位置使用mysql命令。</p>
<h3>1.2.3 MSI安装器安装（简化版）</h3>
<ol>
<li>双击下载的MSI文件</li>
<li>选择&quot;Custom&quot;自定义安装</li>
<li>选择安装组件（MySQL Server、MySQL Workbench等）</li>
<li>配置MySQL Server
<ul>
<li>选择端口（默认3306）</li>
<li>设置root密码</li>
<li>配置Windows服务</li>
</ul>
</li>
<li>完成安装</li>
</ol>
<h3>1.2.4 验证安装</h3>
<pre><code class="language-cmd"># 查看MySQL版本
mysql --version
<h1>登录MySQL</h1>
<p>mysql -u root -p</p>
<h1>查看数据库</h1>
<p>SHOW DATABASES;</p>
<h1>查看当前用户</h1>
<p>SELECT USER();
</code></pre></p>
<hr>
<h2>1.3 MySQL 5.7 在Linux上的安装</h2>
<h3>1.3.1 CentOS/RHEL安装（YUM方式）</h3>
<h4>步骤1：下载MySQL YUM Repository</h4>
<pre><code class="language-bash"># 下载MySQL YUM Repository
wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
<h1>安装Repository</h1>
<p>sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm</p>
<h1>验证Repository</h1>
<p>yum repolist enabled | grep mysql
</code></pre></p>
<h4>步骤2：安装MySQL</h4>
<pre><code class="language-bash"># 安装MySQL服务器
sudo yum install mysql-community-server
<h1>启动MySQL服务</h1>
<p>sudo systemctl start mysqld</p>
<h1>设置开机自启</h1>
<p>sudo systemctl enable mysqld
</code></pre></p>
<h4>步骤3：获取临时密码</h4>
<pre><code class="language-bash"># 查看临时密码
sudo grep 'temporary password' /var/log/mysqld.log
</code></pre>
<h4>步骤4：安全配置</h4>
<pre><code class="language-bash"># 登录MySQL
mysql -u root -p
<h1>修改密码（MySQL 5.7密码策略较严格）</h1>
<p>ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourPassword@123';</p>
<h1>或者运行安全配置脚本</h1>
<p>mysql_secure_installation
</code></pre></p>
<p><strong>安全配置脚本会提示：</strong></p>
<ul>
<li>修改root密码</li>
<li>删除匿名用户</li>
<li>禁止root远程登录</li>
<li>删除test数据库</li>
<li>重新加载权限表</li>
</ul>
<h3>1.3.2 Ubuntu/Debian安装（APT方式）</h3>
<pre><code class="language-bash"># 更新包索引
sudo apt update
<h1>安装MySQL服务器</h1>
<p>sudo apt install mysql-server-5.7</p>
<h1>启动MySQL服务</h1>
<p>sudo systemctl start mysql</p>
<h1>设置开机自启</h1>
<p>sudo systemctl enable mysql</p>
<h1>运行安全配置</h1>
<p>sudo mysql_secure_installation
</code></pre></p>
<h3>1.3.3 通用二进制包安装</h3>
<h4>步骤1：下载并解压</h4>
<pre><code class="language-bash"># 下载
wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.44-linux-glibc2.12-x86_64.tar.gz
<h1>解压</h1>
<p>tar -zxvf mysql-5.7.44-linux-glibc2.12-x86_64.tar.gz</p>
<h1>移动到安装目录</h1>
<p>sudo mv mysql-5.7.44-linux-glibc2.12-x86_64 /usr/local/mysql
</code></pre></p>
<h4>步骤2：创建MySQL用户和组</h4>
<pre><code class="language-bash"># 创建mysql用户组
sudo groupadd mysql
<h1>创建mysql用户</h1>
<p>sudo useradd -r -g mysql -s /bin/false mysql
</code></pre></p>
<h4>步骤3：创建数据目录并设置权限</h4>
<pre><code class="language-bash"># 创建数据目录
sudo mkdir -p /usr/local/mysql/data
<h1>设置所有者</h1>
<p>sudo chown -R mysql:mysql /usr/local/mysql
</code></pre></p>
<h4>步骤4：初始化MySQL</h4>
<pre><code class="language-bash">cd /usr/local/mysql
<h1>初始化</h1>
<p>sudo bin/mysqld --initialize --user=mysql --basedir=/usr/local/mysql --datadir=/usr/local/mysql/data</p>
<h1>记录输出的临时密码</h1>
<p></code></pre></p>
<h4>步骤5：配置my.cnf</h4>
<pre><code class="language-bash">sudo vi /etc/my.cnf
</code></pre>
<p>添加以下内容：</p>
<pre><code class="language-ini">[mysqld]
basedir=/usr/local/mysql
datadir=/usr/local/mysql/data
socket=/tmp/mysql.sock
port=3306
user=mysql
character-set-server=utf8mb4
default-storage-engine=INNODB
<p>[mysql]
default-character-set=utf8mb4</p>
<p>[client]
port=3306
socket=/tmp/mysql.sock
default-character-set=utf8mb4
</code></pre></p>
<h4>步骤6：配置系统服务</h4>
<pre><code class="language-bash"># 复制启动脚本
sudo cp support-files/mysql.server /etc/init.d/mysqld
<h1>设置执行权限</h1>
<p>sudo chmod +x /etc/init.d/mysqld</p>
<h1>启动MySQL</h1>
<p>sudo /etc/init.d/mysqld start</p>
<h1>设置开机自启</h1>
<p>sudo chkconfig --add mysqld
sudo chkconfig mysqld on
</code></pre></p>
<h4>步骤7：配置环境变量</h4>
<pre><code class="language-bash"># 编辑profile
sudo vi /etc/profile
<h1>添加以下内容</h1>
<p>export PATH=$PATH:/usr/local/mysql/bin</p>
<h1>使配置生效</h1>
<p>source /etc/profile
</code></pre></p>
<h3>1.3.4 防火墙配置</h3>
<p><strong>CentOS 7/8 (firewalld):</strong></p>
<pre><code class="language-bash"># 开放3306端口
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
</code></pre>
<p><strong>Ubuntu (ufw):</strong></p>
<pre><code class="language-bash"># 开放3306端口
sudo ufw allow 3306/tcp
</code></pre>
<p><strong>iptables:</strong></p>
<pre><code class="language-bash"># 开放3306端口
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
sudo service iptables save
</code></pre>
<hr>
<h2>1.4 MySQL配置文件详解</h2>
<h3>1.4.1 配置文件位置</h3>
<p><strong>Windows:</strong></p>
<ul>
<li><code>my.ini</code> 在MySQL安装目录下</li>
</ul>
<p><strong>Linux:</strong>
MySQL按以下顺序读取配置文件：</p>
<ol>
<li><code>/etc/my.cnf</code></li>
<li><code>/etc/mysql/my.cnf</code></li>
<li><code>/usr/local/mysql/etc/my.cnf</code></li>
<li><code>~/.my.cnf</code></li>
</ol>
<p>查看配置文件读取顺序：</p>
<pre><code class="language-bash">mysql --help | grep my.cnf
</code></pre>
<h3>1.4.2 重要配置参数详解</h3>
<h4>基础配置</h4>
<pre><code class="language-ini">[mysqld]
# MySQL安装目录
basedir=/usr/local/mysql
<h1>数据存放目录</h1>
<p>datadir=/usr/local/mysql/data</p>
<h1>端口号</h1>
<p>port=3306</p>
<h1>socket文件位置</h1>
<p>socket=/tmp/mysql.sock</p>
<h1>进程ID文件</h1>
<p>pid-file=/usr/local/mysql/data/mysqld.pid</p>
<h1>错误日志</h1>
<p>log-error=/usr/local/mysql/data/error.log
</code></pre></p>
<h4>字符集配置</h4>
<pre><code class="language-ini"># 服务器字符集（推荐utf8mb4，支持emoji）
character-set-server=utf8mb4
<h1>排序规则</h1>
<p>collation-server=utf8mb4_unicode_ci</p>
<h1>初始化连接字符集</h1>
<p>init_connect='SET NAMES utf8mb4'
</code></pre></p>
<h4>连接配置</h4>
<pre><code class="language-ini"># 最大连接数
max_connections=500
<h1>最大错误连接数</h1>
<p>max_connect_errors=100</p>
<h1>连接超时时间（秒）</h1>
<p>wait_timeout=28800</p>
<h1>交互式连接超时时间</h1>
<p>interactive_timeout=28800
</code></pre></p>
<h4>InnoDB配置（重要）</h4>
<pre><code class="language-ini"># 默认存储引擎
default-storage-engine=INNODB
<h1>InnoDB缓冲池大小（建议设置为物理内存的50%-70%）</h1>
<p>innodb_buffer_pool_size=1G</p>
<h1>InnoDB日志文件大小</h1>
<p>innodb_log_file_size=256M</p>
<h1>InnoDB日志缓冲区大小</h1>
<p>innodb_log_buffer_size=16M</p>
<h1>InnoDB刷新日志到磁盘的策略（1最安全但性能较低）</h1>
<p>innodb_flush_log_at_trx_commit=1</p>
<h1>InnoDB数据文件刷新方法</h1>
<p>innodb_flush_method=O_DIRECT</p>
<h1>InnoDB文件每表独立</h1>
<p>innodb_file_per_table=1
</code></pre></p>
<h4>日志配置</h4>
<pre><code class="language-ini"># 开启慢查询日志
slow_query_log=1
<h1>慢查询日志文件</h1>
<p>slow_query_log_file=/usr/local/mysql/data/slow.log</p>
<h1>慢查询时间阈值（秒）</h1>
<p>long_query_time=2</p>
<h1>记录没有使用索引的查询</h1>
<p>log_queries_not_using_indexes=1</p>
<h1>开启二进制日志（主从复制必须）</h1>
<p>log-bin=mysql-bin</p>
<h1>二进制日志格式（ROW/STATEMENT/MIXED）</h1>
<p>binlog_format=ROW</p>
<h1>二进制日志过期时间（天）</h1>
<p>expire_logs_days=7
</code></pre></p>
<h3>1.4.3 查看和修改配置</h3>
<p><strong>查看配置：</strong></p>
<pre><code class="language-sql">-- 查看所有配置
SHOW VARIABLES;
<p>-- 查看特定配置
SHOW VARIABLES LIKE 'max_connections';</p>
<p>-- 查看字符集配置
SHOW VARIABLES LIKE 'character%';
</code></pre></p>
<p><strong>动态修改配置（临时生效）：</strong></p>
<pre><code class="language-sql">-- 修改最大连接数
SET GLOBAL max_connections=1000;
</code></pre>
<p><strong>永久修改：</strong>
修改配置文件后重启MySQL服务。</p>
<hr>
<h2>1.5 常用客户端工具</h2>
<h3>1.5.1 命令行客户端</h3>
<p><strong>mysql命令行：</strong></p>
<pre><code class="language-bash"># 基本登录
mysql -u root -p
<h1>指定主机和端口</h1>
<p>mysql -h 192.168.1.100 -P 3306 -u root -p</p>
<h1>执行SQL文件</h1>
<p>mysql -u root -p &lt; script.sql</p>
<h1>执行SQL语句</h1>
<p>mysql -u root -p -e &quot;SHOW DATABASES;&quot;
</code></pre></p>
<p><strong>mysqladmin工具：</strong></p>
<pre><code class="language-bash"># 查看服务器状态
mysqladmin -u root -p status
<h1>查看变量</h1>
<p>mysqladmin -u root -p variables</p>
<h1>刷新权限</h1>
<p>mysqladmin -u root -p flush-privileges</p>
<h1>关闭MySQL</h1>
<p>mysqladmin -u root -p shutdown
</code></pre></p>
<h3>1.5.2 图形化客户端</h3>
<p><strong>MySQL Workbench（官方）：</strong></p>
<ul>
<li>免费开源</li>
<li>功能强大</li>
<li>支持数据建模、SQL开发、服务器管理</li>
<li>下载：<a href="https://dev.mysql.com/downloads/workbench/">https://dev.mysql.com/downloads/workbench/</a></li>
</ul>
<p><strong>Navicat for MySQL（商业）：</strong></p>
<ul>
<li>界面友好</li>
<li>功能丰富</li>
<li>支持数据同步、备份、导入导出</li>
</ul>
<p><strong>DBeaver（免费）：</strong></p>
<ul>
<li>开源免费</li>
<li>支持多种数据库</li>
<li>功能全面</li>
</ul>
<p><strong>HeidiSQL（免费，Windows）：</strong></p>
<ul>
<li>轻量级</li>
<li>界面简洁</li>
<li>适合日常使用</li>
</ul>
<p><strong>phpMyAdmin（Web）：</strong></p>
<ul>
<li>基于Web的管理工具</li>
<li>适合远程管理</li>
<li>需要PHP环境</li>
</ul>
<h3>1.5.3 推荐工具组合</h3>
<p><strong>开发环境：</strong></p>
<ul>
<li>MySQL Workbench（数据建模）</li>
<li>Navicat或DBeaver（日常开发）</li>
</ul>
<p><strong>生产环境：</strong></p>
<ul>
<li>命令行工具（脚本自动化）</li>
<li>MySQL Workbench（紧急查看）</li>
</ul>
<hr>
<h2>1.6 安装后的验证和测试</h2>
<h3>1.6.1 基本验证</h3>
<pre><code class="language-sql">-- 查看版本
SELECT VERSION();
<p>-- 查看当前时间
SELECT NOW();</p>
<p>-- 查看当前用户
SELECT USER();</p>
<p>-- 查看数据库
SHOW DATABASES;</p>
<p>-- 查看存储引擎
SHOW ENGINES;</p>
<p>-- 查看字符集
SHOW VARIABLES LIKE 'character%';</p>
<p>-- 查看排序规则
SHOW VARIABLES LIKE 'collation%';
</code></pre></p>
<h3>1.6.2 性能测试</h3>
<pre><code class="language-sql">-- 创建测试数据库
CREATE DATABASE test_db;
USE test_db;
<p>-- 创建测试表
CREATE TABLE test_table (
id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);</p>
<p>-- 插入测试数据
INSERT INTO test_table (name) VALUES ('test1'), ('test2'), ('test3');</p>
<p>-- 查询测试
SELECT * FROM test_table;</p>
<p>-- 删除测试数据库
DROP DATABASE test_db;
</code></pre></p>
<hr>
<h2>1.7 常见安装问题</h2>
<h3>问题1：无法启动MySQL服务</h3>
<p><strong>Windows:</strong></p>
<pre><code class="language-cmd"># 查看错误日志
type D:\mysql-5.7.44\data\*.err
<h1>常见原因：</h1>
<h1>1. 端口被占用</h1>
<h1>2. data目录权限问题</h1>
<h1>3. 配置文件错误</h1>
<p></code></pre></p>
<p><strong>Linux:</strong></p>
<pre><code class="language-bash"># 查看错误日志
tail -f /var/log/mysqld.log
<h1>查看服务状态</h1>
<p>systemctl status mysqld
</code></pre></p>
<h3>问题2：忘记root密码</h3>
<p><strong>解决方法：</strong></p>
<pre><code class="language-bash"># 1. 停止MySQL服务
sudo systemctl stop mysqld
<h1>2. 跳过权限验证启动</h1>
<p>sudo mysqld_safe --skip-grant-tables &amp;</p>
<h1>3. 登录MySQL（无需密码）</h1>
<p>mysql -u root</p>
<h1>4. 修改密码</h1>
<p>USE mysql;
UPDATE user SET authentication_string=PASSWORD('新密码') WHERE User='root';
FLUSH PRIVILEGES;</p>
<h1>5. 重启MySQL</h1>
<p>sudo systemctl restart mysqld
</code></pre></p>
<h3>问题3：远程连接被拒绝</h3>
<pre><code class="language-sql">-- 1. 创建远程用户或授权
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码';
FLUSH PRIVILEGES;
<p>-- 2. 检查防火墙
-- 3. 检查bind-address配置（注释掉或设置为0.0.0.0）
</code></pre></p>
<hr>
<h2>1.8 小结</h2>
<p>本章学习了：</p>
<ul>
<li>✅ MySQL的基本概念和版本选择</li>
<li>✅ Windows和Linux上的安装方法</li>
<li>✅ 配置文件的详细说明</li>
<li>✅ 常用客户端工具</li>
<li>✅ 安装验证和常见问题</li>
</ul>
<p><strong>下一章预告：</strong> SQL基础 - DDL数据定义语言</p>
<hr>
<h2>练习题</h2>
<ol>
<li>在你的系统上安装MySQL 5.7</li>
<li>修改root密码并创建一个新用户</li>
<li>配置MySQL允许远程连接</li>
<li>安装一个图形化客户端工具并连接到MySQL</li>
<li>查看并记录你的MySQL配置参数</li>
</ol>
<p><strong>继续学习：</strong> <a href="/mysql/01/02-sql-ddl.html">第02章：SQL基础-DDL</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/mysql/mysql.html" class="fn-left">上一篇：MySQL从新手到专家完整学习路线图</a>
            <a href="/mysql/01/02-sql-ddl.html" class="fn-right">下一篇：第02章：SQL基础</a>
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
