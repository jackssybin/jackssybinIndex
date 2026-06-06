---
title: 第4章：Bootstrap 启动器 - Netty教程
description: 第4章：Bootstrap 启动器 本章导读 Bootstrap 是 Netty
  应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和
  Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。 4.1 Bootstrap 概述 4.1.1 Bootstrap 的作用 定义
  ：Bootstra...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第4章：Bootstrap 启动器</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>Netty教程目录</h3>
    <section>
      <h4>第一部分-_基础入门</h4>
      <a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html">第1章：Netty 简介与环境搭建</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html">第2章：网络编程基础</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html">第3章：Netty 核心组件</a>
<a class="current" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap 启动器</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html">第5章：ChannelHandler 详解</a>
    </section>
<section>
      <h4>第二部分-_核心特性</h4>
      <a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html">第6章：ByteBuf 缓冲区</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html">第7章：编解码器（Codec）</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/8.html">第8章：粘包与拆包解决方案</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html">第9章：常用协议支持</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html">第10章：EventLoop 与线程模型</a>
    </section>
<section>
      <h4>第三部分-_高级应用</h4>
      <a class="" href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html">第11章：零拷贝与高性能优化</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/12.html">第12章：心跳检测与空闲连接管理</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/13-15.html">第13-15章：高级应用（流量整形、安全机制、Spring Boot集成）</a>
    </section>
<section>
      <h4>第四部分-_实战项目</h4>
      <a class="" href="/netty/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E5_AE_9E_E6_88_98_E9_A1_B9_E7_9B_AE/16-20.html">第16-20章：实战项目合集</a>
    </section>
<section>
      <h4>第五六七部分合集</h4>
      <a class="" href="/netty/E7_AC_AC_E4_BA_94_E5_85_AD_E4_B8_83_E9_83_A8_E5_88_86_E5_90_88_E9_9B_86/21-30.html">第21-30章：性能调优、源码分析、问题排查合集</a>
    </section>
<section>
      <h4>附录</h4>
      <a class="" href="/netty/E9_99_84_E5_BD_95/E9_99_84_E5_BD_95_E5_90_88_E9_9B_86.html">附录合集（A-E）</a>
    </section>
  </aside>
      <main class="mysql-course-main">
        <article class="post post--detail mysql-article">
          <header>
            <h2><a rel="bookmark" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap 启动器</a></h2>
            <div class="meta"><span>Netty教程 / 第一部分-_基础入门</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第4章：Bootstrap 启动器</h1>
<h2>本章导读</h2>
<p>Bootstrap 是 Netty 应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和 Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。</p>
<hr>
<h2>4.1 Bootstrap 概述</h2>
<h3>4.1.1 Bootstrap 的作用</h3>
<p><strong>定义</strong>：Bootstrap 是 Netty 的启动引导类，用于配置和启动网络应用。</p>
<p><strong>核心功能</strong>：</p>
<ul>
<li>配置 EventLoopGroup</li>
<li>指定 Channel 类型</li>
<li>设置 ChannelHandler</li>
<li>配置网络参数</li>
<li>绑定端口或连接服务器</li>
</ul>
<h3>4.1.2 Bootstrap 的分类</h3>
<pre><code>AbstractBootstrap (抽象基类)
    ├── ServerBootstrap    # 服务端启动器
    └── Bootstrap          # 客户端启动器
</code></pre>
<p><strong>对比</strong>：</p>
<table>
<thead>
<tr>
<th>特性</th>
<th>ServerBootstrap</th>
<th>Bootstrap</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>用途</strong></td>
<td>服务端</td>
<td>客户端</td>
</tr>
<tr>
<td><strong>EventLoopGroup</strong></td>
<td>2个（boss + worker）</td>
<td>1个</td>
</tr>
<tr>
<td><strong>Channel</strong></td>
<td>ServerSocketChannel</td>
<td>SocketChannel</td>
</tr>
<tr>
<td><strong>操作</strong></td>
<td>bind() 绑定端口</td>
<td>connect() 连接服务器</td>
</tr>
<tr>
<td><strong>父子Channel</strong></td>
<td>有父Channel</td>
<td>无父Channel</td>
</tr>
</tbody>
</table>
<hr>
<h2>4.2 ServerBootstrap 服务端启动</h2>
<h3>4.2.1 ServerBootstrap 基本用法</h3>
<p><strong>标准启动流程</strong>：</p>
<pre><code class="language-java">public class StandardServer {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 接收连接
        EventLoopGroup workerGroup = new NioEventLoopGroup();     // 处理I/O
<pre><code>    try {
        // 2. 创建ServerBootstrap
        ServerBootstrap bootstrap = new ServerBootstrap();
<pre><code>    // 3. 配置启动参数
    bootstrap.group(bossGroup, workerGroup)               // 设置线程组
            .channel(NioServerSocketChannel.class)        // 设置Channel类型
            .option(ChannelOption.SO_BACKLOG, 128)        // 设置服务端选项
            .childOption(ChannelOption.SO_KEEPALIVE, true) // 设置客户端选项
            .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ch.pipeline().addLast(new MyServerHandler());
                }
            });
