#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re, html, pathlib
base=pathlib.Path("/root/jackssybinIndex/content-ops/filmcraft-rust-nle")
md=(base/"zhihu.md").read_text(encoding="utf-8")
IMG={"EDITMAP":"https://pica.zhimg.com/v2-f72b502989d7317bd61093359e0805c5.png",
     "CODECS":"https://picx.zhimg.com/v2-93409e2c3c3a8b5eb0a5efb8873585fe.png",
     "STATUS":"https://picx.zhimg.com/v2-4b2b5a13554a6bc9e6bae08df8d0181b.png"}
md=re.sub(r'^#\s+.+\n','',md,count=1)
def inline(s):
    codes=[]
    def st(m): codes.append(html.escape(m.group(1))); return f"\x00{len(codes)-1}\x00"
    s=re.sub(r'`([^`]+)`',st,s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<a href="\2">\1</a>',s)
    for i,c in enumerate(codes): s=s.replace(f"\x00{i}\x00",f"<code>{c}</code>")
    return s
out=[];L=md.split("\n");i=0
while i<len(L):
    ln=L[i]
    if ln.startswith("```"):
        lang=ln[3:].strip() or "bash";buf=[];i+=1
        while i<len(L) and not L[i].startswith("```"): buf.append(L[i]);i+=1
        out.append(f'<pre lang="{html.escape(lang)}"><code>{html.escape(chr(10).join(buf))}</code></pre>');i+=1;continue
    m=re.match(r'^!\[[^\]]*\]\(([^)]+)\)\s*$',ln)
    if m:
        out.append(f'<img class="content_image" src="{IMG.get(m.group(1),m.group(1))}">');i+=1;continue
    if ln.startswith("## "): out.append(f"<h2>{inline(ln[3:].strip())}</h2>");i+=1;continue
    if re.match(r'^[-*] ',ln):
        it=[]
        while i<len(L) and re.match(r'^[-*] ',L[i]): it.append(f"<li>{inline(L[i][2:].strip())}</li>");i+=1
        out.append("<ul>"+"".join(it)+"</ul>");continue
    if re.match(r'^\d+\. ',ln):
        it=[]
        while i<len(L) and re.match(r'^\d+\. ',L[i]): it.append(f"<li>{inline(re.sub(r'^\\d+\\. ','',L[i]).strip())}</li>");i+=1
        out.append("<ol>"+"".join(it)+"</ol>");continue
    if not ln.strip(): i+=1;continue
    p=[ln.strip()];i+=1
    while i<len(L) and L[i].strip() and not re.match(r'^(#{1,3} |[-*] |\d+\. |```|!\[)',L[i]): p.append(L[i].strip());i+=1
    out.append("<p>"+inline(" ".join(p))+"</p>")
body="\n".join(out)
(base/"zhihu-compact.html").write_text(body,encoding="utf-8")
print("bytes",len(body.encode()),"imgs",body.count("content_image"),"pre",body.count("<pre"),
      "bad",body.count("<p><br"),body.count("<p><img"),body.count("\n\n\n"),
      "unresolved",("EDITMAP)" in body or "CODECS)" in body or "STATUS)" in body))
