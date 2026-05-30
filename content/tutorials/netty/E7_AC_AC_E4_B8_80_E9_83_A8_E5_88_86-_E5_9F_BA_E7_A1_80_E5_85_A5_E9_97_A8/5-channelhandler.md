---
title: "第5章：ChannelHandler 详解"
permalink: "/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/5-channelhandler.html"
description: "第5章：ChannelHandler 详解 本章导读 ChannelHandler 是 Netty 处理 I/O 事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。 5.1 ChannelInboundHandler（入站处理器） 5.1.1 入站处理器概述 定义：C..."
---

<h1>第5章：ChannelHandler 详解</h1>
<h2>本章导读</h2>
<p>ChannelHandler 是 Netty 处理 I/O 事件和业务逻辑的核心接口。本章将深入讲解 Handler 的生命周期、入站和出站处理器的区别、Handler 的添加和移除，以及异常处理机制。</p>
<hr>
<h2>5.1 ChannelInboundHandler（入站处理器）</h2>
<h3>5.1.1 入站处理器概述</h3>
<p><strong>定义</strong>：ChannelInboundHandler 用于处理入站事件，如连接建立、数据读取等。</p>
<p><strong>事件流向</strong>：从 Head → Tail</p>
<h3>5.1.2 生命周期方法</h3>
<pre><code class="language-java">public interface ChannelInboundHandler extends ChannelHandler {
<pre><code>// 1. Channel注册到EventLoop
void channelRegistered(ChannelHandlerContext ctx) throws Exception;
<p>// 2. Channel从EventLoop注销
void channelUnregistered(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 3. Channel激活（连接建立）
void channelActive(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 4. Channel失活（连接断开）
void channelInactive(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 5. 读取数据
void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception;</p>
<p>// 6. 读取完成
void channelReadComplete(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 7. 用户自定义事件
void userEventTriggered(ChannelHandlerContext ctx, Object evt) throws Exception;</p>
<p>// 8. Channel可写状态改变
void channelWritabilityChanged(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 9. 异常捕获
void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception;
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.1.3 生命周期顺序</h3>
<pre><code>channelRegistered → channelActive → channelRead → channelReadComplete → 
channelInactive → channelUnregistered
</code></pre>
<p><strong>完整示例</strong>：</p>
<pre><code class="language-java">public class LifecycleHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void handlerAdded(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;1. handlerAdded: Handler被添加到Pipeline&amp;quot;);
}
<p>@Override
public void channelRegistered(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;2. channelRegistered: Channel注册到EventLoop&amp;quot;);
ctx.fireChannelRegistered();
}</p>
<p>@Override
public void channelActive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;3. channelActive: Channel激活（连接建立）&amp;quot;);
System.out.println(&amp;quot;   本地地址: &amp;quot; + ctx.channel().localAddress());
System.out.println(&amp;quot;   远程地址: &amp;quot; + ctx.channel().remoteAddress());
ctx.fireChannelActive();
}</p>
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
System.out.println(&amp;quot;4. channelRead: 读取数据&amp;quot;);
System.out.println(&amp;quot;   数据: &amp;quot; + msg);
ctx.fireChannelRead(msg);
}</p>
<p>@Override
public void channelReadComplete(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;5. channelReadComplete: 读取完成&amp;quot;);
ctx.fireChannelReadComplete();
}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;6. channelInactive: Channel失活（连接断开）&amp;quot;);
ctx.fireChannelInactive();
}</p>
<p>@Override
public void channelUnregistered(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;7. channelUnregistered: Channel从EventLoop注销&amp;quot;);
ctx.fireChannelUnregistered();
}</p>
<p>@Override
public void handlerRemoved(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;8. handlerRemoved: Handler从Pipeline移除&amp;quot;);
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.out.println(&amp;quot;9. exceptionCaught: 捕获异常&amp;quot;);
System.out.println(&amp;quot;   异常: &amp;quot; + cause.getMessage());
ctx.close();
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.1.4 ChannelInboundHandlerAdapter</h3>
<p><strong>定义</strong>：提供默认实现的适配器类。</p>
<p><strong>特点</strong>：</p>
<ul>
<li>所有方法都有默认实现</li>
<li>默认实现会将事件传递给下一个 Handler</li>
<li>可以选择性地重写需要的方法</li>
</ul>
<pre><code class="language-java">public class MyInboundHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;连接建立&amp;quot;);
    // 必须调用，否则事件不会传播
    ctx.fireChannelActive();
}
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
System.out.println(&amp;quot;读取数据: &amp;quot; + msg);
// 传递给下一个Handler
ctx.fireChannelRead(msg);</p>
<pre><code>// 注意：如果不传递，需要手动释放msg
// ReferenceCountUtil.release(msg);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.1.5 SimpleChannelInboundHandler</h3>
<p><strong>定义</strong>：泛型入站处理器，自动释放消息。</p>
<p><strong>优势</strong>：</p>
<ul>
<li>自动类型转换</li>
<li>自动释放消息，避免内存泄漏</li>
<li>代码更简洁</li>
</ul>
<p><strong>对比</strong>：</p>
<pre><code class="language-java">// 方式1：使用ChannelInboundHandlerAdapter（需要手动释放）
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
<p>// 方式2：使用SimpleChannelInboundHandler（自动释放）
public class Handler2 extends SimpleChannelInboundHandler&lt;ByteBuf&gt; {
@Override
protected void channelRead0(ChannelHandlerContext ctx, ByteBuf msg) {
// 处理数据...
// 不需要手动释放，框架会自动释放
}
}
</code></pre></p>
<p><strong>完整示例</strong>：</p>
<pre><code class="language-java">public class StringHandler extends SimpleChannelInboundHandler&lt;String&gt; {
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    System.out.println(&amp;quot;连接建立: &amp;quot; + ctx.channel().remoteAddress());
}
<p>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
// 自动类型转换为String
System.out.println(&amp;quot;收到消息: &amp;quot; + msg);</p>
<pre><code>// 处理业务逻辑
String response = processMessage(msg);

