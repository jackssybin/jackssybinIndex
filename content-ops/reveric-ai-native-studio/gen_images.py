# -*- coding: utf-8 -*-
"""Reveric 配图：文学书房暖调（羊皮纸+墨色+铜金+苔绿），呼应其 DESIGN 反紫渐变纪律。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/reveric-ai-native-studio"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
# 墨色书房暗调
BG=(24,22,20); PANEL=(35,32,29); PANEL2=(47,43,38); LINE=(78,71,62)
PARCH=(232,222,202); GOLD=(198,158,96); GOLDL=(224,196,142); MOSS=(122,162,118); CLAY=(196,122,92)
WHITE=(238,233,224); MUTED=(168,160,146)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,6],fill=GOLD)
    t(d,(110,108),"小说到成片，装进一个本地 App",font("Black",58),WHITE)
    t(d,(112,200),"Reveric 幻界：Agent Native 桌面创作工作台，智能体在你的作品里动手",font("Bold",31),GOLDL)
    pts=[("作品即智能体工作区","本地 SQLite，按需检索整部作品，不用复制小传进对话框"),
         ("五大工作台打通","小说·剧本·无限画布·3D导演台·6轨剪辑，数据全程关联"),
         ("本地优先 + BYOK","Key 自带，直连 OpenAI/Claude/DeepSeek/Seedance，数据不出本机")]
    y=320
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=GOLD)
        t(d,(150,y),a,font("Bold",32),MOSS); t(d,(150,y+46),b,font("Regular",25),MUTED); y += 118
    rr(d,(1180,140,1490,650),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","724"),("Fork","178"),("语言","Dart/Flutter"),("代码","75 万行"),("Dart 文件","2064"),("版本","v0.8.1"),("协议","AGPL-3.0")]
    yy=190
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",23),MUTED); t(d,(1450,yy),v,font("Bold",25),GOLD,anchor="ra"); yy += 60
    t(d,(112,828),"建仓仅半个月的极早期项目 · 智能体受工具审批与规则约束，作者始终是主角",font("Medium",23),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def architecture():
    W,H=1200,780; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"本地优先 + Agent Native：数据和智能体都在你设备上",font("Black",31),WHITE)
    # 上层：智能体
    rr(d,(60,110,1140,210),14,fill=PANEL2,outline=MOSS,width=2)
    t(d,(600,142),"智能体层：Chat Orchestrator 主编排 → 子智能体委派",font("Bold",23),MOSS,anchor="mm")
    t(d,(600,178),"工具调度 · 操作审批 tool_approval · 循环检测 · hook 验证 · token 预算",font("Regular",19),MUTED,anchor="mm")
    d.line([600,210,600,248],fill=MUTED,width=2)
    # 中层：五大模块
    mods=[("小说",GOLD),("剧本",GOLDL),("无限画布",MOSS),("3D 导演台",CLAY),("6 轨剪辑",GOLD)]
    bw=200;gap=15;x=60;y=248
    for i,(h,c) in enumerate(mods):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+96),12,fill=PANEL,outline=c,width=2)
        t(d,(xx+bw/2,y+48),h,font("Bold",21),c,anchor="mm")
    d.line([600,344,600,382],fill=MUTED,width=2)
    # 下层：本地数据
    rr(d,(60,382,700,560),14,fill=PANEL,outline=LINE,width=2)
    t(d,(88,408),"本地数据层（不出本机）",font("Bold",22),GOLDL)
    for j,s in enumerate(["SQLite + drift 持久化","章节/人物/势力/伏笔/地图","实体关系图谱（关系演变）","历史版本快照 · 软删除"]):
        t(d,(88,452+j*32),"· "+s,font("Regular",18),(208,201,188))
    rr(d,(740,382,1140,560),14,fill=PANEL,outline=LINE,width=2)
    t(d,(768,408),"模型层（BYOK，你自己的 Key）",font("Bold",22),GOLDL)
    for j,s in enumerate(["OpenAI · Anthropic · Gemini","DeepSeek · 智谱 · 通义 · Kimi","Seedance/Seedream · H3","Ollama/OneAPI 等自建网关"]):
        t(d,(768,452+j*32),"· "+s,font("Regular",18),(208,201,188))
    rr(d,(60,592,1140,672),12,fill=PANEL2,outline=MOSS,width=1)
    t(d,(600,632),"智能体不只是聊天：直接在编辑器、画布、导演台、剪辑台里读写操作，敏感动作需人工审批",font("Bold",20),MOSS,anchor="mm")
    t(d,(60,712),"本地优先守住数据主权，BYOK 守住模型自由——不锁供应商，也不托管你的作品",font("Medium",21),MUTED)
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def pipeline():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"从小说到成片：五个工作台一条生产线",font("Black",32),WHITE)
    steps=[("小说创作","大纲/章节/自动保存\n多维设定库+关系图谱\n智能体核验连续性",GOLD),
           ("剧本改编","影视标准排版\n左原著右剧本对照\n拆剧集写台词动作",GOLDL),
           ("无限画布","节点式分镜铺展\n定妆/参考图/音视频\n智能体批量生素材",MOSS),
           ("3D 导演台","空间布景与站位\n机位运镜时间轴预演\n抽帧给视频模型参考",CLAY),
           ("多轨剪辑","6 轨时间线\n分割/波纹删除/吸附\n直接导出成片",GOLD)]
    bw=206;gap=14;x=60;y=150;bh=340
    for i,(h,b,c) in enumerate(steps):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+bw/2,y+36),h,font("Bold",22),c,anchor="mm")
        lines=b.split("\n")
        yy = y+92
        for ln in lines:
            t(d,(xx+18,yy),ln,font("Regular",17),(208,201,188)); yy += 40
        if i<4:
            t(d,(xx+bw+gap-2,y+bh/2),"→",font("Bold",22),MUTED,anchor="mm")
    rr(d,(60,530,1140,610),12,fill=PANEL2,outline=GOLD,width=1)
    t(d,(600,570),"每个工作台的数据全程关联：人物、设定、分镜、素材在同一个作品工作区，不散落本地文件夹",font("Bold",20),GOLD,anchor="mm")
    t(d,(60,660),"作者负责节奏、取舍与定稿；智能体负责检索、扩写、拆分镜、生成素材、自动上轨",font("Medium",21),MUTED)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def plugin():
    W,H=1200,760; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"插件系统：主程序 AGPL，SDK 单独 MIT",font("Black",32),WHITE)
    # 左：插件
    rr(d,(60,120,560,560),14,fill=PANEL,outline=MOSS,width=2)
    t(d,(88,148),"插件（TypeScript）",font("Bold",24),MOSS)
    items=["内置：memory / web / deepseek","第三方走同一构建管线","打包成 IIFE，挂全局 __revericPlugin","每插件独立 context，共用一个 JS 运行时","支持 GitHub 技能安装（带 hash 校验）","ZIP 导入做归档校验"]
    yy=200
    for it in items:
        d.ellipse([88,yy+9,102,yy+23],outline=MOSS,width=2)
        t(d,(116,yy+16),it,font("Regular",19),(210,204,192),anchor="lm"); yy += 56
    # 右：宿主
    rr(d,(620,120,1140,560),14,fill=PANEL,outline=GOLD,width=2)
    t(d,(648,148),"宿主（Dart/Flutter）",font("Bold",24),GOLD)
    items2=["host.dart：API 分发 + 权限检查","runtime.dart：调用与时限控制","package_archive：ZIP 导入校验","schema 自动生成 TS/Dart/Rust/JS 四套类型","reveric-plugin-sdk 以 MIT 独立发布","降低第三方开发者的许可顾虑"]
    yy=200
    for it in items2:
        d.ellipse([648,yy+9,662,yy+23],outline=GOLD,width=2)
        t(d,(676,yy+16),it,font("Regular",19),(210,204,192),anchor="lm"); yy += 56
    rr(d,(60,600,1140,690),12,fill=PANEL2,outline=CLAY,width=1)
    t(d,(88,632),"边界提醒：仅插件 SDK 是 MIT，主程序仍是 AGPL-3.0；基于主程序做 SaaS 或闭源商用需商业授权",font("Bold",19),CLAY,anchor="lm")
    t(d,(88,664),"项目建仓仅半个月、v0.8.x，schema 与 API 仍在快速迭代，生产使用先小范围验证并勤备份",font("Regular",18),MUTED,anchor="lm")
    img.save(f"{OUT}/plugin.png"); print("plugin.png")

zhihu_cover(); architecture(); pipeline(); plugin(); print("ALL DONE")
