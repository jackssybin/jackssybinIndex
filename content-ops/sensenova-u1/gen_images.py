#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenSenseNova/SenseNova-U1 三端推广配图
深空蓝 + 电光青科技风（区别于画廊紫/学院墨绿/职场青蓝）
01 拼接派 vs 原生统一派 架构对照
02 8B-MoT 真实参数拆解（17.552B，理解/生成/共享）
03 U1/U1.5/U1.6 三代演进时间线
04 本地部署矩阵（显存/磁盘/量化选型/谁该用）
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

# 深空蓝底
BG=(15,22,38); CARD=(24,34,56); INK=(232,238,248); INK2=(158,172,196); GREY=(110,124,148)
LINE=(48,62,88)
CYAN=(56,205,226); CYANBG=(18,46,60)
BLUE=(88,148,240); BLUEBG=(22,40,68)
PURPLE=(168,124,240); PURPLEBG=(44,32,66)
GOLD=(236,182,96); GOLDBG=(58,46,24)
GREEN=(72,200,148); GREENBG=(18,52,44)
RED=(236,110,104); REDBG=(60,28,30)

def make(w,h):
    img=Image.new("RGB",(w,h),BG); return img,ImageDraw.Draw(img)
def rrect(d,box,fill,outline=None,w=2):
    d.rounded_rectangle(box,radius=16,fill=fill,outline=outline,width=w)
def title(d,w,main,sub,accent=CYAN):
    d.rectangle([0,0,w,134],fill=(10,16,28)); d.rectangle([0,134,w,140],fill=accent)
    d.text((56,32),main,font=F(38),fill=INK)
    d.text((56,90),sub,font=F(23,"r"),fill=GREY)

# ===== 图1：拼接 vs 原生统一 =====
def fig1():
    w,h=1280,1000
    img,d=make(w,h)
    title(d,w,"两条多模态路线：模块拼接 vs 原生统一","看懂 SenseNova-U，先看懂它反对的那种架构")
    # 左：拼接派
    rrect(d,[56,180,618,820],CARD,RED)
    d.rounded_rectangle([56,180,618,246],radius=16,fill=RED)
    d.rectangle([56,222,618,246],fill=RED)
    d.text((84,192),"传统拼接派",font=F(30),fill=(255,255,255))
    blocks=[("视觉编码器","负责看图理解",REDBG,RED),
            ("LLM 大脑","语言推理中枢",REDBG,RED),
            ("VAE + 扩散/流匹配","负责画图生成",REDBG,RED)]
    yy=290
    for name,desc,bg,col in blocks:
        rrect(d,[88,yy,586,yy+104],bg,col)
        d.text((116,yy+22),name,font=F(25,"b"),fill=INK)
        d.text((116,yy+62),desc,font=F(20,"r"),fill=INK2)
        if yy<480:
            d.text((337,yy+106),"↕ 胶水连接",font=F(18,"r"),fill=GREY,anchor="mm")
        yy+=140
    d.text((84,740),"问题：多模块多套依赖，占显存",font=F(20,"r"),fill=RED)
    d.text((84,774),"理解与生成难联合优化、难交错",font=F(20,"r"),fill=RED)
    # 右：原生统一
    rrect(d,[662,180,1224,820],CARD,CYAN)
    d.rounded_rectangle([662,180,1224,246],radius=16,fill=CYAN)
    d.rectangle([662,222,1224,246],fill=CYAN)
    d.text((690,192),"NEO-unify 原生统一",font=F(30),fill=(10,20,30))
    # 一个大模型框
    rrect(d,[694,290,1192,560],CYANBG,CYAN)
    d.text((943,330),"一个模型",font=F(28,"b"),fill=CYAN,anchor="mm")
    d.text((943,382),"理解专家 + 生成专家共存",font=F(21,"r"),fill=INK,anchor="mm")
    d.text((943,424),"共享 embedding / lm_head",font=F(21,"r"),fill=INK,anchor="mm")
    d.text((943,478),"无独立视觉编码器、无 VAE",font=F(21,"m"),fill=GOLD,anchor="mm")
    # 四种能力
    caps=["看懂图像（理解）","文生图 / 图像编辑","图文交错输出","生成后自我修正"]
    yy=600
    for c in caps:
        d.ellipse([696,yy+8,710,yy+22],fill=CYAN)
        d.text((726,yy),c,font=F(22,"r"),fill=INK)
        yy+=50
    d.text((694,812-40),"同一套权重端到端优化，单卡可部署",font=F(20,"m"),fill=CYAN)
    img.save(os.path.join(OUT,"01-architecture-compare.png")); print("01-architecture-compare.png")

