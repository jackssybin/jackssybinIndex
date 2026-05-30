---
title: "第13章：Docker 与 Kubernetes 集成"
permalink: "/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html"
description: "第13章：Docker 与 Kubernetes 集成 本章概述 Spring Boot 4 改进了容器化支持，提供更好的 Docker 和 Kubernetes 集成。 本章重点: ✅ 容器镜像构建改进 ✅ Kubernetes 原生支持 ✅ 健康检查与就绪探针 ✅ ConfigMap 和 Secret 集成 13.1 Docker 镜像构建 13.1.1..."
---

<h1>第13章：Docker 与 Kubernetes 集成</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 改进了容器化支持，提供更好的 Docker 和 Kubernetes 集成。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 容器镜像构建改进</li>
<li>✅ Kubernetes 原生支持</li>
<li>✅ 健康检查与就绪探针</li>
<li>✅ ConfigMap 和 Secret 集成</li>
</ul>
<h2>13.1 Docker 镜像构建</h2>
<h3>13.1.1 使用 Buildpacks</h3>
<p><strong>Maven 插件</strong>:</p>
<pre><code class="language-xml">&lt;plugin&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;
    &lt;configuration&gt;
        &lt;image&gt;
            &lt;name&gt;myapp:${project.version}&lt;/name&gt;
            &lt;builder&gt;paketobuildpacks/builder:base&lt;/builder&gt;
        &lt;/image&gt;
    &lt;/configuration&gt;
&lt;/plugin&gt;
</code></pre>
<p><strong>构建命令</strong>:</p>
<pre><code class="language-bash"># 构建 Docker 镜像
./mvnw spring-boot:build-image
<h1>运行容器</h1>
<p>docker run -p 8080:8080 myapp:1.0.0
</code></pre></p>
<h3>13.1.2 多阶段构建</h3>
<p><strong>Dockerfile</strong>:</p>
<pre><code class="language-dockerfile"># Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
<h1>Stage 2: Runtime</h1>
<p>FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar</p>
<h1>使用虚拟线程</h1>
<p>ENV JAVA_OPTS=&quot;-XX:+UseVirtualThreads&quot;</p>
<p>EXPOSE 8080
ENTRYPOINT [&quot;java&quot;, &quot;-jar&quot;, &quot;app.jar&quot;]
</code></pre></p>
<p><strong>镜像大小对比</strong>:</p>
<table>
<thead>
<tr>
<th>方式</th>
<th>镜像大小</th>
<th>启动时间</th>
</tr>
</thead>
<tbody>
<tr>
<td>传统 JRE</td>
<td>250MB</td>
<td>2.5s</td>
</tr>
<tr>
<td>JRE + 优化</td>
<td>180MB</td>
<td>1.2s</td>
</tr>
<tr>
<td>Native Image</td>
<td>60MB</td>
<td>0.05s</td>
</tr>
</tbody>
</table>
<h2>13.2 Kubernetes 集成</h2>
<h3>13.2.1 Deployment 配置</h3>
<p><strong>deployment.yaml</strong>:</p>
<pre><code class="language-yaml">apiVersion: apps/v1
kind: Deployment
metadata:
  name: springboot4-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: springboot4-app
  template:
    metadata:
      labels:
        app: springboot4-app
    spec:
      containers:
      - name: app
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
<pre><code>    # 环境变量
    env:
    - name: SPRING_PROFILES_ACTIVE
      value: &amp;quot;production&amp;quot;
    - name: JAVA_OPTS
      value: &amp;quot;-XX:+UseVirtualThreads -Xmx512m&amp;quot;
<pre><code># 资源限制
resources:
  requests:
    memory: &amp;amp;quot;256Mi&amp;amp;quot;
    cpu: &amp;amp;quot;250m&amp;amp;quot;
  limits:
    memory: &amp;amp;quot;512Mi&amp;amp;quot;
    cpu: &amp;amp;quot;500m&amp;amp;quot;

# 健康检查
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

# 就绪探针
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 20
  periodSeconds: 5

# 启动探针
startupProbe:
  httpGet:
    path: /actuator/health/startup
    port: 8080
  failureThreshold: 30
  periodSeconds: 2
</code></pre>
<p></code></pre></p>
<p></code></pre></p>
<h3>13.2.2 Service 配置</h3>
<p><strong>service.yaml</strong>:</p>
<pre><code class="language-yaml">apiVersion: v1
kind: Service
metadata:
  name: springboot4-service
spec:
  selector:
    app: springboot4-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
