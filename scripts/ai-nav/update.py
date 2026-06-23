#!/usr/bin/env python3
"""Refresh AI nav data for the Hugo project (blog_change).

Scrapes ailookme.com + ai-bot.cn fresh, recategorizes, validates, and
publishes to static/ai-nav/data/tools.json so the embedded nav site at
/ai-nav/ stays in sync. Hugo copies static/ verbatim into public/.

Run manually:   python scripts/ai-nav/update.py
Or via npm:     pnpm nav:update
"""
import io
import json
import os
import shutil
import subprocess
import sys
from datetime import datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(SCRIPT_DIR))  # blog_change/
SCRAPER = os.path.join(SCRIPT_DIR, "scrape.py")
RECAT = os.path.join(SCRIPT_DIR, "recategorize.py")
RAW = os.path.join(SCRIPT_DIR, "tools.raw.json")
PUBLISH = os.path.join(ROOT, "static", "ai-nav", "data", "tools.json")

PY = sys.executable


def log(msg):
    print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}", flush=True)


def run(cmd):
    log("RUN " + " ".join(cmd))
    res = subprocess.run(cmd, cwd=SCRIPT_DIR)
    if res.returncode != 0:
        raise SystemExit(f"Command failed ({res.returncode}): {' '.join(cmd)}")


def main():
    max_pages = os.environ.get("NAV_MAX_PAGES", "8")
    use_cache = os.environ.get("NAV_USE_CACHE") == "1"

    backup = None
    if os.path.exists(PUBLISH):
        backup = PUBLISH + ".bak"
        shutil.copyfile(PUBLISH, backup)

    try:
        scrape_cmd = [PY, SCRAPER, "--max-pages", str(max_pages), "--output", RAW]
        if not use_cache:
            scrape_cmd.append("--no-cache")
        run(scrape_cmd)
        run([PY, RECAT, RAW])

        with io.open(RAW, encoding="utf-8") as f:
            data = json.load(f)
        total = len(data.get("tools", []))
        if total < 500:
            raise SystemExit(f"Refusing to publish: only {total} tools scraped "
                             "(expected 2000+). Nav data left unchanged.")

        os.makedirs(os.path.dirname(PUBLISH), exist_ok=True)
        shutil.copyfile(RAW, PUBLISH)
        log(f"Published {total} tools / {len(data.get('categories', []))} categories "
            f"to {PUBLISH}")
    except SystemExit:
        if backup and os.path.exists(backup):
            shutil.copyfile(backup, PUBLISH)
            log("Restored previous data from backup after failure.")
        raise
    finally:
        if backup and os.path.exists(backup):
            os.remove(backup)
        if os.path.exists(RAW):
            os.remove(RAW)


if __name__ == "__main__":
    main()
