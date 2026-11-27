#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成主站月度搜索爬虫、AI 抓取与人工可见度观察报表。"""

import argparse
import gzip
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit


BOT_GROUPS = {
    "Baiduspider": "search_crawler",
    "Googlebot": "search_crawler",
    "bingbot": "search_crawler",
    "GPTBot": "ai_crawler",
    "ClaudeBot": "ai_crawler",
    "PerplexityBot": "ai_crawler",
    "ChatGPT-User": "ai_user_fetch",
    "Claude-User": "ai_user_fetch",
    "Perplexity-User": "ai_user_fetch",
}

LOG_PATTERN = re.compile(
    r'^\S+\s+\S+\s+\S+\s+\[([^\]]+)\]\s+'
    r'"[A-Z]+\s+([^"]+)\s+HTTP/[^"]+"\s+'
    r'(\d{3})\s+\S+\s+"[^"]*"\s+"([^"]*)"\s*$'
)

LIMITATIONS = [
    "仅统计 Nginx combined 访问日志中可识别的 User-Agent；UA 可伪造，不能仅凭 UA 确认官方爬虫身份。",
    "爬虫请求不等于收录、展示、点击、训练采用或 AI 回答引用。",
    "AI 用户触发抓取与 AI 爬虫分开统计；一次抓取不能证明内容进入模型或答案。",
    "收录、展示和点击只能来自搜索平台导出或人工 URL 检查；真实 AI 引用只能来自固定问题的人工复核或合法导出。",
    "报表不输出 IP、Cookie、Referer、查询参数或原始日志行。",
]


def validate_month(value):
    if not re.fullmatch(r"\d{4}-\d{2}", value):
        raise ValueError("month 必须是 YYYY-MM")
    try:
        datetime.strptime(value + "-01", "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("month 不是有效月份") from exc
    return value


def parse_log_line(line):
    match = LOG_PATTERN.match(line.rstrip("\r\n"))
    if not match:
        return None
    timestamp, target, status, user_agent = match.groups()
    try:
        parsed_time = datetime.strptime(timestamp, "%d/%b/%Y:%H:%M:%S %z")
    except ValueError:
        return None
    path = urlsplit(target).path
    if not path.startswith("/"):
        return None
    return parsed_time, path, status, user_agent


def open_log(path):
    if Path(path).suffix == ".gz":
        return gzip.open(path, "rt", encoding="utf-8", errors="replace")
    return open(path, encoding="utf-8", errors="replace")


def classify_bot(user_agent):
    folded = user_agent.lower()
    for name in BOT_GROUPS:
        if name.lower() in folded:
            return name
    return None


def clean_text(value, field, maximum=200):
    if not isinstance(value, str) or not value.strip() or len(value.strip()) > maximum:
        raise ValueError("%s 必须是 1～%d 个字符的文本" % (field, maximum))
    return value.strip()


def clean_count(value, field):
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, int) or value < 0:
        raise ValueError("%s 必须是非负整数或 null" % field)
    return value


def clean_canonical_url(value, field):
    value = clean_text(value, field, 1000)
    parts = urlsplit(value)
    if parts.query or parts.fragment or parts.username or parts.password:
        raise ValueError("%s 不得包含查询参数、片段或用户信息" % field)
    if value.startswith("/") and not parts.scheme and not parts.netloc:
        return "https://jackssybin.cn" + (parts.path or "/")
    host = parts.hostname
    if parts.scheme != "https" or host not in (
            "jackssybin.cn", "www.jackssybin.cn", "tools.jackssybin.cn"):
        raise ValueError("%s 只接受本站或资料馆的 HTTPS 规范 URL" % field)
    canonical_host = "jackssybin.cn" if host == "www.jackssybin.cn" else host
    return "https://" + canonical_host + (parts.path or "/")


