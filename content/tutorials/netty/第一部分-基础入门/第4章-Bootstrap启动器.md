---
title: 第4章：Bootstrap 启动器
description: 第4章：Bootstrap 启动器 本章导读 Bootstrap 是 Netty
  应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和
  Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。 4.1 Bootstrap 概述 4.1.1 Bootstrap 的作用 定义
  ：Bootstra...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html
layout: tutorial
contentType: tutorial
series: netty
seriesTitle: Netty教程
weight: 40
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第4章：Bootstrap 启动器

## 本章导读

Bootstrap 是 Netty 应用程序的启动引导类，负责配置和启动网络应用。本章将详细讲解 ServerBootstrap（服务端启动器）和 Bootstrap（客户端启动器）的使用方法、配置参数和最佳实践。

---

## 4.1 Bootstrap 概述

### 4.1.1 Bootstrap 的作用

**定义**：Bootstrap 是 Netty 的启动引导类，用于配置和启动网络应用。

**核心功能**：
- 配置 EventLoopGroup
- 指定 Channel 类型
- 设置 ChannelHandler
- 配置网络参数
- 绑定端口或连接服务器

### 4.1.2 Bootstrap 的分类

```
AbstractBootstrap (抽象基类)
    ├── ServerBootstrap    # 服务端启动器
    └── Bootstrap          # 客户端启动器
```

**对比**：

| 特性 | ServerBootstrap | Bootstrap |
|------|----------------|-----------|
| **用途** | 服务端 | 客户端 |
| **EventLoopGroup** | 2个（boss + worker） | 1个 |
| **Channel** | ServerSocketChannel | SocketChannel |
| **操作** | bind() 绑定端口 | connect() 连接服务器 |
| **父子Channel** | 有父Channel | 无父Channel |

---

## 4.2 ServerBootstrap 服务端启动

### 4.2.1 ServerBootstrap 基本用法

**标准启动流程**：

```java
public class StandardServer {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);      // 接收连接
        EventLoopGroup workerGroup = new NioEventLoopGroup();     // 处理I/O
        
        try {
            // 2. 创建ServerBootstrap
            ServerBootstrap bootstrap = new ServerBootstrap();
            
            // 3. 配置启动参数
            bootstrap.group(bossGroup, workerGroup)               // 设置线程组
                    .channel(NioServerSocketChannel.class)        // 设置Channel类型
                    .option(ChannelOption.SO_BACKLOG, 128)        // 设置服务端选项
                    .childOption(ChannelOption.SO_KEEPALIVE, true) // 设置客户端选项
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new MyServerHandler());
                        }
                    });
            
            // 4. 绑定端口
            ChannelFuture future = bootstrap.bind(8080).sync();
            System.out.println("服务器启动成功，监听端口: 8080");
            
            // 5. 等待服务器关闭
            future.channel().closeFuture().sync();
            
        } finally {
            // 6. 优雅关闭
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}
```

### 4.2.2 ServerBootstrap 核心方法

**1. group() - 设置线程组**

```java
// 方式1：设置boss和worker线程组（推荐）
bootstrap.group(bossGroup, workerGroup);

// 方式2：只设置一个线程组（不推荐）
bootstrap.group(eventLoopGroup);
```

**2. channel() - 设置Channel类型**

```java
// NIO（推荐）
bootstrap.channel(NioServerSocketChannel.class);

// Epoll（Linux，性能更好）
bootstrap.channel(EpollServerSocketChannel.class);

// KQueue（macOS）
bootstrap.channel(KQueueServerSocketChannel.class);

// OIO（阻塞I/O，不推荐）
bootstrap.channel(OioServerSocketChannel.class);
```

**3. option() - 设置服务端Channel选项**

```java
bootstrap.option(ChannelOption.SO_BACKLOG, 128)           // 连接队列大小
         .option(ChannelOption.SO_REUSEADDR, true)        // 地址重用
         .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT); // 内存分配器
```

