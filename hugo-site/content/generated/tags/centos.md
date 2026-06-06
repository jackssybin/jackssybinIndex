---
title: centos
description: centos 标签已归并到 CentOS，这里保留旧标签入口。
url: /tags/centos.html
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
    <div class="title"><h2><i class="icon-tags"></i>&nbsp;centos / CentOS (10)</h2></div>
    <p class="ft-gray" style="padding:0 20px 12px;">该标签已归并到 <a href="/tags/CentOS.html">CentOS</a>。</p>
    <div><article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/09/10/1599717501006.html">Ubuntu 搭建Zookeeper服务</a>
            <sup><a href="/articles/2020/09/10/1599717501006.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2020-09-10</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1、下载安装包 官方下载地址<a href="http://apache.fayea.com/zookeeper/">http://apache.fayea.com/zookeeper/</a> 2、安装 安装前确保系统已安装过JDK，JDK安装过程可参照 2.1 解压下载好的tar.gz安装包到某个目录下，可使用命令： tar -zxvf zookeeper-3.5.4-beta.tar.gz  2.2 进入解压目录的conf目录，复制配置文件zoo_sample.cfg并命名为zoo.cfg，相关命令为： cp zoo_sample.cfg zoo.cfg  2.3 编辑zoo.cfg文件 vi zoo.cfg  主要修改如下： # 增加dataDir和dataLogDir目录，目录自己创建并指定，用作数据存储目录和日志文件目录 dataDir=/home/local/zk/data dataLogDir=/home/local/zk/logs # 指定server地址，server.id=hostname:port:port。第一个端口用于集合体中的 follower 以侦听 leader；第二个端口用于 Leader 选举。第一个hostname即为本服务器地址 serve....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Zookeeper.html">Zookeeper</a>
<a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
        <a href="/articles/2020/09/10/1599717501006.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/01/10/1578637135722.html">利用Grafana展示zabbix数据</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-01-10</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>一、系统搭建（以Centos7为例） 因为我们的主要目的是展示zabbix的数据，所以建议大家直接在zabbix的服务器上搭建这个系统，亲测两系统无冲突，这样部署的好处是两系统间的数据传输更快，前端展示加载速度也将更快。 首先简单粗暴点，关闭防火墙，以免系统启动的时候出问题。 关闭防火墙 systemctl stop firewalld.service  关闭防火墙的开机自启 systemctl disable firewalld.service  替换防火墙参数 <code>sed -i&amp;nbsp;``'s/SELINUX=enforcing/SELINUX=disabled/'</code> <code>/etc/selinux/config</code>  查看防火墙状态 grep SELINUX=disabled /etc/selinux/config  关闭当前防火墙 setenforce 0  下载rpm源并安装 wget https:``//dl.grafana.com/oss/release/grafana-5.4.2-1.x86_64.rpm yum localinstall grafana-5.4.....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/grafana.html">grafana</a>
<a class="tag" rel="tag" href="/tags/zabbix.html">zabbix</a>
<a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
        <a href="/articles/2020/01/10/1578637135722.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/01/03/1578035132098.html">centos7更新yum阿里源</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-01-03</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><ol>
