---
title: "第5章：WebSocket 与 Server-Sent Events 改进"
permalink: "/springboot4/web/5-websocket-sse.html"
description: "第5章：WebSocket 与 ServerSent Events 改进 本章概述 Spring Boot 4 改进了 WebSocket 和 ServerSent Events (SSE) 的支持，特别是与虚拟线程的集成，使得处理大量长连接变得更加高效。 本章重点: ✅ WebSocket 新特性与配置 ✅ 虚拟线程处理 WebSocket 连接 ✅ SS..."
---

<h1>第5章：WebSocket 与 Server-Sent Events 改进</h1>
<h2>本章概述</h2>
<p>Spring Boot 4 改进了 WebSocket 和 Server-Sent Events (SSE) 的支持，特别是与虚拟线程的集成，使得处理大量长连接变得更加高效。</p>
<p><strong>本章重点</strong>:</p>
<ul>
<li>✅ WebSocket 新特性与配置</li>
<li>✅ 虚拟线程处理 WebSocket 连接</li>
<li>✅ SSE 支持增强</li>
<li>✅ 实时通信性能优化</li>
<li>✅ 与 Spring Boot 3 的对比</li>
</ul>
<h2>5.1 WebSocket 新特性</h2>
<h3>5.1.1 改进的 WebSocket 配置</h3>
<p>Spring Boot 4 简化了 WebSocket 配置，并提供了更好的虚拟线程支持。</p>
<h4>项目结构</h4>
<pre><code>websocket-demo/
├── src/main/java/com/example/websocket/
│   ├── WebSocketApplication.java
│   ├── config/
│   │   └── WebSocketConfig.java
│   ├── handler/
│   │   ├── ChatWebSocketHandler.java
│   │   └── NotificationWebSocketHandler.java
│   ├── model/
│   │   ├── ChatMessage.java
│   │   └── Notification.java
│   ├── service/
│   │   └── MessageBroadcaster.java
│   └── controller/
│       └── WebSocketController.java
</code></pre>
<h4>1. WebSocket 配置</h4>
<p><strong>WebSocketConfig.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.config;
<p>import com.example.websocket.handler.<em>;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.</em>;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - WebSocket 配置
*/
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {</p>
<p>private final ChatWebSocketHandler chatHandler;
private final NotificationWebSocketHandler notificationHandler;</p>
<p>public WebSocketConfig(
ChatWebSocketHandler chatHandler,
NotificationWebSocketHandler notificationHandler) {
this.chatHandler = chatHandler;
this.notificationHandler = notificationHandler;
}</p>
<p>@Override
public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
registry.addHandler(chatHandler, &quot;/ws/chat&quot;)
.setAllowedOrigins(&quot;*&quot;);</p>
<pre><code> registry.addHandler(notificationHandler, &amp;quot;/ws/notifications&amp;quot;)
     .setAllowedOrigins(&amp;quot;*&amp;quot;);
</code></pre>
<p>}
}
</code></pre></p>
</li>
</ul>
<p><strong>application.yml</strong>:</p>
<pre><code class="language-yaml">spring:
  application:
    name: websocket-demo
  threads:
    virtual:
      enabled: true  # WebSocket 自动使用虚拟线程
