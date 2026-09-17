#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""story-to-handdrawn-video 三端教程配图（自绘中文图）。"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "story-to-handdrawn-video-agent-skill"
OPS = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
STATIC = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS.mkdir(parents=True, exist_ok=True); STATIC.mkdir(parents=True, exist_ok=True)

BG=(17,18,22); BG2=(24,25,31); CARD=(34,36,44); CARD2=(42,44,54)
TEXT=(238,239,244); DIM=(150,153,165)
PAPER=(250,247,240); INK=(45,42,40)
BLUE=(110,160,255); ORANGE=(255,170,80); GREEN=(120,210,140)
PINK=(255,130,170); TEAL=(70,200,190); PURPLE=(180,150,255)
RED=(255,110,105); YELLOW=(240,215,120)
CRAYON = [(196,90,80),(70,120,180),(210,170,80),(90,150,110),(150,110,170)]

FP=["/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc"]
FB=["/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc"]
def f(n,b=False):
    for p in (FB if b else FP):
        if os.path.exists(p): return ImageFont.truetype(p,n,encoding="unic")
    return ImageFont.load_default()
def t(d,x,y,s,fo,fi,anchor="lm"): d.text((x,y),s,font=fo,fill=fi,anchor=anchor)
def save(im,n):
    im.save(OPS/n); im.save(STATIC/n); print("ok",n,im.size)

# ── 微信封面 1280×544：纸面+蜡笔元素 ──
def cover_wechat():
    W,H=1280,544
    im=Image.new("RGB",(W,H),(246,242,234)); d=ImageDraw.Draw(im)
    # 右侧画一个「手机竖屏」3:4 纸卡
    px0,py0,px1,py1=930,70,1210,474
    d.rounded_rectangle([px0,py0,px1,py1],18,fill=(255,254,250),outline=(60,55,50),width=3)
    # 手机内：上方文字区三行手绘线
    for i,wid in enumerate([150,190,120]):
        y=120+i*34
        d.line([px0+40,y,px0+40+wid,y],fill=(80,75,70),width=4)
    d.line([px0+30,235,px1-30,235],fill=(200,195,185),width=2)
    # 下方简笔小人+风筝（蜡笔感）
    cx,cy=1070,350
    d.ellipse([cx-22,cy-70,cx+22,cy-26],outline=(60,55,50),width=5)  # head
    d.line([cx,cy-26,cx,cy+40],fill=(60,55,50),width=5)
    d.line([cx,cy,cx-35,cy+25],fill=(60,55,50),width=5)
    d.line([cx,cy,cx+35,cy+20],fill=(60,55,50),width=5)
    d.line([cx,cy+40,cx-25,cy+85],fill=(60,55,50),width=5)
    d.line([cx,cy+40,cx+25,cy+85],fill=(60,55,50),width=5)
    # 风筝（菱形，红色蜡笔）
    kx,ky=1150,275
    d.polygon([(kx,ky-26),(kx+22,ky),(kx,ky+26),(kx-22,ky)],outline=CRAYON[0],width=5)
    d.line([kx-14,ky-14,kx+14,ky+14],fill=CRAYON[0],width=3)
    d.line([kx+14,ky+14,kx-14,ky+14],fill=CRAYON[0],width=3)
    # 风筝线到手
    d.line([kx-22,ky,cx+35,cy+20],fill=(120,115,110),width=2)
    # 左侧标题
    d.rounded_rectangle([56,72,300,120],24,fill=(60,55,50))
    t(d,178,96,"GitHub 1975 star",f(23,True),(250,246,238),anchor="mm")
    t(d,56,190,"中文故事一句话",f(60,True),(45,42,40))
    t(d,56,272,"变手绘动画",f(60,True),(196,90,80))
    t(d,56,350,"Remotion + Agent Skill · 20 种画风 · 竖屏静音 MP4",f(25),(90,85,80))
    t(d,56,420,"我克隆真跑了一遍，也发现了 README 没说的坑",f(23),(120,112,105))
    return im

