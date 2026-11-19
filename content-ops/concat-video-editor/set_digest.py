# -*- coding: utf-8 -*-
"""Concat 草稿补独立 digest + content_source_url。按标题匹配，规避 363+ 草稿分页问题。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
DIGEST = "Rust写的本地优先开源剪辑器：18.9万行、22个本地AI模型、无水印不联网，还内置MCP让AI操作时间线。扒源码讲清它的能力、beta边界与AGPL协议。"
SRC_URL = "https://github.com/jub0t/Concat"
assert len(DIGEST) <= 120, len(DIGEST)

def call(api, payload):
    url = f"https://api.weixin.qq.com/cgi-bin/{api}?access_token={AT}"
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8'))

res = call("draft/batchget", {"offset": 0, "count": 20, "no_content": 0})
target = next((it for it in res['item'] if "开源剪辑软件" in it['content']['news_item'][0].get('title', '')), None)
assert target, "未找到新草稿"
mid = target['media_id']
art = target['content']['news_item'][0]
art['digest'] = DIGEST
art['content_source_url'] = SRC_URL
upd = call("draft/update", {"media_id": mid, "index": 0, "articles": art})
print("update errcode:", upd.get('errcode', 0), upd.get('errmsg', 'ok'))

res2 = call("draft/batchget", {"offset": 0, "count": 20, "no_content": 0})
a = next(it for it in res2['item'] if it['media_id'] == mid)['content']['news_item'][0]
print("media_id:", mid)
print("digest(%d字):" % len(a.get('digest', '')), a.get('digest'))
print("source:", a.get('content_source_url'))
print("title:", a.get('title'))
