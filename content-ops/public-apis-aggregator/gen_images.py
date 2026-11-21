#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
public-apis 三端推广配图 —— API 网络拓扑 / 数据网格风格
深墨青底 + 电光青节点 + 琥珀金高亮，区别于既往所有项目配色。
5 张：cover-zhihu(1600x900)、structure、auth-cors、ideas(聚合点子矩阵)、mcp-verdict
严格 yy += 游标，斑马纹先画后写字，脚注留足 padding。
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFont

random.seed(20261120)
OUT = os.path.join(os.path.dirname(__file__), "media")
os.makedirs(OUT, exist_ok=True)

FONT_BOLD = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Bold.ttc"
FONT_REG = "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc"

def F(size, bold=True):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size)

# ---- 调色板：深墨青 + 电光青 + 琥珀金 ----
BG = (11, 26, 32)            # 深墨青底
PANEL = (17, 38, 46)         # 面板
PANEL2 = (23, 49, 59)
GRID = (28, 58, 68)
CYAN = (64, 224, 224)        # 电光青
CYAN_DIM = (41, 148, 152)
AMBER = (255, 190, 92)       # 琥珀金
WHITE = (236, 244, 246)
GREY = (150, 178, 184)
GREEN = (110, 214, 152)
CORAL = (255, 138, 117)
PURPLE = (168, 148, 240)

def base(w, h):
    img = Image.new("RGB", (w, h), BG)
    d = ImageDraw.Draw(img)
    # 细网格
    for x in range(0, w, 48):
        d.line([(x, 0), (x, h)], fill=GRID, width=1)
    for y in range(0, h, 48):
        d.line([(0, y), (w, y)], fill=GRID, width=1)
    return img, d

def node(d, x, y, r, color, glow=True):
    if glow:
        for i in range(4, 0, -1):
            d.ellipse([x-r-i*3, y-r-i*3, x+r+i*3, y+r+i*3],
                      outline=tuple(int(c*0.5) for c in color), width=1)
    d.ellipse([x-r, y-r, x+r, y+r], fill=color)

def text(d, xy, s, font, fill=WHITE, anchor=None):
    d.text(xy, s, font=font, fill=fill, anchor=anchor)

# ============ 1. 封面 cover-zhihu 1600x900 ============
def cover():
    w, h = 1600, 900
    img, d = base(w, h)
    # 中心 hub
    cx, cy = w//2, h//2 - 70
    # 环绕节点（代表 51 分类，画 12 个主节点）
    labels = ["开发", "金融", "加密", "地理", "政务", "游戏", "交通",
              "天气", "机器学习", "社交", "视频", "健康"]
    R = 290
    pts = []
    for i in range(12):
        ang = -math.pi/2 + i*2*math.pi/12
        x = cx + R*math.cos(ang); y = cy + R*math.sin(ang)
        pts.append((x, y))
        d.line([(cx, cy), (x, y)], fill=CYAN_DIM, width=2)
    for i, (x, y) in enumerate(pts):
        col = AMBER if i % 4 == 0 else CYAN
        node(d, x, y, 16, col)
        # 标签
        lx = cx + (R+62)*math.cos(-math.pi/2 + i*2*math.pi/12)
        ly = cy + (R+62)*math.sin(-math.pi/2 + i*2*math.pi/12)
        text(d, (lx, ly), labels[i], F(30), WHITE, anchor="mm")
    # 中心 hub
    node(d, cx, cy, 60, AMBER, glow=True)
    text(d, (cx, cy-8), "2465", F(48), BG, anchor="mm")
    text(d, (cx, cy+34), "免费 API", F(26), BG, anchor="mm")
    # 标题
    text(d, (80, 90), "public-apis：50 万 Star 的免费 API 大全", F(58), WHITE)
    text(d, (80, 168), "我克隆了这个仓库，实测 51 分类 / 2465 个接口 / 60 个 MCP 服务器", F(34), CYAN)
    # 底部深色遮罩条，避免放射连线压住引导语
    d.rectangle([0, h-120, w, h], fill=BG)
    text(d, (80, h-86), "聚合能做出什么应用？一篇讲透数据底座、认证边界与 8 个可落地方向", F(30), GREY)
    img.save(os.path.join(OUT, "cover-zhihu.png"))
    print("cover-zhihu.png")

