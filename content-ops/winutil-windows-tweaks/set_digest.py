# -*- coding: utf-8 -*-
"""WinUtil 草稿补独立 digest + content_source_url。token 直拼。"""
import json, urllib.request

tok = json.load(open('/root/.config/wenyan-md/token.json'))
AT = tok['accessToken']
NEW_MEDIA = "snS2bupQYF7HgHImnpl8sQAYmO43lbcHMXsyIKsWXY-NyLgR0vOa-rz41_6G1ylW"
DIGEST = "6.6万Star的Windows装机工具：一行命令启动，239个软件一键装、480项系统调整可还原。扒完源码讲清irm|iex风险和安全兜底。"
SRC_URL = "https://github.com/ChrisTitusTech/winutil"
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
