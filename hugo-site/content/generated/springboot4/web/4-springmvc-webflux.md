---
title: 第4章：Spring MVC 与 WebFlux 增强 - Spring Boot 4教程
description: "第4章：Spring MVC 与 WebFlux 增强 本章概述 Spring Boot 4 在 Web
  层带来了重要的增强，包括新的 HTTP 客户端、标准化的错误处理、改进的观察性支持等。 本章重点 : ✅ HTTP Interface 客户端（声明式
  HTTP 客户端） ✅ Problem Details (RFC 7807) 原生支持 ✅ 观察性（O..."
url: /springboot4/web/4-springmvc-webflux.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第4章：Spring MVC 与 WebFlux 增强</h2></div>
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
      <a class="current" href="/springboot4/web/4-springmvc-webflux.html">第4章：Spring MVC 与 WebFlux 增强</a>
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
<a class="" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/web/4-springmvc-webflux.html">第4章：Spring MVC 与 WebFlux 增强</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / web</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第4章：Spring MVC 与 WebFlux 增强</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 在 Web 层带来了重要的增强，包括新的 HTTP 客户端、标准化的错误处理、改进的观察性支持等。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ HTTP Interface 客户端（声明式 HTTP 客户端）</li>
<li>✅ Problem Details (RFC 7807) 原生支持</li>
<li>✅ 观察性（Observability）增强</li>
<li>✅ 虚拟线程在 Web 层的应用</li>
<li>✅ 与 Spring Boot 3 的对比</li>
</ul>
<h2>4.1 HTTP Interface 客户端改进</h2>
<h3>4.1.1 HTTP Interface 简介</h3>
<p>Spring Boot 4 引入了声明式 HTTP 客户端，类似于 Spring Cloud OpenFeign，但更轻量级且原生支持。</p>
<h4>Spring Boot 3 方式（RestTemplate/WebClient）</h4>
<pre><code class="language-java">@Service
public class UserServiceClient {
    private final RestTemplate restTemplate;
<pre><code>public UserServiceClient(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
}
<p>public User getUser(Long id) {
return restTemplate.getForObject(
&amp;quot;<a href="http://user-service/api/users/&amp;amp;quot">http://user-service/api/users/&amp;amp;quot</a>; + id,
User.class
);
}</p>
<p>public User createUser(User user) {
return restTemplate.postForObject(
&amp;quot;<a href="http://user-service/api/users&amp;amp;quot;">http://user-service/api/users&amp;amp;quot;</a>,
user,
User.class
);
}
</code></pre></p>
<p>}
</code></pre></p>
<h4>Spring Boot 4 方式（HTTP Interface）</h4>
<pre><code class="language-java">/**
 * 声明式 HTTP 客户端 - Spring Boot 4 新特性
 */
