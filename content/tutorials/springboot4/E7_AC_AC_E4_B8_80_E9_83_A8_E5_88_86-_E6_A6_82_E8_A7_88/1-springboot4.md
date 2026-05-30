---
title: "第1章：Spring Boot 4 简介"
permalink: "/springboot4/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E6_A6_82_E8_A7_88/1-springboot4.html"
description: "第1章：Spring Boot 4 简介 1.1 Spring Boot 4 发布背景 发布时间与版本信息 正式发布: 2024年11月（预计） 当前版本: 4.0.0 Spring Framework 版本: 7.0.x 最低 JDK 要求: Java 21 为什么需要 Spring Boot 4？ Spring Boot 4 的发布主要是为了： 1. 拥..."
---

<h1>第1章：Spring Boot 4 简介</h1>
<h2>1.1 Spring Boot 4 发布背景</h2>
<h3>发布时间与版本信息</h3>
<ul>
<li><strong>正式发布</strong>: 2024年11月（预计）</li>
<li><strong>当前版本</strong>: 4.0.0</li>
<li><strong>Spring Framework 版本</strong>: 7.0.x</li>
<li><strong>最低 JDK 要求</strong>: Java 21</li>
</ul>
<h3>为什么需要 Spring Boot 4？</h3>
<p>Spring Boot 4 的发布主要是为了：</p>
<ol>
<li>
<p><strong>拥抱 Java 21 新特性</strong></p>
<ul>
<li>虚拟线程（Virtual Threads / Project Loom）</li>
<li>Record 模式匹配</li>
<li>结构化并发</li>
<li>字符串模板（预览）</li>
</ul>
</li>
<li>
<p><strong>提升云原生能力</strong></p>
<ul>
<li>更好的 GraalVM 原生镜像支持</li>
<li>更快的启动时间</li>
<li>更小的内存占用</li>
<li>容器化优化</li>
</ul>
</li>
<li>
<p><strong>增强可观察性</strong></p>
<ul>
<li>统一的观察性 API</li>
<li>原生的分布式追踪</li>
<li>更丰富的指标收集</li>
</ul>
</li>
<li>
<p><strong>简化开发体验</strong></p>
<ul>
<li>更简洁的配置</li>
<li>更强大的自动配置</li>
<li>更好的开发工具支持</li>
</ul>
</li>
</ol>
<h2>1.2 主要新特性一览</h2>
<h3>🔥 核心新特性</h3>
<h4>1. 虚拟线程（Virtual Threads）支持</h4>
<pre><code class="language-java">// Spring Boot 4 自动配置虚拟线程
@SpringBootApplication
public class VirtualThreadsApplication {
    public static void main(String[] args) {
        SpringApplication.run(VirtualThreadsApplication.class, args);
    }
}
</code></pre>
<p><strong>配置文件</strong>:</p>
<pre><code class="language-yaml"># application.yml
spring:
  threads:
    virtual:
      enabled: true  # 启用虚拟线程
