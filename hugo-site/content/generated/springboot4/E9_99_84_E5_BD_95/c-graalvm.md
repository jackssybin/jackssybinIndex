---
title: 附录C：GraalVM Native Image 指南 - Spring Boot 4教程
description: "附录C：GraalVM Native Image 指南 概述 本附录提供 GraalVM Native Image
  的完整使用指南，帮助您构建高性能的原生应用。 C.1 环境准备 C.1.1 安装 GraalVM 使用 SDKMAN (推荐) : 安装 GraalVM
  sdk install java 21graal 设置为默认 sdk use java 2..."
url: /springboot4/E9_99_84_E5_BD_95/c-graalvm.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;附录C：GraalVM Native Image 指南</h2></div>
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
<a class="current" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 附录</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>附录C：GraalVM Native Image 指南</h1>
<h2>概述</h2>
<p>本附录提供 GraalVM Native Image 的完整使用指南，帮助您构建高性能的原生应用。</p>
<h2>C.1 环境准备</h2>
<h3>C.1.1 安装 GraalVM</h3>
<p><strong>使用 SDKMAN (推荐)</strong>:</p>
<pre><code class="language-bash"># 安装 GraalVM
sdk install java 21-graal
<h1>设置为默认</h1>
<p>sdk use java 21-graal</p>
<h1>验证安装</h1>
<p>java -version</p>
<h1>输出应包含 &quot;GraalVM&quot;</h1>
<p></code></pre></p>
<p><strong>手动安装</strong>:</p>
<pre><code class="language-bash"># 下载 GraalVM
# https://www.graalvm.org/downloads/
<h1>设置环境变量</h1>
<p>export GRAALVM_HOME=/path/to/graalvm
export PATH=$GRAALVM_HOME/bin:$PATH
</code></pre></p>
<h3>C.1.2 安装 Native Image</h3>
<pre><code class="language-bash"># 安装 native-image 工具
gu install native-image
<h1>验证安装</h1>
<p>native-image --version
</code></pre></p>
<h2>C.2 项目配置</h2>
<h3>C.2.1 Maven 配置</h3>
<p><strong>pom.xml</strong>:</p>
<pre><code class="language-xml">&lt;project&gt;
    &lt;properties&gt;
        &lt;java.version&gt;21&lt;/java.version&gt;
        &lt;native.maven.plugin.version&gt;0.10.0&lt;/native.maven.plugin.version&gt;
    &lt;/properties&gt;
<pre><code>&amp;lt;dependencies&amp;gt;
    &amp;lt;dependency&amp;gt;
        &amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;
        &amp;lt;artifactId&amp;gt;spring-boot-starter-web&amp;lt;/artifactId&amp;gt;
    &amp;lt;/dependency&amp;gt;