<pre><code>// 4. 绑定端口
ChannelFuture future = bootstrap.bind(8080).sync();
System.out.println(&amp;amp;amp;quot;服务器启动成功，监听端口: 8080&amp;amp;amp;quot;);

// 5. 等待服务器关闭
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
// 6. 优雅关闭
bossGroup.shutdownGracefully();
workerGroup.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.2.2 ServerBootstrap 核心方法</h3>
<p><strong>1. group() - 设置线程组</strong></p>
<pre><code class="language-java">// 方式1：设置boss和worker线程组（推荐）
bootstrap.group(bossGroup, workerGroup);
<p>// 方式2：只设置一个线程组（不推荐）
bootstrap.group(eventLoopGroup);
</code></pre></p>
<p><strong>2. channel() - 设置Channel类型</strong></p>
<pre><code class="language-java">// NIO（推荐）
bootstrap.channel(NioServerSocketChannel.class);
<p>// Epoll（Linux，性能更好）
bootstrap.channel(EpollServerSocketChannel.class);</p>
<p>// KQueue（macOS）
bootstrap.channel(KQueueServerSocketChannel.class);</p>
<p>// OIO（阻塞I/O，不推荐）
bootstrap.channel(OioServerSocketChannel.class);
</code></pre></p>
<p><strong>3. option() - 设置服务端Channel选项</strong></p>
<pre><code class="language-java">bootstrap.option(ChannelOption.SO_BACKLOG, 128)           // 连接队列大小
         .option(ChannelOption.SO_REUSEADDR, true)        // 地址重用
         .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT); // 内存分配器
</code></pre>
<p><strong>4. childOption() - 设置客户端Channel选项</strong></p>
<pre><code class="language-java">bootstrap.childOption(ChannelOption.SO_KEEPALIVE, true)   // 保持连接
         .childOption(ChannelOption.TCP_NODELAY, true)    // 禁用Nagle算法
         .childOption(ChannelOption.SO_RCVBUF, 32 * 1024) // 接收缓冲区
         .childOption(ChannelOption.SO_SNDBUF, 32 * 1024);// 发送缓冲区
