---
url: "/articles/2026/08/01/auto-redbook-skills-xiaohongshu-ai.html"
title: "Auto-Redbook-Skills：AI自动生成小红书笔记卡片，支持自动发布"
date: 2026-08-01T00:00:00+08:00
draft: false
tags: ["AI", "开源", "小红书", "工具"]
categories: ["开源推荐"]
---

# Auto-Redbook-Skills：AI自动生成小红书笔记卡片，支持自动发布

做小红书内容创作的朋友一定有这个痛点：AI把文案写好了，但是排版做图太折腾。找模板、调尺寸、改配色，一篇文章内容五分钟，作图两小时。

今天给大家推荐一个刚重构完的开源工具 **[Auto-Redbook-Skills](https://github.com/comeonzhj/Auto-Redbook-Skills)**，正好解决这个痛点：**Markdown 写好内容，一键生成符合小红书比例的精美卡片，支持 8 种主题风格，还能自动发布**。

## 核心功能

- **8 套主题皮肤**：默认简约、几何风、新粗野主义、植物风、商务风、复古风、终端风、手绘风，覆盖各种场景
- **4 种分页模式**：手动分页、自动缩放、自动分页、动态高度，解决内容溢出/留白问题
- **Python/Node.js 双版本**：看你习惯用哪个
- **支持自动发布**：配置 Cookie 后一键发布到小红书
- **Claude Code 插件支持**：一键安装，Agent 直接帮你搞定

## 快速开始

###  Claude Code 插件安装（推荐）

```bash
# 添加 marketplace
/plugin marketplace add comeonzhj/Auto-Redbook-Skills

# 安装插件
/plugin install auto-redbook-skills@comeonzhj-Auto-Redbook-Skills
```

安装完成后 `/reload-plugins` 即可使用。

### 手动安装

```bash
git clone https://github.com/comeonzhj/Auto-Redbook-Skills.git
cd Auto-Redbook-Skills
pip install -r requirements.txt
playwright install chromium
```

### 生成卡片

```bash
# 最简单用法
python scripts/render_xhs.py demos/content.md

# 自动分页 + 切换主题（推荐）
python scripts/render_xhs.py demos/content.md -t playful-geometric -m auto-split
```

输出：`cover.png` + `card_1.png` `card_2.png` ... 直接拿去发布就行。

### 自动发布

```bash
cp env.example.txt .env
# 编辑 .env，填入小红书 Cookie

python scripts/publish_xhs.py \
  --title "笔记标题" \
  --desc "简介" \
  --images cover.png card_1.png card_2.png
```

## 项目结构

```
Auto-Redbook-Skills/
├── assets/themes/        # 8套主题样式
├── demos/                # 示例内容
└── scripts/
    ├── render_xhs.py     # Python 渲染脚本
    └── publish_xhs.py   # 发布脚本
```

## 注意事项

⚠️ 使用前请知悉小红书官方关于打击AI托管运营账号的公告，请遵守平台规则。

- Cookie 注意保密，不要提交到 Git
- 避免高频发布，防止触发风控
- 默认尺寸 1080×1440 就是小红书推荐比例

## 总结

这个工具把"AI写内容 → 生成卡片 → 发布"整个流程打通了，对于经常产出小红书内容的朋友来说确实能节省不少时间。项目完全开源免费，MIT 许可证，定制主题也很方便。

GitHub地址：**[comeonzhj/Auto-Redbook-Skills](https://github.com/comeonzhj/Auto-Redbook-Skills)**

如果你也在做小红书，不妨试试。
