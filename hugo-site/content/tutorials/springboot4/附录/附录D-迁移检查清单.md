---
title: 附录D：迁移检查清单
description: 附录D：迁移检查清单 概述 本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。 D.1
  迁移前检查 D.1.1 环境检查 [ ] JDK 版本 [ ] 已安装 JDK 21 或更高版本 [ ] 验证 java version 输出正确 [ ]
  IDE 配置了 JDK 21 [ ] CI/CD 环境已更新 [ ] 构建工...
url: /springboot4/E9_99_84_E5_BD_95/d.html
layout: tutorial
kind: tutorial
series: springboot4
seriesTitle: Spring Boot 4教程
weight: 2
tags:
  - Spring Boot
  - Spring Framework
  - Java
  - 教程
draft: false
---

# 附录D：迁移检查清单

## 概述

本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。

## D.1 迁移前检查

### D.1.1 环境检查

- [ ] **JDK 版本**
  - [ ] 已安装 JDK 21 或更高版本
  - [ ] 验证 `java -version` 输出正确
  - [ ] IDE 配置了 JDK 21
  - [ ] CI/CD 环境已更新

- [ ] **构建工具**
  - [ ] Maven >= 3.9.0 或 Gradle >= 8.5
  - [ ] 验证构建工具版本
  - [ ] 更新构建脚本

- [ ] **IDE 支持**
  - [ ] IntelliJ IDEA >= 2024.1
  - [ ] VS Code 已安装 Java 扩展
  - [ ] 配置了 Java 21 支持

### D.1.2 依赖检查

- [ ] **核心依赖**
  - [ ] 检查所有依赖的 Spring Boot 4 兼容性
  - [ ] 列出需要升级的依赖
  - [ ] 识别不兼容的依赖
  - [ ] 准备替代方案

- [ ] **第三方库**
  - [ ] 检查数据库驱动兼容性
  - [ ] 检查 ORM 框架版本
  - [ ] 检查消息队列客户端
  - [ ] 检查其他关键库

- [ ] **自定义库**
  - [ ] 检查内部库兼容性
  - [ ] 计划内部库升级
  - [ ] 测试内部库

### D.1.3 代码审查

- [ ] **废弃 API 使用**
  - [ ] 搜索 RestTemplate 使用
  - [ ] 搜索 WebSecurityConfigurerAdapter
  - [ ] 搜索 @EnableGlobalMethodSecurity
  - [ ] 搜索其他废弃 API

- [ ] **配置文件**
  - [ ] 检查 application.yml/properties
  - [ ] 识别废弃的配置属性
  - [ ] 准备配置迁移方案

- [ ] **自定义配置类**
  - [ ] 检查自动配置类
  - [ ] 检查 Bean 定义
  - [ ] 检查条件注解

## D.2 迁移执行清单

### D.2.1 代码迁移

- [ ] **更新 pom.xml/build.gradle**
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

- [ ] **替换 RestTemplate**
  - [ ] 创建 HTTP Interface
  - [ ] 配置 HTTP 客户端
  - [ ] 替换所有 RestTemplate 调用
  - [ ] 测试 HTTP 调用

- [ ] **更新 Security 配置**
  - [ ] 移除 WebSecurityConfigurerAdapter
  - [ ] 使用 SecurityFilterChain
  - [ ] 更新为 Lambda DSL
  - [ ] 测试安全配置

- [ ] **更新方法安全**
  - [ ] 替换 @EnableGlobalMethodSecurity
  - [ ] 使用 @EnableMethodSecurity
  - [ ] 测试方法级安全

- [ ] **更新数据访问代码**
  - [ ] 使用新的 Limit API
  - [ ] 使用滚动查询
  - [ ] 更新 Repository 方法
  - [ ] 测试数据访问

### D.2.2 配置迁移

- [ ] **更新 application.yml**
  ```yaml
  # 启用虚拟线程
  spring:
    threads:
      virtual:
        enabled: true
  
  # 更新数据库初始化配置
  spring:
    sql:
      init:
        mode: always  # 替代 datasource.initialization-mode
  
  # 启用 Problem Details
  spring:
    mvc:
      problemdetails:
        enabled: true
  ```

- [ ] **更新数据库连接池**
  ```yaml
  spring:
    datasource:
      hikari:
        maximum-pool-size: 20  # 减少连接数
        minimum-idle: 5
  ```

- [ ] **配置 AOT**
  ```yaml
  spring:
    aot:
      enabled: true
  ```

### D.2.3 测试迁移

- [ ] **单元测试**
  - [ ] 更新测试依赖
  - [ ] 修复失败的测试
  - [ ] 添加虚拟线程测试
  - [ ] 验证测试覆盖率

- [ ] **集成测试**
  - [ ] 更新测试配置
  - [ ] 测试数据库集成
  - [ ] 测试消息队列
  - [ ] 测试外部服务调用

- [ ] **性能测试**
  - [ ] 基准测试
  - [ ] 压力测试
  - [ ] 对比测试结果

## D.3 迁移后验证

### D.3.1 功能验证

- [ ] **应用启动**
  - [ ] 应用正常启动
  - [ ] 检查启动日志
  - [ ] 验证虚拟线程已启用
  - [ ] 检查启动时间

