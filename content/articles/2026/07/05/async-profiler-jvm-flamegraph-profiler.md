---
title: "十年之后再看 async-profiler：一个不用改 JVM 就能看清 CPU / 分配 / 锁的采样式性能剖析器"
url: "/articles/2026/07/05/async-profiler-jvm-flamegraph-profiler/"
date: "2026-07-05T15:40:00+08:00"
lastmod: "2026-07-05T15:40:00+08:00"
description: "async-profiler 是 Java 生态里被引用最多、最保命的一个采样式性能剖析器。它不用 -XX:+PreserveFramePointer、不吃 safepoint bias、能同时把 Java 方法、JVM 内部、内核栈画进同一张火焰图。这一篇从 4.4 版本源码/文档级拆解：三种 CPU 采样引擎、三种栈行走模式、Wall / Alloc / Lock / Nativemem / 多事件、Differential Flame Graph、Heatmap、JFR 输出、asprof + jfrconv 完整跑通路径，以及和 JFR / Perf / VisualVM 的真实边界。"
tags: ["Java 性能", "async-profiler", "Flame Graph", "JVM", "开源项目"]
topic: "AI 工具"
topicSlug: "ai-tools"
layout: article
contentType: article
---

![封面](/images/async-profiler-jvm-flamegraph-profiler/flamegraph.png)

先说一个具体现场。

线上 Java 服务 CPU 打到 80%，但 top / htop 看不出是谁在烧、jstack 抓 5 次栈每次都不一样、JFR 打开觉得开销心里没底、VisualVM 附加过去看到的又只是抽样式的方法调用次数——这条链路你走过一次，就知道传统 Java profiler 有两个绕不开的死穴：

1. **safepoint bias**——绝大多数「Java 采样式 profiler」采样时其实是在等 JVM 到达一个 safepoint，一旦你的热点代码在 loop 里被 JIT 编译成了 counted loop、里面根本不放 safepoint poll，profiler 就看不见它。你以为你在采「谁在烧 CPU」，其实你采的是「谁最快能停下来」。
2. **看不见 JVM 内部和内核栈**——GC 线程、JIT 编译线程、glibc `memcpy`、内核 futex 等待——这些东西在传统 Java profiler 里全是「(Native method)」或者一片空白。你只看到自己那部分 Java 栈，看不到锅到底在 GC、JIT 还是内核。

