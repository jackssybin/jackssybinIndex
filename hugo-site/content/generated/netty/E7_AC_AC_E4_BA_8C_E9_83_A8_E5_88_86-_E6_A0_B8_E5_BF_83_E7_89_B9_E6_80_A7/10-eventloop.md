---
title: 第10章：EventLoop 与线程模型 - Netty教程
description: 第10章：EventLoop 与线程模型 本章导读 EventLoop 是 Netty 的核心，负责处理 I/O
  事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。 10.1
  Reactor 线程模型 10.1.1 单线程 Reactor ┌─────────────┐...
url: /netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第10章：EventLoop 与线程模型</h2></div>
    <section class="mysql-course tutorial-series">
      <aside class="mysql-tutorial-nav tutorial-series-nav">
    <h3>Netty教程目录</h3>
    <section>
      <h4>第一部分-_基础入门</h4>
      <a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html">第1章：Netty 简介与环境搭建</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html">第2章：网络编程基础</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html">第3章：Netty 核心组件</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap 启动器</a>
<a class="" href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html">第5章：ChannelHandler 详解</a>
    </section>
<section>
      <h4>第二部分-_核心特性</h4>
      <a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html">第6章：ByteBuf 缓冲区</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html">第7章：编解码器（Codec）</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/8.html">第8章：粘包与拆包解决方案</a>
<a class="" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html">第9章：常用协议支持</a>
<a class="current" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html">第10章：EventLoop 与线程模型</a>
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
            <h2><a rel="bookmark" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html">第10章：EventLoop 与线程模型</a></h2>
            <div class="meta"><span>Netty教程 / 第二部分-_核心特性</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第10章：EventLoop 与线程模型</h1>
<h2>本章导读</h2>
<p>EventLoop 是 Netty 的核心，负责处理 I/O 事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。</p>
<hr>
<h2>10.1 Reactor 线程模型</h2>
<h3>10.1.1 单线程 Reactor</h3>
<pre><code>┌─────────────┐
│   Reactor   │
│  (单线程)   │
└──────┬──────┘
       │
   ┌───┴───┐
   │ Event │
   │ Loop  │
   └───┬───┘
       │
   ┌───┴───────────┐
   │ Accept/Read/  │
   │ Write/Handler │
   └───────────────┘
</code></pre>
<p><strong>特点</strong>：</p>
<ul>
<li>所有操作在一个线程中完成</li>
<li>简单，但性能受限</li>
<li>适合连接数少的场景</li>
</ul>
<h3>10.1.2 多线程 Reactor</h3>
<pre><code>┌─────────────┐
│   Reactor   │
│  (单线程)   │
└──────┬──────┘
       │ Accept
   ┌───┴────────────┐
   │  Thread Pool   │
   │ (多线程处理)   │
   └────────────────┘
</code></pre>
<p><strong>特点</strong>：</p>
<ul>
<li>Reactor 负责接收连接</li>
<li>线程池处理 I/O 和业务</li>
<li>性能更好</li>
</ul>
<h3>10.1.3 主从 Reactor（Netty 使用）</h3>
<pre><code>┌──────────────┐
│ Main Reactor │  ← Boss线程组
│  (接收连接)  │
└──────┬───────┘
       │
   ┌───┴──────────┐
   │ Sub Reactor  │  ← Worker线程组
   │  (处理I/O)   │
   └──────────────┘
</code></pre>
<p><strong>特点</strong>：</p>
<ul>
<li>Boss 线程组负责接收连接</li>
<li>Worker 线程组负责处理 I/O</li>
<li>性能最好，Netty 默认模型</li>
</ul>
<hr>
<h2>10.2 Netty 的线程模型</h2>
<h3>10.2.1 线程模型架构</h3>
<pre><code>ServerBootstrap
    ├── BossGroup (EventLoopGroup)
    │   └── EventLoop (线程1)
    │       └── Selector
    │           └── ServerSocketChannel
    │
    └── WorkerGroup (EventLoopGroup)
        ├── EventLoop (线程1)
        │   └── Selector
        │       ├── SocketChannel A
        │       └── SocketChannel B
        ├── EventLoop (线程2)
        │   └── Selector
        │       ├── SocketChannel C
        │       └── SocketChannel D
        └── EventLoop (线程3)
            └── Selector
                └── SocketChannel E
