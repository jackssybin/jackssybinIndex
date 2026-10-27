#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给知乎专栏草稿设置标题封面图 title_image。"""
import json, sys, pathlib, urllib.request, uuid
sys.path.insert(0, "/root/.hermes/skills/zhihu-answer-public/scripts")
import zhihu_draft as z

BASE = pathlib.Path("/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace")
COOKIE = pathlib.Path("/root/.hermes/secrets/zhihu_cookie.txt")
COVER = "/root/jackssybinIndex/static/images/openbot-local-multiagent-workspace/cover-zhihu.png"
DRAFT_URL = "https://zhuanlan.zhihu.com/p/2098499611560240992"
TITLE = "OpenBot：一个不给你模型、却给七个Coding Agent排好工位的本地工作台"

cookie, cookies = z.read_cookie(COOKIE)
xsrf = cookies.get("_xsrf", "")
headers = {
    "Cookie": cookie,
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin": "https://zhuanlan.zhihu.com",
    "Referer": "https://zhuanlan.zhihu.com/write",
    "X-Requested-With": "XMLHttpRequest",
    "Accept": "application/json, text/plain, */*",
}
# 1. 上传封面
up_headers = dict(headers)
if xsrf:
    up_headers["X-Xsrftoken"] = xsrf
status, text = z.request_multipart(
    "https://zhuanlan.zhihu.com/api/uploaded_images",
    {}, {"picture": pathlib.Path(COVER)}, up_headers)
print("upload status:", status)
up = json.loads(text)
src = up.get("src")
print("cover src ok:", bool(src))
if not src:
    print(text[:300]); sys.exit(1)

# 2. 读现有正文
final_payload = json.loads(sorted((BASE / "zhihu-cache-final").glob("*_payload.json"))[-1].read_text())
content = final_payload["content"]

# 3. PATCH 更新草稿，带 title_image
patch_headers = dict(headers)
patch_headers["Content-Type"] = "application/json"
if xsrf:
    patch_headers["X-Xsrftoken"] = xsrf
payload = {"title": TITLE, "content": content, "title_image": src, "delta_time": 0}
req = urllib.request.Request(DRAFT_URL, data=json.dumps(payload, ensure_ascii=False).encode(),
                             headers=patch_headers, method="PATCH")
try:
    resp = urllib.request.urlopen(req, timeout=60)
    r = json.loads(resp.read().decode())
    print("PATCH status:", resp.status)
    print("title_image set:", bool(r.get("title_image")))
    print("content imgs:", r.get("content","").count("content_image"))
    print("url:", r.get("url"))
except urllib.error.HTTPError as e:
    print("HTTPError", e.code, e.read().decode()[:500])
