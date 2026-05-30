# jackssybin 静态博客迁移项目

这个项目把原 `jackssybin.cn` 的 Solo/Bolo 博客迁移为 VuePress 2 静态站点。内容来自 `bolo_260527.sql`，样式参考 `ROOT/skins/bolo-9IPHP`，构建后的静态文件位于 `docs/.vuepress/dist`。

## 一、项目能力

- 使用 VuePress 2 + vuepress-theme-hope 构建静态博客。
- 保留原文章链接，例如 `/articles/2019/07/31/1564568923421.html`。
- 支持首页文章列表、文章页、标签页、归档页、友链页、RSS。
- 支持文章标题和标签的前端搜索。
- 支持白天/黑夜模式切换，并记住浏览器本地偏好。
- 原评论以只读归档方式展示。
- 不再依赖 Tomcat、Solo 后台、JAR 包和动态数据库服务。
- 支持通过 GitHub Actions 自动构建并部署到自己的服务器。

## 二、本地环境要求

本地开发和迁移需要：

- Node.js 22+
- pnpm 10.33.0+
- MySQL 5.7+/8.0+
- Git

本项目默认读取本地 MySQL：

```text
host: localhost
port: 3306
user: root
password: root-1234
database: bolo_migration
```

如需覆盖数据库连接，可以使用环境变量：

```powershell
$env:BOLO_DB_HOST="localhost"
$env:BOLO_DB_PORT="3306"
$env:BOLO_DB_USER="root"
$env:BOLO_DB_PASSWORD="root-1234"
$env:BOLO_DB_NAME="bolo_migration"
```

## 三、初始化数据库

如果本地还没有 `bolo_migration` 数据库，先导入 SQL 备份：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -e "DROP DATABASE IF EXISTS bolo_migration; CREATE DATABASE bolo_migration DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 bolo_migration -e "source D:/code/ai_codex_project/blog_change/bolo_260527.sql"
```

确认数据：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -D bolo_migration -e "SELECT COUNT(*) articles, SUM(articleStatus=0) published FROM b3_solo_article; SELECT COUNT(*) comments FROM b3_solo_comment;"
```

当前迁移结果：

```text
103 篇已发布文章
12 条旧评论
150 个使用中的标签
3 个友情链接
```

## 四、本地使用

安装依赖：

```powershell
pnpm install
```

从 Bolo/Solo 数据库重新生成 VuePress 内容：

```powershell
pnpm migrate
```

本地预览：

```powershell
pnpm dev --port 8080
```

访问：

```text
http://localhost:8080/
```

构建静态站点：

```powershell
pnpm build
```

构建产物目录：

```text
docs/.vuepress/dist
```

常用检查路径：

```text
/
/articles/2025/07/16/1752652246705.html
/articles/2019/07/31/1564568923421.html
/my-github-repos
/tags.html
/archives.html
/links.html
/search.html?keyword=mysql
/rss.xml
```

## 五、日常写文章和版本管理

迁移完成后，日常写作可以直接修改项目里的 Markdown 文件。

推荐流程：

```bash
git pull
# 修改 docs 下的 Markdown 内容
pnpm dev --port 8080
pnpm build
git status
git add .
git commit -m "update blog content"
git push
```

如果已经配置好自动部署，`git push` 到 `main` 分支后，GitHub Actions 会自动构建并同步到服务器。

## 六、后续如何新增文章

当前项目有两类内容：

- 旧文章：由 `bolo_260527.sql` 迁移生成，页面内容主要存放在 `docs/.vuepress/page-data.ts`，`docs/articles/.../*.md` 只是生成后的页面入口。
- 新文章：直接写到 `content/articles`，迁移脚本会把它们合并进首页、标签、归档、搜索和 RSS，并生成到 `docs/articles`。

### 1. 推荐的新文章存放位置

推荐用脚本创建文章：

```bash
pnpm new-post "使用 GitHub Actions 自动部署 VuePress 到 Nginx"
```

脚本会自动生成当天目录、文件名、`title`、`permalink`、`description` 和 `tags` 模板。标题是中文时，文件名会使用 `post-时间戳.md`，也可以临时指定英文 slug：

```bash
POST_SLUG=github-actions-nginx-deploy pnpm new-post "使用 GitHub Actions 自动部署 VuePress 到 Nginx"
```

PowerShell 使用：

```powershell
$env:POST_SLUG="github-actions-nginx-deploy"; pnpm new-post "使用 GitHub Actions 自动部署 VuePress 到 Nginx"; Remove-Item Env:POST_SLUG
```

