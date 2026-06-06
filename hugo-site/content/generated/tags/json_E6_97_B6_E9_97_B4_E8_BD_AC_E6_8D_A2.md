---
title: json时间转换
description: ""
url: /tags/json_E6_97_B6_E9_97_B4_E8_BD_AC_E6_8D_A2.html
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
    <div class="title"><h2><i class="icon-tags"></i>&nbsp;json时间转换 (2)</h2></div>
    <div><article class="post post--summary">
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
            
            <a rel="bookmark" href="/articles/2019/11/07/1573120127531.html">mybatis,mysql的时区问题</a>
            <sup><a href="/articles/2019/11/07/1573120127531.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2019-11-07</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>1.公司运营装mysql的时候的时区不是固定的，随机的，所以我们要想办法解决这个问题，应该运营的权限控制的很严，不能要他们更改； 首先解决从数据库读取到java，指定我们所需要的时区，只需要在配置文件的mysql链接的时候指定自己所需的文 datasource.jdbcUrl=jdbc:mysql://xxx.xx.xx.xx:3306/bms?characterEncoding=UTF-8&amp;useSSL=false&amp;serverTimezone=Asia/Shanghai  2.如果我们写接口的时候使用的JsonFormat注解的时候，我们也需要指定想同的时区，否则又会出现时区误差 @JsonFormat(pattern = ApplicationConstants.DATE_FORMAT,timezone=&quot;GMT+8&quot;)</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/mysql-data.html">MySQL 与数据架构</a>
        <a class="tag" rel="tag" href="/tags/Java.html">Java</a>
<a class="tag" rel="tag" href="/tags/json_E6_97_B6_E9_97_B4_E8_BD_AC_E6_8D_A2.html">json时间转换</a>
        <a href="/articles/2019/11/07/1573120127531.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
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
