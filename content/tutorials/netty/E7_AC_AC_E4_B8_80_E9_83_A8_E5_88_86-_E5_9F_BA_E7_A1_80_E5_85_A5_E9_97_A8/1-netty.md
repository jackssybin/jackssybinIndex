---
title: "第1章：Netty 简介与环境搭建"
permalink: "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html"
description: "第1章：Netty 简介与环境搭建 1.1 什么是 Netty 1.1.1 Netty 的定义 Netty 是一个异步事件驱动的网络应用框架，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如 TCP 和 UDP 套接字服务器的开发。 1.1.2 Netty 的核心特点 1. 设计优雅 统..."
---

<h1>第1章：Netty 简介与环境搭建</h1>
<h2>1.1 什么是 Netty</h2>
<h3>1.1.1 Netty 的定义</h3>
<p>Netty 是一个<strong>异步事件驱动的网络应用框架</strong>，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如 TCP 和 UDP 套接字服务器的开发。</p>
<h3>1.1.2 Netty 的核心特点</h3>
<ol>
<li>
<p><strong>设计优雅</strong></p>
<ul>
<li>统一的 API，支持多种传输类型（阻塞和非阻塞）</li>
<li>简单而强大的线程模型</li>
<li>真正的无连接数据报套接字支持</li>
</ul>
</li>
<li>
<p><strong>易于使用</strong></p>
<ul>
<li>详细的 Javadoc 和大量示例</li>
<li>不需要额外的依赖，JDK 5+ 即可</li>
</ul>
</li>
<li>
<p><strong>高性能</strong></p>
<ul>
<li>吞吐量更高，延迟更低</li>
<li>减少资源消耗</li>
<li>最小化不必要的内存复制</li>
</ul>
</li>
<li>
<p><strong>安全</strong></p>
<ul>
<li>完整的 SSL/TLS 和 StartTLS 支持</li>
<li>可在 Applet 与 Android 的限制环境运行</li>
</ul>
</li>
<li>
<p><strong>社区活跃</strong></p>
<ul>
<li>持续更新和维护</li>
<li>大量成功的商业/开源项目使用</li>
</ul>
</li>
</ol>
<h3>1.1.3 Netty 的发展历史</h3>
<table>
<thead>
<tr>
<th>版本</th>
<th>发布时间</th>
<th>主要特性</th>
</tr>
</thead>
<tbody>
<tr>
<td>Netty 3.x</td>
<td>2008年</td>
<td>首个稳定版本，奠定基础架构</td>
</tr>
<tr>
<td>Netty 4.x</td>
<td>2013年</td>
<td>重大重构，性能大幅提升，目前主流版本</td>
</tr>
<tr>
<td>Netty 5.x</td>
<td>2015年（已废弃）</td>
<td>实验性版本，后被官方放弃</td>
</tr>
</tbody>
</table>
<p><strong>注意</strong>：目前推荐使用 Netty 4.1.x 系列，这是最稳定和广泛使用的版本。</p>
<hr>
<h2>1.2 Netty 的应用场景</h2>
<h3>1.2.1 互联网行业</h3>
<ol>
<li>
<p><strong>RPC 框架</strong></p>
<ul>
<li>Dubbo：阿里巴巴的分布式服务框架</li>
<li>gRPC：Google 的高性能 RPC 框架</li>
<li>Apache Thrift</li>
</ul>
</li>
<li>
<p><strong>消息中间件</strong></p>
<ul>
<li>RocketMQ：阿里巴巴的消息中间件</li>
<li>Kafka：部分网络层使用 Netty</li>
</ul>
</li>
<li>
<p><strong>即时通讯</strong></p>
<ul>
<li>微信、QQ 等 IM 系统</li>
<li>实时聊天应用</li>
<li>推送服务</li>
</ul>
</li>
<li>
<p><strong>游戏服务器</strong></p>
<ul>
<li>网络游戏服务端</li>
<li>实时对战游戏</li>
<li>棋牌游戏平台</li>
</ul>
</li>
</ol>
<h3>1.2.2 大数据领域</h3>
<ol>
<li>
<p><strong>Hadoop 生态</strong></p>
<ul>
<li>Apache Spark：使用 Netty 进行节点间通信</li>
<li>Apache Flink：网络层基于 Netty</li>
<li>Apache Storm</li>
</ul>
</li>
<li>
<p><strong>数据库</strong></p>
<ul>
<li>Cassandra：分布式数据库</li>
<li>HBase：使用 Netty 进行 RPC 通信</li>
</ul>
</li>
</ol>
<h3>1.2.3 其他应用</h3>
<ul>
<li><strong>API 网关</strong>：如 Spring Cloud Gateway</li>
<li><strong>代理服务器</strong>：HTTP/SOCKS 代理</li>
<li><strong>物联网</strong>：设备通信、数据采集</li>
<li><strong>流媒体</strong>：视频直播、音频传输</li>
</ul>
<hr>
<h2>1.3 Netty 的核心优势</h2>
<h3>1.3.1 相比传统 Java NIO 的优势</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>Java NIO</th>
<th>Netty</th>
</tr>
</thead>
<tbody>
<tr>
<td>API 复杂度</td>
<td>复杂，需要深入理解</td>
<td>简单易用，封装良好</td>
</tr>
<tr>
<td>线程模型</td>
<td>需要自己实现</td>
<td>内置 Reactor 线程模型</td>
</tr>
<tr>
<td>ByteBuffer</td>
<td>功能有限，API 不友好</td>
<td>ByteBuf 功能强大</td>
</tr>
<tr>
<td>粘包/拆包</td>
<td>需要手动处理</td>
<td>提供多种解码器</td>
</tr>
<tr>
<td>断线重连</td>
<td>需要自己实现</td>
<td>提供现成方案</td>
</tr>
<tr>
<td>内存泄漏</td>
<td>容易出现</td>
<td>引用计数机制</td>
</tr>
<tr>
<td>性能优化</td>
<td>需要深入优化</td>
<td>已经高度优化</td>
</tr>
</tbody>
</table>
<h3>1.3.2 技术优势详解</h3>
<p><strong>1. 零拷贝（Zero-Copy）</strong></p>
<pre><code>传统方式：
硬盘 → 内核缓冲区 → 用户缓冲区 → Socket缓冲区 → 网卡
       (拷贝1)      (拷贝2)      (拷贝3)
