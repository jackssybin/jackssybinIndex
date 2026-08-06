---
title: "VoxCPM2：国产开源语音合成新标杆，支持音色设计与可控声音克隆"
url: "/articles/2026/08/06/voxcpm2-tts-tutorial.html"
date: "2026-08-06T00:00:00+08:00"
lastmod: "2026-08-06T00:00:00+08:00"
description: "OpenBMB 最新开源的 VoxCPM2——一款无离散分词器的 20 亿参数多语言语音合成模型，支持自然语言音色设计、可控声音克隆，原生输出 48kHz 高质量音频，完全免费商用。本文分享实测体验和 5 分钟上手教程。"
tags: ["AI", "开源项目", "语音合成", "TTS", "VoxCPM", "声音克隆", "音色设计", "AIGC"]
topic: "AI、开源项目与工具"
topicSlug: "ai-open-source"
layout: article
contentType: article
---

# VoxCPM2：国产开源语音合成新标杆，支持音色设计与可控声音克隆

> 本文介绍 OpenBMB 最新开源的 VoxCPM2——一款无离散分词器的 20 亿参数多语言语音合成模型，支持自然语言音色设计、可控声音克隆，原生输出 48kHz 高质量音频，完全免费商用。

## 痛点：当前语音合成的困境

做内容创作、播客、语音应用的开发者和创作者，或多或少都会遇到这些问题：

1. **付费 API 太贵**：ElevenLabs、OpenAI TTS 按字符收费，长期用下来月费几十上百美元，小项目承受不起
2. **开源方案功能不全**：多数开源项目只支持基础 TTS，音色克隆要么效果差，要么不支持风格控制，音色设计更是几乎没有
3. **部署复杂**：很多方案需要复杂的环境配置，多语言支持差，中文方言更是很少覆盖
4. **商用授权不清晰**：不少优秀模型是非开源许可，商用风险大

VoxCPM2 的出现，正好解决了这些痛点。

## VoxCPM2 是什么？

VoxCPM 是 OpenBMB 推出的**无离散音频分词器**语音合成系统，通过端到端的**扩散自回归架构**直接生成连续语音表征，绕过对音频的离散编码步骤，实现高度自然且富有表现力的语音合成。

VoxCPM2 是 2026 年 4 月发布的最新版本：
- 基于 MiniCPM-4 基座构建，**20 亿参数**
- 在超过 **200 万小时**的多语种音频数据上训练
- 支持 **30 种全球语言 + 9 种中文方言**
- 支持**音色设计**（自然语言描述生成新音色）
- 支持**可控声音克隆**，可叠加风格指令
- 原生输出 **48kHz** 高质量音频
- **Apache 2.0 协议**，完全开源免费商用

![VoxCPM2 模型架构](/images/voxcpm2-tts-tutorial/voxcpm2_model.png)

## 核心功能一览

### 1. 多语言语音合成

支持 30 种全球语言，包括：阿拉伯语、缅甸语、中文、丹麦语、荷兰语、英语、芬兰语、法语、德语、希腊语、希伯来语、印地语、印尼语、意大利语、日语、高棉语、韩语、老挝语、马来语、挪威语、波兰语、葡萄牙语、俄语、西班牙语、斯瓦希里语、瑞典语、菲律宾语、泰语、土耳其语、越南语。

同时支持 9 种中文方言：四川话、粤语、吴语、东北话、河南话、陕西话、山东话、天津话、闽南话。

无需额外语言标签，直接输入原始文本即可合成。

### 2. 音色设计：用自然语言创造音色

最惊艳的功能之一：**不需要参考音频，只需要用自然语言描述，就能凭空创造出全新的音色**。

使用方式非常简单：在文本开头用括号写入音色描述即可。

```python
wav = model.generate(
    text="(年轻女性，声音温柔甜美)你好，欢迎使用VoxCPM2！",
    cfg_value=2.0,
    inference_timesteps=10,
    seed=42,
)
```

描述维度非常灵活，可以指定：
- 性别：男/女/中性
- 年龄：年轻/中年/老年/儿童
- 音色特点：温柔甜美/磁性低沉/清澈明亮
- 情绪：欢快/悲伤/沉稳/活泼
- 语速：稍快/慢速

### 3. 可控声音克隆

上传一段参考音频，模型克隆其音色，同时可以使用控制指令调节语速、情绪或风格。

```python
# 基础克隆
wav = model.generate(
    text="这是VoxCPM2生成的克隆语音。",
    reference_wav_path="path/to/voice.wav",
)

# 带风格控制的克隆
wav = model.generate(
    text="(稍快一点，欢快的语气)这是带风格控制的克隆语音。",
    reference_wav_path="path/to/voice.wav",
    cfg_value=2.0,
    inference_timesteps=10,
    seed=42,
)
```