# ============ 2. 仓库结构与规模 ============
def structure():
    w, h = 1400, 1000
    img, d = base(w, h)
    text(d, (70, 60), "一个 README 撑起 50 万 Star：仓库的真实构成", F(46), WHITE)
    text(d, (70, 128), "数据来自本地克隆 + 脚本解析，非 README 转述", F(26), GREY)
    # 左侧大数字卡
    cards = [
        ("500,524", "GitHub Star", CYAN),
        ("2,465", "标准 API 条目", AMBER),
        ("51", "内容分类", GREEN),
        ("60", "MCP 服务器(新)", PURPLE),
        ("2,406", "贡献者(约)", CYAN),
        ("7,019", "提交(约)", AMBER),
    ]
    cw, ch = 380, 170
    x0, y0 = 70, 200
    for i, (num, lab, col) in enumerate(cards):
        r, c = divmod(i, 2)
        x = x0 + c*(cw+40); y = y0 + r*(ch+36)
        d.rounded_rectangle([x, y, x+cw, y+ch], radius=18, fill=PANEL, outline=col, width=2)
        text(d, (x+28, y+30), num, F(60), col)
        text(d, (x+28, y+118), lab, F(28), GREY)
    # 右侧工程化
    rx = 920
    d.rounded_rectangle([rx, 200, w-70, 880], radius=18, fill=PANEL, outline=CYAN_DIM, width=2)
    text(d, (rx+30, 230), "工程化与质量门禁", F(34), CYAN)
    items = [
        ("单一数据源", "379KB README.md 即数据库"),
        ("严格表格契约", "API/描述/Auth/HTTPS/CORS/Link"),
        ("format.py 校验", "字母序、字段、CORS 枚举值"),
        ("links.py 校验", "PR 自动检查死链"),
        ("31 个单元测试", "本地实测全部通过 (OK)"),
        ("3 个 GitHub Actions", "push/PR/链接 全自动"),
        ("贡献门槛", "拒绝营销 PR，须可免费调用"),
        ("新增 MCP 专栏", "拥抱 Agent / MCP 生态"),
    ]
    yy = 300
    for k, v in items:
        d.ellipse([rx+30, yy+10, rx+44, yy+24], fill=AMBER)
        text(d, (rx+60, yy), k, F(28), WHITE)
        text(d, (rx+60, yy+38), v, F(22), GREY)
        yy += 70
    text(d, (70, h-50), "许可证 MIT · 主语言 Python · 默认分支 master · 2016 建仓至今仍每日维护", F(24), GREY)
    img.save(os.path.join(OUT, "structure.png"))
    print("structure.png")

# ============ 3. 认证 / HTTPS / CORS 分布（聚合可行性核心）============
def auth_cors():
    w, h = 1400, 980
    img, d = base(w, h)
    text(d, (70, 60), "能不能白嫖、能不能纯前端调：三张分布表说清", F(44), WHITE)
    text(d, (70, 126), "这是决定聚合应用架构的关键，而不是看接口总数", F(26), GREY)

    # 横向条形图通用函数
    def bars(x, y, ww, title, rows, total):
        text(d, (x, y), title, F(32), CYAN)
        yy = y + 60
        maxv = max(v for _, v, _ in rows)
        for name, v, col in rows:
            text(d, (x, yy), name, F(24), WHITE)
            barx = x + 200
            barwmax = ww - 320
            bw = int(barwmax * v / maxv)
            d.rounded_rectangle([barx, yy, barx+barwmax, yy+34], radius=8, fill=PANEL2)
            d.rounded_rectangle([barx, yy, barx+bw, yy+34], radius=8, fill=col)
            pct = f"{v}  ({v/total*100:.0f}%)"
            text(d, (barx+bw+12, yy+2), pct, F(22), GREY)
            yy += 64

    bars(70, 200, 1260, "认证方式（共 2465 个）", [
        ("免认证 No", 1200, GREEN),
        ("apiKey", 1104, AMBER),
        ("OAuth", 150, PURPLE),
        ("其它特殊认证", 11, CORAL),
    ], 2465)

    bars(70, 520, 1260, "CORS 跨域支持（决定浏览器能否直连）", [
        ("支持 Yes", 1080, CYAN),
        ("未知 Unknown", 1055, GREY),
        ("不支持 No", 330, CORAL),
    ], 2465)

    # 结论高亮条
    d.rounded_rectangle([70, 830, 1330, 935], radius=16, fill=PANEL, outline=AMBER, width=2)
    text(d, (100, 848), "关键交集：656 个接口「免认证 + 支持 CORS」", F(32), AMBER)
    text(d, (100, 898), "= 无需后端、无需 Key，浏览器 fetch 即可直连，是做纯前端聚合 Demo 的首选池", F(24), WHITE)
    img.save(os.path.join(OUT, "auth-cors.png"))
    print("auth-cors.png")