<p>Netty零拷贝：
硬盘 → 内核缓冲区 → 网卡
(拷贝1)
</code></pre></p>
<p><strong>2. 内存池技术</strong></p>
<ul>
<li>减少 GC 压力</li>
<li>提高内存分配效率</li>
<li>支持堆内和堆外内存</li>
</ul>
<p><strong>3. 高效的 Reactor 线程模型</strong></p>
<pre><code>Boss线程组（接收连接）
    ↓
Worker线程组（处理I/O）
    ↓
业务线程池（处理业务逻辑）
</code></pre>
<p><strong>4. 无锁化串行设计</strong></p>
<ul>
<li>每个 Channel 绑定到一个 EventLoop</li>
<li>避免多线程竞争</li>
<li>提高性能</li>
</ul>
<hr>
<h2>1.4 开发环境准备</h2>
<h3>1.4.1 JDK 安装</h3>
<p><strong>推荐版本</strong>：JDK 8 / JDK 11 / JDK 17</p>
<p><strong>验证安装</strong>：</p>
<pre><code class="language-bash">java -version
javac -version
</code></pre>
<p><strong>预期输出</strong>：</p>
<pre><code>java version &quot;1.8.0_301&quot;
Java(TM) SE Runtime Environment (build 1.8.0_301-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.301-b09, mixed mode)
</code></pre>
<h3>1.4.2 Maven 配置</h3>
<p><strong>1. 创建 Maven 项目</strong></p>
<p>项目结构：</p>
<pre><code>netty-demo/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
        └── java/
</code></pre>
<p><strong>2. pom.xml 配置</strong></p>
<pre><code class="language-xml">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;
         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;
         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;
    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
