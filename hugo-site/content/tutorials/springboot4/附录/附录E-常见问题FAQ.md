---
title: 附录E：常见问题 FAQ
description: "附录E：常见问题 FAQ 概述 本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。 E.1 升级相关
  Q1: 必须升级到 Java 21 吗？ A : 是的，Spring Boot 4 要求最低 Java 21。 原因 : 虚拟线程是 Java 21
  的核心特性 Record 模式匹配需要 Java 21 性能优化依赖 Java..."
url: /springboot4/E9_99_84_E5_BD_95/e-faq.html
layout: tutorial
kind: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 901
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 附录E：常见问题 FAQ

## 概述

本附录收集了 Spring Boot 4 升级和使用过程中的常见问题及解决方案。

## E.1 升级相关

### Q1: 必须升级到 Java 21 吗？

**A**: 是的，Spring Boot 4 要求最低 Java 21。

**原因**:
- 虚拟线程是 Java 21 的核心特性
- Record 模式匹配需要 Java 21
- 性能优化依赖 Java 21 的改进

**迁移建议**:
```bash
# 安装 JDK 21
sdk install java 21-tem

# 验证版本
java -version
```

### Q2: 升级后应用无法启动？

**A**: 检查以下几点：

1. **JDK 版本**:
```bash
java -version  # 确保是 21+
```

2. **Maven/Gradle 版本**:
```bash
mvn -version   # 确保 3.9+
gradle -version  # 确保 8.5+
```

3. **依赖冲突**:
```bash
./mvnw dependency:tree | grep -i spring
```

### Q3: 第三方库不兼容怎么办？

**A**: 三种解决方案：

1. **升级库版本**:
```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>library</artifactId>
    <version>新版本</version>
</dependency>
```

2. **排除冲突依赖**:
```xml
<exclusions>
    <exclusion>
        <groupId>old-group</groupId>
        <artifactId>old-artifact</artifactId>
    </exclusion>
</exclusions>
```

3. **暂时降级 Spring Boot**（不推荐）

## E.2 虚拟线程问题

### Q4: 如何验证虚拟线程已启用？

**A**: 多种验证方法：

**方法1: 代码检查**:
```java
@RestController
public class TestController {
    @GetMapping("/thread-info")
    public Map<String, Object> threadInfo() {
        Thread thread = Thread.currentThread();
        return Map.of(
            "isVirtual", thread.isVirtual(),
            "threadName", thread.getName()
        );
    }
}
```

**方法2: 日志检查**:
```
# 启动日志中查找
Tomcat initialized with virtual threads
```

**方法3: Actuator**:
```bash
curl http://localhost:8080/actuator/metrics/jvm.threads.virtual
```

### Q5: 虚拟线程性能没有提升？

**A**: 检查以下几点：

1. **应用类型**: CPU 密集型应用收益不明显
2. **synchronized 使用**: 导致线程固定
3. **连接池配置**: 可能成为瓶颈

**诊断**:
```bash
# 启用 pinning 检测
java -Djdk.tracePinnedThreads=full -jar app.jar
```

### Q6: 虚拟线程数量过多导致内存问题？

**A**: 虚拟线程本身占用很少（~1KB），但要注意：

1. **ThreadLocal 清理**:
```java
// 使用后清理
threadLocal.remove();
```

2. **限制并发数**:
```java
Semaphore semaphore = new Semaphore(10000);
semaphore.acquire();
try {
    // 处理
} finally {
    semaphore.release();
}
```

## E.3 性能问题

### Q7: 启动时间没有明显改善？

**A**: 尝试以下优化：

1. **启用 AOT**:
```yaml
spring:
  aot:
    enabled: true
```

2. **使用 Native Image**:
```bash
./mvnw -Pnative native:compile
```

3. **优化依赖**:
```xml
<!-- 移除不必要的 starter -->
```

### Q8: 运行时性能反而下降？

**A**: 可能的原因：

1. **未启用虚拟线程**:
```yaml
spring:
  threads:
    virtual:
      enabled: true  # 确保启用
```

