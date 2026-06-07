---
title: 第16章：废弃 API 与替代方案
description: "第16章：废弃 API 与替代方案 本章概述 本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。
  本章重点 : ✅ 已移除的功能清单 ✅ 废弃的配置属性 ✅ 依赖版本变更 ✅ 替代方案详解 16.1 已移除的功能 16.1.1 Web 相关 已移除
  API 替代方案 说明 RestTemplate HTTP Interface /..."
url: /springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html
layout: tutorial
contentType: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 160
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第16章：废弃 API 与替代方案

## 本章概述

本章列出 Spring Boot 4 中废弃和移除的 API，并提供替代方案。

**本章重点**:
- ✅ 已移除的功能清单
- ✅ 废弃的配置属性
- ✅ 依赖版本变更
- ✅ 替代方案详解

## 16.1 已移除的功能

### 16.1.1 Web 相关

| 已移除 API | 替代方案 | 说明 |
|-----------|---------|------|
| **RestTemplate** | HTTP Interface / WebClient | 已废弃，建议迁移 |
| **WebSecurityConfigurerAdapter** | SecurityFilterChain | 已在 Boot 3 中移除 |

**迁移示例**:

**旧代码 (RestTemplate)**:
```java
@Service
public class UserService {
    private final RestTemplate restTemplate;
    
    public User getUser(Long id) {
        return restTemplate.getForObject(
            "http://user-service/users/" + id,
            User.class
        );
    }
}
```

**新代码 (HTTP Interface)**:
```java
public interface UserClient {
    @GetExchange("/users/{id}")
    User getUser(@PathVariable Long id);
}

@Service
public class UserService {
    private final UserClient userClient;
    
    public User getUser(Long id) {
        return userClient.getUser(id);
    }
}
```

### 16.1.2 Security 相关

**旧代码**:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/public/**").permitAll()
            .anyRequest().authenticated();
    }
}
```

**新代码**:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated()
        );
        return http.build();
    }
}
```

### 16.1.3 方法安全

| 旧注解 | 新注解 | 说明 |
|--------|--------|------|
| @EnableGlobalMethodSecurity | @EnableMethodSecurity | 新注解更简洁 |

**迁移**:
```java
// 旧代码
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class MethodSecurityConfig {}

// 新代码
@EnableMethodSecurity
public class MethodSecurityConfig {}
```

## 16.2 废弃的配置属性

### 16.2.1 配置属性对照表

| 旧属性 (Boot 3) | 新属性 (Boot 4) | 说明 |
|----------------|----------------|------|
| `spring.datasource.initialization-mode` | `spring.sql.init.mode` | 数据库初始化 |
| `spring.jpa.hibernate.use-new-id-generator-mappings` | 已移除 | 默认行为 |
| `spring.mvc.throw-exception-if-no-handler-found` | `spring.mvc.problemdetails.enabled` | 错误处理 |

**迁移示例**:

**旧配置**:
```yaml
spring:
  datasource:
    initialization-mode: always
  jpa:
    hibernate:
      use-new-id-generator-mappings: true
  mvc:
    throw-exception-if-no-handler-found: true
```

**新配置**:
```yaml
spring:
  sql:
    init:
      mode: always
  mvc:
    problemdetails:
      enabled: true
  threads:
    virtual:
      enabled: true  # 新增
```

## 16.3 依赖版本变更

### 16.3.1 主要依赖升级

| 依赖 | Boot 3 版本 | Boot 4 版本 | 重大变更 |
|------|------------|------------|---------|
| Spring Framework | 6.1.x | 7.0.x | 虚拟线程支持 |
| Hibernate | 6.1.x | 6.4.x | 性能改进 |
| Tomcat | 10.1.x | 11.0.x | Jakarta EE 10 |
| Jackson | 2.15.x | 2.16.x | Record 支持改进 |

### 16.3.2 处理依赖冲突

**排除旧版本**:
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>some-library</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## 16.4 Data 访问变更

### 16.4.1 Repository 方法

**新增方法**:
```java
// 使用 Limit
List<User> findByStatus(UserStatus status, Limit limit);

// 滚动查询
Window<User> findByStatus(UserStatus status, ScrollPosition position, Limit limit);
```

**废弃方法**: 无，保持向后兼容

## 16.5 完整迁移清单

### 16.5.1 代码迁移

- [ ] 替换 RestTemplate 为 HTTP Interface
- [ ] 更新 Security 配置为 Lambda DSL
- [ ] 替换 @EnableGlobalMethodSecurity
- [ ] 更新数据访问代码使用新 API

### 16.5.2 配置迁移

- [ ] 更新 application.yml 配置属性
- [ ] 启用虚拟线程
- [ ] 配置 Problem Details
- [ ] 更新数据库初始化配置

### 16.5.3 依赖迁移

- [ ] 升级 Spring Boot 版本到 4.0
- [ ] 升级 JDK 到 21
- [ ] 检查第三方库兼容性
- [ ] 解决依赖冲突

## 16.6 小结

✅ **已移除功能**
- RestTemplate（使用 HTTP Interface）
- WebSecurityConfigurerAdapter（使用 SecurityFilterChain）

✅ **配置属性变更**
- 数据库初始化配置
- 错误处理配置

✅ **依赖升级**
- Spring Framework 7.0
- Hibernate 6.4
- Tomcat 11.0

---

**导航**:
- [← 上一章](/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html)
- [返回目录](/springboot4.html)
- [下一章 →](/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html)
