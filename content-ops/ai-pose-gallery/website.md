---
title: "7869 Star、1.2GB、6011 张本地高清图：我把这个中文 AI 姿势图库克隆下来，逐层拆了它的五位一体架构"
slug: "ai-pose-gallery-zh"
date: 2026-11-23
draft: false
categories: ["开源项目", "AI 绘画"]
tags: ["开源", "AI绘画", "姿势库", "ComfyUI", "ControlNet", "Agent技能", "参考图", "i18n", "Cloudflare", "MIT"]
cover: "/images/ai-pose-gallery-zh/cover-zhihu.png"
description: "anhao/ai-pose-gallery-zh 是一个把日文 AI 绘画参考三站（姿势、服装、人像）汉化并重构的中文三合一工作台，GitHub 7869 Star、2040 Fork，TypeScript 为主、v2.0。本文基于本地真实克隆（不含 .git 约 1.2GB）与逐文件核验，而非照抄 README：实测三大主库 JSON 记录数为姿势 1439、写实服装 1407、人像 1499，另含动漫服装 1320、中国历代服装 57 套/227 视角、二次元 CharaDB 440 套；img 与 thumbs 目录各含 6011 张图，据此指出 README 顶部 12022 张是把缩略图和原图重复相加的口径。文章拆五层架构：静态本地镜像、日译中 i18n 流水线、React19+Vite8 合成台（人像+服装+姿势三槽位、12 画风、IndexedDB 持久化）、五大 AI 图像协议直连加 Cloudflare 同源代理、ComfyUI 原生四节点插件与九个 SKILL.md Agent 技能；代码规模实测 src 67 个 ts/tsx 共 11841 行、插件 1610 行、脚本 1342 行。最后给合规判断：代码 MIT 但图片版权归原作者 ギア 与 たき AI 且不被 MIT 覆盖，默认 SFW 隐藏 NSFW，商用与真人换脸需自行解决授权。"
---

用 AI 画图的人大概都遇到过这个卡点：模型不缺，缺的是**参考图**。你想让角色摆出某个特定姿势、穿上某套衣服、保持一张稳定的脸，光靠文字提示词往往力不从心，得去找人体素体、服装参考、人像图。而这些高质量素材原本散落在三个独立的日文站点上，标签全日文，找到图还要手动下载、再分别喂给不同的生图工具，整条链是断的。