</code></pre>
<p><strong>5. handler() - 设置服务端Handler</strong></p>
<pre><code class="language-java">bootstrap.handler(new LoggingHandler(LogLevel.INFO));
</code></pre>
<p><strong>6. childHandler() - 设置客户端Handler</strong></p>
<pre><code class="language-java">bootstrap.childHandler(new ChannelInitializer&lt;SocketChannel&gt;() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ch.pipeline().addLast(new MyHandler());
    }
});
</code></pre>
<p><strong>7. bind() - 绑定端口</strong></p>
<pre><code class="language-java">// 绑定指定端口
ChannelFuture future = bootstrap.bind(8080).sync();
<p>// 绑定指定地址和端口
ChannelFuture future = bootstrap.bind(&quot;0.0.0.0&quot;, 8080).sync();</p>
<p>// 绑定InetSocketAddress
ChannelFuture future = bootstrap.bind(new InetSocketAddress(8080)).sync();
</code></pre></p>
<h3>4.2.3 完整的服务端示例</h3>
<pre><code class="language-java">public class FullFeaturedServer {
<pre><code>private final int port;
<p>public FullFeaturedServer(int port) {
this.port = port;
}</p>
<p>public void start() throws Exception {
// 创建线程组
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
EventLoopGroup workerGroup = new NioEventLoopGroup();</p>
<pre><code>try {
    ServerBootstrap bootstrap = new ServerBootstrap();
    bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
<pre><code>        // 服务端选项
        .option(ChannelOption.SO_BACKLOG, 1024)
        .option(ChannelOption.SO_REUSEADDR, true)
        .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        
        // 客户端选项
        .childOption(ChannelOption.SO_KEEPALIVE, true)
        .childOption(ChannelOption.TCP_NODELAY, true)
        .childOption(ChannelOption.SO_RCVBUF, 32 * 1024)
        .childOption(ChannelOption.SO_SNDBUF, 32 * 1024)
        .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        
        // 服务端Handler（日志）
        .handler(new LoggingHandler(LogLevel.INFO))
        
        // 客户端Handler
        .childHandler(new ChannelInitializer&amp;amp;amp;lt;SocketChannel&amp;amp;amp;gt;() {
            @Override
            protected void initChannel(SocketChannel ch) {
                ChannelPipeline pipeline = ch.pipeline();
                
                // 添加编解码器
                pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
                pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
                
                // 添加业务Handler
                pipeline.addLast(new ServerBusinessHandler());
            }
        });

// 绑定端口
ChannelFuture future = bootstrap.bind(port).sync();
System.out.println(&amp;amp;amp;quot;服务器启动成功，监听端口: &amp;amp;amp;quot; + port);

// 添加关闭监听器
future.channel().closeFuture().addListener((ChannelFutureListener) f -&amp;amp;amp;gt; {
    System.out.println(&amp;amp;amp;quot;服务器已关闭&amp;amp;amp;quot;);
});

// 等待服务器关闭
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
// 优雅关闭
bossGroup.shutdownGracefully();
workerGroup.shutdownGracefully();
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws Exception {
new FullFeaturedServer(8080).start();
}
</code></pre></p>
<p>}</p>
<p>class ServerBusinessHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;客户端连接: &amp;quot; + ctx.channel().remoteAddress());
}
<p>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
System.out.println(&amp;quot;收到消息: &amp;quot; + msg);
ctx.writeAndFlush(&amp;quot;服务器收到: &amp;quot; + msg);
}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;客户端断开: &amp;quot; + ctx.channel().remoteAddress());
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;异常: &amp;quot; + cause.getMessage());
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>4.3 Bootstrap 客户端启动</h2>
<h3>4.3.1 Bootstrap 基本用法</h3>
<p><strong>标准启动流程</strong>：</p>
<pre><code class="language-java">public class StandardClient {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup group = new NioEventLoopGroup();
<pre><code>    try {
        // 2. 创建Bootstrap
        Bootstrap bootstrap = new Bootstrap();
<pre><code>    // 3. 配置启动参数
    bootstrap.group(group)                              // 设置线程组
            .channel(NioSocketChannel.class)            // 设置Channel类型
            .option(ChannelOption.SO_KEEPALIVE, true)   // 设置选项
            .handler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ch.pipeline().addLast(new MyClientHandler());
                }
            });
<pre><code>// 4. 连接服务器
ChannelFuture future = bootstrap.connect(&amp;amp;amp;quot;localhost&amp;amp;amp;quot;, 8080).sync();
System.out.println(&amp;amp;amp;quot;连接服务器成功&amp;amp;amp;quot;);

// 5. 等待连接关闭
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
// 6. 优雅关闭
group.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.3.2 Bootstrap 核心方法</h3>
<p><strong>1. group() - 设置线程组</strong></p>
<pre><code class="language-java">bootstrap.group(eventLoopGroup);
</code></pre>
<p><strong>2. channel() - 设置Channel类型</strong></p>
<pre><code class="language-java">// NIO（推荐）
bootstrap.channel(NioSocketChannel.class);
<p>// Epoll（Linux）
bootstrap.channel(EpollSocketChannel.class);</p>
<p>// KQueue（macOS）
bootstrap.channel(KQueueSocketChannel.class);
</code></pre></p>
<p><strong>3. option() - 设置Channel选项</strong></p>
<pre><code class="language-java">bootstrap.option(ChannelOption.SO_KEEPALIVE, true)
         .option(ChannelOption.TCP_NODELAY, true)
         .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)  // 连接超时
         .option(ChannelOption.SO_RCVBUF, 32 * 1024)
         .option(ChannelOption.SO_SNDBUF, 32 * 1024);
