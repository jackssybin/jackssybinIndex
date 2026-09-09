---
title: "把整本书丢给 AI 太烧钱？开源工具 book-to-skill 把单次提问 token 压低 51 倍"
date: 2026-09-09T10:30:00+08:00
lastmod: 2026-09-09T10:30:00+08:00
slug: book-to-skill-agent-skill
draft: false
description: "book-to-skill 把 PDF/EPUB/DOCX 技术书与文档转换成结构化 Agent Skill：4K token 常驻核心 + 1K 按需章节，比把整本书塞进上下文省 24–51 倍 token，单书生成成本约 1 美元。本文含我实跑提取器的第一手输出、源码级工程洞察与适用边界。"
tags: ["AI", "Agent", "Claude Code", "开源", "Skill", "知识管理"]
topic: "AI工具"
topicSlug: "ai-tools"
layout: article
contentType: article
type: article
cover: "/images/book-to-skill-agent-skill/wechat-cover.jpg"
---

# 把整本书丢给 AI 太烧钱？开源工具 book-to-skill 把单次提问 token 压低 51 倍

你一定也经历过这种事：花了一周啃完一本厚厚的技术书，三个月后要用到第 7 章讲的那个框架，脑子里只剩下"书里好像提过"。

于是你把 PDF 拖给 AI：「这本书里关于 X 的部分怎么说？」结果只有两种——要么它凭印象一本正经地胡说，要么告诉你"我没有这本书的内容"。你改成分章复制粘贴，它又在每一轮对话里反复读、反复找目录，token 账单悄悄涨起来。

今天要讲的开源项目 **book-to-skill**，把这件事彻底换了个做法：**不是把书喂给 AI，而是先把书"编译"成一个结构化的 Agent Skill（技能），让 Agent 按需读取对应章节。** 官方在真实书籍上实测，回答一个精准问题时，比把整本书塞进上下文**少消耗 24–51 倍 token**。