</code></pre>
<h4>2. HTTP Interface 客户端</h4>
<pre><code class="language-java">// 声明式 HTTP 客户端（类似 Feign）
public interface UserClient {
    @GetExchange(&quot;/users/{id}&quot;)
    User getUser(@PathVariable Long id);
<pre><code>@PostExchange(&amp;quot;/users&amp;quot;)
User createUser(@RequestBody User user);
</code></pre>
<p>}
</code></pre></p>
<h4>3. Problem Details (RFC 7807) 支持</h4>
<pre><code class="language-java">// 标准化的错误响应
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, 
            ex.getMessage()
        );
        problemDetail.setTitle(&quot;Resource Not Found&quot;);
        problemDetail.setProperty(&quot;timestamp&quot;, Instant.now());
        return problemDetail;
    }
}
</code></pre>
<h4>4. 原生镜像（Native Image）改进</h4>
<pre><code class="language-bash"># 更简单的原生镜像构建
./mvnw -Pnative native:compile
<h1>启动时间对比</h1>
<h1>JVM 模式: ~2-3 秒</h1>
<h1>Native 模式: ~0.05 秒（快 40-60 倍）</h1>
<p></code></pre></p>
<h4>5. 观察性（Observability）增强</h4>
<pre><code class="language-java">// 自动化的追踪和指标
@RestController
public class OrderController {
    @GetMapping(&quot;/orders/{id}&quot;)
    @Observed(name = &quot;orders.get&quot;)  // 自动生成指标和追踪
    public Order getOrder(@PathVariable Long id) {
        return orderService.findById(id);
    }
}
</code></pre>
<h3>📊 版本依赖升级</h3>
<table>
<thead>
<tr>
<th>组件</th>
<th>Spring Boot 3.x</th>
<th>Spring Boot 4.0</th>
</tr>
</thead>
<tbody>
<tr>
<td>Spring Framework</td>
<td>6.x</td>
<td>7.0</td>
</tr>
<tr>
<td>Java 最低版本</td>
<td>17</td>
<td>21</td>
</tr>
<tr>
<td>Jakarta EE</td>
<td>9.x/10.x</td>
<td>10.x</td>
</tr>
<tr>
<td>Hibernate</td>
<td>6.1.x</td>
<td>6.4+</td>
</tr>
<tr>
<td>Tomcat</td>
<td>10.1.x</td>
<td>11.0.x</td>
</tr>
<tr>
<td>Jetty</td>
<td>11.x</td>
<td>12.x</td>
</tr>
<tr>
<td>Micrometer</td>
<td>1.12.x</td>
<td>1.13+</td>
</tr>
<tr>
<td>Spring Security</td>
<td>6.x</td>
<td>7.0</td>
</tr>
<tr>
<td>Spring Data</td>
<td>3.x</td>
<td>4.0</td>
</tr>
</tbody>
</table>
<h2>1.3 升级路径与兼容性</h2>
<h3>兼容性矩阵</h3>
<h4>✅ 完全兼容</h4>
<ul>
<li>大部分 Spring Boot 3.2+ 的应用可以平滑升级</li>
<li>配置文件格式保持兼容</li>
<li>核心注解和 API 保持稳定</li>
</ul>
<h4>⚠️ 需要调整</h4>
<ul>
<li>使用了废弃 API 的代码</li>
<li>自定义的自动配置类</li>
<li>某些第三方库可能需要升级</li>
</ul>
<h4>❌ 不兼容</h4>
<ul>
<li>Java 17 以下版本</li>
<li>某些已移除的废弃功能</li>
<li>部分过时的配置属性</li>
</ul>
<h3>升级决策树</h3>
<pre><code>是否使用 Java 21？
├─ 是 → 可以升级到 Spring Boot 4
│   └─ 是否需要虚拟线程？
│       ├─ 是 → 强烈推荐升级
│       └─ 否 → 评估其他新特性价值
└─ 否 → 暂时保持 Spring Boot 3
    └─ 计划升级 Java 版本
</code></pre>
<h2>1.4 开发环境准备</h2>
<h3>1.4.1 安装 JDK 21</h3>
<h4>Windows</h4>
<pre><code class="language-powershell"># 使用 SDKMAN（推荐）
sdk install java 21-tem
<h1>或下载 Oracle JDK 21</h1>
<h1><a href="https://www.oracle.com/java/technologies/downloads/#java21">https://www.oracle.com/java/technologies/downloads/#java21</a></h1>
<p></code></pre></p>
<h4>macOS</h4>
<pre><code class="language-bash"># 使用 Homebrew
brew install openjdk@21
<h1>或使用 SDKMAN</h1>
<p>sdk install java 21-tem
</code></pre></p>
<h4>Linux</h4>
<pre><code class="language-bash"># Ubuntu/Debian
sudo apt update
sudo apt install openjdk-21-jdk
<h1>或使用 SDKMAN</h1>
<p>sdk install java 21-tem
</code></pre></p>
<p><strong>验证安装</strong>:</p>
<pre><code class="language-bash">java -version
# 输出应包含: openjdk version &quot;21&quot; 或 java version &quot;21&quot;
</code></pre>
<h3>1.4.2 配置构建工具</h3>
<h4>Maven (pom.xml)</h4>
<pre><code class="language-xml">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;
         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;
         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;
    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
<pre><code>&amp;lt;parent&amp;gt;
    &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;
    &amp;lt;artifactId&amp;gt;spring-boot-starter-parent&amp;lt;/artifactId&amp;gt;
    &amp;lt;version&amp;gt;4.0.0&amp;lt;/version&amp;gt;
    &amp;lt;relativePath/&amp;gt;
