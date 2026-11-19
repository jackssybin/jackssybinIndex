# -*- coding: utf-8 -*-
"""stickman 配图：火柴人手绘涂鸦风（米白纸底 + 手绘黑线条 + 亮蓝/橙/红三原色）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/stickman-video-skill"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

PAPER=(252,249,241); INK=(34,32,32); PANEL=(255,253,248); PANEL2=(238,232,218)
LINE=(178,168,150); BLUE=(44,110,224); ORANGE=(240,138,46); RED=(224,74,64)
GREEN=(58,156,108); PURPLE=(132,84,200); MUTED=(108,100,90)

def rr(d,b,r,fill=None,outline=None,width=2): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)
def stick(d,x,y,s=1.0,c=INK):
    """简单火柴人：头+身+四肢。x,y 为头部中心。"""
    w=max(2,int(3*s))
    r=int(14*s); hy=y+r; d.ellipse([x-r,y-r,x+r,y+r],outline=c,width=w)
    hip=hy+int(46*s); d.line([x,hy,x,hip],fill=c,width=w)
    sh=hy+int(14*s)
    d.line([x,sh,x-int(20*s),sh+int(16*s)],fill=c,width=w)
    d.line([x,sh,x+int(20*s),sh+int(16*s)],fill=c,width=w)
    d.line([x,hip,x-int(16*s),hip+int(34*s)],fill=c,width=w)
    d.line([x,hip,x+int(16*s),hip+int(34*s)],fill=c,width=w)

def zhihu_cover():
    W,H=1600,900
    img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,9],fill=BLUE)
    t(d,(100,88),"把一篇文章变成火柴人视频，这个 Skill 本地就能渲染",font("Black",44),INK)
    t(d,(100,166),"directing-stickman-videos：14 种画风、双引擎，无脸 YouTube 频道自动化利器",font("Bold",24),BLUE)
    pts=[("双引擎：模型引擎 A + 代码引擎 B","A 出分镜与提示词，B 本地渲染旁白/字幕/音效全自动成片"),
         ("14 种风格覆盖 7+7","极简线稿、彩色手绘、复古电视、求生短剧、角色解说、Meme、像素剧场"),
         ("556MB 资产 + 485 项测试自带","本地 canvas/sharp/ffmpeg 渲染，doctor 七项自检全绿")]
    y=284
    for a,b in pts:
        d.rectangle([102,y+10,116,y+34],fill=ORANGE)
        t(d,(140,y),a,font("Bold",25),ORANGE)
        t(d,(140,y+38),b,font("Regular",20),MUTED)
        y+=102
    stick(d,1380,360,1.7,BLUE)
    rr(d,(1120,560,1500,760),18,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","6972"),("Fork","1225"),("画风","14 种"),("脚本","57 个"),("测试","485 项"),("协议","MIT")]
    yy=582
    for k,v in rows:
        t(d,(1150,yy),k,font("Regular",20),MUTED)
        t(d,(1470,yy),v,font("Bold",19),RED,anchor="ra")
        yy+=29
    t(d,(100,828),"基于 2026-11-19 本地安装实测 · 我已在本机装好并跑通 doctor 与初始化",font("Medium",19),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def engines():
    W,H=1200,780
    img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
    t(d,(60,34),"两种引擎，一条技能：先想清楚你要哪条路",font("Black",28),INK)
    cards=[
        ("A · 模型引擎",["A1–A7 七种画风","输出分镜+独立提示词","浏览器操作 AI 视频服务","默认 Google Flow 出片","适合高保真 AI 生成"],BLUE),
        ("B · 代码引擎",["B1–B7 七种画风","本地渲染、无需上传素材","旁白+字幕+音效自动配","canvas/sharp/ffmpeg","适合可复现批量生产"],ORANGE),
        ("共同底座",["同一个 Skill 入口","73 份 references 契约","57 个脚本各司其职","语音主导画面节奏","项目建在 Skill 之外"],GREEN),
        ("交付与验收",["MP4 + SRT/VTT 字幕","联系表与校验报告","内容寻址可续渲缓存","实际成片评审门禁","不允许伪造通过"],PURPLE),
    ]
    bw,bh=252,452; gap=18; x,y=60,118
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+bw/2,y+38),h,font("Bold",19),c,anchor="mm")
        yy=y+92
        for it in items:
            t(d,(xx+16,yy),"· "+it,font("Regular",16),(58,54,50))
            yy+=58
    rr(d,(60,612,1140,712),12,fill=PANEL2,outline=BLUE,width=1)
    t(d,(88,642),"关键认知：A 与 B 只共享安装，不共享生产契约——A 走提示词交付、B 走本地渲染，",font("Bold",17),BLUE,anchor="lm")
    t(d,(88,678),"每个 B 风格有独立的视觉、字幕字体、节奏和音效规则，不能互相套用或偷偷回退",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/engines.png"); print("engines.png")

def styles():
    W,H=1200,820
    img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
    t(d,(60,32),"14 种画风：从极简线稿到像素剧场",font("Black",28),INK)
    groups=[
        ("A 模型引擎（7 种）",["A1 经典黑白","A2 现代潮酷","A3 史前洞穴","A4 治愈故事","A5 历史卡通","A6 暖金暗影","A7 橡皮管动画"],BLUE),
        ("B 代码引擎（7 种）",["B1 极简线稿","B2 彩色手绘","B3 复古电视","B4 求生短剧","B5 角色解说","B6 动感 Meme","B7 像素剧场"],ORANGE),
    ]
    x0=60
    for gi,(gh,items,c) in enumerate(groups):
        xx=x0+gi*552
        rr(d,(xx,116,xx+524,610),16,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,116,xx+524,122],fill=c)
        t(d,(xx+24,146),gh,font("Bold",23),c)
        yy=200
        for it in items:
            rr(d,(xx+24,yy-4,xx+500,yy+44),10,fill=PANEL2,outline=LINE,width=1)
            t(d,(xx+44,yy+20),it,font("Bold",18),INK,anchor="lm")
            yy+=56
    rr(d,(60,640,1140,740),12,fill=PANEL2,outline=GREEN,width=1)
    t(d,(88,670),"每种风格都有独立 reference 契约：视觉语言、字幕字体/位置、镜头节奏、音效处理各不相同；",font("Bold",17),GREEN,anchor="lm")
    t(d,(88,706),"B1–B4 共用清单渲染器但规则独立，B5/B6/B7 各自有专用运行时和验收矩阵，原生支持 16:9 与 9:16",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/styles.png"); print("styles.png")

def workflow():
    W,H=1200,760
    img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
    t(d,(60,34),"B 代码引擎本地出片：一条命令串起全流程",font("Black",27),INK)
    steps=[("① doctor 自检","Node/ffmpeg/canvas/sharp/字体七项检查",BLUE),
           ("② init 建工程","在 Skill 之外生成 project.json 脚手架",ORANGE),
           ("③ 脚本与旁白","Agent 写剧本，TTS 生成连续语音轨",GREEN),
           ("④ 字幕对齐","按语义和真实停顿分组，非固定字数",PURPLE),
           ("⑤ 本地渲染","canvas 绘图 + 微动画 + ffmpeg 合成",RED),
           ("⑥ 验收交付","实际 MP4 评审，出 SRT/联系表/报告",BLUE)]
    x,y=70,130; cw,ch=330,180; gx,gy=30,36
    for i,(h,b,c) in enumerate(steps):
        col=i%3; row=i//3
        xx=x+col*(cw+gx); yy=y+row*(ch+gy)
        rr(d,(xx,yy,xx+cw,yy+ch),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,yy,xx+cw,yy+6],fill=c)
        t(d,(xx+18,yy+34),h,font("Bold",20),c)
        # 文字换行
        words=b.split("，")
        ty=yy+82
        for wseg in words:
            t(d,(xx+18,ty),wseg,font("Regular",16),(60,56,52)); ty+=30
        if col<2:
            d.line([xx+cw,yy+ch/2,xx+cw+gx,yy+ch/2],fill=INK,width=2)
            d.polygon([(xx+cw+gx,yy+ch/2),(xx+cw+gx-8,yy+ch/2-6),(xx+cw+gx-8,yy+ch/2+6)],fill=INK)
    rr(d,(60,600,1140,700),12,fill=PANEL2,outline=ORANGE,width=1)
    t(d,(88,632),"实测：本机 node v22.22 跑 doctor 七项全绿，init 能正常生成 project.json；",font("Bold",17),ORANGE,anchor="lm")
    t(d,(88,666),"渲染器只读声明式 JSON、绝不执行素材里的代码或 URL，断点用内容寻址缓存可续渲",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/workflow.png"); print("workflow.png")

def limits():
    W,H=1200,780
    img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
    t(d,(60,34),"上手前看清：能力边界与适合谁",font("Black",28),INK)
    rr(d,(60,116,580,600),14,fill=PANEL,outline=GREEN,width=2)
    t(d,(88,144),"它擅长 / 适合",font("Bold",23),GREEN)
    good=["无脸 YouTube/短视频频道批量出片","知识解说、故事、Meme、像素短剧","要可复现、不依赖云端的本地工作流","会用 Claude Code/Codex 的创作者","需要 16:9 和 9:16 双画幅的人","重视旁白字幕音效一体化交付"]
    yy=196
    for it in good:
        d.ellipse([88,yy+8,104,yy+24],outline=GREEN,width=2)
        t(d,(120,yy+16),it,font("Regular",18),(52,60,52),anchor="lm")
        yy+=62
    rr(d,(620,116,1140,600),14,fill=PANEL,outline=RED,width=2)
    t(d,(648,144),"边界 / 要注意",font("Bold",23),RED)
    bad=["不是一键软件，靠 Agent 驱动有门槛","A 模式依赖外部 AI 视频服务与额度","TTS/生图要自己配，缺适配器需补","556MB 体量大、音效库占 253MB","B6 依赖 Python3.11 的 numpy/cv2/PIL","画风契约严苛，不能跨风格偷懒"]
    yy=196
    for it in bad:
        d.ellipse([648,yy+8,664,yy+24],outline=RED,width=2)
        t(d,(680,yy+16),it,font("Regular",18),(72,54,52),anchor="lm")
        yy+=62
    rr(d,(60,636,1140,720),12,fill=PANEL2,outline=BLUE,width=1)
    t(d,(88,664),"MIT 协议可自由自用二开；它把导演方法论、渲染代码和验收标准都固化进 Skill，",font("Bold",18),BLUE,anchor="lm")
    t(d,(88,696),"但出片质量仍取决于你的选题、脚本和评审投入——工具不替代创作判断",font("Bold",18),ORANGE,anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover(); engines(); styles(); workflow(); limits()
print("ALL DONE")