**4. childOption() - 设置客户端Channel选项**

```java
bootstrap.childOption(ChannelOption.SO_KEEPALIVE, true)   // 保持连接
         .childOption(ChannelOption.TCP_NODELAY, true)    // 禁用Nagle算法
         .childOption(ChannelOption.SO_RCVBUF, 32 * 1024) // 接收缓冲区
         .childOption(ChannelOption.SO_SNDBUF, 32 * 1024);// 发送缓冲区
```

**5. handler() - 设置服务端Handler**

```java
bootstrap.handler(new LoggingHandler(LogLevel.INFO));
```

**6. childHandler() - 设置客户端Handler**

```java
bootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ch.pipeline().addLast(new MyHandler());
    }
});
```

**7. bind() - 绑定端口**

```java
// 绑定指定端口
ChannelFuture future = bootstrap.bind(8080).sync();

// 绑定指定地址和端口
ChannelFuture future = bootstrap.bind("0.0.0.0", 8080).sync();

// 绑定InetSocketAddress
ChannelFuture future = bootstrap.bind(new InetSocketAddress(8080)).sync();
```

### 4.2.3 完整的服务端示例

```java
public class FullFeaturedServer {
    
    private final int port;
    
    public FullFeaturedServer(int port) {
        this.port = port;
    }
    
    public void start() throws Exception {
        // 创建线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    
                    // 服务端选项
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
                    .childHandler(new ChannelInitializer<SocketChannel>() {
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
            System.out.println("服务器启动成功，监听端口: " + port);
            
            // 添加关闭监听器
            future.channel().closeFuture().addListener((ChannelFutureListener) f -> {
                System.out.println("服务器已关闭");
            });
            
            // 等待服务器关闭
            future.channel().closeFuture().sync();
            
        } finally {
            // 优雅关闭
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
    
    public static void main(String[] args) throws Exception {
        new FullFeaturedServer(8080).start();
    }
}

class ServerBusinessHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("客户端连接: " + ctx.channel().remoteAddress());
    }
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        System.out.println("收到消息: " + msg);
        ctx.writeAndFlush("服务器收到: " + msg);
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("客户端断开: " + ctx.channel().remoteAddress());
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("异常: " + cause.getMessage());
        ctx.close();
    }
}
```

---

## 4.3 Bootstrap 客户端启动

### 4.3.1 Bootstrap 基本用法

**标准启动流程**：

```java
public class StandardClient {
    public static void main(String[] args) throws Exception {
        // 1. 创建EventLoopGroup
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            // 2. 创建Bootstrap
            Bootstrap bootstrap = new Bootstrap();
            
            // 3. 配置启动参数
            bootstrap.group(group)                              // 设置线程组
                    .channel(NioSocketChannel.class)            // 设置Channel类型
                    .option(ChannelOption.SO_KEEPALIVE, true)   // 设置选项
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new MyClientHandler());
                        }
                    });
            
            // 4. 连接服务器
            ChannelFuture future = bootstrap.connect("localhost", 8080).sync();
            System.out.println("连接服务器成功");
            
            // 5. 等待连接关闭
            future.channel().closeFuture().sync();
            
        } finally {
            // 6. 优雅关闭
            group.shutdownGracefully();
        }
    }
}
```

### 4.3.2 Bootstrap 核心方法

**1. group() - 设置线程组**

```java
bootstrap.group(eventLoopGroup);
```

**2. channel() - 设置Channel类型**

```java
// NIO（推荐）
bootstrap.channel(NioSocketChannel.class);

// Epoll（Linux）
bootstrap.channel(EpollSocketChannel.class);

// KQueue（macOS）
bootstrap.channel(KQueueSocketChannel.class);
```

**3. option() - 设置Channel选项**

```java
bootstrap.option(ChannelOption.SO_KEEPALIVE, true)
         .option(ChannelOption.TCP_NODELAY, true)
         .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)  // 连接超时
         .option(ChannelOption.SO_RCVBUF, 32 * 1024)
         .option(ChannelOption.SO_SNDBUF, 32 * 1024);
```

