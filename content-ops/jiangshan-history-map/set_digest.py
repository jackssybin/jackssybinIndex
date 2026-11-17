# -*- coding: utf-8 -*-
"""江山时序 草稿补独立 digest + content_source_url。token 直拼。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
NEW_MEDIA = "snS2bupQYF5HgHImnpl8sfQV5hij-jgk9MFKmJquksUD-GDn8iP5zT7aD4uY-e7l"
DIGEST = "7096Star的中国历史交互舆图：零框架纯原生JS自研GIS，18朝代206个GeoJSON，拖时间轴看疆域分合、点城读史、追随七位古人足迹，也讲清示意边界与GPL协议。"
SRC_URL = "https://github.com/DeanChensj/jiangshan-map"
assert len(DIGEST) <= 120, len(DIGEST)

def call(api, payload):
    url = f"https://api.weixin.qq.com/cgi-bin/{api}?access_token={AT}"
    req = urllib.request.Request(url, data=json.dumps(payload, ensure_ascii=False).encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
    return json.loads(urllib.request.urlopen(req, timeout=30).read().decode('utf-8'))

res = call("draft/batchget", {"offset": 0, "count": 20, "no_content": 0})
# 草稿总数很多（300+），按标题匹配而非依赖固定位置
target = next((it for it in res['item'] if "历史交互地图" in it['content']['news_item'][0].get('title', '')), None)
assert target, "未找到新草稿"
NEW_MEDIA = target['media_id']
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
