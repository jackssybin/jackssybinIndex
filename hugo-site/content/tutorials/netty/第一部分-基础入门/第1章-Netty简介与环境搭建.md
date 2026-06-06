---
title: 第1章：Netty 简介与环境搭建
description: 第1章：Netty 简介与环境搭建 1.1 什么是 Netty 1.1.1 Netty 的定义 Netty 是一个
  异步事件驱动的网络应用框架 ，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如
  TCP 和 UDP 套接字服务器的开发。 1.1.2 Netty 的核心特点 1. 设计优雅...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/1-netty.html
layout: tutorial
kind: tutorial
series: netty
seriesTitle: Netty教程
weight: 10
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第1章：Netty 简介与环境搭建

## 1.1 什么是 Netty

### 1.1.1 Netty 的定义

Netty 是一个**异步事件驱动的网络应用框架**，用于快速开发可维护的高性能协议服务器和客户端。它是基于 Java NIO 的客户端/服务器框架，极大地简化了网络编程，如 TCP 和 UDP 套接字服务器的开发。

### 1.1.2 Netty 的核心特点

1. **设计优雅**
   - 统一的 API，支持多种传输类型（阻塞和非阻塞）
   - 简单而强大的线程模型
   - 真正的无连接数据报套接字支持

2. **易于使用**
   - 详细的 Javadoc 和大量示例
   - 不需要额外的依赖，JDK 5+ 即可

3. **高性能**
   - 吞吐量更高，延迟更低
   - 减少资源消耗
   - 最小化不必要的内存复制

4. **安全**
   - 完整的 SSL/TLS 和 StartTLS 支持
   - 可在 Applet 与 Android 的限制环境运行

5. **社区活跃**
   - 持续更新和维护
   - 大量成功的商业/开源项目使用

### 1.1.3 Netty 的发展历史

| 版本 | 发布时间 | 主要特性 |
|------|---------|---------|
| Netty 3.x | 2008年 | 首个稳定版本，奠定基础架构 |
| Netty 4.x | 2013年 | 重大重构，性能大幅提升，目前主流版本 |
| Netty 5.x | 2015年（已废弃） | 实验性版本，后被官方放弃 |

**注意**：目前推荐使用 Netty 4.1.x 系列，这是最稳定和广泛使用的版本。

---

## 1.2 Netty 的应用场景

### 1.2.1 互联网行业

1. **RPC 框架**
   - Dubbo：阿里巴巴的分布式服务框架
   - gRPC：Google 的高性能 RPC 框架
   - Apache Thrift

2. **消息中间件**
   - RocketMQ：阿里巴巴的消息中间件
   - Kafka：部分网络层使用 Netty

3. **即时通讯**
   - 微信、QQ 等 IM 系统
   - 实时聊天应用
   - 推送服务

4. **游戏服务器**
   - 网络游戏服务端
   - 实时对战游戏
   - 棋牌游戏平台

### 1.2.2 大数据领域

1. **Hadoop 生态**
   - Apache Spark：使用 Netty 进行节点间通信
   - Apache Flink：网络层基于 Netty
   - Apache Storm

2. **数据库**
   - Cassandra：分布式数据库
   - HBase：使用 Netty 进行 RPC 通信

### 1.2.3 其他应用

- **API 网关**：如 Spring Cloud Gateway
- **代理服务器**：HTTP/SOCKS 代理
- **物联网**：设备通信、数据采集
- **流媒体**：视频直播、音频传输

---

## 1.3 Netty 的核心优势

### 1.3.1 相比传统 Java NIO 的优势

| 特性 | Java NIO | Netty |
|------|---------|-------|
| API 复杂度 | 复杂，需要深入理解 | 简单易用，封装良好 |
| 线程模型 | 需要自己实现 | 内置 Reactor 线程模型 |
| ByteBuffer | 功能有限，API 不友好 | ByteBuf 功能强大 |
| 粘包/拆包 | 需要手动处理 | 提供多种解码器 |
| 断线重连 | 需要自己实现 | 提供现成方案 |
| 内存泄漏 | 容易出现 | 引用计数机制 |
| 性能优化 | 需要深入优化 | 已经高度优化 |

### 1.3.2 技术优势详解

**1. 零拷贝（Zero-Copy）**
```
传统方式：
硬盘 → 内核缓冲区 → 用户缓冲区 → Socket缓冲区 → 网卡
       (拷贝1)      (拷贝2)      (拷贝3)

Netty零拷贝：
硬盘 → 内核缓冲区 → 网卡
       (拷贝1)
```

**2. 内存池技术**
- 减少 GC 压力
- 提高内存分配效率
- 支持堆内和堆外内存

**3. 高效的 Reactor 线程模型**
```
Boss线程组（接收连接）
    ↓
Worker线程组（处理I/O）
    ↓
业务线程池（处理业务逻辑）
```