<pre><code>&amp;lt;groupId&amp;gt;com.netty.tutorial&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;netty-demo&amp;lt;/artifactId&amp;gt;
&amp;lt;version&amp;gt;1.0-SNAPSHOT&amp;lt;/version&amp;gt;
&amp;lt;packaging&amp;gt;jar&amp;lt;/packaging&amp;gt;
<p>&amp;lt;name&amp;gt;Netty Tutorial Demo&amp;lt;/name&amp;gt;
&amp;lt;description&amp;gt;Netty从入门到精通示例代码&amp;lt;/description&amp;gt;</p>
<p>&amp;lt;properties&amp;gt;
&amp;lt;project.build.sourceEncoding&amp;gt;UTF-8&amp;lt;/project.build.sourceEncoding&amp;gt;
&amp;lt;maven.compiler.source&amp;gt;1.8&amp;lt;/maven.compiler.source&amp;gt;
&amp;lt;maven.compiler.target&amp;gt;1.8&amp;lt;/maven.compiler.target&amp;gt;
&amp;lt;netty.version&amp;gt;4.1.100.Final&amp;lt;/netty.version&amp;gt;
&amp;lt;slf4j.version&amp;gt;1.7.36&amp;lt;/slf4j.version&amp;gt;
&amp;lt;logback.version&amp;gt;1.2.11&amp;lt;/logback.version&amp;gt;
&amp;lt;/properties&amp;gt;</p>
<p>&amp;lt;dependencies&amp;gt;
&amp;lt;!-- Netty核心依赖 --&amp;gt;
&amp;lt;dependency&amp;gt;
&amp;lt;groupId&amp;gt;io.netty&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;netty-all&amp;lt;/artifactId&amp;gt;
&amp;lt;version&amp;gt;${netty.version}&amp;lt;/version&amp;gt;
&amp;lt;/dependency&amp;gt;</p>
<pre><code>&amp;amp;lt;!-- 日志依赖 --&amp;amp;gt;
&amp;amp;lt;dependency&amp;amp;gt;
    &amp;amp;lt;groupId&amp;amp;gt;org.slf4j&amp;amp;lt;/groupId&amp;amp;gt;
    &amp;amp;lt;artifactId&amp;amp;gt;slf4j-api&amp;amp;lt;/artifactId&amp;amp;gt;
    &amp;amp;lt;version&amp;amp;gt;${slf4j.version}&amp;amp;lt;/version&amp;amp;gt;
&amp;amp;lt;/dependency&amp;amp;gt;
&amp;amp;lt;dependency&amp;amp;gt;
    &amp;amp;lt;groupId&amp;amp;gt;ch.qos.logback&amp;amp;lt;/groupId&amp;amp;gt;
    &amp;amp;lt;artifactId&amp;amp;gt;logback-classic&amp;amp;lt;/artifactId&amp;amp;gt;
    &amp;amp;lt;version&amp;amp;gt;${logback.version}&amp;amp;lt;/version&amp;amp;gt;
&amp;amp;lt;/dependency&amp;amp;gt;

&amp;amp;lt;!-- 单元测试 --&amp;amp;gt;
&amp;amp;lt;dependency&amp;amp;gt;
    &amp;amp;lt;groupId&amp;amp;gt;junit&amp;amp;lt;/groupId&amp;amp;gt;
    &amp;amp;lt;artifactId&amp;amp;gt;junit&amp;amp;lt;/artifactId&amp;amp;gt;
    &amp;amp;lt;version&amp;amp;gt;4.13.2&amp;amp;lt;/version&amp;amp;gt;
    &amp;amp;lt;scope&amp;amp;gt;test&amp;amp;lt;/scope&amp;amp;gt;
