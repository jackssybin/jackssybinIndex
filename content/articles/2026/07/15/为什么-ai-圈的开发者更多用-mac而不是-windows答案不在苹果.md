---
date: 2026-07-15
slug: 为什么-ai-圈的开发者更多用-mac而不是-windows答案不在苹果
title: 为什么 AI 圈的开发者更多用 Mac，而不是 Windows？答案不在苹果
description: 一个反直觉的答案先摆在这里：真正在训模型的人，用啥笔记本都行。
categories: ['AI', '工具测评']
contenttype: article
draft: false
cover: "/images/为什么-ai-圈的开发者更多用-mac而不是-windows答案不在苹果/cover.png"
---

一个反直觉的答案先摆在这里：真正在训模型的人，用啥笔记本都行。

因为训练不发生在笔记本上，发生在机房里那些嗡嗡响的 NVIDIA 卡上。

「AI 大佬都用 Mac」其实是幸存者偏差。会开会、上台演讲、拍 YouTube、发 Twitter、做产品 demo 的人，天然更容易被你刷到。他们坐在会议室、咖啡馆、直播间，掏出 MacBook 敲两下，这个画面被反复曝光，你就以为「AI = Mac」。

而真正训 70B 大模型的博士生和 SRE，坐在温度 22 度、风扇 70 分贝的机房里，用 SSH 从任何一台破笔记本连过去干活。他们用啥本子，你根本看不见。

## Mac 到底强在哪一档

Mac 在 AI 场景里的强项只有一个：本地推理。而且这个优势不是苹果做了什么 AI 加速，是硬件设计的巧合。

关键在「统一内存」。M3 Max 最高 128GB，Mac Studio M2 Ultra 最高 192GB，CPU 和 GPU 共享同一块物理内存池——对 GPU 来说，这就等于 192GB 显存。

再看消费级 Windows 台式机：

- RTX 4090：24GB
- RTX 5090：32GB
- RTX A6000 Ada：48GB，五万块一张
- H100：80GB，一张 20 万起

![Mac 统一内存 vs 消费级 NVIDIA 显存对比](/images/为什么-ai-圈的开发者更多用-mac而不是-windows答案不在苹果/01-comparison-memory.png)

一个 70B 大模型 FP16 精度要 140GB 显存，INT4 量化后也要 35GB。

所以：4090 连量化过的 70B 都装不下；M4 Max 128GB 的 MacBook Pro 可以直接把 70B 量化模型加载进去跑，还能同时开着 IDE、Chrome、Slack；Mac Studio 192GB 甚至能跑 70B FP16。

搞「本地跑 Llama 70B、Qwen 72B、做 agent、做 RAG demo」的人大概率用 Mac，就是这个理由。消费级 Windows 单卡跑不动，多卡工作站的成本和噪音又把大部分个人开发者劝退了。

## 训模型完全是另一回事

如果你的活是训模型或者微调 30B 以上，Mac 立刻不合适。

原因很直接：CUDA。PyTorch、TensorFlow、JAX、绝大多数开源训练脚本都是 CUDA 优先。Apple 的 Metal 和 MLX 能用，但生态、社区、可参考 benchmark 数量比 NVIDIA 少一个数量级。你想跟着 GitHub 上任意一个训练 repo 走一遍流程，Linux + NVIDIA 是最省事的组合。

所有严肃训练最终都跑在云 GPU 或者自建集群上，不在任何一台桌面机器上。你的笔记本只是终端——用 MacBook 通过 SSH 连到 8 张 H100 的服务器上干活，机器叫啥其实无所谓。

## 顺带说一下 Unix 这一层

macOS 天然是 Unix，`brew install` 一路推平 Python、Docker、Git。同一份 AI 论文代码，在 Mac 上大概率 `git clone → pip install → 跑通`；在原生 Windows 上你会先花两小时和路径分隔符、编码、CUDA 驱动版本、WSL 网络代理搏斗。

这不是 Windows 不行，是主流开源社区默认假设你用 Unix。

## 一张判断表：你在干哪种活

![四种 AI 工作与推荐设备匹配表](/images/为什么-ai-圈的开发者更多用-mac而不是-windows答案不在苹果/02-comparison-workload-device.png)

- 训模型 / 微调 30B+ / 分布式训练：Linux 工作站 + NVIDIA，或者直接上云 GPU；
- 本地跑 30B-70B 做推理 / agent / RAG：Mac 128GB 或 192GB 目前最合适；
- 跑 7B-13B 小模型或调 API：Mac、Windows + 4090、Linux 都行，看你顺手；
- 应用层代码 + 论文阅读 + 出差路演：Mac 便携续航赢在这一档。

## 最后补一个前提

Mac 这波 AI 优势是有窗口期的。它建立在「消费级 NVIDIA 显存增长慢」这个前提上。

哪天 NVIDIA 出 48GB 或 64GB 的消费级卡，或者 AMD、Intel 拿出便宜的大显存 GPU，这个窗口就会收窄。买 Mac 是为了跑模型，不是为了信仰。

所以「为什么 AI 圈用 Mac 多」更准确的答案是：做应用层和本地推理的开发者用 Mac 比例偏高；做训练的从业者用啥都行，因为训练早就不在笔记本上跑了。你能刷到的那批人，多半是前者。

想清楚自己每天在干哪种活，再去挑机器，比看别人用啥有用得多。