项目地址：[https://github.com/virgiliojr94/book-to-skill](https://github.com/virgiliojr94/book-to-skill)（MIT 协议，v1.4.0）

![book-to-skill 封面](/images/book-to-skill-agent-skill/01-showcase.png)

我没有只看 README。下面的内容来自我克隆源码、通读架构文档、并在本机**实际运行了它的提取器**之后的第一手判断。

## 一、先搞清楚：它到底解决了什么矛盾

直接把整本书塞进上下文，问题不只是"贵"。官方文档给这个浪费起了个很准确的名字——**Discovery Loop Tax（发现循环税）**。

一个读 PDF 的 Agent 不只是"读"，它还要**导航**：先拉取目录，找到可能的章节，打开发现不对再回溯，每一轮问答都要重新处理一遍这些内容。这部分开销和你的问题大小无关，纯属"翻书"动作产生的税。

三种常见做法各有死穴：

| 做法 | 结果 |
|------|------|
| 直接在 PDF 里搜关键词 | 得到一串页码，不是答案 |
| 把整本书/大段文本丢给 Agent | 每轮重复烧 token，且容易在长上下文里"走神" |
| 自己边读边做笔记 | 得到一份 200 行、再也不会打开的文档 |

book-to-skill 的思路是：**把"结构化"这件事的成本，在转换时一次性付清**；之后每次提问，token 消耗只和答案本身的规模成正比。

## 二、硬数据：24–51 倍是怎么来的

这是我最看重的部分——它没有拍脑袋，所有数字用 `tiktoken`（cl100k_base）实测，仓库里还附了可复现的脚本 `tools/discovery_tax.py`。

回答**一个**精准问题时，进入上下文的 token 量：

| 书籍（章节规模） | 整本塞入 | 发现循环 | book-to-skill | 相比整本 |
|---|---:|---:|---:|---:|
| Think Python 2（小） | 119,264 | 12,152 | ~5,000 | **24×** |
| Working Backwards（中） | 175,253 | 33,444 | ~5,000 | **35×** |
| AI Engineering（大） | 256,287 | 77,866 | ~5,000 | **51×** |

为什么能恒定在约 5,000 token？因为它生成的 Skill 有一个**常驻核心 `SKILL.md`（约 4K token）**，加上你问到的那一章文件（约 1K token/章）。问题落在哪一章，就读哪一个文件，其余章节完全不占预算。

关键在于：**"整本塞入"的成本在每一轮对话都会重复发生**，而 Skill 的 ~5K 是查询时的稳态开销。书越厚、问得越频繁，省得越多。

生成成本同样是一次性的，按 Claude Sonnet 4.5（输入 $3 / 输出 $15 每百万 token）估算，整本转换一遍大约 **$0.88–$1.42，平均 1 美元一本书**。

## 三、我在本机实跑了一次提取器

光看数据不够，我把仓库克隆下来，用它自带的测试样例 `evals/fixtures/pd00-synthetic-book.txt` 实际运行了提取命令：

```bash
python3 scripts/extract.py evals/fixtures/pd00-synthetic-book.txt
```

真实输出（节选）：

```
Extracting text document: pd00-synthetic-book.txt
  chapters: 3 (numeric)

Extraction complete:
   Sources : 1 processed
   Words   : 141
   Chapters: 3 detected overall (numeric)
   ToC     : yes
   Workdir -> /tmp/book_skill_work-537753/
```

它在临时目录产出两个文件：合并后的 `full_text.txt`（带来源标记）和 `metadata.json`。我打开 metadata 看了一下，里面如实记录了格式、提取方法（`plain-text`）、字符数、估算 token（188）、章节标题样本等。

![提取器运行与产出](/images/book-to-skill-agent-skill/02-extractor-output.png)

这里有个**源码层面的细节**：那份测试样例的章节标题是葡萄牙语 `Capítulo 1 — Orientação`，提取器照样准确切出了 3 章（`chapters_method: numeric`）。说明章节识别不是写死的英文 `Chapter`，而是按多语言的"第 N 章"数字模式匹配——对中文"第 1 章"、西语 `Capítulo` 都成立。

## 四、架构：确定性提取器 + Spec 驱动生成器

读完源码（`book_to_skill/` 约 2,900 行 Python），它清晰地分成两半：

![两段式架构](/images/book-to-skill-agent-skill/03-architecture.png)

**第一半是确定性的 Python 提取器**，职责单一：把各种文档变成干净文本 + 元数据。它对每种格式按顺序尝试工具、用第一个可用的，全部不可用就给出精确的安装命令：

- **PDF（文字书）**：`pdftotext` → `pypdf` → `pdfminer`，即时完成
- **PDF（技术书）**：`docling`，约 1.5 秒/页，但保留 Markdown 表格和代码块
- **EPUB**：`ebooklib`+`beautifulsoup4`，回退到标准库 `zipfile`
- 另支持 DOCX、HTML、RTF、MOBI/AZW（Calibre）、纯文本/Markdown

**第二半是 Spec 驱动的生成器**——其实就是 Agent 严格按照仓库那份 761 行的 `SKILL.md` 指令，把干净文本"提炼"成技能文件。注意它的口号是 **Extract structure, not summaries（提取结构，而非摘要）**。最终产物是一套分层文件：

| 文件 | 用途 | 大小 |
|---|---|---:|
| `SKILL.md` | 核心心智模型 + 章节索引 | ~4,000 tokens |
| `chapters/ch01-*.md` … | 每章一文件，按需加载 | ~1,000 tokens/章 |
| `glossary.md` | 术语表，附章节引用 | ~1,500 tokens |
| `patterns.md` | 技巧、算法、设计模式 | ~2,000 tokens |
| `cheatsheet.md` | 决策表与快速规则 | ~1,000 tokens |

生成的 Skill 遵循开放的 [Agent Skills](https://github.com/agentskills/agentskills) 标准，同一份 `SKILL.md` 能被 **GitHub Copilot CLI、Amp、Claude Code、Hermes Agent** 读取，安装目录各宿主不同（如 Claude Code 是 `~/.claude/skills/<slug>/`，Hermes 是 `$HERMES_HOME/skills/`）。

## 五、两个非显而易见的工程取舍

**取舍一：pdftotext 与 Docling 不是替代关系，而是按书型分流。** 官方在一本 103 页技术 PDF 上实测：pdftotext 只要 **0.1 秒**，但表格、代码块全部丢失（0/0）；Docling 耗时 **164 秒**，却保下了 48 个表格、36 个代码块，token 仅多 1.2%。所以工具会先问你"这是技术书还是文字书"——散文选快的，代码/表格选慢的。这个"先分类再选提取器"的设计，比无脑上重模型聪明得多。

**取舍二：章节自动切分有明确边界，它不装懂。** 章节检测依赖显式的"第 N 章 / Chapter N / Capítulo N"标题。实测中 **Pro Git（用小节名当章标题）和 Moby-Dick（用罗马数字+章名）都无法自动分段**。遇到这种情况它不会硬切，而是照常提取、让你手动指定章节。另一个诚实的设计：扫描版 PDF（没有文字层）它会检查前几页后**立刻停下并说明原因**，而不是处理完整本书后吐出一个空 Skill——你需要先自己 `ocrmypdf` 做 OCR。

## 六、三步上手

```bash
# 1. 一条命令安装到任意宿主（跨 Agent skills CLI）
npx skills add virgiliojr94/book-to-skill

# 或手动克隆到 skills 目录（以 Claude Code 为例）
git clone https://github.com/virgiliojr94/book-to-skill.git ~/.claude/skills/book-to-skill

# 2. 先检查本机各格式提取器是否就绪（无需提供文件）
python3 scripts/extract.py --check

# 3. 指定文件 / 文件夹 / glob，开始转换
/book-to-skill ./my-book.pdf
```

转换后用 `/my-book replication` 这样的方式提问，Agent 会读取对应章节、基于书里真实内容作答。它还有四种模式：完整转换、仅分析（先看提炼出的框架再决定）、从既有分析生成、以及对已有 Skill 做**增量更新/折叠合并**（新资料到了不用重做）。

不止书——内部架构文档、品牌设计手册、一叠论文加笔记、RFC/合规规范，凡是你"反复重新打开、希望自己已经背下来"的资料，都是候选输入。

## 七、我的判断：谁该用，谁先等等

**该用：**

- 手上有大量常查的技术书/内部文档，且高频向 AI 提问的人——书越厚、问得越多，24–51× 的复利越明显。
- 用 Claude Code / Copilot CLI / Hermes 等支持 Skills 标准的 Agent 的用户，产物可直接被宿主发现、按需加载。
- 注重隐私的人：提取与分析在本地运行，工具本身不上传你的文件。

**先等等或注意：**

- 指望"一键全自动、零干预"的人：扫描 PDF 要先自己 OCR；非标准章节标题要手动指定章节；生成那一步本质是调 LLM，需要你在宿主里跑、付那约 1 美元/本的模型费。
- 想分享第三方书籍 Skill 的人：项目明确提醒，生成物是衍生笔记，但**公开发布受版权书籍的 Skill 可能侵权**，第三方书请保持私有。
- 纯散文、薄薄几页的资料：杀鸡用牛刀，直接贴文本更省事。

**上线前我建议你亲自验证一件事**：拿一本你最熟的书，先跑"仅分析"模式，看它提炼出的框架名是否保留了作者的精确表述（比如"The 5 Whys"不能被泛化成"多问几个为什么"）——这正是它在 Spec 里反复强调的质量底线，也是判断转换质量最直接的办法。

---

**一句话总结**：book-to-skill 不是又一个"PDF 问答"小工具，而是把"读书"变成了一次可复利的编译——一次性付约 1 美元和十几分钟，换来之后每次提问恒定 5K token、基于原文、不幻觉的知识调用。对于真正以 AI 为生产工具的人，这笔账非常划算。
