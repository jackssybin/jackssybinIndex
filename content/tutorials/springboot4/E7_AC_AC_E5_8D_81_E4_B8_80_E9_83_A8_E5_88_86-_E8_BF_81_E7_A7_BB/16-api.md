---
title: "第16章：废弃 API 与替代方案"
permalink: "/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html"
description: "第16章：废弃 API 与替代方案 本章概述 本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。 本章重点: ✅ 已移除的功能清单 ✅ 废弃的配置属性 ✅ 依赖版本变更 ✅ 替代方案详解 16.1 已移除的功能 16.1.1 Web 相关 | 已移除 API | 替代方案 | 说明 | |||| | RestTemplate | ..."
---

<h1>第16章：废弃 API 与替代方案</h1>
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
</ul>