建议继续使用原博客的文章路径规则：

```text
content/articles/年/月/日/文章标识.md
```

例如新增一篇 2026 年 05 月 28 日的文章：

```text
content/articles/2026/05/28/github-actions-nginx-deploy.md
```

对应的线上访问地址可以设置为：

```text
https://jackssybin.cn/articles/2026/05/28/github-actions-nginx-deploy.html
```

### 2. 新文章 Markdown 模板

新建文件：

```text
content/articles/2026/05/28/github-actions-nginx-deploy.md
```

写入：

```markdown
---
title: "使用 GitHub Actions 自动部署 VuePress 到 Nginx"
permalink: "/articles/2026/05/28/github-actions-nginx-deploy.html"
description: "本文介绍如何使用 GitHub Actions 把 VuePress 静态博客自动部署到自己的 Nginx 服务器。"
tags: ["VuePress", "GitHub Actions", "Nginx"]
pageClass: solo-page
sidebar: false
breadcrumb: false
pageInfo: false
contributors: false
lastUpdated: false
comment: false
---

# 使用 GitHub Actions 自动部署 VuePress 到 Nginx

这里写文章摘要或开头。

## 一、背景

这里写正文。

## 二、操作步骤

这里写正文。

## 三、总结

这里写正文。
```

其中：

- `title` 是浏览器标题和页面标题。
- `permalink` 是最终访问路径，建议保持 `/articles/年/月/日/xxx.html`。
- `description` 会用于 SEO 摘要、搜索结果摘要和 RSS 描述；如果留空，迁移脚本会从正文自动截取。
- `tags` 会用于标签页、搜索权重和 SEO keywords。
- `pageClass: solo-page` 会复用当前迁移站的 Solo 风格样式。
- 正文部分就是普通 Markdown，可以写标题、代码块、表格、图片等。

### 3. 新文章会在哪里展示

新建 Markdown 后，只要执行 `pnpm build` 成功，该文章就会生成独立页面，并可以通过 `permalink` 访问。

例如：

```text
content/articles/2026/05/28/github-actions-nginx-deploy.md
```

会生成：

```text
/articles/2026/05/28/github-actions-nginx-deploy.html
```

执行 `pnpm migrate` 后，它会同时出现在：

- 首页文章列表，按文章日期排序。
- `/archives.html` 和对应年月归档页。
- `/tags.html` 和对应标签页。
- `/search.html` 的搜索结果，支持匹配标题、标签、摘要和正文。
- `/rss.xml`。
- 右侧栏文章总数统计。

### 4. 新文章发布流程

本地新增文章后，按下面流程发布：

```bash
git pull

pnpm new-post "文章标题"
# 或修改 content/articles/年/月/日/xxx.md

pnpm migrate
pnpm dev --port 8080
pnpm build

git status
git add content docs
git commit -m "add github actions nginx deploy article"
git push
```

推送到 GitHub 后，如果服务器自动部署已经配置完成，GitHub Actions 会自动执行：

```text
pnpm install
pnpm build
rsync docs/.vuepress/dist/ 到服务器
Nginx 对外提供新文章访问
```

### 5. 修改旧文章的建议

旧文章是迁移脚本生成的，文章正文不直接写在 `docs/articles/.../*.md` 里，而是在：

```text
docs/.vuepress/page-data.ts
```

因此不建议直接手动改旧文章生成文件。更稳的方式是：

1. 在原始数据库或迁移源中修改文章内容。
2. 执行 `pnpm migrate` 重新生成站点内容。
3. 执行 `pnpm build` 验证。
4. 提交并推送。

如果只是修正少量错别字，也可以直接改 `docs/.vuepress/page-data.ts`，但这个文件很大，且下次执行 `pnpm migrate` 会被重新生成覆盖。

## 七、自动部署整体流程

本项目使用 GitHub Actions 部署到自己的服务器，不使用 GitHub Pages。

整体流程如下：

```text
本地修改 Markdown
-> git commit
-> git push 到 GitHub main 分支
-> GitHub Actions 自动执行 pnpm install 和 pnpm build
-> 通过 SSH/rsync 把 docs/.vuepress/dist/ 上传到服务器
-> Nginx 从服务器目录对外提供访问
```

工作流文件：

```text
.github/workflows/deploy-to-server.yml
```

该工作流会在两种情况下执行：

