---
title: 第1章：Spring Boot 4 简介
description: "第1章：Spring Boot 4 简介 1.1 Spring Boot 4 发布背景 发布时间与版本信息 正式发布 :
  2024年11月（预计） 当前版本 : 4.0.0 Spring Framework 版本 : 7.0.x 最低 JDK 要求 : Java 21
  为什么需要 Spring Boot 4？ Spring Boot 4 的发布主要是为了： ..."
url: /springboot4/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E6_A6_82_E8_A7_88/1-springboot4.html
layout: tutorial
contentType: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 10
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第1章：Spring Boot 4 简介

## 1.1 Spring Boot 4 发布背景

### 发布时间与版本信息
- **正式发布**: 2024年11月（预计）
- **当前版本**: 4.0.0
- **Spring Framework 版本**: 7.0.x
- **最低 JDK 要求**: Java 21

### 为什么需要 Spring Boot 4？

Spring Boot 4 的发布主要是为了：

1. **拥抱 Java 21 新特性**
   - 虚拟线程（Virtual Threads / Project Loom）
   - Record 模式匹配
   - 结构化并发
   - 字符串模板（预览）

2. **提升云原生能力**
   - 更好的 GraalVM 原生镜像支持
   - 更快的启动时间
   - 更小的内存占用
   - 容器化优化

3. **增强可观察性**
   - 统一的观察性 API
   - 原生的分布式追踪
   - 更丰富的指标收集

4. **简化开发体验**
   - 更简洁的配置
   - 更强大的自动配置
   - 更好的开发工具支持

## 1.2 主要新特性一览

### 🔥 核心新特性

#### 1. 虚拟线程（Virtual Threads）支持
```java
// Spring Boot 4 自动配置虚拟线程
@SpringBootApplication
public class VirtualThreadsApplication {
    public static void main(String[] args) {
        SpringApplication.run(VirtualThreadsApplication.class, args);
    }
}
```

**配置文件**:
```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true  # 启用虚拟线程
```

#### 2. HTTP Interface 客户端
```java
// 声明式 HTTP 客户端（类似 Feign）
public interface UserClient {
    @GetExchange("/users/{id}")
    User getUser(@PathVariable Long id);
    
    @PostExchange("/users")
    User createUser(@RequestBody User user);
}
```

#### 3. Problem Details (RFC 7807) 支持
```java
// 标准化的错误响应
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, 
            ex.getMessage()
        );
        problemDetail.setTitle("Resource Not Found");
        problemDetail.setProperty("timestamp", Instant.now());
        return problemDetail;
    }
}
```

#### 4. 原生镜像（Native Image）改进
```bash
# 更简单的原生镜像构建
./mvnw -Pnative native:compile

# 启动时间对比
# JVM 模式: ~2-3 秒
# Native 模式: ~0.05 秒（快 40-60 倍）
```

#### 5. 观察性（Observability）增强
```java
// 自动化的追踪和指标
@RestController
public class OrderController {
    @GetMapping("/orders/{id}")
    @Observed(name = "orders.get")  // 自动生成指标和追踪
    public Order getOrder(@PathVariable Long id) {
        return orderService.findById(id);
    }
}
```

### 📊 版本依赖升级

| 组件 | Spring Boot 3.x | Spring Boot 4.0 |
|------|----------------|-----------------|
| Spring Framework | 6.x | 7.0 |
| Java 最低版本 | 17 | 21 |
| Jakarta EE | 9.x/10.x | 10.x |
| Hibernate | 6.1.x | 6.4+ |
| Tomcat | 10.1.x | 11.0.x |
| Jetty | 11.x | 12.x |
| Micrometer | 1.12.x | 1.13+ |
| Spring Security | 6.x | 7.0 |
| Spring Data | 3.x | 4.0 |

## 1.3 升级路径与兼容性

### 兼容性矩阵

#### ✅ 完全兼容
- 大部分 Spring Boot 3.2+ 的应用可以平滑升级
- 配置文件格式保持兼容
- 核心注解和 API 保持稳定

