#!/usr/bin/env python3
"""Generate images for ai-job-search-claude-code-career-workbench article."""
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

SLUG = "ai-job-search-claude-code-career-workbench"
BASE = Path(__file__).parent
OPS_DIR = BASE / "media"
STATIC_DIR = Path(f"/root/workspace/jackssybinIndex/static/images/{SLUG}")
OPS_DIR.mkdir(parents=True, exist_ok=True)
STATIC_DIR.mkdir(parents=True, exist_ok=True)

BG        = (14, 16, 22)
BG_SOFT   = (24, 27, 36)
CARD      = (32, 36, 48)
CARD2     = (40, 45, 60)
LINE      = (66, 74, 96)
TEXT      = (232, 236, 246)
DIM       = (150, 158, 178)
BLUE      = (109, 172, 255)
ORANGE    = (255, 168, 76)
GREEN     = (119, 221, 119)
PINK      = (255, 119, 168)
TEAL      = (0, 188, 212)
PURPLE    = (168, 128, 255)
RED       = (255, 100, 100)

FONT_PATHS = [
    "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc",
]

def resolve_font(size):
    for p in FONT_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size, encoding="unic")
    return ImageFont.load_default()

def resolve_font_bold(size):
    for p in FONT_PATHS:
        base = os.path.splitext(p)[0]
        for bp in [base.replace("Regular", "Bold"), base.replace("-Regular", "-Bold")]:
            if os.path.exists(bp):
                return ImageFont.truetype(bp, size, encoding="unic")
    return resolve_font(size)

def st(draw, xy, text, font, fill, anchor="mm"):
    draw.text(xy, text, font=font, fill=fill, anchor=anchor)

def rr(draw, xy, r, fill=None, outline=None, width=0):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def save(img, name):
    out = OPS_DIR / name
    if name.endswith(".jpg"):
        img.save(out, quality=92)
    else:
        img.save(out)
    out2 = STATIC_DIR / name
    if name.endswith(".jpg"):
        img.save(out2, quality=92)
    else:
        img.save(out2)
    print(f"  ✓ {out.name} ({out.stat().st_size//1024} KB)")