- 推送到 `main` 分支时自动执行。
- 在 GitHub Actions 页面手动点击 `Run workflow` 执行。

## 八、新服务器从零搭建

以下以 Ubuntu/Debian 服务器为例，假设网站目录为：

```text
/var/www/jackssybin
```

域名为：

```text
jackssybin.cn
www.jackssybin.cn
```

### 1. 登录服务器

```bash
ssh root@你的服务器IP
```

如果不是 root 用户，请使用你的实际 SSH 用户。

### 2. 安装 Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

检查 Nginx 状态：

```bash
sudo systemctl status nginx
```

### 3. 创建网站目录

```bash
sudo mkdir -p /var/www/jackssybin
sudo chown -R $USER:$USER /var/www/jackssybin
```

如果 GitHub Actions 使用的 SSH 用户不是当前用户，请把目录授权给实际部署用户，例如：

```bash
sudo chown -R deploy:deploy /var/www/jackssybin
```

### 4. 准备部署用 SSH 密钥

建议单独创建一个部署用户和一把部署密钥。

在本地电脑生成 SSH key：

```bash
ssh-keygen -t ed25519 -C "github-actions-jackssybin" -f ~/.ssh/jackssybin_deploy
```

会生成两个文件：

```text
~/.ssh/jackssybin_deploy       私钥，放到 GitHub Secrets
~/.ssh/jackssybin_deploy.pub   公钥，放到服务器 authorized_keys
```

把公钥添加到服务器：

```bash
ssh-copy-id -i ~/.ssh/jackssybin_deploy.pub root@你的服务器IP
```

如果服务器没有 `ssh-copy-id`，可以手动追加：

```bash
cat ~/.ssh/jackssybin_deploy.pub
```

复制输出内容后，在服务器执行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "这里粘贴公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

测试本地是否能免密登录：

```bash
ssh -i ~/.ssh/jackssybin_deploy root@你的服务器IP
```

### 5. 配置 Nginx

项目已经提供 Nginx 模板：

```text
deploy/nginx-jackssybin.conf
```

服务器上创建配置文件：

```bash
sudo nano /etc/nginx/conf.d/jackssybin.conf
```

填入：

```nginx
server {
    listen 80;
    server_name jackssybin.cn www.jackssybin.cn;

    root /var/www/jackssybin;
    index index.html;

    access_log /var/log/nginx/jackssybin.access.log;
    error_log /var/log/nginx/jackssybin.error.log;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public";
        try_files $uri =404;
    }
}
```

检查并重载 Nginx：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. 配置域名解析

在域名服务商后台添加 DNS 解析：

```text
A 记录
主机记录: @
记录值: 你的服务器公网 IP

A 记录
主机记录: www
记录值: 你的服务器公网 IP
```

解析生效后访问：

```text
http://jackssybin.cn
```

## 九、配置 GitHub Actions 自动部署

进入 GitHub 仓库：

```text
https://github.com/jackssybin/jackssybinIndex
```

打开：

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

添加以下 Secrets：

```text
SERVER_HOST      服务器 IP 或域名，例如 1.2.3.4
SERVER_PORT      SSH 端口，通常是 22
SERVER_USER      SSH 用户，例如 root 或 deploy
SERVER_SSH_KEY   SSH 私钥内容
SERVER_PATH      服务器网站目录，例如 /var/www/jackssybin
```

`SERVER_SSH_KEY` 要填写私钥完整内容，也就是本地这个文件的内容：

```bash
cat ~/.ssh/jackssybin_deploy
```

私钥内容通常长这样：

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

注意：不要填写 `.pub` 公钥，GitHub Secrets 里需要的是私钥。

配置完成后，推送一次代码即可触发部署：

```bash
git add .
git commit -m "update blog"
git push
```

也可以手动触发：

```text
GitHub 仓库 -> Actions -> Deploy to Server -> Run workflow
```

## 十、首次部署检查

部署完成后，在 GitHub Actions 页面确认任务是绿色成功状态。

然后登录服务器检查文件：

```bash
ls -lah /var/www/jackssybin
```

应该能看到：

```text
index.html
assets/
articles/
tags.html
archives.html
links.html
rss.xml
```

检查 Nginx：

```bash
sudo nginx -t
sudo systemctl status nginx
```

浏览器访问：

```text
http://jackssybin.cn
http://jackssybin.cn/articles/2019/07/31/1564568923421.html
http://jackssybin.cn/search.html?keyword=mysql
```

## 十一、配置 HTTPS