### 4. 极致克隆：高保真续写

提供参考音频及其精确文本转录，实现基于音频续写的高保真克隆，能够精准还原声音细节特征。

```python
wav = model.generate(
    text="这是使用VoxCPM2的极致克隆演示。",
    prompt_wav_path="path/to/voice.wav",
    prompt_text="参考音频的文本转录。",
    reference_wav_path="path/to/voice.wav",  # 可选，进一步提升相似度
)
```

### 5. 实时流式合成

在 NVIDIA RTX 4090 上 RTF（Real-Time Factor）低至 ~0.3，通过 Nano-vLLM 或 vLLM-Omni 加速后可达 ~0.13，真正实现实时流式输出。

```python
import numpy as np
chunks = []
for chunk in model.generate_streaming(
    text="使用VoxCPM进行流式语音合成非常简单！",
):
    chunks.append(chunk)
wav = np.concatenate(chunks)
```

## 5 分钟快速上手

### 环境要求

- Python ≥ 3.10 (<3.13)
- PyTorch ≥ 2.5.0
- CUDA ≥ 12.0

### 安装

```bash
pip install voxcpm
```

如果你在国内，建议从 ModelScope 下载模型：

```bash
pip install modelscope
```

### 基础文本转语音

```python
from voxcpm import VoxCPM
import soundfile as sf

# 从 HuggingFace 加载
model = VoxCPM.from_pretrained(
  "openbmb/VoxCPM2",
  load_denoiser=False,
)

# 从 ModelScope 加载（国内推荐）
# from modelscope import snapshot_download
# model_dir = snapshot_download("OpenBMB/VoxCPM2", local_dir='./pretrained_models/VoxCPM2')
# model = VoxCPM.from_pretrained(model_dir, load_denoiser=False)

wav = model.generate(
    text="VoxCPM2 是目前推荐使用的多语言语音合成版本。",
    cfg_value=2.0,
    inference_timesteps=10,
    seed=42,
)
sf.write("demo.wav", wav, model.tts_model.sample_rate)
print("已保存: demo.wav")
```

运行完成后，你就会得到一个 `demo.wav` 文件，听听效果吧！

### 音色设计示例

```python
wav = model.generate(
    text="(三十岁男性，磁性低沉，语速适中)大家好，我是用 VoxCPM2 生成的语音。",
    cfg_value=2.0,
    inference_timesteps=10,
    seed=42,
)
sf.write("design-demo.wav", wav, model.tts_model.sample_rate)
```

### 命令行使用

项目还提供了方便的命令行工具：

```bash
# 音色设计（无需参考音频）
voxcpm design \
  --text "VoxCPM2带来全新语音合成体验。" \
  --output out.wav

# 带控制描述的音色设计
voxcpm design \
  --text "VoxCPM2带来全新语音合成体验。" \
  --control "年轻女声，温暖温柔，略带微笑" \
  --seed 42 \
  --output out.wav

# 声音克隆（参考音频）
voxcpm clone \
  --text "这是一个声音克隆的演示。" \
  --reference-audio path/to/voice.wav \
  --output out.wav

# 极致克隆（提示音频 + 转录文本）
voxcpm clone \
  --text "这是一个声音克隆的演示。" \
  --prompt-audio path/to/voice.wav \
  --prompt-text "参考音频转录文本" \
  --reference-audio path/to/voice.wav \
  --output out.wav
```

### 本地 Web 演示

项目自带 Gradio WebUI，一行命令启动：

```bash
python app.py --port 8808
```

然后在浏览器打开 `http://localhost:8808` 就可以交互式体验所有功能。

## 部署选项

### 生产部署：Nano-vLLM 高吞吐量推理

