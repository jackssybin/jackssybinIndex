---
title: 第3章：Netty 核心组件 - Netty教程
description: 第3章：Netty 核心组件 本章导读 Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty
  的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和
  ChannelPipeline，理解这些组件是掌握 Netty 的关键。 3.1 Channel（通道） 3.1.1 Channel ...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第3章：Netty 核心组件</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>Netty教程目录</h3>
    <section>
      <h4>第一部分-_基础入门</h4>
      <a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html">第1章：Netty 简介与环境搭建</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html">第2章：网络编程基础</a>
<a class="current" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html">第3章：Netty 核心组件</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap 启动器</a>
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
            <h2><a rel="bookmark" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html">第3章：Netty 核心组件</a></h2>
            <div class="meta"><span>Netty教程 / 第一部分-_基础入门</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第3章：Netty 核心组件</h1>
<h2>本章导读</h2>
<p>Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty 的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和 ChannelPipeline，理解这些组件是掌握 Netty 的关键。</p>
<hr>
<h2>3.1 Channel（通道）</h2>
<h3>3.1.1 Channel 概述</h3>
<p><strong>定义</strong>：Channel 是 Netty 网络操作的抽象类，代表一个网络连接。</p>
<p><strong>核心特性</strong>：</p>
<ul>
<li>双向通信（可读可写）</li>
<li>异步操作</li>
<li>支持多种传输类型（NIO、OIO、Local、Embedded）</li>
</ul>
<h3>3.1.2 Channel 的层次结构</h3>
<pre><code>Channel (接口)
    ├── AbstractChannel (抽象类)
    │   ├── AbstractNioChannel
    │   │   ├── NioServerSocketChannel    # 服务端Channel
    │   │   └── NioSocketChannel           # 客户端Channel
    │   ├── AbstractOioChannel
    │   │   ├── OioServerSocketChannel
    │   │   └── OioSocketChannel
    │   └── LocalChannel                   # 本地通信
    └── EmbeddedChannel                    # 测试用
