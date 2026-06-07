---
title: 第6章：ByteBuf 缓冲区
description: 第6章：ByteBuf 缓冲区 本章导读 ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的
  ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。 6.1
  ByteBuf 的优势 6.1.1 ByteBuffer vs ByteBuf Java NI...
url: /netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html
layout: tutorial
contentType: tutorial
series: netty
seriesTitle: Netty教程
weight: 60
tags:
  - Netty
  - Java NIO
  - 网络编程
  - 教程
draft: false
---

# 第6章：ByteBuf 缓冲区

## 本章导读

ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的 ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。

---

## 6.1 ByteBuf 的优势

### 6.1.1 ByteBuffer vs ByteBuf

**Java NIO ByteBuffer 的问题**：

| 问题 | 说明 |
|------|------|
| **单一位置指针** | position 既用于读又用于写，需要手动 flip() |
| **容量固定** | 创建后容量不可变，无法动态扩容 |
| **API 不友好** | 方法命名不直观，容易出错 |
| **无引用计数** | 容易造成内存泄漏 |

**Netty ByteBuf 的优势**：

| 优势 | 说明 |
|------|------|
| **双指针** | readerIndex 和 writerIndex 分离，无需 flip() |
| **动态扩容** | 可以自动扩容，更灵活 |
| **链式调用** | 支持方法链式调用，代码更简洁 |
| **引用计数** | 自动内存管理，避免内存泄漏 |
| **零拷贝** | 支持 slice、duplicate、composite 等零拷贝操作 |
| **池化** | 支持内存池，减少 GC 压力 |

### 6.1.2 ByteBuf 的结构

```
+-------------------+------------------+------------------+
| discardable bytes |  readable bytes  |  writable bytes  |
|                   |     (CONTENT)    |                  |
+-------------------+------------------+------------------+
|                   |                  |                  |
0      <=      readerIndex   <=   writerIndex    <=    capacity
```

**三个区域**：
1. **已读区域**（0 ~ readerIndex）：可以丢弃
2. **可读区域**（readerIndex ~ writerIndex）：实际数据
3. **可写区域**（writerIndex ~ capacity）：可以写入

**关键索引**：
- **readerIndex**：读指针，下一个读取的位置
- **writerIndex**：写指针，下一个写入的位置
- **capacity**：容量，最大可写位置

### 6.1.3 对比示例

**ByteBuffer（需要 flip）**：

```java
ByteBuffer buffer = ByteBuffer.allocate(1024);

// 写入数据
buffer.put("Hello".getBytes());

// 切换到读模式（必须）
buffer.flip();

// 读取数据
while (buffer.hasRemaining()) {
    byte b = buffer.get();
}

// 清空（准备下次写入）
buffer.clear();
```

**ByteBuf（无需 flip）**：

```java
ByteBuf buf = Unpooled.buffer(1024);

// 写入数据
buf.writeBytes("Hello".getBytes());

// 直接读取（无需 flip）
while (buf.isReadable()) {
    byte b = buf.readByte();
}

// 清空
buf.clear();
```

---

## 6.2 ByteBuf 的分类

### 6.2.1 按内存分配方式分类

**1. 堆缓冲区（Heap Buffer）**

```java
// 创建堆缓冲区
ByteBuf heapBuf = Unpooled.buffer(256);

// 特点：
// - 数据存储在 JVM 堆内存
// - 可以快速分配和释放
// - 受 GC 管理
// - 适合小数据量

// 判断是否是堆缓冲区
if (heapBuf.hasArray()) {
    byte[] array = heapBuf.array();
    int offset = heapBuf.arrayOffset() + heapBuf.readerIndex();
    int length = heapBuf.readableBytes();
    // 处理数组...
}
```

**2. 直接缓冲区（Direct Buffer）**

```java
// 创建直接缓冲区
ByteBuf directBuf = Unpooled.directBuffer(256);

// 特点：
// - 数据存储在堆外内存（操作系统内存）
// - 分配和释放较慢
// - 不受 GC 影响
// - 适合大数据量和网络 I/O
// - 支持零拷贝

// 判断是否是直接缓冲区
if (directBuf.isDirect()) {
    // 直接缓冲区没有 backing array
    // 需要使用 getBytes() 或 readBytes()
    byte[] data = new byte[directBuf.readableBytes()];
    directBuf.getBytes(directBuf.readerIndex(), data);
}
```

**3. 复合缓冲区（Composite Buffer）**

