---
title: linux
description: linux 标签已归并到 Linux，这里保留旧标签入口。
url: /tags/linux.html
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
    <div class="title"><h2><i class="icon-tags"></i>&nbsp;linux / Linux (6)</h2></div>
    <p class="ft-gray" style="padding:0 20px 12px;">该标签已归并到 <a href="/tags/Linux.html">Linux</a>。</p>
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
            
            <a rel="bookmark" href="/articles/2020/05/13/1589349920439.html">Linux - 查看用户登录记录</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-05-13</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1、查看当前登录用户信息 who命令： who缺省输出包括用户名、终端类型、登陆日期以及远程主机。 who /var/log/wtmp 可以查看自从wtmp文件创建以来的每一次登陆情况 （1）-b：查看系统最近一次启动时间 （2）-H：打印每列的标题 users命令： 打印当前登录的用户，每个显示的用户名对应一个登陆会话。 2、查看命令历史 每个用户都有一份命令历史记录 查看$HOME/.bash_history 或者在终端输入： history 3、last命令 查看用户登录历史 此命令会读取 /var/log/wtmp文件；/var/log/btmp可以显示远程登陆信息。 last默认打印所有用户的登陆信息。 如果想打印某个用户的登陆信息，可以使用 last 用户名 选项： （1）-x：显示系统开关机以及执行等级信息 （2）-a：将登陆ip显示在最后一行 （3）-f ：读取特定文件，可以选择 -f /var/log/btmp文件 （4）-d：将IP地址转换为主机名 （5）-n：设置列出名单的显示列数 （6）-t：查看指定时间的用户登录历史 例如： last -t 201502261....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
<a class="tag" rel="tag" href="/tags/E7_94_A8_E6_88_B7_E6_93_8D_E4_BD_9C_E8_AE_B0_E5_BD_95.html">用户操作记录</a>
<a class="tag" rel="tag" href="/tags/lastlog.html">lastlog</a>
        <a href="/articles/2020/05/13/1589349920439.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2020/05/11/1589167695782.html">Linux服务器kdevtmpfsi挖矿病毒解决方法</a>
            <sup><a href="/articles/2020/05/11/1589167695782.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2020-05-11</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>问题描述  Linux服务器（包括但不限于CentOS）出现名为kdevtmpfsi的进程，占用高额的CPU、内存资源； 并且单纯的kill -9 进程ID 例：kill -9 12345 无法完全杀死，不久便会复活； 同2.理杀死 kdevtmpfsi的守护进程kinsing，一小段时间又会出现这对进程；(网上文档有人会有守护进程。我机器没这个，也没在定时任务里找到额外的定时任务) 找到并删除这2个进程对应的可执行文件例：find / -name kinsing，一小段时间又会出现。  问题根源  服务器安装的redis镜像有问题，被植入kdevtmpfsi挖矿程序。 redis未设置密码、或者密码过于简单 服务器被植入定时任务：下载病毒程序、并唤起，及进程存活监测 很纳闷，我的服务器都没有redis，以前短暂安装过。后来就没起来过。也出这个问题了  解决方法 (定时任务杀进程，也是守护进程)  编写shell脚本 vim /data/shell/kill_kdevtmpfsi.sh；  #! /bin/sh step=1 for (( i = 0; i &lt; 60; i = (....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
<a class="tag" rel="tag" href="/tags/E7_9F_BF_E6_9C_BA_E7_97_85_E6_AF_92.html">矿机病毒</a>
<a class="tag" rel="tag" href="/tags/cpu100.html">cpu100</a>
<a class="tag" rel="tag" href="/tags/kdevtmpfsi.html">kdevtmpfsi</a>
        <a href="/articles/2020/05/11/1589167695782.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            <span class="core-badge">核心</span>
            <a rel="bookmark" href="/articles/2020/04/20/1587389853090.html">Linux Dump 文件分析</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2020-04-20</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>dump文件传输到本地进行分析， 常常需要大量的等待时间。 使用IBM的eclipse的MAT工具可以直接在服务器上进行快速DUMP分析。 运行环境要求  linux操作系统 JDK8 以上  下载MAT的linux版本 Eclipse的MAT工具下载链接 MAT支持各种操作系统，找到Linux版本下载下来 # 运行uname -m 看一下linux是 x86_64还是 x86的帮助你选择下载那个版本。 uname -m #x86_64  <a href="http://iso.mirrors.ustc.edu.cn/eclipse/mat/1.8/rcp/MemoryAnalyzer-1.8.0.20180604-linux.gtk.x86_64.zip">http://iso.mirrors.ustc.edu.cn/eclipse/mat/1.8/rcp/MemoryAnalyzer-1.8.0.20180604-linux.gtk.x86_64.zip</a>  解压配置MAT基本参数 unzip MemoryAnalyzer-1.8.0.20180604-linux.gtk.x86_64.zip ## 修改MAT的内存大小， 注意这个大小要根据你dump文件大小来的，如果dump文件是5GB那么 这里最好配&gt;5GB 否则会报MAT内存不足的异常 ## 修改MemoryAnalyzer.ini 的 -....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/JVM.html">JVM</a>
<a class="tag" rel="tag" href="/tags/E5_86_85_E5_AD_98_E6_BA_A2_E5_87_BA.html">内存溢出</a>
<a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
<a class="tag" rel="tag" href="/tags/mat.html">mat</a>
        <a href="/articles/2020/04/20/1587389853090.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/11/20/1574261012104.html">查看Linux占用内存/CPU最多的进程</a>
            <sup><a href="/articles/2019/11/20/1574261012104.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-20</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.可以使用以下命令查使用内存最多的10个进程      ps -aux | sort -k4nr | head -n 10 2.可以使用一下命令查使用CPU最多的10个进程      ps -aux | sort -k3nr | head -n 10 3. 那么多进程中如何查看一个进程的情况 ps aux | grep xx 找到进程号 top -p pid  4. top显示不全 bw设置宽度 top -c  -bw 500 5. 批量杀掉共类进程 kill -9 <code>ps -ef |grep java|grep -v grep|awk '{print $2}'</code></p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/E8_B0_83_E4_BC_98.html">调优</a>
<a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
        <a href="/articles/2019/11/20/1574261012104.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2019/10/25/1571973778513.html">linux下一些常用命令</a>
            <sup><a href="/articles/2019/10/25/1571973778513.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-10-25</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.根据端口查进程 lsof -i:port netstat -nap | grep port  2.根据进程号查端口: lsof -i|grep pid netstat -nap | grep pid  3.根据进程名查找pid、port： ps -ef |grep tomcat ps -ef |grep port(根据port查找相关进程) ps -ef |grep pid(根据pid查找相关进程)  4.根据进程号查服务路径： ll /proc/26357/cwd #26357是进程号 1 root root 0 Oct 25 10:08 /proc/26357/cwd -&gt; /root/data/proxy_pool/Api/  5.查询所有进程号 top top  6.查看进程中的线程号信息 ps -T -p 18043 # ps 语法 1.top -H -p 18043 #top 实时的哈 shift+H开启show threads on功能，展示线程资源占用情况 　　找到消耗CPU等最多的PID为:18045 2. printf &quot;%x\n&quot; 18045 --&amp;gt....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/linux-ops.html">Linux 运维与部署</a>
        <a class="tag" rel="tag" href="/tags/Linux.html">Linux</a>
        <a href="/articles/2019/10/25/1571973778513.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
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