</code></pre>
<h3>3.1.3 常用 Channel 类型</h3>
<table>
<thead>
<tr>
<th>Channel 类型</th>
<th>说明</th>
<th>使用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>NioServerSocketChannel</strong></td>
<td>NIO 服务端</td>
<td>TCP 服务器</td>
</tr>
<tr>
<td><strong>NioSocketChannel</strong></td>
<td>NIO 客户端</td>
<td>TCP 客户端</td>
</tr>
<tr>
<td><strong>NioDatagramChannel</strong></td>
<td>NIO UDP</td>
<td>UDP 通信</td>
</tr>
<tr>
<td><strong>OioServerSocketChannel</strong></td>
<td>BIO 服务端</td>
<td>阻塞 I/O（不推荐）</td>
</tr>
<tr>
<td><strong>LocalChannel</strong></td>
<td>本地通信</td>
<td>JVM 内部通信</td>
</tr>
<tr>
<td><strong>EmbeddedChannel</strong></td>
<td>嵌入式</td>
<td>单元测试</td>
</tr>
</tbody>
</table>
<h3>3.1.4 Channel 的核心方法</h3>
<pre><code class="language-java">public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable&lt;Channel&gt; {
<pre><code>// 获取Channel的唯一标识
ChannelId id();
<p>// 获取EventLoop
EventLoop eventLoop();</p>
<p>// 获取父Channel（服务端Channel）
Channel parent();</p>
<p>// 获取配置
ChannelConfig config();</p>
<p>// Channel是否打开
boolean isOpen();</p>
<p>// Channel是否注册到EventLoop
boolean isRegistered();</p>
<p>// Channel是否激活（连接建立）
boolean isActive();</p>
<p>// 获取本地地址
SocketAddress localAddress();</p>
<p>// 获取远程地址
SocketAddress remoteAddress();</p>
<p>// 获取Pipeline
ChannelPipeline pipeline();</p>
<p>// 读取数据
Channel read();</p>
<p>// 写入数据（不刷新）
ChannelFuture write(Object msg);</p>
<p>// 刷新数据到网络
Channel flush();</p>
<p>// 写入并刷新
ChannelFuture writeAndFlush(Object msg);</p>
<p>// 关闭Channel
ChannelFuture close();
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.1.5 Channel 的生命周期</h3>
<pre><code>channelUnregistered  →  channelRegistered  →  channelActive  →  channelInactive
        ↑                                                              ↓
        └──────────────────────────────────────────────────────────────┘
</code></pre>
<p><strong>状态说明</strong>：</p>
<table>
<thead>
<tr>
<th>状态</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ChannelUnregistered</strong></td>
<td>Channel 已创建，但未注册到 EventLoop</td>
</tr>
<tr>
<td><strong>ChannelRegistered</strong></td>
<td>Channel 已注册到 EventLoop</td>
</tr>
<tr>
<td><strong>ChannelActive</strong></td>
<td>Channel 已激活，可以收发数据</td>
</tr>
<tr>
<td><strong>ChannelInactive</strong></td>
<td>Channel 未连接到远程节点</td>
</tr>
</tbody>
</table>
<h3>3.1.6 Channel 示例代码</h3>
<pre><code class="language-java">public class ChannelDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
<pre><code>    try {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelActive(ChannelHandlerContext ctx) {
                                Channel channel = ctx.channel();
<pre><code>                            // 打印Channel信息
                            System.out.println(&amp;amp;quot;Channel ID: &amp;amp;quot; + channel.id());
                            System.out.println(&amp;amp;quot;本地地址: &amp;amp;quot; + channel.localAddress());
                            System.out.println(&amp;amp;quot;远程地址: &amp;amp;quot; + channel.remoteAddress());
                            System.out.println(&amp;amp;quot;是否激活: &amp;amp;quot; + channel.isActive());
                            System.out.println(&amp;amp;quot;是否打开: &amp;amp;quot; + channel.isOpen());
                            System.out.println(&amp;amp;quot;是否可写: &amp;amp;quot; + channel.isWritable());
<pre><code>                        // 发送数据
                        ByteBuf buf = Unpooled.copiedBuffer(&amp;amp;amp;quot;Hello Server&amp;amp;amp;quot;, CharsetUtil.UTF_8);
                        channel.writeAndFlush(buf);
                    }
                });
            }
        });

ChannelFuture future = bootstrap.connect(&amp;amp;amp;quot;localhost&amp;amp;amp;quot;, 8080).sync();
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
group.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>3.2 EventLoop（事件循环）</h2>
<h3>3.2.1 EventLoop 概述</h3>
<p><strong>定义</strong>：EventLoop 是 Netty 的核心抽象，负责处理 I/O 事件和任务调度。</p>
<p><strong>核心概念</strong>：</p>
<ul>
<li>一个 EventLoop 绑定一个线程</li>
<li>一个 EventLoop 可以处理多个 Channel</li>
<li>一个 Channel 只能注册到一个 EventLoop</li>
</ul>
<h3>3.2.2 EventLoop 的层次结构</h3>
<pre><code>EventExecutorGroup
    ├── EventLoopGroup
    │   ├── MultithreadEventLoopGroup
    │   │   ├── NioEventLoopGroup        # NIO事件循环组
    │   │   ├── EpollEventLoopGroup      # Linux epoll
    │   │   └── KQueueEventLoopGroup     # macOS kqueue
    │   └── DefaultEventLoopGroup
    └── EventExecutor
        └── EventLoop
            ├── NioEventLoop
            ├── EpollEventLoop
            └── KQueueEventLoop
</code></pre>
<h3>3.2.3 EventLoop 与 Channel 的关系</h3>
<pre><code>EventLoopGroup (线程组)
    ├── EventLoop (线程1)
    │   ├── Channel A
    │   ├── Channel B
    │   └── Channel C
    ├── EventLoop (线程2)
    │   ├── Channel D
    │   └── Channel E
    └── EventLoop (线程3)
        └── Channel F
