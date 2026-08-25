---
date: 2026-07-15
slug: codex-换上-gpt-56-之后我删掉了-9-个-skills
title: Codex 换上 GPT-5.6 之后，我删掉了 9 个 Skills
description: 上周我把 Codex 里常驻的 skills 从 12 个砍到 3 个。
categories: ['AI 编程', '工具测评']
contenttype: article
draft: false
cover: "/images/codex-换上-gpt-56-之后我删掉了-9-个-skills/cover.png"
---

上周我把 Codex 里常驻的 skills 从 12 个砍到 3 个。

不是这些 skills 写得不好，也不是我要跟 skills 生态划清界限。就是很俗气的一个理由：同样一个任务，账单从两三美金变成十几美金，翻一眼 usage 就能看清楚，input token 的九成花在了同一堆 skill markdown 上，被 agent loop 反复重付了几十次。

![Skills 常驻成本对比](/images/codex-换上-gpt-56-之后我删掉了-9-个-skills/01-skills-cost-comparison.png)

## 便宜模型时代，Skills 的 token 成本是"隐身"的

Skill 说白了就是一段常驻在 system prompt 前面的 markdown：什么时候触发、工作流长什么样、附带一堆参考文件。写得越细越顺手，一个中等 skill 3k~5k token，10 个常驻加起来三五万起步，再叠上项目 rules 和对话历史，一次 request 前缀 40k 是很常见的量。

Codex 之前默认用便宜快模型的时候，这些 token 几乎不显眼。input 单价低、思考浅、一个任务五轮就跑完。你付出的是"省下写 prompt 的时间"，成本小到没人算。

## 换到 GPT-5.6 高档位，账突然全冒出来

Sol Ultra High 之后两件事同时变了。

一是每一步 reasoning token 数量往上翻，模型内部一次思考就烧掉几千甚至上万。二是一个任务从五轮变成二十轮、五十轮，agent 反复 self-review、重跑测试、改代码。

每一轮都得重付那个 40k 前缀。prompt caching 打到五折，二十轮下来单任务 input token 数量级还是几百 K 起步，reasoning token 再叠一层。所谓"Token 刺客"，不是模型突然贪心，是原本免费搭车的那堆 skill 开始按里程收费。

## 官方说是"用户低估成本 + 版本 bug"，一线开发者说是 Skills，谁更接近真相

其实说的是同一件事的两面。

bug 是短期变量，能修。用户不熟悉高档定价也能靠更清晰的 usage 提示缓解。真正结构性的成本来源，是过去两年整个 agent 生态在 skill、rules、instructions 上堆的东西——它们在便宜模型上是净收益，一换贵模型立刻变负债。之前的账，5.6 一次性照了出来。

## 我现在判断一个 Skill 该不该常驻，就三个问题

不是"要不要用 Skills"，而是"这个具体 Skill 该不该常驻加载"。按顺序问：

过去 30 天你真的用了它几次？少于 3 次一律不常驻，写得再漂亮也改成 per-task 手动加载。

它每次进来多少 token？超过 5k 的 skill，除非每天都会触发，否则改成"短触发头 + 详细内容按需读文件"：触发头只留任务描述、判断条件、指向文件的路径，正文丢到 references 里，agent 用得到再 read_file。

关掉它之后，同样任务的 token 是涨了还是降了？做一次简单 A/B——同一个 prompt 跑两次，一次开这个 skill、一次关。关掉后 total token 降超过 20%、output 质量看不出差别，这个 skill 就不配常驻。

第三步最容易跳过。很多人写完 skill 默认它有价值，从没量化过。真去跑一遍会发现，agent 类任务里大多数 skill 只在开头一两轮真正被用到，后面几十轮循环它就是纯 token 税。

## 换个视角看这件事

这题跟前段时间"prompt 是不是死了"那场争论其实是同一件事——**成本和时间在系统里会流动，从一个地方消失，会在另一个地方冒出来**。

Skills 让你省了写 prompt 的时间，代价是把成本压到每次调用的 input token 上；agent loop 让你省了操作步骤，代价是把成本压到 reasoning token 和上下文膨胀上。便宜模型时代这些账看不见，贵模型时代账就现形了。

真的每天在用 5.6 这类模型的人，接下来招人问的问题也会变：你怎么控 context 预算？哪些 rules 常驻、哪些按需加载？agent 循环里怎么做 checkpoint 减少无谓重跑？——这些问题过去只有做基础设施的人在想，现在写业务 agent 的人也得懂。

Skills 没死，只是变贵了。从"写得越丰富越好"变成"按 token 预算做取舍"，跟工程里其他一切资源规划没什么两样。