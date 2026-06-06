---
title: 第3章：Netty 核心组件
description: 第3章：Netty 核心组件 本章导读 Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty
  的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和
  ChannelPipeline，理解这些组件是掌握 Netty 的关键。 3.1 Channel（通道） 3.1.1 Channel ...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html
layout: tutorial
kind: tutorial
series: netty
seriesTitle: Netty教程
weight: 30
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第3章：Netty 核心组件

## 本章导读

Netty 的强大之处在于其优雅的组件设计。本章将深入讲解 Netty 的五大核心组件：Channel、EventLoop、ChannelFuture、ChannelHandler 和 ChannelPipeline，理解这些组件是掌握 Netty 的关键。

---

## 3.1 Channel（通道）

### 3.1.1 Channel 概述

**定义**：Channel 是 Netty 网络操作的抽象类，代表一个网络连接。

**核心特性**：
- 双向通信（可读可写）
- 异步操作
- 支持多种传输类型（NIO、OIO、Local、Embedded）

### 3.1.2 Channel 的层次结构

```
Channel (接口)
    ├── AbstractChannel (抽象类)
    │   ├── AbstractNioChannel
    │   │   ├── NioServerSocketChannel    # 服务端Channel
    │   │   └── NioSocketChannel           # 客户端Channel
    │   ├── AbstractOioChannel
    │   │   ├── OioServerSocketChannel
    │   │   └── OioSocketChannel
    │   └── LocalChannel                   # 本地通信
    └── EmbeddedChannel                    # 测试用
```

### 3.1.3 常用 Channel 类型

| Channel 类型 | 说明 | 使用场景 |
|-------------|------|---------|
| **NioServerSocketChannel** | NIO 服务端 | TCP 服务器 |
| **NioSocketChannel** | NIO 客户端 | TCP 客户端 |
| **NioDatagramChannel** | NIO UDP | UDP 通信 |
| **OioServerSocketChannel** | BIO 服务端 | 阻塞 I/O（不推荐） |
| **LocalChannel** | 本地通信 | JVM 内部通信 |
| **EmbeddedChannel** | 嵌入式 | 单元测试 |

### 3.1.4 Channel 的核心方法

```java
public interface Channel extends AttributeMap, ChannelOutboundInvoker, Comparable<Channel> {
    
    // 获取Channel的唯一标识
    ChannelId id();
    
    // 获取EventLoop
    EventLoop eventLoop();
    
    // 获取父Channel（服务端Channel）
    Channel parent();
    
    // 获取配置
    ChannelConfig config();
    
    // Channel是否打开
    boolean isOpen();
    
    // Channel是否注册到EventLoop
    boolean isRegistered();
    
    // Channel是否激活（连接建立）
    boolean isActive();
    
    // 获取本地地址
    SocketAddress localAddress();
    
    // 获取远程地址
    SocketAddress remoteAddress();
    
    // 获取Pipeline
    ChannelPipeline pipeline();
    
    // 读取数据
    Channel read();
    
    // 写入数据（不刷新）
    ChannelFuture write(Object msg);
    
    // 刷新数据到网络
    Channel flush();
    
    // 写入并刷新
    ChannelFuture writeAndFlush(Object msg);
    
    // 关闭Channel
    ChannelFuture close();
}
```

### 3.1.5 Channel 的生命周期

```
channelUnregistered  →  channelRegistered  →  channelActive  →  channelInactive
        ↑                                                              ↓
        └──────────────────────────────────────────────────────────────┘
```

**状态说明**：

| 状态 | 说明 |
|------|------|
| **ChannelUnregistered** | Channel 已创建，但未注册到 EventLoop |
| **ChannelRegistered** | Channel 已注册到 EventLoop |
| **ChannelActive** | Channel 已激活，可以收发数据 |
| **ChannelInactive** | Channel 未连接到远程节点 |

### 3.1.6 Channel 示例代码

