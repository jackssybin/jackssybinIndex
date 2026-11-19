# -*- coding: utf-8 -*-
"""Concat 配图：专业剪辑软件深色风（石墨黑底 + 品牌蓝 + 青 + 紫 + 琥珀），呼应视频编辑器 UI。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/concat-video-editor"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

BG=(16,18,24); PANEL=(26,30,40); PANEL2=(36,42,56); LINE=(58,66,86)
BLUE=(66,140,255); CYAN=(58,200,214); PURPLE=(168,120,240); AMBER=(245,184,88)
ROSE=(240,118,128); LIME=(138,220,152); WHITE=(232,238,248); MUTED=(148,158,178)

def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,8],fill=BLUE)
    t(d,(110,92),"不联网、不登录、无水印的开源剪辑软件",font("Black",48),WHITE)
    t(d,(110,170),"Concat：Rust 写的本地优先视频编辑器，内置 MCP 让 AI 直接帮你剪片",font("Bold",25),LBLUE if False else (150,180,255))
    pts=[("18.9 万行 Rust，18 个 crate 一个 workspace","Slint 界面 + FFmpeg 7 引擎，276 个源文件、187 个测试文件"),
         ("22 个 AI 模型全部本地跑","自动字幕、TTS 声音克隆、抠像、人声分离，下载一次离线可用"),
         ("内置 MCP 服务器，AI Agent 也能剪","JSON-RPC/gRPC 接口，Claude 一行命令接入做脚本化剪辑")]
    y=288
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=CYAN)
        t(d,(150,y),a,font("Bold",25),CYAN)
        t(d,(150,y+38),b,font("Regular",20),MUTED)
        y+=104
    rr(d,(1150,140,1490,690),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","1.87 万"),("Fork","2282"),("语言","Rust"),("代码行","18.9 万"),
          ("AI 模型","22 个"),("语言/平台","26 / 5"),("协议","AGPL-3.0")]
    yy=182
    for k,v in rows:
        t(d,(1185,yy),k,font("Regular",21),MUTED)
        t(d,(1455,yy),v,font("Bold",20),AMBER,anchor="ra")
        yy+=64
    t(d,(112,828),"基于 2026-11-19 仓库源码实测 · 建仓仅 3 个月的 beta 项目，版本 v0.2.x",font("Medium",19),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def architecture():
    W,H=1200,780
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,34),"18 个 crate：一个 Cargo workspace 的分层架构",font("Black",28),WHITE)
    cards=[
        ("界面层",["concat 主程序 4.4 万行","Slint + Skia GPU 渲染","桌面/Android 同源 UI","26 语言本地化"],BLUE),
        ("引擎层",["core 核心数据模型","media 解码 1.67 万行","render GPU 合成器","effects 百种特效"],CYAN),
        ("能力层",["vision 抠像/超分","speech TTS/声音克隆","text 字幕/标题","project 工程 2 万行"],PURPLE),
        ("自动化层",["mcp MCP 服务器","api JSON-RPC 接口","server/gRPC/CLI","export 4K 导出"],AMBER),
    ]
    bw,bh=252,440; gap=18; x,y=60,120
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+bw/2,y+38),h,font("Bold",21),c,anchor="mm")
        yy=y+92
        for it in items:
            t(d,(xx+18,yy),"· "+it,font("Regular",16),(206,214,228))
            yy+=56
    rr(d,(60,600,1140,700),12,fill=PANEL2,outline=BLUE,width=1)
    t(d,(88,630),"276 个 Rust 源文件、18.9 万行，单一 workspace 管理；引擎与界面解耦，无窗口也能 headless 跑渲染，",font("Bold",18),BLUE,anchor="lm")
    t(d,(88,664),"GPU 合成器是可选 feature，纯引擎任务不承担这块编译重量",font("Regular",18),MUTED,anchor="lm")
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def local_ai():
    W,H=1200,800
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,32),"22 个模型全在本地：你的素材从不上传",font("Black",28),WHITE)
    cards=[
        ("智能抠像",["RVM 人物分割","ISNet 通用物体","SAM 笔刷手绘蒙版","Real-ESRGAN 超分"],CYAN),
        ("语音与配音",["Chatterbox 本地 TTS","几秒录音克隆声音","Kokoro 桌面语音库","手机端系统语音"],PURPLE),
        ("字幕与音频",["Whisper 自动转写","Spleeter 人声分离","一键降噪/响度均衡","花栗鼠/电话等音效"],BLUE),
        ("供应链安全",["模型不打进安装包","首次用时按需下载","sha256 校验拒无摘要","HF 源锁定 commit"],AMBER),
    ]
    bw,bh=252,470; gap=18; x,y=60,118
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+18,y+28),h,font("Bold",19),c)
        yy=y+84
        for it in items:
            t(d,(xx+18,yy),"· "+it,font("Regular",16),(208,216,230))
            yy+=58
    rr(d,(60,628,1140,720),12,fill=PANEL2,outline=LIME,width=1)
    t(d,(88,658),"模型清单 manifest.toml 全部镜像到仓库自己的 release，upstream 仅作回退，保证字节经过测试且长期可达；",font("Bold",18),LIME,anchor="lm")
    t(d,(88,692),"网络只在你主动检查版本/下载模型时发生，剪辑本身完全离线，footage 不出本机磁盘",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/local-ai.png"); print("local-ai.png")

def mcp():
    W,H=1200,760
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,34),"内置 MCP：让 AI Agent 像人一样操作时间线",font("Black",27),WHITE)
    # 左：接入
    rr(d,(60,116,560,600),14,fill=PANEL,outline=BLUE,width=2)
    t(d,(88,144),"一行接入",font("Bold",22),BLUE)
    left=["claude mcp add concat -- concat --mcp","窗口模式 window：更安全，不覆盖你在剪的工程","无头模式 headless：独立引擎，无需开界面","工程锁 concat.lock 防双写冲突","文件只允许写在家目录（可配白名单）","支持 JSON-RPC，源码编译再加 gRPC/CLI"]
    yy=200
    for it in left:
        d.ellipse([88,yy+8,104,yy+24],outline=BLUE,width=2)
        t(d,(120,yy+16),it,font("Regular",17),(210,218,232),anchor="lm")
        yy+=60
    # 右：能力
    rr(d,(620,116,1140,600),14,fill=PANEL,outline=PURPLE,width=2)
    t(d,(648,144),"Agent 可调用的工具",font("Bold",22),PURPLE)
    right=["工程：创建/打开/保存/关闭","读取：timeline_read 看时间线","素材：probe 探测、import 导入","剪辑：分割/修剪/移动/变速/冻结帧","字幕标题：captions_add、title_add","关键帧特效：keyframe_set、effect","导出：export_start/status/wait 带进度"]
    yy=200
    for it in right:
        d.ellipse([648,yy+8,664,yy+24],outline=PURPLE,width=2)
        t(d,(680,yy+16),it,font("Regular",17),(220,214,232),anchor="lm")
        yy+=54
    rr(d,(60,636,1140,700),12,fill=PANEL2,outline=CYAN,width=1)
    t(d,(88,668),"参数 schema 由 API 类型自动生成，Agent 拿到的约束和引擎完全一致，不会出现文档与实现漂移",font("Bold",18),CYAN,anchor="lm")
    img.save(f"{OUT}/mcp.png"); print("mcp.png")

def limits():
    W,H=1200,780
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,34),"上手前看清：beta 项目的能与边界",font("Black",28),WHITE)
    rr(d,(60,116,580,580),14,fill=PANEL,outline=LIME,width=2)
    t(d,(88,144),"它的难得之处",font("Bold",24),LIME)
    good=["完全免费、无水印、无账号、无订阅","素材不出本机，隐私模型彻底本地","跨 5 平台、26 语言、工程文件通用","开源可审计，CI 构建+测试后才发布","专业能力齐全：多轨/关键帧/4K 60","MCP 让自动化剪辑成为一等公民"]
    yy=200
    for it in good:
        d.ellipse([88,yy+8,104,yy+24],outline=LIME,width=2)
        t(d,(120,yy+16),it,font("Regular",19),(210,222,214),anchor="lm")
        yy+=58
    rr(d,(620,116,1140,580),14,fill=PANEL,outline=ROSE,width=2)
    t(d,(648,144),"要知道的边界",font("Bold",24),ROSE)
    bad=["仍是 beta（v0.2.x），边缘情况不少","Windows 未签名，SmartScreen 会告警","ARM 版 Windows 暂停，iOS 需侧载","本地 AI 吃算力，低配机跑模型吃力","AGPL-3.0 强 copyleft，闭源商用要授权","3 个月新项目，长期稳定性待观察"]
    yy=200
    for it in bad:
        d.ellipse([648,yy+8,664,yy+24],outline=ROSE,width=2)
        t(d,(680,yy+16),it,font("Regular",19),(228,214,216),anchor="lm")
        yy+=58
    rr(d,(60,616,1140,720),12,fill=PANEL2,outline=AMBER,width=1)
    t(d,(88,646),"AGPL-3.0-or-later 意味着网络服务形态的二次开发也要开源；闭源集成可联系作者买商业授权（LICENSING.md）。",font("Bold",18),AMBER,anchor="lm")
    t(d,(88,682),"它对标并想替代的是付费剪辑软件的订阅模式，但生产环境重度使用前建议先在非关键项目充分测试",font("Bold",18),BLUE,anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover(); architecture(); local_ai(); mcp(); limits()
print("ALL DONE")