&amp;amp;lt;/dependency&amp;amp;gt;
</code></pre>
<p>&amp;lt;/dependencies&amp;gt;</p>
<p>&amp;lt;build&amp;gt;
&amp;lt;plugins&amp;gt;
&amp;lt;plugin&amp;gt;
&amp;lt;groupId&amp;gt;org.apache.maven.plugins&amp;lt;/groupId&amp;gt;
&amp;lt;artifactId&amp;gt;maven-compiler-plugin&amp;lt;/artifactId&amp;gt;
&amp;lt;version&amp;gt;3.8.1&amp;lt;/version&amp;gt;
&amp;lt;configuration&amp;gt;
&amp;lt;source&amp;gt;1.8&amp;lt;/source&amp;gt;
&amp;lt;target&amp;gt;1.8&amp;lt;/target&amp;gt;
&amp;lt;/configuration&amp;gt;
&amp;lt;/plugin&amp;gt;
&amp;lt;/plugins&amp;gt;
&amp;lt;/build&amp;gt;
</code></pre></p>
<p>&lt;/project&gt;
</code></pre></p>
<h3>1.4.3 IDE 配置（IntelliJ IDEA）</h3>
<p><strong>1. 导入项目</strong></p>
<ul>
<li>File → Open → 选择项目目录</li>
<li>等待 Maven 依赖下载完成</li>
</ul>
<p><strong>2. 配置 JDK</strong></p>
<ul>
<li>File → Project Structure → Project</li>
<li>设置 Project SDK 为 JDK 8+</li>
</ul>
<p><strong>3. 配置编码</strong></p>
<ul>
<li>File → Settings → Editor → File Encodings</li>
<li>设置为 UTF-8</li>
</ul>
<h3>1.4.4 日志配置</h3>
<p>创建 <code>src/main/resources/logback.xml</code>：</p>
<pre><code class="language-xml">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;
&lt;configuration&gt;
    &lt;appender name=&quot;CONSOLE&quot; class=&quot;ch.qos.logback.core.ConsoleAppender&quot;&gt;
        &lt;encoder&gt;
            &lt;pattern&gt;%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n&lt;/pattern&gt;
        &lt;/encoder&gt;
    &lt;/appender&gt;
<pre><code>&amp;lt;root level=&amp;quot;INFO&amp;quot;&amp;gt;
    &amp;lt;appender-ref ref=&amp;quot;CONSOLE&amp;quot;/&amp;gt;
&amp;lt;/root&amp;gt;
<p>&amp;lt;!-- Netty日志级别 --&amp;gt;
&amp;lt;logger name=&amp;quot;io.netty&amp;quot; level=&amp;quot;INFO&amp;quot;/&amp;gt;
</code></pre></p>
<p>&lt;/configuration&gt;
</code></pre></p>
<hr>
<h2>1.5 第一个 Netty 程序（Hello World）</h2>
<h3>1.5.1 服务端实现</h3>
<pre><code class="language-java">package com.netty.tutorial.hello;
<p>import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>/**</p>
<ul>
<li>
<p>Netty Hello World 服务端</p>
</li>
<li>
<p>功能：接收客户端消息并回复
*/
public class HelloWorldServer {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(HelloWorldServer.class);</p>
<p>private final int port;</p>
<p>public HelloWorldServer(int port) {
this.port = port;
}</p>
<p>public void start() throws InterruptedException {
// 1. 创建两个线程组
// bossGroup: 负责接收客户端连接
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
// workerGroup: 负责处理已建立连接的I/O操作
EventLoopGroup workerGroup = new NioEventLoopGroup();</p>
<pre><code> try {
     // 2. 创建服务端启动引导类
     ServerBootstrap bootstrap = new ServerBootstrap();
<pre><code> // 3. 配置启动参数
 bootstrap.group(bossGroup, workerGroup)
         // 指定使用NIO传输Channel
         .channel(NioServerSocketChannel.class)
         // 设置服务端连接队列大小
         .option(ChannelOption.SO_BACKLOG, 128)
         // 设置保持连接
         .childOption(ChannelOption.SO_KEEPALIVE, true)
         // 配置Channel初始化器
         .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
             @Override
             protected void initChannel(SocketChannel ch) {
                 // 获取Pipeline
                 ChannelPipeline pipeline = ch.pipeline();
                 
                 // 添加字符串解码器
                 pipeline.addLast(&amp;amp;quot;decoder&amp;amp;quot;, new StringDecoder());
                 // 添加字符串编码器
                 pipeline.addLast(&amp;amp;quot;encoder&amp;amp;quot;, new StringEncoder());
                 // 添加业务处理器
                 pipeline.addLast(&amp;amp;quot;handler&amp;amp;quot;, new HelloWorldServerHandler());
             }
         });
 
