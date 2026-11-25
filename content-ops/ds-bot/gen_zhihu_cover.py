#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""知乎专栏封面 1600x900，暖琥珀深石墨组织风，区别于微信IP双翼封面"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT=os.path.join(os.path.dirname(__file__),"media")
FB="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR="/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
def F(s,b=True): return ImageFont.truetype(FB if b else FR,s)
W,H=1600,900
DARK=(38,34,30); AMBER=(224,160,72); INK=(248,244,236); INK2=(186,178,168); SAGE=(120,190,150)
img=Image.new("RGB",(W,H),DARK); d=ImageDraw.Draw(img)
d.rectangle([120,120,260,128],fill=AMBER)
d.text((120,150),"DS-Bot · DeepSeek Harness 生态 · 本地实测",font=F(30,False),fill=AMBER)
d.text((120,248),"给每个 AI 发工号、",font=F(74),fill=INK)
d.text((120,354),"让它们像团队一样长期协作",font=F(74),fill=INK)
d.text((120,500),"长生命周期 bot 身份、独立记忆与权限、群聊 Goal 拆解、",font=F(34,False),fill=INK2)
d.text((120,556),"8 个 IM 接入与代码级安全模型，全部数据留在你本机。",font=F(34,False),fill=INK2)
pills=[("27万","核心代码行"),("8885","GitHub Stars"),("4","部署形态")]
px=120
for big,small in pills:
    d.rounded_rectangle([px,690,px+380,800],radius=14,outline=AMBER,width=3)
    d.text((px+28,708),big,font=F(46),fill=SAGE)
    d.text((px+190,730),small,font=F(25,False),fill=INK2)
    px+=420
img.save(os.path.join(OUT,"cover-zhihu.png"))
print("cover-zhihu.png",img.size)