&amp;lt;/parent&amp;gt;
<p>&amp;lt;groupId&amp;gt;com.example&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;springboot4-demo&amp;lt;/artifactId&amp;gt;
&amp;lt;version&amp;gt;0.0.1-SNAPSHOT&amp;lt;/version&amp;gt;
&amp;lt;name&amp;gt;springboot4-demo&amp;lt;/name&amp;gt;
&amp;lt;description&amp;gt;Spring Boot 4 Demo Project&amp;lt;/description&amp;gt;</p>
<p>&amp;lt;properties&amp;gt;
&amp;lt;java.version&amp;gt;21&amp;lt;/java.version&amp;gt;
&amp;lt;/properties&amp;gt;</p>
<p>&amp;lt;dependencies&amp;gt;
&amp;lt;dependency&amp;gt;
&amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;
&amp;lt;/dependency&amp;gt;</p>
<pre><code>&amp;amp;lt;dependency&amp;amp;gt;
    &amp;amp;lt;groupId&amp;amp;gt;org.springframework.boot&amp;amp;lt;/groupId&amp;amp;gt;
    &amp;amp;lt;artifactId&amp;amp;gt;spring-boot-starter-test&amp;amp;lt;/artifactId&amp;amp;gt;
    &amp;amp;lt;scope&amp;amp;gt;test&amp;amp;lt;/scope&amp;amp;gt;
&amp;amp;lt;/dependency&amp;amp;gt;
</code></pre>
<p>&amp;lt;/dependencies&amp;gt;</p>
<p>&amp;lt;build&amp;gt;
&amp;lt;plugins&amp;gt;
&amp;lt;plugin&amp;gt;
&amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;spring-boot-maven-plugin&amp;lt;/artifactId&amp;gt;
&amp;lt;/plugin&amp;gt;
&amp;lt;/plugins&amp;gt;
&amp;lt;/build&amp;gt;
</code></pre></p>
<p>&lt;/project&gt;
</code></pre></p>
<h4>Gradle (build.gradle)</h4>
<pre><code class="language-groovy">plugins {
    id 'java'
    id 'org.springframework.boot' version '4.0.0'
    id 'io.spring.dependency-management' version '1.1.4'
}
<p>group = 'com.example'
version = '0.0.1-SNAPSHOT'</p>
<p>java {
sourceCompatibility = '21'
}</p>
<p>repositories {
mavenCentral()
}</p>
<p>dependencies {
implementation 'org.springframework.boot:spring-boot-starter-web'
testImplementation 'org.springframework.boot:spring-boot-starter-test'
}</p>
<p>tasks.named('test') {
useJUnitPlatform()
}
</code></pre></p>
<h3>1.4.3 IDE 配置</h3>
<h4>IntelliJ IDEA</h4>
<ol>
<li>
<p><strong>版本要求</strong>: 2024.1 或更高</p>
</li>
<li>
<p><strong>配置 JDK 21</strong>:</p>
<ul>
<li>File → Project Structure → Project SDK → 选择 JDK 21</li>
<li>File → Settings → Build, Execution, Deployment → Compiler → Java Compiler → 设置 Target bytecode version 为 21</li>
</ul>
</li>
<li>
<p><strong>启用虚拟线程预览</strong>:</p>
<pre><code>Settings → Build, Execution, Deployment → Compiler → Java Compiler
Additional command line parameters: --enable-preview
</code></pre>
</li>
</ol>
<h4>VS Code</h4>
<ol>
<li>
<p>安装扩展:</p>
<ul>
<li>Extension Pack for Java</li>
<li>Spring Boot Extension Pack</li>
</ul>
</li>
<li>
<p>配置 settings.json:</p>
</li>
</ol>
<pre><code class="language-json">{
    &quot;java.configuration.runtimes&quot;: [
        {
            &quot;name&quot;: &quot;JavaSE-21&quot;,
            &quot;path&quot;: &quot;/path/to/jdk-21&quot;,
            &quot;default&quot;: true
        }
    ],
    &quot;java.jdt.ls.java.home&quot;: &quot;/path/to/jdk-21&quot;
}
</code></pre>
<h2>1.5 第一个 Spring Boot 4 应用</h2>
<h3>案例：Hello Spring Boot 4</h3>
<h4>1. 创建项目</h4>
<pre><code class="language-bash"># 使用 Spring Initializr
curl https://start.spring.io/starter.zip \
  -d dependencies=web \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=4.0.0 \
  -d baseDir=hello-springboot4 \
  -d groupId=com.example \
  -d artifactId=hello-springboot4 \
  -d javaVersion=21 \
  -o hello-springboot4.zip
