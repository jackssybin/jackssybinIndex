---
title: "附录C：GraalVM Native Image 指南"
permalink: "/springboot4/E9_99_84_E5_BD_95/c-graalvm.html"
description: "附录C：GraalVM Native Image 指南 概述 本附录提供 GraalVM Native Image 的完整使用指南，帮助您构建高性能的原生应用。 C.1 环境准备 C.1.1 安装 GraalVM 使用 SDKMAN (推荐): 手动安装: C.1.2 安装 Native Image C.2 项目配置 C.2.1 Maven 配置 pom.x..."
---

<h1>附录C：GraalVM Native Image 指南</h1>
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

// 代理提示
hints.proxies()
    .registerJdkProxy(MyInterface.class);
</code></pre>
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
</ul>
