#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""public-apis 知乎专栏 compact HTML：本地图替换知乎 CDN，裸 img，无紧凑性违规。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/public-apis-aggregator")
md = (base / "zhihu.md").read_text(encoding="utf-8")

IMG = {
    "media/structure.png": "https://picx.zhimg.com/v2-3fb8dd8bc4e31c536517bc85aa387011.png",
    "media/auth-cors.png": "https://picx.zhimg.com/v2-bb44c6abaf58f9fdf9881a698e09b117.png",
    "media/ideas.png": "https://pic1.zhimg.com/v2-ccc797cb05ffd6c8d995fb3b0c9c0c14.png",
    "media/verdict.png": "https://pic1.zhimg.com/v2-4e42657c5926a745eae68b86d057472c.png",
}
# 去掉首个 H1（标题走 column --title）
md = re.sub(r'^#\s+.+\n', '', md, count=1)

def inline(s):
    codes = []
    def st(m):
        codes.append(html.escape(m.group(1))); return f"\x00{len(codes)-1}\x00"
    s = re.sub(r'`([^`]+)`', st, s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    for i, c in enumerate(codes):
        s = s.replace(f"\x00{i}\x00", f"<code>{c}</code>")
    return s

out = []
L = md.split("\n")
i = 0
while i < len(L):
    ln = L[i]
    if ln.startswith("```"):
        lang = ln[3:].strip() or "bash"
        buf = []
        i += 1
        while i < len(L) and not L[i].startswith("```"):
            buf.append(L[i]); i += 1
        out.append(f'<pre lang="{html.escape(lang)}"><code>{html.escape(chr(10).join(buf))}</code></pre>')
        i += 1; continue
    m = re.match(r'^!\[[^\]]*\]\(([^)]+)\)\s*$', ln)
    if m:
        src = IMG.get(m.group(1), m.group(1))
        out.append(f'<img class="content_image" src="{src}">')
        i += 1; continue
    if ln.startswith("## "):
        out.append(f"<h2>{inline(ln[3:].strip())}</h2>"); i += 1; continue
    # 列表（含 ① 等）转 <p><strong> 形式，规避 ul/ol 紧凑问题
    if re.match(r'^[-*] ', ln) or re.match(r'^\d+\.\s', ln):
        items = []
        while i < len(L) and (re.match(r'^[-*] ', L[i]) or re.match(r'^\d+\.\s', L[i])):
            txt = re.sub(r'^([-*]|\d+\.)\s', '', L[i])
            items.append(f"<p>{inline(txt)}</p>"); i += 1
        out.extend(items); continue
    if ln.strip() == "":
        i += 1; continue
    out.append(f"<p>{inline(ln.strip())}</p>")
    i += 1

doc = "\n".join(out)
for bad in ["<p><img", "<p><br", "<br><img", "\n\n\n", "<ul", "<ol", "<table"]:
    assert bad not in doc, f"紧凑性违规: {bad}"
(base / "zhihu-compact.html").write_text(doc, encoding="utf-8")
print("长度:", len(doc), "| 裸img:", doc.count('<img class="content_image"'),
      "| h2:", doc.count("<h2>"), "| pre:", doc.count("<pre lang"))
