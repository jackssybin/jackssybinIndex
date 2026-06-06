---
title: 第8章：Spring Security 7.0 新特性
description: "第8章：Spring Security 7.0 新特性 本章概述 Spring Security 7.0 是 Spring Boot
  4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。 本章重点 : ✅ 配置 DSL 简化 ✅ OAuth2 客户端改进
  ✅ 方法安全性增强 ✅ 密码编码器更新 ✅ 与 Spring Boo..."
url: /springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html
layout: tutorial
kind: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 80
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第8章：Spring Security 7.0 新特性

## 本章概述

Spring Security 7.0 是 Spring Boot 4 的重要组成部分，带来了更简洁的配置、改进的 OAuth2 支持、增强的方法安全性等。

**本章重点**:
- ✅ 配置 DSL 简化
- ✅ OAuth2 客户端改进
- ✅ 方法安全性增强
- ✅ 密码编码器更新
- ✅ 与 Spring Boot 3 的对比

## 8.1 配置 DSL 简化

### 8.1.1 新的安全配置写法

Spring Security 7.0 简化了配置 DSL，使其更加简洁和类型安全。

#### Spring Boot 3 方式

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .permitAll()
                .and()
            .logout()
                .permitAll();
        
        return http.build();
    }
}
```

#### Spring Boot 4 方式（推荐）

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .permitAll()
            )
            .logout(logout -> logout
                .permitAll()
            );
        
        return http.build();
    }
}
```

### 8.1.2 完整的安全配置案例

#### 项目结构
```
security-demo/
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
```

#### 1. 实体类

**User.java**:
```java
package com.example.security.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private boolean enabled = true;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    @Column(name = "created_at")
    private Instant createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    
    public Instant getCreatedAt() { return createdAt; }
}
```

**Role.java**:
```java
package com.example.security.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private RoleName name;
    
    public enum RoleName {
        ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public RoleName getName() { return name; }
    public void setName(RoleName name) { this.name = name; }
}
```

#### 2. 安全配置

**SecurityConfig.java**:
```java
package com.example.security.config;

import org.springframework.context.annotation.Bean;
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
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 7.0 配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final UserDetailsService userDetailsService;
    
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
    
    /**
     * Spring Boot 4 - 简化的安全配置
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 配置
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/auth/**")
            )
            
            // 授权配置
            .authorizeHttpRequests(auth -> auth
                // 公开端点
                .requestMatchers("/api/auth/**", "/api/public/**").permitAll()
                
                // 管理员端点
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // 用户端点
                .requestMatchers("/api/users/**").hasAnyRole("USER", "ADMIN")
                
                // 其他请求需要认证
                .anyRequest().authenticated()
            )
            
            // 表单登录
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/api/auth/login")
                .defaultSuccessUrl("/dashboard")
                .failureUrl("/login?error=true")
                .permitAll()
            )
            
            // HTTP Basic 认证
            .httpBasic(basic -> {})
            
            // 登出配置
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            
            // Session 管理
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            );
        
        return http.build();
    }
    
    /**
     * 密码编码器 - 使用 BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    /**
     * 认证提供者
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    /**
     * 认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

#### 3. UserDetailsService 实现

**UserDetailsServiceImpl.java**:
```java
package com.example.security.service;

import com.example.security.entity.User;
import com.example.security.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final UserRepository userRepository;
    
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) 
            throws UsernameNotFoundException {
        
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                "User not found: " + username));
        
        Set<GrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
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
    }
}
```

## 8.2 OAuth2 客户端改进

### 8.2.1 简化的 OAuth2 登录配置

**application.yml**:
```yaml
spring:
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
          
          github:
            client-id: ${GITHUB_CLIENT_ID}
            client-secret: ${GITHUB_CLIENT_SECRET}
            scope:
              - user:email
              - read:user