```java
public class ChannelDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                                @Override
                                public void channelActive(ChannelHandlerContext ctx) {
                                    Channel channel = ctx.channel();
                                    
                                    // 打印Channel信息
                                    System.out.println("Channel ID: " + channel.id());
                                    System.out.println("本地地址: " + channel.localAddress());
                                    System.out.println("远程地址: " + channel.remoteAddress());
                                    System.out.println("是否激活: " + channel.isActive());
                                    System.out.println("是否打开: " + channel.isOpen());
                                    System.out.println("是否可写: " + channel.isWritable());
                                    
                                    // 发送数据
                                    ByteBuf buf = Unpooled.copiedBuffer("Hello Server", CharsetUtil.UTF_8);
                                    channel.writeAndFlush(buf);
                                }
                            });
                        }
                    });
            
            ChannelFuture future = bootstrap.connect("localhost", 8080).sync();
            future.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
    }
}
```

---

## 3.2 EventLoop（事件循环）

### 3.2.1 EventLoop 概述

**定义**：EventLoop 是 Netty 的核心抽象，负责处理 I/O 事件和任务调度。

**核心概念**：
- 一个 EventLoop 绑定一个线程
- 一个 EventLoop 可以处理多个 Channel
- 一个 Channel 只能注册到一个 EventLoop

### 3.2.2 EventLoop 的层次结构

```
EventExecutorGroup
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
```

### 3.2.3 EventLoop 与 Channel 的关系

```
EventLoopGroup (线程组)
    ├── EventLoop (线程1)
    │   ├── Channel A
    │   ├── Channel B
    │   └── Channel C
    ├── EventLoop (线程2)
    │   ├── Channel D
    │   └── Channel E
    └── EventLoop (线程3)
        └── Channel F
```

**关键点**：
- ✅ 一个 Channel 的所有 I/O 操作都在同一个 EventLoop 中执行
- ✅ 避免了多线程竞争，无需加锁
- ✅ 保证了事件的顺序性

### 3.2.4 EventLoop 的核心方法

```java
public interface EventLoop extends OrderedEventExecutor, EventLoopGroup {
    
    // 获取父EventLoopGroup
    @Override
    EventLoopGroup parent();
    
    // 注册Channel
    ChannelFuture register(Channel channel);
    
    // 判断当前线程是否是EventLoop线程
    boolean inEventLoop();
    
    // 提交任务
    Future<?> submit(Runnable task);
    
    // 调度任务
    ScheduledFuture<?> schedule(Runnable command, long delay, TimeUnit unit);
    
    // 周期性调度
    ScheduledFuture<?> scheduleAtFixedRate(Runnable command, 
                                           long initialDelay, 
                                           long period, 
                                           TimeUnit unit);
}
```

### 3.2.5 EventLoopGroup 的创建

```java
// 1. 默认线程数（CPU核心数 * 2）
EventLoopGroup group = new NioEventLoopGroup();

// 2. 指定线程数
EventLoopGroup group = new NioEventLoopGroup(4);

// 3. 指定线程工厂
EventLoopGroup group = new NioEventLoopGroup(4, new ThreadFactory() {
    private AtomicInteger index = new AtomicInteger(0);
    
    @Override
    public Thread newThread(Runnable r) {
        return new Thread(r, "MyEventLoop-" + index.getAndIncrement());
    }
});

// 4. Boss和Worker分离
EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 接收连接
EventLoopGroup workerGroup = new NioEventLoopGroup();     // 处理I/O
```

### 3.2.6 EventLoop 任务调度示例

```java
public class EventLoopTaskDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
        
        // 获取一个EventLoop
        EventLoop eventLoop = group.next();
        
        // 1. 提交普通任务
        eventLoop.execute(() -> {
            System.out.println("执行普通任务: " + Thread.currentThread().getName());
        });
        
        // 2. 提交延迟任务（3秒后执行）
        eventLoop.schedule(() -> {
            System.out.println("执行延迟任务: " + Thread.currentThread().getName());
        }, 3, TimeUnit.SECONDS);
        
        // 3. 提交周期性任务（每2秒执行一次）
        eventLoop.scheduleAtFixedRate(() -> {
            System.out.println("执行周期任务: " + Thread.currentThread().getName());
        }, 1, 2, TimeUnit.SECONDS);
        
        // 等待10秒后关闭
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        group.shutdownGracefully();
    }
}
```