</code></pre>
<p><strong>关键点</strong>：</p>
<ul>
<li>✅ 一个 Channel 的所有 I/O 操作都在同一个 EventLoop 中执行</li>
<li>✅ 避免了多线程竞争，无需加锁</li>
<li>✅ 保证了事件的顺序性</li>
</ul>
<h3>3.2.4 EventLoop 的核心方法</h3>
<pre><code class="language-java">public interface EventLoop extends OrderedEventExecutor, EventLoopGroup {
<pre><code>// 获取父EventLoopGroup
@Override
EventLoopGroup parent();
<p>// 注册Channel
ChannelFuture register(Channel channel);</p>
<p>// 判断当前线程是否是EventLoop线程
boolean inEventLoop();</p>
<p>// 提交任务
Future&amp;lt;?&amp;gt; submit(Runnable task);</p>
<p>// 调度任务
ScheduledFuture&amp;lt;?&amp;gt; schedule(Runnable command, long delay, TimeUnit unit);</p>
<p>// 周期性调度
ScheduledFuture&amp;lt;?&amp;gt; scheduleAtFixedRate(Runnable command,
long initialDelay,
long period,
TimeUnit unit);
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.2.5 EventLoopGroup 的创建</h3>
<pre><code class="language-java">// 1. 默认线程数（CPU核心数 * 2）
EventLoopGroup group = new NioEventLoopGroup();
<p>// 2. 指定线程数
EventLoopGroup group = new NioEventLoopGroup(4);</p>
<p>// 3. 指定线程工厂
EventLoopGroup group = new NioEventLoopGroup(4, new ThreadFactory() {
private AtomicInteger index = new AtomicInteger(0);</p>
<pre><code>@Override
public Thread newThread(Runnable r) {
    return new Thread(r, &amp;quot;MyEventLoop-&amp;quot; + index.getAndIncrement());
}
</code></pre>
<p>});</p>
<p>// 4. Boss和Worker分离
EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 接收连接
EventLoopGroup workerGroup = new NioEventLoopGroup();     // 处理I/O
</code></pre></p>
<h3>3.2.6 EventLoop 任务调度示例</h3>
<pre><code class="language-java">public class EventLoopTaskDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
<pre><code>    // 获取一个EventLoop
    EventLoop eventLoop = group.next();
<pre><code>// 1. 提交普通任务
eventLoop.execute(() -&amp;amp;gt; {
    System.out.println(&amp;amp;quot;执行普通任务: &amp;amp;quot; + Thread.currentThread().getName());
});
<p>// 2. 提交延迟任务（3秒后执行）
eventLoop.schedule(() -&amp;amp;gt; {
System.out.println(&amp;amp;quot;执行延迟任务: &amp;amp;quot; + Thread.currentThread().getName());
}, 3, TimeUnit.SECONDS);</p>
<p>// 3. 提交周期性任务（每2秒执行一次）
eventLoop.scheduleAtFixedRate(() -&amp;amp;gt; {
System.out.println(&amp;amp;quot;执行周期任务: &amp;amp;quot; + Thread.currentThread().getName());
}, 1, 2, TimeUnit.SECONDS);</p>
<p>// 等待10秒后关闭
try {
Thread.sleep(10000);
} catch (InterruptedException e) {
e.printStackTrace();
}</p>
<p>group.shutdownGracefully();
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>3.3 ChannelFuture（异步结果）</h2>
<h3>3.3.1 ChannelFuture 概述</h3>
<p><strong>定义</strong>：ChannelFuture 是 Netty 异步操作的结果占位符。</p>
<p><strong>为什么需要 ChannelFuture？</strong></p>
<ul>
<li>Netty 的所有 I/O 操作都是异步的</li>
<li>操作会立即返回，但结果可能还未完成</li>
<li>ChannelFuture 用于获取操作结果或添加监听器</li>
</ul>
<h3>3.3.2 ChannelFuture 的状态</h3>
<pre><code>                未完成 (Uncompleted)
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
    成功 (Success)                  失败 (Failure)
</code></pre>
<p><strong>状态判断</strong>：</p>
<pre><code class="language-java">ChannelFuture future = channel.writeAndFlush(msg);
<p>// 判断是否完成
boolean isDone = future.isDone();</p>
<p>// 判断是否成功
boolean isSuccess = future.isSuccess();</p>
<p>// 判断是否可取消
boolean isCancellable = future.isCancellable();</p>
<p>// 获取异常（如果失败）
Throwable cause = future.cause();
</code></pre></p>
<h3>3.3.3 获取 ChannelFuture 结果的方式</h3>
<p><strong>方式1：阻塞等待（不推荐）</strong></p>
<pre><code class="language-java">// 阻塞等待操作完成
ChannelFuture future = channel.writeAndFlush(msg);
future.sync();  // 或 future.await();
<p>// 检查结果
if (future.isSuccess()) {
System.out.println(&quot;发送成功&quot;);
} else {
System.out.println(&quot;发送失败: &quot; + future.cause());
}
</code></pre></p>
<p><strong>方式2：添加监听器（推荐）</strong></p>
<pre><code class="language-java">ChannelFuture future = channel.writeAndFlush(msg);
<p>// 添加监听器
future.addListener(new ChannelFutureListener() {
@Override
public void operationComplete(ChannelFuture f) {
if (f.isSuccess()) {
System.out.println(&quot;发送成功&quot;);
} else {
System.out.println(&quot;发送失败: &quot; + f.cause());
}
}
});</p>
<p>// 使用Lambda表达式（更简洁）
future.addListener((ChannelFutureListener) f -&gt; {
if (f.isSuccess()) {
System.out.println(&quot;发送成功&quot;);
} else {
System.out.println(&quot;发送失败: &quot; + f.cause());
}
});
</code></pre></p>
<p><strong>方式3：使用内置监听器</strong></p>
<pre><code class="language-java">// 关闭连接
future.addListener(ChannelFutureListener.CLOSE);
<p>// 关闭并打印异常
future.addListener(ChannelFutureListener.CLOSE_ON_FAILURE);</p>
<p>// 转发异常
future.addListener(ChannelFutureListener.FIRE_EXCEPTION_ON_FAILURE);
</code></pre></p>
<h3>3.3.4 ChannelFuture 实战示例</h3>
<pre><code class="language-java">public class ChannelFutureDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
<pre><code>    try {
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new StringEncoder());
                    }
                });
