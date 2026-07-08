#!/usr/bin/env python3
"""PIL images for agency-agents tutorial."""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "agency-agents-238-specialist-installer"
OPS_DIR = Path(f"content-ops/{SLUG}/media")
STATIC_DIR = Path(f"static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

BG        = (14, 16, 22)
BG_SOFT   = (24, 27, 36)
CARD      = (32, 36, 48)
CARD2     = (44, 50, 66)
LINE      = (66, 74, 96)
TEXT      = (232, 236, 246)
DIM       = (150, 158, 178)
BLUE      = (109, 172, 255)
ORANGE    = (255, 168, 76)
GREEN     = (119, 221, 119)
PINK      = (255, 119, 168)
TEAL      = (0, 188, 212)
PURPLE    = (167, 139, 250)
YELLOW    = (250, 204, 21)
RED       = (248, 113, 113)

FONT_PATHS = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]
BOLD_PATHS = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc",
]

def font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def fontb(size):
    for p in BOLD_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return font(size)

def txt(d, xy, s, f, fill, anchor="mm"):
    d.text(xy, s, font=f, fill=fill, anchor=anchor)

def rr(d, xy, r, fill=None, outline=None, width=0):
    d.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def save(img, name):
    out = OPS_DIR / name
    if name.endswith(".jpg"):
        img.convert("RGB").save(out, "JPEG", quality=92)
    else:
        img.save(out)
    (STATIC_DIR / name).write_bytes(out.read_bytes())
    print(f"  ✓ {out}  ({out.stat().st_size // 1024} KB)")