```

**OAuth2SecurityConfig.java**:
```java
package com.example.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class OAuth2SecurityConfig {
    
    @Bean
    public SecurityFilterChain oauth2FilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/login/**", "/error").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
                .failureUrl("/login?error=true")
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/")
                .permitAll()
            );
        
        return http.build();
    }
}
```

## 8.3 方法安全性增强

### 8.3.1 @PreAuthorize 新特性

**MethodSecurityConfig.java**:
```java
package com.example.security.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * Spring Security 7.0 - 方法安全配置
 */
@Configuration
@EnableMethodSecurity(
    prePostEnabled = true,
    securedEnabled = true,
    jsr250Enabled = true
)
public class MethodSecurityConfig {
}
```

**UserService.java**:
```java
package com.example.security.service;

import com.example.security.entity.User;
import com.example.security.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    /**
     * 只有 ADMIN 可以访问
     */
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * 用户只能访问自己的信息
     */
    @PreAuthorize("#username == authentication.principal.username or hasRole('ADMIN')")
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * 后置授权 - 检查返回结果
     */
    @PostAuthorize("returnObject.username == authentication.principal.username or hasRole('ADMIN')")
    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    /**
     * 复杂的权限表达式
     */
    @PreAuthorize("hasRole('ADMIN') or (#userId == authentication.principal.id and hasRole('USER'))")
    public void updateUser(Long userId, User user) {
        // 更新用户逻辑
    }
    
    /**
     * 使用自定义权限检查器
     */
    @PreAuthorize("@userPermissionEvaluator.canModifyUser(authentication, #userId)")
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
```

**自定义权限评估器**:
```java
package com.example.security.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("userPermissionEvaluator")
public class UserPermissionEvaluator {
    
    public boolean canModifyUser(Authentication authentication, Long userId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        // 管理员可以修改任何用户
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return true;
        }
        
        // 用户只能修改自己
        // 这里需要从 authentication 中获取用户ID进行比较
        return false;
    }
}
```

## 8.4 密码编码器更新

### 8.4.1 新的密码哈希算法支持

**PasswordEncoderConfig.java**:
```java
package com.example.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class PasswordEncoderConfig {
    
    /**
     * Spring Security 7.0 - 支持多种密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        String encodingId = "bcrypt";
        
        Map<String, PasswordEncoder> encoders = new HashMap<>();
        encoders.put("bcrypt", new BCryptPasswordEncoder());
        encoders.put("argon2", Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8());
        encoders.put("pbkdf2", Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8());
        encoders.put("scrypt", SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8());
        
        return new DelegatingPasswordEncoder(encodingId, encoders);
    }
}
```

## 8.5 JWT 认证示例

### 8.5.1 JWT 工具类

**JwtUtils.java**:
```java
package com.example.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration:86400000}")  // 24 hours
    private long jwtExpiration;
    
    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
            .setSubject(userPrincipal.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(key, SignatureAlgorithm.HS512)
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean validateToken(String token) {
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
}
```

## 8.6 Spring Boot 3 vs Spring Boot 4 对比

### 8.6.1 配置对比

| 特性 | Spring Boot 3 | Spring Boot 4 |
|------|---------------|---------------|
| 配置 DSL | `.and()` 链式 | Lambda 表达式 |
| OAuth2 配置 | 复杂 | 简化 |
| 方法安全 | @EnableGlobalMethodSecurity | @EnableMethodSecurity |
| 密码编码 | BCrypt 为主 | 多种算法支持 |
| JWT 支持 | 需要额外配置 | 更好的集成 |

## 8.7 小结

本章我们学习了：

✅ **配置 DSL 简化**
- Lambda 表达式配置
- 更简洁的代码

✅ **OAuth2 改进**
- 简化的配置
- 更好的第三方登录支持

✅ **方法安全性**
- @PreAuthorize/@PostAuthorize
- 自定义权限评估器

✅ **密码编码器**
- 多种算法支持
- 更安全的密码存储

### 下一步

下一章我们将学习 **Micrometer 与 Observability**。

---

**导航**:
- [← 上一章：事务管理改进](/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html)
- [返回目录](/springboot4.html)
- [下一章：Micrometer 与 Observability →](/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html)