<p>unzip hello-springboot4.zip
cd hello-springboot4
</code></pre></p>
<h4>2. 主应用类</h4>
<pre><code class="language-java">package com.example.hellospringboot4;
<p>import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;</p>
<p>@SpringBootApplication
public class HelloSpringboot4Application {
public static void main(String[] args) {
SpringApplication.run(HelloSpringboot4Application.class, args);
}
}
</code></pre></p>
<h4>3. 创建控制器</h4>
<pre><code class="language-java">package com.example.hellospringboot4.controller;
<p>import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;</p>
<p>import java.time.Instant;
import java.util.Map;</p>
<p>@RestController
public class HelloController {</p>
<pre><code>@GetMapping(&amp;quot;/&amp;quot;)
public Map&amp;lt;String, Object&amp;gt; hello() {
    return Map.of(
        &amp;quot;message&amp;quot;, &amp;quot;Hello Spring Boot 4!&amp;quot;,
        &amp;quot;timestamp&amp;quot;, Instant.now(),
        &amp;quot;javaVersion&amp;quot;, System.getProperty(&amp;quot;java.version&amp;quot;),
        &amp;quot;springBootVersion&amp;quot;, &amp;quot;4.0.0&amp;quot;
    );
}
<p>@GetMapping(&amp;quot;/thread-info&amp;quot;)
public Map&amp;lt;String, Object&amp;gt; threadInfo() {
Thread currentThread = Thread.currentThread();
return Map.of(
&amp;quot;threadName&amp;quot;, currentThread.getName(),
&amp;quot;isVirtual&amp;quot;, currentThread.isVirtual(),
&amp;quot;threadId&amp;quot;, currentThread.threadId()
);
}
</code></pre></p>
<p>}
</code></pre></p>
<h4>4. 配置文件</h4>
<pre><code class="language-yaml"># src/main/resources/application.yml
spring:
  application:
    name: hello-springboot4
  threads:
    virtual:
      enabled: true  # 启用虚拟线程