```java
// 创建复合缓冲区
CompositeByteBuf compositeBuf = Unpooled.compositeBuffer();

// 添加多个 ByteBuf
ByteBuf headerBuf = Unpooled.buffer(12);
ByteBuf bodyBuf = Unpooled.buffer(256);

compositeBuf.addComponents(headerBuf, bodyBuf);

// 特点：
// - 聚合多个 ByteBuf
// - 避免内存拷贝
// - 实现零拷贝
// - 适合组合多个数据块

// 遍历所有组件
for (ByteBuf buf : compositeBuf) {
    System.out.println(buf.toString(CharsetUtil.UTF_8));
}
```

### 6.2.2 按内存管理方式分类

**1. 池化（Pooled）**

```java
// 使用池化分配器
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
ByteBuf pooledBuf = allocator.buffer(256);

// 特点：
// - 从内存池分配
// - 减少内存分配开销
// - 减少 GC 压力
// - 性能更好
// - 需要手动释放

// 使用完后释放
pooledBuf.release();
```

**2. 非池化（Unpooled）**

```java
// 使用非池化分配器
ByteBuf unpooledBuf = Unpooled.buffer(256);

// 特点：
// - 每次都分配新内存
// - 使用简单
// - 性能较池化差
// - 适合小数据量

// 使用完后释放
unpooledBuf.release();
```

### 6.2.3 分类对比

| 类型 | 内存位置 | 性能 | GC影响 | 适用场景 |
|------|---------|------|--------|---------|
| **Heap Buffer** | JVM堆 | 中 | 有 | 小数据量 |
| **Direct Buffer** | 堆外 | 高 | 无 | 大数据量、网络I/O |
| **Composite Buffer** | 混合 | 高 | 取决于组件 | 组合多个数据块 |
| **Pooled** | 内存池 | 高 | 小 | 高频分配场景 |
| **Unpooled** | 新分配 | 中 | 大 | 低频分配场景 |

---

## 6.3 读写操作与索引管理

### 6.3.1 创建 ByteBuf

```java
// 1. 使用 Unpooled 工具类
ByteBuf buf1 = Unpooled.buffer(256);              // 堆缓冲区
ByteBuf buf2 = Unpooled.directBuffer(256);        // 直接缓冲区
ByteBuf buf3 = Unpooled.copiedBuffer("Hello", CharsetUtil.UTF_8);  // 复制数据

// 2. 使用 ByteBufAllocator
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
ByteBuf buf4 = allocator.buffer(256);             // 池化缓冲区
ByteBuf buf5 = allocator.directBuffer(256);       // 池化直接缓冲区

// 3. 在 ChannelHandlerContext 中
ctx.alloc().buffer(256);
```

### 6.3.2 写入操作

**基本类型写入**：

```java
ByteBuf buf = Unpooled.buffer(256);

// 写入基本类型
buf.writeBoolean(true);           // 1 字节
buf.writeByte(127);               // 1 字节
buf.writeShort(32767);            // 2 字节
buf.writeInt(2147483647);         // 4 字节
buf.writeLong(9223372036854775807L);  // 8 字节
buf.writeFloat(3.14f);            // 4 字节
buf.writeDouble(3.14159);         // 8 字节
buf.writeChar('A');               // 2 字节

// 写入字节数组
buf.writeBytes("Hello".getBytes());

// 写入另一个 ByteBuf
ByteBuf source = Unpooled.copiedBuffer("World", CharsetUtil.UTF_8);
buf.writeBytes(source);

// writerIndex 会自动增加
System.out.println("writerIndex: " + buf.writerIndex());
```

**set 方法（不移动索引）**：

```java
ByteBuf buf = Unpooled.buffer(256);

// set 方法不会移动 writerIndex
buf.setInt(0, 100);
buf.setLong(4, 200L);

// writerIndex 不变
System.out.println("writerIndex: " + buf.writerIndex());  // 0

// 需要手动设置 writerIndex
buf.writerIndex(12);
```

### 6.3.3 读取操作

**基本类型读取**：

```java
ByteBuf buf = Unpooled.buffer(256);
buf.writeInt(100);
buf.writeLong(200L);
buf.writeBytes("Hello".getBytes());

// 读取基本类型
int i = buf.readInt();            // 4 字节
long l = buf.readLong();          // 8 字节

// 读取字节数组
byte[] bytes = new byte[5];
buf.readBytes(bytes);

// readerIndex 会自动增加
System.out.println("readerIndex: " + buf.readerIndex());
```

**get 方法（不移动索引）**：

