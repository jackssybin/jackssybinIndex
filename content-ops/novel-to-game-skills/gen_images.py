# -*- coding: utf-8 -*-
"""NovelToGame 配图：游戏霓虹风（深紫黑底 + 电青 + 品红 + 琥珀），契合 skill/游戏主题。"""
from PIL import Image, ImageDraw, ImageFont
import os
OUT = "/root/jackssybinIndex/static/images/novel-to-game-skills"
os.makedirs(OUT, exist_ok=True)
FD = "/usr/share/fonts/google-noto-cjk"
def font(w, s): return ImageFont.truetype(f"{FD}/NotoSansCJK-{w}.ttc", s)

BG = (16, 12, 28); PANEL = (28, 22, 46); PANEL2 = (40, 31, 62); LINE = (74, 58, 104)
CYAN = (56, 224, 232); MAGENTA = (236, 112, 196); AMBER = (250, 204, 94)
LIME = (148, 232, 132); LILAC = (180, 158, 240); WHITE = (238, 234, 248); MUTED = (168, 158, 190)

def rr(d, b, r, fill=None, outline=None, width=1):
    d.rounded_rectangle(b, radius=r, fill=fill, outline=outline, width=width)
def t(d, xy, s, f, c, anchor=None):
    d.text(xy, s, font=f, fill=c, anchor=anchor)

def zhihu_cover():
    W, H = 1600, 900
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 6], fill=MAGENTA)
    t(d, (110, 92), "把一本小说，做成一款能玩的游戏", font("Black", 54), WHITE)
    t(d, (110, 174), "NovelToGame：7 个 Agent skill 组成的改编工作流，装进 Claude Code/Codex/Kimi", font("Bold", 26), CYAN)
    pts = [("忠于原著的拆书", "SOURCE_BIBLE 每条关键事实标注章回出处，原著与原创严格区分四类"),
           ("硬性淘汰的概念选型", "多方案比选，换皮模板、脱离核心冲突的玩法直接否决"),
           ("实机运行六项 QA 门禁", "launch/render/input/coreLoop/outcome/restart 全 PASS 才算可玩")]
    y = 296
    for a, b in pts:
        d.rectangle([112, y + 10, 126, y + 34], fill=AMBER)
        t(d, (150, y), a, font("Bold", 28), MAGENTA)
        t(d, (150, y + 42), b, font("Regular", 22), MUTED)
        y += 112
    rr(d, (1150, 140, 1490, 690), 20, fill=PANEL, outline=LINE, width=2)
    rows = [("Star", "1003"), ("Fork", "136"), ("Skill", "7 个"), ("版本", "v0.7.1"),
            ("适配", "3 大 CLI"), ("示例", "2 款可玩"), ("协议", "MIT")]
    yy = 182
    for k, v in rows:
        t(d, (1185, yy), k, font("Regular", 22), MUTED)
        t(d, (1455, yy), v, font("Bold", 23), AMBER, anchor="ra")
        yy += 64
    t(d, (112, 828), "基于 2026-11-11 仓库源码实测 · 这是一套 skill 工作流而非现成软件，产出质量取决于你用的模型", font("Medium", 20), MUTED)
    img.save(f"{OUT}/cover-zhihu.png"); print("cover-zhihu.png")

