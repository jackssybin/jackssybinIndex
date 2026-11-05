# -*- coding: utf-8 -*-
"""agent-desktop 配图：黑白极简（Vercel 调性）+ 三平台色点缀。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/agent-desktop-computer-use"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(10,10,11); PANEL=(22,22,25); PANEL2=(32,32,37); LINE=(58,58,66)
WHITE=(245,245,247); MUTED=(156,158,166); ACCENT=(88,166,255)   # 蓝
MAC=(90,190,140); WIN=(96,165,250); LIN=(240,180,90); RED=(248,113,113)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,6],fill=WHITE)
    t(d,(110,112),"让 AI 不看截图，直接「读懂」桌面",font("Black",62),WHITE)
    t(d,(112,208),"Vercel Labs 开源 Computer Use CLI：无障碍树 → 带 ref 的 JSON",font("Bold",34),ACCENT)
    pts=[("不是像素猜坐标","读系统无障碍 API，ref 句柄语义定位，无视觉模型、无 token 费用"),
         ("点错不如不做","严格身份解析：过期/歧义直接 STALE_REF 报错，防窗口句柄复用"),
         ("默认无头不抢鼠标","60 命令 + C 库 + MCP server，三平台 AX / UIA / AT-SPI")]
    y=340
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=ACCENT)
        t(d,(150,y),a,font("Bold",34),WHITE); t(d,(150,y+48),b,font("Regular",27),MUTED); y+=122
    rr(d,(1180,150,1490,640),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","15.6K"),("Fork","1.1K"),("语言","Rust"),("代码","35 万行"),("命令","56 个"),("npm 月下载","3.1 万"),("协议","Apache-2.0")]
    yy=198
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",25),MUTED); t(d,(1450,yy),v,font("Bold",27),WHITE,anchor="ra"); yy+=60
    t(d,(112,828),"内部不含模型：它是 Agent 的眼睛和手，观察-决策-验证循环在你自己的 Agent 里",font("Medium",24),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def loop():
    W,H=1200,720; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"核心循环：snapshot → act → verify",font("Black",36),WHITE)
    steps=[("1  observe 快照","读无障碍树\n每个可操作元素\n分配 ref 句柄",ACCENT),
           ("2  act 对 ref 操作","click / type / select…\n无头执行，不动鼠标\n只认带快照限定的 ref",WHITE),
           ("3  verify 再快照","重读界面验证结果\nSTALE_REF 就重新快照\n失败安全，绝不猜",MAC)]
    x=60;cw=350;gap=25;y=170
    for i,(h,b,c) in enumerate(steps):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+300),16,fill=PANEL,outline=LINE,width=2)
        d.rectangle([xx,y,xx+cw,y+6],fill=c)
        t(d,(xx+24,y+28),h,font("Bold",25),c)
        for j,ln in enumerate(b.split("\n")):
            t(d,(xx+24,y+92+j*44),ln,font("Regular",22),(205,207,214))
        if i<2: d.polygon([(xx+cw+3,y+140),(xx+cw+17,y+152),(xx+cw+3,y+164)],fill=MUTED)
    # 回流箭头
    d.line([600,500,600,560],fill=MUTED,width=3)
    d.line([235,560,965,560],fill=MUTED,width=3)
    d.polygon([(235,552),(217,560),(235,568)],fill=MUTED)
    rr(d,(360,580,840,650),14,fill=PANEL2,outline=LINE,width=2)
    t(d,(600,615),"循环住在你的 Agent 里：agent-desktop 本身没有模型，只提供确定性机制",font("Bold",22),WHITE,anchor="mm")
    img.save(f"{OUT}/loop.png"); print("loop.png")

def usage():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"三种接入方式",font("Black",36),WHITE)
    cards=[("CLI","npm i -g agent-desktop",["60 命令名 / 56 操作命令","观察·ref动作·键鼠·窗口","通知·剪贴板·会话","每条输出一个 JSON 信封"],ACCENT),
           ("C 库","libagent_desktop_ffi",["进程内调用，Python ctypes 可接","ABI v7，强制走快照 ref","精确解析路径对 C 关闭","随 release 附动态库"],WIN),
           ("MCP server","agent-desktop mcp（1.2 新增）",["stdio 暴露全部命令为工具","desktop_snapshot / desktop_click…","三行 JSON 接入任意 MCP 客户端","全局 flag 对每次调用生效"],MAC)]
    x=60;cw=350;gap=25;y=140
    for (h,sub,items,c),xx in zip(cards,[x,x+cw+gap,x+2*(cw+gap)]):
        rr(d,(xx,y,xx+cw,y+500),16,fill=PANEL,outline=c,width=2)
        t(d,(xx+24,y+26),h,font("Black",30),c)
        t(d,(xx+24,y+76),sub,font("Bold",19),MUTED)
        yy=y+130
        for it in items:
            d.ellipse([xx+24,yy+8,xx+38,yy+22],outline=c,width=2)
            t(d,(xx+52,yy+15),it,font("Regular",20),(208,210,217),anchor="lm"); yy+=58
    rr(d,(60,672,1140,724),12,fill=PANEL2,outline=LINE,width=1)
    t(d,(84,698),"安全：密钥用 --stdin 走管道不进进程参数；只在 error.disposition.retry=safe 时才重试",font("Bold",21),RED,anchor="lm")
    img.save(f"{OUT}/usage.png"); print("usage.png")

def arch():
    W,H=1200,800; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"Rust 分层架构：一套核心，三个平台适配器",font("Black",33),WHITE)
    # 上层调用方
    rr(d,(120,120,1080,190),14,fill=PANEL2,outline=LINE,width=2)
    t(d,(600,155),"调用方：CLI  ·  C 库 FFI  ·  MCP server（stdio）",font("Bold",24),WHITE,anchor="mm")
    d.line([600,190,600,230],fill=MUTED,width=3)
    # core
    rr(d,(120,230,1080,360),14,fill=PANEL,outline=ACCENT,width=2)
    t(d,(600,262),"agent-desktop-core（平台中立）",font("Black",26),ACCENT,anchor="mm")
    t(d,(600,306),"封闭 role/state 词表 · ref 严格解析 · 证据三态 Known/Absent/Unknown · 窗口身份令牌",font("Regular",21),(210,212,218),anchor="mm")
    t(d,(600,338),"只通过 PlatformAdapter trait 接触操作系统",font("Bold",20),MUTED,anchor="mm")
    # 三平台
    plats=[("macOS 13+","AX API","AXRole + subrole\nretained_object 直引",MAC),
           ("Windows 10 1809+","UI Automation","ControlType + Pattern\nHWND + 创建时间令牌",WIN),
           ("Linux Ubuntu 24.04+","AT-SPI","X11 / Wayland\nclient id + boot-id 限定",LIN)]
    x=120;cw=300;gap=30;y=420
    for (h,api,detail,c),i in zip(plats,range(3)):
        xx=x+i*(cw+gap)
        d.line([600,360,xx+cw/2,y],fill=MUTED,width=2)
        rr(d,(xx,y,xx+cw,y+260),16,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+8,y+260],fill=c)
        t(d,(xx+26,y+26),h,font("Bold",24),c)
        t(d,(xx+26,y+72),api,font("Black",22),WHITE)
        for j,ln in enumerate(detail.split("\n")):
            t(d,(xx+26,y+128+j*40),ln,font("Regular",20),(200,202,210))
    t(d,(60,730),"编译期定平台：每个二进制只连本机 OS 的无障碍 API；适配器禁止自造 token，不认识就报 unknown",font("Medium",22),MUTED,anchor="lm")
    img.save(f"{OUT}/arch.png"); print("arch.png")

zhihu_cover(); loop(); usage(); arch(); print("ALL DONE")