 // 4. 绑定端口，开始接收连接
 ChannelFuture future = bootstrap.bind(port).sync();
 logger.info(&amp;amp;quot;Netty服务器启动成功，监听端口: {}&amp;amp;quot;, port);
 
 // 5. 等待服务器socket关闭
 future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
// 6. 优雅关闭线程组
workerGroup.shutdownGracefully();
bossGroup.shutdownGracefully();
<a href="http://logger.info">logger.info</a>(&amp;quot;Netty服务器已关闭&amp;quot;);
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws InterruptedException {
new HelloWorldServer(8080).start();
}
}
</code></pre></p>
</li>
</ul>
<p><strong>服务端业务处理器</strong>：</p>
<pre><code class="language-java">package com.netty.tutorial.hello;
<p>import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>/**</p>
<ul>
<li>
<p>服务端业务处理器
*/
public class HelloWorldServerHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(HelloWorldServerHandler.class);</p>
<p>/**</p>
<ul>
<li>连接建立时调用
*/
@Override
public void channelActive(ChannelHandlerContext ctx) {
<a href="http://logger.info">logger.info</a>(&quot;客户端连接成功: {}&quot;, ctx.channel().remoteAddress());
}</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>接收到消息时调用
*/
@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
<a href="http://logger.info">logger.info</a>(&quot;收到客户端消息: {}&quot;, msg);</p>
<p>// 回复客户端
String response = &quot;服务器收到: &quot; + msg;
ctx.writeAndFlush(response);</p>
<p><a href="http://logger.info">logger.info</a>(&quot;回复客户端: {}&quot;, response);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>连接断开时调用
*/
@Override
public void channelInactive(ChannelHandlerContext ctx) {
<a href="http://logger.info">logger.info</a>(&quot;客户端断开连接: {}&quot;, ctx.channel().remoteAddress());
}</li>
</ul>
<p>/**</p>
<ul>
<li>异常处理
*/
@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
logger.error(&quot;发生异常: &quot;, cause);
ctx.close();
}
}
</code></pre></li>
</ul>
</li>
</ul>
<h3>1.5.2 客户端实现</h3>
<pre><code class="language-java">package com.netty.tutorial.hello;
<p>import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>import java.util.Scanner;</p>
<p>/**</p>
<ul>
<li>
<p>Netty Hello World 客户端</p>
</li>
<li>
<p>功能：连接服务器并发送消息
*/
public class HelloWorldClient {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(HelloWorldClient.class);</p>
<p>private final String host;
private final int port;</p>
<p>public HelloWorldClient(String host, int port) {
this.host = host;
this.port = port;
}</p>
<p>public void start() throws InterruptedException {
// 1. 创建客户端线程组
EventLoopGroup group = new NioEventLoopGroup();</p>
<pre><code> try {
     // 2. 创建客户端启动引导类
     Bootstrap bootstrap = new Bootstrap();
<pre><code> // 3. 配置启动参数
 bootstrap.group(group)
         // 指定使用NIO传输Channel
         .channel(NioSocketChannel.class)
         // 配置Channel初始化器
         .handler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
             @Override
             protected void initChannel(SocketChannel ch) {
                 ChannelPipeline pipeline = ch.pipeline();
                 
                 // 添加字符串解码器
                 pipeline.addLast(&amp;amp;quot;decoder&amp;amp;quot;, new StringDecoder());
                 // 添加字符串编码器
                 pipeline.addLast(&amp;amp;quot;encoder&amp;amp;quot;, new StringEncoder());
                 // 添加业务处理器
                 pipeline.addLast(&amp;amp;quot;handler&amp;amp;quot;, new HelloWorldClientHandler());
             }
         });
 
