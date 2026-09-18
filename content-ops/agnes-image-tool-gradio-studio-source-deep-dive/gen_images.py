#!/usr/bin/env python3
"""agnes-image-tool 三端教程配图：封面×2 + 内文图×3。纯 Pillow 绘制，无中文出网。"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "agnes-image-tool-gradio-studio-source-deep-dive"
OPS_DIR = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
STATIC_DIR = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

BG      = (14, 16, 22)
BG_SOFT = (24, 27, 36)
CARD    = (32, 36, 48)
CARD2   = (40, 45, 60)
LINE    = (66, 74, 96)
TEXT    = (232, 236, 246)
DIM     = (150, 158, 178)
BLUE    = (109, 172, 255)
ORANGE  = (255, 168, 76)
GREEN   = (119, 221, 119)
PINK    = (255, 119, 168)
TEAL    = (0, 188, 212)
PURPLE  = (168, 130, 255)
YELLOW  = (230, 200, 110)

def resolve_font(size, bold=False):
    name = "NotoSansCJK-Bold.ttc" if bold else "NotoSansCJK-Regular.ttc"
    for p in [
        f"/usr/share/fonts/google-noto-cjk/{name}",
        f"/usr/share/fonts/opentype/noto/{name}",
        f"/usr/share/fonts/truetype/noto/{name}",
        f"/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
    ]:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def rr(d, xy, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def save(img, name):
    img.save(OPS_DIR / name)
    img.save(STATIC_DIR / name)
    print("  ok", name)

# ── 1. 微信封面 1280×544 ─────────────────────────────────────────────
def cover_wechat():
    W, H = 1280, 544
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # 顶部渐变横条
    for i in range(6):
        d.rectangle([0, i*3, W, i*3+3], fill=(20+i*8, 60+i*10, 120+i*14))
    f_tag  = resolve_font(26, bold=True)
    f_h    = resolve_font(64, bold=True)
    f_h2   = resolve_font(64, bold=True)
    f_sub  = resolve_font(30)
    f_small= resolve_font(24)
    # 标签
    rr(d, [64, 60, 360, 108], 10, fill=(30, 52, 84), outline=BLUE, width=2)
    d.text((84, 84), "开源实测 · Gradio 工作台", font=f_tag, fill=BLUE, anchor="lm")
    # 主标题（左栏安全宽度到 820，每行不超界）
    d.text((64, 160), "2379 行源码读完", font=f_h, fill=TEXT)
    d.text((64, 244), "一个开源工作台", font=f_h2, fill=TEXT)
    d.text((64, 328), "把 AI 出图和出视频", font=f_h2, fill=ORANGE)
    d.text((64, 412), "装进同一个网页", font=f_h2, fill=TEXT)
    # 底部事实条（右边界 820，避开窗口）
    d.text((64, 508), "agnes-image-tool · 29 Star · MIT", font=f_small, fill=DIM)
    # 右侧装饰：浏览器窗口
    x0, y0, x1, y1 = 868, 60, 1224, 484
    rr(d, [x0, y0, x1, y1], 14, fill=BG_SOFT, outline=LINE, width=2)
    rr(d, [x0, y0, x1, y0+44], 14, fill=CARD)
    d.rectangle([x0, y0+30, x1, y0+44], fill=CARD)
    for i, c in enumerate([(255,95,86),(255,189,46),(39,201,63)]):
        d.ellipse([x0+18+i*26, y0+14, x0+34+i*26, y0+30], fill=c)
    d.text((x0+110, y0+22), "localhost:7860", font=f_small, fill=DIM, anchor="lm")
    tabs = ["Text→Image", "Image→Image", "Text→Video", "Image→Video", "Multi-Image", "Batch", "History"]
    ty = y0+70
    for i, t in enumerate(tabs):
        col = [BLUE, PURPLE, PINK, TEAL, ORANGE, GREEN, YELLOW][i]
        rr(d, [x0+20, ty, x1-20, ty+40], 8, fill=CARD2, outline=col if i == 0 else None, width=2)
        d.text((x0+38, ty+20), t, font=resolve_font(20, bold=(i==0)), fill=col if i==0 else TEXT, anchor="lm")
        ty += 50
    save(img, "cover-wechat.jpg")

# ── 2. 知乎封面 1600×900 克制技术风 ──────────────────────────────────
def cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (18, 20, 27))
    d = ImageDraw.Draw(img)
    f_kick = resolve_font(30, bold=True)
    f_h    = resolve_font(76, bold=True)
    f_sub  = resolve_font(34)
    f_dim  = resolve_font(28)
    d.text((100, 130), "SOURCE-LEVEL REVIEW", font=f_kick, fill=(90, 110, 140))
    d.line([100, 180, 420, 180], fill=(90, 110, 140), width=3)
    d.text((100, 250), "agnes-image-tool：", font=f_h, fill=TEXT)
    d.text((100, 360), "一个 Gradio 全模态", font=f_h, fill=TEXT)
    d.text((100, 470), "创作工作台的源码实测", font=f_h, fill=BLUE)
    d.text((100, 620), "文生图 · 图生图 · 文生视频 · 图生视频 · 多图关键帧", font=f_sub, fill=DIM)
    d.text((100, 700), "模型 agnes-image-2.1-flash / agnes-video-v2.0   ·   29 Star   ·   MIT", font=f_dim, fill=DIM)
    # 右侧代码卡
    x0, y0, x1, y1 = 980, 200, 1500, 680
    rr(d, [x0, y0, x1, y1], 16, fill=(26, 30, 40), outline=(58, 66, 88), width=2)
    mono = resolve_font(26)
    lines = [
        ("$ git clone you-want/", DIM),
        ("    agnes-image-tool", DIM),
        ("$ pip install -r ", DIM),
        ("    requirements.txt", GREEN),
        ("  gradio / openai /", (120,128,148)),
        ("  requests / pillow", (120,128,148)),
        ("$ export AGNES_API_KEY=…", ORANGE),
        ("$ python app.py", BLUE),
        ("* Running on ", (120,128,148)),
        ("  http://0.0.0.0:7860", TEAL),
    ]
    ty = y0 + 44
    for txt, col in lines:
        d.text((x0+40, ty), txt, font=mono, fill=col, anchor="lm")
        ty += 42
    save(img, "cover-zhihu.png")

# ── 3. 功能矩阵图 ────────────────────────────────────────────────────
def diagram_tabs():
    W, H = 1280, 860
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_t = resolve_font(40, bold=True)
    f_c = resolve_font(26, bold=True)
    f_b = resolve_font(22)
    f_s = resolve_font(20)
    d.text((64, 50), "七个标签页：一张页面装完整条创作链", font=f_t, fill=TEXT)
    d.text((64, 108), "证据：app.py 中 7 个 gr.TabItem；模型常量见 config.py", font=f_b, fill=DIM)

    cards = [
        ("Text → Image", "文生图", ["agnes-image-2.1-flash", "1024² / 1024×1792 / 1792×1024", "支持 negative_prompt"], BLUE),
        ("Image → Image", "图生图", ["本地图直传 → Base64 Data URI", "strength 0.1–1.0 重绘强度", "同模型复用"], PURPLE),
        ("Text → Video", "文生视频", ["agnes-video-v2.0", "3/5/8/10/15/18 秒六档", "480p / 720p / 1080p"], PINK),
        ("Image → Video", "图生视频", ["⚠ 只吃公网可访问 URL", "本地图仅 API 同源时可用", "轮询任务态下载"], TEAL),
        ("Multi-Image", "多图视频", ["ti2vid 多图生视频", "keyframes 关键帧过渡", "每行一个图片 URL"], ORANGE),
        ("Batch + History", "批量/历史", ["每行一个提示词批量出图", "history.json 留存 100 条", "outputs/ 落盘可下载"], GREEN),
    ]
    cw, ch, gx, gy = 372, 200, 24, 22
    x0, y0 = 64, 160
    for i, (en, zh, bullets, col) in enumerate(cards):
        r, c = divmod(i, 3)
        x = x0 + c*(cw+gx); y = y0 + r*(ch+gy)
        rr(d, [x, y, x+cw, y+ch], 14, fill=CARD, outline=(58,66,88), width=1)
        d.rectangle([x, y+14, x+6, y+ch-14], fill=col)
        d.text((x+26, y+38), en, font=f_c, fill=col)
        d.text((x+cw-26, y+38), zh, font=f_s, fill=DIM, anchor="rm")
        ty = y+82
        for b in bullets:
            warn = b.startswith("⚠")
            d.text((x+26, ty), ("· " + b), font=f_s, fill=(YELLOW if warn else (190,198,216)))
            ty += 34
    # 底部结论条
    rr(d, [64, y0+2*(ch+gy)+10, W-64, y0+2*(ch+gy)+78], 12, fill=(30,40,34), outline=GREEN, width=2)
    d.text((88, y0+2*(ch+gy)+44), "读图结论：图像侧全本地可用；视频侧三处功能都依赖「公网 URL」，这是部署前最容易忽略的限制。",
           font=f_b, fill=GREEN, anchor="lm")
    save(img, "diagram-tabs.png")

# ── 8n+1 工程洞察 ────────────────────────────────────────────────────
def diagram_8n1():
    W, H = 1280, 720
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_t = resolve_font(40, bold=True)
    f_b = resolve_font(24)
    f_s = resolve_font(22)
    f_m = resolve_font(28, bold=True)
    d.text((64, 50), "工程洞察：视频帧数为什么被写死成 8n+1", font=f_t, fill=TEXT)
    d.text((64, 110), "config.py 的 DURATION_TO_FRAMES：81 / 121 / 201 / 241 / 361 / 441 —— 全部满足 8n+1", font=f_b, fill=DIM)

    # 左：公式卡
    rr(d, [64, 170, 600, 560], 16, fill=CARD, outline=PURPLE, width=2)
    d.text((100, 220), "api_client.py 的约束逻辑", font=f_m, fill=PURPLE)
    mono = resolve_font(22)
    code = [
        ("# 时长 → 帧数 (frame_rate=24)", (120,128,148)),
        ("3s  → 81   = 8×10+1", TEXT),
        ("5s  → 121  = 8×15+1", TEXT),
        ("8s  → 201  = 8×25+1", TEXT),
        ("10s → 241  = 8×30+1", TEXT),
        ("15s → 361  = 8×45+1", TEXT),
        ("18s → 441  = 8×55+1", YELLOW),
        ("", TEXT),
        ("# 再按分辨率的 max_frames 截断", (120,128,148)),
        ("# 找最接近的 8n+1 帧重对齐", (120,128,148)),
    ]
    ty = 280
    for t, c in code:
        d.text((100, ty), t, font=mono, fill=c, anchor="lm")
        ty += 36

    # 右：含义卡
    rr(d, [640, 170, 1216, 360], 16, fill=(38,30,44), outline=PINK, width=2)
    d.text((676, 214), "这意味着什么", font=f_m, fill=PINK)
    for i, b in enumerate([
        "视频模型按时间块（latent chunk）解码，每块 8 帧，",
        "首尾帧共享 → 合法帧数恒为 8n+1；自己裸调 API",
        "传 240 帧（10 秒 @24fps）会直接被拒或静默改片长。",
    ]):
        d.text((676, 262+i*32), b, font=f_s, fill=(210,200,222))
    rr(d, [640, 392, 1216, 560], 16, fill=(30,40,34), outline=GREEN, width=2)
    d.text((676, 436), "实用结论", font=f_m, fill=GREEN)
    for i, b in enumerate([
        "时长档位不是营销选项，是对模型硬约束的封装；",
        "想要精确片长，优先选预设档位而不是手算 fps×秒。",
    ]):
        d.text((676, 484+i*34), b, font=f_s, fill=(199,222,202))
    save(img, "diagram-8n1.png")

# ── 部署路径图 ───────────────────────────────────────────────────────
def diagram_deploy():
    W, H = 1280, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_t = resolve_font(40, bold=True)
    f_h = resolve_font(27, bold=True)
    f_b = resolve_font(22)
    f_s = resolve_font(20)
    d.text((64, 50), "四条部署路径：它本身不耗 GPU，算力全在 API 侧", font=f_t, fill=TEXT)
    d.text((64, 108), "推理发生在 apihub.agnes-ai.com，本地容器只跑 Gradio 界面与轮询 —— CPU basic 即可", font=f_b, fill=DIM)

    paths = [
        ("本地直跑", "python app.py", ["pip install 四个依赖", ":7860 自测/截图最快", "Key 走环境变量"], BLUE, "5 分钟"),
        ("Docker Compose", "docker compose up -d", ["supervisord 托管", "4G 内存上限/健康检查", "outputs 挂载持久化"], TEAL, "10 分钟"),
        ("HF Spaces", "Gradio SDK + Secret", ["CPU basic 免费档够用", "AGNES_API_KEY 填 Secret", "无休眠、原生 Gradio"], GREEN, "15 分钟"),
        ("VPS + Nginx", "systemd / TLS", ["反代需开 WebSocket 升级", "proxy_read_timeout 拉长", "视频轮询 1–10 分钟不断连"], ORANGE, "40 分钟"),
    ]
    cw, ch = 278, 460
    x0, y0, gx = 64, 170, 24
    for i, (title, cmd, bullets, col, mins) in enumerate(paths):
        x = x0 + i*(cw+gx)
        rr(d, [x, y0, x+cw, y0+ch], 16, fill=CARD, outline=col, width=2)
        d.text((x+22, y0+40), title, font=f_h, fill=col)
        rr(d, [x+cw-96, y0+20, x+cw-20, y0+56], 8, fill=(28,32,44))
        d.text((x+cw-58, y0+38), mins, font=f_s, fill=YELLOW, anchor="mm")
        rr(d, [x+18, y0+78, x+cw-18, y0+128], 8, fill=(20,23,31))
        d.text((x+34, y0+103), cmd, font=resolve_font(19), fill=(180,210,255), anchor="lm")
        ty = y0+160
        for b in bullets:
            d.text((x+22, ty), "· " + b, font=f_s, fill=(196,204,220))
            ty += 52
        if i < 3:
            d.polygon([(x+cw+4, y0+ch//2-8), (x+cw+18, y0+ch//2), (x+cw+4, y0+ch//2+8)], fill=LINE)
    rr(d, [64, y0+ch+24, W-64, y0+ch+92], 12, fill=(44,34,26), outline=ORANGE, width=2)
    d.text((88, y0+ch+44), "避坑：图生视频/多图视频只吃公网图片 URL —— localhost 部署时这三个 Tab 实际不可用。",
           font=f_b, fill=ORANGE, anchor="lm")
    d.text((88, y0+ch+76), "HF Spaces 同理，需先把参考图放到外链图床。",
           font=f_b, fill=ORANGE, anchor="lm")
    save(img, "diagram-deploy.png")

if __name__ == "__main__":
    cover_wechat()
    cover_zhihu()
    diagram_tabs()
    diagram_8n1()
    diagram_deploy()
    print("done ->", OPS_DIR)