def clean_search_record(record, index):
    if not isinstance(record, dict):
        raise ValueError("search[%d] 必须是对象" % index)
    source = clean_text(record.get("source"), "search[%d].source" % index, 64)
    url = clean_canonical_url(record.get("url"), "search[%d].url" % index)
    status = record.get("indexStatus")
    if status not in ("observed-indexed", "observed-not-indexed", "unknown"):
        raise ValueError("search[%d].indexStatus 无效" % index)
    cleaned = {
        "source": source,
        "url": url,
        "indexStatus": status,
        "impressions": clean_count(record.get("impressions"), "search[%d].impressions" % index),
        "clicks": clean_count(record.get("clicks"), "search[%d].clicks" % index),
        "queries": [],
    }
    queries = record.get("queries", [])
    if not isinstance(queries, list):
        raise ValueError("search[%d].queries 必须是数组" % index)
    for query_index, query in enumerate(queries):
        if not isinstance(query, dict):
            raise ValueError("search[%d].queries[%d] 必须是对象" % (index, query_index))
        cleaned["queries"].append({
            "query": clean_text(query.get("query"), "搜索查询词", 200),
            "impressions": clean_count(query.get("impressions"), "查询展示数"),
            "clicks": clean_count(query.get("clicks"), "查询点击数"),
        })
    return cleaned


