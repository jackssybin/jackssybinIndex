"""部署后验收：等待 GitHub Actions 完成，然后用 Baiduspider UA 实测线上。

用法: python scripts/seo-check/post-deploy-verify.py <head_sha>
      head_sha 接受完整 sha，也接受 7 位短 sha（前缀匹配）。

退出码 0 = 全部符合预期。
"""
import html
import json
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

SHA = sys.argv[1] if len(sys.argv) > 1 else ""
REPO = "jackssybin/jackssybinIndex"
SITE = "https://jackssybin.cn"

UA_BAIDU = "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)"
CTX = ssl.create_default_context()
OUT = []


def L(s=""):
    OUT.append(str(s))
    print(s, flush=True)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **kw):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def probe(url, ua=UA_BAIDU, timeout=25):
    """返回 (状态码, Location 头)。不自动跟随重定向。"""
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    try:
        r = OPENER.open(req, timeout=timeout)
        return r.status, r.headers.get("Location")
    except urllib.error.HTTPError as e:
        return e.code, e.headers.get("Location")
    except Exception as e:
        return "ERR", str(e)[:70]


def fetch(url, ua=UA_BAIDU, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "ignore")
    except Exception as e:
        return "ERR", str(e)[:70]


def api(path):
    req = urllib.request.Request(
        "https://api.github.com/repos/%s/%s" % (REPO, path),
        headers={"User-Agent": "seo-deploy-verify", "Accept": "application/vnd.github+json"},
    )
    return json.load(urllib.request.urlopen(req, timeout=30, context=CTX))


# ══════════════ 1. 等待 Actions 完成 ══════════════
L("=" * 92)
L("① 等待 GitHub Actions 完成（sha %s）" % SHA[:7])
L("=" * 92)

run = None
deadline = time.time() + 600
needle = SHA.strip().lower()
while time.time() < deadline:
    try:
        runs = api("actions/runs?per_page=15")["workflow_runs"]
    except Exception as e:
        L("  API 查询失败: %s" % e)
        time.sleep(20)
        continue
    for r in runs:
        # 必须支持短 sha：CI 日志和 git log 里习惯贴 7 位，
        # 而 API 返回的 head_sha 是完整 40 位。曾经这里用全等比较，
        # 传短 sha 时会一直「未找到」，把一次成功的部署误报成找不到运行。
        head = r["head_sha"].lower()
        if head == needle or (len(needle) >= 7 and head.startswith(needle)):
            run = r
            break
    if run and run["status"] == "completed":
        break
    L("  %s  status=%s ..." % (time.strftime("%H:%M:%S"),
                               run["status"] if run else "未找到"))
    time.sleep(20)

if not run:
    L("  × 10 分钟内未找到该 sha 的运行")
    sys.exit(1)

L("  结论: %s   （耗时 %s~%s）" % (run["conclusion"], run["created_at"][11:19], (run.get("updated_at") or "")[11:19]))

# 各步骤结果
try:
    jobs = api("actions/runs/%s/jobs" % run["id"])["jobs"]
    for j in jobs:
        L("")
        L("  Job: %s -> %s" % (j["name"], j["conclusion"]))
        for s in j.get("steps", []):
            mark = "OK " if s["conclusion"] == "success" else ("xx " if s["conclusion"] else ".. ")
            L("     [%s] %s" % (mark, s["name"]))
except Exception as e:
    L("  取步骤详情失败: %s" % e)

if run["conclusion"] != "success":
    L("")
    L("  !! 部署未成功，线上未被更新。请查看上面的失败步骤。")

L("")
L("=" * 92)
L("② 线上实测（Baiduspider UA，不跟随重定向）")
L("=" * 92)

ok = True

# 原先 403 的目录 —— 现在不得再是 403
L("")
L("  [原 9 条 403 目录] 期望：不再是 403")
for u in ["/archives/", "/tags/", "/page/", "/nav/", "/topics/",
          "/mysql/", "/netty/", "/linux/", "/springboot4/"]:
    code, loc = probe(SITE + u)
    good = code != 403
    ok &= good
    L("    [%s] %-18s => %s%s" % ("OK " if good else "FAIL", u, code,
                                 ("  -> " + loc) if loc else ""))

# 标签页：不得再 301 到 /search.html
L("")
L("  [标签页死链] 期望：不得再 301 到 /search.html")
for u in ["/tags/Linux.html", "/tags/Linux", "/tags/centos7.html"]:
    code, loc = probe(SITE + u)
    bad = loc and "/search" in loc
    good = not bad
    ok &= good
    L("    [%s] %-20s => %s%s" % ("OK " if good else "FAIL", u, code,
                                 ("  -> " + loc) if loc else ""))

