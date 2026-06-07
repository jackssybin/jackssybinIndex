---
title: 第10章：EventLoop 与线程模型
description: 第10章：EventLoop 与线程模型 本章导读 EventLoop 是 Netty 的核心，负责处理 I/O
  事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。 10.1
  Reactor 线程模型 10.1.1 单线程 Reactor 特点 ： 所有操作在一个线程中...
url: /netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/10-eventloop.html
layout: tutorial
contentType: tutorial
series: netty
seriesTitle: Netty教程
weight: 100
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第10章：EventLoop 与线程模型

## 本章导读

EventLoop 是 Netty 的核心，负责处理 I/O 事件和任务调度。本章将深入讲解 Reactor 线程模型、Netty 的线程模型实现、EventLoopGroup 的使用和线程池配置优化。

---

## 10.1 Reactor 线程模型

### 10.1.1 单线程 Reactor

```
┌─────────────┐
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
```

**特点**：
- 所有操作在一个线程中完成
- 简单，但性能受限
- 适合连接数少的场景

### 10.1.2 多线程 Reactor

```
┌─────────────┐
│   Reactor   │
│  (单线程)   │
└──────┬──────┘
       │ Accept
   ┌───┴────────────┐
   │  Thread Pool   │
   │ (多线程处理)   │
   └────────────────┘
```

**特点**：
- Reactor 负责接收连接
- 线程池处理 I/O 和业务
- 性能更好

### 10.1.3 主从 Reactor（Netty 使用）

```
┌──────────────┐
│ Main Reactor │  ← Boss线程组
│  (接收连接)  │
└──────┬───────┘
       │
   ┌───┴──────────┐
   │ Sub Reactor  │  ← Worker线程组
   │  (处理I/O)   │
   └──────────────┘
```

**特点**：
- Boss 线程组负责接收连接
- Worker 线程组负责处理 I/O
- 性能最好，Netty 默认模型

---

## 10.2 Netty 的线程模型

### 10.2.1 线程模型架构

```
ServerBootstrap
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
```

### 10.2.2 EventLoop 的职责

**1. I/O 事件处理**：
- 接收连接（Accept）
- 读取数据（Read）
- 写入数据（Write）

**2. 任务调度**：
- 普通任务
- 定时任务
- 周期性任务

**3. 保证线程安全**：
- 一个 Channel 只绑定一个 EventLoop
- 一个 EventLoop 可以处理多个 Channel
- 同一个 Channel 的所有操作都在同一个线程中执行

### 10.2.3 线程模型示例

```java
public class ThreadModelDemo {
    public static void main(String[] args) throws Exception {
        // 1. 创建线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 1个线程
        EventLoopGroup workerGroup = new NioEventLoopGroup(4);    // 4个线程
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                                @Override
                                public void channelRead(ChannelHandlerContext ctx, Object msg) {
                                    // 打印线程信息
                                    System.out.println("处理线程: " + Thread.currentThread().getName());
                                    System.out.println("EventLoop: " + ctx.channel().eventLoop());
                                    
                                    ctx.writeAndFlush(msg);
                                }
                            });
                        }
                    });
            
            ChannelFuture future = bootstrap.bind(8080).sync();
            System.out.println("服务器启动成功");
            future.channel().closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
```

**输出**：
```
服务器启动成功
处理线程: nioEventLoopGroup-3-1
EventLoop: io.netty.channel.nio.NioEventLoop@12345678
处理线程: nioEventLoopGroup-3-2
EventLoop: io.netty.channel.nio.NioEventLoop@87654321
```

---

## 10.3 EventLoopGroup 详解

### 10.3.1 创建 EventLoopGroup

```java
// 1. 默认线程数（CPU核心数 * 2）
EventLoopGroup group1 = new NioEventLoopGroup();

// 2. 指定线程数
EventLoopGroup group2 = new NioEventLoopGroup(4);

// 3. 指定线程工厂
EventLoopGroup group3 = new NioEventLoopGroup(4, new ThreadFactory() {
    private AtomicInteger index = new AtomicInteger(0);
    
    @Override
    public Thread newThread(Runnable r) {
        Thread thread = new Thread(r, "MyEventLoop-" + index.getAndIncrement());
        thread.setDaemon(true);  // 设置为守护线程
        return thread;
    }
});

// 4. 指定线程工厂和选择器策略
EventLoopGroup group4 = new NioEventLoopGroup(
    4,
    new DefaultThreadFactory("MyEventLoop"),
    SelectorProvider.provider()
);
```

### 10.3.2 EventLoop 选择策略

**默认策略（轮询）**：

