---
title: 第5章：ChannelHandler 详解
description: 第5章：ChannelHandler 详解 本章导读 ChannelHandler 是 Netty 处理 I/O
  事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。 5.1
  ChannelInboundHandler（入站处理器） 5.1.1 入站处理器概述 定义 ：...
url: /netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html
layout: tutorial
contentType: tutorial
series: netty
seriesTitle: Netty教程
weight: 50
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第5章：ChannelHandler 详解

## 本章导读

ChannelHandler 是 Netty 处理 I/O 事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。

---

## 5.1 ChannelInboundHandler（入站处理器）

### 5.1.1 入站处理器概述

**定义**：ChannelInboundHandler 用于处理入站事件，如连接建立、数据读取等。

**事件流向**：从 Head → Tail

### 5.1.2 生命周期方法

```java
public interface ChannelInboundHandler extends ChannelHandler {
    
    // 1. Channel注册到EventLoop
    void channelRegistered(ChannelHandlerContext ctx) throws Exception;
    
    // 2. Channel从EventLoop注销
    void channelUnregistered(ChannelHandlerContext ctx) throws Exception;
    
    // 3. Channel激活（连接建立）
    void channelActive(ChannelHandlerContext ctx) throws Exception;
    
    // 4. Channel失活（连接断开）
    void channelInactive(ChannelHandlerContext ctx) throws Exception;
    
    // 5. 读取数据
    void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception;
    
    // 6. 读取完成
    void channelReadComplete(ChannelHandlerContext ctx) throws Exception;
    
    // 7. 用户自定义事件
    void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception;
    
    // 8. Channel可写状态改变
    void channelWritabilityChanged(ChannelHandlerContext ctx) throws Exception;
    
    // 9. 异常捕获
    void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception;
}
```

### 5.1.3 生命周期顺序

```
channelRegistered → channelActive → channelRead → channelReadComplete → 
channelInactive → channelUnregistered
```

**完整示例**：

```java
public class LifecycleHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void handlerAdded(ChannelHandlerContext ctx) {
        System.out.println("1. handlerAdded: Handler被添加到Pipeline");
    }
    
    @Override
    public void channelRegistered(ChannelHandlerContext ctx) {
        System.out.println("2. channelRegistered: Channel注册到EventLoop");
        ctx.fireChannelRegistered();
    }
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("3. channelActive: Channel激活（连接建立）");
        System.out.println("   本地地址: " + ctx.channel().localAddress());
        System.out.println("   远程地址: " + ctx.channel().remoteAddress());
        ctx.fireChannelActive();
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("4. channelRead: 读取数据");
        System.out.println("   数据: " + msg);
        ctx.fireChannelRead(msg);
    }
    
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) {
        System.out.println("5. channelReadComplete: 读取完成");
        ctx.fireChannelReadComplete();
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("6. channelInactive: Channel失活（连接断开）");
        ctx.fireChannelInactive();
    }
    
    @Override
    public void channelUnregistered(ChannelHandlerContext ctx) {
        System.out.println("7. channelUnregistered: Channel从EventLoop注销");
        ctx.fireChannelUnregistered();
    }
    
    @Override
    public void handlerRemoved(ChannelHandlerContext ctx) {
        System.out.println("8. handlerRemoved: Handler从Pipeline移除");
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.out.println("9. exceptionCaught: 捕获异常");
        System.out.println("   异常: " + cause.getMessage());
        ctx.close();
    }
}
```

### 5.1.4 ChannelInboundHandlerAdapter

**定义**：提供默认实现的适配器类。

**特点**：
- 所有方法都有默认实现
- 默认实现会将事件传递给下一个 Handler
- 可以选择性地重写需要的方法

```java
public class MyInboundHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("连接建立");
        // 必须调用，否则事件不会传播
        ctx.fireChannelActive();
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("读取数据: " + msg);
        // 传递给下一个Handler
        ctx.fireChannelRead(msg);
        
        // 注意：如果不传递，需要手动释放msg
        // ReferenceCountUtil.release(msg);
    }
}
```

