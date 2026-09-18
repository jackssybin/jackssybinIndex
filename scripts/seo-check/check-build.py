#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 不变量校验：构建产物检查。

用法（在仓库根目录）：
    hugo --destination public --minify --cleanDestinationDir
    python scripts/seo-check/check-build.py [产物目录，默认 public]

它检查的是「改版后一度把百度收录整没了」的那几条不变量，任何一条挂掉
都说明有人（包括未来的你）改坏了搜索抓取链路：

  1. robots.txt 里不得再出现 /tags/ /tags.html /page/ /news.html /weekly.html
     /topics.html /nav.html /ai-nav/ 的 Disallow
     —— 这些页面自带 noindex，Disallow 会让爬虫读不到 noindex，
        页面反而长期滞留在索引里。
  2. robots.txt 必须包含 Sitemap 行（CI 也会校验，这里是本地提前发现）。
  3. 薄页面必须带 noindex：/tags/* /page/* /archives/YYYY/ /articles/ 
     /tutorials/ /generated/ 以及 news/weekly/topics/nav/search/tags.html
  4. 正常内容页绝不能带 noindex：首页、文章页、/about.html /links.html
     /my-github-repos/ /archives.html /mysql.html 等。
  5. sitemap 收录口径要与 noindex 口径一致：
     正常内容页在 sitemap 里，noindex 页面不在 sitemap 里。
"""
import os
import re
import sys

ROOT = sys.argv[1] if len(sys.argv) > 1 else "public"

ok = True


def read(rel):
    p = os.path.join(ROOT, rel.replace("/", os.sep))
    if not os.path.isfile(p):
        return None
    with open(p, encoding="utf-8", errors="replace") as f:
        return f.read()


def has_noindex(rel):
    html = read(rel)
    if html is None:
        return None
    return ('name=robots content="noindex' in html
            or 'name="robots" content="noindex' in html)


def check(label, got, want):
    global ok
    good = got == want
    if not good:
        ok = False
    print("  [%s] %-56s 实际=%s 期望=%s" % ("OK " if good else "FAIL", label, got, want))


print("=" * 96)
print("① robots.txt")
print("=" * 96)
rb = read("robots.txt")
if rb is None:
    print("  [FAIL] 找不到 %s/robots.txt" % ROOT)
    sys.exit(1)

rules = [l.strip() for l in rb.splitlines() if l.strip() and not l.strip().startswith("#")]
disallow = set()
for line in rules:
    m = re.match(r"^Disallow:\s*(\S+)$", line, re.I)
    if m:
        disallow.add(m.group(1))

forbidden = ["/tags/", "/tags.html", "/page/", "/news.html", "/weekly.html",
             "/topics.html", "/nav.html", "/ai-nav/"]
for f in forbidden:
    check("robots 不应 Disallow %s" % f, f in disallow, False)
for must in ["/search", "/search.html", "/search-index.json", "/admin/"]:
    check("robots 应保留 Disallow %s" % must, must in disallow, True)
check("robots 含 Sitemap 指令", any(l.lower().startswith("sitemap:") for l in rules), True)

print()
print("=" * 96)
print("② 薄页面必须 noindex")
print("=" * 96)
thin = [
    ("tags.html", True), ("topics.html", True), ("nav.html", True),
    ("news.html", True), ("weekly.html", True), ("search.html", True),
    ("articles/index.html", True), ("tutorials/index.html", True),
    ("generated/index.html", True), ("page/2.html", True),
]
for rel, want in thin:
    got = has_noindex(rel)
    if got is None:
        print("  [SKIP] %-56s 文件不存在" % rel)
    else:
        check("noindex %s" % rel, got, want)

tag_dir = os.path.join(ROOT, "tags")
if os.path.isdir(tag_dir):
    tags = sorted(f for f in os.listdir(tag_dir) if f.endswith(".html"))
    print("  /tags/ 下页面数: %d" % len(tags))
    bad = [t for t in tags if has_noindex("tags/" + t) is False]
    check("全部标签页带 noindex", len(bad), 0)

arch_dir = os.path.join(ROOT, "archives")
if os.path.isdir(arch_dir):
    samples = []
    for dp, dn, fn in os.walk(arch_dir):
        if "index.html" in fn:
            samples.append(os.path.relpath(os.path.join(dp, "index.html"), ROOT).replace("\\", "/"))
    bad = [s for s in samples if has_noindex(s) is False]
    print("  /archives/ 下页面数: %d" % len(samples))
    check("全部归档页带 noindex", len(bad), 0)

print()
print("=" * 96)
print("③ 正常内容页绝不能 noindex")
print("=" * 96)
normal = ["index.html", "about.html", "links.html", "my-github-repos/index.html",
          "archives.html", "mysql.html", "netty.html", "linux.html",
          "springboot4.html", "tutorials.html"]
for rel in normal:
    got = has_noindex(rel)
    if got is None:
        print("  [SKIP] %-56s 文件不存在" % rel)
    else:
        check("无 noindex %s" % rel, got, False)

# 文章页抽样
art = []
for dp, dn, fn in os.walk(os.path.join(ROOT, "articles")):
    for f in fn:
        if f.endswith(".html"):
            rel = os.path.relpath(os.path.join(dp, f), ROOT).replace("\\", "/")
            if re.match(r"^articles/\d{4}/\d{2}/\d{2}/", rel):
                art.append(rel)
bad = [a for a in art if has_noindex(a)]
print("  文章页数: %d" % len(art))
check("全部文章页无 noindex", len(bad), 0)
if bad:
    print("      异常样本:", bad[:5])

print()
print("=" * 96)
print("④ sitemap 与 noindex 口径一致")
print("=" * 96)
sm = read("sitemap.xml")
if sm is None:
    print("  [FAIL] 找不到 %s/sitemap.xml" % ROOT)
    ok = False
else:
    locs = re.findall(r"<loc>(.*?)</loc>", sm)
    paths = set(re.sub(r"^https?://[^/]+", "", u) for u in locs)
    print("  sitemap URL 数: %d" % len(locs))

    for p in ["/archives.html", "/about.html", "/links.html", "/my-github-repos/"]:
        check("sitemap 应包含 %s" % p, p in paths, True)

    for p in ["/tags.html", "/nav.html", "/topics.html", "/search.html",
              "/news.html", "/weekly.html", "/articles/", "/tutorials/"]:
        check("sitemap 应排除 %s" % p, p in paths, False)

    for pref in ["/tags/", "/page/", "/archives/", "/generated/", "/ai-nav/"]:
        n = sum(1 for p in paths if p.startswith(pref))
        check("sitemap 不应有 %s 前缀" % pref, n, 0)

print()
print("=" * 96)
print("结论: %s" % ("全部通过" if ok else "存在未通过项，见上方 FAIL"))
print("=" * 96)
sys.exit(0 if ok else 1)