**4. handler() - 设置Handler**

```java
bootstrap.handler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ch.pipeline().addLast(new MyHandler());
    }
});
```

**5. connect() - 连接服务器**

```java
// 连接指定主机和端口
ChannelFuture future = bootstrap.connect("localhost", 8080).sync();

// 连接InetSocketAddress
ChannelFuture future = bootstrap.connect(new InetSocketAddress("localhost", 8080)).sync();
```

### 4.3.3 完整的客户端示例

```java
public class FullFeaturedClient {
    
    private final String host;
    private final int port;
    
    public FullFeaturedClient(String host, int port) {
        this.host = host;
        this.port = port;
    }
    
    public void start() throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    
                    // 客户端选项
                    .option(ChannelOption.SO_KEEPALIVE, true)
                    .option(ChannelOption.TCP_NODELAY, true)
                    .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 5000)
                    .option(ChannelOption.SO_RCVBUF, 32 * 1024)
                    .option(ChannelOption.SO_SNDBUF, 32 * 1024)
                    .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
                    
                    // Handler
                    .handler(new ChannelInitializer<SocketChannel>() {
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
            System.out.println("连接服务器成功: " + host + ":" + port);
            
            Channel channel = future.channel();
            
            // 发送消息
            Scanner scanner = new Scanner(System.in);
            System.out.println("请输入消息（输入'quit'退出）：");
            
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if ("quit".equalsIgnoreCase(line)) {
                    break;
                }
                channel.writeAndFlush(line);
            }
            
            // 关闭连接
            channel.close().sync();
            
        } finally {
            group.shutdownGracefully();
        }
    }
    
    public static void main(String[] args) throws Exception {
        new FullFeaturedClient("localhost", 8080).start();
    }
}

class ClientBusinessHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("连接建立: " + ctx.channel().remoteAddress());
    }
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        System.out.println("收到响应: " + msg);
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("连接断开");
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("异常: " + cause.getMessage());
        ctx.close();
    }
}
```

---

## 4.4 启动参数配置详解

### 4.4.1 常用 ChannelOption

**TCP 相关**：

| 选项 | 说明 | 默认值 | 推荐值 |
|------|------|--------|--------|
| **SO_KEEPALIVE** | TCP保活机制 | false | true |
| **TCP_NODELAY** | 禁用Nagle算法 | false | true |
| **SO_REUSEADDR** | 地址重用 | false | true |
| **SO_LINGER** | 关闭时等待时间 | -1 | 0 |
| **SO_TIMEOUT** | 读取超时 | 0 | 30000 |

**缓冲区相关**：

| 选项 | 说明 | 默认值 | 推荐值 |
|------|------|--------|--------|
| **SO_RCVBUF** | 接收缓冲区大小 | 系统默认 | 32KB-64KB |
| **SO_SNDBUF** | 发送缓冲区大小 | 系统默认 | 32KB-64KB |
| **RCVBUF_ALLOCATOR** | 接收缓冲区分配器 | - | AdaptiveRecvByteBufAllocator |
| **ALLOCATOR** | ByteBuf分配器 | - | PooledByteBufAllocator |

**连接相关**：

| 选项 | 说明 | 默认值 | 推荐值 |
|------|------|--------|--------|
| **SO_BACKLOG** | 连接队列大小 | 系统默认 | 1024 |
| **CONNECT_TIMEOUT_MILLIS** | 连接超时时间 | 30000 | 5000 |

**其他**：

| 选项 | 说明 | 默认值 | 推荐值 |
|------|------|--------|--------|
| **WRITE_BUFFER_WATER_MARK** | 写缓冲区水位线 | - | new WriteBufferWaterMark(32KB, 64KB) |
| **MESSAGE_SIZE_ESTIMATOR** | 消息大小估算器 | - | DefaultMessageSizeEstimator |

