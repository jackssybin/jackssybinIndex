# -*- coding: utf-8 -*-
"""public-apis 草稿补独立 digest + content_source_url。按标题匹配，规避草稿分页问题。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
DIGEST = "克隆实测GitHub 50万Star的免费API清单：2465接口51分类，656个免Key可纯前端直连，给出8个聚合应用方向与认证跨域边界。"
SRC_URL = "https://github.com/public-apis/public-apis"
TITLE_KEY = "免费API大全"
assert len(DIGEST) <= 120, len(DIGEST)

def call(api, payload):
    url = f"https://api.weixin.qq.com/cgi-bin/{api}?access_token={AT}"
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8'))

# 草稿超 300 篇，分页按标题匹配
target = None; mid = None
for offset in range(0, 400, 20):
    res = call("draft/batchget", {"offset": offset, "count": 20, "no_content": 0})
    items = res.get('item', [])
    if not items: break
    for it in items:
        if TITLE_KEY in it['content']['news_item'][0].get('title', ''):
            target = it; break
    if target: break
assert target, "未找到新草稿"
mid = target['media_id']
art = target['content']['news_item'][0]
art['digest'] = DIGEST
art['content_source_url'] = SRC_URL
upd = call("draft/update", {"media_id": mid, "index": 0, "articles": art})
print("update errcode:", upd.get('errcode', 0), upd.get('errmsg', 'ok'))

# 回读校验
target2 = None
for offset in range(0, 400, 20):
    res = call("draft/batchget", {"offset": offset, "count": 20, "no_content": 0})
    for it in res.get('item', []):
        if it['media_id'] == mid: target2 = it; break
    if target2: break
a = target2['content']['news_item'][0]
print("media_id:", mid)
print("digest(%d字):" % len(a.get('digest', '')), a.get('digest'))
print("source:", a.get('content_source_url'))
print("thumb_media_id 非空:", bool(a.get('thumb_media_id')))
print("title:", a.get('title'))