# ── 知乎封面 1600×900 ──
def cover_zhihu():
    W,H=1600,900
    im=Image.new("RGB",(W,H),(248,248,250)); d=ImageDraw.Draw(im)
    d.rectangle([0,0,14,H],fill=(60,90,200))
    t(d,70,80,"开源项目核查",f(30,True),(60,90,200))
    t(d,70,185,"把中文故事丢给 Agent，",f(56,True),(25,30,50))
    t(d,70,270,"自动产出手绘日记动画，靠谱吗？",f(56,True),(25,30,50))
    t(d,70,350,"gnipbao/story-to-handdrawn-video：Remotion 渲染器 + 可分发 Skill，20 画风，本地实测",f(25),(95,100,120))
    cards=[("输入","中文故事文本\n或有序图片",(60,140,110)),
           ("处理","Agent 分句分镜\nImage2 出图",(210,130,60)),
           ("动效","文字→黑白→彩色\n左到右揭示",(60,100,210)),
           ("产出","1080×1440\n静音 H.264",(150,90,190))]
    x0,y0,cw,ch,gap=70,440,350,300,26
    for i,(ti,bd,c) in enumerate(cards):
        x=x0+i*(cw+gap)
        d.rounded_rectangle([x,y0,x+cw,y0+ch],16,fill=(255,255,255),outline=c,width=3)
        d.rounded_rectangle([x,y0,x+cw,y0+68],16,fill=c); d.rectangle([x,y0+38,x+cw,y0+68],fill=c)
        t(d,x+cw//2,y0+34,ti,f(30,True),(255,255,255),anchor="mm")
        a,b2=bd.split("\n"); t(d,x+28,y0+130,a,f(25),(50,55,70)); t(d,x+28,y0+190,b2,f(25),(50,55,70))
        if i<3: d.polygon([(x+cw+5,y0+140),(x+cw+5,y0+165),(x+cw+17,y0+152)],fill=(160,165,180))
    t(d,70,H-42,"数据来源：本地 clone 实测（npm ci / plan / build）· 2026-09",f(22),(135,140,158))
    t(d,W-70,H-42,"jackssybin.cn",f(22),(135,140,158),anchor="rm")
    return im

# ── 图1：整体流水线（两段式：渲染器 + Skill）──
def diagram_pipeline():
    W,H=1400,860
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    t(d,W//2,46,"它不是一个脚本，是「渲染器 + Agent Skill」两段式工程",f(33,True),TEXT,anchor="mm")
    # 上层：Skill（自然语言）
    d.rounded_rectangle([60,110,W-60,270],16,fill=BG2,outline=TEAL,width=2)
    t(d,90,150,"① Agent Skill 层（skill-package/，可装进 Codex / Claude Code / Kimi Code）",f(25,True),TEAL)
    chips=["中文故事文本","有序手绘图片","选风格：水墨/彩铅…","先预览 720×960"]
    for i,c in enumerate(chips):
        x=90+i*310
        d.rounded_rectangle([x,185,x+285,240],10,fill=CARD,outline=TEAL,width=1)
        t(d,x+142,212,c,f(20),TEXT,anchor="mm")
    # 箭头：一个居中转接箭头即可（上层整体调用下层）
    ax=W//2
    d.line([ax,275,ax,320],fill=DIM,width=3)
    d.polygon([(ax-8,312),(ax+8,312),(ax,328)],fill=DIM)
    t(d,W//2+360,300,"run_story_video.py 统一入口（plan/generate/import/render/full）",f(19),DIM,anchor="mm")
    # 中层：渲染器
    d.rounded_rectangle([60,335,W-60,560],16,fill=BG2,outline=ORANGE,width=2)
    t(d,90,372,"② Remotion 渲染器（src/ + scripts/，React 19 + Remotion 4.0.487）",f(25,True),ORANGE)
    steps=[("分句/分镜","story-to-video.mjs\n一句一节拍"),("图片作业","Codex Image2\n本地派生黑白层"),
           ("合成动效","文字→黑白→彩色\n左→右擦除揭示"),("渲染输出","H.264 / CRF18\n1080×1440 静音")]
    for i,(a,b2) in enumerate(steps):
        x=90+i*310
        d.rounded_rectangle([x,405,x+285,530],10,fill=CARD)
        t(d,x+20,435,a,f(22,True),TEXT)
        t(d,x+20,478,b2.split("\n")[0],f(18),DIM)
        t(d,x+20,508,b2.split("\n")[1],f(18),DIM)
        if i<3: d.polygon([(x+289,460),(x+289,480),(x+301,470)],fill=ORANGE)
    # 下层：产物
    d.rounded_rectangle([60,620,W-60,780],16,fill=BG2,outline=GREEN,width=2)
    t(d,90,660,"③ 输出契约（固定文件名，方便后期配音）",f(25,True),GREEN)
    outs=["out/picture_silent.mp4（正式）","out/picture_silent-preview.mp4（预览）",
          "out/uploaded_picture_silent.mp4（上传图）","30fps · yuv420p · 无音轨"]
    for i,o in enumerate(outs):
        x=90+(i%2)*640; y=700+(i//2)*46
        d.ellipse([x,y-6,x+12,y+6],fill=GREEN); t(d,x+26,y,o,f(20),(220,225,235))
    t(d,W//2,825,"关键设计：配音/BGM 全部后置——它只交付「干净的画面轨」",f(23,True),YELLOW,anchor="mm")
    return im

# ── 图2：三层揭示动效（用色块示意 text→bw→color）──
def diagram_reveal():
    W,H=1400,900
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    t(d,W//2,46,"一个节拍的动画语法：文字 → 黑白稿 → 彩色稿，全部从左向右擦除",f(31,True),TEXT,anchor="mm")
    panels=[("① 手写字幕","上方安全区 · 马善政毛笔体\n默认 font 模式中文零错字",TEAL),
            ("② 黑白画稿","彩色图在本地 FFmpeg 派生\n灰度+对比度+锐化",DIM),
            ("③ 彩色插画","20 种风格可选\nsmoothstep 缓动左→右揭示",ORANGE)]
    x0,cw,gap=80,380,45
    panel_h=int(cw*4/3)
    for i,(ti,sub,c) in enumerate(panels):
        x=x0+i*(cw+gap)
        # 3:4 画板
        d.rounded_rectangle([x,110,x+cw,110+panel_h],14,fill=PAPER,outline=c,width=3)
        # 文字区
        if i>=0:
            for j,wd in enumerate([200,260,150]):
                yy=160+j*30
                d.line([x+34,yy,x+34+wd,yy],fill=(80,75,70),width=4)
        d.line([x+26,275,x+cw-26,275],fill=(210,205,195),width=2)
        # 画面区：小人+风筝，三档完成度
        cx2,cy2=x+cw//2,430
        if i>=1:  # 线稿
            col=(60,55,50)
            d.ellipse([cx2-24,cy2-80,cx2+24,cy2-32],outline=col,width=4)
            d.line([cx2,cy2-32,cx2,cy2+40],fill=col,width=4)
            d.line([cx2,cy2-5,cx2-40,cy2+20],fill=col,width=4)
            d.line([cx2,cy2-5,cx2+40,cy2+15],fill=col,width=4)
            d.line([cx2,cy2+40,cx2-28,cy2+90],fill=col,width=4)
            d.line([cx2,cy2+40,cx2+28,cy2+90],fill=col,width=4)
            kx,ky=x+cw-110,300
            if i==1:
                d.polygon([(kx,ky-28),(kx+24,ky),(kx,ky+28),(kx-24,ky)],outline=col,width=3,fill=PAPER)
                d.line([kx-24,ky,cx2+40,cy2+15],fill=(120,115,110),width=2)
            else:
                d.polygon([(kx,ky-28),(kx+24,ky),(kx,ky+28),(kx-24,ky)],outline=(150,60,55),width=4,fill=(235,200,195))
                d.line([kx-15,ky-15,kx+15,ky+15],fill=(150,60,55),width=3)
                d.line([kx-24,ky,cx2+40,cy2+15],fill=(120,115,110),width=2)
                # 蜡笔上色块
                d.ellipse([cx2-24,cy2-80,cx2+24,cy2-32],fill=(245,210,190))
                d.line([cx2,cy2-32,cx2,cy2+40],fill=(70,120,180),width=8)
                d.arc([cx2-60,cy2+40,cx2+60,cy2+140],200,340,fill=(90,150,110),width=6)
        # 标题条与说明（放在画板内部底部更安全？改为画板外下方，画布已加高到900）
        bar_y=110+panel_h+22
        d.rounded_rectangle([x,bar_y,x+cw,bar_y+58],10,fill=CARD,outline=c,width=2)
        t(d,x+20,bar_y+29,ti,f(23,True),c)
        t(d,x+20,bar_y+98,sub.split("\n")[0],f(19),TEXT)
        t(d,x+20,bar_y+132,sub.split("\n")[1],f(19),TEXT)
        if i<2:
            ax=x+cw+8
            d.polygon([(ax,330),(ax,360),(ax+22,345)],fill=DIM)
    return im

# ── 图3：20 风格六大家族 ──
def diagram_styles():
    W,H=1400,820
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    t(d,W//2,46,"20 种风格不是 20 个随机 prompt，是带配方与约束的风格库 v1",f(31,True),TEXT,anchor="mm")
    fams=[("线稿/讲解族",BLUE,"极简线条、小豆人信息图\n白板讲解、圆珠笔速写","科普 / 流程 / 观点"),
          ("蜡笔坏画族",ORANGE,"五岁蜡笔、潦草家庭蜡笔\n真实蜡笔纸、鼠标烂涂鸦","童年 / 亲子 / 吐槽"),
          ("绘本淡彩族",GREEN,"暖光童画、北欧水粉\n墨线淡彩、暖色扁平、淡彩速写","治愈 / 童话 / 亲情"),
          ("纸本质感族",PURPLE,"彩铅日记（默认）\nZine 孔版拼贴、木刻社论","家庭 / 文化 / 社论"),
          ("东方笔墨族",RED,"水墨写意（焦浓重淡清\n飞白枯笔 + 朱红印记）","寓言 / 感悟 / 文化"),
          ("品牌手绘族",TEAL,"有机轮廓涂鸦、马克笔笔记\n中古水粉概念","餐饮 / 品牌 / 社媒")]
    x0,y0,cw,ch,gx,gy=70,120,400,280,30,40
    for i,(ti,c,body,use) in enumerate(fams):
        x=x0+(i%3)*(cw+gx); y=y0+(i//3)*(ch+gy)
        d.rounded_rectangle([x,y,x+cw,y+ch],14,fill=BG2,outline=c,width=2)
        d.rounded_rectangle([x,y,x+cw,y+56],14,fill=c); d.rectangle([x,y+30,x+cw,y+56],fill=c)
        t(d,x+cw//2,y+28,ti,f(24,True),(20,22,28),anchor="mm")
        a,b2=body.split("\n")
        t(d,x+24,y+95,a,f(21),TEXT); t(d,x+24,y+130,b2,f(21),TEXT)
        d.line([x+24,y+170,x+cw-24,y+170],fill=LINE if False else (70,74,90),width=1)
        t(d,x+24,y+205,"适合：",f(19,True),c); t(d,x+92,y+205,use,f(19),(205,210,222))
        t(d,x+24,y+245,"编号/id/中文名均可选，各配固定示例",f(16),DIM)
    t(d,W//2,770,"工程细节：风格指纹写进产物缓存目录，换风格自动出一批新图，绝不串用旧图",f(22,True),YELLOW,anchor="mm")
    return im

# ── 图4：实测体检（含 check 缺陷）──
def diagram_audit():
    W,H=1400,860
    im=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(im)
    t(d,W//2,46,"本机实测：README 的安装步骤，我逐条跑了一遍",f(32,True),TEXT,anchor="mm")
    items=[("1,975","GitHub star（fork 276）",BLUE,"2026-07-21 创建，MIT，v1.1.0"),
           ("20","内置手绘风格",GREEN,"每风格统一人物构图的示例图可横比"),
           ("2,734","核心代码行数",ORANGE,"TSX 510 + mjs/py 2224，工程不重"),
           ("0","音轨 / 配音 / BGM",PURPLE,"设计上刻意只交付静音画面轨"),
           ("✓","plan + build 实测通过",TEAL,"2 句故事→2 分镜；remotion bundle exit 0"),
           ("✗","npm run check 全新克隆失败",RED,"校验自带 storyboard 引用 gitignore 资产")]
    x0,y0,cw,ch,gx,gy=70,115,400,210,30,30
    for i,(big,label,c,sub) in enumerate(items):
        x=x0+(i%3)*(cw+gx); y=y0+(i//3)*(ch+gy)
        d.rounded_rectangle([x,y,x+cw,y+ch],14,fill=BG2,outline=c,width=2)
        t(d,x+28,y+72,big,f(58,True),c)
        t(d,x+28,y+135,label,f(23,True),TEXT)
        t(d,x+28,y+176,sub,f(18),DIM)
    d.rounded_rectangle([70,620,W-70,800],14,fill=(42,28,28),outline=RED,width=2)
    t(d,96,660,"关于 check 失败（诚实记录，不影响主流程）：",f(23,True),RED)
    t(d,96,700,"storyboard.json / storyboard.uploaded.json 引用 public/assets/generated/ 下的 text/bw/color 资产，",f(19),(235,215,215))
    t(d,96,732,"而该目录在 .gitignore 中；全新 clone 后 tsc 通过，但 validate-storyboard 必报缺失、退出码 1。",f(19),(235,215,215))
    t(d,96,768,"规避：直接用 run_story_video.py --mode plan 生成自己的 storyboard.generated.json；期待官方把样例资产入库或放宽校验。",f(19),(235,215,215))
    return im

IMAGE_SPECS=[
 ("cover-wechat.jpg",1280,544,cover_wechat),
 ("cover-zhihu.png",1600,900,cover_zhihu),
 ("diagram-pipeline.png",1400,860,diagram_pipeline),
 ("diagram-reveal.png",1400,900,diagram_reveal),
 ("diagram-styles.png",1400,820,diagram_styles),
 ("diagram-audit.png",1400,860,diagram_audit),
]
def main():
    for n,w,h,fn in IMAGE_SPECS:
        print("generating",n); save(fn(),n)
    print("done")
if __name__=="__main__": main()
