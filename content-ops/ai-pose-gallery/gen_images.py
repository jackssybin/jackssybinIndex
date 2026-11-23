#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
anhao/ai-pose-gallery-zh 三端推广配图
画廊紫 + 画布米白风格（区别于墨绿学院/青蓝职场）
01 五位一体架构（同一套静态资产被5个消费端复用）
02 三库实测数据规模（核验口径，纠正 README 重复计数）
03 三种使用姿势（Web 合成台 / ComfyUI 节点 / Agent 技能）
04 合规边界与适用判断（SFW、版权、谁该用谁缓行）
严格 yy += 游标、手动语义断行、先画底再写字、Noto Sans CJK。
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FM = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Medium.ttc"
def F(s, w="b"):
    return ImageFont.truetype({"b": FB, "m": FM, "r": FR}[w], s)

PAPER=(245,243,248); CARD=(255,255,255)
INK=(36,32,48); INK2=(82,78,96); GREY=(140,138,150); LINE=(226,223,235)
PURPLE=(108,72,178); PURPLEBG=(238,233,249)
VIOLET=(148,86,178); VIOLETBG=(246,235,249)
BLUE=(46,104,178); BLUEBG=(233,241,251)
GOLD=(190,134,44); GOLDBG=(250,242,224)
RED=(176,74,70); REDBG=(249,234,233)
TEAL=(38,128,120); TEALBG=(229,243,241)

def make(w,h):
    img=Image.new("RGB",(w,h),PAPER); return img,ImageDraw.Draw(img)
def rrect(d,box,fill,outline=None,w=2):
    d.rounded_rectangle(box,radius=16,fill=fill,outline=outline,width=w)
def title(d,w,main,sub,accent=PURPLE):
    d.rectangle([0,0,w,134],fill=INK); d.rectangle([0,134,w,140],fill=accent)
    d.text((56,32),main,font=F(38),fill=(245,243,248))
    d.text((56,90),sub,font=F(23,"r"),fill=(196,192,210))

