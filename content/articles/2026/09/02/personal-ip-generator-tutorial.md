---
title: "五分钟搞定个人IP头像和表情包：Codex开源技能personal-ip-generator实测"
slug: "personal-ip-generator-tutorial"
url: "/articles/2026/09/02/personal-ip-generator-tutorial.html"
date: "2026-09-02T00:00:00+08:00"
lastmod: "2026-09-02T00:00:00+08:00"
description: 做个人IP需要头像和表情包，找设计师要几百块，自己用AI生成要折腾半天。这个Codex开源技能通过向导式流程，五分钟就能帮你生成一套统一风格的成品，直接能用。
categories: ["AI工具", "开源"]
tags: ["personal-ip-generator", "AI", "头像生成", "Codex", "开源"]
topic: "AI工具"
topicSlug: "ai-tools"
cover: "/images/personal-ip-generator-tutorial/cover-wechat.jpg"
layout: article
contentType: article
draft: false
---

# 五分钟搞定个人IP头像和表情包：Codex开源技能personal-ip-generator实测

> **TL;DR**：personal-ip-generator 适合**需要快速生成统一风格个人IP头像和表情包的自媒体创作者、AI开发者和Codex用户**，不适合追求极致专业美术品质的商业项目。核心优势是**向导式流程、标准化输出、无需自己编写AI提示词**，核心限制是**需要Codex环境支持**。

## 问题背景

做自媒体、开公众号、玩开源，谁不需要一个像样的个人IP？

找设计师定制一套头像+表情包，便宜的也要三五百，贵的上千。自己用AI生成呢？又要反复折腾提示词，生成出来的风格不统一，还要自己拼图排版，折腾大半天也出不了成品。

今天给大家介绍一个专门解决这个问题的开源Codex技能：**personal-ip-generator**。它把整个生成流程标准化了，你只需要回答几个问题，就能得到一张统一排版的成品图——左侧是主头像，右侧是九宫格表情包，直接拿来就能用。

## 项目是什么？

personal-ip-generator 是一个专为 OpenAI Codex 设计的技能插件，它通过向导式的一问一答，帮你从真人照片或角色设定出发，选择画风、锁定特征与配色，并交付统一的头像和表情包。

### 核心功能

- 支持两种模式：**人物 IP** 与 **代表形象 IP**
- 内置五个可选画风：彩绘风、线条风、3D 风、插画风、手办风；也支持用户上传临时的自定义风格参考图
- 固定生成流程：IP 类型 → 风格 → 强化特征 → 配色 → 提示词确认 → 单张 3×2 六款编号预览 → 选择方案 → 正式头像与表情包
- 最终交付为一张 4×3 成品板：左侧正式头像，右侧九宫格中文标注表情包
- 可选导出九张透明背景表情贴纸；默认只交付成品板
- 仅提取抽象视觉特征，不复制参考图中的人物、文字、商标、构图或具体角色

## 预设画风详解

| ID | 名称 | 主要特征 |
|---|---|---|
| `caihui-feng` | 彩绘风 | 温暖纸张感、圆润角色、柔和表情，适合文艺类个人IP |
| `xian-tiao-feng` | 线条风 | 黑白线稿、极简五官、留白构图，适合技术类博主 |
| `3d-feng` | 3D 风 | 潮流 3D、柔和材质、立体光影，当下最流行风格 |
| `illustration-feng` | 插画风 | 平面色块、人物插画、利落轮廓，简约大方 |
| `figure-feng` | 手办风 | 收藏手办质感、立体造型、产品级陈列，适合科技类IP |