# ===== 图2：17.552B 参数拆解 =====
def fig2():
    w,h=1280,980
    img,d=make(w,h)
    title(d,w,"“8B-MoT” 到底多少参数？拆给你看","名字是 8B，实际总参数 17.552B——8B 指的是每条通路")
    # 三个分组条
    groups=[
        ("生成 transformer","8.186B","46.64%",BLUE,BLUEBG),
        ("理解 transformer","8.121B","46.27%",CYAN,CYANBG),
        ("共享嵌入与输出层","1.245B","7.09%",GOLD,GOLDBG),
    ]
    y0,bar_x,bar_w,rh,gap=200,400,680,120,28
    maxpct=46.64
    for i,(name,num,pct,col,bg) in enumerate(groups):
        y=y0+i*(rh+gap)
        d.text((70,y+18),name,font=F(23,"b"),fill=INK)
        d.text((70,y+62),num+" 参数",font=F(20,"r"),fill=col)
        # 比例条（标签放到条右侧，避免填充块压住文字）
        rrect(d,[bar_x,y+20,bar_x+bar_w,y+92],CARD,LINE,1)
        fw=int(bar_w*(float(pct.strip('%'))/maxpct))
        rrect(d,[bar_x,y+20,bar_x+fw,y+92],bg,col,2)
        d.text((bar_x+bar_w+12,y+56),pct,font=F(24,"b"),fill=col,anchor="lm")
    # 底部结论卡
    rrect(d,[56,640,1224,760],PURPLEBG,PURPLE)
    d.text((84,664),"MoT = Mixture-of-Transformers：理解/生成两套专家按任务切换",font=F(24,"b"),fill=PURPLE)
    d.text((84,708),"共享层即 embedding 与 lm_head；按通路：理解 9.366B、生成 9.431B（共享被两边各计一次）",font=F(20,"r"),fill=INK2)
    # 显存提示
    rrect(d,[56,792,1224,900],CYANBG,CYAN)
    d.text((84,814),"bf16 全量权重约 35.1GB 显存占用",font=F(23,"b"),fill=CYAN)
    d.text((84,854),"所以官方提供 FP8 / INT8 / GGUF(Q4_0·Q6_K·Q8_0) 量化，把门槛压到单卡 24GB",font=F(20,"r"),fill=INK2)
    img.save(os.path.join(OUT,"02-parameter-breakdown.png")); print("02-parameter-breakdown.png")

# ===== 图3：三代演进时间线 =====
def fig3():
    w,h=1280,960
    img,d=make(w,h)
    title(d,w,"U1 → U1.5 → U1.6：原生统一怎么一步步迭代","三代共用 NEO-unify 8B-MoT 底座，能力逐代补全")
    # 中轴线
    d.line([110,250,110,820],fill=LINE,width=4)
    nodes=[
        ("U1","2026 上半年","首次实现同模型理解+生成；\n8B / A3B、图文交错权重",BLUE,BLUEBG),
        ("U1.5","2026-08","去掉独立视觉编码器与 VAE；\n空间连续重建、原生 4K、文字渲染",CYAN,CYANBG),
        ("U1.6","2026-11-24","美学提升、原生自修正；\n4步/8步蒸馏，ComfyUI 上线",GOLD,GOLDBG),
    ]
    yy=250
    for ver,date,desc,col,bg in nodes:
        d.ellipse([92,yy,128,yy+36],fill=col)
        rrect(d,[170,yy-18,1224,yy+160],bg,col)
        d.text((200,yy+2),ver,font=F(30,"b"),fill=col)
        d.text((420,yy+10),date,font=F(22,"m"),fill=GREY)
        l1,l2=desc.split("\n")
        d.text((200,yy+58),l1,font=F(22,"r"),fill=INK)
        d.text((200,yy+98),l2,font=F(22,"r"),fill=INK2)
        yy+=210
    # 底部 U1.6 量化亮点
    rrect(d,[56,852,1224,918],GREENBG,GREEN)
    d.text((84,870),"U1.6 实测亮点：综合美感较 U1.5 +10%，信息图自修正较单次生成平均 +7%",font=F(22,"m"),fill=GREEN)
    img.save(os.path.join(OUT,"03-version-timeline.png")); print("03-version-timeline.png")

