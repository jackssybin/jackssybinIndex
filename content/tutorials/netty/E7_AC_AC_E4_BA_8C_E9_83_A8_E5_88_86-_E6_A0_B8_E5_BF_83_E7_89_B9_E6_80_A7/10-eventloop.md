---
title: "第10章：EventLoop 与线程模型"
permalink: "/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html"
description: "第10章：EventLoop 与线程模型 本章导读 EventLoop 是 Netty 的核心，负责处理 I/O 事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。 10.1 Reactor 线程模型 10.1.1 单线程 Reactor 特点： 所有操作在一个线程中完..."
---

<h1>第10章：EventLoop 与线程模型</h1>
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
    
    ChannelFuture future = bootstrap.bind(8080).sync();
    System.out.println(&amp;amp;quot;服务器启动成功&amp;amp;quot;);
    future.channel().closeFuture().sync();
} finally {
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
</code></pre>
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

// 3. 固定延迟执行（上次执行完成后延迟2秒再执行）
eventLoop.scheduleWithFixedDelay(() -&amp;amp;gt; {
    System.out.println(&amp;amp;quot;固定延迟任务执行&amp;amp;quot;);
    try {
        Thread.sleep(1000);  // 模拟耗时操作
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}, 1, 2, TimeUnit.SECONDS);
</code></pre>
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
    
    // 4. 处理任务队列
    runAllTasks();
    
} catch (Throwable t) {
    handleLoopException(t);
}
</code></pre>
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
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html">第11章：零拷贝与高性能优化</a></p>