---

## 3.3 ChannelFuture（异步结果）

### 3.3.1 ChannelFuture 概述

**定义**：ChannelFuture 是 Netty 异步操作的结果占位符。

**为什么需要 ChannelFuture？**
- Netty 的所有 I/O 操作都是异步的
- 操作会立即返回，但结果可能还未完成
- ChannelFuture 用于获取操作结果或添加监听器

### 3.3.2 ChannelFuture 的状态

```
                未完成 (Uncompleted)
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
    成功 (Success)                  失败 (Failure)
```

**状态判断**：
```java
ChannelFuture future = channel.writeAndFlush(msg);

// 判断是否完成
boolean isDone = future.isDone();

// 判断是否成功
boolean isSuccess = future.isSuccess();

// 判断是否可取消
boolean isCancellable = future.isCancellable();

// 获取异常（如果失败）
Throwable cause = future.cause();
```

### 3.3.3 获取 ChannelFuture 结果的方式

**方式1：阻塞等待（不推荐）**

```java
// 阻塞等待操作完成
ChannelFuture future = channel.writeAndFlush(msg);
future.sync();  // 或 future.await();

// 检查结果
if (future.isSuccess()) {
    System.out.println("发送成功");
} else {
    System.out.println("发送失败: " + future.cause());
}
```

**方式2：添加监听器（推荐）**

```java
ChannelFuture future = channel.writeAndFlush(msg);

// 添加监听器
future.addListener(new ChannelFutureListener() {
    @Override
    public void operationComplete(ChannelFuture f) {
        if (f.isSuccess()) {
            System.out.println("发送成功");
        } else {
            System.out.println("发送失败: " + f.cause());
        }
    }
});

// 使用Lambda表达式（更简洁）
future.addListener((ChannelFutureListener) f -> {
    if (f.isSuccess()) {
        System.out.println("发送成功");
    } else {
        System.out.println("发送失败: " + f.cause());
    }
});
```

**方式3：使用内置监听器**

```java
// 关闭连接
future.addListener(ChannelFutureListener.CLOSE);

// 关闭并打印异常
future.addListener(ChannelFutureListener.CLOSE_ON_FAILURE);

// 转发异常
future.addListener(ChannelFutureListener.FIRE_EXCEPTION_ON_FAILURE);
```

### 3.3.4 ChannelFuture 实战示例

```java
public class ChannelFutureDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new StringEncoder());
                        }
                    });
            
            // 1. 连接操作的Future
            ChannelFuture connectFuture = bootstrap.connect("localhost", 8080);
            
            // 添加连接监听器
            connectFuture.addListener((ChannelFutureListener) future -> {
                if (future.isSuccess()) {
                    System.out.println("连接成功");
                    Channel channel = future.channel();
                    
                    // 2. 写操作的Future
                    ChannelFuture writeFuture = channel.writeAndFlush("Hello Server");
                    
                    // 添加写监听器
                    writeFuture.addListener((ChannelFutureListener) f -> {
                        if (f.isSuccess()) {
                            System.out.println("数据发送成功");
                        } else {
                            System.out.println("数据发送失败: " + f.cause());
                        }
                    });
                } else {
                    System.out.println("连接失败: " + future.cause());
                }
            });
            
            // 3. 关闭操作的Future
            connectFuture.channel().closeFuture().addListener((ChannelFutureListener) future -> {
                System.out.println("连接已关闭");
            });
            
            // 等待连接关闭
            connectFuture.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
    }
}
```

### 3.3.5 ChannelPromise

**定义**：ChannelPromise 是可写的 ChannelFuture，可以手动设置结果。