# 老入口重定向
L("")
L("  [老入口] 期望：301 到真实 .html 或 200，不得 301 到禁抓页")
for u in ["/archives", "/tags", "/topics", "/nav"]:
    code, loc = probe(SITE + u)
    good = code in (200, 301) and not (loc and "/search" in loc)
    ok &= good
    L("    [%s] %-12s => %s%s" % ("OK " if good else "FAIL", u, code,
                                 ("  -> " + loc) if loc else ""))

# 参数化 URL
L("")
L("  [参数化 URL] 期望：410（不再是首页副本）")
for u in ["/?p=2", "/?p=6"]:
    code, loc = probe(SITE + u)
    good = code == 410
    ok &= good
    L("    [%s] %-10s => %s" % ("OK " if good else "FAIL", u, code))

# robots.txt
L("")
L("  [robots.txt] 期望：含 Sitemap，不再 Disallow /tags/")
code, body = fetch(SITE + "/robots.txt")
has_sitemap = "Sitemap:" in body
no_tags_disallow = "Disallow: /tags/" not in body
good = code == 200 and has_sitemap and no_tags_disallow
ok &= good
L("    [%s] HTTP=%s  Sitemap行=%s  /tags/未屏蔽=%s" % (
    "OK " if good else "FAIL", code, has_sitemap, no_tags_disallow))
L("    ---- 线上内容 ----")
for line in body.strip().splitlines():
    L("      " + line)

# 百度验证 meta
L("")
L("  [百度验证] 期望：首页含 baidu-site-verification")
code, body = fetch(SITE + "/")
m = re.search(r'<meta[^>]*baidu-site-verification[^>]*>', body)
good = bool(m)
ok &= good
L("    [%s] HTTP=%s  %s" % ("OK " if good else "FAIL", code, m.group(0) if m else "未找到"))

# 空壳页 noindex
L("")
L("  [空壳页] 期望：/articles/ /tutorials/ /generated/ 带 noindex")
for u in ["/articles/", "/tutorials/", "/generated/"]:
    code, body = fetch(SITE + u)
    good = "noindex" in body
    ok &= good
    L("    [%s] %-14s => %s  noindex=%s" % ("OK " if good else "FAIL", u, code, good))

# 文章页不得 noindex
L("")
L("  [文章页] 期望：无 noindex（回归）")
for u in ["/", "/about.html", "/links.html"]:
    code, body = fetch(SITE + u)
    good = "noindex" not in body
    ok &= good
    L("    [%s] %-14s => %s  noindex=%s" % ("OK " if good else "FAIL", u, code, not good))

# sitemap
L("")
L("  [sitemap] 期望：含 about/links/archives.html/my-github-repos")
code, body = fetch(SITE + "/sitemap.xml")
n = body.count("<loc>")
for frag in ["/about.html", "/links.html", "/archives.html", "/my-github-repos/"]:
    good = frag in body
    ok &= good
    L("    [%s] 含 %-22s" % ("OK " if good else "FAIL", frag))
L("    sitemap URL 总数: %d" % n)

# 真实日期与面包屑（线上抽检；完整全站检查由 check-build.py 负责）
L("")
L("  [日期与面包屑] 期望：frontmatter 日期、无 Generateds、可视与 JSON-LD 一致")


def extract_json_ld(page_body):
    items = []
    errors = []
    pattern = r'<script\b[^>]*\btype=(?:application/ld\+json|"application/ld\+json"|\'application/ld\+json\')[^>]*>(.*?)</script>'
    for raw in re.findall(pattern, page_body, re.S | re.I):
        try:
            items.append(json.loads(raw))
        except (TypeError, ValueError) as exc:
            errors.append(str(exc))
    return items, errors


def first_schema(items, schema_type):
    return next((item for item in items if item.get("@type") == schema_type), {})


def visible_breadcrumb_names(page_body):
    pattern = r'property=(?:name|"name"|\'name\')[^>]*>(.*?)</span>'
    return [html.unescape(re.sub(r"<[^>]+>", "", value))
            for value in re.findall(pattern, page_body, re.S)]


def class_block(page_body, tag, class_name):
    class_value = r'(?:"%s"|\'%s\'|%s)' % ((class_name,) * 3)
    match = re.search(
        r'<%s\b[^>]*class=%s[^>]*>(.*?)</%s>' % (tag, class_value, tag),
        page_body, re.S,
    )
    return match.group(1) if match else ""


def clean_html_text(value):
    return html.unescape(re.sub(r"<[^>]+>", "", value)).strip()


