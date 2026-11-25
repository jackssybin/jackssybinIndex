#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import importlib.util
import json
import tempfile
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).with_name("monthly-visibility-report.py")
SPEC = importlib.util.spec_from_file_location("monthly_visibility_report", MODULE_PATH)
REPORT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(REPORT)


class MonthlyVisibilityReportTest(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary_directory.name)

    def tearDown(self):
        self.temporary_directory.cleanup()

    def write_log(self):
        lines = [
            '192.0.2.1 - - [25/Nov/2026:10:00:00 +0800] "GET /articles/a/?token=secret HTTP/1.1" 200 100 "https://private.invalid/" "Mozilla/5.0 (compatible; Baiduspider/2.0)"',
            '192.0.2.2 - - [25/Nov/2026:10:01:00 +0800] "GET /articles/a/ HTTP/1.1" 200 100 "-" "GPTBot/1.0"',
            '192.0.2.3 - - [25/Nov/2026:10:02:00 +0800] "GET /articles/missing.html HTTP/1.1" 404 100 "-" "GPTBot/1.0"',
            '192.0.2.4 - - [25/Nov/2026:10:03:00 +0800] "GET /articles/old/ HTTP/1.1" 301 100 "-" "ClaudeBot/1.0"',
            '192.0.2.5 - - [25/Nov/2026:10:04:00 +0800] "GET /articles/a/ HTTP/1.1" 200 100 "-" "PerplexityBot/1.0"',
            '192.0.2.6 - - [25/Nov/2026:10:05:00 +0800] "GET /articles/a/ HTTP/1.1" 200 100 "-" "ChatGPT-User/1.0"',
            '192.0.2.7 - - [25/Nov/2026:10:06:00 +0800] "GET /articles/a/ HTTP/1.1" 200 100 "-" "Googlebot/2.1"',
            '192.0.2.8 - - [25/Oct/2026:10:00:00 +0800] "GET /articles/old-month/ HTTP/1.1" 200 100 "-" "bingbot/2.0"',
            '192.0.2.9 - - [25/Nov/2026:10:07:00 +0800] "GET / HTTP/1.1" 200 100 "-" "Mozilla/5.0"',
            'not a valid log line',
        ]
        path = self.root / "access.log"
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return path

    def test_aggregates_bots_without_sensitive_log_data(self):
        report = REPORT.collect_report("2026-11", [self.write_log()], 10)
        self.assertEqual(report["totals"]["searchCrawlerRequests"], 2)
        self.assertEqual(report["totals"]["aiCrawlerRequests"], 4)
        self.assertEqual(report["totals"]["aiUserFetchRequests"], 1)
        self.assertEqual(report["totals"]["outsideMonth"], 1)
        self.assertEqual(report["totals"]["parseErrors"], 1)
        self.assertEqual(report["bots"]["GPTBot"]["requests"], 2)
        self.assertEqual(report["bots"]["GPTBot"]["statuses"], {"200": 1, "404": 1})
        self.assertEqual(report["bots"]["Baiduspider"]["topPaths"][0]["path"], "/articles/a/")
        serialized = json.dumps(report, ensure_ascii=False)
        self.assertNotIn("192.0.2", serialized)
        self.assertNotIn("secret", serialized)
        self.assertNotIn("private.invalid", serialized)

    def test_loads_only_valid_manual_observations(self):
        path = self.root / "observations.json"
        path.write_text(json.dumps({
            "schemaVersion": 1,
            "month": "2026-11",
            "exampleOnly": False,
            "search": [{
                "source": "google-search-console",
                "url": "/articles/a/?private=yes",
                "indexStatus": "observed-indexed",
                "impressions": 10,
                "clicks": 2,
            }],
            "aiCitations": [],
        }), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "查询参数"):
            REPORT.load_observations(path, "2026-11")
        path.write_text(json.dumps({
            "schemaVersion": 1,
            "month": "2026-11",
            "exampleOnly": True,
            "search": [],
            "aiCitations": [],
        }), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "示例"):
            REPORT.load_observations(path, "2026-11")

    def test_accepts_real_observations_and_normalizes_urls(self):
        path = self.root / "observations.json"
        path.write_text(json.dumps({
            "schemaVersion": 1,
            "month": "2026-11",
            "exampleOnly": False,
            "search": [{
                "source": "google-search-console",
                "url": "https://www.jackssybin.cn/articles/a/",
                "indexStatus": "observed-indexed",
                "impressions": 10,
                "clicks": 2,
                "queries": [{"query": "示例查询", "impressions": 8, "clicks": 1}],
            }],
            "aiCitations": [{
                "product": "ChatGPT",
                "checkedAt": "2026-11-25",
                "question": "固定抽测问题",
                "cited": True,
                "citedUrls": ["https://jackssybin.cn/articles/a/"],
            }],
        }), encoding="utf-8")
        observations = REPORT.load_observations(path, "2026-11")
        self.assertEqual(observations["search"][0]["url"], "https://jackssybin.cn/articles/a/")
        self.assertEqual(observations["aiCitations"][0]["citedUrls"],
                         ["https://jackssybin.cn/articles/a/"])


if __name__ == "__main__":
    unittest.main()
