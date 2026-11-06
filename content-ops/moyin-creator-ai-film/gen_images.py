# -*- coding: utf-8 -*-
"""魔因漫创配图：电影工业暗调（炭黑+胶片金+青）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/moyin-creator-ai-film"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(13,14,19); PANEL=(23,25,33); PANEL2=(33,36,47); LINE=(58,62,76)
GOLD=(228,186,112); GOLDL=(240,210,150); TEAL=(94,196,186); VIOLET=(158,142,224); RED=(232,120,120)
WHITE=(238,239,245); MUTED=(150,155,170)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,6],fill=GOLD)
    t(d,(110,108),"剧本到成片的 AI 影视工厂",font("Black",60),WHITE)
    t(d,(112,200),"魔因漫创：五板块流水线，Seedance 2.0 批量生产短剧/番剧",font("Bold",32),GOLDL)
    pts=[("五板块环环相扣","剧本→角色→场景→导演→S级，上一步产出自动流入下一步"),
         ("角色不换脸","6 层身份锚点 + 角色圣经，跨分镜强参考图约束"),
         ("多模态引用车间","GroupRefManager 自动组 @图/视频/音频，卡 9图3视频3音频红线")]
    y=320
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=GOLD)
        t(d,(150,y),a,font("Bold",33),TEAL); t(d,(150,y+47),b,font("Regular",26),MUTED); y+=120
    rr(d,(1180,140,1490,640),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","4.8K"),("Fork","966"),("语言","TypeScript"),("代码","10.7 万行"),("框架","Electron 30"),("协议","AGPL-3.0"),("版本","v0.2.3")]
    yy=188
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",24),MUTED); t(d,(1450,yy),v,font("Bold",26),GOLD,anchor="ra"); yy+=60
    t(d,(112,828),"编排层而非模型层：不训练模型，能力与成本都握在外部生成 API 手里",font("Medium",23),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def pipeline():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"五大板块：一条数据向下游流动的生产线",font("Black",33),WHITE)
    steps=[("剧本","解析为场景/分镜/对白\n识别角色·情绪·镜头语言\n支持多集多幕",GOLD),
           ("角色","角色圣经 Character Bible\n6 层身份锚点\n参考图绑定防变脸",TEAL),
           ("场景","描述→视觉提示词\n多视角联合图生成",VIOLET),
           ("导演","景别·机位·运动参数化\n2D/3D/写实/定格切换",GOLDL),
           ("S 级车间","Seedance 2.0 / SkyReels\n多镜头合并叙事\n批量出成片",RED)]
    bw=206;gap=14;x=60;y=160;bh=330
    for i,(h,b,c) in enumerate(steps):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+bw/2,y+34),h,font("Bold",23),c,anchor="mm")
        for j,ln in enumerate(b.split("\n")):
            t(d,(xx+18,y+92+j*42),ln,font("Regular",18),(206,209,219))
        if i<4: t(d,(xx+bw+gap-2,y+bh/2),"→",font("Bold",22),MUTED,anchor="mm")
    rr(d,(60,540,1140,620),12,fill=PANEL2,outline=GOLD,width=1)
    t(d,(600,580),"每一步的产出自动流入下一步，无需在五六个工具间手工搬运",font("Bold",22),GOLD,anchor="mm")
    t(d,(60,666),"一键全流程：剧本解析 → 角色/场景生成 → 分镜切割 → 批量生图 → 批量生视频",font("Medium",21),MUTED)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def group_ref():
    W,H=1200,820; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"GroupRefManager：把分镜素材组装成合规 API 请求",font("Black",31),WHITE)
    # 左：素材来源
    rr(d,(60,120,440,600),14,fill=PANEL,outline=LINE,width=2)
    t(d,(88,146),"分镜卡片自动收集",font("Bold",24),TEAL)
    srcs=[("角色库参考图","characterIds 自动"),("场景参考图","sceneReferenceImage"),("首帧图","素材库替换 / AI 生成"),("运镜参考视频","手动上传"),("BGM 音频","手动上传")]
    yy=200
    for a,b in srcs:
        rr(d,(88,yy,412,yy+66),10,fill=PANEL2)
        t(d,(106,yy+14),a,font("Bold",19),WHITE); t(d,(106,yy+40),b,font("Regular",15),MUTED); yy+=78
    t(d,(250,628),"collectAllRefs()",font("Bold",22),GOLD,anchor="mm")
    d.line([250,600,250,660],fill=MUTED,width=2); d.polygon([(242,660),(258,660),(250,676)],fill=MUTED)
    # 右：API 槽位
    rr(d,(520,120,1140,600),14,fill=PANEL,outline=GOLD,width=2)
    t(d,(548,146),"Seedance 2.0 请求槽位（硬约束）",font("Bold",24),GOLD)
    slots=[("@Image1","N×N 网格拼接首帧",1),("@Image2~9","角色+场景参考，≤9 张",8),("@Video1~3","运镜参考，≤3 段",3),("@Audio1~3","BGM，≤3 段",3)]
    yy=204
    for name,desc,n in slots:
        rr(d,(548,yy,1112,yy+78),10,fill=PANEL2,outline=LINE,width=1)
        t(d,(570,yy+18),name,font("Bold",20),TEAL)
        t(d,(570,yy+48),desc,font("Regular",16),(205,208,218))
        t(d,(1086,yy+39),f"×{n}",font("Bold",20),GOLD,anchor="mm"); yy+=90
    rr(d,(60,700,1140,776),12,fill=PANEL2,outline=TEAL,width=1)
    t(d,(88,738),"提示词三层融合：动作 + 镜头语言 + 对白唇形同步 → 单条 prompt，客户端预校验 ≤5000 字符",font("Bold",20),TEAL,anchor="lm")
    img.save(f"{OUT}/group-ref.png"); print("group-ref.png")

def batch():
    W,H=1200,820; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"批量生产与多供应商调度",font("Black",33),WHITE)
    cards=[("并行任务队列",GOLD,["多镜头任务并发执行","失败自动重试/错误恢复","不用人盯，跑完通知","队列状态持久化"]),
           ("多 Key 轮询负载均衡",TEAL,["同供应商可配多个 API Key","轮询分发，绕过单 Key 配额","Key 越多并发越高（官方建议）","图床同样支持多 Key"]),
           ("供应商策略",VIOLET,["v0.1.3 砍废弃渠道","仅留 memefast + RunningHub","v6→v7 本地数据自动迁移","模型绑定 Seedance / Gemini"])]
    x=60;cw=350;gap=25;y=140
    for (h,c,items),i in zip(cards,range(3)):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+480),16,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+cw,y+6],fill=c)
        t(d,(xx+24,y+30),h,font("Bold",22),c)
        yy=y+100
        for it in items:
            d.ellipse([xx+24,yy+9,xx+38,yy+23],outline=c,width=2)
            t(d,(xx+52,yy+16),it,font("Regular",18),(214,216,224),anchor="lm"); yy+=72
    rr(d,(60,660,1140,752),12,fill=PANEL2,outline=RED,width=1)
    t(d,(88,692),"边界：工具是 API 编排层，不训练模型——生成成本、稳定性、内容审核都握在外部通道手里",font("Bold",20),RED,anchor="lm")
    t(d,(88,726),"供应商调整或限流，工具必须跟着发版；断网时本身不产生任何画面",font("Regular",18),MUTED,anchor="lm")
    img.save(f"{OUT}/batch.png"); print("batch.png")

zhihu_cover(); pipeline(); group_ref(); batch(); print("ALL DONE")
