#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""给刚建的微信草稿设置独立 digest（复用 wenyan token 缓存）。"""
import json, urllib.request, sys

TOKEN = "/root/.config/wenyan-md/token.json"
d = json.load(open(TOKEN))
tk = d["accessToken"]
DIGEST = "两个多月1.8K Star的新项目OpenBot：把Codex、Claude、Grok等7个Coding Agent收进同一张办公桌——独立工位、任务队列、互相派活传文件、内置浏览器，还能部署在VPS上用手机远程指挥。我通读源码拆解它的架构，也如实讲清非商用许可和full-access两个坑。"

def post(url, payload):
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode(),
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))

base = "https://api.weixin.qq.com/cgi-bin"
g = post(f"{base}/draft/batchget?access_token={tk}", {"offset": 0, "count": 3, "no_content": 1})
if g.get("errcode") not in (None, 0):
    print("get fail:", g); sys.exit(1)
item = g["item"][0]
media_id = item["media_id"]
idx = 0
art = item["content"]["news_item"][idx]
art["digest"] = DIGEST
up = post(f"{base}/draft/update?access_token={tk}",
          {"media_id": media_id, "index": idx, "articles": art})
print("digest update:", json.dumps(up, ensure_ascii=False))
print("draft media_id:", media_id)
print("title:", art["title"])
