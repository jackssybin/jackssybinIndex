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
SLUG = "openstory-ai-video-script-to-production"
SITE_BASE = "jackssybinIndex"

# Derived paths
OPS_DIR = Path(f"/root/jackssybinIndex/content-ops/openstory/media")
STATIC_DIR = Path(f"/root/jackssybinIndex/static/images/openstory-ai-video-script-to-production")
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
#   /usr/share/fonts/google-noto-cjk/   (NotoSansCJK *.ttc collection) → current machine
#   /usr/share/fonts/opentype/noto/     (older Debian/Ubuntu path)
#   /usr/share/fonts/truetype/noto/     (newer Debian/Ubuntu path)
#   /usr/share/fonts/truetype/wqy/      (wqy-microhei, fallback)
FONT_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
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

# ── Save helper ─────────────────────────────────────────────────────
def save(img, name):
    out = OPS_DIR / name
    img.save(out, quality=92)
    out2 = STATIC_DIR / name
    img.save(out2)
    print(f"  ✓ {out}  ({out.stat().st_size // 1024} KB)")

# ═══════════════════════════════════════════════════════════════════
# Helper: draw a rounded rectangle card
# ═══════════════════════════════════════════════════════════════════
def rounded_rect(draw, xy, radius, fill, outline=None, width=0):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

# ═══════════════════════════════════════════════════════════════════
# Helper: multi-row layout with numbered cards (top) + pill tags (bottom)
# Used for pipeline / flow diagrams (e.g. archify's 01-pipeline.png)
# ═══════════════════════════════════════════════════════════════════
def draw_pipeline_stage(draw, cx, y, num, label, sublabel, accent, font_num, font_lbl, font_sub):
    """Draw one numbered card in the pipeline flow."""
    CARD_W = 160
    CARD_H = 130
    x1 = cx - CARD_W // 2
    y1 = y - CARD_H // 2
    rounded_rect(draw, (x1, y1, x1 + CARD_W, y1 + CARD_H), 8, CARD, accent, 2)
    # Number circle
    r = 18
    cx_c = x1 + 20
    cy_c = y1 + 20
    draw.ellipse((cx_c - r, cy_c - r, cx_c + r, cy_c + r), fill=accent)
    safe_text(draw, (cx_c, cy_c), str(num), font_num, BG)
    # Label
    safe_text(draw, (cx + 5, y1 + 50), label, font_lbl, TEXT)
    # Sublabel
    safe_text(draw, (cx + 5, y1 + 80), sublabel, font_sub, DIM)

def draw_pill(draw, cx, y, text, accent, font_pill):
    """Draw one pill tag in the bottom row."""
    f = font_pill
    # Approximate text width: average CJK char ~= font_size * 0.85
    avg_w = f.size * 0.85
    text_w = int(len(text) * avg_w) + 40
    pill_h = 36
    x1 = cx - text_w // 2
    y1 = y - pill_h // 2
    rounded_rect(draw, (x1, y1, x1 + text_w, y1 + pill_h), 18, accent)
    safe_text(draw, (cx, y), text, f, TEXT)

# ═══════════════════════════════════════════════════════════════════
# Diagram functions — replace these with your actual diagrams
#
# COVER STRATEGY (new spec 2026-08-14):
#   WeChat cover (1280×544 = 2.35:1): two templates, choose based on content:
#     - Bright (off-white): tutorial/tool/open source
#     - Dark (navy/purple): hot/news/opinion
#     Product/tool projects: use product UI screenshot + title overlay, don't make pure-text poster.
#   Zhihu cover (1600×900 PNG): light/analytical, comparison matrix
#     or structured layout. Technical, restrained. Should NOT reuse
#     the same visual template as WeChat.
# ═══════════════════════════════════════════════════════════════════

