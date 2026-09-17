#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""System Design Notes 三端推广教程配图生成。
自绘中文解释图（封面2 + 正文4）；repo 真实英文证据图另行拷贝。
注意：IMAGE_SPECS 必须在文件底部（函数定义之后）。
"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "system-design-notes-alex-xu-interview-guide"
OPS_DIR = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
STATIC_DIR = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# 暗色板（正文图）
BG      = (14, 16, 22)
BG2     = (20, 24, 34)
CARD    = (32, 36, 48)
CARD2   = (40, 45, 60)
LINE    = (66, 74, 96)
TEXT    = (232, 236, 246)
DIM     = (150, 158, 178)
BLUE    = (109, 172, 255)
ORANGE  = (255, 168, 76)
GREEN   = (119, 221, 119)
PINK    = (255, 119, 168)
TEAL    = (0, 200, 200)
PURPLE  = (170, 140, 255)
RED     = (255, 110, 110)
YELLOW  = (240, 210, 110)

FONT_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]
BOLD_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
]

def font(size, bold=False):
    for p in (BOLD_PATHS if bold else FONT_PATHS):
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def t(d, xy, s, f, fill, anchor="lm"):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

def card(d, xy, r=10, fill=CARD, outline=None, width=2):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def save(img, name):
    img.save(OPS_DIR / name)
    img.save(STATIC_DIR / name)
    print(f"  ok {name} {img.size}")

# ─────────────────────────── 微信封面 1280×544（亮色教程版） ───────────────────────────
def cover_wechat():
    W, H = 1280, 544
    img = Image.new("RGB", (W, H), (244, 246, 250))
    d = ImageDraw.Draw(img)
    # 右侧深色面板（像一摞架构图卡片）
    d.rounded_rectangle([830, 70, 1210, 474], radius=18, fill=(24, 28, 40))
    f_small = font(20)
    panels = [
        (100, "Step 1  理解问题 · 估算规模", BLUE),
        (200, "Step 2  高层设计 · 达成共识", ORANGE),
        (300, "Step 3  深入设计 · 组件拆解", GREEN),
        (400, "Step 4  总结收尾 · 权衡取舍", PINK),
    ]
    for y, label, c in panels:
        d.rounded_rectangle([860, y, 1180, y + 70], radius=10, fill=(40, 46, 62), outline=c, width=2)
        d.ellipse([878, y + 22, 904, y + 48], fill=c)
        t(d, (920, y + 35), label, font(21, True), (235, 240, 250))
    # 左侧文字
    d.rounded_rectangle([64, 78, 360, 128], radius=25, fill=(37, 99, 235))
    t(d, (212, 103), "GitHub 2 万 star 学习仓库", font(24, True), (255, 255, 255), anchor="mm")
    t(d, (64, 210), "系统设计面试", font(72, True), (18, 24, 40))
    t(d, (64, 300), "28 章中文导读", font(72, True), (37, 99, 235))
    t(d, (64, 386), "5.2 万词笔记 · 392 张手绘图 · 四步推演法", font(27), (70, 80, 100))
    t(d, (64, 470), "我逐章拆完后，告诉你怎么用、边界在哪", font(23), (110, 120, 140))
    return img

