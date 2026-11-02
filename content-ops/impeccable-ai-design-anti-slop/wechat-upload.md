---
title: "9.9 万人给 AI 程序员配了个「设计总监」：专治一眼假的 AI 味界面"
cover: /root/jackssybinIndex/content-ops/impeccable-ai-design-anti-slop/media/cover-ip.jpg
source_url: https://github.com/pbakaus/impeccable
---

你有没有发现一件事：让 AI 给你做网页，如果不额外指挥，不管是哪个模型，做出来的东西都长得差不多。

深色模式就是紫到蓝的渐变、青色发光、毛玻璃卡片；浅色模式就是奶油色背景、纤细衬线大标题加一个斜体英文词、两个胶囊按钮、一排圆角卡片配扁平小插画。

模型不一样、项目不一样，那股"AI 味"却一模一样。英文社区给它起了个名，叫 **AI slop**（AI 泔水）——不是不能用，是一眼就能看出来"这是 AI 默认吐的"，毫无专业度和品牌感。

最近有个项目专门治这个病，叫 **Impeccable**，已经 **9.9 万 Star**。作者来头不小：**Paul Bakaus，jQuery UI 的创造者**，项目本身也是从 Anthropic 官方的 frontend-design skill 长出来的。我克隆了仓库、把检测器真跑了一遍，这篇讲讲它到底怎么用。

## 先说结论：它给你和 AI 之间装了一套「设计语言」

问题的根子是：你跟 AI 说"高级一点""make it pop""再有点设计感"，它只能靠猜，猜错一轮再改一轮，越改越糊。

Impeccable 的思路是把这些模糊的话，变成**一组精确、有明确定义、还能指定作用对象的命令**。安装就一行：

```bash
npx impeccable install
```

它会自动认出你电脑上的 AI 编程工具——Claude Code、Cursor、Codex、Copilot、Gemini CLI、Grok Build、OpenCode、Trae 等 20 来种，问你装项目还是全局。重载后在 Agent 里跑一次 `/impeccable init`，之后就能这么说话了：

```text
/impeccable bolder the pricing cards      # 定价卡更大胆
/impeccable critique the onboarding flow  # 给新手流程做打分评审
/impeccable quieter the landing page      # 落地页太吵，收一收
/impeccable polish settings               # 上线前最后打磨
```

README 里有个对比我印象很深：同一个模型、同一个需求——"利古里亚海岸一家 14 间房的家庭旅馆"。**没装它**，AI 交出标准的"得体默认值"：奶油色、衬线字、胶囊按钮；**装了它**，页面围绕一张真实照片展开——夜晚从海面看悬崖上的旅馆，朱红配奶油色的凝缩标题。前者谁都做得出来，后者像一个有主张的设计总监做的。

## 24 个命令，覆盖从指挥到收尾

它不是一堆零散提示词，是一套有分工的系统：

![Impeccable 的 24 个设计命令地图](/root/jackssybinIndex/content-ops/impeccable-ai-design-anti-slop/media/commands.png)

- **引导方向**：`bolder` 大胆、`quieter` 收敛、`distill` 删冗余、`colorize` 加颜色、`typeset` 修字体层级、`layout` 修间距、`animate` 加动效、`delight` 加个性，`overdrive` 直接上 shader 和滚动特效；
- **评审**：`critique` 对照可用性原则**打分**并排出先修什么，`audit` 查可访问性、性能、响应式，按 P0 到 P3 分级；
- **收尾**：`polish` 上线前打磨、`harden` 补错误态/国际化/溢出、`clarify` 改文案、`adapt` 适配多屏、`optimize` 优化性能、`onboard` 做新手和空状态；
- **实时改**：`live` 在浏览器里点元素、热切换变体，满意直接写回源码（Vite/Next/SvelteKit/Astro 都支持）。

它反复强调一个原则：**窄目标胜过扫射全页**。指定"定价卡片"就近细看，效果远好于一句"把整页做好看"。

命令为什么不跑偏？因为开工前它会让你先建两份事实文件：`PRODUCT.md`（产品给谁用、要干嘛、有什么约束）和 `DESIGN.md`（你现有的颜色、字体、圆角 token），之后每条命令都读它们。它自己的品牌就很讲究，叫"新金箔"体系：暖黑漆底配金箔色和铜绿色，颜色全用 OKLCH 写。

