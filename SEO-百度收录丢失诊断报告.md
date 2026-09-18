# jackssybin.cn 百度收录丢失诊断报告

- 诊断时间：2026-09-18
- 诊断对象：https://jackssybin.cn
- 站点形式：Hugo 静态站 + nginx（阿里云北京，47.94.12.12）
- 改版路径：Solo/Bolo 动态站（Tomcat+MySQL）→ VuePress → Hugo 静态站（当前）

---

## 一、结论速览

**网站本身是健康的，问题出在「改版后遗留的 URL 处理策略」上。**

百度并不认为这个网站挂了，它认为这个网站**大量 URL 抓不到东西**：要么 403，要么 301 跳到另一个被禁止抓取的页面，要么返回和首页一模一样的重复内容。百度对这种信号的响应比 Google 激进得多，于是逐步清空了索引。

已确认的收录状态（第三方工具，非百度官方）：

| 来源 | 数据 |
|---|---|
| 爱站网 | 百度收录 0，且 2026-09-11 ~ 09-18 连续为 0 |
| 站长之家 | 百度权重 0，PC 端预估流量 0 |
| 站长之家 | 必应权重 1（必应仍有收录） |
| 实测 | Google / 必应 可正常搜到 |

> 说明：第三方工具的收录数据可能有误差，权威数字以百度站长平台「索引量」为准。但「百度 0、必应 1」的对比与你的观察一致。

---

## 二、已验证的事实（均为实测，非推测）

### ✅ 健康项：这些都没问题，不用改

| 检查项 | 实测结果 |
|---|---|
| 首页 HTML | 静态渲染完整，42,849 字节，非 JS 空壳 |
| 百度蜘蛛 UA 抓取 | 返回 200，内容与普通浏览器完全一致（无 UA 屏蔽 / cloaking） |
| `http://` → `https://` | 301 正常 |
| `www.` → 非 www | 301 正常 |
| `robots.txt` | 可正常访问，无全站 Disallow |
| `sitemap.xml` | 376 条 URL，**全部返回 200，零死链** |
| 文章页 `meta robots` | 无 noindex，可正常收录 |
| 老教程 URL 301 | 35 条中文编码 URL → ASCII slug，301 正常 |
| 老文章 URL | `/articles/2019/07/31/1564568923421.html` 格式保留，现仍 200 |
| ICP 备案号 | 页脚展示「京ICP备17039180号」 |
| 百度统计 / 自动推送 | 代码已埋（hm.js + push.js） |

### ❌ 问题项：百度收录丢失的直接原因

#### 问题 A（最致命）：标签页 301 跳到了被 robots 禁止的页面

```
百度抓取：/tags/Linux.html          （老站标签页，曾经被收录）
服务器返回：301 → /search.html?keyword=Linux
robots.txt：Disallow: /search   ← 目标被禁止抓取
```

**实测证据：**
```
$ curl -A "Baiduspider" https://jackssybin.cn/tags/Linux.html
301 -> https://jackssybin.cn/search.html?keyword=Linux
```

百度跟随 301 后，发现落地页在 robots.txt 里被禁止抓取。百度的处理方式是：**把原 URL 从索引中移除，且不传递权重**。老站（Solo/Bolo）的 `/tags/xxx` 是重要收录入口，这一条几乎清空了标签页的收录。

这是「改版后百度收录归零」最直接的机制。

#### 问题 B：归档页 301 → 403

```
百度抓取：/archives
服务器返回：301 → /archives/
再抓：403 Forbidden
```

**实测证据：**
```
$ curl -A "Baiduspider" https://jackssybin.cn/archives
301 -> https://jackssybin.cn/archives/

$ curl -A "Baiduspider" -D - https://jackssybin.cn/archives/
HTTP/1.1 403 Forbidden
```

#### 问题 C：一大批目录返回 403（本地是空目录）

实测 403 的路径：

