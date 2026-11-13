import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OPS = ROOT / "content-ops" / "papermorph"
MEDIA = (OPS / "media").as_posix() + "/"

website = (ROOT / "content" / "articles" / "2026" / "11" / "13" / "papermorph.md").read_text(encoding="utf-8")
(OPS / "website.md").write_text(website, encoding="utf-8", newline="\n")

for channel in ("wechat", "zhihu"):
    text = (OPS / f"{channel}.md").read_text(encoding="utf-8")
    lines = text.splitlines()
    title = lines[0][2:].strip()
    body = "\n".join(lines[1:]).lstrip().replace("](media/", "](" + MEDIA)
    frontmatter = (
        "---\n"
        f"title: {json.dumps(title, ensure_ascii=False)}\n"
        f"cover: {json.dumps(MEDIA + 'cover-' + channel + '.png')}\n"
        "---\n\n"
    )
    (OPS / f"{channel}-upload.md").write_text(frontmatter + body + "\n", encoding="utf-8", newline="\n")

print("Generated website.md, wechat-upload.md and zhihu-upload.md")