```java
public class ChannelPromiseDemo {
    public static void main(String[] args) {
        EventLoopGroup group = new NioEventLoopGroup();
        EventLoop eventLoop = group.next();
        
        // 创建Promise
        ChannelPromise promise = new DefaultChannelPromise(channel, eventLoop);
        
        // 添加监听器
        promise.addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("操作成功");
            } else {
                System.out.println("操作失败: " + future.cause());
            }
        });
        
        // 在另一个线程中设置结果
        new Thread(() -> {
            try {
                Thread.sleep(1000);
                // 设置成功
                promise.setSuccess();
                // 或设置失败
                // promise.setFailure(new Exception("操作失败"));
            } catch (InterruptedException e) {
                promise.setFailure(e);
            }
        }).start();
        
        group.shutdownGracefully();
    }
}
```

---

## 3.4 ChannelHandler（处理器）

### 3.4.1 ChannelHandler 概述

**定义**：ChannelHandler 是 Netty 的核心接口，用于处理 I/O 事件和业务逻辑。

**分类**：
```
ChannelHandler
    ├── ChannelInboundHandler      # 入站处理器（处理读事件）
    └── ChannelOutboundHandler     # 出站处理器（处理写事件）
```

### 3.4.2 ChannelInboundHandler（入站处理器）

**核心方法**：

```java
public interface ChannelInboundHandler extends ChannelHandler {
    
    // Channel注册到EventLoop
    void channelRegistered(ChannelHandlerContext ctx);
    
    // Channel从EventLoop注销
    void channelUnregistered(ChannelHandlerContext ctx);
    
    // Channel激活（连接建立）
    void channelActive(ChannelHandlerContext ctx);
    
    // Channel失活（连接断开）
    void channelInactive(ChannelHandlerContext ctx);
    
    // 读取数据
    void channelRead(ChannelHandlerContext ctx, Object msg);
    
    // 读取完成
    void channelReadComplete(ChannelHandlerContext ctx);
    
    // 用户自定义事件
    void userEventTriggered(ChannelHandlerContext ctx, Object evt);
    
    // Channel可写状态改变
    void channelWritabilityChanged(ChannelHandlerContext ctx);
    
    // 异常捕获
    void exceptionCaught(ChannelHandlerContext ctx, Throwable cause);
}
```

**常用实现类**：

| 类名 | 说明 |
|------|------|
| **ChannelInboundHandlerAdapter** | 适配器，提供默认实现 |
| **SimpleChannelInboundHandler<T>** | 泛型处理器，自动释放消息 |

**示例**：

```java
public class MyInboundHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("连接建立: " + ctx.channel().remoteAddress());
        ctx.fireChannelActive();  // 传递给下一个Handler
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("接收到消息: " + msg);
        ctx.fireChannelRead(msg);  // 传递给下一个Handler
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("发生异常: " + cause.getMessage());
        ctx.close();
    }
}
```

### 3.4.3 ChannelOutboundHandler（出站处理器）

**核心方法**：

```java
public interface ChannelOutboundHandler extends ChannelHandler {
    
    // 绑定地址
    void bind(ChannelHandlerContext ctx, SocketAddress localAddress, ChannelPromise promise);
    
    // 连接远程地址
    void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress, 
                 SocketAddress localAddress, ChannelPromise promise);
    
    // 断开连接
    void disconnect(ChannelHandlerContext ctx, ChannelPromise promise);
    
    // 关闭Channel
    void close(ChannelHandlerContext ctx, ChannelPromise promise);
    
    // 注销Channel
    void deregister(ChannelHandlerContext ctx, ChannelPromise promise);
    
    // 读取数据
    void read(ChannelHandlerContext ctx);
    
    // 写入数据
    void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise);
    
    // 刷新数据
    void flush(ChannelHandlerContext ctx);
}
```

**常用实现类**：

| 类名 | 说明 |
|------|------|
| **ChannelOutboundHandlerAdapter** | 适配器，提供默认实现 |

**示例**：

