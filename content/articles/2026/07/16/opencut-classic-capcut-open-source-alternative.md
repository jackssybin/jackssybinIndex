---
title: "71.9k star 的 CapCut 开源替代被推倒重写：你现在还能用的，只有那个 archived 分支"
url: "/articles/2026/07/16/opencut-classic-capcut-open-source-alternative/"
date: "2026-07-16T10:00:00+08:00"
lastmod: "2026-07-16T10:00:00+08:00"
description: "opencut-app/opencut 是 GitHub 上 71.9k star 的 CapCut 开源替代，2026 年被作者从头重写，主仓库当前是空 scaffold。这篇讲清楚：能用的版本在 opencut-classic（已 archived），怎么本地跑通，rewrite 到底动了哪些结构，以及什么时候应该切到新版。"
tags: ["视频编辑", "开源", "CapCut", "Rust", "WASM", "Next.js"]
topic: "开源工具"
topicSlug: "open-source-tools"
layout: article
contentType: article
---

![OpenCut classic 封面](/images/opencut-classic-capcut-open-source-alternative/cover-zhihu.png)

上周有朋友让我推荐一个能替代 CapCut 的开源工具——他不想再把家庭视频上传给字节的服务器做剪辑。我第一反应是 `opencut-app/opencut`，GitHub 上 71.9k star，README 顶上写着 "A free and open source video editor"，看着就是那个答案。

真去 clone 下来才发现问题：主仓库当前只有一个 web scaffold 和一个 Rust 空窗口，跑起来就一句 `hello world!`。README 自己在第一段承认："OpenCut is being rewritten from the ground up... You can still find the previous version at opencut-classic, which is the one to reach for today."

也就是说，你在 GitHub 上看到那个 71.9k star 的项目，**当前是不能用的**。真正能剪视频的版本，在一个刚被拆出去、只有 154 star、且已经 archived 的仓库里。

这篇讲清楚三件事：一，两个仓库分别是什么状态，为什么会分裂；二，`opencut-classic` 本地跑起来的完整命令，5 分钟能开到编辑器界面；三，rewrite 到底动了什么，什么时候应该切过去。

## 两个 OpenCut：一张对照表

先把 GitHub API 返回的事实摆上，避免绕来绕去。

| 维度 | opencut-app/opencut（新版 / rewrite） | opencut-app/opencut-classic |
|---|---|---|
| Star 数 | 71,933 | 154 |
| 状态 | 活跃开发，主分支 main | **archived**，只读 |
| 最后 push | 2026-07-10 | 2026-05-17 |
| 前端 | TanStack Start（Vite）+ shadcn | Next.js 16 + shadcn |
| 桌面 | Rust + GPUI（空窗口 scaffold） | Rust + GPUI（同上，进行中） |
| API | Elysia on Cloudflare Workers | Next.js Route Handlers |
| 编辑器 UI | 无（`/` 只显示 `hello world!`） | **完整**：Timeline、Preview、Effects、Export |
| 依赖复杂度 | bun + proto + moon | bun + Docker Compose |
| 想动手做视频 | 别用 | 用它 |
| 想追架构演化 | 关注它 | 参考起点 |

Star 数的分裂是最直觉迷惑人的地方：71.9k 的历史 star 留在了「新版」仓库名下（因为 rewrite 是就地推倒，不是新建 repo），而真正能跑的代码被剥离到 classic 后重新计数。所以你搜「OpenCut」看到的那个热门 repo，就是那个空壳。

结论直接给：**如果你今天就想在本机剪一段视频，clone `opencut-classic`**。追新版的动机应该是「我关心它 rewrite 之后架构长什么样」，不是「我想装个工具」。

## opencut-classic 5 分钟跑通

