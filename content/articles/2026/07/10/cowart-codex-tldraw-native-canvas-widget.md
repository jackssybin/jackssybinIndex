---
title: "Cowart 教程：把 tldraw 无限画布焊进 Codex 的原生 widget 插件"
url: "/articles/2026/07/10/cowart-codex-tldraw-native-canvas-widget/"
date: "2026-07-10T10:00:00+08:00"
lastmod: "2026-07-10T10:00:00+08:00"
description: "zhongerxin/Cowart 用一个 Codex plugin + 8 个 MCP 工具 + 3 个 skill，把 tldraw 无限画布焊进 Codex 原生 widget：画布数据落在用户项目目录，AI 图片框成为「尺寸契约」，标注截图直接进入返修循环。本文拆插件骨架、拆 frame holder 的三个坐标属性、拆 canvas/pages/<id> 的存储布局，附五分钟上手清单和三条改造思路。"
tags: ["Codex", "tldraw", "MCP", "AI 画布", "开源项目"]
topic: "AI 工作流"
topicSlug: "ai-workflow"
layout: article
contentType: article
---

![Cowart 封面](/images/cowart-codex-tldraw-native-canvas-widget/cover-zhihu.png)

# Cowart 教程：把 tldraw 无限画布焊进 Codex 的原生 widget 插件

我用 Codex 已经有一阵子，最烦的一件事一直没解决：**画图这一步永远断在别处**。想让 AI 顺着一张草图改，就得先把草图从别处贴过来；想让 AI 沿着我的箭头改图，就得先把带箭头的截图放到某个云盘，再把链接甩回对话；想让 AI 在同一块画布里连续迭代十几张图，就得在 Codex、Figma、tldraw 网页版、`~/Downloads` 之间反复穿梭。AI 会画画，但不会跟我坐在同一块桌子上。