```java
public class MyOutboundHandler extends ChannelOutboundHandlerAdapter {
    
    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
        System.out.println("发送消息: " + msg);
        ctx.write(msg, promise);  // 传递给下一个Handler
    }
    
    @Override
    public void flush(ChannelHandlerContext ctx) {
        System.out.println("刷新数据到网络");
        ctx.flush();
    }
}
```

### 3.4.4 SimpleChannelInboundHandler

**优势**：自动释放消息，避免内存泄漏

```java
public class MySimpleHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        // 处理消息
        System.out.println("接收到: " + msg);
        
        // 不需要手动释放msg，框架会自动释放
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }
}
```

---

## 3.5 ChannelPipeline（处理链）

### 3.5.1 ChannelPipeline 概述

**定义**：ChannelPipeline 是 ChannelHandler 的容器，负责管理 Handler 的执行顺序。

**核心特性**：
- 双向链表结构
- 入站事件从头到尾传播
- 出站事件从尾到头传播

### 3.5.2 Pipeline 的结构

```
                    ChannelPipeline
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  Head  →  Handler1  →  Handler2  →  Handler3  →  Tail   │
│   ↑                                                  ↓     │
│   └──────────────────────────────────────────────────┘     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**事件传播方向**：
- **入站事件**：Head → Handler1 → Handler2 → Handler3 → Tail
- **出站事件**：Tail → Handler3 → Handler2 → Handler1 → Head

### 3.5.3 Pipeline 的核心方法

```java
public interface ChannelPipeline extends Iterable<Map.Entry<String, ChannelHandler>> {
    
    // 添加Handler（尾部）
    ChannelPipeline addLast(String name, ChannelHandler handler);
    ChannelPipeline addLast(ChannelHandler... handlers);
    
    // 添加Handler（头部）
    ChannelPipeline addFirst(String name, ChannelHandler handler);
    
    // 在指定Handler之前添加
    ChannelPipeline addBefore(String baseName, String name, ChannelHandler handler);
    
    // 在指定Handler之后添加
    ChannelPipeline addAfter(String baseName, String name, ChannelHandler handler);
    
    // 移除Handler
    ChannelPipeline remove(ChannelHandler handler);
    ChannelHandler remove(String name);
    
    // 替换Handler
    ChannelPipeline replace(ChannelHandler oldHandler, String newName, ChannelHandler newHandler);
    
    // 获取Handler
    ChannelHandler get(String name);
    <T extends ChannelHandler> T get(Class<T> handlerType);
    
    // 获取Channel
    Channel channel();
}
```

### 3.5.4 Pipeline 使用示例

```java
public class PipelineDemo {
    public static void main(String[] args) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(group)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 添加Handler（按顺序执行）
                            pipeline.addLast("decoder", new StringDecoder());
                            pipeline.addLast("encoder", new StringEncoder());
                            pipeline.addLast("handler1", new InboundHandler1());
                            pipeline.addLast("handler2", new InboundHandler2());
                            pipeline.addLast("handler3", new OutboundHandler1());
                            
                            // 动态添加Handler
                            if (needAuth) {
                                pipeline.addFirst("auth", new AuthHandler());
                            }
                            
                            // 移除Handler
                            // pipeline.remove("handler1");
                            
                            // 替换Handler
                            // pipeline.replace("handler2", "newHandler", new NewHandler());
                        }
                    });
            
            ChannelFuture future = bootstrap.bind(8080).sync();
            future.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
    }
}

class InboundHandler1 extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("InboundHandler1: " + msg);
        ctx.fireChannelRead(msg);  // 传递给下一个入站Handler
    }
}

class InboundHandler2 extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("InboundHandler2: " + msg);
        ctx.writeAndFlush("Response: " + msg);  // 触发出站事件
    }
}

class OutboundHandler1 extends ChannelOutboundHandlerAdapter {
    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
        System.out.println("OutboundHandler1: " + msg);
        ctx.write(msg, promise);  // 传递给下一个出站Handler
    }
}
```

### 3.5.5 事件传播机制

**入站事件传播**：

```java
// 方式1：从当前Handler传播到下一个Handler
ctx.fireChannelRead(msg);