# ── cover-wechat.jpg (1080×864) ───────────────────────────────
def draw_cover_wechat():
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # accent bar
    d.rectangle([(0, 0), (W, 8)], fill=BLUE)
    # main title
    txt(d, (W//2, 220), "238 个 AI 专家", fontb(72), TEXT)
    txt(d, (W//2, 310), "装进 15 个工具", fontb(72), BLUE)
    # subtitle
    txt(d, (W//2, 430), "一个仓库，两个脚本，一键铺满", font(34), DIM)
    txt(d, (W//2, 480), "Claude Code · Cursor · Codex · Gemini · Hermes", font(28), DIM)
    # tag row (four badges)
    labels = ["17 divisions", "15 tools", "NEXUS 编队", "懒加载 router"]
    colors = [BLUE, ORANGE, GREEN, PURPLE]
    n = len(labels)
    box_w, box_h = 200, 62
    gap = 20
    total = box_w * n + gap * (n - 1)
    x0 = (W - total) // 2
    y = 620
    for i, (lb, c) in enumerate(zip(labels, colors)):
        x = x0 + i * (box_w + gap)
        rr(d, (x, y, x + box_w, y + box_h), 12, fill=CARD, outline=c, width=2)
        txt(d, (x + box_w // 2, y + box_h // 2), lb, font(24), c)
    # footer
    txt(d, (W//2, 780), "msitarzewski / agency-agents", font(28), DIM)
    return img

# ── cover-zhihu.png (1600×900) ─────────────────────────────────
def draw_cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # left accent
    d.rectangle([(0, 0), (16, H)], fill=BLUE)
    # left column with big title
    txt(d, (W//2, 260), "Agency Agents", fontb(78), TEXT)
    txt(d, (W//2, 360), "238 专家 / 15 工具 / 一键部署", font(42), BLUE)
    txt(d, (W//2, 440), "把「多工具 × 多角色」当工程 artifact 治理", font(32), DIM)
    # divider
    d.line([(560, 500), (W-560, 500)], fill=LINE, width=2)
    # small chart-like row
    cols = ["convert.sh", "install.sh", "tools.json", "divisions.json", "NEXUS runbooks"]
    n = len(cols); bw = 220; gap = 24; total = bw*n + gap*(n-1); x0=(W-total)//2
    y = 570
    for i, c in enumerate(cols):
        x = x0 + i*(bw+gap)
        rr(d, (x, y, x+bw, y+70), 10, fill=CARD, outline=LINE, width=1)
        txt(d, (x+bw//2, y+35), c, font(24), TEXT)
    txt(d, (W//2, 780), "github.com/msitarzewski/agency-agents", font(26), DIM)
    return img

# ── 01-divisions-map.png (1400×880) ───────────────────────────
DIVISIONS = [
    ("specialized",         53, PURPLE),
    ("engineering",         36, BLUE),
    ("marketing",           36, ORANGE),
    ("gis",                 13, TEAL),
    ("security",            10, RED),
    ("design",               9, PINK),
    ("sales",                9, GREEN),
    ("testing",              9, YELLOW),
    ("paid-media",           7, ORANGE),
    ("project-management",   7, BLUE),
    ("spatial-computing",    6, TEAL),
    ("support",              6, GREEN),
    ("academic",             5, PURPLE),
    ("finance",              5, GREEN),
    ("game-development",     5, PINK),
    ("product",              5, BLUE),
    ("healthcare",           2, TEAL),
]

def draw_divisions_map():
    W, H = 1400, 880
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    # Title
    txt(d, (W//2, 55), "Agency Agents · 17 divisions · 238 specialists", fontb(38), TEXT)
    txt(d, (W//2, 105), "每个 division = 一个顶层目录 = 一组带 frontmatter 的 .md 专家人格", font(24), DIM)
    # Grid: 5 columns × 4 rows (最后一行 2 张居中)
    cols = 5
    rows_layout = [
        (0, 5),   # row 0: 5 cards
        (5, 5),   # row 1
        (10, 5),  # row 2
        (15, 2),  # row 3 (2 cards, centered)
    ]
    card_w = 230
    card_h = 130
    gap_x = 30
    gap_y = 32
    total_w = card_w * 5 + gap_x * 4
    x0 = (W - total_w) // 2
    y_top = 170
    for row_i, (start, count) in enumerate(rows_layout):
        row_total = card_w * count + gap_x * (count - 1)
        row_x0 = (W - row_total) // 2
        y = y_top + row_i * (card_h + gap_y)
        for i in range(count):
            name, num, color = DIVISIONS[start + i]
            x = row_x0 + i * (card_w + gap_x)
            rr(d, (x, y, x + card_w, y + card_h), 14, fill=CARD, outline=color, width=2)
            # Big number
            txt(d, (x + card_w // 2, y + 46), str(num), fontb(46), color)
            # Name
            txt(d, (x + card_w // 2, y + 92), name, font(22), TEXT)
            # sublabel
            txt(d, (x + card_w // 2, y + 115), "agents", font(16), DIM)
    # Footer
    txt(d, (W//2, H - 30), "统计口径：本文写作时仓库 clone 后 find *.md 计数", font(20), DIM)
    return img

# ── 02-two-scripts-flow.png (1400×720) ─────────────────────────
def arrow(d, x1, y1, x2, y2, color, width=3):
    d.line([(x1, y1), (x2, y2)], fill=color, width=width)
    # arrow head
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    ah = 14
    for a in (ang - 0.4, ang + 0.4):
        d.line([(x2, y2), (x2 - ah*math.cos(a), y2 - ah*math.sin(a))], fill=color, width=width)

def draw_two_scripts_flow():
    W, H = 1400, 780
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    txt(d, (W//2, 55), "convert.sh + install.sh 双段式工作流", fontb(36), TEXT)
    txt(d, (W//2, 100), "一份源 agent → 15 种工具格式 → 15 个安装目录", font(22), DIM)

    # Column 1: source
    x_src = 90
    src_w = 240
    src_y = 200
    rr(d, (x_src, src_y, x_src+src_w, src_y+340), 14, fill=CARD, outline=BLUE, width=2)
    txt(d, (x_src+src_w//2, src_y+40), "源 agent .md", fontb(24), BLUE)
    src_items = ["engineering/*.md", "design/*.md", "marketing/*.md", "17 个 division", "共 238 个文件"]
    for i, s in enumerate(src_items):
        txt(d, (x_src+src_w//2, src_y+90+i*44), s, font(20), TEXT if i<3 else DIM)

    # Arrow 1
    x_arr1_start = x_src + src_w + 10
    x_arr1_end = x_arr1_start + 130
    y_mid1 = src_y + 170
    arrow(d, x_arr1_start, y_mid1, x_arr1_end, y_mid1, ORANGE, 3)
    txt(d, ((x_arr1_start+x_arr1_end)//2, y_mid1-24), "convert.sh", font(20), ORANGE)
    txt(d, ((x_arr1_start+x_arr1_end)//2, y_mid1+24), "渲染", font(18), DIM)

    # Column 2: integrations/
    x_int = x_arr1_end + 10
    int_w = 300
    rr(d, (x_int, src_y, x_int+int_w, src_y+340), 14, fill=CARD, outline=ORANGE, width=2)
    txt(d, (x_int+int_w//2, src_y+40), "integrations/", fontb(24), ORANGE)
    int_items = ["claude-code/*.md", "codex/*.toml", "cursor/*.mdc", "aider/CONVENTIONS.md", "hermes/plugin.py …"]
    for i, s in enumerate(int_items):
        txt(d, (x_int+int_w//2, src_y+90+i*44), s, font(20), TEXT)

    # Arrow 2
    x_arr2_start = x_int + int_w + 10
    x_arr2_end = x_arr2_start + 130
    arrow(d, x_arr2_start, y_mid1, x_arr2_end, y_mid1, GREEN, 3)
    txt(d, ((x_arr2_start+x_arr2_end)//2, y_mid1-24), "install.sh", font(20), GREEN)
    txt(d, ((x_arr2_start+x_arr2_end)//2, y_mid1+24), "复制/软链", font(18), DIM)

    # Column 3: 15 tool destinations (compact grid inside)
    x_dst = x_arr2_end + 10
    dst_w = W - x_dst - 60
    rr(d, (x_dst, src_y, x_dst+dst_w, src_y+340), 14, fill=CARD, outline=GREEN, width=2)
    txt(d, (x_dst+dst_w//2, src_y+40), "15 个工具目录", fontb(24), GREEN)
    tools = [
        "~/.claude/agents/",
        "~/.codex/agents/",
        "~/.cursor/rules/",
        "~/.gemini/agents/",
        "~/.hermes/plugins/",
        "5+ more…",
    ]
    for i, s in enumerate(tools):
        txt(d, (x_dst+dst_w//2, src_y+90+i*40), s, font(18), TEXT if i<5 else DIM)

    # Bottom: CI guard
    y_ci = 590
    ci_w = W - 160
    ci_x = 80
    rr(d, (ci_x, y_ci, ci_x+ci_w, y_ci+120), 14, fill=BG_SOFT, outline=PURPLE, width=2)
    txt(d, (W//2, y_ci+30), "CI 守护：check-tools.sh · check-divisions.sh · lint-agents.sh", fontb(22), PURPLE)
    txt(d, (W//2, y_ci+72), "tools.json / divisions.json 与目录、convert.sh、install.sh 不一致 → 挂 CI", font(20), DIM)
    txt(d, (W//2, y_ci+102), "所有工具目录、格式、渲染函数都必须同步登记", font(18), DIM)
    return img

# ── 03-hermes-router.png (1400×760) ────────────────────────────
def draw_hermes_router():
    W, H = 1400, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    txt(d, (W//2, 55), "Hermes 的例外：懒加载 Router 而不是 232 个 skill", fontb(34), TEXT)
    txt(d, (W//2, 100), "让 Hermes 只知道「Agency 是可搜的花名册」，用谁再拉谁", font(22), DIM)

    # Central Hermes plugin box
    plugin_w = 380
    plugin_h = 130
    plugin_x = (W - plugin_w)//2
    plugin_y = 175
    rr(d, (plugin_x, plugin_y, plugin_x+plugin_w, plugin_y+plugin_h), 16, fill=CARD, outline=PURPLE, width=3)
    txt(d, (W//2, plugin_y+45), "agency-agents-router", fontb(28), PURPLE)
    txt(d, (W//2, plugin_y+90), "一个 Hermes plugin · data/agents.json 本地检索", font(20), DIM)

    # Four tool boxes below
    # 每个 tool: (name, line1, line2, color) 手动换行避免英文单词被截断
    tools = [
        ("agency_agents_search",   "按 query / division",     "搜索匹配的专家",       BLUE),
        ("agency_agents_inspect",  "查看某个专家的",           "metadata / 完整 body",  ORANGE),
        ("agency_agents_load",     "把某个专家 prompt",        "合成到当前任务",        GREEN),
        ("agency_agents_delegate", "转交 Hermes",              "delegate_task 独立跑",  PINK),
    ]
    n = len(tools)
    tool_w = 300
    tool_h = 170
    gap = 24
    total_w = tool_w*n + gap*(n-1)
    x0 = (W - total_w)//2
    tool_y = 400
    # connecting lines from plugin to each tool
    plug_bottom = (W//2, plugin_y + plugin_h)
    for i, (name, l1, l2, color) in enumerate(tools):
        x = x0 + i*(tool_w+gap)
        tool_center_top = (x + tool_w//2, tool_y)
        d.line([plug_bottom, tool_center_top], fill=color, width=2)
        rr(d, (x, tool_y, x+tool_w, tool_y+tool_h), 14, fill=CARD, outline=color, width=2)
        txt(d, (x+tool_w//2, tool_y+50), name, fontb(22), color)
        txt(d, (x+tool_w//2, tool_y+105), l1, font(19), TEXT)
        txt(d, (x+tool_w//2, tool_y+135), l2, font(19), TEXT)

    # Footer callout
    y_ft = 620
    ft_w = W - 200
    ft_x = 100
    rr(d, (ft_x, y_ft, ft_x+ft_w, y_ft+100), 14, fill=BG_SOFT, outline=YELLOW, width=2)
    txt(d, (W//2, y_ft+35), "关键：不写 skills.external_dirs，避免 232 个 skill 打爆 system prompt", fontb(22), YELLOW)
    txt(d, (W//2, y_ft+72), "启动开销 O(1)，按需加载才是多 agent 时代的 context 预算真相", font(20), DIM)
    return img

# ── main ──────────────────────────────────────────────────────
IMAGE_SPECS = [
    ("cover-wechat.jpg",       1080, 864, draw_cover_wechat),
    ("cover-zhihu.png",        1600, 900, draw_cover_zhihu),
    ("01-divisions-map.png",   1400, 880, draw_divisions_map),
    ("02-two-scripts-flow.png",1400, 780, draw_two_scripts_flow),
    ("03-hermes-router.png",   1400, 760, draw_hermes_router),
]

def main():
    print(f"Generating {len(IMAGE_SPECS)} images...")
    for name, w, h, fn in IMAGE_SPECS:
        print(f"  {name} ({w}×{h}) ...")
        img = fn()
        save(img, name)
    print("Done.")

if __name__ == "__main__":
    main()