前提：本机已装 [Bun](https://bun.sh) 和 Docker。没装 Bun 就一条 `curl -fsSL https://bun.sh/install | bash`。

```sh
git clone --depth 1 https://github.com/opencut-app/opencut-classic.git
cd opencut-classic

# 环境变量：默认值配合 docker-compose 直接能用
cp apps/web/.env.example apps/web/.env.local

# 数据库 + Redis + serverless-redis-http（Upstash 本地兼容层）
docker compose up -d db redis serverless-redis-http

# 装依赖 + 跑前端
bun install
bun dev:web
```

打开 [http://localhost:3000](http://localhost:3000)。第一次点 "New project" 会调 `/api/auth`（better-auth）建一个本地账号，然后跳进编辑器。到这一步你就有一个可以拖时间线、加剪辑点、加特效、导出的浏览器视频编辑器。

想直接跑生产构建（跳过开发模式），用它自带的 Docker Compose：

```sh
docker compose up -d
```

这一版把 web 也打成镜像，访问 [http://localhost:3100](http://localhost:3100)。适合放在一台家庭服务器上给自己用。

**几个第一次跑会踩的坑：**

- `docker-compose.yml` 里 `serverless-redis-http` 用的是 `hiett/serverless-redis-http`——它本地模拟 Upstash Redis 的 REST 接口，是 better-auth 的 rate-limit 需要的。少了这个容器登录会 500。
- `.env.example` 里的 `FREESOUND_CLIENT_ID` / `FREESOUND_API_KEY` 是可选的，只影响音效搜索面板。不填就是空搜索结果，不影响主流程。
- Node 版本不重要，因为 `packageManager` 写死 `bun@1.2.18`，全流程都走 bun。不要用 npm/pnpm 装依赖，会因为 workspace 依赖解析差异卡住。

## Rewrite 到底动了什么

看 `opencut-classic` 的目录结构，能看出作者两个明确的判断。这两个判断决定了他为什么要推倒重写。

### 判断一：把业务逻辑从 TypeScript 迁到 Rust

classic 版本已经开工了这件事。仓库根有一个 `rust/` 目录：

```
rust/
├── crates/
│   ├── bridge/       # #[export] 宏，同一函数同时给 WASM 和桌面用
│   ├── compositor/   # GPU 合成层调度
│   ├── effects/      # GPU 特效管线
│   ├── gpu/          # wgpu 抽象、shader registry、WGSL 着色器
│   ├── masks/        # 蒙版 + signed-distance-field
│   └── time/         # MediaTime i64 tick 类型
└── wasm/             # 打包给 apps/web 用的 npm 包 opencut-wasm
```

`AGENTS.md` 里作者写得直白：*"An ongoing migration is moving all business logic into rust/. Each app under apps/ is a UI shell — it owns rendering, interaction, and platform-specific concerns, but never owns logic."*

翻成人话：他不想让 web、desktop 两套 UI 各自维护一份剪辑数据模型和渲染逻辑。所有跟"这一帧应该显示什么"有关的计算，全部下沉到 Rust；上层 UI 只负责画和响应鼠标。

举一个能验证这件事的具体例子。`apps/web/src/wasm/media-time.ts` 里定义了一个 `MediaTime` 类型：

```typescript
export type MediaTime = number & { readonly __mediaTime: unique symbol };

export const TICKS_PER_SECOND = _TICKS_PER_SECOND();

export function roundMediaTime({ time }: { time: number }): MediaTime {
    const roundedMagnitude = Math.round(Math.abs(time));
    // ...
    return requireMediaTime({ value: /* ... */ });
}
```

这个类型不是 TypeScript 里的自娱自乐——它对应的是 `rust/crates/time/src/media_time.rs` 里的 `MediaTime(i64)`。JS 侧只是拿到一个 number，但 TS 用 brand 类型强制你必须走 `roundMediaTime` 才能构造。原因是 tsify 把 Rust 的 tuple struct 压平成 `number`，JS 一不小心塞进去一个 `1.5` 就把 tick 精度污染了。

同一逻辑，Rust 侧是权威定义，TS 侧只是把 wasm 的 export 用 brand 类型再护一层。这种"权威在 Rust、UI 是壳"的设计，就是 rewrite 要更彻底贯彻的东西。

### 判断二：Effects 系统数据 + 渲染分离

`docs/effects-renderer.md` 里明确写了新增一个特效的流程：TS 侧只写一个 `EffectDefinition`，指明这个特效用哪个 shader、传哪些 uniform，甚至可以动态生成多 pass；Rust 侧把 shader identifier 映射到预编译的 WGSL pipeline。

看 `apps/web/src/effects/definitions/blur.ts`：

```typescript
export function buildGaussianBlurPasses({
    sigmaX,
    sigmaY,
}: { sigmaX: number; sigmaY: number }): EffectPass[] {
    const iterations = Math.min(
        MAX_ITERATIONS,
        Math.max(1, Math.ceil((maxSigma * maxSigma) / (MAX_EFFECTIVE_SIGMA * MAX_EFFECTIVE_SIGMA))),
    );
    // ...根据 sigma 大小动态决定 pass 数量
    const passes: EffectPass[] = [];
    for (let i = 0; i < iterations; i++) {
        passes.push({ shader: GAUSSIAN_BLUR_SHADER, uniforms: { /* horizontal */ } });
        passes.push({ shader: GAUSSIAN_BLUR_SHADER, uniforms: { /* vertical */ } });
    }
    return passes;
}
```

这段代码有意思的地方：**它决定了跑几遍高斯模糊，但它自己不做任何 GPU 调用**。它输出的是一份「pass 清单」，交给 Rust/wgpu 去执行。Sigma 大的时候增加迭代次数，是因为「固定 kernel（±30 样本）在 step=1 时最多覆盖 ±30 texel，sigma 超过 10 就退化成 box filter」——这段注释在源码里，是作者自己撞过的性能墙。

这套「TS 出 recipe、Rust 执行」的分离，是 rewrite 后 rewrite 想做得更漂亮的部分：加插件、多平台、AI agent 调用（README 提到 rewrite 的 MCP server 和 headless mode），都得靠这一层。

### 判断三：Web 和 Desktop 用不同 UI 框架

`apps/web` 是 Next.js（现在锁 v16），`apps/desktop` 是 Rust + GPUI。作者没试图让 desktop 复用 React——他直接判断"UI 框架是可替换细节，业务逻辑不能重复"。

这个判断需要付出的代价，就是**两份 UI 代码要各自写各自维护**。classic 已经在扛这个代价（desktop 目前是空窗口 scaffold）。rewrite 要更进一步：web 从 Next.js 换成 TanStack Start（Vite 底），API 从 Next.js Route Handler 换成 Elysia + Cloudflare Workers。

一句话理解 rewrite 的动因：**把 classic 已经开始的"Rust 是权威、UI 是壳"再彻底一次，同时把 web 层从 Next.js 全家桶换成更薄、更接近浏览器原生的技术栈**。代价是主分支要空好几个月。

## 现阶段该怎么用

给三类读者三种建议，不做一刀切。

**A. 只想要一个不上传视频的本地剪辑器：**

Clone `opencut-classic`，Docker Compose 起数据库和 Redis，`bun dev:web`。基本剪辑、时间线、特效、导出都齐。CapCut 那些「一键生成模板」的 AI 花活它没有——但你要的是**你的视频不用上传**，这件事它做到了。

**B. 想跟进 Rust 视频引擎怎么做：**

同时拉两个仓库。`opencut-classic` 是当前能跑的参考实现，`rust/crates/` 里的 compositor、effects、gpu、masks 都是可以 `cargo test` 的活代码。主仓库 `opencut-app/opencut` 关注 rewrite 的 issue 和 discussion 就好，代码还没到值得逐行读的阶段。

**C. 想给它贡献代码：**

只有一个入口——`opencut-app/opencut`（新版）。classic 已经 archived，PR 不会被接。但由于 rewrite 还在架构期，README 明说 *"We're not set up to take outside contributions yet while the architecture is being designed."* 想真参与的话，进 Discord 蹲设计讨论比直接 PR 有用。

## 一个可复用的判断清单：什么时候切到新版

作者没给时间表，但源码里有几个信号能观察。看到下面几个信号任一出现，就可以准备切了：

1. **新版仓库 `apps/web/src/routes/` 里出现 `editor` 路由**：目前只有 `index.tsx` 一句 `hello world!`。等他把 timeline / preview / editor 骨架搬过去，就是能开始试用的信号。
2. **新版 `rust/crates/` 目录出现**：目前 Cargo workspace 只有 `apps/desktop` 一个成员。等他把 classic 的 6 个 crate（bridge/compositor/effects/gpu/masks/time）迁过来，说明核心引擎已经具备。
3. **README 的 Status 段落更新**：目前明确写着 rewrite 未完成、请用 classic。等这段被删除或改成 "beta available"，就是主入口切换的官方信号。
4. **`new.opencut.app` 上线并可用**：README 提到这是 rewrite 的暂用域名，opencut.app 主域还跑 classic。域名切换等于宣布 GA。

在这些信号出现之前，都别急着从 classic 迁走。你的项目文件（编辑草稿）目前是 IndexedDB 里的本地数据，classic archived 不代表数据消失——但 rewrite 上线时会不会做迁移工具还是未知数，等等再说。

## 一个诚实的免责段

写完这些还是要说一句：**opencut-classic 不是 CapCut 的 1:1 替代**。CapCut 有的：模板库、AI 抠图、AI 配音、跨设备云同步、字幕自动生成、大量素材库。这些 classic 都没有（AI 字幕的 `apps/web/src/transcription/` 是 stub，需要自己接 API）。

它能替代的是 CapCut 的**核心剪辑体验**：把视频拖进来、加剪辑点、加转场、加特效、导出。如果你剪的是 vlog / 短教程 / 演示视频，它够用。如果你剪的是需要一堆 AI 特效模板的抖音风格短片，先别急着换。

判断标准很简单：**你打开 CapCut 平时用得最多的三个功能是什么？** 全部落在时间线、剪辑、基础特效、导出这几个上，classic 能接住；有一个是 AI 花活，classic 目前接不住。

## 参考文件（都在仓库里可查）

- `README.md` 首段：官方说明当前应该用 classic
- `apps/desktop/README.md`：桌面版三步 setup（Rust + native 依赖 + `cargo run`）
- `docker-compose.yml`：完整的自托管栈，包括 web、db、redis 三个服务
- `AGENTS.md`：作者写给自己/协作者的架构宪法，"Rust 是权威、UI 是壳"就是从这里明确的
- `docs/effects-renderer.md`：特效系统的 TS 编排 + Rust 执行分层
- `docs/keyframes.md`：Keyframe 数据模型、注册表、resolver 三层
- `docs/actions.md`：Action 系统，把键盘快捷键、按钮、菜单绑到编辑器功能
- `notes/primitives-vs-domains.md`：作者对代码结构的自省笔记，能看出他对代码组织的洁癖

## 一句话总结

主仓库那 71.9k star 是历史留下的，rewrite 才刚开始；能剪视频的代码在 `opencut-classic` 里，用它，别去主仓 clone 空壳。
