---
title: 第17章：从 Spring Boot 3 迁移
description: "第17章：从 Spring Boot 3 迁移 本章概述 本章提供从 Spring Boot 3 迁移到 Spring Boot 4
  的完整指南，包括准备工作、迁移步骤和常见问题解决方案。 本章重点 : ✅ 迁移前准备 ✅ 分步迁移指南 ✅ 常见迁移问题 ✅ 迁移后验证 17.1
  迁移前准备 17.1.1 兼容性检查清单 环境要求 ✅ JDK 21 或更高版..."
url: /springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html
layout: tutorial
kind: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 170
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第17章：从 Spring Boot 3 迁移

## 本章概述

本章提供从 Spring Boot 3 迁移到 Spring Boot 4 的完整指南，包括准备工作、迁移步骤和常见问题解决方案。

**本章重点**:
- ✅ 迁移前准备
- ✅ 分步迁移指南
- ✅ 常见迁移问题
- ✅ 迁移后验证

## 17.1 迁移前准备

### 17.1.1 兼容性检查清单

#### 环境要求
- ✅ JDK 21 或更高版本
- ✅ Maven 3.9+ 或 Gradle 8.5+
- ✅ IDE 支持 Java 21

#### 依赖检查
```bash
# 检查依赖兼容性
./mvnw dependency:tree

# 查找过时的依赖
./mvnw versions:display-dependency-updates
```

### 17.1.2 评估清单

**必须检查的项目**:

| 检查项 | 说明 | 操作 |
|--------|------|------|
| Java 版本 | 必须 >= 21 | 升级 JDK |
| 废弃 API | 检查使用的废弃 API | 替换为新 API |
| 第三方库 | 检查兼容性 | 升级到兼容版本 |
| 配置属性 | 检查废弃的配置 | 更新配置 |
| 自定义配置 | 检查自动配置类 | 适配新版本 |

## 17.2 分步迁移指南

### 17.2.1 步骤 1: 升级 JDK

**Windows**:
```powershell
# 下载并安装 JDK 21
# 设置环境变量
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# 验证
java -version
```

**Linux/macOS**:
```bash
# 使用 SDKMAN
sdk install java 21-tem
sdk use java 21-tem

# 验证
java -version
```

### 17.2.2 步骤 2: 更新 pom.xml

**Spring Boot 3 版本**:
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
</parent>

<properties>
    <java.version>17</java.version>
</properties>
```

**Spring Boot 4 版本**:
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.0.0</version>
</parent>

<properties>
    <java.version>21</java.version>
</properties>
```

### 17.2.3 步骤 3: 更新配置

**application.yml 变更**:

```yaml
# Spring Boot 3
spring:
  mvc:
    throw-exception-if-no-handler-found: true

# Spring Boot 4 - 启用虚拟线程
spring:
  threads:
    virtual:
      enabled: true
  mvc:
    problemdetails:
      enabled: true  # 新增
```

### 17.2.4 步骤 4: 更新代码

#### Security 配置

**Spring Boot 3**:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
                .and()
            .formLogin();
        return http.build();
    }
}
```

**Spring Boot 4**:
```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.permitAll());
        return http.build();
    }
}
```

#### 数据访问

**Spring Boot 3**:
```java
// 获取前 10 条记录
Pageable pageable = PageRequest.of(0, 10);
Page<User> users = userRepository.findAll(pageable);
```

**Spring Boot 4**:
```java
// 使用 Limit
List<User> users = userRepository.findAll(Limit.of(10));
```

### 17.2.5 步骤 5: 更新测试

**JUnit 5 配置**:
```java
@SpringBootTest
class ApplicationTests {
    
    @Test
    void contextLoads() {
        // 验证应用启动
    }
    
    @Test
    void testVirtualThreads() {
        Thread thread = Thread.currentThread();
        assertTrue(thread.isVirtual(), "Should use virtual threads");
    }
}
```

## 17.3 常见迁移问题

### 17.3.1 问题 1: 编译错误

**问题**: 找不到某些类或方法

**原因**: API 已被移除或重命名

**解决方案**:
```java
// Spring Boot 3
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

// Spring Boot 4 - 已移除
// 使用 SecurityFilterChain 替代
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) {
    // 配置
}
```

### 17.3.2 问题 2: 配置属性失效

**问题**: 某些配置属性不再生效

**解决方案**:
```yaml
# Spring Boot 3
spring:
  datasource:
    initialization-mode: always

# Spring Boot 4
spring:
  sql:
    init:
      mode: always
