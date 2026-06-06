---
title: 附录C：GraalVM Native Image 指南
description: "附录C：GraalVM Native Image 指南 概述 本附录提供 GraalVM Native Image
  的完整使用指南，帮助您构建高性能的原生应用。 C.1 环境准备 C.1.1 安装 GraalVM 使用 SDKMAN (推荐) : 手动安装 : C.1.2
  安装 Native Image C.2 项目配置 C.2.1 Maven 配置 pom..."
url: /springboot4/E9_99_84_E5_BD_95/c-graalvm.html
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

# 附录C：GraalVM Native Image 指南

## 概述

本附录提供 GraalVM Native Image 的完整使用指南，帮助您构建高性能的原生应用。

## C.1 环境准备

### C.1.1 安装 GraalVM

**使用 SDKMAN (推荐)**:
```bash
# 安装 GraalVM
sdk install java 21-graal

# 设置为默认
sdk use java 21-graal

# 验证安装
java -version
# 输出应包含 "GraalVM"
```

**手动安装**:
```bash
# 下载 GraalVM
# https://www.graalvm.org/downloads/

# 设置环境变量
export GRAALVM_HOME=/path/to/graalvm
export PATH=$GRAALVM_HOME/bin:$PATH
```

### C.1.2 安装 Native Image

```bash
# 安装 native-image 工具
gu install native-image

# 验证安装
native-image --version
```

## C.2 项目配置

### C.2.1 Maven 配置

**pom.xml**:
```xml
<project>
    <properties>
        <java.version>21</java.version>
        <native.maven.plugin.version>0.10.0</native.maven.plugin.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.graalvm.buildtools</groupId>
                <artifactId>native-maven-plugin</artifactId>
                <version>${native.maven.plugin.version}</version>
                <configuration>
                    <imageName>${project.artifactId}</imageName>
                    <mainClass>com.example.Application</mainClass>
                    <buildArgs>
                        <buildArg>--no-fallback</buildArg>
                        <buildArg>-H:+ReportExceptionStackTraces</buildArg>
                        <buildArg>--initialize-at-build-time=org.slf4j</buildArg>
                    </buildArgs>
                </configuration>
            </plugin>
        </plugins>
    </build>
    
    <profiles>
        <profile>
            <id>native</id>
            <build>
                <plugins>
                    <plugin>
                        <groupId>org.springframework.boot</groupId>
                        <artifactId>spring-boot-maven-plugin</artifactId>
                        <configuration>
                            <image>
                                <builder>paketobuildpacks/builder:tiny</builder>
                                <env>
                                    <BP_NATIVE_IMAGE>true</BP_NATIVE_IMAGE>
                                </env>
                            </image>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
```

### C.2.2 Gradle 配置

**build.gradle**:
```gradle
plugins {
    id 'org.springframework.boot' version '4.0.0'
    id 'io.spring.dependency-management' version '1.1.0'
    id 'org.graalvm.buildtools.native' version '0.10.0'
    id 'java'
}

graalvmNative {
    binaries {
        main {
            imageName = project.name
            mainClass = 'com.example.Application'
            buildArgs.add('--no-fallback')
            buildArgs.add('-H:+ReportExceptionStackTraces')
        }
    }
}
```

## C.3 构建 Native Image

### C.3.1 本地构建

**Maven**:
```bash
# 构建 Native Image
./mvnw -Pnative native:compile

# 运行
./target/myapp
```

**Gradle**:
```bash
# 构建 Native Image
./gradlew nativeCompile

# 运行
./build/native/nativeCompile/myapp
```

### C.3.2 Docker 构建

**Dockerfile**:
```dockerfile
# Stage 1: Build
FROM ghcr.io/graalvm/native-image:21 AS builder

WORKDIR /app
COPY . .

RUN ./mvnw -Pnative native:compile

# Stage 2: Runtime
FROM gcr.io/distroless/base

COPY --from=builder /app/target/myapp /app
EXPOSE 8080

ENTRYPOINT ["/app"]
```

**构建和运行**:
```bash
# 构建镜像
docker build -t myapp:native .

# 运行容器
docker run -p 8080:8080 myapp:native
```

## C.4 配置提示

### C.4.1 反射配置

**reflect-config.json**:
```json
[
  {
    "name": "com.example.MyClass",
    "allDeclaredConstructors": true,
    "allDeclaredMethods": true,
    "allDeclaredFields": true
  }
]
```

