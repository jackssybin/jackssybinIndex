# jackssybin 静态博客迁移项目

这个项目把原 `jackssybin.cn` 的 Solo/Bolo 博客迁移为 VuePress 静态站点。内容来自 `bolo_260527.sql`，样式参考 `ROOT/skins/bolo-9IPHP`，生成后的静态文件在 `docs/.vuepress/dist`。

## 环境要求

- Node.js 22+
- pnpm 10.33.0+
- MySQL 5.7+/8.0+

本项目默认使用本地 MySQL：

```text
host: localhost
port: 3306
user: root
password: root-1234
database: bolo_migration
```

如需临时覆盖数据库连接，可以使用环境变量：

```powershell
$env:BOLO_DB_HOST="localhost"
$env:BOLO_DB_PORT="3306"
$env:BOLO_DB_USER="root"
$env:BOLO_DB_PASSWORD="root-1234"
$env:BOLO_DB_NAME="bolo_migration"
```

## 初始化数据库

如果本地还没有 `bolo_migration` 库，先导入 SQL 备份：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -e "DROP DATABASE IF EXISTS bolo_migration; CREATE DATABASE bolo_migration DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 bolo_migration -e "source D:/code/ai_codex_project/blog_change/bolo_260527.sql"
```

确认数据：

```powershell
mysql -hlocalhost -P3306 -uroot -proot-1234 --default-character-set=utf8mb4 -D bolo_migration -e "SELECT COUNT(*) articles, SUM(articleStatus=0) published FROM b3_solo_article; SELECT COUNT(*) comments FROM b3_solo_comment;"
```

当前迁移结果应为：

```text
103 篇已发布文章
12 条旧评论
150 个使用中的标签
3 个友情链接
```

## 安装依赖

```powershell
pnpm install
```

安装时如果出现 `INVALID_ANNOTATION`、`chunk larger than 1024 kB` 或 `sass` bin 的 warning，一般不影响本项目构建。

## 生成站点内容

从 MySQL 读取 Solo/Bolo 数据并生成 VuePress 页面：

```powershell
pnpm migrate
```

迁移脚本位置：

```text
scripts/migrate-from-bolo.mjs
```

脚本会重新生成 `docs` 下的内容页，保留 `docs/.vuepress` 配置目录。

生成摘要文件：

```text
docs/.vuepress/public/migration-summary.json
```

## 本地预览

```powershell
pnpm dev --port 8080
```

访问：

```text
http://localhost:8080/
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
/rss.xml
```

## 构建静态文件

```powershell
pnpm build
```

构建产物目录：

```text
docs/.vuepress/dist
```

构建完成后，把这个目录部署到服务器的 Nginx 静态目录即可。

## 部署到自己的服务器

推荐流程：

```text
本地修改 Markdown
-> git commit
-> git push 到 GitHub main 分支
-> GitHub Actions 自动 pnpm build
-> 通过 SSH 把 docs/.vuepress/dist/ 同步到服务器
-> Nginx 对外提供访问
```

本项目已经提供 GitHub Actions 工作流：

```text
.github/workflows/deploy-to-server.yml
```

你需要在 GitHub 仓库中配置这些 Secrets：

```text
SERVER_HOST      服务器 IP 或域名
SERVER_PORT      SSH 端口，通常是 22
SERVER_USER      SSH 用户，例如 root 或 deploy
SERVER_SSH_KEY   SSH 私钥内容
SERVER_PATH      服务器网站目录，例如 /var/www/jackssybin
```

在服务器上创建目录：

```bash
sudo mkdir -p /var/www/jackssybin
sudo chown -R $USER:$USER /var/www/jackssybin
```

如果 GitHub Actions 使用的 SSH 用户不是 root，要确保该用户有写入 `SERVER_PATH` 的权限。

Nginx 配置模板在：

```text
deploy/nginx-jackssybin.conf
```

可以复制到服务器：

```bash
sudo cp deploy/nginx-jackssybin.conf /etc/nginx/conf.d/jackssybin.conf
sudo nginx -t
sudo systemctl reload nginx
```

模板默认网站目录是：

```text
/var/www/jackssybin
```

如果你在 GitHub Secrets 里设置的 `SERVER_PATH` 不是这个路径，需要同步修改 Nginx 配置里的 `root`。

## 其他平台部署

如果部署到 Vercel、Render、Netlify 或 Cloudflare Pages，可以使用：

```text
Build Command: pnpm build
Publish Directory: docs/.vuepress/dist
Node.js Version: 22
```

如果部署环境没有提前生成内容，构建命令可改为：

```text
pnpm install --frozen-lockfile && pnpm migrate && pnpm build
```

## 项目结构

```text
.
├─ bolo_260527.sql              # 原博客数据库备份
├─ ROOT/                         # 原 Tomcat/Solo 项目，仅作样式和资源参考
├─ scripts/
│  └─ migrate-from-bolo.mjs      # SQL -> VuePress 页面迁移脚本
├─ docs/
│  ├─ .vuepress/
│  │  ├─ config.ts               # VuePress 配置
│  │  ├─ theme.ts                # vuepress-theme-hope 配置
│  │  ├─ client.ts               # 注册 SoloPage 组件
│  │  ├─ components/SoloPage.vue # 渲染迁移后的页面 HTML
│  │  ├─ styles/index.scss       # 覆盖 Hope 默认样式并复刻 Solo 布局
│  │  └─ public/                 # 原皮肤 CSS、字体、图片、RSS 等静态资源
│  ├─ index.md                   # 迁移生成：首页
│  ├─ articles/                  # 迁移生成：旧文章路径
│  ├─ tags/                      # 迁移生成：标签页
│  └─ archives/                  # 迁移生成：归档页
├─ package.json
└─ pnpm-lock.yaml
```

## 迁移说明

- 仅迁移 `articleStatus = 0` 的已发布文章。
- 原 `articlePermalink` 会尽量保持，例如 `/articles/2019/07/31/1564568923421.html`。
- 旧评论以只读归档方式展示，不支持新评论提交。
- 不迁移 Solo 后台、登录、动态实时交互和 Tomcat/JAR 运行时。
- 图片默认保留原远程地址；`ROOT/images` 中的公共资源已复制到 `docs/.vuepress/public/images`。
