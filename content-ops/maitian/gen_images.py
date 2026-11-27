#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""麦田 mdldm-maitian 六张配图 — 麦田绿+麦浪金，深石墨绿底，工程克制风。1280x800。"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)
W, H = 1280, 800

# 配色
BG      = "#1c221c"   # 深石墨绿
CARD    = "#262e25"
GREEN   = "#7bae5a"   # 麦苗绿
GOLD    = "#f2b21b"   # 麦浪金
PURPLE  = "#7b5cff"   # 点缀紫
TEXT    = "#ecefe6"
MUTED   = "#9aa68f"
LINE    = "#3a4536"
RED     = "#d97757"
CYAN    = "#6fc3b0"

FONT_DIR = "/usr/share/fonts/google-noto-cjk/"
def F(size, bold=True):
    name = "NotoSansCJK-Bold.ttc" if bold else "NotoSansCJK-Regular.ttc"
    return ImageFont.truetype(FONT_DIR + name, size)

def base():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # 顶部细色带
    d.rectangle([0, 0, W, 6], fill=GREEN)
    d.rectangle([0, 6, W//3, 6], fill=GOLD)
    return img, d

def title(d, kicker, t, sub=None):
    d.text((64, 48), kicker, font=F(22), fill=GOLD)
    d.text((64, 84), t, font=F(40), fill=TEXT)
    if sub:
        d.text((64, 146), sub, font=F(22, False), fill=MUTED)
    d.line([64, 196, W-64, 196], fill=LINE, width=2)

def footer(d, n):
    d.text((64, H-44), "麦田 mdldm-maitian · 数据来自本地克隆核验", font=F(18, False), fill=MUTED)
    d.text((W-110, H-48), f"{n:02d} / 06", font=F(20), fill=GREEN)

def card(d, box, fill=CARD, outline=LINE):
    d.rounded_rectangle(box, radius=16, fill=fill, outline=outline, width=2)

def save(img, name):
    p = os.path.join(OUT, name)
    img.save(p, "PNG")
    print("saved", p)

# ---------- 图1：痛点对照 ----------
def img1():
    img, d = base()
    title(d, "THE PAIN · 多平台博主的日常", "一期视频，要在七个平台手动发七遍", "文案、封面、发布形式各不同，发完还想知道哪期真带来了涨粉和收入")
    # 左：手动
    card(d, [64, 230, 600, 690])
    d.text((96, 256), "没有麦田：纯手工", font=F(28), fill=RED)
    plats = ["B站", "抖音", "小红书", "视频号", "YouTube", "X", "Instagram"]
    y = 320
    for i, p in enumerate(plats):
        d.rounded_rectangle([96, y, 568, y+44], radius=8, fill="#2f2a26", outline="#4a3a30", width=1)
        d.text((118, y+8), f"{i+1}. 打开 {p} 上传页", font=F(21, False), fill=TEXT)
        d.text((430, y+8), "重复操作 ×7", font=F(19), fill=RED)
        y += 52
    # 右：麦田
    card(d, [640, 230, 1216, 690], fill="#22301f", outline=GREEN)
    d.text((672, 256), "有麦田：说一句「整理发布」", font=F(28), fill=GREEN)
    steps = [("① AI 写好七平台差异化文案", GOLD),
             ("② 进分发计划，排好定时", GREEN),
             ("③ 插件分批自动填写上传页", GREEN),
             ("④ 国内四家等你点最后一下", GOLD),
             ("⑤ 到点自动取链接、每天采数据", GREEN)]
    y = 330
    for s, c in steps:
        d.ellipse([676, y+6, 692, y+22], fill=c)
        d.text((710, y), s, font=F(22), fill=TEXT)
        y += 62
    footer(d, 1)
    save(img, "01-pain-vs-maitian.png")

# ---------- 图2：三层架构 ----------
def img2():
    img, d = base()
    title(d, "ARCHITECTURE · 三层 Agent 架构", "写文案、填表单、管调度，各管一段", "不是一个大脚本包打天下，而是三个职责清晰的部件协作")
    layers = [
        ("① 发布 Skill", "装进 Claude Code / Codex：看片、写各平台文案、生成 publish.json 并校验", GOLD, 230),
        ("② 麦田发布助手（Chrome 扩展）", "应用商店安装自动更新：打开上传页、传视频封面、填文案、设定时", GREEN, 386),
        ("③ 麦田 Hub（Node 守护进程）", "分发计划 · 调度防重 · 等你点发布 · 取链接 · 采数据 · 网页大屏 · 飞书通知", PURPLE, 542),
    ]
    for t, desc, c, y in layers:
        card(d, [96, y, 1184, y+128], outline=c)
        d.rectangle([96, y, 110, y+128], fill=c)
        d.text((140, y+22), t, font=F(30), fill=c)
        d.text((140, y+72), desc, font=F(21, False), fill=TEXT)
        if y < 500:
            d.polygon([(624, y+136), (608, y+156), (640, y+156)], fill=MUTED)
    footer(d, 2)
    save(img, "02-three-layer-architecture.png")

# ---------- 图3：自动 vs 人工边界 ----------
def img3():
    img, d = base()
    title(d, "THE BOUNDARY · 最反直觉的设计", "它故意不帮你点「发布」", "国内四家只填写不提交，最后一下人点——这是对平台风控的清醒")
    # 左 手动
    card(d, [64, 230, 620, 690], outline=GOLD)
    d.text((96, 256), "人工点发布（4 家）", font=F(28), fill=GOLD)
    d.text((96, 300), "填好就停，守护进程每 20 分钟提醒", font=F(19, False), fill=MUTED)
    manual = ["B站 bilibili", "抖音 douyin", "小红书 xhs", "视频号 channels"]
    y = 350
    for p in manual:
        d.rounded_rectangle([96, y, 588, y+64], radius=10, fill="#332d1f", outline=GOLD, width=1)
        d.text((124, y+16), p, font=F(25), fill=TEXT)
        d.text((440, y+18), "👤 你来点", font=F(21), fill=GOLD)
        y += 78
    # 右 自动
    card(d, [660, 230, 1216, 690], outline=GREEN)
    d.text((692, 256), "回读核对后自动提交（5 家）", font=F(28), fill=GREEN)
    d.text((692, 300), "确认文案与定时一致才提交，只点一次", font=F(19, False), fill=MUTED)
    auto = ["YouTube", "X", "Instagram", "Threads", "知识站 zsz"]
    y = 350
    for p in auto:
        d.rounded_rectangle([692, y, 1184, y+52], radius=10, fill="#22301f", outline=GREEN, width=1)
        d.text((718, y+12), p, font=F(22), fill=TEXT)
        d.text((1040, y+14), "⚙ 自动", font=F(19), fill=GREEN)
        y += 64
    footer(d, 3)
    save(img, "03-auto-vs-manual-boundary.png")

# ---------- 图4：数据闭环 ----------
def img4():
    img, d = base()
    title(d, "DATA LOOP · 不只是发布，更是复盘闭环", "播种 → 长势 → 收成，数据每天自己回来", "发布只是开始，长期留存的流量/粉丝/转化才是价值")
    stages = [
        ("播种", "发布", "分批填写七平台\n定时排期、防重", GREEN),
        ("长势", "流量+粉丝", "每天上午采一次\n新期头3天每6小时", GOLD),
        ("收成", "转化", "UTM 追踪注册/会员\n订单/收入来源", PURPLE),
    ]
    x = 96
    for i, (a, b, c, col) in enumerate(stages):
        card(d, [x, 250, x+340, 520], outline=col)
        d.ellipse([x+24, 280, x+84, 340], fill=col)
        d.text((x+38, 292), str(i+1), font=F(34), fill=BG)
        d.text((x+110, 282), a, font=F(34), fill=col)
        d.text((x+110, 332), b, font=F(22), fill=TEXT)
        for j, line in enumerate(c.split("\n")):
            d.text((x+28, 400+j*34), line, font=F(20, False), fill=MUTED)
        if i < 2:
            d.polygon([(x+356, 375), (x+376, 360), (x+376, 390)], fill=MUTED)
        x += 380
    # 底部复盘
    card(d, [96, 560, 1184, 660], fill="#22301f", outline=GREEN)
    d.text((128, 582), "自动复盘", font=F(26), fill=GREEN)
    d.text((128, 624), "发布后第 1 / 3 / 7 天出复盘卡片：各平台占比、互动率、同龄对比、期间涨粉；每周一自动出周报", font=F(21, False), fill=TEXT)
    footer(d, 4)
    save(img, "04-data-loop.png")

# ---------- 图5：安全与风控 ----------
def img5():
    img, d = base()
    title(d, "SAFETY · 个人能长期用下去的边界", "不碰密码、不调接口、不重复传", "每条规则都来自作者每天实发踩过的坑，而非想当然")
    items = [
        ("不存任何平台密码", "用专用 Chrome 自己的登录态（CDP 9333），config / data / chrome-profile 全在 .gitignore"),
        ("小红书只走最保守路径", "只读已渲染内容、像人一样滚动点击，不在页面里直接调接口，低频操作"),
        ("同一条视频每平台只传一次", "反复重传最容易触发风控，中控防重：已到位平台不再跑"),
        ("视频号定时可能被平台改掉", "sync 拿平台记录与计划比对，不一致立刻发 ⚠️ 飞书卡片（遇到过 +2 小时）"),
        ("成片必须 faststart（moov 在头）", "否则小红书报「无视频流」、抖音不出表单，validate 提前拦截"),
        ("只读自己账号，不做互动自动化", "不碰别人账号；不用的平台可停用，不体检不发布不采粉丝"),
    ]
    y = 226
    for i, (t, desc) in enumerate(items):
        col = GREEN if i % 2 == 0 else GOLD
        d.ellipse([80, y+6, 98, y+24], fill=col)
        d.text((118, y-2), t, font=F(24), fill=TEXT)
        d.text((118, y+32), desc, font=F(18, False), fill=MUTED)
        y += 70
    footer(d, 5)
    save(img, "05-safety-risk-control.png")

# ---------- 图6：三档上手 ----------
def img6():
    img, d = base()
    title(d, "GET STARTED · 三级上手，按需投入", "从只看数据到算清收入，逐级解锁", "不必一次配齐，L1 只要 30 分钟就能先看到全平台数据大屏")
    levels = [
        ("L1", "只看数据", "各平台粉丝、已发作品播放互动\n网页大屏 + 飞书日报", "约 30 分钟", GREEN),
        ("L2", "分发", "一期填好七个平台\n定时发布、自动取链接", "再加 1 小时", GOLD),
        ("L3", "转化", "每期带来的注册与收入\n对接自有站点接口", "看站点开发量", PURPLE),
    ]
    x = 96
    for lv, name, desc, time, col in levels:
        card(d, [x, 240, x+340, 620], outline=col)
        d.rounded_rectangle([x, 240, x+340, 310], radius=16, fill=col)
        d.rectangle([x, 280, x+340, 310], fill=col)
        d.text((x+28, 252), f"{lv} · {name}", font=F(30), fill=BG)
        for j, line in enumerate(desc.split("\n")):
            d.text((x+28, 350+j*40), line, font=F(22), fill=TEXT)
        d.line([x+28, 480, x+312, 480], fill=LINE, width=2)
        d.text((x+28, 510), "投入", font=F(19, False), fill=MUTED)
        d.text((x+28, 544), time, font=F(26), fill=col)
        x += 380
    d.text((96, 660), "环境要求：macOS / Windows 10-11 · Node.js ≥ 22.5（内置 node:sqlite）· Google Chrome", font=F(20, False), fill=MUTED)
    footer(d, 6)
    save(img, "06-three-levels.png")

for fn in (img1, img2, img3, img4, img5, img6):
    fn()
print("ALL DONE")