def draw_cover_wechat():
    """1280×544 WeChat cover — NEW 2.35:1 spec (2026-08-14).

    OpenStory tutorial — bright template (灰白/米白底) for tutorial/tool/open source.
    """
    W, H = 1280, 544
    # Bright template (for tutorial/tool/open source):
    img = Image.new("RGB", (W, H), (245, 245, 240))  # bright off-white (L ≈ 245, sat ≈ 0%)
    text_color = (15, 15, 15)
    d = ImageDraw.Draw(img)

    # Top tag
    tag_font = resolve_font_bold(24)
    d.rounded_rectangle([80, 60, 300, 110], radius=25, outline=(60, 120, 220), width=2)
    safe_text(d, (190, 85), "开源 · AI工具 · 视频生成", tag_font, (60, 120, 220), anchor="mm")

    # Main title — split into 3 lines for visual rhythm
    title_font = resolve_font_bold(48)
    sub_font = resolve_font_bold(32)

    safe_text(d, (60, 180), "做AI短视频还要逐帧写Prompt？", title_font, (20, 20, 20))
    safe_text(d, (60, 250), "这个开源项目一次脚本输入", title_font, (20, 20, 20))
    safe_text(d, (60, 320), "自动生成全序列", sub_font, (60, 80, 120))

    # Bottom-right meta
    meta_font = resolve_font(22)
    small = resolve_font(18)
    safe_text(d, (W - 60, H - 90), "OpenStory", meta_font, (80, 100, 140), anchor="rm")
    safe_text(d, (W - 60, H - 50), "MIT License · 全栈开源", small, (100, 120, 150), anchor="rm")
    return img