最近 GitHub 上有个项目专门把这件事做成了闭环——[ai-pose-gallery-zh](https://github.com/anhao/ai-pose-gallery-zh)，一个把姿势、服装、人像三个日文参考图库完整汉化、并升级成"AI 角色合成工作台"的中文项目，目前 7869 Star、2040 Fork。我把整个仓库（不含 `.git` 约 1.2GB）克隆到本地逐层拆了一遍，这篇文章不讲宣传话术，只讲我实测核验到的东西：它的真实数据规模、五层架构怎么搭的、三种使用姿势分别适合谁，以及最容易被忽略的版权边界。

## 一、先核验家底：README 的数字有水分，我重新数了一遍

这个项目 README 写得很详尽，但也正因为信息密度高，里面的统计口径需要自己核对。我没有直接引用它顶部的合计数字，而是逐个打开 `data/` 下的 JSON 和图片目录实测。

先说三大主库的记录数，这部分 README 是准确的：`pose-zh.json` 有 **1439** 条姿势，`costume-zh.json` 有 **1407** 条写实服装，`portrait-zh.json` 有 **1499** 位人像。在此之外还有三个补充数据源：动漫服装 `costume-gia-anime-zh` 1320 条、中国历代服装 `costume-shisei-zh` 57 套（合计 227 个视角）、二次元 CharaDB 440 套（与 `charadb/outfits-public` 条数一致）。

![实测数据规模：逐个 JSON 和图片目录核验](/images/ai-pose-gallery-zh/02-data-scale.png)

关键的出入在图片计数。README 顶部宣称本地有 **12022 张高清图**，但我实际数 `img/` 和 `thumbs/` 两个目录，**各是 6011 张**。拆开看：姿势白模 PNG 1439 张、深度图 depth 1439 张、写实服装 1407 张、历代服装 227 个视角、人像 1499 张，加总正好 6011。所谓 12022，其实是把 `img/` 的 6011 张原图和 `thumbs/` 的 6011 张缩略图重复相加了——它们是同一批素材的两种尺寸。所以更准确的口径是：**约 6011 张原图、配套 6011 张缩略图**。引用这个项目的数据时，建议用我这个去重后的数字。

另外两个实测细节：人像图是 `1600×2000` 的全尺寸 WebP，质量不错；而动漫服装和二次元服装这两类，仓库里**只存元数据不存图**，图片走原站热链，这也是它能把体积控制在 1.2GB 的原因之一。

## 二、它到底是什么：不只是图库，而是一个合成工作台

原站是日本作者 ギア（@giaaibusi）发布的三个独立图库，元数据全是日文。这个中文版（v2.0）做的事情，可以概括成"三站合一 + 全量汉化 + 工作台化 + 插件化"四步。理解它的最好方式，是看同一套静态资产是怎么被五个不同的消费端复用的。

![一套静态资产，五个消费端复用的架构](/images/ai-pose-gallery-zh/01-architecture.png)

底层唯一的数据源，是 `data/*.json` 全中文索引加上 `img/`、`thumbs/` 里的本地图片。在这套静态资产之上，长出来五个互不依赖的用法：一个 React 网页合成台、一个 Cloudflare 边缘代理、一个 ComfyUI 原生插件、九个 Agent 技能，以及一个可以整体下载自托管的离线数据集。**这种"一份数据、五端复用"的设计，是整个项目最值得学的地方**，也是它和普通"图片收藏夹"类仓库的本质区别。

## 三、五层架构逐层拆

**第一层，三库四站的全量本地镜像。** 所有图片和 JSON 都在仓库里，纯静态、可离线浏览，也能直接扔到 Cloudflare Pages 这种免费静态托管上。仓库总体积约 1.2GB、约 1.16 万个文件，单文件全部小于 2MB，正好卡在 Cloudflare 免费版"单文件 ≤25MiB、文件数 ≤20000"的限制内——这个尺寸控制明显是对着部署约束做的。

**第二层，日译中的 i18n 流水线。** 这是我认为工程上最聪明的一环。它没有靠人肉逐条翻译，而是用 `scripts/i18n.py` 维护一份日译中词典，配合 `data/translations.csv`（我实测 475 行、约 474 条对照，比如"2人絡み→双人缠绵""上半身1人→上半身单人"），再由 `apply_translation.py` 一键生成所有 `*-zh.json` 纯中文数据。翻译被做成了**可重跑的构建步骤**，而不是一次性的手工活，所以上游原站更新后，重新跑一遍脚本就能再生成，一个人也维护得动 6000 多条数据。

**第三层，React 合成台。** 前端用 React 19 + TypeScript 7 + Vite 8（Rolldown）+ Tailwind 4 + shadcn/ui 搭成，核心是 `/studio` 合成页：人像、服装、姿势三个核心槽位（姿势槽还能在素体白模和深度图之间一键切换），外加任意张自定义附加参考图，支持拖拽、剪贴板 `Cmd/Ctrl+V` 粘贴、URL 添加。它内置 12 种画风预设（写实写真、二次元、新海诚风、3D 手办、赛博朋克等），能根据你选的素材自动组装中英文提示词，再用 Canvas 实时拼成一张 `1800×1200` 的参考拼图导出。生成历史存进浏览器 IndexedDB 而不是 localStorage，规避了后者 5MB 的容量天花板。

**第四层，五大 AI 协议直连加同源代理。** 工作台内置了 Google Gemini、OpenAI GPT Image、阿里通义 Qwen、字节豆包 Seedream、本地 ComfyUI 五条生图通道，每条都对接了各自的多图参考参数。这里有个真实的工程痛点：千问、豆包这类接口直接从浏览器调会有跨域问题，所以项目用 Cloudflare Pages Functions / Workers 写了一个 `/api/proxy` 同源代理（`functions/api/proxy.ts` + `worker.ts`），还带了域名白名单 `PROXY_ALLOWED_ORIGINS` 防止被滥用。

**第五层，ComfyUI 插件和 Agent 技能。** 这是它从"网页工具"进阶成"生产基建"的关键。我读了 `comfyui_plugin/nodes.py` 的源码，确认注册了四个真实节点：`PoseGalleryNode`、`CostumeGalleryNode`、`PortraitGalleryNode`、`CharacterRecipeNode`，能直接在 ComfyUI 画布里输出 IMAGE 张量和中英文 Prompt，姿势节点带 `use_depth` 开关，深度图可以直接接 ControlNet Depth。同时 `skills/` 下有九个 SKILL.md 格式的 Agent 技能（姿势五个、服装三个、人像一个），软链到 `~/.claude/skills` 后，AI Agent 就能按分类、视角、发长检索素材。

代码规模我也实测了：`src/` 下 67 个 ts/tsx 文件共 11841 行，ComfyUI 插件 5 个文件 1610 行，数据脚本 8 个文件 1342 行。这是一个有真实工程体量的项目，不是套壳静态页。

我还顺手看了它的测试和工程化配置。`tests/` 里有 `gpt-input-fidelity.test.mjs` 和 `pixai.test.ts` 两个测试，前者专门校验送给 GPT Image 协议的输入保真度，说明作者对多协议适配不是简单封装了事；仓库用 Oxlint + Oxfmt 做代码规范、tsc 做类型检查，`pnpm build` 会先跑 `tsc -b` 再走 Vite 构建。配套的 `scripts/verify.py` 还能校验本地一万多张图片的存在性、文件大小和文件头，防止镜像下载出现残缺——对这种以数据为核心的仓库，这种完整性校验脚本比业务代码更重要。下载器 `download.py` 支持 `DATASET=all|pose|depth|costume|portrait` 分数据集拉取、断点续传，还能用 `WORKERS=64` 调并发，把 1.2GB 素材的初始化成本降了下来。

## 四、三种使用姿势，按你的工具链选

![同一个仓库的三种上手姿势](/images/ai-pose-gallery-zh/03-three-usage.png)

**最轻量的是网页方式。** 不想折腾就直接打开在线演示（ai-pose-gallery.anhao.app），想本地跑就 `pnpm install && pnpm dev`（需要 Node 20+），浏览器里选图、组配方、选画风、直连生图，零门槛。

**进阶用 ComfyUI 节点。** 把仓库 `git clone` 到 `ComfyUI/custom_nodes/` 目录下，重启 ComfyUI，右键菜单里就会出现"AI角色三合一参考图集"，四个节点可视化弹窗选图，深度图直连 ControlNet，适合需要精确控制工作流的进阶玩家。它不需要额外装 Python 依赖，直接复用 ComfyUI 自带的 torch、numpy、Pillow、aiohttp。

**最自动化的是 Agent 技能。** 把九个 `*-reference` 技能软链进 skills 目录，让 AI 替你检索素材、返回图片路径和中英文描述，适合做批量、自动化的角色生产管线。注意原技能靠相对路径读 `img/`，README 也强调要**软链而不是复制**，并保留整个仓库。

## 五、合规边界：用之前这几条必须清楚

这个项目包含部分 18+ 人体素体和性感穿搭，所以合规设计是它不可分割的一部分，我单独拎出来讲。

![合规边界与适用判断](/images/ai-pose-gallery-zh/04-compliance-verdict.png)

第一，**代码协议和图片版权是两回事**。GitHub 把这个仓库的 license 识别成 NOASSERTION，原因就在这：`src/`、`comfyui_plugin/`、`scripts/` 的代码是 MIT，但 `img/`、`thumbs/`、`data/` 里的图片和原始数据**不被 MIT 覆盖**，版权归原作者 ギア 和 たき AI 所有，仓库明确禁止把图库打包倒卖。

第二，**默认 SFW 安全模式**。成人向分类（全身性感系、双人缠绵、内衣性感穿搭）默认被安全模式隐藏，未成年人被明确要求不得解锁。这是软件层面的开关，不是物理删除，所以使用环境仍需自觉。

第三，**纯前端、不收集数据，但责任在使用者**。所有生图请求都走你自己配置的云端 API 或本机 ComfyUI，平台不存储上传图；但反过来，未经授权用真人照片做换脸/深伪（Deepfake）的法律责任完全由使用者承担。

## 结语：谁该用，谁先缓一缓

如果你是需要稳定、可控、中文参考素材的 AI 绘画创作者，或者在做角色一致性工作流、想把参考图接进 ComfyUI + ControlNet，这个项目几乎是为你准备的；对前端和独立开发者来说，它"静态数据 + 边缘代理 + 本地插件 + Agent 技能"的一体化架构本身就是一份很好的学习样本。

但有两类人要缓一缓：一是介意 1.2GB 克隆体积、只想在线轻量用的人（直接用网页版即可，不必克隆）；二是有明确商业用途的人——图片版权不被 MIT 覆盖，任何商用、出版、再分发都要先找原作者解决授权，未成年人环境也应保持 SFW。

最后回到那个 fork 数：它 2040 的 fork 相对 7869 的 star 比例高达约 26%，远高于普通展示型项目。这个异常高的比例恰恰说明，大家 fork 它不是为了"点个收藏"，而是真的要把这套数据和工具拉到本地用起来。一个能让这么多人愿意花 1.2GB 流量克隆的参考图库，靠的从来不是图多，而是把整条断裂的创作链，真正接上了。

项目地址：[https://github.com/anhao/ai-pose-gallery-zh](https://github.com/anhao/ai-pose-gallery-zh)
