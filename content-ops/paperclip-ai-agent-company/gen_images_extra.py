# -*- coding: utf-8 -*-
"""Paperclip 微信补图 v2：修复文字溢出与换行撞脚注。"""
from PIL import Image, ImageDraw, ImageFont
OUT="/root/jackssybinIndex/static/images/paperclip-ai-agent-company"
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(13,20,23); PANEL=(20,31,35); PANEL2=(26,40,45)
TEAL=(45,212,191); BLUE=(96,165,250); PURPLE=(167,139,250); AMBER=(251,191,96)
WHITE=(236,244,242); GREY=(148,166,163); LINE=(45,66,70)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def wrap_cn(d,s,f,maxw):
    lines=[];cur=""
    for ch in s:
        if ch=="\n":
            lines.append(cur);cur="";continue
        if d.textlength(cur+ch,font=f)<=maxw: cur+=ch
        else: lines.append(cur);cur=ch
    if cur:lines.append(cur)
    return lines

def flow():
    W,H=1200,680; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,46),"用 Paperclip 开一家 AI 公司，只要三步",font("Black",40),WHITE)
    steps=[("01","定义目标",["做一个冲到 100 万 MRR","的 AI 笔记应用"],TEAL),
           ("02","招聘团队",["CEO / CTO / 工程师","设计 / 市场，任意 bot"],BLUE),
           ("03","审批运行",["审阅策略 · 设定预算","仪表盘监督与验收"],AMBER)]
    x=60; cw=340; gap=30; y=170
    for i,(n,h,lines,c) in enumerate(steps):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+360),20,fill=PANEL,outline=LINE,width=2)
        d.ellipse([xx+30,y+28,xx+104,y+102],outline=c,width=5)
        t(d,(xx+67,y+65),n,font("Black",34),c,anchor="mm")
        t(d,(xx+30,y+130),h,font("Bold",33),WHITE)
        yy=y+205
        for line in lines:
            t(d,(xx+30,yy),line,font("Regular",25),(190,206,203)); yy+=42
        if i<2:
            ax=xx+cw+2
            d.polygon([(ax,y+160),(ax+26,y+175),(ax,y+190)],fill=GREY)
    t(d,(60,600),"抽象单位是「公司」：组织架构 · 目标血缘 · 预算 · 治理 · 绩效，而不是 PR",font("Medium",25),GREY)
    img.save(f"{OUT}/flow.png"); print("flow.png")

def roster():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"只要能接收心跳，就录用：适配生态",font("Black",38),WHITE)
    groups=[("编码 CLI",["Claude Code","Codex","Cursor + Cloud","Gemini CLI","OpenCode","Grok Build","Kimi Code","Pi"],TEAL,150),
            ("Agent 平台",["OpenClaw","Hermes + Gateway"],BLUE,330),
            ("扩展方式",["自定义进程","HTTP 端点","外部适配器包","MCP 服务器"],PURPLE,510)]
    for gname,items,c,y in groups:
        rr(d,(60,y,280,y+130),16,fill=(18,30,34),outline=c,width=2)
        t(d,(170,y+65),gname,font("Bold",30),c,anchor="mm")
        x=310
        for it in items:
            w=int(d.textlength(it,font=font("Bold",26)))+44
            if x+w>1140:
                x=310; y+=66
            rr(d,(x,y+30,x+w,y+82),26,fill=PANEL2,outline=LINE,width=2)
            t(d,(x+w/2,y+56),it,font("Bold",26),(205,219,216),anchor="mm")
            x+=w+18
    t(d,(60,700),"每个 Agent 单独选模型与 harness，任务 / 技能 / 权限 / 历史汇聚同一处",font("Medium",25),GREY)
    img.save(f"{OUT}/roster.png"); print("roster.png")

flow(); roster(); print("DONE")