<pre><code>    // 1. 连接操作的Future
    ChannelFuture connectFuture = bootstrap.connect(&amp;amp;quot;localhost&amp;amp;quot;, 8080);
<pre><code>// 添加连接监听器
connectFuture.addListener((ChannelFutureListener) future -&amp;amp;amp;gt; {
    if (future.isSuccess()) {
        System.out.println(&amp;amp;amp;quot;连接成功&amp;amp;amp;quot;);
        Channel channel = future.channel();
        
        // 2. 写操作的Future
        ChannelFuture writeFuture = channel.writeAndFlush(&amp;amp;amp;quot;Hello Server&amp;amp;amp;quot;);
        
        // 添加写监听器
        writeFuture.addListener((ChannelFutureListener) f -&amp;amp;amp;gt; {
            if (f.isSuccess()) {
                System.out.println(&amp;amp;amp;quot;数据发送成功&amp;amp;amp;quot;);
            } else {
                System.out.println(&amp;amp;amp;quot;数据发送失败: &amp;amp;amp;quot; + f.cause());
            }
        });
    } else {
        System.out.println(&amp;amp;amp;quot;连接失败: &amp;amp;amp;quot; + future.cause());
    }
});

// 3. 关闭操作的Future
connectFuture.channel().closeFuture().addListener((ChannelFutureListener) future -&amp;amp;amp;gt; {
    System.out.println(&amp;amp;amp;quot;连接已关闭&amp;amp;amp;quot;);
});

