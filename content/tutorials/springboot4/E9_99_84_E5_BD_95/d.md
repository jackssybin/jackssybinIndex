---
title: "附录D：迁移检查清单"
permalink: "/springboot4/E9_99_84_E5_BD_95/d.html"
description: "附录D：迁移检查清单 概述 本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。 D.1 迁移前检查 D.1.1 环境检查 [ ] JDK 版本 [ ] 已安装 JDK 21 或更高版本 [ ] 验证 java version 输出正确 [ ] IDE 配置了 JDK 21 [ ] CI/CD 环境已更新 [ ] 构建工..."
---

<h1>附录D：迁移检查清单</h1>
<h2>概述</h2>
<p>本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。</p>
<h2>D.1 迁移前检查</h2>
<h3>D.1.1 环境检查</h3>
<ul>
<li>
<p>[ ] <strong>JDK 版本</strong></p>
<ul>
<li>[ ] 已安装 JDK 21 或更高版本</li>
<li>[ ] 验证 <code>java -version</code> 输出正确</li>
<li>[ ] IDE 配置了 JDK 21</li>
<li>[ ] CI/CD 环境已更新</li>
</ul>
</li>
<li>
<p>[ ] <strong>构建工具</strong></p>
<ul>
<li>[ ] Maven &gt;= 3.9.0 或 Gradle &gt;= 8.5</li>
<li>[ ] 验证构建工具版本</li>
<li>[ ] 更新构建脚本</li>
</ul>
</li>
<li>
<p>[ ] <strong>IDE 支持</strong></p>
<ul>
<li>[ ] IntelliJ IDEA &gt;= 2024.1</li>
<li>[ ] VS Code 已安装 Java 扩展</li>
<li>[ ] 配置了 Java 21 支持</li>
</ul>
</li>
</ul>
<h3>D.1.2 依赖检查</h3>
<ul>
<li>
<p>[ ] <strong>核心依赖</strong></p>
<ul>
<li>[ ] 检查所有依赖的 Spring Boot 4 兼容性</li>
<li>[ ] 列出需要升级的依赖</li>
<li>[ ] 识别不兼容的依赖</li>
<li>[ ] 准备替代方案</li>
</ul>
</li>
<li>
<p>[ ] <strong>第三方库</strong></p>
<ul>
<li>[ ] 检查数据库驱动兼容性</li>
<li>[ ] 检查 ORM 框架版本</li>
<li>[ ] 检查消息队列客户端</li>
<li>[ ] 检查其他关键库</li>
</ul>
</li>
<li>
<p>[ ] <strong>自定义库</strong></p>
<ul>
<li>[ ] 检查内部库兼容性</li>
<li>[ ] 计划内部库升级</li>
<li>[ ] 测试内部库</li>
</ul>
</li>
</ul>
<h3>D.1.3 代码审查</h3>
<ul>
<li>
<p>[ ] <strong>废弃 API 使用</strong></p>
<ul>
<li>[ ] 搜索 RestTemplate 使用</li>
<li>[ ] 搜索 WebSecurityConfigurerAdapter</li>
<li>[ ] 搜索 @EnableGlobalMethodSecurity</li>
<li>[ ] 搜索其他废弃 API</li>
</ul>
</li>
<li>
<p>[ ] <strong>配置文件</strong></p>
<ul>
<li>[ ] 检查 application.yml/properties</li>
<li>[ ] 识别废弃的配置属性</li>
<li>[ ] 准备配置迁移方案</li>
</ul>
</li>
<li>
<p>[ ] <strong>自定义配置类</strong></p>
<ul>
<li>[ ] 检查自动配置类</li>
<li>[ ] 检查 Bean 定义</li>
<li>[ ] 检查条件注解</li>
</ul>
</li>
</ul>
<h2>D.2 迁移执行清单</h2>
<h3>D.2.1 代码迁移</h3>
<ul>
<li>
<p>[ ] <strong>更新 pom.xml/build.gradle</strong></p>
<pre><code class="language-xml">&lt;parent&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
    &lt;version&gt;4.0.0&lt;/version&gt;
