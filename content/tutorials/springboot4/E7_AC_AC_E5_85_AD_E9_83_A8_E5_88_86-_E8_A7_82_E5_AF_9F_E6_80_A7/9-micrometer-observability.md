---
title: "第9章：Micrometer 与 Observability"
permalink: "/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html"
description: "第9章：Micrometer 与 Observability 本章概述 Spring Boot 4 大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。 本章重点: ✅ 统一的观察性 API ✅ 分布式追踪改进 ✅ 新的 Actuator 端点 ✅ 虚拟线程的监控 ✅ 与 OpenTeleme..."
---

<h1>第9章：Micrometer 与 Observability</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 统一的观察性 API</li>
<li>✅ 分布式追踪改进</li>
<li>✅ 新的 Actuator 端点</li>
<li>✅ 虚拟线程的监控</li>
<li>✅ 与 OpenTelemetry 集成</li>
</ul>
<h2>9.1 统一的观察性 API</h2>
<h3>9.1.1 Micrometer Observation API</h3>
<p>Spring Boot 4 引入了统一的 Observation API，简化了指标和追踪的实现。</p>
<h4>项目结构</h4>
<pre><code>observability-demo/
├── src/main/java/com/example/observability/
│   ├── ObservabilityApplication.java
│   ├── config/
│   │   ├── ObservabilityConfig.java
│   │   └── MetricsConfig.java
│   ├── service/
│   │   ├── OrderService.java
│   │   └── PaymentService.java
│   ├── controller/
│   │   └── OrderController.java
│   └── observation/
│       ├── CustomObservationHandler.java
│       └── BusinessMetrics.java
</code></pre>
<h4>1. 配置</h4>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  application:
    name: observability-demo
