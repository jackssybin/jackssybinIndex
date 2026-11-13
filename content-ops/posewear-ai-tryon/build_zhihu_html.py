#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""PoseWear 知乎专栏 compact HTML 构建。
当前知乎 cookie 401，IMG 待上传成功后回填 CDN；无 CDN 时保留本地相对路径仅作离线备份。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/posewear-ai-tryon")
md = (base / "zhihu.md").read_text(encoding="utf-8")

IMG = {
    "media/flow.png": "",
    "media/security.png": "",
    "media/neutral.png": "",
    "media/limits.png": "",
}
missing = [k for k, v in IMG.items() if not v]
if missing:
    print("警告：以下图片尚无 CDN（HTML 保留本地相对路径，仅离线备份，勿直接上传）：")
    for m in missing:
        print("  -", m)

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
        key = m.group(1)
        src = IMG.get(key) or key
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
print("生成 zhihu-compact.html，长度:", len(doc), "| 裸img:", doc.count('<img class="content_image"'),
      "| h2:", doc.count("<h2>"), "| pre:", doc.count("<pre lang"))
