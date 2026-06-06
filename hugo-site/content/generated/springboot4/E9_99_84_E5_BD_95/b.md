---
title: 附录B：虚拟线程最佳实践 - Spring Boot 4教程
description: 附录B：虚拟线程最佳实践 概述 虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。
  B.1 适用场景 B.1.1 推荐使用 ✅ I/O 密集型应用 Web 服务器 数据库访问 HTTP 客户端调用 消息队列消费 文件 I/O ✅ 高并发场景
  微服务 API 网关 WebSocket 服务器 SSE 服务器 B....
url: /springboot4/E9_99_84_E5_BD_95/b.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;附录B：虚拟线程最佳实践</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>Spring Boot 4教程目录</h3>
    <section>
      <h4>第一部分-_概览</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E6_A6_82_E8_A7_88/1-springboot4.html">第1章：Spring Boot 4 简介</a>
    </section>
<section>
      <h4>第二部分-_核心框架</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html">第2章：Spring Framework 7.0 新特性</a>
<a class="" href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/3.html">第3章：依赖注入与配置改进</a>
    </section>
<section>
      <h4>web</h4>
      <a class="" href="/springboot4/web/4-springmvc-webflux.html">第4章：Spring MVC 与 WebFlux 增强</a>
<a class="" href="/springboot4/web/5-websocket-sse.html">第5章：WebSocket 与 Server-Sent Events 改进</a>
    </section>
<section>
      <h4>第四部分-_数据访问</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html">第6章：Spring Data 4.0 新特性</a>
<a class="" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html">第7章：事务管理改进</a>
    </section>
<section>
      <h4>第五部分-_安全性</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html">第8章：Spring Security 7.0 新特性</a>
    </section>
<section>
      <h4>第六部分-_观察性</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html">第9章：Micrometer 与 Observability</a>
    </section>
<section>
      <h4>第七部分-_消息集成</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html">第10章：Spring for Apache Kafka 升级</a>
<a class="" href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html">第11章：Spring Integration 改进</a>
    </section>
<section>
      <h4>第八部分-_云原生</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">第12章：GraalVM Native Image 增强</a>
<a class="" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html">第13章：Docker 与 Kubernetes 集成</a>
    </section>
<section>
      <h4>第十部分-_性能优化</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html">第15章：性能提升详解</a>
    </section>
<section>
      <h4>第十一部分-_迁移</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html">第16章：废弃 API 与替代方案</a>
<a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a>
    </section>
<section>
      <h4>附录</h4>
      <a class="" href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：Spring Boot 3 vs 4 完整对比表</a>
<a class="current" href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 附录</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>附录B：虚拟线程最佳实践</h1>
<h2>概述</h2>
<p>虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。</p>
<h2>B.1 适用场景</h2>
<h3>B.1.1 推荐使用</h3>
<p>✅ <strong>I/O 密集型应用</strong></p>
<ul>
<li>Web 服务器</li>
<li>数据库访问</li>
<li>HTTP 客户端调用</li>
<li>消息队列消费</li>
<li>文件 I/O</li>
</ul>
<p>✅ <strong>高并发场景</strong></p>
<ul>
<li>微服务</li>
<li>API 网关</li>
<li>WebSocket 服务器</li>
<li>SSE 服务器</li>
</ul>
<h3>B.1.2 不推荐使用</h3>
<p>❌ <strong>CPU 密集型任务</strong></p>
<ul>
<li>复杂计算</li>
<li>图像处理</li>
<li>加密解密</li>
<li>数据压缩</li>
</ul>
<p>❌ <strong>需要线程本地存储</strong></p>
<ul>
<li>ThreadLocal 重度使用</li>
<li>线程池监控</li>
</ul>
<h2>B.2 配置指南</h2>
<h3>B.2.1 启用虚拟线程</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  threads:
    virtual:
      enabled: true
      name-prefix: &quot;vt-&quot;
</code></pre>
<h3>B.2.2 Tomcat 配置</h3>
<pre><code class="language-yaml">server:
  tomcat:
    threads:
      max: 200  # 虚拟线程下可以设置较小值
      min-spare: 10
</code></pre>
<h3>B.2.3 数据库连接池</h3>
<p><strong>HikariCP 优化</strong>:</p>
<pre><code class="language-yaml">spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 虚拟线程下减少连接数
      minimum-idle: 5
      connection-timeout: 30000