&lt;/parent&gt;
&lt;properties&gt;
    &lt;java.version&gt;21&lt;/java.version&gt;
&lt;/properties&gt;
</code></pre>
</li>
<li>
<p>[ ] <strong>替换 RestTemplate</strong></p>
<ul>
<li>[ ] 创建 HTTP Interface</li>
<li>[ ] 配置 HTTP 客户端</li>
<li>[ ] 替换所有 RestTemplate 调用</li>
<li>[ ] 测试 HTTP 调用</li>
</ul>
</li>
<li>
<p>[ ] <strong>更新 Security 配置</strong></p>
<ul>
<li>[ ] 移除 WebSecurityConfigurerAdapter</li>
<li>[ ] 使用 SecurityFilterChain</li>
<li>[ ] 更新为 Lambda DSL</li>
<li>[ ] 测试安全配置</li>
</ul>
</li>
<li>
<p>[ ] <strong>更新方法安全</strong></p>
<ul>
<li>[ ] 替换 @EnableGlobalMethodSecurity</li>
<li>[ ] 使用 @EnableMethodSecurity</li>
<li>[ ] 测试方法级安全</li>
</ul>
</li>
<li>
<p>[ ] <strong>更新数据访问代码</strong></p>
<ul>
<li>[ ] 使用新的 Limit API</li>
<li>[ ] 使用滚动查询</li>
<li>[ ] 更新 Repository 方法</li>
<li>[ ] 测试数据访问</li>
</ul>
</li>
</ul>
<h3>D.2.2 配置迁移</h3>
<ul>
<li>
<p>[ ] <strong>更新 application.yml</strong></p>
<pre><code class="language-yaml"># 启用虚拟线程
spring:
  threads:
    virtual:
      enabled: true
<h1>更新数据库初始化配置</h1>
<p>spring:
sql:
init:
mode: always  # 替代 datasource.initialization-mode</p>
<h1>启用 Problem Details</h1>
<p>spring:
mvc:
problemdetails:
enabled: true
</code></pre></p>
</li>
<li>
<p>[ ] <strong>更新数据库连接池</strong></p>
<pre><code class="language-yaml">spring:
  datasource:
    hikari:
      maximum-pool-size: 20  # 减少连接数
      minimum-idle: 5
</code></pre>
</li>
<li>
<p>[ ] <strong>配置 AOT</strong></p>
<pre><code class="language-yaml">spring:
  aot:
    enabled: true
