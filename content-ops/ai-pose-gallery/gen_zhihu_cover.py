#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知乎专栏封面 1600x900，画廊紫深色论点型，区别于微信IP双翼封面"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"media")
FB="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
def F(s,b=True): return ImageFont.truetype(FB if b else FR,s)
W,H=1600,900
DARK=(30,26,42); PURPLE=(150,110,220); GOLD=(224,178,104); PAPER=(238,235,246); INK2=(182,178,200)
img=Image.new("RGB",(W,H),DARK); d=ImageDraw.Draw(img)
d.rectangle([120,120,260,128],fill=GOLD)
d.text((120,150),"ai-pose-gallery-zh · 本地克隆实测",font=F(30,False),fill=GOLD)
d.text((120,250),"把三个日文参考站，",font=F(76),fill=PAPER)
d.text((120,358),"重构成一个合成工作台",font=F(76),fill=PAPER)
d.text((120,500),"姿势 · 服装 · 人像三库合一，全中文索引，",font=F(36,False),fill=INK2)
d.text((120,558),"同时喂饱网页、ComfyUI 和你的 AI Agent。",font=F(36,False),fill=INK2)
pills=[("7,869","GitHub Stars"),("6,011","本地高清原图"),("9","Agent 技能")]
px=120
for big,small in pills:
    d.rounded_rectangle([px,690,px+380,800],radius=14,outline=PURPLE,width=3)
    d.text((px+28,708),big,font=F(46),fill=GOLD)
    d.text((px+190,730),small,font=F(25,False),fill=INK2)
    px+=420
img.save(os.path.join(OUT,"cover-zhihu.png"))
print("cover-zhihu.png",img.size)
