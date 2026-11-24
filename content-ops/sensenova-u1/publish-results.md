# SenseNova-U1 三端推广发布记录

- 项目：OpenSenseNova/SenseNova-U1（商汤 NEO-unify 原生统一多模态模型家族）
- 仓库 URL：https://github.com/OpenSenseNova/SenseNova-U1
- 在线 Demo：https://unify.light-ai.top/
- 发布日期：2026-11-24
- 本地工作目录：content-ops/sensenova-u1/
- 叙事骨架：narrative-spine.json（六段 spine 校验通过，3 标题候选）

## 一手实测（本地克隆，非照抄 README）

- GitHub：6989 star / 539 fork / 21 open issue，2026-04-17 创建，Python，Apache-2.0（代码；权重另看模型卡）
- 最新版本 U1.6（2026-11-24 发布），含 4步/8步蒸馏，ComfyUI 上线
- **核心纠正/洞察：8B-MoT 实际总参数 17.552B**（依据 docs/parameter_breakdown.md，数字逐一核对一致）
  - 生成 transformer 8.186B(46.64%)、理解 8.121B(46.27%)、共享 1.245B(7.09%，embedding+lm_head 各622.33M)
  - 通路口径：理解 9.366B / 生成 9.431B（共享两边各计一次）；bf16 约 35.1GB
  - MoT=Mixture-of-Transformers（非 MoE），8B 指单通路
- 代码规模：src 39 py=11065 行、training 154 py=51837 行、tests 13=2829 行、examples 6=2450 行
- examples 五任务：t2i/editing/interleave(含self_correction)/vqa/serving + comfyui
- 架构：U1.5 起去独立视觉编码器与 VAE，flow-matching，原生 4K；U1.6 原生自修正（美感+10%、信息图自修正+7%，官方口径已注明待第三方复现）
- 部署：24GB 显存+64GB 内存+35GB 磁盘；BF16/FP8/INT8/GGUF(Q4_0/Q6_K/Q8_0)/LoRA(4步8步)；12 个直接依赖，uv+py3.11+torch2.8/cu128
- 45 篇 md 中 22 篇 _CN 中英双语；AGENTS.md；3 子模块(evalscope/EASI/LightLLM)；LightLLM+LightX2V Docker 服务化

## 配图（全部过 vision QA，深空蓝+电光青科技风）

正文 4 张：
- 01-architecture-compare.png 拼接派 vs 原生统一
- 02-parameter-breakdown.png 17.552B 参数拆解（修复过 lm_head 被遮挡问题，改短中文名+标签移条右侧）
- 03-version-timeline.png U1/U1.5/U1.6 三代时间线
- 04-deploy-matrix.png 权重选型+显存+适用人群
封面：
- cover-ip.jpg（微信1280×544双翼，随机抽中 c1 深墨蓝+疲惫，verify_wings rc=0，已记 combo-history）
- cover-zhihu.png（知乎1600×900 深空蓝论点型，与微信不同）

## 网站端（Hugo，已 push）

- content/articles/2026/11/24/sensenova-u1.md（正文 2516 中文字，4 图，无 shortcode）
- static/images/sensenova-u1/
- hugo 临时构建 exit 0；sync-site：322 articles / 662 searchable，slug 进 home.json(4)/search-index(1)
- rebase 无冲突；commit ef5d914 已 push origin main
- 预期 URL：https://jackssybin.cn/articles/2026/11/24/sensenova-u1/

## 微信端（仅草稿）

- 标题：一个模型既看懂图又会画图还能自己改错：商汤 SenseNova-U1.6 实测拆解
- 正文 2122 中文字（不含引流），4 图，无 H1，GitHub 仅文末裸链
- frontmatter：cover 绝对路径 cover-ip.jpg + source_url=GitHub
- 引流齐全：jk 自述+在看星标+阅读原文+2 条真实 mp 内链
- validate-payload rc=0；publish.js 成功（无 45166/40113）
- set-digest：独立 digest 99 字 + content_source_url 回读确认

## 知乎端（专栏，仅草稿）

- 标题：如何评价商汤开源的 SenseNova-U 系列原生统一多模态模型（NEO-unify 架构）？
- 正文 1351 中文字，4 图，论点先行无 CTA
- 临时 markdown 草稿（传图）：p/2108665216519227162，需后台手动删
- compact HTML：4 CDN content_image，无 ol/ul/table/空段/H1
- 正式 HTML 草稿：p/2108665320571458796（ok=true HTTP200，以此为准）

## 待用户处理

- 知乎后台删临时草稿 p/2108665216519227162
- 三端均草稿/网站已推送，微信群发与知乎发布需手动确认
- 许可提醒已写入：代码 Apache-2.0，模型权重以各 HF 模型卡为准
