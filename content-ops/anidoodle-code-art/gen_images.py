# -*- coding: utf-8 -*-
"""anidoodle 配图：手绘纸张艺术风（米色纸底 + 墨黑 + 朱砂红 + 靛青 + 苔绿），契合代码手绘主题。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/anidoodle-code-art"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

PAPER = (244, 238, 226); INK = (38, 34, 32); PANEL = (252, 248, 240); PANEL2 = (236, 228, 214)
LINE = (196, 184, 166); RED = (196, 58, 46); INDIGO = (52, 84, 138); MOSS = (96, 128, 86)
GOLD = (178, 130, 52); GRAY = (110, 102, 94); PLUM = (124, 70, 104)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 8], fill=RED)
    t(d, (110, 92), "把画画这件事，写成可复现的代码", font("Black", 50), INK)
    t(d, (110, 172), "anidoodle：32 种手绘风格的 Agent 插件，插画、动画、发布片与配乐全部用代码生成", font("Bold", 25), INDIGO)
    pts = [("同一份源码，任何机器渲染完全一致", "纯函数 + 带种子随机，禁止 Math.random，逐像素可复现"),
           ("32 种画风 + 21 种曲风", "从铅笔水彩到木刻浮世绘，音符也是算术合成、无采样"),
           ("一个插件适配三大 Agent", "Claude Code / Codex / Grok，84 个工具脚本与 89 项测试")]
    y = 290
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=RED)
        t(d, (150, y), a, font("Bold", 26), RED)
        t(d, (150, y + 40), b, font("Regular", 21), GRAY)
        y += 108
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "1703"), ("Fork", "151"), ("语言", "TypeScript"), ("引擎代码", "8.1 万行"),
            ("画风", "32 种"), ("曲风", "21 种"), ("协议", "Apache2.0")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), GRAY)
        t(d, (1455, yy), v, font("Bold", 21), GOLD, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-15 仓库源码实测 · 它是 Agent 技能/插件而非独立软件，需配合编码 Agent 使用", font("Medium", 19), GRAY)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def concept():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "核心理念：每一帧都是一个纯函数的结果", font("Black", 29), INK)
    # 左：传统图像模型
    rr(d, (60, 120, 560, 560), 14, fill=PANEL, outline=PLUM, width=2)
    t(d, (88, 148), "图像生成模型的做法", font("Bold", 22), PLUM)
    bad = ["每渲染一帧都消耗 token/算力", "同一提示词每次结果都不同", "风格、角色难以逐帧保持", "放大重绘要重新花钱", "过程是黑箱、不可精确复现"]
    yy = 206
    for it in bad:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=PLUM, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (74, 66, 68), anchor="lm")
        yy += 62
    # 右：anidoodle
    rr(d, (620, 120, 1140, 560), 14, fill=PANEL, outline=MOSS, width=2)
    t(d, (648, 148), "anidoodle 的代码作画", font("Bold", 22), MOSS)
    good = ["renderFrame 是纯函数，帧间无状态", "随机数只来自带种子的 rng", "缓存键写清像素依赖的每个输入", "写一次源码，之后渲染零成本", "任何人拿到源码都能重建同一作品"]
    yy = 206
    for it in good:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=MOSS, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (56, 66, 58), anchor="lm")
        yy += 62
    rr(d, (60, 600, 1140, 700), 12, fill=PANEL2, outline=RED, width=1)
    t(d, (88, 630), "47 秒示例短片共 1410 帧：第一遍约每帧 60 个 token 的代码量，之后任意机器、任意尺寸重渲染都免费，", font("Bold", 18), RED, anchor="lm")
    t(d, (88, 664), "且每次分毫不差——一张插画是函数调用一次，循环调用就是贴纸，配上故事和音乐就是短片", font("Regular", 18), GRAY, anchor="lm")
    img.save(f"{OUT}/concept.png"); print("concept.png")

def styles():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 32), "32 种画风：像 32 位不同插画师在作画", font("Black", 29), INK)
    groups = [
        ("纸笔手绘", ["铅笔与水彩", "彩色铅笔", "圆珠笔", "炭笔擦画", "蜡笔", "粉笔黑板"], INDIGO),
        ("印刷与版画", ["孔版印刷", "报纸网点", "木刻/浮世绘", "单线雕版", "蓝晒蓝图", "刮画"], RED),
        ("质感与拼贴", ["剪纸拼贴", "纸艺", "刺绣", "复古剪贴簿", "民间故事绘本", "绘本"], MOSS),
        ("数字与立体", ["像素画", "扁平矢量", "等距视角", "低多边形3D", "橡皮管动画", "水墨画"], GOLD),
    ]
    bw, bh = 252, 420
    gap = 18
    x, y = 60, 120
    for i, (h, items, c) in enumerate(groups):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 36), h, font("Bold", 20), c, anchor="mm")
        yy = y + 84
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 16), (64, 58, 56))
            yy += 52
    rr(d, (60, 580, 1140, 700), 12, fill=PANEL2, outline=INDIGO, width=1)
    t(d, (88, 612), "每种风格是一套完整配方（落笔顺序、笔触、纸张纹理都由代码模拟），并附按真实画家作画顺序逐笔生成的延时影片，", font("Bold", 18), INDIGO, anchor="lm")
    t(d, (88, 648), "影片最后一帧与静态图逐像素一致；选定一种风格后，品牌所有插画都像出自同一双手", font("Regular", 18), GRAY, anchor="lm")
    t(d, (60, 734), "完整 32 项见 engine/styles.gen.json 与 references/styles.md", font("Medium", 17), GRAY)
    img.save(f"{OUT}/styles.png"); print("styles.png")

def pipeline():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "从一句话到成片：Agent 编排 + 84 个工具", font("Black", 28), INK)
    steps = [("① 说需求", "大白话描述\n自动路由工作流\n和风格配方", INDIGO),
             ("② 静态验证", "still.mjs 先\n出一张静态图\n确认效果", MOSS),
             ("③ 渲染", "render.mjs 出\nGIF/MP4/WebM\n四后端同核心", GOLD),
             ("④ 配乐音效", "music.mjs 作曲\n21曲风代码合成\ncheck 先审乐", PLUM),
             ("⑤ 校验交付", "gate/verify 查\n确定性与音画\nemit 离线HTML", RED)]
    bw, bh = 208, 380
    gap = 14
    x, y = 50, 130
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 40), h, font("Bold", 19), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 104
        for ln in lines:
            t(d, (xx + 16, yy), ln, font("Regular", 16), (62, 56, 54))
            yy += 48
        if i < 4:
            t(d, (xx + bw + gap - 1, y + bh / 2), "→", font("Bold", 22), GRAY, anchor="mm")
    rr(d, (50, 556, 1150, 664), 12, fill=PANEL2, outline=MOSS, width=1)
    t(d, (78, 586), "四个后端（playwright / html-player / remotion / hyperframes）共用同一个绘图核心，", font("Bold", 18), MOSS, anchor="lm")
    t(d, (78, 622), "核心不关心是谁在画；需要 Node 20+，动态内容另需 ffmpeg，emit 产物约 100KB 可离线双击播放", font("Regular", 18), GRAY, anchor="lm")
    t(d, (50, 704), "据 engine/tools 与 references/working-method.md 整理", font("Medium", 17), GRAY)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "上手前看清：它的边界与诚实之处", font("Black", 28), INK)
    rr(d, (60, 116, 580, 580), 14, fill=PANEL, outline=MOSS, width=2)
    t(d, (88, 144), "它适合什么", font("Bold", 24), MOSS)
    good = ["需要品牌视觉高度一致的团队", "做官网插画、信息图、空状态/404", "产品发布片、讲解视频、社交卡片", "互动网页吉祥物与滚动动画", "想要可复现、可版本管理的美术", "偏好自托管、纯代码无素材版权问题"]
    yy = 200
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=MOSS, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (56, 64, 58), anchor="lm")
        yy += 58
    rr(d, (620, 116, 1140, 580), 14, fill=PANEL, outline=RED, width=2)
    t(d, (648, 144), "要知道的边界", font("Bold", 24), RED)
    bad = ["是 Agent 插件不是独立 App，要配编码 Agent", "产出审美上限取决于你的引导和模型", "引擎 8 万行，深度定制有学习曲线", "动态渲染依赖 Node/ffmpeg/浏览器", "照片重绘是代码笔触，非照片级写实", "Apache-2.0 含 NOTICE 与署名要求"]
    yy = 200
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=RED, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (76, 60, 58), anchor="lm")
        yy += 58
    rr(d, (60, 616, 1140, 720), 12, fill=PANEL2, outline=INDIGO, width=1)
    t(d, (88, 646), "难得的诚实：确定性文档主动记录了一次首跑 0/12 不一致、复跑才通过的事故，", font("Bold", 19), INDIGO, anchor="lm")
    t(d, (88, 682), "强调“重跑到绿就当没事”最危险，要求无法复现也要把尝试过程写成结论——工程态度比口号可信", font("Bold", 19), GOLD, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
concept()
styles()
pipeline()
limits()
print("ALL DONE")