```java
ByteBuf buf = Unpooled.buffer(256);
buf.writeInt(100);
buf.writeLong(200L);

// get 方法不会移动 readerIndex
int i = buf.getInt(0);
long l = buf.getLong(4);

// readerIndex 不变
System.out.println("readerIndex: " + buf.readerIndex());  // 0
```

### 6.3.4 索引管理

```java
ByteBuf buf = Unpooled.buffer(256);
buf.writeBytes("Hello World".getBytes());

// 获取索引
int readerIndex = buf.readerIndex();      // 0
int writerIndex = buf.writerIndex();      // 11
int capacity = buf.capacity();            // 256

// 可读字节数
int readable = buf.readableBytes();       // 11

// 可写字节数
int writable = buf.writableBytes();       // 245

// 设置索引
buf.readerIndex(0);
buf.writerIndex(5);

// 标记和重置
buf.markReaderIndex();
buf.readInt();
buf.resetReaderIndex();  // 回到标记位置

// 清空（重置索引）
buf.clear();  // readerIndex = writerIndex = 0

// 丢弃已读字节
buf.discardReadBytes();  // 将未读数据移到开头
```

### 6.3.5 完整示例

```java
public class ByteBufDemo {
    public static void main(String[] args) {
        // 创建 ByteBuf
        ByteBuf buf = Unpooled.buffer(256);
        
        System.out.println("=== 初始状态 ===");
        printBuf(buf);
        
        // 写入数据
        buf.writeBytes("Netty".getBytes());
        System.out.println("\n=== 写入 'Netty' ===");
        printBuf(buf);
        
        // 读取数据
        byte[] data = new byte[3];
        buf.readBytes(data);
        System.out.println("\n=== 读取 3 字节 ===");
        System.out.println("读取的数据: " + new String(data));
        printBuf(buf);
        
        // 继续写入
        buf.writeBytes(" is awesome!".getBytes());
        System.out.println("\n=== 写入 ' is awesome!' ===");
        printBuf(buf);
        
        // 读取所有数据
        byte[] allData = new byte[buf.readableBytes()];
        buf.readBytes(allData);
        System.out.println("\n=== 读取所有数据 ===");
        System.out.println("数据: " + new String(allData));
        printBuf(buf);
        
        // 释放
        buf.release();
    }
    
    private static void printBuf(ByteBuf buf) {
        System.out.println("readerIndex: " + buf.readerIndex());
        System.out.println("writerIndex: " + buf.writerIndex());
        System.out.println("capacity: " + buf.capacity());
        System.out.println("readableBytes: " + buf.readableBytes());
        System.out.println("writableBytes: " + buf.writableBytes());
    }
}
```

**输出**：
```
=== 初始状态 ===
readerIndex: 0
writerIndex: 0
capacity: 256
readableBytes: 0
writableBytes: 256

=== 写入 'Netty' ===
readerIndex: 0
writerIndex: 5
capacity: 256
readableBytes: 5
writableBytes: 251

=== 读取 3 字节 ===
读取的数据: Net
readerIndex: 3
writerIndex: 5
capacity: 256
readableBytes: 2
writableBytes: 251

=== 写入 ' is awesome!' ===
readerIndex: 3
writerIndex: 17
capacity: 256
readableBytes: 14
writableBytes: 239

=== 读取所有数据 ===
数据: ty is awesome!
readerIndex: 17
writerIndex: 17
capacity: 256
readableBytes: 0
writableBytes: 239
```

---

## 6.4 引用计数与内存管理

### 6.4.1 引用计数机制

**为什么需要引用计数？**
- Netty 使用堆外内存（Direct Buffer）
- 堆外内存不受 GC 管理
- 需要手动释放，否则会内存泄漏

**引用计数原理**：

```
创建 ByteBuf → refCnt = 1
    ↓
retain() → refCnt++
    ↓
release() → refCnt--
    ↓
refCnt == 0 → 释放内存
```

### 6.4.2 引用计数操作

```java
ByteBuf buf = Unpooled.buffer(256);

// 获取引用计数
int refCnt = buf.refCnt();  // 1

// 增加引用计数
buf.retain();
System.out.println(buf.refCnt());  // 2

buf.retain(2);
System.out.println(buf.refCnt());  // 4

// 减少引用计数
buf.release();
System.out.println(buf.refCnt());  // 3

buf.release(2);
System.out.println(buf.refCnt());  // 1

// 最后一次释放
buf.release();  // refCnt = 0，内存被释放

// 此时访问会抛出异常
// buf.readByte();  // IllegalReferenceCountException
```