| 路径 | 状态 | 原因 |
|---|---|---|
| `/tags/` | 403 | 本地 `public/tags/` 是空目录 |
| `/archives/` | 403 | 本地 `public/archives/` 是空目录 |
| `/page/` | 403 | 本地 `public/page/` 是空目录 |
| `/nav/` | 403 | 本地 `public/nav/` 是空目录 |
| `/topics/` | 403 | 本地 `public/topics/` 是空目录 |
| `/mysql/` | 403 | 有子目录但无 `index.html` |
| `/netty/` | 403 | 有子目录但无 `index.html` |
| `/linux/` | 403 | 有子目录但无 `index.html` |
| `/springboot4/` | 403 | 有子目录但无 `index.html` |

原因：Hugo 因为 `disableKinds = ["taxonomy","term"]` 不生成这些页面内容，但**空目录被部署到了服务器**；nginx 未开 `autoindex`，访问无 index 的目录就返回 403。

**为什么这一条对百度伤害大：** 百度把 403 判定为「抓取失败」，403 比例过高会削减整站的抓取配额；Google 则把 403 视为「暂时不可用」，保留索引并稍后重试。**这是 Google 与百度表现分化的核心原因之一。**

#### 问题 D：robots.txt 屏蔽的目录，恰好是改版前的收录主力

当前线上 `robots.txt`：

```
User-agent: *
Allow: /
Disallow: /search.html
Disallow: /search
Disallow: /tags/
Disallow: /tags.html
Disallow: /page/
Disallow: /admin/
Disallow: /search-index.json
Disallow: /news.html
Disallow: /weekly.html
Disallow: /topics.html
Disallow: /nav.html
Disallow: /ai-nav/

Sitemap: https://jackssybin.cn/sitemap.xml
```

这些页面同时被 `noindex, follow` 处理（实测 `tags.html`、`news.html` 均已输出该标签）。

单看每一条都有理由（这些确实是低质聚合页），但**叠加起来的问题**是：改版前百度收录的 URL 里，标签页、归档页、分页占了相当比例。一次性全部 Disallow + noindex，等于主动把自己大部分已收录页面从索引里推出去。百度对 Disallow 的响应比 Google 快得多。

#### 问题 E：参数化 URL 返回首页副本（重复内容）

```
$ curl https://jackssybin.cn/            → 42,849 字节
$ curl https://jackssybin.cn/?p=2        → 42,849 字节
$ cmp 两个文件                            → 完全相同
```

老站 Solo 的分页 URL 是 `/?p=2`、`/?p=6` 这种形式（搜索结果里还能看到 `https://jackssybin.cn?p=6/`）。百度当年收录过这些分页 URL。现在它们全部返回**与首页字节完全相同的 HTML**，属于典型的参数化重复内容，百度会合并或降权。

#### 问题 F：首页「实时热点」聚合模块

- 首页渲染了 8 条站外热搜（百度热搜 / 微博热搜 / 知乎热榜 / 掘金）
- 数据停留在 `2026-06-16 23:17:39`（已 3 个月未更新）
- 其中包含时政类词条

百度对「采集聚合 + 内容陈旧 + 首页堆砌站外链接」的组合有明确的低质判定倾向。这不是主因，但是减分项。

---

## 三、为什么 Google 正常、百度异常

同一套配置，两家引擎的反应完全不同，这正是你观察到的现象：

| 维度 | Google | 百度 |
|---|---|---|
| 403 错误 | 视为暂时不可用，**保留索引**，稍后重试 | 视为抓取失败，**削减抓取配额** |
| 301 → robots 禁止页 | 有一定容忍度 | **静默移除**原 URL 索引 |
| `noindex` 响应速度 | 逐步生效，较慢 | **快速清除** |
| 参数化重复内容 | 自动归并到主 URL | **降权** |
| 备案要求 | 不要求 | **.cn 域名强依赖** |
| 对静态站的 JS 渲染 | 支持好 | 支持较弱（但本站是静态 HTML，此项无影响） |

