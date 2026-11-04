# -*- coding: utf-8 -*-
"""charles-video-maker 配图：知乎封面 + 流水线/四模式/抖音D流程。电影暗房风：暖炭黑+录制红+琥珀。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/charles-video-maker"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(16,15,14); PANEL=(27,25,23); PANEL2=(37,34,31); LINE=(60,55,49)
REC=(239,68,68); AMBER=(245,178,85); GOLD=(224,186,120); TEAL=(94,190,178)
WHITE=(240,236,229); GREY=(168,160,148)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.ellipse([104,118,126,140],fill=REC)  # 录制点
    t(d,(150,112),"代码一帧帧画出整条短视频",font("Black",64),WHITE)
    t(d,(112,214),"开源 Agent Skill：文字稿 → 配音+逐字字幕+封面+发布文案",font("Bold",34),GOLD)
    pts=[("不是抽卡式生成","模型写 render(t) 网页，Playwright 逐帧截图，FFmpeg 合成 MP4"),
         ("质量闸门齐全","事实核查数字、-14 LUFS 响度、Whisper 逐字对齐、静止帧自检"),
         ("抖音知识号模式","复刻爆款风格重写文案，雷达选题→定时发布→数据回流")]
    y=340
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=REC)
        t(d,(150,y),a,font("Bold",34),AMBER); t(d,(150,y+48),b,font("Regular",27),GREY); y+=122
    rr(d,(1180,150,1490,620),20,fill=PANEL,outline=REC,width=2)
    rows=[("新号播放","37万+"),("单条最高","23.1万"),("起号周期","13 天"),("投流","0 元"),("Star","49"),("协议","MIT"),("画面","1080×1920")]
    yy=196
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",25),GREY); t(d,(1450,yy),v,font("Bold",27),GOLD,anchor="ra"); yy+=58
    t(d,(112,826),"作者自述数据（截至 2026-11-02）：工具稳定质量下限，选题与开头 3 秒仍决定流量",font("Medium",24),GREY)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def pipeline():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"一条视频的生产流水线（确定性，可复现）",font("Black",34),WHITE)
    # 上行
    up=[("文字稿",AMBER),("事实核查表",REC),("整段配音+加速",TEAL),("Whisper 逐字时间戳",GOLD),("切点/动作/字幕",AMBER)]
    x=60;y=150;bw=206;bh=86;gap=12
    for i,(s,c) in enumerate(up):
        rr(d,(x,y,x+bw,y+bh),12,fill=PANEL,outline=c,width=2)
        t(d,(x+bw/2,y+bh/2),s,font("Bold",20),WHITE,anchor="mm")
        if i<len(up)-1: d.polygon([(x+bw+1,y+bh/2-7),(x+bw+9,y+bh/2),(x+bw+1,y+bh/2+7)],fill=GREY)
        x+=bw+gap
    # 下行三轨汇入
    tracks=[("代码画面 render(t)","Playwright 并行逐帧截图",TEAL),
            ("素材层 footage.json","实录/原片/空镜，剪切调色淡化",AMBER),
            ("配乐+音效+旁白","统一标准化到 −14 LUFS",REC)]
    x=60;y=320;bw=350;gap=25
    for h,b,c in tracks:
        rr(d,(x,y,x+bw,y+150),14,fill=PANEL2,outline=LINE,width=2)
        d.rectangle([x,y,x+7,y+150],fill=c)
        t(d,(x+26,y+28),h,font("Bold",23),c)
        t(d,(x+26,y+78),b,font("Regular",20),(206,199,187))
        t(d,(x+26,y+114),"帧/素材/声音 时间轴对齐",font("Regular",18),GREY)
        x+=bw+gap
    # 汇入箭头
    for ax in (235,610,985): d.line([ax,470,ax,520],fill=GREY,width=3)
    d.line([235,520,985,520],fill=GREY,width=3); d.polygon([(985,512),(1003,520),(985,528)],fill=REC)
    rr(d,(360,540,840,610),14,fill=PANEL,outline=REC,width=2)
    t(d,(600,575),"合成 → out/成片.mp4 + 封面图 + publish.txt",font("Bold",23),WHITE,anchor="mm")
    t(d,(60,680),"每帧来自确定性代码 → 水准可复现；数字/响度/静止帧三道闸防 AI 视频翻车",font("Medium",23),GOLD)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def modes():
    W,H=1200,820; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"四种画面路线，按内容分流",font("Black",36),WHITE)
    cards=[("代码动画","模型写 render(t) 网页\nCanvas/SVG/WebGL/Three/Manim\n逐帧截图合成","知识讲解·数据·产品",REC),
           ("素材打底","实录/原片/免版税空镜垫底\n代码层退成透明信息层","产品演示·游戏·评论",AMBER),
           ("机器讲概念","等距机器（Anatomy）\n念到哪步机器动哪步\n可带 WebGL 火焰尾焰","硬核技术原理",TEAL),
           ("抖音知识号","从在爆原片出发\n复刻风格·重写文案\n选题到发布数据闭环","起号·泛知识短视频",GOLD)]
    pos=[(60,140),(620,140),(60,470),(620,470)]
    for (h,b,tag,c),(x,y) in zip(cards,pos):
        rr(d,(x,y,x+520,y+300),16,fill=PANEL,outline=c,width=2)
        d.rectangle([x,y,x+520,y+6],fill=c)
        t(d,(x+26,y+26),h,font("Bold",28),c)
        for j,ln in enumerate(b.split("\n")):
            t(d,(x+26,y+86+j*42),ln,font("Regular",22),(214,207,194))
        d.line([x+26,y+232,x+494,y+232],fill=LINE,width=1)
        t(d,(x+26,y+254),"适合："+tag,font("Medium",20),AMBER)
    t(d,(60,794),"另可选 Lemo-Opuscar 53 种画风（水彩/浮世绘/水墨/像素…）与真乐器配乐，按需下载",font("Medium",22),GREY)
    img.save(f"{OUT}/modes.png"); print("modes.png")

def douyin_flow():
    W,H=1200,700; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"抖音知识号模式：D-1 → D5 一锅出",font("Black",36),WHITE)
    steps=[("D-1","题材雷达","douyin_radar\n抓话题在涨视频\n产出10–20选题",REC),
           ("D1","蒸馏风格","一比一拆原片\n学结构手法\n不搬内容",AMBER),
           ("D2","资料文案","Claude管事实结构\nGemini管说法\nfactcheck 把关",TEAL),
           ("D3","先乐后画","先定配乐卡点\n再排画面节奏",GOLD),
           ("D4","制作自查","逐镜头渲染\nstill_check 静止帧\n响度/字幕检查",AMBER),
           ("D5","交付","封面+publish.txt\n定时发布",REC)]
    x=50;bw=178;gap=12;y=170;bh=250
    for i,(day,h,b,c) in enumerate(steps):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        t(d,(xx+bw/2,y+34),day,font("Black",26),c,anchor="mm")
        t(d,(xx+bw/2,y+78),h,font("Bold",20),WHITE,anchor="mm")
        for j,ln in enumerate(b.split("\n")):
            t(d,(xx+bw/2,y+120+j*30),ln,font("Regular",16),(200,193,181),anchor="mm")
        if i<5: t(d,(xx+bw+gap-2,y+bh/2),"→",font("Bold",20),GREY,anchor="mm")
    # 回流
    rr(d,(50,466,1150,564),14,fill=PANEL2,outline=LINE,width=2)
    t(d,(80,498),"闭环：douyin_publish 定时发布 → douyin_stats 拉 2秒跳出/5秒完播/赞藏分享",font("Bold",20),WHITE,anchor="lm")
    t(d,(80,532),"→ douyin_comments 存评论 → 数据结论写回运营手册，指导下一期",font("Bold",20),WHITE,anchor="lm")
    t(d,(60,620),"文案铁律：旁白/标题/tag 全交本地 Gemini（Claude 旁白太僵硬）；查不到一手资料或工具连失两次才停下问人",font("Medium",22),GOLD)
    img.save(f"{OUT}/douyin-flow.png"); print("douyin-flow.png")

zhihu_cover(); pipeline(); modes(); douyin_flow(); print("ALL DONE")