## 最硬的部分：62 条规则，不要大模型就能抓「AI 味」

如果说命令是方向盘，检测器就是刹车，也是我觉得工程含量最高的地方。

它是一个 Rust 编译的本地引擎，**不用大模型、不要 API Key**，靠 62 条确定性规则识别套路。我实跑了一遍规则列表，准得让人会心一笑：

![62 条规则分四大类](/root/jackssybinIndex/content-ops/impeccable-ai-design-anti-slop/media/rules.png)

比如：

- `ai-color-palette`：紫蓝渐变、深底青色，最经典的 AI 配色；
- `overused-font`：Inter、Roboto、Geist、Space Grotesk 被用烂了，已经没有个性；
- `gradient-text`：渐变标题字；
- `side-tab`：卡片一侧那道粗彩色边——官方说这是"最容易辨认的 AI 生成 UI 特征"；
- `nested-cards`：卡片套卡片；`dark-glow`：彩色发光阴影；`radial-halo`：径向聚光；
- `marquee` 自动跑马灯、`pulsing-dot` 装饰脉冲点、`blinking-cursor` 假打字光标、用基础几何形拼出来的占位插画……

除了风格套路，还有真正的硬伤：低对比、彩底灰字、字太小、内边距太挤、标题跳级、行距太紧、首屏横向溢出，以及坏图、脚本报错这类必须渲染页面才能发现的问题。规则还分严重级别，品牌有例外也能加白名单。

## 三种用法，关键是挂在每次提交上

![检测器的三种运行方式](/root/jackssybinIndex/content-ops/impeccable-ai-design-anti-slop/media/detector.png)

- **Agent 钩子（最推荐）**：装的时候勾上，以后 AI 每改一个界面文件，提交前自动扫描，把问题直接打回给它。官方一句话点破："没钩子，检测器只在有人记得运行时才跑"——而 AI 味大多就是这么溜上线的。
- **终端 / CI（不需要 Agent）**：`npx impeccable detect src/` 扫代码、`detect http://localhost:5173` 扫渲染后的页面、`--json` 出机器可读结果、`--github` 直接生成 GitHub Actions 注解。退出码 2 代表有问题，能直接当 CI 门禁。
- **浏览器扩展**：把同样的结果以浮层叠在任意网页上，包括别人的网站，可以拿来随手"考古"。

还有个体验上最惊艳的 **live 模式**：`/impeccable live` 在你正在跑的页面上加浮层，点任意元素、选方向（更大胆/更安静/换色），它就地热替换一堆变体，你翻牌子挑中一个，它把结果**写回源代码**——等于把"和设计师来回改稿"压缩成"自己在页面上点选"。

## 几句大实话

为了不写成软文，边界也得说清楚：

1. 它**最擅长改已经存在的界面**，从零生成新页是更难的模式；
2. 它不替你做审美决策，62 条规则只管可量化的问题，好不好看最终责任还在人；
3. 规则是"强信号"不是真理——如果你的品牌刻意就用 Inter、就用侧边色边，记得加白名单，不然会和设计系统打架；
4. 20 种工具接入深度不一，Codex 要手动批 hook、Hermes 要 `hermes plugins enable impeccable-design-hook`、Copilot 扩展不带钩子。

但瑕不掩瑜。它真正的洞察是：**AI 做的界面平庸，往往不是模型不行，而是"沟通语言"和"质量闸门"同时缺位。** 你没法用"高级一点"指挥出好设计，也没法靠肉眼拦住所有套路。jQuery UI 的作者出手，做的是基础设施，不是又一个提示词合集。

如果你已经在用 Claude Code 或 Cursor 写前端，又总觉得页面"能用但土"，花十分钟装上，先让它 `critique` 你最得意的一个组件，大概率会被说中好几处。

---

我是 jk，一个只信「自己跑过」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱、省时间的开源项目，坑我先替你踩。

觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整命令我放在了「**阅读原文**」。

相关阅读：
- [用了 Claude Code 半年后，我换成了这个完全开源的终端编码 Agent](https://mp.weixin.qq.com/s/_2gkNg1fECDEM62GNbTy9w)
- [DeepSeek 官方出了 22 份接入指南，覆盖 Claude Code 到 Copilot，配置只要 3 分钟](https://mp.weixin.qq.com/s/4lZbySSLYj2aj-y-DIV7ZA)
