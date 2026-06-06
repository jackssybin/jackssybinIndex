---
title: Spring Batch
description: ""
url: /tags/Spring_20Batch.html
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
    <div class="title"><h2><i class="icon-tags"></i>&nbsp;Spring Batch (4)</h2></div>
    <div><article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2026/06/04/codex-oss-zhihu.html">一个开源维护者视角：为什么我建议大家关注 OpenAI Codex for OSS</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2026-06-04</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>，也欢迎支持我的 Spring Batch IDEA 插件 先说背景：我最近把自己维护的一个开源项目整理了一遍，并提交了 OpenAI 的 Codex for Open Source 申请。 项目是这个： <a href="https://github.com/jackssybin/springbatchmonitorplugin">https://github.com/jackssybin/springbatchmonitorplugin</a> 它是一个 IntelliJ IDEA 插件，用来在 IDE 里直接查看 Spring Batch 的 job / step ...</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/ai-agent.html">AI、Agent 与本地模型</a>
        <a class="tag" rel="tag" href="/tags/AI.html">AI</a>
<a class="tag" rel="tag" href="/tags/Codex.html">Codex</a>
<a class="tag" rel="tag" href="/tags/OpenAI.html">OpenAI</a>
<a class="tag" rel="tag" href="/tags/E5_BC_80_E6_BA_90.html">开源</a>
<a class="tag" rel="tag" href="/tags/Spring_20Batch.html">Spring Batch</a>
<a class="tag" rel="tag" href="/tags/IDEA_20_E6_8F_92_E4_BB_B6.html">IDEA 插件</a>
        <a href="/articles/2026/06/04/codex-oss-zhihu.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2021/04/21/1618973105136.html">使用@ConditionalOnExpression决定是否生效</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2021-04-21</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>@ConditionalOnExpression 根据表达式选择性加载 @ConditionalOnProperty 根据配置选择性加载 #消费者总开关，0关1开 mq.cumsumer.enabled=1 #rocketmq消费者开关，true开启，false关闭 rocketmq.comsumer.enabled=false #rabbitmq消费者开关，true开启，false关闭 rabbitmq.comsumer.enabled=true #消费者选择 mq.comsumer=rabbitmq  //布尔值和数字 @Component @RabbitListener(queues = &quot;monitorDataQueue&quot;) @ConditionalOnExpression(&quot;${mq.cumsumer.enabled:0}==1&amp;&amp;${rabbitmq.comsumer.enabled:false}&quot;) //字符串 @Component @RabbitListener(queues = &quot;monitorDataQueue&quot;) @ConditionalOnExp....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
        <a class="tag" rel="tag" href="/tags/Spring_20Batch.html">Spring Batch</a>
        <a href="/articles/2021/04/21/1618973105136.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            
            <a rel="bookmark" href="/articles/2021/04/21/1618967915021.html">springBatch监控相关</a>
            
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="创建日期">
                <i class="icon-date"></i> <time>2021-04-21</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><p>Spring Boot Actuator可以帮助你监控和管理Spring Boot应用，比如健康检查、审计、统计和HTTP追踪等。所有的这些特性可以通过JMX或者HTTP endpoints来获得。 Actuator同时还可以与外部应用监控系统整合，比如 Prometheus, Graphite, DataDog, Influx, Wavefront, New Relic等。这些系统提供了非常好的仪表盘、图标、分析和告警等功能，使得你可以通过统一的接口轻松的监控和管理你的应用。 Actuator使用Micrometer来整合上面提到的外部应用监控系统。这使得只要通过非常小的配置就可以集成任何应用监控系统。 预备知识: | 监控 | micrometer | actuator | promethes | | - | - | - | - | | 概念 | 类似slf4j门面模式。提供接口和方法 | 调用micrometer对springboot体系提供了健康检查，对spring体系的扩展。也可以自定义监控。 | 监控的一类客户端。获取的数据格式需要定制化。micrometer有单独的门面扩....</p>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
        <a class="tag" rel="tag" href="/tags/Spring_20Batch.html">Spring Batch</a>
<a class="tag" rel="tag" href="/tags/prometheus.html">prometheus</a>
<a class="tag" rel="tag" href="/tags/E8_87_AA_E5_AE_9A_E4_B9_89_E7_9B_91_E6_8E_A7.html">自定义监控</a>
        <a href="/articles/2021/04/21/1618967915021.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
    </footer>
</article>
<article class="post post--summary">
    <header>
        <h2>
            <span class="core-badge">核心</span>
            <a rel="bookmark" href="/articles/2021/03/16/1615897840354.html">Spring Integration 中文手册</a>
            <sup><a href="/articles/2021/03/16/1615897840354.html">有更新！</a></sup>
        </h2>
        <div class="meta">
            <span class="vditor-tooltipped vditor-tooltipped__n" aria-label="更新日期">
                <i class="icon-date"></i> <time>2021-03-16</time>
            </span>
        </div>
    </header>
    <div class="vditor-reset post__excerpt"><ol>
<li>Spring Integration 中文手册 Spring Integration 对 Spring 编程模型进行了扩展，使得后者能够支持著名的“企业集成模式”。通过SI（Spring Integration）可以在基于Spring的应用中引入轻量级的“消息驱动模式”，并且支持“通过声明式的适配器”与外部系统进行集成。这些“适配器”相较于Spring对于“remoting（远程调用）”、“messaging（事件消息）”、“scheduling（任务调度）”方面的支持，提供了更高层次的一种抽象。SI的首要目标是：为“构建企业集成方案、维护系统间通信”提供一种简单模型，应用该模型所产出的代码是可维护、可测试的。 2. Spring Integration 概览 2.1 背景 IoC——“控制反转”，是Spring Framework的一个关键特性。这种IoC，从广义上来说，意味着Spring Framework将负责代表被其上下文所管理的各种组件，而组件本身却由于被减轻了部分职责而简单化了。例如：“依赖注入”使得组件摆脱了定位与创建自身依赖的职责。再比如：“面向切面编程”则通过可....</li>
</ol>
</div>
    <footer class="post__actions tags">
        <a class="topic-pill" href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
        <a class="tag" rel="tag" href="/tags/rabbitmq.html">rabbitmq</a>
<a class="tag" rel="tag" href="/tags/activemq.html">activemq</a>
<a class="tag" rel="tag" href="/tags/Spring_20Batch.html">Spring Batch</a>
        <a href="/articles/2021/03/16/1615897840354.html#more" rel="contents" class="fn-right">阅读全文 &raquo;</a>
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