</code></pre>
<h2>B.3 性能优化</h2>
<h3>B.3.1 避免阻塞操作</h3>
<p><strong>不推荐</strong>:</p>
<pre><code class="language-java">@Service
public class BadService {
    public void process() {
        synchronized (this) {  // ❌ 避免 synchronized
            // 处理逻辑
        }
    }
}
</code></pre>
<p><strong>推荐</strong>:</p>
<pre><code class="language-java">@Service
public class GoodService {
    private final Lock lock = new ReentrantLock();
<pre><code>public void process() {
    lock.lock();  // ✅ 使用 Lock
    try {
        // 处理逻辑
    } finally {
        lock.unlock();
    }
}
</code></pre>
<p>}
</code></pre></p>
<h3>B.3.2 合理使用线程池</h3>
<p><strong>不推荐</strong>:</p>
<pre><code class="language-java">// ❌ 不要创建大量平台线程池
ExecutorService executor = Executors.newFixedThreadPool(1000);
</code></pre>
<p><strong>推荐</strong>:</p>
<pre><code class="language-java">// ✅ 使用虚拟线程执行器
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
</code></pre>
<h2>B.4 监控指标</h2>
<h3>B.4.1 关键指标</h3>
<pre><code class="language-java">@Component
public class VirtualThreadMetrics {
<pre><code>@Bean
public MeterBinder virtualThreadMetrics() {
    return registry -&amp;gt; {
        Gauge.builder(&amp;quot;jvm.threads.virtual.count&amp;quot;, this::getVirtualThreadCount)
            .description(&amp;quot;Number of virtual threads&amp;quot;)
            .register(registry);
<pre><code>    Gauge.builder(&amp;amp;quot;jvm.threads.platform.count&amp;amp;quot;, this::getPlatformThreadCount)
        .description(&amp;amp;quot;Number of platform threads&amp;amp;quot;)
        .register(registry);
};
</code></pre>
<p>}</p>
<p>private long getVirtualThreadCount() {
return Thread.getAllStackTraces().keySet().stream()
.filter(Thread::isVirtual)
.count();
}</p>
<p>private long getPlatformThreadCount() {
return Thread.getAllStackTraces().keySet().stream()
.filter(t -&amp;gt; !t.isVirtual())
.count();
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>B.5 常见陷阱</h2>
<h3>B.5.1 ThreadLocal 使用</h3>
<p><strong>问题</strong>: 虚拟线程数量巨大，ThreadLocal 可能导致内存泄漏</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-java">// ❌ 避免
private static final ThreadLocal&lt;User&gt; currentUser = new ThreadLocal&lt;&gt;();
<p>// ✅ 使用 ScopedValue (Java 21+)
private static final ScopedValue&lt;User&gt; currentUser = ScopedValue.newInstance();
</code></pre></p>
<h3>B.5.2 Pinning 问题</h3>
<p><strong>问题</strong>: synchronized 块会导致虚拟线程&quot;固定&quot;到平台线程</p>
<p><strong>检测</strong>:</p>
<pre><code class="language-bash"># 启用 JVM 参数
-Djdk.tracePinnedThreads=full
</code></pre>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-java">// ❌ 避免在虚拟线程中使用
synchronized (lock) {
    // I/O 操作
}
<p>// ✅ 使用 ReentrantLock
lock.lock();
try {
// I/O 操作
} finally {
lock.unlock();
}
</code></pre></p>
<h2>B.6 性能基准</h2>
<h3>B.6.1 测试场景</h3>
<p><strong>场景</strong>: 10,000 并发 HTTP 请求，每个请求模拟 100ms I/O</p>
<table>
<thead>
<tr>
<th>配置</th>
<th>吞吐量</th>
<th>P95延迟</th>
<th>内存</th>
</tr>
</thead>
<tbody>
<tr>
<td>平台线程 (200)</td>
<td>850 req/s</td>
<td>450ms</td>
<td>512MB</td>
</tr>
<tr>
<td>虚拟线程</td>
<td>9500 req/s</td>
<td>105ms</td>
<td>256MB</td>
</tr>
</tbody>
</table>
<p><strong>提升</strong>: 11倍吞吐量，77%延迟降低，50%内存节省</p>
<h2>B.7 迁移检查清单</h2>
<h3>B.7.1 代码审查</h3>
<ul>
<li>[ ] 检查 synchronized 使用</li>
<li>[ ] 检查 ThreadLocal 使用</li>
<li>[ ] 检查线程池配置</li>
<li>[ ] 检查阻塞操作</li>
</ul>
<h3>B.7.2 配置检查</h3>
<ul>
<li>[ ] 启用虚拟线程</li>
<li>[ ] 调整连接池大小</li>
<li>[ ] 配置监控指标</li>
<li>[ ] 设置 JVM 参数</li>
</ul>
<h3>B.7.3 测试验证</h3>
<ul>
<li>[ ] 功能测试</li>
<li>[ ] 性能测试</li>
<li>[ ] 压力测试</li>
<li>[ ] 监控验证</li>
</ul>
<h2>B.8 小结</h2>
<p>✅ <strong>核心原则</strong></p>
<ul>
<li>I/O 密集型任务优先使用</li>
<li>避免 synchronized</li>
<li>减少线程池大小</li>
<li>监控虚拟线程指标</li>
</ul>
<p>✅ <strong>性能收益</strong></p>
<ul>
<li>10倍+ 吞吐量提升</li>
<li>70%+ 延迟降低</li>
<li>50%+ 内存节省</li>
</ul>
<hr>
<p><strong>相关章节</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html#22-virtual-threads%E8%99%9A%E6%8B%9F%E7%BA%BF%E7%A8%8B%E6%B7%B1%E5%BA%A6%E9%9B%86%E6%88%90">第2章：虚拟线程深度集成</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html#63-%E8%99%9A%E6%8B%9F%E7%BA%BF%E7%A8%8B%E4%B8%8E%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5%E6%B1%A0">第6章：虚拟线程与数据库</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html" class="fn-left">上一篇：附录A：Spring Boot 3 vs 4 完整对比表</a>
            <a href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html" class="fn-right">下一篇：附录C：GraalVM Native Image 指南</a>
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
