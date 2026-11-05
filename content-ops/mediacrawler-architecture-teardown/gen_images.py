# -*- coding: utf-8 -*-
"""MediaCrawler 架构拆解配图：技术档案/蓝图风（冷灰蓝+琥珀强调，合规冷静调性）。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT="/root/jackssybinIndex/static/images/mediacrawler-architecture-teardown"
os.makedirs(OUT,exist_ok=True)
FD="/usr/share/fonts/google-noto-cjk"
def font(w,s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc",s)
BG=(15,20,27); PANEL=(24,31,41); PANEL2=(33,42,55); LINE=(57,70,88)
WHITE=(233,238,245); MUTED=(148,163,181); AMBER=(240,180,92); STEEL=(108,158,220)
TEAL=(86,188,174); RED=(232,114,114)
def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,6],fill=STEEL)
    t(d,(110,108),"7 万 Star 爬虫项目的架构与边界",font("Black",60),WHITE)
    t(d,(112,200),"通读 3.3 万行 MediaCrawler：值得学的工程，与必须知道的合规坑",font("Bold",32),STEEL)
    pts=[("免逆向的核心取舍","Playwright 保留登录态，在浏览器上下文里用 JS 取签名参数"),
         ("一套抽象七平台同构","AbstractCrawler 模板方法 + 八后端存储工厂 + CDP 接管真实浏览器"),
         ("它不是 OSI 开源","NON-COMMERCIAL 非商业学习许可：禁商用、禁大规模爬取")]
    y=320
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=AMBER)
        t(d,(150,y),a,font("Bold",33),AMBER); t(d,(150,y+47),b,font("Regular",26),MUTED); y+=120
    rr(d,(1180,140,1490,640),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","70.2K"),("Fork","13.3K"),("语言","Python"),("代码","3.3 万行"),("平台","7 个"),("存储后端","8 种"),("许可","非商业学习")]
    yy=188
    for k,v in rows:
        t(d,(1220,yy),k,font("Regular",24),MUTED); t(d,(1450,yy),v,font("Bold",26),WHITE,anchor="ra"); yy+=60
    t(d,(112,828),"学习研究用途的架构笔记 · 不构成采集行动建议 · 数据基准 2026-11-05",font("Medium",23),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def architecture():
    W,H=1200,860; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"分层架构：一套抽象，七个同构平台",font("Black",33),WHITE)
    # 入口层
    rr(d,(60,110,1140,180),14,fill=PANEL2,outline=STEEL,width=2)
    t(d,(600,145),"入口层：main.py · cmd_arg 参数解析 · webui/（Vite+React 图形界面）",font("Bold",23),WHITE,anchor="mm")
    d.line([600,180,600,215],fill=MUTED,width=2)
    # 抽象层
    rr(d,(60,215,1140,300),14,fill=PANEL,outline=AMBER,width=2)
    t(d,(600,246),"base/base_crawler.py：AbstractCrawler 模板方法",font("Bold",23),AMBER,anchor="mm")
    t(d,(600,278),"start / search / launch_browser / launch_browser_with_cdp（CDP 默认回退）",font("Regular",20),MUTED,anchor="mm")
    d.line([600,300,600,335],fill=MUTED,width=2)
    # 七平台
    plats=["xhs 小红书","douyin 抖音","kuaishou 快手","bilibili B站","weibo 微博","tieba 贴吧","zhihu 知乎"]
    bw=146;gap=8;x=60;y=335
    for i,p in enumerate(plats):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+86),10,fill=PANEL2,outline=LINE,width=1)
        t(d,(xx+bw/2,y+30),p.split()[1],font("Bold",18),STEEL,anchor="mm")
        t(d,(xx+bw/2,y+58),p.split()[0],font("Regular",15),MUTED,anchor="mm")
    t(d,(60,440),"每个平台五件套：core 编排 · client 接口 · login 登录态 · sign JS取签名 · extractor 字段映射",font("Medium",20),WHITE)
    # 横切层
    rr(d,(60,480,565,690),14,fill=PANEL,outline=LINE,width=2)
    t(d,(84,506),"横切能力",font("Bold",22),TEAL)
    for j,s in enumerate(["proxy/ IP 代理池（开关控制）","httpx + tenacity 异步重试","exception.py 错误码→语义异常","tools/user_hash 匿名化/昵称打码","async_file_writer 异步落盘"]):
        t(d,(84,548+j*32),"· "+s,font("Regular",19),(205,213,222))
    rr(d,(595,480,1140,690),14,fill=PANEL,outline=LINE,width=2)
    t(d,(619,506),"存储工厂 store/：SAVE_DATA_OPTION 一开关",font("Bold",22),TEAL)
    for j,s in enumerate(["csv · json · jsonl · sqlite","postgres · mongodb · excel（共 8 种）","爬取逻辑与存储完全解耦","database/ SQLAlchemy 会话管理","媒体下载走独立 media_downloader/"]):
        t(d,(619,548+j*32),"· "+s,font("Regular",19),(205,213,222))
    rr(d,(60,730,1140,800),12,fill=PANEL2,outline=AMBER,width=1)
    t(d,(600,765),"关键设计：浏览器自己算签名，代码只“借”结果——免 JS 逆向，代价是依赖真实浏览器环境",font("Bold",20),AMBER,anchor="mm")
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def cdp_mode():
    W,H=1200,780; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"普通 Playwright 模式 vs CDP 接管模式",font("Black",33),WHITE)
    # 左卡
    rr(d,(60,120,580,600),16,fill=PANEL,outline=LINE,width=2)
    d.rectangle([60,120,580,126],fill=MUTED)
    t(d,(90,150),"Playwright 自启浏览器",font("Bold",25),MUTED)
    for j,s in enumerate(["程序 launch 一个全新浏览器实例","自带自动化指纹（navigator.webdriver）","启动参数特征明显，易被风控识别","登录需在自动化实例内重新扫码","实现简单，适合低频学习场景"]):
        t(d,(90,210+j*52),"· "+s,font("Regular",21),(205,213,222))
    t(d,(90,500),"默认 HEADLESS = False",font("Bold",20),RED)
    # 右卡
    rr(d,(620,120,1140,600),16,fill=PANEL,outline=STEEL,width=2)
    d.rectangle([620,120,1140,126],fill=STEEL)
    t(d,(650,150),"CDP 接管真实浏览器（现默认）",font("Bold",25),STEEL)
    for j,s in enumerate(["连接你日常使用的 Chrome（144+）","真实扩展/Cookie/历史/指纹全继承","chrome://inspect 开远程调试 9222","首次连接弹确认框，60 秒手动接受","不可用时基类自动回退普通模式"]):
        t(d,(650,210+j*52),"· "+s,font("Regular",21),(205,213,222))
    t(d,(650,500),"ENABLE_CDP_MODE = True",font("Bold",20),TEAL)
    # 底部
    rr(d,(60,640,1140,720),12,fill=PANEL2,outline=AMBER,width=1)
    t(d,(88,672),"工程看点：新能力以可选增强接入而非推翻重写——AbstractCrawler 提供默认回退实现，",font("Bold",20),AMBER,anchor="lm")
    t(d,(88,704),"CDP 不可用时降级标准 Playwright，调用方代码不变",font("Bold",20),AMBER,anchor="lm")
    img.save(f"{OUT}/cdp-mode.png"); print("cdp-mode.png")

def compliance():
    W,H=1200,820; img=Image.new("RGB",(W,H),BG); d=ImageDraw.Draw(img)
    t(d,(60,36),"合规三层：先看协议，再看产品，最后看法律",font("Black",33),WHITE)
    cards=[("① 许可证","NON-COMMERCIAL LEARNING 1.1",
            ["GitHub 标 NOASSERTION","非 OSI 开源协议","明确禁止大规模爬取与平台干扰","商用需版权方书面同意","Fork 可以，商用不行"],RED),
           ("② 产品边界","开源版 vs MediaCrawlerPro",
            ["Pro 是闭源付费产品（独立组织）","开源版无断点续爬/多账号调度","无去 Playwright 的轻量方案","docs 内含代理/知识付费导流","判断哪些能力被刻意留给付费版"],AMBER),
           ("③ 法律红线","国内判例集中的入刑点",
            ["破解/绕过平台反爬措施","采集登录后非公开数据","涉及公民个人信息并扩散","高频请求致平台服务异常","技术没破解 ≠ 怎么爬都合法"],STEEL)]
    x=60;cw=350;gap=25;y=130
    for (h,sub,items,c),i in zip(cards,range(3)):
        xx=x+i*(cw+gap)
        rr(d,(xx,y,xx+cw,y+560),16,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+cw,y+6],fill=c)
        t(d,(xx+24,y+26),h,font("Black",26),c)
        t(d,(xx+24,y+72),sub,font("Bold",18),WHITE)
        yy=y+128
        for it in items:
            d.ellipse([xx+24,yy+8,xx+36,yy+20],outline=c,width=2)
            t(d,(xx+48,yy+14),it,font("Regular",18),(206,213,222),anchor="lm"); yy+=54
    rr(d,(60,720,1140,782),12,fill=PANEL2,outline=TEAL,width=1)
    t(d,(600,751),"相对安全姿势：低频 · 只碰公开信息 · 数据不出本机 · 纯学习研究；商业需求走官方开放 API",font("Bold",21),TEAL,anchor="mm")
    img.save(f"{OUT}/compliance.png"); print("compliance.png")

zhihu_cover(); architecture(); cdp_mode(); compliance(); print("ALL DONE")
