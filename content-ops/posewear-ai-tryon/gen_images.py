# -*- coding: utf-8 -*-
"""PoseWear 配图：时尚杂志亮底风（奶油底 + 墨黑 + 品牌红 + 暖金），区别于前几篇科技暗风。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/posewear-ai-tryon"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

CREAM = (247, 242, 234); INK = (30, 28, 30); PANEL = (255, 252, 247); PANEL2 = (240, 233, 224)
LINE = (214, 202, 188); RED = (224, 58, 76); GOLD = (192, 144, 58); TEAL = (38, 132, 124)
PLUM = (126, 78, 110); GRAY = (110, 102, 98); WHITE = (255, 255, 255)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 8], fill=RED)
    t(d, (110, 92), "不注册、不留 Key 的浏览器试衣间", font("Black", 52), INK)
    t(d, (110, 172), "衣姿 PoseWear：姿势/服装/人像参考图库，用自己的 API Key 在浏览器直接 AI 试穿", font("Bold", 26), PLUM)
    pts = [("三套参考图库 + 1439 个深度姿势", "姿势线稿、服装分类、CC0 人像，每张附中英文提示词"),
           ("四家图像服务商自由切换", "OpenAI / Gemini / 豆包 Seedream / 自定义中转"),
           ("密钥收藏记录全留本地", "无后端无数据库，IndexedDB 存储，离线 PWA 可安装")]
    y = 292
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=GOLD)
        t(d, (150, y), a, font("Bold", 27), RED)
        t(d, (150, y + 42), b, font("Regular", 22), GRAY)
        y += 110
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "108"), ("Fork", "42"), ("语言", "Python+JS"), ("代码", "原生无框架"),
            ("深度姿势", "1439"), ("服务商", "4 家"), ("协议", "MIT")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), GRAY)
        t(d, (1455, yy), v, font("Bold", 22), GOLD, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-13 仓库源码实测 · 代码 MIT 但素材版权归原作者，商用需单独授权", font("Medium", 20), GRAY)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def flow():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    t(d, (60, 34), "一次 AI 试穿怎么发生：从挑素材到出图", font("Black", 30), INK)
    steps = [("① 选素材", "姿势库+服装库\n挑中加入托盘\n复制中英文提示词", RED),
             ("② 传照片", "上传自己的人物照\n或不用照片直接出图\n本地读取不上传", PLUM),
             ("③ 选服务商", "填自己的 API Key\n四选一或自定义中转\nKey 只存 localStorage", TEAL),
             ("④ 中性化", "默认开启减少误拦截\n敏感词改电商措辞\n不改服装和姿势", GOLD),
             ("⑤ 生成对比", "一次可出多张\n前后对比/单张/打包\n记录存 IndexedDB", RED)]
    bw, bh = 208, 400
    gap = 14
    x, y = 50, 128
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 42), h, font("Bold", 20), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 104
        for ln in lines:
            t(d, (xx + 16, yy), ln, font("Regular", 16), (70, 64, 66))
            yy += 50
        if i < 4:
            t(d, (xx + bw + gap - 1, y + bh / 2), "→", font("Bold", 22), GRAY, anchor="mm")
    rr(d, (50, 570, 1150, 666), 12, fill=PANEL2, outline=RED, width=1)
    t(d, (78, 600), "默认浏览器直连服务商官方接口；只有开启代理或用豆包（跨域）才走 /api/proxy，", font("Bold", 19), RED, anchor="lm")
    t(d, (78, 636), "代理只原样转发、不记录不存密钥，且拒绝内网地址并按 IP 限流", font("Regular", 18), GRAY, anchor="lm")
    t(d, (50, 704), "据 src/studio.js 与 functions/api/proxy.js 源码整理", font("Medium", 18), GRAY)
    img.save(f"{OUT}/flow.png"); print("flow.png")

def neutral():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    t(d, (60, 34), "“减少误拦截”怎么做到的：一套双语替换表", font("Black", 29), INK)
    t(d, (60, 86), "只改写发给服务商的措辞，服装、姿势、参考图一律不动；可一键关闭按原文发送", font("Regular", 20), GRAY)
    # 左：替换前
    rr(d, (60, 140, 580, 560), 14, fill=PANEL, outline=PLUM, width=2)
    t(d, (88, 168), "原始提示词（易触发审核）", font("Bold", 22), PLUM)
    before = ["性感 / 火辣 / 诱惑", "紧身 / 低胸 / 露背", "比基尼 / 泳装", "情趣内衣 / 内衣", "透视 / 裸露", "凸显身材曲线"]
    yy = 226
    for it in before:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=PLUM, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (80, 72, 74), anchor="lm")
        yy += 52
    # 右：替换后
    rr(d, (620, 140, 1140, 560), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (648, 168), "中性化后（电商目录口吻）", font("Bold", 22), TEAL)
    after = ["时尚 / stylish", "修身 / V 领 / 开背设计", "泳池边时装", "内搭 / loungewear", "薄纱拼接（露骨词删除）", "相关描述整句移除"]
    yy = 226
    for it in after:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=TEAL, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (60, 72, 70), anchor="lm")
        yy += 52
    rr(d, (60, 600, 1140, 700), 12, fill=PANEL2, outline=GOLD, width=1)
    t(d, (88, 630), "中英文各一套正则（NEUTRAL 数组），并统一加上专业电商试穿的框架提示词；", font("Bold", 19), GOLD, anchor="lm")
    t(d, (88, 666), "它降低正常穿搭被误判的概率，但明确不绕过对真正违规内容的审核", font("Regular", 18), GRAY, anchor="lm")
    img.save(f"{OUT}/neutral.png"); print("neutral.png")

def security():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    t(d, (60, 34), "隐私与安全：一个静态站的自我修养", font("Black", 29), INK)
    cards = [
        ("密钥不上服务器", ["Key 只存浏览器 localStorage", "默认直连官方接口", "可随时在设置里清除"], RED),
        ("代理四道闸", ["同源 Origin/Referer 校验", "只转发官方域名白名单", "拒绝内网/非标 https", "每 IP 60 秒限流"], TEAL),
        ("严格 CSP 头", ["connect-src 限定厂商域名", "object-src none 禁插件", "frame-ancestors none 防嵌套", "脚本走哈希白名单"], PLUM),
        ("数据留在本机", ["收藏/最近/历史用 IndexedDB", "Service Worker 离线缓存", "支持导入导出与删除撤销", "无账号无后端数据库"], GOLD),
    ]
    bw, bh = 252, 380
    gap = 18
    x, y = 60, 128
    for i, (h, items, c) in enumerate(cards):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 14, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 44), h, font("Bold", 20), c, anchor="mm")
        yy = y + 104
        for it in items:
            t(d, (xx + 18, yy), "· " + it, font("Regular", 16), (70, 64, 66))
            yy += 52
    rr(d, (60, 550, 1140, 650), 12, fill=PANEL2, outline=RED, width=1)
    t(d, (88, 582), "代理与 CSP 规则均可在 functions/api/proxy.js、post.py 生成的 _headers 中逐行核对，", font("Bold", 19), RED, anchor="lm")
    t(d, (88, 618), "不是口头承诺；公共电脑用完仍建议手动清除本地 Key", font("Regular", 18), GRAY, anchor="lm")
    t(d, (60, 690), "深度姿势图片为热链原站、不进仓库；人像为 AI 虚构 CC0，勿冒充真人", font("Medium", 18), GRAY)
    img.save(f"{OUT}/security.png"); print("security.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), CREAM); d = ImageDraw.Draw(img)
    t(d, (60, 34), "上手前看清：轻量工具的能与不能", font("Black", 29), INK)
    rr(d, (60, 116, 580, 580), 14, fill=PANEL, outline=TEAL, width=2)
    t(d, (88, 144), "它适合什么", font("Bold", 24), TEAL)
    good = ["电商/自媒体快速出穿搭参考", "想用自己 Key、不愿注册平台的人", "需要海量姿势和服装灵感", "看重隐私、希望数据留本地", "想自部署一个纯静态站点", "需要中英文提示词的创作者"]
    yy = 200
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=TEAL, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (64, 70, 68), anchor="lm")
        yy += 58
    rr(d, (620, 116, 1140, 580), 14, fill=PANEL, outline=RED, width=2)
    t(d, (648, 144), "要知道的边界", font("Bold", 24), RED)
    bad = ["仓库不含素材，需先跑脚本下载数 GB", "生成费用按你选的服务商计费", "OpenAI 审核最严，真人照易被拦", "素材图片非 MIT，商用要找原作者", "深度姿势依赖原站热链", "项目很新（10 月底建仓）生态待成熟"]
    yy = 200
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=RED, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (80, 66, 68), anchor="lm")
        yy += 58
    rr(d, (60, 616, 1140, 716), 12, fill=PANEL2, outline=GOLD, width=1)
    t(d, (88, 646), "许可边界要分清：代码/文案/构建脚本是 MIT；姿势与服装图版权归 @giaaibusi，", font("Bold", 19), GOLD, anchor="lm")
    t(d, (88, 682), "原站未标开放许可；人像 CC0 但原作者希望不要原样批量转载，自部署需保留来源署名", font("Bold", 19), GOLD, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
flow()
neutral()
security()
limits()
print("ALL DONE")