# ============ 4. 聚合应用点子矩阵（本次重点）============
def ideas():
    w, h = 1500, 1280
    img, d = base(w, h)
    text(d, (70, 50), "把 2465 个 API 聚合起来：8 个可落地的应用方向", F(44), WHITE)
    text(d, (70, 116), "每个方向标注依赖的分类、是否需要 Key、变现与难度，基于真实分类条目数", F(24), GREY)

    cols = [
        ("① 个人数据仪表盘", CYAN, ["天气46 + 加密114 + 金融118", "免Key池即可起步", "聚合多源一屏总览", "难度★☆☆ 订阅制"]),
        ("② 垂直行业情报台", AMBER, ["政务142 + 新闻26 + 开放数据98", "多需 apiKey", "政策/招标/监管监控", "难度★★☆ B端SaaS"]),
        ("③ 开发者 API 集市", GREEN, ["开发251 + 测试数据37", "元数据聚合", "分类检索+在线试调+收藏", "难度★★☆ 流量/佣金"]),
        ("④ 旅行规划聚合器", PURPLE, ["交通103 + 地理120 + 天气46", "地图类多需Key", "路线+汇率35+景点一体", "难度★★☆ CPS分销"]),
        ("⑤ 健身运动数据站", CYAN, ["运动76 + 健康54", "大量免Key", "赛事/排名/NBA数据", "难度★☆☆ 广告+会员"]),
        ("⑥ 娱乐内容盲盒", AMBER, ["游戏120 + 动漫21 + 音乐39", "多为免Key+CORS", "随机图/梗/猫狗粮", "难度★☆☆ 涨粉引流"]),
        ("⑦ 加密/金融看板", GREEN, ["加密114 + 金融118 + 汇率35", "行情多免Key", "实时价/汇率/富豪榜", "难度★★☆ 导流交易"]),
        ("⑧ MCP/Agent 工具网关", PURPLE, ["60 MCP + 开发251", "按服务而异", "统一鉴权+用量+路由", "难度★★★ 基础设施"]),
    ]
    cw, ch = 690, 230
    x0, y0 = 70, 180
    for i, (title, col, lines) in enumerate(cols):
        r, c = divmod(i, 2)
        x = x0 + c*(cw+40); y = y0 + r*(ch+24)
        d.rounded_rectangle([x, y, x+cw, y+ch], radius=16, fill=PANEL, outline=col, width=2)
        d.rounded_rectangle([x, y, x+12, y+ch], radius=6, fill=col)
        text(d, (x+34, y+22), title, F(32), col)
        yy = y + 80
        for ln in lines:
            d.ellipse([x+36, yy+10, x+48, yy+22], fill=col)
            text(d, (x+62, yy), ln, F(23), WHITE)
            yy += 38
    # 底部提示条独立区域，避免压住最后一排卡片
    d.rectangle([0, h-58, w, h], fill=BG)
    text(d, (70, h-46), "共同前提：先做「健康度巡检 + 统一缓存 + 鉴权代理」三层，否则免费接口的限流与失效率会拖垮体验", F(24), AMBER)
    img.save(os.path.join(OUT, "ideas.png"))
    print("ideas.png")

# ============ 5. 边界与选型结论 ============
def verdict():
    w, h = 1400, 960
    img, d = base(w, h)
    text(d, (70, 60), "清醒使用：它是目录，不是免运维的数据中台", F(44), WHITE)
    text(d, (70, 126), "50 万 Star 之外，这些边界必须在动手前接受", F(26), GREY)

    left = [
        ("它是什么", CYAN, [
            "人工策展的免费 API 目录",
            "统一字段：Auth/HTTPS/CORS 可筛选",
            "含 60 个 MCP 服务器，跟进 Agent 时代",
            "MIT 协议，元数据可自由复用",
        ]),
        ("适合谁", GREEN, [
            "做 Side Project / 原型的独立开发者",
            "教学演示、黑客马拉松快速出活",
            "想低成本验证产品想法的人",
            "搭建 MCP/Agent 工具链的玩家",
        ]),
    ]
    right = [
        ("它不是什么", CORAL, [
            "不保证接口长期可用（2811 个 open issue）",
            "不提供托管、SLA、统一鉴权或缓存",
            "免费额度/限流由各服务商自定",
            "CORS Unknown 占 43%，前端直连要实测",
        ]),
        ("生产环境建议", AMBER, [
            "后端加代理层，密钥不入前端",
            "定时健康检查 + 自动降级备用源",
            "关键业务别只依赖单一免费接口",
            "遵守各 API 条款，勿滥用爬取",
        ]),
    ]
    def block(x, ww, groups):
        yy = 210
        for title, col, items in groups:
            d.rounded_rectangle([x, yy, x+ww, yy+50], radius=10, fill=PANEL2, outline=col, width=2)
            text(d, (x+24, yy+8), title, F(30), col)
            yy += 66
            for it in items:
                d.ellipse([x+24, yy+10, x+38, yy+24], fill=col)
                text(d, (x+54, yy), it, F(24), WHITE)
                yy += 44
            yy += 24
    block(70, 600, left)
    block(730, 600, right)
    d.rounded_rectangle([70, 815, 1330, 915], radius=16, fill=PANEL, outline=CYAN, width=2)
    text(d, (100, 832), "一句话结论", F(28), CYAN)
    text(d, (100, 878), "把它当「免费数据的黄页 + 起手式」，真正的壁垒在你做的聚合、缓存、体验与选型，而非接口本身", F(25), WHITE)
    img.save(os.path.join(OUT, "verdict.png"))
    print("verdict.png")

if __name__ == "__main__":
    cover(); structure(); auth_cors(); ideas(); verdict()
    print("ALL DONE ->", OUT)