 // 4. 连接服务器
 ChannelFuture future = bootstrap.connect(host, port).sync();
 logger.info(&amp;amp;quot;连接服务器成功: {}:{}&amp;amp;quot;, host, port);
 
 Channel channel = future.channel();
 
 // 5. 发送消息
 Scanner scanner = new Scanner(System.in);
 logger.info(&amp;amp;quot;请输入消息（输入'quit'退出）：&amp;amp;quot;);
 
 while (scanner.hasNextLine()) {
     String line = scanner.nextLine();
     if (&amp;amp;quot;quit&amp;amp;quot;.equalsIgnoreCase(line)) {
         break;
     }
     
     // 发送消息到服务器
     channel.writeAndFlush(line);
 }
 
 // 6. 关闭连接
 channel.close().sync();
</code></pre>
<p>} finally {
// 7. 优雅关闭线程组
group.shutdownGracefully();
<a href="http://logger.info">logger.info</a>(&amp;quot;客户端已关闭&amp;quot;);
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws InterruptedException {
new HelloWorldClient(&quot;localhost&quot;, 8080).start();
}
}
</code></pre></p>
</li>
</ul>
<p><strong>客户端业务处理器</strong>：</p>
<pre><code class="language-java">package com.netty.tutorial.hello;
<p>import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>/**</p>
<ul>
<li>
<p>客户端业务处理器
*/
public class HelloWorldClientHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(HelloWorldClientHandler.class);</p>
<p>/**</p>
<ul>
<li>连接建立时调用
*/
@Override
public void channelActive(ChannelHandlerContext ctx) {
<a href="http://logger.info">logger.info</a>(&quot;成功连接到服务器: {}&quot;, ctx.channel().remoteAddress());
}</li>
</ul>
<p>/**</p>
<ul>
<li>接收到消息时调用
*/
@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
<a href="http://logger.info">logger.info</a>(&quot;收到服务器响应: {}&quot;, msg);
}</li>
</ul>
<p>/**</p>
<ul>
<li>异常处理
*/
@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
logger.error(&quot;发生异常: &quot;, cause);
ctx.close();
}
}
</code></pre></li>
</ul>
</li>
</ul>
<h3>1.5.3 运行测试</h3>
<p><strong>1. 启动服务端</strong></p>
<pre><code>运行 HelloWorldServer.main()
控制台输出：
15:30:00.123 [main] INFO  HelloWorldServer - Netty服务器启动成功，监听端口: 8080
</code></pre>
<p><strong>2. 启动客户端</strong></p>
<pre><code>运行 HelloWorldClient.main()
控制台输出：
15:30:05.456 [main] INFO  HelloWorldClient - 连接服务器成功: localhost:8080
15:30:05.457 [nioEventLoopGroup-2-1] INFO  HelloWorldClientHandler - 成功连接到服务器: localhost/127.0.0.1:8080
请输入消息（输入'quit'退出）：
</code></pre>
<p><strong>3. 发送消息</strong></p>
<pre><code>客户端输入：Hello Netty!
<p>客户端输出：
15:30:10.789 [nioEventLoopGroup-2-1] INFO  HelloWorldClientHandler - 收到服务器响应: 服务器收到: Hello Netty!</p>
<p>服务端输出：
15:30:10.788 [nioEventLoopGroup-3-1] INFO  HelloWorldServerHandler - 收到客户端消息: Hello Netty!
15:30:10.789 [nioEventLoopGroup-3-1] INFO  HelloWorldServerHandler - 回复客户端: 服务器收到: Hello Netty!
</code></pre></p>
<hr>
<h2>1.6 项目代码：简单的 Echo 服务器</h2>
<p>Echo 服务器是一个经典的网络编程示例，它会将接收到的数据原封不动地发送回客户端。</p>
<h3>1.6.1 Echo 服务端</h3>
<pre><code class="language-java">package com.netty.tutorial.echo;
<p>import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>/**</p>
<ul>
<li>
<p>Echo服务器 - 回显服务器</p>
</li>
<li>
<p>将接收到的数据原封不动地发送回客户端
*/
public class EchoServer {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(EchoServer.class);</p>
<p>private final int port;</p>
<p>public EchoServer(int port) {
this.port = port;
}</p>
<p>public void start() throws InterruptedException {
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
EventLoopGroup workerGroup = new NioEventLoopGroup();</p>
<pre><code> try {
     ServerBootstrap bootstrap = new ServerBootstrap();
     bootstrap.group(bossGroup, workerGroup)
             .channel(NioServerSocketChannel.class)
             .option(ChannelOption.SO_BACKLOG, 128)
             .childOption(ChannelOption.SO_KEEPALIVE, true)
             .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                 @Override
                 protected void initChannel(SocketChannel ch) {
                     ch.pipeline().addLast(new EchoServerHandler());
                 }
             });
<pre><code> ChannelFuture future = bootstrap.bind(port).sync();
 logger.info(&amp;amp;quot;Echo服务器启动成功，监听端口: {}&amp;amp;quot;, port);
 