### 4.4.2 配置示例

```java
ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
        
        // 服务端选项
        .option(ChannelOption.SO_BACKLOG, 1024)
        .option(ChannelOption.SO_REUSEADDR, true)
        .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        
        // 客户端选项
        .childOption(ChannelOption.SO_KEEPALIVE, true)
        .childOption(ChannelOption.TCP_NODELAY, true)
        .childOption(ChannelOption.SO_RCVBUF, 64 * 1024)
        .childOption(ChannelOption.SO_SNDBUF, 64 * 1024)
        .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        .childOption(ChannelOption.RCVBUF_ALLOCATOR, 
                new AdaptiveRecvByteBufAllocator(64, 1024, 65536))
        .childOption(ChannelOption.WRITE_BUFFER_WATER_MARK, 
                new WriteBufferWaterMark(32 * 1024, 64 * 1024));
```

### 4.4.3 性能优化配置

**高性能配置**：

```java
bootstrap
    // 使用池化内存分配器
    .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
    .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
    
    // 禁用Nagle算法，减少延迟
    .childOption(ChannelOption.TCP_NODELAY, true)
    
    // 增大缓冲区
    .childOption(ChannelOption.SO_RCVBUF, 128 * 1024)
    .childOption(ChannelOption.SO_SNDBUF, 128 * 1024)
    
    // 自适应接收缓冲区
    .childOption(ChannelOption.RCVBUF_ALLOCATOR, 
            new AdaptiveRecvByteBufAllocator(64, 2048, 65536))
    
    // 设置写缓冲区水位线
    .childOption(ChannelOption.WRITE_BUFFER_WATER_MARK, 
            new WriteBufferWaterMark(32 * 1024, 64 * 1024));
```

---

## 4.5 优雅关闭机制

### 4.5.1 为什么需要优雅关闭

**问题**：
- 直接关闭可能导致数据丢失
- 正在处理的请求被中断
- 资源没有正确释放

**优雅关闭的目标**：
- 停止接收新连接
- 等待现有连接处理完成
- 释放所有资源

### 4.5.2 shutdownGracefully() 方法

```java
public Future<?> shutdownGracefully(long quietPeriod, 
                                    long timeout, 
                                    TimeUnit unit)
```

**参数说明**：
- **quietPeriod**：静默期，在此期间如果有新任务提交，则重新计时
- **timeout**：最大等待时间，超时后强制关闭
- **unit**：时间单位

**默认值**：
```java
shutdownGracefully();  // quietPeriod=2秒, timeout=15秒
```

### 4.5.3 优雅关闭示例

**方式1：标准关闭**

```java
try {
    // 启动服务器
    ChannelFuture future = bootstrap.bind(8080).sync();
    future.channel().closeFuture().sync();
} finally {
    // 优雅关闭
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
```

**方式2：自定义关闭参数**

```java
finally {
    // 静默期2秒，超时15秒
    bossGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
    workerGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
}
```

**方式3：等待关闭完成**

```java
finally {
    Future<?> bossFuture = bossGroup.shutdownGracefully();
    Future<?> workerFuture = workerGroup.shutdownGracefully();
    
    // 等待关闭完成
    bossFuture.sync();
    workerFuture.sync();
    
    System.out.println("所有资源已释放");
}
```

**方式4：添加关闭钩子**

```java
public class GracefulShutdownServer {
    
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    
    public void start() throws Exception {
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();
        
        // 添加JVM关闭钩子
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("收到关闭信号，开始优雅关闭...");
            shutdown();
        }));
        
        // 启动服务器...
    }
    
    public void shutdown() {
        if (bossGroup != null) {
            bossGroup.shutdownGracefully();
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully();
        }
        System.out.println("服务器已关闭");
    }
}
```

### 4.5.4 完整的优雅关闭示例

