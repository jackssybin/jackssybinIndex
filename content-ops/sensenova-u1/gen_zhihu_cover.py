#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知乎专栏封面 1600x900，深空蓝电光青科技风，区别于微信IP双翼封面"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"media")
FB="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
def F(s,b=True): return ImageFont.truetype(FB if b else FR,s)
W,H=1600,900
DARK=(13,20,36); CYAN=(64,210,232); GOLD=(238,186,102); INK=(234,240,250); INK2=(150,166,192); PURPLE=(170,128,242)
img=Image.new("RGB",(W,H),DARK); d=ImageDraw.Draw(img)
d.rectangle([120,120,260,128],fill=CYAN)
d.text((120,150),"SenseNova-U · 商汤 OpenSenseNova · 本地实测",font=F(30,False),fill=CYAN)
d.text((120,248),"一个模型，既看懂图",font=F(74),fill=INK)
d.text((120,354),"又会画图、还能自己改错",font=F(74),fill=INK)
d.text((120,500),"NEO-unify 原生统一多模态：无独立视觉编码器、无 VAE，",font=F(35,False),fill=INK2)
d.text((120,556),"理解与生成专家在同一套权重里按任务切换。",font=F(35,False),fill=INK2)
pills=[("17.55B","真实总参数"),("24GB","单卡显存门槛"),("U1.6","最新版本")]
px=120
for big,small in pills:
    d.rounded_rectangle([px,690,px+380,800],radius=14,outline=CYAN,width=3)
    d.text((px+28,708),big,font=F(46),fill=GOLD)
    d.text((px+210,730),small,font=F(25,False),fill=INK2)
    px+=420
img.save(os.path.join(OUT,"cover-zhihu.png"))
print("cover-zhihu.png",img.size)
