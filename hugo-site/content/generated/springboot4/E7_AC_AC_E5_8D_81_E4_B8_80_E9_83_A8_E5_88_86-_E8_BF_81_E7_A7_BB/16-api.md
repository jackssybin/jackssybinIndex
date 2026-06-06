---
title: 第16章：废弃 API 与替代方案 - Spring Boot 4教程
description: "第16章：废弃 API 与替代方案 本章概述 本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。
  本章重点 : ✅ 已移除的功能清单 ✅ 废弃的配置属性 ✅ 依赖版本变更 ✅ 替代方案详解 16.1 已移除的功能 16.1.1 Web 相关 已移除
  API 替代方案 说明 RestTemplate HTTP Interface /..."
url: /springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第16章：废弃 API 与替代方案</h2></div>
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
      <a class="current" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html">第16章：废弃 API 与替代方案</a>
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
            <h2><a rel="bookmark" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html">第16章：废弃 API 与替代方案</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 第十一部分-_迁移</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第16章：废弃 API 与替代方案</h1>
<h2>本章概述</h2>
<p>本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 已移除的功能清单</li>
<li>✅ 废弃的配置属性</li>
<li>✅ 依赖版本变更</li>
<li>✅ 替代方案详解</li>
</ul>
<h2>16.1 已移除的功能</h2>
<h3>16.1.1 Web 相关</h3>
<table>
<thead>
<tr>
<th>已移除 API</th>
<th>替代方案</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>RestTemplate</strong></td>
<td>HTTP Interface / WebClient</td>
<td>已废弃，建议迁移</td>
</tr>
<tr>
<td><strong>WebSecurityConfigurerAdapter</strong></td>
<td>SecurityFilterChain</td>
<td>已在 Boot 3 中移除</td>
</tr>
</tbody>
</table>
<p><strong>迁移示例</strong>:</p>
<p><strong>旧代码 (RestTemplate)</strong>:</p>
<pre><code class="language-java">@Service
public class UserService {
    private final RestTemplate restTemplate;
<pre><code>public User getUser(Long id) {
    return restTemplate.getForObject(
        &amp;quot;http://user-service/users/&amp;quot; + id,
        User.class
    );
}
</code></pre>
<p>}
</code></pre></p>
<p><strong>新代码 (HTTP Interface)</strong>:</p>
<pre><code class="language-java">public interface UserClient {
    @GetExchange(&quot;/users/{id}&quot;)
    User getUser(@PathVariable Long id);
}
<p>@Service
public class UserService {
private final UserClient userClient;</p>
<pre><code>public User getUser(Long id) {
    return userClient.getUser(id);
}
</code></pre>
<p>}
</code></pre></p>
<h3>16.1.2 Security 相关</h3>
<p><strong>旧代码</strong>:</p>
<pre><code class="language-java">@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
<pre><code>@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests()
        .antMatchers(&amp;quot;/public/**&amp;quot;).permitAll()
        .anyRequest().authenticated();
}
</code></pre>
<p>}
</code></pre></p>
<p><strong>新代码</strong>:</p>
<pre><code class="language-java">@Configuration
@EnableWebSecurity
public class SecurityConfig {
<pre><code>@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -&amp;gt; auth
        .requestMatchers(&amp;quot;/public/**&amp;quot;).permitAll()
        .anyRequest().authenticated()
    );
    return http.build();
}
</code></pre>
<p>}
</code></pre></p>
<h3>16.1.3 方法安全</h3>
<table>
<thead>
<tr>
<th>旧注解</th>
<th>新注解</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>@EnableGlobalMethodSecurity</td>
<td>@EnableMethodSecurity</td>
<td>新注解更简洁</td>
</tr>
</tbody>
</table>
<p><strong>迁移</strong>:</p>
<pre><code class="language-java">// 旧代码
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {}
<p>// 新代码
@EnableMethodSecurity
public class MethodSecurityConfig {}
</code></pre></p>
<h2>16.2 废弃的配置属性</h2>
<h3>16.2.1 配置属性对照表</h3>
<table>
<thead>
<tr>
<th>旧属性 (Boot 3)</th>
<th>新属性 (Boot 4)</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>spring.datasource.initialization-mode</code></td>
<td><code>spring.sql.init.mode</code></td>
<td>数据库初始化</td>
</tr>
<tr>
<td><code>spring.jpa.hibernate.use-new-id-generator-mappings</code></td>
<td>已移除</td>
<td>默认行为</td>
</tr>
<tr>
<td><code>spring.mvc.throw-exception-if-no-handler-found</code></td>
<td><code>spring.mvc.problemdetails.enabled</code></td>
<td>错误处理</td>
</tr>
</tbody>
</table>
<p><strong>迁移示例</strong>:</p>
<p><strong>旧配置</strong>:</p>
<pre><code class="language-yaml">spring:
  datasource:
    initialization-mode: always
  jpa:
    hibernate:
      use-new-id-generator-mappings: true
  mvc:
    throw-exception-if-no-handler-found: true
</code></pre>
<p><strong>新配置</strong>:</p>
<pre><code class="language-yaml">spring:
  sql:
    init:
      mode: always
  mvc:
    problemdetails:
      enabled: true
  threads:
    virtual:
      enabled: true  # 新增
</code></pre>
<h2>16.3 依赖版本变更</h2>
<h3>16.3.1 主要依赖升级</h3>
<table>
<thead>
<tr>
<th>依赖</th>
<th>Boot 3 版本</th>
<th>Boot 4 版本</th>
<th>重大变更</th>
</tr>
</thead>
<tbody>
<tr>
<td>Spring Framework</td>
<td>6.1.x</td>
<td>7.0.x</td>
<td>虚拟线程支持</td>
</tr>
<tr>
<td>Hibernate</td>
<td>6.1.x</td>
<td>6.4.x</td>
<td>性能改进</td>
</tr>
<tr>
<td>Tomcat</td>
<td>10.1.x</td>
<td>11.0.x</td>
<td>Jakarta EE 10</td>
</tr>
<tr>
<td>Jackson</td>
<td>2.15.x</td>
<td>2.16.x</td>
<td>Record 支持改进</td>
</tr>
</tbody>
</table>
<h3>16.3.2 处理依赖冲突</h3>
<p><strong>排除旧版本</strong>:</p>
<pre><code class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;com.example&lt;/groupId&gt;
    &lt;artifactId&gt;some-library&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;org.springframework&lt;/groupId&gt;
            &lt;artifactId&gt;spring-core&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
</code></pre>
<h2>16.4 Data 访问变更</h2>
<h3>16.4.1 Repository 方法</h3>
<p><strong>新增方法</strong>:</p>
<pre><code class="language-java">// 使用 Limit
List&lt;User&gt; findByStatus(UserStatus status, Limit limit);
<p>// 滚动查询
Window&lt;User&gt; findByStatus(UserStatus status, ScrollPosition position, Limit limit);
</code></pre></p>
<p><strong>废弃方法</strong>: 无，保持向后兼容</p>
<h2>16.5 完整迁移清单</h2>
<h3>16.5.1 代码迁移</h3>
<ul>
<li>[ ] 替换 RestTemplate 为 HTTP Interface</li>
<li>[ ] 更新 Security 配置为 Lambda DSL</li>
<li>[ ] 替换 @EnableGlobalMethodSecurity</li>
<li>[ ] 更新数据访问代码使用新 API</li>
</ul>
<h3>16.5.2 配置迁移</h3>
<ul>
<li>[ ] 更新 application.yml 配置属性</li>
<li>[ ] 启用虚拟线程</li>
<li>[ ] 配置 Problem Details</li>
<li>[ ] 更新数据库初始化配置</li>
</ul>
<h3>16.5.3 依赖迁移</h3>
<ul>
<li>[ ] 升级 Spring Boot 版本到 4.0</li>
<li>[ ] 升级 JDK 到 21</li>
<li>[ ] 检查第三方库兼容性</li>
<li>[ ] 解决依赖冲突</li>
</ul>
<h2>16.6 小结</h2>
<p>✅ <strong>已移除功能</strong></p>
<ul>
<li>RestTemplate（使用 HTTP Interface）</li>
<li>WebSecurityConfigurerAdapter（使用 SecurityFilterChain）</li>
</ul>
<p>✅ <strong>配置属性变更</strong></p>
<ul>
<li>数据库初始化配置</li>
<li>错误处理配置</li>
</ul>
<p>✅ <strong>依赖升级</strong></p>
<ul>
<li>Spring Framework 7.0</li>
<li>Hibernate 6.4</li>
<li>Tomcat 11.0</li>
</ul>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html">← 上一章</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">下一章 →</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html" class="fn-left">上一篇：第15章：性能提升详解</a>
            <a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html" class="fn-right">下一篇：第17章：从 Spring Boot 3 迁移</a>
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