def visible_key_points(page_body):
    block = class_block(page_body, "ul", "article-key-points")
    return [clean_html_text(value) for value in re.findall(r"<li[^>]*>(.*?)</li>", block, re.S)]


def visible_key_facts(page_body):
    block = class_block(page_body, "dl", "article-key-facts")
    pairs = re.findall(r"<dt[^>]*>(.*?)</dt>\s*<dd[^>]*>(.*?)</dd>", block, re.S)
    return [(clean_html_text(label), clean_html_text(value)) for label, value in pairs]


def visible_faq(page_body):
    block = class_block(page_body, "section", "article-faq")
    pairs = re.findall(r"<summary[^>]*>(.*?)</summary>\s*<p[^>]*>(.*?)</p>", block, re.S)
    return [{"name": clean_html_text(question), "text": clean_html_text(answer)}
            for question, answer in pairs]


sitemap_dates = {}
try:
    sitemap_root = ET.fromstring(body)
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    for node in sitemap_root.findall("s:url", ns):
        loc = node.find("s:loc", ns)
        if loc is not None and loc.text:
            lastmod = node.find("s:lastmod", ns)
            sitemap_dates[loc.text] = lastmod.text if lastmod is not None else None
    good = True
except ET.ParseError as exc:
    good = False
    L("    sitemap XML 错误: %s" % exc)
ok &= good
L("    [%s] sitemap XML 可解析" % ("OK " if good else "FAIL"))

samples = [
    ("/articles/2026/11/13/papermorph/", "Papermorph"),
    ("/articles/2026/11/17/jiangshan-history-map/", "江山时序"),
    ("/articles/2026/11/21/public-apis-aggregator/", "日期回退"),
    ("/articles/2026/06/10/9router-usage-tutorial.html", "9Router"),
    ("/articles/2021/05/14/1620960509044.html", "旧文"),
    ("/about.html", "关于页"),
    ("/generated/", "归档 section"),
]
online_pages = {}
for path, label in samples:
    code, page_body = fetch(SITE + path)
    items, errors = extract_json_ld(page_body)
    online_pages[path] = (page_body, items)
    good = code == 200 and not errors and "Generateds" not in page_body
    ok &= good
    L("    [%s] %-12s HTTP=%s JSON错误=%d Generateds=%s" % (
        "OK " if good else "FAIL", label, code, len(errors), "Generateds" in page_body))

papermorph_path = "/articles/2026/11/13/papermorph/"
papermorph_body, papermorph_items = online_pages[papermorph_path]
papermorph_article = first_schema(papermorph_items, "Article")
papermorph_breadcrumbs = first_schema(papermorph_items, "BreadcrumbList")
published = papermorph_article.get("datePublished", "")
modified = papermorph_article.get("dateModified")
structured_names = [item.get("name") for item in papermorph_breadcrumbs.get("itemListElement", [])]
good = (published.startswith("2026-11-13") and bool(modified)
        and modified.startswith("2026-11-25")
        and sitemap_dates.get(SITE + papermorph_path) == modified)
ok &= good
L("    [%s] Papermorph 发布日期 2026-11-13、真实修改日期与 Sitemap 一致" % ("OK " if good else "FAIL"))
good = (visible_breadcrumb_names(papermorph_body) == structured_names
        and structured_names[:2] == ["首页", "开源工具实测与源码拆解"])
ok &= good
L("    [%s] Papermorph 可视面包屑与 JSON-LD 使用真实专题名" % ("OK " if good else "FAIL"))

fallback_path = "/articles/2026/11/21/public-apis-aggregator/"
fallback_body, fallback_items = online_pages[fallback_path]
fallback_article = first_schema(fallback_items, "Article")
fallback_published = fallback_article.get("datePublished", "")
fallback_modified = fallback_article.get("dateModified")
good = (fallback_published.startswith("2026-11-21") and fallback_modified == fallback_published
        and sitemap_dates.get(SITE + fallback_path) == fallback_modified)
ok &= good
L("    [%s] 无 lastmod 文章回退发布日期且与 Sitemap 一致" % ("OK " if good else "FAIL"))

for path, label, fact_count in [
    (papermorph_path, "Papermorph", 4),
    ("/articles/2026/11/17/jiangshan-history-map/", "江山时序", 4),
    ("/articles/2026/06/10/9router-usage-tutorial.html", "9Router", 0),
]:
    page_body = online_pages[path][0]
    good = (len(visible_key_points(page_body)) == 3
            and len(visible_key_facts(page_body)) == fact_count)
    ok &= good
    L("    [%s] %s 可见要点/关键事实数量正确" % ("OK " if good else "FAIL", label))

