---
title: "试过 Sora 和剪映 AI 之后，我用这个开源项目把「AI 视频」跑成了真流水线"
author: "jk"
digest: "166 star 的 LingtiStudio 不是要打败 Sora，是要给 AI 视频加上「暂停键」。8 个审核 gate + 单分镜重跑 + 剪映草稿闭环，对讲解号和内容账号，可能才是真正能用的形态。"
cover: /root/workspace/jackssybinIndex/content-ops/lingtistudio-ai-video-production-pipeline/media/cover-wechat.jpg
theme: newsroom
code: github
---

# 试过 Sora 和剪映 AI 之后，我用这个开源项目把「AI 视频」跑成了真流水线

上周三我给一个客户做 60 秒的讲解视频，试了三条路。

**Sora 直生成。** 第一版旁白语气不对，重来；第二版画面漂移，重来；第三版价格差不多够订《华尔街日报》一年。

**剪映 AI 一键。** 快是快，本质是套模板换素材。想调结构，整段重来。

**自己拼。** GPT 写脚本，MidJourney 生图，MiniMax 配音，Kling 图生视频，最后拖剪映。每一步都能控制，每一步都是独立工具，接口不匹配、时长对不齐、风格串味。

同一天晚上我在 GitHub 上看到 `ruilisi/LingtiStudio`（166 star，MIT，中文文档齐全）。它做的不是前两条路，是把第三条路那种散装拼装，变成一个整合起来的产品。

这篇讲清楚三件事：**它的机制、5 分钟怎么跑、什么样的人应该关注。**

---

## 一、它把生产链路拆成了 8 步，其中 2 步是人工关卡

![LingtiStudio 8 步生产链路](/root/workspace/jackssybinIndex/content-ops/lingtistudio-ai-video-production-pipeline/media/01-pipeline.png)

从一个主题出发：

1. 脚本生成（LLM + Reflection 双轮）
2. **分镜审核（人工暂停）**
3. 资产生成（角色 / 场景 / 道具）
4. **资产确认（人工暂停）**
5. 关键帧生成
6. TTS 配音
7. 视频片段生成
8. FFmpeg 组装 + 剪映草稿导出

两个关卡的存在，是这个项目和"一键生成"的根本差别。

`modules/llm.py` 里的 Reflection 结构，第一轮 temperature=0.7 出初稿，第二轮 temperature=0.3 用严格审核员的 prompt 检查一次。开源社区愿意把这一段做进 pipeline，是因为承认了一个事实——**LLM 一轮直出的脚本，往往主题跑偏、结构断裂、开头无钩子。**

---

## 二、审核关卡为什么值钱

举个具体数字。60 秒短视频，8 个分镜。

![审核关卡的价值对比](/root/workspace/jackssybinIndex/content-ops/lingtistudio-ai-video-production-pipeline/media/02-review-gate.png)

**没有关卡的流程**——脚本直出可能主题跑偏，8 张关键帧 $0.4 全生成，8 段视频 $3.2 全生成，成片看完发现开头不对，重跑全流程再花 $3.6。

**有关卡的流程**——脚本看完再确认 $0，资产小图预审 $0.1，关键帧确认后全量 $0.4，视频错了只重跑单段 $0.4。

假设首轮通过率 60%（我实测的乐观值），一键流程期望成本约 $5，分阶段流程约 $0.9~$1.5。

**对个人创作者，一个月做 10 条视频就是几十美金的差距。**

更重要的是心理成本。一键流程失败要重看一遍成片才发现问题，"哪一步坏了"的判断全在你身上。分阶段流程每步交付物具体，出错立刻能定位。

---

## 三、剪映草稿导出，是我读源码时最惊讶的一段

`modules/jianying_draft.py` 直接调 `pyJianYingDraft`，把每个分镜作为独立片段导入剪映工程，**视频 / 配音 / 字幕分离到独立轨道**。

源码注释里有一句：

> v2.0：每个分镜作为独立片段导入，多轨道分离。用户可在剪映中直接替换单个分镜/配音/字幕，无需重跑全流程。这是"AI 做 90%，人类做最后 10%"的关键闭环。

这句话是产品价值观。**它不假设 AI 出的东西一次可用**，只承诺"帮你到 90%，剩下 10% 你在剪映里改会比重跑更快"。

对做讲解号、知识科普、多分镜故事视频的创作者，这个差别不是量的差，是质的差。

---

## 四、和其他方案横向对比

![四种 AI 视频方案对比](/root/workspace/jackssybinIndex/content-ops/lingtistudio-ai-video-production-pipeline/media/03-comparison.png)

维度拉齐后：

- Sora / Runway：单条 MP4，无审核步骤，错了整段重来。适合尝鲜 / 单条创意。
- 剪映 AI 一键：本身就是剪映，1-2 处可审核，但模板固化。适合完全不懂 AI 的普通人。
- 手工 ComfyUI + 各家 API：全流程手工，学习曲线高。适合极客。
- **LingtiStudio**：MP4 + SRT + 剪映草稿（独立轨），8 处 gate，错了只重跑单分镜。**适合内容账号 / 讲解号。**

---

## 五、5 分钟跑起来的两条路径

**Docker Compose（推荐）**：

```bash
git clone https://github.com/ruilisi/LingtiStudio.git
cd LingtiStudio
docker compose up -d --build
```

打开 `http://localhost:3000`，首次会自动弹配置对话框，在浏览器里填 API Key（写入 `./configs/config.yaml`），不用手工编辑 YAML。

**CLI**：

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python cli/main.py config --init
# 只生成脚本（不花钱，先看结构）
python cli/main.py script --topic "AI 改变世界" --output script.json
# 完整生成
python cli/main.py run --topic "西藏旅行" --duration 90
```

**我强烈建议第一次跑 `script` 子命令**——不花钱、几秒出 JSON，先看看它给你的分镜结构像不像回事，再决定要不要跑完整流程。

---

## 六、视频引擎智能路由

`modules/video_gen.py` 里有一段关键词打分：

- 对话 / 口型 / 多人 → Seedance（口型同步好）
- 动作 / 运动 / 快速 → Kling（动态感强）
- 其他 → 默认引擎

规则不复杂，但明确。这是工程判断——**不追求算法完美，追求默认合理**。

---

## 七、什么样的人应该关注

**值得试的四类**：

- B 站 / 抖音 / 视频号讲解类账号
- 独立开发者做产品 demo
- MCN 内部批量做知识科普
- AI 视频工作流研究者

**别为难自己的三类**：

- 只做单条爆款、不做批量 → Sora / Runway 更直接
- 不装 Docker、不玩 API Key → 直接用剪映 AI
- 追求"一键出片"效率党 → 审核关卡本身是它的价值，不是麻烦

判断维度就一句：**你愿不愿意把「审核每一步」当成价值而非负担？**

---

## 八、如果你决定试，按这个顺序

1. 先跑 `python cli/main.py script`，不花钱看脚本结构。
2. 第一次完整流程用 60 秒 / 8 分镜，总成本约 $1，试错便宜。
3. **开着审核 gate 跑，不要用 `--no-review`。**
4. 视频引擎第一次用 Kling，API 文档最稳定。
5. 最后一步一定在剪映里过一遍，这是这个项目最核心的价值。

---

## 结语

LingtiStudio 不是要打败 Sora，也不是要替代剪映。

它的价值是给一个野蛮生长的行业加了个"暂停键"——AI 视频这件事，从"生成一个结果"变成"运行一条流程"。

对我这种做内容账号的人，比"生成质量再上一个台阶"更需要的东西是**可暂停、可审核、可恢复**。

值得看看。
