#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知乎专栏封面 1600x900，靛蓝品牌色论点型，区别于微信IP双翼封面"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"media")
FB="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
def F(s,b=True): return ImageFont.truetype(FB if b else FR,s)
W,H=1600,900
DARK=(26,26,46); BRAND=(120,116,255); CYAN=(90,210,224); INK=(240,240,250); INK2=(168,170,196); GOLD=(236,186,104)
img=Image.new("RGB",(W,H),DARK); d=ImageDraw.Draw(img)
d.rectangle([120,120,260,128],fill=BRAND)
d.text((120,150),"AG-UI Protocol · 2.1万 Star 仓库实测",font=F(30,False),fill=BRAND)
d.text((120,248),"一条事件流，",font=F(76),fill=INK)
d.text((120,354),"把任何 Agent 接进任何应用",font=F(76),fill=INK)
d.text((120,500),"MCP 接工具、A2A 连 Agent，AG-UI 负责把 agent 的行为",font=F(34,False),fill=INK2)
d.text((120,556),"以 31 个类型化事件实时送到 Web、移动端、终端与 Slack。",font=F(34,False),fill=INK2)
pills=[("31","事件类型"),("23","框架集成"),("3","官方语言 SDK")]
px=120
for big,small in pills:
    d.rounded_rectangle([px,690,px+380,800],radius=14,outline=BRAND,width=3)
    d.text((px+28,708),big,font=F(46),fill=GOLD)
    d.text((px+150,730),small,font=F(25,False),fill=INK2)
    px+=420
img.save(os.path.join(OUT,"cover-zhihu.png"))
print("cover-zhihu.png",img.size)
