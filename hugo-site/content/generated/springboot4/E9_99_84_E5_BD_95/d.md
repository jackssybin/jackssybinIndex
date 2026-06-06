---
title: 附录D：迁移检查清单 - Spring Boot 4教程
description: 附录D：迁移检查清单 概述 本附录提供完整的 Spring Boot 3 到 4 迁移检查清单，确保迁移过程顺利进行。 D.1
  迁移前检查 D.1.1 环境检查 [ ] JDK 版本 [ ] 已安装 JDK 21 或更高版本 [ ] 验证 java version 输出正确 [ ]
  IDE 配置了 JDK 21 [ ] CI/CD 环境已更新 [ ] 构建工...
url: /springboot4/E9_99_84_E5_BD_95/d.html
kind: page
---

<header>
    <div class="banner">
        <div class="fn-clear wrapper">
            <h1 class="fn-inline"><a href="/" rel="start">jackssybin 的个人博客</a></h1>
            <small> &nbsp; 记录精彩的程序人生</small>
        </div>
    </div>
    <div class="navbar">
        <div class="fn-clear wrapper">
            <nav class="fn-left">
                <a href="/"><i class="icon-home"></i> 首页</a>
                <a href="/my-github-repos" target="_self" rel="section"><img class="page-icon" src="/images/github-icon.png" alt="">我的开源</a>
<a href="https://blog.csdn.net/jackssybin" target="_self" rel="section">我的scdn</a>
                <a href="/tutorials.html" rel="section"><i class="icon-list"></i> 教程中心</a>
                <a href="/news.html" rel="section"><i class="icon-list"></i> 实时新闻</a>
                <a href="/topics.html" rel="section"><i class="icon-list"></i> 专题</a>
                <a href="/nav.html" rel="section"><i class="icon-link"></i> 网址导航</a>
                <a href="/tags.html" rel="section"><i class="icon-tags"></i> 标签墙</a>
                <a href="/archives.html"><i class="icon-inbox"></i> 存档</a>
                <a href="/about.html" rel="section"><i class="icon-user"></i> 关于本站</a>
                <a rel="archive" href="/links.html"><i class="icon-link"></i> 友情链接</a>
                <a rel="alternate" href="/rss.xml" rel="section"><i class="icon-rss"></i> RSS</a>
            </nav>
            <div class="fn-right">
                <button class="theme-toggle" type="button" aria-label="切换黑夜模式" title="切换黑夜模式" data-theme-toggle>夜</button>
                <form class="form" action="/search.html" method="get">
                    <input placeholder="搜索文章标题" id="search" type="text" name="keyword">
                    <button type="submit"><i class="icon-search"></i></button>
                </form>
            </div>
        </div>
    </div>
</header>
<div class="wrapper">
    <div class="main-wrap">
        <main class="other">
    <div class="title"><h2><i class="icon-list"></i>&nbsp;附录D：迁移检查清单</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>Spring Boot 4教程目录</h3>
    <section>
      <h4>第一部分-_概览</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E6_A6_82_E8_A7_88/1-springboot4.html">第1章：Spring Boot 4 简介</a>
    </section>
<section>
      <h4>第二部分-_核心框架</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/2-springframework7.html">第2章：Spring Framework 7.0 新特性</a>
<a class="" href="/springboot4/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E6_A1_86_E6_9E_B6/3.html">第3章：依赖注入与配置改进</a>
    </section>
<section>
      <h4>web</h4>
      <a class="" href="/springboot4/web/4-springmvc-webflux.html">第4章：Spring MVC 与 WebFlux 增强</a>
<a class="" href="/springboot4/web/5-websocket-sse.html">第5章：WebSocket 与 Server-Sent Events 改进</a>
    </section>
<section>
      <h4>第四部分-_数据访问</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html">第6章：Spring Data 4.0 新特性</a>
<a class="" href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/7.html">第7章：事务管理改进</a>
    </section>
