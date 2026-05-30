---
title: "第12章：GraalVM Native Image 增强"
permalink: "/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html"
description: "第12章：GraalVM Native Image 增强 本章概述 Spring Boot 4 大幅改进了 GraalVM 原生镜像支持，提供更快的启动时间和更小的内存占用。 本章重点: ✅ 原生镜像支持改进 ✅ 启动时间与内存优化 ✅ AOT (AheadofTime) 编译 ✅ 构建配置简化 12.1 原生镜像构建 12.1.1 Maven 配置 pom..."
---

<h1>第12章：GraalVM Native Image 增强</h1>
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
</ul>
