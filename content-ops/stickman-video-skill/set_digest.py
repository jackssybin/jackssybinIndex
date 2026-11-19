# -*- coding: utf-8 -*-
"""stickman 草稿补独立 digest + content_source_url。按标题匹配，规避草稿分页问题。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
DIGEST = "把文章自动做成火柴人视频的开源Skill：双引擎14种画风，本地渲染旁白字幕音效。我亲手装好跑通doctor自检，讲清选型、流程与非一键软件的真实边界。"
SRC_URL = "https://github.com/kaomei/stickman-video-director"
assert len(DIGEST) <= 120, len(DIGEST)

def call(api, payload):
    url = f"https://api.weixin.qq.com/cgi-bin/{api}?access_token={AT}"
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8'))

res = call("draft/batchget", {"offset": 0, "count": 20, "no_content": 0})
target = next((it for it in res['item'] if "火柴人视频Skill" in it['content']['news_item'][0].get('title', '')), None)
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
