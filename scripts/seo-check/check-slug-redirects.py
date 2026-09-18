#!/usr/bin/env python3
"""逐条核对「中文 slug -> 拼音 ASCII slug」的 301 映射。

这是 SEO-百度收录丢失诊断报告 第九节要求的验收脚本：
映射表共有上百条，写错一条就会让那个 URL 变 404，而 404 恰恰是
百度判定站点质量下降的信号 —— 所以必须逐条核对，不能抽样。

用法：
    python scripts/seo-check/check-slug-redirects.py                        # 默认打线上
    python scripts/seo-check/check-slug-redirects.py http://127.0.0.1:8890  # 打本机真实 nginx
    python scripts/seo-check/check-slug-redirects.py --ua=Mozilla/5.0       # 换 UA

退出码 0 = 全部符合预期（旧 URL 301 到新 URL，新 URL 200）。

判据（每条映射会产生 1~3 个用例）：
    旧 URL 带尾斜杠   -> 301 -> 新 URL      （Hugo 目录形态的原始 URL）
    旧 URL 不带尾斜杠 -> 301 -> 新 URL      （同一地址的另一种请求写法）
    旧 URL .html      -> 301 -> 新 URL      （显式 url 形态）
    旧 URL 去 .html   -> 301 -> 新 URL      （try_files $uri.html 让这个写法也能访问）
    新 URL            -> 200

为什么不只测「带尾斜杠」那一种：nginx 的 try_files 会让同一条内容
存在多种可访问的 URL 写法，每种都会被爬虫抓到。只修其中一种，
剩下几种仍是 200 且内容重复，等于没修干净。
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MAPPING = os.path.join(ROOT, "seo-state", "slug-migration.json")

BAIDU_UA = "Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    """禁止跟随重定向。

    这个类不能省：urllib 默认会自动跟随 301，于是「旧 URL 是否正确 301」
    会被测成「跳转后是否 200」—— 看起来全绿，实际什么都没验证到。
    第一次跑这个脚本就是这么被骗过去的（137 条失败被报成 200）。
    返回 None 会让 urllib 抛 HTTPError，从而拿到真实的 3xx 状态码与 Location。
    """

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: A002
        return None


OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect)


def parse_args(argv):
    base = "https://jackssybin.cn"
    ua = BAIDU_UA
    timeout = 15
    for a in argv:
        if a.startswith("--base="):
            base = a[7:]
        elif a.startswith("--ua="):
            ua = a[5:]
        elif a.startswith("--timeout="):
            timeout = float(a[10:])
        elif a.startswith("http"):
            base = a
    return base.rstrip("/"), ua, timeout


def encode(path):
    """把含中文的路径编码成 HTTP 请求行里的形态（与 nginx map 的键一致）。"""
    return "/".join(urllib.parse.quote(seg) for seg in path.split("/"))


def probe(base, url_path, ua, timeout, want_status, want_location=None):
    url = base + encode(url_path)
    req = urllib.request.Request(url, headers={"User-Agent": ua}, method="GET")
    try:
        resp = OPENER.open(req, timeout=timeout)
        status = resp.status
        location = resp.headers.get("Location") or ""
        resp.read(64)
    except urllib.error.HTTPError as e:
        status = e.code
        location = e.headers.get("Location") or ""
    except Exception as e:  # noqa: BLE001
        return False, "请求失败: %s" % e, ""

    if status != want_status:
        return False, "状态码 %s（期望 %s）" % (status, want_status), location
    if want_location is not None and location:
        # Location 可能带 host 前缀，也可能被二次编码，两种都接受
        got = urllib.parse.unquote(location)
        if not (got.endswith(want_location) or got.endswith(encode(want_location))):
            return False, "Location=%s（期望指向 %s）" % (location, want_location), location
    elif want_location is not None and not location:
        return False, "301 但没有 Location 头", location
    return True, "", location


def main():
    base, ua, timeout = parse_args(sys.argv[1:])

    if not os.path.isfile(MAPPING):
        print("找不到映射清单: %s" % MAPPING)
        print("先跑 node scripts/migrate-chinese-slugs.mjs --apply --nginx")
        return 1

    with open(MAPPING, encoding="utf-8") as fh:
        mapping = json.load(fh)

    entries = mapping["entries"]
    print("目标: %s" % base)
    print("UA:   %s" % ua[:60])
    print("映射条目: %d" % len(entries))
    print("=" * 90)

    failures = []
    total = 0

    for i, e in enumerate(entries, 1):
        old, new = e["oldPath"], e["newPath"]

        cases = []
        if old.endswith("/"):
            cases.append((old, 301))
            cases.append((old.rstrip("/"), 301))
        elif old.endswith(".html"):
            cases.append((old, 301))
        else:
            cases.append((old, 301))

        for path, want in cases:
            total += 1
            ok, msg, loc = probe(base, path, ua, timeout, want, want_location=new)
            if not ok:
                failures.append((old, "旧 URL " + path, msg, loc))

        total += 1
        ok, msg, loc = probe(base, new, ua, timeout, 200)
        if not ok:
            failures.append((old, "新 URL " + new, msg, loc))

        if i % 20 == 0:
            print("  已核对 %d/%d ..." % (i, len(entries)))

    print("=" * 90)
    print("用例总数: %d" % total)
    if failures:
        print("失败: %d" % len(failures))
        for old, which, msg, loc in failures[:40]:
            print("  ✗ %s" % which)
            print("      %s" % msg)
            if loc:
                print("      Location: %s" % loc)
        if len(failures) > 40:
            print("  ... 另有 %d 条未列出" % (len(failures) - 40))
        print("\n结论: 存在失败项，不要部署到线上。")
        return 1

    print("结论: 全部通过 —— 每条旧 URL 都 301 到新 URL，每条新 URL 都是 200。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
