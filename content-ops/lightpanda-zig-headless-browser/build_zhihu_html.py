#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lightpanda 知乎专栏 compact HTML 构建：本地图替换为知乎 CDN，代码块用 <pre lang>，图片裸 img。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/lightpanda-zig-headless-browser")
md = (base / "zhihu.md").read_text(encoding="utf-8")

IMG = {
    "media/benchmark.png": "https://picx.zhimg.com/v2-0a8f520b177fb11a93ae6a03f1c4f110.png",
    "media/architecture.png": "https://pic1.zhimg.com/v2-80e7c115f2e4d93b9d1b517937f5fdcb.png",
    "media/usecases.png": "https://pica.zhimg.com/v2-223f37aa2cb21359375e050f10302e26.png",
    "media/limits.png": "https://pic1.zhimg.com/v2-f17d0495311ee155159c97786884b239.png",
}

# 去掉首个 H1（标题走 --title）
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
    # 代码块
    if ln.startswith("```"):
        lang = ln[3:].strip() or "bash"
        buf = []
        i += 1
        while i < len(L) and not L[i].startswith("```"):
            buf.append(L[i]); i += 1
        out.append(f'<pre lang="{html.escape(lang)}"><code>{html.escape(chr(10).join(buf))}</code></pre>')
        i += 1; continue
    # 图片（独占一行）→ 裸 img
    m = re.match(r'^!\[[^\]]*\]\(([^)]+)\)\s*$', ln)
    if m:
        src = IMG.get(m.group(1), m.group(1))
        out.append(f'<img class="content_image" src="{src}">')
        i += 1; continue
    # 小标题
    if ln.startswith("## "):
        out.append(f"<h2>{inline(ln[3:].strip())}</h2>"); i += 1; continue
    # 有序/无序列表
    if re.match(r'^[-*] ', ln) or re.match(r'^\d+\.\s', ln):
        items = []
        while i < len(L) and (re.match(r'^[-*] ', L[i]) or re.match(r'^\d+\.\s', L[i])):
            txt = re.sub(r'^([-*]|\d+\.)\s', '', L[i])
            items.append(f"<li>{inline(txt)}</li>"); i += 1
        out.append("<ul>" + "".join(items) + "</ul>"); continue
    # 普通段落（跳过空行）
    if ln.strip() == "":
        i += 1; continue
    out.append(f"<p>{inline(ln.strip())}</p>")
    i += 1

doc = "\n".join(out)
# compact 检查：禁止 <p><img、<p><br、三连换行
for bad in ["<p><img", "<p><br", "<br><img", "\n\n\n"]:
    assert bad not in doc, f"出现紧凑性违规: {bad}"
(base / "zhihu-compact.html").write_text(doc, encoding="utf-8")
print("生成 zhihu-compact.html，长度:", len(doc))
print("裸 img 数:", doc.count('<img class="content_image"'))
print("pre 代码块:", doc.count("<pre lang"))
print("h2 数:", doc.count("<h2>"))
