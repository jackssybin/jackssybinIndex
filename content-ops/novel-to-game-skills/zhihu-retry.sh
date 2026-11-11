#!/usr/bin/env bash
# NovelToGame 知乎补发脚本：cookie 401 恢复后执行
# 用法：更新 /root/.hermes/secrets/zhihu_cookie.txt 后，bash zhihu-retry.sh
set -euo pipefail
cd "$(dirname "$0")"
ZSCRIPT=/root/.hermes/skills/social-media/zhihu-answer-workflow/scripts/zhihu_draft.py
TITLE="翻完 NovelToGame 的 7 个 skill 和两款实机游戏，我明白了 AI 做游戏差的到底是什么"

echo "=== 第1步：用 markdown 模式上传4张图并拿 CDN ==="
python3 "$ZSCRIPT" --cache-dir ./zhihu-cache column \
  --title "$TITLE" --markdown-file ./zhihu.md --upload-images \
  | tee /tmp/ntg_retry_first.json

echo
echo "=== 请从上面输出 copied 4 个 CDN src，回填到 build_zhihu_html.py 的 IMG，再跑： ==="
echo "  python3 build_zhihu_html.py"
echo "  python3 $ZSCRIPT --cache-dir ./zhihu-cache-final column --title \"$TITLE\" --html-file ./zhihu-compact.html"
echo
echo "注意：首次 markdown 模式会产生一篇多余草稿，正式 HTML 稿成功后，到知乎后台手动删除首次那篇。"
