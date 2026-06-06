---
title: 第12章：GraalVM Native Image 增强 - Spring Boot 4教程
description: "第12章：GraalVM Native Image 增强 本章概述 Spring Boot 4 大幅改进了 GraalVM
  原生镜像支持，提供更快的启动时间和更小的内存占用。 本章重点 : ✅ 原生镜像支持改进 ✅ 启动时间与内存优化 ✅ AOT (AheadofTime) 编译
  ✅ 构建配置简化 12.1 原生镜像构建 12.1.1 Maven 配置 po..."
url: /springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第12章：GraalVM Native Image 增强</h2></div>
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
      <a class="current" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">第12章：GraalVM Native Image 增强</a>
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
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">第12章：GraalVM Native Image 增强</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 第八部分-_云原生</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第12章：GraalVM Native Image 增强</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 大幅改进了 GraalVM 原生镜像支持，提供更快的启动时间和更小的内存占用。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 原生镜像支持改进</li>
<li>✅ 启动时间与内存优化</li>
<li>✅ AOT (Ahead-of-Time) 编译</li>
<li>✅ 构建配置简化</li>
</ul>
<h2>12.1 原生镜像构建</h2>
<h3>12.1.1 Maven 配置</h3>
<p><strong>pom.xml</strong>:</p>
<pre><code class="language-xml">&lt;build&gt;
    &lt;plugins&gt;
        &lt;plugin&gt;
            &lt;groupId&gt;org.graalvm.buildtools&lt;/groupId&gt;
            &lt;artifactId&gt;native-maven-plugin&lt;/artifactId&gt;
            &lt;configuration&gt;
                &lt;imageName&gt;${project.artifactId}&lt;/imageName&gt;
                &lt;mainClass&gt;com.example.Application&lt;/mainClass&gt;
                &lt;buildArgs&gt;
                    &lt;buildArg&gt;--no-fallback&lt;/buildArg&gt;
                    &lt;buildArg&gt;-H:+ReportExceptionStackTraces&lt;/buildArg&gt;
                &lt;/buildArgs&gt;
            &lt;/configuration&gt;
        &lt;/plugin&gt;
    &lt;/plugins&gt;
&lt;/build&gt;
</code></pre>
<h3>12.1.2 构建命令</h3>
<pre><code class="language-bash"># 构建原生镜像
./mvnw -Pnative native:compile
<h1>运行原生镜像</h1>
<p>./target/my-app
</code></pre></p>
<h2>12.2 性能对比</h2>
<h3>12.2.1 启动时间</h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>启动时间</th>
<th>内存占用</th>
<th>包大小</th>
</tr>
</thead>
<tbody>
<tr>
<td>JVM</td>
<td>2.5s</td>
<td>256MB</td>
<td>50MB</td>
</tr>
<tr>
<td>Native (Boot 3)</td>
<td>0.15s</td>
<td>65MB</td>
<td>80MB</td>
</tr>
<tr>
<td><strong>Native (Boot 4)</strong></td>
<td><strong>0.05s</strong></td>
<td><strong>45MB</strong></td>
<td><strong>60MB</strong></td>
</tr>
</tbody>
</table>
<p><strong>改进</strong>:</p>
<ul>
<li>✅ 启动时间: 67% 更快</li>
<li>✅ 内存占用: 31% 更少</li>
<li>✅ 包大小: 25% 更小</li>
</ul>
<h3>12.2.2 运行时性能</h3>
<pre><code class="language-java">@SpringBootApplication
public class NativeImageDemo {
<pre><code>public static void main(String[] args) {
    long startTime = System.currentTimeMillis();
    SpringApplication.run(NativeImageDemo.class, args);
    long endTime = System.currentTimeMillis();
<pre><code>System.out.println(&amp;amp;quot;Startup time: &amp;amp;quot; + (endTime - startTime) + &amp;amp;quot;ms&amp;amp;quot;);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>12.3 AOT 编译</h2>
<h3>12.3.1 启用 AOT</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  aot:
    enabled: true
    processing:
      optimize-configuration: true
      remove-unused-autoconfig: true
</code></pre>
<h3>12.3.2 AOT 提示</h3>
<p><strong>NativeHints.java</strong>:</p>
<pre><code class="language-java">@Configuration
public class NativeHints implements RuntimeHintsRegistrar {
<pre><code>@Override
public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
    // 注册反射提示
    hints.reflection()
        .registerType(MyClass.class, 
            MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
            MemberCategory.INVOKE_DECLARED_METHODS);
<pre><code>// 注册资源提示
hints.resources()
    .registerPattern(&amp;amp;quot;config/*.properties&amp;amp;quot;);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>12.4 Docker 集成</h2>
<p><strong>Dockerfile</strong>:</p>
<pre><code class="language-dockerfile">FROM ghcr.io/graalvm/native-image:ol8-java21 AS builder
<p>WORKDIR /app
COPY . .
RUN ./mvnw -Pnative native:compile</p>
<p>FROM <a href="http://gcr.io/distroless/base">gcr.io/distroless/base</a></p>
<p>COPY --from=builder /app/target/my-app /app
ENTRYPOINT [&quot;/app&quot;]
</code></pre></p>
<h2>12.5 最佳实践</h2>
<h3>12.5.1 优化建议</h3>
<ol>
<li><strong>避免反射</strong>: 尽量使用编译时已知的类型</li>
<li><strong>资源文件</strong>: 明确声明所有资源文件</li>
<li><strong>动态代理</strong>: 注册所有代理接口</li>
<li><strong>序列化</strong>: 注册需要序列化的类</li>
</ol>
<h3>12.5.2 常见问题</h3>
<p><strong>问题</strong>: ClassNotFoundException
<strong>解决</strong>: 添加反射配置</p>
<pre><code class="language-json">{
  &quot;name&quot;: &quot;com.example.MyClass&quot;,
  &quot;allDeclaredConstructors&quot;: true,
  &quot;allDeclaredMethods&quot;: true
}
</code></pre>
<h2>12.6 小结</h2>
<p>✅ <strong>原生镜像改进</strong></p>
<ul>
<li>更快的启动（0.05s）</li>
<li>更少的内存（45MB）</li>
<li>更小的包（60MB）</li>
</ul>
<p>✅ <strong>AOT 编译</strong></p>
<ul>
<li>编译时优化</li>
<li>移除未使用的配置</li>
</ul>
<p>✅ <strong>简化的构建</strong></p>
<ul>
<li>一条命令构建</li>
<li>Docker 集成</li>
</ul>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html">← 上一章</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html">下一章 →</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html" class="fn-left">上一篇：第11章：Spring Integration 改进</a>
            <a href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html" class="fn-right">下一篇：第13章：Docker 与 Kubernetes 集成</a>
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
