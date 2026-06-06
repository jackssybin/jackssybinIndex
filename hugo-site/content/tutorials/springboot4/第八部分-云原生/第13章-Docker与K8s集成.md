---
title: 第13章：Docker 与 Kubernetes 集成
description: "第13章：Docker 与 Kubernetes 集成 本章概述 Spring Boot 4 改进了容器化支持，提供更好的
  Docker 和 Kubernetes 集成。 本章重点 : ✅ 容器镜像构建改进 ✅ Kubernetes 原生支持 ✅ 健康检查与就绪探针 ✅
  ConfigMap 和 Secret 集成 13.1 Docker 镜像构建 13.1...."
url: /springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html
layout: tutorial
kind: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 130
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 第13章：Docker 与 Kubernetes 集成

## 本章概述

Spring Boot 4 改进了容器化支持，提供更好的 Docker 和 Kubernetes 集成。

**本章重点**:
- ✅ 容器镜像构建改进
- ✅ Kubernetes 原生支持
- ✅ 健康检查与就绪探针
- ✅ ConfigMap 和 Secret 集成

## 13.1 Docker 镜像构建

### 13.1.1 使用 Buildpacks

**Maven 插件**:
```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <image>
            <name>myapp:${project.version}</name>
            <builder>paketobuildpacks/builder:base</builder>
        </image>
    </configuration>
</plugin>
```

**构建命令**:
```bash
# 构建 Docker 镜像
./mvnw spring-boot:build-image

# 运行容器
docker run -p 8080:8080 myapp:1.0.0
```

### 13.1.2 多阶段构建

**Dockerfile**:
```dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# 使用虚拟线程
ENV JAVA_OPTS="-XX:+UseVirtualThreads"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**镜像大小对比**:
| 方式 | 镜像大小 | 启动时间 |
|------|----------|----------|
| 传统 JRE | 250MB | 2.5s |
| JRE + 优化 | 180MB | 1.2s |
| Native Image | 60MB | 0.05s |

## 13.2 Kubernetes 集成

### 13.2.1 Deployment 配置

**deployment.yaml**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: springboot4-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: springboot4-app
  template:
    metadata:
      labels:
        app: springboot4-app
    spec:
      containers:
      - name: app
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
        
        # 环境变量
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: JAVA_OPTS
          value: "-XX:+UseVirtualThreads -Xmx512m"
        
        # 资源限制
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        
        # 健康检查
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        
        # 就绪探针
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
        
        # 启动探针
        startupProbe:
          httpGet:
            path: /actuator/health/startup
            port: 8080
          failureThreshold: 30
          periodSeconds: 2
```

### 13.2.2 Service 配置

**service.yaml**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: springboot4-service
spec:
  selector:
    app: springboot4-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

### 13.2.3 ConfigMap 集成

**configmap.yaml**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    spring:
      application:
        name: springboot4-app
      threads:
        virtual:
          enabled: true
      datasource:
        url: jdbc:mysql://mysql-service:3306/mydb
```

**使用 ConfigMap**:
```yaml
# 在 Deployment 中挂载
volumes:
- name: config
  configMap:
    name: app-config
volumeMounts:
- name: config
  mountPath: /config
  readOnly: true
```

**application.yml**:
```yaml
spring:
  config:
    import: "optional:configtree:/config/"
```

## 13.3 健康检查

### 13.3.1 Kubernetes 探针配置

**application.yml**:
```yaml
management:
  endpoint:
    health:
      probes:
        enabled: true
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState,db
  
  health:
    livenessState:
      enabled: true
    readinessState:
      enabled: true
```

### 13.3.2 自定义健康检查

**CustomHealthIndicator.java**:
```java
@Component
public class K8sHealthIndicator implements HealthIndicator {
    
    @Override
    public Health health() {
        // 检查应用状态
        boolean healthy = checkApplicationHealth();
        
        if (healthy) {
            return Health.up()
                .withDetail("kubernetes", "ready")
                .withDetail("virtualThreads", Thread.currentThread().isVirtual())
                .build();
        }
        
        return Health.down()
            .withDetail("reason", "Application not ready")
            .build();
    }
    
    private boolean checkApplicationHealth() {
        // 健康检查逻辑
        return true;
    }
}
```

## 13.4 Helm Chart

### 13.4.1 Chart 结构

```
springboot4-chart/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── configmap.yaml
    └── ingress.yaml
```

**values.yaml**:
```yaml
replicaCount: 3

image:
  repository: myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent

service:
  type: LoadBalancer
  port: 80

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

## 13.5 最佳实践

### 13.5.1 优化建议

1. **使用虚拟线程**: 减少资源占用
2. **合理设置资源限制**: 避免 OOM
3. **配置健康检查**: 确保高可用
4. **使用 ConfigMap**: 外部化配置
5. **启用 HPA**: 自动扩缩容

### 13.5.2 监控集成

**prometheus-config.yaml**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    scrape_configs:
    - job_name: 'springboot4-app'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: springboot4-app
      - source_labels: [__meta_kubernetes_pod_ip]
        target_label: __address__
        replacement: $1:8080
      metrics_path: /actuator/prometheus
```

## 13.6 小结

✅ **Docker 集成**
- Buildpacks 简化构建
- 多阶段构建优化镜像

✅ **Kubernetes 支持**
- 原生健康检查
- ConfigMap 集成
- Helm Chart 部署

✅ **最佳实践**
- 资源优化
- 监控集成
- 自动扩缩容

---

**导航**:
- [← 上一章](/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html)
- [返回目录](/springboot4.html)
- [下一章 →](../第九部分-测试/第14章-测试支持改进.md)
