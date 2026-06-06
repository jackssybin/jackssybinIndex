---
title: 第6章：Spring Data 4.0 新特性 - Spring Boot 4教程
description: "第6章：Spring Data 4.0 新特性 本章概述 Spring Data 4.0 是 Spring Boot 4
  的重要组成部分，带来了许多改进，包括更好的查询方法、虚拟线程支持、改进的审计功能等。 本章重点 : ✅ Repository 接口改进 ✅ 查询方法增强 ✅
  Querydsl 集成增强 ✅ 虚拟线程与数据库连接池 ✅ Hibernate ..."
url: /springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第6章：Spring Data 4.0 新特性</h2></div>
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
      <a class="current" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html">第6章：Spring Data 4.0 新特性</a>
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
            <h2><a rel="bookmark" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html">第6章：Spring Data 4.0 新特性</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 第四部分-_数据访问</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第6章：Spring Data 4.0 新特性</h1>
<h2>本章概述</h2>
<p>Spring Data 4.0 是 Spring Boot 4 的重要组成部分，带来了许多改进，包括更好的查询方法、虚拟线程支持、改进的审计功能等。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ Repository 接口改进</li>
<li>✅ 查询方法增强</li>
<li>✅ Querydsl 集成增强</li>
<li>✅ 虚拟线程与数据库连接池</li>
<li>✅ Hibernate 6.x 集成</li>
<li>✅ 与 Spring Boot 3 的对比</li>
</ul>
<h2>6.1 Repository 接口改进</h2>
<h3>6.1.1 新的查询方法命名规则</h3>
<p>Spring Data 4.0 引入了更灵活的查询方法命名规则。</p>
<h4>项目结构</h4>
<pre><code>spring-data-demo/
├── src/main/java/com/example/data/
│   ├── SpringDataApplication.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Product.java
│   │   └── Order.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   └── OrderRepository.java
│   ├── dto/
│   │   ├── UserDTO.java
│   │   └── ProductDTO.java
│   └── service/
│       └── UserService.java
</code></pre>
<h4>1. 实体类</h4>
<p><strong>User.java</strong>:</p>
<pre><code class="language-java">package com.example.data.entity;
<p>import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;</p>
<p>import java.time.Instant;
import java.util.ArrayList;
import java.util.List;</p>
<p>@Entity
@Table(name = &quot;users&quot;, indexes = {
@Index(name = &quot;idx_email&quot;, columnList = &quot;email&quot;),
@Index(name = &quot;idx_username&quot;, columnList = &quot;username&quot;)
})
@EntityListeners(AuditingEntityListener.class)
public class User {</p>
<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
<p>@Column(nullable = false, unique = true, length = 50)
private String username;</p>
<p>@Column(nullable = false, unique = true, length = 100)
private String email;</p>
<p>@Column(length = 20)
private String phone;</p>
<p>@Enumerated(EnumType.STRING)
@Column(nullable = false, length = 20)
private UserStatus status = UserStatus.ACTIVE;</p>
<p>@Column(name = &amp;quot;age&amp;quot;)
private Integer age;</p>
<p>@Column(name = &amp;quot;city&amp;quot;, length = 50)
private String city;</p>
<p>@OneToMany(mappedBy = &amp;quot;user&amp;quot;, cascade = CascadeType.ALL, orphanRemoval = true)
private List&amp;lt;Order&amp;gt; orders = new ArrayList&amp;lt;&amp;gt;();</p>
<p>@CreatedDate
@Column(name = &amp;quot;created_at&amp;quot;, nullable = false, updatable = false)
private Instant createdAt;</p>
<p>@LastModifiedDate
@Column(name = &amp;quot;updated_at&amp;quot;)
private Instant updatedAt;</p>
<p>@Version
private Long version;</p>
<p>public enum UserStatus {
ACTIVE, INACTIVE, SUSPENDED, DELETED
}</p>
<p>// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { <a href="http://this.id">this.id</a> = id; }</p>
<p>public String getUsername() { return username; }
public void setUsername(String username) { this.username = username; }</p>
<p>public String getEmail() { return email; }
public void setEmail(String email) { this.email = email; }</p>
<p>public String getPhone() { return phone; }
public void setPhone(String phone) { this.phone = phone; }</p>
<p>public UserStatus getStatus() { return status; }
public void setStatus(UserStatus status) { this.status = status; }</p>
<p>public Integer getAge() { return age; }
public void setAge(Integer age) { this.age = age; }</p>
<p>public String getCity() { return city; }
public void setCity(String city) { this.city = city; }</p>
<p>public List&amp;lt;Order&amp;gt; getOrders() { return orders; }
public void setOrders(List&amp;lt;Order&amp;gt; orders) { this.orders = orders; }</p>
<p>public Instant getCreatedAt() { return createdAt; }
public Instant getUpdatedAt() { return updatedAt; }
public Long getVersion() { return version; }
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>Product.java</strong>:</p>
<pre><code class="language-java">package com.example.data.entity;
<p>import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;</p>
<p>@Entity
@Table(name = &quot;products&quot;)
public class Product {</p>
<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
<p>@Column(nullable = false, length = 100)
private String name;</p>
<p>@Column(length = 500)
private String description;</p>
<p>@Column(nullable = false, precision = 10, scale = 2)
private BigDecimal price;</p>
<p>@Column(nullable = false)
private Integer stock;</p>
<p>@Column(length = 50)
private String category;</p>
<p>@Column(name = &amp;quot;created_at&amp;quot;)
private Instant createdAt;</p>
<p>@PrePersist
protected void onCreate() {
createdAt = Instant.now();
}</p>
<p>// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { <a href="http://this.id">this.id</a> = id; }</p>
<p>public String getName() { return name; }
public void setName(String name) { <a href="http://this.name">this.name</a> = name; }</p>
<p>public String getDescription() { return description; }
public void setDescription(String description) { this.description = description; }</p>
<p>public BigDecimal getPrice() { return price; }
public void setPrice(BigDecimal price) { this.price = price; }</p>
<p>public Integer getStock() { return stock; }
public void setStock(Integer stock) { this.stock = stock; }</p>
<p>public String getCategory() { return category; }
public void setCategory(String category) { this.category = category; }</p>
<p>public Instant getCreatedAt() { return createdAt; }
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>Order.java</strong>:</p>
<pre><code class="language-java">package com.example.data.entity;
<p>import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;</p>
<p>@Entity
@Table(name = &quot;orders&quot;)
public class Order {</p>
<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
<p>@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = &amp;quot;user_id&amp;quot;, nullable = false)
private User user;</p>
<p>@Column(name = &amp;quot;total_amount&amp;quot;, nullable = false, precision = 10, scale = 2)
private BigDecimal totalAmount;</p>
<p>@Enumerated(EnumType.STRING)
@Column(nullable = false, length = 20)
private OrderStatus status;</p>
<p>@Column(name = &amp;quot;created_at&amp;quot;)
private Instant createdAt;</p>
<p>public enum OrderStatus {
PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
}</p>
<p>@PrePersist
protected void onCreate() {
createdAt = Instant.now();
}</p>
<p>// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { <a href="http://this.id">this.id</a> = id; }</p>
<p>public User getUser() { return user; }
public void setUser(User user) { this.user = user; }</p>
<p>public BigDecimal getTotalAmount() { return totalAmount; }
public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }</p>
<p>public OrderStatus getStatus() { return status; }
public void setStatus(OrderStatus status) { this.status = status; }</p>
<p>public Instant getCreatedAt() { return createdAt; }
</code></pre></p>
<p>}
</code></pre></p>
<h4>2. Repository 接口</h4>
<p><strong>UserRepository.java</strong>:</p>
<pre><code class="language-java">package com.example.data.repository;
<p>import com.example.data.entity.User;
import com.example.data.entity.User.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Limit;
import org.springframework.data.domain.ScrollPosition;
import org.springframework.data.domain.Window;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;</p>
<p>import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Data 4.0 - 增强的 Repository
*/
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {</p>
<p>// ========== Spring Boot 3 传统查询方法 ==========</p>
<p>Optional&lt;User&gt; findByUsername(String username);</p>
<p>Optional&lt;User&gt; findByEmail(String email);</p>
<p>List&lt;User&gt; findByStatus(UserStatus status);</p>
<p>List&lt;User&gt; findByAgeGreaterThan(Integer age);</p>
<p>List&lt;User&gt; findByAgeBetween(Integer minAge, Integer maxAge);</p>
<p>// ========== Spring Data 4.0 新特性 ==========</p>
<p>/**</p>
<ul>
<li>使用 Limit 限制结果数量（新特性）
*/
List&lt;User&gt; findByStatus(UserStatus status, Limit limit);</li>
</ul>
<p>/**</p>
<ul>
<li>滚动查询（新特性）- 更高效的分页
*/
Window&lt;User&gt; findByStatus(UserStatus status, ScrollPosition position, Limit limit);</li>
</ul>
<p>/**</p>
<ul>
<li>流式查询（改进）
*/
@Query(&quot;SELECT u FROM User u WHERE u.status = :status&quot;)
Stream&lt;User&gt; streamByStatus(@Param(&quot;status&quot;) UserStatus status);</li>
</ul>
<p>/**</p>
<ul>
<li>投影查询（增强）
*/
&lt;T&gt; List&lt;T&gt; findByStatus(UserStatus status, Class&lt;T&gt; type);</li>
</ul>
<p>/**</p>
<ul>
<li>复杂查询条件
*/
List&lt;User&gt; findByStatusAndAgeGreaterThanAndCityIn(
UserStatus status,
Integer age,
List&lt;String&gt; cities
);</li>
</ul>
<p>/**</p>
<ul>
<li>自定义 JPQL 查询
*/
@Query(&quot;SELECT u FROM User u WHERE u.email LIKE %:domain&quot;)
List&lt;User&gt; findByEmailDomain(@Param(&quot;domain&quot;) String domain);</li>
</ul>
<p>/**</p>
<ul>
<li>原生 SQL 查询
*/
@Query(value = &quot;SELECT * FROM users WHERE created_at &gt; :since&quot;, nativeQuery = true)
List&lt;User&gt; findRecentUsers(@Param(&quot;since&quot;) Instant since);</li>
</ul>
<p>/**</p>
<ul>
<li>批量更新
*/
@Modifying
@Query(&quot;UPDATE User u SET u.status = :newStatus WHERE u.status = :oldStatus&quot;)
int updateStatus(@Param(&quot;oldStatus&quot;) UserStatus oldStatus,
@Param(&quot;newStatus&quot;) UserStatus newStatus);</li>
</ul>
<p>/**</p>
<ul>
<li>批量删除
*/
@Modifying
@Query(&quot;DELETE FROM User u WHERE u.status = :status AND u.createdAt &lt; :before&quot;)
int deleteInactiveUsers(@Param(&quot;status&quot;) UserStatus status,
@Param(&quot;before&quot;) Instant before);</li>
</ul>
<p>/**</p>
<ul>
<li>统计查询
*/
long countByStatus(UserStatus status);</li>
</ul>
<p>boolean existsByEmail(String email);</p>
<p>/**</p>
<ul>
<li>DTO 投影（使用构造函数）
*/
@Query(&quot;SELECT new com.example.data.dto.UserDTO(<a href="http://u.id">u.id</a>, u.username, u.email) &quot; +
&quot;FROM User u WHERE u.status = :status&quot;)
List&lt;com.example.data.dto.UserDTO&gt; findUserDTOsByStatus(@Param(&quot;status&quot;) UserStatus status);</li>
</ul>
<p>/**</p>
<ul>
<li>分页查询（改进）
*/
Page&lt;User&gt; findByStatusOrderByCreatedAtDesc(UserStatus status, Pageable pageable);</li>
</ul>
<p>/**</p>
<ul>
<li>关联查询
*/
@Query(&quot;SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE <a href="http://u.id">u.id</a> = :id&quot;)
Optional&lt;User&gt; findByIdWithOrders(@Param(&quot;id&quot;) Long id);</li>
</ul>
<p>/**</p>
<ul>
<li>聚合查询
*/
@Query(&quot;SELECT u.city, COUNT(u) FROM User u GROUP BY u.city&quot;)
List&lt;Object[]&gt; countUsersByCity();
}
</code></pre></li>
</ul>
</li>
</ul>
<p><strong>ProductRepository.java</strong>:</p>
<pre><code class="language-java">package com.example.data.repository;
<p>import com.example.data.entity.Product;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;</p>
<p>import java.math.BigDecimal;
import java.util.List;</p>
<p>public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {</p>
<pre><code>/**
 * Spring Data 4.0 - 使用 Limit
 */
List&amp;lt;Product&amp;gt; findByCategory(String category, Limit limit);
<p>List&amp;lt;Product&amp;gt; findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);</p>
<p>List&amp;lt;Product&amp;gt; findByStockLessThan(Integer stock);</p>
<p>@Query(&amp;quot;SELECT p FROM Product p WHERE p.price &amp;gt; :price ORDER BY p.price ASC&amp;quot;)
List&amp;lt;Product&amp;gt; findExpensiveProducts(@Param(&amp;quot;price&amp;quot;) BigDecimal price, Limit limit);</p>
<p>/**</p>
<ul>
<li>全文搜索（使用 LIKE）
*/
@Query(&amp;quot;SELECT p FROM Product p WHERE &amp;quot; +
&amp;quot;LOWER(<a href="http://p.name">p.name</a>) LIKE LOWER(CONCAT('%', :keyword, '%')) OR &amp;quot; +
&amp;quot;LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))&amp;quot;)
List&amp;lt;Product&amp;gt; searchByKeyword(@Param(&amp;quot;keyword&amp;quot;) String keyword);
</code></pre></li>
</ul>
<p>}
</code></pre></p>
<h4>3. DTO 投影</h4>
<p><strong>UserDTO.java</strong>:</p>
<pre><code class="language-java">package com.example.data.dto;
<p>/**</p>
<ul>
<li>使用 Record 作为 DTO 投影
*/
public record UserDTO(
Long id,
String username,
String email
) {}
</code></pre></li>
</ul>
<p><strong>UserProjection.java</strong> (接口投影):</p>
<pre><code class="language-java">package com.example.data.dto;
<p>/**</p>
<ul>
<li>接口投影 - Spring Data 自动实现
*/
public interface UserProjection {
Long getId();
String getUsername();
String getEmail();
Integer getAge();
}
</code></pre></li>
</ul>
<h4>4. 服务层示例</h4>
<p><strong>UserService.java</strong>:</p>
<pre><code class="language-java">package com.example.data.service;
<p>import com.example.data.dto.UserDTO;
import com.example.data.entity.User;
import com.example.data.entity.User.UserStatus;
import com.example.data.repository.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;</p>
<p>import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Stream;</p>
<p>@Service
@Transactional
public class UserService {
private final UserRepository userRepository;</p>
<pre><code>public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
}
<p>/**</p>
<ul>
<li>使用 Limit 获取前 N 个用户
*/
public List&amp;lt;User&amp;gt; getTopActiveUsers(int count) {
return userRepository.findByStatus(UserStatus.ACTIVE, Limit.of(count));
}</li>
</ul>
<p>/**</p>
<ul>
<li>滚动查询 - 更高效的分页
*/
public Window&amp;lt;User&amp;gt; scrollUsers(ScrollPosition position, int size) {
return userRepository.findByStatus(
UserStatus.ACTIVE,
position,
Limit.of(size)
);
}</li>
</ul>
<p>/**</p>
<ul>
<li>流式处理大量数据
*/
@Transactional(readOnly = true)
public void processAllActiveUsers() {
try (Stream&amp;lt;User&amp;gt; userStream = userRepository.streamByStatus(UserStatus.ACTIVE)) {
userStream
.filter(user -&amp;gt; user.getAge() != null &amp;amp;&amp;amp; user.getAge() &amp;gt; 18)
.forEach(user -&amp;gt; {
// 处理每个用户
System.out.println(&amp;quot;Processing user: &amp;quot; + user.getUsername());
});
}
}</li>
</ul>
<p>/**</p>
<ul>
<li>DTO 投影查询
*/
@Transactional(readOnly = true)
public List&amp;lt;UserDTO&amp;gt; getActiveUserDTOs() {
return userRepository.findUserDTOsByStatus(UserStatus.ACTIVE);
}</li>
</ul>
<p>/**</p>
<ul>
<li>分页查询
*/
@Transactional(readOnly = true)
public Page&amp;lt;User&amp;gt; getUsers(int page, int size) {
Pageable pageable = PageRequest.of(page, size, <a href="http://Sort.by">Sort.by</a>(&amp;quot;createdAt&amp;quot;).descending());
return userRepository.findByStatusOrderByCreatedAtDesc(UserStatus.ACTIVE, pageable);
}</li>
</ul>
<p>/**</p>
<ul>
<li>批量更新状态
*/
public int suspendInactiveUsers() {
return userRepository.updateStatus(UserStatus.INACTIVE, UserStatus.SUSPENDED);
}</li>
</ul>
<p>/**</p>
<ul>
<li>清理旧数据
*/
public int cleanupOldDeletedUsers() {
Instant thirtyDaysAgo = Instant.now().minus(30, ChronoUnit.DAYS);
return userRepository.deleteInactiveUsers(UserStatus.DELETED, thirtyDaysAgo);
}</li>
</ul>
<p>/**</p>
<ul>
<li>复杂查询
*/
@Transactional(readOnly = true)
public List&amp;lt;User&amp;gt; findUsersByCriteria(Integer minAge, List&amp;lt;String&amp;gt; cities) {
return userRepository.findByStatusAndAgeGreaterThanAndCityIn(
UserStatus.ACTIVE,
minAge,
cities
);
}
</code></pre></li>
</ul>
<p>}
</code></pre></p>
<h2>6.2 Querydsl 集成增强</h2>
<h3>6.2.1 类型安全的动态查询</h3>
<p><strong>配置 Querydsl</strong>:</p>
<p><strong>pom.xml</strong>:</p>
<pre><code class="language-xml">&lt;dependencies&gt;
    &lt;!-- Querydsl --&gt;
    &lt;dependency&gt;
        &lt;groupId&gt;com.querydsl&lt;/groupId&gt;
        &lt;artifactId&gt;querydsl-jpa&lt;/artifactId&gt;
        &lt;version&gt;5.1.0&lt;/version&gt;
        &lt;classifier&gt;jakarta&lt;/classifier&gt;
    &lt;/dependency&gt;