### 6.4.3 谁负责释放？

**规则**：**谁最后使用，谁负责释放**

**场景1：在 Handler 中**

```java
// 方式1：使用 SimpleChannelInboundHandler（推荐）
public class MyHandler extends SimpleChannelInboundHandler<ByteBuf> {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        // 处理消息
        System.out.println(msg.toString(CharsetUtil.UTF_8));
        
        // 不需要手动释放，框架会自动释放
    }
}

// 方式2：使用 ChannelInboundHandlerAdapter
public class MyHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf buf = (ByteBuf) msg;
        try {
            // 处理消息
            System.out.println(buf.toString(CharsetUtil.UTF_8));
        } finally {
            // 必须手动释放
            ReferenceCountUtil.release(msg);
        }
    }
}

// 方式3：传递给下一个 Handler
public class MyHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 处理消息
        
        // 传递给下一个 Handler，由下一个 Handler 负责释放
        ctx.fireChannelRead(msg);
    }
}
```

**场景2：写入数据**

```java
ByteBuf buf = Unpooled.copiedBuffer("Hello", CharsetUtil.UTF_8);

// write() 或 writeAndFlush() 会自动释放
ctx.writeAndFlush(buf);  // buf 会被自动释放

// 如果需要继续使用，需要 retain()
buf.retain();
ctx.writeAndFlush(buf);
// 使用 buf...
buf.release();
```

### 6.4.4 内存泄漏检测

**启用内存泄漏检测**：

```java
// 方式1：JVM 参数
-Dio.netty.leakDetection.level=ADVANCED

// 方式2：代码设置
ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.ADVANCED);
```

**检测级别**：

| 级别 | 说明 | 性能影响 |
|------|------|---------|
| **DISABLED** | 禁用检测 | 无 |
| **SIMPLE** | 1% 采样率 | 很小 |
| **ADVANCED** | 1% 采样率，详细信息 | 小 |
| **PARANOID** | 100% 采样率 | 大 |

**示例**：

```java
public class LeakDetectionDemo {
    public static void main(String[] args) {
        // 启用高级检测
        ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.PARANOID);
        
        // 创建 ByteBuf 但不释放
        ByteBuf buf = Unpooled.buffer(256);
        buf.writeBytes("Hello".getBytes());
        
        // 忘记释放
        // buf.release();
        
        // 触发 GC
        System.gc();
        
        // 会输出内存泄漏警告
    }
}
```

**输出**：
```
LEAK: ByteBuf.release() was not called before it's garbage-collected.
Recent access records:
#1:
    io.netty.buffer.AdvancedLeakAwareByteBuf.writeBytes(...)
    LeakDetectionDemo.main(LeakDetectionDemo.java:10)
```

### 6.4.5 最佳实践

```java
public class BestPracticeHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        ByteBuf buf = (ByteBuf) msg;
        
        try {
            // 1. 处理消息
            processMessage(buf);
            
            // 2. 如果需要传递给下一个 Handler
            if (needForward) {
                ctx.fireChannelRead(buf.retain());  // 增加引用计数
            }
            
            // 3. 如果需要异步处理
            if (needAsync) {
                asyncProcess(buf.retain());  // 增加引用计数
            }
            
        } finally {
            // 4. 最后释放
            ReferenceCountUtil.release(msg);
        }
    }
    
    private void processMessage(ByteBuf buf) {
        // 处理逻辑
    }
    
    private void asyncProcess(ByteBuf buf) {
        executor.submit(() -> {
            try {
                // 异步处理
                processMessage(buf);
            } finally {
                // 异步任务完成后释放
                buf.release();
            }
        });
    }
}
```

---

## 6.5 ByteBuf 分配器

### 6.5.1 ByteBufAllocator 接口

```java
public interface ByteBufAllocator {
    
    // 分配堆缓冲区
    ByteBuf buffer();
    ByteBuf buffer(int initialCapacity);
    ByteBuf buffer(int initialCapacity, int maxCapacity);
    
    // 分配直接缓冲区
    ByteBuf directBuffer();
    ByteBuf directBuffer(int initialCapacity);
    ByteBuf directBuffer(int initialCapacity, int maxCapacity);
    
    // 分配复合缓冲区
    CompositeByteBuf compositeBuffer();
    CompositeByteBuf compositeDirectBuffer();
    
    // 分配 I/O 缓冲区（根据平台选择堆或直接）
    ByteBuf ioBuffer();
}
```

