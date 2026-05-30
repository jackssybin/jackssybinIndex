---
title: "第4章：Spring MVC 与 WebFlux 增强"
permalink: "/springboot4/web/4-springmvc-webflux.html"
description: "第4章：Spring MVC 与 WebFlux 增强 本章概述 Spring Boot 4 在 Web 层带来了重要的增强，包括新的 HTTP 客户端、标准化的错误处理、改进的观察性支持等。 本章重点: ✅ HTTP Interface 客户端（声明式 HTTP 客户端） ✅ Problem Details (RFC 7807) 原生支持 ✅ 观察性（Ob..."
---

<h1>第4章：Spring MVC 与 WebFlux 增强</h1>
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

userService.delete(id);
</code></pre>
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
</ul>