// 等待连接关闭
connectFuture.channel().closeFuture().sync();
</code></pre>
<p>} finally {
group.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.3.5 ChannelPromise</h3>
<p><strong>定义</strong>：ChannelPromise 是可写的 ChannelFuture，可以手动设置结果。</p>
<pre><code class="language-java">public class ChannelPromiseDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
        EventLoop eventLoop = group.next();
<pre><code>    // 创建Promise
    ChannelPromise promise = new DefaultChannelPromise(channel, eventLoop);
<pre><code>// 添加监听器
promise.addListener((ChannelFutureListener) future -&amp;amp;gt; {
    if (future.isSuccess()) {
        System.out.println(&amp;amp;quot;操作成功&amp;amp;quot;);
    } else {
        System.out.println(&amp;amp;quot;操作失败: &amp;amp;quot; + future.cause());
    }
});
<p>// 在另一个线程中设置结果
new Thread(() -&amp;amp;gt; {
try {
Thread.sleep(1000);
// 设置成功
promise.setSuccess();
// 或设置失败
// promise.setFailure(new Exception(&amp;amp;quot;操作失败&amp;amp;quot;));
} catch (InterruptedException e) {
promise.setFailure(e);
}
}).start();</p>
<p>group.shutdownGracefully();
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>3.4 ChannelHandler（处理器）</h2>
<h3>3.4.1 ChannelHandler 概述</h3>
<p><strong>定义</strong>：ChannelHandler 是 Netty 的核心接口，用于处理 I/O 事件和业务逻辑。</p>
<p><strong>分类</strong>：</p>
<pre><code>ChannelHandler
    ├── ChannelInboundHandler      # 入站处理器（处理读事件）
    └── ChannelOutboundHandler     # 出站处理器（处理写事件）
</code></pre>
<h3>3.4.2 ChannelInboundHandler（入站处理器）</h3>
<p><strong>核心方法</strong>：</p>
<pre><code class="language-java">public interface ChannelInboundHandler extends ChannelHandler {
<pre><code>// Channel注册到EventLoop
void channelRegistered(ChannelHandlerContext ctx);
<p>// Channel从EventLoop注销
void channelUnregistered(ChannelHandlerContext ctx);</p>
<p>// Channel激活（连接建立）
void channelActive(ChannelHandlerContext ctx);</p>
<p>// Channel失活（连接断开）
void channelInactive(ChannelHandlerContext ctx);</p>
<p>// 读取数据
void channelRead(ChannelHandlerContext ctx, Object msg);</p>
<p>// 读取完成
void channelReadComplete(ChannelHandlerContext ctx);</p>
<p>// 用户自定义事件
void userEventTriggered(ChannelHandlerContext ctx, Object evt);</p>
<p>// Channel可写状态改变
void channelWritabilityChanged(ChannelHandlerContext ctx);</p>
<p>// 异常捕获
void exceptionCaught(ChannelHandlerContext ctx, Throwable cause);
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>常用实现类</strong>：</p>
<table>
<thead>
<tr>
<th>类名</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ChannelInboundHandlerAdapter</strong></td>
<td>适配器，提供默认实现</td>
</tr>
<tr>
<td><strong>SimpleChannelInboundHandler<T></strong></td>
<td>泛型处理器，自动释放消息</td>
</tr>
</tbody>
</table>
<p><strong>示例</strong>：</p>
<pre><code class="language-java">public class MyInboundHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;连接建立: &amp;quot; + ctx.channel().remoteAddress());
    ctx.fireChannelActive();  // 传递给下一个Handler
}
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
System.out.println(&amp;quot;接收到消息: &amp;quot; + msg);
ctx.fireChannelRead(msg);  // 传递给下一个Handler
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;发生异常: &amp;quot; + cause.getMessage());
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.4.3 ChannelOutboundHandler（出站处理器）</h3>
<p><strong>核心方法</strong>：</p>
<pre><code class="language-java">public interface ChannelOutboundHandler extends ChannelHandler {
<pre><code>// 绑定地址
void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise promise);
<p>// 连接远程地址
void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress,
SocketAddress localAddress, ChannelPromise promise);</p>
<p>// 断开连接
void disconnect(ChannelHandlerContext ctx, ChannelPromise promise);</p>
<p>// 关闭Channel
void close(ChannelHandlerContext ctx, ChannelPromise promise);</p>
<p>// 注销Channel
void deregister(ChannelHandlerContext ctx, ChannelPromise promise);</p>
<p>// 读取数据
void read(ChannelHandlerContext ctx);</p>
<p>// 写入数据
void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise);</p>
<p>// 刷新数据
void flush(ChannelHandlerContext ctx);
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>常用实现类</strong>：</p>
<table>
<thead>
<tr>
<th>类名</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>ChannelOutboundHandlerAdapter</strong></td>
<td>适配器，提供默认实现</td>
</tr>
</tbody>
</table>
<p><strong>示例</strong>：</p>
<pre><code class="language-java">public class MyOutboundHandler extends ChannelOutboundHandlerAdapter {
<pre><code>@Override
public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
    System.out.println(&amp;quot;发送消息: &amp;quot; + msg);
    ctx.write(msg, promise);  // 传递给下一个Handler
}
<p>@Override
public void flush(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;刷新数据到网络&amp;quot;);
ctx.flush();
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.4.4 SimpleChannelInboundHandler</h3>
<p><strong>优势</strong>：自动释放消息，避免内存泄漏</p>
<pre><code class="language-java">public class MySimpleHandler extends SimpleChannelInboundHandler&lt;String&gt; {
<pre><code>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
    // 处理消息
    System.out.println(&amp;quot;接收到: &amp;quot; + msg);
<pre><code>// 不需要手动释放msg，框架会自动释放
</code></pre>
<p>}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
cause.printStackTrace();
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>3.5 ChannelPipeline（处理链）</h2>
<h3>3.5.1 ChannelPipeline 概述</h3>
<p><strong>定义</strong>：ChannelPipeline 是 ChannelHandler 的容器，负责管理 Handler 的执行顺序。</p>
<p><strong>核心特性</strong>：</p>
<ul>
<li>双向链表结构</li>
<li>入站事件从头到尾传播</li>
<li>出站事件从尾到头传播</li>
</ul>
<h3>3.5.2 Pipeline 的结构</h3>
<pre><code>                    ChannelPipeline
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  Head  →  Handler1  →  Handler2  →  Handler3  →  Tail   │
│   ↑                                                  ↓     │
│   └──────────────────────────────────────────────────┘     │
│                                                           │
└───────────────────────────────────────────────────────────┘
</code></pre>
<p><strong>事件传播方向</strong>：</p>
<ul>
<li><strong>入站事件</strong>：Head → Handler1 → Handler2 → Handler3 → Tail</li>
<li><strong>出站事件</strong>：Tail → Handler3 → Handler2 → Handler1 → Head</li>
</ul>
<h3>3.5.3 Pipeline 的核心方法</h3>
<pre><code class="language-java">public interface ChannelPipeline extends Iterable&lt;Map.Entry&lt;String, ChannelHandler&gt;&gt; {
<pre><code>// 添加Handler（尾部）
ChannelPipeline addLast(String name, ChannelHandler handler);
ChannelPipeline addLast(ChannelHandler... handlers);
<p>// 添加Handler（头部）
ChannelPipeline addFirst(String name, ChannelHandler handler);</p>
<p>// 在指定Handler之前添加
ChannelPipeline addBefore(String baseName, String name, ChannelHandler handler);</p>
<p>// 在指定Handler之后添加
ChannelPipeline addAfter(String baseName, String name, ChannelHandler handler);</p>
<p>// 移除Handler
ChannelPipeline remove(ChannelHandler handler);
ChannelHandler remove(String name);</p>
<p>// 替换Handler
ChannelPipeline replace(ChannelHandler oldHandler, String newName, ChannelHandler newHandler);</p>
<p>// 获取Handler
ChannelHandler get(String name);
&amp;lt;T extends ChannelHandler&amp;gt; T get(Class&amp;lt;T&amp;gt; handlerType);</p>
<p>// 获取Channel
Channel channel();
</code></pre></p>
<p>}
</code></pre></p>
<h3>3.5.4 Pipeline 使用示例</h3>
<pre><code class="language-java">public class PipelineDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
<pre><code>    try {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(group)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ChannelPipeline pipeline = ch.pipeline();
<pre><code>                    // 添加Handler（按顺序执行）
                    pipeline.addLast(&amp;amp;quot;decoder&amp;amp;quot;, new StringDecoder());
                    pipeline.addLast(&amp;amp;quot;encoder&amp;amp;quot;, new StringEncoder());
                    pipeline.addLast(&amp;amp;quot;handler1&amp;amp;quot;, new InboundHandler1());
                    pipeline.addLast(&amp;amp;quot;handler2&amp;amp;quot;, new InboundHandler2());
                    pipeline.addLast(&amp;amp;quot;handler3&amp;amp;quot;, new OutboundHandler1());
<pre><code>                // 动态添加Handler
                if (needAuth) {
                    pipeline.addFirst(&amp;amp;amp;quot;auth&amp;amp;amp;quot;, new AuthHandler());
                }
                
                // 移除Handler
                // pipeline.remove(&amp;amp;amp;quot;handler1&amp;amp;amp;quot;);
                
                // 替换Handler
                // pipeline.replace(&amp;amp;amp;quot;handler2&amp;amp;amp;quot;, &amp;amp;amp;quot;newHandler&amp;amp;amp;quot;, new NewHandler());
            }
        });

