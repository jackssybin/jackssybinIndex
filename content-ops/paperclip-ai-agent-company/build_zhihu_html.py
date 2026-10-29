#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 zhihu.md 转成知乎 compact HTML（paperclip）。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/paperclip-ai-agent-company")
md = (base / "zhihu.md").read_text(encoding="utf-8")
IMG = {
    "PILLARS": "https://picx.zhimg.com/v2-8687d970677b875e25b628839ee5df3d.png",
    "ARCH": "https://pic1.zhimg.com/v2-acc30bff78e1f14fa64da6924886080c.png",
    "COMPARE": "https://picx.zhimg.com/v2-b36ccd2b675cdf2dd9ef196c824bd940.png",
}
# compare 图正文未在 zhihu.md 引用（只3张：pillars,arch）；实际 zhihu.md 只有两个图占位
md = re.sub(r'^#\s+.+\n', '', md, count=1)

def inline(s):
    codes=[]
    def stash(m):
        codes.append(html.escape(m.group(1))); return f"\x00{len(codes)-1}\x00"
    s=re.sub(r'`([^`]+)`',stash,s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
    for i,c in enumerate(codes): s=s.replace(f"\x00{i}\x00",f"<code>{c}</code>")
    return s

out=[]; lines=md.split("\n"); i=0
while i < len(lines):
    ln=lines[i]
    if ln.startswith("```"):
        lang=ln[3:].strip() or "bash"; buf=[]; i+=1
        while i<len(lines) and not lines[i].startswith("```"): buf.append(lines[i]); i+=1
        out.append(f'<pre lang="{html.escape(lang)}"><code>{html.escape(chr(10).join(buf))}</code></pre>'); i+=1; continue
    m=re.match(r'^!\[[^\]]*\]\(([^)]+)\)\s*$',ln)
    if m:
        url=IMG.get(m.group(1),m.group(1)); out.append(f'<img class="content_image" src="{url}">'); i+=1; continue
    if ln.startswith("## "): out.append(f"<h2>{inline(ln[3:].strip())}</h2>"); i+=1; continue
    if ln.startswith("### "): out.append(f"<h3>{inline(ln[4:].strip())}</h3>"); i+=1; continue
    if re.match(r'^[-*] ',ln):
        items=[]
        while i<len(lines) and re.match(r'^[-*] ',lines[i]):
            items.append(f"<li>{inline(lines[i][2:].strip())}</li>"); i+=1
        out.append("<ul>"+"".join(items)+"</ul>"); continue
    if re.match(r'^\d+\. ',ln):
        items=[]
        while i<len(lines) and re.match(r'^\d+\. ',lines[i]):
            items.append(f"<li>{inline(re.sub(r'^\\d+\\. ','',lines[i]).strip())}</li>"); i+=1
        out.append("<ol>"+"".join(items)+"</ol>"); continue
    if not ln.strip(): i+=1; continue
    para=[ln.strip()]; i+=1
    while i<len(lines) and lines[i].strip() and not re.match(r'^(#{1,3} |[-*] |\d+\. |```|!\[)',lines[i]):
        para.append(lines[i].strip()); i+=1
    out.append("<p>"+inline(" ".join(para))+"</p>")

body="\n".join(out)
(base/"zhihu-compact.html").write_text(body,encoding="utf-8")
print("bytes:",len(body.encode()),"| imgs:",body.count("content_image"),"| pre:",body.count("<pre"))
print("bad:",body.count("<p><br"),body.count("<br><img"),body.count("<p><img"),body.count("\n\n\n"))
# 校验图片占位都解析了
print("unresolved placeholder:", "PILLARS)" in body or "ARCH)" in body)
