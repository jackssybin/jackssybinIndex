#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "book-to-skill-agent-skill"
ROOT = Path("/root/jackssybinIndex")
OPS = ROOT / "content-ops" / SLUG / "media"
STATIC = ROOT / "static" / SLUG
OPS.mkdir(parents=True, exist_ok=True)
STATIC.mkdir(parents=True, exist_ok=True)

BG=(14,16,22); BG2=(22,20,34); CARD=(32,36,48); LINE=(66,74,96)
TEXT=(232,236,246); DIM=(150,158,178)
BLUE=(109,172,255); ORANGE=(255,168,76); GREEN=(119,221,119); PINK=(255,119,168); PURPLE=(167,139,250)

CJK=["/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
     "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
     "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
     "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"]
CJKB=["/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc",
      "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
      "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
      "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"]
MONO="/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
MONOB="/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"

def f(size,bold=False):
    for p in (CJKB if bold else CJK):
        if os.path.exists(p): return ImageFont.truetype(p,size,encoding="unic")
    return ImageFont.load_default()
def fm(size,bold=False):
    p=MONOB if bold and os.path.exists(MONOB) else MONO
    return ImageFont.truetype(p,size) if os.path.exists(p) else f(size)

def rr(d,xy,r,fill,outline=None,w=0): d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=w)
def tx(d,xy,s,font,fill,anchor="lm"): d.text(xy,s,font=font,fill=fill,anchor=anchor)

