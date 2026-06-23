#!/usr/bin/env python3
"""Re-categorize tools that fell into 其他 using name/desc keywords."""
import json
import os
import sys

DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'tools.json')

KEYWORD_CATEGORIES = {
    "AI聊天助手": ["chat", "对话", "聊天", "gpt", "claude", "gemini", "llm", "豆包", "deepseek", "kimi", "通义", "文心", "智谱", "星火", "问答助手", "智能助手"],
    "AI写作": ["写作", "文案", "论文", "改写", "小说", "写文章", "作文", "writer", "writing", "copywriting", "essay", "博客", "文章生成", "文本生成", "绘本", "续写"],
    "AI绘画/图像": ["图像", "绘画", "画图", "图片", "绘图", "生图", "image", "painting", "diffusion", "midjourney", "头像", "图生图", "文生图", "海报", "修图", "美图", "设计图", "logo"],
    "AI视频": ["视频", "video", "数字人", "动画", "短片", "剪辑", "影片", "sora", "runway", "pika", "可灵", "短剧", "漫剧"],
    "AI音频": ["音频", "配音", "语音", "音乐", "声音", "tts", "audio", "music", "voice", "变声", "降噪", "音效", "播客", "歌曲"],
    "AI编程/开发": ["代码", "编程", "开发", "code", "coding", "copilot", "ide", "程序员", "trae", "cursor", "前端", "全栈", "建站", "app开发", "小程序", "无代码", "低代码"],
    "AI办公/生产力": ["ppt", "办公", "excel", "word", "文档", "笔记", "会议", "效率", "office", "pdf", "简历", "表格", "幻灯片", "演示", "总结", "翻译", "思维导图"],
    "AI设计": ["设计", "ui", "平面", "3d", "design", "建模", "渲染", "品牌", "素材", "图标", "电商神器"],
    "AI提示词": ["prompt", "提示词", "提示指令", "咒语"],
    "AI智能体": ["智能体", "agent", "工作流", "workflow", "自动化", "多智能体", "agentic"],
    "AI搜索": ["搜索", "search engine", "搜索引擎", "学术检索", "检索"],
    "AI内容检测": ["ai检测", "查重", "降重", "内容检测", "原创检测"],
    "营销/SEO": ["营销", "seo", "推广", "运营", "自媒体", "社媒", "电商", "marketing", "广告", "带货", "选品"],
    "AI教育/研究": ["教育", "学习", "课程", "教学", "辅导", "education", "学术", "科研"],
    "商业/金融": ["金融", "财务", "人力资源", "客服", "创业", "法律", "招聘", "投资", "股票"],
    "AI训练模型": ["大模型", "训练", "模型平台", "maas", "huggingface", "模型库", "模型集市"],
    "AI副业": ["副业", "赚钱", "兼职"],
    "生活/趣味": ["约会", "恋爱", "娱乐", "游戏", "美食", "旅行", "占卜", "星座"],
}

def recategorize(tool):
    current = tool.get('category', '')
    if current not in ('其他', '首页推荐', ''):
        return current
    text = (tool.get('name', '') + ' ' + tool.get('desc', '')).lower()
    for cat, keywords in KEYWORD_CATEGORIES.items():
        for kw in keywords:
            if kw.lower() in text:
                return cat
    return '其他'

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else DATA
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for tool in data['tools']:
        tool['category'] = recategorize(tool)

    new_cats = {}
    for tool in data['tools']:
        new_cats[tool['category']] = new_cats.get(tool['category'], 0) + 1

    # Order: put '其他' last
    ordered = sorted(new_cats.items(), key=lambda x: (x[0] == '其他', -x[1]))
    data['categories'] = [
        {'id': k.lower().replace('/', '-').replace(' ', '-'), 'name': k, 'count': v}
        for k, v in ordered
    ]
    data['meta']['total_categories'] = len(new_cats)
    data['meta']['total_tools'] = len(data['tools'])

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Re-categorized:")
    for cat in data['categories']:
        print(f"  {cat['name']}: {cat['count']}")

if __name__ == '__main__':
    main()
