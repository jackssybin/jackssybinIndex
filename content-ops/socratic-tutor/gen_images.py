#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
janestreet/agent_skills · socratic-tutor 三端推广配图
学院墨绿 + 羊皮纸风格（区别于职场系列的青蓝/赭红）
01 苏格拉底教学闭环（6 步循环）
02 0-5 级技能地图（还原 SKILL.md 真实 ASCII 进度条）
03 普通 AI 答题机 vs 苏格拉底私教 对照
04 适合 / 缓行人群 + 5 个随时命令
严格 yy += 游标、手动语义断行、先画底再写字、Noto Sans CJK。
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(OUT, exist_ok=True)
FB = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FR = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"
FM = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Medium.ttc"
def F(s, bold=True):
    p = FB if bold == "b" else (FM if bold == "m" else FR)
    return ImageFont.truetype(p, s)

# 学院墨绿 + 羊皮纸
PAPER = (244, 240, 231)
CARD  = (252, 249, 242)
INK   = (38, 46, 40)
INK2  = (84, 92, 84)
GREY  = (140, 144, 136)
LINE  = (220, 214, 200)
GREEN = (34, 94, 74); GREENBG = (226, 238, 232)
GOLD  = (178, 132, 44); GOLDBG = (248, 239, 220)
RED   = (168, 74, 60);  REDBG  = (246, 232, 228)
TEAL2 = (52, 116, 122); TEALBG = (228, 240, 240)

def canvas(w, h):
    return Image.new("RGB", (w, h), PAPER), ImageDraw.Draw(Image.new("RGB", (w, h), PAPER))

def make(w, h):
    img = Image.new("RGB", (w, h), PAPER)
    return img, ImageDraw.Draw(img)

def rrect(d, box, fill, outline=None, w=2):
    d.rounded_rectangle(box, radius=16, fill=fill, outline=outline, width=w)

def title(d, w, main, sub, accent=GREEN):
    d.rectangle([0, 0, w, 134], fill=INK)
    d.rectangle([0, 134, w, 140], fill=accent)
    d.text((56, 32), main, font=F(38, "b"), fill=(245, 242, 233))
    d.text((56, 90), sub, font=F(23, "r"), fill=(190, 200, 192))

