---
title: "叫 8B 实际 175 亿参数：我把商汤 SenseNova-U1 克隆下来，拆清了原生统一多模态这套架构"
slug: "sensenova-u1"
date: 2026-11-24
draft: false
categories: ["开源项目", "AI 大模型"]
tags: ["开源", "商汤", "SenseNova", "多模态", "NEO-unify", "统一模型", "图像生成", "MoT", "本地部署", "Apache2.0"]
cover: "/images/sensenova-u1/cover-zhihu.png"
description: "商汤 OpenSenseNova 开源的 SenseNova-U 系列是基于 NEO-unify 的原生统一多模态模型家族，GitHub 6989 Star、Python、Apache-2.0。本文基于本地真实克隆与逐文件核验而非读 README 复述：实测 src 39 个 py 共 11065 行、training 154 个 py 共 51837 行、tests 13 个 2829 行，是含完整训练/推理/评测的工程仓。文章讲清三件反直觉的事。第一，命名陷阱：8B-MoT 实际总参数 17.552B（依据 docs/parameter_breakdown.md），由生成 transformer 8.186B（46.64%）、理解 transformer 8.121B（46.27%）、共享层 1.245B（7.09%，embedding 与 lm_head 各 622.33M）构成，MoT 即 Mixture-of-Transformers，8B 指每条激活通路（理解 9.366B、生成 9.431B）而非全模型。第二，路线差异：传统多模态是视觉编码器+LLM+VAE/扩散的模块拼接，NEO-unify 从 U1.5 起去掉独立视觉编码器和 VAE，让理解与生成专家在同一模型内按任务切换、共享文本输入输出，用 flow-matching 生成、支持原生 4K，U1.6 更把生成-检查-修改做成同一次生成内的原生自修正。第三，落地可行性：bf16 全量约 35.1GB，官方提供 Native FP8/INT8、GGUF Q4_0/Q6_K/Q8_0 与 4步/8步 LoRA，balanced 配置可在单卡 24GB 显存加 64GB 内存运行，依赖仅 12 个直接包；并给出 U1/U1.5/U1.6 三代差异、五类示例任务（t2i/editing/interleave/vqa/serving）与谁该现在上手、谁该缓一缓的判断。"
---