# ===== 图1：五位一体架构 =====
def fig1():
    w,h=1280,980
    img,d=make(w,h)
    title(d,w,"一套静态资产，五个消费端复用","data 里的中文 JSON 与 img 图片是唯一数据源，上层各自取用、互不依赖")
    # 底层：数据源
    rrect(d,[56,760,1224,900],INK,INK)
    d.text((90,786),"统一数据源（仓库内静态资产）",font=F(28),fill=(220,214,238))
    d.text((90,836),"data/*.json 全中文索引   +   img/ thumbs/ 本地高清图与缩略图",font=F(23,"r"),fill=(190,186,206))
    d.text((90,872),"i18n 构建流水线：translations.csv 日译中 → apply_translation.py 可重跑",font=F(21,"r"),fill=(150,146,168))
    # 五个消费端
    cons=[
        ("Web 合成台","React19+Vite8\n人像服装姿势三槽位",PURPLE,PURPLEBG),
        ("边缘代理","Cloudflare\n/api/proxy 解跨域",BLUE,BLUEBG),
        ("ComfyUI 插件","4 个自定义节点\n直出 IMAGE 张量",TEAL,TEALBG),
        ("Agent 技能","9 个 SKILL.md\n软链即可被调用",VIOLET,VIOLETBG),
        ("离线数据集","纯静态可下载\n1.2GB 自托管",GOLD,GOLDBG),
    ]
    cw,gap=218,18
    x0,y0,ch=56,200,300
    for i,(head,desc,col,bg) in enumerate(cons):
        x=x0+i*(cw+gap)
        rrect(d,[x,y0,x+cw,y0+ch],bg,col)
        d.rounded_rectangle([x,y0,x+cw,y0+70],radius=16,fill=col)
        d.rectangle([x,y0+40,x+cw,y0+70],fill=col)
        d.text((x+cw//2,y0+35),head,font=F(23),fill=(255,255,255),anchor="mm")
        l1,l2=desc.split("\n")
        d.text((x+18,y0+110),l1,font=F(21,"r"),fill=INK2)
        d.text((x+18,y0+148),l2,font=F(21,"r"),fill=INK2)
        # 连接线到底层
        d.line([x+cw//2,y0+ch,x+cw//2,760],fill=GREY,width=2)
    d.text((w//2,730),"同一套 data + img，五种用法",font=F(22,"m"),fill=GREY,anchor="mm")
    img.save(os.path.join(OUT,"01-architecture.png")); print("01-architecture.png")

# ===== 图2：三库实测数据（核验口径）=====
def fig2():
    w,h=1280,1040
    img,d=make(w,h)
    title(d,w,"实测数据规模：我逐个 JSON 和图片目录数过","下表是本地克隆核验口径，不照抄 README 的合计数字")
    rows=[
        ("姿势库（白模+深度图）","1,439 条","白模 PNG 1439 + 深度图 1439",PURPLE,PURPLEBG),
        ("服装·ギア写实","1,407 条","8 大穿搭分类，缩略+原图",BLUE,BLUEBG),
        ("服装·中国历代 Shisei","57 套 / 227 视角","商至清代，多视角",TEAL,TEALBG),
        ("服装·ギア动漫","1,320 条","原站热链，仓库不存图",VIOLET,VIOLETBG),
        ("服装·二次元 CharaDB","440 套","仅元数据，联网加载",GOLD,GOLDBG),
        ("人像库","1,499 位","正脸893+氛围606，1600×2000",RED,REDBG),
    ]
    y0,rh,gap=176,108,12
    d.text((90,y0-44),"图库",font=F(24,"b"),fill=GREY)
    d.text((560,y0-44),"记录数（实测）",font=F(24,"b"),fill=GREY)
    d.text((840,y0-44),"备注",font=F(24,"b"),fill=GREY)
    for i,(name,num,note,col,bg) in enumerate(rows):
        y=y0+i*(rh+gap)
        rrect(d,[56,y,1224,y+rh],bg,col)
        d.text((84,y+rh//2),name,font=F(24,"b"),fill=INK,anchor="lm")
        d.text((560,y+rh//2),num,font=F(26,"b"),fill=col,anchor="lm")
        d.text((840,y+rh//2),note,font=F(20,"r"),fill=INK2,anchor="lm")
    # 底部核验提示
    rrect(d,[56,906,1224,990],GOLDBG,GOLD)
    d.text((84,924),"核验提醒：README 顶部称 12,022 张，是把缩略图和原图重复相加；",font=F(23,"m"),fill=GOLD)
    d.text((84,958),"实测 img/ 与 thumbs/ 各 6,011 张，去重后原图约 6,011 张，引用数据请用此口径。",font=F(23,"m"),fill=GOLD)
    img.save(os.path.join(OUT,"02-data-scale.png")); print("02-data-scale.png")

# ===== 图3：三种使用姿势 =====
def fig3():
    w,h=1280,1000
    img,d=make(w,h)
    title(d,w,"同一个仓库，三种上手姿势","按你的工具链选，从最简单到最深度")
    cards=[
        ("①  在线 / 本地网页","零安装，浏览器直接用",
         ("打开在线演示或 pnpm dev","三槽位选 人像+服装+姿势","选 12 种画风、自动组 Prompt","五大 AI 协议直连出图"),PURPLE,PURPLEBG),
        ("②  ComfyUI 原生节点","接入专业出图工作流",
         ("clone 到 custom_nodes 目录","右键新增 4 个画廊节点","可视化弹窗选 6162 条素材","深度图直连 ControlNet"),TEAL,TEALBG),
        ("③  Agent 技能调用","让 AI 替你检索素材",
         ("9 个 SKILL.md 软链入 skills","Agent 按分类/视角/发型检索","返回图路径与中英文描述","适合自动化批量生产"),VIOLET,VIOLETBG),
    ]
    cw,gap=372,24
    x0,y0,ch=56,186,620
    for i,(head,sub,lines,col,bg) in enumerate(cards):
        x=x0+i*(cw+gap)
        rrect(d,[x,y0,x+cw,y0+ch],CARD,col)
        d.rounded_rectangle([x,y0,x+cw,y0+104],radius=16,fill=col)
        d.rectangle([x,y0+60,x+cw,y0+104],fill=col)
        d.text((x+24,y0+24),head,font=F(26),fill=(255,255,255))
        d.text((x+24,y0+66),sub,font=F(20,"r"),fill=(235,232,245))
        yy=y0+140
        for ln in lines:
            d.ellipse([x+26,yy+10,x+40,yy+24],fill=col)
            d.text((x+56,yy),ln,font=F(22,"r"),fill=INK2)
            yy+=58
        # 底部命令提示
        if i==1:
            rrect(d,[x+20,y0+ch-86,x+cw-20,y0+ch-24],TEALBG,TEAL,1)
            d.text((x+36,y0+ch-68),"git clone 到 custom_nodes",font=F(19,"m"),fill=TEAL,anchor="lm")
        elif i==2:
            rrect(d,[x+20,y0+ch-86,x+cw-20,y0+ch-24],VIOLETBG,VIOLET,1)
            d.text((x+36,y0+ch-68),"ln -s 软链到 ~/.claude/skills",font=F(19,"m"),fill=VIOLET,anchor="lm")
        else:
            rrect(d,[x+20,y0+ch-86,x+cw-20,y0+ch-24],PURPLEBG,PURPLE,1)
            d.text((x+36,y0+ch-68),"pnpm install && pnpm dev",font=F(19,"m"),fill=PURPLE,anchor="lm")
    img.save(os.path.join(OUT,"03-three-usage.png")); print("03-three-usage.png")

# ===== 图4：合规边界与适用判断 =====
def fig4():
    w,h=1280,1020
    img,d=make(w,h)
    title(d,w,"先用之前，这几条合规边界要清楚","它默认 SFW 安全模式，且图片版权和代码协议不是一回事")
    # 左：适合
    rrect(d,[56,178,620,560],TEALBG,TEAL)
    d.rounded_rectangle([56,178,620,244],radius=16,fill=TEAL)
    d.rectangle([56,220,620,244],fill=TEAL)
    d.text((84,190),"适合谁",font=F(30),fill=(255,255,255))
    yy=286
    for t in ["要稳定中文参考素材的 AI 绘画创作者","做角色一致性、需要可控姿势与服装",
              "进阶用户：接 ComfyUI + ControlNet","想研究一体化架构的前端/独立开发者",
              "需要离线、可自托管素材库的团队"]:
        d.ellipse([88,yy+10,102,yy+24],fill=TEAL)
        d.text((118,yy),t,font=F(22,"r"),fill=INK2); yy+=50
    # 右：缓行/风险
    rrect(d,[660,178,1224,560],REDBG,RED)
    d.rounded_rectangle([660,178,1224,244],radius=16,fill=RED)
    d.rectangle([660,220,1224,244],fill=RED)
    d.text((688,190),"谁要缓一缓",font=F(30),fill=(255,255,255))
    yy=286
    for t in ["未成年人：含 18+ 素体，默认 SFW 屏蔽","只想在线轻用、介意 1.2GB 体积",
              "有商业用途：图片不被 MIT 覆盖","禁止打包倒卖图库、未授权真人换脸",
              "商用需自行联系原作者取得授权"]:
        d.ellipse([692,yy+10,706,yy+24],fill=RED)
        d.text((722,yy),t,font=F(22,"r"),fill=INK2); yy+=50
    # 底部：三层版权事实
    rrect(d,[56,596,1224,930],CARD,PURPLE)
    d.text((84,620),"三条必须知道的版权与安全事实",font=F(28,"b"),fill=PURPLE)
    facts=[
        ("代码 MIT，图片不覆盖","src/comfyui_plugin/scripts 开源，但 img/data 版权归原作者"),
        ("原作者署名","姿势服装人像源自 ギア（@giaaibusi），二次元服装源自 たき AI（CharaDB）"),
        ("默认 SFW + 纯前端","安全模式默认开启隐藏 NSFW；工具不收集上传图，责任在使用者"),
    ]
    yy=680
    for i,(a,b) in enumerate(facts):
        rrect(d,[84,yy,1196,yy+66],PURPLEBG,PURPLE,1)
        d.text((108,yy+33),f"{i+1}. {a}",font=F(23,"b"),fill=PURPLE,anchor="lm")
        d.text((470,yy+33),b,font=F(21,"r"),fill=INK2,anchor="lm")
        yy+=78
    rrect(d,[56,956,1224,1004],GOLDBG,GOLD)
    d.text((84,968),"一句话：个人学习与合法创作可放心用，任何商用或涉及真人肖像的动作都要先解决授权。",font=F(22,"m"),fill=GOLD,anchor="lm")
    img.save(os.path.join(OUT,"04-compliance-verdict.png")); print("04-compliance-verdict.png")

if __name__=="__main__":
    fig1(); fig2(); fig3(); fig4()
    print("ALL DONE ->",OUT)
