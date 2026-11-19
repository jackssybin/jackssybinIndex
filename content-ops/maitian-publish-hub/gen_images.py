# -*- coding: utf-8 -*-
"""麦田配图：麦穗田园风（麦黄底 + 麦穗绿 + 深棕 + 陶土橙），呼应多平台创作者工作台。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/maitian-publish-hub"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

CREAM=(247,242,228); WHEAT=(232,214,168); INK=(46,40,30); PANEL=(253,250,242); PANEL2=(238,230,208)
LINE=(206,192,160); GREEN=(74,124,72); DEEP=(40,74,58); ORANGE=(196,118,58); GOLD=(178,140,52)
TEAL=(58,124,120); PLUM=(140,86,110); MUTED=(116,106,88); RED=(176,70,58)

def rr(d,b,r,fill=None,outline=None,width=1): d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)
def t(d,xy,s,f,c,anchor=None): d.text(xy,s,font=f,fill=c,anchor=anchor)

def zhihu_cover():
    W,H=1600,900
    img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
    d.rectangle([0,0,W,8],fill=GREEN)
    t(d,(110,92),"一条视频发七个平台，这个开源中控帮你自动填表",font("Black",46),INK)
    t(d,(110,170),"麦田：自媒体多平台发布中控与数据监控，飞书卡片通知 + 数据大屏，不存平台密码",font("Bold",24),DEEP)
    pts=[("7 大平台一套发布工程","B站/抖音/小红书/视频号/YouTube/X/Instagram，分批填写、定时、自动取链接"),
         ("国内四家只填不发，最后一下你点","用你自己登录的浏览器操作，规避风控，不存任何平台密码"),
         ("从发布到数据到转化闭环","每天采集播放粉丝，第1/3/7天自动复盘，接自有站算注册收入")]
    y=288
    for a,b in pts:
        d.rectangle([112,y+10,126,y+34],fill=GREEN)
        t(d,(150,y),a,font("Bold",25),GREEN)
        t(d,(150,y+38),b,font("Regular",20),MUTED)
        y+=102
    rr(d,(1150,140,1490,690),20,fill=PANEL,outline=LINE,width=2)
    rows=[("Star","1355"),("Fork","425"),("语言","JavaScript"),("平台","7 个"),
          ("运行环境","Node22.5+"),("数据库","SQLite"),("协议","MIT")]
    yy=182
    for k,v in rows:
        t(d,(1185,yy),k,font("Regular",21),MUTED)
        t(d,(1455,yy),v,font("Bold",20),GOLD,anchor="ra")
        yy+=64
    t(d,(112,828),"基于 2026-11-19 仓库源码实测 · 建仓仅 5 天 v0.4.0，主打 macOS（Windows 社区版）",font("Medium",19),MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def architecture():
    W,H=1200,780
    img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
    t(d,(60,34),"三件套分工：AI 写文案，插件填页面，中控管调度",font("Black",27),INK)
    cards=[
        ("发布 Skill",["Claude Code/Codex 调用","看片、写各平台文案","生成 publish.json","字数/禁词/封面校验"],DEEP),
        ("发布助手插件",["Chrome 应用商店插件","各平台适配器","打开上传页传视频","填文案、设定时"],TEAL),
        ("麦田中控",["hub.mjs 守护进程","分发计划与防重","等你点国内发布","取链接、采数据"],GREEN),
        ("数据与通知",["SQLite 本地库存","网页大屏 :8787","飞书群卡片通知","iPhone 桌面小组件"],ORANGE),
    ]
    bw,bh=252,440; gap=18; x,y=60,120
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+bw/2,y+38),h,font("Bold",20),c,anchor="mm")
        yy=y+92
        for it in items:
            t(d,(xx+18,yy),"· "+it,font("Regular",16),(62,54,44))
            yy+=56
    rr(d,(60,600,1140,700),12,fill=PANEL2,outline=GREEN,width=1)
    t(d,(88,630),"链路：成片 → skill 写发布素材 md → publish.json → hub plan 进计划 → hub run 分批填写 →",font("Bold",17),GREEN,anchor="lm")
    t(d,(88,664),"国内你点发布 → 到点取链接 → 每天采数据 → 大屏与飞书卡片；插件经商店自动更新，平台改版改一次全员生效",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/architecture.png"); print("architecture.png")

def safety():
    W,H=1200,800
    img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
    t(d,(60,32),"为什么敢用它操作你的账号：四道安全设计",font("Black",28),INK)
    cards=[
        ("不存密码",["专用 Chrome 保留你的登录态","中控只驱动浏览器","不接触账号密码","chrome-profile 不进 git"],GREEN),
        ("人机分界",["国内四家只填写不提交","最后发布由你手动点","海外平台校验后自动提交","每 20 分钟提醒待办"],TEAL),
        ("防重与风控",["每平台只上传一次","已到位的不再重跑","小红书只模拟人操作","低频滚动点击不调接口"],GOLD),
        ("本地与权限",["SQLite/日志全在本机","网页无口令一律 401","飞书验证码远程登录","Cloudflare Access 可选"],PLUM),
    ]
    bw,bh=252,470; gap=18; x,y=60,118
    for i,(h,items,c) in enumerate(cards):
        xx=x+i*(bw+gap)
        rr(d,(xx,y,xx+bw,y+bh),14,fill=PANEL,outline=c,width=2)
        d.rectangle([xx,y,xx+bw,y+6],fill=c)
        t(d,(xx+18,y+28),h,font("Bold",19),c)
        yy=y+84
        for it in items:
            t(d,(xx+18,yy),"· "+it,font("Regular",16),(58,50,42))
            yy+=58
    rr(d,(60,628,1140,720),12,fill=PANEL2,outline=RED,width=1)
    t(d,(88,658),"它只读写你自己账号的创作者后台，不做互动自动化、不碰别人账号；麦田本身不上报数据，",font("Bold",18),RED,anchor="lm")
    t(d,(88,692),"仅作者知识站引流链接带 utm（可在 config 用 learnLinks:false 关闭）",font("Regular",17),MUTED,anchor="lm")
    img.save(f"{OUT}/safety.png"); print("safety.png")

def data_loop():
    W,H=1200,760
    img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
    t(d,(60,34),"播种、长势、收成：一套创作者数据闭环",font("Black",28),INK)
    # 左：三阶段
    rr(d,(60,116,560,600),14,fill=PANEL,outline=GREEN,width=2)
    t(d,(88,144),"三个阶段",font("Bold",22),GREEN)
    stages=[("播种 · 发布","读 NAS 发布工程，分批填七平台，定时取链接"),
            ("长势 · 流量粉丝","每天采播放互动与粉丝，新片头三天每 6 小时一次"),
            ("收成 · 转化","接自有站点，按 utm 看注册/会员/订单/收入来源")]
    yy=200
    for h,b in stages:
        t(d,(88,yy),h,font("Bold",18),DEEP)
        t(d,(88,yy+30),b,font("Regular",16),(66,58,48))
        yy+=118
    # 右：复盘能力
    rr(d,(620,116,1140,600),14,fill=PANEL,outline=ORANGE,width=2)
    t(d,(648,144),"复盘与看板",font("Bold",22),ORANGE)
    items=["发布第 1/3/7 天自动出复盘卡片","同龄对比：第 N 天对第 N 天","各平台占比、互动率、期间涨粉","每周一自动出周报","转化漏斗：播放→注册→会员→收入","日历看上周到未来两周排期","粮仓存档封面/文案/链接/日志","飞书多维表格看板可选"]
    yy=200
    for it in items:
        d.ellipse([648,yy+8,664,yy+24],outline=ORANGE,width=2)
        t(d,(680,yy+16),it,font("Regular",17),(64,54,44),anchor="lm")
        yy+=48
    rr(d,(60,636,1140,700),12,fill=PANEL2,outline=TEAL,width=1)
    t(d,(88,668),"11 张 SQLite 表承载 episodes/tasks/metrics/samples/site_campaigns 等，数据长期留存可回溯，",font("Bold",18),TEAL,anchor="lm")
    img.save(f"{OUT}/data-loop.png"); print("data-loop.png")

def limits():
    W,H=1200,780
    img=Image.new("RGB",(W,H),CREAM); d=ImageDraw.Draw(img)
    t(d,(60,34),"上手前看清：它的边界和适合谁",font("Black",28),INK)
    rr(d,(60,116,580,580),14,fill=PANEL,outline=GREEN,width=2)
    t(d,(88,144),"适合这些人",font("Bold",24),GREEN)
    good=["一人运营多平台的个人博主","追求流程可复现的效率派","已有 NAS/常开 Mac 的创作者","重视账号安全、抗拒交密码的人","需要数据复盘和转化归因的团队","会用 Claude Code 写文案的人"]
    yy=200
    for it in good:
        d.ellipse([88,yy+8,104,yy+24],outline=GREEN,width=2)
        t(d,(120,yy+16),it,font("Regular",19),(52,60,50),anchor="lm")
        yy+=58
    rr(d,(620,116,1140,580),14,fill=PANEL,outline=RED,width=2)
    t(d,(648,144),"要知道的边界",font("Bold",24),RED)
    bad=["主打 macOS，Windows 开机自启未适配","需常开一台机器和专用 Chrome","核心适配逻辑在 Chrome 插件（商店装）","5 天新项目，成熟度仍在快速迭代","无测试文件，靠作者实战 issue 迭代","依赖各平台页面稳定，改版需等更新"]
    yy=200
    for it in bad:
        d.ellipse([648,yy+8,664,yy+24],outline=RED,width=2)
        t(d,(680,yy+16),it,font("Regular",19),(72,54,50),anchor="lm")
        yy+=58
    rr(d,(60,616,1140,720),12,fill=PANEL2,outline=GOLD,width=1)
    t(d,(88,646),"MIT 协议可自由自用二开；它解决的是“重复填写和数据散乱”的效率问题，不替代内容创作本身——",font("Bold",19),GOLD,anchor="lm")
    t(d,(88,682),"能不能起号、能不能变现，仍取决于你的选题和内容质量",font("Bold",19),DEEP,anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover(); architecture(); safety(); data_loop(); limits()
print("ALL DONE")