```java
// Netty 默认使用 PowerOfTwoEventExecutorChooser
// 如果线程数是2的幂次，使用位运算（更快）
// 否则使用取模运算

// 示例：4个线程
Channel ch1 → EventLoop 0
Channel ch2 → EventLoop 1
Channel ch3 → EventLoop 2
Channel ch4 → EventLoop 3
Channel ch5 → EventLoop 0  // 循环
```

**自定义选择策略**：

```java
public class CustomEventExecutorChooserFactory implements EventExecutorChooserFactory {
    
    @Override
    public EventExecutorChooser newChooser(EventExecutor[] executors) {
        return new EventExecutorChooser() {
            private AtomicInteger idx = new AtomicInteger();
            
            @Override
            public EventExecutor next() {
                // 自定义选择逻辑
                return executors[Math.abs(idx.getAndIncrement() % executors.length)];
            }
        };
    }
}
```

---

## 10.4 任务调度与定时任务

### 10.4.1 提交普通任务

```java
public class TaskSubmitDemo extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 方式1：在当前EventLoop中执行
        ctx.channel().eventLoop().execute(() -> {
            System.out.println("执行任务: " + Thread.currentThread().getName());
            // 耗时操作...
        });
        
        // 方式2：提交到业务线程池
        businessExecutor.submit(() -> {
            // 业务处理...
        });
    }
    
    private static final ExecutorService businessExecutor = 
            Executors.newFixedThreadPool(10);
}
```

### 10.4.2 定时任务

```java
public class ScheduledTaskDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
        EventLoop eventLoop = group.next();
        
        // 1. 延迟执行（3秒后执行）
        eventLoop.schedule(() -> {
            System.out.println("延迟任务执行");
        }, 3, TimeUnit.SECONDS);
        
        // 2. 周期性执行（每2秒执行一次）
        eventLoop.scheduleAtFixedRate(() -> {
            System.out.println("周期任务执行: " + System.currentTimeMillis());
        }, 1, 2, TimeUnit.SECONDS);
        
        // 3. 固定延迟执行（上次执行完成后延迟2秒再执行）
        eventLoop.scheduleWithFixedDelay(() -> {
            System.out.println("固定延迟任务执行");
            try {
                Thread.sleep(1000);  // 模拟耗时操作
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, 1, 2, TimeUnit.SECONDS);
    }
}
```

### 10.4.3 实战：心跳检测

```java
public class HeartbeatHandler extends ChannelInboundHandlerAdapter {
    
    private ScheduledFuture<?> heartbeatFuture;
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // 启动心跳任务
        heartbeatFuture = ctx.channel().eventLoop().scheduleAtFixedRate(() -> {
            if (ctx.channel().isActive()) {
                System.out.println("发送心跳");
                ctx.writeAndFlush(Unpooled.copiedBuffer("PING", CharsetUtil.UTF_8));
            }
        }, 0, 30, TimeUnit.SECONDS);
        
        ctx.fireChannelActive();
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        // 取消心跳任务
        if (heartbeatFuture != null) {
            heartbeatFuture.cancel(true);
        }
        
        ctx.fireChannelInactive();
    }
}
```

---

## 10.5 线程池配置与优化

### 10.5.1 线程数配置

**CPU 密集型**：
```java
int threads = Runtime.getRuntime().availableProcessors();
EventLoopGroup group = new NioEventLoopGroup(threads);
```

**I/O 密集型**：
```java
int threads = Runtime.getRuntime().availableProcessors() * 2;
EventLoopGroup group = new NioEventLoopGroup(threads);
```

**混合型**：
```java
// Boss线程组：1-2个线程即可
EventLoopGroup bossGroup = new NioEventLoopGroup(1);

// Worker线程组：根据实际情况调整
EventLoopGroup workerGroup = new NioEventLoopGroup(
    Runtime.getRuntime().availableProcessors() * 2
);
```

### 10.5.2 业务线程池分离

```java
public class BusinessThreadPoolHandler extends ChannelInboundHandlerAdapter {
    
    // 业务线程池
    private static final ExecutorService businessExecutor = 
            new ThreadPoolExecutor(
                10,                         // 核心线程数
                20,                         // 最大线程数
                60, TimeUnit.SECONDS,       // 空闲时间
                new LinkedBlockingQueue<>(1000),  // 队列
                new ThreadFactoryBuilder()
                    .setNameFormat("business-%d")
                    .build(),
                new ThreadPoolExecutor.CallerRunsPolicy()  // 拒绝策略
            );
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 提交到业务线程池
        businessExecutor.submit(() -> {
            try {
                // 业务处理（耗时操作）
                processBusinessLogic(msg);
                
                // 回写响应（在EventLoop中执行）
                ctx.channel().eventLoop().execute(() -> {
                    ctx.writeAndFlush(response);
                });
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                ReferenceCountUtil.release(msg);
            }
        });
    }
    
    private void processBusinessLogic(Object msg) {
        // 耗时的业务逻辑
    }
}
```