</code></pre>
</li>
</ul>
<h3>D.2.3 测试迁移</h3>
<ul>
<li>
<p>[ ] <strong>单元测试</strong></p>
<ul>
<li>[ ] 更新测试依赖</li>
<li>[ ] 修复失败的测试</li>
<li>[ ] 添加虚拟线程测试</li>
<li>[ ] 验证测试覆盖率</li>
</ul>
</li>
<li>
<p>[ ] <strong>集成测试</strong></p>
<ul>
<li>[ ] 更新测试配置</li>
<li>[ ] 测试数据库集成</li>
<li>[ ] 测试消息队列</li>
<li>[ ] 测试外部服务调用</li>
</ul>
</li>
<li>
<p>[ ] <strong>性能测试</strong></p>
<ul>
<li>[ ] 基准测试</li>
<li>[ ] 压力测试</li>
<li>[ ] 对比测试结果</li>
</ul>
</li>
</ul>
<h2>D.3 迁移后验证</h2>
<h3>D.3.1 功能验证</h3>
<ul>
<li>
<p>[ ] <strong>应用启动</strong></p>
<ul>
<li>[ ] 应用正常启动</li>
<li>[ ] 检查启动日志</li>
<li>[ ] 验证虚拟线程已启用</li>
<li>[ ] 检查启动时间</li>
</ul>
</li>
<li>
<p>[ ] <strong>核心功能</strong></p>
<ul>
<li>[ ] 用户认证和授权</li>
<li>[ ] 数据库操作</li>
<li>[ ] API 端点</li>
<li>[ ] 消息处理</li>
<li>[ ] 文件上传/下载</li>
</ul>
</li>
<li>
<p>[ ] <strong>集成功能</strong></p>
<ul>
<li>[ ] 第三方服务调用</li>
<li>[ ] 消息队列</li>
<li>[ ] 缓存</li>
<li>[ ] 定时任务</li>
</ul>
</li>
</ul>
<h3>D.3.2 性能验证</h3>
<ul>
<li>
<p>[ ] <strong>启动性能</strong></p>
<ul>
<li>[ ] 记录启动时间</li>
<li>[ ] 对比 Boot 3 启动时间</li>
<li>[ ] 验证改进幅度</li>
</ul>
</li>
<li>
<p>[ ] <strong>运行时性能</strong></p>
<ul>
<li>[ ] HTTP 吞吐量测试</li>
<li>[ ] 数据库查询性能</li>
<li>[ ] 消息处理性能</li>
<li>[ ] 内存占用</li>
</ul>
</li>
<li>
<p>[ ] <strong>资源使用</strong></p>
<ul>
<li>[ ] CPU 使用率</li>
<li>[ ] 内存使用</li>
<li>[ ] 线程数量</li>
<li>[ ] 数据库连接数</li>
</ul>
</li>
</ul>
<h3>D.3.3 监控验证</h3>
<ul>
<li>
<p>[ ] <strong>Actuator 端点</strong></p>
<ul>
<li>[ ] /actuator/health</li>
<li>[ ] /actuator/metrics</li>
<li>[ ] /actuator/prometheus</li>
<li>[ ] 虚拟线程指标</li>
</ul>
</li>
<li>
<p>[ ] <strong>日志</strong></p>
<ul>
<li>[ ] 检查应用日志</li>
<li>[ ] 检查错误日志</li>
<li>[ ] 验证日志格式</li>
<li>[ ] 配置日志级别</li>
</ul>
</li>
<li>
<p>[ ] <strong>追踪</strong></p>
<ul>
<li>[ ] 分布式追踪</li>
<li>[ ] 请求追踪</li>
<li>[ ] 性能追踪</li>
</ul>
</li>
</ul>
<h2>D.4 生产部署清单</h2>
<h3>D.4.1 部署前准备</h3>
<ul>
<li>
<p>[ ] <strong>备份</strong></p>
<ul>
<li>[ ] 备份数据库</li>
<li>[ ] 备份配置文件</li>
<li>[ ] 备份当前版本</li>
<li>[ ] 准备回滚方案</li>
</ul>
</li>
<li>
<p>[ ] <strong>环境准备</strong></p>
<ul>
<li>[ ] 生产环境 JDK 21</li>
<li>[ ] 更新环境变量</li>
<li>[ ] 更新配置</li>
<li>[ ] 准备监控</li>
</ul>
</li>
<li>
<p>[ ] <strong>部署计划</strong></p>
<ul>
<li>[ ] 制定部署时间表</li>
<li>[ ] 准备回滚计划</li>
<li>[ ] 通知相关人员</li>
<li>[ ] 准备应急预案</li>
</ul>
</li>
</ul>
<h3>D.4.2 部署执行</h3>
<ul>
<li>
<p>[ ] <strong>灰度发布</strong></p>
<ul>
<li>[ ] 部署到 1% 流量</li>
<li>[ ] 监控关键指标</li>
<li>[ ] 逐步增加流量</li>
<li>[ ] 全量发布</li>
</ul>
</li>
<li>
<p>[ ] <strong>监控</strong></p>
<ul>
<li>[ ] 实时监控应用状态</li>
<li>[ ] 监控错误率</li>
<li>[ ] 监控性能指标</li>
<li>[ ] 监控资源使用</li>
</ul>
</li>
<li>
<p>[ ] <strong>验证</strong></p>
<ul>
<li>[ ] 功能验证</li>
<li>[ ] 性能验证</li>
<li>[ ] 用户反馈</li>
<li>[ ] 错误日志</li>
</ul>
</li>
</ul>
<h3>D.4.3 部署后检查</h3>
<ul>
<li>
<p>[ ] <strong>稳定性检查</strong></p>
<ul>
<li>[ ] 运行 24 小时无重大问题</li>
<li>[ ] 错误率在正常范围</li>
<li>[ ] 性能指标达标</li>
<li>[ ] 用户反馈正常</li>
</ul>
</li>
<li>
<p>[ ] <strong>性能对比</strong></p>
<ul>
<li>[ ] 启动时间改善</li>
<li>[ ] 吞吐量提升</li>
<li>[ ] 延迟降低</li>
<li>[ ] 资源使用优化</li>
</ul>
</li>
<li>
<p>[ ] <strong>文档更新</strong></p>
<ul>
<li>[ ] 更新部署文档</li>
<li>[ ] 更新运维手册</li>
<li>[ ] 记录问题和解决方案</li>
<li>[ ] 分享经验教训</li>
</ul>
</li>
</ul>
<h2>D.5 回滚清单</h2>
<h3>D.5.1 回滚触发条件</h3>
<ul>
<li>
<p>[ ] <strong>严重问题</strong></p>
<ul>
<li>[ ] 应用无法启动</li>
<li>[ ] 核心功能失效</li>
<li>[ ] 数据丢失或损坏</li>
<li>[ ] 严重性能问题</li>
</ul>
</li>
<li>
<p>[ ] <strong>性能问题</strong></p>
<ul>
<li>[ ] 响应时间增加 &gt; 50%</li>
<li>[ ] 错误率 &gt; 5%</li>
<li>[ ] 资源使用异常</li>
<li>[ ] 用户投诉增加</li>
</ul>
</li>
</ul>
<h3>D.5.2 回滚步骤</h3>
<ul>
<li>
<p>[ ] <strong>准备回滚</strong></p>
<ul>
<li>[ ] 确认回滚版本</li>
<li>[ ] 准备回滚脚本</li>
<li>[ ] 通知相关人员</li>
<li>[ ] 停止新流量</li>
</ul>
</li>
<li>
<p>[ ] <strong>执行回滚</strong></p>
<ul>
<li>[ ] 部署旧版本</li>
<li>[ ] 恢复配置</li>
<li>[ ] 验证功能</li>
<li>[ ] 恢复流量</li>
</ul>
</li>
<li>
<p>[ ] <strong>验证回滚</strong></p>
<ul>
<li>[ ] 应用正常运行</li>
<li>[ ] 功能正常</li>
<li>[ ] 性能恢复</li>
<li>[ ] 用户反馈</li>
</ul>
</li>
</ul>
<h2>D.6 常见问题检查</h2>
<ul>
<li>
<p>[ ] <strong>编译错误</strong></p>
<ul>
<li>[ ] 检查 JDK 版本</li>
<li>[ ] 检查依赖版本</li>
<li>[ ] 检查 API 变更</li>
</ul>
</li>
<li>
<p>[ ] <strong>运行时错误</strong></p>
<ul>
<li>[ ] 检查配置文件</li>
<li>[ ] 检查环境变量</li>
<li>[ ] 检查日志</li>
</ul>
</li>
<li>
<p>[ ] <strong>性能问题</strong></p>
<ul>
<li>[ ] 虚拟线程是否启用</li>
<li>[ ] 连接池配置</li>
<li>[ ] JVM 参数</li>
</ul>
</li>
</ul>
<h2>D.7 成功标准</h2>
<h3>D.7.1 技术指标</h3>
<ul>
<li>[ ] 启动时间 &lt; 1.5s</li>
<li>[ ] HTTP 吞吐量提升 &gt; 100%</li>
<li>[ ] 内存使用降低 &gt; 20%</li>
<li>[ ] 错误率 &lt; 0.1%</li>
</ul>
<h3>D.7.2 业务指标</h3>
<ul>
<li>[ ] 用户体验改善</li>
<li>[ ] 响应时间降低</li>
<li>[ ] 系统稳定性提升</li>
<li>[ ] 运维成本降低</li>
</ul>
<hr>
<p><strong>使用建议</strong>:</p>
<ol>
<li>打印本清单</li>
<li>逐项检查</li>
<li>记录问题</li>
<li>及时解决</li>
</ol>
<p><strong>相关章节</strong>:</p>
<ul>
<li><a href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a></li>
<li><a href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：完整对比表</a></li>
<li><a href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a></li>
</ul>
