# -*- coding: utf-8 -*-
"""抖音收藏转知识库 配图：知乎封面 + 3张正文图。深色+抖音青/品红点缀。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/douyin-favorites-to-knowledge"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(14,16,22); PANEL=(23,27,38); PANEL2=(31,37,52)
CYAN=(37,244,238); PINK=(255,46,102); AMBER=(255,196,90); GREEN=(102,212,146)
BLUE=(110,168,254); WHITE=(238,241,247); GREY=(150,158,178); LINE=(48,56,78)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,18,H],fill=CYAN)
    t(d,(110,118),"抖音收藏，自动变成 Obsidian 笔记",font("Black",66),WHITE)
    t(d,(110,222),"一个 79 Star 的小工具：刷到码住 → 本地可搜索 Markdown",font("Bold",38),CYAN)
    pts=[("不用复制 Cookie","独立浏览器 profile 官方页登录，密钥只走环境变量"),
         ("口播视频转全文","SiliconFlow SenseVoice 免费转写，带 Referer 破防盗链"),
         ("收藏 / 喜欢严格隔离","防重账本 + 原子入库，每晚 23:00 自动出日报")]
    y=360
    for a,b in pts:
        d.ellipse([110,y+12,132,y+34],fill=PINK)
        t(d,(156,y),a,font("Bold",36),AMBER)
        t(d,(156,y+50),b,font("Regular",29),GREY); y+=126
    rr(d,(1180,150,1490,610),24,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","79"),("Fork","10"),("语言","Python"),("版本","v2.3.6"),("建仓","2026-07"),("协议","MIT"),("产物","Markdown")]
    yy=200
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",27),GREY); t(d,(1450,yy),v,font("Bold",29),WHITE,anchor="ra"); yy+=58
    t(d,(110,828),"只同步你本人账号有权看的收藏，不绕登录、不做下载器：小而克制的知识闭环",font("Medium",26),GREEN)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def workflow():
    W,H=1200,640; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"从「码了等于学了」到可搜索的本地知识",font("Black",36),WHITE)
    steps=[("刷到，点收藏","抖音里正常使用\n内容留在收藏夹",PINK),
           ("运行 sync","浏览器 profile 授权登录\n扫描新增收藏",CYAN),
           ("自动转写","Referer 下载 → ffmpeg 抽音\nSenseVoice 转全文",AMBER),
           ("写入知识库","每条一个 Markdown\n直接进 Obsidian",GREEN)]
    x=60;cw=258;gap=24;y=180
    for i,(h,b,c) in enumerate(steps):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+300),18,fill=PANEL,outline=LINE,width=2)
        d.ellipse([xx+26,y+26,xx+86,y+86],outline=c,width=5)
        t(d,(xx+56,y+56),str(i+1),font("Black",30),c,anchor="mm")
        t(d,(xx+24,y+112),h,font("Bold",26),WHITE)
        for j,ln in enumerate(b.split("\n")):
            t(d,(xx+24,y+176+j*40),ln,font("Regular",21),(192,200,216))
        if i<3:
            ax=xx+cw+2; d.polygon([(ax,y+140),(ax+20,y+153),(ax,y+166)],fill=GREY)
    t(d,(60,540),"默认纯本地 Markdown，不锁定 App；以后每天 23:00 可自动增量同步+出日报",font("Medium",25),GREY)
    img.save(f"{OUT}/workflow.png"); print("workflow.png")

def sources():
    W,H=1200,620; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"收藏和喜欢，是两套绝不混用的列表",font("Black",36),WHITE)
    cards=[("收藏（默认）",["showTab=favorite_collection","你主动筛选的知识候选","信噪比高，默认每天同步","普通 .md 笔记 + 收藏日报"],CYAN),
           ("喜欢 / 点赞（可选）",["showTab=like","随手点赞，量大噪声多","默认不扫，需明确说「喜欢」","like-*.md + 喜欢日报"],PINK)]
    x=60;cw=530;gap=40;y=150
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+380),20,fill=PANEL,outline=c,width=3)
        t(d,(xx+30,y+30),h,font("Bold",32),c)
        yy=y+104
        for it in items:
            d.ellipse([xx+30,yy+9,xx+44,yy+23],outline=c,width=3)
            t(d,(xx+60,yy+16),it,font("Regular",24),(205,211,224),anchor="lm"); yy+=64
    t(d,(60,560),"独立防重键 + 独立文件名：从数据结构上杜绝历史上「收藏喜欢混档漏采」的事故",font("Medium",24),GREY)
    img.save(f"{OUT}/sources.png"); print("sources.png")

def asr():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"三种转写方案：为什么默认是 SiliconFlow",font("Black",34),WHITE)
    cols=[("SiliconFlow SenseVoice","默认推荐",["抖音 CDN 口播可用","本机带 Referer 下载","抽音频后上传","模型当前标注免费"],GREEN),
          ("本地 Whisper","无云费用",["faster-whisper","约 500MB 模型","吃本机算力","不上传任何内容"],BLUE),
          ("阿里云百炼","仅可选",["服务端拉 URL","抖音 douyinvod","带防盗链 → 常 403","结构性失败，不默认"],AMBER)]
    # 两正常卡+一警示卡，宽度处理
    data=[(cols[0],60,340),(cols[1],430,340),(cols[2],800,340)]
    y=120
    for col,x,cw in data:
        h,tag,items,c=col
        rr(d,(x,y,x+cw,y+520),18,fill=PANEL,outline=LINE,width=2)
        d.rectangle([x,y,x+8,y+520],fill=c)
        t(d,(x+28,y+24),h,font("Bold",24),WHITE)
        rr(d,(x+28,y+64,x+28+int(d.textlength(tag,font=font("Bold",19)))+28,y+96),12,fill=(tuple(int(v*0.35) for v in BG)))
        t(d,(x+42,y+80),tag,font("Bold",19),c,anchor="lm")
        yy=y+124
        for it in items:
            d.ellipse([x+28,yy+8,x+42,yy+22],outline=c,width=3)
            t(d,(x+56,yy+15),it,font("Regular",22),(203,209,222),anchor="lm"); yy+=56
    rr(d,(60,660,1140,720),12,fill=PANEL2,outline=LINE,width=1)
    t(d,(84,690),"抖音播放地址必须带 Referer: https://www.douyin.com/ 才能下载；交给云服务器直拉会 403",font("Bold",23),PINK,anchor="lm")
    img.save(f"{OUT}/asr.png"); print("asr.png")

zhihu_cover(); workflow(); sources(); asr(); print("ALL DONE")
