#!/usr/bin/env python3
"""Generate covers + body diagrams for lapian-notes tutorial."""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "lapian-notes-ai-film-study-tool"
OPS_DIR = Path(f"content-ops/{SLUG}/media")
STATIC_DIR = Path(f"static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

FONT_REG = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FONT_BOLD = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FONT_BLACK = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Black.ttc"

def F(size, bold=False, black=False):
    p = FONT_BLACK if black else (FONT_BOLD if bold else FONT_REG)
    return ImageFont.truetype(p, size)

def st(d, xy, text, font, fill, anchor="mm"):
    d.text(xy, text, font=font, fill=fill, anchor=anchor)

def rrect(d, xy, r, fill=None, outline=None, width=0):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def save(img, name):
    img.save(OPS_DIR / name)
    img.save(STATIC_DIR / name)
    print(f"  ✓ {name}  ({(OPS_DIR / name).stat().st_size // 1024} KB)")

# ─────────────── Cover: WeChat (1080×864 JPG) ───────────────
# 深色胶片风：胶片齿孔 + 大标题 + AI 分析包关键词

def draw_cover_wechat():
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), (12, 14, 22))
    d = ImageDraw.Draw(img)

    # 顶部/底部胶片黑带（film perforation strip）
    strip_h = 60
    d.rectangle([0, 0, W, strip_h], fill=(6, 6, 10))
    d.rectangle([0, H - strip_h, W, H], fill=(6, 6, 10))
    # 齿孔
    for i in range(12):
        x = 45 + i * 84
        rrect(d, (x, 15, x + 42, 45), 4, fill=(180, 180, 180))
        rrect(d, (x, H - 45, x + 42, H - 15), 4, fill=(180, 180, 180))

    # 微妙暗红对角光
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for i in range(0, 700, 3):
        alpha = max(0, 22 - i // 30)
        od.ellipse([-i, -i + 100, 700 + i, 700 + i], fill=(220, 60, 60, alpha))
    img.paste(overlay, (0, 0), overlay)

    # 顶部胶片格网（3 个小胶片格，右侧给项目 badge 留位）
    frame_y = 110
    frame_h = 110
    gap = 12
    # 左侧 3 帧，占据 x=50 到 ~760
    fw = (760 - 50 - gap * 2) // 3
    palette = [(90, 130, 180), (180, 130, 90), (140, 100, 160)]
    for i, col in enumerate(palette):
        x = 50 + i * (fw + gap)
        rrect(d, (x, frame_y, x + fw, frame_y + frame_h), 4, fill=col)
        # 帧编号
        st(d, (x + 12, frame_y + 12), f"#{i * 47:04d}", F(16, bold=True), (240, 240, 240), anchor="lt")
        # 时间码
        st(d, (x + fw - 12, frame_y + frame_h - 12),
           f"{i*15:02d}:{i*13%60:02d}", F(14), (0, 0, 0), anchor="rb")

    # 顶部标签
    rrect(d, (50, 260, 320, 308), 24, outline=(255, 140, 100), width=3)
    st(d, (185, 284), "开源 · 拉片工具 · 本地运行", F(22, bold=True), (255, 180, 140))

    # 主标题
    st(d, (50, 340), "折腾了两晚 Excel", F(70, black=True), (255, 255, 255), anchor="lt")
    st(d, (50, 430), "和逐帧截图后", F(70, black=True), (255, 255, 255), anchor="lt")
    st(d, (50, 540), "我用这个开源工具", F(64, black=True), (255, 200, 100), anchor="lt")
    st(d, (50, 620), "把一部电影拉片做完了", F(64, black=True), (255, 200, 100), anchor="lt")

    # 副标题
    st(d, (50, 720), "本地抽帧 · 自动字幕 · AI 分析包 · 剧情泳道 · 情绪曲线", F(24), (170, 180, 200), anchor="lt")

    # 右上角项目名 badge
    rrect(d, (W - 260, 100, W - 50, 220), 12, fill=(24, 28, 40), outline=(255, 200, 100), width=2)
    st(d, (W - 155, 140), "lapian-notes", F(24, bold=True), (255, 200, 100))
    st(d, (W - 155, 175), "拉片笔记", F(22, bold=True), (240, 240, 240))
    st(d, (W - 155, 205), "270★ · MIT · 中文 UI", F(15), (150, 160, 180))
    return img

# ─────────────── Cover: Zhihu (1440×720 PNG) ───────────────
# 冷静浅色：判断矩阵 + 谁适合谁不适合

def draw_cover_zhihu():
    W, H = 1440, 720
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)

    # 左侧深色轴
    d.rectangle([0, 0, 14, H], fill=(30, 60, 140))

    # 顶部胶片格标记
    for i in range(6):
        x = 80 + i * 24
        d.rectangle([x, 55, x + 14, 75], fill=(30, 60, 140) if i % 2 == 0 else (180, 190, 210))

    # 顶部标签
    rrect(d, (240, 45, 620, 90), 22, fill=(30, 60, 140))
    st(d, (430, 67), "AI 项目拆解 · 影视创作工具", F(22, bold=True), (255, 255, 255))
    rrect(d, (640, 45, 810, 90), 22, outline=(30, 60, 140), width=2)
    st(d, (725, 67), "值得用吗？", F(22, bold=True), (30, 60, 140))

    # 主标题
    st(d, (80, 130), "拉片笔记（lapian-notes）", F(56, bold=True), (18, 24, 48), anchor="lt")
    st(d, (80, 210), "值得用吗？", F(56, black=True), (18, 24, 48), anchor="lt")

    # TL;DR 结论线
    d.line([(80, 300), (W - 80, 300)], fill=(200, 205, 220), width=2)
    st(d, (80, 330), "我的判断（先说结论）：", F(28, bold=True), (60, 70, 100), anchor="lt")

    # 结论主句
    st(d, (80, 380), "系统学习结构的创作者", F(42, bold=True), (30, 60, 140), anchor="lt")
    st(d, (80, 434), "→", F(42, bold=True), (100, 110, 130), anchor="lt")
    st(d, (150, 434), "值得，取代 Excel + 逐帧截图", F(36, bold=True), (30, 60, 140), anchor="lt")

    st(d, (80, 500), "只追热点做快剪解说号", F(42, bold=True), (180, 60, 60), anchor="lt")
    st(d, (80, 554), "→", F(42, bold=True), (100, 110, 130), anchor="lt")
    st(d, (150, 554), "别用，不解决你的剪辑焦虑", F(36, bold=True), (180, 60, 60), anchor="lt")

    # 底部元信息条
    rrect(d, (0, H - 60, W, H), 0, fill=(30, 60, 140))
    st(d, (80, H - 30), "270 ★ · 本地运行 · 零 API Key · 中文 UI · MIT",
       F(22, bold=True), (255, 255, 255), anchor="lm")
    st(d, (W - 80, H - 30), "jackssybin.cn", F(22), (200, 210, 230), anchor="rm")

    return img

