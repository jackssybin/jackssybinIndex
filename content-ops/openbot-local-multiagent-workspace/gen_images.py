# -*- coding: utf-8 -*-
"""OpenBot 三端推广配图：微信封面 + 知乎封面 + 3张正文图。深色技术风。"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/root/jackssybinIndex/static/images/openbot-local-multiagent-workspace"
os.makedirs(OUT, exist_ok=True)

FD = "/usr/share/fonts/google-noto-cjk"
def font(weight, size):
    return ImageFont.truetype(f"{FD}/NotoSansCJK-{weight}.ttc", size)

# 配色
BG = (15, 19, 30)
PANEL = (24, 30, 47)
PANEL2 = (31, 39, 60)
CYAN = (64, 214, 196)
BLUE = (94, 156, 255)
PURPLE = (157, 122, 255)
AMBER = (255, 190, 92)
WHITE = (236, 241, 250)
GREY = (150, 162, 184)
GREEN = (88, 200, 140)
RED = (255, 120, 120)

def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def text(d, xy, s, f, fill, anchor=None):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

# ---------- 图1：微信封面 1080x864 ----------
def wechat_cover():
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # 背景装饰圆
    for cx, cy, r, c in [(930, 120, 260, (28, 44, 74)), (120, 780, 220, (26, 38, 58))]:
        d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=c)
    # 顶部标签
    rrect(d, (80, 90, 360, 150), 30, fill=(30, 52, 70), outline=CYAN, width=2)
    text(d, (220, 120), "开源项目 · 多智能体", font("Medium", 30), CYAN, anchor="mm")
    # 主标题
    text(d, (80, 230), "7 个 Coding Agent", font("Black", 78), WHITE)
    text(d, (80, 330), "装进同一张办公桌", font("Black", 78), WHITE)
    # 副标题
    text(d, (82, 430), "本地优先的多智能体工作台 OpenBot", font("Bold", 38), (190, 205, 225))
    text(d, (82, 490), "独立工作区 · 任务队列 · Agent 协作 · 内置浏览器", font("Regular", 30), GREY)
    # Agent 小胶囊
    agents = ["Codex", "Claude", "Grok", "OpenCode", "Gemini", "Cursor", "Cline"]
    x, y = 82, 600
    for a in agents:
        w = int(d.textlength(a, font=font("Bold", 30))) + 48
        if x + w > 1000:
            x, y = 82, y + 74
        rrect(d, (x, y, x+w, y+56), 28, fill=PANEL2, outline=(60, 78, 110), width=2)
        text(d, (x+w/2, y+28), a, font("Bold", 30), (200, 215, 238), anchor="mm")
        x += w + 20
    # 底栏
    d.line([80, 780, 1000, 780], fill=(45, 58, 84), width=2)
    text(d, (80, 812), "github.com/nightly-labs/openbot", font("Medium", 28), GREY)
    text(d, (1000, 812), "2 个月 1.8K Star", font("Bold", 28), AMBER, anchor="ra")
    img.save(f"{OUT}/cover.png")
    print("cover.png (wechat) done")

# ---------- 图2：知乎封面 1600x900（克制技术风） ----------
def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 18, H], fill=CYAN)
    text(d, (110, 150), "OpenBot 是什么？", font("Black", 84), WHITE)
    text(d, (110, 280), "一个不给你模型、却给七个 Agent 排好工位的", font("Bold", 44), (200, 212, 232))
    text(d, (110, 350), "本地优先桌面工作台（local-first multi-agent workspace）", font("Bold", 44), (200, 212, 232))
    # 三条要点
    pts = [
        ("不是又一个 Agent", "不提供模型，只编排官方 CLI（Codex / Claude / Grok 等 7 家）"),
        ("持久化而非一次性", "独立工作区 + FIFO 任务队列，崩溃不丢任务、重启会话还在"),
        ("能协作也能远程", "Agent 互发消息传文件；VPS/Docker 常开，手机随时派活"),
    ]
    y = 480
    for t, s in pts:
        d.ellipse([110, y+10, 134, y+34], fill=CYAN)
        text(d, (160, y), t, font("Bold", 38), CYAN)
        text(d, (160, y+52), s, font("Regular", 32), GREY)
        y += 125
    # 右侧版本信息卡
    rrect(d, (1150, 150, 1490, 560), 24, fill=PANEL, outline=(55, 72, 105), width=2)
    rows = [("版本", "v0.51.1"), ("Star", "1,837"), ("Fork", "213"), ("建仓", "2026-08"), ("技术栈", "Electron"), ("", "SolidJS + Bun")]
    yy = 205
    for k, v in rows:
        if k:
            text(d, (1190, yy), k, font("Regular", 28), GREY)
        text(d, (1450, yy), v, font("Bold", 30), WHITE, anchor="ra")
        yy += 58
    text(d, (110, 830), "许可证 PolyForm Noncommercial 1.0.0（源码可见，禁商用）· 当前为开发预览版", font("Medium", 26), AMBER)
    img.save(f"{OUT}/cover-zhihu.png")
    print("cover-zhihu.png done")

# ---------- 图3：七家 Provider 接入方式表格图 ----------
def providers_table():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    text(d, (60, 50), "OpenBot 统一编排的 7 个 Agent", font("Black", 42), WHITE)
    cols = [("Agent", 220), ("接入方式", 470), ("认证方式", 450)]
    rows = [
        ("Codex", "本地 Codex App Server", "ChatGPT 登录态"),
        ("Claude Code", "本地 Claude CLI", "Claude 订阅登录态"),
        ("Grok CLI", "本地 CLI", "grok login / XAI_API_KEY"),
        ("OpenCode", "下载锁定 OpenCode CLI", "免费模型免登录"),
        ("Gemini", "Antigravity ACP Server", "Google AI Pro/Ultra"),
        ("Cursor CLI", "下载锁定 cursor-agent", "套餐 / API Key"),
        ("Cline CLI", "下载锁定 cline", "Cline 账号（含免费额度）"),
    ]
    x0, y0 = 60, 140
    rh, hd = 64, 64
    widths = [c[1] for c in cols]
    # 表头
    d.rectangle([x0, y0, x0+sum(widths), y0+hd], fill=(33, 62, 84))
    cx = x0
    for name, w in cols:
        text(d, (cx+24, y0+hd/2), name, font("Bold", 28), (190, 235, 230), anchor="lm")
        cx += w
    # 数据行（先画条纹）
    for i, r in enumerate(rows):
        y = y0 + hd + i*rh
        fill = PANEL if i % 2 == 0 else PANEL2
        d.rectangle([x0, y, x0+sum(widths), y+rh], fill=fill)
    # 再画文字
    for i, r in enumerate(rows):
        y = y0 + hd + i*rh + rh/2
        cx = x0
        vals = [r[0], r[1], r[2]]
        for j, (val, w) in enumerate(zip(vals, widths)):
            col = CYAN if j == 0 else (WHITE if j == 1 else (190, 205, 225))
            f = font("Bold", 26) if j == 0 else font("Regular", 25)
            text(d, (cx+24, y), val, f, col, anchor="lm")
            cx += w
    # 网格竖线
    cx = x0
    for w in widths[:-1]:
        cx += w
        d.line([cx, y0, cx, y0+hd+len(rows)*rh], fill=(48, 62, 90), width=2)
    d.line([x0, y0+hd+len(rows)*rh, x0+sum(widths), y0+hd+len(rows)*rh], fill=(48, 62, 90), width=2)
    text(d, (60, 700), "注：OpenBot 本身不提供模型，也不截留凭据；Grok 的 token 不落盘、不写日志", font("Regular", 24), GREY)
    img.save(f"{OUT}/providers.png")
    print("providers.png done")

# ---------- 图4：架构心智模型图 ----------
def architecture():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    text(d, (60, 46), "一个 Agent = 一位有状态的常驻同事", font("Black", 40), WHITE)
    # 中央 OpenBot 面板
    rrect(d, (380, 130, 820, 230), 18, fill=(30, 58, 78), outline=CYAN, width=3)
    text(d, (600, 180), "OpenBot 桌面工作台", font("Black", 34), WHITE, anchor="mm")
    # 四个能力卡
    cards = [
        ("独立工作区", "独立文件夹与会话\n重启后原样保留", CYAN, (80, 300)),
        ("FIFO 任务队列", "暂停 / 恢复 / 取消\n崩溃安全持久化", BLUE, (640, 300)),
        ("上下文自动压缩", "按 Agent 监控\n撑爆窗口前 compact", PURPLE, (80, 500)),
        ("Agent 间协作", "消息 / 回复 / 表情\n托管文件传输", AMBER, (640, 500)),
    ]
    for title, body, c, (x, y) in cards:
        rrect(d, (x, y, x+480, y+150), 18, fill=PANEL, outline=(55, 72, 105), width=2)
        d.rectangle([x, y, x+10, y+150], fill=c)
        text(d, (x+34, y+34), title, font("Bold", 32), c)
        text(d, (x+34, y+86), body, font("Regular", 27), (188, 200, 220))
    # 连线
    for x, y in [(320, 300), (640, 300), (320, 500), (640, 500)]:
        d.line([600, 230, x+240, y], fill=(60, 78, 110), width=3)
    text(d, (60, 700), "共享频道里一个任务只有一个 task owner，可 Stop / Resume / Reassign / Archive", font("Regular", 25), GREY)
    img.save(f"{OUT}/architecture.png")
    print("architecture.png done")

# ---------- 图5：安全边界对比图 ----------
def safety():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    text(d, (60, 46), "上手前必须知道的两个边界", font("Black", 40), WHITE)
    # 卡1 许可证
    rrect(d, (60, 140, 570, 600), 20, fill=PANEL, outline=AMBER, width=3)
    text(d, (95, 185), "⚠ 许可证", font("Black", 34), AMBER)
    text(d, (95, 260), "PolyForm Noncommercial", font("Bold", 30), WHITE)
    text(d, (95, 305), "1.0.0", font("Bold", 30), WHITE)
    for i, line in enumerate(["源码可见、可自用学习", "但禁止商业用途", "属于 source-available", "不是 OSI 标准开源", "商用前需法务评估"]):
        text(d, (95, 372+i*40), ("• " + line), font("Regular", 26), (195, 205, 222))
    # 卡2 权限
    rrect(d, (630, 140, 1140, 600), 20, fill=PANEL, outline=RED, width=3)
    text(d, (665, 185), "⚠ 运行权限", font("Black", 34), RED)
    text(d, (665, 260), "danger-full-access", font("Bold", 30), WHITE)
    text(d, (665, 305), "+ never 审批", font("Bold", 30), WHITE)
    for i, line in enumerate(["可读写文件、执行命令", "可联网、操控浏览器", "除首次授权外无逐次确认", "只运行你信任的任务", "保持备份，建议虚拟机/容器"]):
        text(d, (665, 372+i*40), ("• " + line), font("Regular", 26), (195, 205, 222))
    text(d, (60, 660), "另外：当前仍是 development preview（v0.51.x，214 个 open issues）；", font("Regular", 24), GREY)
    text(d, (60, 700), "Windows 早期安装包没有代码签名，安装前核对官方校验和。", font("Regular", 24), GREY)
    img.save(f"{OUT}/safety-v2.png")
    print("safety-v2.png done")

wechat_cover()
zhihu_cover()
providers_table()
architecture()
safety()
print("ALL DONE")