### 5.1.5 SimpleChannelInboundHandler

**定义**：泛型入站处理器，自动释放消息。

**优势**：
- 自动类型转换
- 自动释放消息，避免内存泄漏
- 代码更简洁

**对比**：

```java
// 方式1：使用ChannelInboundHandlerAdapter（需要手动释放）
public class Handler1 extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        try {
            ByteBuf buf = (ByteBuf) msg;
            // 处理数据...
        } finally {
            // 必须手动释放
            ReferenceCountUtil.release(msg);
        }
    }
}

// 方式2：使用SimpleChannelInboundHandler（自动释放）
public class Handler2 extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        // 处理数据...
        // 不需要手动释放，框架会自动释放
    }
}
```

**完整示例**：

```java
public class StringHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("连接建立: " + ctx.channel().remoteAddress());
    }
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        // 自动类型转换为String
        System.out.println("收到消息: " + msg);
        
        // 处理业务逻辑
        String response = processMessage(msg);
        
        // 发送响应
        ctx.writeAndFlush(response);
        
        // 不需要手动释放msg
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("连接断开: " + ctx.channel().remoteAddress());
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("异常: " + cause.getMessage());
        ctx.close();
    }
    
    private String processMessage(String msg) {
        // 业务逻辑处理
        return "处理结果: " + msg.toUpperCase();
    }
}
```

---

## 5.2 ChannelOutboundHandler（出站处理器）

### 5.2.1 出站处理器概述

**定义**：ChannelOutboundHandler 用于处理出站事件，如连接、写入、刷新等。

**事件流向**：从 Tail → Head

### 5.2.2 核心方法

```java
public interface ChannelOutboundHandler extends ChannelHandler {
    
    // 绑定地址
    void bind(ChannelHandlerContext ctx, SocketAddress localAddress, 
              ChannelPromise promise) throws Exception;
    
    // 连接远程地址
    void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress,
                 SocketAddress localAddress, ChannelPromise promise) throws Exception;
    
    // 断开连接
    void disconnect(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;
    
    // 关闭Channel
    void close(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;
    
    // 注销Channel
    void deregister(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;
    
    // 读取数据
    void read(ChannelHandlerContext ctx) throws Exception;
    
    // 写入数据
    void write(ChannelHandlerContext ctx, Object msg, 
               ChannelPromise promise) throws Exception;
    
    // 刷新数据
    void flush(ChannelHandlerContext ctx) throws Exception;
}
```

### 5.2.3 ChannelOutboundHandlerAdapter

```java
public class MyOutboundHandler extends ChannelOutboundHandlerAdapter {
    
    @Override
    public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
        System.out.println("写入数据: " + msg);
        
        // 可以修改数据
        if (msg instanceof String) {
            String data = (String) msg;
            msg = "[" + LocalDateTime.now() + "] " + data;
        }
        
        // 传递给下一个Handler
        ctx.write(msg, promise);
    }
    
    @Override
    public void flush(ChannelHandlerContext ctx) {
        System.out.println("刷新数据到网络");
        ctx.flush();
    }
    
    @Override
    public void close(ChannelHandlerContext ctx, ChannelPromise promise) {
        System.out.println("关闭连接");
        ctx.close(promise);
    }
}
```

### 5.2.4 入站和出站Handler的区别

| 特性 | InboundHandler | OutboundHandler |
|------|----------------|-----------------|
| **处理事件** | 读取、连接建立等 | 写入、连接、关闭等 |
| **事件流向** | Head → Tail | Tail → Head |
| **触发方式** | 自动触发 | 手动触发 |
| **常用场景** | 解码、业务处理 | 编码、日志记录 |

**示例**：

```java
pipeline.addLast("inbound1", new InboundHandler1());   // 入站
pipeline.addLast("inbound2", new InboundHandler2());   // 入站
pipeline.addLast("outbound1", new OutboundHandler1()); // 出站
pipeline.addLast("outbound2", new OutboundHandler2()); // 出站

// 入站事件流向：inbound1 → inbound2
// 出站事件流向：outbound2 → outbound1
```

---