<li>备份原来的yum源 $sudo cp /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak  2.设置aliyun的yum源 $sudo wget -O /etc/yum.repos.d/CentOS-Base.repo <a href="http://mirrors.aliyun.com/repo/Centos-7.repo">http://mirrors.aliyun.com/repo/Centos-7.repo</a>  3.添加EPEL源 $sudo wget -P /etc/yum.repos.d/ <a href="http://mirrors.aliyun.com/repo/epel-7.repo">http://mirrors.aliyun.com/repo/epel-7.repo</a>  4.清理缓存，生成新缓存，执行yum更新 $sudo yum clean all $sudo yum makecache $sudo yum update</li>
</ol>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/yum.html">yum</a>
<a class="tag" rel="tag" href="/tags/E9_98_BF_E9_87_8C_E4_BA_91.html">阿里云</a>
        <a href="/articles/2020/01/03/1578035132098.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/12/24/1577200724607.html">Centos7时间和java获取时间不一致</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-12-24</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>问题描述 遇到一个问题，web显示的时间比服务器时间快12小时。Tomcat和MySQL安装在同一台服务器，系统是centos7，且服务器时间和MySQL时间一致，均是当前北京时间。 解决思路 1、在程序中使用java的函数设定时区。 2、在启动java程序时加参数-Duser.timezone=GMT+8 3、修改/etc/sysconfig/clock文件，然后重启服务。 （PS：jre是从/etc/sysconfig/clock这个文件中获取时区信息的） 附/etc/sysconfig/clock文件内容： #设置上海时区 ZONE=&quot;Asia/Shanghai&quot; UTC=false ARC=false ## ZONE -- 时区 ## UTC -- 表明时钟设置为UTC。 ## ARC -- 仅用于alpha表明使用ARC。  4、修改MySQL连接参数 jdbc:mysql://localhost:3306/test?useUnicode=true&amp;characterEncoding=UTF-8&amp;useOldAliasMetadataBehavior....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/java-jvm.html">Java 与 JVM</a>
        <a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/JVM.html">JVM</a>
<a class="tag" rel="tag" href="/tags/json_E6_97_B6_E9_97_B4_E8_BD_AC_E6_8D_A2.html">json时间转换</a>
<a class="tag" rel="tag" href="/tags/Java.html">Java</a>
        <a href="/articles/2019/12/24/1577200724607.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/12/20/1576776196766.html">Centos下git pull免密码操作</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-12-20</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.服务器使用的centos部署的Java项目，使用git pull拉下代码的class文件的时候，经常会提示需要输入帐号和密码。 git config --global credential.helper store  2. git pull 一次之后下次就不用密码了</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/git.html">git</a>
<a class="tag" rel="tag" href="/tags/E5_85_8D_E5_AF_86.html">免密</a>
        <a href="/articles/2019/12/20/1576776196766.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/12/16/1576489975924.html">centos7安装nginx,jdk,maven(yum方式)</a>
            <sup><a href="/articles/2019/12/16/1576489975924.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-12-16</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.添加Nginx 的yum源 rpm -Uvh <a href="http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm">http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm</a> #查看源是否添加成功 yum search nginx  2、安装Nginx yum install -y nginx  3.启动Nginx并设置开机自动运行 systemctl start nginx.service systemctl enable nginx.service  4.路径信息 以下是Nginx的默认路径： (1) Nginx配置路径：/etc/nginx/ (2) PID目录：/var/run/nginx.pid (3) 错误日志：/var/log/nginx/error.log (4) 访问日志：/var/log/nginx/access.log (5) 默认站点目录：/usr/share/nginx/html 事实上，只需知道Nginx配置路径，其他路径均可在/etc/nginx/nginx.conf 以及/etc/nginx/con....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/Nginx.html">Nginx</a>
<a class="tag" rel="tag" href="/tags/yum.html">yum</a>
        <a href="/articles/2019/12/16/1576489975924.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/12/12/1576162628044.html">centos7开启ssh服务</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-12-12</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>开启ssh服务需要root权限，先用root账户登陆 先检查有没有安装ssh服务： rpm -qa | grep ssh  如果没有安装ssh服务就安装 ： yum install openssh-server  安装好后在ssh配置文件里进行配置 : vim /etc/ssh/sshd_config  开启ssh服务,这个命令没有回显 systemctl start sshd.service  开启后用 ps -e | grep sshd 检查一下ssh服务是否开启 netstat -an | grep 22检查一下22端口是否开启 将ssh服务添加到自启动列表中： systemctl enable sshd.service</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/sshd.html">sshd</a>