 future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
workerGroup.shutdownGracefully();
bossGroup.shutdownGracefully();
<a href="http://logger.info">logger.info</a>(&amp;quot;Echo服务器已关闭&amp;quot;);
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws InterruptedException {
new EchoServer(8888).start();
}
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>Echo服务器处理器
*/
class EchoServerHandler extends ChannelInboundHandlerAdapter {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(EchoServerHandler.class);</p>
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
ByteBuf in = (ByteBuf) msg;</p>
<pre><code> // 读取接收到的数据
 String received = in.toString(CharsetUtil.UTF_8);
 logger.info(&amp;quot;服务器接收到: {}&amp;quot;, received);
<p>// 将数据原封不动地写回客户端
ctx.write(in);
</code></pre></p>
<p>}</p>
<p>@Override
public void channelReadComplete(ChannelHandlerContext ctx) {
// 将缓冲区的数据刷新到网络
ctx.flush();
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
logger.error(&quot;发生异常: &quot;, cause);
ctx.close();
}
}
</code></pre></p>
</li>
</ul>
<h3>1.6.2 Echo 客户端</h3>
<pre><code class="language-java">package com.netty.tutorial.echo;
<p>import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;</p>
<p>/**</p>
<ul>
<li>
<p>Echo客户端
*/
public class EchoClient {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(EchoClient.class);</p>
<p>private final String host;
private final int port;</p>
<p>public EchoClient(String host, int port) {
this.host = host;
this.port = port;
}</p>
<p>public void start() throws InterruptedException {
EventLoopGroup group = new NioEventLoopGroup();</p>
<pre><code> try {
     Bootstrap bootstrap = new Bootstrap();
     bootstrap.group(group)
             .channel(NioSocketChannel.class)
             .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                 @Override
                 protected void initChannel(SocketChannel ch) {
                     ch.pipeline().addLast(new EchoClientHandler());
                 }
             });
<pre><code> ChannelFuture future = bootstrap.connect(host, port).sync();
 logger.info(&amp;amp;quot;Echo客户端连接成功: {}:{}&amp;amp;quot;, host, port);
 