def pipeline():
    W, H = 1200, 800
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 32), "7 个 skill 串成的改编流水线", font("Black", 30), WHITE)
    steps = [("① 拆书", "novel-game-analyze\n产出 SOURCE_BIBLE\n原文出处+四类标注", CYAN),
             ("② 概念", "game-concept\n多方案硬否决\n选定玩法方向", MAGENTA),
             ("③ 世界设计", "game-world-design\nGAME_DESIGN\n核心循环与关卡", LILAC),
             ("④ 美术", "game-art-direction\nART_DIRECTION\n视听风格与反馈", AMBER),
             ("⑤ 构建", "game-build\n白盒原型先行\n目标环境出可运行版", LIME),
             ("⑥ 验收", "game-qa\n六项实机 QA\n不通过按职责退回", MAGENTA)]
    bw, bh = 172, 380
    gap = 12
    x, y = 56, 130
    for i, (h, b, c) in enumerate(steps):
        xx = x + i * (bw + gap)
        rr(d, (xx, y, xx + bw, y + bh), 12, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, y, xx + bw, y + 6], fill=c)
        t(d, (xx + bw / 2, y + 40), h, font("Bold", 20), c, anchor="mm")
        lines = b.split("\n")
        yy = y + 100
        for ln in lines:
            t(d, (xx + 14, yy), ln, font("Regular", 15), (218, 212, 232))
            yy += 48
        if i < 5:
            t(d, (xx + bw + gap - 1, y + bh / 2), "›", font("Black", 26), MUTED, anchor="mm")
    rr(d, (56, 556, 1144, 668), 12, fill=PANEL2, outline=CYAN, width=1)
    t(d, (84, 586), "总入口 novel-to-game 负责编排：建立工作区、串起各阶段、只核对 scope 与 playable 两项，", font("Bold", 19), CYAN, anchor="lm")
    t(d, (84, 622), "各设计文档有独立负责人，构建阶段不得擅自推翻；director 模式会在三个节点停下等你拍板", font("Regular", 18), MUTED, anchor="lm")
    t(d, (56, 710), "另有 resume 模式读 _progress.md 从最早未完成节点续跑，支持任意语言小说", font("Medium", 18), MUTED)
    img.save(f"{OUT}/pipeline.png"); print("pipeline.png")

def contract():
    W, H = 1200, 760
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "忠于原著怎么落地：事实分级 + 文档契约", font("Black", 29), WHITE)
    # 左：四类事实
    rr(d, (60, 118, 560, 560), 14, fill=PANEL, outline=CYAN, width=2)
    t(d, (88, 146), "原著事实四分类（SOURCE_BIBLE）", font("Bold", 22), CYAN)
    facts = [("immutable 不可改", "世界硬规则、关键转折", LIME),
             ("adaptable 可调适", "可服务玩法的弹性设定", AMBER),
             ("open 原著留白", "未交代处允许设计发明", LILAC),
             ("conflicted 前后矛盾", "显式标注，不替原著圆谎", MAGENTA)]
    yy = 204
    for h, b, c in facts:
        d.rectangle([88, yy + 6, 102, yy + 30], fill=c)
        t(d, (118, yy), h, font("Bold", 20), c)
        t(d, (118, yy + 34), b, font("Regular", 17), MUTED)
        yy += 82
    t(d, (88, 520), "原创内容一律标注“设计发明”，绝不冒充原著", font("Bold", 17), MAGENTA)
    # 右：工作区文档
    rr(d, (620, 118, 1140, 560), 14, fill=PANEL, outline=MAGENTA, width=2)
    t(d, (648, 146), "最小工作区的文档链", font("Bold", 22), MAGENTA)
    docs = ["PRODUCT_BRIEF 产品简报（锁平台/引擎）", "analysis/SOURCE_BIBLE 拆书事实库",
            "concepts/CONCEPT 概念选型与淘汰理由", "design/GAME_DESIGN 玩法与关卡",
            "design/ART_DIRECTION 美术方向", "build/BUILD_BRIEF + app/ 可运行代码",
            "qa/verification.json 六项实机结果"]
    yy = 200
    for it in docs:
        d.ellipse([648, yy + 8, 662, yy + 22], outline=MAGENTA, width=2)
        t(d, (676, yy + 15), it, font("Regular", 17), (218, 212, 232), anchor="lm")
        yy += 48
    rr(d, (60, 600, 1140, 690), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 630), "自动化状态只有 NOT_RUN / FAIL / PASS 三值，没真跑过实机就不能算验收通过；", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 664), "问题按 product/design/art/build 职责退回修复，从根源返工而非打补丁", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/contract.png"); print("contract.png")