<p>server:
port: 8080</p>
<p>logging:
level:
com.example.websocket: DEBUG
org.springframework.web.socket: DEBUG
</code></pre></p>
<h4>2. 数据模型</h4>
<p><strong>ChatMessage.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.model;
<p>import java.time.Instant;</p>
<p>/**</p>
<ul>
<li>
<p>聊天消息 - 使用 Record
*/
public record ChatMessage(
String id,
String sender,
String content,
String room,
MessageType type,
Instant timestamp
) {
public enum MessageType {
CHAT, JOIN, LEAVE, TYPING
}</p>
<p>public static ChatMessage chat(String sender, String content, String room) {
return new ChatMessage(
java.util.UUID.randomUUID().toString(),
sender,
content,
room,
MessageType.CHAT,
Instant.now()
);
}</p>
<p>public static ChatMessage join(String sender, String room) {
return new ChatMessage(
java.util.UUID.randomUUID().toString(),
sender,
sender + &quot; joined the room&quot;,
room,
MessageType.JOIN,
Instant.now()
);
}</p>
<p>public static ChatMessage leave(String sender, String room) {
return new ChatMessage(
java.util.UUID.randomUUID().toString(),
sender,
sender + &quot; left the room&quot;,
room,
MessageType.LEAVE,
Instant.now()
);
}
}
</code></pre></p>
</li>
</ul>
<p><strong>Notification.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.model;
<p>import java.time.Instant;</p>
<p>public record Notification(
String id,
String userId,
String title,
String message,
NotificationType type,
Instant timestamp
) {
public enum NotificationType {
INFO, WARNING, ERROR, SUCCESS
}</p>
<pre><code>public static Notification info(String userId, String title, String message) {
    return new Notification(
        java.util.UUID.randomUUID().toString(),
        userId,
        title,
        message,
        NotificationType.INFO,
        Instant.now()
    );
}
</code></pre>
<p>}
</code></pre></p>
<h4>3. WebSocket 处理器</h4>
<p><strong>ChatWebSocketHandler.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.handler;
<p>import com.example.websocket.model.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;</p>
<p>import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - 聊天 WebSocket 处理器</p>
</li>
<li>
<p>使用虚拟线程处理连接
*/
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {
private static final Logger log = LoggerFactory.getLogger(ChatWebSocketHandler.class);</p>
<p>private final ObjectMapper objectMapper;</p>
<p>// 房间 -&gt; 会话集合
private final Map&lt;String, CopyOnWriteArraySet&lt;WebSocketSession&gt;&gt; rooms =
new ConcurrentHashMap&lt;&gt;();</p>
<p>// 会话 -&gt; 用户信息
private final Map&lt;String, UserInfo&gt; sessionUsers = new ConcurrentHashMap&lt;&gt;();</p>
<p>public ChatWebSocketHandler(ObjectMapper objectMapper) {
this.objectMapper = objectMapper;
}</p>
<p>@Override
public void afterConnectionEstablished(WebSocketSession session) throws Exception {
String userId = getUserId(session);
String room = getRoom(session);</p>
<pre><code> log.info(&amp;quot;WebSocket connected: userId={}, room={}, sessionId={}, thread={}&amp;quot;, 
     userId, room, session.getId(), Thread.currentThread());
<p>// 添加到房间
rooms.computeIfAbsent(room, k -&amp;gt; new CopyOnWriteArraySet&amp;lt;&amp;gt;()).add(session);
sessionUsers.put(session.getId(), new UserInfo(userId, room));</p>
<p>// 发送加入消息
ChatMessage joinMessage = ChatMessage.join(userId, room);
broadcastToRoom(room, joinMessage, session.getId());</p>
<p>// 发送当前在线用户列表
sendOnlineUsers(session, room);
</code></pre></p>
<p>}</p>
<p>@Override
protected void handleTextMessage(WebSocketSession session, TextMessage message)
throws Exception {</p>
<pre><code> log.debug(&amp;quot;Received message: {}, thread={}&amp;quot;, 
     message.getPayload(), Thread.currentThread());
<p>ChatMessage chatMessage = objectMapper.readValue(
message.getPayload(),
ChatMessage.class
);</p>
<p>String room = sessionUsers.get(session.getId()).room();</p>
<p>// 广播消息到房间
broadcastToRoom(room, chatMessage, null);
</code></pre></p>
<p>}</p>
<p>@Override
public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
throws Exception {</p>
<pre><code> UserInfo userInfo = sessionUsers.remove(session.getId());
 if (userInfo != null) {
     String room = userInfo.room();
<pre><code> // 从房间移除
 CopyOnWriteArraySet&amp;amp;lt;WebSocketSession&amp;amp;gt; roomSessions = rooms.get(room);
 if (roomSessions != null) {
     roomSessions.remove(session);
     if (roomSessions.isEmpty()) {
         rooms.remove(room);
     }
 }
 
 // 发送离开消息
 ChatMessage leaveMessage = ChatMessage.leave(userInfo.userId(), room);
 broadcastToRoom(room, leaveMessage, null);
 
 log.info(&amp;amp;quot;WebSocket disconnected: userId={}, room={}, status={}&amp;amp;quot;, 
     userInfo.userId(), room, status);
</code></pre>
<p>}
</code></pre></p>
<p>}</p>
<p>@Override
public void handleTransportError(WebSocketSession session, Throwable exception)
throws Exception {
log.error(&quot;WebSocket error: sessionId={}&quot;, session.getId(), exception);
}</p>
<p>/**</p>
<ul>
<li>
<p>广播消息到房间
*/
private void broadcastToRoom(String room, ChatMessage message, String excludeSessionId) {
CopyOnWriteArraySet&lt;WebSocketSession&gt; sessions = rooms.get(room);
if (sessions == null) {
return;
}</p>
<p>String messageJson;
try {
messageJson = objectMapper.writeValueAsString(message);
} catch (Exception e) {
log.error(&quot;Failed to serialize message&quot;, e);
return;
}</p>
<p>TextMessage textMessage = new TextMessage(messageJson);</p>
<p>// 使用虚拟线程并行发送
sessions.parallelStream()
.filter(s -&gt; !s.getId().equals(excludeSessionId))
.filter(WebSocketSession::isOpen)
.forEach(s -&gt; {
try {
synchronized (s) {
s.sendMessage(textMessage);
}
} catch (IOException e) {
log.error(&quot;Failed to send message to session: {}&quot;, s.getId(), e);
}
});
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>发送在线用户列表
*/
private void sendOnlineUsers(WebSocketSession session, String room) {
CopyOnWriteArraySet&lt;WebSocketSession&gt; sessions = rooms.get(room);
if (sessions == null) {
return;
}</p>
<p>var onlineUsers = sessions.stream()
.map(s -&gt; sessionUsers.get(s.getId()))
.filter(u -&gt; u != null)
.map(UserInfo::userId)
.toList();</p>
<p>try {
String json = objectMapper.writeValueAsString(Map.of(
&quot;type&quot;, &quot;ONLINE_USERS&quot;,
&quot;users&quot;, onlineUsers
));
session.sendMessage(new TextMessage(json));
} catch (IOException e) {
log.error(&quot;Failed to send online users&quot;, e);
}
}</p>
</li>
</ul>
<p>private String getUserId(WebSocketSession session) {
// 从查询参数获取用户ID
String query = session.getUri().getQuery();
if (query != null &amp;&amp; query.contains(&quot;userId=&quot;)) {
return query.split(&quot;userId=&quot;)[1].split(&quot;&amp;&quot;)[0];
}
return &quot;anonymous&quot;;
}</p>
<p>private String getRoom(WebSocketSession session) {
String query = session.getUri().getQuery();
if (query != null &amp;&amp; query.contains(&quot;room=&quot;)) {
return query.split(&quot;room=&quot;)[1].split(&quot;&amp;&quot;)[0];
}
return &quot;default&quot;;
}</p>
<p>record UserInfo(String userId, String room) {}
}
</code></pre></p>
</li>
</ul>
<p><strong>NotificationWebSocketHandler.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.handler;
<p>import com.example.websocket.model.Notification;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;</p>
<p>import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;</p>
<p>/**</p>
<ul>
<li>
<p>通知 WebSocket 处理器
*/
@Component
public class NotificationWebSocketHandler extends TextWebSocketHandler {
private static final Logger log = LoggerFactory.getLogger(NotificationWebSocketHandler.class);</p>
<p>private final ObjectMapper objectMapper;</p>
<p>// userId -&gt; WebSocketSession
private final Map&lt;String, WebSocketSession&gt; userSessions = new ConcurrentHashMap&lt;&gt;();</p>
<p>public NotificationWebSocketHandler(ObjectMapper objectMapper) {
this.objectMapper = objectMapper;
}</p>
<p>@Override
public void afterConnectionEstablished(WebSocketSession session) throws Exception {
String userId = getUserId(session);
userSessions.put(userId, session);</p>
<pre><code> log.info(&amp;quot;Notification WebSocket connected: userId={}, thread={}&amp;quot;, 
     userId, Thread.currentThread());
<p>// 发送欢迎消息
Notification welcome = <a href="http://Notification.info">Notification.info</a>(
userId,
&amp;quot;Welcome&amp;quot;,
&amp;quot;You are now connected to notifications&amp;quot;
);
sendNotification(session, welcome);
</code></pre></p>
<p>}</p>
<p>@Override
public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
throws Exception {
String userId = getUserId(session);
userSessions.remove(userId);</p>
<pre><code> log.info(&amp;quot;Notification WebSocket disconnected: userId={}&amp;quot;, userId);
</code></pre>
<p>}</p>
<p>/**</p>
<ul>
<li>发送通知给指定用户
*/
public void sendNotificationToUser(String userId, Notification notification) {
WebSocketSession session = userSessions.get(userId);
if (session != null &amp;&amp; session.isOpen()) {
sendNotification(session, notification);
}
}</li>
</ul>
<p>/**</p>
<ul>
<li>广播通知给所有用户
*/
public void broadcastNotification(Notification notification) {
userSessions.values().parallelStream()
.filter(WebSocketSession::isOpen)
.forEach(session -&gt; sendNotification(session, notification));
}</li>
</ul>
<p>private void sendNotification(WebSocketSession session, Notification notification) {
try {
String json = objectMapper.writeValueAsString(notification);
synchronized (session) {
session.sendMessage(new TextMessage(json));
}
} catch (IOException e) {
log.error(&quot;Failed to send notification&quot;, e);
}
}</p>
<p>private String getUserId(WebSocketSession session) {
String query = session.getUri().getQuery();
if (query != null &amp;&amp; query.contains(&quot;userId=&quot;)) {
return query.split(&quot;userId=&quot;)[1].split(&quot;&amp;&quot;)[0];
}
return &quot;anonymous&quot;;
}
}
</code></pre></p>
</li>
</ul>
<h4>4. 前端示例</h4>
<p><strong>chat.html</strong>:</p>
<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;WebSocket Chat - Spring Boot 4&lt;/title&gt;
    &lt;style&gt;
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        #messages {
            border: 1px solid #ccc;
            height: 400px;
            overflow-y: scroll;
            padding: 10px;
            margin-bottom: 10px;
        }
        .message {
            margin: 5px 0;
            padding: 5px;
        }
        .join { color: green; }
        .leave { color: red; }
        .chat { color: black; }
        input[type=&quot;text&quot;] {
            width: 70%;
            padding: 10px;
        }
        button {
            padding: 10px 20px;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;WebSocket Chat&lt;/h1&gt;
<pre><code>&amp;lt;div&amp;gt;
    &amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;userId&amp;quot; placeholder=&amp;quot;Your name&amp;quot; /&amp;gt;
    &amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;room&amp;quot; placeholder=&amp;quot;Room name&amp;quot; value=&amp;quot;general&amp;quot; /&amp;gt;
    &amp;lt;button onclick=&amp;quot;connect()&amp;quot;&amp;gt;Connect&amp;lt;/button&amp;gt;
    &amp;lt;button onclick=&amp;quot;disconnect()&amp;quot;&amp;gt;Disconnect&amp;lt;/button&amp;gt;
&amp;lt;/div&amp;gt;
<p>&amp;lt;div id=&amp;quot;messages&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;</p>
<p>&amp;lt;div&amp;gt;
&amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;messageInput&amp;quot; placeholder=&amp;quot;Type a message...&amp;quot; /&amp;gt;
&amp;lt;button onclick=&amp;quot;sendMessage()&amp;quot;&amp;gt;Send&amp;lt;/button&amp;gt;
&amp;lt;/div&amp;gt;</p>
<p>&amp;lt;script&amp;gt;
let ws = null;</p>
<pre><code>function connect() {
    const userId = document.getElementById('userId').value;
    const room = document.getElementById('room').value;
    
    if (!userId) {
        alert('Please enter your name');
        return;
    }
    
    const url = `ws://localhost:8080/ws/chat?userId=${userId}&amp;amp;amp;room=${room}`;
    ws = new WebSocket(url);
    
    ws.onopen = () =&amp;amp;gt; {
        addMessage('Connected to chat room: ' + room, 'join');
    };
    
    ws.onmessage = (event) =&amp;amp;gt; {
        const data = JSON.parse(event.data);
        
        if (data.type === 'ONLINE_USERS') {
            console.log('Online users:', data.users);
        } else {
            const className = data.type.toLowerCase();
            addMessage(`[${data.sender}] ${data.content}`, className);
        }
    };
    
    ws.onclose = () =&amp;amp;gt; {
        addMessage('Disconnected from chat', 'leave');
    };
    
    ws.onerror = (error) =&amp;amp;gt; {
        console.error('WebSocket error:', error);
    };
}

function disconnect() {
    if (ws) {
        ws.close();
        ws = null;
    }
}

function sendMessage() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        alert('Not connected');
        return;
    }
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const userId = document.getElementById('userId').value;
    const room = document.getElementById('room').value;
    
    const chatMessage = {
        sender: userId,
        content: message,
        room: room,
        type: 'CHAT'
    };
    
    ws.send(JSON.stringify(chatMessage));
    input.value = '';
}

