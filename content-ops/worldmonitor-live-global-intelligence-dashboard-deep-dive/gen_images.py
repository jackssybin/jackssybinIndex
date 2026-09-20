# -*- coding: utf-8 -*-
"""World Monitor 三端推广配图生成"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/root/jackssybinIndex/content-ops/worldmonitor-live-global-intelligence-dashboard-deep-dive/media"
SITE = "/root/jackssybinIndex/static/images/worldmonitor-live-global-intelligence-dashboard-deep-dive"
os.makedirs(OUT, exist_ok=True)
os.makedirs(SITE, exist_ok=True)

FB = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Black.ttc"
FR = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Medium.ttc"
FL = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Light.ttc"

def font(path, size):
    return ImageFont.truetype(path, size)

# ---------- palette ----------
BG = (11, 18, 32)
PANEL = (17, 27, 45)
CYAN = (34, 211, 238)
GREEN = (52, 211, 153)
AMBER = (245, 158, 11)
RED = (239, 68, 68)
BLUE = (96, 165, 250)
WHITE = (226, 232, 240)
GREY = (148, 163, 184)

def rrect(d, box, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

# ============ 1. CII 算法分解图 (1200x760) ============
def cii_chart():
    W, H = 1200, 760
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((60, 44), "CII v8：一个国家的「不稳定分数」是怎么算出来的", font=font(FB, 34), fill=WHITE)
    d.text((60, 96), "0–100 分 · 31 个 Tier-1 国家 · 服务器权威计算 · 24h 变化量", font=font(FR, 20), fill=GREY)

    # baseline 40 / event 60 大条
    y = 160
    rrect(d, (60, y, 1140, y+72), 12, fill=PANEL)
    rrect(d, (60, y, 60+int(1080*0.4), y+72), 12, fill=(30,58,95))
    d.text((84, y+20), "结构性基线风险 40%", font=font(FB, 22), fill=BLUE)
    d.text((560, y+20), "事件分 60%（Unrest / Conflict / Security / Information）", font=font(FB, 22), fill=AMBER)

    # 4 event components
    comps = [
        ("Unrest 骚动 25%", "抗议/骚乱/断网\n民主国家 log2 阻尼\n威权国家线性计分", GREEN),
        ("Conflict 冲突 30%", "ACLED 加权事件\n交战×3 爆炸×4\n平民暴力×5，log 曲线", RED),
        ("Security 安全 20%", "军机 3 分/架\n军舰 5 分/艘\nGPS 干扰、领空关闭", AMBER),
        ("Information 信息 25%", "头条国家归因\n仅 critical/high\n级别新闻可推动分数", CYAN),
    ]
    cw, gap = 252, 24
    x0 = 60
    for i, (t, body, c) in enumerate(comps):
        x = x0 + i*(cw+gap)
        rrect(d, (x, 272, x+cw, 470), 14, fill=PANEL, outline=c, width=2)
        d.text((x+18, 290), t, font=font(FB, 21), fill=c)
        for j, line in enumerate(body.split("\n")):
            d.text((x+18, 340+j*34), line, font=font(FR, 18), fill=WHITE)

    # floors & boosts
    rrect(d, (60, 500, 558, 700), 14, fill=PANEL, outline=RED, width=2)
    d.text((82, 518), "硬性地板（Floors）", font=font(FB, 22), fill=RED)
    floors = ["UCDP 活跃战争 → 锁死 ≥ 70", "UCDP 次要冲突 → ≥ 50",
              "外交部「请勿前往」警告 → ≥ 60", "「重新考虑前往」→ ≥ 50"]
    for j, t in enumerate(floors):
        d.text((82, 560+j*32), "• " + t, font=font(FR, 18), fill=WHITE)

    rrect(d, (582, 500, 1140, 700), 14, fill=PANEL, outline=AMBER, width=2)
    d.text((604, 518), "实时加成（Boosts，节选）", font=font(FB, 22), fill=AMBER)
    boosts = ["地震最高 +25 ｜ 流离失所 +20", "旅行警告 +15 ｜ 气候 +15",
              "制裁 +14 ｜ 网络威胁 +12", "AIS 航运中断 +10 ｜ 山火 +8"]
    for j, t in enumerate(boosts):
        d.text((604, 560+j*32), "• " + t, font=font(FR, 18), fill=WHITE)

    d.text((60, 716), "来源：docs/algorithms.mdx · docs/architecture.mdx · 实测页 country-instability-index（2026-09-20）",
           font=font(FL, 15), fill=GREY)
    im.save(f"{OUT}/diagram-cii.png")
    print("cii ok")

# ============ 2. 架构/数据流图 (1200x820) ============
def arch_chart():
    W, H = 1200, 820
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((60, 40), "一个代码库，六个站点：World Monitor 的数据流", font=font(FB, 32), fill=WHITE)
    d.text((60, 90), "浏览器 SPA / Tauri 桌面端 → Edge 网关 → Redis 三层缓存 → 748 个归属数据源", font=font(FR, 19), fill=GREY)

    def box(x1,y1,x2,y2,title,sub,c,ts=20):
        rrect(d,(x1,y1,x2,y2),12,fill=PANEL,outline=c,width=2)
        d.text((x1+16,y1+14),title,font=font(FB,ts),fill=c)
        for i,l in enumerate(sub):
            d.text((x1+16,y1+50+i*26),l,font=font(FR,16),fill=WHITE)

    # top: clients
    box(60,140,400,300,"客户端",["Vanilla TS + Vite SPA","双引擎：deck.gl 平面 / globe.gl 3D","Tauri 2 桌面端（Win/macOS/Linux）","Web Workers：ONNX 推理 + 新闻聚类"],CYAN)
    box(430,140,770,300,"边缘网关（Vercel）",["Protocol Buffers 契约生成 RPC","Origin→CORS→限流→路由→ETag","POST 兼容 GET（all-or-nothing）","Cloudflare 预检 Worker"],BLUE)
    box(800,140,1140,300,"实时中继（Railway）",["AIS 船舶 WebSocket 代理","种子循环：市场/航空/UCDP/RSS","OREF 警报轮询","Macro / Resilience 数据束"],GREEN)

    # middle redis
    box(330,340,870,460,"Upstash Redis：三层缓存 + 防击穿",[
        "fast 300s 直播流 · medium 600s 行情 · slow 1800s 冲突事件",
        "static 7200s 人道摘要 · daily 86400s 关键矿产 · no-store 船位/航迹"],AMBER, ts=21)

    # sources
    box(60,500,1140,660,"748 个归属数据源（每个面板都标注出处）",[
        "ACLED / UCDP 冲突  ·  GDELT 新闻事件库  ·  FIRMS 卫星火点  ·  OpenSky + Wingbits 航空",
        "Finnhub / Yahoo / FRED 市场宏观  ·  CoinGecko 加密  ·  GPSJAM 干扰图  ·  海底光缆/BGP 中断",
        "架构文档实测：578+ 个被观测上游主机；首页标注 461 个新闻/OSINT feed、57 种地图图层"],GREY,ts=18)

    # agent layer
    box(60,700,1140,800,"给 AI Agent 的接口（实测 tools/list 无需密钥返回 75 个工具）",[
        "MCP  worldmonitor.app/mcp（Streamable HTTP，tools/call 需 Key 或 OAuth）",
        "REST  api.worldmonitor.app（OpenAPI）· CLI  npx worldmonitor · Python / Go / Ruby SDK"],RED,ts=18)

    # arrows
    for (x1,y1,x2,y2) in [(400,220,430,220),(770,220,800,220),(600,300,600,340),
                          (450,460,350,500),(750,460,850,500),(600,660,600,700)]:
        d.line((x1,y1,x2,y2),fill=GREY,width=3)
    im.save(f"{OUT}/diagram-arch.png")
    print("arch ok")

# ============ 3. CII 实测条形图 (1200x760) ============
def cii_bar():
    data = [("乌克兰",85,1,RED),("俄罗斯",78,2,RED),("叙利亚",72,0,AMBER),
            ("墨西哥",70,0,AMBER),("巴基斯坦",70,0,AMBER),("伊朗",66,6,AMBER),
            ("缅甸",64,0,AMBER),("伊拉克",61,1,AMBER),("也门",61,1,AMBER),
            ("中国",55,0,CYAN),("以色列",50,0,CYAN),("美国",28,-1,GREEN),("日本",24,-2,GREEN)]
    W,H=1200,760
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    d.text((60,40),"2026-09-20 实测：CII v8 实时排名（节选 13/31）",font=font(FB,30),fill=WHITE)
    d.text((60,88),"数据来自 worldmonitor.app/country-instability-index 实时接口，非宣传材料",font=font(FR,18),fill=GREY)
    y=140; maxv=90; roww=44
    for name,v,delta,c in data:
        d.text((60,y+6),name,font=font(FB,20),fill=WHITE)
        x1=200; x2=x1+int((W-420)*v/maxv)
        rrect(d,(x1,y,x2,y+34),8,fill=c)
        d.text((x2+12,y+5),str(v),font=font(FB,20),fill=WHITE)
        if delta>0: d.text((1100,y+5),f"▲+{delta}",font=font(FB,17),fill=RED)
        elif delta<0: d.text((1100,y+5),f"▼{delta}",font=font(FB,17),fill=GREEN)
        y+=roww
    d.text((60,y+14),"风险带：≥70 Critical/High（俄乌）· 50–69 Elevated · <40 Low（美日）",
           font=font(FR,17),fill=GREY)
    im.save(f"{OUT}/diagram-cii-live.png")
    print("bar ok")

# ============ 4. 封面（无文字底图两版，文字由 HTML 叠加更可控：直接 PIL 叠加） ============
def cover(path, W, H, title_lines, tag, c1, c2, out):
    im = Image.new("RGB",(W,H),(8,14,26)); d=ImageDraw.Draw(im)
    # radar rings
    cx, cy = W*0.78, H*0.5
    for i,r in enumerate([100,180,270,360,460]):
        d.ellipse((cx-r,cy-r,cx+r,cy+r),outline=(40,70,110),width=2)
    # grid lines
    for ang_deg in range(0,180,30):
        import math
        a=math.radians(ang_deg*2)
        d.line((cx,cy,cx+520*math.cos(a),cy+520*math.sin(a)),fill=(30,55,90),width=1)
    # blips
    import random
    random.seed(7)
    pts=[(0.15,0.3,c2),(-0.4,0.5,RED),(0.5,-0.35,c1),(-0.1,-0.55,AMBER),(0.62,0.2,GREEN),(-0.55,-0.2,c2)]
    for fx,fy,c in pts:
        x,y=cx+fx*480,cy+fy*360
        d.ellipse((x-7,y-7,x+7,y+7),fill=c)
        d.ellipse((x-18,y-18,x+18,y+18),outline=c,width=2)
    # left color bar
    d.rectangle((0,0,14,H),fill=c1)
    d.text((70,88),tag,font=font(FB,26),fill=c1)
    y=150
    for line,fs in title_lines:
        d.text((70,y),line,font=font(FB,fs),fill=WHITE); y+=fs+18
    d.text((70,H-90),"开源 AGPL-3.0  ·  github.com/koala73/worldmonitor",font=font(FR,22),fill=GREY)
    d.text((70,H-52),"87.1k Star · 7,596 commits · 748 个数据源 · MCP/REST/4 语言 SDK",font=font(FR,20),fill=GREY)
    im.save(out)
    print("cover", out)

cii_chart(); arch_chart(); cii_bar()
cover(None,1080,864,
      [("把全世界的新闻、航线",52),("和油价叠进同一张地图",52),("87k Star 开源态势感知",40),("仪表盘实测",40)],
      "开源项目深测 · 地缘 × 数据工程", CYAN, GREEN,
      f"{OUT}/cover-wechat.png")
cover(None,1600,900,
      [("World Monitor 源码深测",60),("一个给 AI Agent 用的全球情报接口",40)],
      "开源项目 · 架构与算法实测", BLUE, CYAN,
      f"{OUT}/cover-zhihu.png")
