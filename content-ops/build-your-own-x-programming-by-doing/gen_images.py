#!/usr/bin/env python3
"""
Reusable Pillow image generator template for GitHub repo tutorials.

Copy this into content-ops/<slug>/gen_images.py, then customize:
 1. Update slug and site_base_url
 2. Replace IMAGE_SPECS with your actual image checklist
 3. Add/replace draw_* functions for each diagram
 4. Run: python3 gen_images.py

All images output to content-ops/<slug>/media/ and
static/images/<slug>/ in one pass.
"""
import os, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Config ──────────────────────────────────────────────────────────
SLUG = "build-your-own-x-programming-by-doing"
SITE_BASE = "jackssybinIndex"

# Derived paths
OPS_DIR = Path(f"content-ops/{SLUG}/media")
STATIC_DIR = Path(f"static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# ── Palette (Dark theme) ────────────────────────────────────────────
BG        = (14, 16, 22)
BG_SOFT   = (24, 27, 36)
CARD      = (32, 36, 48)
LINE      = (66, 74, 96)
TEXT      = (232, 236, 246)
DIM       = (150, 158, 178)
# Accent colors for different diagram types
BLUE      = (109, 172, 255)
ORANGE    = (255, 168, 76)
GREEN     = (119, 221, 119)
PINK      = (255, 119, 168)
TEAL      = (0, 188, 212)

# ── Font resolution ─────────────────────────────────────────────────
# First-match wins. Tested paths on this Linux machine:
#   /usr/share/fonts/google-noto-cjk/   (NotoSansCJK *.ttc collection)
#   /usr/share/fonts/opentype/noto/     (older Debian/Ubuntu path)
#   /usr/share/fonts/truetype/wqy/      (wqy-microhei, fallback)
FONT_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
]

def resolve_font(size: int) -> ImageFont.FreeTypeFont:
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    try:
        return ImageFont.truetype("DejaVuSans.ttf", size)
    except OSError:
        return ImageFont.load_default()

def resolve_font_bold(size: int) -> ImageFont.FreeTypeFont:
    """Resolve a bold CJK font. For .ttc collections, try the Bold sub-font
    at the same path before falling back to Regular."""
    for regular in FONT_PATHS:
        if not os.path.exists(regular):
            continue
        # For .ttc collections, try sibling Bold file
        base = os.path.splitext(regular)[0]
        bold_path = f"{base}-Bold.ttc"
        if os.path.exists(bold_path):
            try:
                return ImageFont.truetype(bold_path, size, encoding="unic")
            except Exception:
                pass
        # For .ttf, try Bold variant
        bold_path = regular.replace("-Regular", "-Bold").replace("Regular", "Bold")
        if bold_path != regular and os.path.exists(bold_path):
            try:
                return ImageFont.truetype(bold_path, size, encoding="unic")
            except Exception:
                pass
        # Try Black variant (heaviest weight, works as bold)
        black_path = f"{base}-Black.ttc"
        if os.path.exists(black_path):
            try:
                return ImageFont.truetype(black_path, size, encoding="unic")
            except Exception:
                pass
        # Fallback to regular
        return resolve_font(size)
    # Ultimate fallback
    return resolve_font(size)

def safe_text(draw, xy, text, font, fill, anchor="mm"):
    """Draw text with Left-Aligned anchor by default.
    Common anchor values:
      'mm' = middle-center (centered both axes) — good for titles, badges
      'lm' = left-middle (left-aligned, v-centered) — good for card labels, lists
      'rm' = right-middle (right-aligned, v-centered) — good for metadata, dates
      'mt' = middle-top (centered, top-aligned) — good for headings above content
    """
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

# ═══════════════════════════════════════════════════════════════════
# Helper: draw a rounded rectangle card
# ═══════════════════════════════════════════════════════════════════
def rounded_rect(draw, xy, radius, fill, outline=None, width=0):
    x1, y1, x2, y2 = xy
    d = radius * 2
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

# ═══════════════════════════════════════════════════════════════════
# Diagram functions — replace these with your actual diagrams
#
# COVER STRATEGY (two-branch):
#   WeChat cover (1080×864 JPG):  dark/emotional, big headline, waveform
#     or graphic metaphor. Hook-based title. High contrast for mobile.
#   Zhihu cover (1600×900 PNG):   light/analytical, comparison matrix
#     or structured layout. Technical, restrained. Should NOT reuse
#     the same visual template as WeChat.
# ═══════════════════════════════════════════════════════════════════

