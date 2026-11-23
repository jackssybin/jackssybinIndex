#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知乎专栏封面 1600x900，深墨绿学院风，纯文字论点型（区别于微信IP双翼封面）"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"media")
FB="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
def F(s,b=True): return ImageFont.truetype(FB if b else FR,s)
W,H=1600,900
DARK=(26,46,38); GREEN=(64,140,108); GOLD=(212,168,92); PAPER=(238,234,224); INK2=(180,196,188)
img=Image.new("RGB",(W,H),DARK); d=ImageDraw.Draw(img)
# 顶部金线 + kicker
d.rectangle([120,120,260,128],fill=GOLD)
d.text((120,150),"Jane Street · agent_skills · 源码实测",font=F(30,False),fill=GOLD)
# 主标题（手动语义断行，每行≤13字）
d.text((120,250),"一个零代码的 SKILL.md",font=F(78),fill=PAPER)
d.text((120,360),"凭什么 20 天破万星？",font=F(78),fill=PAPER)
# 副标题
d.text((120,500),"苏格拉底式 AI 私教：只追问、不投喂，",font=F(38,False),fill=INK2)
d.text((120,560),"把「看懂了」的错觉，换成「能教别人」的真掌握。",font=F(38,False),fill=INK2)
# 底部三个数据点
pills=[("10.6k","GitHub Stars"),("5KB","单文件提示词"),("0","行代码 / MIT")]
px=120
for big,small in pills:
    d.rounded_rectangle([px,690,px+380,800],radius=14,outline=GREEN,width=3)
    d.text((px+28,708),big,font=F(48),fill=GOLD)
    d.text((px+170,728),small,font=F(26,False),fill=INK2)
    px+=420
img.save(os.path.join(OUT,"cover-zhihu.png"))
print("cover-zhihu.png", img.size)
