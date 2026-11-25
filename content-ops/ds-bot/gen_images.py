#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fei-Craft/DS-Bot 三端推广配图
暖琥珀 + 深石墨「团队组织」风（区别于协议靛蓝/模型深空蓝/画廊紫）
01 长生命周期 bot 团队组织架构（Chief/成员/群聊/隐私bot）
02 群聊 token 经济学（管理员默认回复 vs 全员推理）
03 四形态部署与全链路能力地图
04 安全模型与适用判断（信任边界/谁该用谁缓行）
严格 yy += 游标、手动语义断行、先画底再写字、Noto Sans CJK。
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FM = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Medium.ttc"
def F(s, w="b"):
    return ImageFont.truetype({"b": FB, "m": FM, "r": FR}[w], s)

PAPER=(248,245,240); CARD=(255,255,255); INK=(38,34,30); INK2=(96,88,80); GREY=(148,140,132); LINE=(230,224,214)
GRAPHITE=(42,40,46)
AMBER=(200,138,42); AMBERBG=(252,244,228)
TERRA=(190,86,60); TERRABG=(251,236,231)
SAGE=(74,140,110); SAGEBG=(232,244,237)
SLATE=(72,104,148); SLATEBG=(232,239,248)
PLUM=(140,92,158); PLUMBG=(245,235,248)

def make(w,h):
    img=Image.new("RGB",(w,h),PAPER); return img,ImageDraw.Draw(img)
def rrect(d,box,fill,outline=None,w=2):
    d.rounded_rectangle(box,radius=16,fill=fill,outline=outline,width=w)
def title(d,w,main,sub,accent=AMBER):
    d.rectangle([0,0,w,134],fill=GRAPHITE); d.rectangle([0,134,w,140],fill=accent)
    d.text((56,32),main,font=F(38),fill=(248,245,240))
    d.text((56,90),sub,font=F(23,"r"),fill=(190,184,176))

