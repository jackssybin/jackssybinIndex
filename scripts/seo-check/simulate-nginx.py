#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nginx 路由仿真：不部署也能核对 deploy/nginx-jackssybin.conf 的抓取行为。

用法（在仓库根目录）：
    hugo --destination public --minify --cleanDestinationDir
    python scripts/seo-check/simulate-nginx.py [产物目录，默认 public]

为什么要这个脚本：
    2026-09 百度收录归零的两大主因都出在 nginx 的 URL 处理上
    （目录 403、以及 301 到 robots 禁抓的 /search.html）。
    改 nginx 后很难在不部署的前提下验证，本脚本用 Python 复现
    nginx 的 location 匹配顺序与 try_files 语义，把结果算出来。

必须通过的不变量：
    * 没有任何 URL 返回 403
    * 老入口（/archives /tags/ /mysql/ ...）301 到真实存在的 .html
    * /tags/<不存在的标签>.html 返回 404，绝不 301 到 /search.html
    * ?p=N 返回 410
    * 正常内容页仍然 200
"""
import os
import re
import sys
from collections import Counter
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BUILD = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "public")
if not os.path.isabs(BUILD):
    BUILD = os.path.join(ROOT, BUILD)


def _case_sensitive_lookup(uri_path):
    """按大小写敏感语义查文件（模拟 Linux ext4）。
    Windows 文件系统不区分大小写，直接 os.path.isfile 会把
    /tags/Linux.html 误判为存在（服务器上实际只有 linux.html）。"""
    rel = uri_path.lstrip("/")
    if rel == "":
        return False
    parts = rel.split("/")
    cur = BUILD
    for part in parts[:-1]:
        try:
            entries = os.listdir(cur)
        except OSError:
            return False
        if part not in entries:
            return False
        cur = os.path.join(cur, part)
    try:
        entries = os.listdir(cur)
    except OSError:
        return False
    target = parts[-1]
    return target in entries and os.path.isfile(os.path.join(cur, target))


def exists(uri_path):
    if uri_path in ("/", ""):
        return os.path.isfile(os.path.join(BUILD, "index.html"))
    return _case_sensitive_lookup(uri_path)


def is_dir(uri_path):
    """大小写敏感地判断 URI 是否指向已存在的目录（模拟 Linux ext4）。"""
    rel = uri_path.strip("/")
    cur = BUILD
    if rel == "":
        return True
    for part in rel.split("/"):
        try:
            entries = os.listdir(cur)
        except OSError:
            return False
        if part not in entries:
            return False
        cur = os.path.join(cur, part)
    return os.path.isdir(cur)


# ── 与 deploy/nginx-jackssybin.conf 的 443 server 块保持一致 ───────────────
EXACT = {
    "/archives":          ("redirect", "/archives.html"),
    "/archives/":         ("redirect", "/archives.html"),
    "/tags/":             ("redirect", "/tags.html"),
    "/topics/":           ("redirect", "/topics.html"),
    "/nav/":              ("redirect", "/nav.html"),
    "/mysql/":            ("redirect", "/mysql.html"),
    "/netty/":            ("redirect", "/netty.html"),
    "/linux/":            ("redirect", "/linux.html"),
    "/springboot4/":      ("redirect", "/springboot4.html"),
    "/admin/report.html": ("try_files", ["$uri"], 404),
    "/404.html":          ("internal", None),
}

RE_ASSET = re.compile(r"\.(?:css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$", re.I)
RE_TAG = re.compile(r"^/tags/([^/.]+)(?:\.html)?/?$")
RE_ART_DIR = re.compile(r"^(/articles/.+)/$")
RE_ART_HTML = re.compile(r"^(/articles/.+)\.html$")
RE_HTML = re.compile(r"\.html$")
RE_DIR = re.compile(r"^(.+)/$")


def route(uri, query=""):
    path = unquote(uri)
    args = {}
    for kv in query.split("&"):
        if kv:
            k, _, v = kv.partition("=")
            args[k] = v

    if path in EXACT:
        act = EXACT[path]
        if act[0] == "redirect":
            return 301, "location = %s -> %s" % (path, act[1])
        if act[0] == "internal":
            return 200, "internal 404 页面"
        return (200 if exists(path) else 404), "location = %s" % path

    # server 级 if：老分页参数一律 410
    if "p" in args and args["p"] != "":
        return 410, 'server if: $arg_p != "" -> 410'

    if RE_ASSET.search(path):
        return (200 if exists(path) else 404), "asset 正则 try_files $uri"

    m = RE_TAG.match(path)
    if m:
        tgt = "/tags/%s.html" % m.group(1)
        return (200 if exists(tgt) else 404), "tag 正则 try_files %s" % tgt

    m = RE_ART_DIR.match(path)
    if m:
        base = m.group(1)
        if exists(base + ".html"):
            return 301, "article 目录式 if(-f %s.html) -> 301" % base
        return (200 if exists(base + "/index.html") else 404), \
            "article 目录式 try_files %s/index.html" % base

    m = RE_ART_HTML.match(path)
    if m:
        base = m.group(1)
        if exists(base + "/index.html"):
            return 301, "article .html 式 -> 301 %s/" % base
        return (200 if exists(path) else 404), "article .html 式 try_files $uri"

    if RE_HTML.search(path):
        return (200 if exists(path) else 404), "通用 \\.html$ try_files $uri"

    m = RE_DIR.match(path)
    if m:
        d = m.group(1)
        return (200 if exists(d + "/index.html") else 404), \
            "目录正则 try_files %s/index.html" % d

    # ── location /  try_files $uri $uri.html $uri/ =404 ──────────────────
    #
    # ⚠️ 这里最容易算错，2026-09-18 就因为算错而漏掉了一次生产事故：
    #    nginx 的 try_files 只在【参数文本以 / 结尾】时才把目录视为命中。
    #    `$uri` 这个参数名末字符是 i，不是 /，
    #    所以它【只匹配普通文件，遇到目录一律 continue 到下一项】。
    #    只有 `$uri/` 才会命中目录、进而交给 index 模块。
    #
    #    曾把配置改成 `$uri $uri.html =404`（删掉 $uri/），
    #    导致 `/` 匹配不到 `$uri`、`$uri.html` 得到 `/.html`、直接落到 =404，
    #    首页 404。本仿真当时算成 200，与真实相反 —— 所以必须按下面这样严格区分。
    if _case_sensitive_lookup(path):            # $uri —— 普通文件才算命中
        return 200, "location / try_files $uri"
    if _case_sensitive_lookup(path + ".html"):  # $uri.html
        return 200, "location / try_files $uri.html"
    if is_dir(path + "/"):                      # $uri/ —— 目录，交给 index 模块
        if exists(path.rstrip("/") + "/index.html"):
            return 200, "location / try_files $uri/ → index"
        # 目录在但没有 index.html → nginx 返 403 → error_page 403 =404
        return 404, "location / try_files $uri/ 命中目录但无 index → 403 → 404"
    return 404, "location / try_files ... =404"


def check_conf_guards():
    """静态检查生产配置里「删掉就会出大事」的写法。

    2026-09-18 的事故教训：`location /` 的 try_files 少了 `$uri/`，首页就 404。
    仿真是把 nginx 规则翻译成 Python 再算 —— 翻译错就跟着一起错（当时正是如此）。
    静态检查直接读配置原文、按 nginx 的真实语义判定，两者互补：
    仿真验「行为」，护栏验「写法」。
    """
    conf = os.path.join(ROOT, "deploy", "nginx-jackssybin.conf")
    if not os.path.isfile(conf):
        return ["找不到 nginx 配置: %s" % conf]

    src = open(conf, encoding="utf-8").read()
    problems = []

    # 配置里有多个 `location /`（:80 跳转块的 / 只有一句 return 301）。
    # 必须挑「含 try_files 的那一个」，即真正承载站点静态文件的那个。
    blocks = [c for c in re.finditer(r"location\s+/\s*\{([^{}]*)\}", src, re.S)
              if "try_files" in c.group(1)]
    if not blocks:
        problems.append(
            "配置里找不到带 try_files 的 `location /` 块\n"
            "        （只有 :80 跳转块里的 location / 是没有 try_files 的）")
    else:
        tf = re.search(r"try_files\s+([^;]+);", blocks[0].group(1))
        if not tf:
            problems.append("`location /` 里没有 try_files")
        else:
            args = tf.group(1).split()
            # 最后一项若是 =404 / /index.html 形式，属于 fallback，不算候选
            last = args[-1] if args else ""
            cands = args[:-1] if last.startswith("=") or last.startswith("/") else args
            if not any(a.endswith("/") or a == "/index.html" for a in cands):
                problems.append(
                    "`location /` 的 try_files 缺少能命中目录的项：\n"
                    "           try_files %s;\n"
                    "        没有 $uri/（或 /index.html）时，请求 `/` 会直接落到 fallback，\n"
                    "        首页返回 404 —— 这正是 2026-09-18 那次生产事故的成因。"
                    % tf.group(1))
    return problems


CASES = [
    ("/", ""), ("/archives", ""), ("/archives/", ""), ("/archives/2019/", ""),
    ("/archives/2026/06/", ""), ("/archives.html", ""), ("/tags/", ""),
    ("/tags.html", ""), ("/tags/AI.html", ""), ("/tags/Linux.html", ""),
    ("/tags/Java.html", ""), ("/page/", ""), ("/page/2/", ""), ("/page/2.html", ""),
    ("/nav/", ""), ("/nav.html", ""), ("/topics/", ""), ("/topics.html", ""),
    ("/news.html", ""), ("/weekly.html", ""), ("/ai-nav/", ""), ("/generated/", ""),
    ("/generated/tags/", ""), ("/articles/", ""), ("/articles/2019/07/", ""),
    ("/tutorials/", ""), ("/mysql/", ""), ("/mysql/01/01-mysql.html", ""),
    ("/netty/", ""), ("/linux/", ""), ("/springboot4/", ""), ("/my-github-repos/", ""),
    ("/about.html", ""), ("/links.html", ""), ("/search.html", ""),
    ("/robots.txt", ""), ("/sitemap.xml", ""), ("/rss.xml", ""),
    ("/?p=2", "p=2"), ("/?p=6", "p=6"),
    ("/images/", ""), ("/nav-logos/", ""),
]

# 正常情况下必须返回 200 的路径（回归护栏）
MUST_BE_200 = [
    "/", "/archives.html", "/tags.html", "/tags/AI.html", "/archives/2026/06/",
    "/nav.html", "/topics.html", "/news.html", "/weekly.html", "/ai-nav/",
    "/generated/", "/articles/", "/tutorials/", "/my-github-repos/",
    "/about.html", "/links.html", "/search.html", "/robots.txt", "/sitemap.xml",
]
# 绝不允许出现 403
MUST_NOT_BE_403 = [u for u, _ in CASES]

print("产物目录: %s" % BUILD)
print("=" * 112)
print("配置静态护栏（直接读 deploy/nginx-jackssybin.conf）")
print("=" * 112)
guard_problems = check_conf_guards()
ok = not guard_problems
if guard_problems:
    for p in guard_problems:
        print("  [FAIL] %s" % p)
    print()
    print("  ⚠️  配置本身有问题 —— 下面的状态码预测【不可信】。")
    print("     本脚本的 location 规则是手工同步自配置的，配置改了它不会自动跟着改，")
    print("     所以「配置对不对」由上面的静态护栏负责，「行为对不对」才由仿真负责。")
else:
    print("  [OK ] location / 的 try_files 含目录匹配项（首页 / 不会 404）")

print()
print("=" * 112)
print("%-44s | %-8s | %s" % ("URL", "状态", "命中规则"))
print("=" * 112)
results = {}
for uri, q in CASES:
    code, why = route(uri, q)
    results[(uri, q)] = code
    print("%-44s | %-8s | %s" % (uri, code, why))

print()
print("=" * 112)
print("不变量校验")
print("=" * 112)

n403 = [u for (u, _), c in results.items() if c == 403]
print("  [%s] 没有任何 URL 返回 403          实测=%d 期望=0" % ("OK " if not n403 else "FAIL", len(n403)))
ok &= not n403
for u in n403:
    print("       ", u)

for u, q in CASES:
    if u in MUST_BE_200:
        c = results[(u, q)]
        good = c == 200
        ok &= good
        print("  [%s] %-40s 实测=%s 期望=200" % ("OK " if good else "FAIL", u, c))

c = results[("/tags/Linux.html", "")]
good = c == 404
ok &= good
print("  [%s] %-40s 实测=%s 期望=404（不得 301 到 /search.html）"
      % ("OK " if good else "FAIL", "/tags/ 不存在标签 -> 404", c))

for p in ["/?p=2", "/?p=6"]:
    c = results[(p, "p=" + p.split("=")[1])]
    good = c == 410
    ok &= good
    print("  [%s] %-40s 实测=%s 期望=410" % ("OK " if good else "FAIL", p, c))

print()
print("状态码分布:", dict(Counter(results.values())))
print()
print("结论: %s" % ("全部通过" if ok else "存在未通过项"))
print("=" * 112)
sys.exit(0 if ok else 1)
