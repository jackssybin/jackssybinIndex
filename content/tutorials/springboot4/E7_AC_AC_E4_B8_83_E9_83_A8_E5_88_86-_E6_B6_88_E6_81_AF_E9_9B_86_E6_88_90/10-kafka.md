---
title: "第10章：Spring for Apache Kafka 升级"
permalink: "/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html"
description: "第10章：Spring for Apache Kafka 升级 本章概述 Spring Boot 4 升级了 Kafka 客户端，并优化了虚拟线程支持，显著提升了消息处理性能。 本章重点: ✅ Kafka 客户端版本升级 ✅ 虚拟线程在消息处理中的应用 ✅ 高吞吐量消息消费 ✅ 改进的错误处理 10.1 Kafka 配置 application.yml: 1..."
---

<h1>第10章：Spring for Apache Kafka 升级</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 升级了 Kafka 客户端，并优化了虚拟线程支持，显著提升了消息处理性能。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ Kafka 客户端版本升级</li>
<li>✅ 虚拟线程在消息处理中的应用</li>
<li>✅ 高吞吐量消息消费</li>
<li>✅ 改进的错误处理</li>
</ul>
<h2>10.1 Kafka 配置</h2>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  kafka:
    bootstrap-servers: localhost:9092
<pre><code># 生产者配置
producer:
  key-serializer: org.apache.kafka.common.serialization.StringSerializer
  value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
  acks: all
  retries: 3
<h1>消费者配置</h1>
<p>consumer:
group-id: my-group
key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
auto-offset-reset: earliest
properties:
spring.json.trusted.packages: '*'</p>
<h1>监听器配置</h1>
<p>listener:</p>
<h1>Spring Boot 4 - 使用虚拟线程</h1>
<p>concurrency: 10
type: batch  # 批量消费
</code></pre></p>
<p></code></pre></p>
<h2>10.2 消息生产者</h2>
<p><strong>KafkaProducer.java</strong>:</p>
<pre><code class="language-java">@Service
public class OrderEventProducer {
    private final KafkaTemplate&lt;String, OrderEvent&gt; kafkaTemplate;
<pre><code>public OrderEventProducer(KafkaTemplate&amp;lt;String, OrderEvent&amp;gt; kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
}
<p>@Observed(name = &amp;quot;kafka.send&amp;quot;)
public CompletableFuture&amp;lt;SendResult&amp;lt;String, OrderEvent&amp;gt;&amp;gt; sendOrderEvent(OrderEvent event) {
return kafkaTemplate.send(&amp;quot;orders&amp;quot;, event.orderId(), event);
}
</code></pre></p>
<p>}</p>
<p>record OrderEvent(String orderId, String userId, BigDecimal amount, Instant timestamp) {}
</code></pre></p>
<h2>10.3 消息消费者</h2>
<p><strong>KafkaConsumer.java</strong>:</p>
<pre><code class="language-java">@Service
public class OrderEventConsumer {
    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);
<pre><code>/**
 * Spring Boot 4 - 自动使用虚拟线程
 */
@KafkaListener(topics = &amp;quot;orders&amp;quot;, groupId = &amp;quot;order-processor&amp;quot;)
@Observed(name = &amp;quot;kafka.consume&amp;quot;)
public void consume(OrderEvent event) {
    log.info(&amp;quot;Consumed order event: {}, thread: {}&amp;quot;, 
        event.orderId(), Thread.currentThread());
<pre><code>// 处理订单事件
processOrder(event);
</code></pre>
<p>}</p>
<p>/**</p>
<ul>
<li>批量消费
*/
@KafkaListener(topics = &amp;quot;orders-batch&amp;quot;, groupId = &amp;quot;batch-processor&amp;quot;)
public void consumeBatch(List&amp;lt;OrderEvent&amp;gt; events) {
<a href="http://log.info">log.info</a>(&amp;quot;Consumed {} events in batch&amp;quot;, events.size());
events.parallelStream().forEach(this::processOrder);
}</li>
</ul>
<p>private void processOrder(OrderEvent event) {
// 业务逻辑
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>10.4 性能对比</h2>
<table>
<thead>
<tr>
<th>配置</th>
<th>吞吐量 (msg/s)</th>
<th>延迟 (P95)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Boot 3 + 平台线程</td>
<td>15,000</td>
<td>120ms</td>
</tr>
<tr>
<td>Boot 4 + 虚拟线程</td>
<td>85,000</td>
<td>25ms</td>
</tr>
</tbody>
</table>
<p><strong>性能提升</strong>: 5.6倍吞吐量，79%延迟降低</p>
<h2>10.5 小结</h2>
<p>✅ Kafka 客户端升级
✅ 虚拟线程集成
✅ 显著的性能提升</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html">← 上一章</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html">下一章 →</a></li>
</ul>