&amp;lt;/dependencies&amp;gt;
<p>&amp;lt;build&amp;gt;
&amp;lt;plugins&amp;gt;
&amp;lt;plugin&amp;gt;
&amp;lt;groupId&amp;gt;org.graalvm.buildtools&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;native-maven-plugin&amp;lt;/artifactId&amp;gt;
&amp;lt;version&amp;gt;${native.maven.plugin.version}&amp;lt;/version&amp;gt;
&amp;lt;configuration&amp;gt;
&amp;lt;imageName&amp;gt;${project.artifactId}&amp;lt;/imageName&amp;gt;
&amp;lt;mainClass&amp;gt;com.example.Application&amp;lt;/mainClass&amp;gt;
&amp;lt;buildArgs&amp;gt;
&amp;lt;buildArg&amp;gt;--no-fallback&amp;lt;/buildArg&amp;gt;
&amp;lt;buildArg&amp;gt;-H:+ReportExceptionStackTraces&amp;lt;/buildArg&amp;gt;
&amp;lt;buildArg&amp;gt;--initialize-at-build-time=org.slf4j&amp;lt;/buildArg&amp;gt;
&amp;lt;/buildArgs&amp;gt;
&amp;lt;/configuration&amp;gt;
&amp;lt;/plugin&amp;gt;
&amp;lt;/plugins&amp;gt;
&amp;lt;/build&amp;gt;</p>
<p>&amp;lt;profiles&amp;gt;
&amp;lt;profile&amp;gt;
&amp;lt;id&amp;gt;native&amp;lt;/id&amp;gt;
&amp;lt;build&amp;gt;
&amp;lt;plugins&amp;gt;
&amp;lt;plugin&amp;gt;
&amp;lt;groupId&amp;gt;org.springframework.boot&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;spring-boot-maven-plugin&amp;lt;/artifactId&amp;gt;
&amp;lt;configuration&amp;gt;
&amp;lt;image&amp;gt;
&amp;lt;builder&amp;gt;paketobuildpacks/builder:tiny&amp;lt;/builder&amp;gt;
&amp;lt;env&amp;gt;
&amp;lt;BP_NATIVE_IMAGE&amp;gt;true&amp;lt;/BP_NATIVE_IMAGE&amp;gt;
&amp;lt;/env&amp;gt;
&amp;lt;/image&amp;gt;
&amp;lt;/configuration&amp;gt;
&amp;lt;/plugin&amp;gt;
&amp;lt;/plugins&amp;gt;
&amp;lt;/build&amp;gt;
&amp;lt;/profile&amp;gt;
&amp;lt;/profiles&amp;gt;
</code></pre></p>
<p>&lt;/project&gt;
</code></pre></p>
<h3>C.2.2 Gradle 配置</h3>
<p><strong>build.gradle</strong>:</p>
<pre><code class="language-gradle">plugins {
    id 'org.springframework.boot' version '4.0.0'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'org.graalvm.buildtools.native' version '0.10.0'
    id 'java'
}
<p>graalvmNative {
binaries {
main {
imageName = <a href="http://project.name">project.name</a>
mainClass = 'com.example.Application'
buildArgs.add('--no-fallback')
buildArgs.add('-H:+ReportExceptionStackTraces')
}
}
}
</code></pre></p>
<h2>C.3 构建 Native Image</h2>
<h3>C.3.1 本地构建</h3>
<p><strong>Maven</strong>:</p>
<pre><code class="language-bash"># 构建 Native Image
./mvnw -Pnative native:compile
<h1>运行</h1>
<p>./target/myapp
</code></pre></p>
<p><strong>Gradle</strong>:</p>
<pre><code class="language-bash"># 构建 Native Image
./gradlew nativeCompile
<h1>运行</h1>
<p>./build/native/nativeCompile/myapp
</code></pre></p>
<h3>C.3.2 Docker 构建</h3>
<p><strong>Dockerfile</strong>:</p>
<pre><code class="language-dockerfile"># Stage 1: Build
FROM ghcr.io/graalvm/native-image:21 AS builder
<p>WORKDIR /app
COPY . .</p>
<p>RUN ./mvnw -Pnative native:compile</p>
<h1>Stage 2: Runtime</h1>
<p>FROM <a href="http://gcr.io/distroless/base">gcr.io/distroless/base</a></p>
<p>COPY --from=builder /app/target/myapp /app
EXPOSE 8080</p>
<p>ENTRYPOINT [&quot;/app&quot;]
</code></pre></p>
<p><strong>构建和运行</strong>:</p>
<pre><code class="language-bash"># 构建镜像
docker build -t myapp:native .
<h1>运行容器</h1>
<p>docker run -p 8080:8080 myapp:native
</code></pre></p>
<h2>C.4 配置提示</h2>
<h3>C.4.1 反射配置</h3>
<p><strong>reflect-config.json</strong>:</p>
<pre><code class="language-json">[
  {
    &quot;name&quot;: &quot;com.example.MyClass&quot;,
    &quot;allDeclaredConstructors&quot;: true,
    &quot;allDeclaredMethods&quot;: true,
    &quot;allDeclaredFields&quot;: true
  }
]
</code></pre>
<p><strong>在代码中注册</strong>:</p>
<pre><code class="language-java">@Configuration
public class NativeHints implements RuntimeHintsRegistrar {
<pre><code>@Override
public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
    // 反射提示
    hints.reflection()
        .registerType(MyClass.class, 
            MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
            MemberCategory.INVOKE_DECLARED_METHODS,
            MemberCategory.DECLARED_FIELDS);
<pre><code>// 资源提示
hints.resources()
    .registerPattern(&amp;amp;quot;config/*.properties&amp;amp;quot;)
    .registerPattern(&amp;amp;quot;templates/*.html&amp;amp;quot;);
<p>// 代理提示
hints.proxies()
.registerJdkProxy(MyInterface.class);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>C.4.2 资源配置</h3>
<p><strong>resource-config.json</strong>:</p>
<pre><code class="language-json">{
  &quot;resources&quot;: {
    &quot;includes&quot;: [
      {&quot;pattern&quot;: &quot;application.yml&quot;},
      {&quot;pattern&quot;: &quot;application-*.yml&quot;},
      {&quot;pattern&quot;: &quot;static/.*&quot;},
      {&quot;pattern&quot;: &quot;templates/.*&quot;}
    ]
  }
}
</code></pre>
<h3>C.4.3 序列化配置</h3>
<p><strong>serialization-config.json</strong>:</p>
<pre><code class="language-json">[
  {
    &quot;name&quot;: &quot;com.example.dto.UserDTO&quot;
  },
  {
    &quot;name&quot;: &quot;com.example.dto.ProductDTO&quot;
  }
]
</code></pre>
<h2>C.5 性能优化</h2>
<h3>C.5.1 构建优化</h3>
<p><strong>优化构建参数</strong>:</p>
<pre><code class="language-xml">&lt;buildArgs&gt;
    &lt;!-- 基础优化 --&gt;
    &lt;buildArg&gt;--no-fallback&lt;/buildArg&gt;
    &lt;buildArg&gt;-H:+ReportExceptionStackTraces&lt;/buildArg&gt;
<pre><code>&amp;lt;!-- 性能优化 --&amp;gt;
&amp;lt;buildArg&amp;gt;-O3&amp;lt;/buildArg&amp;gt;
&amp;lt;buildArg&amp;gt;-march=native&amp;lt;/buildArg&amp;gt;
<p>&amp;lt;!-- 内存优化 --&amp;gt;
&amp;lt;buildArg&amp;gt;-H:+RemoveUnusedSymbols&amp;lt;/buildArg&amp;gt;
&amp;lt;buildArg&amp;gt;-H:+DeleteLocalSymbols&amp;lt;/buildArg&amp;gt;</p>
<p>&amp;lt;!-- 启动优化 --&amp;gt;
&amp;lt;buildArg&amp;gt;--initialize-at-build-time&amp;lt;/buildArg&amp;gt;</p>
<p>&amp;lt;!-- 大小优化 --&amp;gt;
&amp;lt;buildArg&amp;gt;-H:+StripDebugInfo&amp;lt;/buildArg&amp;gt;
</code></pre></p>
<p>&lt;/buildArgs&gt;
</code></pre></p>
<h3>C.5.2 运行时优化</h3>
<p><strong>JVM 参数</strong>:</p>
<pre><code class="language-bash"># 内存限制
-Xmx128m
<h1>GC 配置</h1>
<p>-XX:+UseSerialGC
-XX:MaxGCPauseMillis=1</p>
<h1>其他优化</h1>
<p>-XX:+UnlockExperimentalVMOptions
-XX:+UseJVMCICompiler
</code></pre></p>
<h2>C.6 性能对比</h2>
<h3>C.6.1 启动时间</h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>启动时间</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td>JVM</td>
<td>2.8s</td>
<td>-</td>
</tr>
<tr>
<td>JVM + AOT</td>
<td>1.5s</td>
<td>46%</td>
</tr>
<tr>
<td><strong>Native Image</strong></td>
<td><strong>0.05s</strong></td>
<td><strong>98%</strong></td>
</tr>
</tbody>
</table>
<h3>C.6.2 内存占用</h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>堆内存</th>
<th>总内存</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td>JVM</td>
<td>180MB</td>
<td>256MB</td>
<td>-</td>
</tr>
<tr>
<td><strong>Native Image</strong></td>
<td><strong>30MB</strong></td>
<td><strong>45MB</strong></td>
<td><strong>82%</strong></td>
</tr>
</tbody>
</table>
<h3>C.6.3 包大小</h3>
<table>
<thead>
<tr>
<th>模式</th>
<th>大小</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td>JAR</td>
<td>50MB</td>
<td>-</td>
</tr>
<tr>
<td>JAR + 依赖</td>
<td>80MB</td>
<td>-</td>
</tr>
<tr>
<td><strong>Native Image</strong></td>
<td><strong>60MB</strong></td>
<td><strong>25%</strong></td>
</tr>
</tbody>
</table>
<h2>C.7 常见问题</h2>
<h3>C.7.1 ClassNotFoundException</h3>
<p><strong>问题</strong>: 运行时找不到类</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-java">@RegisterReflectionForBinding({MyClass.class, AnotherClass.class})
public class MyConfiguration {
}
</code></pre>
<h3>C.7.2 资源文件找不到</h3>
<p><strong>问题</strong>: 无法加载资源文件</p>
<p><strong>解决方案</strong>:</p>
<pre><code class="language-java">@ImportRuntimeHints(MyRuntimeHints.class)
public class Application {
}
<p>class MyRuntimeHints implements RuntimeHintsRegistrar {
@Override
public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
hints.resources().registerPattern(&quot;data/*.json&quot;);
}
}
</code></pre></p>
<h3>C.7.3 构建失败</h3>
<p><strong>问题</strong>: Native Image 构建失败</p>
<p><strong>诊断</strong>:</p>
<pre><code class="language-bash"># 启用详细日志
./mvnw -Pnative native:compile -Dverbose=true
<h1>生成构建报告</h1>
<p>-H:+PrintAnalysisCallTree
</code></pre></p>
<h2>C.8 最佳实践</h2>
<h3>C.8.1 开发建议</h3>
<ol>
<li><strong>早期测试</strong>: 尽早测试 Native Image 构建</li>
<li><strong>增量迁移</strong>: 逐步迁移到 Native Image</li>
<li><strong>配置管理</strong>: 集中管理配置提示</li>
<li><strong>持续集成</strong>: 在 CI/CD 中集成 Native Image 构建</li>
</ol>
<h3>C.8.2 生产部署</h3>
<p><strong>Kubernetes Deployment</strong>:</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-native
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: myapp:native
        resources:
          requests:
            memory: &quot;64Mi&quot;
            cpu: &quot;100m&quot;
          limits:
            memory: &quot;128Mi&quot;
            cpu: &quot;200m&quot;
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 5  # 快速启动
          periodSeconds: 10
</code></pre>
<h3>C.8.3 监控</h3>
<p><strong>Prometheus 指标</strong>:</p>
<pre><code class="language-yaml">management:
  endpoints:
    web:
      exposure:
        include: prometheus,health,metrics
  metrics:
    tags:
      application: ${spring.application.name}
      mode: native
</code></pre>
<h2>C.9 小结</h2>
<p>✅ <strong>核心优势</strong></p>
<ul>
<li>启动时间: 0.05s (98% 提升)</li>
<li>内存占用: 45MB (82% 降低)</li>
<li>包大小: 60MB (25% 减少)</li>
</ul>
<p>✅ <strong>适用场景</strong></p>
<ul>
<li>云原生应用</li>
<li>Serverless 函数</li>
<li>容器化部署</li>
<li>资源受限环境</li>
</ul>
<p>✅ <strong>注意事项</strong></p>
<ul>
<li>需要配置提示</li>
<li>构建时间较长</li>
<li>某些库可能不兼容</li>
</ul>
<hr>
<p><strong>相关章节</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">第12章：GraalVM Native Image 增强</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html">第15章：性能提升详解</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E9_99_84_E5_BD_95/b.html" class="fn-left">上一篇：附录B：虚拟线程最佳实践</a>
            <a href="/springboot4/E9_99_84_E5_BD_95/d.html" class="fn-right">下一篇：附录D：迁移检查清单</a>
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