ChannelFuture future = bootstrap.bind(8080).sync();
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
group.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}</p>
<p>class InboundHandler1 extends ChannelInboundHandlerAdapter {
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
System.out.println(&quot;InboundHandler1: &quot; + msg);
ctx.fireChannelRead(msg);  // 传递给下一个入站Handler
}
}</p>
<p>class InboundHandler2 extends ChannelInboundHandlerAdapter {
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
System.out.println(&quot;InboundHandler2: &quot; + msg);
ctx.writeAndFlush(&quot;Response: &quot; + msg);  // 触发出站事件
}
}</p>
<p>class OutboundHandler1 extends ChannelOutboundHandlerAdapter {
@Override
public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
System.out.println(&quot;OutboundHandler1: &quot; + msg);
ctx.write(msg, promise);  // 传递给下一个出站Handler
}
}
</code></pre></p>
<h3>3.5.5 事件传播机制</h3>
<p><strong>入站事件传播</strong>：</p>
<pre><code class="language-java">// 方式1：从当前Handler传播到下一个Handler
ctx.fireChannelRead(msg);
<p>// 方式2：从Pipeline头部开始传播
ctx.channel().pipeline().fireChannelRead(msg);
</code></pre></p>
<p><strong>出站事件传播</strong>：</p>
<pre><code class="language-java">// 方式1：从当前Handler传播到上一个Handler
ctx.write(msg);
<p>// 方式2：从Pipeline尾部开始传播
ctx.channel().write(msg);
</code></pre></p>
<hr>
<h2>3.6 组件协作示例</h2>
<h3>3.6.1 完整的服务器示例</h3>
<pre><code class="language-java">public class ComponentsServer {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
<pre><code>    try {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workerGroup)
                // 2. 指定Channel类型
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        // 3. 配置Pipeline
                        ChannelPipeline pipeline = ch.pipeline();
<pre><code>                    // 添加编解码器
                    pipeline.addLast(new StringDecoder());
                    pipeline.addLast(new StringEncoder());
<pre><code>                // 添加业务Handler
                pipeline.addLast(new ServerHandler());
            }
        });