# ===== 图4：部署矩阵与适用判断 =====
def fig4():
    w,h=1280,1060
    img,d=make(w,h)
    title(d,w,"本地部署怎么选：显存、量化与适用人群","先看硬件预算，再选权重形态，别一上来就下 35GB 原版")
    # 上：权重选型表
    rows=[
        ("BF16 原版分片","效果最全","约 35GB 显存 / 35GB 磁盘",BLUE,BLUEBG),
        ("Native FP8 / INT8","W8A8 量化，省显存","单卡 24GB balanced 可跑",CYAN,CYANBG),
        ("GGUF Q4_0/Q6_K/Q8_0","llama.cpp 生态友好","显存更紧时的本地方案",PURPLE,PURPLEBG),
        ("LoRA 4步/8步","少步加速、配基座用","出图更快，V2 改善色彩",GOLD,GOLDBG),
    ]
    y0,rh,gap=178,96,12
    d.text((76,y0-42),"权重形态",font=F(23,"b"),fill=GREY)
    d.text((470,y0-42),"特点",font=F(23,"b"),fill=GREY)
    d.text((820,y0-42),"门槛 / 场景",font=F(23,"b"),fill=GREY)
    for i,(a,b,c,col,bg) in enumerate(rows):
        y=y0+i*(rh+gap)
        rrect(d,[56,y,1224,y+rh],bg,col)
        d.text((80,y+rh//2),a,font=F(23,"b"),fill=col,anchor="lm")
        d.text((470,y+rh//2),b,font=F(21,"r"),fill=INK,anchor="lm")
        d.text((820,y+rh//2),c,font=F(20,"r"),fill=INK2,anchor="lm")
    # 下：适合 / 缓行
    rrect(d,[56,640,620,960],GREENBG,GREEN)
    d.rounded_rectangle([56,640,620,702],radius=16,fill=GREEN); d.rectangle([56,680,620,702],fill=GREEN)
    d.text((84,652),"适合现在上手",font=F(28),fill=(255,255,255))
    yy=730
    for t in ["研究统一多模态架构的工程师","要单卡跑理解+生成一体化","做图文交错/信息图/图像编辑","ComfyUI 用户可直接用官方节点"]:
        d.ellipse([86,yy+9,100,yy+23],fill=GREEN); d.text((116,yy),t,font=F(21,"r"),fill=INK); yy+=52
    rrect(d,[662,640,1224,960],REDBG,RED)
    d.rounded_rectangle([662,640,1224,702],radius=16,fill=RED); d.rectangle([662,680,1224,702],fill=RED)
    d.text((690,652),"建议先缓一缓",font=F(28),fill=(255,255,255))
    yy=730
    for t in ["8-16GB 显存又不想折腾量化","只想调 API：用在线 Demo 即可","纯文生图、专用 SD/Flux 已够用","权重许可需先看各 HF 模型卡"]:
        d.ellipse([692,yy+9,706,yy+23],fill=RED); d.text((722,yy),t,font=F(21,"r"),fill=INK); yy+=52
    # 底部命令提示
    rrect(d,[56,984,1224,1036],CYANBG,CYAN)
    d.text((80,996),"最小路径：uv sync → hf download 权重 → examples/t2i/inference.py 一把梭",font=F(21,"m"),fill=CYAN,anchor="lm")
    img.save(os.path.join(OUT,"04-deploy-matrix.png")); print("04-deploy-matrix.png")

if __name__=="__main__":
    fig1(); fig2(); fig3(); fig4()
    print("ALL DONE ->",OUT)