// 发送响应
ctx.writeAndFlush(response);

// 不需要手动释放msg
</code></pre>
<p>}</p>
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;连接断开: &amp;quot; + ctx.channel().remoteAddress());
}</p>
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;异常: &amp;quot; + cause.getMessage());
ctx.close();
}</p>
<p>private String processMessage(String msg) {
// 业务逻辑处理
return &amp;quot;处理结果: &amp;quot; + msg.toUpperCase();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>5.2 ChannelOutboundHandler（出站处理器）</h2>
<h3>5.2.1 出站处理器概述</h3>
<p><strong>定义</strong>：ChannelOutboundHandler 用于处理出站事件，如连接、写入、刷新等。</p>
<p><strong>事件流向</strong>：从 Tail → Head</p>
<h3>5.2.2 核心方法</h3>
<pre><code class="language-java">public interface ChannelOutboundHandler extends ChannelHandler {
<pre><code>// 绑定地址
void bind(ChannelHandlerContext ctx, SocketAddress localAddress, 
          ChannelPromise promise) throws Exception;
<p>// 连接远程地址
void connect(ChannelHandlerContext ctx, SocketAddress remoteAddress,
SocketAddress localAddress, ChannelPromise promise) throws Exception;</p>
<p>// 断开连接
void disconnect(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;</p>
<p>// 关闭Channel
void close(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;</p>
<p>// 注销Channel
void deregister(ChannelHandlerContext ctx, ChannelPromise promise) throws Exception;</p>
<p>// 读取数据
void read(ChannelHandlerContext ctx) throws Exception;</p>
<p>// 写入数据
void write(ChannelHandlerContext ctx, Object msg,
ChannelPromise promise) throws Exception;</p>
<p>// 刷新数据
void flush(ChannelHandlerContext ctx) throws Exception;
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.2.3 ChannelOutboundHandlerAdapter</h3>
<pre><code class="language-java">public class MyOutboundHandler extends ChannelOutboundHandlerAdapter {
<pre><code>@Override
public void write(ChannelHandlerContext ctx, Object msg, ChannelPromise promise) {
    System.out.println(&amp;quot;写入数据: &amp;quot; + msg);
<pre><code>// 可以修改数据
if (msg instanceof String) {
    String data = (String) msg;
    msg = &amp;amp;quot;[&amp;amp;quot; + LocalDateTime.now() + &amp;amp;quot;] &amp;amp;quot; + data;
}

// 传递给下一个Handler
ctx.write(msg, promise);
</code></pre>
<p>}</p>
<p>@Override
public void flush(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;刷新数据到网络&amp;quot;);
ctx.flush();
}</p>
<p>@Override
public void close(ChannelHandlerContext ctx, ChannelPromise promise) {
System.out.println(&amp;quot;关闭连接&amp;quot;);
ctx.close(promise);
}
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.2.4 入站和出站Handler的区别</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>InboundHandler</th>
<th>OutboundHandler</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>处理事件</strong></td>
<td>读取、连接建立等</td>
<td>写入、连接、关闭等</td>
</tr>
<tr>
<td><strong>事件流向</strong></td>
<td>Head → Tail</td>
<td>Tail → Head</td>
</tr>
<tr>
<td><strong>触发方式</strong></td>
<td>自动触发</td>
<td>手动触发</td>
</tr>
<tr>
<td><strong>常用场景</strong></td>
<td>解码、业务处理</td>
<td>编码、日志记录</td>
</tr>
</tbody>
</table>
<p><strong>示例</strong>：</p>
<pre><code class="language-java">pipeline.addLast(&quot;inbound1&quot;, new InboundHandler1());   // 入站
pipeline.addLast(&quot;inbound2&quot;, new InboundHandler2());   // 入站
pipeline.addLast(&quot;outbound1&quot;, new OutboundHandler1()); // 出站
pipeline.addLast(&quot;outbound2&quot;, new OutboundHandler2()); // 出站
<p>// 入站事件流向：inbound1 → inbound2
// 出站事件流向：outbound2 → outbound1
</code></pre></p>
<hr>
<h2>5.3 Handler 的添加和移除</h2>
<h3>5.3.1 添加 Handler</h3>
<p><strong>在 ChannelInitializer 中添加</strong>：</p>
<pre><code class="language-java">bootstrap.childHandler(new ChannelInitializer&lt;SocketChannel&gt;() {
    @Override
    protected void initChannel(SocketChannel ch) {
        ChannelPipeline pipeline = ch.pipeline();
<pre><code>    // 添加到尾部
    pipeline.addLast(&amp;quot;handler1&amp;quot;, new Handler1());
    pipeline.addLast(&amp;quot;handler2&amp;quot;, new Handler2());
<pre><code>// 添加到头部
pipeline.addFirst(&amp;amp;quot;handler0&amp;amp;quot;, new Handler0());

// 在指定Handler之前添加
pipeline.addBefore(&amp;amp;quot;handler2&amp;amp;quot;, &amp;amp;quot;handler1.5&amp;amp;quot;, new Handler15());

// 在指定Handler之后添加
pipeline.addAfter(&amp;amp;quot;handler1&amp;amp;quot;, &amp;amp;quot;handler1.2&amp;amp;quot;, new Handler12());
</code></pre>
<p>}
</code></pre></p>
<p>});
</code></pre></p>
<p><strong>动态添加 Handler</strong>：</p>
<pre><code class="language-java">public class DynamicHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelActive(ChannelHandlerContext ctx) {
    // 动态添加Handler
    if (needAuth) {
        ctx.pipeline().addFirst(&amp;quot;auth&amp;quot;, new AuthHandler());
    }
<pre><code>if (needEncrypt) {
    ctx.pipeline().addLast(&amp;amp;quot;encrypt&amp;amp;quot;, new EncryptHandler());
}

ctx.fireChannelActive();
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.3.2 移除 Handler</h3>
<pre><code class="language-java">public class RemovableHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    // 处理消息
    System.out.println(&amp;quot;处理消息: &amp;quot; + msg);
<pre><code>// 移除自己（一次性Handler）
ctx.pipeline().remove(this);

// 或者通过名称移除
// ctx.pipeline().remove(&amp;amp;quot;handlerName&amp;amp;quot;);

ctx.fireChannelRead(msg);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>移除方法</strong>：</p>
<pre><code class="language-java">// 1. 通过Handler实例移除
pipeline.remove(handler);
<p>// 2. 通过Handler名称移除
pipeline.remove(&quot;handlerName&quot;);</p>
<p>// 3. 通过Handler类型移除
pipeline.remove(MyHandler.class);</p>
<p>// 4. 移除第一个Handler
pipeline.removeFirst();</p>
<p>// 5. 移除最后一个Handler
pipeline.removeLast();
</code></pre></p>
<h3>5.3.3 替换 Handler</h3>
<pre><code class="language-java">// 1. 替换指定Handler
pipeline.replace(oldHandler, &quot;newHandler&quot;, newHandler);
<p>// 2. 通过名称替换
pipeline.replace(&quot;oldName&quot;, &quot;newName&quot;, newHandler);</p>
<p>// 3. 通过类型替换
pipeline.replace(OldHandler.class, &quot;newHandler&quot;, newHandler);
</code></pre></p>
<h3>5.3.4 实战示例：认证Handler</h3>
<pre><code class="language-java">public class AuthHandler extends ChannelInboundHandlerAdapter {
<pre><code>private boolean authenticated = false;
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
if (!authenticated) {
// 验证消息
if (isValidAuth(msg)) {
authenticated = true;
System.out.println(&amp;quot;认证成功&amp;quot;);</p>
<pre><code>        // 认证成功后移除自己
        ctx.pipeline().remove(this);
        
        // 传递给下一个Handler
        ctx.fireChannelRead(msg);
    } else {
        System.out.println(&amp;amp;quot;认证失败，关闭连接&amp;amp;quot;);
        ctx.close();
    }
} else {
    ctx.fireChannelRead(msg);
}
</code></pre>
<p>}</p>
<p>private boolean isValidAuth(Object msg) {
// 验证逻辑
return &amp;quot;AUTH:secret&amp;quot;.equals(msg.toString());
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>5.4 异常处理机制</h2>
<h3>5.4.1 异常传播</h3>
<p><strong>入站异常</strong>：从发生异常的 Handler 向后传播</p>
<pre><code class="language-java">Handler1 → Handler2 → Handler3(异常) → Handler4 → Handler5
                                ↓
                        exceptionCaught()
</code></pre>
<p><strong>出站异常</strong>：通过 ChannelPromise 传递</p>
<pre><code class="language-java">ctx.write(msg).addListener(future -&gt; {
    if (!future.isSuccess()) {
        // 处理异常
        Throwable cause = future.cause();
    }
});
</code></pre>
<h3>5.4.2 异常处理最佳实践</h3>
<p><strong>方式1：在每个Handler中处理</strong></p>
<pre><code class="language-java">public class Handler1 extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    try {
        // 处理消息
        processMessage(msg);
    } catch (Exception e) {
        // 处理异常
        System.err.println(&amp;quot;处理失败: &amp;quot; + e.getMessage());
        ctx.fireExceptionCaught(e);
    }
}
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
System.err.println(&amp;quot;捕获异常: &amp;quot; + cause.getMessage());
ctx.fireExceptionCaught(cause);
}
</code></pre></p>
<p>}
</code></pre></p>
<p><strong>方式2：统一异常处理Handler（推荐）</strong></p>
<pre><code class="language-java">public class GlobalExceptionHandler extends ChannelInboundHandlerAdapter {
<pre><code>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
    // 记录日志
    logger.error(&amp;quot;发生异常&amp;quot;, cause);
<pre><code>// 根据异常类型处理
if (cause instanceof IOException) {
    System.err.println(&amp;amp;quot;IO异常: &amp;amp;quot; + cause.getMessage());
} else if (cause instanceof TimeoutException) {
    System.err.println(&amp;amp;quot;超时异常: &amp;amp;quot; + cause.getMessage());
} else {
    System.err.println(&amp;amp;quot;未知异常: &amp;amp;quot; + cause.getMessage());
}

// 发送错误响应
ctx.writeAndFlush(&amp;amp;quot;ERROR: &amp;amp;quot; + cause.getMessage());

// 关闭连接
ctx.close();
</code></pre>
<p>}
</code></pre></p>
<p>}</p>
<p>// 添加到Pipeline的最后
pipeline.addLast(&quot;exceptionHandler&quot;, new GlobalExceptionHandler());
</code></pre></p>
<p><strong>方式3：使用 ChannelFutureListener</strong></p>
<pre><code class="language-java">ChannelFuture future = ctx.writeAndFlush(msg);
future.addListener((ChannelFutureListener) f -&gt; {
    if (!f.isSuccess()) {
        Throwable cause = f.cause();
        System.err.println(&quot;发送失败: &quot; + cause.getMessage());
<pre><code>    // 处理异常
    if (cause instanceof IOException) {
        // 重试
        retry(ctx, msg);
    } else {
        // 关闭连接
        ctx.close();
    }
}
</code></pre>
<p>});
</code></pre></p>
<h3>5.4.3 完整的异常处理示例</h3>
<pre><code class="language-java">public class ExceptionHandlingServer {
<pre><code>public static void main(String[] args) throws Exception {
    EventLoopGroup bossGroup = new NioEventLoopGroup(1);
    EventLoopGroup workerGroup = new NioEventLoopGroup();
<pre><code>try {
    ServerBootstrap bootstrap = new ServerBootstrap();
    bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ChannelPipeline pipeline = ch.pipeline();
                    
                    // 业务Handler
                    pipeline.addLast(&amp;amp;quot;business&amp;amp;quot;, new BusinessHandler());
                    
                    // 全局异常处理Handler（放在最后）
                    pipeline.addLast(&amp;amp;quot;exception&amp;amp;quot;, new GlobalExceptionHandler());
                }
            });
    
    ChannelFuture future = bootstrap.bind(8080).sync();
    future.channel().closeFuture().sync();
} finally {
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
</code></pre>
<p>}
</code></pre></p>
<p>}</p>
<p>class BusinessHandler extends SimpleChannelInboundHandler&lt;String&gt; {</p>
<pre><code>@Override
protected void channelRead0(ChannelHandlerContext ctx, String msg) {
    try {
        // 业务处理
        if (&amp;quot;error&amp;quot;.equals(msg)) {
            throw new RuntimeException(&amp;quot;业务异常&amp;quot;);
        }
<pre><code>    ctx.writeAndFlush(&amp;amp;quot;处理成功: &amp;amp;quot; + msg);
} catch (Exception e) {
    // 传播异常
    ctx.fireExceptionCaught(e);
}
</code></pre>
<p>}
</code></pre></p>
<p>}</p>
<p>class GlobalExceptionHandler extends ChannelInboundHandlerAdapter {</p>
<pre><code>private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
<p>@Override
public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
// 记录日志
logger.error(&amp;quot;捕获异常&amp;quot;, cause);</p>
<pre><code>// 发送错误响应
String errorMsg = &amp;amp;quot;服务器错误: &amp;amp;quot; + cause.getMessage();
ctx.writeAndFlush(errorMsg).addListener(ChannelFutureListener.CLOSE);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>5.5 ChannelHandlerContext</h2>
<h3>5.5.1 ChannelHandlerContext 概述</h3>
<p><strong>定义</strong>：ChannelHandlerContext 是 Handler 和 Pipeline 之间的桥梁。</p>
<p><strong>核心功能</strong>：</p>
<ul>
<li>获取 Channel、Pipeline、EventLoop</li>
<li>触发入站和出站事件</li>
<li>读写数据</li>
<li>管理 Handler 的属性</li>
</ul>
<h3>5.5.2 核心方法</h3>
<pre><code class="language-java">public interface ChannelHandlerContext {
<pre><code>// 获取Channel
Channel channel();
<p>// 获取Pipeline
ChannelPipeline pipeline();</p>
<p>// 获取EventLoop
EventLoop executor();</p>
<p>// 获取Handler
ChannelHandler handler();</p>
<p>// 触发入站事件
ChannelHandlerContext fireChannelActive();
ChannelHandlerContext fireChannelRead(Object msg);
ChannelHandlerContext fireChannelReadComplete();
ChannelHandlerContext fireExceptionCaught(Throwable cause);</p>
<p>// 触发出站事件
ChannelFuture write(Object msg);
ChannelFuture writeAndFlush(Object msg);
ChannelHandlerContext flush();
ChannelFuture close();</p>
<p>// 属性管理
&amp;lt;T&amp;gt; Attribute&amp;lt;T&amp;gt; attr(AttributeKey&amp;lt;T&amp;gt; key);
</code></pre></p>
<p>}
</code></pre></p>
<h3>5.5.3 ctx vs channel</h3>
<p><strong>区别</strong>：</p>
<pre><code class="language-java">// 方式1：通过ctx触发事件（从当前Handler开始）
ctx.writeAndFlush(msg);  // 从当前Handler向前传播
<p>// 方式2：通过channel触发事件（从Pipeline尾部开始）
ctx.channel().writeAndFlush(msg);  // 从Pipeline尾部开始传播
</code></pre></p>
<p><strong>示例</strong>：</p>
<pre><code class="language-java">pipeline.addLast(&quot;handler1&quot;, new OutboundHandler1());
pipeline.addLast(&quot;handler2&quot;, new OutboundHandler2());
pipeline.addLast(&quot;handler3&quot;, new OutboundHandler3());
<p>// 在handler3中：
ctx.writeAndFlush(msg);  // 只经过handler2和handler1
ctx.channel().writeAndFlush(msg);  // 经过handler3、handler2和handler1
</code></pre></p>
<h3>5.5.4 属性管理</h3>
<pre><code class="language-java">public class AttributeHandler extends ChannelInboundHandlerAdapter {
<pre><code>// 定义属性Key
private static final AttributeKey&amp;lt;Integer&amp;gt; COUNTER = 
        AttributeKey.valueOf(&amp;quot;counter&amp;quot;);
<p>@Override
public void channelActive(ChannelHandlerContext ctx) {
// 设置属性
ctx.channel().attr(COUNTER).set(0);
ctx.fireChannelActive();
}</p>
<p>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
// 获取属性
Attribute&amp;lt;Integer&amp;gt; attr = ctx.channel().attr(COUNTER);
Integer count = attr.get();</p>
<pre><code>// 更新属性
attr.set(count + 1);

System.out.println(&amp;amp;quot;消息计数: &amp;amp;quot; + attr.get());
ctx.fireChannelRead(msg);
</code></pre>
<p>}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>5.6 实战示例：完整的Handler链</h2>
<pre><code class="language-java">public class CompleteHandlerChain {
<pre><code>public static void main(String[] args) throws Exception {
    EventLoopGroup bossGroup = new NioEventLoopGroup(1);
    EventLoopGroup workerGroup = new NioEventLoopGroup();
<pre><code>try {
    ServerBootstrap bootstrap = new ServerBootstrap();
    bootstrap.group(bossGroup, workerGroup)
            .channel(NioServerSocketChannel.class)
            .childHandler(new ChannelInitializer&amp;amp;lt;SocketChannel&amp;amp;gt;() {
                @Override
                protected void initChannel(SocketChannel ch) {
                    ChannelPipeline pipeline = ch.pipeline();
                    
                    // 1. 日志Handler
                    pipeline.addLast(&amp;amp;quot;logger&amp;amp;quot;, new LoggingHandler());
                    
                    // 2. 编解码Handler
                    pipeline.addLast(&amp;amp;quot;decoder&amp;amp;quot;, new StringDecoder());
                    pipeline.addLast(&amp;amp;quot;encoder&amp;amp;quot;, new StringEncoder());
                    
                    // 3. 认证Handler
                    pipeline.addLast(&amp;amp;quot;auth&amp;amp;quot;, new AuthHandler());
                    
                    // 4. 业务Handler
                    pipeline.addLast(&amp;amp;quot;business&amp;amp;quot;, new BusinessHandler());
                    
                    // 5. 全局异常Handler
                    pipeline.addLast(&amp;amp;quot;exception&amp;amp;quot;, new GlobalExceptionHandler());
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
<p>}</p>
<p>// 日志Handler
class LoggingHandler extends ChannelInboundHandlerAdapter {
@Override
public void channelActive(ChannelHandlerContext ctx) {
System.out.println(&quot;[LOG] 连接建立: &quot; + ctx.channel().remoteAddress());
ctx.fireChannelActive();
}</p>
<pre><code>@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    System.out.println(&amp;quot;[LOG] 收到数据: &amp;quot; + msg);
    ctx.fireChannelRead(msg);
}
<p>@Override
public void channelInactive(ChannelHandlerContext ctx) {
System.out.println(&amp;quot;[LOG] 连接断开&amp;quot;);
ctx.fireChannelInactive();
}
</code></pre></p>
<p>}
</code></pre></p>
<hr>
<h2>5.7 本章小结</h2>
<p>本章我们深入学习了 ChannelHandler：</p>
<p>✅ <strong>ChannelInboundHandler</strong>：处理入站事件，事件从 Head → Tail<br>
✅ <strong>ChannelOutboundHandler</strong>：处理出站事件，事件从 Tail → Head<br>
✅ <strong>SimpleChannelInboundHandler</strong>：自动释放消息，避免内存泄漏<br>
✅ <strong>Handler 生命周期</strong>：从添加到移除的完整流程<br>
✅ <strong>异常处理</strong>：统一异常处理 Handler 的最佳实践<br>
✅ <strong>ChannelHandlerContext</strong>：Handler 和 Pipeline 的桥梁</p>
<h3>关键要点</h3>
<ol>
<li><strong>入站 Handler</strong> 处理读取事件，<strong>出站 Handler</strong> 处理写入事件</li>
<li>使用 <strong>SimpleChannelInboundHandler</strong> 可以自动释放消息</li>
<li><strong>异常处理</strong> 应该放在 Pipeline 的最后</li>
<li><strong>ctx.write()</strong> 从当前 Handler 传播，<strong>channel.write()</strong> 从 Pipeline 尾部传播</li>
<li>Handler 可以动态添加和移除</li>
</ol>
<h3>Handler 最佳实践</h3>
<ol>
<li>✅ 使用 <code>SimpleChannelInboundHandler</code> 处理特定类型的消息</li>
<li>✅ 在 Pipeline 最后添加全局异常处理 Handler</li>
<li>✅ 一次性 Handler 处理完后应该移除自己</li>
<li>✅ 使用 <code>ctx.fireXxx()</code> 传播事件</li>
<li>✅ 不要在 Handler 中执行耗时操作，应该提交到业务线程池</li>
</ol>
<h3>下一章预告</h3>
<p>下一章我们将学习 <strong>ByteBuf 缓冲区</strong>，包括：</p>
<ul>
<li>ByteBuf 的优势</li>
<li>ByteBuf 的分类</li>
<li>读写操作</li>
<li>引用计数与内存管理</li>
<li>ByteBuf 分配器</li>
</ul>
<hr>
<h2>练习题</h2>
<ol>
<li><strong>基础题</strong>：编写一个 Handler，打印完整的生命周期</li>
<li><strong>进阶题</strong>：实现一个认证 Handler，认证成功后自动移除</li>
<li><strong>挑战题</strong>：实现一个限流 Handler，每秒最多处理 100 个请求</li>
</ol>
<hr>
<p><strong>上一章</strong>：<a href="/netty/E7_AC_AC_E4_B8_80_E9_83_A8_E5_88_86-_E5_9F_BA_E7_A1_80_E5_85_A5_E9_97_A8/4-bootstrap.html">第4章：Bootstrap启动器</a><br>
<strong>下一章</strong>：<a href="/netty/E7_AC_AC_E4_BA_8C_E9_83_A8_E5_88_86-_E6_A0_B8_E5_BF_83_E7_89_B9_E6_80_A7/6-bytebuf.html">第6章：ByteBuf缓冲区</a></p>
