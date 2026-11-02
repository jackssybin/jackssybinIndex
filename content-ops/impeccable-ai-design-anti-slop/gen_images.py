# -*- coding: utf-8 -*-
"""Impeccable 配图。采用其 neo-kinpaku 品牌语言：暖黑漆底+金箔+铜绿，编辑风（正是它推崇的、非AI slop）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/impeccable-ai-design-anti-slop"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
# neo-kinpaku
BG=(20,17,13)       # lacquer-black 暖黑
PANEL=(30,26,20)
PANEL2=(39,34,26)
GOLD=(216,178,92)    # kinpaku
GOLDL=(232,206,140)
VERD=(120,170,158)   # verdigris patina 铜绿
CHAMP=(236,230,218) # 近白暖
MUTED=(176,166,148)
LINE=(64,55,42)
RED=(206,120,92)     # vermilion 朱
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)
def serif(w,s): return ImageFont.truetype(f"{FD}/NotoSerifCJK-{w}.ttc",s)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    # 顶部细金线
    d.rectangle([0,0,W,6],fill=GOLD)
    t(d,(110,110),"给 AI 程序员配一个设计总监",serif("Black",72),CHAMP)
    t(d,(112,214),"9.9 万 Star：24 个设计命令 + 62 条规则，在提交前拦下「AI 味」",font("Bold",36),GOLDL)
    pts=[("把「高级一点」变成精确命令","bolder / quieter / polish / critique，作用到具体组件"),
         ("无大模型的 AI 味检测器","62 条确定性规则，不要 API Key，可进 CI 和每次提交"),
         ("浏览器里边看边改","live 热切换变体，满意直接写回源码；适配 20 种 AI 编程工具")]
    y=350
    for a,b in pts:
        d.rectangle([110,y+10,124,y+34],fill=GOLD)
        t(d,(148,y),a,font("Bold",35),VERD)
        t(d,(148,y+50),b,font("Regular",28),MUTED); y+=124
    rr(d,(1180,150,1490,620),20,fill=PANEL,outline=GOLD,width=2)
    rows=[("Star","99.4K"),("Fork","5.9K"),("语言","Rust 核心"),("引擎","v0.1.18"),("命令","24"),("规则","62"),("协议","Apache-2.0")]
    yy=198
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",26),MUTED); t(d,(1450,yy),v,font("Bold",28),GOLDL,anchor="ra"); yy+=58
    t(d,(110,826),"作者 Paul Bakaus（jQuery UI 之父），脱胎于 Anthropic 官方 frontend-design skill",font("Medium",25),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def commands():
    W,H=1200,860; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"24 个命令：指挥 · 评审 · 收尾 · 实时 · 规划",serif("Black",36),CHAMP)
    groups=[("Steer 引导",["bolder 更大胆","quieter 收敛","distill 删冗余","colorize 加色","typeset 字体","layout 间距","animate 动效","delight 个性","overdrive 炫技"],GOLD),
            ("Review 评审",["critique 打分 UX 评审","audit 可访问/性能/响应式","按 P0–P3 分级排序"],VERD),
            ("Finish 收尾",["polish 上线前打磨","harden 错误态/i18n/溢出","clarify 文案","adapt 多屏适配","optimize 性能","onboard 新手/空状态"],GOLDL),
            ("Live 实时",["live 浏览器选元素","热切换设计变体","写回源码","支持 Vite/Next/Svelte/Astro"],RED),
            ("Plan 规划",["shape 写码前规划 UX","init 生成 PRODUCT.md","document 沉淀 DESIGN.md","extract 抽设计系统"],MUTED)]
    # 5卡横排太挤，改 上3下2
    pos=[(60,140),(440,140),(820,140),(60,500),(440,500)]
    sizes=[(320,330),(320,330),(320,330),(320,320),(680,320)]
    for (g,items,c),(x,y),(cw,ch) in zip(groups,pos,sizes):
        rr(d,(x,y,x+cw,y+ch),14,fill=PANEL,outline=LINE,width=2)
        d.rectangle([x,y,x+cw,y+5],fill=c)
        t(d,(x+22,y+22),g,font("Bold",25),c)
        yy=y+70
        for it in items:
            d.ellipse([x+22,yy+8,x+32,yy+18],outline=c,width=2)
            t(d,(x+44,yy+13),it,font("Regular",20),(214,206,190),anchor="lm"); yy+=38
    rr(d,(820,500,1140,820),14,fill=PANEL2,outline=GOLD,width=2)
    t(d,(842,528),"核心理念",font("Bold",24),GOLD)
    for j,line in enumerate(["窄目标 > 扫射全页","先建 PRODUCT/DESIGN","再对单一组件下命令","一个组件就近细看","胜过整页走马观花"]):
        t(d,(842,580+j*44),line,font("Regular",21),CHAMP)
    img.save(f"{OUT}/commands.png"); print("commands.png")

def rules():
    W,H=1200,880; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"62 条确定性规则：不要大模型、不要 Key",serif("Black",34),CHAMP)
    cards=[("AI 风格套路 slop tells",GOLD,["紫蓝渐变 / 深底青色 ai-color-palette","Inter·Roboto 等 overused-font","渐变标题字 gradient-text","卡片侧边粗色边 side-tab","卡片套卡片 nested-cards","彩色光晕 dark-glow / 径向 halo","假光标·脉冲点·跑马灯·几何拼贴画"]),
           ("可用性与排版硬伤",RED,["低对比 low-contrast / 彩底灰字","tiny-text 字号过小","cramped-padding 拥挤内边距","skipped-heading 跳标题级","tight-leading 行距过紧","文字遮挡 / 首屏横向溢出"]),
           ("节奏与系统一致性",VERD,["到处一个间距 monotonous-spacing","字阶太平 flat-type-hierarchy","是否用了设计系统 token：","font / color / radius / size"]),
           ("运行时（需渲染页面）",GOLDL,["broken-image 坏图","script-error 脚本报错","静止态内容被隐藏","部分规则仅扫 URL 时触发"])]
    pos=[(60,130),(620,130),(60,490),(620,490)]
    for (g,c,items),(x,y) in zip(cards,pos):
        rr(d,(x,y,x+520,y+330),14,fill=PANEL,outline=LINE,width=2)
        d.rectangle([x,y,x+6,y+330],fill=c)
        t(d,(x+26,y+22),g,font("Bold",24),c)
        yy=y+68
        for it in items:
            t(d,(x+26,yy),"·",font("Bold",22),c)
            t(d,(x+44,yy+13),it,font("Regular",20),(212,204,188),anchor="lm"); yy+=40
    t(d,(60,844),"规则分级（部分 advisory 仅建议）；品牌例外可加白名单或文件内注释关闭",font("Medium",23),MUTED)
    img.save(f"{OUT}/rules.png"); print("rules.png")

def detector():
    W,H=1200,720; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"检测器三种用法：让「AI 味」溜不过上线",serif("Black",34),CHAMP)
    steps=[("Agent 设计钩子","每次 AI 改 UI 文件\n提交前自动扫描\n把问题塞回给 Agent","最推荐，防患于未然",GOLD),
           ("终端 / CI","npx impeccable detect src/\ndetect http://localhost:5173\n--json / --github 注解\nexit 2=有发现 1=无法扫","无需 Agent，可做门禁",VERD),
           ("浏览器扩展","浮层叠加在任意网页\n你或别人的站都能查\nChrome Web Store","可视化逐条定位",RED)]
    x=60;cw=350;gap=25;y=150
    for i,(h,b,tag,c) in enumerate(steps):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+420),16,fill=PANEL,outline=c,width=2)
        t(d,(xx+24,y+24),h,font("Bold",27),c)
        yy=y+92
        for ln in b.split("\n"):
            mono = ln.startswith("npx") or ln.startswith("detect") or ln.startswith("--") or ln.startswith("exit")
            t(d,(xx+24,yy),ln,font("Bold" if mono else "Regular",19 if mono else 21),GOLDL if mono else (208,200,186)); yy+=34 if mono else 40
        d.line([xx+24,y+340,xx+cw-24,y+340],fill=LINE,width=1)
        t(d,(xx+24,y+362),tag,font("Medium",20),MUTED)
    t(d,(60,620),"源码(JSX/TSX)只跑模式规则；对比/字号等需渲染的规则要扫 dev server 的 URL",font("Medium",23),MUTED)
    img.save(f"{OUT}/detector.png"); print("detector.png")

zhihu_cover(); commands(); rules(); detector(); print("ALL DONE")