</code></pre>
<p><strong>4. handler() - 设置Handler</strong></p>
<pre><code class="language-java">bootstrap.handler(new ChannelInitializer&lt;SocketChannel&gt;() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ch.pipeline().addLast(new MyHandler());
    }
});
</code></pre>
<p><strong>5. connect() - 连接服务器</strong></p>
<pre><code class="language-java">// 连接指定主机和端口
ChannelFuture future = bootstrap.connect(&quot;localhost&quot;, 8080).sync();
<p>// 连接InetSocketAddress
ChannelFuture future = bootstrap.connect(new InetSocketAddress(&quot;localhost&quot;, 8080)).sync();
</code></pre></p>
<h3>4.3.3 完整的客户端示例</h3>
<pre><code class="language-java">public class FullFeaturedClient {
<pre><code>private final String host;
private final int port;
<p>public FullFeaturedClient(String host, int port) {
this.host = host;
this.port = port;
}</p>
<p>public void start() throws Exception {
EventLoopGroup group = new NioEventLoopGroup();</p>
<pre><code>try {
    Bootstrap bootstrap = new Bootstrap();
    bootstrap.group(group)
            .channel(NioSocketChannel.class)
<pre><code>        // 客户端选项
        .option(ChannelOption.SO_KEEPALIVE, true)
        .option(ChannelOption.TCP_NODELAY, true)
        .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
        .option(ChannelOption.SO_RCVBUF, 32 * 1024)
        .option(ChannelOption.SO_SNDBUF, 32 * 1024)
        .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        
        // Handler
        .handler(new ChannelInitializer&amp;amp;amp;lt;SocketChannel&amp;amp;amp;gt;() {
            @Override
            protected void initChannel(SocketChannel ch) {
                ChannelPipeline pipeline = ch.pipeline();
                
                // 添加编解码器
                pipeline.addLast(new StringDecoder(CharsetUtil.UTF_8));
                pipeline.addLast(new StringEncoder(CharsetUtil.UTF_8));
                
                // 添加业务Handler
                pipeline.addLast(new ClientBusinessHandler());
            }
        });

// 连接服务器
ChannelFuture future = bootstrap.connect(host, port).sync();
System.out.println(&amp;amp;amp;quot;连接服务器成功: &amp;amp;amp;quot; + host + &amp;amp;amp;quot;:&amp;amp;amp;quot; + port);

Channel channel = future.channel();

// 发送消息
Scanner scanner = new Scanner(System.in);
System.out.println(&amp;amp;amp;quot;请输入消息（输入'quit'退出）：&amp;amp;amp;quot;);

while (scanner.hasNextLine()) {
    String line = scanner.nextLine();
    if (&amp;amp;amp;quot;quit&amp;amp;amp;quot;.equalsIgnoreCase(line)) {
        break;
    }
    channel.writeAndFlush(line);
}

// 关闭连接
channel.close().sync();
</code></pre>
<p>} finally {
group.shutdownGracefully();
}
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws Exception {
new FullFeaturedClient(&amp;quot;localhost&amp;quot;, 8080).start();
}
</code></pre></p>
<p>}</p>
<p>class ClientBusinessHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;连接建立: &amp;quot; + ctx.channel().remoteAddress());
}
<p>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
System.out.println(&amp;quot;收到响应: &amp;quot; + msg);
}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;连接断开&amp;quot;);
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;异常: &amp;quot; + cause.getMessage());
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>4.4 启动参数配置详解</h2>
<h3>4.4.1 常用 ChannelOption</h3>
<p><strong>TCP 相关</strong>：</p>
<table>
<thead>
<tr>
<th>选项</th>
<th>说明</th>
<th>默认值</th>
<th>推荐值</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SO_KEEPALIVE</strong></td>
<td>TCP保活机制</td>
<td>false</td>
<td>true</td>
</tr>
<tr>
<td><strong>TCP_NODELAY</strong></td>
<td>禁用Nagle算法</td>
<td>false</td>
<td>true</td>
</tr>
<tr>
<td><strong>SO_REUSEADDR</strong></td>
<td>地址重用</td>
<td>false</td>
<td>true</td>
</tr>
<tr>
<td><strong>SO_LINGER</strong></td>
<td>关闭时等待时间</td>
<td>-1</td>
<td>0</td>
</tr>
<tr>
<td><strong>SO_TIMEOUT</strong></td>
<td>读取超时</td>
<td>0</td>
<td>30000</td>
</tr>
</tbody>
</table>
<p><strong>缓冲区相关</strong>：</p>
<table>
<thead>
<tr>
<th>选项</th>
<th>说明</th>
<th>默认值</th>
<th>推荐值</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SO_RCVBUF</strong></td>
<td>接收缓冲区大小</td>
<td>系统默认</td>
<td>32KB-64KB</td>
</tr>
<tr>
<td><strong>SO_SNDBUF</strong></td>
<td>发送缓冲区大小</td>
<td>系统默认</td>
<td>32KB-64KB</td>
</tr>
<tr>
<td><strong>RCVBUF_ALLOCATOR</strong></td>
<td>接收缓冲区分配器</td>
<td>-</td>
<td>AdaptiveRecvByteBufAllocator</td>
</tr>
<tr>
<td><strong>ALLOCATOR</strong></td>
<td>ByteBuf分配器</td>
<td>-</td>
<td>PooledByteBufAllocator</td>
</tr>
</tbody>
</table>
<p><strong>连接相关</strong>：</p>
<table>
<thead>
<tr>
<th>选项</th>
<th>说明</th>
<th>默认值</th>
<th>推荐值</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>SO_BACKLOG</strong></td>
<td>连接队列大小</td>
<td>系统默认</td>
<td>1024</td>
</tr>
<tr>
<td><strong>CONNECT_TIMEOUT_MILLIS</strong></td>
<td>连接超时时间</td>
<td>30000</td>
<td>5000</td>
</tr>
</tbody>
</table>
<p><strong>其他</strong>：</p>
<table>
<thead>
<tr>
<th>选项</th>
<th>说明</th>
<th>默认值</th>
<th>推荐值</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>WRITE_BUFFER_WATER_MARK</strong></td>
<td>写缓冲区水位线</td>
<td>-</td>
<td>new WriteBufferWaterMark(32KB, 64KB)</td>
</tr>
<tr>
<td><strong>MESSAGE_SIZE_ESTIMATOR</strong></td>
<td>消息大小估算器</td>
<td>-</td>
<td>DefaultMessageSizeEstimator</td>
</tr>
</tbody>
</table>
<h3>4.4.2 配置示例</h3>
<pre><code class="language-java">ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
<pre><code>    // 服务端选项
    .option(ChannelOption.SO_BACKLOG, 1024)
    .option(ChannelOption.SO_REUSEADDR, true)
    .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
