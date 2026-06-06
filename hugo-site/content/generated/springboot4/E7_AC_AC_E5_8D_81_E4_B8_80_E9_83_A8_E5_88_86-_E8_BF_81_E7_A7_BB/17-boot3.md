---
title: 第17章：从 Spring Boot 3 迁移 - Spring Boot 4教程
description: "第17章：从 Spring Boot 3 迁移 本章概述 本章提供从 Spring Boot 3 迁移到 Spring Boot 4
  的完整指南，包括准备工作、迁移步骤和常见问题解决方案。 本章重点 : ✅ 迁移前准备 ✅ 分步迁移指南 ✅ 常见迁移问题 ✅ 迁移后验证 17.1
  迁移前准备 17.1.1 兼容性检查清单 环境要求 ✅ JDK 21 或更高版..."
url: /springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第17章：从 Spring Boot 3 迁移</h2></div>
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
<a class="current" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a>
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
            <h2><a rel="bookmark" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 第十一部分-_迁移</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第17章：从 Spring Boot 3 迁移</h1>
<h2>本章概述</h2>
<p>本章提供从 Spring Boot 3 迁移到 Spring Boot 4 的完整指南，包括准备工作、迁移步骤和常见问题解决方案。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 迁移前准备</li>
<li>✅ 分步迁移指南</li>
<li>✅ 常见迁移问题</li>
<li>✅ 迁移后验证</li>
</ul>
<h2>17.1 迁移前准备</h2>
<h3>17.1.1 兼容性检查清单</h3>
<h4>环境要求</h4>
<ul>
<li>✅ JDK 21 或更高版本</li>
<li>✅ Maven 3.9+ 或 Gradle 8.5+</li>
<li>✅ IDE 支持 Java 21</li>
</ul>
<h4>依赖检查</h4>
<pre><code class="language-bash"># 检查依赖兼容性
./mvnw dependency:tree
<h1>查找过时的依赖</h1>
<p>./mvnw versions:display-dependency-updates
</code></pre></p>
<h3>17.1.2 评估清单</h3>
<p><strong>必须检查的项目</strong>:</p>
<table>
<thead>
<tr>
<th>检查项</th>
<th>说明</th>
<th>操作</th>
</tr>
</thead>
<tbody>
<tr>
<td>Java 版本</td>
<td>必须 &gt;= 21</td>
<td>升级 JDK</td>
</tr>
<tr>
<td>废弃 API</td>
<td>检查使用的废弃 API</td>
<td>替换为新 API</td>
</tr>
<tr>
<td>第三方库</td>
<td>检查兼容性</td>
<td>升级到兼容版本</td>
</tr>
<tr>
<td>配置属性</td>
<td>检查废弃的配置</td>
<td>更新配置</td>
</tr>
<tr>
<td>自定义配置</td>
<td>检查自动配置类</td>
<td>适配新版本</td>
</tr>
</tbody>
</table>
<h2>17.2 分步迁移指南</h2>
<h3>17.2.1 步骤 1: 升级 JDK</h3>
<p><strong>Windows</strong>:</p>
<pre><code class="language-powershell"># 下载并安装 JDK 21
# 设置环境变量
$env:JAVA_HOME = &quot;C:\Program Files\Java\jdk-21&quot;
$env:PATH = &quot;$env:JAVA_HOME\bin;$env:PATH&quot;
<h1>验证</h1>
<p>java -version
</code></pre></p>
<p><strong>Linux/macOS</strong>:</p>
<pre><code class="language-bash"># 使用 SDKMAN
sdk install java 21-tem
sdk use java 21-tem
<h1>验证</h1>
<p>java -version
</code></pre></p>
<h3>17.2.2 步骤 2: 更新 pom.xml</h3>
<p><strong>Spring Boot 3 版本</strong>:</p>
<pre><code class="language-xml">&lt;parent&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
    &lt;version&gt;3.2.0&lt;/version&gt;
&lt;/parent&gt;
<p>&lt;properties&gt;
&lt;java.version&gt;17&lt;/java.version&gt;
&lt;/properties&gt;
</code></pre></p>
<p><strong>Spring Boot 4 版本</strong>:</p>
<pre><code class="language-xml">&lt;parent&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
    &lt;version&gt;4.0.0&lt;/version&gt;
&lt;/parent&gt;
<p>&lt;properties&gt;
&lt;java.version&gt;21&lt;/java.version&gt;
&lt;/properties&gt;
</code></pre></p>
<h3>17.2.3 步骤 3: 更新配置</h3>
<p><strong>application.yml 变更</strong>:</p>
<pre><code class="language-yaml"># Spring Boot 3
spring:
  mvc:
    throw-exception-if-no-handler-found: true
