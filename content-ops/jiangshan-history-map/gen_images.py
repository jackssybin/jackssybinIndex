# -*- coding: utf-8 -*-
"""江山时序配图：宣纸古舆图风（宣纸米底 + 墨黑 + 朱砂红 + 石青 + 赭石），契合历史地图主题。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/jiangshan-history-map"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

PAPER = (243, 236, 220); INK = (34, 30, 28); PANEL = (250, 245, 233); PANEL2 = (234, 224, 204)
LINE = (198, 184, 158); RED = (178, 48, 40); BLUE = (44, 92, 128); OCHRE = (168, 118, 54)
MOSS = (96, 120, 84); PLUM = (120, 66, 96); GRAY = (104, 96, 86)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 8], fill=RED)
    t(d, (110, 92), "拖动时间轴，看两千四百年江山分合", font("Black", 50), INK)
    t(d, (110, 172), "江山时序：中国历史交互舆图（前403三家分晋—今），点城读史、追随古人足迹", font("Bold", 24), BLUE)
    pts = [("18 个历史时期 · 200+ 疆域快照", "18 朝代目录、206 个 GeoJSON，多政权并立同屏宣纸设色"),
           ("点地溯源 + 点人溯事", "古城名关两千年沿革，七位历史人物行迹与三场大战逐站展开"),
           ("纯原生 JS 自研渲染，无地图框架", "3.4 万行代码、自定义 5 位编码压缩，GPL-3.0 开源")]
    y = 290
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=RED)
        t(d, (150, y), a, font("Bold", 26), RED)
        t(d, (150, y + 40), b, font("Regular", 21), GRAY)
        y += 108
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "7096"), ("Fork", "831"), ("语言", "JavaScript"), ("朝代", "18 个"),
            ("疆域快照", "200+"), ("GeoJSON", "206"), ("协议", "GPL-3.0")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), GRAY)
        t(d, (1455, yy), v, font("Bold", 21), OCHRE, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-17 仓库源码实测 · 数字人文项目，四语言 README（简繁英日）", font("Medium", 19), GRAY)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def architecture():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "没有地图框架：一个纯原生 JS 的历史 GIS", font("Black", 29), INK)
    cards = [
        ("数据层", ["18 朝代 GeoJSON 疆域", "205 个时序快照", "5 位自定义坐标编码", "32MB 数据/26 部典籍"], RED),
        ("逻辑层", ["17 个 JS 模块/3.4 万行", "快照调度 atlas_snapshots", "行迹/搜索/问答/测验", "i18n 四语言字典"], BLUE),
        ("渲染层", ["自研 SVG + Canvas 投影", "无 leaflet/d3/mapbox", "宣纸设色与虚线残影", "古海岸线/水系随年代演进"], MOSS),
        ("交付层", ["静态站 nginx/Docker", "Deep Links 任意门", "iframe 嵌入与 PWA", "Cloudflare/ Pages 部署"], OCHRE),
    ]
    bw, bh = 252, 440
    gap = 18
    x, y = 60, 120
    for i, (h, items, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 38), h, font("Bold", 21), c, anchor="mm")
        yy = y + 92
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 16), (60, 54, 50))
            yy += 56
    rr(d, (60, 600, 1140, 700), 12, fill=PANEL2, outline=RED, width=1)
    t(d, (88, 630), "快照数据里每个节点带 caption（年代标题）与 note（史事考辨），polities/regions 用数字 ID 索引，", font("Bold", 18), RED, anchor="lm")
    t(d, (88, 664), "兼顾体积与可维护性；无 package.json、无 node_modules，双击 index.html 即可运行", font("Regular", 18), GRAY, anchor="lm")
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def gameplay():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 32), "四种玩法：把历史课本变成可交互的舆图", font("Black", 29), INK)
    cards = [
        ("① 时间轴看分合", ["拉滑块切换疆域盈亏", "朱砂虚线残影对比前后", "当朝帝王年号同步", "多政权并立同屏高亮", "黄河改道/古湖消长"], RED),
        ("② 点地溯源", ["点古城名关读千年小传", "战国到当代政区沿革表", "定点地标大事内嵌", "天下雄关汉阙图标", "古今省界叠加对照"], BLUE),
        ("③ 点人溯事", ["编号图钉标一生行迹", "版图随脚步同步流转", "李白杜甫高适多人同看", "同途标出相逢站点", "秦灭六国等事件三幕"], MOSS),
        ("④ 寻址小试", ["隐去城名盲猜落针", "当朝掌故线索不剧透", "同心圆环距离得分", "十题授传统官阶", "语音讲解自动巡礼"], OCHRE),
    ]
    bw, bh = 252, 480
    gap = 18
    x, y = 60, 118
    for i, (h, items, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + 18, y + 28), h, font("Bold", 19), c)
        yy = y + 84
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 16), (58, 52, 48))
            yy += 58
    rr(d, (60, 636, 1140, 720), 12, fill=PANEL2, outline=BLUE, width=1)
    t(d, (88, 666), "七位人物行迹：秦始皇、张骞、诸葛亮、玄奘、李白、苏轼、王阳明；三场事件：楚汉之争、安史之乱、靖康之变，", font("Bold", 18), BLUE, anchor="lm")
    t(d, (88, 700), "每个站点配《史记》《出师表》《传习录》或唐宋名篇原句，支持键盘方向键与空格自动演进", font("Regular", 18), GRAY, anchor="lm")
    img.save(f"{OUT}/gameplay.png"); print("gameplay.png")

def data_model():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "一个疆域快照长什么样：数据模型拆解", font("Black", 28), INK)
    # 左：快照字段
    rr(d, (60, 116, 560, 600), 14, fill=PANEL, outline=BLUE, width=2)
    t(d, (88, 144), "时序快照（atlas_snapshots）", font("Bold", 22), BLUE)
    fields = [("caption", "年代区间与标题，如「648—656 置安西四镇」"),
              ("note", "史事考辨长文，交代来龙去脉"),
              ("prefRef / regionRef", "关联政区与疆域 GeoJSON"),
              ("polities[]", "并立政权 ID 数组，支持多政权同屏"),
              ("regions[] / prefectures[]", "疆域面与州郡政区索引")]
    yy = 200
    for k, v in fields:
        t(d, (88, yy), k, font("Bold", 17), RED)
        t(d, (88, yy + 28), v, font("Regular", 16), (64, 58, 54))
        yy += 78
    # 右：压缩与编码
    rr(d, (620, 116, 1140, 600), 14, fill=PANEL, outline=MOSS, width=2)
    t(d, (648, 144), "工程巧思", font("Bold", 22), MOSS)
    tricks = ["坐标用每字符 5 位的自定义编码", "ring() 解码为经纬度增量数组", "特征缓存按 shape 复用几何", "政权/政区统一用数字 ID 索引", "GeoJSON 按朝代分文件懒加载", "字体仅加载用到的字符子集"]
    yy = 200
    for it in tricks:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=MOSS, width=2)
        t(d, (680, yy + 16), it, font("Regular", 18), (52, 60, 52), anchor="lm")
        yy += 60
    rr(d, (60, 636, 1140, 700), 12, fill=PANEL2, outline=OCHRE, width=1)
    t(d, (88, 668), "llms.txt 与 34 个 topics 静态专题页让内容可被检索和引用；works.json 收录 26 部典籍，", font("Bold", 18), OCHRE, anchor="lm")
    t(d, (88, 690), "数据与表现分离，使得同一套史料能同时驱动地图、行迹、测验与多语言界面", font("Regular", 17), GRAY, anchor="lm")
    img.save(f"{OUT}/data-model.png"); print("data-model.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img)
    t(d, (60, 34), "理性看待：一个个人项目的能与不能", font("Black", 28), INK)
    rr(d, (60, 116, 580, 580), 14, fill=PANEL, outline=MOSS, width=2)
    t(d, (88, 144), "它的可贵之处", font("Bold", 24), MOSS)
    good = ["零依赖纯原生，离线可跑、可自托管", "疆域变迁有考辨文字，非简单色块动画", "Deep Links 让每个历史瞬间可分享", "GPL-3.0 保证衍生作品同样开放", "四语言界面与繁体，利于传播", "提供 Agent skill 辅助内容贡献"]
    yy = 200
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=MOSS, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (52, 60, 52), anchor="lm")
        yy += 58
    rr(d, (620, 116, 1140, 580), 14, fill=PANEL, outline=RED, width=2)
    t(d, (648, 144), "要知道的边界", font("Bold", 24), RED)
    bad = ["个人项目，史料考订仍需专业核对", "疆域边界是示意而非精确国界", "部分时期快照密度高于其他时期", "无后端协作，内容更新靠 PR", "GPL-3.0 有强 copyleft 传染性", "语音讲解依赖浏览器 TTS 能力"]
    yy = 200
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=RED, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (72, 54, 52), anchor="lm")
        yy += 58
    rr(d, (60, 616, 1140, 720), 12, fill=PANEL2, outline=BLUE, width=1)
    t(d, (88, 646), "CONTRIBUTING 文档详细说明了史料引用与快照提交流程，作者把它定位为数字人文（Digital Humanities）作品，", font("Bold", 19), BLUE, anchor="lm")
    t(d, (88, 682), "而非权威历史地图集——用于建立时空直觉极佳，严肃研究仍应回溯《中国历史地图集》等原始文献", font("Bold", 19), OCHRE, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
architecture()
gameplay()
data_model()
limits()
print("ALL DONE")
