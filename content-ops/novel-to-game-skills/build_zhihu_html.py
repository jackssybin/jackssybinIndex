#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NovelToGame 知乎专栏 compact HTML 构建。
注意：本次知乎图片上传因 cookie 401 失败，IMG 映射在拿到 CDN 后回填。
先用本地占位，待 cookie 更新后跑 --upload-images 再替换。
"""
import re, html, pathlib, sys

base = pathlib.Path("/root/jackssybinIndex/content-ops/novel-to-game-skills")
md = (base / "zhihu.md").read_text(encoding="utf-8")

# 成功上传后，把本地相对路径 -> 知乎 CDN 的映射填这里
IMG = {
    "media/pipeline.png": "",
    "media/contract.png": "",
    "media/examples.png": "",
    "media/limits.png": "",
}
missing = [k for k, v in IMG.items() if not v]
if missing:
    print("警告：以下图片尚无 CDN 地址，HTML 将保留本地相对路径（仅作离线备份，勿直接上传）：")
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
