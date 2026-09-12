#!/usr/bin/env python3
"""Jellyfish 教程配图生成：两版封面 + 3 张正文架构图。"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SLUG = "jellyfish-ai-short-drama-studio-source-deep-dive"
OPS_DIR = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
STATIC_DIR = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

BG        = (14, 16, 22)
CARD      = (32, 36, 48)
LINE      = (66, 74, 96)
TEXT      = (232, 236, 246)
DIM       = (150, 158, 178)
BLUE      = (109, 172, 255)
ORANGE    = (255, 168, 76)
GREEN     = (119, 221, 119)
PINK      = (255, 119, 168)
TEAL      = (0, 188, 212)
PURPLE    = (160, 130, 255)

FONT_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
]

def resolve_font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def resolve_font_bold(size):
    for regular in FONT_PATHS:
        if not os.path.exists(regular):
            continue
        base = os.path.splitext(regular)[0]
        for cand in (f"{base}-Bold.ttc", f"{base}-Black.ttc"):
            if os.path.exists(cand):
                try:
                    return ImageFont.truetype(cand, size, encoding="unic")
                except Exception:
                    pass
        return resolve_font(size)
    return resolve_font(size)

def T(draw, xy, text, font, fill, anchor="lm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

def rr(draw, xy, radius, fill, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def save(img, name):
    img.save(OPS_DIR / name)
    img.save(STATIC_DIR / name)
    print(f"  ok {name} ({(OPS_DIR / name).stat().st_size//1024} KB)")

# ── 微信封面：浅色 + 右侧真实 UI 截图 ──────────────────────────────
def draw_cover_wechat():
    W, H = 1280, 544
    img = Image.new("RGB", (W, H), (245, 246, 250))
    d = ImageDraw.Draw(img)
    # right side: product screenshot, faded
    shot = Image.open(OPS_DIR / "ui-projects.png").convert("RGB")
    sw = 620
    sh = int(shot.height * sw / shot.width)
    shot = shot.resize((sw, sh))
    # cover/crop to 560x464 region
    target_w, target_h = 600, 464
    canvas = Image.new("RGB", (target_w, target_h), (245, 246, 250))
    shot2 = shot.resize((target_w, int(shot.height * target_w / sw)))
    if shot2.height < target_h:
        shot2 = shot.resize((int(shot.width * target_h / shot.height), target_h))
    canvas.paste(shot2.crop(((shot2.width-target_w)//2, 0, (shot2.width-target_w)//2+target_w, target_h)))
    canvas = canvas.filter(ImageFilter.GaussianBlur(1.2))
    # fade overlay
    ov = Image.new("RGB", (target_w, target_h), (245, 246, 250))
    canvas = Image.blend(canvas, ov, 0.45)
    # rounded mask
    mask = Image.new("L", (target_w, target_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, target_w, target_h], radius=20, fill=255)
    img.paste(canvas, (W - target_w - 50, (H - target_h)//2), mask)
    d.rectangle([0, 0, 690, H], fill=(245, 246, 250))  # keep left clean
    # accent bar
    d.rounded_rectangle([70, 78, 78, 200], radius=3, fill=(60, 100, 220))
    tag_f = resolve_font_bold(26)
    rr(d, [96, 76, 360, 120], 22, (230, 238, 255))
    T(d, (228, 98), "开源 · AI 短剧生产线", tag_f, (40, 80, 200), anchor="mm")
    t1 = resolve_font_bold(64)
    t2 = resolve_font_bold(46)
    T(d, (70, 185), "别再一个镜头", t1, (18, 22, 38))
    T(d, (70, 265), "一个镜头地抽卡了", t1, (18, 22, 38))
    T(d, (70, 350), "6.3k star 的 Jellyfish", t2, (60, 100, 220))
    sub = resolve_font(26)
    T(d, (70, 420), "剧本 → 分镜 → 资产一致性 → 图片/视频生成，全流程自托管", sub, (90, 100, 120))
    T(d, (70, 470), "FastAPI + React + Celery · Apache-2.0 · 支持火山方舟/OpenAI", resolve_font(22), (130, 138, 158))
    return img

# ── 知乎封面：浅底 + 四类方案对比 chips ────────────────────────────
def draw_cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 12, H], fill=(60, 100, 220))
    tag_f = resolve_font_bold(26)
    rr(d, [70, 70, 300, 122], 26, (60, 100, 220))
    T(d, (185, 96), "开源项目拆解", tag_f, (255, 255, 255), anchor="mm")
    rr(d, [320, 70, 600, 122], 26, (255, 255, 255), outline=(60, 100, 220), width=2)
    T(d, (460, 96), "AI 短剧 · 工作流", tag_f, (60, 100, 220), anchor="mm")
    tf = resolve_font_bold(58)
    T(d, (70, 185), "AI 短剧的真正瓶颈不是模型，", tf, (20, 30, 60))
    T(d, (70, 265), "是 100 个镜头的一致性管理", tf, (20, 30, 60))
    T(d, (70, 350), "Jellyfish：把抽卡过程变成可追踪的生产线", resolve_font_bold(40), (60, 100, 220))
    chips = [
        ("即梦/可灵网页版", "单镜头抽卡，资产无法沉淀", (220, 110, 90)),
        ("通用 AI 视频工具", "有生成无剧本分镜编排", (220, 160, 60)),
        ("表格+网盘土法管理", "角色全靠命名，跨集必崩", (180, 150, 60)),
        ("Jellyfish", "实体建模+候选确认+任务中心", (50, 160, 110)),
    ]
    cw, ch_, gap = 340, 130, 24
    sx = (W - (cw*4 + gap*3)) // 2
    y0 = 470
    nf = resolve_font_bold(26); sf = resolve_font(21)
    for i, (name, desc, color) in enumerate(chips):
        x = sx + i*(cw+gap)
        if i == 3:
            rr(d, [x, y0, x+cw, y0+ch_], 16, color)
            T(d, (x+cw//2, y0+42), name, nf, (255, 255, 255), anchor="mm")
            T(d, (x+cw//2, y0+88), desc, sf, (235, 250, 242), anchor="mm")
        else:
            rr(d, [x, y0, x+cw, y0+ch_], 16, (255, 255, 255), outline=color, width=2)
            T(d, (x+cw//2, y0+42), name, nf, color, anchor="mm")
            T(d, (x+cw//2, y0+88), desc, sf, (90, 95, 110), anchor="mm")
    T(d, (70, H-50), "Forget-C/Jellyfish · 6.3k★ · Apache-2.0 · FastAPI/React/Celery/MySQL", resolve_font(22), (120, 130, 160))
    T(d, (W-70, H-50), "源码实测拆解", resolve_font(22), (120, 130, 160), anchor="rm")
    return img

# ── 正文图 1：端到端流水线 ────────────────────────────────────────
def draw_pipeline():
    W, H = 1200, 720
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    T(d, (W//2, 46), "Jellyfish 生产流水线：从剧本到成片", resolve_font_bold(34), TEXT, anchor="mm")
    stages = [
        ("剧本输入", "章节为单位", BLUE),
        ("AI 拆解分镜", "11 个专用 Agent", BLUE),
        ("候选确认", "资产/对白人工过一遍", ORANGE),
        ("镜头 ready", "后端状态机判定", GREEN),
        ("生成工作室", "关键帧·参考图·提示词", PURPLE),
        ("图片/视频生成", "Celery 异步任务", PINK),
        ("任务中心追踪", "状态·取消·回跳", TEAL),
        ("成片导出", "媒体库沉淀复用", GREEN),
    ]
    cw, ch_ = 250, 120
    gx, gy = 40, 36
    sx = (W - (cw*4 + gx*3)) // 2
    sy = 120
    nf = resolve_font_bold(27); sf = resolve_font(20)
    for i, (name, sub, color) in enumerate(stages):
        r, c = divmod(i, 4)
        x = sx + c*(cw+gx)
        y = sy + r*(ch_+gy+40)
        rr(d, [x, y, x+cw, y+ch_], 12, CARD, outline=color, width=2)
        d.ellipse([x+18, y+18, x+54, y+54], fill=color)
        T(d, (x+36, y+36), str(i+1), resolve_font_bold(22), BG, anchor="mm")
        T(d, (x+70, y+38), name, nf, TEXT)
        T(d, (x+20, y+86), sub, sf, DIM)
        if c < 3:
            ax = x + cw + 6
            d.polygon([(ax, y+ch_//2-8), (ax+16, y+ch_//2), (ax, y+ch_//2+8)], fill=DIM)
    # row wrap arrow between row1 and row2
    T(d, (W//2, sy+ch_+gy+18), "↓ 上一行确认完毕后进入下一行；任何一步失败，任务状态落库可重试，不污染镜头状态", resolve_font(20), DIM, anchor="mm")
    # bottom legend
    rr(d, [sx, 640, sx+cw, 690], 10, (25, 40, 40), outline=GREEN, width=2)
    T(d, (sx+cw//2, 665), "关键设计：状态与执行分离", resolve_font_bold(22), GREEN, anchor="mm")
    rr(d, [sx+cw+gx, 640, sx+2*cw+gx, 690], 10, (40, 30, 45), outline=PINK, width=2)
    T(d, (sx+cw+gx+cw//2, 665), "长任务全部 Celery 化", resolve_font_bold(22), PINK, anchor="mm")
    rr(d, [sx+2*(cw+gx), 640, sx+3*cw+2*gx, 690], 10, (35, 35, 25), outline=ORANGE, width=2)
    T(d, (sx+2*(cw+gx)+cw//2, 665), "人工确认是必经闸门", resolve_font_bold(22), ORANGE, anchor="mm")
    rr(d, [sx+3*(cw+gx), 640, sx+4*cw+3*gx, 690], 10, (28, 32, 48), outline=BLUE, width=2)
    T(d, (sx+3*(cw+gx)+cw//2, 665), "实体资产跨镜头复用", resolve_font_bold(22), BLUE, anchor="mm")
    return img

# ── 正文图 2：三套状态分离 ────────────────────────────────────────
def draw_status():
    W, H = 1200, 680
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    T(d, (W//2, 46), "源码里最值得抄的设计：一个镜头的三套状态", resolve_font_bold(34), TEXT, anchor="mm")
    cols = [
        ("信息确认状态", "shots.status", "pending / ready", "只由后端更新\nready = 提取确认完成\n不表示正在生成", BLUE),
        ("视频准备度", "video-readiness", "布尔判定 + 原因", "与 status 分离\nready 也可能缺关键帧\n不满足就不让发任务", ORANGE),
        ("运行时任务状态", "GenerationTask", "pending/running/\nstreaming/success/failed", "Celery 执行层真相\n可取消、可查耗时\n前端动态聚合", PINK),
    ]
    cw, ch_ = 340, 420
    gap = 36
    sx = (W - (cw*3 + gap*2)) // 2
    y0 = 110
    tf = resolve_font_bold(28); sf = resolve_font(20); mf = resolve_font(22)
    for i, (title, field, vals, desc, color) in enumerate(cols):
        x = sx + i*(cw+gap)
        rr(d, [x, y0, x+cw, y0+ch_], 14, CARD, outline=color, width=2)
        d.rectangle([x, y0, x+8, y0+ch_], fill=color)
        T(d, (x+28, y0+44), title, tf, TEXT)
        rr(d, [x+28, y0+78, x+cw-28, y0+118], 8, (22, 26, 38))
        T(d, (x+44, y0+98), field, resolve_font_bold(20), color)
        T(d, (x+28, y0+155), "取值", sf, DIM)
        for j, line in enumerate(vals.split("\n")):
            T(d, (x+28, y0+190+j*32), line, mf, TEXT)
        T(d, (x+28, y0+280), "解决的问题", sf, DIM)
        for j, line in enumerate(desc.split("\n")):
            T(d, (x+28, y0+315+j*30), line, resolve_font(19), (190, 198, 214))
    T(d, (W//2, y0+ch_+50), "「生成中」不再写进 shots.status —— 状态机只回答\"准备好了没\"，任务系统回答\"跑到哪了\"", resolve_font_bold(22), GREEN, anchor="mm")
    T(d, (W//2, y0+ch_+90), "依据：site/docs/architecture/shot-status-flow.md 与 AGENTS.md 状态语义约定", resolve_font(18), DIM, anchor="mm")
    return img

# ── 正文图 3：任务执行分层（Celery） ──────────────────────────────
def draw_taskarch():
    W, H = 1200, 700
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    T(d, (W//2, 44), "长任务执行架构：FastAPI 只接单，Celery 才干活", resolve_font_bold(32), TEXT, anchor="mm")
    layers = [
        ("前端 · 全局任务中心", "只调 /api/v1/film/tasks 轮询状态，从不直连 Celery", BLUE, 110),
        ("业务真相层", "GenerationTask / GenerationTaskLink：状态·结果·错误·取消请求·started/finished/elapsed", TEAL, 220),
        ("协议层", "task_kind 标识执行器 → TaskExecutorRegistry 分发（divide/extract/check-consistency/generate…）", PURPLE, 350),
        ("执行层", "Redis broker + Celery Worker（sync SQLAlchemy，独立 runtime）", PINK, 480),
        ("基础设施", "MySQL 9.0 业务库 · RustFS(S3) 素材存储 · OpenAI / 火山方舟 双通道", ORANGE, 610),
    ]
    lx, lw_, lh = 90, W-180, 90
    for name, desc, color, y in layers:
        rr(d, [lx, y, lx+lw_, y+lh], 12, CARD, outline=color, width=2)
        T(d, (lx+28, y+34), name, resolve_font_bold(25), TEXT)
        T(d, (lx+28, y+68), desc, resolve_font(19), DIM)
        if y < 600:
            d.polygon([(W//2-8, y+lh+2), (W//2+8, y+lh+2), (W//2, y+lh+14)], fill=DIM)
    return img

IMAGE_SPECS = [
    ("cover-wechat.jpg", 1280, 544, draw_cover_wechat),
    ("cover-zhihu.png", 1600, 900, draw_cover_zhihu),
    ("01-pipeline.png", 1200, 720, draw_pipeline),
    ("02-status.png", 1200, 680, draw_status),
    ("03-task-arch.png", 1200, 700, draw_taskarch),
]

def main():
    for name, w, h, fn in IMAGE_SPECS:
        print(f"{name} ({w}x{h})")
        save(fn(), name)
    print("done")

if __name__ == "__main__":
    main()