# ===== 图1：bot 团队组织架构 =====
def fig1():
    w,h=1280,1000
    img,d=make(w,h)
    title(d,w,"一支有编制的 bot 团队：身份、记忆、权限都是持久的","关掉窗口也不散——每个 bot 是长生命周期身份，不是一次性会话")
    # 顶层 Main Bot
    rrect(d,[440,180,840,300],GRAPHITE,GRAPHITE)
    d.text((640,212),"Main Bot · Chief",font=F(28,"b"),fill=AMBER,anchor="mm")
    d.text((640,256),"最高权限：创建/修改/停用其他 bot、管群聊",font=F(20,"r"),fill=(210,205,198),anchor="mm")
    # 连接线
    d.line([640,300,640,340],fill=GREY,width=3)
    d.line([180,340,1100,340],fill=GREY,width=3)
    # 成员 bot 卡片
    members=[
        ("程序员 Bot","独立工作文件夹\n记忆你的代码偏好",SLATE,SLATEBG),
        ("写手 Bot","专属模型与思考强度\n可长期固定不切换",AMBER,AMBERBG),
        ("本地 Agent","接入 Claude Code/Codex\n等 10 种 CLI，用其套餐",SAGE,SAGEBG),
        ("隐私 Bot","文件夹/记忆/聊天隔离\n外发动作必须人工批准",TERRA,TERRABG),
    ]
    cw,gap=272,24; x0,y0,ch=56,380,240
    for i,(name,desc,col,bg) in enumerate(members):
        x=x0+i*(cw+gap)
        d.line([x+cw//2,340,x+cw//2,y0],fill=GREY,width=3)
        rrect(d,[x,y0,x+cw,y0+ch],bg,col)
        d.rounded_rectangle([x,y0,x+cw,y0+64],radius=16,fill=col)
        d.rectangle([x,y0+40,x+cw,y0+64],fill=col)
        d.text((x+cw//2,y0+32),name,font=F(22,"b"),fill=(255,255,255),anchor="mm")
        l1,l2=desc.split("\n")
        d.text((x+20,y0+96),l1,font=F(19,"r"),fill=INK2)
        d.text((x+20,y0+132),l2,font=F(19,"r"),fill=INK2)
        d.text((x+20,y0+190),"持久记忆 + 独立会话",font=F(17,"m"),fill=col)
    # 群聊层
    rrect(d,[56,680,1224,800],PLUMBG,PLUM)
    d.text((88,706),"群聊（多 bot 协作）",font=F(24,"b"),fill=PLUM)
    d.text((88,750),"管理员默认回复 · @ 直连成员 · bot 间派活 · Goal 模式先对齐验收标准再拆阶段",font=F(20,"r"),fill=INK2)
    # 底部持久化
    rrect(d,[56,830,1224,930],CARD,LINE,1)
    d.text((88,856),"数据全部在本机：桌面端 ~/.ds-bot，插件版在 dsh 主目录的 bot/ 与 sessions/",font=F(21,"m"),fill=INK)
    d.text((88,896),"卸载应用不会删除数据；每个 bot 上下文满了自动开新会话，历史会话保持可读",font=F(19,"r"),fill=GREY)
    img.save(os.path.join(OUT,"01-team-org.png")); print("01-team-org.png")

# ===== 图2：群聊 token 经济学 =====
def fig2():
    w,h=1280,980
    img,d=make(w,h)
    title(d,w,"群聊最怕烧钱：DS-Bot 的 token 经济学","同样 5 个 bot 的群，两种做法的推理调用量天差地别")
    # 左：朴素做法
    rrect(d,[56,180,618,760],TERRABG,TERRA)
    d.rounded_rectangle([56,180,618,246],radius=16,fill=TERRA); d.rectangle([56,222,618,246],fill=TERRA)
    d.text((84,192),"朴素做法：每条消息全员推理",font=F(25,"b"),fill=(255,255,255))
    yy=290
    for i in range(5):
        rrect(d,[88,yy,586,yy+62],CARD,TERRA,1)
        d.text((112,yy+31),f"Bot {i+1} 各推理一次",font=F(21,"r"),fill=INK2,anchor="lm")
        d.text((560,yy+31),"×1",font=F(21,"b"),fill=TERRA,anchor="rm")
        yy+=78
    rrect(d,[88,690,586,742],TERRA,TERRA)
    d.text((337,716),"每条用户消息 = 5 次模型调用",font=F(22,"b"),fill=(255,255,255),anchor="mm")
    # 右：DS-Bot
    rrect(d,[662,180,1224,760],SAGEBG,SAGE)
    d.rounded_rectangle([662,180,1224,246],radius=16,fill=SAGE); d.rectangle([662,222,1224,246],fill=SAGE)
    d.text((690,192),"DS-Bot：管理员闸门 + 显式 @",font=F(25,"b"),fill=(255,255,255))
    rows=[("管理员 Bot 默认回复","常规消息只 1 次调用"),
          ("@ 某个成员才直连","谁被 @ 谁推理"),
          ("bot 派活走异步任务","接活方独立完成后回群"),
          ("Goal 模式分阶段验收","按里程碑而非轮次烧钱"),
          ("普通成员零推理","安静待命不花 token")]
    yy=280
    for a,b in rows:
        rrect(d,[694,yy,1192,yy+72],CARD,SAGE,1)
        d.text((718,yy+18),a,font=F(21,"b"),fill=INK)
        d.text((718,yy+46),b,font=F(18,"r"),fill=GREY)
        yy+=86
    # 底部结论
    rrect(d,[56,800,1224,910],GRAPHITE,GRAPHITE)
    d.text((88,826),"效果：多角色协作保留，常规对话的推理量压回接近单人对话",font=F(23,"b"),fill=AMBER)
    d.text((88,868),"这正是组织管理里的「管理幅度」原则——把 token 花在真正需要的执行者上",font=F(20,"r"),fill=(200,195,188))
    img.save(os.path.join(OUT,"02-token-economics.png")); print("02-token-economics.png")

# ===== 图3：四形态部署 + 能力地图 =====
def fig3():
    w,h=1280,1060
    img,d=make(w,h)
    title(d,w,"一套内核四种形态：从桌面插件到 NAS 服务器","能力挂在 bot 上，形态按场景选")
    # 上：四形态
    forms=[
        ("dsh 插件","npm 包 ds-bot\nDesktop/Web 均可",SLATE,SLATEBG),
        ("Electron 桌面端","Win/macOS/Linux\n自带 pin 版 dsh",AMBER,AMBERBG),
        ("Docker","NAS/服务器\n端口 13080",SAGE,SAGEBG),
        ("移动 + 中继","Expo App/浏览器\nE2EE 配对",PLUM,PLUMBG),
    ]
    cw,gap=276,15; x0,y0=56,180
    for i,(name,desc,col,bg) in enumerate(forms):
        x=x0+i*(cw+gap)
        rrect(d,[x,y0,x+cw,y0+150],bg,col)
        d.text((x+22,y0+24),name,font=F(23,"b"),fill=col)
        l1,l2=desc.split("\n")
        d.text((x+22,y0+74),l1,font=F(19,"r"),fill=INK2)
        d.text((x+22,y0+106),l2,font=F(19,"r"),fill=INK2)
    # 下：能力地图（两列）
    d.text((56,376),"Bot 能力地图",font=F(27,"b"),fill=INK)
    caps_l=[("浏览器","独立浏览器/独立登录态，发帖下载需批准"),
            ("电脑操控","三档权限，顶栏指示条可随时接管"),
            ("Office","docx/pptx/xlsx 创建修改+渲染自检"),
            ("联网搜索","按会话路由 key，官方 Search API")]
    caps_r=[("IM 接入","微信/飞书/钉钉/企微/QQ/TG/Discord/Slack"),
            ("MCP 访问","本地客户端持令牌，按 bot 授权"),
            ("连接器","GitHub/Gmail/邮箱/远程 MCP，凭据脱敏"),
            ("定时与图表","定时任务、回复内画图表表格表单")]
    for col_i,caps in enumerate([caps_l,caps_r]):
        xx=56+col_i*600
        yy=430
        for name,desc in caps:
            rrect(d,[xx,yy,xx+568,yy+104],CARD,LINE,1)
            d.ellipse([xx+22,yy+38,xx+46,yy+62],fill=AMBER)
            d.text((xx+64,yy+24),name,font=F(22,"b"),fill=INK)
            d.text((xx+64,yy+62),desc,font=F(18,"r"),fill=INK2)
            yy+=120
    rrect(d,[56,960,1224,1020],AMBERBG,AMBER)
    d.text((84,976),"本地 Agent 还可接入 Claude Code、Codex、Cursor 等 10 种 CLI，复用其登录与套餐",font=F(20,"m"),fill=AMBER,anchor="lm")
    img.save(os.path.join(OUT,"03-deploy-capabilities.png")); print("03-deploy-capabilities.png")

# ===== 图4：安全模型与适用判断 =====
def fig4():
    w,h=1280,1120
    img,d=make(w,h)
    title(d,w,"先看安全模型再上手：它防什么、不防什么","权限是代码级强制，不是 UI 提示——但边界也要看清")
    # 上：防线
    rrect(d,[56,178,1224,560],CARD,LINE,1)
    d.text((84,200),"已落地的控制（SECURITY_MODEL.md 实测）",font=F(25,"b"),fill=INK)
    controls=[
        "Main Bot 分权：tools.js 用 rt.isMain / isAdminOf 代码强制",
        "密钥：secrets.json 权限 600，可选 scrypt+AES-256-GCM 静态加密",
        "密钥脱敏：对模型输出、日志、出站请求自动 redaction",
        "隐私 Bot：其他 bot 读不到其文件夹/记忆/会话，外发需人工批准",
        "连接器拒绝非 HTTPS；HTML widget 走 sandbox iframe",
        "Electron：contextIsolation + 独立 partition，Cookie 只存主进程",
    ]
    yy=248
    for i,c in enumerate(controls):
        col=SAGE if i%2==0 else SLATE
        d.ellipse([88,yy+8,104,yy+24],fill=col)
        d.text((122,yy),c,font=F(20,"r"),fill=INK2)
        yy+=48
    # 中：诚实披露的不防项
    rrect(d,[56,584,1224,760],TERRABG,TERRA)
    d.text((84,606),"维护者明确承认的边界",font=F(24,"b"),fill=TERRA)
    limits=["静态加密不保护运行中的进程（内存里必须有明文）",
            "Docker 版默认 danger-full-access + 免审批，容器即沙箱",
            "隐私 Bot 只隔离团队内 bot，不防系统级文件/联网权限",
            "微信/QQ 受平台限制，仅能在你发言后的时间窗内回复"]
    yy=650
    for t in limits:
        d.text((104,yy),"· "+t,font=F(19,"r"),fill=INK2); yy+=30
    # 下：适合/缓行
    rrect(d,[56,786,620,1010],SAGEBG,SAGE)
    d.rounded_rectangle([56,786,620,848],radius=16,fill=SAGE); d.rectangle([56,826,620,848],fill=SAGE)
    d.text((84,798),"适合现在上手",font=F(27,"b"),fill=(255,255,255))
    yy=878
    for t in ["已在用 dsh/编程 CLI 的重度用户","需要多角色长期分工的小团队","要接 8 个 IM 且无公网 IP","重视数据本地化与可读安全模型"]:
        d.ellipse([86,yy+9,100,yy+23],fill=SAGE); d.text((116,yy),t,font=F(20,"r"),fill=INK); yy+=52
    rrect(d,[662,786,1224,1010],TERRABG,TERRA)
    d.rounded_rectangle([662,786,1224,848],radius=16,fill=TERRA); d.rectangle([662,826,1224,848],fill=TERRA)
    d.text((690,798),"建议先缓一缓",font=F(27,"b"),fill=(255,255,255))
    yy=878
    for t in ["要稳定生产环境（v0.3 预览/391 issue）","非技术用户（签名拦截/Cookie/Wayland 坑）","单机器人需求，组织架构属过度设计","没预算意识：群聊会放大 API 费用"]:
        d.ellipse([692,yy+9,706,yy+23],fill=TERRA); d.text((722,yy),t,font=F(20,"r"),fill=INK); yy+=52
    # 底注
    d.text((56,1050),"注：独立社区项目，非 DeepSeek 官方；消耗的是你自己的模型额度，重要操作需自行复核。",font=F(18,"r"),fill=GREY)
    img.save(os.path.join(OUT,"04-security-verdict.png")); print("04-security-verdict.png")

if __name__=="__main__":
    fig1(); fig2(); fig3(); fig4()
    print("ALL DONE ->",OUT)
