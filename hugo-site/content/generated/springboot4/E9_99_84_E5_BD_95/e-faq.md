---
title: 附录E：常见问题 FAQ - Spring Boot 4教程
description: "附录E：常见问题 FAQ 概述 本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。 E.1 升级相关
  Q1: 必须升级到 Java 21 吗？ A : 是的，Spring Boot 4 要求最低 Java 21。 原因 : 虚拟线程是 Java 21
  的核心特性 Record 模式匹配需要 Java 21 性能优化依赖 Java..."
url: /springboot4/E9_99_84_E5_BD_95/e-faq.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;附录E：常见问题 FAQ</h2></div>
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
<a class="" href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="current" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 附录</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>附录E：常见问题 FAQ</h1>
<h2>概述</h2>
<p>本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。</p>
<h2>E.1 升级相关</h2>
<h3>Q1: 必须升级到 Java 21 吗？</h3>
<p><strong>A</strong>: 是的，Spring Boot 4 要求最低 Java 21。</p>
<p><strong>原因</strong>:</p>
<ul>
<li>虚拟线程是 Java 21 的核心特性</li>
<li>Record 模式匹配需要 Java 21</li>
<li>性能优化依赖 Java 21 的改进</li>
</ul>
<p><strong>迁移建议</strong>:</p>
<pre><code class="language-bash"># 安装 JDK 21
sdk install java 21-tem
<h1>验证版本</h1>
<p>java -version
</code></pre></p>
<h3>Q2: 升级后应用无法启动？</h3>
<p><strong>A</strong>: 检查以下几点：</p>
<ol>
<li><strong>JDK 版本</strong>:</li>
</ol>
<pre><code class="language-bash">java -version  # 确保是 21+
</code></pre>
<ol start="2">
<li><strong>Maven/Gradle 版本</strong>:</li>
</ol>
<pre><code class="language-bash">mvn -version   # 确保 3.9+
gradle -version  # 确保 8.5+
</code></pre>
<ol start="3">
<li><strong>依赖冲突</strong>:</li>
</ol>
<pre><code class="language-bash">./mvnw dependency:tree | grep -i spring
</code></pre>
<h3>Q3: 第三方库不兼容怎么办？</h3>
<p><strong>A</strong>: 三种解决方案：</p>
<ol>
<li><strong>升级库版本</strong>:</li>
</ol>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;com.example&lt;/groupId&gt;
    &lt;artifactId&gt;library&lt;/artifactId&gt;
    &lt;version&gt;新版本&lt;/version&gt;
&lt;/dependency&gt;
</code></pre>
<ol start="2">
<li><strong>排除冲突依赖</strong>:</li>
</ol>
<pre><code class="language-xml">&lt;exclusions&gt;
    &lt;exclusion&gt;
        &lt;groupId&gt;old-group&lt;/groupId&gt;
        &lt;artifactId&gt;old-artifact&lt;/artifactId&gt;
    &lt;/exclusion&gt;
&lt;/exclusions&gt;
</code></pre>
<ol start="3">
<li><strong>暂时降级 Spring Boot</strong>（不推荐）</li>
</ol>
<h2>E.2 虚拟线程问题</h2>
<h3>Q4: 如何验证虚拟线程已启用？</h3>
<p><strong>A</strong>: 多种验证方法：</p>
<p><strong>方法1: 代码检查</strong>:</p>
<pre><code class="language-java">@RestController
public class TestController {
    @GetMapping(&quot;/thread-info&quot;)
    public Map&lt;String, Object&gt; threadInfo() {
        Thread thread = Thread.currentThread();
        return Map.of(
            &quot;isVirtual&quot;, thread.isVirtual(),
            &quot;threadName&quot;, thread.getName()
        );
    }
}
</code></pre>
<p><strong>方法2: 日志检查</strong>:</p>
<pre><code># 启动日志中查找
Tomcat initialized with virtual threads
</code></pre>
<p><strong>方法3: Actuator</strong>:</p>
<pre><code class="language-bash">curl http://localhost:8080/actuator/metrics/jvm.threads.virtual
</code></pre>
<h3>Q5: 虚拟线程性能没有提升？</h3>
<p><strong>A</strong>: 检查以下几点：</p>
<ol>
<li><strong>应用类型</strong>: CPU 密集型应用收益不明显</li>
<li><strong>synchronized 使用</strong>: 导致线程固定</li>
<li><strong>连接池配置</strong>: 可能成为瓶颈</li>
</ol>
<p><strong>诊断</strong>:</p>
<pre><code class="language-bash"># 启用 pinning 检测
java -Djdk.tracePinnedThreads=full -jar app.jar
</code></pre>
<h3>Q6: 虚拟线程数量过多导致内存问题？</h3>
<p><strong>A</strong>: 虚拟线程本身占用很少（~1KB），但要注意：</p>
<ol>
<li><strong>ThreadLocal 清理</strong>:</li>
</ol>
<pre><code class="language-java">// 使用后清理
threadLocal.remove();
</code></pre>
<ol start="2">
<li><strong>限制并发数</strong>:</li>
</ol>
<pre><code class="language-java">Semaphore semaphore = new Semaphore(10000);
semaphore.acquire();
try {
    // 处理
} finally {
    semaphore.release();
}
</code></pre>
<h2>E.3 性能问题</h2>
<h3>Q7: 启动时间没有明显改善？</h3>
<p><strong>A</strong>: 尝试以下优化：</p>
<ol>
<li><strong>启用 AOT</strong>:</li>
</ol>
<pre><code class="language-yaml">spring:
  aot:
    enabled: true