建议上线后使用 Certbot 配置免费 HTTPS 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d jackssybin.cn -d www.jackssybin.cn
```

按提示输入邮箱并确认，Certbot 会自动修改 Nginx 配置并启用 HTTPS。

检查证书自动续期：

```bash
sudo certbot renew --dry-run
```

## 十二、常见问题

### 1. GitHub Actions 连接服务器失败

检查：

- `SERVER_HOST` 是否正确。
- `SERVER_PORT` 是否正确。
- `SERVER_USER` 是否能 SSH 登录。
- `SERVER_SSH_KEY` 是否填写的是私钥完整内容。
- 服务器防火墙和云厂商安全组是否放行 SSH 端口。

本地可以先测试：

```bash
ssh -i ~/.ssh/jackssybin_deploy root@你的服务器IP
```

### 2. GitHub Actions 提示没有权限写入目录

说明 `SERVER_USER` 对 `SERVER_PATH` 没有写入权限。

在服务器执行：

```bash
sudo chown -R SERVER_USER:SERVER_USER /var/www/jackssybin
```

把 `SERVER_USER` 替换成实际用户，例如：

```bash
sudo chown -R deploy:deploy /var/www/jackssybin
```

### 3. 首页能打开，文章链接 404

检查 Nginx 是否包含：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

同时检查服务器目录中是否存在对应 HTML 文件：

```bash
ls /var/www/jackssybin/articles/2019/07/31/
```

### 4. 修改 Markdown 后网站没有变化

检查：

- 是否已经 `git push` 到 `main` 分支。
- GitHub Actions 是否执行成功。
- 浏览器是否缓存了旧页面。
- 服务器 `/var/www/jackssybin` 的文件时间是否更新。

### 5. 搜索没有结果

搜索索引来自迁移脚本生成的：

```text
docs/.vuepress/search-index.ts
```

如果新增或批量调整文章后搜索不正确，重新执行：

```bash
pnpm migrate
pnpm build
```

然后提交并推送。

## 十三、项目结构

```text
.
├── bolo_260527.sql              # 原博客数据库备份，本地使用，不提交
├── ROOT/                         # 原 Tomcat/Solo 项目，本地参考，不提交
├── scripts/
│   └── migrate-from-bolo.mjs     # SQL/MySQL -> VuePress 页面迁移脚本
├── content/
│   └── articles/                  # 后续手写 Markdown 文章源目录
├── deploy/
│   └── nginx-jackssybin.conf     # Nginx 配置模板
├── docs/
│   ├── .vuepress/
│   │   ├── config.ts             # VuePress 配置
│   │   ├── theme.ts              # vuepress-theme-hope 配置
│   │   ├── client.ts             # 注册自定义组件
│   │   ├── components/           # 页面渲染和搜索组件
│   │   ├── styles/index.scss     # 迁移后的 Solo 风格样式
│   │   └── public/               # 静态资源
│   ├── index.md                  # 首页
│   ├── articles/                 # 旧文章路径
│   ├── tags/                     # 标签页
│   └── archives/                 # 归档页
├── .github/workflows/
│   └── deploy-to-server.yml      # 自动部署到服务器
├── package.json
└── pnpm-lock.yaml
```

## 十四、迁移说明

- 仅迁移 `articleStatus = 0` 的已发布文章。
- 原 `articlePermalink` 会尽量保持，方便旧链接继续访问。
- 旧评论只读展示，不支持新评论提交。
- 不迁移 Solo 后台、登录、动态实时交互和 Tomcat/JAR 运行时。
- 图片默认保留原远程地址；`ROOT/images` 中的公共资源已复制到 VuePress public 目录。
## 内容更新机制（推荐流程）

### 实时新闻模块

站点新增 `/news.html` 实时新闻页面，数据来源为 [orz-ai/hot_news](https://github.com/orz-ai/hot_news) 的公开 API。默认抓取百度热搜、微博、知乎、掘金、GitHub Trending、Hacker News、少数派和新浪财经。

本地手动更新：

```powershell
pnpm fetch-hot-news
pnpm update-content
```

也可以通过环境变量调整来源：

```powershell
$env:HOT_NEWS_PLATFORMS="zhihu,juejin,github,hackernews"
pnpm update-content
```

GitHub Actions 已配置 `0 * * * *` 定时任务，会每小时执行一次 `pnpm update-content`，重新生成新闻数据、站点页面并部署到服务器。服务器自建定时任务时，也可以每小时执行同一条命令。

### 新增普通文章

```powershell
pnpm new-post "文章标题"
```

文章会创建到 `content/articles/年/月/日/`，重新生成后会自动进入：

- 首页最新文章
- 首页最近更新
- 对应专题和标签页
- 归档页
- 搜索索引
- RSS

推荐发布命令：

```powershell
pnpm update-content
git status
git add content docs scripts package.json README.md
git commit -m "update site content"
git push
```

其中 `pnpm update-content` 会依次执行：

```powershell
pnpm migrate
pnpm build
```

### 新增或修改教程

教程源文件统一放在：

```text
content/tutorials/mysql
content/tutorials/springboot4
content/tutorials/netty
```

以后新增教程系列时，建议继续使用：

```text
content/tutorials/教程标识/
```

并在 `scripts/migrate-from-bolo.mjs` 的 `tutorialSeriesDefinitions` 中增加系列配置，包括标题、适合人群、前置要求、学习产出、实战项目和面试重点。执行 `pnpm update-content` 后，教程会同步进入教程中心、首页推荐、搜索索引和站点构建产物。

### 内容入口说明

首页现在不再只是文章列表，而是站点内容入口，包含：

- 最新文章
- 推荐教程
- 热门专题
- 学习路线
- 最近更新

搜索页支持按“全部 / 教程 / 博客 / 导航”筛选，搜索结果会显示所属专题或教程系列，并对关键词做高亮。
## 近期运营动作

### 提交 sitemap 到搜索引擎

站点构建后会生成：

```text
https://jackssybin.cn/sitemap.xml
https://jackssybin.cn/robots.txt
```

提交步骤：

- 百度搜索资源平台：登录后添加 `jackssybin.cn`，完成站点验证，在“资源提交 / Sitemap”中提交 `https://jackssybin.cn/sitemap.xml`。
- Google Search Console：添加域名资源或网址前缀资源，完成 DNS 或 HTML 验证，在“Sitemaps”中提交 `https://jackssybin.cn/sitemap.xml`。
- 提交后重点观察：收录量、抓取异常、404 页面、核心教程页是否被索引。