</code></pre>
<h3>10.2.2 EventLoop 的职责</h3>
<p><strong>1. I/O 事件处理</strong>：</p>
<ul>
<li>接收连接（Accept）</li>
<li>读取数据（Read）</li>
<li>写入数据（Write）</li>
</ul>
<p><strong>2. 任务调度</strong>：</p>
<ul>
<li>普通任务</li>
<li>定时任务</li>
<li>周期性任务</li>
</ul>
<p><strong>3. 保证线程安全</strong>：</p>
<ul>
<li>一个 Channel 只绑定一个 EventLoop</li>
<li>一个 EventLoop 可以处理多个 Channel</li>
<li>同一个 Channel 的所有操作都在同一个线程中执行</li>
</ul>
<h3>10.2.3 线程模型示例</h3>
<pre><code class="language-java">public class ThreadModelDemo {
    public static void main(String[] args) throws Exception {
        // 1. 创建线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 1个线程
        EventLoopGroup workerGroup = new NioEventLoopGroup(4);    // 4个线程
<pre><code>    try {
        ServerBootstrap bootstrap = new ServerBootstrap();
        bootstrap.group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ChannelInitializer&amp;lt;SocketChannel&amp;gt;() {
                    @Override
                    protected void initChannel(SocketChannel ch) {
                        ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) {
                                // 打印线程信息
                                System.out.println(&amp;quot;处理线程: &amp;quot; + Thread.currentThread().getName());
                                System.out.println(&amp;quot;EventLoop: &amp;quot; + ctx.channel().eventLoop());
<pre><code>                            ctx.writeAndFlush(msg);
                        }
                    });
                }
            });