def draw_cover_zhihu():
    """1600×900 Zhihu cover — light background, structured comparison matrix.

    OpenStory: compare traditional workflow vs OpenStory
    """
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))  # cool white
    d = ImageDraw.Draw(img)

    # Left accent bar
    d.rectangle([0, 0, 12, H], fill=(60, 100, 220))

    # Top tag row
    tag_font = resolve_font_bold(26)
    d.rounded_rectangle([70, 70, 320, 122], radius=26, fill=(60, 100, 220))
    safe_text(d, (195, 96), "开源项目", tag_font, (255, 255, 255), anchor="mm")

    d.rounded_rectangle([340, 70, 540, 122], radius=26, outline=(60, 100, 220), width=2)
    safe_text(d, (440, 96), "AI视频生成", tag_font, (60, 100, 220), anchor="mm")

    # Main title
    title_font = resolve_font_bold(60)
    sub_font = resolve_font_bold(36)

    safe_text(d, (70, 175), "OpenStory 值得用吗？", title_font, (20, 30, 60))
    safe_text(d, (70, 250), "我的实际体验结论", title_font, (20, 30, 60))
    safe_text(d, (70, 320), "一键脚本转AI视频序列", sub_font, (60, 100, 220))

    # Bottom comparison chips (4 columns)
    chip_font = resolve_font_bold(24)
    chip_sub = resolve_font(20)
    chips = [
        ("传统流程", "手动拆场景\n逐帧写Prompt", (240, 100, 100)),
        ("AI生成", "风格容易乱\n脸容易崩", (240, 160, 60)),
        ("团队协作", "文件传来传去", (240, 200, 60)),
        ("OpenStory", "自动拆解\n风格一致", (60, 180, 120)),
    ]
    chip_w = 300
    chip_h = 100
    gap = 20
    total_w = chip_w * 4 + gap * 3
    start_x = (W - total_w) // 2
    y0 = 460
    for i, (name, desc, color) in enumerate(chips):
        x = start_x + i * (chip_w + gap)
        is_highlight = i == 3
        if is_highlight:
            d.rounded_rectangle([x, y0, x + chip_w, y0 + chip_h], radius=14, fill=color)
            safe_text(d, (x + chip_w // 2, y0 + 28), name, chip_font, (255, 255, 255), anchor="mm")
            safe_text(d, (x + chip_w // 2, y0 + 62), desc, chip_sub, (240, 250, 245), anchor="mm")
        else:
            d.rounded_rectangle([x, y0, x + chip_w, y0 + chip_h], radius=14, fill=(255, 255, 255), outline=color, width=2)
            safe_text(d, (x + chip_w // 2, y0 + 28), name, chip_font, color, anchor="mm")
            safe_text(d, (x + chip_w // 2, y0 + 62), desc, chip_sub, (80, 80, 80), anchor="mm")

    # Bottom meta
    meta_font = resolve_font(22)
    safe_text(d, (70, H - 40), "GitHub: openstory-so/openstory", meta_font, (120, 130, 160))
    safe_text(d, (W - 70, H - 40), "MIT License", meta_font, (120, 130, 160), anchor="rm")
    return img

def draw_workflow_comparison():
    """1200×750 传统流程 vs OpenStory 对比图"""
    W, H = 1200, 750
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)

    # Title
    title_font = resolve_font_bold(36)
    safe_text(d, (W//2, 50), "传统AI短视频创作 vs OpenStory 自动流程", title_font, (20, 30, 60), anchor="mm")

    # Two columns
    card_w = 520
    card_h = 580
    gap = 40
    left_x = (W - card_w * 2 - gap) // 2
    y0 = 100

    # Left column: 传统流程
    d.rounded_rectangle([left_x, y0, left_x + card_w, y0 + card_h], radius=12, fill=(255, 255, 255), outline=(240, 100, 100), width=3)
    header_font = resolve_font_bold(28)
    safe_text(d, (left_x + card_w//2, y0 + 35), "传统流程", header_font, (240, 100, 100), anchor="mm")

    step_font = resolve_font_bold(22)
    desc_font = resolve_font(18)
    steps = [
        ("1. 手动拆分场景", "写完脚本逐段拆分\n每个场景都要手动操作"),
        ("2. 逐帧写Prompt", "每个场景重复描述\n角色/场景/风格\n容易遗漏信息"),
        ("3. 逐个生成", "一个一个点击生成\n等待时间长\n容易出错"),
        ("4. 保持风格一致性", "反复提醒AI同一个角色\n一次次重绘\n还是经常脸崩"),
        ("5. 导出拼接", "全部下载后\n导入剪辑软件\n手动拼接"),
    ]
    step_y = y0 + 70
    step_gap = 92
    for i, (title, desc) in enumerate(steps):
        safe_text(d, (left_x + 30, step_y + i * step_gap), title, step_font, (20, 30, 60))
        for j, line in enumerate(desc.split("\n")):
            safe_text(d, (left_x + 35, step_y + i * step_gap + 28 + j * 22), line, desc_font, (80, 80, 80))

    # Right column: OpenStory
    right_x = left_x + card_w + gap
    d.rounded_rectangle([right_x, y0, right_x + card_w, y0 + card_h], radius=12, fill=(255, 255, 255), outline=(60, 180, 120), width=3)
    safe_text(d, (right_x + card_w//2, y0 + 35), "OpenStory", header_font, (60, 180, 120), anchor="mm")

    steps = [
        ("1. 输入完整脚本", "复制粘贴整个脚本\n一次提交完事"),
        ("2. AI自动拆解", "LLM自动拆分场景\n推荐机位/情绪/运镜"),
        ("3. 批量生成", "一键生成所有场景\n自动保持风格"),
        ("4. 自动连续性", "角色/场景/色调自动传递\n保证从头到尾一致\n不用反复提醒AI"),
        ("5. 一键导出成片", "浏览器直接导出MP4\n不用下载再剪辑"),
    ]
    for i, (title, desc) in enumerate(steps):
        safe_text(d, (right_x + 30, step_y + i * step_gap), title, step_font, (20, 30, 60))
        for j, line in enumerate(desc.split("\n")):
            safe_text(d, (right_x + 35, step_y + i * step_gap + 28 + j * 22), line, desc_font, (80, 80, 80))

    # Footer
    footer_font = resolve_font(20)
    safe_text(d, (W//2, H - 30), "痛点解决：减少80%重复劳动，保证风格一致性", footer_font, (60, 60, 60), anchor="mm")

    return img

# ── Image specs registry ────────────────────────────────────────────
IMAGE_SPECS = [
    # (filename, width, height, draw_fn)
    # Two covers are required for every project. Default functions below
    # produce a battle-tested pattern for each platform.
    # WECHAT: NEW SPEC 2026-08-14 — 1280×544 = 2.35:1横版，亮暗两套模板
    ("cover-wechat.jpg", 1280, 544, draw_cover_wechat),
    ("cover-zhihu.png", 1600, 900, draw_cover_zhihu),
    # Add body diagrams below:
    ("01-workflow-comparison.png", 1200, 600, draw_workflow_comparison),
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