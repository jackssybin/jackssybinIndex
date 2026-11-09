# -*- coding: utf-8 -*-
"""给 Lightpanda 草稿补独立 digest + content_source_url（阅读原文）。token 直拼，不重复 query。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
NEW_MEDIA = "snS2bupQYF7HgHImnpl8sUZGMYlLnTwpKsrYSzWXCzoGDSIfDw7mBBjaPzMCEjPJ"
DIGEST = "不fork Chromium，用Zig从零写的无头浏览器：实测内存省16倍、快9倍。读完源码和官方基准，讲清它的强与边界。"
SRC_URL = "https://github.com/lightpanda-io/browser"
assert len(DIGEST) <= 120, len(DIGEST)

def call(api, payload):
    url = f"https://api.weixin.qq.com/cgi-bin/{api}?access_token={AT}"
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8'))

res = call("draft/batchget", {"offset": 0, "count": 5, "no_content": 0})
target = next((it for it in res['item'] if it['media_id'] == NEW_MEDIA), None)
assert target, "未找到新草稿"
art = target['content']['news_item'][0]
art['digest'] = DIGEST
art['content_source_url'] = SRC_URL
upd = call("draft/update", {"media_id": NEW_MEDIA, "index": 0, "articles": art})
print("update errcode:", upd.get('errcode', 0), upd.get('errmsg', 'ok'))

res2 = call("draft/batchget", {"offset": 0, "count": 5, "no_content": 0})
a = next(it for it in res2['item'] if it['media_id'] == NEW_MEDIA)['content']['news_item'][0]
print("回读 digest(%d字):" % len(a.get('digest', '')), a.get('digest'))
print("回读 content_source_url:", a.get('content_source_url'))
print("title:", a.get('title'))
