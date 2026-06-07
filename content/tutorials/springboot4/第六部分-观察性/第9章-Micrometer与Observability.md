---
title: 第9章：Micrometer 与 Observability
description: "第9章：Micrometer 与 Observability 本章概述 Spring Boot 4
  大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。 本章重点 : ✅ 统一的观察性
  API ✅ 分布式追踪改进 ✅ 新的 Actuator 端点 ✅ 虚拟线程的监控 ✅ 与 OpenTelem..."
url: /springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html
layout: tutorial
contentType: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 90
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第9章：Micrometer 与 Observability

## 本章概述

Spring Boot 4 大幅增强了可观察性（Observability）支持，通过 Micrometer 提供统一的指标、追踪和日志记录能力。

**本章重点**:
- ✅ 统一的观察性 API
- ✅ 分布式追踪改进
- ✅ 新的 Actuator 端点
- ✅ 虚拟线程的监控
- ✅ 与 OpenTelemetry 集成

## 9.1 统一的观察性 API

### 9.1.1 Micrometer Observation API

Spring Boot 4 引入了统一的 Observation API，简化了指标和追踪的实现。

#### 项目结构
```
observability-demo/
├── src/main/java/com/example/observability/
│   ├── ObservabilityApplication.java
│   ├── config/
│   │   ├── ObservabilityConfig.java
│   │   └── MetricsConfig.java
│   ├── service/
│   │   ├── OrderService.java
│   │   └── PaymentService.java
│   ├── controller/
│   │   └── OrderController.java
│   └── observation/
│       ├── CustomObservationHandler.java
│       └── BusinessMetrics.java
```

#### 1. 配置

**application.yml**:
```yaml
spring:
  application:
    name: observability-demo
  
  threads:
    virtual:
      enabled: true

management:
  # Actuator 端点配置
  endpoints:
    web:
      exposure:
        include: '*'  # 暴露所有端点（生产环境应限制）
  
  # 指标配置
  metrics:
    tags:
      application: ${spring.application.name}
      environment: ${ENVIRONMENT:dev}
    distribution:
      percentiles-histogram:
        http.server.requests: true
  
  # 追踪配置
  tracing:
    enabled: true
    sampling:
      probability: 1.0  # 100% 采样（开发环境）
  
  # Prometheus 配置
  prometheus:
    metrics:
      export:
        enabled: true

logging:
  pattern:
    level: '%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]'
  level:
    com.example.observability: DEBUG
```

**ObservabilityConfig.java**:
```java
package com.example.observability.config;

import io.micrometer.observation.ObservationRegistry;
import io.micrometer.observation.aop.ObservedAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Spring Boot 4 - 观察性配置
 */
@Configuration
public class ObservabilityConfig {
    
    /**
     * 启用 @Observed 注解支持
     */
    @Bean
    public ObservedAspect observedAspect(ObservationRegistry registry) {
        return new ObservedAspect(registry);
    }
}
```

#### 2. 使用 @Observed 注解

**OrderService.java**:
```java
package com.example.observability.service;

import io.micrometer.observation.annotation.Observed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

/**
 * 订单服务 - 使用 @Observed 自动生成指标和追踪
 */
@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    private final PaymentService paymentService;
    
    public OrderService(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    /**
     * 创建订单 - 自动记录指标和追踪
     */
    @Observed(
        name = "order.create",
        contextualName = "create-order",
        lowCardinalityKeyValues = {"type", "online"}
    )
    public Order createOrder(String userId, BigDecimal amount) {
        log.info("Creating order for user: {}, amount: {}", userId, amount);
        
        // 模拟订单创建
        simulateWork(100);
        
        Order order = new Order(
            generateOrderId(),
            userId,
            amount,
            OrderStatus.PENDING
        );
        
        // 调用支付服务
        boolean paymentSuccess = paymentService.processPayment(order.id(), amount);
        
        if (paymentSuccess) {
            order = order.withStatus(OrderStatus.PAID);
            log.info("Order created successfully: {}", order.id());
        } else {
            order = order.withStatus(OrderStatus.FAILED);
            log.error("Order payment failed: {}", order.id());
        }
        
        return order;
    }
    
    /**
     * 查询订单
     */
    @Observed(
        name = "order.get",
        contextualName = "get-order"
    )
    public Order getOrder(String orderId) {
        log.debug("Getting order: {}", orderId);
        simulateWork(50);
        
        return new Order(
            orderId,
            "user123",
            new BigDecimal("99.99"),
            OrderStatus.PAID
        );
    }
    
    /**
     * 取消订单
     */
    @Observed(
        name = "order.cancel",
        contextualName = "cancel-order",
        lowCardinalityKeyValues = {"reason", "user-requested"}
    )
    public void cancelOrder(String orderId) {
        log.info("Cancelling order: {}", orderId);
        simulateWork(80);
    }
    
    private void simulateWork(long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    private String generateOrderId() {
        return "ORD-" + System.currentTimeMillis();
    }
}

/**
 * 订单记录
 */
record Order(
    String id,
    String userId,
    BigDecimal amount,
    OrderStatus status
) {
    public Order withStatus(OrderStatus newStatus) {
        return new Order(id, userId, amount, newStatus);
    }
}

enum OrderStatus {
    PENDING, PAID, FAILED, CANCELLED
}
```

