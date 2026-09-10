---
title: "334 个零件零重叠：这个开源项目把特斯拉 Model X 拆给你看，核心布局算法只有 33 行"
date: 2026-09-10T20:00:00+08:00
lastmod: 2026-09-10T20:00:00+08:00
slug: model-x-studio-exploded-view
draft: false
description: "Model X Studio 是一个纯前端 3D 爆炸视图项目：334 个网格零件沿滑块渐进拆解、可点选隔离、零后端部署。我实际跑了线上 demo、扒了全部源码，讲清楚它的布局算法、性能取舍和工程上的诚实之处。"
tags: ["开源", "Three.js", "3D可视化", "React", "特斯拉"]
topic: "开源项目"
topicSlug: "open-source"
layout: article
contentType: article
type: article
cover: "/images/model-x-studio-exploded-view/cover-wechat.jpg"
---

# 334 个零件零重叠：这个开源项目把特斯拉 Model X 拆给你看，核心布局算法只有 33 行

产品展示页里的 3D 爆炸图，十有八九是建模师在 Blender/C4D 里**手 K 的动画**：哪个零件往上飘、飘多远、停在哪，全靠人眼对。零件一多，手工对位就是灾难，而且换个模型全部白做。

这周我挖到一个上线刚 6 天的开源项目 [Model X Studio](https://github.com/ashemag/model-x-studio)（GitHub 218 star / 62 fork，2026-09-04 创建），它把这件事完全反过来做：**一辆特斯拉 Model X，334 个网格零件，爆炸位置全部由代码根据每个零件的真实包围盒自动计算**——不重叠、不出画，而且在手机竖屏、桌面宽屏三种宽高比下都经过断言校验。

线上 demo：[https://model-x-studio.vercel.app](https://model-x-studio.vercel.app)，纯静态部署，没有后端、没有数据库、没有任何环境变量。我实际打开 demo 逐条验证了交互，并把全部源码（核心代码其实只有两个文件、不到 300 行）读完了。这篇讲三件事：它的效果到底怎么样、爆炸布局是怎么算出来的、哪些工程细节值得做 3D 可视化的人直接抄走。

![Model X Studio 整车状态：银色 Model X 停在圆形展台上，左侧部件面板、右侧视图工具、底部爆炸滑块](/images/model-x-studio-exploded-view/01-assembled.jpg)

## 它做出来的东西

打开网页，一辆银灰色前期款 Model X 停在深色摄影棚里的圆形展台上，PBR 车漆、全景玻璃、轮毂反光都有。界面分四块：左侧 8 大部件列表（车身、全景玻璃、鹰翼门、座舱、高压电池、电驱、悬挂、车轮刹车），右侧视图工具（缩放、复位、自转、全屏、说明），底部是一条 **Explode 滑块（0–100%）**。

拖动滑块，车不是"整组整组地散架"，而是分两段运动：先按 8 大系统分层抬升（玻璃向上、电池下沉），越过 40% 之后，**334 个零件各自飞向自己的独立位置，最终在空间里平铺成一张零件矩阵**，每个零件头顶挂着编号标记，100% 时滑块输出直接变成 `334 pieces`。

![爆炸视图 100%：334 个零件自动平铺为不重叠的矩阵，带编号标记点](/images/model-x-studio-exploded-view/02-exploded.jpg)

点任意零件，右侧弹出详情面板：概述 / 工作原理两个 Tab、规格表、单件下拉选择器，还有一个 **Isolate component（隔离）** 按钮——点击后整个场景只剩这一个系统或这一个零件，相机自动推近。

![部件详情面板：高压电池，带 Illustrative 标识、原理 Tab、规格表与隔离按钮](/images/model-x-studio-exploded-view/03-detail-panel.jpg)

我注意到一个细节：电池、电驱、悬挂这三项的面板上挂着橙色的 **Illustrative（示意）** 徽标。README 里也写得很硬气：334 件是艺术家建模的网格岛（mesh islands），**不是经过验证的特斯拉售后零件号**；电池/电机/悬挂是示意几何；模型是改款前车型，具体年款未核实。这种"我能干什么、不能证明什么"的边界声明，在拿来就吹"精准复刻"的同类项目里非常少见，后面还会讲到。

## 核心：33 行代码算出 334 个不重叠位置

整个项目最值钱的文件是 `app/explosion-layout.ts`，一共 33 行。它解决的问题可以一句话概括：**怎么把三维零件在二维观察平面上摊开，保证任意两个零件的投影互不重叠，同时整体尽量紧凑？**

做法拆解如下（我对照源码逐行确认）：

**第一步，确定观察坐标系。** 相机俯视方向是固定的单位向量 `overviewDirection = (-5.7, 2.1, 6.3)`，代码用叉积算出这个方向下的"屏幕右向量"和"屏幕上向量"。每个三维包围盒（AABB）的 8 个角点投影到这两个轴上，得到该零件在观察平面里的真实宽高——**注意它打包的是投影包围盒，不是三维包围盒**，这是注释里明说的设计："Pack the actual projected bounds, so even neighboring trim fragments separate"（按真实投影边界打包，相邻的细碎饰条才不会挤在一起）。每个槽位再加 0.22 米的最小间隙，零件还设了 0.36/0.3 的最小宽高，防止小碎片排得密到点不中。

**第二步，按行装箱（shelf packing）。** 所有卡片先按部件类别、再按高度、再按 id 排序；总宽度由全部零件的投影面积开根号估算（`sqrt(面积 × 1.6)`，下限 12 米），然后从左到右摆，超出行宽就换行。这就是经典的二维装箱启发式，简单但够用。

**第三步，把二维槽位映射回三维位移。** 槽位中心沿屏幕右/上轴反投影到三维空间（整体中心抬到 y=3 的高度），每个零件的飞行向量 = 槽位中心 − 零件自身中心。零件在整个过程中**朝向和缩放完全不变**，只做平移。

这套算法的产出不是"看着差不多"，而是被 CI 级脚本严格校验的。`scripts/validate-explosion.mjs` 在 Node 里用 GLTFLoader 真实加载那个 17MB 的 glb，然后断言三件事：

- 布局结果恰好 **334 个槽位**；
- 任意两个槽位之间**零重叠**（双重循环逐对断言 u/v 间距）；
- 在 **0.7（手机竖屏）、1.3（桌面）、2（超宽屏）三种相机宽高比**下，每个零件包围盒的全部 8 个角点投影后都落在画面内。

相机距离也不是拍脑袋：`fullDistance = max(布局高/2tan(fov/2), 布局宽/(2tan·aspect)) × 1.18 + 3`，即按 FOV 和宽高比反推"装下全部零件所需的最远距离"再加 18% 余量。这意味着布局算法和相机是联动的——**只要换一个 glb 模型重跑一遍，整套爆炸视图自动成立**，这是手 K 动画永远做不到的。

## 动画与交互：一个渲染循环里的精细取舍

`app/vehicle-scene.tsx`（194 行）承载了所有 Three.js 逻辑，几个处理值得抄：

**双段爆炸，用 smoothstep 做阶段切换。** 滑块进度经指数阻尼 `MathUtils.damp(current, target, 7, dt)` 平滑，再用 `smoothstep(amount, 0.4, 1)` 算出"单零件阶段"系数 individual：前半程 8 大系统按预设 offset 分层，后半程 334 个零件按布局向量平移，两段在 40%–100% 之间渐变交接，没有跳变。

**场景元素随阶段退场。** 爆炸程度一上来，圆形展台淡出、地面和网格下沉淡出、阴影关闭（阴影只在整车近原位时开启）、雾的 near/far 从 16/55 一路推到 400/500——否则摊开 12 米的零件矩阵会被雾吃掉一半。这些不是装饰，是让 334 个零件在散开后依然可辨的必要条件。

**DOM 标签 + 三维投影，而不是 CSS2DRenderer。** 8 个系统标签和 334 个编号标记都是原生 `<button>`，每 50ms（而非每帧）把三维中心 project 到屏幕坐标，用 `translate3d` 更新位置。注释写得很直白：避免每帧数百次 layout 写入。标记点本身则用一个 `THREE.Points` + 动态 `position` BufferAttribute 渲染，点击时手动做屏幕空间距离命中（触摸阈值 324px²、鼠标 64px²）。

**区分"点击"和"拖拽旋转"。** `pointer-tap.ts` 用一个 21 行的状态机判定：按下后移动超过 5px（触摸 10px）、或出现第二根手指，就屏蔽本次 tap。这是轨道相机场景的必备细节，不然用户一转视角就误选零件。它还完整支持 `prefers-reduced-motion`、像素比封顶 1.5（触屏 1.25）、WebGL context lost 提示重载。

**性能上的克制。** `shadowMap.autoUpdate = false`，只在需要时置 needsUpdate；脏检查渲染——相机没动、几何没变、标签没更新时直接跳过 render 调用；17MB 的模型加载失败有明确错误态。在我这边浏览器里加载到可交互约数秒（取决于网络），之后拖滑块全程流畅。

## 模型从哪来：Blender 自动化转换管线

334 这个数字不是手工切的。`scripts/convert-model.py` 是一条完整的 Blender `bpy` 离线管线（加载源文件时禁用脚本执行，安全意识到位）：

1. 源资产是 BlendKit 创作者 cgi Moon 的 Model X 模型（Royalty Free 许可，项目内嵌入并署名，不提供下载入口）；
2. Cycles 专用自定义节点材质全部重建为浏览器可渲染的 Principled BSDF：车漆金属度 0.55 + clearcoat、镀铬件 0.92、玻璃透射、轮胎粗糙度 0.72，按材质名关键字分派；
3. 先求值细分等修改器，再进入编辑模式按 **LOOSE（不连通几何）拆分**——这正是 334 个"网格岛"的来源；镜像修改器保留引用，轮胎导出真实建模而非几何替换；
4. 输出 glTF + manifest（每个零件带 id、所属系统、中英标签、中心、尺寸、面数）。

manifest 里能查到 334 件的真实分布：**车身 180、车轮 94、座舱 38、玻璃 12、车门 10**；Node 侧加载后实测整车 bounds 为 5.056 × 2.276 × 1.680 米，和真车尺寸量级吻合。注意 343 是 draw mesh 数（含同材质子网格），334 是可选择的源网格岛，两个数字项目文档区分得很清楚。

## 一个容易被忽略的彩蛋：它给 AI 浏览器注册了工具

`app/page.tsx` 第 22–33 行有一段 `document.modelContext.registerTool(...)` 的特性检测代码：如果运行环境支持 WebMCP（AI 浏览器的网页工具协议），页面会主动注册一个 `explore_vehicle_component` 工具，参数是部件名（枚举限定 8 项）、爆炸程度 0–100、是否隔离，带完整的 JSON Schema 和输入校验。也就是说，**未来你可以直接对支持该协议的 AI 助手说"把电池隔离出来、爆炸到 50%"**，由网页暴露的工具驱动这个 3D 场景。作者在 VALIDATION.md 里同时诚实标注：协议是特性检测注册的，在受支持浏览器上下文中的实际执行"未验证"。

## 部署与本地运行

技术栈是 React 19.2 + Three.js 0.159 + Tailwind 4 + Vite 8，开发态用 vinext（Vinext/Cloudflare 那套 RSC 构建），但给 Vercel 的是一条**纯 SPA 出口**：`vite.vercel.config.ts` 把 `vercel-app/` 作为 root、`public/` 作为静态目录，构建产物 `dist/vercel` 完全静态，仓库里的 `vercel.json` 零环境变量即可导入部署。两条构建链共用同一套 React 页面和 Three.js 场景。

本地跑：

```bash
# 需要 Node.js 22.13+
npm ci
npm run dev -- --port 3015
```

验证三连（README 给出的标准流程）：

```bash
npx tsc --noEmit
node --experimental-strip-types scripts/validate-explosion.mjs
npm run build:vercel
```

## 判断：谁该看，谁先等等

**强烈推荐给这三类人：**

- 做产品 3D 展示/数字孪生/教学课件的前端——`explosion-layout.ts` 的投影装箱 + 三宽高比校验可以直接移植到任何 glb 资产；
- 想学 Three.js 工程化的人——194 行里塞了阻尼动画、脏检查渲染、DOM 投影标签、点选/拖拽区分、降级策略，密度极高且没有历史包袱；
- 关注 WebMCP / "网页给 AI 暴露工具"方向的人，这是我见过最小的可参考实现。

**要先等等的情况：**

- 想要"精准零件级维修手册"的：作者反复声明这是艺术家网格而非 OEM 零件号，电池/电驱/悬挂是示意件，车型年款未核实——教学展示没问题，专业维修不能用；
- 模型资产本身受 BlendKit Royalty Free 许可约束且原仓库私有嵌入，**直接搬走那个 17MB glb 商用前必须自己读许可、找作者授权**；能用的是代码和方法；
- 首次加载 17MB 模型对弱网移动端偏重，照搬时建议加 Draco/meshopt 压缩。

项目地址：[https://github.com/ashemag/model-x-studio](https://github.com/ashemag/model-x-studio)，在线体验：[https://model-x-studio.vercel.app](https://model-x-studio.vercel.app)。

我最喜欢这个项目的一点，其实和 3D 无关：它把"哪些是真的、哪些是示意的、哪些还没验证"全部标在界面和文档里。技术演示人人会做，**克制地宣称自己做了什么**，才是这个仓库 6 天攒到 200+ star 的真正原因。