前几天翻到 [`zhongerxin/Cowart`](https://github.com/zhongerxin/Cowart) —— 一个 Codex 原生插件，直接把 [tldraw](https://github.com/tldraw/tldraw) 的无限画布做成 Codex 内置 widget。画完读源码，我意识到它值得单独写一篇：它不只是「Codex + 画布」，而是**把画布提炼成一份可协商的尺寸契约**，让 AI 生成图能直接对齐我在画布上圈出来的框；它也不只是「支持标注」，而是**把标注截图当成一份完整的返修 brief**，让 AI 在原图旁边生成干净的新图，原图和标注一根不动。

这两个设计一旦搭在一起，Codex 会从「聊天里出图片」变成「桌面上出图片」。这篇文章把它拆成三层：

1. 插件骨架：`.codex-plugin/plugin.json` + 3 个 skill + 8 个 MCP 工具，画布怎么就成了原生 widget；
2. 尺寸契约：`AI 图片` frame holder 的 `props.w/h/x/y/rotation` 如何变成一份对生成模型的强约束；
3. 返修循环：`get_cowart_selection` + 标注截图如何构成「同一块画布上的对照实验」。

最后附一份 5 分钟上手清单、一份存储/环境变量速查表，以及三条我最想改造它的方向。

![在 Codex 中打开 Cowart 画布](/images/cowart-codex-tldraw-native-canvas-widget/open-canvas.png)

## 一、插件骨架：一份 plugin.json + 3 个 skill + 8 个 MCP 工具

Cowart 的仓库不大，34 个源码文件，但结构非常规整。全部对齐到 Codex plugin 的目录约定。

先看 `.codex-plugin/plugin.json`。它把插件注册成 Codex marketplace 里的一个条目，声明 skill 目录、MCP 服务、品牌色、logo、能力标签和三条默认 prompt：

```json
{
  "name": "cowart",
  "version": "0.1.11",
  "skills": "./skills/",
  "mcpServers": "./.mcp.json",
  "interface": {
    "displayName": "Cowart",
    "brandColor": "#25BFEF",
    "capabilities": [
      "Interactive canvas",
      "Native Codex widget",
      "AI image generation",
      "Annotation-driven editing",
      "Project-local persistence"
    ],
    "defaultPrompt": [
      "Open the Cowart canvas for this project.",
      "Use my Cowart annotation screenshot to generate a clean revised image beside the original.",
      "Generate a new image into the selected Cowart AI image holder."
    ]
  }
}
```

三条 `defaultPrompt` 就是插件全部对外接口的**用户视角**：开画布、按截图返修、把生成图放进选中的 AI 图片框。这一层写得像给用户看的说明书，而不是给 CI 看的元数据 —— 值得抄。

再往里看 `skills/`：

```
skills/cowart-open-canvas/SKILL.md         # 只做一件事：调 render_cowart_canvas_widget
skills/cowart-image-gen/SKILL.md           # 生成 + 替换选中的 AI 图片框
skills/cowart-image-edit/SKILL.md          # 用标注截图返修，图放在原图旁
```

每个 skill 一份 SKILL.md，明确写出「什么时候用、按什么顺序调用哪些 MCP 工具、失败时怎么退化」。三份加起来才 300 多行，但对 Codex 来说是可执行剧本；随手翻 `cowart-image-gen/SKILL.md` 就能看到这种「操作型 skill」的样子——比如它规定：

> 如果选中的形状带 `meta.cowartAiImageHolder: true`，就把它的 `props.w/h`、`x/y`、`rotation` 当作生成图的尺寸契约；生成完调 `insert_cowart_image` 时把 holder 的 id 传成 `anchorShapeId`，MCP 层会把旧 holder 干掉、把新图钉在同一个位置。

这句话就是这个插件全部性价比的来源，后面会展开。

MCP 服务在 `mcp/server.mjs`，一共暴露 8 个工具，全部走 stdio：

| Tool | 用途 |
| --- | --- |
| `render_cowart_canvas_widget` | 把画布作为原生 widget 打开，返回 `ui://widget/cowart/canvas.html` |
| `get_cowart_canvas_state` | 读取当前项目的 tldraw 快照 |
| `save_cowart_canvas_state` | 写回整份快照（少用，只在必须重写整块画布时） |
| `save_cowart_selection_state` | 同步选中集合 |
| `save_cowart_view_state` | 同步视口位置 |
| `get_cowart_selection` | 读取当前选中的形状及其元数据 |
| `insert_cowart_image` | 把生成好的 PNG 插入画布，可选替换 AI 图片框 |
| `save_cowart_reference_image` / `read_cowart_page_asset` | 参考图的写入 / 读取 |

值得单挑出来夸的是 `insert_cowart_image`。SKILL 明确要求「不要手写 tldraw 的 asset/shape 记录，也不要自己算 fractional index」，一律交给这个工具。tldraw 内部形状用 fractional indexing 决定叠放次序，手动生成极容易踩到重复 key —— 把这个坑封装在 MCP 一次，三种 skill 都能白嫖。

## 二、尺寸契约：把 `AI 图片` 框做成一份可协商的规格

多数「AI 画布」产品在这一步是含糊的：你说画一张、它就画一张，尺寸多大、放哪里、要不要覆盖原图，都得你二次交代。Cowart 换了个思路 —— **把画布上的 frame 当尺寸契约来用**。

在 `src/App.jsx` 里，`AI 图片` 框是一个自定义的 tldraw `frame` shape：

```js
// src/App.jsx，节选
{
  type: 'frame',
  meta: {
    cowartAiImageHolder: true,
    cowartAiImageHolderVersion: 1
  }
}

function isAiImageHolderShape(shape) {
  return shape?.type === 'frame' && shape.meta?.cowartAiImageHolder === true
}
```

Cowart 会挂一个「AI 图片 · 生成面板」在这个 frame 上，里面允许你选 `1:1 / 3:2 / 2:3 / 4:3 / 3:4 / 16:9 / 9:16`，写 prompt，选参考图，然后一按发送。

发送时发生了什么？看 `skills/cowart-image-gen/SKILL.md` 的关键三行：

```
targetWidth       = holder.props.w
targetHeight      = holder.props.h
targetAspectRatio = 化简过的 w:h + 十进制 w/h
```

这三个数字随 prompt 一起送到 Codex 的图像生成流水线。Skill 里明说：**如果生成模型支持 size / aspect ratio 参数，把这三个值传进去；哪怕只支持文本 prompt，也要把这三个值写进 prompt 文字里**。

生成完再往回落地，Skill 又给了一份「替换契约」：

```
新 image shape 的 parentId / x / y / rotation / props.w / props.h
必须和原 holder 完全一致。
```

于是最终画布上不是「AI 图片框里塞了一张图」，而是「一张普通的 tldraw image shape 出现在原来 holder 所在的坐标里」。这非常关键：如果保留了 holder 外壳，第二次 drag、resize、group 的行为就要处理容器；直接换成 image shape，后续操作跟画布上任何图片一样，没有额外心智负担。

![使用 Cowart 生成并插入新图](/images/cowart-codex-tldraw-native-canvas-widget/generate-image.png)

再看 `cowart-image-gen` 一个非常克制的设计选择：**没选中任何 holder 也照样生成**。SKILL 明确写：「不要因为用户没选中框就拒绝生成，退化成 standalone workflow，把结果作为普通 image 插到当前页面。」这一句话把整个插件的可用性拔高一个档 —— 它不强迫你先摆一个「AI 图片」框才能画图，只是**在你愿意摆的时候，帮你把生成图对齐到这个框**。

对比一下典型的旧认知 vs 新认知：

- 旧认知：AI 画布 = 一个装 AI 的画板。你要告诉 AI 「画多大、放哪里」。
- 新认知：AI 画布 = 一份 AI 和你共享的坐标系。你在坐标系里圈出一个空槽，AI 就在这个空槽里落地。

## 三、返修循环：把标注截图当作完整的 edit brief

「按标注修改」是 Cowart 我最喜欢的部分。多数 AI 画布对这件事的处理是「让你在 UI 里做原生 mask / brush，然后传给 inpainting 模型」——门槛高，实现难，且很难跨模型。

Cowart 干脆偷懒了一步，然后偷得非常聪明：

1. 你在画布上对一张图用箭头 + 文字打标注。
2. 选中带标注的图，点「按标注修改」。
3. Cowart 把「原图 + 箭头 + 标注文字」整块导出成一张 PNG，通过 widget bridge 递给 Codex。
4. Codex 读这张 PNG，把箭头和文字当成编辑指令，生成一张干净的新图（去掉红色箭头、去掉批注、只保留最终结果）。
5. `insert_cowart_image` 把新图**放在原图右边** 40 canvas 单位，保留原图和批注一根不动。

![根据 Cowart 标注截图生成修订图](/images/cowart-codex-tldraw-native-canvas-widget/annotation-edit.png)

技术上这就绕开了原生 mask 的所有坑（tldraw 内嵌像素级编辑、跨模型 API 差异），只需要一个能理解「视觉指令 + 文字指令」的多模态模型即可。

但真正巧妙的是三条 guardrail：

- **绝对不能把新图放进原来的 `AI 图片` frame 里**。放进去容易盖掉旧图，破坏 before/after 对照。
- **绝对不能自动扫描整块画布来推理编辑意图**。一块画布上可能有几十张图带不同的批注，只用用户主动提供的截图。
- **绝对不删、不动、不隐藏批注 shape**。批注就是 brief，改完之后你回头还要能看 brief。

这三条写在 `cowart-image-edit/SKILL.md` 里，读起来像一个成熟工程师留给下一个工程师的告诫。它保证了这个功能**默认是可对照的**：改完还看得见你要求过什么、AI 交付了什么。这就是「同一块画布 vs. 聊天记录里翻改稿」最大的区别。

`get_cowart_selection` 在这条链路里也很关键。SKILL 允许 Codex 自动挑一个锚点：

- 用户明确选中原图 → 用它当锚。
- 用户明确选中 `AI 图片` frame → 用 frame 当锚。
- 用户没选、但截图能唯一匹配到一个 shape → 也用它当锚。
- 匹配不到 → 老实回来问用户。

这就是一个成熟的 fallback ladder：**能自动就自动，不能自动就求助，不猜错方向**。多数「AI 助手代替我点鼠标」的插件写不了这条阶梯，因为写完发现总有一步猜错。Cowart 把「猜错」定义成「有明显歧义时停下问一次」——这是它比同类插件更可用的核心原因之一。

## 四、存储契约：画布数据落在你的项目目录，不落在插件仓库

Cowart 有另一个非常克制的选择：**画布不落到插件安装目录，而落到你当前 Codex 项目目录**。

`mcp/lib/canvas-storage.mjs` 是这块的实现。默认路径：

```
$COWART_PROJECT_DIR/canvas/pages/<page-id-without-page-prefix>/
├── cowart-canvas.json      # 该 page 的 tldraw 快照
└── assets/                 # 该 page 的图片、参考图、生成图
```

几个含义：

- **同一个项目的画布跟着项目走**。你 git clone 到另一台机器，画布还在（如果你选择把 `canvas/` 提交进 git 的话）。
- **不同项目的画布互相隔离**。不会出现「A 项目的草图混进 B 项目 Codex 上下文」。
- **一切资源相对项目根**。截图、参考图都放在 `assets/`，URL 用 `/page-assets/<page-dir>/<file>` 这种相对形式，插件搬家不会崩链接。

对比一下常见的 Codex plugin 存储方式：

| 存储位置 | 优点 | 缺点 |
| --- | --- | --- |
| 插件安装目录（大多数插件默认） | 简单 | 卸载/重装丢数据；多项目相互污染 |
| 用户 home 全局目录 | 全局可用 | 项目间隔离要靠命名；不便随项目提交 |
| **当前项目目录（Cowart 选择）** | 数据跟项目走；可 git；可跨机 | 用户要显式指定 `projectDir` |

Cowart 选了第三种，代价是每次调 MCP 工具都必须传 `projectDir`。三个 skill 全都在文档第一段就强调「Pass the user's active Codex workspace as `projectDir`; do not pass the Cowart plugin repository directory」——这是他们踩过坑之后加的告示，也是我推荐你安装完立刻记住的一句话。

如果你要临时改路径，可以用两个环境变量：

- `COWART_PROJECT_DIR`：画布数据所属的用户项目目录。
- `COWART_CANVAS_DIR`：画布数据目录，默认是 `$COWART_PROJECT_DIR/canvas`。

## 五、五分钟上手清单

我把 README 里散落在多处的安装步骤压成一份可复制的 5 分钟清单。

**Step 1. 让 Codex 自动装（最省事）**

直接把下面这段发给 Codex：

```text
请从 https://github.com/zhongerxin/cowart.git 安装 Cowart Codex 插件。
请 clone 仓库到 ~/plugins/cowart，确认 .codex-plugin/plugin.json 存在，
把插件加入 personal marketplace，先运行 codex plugin marketplace add ~，
再运行 codex plugin add cowart@personal。
安装后请校验插件，并告诉我是否需要开启一个新对话来加载新技能和 MCP 工具。
```

**Step 2. 或者手动装（推荐给写博客/做 demo 的人）**

```bash
mkdir -p ~/plugins
git clone https://github.com/zhongerxin/cowart.git ~/plugins/cowart
cd ~/plugins/cowart
npm install
npm run build
```

然后确保 `~/.agents/plugins/marketplace.json` 里有：

```json
{
  "name": "personal",
  "interface": { "displayName": "Personal" },
  "plugins": [{
    "name": "cowart",
    "source": { "source": "local", "path": "./plugins/cowart" },
    "policy": {
      "installation": "AVAILABLE",
      "authentication": "ON_INSTALL"
    },
    "category": "Productivity"
  }]
}
```

再注册 marketplace 并安装：

```bash
codex plugin marketplace add ~
codex plugin add cowart@personal
```

装完记得**开一个新的 Codex 对话**，让新的 skill 和 MCP 工具全部加载。

**Step 3. 打开画布，验证一遍**

在新的 Codex 对话里说：

```text
Open the Cowart canvas for this project.
```

Cowart 会通过 `render_cowart_canvas_widget` 打开原生 widget，不需要你去开本地网页或 in-app browser。首屏出画布后，随手拉一个 `AI 图片` 框、写句 prompt、按发送——看 Codex 是不是把生成图钉在了 frame 的原位。

**Step 4. 一次「按标注修改」体验**

- 在画布上贴一张图（甚至截屏塞进去）。
- 拿箭头工具指到某个位置，加一段文字比如「改成侧脸 / 换深色背景 / 去掉水杯」。
- 选中这张图，点 `按标注修改`。
- 十几秒后，一张干净的返修图出现在原图右边，原图和标注一根不动。

## 六、本地开发者的速查表

如果你要 hack 这个插件（我强烈建议你至少 clone 下来通读一遍 `mcp/server.mjs`），几个入口：

```bash
npm install
npm run dev        # 本地起 Vite，方便直接调 UI
npm run build      # 生产 build
npm run probe:mcp  # 探针脚本，验证 8 个工具可用
npm run quality    # check + build + probe，一键回归
```

本地服务的 fallback：

```bash
./scripts/start-canvas.sh /path/to/user/project
```

常用环境变量：

| 变量 | 默认 | 用途 |
| --- | --- | --- |
| `COWART_PORT` | `43217` | 本地服务端口 |
| `COWART_PROJECT_DIR` | — | 画布数据所属的用户项目目录 |
| `COWART_CANVAS_DIR` | `$COWART_PROJECT_DIR/canvas` | 画布数据目录 |

如果 MCP 工具在 Codex 里没显示出来，先 `npm run probe:mcp` 跑一次；工具全绿再回到 Codex 开新对话。

## 七、我最想改造它的三个方向

Cowart 现在的形态非常克制，但也留下了一些扩展空间：

1. **把「多次返修」串成一条 lineage**。目前 `cowartGeneratedFromAnnotationEdit / cowartAnnotationSourceShapeId` 已经在 shape meta 里记录，缺一个 Codex 视角的「同一张图的全部返修」查询能力。加一个 MCP `get_cowart_shape_lineage`，允许 skill 回读某张图的所有前后版本。
2. **让 AI 图片框支持「批处理」**。现在选中一个 holder 生成一张。允许一次选多个 holder + 一份共同 prompt，比如做一组 4 张同角色不同表情。SKILL 里加一段「多 holder 批处理契约」，MCP 里加 `insert_cowart_images` 复数版本。
3. **和「skill 图谱」联动**。Cowart 已经把画布作为一等公民存进项目目录，天然可以画流程图 / 架构图。给 Codex 加一条 skill：从项目里的 SKILL.md / 依赖图自动生成一张可编辑的初始 tldraw 布局，落到 `canvas/pages/skills/`。

这三条都不用改核心：8 个 MCP 工具已经够用，只是加新工具和新 skill。这也是 Cowart 骨架的价值 —— 它没有替你写完一切，它把画布做成 Codex 里的通用底座。

## 八、值得看 / 不建议看 的三条判断

**值得看**：

- 你已经在用 Codex，且日常绕不开图像/草图/白板/标注。
- 你想学「怎么写一个不烂的 Codex plugin」，因为 Cowart 是我目前见到的最规整的模板之一（`.codex-plugin/plugin.json`、`skills/`、`mcp/server.mjs`、`scripts/` 划得很清楚）。
- 你需要一份跨机、可 git、可对照的 AI 画布数据结构。

**不建议看**：

- 你不使用 Codex，只是想找一个网页版 tldraw 增强 —— 那你要的是 tldraw 本体。
- 你希望 AI 「一键无脑改图」，不想在画布上做任何操作 —— Cowart 的门槛是你得学会 tldraw 的箭头、frame 和选择工具。
- 你想要「多用户协作画布」—— 目前 Cowart 是单用户 + 项目本地，协作不在设计目标里。

## 结尾

我给这个仓库的评价是：**它没做「AI 画布 SaaS」的事，做了「让 AI 和你共享一块画布」的事**。这两件事看起来一样，做出来的产品和取舍完全不一样。

如果你已经在用 Codex，装完之后打开你手上的项目，问自己一个问题：「我最近哪次卡在图上，是因为 AI 不知道尺寸、不知道位置、看不到我的箭头？」大概率能立刻想起两三次。把 Cowart 塞进去之后，那三次会变成一次两次 —— 不是变魔术，是画桌大了两倍。

仓库：<https://github.com/zhongerxin/Cowart>