### GoAccess 每日报表

服务器安装：

```bash
sudo apt update
sudo apt install goaccess apache2-utils -y
```

生成日报：

```bash
sudo mkdir -p /var/www/jackssybin/admin
sudo goaccess /var/log/nginx/access.log \
  --log-format=COMBINED \
  -o /var/www/jackssybin/admin/report.html
```

每天凌晨自动生成：

```bash
crontab -e
```

加入：

```bash
5 0 * * * goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/jackssybin/admin/report.html
```

建议用 Nginx basic auth 保护 `/admin/report.html`，避免公开访问数据。每周重点看：访问最多页面、404、搜索引擎爬虫、来源站点、移动端比例，并据此继续优化 3-5 篇文章。

如果 `https://jackssybin.cn/admin/report.html` 返回 404，优先检查报表文件是否还在：

```bash
ls -lah /var/www/jackssybin/admin/report.html
```

本项目的 GitHub Actions 部署使用 `rsync --delete`，已在 `.github/workflows/deploy-to-server.yml` 中排除 `admin/` 目录，避免自动部署删除服务器上由 GoAccess 生成的报表。修改部署脚本后，需要重新生成一次报表：

```bash
sudo mkdir -p /var/www/jackssybin/admin
sudo goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/jackssybin/admin/report.html
sudo chown -R www-data:www-data /var/www/jackssybin/admin
```

如果页面能打开但显示 `No authentication provided.`，这通常不是 Nginx Basic Auth 报错，而是 GoAccess HTML 内置的实时 WebSocket/JWT 提示。本站只使用每日静态报表，不需要开启实时 WebSocket，可以在生成后替换这句提示：

```bash
sudo sed -i "s/No authentication provided\\./静态报表已加载。/g" /var/www/jackssybin/admin/report.html
```

对应的 crontab 可以写成：

```bash
5 0 * * * goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/jackssybin/admin/report.html && sed -i "s/No authentication provided\\./静态报表已加载。/g" /var/www/jackssybin/admin/report.html
```

### 内容增长节奏

- 每周维护 `/weekly.html`：自动汇总实时热点、核心文章和教程入口。
- 每周基于 GoAccess 报表挑选 3-5 篇有访问或有潜力的旧文，补充摘要、导读、相关推荐和更清晰标题。
- 每月重点打磨 1 个教程系列首页，例如 MySQL、Spring Boot 4、Netty。
