# -*- coding: utf-8 -*-
"""影策 open-ai-canvas 配图：影视胶片暖调（深酒红底 + 胶片金 + 放映机青 + 玫瑰红）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/yingce-ai-film-canvas"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

BG = (24, 16, 20); PANEL = (38, 26, 32); PANEL2 = (52, 36, 42); LINE = (92, 66, 74)
GOLD = (232, 188, 110); GOLDL = (244, 216, 160); TEAL = (94, 204, 196); ROSE = (236, 122, 134)
CREAM = (242, 234, 224); MUTED = (180, 162, 168)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=GOLD)
    t(d, (110, 92), "一本小说，流水线走向成片", font("Black", 56), CREAM)
    t(d, (110, 174), "影策：开源 AI 影视工作台，分镜编排、无限画布与 Agent 工作流全自部署", font("Bold", 27), GOLDL)
    pts = [("小说到成片的短剧流水线", "改编拆集、角色三视图、结构化分镜，逐段生视频并自动首尾帧衔接"),
           ("无限画布 + 3D 世界引擎", "节点组织图文视频与 3D 预演，React Three Fiber 搭场景排机位"),
           ("112 个模型协议插件", "文本/图片/视频/音频以 Manifest 合同接入，渠道、密钥、计费自管理")]
    y = 296
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=ROSE)
        t(d, (150, y), a, font("Bold", 28), TEAL)
        t(d, (150, y + 42), b, font("Regular", 22), MUTED)
        y += 112
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "1747"), ("Fork", "584"), ("版本", "v1.8.3"), ("语言", "TS + Go"),
            ("Go 文件", "1436"), ("前端文件", "1389"), ("协议", "MIT")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 23), GOLD, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-10 仓库源码实测 · 项目快速迭代中，默认适合个人/本地/可信环境部署", font("Medium", 20), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def pipeline():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "从小说到成片：一条可人工接管的短剧流水线", font("Black", 30), CREAM)
    steps = [("上传小说", "粘贴正文或文件\n按集拆分剧本\n提取角色道具场景", GOLD),
             ("结构化分镜", "景别/运镜/时长\n镜头对照原文\n角色三视图锁定", GOLDL),
             ("逐段生视频", "剧情段驱动生成\n上段末帧=下段首帧\n保持镜头连贯", TEAL),
             ("时间线成片", "片段编排修剪\n字幕转写\n服务端合成导出", ROSE)]
    bw, bh = 252, 400
    gap = 18
    x, y = 60, 128
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 42), h, font("Bold", 22), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 108
        for ln in lines:
            t(d, (xx + 18, yy), ln, font("Regular", 17), (224, 214, 214))
            yy += 52
        if i < 3:
            t(d, (xx + bw + gap - 2, y + bh / 2), "→", font("Bold", 24), MUTED, anchor="mm")
    rr(d, (60, 568, 1140, 660), 12, fill=PANEL2, outline=GOLD, width=1)
    t(d, (88, 600), "每一步都能人工接管：改写台词、锁定角色形象、单段重新生成，", font("Bold", 20), GOLDL, anchor="lm")
    t(d, (88, 634), "不是黑盒一键出片，而是 AI 执行 + 人控关键节点的协作模式", font("Regular", 19), MUTED, anchor="lm")
    t(d, (60, 704), "据 README 产品一览与 features 文档整理，具体能力以官方功能清单为准", font("Medium", 18), MUTED)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def architecture():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "全栈架构：React 画布 + Go 后端 + 插件化模型渠道", font("Black", 29), CREAM)
    layers = [
        ("前端工作区 web/（Bun + React 19 + Vite）", "无限画布 · 任务中心 · 素材库 · Zustand/localForage 本地状态 · SSE 流式", GOLD),
        ("3D 世界引擎（React Three Fiber + three.js）", "场景/布景/机位/时间轴，输出白模视频与深度图作视频生成参考", TEAL),
        ("后端服务 backend/（Go 1.25 + Gin + GORM）", "handler→service→repository 分层 · 异步 worker · 权限 · 模型中转", GOLDL),
        ("数据与存储", "本地 SQLite 或 PostgreSQL+Redis 部署 · 媒体支持本地/阿里云 OSS/腾讯云 COS", ROSE),
        ("模型协议插件 plugin-packages（112 个）", "Manifest 合同接入文本/图片/视频/音频供应商，密钥与计费自管理", TEAL),
    ]
    y = 116
    for i, (h, b, c) in enumerate(layers):
        rr(d, (80, y, 1120, y + 104), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([80, y, 86, y + 104], fill=c)
        t(d, (118, y + 22), h, font("Bold", 22), c)
        t(d, (118, y + 64), b, font("Regular", 18), (216, 206, 210))
        if i < len(layers) - 1:
            t(d, (600, y + 116), "▲", font("Bold", 15), MUTED, anchor="mm")
        y += 128
    t(d, (80, 762), "生产由 Nginx 托管前端并代理后端，公网只暴露 web 入口；后端 8080 留在容器网络内", font("Medium", 19), MUTED)
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def plugins():
    W, H = 1200, 740
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "112 个协议插件：把模型差异关在 Manifest 合同里", font("Black", 29), CREAM)
    cards = [
        ("文本 chat", "23 个", "OpenAI/Claude/Gemini\n通义/智谱/百川/DeepSeek\n本地 vLLM 等", GOLD),
        ("图片 image", "17 个", "即梦/Flux/Recraft\nStability/Vertex Imagen\n豆包 Seedream 等", TEAL),
        ("视频 video", "22 个", "Seedance/可灵/Vidu\nRunway/Veo/混元\n智谱 CogVideoX 等", ROSE),
        ("音频/其他", "50 个", "TTS/音乐 + 工作流\nComfyUI/RunningHub\n支付与应用插件", GOLDL),
    ]
    bw, bh = 252, 360
    gap = 18
    x, y = 60, 128
    for i, (h, num, body, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        t(d, (xx + bw / 2, y + 42), h, font("Bold", 22), c, anchor="mm")
        t(d, (xx + bw / 2, y + 96), num, font("Black", 38), CREAM, anchor="mm")
        lines = body.split("\n")
        yy = y + 158
        for ln in lines:
            t(d, (xx + 20, yy), ln, font("Regular", 17), (214, 204, 208))
            yy += 46
    rr(d, (60, 530, 1140, 640), 12, fill=PANEL2, outline=TEAL, width=1)
    t(d, (88, 560), "插件不直接碰 React 组件、Cookie、数据库；按 apiVersion + 权限声明受控加载，", font("Bold", 19), TEAL, anchor="lm")
    t(d, (88, 596), "错误/超时/权限拒绝/版本不兼容必须可见，不允许静默降级（见插件系统设计文档）", font("Bold", 19), GOLDL, anchor="lm")
    t(d, (60, 676), "分类为源码目录清点结果；部分插件跨多模态，按主能力归并，合计 112 个协议插件", font("Medium", 18), MUTED)
    img.save(f"{OUT}/plugins.png"); print("plugins.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "上手前看清：MIT 很友好，但部署门槛和边界要知道", font("Black", 28), CREAM)
    rr(d, (60, 116, 580, 560), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (88, 144), "它的真实成色", font("Bold", 24), TEAL)
    good = ["MIT 协议，商用与二次开发友好", "全栈开源，前端后端插件都可审计", "自部署模型渠道，密钥不经过官方", "小说到成片链路完整且可人工接管", "无限画布 + 3D 预演差异化明显", "含管理后台、支付、积分运营能力"]
    yy = 198
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=TEAL, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (224, 214, 216), anchor="lm")
        yy += 56
    rr(d, (620, 116, 1140, 560), 14, fill=PANEL, outline=ROSE, width=2)
    t(d, (648, 144), "要评估的门槛", font("Bold", 24), ROSE)
    bad = ["体量大：Go 30 万行 + 前端 28 万行", "依赖 Bun + Go 1.25 + Docker 运维能力", "模型 API 费用自理，并非免费生成", "数据结构与外部接口仍可能调整", "默认非公网多人服务，需安全配置", "3D 世界引擎尚在内测阶段"]
    yy = 198
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=ROSE, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (224, 214, 216), anchor="lm")
        yy += 56
    rr(d, (60, 596, 1140, 716), 12, fill=PANEL2, outline=GOLD, width=1)
    t(d, (88, 626), "安全要点：公网部署关闭开放注册、CORS 不要用 *、后端默认拦截私网模型地址、", font("Bold", 19), GOLD, anchor="lm")
    t(d, (88, 660), "API Key 不进 URL/日志/明文长期存储；官方在线演示 test/test123456 仅供体验", font("Bold", 19), GOLD, anchor="lm")
    t(d, (88, 694), "结论：它是可自托管的影视生产平台骨架，不是开箱即得的免费成片魔法", font("Medium", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
pipeline()
architecture()
plugins()
limits()
print("ALL DONE")