**PaymentService.java**:
```java
package com.example.observability.service;

import io.micrometer.observation.annotation.Observed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.concurrent.TimeUnit;

@Service
public class PaymentService {
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    
    /**
     * 处理支付 - 自动追踪
     */
    @Observed(
        name = "payment.process",
        contextualName = "process-payment"
    )
    public boolean processPayment(String orderId, BigDecimal amount) {
        log.info("Processing payment for order: {}, amount: {}", orderId, amount);
        
        try {
            // 模拟支付处理
            TimeUnit.MILLISECONDS.sleep(200);
            
            // 90% 成功率
            boolean success = Math.random() > 0.1;
            
            if (success) {
                log.info("Payment successful for order: {}", orderId);
            } else {
                log.error("Payment failed for order: {}", orderId);
            }
            
            return success;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}
```

#### 3. 控制器

**OrderController.java**:
```java
package com.example.observability.controller;

import com.example.observability.service.Order;
import com.example.observability.service.OrderService;
import io.micrometer.observation.annotation.Observed;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    @Observed(name = "http.orders.create")
    public Order createOrder(@RequestBody CreateOrderRequest request) {
        return orderService.createOrder(request.userId(), request.amount());
    }
    
    @GetMapping("/{orderId}")
    @Observed(name = "http.orders.get")
    public Order getOrder(@PathVariable String orderId) {
        return orderService.getOrder(orderId);
    }
    
    @DeleteMapping("/{orderId}")
    @Observed(name = "http.orders.cancel")
    public Map<String, String> cancelOrder(@PathVariable String orderId) {
        orderService.cancelOrder(orderId);
        return Map.of("message", "Order cancelled", "orderId", orderId);
    }
}

record CreateOrderRequest(String userId, BigDecimal amount) {}
```

## 9.2 分布式追踪改进

### 9.2.1 与 OpenTelemetry 集成

**pom.xml**:
```xml
<dependencies>
    <!-- Micrometer Tracing -->
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-tracing-bridge-otel</artifactId>
    </dependency>
    
    <!-- OpenTelemetry Exporter -->
    <dependency>
        <groupId>io.opentelemetry</groupId>
        <artifactId>opentelemetry-exporter-otlp</artifactId>
    </dependency>
    
    <!-- Zipkin (可选) -->
    <dependency>
        <groupId>io.zipkin.reporter2</groupId>
        <artifactId>zipkin-reporter-brave</artifactId>
    </dependency>
</dependencies>
```

**application.yml**:
```yaml
management:
  tracing:
    enabled: true
    sampling:
      probability: 1.0
  
  # Zipkin 配置
  zipkin:
    tracing:
      endpoint: http://localhost:9411/api/v2/spans
  
  # OpenTelemetry 配置
  otlp:
    tracing:
      endpoint: http://localhost:4318/v1/traces
```

### 9.2.2 自定义追踪

**CustomObservationHandler.java**:
```java
package com.example.observability.observation;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * 自定义观察处理器
 */
@Component
public class CustomObservationHandler implements ObservationHandler<Observation.Context> {
    private static final Logger log = LoggerFactory.getLogger(CustomObservationHandler.class);
    
    @Override
    public void onStart(Observation.Context context) {
        log.debug("Observation started: {}", context.getName());
    }
    
    @Override
    public void onStop(Observation.Context context) {
        log.debug("Observation stopped: {}, duration: {}ms", 
            context.getName(), 
            System.currentTimeMillis() - context.get("startTime"));
    }
    
    @Override
    public void onError(Observation.Context context) {
        log.error("Observation error: {}", context.getName(), context.getError());
    }
    
    @Override
    public boolean supportsContext(Observation.Context context) {
        return true;
    }
}
```

## 9.3 新的 Actuator 端点

### 9.3.1 常用端点

Spring Boot 4 增强了 Actuator 端点：

| 端点 | 说明 | 新特性 |
|------|------|--------|
| `/actuator/health` | 健康检查 | 虚拟线程状态 |
| `/actuator/metrics` | 指标 | 更多虚拟线程指标 |
| `/actuator/prometheus` | Prometheus | 改进的格式 |
| `/actuator/traces` | 追踪信息 | OpenTelemetry 集成 |
| `/actuator/threaddump` | 线程转储 | 虚拟线程支持 |

### 9.3.2 自定义健康检查

