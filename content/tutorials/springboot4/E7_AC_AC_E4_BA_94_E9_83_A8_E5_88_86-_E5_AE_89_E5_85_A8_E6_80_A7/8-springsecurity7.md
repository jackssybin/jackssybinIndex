---
title: "第8章：Spring Security 7.0 新特性"
permalink: "/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html"
description: "第8章：Spring Security 7.0 新特性 本章概述 Spring Security 7.0 是 Spring Boot 4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。 本章重点: ✅ 配置 DSL 简化 ✅ OAuth2 客户端改进 ✅ 方法安全性增强 ✅ 密码编码器更新 ✅ 与 Spring Boot..."
---

<h1>第8章：Spring Security 7.0 新特性</h1>
<h2>本章概述</h2>
<p>Spring Security 7.0 是 Spring Boot 4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ 配置 DSL 简化</li>
<li>✅ OAuth2 客户端改进</li>
<li>✅ 方法安全性增强</li>
<li>✅ 密码编码器更新</li>
<li>✅ 与 Spring Boot 3 的对比</li>
</ul>
<h2>8.1 配置 DSL 简化</h2>
<h3>8.1.1 新的安全配置写法</h3>
<p>Spring Security 7.0 简化了配置 DSL，使其更加简洁和类型安全。</p>
<h4>Spring Boot 3 方式</h4>
<pre><code class="language-java">@Configuration
@EnableWebSecurity
public class SecurityConfig {
<pre><code>@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests()
            .requestMatchers(&amp;quot;/public/**&amp;quot;).permitAll()
            .requestMatchers(&amp;quot;/admin/**&amp;quot;).hasRole(&amp;quot;ADMIN&amp;quot;)
            .anyRequest().authenticated()
            .and()
        .formLogin()
            .loginPage(&amp;quot;/login&amp;quot;)
            .permitAll()
            .and()
        .logout()
            .permitAll();
<pre><code>return http.build();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h4>Spring Boot 4 方式（推荐）</h4>
<pre><code class="language-java">@Configuration
@EnableWebSecurity
public class SecurityConfig {
<pre><code>@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -&amp;gt; auth
            .requestMatchers(&amp;quot;/public/**&amp;quot;).permitAll()
            .requestMatchers(&amp;quot;/admin/**&amp;quot;).hasRole(&amp;quot;ADMIN&amp;quot;)
            .anyRequest().authenticated()
        )
        .formLogin(form -&amp;gt; form
            .loginPage(&amp;quot;/login&amp;quot;)
            .permitAll()
        )
        .logout(logout -&amp;gt; logout
            .permitAll()
        );
<pre><code>return http.build();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>8.1.2 完整的安全配置案例</h3>
<h4>项目结构</h4>
<pre><code>security-demo/
├── src/main/java/com/example/security/
│   ├── SecurityApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── MethodSecurityConfig.java
│   ├── entity/
│   │   ├── User.java
│   │   └── Role.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── service/
│   │   ├── UserDetailsServiceImpl.java
│   │   └── UserService.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   └── AdminController.java
│   └── dto/
│       ├── LoginRequest.java
│       └── RegisterRequest.java
</code></pre>
<h4>1. 实体类</h4>
<p><strong>User.java</strong>:</p>
<pre><code class="language-java">package com.example.security.entity;
<p>import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;</p>
<p>@Entity
@Table(name = &quot;users&quot;)
public class User {</p>
<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
<p>@Column(nullable = false, unique = true)
private String username;</p>
<p>@Column(nullable = false, unique = true)
private String email;</p>
<p>@Column(nullable = false)
private String password;</p>
<p>@Column(nullable = false)
private boolean enabled = true;</p>
<p>@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(
name = &amp;quot;user_roles&amp;quot;,
joinColumns = @JoinColumn(name = &amp;quot;user_id&amp;quot;),
inverseJoinColumns = @JoinColumn(name = &amp;quot;role_id&amp;quot;)
)
private Set&amp;lt;Role&amp;gt; roles = new HashSet&amp;lt;&amp;gt;();</p>
<p>@Column(name = &amp;quot;created_at&amp;quot;)
private Instant createdAt;</p>
<p>@PrePersist
protected void onCreate() {
createdAt = Instant.now();
}</p>
<p>// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { <a href="http://this.id">this.id</a> = id; }</p>
<p>public String getUsername() { return username; }
public void setUsername(String username) { this.username = username; }</p>
<p>public String getEmail() { return email; }
public void setEmail(String email) { this.email = email; }</p>
<p>public String getPassword() { return password; }
public void setPassword(String password) { this.password = password; }</p>
<p>public boolean isEnabled() { return enabled; }
public void setEnabled(boolean enabled) { this.enabled = enabled; }</p>
<p>public Set&amp;lt;Role&amp;gt; getRoles() { return roles; }
public void setRoles(Set&amp;lt;Role&amp;gt; roles) { this.roles = roles; }</p>
<p>public Instant getCreatedAt() { return createdAt; }
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>Role.java</strong>:</p>
<pre><code class="language-java">package com.example.security.entity;
<p>import jakarta.persistence.*;</p>
<p>@Entity
@Table(name = &quot;roles&quot;)
public class Role {</p>
<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
<p>@Enumerated(EnumType.STRING)
@Column(nullable = false, unique = true)
private RoleName name;</p>
<p>public enum RoleName {
ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR
}</p>
<p>// Getters and Setters
public Long getId() { return id; }
public void setId(Long id) { <a href="http://this.id">this.id</a> = id; }</p>
<p>public RoleName getName() { return name; }
public void setName(RoleName name) { <a href="http://this.name">this.name</a> = name; }
</code></pre></p>
<p>}
</code></pre></p>
<h4>2. 安全配置</h4>
<p><strong>SecurityConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.security.config;
<p>import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Security 7.0 配置
*/
@Configuration
@EnableWebSecurity
public class SecurityConfig {</p>
<p>private final UserDetailsService userDetailsService;</p>
<p>public SecurityConfig(UserDetailsService userDetailsService) {
this.userDetailsService = userDetailsService;
}</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - 简化的安全配置
*/
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
http
// CSRF 配置
.csrf(csrf -&gt; csrf
.ignoringRequestMatchers(&quot;/api/auth/**&quot;)
)</p>
<pre><code> // 授权配置
 .authorizeHttpRequests(auth -&amp;gt; auth
     // 公开端点
     .requestMatchers(&amp;quot;/api/auth/**&amp;quot;, &amp;quot;/api/public/**&amp;quot;).permitAll()
<pre><code> // 管理员端点
 .requestMatchers(&amp;amp;quot;/api/admin/**&amp;amp;quot;).hasRole(&amp;amp;quot;ADMIN&amp;amp;quot;)
 
 // 用户端点
 .requestMatchers(&amp;amp;quot;/api/users/**&amp;amp;quot;).hasAnyRole(&amp;amp;quot;USER&amp;amp;quot;, &amp;amp;quot;ADMIN&amp;amp;quot;)
 
 // 其他请求需要认证
 .anyRequest().authenticated()
</code></pre>
<p>)</p>
<p>// 表单登录
.formLogin(form -&amp;gt; form
.loginPage(&amp;quot;/login&amp;quot;)
.loginProcessingUrl(&amp;quot;/api/auth/login&amp;quot;)
.defaultSuccessUrl(&amp;quot;/dashboard&amp;quot;)
.failureUrl(&amp;quot;/login?error=true&amp;quot;)
.permitAll()
)</p>
<p>// HTTP Basic 认证
.httpBasic(basic -&amp;gt; {})</p>
<p>// 登出配置
.logout(logout -&amp;gt; logout
.logoutUrl(&amp;quot;/api/auth/logout&amp;quot;)
.logoutSuccessUrl(&amp;quot;/login?logout=true&amp;quot;)
.invalidateHttpSession(true)
.deleteCookies(&amp;quot;JSESSIONID&amp;quot;)
.permitAll()
)</p>
<p>// Session 管理
.sessionManagement(session -&amp;gt; session
.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
.maximumSessions(1)
.maxSessionsPreventsLogin(false)
);
</code></pre></p>
<p>return http.build();
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>密码编码器 - 使用 BCrypt
*/
@Bean
public PasswordEncoder passwordEncoder() {
return new BCryptPasswordEncoder();
}</li>
</ul>
<p>/**</p>
<ul>
<li>认证提供者
*/
@Bean
public DaoAuthenticationProvider authenticationProvider() {
DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
authProvider.setUserDetailsService(userDetailsService);
authProvider.setPasswordEncoder(passwordEncoder());
return authProvider;
}</li>
</ul>
<p>/**</p>
<ul>
<li>认证管理器
*/
@Bean
public AuthenticationManager authenticationManager(
AuthenticationConfiguration authConfig) throws Exception {
return authConfig.getAuthenticationManager();
}
}
</code></pre></li>
</ul>
</li>
</ul>
<h4>3. UserDetailsService 实现</h4>
<p><strong>UserDetailsServiceImpl.java</strong>:</p>
<pre><code class="language-java">package com.example.security.service;
<p>import com.example.security.entity.User;
import com.example.security.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;</p>
<p>import java.util.Set;
import java.util.stream.Collectors;</p>
<p>@Service
public class UserDetailsServiceImpl implements UserDetailsService {</p>
<pre><code>private final UserRepository userRepository;
<p>public UserDetailsServiceImpl(UserRepository userRepository) {
this.userRepository = userRepository;
}</p>
<p>@Override
@Transactional(readOnly = true)
public UserDetails loadUserByUsername(String username)
throws UsernameNotFoundException {</p>
<pre><code>User user = userRepository.findByUsername(username)
    .orElseThrow(() -&amp;amp;gt; new UsernameNotFoundException(
        &amp;amp;quot;User not found: &amp;amp;quot; + username));

Set&amp;amp;lt;GrantedAuthority&amp;amp;gt; authorities = user.getRoles().stream()
    .map(role -&amp;amp;gt; new SimpleGrantedAuthority(role.getName().name()))
    .collect(Collectors.toSet());

return org.springframework.security.core.userdetails.User
    .withUsername(user.getUsername())
    .password(user.getPassword())
    .authorities(authorities)
    .accountExpired(false)
    .accountLocked(false)
    .credentialsExpired(false)
    .disabled(!user.isEnabled())
    .build();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>8.2 OAuth2 客户端改进</h2>
<h3>8.2.1 简化的 OAuth2 登录配置</h3>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
<pre><code>      github:
        client-id: ${GITHUB_CLIENT_ID}
        client-secret: ${GITHUB_CLIENT_SECRET}
        scope:
          - user:email
          - read:user
</code></pre>
<p></code></pre></p>
<p><strong>OAuth2SecurityConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.security.config;
<p>import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;</p>
<p>@Configuration
public class OAuth2SecurityConfig {</p>
<pre><code>@Bean
public SecurityFilterChain oauth2FilterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -&amp;gt; auth
            .requestMatchers(&amp;quot;/&amp;quot;, &amp;quot;/login/**&amp;quot;, &amp;quot;/error&amp;quot;).permitAll()
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -&amp;gt; oauth2
            .loginPage(&amp;quot;/login&amp;quot;)
            .defaultSuccessUrl(&amp;quot;/dashboard&amp;quot;)
            .failureUrl(&amp;quot;/login?error=true&amp;quot;)
        )
        .logout(logout -&amp;gt; logout
            .logoutSuccessUrl(&amp;quot;/&amp;quot;)
            .permitAll()
        );
<pre><code>return http.build();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>8.3 方法安全性增强</h2>
<h3>8.3.1 @PreAuthorize 新特性</h3>
<p><strong>MethodSecurityConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.security.config;
<p>import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;</p>
<p>/**</p>
<ul>
<li>Spring Security 7.0 - 方法安全配置
*/
@Configuration
@EnableMethodSecurity(
prePostEnabled = true,
securedEnabled = true,
jsr250Enabled = true
)
public class MethodSecurityConfig {
}
</code></pre></li>
</ul>
<p><strong>UserService.java</strong>:</p>
<pre><code class="language-java">package com.example.security.service;
<p>import com.example.security.entity.User;
import com.example.security.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;</p>
<p>import java.util.List;</p>
<p>@Service
public class UserService {
private final UserRepository userRepository;</p>
<pre><code>public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
}
<p>/**</p>
<ul>
<li>只有 ADMIN 可以访问
*/
@PreAuthorize(&amp;quot;hasRole('ADMIN')&amp;quot;)
public List&amp;lt;User&amp;gt; getAllUsers() {
return userRepository.findAll();
}</li>
</ul>
<p>/**</p>
<ul>
<li>用户只能访问自己的信息
*/
@PreAuthorize(&amp;quot;#username == authentication.principal.username or hasRole('ADMIN')&amp;quot;)
public User getUserByUsername(String username) {
return userRepository.findByUsername(username)
.orElseThrow(() -&amp;gt; new RuntimeException(&amp;quot;User not found&amp;quot;));
}</li>
</ul>
<p>/**</p>
<ul>
<li>后置授权 - 检查返回结果
*/
@PostAuthorize(&amp;quot;returnObject.username == authentication.principal.username or hasRole('ADMIN')&amp;quot;)
public User getUserById(Long id) {
return userRepository.findById(id)
.orElseThrow(() -&amp;gt; new RuntimeException(&amp;quot;User not found&amp;quot;));
}</li>
</ul>
<p>/**</p>
<ul>
<li>复杂的权限表达式
*/
@PreAuthorize(&amp;quot;hasRole('ADMIN') or (#userId == <a href="http://authentication.principal.id">authentication.principal.id</a> and hasRole('USER'))&amp;quot;)
public void updateUser(Long userId, User user) {
// 更新用户逻辑
}</li>
</ul>
<p>/**</p>
<ul>
<li>使用自定义权限检查器
*/
@PreAuthorize(&amp;quot;@userPermissionEvaluator.canModifyUser(authentication, #userId)&amp;quot;)
public void deleteUser(Long userId) {
userRepository.deleteById(userId);
}
</code></pre></li>
</ul>
<p>}
</code></pre></p>
<p><strong>自定义权限评估器</strong>:</p>
<pre><code class="language-java">package com.example.security.service;
<p>import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;</p>
<p>@Component(&quot;userPermissionEvaluator&quot;)
public class UserPermissionEvaluator {</p>
<pre><code>public boolean canModifyUser(Authentication authentication, Long userId) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return false;
    }
<pre><code>// 管理员可以修改任何用户
if (authentication.getAuthorities().stream()
        .anyMatch(a -&amp;amp;gt; a.getAuthority().equals(&amp;amp;quot;ROLE_ADMIN&amp;amp;quot;))) {
    return true;
}

// 用户只能修改自己
// 这里需要从 authentication 中获取用户ID进行比较
return false;
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>8.4 密码编码器更新</h2>
<h3>8.4.1 新的密码哈希算法支持</h3>
<p><strong>PasswordEncoderConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.security.config;
<p>import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;</p>
<p>import java.util.HashMap;
import java.util.Map;</p>
<p>@Configuration
public class PasswordEncoderConfig {</p>
<pre><code>/**
 * Spring Security 7.0 - 支持多种密码编码器
 */
@Bean
public PasswordEncoder passwordEncoder() {
    String encodingId = &amp;quot;bcrypt&amp;quot;;
<pre><code>Map&amp;amp;lt;String, PasswordEncoder&amp;amp;gt; encoders = new HashMap&amp;amp;lt;&amp;amp;gt;();
encoders.put(&amp;amp;quot;bcrypt&amp;amp;quot;, new BCryptPasswordEncoder());
encoders.put(&amp;amp;quot;argon2&amp;amp;quot;, Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8());
encoders.put(&amp;amp;quot;pbkdf2&amp;amp;quot;, Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8());
encoders.put(&amp;amp;quot;scrypt&amp;amp;quot;, SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8());

return new DelegatingPasswordEncoder(encodingId, encoders);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h2>8.5 JWT 认证示例</h2>
<h3>8.5.1 JWT 工具类</h3>
<p><strong>JwtUtils.java</strong>:</p>
<pre><code class="language-java">package com.example.security.jwt;
<p>import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;</p>
<p>import javax.crypto.SecretKey;
import java.util.Date;</p>
<p>@Component
public class JwtUtils {</p>
<pre><code>@Value(&amp;quot;${app.jwt.secret}&amp;quot;)
private String jwtSecret;
<p>@Value(&amp;quot;${app.jwt.expiration:86400000}&amp;quot;)  // 24 hours
private long jwtExpiration;</p>
<p>public String generateToken(Authentication authentication) {
UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();</p>
<pre><code>SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

return Jwts.builder()
    .setSubject(userPrincipal.getUsername())
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
    .signWith(key, SignatureAlgorithm.HS512)
    .compact();
</code></pre>
<p>}</p>
<p>public String getUsernameFromToken(String token) {
SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());</p>
<pre><code>return Jwts.parserBuilder()
    .setSigningKey(key)
    .build()
    .parseClaimsJws(token)
    .getBody()
    .getSubject();
</code></pre>
<p>}</p>
<p>public boolean validateToken(String token) {
try {
SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
Jwts.parserBuilder()
.setSigningKey(key)
.build()
.parseClaimsJws(token);
return true;
} catch (JwtException | IllegalArgumentException e) {
return false;
}
}
</code></pre></p>
<p>}
</code></pre></p>
<h2>8.6 Spring Boot 3 vs Spring Boot 4 对比</h2>
<h3>8.6.1 配置对比</h3>
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
<td>配置 DSL</td>
<td><code>.and()</code> 链式</td>
<td>Lambda 表达式</td>
</tr>
<tr>
<td>OAuth2 配置</td>
<td>复杂</td>
<td>简化</td>
</tr>
<tr>
<td>方法安全</td>
<td>@EnableGlobalMethodSecurity</td>
<td>@EnableMethodSecurity</td>
</tr>
<tr>
<td>密码编码</td>
<td>BCrypt 为主</td>
<td>多种算法支持</td>
</tr>
<tr>
<td>JWT 支持</td>
<td>需要额外配置</td>
<td>更好的集成</td>
</tr>
</tbody>
</table>
<h2>8.7 小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>配置 DSL 简化</strong></p>
<ul>
<li>Lambda 表达式配置</li>
<li>更简洁的代码</li>
</ul>
<p>✅ <strong>OAuth2 改进</strong></p>
<ul>
<li>简化的配置</li>
<li>更好的第三方登录支持</li>
</ul>
<p>✅ <strong>方法安全性</strong></p>
<ul>
<li>@PreAuthorize/@PostAuthorize</li>
<li>自定义权限评估器</li>
</ul>
<p>✅ <strong>密码编码器</strong></p>
<ul>
<li>多种算法支持</li>
<li>更安全的密码存储</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>Micrometer 与 Observability</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html">← 上一章：事务管理改进</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html">下一章：Micrometer 与 Observability →</a></li>
</ul>
