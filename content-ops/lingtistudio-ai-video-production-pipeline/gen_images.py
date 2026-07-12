#!/usr/bin/env python3
"""Generate cover + body diagrams for LingtiStudio three-channel tutorial."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path(__file__).parent / "media"
OUT.mkdir(exist_ok=True)

FONT_REG = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FONT_BOLD = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"

def F(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)

BG = (17, 20, 28)
CARD = (30, 34, 46)
LINE = (58, 66, 90)
ACCENT = (129, 236, 236)  # cyan
ACCENT2 = (255, 184, 108)  # orange
TEXT = (232, 236, 244)
DIM = (150, 158, 178)


def rounded(draw, xy, radius=16, fill=None, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


# ============ Cover WeChat 1200x630 (JPG) ============
def cover_wechat():
    W, H = 1200, 630
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    # bg accent stripes
    for i, y in enumerate([80, 220, 360, 500]):
        d.rectangle((0, y, W, y+2), fill=(35, 40, 55))

    # left badge
    rounded(d, (60, 60, 260, 108), radius=24, fill=(40, 60, 80), outline=ACCENT, width=2)
    d.text((160, 84), "LingtiStudio", fill=ACCENT, font=F(20, True), anchor="mm")

    # main title (2 lines)
    d.text((60, 150), "试过 Sora 和剪映 AI 之后，", fill=TEXT, font=F(48, True))
    d.text((60, 220), "我用这个开源项目把", fill=TEXT, font=F(48, True))
    d.text((60, 290), "「AI 视频」跑成了真流水线", fill=ACCENT2, font=F(48, True))

    # subtitle
    d.text((60, 380), "脚本 → 审核 → 关键帧 → 配音 → 视频 → 组装 → 剪映草稿", fill=DIM, font=F(24))
    d.text((60, 420), "8 个可暂停的检查点，成片前每一步都能改", fill=DIM, font=F(24))

    # right pill row
    y = 500
    pills = [("166★", ACCENT), ("MIT", ACCENT2), ("Docker 一键", ACCENT), ("Python + Next.js", ACCENT2)]
    x = 60
    for txt, col in pills:
        tw = d.textbbox((0, 0), txt, font=F(22, True))[2] + 32
        rounded(d, (x, y, x + tw, y + 44), radius=22, outline=col, width=2)
        d.text((x + tw / 2, y + 22), txt, fill=col, font=F(22, True), anchor="mm")
        x += tw + 16

    im.convert("RGB").save(OUT / "cover-wechat.jpg", "JPEG", quality=92)
    print("cover-wechat.jpg")


# ============ Cover Zhihu 1600x900 (PNG) ============
def cover_zhihu():
    W, H = 1600, 900
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)

    # grid bg
    for x in range(0, W, 80):
        d.line((x, 0, x, H), fill=(25, 28, 40), width=1)
    for y in range(0, H, 80):
        d.line((0, y, W, y), fill=(25, 28, 40), width=1)

    # top small badge
    rounded(d, (80, 90, 340, 150), radius=30, fill=(28, 44, 60), outline=ACCENT, width=2)
    d.text((210, 120), "LingtiStudio · 开源", fill=ACCENT, font=F(24, True), anchor="mm")

    # main question
    d.text((80, 200), "值得用吗？", fill=TEXT, font=F(72, True))
    # answer block
    d.text((80, 310), "我的判断：", fill=DIM, font=F(36))
    d.text((80, 370), "想把 AI 视频做成产线的人可以试，", fill=ACCENT, font=F(52, True))
    d.text((80, 440), "追单次爆款的不适合。", fill=ACCENT2, font=F(52, True))

    # reason line
    d.text((80, 560), "理由：脚本 Reflection · 资产确认 · 每步可审核 · 剪映草稿闭环", fill=DIM, font=F(28))

    # 3 columns of key facts
    y0 = 650
    cols = [
        ("8 步", "可暂停的\n生产链路"),
        ("Reflection", "初稿+审核\n双层脚本"),
        ("剪映草稿", "每分镜独立轨\n可替换单段"),
    ]
    cw = 440
    gap = 40
    x0 = 80
    for i, (big, small) in enumerate(cols):
        x = x0 + i * (cw + gap)
        rounded(d, (x, y0, x + cw, y0 + 180), radius=20, fill=CARD, outline=LINE, width=1)
        d.text((x + cw / 2, y0 + 60), big, fill=ACCENT, font=F(44, True), anchor="mm")
        for j, line in enumerate(small.split("\n")):
            d.text((x + cw / 2, y0 + 110 + j * 34), line, fill=DIM, font=F(22), anchor="mm")

    im.save(OUT / "cover-zhihu.png")
    print("cover-zhihu.png")


# ============ 01: Pipeline 8-step flow ============
def pipeline():
    W, H = 1400, 780
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((W / 2, 60), "LingtiStudio 8 步生产链路", fill=TEXT, font=F(38, True), anchor="mm")
    d.text((W / 2, 110), "每一步都可以暂停、审核、恢复", fill=DIM, font=F(22), anchor="mm")

    steps = [
        ("1", "脚本生成", "LLM + Reflection\n初稿→审核 双轮"),
        ("2", "分镜审核", "人工暂停\n改文案 / 时长"),
        ("3", "资产生成", "角色 / 场景 / 道具\n统一风格"),
        ("4", "资产确认", "审核后再进入\n关键帧生成"),
        ("5", "关键帧", "MiniMax / Nano Banana\n并行生成"),
        ("6", "TTS 配音", "MiniMax\n精确时长测量"),
        ("7", "视频片段", "Kling / Seedance\n智能路由"),
        ("8", "FFmpeg 组装", "字幕 / 转场 / 剪映草稿\n本地导出"),
    ]

    # 4 columns x 2 rows
    cols = 4
    card_w = 300
    card_h = 220
    gap_x = (W - cols * card_w) // (cols + 1)
    gap_y = 40
    y_start = 170

    for i, (num, title, desc) in enumerate(steps):
        row = i // cols
        col = i % cols
        x = gap_x + col * (card_w + gap_x)
        y = y_start + row * (card_h + gap_y)
        rounded(d, (x, y, x + card_w, y + card_h), radius=16, fill=CARD, outline=LINE, width=1)
        # step badge
        rounded(d, (x + 20, y + 20, x + 68, y + 68), radius=24, fill=ACCENT)
        d.text((x + 44, y + 44), num, fill=BG, font=F(28, True), anchor="mm")
        # title
        d.text((x + 90, y + 44), title, fill=TEXT, font=F(24, True), anchor="lm")
        # desc
        for j, line in enumerate(desc.split("\n")):
            d.text((x + 24, y + 100 + j * 34), line, fill=DIM, font=F(20))
        # gate marker on step 2 and 4
        if num in ("2", "4"):
            rounded(d, (x + card_w - 68, y + 20, x + card_w - 20, y + 48), radius=14, fill=ACCENT2)
            d.text((x + card_w - 44, y + 34), "GATE", fill=BG, font=F(14, True), anchor="mm")

    # arrow between rows (implicit; skip complex arrows)

    im.save(OUT / "01-pipeline.png")
    print("01-pipeline.png")


# ============ 02: Review gates value ============
def review_gate():
    W, H = 1400, 780
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((W / 2, 60), "为什么「审核关卡」值钱", fill=TEXT, font=F(38, True), anchor="mm")
    d.text((W / 2, 110), "两种流程的花费对比（60 秒短视频 × 8 分镜）", fill=DIM, font=F(22), anchor="mm")

    # two big columns
    col_w = 620
    col_h = 560
    y0 = 170
    x_left = 60
    x_right = W - col_w - 60

    # left: no gate
    rounded(d, (x_left, y0, x_left + col_w, y0 + col_h), radius=20, fill=CARD, outline=(180, 90, 90), width=2)
    d.text((x_left + col_w / 2, y0 + 40), "[×]  一键生成到底", fill=(255, 128, 128), font=F(30, True), anchor="mm")
    left_items = [
        ("脚本", "LLM 直出，可能主题跑偏"),
        ("关键帧", "8 张图 · 全部生成 · $0.4"),
        ("配音", "8 段 · 全部生成"),
        ("视频", "8 段图生视频 · $3.2"),
        ("成片", "看完发现开头不对"),
        ("代价", "重跑全流程 · 再花 $3.6"),
    ]
    for i, (k, v) in enumerate(left_items):
        y = y0 + 100 + i * 68
        rounded(d, (x_left + 30, y, x_left + col_w - 30, y + 50), radius=12, fill=(40, 30, 34), outline=(80, 40, 40), width=1)
        d.text((x_left + 60, y + 25), k, fill=(255, 168, 168), font=F(22, True), anchor="lm")
        d.text((x_left + 200, y + 25), v, fill=DIM, font=F(20), anchor="lm")

    # right: with gate
    rounded(d, (x_right, y0, x_right + col_w, y0 + col_h), radius=20, fill=CARD, outline=(90, 180, 130), width=2)
    d.text((x_right + col_w / 2, y0 + 40), "[√]  分阶段审核", fill=(140, 240, 180), font=F(30, True), anchor="mm")
    right_items = [
        ("脚本", "看完再点确认，$0"),
        ("资产", "角色 / 场景先小图预审 · $0.1"),
        ("关键帧", "确认后再全量 · $0.4"),
        ("配音", "确认关键帧后并行"),
        ("视频", "错了只重跑单段 · $0.4"),
        ("成片", "剪映草稿可微调，$0 重跑"),
    ]
    for i, (k, v) in enumerate(right_items):
        y = y0 + 100 + i * 68
        rounded(d, (x_right + 30, y, x_right + col_w - 30, y + 50), radius=12, fill=(28, 40, 34), outline=(60, 100, 70), width=1)
        d.text((x_right + 60, y + 25), k, fill=(140, 240, 180), font=F(22, True), anchor="lm")
        d.text((x_right + 200, y + 25), v, fill=DIM, font=F(20), anchor="lm")

    im.save(OUT / "02-review-gate.png")
    print("02-review-gate.png")


# ============ 03: Comparison table ============
def comparison():
    W, H = 1400, 780
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((W / 2, 60), "四种 AI 视频方案对比", fill=TEXT, font=F(38, True), anchor="mm")
    d.text((W / 2, 110), "面向内容创作者视角", fill=DIM, font=F(22), anchor="mm")

    # table
    headers = ["维度", "Sora / Runway", "剪映 AI 一键", "手工 ComfyUI", "LingtiStudio"]
    rows = [
        ("交付形态", "单条视频", "单条视频", "自己拼", "MP4+SRT+剪映草稿"),
        ("可审核步骤", "无", "1-2 处", "全流程手工", "8 处 gate"),
        ("错了重跑", "整段", "整段", "自己判断", "单分镜"),
        ("剪映草稿", "无", "本身就是剪映", "无", "原生导出"),
        ("依赖 API", "OpenAI 专属", "字节全套", "本地 GPU", "多家可换"),
        ("适合谁", "尝鲜 / 单条", "普通剪辑", "极客", "内容账号 / 讲解号"),
    ]

    col_widths = [180, 280, 260, 260, 320]
    x0 = 60
    y0 = 170
    row_h = 68

    # header
    x = x0
    for i, hdr in enumerate(headers):
        cw = col_widths[i]
        fill_col = ACCENT if i == 4 else (44, 50, 66)
        rounded(d, (x, y0, x + cw - 4, y0 + row_h), radius=8, fill=fill_col)
        d.text((x + cw / 2, y0 + row_h / 2), hdr, fill=BG if i == 4 else TEXT, font=F(22, True), anchor="mm")
        x += cw

    # rows
    for r, row in enumerate(rows):
        y = y0 + (r + 1) * row_h + 8
        x = x0
        for i, cell in enumerate(row):
            cw = col_widths[i]
            fill_col = (36, 44, 58) if i == 4 else (28, 32, 42)
            rounded(d, (x, y, x + cw - 4, y + row_h - 4), radius=8, fill=fill_col, outline=LINE, width=1)
            col_text = ACCENT if i == 4 else (i == 0 and TEXT or DIM)
            d.text((x + cw / 2, y + (row_h - 4) / 2), cell, fill=col_text, font=F(20, True if i == 0 or i == 4 else False), anchor="mm")
            x += cw

    im.save(OUT / "03-comparison.png")
    print("03-comparison.png")


if __name__ == "__main__":
    cover_wechat()
    cover_zhihu()
    pipeline()
    review_gate()
    comparison()
    print("done")