所以「网站对 Google 是好的，对百度是坏的」这个现象，是 403 + 301→Disallow + noindex 三件事叠加的结果，**不是玄学，是可复现的技术原因**。

---

## 四、需要你确认的事项（我无法从外部验证）

这几项必须登录后才能看到，请你核实：

1. ~~**ICP 备案实际状态**（最优先）~~ **→ 已于 2026-09-18 由用户确认：备案已完成。**
   - 爱站网显示「未找到信息或未备案」，但页脚写着「京ICP备17039180号」，两者矛盾。第三方查询接口未取到数据，但用户确认备案正常，以官方为准。
   - 结论：备案不是本次收录丢失的原因，P0 优化可以正常推进。

2. **百度站长平台是否还能登录、站点验证是否有效**
   - `hugo.toml` 里 `baidu_verify = ""` 为空，线上首页**没有** `baidu-site-verification` meta 标签
   - `public/` 里只有 Google 的验证文件（`googlec0a585e59e234aed.html`），没有百度的
   - 历史 commit 显示曾用 `http://jackssybin.cn` 注册推送站点
   - 如果验证失效，你就无法提交 sitemap、无法用普通收录 API、看不到索引量曲线

3. **站长平台「索引量」曲线的形状**
   - 是断崖式下跌（说明触发了某个明确规则），还是缓慢下滑（说明是综合质量下降）
   - 这能反向验证上面的判断

4. **站长平台「抓取异常」报告**
   - 看 403 / 404 / 301 的具体数量和占比

5. **改版时是否提交过「改版规则」**
   - 百度站长平台 → 站点改版 → 提交改版规则
   - 从 Solo 到 Hugo 是整站形态变更，如果没提交，百度无法把老 URL 的权重迁移到新 URL

---

## 五、优化方案

### P0 — 本周处理（这几条直接决定恢复速度）

**1. 断掉「301 → robots 禁止页」的死链**

标签页现在的 301 目标是 `/search.html?keyword=xxx`，而 `/search` 被 robots 禁止。两个选择：

- **方案 A（推荐）**：让标签页渲染成真实内容并允许抓取
  在 Hugo 里恢复 taxonomy 输出（`disableKinds` 去掉 `taxonomy`），生成 `/tags/xxx.html` 静态页，内容为该标签下的文章列表，然后从 robots.txt 移除 `Disallow: /tags/`
- **方案 B（保守）**：把 301 目标改成允许抓取的页面（如对应专题页），或直接返回 **410 Gone** 明确告知百度「此页已永久移除」，让百度干净地删除索引，而不是留下「重定向异常」记录

**不要保留现状**——现状是百度最讨厌的组合。

**2. 消除全部 403**

在 nginx 里让「目录无 index」时返回 404 而不是 403：

```nginx
# 放在 server 块内、location / 之前
location ~ /$ {
    try_files $uri $uri/index.html =404;
}
```

同时清理构建产物里的空目录（`public/tags/`、`public/page/`、`public/archives/`、`public/nav/`、`public/topics/`），在部署脚本里加一句删除空目录的步骤。

**3. 修掉 `/archives` → `/archives/` → 403**

把 nginx 的 `/archives` 直接 301 到 `/archives.html`，不要经过目录。

**4. 恢复百度站长平台验证，提交 sitemap**

- 在 `hugo.toml` 填入 `baidu_verify`（站长平台给的 meta 值）或放验证文件到 `static/`
- 站长平台提交 `https://jackssybin.cn/sitemap.xml`
- 开「普通收录 → API 提交」，用后端主动推送（比 JS 自动推送可靠得多）

### P1 — 两周内处理

**5. 重新设计 robots.txt**

原则：**只屏蔽真正无价值且永远不会被收录的页面，不要屏蔽有历史收录的路径**。建议把 `/tags/` 从 Disallow 里移除（配合第 1 条的方案 A），保留 `/search`、`/admin/`、`/search-index.json` 的屏蔽。

**6. 处理 `/?p=N` 参数**