大模型这两年有个争论一直没停：理解图像和生成图像，到底应该是两个模型拼起来，还是一个模型原生就都会？商汤 OpenSenseNova 开源的 [SenseNova-U](https://github.com/OpenSenseNova/SenseNova-U1) 系列，给出的答案是后者——他们管这套架构叫 NEO-unify，原生统一范式。

我把整个仓库克隆到本地逐层拆了一遍（不含权重约 748MB，权重另下），先抛一个最反直觉的发现：它名字里写的是 **8B-MoT，但实际总参数是 17.552B**，差了一倍多。这篇文章就从这个命名陷阱讲起，把它的架构思路、三代演进和本地部署门槛一次讲清楚。所有关键数字我都对照了仓库里的源文件，不是照抄宣传文案。

## 一、先拆参数：8B-MoT 为什么其实是 175 亿

很多人看到 8B 就以为这是个 80 亿参数的小模型，这是第一个坑。仓库里专门有一份 `docs/parameter_breakdown.md`，还配了 `scripts/inspect_model_params.py` 脚本，让你加载 checkpoint 后自己解析参数名统计。我核对了它给出的结果：

![8B-MoT 真实参数拆解](/images/sensenova-u1/02-parameter-breakdown.png)

总参数 **17.552B**，bf16 下约占 35.1GB，分成三个互斥的组：生成 transformer 8.186B（占 46.64%）、理解 transformer 8.121B（占 46.27%）、共享层 1.245B（占 7.09%，就是 `embed_tokens` 和 `lm_head` 各 6.22 亿）。如果按"激活通路"来算，理解通路是 8.121B 加共享层等于 9.366B，生成通路是 8.186B 加共享层等于 9.431B——共享层在两个通路里各被计一次。

这里的 MoT 不是大家更熟的 MoE（Mixture of Experts，混合专家），而是 **Mixture-of-Transformers，混合 Transformer**：理解和生成是两套独立的 transformer 专家，运行时按当前任务只激活其中一套，再共享文本的输入输出层。所以名字里的"8B"描述的是单条通路的量级，而不是整个模型的总参数量。看这类模型的参数，一定要读参数分解文档，望文生义很容易在做显存规划时翻车。

## 二、它反对的是什么：模块拼接 vs 原生统一

要看懂 SenseNova-U 的价值，得先看懂它在跟谁对照。

![模块拼接与原生统一两条路线对照](/images/sensenova-u1/01-architecture-compare.png)

过去主流的多模态系统是"拼接派"：一个独立的视觉编码器负责看图、一个 LLM 当大脑做语言推理、再挂一个 VAE 加扩散或流匹配模型负责画图，三个模块各有各的权重，靠胶水代码对接。这种方案能快速组合出可用系统，但结构性问题也明显：模块多、依赖多、显存占用高；理解和生成的训练目标不一致，很难端到端联合优化；想在一段话里自然地图文交错输出，要在多个模块之间反复搬运。

NEO-unify 走的是原生统一路线：理解专家和生成专家共存于同一个模型，共享 embedding 和 lm_head。到了 **U1.5，官方进一步把独立的视觉编码器和 VAE 都去掉了**，换成无 VAE 的视觉路径，加上具有空间连续性的图像重建方法，用 flow-matching 做生成，支持最高原生 4K 分辨率。我在 `src/sensenova_u1/models/neo_unify/` 下也看到了对应的代码组织：`modeling_qwen3.py`、`modeling_qwen3_moe.py`、`modeling_neo_vit.py` 和负责 flow-matching 的 `modeling_fm_modules.py` 放在一起，理解与生成确实是在同一套模型代码里实现的，而不是两个独立项目硬拼。

这套设计最直接的红利，体现在 U1.6 主打的**原生自修正**上。普通模型要做"生成后检查再修改"，通常得在外部搭一个 agent 循环，让另一个模型看图、找错、再调生成接口。而 U1.6 因为同一个模型既能理解自己刚画的图、又能重新生成，所以能把"生成—检查—修改"塞进同一次生成里：它生成一张信息图后，会自己对照原始提示词检查文字模糊、错字、乱码、编号错误，然后直接出修改稿。这是统一模型才有的结构性优势，拼接派要实现就得跨模块来回传图。

## 三、三代演进：U1、U1.5、U1.6 分别解决什么

仓库同时维护三代权重和文档，我把它们的迭代逻辑梳理成一条时间线。

![U1 到 U1.6 的三代演进](/images/sensenova-u1/03-version-timeline.png)

**U1** 是首发，2026 上半年推出，首次在一个模型里同时实现视觉理解和图像生成，提供 8B、A3B 以及图文交错（Interleaved）等多种权重，对应的论文是 arXiv 2605.12500。它验证了这条路能走通，但还保留了相对完整的传统视觉组件。

**U1.5**（2026 年 8 月）是架构上的关键一跃：基于 8B-MoT，去掉独立视觉编码器和 VAE，引入空间连续性重建，补上原生 4K 生成、文字渲染和图像编辑能力，论文 arXiv 2609.11929，还出了完整技术报告。后面的 TailSteer 完整权重专门改善连续多轮图像编辑的稳定性，8 步 LoRA 则用来加速。

**U1.6** 就在我写这篇的当天（2026-11-24）发布，重点从"能做"转向"好看且准确"：一是美学，人像、海报、插画的综合美感在官方主观评测里比 U1.5 提升 10%；二是前面说的原生自修正，在 UltraTextBench 这种高文字密度信息图任务上，自修正比单次生成平均相对提升 7%；同时发布了 4 步和 8 步蒸馏模型，并正式上线了 ComfyUI。需要说明，这两个百分比是官方基准和主观评测数据，第三方独立复现还有待观察，引用时我会保留这个限定。

## 四、工程体量：这是个完整的训练推理评测仓，不是推理壳

克隆下来最让我意外的是它的代码完整度。我统计了 Python 代码规模：`src/` 推理与模型代码 39 个文件、约 11065 行；`training/` 训练代码多达 154 个文件、约 51837 行；`tests/` 有 13 个测试文件、2829 行；`examples/` 示例 6 个文件、2450 行。这意味着它不是只给你几个推理脚本的"模型发布包"，而是把训练流程也开放出来了，对想研究统一多模态怎么训练的人价值很大。

示例覆盖了五类任务，目录划分很清楚：`t2i` 文生图、`editing` 图像编辑、`interleave` 图文交错（里面还专门有 `self_correction.py` 自修正示例）、`vqa` 视觉问答、`serving` 服务化，外加 `comfyui` 集成说明。我看了 t2i 推理脚本支持的参数，除了常规的 prompt、seed、num_steps，还有 `vram_mode`、`attn_backend`、`gguf_checkpoint`、`lora_path`、`cfg_batching` 以及 `--think` 这类开关，说明显存调度、量化加载、LoRA 加速都做成了一等公民。

工程细节上还有几点值得一提：依赖非常克制，`requirements.txt` 里直接依赖只有 12 个，核心就是 torch 2.8、transformers、accelerate、safetensors 这些，用 uv 锁定环境、Python 3.11；文档是彻底的中英双语，45 篇 markdown 里有 22 篇带 `_CN` 版本；仓库根目录放了 `AGENTS.md`，专门给 AI 编程助手规定了读文档的入口；评测通过三个 git 子模块接入 evalscope、EASI 和 LightLLM；服务化则给了基于 Docker 的 LightLLM + LightX2V 部署方案。配套还有 pre-commit、CodeRabbit 和一整套测试，规范度在国产开源模型里属于第一梯队。

我还核对了测试和运行时工具，`tests/` 里的用例不是摆设：`test_cfg_batching.py`、`test_generation_rope.py`、`test_grouped_gemm.py` 对应它的 CFG 批处理、生成式 RoPE 和分组矩阵乘这些关键算子，`test_layer_offload.py`、`test_quantization_artifacts.py`、`test_gguf_loader` 相关校验则保证层卸载和量化权重能正确加载。`src/sensenova_u1/utils/` 下能看到 `layer_offload.py`、`offload.py`、`quant_runtime.py`、`gguf_loader.py`、`lora.py`、`profiler.py` 这一整套工具，这也解释了它为什么敢宣称单卡 24GB 能跑——靠的是显存分层卸载、运行时量化和 Profiler 一起把 35GB 的全量权重压进更小的显存，而不是单纯让用户硬扛。

## 五、本地部署：显存预算和权重怎么选

这是大多数人最关心的部分。先给结论：它不像很多炫技模型那样只能云端跑，但也不是消费级小卡能轻松驾驭的。

![本地部署的权重选型与适用人群](/images/sensenova-u1/04-deploy-matrix.png)

官方 README 给的参考是：balanced 配置按**单卡 24GB 显存 + 64GB 系统内存**规划，另外给 U1.6 权重预留约 **35GB 磁盘**。最小上手路径也很直接：`git clone` 之后 `uv sync --locked --python 3.11` 建环境，用 `hf download` 把 U1.6-8B-MoT 权重下到本地，再跑 `examples/t2i/inference.py`，指定 bucket、宽高比、步数、显存模式和注意力后端就能出图。

权重形态有四种，对应不同硬件：追求完整效果用 BF16 原版分片，但要准备 35GB 显存；想在 24GB 单卡跑就选 Native 的 FP8 W8A8 或 INT8 ConvRot W8A8；显存更紧张、习惯 llama.cpp 生态的，可以用 GGUF 的 Q4_0、Q6_K、Q8_0；想出图快就搭配 4 步或 8 步 LoRA（8 步 V2 还改善了色彩和过锐问题），注意 LoRA 是适配器，必须配基座用。

## 六、谁该现在上手，谁先缓一缓

**适合现在上手的：** 研究统一多模态架构的算法工程师，这里有 5 万多行训练代码和完整文档可学；需要在单卡上同时做图像理解、生成、编辑、图文交错的开发者；做信息图、海报这类对文字准确性要求高、想用原生自修正减少返工的团队；以及已经在用 ComfyUI 的人，官方节点已经上线，接入成本低。

**建议先缓一缓的：** 只有 8 到 16GB 显存、又不愿意折腾量化的人，即使 Q4 也偏紧，可以等社区出更小的蒸馏版；只想调 API、不打算本地部署的，直接用官方在线 Demo（unify.light-ai.top）就行，没必要克隆；还有那种纯做文生图、追求极致出图量、完全不需要理解和交错能力的，成熟的 SD、Flux 生态可能反而更顺手。

最后提醒一个许可细节：仓库代码是 Apache-2.0，但**模型权重的使用条件要以各个 HuggingFace 模型卡的许可为准**，两者不是一回事，商用前务必单独确认。

## 结语

SenseNova-U 系列真正值得关注的，不是它又能生成什么风格的图，而是它用一个可运行的开源工程，证明了"理解和生成共用一个原生模型"这条路线在 8B 通路量级、单卡 24GB 的条件下跑得通，还能把自修正这种过去要靠外部编排的能力内化进模型。那个"8B 实为 175 亿"的命名误会，恰好是理解它的最好入口——看懂了 MoT 怎么让两套专家共享一套底座，你就看懂了原生统一到底统一在哪。

项目地址：[https://github.com/OpenSenseNova/SenseNova-U1](https://github.com/OpenSenseNova/SenseNova-U1)