</code></pre>
<ol start="2">
<li><strong>使用 Native Image</strong>:</li>
</ol>
<pre><code class="language-bash">./mvnw -Pnative native:compile
</code></pre>
<ol start="3">
<li><strong>优化依赖</strong>:</li>
</ol>
<pre><code class="language-xml">&lt;!-- 移除不必要的 starter --&gt;
</code></pre>
<h3>Q8: 运行时性能反而下降？</h3>
<p><strong>A</strong>: 可能的原因：</p>
<ol>
<li><strong>未启用虚拟线程</strong>:</li>
</ol>
<pre><code class="language-yaml">spring:
  threads:
    virtual:
      enabled: true  # 确保启用
</code></pre>
<ol start="2">
<li><strong>连接池配置不当</strong>:</li>
</ol>
<pre><code class="language-yaml">spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 减小连接池
</code></pre>
<ol start="3">
<li><strong>synchronized 过多</strong>: 使用 Lock 替代</li>
</ol>
<h2>E.4 数据库问题</h2>
<h3>Q9: 数据库连接池耗尽？</h3>
<p><strong>A</strong>: 虚拟线程下需要调整配置：</p>
<pre><code class="language-yaml">spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 从 50 减少到 20
      minimum-idle: 5
      connection-timeout: 30000