<a class="tag" rel="tag" href="/tags/E8_BF_9C_E7_A8_8B_E8_BF_9E_E6_8E_A5.html">远程连接</a>
        <a href="/articles/2019/12/12/1576162628044.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/30/1575091289510.html">centos7 安装chromedriver</a>
            <sup><a href="/articles/2019/11/30/1575091289510.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-30</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.安装浏览器 指定yum 源 wget -O /etc/yum.repos.d/CentOS-Base.repo <a href="http://mirrors.aliyun.com/repo/Centos-7.repo">http://mirrors.aliyun.com/repo/Centos-7.repo</a> 安装 curl <a href="https://intoli.com/install-google-chrome.sh">https://intoli.com/install-google-chrome.sh</a> | bash ldd /opt/google/chrome/chrome | grep &quot;not found&quot;  安装后，执行： google-chrome-stable --no-sandbox --headless --disable-gpu --screenshot <a href="https://www.baidu.com/">https://www.baidu.com/</a>  成功之后会生成一个图片 查看 版本 很重要 google-chrome --version #Google Chrome 78.0.3904.108 #所以下载我们也只能下载对应的版本  2. 安装chromedriver 下载：<a href="https://npm.taobao.org/mirrors/chromedriver/">https://npm.taobao.org/mirrors/chromedriver/</a> 索引 挑选自己系统匹配的 wget https:....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/python-crawler.html">Python 爬虫与自动化</a>
        <a class="tag" rel="tag" href="/tags/Python_20_E7_88_AC_E8_99_AB.html">Python 爬虫</a>
<a class="tag" rel="tag" href="/tags/Python.html">Python</a>
<a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
        <a href="/articles/2019/11/30/1575091289510.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/30/1575088937927.html">Centos7安装Python3.7</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2019-11-30</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.安装编译相关工具 yum -y groupinstall &quot;Development tools&quot; yum -y install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel yum install libffi-devel -y  2.下载安装包解压 cd #回到用户目录 wget <a href="https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz">https://www.python.org/ftp/python/3.7.0/Python-3.7.0.tar.xz</a> tar -xvJf Python-3.7.0.tar.xz  3.编译安装 mkdir /usr/local/python3 #创建编译安装目录 cd Python-3.7.0 ./configure --prefix=/usr/local/python3 make &amp;&amp; make install  4.创建软连接 ln -s /usr/local/pyt....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Python.html">Python</a>
<a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
        <a href="/articles/2019/11/30/1575088937927.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/23/1574501821804.html">centos7下安装redis</a>
            <sup><a href="/articles/2019/11/23/1574501821804.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-23</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>一、安装redis 第一步：下载redis安装包 wget <a href="http://download.redis.io/releases/redis-4.0.6.tar.gz">http://download.redis.io/releases/redis-4.0.6.tar.gz</a>  第二步：解压压缩包 tar -zxvf redis-4.0.6.tar.gz  第三步：yum安装gcc依赖 yum install gcc  第四步：跳转到redis解压目录下 and 编译安装 cd redis-4.0.6 make MALLOC=libc cd src &amp;&amp; make install  二、启动redis的三种方式 先切换到redis src目录下  cd src  1、直接启动redis ./redis-server  redis启动成功，但是这种启动方式需要一直打开窗口，不能进行其他操作，不太方便。 按 ctrl + c可以关闭窗口。 2、以后台进程方式启动redis 第一步：修改redis.conf文件 将 daemonize no  修改为 daemonize yes  第二步：指定redis.conf文件启动 ./redis-server /usr/local/r....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Redis.html">Redis</a>
<a class="tag" rel="tag" href="/tags/CentOS.html">CentOS</a>
<a class="tag" rel="tag" href="/tags/linux_E6_9C_8D_E5_8A_A1_E9_85_8D_E7_BD_AE_E5_AE_89_E8_A3_85.html">linux服务配置安装</a>
        <a href="/articles/2019/11/23/1574501821804.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article></div>
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