```java
public class GracefulServer {
    
    private final int port;
    private EventLoopGroup bossGroup;
    private EventLoopGroup workerGroup;
    private Channel serverChannel;
    
    public GracefulServer(int port) {
        this.port = port;
    }
    
    public void start() throws Exception {
        bossGroup = new NioEventLoopGroup(1);
        workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new StringDecoder());
                            ch.pipeline().addLast(new StringEncoder());
                            ch.pipeline().addLast(new SimpleChannelInboundHandler<String>() {
                                @Override
                                protected void channelRead0(ChannelHandlerContext ctx, String msg) {
                                    // 模拟耗时操作
                                    try {
                                        Thread.sleep(5000);
                                    } catch (InterruptedException e) {
                                        e.printStackTrace();
                                    }
                                    ctx.writeAndFlush("处理完成: " + msg);
                                }
                            });
                        }
                    });
            
            ChannelFuture future = bootstrap.bind(port).sync();
            serverChannel = future.channel();
            System.out.println("服务器启动成功，监听端口: " + port);
            
            // 添加关闭钩子
            Runtime.getRuntime().addShutdownHook(new Thread(this::shutdown));
            
            serverChannel.closeFuture().sync();
        } finally {
            shutdown();
        }
    }
    
    public void shutdown() {
        System.out.println("开始优雅关闭...");
        
        // 1. 停止接收新连接
        if (serverChannel != null) {
            serverChannel.close();
        }
        
        // 2. 优雅关闭线程组
        if (bossGroup != null) {
            bossGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
        }
        if (workerGroup != null) {
            workerGroup.shutdownGracefully(2, 15, TimeUnit.SECONDS);
        }
        
        System.out.println("服务器已关闭");
    }
    
    public static void main(String[] args) throws Exception {
        new GracefulServer(8080).start();
    }
}
```

---

## 4.6 项目代码：完整的客户端-服务端通信

本章配套代码包含：
1. **标准服务器**：基本的服务端启动
2. **标准客户端**：基本的客户端启动
3. **完整功能服务器**：包含所有配置选项
4. **完整功能客户端**：包含所有配置选项
5. **优雅关闭示例**：演示优雅关闭机制

详细代码请参考：[项目代码/chapter04-bootstrap](../../项目代码/chapter04-bootstrap/)

---

## 4.7 本章小结

本章我们深入学习了 Bootstrap 启动器：

✅ **ServerBootstrap**：服务端启动器，使用 boss 和 worker 两个线程组  
✅ **Bootstrap**：客户端启动器，使用一个线程组  
✅ **启动参数配置**：ChannelOption 的各种选项  
✅ **优雅关闭机制**：shutdownGracefully() 的使用  

### 关键要点

1. **ServerBootstrap** 需要两个 EventLoopGroup（boss + worker）
2. **Bootstrap** 只需要一个 EventLoopGroup
3. **option()** 配置服务端 Channel，**childOption()** 配置客户端 Channel
4. **优雅关闭**使用 shutdownGracefully()，可以等待任务完成
5. **性能优化**：使用池化内存、禁用 Nagle 算法、增大缓冲区

### 启动流程对比

**服务端**：
```
创建EventLoopGroup → 创建ServerBootstrap → 配置参数 → 
绑定端口 → 等待关闭 → 优雅关闭
```

**客户端**：
```
创建EventLoopGroup → 创建Bootstrap → 配置参数 → 
连接服务器 → 发送数据 → 关闭连接 → 优雅关闭
```

### 下一章预告

下一章我们将学习 **ChannelHandler 详解**，包括：
- Handler 的生命周期
- 入站和出站 Handler
- Handler 的添加和移除
- 异常处理机制

---

## 练习题

1. **基础题**：编写一个服务器，支持配置端口和线程数
2. **进阶题**：实现一个客户端，支持断线重连
3. **挑战题**：实现一个支持优雅关闭的聊天服务器，关闭时通知所有在线用户

---

**上一章**：[第3章：Netty核心组件](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/3-netty.html)  
**下一章**：[第5章：ChannelHandler详解](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html)
