#!/usr/bin/env python3
"""
AI导航网站爬虫 - 从 ailookme.com 和 ai-bot.cn 采集AI工具数据
输出: data/tools.json - 合并去重后的工具数据
"""
import requests
from bs4 import BeautifulSoup
import json
import time
import re
import os
import hashlib
from datetime import datetime
from urllib.parse import urljoin
import argparse
import shutil

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache')
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

# ========== 分类定义 ==========
AILOOKME_CATEGORIES = [
    ("对话AI", "https://www.ailookme.com/favorites/chatgpt"),
    ("AI绘画/图像", "https://www.ailookme.com/favorites/image-generator"),
    ("图像处理", "https://www.ailookme.com/favorites/image"),
    ("图像编辑", "https://www.ailookme.com/favorites/image-editing"),
    ("视频生成", "https://www.ailookme.com/favorites/video-generator"),
    ("视频处理", "https://www.ailookme.com/favorites/video"),
    ("视频编辑", "https://www.ailookme.com/favorites/video-editing"),
    ("文案/写作", "https://www.ailookme.com/favorites/copywriting"),
    ("通用写作", "https://www.ailookme.com/favorites/general-writing"),
    ("写作助手", "https://www.ailookme.com/favorites/writing-assistant"),
    ("文案助手", "https://www.ailookme.com/favorites/copywriting-assistant"),
    ("改写", "https://www.ailookme.com/favorites/paraphraser"),
    ("文案生成", "https://www.ailookme.com/favorites/text"),
    ("代码助手", "https://www.ailookme.com/favorites/code-assistant"),
    ("开发工具", "https://www.ailookme.com/favorites/code"),
    ("开发者工具", "https://www.ailookme.com/favorites/developer-tools"),
    ("PPT", "https://www.ailookme.com/favorites/presentations"),
    ("生产力", "https://www.ailookme.com/favorites/productivity"),
    ("AI提示词", "https://www.ailookme.com/favorites/prompts-assistant"),
    ("3D", "https://www.ailookme.com/favorites/3d-generator"),
    ("音频/音乐", "https://www.ailookme.com/favorites/music-generator"),
    ("音频编辑", "https://www.ailookme.com/favorites/audio-editing"),
    ("文本转语音", "https://www.ailookme.com/favorites/text-to-speech"),
    ("音频转录", "https://www.ailookme.com/favorites/transcriber"),
    ("SEO", "https://www.ailookme.com/favorites/seo-assistant"),
    ("自媒体", "https://www.ailookme.com/favorites/social-media-assistant"),
    ("生活助手", "https://www.ailookme.com/favorites/life-assistant"),
    ("教育", "https://www.ailookme.com/favorites/education-assistant"),
    ("研究", "https://www.ailookme.com/favorites/research-assistant"),
    ("人力资源", "https://www.ailookme.com/favorites/human-resources"),
    ("金融", "https://www.ailookme.com/favorites/finance"),
    ("电子商务", "https://www.ailookme.com/favorites/e-commerce"),
    ("销售", "https://www.ailookme.com/favorites/sales-assistant"),
    ("客服", "https://www.ailookme.com/favorites/customer-support"),
    ("创业工具", "https://www.ailookme.com/favorites/startup-assistant"),
    ("低代码/无代码", "https://www.ailookme.com/favorites/low-code-no-code"),
    ("Logo生成", "https://www.ailookme.com/favorites/logo-generator"),
    ("头像生成", "https://www.ailookme.com/favorites/avatar-generator"),
    ("设计辅助", "https://www.ailookme.com/favorites/design-assistant"),
    ("SQL助手", "https://www.ailookme.com/favorites/sql-assistant"),
    ("有趣工具", "https://www.ailookme.com/favorites/fun-tools"),
    ("个性化视频", "https://www.ailookme.com/favorites/personalized-videos"),
    ("缩写器", "https://www.ailookme.com/favorites/summarizer"),
    ("故事创作", "https://www.ailookme.com/favorites/storyteller"),
    ("约会", "https://www.ailookme.com/favorites/dating"),
    ("资源", "https://www.ailookme.com/favorites/resources"),
    ("艺术生成", "https://www.ailookme.com/favorites/art-generator"),
]

