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

    if exists(path):
        return 200, "location / try_files $uri"
    if exists(path + ".html"):
        return 200, "location / try_files $uri.html"
    return 404, "location / try_files ... =404"


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
ok = True

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