#### ⚠️ 需要调整
- 使用了废弃 API 的代码
- 自定义的自动配置类
- 某些第三方库可能需要升级

#### ❌ 不兼容
- Java 17 以下版本
- 某些已移除的废弃功能
- 部分过时的配置属性

### 升级决策树

```
是否使用 Java 21？
├─ 是 → 可以升级到 Spring Boot 4
│   └─ 是否需要虚拟线程？
│       ├─ 是 → 强烈推荐升级
│       └─ 否 → 评估其他新特性价值
└─ 否 → 暂时保持 Spring Boot 3
    └─ 计划升级 Java 版本
```

## 1.4 开发环境准备

### 1.4.1 安装 JDK 21

#### Windows
```powershell
# 使用 SDKMAN（推荐）
sdk install java 21-tem

# 或下载 Oracle JDK 21
# https://www.oracle.com/java/technologies/downloads/#java21
```

#### macOS
```bash
# 使用 Homebrew
brew install openjdk@21

# 或使用 SDKMAN
sdk install java 21-tem
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-21-jdk

# 或使用 SDKMAN
sdk install java 21-tem
```

**验证安装**:
```bash
java -version
# 输出应包含: openjdk version "21" 或 java version "21"
```

### 1.4.2 配置构建工具

#### Maven (pom.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.0.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>springboot4-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot4-demo</name>
    <description>Spring Boot 4 Demo Project</description>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

#### Gradle (build.gradle)
```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '4.0.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
    sourceCompatibility = '21'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

### 1.4.3 IDE 配置

#### IntelliJ IDEA
1. **版本要求**: 2024.1 或更高
2. **配置 JDK 21**:
   - File → Project Structure → Project SDK → 选择 JDK 21
   - File → Settings → Build, Execution, Deployment → Compiler → Java Compiler → 设置 Target bytecode version 为 21

3. **启用虚拟线程预览**:
   ```
   Settings → Build, Execution, Deployment → Compiler → Java Compiler
   Additional command line parameters: --enable-preview
   ```

#### VS Code
1. 安装扩展:
   - Extension Pack for Java
   - Spring Boot Extension Pack

2. 配置 settings.json:
```json
{
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-21",
            "path": "/path/to/jdk-21",
            "default": true
        }
    ],
    "java.jdt.ls.java.home": "/path/to/jdk-21"
}
```

## 1.5 第一个 Spring Boot 4 应用

### 案例：Hello Spring Boot 4

#### 1. 创建项目
```bash
# 使用 Spring Initializr
curl https://start.spring.io/starter.zip \
  -d dependencies=web \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=4.0.0 \
  -d baseDir=hello-springboot4 \
  -d groupId=com.example \
  -d artifactId=hello-springboot4 \
  -d javaVersion=21 \
  -o hello-springboot4.zip

unzip hello-springboot4.zip
cd hello-springboot4
```

#### 2. 主应用类
```java
package com.example.hellospringboot4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HelloSpringboot4Application {
    public static void main(String[] args) {
        SpringApplication.run(HelloSpringboot4Application.class, args);
    }
}
```

#### 3. 创建控制器
```java
package com.example.hellospringboot4.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HelloController {
    
    @GetMapping("/")
    public Map<String, Object> hello() {
        return Map.of(
            "message", "Hello Spring Boot 4!",
            "timestamp", Instant.now(),
            "javaVersion", System.getProperty("java.version"),
            "springBootVersion", "4.0.0"
        );
    }
    
    @GetMapping("/thread-info")
    public Map<String, Object> threadInfo() {
        Thread currentThread = Thread.currentThread();
        return Map.of(
            "threadName", currentThread.getName(),
            "isVirtual", currentThread.isVirtual(),
            "threadId", currentThread.threadId()
        );
    }
}
```

#### 4. 配置文件
```yaml
# src/main/resources/application.yml
spring:
  application:
    name: hello-springboot4
  threads:
    virtual:
      enabled: true  # 启用虚拟线程

server:
  port: 8080

logging:
  level:
    root: INFO
    com.example: DEBUG
```

#### 5. 运行应用
```bash
# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun
```

#### 6. 测试应用
```bash
# 测试基本端点
curl http://localhost:8080/