def clean_ai_record(record, index, month):
    if not isinstance(record, dict):
        raise ValueError("aiCitations[%d] 必须是对象" % index)
    checked_at = clean_text(record.get("checkedAt"), "aiCitations.checkedAt", 10)
    try:
        datetime.strptime(checked_at, "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("aiCitations.checkedAt 必须是 YYYY-MM-DD") from exc
    if not checked_at.startswith(month + "-"):
        raise ValueError("AI 引用检查日期必须位于报表月份")
    cited = record.get("cited")
    if not isinstance(cited, bool):
        raise ValueError("aiCitations.cited 必须是布尔值")
    cited_urls = record.get("citedUrls")
    if not isinstance(cited_urls, list):
        raise ValueError("aiCitations.citedUrls 必须是数组")
    cleaned_urls = [clean_canonical_url(url, "AI 引用 URL") for url in cited_urls]
    if cited and not cleaned_urls:
        raise ValueError("cited=true 时必须记录至少一个本站被引用 URL")
    if not cited and cleaned_urls:
        raise ValueError("cited=false 时 citedUrls 必须为空")
    return {
        "product": clean_text(record.get("product"), "AI 产品名称", 64),
        "checkedAt": checked_at,
        "question": clean_text(record.get("question"), "固定抽测问题", 500),
        "cited": cited,
        "citedUrls": cleaned_urls,
    }


def load_observations(path, month):
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    if (not isinstance(data, dict)
            or isinstance(data.get("schemaVersion"), bool)
            or data.get("schemaVersion") != 1):
        raise ValueError("观察记录 schemaVersion 必须为 1")
    if data.get("exampleOnly") is True:
        raise ValueError("示例观察文件不能直接用于正式报表")
    if data.get("month") != month:
        raise ValueError("观察记录月份与报表月份不一致")
    search = data.get("search", [])
    ai_citations = data.get("aiCitations", [])
    if not isinstance(search, list) or not isinstance(ai_citations, list):
        raise ValueError("search 与 aiCitations 必须是数组")
    return {
        "search": [clean_search_record(record, index) for index, record in enumerate(search)],
        "aiCitations": [clean_ai_record(record, index, month)
                        for index, record in enumerate(ai_citations)],
    }


def empty_bot_bucket(group):
    return {
        "group": group,
        "requests": 0,
        "statuses": Counter(),
        "paths": defaultdict(Counter),
    }


def collect_report(month, log_paths, top, observations=None):
    validate_month(month)
    if isinstance(top, bool) or not isinstance(top, int) or not 1 <= top <= 1000:
        raise ValueError("top 必须是 1～1000 的整数")
    totals = Counter()
    coverage = []
    bots = {name: empty_bot_bucket(group) for name, group in BOT_GROUPS.items()}
    for log_path in log_paths:
        file_totals = Counter()
        first_seen = None
        last_seen = None
        with open_log(log_path) as handle:
            for line in handle:
                totals["linesRead"] += 1
                file_totals["linesRead"] += 1
                parsed = parse_log_line(line)
                if parsed is None:
                    totals["parseErrors"] += 1
                    file_totals["parseErrors"] += 1
                    continue
                parsed_time, path, status, user_agent = parsed
                first_seen = parsed_time if first_seen is None else min(first_seen, parsed_time)
                last_seen = parsed_time if last_seen is None else max(last_seen, parsed_time)
                if parsed_time.strftime("%Y-%m") != month:
                    totals["outsideMonth"] += 1
                    file_totals["outsideMonth"] += 1
                    continue
                totals["requestsInMonth"] += 1
                file_totals["requestsInMonth"] += 1
                bot_name = classify_bot(user_agent)
                if bot_name is None:
                    totals["unclassifiedRequests"] += 1
                    continue
                totals["recognizedRequests"] += 1
                bucket = bots[bot_name]
                bucket["requests"] += 1
                bucket["statuses"][status] += 1
                bucket["paths"][path][status] += 1
        coverage.append({
            "file": Path(log_path).name,
            "sizeBytes": Path(log_path).stat().st_size,
            "compressed": Path(log_path).suffix == ".gz",
            "linesRead": file_totals["linesRead"],
            "parseErrors": file_totals["parseErrors"],
            "outsideMonth": file_totals["outsideMonth"],
            "requestsInMonth": file_totals["requestsInMonth"],
            "firstTimestamp": first_seen.isoformat() if first_seen else None,
            "lastTimestamp": last_seen.isoformat() if last_seen else None,
        })
    bot_reports = {}
    for name, bucket in bots.items():
        sorted_paths = sorted(
            bucket["paths"].items(),
            key=lambda item: (-sum(item[1].values()), item[0]),
        )[:top]
        bot_reports[name] = {
            "group": bucket["group"],
            "requests": bucket["requests"],
            "statuses": dict(sorted(bucket["statuses"].items())),
            "topPaths": [{
                "path": path,
                "requests": sum(statuses.values()),
                "statuses": dict(sorted(statuses.items())),
            } for path, statuses in sorted_paths],
        }
    group_totals = Counter()
    for bucket in bots.values():
        group_totals[bucket["group"]] += bucket["requests"]
    return {
        "schemaVersion": 1,
        "month": month,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "logFilesRead": len(log_paths),
        "logCoverage": coverage,
        "totals": {
            "linesRead": totals["linesRead"],
            "parseErrors": totals["parseErrors"],
            "outsideMonth": totals["outsideMonth"],
            "requestsInMonth": totals["requestsInMonth"],
            "unclassifiedRequests": totals["unclassifiedRequests"],
            "recognizedRequests": totals["recognizedRequests"],
            "searchCrawlerRequests": group_totals["search_crawler"],
            "aiCrawlerRequests": group_totals["ai_crawler"],
            "aiUserFetchRequests": group_totals["ai_user_fetch"],
        },
        "bots": bot_reports,
        "manualObservations": observations,
        "limitations": LIMITATIONS,
    }


def parse_args(argv):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--month", required=True, help="报表月份，格式 YYYY-MM")
    parser.add_argument("--log", action="append", required=True,
                        help="Nginx combined access log；轮换日志可重复传入")
    parser.add_argument("--observations", help="人工搜索与 AI 引用观察 JSON")
    parser.add_argument("--output", help="报表输出路径；省略时写标准输出")
    parser.add_argument("--top", type=int, default=50, help="每个 Bot 最多输出多少条路径")
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)
    try:
        validate_month(args.month)
        observations = (load_observations(args.observations, args.month)
                        if args.observations else None)
        report = collect_report(args.month, args.log, args.top, observations)
        output = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
        if args.output:
            output_path = Path(args.output)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_text(output, encoding="utf-8")
        else:
            sys.stdout.write(output)
    except (OSError, ValueError, json.JSONDecodeError) as exc:
        print("生成月度可见度报表失败: %s" % exc, file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