**4. 无锁化串行设计**
- 每个 Channel 绑定到一个 EventLoop
- 避免多线程竞争
- 提高性能

---

## 1.4 开发环境准备

### 1.4.1 JDK 安装

**推荐版本**：JDK 8 / JDK 11 / JDK 17

**验证安装**：
```bash
java -version
javac -version
```

**预期输出**：
```
java version "1.8.0_301"
Java(TM) SE Runtime Environment (build 1.8.0_301-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.301-b09, mixed mode)
```

### 1.4.2 Maven 配置

**1. 创建 Maven 项目**

项目结构：
```
netty-demo/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/
    │   └── resources/
    └── test/
        └── java/
```

**2. pom.xml 配置**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.netty.tutorial</groupId>
    <artifactId>netty-demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>Netty Tutorial Demo</name>
    <description>Netty从入门到精通示例代码</description>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <netty.version>4.1.100.Final</netty.version>
        <slf4j.version>1.7.36</slf4j.version>
        <logback.version>1.2.11</logback.version>
    </properties>

    <dependencies>
        <!-- Netty核心依赖 -->
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-all</artifactId>
            <version>${netty.version}</version>
        </dependency>

        <!-- 日志依赖 -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>${slf4j.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>

        <!-- 单元测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 1.4.3 IDE 配置（IntelliJ IDEA）

**1. 导入项目**
- File → Open → 选择项目目录
- 等待 Maven 依赖下载完成

**2. 配置 JDK**
- File → Project Structure → Project
- 设置 Project SDK 为 JDK 8+

**3. 配置编码**
- File → Settings → Editor → File Encodings
- 设置为 UTF-8

### 1.4.4 日志配置

创建 `src/main/resources/logback.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
    </root>

    <!-- Netty日志级别 -->
    <logger name="io.netty" level="INFO"/>
</configuration>
```

---

## 1.5 第一个 Netty 程序（Hello World）

### 1.5.1 服务端实现

```java
package com.netty.tutorial.hello;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Netty Hello World 服务端
 * 功能：接收客户端消息并回复
 */
public class HelloWorldServer {
    
    private static final Logger logger = LoggerFactory.getLogger(HelloWorldServer.class);
    
    private final int port;
    
    public HelloWorldServer(int port) {
        this.port = port;
    }
    
    public void start() throws InterruptedException {
        // 1. 创建两个线程组
        // bossGroup: 负责接收客户端连接
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        // workerGroup: 负责处理已建立连接的I/O操作
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            // 2. 创建服务端启动引导类
            ServerBootstrap bootstrap = new ServerBootstrap();
            
            // 3. 配置启动参数
            bootstrap.group(bossGroup, workerGroup)
                    // 指定使用NIO传输Channel
                    .channel(NioServerSocketChannel.class)
                    // 设置服务端连接队列大小
                    .option(ChannelOption.SO_BACKLOG, 128)
                    // 设置保持连接
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    // 配置Channel初始化器
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            // 获取Pipeline
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 添加字符串解码器
                            pipeline.addLast("decoder", new StringDecoder());
                            // 添加字符串编码器
                            pipeline.addLast("encoder", new StringEncoder());
                            // 添加业务处理器
                            pipeline.addLast("handler", new HelloWorldServerHandler());
                        }
                    });
            
            // 4. 绑定端口，开始接收连接
            ChannelFuture future = bootstrap.bind(port).sync();
            logger.info("Netty服务器启动成功，监听端口: {}", port);
            
            // 5. 等待服务器socket关闭
            future.channel().closeFuture().sync();
            
        } finally {
            // 6. 优雅关闭线程组
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
            logger.info("Netty服务器已关闭");
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        new HelloWorldServer(8080).start();
    }
}
```

**服务端业务处理器**：

```java
package com.netty.tutorial.hello;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 服务端业务处理器
 */
public class HelloWorldServerHandler extends SimpleChannelInboundHandler<String> {
    
    private static final Logger logger = LoggerFactory.getLogger(HelloWorldServerHandler.class);
    
    /**
     * 连接建立时调用
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        logger.info("客户端连接成功: {}", ctx.channel().remoteAddress());
    }
    
    /**
     * 接收到消息时调用
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        logger.info("收到客户端消息: {}", msg);
        
        // 回复客户端
        String response = "服务器收到: " + msg;
        ctx.writeAndFlush(response);
        
        logger.info("回复客户端: {}", response);
    }
    
    /**
     * 连接断开时调用
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        logger.info("客户端断开连接: {}", ctx.channel().remoteAddress());
    }
    
    /**
     * 异常处理
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("发生异常: ", cause);
        ctx.close();
    }
}
```

### 1.5.2 客户端实现

```java
package com.netty.tutorial.hello;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Scanner;

/**
 * Netty Hello World 客户端
 * 功能：连接服务器并发送消息
 */
public class HelloWorldClient {
    
    private static final Logger logger = LoggerFactory.getLogger(HelloWorldClient.class);
    
    private final String host;
    private final int port;
    
    public HelloWorldClient(String host, int port) {
        this.host = host;
        this.port = port;
    }
    
    public void start() throws InterruptedException {
        // 1. 创建客户端线程组
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            // 2. 创建客户端启动引导类
            Bootstrap bootstrap = new Bootstrap();
            
            // 3. 配置启动参数
            bootstrap.group(group)
                    // 指定使用NIO传输Channel
                    .channel(NioSocketChannel.class)
                    // 配置Channel初始化器
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 添加字符串解码器
                            pipeline.addLast("decoder", new StringDecoder());
                            // 添加字符串编码器
                            pipeline.addLast("encoder", new StringEncoder());
                            // 添加业务处理器
                            pipeline.addLast("handler", new HelloWorldClientHandler());
                        }
                    });
            
            // 4. 连接服务器
            ChannelFuture future = bootstrap.connect(host, port).sync();
            logger.info("连接服务器成功: {}:{}", host, port);
            
            Channel channel = future.channel();
            
            // 5. 发送消息
            Scanner scanner = new Scanner(System.in);
            logger.info("请输入消息（输入'quit'退出）：");
            
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                if ("quit".equalsIgnoreCase(line)) {
                    break;
                }
                
                // 发送消息到服务器
                channel.writeAndFlush(line);
            }
            
            // 6. 关闭连接
            channel.close().sync();
            
        } finally {
            // 7. 优雅关闭线程组
            group.shutdownGracefully();
            logger.info("客户端已关闭");
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        new HelloWorldClient("localhost", 8080).start();
    }
}
```

**客户端业务处理器**：

```java
package com.netty.tutorial.hello;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 客户端业务处理器
 */
public class HelloWorldClientHandler extends SimpleChannelInboundHandler<String> {
    
    private static final Logger logger = LoggerFactory.getLogger(HelloWorldClientHandler.class);
    
    /**
     * 连接建立时调用
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        logger.info("成功连接到服务器: {}", ctx.channel().remoteAddress());
    }
    
    /**
     * 接收到消息时调用
     */
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        logger.info("收到服务器响应: {}", msg);
    }
    
    /**
     * 异常处理
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("发生异常: ", cause);
        ctx.close();
    }
}
```

### 1.5.3 运行测试

**1. 启动服务端**
```
运行 HelloWorldServer.main()
控制台输出：
15:30:00.123 [main] INFO  HelloWorldServer - Netty服务器启动成功，监听端口: 8080
```

**2. 启动客户端**
```
运行 HelloWorldClient.main()
控制台输出：
15:30:05.456 [main] INFO  HelloWorldClient - 连接服务器成功: localhost:8080
15:30:05.457 [nioEventLoopGroup-2-1] INFO  HelloWorldClientHandler - 成功连接到服务器: localhost/127.0.0.1:8080
请输入消息（输入'quit'退出）：
```

**3. 发送消息**
```
客户端输入：Hello Netty!

客户端输出：
15:30:10.789 [nioEventLoopGroup-2-1] INFO  HelloWorldClientHandler - 收到服务器响应: 服务器收到: Hello Netty!

服务端输出：
15:30:10.788 [nioEventLoopGroup-3-1] INFO  HelloWorldServerHandler - 收到客户端消息: Hello Netty!
15:30:10.789 [nioEventLoopGroup-3-1] INFO  HelloWorldServerHandler - 回复客户端: 服务器收到: Hello Netty!
```

---

## 1.6 项目代码：简单的 Echo 服务器

Echo 服务器是一个经典的网络编程示例，它会将接收到的数据原封不动地发送回客户端。

### 1.6.1 Echo 服务端

```java
package com.netty.tutorial.echo;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Echo服务器 - 回显服务器
 * 将接收到的数据原封不动地发送回客户端
 */
public class EchoServer {
    
    private static final Logger logger = LoggerFactory.getLogger(EchoServer.class);
    
    private final int port;
    
    public EchoServer(int port) {
        this.port = port;
    }
    
    public void start() throws InterruptedException {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new EchoServerHandler());
                        }
                    });
            
            ChannelFuture future = bootstrap.bind(port).sync();
            logger.info("Echo服务器启动成功，监听端口: {}", port);
            
            future.channel().closeFuture().sync();
            
        } finally {
            workerGroup.shutdownGracefully();
            bossGroup.shutdownGracefully();
            logger.info("Echo服务器已关闭");
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        new EchoServer(8888).start();
    }
}

/**
 * Echo服务器处理器
 */
class EchoServerHandler extends ChannelInboundHandlerAdapter {
    
    private static final Logger logger = LoggerFactory.getLogger(EchoServerHandler.class);
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf in = (ByteBuf) msg;
        
        // 读取接收到的数据
        String received = in.toString(CharsetUtil.UTF_8);
        logger.info("服务器接收到: {}", received);
        
        // 将数据原封不动地写回客户端
        ctx.write(in);
    }
    
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        // 将缓冲区的数据刷新到网络
        ctx.flush();
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("发生异常: ", cause);
        ctx.close();
    }
}
```

### 1.6.2 Echo 客户端

```java
package com.netty.tutorial.echo;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.util.CharsetUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Echo客户端
 */
public class EchoClient {
    
    private static final Logger logger = LoggerFactory.getLogger(EchoClient.class);
    
    private final String host;
    private final int port;
    
    public EchoClient(String host, int port) {
        this.host = host;
        this.port = port;
    }
    
    public void start() throws InterruptedException {
        EventLoopGroup group = new NioEventLoopGroup();
        
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new EchoClientHandler());
                        }
                    });
            
            ChannelFuture future = bootstrap.connect(host, port).sync();
            logger.info("Echo客户端连接成功: {}:{}", host, port);
            
            future.channel().closeFuture().sync();
            
        } finally {
            group.shutdownGracefully();
            logger.info("Echo客户端已关闭");
        }
    }
    
    public static void main(String[] args) throws InterruptedException {
        new EchoClient("localhost", 8888).start();
    }
}

/**
 * Echo客户端处理器
 */
class EchoClientHandler extends ChannelInboundHandlerAdapter {
    
    private static final Logger logger = LoggerFactory.getLogger(EchoClientHandler.class);
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // 连接建立后，发送消息
        String message = "Hello, Echo Server! 你好，回显服务器！";
        ByteBuf buf = Unpooled.copiedBuffer(message, CharsetUtil.UTF_8);
        ctx.writeAndFlush(buf);
        logger.info("发送消息: {}", message);
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf in = (ByteBuf) msg;
        String received = in.toString(CharsetUtil.UTF_8);
        logger.info("接收到回显: {}", received);
        
        // 释放ByteBuf
        in.release();
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.error("发生异常: ", cause);
        ctx.close();
    }
}
```

---

## 1.7 代码解析

### 1.7.1 核心组件说明

| 组件 | 说明 |
|------|------|
| **EventLoopGroup** | 事件循环组，管理多个EventLoop |
| **ServerBootstrap** | 服务端启动引导类 |
| **Bootstrap** | 客户端启动引导类 |
| **Channel** | 网络通道，代表一个连接 |
| **ChannelHandler** | 处理器，处理I/O事件 |
| **ChannelPipeline** | 处理器链，管理多个Handler |
| **ByteBuf** | 字节缓冲区，Netty的数据容器 |

### 1.7.2 执行流程

**服务端启动流程**：
```
1. 创建EventLoopGroup（bossGroup和workerGroup）
2. 创建ServerBootstrap
3. 配置Channel类型和参数
4. 设置ChannelHandler
5. 绑定端口
6. 等待连接
```

**客户端连接流程**：
```
1. 创建EventLoopGroup
2. 创建Bootstrap
3. 配置Channel类型和参数
4. 设置ChannelHandler
5. 连接服务器
6. 发送/接收数据
```

---

## 1.8 本章小结

本章我们学习了：

✅ **Netty 的基本概念**：异步事件驱动的网络框架  
✅ **Netty 的应用场景**：RPC、消息中间件、IM、游戏等  
✅ **Netty 的核心优势**：高性能、易用、零拷贝、内存池  
✅ **开发环境搭建**：JDK、Maven、IDE配置  
✅ **第一个程序**：Hello World 示例  
✅ **Echo 服务器**：经典的回显服务器实现  

### 关键要点

1. Netty 是基于 Java NIO 的高性能网络框架
2. 使用 Reactor 线程模型，分离连接接收和I/O处理
3. 通过 ChannelPipeline 实现责任链模式
4. ByteBuf 是 Netty 的核心数据容器

### 下一章预告

下一章我们将深入学习**网络编程基础**，包括：
- BIO、NIO、AIO 的区别
- Java NIO 核心组件
- 传统 Socket 编程的问题
- Netty 如何优雅地解决这些问题

---

## 练习题

1. **基础题**：修改 Hello World 示例，让服务器在回复时加上时间戳
2. **进阶题**：实现一个简单的计算器服务器，客户端发送表达式（如"1+2"），服务器返回计算结果
3. **挑战题**：实现一个支持多客户端的聊天室，客户端发送的消息会广播给所有连接的客户端

**提示**：可以使用 `ChannelGroup` 来管理多个客户端连接。

---

**下一章**：[第2章：网络编程基础](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/2.html)