# 输出示例:
# {
#   "message": "Hello Spring Boot 4!",
#   "timestamp": "2024-12-24T01:05:54.123456Z",
#   "javaVersion": "21.0.1",
#   "springBootVersion": "4.0.0"
# }

# 测试线程信息
curl http://localhost:8080/thread-info

# 输出示例:
# {
#   "threadName": "virtual-123",
#   "isVirtual": true,
#   "threadId": 123
# }
```

### 对比：Spring Boot 3 vs Spring Boot 4

#### 启动日志对比

**Spring Boot 3**:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2024-12-24 09:05:54.123  INFO 12345 --- [main] c.e.h.HelloSpringboot3Application : Starting...
2024-12-24 09:05:56.456  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080
2024-12-24 09:05:56.789  INFO 12345 --- [main] c.e.h.HelloSpringboot3Application : Started in 2.666 seconds
```

**Spring Boot 4**:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v4.0.0)

2024-12-24 09:05:54.123  INFO 12345 --- [main] c.e.h.HelloSpringboot4Application : Starting...
2024-12-24 09:05:54.234  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with virtual threads
2024-12-24 09:05:54.567  INFO 12345 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080
2024-12-24 09:05:54.678  INFO 12345 --- [main] c.e.h.HelloSpringboot4Application : Started in 0.555 seconds
```

**关键差异**:
- ✅ 启动时间更快（2.666s → 0.555s）
- ✅ 显示虚拟线程已启用
- ✅ 更少的内存占用

## 1.6 项目结构解析

### 标准项目结构
```
hello-springboot4/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/hellospringboot4/
│   │   │       ├── HelloSpringboot4Application.java  # 主应用类
│   │   │       ├── controller/                        # 控制器层
│   │   │       ├── service/                           # 服务层
│   │   │       ├── repository/                        # 数据访问层
│   │   │       ├── model/                             # 数据模型
│   │   │       └── config/                            # 配置类
│   │   └── resources/
│   │       ├── application.yml                        # 配置文件
│   │       ├── application-dev.yml                    # 开发环境配置
│   │       ├── application-prod.yml                   # 生产环境配置
│   │       ├── static/                                # 静态资源
│   │       └── templates/                             # 模板文件
│   └── test/
│       └── java/
│           └── com/example/hellospringboot4/
│               └── HelloSpringboot4ApplicationTests.java
├── pom.xml                                            # Maven 配置
└── README.md                                          # 项目说明
```

### Spring Boot 4 新增的配置选项

```yaml
# application.yml - Spring Boot 4 新特性配置
spring:
  # 虚拟线程配置
  threads:
    virtual:
      enabled: true
      name-prefix: "virtual-"
  
  # 观察性配置
  observability:
    enabled: true
    tracing:
      enabled: true
      sampling:
        probability: 1.0
    metrics:
      enabled: true
  
  # AOT 优化配置
  aot:
    enabled: true
    
  # 原生镜像提示
  native:
    remove-unused-autoconfig: true
    remove-yaml-support: false

# Actuator 端点配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  metrics:
    tags:
      application: ${spring.application.name}
  tracing:
    sampling:
      probability: 1.0
```

## 1.7 小结

在本章中，我们学习了：

✅ **Spring Boot 4 的发布背景和主要目标**
- 拥抱 Java 21 新特性
- 提升云原生能力
- 增强可观察性

✅ **核心新特性概览**
- 虚拟线程支持
- HTTP Interface 客户端
- Problem Details 标准化错误处理
- 原生镜像改进
- 观察性增强

✅ **开发环境搭建**
- JDK 21 安装
- Maven/Gradle 配置
- IDE 设置

✅ **第一个 Spring Boot 4 应用**
- 项目创建
- 基本配置
- 虚拟线程验证

### 下一步

在下一章，我们将深入探讨 **Spring Framework 7.0 的新特性**，特别是虚拟线程的深度集成和性能优化。

---

**导航**:
- [← 返回目录](/springboot4.html)
- [下一章：Spring Framework 7.0 新特性 →](/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html)