</code></pre>
<p><strong>原因</strong>: 虚拟线程可以用更少的连接处理更多请求</p>
<h3>Q10: 事务超时？</h3>
<p><strong>A</strong>: 检查事务配置：</p>
<pre><code class="language-java">@Transactional(timeout = 30)  // 增加超时时间
public void longRunningTransaction() {
    // ...
}
</code></pre>
<h2>E.5 安全问题</h2>
<h3>Q11: Security 配置报错？</h3>
<p><strong>A</strong>: 使用新的 Lambda DSL：</p>
<p><strong>错误代码</strong>:</p>
<pre><code class="language-java">http.authorizeRequests()
    .antMatchers(&quot;/public/**&quot;).permitAll()
    .and()...  // ❌ .and() 已废弃
</code></pre>
<p><strong>正确代码</strong>:</p>
<pre><code class="language-java">http.authorizeHttpRequests(auth -&gt; auth
    .requestMatchers(&quot;/public/**&quot;).permitAll()
    .anyRequest().authenticated()
);
</code></pre>
<h3>Q12: JWT 验证失败？</h3>
<p><strong>A</strong>: 检查密钥配置：</p>
<pre><code class="language-yaml">app:
  jwt:
    secret: ${JWT_SECRET}  # 确保环境变量设置
    expiration: 86400000
</code></pre>
<h2>E.6 部署问题</h2>
<h3>Q13: Docker 镜像过大？</h3>
<p><strong>A</strong>: 使用多阶段构建：</p>
<pre><code class="language-dockerfile">FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
<p>FROM eclipse-temurin:21-jre
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]
</code></pre></p>
<p><strong>或使用 Native Image</strong>:</p>
<pre><code class="language-bash">./mvnw -Pnative native:compile
# 镜像大小: 250MB → 60MB
</code></pre>
<h3>Q14: Kubernetes 健康检查失败？</h3>
<p><strong>A</strong>: 配置正确的探针：</p>
<pre><code class="language-yaml">management:
  endpoint:
    health:
      probes:
        enabled: true
</code></pre>
<p><strong>Kubernetes</strong>:</p>
<pre><code class="language-yaml">livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
</code></pre>
<h2>E.7 监控问题</h2>
<h3>Q15: Prometheus 指标缺失？</h3>
<p><strong>A</strong>: 确保配置正确：</p>
<pre><code class="language-yaml">management:
  endpoints:
    web:
      exposure:
        include: prometheus
  prometheus:
    metrics:
      export:
        enabled: true
</code></pre>
<h3>Q16: 追踪信息不显示？</h3>
<p><strong>A</strong>: 启用追踪：</p>
<pre><code class="language-yaml">management:
  tracing:
    enabled: true
    sampling:
      probability: 1.0
</code></pre>
<h2>E.8 迁移问题</h2>
<h3>Q17: 迁移需要多长时间？</h3>
<p><strong>A</strong>: 根据项目规模：</p>
<table>
<thead>
<tr>
<th>项目规模</th>
<th>预估时间</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>小型 (&lt; 10K 行)</td>
<td>1-2 周</td>
<td>主要是测试</td>
</tr>
<tr>
<td>中型 (10K-50K 行)</td>
<td>3-4 周</td>
<td>需要仔细测试</td>
</tr>
<tr>
<td>大型 (&gt; 50K 行)</td>
<td>6-8 周</td>
<td>分模块迁移</td>
</tr>
</tbody>
</table>
<h3>Q18: 可以部分迁移吗？</h3>
<p><strong>A</strong>: 可以，建议策略：</p>
<ol>
<li><strong>先迁移独立模块</strong></li>
<li><strong>逐步迁移核心服务</strong></li>
<li><strong>最后迁移遗留系统</strong></li>
</ol>
<h2>E.9 最佳实践</h2>
<h3>Q19: 什么时候应该升级？</h3>
<p><strong>A</strong>: 推荐场景：</p>
<p>✅ <strong>立即升级</strong>:</p>
<ul>
<li>I/O 密集型应用</li>
<li>高并发服务</li>
<li>微服务架构</li>
</ul>
<p>⚠️ <strong>谨慎评估</strong>:</p>
<ul>
<li>CPU 密集型应用</li>
<li>大量使用废弃 API</li>
<li>第三方库依赖多</li>
</ul>
<p>❌ <strong>暂缓升级</strong>:</p>
<ul>
<li>稳定运行的遗留系统</li>
<li>团队不熟悉 Java 21</li>
<li>第三方库不兼容</li>
</ul>
<h3>Q20: 如何最大化性能收益？</h3>
<p><strong>A</strong>: 关键点：</p>
<ol>
<li><strong>启用虚拟线程</strong></li>
<li><strong>优化连接池</strong></li>
<li><strong>使用 Native Image</strong></li>
<li><strong>监控和调优</strong></li>
</ol>
<p><strong>预期收益</strong>:</p>
<ul>
<li>吞吐量: 2-5 倍</li>
<li>延迟: 50-80% 降低</li>
<li>内存: 30-50% 节省</li>
</ul>
<h2>E.10 获取帮助</h2>
<h3>官方资源</h3>
<ul>
<li><a href="https://docs.spring.io/spring-boot/docs/4.0.x/reference/">Spring Boot 文档</a></li>
<li><a href="https://docs.spring.io/spring-framework/docs/7.0.x/reference/">Spring Framework 文档</a></li>
<li><a href="https://openjdk.org/projects/jdk/21/">Java 21 文档</a></li>
</ul>
<h3>社区支持</h3>
<ul>
<li><a href="https://stackoverflow.com/questions/tagged/spring-boot">Stack Overflow</a></li>
<li><a href="https://spring.io/community">Spring 论坛</a></li>
<li><a href="https://github.com/spring-projects/spring-boot/issues">GitHub Issues</a></li>
</ul>
<hr>
<p><strong>最后更新</strong>: 2024-12-24<br>
<strong>版本</strong>: Spring Boot 4.0.0</p>
<p><strong>相关章节</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a></li>
<li><a href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：完整对比表</a></li>
<li><a href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E9_99_84_E5_BD_95/d.html" class="fn-left">上一篇：附录D：迁移检查清单</a>
            
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