```

### 17.3.3 问题 3: 依赖冲突

**问题**: 第三方库不兼容

**解决方案**:
```xml
<!-- 排除旧版本 -->
<dependency>
    <groupId>com.example</groupId>
    <artifactId>some-library</artifactId>
    <exclusions>
        <exclusion>
            <groupId>old-dependency</groupId>
            <artifactId>old-artifact</artifactId>
        </exclusion>
    </exclusions>
</dependency>

<!-- 添加兼容版本 -->
<dependency>
    <groupId>new-dependency</groupId>
    <artifactId>new-artifact</artifactId>
    <version>compatible-version</version>
</dependency>
```

### 17.3.4 问题 4: 性能问题

**问题**: 迁移后性能下降

**检查项**:
1. 虚拟线程是否启用
2. 数据库连接池配置
3. JVM 参数设置

**解决方案**:
```yaml
spring:
  threads:
    virtual:
      enabled: true

  datasource:
    hikari:
      maximum-pool-size: 20  # 虚拟线程下可以减小
```

## 17.4 迁移后验证

### 17.4.1 功能测试

**测试清单**:
```java
@SpringBootTest
class MigrationTests {
    
    @Test
    void testApplicationStarts() {
        // 验证应用启动
    }
    
    @Test
    void testVirtualThreadsEnabled() {
        assertTrue(Thread.currentThread().isVirtual());
    }
    
    @Test
    void testDatabaseConnection() {
        // 验证数据库连接
    }
    
    @Test
    void testSecurityConfiguration() {
        // 验证安全配置
    }
    
    @Test
    void testApiEndpoints() {
        // 验证 API 端点
    }
}
```

### 17.4.2 性能测试

**启动时间对比**:
```bash
# 测试启动时间
time java -jar target/myapp.jar

# 预期结果
# Spring Boot 3: ~2.5s
# Spring Boot 4: ~1.0s (60% 更快)
```

**压力测试**:
```bash
# 使用 Apache Bench
ab -n 10000 -c 100 http://localhost:8080/api/test

# 对比吞吐量和延迟
```

### 17.4.3 监控验证

**检查 Actuator**:
```bash
# 健康检查
curl http://localhost:8080/actuator/health

# 指标
curl http://localhost:8080/actuator/metrics

# 虚拟线程指标
curl http://localhost:8080/actuator/metrics/jvm.threads.virtual
```

## 17.5 回滚计划

### 17.5.1 准备回滚

**回滚步骤**:
1. 保留 Spring Boot 3 版本的分支
2. 准备回滚脚本
3. 备份数据库
4. 准备降级方案

**回滚命令**:
```bash
# Git 回滚
git checkout spring-boot-3-backup

# 重新构建
./mvnw clean package

# 部署旧版本
```

## 17.6 迁移最佳实践

### 17.6.1 推荐策略

1. **渐进式迁移**: 先在开发环境测试
2. **灰度发布**: 逐步切换生产流量
3. **监控告警**: 密切关注性能指标
4. **快速回滚**: 准备好回滚方案

### 17.6.2 迁移时间表

**建议时间表**:

| 阶段 | 时间 | 任务 |
|------|------|------|
| 准备 | 1-2 周 | 环境准备、依赖检查 |
| 开发环境 | 1 周 | 迁移和测试 |
| 测试环境 | 1-2 周 | 完整测试 |
| 预发布 | 1 周 | 灰度测试 |
| 生产环境 | 1 周 | 正式发布 |

## 17.7 完整迁移案例

### 17.7.1 实际项目迁移

**项目信息**:
- 应用类型: 微服务
- 代码量: 50,000 行
- 依赖数量: 30+

**迁移过程**:

```java
// 1. 更新 pom.xml
// 2. 升级 JDK 到 21
// 3. 更新配置文件
// 4. 修改 Security 配置
// 5. 更新数据访问代码
// 6. 运行测试
// 7. 性能测试
// 8. 部署验证
```

**迁移结果**:
- ✅ 启动时间: 2.8s → 1.1s (61% 提升)
- ✅ 吞吐量: 850 req/s → 3200 req/s (276% 提升)
- ✅ 内存占用: 256MB → 180MB (30% 降低)
- ✅ 迁移时间: 3 周

## 17.8 小结

本章我们学习了：

✅ **迁移准备**
- 兼容性检查
- 环境准备

✅ **迁移步骤**
- JDK 升级
- 依赖更新
- 代码修改

✅ **问题解决**
- 常见问题
- 解决方案

✅ **验证测试**
- 功能测试
- 性能测试
- 监控验证

### 下一步

下一章我们将学习 **微服务应用升级实战**。

---

**导航**:
- [← 上一章：废弃 API 与替代方案](/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html)
- [返回目录](/springboot4.html)
- [下一章：微服务应用升级实战 →](../第十二部分-实战案例/第18章-微服务升级实战.md)