### 6.5.2 内置分配器

**1. PooledByteBufAllocator（池化分配器）**

```java
// 获取默认池化分配器
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;

// 分配缓冲区
ByteBuf buf = allocator.buffer(256);

// 特点：
// - 使用内存池
// - 减少内存分配开销
// - 减少 GC 压力
// - 性能最好
// - 推荐在生产环境使用

// 使用完后释放
buf.release();
```

**2. UnpooledByteBufAllocator（非池化分配器）**

```java
// 获取非池化分配器
ByteBufAllocator allocator = UnpooledByteBufAllocator.DEFAULT;

// 分配缓冲区
ByteBuf buf = allocator.buffer(256);

// 特点：
// - 每次都分配新内存
// - 使用简单
// - 性能较池化差
// - 适合测试和小数据量

buf.release();
```

### 6.5.3 在 Netty 中使用

**方式1：在 Bootstrap 中配置**

```java
ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
        // 配置分配器
        .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
```

**方式2：在 Handler 中使用**

```java
public class MyHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        // 从 Context 获取分配器
        ByteBufAllocator allocator = ctx.alloc();
        
        // 分配缓冲区
        ByteBuf buf = allocator.buffer(256);
        
        try {
            // 使用缓冲区
            buf.writeBytes("Hello".getBytes());
            ctx.writeAndFlush(buf);
        } finally {
            // 释放
            buf.release();
        }
    }
}
```

### 6.5.4 性能对比

```java
public class AllocatorBenchmark {
    
    public static void main(String[] args) {
        int iterations = 1000000;
        
        // 测试池化分配器
        long pooledTime = testAllocator(PooledByteBufAllocator.DEFAULT, iterations);
        System.out.println("Pooled: " + pooledTime + "ms");
        
        // 测试非池化分配器
        long unpooledTime = testAllocator(UnpooledByteBufAllocator.DEFAULT, iterations);
        System.out.println("Unpooled: " + unpooledTime + "ms");
        
        System.out.println("性能提升: " + (unpooledTime * 100 / pooledTime - 100) + "%");
    }
    
    private static long testAllocator(ByteBufAllocator allocator, int iterations) {
        long start = System.currentTimeMillis();
        
        for (int i = 0; i < iterations; i++) {
            ByteBuf buf = allocator.buffer(256);
            buf.writeInt(i);
            buf.release();
        }
        
        return System.currentTimeMillis() - start;
    }
}
```

**典型输出**：
```
Pooled: 150ms
Unpooled: 450ms
性能提升: 200%
```

---

## 6.6 零拷贝技术

### 6.6.1 slice() - 切片

```java
ByteBuf buf = Unpooled.copiedBuffer("Hello World", CharsetUtil.UTF_8);

// 创建切片（共享内存）
ByteBuf slice1 = buf.slice(0, 5);      // "Hello"
ByteBuf slice2 = buf.slice(6, 5);      // "World"

// 修改切片会影响原 ByteBuf
slice1.setByte(0, 'h');
System.out.println(buf.toString(CharsetUtil.UTF_8));  // "hello World"

// 切片不会增加引用计数
System.out.println(buf.refCnt());      // 1
System.out.println(slice1.refCnt());   // 1

// 释放原 ByteBuf 会使切片失效
buf.release();
// slice1.readByte();  // 抛出异常
```

### 6.6.2 duplicate() - 复制

```java
ByteBuf buf = Unpooled.copiedBuffer("Hello", CharsetUtil.UTF_8);

// 创建副本（共享内存，独立索引）
ByteBuf duplicate = buf.duplicate();

// 修改副本的索引不影响原 ByteBuf
duplicate.readerIndex(2);
System.out.println(buf.readerIndex());       // 0
System.out.println(duplicate.readerIndex()); // 2

// 修改内容会互相影响
duplicate.setByte(0, 'h');
System.out.println(buf.toString(CharsetUtil.UTF_8));  // "hello"
```

### 6.6.3 CompositeByteBuf - 组合

```java
// 创建复合缓冲区
CompositeByteBuf composite = Unpooled.compositeBuffer();

// 添加组件
ByteBuf header = Unpooled.copiedBuffer("Header", CharsetUtil.UTF_8);
ByteBuf body = Unpooled.copiedBuffer("Body", CharsetUtil.UTF_8);

composite.addComponents(true, header, body);

// 读取数据（无需拷贝）
System.out.println(composite.toString(CharsetUtil.UTF_8));  // "HeaderBody"

// 遍历组件
for (ByteBuf buf : composite) {
    System.out.println(buf.toString(CharsetUtil.UTF_8));
}
```