三种做法，选一：
- nginx 里对 `?p=` 参数返回 301 到对应的 `/page/N/`（如果分页内容真实存在）
- 或返回 410
- 最差也要加 `canonical` 指向首页（现状是完全相同的副本，最糟）

**7. 用 API 主动推送替代 JS 自动推送**

现在的 `push.js` 依赖真实用户访问才触发。建议在 GitHub Actions 部署完成后，用百度「普通收录 API」把新增/变更 URL 主动推送一遍（每天配额通常 10~100 条，够用）。

### P2 — 一个月内处理

**8. 统一 URL 风格**

sitemap 里 376 条 URL 中，89 条是中文百分号编码（如 `/articles/2026/08/25/claude-code-%E8%A2%AB%E9%80%80%E8%AE%A2.../`），263 条是 `.html`，24 条是 `/` 结尾。百度对中文编码 URL 的处理明显弱于 ASCII。建议把中文 URL 全部 301 到拼音/英文 slug（你已有 `POST_SLUG` 机制）。

**9. 首页「实时热点」模块**

要么恢复自动更新（`pnpm fetch-hot-news` 已停 3 个月），要么从首页移除，只保留在 `/news.html`。技术博客首页堆聚合热搜是减分项。

**10. 提交改版规则**

站长平台 → 站点改版，把老 URL 规则映射到新 URL 规则，帮助百度迁移权重。

---

## 六、预期效果

| 时间 | 预期 |
|---|---|
| P0 完成后 1~2 周 | 403 抓取错误消失，站长平台「抓取异常」里的错误数大幅下降 |
| 2~4 周 | 文章页开始重新被收录（文章 URL 一直是 200，是最有希望先回来的） |
| 1~3 个月 | 索引量恢复到改版前水平的一部分；标签页/归档页收录取决于第 5、8 条 |
| 持续 | 百度对新站的「观察期」通常 1~3 个月，改版属于重新评估，需要耐心 |

**最关键的判断点**：先确认备案状态。如果备案有问题，上面所有优化都会被抵消。

---

## 七、附：本次实测原始数据

```
# 老 URL 重定向链
/tags/Linux.html              => 301 -> /search.html?keyword=Linux
/archives                     => 301 -> /archives/
/archives/                    => 403
/articles/2019/07/31/1564568923421.html => 200
/articles/2020/05/28/1590637980592/     => 301 -> .html 版

# 403 目录清单
/tags/ /archives/ /page/ /nav/ /topics/ /mysql/ /netty/ /linux/ /springboot4/

# 重复内容
/          => 42849 bytes
/?p=2      => 42849 bytes（与首页完全相同）

# sitemap
376 条 URL，状态码分布 {"200": 376}
  ASCII .html     263 条
  ASCII 目录式     24 条
  含中文编码       89 条

# noindex 生效页面（线上实测）
/tags.html  => <meta name=robots content="noindex, follow">
/news.html  => <meta name=robots content="noindex, follow">
/archives.html => 无 noindex（但被 robots Disallow）

# 服务器
IP: 47.94.12.12（阿里云北京）  Server: nginx
历史解析: 152.136.189.127（腾讯云北京）
域名注册: 2016-05-03（10 年）
```

---

## 八、修复执行记录（2026-09-18）

代码改动已全部完成并本地验证通过，**尚未推送到 main**（推送会触发 GitHub Actions
自动部署，同时会把 nginx 配置 scp 到服务器并 reload，属于生产变更）。

### 8.1 改动清单

