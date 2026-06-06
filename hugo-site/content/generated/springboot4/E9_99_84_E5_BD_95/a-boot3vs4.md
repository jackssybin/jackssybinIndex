---
title: 附录A：Spring Boot 3 vs 4 完整对比表 - Spring Boot 4教程
description: 附录A：Spring Boot 3 vs 4 完整对比表 核心特性对比 基础要求 项目 Spring Boot 3.x Spring
  Boot 4.0 最低 JDK 版本 Java 17 Java 21 Spring Framework 6.x 7.0 Jakarta EE
  9.x/10.x 10.x Servlet API 5.0/6.0 6.0 Mave...
url: /springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;附录A：Spring Boot 3 vs 4 完整对比表</h2></div>
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
      <a class="current" href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：Spring Boot 3 vs 4 完整对比表</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：Spring Boot 3 vs 4 完整对比表</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 附录</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>附录A：Spring Boot 3 vs 4 完整对比表</h1>
<h2>核心特性对比</h2>
<h3>基础要求</h3>
<table>
<thead>
<tr>
<th>项目</th>
<th>Spring Boot 3.x</th>
<th>Spring Boot 4.0</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>最低 JDK 版本</strong></td>
<td>Java 17</td>
<td>Java 21</td>
</tr>
<tr>
<td><strong>Spring Framework</strong></td>
<td>6.x</td>
<td>7.0</td>
</tr>
<tr>
<td><strong>Jakarta EE</strong></td>
<td>9.x/10.x</td>
<td>10.x</td>
</tr>
<tr>
<td><strong>Servlet API</strong></td>
<td>5.0/6.0</td>
<td>6.0</td>
</tr>
<tr>
<td><strong>Maven 最低版本</strong></td>
<td>3.6.3</td>
<td>3.9.0</td>
</tr>
<tr>
<td><strong>Gradle 最低版本</strong></td>
<td>7.5</td>
<td>8.5</td>
</tr>
</tbody>
</table>
<h3>核心框架</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>虚拟线程</strong></td>
<td>❌ 不支持</td>
<td>✅ 原生支持</td>
<td>革命性改进</td>
</tr>
<tr>
<td><strong>Record 类型</strong></td>
<td>⚠️ 部分支持</td>
<td>✅ 完全支持</td>
<td>全面集成</td>
</tr>
<tr>
<td><strong>模式匹配</strong></td>
<td>⚠️ 基础支持</td>
<td>✅ 增强支持</td>
<td>Switch 表达式</td>
</tr>
<tr>
<td><strong>AOT 编译</strong></td>
<td>⚠️ 实验性</td>
<td>✅ 生产就绪</td>
<td>性能提升</td>
</tr>
<tr>
<td><strong>启动时间</strong></td>
<td>2.5s</td>
<td>1.0s</td>
<td>60% 更快</td>
</tr>
<tr>
<td><strong>内存占用</strong></td>
<td>256MB</td>
<td>180MB</td>
<td>30% 更少</td>
</tr>
</tbody>
</table>
<h3>Web 层</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>HTTP Interface</strong></td>
<td>⚠️ 基础支持</td>
<td>✅ 完全支持</td>
<td>声明式 HTTP 客户端</td>
</tr>
<tr>
<td><strong>Problem Details</strong></td>
<td>❌ 需手动实现</td>
<td>✅ RFC 7807 原生支持</td>
<td>标准化错误响应</td>
</tr>
<tr>
<td><strong>WebSocket</strong></td>
<td>✅ 支持</td>
<td>✅ 虚拟线程优化</td>
<td>10,000+ 并发连接</td>
</tr>
<tr>
<td><strong>SSE</strong></td>
<td>✅ 支持</td>
<td>✅ 虚拟线程优化</td>
<td>更低延迟</td>
</tr>
<tr>
<td><strong>RestTemplate</strong></td>
<td>⚠️ 维护模式</td>
<td>❌ 已废弃</td>
<td>使用 HTTP Interface</td>
</tr>
</tbody>
</table>
<h3>数据访问</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Spring Data</strong></td>
<td>3.x</td>
<td>4.0</td>
<td>新查询方法</td>
</tr>
<tr>
<td><strong>Limit 支持</strong></td>
<td>❌ 需 Pageable</td>
<td>✅ 原生 Limit</td>
<td>更简洁</td>
</tr>
<tr>
<td><strong>滚动查询</strong></td>
<td>❌ 无</td>
<td>✅ Window/ScrollPosition</td>
<td>高效分页</td>
</tr>
<tr>
<td><strong>Hibernate</strong></td>
<td>6.1.x</td>
<td>6.4+</td>
<td>性能优化</td>
</tr>
<tr>
<td><strong>HikariCP</strong></td>
<td>标准配置</td>
<td>虚拟线程优化</td>
<td>更少连接</td>
</tr>
<tr>
<td><strong>R2DBC</strong></td>
<td>✅ 支持</td>
<td>✅ 增强支持</td>
<td>响应式改进</td>
</tr>
</tbody>
</table>
<h3>安全性</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Spring Security</strong></td>
<td>6.x</td>
<td>7.0</td>
<td>Lambda DSL</td>
</tr>
<tr>
<td><strong>配置方式</strong></td>
<td><code>.and()</code> 链式</td>
<td>Lambda 表达式</td>
<td>更简洁</td>
</tr>
<tr>
<td><strong>OAuth2</strong></td>
<td>✅ 支持</td>
<td>✅ 简化配置</td>
<td>更易用</td>
</tr>
<tr>
<td><strong>方法安全</strong></td>
<td>@EnableGlobalMethodSecurity</td>
<td>@EnableMethodSecurity</td>
<td>新注解</td>
</tr>
<tr>
<td><strong>密码编码</strong></td>
<td>BCrypt 为主</td>
<td>多算法支持</td>
<td>Argon2, SCrypt</td>
</tr>
<tr>
<td><strong>JWT</strong></td>
<td>需额外配置</td>
<td>更好集成</td>
<td>简化使用</td>
</tr>
</tbody>
</table>
<h3>观察性</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Micrometer</strong></td>
<td>1.12.x</td>
<td>1.13+</td>
<td>增强功能</td>
</tr>
<tr>
<td><strong>Observation API</strong></td>
<td>⚠️ 基础支持</td>
<td>✅ 完全集成</td>
<td>@Observed 注解</td>
</tr>
<tr>
<td><strong>OpenTelemetry</strong></td>
<td>需额外配置</td>
<td>✅ 原生支持</td>
<td>开箱即用</td>
</tr>
<tr>
<td><strong>虚拟线程监控</strong></td>
<td>❌ 无</td>
<td>✅ 完整支持</td>
<td>新指标</td>
</tr>
<tr>
<td><strong>Actuator</strong></td>
<td>标准端点</td>
<td>新增端点</td>
<td>虚拟线程状态</td>
</tr>
</tbody>
</table>
<h3>消息队列</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Kafka 客户端</strong></td>
<td>3.4.x</td>
<td>3.6+</td>
<td>新特性</td>
</tr>
<tr>
<td><strong>虚拟线程</strong></td>
<td>❌ 不支持</td>
<td>✅ 原生支持</td>
<td>5倍吞吐量</td>
</tr>
<tr>
<td><strong>批量消费</strong></td>
<td>✅ 支持</td>
<td>✅ 优化支持</td>
<td>更高效</td>
</tr>
<tr>
<td><strong>RabbitMQ</strong></td>
<td>✅ 支持</td>
<td>✅ 虚拟线程优化</td>
<td>更好性能</td>
</tr>
</tbody>
</table>
<h3>云原生</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>GraalVM Native</strong></td>
<td>⚠️ 实验性</td>
<td>✅ 生产就绪</td>
<td>稳定可靠</td>
</tr>
<tr>
<td><strong>启动时间</strong></td>
<td>0.15s</td>
<td>0.05s</td>
<td>67% 更快</td>
</tr>
<tr>
<td><strong>内存占用</strong></td>
<td>65MB</td>
<td>45MB</td>
<td>31% 更少</td>
</tr>
<tr>
<td><strong>包大小</strong></td>
<td>80MB</td>
<td>60MB</td>
<td>25% 更小</td>
</tr>
<tr>
<td><strong>Docker 支持</strong></td>
<td>✅ 支持</td>
<td>✅ 优化支持</td>
<td>更小镜像</td>
</tr>
<tr>
<td><strong>Kubernetes</strong></td>
<td>✅ 支持</td>
<td>✅ 增强支持</td>
<td>原生集成</td>
</tr>
</tbody>
</table>
<h2>性能对比</h2>
<h3>启动性能</h3>
<table>
<thead>
<tr>
<th>场景</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>提升</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>JVM 模式</strong></td>
<td>2.8s</td>
<td>1.2s</td>
<td>57% ↑</td>
</tr>
<tr>
<td><strong>JVM + AOT</strong></td>
<td>1.5s</td>
<td>0.8s</td>
<td>47% ↑</td>
</tr>
<tr>
<td><strong>Native Image</strong></td>
<td>0.15s</td>
<td>0.05s</td>
<td>67% ↑</td>
</tr>
</tbody>
</table>
<h3>运行时性能</h3>
<table>
<thead>
<tr>
<th>场景</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>提升</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>HTTP 吞吐量</strong> (1000并发)</td>
<td>850 req/s</td>
<td>3200 req/s</td>
<td>276% ↑</td>
</tr>
<tr>
<td><strong>WebSocket 连接</strong></td>
<td>2,000</td>
<td>10,000+</td>
<td>400% ↑</td>
</tr>
<tr>
<td><strong>Kafka 消费</strong></td>
<td>15,000 msg/s</td>
<td>85,000 msg/s</td>
<td>467% ↑</td>
</tr>
<tr>
<td><strong>数据库查询</strong></td>
<td>850 qps</td>
<td>3200 qps</td>
<td>276% ↑</td>
</tr>
</tbody>
</table>
<h3>资源占用</h3>
<table>
<thead>
<tr>
<th>指标</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>内存 (JVM)</strong></td>
<td>256MB</td>
<td>180MB</td>
<td>30% ↓</td>
</tr>
<tr>
<td><strong>内存 (Native)</strong></td>
<td>65MB</td>
<td>45MB</td>
<td>31% ↓</td>
</tr>
<tr>
<td><strong>CPU 使用率</strong></td>
<td>85%</td>
<td>45%</td>
<td>47% ↓</td>
</tr>
<tr>
<td><strong>线程数</strong></td>
<td>200</td>
<td>50</td>
<td>75% ↓</td>
</tr>
</tbody>
</table>
<h2>API 变更</h2>
<h3>新增 API</h3>
<pre><code class="language-java">// Limit 支持
List&lt;User&gt; users = repository.findAll(Limit.of(10));
<p>// 滚动查询
Window&lt;User&gt; window = repository.findAll(position, Limit.of(10));</p>
<p>// HTTP Interface
@GetExchange(&quot;/users/{id}&quot;)
User getUser(@PathVariable Long id);</p>
<p>// Problem Details
ProblemDetail problem = ProblemDetail.forStatusAndDetail(
HttpStatus.NOT_FOUND, &quot;User not found&quot;);
</code></pre></p>
<h3>废弃 API</h3>
<table>
<thead>
<tr>
<th>API</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
<th>替代方案</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RestTemplate</strong></td>
<td>⚠️ 维护模式</td>
<td>❌ 废弃</td>
<td>HTTP Interface / WebClient</td>
</tr>
<tr>
<td><strong>WebSecurityConfigurerAdapter</strong></td>
<td>❌ 已移除</td>
<td>❌ 已移除</td>
<td>SecurityFilterChain</td>
</tr>
<tr>
<td><strong>@EnableGlobalMethodSecurity</strong></td>
<td>⚠️ 废弃</td>
<td>❌ 已移除</td>
<td>@EnableMethodSecurity</td>
</tr>
</tbody>
</table>
<h3>配置属性变更</h3>
<table>
<thead>
<tr>
<th>旧属性 (Boot 3)</th>
<th>新属性 (Boot 4)</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>spring.datasource.initialization-mode</code></td>
<td><code>spring.sql.init.mode</code></td>
</tr>
<tr>
<td><code>spring.jpa.hibernate.use-new-id-generator-mappings</code></td>
<td>已移除（默认行为）</td>
</tr>
<tr>
<td><code>spring.mvc.throw-exception-if-no-handler-found</code></td>
<td><code>spring.mvc.problemdetails.enabled</code></td>
</tr>
</tbody>
</table>
<h2>依赖版本</h2>
<h3>核心依赖</h3>
<table>
<thead>
<tr>
<th>依赖</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Spring Framework</strong></td>
<td>6.1.x</td>
<td>7.0.x</td>
</tr>
<tr>
<td><strong>Hibernate</strong></td>
<td>6.1.x</td>
<td>6.4.x</td>
</tr>
<tr>
<td><strong>Tomcat</strong></td>
<td>10.1.x</td>
<td>11.0.x</td>
</tr>
<tr>
<td><strong>Jetty</strong></td>
<td>11.x</td>
<td>12.x</td>
</tr>
<tr>
<td><strong>Jackson</strong></td>
<td>2.15.x</td>
<td>2.16.x</td>
</tr>
<tr>
<td><strong>Micrometer</strong></td>
<td>1.12.x</td>
<td>1.13.x</td>
</tr>
<tr>
<td><strong>Kafka</strong></td>
<td>3.4.x</td>
<td>3.6.x</td>
</tr>
</tbody>
</table>
<h2>迁移建议</h2>
<h3>优先级</h3>
<table>
<thead>
<tr>
<th>优先级</th>
<th>场景</th>
<th>建议</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>高</strong></td>
<td>I/O 密集型应用</td>
<td>立即升级，虚拟线程带来巨大提升</td>
</tr>
<tr>
<td><strong>高</strong></td>
<td>微服务架构</td>
<td>升级，性能和资源占用显著改善</td>
</tr>
<tr>
<td><strong>中</strong></td>
<td>传统单体应用</td>
<td>评估后升级，性能有提升</td>
</tr>
<tr>
<td><strong>低</strong></td>
<td>CPU 密集型应用</td>
<td>可延后，虚拟线程优势不明显</td>
</tr>
</tbody>
</table>
<h3>迁移时间估算</h3>
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
<td><strong>小型</strong> (&lt; 10,000 行)</td>
<td>1-2 周</td>
<td>主要是测试和验证</td>
</tr>
<tr>
<td><strong>中型</strong> (10,000-50,000 行)</td>
<td>3-4 周</td>
<td>需要仔细测试</td>
</tr>
<tr>
<td><strong>大型</strong> (&gt; 50,000 行)</td>
<td>6-8 周</td>
<td>分模块迁移</td>
</tr>
</tbody>
</table>
<h2>总结</h2>
<h3>Spring Boot 4 核心优势</h3>
<ol>
<li><strong>性能革命</strong>: 虚拟线程带来 3-5 倍性能提升</li>
<li><strong>资源优化</strong>: 内存和 CPU 占用显著降低</li>
<li><strong>开发体验</strong>: 更简洁的 API 和配置</li>
<li><strong>云原生</strong>: 原生镜像生产就绪</li>
<li><strong>标准化</strong>: RFC 7807、OpenTelemetry 等标准支持</li>
</ol>
<h3>升级建议</h3>
<p>✅ <strong>推荐升级的场景</strong>:</p>
<ul>
<li>高并发 Web 应用</li>
<li>微服务架构</li>
<li>需要快速启动的应用</li>
<li>云原生部署</li>
</ul>
<p>⚠️ <strong>谨慎升级的场景</strong>:</p>
<ul>
<li>大量使用废弃 API</li>
<li>第三方库不兼容</li>
<li>团队不熟悉 Java 21</li>
</ul>
<hr>
<p><strong>最后更新</strong>: 2024-12-24<br>
<strong>版本</strong>: Spring Boot 4.0.0</p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html" class="fn-left">上一篇：第17章：从 Spring Boot 3 迁移</a>
            <a href="/springboot4/E9_99_84_E5_BD_95/b.html" class="fn-right">下一篇：附录B：虚拟线程最佳实践</a>
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
