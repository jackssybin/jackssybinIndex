#!/usr/bin/env python3
"""Obscura 渲染引擎深拆：配图生成。"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "obscura-rust-rendering-engine-deep-dive"
OPS = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
ST = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS.mkdir(parents=True, exist_ok=True); ST.mkdir(parents=True, exist_ok=True)

BG=(13,15,20); CARD=(28,32,44); LINE=(64,72,94); TEXT=(233,237,246); DIM=(148,156,176)
BLUE=(100,170,255); ORANGE=(255,164,70); GREEN=(110,220,130); PINK=(255,110,165); TEAL=(40,200,205); RUST=(222,100,68)

def F(size,bold=False):
    n="NotoSansCJK-Bold.ttc" if bold else "NotoSansCJK-Regular.ttc"
    for p in (f"/usr/share/fonts/google-noto-cjk/{n}",f"/usr/share/fonts/opentype/noto/{n}","/usr/share/fonts/truetype/wqy/wqy-microhei.ttc"):
        if os.path.exists(p): return ImageFont.truetype(p,size,encoding="unic")
    return ImageFont.load_default()

def save(img,name):
    img.save(OPS/name); img.save(ST/name); print("ok",name)

def rr(d,xy,r,fill=None,outline=None,w=0): d.rounded_rectangle(xy,radius=r,fill=fill,outline=outline,width=w)
def tx(d,xy,s,f,c,a="lm"): d.text(xy,s,font=f,fill=c,anchor=a)

# 1. 微信封面 1280x544 暗色（热点/硬核技术风）
def cover_wechat():
    W,H=1280,544
    img=Image.new("RGB",(W,H),(14,18,30)); d=ImageDraw.Draw(img)
    for x in range(0,W,64): d.line([(x,0),(x,H)],fill=(20,26,42))
    for y in range(0,H,64): d.line([(0,y),(W,y)],fill=(20,26,42))
    # 橙色锈色光
    ov=Image.new("RGBA",(W,H),(0,0,0,0)); od=ImageDraw.Draw(ov)
    od.ellipse([-200,-200,600,500],fill=(222,100,68,60)); img.paste(ov,(0,0),ov)
    ftag=F(26,True)
    rr(d,[60,56,330,108],26,outline=RUST,w=3)
    tx(d,(195,82),"开源实测 · Rust 引擎",ftag,(255,170,140),a="mm")
    f1=F(66,True); f2=F(66,True)
    tx(d,(60,190),"不用 Chromium，",f1,(255,255,255))
    tx(d,(60,282),"网页是怎么被",f2,TEXT)
    tx(d,(60,366),"渲染出来的？",f2,(255,170,90))
    fs=F(27)
    tx(d,(60,450),"Obscura 0.2.2 实测：40MB 内存 · 152ms 抓完 HN · 66 个 CSS 对拍用例",fs,(185,195,220))
    # 右侧无Chrome徽章
    rr(d,[950,150,1220,400],18,CARD,GREEN,3)
    fb=F(40,True)
    tx(d,(1080,220),"NO",fb,GREEN,a="mm")
    tx(d,(1080,278),"Chromium",fb,TEXT,a="mm")
    tx(d,(1080,330),"V8 + 自研布局/绘制",F(22),DIM,a="mm")
    fm=F(22)
    tx(d,(60,H-40),"github.com/h4ckf0r0day/obscura · Apache-2.0",fm,(120,130,160))
    tx(d,(W-60,H-40),"jackssybin.com",fm,(120,130,160),a="rm")
    return img

# 2. 知乎封面 1600x900 亮色：渲染管线对比
def cover_zhihu():
    W,H=1600,900
    img=Image.new("RGB",(W,H),(247,248,251)); d=ImageDraw.Draw(img)
    d.rectangle([0,0,12,H],fill=(222,100,68))
    ft=F(26,True)
    rr(d,[70,70,300,122],26,fill=(222,100,68)); tx(d,(185,96),"源码拆解",ft,(255,255,255),a="mm")
    rr(d,[320,70,640,122],26,fill=(255,255,255),outline=(222,100,68),w=2); tx(d,(480,96),"无头浏览器 · 渲染管线",ft,(222,100,68),a="mm")
    f1=F(58,True)
    tx(d,(70,200),"抛弃 Blink 之后，",f1,(22,28,52))
    tx(d,(70,282),"一个浏览器还要自己造哪些轮子？",f1,(22,28,52))
    # 两列对比
    cols=[(70,760,470,760,"Headless Chrome",["Blink 排版 + 合成器","Skia 绘制","整包 300MB+ / 200MB 内存","通用但笨重"],PINK),
          (840,1530,470,760,"Obscura 0.2.2",["html5ever 解析 DOM","Taffy flex/grid + 自研排版","tiny-skia CPU 绘制 + ab_glyph","70MB / 实测 40MB RSS"],GREEN)]
    for x1,x2,y1,y2,name,rows,c in cols:
        rr(d,[x1,y1,x2,y2],16,(255,255,255),c,3)
        tx(d,(x1+30,y1+50),name,F(32,True),c)
        for i,r in enumerate(rows):
            yy=y1+115+i*52
            d.ellipse([x1+32,yy-7,x3 if False else x1+46,yy+7],fill=c)
            tx(d,(x1+64,yy),r,F(24),(60,66,90))
    tx(d,(70,H-40),"github.com/h4ckf0r0day/obscura · 9 crates · V8/deno_core · Apache-2.0",F(22),(120,128,150))
    tx(d,(W-70,H-40),"实测 RSS 40,052 KB · HN 152ms",F(22),(120,128,150),a="rm")
    return img

# 3. 九 crate 架构
def diagram_arch():
    W,H=1280,820
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    tx(d,(60,56),"九个 crate 的分层：从 CDP 帧到像素",F(38,True),TEXT)
    layers=[
        ("接入层",["obscura-cli (fetch/serve/scrape/mcp)","obscura-cdp (Chrome DevTools 协议)","obscura-mcp (Agent 工具)"],BLUE),
        ("页面层",["obscura-browser (Page/导航/生命周期)","obscura-dom (DOM 树 tree.rs)","obscura-js (V8/deno_core + bootstrap.js)"],TEAL),
        ("网络层",["obscura-net (HTTP/cookie/robots/追踪拦截/wreq 隐身)"],ORANGE),
        ("渲染层",["obscura-render 72,915 行：级联→retained layout→字形→CPU paint",
                  "Taffy(flex/grid) · tiny-skia · ab_glyph · cosmic-text"],RUST),
        ("库",["obscura：可嵌入 Rust API / 请求拦截"],GREEN),
    ]
    y=130
    for name,items,c in layers:
        h=70+len(items)*46+24
        rr(d,[60,y,W-60,y+h],14,CARD,c,2)
        tx(d,(86,y+38),name,F(28,True),c)
        for i,it in enumerate(items):
            tx(d,(240,y+40+i*46),it,F(23),TEXT if i==0 or name!="渲染层" else (255,200,180))
        y+=h+18
    tx(d,(60,H-34),"依据：docs/Architecture-overview.md + Cargo.toml + 各 crate 行数实测（V8 单 isolate，tokio Mutex 串行化）",F(21),DIM)
    return img

# 4. 对拍质量体系 render-repros
def diagram_repros():
    W,H=1280,720
    img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    tx(d,(60,56),"怎么证明自研排版没瞎画？66 个像素级对拍夹具",F(36,True),TEXT)
    tx(d,(60,108),"render-repros/：每个 HTML 夹具配 checks.json 断言几何坐标/颜色，可与 Chromium 双机对拍",F(24),DIM)
    cats=[("flex / grid",["flex-flow","grid-auto-repeat","item-alignment","contextual-grid-gap"],BLUE),
          ("float / 定位",["float-bfc-continuation","right-float-nav","absolute-containing*","z-index"],TEAL),
          ("表格 / 表单",["tables","table-track-geometry","form-control-geometry","fixed-table-layout"],ORANGE),
          ("文本 / 字体",["forced-line-breaks","font-shorthand","text-decoration-lines","list-indentation"],PINK),
          ("复杂站点",["bootstrap-float-clearfix","carousel-clip","viewport-consistency","long-full-page-capture"],GREEN)]
    cw=228; gap=12; x0=60; y0=180
    for i,(cat,items,c) in enumerate(cats):
        x=x0+i*(cw+gap)
        rr(d,[x,y0,x+cw,y0+420],14,BG_SOFT if (BG_SOFT:=(22,25,34)) else BG,c,2)
        tx(d,(x+18,y0+38),cat,F(24,True),c)
        for j,it in enumerate(items):
            yy=y0+86+j*58
            rr(d,[x+14,yy-20,x+cw-14,yy+20],8,CARD)
            tx(d,(x+28,yy),it,F(18),TEXT)
    # 底部对拍流程
    fy=640
    steps=["构造 HTML 夹具","同一视口/滚动/动画时刻","Obscura 截图","Chromium 截图","像素距离+几何断言"]
    fw=(W-120-4*30)//5
    for i,s in enumerate(steps):
        x=60+i*(fw+30)
        rr(d,[x,fy,x+fw,fy+56],10,CARD,RUST if i in(2,3) else BLUE,2)
        tx(d,(x+fw//2,fy+28),s,F(20,True),TEXT,a="mm")
        if i<4: d.polygon([(x+fw+6,fy+28-8),(x+fw+22,fy+28),(x+fw+6,fy+28+8)],fill=LINE)
    return img

# 5. 实测终端
def diagram_mybench():
    W,H=1280,640
    img=Image.new("RGB",(W,H),(11,13,17)); d=ImageDraw.Draw(img)
    rr(d,[0,0,W-1,H-1],18,(19,21,28),LINE,2)
    for i,c in enumerate([(255,95,86),(255,189,46),(39,201,63)]): d.ellipse([28+i*34,26,48+i*34,46],fill=c)
    tx(d,(W//2,36),"本机实测 obscura 0.2.2 (x86_64-linux 发行二进制)",F(22),DIM,a="mm")
    rows=[
        ("$ ./obscura --version",DIM),("obscura 0.2.2",GREEN),
        ("$ ./obscura fetch https://news.ycombinator.com \\",DIM),
        ("    --eval \"document.querySelectorAll('.titleline>a').length\"",DIM),
        ("30      real  0m0.152s   ← JS 执行 + DOM + 抽取",GREEN),
        ("$ ./obscura fetch example.com --dump markdown",DIM),
        ("# Example Domain / This domain is for use in documentation ...",TEXT),
        ("$ /usr/bin/time -v ./obscura fetch news.ycombinator.com --dump text -q",DIM),
        ("Maximum resident set size: 40,052 KB  (约 39 MB)",GREEN),
        ("$ ./obscura fetch http://127.0.0.1:80",DIM),
        ("Error: Access to private/internal IP 127.0.0.1 is not allowed  ← SSRF 默认拦截",PINK),
        ("$ ./obscura scrape a b c --concurrency 10 --format json",DIM),
        ("3 urls · 1296ms · 多 worker 并行（worker 独立进程）",TEAL),
    ]
    y=82
    for s,c in rows:
        tx(d,(38,y),s,F(22),c); y+=40
    return img

SPECS=[("cover-wechat.jpg",1280,544,cover_wechat),("cover-zhihu.png",1600,900,cover_zhihu),
       ("diagram-architecture.png",1280,820,diagram_arch),("diagram-render-repros.png",1280,720,diagram_repros),
       ("diagram-mybench.png",1280,640,diagram_mybench)]
def main():
    for n,w,h,fn in SPECS: save(fn(),n)
if __name__=="__main__": main()
