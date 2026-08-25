---
date: 2026-07-04
slug: 阿里禁用-claude-这件事很多人第一反应就搞错了
title: 阿里禁用 Claude 这件事，很多人第一反应就搞错了
description: 7 月 3 日，阿里内部通知全员卸载 Anthropic 全线产品，Sonnet、Opus、Fable、Claude Code、Agent 类工具，一个不留。
categories: ['AI 编程', '工具测评']
contenttype: article
draft: false
cover: "/images/阿里禁用-claude-这件事很多人第一反应就搞错了/cover.png"
---

7 月 3 日，阿里内部通知全员卸载 Anthropic 全线产品，Sonnet、Opus、Fable、Claude Code、Agent 类工具，一个不留。

新闻一出来，评论区分成两派：一派说"又要卡脖子了"，一派说"抵制外国 AI 好样的"。

两派都跑偏了。

## 真正的因果关系，是反过来的

去翻 Anthropic 的 Usage Policy，那条"不向中国资本控股 50% 以上的实体提供服务"，早就写在里面。2024 年下半年 Anthropic 甚至进一步收紧：中国公司的海外子公司也算。

意思是，阿里员工过去用海外账号 + VPN 在公司网络里跑 Claude 的做法，从来就不在 Anthropic 允许的范围里。真出事，责任是在使用方，不在服务方。

所以阿里这次的动作是**补合规**，不是**发起对抗**。它更像是一个大公司的法务和风控终于坐不住了：员工大规模灰色使用一个明确不服务我们的产品，风险敞口不能再挂着。

## 顺着这一层，几个流行解读就自己塌了

"这是中美 AI 脱钩信号"——脱钩早就发生了，Anthropic 主动切的，阿里只是响应。

"阿里要保护通义"——阿里内部一直在用通义，不是新事。

"工程师会被卡住"——过去一年冒出来的国产编码模型，早就不是替补席水平。

## 工程师这一层，值得看的其实是替代梯度

比"该不该禁"更实用的问题是：如果你原来重度用 Claude Code，明天开始切到哪个？

我把过去半年自己和朋友们踩过的路径整理成一张表：

![国产编码模型替代梯度](/images/阿里禁用-claude-这件事很多人第一反应就搞错了/02-comparison-domestic-coding-models.png)

几个要点，说得直一点：

**Agent 编码党**：Cursor 换国内模型 endpoint，或者 Continue + Qwen3-Coder / DeepSeek-V3。Continue 是 VS Code 插件，指向任何 OpenAI 兼容 endpoint 都行，国内厂家的 API key 填上就能用。

**长上下文党**：切 Kimi K2 或 Qwen-Long。别硬用 DeepSeek，长文档它现在还不是最佳解。

**离线党**：Aider + 本地 Ollama + Qwen3-Coder-32B 量化版。一张 4090，或者 32G 内存的 M 系列 Mac 都能跑，日常改代码足够。

## 一条要划清的心智线

公司账号、公司设备、公司网络下，不要碰任何白名单外的 AI 服务。

不是政治正确，是自我保护。以前公司睁一只眼闭一只眼是灰色地带；一旦内部通知发出来，性质就变了。出事的时候没人会替你兜。

## 一个有点讽刺的画面

Anthropic 在 policy 里把中资企业推开的那一刻，也是通义千问在中国大公司里彻底站稳的那一刻。

我的判断是，通义灵码在阿里内部的渗透率会在三个月内被拉满，成为编码工具的默认入口。Anthropic 用它自己的 usage policy，帮阿里完成了一次全员迁移，比任何外部营销都管用。

## 可以直接抄的一份清单

1. 现在正在用的 Claude prompts、agent 配置，导出备份，别只留云端。
2. 主力工具切到 Cursor / Continue / Aider，API 层换成国内模型。
3. 私活账号和公司账号严格隔离，公司设备不装私人 AI 客户端。
4. 代码片段进 AI 之前，先想一遍：敏感度是什么，这个 AI 服务合规状态是什么。
5. 每两个月刷一次 SWE-bench、LiveCodeBench——国产和 Claude 的差距在快速缩。

真正的门槛从来不是"能不能用 Claude"，是你手里的活能不能干完。工具会换，本事换不了。