def save(img,name,jpg=False):
    if jpg:
        img.convert("RGB").save(OPS/name,quality=90)
        img.convert("RGB").save(STATIC/name,quality=90)
    else:
        img.save(OPS/name); img.save(STATIC/name)
    print("  ok",name,(OPS/name).stat().st_size//1024,"KB")

# ---------- 微信封面 1080x864 JPG : 深色 ----------
def cover_wechat():
    W,H=1080,864
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    for i in range(0,700,6):
        ov=Image.new("RGBA",(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
        od.ellipse([-i,-i,520+i,520+i],fill=(90,60,200,max(0,34-i//16)))
        img.paste(ov,(0,0),ov)
    for x in range(0,W,72): d.line([x,0,x,H],fill=(28,26,44),width=1)
    for y in range(0,H,72): d.line([0,y,W,y],fill=(28,26,44),width=1)
    rr(d,[64,72,430,132],30,None,outline=PURPLE,w=3)
    tx(d,(247,102),"开源实测 · Agent Skill",f(30,True),(206,190,255),anchor="mm")
    tx(d,(64,230),"一本书 → 一个",f(66,True),TEXT)
    tx(d,(64,330),"AI 技能",f(96,True),PURPLE)
    tx(d,(64,430),"单次提问 token 直降 51 倍",f(48,True),(255,214,128))
    tx(d,(64,500),"技术书编译成 Claude / Copilot 按需加载的技能",f(27),DIM)
    # big 51x badge right
    rr(d,[700,210,1010,520],24,CARD,PURPLE,3)
    tx(d,(855,300),"51×",f(120,True),GREEN,anchor="mm")
    tx(d,(855,410),"更少 token",f(34,True),TEXT,anchor="mm")
    tx(d,(855,465),"实测 · 非估算",f(24),DIM,anchor="mm")
    tx(d,(64,H-150),"book-to-skill   ·   MIT License   ·   v1.4.0",f(28),(190,200,225))
    tx(d,(64,H-100),"PDF · EPUB · DOCX · HTML · RTF · MOBI → SKILL.md",f(24),(130,140,165))
    tx(d,(W-64,H-100),"约 $1 / 本 · 本地运行",f(26),ORANGE,anchor="rm")
    return img

# ---------- 知乎封面 1600x900 PNG : 亮分析风 ----------
def cover_zhihu():
    W,H=1600,900
    img=Image.new("RGB",(W,H),(247,248,251)); d=ImageDraw.Draw(img)
    d.rectangle([0,0,14,H],fill=(60,100,220))
    rr(d,[70,72,360,128],28,fill=(60,100,220))
    tx(d,(215,100),"知识工程 · 实测",f(28,True),(255,255,255),anchor="mm")
    rr(d,[380,72,620,128],28,None,outline=(60,100,220),w=2)
    tx(d,(500,100),"Agent Skills 标准",f(28,True),(60,100,220),anchor="mm")
    tx(d,(70,210),"把技术书交给 AI，为什么又贵又会幻觉？",f(58,True),(20,30,60))
    tx(d,(70,298),"book-to-skill：转换一次，按需加载章节",f(40,True),(60,100,220))
    chips=[("整本塞入上下文","每轮重复烧 token\n256K tokens",(235,110,110)),
           ("发现循环翻 PDF","反复拉目录回溯\n78K tokens",(235,160,70)),
           ("自己做笔记","200 行文档\n再没打开",(180,180,90)),
           ("book-to-skill","核心4K+章节1K\n~5K tokens",(60,180,130))]
    cw,ch,gap=340,180,26; x0=(W-(cw*4+gap*3))//2; y0=430
    for i,(name,desc,color) in enumerate(chips):
        x=x0+i*(cw+gap); hl=i==3
        if hl: rr(d,[x,y0,x+cw,y0+ch],18,fill=color)
        else: rr(d,[x,y0,x+cw,y0+ch],18,fill=(255,255,255),outline=color,w=2)
        tx(d,(x+cw//2,y0+46),name,f(30,True),(255,255,255) if hl else color,anchor="mm")
        for j,line in enumerate(desc.split("\n")):
            tx(d,(x+cw//2,y0+100+j*40),line,f(23),(238,248,243) if hl else (90,90,90),anchor="mm")
    tx(d,(70,H-46),"virgiliojr94/book-to-skill · MIT · tiktoken 实测可复现",f(24),(120,130,160))
    tx(d,(W-70,H-46),"jackssybin.com",f(24),(120,130,160),anchor="rm")
    return img

# ---------- 01 概念图：书 -> skill ----------
def showcase():
    W,H=1200,720
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    tx(d,(W//2,56),"读完就忘的技术书，编译成可按需调用的 AI 技能",f(36,True),TEXT,anchor="mm")
    # book card
    rr(d,[80,170,360,560],18,CARD,BLUE,2)
    tx(d,(220,220),"📕  my-book.pdf",f(30,True),BLUE,anchor="mm")
    for i,t in enumerate(["501 页","229K tokens","PDF / EPUB / DOCX …"]):
        tx(d,(120,300+i*60),t,f(26),DIM)
    # arrow
    d.line([380,365,520,365],fill=PURPLE,width=6)
    d.polygon([(520,365),(495,348),(495,382)],fill=PURPLE)
    tx(d,(450,330),"一次性",f(24,True),PURPLE,anchor="mm")
    tx(d,(450,400),"约 $1",f(24),ORANGE,anchor="mm")
    # skill files
    files=[("SKILL.md","核心心智模型 · ~4K",GREEN),
           ("chapters/ch07.md","按需章节 · ~1K",BLUE),
           ("glossary.md","术语表",PINK),
           ("patterns.md","模式与算法",ORANGE),
           ("cheatsheet.md","决策规则",PURPLE)]
    rr(d,[540,150,1120,580],18,BG2,LINE,2)
    tx(d,(580,190),"~/.claude/skills/my-book/",fm(24,True),DIM)
    for i,(fn,desc,c) in enumerate(files):
        y=245+i*64
        rr(d,[575,y-22,600,y+2],6,c)
        tx(d,(620,y-10),fn,fm(24,True),TEXT)
        tx(d,(620,y+22),desc,f(22),DIM)
    tx(d,(W//2,640),"提问 → Agent 只读对应章节 → 基于原文回答，不幻觉",f(30,True),(255,214,128),anchor="mm")
    return img

# ---------- 02 终端真实输出 ----------
def terminal_shot():
    W,H=1200,760
    img=Image.new("RGB",(W,H),(18,20,28)); d=ImageDraw.Draw(img)
    rr(d,[40,40,W-40,H-40],16,(30,34,46),(70,80,104),2)
    rr(d,[40,40,W-40,104],16,(44,48,62))
    d.rectangle([40,84,W-40,106],fill=(44,48,62))
    for i,c in enumerate([(255,95,86),(255,189,46),(39,201,63)]):
        d.ellipse([72+i*38,60,94+i*38,82],fill=c)
    tx(d,(W//2,73),"book-to-skill — extractor 实跑",f(26,True),(210,216,230),anchor="mm")
    lines=[
      ("$ python3 scripts/extract.py evals/fixtures/pd00-synthetic-book.txt",(150,220,255),True),
      ("",(0,0,0),False),
      ("book-to-skill · turns a document into a structured agent skill",DIM,False),
      ("Extracting text document: pd00-synthetic-book.txt",TEXT,False),
      ("  chapters: 3 (numeric)",GREEN,False),
      ("",(0,0,0),False),
      ("Extraction complete:",TEXT,True),
      ("   Sources : 1 processed",TEXT,False),
      ("   Words   : 141",TEXT,False),
      ("   Tokens  : ~0K",TEXT,False),
      ("   Chapters: 3 detected overall (numeric)",(255,214,128),False),
      ("   ToC     : yes",(255,214,128),False),
      ("   Workdir -> /tmp/book_skill_work-537753/",BLUE,False),
    ]
    y=150
    for s,c,b in lines:
        if s=="": y+=24; continue
        tx(d,(72,y),s,fm(25,b),c); y+=44
    rr(d,[72,y+6,W-72,y+96],12,(24,40,32),GREEN,2)
    tx(d,(96,y+50),"✓ 章节标题为葡萄牙语 Capítulo 1…3，仍被准确识别（多语言数字模式）",f(25,True),GREEN)
    return img

# ---------- 03 架构/提取器分流 ----------
def architecture():
    W,H=1200,780
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    tx(d,(W//2,52),"两段式架构：确定性提取器 + Spec 驱动生成器",f(34,True),TEXT,anchor="mm")
    def box(x1,y1,x2,y2,title,sub,c):
        rr(d,[x1,y1,x2,y2],14,CARD,c,2)
        tx(d,((x1+x2)//2,y1+38),title,f(27,True),c,anchor="mm")
        for i,s in enumerate(sub):
            tx(d,(x1+24,y1+78+i*38),s,f(22),DIM)
    box(70,130,400,360,"① 提取器 (Python)",["确定性 · 本地运行","PDF: pdftotext / docling","EPUB/DOCX/HTML/RTF/MOBI","→ full_text.txt + metadata.json"],BLUE)
    box(470,130,800,360,"② 生成器 (Agent)",["严格遵循 761 行 SKILL.md","提取结构，而非摘要","框架/原则/模式/反模式","→ 分层技能文件"],PURPLE)
    box(870,130,1130,360,"③ 多宿主",["Claude Code","Copilot CLI · Amp","Hermes Agent","同一 SKILL.md"],GREEN)
    for ax in (400,800):
        d.line([ax+8,245,ax+62,245],fill=DIM,width=5)
        d.polygon([(ax+70,245),(ax+48,231),(ax+48,259)],fill=DIM)
    # extraction fork
    tx(d,(W//2,430),"关键取舍：先分类，再选 PDF 提取器",f(30,True),(255,214,128),anchor="mm")
    rr(d,[90,480,560,690],14,BG2,GREEN,2)
    tx(d,(325,524),"文字书（散文）",f(28,True),GREEN,anchor="mm")
    tx(d,(120,580),"pdftotext   0.1 秒",fm(26,True),TEXT)
    tx(d,(120,630),"表格 0 · 代码块 0",fm(24),DIM)
    rr(d,[640,480,1110,690],14,BG2,ORANGE,2)
    tx(d,(875,524),"技术书（代码/表格）",f(28,True),ORANGE,anchor="mm")
    tx(d,(670,580),"docling   164 秒",fm(26,True),TEXT)
    tx(d,(670,630),"表格 48 · 代码块 36（103 页实测）",fm(24),DIM)
    tx(d,(W//2,740),"扫描版 PDF 无文字层 → 立即停止并提示先 OCR，不生成空技能",f(24),PINK,anchor="mm")
    return img

SPECS=[
  ("wechat-cover.jpg",cover_wechat,True),
  ("zhihu-cover.png",cover_zhihu,False),
  ("01-showcase.png",showcase,False),
  ("02-extractor-output.png",terminal_shot,False),
  ("03-architecture.png",architecture,False),
]
def main():
    for name,fn,jpg in SPECS:
        print("render",name); save(fn(),name,jpg)
if __name__=="__main__":
    main()