AIBOT_CATEGORIES = [
    ("AI写作工具", "https://ai-bot.cn/favorites/ai-writing-tools/"),
    ("AI图像工具", "https://ai-bot.cn/favorites/ai-image-tools/"),
    ("AI视频工具", "https://ai-bot.cn/favorites/ai-video-tools/"),
    ("AI办公工具", "https://ai-bot.cn/favorites/ai-office-tools/"),
    ("AI聊天助手", "https://ai-bot.cn/favorites/ai-chatbots/"),
    ("AI智能体", "https://ai-bot.cn/favorites/ai-agent/"),
    ("AI编程工具", "https://ai-bot.cn/favorites/ai-programming-tools/"),
    ("AI设计工具", "https://ai-bot.cn/favorites/ai-design-tools/"),
    ("AI音频工具", "https://ai-bot.cn/favorites/ai-audio-tools/"),
    ("AI搜索引擎", "https://ai-bot.cn/favorites/ai-search-engines/"),
    ("AI开发平台", "https://ai-bot.cn/favorites/ai-frameworks/"),
    ("AI学习网站", "https://ai-bot.cn/favorites/websites-to-learn-ai/"),
    ("AI训练模型", "https://ai-bot.cn/favorites/ai-models/"),
    ("AI内容检测", "https://ai-bot.cn/favorites/ai-content-detection-and-optimization-tools/"),
    ("AI提示指令", "https://ai-bot.cn/favorites/ai-prompt-tools/"),
    ("AI副业工具", "https://ai-bot.cn/favorites/ai-side-hustle-tools/"),
]

# 合并后的分类体系（标准化分类）
CATEGORY_MAP = {
    "AI聊天助手": ["对话AI", "AI聊天助手"],
    "AI写作": ["文案/写作", "通用写作", "写作助手", "文案助手", "改写", "文案生成", "故事创作", "缩写器", "AI写作工具"],
    "AI绘画/图像": ["AI绘画/图像", "图像处理", "图像编辑", "艺术生成", "AI图像工具"],
    "AI视频": ["视频生成", "视频处理", "视频编辑", "个性化视频", "AI视频工具"],
    "AI音频": ["音频/音乐", "音频编辑", "文本转语音", "音频转录", "AI音频工具"],
    "AI编程/开发": ["代码助手", "开发工具", "开发者工具", "SQL助手", "低代码/无代码", "AI编程工具", "AI开发平台"],
    "AI办公/生产力": ["PPT", "生产力", "AI办公工具"],
    "AI设计": ["设计辅助", "Logo生成", "头像生成", "3D", "AI设计工具"],
    "AI提示词": ["AI提示词", "AI提示指令"],
    "AI智能体": ["AI智能体"],
    "AI搜索": ["AI搜索引擎"],
    "AI内容检测": ["AI内容检测"],
    "营销/SEO": ["SEO", "自媒体", "销售", "电子商务", "文案助手"],
    "AI教育/研究": ["教育", "研究", "AI学习网站"],
    "商业/金融": ["人力资源", "金融", "客服", "创业工具"],
    "生活/趣味": ["生活助手", "有趣工具", "约会", "资源"],
    "AI训练模型": ["AI训练模型"],
    "AI副业": ["AI副业工具"],
}

def get_cache_path(url):
    h = hashlib.md5(url.encode()).hexdigest()
    return os.path.join(CACHE_DIR, f"{h}.html")