| 文件 | 改了什么 |
|---|---|
| `static/robots.txt` | 移除 `/tags/ /tags.html /page/ /news.html /weekly.html /topics.html /nav.html /ai-nav/` 的 Disallow，只保留 `/search*`、`/search-index.json`、`/admin/`。这些页面已带 noindex，Disallow 会让爬虫读不到 noindex，页面反而长期滞留索引 |
| `layouts/robots.txt` | 同步成与 `static/robots.txt` 相同的规则。**注意**：实测 Hugo 构建时 `static/robots.txt` 覆盖 `layouts/robots.txt`，后者实际不生效；两份保持规则一致是为了防止 Hugo 版本变更后优先级反转 |
| `deploy/nginx-jackssybin.conf` | ① 新增 9 条精确 location，把 `/archives` `/tags/` `/topics/` `/nav/` `/mysql/` `/netty/` `/linux/` `/springboot4/` 301 到真实存在的 `.html`；② 标签页规则由「301 到 `/search.html`」改为 `try_files /tags/$tag.html =404`；③ 新增通用目录 location，无 index.html 的目录返回 404 而不是 403；④ `location /` 去掉 `$uri/`；⑤ `?p=N` 返回 410；⑥ 增加 `error_page 403 =404` 兜底 |
| `layouts/_default/baseof.html` | noindex 判定改为「前缀 + 精确」两个列表，新增 `/articles/` `/tutorials/` `/generated/`（这三个是 Hugo 自动生成的 section 页，正文只有标题和脚本，是彻底的空壳） |
| `layouts/index.sitemap.xml` | 把 `/archives.html` `/about.html` `/links.html` `/my-github-repos/` 加回 sitemap。这四个是正常内容页且没有 noindex，此前却被排除，属于漏报 |
| `hugo.toml` | `baidu_verify` 补充取数说明。**取值仍需你提供** |
| `scripts/seo-check/` | 新增两个回归检查脚本（见 8.3） |
| `deploy/nginx-p0-fixes.conf`、`deploy/robots.txt.fixed` | 已删除——内容已合并进正式配置，避免两份来源互相矛盾 |

### 8.2 验证方式与结果

因为无法在不部署的前提下验证 nginx 行为，用三重验证代替：

1. **nginx 语法校验** —— 用 nginx 官方解析器 crossplane 在 http 上下文中解析，
   `0 errors`；花括号 28/28 配对；location 无冲突。
   （补充：CI 在 reload 前会执行 `sudo nginx -t`，语法错误不会导致 nginx 挂掉。）

2. **构建产物校验** `python scripts/seo-check/check-build.py public` → **全部通过**
   - robots.txt 规则行符合预期
   - 薄页面 163 个标签页 + 24 个归档页 + 空壳页全部带 noindex
   - 281 篇文章页 + 首页 + about/links/my-github-repos 全部无 noindex
   - sitemap 380 条，收录口径与 noindex 口径一致

3. **nginx 路由仿真** `python scripts/seo-check/simulate-nginx.py public` → **全部通过**
   用 Python 复现 nginx 的 location 匹配顺序与 try_files 语义：

| URL | 修复前（线上实测） | 修复后（仿真预测） |
|---|---|---|
| `/archives` | 301 → `/archives/` → 403 | 301 → `/archives.html` |
| `/archives/` | **403** | 301 → `/archives.html` |
| `/archives/2019/` | **403** | 404 |
| `/tags/` | **403** | 301 → `/tags.html` |
| `/tags/Linux.html` | **301 → `/search.html?keyword=Linux`（禁抓页）** | 404 |
| `/page/` | **403** | 404 |
| `/nav/` | **403** | 301 → `/nav.html` |
| `/topics/` | **403** | 301 → `/topics.html` |
| `/mysql/` `/netty/` `/linux/` `/springboot4/` | **403** | 301 → 对应 `.html` |
| `/?p=2`、`/?p=6` | 200（与首页字节完全相同的副本） | 410 |
| 首页、文章页、`/about.html` 等正常页 | 200 | 200（不变） |

   **403 数量：修复前 9 条 → 修复后 0 条。**

   一个需要知道的细节：`/tags/Linux.html` 修复后是 **404** 而不是 301。
   因为服务器上只有小写的 `linux.html`（ext4 大小写敏感），大写变体并不存在。
   标签页本身是 noindex，所以 404 与 301 对收录结果一致，
   但 404 不会留下「重定向到禁抓页」的异常记录。