2. **连接池配置不当**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 减小连接池
```

3. **synchronized 过多**: 使用 Lock 替代

## E.4 数据库问题

### Q9: 数据库连接池耗尽？

**A**: 虚拟线程下需要调整配置：

```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 从 50 减少到 20
      minimum-idle: 5
      connection-timeout: 30000
```

**原因**: 虚拟线程可以用更少的连接处理更多请求

### Q10: 事务超时？

**A**: 检查事务配置：

```java
@Transactional(timeout = 30)  // 增加超时时间
public void longRunningTransaction() {
    // ...
}
```

## E.5 安全问题

### Q11: Security 配置报错？

**A**: 使用新的 Lambda DSL：

**错误代码**:
```java
http.authorizeRequests()
    .antMatchers("/public/**").permitAll()
    .and()...  // ❌ .and() 已废弃
```

**正确代码**:
```java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/public/**").permitAll()
    .anyRequest().authenticated()
);
```

### Q12: JWT 验证失败？

**A**: 检查密钥配置：

```yaml
app:
  jwt:
    secret: ${JWT_SECRET}  # 确保环境变量设置
    expiration: 86400000
```

## E.6 部署问题

### Q13: Docker 镜像过大？

**A**: 使用多阶段构建：

```dockerfile
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=builder /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**或使用 Native Image**:
```bash
./mvnw -Pnative native:compile
# 镜像大小: 250MB → 60MB
```

### Q14: Kubernetes 健康检查失败？

**A**: 配置正确的探针：

```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
```

**Kubernetes**:
```yaml
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
```

## E.7 监控问题

### Q15: Prometheus 指标缺失？

**A**: 确保配置正确：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus
  prometheus:
    metrics:
      export:
        enabled: true
```

### Q16: 追踪信息不显示？

**A**: 启用追踪：

```yaml
management:
  tracing:
    enabled: true
    sampling:
      probability: 1.0
```

## E.8 迁移问题

### Q17: 迁移需要多长时间？

**A**: 根据项目规模：

| 项目规模 | 预估时间 | 说明 |
|----------|----------|------|
| 小型 (< 10K 行) | 1-2 周 | 主要是测试 |
| 中型 (10K-50K 行) | 3-4 周 | 需要仔细测试 |
| 大型 (> 50K 行) | 6-8 周 | 分模块迁移 |

### Q18: 可以部分迁移吗？

**A**: 可以，建议策略：

1. **先迁移独立模块**
2. **逐步迁移核心服务**
3. **最后迁移遗留系统**

## E.9 最佳实践

### Q19: 什么时候应该升级？

**A**: 推荐场景：

✅ **立即升级**:
- I/O 密集型应用
- 高并发服务
- 微服务架构

⚠️ **谨慎评估**:
- CPU 密集型应用
- 大量使用废弃 API
- 第三方库依赖多

❌ **暂缓升级**:
- 稳定运行的遗留系统
- 团队不熟悉 Java 21
- 第三方库不兼容

### Q20: 如何最大化性能收益？

**A**: 关键点：

1. **启用虚拟线程**
2. **优化连接池**
3. **使用 Native Image**
4. **监控和调优**

**预期收益**:
- 吞吐量: 2-5 倍
- 延迟: 50-80% 降低
- 内存: 30-50% 节省

## E.10 获取帮助

### 官方资源
- [Spring Boot 文档](https://docs.spring.io/spring-boot/docs/4.0.x/reference/)
- [Spring Framework 文档](https://docs.spring.io/spring-framework/docs/7.0.x/reference/)
- [Java 21 文档](https://openjdk.org/projects/jdk/21/)

### 社区支持
- [Stack Overflow](https://stackoverflow.com/questions/tagged/spring-boot)
- [Spring 论坛](https://spring.io/community)
- [GitHub Issues](https://github.com/spring-projects/spring-boot/issues)

---

**最后更新**: 2024-12-24  
**版本**: Spring Boot 4.0.0

**相关章节**:
- [第17章：从 Spring Boot 3 迁移](/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html)
- [附录A：完整对比表](/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html)
- [附录B：虚拟线程最佳实践](/springboot4/E9_99_84_E5_BD_95/b.html)
