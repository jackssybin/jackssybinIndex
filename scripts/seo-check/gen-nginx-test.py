"""从生产 nginx 配置提取规则，生成可本机运行的测试配置。

目的：改 nginx 后，在没有服务器的前提下用真实 nginx 验证行为。
做法：读取 deploy/nginx-jackssybin.conf，取出 HTTPS server 块内的
      location / if / error_page / add_header 等指令，剥掉 SSL、
      日志、server_name 等本机无法满足的部分，替换 root 指向本地构建产物。

用法:
    python scripts/seo-check/gen-nginx-test.py <生产配置> <public目录> <输出conf> [端口]
    nginx -t -c <输出conf>
"""
import os
import re
import sys

CONF = sys.argv[1] if len(sys.argv) > 1 else "deploy/nginx-jackssybin.conf"
PUBLIC = sys.argv[2] if len(sys.argv) > 2 else "public"
OUT = sys.argv[3] if len(sys.argv) > 3 else "_ngxtest/nginx-1.28.0/conf/prod-test.conf"
PORT = sys.argv[4] if len(sys.argv) > 4 else "8890"

# 本机无法满足、或会把请求引到别处去的指令，逐行丢弃
DROP_PREFIX = (
    "listen", "server_name", "ssl_", "resolver", "root ", "access_log",
    "error_log", "include", "charset", "client_max_body_size",
    "location = /admin/report.html",          # 引用 Linux 专属路径，单独处理
)
# 丢弃整块（开始行 -> 结束该块）
DROP_BLOCK_START = ("location = /admin/report.html",)


def strip_comments(line):
    """去掉整行注释，但保留行内注释（行内注释不影响 nginx 解析）。"""
    s = line.strip()
    return "" if s.startswith("#") else line


def all_server_blocks(text):
    """返回所有 server 块（每个是行列表，含最外层 server{ 与 }）。"""
    lines = text.split("\n")
    blocks = []
    i = 0
    while i < len(lines):
        if re.match(r"\s*server\s*\{", lines[i]):
            depth = 0
            body = []
            for j in range(i, len(lines)):
                raw = lines[j]
                depth += raw.count("{") - raw.count("}")
                body.append(raw)
                if depth == 0:
                    break
            blocks.append(body)
            i = j + 1
            continue
        i += 1
    return blocks


def find_main_server(text):
    """挑出「主站点」server 块。

    一个配置里常有多个 server（:80 跳转、www 跳转、主站）。
    只按 `listen 443` 找会误选中 www 重定向块 —— 那里面一条 location 都没有。
    判据用「location 指令条数最多」，这才是真正承载站点规则的那块。
    """
    best, best_n = None, -1
    for b in all_server_blocks(text):
        joined = "\n".join(b)
        if "listen 443" not in joined and "listen 80" not in joined:
            continue
        n = len(re.findall(r"^\s*location\s", joined, re.M))
        if n > best_n:
            best, best_n = b, n
    return best


def extract_maps(text):
    """提取 http 级 map/geo 块与相配套的 map_hash_bucket_size。"""
    out = []
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        if re.match(r"\s*(map|geo)\s+\S+", lines[i]) or \
           re.match(r"\s*map_hash_bucket_size\s", lines[i]):
            if "{" in lines[i]:
                depth = 0
                for j in range(i, len(lines)):
                    depth += lines[j].count("{") - lines[j].count("}")
                    out.append(lines[j])
                    if depth == 0:
                        i = j
                        break
            else:
                out.append(lines[i])
        i += 1
    return out


def main():
    text = open(CONF, encoding="utf-8").read()
    body = find_main_server(text)
    if not body:
        print("× 未能在配置里找到任何 server 块")
        return 1

    maps = extract_maps(text)

    # 过滤 server 块内容
    inner = body[1:]                          # 去掉 "server {"
    if inner and inner[-1].strip() == "}":
        inner = inner[:-1]                    # 去掉 server 的收尾 }（只去这一个！）

    kept = []
    skipping = 0
    for raw in inner:
        line = strip_comments(raw)
        if not line.strip():
            kept.append(line)
            continue
        s = line.strip()

        # 跳过被排除的整块（按花括号配对消耗）
        if skipping > 0:
            skipping += line.count("{") - line.count("}")
            continue

        if s.rstrip("{").strip() in [d.rstrip("{").strip() for d in DROP_BLOCK_START]:
            skipping = line.count("{") - line.count("}")
            continue

        if any(s.startswith(p) for p in DROP_PREFIX):
            continue
        kept.append(line)

    # 组装测试配置
    root_unix = PUBLIC.replace("\\", "/")
    if not re.match(r"^[A-Za-z]:/", root_unix):
        root_unix = os.path.abspath(PUBLIC).replace("\\", "/")

    out = []
    out.append("worker_processes 1;")
    out.append("error_log logs/prod_test_error.log warn;")
    out.append("pid       logs/prod_test.pid;")
    out.append("")
    out.append("events { worker_connections 1024; }")
    out.append("")
    out.append("http {")
    out.append("    include       mime.types;")
    out.append("    default_type  text/html;")
    out.append("    access_log    logs/prod_test_access.log;")
    out.append("    sendfile      on;")
    out.append("")
    for m in maps:
        out.append("    " + m)
    out.append("")
    out.append("    server {")
    out.append("        listen       %s;" % PORT)
    out.append("        server_name  localhost;")
    out.append("        root         %s;" % root_unix)
    out.append("")
    for line in kept:
        out.append(line)
    out.append("    }")
    out.append("}")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    open(OUT, "w", encoding="utf-8").write("\n".join(out) + "\n")

    # 统计
    joined = "\n".join(kept)
    locs = re.findall(r"^\s*location\s+([^{]+?)\s*\{", joined, re.M)
    print("已生成: %s" % OUT)
    print("  root      : %s" % root_unix)
    print("  listen    : %s" % PORT)
    print("  map 块数  : %d" % sum(1 for m in maps if m.strip().startswith(("map ", "geo "))))
    print("  location  : %d 条" % len(locs))
    for l in locs:
        print("     %s" % l.strip())
    return 0


if __name__ == "__main__":
    sys.exit(main())