### 10.5.3 性能优化建议

**1. 避免阻塞 EventLoop**

```java
// ❌ 错误：在EventLoop中执行耗时操作
public class BadHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 阻塞EventLoop，影响其他Channel
        Thread.sleep(1000);  // 不要这样做！
        ctx.writeAndFlush(msg);
    }
}

// ✅ 正确：提交到业务线程池
public class GoodHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        businessExecutor.submit(() -> {
            // 在业务线程池中执行耗时操作
            Thread.sleep(1000);
            ctx.writeAndFlush(msg);
        });
    }
}
```

**2. 合理配置线程数**

```java
// 根据实际场景调整
int cpuCores = Runtime.getRuntime().availableProcessors();

// 纯I/O场景
int ioThreads = cpuCores * 2;

// CPU密集场景
int cpuThreads = cpuCores + 1;

// 混合场景
int mixedThreads = (int) (cpuCores / (1 - blockingCoefficient));
// blockingCoefficient: 阻塞系数（0-1之间）
```

**3. 使用对象池**

```java
// 使用池化ByteBuf
bootstrap.option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
bootstrap.childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
```

---

## 10.6 EventLoop 源码分析（简化版）

### 10.6.1 EventLoop 执行流程

```java
// NioEventLoop 的 run 方法（简化）
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
                    
                    if (wakenUp.get()) {
                        selector.wakeup();
                    }
                default:
            }
            
            // 3. 处理I/O事件
            processSelectedKeys();
            
            // 4. 处理任务队列
            runAllTasks();
            
        } catch (Throwable t) {
            handleLoopException(t);
        }
    }
}
```

### 10.6.2 任务队列

```java
// EventLoop 内部维护了一个任务队列
private final Queue<Runnable> taskQueue;

// 提交任务
public void execute(Runnable task) {
    taskQueue.add(task);
    if (!inEventLoop()) {
        startThread();
    }
    wakeup(inEventLoop);
}

// 执行所有任务
protected boolean runAllTasks() {
    boolean fetchedAll;
    boolean ranAtLeastOne = false;
    
    do {
        fetchedAll = fetchFromScheduledTaskQueue();
        if (runAllTasksFrom(taskQueue)) {
            ranAtLeastOne = true;
        }
    } while (!fetchedAll);
    
    return ranAtLeastOne;
}
```

---

## 10.7 本章小结

本章我们深入学习了 EventLoop 和线程模型：

✅ **Reactor 模型**：单线程、多线程、主从 Reactor  
✅ **Netty 线程模型**：Boss + Worker 线程组  
✅ **EventLoopGroup**：线程组的创建和配置  
✅ **任务调度**：普通任务、定时任务、周期性任务  
✅ **线程池优化**：线程数配置、业务线程池分离  

### 关键要点

1. Netty 使用**主从 Reactor** 模型
2. 一个 Channel 只绑定一个 EventLoop，保证**线程安全**
3. **不要在 EventLoop 中执行耗时操作**
4. 业务逻辑应该提交到**业务线程池**
5. 合理配置线程数，避免**过多或过少**

### 线程模型最佳实践

1. ✅ Boss 线程组：1-2 个线程
2. ✅ Worker 线程组：CPU 核心数 * 2
3. ✅ 业务线程池：根据业务特点配置
4. ✅ 使用池化 ByteBuf
5. ✅ 避免阻塞 EventLoop

---

## 🎉 第二部分完成！

恭喜！您已经完成了**第二部分：核心特性（6-10章）**的学习！

### 已学内容回顾

- **第6章**：ByteBuf 缓冲区
- **第7章**：编解码器
- **第8章**：粘包与拆包解决方案
- **第9章**：常用协议支持
- **第10章**：EventLoop 与线程模型

### 下一部分预告

**第三部分：高级应用（11-15章）**将学习：
- 零拷贝与高性能优化
- 心跳检测与空闲连接管理
- 流量整形与限流
- Netty 安全机制
- Netty 与 Spring Boot 集成

---

**上一章**：[第9章：常用协议支持](/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/9.html)  
**下一章**：[第11章：零拷贝与高性能优化](/netty/E7_AC_AC_E4_B8_89_E9_83_A8_E5_88_86-_E9_AB_98_E7_BA_A7_E5_BA_94_E7_94_A8/11.html)
