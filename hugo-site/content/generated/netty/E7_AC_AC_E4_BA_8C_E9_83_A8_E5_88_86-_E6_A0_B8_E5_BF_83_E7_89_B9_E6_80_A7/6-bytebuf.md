---
title: 第6章：ByteBuf 缓冲区 - Netty教程
description: 第6章：ByteBuf 缓冲区 本章导读 ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的
  ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。 6.1
  ByteBuf 的优势 6.1.1 ByteBuffer vs ByteBuf Java NI...
url: /netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html
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
    <div class="title"><h2><i class="icon-list"></i>&nbsp;第6章：ByteBuf 缓冲区</h2></div>
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
      <a class="current" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html">第6章：ByteBuf 缓冲区</a>
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
            <h2><a rel="bookmark" href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html">第6章：ByteBuf 缓冲区</a></h2>
            <div class="meta"><span>Netty教程 / 第二部分-_核心特性</span></div>
          </header>
          <div class="vditor-reset post__content"><h1>第6章：ByteBuf 缓冲区</h1>
<h2>本章导读</h2>
<p>ByteBuf 是 Netty 的核心数据容器，相比 Java NIO 的 ByteBuffer，它提供了更强大的功能和更友好的 API。本章将深入讲解 ByteBuf 的优势、分类、读写操作、引用计数和内存管理。</p>
<hr>
<h2>6.1 ByteBuf 的优势</h2>
<h3>6.1.1 ByteBuffer vs ByteBuf</h3>
<p><strong>Java NIO ByteBuffer 的问题</strong>：</p>
<table>
<thead>
<tr>
<th>问题</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>单一位置指针</strong></td>
<td>position 既用于读又用于写，需要手动 flip()</td>
</tr>
<tr>
<td><strong>容量固定</strong></td>
<td>创建后容量不可变，无法动态扩容</td>
</tr>
<tr>
<td><strong>API 不友好</strong></td>
<td>方法命名不直观，容易出错</td>
</tr>
<tr>
<td><strong>无引用计数</strong></td>
<td>容易造成内存泄漏</td>
</tr>
</tbody>
</table>
<p><strong>Netty ByteBuf 的优势</strong>：</p>
<table>
<thead>
<tr>
<th>优势</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>双指针</strong></td>
<td>readerIndex 和 writerIndex 分离，无需 flip()</td>
</tr>
<tr>
<td><strong>动态扩容</strong></td>
<td>可以自动扩容，更灵活</td>
</tr>
<tr>
<td><strong>链式调用</strong></td>
<td>支持方法链式调用，代码更简洁</td>
</tr>
<tr>
<td><strong>引用计数</strong></td>
<td>自动内存管理，避免内存泄漏</td>
</tr>
<tr>
<td><strong>零拷贝</strong></td>
<td>支持 slice、duplicate、composite 等零拷贝操作</td>
</tr>
<tr>
<td><strong>池化</strong></td>
<td>支持内存池，减少 GC 压力</td>
</tr>
</tbody>
</table>
<h3>6.1.2 ByteBuf 的结构</h3>
<pre><code>+-------------------+------------------+------------------+
| discardable bytes |  readable bytes  |  writable bytes  |
|                   |     (CONTENT)    |                  |
+-------------------+------------------+------------------+
|                   |                  |                  |
0      &lt;=      readerIndex   &lt;=   writerIndex    &lt;=    capacity
</code></pre>
<p><strong>三个区域</strong>：</p>
<ol>
<li><strong>已读区域</strong>（0 ~ readerIndex）：可以丢弃</li>
<li><strong>可读区域</strong>（readerIndex ~ writerIndex）：实际数据</li>
<li><strong>可写区域</strong>（writerIndex ~ capacity）：可以写入</li>
</ol>
<p><strong>关键索引</strong>：</p>
<ul>
<li><strong>readerIndex</strong>：读指针，下一个读取的位置</li>
<li><strong>writerIndex</strong>：写指针，下一个写入的位置</li>
<li><strong>capacity</strong>：容量，最大可写位置</li>
</ul>
<h3>6.1.3 对比示例</h3>
<p><strong>ByteBuffer（需要 flip）</strong>：</p>
<pre><code class="language-java">ByteBuffer buffer = ByteBuffer.allocate(1024);
<p>// 写入数据
buffer.put(&quot;Hello&quot;.getBytes());</p>
<p>// 切换到读模式（必须）
buffer.flip();</p>
<p>// 读取数据
while (buffer.hasRemaining()) {
byte b = buffer.get();
}</p>
<p>// 清空（准备下次写入）
buffer.clear();
</code></pre></p>
<p><strong>ByteBuf（无需 flip）</strong>：</p>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(1024);
<p>// 写入数据
buf.writeBytes(&quot;Hello&quot;.getBytes());</p>
<p>// 直接读取（无需 flip）
while (buf.isReadable()) {
byte b = buf.readByte();
}</p>
<p>// 清空
buf.clear();
</code></pre></p>
<hr>
<h2>6.2 ByteBuf 的分类</h2>
<h3>6.2.1 按内存分配方式分类</h3>
<p><strong>1. 堆缓冲区（Heap Buffer）</strong></p>
<pre><code class="language-java">// 创建堆缓冲区
ByteBuf heapBuf = Unpooled.buffer(256);
<p>// 特点：
// - 数据存储在 JVM 堆内存
// - 可以快速分配和释放
// - 受 GC 管理
// - 适合小数据量</p>
<p>// 判断是否是堆缓冲区
if (heapBuf.hasArray()) {
byte[] array = heapBuf.array();
int offset = heapBuf.arrayOffset() + heapBuf.readerIndex();
int length = heapBuf.readableBytes();
// 处理数组...
}
</code></pre></p>
<p><strong>2. 直接缓冲区（Direct Buffer）</strong></p>
<pre><code class="language-java">// 创建直接缓冲区
ByteBuf directBuf = Unpooled.directBuffer(256);
<p>// 特点：
// - 数据存储在堆外内存（操作系统内存）
// - 分配和释放较慢
// - 不受 GC 影响
// - 适合大数据量和网络 I/O
// - 支持零拷贝</p>
<p>// 判断是否是直接缓冲区
if (directBuf.isDirect()) {
// 直接缓冲区没有 backing array
// 需要使用 getBytes() 或 readBytes()
byte[] data = new byte[directBuf.readableBytes()];
directBuf.getBytes(directBuf.readerIndex(), data);
}
</code></pre></p>
<p><strong>3. 复合缓冲区（Composite Buffer）</strong></p>
<pre><code class="language-java">// 创建复合缓冲区
CompositeByteBuf compositeBuf = Unpooled.compositeBuffer();
<p>// 添加多个 ByteBuf
ByteBuf headerBuf = Unpooled.buffer(12);
ByteBuf bodyBuf = Unpooled.buffer(256);</p>
<p>compositeBuf.addComponents(headerBuf, bodyBuf);</p>
<p>// 特点：
// - 聚合多个 ByteBuf
// - 避免内存拷贝
// - 实现零拷贝
// - 适合组合多个数据块</p>
<p>// 遍历所有组件
for (ByteBuf buf : compositeBuf) {
System.out.println(buf.toString(CharsetUtil.UTF_8));
}
</code></pre></p>
<h3>6.2.2 按内存管理方式分类</h3>
<p><strong>1. 池化（Pooled）</strong></p>
<pre><code class="language-java">// 使用池化分配器
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
ByteBuf pooledBuf = allocator.buffer(256);
<p>// 特点：
// - 从内存池分配
// - 减少内存分配开销
// - 减少 GC 压力
// - 性能更好
// - 需要手动释放</p>
<p>// 使用完后释放
pooledBuf.release();
</code></pre></p>
<p><strong>2. 非池化（Unpooled）</strong></p>
<pre><code class="language-java">// 使用非池化分配器
ByteBuf unpooledBuf = Unpooled.buffer(256);
<p>// 特点：
// - 每次都分配新内存
// - 使用简单
// - 性能较池化差
// - 适合小数据量</p>
<p>// 使用完后释放
unpooledBuf.release();
</code></pre></p>
<h3>6.2.3 分类对比</h3>
<table>
<thead>
<tr>
<th>类型</th>
<th>内存位置</th>
<th>性能</th>
<th>GC影响</th>
<th>适用场景</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Heap Buffer</strong></td>
<td>JVM堆</td>
<td>中</td>
<td>有</td>
<td>小数据量</td>
</tr>
<tr>
<td><strong>Direct Buffer</strong></td>
<td>堆外</td>
<td>高</td>
<td>无</td>
<td>大数据量、网络I/O</td>
</tr>
<tr>
<td><strong>Composite Buffer</strong></td>
<td>混合</td>
<td>高</td>
<td>取决于组件</td>
<td>组合多个数据块</td>
</tr>
<tr>
<td><strong>Pooled</strong></td>
<td>内存池</td>
<td>高</td>
<td>小</td>
<td>高频分配场景</td>
</tr>
<tr>
<td><strong>Unpooled</strong></td>
<td>新分配</td>
<td>中</td>
<td>大</td>
<td>低频分配场景</td>
</tr>
</tbody>
</table>
<hr>
<h2>6.3 读写操作与索引管理</h2>
<h3>6.3.1 创建 ByteBuf</h3>
<pre><code class="language-java">// 1. 使用 Unpooled 工具类
ByteBuf buf1 = Unpooled.buffer(256);              // 堆缓冲区
ByteBuf buf2 = Unpooled.directBuffer(256);        // 直接缓冲区
ByteBuf buf3 = Unpooled.copiedBuffer(&quot;Hello&quot;, CharsetUtil.UTF_8);  // 复制数据
<p>// 2. 使用 ByteBufAllocator
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
ByteBuf buf4 = allocator.buffer(256);             // 池化缓冲区
ByteBuf buf5 = allocator.directBuffer(256);       // 池化直接缓冲区</p>
<p>// 3. 在 ChannelHandlerContext 中
ctx.alloc().buffer(256);
</code></pre></p>
<h3>6.3.2 写入操作</h3>
<p><strong>基本类型写入</strong>：</p>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
<p>// 写入基本类型
buf.writeBoolean(true);           // 1 字节
buf.writeByte(127);               // 1 字节
buf.writeShort(32767);            // 2 字节
buf.writeInt(2147483647);         // 4 字节
buf.writeLong(9223372036854775807L);  // 8 字节
buf.writeFloat(3.14f);            // 4 字节
buf.writeDouble(3.14159);         // 8 字节
buf.writeChar('A');               // 2 字节</p>
<p>// 写入字节数组
buf.writeBytes(&quot;Hello&quot;.getBytes());</p>
<p>// 写入另一个 ByteBuf
ByteBuf source = Unpooled.copiedBuffer(&quot;World&quot;, CharsetUtil.UTF_8);
buf.writeBytes(source);</p>
<p>// writerIndex 会自动增加
System.out.println(&quot;writerIndex: &quot; + buf.writerIndex());
</code></pre></p>
<p><strong>set 方法（不移动索引）</strong>：</p>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
<p>// set 方法不会移动 writerIndex
buf.setInt(0, 100);
buf.setLong(4, 200L);</p>
<p>// writerIndex 不变
System.out.println(&quot;writerIndex: &quot; + buf.writerIndex());  // 0</p>
<p>// 需要手动设置 writerIndex
buf.writerIndex(12);
</code></pre></p>
<h3>6.3.3 读取操作</h3>
<p><strong>基本类型读取</strong>：</p>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
buf.writeInt(100);
buf.writeLong(200L);
buf.writeBytes(&quot;Hello&quot;.getBytes());
<p>// 读取基本类型
int i = buf.readInt();            // 4 字节
long l = buf.readLong();          // 8 字节</p>
<p>// 读取字节数组
byte[] bytes = new byte[5];
buf.readBytes(bytes);</p>
<p>// readerIndex 会自动增加
System.out.println(&quot;readerIndex: &quot; + buf.readerIndex());
</code></pre></p>
<p><strong>get 方法（不移动索引）</strong>：</p>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
buf.writeInt(100);
buf.writeLong(200L);
<p>// get 方法不会移动 readerIndex
int i = buf.getInt(0);
long l = buf.getLong(4);</p>
<p>// readerIndex 不变
System.out.println(&quot;readerIndex: &quot; + buf.readerIndex());  // 0
</code></pre></p>
<h3>6.3.4 索引管理</h3>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
buf.writeBytes(&quot;Hello World&quot;.getBytes());
<p>// 获取索引
int readerIndex = buf.readerIndex();      // 0
int writerIndex = buf.writerIndex();      // 11
int capacity = buf.capacity();            // 256</p>
<p>// 可读字节数
int readable = buf.readableBytes();       // 11</p>
<p>// 可写字节数
int writable = buf.writableBytes();       // 245</p>
<p>// 设置索引
buf.readerIndex(0);
buf.writerIndex(5);</p>
<p>// 标记和重置
buf.markReaderIndex();
buf.readInt();
buf.resetReaderIndex();  // 回到标记位置</p>
<p>// 清空（重置索引）
buf.clear();  // readerIndex = writerIndex = 0</p>
<p>// 丢弃已读字节
buf.discardReadBytes();  // 将未读数据移到开头
</code></pre></p>
<h3>6.3.5 完整示例</h3>
<pre><code class="language-java">public class ByteBufDemo {
    public static void main(String[] args) {
        // 创建 ByteBuf
        ByteBuf buf = Unpooled.buffer(256);
<pre><code>    System.out.println(&amp;quot;=== 初始状态 ===&amp;quot;);
    printBuf(buf);
<pre><code>// 写入数据
buf.writeBytes(&amp;amp;quot;Netty&amp;amp;quot;.getBytes());
System.out.println(&amp;amp;quot;\n=== 写入 'Netty' ===&amp;amp;quot;);
printBuf(buf);
<p>// 读取数据
byte[] data = new byte[3];
buf.readBytes(data);
System.out.println(&amp;amp;quot;\n=== 读取 3 字节 ===&amp;amp;quot;);
System.out.println(&amp;amp;quot;读取的数据: &amp;amp;quot; + new String(data));
printBuf(buf);</p>
<p>// 继续写入
buf.writeBytes(&amp;amp;quot; is awesome!&amp;amp;quot;.getBytes());
System.out.println(&amp;amp;quot;\n=== 写入 ' is awesome!' ===&amp;amp;quot;);
printBuf(buf);</p>
<p>// 读取所有数据
byte[] allData = new byte[buf.readableBytes()];
buf.readBytes(allData);
System.out.println(&amp;amp;quot;\n=== 读取所有数据 ===&amp;amp;quot;);
System.out.println(&amp;amp;quot;数据: &amp;amp;quot; + new String(allData));
printBuf(buf);</p>
<p>// 释放
buf.release();
</code></pre></p>
<p>}</p>
<p>private static void printBuf(ByteBuf buf) {
System.out.println(&amp;quot;readerIndex: &amp;quot; + buf.readerIndex());
System.out.println(&amp;quot;writerIndex: &amp;quot; + buf.writerIndex());
System.out.println(&amp;quot;capacity: &amp;quot; + buf.capacity());
System.out.println(&amp;quot;readableBytes: &amp;quot; + buf.readableBytes());
System.out.println(&amp;quot;writableBytes: &amp;quot; + buf.writableBytes());
}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>输出</strong>：</p>
<pre><code>=== 初始状态 ===
readerIndex: 0
writerIndex: 0
capacity: 256
readableBytes: 0
writableBytes: 256
<p>=== 写入 'Netty' ===
readerIndex: 0
writerIndex: 5
capacity: 256
readableBytes: 5
writableBytes: 251</p>
<p>=== 读取 3 字节 ===
读取的数据: Net
readerIndex: 3
writerIndex: 5
capacity: 256
readableBytes: 2
writableBytes: 251</p>
<p>=== 写入 ' is awesome!' ===
readerIndex: 3
writerIndex: 17
capacity: 256
readableBytes: 14
writableBytes: 239</p>
<p>=== 读取所有数据 ===
数据: ty is awesome!
readerIndex: 17
writerIndex: 17
capacity: 256
readableBytes: 0
writableBytes: 239
</code></pre></p>
<hr>
<h2>6.4 引用计数与内存管理</h2>
<h3>6.4.1 引用计数机制</h3>
<p><strong>为什么需要引用计数？</strong></p>
<ul>
<li>Netty 使用堆外内存（Direct Buffer）</li>
<li>堆外内存不受 GC 管理</li>
<li>需要手动释放，否则会内存泄漏</li>
</ul>
<p><strong>引用计数原理</strong>：</p>
<pre><code>创建 ByteBuf → refCnt = 1
    ↓
retain() → refCnt++
    ↓
release() → refCnt--
    ↓
refCnt == 0 → 释放内存
</code></pre>
<h3>6.4.2 引用计数操作</h3>
<pre><code class="language-java">ByteBuf buf = Unpooled.buffer(256);
<p>// 获取引用计数
int refCnt = buf.refCnt();  // 1</p>
<p>// 增加引用计数
buf.retain();
System.out.println(buf.refCnt());  // 2</p>
<p>buf.retain(2);
System.out.println(buf.refCnt());  // 4</p>
<p>// 减少引用计数
buf.release();
System.out.println(buf.refCnt());  // 3</p>
<p>buf.release(2);
System.out.println(buf.refCnt());  // 1</p>
<p>// 最后一次释放
buf.release();  // refCnt = 0，内存被释放</p>
<p>// 此时访问会抛出异常
// buf.readByte();  // IllegalReferenceCountException
</code></pre></p>
<h3>6.4.3 谁负责释放？</h3>
<p><strong>规则</strong>：<strong>谁最后使用，谁负责释放</strong></p>
<p><strong>场景1：在 Handler 中</strong></p>
<pre><code class="language-java">// 方式1：使用 SimpleChannelInboundHandler（推荐）
public class MyHandler extends SimpleChannelInboundHandler&lt;ByteBuf&gt; {
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
        // 处理消息
        System.out.println(msg.toString(CharsetUtil.UTF_8));
<pre><code>    // 不需要手动释放，框架会自动释放
}
</code></pre>
<p>}</p>
<p>// 方式2：使用 ChannelInboundHandlerAdapter
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
}</p>
<p>// 方式3：传递给下一个 Handler
public class MyHandler extends ChannelInboundHandlerAdapter {
@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
// 处理消息</p>
<pre><code>    // 传递给下一个 Handler，由下一个 Handler 负责释放
    ctx.fireChannelRead(msg);
}
</code></pre>
<p>}
</code></pre></p>
<p><strong>场景2：写入数据</strong></p>
<pre><code class="language-java">ByteBuf buf = Unpooled.copiedBuffer(&quot;Hello&quot;, CharsetUtil.UTF_8);
<p>// write() 或 writeAndFlush() 会自动释放
ctx.writeAndFlush(buf);  // buf 会被自动释放</p>
<p>// 如果需要继续使用，需要 retain()
buf.retain();
ctx.writeAndFlush(buf);
// 使用 buf...
buf.release();
</code></pre></p>
<h3>6.4.4 内存泄漏检测</h3>
<p><strong>启用内存泄漏检测</strong>：</p>
<pre><code class="language-java">// 方式1：JVM 参数
-Dio.netty.leakDetection.level=ADVANCED
<p>// 方式2：代码设置
ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.ADVANCED);
</code></pre></p>
<p><strong>检测级别</strong>：</p>
<table>
<thead>
<tr>
<th>级别</th>
<th>说明</th>
<th>性能影响</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>DISABLED</strong></td>
<td>禁用检测</td>
<td>无</td>
</tr>
<tr>
<td><strong>SIMPLE</strong></td>
<td>1% 采样率</td>
<td>很小</td>
</tr>
<tr>
<td><strong>ADVANCED</strong></td>
<td>1% 采样率，详细信息</td>
<td>小</td>
</tr>
<tr>
<td><strong>PARANOID</strong></td>
<td>100% 采样率</td>
<td>大</td>
</tr>
</tbody>
</table>
<p><strong>示例</strong>：</p>
<pre><code class="language-java">public class LeakDetectionDemo {
    public static void main(String[] args) {
        // 启用高级检测
        ResourceLeakDetector.setLevel(ResourceLeakDetector.Level.PARANOID);
<pre><code>    // 创建 ByteBuf 但不释放
    ByteBuf buf = Unpooled.buffer(256);
    buf.writeBytes(&amp;quot;Hello&amp;quot;.getBytes());
<pre><code>// 忘记释放
// buf.release();
<p>// 触发 GC
System.gc();</p>
<p>// 会输出内存泄漏警告
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>输出</strong>：</p>
<pre><code>LEAK: ByteBuf.release() was not called before it's garbage-collected.
Recent access records:
#1:
    io.netty.buffer.AdvancedLeakAwareByteBuf.writeBytes(...)
    LeakDetectionDemo.main(LeakDetectionDemo.java:10)
</code></pre>
<h3>6.4.5 最佳实践</h3>
<pre><code class="language-java">public class BestPracticeHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    ByteBuf buf = (ByteBuf) msg;
<pre><code>try {
    // 1. 处理消息
    processMessage(buf);
<pre><code>// 2. 如果需要传递给下一个 Handler
if (needForward) {
    ctx.fireChannelRead(buf.retain());  // 增加引用计数
}

// 3. 如果需要异步处理
if (needAsync) {
    asyncProcess(buf.retain());  // 增加引用计数
}
</code></pre>
<p>} finally {
// 4. 最后释放
ReferenceCountUtil.release(msg);
}
</code></pre></p>
<p>}</p>
<p>private void processMessage(ByteBuf buf) {
// 处理逻辑
}</p>
<p>private void asyncProcess(ByteBuf buf) {
executor.submit(() -&amp;gt; {
try {
// 异步处理
processMessage(buf);
} finally {
// 异步任务完成后释放
buf.release();
}
});
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>6.5 ByteBuf 分配器</h2>
<h3>6.5.1 ByteBufAllocator 接口</h3>
<pre><code class="language-java">public interface ByteBufAllocator {
<pre><code>// 分配堆缓冲区
ByteBuf buffer();
ByteBuf buffer(int initialCapacity);
ByteBuf buffer(int initialCapacity, int maxCapacity);
<p>// 分配直接缓冲区
ByteBuf directBuffer();
ByteBuf directBuffer(int initialCapacity);
ByteBuf directBuffer(int initialCapacity, int maxCapacity);</p>
<p>// 分配复合缓冲区
CompositeByteBuf compositeBuffer();
CompositeByteBuf compositeDirectBuffer();</p>
<p>// 分配 I/O 缓冲区（根据平台选择堆或直接）
ByteBuf ioBuffer();
</code></pre></p>
<p>}
</code></pre></p>
<h3>6.5.2 内置分配器</h3>
<p><strong>1. PooledByteBufAllocator（池化分配器）</strong></p>
<pre><code class="language-java">// 获取默认池化分配器
ByteBufAllocator allocator = PooledByteBufAllocator.DEFAULT;
<p>// 分配缓冲区
ByteBuf buf = allocator.buffer(256);</p>
<p>// 特点：
// - 使用内存池
// - 减少内存分配开销
// - 减少 GC 压力
// - 性能最好
// - 推荐在生产环境使用</p>
<p>// 使用完后释放
buf.release();
</code></pre></p>
<p><strong>2. UnpooledByteBufAllocator（非池化分配器）</strong></p>
<pre><code class="language-java">// 获取非池化分配器
ByteBufAllocator allocator = UnpooledByteBufAllocator.DEFAULT;
<p>// 分配缓冲区
ByteBuf buf = allocator.buffer(256);</p>
<p>// 特点：
// - 每次都分配新内存
// - 使用简单
// - 性能较池化差
// - 适合测试和小数据量</p>
<p>buf.release();
</code></pre></p>
<h3>6.5.3 在 Netty 中使用</h3>
<p><strong>方式1：在 Bootstrap 中配置</strong></p>
<pre><code class="language-java">ServerBootstrap bootstrap = new ServerBootstrap();
bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
        // 配置分配器
        .option(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT)
        .childOption(ChannelOption.ALLOCATOR, PooledByteBufAllocator.DEFAULT);
</code></pre>
<p><strong>方式2：在 Handler 中使用</strong></p>
<pre><code class="language-java">public class MyHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // 从 Context 获取分配器
    ByteBufAllocator allocator = ctx.alloc();
<pre><code>// 分配缓冲区
ByteBuf buf = allocator.buffer(256);
<p>try {
// 使用缓冲区
buf.writeBytes(&amp;amp;quot;Hello&amp;amp;quot;.getBytes());
ctx.writeAndFlush(buf);
} finally {
// 释放
buf.release();
}
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>6.5.4 性能对比</h3>
<pre><code class="language-java">public class AllocatorBenchmark {
<pre><code>public static void main(String[] args) {
    int iterations = 1000000;
<pre><code>// 测试池化分配器
long pooledTime = testAllocator(PooledByteBufAllocator.DEFAULT, iterations);
System.out.println(&amp;amp;quot;Pooled: &amp;amp;quot; + pooledTime + &amp;amp;quot;ms&amp;amp;quot;);
<p>// 测试非池化分配器
long unpooledTime = testAllocator(UnpooledByteBufAllocator.DEFAULT, iterations);
System.out.println(&amp;amp;quot;Unpooled: &amp;amp;quot; + unpooledTime + &amp;amp;quot;ms&amp;amp;quot;);</p>
<p>System.out.println(&amp;amp;quot;性能提升: &amp;amp;quot; + (unpooledTime * 100 / pooledTime - 100) + &amp;amp;quot;%&amp;amp;quot;);
</code></pre></p>
<p>}</p>
<p>private static long testAllocator(ByteBufAllocator allocator, int iterations) {
long start = System.currentTimeMillis();</p>
<pre><code>for (int i = 0; i &amp;amp;lt; iterations; i++) {
    ByteBuf buf = allocator.buffer(256);
    buf.writeInt(i);
    buf.release();
}
<p>return System.currentTimeMillis() - start;
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>典型输出</strong>：</p>
<pre><code>Pooled: 150ms
Unpooled: 450ms
性能提升: 200%
</code></pre>
<hr>
<h2>6.6 零拷贝技术</h2>
<h3>6.6.1 slice() - 切片</h3>
<pre><code class="language-java">ByteBuf buf = Unpooled.copiedBuffer(&quot;Hello World&quot;, CharsetUtil.UTF_8);
<p>// 创建切片（共享内存）
ByteBuf slice1 = buf.slice(0, 5);      // &quot;Hello&quot;
ByteBuf slice2 = buf.slice(6, 5);      // &quot;World&quot;</p>
<p>// 修改切片会影响原 ByteBuf
slice1.setByte(0, 'h');
System.out.println(buf.toString(CharsetUtil.UTF_8));  // &quot;hello World&quot;</p>
<p>// 切片不会增加引用计数
System.out.println(buf.refCnt());      // 1
System.out.println(slice1.refCnt());   // 1</p>
<p>// 释放原 ByteBuf 会使切片失效
buf.release();
// slice1.readByte();  // 抛出异常
</code></pre></p>
<h3>6.6.2 duplicate() - 复制</h3>
<pre><code class="language-java">ByteBuf buf = Unpooled.copiedBuffer(&quot;Hello&quot;, CharsetUtil.UTF_8);
<p>// 创建副本（共享内存，独立索引）
ByteBuf duplicate = buf.duplicate();</p>
<p>// 修改副本的索引不影响原 ByteBuf
duplicate.readerIndex(2);
System.out.println(buf.readerIndex());       // 0
System.out.println(duplicate.readerIndex()); // 2</p>
<p>// 修改内容会互相影响
duplicate.setByte(0, 'h');
System.out.println(buf.toString(CharsetUtil.UTF_8));  // &quot;hello&quot;
</code></pre></p>
<h3>6.6.3 CompositeByteBuf - 组合</h3>
<pre><code class="language-java">// 创建复合缓冲区
CompositeByteBuf composite = Unpooled.compositeBuffer();
<p>// 添加组件
ByteBuf header = Unpooled.copiedBuffer(&quot;Header&quot;, CharsetUtil.UTF_8);
ByteBuf body = Unpooled.copiedBuffer(&quot;Body&quot;, CharsetUtil.UTF_8);</p>
<p>composite.addComponents(true, header, body);</p>
<p>// 读取数据（无需拷贝）
System.out.println(composite.toString(CharsetUtil.UTF_8));  // &quot;HeaderBody&quot;</p>
<p>// 遍历组件
for (ByteBuf buf : composite) {
System.out.println(buf.toString(CharsetUtil.UTF_8));
}
</code></pre></p>
<h3>6.6.4 FileRegion - 文件传输</h3>
<pre><code class="language-java">public class FileTransferHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    // 使用 FileRegion 实现零拷贝文件传输
    File file = new File(&amp;quot;large_file.dat&amp;quot;);
    FileChannel fileChannel = new RandomAccessFile(file, &amp;quot;r&amp;quot;).getChannel();
<pre><code>// 创建 FileRegion
FileRegion region = new DefaultFileRegion(fileChannel, 0, file.length());
<p>// 发送文件（零拷贝）
ctx.writeAndFlush(region).addListener((ChannelFutureListener) future -&amp;amp;gt; {
if (future.isSuccess()) {
System.out.println(&amp;amp;quot;文件传输成功&amp;amp;quot;);
}
fileChannel.close();
});
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>6.7 实战示例</h2>
<h3>6.7.1 自定义协议编解码</h3>
<pre><code class="language-java">/**
 * 自定义协议格式：
 * +--------+--------+----------+
 * | Length | Type   | Content  |
 * | 4 byte | 1 byte | N bytes  |
 * +--------+--------+----------+
 */
public class CustomProtocolEncoder extends MessageToByteEncoder&lt;CustomMessage&gt; {
<pre><code>@Override
protected void encode(ChannelHandlerContext ctx, CustomMessage msg, ByteBuf out) {
    byte[] content = msg.getContent().getBytes(CharsetUtil.UTF_8);
<pre><code>// 写入长度
out.writeInt(content.length);
<p>// 写入类型
out.writeByte(msg.getType());</p>
<p>// 写入内容
out.writeBytes(content);
</code></pre></p>
<p>}
</code></pre></p>
<p>}</p>
<p>public class CustomProtocolDecoder extends ByteToMessageDecoder {</p>
<pre><code>@Override
protected void decode(ChannelHandlerContext ctx, ByteBuf in, List&amp;lt;Object&amp;gt; out) {
    // 至少需要 5 字节（4 字节长度 + 1 字节类型）
    if (in.readableBytes() &amp;lt; 5) {
        return;
    }
<pre><code>// 标记当前位置
in.markReaderIndex();
<p>// 读取长度
int length = in.readInt();</p>
<p>// 检查是否有足够的数据
if (in.readableBytes() &amp;amp;lt; length + 1) {
in.resetReaderIndex();
return;
}</p>
<p>// 读取类型
byte type = in.readByte();</p>
<p>// 读取内容
byte[] content = new byte[length];
in.readBytes(content);</p>
<p>// 创建消息对象
CustomMessage msg = new CustomMessage();
msg.setType(type);
msg.setContent(new String(content, CharsetUtil.UTF_8));</p>
<p>out.add(msg);
</code></pre></p>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>6.8 本章小结</h2>
<p>本章我们深入学习了 ByteBuf：</p>
<p>✅ <strong>ByteBuf 的优势</strong>：双指针、动态扩容、零拷贝、引用计数<br>
✅ <strong>ByteBuf 的分类</strong>：堆缓冲、直接缓冲、复合缓冲、池化、非池化<br>
✅ <strong>读写操作</strong>：read/write 方法、get/set 方法、索引管理<br>
✅ <strong>引用计数</strong>：retain()、release()、内存泄漏检测<br>
✅ <strong>ByteBuf 分配器</strong>：PooledByteBufAllocator、UnpooledByteBufAllocator<br>
✅ <strong>零拷贝</strong>：slice()、duplicate()、CompositeByteBuf、FileRegion</p>
<h3>关键要点</h3>
<ol>
<li><strong>ByteBuf</strong> 比 ByteBuffer 更强大、更易用</li>
<li><strong>引用计数</strong>机制需要手动管理，谁最后使用谁释放</li>
<li><strong>池化分配器</strong>性能更好，推荐在生产环境使用</li>
<li><strong>零拷贝</strong>技术可以显著提升性能</li>
<li>使用 <strong>SimpleChannelInboundHandler</strong> 可以自动释放 ByteBuf</li>
</ol>
<h3>ByteBuf 最佳实践</h3>
<ol>
<li>✅ 生产环境使用 <code>PooledByteBufAllocator</code></li>
<li>✅ 使用 <code>SimpleChannelInboundHandler</code> 自动释放</li>
<li>✅ 启用内存泄漏检测（开发环境）</li>
<li>✅ 优先使用直接缓冲区进行网络 I/O</li>
<li>✅ 使用零拷贝技术避免不必要的内存拷贝</li>
</ol>
<h3>下一章预告</h3>
<p>下一章我们将学习 <strong>编解码器（Codec）</strong>，包括：</p>
<ul>
<li>为什么需要编解码器</li>
<li>内置编解码器</li>
<li>自定义编解码器</li>
<li>MessageToByteEncoder 和 ByteToMessageDecoder</li>
</ul>
<hr>
<h2>练习题</h2>
<ol>
<li><strong>基础题</strong>：编写程序，演示 ByteBuf 的读写操作</li>
<li><strong>进阶题</strong>：实现一个自定义协议的编解码器</li>
<li><strong>挑战题</strong>：使用 CompositeByteBuf 实现 HTTP 响应的零拷贝组装</li>
</ol>
<hr>
<p><strong>上一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html">第5章：ChannelHandler详解</a><br>
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html">第7章：编解码器</a></p></div>
          <footer class="rel fn-clear ft__center">
            <a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html" class="fn-left">上一篇：第5章：ChannelHandler 详解</a>
            <a href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/7.html" class="fn-right">下一篇：第7章：编解码器（Codec）</a>
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