<pre><code>ChannelFuture future = bootstrap.bind(8080).sync();
System.out.println(&amp;amp;amp;quot;服务器启动成功&amp;amp;amp;quot;);
future.channel().closeFuture().sync();
</code></pre>
<p>} finally {
bossGroup.shutdownGracefully();
workerGroup.shutdownGracefully();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>输出</strong>：</p>
<pre><code>服务器启动成功
处理线程: nioEventLoopGroup-3-1
EventLoop: io.netty.channel.nio.NioEventLoop@12345678
处理线程: nioEventLoopGroup-3-2
EventLoop: io.netty.channel.nio.NioEventLoop@87654321
</code></pre>
<hr>
<h2>10.3 EventLoopGroup 详解</h2>
<h3>10.3.1 创建 EventLoopGroup</h3>
<pre><code class="language-java">// 1. 默认线程数（CPU核心数 * 2）
EventLoopGroup group1 = new NioEventLoopGroup();
<p>// 2. 指定线程数
EventLoopGroup group2 = new NioEventLoopGroup(4);</p>
<p>// 3. 指定线程工厂
EventLoopGroup group3 = new NioEventLoopGroup(4, new ThreadFactory() {
private AtomicInteger index = new AtomicInteger(0);</p>
<pre><code>@Override
public Thread newThread(Runnable r) {
    Thread thread = new Thread(r, &amp;quot;MyEventLoop-&amp;quot; + index.getAndIncrement());
    thread.setDaemon(true);  // 设置为守护线程
    return thread;
}
</code></pre>
<p>});</p>
<p>// 4. 指定线程工厂和选择器策略
EventLoopGroup group4 = new NioEventLoopGroup(
4,
new DefaultThreadFactory(&quot;MyEventLoop&quot;),
SelectorProvider.provider()
);
</code></pre></p>
<h3>10.3.2 EventLoop 选择策略</h3>
<p><strong>默认策略（轮询）</strong>：</p>
<pre><code class="language-java">// Netty 默认使用 PowerOfTwoEventExecutorChooser
// 如果线程数是2的幂次，使用位运算（更快）
// 否则使用取模运算
<p>// 示例：4个线程
Channel ch1 → EventLoop 0
Channel ch2 → EventLoop 1
Channel ch3 → EventLoop 2
Channel ch4 → EventLoop 3
Channel ch5 → EventLoop 0  // 循环
</code></pre></p>
<p><strong>自定义选择策略</strong>：</p>
<pre><code class="language-java">public class CustomEventExecutorChooserFactory implements EventExecutorChooserFactory {
<pre><code>@Override
public EventExecutorChooser newChooser(EventExecutor[] executors) {
    return new EventExecutorChooser() {
        private AtomicInteger idx = new AtomicInteger();
<pre><code>    @Override
    public EventExecutor next() {
        // 自定义选择逻辑
        return executors[Math.abs(idx.getAndIncrement() % executors.length)];
    }
};
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>10.4 任务调度与定时任务</h2>
<h3>10.4.1 提交普通任务</h3>
<pre><code class="language-java">public class TaskSubmitDemo extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // 方式1：在当前EventLoop中执行
    ctx.channel().eventLoop().execute(() -&amp;gt; {
        System.out.println(&amp;quot;执行任务: &amp;quot; + Thread.currentThread().getName());
        // 耗时操作...
    });
<pre><code>// 方式2：提交到业务线程池
businessExecutor.submit(() -&amp;amp;gt; {
    // 业务处理...
});
</code></pre>
<p>}</p>
<p>private static final ExecutorService businessExecutor =
Executors.newFixedThreadPool(10);
</code></pre></p>
<p>}
</code></pre></p>
<h3>10.4.2 定时任务</h3>
<pre><code class="language-java">public class ScheduledTaskDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
        EventLoop eventLoop = group.next();
<pre><code>    // 1. 延迟执行（3秒后执行）
    eventLoop.schedule(() -&amp;gt; {
        System.out.println(&amp;quot;延迟任务执行&amp;quot;);
    }, 3, TimeUnit.SECONDS);
<pre><code>// 2. 周期性执行（每2秒执行一次）
eventLoop.scheduleAtFixedRate(() -&amp;amp;gt; {
    System.out.println(&amp;amp;quot;周期任务执行: &amp;amp;quot; + System.currentTimeMillis());
}, 1, 2, TimeUnit.SECONDS);
<p>// 3. 固定延迟执行（上次执行完成后延迟2秒再执行）
eventLoop.scheduleWithFixedDelay(() -&amp;amp;gt; {
System.out.println(&amp;amp;quot;固定延迟任务执行&amp;amp;quot;);
try {
Thread.sleep(1000);  // 模拟耗时操作
} catch (InterruptedException e) {
e.printStackTrace();
}
}, 1, 2, TimeUnit.SECONDS);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>10.4.3 实战：心跳检测</h3>
<pre><code class="language-java">public class HeartbeatHandler extends ChannelInboundHandlerAdapter {
<pre><code>private ScheduledFuture&amp;lt;?&amp;gt; heartbeatFuture;
<p>@Override
public void channelActive(ChannelHandlerContext ctx) {
// 启动心跳任务
heartbeatFuture = ctx.channel().eventLoop().scheduleAtFixedRate(() -&amp;gt; {
if (ctx.channel().isActive()) {
System.out.println(&amp;quot;发送心跳&amp;quot;);
ctx.writeAndFlush(Unpooled.copiedBuffer(&amp;quot;PING&amp;quot;, CharsetUtil.UTF_8));
}
}, 0, 30, TimeUnit.SECONDS);</p>
<pre><code>ctx.fireChannelActive();
</code></pre>
<p>}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
// 取消心跳任务
if (heartbeatFuture != null) {
heartbeatFuture.cancel(true);
}</p>
<pre><code>ctx.fireChannelInactive();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>10.5 线程池配置与优化</h2>
<h3>10.5.1 线程数配置</h3>
<p><strong>CPU 密集型</strong>：</p>
<pre><code class="language-java">int threads = Runtime.getRuntime().availableProcessors();
EventLoopGroup group = new NioEventLoopGroup(threads);
</code></pre>
<p><strong>I/O 密集型</strong>：</p>
<pre><code class="language-java">int threads = Runtime.getRuntime().availableProcessors() * 2;
EventLoopGroup group = new NioEventLoopGroup(threads);
</code></pre>
<p><strong>混合型</strong>：</p>
<pre><code class="language-java">// Boss线程组：1-2个线程即可
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
<p>// Worker线程组：根据实际情况调整
EventLoopGroup workerGroup = new NioEventLoopGroup(
Runtime.getRuntime().availableProcessors() * 2
);
</code></pre></p>
<h3>10.5.2 业务线程池分离</h3>
<pre><code class="language-java">public class BusinessThreadPoolHandler extends ChannelInboundHandlerAdapter {
<pre><code>// 业务线程池
private static final ExecutorService businessExecutor = 
        new ThreadPoolExecutor(
            10,                         // 核心线程数
            20,                         // 最大线程数
            60, TimeUnit.SECONDS,       // 空闲时间
            new LinkedBlockingQueue&amp;lt;&amp;gt;(1000),  // 队列
            new ThreadFactoryBuilder()
                .setNameFormat(&amp;quot;business-%d&amp;quot;)
                .build(),
            new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
        );
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
// 提交到业务线程池
businessExecutor.submit(() -&amp;gt; {
try {
// 业务处理（耗时操作）
processBusinessLogic(msg);</p>
<pre><code>        // 回写响应（在EventLoop中执行）
        ctx.channel().eventLoop().execute(() -&amp;amp;gt; {
            ctx.writeAndFlush(response);
        });
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        ReferenceCountUtil.release(msg);
    }
});
</code></pre>
<p>}</p>
<p>private void processBusinessLogic(Object msg) {
// 耗时的业务逻辑
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>10.5.3 性能优化建议</h3>
<p><strong>1. 避免阻塞 EventLoop</strong></p>
<pre><code class="language-java">// ❌ 错误：在EventLoop中执行耗时操作
public class BadHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 阻塞EventLoop，影响其他Channel
        Thread.sleep(1000);  // 不要这样做！
        ctx.writeAndFlush(msg);
    }
}
<p>// ✅ 正确：提交到业务线程池
public class GoodHandler extends ChannelInboundHandlerAdapter {
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
businessExecutor.submit(() -&gt; {
// 在业务线程池中执行耗时操作
Thread.sleep(1000);
ctx.writeAndFlush(msg);
});
}
}
</code></pre></p>
<p><strong>2. 合理配置线程数</strong></p>
<pre><code class="language-java">// 根据实际场景调整
int cpuCores = Runtime.getRuntime().availableProcessors();
<p>// 纯I/O场景
int ioThreads = cpuCores * 2;</p>
<p>// CPU密集场景
int cpuThreads = cpuCores + 1;</p>
<p>// 混合场景
int mixedThreads = (int) (cpuCores / (1 - blockingCoefficient));
// blockingCoefficient: 阻塞系数（0-1之间）
</code></pre></p>
<p><strong>3. 使用对象池</strong></p>
<pre><code class="language-java">// 使用池化ByteBuf
bootstrap.option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
bootstrap.childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
</code></pre>
<hr>
<h2>10.6 EventLoop 源码分析（简化版）</h2>
<h3>10.6.1 EventLoop 执行流程</h3>
<pre><code class="language-java">// NioEventLoop 的 run 方法（简化）
protected void run() {
    for (;;) {
        try {
            // 1. 检查是否有任务
            switch (selectStrategy.calculateStrategy(selectNowSupplier, hasTasks())) {
                case SelectStrategy.CONTINUE:
                    continue;
                case SelectStrategy.SELECT:
                    // 2. 执行select操作
                    select(wakenUp.getAndSet(false));
<pre><code>                if (wakenUp.get()) {
                    selector.wakeup();
                }
            default:
        }
<pre><code>    // 3. 处理I/O事件
    processSelectedKeys();
<pre><code>// 4. 处理任务队列
runAllTasks();
</code></pre>
<p>} catch (Throwable t) {
handleLoopException(t);
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>10.6.2 任务队列</h3>
<pre><code class="language-java">// EventLoop 内部维护了一个任务队列
private final Queue&lt;Runnable&gt; taskQueue;
<p>// 提交任务
public void execute(Runnable task) {
taskQueue.add(task);
if (!inEventLoop()) {
startThread();
}
wakeup(inEventLoop);
}</p>
<p>// 执行所有任务
protected boolean runAllTasks() {
boolean fetchedAll;
boolean ranAtLeastOne = false;</p>
<pre><code>do {
    fetchedAll = fetchFromScheduledTaskQueue();
    if (runAllTasksFrom(taskQueue)) {
        ranAtLeastOne = true;
    }
} while (!fetchedAll);
<p>return ranAtLeastOne;
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>10.7 本章小结</h2>
<p>本章我们深入学习了 EventLoop 和线程模型：</p>
<p>✅ <strong>Reactor 模型</strong>：单线程、多线程、主从 Reactor<br>
✅ <strong>Netty 线程模型</strong>：Boss + Worker 线程组<br>
✅ <strong>EventLoopGroup</strong>：线程组的创建和配置<br>
✅ <strong>任务调度</strong>：普通任务、定时任务、周期性任务<br>
✅ <strong>线程池优化</strong>：线程数配置、业务线程池分离</p>
<h3>关键要点</h3>
<ol>
<li>Netty 使用<strong>主从 Reactor</strong> 模型</li>
<li>一个 Channel 只绑定一个 EventLoop，保证<strong>线程安全</strong></li>
<li><strong>不要在 EventLoop 中执行耗时操作</strong></li>
<li>业务逻辑应该提交到<strong>业务线程池</strong></li>
<li>合理配置线程数，避免<strong>过多或过少</strong></li>
</ol>
<h3>线程模型最佳实践</h3>
<ol>
<li>✅ Boss 线程组：1-2 个线程</li>
<li>✅ Worker 线程组：CPU 核心数 * 2</li>
<li>✅ 业务线程池：根据业务特点配置</li>
<li>✅ 使用池化 ByteBuf</li>
<li>✅ 避免阻塞 EventLoop</li>
</ol>
<hr>
<h2>🎉 第二部分完成！</h2>
<p>恭喜！您已经完成了**第二部分：核心特性（6-10章）**的学习！</p>
<h3>已学内容回顾</h3>
<ul>
<li><strong>第6章</strong>：ByteBuf 缓冲区</li>
<li><strong>第7章</strong>：编解码器</li>
<li><strong>第8章</strong>：粘包与拆包解决方案</li>
<li><strong>第9章</strong>：常用协议支持</li>
<li><strong>第10章</strong>：EventLoop 与线程模型</li>
</ul>
<h3>下一部分预告</h3>
<p>**第三部分：高级应用（11-15章）**将学习：</p>
<ul>
<li>零拷贝与高性能优化</li>
<li>心跳检测与空闲连接管理</li>
<li>流量整形与限流</li>
<li>Netty 安全机制</li>
<li>Netty 与 Spring Boot 集成</li>
</ul>
<hr>
<p><strong>上一章</strong>：<a href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html">第9章：常用协议支持</a><br>
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html">第11章：零拷贝与高性能优化</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html" class="fn-left">上一篇：第9章：常用协议支持</a>
            <a href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html" class="fn-right">下一篇：第11章：零拷贝与高性能优化</a>
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