<h1>Spring Boot 4 - 启用虚拟线程</h1>
<p>spring:
threads:
virtual:
enabled: true
mvc:
problemdetails:
enabled: true  # 新增
</code></pre></p>
<h3>17.2.4 步骤 4: 更新代码</h3>
<h4>Security 配置</h4>
<p><strong>Spring Boot 3</strong>:</p>
<pre><code class="language-java">@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers(&quot;/public/**&quot;).permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin();
        return http.build();
    }
}
</code></pre>
<p><strong>Spring Boot 4</strong>:</p>
<pre><code class="language-java">@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -&gt; auth
                .requestMatchers(&quot;/public/**&quot;).permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -&gt; form.permitAll());
        return http.build();
    }
}
</code></pre>
<h4>数据访问</h4>
<p><strong>Spring Boot 3</strong>:</p>
<pre><code class="language-java">// 获取前 10 条记录
Pageable pageable = PageRequest.of(0, 10);
Page&lt;User&gt; users = userRepository.findAll(pageable);
</code></pre>
<p><strong>Spring Boot 4</strong>:</p>
<pre><code class="language-java">// 使用 Limit
List&lt;User&gt; users = userRepository.findAll(Limit.of(10));
</code></pre>
<h3>17.2.5 步骤 5: 更新测试</h3>
<p><strong>JUnit 5 配置</strong>:</p>
<pre><code class="language-java">@SpringBootTest
class ApplicationTests {
<pre><code>@Test
void contextLoads() {
    // 验证应用启动
}
<p>@Test
void testVirtualThreads() {
Thread thread = Thread.currentThread();
assertTrue(thread.isVirtual(), &amp;quot;Should use virtual threads&amp;quot;);
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>17.3 常见迁移问题</h2>
<h3>17.3.1 问题 1: 编译错误</h3>
<p><strong>问题</strong>: 找不到某些类或方法</p>
<p><strong>原因</strong>: API 已被移除或重命名</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-java">// Spring Boot 3
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
<p>// Spring Boot 4 - 已移除
// 使用 SecurityFilterChain 替代
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
// 配置
}
</code></pre></p>
<h3>17.3.2 问题 2: 配置属性失效</h3>
<p><strong>问题</strong>: 某些配置属性不再生效</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-yaml"># Spring Boot 3
spring:
  datasource:
    initialization-mode: always
<h1>Spring Boot 4</h1>
<p>spring:
sql:
init:
mode: always
</code></pre></p>
<h3>17.3.3 问题 3: 依赖冲突</h3>
<p><strong>问题</strong>: 第三方库不兼容</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-xml">&lt;!-- 排除旧版本 --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;com.example&lt;/groupId&gt;
    &lt;artifactId&gt;some-library&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;old-dependency&lt;/groupId&gt;
            &lt;artifactId&gt;old-artifact&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
<p>&lt;!-- 添加兼容版本 --&gt;
&lt;dependency&gt;
&lt;groupId&gt;new-dependency&lt;/groupId&gt;
&lt;artifactId&gt;new-artifact&lt;/artifactId&gt;
&lt;version&gt;compatible-version&lt;/version&gt;
&lt;/dependency&gt;
</code></pre></p>
<h3>17.3.4 问题 4: 性能问题</h3>
<p><strong>问题</strong>: 迁移后性能下降</p>
<p><strong>检查项</strong>:</p>
<ol>
<li>虚拟线程是否启用</li>
<li>数据库连接池配置</li>
<li>JVM 参数设置</li>
</ol>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-yaml">spring:
  threads:
    virtual:
      enabled: true
<p>datasource:
hikari:
maximum-pool-size: 20  # 虚拟线程下可以减小
</code></pre></p>
<h2>17.4 迁移后验证</h2>
<h3>17.4.1 功能测试</h3>
<p><strong>测试清单</strong>:</p>
<pre><code class="language-java">@SpringBootTest
class MigrationTests {
<pre><code>@Test
void testApplicationStarts() {
    // 验证应用启动
}
<p>@Test
void testVirtualThreadsEnabled() {
assertTrue(Thread.currentThread().isVirtual());
}</p>
<p>@Test
void testDatabaseConnection() {
// 验证数据库连接
}</p>
<p>@Test
void testSecurityConfiguration() {
// 验证安全配置
}</p>
<p>@Test
void testApiEndpoints() {
// 验证 API 端点
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>17.4.2 性能测试</h3>
<p><strong>启动时间对比</strong>:</p>
<pre><code class="language-bash"># 测试启动时间
time java -jar target/myapp.jar
<h1>预期结果</h1>
<h1>Spring Boot 3: ~2.5s</h1>
<h1>Spring Boot 4: ~1.0s (60% 更快)</h1>
<p></code></pre></p>
<p><strong>压力测试</strong>:</p>
<pre><code class="language-bash"># 使用 Apache Bench
ab -n 10000 -c 100 http://localhost:8080/api/test
<h1>对比吞吐量和延迟</h1>
<p></code></pre></p>
<h3>17.4.3 监控验证</h3>
<p><strong>检查 Actuator</strong>:</p>
<pre><code class="language-bash"># 健康检查
curl http://localhost:8080/actuator/health
<h1>指标</h1>
<p>curl <a href="http://localhost:8080/actuator/metrics">http://localhost:8080/actuator/metrics</a></p>
<h1>虚拟线程指标</h1>
<p>curl <a href="http://localhost:8080/actuator/metrics/jvm.threads.virtual">http://localhost:8080/actuator/metrics/jvm.threads.virtual</a>
</code></pre></p>
<h2>17.5 回滚计划</h2>
<h3>17.5.1 准备回滚</h3>
<p><strong>回滚步骤</strong>:</p>
<ol>
<li>保留 Spring Boot 3 版本的分支</li>
<li>准备回滚脚本</li>
<li>备份数据库</li>
<li>准备降级方案</li>
</ol>
<p><strong>回滚命令</strong>:</p>
<pre><code class="language-bash"># Git 回滚
git checkout spring-boot-3-backup
<h1>重新构建</h1>
<p>./mvnw clean package</p>
<h1>部署旧版本</h1>
<p></code></pre></p>
<h2>17.6 迁移最佳实践</h2>
<h3>17.6.1 推荐策略</h3>
<ol>
<li><strong>渐进式迁移</strong>: 先在开发环境测试</li>
<li><strong>灰度发布</strong>: 逐步切换生产流量</li>
<li><strong>监控告警</strong>: 密切关注性能指标</li>
<li><strong>快速回滚</strong>: 准备好回滚方案</li>
</ol>
<h3>17.6.2 迁移时间表</h3>
<p><strong>建议时间表</strong>:</p>
<table>
<thead>
<tr>
<th>阶段</th>
<th>时间</th>
<th>任务</th>
</tr>
</thead>
<tbody>
<tr>
<td>准备</td>
<td>1-2 周</td>
<td>环境准备、依赖检查</td>
</tr>
<tr>
<td>开发环境</td>
<td>1 周</td>
<td>迁移和测试</td>
</tr>
<tr>
<td>测试环境</td>
<td>1-2 周</td>
<td>完整测试</td>
</tr>
<tr>
<td>预发布</td>
<td>1 周</td>
<td>灰度测试</td>
</tr>
<tr>
<td>生产环境</td>
<td>1 周</td>
<td>正式发布</td>
</tr>
</tbody>
</table>
<h2>17.7 完整迁移案例</h2>
<h3>17.7.1 实际项目迁移</h3>
<p><strong>项目信息</strong>:</p>
<ul>
<li>应用类型: 微服务</li>
<li>代码量: 50,000 行</li>
<li>依赖数量: 30+</li>
</ul>
<p><strong>迁移过程</strong>:</p>
<pre><code class="language-java">// 1. 更新 pom.xml
// 2. 升级 JDK 到 21
// 3. 更新配置文件
// 4. 修改 Security 配置
// 5. 更新数据访问代码
// 6. 运行测试
// 7. 性能测试
// 8. 部署验证
</code></pre>
<p><strong>迁移结果</strong>:</p>
<ul>
<li>✅ 启动时间: 2.8s → 1.1s (61% 提升)</li>
<li>✅ 吞吐量: 850 req/s → 3200 req/s (276% 提升)</li>
<li>✅ 内存占用: 256MB → 180MB (30% 降低)</li>
<li>✅ 迁移时间: 3 周</li>
</ul>
<h2>17.8 小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>迁移准备</strong></p>
<ul>
<li>兼容性检查</li>
<li>环境准备</li>
</ul>
<p>✅ <strong>迁移步骤</strong></p>
<ul>
<li>JDK 升级</li>
<li>依赖更新</li>
<li>代码修改</li>
</ul>
<p>✅ <strong>问题解决</strong></p>
<ul>
<li>常见问题</li>
<li>解决方案</li>
</ul>
<p>✅ <strong>验证测试</strong></p>
<ul>
<li>功能测试</li>
<li>性能测试</li>
<li>监控验证</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>微服务应用升级实战</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html">← 上一章：废弃 API 与替代方案</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="../%E7%AC%AC%E5%8D%81%E4%BA%8C%E9%83%A8%E5%88%86-%E5%AE%9E%E6%88%98%E6%A1%88%E4%BE%8B/%E7%AC%AC18%E7%AB%A0-%E5%BE%AE%E6%9C%8D%E5%8A%A1%E5%8D%87%E7%BA%A7%E5%AE%9E%E6%88%98.md">下一章：微服务应用升级实战 →</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html" class="fn-left">上一篇：第16章：废弃 API 与替代方案</a>
            <a href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html" class="fn-right">下一篇：附录A：Spring Boot 3 vs 4 完整对比表</a>
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
