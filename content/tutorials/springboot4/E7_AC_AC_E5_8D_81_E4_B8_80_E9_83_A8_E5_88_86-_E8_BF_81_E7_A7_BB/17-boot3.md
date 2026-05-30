---
title: "第17章：从 Spring Boot 3 迁移"
permalink: "/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html"
description: "第17章：从 Spring Boot 3 迁移 本章概述 本章提供从 Spring Boot 3 迁移到 Spring Boot 4 的完整指南，包括准备工作、迁移步骤和常见问题解决方案。 本章重点: ✅ 迁移前准备 ✅ 分步迁移指南 ✅ 常见迁移问题 ✅ 迁移后验证 17.1 迁移前准备 17.1.1 兼容性检查清单 环境要求 ✅ JDK 21 或更高版本..."
---

<h1>第17章：从 Spring Boot 3 迁移</h1>
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
</ul>