<section>
      <h4>第五部分-_安全性</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_BA_94_E9_83_A8_E5_88_86-_E5_AE_89_E5_85_A8_E6_80_A7/8-springsecurity7.html">第8章：Spring Security 7.0 新特性</a>
    </section>
<section>
      <h4>第六部分-_观察性</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_85_AD_E9_83_A8_E5_88_86-_E8_A7_82_E5_AF_9F_E6_80_A7/9-micrometer-observability.html">第9章：Micrometer 与 Observability</a>
    </section>
<section>
      <h4>第七部分-_消息集成</h4>
      <a class="" href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/10-kafka.html">第10章：Spring for Apache Kafka 升级</a>
<a class="" href="/springboot4/E7_AC_AC_E4_B8_83_E9_83_A8_E5_88_86-_E6_B6_88_E6_81_AF_E9_9B_86_E6_88_90/11-springintegration.html">第11章：Spring Integration 改进</a>
    </section>
<section>
      <h4>第八部分-_云原生</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/12-graalvm.html">第12章：GraalVM Native Image 增强</a>
<a class="" href="/springboot4/E7_AC_AC_E5_85_AB_E9_83_A8_E5_88_86-_E4_BA_91_E5_8E_9F_E7_94_9F/13-docker-k8s.html">第13章：Docker 与 Kubernetes 集成</a>
    </section>
<section>
      <h4>第十部分-_性能优化</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E9_83_A8_E5_88_86-_E6_80_A7_E8_83_BD_E4_BC_98_E5_8C_96/15.html">第15章：性能提升详解</a>
    </section>
<section>
      <h4>第十一部分-_迁移</h4>
      <a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/16-api.html">第16章：废弃 API 与替代方案</a>
<a class="" href="/springboot4/E7_AC_AC_E5_8D_81_E4_B8_80_E9_83_A8_E5_88_86-_E8_BF_81_E7_A7_BB/17-boot3.html">第17章：从 Spring Boot 3 迁移</a>
    </section>
<section>
      <h4>附录</h4>
      <a class="" href="/springboot4/E9_99_84_E5_BD_95/a-boot3vs4.html">附录A：Spring Boot 3 vs 4 完整对比表</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/b.html">附录B：虚拟线程最佳实践</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html">附录C：GraalVM Native Image 指南</a>
<a class="current" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a>
<a class="" href="/springboot4/E9_99_84_E5_BD_95/e-faq.html">附录E：常见问题 FAQ</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/springboot4/E9_99_84_E5_BD_95/d.html">附录D：迁移检查清单</a></h2>
            <div class="meta"><span>Spring Boot 4教程 / 附录</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>附录D：迁移检查清单</h1>
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
</ul></div>
          <footer class="rel fn-clear ft__center">
            <a href="/springboot4/E9_99_84_E5_BD_95/c-graalvm.html" class="fn-left">上一篇：附录C：GraalVM Native Image 指南</a>
            <a href="/springboot4/E9_99_84_E5_BD_95/e-faq.html" class="fn-right">下一篇：附录E：常见问题 FAQ</a>
          </footer>
        </article>
      </main>
    </section>
</main>
        <aside>
    <section>
        <div class="module">
            <header><h2>专题</h2></header>
            <main class="topic-list">
                <a href="/topics/java-jvm.html">Java 与 JVM</a>
<a href="/topics/spring-backend.html">Spring Boot 与后端框架</a>
<a href="/topics/ai-agent.html">AI、Agent 与本地模型</a>
<a href="/topics/mysql-data.html">MySQL 与数据架构</a>
<a href="/topics/linux-ops.html">Linux 运维与部署</a>
<a href="/topics/python-crawler.html">Python 爬虫与自动化</a>
<a href="/topics/middleware-distributed.html">中间件与分布式</a>
<a href="/topics/tools-blog.html">工具、效率与博客建设</a>
            </main>
        </div>
        <div class="module">
            <header><h2>标签</h2></header>
            <main>
                <a rel="tag" href="/tags/Python.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="24 篇文章">Python</a>
