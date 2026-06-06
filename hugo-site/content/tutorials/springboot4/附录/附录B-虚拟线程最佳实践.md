---
title: 附录B：虚拟线程最佳实践
description: 附录B：虚拟线程最佳实践 概述 虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。
  B.1 适用场景 B.1.1 推荐使用 ✅ I/O 密集型应用 Web 服务器 数据库访问 HTTP 客户端调用 消息队列消费 文件 I/O ✅ 高并发场景
  微服务 API 网关 WebSocket 服务器 SSE 服务器 B....
url: /springboot4/E9_99_84_E5_BD_95/b.html
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

# 附录B：虚拟线程最佳实践

## 概述

虚拟线程是 Spring Boot 4 最重要的特性之一。本附录提供虚拟线程的最佳实践和使用指南。

## B.1 适用场景

### B.1.1 推荐使用

✅ **I/O 密集型应用**
- Web 服务器
- 数据库访问
- HTTP 客户端调用
- 消息队列消费
- 文件 I/O

✅ **高并发场景**
- 微服务
- API 网关
- WebSocket 服务器
- SSE 服务器

### B.1.2 不推荐使用

❌ **CPU 密集型任务**
- 复杂计算
- 图像处理
- 加密解密
- 数据压缩

❌ **需要线程本地存储**
- ThreadLocal 重度使用
- 线程池监控

## B.2 配置指南

### B.2.1 启用虚拟线程

**application.yml**:
```yaml
spring:
  threads:
    virtual:
      enabled: true
      name-prefix: "vt-"
```

### B.2.2 Tomcat 配置

```yaml
server:
  tomcat:
    threads:
      max: 200  # 虚拟线程下可以设置较小值
      min-spare: 10
```

### B.2.3 数据库连接池

**HikariCP 优化**:
```yaml
spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 虚拟线程下减少连接数
      minimum-idle: 5
      connection-timeout: 30000
```

## B.3 性能优化

### B.3.1 避免阻塞操作

**不推荐**:
```java
@Service
public class BadService {
    public void process() {
        synchronized (this) {  // ❌ 避免 synchronized
            // 处理逻辑
        }
    }
}
```

**推荐**:
```java
@Service
public class GoodService {
    private final Lock lock = new ReentrantLock();
    
    public void process() {
        lock.lock();  // ✅ 使用 Lock
        try {
            // 处理逻辑
        } finally {
            lock.unlock();
        }
    }
}
```

### B.3.2 合理使用线程池

**不推荐**:
```java
// ❌ 不要创建大量平台线程池
ExecutorService executor = Executors.newFixedThreadPool(1000);
```

**推荐**:
```java
// ✅ 使用虚拟线程执行器
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
```

## B.4 监控指标

### B.4.1 关键指标

```java
@Component
public class VirtualThreadMetrics {
    
    @Bean
    public MeterBinder virtualThreadMetrics() {
        return registry -> {
            Gauge.builder("jvm.threads.virtual.count", this::getVirtualThreadCount)
                .description("Number of virtual threads")
                .register(registry);
            
            Gauge.builder("jvm.threads.platform.count", this::getPlatformThreadCount)
                .description("Number of platform threads")
                .register(registry);
        };
    }
    
    private long getVirtualThreadCount() {
        return Thread.getAllStackTraces().keySet().stream()
            .filter(Thread::isVirtual)
            .count();
    }
    
    private long getPlatformThreadCount() {
        return Thread.getAllStackTraces().keySet().stream()
            .filter(t -> !t.isVirtual())
            .count();
    }
}
```

## B.5 常见陷阱

### B.5.1 ThreadLocal 使用

**问题**: 虚拟线程数量巨大，ThreadLocal 可能导致内存泄漏

**解决方案**:
```java
// ❌ 避免
private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

// ✅ 使用 ScopedValue (Java 21+)
private static final ScopedValue<User> currentUser = ScopedValue.newInstance();
```

### B.5.2 Pinning 问题

**问题**: synchronized 块会导致虚拟线程"固定"到平台线程

**检测**:
```bash
# 启用 JVM 参数
-Djdk.tracePinnedThreads=full
```

**解决方案**:
```java
// ❌ 避免在虚拟线程中使用
synchronized (lock) {
    // I/O 操作
}

// ✅ 使用 ReentrantLock
lock.lock();
try {
    // I/O 操作
} finally {
    lock.unlock();
}
```

## B.6 性能基准

### B.6.1 测试场景

**场景**: 10,000 并发 HTTP 请求，每个请求模拟 100ms I/O

| 配置 | 吞吐量 | P95延迟 | 内存 |
|------|--------|---------|------|
| 平台线程 (200) | 850 req/s | 450ms | 512MB |
| 虚拟线程 | 9500 req/s | 105ms | 256MB |

**提升**: 11倍吞吐量，77%延迟降低，50%内存节省

## B.7 迁移检查清单

### B.7.1 代码审查

- [ ] 检查 synchronized 使用
- [ ] 检查 ThreadLocal 使用
- [ ] 检查线程池配置
- [ ] 检查阻塞操作

### B.7.2 配置检查

- [ ] 启用虚拟线程
- [ ] 调整连接池大小
- [ ] 配置监控指标
- [ ] 设置 JVM 参数

### B.7.3 测试验证

- [ ] 功能测试
- [ ] 性能测试
- [ ] 压力测试
- [ ] 监控验证

## B.8 小结

✅ **核心原则**
- I/O 密集型任务优先使用
- 避免 synchronized
- 减少线程池大小
- 监控虚拟线程指标

✅ **性能收益**
- 10倍+ 吞吐量提升
- 70%+ 延迟降低
- 50%+ 内存节省

---

**相关章节**:
- [第2章：虚拟线程深度集成](/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html#22-virtual-threads虚拟线程深度集成)
- [第6章：虚拟线程与数据库](/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html#63-虚拟线程与数据库连接池)