### 8.3 新增的回归检查脚本

以后改 SEO 相关的地方，跑这两个脚本就能提前发现问题：

```bash
hugo --destination public --minify --cleanDestinationDir --enableGitInfo
python scripts/seo-check/check-build.py public      # 构建产物的 noindex/sitemap/robots 不变量
python scripts/seo-check/simulate-nginx.py public   # nginx 路由行为预测，含「不得出现 403」护栏
```

两个脚本都以非零退出码表示失败，可以直接挂进 CI。

### 8.4 还需你处理的事项

1. **百度站长平台验证码（`baidu_verify`）** —— 这是目前唯一还挡着的 P0 项。
   取法：https://ziyuan.baidu.com/site → 添加站点 → 「HTML标签验证」→
   把 meta 的 `content="..."` 原样填入 `hugo.toml` 的 `baidu_verify`。
   或者把百度给的验证 html 文件直接放进 `static/` 根目录（不用改 hugo.toml）。
   验证通过后：提交 `sitemap.xml`、开通「普通收录 API」。

2. **确认 `BAIDU_PUSH_TOKEN` 这个 GitHub Secret 还在有效期内**。
   CI 里的「Submit changed URLs to Baidu」步骤设了 `continue-on-error: true`，
   token 失效不会让部署失败，所以它可能已经静默失败很久了。

3. **89 条中文 URL**（P2，未做）—— 详见第九节。

### 8.5 部署后的验证动作

推送后等 Actions 跑完，用 Baiduspider UA 复跑第六节的清单，重点确认：

```bash
curl -sS -o /dev/null -w "%{http_code}\n" -A "Baiduspider" https://jackssybin.cn/archives/
curl -sS -o /dev/null -w "%{http_code}\n" -A "Baiduspider" https://jackssybin.cn/tags/
curl -sS -I -A "Baiduspider" https://jackssybin.cn/tags/Linux.html     # 期望 404，不是 301
curl -sS -o /dev/null -w "%{http_code}\n" -A "Baiduspider" "https://jackssybin.cn/?p=2"   # 期望 410
curl -sS -A "Baiduspider" https://jackssybin.cn/robots.txt             # 确认不再有 /tags/ 的 Disallow
```

---

## 九、待决策：89 条中文 URL 要不要迁移

这是目前剩下的最大质量项，但我没有擅自改，因为它会改动 89 个对外 URL。

**现状**：`/articles/2026/08/*` 等目录下 89 篇文章的 slug 是中文，
URL 形如 `/articles/2026/08/25/claude-code-%E8%A2%AB%E9%80%80%E8%AE%A2.../`。
百度对中文百分号编码 URL 的处理明显弱于 ASCII。

**可行方案**（不需要重命名任何文件，风险可控）：
1. 用 `pinyin-pro`（依赖已在 `package.json` 里，`new-post.mjs` 已用它给新文章生成拼音 slug）
   为这 89 篇算出拼音 slug；
2. 在每篇 frontmatter 里补一行显式 `url: /articles/YYYY/MM/DD/<拼音>/`；
3. 把「中文 URL → 拼音 URL」的映射追加到 `nginx-jackssybin.conf` 已有的
   `map $request_uri $new_tutorial_uri` 映射表里（现 35 条，会变成 124 条），
   同时把 `map_hash_bucket_size` 调大；
4. 图片目录 `/images/<中文名>/` 不动（图片 URL 的 SEO 权重极低，改了反而增加出错面）。

**为什么建议做**：89/277 篇文章，占了三分之一；而且这批是 2026-08 的新内容，
正是最该被收录的部分。

**风险**：301 映射表必须逐条正确，写错一条就会让那个 URL 变 404。
所以建议单独一个 commit，部署后用第九节的脚本逐条核对 124 条映射。

**拍板问题**：做还是不做？（另一个选项是先只做 P0/P1，观察 2~4 周百度索引的恢复情况再决定。）

