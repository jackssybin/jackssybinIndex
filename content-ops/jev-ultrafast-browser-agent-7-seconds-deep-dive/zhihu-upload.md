---
title: 如何评价 browser-use 新开源的 Jev Ultrafast：一个 7 秒完成真实网页任务的浏览器 Agent
---

浏览器 Agent 这两年的主流技术路线可以概括为「截图 + 生成」：把页面截图交给多模态模型，模型输出坐标、选择器或代码，执行后再截图、再生成。这条路线的瓶颈同样明显——截图消耗大量视觉 token，决策串行，页面动画或网络延迟常常让上一轮决策失效。

最近 browser-use 团队（开源框架 browser-use 的开发方）开源了一个架构思路不同的项目 [Jev Ultrafast](https://github.com/browser-use/jev-ultrafast)。其官方演示中，Agent 接收一句自然语言目标，在真实 Google Flights 上完成「苏黎世→伦敦、2026 年 9 月 20 日、单程、1 名成人、经济舱」的搜索，端到端耗时 **7.073 秒**，录屏为 1 倍速，并通过独立程序对路线、日期和结果可见性进行复核。

笔者通读了仓库的六个核心文件以及 `docs/design.md`、`docs/performance.md`。这篇文章讨论三个问题：它的机制是什么、性能数据的可信度如何、边界在哪里。

![Jev Ultrafast 完成 Google Flights 搜索后的实测画面：左侧结果页显示单程条件与航班列表，右侧面板记录 7.07 秒并标注路线与日期已校验](/root/jackssybinIndex/static/images/jev-ultrafast-browser-agent-7-seconds-deep-dive/flights-result.png)

## 一、动态索引的动作空间

Jev 默认循环中不处理截图。注入页面的 `snapshot.js` 对 DOM 做一次原子读取，提取可见的 HTML/ARIA 控件及其角色、名称、当前值和状态，生成一张带编号的元素表：

```text
[1] button    Change ticket type · Round trip
[2] combobox  Where from?        · San Francisco
[3] combobox  Where to?          · empty
```

动作空间固定为八种：`CLICK`、`TYPE_TEXT`、`SELECT`、`SCROLL_UP`、`SCROLL_DOWN`、`WAIT`、`DONE`、`BLOCKED`。在 `model.py` 的实现中，一次请求包含多个选择题：一个操作题，外加每种可用操作各自的目标题（目标题中只包含与该操作兼容的元素）。由于回答目标题时操作题尚无答案，题面会显式声明所假设的操作——这是一种推测式（speculative）的多头提问。最终只有被选中操作对应的目标会被执行，两个决策共享一次网络往返。

一个安全层面的设计值得注意：模型的输出只是一个编号，永远不会被转换为选择器、坐标、shell 命令或 JavaScript 执行。执行器持有的是快照阶段保存的真实 DOM 节点引用；节点被替换会获得新身份，页面导航后引用缓存清空。这从架构上排除了模型输出被直接当作代码执行的注入路径。

## 二、文本生成的最小化分工

自由文本输入（如城市名）无法通过枚举解决。Jev 的处理方式是：仅当操作选中 `TYPE_TEXT` 时，才调用一个 OpenAI 兼容接口的小模型，上下文中包含目标字段、页面可见文本（截断至 6000 字）与近期动作；返回结果必须是恰好包含一个 `text` 字段的 JSON 对象，代码不做引号提取或宽松解析，校验失败则不输入任何内容。

在 7 秒的航班录制中，"Zurich" 的生成耗时 581 ms，"London" 为 346 ms，两次文本调用合计费用为 **$0.00006272**。示例配置使用 OpenRouter 上的 `inception/mercury-2.5` 并关闭推理，同一套 helper 代码也支持 DeepSeek、Gemini、GLM 等兼容端点。此外，生成文本只在「整个 helper 输入完全不变」的过期重试中复用，成功写入后立即丢弃，避免字段错配。

## 三、性能数据与方法

项目提供了配对实验而非单一演示录屏：同一任务、同一 Chrome 配置与模型版本（jev-1.13.0、mercury-2.5），新旧实现交替执行 3 对共 6 次，所有尝试均纳入统计并通过同一套独立校验。

![新旧实现配对实测数据表：中位任务耗时 9.450 秒降至 7.092 秒，请求数 22 降至 17，浏览器协议调用 1092 降至 101](/root/jackssybinIndex/static/images/jev-ultrafast-browser-agent-7-seconds-deep-dive/perf-table.png)

主要结果：中位任务耗时由 9.450 秒降至 7.092 秒（-25%）；中位决策请求由 22 次降至 17 次；中位浏览器协议调用由 1,092 次降至 101 次。

协议调用的数量级变化主要来自两点。旧循环反复读取可访问性树、解析大量节点，并在任意 DOM 变动（包括动画）时作废决策；新实现一次读取拿齐控件状态，以语义比较（文档、URL、视口、表单值、目标及邻近上下文）作为新鲜度判据，普通动画不再触发重算，但在输入前仍会重新读取几何并做遮挡命中测试。等待策略同样区分场景：普通交互后最多等待两帧或 50 ms，组合框输入后则等待补全建议、上限 200 ms。

需要指出的是，报告本身明确声明：3 对样本的双侧符号检验 p=0.25，不构成强统计结论；这是单任务、单浏览器配置的受控对比，而非通用可靠性基准。另有两个冒烟测试（维基百科打开指定文章 2.798 秒、本地酒店页面搜索加三个筛选 1.896 秒），同样注明并非配对对比。

## 四、上手方式

```bash
git clone https://github.com/browser-use/jev-ultrafast.git
cd jev-ultrafast
uv sync
cp .env.example .env  # 配置 TYPESAFE_API_KEY 与 TEXT_MODEL_API_KEY
uv run jev
```

随后访问本地检查器，可选择全自动运行或单步确认。Chrome 通过 browser-harness 连接，复用本机现有 Chrome 配置。检查器会实时呈现元素编号、操作概率分布、目标概率与决策延迟，是观察整套机制最直接的入口。

![本地检查器界面：页面控件被编号标注，右侧面板显示 CLICK 概率 76%、票种下拉框目标概率 93%、本次决策 351 ms](/root/jackssybinIndex/static/images/jev-ultrafast-browser-agent-7-seconds-deep-dive/inspector.png)

## 五、边界与适用判断

项目文档对能力边界的交代比较直接：

1. DOM 读取器覆盖常见 HTML/ARIA 控件，但不实现完整的 accessible-name 算法；Shadow root、iframe、canvas、文件上传、新标签页、嵌套滚动与任意键盘组件均不在当前支持范围内。
2. 单次任务受 60 个浏览器动作与 120 次决策请求的预算约束。
3. 自动化标签页共享用户现有 Chrome 配置文件，即可用已登录会话，这一点在便利之外也意味着需要谨慎评估信任边界。
4. `DONE` 不被视为成功证据，必须通过独立校验；合法操作本身仍可能是错误决策。

综合来看，对于标准表单类站点的流程自动化、以及研究「结构化状态 + 推测式多头决策」架构的开发者，这个项目现在就具有较高的参考和试用价值——核心代码仅六个文件也是优势。而目标站点重度依赖 shadow DOM、iframe、canvas，或需要多标签协作、文件上传的场景，则应当等待后续版本；在任何重要流程中，都建议像官方示例那样实现独立的结果校验。

浏览器 Agent 的竞争重点，某种程度上正在从模型能力转向「如何让模型承担更少、更确定的决策」。Jev Ultrafast 是这一方向上一个机制清晰、且有初步对照数据的开源样本。

项目地址：<https://github.com/browser-use/jev-ultrafast>