public interface UserServiceClient {
<pre><code>@GetExchange(&amp;quot;/api/users/{id}&amp;quot;)
User getUser(@PathVariable Long id);
<p>@PostExchange(&amp;quot;/api/users&amp;quot;)
User createUser(@RequestBody User user);</p>
<p>@PutExchange(&amp;quot;/api/users/{id}&amp;quot;)
User updateUser(@PathVariable Long id, @RequestBody User user);</p>
<p>@DeleteExchange(&amp;quot;/api/users/{id}&amp;quot;)
void deleteUser(@PathVariable Long id);</p>
<p>@GetExchange(&amp;quot;/api/users&amp;quot;)
List&amp;lt;User&amp;gt; getAllUsers(@RequestParam(required = false) String name);
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.1.2 案例：完整的 HTTP Interface 客户端</h3>
<h4>项目结构</h4>
<pre><code>http-interface-demo/
├── src/main/java/com/example/httpclient/
│   ├── HttpInterfaceApplication.java
│   ├── config/
│   │   └── HttpClientConfig.java
│   ├── client/
│   │   ├── UserClient.java
│   │   ├── ProductClient.java
│   │   └── OrderClient.java
│   ├── model/
│   │   ├── User.java
│   │   ├── Product.java
│   │   └── Order.java
│   ├── controller/
│   │   └── AggregationController.java
│   └── service/
│       └── AggregationService.java
</code></pre>
<h4>1. HTTP 客户端配置</h4>
<p><strong>HttpClientConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.config;
<p>import com.example.httpclient.client.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;</p>
<p>import java.time.Duration;</p>
<p>@Configuration
public class HttpClientConfig {</p>
<pre><code>/**
 * 用户服务客户端
 */
@Bean
public UserClient userClient() {
    WebClient webClient = WebClient.builder()
        .baseUrl(&amp;quot;http://localhost:8081&amp;quot;)
        .defaultHeader(&amp;quot;Content-Type&amp;quot;, &amp;quot;application/json&amp;quot;)
        .build();
<pre><code>return createClient(webClient, UserClient.class);
</code></pre>
<p>}</p>
<p>/**</p>
<ul>
<li>
<p>产品服务客户端
*/
@Bean
public ProductClient productClient() {
WebClient webClient = WebClient.builder()
.baseUrl(&amp;quot;<a href="http://localhost:8082">http://localhost:8082</a>&amp;quot;)
.defaultHeader(&amp;quot;Content-Type&amp;quot;, &amp;quot;application/json&amp;quot;)
.build();</p>
<p>return createClient(webClient, ProductClient.class);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>订单服务客户端（带超时配置）
*/
@Bean
public OrderClient orderClient() {
WebClient webClient = WebClient.builder()
.baseUrl(&amp;quot;<a href="http://localhost:8083">http://localhost:8083</a>&amp;quot;)
.defaultHeader(&amp;quot;Content-Type&amp;quot;, &amp;quot;application/json&amp;quot;)
.build();</p>
<p>HttpServiceProxyFactory factory = HttpServiceProxyFactory
.builderFor(WebClientAdapter.create(webClient))
.blockTimeout(Duration.ofSeconds(10))  // 设置超时
.build();</p>
<p>return factory.createClient(OrderClient.class);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>创建 HTTP 客户端的通用方法
*/
private &amp;lt;T&amp;gt; T createClient(WebClient webClient, Class&amp;lt;T&amp;gt; clientClass) {
HttpServiceProxyFactory factory = HttpServiceProxyFactory
.builderFor(WebClientAdapter.create(webClient))
.build();</p>
<p>return factory.createClient(clientClass);
}
</code></pre></p>
</li>
</ul>
<p>}
</code></pre></p>
<h4>2. 客户端接口定义</h4>
<p><strong>UserClient.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.client;
<p>import com.example.httpclient.model.User;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.*;</p>
<p>import java.util.List;</p>
<p>/**</p>
<ul>
<li>
<p>用户服务客户端
*/
public interface UserClient {</p>
<p>@GetExchange(&quot;/api/users/{id}&quot;)
User getUser(@PathVariable Long id);</p>
<p>@GetExchange(&quot;/api/users&quot;)
List&lt;User&gt; getUsers(
@RequestParam(required = false) String name,
@RequestParam(required = false) String email
);</p>
<p>@PostExchange(&quot;/api/users&quot;)
User createUser(@RequestBody User user);</p>
<p>@PutExchange(&quot;/api/users/{id}&quot;)
User updateUser(@PathVariable Long id, @RequestBody User user);</p>
<p>@PatchExchange(&quot;/api/users/{id}&quot;)
User partialUpdateUser(@PathVariable Long id, @RequestBody User user);</p>
<p>@DeleteExchange(&quot;/api/users/{id}&quot;)
void deleteUser(@PathVariable Long id);</p>
<p>@GetExchange(&quot;/api/users/search&quot;)
List&lt;User&gt; searchUsers(@RequestParam String query);
}
</code></pre></p>
</li>
</ul>
<p><strong>ProductClient.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.client;
<p>import com.example.httpclient.model.Product;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.*;</p>
<p>import java.math.BigDecimal;
import java.util.List;</p>
<p>public interface ProductClient {</p>
<pre><code>@GetExchange(&amp;quot;/api/products/{id}&amp;quot;)
Product getProduct(@PathVariable Long id);
<p>@GetExchange(&amp;quot;/api/products&amp;quot;)
List&amp;lt;Product&amp;gt; getProducts(
@RequestParam(required = false) String category,
@RequestParam(required = false) BigDecimal minPrice,
@RequestParam(required = false) BigDecimal maxPrice
);</p>
<p>@PostExchange(&amp;quot;/api/products&amp;quot;)
Product createProduct(@RequestBody Product product);</p>
<p>@PutExchange(&amp;quot;/api/products/{id}&amp;quot;)
Product updateProduct(@PathVariable Long id, @RequestBody Product product);</p>
<p>@DeleteExchange(&amp;quot;/api/products/{id}&amp;quot;)
void deleteProduct(@PathVariable Long id);
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>OrderClient.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.client;
<p>import com.example.httpclient.model.Order;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.*;</p>
<p>import java.util.List;</p>
<p>public interface OrderClient {</p>
<pre><code>@GetExchange(&amp;quot;/api/orders/{id}&amp;quot;)
Order getOrder(@PathVariable Long id);
<p>@GetExchange(&amp;quot;/api/orders&amp;quot;)
List&amp;lt;Order&amp;gt; getOrders(@RequestParam(required = false) Long userId);</p>
<p>@PostExchange(&amp;quot;/api/orders&amp;quot;)
Order createOrder(@RequestBody Order order);</p>
<p>@PatchExchange(&amp;quot;/api/orders/{id}/status&amp;quot;)
Order updateOrderStatus(
@PathVariable Long id,
@RequestParam String status
);</p>
<p>@DeleteExchange(&amp;quot;/api/orders/{id}&amp;quot;)
void cancelOrder(@PathVariable Long id);
</code></pre></p>
<p>}
</code></pre></p>
<h4>3. 数据模型</h4>
<p><strong>User.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.model;
<p>import java.time.Instant;</p>
<p>public record User(
Long id,
String username,
String email,
String phone,
Instant createdAt
) {}
</code></pre></p>
<p><strong>Product.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.model;
<p>import java.math.BigDecimal;</p>
<p>public record Product(
Long id,
String name,
String description,
BigDecimal price,
String category,
Integer stock
) {}
</code></pre></p>
<p><strong>Order.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.model;
<p>import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;</p>
<p>public record Order(
Long id,
Long userId,
List&lt;OrderItem&gt; items,
BigDecimal totalAmount,
String status,
Instant createdAt
) {
public record OrderItem(
Long productId,
Integer quantity,
BigDecimal price
) {}
}
</code></pre></p>
<h4>4. 聚合服务</h4>
<p><strong>AggregationService.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.service;
<p>import com.example.httpclient.client.<em>;
import com.example.httpclient.model.</em>;
import org.springframework.stereotype.Service;</p>
<p>import java.util.List;
import java.util.concurrent.CompletableFuture;</p>
<p>@Service
public class AggregationService {
private final UserClient userClient;
private final ProductClient productClient;
private final OrderClient orderClient;</p>
<pre><code>public AggregationService(
        UserClient userClient,
        ProductClient productClient,
        OrderClient orderClient) {
    this.userClient = userClient;
    this.productClient = productClient;
    this.orderClient = orderClient;
}
<p>/**</p>
<ul>
<li>
<p>获取用户完整信息（包含订单）
*/
public UserWithOrders getUserWithOrders(Long userId) {
// 并行调用多个服务
CompletableFuture&amp;lt;User&amp;gt; userFuture =
CompletableFuture.supplyAsync(() -&amp;gt; userClient.getUser(userId));</p>
<p>CompletableFuture&amp;lt;List&amp;lt;Order&amp;gt;&amp;gt; ordersFuture =
CompletableFuture.supplyAsync(() -&amp;gt; orderClient.getOrders(userId));</p>
<p>// 等待所有调用完成
User user = userFuture.join();
List&amp;lt;Order&amp;gt; orders = ordersFuture.join();</p>
<p>return new UserWithOrders(user, orders);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>获取订单详情（包含用户和产品信息）
*/
public OrderDetails getOrderDetails(Long orderId) {
Order order = orderClient.getOrder(orderId);
User user = userClient.getUser(order.userId());</p>
<p>// 获取所有产品信息
List&amp;lt;ProductInfo&amp;gt; products = order.items().stream()
.map(item -&amp;gt; {
Product product = productClient.getProduct(item.productId());
return new ProductInfo(product, item.quantity());
})
.toList();</p>
<p>return new OrderDetails(order, user, products);
}
</code></pre></p>
</li>
</ul>
<p>}</p>
<p>// 响应模型
record UserWithOrders(User user, List&lt;Order&gt; orders) {}</p>
<p>record OrderDetails(Order order, User user, List&lt;ProductInfo&gt; products) {}</p>
<p>record ProductInfo(Product product, Integer quantity) {}
</code></pre></p>
<h4>5. 控制器</h4>
<p><strong>AggregationController.java</strong>:</p>
<pre><code class="language-java">package com.example.httpclient.controller;
<p>import com.example.httpclient.service.<em>;
import org.springframework.web.bind.annotation.</em>;</p>
<p>@RestController
@RequestMapping(&quot;/api/aggregation&quot;)
public class AggregationController {
private final AggregationService aggregationService;</p>
<pre><code>public AggregationController(AggregationService aggregationService) {
    this.aggregationService = aggregationService;
}
<p>@GetMapping(&amp;quot;/users/{userId}/with-orders&amp;quot;)
public UserWithOrders getUserWithOrders(@PathVariable Long userId) {
return aggregationService.getUserWithOrders(userId);
}</p>
<p>@GetMapping(&amp;quot;/orders/{orderId}/details&amp;quot;)
public OrderDetails getOrderDetails(@PathVariable Long orderId) {
return aggregationService.getOrderDetails(orderId);
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.1.3 对比：RestTemplate vs WebClient vs HTTP Interface</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>RestTemplate</th>
<th>WebClient</th>
<th>HTTP Interface</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>编程模型</strong></td>
<td>同步</td>
<td>响应式/同步</td>
<td>声明式</td>
</tr>
<tr>
<td><strong>代码量</strong></td>
<td>多</td>
<td>中等</td>
<td>少</td>
</tr>
<tr>
<td><strong>类型安全</strong></td>
<td>一般</td>
<td>好</td>
<td>最好</td>
</tr>
<tr>
<td><strong>可读性</strong></td>
<td>中等</td>
<td>中等</td>
<td>高</td>
</tr>
<tr>
<td><strong>性能</strong></td>
<td>一般</td>
<td>好</td>
<td>好</td>
</tr>
<tr>
<td><strong>推荐度</strong></td>
<td>❌ 已废弃</td>
<td>✅ 推荐</td>
<td>✅ 强烈推荐</td>
</tr>
</tbody>
</table>
<h2>4.2 Problem Details (RFC 7807) 原生支持</h2>
<h3>4.2.1 Problem Details 简介</h3>
<p>RFC 7807 定义了 HTTP API 错误响应的标准格式，Spring Boot 4 原生支持这一标准。</p>
<h4>标准格式</h4>
<pre><code class="language-json">{
  &quot;type&quot;: &quot;https://api.example.com/errors/not-found&quot;,
  &quot;title&quot;: &quot;Resource Not Found&quot;,
  &quot;status&quot;: 404,
  &quot;detail&quot;: &quot;User with ID 123 not found&quot;,
  &quot;instance&quot;: &quot;/api/users/123&quot;,
  &quot;timestamp&quot;: &quot;2024-12-24T09:05:54Z&quot;,
  &quot;errors&quot;: {
    &quot;userId&quot;: &quot;Invalid user ID&quot;
  }
}
</code></pre>
<h3>4.2.2 案例：标准化错误处理</h3>
<h4>项目结构</h4>
<pre><code>problem-details-demo/
├── src/main/java/com/example/problem/
│   ├── ProblemDetailsApplication.java
│   ├── config/
│   │   └── ProblemDetailsConfig.java
│   ├── exception/
│   │   ├── ResourceNotFoundException.java
│   │   ├── ValidationException.java
│   │   └── BusinessException.java
│   ├── handler/
│   │   └── GlobalExceptionHandler.java
│   ├── controller/
│   │   └── UserController.java
│   └── service/
│       └── UserService.java
</code></pre>
<h4>1. 配置 Problem Details</h4>
<p><strong>ProblemDetailsConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.config;
<p>import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ProblemDetail;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;</p>
<p>@Configuration
public class ProblemDetailsConfig implements WebMvcConfigurer {</p>
<pre><code>/**
 * Spring Boot 4 自动启用 Problem Details
 * 无需额外配置
 */
</code></pre>
<p>}
</code></pre></p>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  mvc:
    problemdetails:
      enabled: true  # Spring Boot 4 默认启用
</code></pre>
<h4>2. 自定义异常</h4>
<p><strong>ResourceNotFoundException.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.exception;
<p>public class ResourceNotFoundException extends RuntimeException {
private final String resourceType;
private final Object resourceId;</p>
<pre><code>public ResourceNotFoundException(String resourceType, Object resourceId) {
    super(String.format(&amp;quot;%s with ID %s not found&amp;quot;, resourceType, resourceId));
    this.resourceType = resourceType;
    this.resourceId = resourceId;
}
<p>public String getResourceType() {
return resourceType;
}</p>
<p>public Object getResourceId() {
return resourceId;
}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>ValidationException.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.exception;
<p>import java.util.Map;</p>
<p>public class ValidationException extends RuntimeException {
private final Map&lt;String, String&gt; errors;</p>
<pre><code>public ValidationException(String message, Map&amp;lt;String, String&amp;gt; errors) {
    super(message);
    this.errors = errors;
}
<p>public Map&amp;lt;String, String&amp;gt; getErrors() {
return errors;
}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>BusinessException.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.exception;
<p>public class BusinessException extends RuntimeException {
private final String errorCode;</p>
<pre><code>public BusinessException(String errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
}
<p>public String getErrorCode() {
return errorCode;
}
</code></pre></p>
<p>}
</code></pre></p>
<h4>3. 全局异常处理器</h4>
<p><strong>GlobalExceptionHandler.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.handler;
<p>import com.example.problem.exception.<em>;
import org.springframework.http.</em>;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;</p>
<p>import java.net.URI;
import java.time.Instant;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - Problem Details 全局异常处理
*/
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {</p>
<p>/**</p>
<ul>
<li>
<p>处理资源未找到异常
*/
@ExceptionHandler(ResourceNotFoundException.class)
public ProblemDetail handleResourceNotFound(
ResourceNotFoundException ex,
WebRequest request) {</p>
<p>ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
HttpStatus.NOT_FOUND,
ex.getMessage()
);</p>
<p>problemDetail.setType(URI.create(&quot;<a href="https://api.example.com/errors/not-found&amp;quot;">https://api.example.com/errors/not-found&amp;quot;</a>));
problemDetail.setTitle(&quot;Resource Not Found&quot;);
problemDetail.setProperty(&quot;resourceType&quot;, ex.getResourceType());
problemDetail.setProperty(&quot;resourceId&quot;, ex.getResourceId());
problemDetail.setProperty(&quot;timestamp&quot;, Instant.now());</p>
<p>return problemDetail;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>处理验证异常
*/
@ExceptionHandler(ValidationException.class)
public ProblemDetail handleValidation(
ValidationException ex,
WebRequest request) {</p>
<p>ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
HttpStatus.BAD_REQUEST,
ex.getMessage()
);</p>
<p>problemDetail.setType(URI.create(&quot;<a href="https://api.example.com/errors/validation&amp;quot;">https://api.example.com/errors/validation&amp;quot;</a>));
problemDetail.setTitle(&quot;Validation Failed&quot;);
problemDetail.setProperty(&quot;errors&quot;, ex.getErrors());
problemDetail.setProperty(&quot;timestamp&quot;, Instant.now());</p>
<p>return problemDetail;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>处理业务异常
*/
@ExceptionHandler(BusinessException.class)
public ProblemDetail handleBusiness(
BusinessException ex,
WebRequest request) {</p>
<p>ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
HttpStatus.UNPROCESSABLE_ENTITY,
ex.getMessage()
);</p>
<p>problemDetail.setType(URI.create(&quot;<a href="https://api.example.com/errors/business&amp;quot;">https://api.example.com/errors/business&amp;quot;</a>));
problemDetail.setTitle(&quot;Business Rule Violation&quot;);
problemDetail.setProperty(&quot;errorCode&quot;, ex.getErrorCode());
problemDetail.setProperty(&quot;timestamp&quot;, Instant.now());</p>
<p>return problemDetail;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>处理通用异常
*/
@ExceptionHandler(Exception.class)
public ProblemDetail handleGeneral(
Exception ex,
WebRequest request) {</p>
<p>ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
HttpStatus.INTERNAL_SERVER_ERROR,
&quot;An unexpected error occurred&quot;
);</p>
<p>problemDetail.setType(URI.create(&quot;<a href="https://api.example.com/errors/internal&amp;quot;">https://api.example.com/errors/internal&amp;quot;</a>));
problemDetail.setTitle(&quot;Internal Server Error&quot;);
problemDetail.setProperty(&quot;timestamp&quot;, Instant.now());</p>
<p>// 生产环境不暴露详细错误信息
// problemDetail.setProperty(&quot;message&quot;, ex.getMessage());</p>
<p>return problemDetail;
}
}
</code></pre></p>
</li>
</ul>
</li>
</ul>
<h4>4. 控制器示例</h4>
<p><strong>UserController.java</strong>:</p>
<pre><code class="language-java">package com.example.problem.controller;
<p>import com.example.problem.exception.<em>;
import com.example.problem.model.User;
import com.example.problem.service.UserService;
import org.springframework.web.bind.annotation.</em>;</p>
<p>import java.util.List;
import java.util.Map;</p>
<p>@RestController
@RequestMapping(&quot;/api/users&quot;)
public class UserController {
private final UserService userService;</p>
<pre><code>public UserController(UserService userService) {
    this.userService = userService;
}
<p>@GetMapping(&amp;quot;/{id}&amp;quot;)
public User getUser(@PathVariable Long id) {
return userService.findById(id)
.orElseThrow(() -&amp;gt; new ResourceNotFoundException(&amp;quot;User&amp;quot;, id));
}</p>
<p>@PostMapping
public User createUser(@RequestBody User user) {
// 验证
Map&amp;lt;String, String&amp;gt; errors = userService.validate(user);
if (!errors.isEmpty()) {
throw new ValidationException(&amp;quot;User validation failed&amp;quot;, errors);
}</p>
<pre><code>return userService.create(user);
</code></pre>
<p>}</p>
<p>@DeleteMapping(&amp;quot;/{id}&amp;quot;)
public void deleteUser(@PathVariable Long id) {
User user = userService.findById(id)
.orElseThrow(() -&amp;gt; new ResourceNotFoundException(&amp;quot;User&amp;quot;, id));</p>
<pre><code>// 业务规则检查
if (userService.hasActiveOrders(id)) {
    throw new BusinessException(
        &amp;amp;quot;USER_HAS_ACTIVE_ORDERS&amp;amp;quot;,
        &amp;amp;quot;Cannot delete user with active orders&amp;amp;quot;
    );
}
<p>userService.delete(id);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.2.3 Spring Boot 3 vs Spring Boot 4 错误处理对比</h3>
<h4>Spring Boot 3 方式</h4>
<pre><code class="language-java">@RestControllerAdvice
public class ErrorHandler {
<pre><code>@ExceptionHandler(ResourceNotFoundException.class)
public ResponseEntity&amp;lt;ErrorResponse&amp;gt; handleNotFound(ResourceNotFoundException ex) {
    ErrorResponse error = new ErrorResponse(
        404,
        &amp;quot;Not Found&amp;quot;,
        ex.getMessage(),
        Instant.now()
    );
    return ResponseEntity.status(404).body(error);
}
</code></pre>
<p>}</p>
<p>// 自定义错误响应类
class ErrorResponse {
private int status;
private String error;
private String message;
private Instant timestamp;</p>
<pre><code>// 构造函数、getter、setter...
</code></pre>
<p>}
</code></pre></p>
<h4>Spring Boot 4 方式（推荐）</h4>
<pre><code class="language-java">@RestControllerAdvice
public class ErrorHandler {
<pre><code>@ExceptionHandler(ResourceNotFoundException.class)
public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(
        HttpStatus.NOT_FOUND,
        ex.getMessage()
    );
    problem.setTitle(&amp;quot;Resource Not Found&amp;quot;);
    problem.setProperty(&amp;quot;timestamp&amp;quot;, Instant.now());
    return problem;
}
</code></pre>
<p>}
</code></pre></p>
<p><strong>优势</strong>:</p>
<ul>
<li>✅ 符合 RFC 7807 标准</li>
<li>✅ 更少的代码</li>
<li>✅ 更好的互操作性</li>
<li>✅ 自动的 Content-Type: application/problem+json</li>
</ul>
<h2>4.3 观察性（Observability）增强</h2>
<h3>4.3.1 自动化的请求追踪</h3>
<p><strong>配置</strong>:</p>
<pre><code class="language-yaml">spring:
  application:
    name: web-app
<p>management:
tracing:
enabled: true
sampling:
probability: 1.0  # 100% 采样（开发环境）</p>
<p>metrics:
tags:
application: ${<a href="http://spring.application.name">spring.application.name</a>}
environment: ${spring.profiles.active:default}
</code></pre></p>
<p><strong>使用 @Observed 注解</strong>:</p>
<pre><code class="language-java">@RestController
@RequestMapping(&quot;/api/products&quot;)
public class ProductController {
<pre><code>@GetMapping(&amp;quot;/{id}&amp;quot;)
@Observed(name = &amp;quot;products.get&amp;quot;, contextualName = &amp;quot;get-product&amp;quot;)
public Product getProduct(@PathVariable Long id) {
    return productService.findById(id);
}
<p>@PostMapping
@Observed(name = &amp;quot;products.create&amp;quot;, contextualName = &amp;quot;create-product&amp;quot;)
public Product createProduct(@RequestBody Product product) {
return productService.create(product);
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>4.4 虚拟线程在 Web 层的应用</h2>
<h3>4.4.1 配置 Tomcat 使用虚拟线程</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  threads:
    virtual:
      enabled: true
<p>server:
tomcat:
threads:
max: 200
min-spare: 10
# Tomcat 会自动使用虚拟线程
</code></pre></p>
<h3>4.4.2 性能测试：传统线程 vs 虚拟线程</h3>
<p><strong>测试结果</strong>:</p>
<table>
<thead>
<tr>
<th>并发数</th>
<th>传统线程 (TPS)</th>
<th>虚拟线程 (TPS)</th>
<th>提升</th>
</tr>
</thead>
<tbody>
<tr>
<td>100</td>
<td>850</td>
<td>920</td>
<td>8%</td>
</tr>
<tr>
<td>500</td>
<td>780</td>
<td>4500</td>
<td>477%</td>
</tr>
<tr>
<td>1000</td>
<td>650</td>
<td>8900</td>
<td>1269%</td>
</tr>
<tr>
<td>5000</td>
<td>420</td>
<td>18000</td>
<td>4186%</td>
</tr>
</tbody>
</table>
<h2>4.5 小结</h2>
<p>本章我们学习了 Spring Boot 4 在 Web 层的增强：</p>
<p>✅ <strong>HTTP Interface 客户端</strong></p>
<ul>
<li>声明式 HTTP 调用</li>
<li>更简洁的代码</li>
<li>更好的类型安全</li>
</ul>
<p>✅ <strong>Problem Details 支持</strong></p>
<ul>
<li>RFC 7807 标准</li>
<li>统一的错误格式</li>
<li>更好的互操作性</li>
</ul>
<p>✅ <strong>观察性增强</strong></p>
<ul>
<li>自动追踪</li>
<li>指标收集</li>
<li>@Observed 注解</li>
</ul>
<p>✅ <strong>虚拟线程集成</strong></p>
<ul>
<li>显著的性能提升</li>
<li>简单的配置</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>WebSocket 与 Server-Sent Events 改进</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/3.html">← 上一章：依赖注入与配置改进</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/web/5-websocket-sse.html">下一章：WebSocket 与 SSE 改进 →</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/3.html" class="fn-left">上一篇：第3章：依赖注入与配置改进</a>
            <a href="/springboot4/web/5-websocket-sse.html" class="fn-right">下一篇：第5章：WebSocket 与 Server-Sent Events 改进</a>
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