## 5.3 Handler 的添加和移除

### 5.3.1 添加 Handler

**在 ChannelInitializer 中添加**：

```java
bootstrap.childHandler(new ChannelInitializer<SocketChannel>() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ChannelPipeline pipeline = ch.pipeline();
        
        // 添加到尾部
        pipeline.addLast("handler1", new Handler1());
        pipeline.addLast("handler2", new Handler2());
        
        // 添加到头部
        pipeline.addFirst("handler0", new Handler0());
        
        // 在指定Handler之前添加
        pipeline.addBefore("handler2", "handler1.5", new Handler15());
        
        // 在指定Handler之后添加
        pipeline.addAfter("handler1", "handler1.2", new Handler12());
    }
});
```

**动态添加 Handler**：

```java
public class DynamicHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // 动态添加Handler
        if (needAuth) {
            ctx.pipeline().addFirst("auth", new AuthHandler());
        }
        
        if (needEncrypt) {
            ctx.pipeline().addLast("encrypt", new EncryptHandler());
        }
        
        ctx.fireChannelActive();
    }
}
```

### 5.3.2 移除 Handler

```java
public class RemovableHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 处理消息
        System.out.println("处理消息: " + msg);
        
        // 移除自己（一次性Handler）
        ctx.pipeline().remove(this);
        
        // 或者通过名称移除
        // ctx.pipeline().remove("handlerName");
        
        ctx.fireChannelRead(msg);
    }
}
```

**移除方法**：

```java
// 1. 通过Handler实例移除
pipeline.remove(handler);

// 2. 通过Handler名称移除
pipeline.remove("handlerName");

// 3. 通过Handler类型移除
pipeline.remove(MyHandler.class);

// 4. 移除第一个Handler
pipeline.removeFirst();

// 5. 移除最后一个Handler
pipeline.removeLast();
```

### 5.3.3 替换 Handler

```java
// 1. 替换指定Handler
pipeline.replace(oldHandler, "newHandler", newHandler);

// 2. 通过名称替换
pipeline.replace("oldName", "newName", newHandler);

// 3. 通过类型替换
pipeline.replace(OldHandler.class, "newHandler", newHandler);
```

### 5.3.4 实战示例：认证Handler

```java
public class AuthHandler extends ChannelInboundHandlerAdapter {
    
    private boolean authenticated = false;
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        if (!authenticated) {
            // 验证消息
            if (isValidAuth(msg)) {
                authenticated = true;
                System.out.println("认证成功");
                
                // 认证成功后移除自己
                ctx.pipeline().remove(this);
                
                // 传递给下一个Handler
                ctx.fireChannelRead(msg);
            } else {
                System.out.println("认证失败，关闭连接");
                ctx.close();
            }
        } else {
            ctx.fireChannelRead(msg);
        }
    }
    
    private boolean isValidAuth(Object msg) {
        // 验证逻辑
        return "AUTH:secret".equals(msg.toString());
    }
}
```

---

## 5.4 异常处理机制

### 5.4.1 异常传播

**入站异常**：从发生异常的 Handler 向后传播

```java
Handler1 → Handler2 → Handler3(异常) → Handler4 → Handler5
                                ↓
                        exceptionCaught()
```

**出站异常**：通过 ChannelPromise 传递

```java
ctx.write(msg).addListener(future -> {
    if (!future.isSuccess()) {
        // 处理异常
        Throwable cause = future.cause();
    }
});
```

### 5.4.2 异常处理最佳实践

**方式1：在每个Handler中处理**

```java
public class Handler1 extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        try {
            // 处理消息
            processMessage(msg);
        } catch (Exception e) {
            // 处理异常
            System.err.println("处理失败: " + e.getMessage());
            ctx.fireExceptionCaught(e);
        }
    }
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.err.println("捕获异常: " + cause.getMessage());
        ctx.fireExceptionCaught(cause);
    }
}
```

**方式2：统一异常处理Handler（推荐）**

