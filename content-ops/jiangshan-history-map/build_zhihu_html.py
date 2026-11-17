#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""江山时序 知乎专栏 compact HTML：本地图替换知乎 CDN，裸 img，无紧凑性违规。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/jiangshan-history-map")
md = (base / "zhihu.md").read_text(encoding="utf-8")

IMG = {
    "media/architecture.png": "https://picx.zhimg.com/v2-f4161d00f84fd3ebf602799a2308ad05.png",
    "media/gameplay.png": "https://picx.zhimg.com/v2-8528e5a2e0cf3f8433a39140f72b1319.png",
    "media/data-model.png": "https://pic1.zhimg.com/v2-3f001a74584a9d8657b665678b3e0a04.png",
    "media/limits.png": "https://pic1.zhimg.com/v2-2505a9225ca919377c54cab104ff8908.png",
}
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
    if re.match(r'^[-*] ', ln) or re.match(r'^\d+\.\s', ln):
        items = []
        while i < len(L) and (re.match(r'^[-*] ', L[i]) or re.match(r'^\d+\.\s', L[i])):
            txt = re.sub(r'^([-*]|\d+\.)\s', '', L[i])
            items.append(f"<li>{inline(txt)}</li>"); i += 1
        out.append("<ul>" + "".join(items) + "</ul>"); continue
    if ln.strip() == "":
        i += 1; continue
    out.append(f"<p>{inline(ln.strip())}</p>")
    i += 1

doc = "\n".join(out)
for bad in ["<p><img", "<p><br", "<br><img", "\n\n\n"]:
    assert bad not in doc, f"紧凑性违规: {bad}"
(base / "zhihu-compact.html").write_text(doc, encoding="utf-8")
print("长度:", len(doc), "| 裸img:", doc.count('<img class="content_image"'),
      "| h2:", doc.count("<h2>"), "| pre:", doc.count("<pre lang"))