<p>server:
port: 8080</p>
<p>logging:
level:
root: INFO
com.example: DEBUG
</code></pre></p>
<h4>5. 运行应用</h4>
<pre><code class="language-bash"># Maven
./mvnw spring-boot:run
<h1>Gradle</h1>
<p>./gradlew bootRun
</code></pre></p>
<h4>6. 测试应用</h4>
<pre><code class="language-bash"># 测试基本端点
curl http://localhost:8080/
<h1>输出示例:</h1>
<h1>{</h1>
<h1>&quot;message&quot;: &quot;Hello Spring Boot 4!&quot;,</h1>
<h1>&quot;timestamp&quot;: &quot;2024-12-24T01:05:54.123456Z&quot;,</h1>
<h1>&quot;javaVersion&quot;: &quot;21.0.1&quot;,</h1>
<h1>&quot;springBootVersion&quot;: &quot;4.0.0&quot;</h1>
<h1>}</h1>
<h1>测试线程信息</h1>
<p>curl <a href="http://localhost:8080/thread-info">http://localhost:8080/thread-info</a></p>
<h1>输出示例:</h1>
<h1>{</h1>
<h1>&quot;threadName&quot;: &quot;virtual-123&quot;,</h1>
<h1>&quot;isVirtual&quot;: true,</h1>
<h1>&quot;threadId&quot;: 123</h1>
<h1>}</h1>
<p></code></pre></p>
<h3>对比：Spring Boot 3 vs Spring Boot 4</h3>
<h4>启动日志对比</h4>
<p><strong>Spring Boot 3</strong>:</p>
<pre><code>  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)
<p>2024-12-24 09:05:54.123  INFO 12345 --- [main] c.e.h.HelloSpringboot3Application : Starting...
2024-12-24 09:05:56.456  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080
2024-12-24 09:05:56.789  INFO 12345 --- [main] c.e.h.HelloSpringboot3Application : Started in 2.666 seconds
</code></pre></p>
<p><strong>Spring Boot 4</strong>:</p>
<pre><code>  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v4.0.0)
<p>2024-12-24 09:05:54.123  INFO 12345 --- [main] c.e.h.HelloSpringboot4Application : Starting...
2024-12-24 09:05:54.234  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with virtual threads
2024-12-24 09:05:54.567  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080
2024-12-24 09:05:54.678  INFO 12345 --- [main] c.e.h.HelloSpringboot4Application : Started in 0.555 seconds
</code></pre></p>
<p><strong>关键差异</strong>:</p>
<ul>
<li>✅ 启动时间更快（2.666s → 0.555s）</li>
<li>✅ 显示虚拟线程已启用</li>
<li>✅ 更少的内存占用</li>
</ul>
<h2>1.6 项目结构解析</h2>
<h3>标准项目结构</h3>
<pre><code>hello-springboot4/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/hellospringboot4/
│   │   │       ├── HelloSpringboot4Application.java  # 主应用类
│   │   │       ├── controller/                        # 控制器层
│   │   │       ├── service/                           # 服务层
│   │   │       ├── repository/                        # 数据访问层
│   │   │       ├── model/                             # 数据模型
│   │   │       └── config/                            # 配置类
│   │   └── resources/
│   │       ├── application.yml                        # 配置文件
│   │       ├── application-dev.yml                    # 开发环境配置
│   │       ├── application-prod.yml                   # 生产环境配置
│   │       ├── static/                                # 静态资源
│   │       └── templates/                             # 模板文件
│   └── test/
│       └── java/
│           └── com/example/hellospringboot4/
│               └── HelloSpringboot4ApplicationTests.java
├── pom.xml                                            # Maven 配置
└── README.md                                          # 项目说明
</code></pre>
<h3>Spring Boot 4 新增的配置选项</h3>
<pre><code class="language-yaml"># application.yml - Spring Boot 4 新特性配置
spring:
  # 虚拟线程配置
  threads:
    virtual:
      enabled: true
      name-prefix: &quot;virtual-&quot;
<h1>观察性配置</h1>
<p>observability:
enabled: true
tracing:
enabled: true
sampling:
probability: 1.0
metrics:
enabled: true</p>
<h1>AOT 优化配置</h1>
<p>aot:
enabled: true</p>
<h1>原生镜像提示</h1>
<p>native:
remove-unused-autoconfig: true
remove-yaml-support: false</p>
<h1>Actuator 端点配置</h1>
<p>management:
endpoints:
web:
exposure:
include: health,info,metrics,prometheus
metrics:
tags:
application: ${<a href="http://spring.application.name">spring.application.name</a>}
tracing:
sampling:
probability: 1.0
</code></pre></p>
<h2>1.7 小结</h2>
<p>在本章中，我们学习了：</p>
<p>✅ <strong>Spring Boot 4 的发布背景和主要目标</strong></p>
<ul>
<li>拥抱 Java 21 新特性</li>
<li>提升云原生能力</li>
<li>增强可观察性</li>
</ul>
<p>✅ <strong>核心新特性概览</strong></p>
<ul>
<li>虚拟线程支持</li>
<li>HTTP Interface 客户端</li>
<li>Problem Details 标准化错误处理</li>
<li>原生镜像改进</li>
<li>观察性增强</li>
</ul>
<p>✅ <strong>开发环境搭建</strong></p>
<ul>
<li>JDK 21 安装</li>
<li>Maven/Gradle 配置</li>
<li>IDE 设置</li>
</ul>
<p>✅ <strong>第一个 Spring Boot 4 应用</strong></p>
<ul>
<li>项目创建</li>
<li>基本配置</li>
<li>虚拟线程验证</li>
</ul>
<h3>下一步</h3>
<p>在下一章，我们将深入探讨 <strong>Spring Framework 7.0 的新特性</strong>，特别是虚拟线程的深度集成和性能优化。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4.html">← 返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html">下一章：Spring Framework 7.0 新特性 →</a></li>
</ul>