```java
public class GlobalExceptionHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        // 记录日志
        logger.error("发生异常", cause);
        
        // 根据异常类型处理
        if (cause instanceof IOException) {
            System.err.println("IO异常: " + cause.getMessage());
        } else if (cause instanceof TimeoutException) {
            System.err.println("超时异常: " + cause.getMessage());
        } else {
            System.err.println("未知异常: " + cause.getMessage());
        }
        
        // 发送错误响应
        ctx.writeAndFlush("ERROR: " + cause.getMessage());
        
        // 关闭连接
        ctx.close();
    }
}

// 添加到Pipeline的最后
pipeline.addLast("exceptionHandler", new GlobalExceptionHandler());
```

**方式3：使用 ChannelFutureListener**

```java
ChannelFuture future = ctx.writeAndFlush(msg);
future.addListener((ChannelFutureListener) f -> {
    if (!f.isSuccess()) {
        Throwable cause = f.cause();
        System.err.println("发送失败: " + cause.getMessage());
        
        // 处理异常
        if (cause instanceof IOException) {
            // 重试
            retry(ctx, msg);
        } else {
            // 关闭连接
            ctx.close();
        }
    }
});
```

### 5.4.3 完整的异常处理示例

```java
public class ExceptionHandlingServer {
    
    public static void main(String[] args) throws Exception {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 业务Handler
                            pipeline.addLast("business", new BusinessHandler());
                            
                            // 全局异常处理Handler（放在最后）
                            pipeline.addLast("exception", new GlobalExceptionHandler());
                        }
                    });
            
            ChannelFuture future = bootstrap.bind(8080).sync();
            future.channel().closeFuture().sync();
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
}

class BusinessHandler extends SimpleChannelInboundHandler<String> {
    
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String msg) {
        try {
            // 业务处理
            if ("error".equals(msg)) {
                throw new RuntimeException("业务异常");
            }
            
            ctx.writeAndFlush("处理成功: " + msg);
        } catch (Exception e) {
            // 传播异常
            ctx.fireExceptionCaught(e);
        }
    }
}

class GlobalExceptionHandler extends ChannelInboundHandlerAdapter {
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        // 记录日志
        logger.error("捕获异常", cause);
        
        // 发送错误响应
        String errorMsg = "服务器错误: " + cause.getMessage();
        ctx.writeAndFlush(errorMsg).addListener(ChannelFutureListener.CLOSE);
    }
}
```

---

## 5.5 ChannelHandlerContext

### 5.5.1 ChannelHandlerContext 概述

**定义**：ChannelHandlerContext 是 Handler 和 Pipeline 之间的桥梁。

**核心功能**：
- 获取 Channel、Pipeline、EventLoop
- 触发入站和出站事件
- 读写数据
- 管理 Handler 的属性

### 5.5.2 核心方法

```java
public interface ChannelHandlerContext {
    
    // 获取Channel
    Channel channel();
    
    // 获取Pipeline
    ChannelPipeline pipeline();
    
    // 获取EventLoop
    EventLoop executor();
    
    // 获取Handler
    ChannelHandler handler();
    
    // 触发入站事件
    ChannelHandlerContext fireChannelActive();
    ChannelHandlerContext fireChannelRead(Object msg);
    ChannelHandlerContext fireChannelReadComplete();
    ChannelHandlerContext fireExceptionCaught(Throwable cause);
    
    // 触发出站事件
    ChannelFuture write(Object msg);
    ChannelFuture writeAndFlush(Object msg);
    ChannelHandlerContext flush();
    ChannelFuture close();
    
    // 属性管理
    <T> Attribute<T> attr(AttributeKey<T> key);
}
```

### 5.5.3 ctx vs channel

**区别**：

```java
// 方式1：通过ctx触发事件（从当前Handler开始）
ctx.writeAndFlush(msg);  // 从当前Handler向前传播

// 方式2：通过channel触发事件（从Pipeline尾部开始）
ctx.channel().writeAndFlush(msg);  // 从Pipeline尾部开始传播
```

**示例**：