</code></pre>
<h3>13.2.3 ConfigMap 集成</h3>
<p><strong>configmap.yaml</strong>:</p>
<pre><code class="language-yaml">apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    spring:
      application:
        name: springboot4-app
      threads:
        virtual:
          enabled: true
      datasource:
        url: jdbc:mysql://mysql-service:3306/mydb
</code></pre>
<p><strong>使用 ConfigMap</strong>:</p>
<pre><code class="language-yaml"># 在 Deployment 中挂载
volumes:
- name: config
  configMap:
    name: app-config
volumeMounts:
- name: config
  mountPath: /config
  readOnly: true
</code></pre>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  config:
    import: &quot;optional:configtree:/config/&quot;
</code></pre>
<h2>13.3 健康检查</h2>
<h3>13.3.1 Kubernetes 探针配置</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">management:
  endpoint:
    health:
      probes:
        enabled: true
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState,db
<p>health:
livenessState:
enabled: true
readinessState:
enabled: true
</code></pre></p>
<h3>13.3.2 自定义健康检查</h3>
<p><strong>CustomHealthIndicator.java</strong>:</p>
<pre><code class="language-java">@Component
public class K8sHealthIndicator implements HealthIndicator {
<pre><code>@Override
public Health health() {
    // 检查应用状态
    boolean healthy = checkApplicationHealth();
<pre><code>if (healthy) {
    return Health.up()
        .withDetail(&amp;amp;quot;kubernetes&amp;amp;quot;, &amp;amp;quot;ready&amp;amp;quot;)
        .withDetail(&amp;amp;quot;virtualThreads&amp;amp;quot;, Thread.currentThread().isVirtual())
        .build();
}

return Health.down()
    .withDetail(&amp;amp;quot;reason&amp;amp;quot;, &amp;amp;quot;Application not ready&amp;amp;quot;)
    .build();
</code></pre>
<p>}</p>
<p>private boolean checkApplicationHealth() {
// 健康检查逻辑
return true;
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>13.4 Helm Chart</h2>
<h3>13.4.1 Chart 结构</h3>
<pre><code>springboot4-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── configmap.yaml
    └── ingress.yaml
</code></pre>
<p><strong>values.yaml</strong>:</p>
<pre><code class="language-yaml">replicaCount: 3
<p>image:
repository: myapp
tag: &quot;1.0.0&quot;
pullPolicy: IfNotPresent</p>
<p>service:
type: LoadBalancer
port: 80</p>
<p>resources:
limits:
cpu: 500m
memory: 512Mi
requests:
cpu: 250m
memory: 256Mi</p>
<p>autoscaling:
enabled: true
minReplicas: 2
maxReplicas: 10
targetCPUUtilizationPercentage: 80
</code></pre></p>
<h2>13.5 最佳实践</h2>
<h3>13.5.1 优化建议</h3>
<ol>
<li><strong>使用虚拟线程</strong>: 减少资源占用</li>
<li><strong>合理设置资源限制</strong>: 避免 OOM</li>
<li><strong>配置健康检查</strong>: 确保高可用</li>
<li><strong>使用 ConfigMap</strong>: 外部化配置</li>
<li><strong>启用 HPA</strong>: 自动扩缩容</li>
</ol>
<h3>13.5.2 监控集成</h3>
<p><strong>prometheus-config.yaml</strong>:</p>
<pre><code class="language-yaml">apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    scrape_configs:
    - job_name: 'springboot4-app'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: springboot4-app
      - source_labels: [__meta_kubernetes_pod_ip]
        target_label: __address__
        replacement: $1:8080
      metrics_path: /actuator/prometheus
</code></pre>
<h2>13.6 小结</h2>
<p>✅ <strong>Docker 集成</strong></p>
<ul>
<li>Buildpacks 简化构建</li>
<li>多阶段构建优化镜像</li>
</ul>
<p>✅ <strong>Kubernetes 支持</strong></p>
<ul>
<li>原生健康检查</li>
<li>ConfigMap 集成</li>
<li>Helm Chart 部署</li>
</ul>
<p>✅ <strong>最佳实践</strong></p>
<ul>
<li>资源优化</li>
<li>监控集成</li>
<li>自动扩缩容</li>
</ul>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">← 上一章</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="../%E7%AC%AC%E4%B9%9D%E9%83%A8%E5%88%86-%E6%B5%8B%E8%AF%95/%E7%AC%AC14%E7%AB%A0-%E6%B5%8B%E8%AF%95%E6%94%AF%E6%8C%81%E6%94%B9%E8%BF%9B.md">下一章 →</a></li>
</ul>