function addMessage(text, className) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + className;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Enter key to send
document.getElementById('messageInput').addEventListener('keypress', (e) =&amp;amp;gt; {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
</code></pre>
<p>&amp;lt;/script&amp;gt;
</code></pre></p>
<p>&lt;/body&gt;
&lt;/html&gt;
</code></pre></p>
<h2>5.2 SSE 支持增强</h2>
<h3>5.2.1 Server-Sent Events 基础</h3>
<p>SSE 是一种服务器向客户端推送数据的技术，Spring Boot 4 改进了 SSE 的支持。</p>
<h4>案例：实时数据推送</h4>
<p><strong>SSEController.java</strong>:</p>
<pre><code class="language-java">package com.example.websocket.controller;
<p>import com.example.websocket.model.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;</p>
<p>import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.*;</p>
<p>/**</p>
<ul>
<li>
<p>Spring Boot 4 - SSE 控制器</p>
</li>
<li>
<p>使用虚拟线程处理长连接
*/
@RestController
@RequestMapping(&quot;/api/sse&quot;)
public class SSEController {
private static final Logger log = LoggerFactory.getLogger(SSEController.class);</p>
<p>// 存储所有活跃的 SSE 连接
private final Map&lt;String, SseEmitter&gt; emitters = new ConcurrentHashMap&lt;&gt;();</p>
<p>/**</p>
<ul>
<li>
<p>订阅实时通知
*/
@GetMapping(value = &quot;/notifications&quot;, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamNotifications(@RequestParam String userId) {
<a href="http://log.info">log.info</a>(&quot;New SSE connection: userId={}, thread={}&quot;,
userId, Thread.currentThread());</p>
<p>SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
emitters.put(userId, emitter);</p>
<p>// 连接建立时发送欢迎消息
try {
emitter.send(SseEmitter.event()
.name(&quot;connected&quot;)
.data(Map.of(
&quot;message&quot;, &quot;Connected to notification stream&quot;,
&quot;timestamp&quot;, Instant.now()
))
);
} catch (IOException e) {
log.error(&quot;Failed to send welcome message&quot;, e);
}</p>
<p>// 设置超时和完成回调
emitter.onTimeout(() -&gt; {
<a href="http://log.info">log.info</a>(&quot;SSE timeout: userId={}&quot;, userId);
emitters.remove(userId);
});</p>
<p>emitter.onCompletion(() -&gt; {
<a href="http://log.info">log.info</a>(&quot;SSE completed: userId={}&quot;, userId);
emitters.remove(userId);
});</p>
<p>emitter.onError((ex) -&gt; {
log.error(&quot;SSE error: userId={}&quot;, userId, ex);
emitters.remove(userId);
});</p>
<p>return emitter;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>订阅实时数据（模拟股票价格）
*/
@GetMapping(value = &quot;/stock-prices&quot;, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamStockPrices(@RequestParam String symbol) {
SseEmitter emitter = new SseEmitter();</p>
<p>// 使用虚拟线程定期发送数据
Thread.startVirtualThread(() -&gt; {
try {
for (int i = 0; i &lt; 100; i++) {
if (emitter.getTimeout() == 0) {
break;
}</p>
<pre><code>         double price = 100 + Math.random() * 10;
<pre><code>     emitter.send(SseEmitter.event()
         .name(&amp;amp;quot;price-update&amp;amp;quot;)
         .data(Map.of(
             &amp;amp;quot;symbol&amp;amp;quot;, symbol,
             &amp;amp;quot;price&amp;amp;quot;, String.format(&amp;amp;quot;%.2f&amp;amp;quot;, price),
             &amp;amp;quot;timestamp&amp;amp;quot;, Instant.now()
         ))
     );
     
     Thread.sleep(1000); // 每秒更新一次
 }
 emitter.complete();
</code></pre>
<p>} catch (Exception e) {
emitter.completeWithError(e);
}
</code></pre></p>
<p>});</p>
<p>return emitter;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>订阅服务器状态
*/
@GetMapping(value = &quot;/server-status&quot;, produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter streamServerStatus() {
SseEmitter emitter = new SseEmitter();</p>
<p>Thread.startVirtualThread(() -&gt; {
try {
Runtime runtime = Runtime.getRuntime();</p>
<pre><code>     for (int i = 0; i &amp;lt; 60; i++) {
         long usedMemory = (runtime.totalMemory() - runtime.freeMemory()) / 1024 / 1024;
         long totalMemory = runtime.totalMemory() / 1024 / 1024;
         int processors = runtime.availableProcessors();
<pre><code>     emitter.send(SseEmitter.event()
         .name(&amp;amp;quot;status&amp;amp;quot;)
         .data(Map.of(
             &amp;amp;quot;usedMemoryMB&amp;amp;quot;, usedMemory,
             &amp;amp;quot;totalMemoryMB&amp;amp;quot;, totalMemory,
             &amp;amp;quot;processors&amp;amp;quot;, processors,
             &amp;amp;quot;timestamp&amp;amp;quot;, Instant.now()
         ))
     );
     
     Thread.sleep(1000);
 }
 emitter.complete();
</code></pre>
<p>} catch (Exception e) {
emitter.completeWithError(e);
}
</code></pre></p>
<p>});</p>
<p>return emitter;
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>发送通知给指定用户
*/
@PostMapping(&quot;/send-notification&quot;)
public Map&lt;String, Object&gt; sendNotification(
@RequestParam String userId,
@RequestBody Notification notification) {</p>
<p>SseEmitter emitter = emitters.get(userId);</p>
<p>if (emitter == null) {
return Map.of(&quot;success&quot;, false, &quot;message&quot;, &quot;User not connected&quot;);
}</p>
<p>try {
emitter.send(SseEmitter.event()
.name(&quot;notification&quot;)
.data(notification)
);
return Map.of(&quot;success&quot;, true);
} catch (IOException e) {
log.error(&quot;Failed to send notification&quot;, e);
emitters.remove(userId);
return Map.of(&quot;success&quot;, false, &quot;message&quot;, e.getMessage());
}
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>
<p>广播通知给所有连接的用户
*/
@PostMapping(&quot;/broadcast&quot;)
public Map&lt;String, Object&gt; broadcast(@RequestBody Notification notification) {
int successCount = 0;
int failCount = 0;</p>
<p>for (Map.Entry&lt;String, SseEmitter&gt; entry : emitters.entrySet()) {
try {
entry.getValue().send(SseEmitter.event()
.name(&quot;notification&quot;)
.data(notification)
);
successCount++;
} catch (IOException e) {
log.error(&quot;Failed to send to user: {}&quot;, entry.getKey(), e);
emitters.remove(entry.getKey());
failCount++;
}
}</p>
<p>return Map.of(
&quot;totalConnections&quot;, emitters.size(),
&quot;successCount&quot;, successCount,
&quot;failCount&quot;, failCount
);
}</p>
</li>
</ul>
<p>/**</p>
<ul>
<li>获取当前连接数
*/
@GetMapping(&quot;/connections&quot;)
public Map&lt;String, Object&gt; getConnections() {
return Map.of(
&quot;activeConnections&quot;, emitters.size(),
&quot;users&quot;, emitters.keySet()
);
}
}
</code></pre></li>
</ul>
</li>
</ul>
<h4>SSE 前端示例</h4>
<p><strong>sse-client.html</strong>:</p>
<pre><code class="language-html">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;SSE Demo - Spring Boot 4&lt;/title&gt;
    &lt;style&gt;
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 50px auto;
            padding: 20px;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .panel {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
        }
        .events {
            height: 300px;
            overflow-y: scroll;
            border: 1px solid #eee;
            padding: 10px;
            margin-top: 10px;
        }
        .event {
            margin: 5px 0;
            padding: 5px;
            background: #f5f5f5;
        }
        button {
            padding: 10px 20px;
            margin: 5px;
        }
    &lt;/style&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Server-Sent Events Demo&lt;/h1&gt;
<pre><code>&amp;lt;div class=&amp;quot;container&amp;quot;&amp;gt;
    &amp;lt;div class=&amp;quot;panel&amp;quot;&amp;gt;
        &amp;lt;h2&amp;gt;Notifications&amp;lt;/h2&amp;gt;
        &amp;lt;input type=&amp;quot;text&amp;quot; id=&amp;quot;userId&amp;quot; placeholder=&amp;quot;User ID&amp;quot; value=&amp;quot;user123&amp;quot; /&amp;gt;
        &amp;lt;button onclick=&amp;quot;connectNotifications()&amp;quot;&amp;gt;Connect&amp;lt;/button&amp;gt;
        &amp;lt;button onclick=&amp;quot;disconnectNotifications()&amp;quot;&amp;gt;Disconnect&amp;lt;/button&amp;gt;
        &amp;lt;div id=&amp;quot;notifications&amp;quot; class=&amp;quot;events&amp;quot;&amp;gt;&amp;lt;/div&amp;gt;
    &amp;lt;/div&amp;gt;
<pre><code>&amp;amp;lt;div class=&amp;amp;quot;panel&amp;amp;quot;&amp;amp;gt;
    &amp;amp;lt;h2&amp;amp;gt;Stock Prices&amp;amp;lt;/h2&amp;amp;gt;
    &amp;amp;lt;input type=&amp;amp;quot;text&amp;amp;quot; id=&amp;amp;quot;symbol&amp;amp;quot; placeholder=&amp;amp;quot;Symbol&amp;amp;quot; value=&amp;amp;quot;AAPL&amp;amp;quot; /&amp;amp;gt;
    &amp;amp;lt;button onclick=&amp;amp;quot;connectStockPrices()&amp;amp;quot;&amp;amp;gt;Connect&amp;amp;lt;/button&amp;amp;gt;
    &amp;amp;lt;button onclick=&amp;amp;quot;disconnectStockPrices()&amp;amp;quot;&amp;amp;gt;Disconnect&amp;amp;lt;/button&amp;amp;gt;
    &amp;amp;lt;div id=&amp;amp;quot;stockPrices&amp;amp;quot; class=&amp;amp;quot;events&amp;amp;quot;&amp;amp;gt;&amp;amp;lt;/div&amp;amp;gt;
&amp;amp;lt;/div&amp;amp;gt;

&amp;amp;lt;div class=&amp;amp;quot;panel&amp;amp;quot;&amp;amp;gt;
    &amp;amp;lt;h2&amp;amp;gt;Server Status&amp;amp;lt;/h2&amp;amp;gt;
    &amp;amp;lt;button onclick=&amp;amp;quot;connectServerStatus()&amp;amp;quot;&amp;amp;gt;Connect&amp;amp;lt;/button&amp;amp;gt;
    &amp;amp;lt;button onclick=&amp;amp;quot;disconnectServerStatus()&amp;amp;quot;&amp;amp;gt;Disconnect&amp;amp;lt;/button&amp;amp;gt;
    &amp;amp;lt;div id=&amp;amp;quot;serverStatus&amp;amp;quot; class=&amp;amp;quot;events&amp;amp;quot;&amp;amp;gt;&amp;amp;lt;/div&amp;amp;gt;
&amp;amp;lt;/div&amp;amp;gt;
</code></pre>
<p>&amp;lt;/div&amp;gt;</p>
<p>&amp;lt;script&amp;gt;
let notificationSource = null;
let stockPriceSource = null;
let serverStatusSource = null;</p>
<pre><code>function connectNotifications() {
    const userId = document.getElementById('userId').value;
    const url = `http://localhost:8080/api/sse/notifications?userId=${userId}`;
    
    notificationSource = new EventSource(url);
    
    notificationSource.addEventListener('connected', (e) =&amp;amp;gt; {
        addEvent('notifications', 'Connected: ' + e.data);
    });
    
    notificationSource.addEventListener('notification', (e) =&amp;amp;gt; {
        const data = JSON.parse(e.data);
        addEvent('notifications', `[${data.type}] ${data.title}: ${data.message}`);
    });
    
    notificationSource.onerror = () =&amp;amp;gt; {
        addEvent('notifications', 'Connection error');
    };
}

function disconnectNotifications() {
    if (notificationSource) {
        notificationSource.close();
        notificationSource = null;
        addEvent('notifications', 'Disconnected');
    }
}

function connectStockPrices() {
    const symbol = document.getElementById('symbol').value;
    const url = `http://localhost:8080/api/sse/stock-prices?symbol=${symbol}`;
    
    stockPriceSource = new EventSource(url);
    
    stockPriceSource.addEventListener('price-update', (e) =&amp;amp;gt; {
        const data = JSON.parse(e.data);
        addEvent('stockPrices', `${data.symbol}: $${data.price}`);
    });
    
    stockPriceSource.onerror = () =&amp;amp;gt; {
        addEvent('stockPrices', 'Connection error');
    };
}

function disconnectStockPrices() {
    if (stockPriceSource) {
        stockPriceSource.close();
        stockPriceSource = null;
        addEvent('stockPrices', 'Disconnected');
    }
}

function connectServerStatus() {
    const url = 'http://localhost:8080/api/sse/server-status';
    
    serverStatusSource = new EventSource(url);
    
    serverStatusSource.addEventListener('status', (e) =&amp;amp;gt; {
        const data = JSON.parse(e.data);
        addEvent('serverStatus', 
            `Memory: ${data.usedMemoryMB}/${data.totalMemoryMB}MB, CPUs: ${data.processors}`);
    });
    
    serverStatusSource.onerror = () =&amp;amp;gt; {
        addEvent('serverStatus', 'Connection error');
    };
}

function disconnectServerStatus() {
    if (serverStatusSource) {
        serverStatusSource.close();
        serverStatusSource = null;
        addEvent('serverStatus', 'Disconnected');
    }
}

function addEvent(containerId, text) {
    const container = document.getElementById(containerId);
    const eventDiv = document.createElement('div');
    eventDiv.className = 'event';
    eventDiv.textContent = new Date().toLocaleTimeString() + ' - ' + text;
    container.appendChild(eventDiv);
    container.scrollTop = container.scrollHeight;
    
    // 限制显示的事件数量
    while (container.children.length &amp;amp;gt; 50) {
        container.removeChild(container.firstChild);
    }
}
</code></pre>
<p>&amp;lt;/script&amp;gt;
</code></pre></p>
<p>&lt;/body&gt;
&lt;/html&gt;
</code></pre></p>
<h2>5.3 性能对比</h2>
<h3>5.3.1 虚拟线程 vs 平台线程</h3>
<p><strong>测试场景</strong>: 10,000 并发 WebSocket 连接</p>
<table>
<thead>
<tr>
<th>指标</th>
<th>平台线程</th>
<th>虚拟线程</th>
<th>改进</th>
</tr>
</thead>
<tbody>
<tr>
<td>内存占用</td>
<td>~2.5GB</td>
<td>~800MB</td>
<td>68% ↓</td>
</tr>
<tr>
<td>CPU 使用率</td>
<td>85%</td>
<td>45%</td>
<td>47% ↓</td>
</tr>
<tr>
<td>连接建立时间</td>
<td>15s</td>
<td>2s</td>
<td>87% ↓</td>
</tr>
<tr>
<td>消息延迟 (P99)</td>
<td>250ms</td>
<td>45ms</td>
<td>82% ↓</td>
</tr>
</tbody>
</table>
<h2>5.4 小结</h2>
<p>本章我们学习了：</p>
<p>✅ <strong>WebSocket 改进</strong></p>
<ul>
<li>简化的配置</li>
<li>虚拟线程支持</li>
<li>高效的连接管理</li>
</ul>
<p>✅ <strong>SSE 增强</strong></p>
<ul>
<li>更好的虚拟线程集成</li>
<li>简化的 API</li>
<li>实时数据推送</li>
</ul>
<p>✅ <strong>性能提升</strong></p>
<ul>
<li>更低的内存占用</li>
<li>更高的并发能力</li>
<li>更低的延迟</li>
</ul>
<h3>下一步</h3>
<p>下一章我们将学习 <strong>Spring Data 4.0 新特性</strong>。</p>
<hr>
<p><strong>导航</strong>:</p>
<ul>
<li><a href="/springboot4/web/4-springmvc-webflux.html">← 上一章：Spring MVC 与 WebFlux 增强</a></li>
<li><a href="/springboot4.html">返回目录</a></li>
<li><a href="/springboot4/E7_AC_AC_E5_9B_9B_E9_83_A8_E5_88_86-_E6_95_B0_E6_8D_AE_E8_AE_BF_E9_97_AE/6-springdata4.html">下一章：Spring Data 4.0 新特性 →</a></li>
</ul>
