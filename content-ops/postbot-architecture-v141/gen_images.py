# -*- coding: utf-8 -*-
"""PostBot v1.4.1 架构演进配图：暖琥珀+紫罗兰工程风（区别于旧稿产品截图）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/postbot-architecture-v141"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

# 暖调工程暗色
BG = (26, 22, 30); PANEL = (38, 32, 44); PANEL2 = (50, 42, 58); LINE = (82, 70, 96)
AMBER = (240, 178, 92); VIOLET = (178, 142, 232); VIOLETL = (206, 180, 244)
TEAL = (110, 200, 190); CORAL = (232, 132, 116); WHITE = (240, 234, 244); MUTED = (176, 166, 186)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=VIOLET)
    t(d, (110, 92), "从单体扩展到模块化平台", font("Black", 58), WHITE)
    t(d, (110, 176), "PostBot v1.4.1 架构演进实测：35 个独立包怎么撑起一键多平台分发", font("Bold", 29), VIOLETL)
    pts = [("35 个 @gitcoffee-os 模块包", "单体代码拆成 ai-adapter / plugin-engine / publish-engine 等独立单元"),
           ("37 个发布器 · 四类内容", "文章 11 / 动态 11 / 视频 9 / 音频 6，按内容形态而非平台按钮组织"),
           ("插件引擎 + AI 适配层", "SchemaRegistry 统一注册，默认引擎零 Token，高级引擎按需接入")]
    y = 300
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=AMBER)
        t(d, (150, y), a, font("Bold", 30), TEAL)
        t(d, (150, y + 44), b, font("Regular", 23), MUTED)
        y += 116
    rr(d, (1150, 140, 1490, 670), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "1644"), ("Fork", "231"), ("版本", "v1.4.1"), ("语言", "TypeScript"),
            ("TS 文件", "101"), ("代码行", "1.95 万"), ("协议", "修改版 Apache-2.0")]
    yy = 186
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 23), AMBER, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-09 仓库源码实测 · 多租户与去 LOGO 需商业授权，详见文末许可边界", font("Medium", 21), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def evolution():
    W, H = 1200, 720
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 36), "两个月的架构演进：从一个扩展到一套平台", font("Black", 31), WHITE)
    # 左：旧
    rr(d, (60, 130, 540, 560), 16, fill=PANEL, outline=MUTED, width=2)
    t(d, (90, 158), "v1.1.20（2026-09 旧稿基线）", font("Bold", 24), MUTED)
    old = ["单体浏览器扩展", "约 1.9 万行 TS 集中在 src", "发布逻辑约 1.6 万行", "能力靠内置，扩展靠改源码", "仅扩展一种形态"]
    yy = 220
    for it in old:
        d.ellipse([90, yy + 8, 106, yy + 24], outline=MUTED, width=2)
        t(d, (122, yy + 16), it, font("Regular", 20), (200, 194, 208), anchor="lm")
        yy += 58
    # 箭头
    t(d, (575, 340), "→", font("Black", 44), AMBER, anchor="mm")
    # 右：新
    rr(d, (620, 130, 1140, 560), 16, fill=PANEL, outline=VIOLET, width=2)
    t(d, (650, 158), "v1.4.1（当前 main 分支）", font("Bold", 24), VIOLETL)
    new = ["35 个 @gitcoffee-os/* 独立包", "101 个 TS 文件，职责单一化", "插件引擎 registry/injector 解耦", "AI 适配层 SchemaRegistry 统一管理", "配套 SDK / CLI / 国际版 Postar"]
    yy = 220
    for it in new:
        d.ellipse([650, yy + 8, 666, yy + 24], outline=TEAL, width=2)
        t(d, (682, yy + 16), it, font("Regular", 20), (214, 208, 224), anchor="lm")
        yy += 58
    rr(d, (60, 600, 1140, 672), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 624), "注意：main 是快速迭代日常开发版，官方建议生产本地开发用稳定分支 v1.1.20", font("Bold", 20), AMBER, anchor="lm")
    t(d, (88, 656), "模块化让每个能力可独立测试、替换与复用，也为桌面端/移动端/CI 集成留出接口", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/evolution.png"); print("evolution.png")

def modules():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "35 个模块包怎么分工：四层拆解", font("Black", 31), WHITE)
    groups = [
        ("运行与连接层", ["postbot-background 后台", "postbot-tabs 多标签扇出", "postbot-events 事件总线", "i18n 中英文"], VIOLET),
        ("内容处理层", ["content-adapter 适配", "content-reader 智能阅读", "content-services 服务", "content-ui 界面"], TEAL),
        ("发布引擎层", ["publish-engine 核心引擎", "publisher-cn 国内 37 器", "publisher-it 国际扩展", "publisher-debug 调试"], AMBER),
        ("智能与扩展层", ["ai-adapter AI 适配", "plugin-engine 插件引擎", "postbot-api 对外接口", "stores 状态管理"], CORAL),
    ]
    bw, bh = 252, 470
    gap = 18
    x = 60
    y = 120
    for i, (h, items, c) in enumerate(groups):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 40), h, font("Bold", 21), c, anchor="mm")
        yy = y + 96
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 17), (212, 206, 220))
            yy += 56
    rr(d, (60, 630, 1140, 710), 12, fill=PANEL2, outline=TEAL, width=1)
    t(d, (88, 656), "依赖全部走 @gitcoffee-os 作用域包（见 package.json 35 个 dependencies），", font("Bold", 19), TEAL, anchor="lm")
    t(d, (88, 688), "层与层通过事件和接口通信，替换某个发布器或 AI 提供方不必动核心引擎", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/modules.png"); print("modules.png")

def publishers():
    W, H = 1200, 740
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "37 个发布器：按内容形态分四类，而非按平台堆按钮", font("Black", 30), WHITE)
    cards = [
        ("文章 article", "11 个", "微信/知乎/微博/头条/百家号\nB站/豆瓣/简书/企鹅号\n抖音/知识星球", VIOLET),
        ("动态 moment", "11 个", "小红书/快手/视频号\n微信/知乎/微博/头条\n百家号/豆瓣/抖音/星球", TEAL),
        ("视频 video", "9 个", "B站/抖音/快手/小红书\n视频号/企鹅号/微博\n头条/知乎", AMBER),
        ("音频 audio", "6 个", "喜马拉雅/小宇宙\n蜻蜓 FM/荔枝\n网易云音乐/QQ 音乐", CORAL),
    ]
    bw, bh = 252, 380
    gap = 18
    x = 60
    y = 120
    for i, (h, num, body, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        t(d, (xx + bw / 2, y + 44), h, font("Bold", 22), c, anchor="mm")
        t(d, (xx + bw / 2, y + 96), num, font("Black", 40), WHITE, anchor="mm")
        lines = body.split("\n")
        yy = y + 160
        for ln in lines:
            t(d, (xx + 20, yy), ln, font("Regular", 17), (208, 202, 216))
            yy += 48
    rr(d, (60, 540, 1140, 630), 12, fill=PANEL2, outline=VIOLET, width=1)
    t(d, (88, 570), "同一个平台会在不同形态下出现（如知乎同时支持文章/动态/视频），", font("Bold", 19), VIOLETL, anchor="lm")
    t(d, (88, 604), "说明底层是按“内容类型 → 平台适配”的矩阵设计，新增平台只需实现对应发布器接口", font("Regular", 18), MUTED, anchor="lm")
    t(d, (60, 672), "数据来自 src/media/publisher/platform 目录逐个文件清点（共 37 个 *.publisher.ts）", font("Medium", 19), MUTED)
    img.save(f"{OUT}/publishers.png"); print("publishers.png")

def limits():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "祛魅：能力边界与许可红线，先讲清楚再上手", font("Black", 30), WHITE)
    rr(d, (60, 116, 580, 540), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (88, 144), "它确实做到的", font("Bold", 24), TEAL)
    good = ["本地复用浏览器登录态，不交出账号密码", "默认发布引擎零 AI Token、社区版免费",
            "37 个国内发布器覆盖主流平台", "内容脚本 DOM 自动化 + 多标签扇出", "中英文 i18n、HTML/Markdown 双格式", "插件/SDK/CLI/MCP 留足扩展口"]
    yy = 198
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=TEAL, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (212, 208, 220), anchor="lm")
        yy += 54
    rr(d, (620, 116, 1140, 540), 14, fill=PANEL, outline=CORAL, width=2)
    t(d, (648, 144), "要留意的边界", font("Bold", 24), CORAL)
    bad = ["main 为开发版，生产建议用 v1.1.20 稳定分支", "国际平台不在本仓库，由 Postar/生态包提供",
           "Playwright/Hermes 等高级引擎是可选集成", "DOM 自动化依赖页面结构，平台改版可能失效", "多租户 SaaS 需商业授权", "去 LOGO/水印/版权信息也需授权"]
    yy = 198
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=CORAL, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (212, 208, 220), anchor="lm")
        yy += 54
    rr(d, (60, 576, 1140, 700), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 606), "许可：基于 Apache-2.0 修改版。可商用、可做企业开发平台，但禁止未授权多租户服务，", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 640), "前端不得移除 LOGO/水印/版权；贡献者代码可被官方用于商业，交互设计另有外观专利", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 678), "选型建议：个人与中小团队零成本分发足够；想做 SaaS 生意先谈授权", font("Medium", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
evolution()
modules()
publishers()
limits()
print("ALL DONE")
