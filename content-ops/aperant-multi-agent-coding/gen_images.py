# -*- coding: utf-8 -*-
"""Aperant 配图：靛蓝+青绿数据流暗色风（区别于 Lightpanda 冷青、PostBot 暖紫）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/aperant-multi-agent-coding"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

BG = (12, 16, 28); PANEL = (20, 27, 46); PANEL2 = (30, 40, 66); LINE = (52, 66, 102)
INDIGO = (129, 140, 248); TEAL = (45, 212, 191); TEALL = (110, 231, 214)
AMBER = (251, 191, 36); ROSE = (251, 113, 133); WHITE = (235, 240, 252); MUTED = (148, 163, 196)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=TEAL)
    t(d, (110, 92), "让 12 个 AI 同时给你写代码", font("Black", 58), WHITE)
    t(d, (110, 176), "Aperant：基于 Claude Code 的多会话自主编码框架，规划、编码、自验证一条龙", font("Bold", 28), TEALL)
    pts = [("12 终端并行 + worktree 隔离", "每个任务在独立 git worktree 干活，主分支始终安全"),
           ("自验证 QA 闭环", "内置质量回路，合并前先跑测试抓问题，再 AI 辅助解决冲突"),
           ("记忆层 + 图数据库", "libSQL 图谱跨会话沉淀经验，五级 embedding 自动降级")]
    y = 298
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=AMBER)
        t(d, (150, y), a, font("Bold", 29), TEAL)
        t(d, (150, y + 42), b, font("Regular", 23), MUTED)
        y += 114
    rr(d, (1150, 140, 1490, 680), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "1.46 万"), ("Fork", "1890"), ("语言", "TypeScript"), ("TS 文件", "1146"),
            ("代码行", "31.4 万"), ("稳定版", "v2.7.6"), ("协议", "AGPL-3.0")]
    yy = 184
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 23), AMBER, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-10 仓库源码实测 · 2.x 维护中，3.0 在独立仓库重构，PR 暂停", font("Medium", 21), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def pipeline():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "自主编码闭环：从一句需求到可合并的代码", font("Black", 31), WHITE)
    steps = [("规划 Plan", "拆解任务规格 spec\n路线图竞品分析\n子任务迭代器", INDIGO),
             ("并行构建", "最多 12 个 agent 终端\n各自独立 worktree\nparallel-executor 调度", TEAL),
             ("自验证 QA", "qa-loop 质量回路\n测试失败自动重试\nQA_MAX_ITERATIONS 兜底", AMBER),
             ("智能合并", "冲突检测 semantic\n自动合并 auto-merger\n文件演变追踪", TEALL)]
    bw, bh = 252, 380
    gap = 18
    x, y = 60, 130
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 42), h, font("Bold", 22), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 104
        for ln in lines:
            t(d, (xx + 18, yy), ln, font("Regular", 17), (205, 214, 232))
            yy += 50
        if i < 3:
            t(d, (xx + bw + gap - 2, y + bh / 2), "→", font("Bold", 24), MUTED, anchor="mm")
    rr(d, (60, 550, 1140, 640), 12, fill=PANEL2, outline=INDIGO, width=1)
    t(d, (88, 582), "底层不是新模型：agent 通过 child_process spawn 驱动 Claude Code CLI，", font("Bold", 20), INDIGO, anchor="lm")
    t(d, (88, 616), "Aperant 做的是编排、隔离、状态机（XState）、QA 与合并这一整套工程化外壳", font("Bold", 20), TEALL, anchor="lm")
    t(d, (60, 680), "默认 maxSteps=200，简单任务 maxSteps=1，防止 agent 无限跑下去", font("Medium", 19), MUTED)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def worktree():
    W, H = 1200, 740
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "并行安全的核心：git worktree 隔离 + 12 终端网格", font("Black", 30), WHITE)
    # 左侧主干
    rr(d, (70, 130, 340, 210), 12, fill=PANEL2, outline=TEAL, width=2)
    t(d, (205, 170), "主仓库 main 分支", font("Bold", 22), TEALL, anchor="mm")
    # 右侧三个 worktree
    wts = [("worktree · 任务A", "agent 终端 1-4", INDIGO),
           ("worktree · 任务B", "agent 终端 5-8", AMBER),
           ("worktree · 任务C", "agent 终端 9-12", ROSE)]
    yy = 270
    for h, sub, c in wts:
        rr(d, (480, yy, 1130, yy + 100), 12, fill=PANEL, outline=c, width=2)
        t(d, (510, yy + 30), h, font("Bold", 22), c)
        t(d, (510, yy + 66), sub + "（独立工作目录与分支，改动互不污染）", font("Regular", 18), MUTED)
        d.line([340, 170, 480, yy + 50], fill=LINE, width=2)
        yy += 128
    rr(d, (70, 270, 340, 526), 12, fill=PANEL, outline=AMBER, width=1)
    t(d, (92, 296), "worktree-manager", font("Bold", 19), AMBER)
    notes = ["git worktree add 建目录", "worktree list --porcelain 核验", "任务结束批量回收", "主分支全程只读保护"]
    yn = 336
    for n in notes:
        t(d, (92, yn), "· " + n, font("Regular", 16), (200, 210, 230))
        yn += 44
    rr(d, (60, 660, 1140, 712), 10, fill=PANEL2, outline=TEAL, width=1)
    t(d, (88, 686), "UI 层 TerminalGrid 固定 3×4 网格、上限 12 终端（源码 TerminalGrid.tsx 实测）", font("Bold", 19), TEAL, anchor="lm")
    img.save(f"{OUT}/worktree.png"); print("worktree.png")

def memory():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "记忆层：让 agent 跨会话记住你的项目", font("Black", 30), WHITE)
    # 左：存储
    rr(d, (60, 120, 560, 560), 14, fill=PANEL, outline=INDIGO, width=2)
    t(d, (88, 148), "图数据库（libSQL）", font("Bold", 24), INDIGO)
    left = ["graph_nodes / graph_edges 表", "graph_closure 传递闭包", "BFS/DFS 闭包深度上限 5", "embedding-service 向量嵌入", "observer 观察代码变更", "retrieval 按需检索注入上下文"]
    yy = 202
    for it in left:
        d.ellipse([88, yy + 9, 104, yy + 25], outline=INDIGO, width=2)
        t(d, (120, yy + 17), it, font("Regular", 19), (208, 216, 234), anchor="lm")
        yy += 56
    # 右：五级降级
    rr(d, (620, 120, 1140, 560), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (648, 148), "embedding 五级自动探测", font("Bold", 24), TEAL)
    levels = ["1. 优先本地 Ollama 专用模型", "2. OpenAI 兼容 API", "3. 其他 Ollama 嵌入模型", "4. nomic / all-minilm / bge 系列", "5. 降级为 hash 方案（无语义相似度）"]
    yy = 202
    for it in levels:
        d.ellipse([648, yy + 9, 664, yy + 25], outline=TEAL, width=2)
        t(d, (680, yy + 17), it, font("Regular", 19), (208, 216, 234), anchor="lm")
        yy += 56
    rr(d, (60, 600, 1140, 690), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 630), "设计意图：本地优先、断网可降级，不强制把代码语义上传第三方嵌入服务；", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 664), "但 hash 兜底会失去语义检索能力，装个 Ollama 模型体验才完整", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/memory.png"); print("memory.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "祛魅：能力、依赖与当前阶段的真实边界", font("Black", 30), WHITE)
    rr(d, (60, 116, 580, 560), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (88, 144), "它的真实定位", font("Bold", 24), TEAL)
    good = ["Claude Code CLI 的桌面编排外壳", "Electron 40 + React 19 本地应用", "12 路并行 worktree 工程化", "QA 闭环 + 自动合并降心智负担", "数据本地，图数据库内置", "Win/macOS/Linux 三端安装包"]
    yy = 198
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=TEAL, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (210, 218, 234), anchor="lm")
        yy += 56
    rr(d, (620, 116, 1140, 560), 14, fill=PANEL, outline=ROSE, width=2)
    t(d, (648, 144), "要留意的边界", font("Bold", 24), ROSE)
    bad = ["强依赖 Claude Pro/Max 订阅", "必须装 Claude Code CLI", "2.x 维护模式，只修关键 bug", "3.0 在独立仓库重构，PR 暂停", "最近 release 停在 2026-03", "AGPL：闭源 SaaS 需商业授权"]
    yy = 198
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=ROSE, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (210, 218, 234), anchor="lm")
        yy += 56
    rr(d, (60, 596, 1140, 720), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 626), "安全三层：OS 沙箱隔离 bash、文件系统限制在项目目录、动态命令白名单 +", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 660), "secret-scanner 密钥扫描；release 带 SHA256 与 VirusTotal。但自主执行仍建议人审合并", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 696), "结论：它放大的是 Claude Code 的并行生产力，不是替代它的新模型", font("Medium", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
pipeline()
worktree()
memory()
limits()
print("ALL DONE")
