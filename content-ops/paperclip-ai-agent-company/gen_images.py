# -*- coding: utf-8 -*-
"""Paperclip 三端推广配图：微信封面 + 知乎封面 + 支柱/架构/对比 3张正文图。"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = "/root/jackssybinIndex/static/images/paperclip-ai-agent-company"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

# 品牌青绿系（深底）
BG=(13,20,23); PANEL=(20,31,35); PANEL2=(26,40,45)
TEAL=(45,212,191); TEAL2=(94,234,212); BLUE=(96,165,250)
PURPLE=(167,139,250); AMBER=(251,191,96); WHITE=(236,244,242)
GREY=(148,166,163); GREEN=(80,200,150); RED=(248,113,113); LINE=(45,66,70)

def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

# ---------- 微信封面 1080x864 ----------
def wechat():
    W,H=1080,864; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.ellipse([820,-160,1280,300],fill=(22,40,44))
    d.ellipse([-180,620,240,1040],fill=(19,33,37))
    # 回形针几何标
    d.arc([820,560,1000,740],start=200,end=520,fill=TEAL,width=10)
    d.arc([855,595,965,705],start=30,end=330,fill=TEAL,width=10)
    rr(d,(80,88,330,148),28,fill=(18,48,50),outline=TEAL,width=2)
    t(d,(205,118),"开源项目 · Agent 编排",font("Medium",28),TEAL2,anchor="mm")
    t(d,(80,210),"给一群 AI 员工",font("Black",82),WHITE)
    t(d,(80,312),"开一家公司",font("Black",82),WHITE)
    t(d,(82,420),"Paperclip：把多 Agent 变成有组织、有预算、有 KPI 的团队",font("Bold",34),(196,216,212))
    t(d,(82,478),"组织架构 · 心跳调度 · 预算硬停 · 审批治理 · 技能培训",font("Regular",29),GREY)
    feats=[("108K Star",TEAL),("MIT 真开源",GREEN),("8 个月",AMBER),("2700+ PR",BLUE)]
    x=82
    for s,c in feats:
        w=int(d.textlength(s,font=font("Bold",32)))+48
        rr(d,(x,566,x+w,624),26,fill=PANEL2,outline=LINE,width=2)
        t(d,(x+w/2,595),s,font("Bold",32),c,anchor="mm"); x+=w+22
    d.line([80,720,1000,720],fill=LINE,width=2)
    t(d,(80,758),"github.com/paperclipai/paperclip",font("Medium",27),GREY)
    t(d,(1000,758),"Claude · Codex · OpenClaw · Hermes…",font("Bold",25),TEAL2,anchor="ra")
    img.save(f"{OUT}/cover.png"); print("cover.png")

# ---------- 知乎封面 1600x900 ----------
def zhihu():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,18,H],fill=TEAL)
    t(d,(110,140),"Paperclip 是什么？",font("Black",80),WHITE)
    t(d,(110,265),"一句官方定位：如果 OpenClaw 是一名员工，",font("Bold",42),(200,216,212))
    t(d,(110,330),"Paperclip 就是公司本身。",font("Bold",42),(200,216,212))
    pts=[("不是 Agent / 不是框架","不造模型、不教你写 Agent，只负责把它们编排成团队"),
         ("抽象单位是「公司」","组织架构、目标血缘、预算、审批、绩效，而非 PR 和会话"),
         ("真·MIT 自托管","不要账号，一行 npx 起服务，嵌入式 Postgres，手机可管")]
    y=470
    for a,b in pts:
        d.ellipse([110,y+12,132,y+34],fill=TEAL)
        t(d,(158,y),a,font("Bold",37),TEAL2)
        t(d,(158,y+50),b,font("Regular",31),GREY); y+=128
    rr(d,(1140,140,1490,600),24,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","108,304"),("Fork","17,946"),("已合并PR","2,700+"),("建仓","2026-03"),("协议","MIT"),("技术栈","Node + React")]
    yy=196
    for k,v in rows:
        t(d,(1180,yy),k,font("Regular",27),GREY)
        t(d,(1450,yy),v,font("Bold",29),WHITE,anchor="ra"); yy+=64
    t(d,(110,830),"注意：高速增长期，仍有 6766 个 open issues，部分能力标注实验性",font("Medium",26),AMBER)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

# ---------- 图：四大支柱 ----------
def pillars():
    W,H=1200,800; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,44),"一群 Agent 要真正产出，靠四根柱子",font("Black",40),WHITE)
    cards=[("① 智能体任务管理器","工单 · 审批评审关卡\n可审计流程 · 从 diff/截图/测试验收\n面向所有人的日常",TEAL,(60,140)),
           ("② Agent 组织架构","人机混编组织图 · 头衔与汇报线\n治理权限 · 作用域密钥\n责任归属到真人",BLUE,(620,140)),
           ("③ Agent 员工培训","Skill Studio · 共享技能\nevals 评测 · 绩效评审\n版本历史与回滚",PURPLE,(60,470)),
           ("④ 智能体操作系统","跨供应商运行时 · 沙箱 · MCP\nSSO/RBAC/GRC · 成本控制\ntrace 与数据沉淀",AMBER,(620,470))]
    for title,body,c,(x,y) in cards:
        rr(d,(x,y,x+520,y+290),20,fill=PANEL,outline=LINE,width=2)
        d.rectangle([x,y,x+10,y+290],fill=c)
        t(d,(x+34,y+30),title,font("Bold",31),c)
        for i,line in enumerate(body.split("\n")):
            t(d,(x+34,y+92+i*46),line,font("Regular",27),(196,212,209))
    img.save(f"{OUT}/pillars.png"); print("pillars.png")

# ---------- 图：控制平面架构（表格化，避免连线乱） ----------
def arch():
    W,H=1200,920; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,44),"它是完整控制平面，不是套壳：12 个子系统",font("Black",38),WHITE)
    items=[("Identity & Access","身份权限：两种部署模式、角色与短期 JWT",TEAL),
           ("Work & Tasks","工单系统：目标/项目/父任务链接、阻塞依赖",TEAL),
           ("Heartbeat","心跳执行：落库唤醒队列、预算检查、自愈",BLUE),
           ("Governance","治理审批：评审关卡、配置版本化、可回滚",BLUE),
           ("Org Chart","组织架构：Agent 的角色、汇报线、预算",PURPLE),
           ("Workspaces","工作区运行时：git worktree、分支与沙箱",PURPLE),
           ("Budget & Costs","成本：7 维记账、阈值告警、预算硬停止",AMBER),
           ("Routines","例行任务：cron/webhook/API 触发、补跑",AMBER),
           ("Plugins","插件：进程外 worker、能力门控，免 fork",GREEN),
           ("Secrets","凭据：加密存储、按授权注入，不写入配置",GREEN),
           ("Activity","活动审计：变更、心跳、花费、审批留痕",(130,180,255)),
           ("Portability","公司模板：导出导入、密钥脱敏、冲突处理",(130,180,255))]
    x0,y0=60,140; cw,ch=540,104; gx,gy=20,16
    for i,(name,desc,c) in enumerate(items):
        col=i%2; row=i//2
        x=x0+col*(cw+gx); y=y0+row*(ch+gy)
        rr(d,(x,y,x+cw,y+ch),14,fill=PANEL if row%2==0 else PANEL2,outline=LINE,width=1)
        d.ellipse([x+20,y+38,x+40,y+58],fill=c)
        t(d,(x+56,y+18),name,font("Bold",27),WHITE)
        t(d,(x+56,y+58),desc,font("Regular",22),GREY)
    t(d,(60,852),"底层接 Claude Code / Codex / CLI Agent / HTTP webhook bot，Agent 平时休眠、被心跳唤醒",font("Regular",24),GREY)
    img.save(f"{OUT}/architecture-v2.png"); print("architecture-v2.png")

# ---------- 图：Paperclip vs OpenBot vs 裸开终端 ----------
def compare():
    W,H=1200,780; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,42),"三种用法对比",font("Black",40),WHITE)
    cols=[("裸开 20 个终端",RED,["会话互不相通","重启全部丢失","手动凑上下文","跑飞循环烧钱无感知","无审计无预算"]),
          ("OpenBot 类桌面工作台",BLUE,["单机桌面 App","每个 Agent 独立工位","持久队列与互发文件","内置浏览器/Computer Use","偏个人协作"]),
          ("Paperclip 控制平面",TEAL,["服务端 + 仪表盘/手机","组织架构与目标对齐","心跳 7×24 自治","预算硬停 + 审批治理","多用户/多组织/合规"])]
    x0=60; cw=350; gap=25; y0=130
    for i,(name,c,rows) in enumerate(cols):
        x=x0+i*(cw+gap)
        rr(d,(x,y0,x+cw,700),18,fill=PANEL,outline=c,width=3)
        d.rounded_rectangle([x,y0,x+cw,y0+78],radius=18,fill=(tuple(int(v*0.28) for v in BG)))
        t(d,(x+cw/2,y0+40),name,font("Bold",27),c,anchor="mm")
        for j,r in enumerate(rows):
            yy=y0+120+j*78
            d.ellipse([x+26,yy+8,x+44,yy+26],outline=c,width=3)
            t(d,(x+60,yy+22),r,font("Regular",25),(205,219,216),anchor="lm")
    t(d,(60,730),"定位差异：OpenBot 给工程师配电脑，Paperclip 直接开一家公司",font("Medium",25),AMBER)
    img.save(f"{OUT}/compare.png"); print("compare.png")

wechat(); zhihu(); pillars(); arch(); compare(); print("ALL DONE")