完整的风格约束和参考素材请见项目仓库的 [references/style-presets.md](https://github.com/Gayaya999/personal-ip-generator/blob/main/references/style-presets.md)。

以下是每种风格的参考示例：

### 彩绘风 (caihui-feng)
![彩绘风示例](/images/personal-ip-generator-tutorial/caihui-feng-preview.png)

### 线条风 (xian-tiao-feng)
![线条风示例](/images/personal-ip-generator-tutorial/xian-tiao-feng-preview.png)

### 3D 风 (3d-feng)
![3D风示例](/images/personal-ip-generator-tutorial/3d-feng-preview.png)

### 插画风 (illustration-feng)
![插画风示例](/images/personal-ip-generator-tutorial/illustration-feng-preview.png)

### 手办风 (figure-feng)
![手办风示例](/images/personal-ip-generator-tutorial/figure-feng-preview.png)

## 工作流

```text
IP 类型 → 风格 → 强化特征 → 配色 → 提示词确认
       → 一张 3×2、带 1–6 编号的六款预览
       → 用户选择编号 → 正式头像 + 九宫格表情包成品板
       → （可选）透明底表情贴纸
```

最贴心的设计是：编号和中文批注由宿主在合成时叠加，不要求图像模型生成文字，从根源上减少了乱码和错位，解决了AI生成文字经常翻车的痛点。

## 安装使用教程

### 安装步骤

将本仓库克隆到 Codex skills 目录：

```bash
git clone https://github.com/Gayaya999/personal-ip-generator.git \
  ~/.codex/skills/personal-ip-generator
```

随后在 Codex 中使用 `$personal-ip-generator`，或直接请求创建个人 IP、头像或表情包。

### 使用流程

我给大家梳理一遍实际使用流程：

1. **选择IP类型**：你要做「人物IP」还是「代表形象IP」？
2. **提供参考**：人物IP上传真人照片，代表形象IP输入文字描述
3. **选择画风**：从五种预设里面挑一个
4. **强化特征**：告诉AI哪些特征需要重点保留，比如「戴眼镜、短发、络腮胡」
5. **指定配色**：说说你喜欢暖色调还是冷色调，有没有特定想要的颜色
6. **生成预览**：一次性出6张方案，编号1到6
7. **选择方案**：告诉你喜欢哪一个数字
8. **输出成品**：生成最终的成品板，包含主头像和九宫格表情包

整个过程不到五分钟就能完成。

## 成品输出

最终输出一张整合好的成品图：

- 左侧：**一张大尺寸正式头像** → 拿来做公众号头像、GitHub头像直接用
- 右侧：**九宫格九个表情包** → 涵盖开心、思考、点赞、惊讶这些常用场景，每个表情都有中文标注
- 整体排版整齐，保存图片就能用，省去自己拼图的功夫

![项目封面]($IMAGE_PATH$/cover-wechat.jpg)

如果你需要单独的表情贴纸，可以选择导出九张透明背景PNG，方便用到各个地方。

## 优缺点分析

### 优点

✅ **零学习成本**：向导式流程，不用写提示词，新手也能直接用  
✅ **输出标准化**：固定排版，拿到就能用，省去自己拼图排版的时间  
✅ **质量可控**：先出六款预览，选好了再出成品，减少试错成本  
✅ **设计贴心**：解决了AI生成文字乱码错位这个常见痛点  
✅ **五种预设风格**：覆盖大多数场景需求，也支持自定义  
✅ **开源免费**：MIT协议，可商用可二次开发

### 缺点

❌ **环境依赖**：必须有Codex环境才能使用，没有Codex用不了  
❌ **风格有限**：预设只有五种，想要更多风格需要自己扩展  
❌ **模型依赖**：最终生成质量依赖你使用的AI绘画模型，模型不行结果也会打折扣

## 适合谁用？

**强烈推荐使用：**
- ✅ 正在做自媒体/公众号，需要快速搞定个人IP形象
- ✅ 你日常在用Codex，想省点事
- ✅ 开源项目维护者，想给项目做个代表形象
- ✅ 偶尔用一次，不想花大价钱找设计师

**不推荐使用：**
- ❌ 商业品牌做专业设计，还是找专业设计师比较稳妥
- ❌ 没有Codex环境，又不想搭建环境
- ❌ 需要大量表情包（这个项目只做九宫格）

## 总结

如果你正在为个人IP头像发愁，又不想花大价钱找设计师，恰好你又在用Codex，那这个项目真的可以试试。

五分钟得到一套统一风格的头像+表情包，帮你省了钱又省了时间，还要啥自行车？

**项目地址**：https://github.com/Gayaya999/personal-ip-generator

快去试试吧，生成你的专属IP形象！

![知乎封面]($IMAGE_PATH$/cover-zhihu.png)
