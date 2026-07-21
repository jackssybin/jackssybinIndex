#!/usr/bin/env python3
"""Build zhihu-compact.html from zhihu.md.

Strategy: Convert markdown to compact HTML with no blank paragraphs, using
public URLs for images.

Copy this into content-ops/<slug>/build_zhihu_html.py, then customize:
  1. Set SITE_BASE image URL prefix
  2. Update the H1 title in out_parts.append()
  3. If you need section-specific image insertion, use section_to_image dict
  4. Run: python3 build_zhihu_html.py

Reuses across projects — this is the canonical converter.
"""
import re
from pathlib import Path

HERE = Path(__file__).parent
SRC = HERE / "zhihu.md"
OUT = HERE / "zhihu-compact.html"

SITE_BASE = "https://jackssybin.cn/images/build-your-own-x-programming-by-doing"

md = SRC.read_text(encoding="utf-8")

# strip frontmatter if any
if md.startswith("---"):
    md = re.sub(r"^---.*?---\s*\n", "", md, count=1, flags=re.DOTALL)

lines = md.split("\n")
out_parts = []


def esc(s):
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def inline_md(s):
    # `code`
    s = re.sub(r"`([^`]+)`", lambda m: f"<code>{esc(m.group(1))}</code>", s)
    # **bold**
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    # [text](url)
    s = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{esc(m.group(2))}" target="_blank">{esc(m.group(1))}</a>',
        s,
    )
    # <https://...> auto-link (raw HTML-escaped or bare)
    s = re.sub(
        r"&lt;(https?://[^&\s]+)&gt;",
        lambda m: f'<a href="{m.group(1)}" target="_blank">{m.group(1)}</a>',
        s,
    )
    s = re.sub(
        r"<(https?://[^>\s]+)>",
        lambda m: f'<a href="{m.group(1)}" target="_blank">{m.group(1)}</a>',
        s,
    )
    return s


i = 0
in_code = False
code_lang = ""
code_buf = []
list_stack = []
paragraph_buf = []
in_table = False
table_buf = []


def flush_paragraph():
    global paragraph_buf
    if paragraph_buf:
        text = " ".join(paragraph_buf).strip()
        if text:
            out_parts.append(f"<p>{inline_md(text)}</p>")
        paragraph_buf = []


def flush_list():
    global list_stack
    while list_stack:
        tag = list_stack.pop()
        out_parts.append(f"</{tag}>")


def flush_table():
    global in_table, table_buf
    if not in_table:
        return
    if len(table_buf) >= 2:
        header = [c.strip() for c in table_buf[0].strip().strip("|").split("|")]
        rows = []
        for r in table_buf[2:]:
            cells = [c.strip() for c in r.strip().strip("|").split("|")]
            rows.append(cells)
        out = ["<table><thead><tr>"]
        for h in header:
            out.append(f"<th>{inline_md(h)}</th>")
        out.append("</tr></thead><tbody>")
        for row in rows:
            out.append("<tr>")
            for c in row:
                out.append(f"<td>{inline_md(c)}</td>")
            out.append("</tr>")
        out.append("</tbody></table>")
        out_parts.append("".join(out))
    in_table = False
    table_buf = []


# Section image insertion (optional — use inline ![]() in MD instead)
section_to_image = {
    # "Section title": (label, url),
}

# Custom H1
out_parts.append("<h1>如何评价 GitHub 上 53 万星的 build-your-own-x？真的能学会编程吗？</h1>")

skip_first_h1 = True

while i < len(lines):
    line = lines[i]
    stripped = line.rstrip()

    # Code fence
    if stripped.startswith("```"):
        flush_table()
        if not in_code:
            flush_paragraph()
            flush_list()
            in_code = True
            code_lang = stripped[3:].strip() or "text"
            code_buf = []
        else:
            code = "\n".join(code_buf)
            out_parts.append(
                f'<pre lang="{code_lang}"><code>{esc(code)}</code></pre>'
            )
            in_code = False
            code_buf = []
        i += 1
        continue
    if in_code:
        code_buf.append(line)
        i += 1
        continue

    # Table row (pipe table starting with |)
    if stripped.startswith("|") and stripped.endswith("|"):
        flush_paragraph()
        flush_list()
        table_buf.append(stripped)
        in_table = True
        i += 1
        continue
    elif in_table:
        flush_table()

    # Headings
    m = re.match(r"^(#{1,6})\s+(.*)$", stripped)
    if m:
        flush_paragraph()
        flush_list()
        level = len(m.group(1))
        title = m.group(2).strip()
        if skip_first_h1 and level == 1:
            skip_first_h1 = False
            i += 1
            continue
        skip_first_h1 = False
        tag = f"h{min(level, 4)}"
        out_parts.append(f"<{tag}>{inline_md(title)}</{tag}>")
        # Image right after this section title?
        if title in section_to_image:
            label, url = section_to_image[title]
            out_parts.append(
                f'<img class="content_image" src="{url}" alt="{esc(label)}">'
            )
        i += 1
        continue

    # Blockquote
    if stripped.startswith("> "):
        flush_paragraph()
        flush_list()
        content = stripped[2:]
        bq = [content]
        j = i + 1
        while j < len(lines) and lines[j].rstrip().startswith("> "):
            bq.append(lines[j].rstrip()[2:])
            j += 1
        out_parts.append(
            f"<blockquote><p>{inline_md(' '.join(bq))}</p></blockquote>"
        )
        i = j
        continue

    # HR
    if re.match(r"^-{3,}$", stripped):
        flush_paragraph()
        flush_list()
        out_parts.append("<hr>")
        i += 1
        continue

    # Image line
    img_m = re.match(r"^\!\[([^\]]*)\]\(([^)]+)\)\s*$", stripped)
    if img_m:
        flush_paragraph()
        flush_list()
        alt, src = img_m.group(1), img_m.group(2)
        out_parts.append(
            f'<img class="content_image" src="{src}" alt="{esc(alt)}">'
        )
        i += 1
        continue

    # List
    ul_m = re.match(r"^(\s*)[-*]\s+(.*)$", line)
    ol_m = re.match(r"^(\s*)(\d+)\.\s+(.*)$", line)
    if ul_m or ol_m:
        flush_paragraph()
        want = "ul" if ul_m else "ol"
        content = ul_m.group(2) if ul_m else ol_m.group(3)
        if not list_stack or list_stack[-1] != want:
            flush_list()
            list_stack.append(want)
            out_parts.append(f"<{want}>")
        out_parts.append(f"<li>{inline_md(content)}</li>")
        i += 1
        continue

    # Blank line
    if stripped == "":
        flush_paragraph()
        flush_list()
        i += 1
        continue

    # Regular paragraph line
    paragraph_buf.append(stripped)
    i += 1

flush_paragraph()
flush_list()
flush_table()

html = "".join(out_parts)
html = re.sub(r"<p>\s*</p>", "", html)
html = re.sub(r"<p><br\s*/?></p>", "", html)
html = re.sub(r"<br\s*/?><img", "<img", html)

OUT.write_text(html, encoding="utf-8")
print(f"wrote {OUT} ({len(html)} chars)")