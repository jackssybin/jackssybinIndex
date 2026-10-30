# -*- coding: utf-8 -*-
"""FilmCraft 三端配图：微信IP封面另走wechat-ip-cover；这里出 微信1080封面备用/知乎封面 + 3张正文图。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/filmcraft-rust-nle"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
# FilmCraft 品牌紫
BG=(18,14,26); PANEL=(30,24,46); PANEL2=(38,30,58)
PURP=(167,139,250); PURP2=(196,181,253); VIO=(139,92,246); AMBER=(251,191,96)
TEAL=(45,212,191); WHITE=(240,237,248); GREY=(160,150,180); LINE=(58,46,86)
RED=(248,113,113); GREEN=(110,210,150); BLUE=(120,170,255)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

# ---------- 知乎封面 1600x900 ----------
def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,18,H],fill=VIO)
    t(d,(110,120),"纯 Rust，从零写到比特流",font("Black",74),WHITE)
    t(d,(110,235),"一个月 1.7 万 Star 的开源专业视频编辑器",font("Bold",40),PURP2)
    pts=[("不是 FFmpeg 套壳","H.264/HEVC/ProRes/AAC 编解码器全部自研，逐帧对拍 ffmpeg"),
         ("专业 NLE 完整工作流","三点编辑/全套修剪/调色/90+特效/广播级响度/多机位"),
         ("整个编辑器 = 650+ 命令","UI / CLI / JSON / MCP 同一套命令，AI Agent 能直接剪片子")]
    y=380
    for a,b in pts:
        d.ellipse([110,y+14,132,y+36],fill=VIO)
        t(d,(158,y),a,font("Bold",37),AMBER)
        t(d,(158,y+50),b,font("Regular",30),GREY); y+=128
    rr(d,(1180,120,1490,640),24,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","16,914"),("Fork","7,005"),("Rust 代码","42.4 万行"),("源文件","1,138 个"),("建仓","2026-09"),("协议","MIT/Apache"),("状态","alpha")]
    yy=176
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",27),GREY)
        t(d,(1450,yy),v,font("Bold",29),WHITE,anchor="ra"); yy+=62
    t(d,(110,830),"功能广度约 86% · 真正可干活约 56%：热度很高，但离替掉 Premiere 还有距离",font("Medium",26),AMBER)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

# ---------- 图1：剪辑工作区能力地图 ----------
def edit_map():
    W,H=1200,820; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,40),"一打开就是熟悉的专业剪辑台",font("Black",38),WHITE)
    groups=[("五大工作区",["Editing 剪辑","Assembly 粗剪","Color 调色","Effects 特效","Audio 音频"],PURP),
            ("剪辑基本功",["三点编辑 Insert/Overwrite","Ripple/Roll/Slip/Slide","剃刀·速率拉伸","Trim Monitor 边播边剪","多机位·嵌套·同步锁"],TEAL),
            ("不丢活的工程性",["整数时间基 254,016,000,000/s","23.976/29.97DF/59.94 精确","原子保存+滚动自动存","崩溃恢复日志(≈1s)","无限撤销 History"],AMBER)]
    x0=60; cw=350; gap=25; y=130
    for i,(g,items,c) in enumerate(groups):
        x=x0+i*(cw+gap)
        rr(d,(x,y,x+cw,y+620),18,fill=PANEL,outline=LINE,width=2)
        d.rectangle([x,y,x+8,y+620],fill=c)
        t(d,(x+30,y+26),g,font("Bold",28),c)
        yy=y+92
        for it in items:
            d.ellipse([x+30,yy+8,x+46,yy+24],outline=c,width=3)
            # 长文本换行
            line=it; maxw=cw-90; f=font("Regular",23)
            if d.textlength(line,font=f)>maxw:
                # 简单按/切
                t(d,(x+60,yy+16),line,font("Regular",23),(205,200,222),anchor="lm")
            else:
                t(d,(x+60,yy+16),line,font("Regular",23),(205,200,222),anchor="lm")
            yy+=92
    t(d,(60,780),"交互向 Premiere 看齐：不重新发明剪辑师的肌肉记忆，只重做底下的引擎",font("Medium",25),GREY)
    img.save(f"{OUT}/edit-map.png"); print("edit-map.png")

# ---------- 图2：编解码矩阵（表格） ----------
def codecs():
    W,H=1200,860; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"不内置 FFmpeg：编解码与容器全部自研 Rust",font("Black",34),WHITE)
    rows=[("H.264 / AVC","解 ✓ 编 ✓","37+ 流比特精确 · 1080p 500–600fps"),
          ("HEVC / H.265","解 ✓","Main/Main10 · 41 流 · 约225fps"),
          ("Apple ProRes","解 ✓ 编 ✓","422 Proxy→4444 XQ · 导出 422 HQ"),
          ("AAC-LC","解 ✓ 编 ✓","自研"),
          ("VP9 / VP8","解 ✓","8/10/12位 · 4:2:0→4:4:4 · 50+流"),
          ("AV1","解 ✓","胶片颗粒/超分/空间层 · 对拍 dav1d"),
          ("Opus","解 ✓","RFC 8251 全向量范围精确"),
          ("DNxHD/DNxHR","解 ✓ 编 ✓","SMPTE ST 2019-1 全 CID"),
          ("MP4/MOV · MKV · AVI · MXF · TS","解 ✓","MP4/MOV 可编 · 支持 HDR 元数据"),
          ("工程时间线互导","互导 ✓","FCP7 XML/FCPXML/OTIO/EDL/AAF/OMF")]
    x0,y0=60,120; w1=420; w2=150; w3=510; rh=62
    # 表头
    d.rectangle([x0,y0,x0+w1+w2+w3,y0+rh],fill=(52,38,82))
    t(d,(x0+18,y0+rh/2),"格式 / 能力",font("Bold",24),WHITE,anchor="lm")
    t(d,(x0+w1+14,y0+rh/2),"方向",font("Bold",24),WHITE,anchor="lm")
    t(d,(x0+w1+w2+14,y0+rh/2),"实测要点",font("Bold",24),WHITE,anchor="lm")
    for i,(a,b,c) in enumerate(rows):
        y=y0+rh+i*rh
        fill=PANEL if i%2==0 else PANEL2
        d.rectangle([x0,y,x0+w1+w2+w3,y+rh],fill=fill)
        t(d,(x0+18,y+rh/2),a,font("Bold",21),(225,219,240),anchor="lm")
        col=GREEN if "编" in b else PURP2
        t(d,(x0+w1+14,y+rh/2),b,font("Bold",21),col,anchor="lm")
        t(d,(x0+w1+w2+14,y+rh/2),c,font("Regular",20),GREY,anchor="lm")
    d.line([x0,y0,x0,y0+rh*(len(rows)+1)],fill=LINE,width=2)
    t(d,(60,y0+rh*(len(rows)+1)+22),"以 ffmpeg 当外部 oracle 逐帧对拍；MP3/FLAC/ALAC 暂用 symphonia，计划自研替换",font("Regular",23),GREY)
    img.save(f"{OUT}/codecs.png"); print("codecs.png")

# ---------- 图3：成熟度与短板 ----------
def status():
    W,H=1200,860; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,38),"热度很高，但它自己说：现在是 alpha",font("Black",36),WHITE)
    # 两个进度条
    bars=[("功能广度（对标 Premiere 2026）",86,"菜单92% · 特效100%",PURP),
          ("真正可干完整生产活",56,"区间 51–61% · 距 beta ≈19点/400–700h",AMBER)]
    y=140
    for label,val,note,c in bars:
        t(d,(60,y),label,font("Bold",27),WHITE)
        rr(d,(60,y+44,1060,y+88),12,fill=PANEL,outline=LINE,width=1)
        w=int(1000*val/100)
        rr(d,(60,y+44,60+w,y+88),12,fill=c)
        t(d,(1060,y+66),f"{val}%",font("Black",30),c,anchor="rm")
        t(d,(60,y+98),note,font("Regular",22),GREY)
        y+=170
    # 短板卡
    t(d,(60,y+6),"当前最实际的短板",font("Bold",28),RED)
    gaps=["大素材速度：调色/抠像/导出仍主要走 CPU；硬解平台有限",
          "打不开原生 .prproj，需 FCP7 XML / AAF / OTIO 中转",
          "没有插件系统：暂不支持 VST3 / Audio Units / OpenFX",
          "软件导出只有 H.264；H.265 仅硬件编码；无 AV1 导出",
          "相机/手机野生素材测的少；Windows/Linux 测试远少于 macOS"]
    yy=y+56
    for i,g in enumerate(gaps):
        rr(d,(60,yy,1140,yy+52),10,fill=PANEL2 if i%2 else PANEL,outline=LINE,width=1)
        t(d,(80,yy+26),"•",font("Bold",24),RED,anchor="lm")
        t(d,(106,yy+26),g,font("Regular",23),(208,200,226),anchor="lm")
        yy+=62
    img.save(f"{OUT}/status.png"); print("status.png")

zhihu_cover(); edit_map(); codecs(); status(); print("ALL DONE")