```java
pipeline.addLast("handler1", new OutboundHandler1());
pipeline.addLast("handler2", new OutboundHandler2());
pipeline.addLast("handler3", new OutboundHandler3());

// 在handler3中：
ctx.writeAndFlush(msg);  // 只经过handler2和handler1
ctx.channel().writeAndFlush(msg);  // 经过handler3、handler2和handler1
```

### 5.5.4 属性管理

```java
public class AttributeHandler extends ChannelInboundHandlerAdapter {
    
    // 定义属性Key
    private static final AttributeKey<Integer> COUNTER = 
            AttributeKey.valueOf("counter");
    
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        // 设置属性
        ctx.channel().attr(COUNTER).set(0);
        ctx.fireChannelActive();
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 获取属性
        Attribute<Integer> attr = ctx.channel().attr(COUNTER);
        Integer count = attr.get();
        
        // 更新属性
        attr.set(count + 1);
        
        System.out.println("消息计数: " + attr.get());
        ctx.fireChannelRead(msg);
    }
}
```

---

## 5.6 实战示例：完整的Handler链

```java
public class CompleteHandlerChain {
    
    public static void main(String[] args) throws Exception {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) {
                            ChannelPipeline pipeline = ch.pipeline();
                            
                            // 1. 日志Handler
                            pipeline.addLast("logger", new LoggingHandler());
                            
                            // 2. 编解码Handler
                            pipeline.addLast("decoder", new StringDecoder());
                            pipeline.addLast("encoder", new StringEncoder());
                            
                            // 3. 认证Handler
                            pipeline.addLast("auth", new AuthHandler());
                            
                            // 4. 业务Handler
                            pipeline.addLast("business", new BusinessHandler());
                            
                            // 5. 全局异常Handler
                            pipeline.addLast("exception", new GlobalExceptionHandler());
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

// 日志Handler
class LoggingHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        System.out.println("[LOG] 连接建立: " + ctx.channel().remoteAddress());
        ctx.fireChannelActive();
    }
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        System.out.println("[LOG] 收到数据: " + msg);
        ctx.fireChannelRead(msg);
    }
    
    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        System.out.println("[LOG] 连接断开");
        ctx.fireChannelInactive();
    }
}
```

---

## 5.7 本章小结

本章我们深入学习了 ChannelHandler：

✅ **ChannelInboundHandler**：处理入站事件，事件从 Head → Tail  
✅ **ChannelOutboundHandler**：处理出站事件，事件从 Tail → Head  
✅ **SimpleChannelInboundHandler**：自动释放消息，避免内存泄漏  
✅ **Handler 生命周期**：从添加到移除的完整流程  
✅ **异常处理**：统一异常处理 Handler 的最佳实践  
✅ **ChannelHandlerContext**：Handler 和 Pipeline 的桥梁  

### 关键要点

1. **入站 Handler** 处理读取事件，**出站 Handler** 处理写入事件
2. 使用 **SimpleChannelInboundHandler** 可以自动释放消息
3. **异常处理** 应该放在 Pipeline 的最后
4. **ctx.write()** 从当前 Handler 传播，**channel.write()** 从 Pipeline 尾部传播
5. Handler 可以动态添加和移除

### Handler 最佳实践

1. ✅ 使用 `SimpleChannelInboundHandler` 处理特定类型的消息
2. ✅ 在 Pipeline 最后添加全局异常处理 Handler
3. ✅ 一次性 Handler 处理完后应该移除自己
4. ✅ 使用 `ctx.fireXxx()` 传播事件
5. ✅ 不要在 Handler 中执行耗时操作，应该提交到业务线程池

### 下一章预告

下一章我们将学习 **ByteBuf 缓冲区**，包括：
- ByteBuf 的优势
- ByteBuf 的分类
- 读写操作
- 引用计数与内存管理
- ByteBuf 分配器

---

## 练习题

1. **基础题**：编写一个 Handler，打印完整的生命周期
2. **进阶题**：实现一个认证 Handler，认证成功后自动移除
3. **挑战题**：实现一个限流 Handler，每秒最多处理 100 个请求

---

**上一章**：[第4章：Bootstrap启动器](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html)  
**下一章**：[第6章：ByteBuf缓冲区](/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html)