# ═══════════════════════════════════════════════════════════════════
def draw_cover_wechat():
    W, H = 1080, 864
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_kicker = resolve_font(26)
    f_t1 = resolve_font_bold(60)
    f_t2 = resolve_font_bold(60)
    f_sub = resolve_font(28)
    f_tag = resolve_font(22)

    # top bar
    d.rectangle([(0, 0), (W, 8)], fill=ORANGE)
    # kicker
    st(d, (W//2, 130), "Claude Code · 求职工作台", f_kicker, ORANGE)

    # big title 2 lines
    st(d, (W//2, 250), "把找工作", f_t1, TEXT)
    st(d, (W//2, 340), "拆成一条流水线", f_t2, TEXT)

    # subtitle box
    rr(d, (100, 430, W-100, 570), 16, CARD, LINE, 2)
    st(d, (W//2, 470), "扫岗位 · 打分排序 · 起草 CV/CoverLetter", f_sub, TEXT)
    st(d, (W//2, 510), "第二个 agent 审稿 · 编译 PDF · 过 ATS 检查", f_sub, DIM)
    st(d, (W//2, 550), "MadsLorentzen/ai-job-search", resolve_font(22), BLUE)

    # 3 stats
    stats = [("9", "个 slash 命令", BLUE),
             ("5", "个门户 skill", GREEN),
             ("2", "个 agent 分离", ORANGE)]
    x0 = 140
    for i,(n,label,c) in enumerate(stats):
        cx = x0 + i*(W-280)//2
        rr(d, (cx-140, 620, cx+140, 760), 14, CARD, c, 2)
        st(d, (cx, 660), n, resolve_font_bold(48), c)
        st(d, (cx, 720), label, resolve_font(20), DIM)

    st(d, (W//2, H-40), "# Claude Code   # 求职自动化   # 双 agent   # LaTeX",
       f_tag, DIM)
    return img


def draw_cover_zhihu():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_kicker = resolve_font(28)
    f_title = resolve_font_bold(64)
    f_sub = resolve_font(30)
    f_meta = resolve_font(22)

    d.line([(200, 240), (W-200, 240)], fill=ORANGE, width=3)
    st(d, (W//2, 200), "AI-Job-Search  ·  Claude Code 求职工作台", f_kicker, ORANGE)

    st(d, (W//2, 340), "9 个命令、2 个 agent、1 条 PDF 视觉验证循环", f_title, TEXT)
    st(d, (W//2, 440), "把「投简历」这件事拆成 drafter → reviewer 流水线", f_sub, DIM)

    # bottom techs
    techs = [("Claude Code", BLUE), ("LaTeX", ORANGE), ("Bun + TS", GREEN),
             ("Python 3.10+", PINK), ("pdftotext / ATS", PURPLE)]
    x = 260
    y = 620
    gap = 30
    for label, color in techs:
        f = resolve_font(24)
        w = int(f.getlength(label)) + 40
        rr(d, (x, y, x+w, y+50), 12, CARD, color, 2)
        st(d, (x+w//2, y+25), label, f, TEXT)
        x += w + gap

    st(d, (W//2, H-100), "github.com/MadsLorentzen/ai-job-search", f_meta, BLUE)
    d.line([(W//2-80, H-70), (W//2+80, H-70)], fill=ORANGE, width=2)
    st(d, (W//2, H-40), "旧认知：手工投简历   新认知：命令式流水线", f_meta, DIM)
    return img


def draw_pipeline():
    """01: /setup /scrape /rank /apply /outcome pipeline."""
    W, H = 1400, 780
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font_bold(34)
    f_num = resolve_font_bold(22)
    f_lbl = resolve_font_bold(24)
    f_sub = resolve_font(20)
    f_pill = resolve_font(20)

    st(d, (W//2, 60), "Ai-Job-Search：把求职流程压成 5 个命令", f_h, TEXT)
    st(d, (W//2, 100), "每个命令有明确 IO；上一步的产物就是下一步的输入", f_sub, DIM)

    # 5 numbered stage cards
    stages = [
        ("1", "/setup", "填写档案", "documents/  →  CLAUDE.md", BLUE),
        ("2", "/scrape", "扫岗位", "portal skills 抓取 + 去重", GREEN),
        ("3", "/rank", "批量打分", "并行 agent 生成 shortlist", TEAL),
        ("4", "/apply", "起草+审稿+编译", "drafter/reviewer + PDF 循环", ORANGE),
        ("5", "/outcome", "记录结果", "outcome.md + tracker.csv", PURPLE),
    ]
    y = 220
    card_w = 240
    gap = 30
    total = 5*card_w + 4*gap
    x0 = (W - total)//2
    for i,(n,cmd,label,sub,c) in enumerate(stages):
        cx = x0 + i*(card_w+gap)
        rr(d, (cx, y, cx+card_w, y+200), 14, CARD, c, 2)
        # number circle
        r = 22
        d.ellipse((cx+18, y+18, cx+18+r*2, y+18+r*2), fill=c)
        st(d, (cx+18+r, y+18+r), n, f_num, BG)
        st(d, (cx+card_w//2+18, y+45), cmd, resolve_font_bold(28), c, anchor="mm")
        st(d, (cx+card_w//2, y+95), label, f_lbl, TEXT)
        st(d, (cx+card_w//2, y+140), sub, resolve_font(18), DIM)
        st(d, (cx+card_w//2, y+170), "", f_sub, DIM)
        # arrow
        if i < 4:
            ax1 = cx + card_w + 4
            ax2 = cx + card_w + gap - 4
            ay = y + 100
            d.line([(ax1, ay), (ax2, ay)], fill=LINE, width=3)
            d.polygon([(ax2, ay), (ax2-8, ay-6), (ax2-8, ay+6)], fill=LINE)

    # Bottom: aux commands
    st(d, (W//2, 500), "辅助命令（在流程外增强档案与流水线）", resolve_font_bold(26), TEXT)
    aux = [
        ("/expand", "从 GitHub/portfolio 补技能", BLUE),
        ("/upskill", "岗位 vs 档案的技能差 heatmap", ORANGE),
        ("/add-template", "注册自定义 LaTeX 模板", GREEN),
        ("/add-portal", "生成本地招聘门户 skill", PINK),
        ("/reset", "清档案 / 清素材", DIM),
    ]
    y2 = 570
    pw = 240
    gap2 = 20
    total2 = 5*pw + 4*gap2
    x02 = (W - total2)//2
    for i,(cmd,desc,c) in enumerate(aux):
        cx = x02 + i*(pw+gap2)
        rr(d, (cx, y2, cx+pw, y2+130), 12, CARD2, c, 2)
        st(d, (cx+pw//2, y2+35), cmd, resolve_font_bold(24), c)
        st(d, (cx+pw//2, y2+75), desc, resolve_font(18), TEXT)

    st(d, (W//2, 730), "档案（CLAUDE.md + .claude/skills/…/01-candidate-profile.md）是每条命令的共享上下文",
       resolve_font(20), DIM)
    return img


def draw_drafter_reviewer():
    """02: drafter-reviewer two-agent flow."""
    W, H = 1400, 820
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font_bold(34)
    f_lbl = resolve_font_bold(24)
    f_sub = resolve_font(20)
    f_step = resolve_font(20)

    st(d, (W//2, 60), "/apply 的双 agent：一个写，一个挑刺", f_h, TEXT)
    st(d, (W//2, 100), "drafter 保留上下文，reviewer 从空 context 重新研究公司", f_sub, DIM)

    # Left: drafter column
    lx = 100
    rx = 800
    box_w = 500
    top_y = 180

    # Drafter card
    rr(d, (lx, top_y, lx+box_w, top_y+540), 16, CARD, BLUE, 3)
    st(d, (lx+box_w//2, top_y+40), "DRAFTER", resolve_font_bold(32), BLUE)
    st(d, (lx+box_w//2, top_y+75), "带着完整档案上下文", f_sub, DIM)

    drafter_steps = [
        ("Step 0", "解析 URL / 粘贴的岗位描述"),
        ("Step 1", "对着 04-job-evaluation.md 打分"),
        ("Step 2", "写 CV + Cover Letter (LaTeX)"),
        ("Step 4", "按 reviewer 反馈精改，不重读文件"),
        ("Step 5", "编译 + 视觉检查 PDF"),
        ("Step 6", "跑一次终版 checklist"),
    ]
    y = top_y + 120
    for tag, text in drafter_steps:
        rr(d, (lx+20, y, lx+box_w-20, y+55), 8, CARD2)
        st(d, (lx+40, y+27), tag, resolve_font_bold(18), BLUE, anchor="lm")
        st(d, (lx+140, y+27), text, f_step, TEXT, anchor="lm")
        y += 65

    # Arrow between drafter and reviewer at step 3
    ax = lx + box_w + 20
    st(d, ((lx+box_w+rx)//2, top_y+380), "内联传稿", resolve_font(18), ORANGE)
    d.line([(lx+box_w+10, top_y+400), (rx-10, top_y+400)], fill=ORANGE, width=3)
    d.polygon([(rx-10, top_y+400), (rx-22, top_y+394), (rx-22, top_y+406)], fill=ORANGE)
    st(d, ((lx+box_w+rx)//2, top_y+430), "只传 diff / 草稿正文", resolve_font(16), DIM)
    d.line([(rx-10, top_y+470), (lx+box_w+10, top_y+470)], fill=GREEN, width=3)
    d.polygon([(lx+box_w+10, top_y+470), (lx+box_w+22, top_y+464), (lx+box_w+22, top_y+476)], fill=GREEN)
    st(d, ((lx+box_w+rx)//2, top_y+500), "JSON edits + 叙述反馈", resolve_font(16), DIM)

    # Reviewer card
    rr(d, (rx, top_y, rx+box_w, top_y+540), 16, CARD, GREEN, 3)
    st(d, (rx+box_w//2, top_y+40), "REVIEWER", resolve_font_bold(32), GREEN)
    st(d, (rx+box_w//2, top_y+75), "空 context，独立研究公司", f_sub, DIM)

    reviewer_steps = [
        ("Task 1", "WebSearch 公司近期动态 / 部门"),
        ("Task 2", "读 01/02/03/04 四个档案文件"),
        ("Task 3", "对照岗位 JD 挑刺"),
        ("Task 4a", "Part A：JSON 结构化 edits"),
        ("Task 4b", "Part B：叙述式反馈 keyword/tone"),
        ("Rule", "不许编造技能；gap 直接说透"),
    ]
    y = top_y + 120
    for tag, text in reviewer_steps:
        rr(d, (rx+20, y, rx+box_w-20, y+55), 8, CARD2)
        st(d, (rx+40, y+27), tag, resolve_font_bold(18), GREEN, anchor="lm")
        st(d, (rx+160, y+27), text, f_step, TEXT, anchor="lm")
        y += 65

    st(d, (W//2, H-40),
       "为什么两个 agent：单遍写作留下的空话、漏关键词、tone 崩盘，第二遍空 context 才看得见",
       resolve_font(20), DIM)
    return img


def draw_pdf_verify():
    """03: PDF compile + ATS verification loop."""
    W, H = 1400, 780
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    f_h = resolve_font_bold(34)
    f_lbl = resolve_font_bold(24)
    f_sub = resolve_font(20)

    st(d, (W//2, 60), "别信 .tex：/apply 的 PDF 视觉 + ATS 双重验证循环", f_h, TEXT)
    st(d, (W//2, 100), "LaTeX 「看着挺好」经常渲染成孤行、跨页、页脚被吃", f_sub, DIM)

    # Loop stages: LaTeX draft → compile → visual check → PDF text → ATS scan
    stages = [
        ("LaTeX 草稿", ".tex 文件", BLUE),
        ("编译", "lualatex / xelatex", ORANGE),
        ("视觉检查", "读渲染出的 PDF 页", TEAL),
        ("pdftotext", "-layout 抽文本层", PURPLE),
        ("ATS 校对", "邮箱/电话/关键词", GREEN),
    ]
    y = 220
    card_w = 220
    gap = 40
    total = 5*card_w + 4*gap
    x0 = (W - total)//2
    for i,(label, sub, c) in enumerate(stages):
        cx = x0 + i*(card_w+gap)
        rr(d, (cx, y, cx+card_w, y+150), 14, CARD, c, 2)
        st(d, (cx+card_w//2, y+50), label, resolve_font_bold(26), c)
        st(d, (cx+card_w//2, y+100), sub, resolve_font(18), TEXT)
        if i < 4:
            ax1 = cx + card_w + 4
            ax2 = cx + card_w + gap - 4
            ay = y + 75
            d.line([(ax1, ay), (ax2, ay)], fill=LINE, width=3)
            d.polygon([(ax2, ay), (ax2-8, ay-6), (ax2-8, ay+6)], fill=LINE)

    # Feedback loop arrow
    st(d, (W//2, 405), "任一环节不过 → 回到 LaTeX 草稿改", resolve_font(20), ORANGE)
    d.line([(W//2+340, 400), (W//2+340, 435), (W//2-340, 435), (W//2-340, 400)], fill=ORANGE, width=2)
    d.polygon([(W//2-340, 400), (W//2-346, 410), (W//2-334, 410)], fill=ORANGE)

    # Bottom: three failure modes it catches
    st(d, (W//2, 490), '工作流强制过三个"看不出来"的问题', resolve_font_bold(26), TEXT)
    fails = [
        ("孤行标题", "\\cventry 标题被推到下一页，只留 bullets\n用 \\needspace{5\\baselineskip} 兜底", RED),
        ("字体回退", "cover.cls 的 \\lettercontent 吃掉 itemize 字体\n改为 \\fontspec{Raleway} 包裹", ORANGE),
        ("ATS 抓不到邮箱", "邮箱只做成 fontawesome 图标\npdftotext 抽不出来 → 直接放明文", PURPLE),
    ]
    y2 = 560
    fw = 420
    gap2 = 30
    total2 = 3*fw + 2*gap2
    x02 = (W - total2)//2
    for i,(t,sub,c) in enumerate(fails):
        cx = x02 + i*(fw+gap2)
        rr(d, (cx, y2, cx+fw, y2+180), 14, CARD2, c, 2)
        st(d, (cx+fw//2, y2+35), t, resolve_font_bold(24), c)
        # multi-line sub
        for j, line in enumerate(sub.split("\n")):
            st(d, (cx+fw//2, y2+85+j*30), line, resolve_font(18), TEXT if j==0 else DIM)
    return img


IMAGE_SPECS = [
    ("cover-wechat.jpg", 1080, 864, draw_cover_wechat),
    ("cover-zhihu.png", 1600, 900, draw_cover_zhihu),
    ("01-pipeline.png", 1400, 780, draw_pipeline),
    ("02-drafter-reviewer.png", 1400, 820, draw_drafter_reviewer),
    ("03-pdf-ats-loop.png", 1400, 780, draw_pdf_verify),
]

def main():
    print(f"Generating {len(IMAGE_SPECS)} images for {SLUG}")
    for name,w,h,fn in IMAGE_SPECS:
        img = fn()
        save(img, name)
    print("done.")

if __name__ == "__main__":
    main()