def fetch_page(url, use_cache=True, delay=1):
    """Fetch a page with caching"""
    cache_path = get_cache_path(url)
    if use_cache and os.path.exists(cache_path):
        with open(cache_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    time.sleep(delay)
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.encoding = resp.apparent_encoding or 'utf-8'
        html = resp.text
        with open(cache_path, 'w', encoding='utf-8') as f:
            f.write(html)
        return html
    except Exception as e:
        print(f"  [ERROR] Failed to fetch {url}: {e}")
        return None

def extract_tools_from_html(html, source, category_name):
    """Extract tools from a OneNav theme page"""
    if not html:
        return []
    
    soup = BeautifulSoup(html, 'lxml')
    tools = []
    
    for card in soup.find_all('div', class_='url-card'):
        a_tag = card.find('a', href=True)
        if not a_tag:
            continue
        
        ext_url = a_tag.get('data-url', '').strip()
        internal_url = a_tag.get('href', '').strip()
        title_attr = a_tag.get('title', '').strip()
        
        if not ext_url or not ext_url.startswith('http'):
            ext_url = internal_url
        
        name = ''
        desc = ''
        icon = ''
        
        strong = card.find('strong')
        if strong:
            name = strong.get_text(strip=True)
        
        p_desc = card.find('p')
        if p_desc:
            desc = p_desc.get_text(strip=True)
        
        if not desc and title_attr and title_attr != name:
            desc = title_attr
        
        img = card.find('img')
        if img:
            icon = img.get('data-src', '') or img.get('src', '')
            if 'favicon.png' in icon:
                data_src = img.get('data-src', '')
                if data_src and 'favicon.png' not in data_src:
                    icon = data_src
        
        if not name or len(name) > 80:
            continue
        
        skip_names = ['首页', 'AI工具箱', '网址提交', 'AI资讯', '登录', '注册', 
                      '关于我们', '联系方式', '广告合作', '留言板', '友情链接',
                      '查看更多', '更多', '更多+']
        if name in skip_names:
            continue
        
        if not ext_url.startswith('http'):
            continue
        
        tools.append({
            'name': name,
            'url': ext_url,
            'icon': icon,
            'desc': desc,
            'source': source,
            'raw_category': category_name,
        })
    
    return tools

def find_next_page(soup, base_url):
    """Find next page URL for pagination"""
    next_link = soup.find('a', class_='next')
    if next_link and next_link.get('href'):
        return urljoin(base_url, next_link['href'])
    # Also check for "下一页" link
    for a in soup.find_all('a', href=True):
        text = a.get_text(strip=True)
        if text in ['下一页', '›', '»', '下页']:
            return urljoin(base_url, a['href'])
    return None

def scrape_category(url, category_name, source, max_pages=10, use_cache=True):
    """Scrape a category with pagination"""
    tools = []
    current_url = url
    page = 1
    
    while current_url and page <= max_pages:
        print(f"  [{source}] Scraping '{category_name}' page {page}: {current_url}")
        html = fetch_page(current_url, use_cache=use_cache)
        if not html:
            break
        
        page_tools = extract_tools_from_html(html, source, category_name)
        if not page_tools:
            break
        
        tools.extend(page_tools)
        print(f"    Found {len(page_tools)} tools (total: {len(tools)})")
        
        soup = BeautifulSoup(html, 'lxml')
        next_url = find_next_page(soup, current_url)
        if next_url == current_url or not next_url:
            break
        
        current_url = next_url
        page += 1
    
    return tools

def normalize_category(raw_cat, source):
    """Map raw category to normalized category"""
    for norm_cat, keywords in CATEGORY_MAP.items():
        for kw in keywords:
            if raw_cat == kw or kw in raw_cat or raw_cat in kw:
                return norm_cat
    return "其他"

def deduplicate_tools(tools):
    """Deduplicate tools by URL domain+name"""
    seen = {}
    for tool in tools:
        url = tool['url'].rstrip('/').split('?')[0].rstrip('/')
        name_lower = tool['name'].lower().replace(' ', '').replace('-', '').replace('_', '')
        key = f"{url}|{name_lower}"
        
        if key not in seen:
            seen[key] = tool
        else:
            existing = seen[key]
            if len(tool.get('desc', '')) > len(existing.get('desc', '')):
                existing['desc'] = tool['desc']
            if tool.get('icon') and 'favicon.png' not in tool['icon']:
                if 'favicon.png' in existing.get('icon', ''):
                    existing['icon'] = tool['icon']
            if existing.get('source') != tool.get('source'):
                existing['source'] = f"{existing['source']},{tool['source']}"
    
    return list(seen.values())

def assign_categories(tools):
    """Assign normalized categories to tools and build category structure"""
    categories = {}
    for cat_name in CATEGORY_MAP.keys():
        categories[cat_name] = []
    categories["其他"] = []
    
    for tool in tools:
        norm_cat = normalize_category(tool['raw_category'], tool['source'])
        if norm_cat not in categories:
            categories[norm_cat] = []
        categories[norm_cat].append(tool)
    
    return categories

def scrape_homepage(source, base_url, use_cache=True):
    """Scrape featured tools from homepage"""
    print(f"\n[{source}] Scraping homepage: {base_url}")
    html = fetch_page(base_url, use_cache=use_cache)
    if not html:
        return []
    return extract_tools_from_html(html, source, "首页推荐")

def parse_args():
    parser = argparse.ArgumentParser(description="Scrape AI tool data from ailookme.com and ai-bot.cn")
    parser.add_argument("--no-cache", action="store_true", help="Ignore local cache and fetch fresh pages")
    parser.add_argument("--max-pages", type=int, default=5, help="Max pages per category (default 5)")
    parser.add_argument("--output", default=None, help="Output JSON path (default: data/tools.json)")
    parser.add_argument("--also-copy", default=None, help="Optional extra path to copy the JSON to (e.g. web/data/tools.json)")
    return parser.parse_args()


def main():
    args = parse_args()
    use_cache = not args.no_cache
    max_pages = args.max_pages
    print("=" * 60)
    print(f"AI导航网站爬虫 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    all_tools = []
    
    # Scrape ailookme homepage
    hp_tools1 = scrape_homepage("ailookme", "https://www.ailookme.com/", use_cache=use_cache)
    all_tools.extend(hp_tools1)
    print(f"  Homepage: {len(hp_tools1)} tools")
    
    # Scrape ailookme categories
    print(f"\n--- Scraping ailookme.com categories ---")
    for cat_name, cat_url in AILOOKME_CATEGORIES:
        tools = scrape_category(cat_url, cat_name, "ailookme", max_pages=max_pages, use_cache=use_cache)
        all_tools.extend(tools)
    
    # Scrape ai-bot homepage
    hp_tools2 = scrape_homepage("aibot", "https://ai-bot.cn/", use_cache=use_cache)
    all_tools.extend(hp_tools2)
    print(f"  Homepage: {len(hp_tools2)} tools")
    
    # Scrape ai-bot categories
    print(f"\n--- Scraping ai-bot.cn categories ---")
    for cat_name, cat_url in AIBOT_CATEGORIES:
        tools = scrape_category(cat_url, cat_name, "aibot", max_pages=max_pages, use_cache=use_cache)
        all_tools.extend(tools)
    
    # Deduplicate
    print(f"\nTotal raw tools: {len(all_tools)}")
    unique_tools = deduplicate_tools(all_tools)
    print(f"After dedup: {len(unique_tools)}")
    
    # Assign categories
    categories = assign_categories(unique_tools)
    
    # Build output
    output = {
        'meta': {
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'total_tools': len(unique_tools),
            'total_categories': len([c for c, t in categories.items() if t]),
            'sources': ['ailookme.com', 'ai-bot.cn'],
        },
        'categories': [],
        'tools': [],
    }
    
    for cat_name, cat_tools in sorted(categories.items(), key=lambda x: -len(x[1])):
        if cat_tools:
            output['categories'].append({
                'id': cat_name.lower().replace('/', '-').replace(' ', '-'),
                'name': cat_name,
                'count': len(cat_tools),
            })
            for tool in cat_tools:
                tool_copy = dict(tool)
                tool_copy['category'] = cat_name
                output['tools'].append(tool_copy)
    
    # Save output
    output_path = args.output or os.path.join(DATA_DIR, 'tools.json')
    out_dir = os.path.dirname(os.path.abspath(output_path))
    os.makedirs(out_dir, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    if args.also_copy:
        copy_dir = os.path.dirname(os.path.abspath(args.also_copy))
        os.makedirs(copy_dir, exist_ok=True)
        shutil.copyfile(output_path, args.also_copy)
        print(f"Copied JSON to {args.also_copy}")

    print(f"\nSaved {len(output['tools'])} tools in {output['meta']['total_categories']} categories to {output_path}")
    print("\nCategory breakdown:")
    for cat in output['categories']:
        print(f"  {cat['name']}: {cat['count']} tools")

if __name__ == '__main__':
    main()
