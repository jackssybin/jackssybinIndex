#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把 zhihu.md 转成知乎 compact HTML。"""
import re, html, pathlib

base = pathlib.Path("/root/jackssybinIndex/content-ops/openbot-local-multiagent-workspace")
md = (base / "zhihu.md").read_text(encoding="utf-8")

IMG = {
    "PROVIDERS_IMG": "https://pic1.zhimg.com/v2-16ccd72919985298100d0256db0cb86a.png",
    "ARCH_IMG": "https://picx.zhimg.com/v2-f3408d4cfc392d4e7b1129f060077680.png",
    "SAFETY_IMG": "https://pica.zhimg.com/v2-17ab9cf0578d8a4580b4a8e9f23befbc.png",
}

# 去掉 H1（标题由 --title 提供）
md = re.sub(r'^#\s+.+\n', '', md, count=1)

def inline(s):
    # 先摘出行内代码
    codes = []
    def stash(m):
        codes.append(html.escape(m.group(1)))
        return f"\x00{len(codes)-1}\x00"
    s = re.sub(r'`([^`]+)`', stash, s)
    # 粗体
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    # 链接
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    for i, c in enumerate(codes):
        s = s.replace(f"\x00{i}\x00", f"<code>{c}</code>")
    return s

out = []
lines = md.split("\n")
i = 0
while i < len(lines):
    ln = lines[i]
    # 代码块
    if ln.startswith("```"):
        lang = ln[3:].strip() or "bash"
        buf = []
        i += 1
        while i < len(lines) and not lines[i].startswith("```"):
            buf.append(lines[i]); i += 1
        code = html.escape("\n".join(buf))
        out.append(f'<pre lang="{html.escape(lang)}"><code>{code}</code></pre>')
        i += 1
        continue
    # 图片独占
    m = re.match(r'^!\[[^\]]*\]\(([^)]+)\)\s*$', ln)
    if m:
        key = m.group(1)
        url = IMG.get(key, key)
        out.append(f'<img class="content_image" src="{url}">')
        i += 1
        continue
    if ln.startswith("## "):
        out.append(f"<h2>{inline(ln[3:].strip())}</h2>"); i += 1; continue
    if ln.startswith("### "):
        out.append(f"<h3>{inline(ln[4:].strip())}</h3>"); i += 1; continue
    # 列表块
    if re.match(r'^[-*] ', ln):
        items = []
        while i < len(lines) and re.match(r'^[-*] ', lines[i]):
            items.append(f"<li>{inline(lines[i][2:].strip())}</li>")
            i += 1
        out.append("<ul>" + "".join(items) + "</ul>")
        continue
    # 有序列表
    if re.match(r'^\d+\. ', ln):
        items = []
        while i < len(lines) and re.match(r'^\d+\. ', lines[i]):
            items.append(f"<li>{inline(re.sub(r'^\\d+\\. ', '', lines[i]).strip())}</li>")
            i += 1
        out.append("<ol>" + "".join(items) + "</ol>")
        continue
    if ln.strip() == "":
        i += 1; continue
    # 普通段落（合并连续行）
    para = [ln.strip()]
    i += 1
    while i < len(lines) and lines[i].strip() and not re.match(r'^(#{1,3} |[-*] |\d+\. |```|!\[)', lines[i]):
        para.append(lines[i].strip()); i += 1
    out.append("<p>" + inline(" ".join(para)) + "</p>")

body = "\n".join(out)
(base / "zhihu-compact.html").write_text(body, encoding="utf-8")
print("bytes:", len(body.encode()))
print("imgs:", body.count("content_image"))
print("bad patterns:",
      body.count("<p><br"), body.count("<br><img"), body.count("<p><img"),
      body.count("\n\n\n"))