<pre><code>// 客户端选项
.childOption(ChannelOption.SO_KEEPALIVE, true)
.childOption(ChannelOption.TCP_NODELAY, true)
.childOption(ChannelOption.SO_RCVBUF, 64 * 1024)
.childOption(ChannelOption.SO_SNDBUF, 64 * 1024)
.childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
.childOption(ChannelOption.RCVBUF_ALLOCATOR, 
        new AdaptiveRecvByteBufAllocator(64, 1024, 65536))
.childOption(ChannelOption.WRITE_BUFFER_WATER_MARK, 
        new WriteBufferWaterMark(32 * 1024, 64 * 1024));
</code></pre>
<p></code></pre></p>
<p></code></pre></p>
<h3>4.4.3 性能优化配置</h3>
<p><strong>高性能配置</strong>：</p>
<pre><code class="language-java">bootstrap
    // 使用池化内存分配器
    .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
    .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
<pre><code>// 禁用Nagle算法，减少延迟
.childOption(ChannelOption.TCP_NODELAY, true)
<p>// 增大缓冲区
.childOption(ChannelOption.SO_RCVBUF, 128 * 1024)
.childOption(ChannelOption.SO_SNDBUF, 128 * 1024)</p>
<p>// 自适应接收缓冲区
.childOption(ChannelOption.RCVBUF_ALLOCATOR,
new AdaptiveRecvByteBufAllocator(64, 2048, 65536))</p>
<p>// 设置写缓冲区水位线
.childOption(ChannelOption.WRITE_BUFFER_WATER_MARK,
new WriteBufferWaterMark(32 * 1024, 64 * 1024));
</code></pre></p>
<p></code></pre></p>
<hr>
<h2>4.5 优雅关闭机制</h2>
<h3>4.5.1 为什么需要优雅关闭</h3>
<p><strong>问题</strong>：</p>
<ul>
<li>直接关闭可能导致数据丢失</li>
<li>正在处理的请求被中断</li>
<li>资源没有正确释放</li>
</ul>
<p><strong>优雅关闭的目标</strong>：</p>
<ul>
<li>停止接收新连接</li>
<li>等待现有连接处理完成</li>
<li>释放所有资源</li>
</ul>
<h3>4.5.2 shutdownGracefully() 方法</h3>
<pre><code class="language-java">public Future&lt;?&gt; shutdownGracefully(long quietPeriod, 
                                    long timeout, 
                                    TimeUnit unit)