**在代码中注册**:
```java
@Configuration
public class NativeHints implements RuntimeHintsRegistrar {
    
    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        // 反射提示
        hints.reflection()
            .registerType(MyClass.class, 
                MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
                MemberCategory.INVOKE_DECLARED_METHODS,
                MemberCategory.DECLARED_FIELDS);
        
        // 资源提示
        hints.resources()
            .registerPattern("config/*.properties")
            .registerPattern("templates/*.html");
        
        // 代理提示
        hints.proxies()
            .registerJdkProxy(MyInterface.class);
    }
}
```

### C.4.2 资源配置

**resource-config.json**:
```json
{
  "resources": {
    "includes": [
      {"pattern": "application.yml"},
      {"pattern": "application-*.yml"},
      {"pattern": "static/.*"},
      {"pattern": "templates/.*"}
    ]
  }
}
```

### C.4.3 序列化配置

**serialization-config.json**:
```json
[
  {
    "name": "com.example.dto.UserDTO"
  },
  {
    "name": "com.example.dto.ProductDTO"
  }
]
```

## C.5 性能优化

### C.5.1 构建优化

**优化构建参数**:
```xml
<buildArgs>
    <!-- 基础优化 -->
    <buildArg>--no-fallback</buildArg>
    <buildArg>-H:+ReportExceptionStackTraces</buildArg>
    
    <!-- 性能优化 -->
    <buildArg>-O3</buildArg>
    <buildArg>-march=native</buildArg>
    
    <!-- 内存优化 -->
    <buildArg>-H:+RemoveUnusedSymbols</buildArg>
    <buildArg>-H:+DeleteLocalSymbols</buildArg>
    
    <!-- 启动优化 -->
    <buildArg>--initialize-at-build-time</buildArg>
    
    <!-- 大小优化 -->
    <buildArg>-H:+StripDebugInfo</buildArg>
</buildArgs>
```

### C.5.2 运行时优化

**JVM 参数**:
```bash
# 内存限制
-Xmx128m

# GC 配置
-XX:+UseSerialGC
-XX:MaxGCPauseMillis=1

# 其他优化
-XX:+UnlockExperimentalVMOptions
-XX:+UseJVMCICompiler
```

## C.6 性能对比

### C.6.1 启动时间

| 模式 | 启动时间 | 改进 |
|------|----------|------|
| JVM | 2.8s | - |
| JVM + AOT | 1.5s | 46% |
| **Native Image** | **0.05s** | **98%** |

### C.6.2 内存占用

| 模式 | 堆内存 | 总内存 | 改进 |
|------|--------|--------|------|
| JVM | 180MB | 256MB | - |
| **Native Image** | **30MB** | **45MB** | **82%** |

### C.6.3 包大小

| 模式 | 大小 | 改进 |
|------|------|------|
| JAR | 50MB | - |
| JAR + 依赖 | 80MB | - |
| **Native Image** | **60MB** | **25%** |

## C.7 常见问题

### C.7.1 ClassNotFoundException

**问题**: 运行时找不到类

**解决方案**:
```java
@RegisterReflectionForBinding({MyClass.class, AnotherClass.class})
public class MyConfiguration {
}
```

### C.7.2 资源文件找不到

**问题**: 无法加载资源文件

**解决方案**:
```java
@ImportRuntimeHints(MyRuntimeHints.class)
public class Application {
}

class MyRuntimeHints implements RuntimeHintsRegistrar {
    @Override
    public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
        hints.resources().registerPattern("data/*.json");
    }
}
```

### C.7.3 构建失败

**问题**: Native Image 构建失败

**诊断**:
```bash
# 启用详细日志
./mvnw -Pnative native:compile -Dverbose=true

# 生成构建报告
-H:+PrintAnalysisCallTree
```

## C.8 最佳实践

### C.8.1 开发建议

1. **早期测试**: 尽早测试 Native Image 构建
2. **增量迁移**: 逐步迁移到 Native Image
3. **配置管理**: 集中管理配置提示
4. **持续集成**: 在 CI/CD 中集成 Native Image 构建

### C.8.2 生产部署

**Kubernetes Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-native
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: myapp:native
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 5  # 快速启动
          periodSeconds: 10
```

### C.8.3 监控

**Prometheus 指标**:
```yaml
management:
  endpoints:
    web:
      exposure:
        include: prometheus,health,metrics
  metrics:
    tags:
      application: ${spring.application.name}
      mode: native
```

## C.9 小结

✅ **核心优势**
- 启动时间: 0.05s (98% 提升)
- 内存占用: 45MB (82% 降低)
- 包大小: 60MB (25% 减少)

✅ **适用场景**
- 云原生应用
- Serverless 函数
- 容器化部署
- 资源受限环境

✅ **注意事项**
- 需要配置提示
- 构建时间较长
- 某些库可能不兼容

---

**相关章节**:
- [第12章：GraalVM Native Image 增强](/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html)
- [第15章：性能提升详解](/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html)