### 6.6.4 FileRegion - 文件传输

```java
public class FileTransferHandler extends ChannelInboundHandlerAdapter {
    
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 使用 FileRegion 实现零拷贝文件传输
        File file = new File("large_file.dat");
        FileChannel fileChannel = new RandomAccessFile(file, "r").getChannel();
        
        // 创建 FileRegion
        FileRegion region = new DefaultFileRegion(fileChannel, 0, file.length());
        
        // 发送文件（零拷贝）
        ctx.writeAndFlush(region).addListener((ChannelFutureListener) future -> {
            if (future.isSuccess()) {
                System.out.println("文件传输成功");
            }
            fileChannel.close();
        });
    }
}
```

---

## 6.7 实战示例

### 6.7.1 自定义协议编解码

```java
/**
 * 自定义协议格式：
 * +--------+--------+----------+
 * | Length | Type   | Content  |
 * | 4 byte | 1 byte | N bytes  |
 * +--------+--------+----------+
 */
public class CustomProtocolEncoder extends MessageToByteEncoder<CustomMessage> {
    
    @Override
    protected void encode(ChannelHandlerContext ctx, CustomMessage msg, ByteBuf out) {
        byte[] content = msg.getContent().getBytes(CharsetUtil.UTF_8);
        
        // 写入长度
        out.writeInt(content.length);
        
        // 写入类型
        out.writeByte(msg.getType());
        
        // 写入内容
        out.writeBytes(content);
    }
}

public class CustomProtocolDecoder extends ByteToMessageDecoder {
    
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) {
        // 至少需要 5 字节（4 字节长度 + 1 字节类型）
        if (in.readableBytes() < 5) {
            return;
        }
        
        // 标记当前位置
        in.markReaderIndex();
        
        // 读取长度
        int length = in.readInt();
        
        // 检查是否有足够的数据
        if (in.readableBytes() < length + 1) {
            in.resetReaderIndex();
            return;
        }
        
        // 读取类型
        byte type = in.readByte();
        
        // 读取内容
        byte[] content = new byte[length];
        in.readBytes(content);
        
        // 创建消息对象
        CustomMessage msg = new CustomMessage();
        msg.setType(type);
        msg.setContent(new String(content, CharsetUtil.UTF_8));
        
        out.add(msg);
    }
}
```

---

## 6.8 本章小结

本章我们深入学习了 ByteBuf：

✅ **ByteBuf 的优势**：双指针、动态扩容、零拷贝、引用计数  
✅ **ByteBuf 的分类**：堆缓冲、直接缓冲、复合缓冲、池化、非池化  
✅ **读写操作**：read/write 方法、get/set 方法、索引管理  
✅ **引用计数**：retain()、release()、内存泄漏检测  
✅ **ByteBuf 分配器**：PooledByteBufAllocator、UnpooledByteBufAllocator  
✅ **零拷贝**：slice()、duplicate()、CompositeByteBuf、FileRegion  

### 关键要点

1. **ByteBuf** 比 ByteBuffer 更强大、更易用
2. **引用计数**机制需要手动管理，谁最后使用谁释放
3. **池化分配器**性能更好，推荐在生产环境使用
4. **零拷贝**技术可以显著提升性能
5. 使用 **SimpleChannelInboundHandler** 可以自动释放 ByteBuf

### ByteBuf 最佳实践

1. ✅ 生产环境使用 `PooledByteBufAllocator`
2. ✅ 使用 `SimpleChannelInboundHandler` 自动释放
3. ✅ 启用内存泄漏检测（开发环境）
4. ✅ 优先使用直接缓冲区进行网络 I/O
5. ✅ 使用零拷贝技术避免不必要的内存拷贝

### 下一章预告

下一章我们将学习 **编解码器（Codec）**，包括：
- 为什么需要编解码器
- 内置编解码器
- 自定义编解码器
- MessageToByteEncoder 和 ByteToMessageDecoder

---

## 练习题

1. **基础题**：编写程序，演示 ByteBuf 的读写操作
2. **进阶题**：实现一个自定义协议的编解码器
3. **挑战题**：使用 CompositeByteBuf 实现 HTTP 响应的零拷贝组装

---

**上一章**：[第5章：ChannelHandler详解](/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html)  
**下一章**：[第7章：编解码器](/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html)