- [ ] **核心功能**
  - [ ] 用户认证和授权
  - [ ] 数据库操作
  - [ ] API 端点
  - [ ] 消息处理
  - [ ] 文件上传/下载

- [ ] **集成功能**
  - [ ] 第三方服务调用
  - [ ] 消息队列
  - [ ] 缓存
  - [ ] 定时任务

### D.3.2 性能验证

- [ ] **启动性能**
  - [ ] 记录启动时间
  - [ ] 对比 Boot 3 启动时间
  - [ ] 验证改进幅度

- [ ] **运行时性能**
  - [ ] HTTP 吞吐量测试
  - [ ] 数据库查询性能
  - [ ] 消息处理性能
  - [ ] 内存占用

- [ ] **资源使用**
  - [ ] CPU 使用率
  - [ ] 内存使用
  - [ ] 线程数量
  - [ ] 数据库连接数

### D.3.3 监控验证

- [ ] **Actuator 端点**
  - [ ] /actuator/health
  - [ ] /actuator/metrics
  - [ ] /actuator/prometheus
  - [ ] 虚拟线程指标

- [ ] **日志**
  - [ ] 检查应用日志
  - [ ] 检查错误日志
  - [ ] 验证日志格式
  - [ ] 配置日志级别

- [ ] **追踪**
  - [ ] 分布式追踪
  - [ ] 请求追踪
  - [ ] 性能追踪

## D.4 生产部署清单

### D.4.1 部署前准备

- [ ] **备份**
  - [ ] 备份数据库
  - [ ] 备份配置文件
  - [ ] 备份当前版本
  - [ ] 准备回滚方案

- [ ] **环境准备**
  - [ ] 生产环境 JDK 21
  - [ ] 更新环境变量
  - [ ] 更新配置
  - [ ] 准备监控

- [ ] **部署计划**
  - [ ] 制定部署时间表
  - [ ] 准备回滚计划
  - [ ] 通知相关人员
  - [ ] 准备应急预案

### D.4.2 部署执行

- [ ] **灰度发布**
  - [ ] 部署到 1% 流量
  - [ ] 监控关键指标
  - [ ] 逐步增加流量
  - [ ] 全量发布

- [ ] **监控**
  - [ ] 实时监控应用状态
  - [ ] 监控错误率
  - [ ] 监控性能指标
  - [ ] 监控资源使用

- [ ] **验证**
  - [ ] 功能验证
  - [ ] 性能验证
  - [ ] 用户反馈
  - [ ] 错误日志

### D.4.3 部署后检查

- [ ] **稳定性检查**
  - [ ] 运行 24 小时无重大问题
  - [ ] 错误率在正常范围
  - [ ] 性能指标达标
  - [ ] 用户反馈正常

- [ ] **性能对比**
  - [ ] 启动时间改善
  - [ ] 吞吐量提升
  - [ ] 延迟降低
  - [ ] 资源使用优化

- [ ] **文档更新**
  - [ ] 更新部署文档
  - [ ] 更新运维手册
  - [ ] 记录问题和解决方案
  - [ ] 分享经验教训

## D.5 回滚清单

### D.5.1 回滚触发条件

- [ ] **严重问题**
  - [ ] 应用无法启动
  - [ ] 核心功能失效
  - [ ] 数据丢失或损坏
  - [ ] 严重性能问题

- [ ] **性能问题**
  - [ ] 响应时间增加 > 50%
  - [ ] 错误率 > 5%
  - [ ] 资源使用异常
  - [ ] 用户投诉增加

### D.5.2 回滚步骤

- [ ] **准备回滚**
  - [ ] 确认回滚版本
  - [ ] 准备回滚脚本
  - [ ] 通知相关人员
  - [ ] 停止新流量

- [ ] **执行回滚**
  - [ ] 部署旧版本
  - [ ] 恢复配置
  - [ ] 验证功能
  - [ ] 恢复流量

- [ ] **验证回滚**
  - [ ] 应用正常运行
  - [ ] 功能正常
  - [ ] 性能恢复
  - [ ] 用户反馈

## D.6 常见问题检查

- [ ] **编译错误**
  - [ ] 检查 JDK 版本
  - [ ] 检查依赖版本
  - [ ] 检查 API 变更

- [ ] **运行时错误**
  - [ ] 检查配置文件
  - [ ] 检查环境变量
  - [ ] 检查日志

- [ ] **性能问题**
  - [ ] 虚拟线程是否启用
  - [ ] 连接池配置
  - [ ] JVM 参数

## D.7 成功标准

### D.7.1 技术指标

- [ ] 启动时间 < 1.5s
- [ ] HTTP 吞吐量提升 > 100%
- [ ] 内存使用降低 > 20%
- [ ] 错误率 < 0.1%

### D.7.2 业务指标

- [ ] 用户体验改善
- [ ] 响应时间降低
- [ ] 系统稳定性提升
- [ ] 运维成本降低

---

**使用建议**:
1. 打印本清单
2. 逐项检查
3. 记录问题
4. 及时解决

**相关章节**:
- [第17章：从 Spring Boot 3 迁移](/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html)
- [附录A：完整对比表](/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html)
- [附录E：常见问题 FAQ](/springboot4/E9_99_84_E5_BD_95/e-faq.html)
