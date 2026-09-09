# 把整本技术书交给大模型，成本到底浪费在哪：我读了 book-to-skill 的源码并实跑了一遍

这两年很多人都在做同一件事：把 PDF、内部文档丢给大模型，希望它"读过"之后能随时回答。实际体验通常不理想——要么模型在长上下文里漏掉细节、产生幻觉，要么每轮对话都在重复消耗大量 token。

最近一个叫 book-to-skill 的开源项目给出了另一条路径：先把书确定性地转换成符合 Agent Skills 开放标准的结构化技能，再让 Agent 按需加载对应章节。项目方给出的数字是回答单个问题比整本塞入上下文省 24–51 倍 token。

这个数字足够吸引人，也足够可疑。我把仓库克隆下来，读了架构文档和约 2900 行 Python 源码，并在本机实际运行了提取器。下面是验证后的结论，包括它成立的前提和不成立的边界。

项目地址：https://github.com/virgiliojr94/book-to-skill ，MIT 协议，当前 v1.4.0。

## 一、成本浪费的根源：你在为"翻书"重复付费

理解这个工具，关键是理解它提出的 Discovery Loop Tax（发现循环税）：一个读 PDF 的 Agent 每次回答前都要导航——拉取目录、定位可能的章节、打开、不对再回溯。这部分开销与问题本身无关，且在每一轮对话重复发生。

书里给了三种方式在单个精准问题上进入上下文的 token 量，全部用 tiktoken（cl100k_base）实测，可用仓库内 tools/discovery_tax.py 复现：

- 整本塞入上下文：《Think Python 2》约 119K，《Working Backwards》约 175K，《AI Engineering》约 256K；
- 发现循环式翻阅：约 12K 到 78K，随章节规模上升；
- book-to-skill：常驻核心约 4K 加目标章节约 1K，稳定在约 5K。

换算下来，对小、中、大三本书分别是 24 倍、35 倍、51 倍的差距。需要强调的是，"整本塞入"的成本在每一轮都会重复，而 5K 是查询时的稳态开销——书越厚、提问越频繁，复利差距越大。整本转换的一次性生成成本，按 Claude Sonnet 4.5 定价估算约 0.88–1.42 美元，平均每本 1 美元。

![三种方式对比](/root/jackssybinIndex/content-ops/book-to-skill-agent-skill/media/zhihu-cover.png)

## 二、我在本机实跑提取器

我没有止步于文档数据，用仓库自带的测试样例运行了提取命令：

```
python3 scripts/extract.py evals/fixtures/pd00-synthetic-book.txt
```

输出显示识别出 3 章（numeric 方式）、141 个词、检测到目录，并在临时目录写出 full_text.txt 与 metadata.json；metadata 中如实记录了格式、提取方法 plain-text、估算 token 与章节标题样本。

一个值得注意的源码级细节：这份样例的章节标题是葡萄牙语 Capítulo 1 — Orientação，依然被准确切成 3 章。说明章节检测不是硬编码英文 Chapter，而是基于多语言"数字章节"模式，中文"第 N 章"、西语 Capítulo 都能命中。

![提取器实跑输出](/root/jackssybinIndex/content-ops/book-to-skill-agent-skill/media/02-extractor-output.png)

## 三、架构：确定性提取器与 spec 驱动生成器解耦

读完源码，系统清晰地分成两段，这个解耦是它设计上最合理的地方。

前半段是纯 Python 的确定性提取器，职责仅限把文档转成干净文本加元数据，对每种格式按顺序尝试可用工具：PDF 文字书走 pdftotext/pypdf/pdfminer，技术书走 docling，EPUB 走 ebooklib 并回退标准库 zipfile，DOCX/HTML/RTF/MOBI 各有解析器。

后半段并不在这个包里——它是宿主 Agent 严格依照仓库那份 761 行 SKILL.md 指令完成的"生成器"，把干净文本提炼为分层技能文件：SKILL.md（核心心智模型与章节索引，约 4K token）、chapters/（每章一个文件，约 1K）、glossary、patterns、cheatsheet。

![两段式架构](/root/jackssybinIndex/content-ops/book-to-skill-agent-skill/media/03-architecture.png)

这种切分的好处是：易出错、需要确定性的解析工作不交给大模型；需要理解和提炼的工作才交给模型。产物遵循开放 Agent Skills 标准，同一份 SKILL.md 能被 Claude Code、GitHub Copilot CLI、Amp、Hermes Agent 读取。分层也对应了大模型的实际行为——上下文压缩时通常只保留前部约 5000 token，所以最重要的心智模型被刻意前置，章节则懒加载。

## 四、几个非显而易见的取舍

第一，PDF 提取器按书型分流而非一味求重。在一本 103 页技术 PDF 上：pdftotext 仅 0.1 秒，但表格与代码块全部丢失；docling 耗时 164 秒（约 1.5 秒/页），却保留了 48 个表格、36 个代码块，token 只多约 1.2%。工具因此会先询问"文字书还是技术书"。

第二，章节自动切分有明确边界。它依赖显式的"第 N 章/Chapter N/Capítulo N"标题。Pro Git 用小节名做章标题、Moby-Dick 用罗马数字加章名，都无法自动分段，此时工具照常提取、交由用户手动指定，而不是强行错切。扫描版 PDF（无文字层）会在检查前几页后立即中止并提示先 OCR，避免处理完整本书后产出空技能。

第三，cheatsheet 的定位在 v1.0 被重做：从"9 行名词解释、0 条决策规则"改为"0 行名词、32 条决策规则"，并要求有深度的章节复现一个完整范例。方向是从"这是什么"转向"该怎么决策"。

## 五、安装与适用边界

安装一条命令即可：`npx skills add virgiliojr94/book-to-skill`，或克隆到对应宿主的 skills 目录；运行前可用 `python3 scripts/extract.py --check` 检查各格式依赖。除完整转换外，还支持仅分析、从分析生成、对已有技能增量折叠合并，以及文件夹/glob/多文件输入（单文件损坏只跳过不影响其余）。

隐私方面，提取与分析在本地运行、工具不上传文件；但生成阶段本质是 Agent 调用模型，文本仍遵循该模型厂商的数据条款，处理敏感内部文档时建议用本地模型。版权方面，生成物是框架与要点的衍生笔记而非原文照抄，适合个人私有使用，但不应公开分享由第三方付费书籍生成的技能。

我的总体判断：

- 适合：拥有大量常查厚书或内部文档、且高频向 AI 提问的人；已经使用 Claude Code/Copilot CLI/Hermes 等支持 Skills 标准宿主的用户。书越厚、问得越多，节省越明显。
- 谨慎：追求零干预一键流程的人——扫描书需自行 OCR，非标准章节需手动指定，生成要付约 1 美元模型费用；只有几页的薄资料，直接贴文本反而更简单。
- 验证建议：拿一本你最熟悉的书先跑"仅分析"模式，检查它是否保留了框架的精确名称（例如 The 5 Whys 不应被泛化成"多问几个为什么"），这是判断提炼质量最直接的切入点。

客观地说，book-to-skill 没有改变大模型的能力边界，它改变的是知识进入上下文的方式——把一次性的"结构化编译"和反复发生的"查询"分开计费。对于真正以 AI 为日常生产工具的人，这个工程取舍是成立的；但它的收益高度依赖你提问的频率，以及原始资料是否适合被章节化。

更多这类开源/AI 工具的实测拆解，可以关注我的专栏，后续会继续逐个上手验证。
