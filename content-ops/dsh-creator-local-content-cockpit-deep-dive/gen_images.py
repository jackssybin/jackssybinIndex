#!/usr/bin/env python3
"""DSH-Creator / Jacky Creator 三端教程配图生成。"""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "dsh-creator-local-content-cockpit-deep-dive"
OPS_DIR = Path(f"/root/jackssybinIndex/content-ops/{SLUG}/media")
STATIC_DIR = Path(f"/root/jackssybinIndex/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

BG      = (14, 16, 22)
BG_SOFT = (24, 27, 36)
CARD    = (32, 36, 48)
LINE    = (66, 74, 96)
TEXT    = (232, 236, 246)
DIM     = (150, 158, 178)
BLUE    = (109, 172, 255)
ORANGE  = (255, 168, 76)
GREEN   = (119, 221, 119)
PINK    = (255, 119, 168)
TEAL    = (0, 188, 212)
PURPLE  = (168, 130, 255)

FONT_PATHS = [
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
]

def resolve_font(size, bold=False):
    name = "NotoSansCJK-Bold.ttc" if bold else "NotoSansCJK-Regular.ttc"
    candidates = [
        f"/usr/share/fonts/google-noto-cjk/{name}",
        f"/usr/share/fonts/opentype/noto/{name}",
        f"/usr/share/fonts/truetype/noto/{name}",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
    ]
    for p in candidates:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def t(draw, xy, text, font, fill, anchor="lm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

def rr(draw, xy, radius, fill=None, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def save(img, name):
    img.save(OPS_DIR / name)
    img.save(STATIC_DIR / name)
    print(f"  ok {name}")

# ─────────────────────────────────────────────────────────────────────
# 1. 微信封面 1280×544 亮色：文件夹即工作台
# ─────────────────────────────────────────────────────────────────────
def cover_wechat():
    W, H = 1280, 544
    img = Image.new("RGB", (W, H), (245, 246, 250))
    d = ImageDraw.Draw(img)
    # 左侧深色竖条
    d.rectangle([0, 0, 14, H], fill=(31, 95, 255))
    # 标签
    f_tag = resolve_font(26, True)
    rr(d, [60, 64, 330, 116], 26, fill=(31, 95, 255))
    t(d, (195, 91), "开源实测 · DSH 插件", f_tag, (255, 255, 255), anchor="mm")
    rr(d, [350, 64, 560, 116], 26, fill=(255, 255, 255), outline=(31, 95, 255), width=2)
    t(d, (455, 91), "DeepSeek Harness", f_tag, (31, 95, 255), anchor="mm")
    # 标题
    f_t1 = resolve_font(72, True)
    f_t2 = resolve_font(72, True)
    t(d, (60, 215), "别再让 AI 待在聊天框里", f_t1, (18, 24, 48))
    t(d, (60, 310), "文件夹就是创作工作台", f_t2, (31, 95, 255))
    f_sub = resolve_font(27)
    t(d, (60, 392), "Jacky Creator：本地优先的内容管线", f_sub, (90, 100, 124))
    t(d, (60, 432), "从灵感到复盘，一条片子就是一个文件夹", f_sub, (90, 100, 124))
    # 右侧文件夹示意
    fx = 900
    rr(d, [fx, 150, 1220, 430], 16, fill=(255, 255, 255), outline=(200, 208, 228), width=2)
    d.polygon([(fx, 150), (fx + 70, 150), (fx + 92, 178), (fx, 178)], fill=(31, 95, 255))
    files = [("topic.md", BLUE), ("script.md", BLUE), ("成品.mp4 / .srt", ORANGE), ("封面_16x9.png", PINK), ("公众号文章/", GREEN)]
    ff = resolve_font(24, True)
    for i, (name, c) in enumerate(files):
        y = 205 + i * 42
        d.rectangle([fx + 28, y - 12, fx + 44, y + 12], fill=c)
        t(d, (fx + 58, y), name, ff, (40, 48, 72))
    f_meta = resolve_font(22)
    t(d, (60, H - 46), "v0.1.0-beta.8 · MIT · 56 个测试文件 / 351 个用例全绿", f_meta, (120, 128, 150))
    t(d, (W - 60, H - 46), "jackssybin.com", f_meta, (120, 128, 150), anchor="rm")
    return img

# ─────────────────────────────────────────────────────────────────────
# 2. 知乎封面 1600×900 暗色：SaaS 黑盒 vs 本地文件夹
# ─────────────────────────────────────────────────────────────────────
def cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    for x in range(0, W, 80):
        d.line([(x, 0), (x, H)], fill=(22, 26, 38))
    for y in range(0, H, 80):
        d.line([(0, y), (W, y)], fill=(22, 26, 38))
    f_tag = resolve_font(28, True)
    rr(d, [80, 80, 470, 140], 30, outline=BLUE, width=3)
    t(d, (275, 111), "源码拆解 · 本地优先", f_tag, BLUE, anchor="mm")
    f_t = resolve_font(66, True)
    t(d, (80, 250), "AI 内容工具的两条路：", f_t, TEXT)
    t(d, (80, 345), "把内容锁进黑盒，还是交还文件夹", f_t, ORANGE)
    # 对比双卡
    card_y = 470
    cards = [
        (80, 780, card_y, 780, "SaaS / 云编辑器", ["正文锁在服务端数据库", "导出是降级的快照", "工作流被功能列表定义"], PINK),
        (820, 1520, card_y, 780, "Jacky Creator", ["一条片子 = 一个本地文件夹", "md / mp4 / srt / png 皆可读写", "工具只做文件夹做不到的事"], GREEN),
    ]
    for x1, x2, y1, y2, title, rows, color in cards:
        rr(d, [x1, y1, x2, y2], 18, CARD, color, 3)
        f_h = resolve_font(36, True)
        t(d, (x1 + 36, y1 + 52), title, f_h, color)
        f_b = resolve_font(28)
        for i, row in enumerate(rows):
            cy = y1 + 120 + i * 56
            d.ellipse([x1 + 38, cy - 7, x1 + 52, cy + 7], fill=color)
            t(d, (x1 + 70, cy), row, f_b, TEXT)
    f_meta = resolve_font(24)
    t(d, (80, H - 45), "github.com/Jackywxsz/DSH-Creator · MIT · DSH 0.1.1-rc.2", f_meta, DIM)
    t(d, (W - 80, H - 45), "56 test files · 351 tests passed", f_meta, DIM, anchor="rm")
    return img

# ─────────────────────────────────────────────────────────────────────
# 3. 内容闭环管线
# ─────────────────────────────────────────────────────────────────────
def diagram_pipeline():
    W, H = 1280, 720
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font(40, True)
    t(d, (60, 60), "一条内容的生命周期：灵感 → 复盘，规则回流", f_h, TEXT)
    stages = ["灵感", "选题", "脚本", "演示/视频", "字幕/封面", "发布", "复盘"]
    sub = ["想法+标签分级", "topic.md", "script.md", "Screen Studio", "确认后才烧录", "四平台人点发表", "结果沉淀"]
    colors = [PURPLE, BLUE, BLUE, ORANGE, PINK, GREEN, TEAL]
    cw, ch = 150, 150
    gap = (W - 120 - cw * len(stages)) // (len(stages) - 1)
    y = 200
    f_n = resolve_font(30, True)
    f_s = resolve_font(20)
    for i, (s, sub_, c) in enumerate(zip(stages, sub, colors)):
        x = 60 + i * (cw + gap)
        rr(d, [x, y, x + cw, y + ch], 14, CARD, c, 3)
        t(d, (x + cw // 2, y + 48), s, f_n, TEXT, anchor="mm")
        # 子说明自动换行
        t(d, (x + cw // 2, y + 92), sub_[:8], f_s, DIM, anchor="mm")
        if len(sub_) > 8:
            t(d, (x + cw // 2, y + 118), sub_[8:], f_s, DIM, anchor="mm")
        if i < len(stages) - 1:
            ax = x + cw + 6
            d.line([(ax, y + ch // 2), (ax + gap - 18, y + ch // 2)], fill=LINE, width=3)
            d.polygon([(ax + gap - 18, y + ch // 2 - 8), (ax + gap - 6, y + ch // 2), (ax + gap - 18, y + ch // 2 + 8)], fill=LINE)
    # 回流弧线
    fb = d
    fb.arc([120, 380, W - 120, 640], start=20, end=160, fill=TEAL, width=4)
    d.polygon([(120, 470), (100, 460), (112, 490)], fill=TEAL)
    f_fb = resolve_font(26, True)
    t(d, (W // 2, 620), "运营规则、模板、复盘知识回流到下一次创作", f_fb, TEAL, anchor="mm")
    f_note = resolve_font(24)
    t(d, (60, H - 40), "依据：README 工作流图 + src/cockpit/（运营工作台：档期 / 目标 / 复盘 / 六维诊断）", f_note, DIM)
    return img

# ─────────────────────────────────────────────────────────────────────
# 4. 文件夹契约
# ─────────────────────────────────────────────────────────────────────
def diagram_folder():
    W, H = 1280, 760
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font(40, True)
    t(d, (60, 60), "核心设计：磁盘上的文件才是唯一真相源", f_h, TEXT)
    f_sub = resolve_font(26)
    t(d, (60, 112), "一条片子 = 内容目录里的一个普通文件夹，AI / 编辑器 / 你都能直接读写", f_sub, DIM)
    # 文件夹树
    x0, y0 = 70, 180
    rr(d, [x0, y0, 620, 690], 16, BG_SOFT, LINE, 2)
    f_mono = resolve_font(26)
    lines = [
        ("📁 视频项目/  (默认 ~/Movies/视频项目)", TEXT, True),
        ("└── 📁 2026-09-02_内容标题/", GREEN, True),
        ("    ├── topic.md            选题笔记", BLUE, False),
        ("    ├── script.md           口播脚本", BLUE, False),
        ("    ├── 标题.mp4 / .mov      成片", ORANGE, False),
        ("    ├── 标题_subtitled.mp4   烧字成片", ORANGE, False),
        ("    ├── 标题.srt / .ass      字幕稿", TEAL, False),
        ("    ├── 标题_16x9.png 等三画幅 封面", PINK, False),
        ("    ├── 演示/                Motion HTML", PURPLE, False),
        ("    ├── 公众号文章/           md + images", BLUE, False),
        ("    └── publish-package.json 标题/tags", DIM, False),
    ]
    for i, (ln, c, bold) in enumerate(lines):
        f = resolve_font(26, bold)
        t(d, (x0 + 28, y0 + 42 + i * 44), ln, f, c, anchor="lm")
    # 右侧三条结论
    rx = 680
    points = [
        ("无锁定", "不进封闭数据库；卸载插件不删内容目录", GREEN),
        ("无覆盖", "改脚本直接写 script.md，不另存 overlay 副本", BLUE),
        ("无幻觉", "插件状态只记路径 / 绑定 / 标记 / 同步数字，不存正文", ORANGE),
    ]
    f_p = resolve_font(30, True)
    f_d = resolve_font(24)
    for i, (h_, b_, c) in enumerate(points):
        yy = y0 + i * 160
        rr(d, [rx, yy, W - 70, yy + 130], 14, CARD, c, 2)
        t(d, (rx + 30, yy + 42), h_, f_p, c)
        t(d, (rx + 30, yy + 90), b_, f_d, TEXT)
    f_note = resolve_font(22)
    t(d, (60, H - 35), "依据：docs/files.md《内容文件夹约定》+ README《本地文件》", f_note, DIM)
    return img

# ─────────────────────────────────────────────────────────────────────
# 5. 人机边界：14 个工具 + 4 件人必须亲手做
# ─────────────────────────────────────────────────────────────────────
def diagram_boundary():
    W, H = 1280, 800
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font(40, True)
    t(d, (60, 58), "14 个 jacky_creator_* 工具，刻意不碰四件事", f_h, TEXT)
    # 左：AI 工具（分组）
    groups = [
        ("引导/配置", ["guide 自举指引", "setup 只读环境检查", "script_rules 人设规则", "profile 启用平台"], BLUE),
        ("内容生产", ["create_content 建期", "update_content 改状态", "organize_library 整理", "open_studio 打开工程"], TEAL),
        ("制作流水线", ["wait_export 等落盘", "generate_subtitles 转录", "burn_subtitles 烧字*", "generate_cover 封面", "open_subtitle_preview"], ORANGE),
        ("发布回收", ["sync_publish 回收数据"], GREEN),
    ]
    x = 60
    col_w = 300
    f_g = resolve_font(26, True)
    f_i = resolve_font(21)
    for gi, (gname, items, c) in enumerate(groups):
        gx = 60 + gi * 305
        rr(d, [gx, 140, gx + 285, 620], 14, BG_SOFT, c, 2)
        t(d, (gx + 20, 178), gname, f_g, c)
        for i, it in enumerate(items):
            yy = 225 + i * 44
            rr(d, [gx + 18, yy - 18, gx + 267, yy + 18], 8, CARD)
            t(d, (gx + 32, yy), it, f_i, TEXT)
    t(d, (60, 585), "* 所有写操作：先预览、人确认后才执行（setup / organize / burn / 安装依赖）", resolve_font(22), DIM)
    # 右/下：人必须亲手做
    rr(d, [60, 640, W - 60, 760], 14, (48, 28, 28), PINK, 2)
    f_p = resolve_font(28, True)
    t(d, (85, 678), "人保留的四个动作：", f_p, PINK)
    f_h2 = resolve_font(24)
    t(d, (85, 724), "① Screen Studio 录制并导出 MP4　② 字幕预览确认专有名词　③ 封面核对标题错别字　④ 各平台最终点「发表」", f_h2, TEXT)
    return img

# ─────────────────────────────────────────────────────────────────────
# 6. 实测证据：终端测试输出
# ─────────────────────────────────────────────────────────────────────
def diagram_tests():
    W, H = 1280, 620
    img = Image.new("RGB", (W, H), (12, 14, 18))
    d = ImageDraw.Draw(img)
    # 窗口
    rr(d, [0, 0, W - 1, H - 1], 18, (20, 22, 30), LINE, 2)
    for i, c in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        d.ellipse([28 + i * 34, 26, 48 + i * 34, 46], fill=c)
    f_t = resolve_font(24)
    t(d, (W // 2, 36), "root@server: ~/.cache/tct/DSH-Creator — pnpm test", f_t, DIM, anchor="mm")
    lines = [
        ("$ pnpm install --frozen-lockfile", DIM),
        ("Done in 39.2s using pnpm v10.16.1", DIM),
        ("", TEXT),
        ("$ pnpm test", DIM),
        ("", TEXT),
        (" RUN  v4.1.10  /root/.cache/tct/DSH-Creator", TEXT),
        ("", TEXT),
    ]
    green_lines = [
        " ✓ src/__tests__/contentWorkflow.test.ts (14)",
        " ✓ tests/capabilityInstall.test.ts (9)",
        " ✓ tests/cockpitPromotion.test.ts (12)",
        " ✓ tests/persistence.test.ts (7)",
        " ……",
        "",
        " Test Files  56 passed (56)",
        "      Tests  351 passed (351)",
        "   Duration  31.71s",
    ]
    y = 80
    f_m = resolve_font(24)
    for ln, c in lines:
        t(d, (40, y), ln, f_m, c)
        y += 42
    for i, ln in enumerate(green_lines):
        c = GREEN if ("passed" in ln or ln.startswith(" ✓")) else DIM
        f = resolve_font(26, True) if "passed" in ln else f_m
        t(d, (40, y), ln, f, c)
        y += 44
    # 右侧统计卡
    rr(d, [940, 110, 1230, 500], 14, CARD, GREEN, 2)
    stats = [("56", "测试文件"), ("351", "测试用例"), ("~17.3k", "src 行数"), ("14", "Agent 工具")]
    f_b = resolve_font(44, True)
    f_s = resolve_font(22)
    for i, (num, label) in enumerate(stats):
        cy = 150 + i * 90
        t(d, (1085, cy), num, f_b, GREEN, anchor="mm")
        t(d, (1085, cy + 38), label, f_s, DIM, anchor="mm")
    return img

IMAGE_SPECS = [
    ("cover-wechat.jpg", 1280, 544, cover_wechat),
    ("cover-zhihu.png", 1600, 900, cover_zhihu),
    ("diagram-pipeline.png", 1280, 720, diagram_pipeline),
    ("diagram-folder-contract.png", 1280, 760, diagram_folder),
    ("diagram-tools-boundary.png", 1280, 800, diagram_boundary),
    ("diagram-tests.png", 1280, 620, diagram_tests),
]

def main():
    for name, w, h, fn in IMAGE_SPECS:
        save(fn(), name)
    print("done")

if __name__ == "__main__":
    main()