// 4. 绑定端口，返回ChannelFuture
ChannelFuture future = bootstrap.bind(8080).sync();
System.out.println(&amp;amp;amp;quot;服务器启动成功，监听端口: 8080&amp;amp;amp;quot;);

// 5. 添加关闭监听器
future.channel().closeFuture().addListener((ChannelFutureListener) f -&amp;amp;amp;gt; {
    System.out.println(&amp;amp;amp;quot;服务器已关闭&amp;amp;amp;quot;);
});

// 等待服务器关闭
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
// 6. 优雅关闭EventLoopGroup
bossGroup.shutdownGracefully();
workerGroup.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}</p>
<p>class ServerHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    // Channel激活
    Channel channel = ctx.channel();
    System.out.println(&amp;quot;客户端连接: &amp;quot; + channel.remoteAddress());
<pre><code>// 获取EventLoop
EventLoop eventLoop = channel.eventLoop();
System.out.println(&amp;amp;quot;绑定的EventLoop: &amp;amp;quot; + eventLoop);
</code></pre>
<p>}</p>
<p>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
System.out.println(&amp;quot;接收到消息: &amp;quot; + msg);</p>
<pre><code>// 写入数据并添加监听器
ChannelFuture future = ctx.writeAndFlush(&amp;amp;quot;服务器收到: &amp;amp;quot; + msg);
future.addListener((ChannelFutureListener) f -&amp;amp;gt; {
    if (f.isSuccess()) {
        System.out.println(&amp;amp;quot;消息发送成功&amp;amp;quot;);
    } else {
        System.out.println(&amp;amp;quot;消息发送失败: &amp;amp;quot; + f.cause());
    }
});
</code></pre>
<p>}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;客户端断开: &amp;quot; + ctx.channel().remoteAddress());
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;发生异常: &amp;quot; + cause.getMessage());
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>3.7 本章小结</h2>
<p>本章我们深入学习了 Netty 的五大核心组件：</p>
<p>✅ <strong>Channel</strong>：网络连接的抽象，支持多种传输类型<br>
✅ <strong>EventLoop</strong>：事件循环，负责处理 I/O 事件和任务调度<br>
✅ <strong>ChannelFuture</strong>：异步操作的结果占位符<br>
✅ <strong>ChannelHandler</strong>：处理器，处理 I/O 事件和业务逻辑<br>
✅ <strong>ChannelPipeline</strong>：处理器链，管理 Handler 的执行顺序</p>
<h3>关键要点</h3>
<ol>
<li><strong>Channel</strong> 代表一个网络连接，有完整的生命周期</li>
<li><strong>EventLoop</strong> 绑定一个线程，一个 EventLoop 可以处理多个 Channel</li>
<li><strong>ChannelFuture</strong> 用于异步操作，推荐使用监听器而非阻塞等待</li>
<li><strong>ChannelHandler</strong> 分为入站和出站两种，使用 SimpleChannelInboundHandler 可以自动释放消息</li>
<li><strong>ChannelPipeline</strong> 是双向链表，入站事件从头到尾，出站事件从尾到头</li>
</ol>
<h3>组件关系图</h3>
<pre><code>Channel
    ├── EventLoop (绑定)
    ├── ChannelPipeline (包含)
    │   ├── ChannelHandler 1
    │   ├── ChannelHandler 2
    │   └── ChannelHandler 3
    └── ChannelFuture (操作结果)
</code></pre>
<h3>下一章预告</h3>
<p>下一章我们将学习 <strong>Bootstrap 启动器</strong>，包括：</p>
<ul>
<li>ServerBootstrap 服务端启动详解</li>
<li>Bootstrap 客户端启动详解</li>
<li>启动参数配置</li>
<li>优雅关闭机制</li>
</ul>
<hr>
<h2>练习题</h2>
<ol>
<li><strong>基础题</strong>：编写一个服务器，打印 Channel 的完整生命周期</li>
<li><strong>进阶题</strong>：实现一个 Pipeline，包含日志、认证、业务处理三个 Handler</li>
<li><strong>挑战题</strong>：使用 EventLoop 实现一个定时任务调度器</li>
</ol>
<hr>
<p><strong>上一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html">第2章：网络编程基础</a><br>
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap启动器</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html" class="fn-left">上一篇：第2章：网络编程基础</a>
            <a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html" class="fn-right">下一篇：第4章：Bootstrap 启动器</a>
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