# ===== 图1：教学闭环 6 步 =====
def fig1():
    w, h = 1280, 940
    img, d = make(w, h)
    title(d, w, "苏格拉底私教的完整教学闭环", "不是甩给你答案，而是一套有诊断、有状态、有终考的教学协议")
    steps = [
        ("1", "意图守卫", "一次性提问不启动\n只在你明确要学的时候开课", GREEN, GREENBG),
        ("2", "入学诊断", "3-5 道由易到难\n一次一题，定位真实起点", TEAL2, TEALBG),
        ("3", "技能地图", "拆成4-10个子技能\n每个按0-5级追踪掌握度", GOLD, GOLDBG),
        ("4", "追问循环", "一次只问一个问题\n答错不给答案，只缩小追问", GREEN, GREENBG),
        ("5", "间隔复习", "不打招呼重测旧技能\n没过就降级，重新练", TEAL2, TEALBG),
        ("6", "终考通关", "混合评估覆盖全部技能\n过了才结课，不过回到循环", GOLD, GOLDBG),
    ]
    cw, ch, gx, gy = 372, 280, 24, 28
    x0, y0 = 56, 186
    for i, (num, head, desc, col, bg) in enumerate(steps):
        r, c = divmod(i, 3)
        x = x0 + c * (cw + gx)
        y = y0 + r * (ch + gy)
        rrect(d, [x, y, x + cw, y + ch], CARD, col)
        d.ellipse([x + 24, y + 24, x + 84, y + 84], fill=col)
        d.text((x + 54, y + 54), num, font=F(36, "b"), fill=(255, 255, 255), anchor="mm")
        d.text((x + 104, y + 38), head, font=F(30, "b"), fill=col)
        l1, l2 = desc.split("\n")
        d.text((x + 28, y + 120), l1, font=F(23, "r"), fill=INK2)
        d.text((x + 28, y + 158), l2, font=F(23, "r"), fill=INK2)
        # 横向箭头
        if c < 2:
            ax = x + cw + 4
            d.polygon([(ax, y + ch // 2 - 8), (ax + 15, y + ch // 2), (ax, y + ch // 2 + 8)], fill=GREY)
    # 底部回流说明
    rrect(d, [56, 800, 1224, 884], GREENBG, GREEN)
    d.text((84, 818), "关键在第 4 步：它默认你答错，也不直接讲——而是问一个更窄的问题，", font=F(24, "m"), fill=GREEN)
    d.text((84, 852), "逼你自己发现矛盾；连续 2-3 次还错，才简短讲解并立刻换个角度重测。", font=F(24, "m"), fill=GREEN)
    img.save(os.path.join(OUT, "01-teaching-loop.png")); print("01-teaching-loop.png")

# ===== 图2：0-5 级技能地图（还原 ASCII）=====
def fig2():
    w, h = 1280, 980
    img, d = make(w, h)
    title(d, w, "把“学会了”变成可追踪的 0-5 级", "技能地图用块字符进度条渲染，每次升级都重画——这是它的状态机")
    # 等级定义条
    levels = [("0", "没听过"), ("1", "听说过"), ("2", "能跟上"), ("3", "带得动"), ("4", "独立做"), ("5", "能教别人")]
    bw, gap = 186, 14
    x0 = 56
    for i, (lv, name) in enumerate(levels):
        x = x0 + i * (bw + gap)
        col = GREEN if i >= 4 else (TEAL2 if i == 3 else GOLD)
        rrect(d, [x, 180, x + bw, 268], GREENBG if i >= 4 else CARD, col)
        d.text((x + bw // 2, 208), lv + " 级", font=F(28, "b"), fill=col, anchor="mm")
        d.text((x + bw // 2, 244), name, font=F(21, "r"), fill=INK2, anchor="mm")
    # 模拟一张真实技能地图（终端风格卡片）
    term_x, term_y, term_w, term_h = 56, 312, 1168, 470
    rrect(d, [term_x, term_y, term_x + term_w, term_y + term_h], (36, 42, 38), (36, 42, 38))
    d.rounded_rectangle([term_x, term_y, term_x + term_w, term_y + 52], radius=16, fill=(52, 60, 54))
    d.rectangle([term_x, term_y + 30, term_x + term_w, term_y + 52], fill=(52, 60, 54))
    for i, c in enumerate([(214, 96, 84), (224, 178, 84), (110, 178, 120)]):
        d.ellipse([term_x + 24 + i * 30, term_y + 18, term_x + 40 + i * 30, term_y + 34], fill=c)
    d.text((term_x + 130, term_y + 16), "skill map（SKILL.md 规定的 ASCII 渲染）", font=F(21, "m"), fill=(190, 200, 192))
    mono = F(24, "m")
    rows = [
        ("Topic: SQL 窗口函数", "overall: ######.... 58%", True),
        ("────────────────────────────────", "", False),
        ("子技能A 分区 PARTITION BY", "########..  4/5  * 独立", False),
        ("子技能B 窗口帧 FRAME", "######....  3/5  <- 当前重点", False),
        ("子技能C 排名 RANK/ROW_NUMBER", "####......  2/5", False),
        ("子技能D 性能与执行计划", "##........  1/5", False),
    ]
    yy = term_y + 84
    for left, right, head in rows:
        if head:
            d.text((term_x + 30, yy), left, font=mono, fill=(236, 224, 180))
            d.text((term_x + term_w - 30, yy), right, font=mono, fill=(236, 224, 180), anchor="ra")
        elif "───" in left:
            d.text((term_x + 30, yy), left, font=mono, fill=(110, 120, 112))
        else:
            d.text((term_x + 30, yy), left, font=F(22, "r"), fill=(214, 220, 214))
            rcol = GOLD if "当前重点" in right else (150, 200, 168)
            d.text((term_x + term_w - 30, yy), right, font=F(22, "m"), fill=rcol, anchor="ra")
        yy += 58
    # 底部严格规则
    rrect(d, [56, 812, 1224, 912], GOLDBG, GOLD)
    d.text((84, 830), "严格规则：级别是挣来的不是给的——升级要 2 次以上独立验证，", font=F(23, "m"), fill=GOLD)
    d.text((84, 866), "且至少一次是无提示回忆；部分正确不算对，复习不过直接降级。", font=F(23, "m"), fill=GOLD)
    img.save(os.path.join(OUT, "02-skill-map.png")); print("02-skill-map.png")

# ===== 图3：普通 AI vs 苏格拉底私教 =====
def fig3():
    w, h = 1280, 1000
    img, d = make(w, h)
    title(d, w, "同样一个问题，两种 AI 的回答方式", "差别不在知识面，在它愿不愿意把思考的苦力留给你")
    rows = [
        ("你问了一个不太对的问题", ("立刻顺着你，给出完整答案", "先反问，暴露你问题里的前提漏洞")),
        ("你的回答半对半错", ("夸你“很棒”，把正确答案补上", "不算对，继续追问到底哪里没想清")),
        ("你答对了", ("进入下一个知识点", "当魔鬼代言人：你确定吗？那 X 情况呢？")),
        ("学完一周后", ("没有后续，大概率已经忘光", "无预警抽测旧技能，忘了就降级重练")),
        ("怎么算“学会”", ("你觉得懂了就算", "要无提示回忆 + 能处理边界题、能教别人")),
    ]
    y0, rh, gap = 178, 122, 14
    d.text((90, y0 - 46), "场景", font=F(25, "b"), fill=GREY)
    d.text((430, y0 - 46), "普通 AI 答题机", font=F(25, "b"), fill=RED)
    d.text((850, y0 - 46), "苏格拉底私教", font=F(25, "b"), fill=GREEN)
    for i, (scene, pair) in enumerate(rows):
        bad, good = pair
        y = y0 + i * (rh + gap)
        rrect(d, [56, y, 1224, y + rh], CARD, LINE)
        rrect(d, [56, y, 360, y + rh], PAPER, LINE)
        d.text((82, y + rh // 2), scene, font=F(23, "m"), fill=INK, anchor="lm")
        rrect(d, [380, y + 18, 770, y + rh - 18], REDBG, RED)
        d.text((406, y + rh // 2), bad, font=F(22, "r"), fill=INK2, anchor="lm")
        rrect(d, [790, y + 18, 1200, y + rh - 18], GREENBG, GREEN)
        d.text((816, y + rh // 2), good, font=F(22, "r"), fill=INK2, anchor="lm")
    img.save(os.path.join(OUT, "03-ai-vs-tutor.png")); print("03-ai-vs-tutor.png")

# ===== 图4：适合/缓行 + 5 命令 =====
def fig4():
    w, h = 1280, 1040
    img, d = make(w, h)
    title(d, w, "谁该用、谁先缓一缓，以及 5 个随时可用的命令", "零代码零依赖，但它是一种“慢学习”，先确认你吃不吃这套")
    # 左：适合
    rrect(d, [56, 178, 620, 560], GREENBG, GREEN)
    d.rounded_rectangle([56, 178, 620, 244], radius=16, fill=GREEN)
    d.rectangle([56, 220, 620, 244], fill=GREEN)
    d.text((84, 190), "适合谁", font=F(30, "b"), fill=(255, 255, 255))
    yy = 286
    for t in ["想真正吃透硬知识：数学、语言、", "编程、金融概念，而不是只求看懂",
              "备考、需要长期留存而非临时记忆", "愿意被追问、能接受答错被拆穿",
              "想给产品加教学模块的开发者", "可直接借鉴这套有状态的协议"]:
        d.ellipse([88, yy + 10, 102, yy + 24], fill=GREEN)
        d.text((118, yy), t, font=F(22, "r"), fill=INK2)
        yy += 44
    # 右：缓行
    rrect(d, [660, 178, 1224, 560], REDBG, RED)
    d.rounded_rectangle([660, 178, 1224, 244], radius=16, fill=RED)
    d.rectangle([660, 220, 1224, 244], fill=RED)
    d.text((688, 190), "谁先缓一缓", font=F(30, "b"), fill=(255, 255, 255))
    yy = 286
    for t in ["只想快速查答案、要现成代码片段", "它故意慢，故意不直接投喂",
              "需要多模态或动手实验环境的场景", "纯文本协议，工具调用只是可选",
              "只能碎片时间、无法连续多轮对话", "学习节奏被打断，状态机难推进"]:
        d.ellipse([692, yy + 10, 706, yy + 24], fill=RED)
        d.text((722, yy), t, font=F(22, "r"), fill=INK2)
        yy += 44
    # 下：5 命令
    rrect(d, [56, 596, 1224, 952], CARD, GOLD)
    d.text((84, 620), "学习中随时可输入的 5 个命令", font=F(28, "b"), fill=GOLD)
    cmds = [
        ("show progress", "重画技能地图，看各级进度"),
        ("harder / easier", "当场调高或调低难度"),
        ("just tell me", "只对当前这题跳过追问、直接讲"),
        ("save state", "导出状态块，可贴进新会话续学"),
        ("resume from:", "粘贴状态块，从上次断点继续"),
    ]
    yy = 680
    for i, (cmd, desc) in enumerate(cmds):
        col = i % 2
        x = 84 if col == 0 else 660
        if col == 0 and i > 0:
            pass
        rrect(d, [x, yy, x + 540, yy + 44], GOLDBG, GOLD, 1)
        d.text((x + 16, yy + 22), cmd, font=F(21, "b"), fill=GOLD, anchor="lm")
        d.text((x + 250, yy + 22), desc, font=F(19, "r"), fill=INK2, anchor="lm")
        if col == 1:
            yy += 58
    # 底部结论
    rrect(d, [56, 972, 1224, 1024], GREENBG, GREEN)
    d.text((84, 986), "最小上手：把 socratic-tutor 目录放进 agent 的 skills 文件夹，说一句 teach me X 即可。", font=F(22, "m"), fill=GREEN)
    img.save(os.path.join(OUT, "04-who-and-commands.png")); print("04-who-and-commands.png")

if __name__ == "__main__":
    fig1(); fig2(); fig3(); fig4()
    print("ALL DONE ->", OUT)