<a rel="tag" href="/tags/Java.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="18 篇文章">Java</a>
<a rel="tag" href="/tags/CentOS.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">CentOS</a>
<a rel="tag" href="/tags/MySQL.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="10 篇文章">MySQL</a>
<a rel="tag" href="/tags/Python_20_E7_88_AC_E8_99_AB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="9 篇文章">Python 爬虫</a>
<a rel="tag" href="/tags/JVM.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="8 篇文章">JVM</a>
<a rel="tag" href="/tags/Linux.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Linux</a>
<a rel="tag" href="/tags/Scrapy.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="6 篇文章">Scrapy</a>
<a rel="tag" href="/tags/E5_9E_83_E5_9C_BE_E5_9B_9E_E6_94_B6_E7_AE_97_E6_B3_95.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">垃圾回收算法</a>
<a rel="tag" href="/tags/Spring_20Batch.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Batch</a>
<a rel="tag" href="/tags/Spring_20Boot.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="4 篇文章">Spring Boot</a>
<a rel="tag" href="/tags/E5_A4_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">大表优化</a>
<a rel="tag" href="/tags/E8_B0_83_E4_BC_98.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">调优</a>
<a rel="tag" href="/tags/E9_AB_98_E5_B9_B6_E5_8F_91.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">高并发</a>
<a rel="tag" href="/tags/E5_86_B7_E7_83_AD_E5_88_86_E7_A6_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">冷热分离</a>
<a rel="tag" href="/tags/E5_8D_83_E4_B8_87_E7_BA_A7_E8_A1_A8_E4_BC_98_E5_8C_96.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">千万级表优化</a>
<a rel="tag" href="/tags/E7_BA_BF_E7_A8_8B.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">线程</a>
<a rel="tag" href="/tags/Nginx.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="3 篇文章">Nginx</a>
<a rel="tag" href="/tags/E5_BE_85_E5_88_86_E7_B1_BB.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">待分类</a>
<a rel="tag" href="/tags/E5_BC_80_E6_BA_90.html" class="tag vditor-tooltipped vditor-tooltipped__n" aria-label="2 篇文章">开源</a>
            </main>
        </div>
        <div class="module tutorial-sidebar">
            <header><h2>教程中心</h2></header>
            <main>
                <a class="tutorial-sidebar-card" href="/mysql.html">
        <strong>MySQL</strong>
        <span>34 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/springboot4.html">
        <strong>Spring Boot 4</strong>
        <span>21 篇教程</span>
    </a>
<a class="tutorial-sidebar-card" href="/netty.html">
        <strong>Netty</strong>
        <span>16 篇教程</span>
    </a>
                <a class="tutorial-sidebar-more" href="/tutorials.html">查看全部教程 &raquo;</a>
            </main>
        </div>
        <div class="module meta">
            <header><h2 class="ft__center"><a href="https://github.com/jackssybin" target="_blank" rel="noopener">GitHub</a></h2></header>
            <main class="fn__clear">
                <img src="/images/sidebar-avatar.jpg" aria-label="88250">
                <div class="fn-right">
                    <a href="/archives.html">106 <span class="ft-gray">文章</span></a><br>
                    3 <span class="ft-gray">友链</span>
                </div>
            </main>
        </div>
    </section>
</aside>
    </div>
</div>
<footer class="footer fn-clear">
    &copy; 2026
    <a href="/">jackssybin 的个人博客</a>
    <br>
    Powered by <a href="https://github.com/adlered/bolo-solo" target="_blank" rel="noopener">Bolo</a>
    <span class="ft-warn">&heartsuit;</span>
    Theme bolo-9IPHP
    <sup>[<a href="https://github.com/9IPHP/9IPHP" target="_blank" rel="noopener">ref</a>]</sup>
    by <a href="http://vanessa.b3log.org" target="_blank" rel="noopener">Vanessa</a>
</footer>