 future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
group.shutdownGracefully();
<a href="http://logger.info">logger.info</a>(&amp;quot;Echo客户端已关闭&amp;quot;);
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws InterruptedException {
new EchoClient(&quot;localhost&quot;, 8888).start();
}
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>Echo客户端处理器
*/
class EchoClientHandler extends ChannelInboundHandlerAdapter {</p>
<p>private static final Logger logger = LoggerFactory.getLogger(EchoClientHandler.class);</p>
<p>@Override
public void channelActive(ChannelHandlerContext ctx) {
// 连接建立后，发送消息
String message = &quot;Hello, Echo Server! 你好，回显服务器！&quot;;
ByteBuf buf = Unpooled.copiedBuffer(message, CharsetUtil.UTF_8);
ctx.writeAndFlush(buf);
<a href="http://logger.info">logger.info</a>(&quot;发送消息: {}&quot;, message);
}</p>
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
ByteBuf in = (ByteBuf) msg;
String received = in.toString(CharsetUtil.UTF_8);
<a href="http://logger.info">logger.info</a>(&quot;接收到回显: {}&quot;, received);</p>
<pre><code> // 释放ByteBuf
 in.release();
</code></pre>
<p>}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
logger.error(&quot;发生异常: &quot;, cause);
ctx.close();
}
}
</code></pre></p>
</li>
</ul>
<hr>
<h2>1.7 代码解析</h2>
<h3>1.7.1 核心组件说明</h3>
<table>
<thead>
<tr>
<th>组件</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>EventLoopGroup</strong></td>
<td>事件循环组，管理多个EventLoop</td>
</tr>
<tr>
<td><strong>ServerBootstrap</strong></td>
<td>服务端启动引导类</td>
</tr>
<tr>
<td><strong>Bootstrap</strong></td>
<td>客户端启动引导类</td>
</tr>
<tr>
<td><strong>Channel</strong></td>
<td>网络通道，代表一个连接</td>
</tr>
<tr>
<td><strong>ChannelHandler</strong></td>
<td>处理器，处理I/O事件</td>
</tr>
<tr>
<td><strong>ChannelPipeline</strong></td>
<td>处理器链，管理多个Handler</td>
</tr>
<tr>
<td><strong>ByteBuf</strong></td>
<td>字节缓冲区，Netty的数据容器</td>
</tr>
</tbody>
</table>
<h3>1.7.2 执行流程</h3>
<p><strong>服务端启动流程</strong>：</p>
<pre><code>1. 创建EventLoopGroup（bossGroup和workerGroup）
2. 创建ServerBootstrap
3. 配置Channel类型和参数
4. 设置ChannelHandler
5. 绑定端口
6. 等待连接
</code></pre>
<p><strong>客户端连接流程</strong>：</p>
<pre><code>1. 创建EventLoopGroup
2. 创建Bootstrap
3. 配置Channel类型和参数
4. 设置ChannelHandler
5. 连接服务器
6. 发送/接收数据
</code></pre>
<hr>
<h2>1.8 本章小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>Netty 的基本概念</strong>：异步事件驱动的网络框架<br>
✅ <strong>Netty 的应用场景</strong>：RPC、消息中间件、IM、游戏等<br>
✅ <strong>Netty 的核心优势</strong>：高性能、易用、零拷贝、内存池<br>
✅ <strong>开发环境搭建</strong>：JDK、Maven、IDE配置<br>
✅ <strong>第一个程序</strong>：Hello World 示例<br>
✅ <strong>Echo 服务器</strong>：经典的回显服务器实现</p>
<h3>关键要点</h3>
<ol>
<li>Netty 是基于 Java NIO 的高性能网络框架</li>
<li>使用 Reactor 线程模型，分离连接接收和I/O处理</li>
<li>通过 ChannelPipeline 实现责任链模式</li>
<li>ByteBuf 是 Netty 的核心数据容器</li>
</ol>
<h3>下一章预告</h3>
<p>下一章我们将深入学习<strong>网络编程基础</strong>，包括：</p>
<ul>
<li>BIO、NIO、AIO 的区别</li>
<li>Java NIO 核心组件</li>
<li>传统 Socket 编程的问题</li>
<li>Netty 如何优雅地解决这些问题</li>
</ul>
<hr>
<h2>练习题</h2>
<ol>
<li><strong>基础题</strong>：修改 Hello World 示例，让服务器在回复时加上时间戳</li>
<li><strong>进阶题</strong>：实现一个简单的计算器服务器，客户端发送表达式（如&quot;1+2&quot;），服务器返回计算结果</li>
<li><strong>挑战题</strong>：实现一个支持多客户端的聊天室，客户端发送的消息会广播给所有连接的客户端</li>
</ol>
<p><strong>提示</strong>：可以使用 <code>ChannelGroup</code> 来管理多个客户端连接。</p>
<hr>
<p><strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html">第2章：网络编程基础</a></p>