# ─────────────────────────── 知乎封面 1600×900（冷静分析版） ───────────────────────────
def cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 14, H], fill=(37, 99, 235))
    t(d, (70, 80), "开源学习资源测评", font(30, True), (37, 99, 235))
    t(d, (70, 190), "2 万 star 的系统设计笔记仓库，", font(58, True), (20, 30, 55))
    t(d, (70, 280), "到底是神坛资料还是答案合集？", font(58, True), (20, 30, 55))
    t(d, (70, 360), "基于 liquidslr/system-design-notes 的逐章核查：28 章 · 5.2 万词 · 392 图 · 0 行代码 · 无 License", font(26), (90, 100, 125))
    # 下方四象限：适合谁/不适合谁
    quad = [
        ("值得学", "统一四步推演模板\n配图质量高于多数专栏", (40, 150, 110)),
        ("要注意", "二手笔记，不是原书替代\n无 License，引用需谨慎", (210, 130, 40)),
        ("适合谁", "面试冲刺的后端工程师\n缺体系感的 1-5 年开发者", (37, 99, 235)),
        ("不适合谁", "追一线大厂真实架构\n要可运行代码的人", (150, 90, 200)),
    ]
    x0, y0, cw, ch, gap = 70, 430, 350, 330, 26
    for i, (title, body, c) in enumerate(quad):
        x = x0 + i * (cw + gap)
        d.rounded_rectangle([x, y0, x + cw, y0 + ch], radius=16, fill=(255, 255, 255), outline=c, width=3)
        d.rounded_rectangle([x, y0, x + cw, y0 + 70], radius=16, fill=c)
        d.rectangle([x, y0 + 40, x + cw, y0 + 70], fill=c)
        t(d, (x + cw // 2, y0 + 36), title, font(32, True), (255, 255, 255), anchor="mm")
        t(d, (x + 30, y0 + 130), body.split("\n")[0], font(25), (50, 55, 70))
        t(d, (x + 30, y0 + 200), body.split("\n")[1], font(25), (50, 55, 70))
    t(d, (70, H - 45), "数据来源：GitHub API + 逐章统计（2026-09 克隆核查）", font(22), (130, 138, 158))
    t(d, (W - 70, H - 45), "jackssybin.cn", font(22), (130, 138, 158), anchor="rm")
    return img

# ─────────────────────────── 图1：28 章知识地图 ───────────────────────────
def diagram_map():
    W, H = 1400, 1320
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    t(d, (W // 2, 48), "仓库全貌：28 章 = 4 章基础方法 + 9 个组件 + 15 个完整系统", font(34, True), TEXT, anchor="mm")
    groups = [
        ("基础方法层 · Ch1-4", BLUE, [
            "Ch1 从零扩展到百万用户", "Ch2 信封背面估算", "Ch3 系统设计面试框架", "Ch4 限流器"]),
        ("分布式组件层 · Ch5-13", TEAL, [
            "Ch5 一致性哈希", "Ch6 键值存储", "Ch7 唯一 ID 生成器",
            "Ch8 短链系统", "Ch9 网络爬虫", "Ch10 通知系统",
            "Ch11 信息流", "Ch12 聊天系统", "Ch13 搜索自动补全"]),
        ("完整系统案例 · Ch14-28（卷二）", ORANGE, [
            "Ch14 YouTube  Ch15 Google Drive  Ch16 附近服务",
            "Ch17 附近好友  Ch18 Google Maps  Ch19 消息队列",
            "Ch20 监控告警  Ch21 广告点击聚合  Ch22 酒店预订",
            "Ch23 分布式邮件  Ch24 S3 对象存储",
            "Ch25 游戏排行榜  Ch26 支付  Ch27 数字钱包  Ch28 证券交易所"]),
    ]
    y = 110
    for title, color, items in groups:
        n = len(items)
        bh = 70 if n <= 4 else (70 * n if title.startswith("完整") else 70 * 2 + 30)
        if title.startswith("基础"):
            bh = 430
        elif title.startswith("分布式组件"):
            bh = 430
        else:
            bh = 300
        d.rounded_rectangle([60, y, W - 60, y + bh], radius=14, fill=BG2, outline=color, width=2)
        t(d, (90, y + 38), title, font(28, True), color)
        t(d, (W - 90, y + 38), f"{n if not title.startswith('完整') else 15} 章", font(24), DIM, anchor="rm")
        if title.startswith("基础"):
            for i, it in enumerate(items):
                x = 90 + (i % 2) * 620
                yy = y + 100 + (i // 2) * 150
                card(d, [x, yy, x + 580, yy + 110], fill=CARD)
                t(d, (x + 24, yy + 40), it, font(25, True), TEXT)
                t(d, (x + 24, yy + 78), "四步法的第一个完整示范" if i == 0 else ["延迟/容量数字常识","答题节奏与沟通结构","令牌桶等 5 种算法对比"][i-1] if i > 0 else "", font(19), DIM)
        elif title.startswith("分布式组件"):
            for i, it in enumerate(items):
                x = 90 + (i % 3) * 410
                yy = y + 90 + (i // 3) * 105
                card(d, [x, yy, x + 380, yy + 80], fill=CARD)
                t(d, (x + 20, yy + 40), it, font(22, True), TEXT)
        else:
            for i, it in enumerate(items):
                yy = y + 85 + i * 42
                card(d, [90, yy - 3, W - 90, yy + 33], r=8, fill=CARD if i % 2 == 0 else CARD2)
                t(d, (110, yy + 15), it, font(21), TEXT)
        y += bh + 30
    return img

# ─────────────────────────── 图2：四步推演法 ───────────────────────────
def diagram_fourstep():
    W, H = 1400, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    t(d, (W // 2, 48), "每章统一骨架：Alex Xu 四步推演法（以 Ch28 证券交易所为例）", font(32, True), TEXT, anchor="mm")
    steps = [
        ("STEP 1", "理解问题 · 圈定范围", BLUE,
         ['问答澄清：只做股票',
          '限价单、正常交易时段',
          '非功能：99.99% 可用',
          '毫秒级、盯 99 分位',
          '估算：10 亿单/6.5h',
          '≈4.3 万 QPS，峰 21.5 万']),
        ("STEP 2", "高层设计 · 拿到认同", ORANGE,
         ['补业务：券商、买卖价',
          'L1/L2/L3 三级行情',
          '画主干：网关→撮合',
          '→行情发布',
          '先对齐再深入，不答偏']),
        ("STEP 3", "深入设计 · 组件拆解", GREEN,
         ['订单网关：风控、KYC',
          '下单前冻结资金',
          '撮合：单线程事件循环',
          '保证时序确定性',
          '事件溯源、顺序日志',
          '定序器、多播行情']),
        ("STEP 4", "总结收尾", PINK,
         ['复述关键取舍',
          '确定性优先于吞吐',
          '主动谈故障与扩展',
          '更多标的、盘后交易',
          '留 3-5 个讨论钩子']),
    ]
    x = 70
    cw = 300
    for i, (tag, title, color, bullets) in enumerate(steps):
        xx = x + i * (cw + 20)
        d.rounded_rectangle([xx, 110, xx + cw, 660], radius=14, fill=BG2, outline=color, width=2)
        d.rounded_rectangle([xx, 110, xx + cw, 175], radius=14, fill=color)
        d.rectangle([xx, 150, xx + cw, 175], fill=color)
        t(d, (xx + cw // 2, 135), tag, font(24, True), (15, 18, 26), anchor="mm")
        t(d, (xx + 22, 215), title, font(23, True), TEXT)
        yy = 275
        for line in bullets:
            d.ellipse([xx + 24, yy - 7, xx + 38, yy + 7], fill=color)
            t(d, (xx + 52, yy), line, font(20), (210, 216, 230))
            yy += 42
        if i < 3:
            ax = xx + cw + 10
            d.polygon([(ax, 370), (ax, 400), (ax + 12, 385)], fill=DIM)
    t(d, (W // 2, 715), "这套模板比任何单个答案都值钱：它把「开放题」变成「有节拍的对话」", font(24, True), YELLOW, anchor="mm")
    return img

# ─────────────────────────── 图3：仓库体检数据 ───────────────────────────
def diagram_audit():
    W, H = 1400, 820
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    t(d, (W // 2, 48), "仓库体检：我把 28 个目录逐个统计了一遍", font(32, True), TEXT, anchor="mm")
    nums = [
        ("20,056", "GitHub Stars", BLUE, "fork 3,765"),
        ("28", "完整章节", GREEN, "卷一 16 章 + 卷二 12 章"),
        ("52,492", "英文词数", ORANGE, "28 个 README 全量统计"),
        ("392", "PNG 架构图", TEAL, "最多一章 35 张（消息队列）"),
        ("0", "行可运行代码", PINK, "纯文档仓库，无示例工程"),
        ("无", "开源 License", RED, "GitHub API 核查 license = null"),
    ]
    x0, y0, cw, ch, gap = 70, 120, 400, 220, 30
    for i, (big, label, color, sub) in enumerate(nums):
        x = x0 + (i % 3) * (cw + gap)
        y = y0 + (i // 3) * (ch + 30)
        d.rounded_rectangle([x, y, x + cw, y + ch], radius=14, fill=BG2, outline=color, width=2)
        t(d, (x + 30, y + 78), big, font(64, True), color)
        t(d, (x + 30, y + 140), label, font(26, True), TEXT)
        t(d, (x + 30, y + 182), sub, font(20), DIM)
    d.rounded_rectangle([70, 640, W - 70, 770], radius=12, fill=(40, 30, 30), outline=RED, width=2)
    t(d, (95, 680), "必须知道的三个边界：", font(24, True), RED)
    t(d, (95, 722), "① 内容源自 Alex Xu 付费书，仓库未获官方授权且无 License，个人学习没问题，商用/转载有风险；", font(21), (235, 210, 210))
    t(d, (95, 758), "② 延迟数字等常识标注 Latency (2020)，需自行按 2026 硬件修正；③ 章节深浅不一（527～4254 词），后半部分更厚。", font(21), (235, 210, 210))
    return img

# ─────────────────────────── 图4：三周复习路线 ───────────────────────────
def diagram_path():
    W, H = 1400, 700
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    t(d, (W // 2, 48), "建议吃法：三周冲刺路线（不要从 Ch1 顺序啃到 Ch28）", font(32, True), TEXT, anchor="mm")
    weeks = [
        ("第 1 周 · 建框架", BLUE,
         ["精读 Ch1-4：扩展套路、估算表、面试框架、限流器",
          "把延迟数字表和可用性数字抄成自己的卡片",
          "产出：能脱稿画出「单机→负载均衡→多副本」演进图"]),
        ("第 2 周 · 啃组件", TEAL,
         ["Ch5 一致性哈希 + Ch6 KV 存储是全仓核心，精读",
          "Ch7/8/13（ID、短链、补全）熟悉套路后可速读",
          "每章遮住答案自己先画 HLD，再和图对拍"]),
        ("第 3 周 · 练系统", ORANGE,
         ["按目标公司选题：出海/地图岗 Ch16-18，基建岗 Ch19/20/24",
          "金融科技岗 Ch26-28（支付/钱包/交易所）",
          "用四步法做 2 场模拟面试并录音复盘"]),
    ]
    x = 70
    cw = 405
    for i, (title, color, items) in enumerate(weeks):
        xx = x + i * (cw + 25)
        d.rounded_rectangle([xx, 120, xx + cw, 600], radius=14, fill=BG2, outline=color, width=2)
        d.rounded_rectangle([xx, 120, xx + cw, 190], radius=14, fill=color)
        d.rectangle([xx, 160, xx + cw, 190], fill=color)
        t(d, (xx + cw // 2, 156), title, font(27, True), (15, 18, 26), anchor="mm")
        yy = 240
        for it in items:
            parts = [it[k:k+15] for k in range(0, len(it), 15)]
            d.ellipse([xx + 24, yy - 8, xx + 40, yy + 8], fill=color)
            for j, p in enumerate(parts):
                t(d, (xx + 56, yy + j * 32), p, font(21), (220, 226, 238))
            yy += 32 * len(parts) + 28
    t(d, (W // 2, 660), "顺序原则：先学「怎么答题」，再学「组件积木」，最后按岗位选系统案例", font(24, True), YELLOW, anchor="mm")
    return img

IMAGE_SPECS = [
    ("cover-wechat.jpg", 1280, 544, cover_wechat),
    ("cover-zhihu.png", 1600, 900, cover_zhihu),
    ("diagram-map.png", 1400, 1320, diagram_map),
    ("diagram-fourstep.png", 1400, 760, diagram_fourstep),
    ("diagram-audit.png", 1400, 820, diagram_audit),
    ("diagram-study-path.png", 1400, 700, diagram_path),
]

def main():
    for name, w, h, fn in IMAGE_SPECS:
        print(f"generating {name} ...")
        save(fn(), name)
    print("done")

if __name__ == "__main__":
    main()
