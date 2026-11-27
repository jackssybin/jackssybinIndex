#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""麦田知乎论点封面 1600x900。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"images")
W,H=1600,900
BG="#1c221c"; CARD="#262e25"; GREEN="#7bae5a"; GOLD="#f2b21b"; PURPLE="#7b5cff"; TEXT="#ecefe6"; MUTED="#9aa68f"
FD="/usr/share/fonts/google-noto-cjk/"
def F(s,b=True): return ImageFont.truetype(FD+("NotoSansCJK-Bold.ttc" if b else "NotoSansCJK-Regular.ttc"),s)
img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
d.rectangle([0,0,W,10],fill=GREEN); d.rectangle([0,10,W//3,10],fill=GOLD)
# 左侧大数字
d.text((100,150),"13",font=F(260),fill=GOLD)
d.text((100,440),"天 · 2303 Star",font=F(58),fill=GREEN)
d.text((104,540),"一个独立开发者的多平台发布工作台",font=F(34,False),fill=MUTED)
# 右侧核心论点卡
d.rounded_rectangle([820,150,1500,720],radius=24,fill=CARD,outline=GREEN,width=3)
d.text((870,210),"最反直觉的设计",font=F(40),fill=GOLD)
d.text((870,300),"它故意",font=F(64),fill=TEXT)
d.text((870,392),"不帮你点「发布」",font=F(64),fill=GREEN)
d.text((870,520),"国内四家只填不发",font=F(36),fill=TEXT)
d.text((870,580),"最后一下，人来点",font=F(36),fill=MUTED)
d.text((870,650),"—— 这是对平台风控的清醒",font=F(28,False),fill=MUTED)
d.text((100,820),"麦田 mdldm-maitian · 本地克隆实测 · 149 个测试全过",font=F(28,False),fill=MUTED)
p=os.path.join(OUT,"cover-zhihu.png"); img.save(p,"PNG"); print("saved",p)
