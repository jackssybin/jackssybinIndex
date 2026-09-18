"""部署后验收：等待 GitHub Actions 完成，然后用 Baiduspider UA 实测线上。

用法: python scripts/seo-check/post-deploy-verify.py <head_sha>
      head_sha 接受完整 sha，也接受 7 位短 sha（前缀匹配）。

退出码 0 = 全部符合预期。
"""
import json
import ssl
import sys
import time
import urllib.error
import urllib.request

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
import re
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

L("")
L("=" * 92)
L("总判定: %s" % ("全部通过" if ok else "存在未通过项，见上面的 FAIL"))
L("=" * 92)

sys.exit(0 if ok else 1)
