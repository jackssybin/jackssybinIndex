#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SEO 不变量校验：构建产物检查。

用法（在仓库根目录）：
    hugo --destination public --minify --cleanDestinationDir
    python scripts/seo-check/check-build.py [产物目录，默认 public]

它检查的是「改版后一度把百度收录整没了」的那几条不变量，任何一条挂掉
都说明有人（包括未来的你）改坏了搜索抓取链路：

  1. robots.txt 里不得再出现 /tags/ /tags.html /page/ /weekly.html
     /topics.html /nav.html /ai-nav/ 的 Disallow
     —— 这些页面自带 noindex，Disallow 会让爬虫读不到 noindex，
        页面反而长期滞留在索引里。
  2. robots.txt 必须包含 Sitemap 行（CI 也会校验，这里是本地提前发现）。
  3. 薄页面必须带 noindex：/tags/* /page/* /archives/YYYY/ /articles/ 
     /tutorials/ /generated/ 以及 weekly/topics/nav/search/tags.html
  4. 正常内容页绝不能带 noindex：首页、文章页、/about.html /links.html
     /my-github-repos/ /archives.html /mysql.html 等。
  5. sitemap 收录口径要与 noindex 口径一致：
     正常内容页在 sitemap 里，noindex 页面不在 sitemap 里。
  6. 老 URL 的 301 映射，目标必须在产物里真实存在。
     映射写错一条，那个 URL 就从 301 变成 404 —— 而 404 是百度判定
     站点质量下降的信号，比 403 好不了多少。这条最容易在「批量改 URL」
     时被打破：改了 slug 却忘了同步 nginx 映射，或映射指向了错的日期目录。
"""
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from html import unescape
from html.parser import HTMLParser
from urllib.parse import unquote, urlsplit

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


class SEOPageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical = None
        self.description = None
        self.title = ""
        self.og_title = None
        self.twitter_title = None
        self.json_ld = []
        self.json_errors = []
        self.images = []
        self.breadcrumbs = []
        self._json_parts = None
        self._in_breadcrumbs = False
        self._breadcrumb = None
        self._in_breadcrumb_name = False
        self._in_title = False

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if tag == "img":
            self.images.append(attrs)
        if tag == "link" and "canonical" in attrs.get("rel", "").split():
            self.canonical = attrs.get("href")
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content")
        if tag == "title":
            self._in_title = True
        if tag == "meta" and attrs.get("property") == "og:title":
            self.og_title = attrs.get("content")
        if tag == "meta" and attrs.get("name") == "twitter:title":
            self.twitter_title = attrs.get("content")
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self._json_parts = []
        if tag == "nav" and "breadcrumbs" in attrs.get("class", "").split():
            self._in_breadcrumbs = True
        if not self._in_breadcrumbs:
            return

        prop = attrs.get("property", "")
        if tag == "span" and "itemListElement" in prop.split():
            self._breadcrumb = {"name": "", "item": None, "position": None}
        elif self._breadcrumb is not None:
            if tag == "span" and "name" in prop.split():
                self._in_breadcrumb_name = True
            elif tag in ("a", "link") and "item" in prop.split():
                self._breadcrumb["item"] = attrs.get("href")
            elif tag == "meta" and "position" in prop.split():
                try:
                    self._breadcrumb["position"] = int(attrs.get("content", ""))
                except ValueError:
                    self._breadcrumb["position"] = attrs.get("content")

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._json_parts is not None:
            self._json_parts.append(data)
        if self._in_breadcrumb_name and self._breadcrumb is not None:
            self._breadcrumb["name"] += data

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "script" and self._json_parts is not None:
            raw = "".join(self._json_parts)
            try:
                self.json_ld.append(json.loads(raw))
            except (TypeError, ValueError) as exc:
                self.json_errors.append(str(exc))
            self._json_parts = None
        if tag == "span" and self._breadcrumb is not None:
            if self._in_breadcrumb_name:
                self._in_breadcrumb_name = False
            else:
                self.breadcrumbs.append(self._breadcrumb)
                self._breadcrumb = None
        if tag == "nav":
            self._in_breadcrumbs = False


def parse_page(rel):
    html = read(rel)
    if html is None:
        return None
    parser = SEOPageParser()
    parser.feed(html)
    return parser


def schemas(page, schema_type):
    return [item for item in page.json_ld if item.get("@type") == schema_type]


def parse_iso_date(value):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def public_rel_from_url(url):
    path = unquote(urlsplit(url).path)
    if path.endswith("/"):
        return path.lstrip("/") + "index.html"
    return path.lstrip("/")


def clean_html_text(value):
    return unescape(re.sub(r"<[^>]+>", "", value)).strip()


def class_block(source, tag, class_name):
    token = r"(?<![A-Za-z0-9_-])%s(?![A-Za-z0-9_-])" % re.escape(class_name)
    class_value = r'(?:"[^"]*%s[^"]*"|\'[^\']*%s[^\']*\'|[^\s>]*%s[^\s>]*)' % ((token,) * 3)
    match = re.search(
        r'<%s\b[^>]*class=%s[^>]*>(.*?)</%s>' % (tag, class_value, tag),
        source, re.S,
    )
    return match.group(1) if match else ""


def visible_key_points(source):
    block = class_block(source, "ul", "article-key-points")
    return [clean_html_text(value) for value in re.findall(r"<li[^>]*>(.*?)</li>", block, re.S)]


def visible_key_facts(source):
    block = class_block(source, "dl", "article-key-facts")
    pairs = re.findall(r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>", block, re.S)
    return [(clean_html_text(label), clean_html_text(value)) for label, value in pairs]


def visible_faq(source):
    block = class_block(source, "section", "article-faq")
    pairs = re.findall(r"<summary[^>]*>(.*?)</summary>\s*<p[^>]*>(.*?)</p>", block, re.S)
    return [{"name": clean_html_text(question), "text": clean_html_text(answer)}
            for question, answer in pairs]


def link_parts(fragment):
    match = re.search(r"<a\b([^>]*)>(.*?)</a>", fragment, re.S)
    if not match:
        return None
    href = re.search(
        r"href\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|([^\s>]+))",
        match.group(1), re.I,
    )
    if not href:
        return None
    label = re.sub(r"<span\b[^>]*>.*?</span>", "", match.group(2), flags=re.S)
    return {
        "name": clean_html_text(label),
        "url": unquote(next(value for value in href.groups() if value is not None)),
    }


def visible_howto(source):
    block = class_block(source, "section", "tutorial-howto")
    steps = []
    for item in re.findall(r"<li[^>]*>(.*?)</li>", block, re.S):
        link = link_parts(item)
        if link is None:
            continue
        text = re.search(r"<p[^>]*>(.*?)</p>", item, re.S)
        link["text"] = clean_html_text(text.group(1)) if text else ""
        steps.append(link)
    return steps


def visible_topic_roadmap(source):
    block = class_block(source, "section", "topic-roadmap-panel")
    return [link for link in (link_parts(item) for item in re.findall(
        r"<li[^>]*>(.*?)</li>", block, re.S)) if link is not None]


def visible_topic_cards(source):
    block = class_block(source, "div", "topic-grid")
    cards = []
    for item in re.findall(r"<section\b[^>]*>(.*?)</section>", block, re.S):
        heading = re.search(r"<h3[^>]*>(.*?)</h3>", item, re.S)
        link = link_parts(heading.group(1)) if heading else None
        if link is not None:
            cards.append(link)
    return cards


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

forbidden = ["/tags/", "/tags.html", "/page/", "/weekly.html",
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
    ("weekly.html", True), ("search.html", True),
    ("articles/index.html", True), ("tutorials/index.html", True),
    ("generated/index.html", True), ("page/2.html", True),
]
for rel, want in thin:
    got = has_noindex(rel)
    if got is None:
        print("  [SKIP] %-56s 文件不存在" % rel)
    else:
        check("noindex %s" % rel, got, want)

check("实时新闻页已删除", os.path.exists(os.path.join(ROOT, "news.html")), False)

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
print("⑤ 日期、面包屑、canonical 与 Sitemap 一致性")
print("=" * 96)

html_pages = {}
for dp, dn, fn in os.walk(ROOT):
    for filename in fn:
        if filename.endswith(".html"):
            rel = os.path.relpath(os.path.join(dp, filename), ROOT).replace("\\", "/")
            html_pages[rel] = parse_page(rel)

generated_leaks = [rel for rel in html_pages if "Generateds" in read(rel)]
check("全部公开 HTML 不含 Generateds", len(generated_leaks), 0)
if generated_leaks:
    print("      异常样本:", generated_leaks[:5])

json_errors = []
breadcrumb_mismatches = []
breadcrumb_positions = []
non_absolute_breadcrumbs = []
canonical_mismatches = []
invalid_schema_dates = []
for rel, page in html_pages.items():
    json_errors.extend((rel, error) for error in page.json_errors)
    lists = schemas(page, "BreadcrumbList")
    if page.breadcrumbs or lists:
        if len(lists) != 1:
            breadcrumb_mismatches.append((rel, "BreadcrumbList 数量=%d" % len(lists)))
        else:
            structured = lists[0].get("itemListElement", [])
            normalized = [{
                "name": item.get("name"),
                "item": item.get("item"),
                "position": item.get("position"),
            } for item in structured]
            if normalized != page.breadcrumbs:
                breadcrumb_mismatches.append((rel, "可视面包屑与 JSON-LD 不一致"))
            positions = [item.get("position") for item in structured]
            if positions != list(range(1, len(structured) + 1)):
                breadcrumb_positions.append(rel)
            for item in structured:
                target = urlsplit(item.get("item", ""))
                if target.scheme not in ("http", "https") or not target.netloc:
                    non_absolute_breadcrumbs.append((rel, item.get("item")))
        if page.breadcrumbs and page.canonical != page.breadcrumbs[-1].get("item"):
            canonical_mismatches.append(rel)
    for schema in page.json_ld:
        for field in ("datePublished", "dateModified"):
            value = schema.get(field)
            if value:
                try:
                    parse_iso_date(value)
                except (TypeError, ValueError):
                    invalid_schema_dates.append((rel, field, value))

check("全部 JSON-LD 可解析", len(json_errors), 0)
check("可视面包屑与 BreadcrumbList 一致", len(breadcrumb_mismatches), 0)
check("BreadcrumbList position 连续且从 1 开始", len(breadcrumb_positions), 0)
check("BreadcrumbList URL 全部为绝对地址", len(non_absolute_breadcrumbs), 0)
check("当前页面包屑 URL 与 canonical 一致", len(canonical_mismatches), 0)
check("JSON-LD 日期全部为 ISO 8601", len(invalid_schema_dates), 0)
for label, samples in [
    ("JSON-LD", json_errors), ("面包屑", breadcrumb_mismatches),
    ("canonical", canonical_mismatches), ("JSON-LD 日期", invalid_schema_dates),
]:
    if samples:
        print("      %s异常样本: %s" % (label, samples[:3]))

sitemap_dates = {}
sitemap_parse_error = None
if sm is not None:
    try:
        sitemap_root = ET.fromstring(sm)
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        for node in sitemap_root.findall("s:url", ns):
            loc = node.find("s:loc", ns)
            if loc is not None and loc.text:
                lastmod = node.find("s:lastmod", ns)
                sitemap_dates[loc.text] = lastmod.text if lastmod is not None else None
    except ET.ParseError as exc:
        sitemap_parse_error = str(exc)
check("sitemap XML 可解析", sitemap_parse_error, None)

invalid_sitemap_dates = []
for url, value in sitemap_dates.items():
    if value:
        try:
            parse_iso_date(value)
        except (TypeError, ValueError):
            invalid_sitemap_dates.append((url, value))
check("全部 Sitemap lastmod 可解析", len(invalid_sitemap_dates), 0)

sitemap_canonical_errors = []
sitemap_noindex_errors = []
sitemap_missing_files = []
for url in sitemap_dates:
    rel = public_rel_from_url(url)
    page = html_pages.get(rel)
    if page is None:
        sitemap_missing_files.append(url)
        continue
    if page.canonical != url:
        sitemap_canonical_errors.append((url, page.canonical))
    if has_noindex(rel):
        sitemap_noindex_errors.append(url)
check("Sitemap URL 均有对应 HTML", len(sitemap_missing_files), 0)
check("Sitemap URL 与页面 canonical 一致", len(sitemap_canonical_errors), 0)
check("Sitemap 不包含 noindex 页面", len(sitemap_noindex_errors), 0)

sitemap_low_confidence_fields = []
if sm is not None and sitemap_parse_error is None:
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for node in sitemap_root.findall("s:url", ns):
        loc = node.find("s:loc", ns)
        url = loc.text if loc is not None else "<missing loc>"
        for field in ("changefreq", "priority"):
            if node.find("s:" + field, ns) is not None:
                sitemap_low_confidence_fields.append((url, field))
check("Sitemap 不输出统一 changefreq/priority", sitemap_low_confidence_fields, [])

archify_rel = "articles/2026/07/03/archify-agent-skill-diagram-generator.html"
archify_page = html_pages.get(archify_rel)
if archify_page is None:
    check("Archify 图片本地化样本存在", False, True)
else:
    expected_archify_images = {
        "/images/archify-agent-skill-diagram-generator/workflow.png": ("2880", "3120"),
        "/images/archify-agent-skill-diagram-generator/sequence.png": ("1400", "1320"),
        "/images/archify-agent-skill-diagram-generator/dataflow.png": ("1400", "1320"),
        "/images/archify-agent-skill-diagram-generator/lifecycle.png": ("3920", "2640"),
    }
    archify_images = {image.get("src"): image for image in archify_page.images}
    archify_remote_images = [src for src in archify_images
                             if urlsplit(src or "").scheme in ("http", "https")]
    check("Archify 正文不再引用远程图片", archify_remote_images, [])
    archify_content_images = [image for image in archify_page.images
                              if (image.get("src") or "").startswith(
                                  "/images/archify-agent-skill-diagram-generator/")]
    check("Archify 正文图片全部启用懒加载与异步解码",
          all(image.get("loading") == "lazy" and image.get("decoding") == "async"
              for image in archify_content_images), True)
    archify_dimension_errors = []
    archify_missing_images = []
    for src, dimensions in expected_archify_images.items():
        image = archify_images.get(src)
        if image is None or (image.get("width"), image.get("height")) != dimensions:
            archify_dimension_errors.append(src)
        if not os.path.isfile(os.path.join(ROOT, src.lstrip("/"))):
            archify_missing_images.append(src)
    check("Archify 4 张迁移图片声明真实尺寸", archify_dimension_errors, [])
    check("Archify 本地图片文件全部存在", archify_missing_images, [])

book_rel = "articles/2026/09/09/book-to-skill-agent-skill.html"
book_page = html_pages.get(book_rel)
expected_book_images = (
    "/images/book-to-skill-agent-skill/01-showcase.png",
    "/images/book-to-skill-agent-skill/02-extractor-output.png",
    "/images/book-to-skill-agent-skill/03-architecture.png",
    "/images/book-to-skill-agent-skill/wechat-cover.jpg",
)
book_missing_images = [src for src in expected_book_images
                       if not os.path.isfile(os.path.join(ROOT, src.lstrip("/")))]
check("book-to-skill 正文与封面 4 张图片全部存在", book_missing_images, [])
if book_page is None:
    check("book-to-skill 图片回归样本存在", False, True)
else:
    book_images = {image.get("src"): image for image in book_page.images}
    book_body_errors = []
    for src in expected_book_images[:3]:
        image = book_images.get(src)
        if (image is None or image.get("loading") != "lazy"
                or image.get("decoding") != "async"):
            book_body_errors.append(src)
    check("book-to-skill 3 张正文图片引用与加载属性正确", book_body_errors, [])

expected_p1_images = {
    "articles/2026/09/01/august-2026-github-project-roundup.html": {
        "/images/deepseek-harness-intro/providers-models-page.png": ("1600", "866", "DeepSeek Harness 模型提供商配置界面"),
        "/images/buzz-ai-workspace/channel-agents.png": ("2000", "1299", "Buzz 频道中的 AI 代理协作界面"),
        "/images/geolook-geo-optimization-platform/overview.png": ("1600", "1000", "GeoLook 项目概览界面"),
    },
    "articles/2020/02/27/1582768389143.html": {
        "/images/knife4j-swagger-ui/s1.png": ("1919", "1057", "Knife4j 接口文档界面"),
    },
}
p1_missing_images = []
p1_image_errors = []
for rel, expected_images in expected_p1_images.items():
    page = html_pages.get(rel)
    if page is None:
        p1_image_errors.append(rel)
        continue
    images = {image.get("src"): image for image in page.images}
    for src, (width, height, alt) in expected_images.items():
        if not os.path.isfile(os.path.join(ROOT, src.lstrip("/"))):
            p1_missing_images.append(src)
        image = images.get(src)
        if (image is None or image.get("alt") != alt
                or image.get("loading") != "lazy" or image.get("decoding") != "async"
                or (image.get("width"), image.get("height")) != (width, height)):
            p1_image_errors.append(src)
check("P1 4 张修复图片文件全部存在", p1_missing_images, [])
check("P1 4 张修复图片引用、alt、尺寸与加载属性正确", p1_image_errors, [])

retired_image_hosts = {
    "img.hacpai.com",
    "of0qa2hzs.bkt.clouddn.com",
    "springcloud-oss.oss-cn-shanghai.aliyuncs.com",
    "www.pianshen.com",
}
retired_image_errors = []
insecure_oschina_images = []
oschina_referrer_errors = []
zhihu_referrer_errors = []
for rel, page in html_pages.items():
    for image in page.images:
        src = image.get("src") or ""
        if urlsplit(src).hostname in retired_image_hosts:
            retired_image_errors.append(rel + ": " + src)
        if src.startswith("http://static.oschina.net/"):
            insecure_oschina_images.append(rel + ": " + src)
        if src.startswith("https://static.oschina.net/") and image.get("referrerpolicy") != "no-referrer":
            oschina_referrer_errors.append(rel + ": " + src)
        if src.startswith("https://pic1.zhimg.com/") and image.get("referrerpolicy") != "no-referrer":
            zhihu_referrer_errors.append(rel + ": " + src)
check("P2/P3 已确认失效的旧图片域名全部移除", retired_image_errors, [])
check("Spring Integration 图片不再使用 HTTP OSChina 地址", insecure_oschina_images, [])
check("OSChina 外链图片禁用 Referer 以避开防盗链", oschina_referrer_errors, [])
check("知乎外链图片禁用 Referer 以避开防盗链", zhihu_referrer_errors, [])

drools_page = html_pages.get("articles/2020/10/29/1603968711195.html")
drools_html = read("articles/2020/10/29/1603968711195.html") or ""
check("Drools 失效截图改为可读规则结构与属性表格",
      drools_page is not None
      and all(marker in drools_html for marker in ("条件（LHS）", "结果（RHS）", "执行控制", "规则分组")), True)

gateway_page = html_pages.get("articles/2020/06/14/1592112174081.html")
gateway_src = "/images/spring-cloud-gateway-overview/spring_cloud_gateway_diagram.png"
gateway_images = {image.get("src"): image for image in gateway_page.images} if gateway_page is not None else {}
gateway_image = gateway_images.get(gateway_src)
check("Gateway 官方流程图引用、alt、尺寸与加载属性正确",
      gateway_image is not None
      and gateway_image.get("alt") == "Spring Cloud Gateway 请求路由与过滤流程"
      and gateway_image.get("loading") == "lazy"
      and gateway_image.get("decoding") == "async"
      and (gateway_image.get("width"), gateway_image.get("height")) == ("443", "595")
      and os.path.isfile(os.path.join(ROOT, gateway_src.lstrip("/"))), True)

mono_flux_html = read("articles/2020/06/18/1592473791199.html") or ""
check("Mono/Flux 失效截图改为可读核心类型表格",
      "upload-images.jianshu.io" not in mono_flux_html
      and all(marker in mono_flux_html for marker in ("0 或 1 个元素", "0 到 N 个元素", "驱动反应式流的调度器")), True)

omnivoice_html = read("articles/2026/07/11/omnivoice-studio-give-your-ai-agent-a-voice.html") or ""
omnivoice_studio_url = "https://raw.githubusercontent.com/debpalash/VoiceStudio/34c8a33628ab65200757a89825cf1eca385683cd/docs/screenshot-studio.png"
check("OmniVoice Studio 同哈希图片使用固定提交地址",
      omnivoice_studio_url in omnivoice_html
      and "raw.githubusercontent.com/debpalash/OmniVoice-Studio/main/docs/screenshot-studio.png" not in omnivoice_html, True)
omnivoice_launchpad_url = "https://raw.githubusercontent.com/debpalash/VoiceStudio/34c8a33628ab65200757a89825cf1eca385683cd/docs/screenshot-launchpad.png"
check("OmniVoice Launchpad 使用文章日期版本",
      omnivoice_launchpad_url in omnivoice_html
      and "raw.githubusercontent.com/debpalash/OmniVoice-Studio/main/docs/screenshot-launchpad.png" not in omnivoice_html, True)

print()
print("=" * 96)
print("④-B RSS 新文覆盖与订阅源质量")
print("=" * 96)
rss = read("rss.xml")
rss_items = []
rss_parse_error = None
if rss is None:
    check("RSS 文件存在", False, True)
else:
    try:
        rss_root = ET.fromstring(rss)
        rss_items = rss_root.findall("./channel/item")
    except ET.ParseError as exc:
        rss_parse_error = str(exc)
    check("RSS XML 可解析", rss_parse_error, None)
    check("RSS 包含文章且不超过 20 条", 0 < len(rss_items) <= 20, True)
    rss_titles = [(item.findtext("title") or "").strip() for item in rss_items]
    rss_links = [(item.findtext("link") or "").strip() for item in rss_items]
    rss_guids = [(item.findtext("guid") or "").strip() for item in rss_items]
    rss_dates = [(item.findtext("pubDate") or "").strip() for item in rss_items]
    check("RSS 每条标题非空", all(rss_titles), True)
    check("RSS 链接不重复", len(set(rss_links)), len(rss_links))
    check("RSS guid 与规范链接一致", rss_guids, rss_links)
    invalid_rss_links = [url for url in rss_links
                         if urlsplit(url).scheme != "https"
                         or urlsplit(url).netloc != "jackssybin.cn"
                         or not urlsplit(url).path
                         or urlsplit(url).query
                         or urlsplit(url).fragment]
    check("RSS 仅使用无参数规范 HTTPS 链接", invalid_rss_links, [])
    invalid_rss_dates = []
    parsed_rss_dates = []
    for value in rss_dates:
        try:
            parsed_rss_dates.append(datetime.strptime(value, "%a, %d %b %Y %H:%M:%S %z"))
        except ValueError:
            invalid_rss_dates.append(value)
    check("RSS pubDate 全部符合 RFC 822", invalid_rss_dates, [])
    check("RSS 按发布时间倒序", parsed_rss_dates,
          sorted(parsed_rss_dates, reverse=True))
    latest_article_url = "https://jackssybin.cn/articles/2026/11/21/public-apis-aggregator/"
    check("RSS 最新文章不再被 contentType 过滤",
          latest_article_url in rss_links, True)

papermorph_url = "https://jackssybin.cn/articles/2026/11/13/papermorph/"
papermorph_page = html_pages.get("articles/2026/11/13/papermorph/index.html")
if papermorph_page is None:
    check("Papermorph 样本存在", False, True)
else:
    articles = schemas(papermorph_page, "Article")
    article = articles[0] if len(articles) == 1 else {}
    check("Papermorph datePublished 使用 frontmatter date",
          article.get("datePublished", "").startswith("2026-11-13"), True)
    check("Papermorph dateModified 使用真实 lastmod",
          article.get("dateModified", "").startswith("2026-11-25"), True)
    check("Papermorph Sitemap 与 JSON-LD 日期一致",
          sitemap_dates.get(papermorph_url), article.get("dateModified"))
    names = [item["name"] for item in papermorph_page.breadcrumbs]
    check("专题文章面包屑使用真实专题名",
          names[:2], ["首页", "开源工具实测与源码拆解"])

fallback_url = "https://jackssybin.cn/articles/2026/11/21/public-apis-aggregator/"
fallback_page = html_pages.get("articles/2026/11/21/public-apis-aggregator/index.html")
if fallback_page is None:
    check("无 lastmod 的回退样本存在", False, True)
else:
    articles = schemas(fallback_page, "Article")
    article = articles[0] if len(articles) == 1 else {}
    check("无 lastmod 文章的 datePublished 使用 date",
          article.get("datePublished", "").startswith("2026-11-21"), True)
    check("无 lastmod 文章的 dateModified 回退到 date",
          article.get("dateModified"), article.get("datePublished"))
    check("无 lastmod 文章的 Sitemap 与 JSON-LD 一致",
          sitemap_dates.get(fallback_url), article.get("dateModified"))

old_url = "https://jackssybin.cn/articles/2021/05/14/1620960509044.html"
old_page = html_pages.get("articles/2021/05/14/1620960509044.html")
if old_page is None:
    check("旧文样本存在", False, True)
else:
    articles = schemas(old_page, "Article")
    article = articles[0] if len(articles) == 1 else {}
    expected_old_date = "2021-05-14T02:48:29.207Z"
    check("旧文 datePublished 保留真实时间", article.get("datePublished"), expected_old_date)
    check("旧文 dateModified 保留真实时间", article.get("dateModified"), expected_old_date)
    check("旧文 Sitemap 保留真实时间", sitemap_dates.get(old_url), expected_old_date)
    names = [item["name"] for item in old_page.breadcrumbs]
    check("普通旧文使用文章面包屑", names[:2], ["首页", "文章"])

for url, rel, label in [
    ("https://jackssybin.cn/", "index.html", "首页"),
    ("https://jackssybin.cn/about.html", "about.html", "关于页"),
    ("https://jackssybin.cn/services/", "services/index.html", "服务页"),
]:
    page = html_pages.get(rel)
    articles = schemas(page, "Article") if page is not None else []
    has_dates = any(item.get("datePublished") or item.get("dateModified") for item in articles)
    check("%s不输出伪造 JSON-LD 日期" % label, has_dates, False)
    check("%s不输出伪造 Sitemap lastmod" % label, url in sitemap_dates and sitemap_dates[url] is not None, False)

about_page = html_pages.get("about.html")
if about_page is not None:
    check("独立页面包屑不含空层级",
          [item["name"] for item in about_page.breadcrumbs], ["首页", "关于本站"])

topic_page = html_pages.get("topics/open-source-review.html")
if topic_page is not None:
    check("专题详情页面包屑使用专题中心",
          [item["name"] for item in topic_page.breadcrumbs][:2], ["首页", "专题"])

tutorial_pages = [page for page in html_pages.values()
                  if len(page.breadcrumbs) > 1 and page.breadcrumbs[1]["name"] == "教程中心"]
check("教程页面使用教程中心面包屑", bool(tutorial_pages), True)

print()
print("=" * 96)
print("⑥ 导读、FAQ 与作者实体")
print("=" * 96)

expected_same_as = [
    "https://github.com/jackssybin",
    "https://juejin.cn/user/3509296845553853/posts",
    "https://www.zhihu.com/people/jackssybin",
]
expected_author_id = "https://jackssybin.cn/about.html#person"
author_errors = []
publisher_errors = []
article_field_errors = []
faq_mismatches = []
for rel, page in html_pages.items():
    for article in schemas(page, "Article"):
        author = article.get("author", {})
        if (author.get("@id") != expected_author_id
                or author.get("url") != "https://jackssybin.cn/about.html"
                or author.get("name") != "jackssybin"
                or author.get("sameAs") != expected_same_as):
            author_errors.append(rel)
        publisher = article.get("publisher", {})
        if (publisher.get("@id") != "https://jackssybin.cn/#organization"
                or publisher.get("url") != "https://jackssybin.cn/"):
            publisher_errors.append(rel)
        if article.get("url") != page.canonical:
            article_field_errors.append((rel, "url", article.get("url")))
        for image in article.get("image", []):
            if not isinstance(image, str) or not image.startswith("https://jackssybin.cn/"):
                article_field_errors.append((rel, "image", image))
        if rel.startswith("articles/"):
            word_count = article.get("wordCount")
            if (isinstance(word_count, bool) or not isinstance(word_count, (int, float))
                    or word_count < 0 or int(word_count) != word_count):
                article_field_errors.append((rel, "wordCount", word_count))
            if article.get("isAccessibleForFree") is not True:
                article_field_errors.append((rel, "isAccessibleForFree", None))
            about = article.get("about", [])
            if not isinstance(about, list) or any(
                    not isinstance(item, dict) or item.get("@type") != "Thing" or not item.get("name")
                    for item in about):
                article_field_errors.append((rel, "about", about))

    visible = visible_faq(read(rel))
    faq_pages = schemas(page, "FAQPage")
    if visible or faq_pages:
        if len(faq_pages) != 1:
            faq_mismatches.append((rel, "FAQPage 数量=%d" % len(faq_pages)))
        else:
            faq_page = faq_pages[0]
            structured = [{
                "name": item.get("name"),
                "text": item.get("acceptedAnswer", {}).get("text"),
            } for item in faq_page.get("mainEntity", [])]
            if structured != visible:
                faq_mismatches.append((rel, "可见 FAQ 与 JSON-LD 不一致"))
            if faq_page.get("@id") != (page.canonical or "") + "#faq":
                faq_mismatches.append((rel, "FAQPage @id 与 canonical 不一致"))

check("全部 Article 作者 @id/url/sameAs 完整", len(author_errors), 0)
check("全部 Article 组织 @id/url 完整", len(publisher_errors), 0)
check("全部文章 wordCount/isAccessibleForFree/about 有效", len(article_field_errors), 0)
check("可见 FAQ 与 FAQPage 逐项一致", len(faq_mismatches), 0)
for label, samples in [
    ("作者", author_errors), ("组织", publisher_errors),
    ("文章字段", article_field_errors), ("FAQ", faq_mismatches),
]:
    if samples:
        print("      %s异常样本: %s" % (label, samples[:3]))

for rel, label in [
    ("articles/2026/11/13/papermorph/index.html", "Papermorph"),
    ("articles/2026/11/17/jiangshan-history-map/index.html", "江山时序"),
    ("articles/2026/06/10/9router-usage-tutorial.html", "9Router"),
]:
    source = read(rel)
    points = visible_key_points(source) if source is not None else []
    check("%s含 3 条可见要点" % label, len(points), 3)
    check("%s要点均为完整非空句" % label,
          all(point and not point.endswith(("...", "…")) for point in points), True)

for rel, label in [
    ("articles/2026/11/13/papermorph/index.html", "Papermorph"),
    ("articles/2026/11/17/jiangshan-history-map/index.html", "江山时序"),
]:
    source = read(rel)
    facts = visible_key_facts(source) if source is not None else []
    check("%s含 4 组可见关键事实" % label, len(facts), 4)
    check("%s关键事实标签和值均非空" % label,
          all(label and value for label, value in facts), True)

router_page = html_pages.get("articles/2026/06/10/9router-usage-tutorial.html")
if router_page is None:
    check("9Router FAQ 样本存在", False, True)
else:
    router_source = read("articles/2026/06/10/9router-usage-tutorial.html")
    check("9Router 保留 5 组真实问答", len(visible_faq(router_source)), 5)
    check("9Router FAQ 目录链接指向可见区域",
          bool(re.search(r'href=(?:"#faq"|#faq)', router_source))
          and bool(re.search(r'id=(?:"faq"|faq)', router_source)), True)
    router_articles = schemas(router_page, "Article")
    check("9Router Article 使用真实可见图片",
          len(router_articles) == 1
          and router_articles[0].get("image") == ["https://jackssybin.cn/images/9router-tutorial/01-dashboard-guide.svg"]
          and any(image.get("src") == "/images/9router-tutorial/01-dashboard-guide.svg"
                  for image in router_page.images), True)

expected_legacy_descriptions = {
    "articles/2019/10/17/1571293329133.html": "总结 Java Hash 碰撞的原因，以及开放地址法、多次 Hash、拉链法和公共溢出区等处理方式。",
    "articles/2019/09/17/1568731586414.html": "梳理 JVM 运行时数据区域、HotSpot 对象创建与访问、对象存活判断，以及引用计数、可达性分析和标记清除、复制、标记整理等垃圾回收算法。",
    "articles/2019/11/20/1574261012104.html": "汇总 Linux 下按内存或 CPU 占用排序并筛选前 10 个进程的 ps 命令，以及使用 top 查看单个进程、调整显示宽度和批量结束同类进程的方法。",
    "articles/2019/08/04/1564886769156.html": "记录 Windows 10 64 位下 Python 2 与 Python 3 的共存配置：分别安装、设置 Path、重命名可执行文件，并重装 pip 后验证 python2、python3 与 pip 命令。",
    "articles/2020/05/28/1590656168798.html": "区分 Redis 缓存穿透、击穿和雪崩的场景，并整理布隆过滤器、空值缓存、互斥锁、过期时间扰动与临期 key 更新等应对思路。",
    "articles/2020/04/03/1585929213226.html": "梳理 CMS 和 G1 垃圾回收器的工作流程与特点，并解释初始标记、并发标记、重新标记、安全点、安全区域、Region、Remembered Set 和卡表等关键概念。",
    "articles/2020/04/11/1586608404790.html": "比较 Redis、ZooKeeper 和数据库锁的选择，介绍 Redis 的 SETNX、Redisson 与 Redlock 方案，以及 ZooKeeper 临时节点、Watcher 和羊群效应等实现要点。",
    "articles/2019/10/16/1571220427190.html": "通过示例说明 Java Integer 缓存与相等比较、变量传值、数组转 List、目录创建、float 精度和 Integer.MAX_VALUE 取值边界等基础问题。",
    "articles/2020/02/19/1582046551397.html": "梳理 Java 并发锁的分类与使用，包括公平锁、可重入锁、读写锁、乐观锁与悲观锁，以及 AQS、CAS、synchronized、ReentrantLock 和 ReentrantReadWriteLock 示例。",
    "articles/2020/02/27/1582768389143.html": "记录 Spring Boot 集成 Knife4j 替换 Swagger UI 的过程，包括依赖选择、@EnableSwagger2 配置、doc.html 资源映射与接口文档访问。",
    "articles/2020/10/29/1603968711195.html": "整理 Drools 规则语言基础，包括硬关键词与软关键词、rule 的属性和 LHS/RHS 结构，以及常用规则属性与条件示例。",
    "articles/2021/03/16/1615897840354.html": "概述 Spring Integration 的企业集成模型，解释 Message、MessageChannel、消息端点、路由器、服务激活器和通道适配器等核心组件。",
    "articles/2020/06/14/1592112174081.html": "介绍 API 网关的统一入口、认证鉴权、限流和数据转换作用，并记录 Spring Cloud Gateway 的路由谓词、端点配置与常见开源网关对比。",
    "articles/2020/06/18/1592473791199.html": "梳理 Reactive Streams、Reactor 与 Spring WebFlux 的关系，说明 Mono、Flux、Publisher、Subscriber、背压及 MVC 返回值的变化。",
    "articles/2020/06/16/1592317763420.html": "记录 Python requests 获取与使用 Cookie 的示例，包括手动 Cookie 文件、字典与 CookieJar 转换、Session 会话维护，以及通过 cookies 或 headers 发起请求。",
    "articles/2020/08/28/1598616084150.html": "介绍负载均衡的作用、常见方案和应用场景，概述 HAProxy 的调度集群与功能，并记录 CentOS、Ubuntu 安装方法及 global、defaults、frontend、backend、listen 配置。",
    "articles/2020/01/04/1578123919824.html": "汇总 Wireshark 显示过滤器基础语法，包括按 IP、端口、协议、MAC、包长度、HTTP、TCP 标志和载荷内容过滤，以及比较运算符、切片、matches 与 contains 示例。",
    "articles/2020/12/25/1608861326670.html": "记录 Spring Boot 集成 MyBatis-Plus 动态数据源的示例，包括 dynamic-datasource、Druid 与 MySQL 依赖、禁用 Druid 自动配置、primary/strict 与 master/db2 配置，以及通过 @DS 在类或方法上切换数据源。",
    "articles/2019/07/31/1564568923421.html": "通过 Guava Lists.transform 示例说明列表元素转换与延迟求值视图，展示原列表修改对后续访问结果的影响，并与 Java Stream map/collect 生成独立列表的方式进行对比。",
    "articles/2019/10/28/1572254233777.html": "整理 Python Selenium WebDriver 与 WebElement 常用 API，包括页面信息、导航、窗口与 iframe/alert 切换、Cookie、截图和等待，以及元素定位、状态读取、输入点击和 JavaScript 调用示例。",
    "articles/2019/08/15/1565804778217.html": "记录 Spring Boot 2.1.6 与 MyBatis-Plus 3.1.1 项目初始化示例，包括代码生成器、Freemarker、MySQL、Druid、Swagger 等 Maven 依赖，以及多环境 profiles、资源过滤和 assembly 打包配置。",
    "articles/2019/11/30/1575088937927.html": "记录 CentOS 7 编译安装 Python 3.7.0 的历史步骤，包括 Development tools 与 libffi 等依赖、下载解压、configure/make 安装到 /usr/local/python3、创建 python3/pip3 软链接及版本验证。",
}
legacy_description_errors = []
for rel, expected_description in expected_legacy_descriptions.items():
    page = html_pages.get(rel)
    if page is None or page.description != expected_description:
        legacy_description_errors.append(rel)
check("22 篇旧文截断导读改为完整摘要", legacy_description_errors, [])

about_page = html_pages.get("about.html")
people = schemas(about_page, "Person") if about_page is not None else []
check("关于页仅输出一个 Person 实体", len(people), 1)
if len(people) == 1:
    person = people[0]
    check("关于页 Person 与文章作者实体一致",
          [person.get("@id"), person.get("url"), person.get("sameAs")],
          [expected_author_id, "https://jackssybin.cn/about.html", expected_same_as])
about_source = read("about.html") or ""
missing_author_links = [url for url in expected_same_as
                        if ('href="%s"' % url not in about_source and "href=%s" % url not in about_source)]
check("关于页公开档案链接可见", len(missing_author_links), 0)
expected_about_title = "关于本站｜日拱一卒"
check("关于页 title/OG/Twitter 使用统一后缀",
      [about_page.title, about_page.og_title, about_page.twitter_title],
      [expected_about_title] * 3)
check("主站关于页链接资料馆干净 URL",
      'href="https://tools.jackssybin.cn/about.html"' in about_source
      or "href=https://tools.jackssybin.cn/about.html" in about_source, True)
about_articles = schemas(about_page, "Article") if about_page is not None else []
check("关于页 Article 使用真实可见头像",
      len(about_articles) == 1
      and about_articles[0].get("image") == ["https://jackssybin.cn/images/sidebar-avatar.jpg"]
      and any(image.get("src") == "/images/sidebar-avatar.jpg" for image in about_page.images), True)
linux_page = html_pages.get("linux/quick-start.html")
linux_articles = schemas(linux_page, "Article") if linux_page is not None else []
check("Linux 快速开始 Article 使用真实可见流程图",
      len(linux_articles) == 1
      and linux_articles[0].get("image") == ["https://jackssybin.cn/images/linux-quick-start/git-workflow.svg"]
      and any(image.get("src") == "/images/linux-quick-start/git-workflow.svg"
              for image in linux_page.images), True)
home_page = html_pages.get("index.html")
check("首页 title 保留站点主标题，不重复追加品牌",
      home_page.title if home_page is not None else None,
      "日拱一卒｜开源 AI 工具实测与落地工作流")
paper_page = html_pages.get("articles/2026/11/13/papermorph/index.html")
check("文章 title/OG/Twitter 使用统一后缀",
      paper_page is not None and paper_page.title.endswith("｜日拱一卒")
      and paper_page.og_title == paper_page.title
      and paper_page.twitter_title == paper_page.title, True)
invalid_titles = [rel for rel, page in html_pages.items()
                  if page.canonical is not None
                  and (not page.title.strip() or page.title.strip() == "｜日拱一卒")]
check("全部带 canonical 页面 title 非空，缺失标题回退站点主标题", invalid_titles, [])
titleless_page = html_pages.get("articles/2026/09/01/august-2026-github-project-roundup.html")
check("无 title 旧文保留站点主标题回退",
      titleless_page.title if titleless_page is not None else None,
      "日拱一卒｜开源 AI 工具实测与落地工作流")

print()
print("=" * 96)
print("⑦ llms.txt、HowTo 与 ItemList")
print("=" * 96)

llms_source = read("llms.txt")
check("llms.txt 已进入构建产物", llms_source is not None, True)
llms_entries = re.findall(r"^- \[([^\]]+)\]\((https://[^)]+)\): (.+)$", llms_source or "", re.M)
check("llms.txt 条数保持 10–30", 10 <= len(llms_entries) <= 30, True)
check("llms.txt 说明本机实测与源码拆解边界",
      "本机实测" in (llms_source or "") and "源码拆解" in (llms_source or ""), True)
invalid_llms_urls = []
missing_llms_targets = []
for title, url, description in llms_entries:
    parsed = urlsplit(url)
    if (parsed.scheme != "https" or parsed.hostname not in ("jackssybin.cn", "tools.jackssybin.cn")
            or parsed.query or parsed.fragment or not title.strip() or not description.strip()):
        invalid_llms_urls.append(url)
    if parsed.hostname == "jackssybin.cn":
        target = public_rel_from_url(url)
        if not os.path.isfile(os.path.join(ROOT, target.replace("/", os.sep))):
            missing_llms_targets.append(url)
check("llms.txt 只使用两站 HTTPS 无参数规范 URL", invalid_llms_urls, [])
check("llms.txt 的主站链接均有真实构建产物", missing_llms_targets, [])

howto_rel = "linux/quick-start.html"
howto_locations = [rel for rel, page in html_pages.items() if schemas(page, "HowTo")]
check("HowTo 仅用于显式声明的真实分步教程", howto_locations, [howto_rel])
howto_page = html_pages.get(howto_rel)
howto_schemas = schemas(howto_page, "HowTo") if howto_page is not None else []
if len(howto_schemas) == 1:
    howto = howto_schemas[0]
    visible_steps = visible_howto(read(howto_rel))
    structured_steps = [{
        "name": step.get("name"),
        "text": step.get("text"),
        "url": "#" + unquote(urlsplit(step.get("url", "")).fragment),
    } for step in howto.get("step", [])]
    check("Git 快速入门包含 4 个可见且一致的 HowTo 步骤",
          [len(visible_steps), structured_steps], [4, visible_steps])
    check("HowTo 使用原教程记录的总时长", howto.get("totalTime"), "PT40M")
    missing_anchors = [step["url"] for step in visible_steps
                       if not re.search(r"id=(?:\"%s\"|%s)" % (
                           re.escape(step["url"][1:]), re.escape(step["url"][1:])),
                           read(howto_rel))]
    check("HowTo 每一步都链接到真实正文锚点", missing_anchors, [])
    check("HowTo @id 与 canonical 一致",
          howto.get("@id"), howto_page.canonical + "#howto")

_repo = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
with open(os.path.join(_repo, "data", "topics.json"), encoding="utf-8") as fh:
    topic_data = json.load(fh)
expected_item_list_rels = ["topics.html"] + ["topics/%s.html" % item["slug"] for item in topic_data]
actual_item_list_rels = [rel for rel, page in html_pages.items() if schemas(page, "ItemList")]
check("ItemList 仅用于专题总目录和真实专题页",
      sorted(actual_item_list_rels), sorted(expected_item_list_rels))
for topic in topic_data:
    rel = "topics/%s.html" % topic["slug"]
    page = html_pages.get(rel)
    lists = schemas(page, "ItemList") if page is not None else []
    if len(lists) != 1:
        check("%s 仅有一个 ItemList" % rel, len(lists), 1)
        continue
    expected_articles = topic["articles"][:8]
    expected_items = [{
        "@type": "ListItem", "position": index + 1,
        "name": article["title"], "item": "https://jackssybin.cn" + article["url"],
    } for index, article in enumerate(expected_articles)]
    item_list = lists[0]
    check("%s ItemList 与专题数据一致" % rel,
          [item_list.get("numberOfItems"), item_list.get("itemListElement")],
          [len(expected_items), expected_items])
    visible_items = visible_topic_roadmap(read(rel))
    expected_visible = [{"name": article["title"], "url": article["url"]}
                        for article in expected_articles]
    check("%s ItemList 与可见推荐顺序一致" % rel, visible_items, expected_visible)

topic_index_page = html_pages.get("topics.html")
topic_index_lists = schemas(topic_index_page, "ItemList") if topic_index_page is not None else []
if len(topic_index_lists) == 1:
    expected_topics = [{
        "@type": "ListItem", "position": index + 1,
        "name": topic["title"], "item": "https://jackssybin.cn" + topic["url"],
    } for index, topic in enumerate(topic_data)]
    check("专题总目录 ItemList 与专题数据一致",
          topic_index_lists[0].get("itemListElement"), expected_topics)
    visible_topics = visible_topic_cards(read("topics.html"))
    expected_visible_topics = [{"name": topic["title"], "url": topic["url"]} for topic in topic_data]
    check("专题总目录 ItemList 与可见卡片一致", visible_topics, expected_visible_topics)

print()
print("=" * 96)
print("⑧ 老 URL 301 映射的目标必须存在（写错一条 = 那个 URL 变 404）")
print("=" * 96)
mapping_path = os.path.join(_repo, "seo-state", "slug-migration.json")
if not os.path.isfile(mapping_path):
    print("  [SKIP] 找不到 %s" % os.path.relpath(mapping_path, _repo))
    print("         （还没有做过中文 slug 迁移时属正常；做过就必须存在）")
else:
    with open(mapping_path, encoding="utf-8") as fh:
        migration = json.load(fh)
    entries = migration.get("entries", [])
    print("  迁移映射条目: %d" % len(entries))
    check("迁移清单 count 与 entries 一致", migration.get("count"), len(entries))

    missing = []
    stale = []
    for e in entries:
        new_rel = e["newPath"].lstrip("/")
        if not os.path.isfile(os.path.join(ROOT, new_rel)):
            missing.append(e["newPath"])
        old_rel = e["oldPath"].lstrip("/").rstrip("/")
        if old_rel and os.path.exists(os.path.join(ROOT, old_rel)):
            stale.append(e["oldPath"])

    check("每条 301 的目标页在产物里存在", len(missing), 0)
    if missing:
        print("      缺失样本:", missing[:5])
    check("旧 URL 已从产物移除（否则映射是多余的）", len(stale), 0)
    if stale:
        print("      残留样本:", stale[:5])

print()
print("=" * 96)
print("结论: %s" % ("全部通过" if ok else "存在未通过项，见上方 FAIL"))
print("=" * 96)
sys.exit(0 if ok else 1)