**CustomHealthIndicator.java**:
```java
package com.example.observability.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class CustomHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 检查虚拟线程状态
        Thread currentThread = Thread.currentThread();
        boolean isVirtual = currentThread.isVirtual();
        
        // 检查系统资源
        Runtime runtime = Runtime.getRuntime();
        long freeMemory = runtime.freeMemory();
        long totalMemory = runtime.totalMemory();
        double memoryUsage = (double) (totalMemory - freeMemory) / totalMemory;
        
        if (memoryUsage > 0.9) {
            return Health.down()
                .withDetail("reason", "High memory usage")
                .withDetail("memoryUsage", String.format("%.2f%%", memoryUsage * 100))
                .build();
        }
        
        return Health.up()
            .withDetail("virtualThreads", isVirtual)
            .withDetail("memoryUsage", String.format("%.2f%%", memoryUsage * 100))
            .withDetail("availableProcessors", runtime.availableProcessors())
            .build();
    }
}
```

## 9.4 虚拟线程的监控

### 9.4.1 虚拟线程指标

**VirtualThreadMetrics.java**:
```java
package com.example.observability.metrics;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Tags;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class VirtualThreadMetrics {
    private final MeterRegistry registry;
    
    public VirtualThreadMetrics(MeterRegistry registry) {
        this.registry = registry;
    }
    
    @PostConstruct
    public void init() {
        // 注册虚拟线程指标
        registry.gauge("jvm.threads.virtual", Tags.empty(), this, 
            VirtualThreadMetrics::getVirtualThreadCount);
        
        registry.gauge("jvm.threads.platform", Tags.empty(), this,
            VirtualThreadMetrics::getPlatformThreadCount);
    }
    
    private double getVirtualThreadCount() {
        return Thread.getAllStackTraces().keySet().stream()
            .filter(Thread::isVirtual)
            .count();
    }
    
    private double getPlatformThreadCount() {
        return Thread.getAllStackTraces().keySet().stream()
            .filter(t -> !t.isVirtual())
            .count();
    }
}
```

## 9.5 业务指标

### 9.5.1 自定义业务指标

**BusinessMetrics.java**:
```java
package com.example.observability.observation;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * 业务指标
 */
@Component
public class BusinessMetrics {
    private final Counter orderCreatedCounter;
    private final Counter orderFailedCounter;
    private final Timer orderProcessingTimer;
    
    public BusinessMetrics(MeterRegistry registry) {
        this.orderCreatedCounter = Counter.builder("orders.created")
            .description("Total orders created")
            .tag("type", "business")
            .register(registry);
        
        this.orderFailedCounter = Counter.builder("orders.failed")
            .description("Total orders failed")
            .tag("type", "business")
            .register(registry);
        
        this.orderProcessingTimer = Timer.builder("orders.processing.time")
            .description("Order processing time")
            .tag("type", "business")
            .register(registry);
    }
    
    public void recordOrderCreated() {
        orderCreatedCounter.increment();
    }
    
    public void recordOrderFailed() {
        orderFailedCounter.increment();
    }
    
    public void recordProcessingTime(long millis) {
        orderProcessingTimer.record(millis, TimeUnit.MILLISECONDS);
    }
    
    public <T> T recordProcessing(java.util.function.Supplier<T> supplier) {
        return orderProcessingTimer.record(supplier);
    }
}
```

## 9.6 Prometheus 集成

### 9.6.1 配置 Prometheus

**prometheus.yml**:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'spring-boot-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']
```

### 9.6.2 Grafana 仪表板

常用的 Grafana 查询：

```promql
# HTTP 请求率
rate(http_server_requests_seconds_count[1m])

# HTTP 请求延迟 P95
histogram_quantile(0.95, rate(http_server_requests_seconds_bucket[1m]))

# 虚拟线程数量
jvm_threads_virtual

# 订单创建率
rate(orders_created_total[1m])

# 内存使用率
jvm_memory_used_bytes / jvm_memory_max_bytes
```

## 9.7 Spring Boot 3 vs Spring Boot 4 对比

| 特性 | Spring Boot 3 | Spring Boot 4 |
|------|---------------|---------------|
| Observation API | 基础支持 | 完全集成 |
| OpenTelemetry | 需要额外配置 | 原生支持 |
| 虚拟线程监控 | ❌ 无 | ✅ 完整支持 |
| @Observed 注解 | 基础功能 | 增强功能 |
| Actuator 端点 | 标准端点 | 新增虚拟线程端点 |

## 9.8 小结

本章我们学习了：

✅ **统一的观察性 API**
- @Observed 注解
- 自动指标和追踪

✅ **分布式追踪**
- OpenTelemetry 集成
- Zipkin 支持

✅ **Actuator 端点**
- 新的健康检查
- 虚拟线程监控

✅ **业务指标**
- 自定义指标
- Prometheus 集成

### 下一步

下一章我们将学习 **Spring for Apache Kafka 升级**。

---

**导航**:
- [← 上一章：Spring Security 7.0 新特性](/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html)
- [返回目录](/springboot4.html)
- [下一章：Spring for Apache Kafka 升级 →](/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html)
