# -*- coding: utf-8 -*-
"""Lightpanda 配图：深色终端技术风（墨蓝底 + 冷青 + 琥珀 + 信号绿），呼应 Zig/无头浏览器/性能主题。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/lightpanda-zig-headless-browser"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

# 终端冷色暗调
BG = (13, 17, 23); PANEL = (22, 28, 38); PANEL2 = (31, 40, 54); LINE = (58, 72, 92)
CYAN = (88, 200, 224); CYANL = (150, 224, 238); AMBER = (240, 178, 92)
GREEN = (110, 205, 140); RED = (232, 120, 110); WHITE = (232, 238, 244); MUTED = (150, 164, 182)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=CYAN)
    # 左侧文案安全区 x≤1080，右侧数据卡 x=1150 起，杜绝遮挡
    t(d, (110, 96), "不用 Chromium", font("Black", 60), WHITE)
    t(d, (110, 178), "从零用 Zig 写一个浏览器", font("Black", 60), WHITE)
    t(d, (112, 282), "为 AI Agent 和自动化而生的无头浏览器", font("Bold", 30), CYANL)
    t(d, (112, 328), "内存省 16 倍 · 速度快 9 倍", font("Bold", 30), GREEN)
    pts = [("不是套壳内核", "非 Chromium / 非 WebKit，Zig 手写，无图形渲染引擎"),
           ("为规模化而生", "单进程几十 MB，百进程并发抓取，CDP/WebDriver 兼容"),
           ("Agent 与 MCP 原生", "内置 agent 模式与 MCP server，脚本可离线回放")]
    y = 420
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=AMBER)
        t(d, (150, y), a, font("Bold", 30), GREEN)
        t(d, (150, y + 44), b, font("Regular", 24), MUTED)
        y += 112
    rr(d, (1150, 140, 1490, 660), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "4.16 万"), ("Fork", "2070"), ("语言", "Zig"), ("提交", "1.19 万"),
            ("协议", "AGPL-3.0"), ("基准内存", "123MB"), ("Chrome 对照", "2GB")]
    yy = 188
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 24), AMBER, anchor="ra")
        yy += 62
    t(d, (112, 828), "数据来自官方 933 真实页面基准 · 项目仍在快速迭代，WPT 兼容性未达完整浏览器水平", font("Medium", 22), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def benchmark():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "官方基准：933 个真实网页，AWS m5.xlarge 实测", font("Black", 31), WHITE)
    # 两组对比柱状：内存
    t(d, (60, 108), "峰值内存（100 页并发，越低越好）", font("Bold", 24), CYANL)
    base_y = 360
    # Lightpanda 123MB
    h_lp = 123 * 200 / 2000  # 比例
    h_ch = 2000 * 200 / 2000
    rr(d, (140, base_y - h_lp, 320, base_y), 10, fill=GREEN)
    t(d, (230, base_y - h_lp - 34), "123MB", font("Black", 30), GREEN, anchor="mm")
    t(d, (230, base_y + 14), "Lightpanda", font("Bold", 22), WHITE, anchor="mm")
    rr(d, (420, base_y - h_ch, 600, base_y), 10, fill=RED)
    t(d, (510, base_y - h_ch - 34), "2GB", font("Black", 30), RED, anchor="mm")
    t(d, (510, base_y + 14), "Headless Chrome", font("Bold", 22), WHITE, anchor="mm")
    t(d, (370, base_y - 60), "≈16×", font("Black", 34), AMBER, anchor="mm")
    # 耗时
    t(d, (680, 108), "100 页执行耗时（越短越好）", font("Bold", 24), CYANL)
    base2 = 360
    w_lp = 5 * 320 / 46
    w_ch = 46 * 320 / 46
    rr(d, (700, 250, 700 + w_lp, 310), 8, fill=GREEN)
    t(d, (700 + w_lp + 12, 280), "5s", font("Black", 28), GREEN, anchor="lm")
    rr(d, (700, 330, 700 + w_ch, 390), 8, fill=RED)
    t(d, (700 + w_ch + 12, 360), "46s", font("Black", 28), RED, anchor="lm")
    t(d, (700, 220), "Lightpanda", font("Bold", 20), MUTED)
    t(d, (700, 410), "Chrome", font("Bold", 20), MUTED)
    rr(d, (60, 470, 1140, 560), 12, fill=PANEL2, outline=LINE, width=1)
    t(d, (88, 500), "并发扩展（同抓 933 页）：Lightpanda 25 进程 4.81s / 峰值 123MB；", font("Bold", 21), CYANL)
    t(d, (88, 535), "Chrome 100 标签页 69 分 37 秒 / 峰值 4.2GB，内存与时间双双失控", font("Bold", 21), AMBER)
    t(d, (60, 620), "口径提醒：官方 demo 仓库基准，Chrome 143 对照；真实业务受页面复杂度与网络影响，建议自测", font("Medium", 20), MUTED)
    t(d, (60, 660), "Lightpanda 单进程抓 933 页仅 51.68s、峰值 27.2MB，CPU 11.1%", font("Regular", 19), MUTED)
    img.save(f"{OUT}/benchmark.png"); print("benchmark.png")

def architecture():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "从零搭一个浏览器：Lightpanda 的技术栈分层", font("Black", 31), WHITE)
    layers = [
        ("接入协议层", "CDP / WebSocket · WebDriver BiDi · 原生 MCP server（stdio 与 HTTP）", CYAN),
        ("Agent 与脚本层", "lightpanda agent 自然语言驱动 · PandaScript 确定性回放 · REPL --no-llm", GREEN),
        ("JS 与 DOM 层", "V8 引擎执行 JavaScript · DOM 树 · DOM API · XHR / Fetch / Ajax", AMBER),
        ("解析与网络层", "html5ever HTML 解析 · Libcurl HTTP loader · CORS · 代理 · 网络拦截", CYANL),
        ("Zig 运行时底座", "Zig 0.17 手写 · 显式内存控制 · 无图形渲染引擎 · 单二进制轻量部署", GREEN),
    ]
    y = 118
    for i, (h, b, c) in enumerate(layers):
        rr(d, (80, y, 1120, y + 104), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([80, y, 86, y + 104], fill=c)
        t(d, (118, y + 22), h, font("Bold", 25), c)
        t(d, (118, y + 64), b, font("Regular", 20), (206, 216, 228))
        if i < len(layers) - 1:
            t(d, (600, y + 116), "▲", font("Bold", 16), MUTED, anchor="mm")
        y += 128
    t(d, (80, 742), "关键取舍：砍掉图形渲染与桌面浏览器的大量冗余，换取服务端规模化的内存与速度优势", font("Medium", 21), MUTED)
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def usecases():
    W, H = 1200, 740
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "四种用法：从一行命令到多 Agent 共享会话", font("Black", 31), WHITE)
    cards = [
        ("① fetch 抓取", "dump html / markdown\npng / pdf / structured_data\n--obey-robots 守爬虫协议", CYAN),
        ("② serve + CDP", "起 9222 端口，Puppeteer\nPlaywright 改连接端点即可\n原有脚本几乎零改动接入", GREEN),
        ("③ agent 模式", "自然语言或斜杠命令驱动\n产物是 PandaScript\n可 --no-llm 离线跑 REPL", AMBER),
        ("④ MCP server", "stdio 或 HTTP 传输\n独立 session 隔离 cookie/内存\n多 Agent 不互相串页", CYANL),
    ]
    bw, bh = 250, 360
    gap = 20
    x = 60
    y = 130
    for i, (h, b, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 44), h, font("Bold", 23), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 110
        for ln in lines:
            t(d, (xx + 20, yy), ln, font("Regular", 18), (206, 216, 228))
            yy += 52
    rr(d, (60, 530, 1140, 620), 12, fill=PANEL2, outline=GREEN, width=1)
    t(d, (88, 558), "部署友好：Homebrew / AUR / Nix / Docker 官方镜像，Linux 与 macOS 双架构，", font("Bold", 20), GREEN)
    t(d, (88, 594), "Windows 走 WSL2；注意 Linux 二进制依赖 glibc（musl/Alpine 需换 glibc 基础镜像或源码编译）", font("Bold", 20), AMBER)
    t(d, (60, 660), "默认开启遥测，可用 LIGHTPANDA_DISABLE_TELEMETRY=true 关闭", font("Medium", 20), MUTED)
    img.save(f"{OUT}/usecases.png"); print("usecases.png")

def limits():
    W, H = 1200, 720
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "祛魅：它很强，但还不是完整 Chrome 替代品", font("Black", 31), WHITE)
    # 左：适合
    rr(d, (60, 116, 580, 560), 14, fill=PANEL, outline=GREEN, width=2)
    t(d, (88, 144), "适合的场景", font("Bold", 25), GREEN)
    good = ["大规模网页抓取 / 爬虫降本", "AI Agent 的网页执行环境", "结构化数据抽取（JSON-LD/OG）",
            "CI 里跑无头自动化测试", "需要百级并发、内存敏感的服务", "Markdown / PDF 批量渲染"]
    yy = 200
    for it in good:
        d.ellipse([88, yy + 9, 104, yy + 25], outline=GREEN, width=2)
        t(d, (120, yy + 17), it, font("Regular", 20), (210, 218, 226), anchor="lm")
        yy += 56
    # 右：不适合
    rr(d, (620, 116, 1140, 560), 14, fill=PANEL, outline=RED, width=2)
    t(d, (648, 144), "要注意的边界", font("Bold", 25), RED)
    bad = ["无图形渲染引擎，不能截图看像素", "WPT 兼容性仍在追赶，复杂站点可能异常",
           "无原生 Windows/Android，需 WSL/glibc", " nightly 构建，API 与行为可能变动",
           "强依赖最新 CSS/Canvas 的页面慎选", "生产前务必用自己的页面回归测试"]
    yy = 200
    for it in bad:
        d.ellipse([648, yy + 9, 664, yy + 25], outline=RED, width=2)
        t(d, (680, yy + 17), it, font("Regular", 20), (210, 218, 226), anchor="lm")
        yy += 56
    rr(d, (60, 596, 1140, 676), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 624), "许可：AGPL-3.0，自用与内部测试自由；基于它做闭源 SaaS 或对外网络服务，需遵守开源义务或谈商业授权", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 658), "结论：把它当成规模化自动化的专用利器，而非日常浏览器的完整替身", font("Medium", 19), MUTED, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
benchmark()
architecture()
usecases()
limits()
print("ALL DONE")