<p>threads:
virtual:
enabled: true</p>
<p>management:</p>
<h1>Actuator 端点配置</h1>
<p>endpoints:
web:
exposure:
include: '*'  # 暴露所有端点（生产环境应限制）</p>
<h1>指标配置</h1>
<p>metrics:
tags:
application: ${<a href="http://spring.application.name">spring.application.name</a>}
environment: ${ENVIRONMENT:dev}
distribution:
percentiles-histogram:
http.server.requests: true</p>
<h1>追踪配置</h1>
<p>tracing:
enabled: true
sampling:
probability: 1.0  # 100% 采样（开发环境）</p>
<h1>Prometheus 配置</h1>
<p>prometheus:
metrics:
export:
enabled: true</p>
<p>logging:
pattern:
level: '%5p [${<a href="http://spring.application.name">spring.application.name</a>:},%X{traceId:-},%X{spanId:-}]'
level:
com.example.observability: DEBUG
</code></pre></p>
<p><strong>ObservabilityConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.config;
<p>import io.micrometer.observation.ObservationRegistry;
import io.micrometer.observation.aop.ObservedAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - 观察性配置
*/
@Configuration
public class ObservabilityConfig {</p>
<p>/**</p>
<ul>
<li>启用 @Observed 注解支持
*/
@Bean
public ObservedAspect observedAspect(ObservationRegistry registry) {
return new ObservedAspect(registry);
}
}
</code></pre></li>
</ul>
</li>
</ul>
<h4>2. 使用 @Observed 注解</h4>
<p><strong>OrderService.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.service;
<p>import io.micrometer.observation.annotation.Observed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;</p>
<p>import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;</p>
<p>/**</p>
<ul>
<li>
<p>订单服务 - 使用 @Observed 自动生成指标和追踪
*/
@Service
public class OrderService {
private static final Logger log = LoggerFactory.getLogger(OrderService.class);</p>
<p>private final PaymentService paymentService;</p>
<p>public OrderService(PaymentService paymentService) {
this.paymentService = paymentService;
}</p>
<p>/**</p>
<ul>
<li>
<p>创建订单 - 自动记录指标和追踪
*/
@Observed(
name = &quot;order.create&quot;,
contextualName = &quot;create-order&quot;,
lowCardinalityKeyValues = {&quot;type&quot;, &quot;online&quot;}
)
public Order createOrder(String userId, BigDecimal amount) {
<a href="http://log.info">log.info</a>(&quot;Creating order for user: {}, amount: {}&quot;, userId, amount);</p>
<p>// 模拟订单创建
simulateWork(100);</p>
<p>Order order = new Order(
generateOrderId(),
userId,
amount,
OrderStatus.PENDING
);</p>
<p>// 调用支付服务
boolean paymentSuccess = paymentService.processPayment(<a href="http://order.id">order.id</a>(), amount);</p>
<p>if (paymentSuccess) {
order = order.withStatus(OrderStatus.PAID);
<a href="http://log.info">log.info</a>(&quot;Order created successfully: {}&quot;, <a href="http://order.id">order.id</a>());
} else {
order = order.withStatus(OrderStatus.FAILED);
log.error(&quot;Order payment failed: {}&quot;, <a href="http://order.id">order.id</a>());
}</p>
<p>return order;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>查询订单
*/
@Observed(
name = &quot;order.get&quot;,
contextualName = &quot;get-order&quot;
)
public Order getOrder(String orderId) {
log.debug(&quot;Getting order: {}&quot;, orderId);
simulateWork(50);</p>
<p>return new Order(
orderId,
&quot;user123&quot;,
new BigDecimal(&quot;99.99&quot;),
OrderStatus.PAID
);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>取消订单
*/
@Observed(
name = &quot;order.cancel&quot;,
contextualName = &quot;cancel-order&quot;,
lowCardinalityKeyValues = {&quot;reason&quot;, &quot;user-requested&quot;}
)
public void cancelOrder(String orderId) {
<a href="http://log.info">log.info</a>(&quot;Cancelling order: {}&quot;, orderId);
simulateWork(80);
}</li>
</ul>
<p>private void simulateWork(long millis) {
try {
TimeUnit.MILLISECONDS.sleep(millis);
} catch (InterruptedException e) {
Thread.currentThread().interrupt();
}
}</p>
<p>private String generateOrderId() {
return &quot;ORD-&quot; + System.currentTimeMillis();
}
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>订单记录
*/
record Order(
String id,
String userId,
BigDecimal amount,
OrderStatus status
) {
public Order withStatus(OrderStatus newStatus) {
return new Order(id, userId, amount, newStatus);
}
}</li>
</ul>
<p>enum OrderStatus {
PENDING, PAID, FAILED, CANCELLED
}
</code></pre></p>
<p><strong>PaymentService.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.service;
<p>import io.micrometer.observation.annotation.Observed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;</p>
<p>import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;</p>
<p>@Service
public class PaymentService {
private static final Logger log = LoggerFactory.getLogger(PaymentService.class);</p>
<pre><code>/**
 * 处理支付 - 自动追踪
 */
@Observed(
    name = &amp;quot;payment.process&amp;quot;,
    contextualName = &amp;quot;process-payment&amp;quot;
)
public boolean processPayment(String orderId, BigDecimal amount) {
    log.info(&amp;quot;Processing payment for order: {}, amount: {}&amp;quot;, orderId, amount);
<pre><code>try {
    // 模拟支付处理
    TimeUnit.MILLISECONDS.sleep(200);
    
    // 90% 成功率
    boolean success = Math.random() &amp;amp;gt; 0.1;
    
    if (success) {
        log.info(&amp;amp;quot;Payment successful for order: {}&amp;amp;quot;, orderId);
    } else {
        log.error(&amp;amp;quot;Payment failed for order: {}&amp;amp;quot;, orderId);
    }
    
    return success;
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    return false;
}
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h4>3. 控制器</h4>
<p><strong>OrderController.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.controller;
<p>import com.example.observability.service.Order;
import com.example.observability.service.OrderService;
import io.micrometer.observation.annotation.Observed;
import org.springframework.web.bind.annotation.*;</p>
<p>import java.math.BigDecimal;
import java.util.Map;</p>
<p>@RestController
@RequestMapping(&quot;/api/orders&quot;)
public class OrderController {
private final OrderService orderService;</p>
<pre><code>public OrderController(OrderService orderService) {
    this.orderService = orderService;
}
<p>@PostMapping
@Observed(name = &amp;quot;http.orders.create&amp;quot;)
public Order createOrder(@RequestBody CreateOrderRequest request) {
return orderService.createOrder(request.userId(), request.amount());
}</p>
<p>@GetMapping(&amp;quot;/{orderId}&amp;quot;)
@Observed(name = &amp;quot;http.orders.get&amp;quot;)
public Order getOrder(@PathVariable String orderId) {
return orderService.getOrder(orderId);
}</p>
<p>@DeleteMapping(&amp;quot;/{orderId}&amp;quot;)
@Observed(name = &amp;quot;http.orders.cancel&amp;quot;)
public Map&amp;lt;String, String&amp;gt; cancelOrder(@PathVariable String orderId) {
orderService.cancelOrder(orderId);
return Map.of(&amp;quot;message&amp;quot;, &amp;quot;Order cancelled&amp;quot;, &amp;quot;orderId&amp;quot;, orderId);
}
</code></pre></p>
<p>}</p>
<p>record CreateOrderRequest(String userId, BigDecimal amount) {}
</code></pre></p>
<h2>9.2 分布式追踪改进</h2>
<h3>9.2.1 与 OpenTelemetry 集成</h3>
<p><strong>pom.xml</strong>:</p>
<pre><code class="language-xml">&lt;dependencies&gt;
    &lt;!-- Micrometer Tracing --&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;io.micrometer&lt;/groupId&gt;
        &lt;artifactId&gt;micrometer-tracing-bridge-otel&lt;/artifactId&gt;
    &lt;/dependency&gt;
<pre><code>&amp;lt;!-- OpenTelemetry Exporter --&amp;gt;
&amp;lt;dependency&amp;gt;
    &amp;lt;groupId&amp;gt;io.opentelemetry&amp;lt;/groupId&amp;gt;
    &amp;lt;artifactId&amp;gt;opentelemetry-exporter-otlp&amp;lt;/artifactId&amp;gt;
&amp;lt;/dependency&amp;gt;
<p>&amp;lt;!-- Zipkin (可选) --&amp;gt;
&amp;lt;dependency&amp;gt;
&amp;lt;groupId&amp;gt;io.zipkin.reporter2&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;zipkin-reporter-brave&amp;lt;/artifactId&amp;gt;
&amp;lt;/dependency&amp;gt;
</code></pre></p>
<p>&lt;/dependencies&gt;
</code></pre></p>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">management:
  tracing:
    enabled: true
    sampling:
      probability: 1.0
<h1>Zipkin 配置</h1>
<p>zipkin:
tracing:
endpoint: <a href="http://localhost:9411/api/v2/spans">http://localhost:9411/api/v2/spans</a></p>
<h1>OpenTelemetry 配置</h1>
<p>otlp:
tracing:
endpoint: <a href="http://localhost:4318/v1/traces">http://localhost:4318/v1/traces</a>
</code></pre></p>
<h3>9.2.2 自定义追踪</h3>
<p><strong>CustomObservationHandler.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.observation;
<p>import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;</p>
<p>/**</p>
<ul>
<li>
<p>自定义观察处理器
*/
@Component
public class CustomObservationHandler implements ObservationHandler&lt;Observation.Context&gt; {
private static final Logger log = LoggerFactory.getLogger(CustomObservationHandler.class);</p>
<p>@Override
public void onStart(Observation.Context context) {
log.debug(&quot;Observation started: {}&quot;, context.getName());
}</p>
<p>@Override
public void onStop(Observation.Context context) {
log.debug(&quot;Observation stopped: {}, duration: {}ms&quot;,
context.getName(),
System.currentTimeMillis() - context.get(&quot;startTime&quot;));
}</p>
<p>@Override
public void onError(Observation.Context context) {
log.error(&quot;Observation error: {}&quot;, context.getName(), context.getError());
}</p>
<p>@Override
public boolean supportsContext(Observation.Context context) {
return true;
}
}
</code></pre></p>
</li>
</ul>
<h2>9.3 新的 Actuator 端点</h2>
<h3>9.3.1 常用端点</h3>
<p>Spring Boot 4 增强了 Actuator 端点：</p>
<table>
<thead>
<tr>
<th>端点</th>
<th>说明</th>
<th>新特性</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>/actuator/health</code></td>
<td>健康检查</td>
<td>虚拟线程状态</td>
</tr>
<tr>
<td><code>/actuator/metrics</code></td>
<td>指标</td>
<td>更多虚拟线程指标</td>
</tr>
<tr>
<td><code>/actuator/prometheus</code></td>
<td>Prometheus</td>
<td>改进的格式</td>
</tr>
<tr>
<td><code>/actuator/traces</code></td>
<td>追踪信息</td>
<td>OpenTelemetry 集成</td>
</tr>
<tr>
<td><code>/actuator/threaddump</code></td>
<td>线程转储</td>
<td>虚拟线程支持</td>
</tr>
</tbody>
</table>
<h3>9.3.2 自定义健康检查</h3>
<p><strong>CustomHealthIndicator.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.health;
<p>import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;</p>
<p>@Component
public class CustomHealthIndicator implements HealthIndicator {</p>
<pre><code>@Override
public Health health() {
    // 检查虚拟线程状态
    Thread currentThread = Thread.currentThread();
    boolean isVirtual = currentThread.isVirtual();
<pre><code>// 检查系统资源
Runtime runtime = Runtime.getRuntime();
long freeMemory = runtime.freeMemory();
long totalMemory = runtime.totalMemory();
double memoryUsage = (double) (totalMemory - freeMemory) / totalMemory;

if (memoryUsage &amp;amp;gt; 0.9) {
    return Health.down()
        .withDetail(&amp;amp;quot;reason&amp;amp;quot;, &amp;amp;quot;High memory usage&amp;amp;quot;)
        .withDetail(&amp;amp;quot;memoryUsage&amp;amp;quot;, String.format(&amp;amp;quot;%.2f%%&amp;amp;quot;, memoryUsage * 100))
        .build();
}

return Health.up()
    .withDetail(&amp;amp;quot;virtualThreads&amp;amp;quot;, isVirtual)
    .withDetail(&amp;amp;quot;memoryUsage&amp;amp;quot;, String.format(&amp;amp;quot;%.2f%%&amp;amp;quot;, memoryUsage * 100))
    .withDetail(&amp;amp;quot;availableProcessors&amp;amp;quot;, runtime.availableProcessors())
    .build();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>9.4 虚拟线程的监控</h2>
<h3>9.4.1 虚拟线程指标</h3>
<p><strong>VirtualThreadMetrics.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.metrics;
<p>import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;
import org.springframework.stereotype.Component;</p>
<p>import jakarta.annotation.PostConstruct;</p>
<p>@Component
public class VirtualThreadMetrics {
private final MeterRegistry registry;</p>
<pre><code>public VirtualThreadMetrics(MeterRegistry registry) {
    this.registry = registry;
}
<p>@PostConstruct
public void init() {
// 注册虚拟线程指标
registry.gauge(&amp;quot;jvm.threads.virtual&amp;quot;, Tags.empty(), this,
VirtualThreadMetrics::getVirtualThreadCount);</p>
<pre><code>registry.gauge(&amp;amp;quot;jvm.threads.platform&amp;amp;quot;, Tags.empty(), this,
    VirtualThreadMetrics::getPlatformThreadCount);
</code></pre>
<p>}</p>
<p>private double getVirtualThreadCount() {
return Thread.getAllStackTraces().keySet().stream()
.filter(Thread::isVirtual)
.count();
}</p>
<p>private double getPlatformThreadCount() {
return Thread.getAllStackTraces().keySet().stream()
.filter(t -&amp;gt; !t.isVirtual())
.count();
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>9.5 业务指标</h2>
<h3>9.5.1 自定义业务指标</h3>
<p><strong>BusinessMetrics.java</strong>:</p>
<pre><code class="language-java">package com.example.observability.observation;
<p>import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;</p>
<p>import java.time.Duration;
import java.util.concurrent.TimeUnit;</p>
<p>/**</p>
<ul>
<li>
<p>业务指标
*/
@Component
public class BusinessMetrics {
private final Counter orderCreatedCounter;
private final Counter orderFailedCounter;
private final Timer orderProcessingTimer;</p>
<p>public BusinessMetrics(MeterRegistry registry) {
this.orderCreatedCounter = Counter.builder(&quot;orders.created&quot;)
.description(&quot;Total orders created&quot;)
.tag(&quot;type&quot;, &quot;business&quot;)
.register(registry);</p>
<pre><code> this.orderFailedCounter = Counter.builder(&amp;quot;orders.failed&amp;quot;)
     .description(&amp;quot;Total orders failed&amp;quot;)
     .tag(&amp;quot;type&amp;quot;, &amp;quot;business&amp;quot;)
     .register(registry);
<p>this.orderProcessingTimer = Timer.builder(&amp;quot;orders.processing.time&amp;quot;)
.description(&amp;quot;Order processing time&amp;quot;)
.tag(&amp;quot;type&amp;quot;, &amp;quot;business&amp;quot;)
.register(registry);
</code></pre></p>
<p>}</p>
<p>public void recordOrderCreated() {
orderCreatedCounter.increment();
}</p>
<p>public void recordOrderFailed() {
orderFailedCounter.increment();
}</p>
<p>public void recordProcessingTime(long millis) {
orderProcessingTimer.record(millis, TimeUnit.MILLISECONDS);
}</p>
<p>public &lt;T&gt; T recordProcessing(java.util.function.Supplier&lt;T&gt; supplier) {
return orderProcessingTimer.record(supplier);
}
}
</code></pre></p>
</li>
</ul>
<h2>9.6 Prometheus 集成</h2>
<h3>9.6.1 配置 Prometheus</h3>
<p><strong>prometheus.yml</strong>:</p>
<pre><code class="language-yaml">global:
  scrape_interval: 15s
<p>scrape_configs:</p>
<ul>
<li>job_name: 'spring-boot-app'
metrics_path: '/actuator/prometheus'
static_configs:
<ul>
<li>targets: ['localhost:8080']
</code></pre></li>
</ul>
</li>
</ul>
<h3>9.6.2 Grafana 仪表板</h3>
<p>常用的 Grafana 查询：</p>
<pre><code class="language-promql"># HTTP 请求率
rate(http_server_requests_seconds_count[1m])
<h1>HTTP 请求延迟 P95</h1>
<p>histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[1m]))</p>
<h1>虚拟线程数量</h1>
<p>jvm_threads_virtual</p>
<h1>订单创建率</h1>
<p>rate(orders_created_total[1m])</p>
<h1>内存使用率</h1>
<p>jvm_memory_used_bytes / jvm_memory_max_bytes
</code></pre></p>
<h2>9.7 Spring Boot 3 vs Spring Boot 4 对比</h2>
<table>
<thead>
<tr>
<th>特性</th>
<th>Spring Boot 3</th>
<th>Spring Boot 4</th>
</tr>
</thead>
<tbody>
<tr>
<td>Observation API</td>
<td>基础支持</td>
<td>完全集成</td>
</tr>
<tr>
<td>OpenTelemetry</td>
<td>需要额外配置</td>
<td>原生支持</td>
</tr>
<tr>
<td>虚拟线程监控</td>
<td>❌ 无</td>
<td>✅ 完整支持</td>
</tr>
<tr>
<td>@Observed 注解</td>
<td>基础功能</td>
<td>增强功能</td>
</tr>
<tr>
<td>Actuator 端点</td>
<td>标准端点</td>
<td>新增虚拟线程端点</td>
</tr>
</tbody>
</table>
<h2>9.8 小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>统一的观察性 API</strong></p>
<ul>
<li>@Observed 注解</li>
<li>自动指标和追踪</li>
</ul>
<p>✅ <strong>分布式追踪</strong></p>
<ul>
<li>OpenTelemetry 集成</li>
<li>Zipkin 支持</li>
</ul>
<p>✅ <strong>Actuator 端点</strong></p>
<ul>
<li>新的健康检查</li>
<li>虚拟线程监控</li>
</ul>
<p>✅ <strong>业务指标</strong></p>
<ul>
<li>自定义指标</li>
<li>Prometheus 集成</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>Spring for Apache Kafka 升级</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html">← 上一章：Spring Security 7.0 新特性</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html">下一章：Spring for Apache Kafka 升级 →</a></li>
</ul>