`async-profiler/async-profiler`（[GitHub](https://github.com/async-profiler/async-profiler)，2026 年 4 月刚发 v4.4）是把这两件事都解掉了的一个 native agent。它已经在生产被用了差不多十年，是 Java 性能圈几乎所有排障文章都会提到的那一个工具。这一篇我把 4.4 版本的源码结构、六份核心文档（`docs/CpuSamplingEngines.md`、`docs/ProfilingModes.md`、`docs/StackWalkingModes.md`、`docs/ProfilerOptions.md`、`docs/OutputFormats.md`、`docs/Heatmap.md`）通读完，把它拆到能讲清楚每一个开关背后的机制。

## 一、痛点：Java 采样 profiler 的两个死穴

**Safepoint bias** 这四个字，Java 性能圈的老兵一听就知道说什么。传统的采样式 profiler 走的都是 JVMTI `GetStackTrace`——但这个 API 只能在 safepoint 生效。JVM 会在每个方法入口、循环回边、native 调用外围插「safepoint poll」，profiler 采样时其实是先请求 safepoint，等所有线程停在最近的 poll 上，然后再抓栈。这套机制的问题在于：

- **热点代码可能根本不到 safepoint**。JIT 会把 hot loop 编译成 counted loop（编译期能证明循环次数有限），counted loop 中间不放 safepoint poll——你在里面烧 CPU 也没人抓得到。
- **采样时机被扭曲**。你抓到的栈是「离 safepoint 最近的那一行」，不是「正在跑 CPU 的那一行」。这两者可能差得很远。

这就是 Nitsan Wakart 那篇著名博客 [Why (Most) Sampling Java Profilers Are Fucking Terrible](http://psy-lob-saw.blogspot.ru/2016/02/why-most-sampling-java-profilers-are.html) 的核心论点。async-profiler 的名字来自 HotSpot 的 [`AsyncGetCallTrace`](https://bugs.openjdk.org/browse/JDK-8178287)——这是一个非标准的 JVM 内部 API，可以**在信号处理器里、不用 safepoint** 就能取 Java 栈。这条路径避开了 safepoint bias，代价是要处理 AGCT 本身的一系列 corner case bug（后面会讲到 VM Structs 栈行走怎么绕过这个坑）。

第二个死穴是**看不见 JVM 内部和内核栈**。传统 Java profiler 只在 Java 层面工作，看到的都是 Java 类名。但真实的性能问题经常出在别处：

- GC 线程在跑 Young GC / Full GC；
- JIT 编译线程在编 C2；
- Java 代码通过 JNI 调进了一段 native 库；
- 你的 `read()` 在内核里等 I/O；
- 你的 `synchronized` 在内核里等 futex 唤醒。

async-profiler 用的是**混合栈行走**：perf_events 抓内核栈 + VM Structs 或 AsyncGetCallTrace 抓 Java/JVM 栈，然后把两条栈**在信号处理器里当场对齐**，最后画出来的一张火焰图里，Java 方法（绿色）、JDK 内联（青色）、JVM 内部 C++（黄色）、native 库（红色/黄色）、内核（橙色）**共存于同一根调用栈**。

看一眼实际输出你就懂了：

![CPU 火焰图：Java + JVM + 内核共存](/images/async-profiler-jvm-flamegraph-profiler/flamegraph.png)

图里最左边黄绿色的 `GenCollectedHeap::collect_generation` → `DefNewGeneration::collect` 是 JVM 内部的 GC C++ 栈，中间一大片绿色的 `java/util/stream/*` → `TimSort.sort` 是你的应用代码，右上角橙色的一柱是内核栈——这些东西**同时出现**在一张图里。传统 Java profiler 只能给你中间那块绿色。

## 二、方案：三种 CPU 采样引擎 × 三种栈行走模式

async-profiler 的可配置面，本质上是「怎么触发采样」和「怎么把栈抓出来」两个正交维度。理解了这六个开关，几乎所有生产环境的排障场景都能覆盖。

### CPU 采样引擎（`-e cpu` / `-e itimer` / `-e ctimer`）

| 属性 | cpu (perf_events) | itimer | ctimer |
|------|:---:|:---:|:---:|
| 能采内核栈 | ✅ | ❌ | ❌ |
| 高精度 | ✅ | ❌ | ❌ |
| 采样公平性 | ✅ | ❌ | 🆗 |
| 容器里开箱即用 | ❌ | ✅ | ✅ |
| 不消耗 fd | ❌ | ✅ | ✅ |
| macOS 支持 | ❌ | ✅ | ❌ |

- **`cpu`（perf_events）** 是精度最高的一档。给每个线程分配一个 `perf_event_open` 描述符，配 CPU 时钟溢出每 N 纳秒触发一次信号。**唯一能抓内核栈**的引擎。代价：受 `kernel.perf_event_paranoid` 限制、在 seccomp 沙箱里（大部分 Docker 容器默认就是）拿不到、每线程占一个 fd（线程多的进程要调 `ulimit -n`）。
- **`itimer`** 走 `setitimer(ITIMER_PROF)` syscall。老牌 POSIX 接口，最大好处是**容器里开箱就能用**。缺点是精度受 jiffy（10ms 或 4ms）限制、进程内一次只能发一个 itimer 信号、信号不在线程间均匀分布。
- **`ctimer`** 是 async-profiler 自己造的 Linux-only 折中方案，走 `timer_create` API。**结合了 `cpu` 的精度和 `itimer` 的容器友好**，唯一的代价是不能抓内核栈。这也是 v3+ 版本在容器里的默认降级路径——`-e cpu` 探测到 perf_events 拿不到就自动 fallback 到 `ctimer`，你不用管。

**实用规则**：能拿到 root / perf_events 的裸机就用 `-e cpu`；Docker/K8s 生产环境默认让它自动 fallback 到 `ctimer`；macOS 用 `-e itimer`。

### 栈行走模式（`--cstack fp` / `dwarf` / `vm` / `vmx`）

这一块是 v4.2 版本最大的架构变化：**默认栈行走模式从 Frame Pointer 换成了 VM Structs**。

- **Frame Pointer (fp)** — 传统方式，每次函数调用维护一个指向 caller 栈帧的指针。**最快**，但要求代码带 `-fno-omit-frame-pointer` 编译（很多生产 JVM 为了性能把 FP 优化掉了）。
- **DWARF** — 从二进制的 `.eh_frame` / `.debug_frame` 段读 unwinding table 反向重建调用栈。**优化过的代码也能用**，代价是要额外内存（libjvm.so 的 lookup 表大约 2 MB），比 FP 慢，但在信号处理器里仍然够快。v4.4 刚加了 `.debug_frame` 段支持（PR #1758）。
- **VM Structs (vm)** — **v4.2+ 的默认**。async-profiler 直接读 HotSpot 内部的 VM Structs，在 profiler 里自己复刻一份 Java 栈行走逻辑，**完全绕开 AsyncGetCallTrace**。这个改动意义重大——AGCT 是一个「非官方」JVM API，在小版本更新里被搞坏过好几次（[JDK-8307549](https://bugs.openjdk.org/browse/JDK-8307549) 是最近一次），还偶尔会崩 JVM。VM Structs 栈行走**用 setjmp/longjmp 包了 crash protection**，能同时展示 Java + native + JVM stub 全部栈帧，还能给每帧带上 JIT 编译类型信息。
- **VMx (vmx)** — VM Structs 的进阶版，允许 Java 和 native 栈帧**在同一条栈里交错出现**（比如 JNI 来回穿越）。

**实用规则**：不改任何东西，v4.2+ 默认就走 vm，最稳。如果发现某些 native 库栈没抓全，试 `--cstack dwarf`。

### 采样触发点：为什么这套机制能避开 safepoint bias

关键点在于——**perf_events 溢出、setitimer 定时、ctimer 定时**，这三种触发源都是**在信号处理器里当场调用 AsyncGetCallTrace 或 VM Structs 栈行走**。信号可以打断线程当前正在执行的任何一行代码，包括 JIT 编译出来的没有 safepoint poll 的 counted loop。你抓到的就是**真真正正正在 CPU 上跑的那一行**。

传统 Java profiler 用 JVMTI 的 `GetStackTrace`，触发的是「请求 safepoint → 等所有线程停下来 → 抓栈」的链路，两条路径的时机根本不同。这就是「low overhead」和「no safepoint bias」四个字的物理来源。

## 三、五种 profiling 模式：从 CPU 到 Alloc / Lock / Nativemem / Wall

`-e` 参数不止是 CPU 采样引擎。async-profiler 把它扩展成了一个统一的「事件源」抽象。

### CPU profiling（默认）

`-e cpu` / `-e cpu-clock`（强制 perf_events）/ `-e cycles`（perf 硬件计数器）/ `-e instructions`（retired 指令数）—— 都走上面讲的采样机制。

### Allocation profiling（`-e alloc` / `--alloc N`）

这是我最喜欢的一个模式。传统 Java 内存分析要么走 bytecode instrumentation（重、干扰 JIT），要么走 DTrace probe（macOS 才有）。async-profiler 走的是 **TLAB-driven sampling**：

- 当一个对象在**新创建的 TLAB** 里分配时，HotSpot 会调用一个回调；
- 当一个对象**在 TLAB 外的 slow path** 上分配时，另一个回调。

async-profiler 就 hook 这两个回调，采样出去。**只记录真实的堆分配**，不影响 escape analysis 和 JIT allocation elimination——也就是说 profiler 打开不会干扰 JVM 消除对象分配的优化。采样出来的火焰图里，**顶层帧是被分配对象的类名**，counter 是「堆压力」（TLAB 大小 / 直接对象大小）。

`--alloc 500k` 表示每分配 500 KB 采一次样。JDK 11+ 可以走 tab 抽样，粒度低于 TLAB 大小也生效。

### Native 内存泄漏（`-e nativemem`）

v3.0 加的一个大杀器。原理是**同时 hook `malloc` / `realloc` / `calloc` 和 `free`**，把它们按地址匹配起来，最后只留下**没有配对 free 的分配**——就是内存泄漏的候选源。

![Native 内存泄漏火焰图](/images/async-profiler-jvm-flamegraph-profiler/nativemem_flamegraph.png)

```bash
# 采样 nativemem
asprof start -e nativemem --nativemem 1m -f app.jfr <PID>
# ... 等一段时间 ...
asprof stop <PID>

# 生成 leak 火焰图（只保留未匹配 free 的分配）
jfrconv --total --nativemem --leak app.jfr app-leak.html
```

`--tail 20%` 参数忽略最后 20% 时间窗口内的分配（避免「刚分配还没来得及 free」的假阳性）。生产可用，开销跟 `malloc` 频率相关，加个 `--nativemem 1m` 采样阈值就基本可控。

### Wall-clock profiling（`-e wall -t`）

CPU 采样只采「正在跑」的线程，Wall clock 采**所有线程无论状态**（Running / Sleeping / Blocked / Waiting）。适合排查：

- 应用启动时间为什么这么长——大部分时间不是在跑 CPU，是在等 I/O、等锁、等类加载；
- Web 服务 latency 分布——CPU 采样看不见 select/epoll 里睡觉的时间。

必须配 `-t`（per-thread 模式），不然聚合出来的图意义不大。

### Lock profiling（`-e lock` 和 `--nativelock`）

`-e lock` 采 Java 层锁竞争（`synchronized` / `ReentrantLock` / `LockSupport.park`）——顶层帧是锁/监视器的类名，counter 是**纳秒级等待时间**。

v4.3（2026-01）加了 `--nativelock`，通过 hook `pthread_mutex_lock` / `pthread_rwlock_rdlock` / `pthread_rwlock_wrlock` 采**pthread 层锁竞争**——这个能看到 Java lock profiling 看不见的场景：C/C++ 库内部的锁、JVM 自己的 native 锁。

### 多事件（`-e cpu,alloc,lock` 或 `--all`）

**一份 profile 里同时采多种事件**。只有 JFR 输出格式支持（因为 flamegraph HTML 只画一种事件）。

```bash
# CPU + alloc + lock 一起采
asprof -e cpu --alloc 2m --lock 10ms -f profile.jfr <PID>

# 或者一键全开（cpu + wall + alloc + live + lock + nativemem）
asprof --all -f profile.jfr <PID>
```

`--all` 官方警告**不建议生产开**。开发/测试环境用来一次性看清全貌很好用，生产环境按需组合。

## 四、Differential Flame Graph：v4.4 最大的加分项

v4.4（2026-04-20）新加的差异火焰图（PR #1553）是我今年最想推的一个功能。使用场景很具体：

- 优化前 vs 优化后——两份 profile 对比，看你的改动到底加速了哪些方法、拖慢了哪些方法；
- 灰度 A/B——新版本 vs 老版本，看性能回归发生在哪；
- 混流量对照——同一时间段两个实例，一个走新配置一个走旧配置。

![Differential Flame Graph](/images/async-profiler-jvm-flamegraph-profiler/flamegraph_diff.png)

每条栈**用颜色渐变**表示两份 profile 之间的差异：变红表示这条栈在新 profile 里更热（回归），变蓝表示更冷（加速）。宽度是两份 profile 的加权平均。

```bash
# 用 jfrconv 直接生成对比
jfrconv --diff base.jfr new.jfr diff.html
```

一张图直接告诉你「你到底优化对了没有」——不用再自己手动 diff 两份栈。

## 五、Heatmap：找到那个偶尔来一下的尖刺

Flamegraph 是「时间聚合视图」——一整段 profile 里所有栈叠起来。Heatmap 是「时间轴视图」——横轴是时间，颜色深浅是采样密度。

![Wall-clock Heatmap 时间轴视图](/images/async-profiler-jvm-flamegraph-profiler/heatmap.png)

用场景：

- 系统偶尔卡一下，你不知道是几点几分——heatmap 上一眼看到那根深色竖条；
- Full GC 会不会分批爆发——竖条 pattern 一目了然；
- 应用启动阶段 vs 稳态——横轴一眼分辨；
- v4.3 加的时区切换、v4.4 修的 wall-clock heatmap 采样计数 bug（#1716），说明这个功能还在持续被打磨。

```bash
jfrconv --output heatmap app.jfr app-heatmap.html
```

点击 heatmap 上的任意时间段，会展开成对应时段的火焰图——heatmap 定位「什么时候」，flamegraph 定位「哪一段代码」，两个视图配合用是排间歇性问题的最短路径。

## 六、最短跑通路径

```bash
# 1. 下载对应平台的二进制
wget https://github.com/async-profiler/async-profiler/releases/download/v4.4/async-profiler-4.4-linux-x64.tar.gz
tar xf async-profiler-4.4-linux-x64.tar.gz
cd async-profiler-4.4-linux-x64

# 2. 内核参数（root 一次，之后不用管）
sudo sysctl kernel.perf_event_paranoid=1
sudo sysctl kernel.kptr_restrict=0

# 3. 找目标 Java 进程
jps
# 或 pgrep -a java

# 4. 采 30 秒 CPU flamegraph
./bin/asprof -d 30 -f /tmp/cpu.html <PID>
# 用浏览器打开 /tmp/cpu.html
```

从 attach 到看图，通常 45 秒内搞定。

**推荐 JVM 启动参数**（在你还能改的话）：

```
-XX:+UnlockDiagnosticVMOptions -XX:+DebugNonSafepoints
```

`DebugNonSafepoints` 让 JIT 编译出的代码在 non-safepoint 位置也保留调试信息，async-profiler 就能把 JIT 内联的方法名也解析出来（不然会看到一大堆 `<inlined>`）。生产环境这两个参数**是安全的**，几乎没有开销。

**几个高频组合**：

```bash
# 采内存分配，看谁在制造 GC 压力
./bin/asprof -d 60 -e alloc --alloc 500k -f /tmp/alloc.html <PID>

# 采锁竞争，超过 5 毫秒的都记下
./bin/asprof -d 60 -e lock --lock 5ms -t -f /tmp/lock.html <PID>

# 采 CPU + alloc + lock 一起（JFR 输出，之后再拆）
./bin/asprof -d 300 -e cpu --alloc 2m --lock 10ms -f /tmp/prod.jfr <PID>

# 从 JFR 拆出 CPU / alloc / lock 三张独立火焰图
./bin/jfrconv /tmp/prod.jfr /tmp/prod-cpu.html
./bin/jfrconv --alloc /tmp/prod.jfr /tmp/prod-alloc.html
./bin/jfrconv --lock /tmp/prod.jfr /tmp/prod-lock.html

# 生成 heatmap
./bin/jfrconv --output heatmap /tmp/prod.jfr /tmp/prod-heat.html

# 优化前后对比
./bin/jfrconv --diff before.jfr after.jfr /tmp/diff.html

# 连续采样（每小时一份，文件名带时间戳）
./bin/asprof --loop 1h -f /var/log/profile-%t.jfr <PID>
```

**容器里**：直接把 `.tar.gz` 拷进容器，`kernel.perf_event_paranoid` 是容器**宿主机**的 sysctl，容器内 profile-agent 依赖宿主机的设置。docker 里默认 seccomp 挡了 perf_event_open，async-profiler 会自动 fallback 到 `ctimer`——你不用改任何东西，只是不出内核栈而已。

## 七、Tree View / Aggregated View：不只是火焰图

async-profiler 输出的 HTML 火焰图里内置了 **Tree View / Aggregated View** 两个视图切换：

![Tree View 展开视图](/images/async-profiler-jvm-flamegraph-profiler/treeview_example.png)

- **Tree View** — 传统树形展开，适合精确追一条特定调用链；
- **Aggregated View** — 按方法聚合而不是按调用栈聚合，看「哪个方法总共占了多少 CPU」（无论它被谁调用）；
- **Search Box** — 顶端搜索框支持正则，`jvm/` 一搜看所有 JVM 帧、`java\.util\.` 一搜看所有 JDK util 用量；
- **Ctrl+Click / Alt+Click** — v4.4 加的快捷键，一键从火焰图上「消除」某条栈（专注剩下的部分）；
- **Dark Mode 切换**（v4.4）—— 半夜排障不刺眼。

这些交互能力才是「HTML 火焰图 vs SVG 老图」的真实差距。

## 八、v4.4 到底动了什么：CHANGELOG 直读

翻一遍 CHANGELOG 你就能看出这个项目的工程判断力。

**v4.4（2026-04-20）**：
- 新增 Differential Flame Graph（前面讲过）；
- 新增 `memlimit` 选项——限制 call trace storage 大小，防止长时间 profile 撑爆内存；
- 新增 `-j` 深栈截断——避免深递归让火焰图太深；
- 新增 dark mode + Ctrl+Click 移除栈；
- 打破改动：**永久移除 `check` 命令、移除 unsafe AGCT recovery + `safemode` 选项、移除 `cstack=lbr` 选项**。核心库越做越干净，减少历史包袱。

**v4.3（2026-01-20）**：
- 新增 native lock profiling（前面讲过）；
- 新增 wall/cpu latency filter（按延迟过滤，不是所有采样都看）；
- 新增 **Prometheus 格式 metrics 输出**——continuous profiling 场景可以直接被 Prom 抓；
- 新增 **async-profiler.jar 作为 Java agent + JMX 远程控制**——不再必须 attach 命令行；
- 打破改动：**丢弃 JDK 7 支持**。

**v4.2**：默认栈行走模式从 FP 换成 VM Structs。这条改动理论上应该发头条——它把 async-profiler 从「依赖 AGCT 的采样器」重新定位成「独立于 AGCT 的采样器」。

## 九、和 JFR / perf / VisualVM 的真实边界

| 工具 | 定位 | 强项 | 局限 |
|------|------|------|------|
| **async-profiler** | Java 采样式 profiler | 混合栈（Java+JVM+kernel）、alloc/lock/nativemem/wall 多事件、Flamegraph/Heatmap 交互 | 需要装 native agent、macOS 上采不了内核栈 |
| **JFR** | JVM 内置事件记录 | 官方内置、开销极低、事件语义丰富、生产长期开着都行 | 采样式 profile 精度不如 async-profiler、可视化工具生态零散 |
| **Linux perf** | 系统级采样 profiler | 全系统视野、硬件计数器最全、支持所有语言 | Java 栈解析要额外的 perf-map-agent，不认 JIT 方法 |
| **VisualVM / JMC** | 桌面 GUI | 图形化好、可以看线程/GC/heap 全景 | JVMTI 采样有 safepoint bias、GUI attach 不适合无头生产 |

**决策规则**：
- **热点问题排障** → async-profiler，因为混合栈 + 无 safepoint bias 是核心武器；
- **生产长期观测 / continuous profiling** → JFR + async-profiler 双开（async-profiler 4.3 后可以输出 Prometheus 格式）；
- **跨语言 / 内核视角** → perf，但要接受 Java 栈需要 perf-map-agent 或直接用 async-profiler 的 perf collapse 输出；
- **开发本地 GUI** → JMC 看 JFR 文件。

async-profiler 和 JFR **不是替代关系**，它们能配合——async-profiler 可以采 JFR 兼容格式（`.jfr` 结尾），JMC 直接打开就能可视化。

## 十、几个非显然的工程决策

**1. `AsyncGetCallTrace`-then-VMStructs 的演进**。项目名字来自 AGCT，但 v4.2 之后默认已经不走 AGCT 了。这条路径花了差不多七八年——从 `safemode` bit-mask（用来关掉某些 recovery 尝试）到 `--cstack vm` 到 v4.2 默认 vm。这种「从依赖非官方 API 到自建 walker」的迁移，是我在长期开源项目里看到过最典型的一次「基础设施重写」。

**2. 一个二进制打天下**。`asprof` 只是一个前端 launcher，真正的 agent 是 `libasyncProfiler.so`。可以三种方式载入：
   - `asprof` 通过 JVM Attach API 后 attach；
   - `-agentpath:` JVM 启动参数；
   - `LD_PRELOAD` 载入到**非 Java 进程**（v3+ 加的能力，配合 `ASPROF_COMMAND` 环境变量控制）。

**3. JFR 作为一等输出格式**。所有多事件、continuous profiling、后置分析都走 JFR。项目里 `src/converter/` 有一整套 JFR 读取/转换工具（`jfrconv`），可以把 JFR 转成火焰图、heatmap、collapsed stacks、OTLP（v3.2 加的，供应链兼容 OpenTelemetry Profiling）、pprof 等格式。这条设计让 async-profiler 变成了「采样器 + 转换器」双层架构，采样器专注低开销，可视化交给 JFR 生态。

**4. 崩溃保护是 first-class 设计**。VM Structs 栈行走用 `setjmp/longjmp` 包了一层，任何指针 dereference 出问题时能 longjmp 回来。这是给「在信号处理器里跑复杂代码」这种极端场景兜底——一次错误的 unwind 不能拖垮整个 JVM。

## 十一、边界：谁应该现在装，谁再等一等

**现在就装的：**

- **生产 Java 服务遇到 CPU / GC / 锁问题的所有场景**。asprof 的开箱能力和输出可读性，在同类工具里几乎没有对手。
- **在容器里跑 Java 的团队**。ctimer fallback + JFR 输出 + Prometheus metrics 让它在 K8s 里也很好用。
- **做性能持续观测的团队**。v4.3+ 的 Prometheus 输出 + `--loop` 连续 profile + JFR 生态足够搭一套 continuous profiling pipeline。
- **写 native / JNI 库、混合语言 Java 项目的团队**。nativemem 泄漏检测 + native lock profiling 是这个场景的稀缺品。

**再等一等的：**

- **纯 Windows 用户**。async-profiler 只支持 Linux / macOS，Windows 上没有对应实现。
- **不想装 native agent 的合规敏感团队**。这个工具是 native `.so`，需要接受它作为 agent 加载到 JVM。合规敏感场景可以用 JFR 替代（虽然精度差一档）。
- **JDK 7 及更老版本**。v4.3 已经丢了 JDK 7 支持，v4.4 要求 JDK 11+ 编译。

## 我改了哪个认知

**「采样式 profiler」和「采样式 profiler」不是同一件事**。

同样叫 sampling profiler，走 JVMTI + safepoint 的和走 signal + AGCT/VMStructs 的，是**两套完全不同的物理机制**。前者永远看不见 counted loop 里的热点，后者可以。这个差别在教科书上被一句话带过，但在生产环境是「你到底能不能定位到那个真正在烧 CPU 的方法」的区别。

**profiler 的下一战是 continuous profiling + differential view**。async-profiler v4.4 的 differential flame graph、v4.3 的 Prometheus 输出、v4.3 的 wall/cpu latency filter，都在往同一个方向走——**profiler 不再是「排障时 attach 一下」的工具，而是「一直在跑、每次上线自动对比」的基础设施**。Datadog / Pyroscope / Grafana Phlare 都是这条路，async-profiler 是提供采样能力的「底层输入源」。

## 十二、命令清单（可收藏）

```bash
# ==== 下载 ====
wget https://github.com/async-profiler/async-profiler/releases/download/v4.4/async-profiler-4.4-linux-x64.tar.gz
tar xf async-profiler-4.4-linux-x64.tar.gz && cd async-profiler-4.4-linux-x64

# ==== 采样 ====
./bin/asprof -d 30 -f cpu.html <PID>                                    # CPU flamegraph
./bin/asprof -d 30 -e alloc --alloc 500k -f alloc.html <PID>            # 分配
./bin/asprof -d 30 -e lock --lock 5ms -t -f lock.html <PID>              # Java 锁
./bin/asprof -d 30 --nativelock 5ms -t -f nlock.html <PID>               # Native 锁
./bin/asprof -d 30 -e wall -t -i 50ms -f wall.html <PID>                 # Wall clock
./bin/asprof -d 60 -e cpu --alloc 2m --lock 10ms -f prod.jfr <PID>       # 多事件 JFR
./bin/asprof --all -f all.jfr <PID>                                      # 一键全采（不建议生产）
./bin/asprof --loop 1h -f /var/log/profile-%t.jfr <PID>                  # continuous

# ==== 后处理 ====
./bin/jfrconv prod.jfr cpu.html                                          # CPU 视图
./bin/jfrconv --alloc prod.jfr alloc.html                                # alloc 视图
./bin/jfrconv --lock prod.jfr lock.html                                  # lock 视图
./bin/jfrconv --total --nativemem --leak app.jfr leak.html               # nativemem leak
./bin/jfrconv --diff before.jfr after.jfr diff.html                      # 优化前后对比
./bin/jfrconv --output heatmap prod.jfr heat.html                         # 时间轴 heatmap

# ==== JVM 启动侧加载（相对于 attach 更稳）====
java -agentpath:/opt/async-profiler/lib/libasyncProfiler.so=start,event=cpu,file=profile.jfr -jar app.jar

# ==== LD_PRELOAD 玩非 Java 进程 ====
LD_PRELOAD=/opt/async-profiler/lib/libasyncProfiler.so \
  ASPROF_COMMAND=start,nativemem,cstack=dwarf,file=/tmp/native-%t.jfr \
  ./your-native-binary
```

## 参考

- 项目地址：<https://github.com/async-profiler/async-profiler>
- v4.4 release：<https://github.com/async-profiler/async-profiler/releases/tag/v4.4>
- Getting Started：<https://github.com/async-profiler/async-profiler/blob/master/docs/GettingStarted.md>
- CPU Sampling Engines：<https://github.com/async-profiler/async-profiler/blob/master/docs/CpuSamplingEngines.md>
- Stack Walking Modes：<https://github.com/async-profiler/async-profiler/blob/master/docs/StackWalkingModes.md>
- Nitsan Wakart 的 safepoint bias 论述：<http://psy-lob-saw.blogspot.ru/2016/02/why-most-sampling-java-profilers-are.html>
- 官方 3 小时视频播放列表：<https://www.youtube.com/playlist?list=PLNCLTEx3B8h4Yo_WvKWdLvI9mj1XpTKBr>
- 许可证：Apache-2.0