def examples():
    W, H = 1200, 740
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "两个真实可玩示例：不是 PPT，是能通关的游戏", font("Black", 28), WHITE)
    cards = [
        ("西游记 · 三借芭蕉扇", "回合制 RPG（梦幻西游式）", ["191 个文件 / 1.09 万行 JS", "四张彩绘场景+自动寻路", "五行相克/愤怒特技/七十二变", "六项 QA 全 PASS，浏览器可玩"], CYAN),
        ("金瓶梅 · 风月总账", "古风恋爱互动影游（18+）", ["274 个文件 / 4386 行 JS", "五条个人线 16 个结局", "选择触发专属剧情过场", "快存/剧情树/CG 鉴赏齐全"], MAGENTA),
    ]
    x = 60
    for i, (h, sub, items, c) in enumerate(cards):
        xx = x + i * 552
        rr(d, (xx, 120, xx + 524, 560), 16, fill=PANEL, outline=c, width=2)
        d.rectangle([xx, 120, xx + 524, 126], fill=c)
        t(d, (xx + 28, 156), h, font("Bold", 25), c)
        t(d, (xx + 28, 200), sub, font("Bold", 18), AMBER)
        yy = 258
        for it in items:
            d.ellipse([xx + 28, yy + 8, xx + 42, yy + 22], outline=c, width=2)
            t(d, (xx + 56, yy + 15), it, font("Regular", 18), (220, 214, 234), anchor="lm")
            yy += 62
    rr(d, (60, 600, 1140, 680), 12, fill=PANEL2, outline=LIME, width=1)
    t(d, (88, 628), "每个示例都附完整改编工作区：原著版本说明、概念淘汰理由、设计文档、源码与实机通关记录，", font("Bold", 19), LIME, anchor="lm")
    t(d, (88, 660), "limitations 如实记录未测环境（如移动端、其他浏览器），不把没测的说成已验证", font("Regular", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/examples.png"); print("examples.png")

def limits():
    W, H = 1200, 780
    img = Image.new("RGB", (W, H), BG); d = ImageDraw.Draw(img)
    t(d, (60, 34), "祛魅：它是 skill 不是软件，这些前提要先想清", font("Black", 28), WHITE)
    rr(d, (60, 116, 580, 560), 14, fill=PANEL, outline=LIME, width=2)
    t(d, (88, 144), "它适合什么", font("Bold", 24), LIME)
    good = ["已有 Claude Code/Codex/Kimi 使用习惯", "想把小说/故事做成可玩原型", "看重原著考据与设计可追溯", "需要浏览器小游戏/互动叙事", "团队想要标准化改编流程", "喜欢 Markdown 文档完全自持"]
    yy = 198
    for it in good:
        d.ellipse([88, yy + 8, 104, yy + 24], outline=LIME, width=2)
        t(d, (120, yy + 16), it, font("Regular", 19), (222, 216, 236), anchor="lm")
        yy += 56
    rr(d, (620, 116, 1140, 560), 14, fill=PANEL, outline=MAGENTA, width=2)
    t(d, (648, 144), "要认清的边界", font("Bold", 24), MAGENTA)
    bad = ["不是开箱应用，是给 AI 的指令集", "产出质量取决于底层模型能力", "消耗 Agent 额度，复杂项目耗时不低", "大型 3A/商业引擎非其目标场景", "生成代码仍需自己 review 和测试", "配音默认关闭，实时合成要显式批准"]
    yy = 198
    for it in bad:
        d.ellipse([648, yy + 8, 664, yy + 24], outline=MAGENTA, width=2)
        t(d, (680, yy + 16), it, font("Regular", 19), (222, 216, 236), anchor="lm")
        yy += 56
    rr(d, (60, 596, 1140, 716), 12, fill=PANEL2, outline=AMBER, width=1)
    t(d, (88, 626), "MIT 协议商用友好；安装靠一条 npx skills add 命令，全局或当前目录可选。", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 660), "它的核心价值是把资深游戏策划的方法论固化成可复现流程，而不是承诺一键生成大作——", font("Bold", 19), AMBER, anchor="lm")
    t(d, (88, 692), "把它当靠谱的“AI 改编总监”，而非替代你判断的黑盒", font("Medium", 18), MUTED, anchor="lm")
    img.save(f"{OUT}/limits.png"); print("limits.png")

zhihu_cover()
pipeline()
contract()
examples()
limits()
print("ALL DONE")