router_path = "/articles/2026/06/10/9router-usage-tutorial.html"
router_body, router_items = online_pages[router_path]
router_faq = first_schema(router_items, "FAQPage")
structured_faq = [{
    "name": item.get("name"),
    "text": item.get("acceptedAnswer", {}).get("text"),
} for item in router_faq.get("mainEntity", [])]
good = (len(structured_faq) == 5 and structured_faq == visible_faq(router_body)
        and router_faq.get("@id") == SITE + router_path + "#faq")
ok &= good
L("    [%s] 9Router 的 5 组可见 FAQ 与 FAQPage 逐项一致" % ("OK " if good else "FAIL"))

expected_same_as = [
    "https://github.com/jackssybin",
    "https://juejin.cn/user/3509296845553853/posts",
    "https://www.zhihu.com/people/jackssybin",
]
entity_errors = []
article_field_errors = []
for path, (page_body, items) in online_pages.items():
    article = first_schema(items, "Article")
    if not article:
        continue
    author = article.get("author", {})
    if (author.get("@id") != "https://jackssybin.cn/about.html#person"
            or author.get("url") != "https://jackssybin.cn/about.html"
            or author.get("sameAs") != expected_same_as):
        entity_errors.append(path)
    publisher = article.get("publisher", {})
    if (publisher.get("@id") != "https://jackssybin.cn/#organization"
            or publisher.get("url") != SITE + "/"):
        entity_errors.append(path)
    if path.startswith("/articles/"):
        word_count = article.get("wordCount")
        if (isinstance(word_count, bool) or not isinstance(word_count, (int, float))
                or word_count < 0 or int(word_count) != word_count):
            article_field_errors.append((path, "wordCount"))
        if article.get("isAccessibleForFree") is not True or not isinstance(article.get("about"), list):
            article_field_errors.append((path, "access/about"))
ok &= not entity_errors
ok &= not article_field_errors
L("    [%s] 抽检 Article 的作者/组织实体完整" % ("OK " if not entity_errors else "FAIL"))
L("    [%s] 抽检文章的 wordCount/isAccessibleForFree/about 有效" % ("OK " if not article_field_errors else "FAIL"))

old_path = "/articles/2021/05/14/1620960509044.html"
old_body, old_items = online_pages[old_path]
old_article = first_schema(old_items, "Article")
old_breadcrumbs = first_schema(old_items, "BreadcrumbList")
expected_old_date = "2021-05-14T02:48:29.207Z"
good = (old_article.get("datePublished") == expected_old_date
        and old_article.get("dateModified") == expected_old_date
        and sitemap_dates.get(SITE + old_path) == expected_old_date)
ok &= good
L("    [%s] 旧文保留真实时间 %s" % ("OK " if good else "FAIL", expected_old_date))
structured_names = [item.get("name") for item in old_breadcrumbs.get("itemListElement", [])]
good = (visible_breadcrumb_names(old_body) == structured_names
        and structured_names[:2] == ["首页", "文章"])
ok &= good
L("    [%s] 旧文可视面包屑与 JSON-LD 使用文章层级" % ("OK " if good else "FAIL"))

about_body, about_items = online_pages["/about.html"]
about_article = first_schema(about_items, "Article")
about_breadcrumbs = first_schema(about_items, "BreadcrumbList")
structured_names = [item.get("name") for item in about_breadcrumbs.get("itemListElement", [])]
good = (not about_article.get("datePublished") and not about_article.get("dateModified")
        and sitemap_dates.get(SITE + "/about.html") is None
        and visible_breadcrumb_names(about_body) == structured_names == ["首页", "关于本站"])
ok &= good
L("    [%s] 关于页无伪造日期且面包屑无空层级" % ("OK " if good else "FAIL"))

about_person = first_schema(about_items, "Person")
good = (about_person.get("@id") == "https://jackssybin.cn/about.html#person"
        and about_person.get("url") == "https://jackssybin.cn/about.html"
        and about_person.get("sameAs") == expected_same_as)
ok &= good
L("    [%s] 关于页 Person 与文章作者实体一致" % ("OK " if good else "FAIL"))

good = sitemap_dates.get(SITE + "/") is None and sitemap_dates.get(SITE + "/services/") is None
ok &= good
L("    [%s] 首页与服务页不输出伪造 Sitemap lastmod" % ("OK " if good else "FAIL"))

L("")
L("=" * 92)
L("总判定: %s" % ("全部通过" if ok else "存在未通过项，见上面的 FAIL"))
L("=" * 92)

sys.exit(0 if ok else 1)