def draw_cover_wechat():
    """1080×864 WeChat cover — dark navy, big headline, waveform decoration.

    Pattern: deep background + grid texture + split-color title (accent
    on the hook phrase) + bottom waveform bars + project metadata.
    Use this as a starting point, tune colors and layout per project.
    """
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), (14, 20, 41))  # deep navy
    d = ImageDraw.Draw(img)

    # Radial gradient overlay (top-left glow)
    for i in range(0, 500, 4):
        alpha = max(0, 40 - i // 12)
        color = (60, 90, 200, alpha)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([-i, -i, 500 + i, 500 + i], fill=color)
        img.paste(overlay, (0, 0), overlay)

    # Grid pattern
    for x in range(0, W, 80):
        d.line([(x, 0), (x, H)], fill=(30, 40, 70), width=1)
    for y in range(0, H, 80):
        d.line([(0, y), (W, y)], fill=(30, 40, 70), width=1)

    # Top tag
    tag_font = resolve_font_bold(30)
    d.rounded_rectangle([70, 90, 360, 148], radius=28, outline=(120, 200, 255), width=3)
    safe_text(d, (215, 119), "编程学习 · 方法论", tag_font, (180, 220, 255), anchor="mm")

    # Main title — split into 3 lines for visual rhythm
    title_font = resolve_font_bold(76)
    sub_font = resolve_font_bold(52)

    safe_text(d, (100, 210), "看完书还是不会写代码", title_font, (255, 255, 255), anchor="lm")
    safe_text(d, (100, 310), "这个 53 万星仓库救了我", title_font, (255, 210, 100), anchor="lm")  # warm accent
    safe_text(d, (100, 420), "\"不能创造，就不能理解\"", sub_font, (200, 210, 230), anchor="lm")

    # Code grid decoration bottom-left
    code_y = 560
    categories = ["OS", "DB", "Git", "LLM", "Compiler", "React"]
    x_start = 100
    for i, cat in enumerate(categories):
        x = x_start + i * 105
        color = (255, 210, 100) if i % 2 == 0 else (100, 180, 255)
        d.rounded_rectangle([x, code_y - 25, x + 70, code_y + 25], radius=8, fill=color)
        safe_text(d, (x + 35, code_y), cat, resolve_font_bold(24), (20, 20, 30), anchor="mm")

    # Bottom-right meta
    meta_font = resolve_font(26)
    small = resolve_font(22)
    safe_text(d, (W - 70, H - 130), "530k star  |  500+ 教程", meta_font, (180, 200, 230), anchor="rm")
    safe_text(d, (W - 70, H - 90), "从零造一遍 · 真正懂编程", small, (140, 160, 190), anchor="rm")
    safe_text(d, (W - 70, H - 50), "codecrafters.io", small, (100, 130, 170), anchor="rm")
    return img

def draw_cover_zhihu():
    """1600×900 Zhihu cover — light background, category grid.

    Pattern: off-white background + left accent bar + 6-category grid
    showing breadth + two-line title + bottom metadata.
    """
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))  # cool white
    d = ImageDraw.Draw(img)

    # Left accent bar
    d.rectangle([0, 0, 12, H], fill=(60, 100, 220))

    # Top tag row
    tag_font = resolve_font_bold(26)
    d.rounded_rectangle([70, 70, 300, 122], radius=26, fill=(60, 100, 220))
    safe_text(d, (185, 96), "开源收集 · 编程学习", tag_font, (255, 255, 255), anchor="mm")

    d.rounded_rectangle([320, 70, 520, 122], radius=26, outline=(60, 100, 220), width=2)
    safe_text(d, (420, 96), "530k star", tag_font, (60, 100, 220), anchor="mm")

    # Main title
    title_font = resolve_font_bold(60)
    sub_font = resolve_font_bold(42)

    safe_text(d, (70, 170), "为什么说 \"动手造轮子\"", title_font, (20, 30, 60), anchor="lm")
    safe_text(d, (70, 245), "是最快的学习方式？", title_font, (20, 30, 60), anchor="lm")
    safe_text(d, (70, 320), "build-your-own-x · 费曼学习法工程化", sub_font, (60, 100, 220), anchor="lm")

    # 6-category grid (3x2) showing the breadth
    card_font = resolve_font_bold(28)
    card_sub = resolve_font(20)
    categories = [
        ("3D 渲染器", "光栅化 / 光线追踪", BLUE),
        ("编程语言", "编译器 / 解释器", ORANGE),
        ("区块链", "加密货币 / PoW", GREEN),
        ("操作系统", "内核 / 调度", PINK),
        ("数据库", "B+树 / SQL", TEAL),
        ("神经网络", "LLM / 扩散模型", BLUE),
    ]

    grid_w = 460
    grid_h = 160
    gap_x = 40
    gap_y = 30
    start_x = 80
    start_y = 380

    for i, (name, desc, color) in enumerate(categories):
        col = i % 2
        row = i // 2
        x = start_x + col * (grid_w + gap_x)
        y = start_y + row * (grid_h + gap_y)
        d.rounded_rectangle([x, y, x + grid_w, y + grid_h], radius=12, fill=(255, 255, 255), outline=color, width=3)
        safe_text(d, (x + 24, y + 42), name, card_font, (20, 30, 60), anchor="lm")
        safe_text(d, (x + 24, y + 80), desc, card_sub, (80, 90, 120), anchor="lm")

    # Bottom meta
    meta_font = resolve_font(22)
    safe_text(d, (70, H - 40), "GitHub · codecrafters-io/build-your-own-x", meta_font, (120, 130, 160), anchor="lm")
    safe_text(d, (W - 70, H - 40), "费曼：不能创造，就不能理解", meta_font, (120, 130, 160), anchor="rm")
    return img

