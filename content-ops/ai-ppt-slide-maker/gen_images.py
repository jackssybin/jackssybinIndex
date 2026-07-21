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
SLUG = "ai-ppt-slide-maker"
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
#   /usr/share/fonts/truetype/noto/     (newer Debian/Ubuntu path)
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
    at the same path before falling back to Regular.
    """
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

def safe_text(draw, xy, text, font, fill, anchor="lm"):
    """Draw text, defaulting to left-middle anchor.

    ⚠️ PITFALL: The default anchor is "lm" (left-middle), NOT "mm".
    With "mm" (middle-center), the (x,y) coordinate is the TEXT CENTER,
    not the left edge — so the first characters can get clipped off at
    the image's left border even when x=70 or x=100 on a 1080-wide image.
    This cost 8+ iterations to debug in one session.

    Common anchor values:
      'lm' = left-middle (left-aligned, v-centered) — ✅ DEFAULT, safe for
             titles, card labels, lists, most text. x is the left edge.
      'mm' = middle-center (centered both axes) — good for badges, tags,
             centered headings where you know the exact center position.
             ⚠️ x is TEXT CENTER, not left edge — use with caution.
      'rm' = right-middle (right-aligned, v-centered) — good for metadata,
             dates, numbers. x is the right edge.
      'mt' = middle-top (centered, top-aligned) — good for headings above
             content blocks.
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
# Helper: draw comparison table for AI PPT tools
# ═══════════════════════════════════════════════════════════════════
def draw_tool_comparison():
    W = 1200
    H = 780
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    title_font = resolve_font_bold(36)
    header_font = resolve_font_bold(24)
    cell_font = resolve_font(18)
    check_font = resolve_font_bold(20)

    safe_text(d, (40, 50), "主流 AI PPT 工具对比", title_font, TEXT)

    # Table headers
    cols = [
        {"x": 40, "w": 220, "title": "工具类型"},
        {"x": 280, "w": 220, "title": "是否编造数据"},
        {"x": 520, "w": 220, "title": "内容全可编辑"},
        {"x": 760, "w": 180, "title": "独立评审"},
        {"x": 960, "w": 200, "title": "支持任意比例"},
    ]

    y = 110
    row_h = 70

    # Header row
    for col in cols:
        rounded_rect(d, (col["x"], y, col["x"] + col["w"], y + row_h), 8, CARD, LINE, 1)
        safe_text(d, (col["x"] + col["w"]//2, y + row_h//2), col["title"], header_font, TEXT, anchor="mm")

    # Data rows
    rows = [
        ["模板填空式", "[×] 常见", "[×] 部分", "[×] 无", "[×] 仅 16:9"],
        ["图片生成式", "[×] 常见", "[×] 全截图", "[×] 无", "[×] 仅 16:9"],
        ["HTML 网页式", "[×] 可能", "[×] 不是 PPTX", "[×] 无", "[×] 仅 16:9"],
        ["slide-maker", "[√] 从不编造", "[√] 全可编辑", "[√] 必有", "[√] 任意比例"],
    ]

    row_colors = [CARD, CARD, CARD, (30, 60, 50)]
    row_text = [TEXT, TEXT, TEXT, GREEN]

    for i, row in enumerate(rows):
        y = 110 + (i+1) * row_h
        color = row_colors[i]
        text_color = row_text[i]
        for j, cell in enumerate(row):
            col = cols[j]
            rounded_rect(d, (col["x"], y, col["x"] + col["w"], y + row_h), 8, color, LINE, 1)
            safe_text(d, (col["x"] + col["w"]//2, y + row_h//2), cell, cell_font, text_color, anchor="mm")

    # Footer caption
    caption_font = resolve_font(16)
    safe_text(d, (40, H - 30), "[×] = 不支持 / 有缺陷  |  [√] = 原生支持 / 核心优势", caption_font, DIM)

    return img

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
    """1080×864 WeChat cover — deep navy, big headline, waveform decoration.

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
    d.rounded_rectangle([90, 90, 360, 148], radius=28, outline=(120, 200, 255), width=3)
    safe_text(d, (225, 119), "AI 工具 × PPT 生成", tag_font, (180, 220, 255), anchor="mm")

    # Main title — split into 3 lines for visual rhythm
    title_font = resolve_font_bold(72)
    sub_font = resolve_font_bold(48)

    safe_text(d, (90, 210), "用了十年的PPT工具", title_font, (255, 255, 255))
    safe_text(d, (90, 305), "被这个AI项目淘汰了", title_font, (255, 210, 100))  # warm accent
    safe_text(d, (90, 415), "——多智能体分工，绝不编造数字", sub_font, (200, 210, 230))

    # Waveform decoration bottom-left
    wave_y = 620
    for i, h in enumerate([20, 45, 30, 70, 55, 90, 40, 65, 25, 80, 50, 35, 60, 45, 25, 70, 30, 55]):
        x = 90 + i * 32
        color = (255, 210, 100) if i % 3 == 0 else (100, 180, 255)
        d.rounded_rectangle([x, wave_y - h, x + 18, wave_y + h], radius=9, fill=color)

    # Bottom-right meta
    meta_font = resolve_font(26)
    small = resolve_font(22)
    safe_text(d, (W - 90, H - 130), "GitHub 开源 · 支持 Claude/Codex", meta_font, (180, 200, 230), anchor="rm")
    safe_text(d, (W - 90, H - 90), "原生可编辑 · 独立评审 · 任意比例", small, (140, 160, 190), anchor="rm")
    safe_text(d, (W - 90, H - 50), "addsumtech/slides_maker", small, (100, 130, 170), anchor="rm")
    return img

def draw_cover_zhihu():
    """1600×900 Zhihu cover — light background, structured comparison matrix.

    Pattern: off-white background + left accent bar + tag pills + two-line
    title + 4-column comparison matrix (alternatives vs. this project,
    with the last chip highlighted green) + bottom metadata.
    """
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))  # cool white
    d = ImageDraw.Draw(img)

    # Left accent bar
    d.rectangle([0, 0, 12, H], fill=(60, 100, 220))

    # Top tag row
    tag_font = resolve_font_bold(26)
    d.rounded_rectangle([70, 70, 280, 122], radius=26, fill=(60, 100, 220))
    safe_text(d, (175, 96), "AI 工具", tag_font, (255, 255, 255), anchor="mm")

    d.rounded_rectangle([300, 70, 450, 122], radius=26, outline=(60, 100, 220), width=2)
    safe_text(d, (375, 96), "PPT 生成", tag_font, (60, 100, 220), anchor="mm")

    d.rounded_rectangle([470, 70, 680, 122], radius=26, outline=(60, 100, 220), width=2)
    safe_text(d, (575, 96), "开源项目", tag_font, (60, 100, 220), anchor="mm")

    # Main title
    title_font = resolve_font_bold(56)
    sub_font = resolve_font_bold(36)

    safe_text(d, (70, 185), "slide-maker 真的比", title_font, (20, 30, 60))
    safe_text(d, (70, 255), "传统 AI PPT 工具更好用吗？", title_font, (20, 30, 60))
    safe_text(d, (70, 340), "多智能体分工 · 独立评审 · 原生可编辑", sub_font, (60, 100, 220))

    # Bottom comparison chips (4 columns)
    chip_font = resolve_font_bold(24)
    chip_sub = resolve_font(20)
    chips = [
        ("传统AI PPT", "编造数据", (240, 100, 100)),
        ("图片生成式", "无法编辑", (240, 160, 60)),
        ("网页演示", "不是PPTX", (240, 200, 60)),
        ("slide-maker", "溯源不编造", (60, 180, 120)),
    ]
    chip_w = 340
    chip_h = 120
    gap = 28
    total_w = chip_w * 4 + gap * 3
    start_x = (W - total_w) // 2
    y0 = 500
    for i, (name, desc, color) in enumerate(chips):
        x = start_x + i * (chip_w + gap)
        is_highlight = i == 3
        if is_highlight:
            d.rounded_rectangle([x, y0, x + chip_w, y0 + chip_h], radius=14, fill=color)
            safe_text(d, (x + chip_w // 2, y0 + 38), name, chip_font, (255, 255, 255), anchor="mm")
            safe_text(d, (x + chip_w // 2, y0 + 78), desc, chip_sub, (240, 250, 245), anchor="mm")
        else:
            d.rounded_rectangle([x, y0, x + chip_w, y0 + chip_h], radius=14, fill=(255, 255, 255), outline=color, width=2)
            safe_text(d, (x + chip_w // 2, y0 + 38), name, chip_font, color, anchor="mm")
            safe_text(d, (x + chip_w // 2, y0 + 78), desc, chip_sub, (80, 80, 80), anchor="mm")

    # Bottom meta
    meta_font = resolve_font(22)
    safe_text(d, (70, H - 40), "addsumtech/slides_maker · MIT 协议 · 支持 Claude Code / GPT 商店", meta_font, (120, 130, 160))
    safe_text(d, (W - 70, H - 40), "GitHub", meta_font, (120, 130, 160), anchor="rm")
    return img

# ═══════════════════════════════════════════════════════════════════
# Image specs registry ───────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════

IMAGE_SPECS = [
    ("cover-wechat.jpg", 1080, 864, draw_cover_wechat),
    ("cover-zhihu.png", 1600, 900, draw_cover_zhihu),
    ("01-tool-comparison.png", 1200, 780, draw_tool_comparison),
]

# ── Save helper ─────────────────────────────────────────────────────
def save(img, name):
    out = OPS_DIR / name
    img.save(out)
    out2 = STATIC_DIR / name
    img.save(out2)
    print(f"  ✓ {out}  ({out.stat().st_size // 1024} KB)")

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