</code></pre>
<p><strong>参数说明</strong>：</p>
<ul>
<li><strong>quietPeriod</strong>：静默期，在此期间如果有新任务提交，则重新计时</li>
<li><strong>timeout</strong>：最大等待时间，超时后强制关闭</li>
<li><strong>unit</strong>：时间单位</li>
</ul>
<p><strong>默认值</strong>：</p>
<pre><code class="language-java">shutdownGracefully();  // quietPeriod=2秒, timeout=15秒
</code></pre>
<h3>4.5.3 优雅关闭示例</h3>
<p><strong>方式1：标准关闭</strong></p>
<pre><code class="language-java">try {
    // 启动服务器
    ChannelFuture future = bootstrap.bind(8080).sync();
    future.channel().closeFuture().sync();
} finally {
    // 优雅关闭
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
</code></pre>
<p><strong>方式2：自定义关闭参数</strong></p>
<pre><code class="language-java">finally {
    // 静默期2秒，超时15秒
    bossGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
    workerGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
}
</code></pre>
<p><strong>方式3：等待关闭完成</strong></p>
<pre><code class="language-java">finally {
    Future&lt;?&gt; bossFuture = bossGroup.shutdownGracefully();
    Future&lt;?&gt; workerFuture = workerGroup.shutdownGracefully();
<pre><code>// 等待关闭完成
bossFuture.sync();
workerFuture.sync();
<p>System.out.println(&amp;quot;所有资源已释放&amp;quot;);
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>方式4：添加关闭钩子</strong></p>
<pre><code class="language-java">public class GracefulShutdownServer {
<pre><code>private EventLoopGroup bossGroup;
private EventLoopGroup workerGroup;
<p>public void start() throws Exception {
bossGroup = new NioEventLoopGroup(1);
workerGroup = new NioEventLoopGroup();</p>
<pre><code>// 添加JVM关闭钩子
Runtime.getRuntime().addShutdownHook(new Thread(() -&amp;amp;gt; {
    System.out.println(&amp;amp;quot;收到关闭信号，开始优雅关闭...&amp;amp;quot;);
    shutdown();
}));
<p>// 启动服务器...
</code></pre></p>
<p>}</p>
<p>public void shutdown() {
if (bossGroup != null) {
bossGroup.shutdownGracefully();
}
if (workerGroup != null) {
workerGroup.shutdownGracefully();
}
System.out.println(&amp;quot;服务器已关闭&amp;quot;);
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>4.5.4 完整的优雅关闭示例</h3>
<pre><code class="language-java">public class GracefulServer {
<pre><code>private final int port;
private EventLoopGroup bossGroup;
private EventLoopGroup workerGroup;
private Channel serverChannel;
<p>public GracefulServer(int port) {
this.port = port;
}</p>
<p>public void start() throws Exception {
bossGroup = new NioEventLoopGroup(1);
workerGroup = new NioEventLoopGroup();</p>
<pre><code>try {
    ServerBootstrap bootstrap = new ServerBootstrap();
    bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ch.pipeline().addLast(new StringDecoder());
                    ch.pipeline().addLast(new StringEncoder());
                    ch.pipeline().addLast(new SimpleChannelInboundHandler&amp;amp;lt;String&amp;amp;gt;() {
                        @Override
                        protected void channelRead0(ChannelHandlerContext ctx, String msg) {
                            // 模拟耗时操作
                            try {
                                Thread.sleep(5000);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                            ctx.writeAndFlush(&amp;amp;quot;处理完成: &amp;amp;quot; + msg);
                        }
                    });
                }
            });
<pre><code>ChannelFuture future = bootstrap.bind(port).sync();
serverChannel = future.channel();
System.out.println(&amp;amp;amp;quot;服务器启动成功，监听端口: &amp;amp;amp;quot; + port);

// 添加关闭钩子
Runtime.getRuntime().addShutdownHook(new Thread(this::shutdown));

serverChannel.closeFuture().sync();
</code></pre>
<p>} finally {
shutdown();
}
</code></pre></p>
<p>}</p>
<p>public void shutdown() {
System.out.println(&amp;quot;开始优雅关闭...&amp;quot;);</p>
<pre><code>// 1. 停止接收新连接
if (serverChannel != null) {
    serverChannel.close();
}
<p>// 2. 优雅关闭线程组
if (bossGroup != null) {
bossGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
}
if (workerGroup != null) {
workerGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
}</p>
<p>System.out.println(&amp;amp;quot;服务器已关闭&amp;amp;quot;);
</code></pre></p>
<p>}</p>
<p>public static void main(String[] args) throws Exception {
new GracefulServer(8080).start();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>4.6 项目代码：完整的客户端-服务端通信</h2>
<p>本章配套代码包含：</p>
<ol>
<li><strong>标准服务器</strong>：基本的服务端启动</li>
<li><strong>标准客户端</strong>：基本的客户端启动</li>
<li><strong>完整功能服务器</strong>：包含所有配置选项</li>
<li><strong>完整功能客户端</strong>：包含所有配置选项</li>
<li><strong>优雅关闭示例</strong>：演示优雅关闭机制</li>
</ol>
<p>详细代码请参考：<a href="../../%E9%A1%B9%E7%9B%AE%E4%BB%A3%E7%A0%81/chapter04-bootstrap/">项目代码/chapter04-bootstrap</a></p>
<hr>
<h2>4.7 本章小结</h2>
<p>本章我们深入学习了 Bootstrap 启动器：</p>
<p>✅ <strong>ServerBootstrap</strong>：服务端启动器，使用 boss 和 worker 两个线程组<br>
✅ <strong>Bootstrap</strong>：客户端启动器，使用一个线程组<br>
✅ <strong>启动参数配置</strong>：ChannelOption 的各种选项<br>
✅ <strong>优雅关闭机制</strong>：shutdownGracefully() 的使用</p>
<h3>关键要点</h3>
<ol>
<li><strong>ServerBootstrap</strong> 需要两个 EventLoopGroup（boss + worker）</li>
<li><strong>Bootstrap</strong> 只需要一个 EventLoopGroup</li>
<li><strong>option()</strong> 配置服务端 Channel，<strong>childOption()</strong> 配置客户端 Channel</li>
<li><strong>优雅关闭</strong>使用 shutdownGracefully()，可以等待任务完成</li>
<li><strong>性能优化</strong>：使用池化内存、禁用 Nagle 算法、增大缓冲区</li>
</ol>
<h3>启动流程对比</h3>
<p><strong>服务端</strong>：</p>
<pre><code>创建EventLoopGroup → 创建ServerBootstrap → 配置参数 → 
绑定端口 → 等待关闭 → 优雅关闭
</code></pre>
<p><strong>客户端</strong>：</p>
<pre><code>创建EventLoopGroup → 创建Bootstrap → 配置参数 → 
连接服务器 → 发送数据 → 关闭连接 → 优雅关闭
</code></pre>
<h3>下一章预告</h3>
<p>下一章我们将学习 <strong>ChannelHandler 详解</strong>，包括：</p>
<ul>
<li>Handler 的生命周期</li>
<li>入站和出站 Handler</li>
<li>Handler 的添加和移除</li>
<li>异常处理机制</li>
</ul>
<hr>
<h2>练习题</h2>
<ol>
<li><strong>基础题</strong>：编写一个服务器，支持配置端口和线程数</li>
<li><strong>进阶题</strong>：实现一个客户端，支持断线重连</li>
<li><strong>挑战题</strong>：实现一个支持优雅关闭的聊天服务器，关闭时通知所有在线用户</li>
</ol>
<hr>
<p><strong>上一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html">第3章：Netty核心组件</a><br>
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html">第5章：ChannelHandler详解</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html" class="fn-left">上一篇：第3章：Netty 核心组件</a>
            <a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html" class="fn-right">下一篇：第5章：ChannelHandler 详解</a>
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