# ─────────────── 01 · Four-step workflow ───────────────

def draw_workflow():
    W, H = 1440, 780
    img = Image.new("RGB", (W, H), (14, 16, 22))
    d = ImageDraw.Draw(img)

    st(d, (W // 2, 60), "拉片笔记 · 四步工作流", F(38, black=True), (240, 245, 255))
    st(d, (W // 2, 108), "全程本地，AI 用你自己的（ChatGPT / Claude / Gemini 都行）",
       F(20), (150, 160, 180))

    steps = [
        ("1", "导入影片",
         ["本地抽帧（1s/张）", "自动转码不兼容格式", "内嵌字幕 / 网络字幕", "生成 AI 分析包"],
         (109, 172, 255)),
        ("2", "把 ZIP 发给 AI",
         ["ChatGPT / Claude / Gemini", "指令已自动复制", "上传 ZIP + 粘贴指令", "AI 读帧 + 读字幕"],
         (255, 168, 76)),
        ("3", "导回 AI 结果",
         ["下载 AI 返回的 JSON", "点\"导入 AI 结果\"", "剧情泳道自动展开", "情绪曲线自动生成"],
         (119, 221, 119)),
        ("4", "拉片精修",
         ["逐段写笔记", "段落深拆（单段小包）", "手动改剧本 / 手法", "导出 Markdown"],
         (255, 119, 168)),
    ]
    card_w = 300
    card_h = 500
    gap = 40
    total = card_w * 4 + gap * 3
    start_x = (W - total) // 2
    y0 = 170

    for i, (num, title, bullets, color) in enumerate(steps):
        x = start_x + i * (card_w + gap)
        rrect(d, (x, y0, x + card_w, y0 + card_h), 14, fill=(28, 32, 44), outline=color, width=2)
        # Number circle
        r = 30
        d.ellipse((x + 30 - r, y0 + 50 - r, x + 30 + r, y0 + 50 + r), fill=color)
        st(d, (x + 30, y0 + 50), num, F(32, black=True), (14, 16, 22))
        # Title
        st(d, (x + 80, y0 + 50), title, F(28, black=True), (240, 245, 255), anchor="lm")
        # Divider
        d.line([(x + 20, y0 + 100), (x + card_w - 20, y0 + 100)], fill=color, width=2)
        # Bullets
        for j, b in enumerate(bullets):
            by = y0 + 140 + j * 60
            d.ellipse((x + 24, by - 5, x + 34, by + 5), fill=color)
            st(d, (x + 48, by), b, F(19), (220, 225, 240), anchor="lm")

        # Arrow between cards
        if i < 3:
            ax = x + card_w + gap // 2
            ay = y0 + card_h // 2
            d.polygon([(ax - 8, ay - 12), (ax + 12, ay), (ax - 8, ay + 12)], fill=(150, 160, 180))

    # Bottom pill: 无 API Key
    pill_font = F(20, bold=True)
    labels = [
        ("零 API Key", (60, 180, 120)),
        ("影片不上传", (109, 172, 255)),
        ("AI 完全解耦", (255, 168, 76)),
        ("导出 Markdown", (255, 119, 168)),
    ]
    total_w = 0
    widths = []
    for text, _ in labels:
        w = int(len(text) * 22) + 50
        widths.append(w)
        total_w += w
    total_w += 30 * (len(labels) - 1)
    x = (W - total_w) // 2
    py = y0 + card_h + 50
    for (text, color), w in zip(labels, widths):
        rrect(d, (x, py - 22, x + w, py + 22), 22, fill=color)
        st(d, (x + w // 2, py), text, pill_font, (14, 16, 22))
        x += w + 30

    return img

# ─────────────── 02 · Package structure ───────────────

def draw_ai_package():
    W, H = 1440, 820
    img = Image.new("RGB", (W, H), (14, 16, 22))
    d = ImageDraw.Draw(img)

    st(d, (W // 2, 60), "AI 分析包 · ZIP 里到底装了什么", F(36, black=True), (240, 245, 255))
    st(d, (W // 2, 108), "不绑定任何 AI 服务的秘密：把上下文打包，让通用大模型也能做专业拉片",
       F(19), (150, 160, 180))

    # Left: ZIP tree
    left_x = 80
    tree_y = 180
    rrect(d, (left_x, tree_y, left_x + 560, tree_y + 550), 12, fill=(28, 32, 44),
          outline=(109, 172, 255), width=2)
    st(d, (left_x + 30, tree_y + 30), "《影片名》-AI分析包.zip", F(24, bold=True), (255, 200, 100), anchor="lt")

    tree_items = [
        ("├── prompt.md", "拉片任务书（角色、字段、事实纪律）", (109, 172, 255)),
        ("├── schema.json", "AI 必须返回的 JSON 结构", (255, 168, 76)),
        ("├── project.json", "影片元信息、时长、抽帧数", (200, 210, 240)),
        ("├── subtitles.srt", "带广告清洗的字幕文本", (119, 221, 119)),
        ("├── 剧情资料.md", "你写的背景（可选）", (255, 119, 168)),
        ("└── frames/", "1 秒 1 张、时间码文件名", (100, 180, 200)),
        ("      ├── 00_00_15.jpg", "", (140, 150, 170)),
        ("      ├── 00_00_16.jpg", "", (140, 150, 170)),
        ("      └── ...（约 5000 张）", "", (140, 150, 170)),
    ]
    for i, (name, desc, color) in enumerate(tree_items):
        y = tree_y + 90 + i * 48
        st(d, (left_x + 30, y), name, F(19, bold=True), color, anchor="lt")
        if desc:
            st(d, (left_x + 300, y), desc, F(16), (170, 180, 200), anchor="lt")

    # Right: AI reads → returns JSON
    right_x = 730
    st(d, (right_x, tree_y - 5), "→", F(56, bold=True), (100, 110, 130), anchor="lt")

    ry = tree_y
    rrect(d, (right_x + 60, ry, right_x + 640, ry + 260), 12, fill=(28, 32, 44),
          outline=(119, 221, 119), width=2)
    st(d, (right_x + 90, ry + 25), "上传给任意 AI", F(24, bold=True), (119, 221, 119), anchor="lt")
    st(d, (right_x + 90, ry + 70), "· ChatGPT (需 Plus 传附件)", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry + 105), "· Claude Sonnet / Opus", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry + 140), "· Gemini Advanced", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry + 175), "· Kimi / DeepSeek Web 端", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry + 220), "AI 读图 + 读字幕，返回 JSON",
       F(16, bold=True), (150, 220, 150), anchor="lt")

    ry2 = ry + 290
    rrect(d, (right_x + 60, ry2, right_x + 640, ry2 + 260), 12, fill=(28, 32, 44),
          outline=(255, 168, 76), width=2)
    st(d, (right_x + 90, ry2 + 25), "返回 JSON 后自动生成", F(24, bold=True), (255, 168, 76), anchor="lt")
    st(d, (right_x + 90, ry2 + 70), "· 剧情泳道时间轴（多线并置）", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry2 + 105), "· 结构树（主/支/情感/信息线）", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry2 + 140), "· 观众情绪曲线（节奏起伏）", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry2 + 175), "· 段落深拆包（单段再送 AI）", F(19), (220, 225, 240), anchor="lt")
    st(d, (right_x + 90, ry2 + 220), "全部本机渲染，无网络请求",
       F(16, bold=True), (255, 220, 130), anchor="lt")

    # Bottom insight
    ins_y = 740
    rrect(d, (80, ins_y, W - 80, ins_y + 55), 12, fill=(30, 36, 50), outline=(255, 200, 100), width=1)
    st(d, (W // 2, ins_y + 27), "工程学关键点：把\"上下文\"塞进 ZIP，就不用为每个 AI 写适配器了",
       F(19, bold=True), (255, 220, 140))
    return img

# ─────────────── 03 · Comparison table ───────────────

def draw_comparison():
    W, H = 1440, 780
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)

    st(d, (W // 2, 55), "四种拉片方案 · 真实对比", F(34, black=True), (20, 30, 60))
    st(d, (W // 2, 105), "以\"想系统学电影叙事的个人创作者\"为使用者判断",
       F(19), (100, 110, 140))

    cols = ["Excel + 逐帧截图", "StudioBinder", "Notion + AI", "拉片笔记 (本项目)"]
    rows = [
        ("抽帧成本", ["几小时", "支持导入 EDL", "手动上传", "1 秒 1 张自动"]),
        ("字幕来源", ["手动打字", "上传字幕", "手动粘贴", "内嵌 / 网络自动"]),
        ("AI 分析", ["无", "无", "手写 prompt", "自动打包 ZIP"]),
        ("剧情泳道", ["靠脑补", "有", "无", "AI 定制命名"]),
        ("情绪曲线", ["无", "无", "无", "AI 生成 + 手改"]),
        ("段落深拆", ["复制粘贴", "有限", "手写", "小包再送 AI"]),
        ("成本", ["时间", "订阅费", "订阅费 + 手工", "$0 + 你的 AI 会员"]),
        ("影片是否上传", ["否", "云端项目", "云端笔记", "全本地"]),
    ]

    # Column layout
    label_w = 200
    col_w = (W - 100 - label_w) // 4
    x0 = 50
    y0 = 165
    header_h = 60
    row_h = 60

    # Header
    for i, col in enumerate(cols):
        cx = x0 + label_w + col_w * i
        highlight = i == 3
        color = (30, 60, 140) if highlight else (220, 225, 235)
        rrect(d, (cx + 6, y0, cx + col_w - 6, y0 + header_h), 8, fill=color)
        text_color = (255, 255, 255) if highlight else (60, 70, 100)
        st(d, (cx + col_w // 2, y0 + header_h // 2), col, F(18, bold=True), text_color)

    # Row label header
    rrect(d, (x0, y0, x0 + label_w - 6, y0 + header_h), 8, fill=(240, 240, 245))
    st(d, (x0 + label_w // 2, y0 + header_h // 2), "维度", F(18, bold=True), (60, 70, 100))

    # Rows
    for r, (label, cells) in enumerate(rows):
        ry = y0 + header_h + 8 + r * (row_h + 4)
        # Label
        rrect(d, (x0, ry, x0 + label_w - 6, ry + row_h), 6, fill=(240, 242, 248))
        st(d, (x0 + label_w // 2, ry + row_h // 2), label, F(17, bold=True), (30, 40, 70))
        for i, cell in enumerate(cells):
            cx = x0 + label_w + col_w * i
            highlight = i == 3
            bg = (232, 240, 252) if highlight else (255, 255, 255)
            rrect(d, (cx + 6, ry, cx + col_w - 6, ry + row_h), 6,
                  fill=bg, outline=(200, 210, 230), width=1)
            text_color = (30, 60, 140) if highlight else (60, 70, 90)
            font = F(17, bold=highlight)
            st(d, (cx + col_w // 2, ry + row_h // 2), cell, font, text_color)

    # Footnote
    st(d, (W // 2, H - 30),
       "* 本表以个人使用为准；团队协同场景 StudioBinder 仍有明显优势",
       F(16), (140, 150, 180))
    return img


# ─────────────── Run ───────────────

SPECS = [
    ("cover-wechat.jpg", draw_cover_wechat),
    ("cover-zhihu.png", draw_cover_zhihu),
    ("01-workflow.png", draw_workflow),
    ("02-ai-package.png", draw_ai_package),
    ("03-comparison.png", draw_comparison),
]

if __name__ == "__main__":
    for name, fn in SPECS:
        print(f"→ {name}")
        img = fn()
        if name.endswith(".jpg"):
            img.save(OPS_DIR / name, quality=92)
            img.save(STATIC_DIR / name, quality=92)
            print(f"  ✓ {name}  ({(OPS_DIR / name).stat().st_size // 1024} KB)")
        else:
            save(img, name)
    print("Done.")
