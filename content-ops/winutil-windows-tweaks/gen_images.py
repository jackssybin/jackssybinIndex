# -*- coding: utf-8 -*-
"""WinUtil 配图：Windows 蓝工程风（深靛蓝底 + 微软蓝 + 青色 + 琥珀），契合系统工具主题。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/winutil-windows-tweaks"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

BG = (14, 20, 34); PANEL = (22, 31, 52); PANEL2 = (32, 44, 72); LINE = (58, 74, 110)
BLUE = (77, 138, 255); CYAN = (62, 200, 220); AMBER = (245, 184, 88); ROSE = (240, 118, 128)
LIME = (138, 220, 152); LBLUE = (158, 190, 255); WHITE = (234, 240, 250); MUTED = (150, 164, 192)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=BLUE)
    t(d, (110, 92), "6.6 万 Star 的 Windows 装机瑞士军刀", font("Black", 52), WHITE)
    t(d, (110, 174), "WinUtil：一条命令跑起来的开源 Windows 调优工具", font("Bold", 27), LBLUE)
    t(d, (110, 214), "装软件、去臃肿、修系统、管更新，全在一个界面", font("Regular", 23), MUTED)
    pts = [("239 个软件一键装 / 卸载", "基于 winget，另支持 Chocolatey，覆盖浏览器、开发工具到日常应用"),
           ("480 项系统调整 + 201 个预装移除", "注册表 tweaks 分组分级，高级危险项单独 CAUTION 标注"),
           ("可还原、可自动化、可测试", "49 组带原始值可 undo，三档预设，63 个 Pester 测试把关")]
    y = 292
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=CYAN)
        t(d, (150, y), a, font("Bold", 27), CYAN)
        t(d, (150, y + 42), b, font("Regular", 22), MUTED)
        y += 110
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "6.6 万"), ("Fork", "3884"), ("语言", "PowerShell"), ("PS1 文件", "194"),
            ("代码行", "2.98 万"), ("测试", "63 个"), ("协议", "MIT")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 22), AMBER, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-13 仓库源码实测 · 系统级工具须管理员运行，调整前建议先建还原点", font("Medium", 20), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def modules():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "一个 GUI 里的四大能力板块", font("Black", 30), WHITE)
    cards = [
        ("软件 Install", "239 个应用", ["winget / Chocolatey 双引擎", "按分类勾选、批量安装升级", "显示已装、支持卸载", "每个应用配独立图标"], BLUE),
        ("调整 Tweaks", "480 项 / 69 组", ["注册表项分组管理", "Essential 与 Advanced 分级", "危险项 CAUTION 单独区", "49 组记录原始值可还原"], CYAN),
        ("预装 Appx", "201 项 / 34 组", ["移除 UWP 捆绑软件", "Teams/Outlook/Clipchamp 等", "可按 AppxDefault 预设处理", "误删可从商店重装"], AMBER),
        ("修复与更新", "Fixes / Updates", ["网络重置、NTP 校时", "winget 损坏修复、系统修复", "更新策略默认/安全/禁用", "Windows 功能与 SSH 服务"], ROSE),
    ]
    bw, bh = 252, 470
    gap = 18
    x, y = 60, 120
    for i, (h, num, items, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + 18, y + 26), h, font("Bold", 21), c)
        t(d, (xx + 18, y + 62), num, font("Black", 26), WHITE)
        yy = y + 118
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 16), (206, 216, 234))
            yy += 56
    rr(d, (60, 630, 1140, 710), 12, fill=PANEL2, outline=BLUE, width=1)
    t(d, (88, 658), "界面用 WPF + XAML 绘制，后台任务走 Runspace 池不卡 UI；配置全部来自 config/*.json，", font("Bold", 19), LBLUE, anchor="lm")
    t(d, (88, 690), "数据与逻辑分离，每个勾选框背后都能在 JSON 和文档站找到对应说明", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/modules.png"); print("modules.png")

def compile_flow():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "一条 irm 命令背后：单文件是怎么编译出来的", font("Black", 29), WHITE)
    steps = [("源码仓库", "functions/ 函数\nconfig/ JSON 配置\nxaml/ 界面\npester/ 测试", BLUE),
             ("Compile.ps1", "合并所有 ps1\n内嵌 JSON 与图标\n(base64)\n注入 XAML", CYAN),
             ("CI 发布", "GitHub Actions\nWindows  runner\n生成 winutil.ps1", AMBER),
             ("用户执行", "irm christitus.com/win\n| iex 内存加载\n管理员运行 GUI", LIME)]
    bw, bh = 252, 360
    gap = 18
    x, y = 60, 150
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 42), h, font("Bold", 21), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 104
        for ln in lines:
            t(d, (xx + 18, yy), ln, font("Regular", 16), (208, 218, 236))
            yy += 46
        if i < 3:
            t(d, (xx + bw + gap - 2, y + bh / 2), "→", font("Bold", 24), MUTED, anchor="mm")
    rr(d, (60, 556, 1140, 660), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 586), "irm|iex 是 PowerShell 常见的内存执行方式：脚本不落盘直接运行，方便但也意味着你把系统权限交给了远程脚本；", font("Bold", 18), AMBER, anchor="lm")
    t(d, (88, 622), "稳妥做法是先下载 winutil.ps1 通读、或自行 Compile 构建，确认来源是官方仓库再运行", font("Bold", 18), ROSE, anchor="lm")
    t(d, (60, 696), "据 Compile.ps1 与 .github/workflows/pre-release.yaml 源码整理", font("Medium", 18), MUTED)
    img.save(f"{OUT}/compile-flow.png"); print("compile-flow.png")

def safety():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "敢动系统的工具，安全设计怎么兜底", font("Black", 29), WHITE)
    # 左：防护
    rr(d, (60, 116, 580, 580), 14, fill=PANEL, outline=LIME, width=2)
    t(d, (88, 144), "它做对的防护", font("Bold", 24), LIME)
    good = ["执行 tweaks 前可先建系统还原点", "49 组 tweak 记录注册表原始值", "提供 Undo All 一键回退所选调整", "高级危险项单独 CAUTION 分区", "63 个 Pester 测试覆盖核心逻辑", "全部配置开源、文档站逐项可查"]
    yy = 200
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=LIME, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (214, 224, 238), anchor="lm")
        yy += 58
    # 右：风险
    rr(d, (620, 116, 1140, 580), 14, fill=PANEL, outline=ROSE, width=2)
    t(d, (648, 144), "你仍需自己把关", font("Bold", 24), ROSE)
    bad = ["必须管理员权限，影响整机", "irm|iex 远程脚本本身有信任风险", "注册表/服务调整可能引发兼容问题", "移除 Appx 可能影响商店与组件更新", "去 Edge/OneDrive 类操作难完全逆转", "不同 Windows 版本效果有差异"]
    yy = 200
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=ROSE, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (224, 214, 216), anchor="lm")
        yy += 58
    rr(d, (60, 616, 1140, 720), 12, fill=PANEL2, outline=CYAN, width=1)
    t(d, (88, 646), "建议用法：新装机或虚拟机里跑 Standard/Minimal 预设起步，Advanced 逐项确认；", font("Bold", 19), CYAN, anchor="lm")
    t(d, (88, 682), "动系统前先开还原点，企业办公机不要直接套用去臃肿和禁用更新类调整", font("Bold", 19), AMBER, anchor="lm")
    img.save(f"{OUT}/safety.png"); print("safety.png")

def presets():
    W, H = 1200, 720
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "三档预设 + 自动化：不打开 GUI 也能批量部署", font("Black", 28), WHITE)
    cards = [
        ("Minimal", "4 项", "最小改动，适合所有用户", ["关遥测", "关消费者功能", "优化服务", "禁用 WPBT"], CYAN),
        ("Standard", "12 项", "大多数人的平衡默认", ["含 Minimal 全部", "加位置/活动历史", "磁盘清理/临时文件", "任务栏结束任务等"], BLUE),
        ("Advanced", "17 项", "进阶用户的深度调整", ["含 Standard 全部", "默认先建还原点", "更多系统级 tweak", "需逐项理解再用"], ROSE),
    ]
    bw, bh = 340, 400
    gap = 30
    x, y = 60, 128
    for i, (h, num, sub, items, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + 24, y + 28), h, font("Black", 26), c)
        t(d, (xx + 24, y + 72), num, font("Bold", 22), WHITE)
        t(d, (xx + 24, y + 110), sub, font("Regular", 17), MUTED)
        yy = y + 158
        for it in items:
            t(d, (xx + 24, yy), "· " + it, font("Regular", 17), (210, 220, 238))
            yy += 50
    rr(d, (60, 566, 1140, 660), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 596), "命令行自动化：-Preset Standard 可无界面套用预设，适合装机脚本与批量部署；", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 632), "每个预设具体改了什么，config/preset.json 与官方文档全部公开可审计", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/presets.png"); print("presets.png")

zhihu_cover()
modules()
compile_flow()
safety()
presets()
print("ALL DONE")