如需高吞吐量部署，使用 [Nano-vLLM-VoxCPM](https://github.com/a710128/nanovllm-voxcpm)，基于 Nano-vLLM 构建，支持并发请求和异步 API，在 RTX 4090 上 RTF 低至 ~0.13。

```bash
pip install nano-vllm-voxcpm
```

```python
from nanovllm_voxcpm import VoxCPM
import numpy as np, soundfile as sf

server = VoxCPM.from_pretrained(model="/path/to/VoxCPM", devices=[0])
chunks = list(server.generate(target_text="你好，我来自VoxCPM！"))
sf.write("out.wav", np.concatenate(chunks), 48000)
server.stop()
```

### 生产级部署：vLLM-Omni（官方支持）

vLLM 官方的全模态扩展 vLLM-Omni 原生支持 VoxCPM2，具备 PagedAttention KV 缓存、连续批处理，以及与 OpenAI 完全兼容的 `/v1/audio/speech` 接口。

```bash
# 从源码安装
uv pip install vllm==0.19.0 --torch-backend=auto
git clone https://github.com/vllm-project/vllm-omni.git && cd vllm-omni
uv pip install -e .
```

启动 OpenAI 兼容的 TTS 服务：

```bash
vllm serve openbmb/VoxCPM2 --omni --port 8000
```

调用示例：

```bash
curl http://localhost:8000/v1/audio/speech \
  -H "Content-Type: application/json" \
  -d '{"model":"openbmb/VoxCPM2","input":"你好，欢迎使用 VoxCPM2 on vLLM-Omni！","voice":"default"}' \
  --output out.wav
```

### 端侧推理：llama.cpp-omni

如需在端侧/消费级硬件上无 Python 运行，使用 [llama.cpp-omni](https://github.com/tc-mb/llama.cpp-omni)，基于 llama.cpp 的高性能 C++ 推理引擎，原生支持 VoxCPM2 GGUF，可在 CPU / Metal / CUDA / Vulkan 上运行。

在 Apple M4 Pro / Metal 上 RTF ~1.76（Q8_0），可以做到接近实时。

## 版本对比

| 特性 | VoxCPM2 | VoxCPM1.5 | VoxCPM-0.5B |
|---|:---:|:---:|:---:|
| 状态 | 🟢 最新版本 | 稳定版 | 旧版 |
| 主模型参数量 | 2B | 0.6B | 0.5B |
| 音频采样率 | 48kHz | 44.1kHz | 16kHz |
| 语言支持数量 | 30 | 2 | 2 |
| 音色设计 | ✅ | — | — |
| 可控声音克隆 | ✅ | — | — |
| RTF (RTX 4090) | ~0.30 | ~0.15 | ~0.17 |
| RTF Nano-VLLM | ~0.13 | ~0.08 | ~0.10 |
| 显存占用 | ~8 GB | ~6 GB | ~5 GB |

**结论**：如果你的硬件条件满足（8GB+ 显存），**直接用 VoxCPM2**，效果提升非常明显。

## 性能评测

VoxCPM2 在公开基准测试中取得了 SOTA 或可比的结果：

在 Seed-TTS-eval 中文测试集上：CER 0.97%，SIM 79.5%，优于多数同参数开源模型；英文测试 WER 1.84%，SIM 75.3%，接近闭源模型水平。

## 适用场景 & 不适用场景

**适合使用 VoxCPM2**：
- 内容创作者：播客配音、有声书、视频旁白
- 开发者：需要内置 TTS 能力的应用，不想依赖付费 API
- 创业者：低成本搭建语音产品，验证商业模式
- 多语言项目：需要支持多种语言和中文方言
- 研究学习：了解现代 TTS 架构，扩散自回归模型

**暂时不建议使用**：
- 超大批量生产级并发请求：需要自己做负载均衡，目前生态还在完善
- 极端低延迟场景：端侧 CPU 推理还是会有明显延迟
- 超高清专业级音乐音频：模型是为人声设计，不适合音乐生成

## 快速检查清单

如果你准备开始使用 VoxCPM2，照着这几步走：

1. **环境检查**：确认 Python 版本在 3.10-3.12 之间，CUDA ≥ 12.0，显存 ≥ 8GB
2. **安装**：`pip install voxcpm`，国内用户建议同时安装 `modelscope`
3. **模型下载**：从 HuggingFace 或 ModelScope 下载 VoxCPM2 权重
4. **跑通基础示例**：先运行最简单的文本转语音，验证环境正常
5. **体验核心功能**：试试音色设计（用文字描述生成音色），再试试声音克隆
6. **部署**：开发测试用原生 PyTorch，生产环境用 vLLM-Omni，端侧用 llama.cpp-omni

## 资源链接

- GitHub 仓库：https://github.com/OpenBMB/VoxCPM
- 官方文档：https://voxcpm.readthedocs.io/zh-cn/latest/
- HuggingFace 模型：https://huggingface.co/openbmb/VoxCPM2
- ModelScope 模型：https://modelscope.cn/models/OpenBMB/VoxCPM2
- 在线体验：https://huggingface.co/spaces/OpenBMB/VoxCPM-Demo
- 国内镜像体验：https://voxcpm.modelbest.cn/
- 技术报告：https://arxiv.org/abs/2606.06928

## 结语

VoxCPM2 是国产开源 TTS 领域的一个重要进展，把「音色设计」「可控克隆」「多语言支持」这些之前只有闭源服务才有的功能，以完全开源的方式带给了社区。对于需要语音合成能力的开发者和创作者来说，这确实是一个值得尝试的新选择。

如果你正在寻找一个功能完整、可商用、质量不错的开源 TTS 方案，不妨花 5 分钟按照本文的步骤跑一下 demo，感受一下效果。
