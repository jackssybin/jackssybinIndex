# -*- coding: utf-8 -*-
"""OpenBot 微信补图 v2：痛点对比 + VPS常开部署。沿用青蓝深色系。"""
from PIL import Image, ImageDraw, ImageFont
OUT="/root/jackssybinIndex/static/images/openbot-local-multiagent-workspace"
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(15,19,30); PANEL=(24,30,47); PANEL2=(31,39,60)
CYAN=(64,214,196); BLUE=(94,156,250); AMBER=(255,190,92); WHITE=(236,241,250)
GREY=(150,162,184); RED=(255,120,120); GREEN=(88,200,140); LINE=(48,62,90)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def pain():
    W,H=1200,720; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,42),"以前开三个终端假装多智能体，现在呢",font("Black",38),WHITE)
    # 左：没有OpenBot
    rr(d,(60,130,580,610),18,fill=PANEL,outline=RED,width=3)
    t(d,(320,178),"裸开多个 CLI 终端",font("Bold",32),RED,anchor="mm")
    bad=["各开终端、各自登录","上下文互不相通","协作靠人肉复制粘贴","重启电脑一切归零","跑飞了也没人拦"]
    for i,x in enumerate(bad):
        y=240+i*66
        d.line([96,y+12,118,y+34],fill=RED,width=4); d.line([118,y+12,96,y+34],fill=RED,width=4)
        t(d,(138,y+23),x,font("Regular",27),(200,208,224),anchor="lm")
    # 右：有OpenBot
    rr(d,(620,130,1140,610),18,fill=PANEL,outline=CYAN,width=3)
    t(d,(880,178),"OpenBot 一张办公桌",font("Bold",32),CYAN,anchor="mm")
    good=["7 个 Agent 同一应用","独立工作区、独立会话","Agent 互发消息传文件","队列持久、重启不丢","暂停/取消随时接管"]
    for i,x in enumerate(good):
        y=240+i*66
        d.ellipse([96,y+8,122,y+34],outline=GREEN,width=4)
        d.line([103,y+21,111,y+29],fill=GREEN,width=4); d.line([111,y+29,120,y+13],fill=GREEN,width=4)
        t(d,(662,y+23),x,font("Regular",27),(200,224,218),anchor="lm")
    t(d,(60,650),"它不提供模型，只把你已有的官方 CLI 编排进同一个桌面应用",font("Medium",25),GREY)
    img.save(f"{OUT}/pain.png"); print("pain.png")

def deploy():
    W,H=1200,700; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,42),"把 AI 团队丢在 VPS 上 7×24，手机随时派活",font("Black",36),WHITE)
    steps=[("1","无屏服务器安装","Ubuntu 24.04/26.04\n一行脚本 + systemd",BLUE),
           ("2","邮箱验证码登录","sudo openbot login\n桌面/iPhone/网页可连",CYAN),
           ("3","随时远程派活","openbot.run/app\n手机端下发与监督",AMBER)]
    x=60; cw=340; gap=30; y=150
    for i,(n,h,b,c) in enumerate(steps):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+300),20,fill=PANEL,outline=LINE,width=2)
        d.ellipse([xx+28,y+26,xx+96,y+94],outline=c,width=5)
        t(d,(xx+62,y+60),n,font("Black",32),c,anchor="mm")
        t(d,(xx+28,y+120),h,font("Bold",29),WHITE)
        for j,line in enumerate(b.split("\n")):
            t(d,(xx+28,y+185+j*42),line,font("Regular",24),(190,200,218))
        if i<2:
            ax=xx+cw+2; d.polygon([(ax,y+140),(ax+26,y+155),(ax,y+170)],fill=GREY)
    # 代码条
    rr(d,(60,490,1140,590),12,fill=(11,15,24),outline=LINE,width=1)
    t(d,(84,522),"$ curl -fsSL .../install-server.sh | sudo bash",font("Bold",23),GREEN,anchor="lm")
    t(d,(84,560),"$ sudo openbot login   # 也有官方 Docker 镜像，seccomp 沙箱默认开启",font("Bold",23),GREY,anchor="lm")
    t(d,(60,628),"也支持 Docker / Nix / macOS / Windows / Linux AppImage；远程桌面限 X11，Wayland 暂不支持",font("Regular",24),GREY)
    img.save(f"{OUT}/deploy.png"); print("deploy.png")

pain(); deploy(); print("DONE")