// 方式2：从Pipeline头部开始传播
ctx.channel().pipeline().fireChannelRead(msg);
```

**出站事件传播**：

```java
// 方式1：从当前Handler传播到上一个Handler
ctx.write(msg);

// 方式2：从Pipeline尾部开始传播
ctx.channel().write(msg);
```

---

## 3.6 组件协作示例

### 3.6.1 完整的服务器示例

```java
public class ComponentsServer {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    // 2. 指定Channel类型
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            // 3. 配置Pipeline
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 添加编解码器
                            pipeline.addLast(new StringDecoder());
                            pipeline.addLast(new StringEncoder());
                            
                            // 添加业务Handler
                            pipeline.addLast(new ServerHandler());
                        }
                    });
            
            // 4. 绑定端口，返回ChannelFuture
            ChannelFuture future = bootstrap.bind(8080).sync();
            System.out.println("服务器启动成功，监听端口: 8080");
            
            // 5. 添加关闭监听器
            future.channel().closeFuture().addListener((ChannelFutureListener) f -> {
                System.out.println("服务器已关闭");
            });
            
            // 等待服务器关闭
            future.channel().closeFuture().sync();
        } finally {
            // 6. 优雅关闭EventLoopGroup
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

class ServerHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // Channel激活
        Channel channel = ctx.channel();
        System.out.println("客户端连接: " + channel.remoteAddress());
        
        // 获取EventLoop
        EventLoop eventLoop = channel.eventLoop();
        System.out.println("绑定的EventLoop: " + eventLoop);
    }
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        System.out.println("接收到消息: " + msg);
        
        // 写入数据并添加监听器
        ChannelFuture future = ctx.writeAndFlush("服务器收到: " + msg);
        future.addListener((ChannelFutureListener) f -> {
            if (f.isSuccess()) {
                System.out.println("消息发送成功");
            } else {
                System.out.println("消息发送失败: " + f.cause());
            }
        });
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("客户端断开: " + ctx.channel().remoteAddress());
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("发生异常: " + cause.getMessage());
        ctx.close();
    }
}
```

---

## 3.7 本章小结

本章我们深入学习了 Netty 的五大核心组件：

✅ **Channel**：网络连接的抽象，支持多种传输类型  
✅ **EventLoop**：事件循环，负责处理 I/O 事件和任务调度  
✅ **ChannelFuture**：异步操作的结果占位符  
✅ **ChannelHandler**：处理器，处理 I/O 事件和业务逻辑  
✅ **ChannelPipeline**：处理器链，管理 Handler 的执行顺序  

### 关键要点

1. **Channel** 代表一个网络连接，有完整的生命周期
2. **EventLoop** 绑定一个线程，一个 EventLoop 可以处理多个 Channel
3. **ChannelFuture** 用于异步操作，推荐使用监听器而非阻塞等待
4. **ChannelHandler** 分为入站和出站两种，使用 SimpleChannelInboundHandler 可以自动释放消息
5. **ChannelPipeline** 是双向链表，入站事件从头到尾，出站事件从尾到头

### 组件关系图

```
Channel
    ├── EventLoop (绑定)
    ├── ChannelPipeline (包含)
    │   ├── ChannelHandler 1
    │   ├── ChannelHandler 2
    │   └── ChannelHandler 3
    └── ChannelFuture (操作结果)
```

### 下一章预告

下一章我们将学习 **Bootstrap 启动器**，包括：
- ServerBootstrap 服务端启动详解
- Bootstrap 客户端启动详解
- 启动参数配置
- 优雅关闭机制

---

## 练习题

1. **基础题**：编写一个服务器，打印 Channel 的完整生命周期
2. **进阶题**：实现一个 Pipeline，包含日志、认证、业务处理三个 Handler
3. **挑战题**：使用 EventLoop 实现一个定时任务调度器

---

**上一章**：[第2章：网络编程基础](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html)  
**下一章**：[第4章：Bootstrap启动器](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html)