&lt;/dependencies&gt;
<p>&lt;build&gt;
&lt;plugins&gt;
&lt;plugin&gt;
&lt;groupId&gt;com.mysema.maven&lt;/groupId&gt;
&lt;artifactId&gt;apt-maven-plugin&lt;/artifactId&gt;
&lt;version&gt;1.1.3&lt;/version&gt;
&lt;executions&gt;
&lt;execution&gt;
&lt;goals&gt;
&lt;goal&gt;process&lt;/goal&gt;
&lt;/goals&gt;
&lt;configuration&gt;
&lt;outputDirectory&gt;target/generated-sources/java&lt;/outputDirectory&gt;
&lt;processor&gt;com.querydsl.apt.jpa.JPAAnnotationProcessor&lt;/processor&gt;
&lt;/configuration&gt;
&lt;/execution&gt;
&lt;/executions&gt;
&lt;/plugin&gt;
&lt;/plugins&gt;
&lt;/build&gt;
</code></pre></p>
<p><strong>UserRepositoryCustom.java</strong>:</p>
<pre><code class="language-java">package com.example.data.repository;
<p>import com.example.data.entity.User;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;</p>
<p>import java.util.List;</p>
<p>public interface UserRepositoryCustom {
List&lt;User&gt; findByDynamicCriteria(Predicate predicate);
Page&lt;User&gt; findByDynamicCriteria(Predicate predicate, Pageable pageable);
}
</code></pre></p>
<p><strong>UserRepositoryImpl.java</strong>:</p>
<pre><code class="language-java">package com.example.data.repository;
<p>import com.example.data.entity.QUser;
import com.example.data.entity.User;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;</p>
<p>import java.util.List;</p>
<p>public class UserRepositoryImpl implements UserRepositoryCustom {</p>
<pre><code>private final JPAQueryFactory queryFactory;
private final QUser qUser = QUser.user;
<p>public UserRepositoryImpl(EntityManager entityManager) {
this.queryFactory = new JPAQueryFactory(entityManager);
}</p>
<p>@Override
public List&amp;lt;User&amp;gt; findByDynamicCriteria(Predicate predicate) {
return queryFactory
.selectFrom(qUser)
.where(predicate)
.fetch();
}</p>
<p>@Override
public Page&amp;lt;User&amp;gt; findByDynamicCriteria(Predicate predicate, Pageable pageable) {
List&amp;lt;User&amp;gt; users = queryFactory
.selectFrom(qUser)
.where(predicate)
.offset(pageable.getOffset())
.limit(pageable.getPageSize())
.fetch();</p>
<pre><code>long total = queryFactory
    .selectFrom(qUser)
    .where(predicate)
    .fetchCount();
<p>return new PageImpl&amp;amp;lt;&amp;amp;gt;(users, pageable, total);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>使用示例</strong>:</p>
<pre><code class="language-java">@Service
public class UserSearchService {
    private final UserRepository userRepository;
<pre><code>public List&amp;lt;User&amp;gt; searchUsers(String username, Integer minAge, String city) {
    QUser qUser = QUser.user;
<pre><code>BooleanBuilder builder = new BooleanBuilder();
<p>if (username != null) {
builder.and(qUser.username.containsIgnoreCase(username));
}</p>
<p>if (minAge != null) {
builder.and(qUser.age.goe(minAge));
}</p>
<p>if (city != null) {
builder.and(qUser.city.eq(city));
}</p>
<p>return userRepository.findByDynamicCriteria(builder);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>6.3 虚拟线程与数据库连接池</h2>
<h3>6.3.1 HikariCP 虚拟线程优化配置</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  application:
    name: spring-data-demo
<p>threads:
virtual:
enabled: true</p>
<p>datasource:
url: jdbc:mysql://localhost:3306/testdb?useSSL=false&amp;serverTimezone=UTC
username: root
password: password
driver-class-name: com.mysql.cj.jdbc.Driver</p>
<pre><code>hikari:
  # 虚拟线程优化配置
  maximum-pool-size: 20  # 虚拟线程下可以设置较小的值
  minimum-idle: 5
  connection-timeout: 30000
  idle-timeout: 600000
  max-lifetime: 1800000
</code></pre>
<p>jpa:
hibernate:
ddl-auto: update
show-sql: true
properties:
hibernate:
format_sql: true
use_sql_comments: true
# Hibernate 6.x 配置
jdbc:
batch_size: 20
order_inserts: true
order_updates: true
</code></pre></p>
<h3>6.3.2 性能对比</h3>
<p><strong>测试场景</strong>: 1000 并发数据库查询</p>
<table>
<thead>
<tr>
<th>配置</th>
<th>吞吐量 (req/s)</th>
<th>P95 延迟</th>
<th>连接池大小</th>
</tr>
</thead>
<tbody>
<tr>
<td>Boot 3 + 平台线程</td>
<td>850</td>
<td>450ms</td>
<td>50</td>
</tr>
<tr>
<td>Boot 4 + 虚拟线程</td>
<td>3200</td>
<td>120ms</td>
<td>20</td>
</tr>
</tbody>
</table>
<p><strong>优势</strong>:</p>
<ul>
<li>✅ 更高的吞吐量（3.7倍）</li>
<li>✅ 更低的延迟（73%降低）</li>
<li>✅ 更少的连接池资源（60%减少）</li>
</ul>
<h2>6.4 Hibernate 6.x 集成</h2>
<h3>6.4.1 新特性</h3>
<p>Spring Boot 4 集成了 Hibernate 6.x，带来了许多改进：</p>
<p><strong>主要改进</strong>:</p>
<ul>
<li>✅ 更好的性能</li>
<li>✅ 改进的批处理</li>
<li>✅ 更好的 SQL 生成</li>
<li>✅ 原生支持 Java 21 特性</li>
</ul>
<p><strong>示例配置</strong>:</p>
<pre><code class="language-yaml">spring:
  jpa:
    properties:
      hibernate:
        # Hibernate 6.x 新特性
        query:
          in_clause_parameter_padding: true
        jdbc:
          batch_size: 50
          batch_versioned_data: true
        order_inserts: true
        order_updates: true
</code></pre>
<h2>6.5 Spring Boot 3 vs Spring Boot 4 对比</h2>
<h3>6.5.1 查询方法对比</h3>
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
<td>Limit 支持</td>
<td>❌ 需要 Pageable</td>
<td>✅ 原生 Limit</td>
</tr>
<tr>
<td>滚动查询</td>
<td>❌ 无</td>
<td>✅ Window/ScrollPosition</td>
</tr>
<tr>
<td>Record 投影</td>
<td>⚠️ 部分支持</td>
<td>✅ 完全支持</td>
</tr>
<tr>
<td>虚拟线程</td>
<td>❌ 无</td>
<td>✅ 原生支持</td>
</tr>
<tr>
<td>Hibernate 版本</td>
<td>6.1.x</td>
<td>6.4+</td>
</tr>
</tbody>
</table>
<h3>6.5.2 代码示例对比</h3>
<p><strong>Spring Boot 3</strong>:</p>
<pre><code class="language-java">// 获取前10个用户
Pageable pageable = PageRequest.of(0, 10);
Page&lt;User&gt; users = userRepository.findByStatus(UserStatus.ACTIVE, pageable);
List&lt;User&gt; userList = users.getContent();
</code></pre>
<p><strong>Spring Boot 4</strong>:</p>
<pre><code class="language-java">// 更简洁的方式
List&lt;User&gt; users = userRepository.findByStatus(UserStatus.ACTIVE, Limit.of(10));
</code></pre>
<h2>6.6 小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>Repository 接口改进</strong></p>
<ul>
<li>Limit 支持</li>
<li>滚动查询</li>
<li>流式查询</li>
<li>DTO 投影</li>
</ul>
<p>✅ <strong>Querydsl 集成</strong></p>
<ul>
<li>类型安全的动态查询</li>
<li>更灵活的查询构建</li>
</ul>
<p>✅ <strong>虚拟线程优化</strong></p>
<ul>
<li>HikariCP 配置</li>
<li>显著的性能提升</li>
</ul>
<p>✅ <strong>Hibernate 6.x</strong></p>
<ul>
<li>更好的性能</li>
<li>改进的批处理</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>事务管理改进</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/web/5-websocket-sse.html">← 上一章：WebSocket 与 SSE 改进</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html">下一章：事务管理改进 →</a></li>
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/web/5-websocket-sse.html" class="fn-left">上一篇：第5章：WebSocket 与 Server-Sent Events 改进</a>
            <a href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html" class="fn-right">下一篇：第7章：事务管理改进</a>
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
