#!/usr/bin/env python3
"""
OpenMontage 三端推广教程配图生成脚本
"""
import os, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

# ── Config ──────────────────────────────────────────────────────────
SLUG = "openmontage-agentic-video-production"
SITE_BASE = "/root/jackssybinIndex"

# Derived paths
OPS_DIR = Path(f"{SITE_BASE}/content-ops/{SLUG}/media")
STATIC_DIR = Path(f"{SITE_BASE}/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

# ── Palette (Dark theme for architecture diagrams) ────────────────
BG        = (14, 16, 22)
BG_SOFT   = (24, 27, 36)
CARD      = (32, 36, 48)
LINE      = (66, 74, 96)
TEXT      = (232, 236, 246)
DIM       = (150, 158, 178)
BLUE      = (109, 172, 255)
ORANGE    = (255, 168, 76)
GREEN     = (119, 221, 119)
PINK      = (255, 119, 168)
TEAL      = (0, 188, 212)
PURPLE    = (180, 130, 255)
YELLOW    = (255, 220, 100)

# ── Font resolution ─────────────────────────────────────────────────
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
    for regular in FONT_PATHS:
        if not os.path.exists(regular):
            continue
        base = os.path.splitext(regular)[0]
        bold_path = f"{base}-Bold.ttc"
        if os.path.exists(bold_path):
            try:
                return ImageFont.truetype(bold_path, size, encoding="unic")
            except Exception:
                pass
        bold_path = regular.replace("-Regular", "-Bold").replace("Regular", "Bold")
        if bold_path != regular and os.path.exists(bold_path):
            try:
                return ImageFont.truetype(bold_path, size, encoding="unic")
            except Exception:
                pass
        black_path = f"{base}-Black.ttc"
        if os.path.exists(black_path):
            try:
                return ImageFont.truetype(black_path, size, encoding="unic")
            except Exception:
                pass
        return resolve_font(size)
    return resolve_font(size)

def safe_text(draw, xy, text, font, fill, anchor="lm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

# ── Save helper ─────────────────────────────────────────────────────
def save(img, name):
    out = OPS_DIR / name
    img.save(out, quality=92 if name.endswith('.jpg') else None)
    out2 = STATIC_DIR / name
    img.save(out2, quality=92 if name.endswith('.jpg') else None)
    print(f"  ✓ {name}  ({out.stat().st_size // 1024} KB)")

def rounded_rect(draw, xy, radius, fill, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

# ═══════════════════════════════════════════════════════════════════
# Cover: WeChat (1080×864 JPG) — dark cinematic theme
# ═══════════════════════════════════════════════════════════════════
def draw_cover_wechat():
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), (12, 14, 20))
    d = ImageDraw.Draw(img)

    # Radial glow top-left
    for i in range(0, 600, 4):
        alpha = max(0, 55 - i // 10)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([-i, -i, 600 + i, 600 + i], fill=(80, 120, 255, alpha))
        img.paste(overlay, (0, 0), overlay)

    # Radial glow bottom-right (warm)
    for i in range(0, 500, 4):
        alpha = max(0, 45 - i // 10)
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        od = ImageDraw.Draw(overlay)
        od.ellipse([W - 300 - i, H - 200 - i, W - 300 + i, H - 200 + i], fill=(255, 140, 60, alpha))
        img.paste(overlay, (0, 0), overlay)

    # Grid pattern
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=(25, 30, 45), width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=(25, 30, 45), width=1)

    # Top-left tag
    tag_font = resolve_font_bold(28)
    rounded_rect(d, (60, 80, 420, 136), 28, fill=(20, 30, 55), outline=(100, 150, 255), width=2)
    safe_text(d, (240, 108), "🎬 首个开源 Agent 视频系统", tag_font, (180, 210, 255), anchor="mm")

    # Main title
    title_font = resolve_font_bold(72)
    sub_title = resolve_font_bold(50)

    safe_text(d, (60, 220), "OpenMontage", title_font, (255, 255, 255))
    safe_text(d, (60, 320), "一句话生成完整成片", sub_title, (255, 200, 100))

    # Three feature pills
    pill_font = resolve_font_bold(28)
    pills = [
        ("12 条流水线", BLUE),
        ("57 个工具", ORANGE),
        ("零 API Key 也能出片", GREEN),
    ]
    px = 60
    py = 420
    for text, color in pills:
        # measure
        bbox = d.textbbox((0, 0), text, font=pill_font)
        tw = bbox[2] - bbox[0]
        pw = tw + 50
        rounded_rect(d, (px, py, px + pw, py + 56), 28, fill=(25, 35, 55), outline=color, width=2)
        safe_text(d, (px + 25, py + 28), text, pill_font, color, anchor="lm")
        px += pw + 20

    # Description line
    desc_font = resolve_font(30)
    safe_text(d, (60, 530), "你的 AI 编程助手 = 整个视频制作团队", desc_font, (200, 210, 230))
    safe_text(d, (60, 580), "研究 · 脚本 · 分镜 · 素材 · 剪辑 · 合成 · 自检", desc_font, (160, 170, 200))

    # Bottom visual: filmstrip with scene cards
    card_y = 650
    card_h = 120
    card_w = 180
    card_colors = [BLUE, PURPLE, PINK, ORANGE, TEAL]
    card_labels = ["研究", "脚本", "资产", "剪辑", "成片"]
    start_x = 60
    gap = 16
    for i in range(5):
        x = start_x + i * (card_w + gap)
        rounded_rect(d, (x, card_y, x + card_w, card_y + card_h), 10, fill=(20, 25, 40), outline=card_colors[i], width=2)
        # number
        num_font = resolve_font_bold(32)
        safe_text(d, (x + card_w // 2, card_y + 45), f"0{i+1}", num_font, card_colors[i], anchor="mm")
        # label
        lbl_font = resolve_font_bold(26)
        safe_text(d, (x + card_w // 2, card_y + 85), card_labels[i], lbl_font, TEXT, anchor="mm")
        # arrow between cards
        if i < 4:
            arrow_font = resolve_font_bold(28)
            safe_text(d, (x + card_w + gap // 2, card_y + card_h // 2), "→", arrow_font, DIM, anchor="mm")

    # Bottom meta
    meta_font = resolve_font(24)
    safe_text(d, (60, H - 40), "GitHub Trending #1  ·  AGPLv3  ·  Python + Node.js", meta_font, (130, 140, 170))
    safe_text(d, (W - 60, H - 40), "openmontage.video", meta_font, (130, 140, 170), anchor="rm")

    return img

# ═══════════════════════════════════════════════════════════════════
# Cover: Zhihu (1600×900 PNG) — light analytical theme
# ═══════════════════════════════════════════════════════════════════
def draw_cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), (247, 248, 251))
    d = ImageDraw.Draw(img)

    # Left accent bar
    d.rectangle([0, 0, 10, H], fill=(60, 100, 220))

    # Top tags
    tag_font = resolve_font_bold(26)
    tags = [("AI 视频生成", (60, 100, 220)), ("开源项目", (80, 150, 80)), ("Agent", (180, 100, 180))]
    tx = 70
    for text, color in tags:
        bbox = d.textbbox((0, 0), text, font=tag_font)
        tw = bbox[2] - bbox[0]
        rounded_rect(d, (tx, 70, tx + tw + 40, 122), 26, fill=color)
        safe_text(d, (tx + 20, 96), text, tag_font, (255, 255, 255), anchor="lm")
        tx += tw + 55

    # Main title
    title_font = resolve_font_bold(56)
    sub_font = resolve_font_bold(40)
    safe_text(d, (70, 180), "OpenMontage：首个开源的", title_font, (20, 30, 60))
    safe_text(d, (70, 260), "Agent 驱动的视频制作系统", title_font, (20, 30, 60))
    safe_text(d, (70, 350), "从一句话到完整成片，AI Agent 走完所有流程", sub_font, (60, 100, 220))

    # Architecture diagram — 3 layers
    y0 = 430
    layer_h = 100
    gap = 20
    layer_font = resolve_font_bold(28)
    layer_sub = resolve_font(22)

    layers = [
        ("第 3 层：外部技术知识", ".agents/skills/ — 47 个技能包", "FFmpeg · FLUX · Remotion · ElevenLabs", PURPLE),
        ("第 2 层：OpenMontage 约定", "skills/ — 流水线导演 + 创意 + 核心技能", "研究·脚本·资产·剪辑·合成 全流程指导", BLUE),
        ("第 1 层：工具与流水线", "tools/ + pipeline_defs/ — 57 个工具 + 12 条流水线", "Python 只提供能力，不做编排", GREEN),
    ]

    # Draw from bottom up (layer 1 at bottom)
    for i, (title, subtitle, detail, color) in enumerate(reversed(layers)):
        y = y0 + i * (layer_h + gap)
        rounded_rect(d, (70, y, W - 70, y + layer_h), 14, fill=(255, 255, 255), outline=color, width=2)
        # left color bar
        d.rectangle([70, y, 80, y + layer_h], fill=color)
        safe_text(d, (110, y + 35), title, layer_font, (30, 40, 70))
        safe_text(d, (110, y + 68), subtitle, layer_sub, (100, 110, 140))
        safe_text(d, (W - 90, y + 35), detail, layer_sub, (130, 140, 170), anchor="rm")

    # Arrow annotations between layers
    arrow_font = resolve_font_bold(20)
    for i in range(2):
        y_arrow = y0 + (i + 1) * layer_h + i * gap + gap // 2
        safe_text(d, (W // 2, y_arrow), "↑  Agent 按需读取  ↑", arrow_font, (120, 130, 160), anchor="mm")

    # Bottom meta
    meta_font = resolve_font(22)
    safe_text(d, (70, H - 40), "github.com/calesthio/OpenMontage  ·  AGPLv3  ·  Python 3.10+", meta_font, (120, 130, 160))
    safe_text(d, (W - 70, H - 40), "openmontage.video", meta_font, (120, 130, 160), anchor="rm")

    return img

# ═══════════════════════════════════════════════════════════════════
# Body diagram 1: Pipeline flow (7 stages)
# ═══════════════════════════════════════════════════════════════════
def draw_pipeline_flow():
    W, H = 1400, 500
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Title
    title_font = resolve_font_bold(32)
    safe_text(d, (W // 2, 45), "OpenMontage 制作流水线：7 个阶段全自动化", title_font, TEXT, anchor="mm")

    stages = [
        ("研究", "Research", BLUE, "网络检索\n收集素材"),
        ("提案", "Proposal", TEAL, "概念+成本\n审批门"),
        ("脚本", "Script", GREEN, "旁白+时间戳\n语音指导"),
        ("分镜", "Scene Plan", YELLOW, "场景拆解\n视觉规划"),
        ("资产", "Assets", ORANGE, "图像/视频/音频\n生成+选择"),
        ("剪辑", "Edit", PINK, "转场+节奏\n字幕+配乐"),
        ("合成", "Compose", PURPLE, "Remotion\n渲染成片"),
    ]

    card_w = 160
    card_h = 220
    gap = 20
    total_w = len(stages) * card_w + (len(stages) - 1) * gap
    start_x = (W - total_w) // 2
    y = 100

    num_font = resolve_font_bold(28)
    cn_font = resolve_font_bold(28)
    en_font = resolve_font(20)
    desc_font = resolve_font(18)

    for i, (cn, en, color, desc) in enumerate(stages):
        x = start_x + i * (card_w + gap)
        # Card
        rounded_rect(d, (x, y, x + card_w, y + card_h), 12, fill=CARD, outline=color, width=2)
        # Number badge
        r = 22
        cx = x + 35
        cy = y + 35
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)
        safe_text(d, (cx, cy), str(i + 1), num_font, BG, anchor="mm")
        # Chinese label
        safe_text(d, (x + card_w // 2, y + 90), cn, cn_font, TEXT, anchor="mm")
        # English label
        safe_text(d, (x + card_w // 2, y + 125), en, en_font, DIM, anchor="mm")
        # Description lines
        lines = desc.split("\n")
        for j, line in enumerate(lines):
            safe_text(d, (x + card_w // 2, y + 165 + j * 26), line, desc_font, DIM, anchor="mm")
        # Arrow between cards
        if i < len(stages) - 1:
            arrow_x = x + card_w + gap // 2
            arrow_font = resolve_font_bold(32)
            safe_text(d, (arrow_x, y + card_h // 2), "→", arrow_font, LINE, anchor="mm")

    # Bottom note
    note_font = resolve_font(20)
    safe_text(d, (W // 2, H - 35), "每个阶段都有 Markdown 导演技能 + JSON Schema 验证 + 可选人工审批门", note_font, DIM, anchor="mm")

    return img

# ═══════════════════════════════════════════════════════════════════
# Body diagram 2: Tool categories matrix
# ═══════════════════════════════════════════════════════════════════
def draw_tool_matrix():
    W, H = 1300, 560
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    title_font = resolve_font_bold(32)
    safe_text(d, (W // 2, 45), "57 个工具 · 60+ 提供商 · 全链路覆盖", title_font, TEXT, anchor="mm")

    categories = [
        ("视频生成", 18, BLUE, ["Kling", "Veo", "Runway", "WAN 2.1", "Hunyuan", "CogVideo"]),
        ("图像生成", 13, PURPLE, ["FLUX", "Imagen", "GPT Image", "Recraft", "本地Diffusion"]),
        ("音频/语音", 9, GREEN, ["ElevenLabs", "Google TTS", "OpenAI", "Piper", "Suno音乐"]),
        ("画面增强", 5, ORANGE, ["超分", "去背景", "人脸增强", "色彩分级"]),
        ("视频分析", 5, TEAL, ["WhisperX转录", "场景检测", "帧采样", "CLIP理解"]),
        ("数字人", 2, PINK, ["说话头像", "唇形同步"]),
    ]

    # 2 rows x 3 cols grid
    cols = 3
    rows = 2
    card_w = 380
    card_h = 200
    gap_x = 30
    gap_y = 25
    start_x = (W - (cols * card_w + (cols - 1) * gap_x)) // 2
    start_y = 90

    cat_font = resolve_font_bold(26)
    count_font = resolve_font_bold(20)
    tool_font = resolve_font(18)

    for i, (name, count, color, tools) in enumerate(categories):
        row = i // cols
        col = i % cols
        x = start_x + col * (card_w + gap_x)
        y = start_y + row * (card_h + gap_y)

        rounded_rect(d, (x, y, x + card_w, y + card_h), 12, fill=CARD, outline=color, width=2)
        # Top accent line
        d.rectangle([x, y, x + card_w, y + 6], fill=color)

        # Category name + count
        safe_text(d, (x + 25, y + 45), name, cat_font, TEXT)
        # Count pill
        bbox = d.textbbox((0, 0), f"{count} 个工具", font=count_font)
        tw = bbox[2] - bbox[0]
        rounded_rect(d, (x + card_w - tw - 50, y + 30, x + card_w - 25, y + 60), 15, fill=color)
        safe_text(d, (x + card_w - 37, y + 45), f"{count} 个", count_font, BG, anchor="rm")

        # Tool list
        for j, tool in enumerate(tools):
            ty = y + 85 + j * 26
            d.ellipse([x + 25, ty - 5, x + 33, ty + 3], fill=color)
            safe_text(d, (x + 50, ty), tool, tool_font, DIM)

    # Bottom note
    note_font = resolve_font(20)
    safe_text(d, (W // 2, H - 30), "Selector 自动按 7 维度评分选最优提供商 · 云端/本地双轨支持 · 无供应商锁定", note_font, DIM, anchor="mm")

    return img

# ═══════════════════════════════════════════════════════════════════
# Body diagram 3: Agent-first vs traditional
# ═══════════════════════════════════════════════════════════════════
def draw_agent_first():
    W, H = 1400, 480
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    title_font = resolve_font_bold(32)
    safe_text(d, (W // 2, 45), "Agent-First 架构：没有编排器，Agent 就是编排器", title_font, TEXT, anchor="mm")

    # Two columns: Traditional vs OpenMontage
    col_w = 620
    col_h = 340
    gap = 60
    y0 = 90

    # Left: Traditional
    x1 = (W - 2 * col_w - gap) // 2
    rounded_rect(d, (x1, y0, x1 + col_w, y0 + col_h), 14, fill=CARD, outline=(100, 100, 120), width=2)
    sub_font = resolve_font_bold(26)
    safe_text(d, (x1 + col_w // 2, y0 + 40), "传统 AI 工作流框架", sub_font, DIM, anchor="mm")

    traditional_items = [
        ("Python 状态机", "代码写死编排逻辑"),
        ("固定 DAG 节点", "流程不可灵活调整"),
        ("工具调用硬编码", "新增能力要改代码"),
        ("审核逻辑写在代码里", "质量标准随版本漂移"),
    ]
    item_font = resolve_font(22)
    for i, (title, desc) in enumerate(traditional_items):
        ty = y0 + 90 + i * 55
        d.ellipse([x1 + 30, ty - 8, x1 + 46, ty + 8], fill=(100, 100, 120))
        safe_text(d, (x1 + 65, ty), title, item_font, TEXT)
        safe_text(d, (x1 + 240, ty), desc, item_font, DIM)

    # Right: OpenMontage
    x2 = x1 + col_w + gap
    rounded_rect(d, (x2, y0, x2 + col_w, y2 := y0 + col_h), 14, fill=CARD, outline=BLUE, width=3)
    safe_text(d, (x2 + col_w // 2, y0 + 40), "OpenMontage Agent-First", sub_font, BLUE, anchor="mm")

    om_items = [
        ("Agent 读 YAML 清单", "流水线定义就是配置"),
        ("Agent 读 Markdown 技能", "改流程=改文档"),
        ("工具注册表自动发现", "加工具=写个类"),
        ("审阅技能自检", "质量标准就是说明文档"),
    ]
    for i, (title, desc) in enumerate(om_items):
        ty = y0 + 90 + i * 55
        d.ellipse([x2 + 30, ty - 8, x2 + 46, ty + 8], fill=BLUE)
        safe_text(d, (x2 + 65, ty), title, item_font, TEXT)
        safe_text(d, (x2 + 280, ty), desc, item_font, GREEN)

    # VS in the middle
    vs_font = resolve_font_bold(40)
    safe_text(d, (W // 2, y0 + col_h // 2), "VS", vs_font, ORANGE, anchor="mm")

    return img

# ── Image specs registry (MUST be after all draw_* functions) ────
IMAGE_SPECS = [
    # Covers
    ("wechat-cover.jpg", 1080, 864, draw_cover_wechat),
    ("zhihu-cover.png", 1600, 900, draw_cover_zhihu),
    # Body diagrams
    ("02-pipeline-flow.png", 1400, 500, draw_pipeline_flow),
    ("03-tool-matrix.png", 1300, 560, draw_tool_matrix),
    ("04-agent-first.png", 1400, 480, draw_agent_first),
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