def draw_category_grid():
    """1200×780 body diagram — 3x4 category grid showing all main categories."""
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), (245, 247, 250))
    d = ImageDraw.Draw(img)

    title_font = resolve_font_bold(36)
    card_font = resolve_font_bold(24)
    safe_text(d, (W//2, 40), "build-your-own-x 覆盖哪些技术领域", title_font, (20, 30, 60), anchor="mt")

    # Grid: 3 columns
    categories = [
        ("图形", "3D 渲染器", "纹理 / 光线追踪", BLUE),
        ("AI", "大语言模型", "扩散 / RAG", ORANGE),
        ("网络", "BitTorrent", "TCP/IP 栈", GREEN),
        ("区块链", "加密货币", "共识 / P2P", PINK),
        ("语言", "编程语言", "编译器 / 解释器", TEAL),
        ("系统", "操作系统", "内核 / 调度", BLUE),
        ("数据库", "Redis / SQLite", "B+树 / SQL", ORANGE),
        ("游戏", "游戏引擎", "物理 / 渲染", GREEN),
        ("工具", "Git / Shell", "文本编辑器", PINK),
        ("容器", "Docker", "Linux 容器", TEAL),
        ("硬件", "处理器", "RISC-V", BLUE),
        ("Web", "浏览器", "Web 服务器", ORANGE),
    ]

    cols = 3
    card_w = 350
    card_h = 110
    gap_x = 30
    gap_y = 25
    start_y = 100
    start_x = (W - (cols * card_w + (cols-1)*gap_x)) // 2

    for i, (cat, name, desc, color) in enumerate(categories):
        col = i % cols
        row = i // cols
        x = start_x + col * (card_w + gap_x)
        y = start_y + row * (card_h + gap_y)
        d.rounded_rectangle([x, y, x + card_w, y + card_h], radius=10, fill=(255, 255, 255), outline=color, width=2)
        # Category tag (left strip)
        d.rectangle([x, y, x + 60, y + card_h], fill=color)
        safe_text(d, (x + 30, y + 55), cat, card_font, (255, 255, 255), anchor="mm")
        # Name + description
        safe_text(d, (x + 78, y + 30), name, card_font, (20, 30, 60), anchor="lm")
        safe_text(d, (x + 78, y + 68), desc, resolve_font(18), (80, 90, 110), anchor="lm")

    return img

# ── Save helper ─────────────────────────────────────────────────────
def save(img, name):
    out = OPS_DIR / name
    img.save(out)
    out2 = STATIC_DIR / name
    img.save(out2)
    print(f"  ✓ {out}  ({out.stat().st_size // 1024} KB)")

# ── Image specs registry ────────────────────────────────────────────
IMAGE_SPECS = [
    ("cover-wechat.jpg", 1080, 864, draw_cover_wechat),
    ("cover-zhihu.png", 1600, 900, draw_cover_zhihu),
    ("01-category-grid.png", 1200, 780, draw_category_grid),
]

# ═══════════════════════════════════════════════════════════════════
# Main
# ═══════════════════════════════════════════════════════════════════

def main():
    print(f"Generating {len(IMAGE_SPECS)} image(s) for {SLUG}...")
    for name, w, h, fn in IMAGE_SPECS:
        print(f"  {name} ({w}×{h}) ...")
        img = fn()
        save(img, name)
    print("Done.")

if __name__ == "__main__":
    main()
