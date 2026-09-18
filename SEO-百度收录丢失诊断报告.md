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

2. ~~**百度站长平台是否还能登录、站点验证是否有效**~~ **→ 已于 2026-09-18 修复。**
   - 原状：`hugo.toml` 里 `baidu_verify = ""` 为空，线上首页**没有** `baidu-site-verification` meta 标签
   - 现已填入 `baidu_verify = "YVM1HE4ka9smKP0m"`，构建产物首页输出：
     `<meta name=baidu-site-verification content="YVM1HE4ka9smKP0m">`
     （全站 623/626 个页面输出；未输出的 3 个是 `/404.html`、`/ai-nav/index.html`、
     `googlec0a585e59e234aed.html`，前两个本就是 noindex 页、第三个是 Google 验证文件，均无需输出）
   - **待用户动作**：提交后在站长平台点「验证」。若显示失败，说明平台给的是「文件验证」
     方式，需另放 `static/baidu_verify_YVM1HE4ka9smKP0m.html`（此串为 16 位无前缀格式，
     与老版 `codeva-` 前缀格式不同，两种方式的区分要以平台提示为准）
   - 另外需确认 CI 里的 `BAIDU_PUSH_TOKEN` secret 是否有效——该步骤是
     `continue-on-error: true`，token 失效不会报错，只会静默不推送

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

**5. 重新设计 robots.txt** —— ✅ **已于 2026-09-18 随 P0 一并完成**。
移除 `/tags/` `/tags.html` `/page/` `/news.html` `/weekly.html` `/topics.html` `/nav.html`
`/ai-nav/` 的 Disallow（这些页面已带 noindex，Disallow 会让爬虫读不到 noindex），
只保留 `/search*` `/search-index.json` `/admin/`。线上已验收。

**6. 处理 `/?p=N` 参数** —— ✅ **已于 2026-09-18 完成**。
nginx 对该参数直接返回 **410 Gone**（不是 301、不是首页副本）。
线上实测 `/?p=2`、`/?p=6` 均为 410。

**7. 用 API 主动推送替代 JS 自动推送** —— ✅ **2026-09-18 完成，详见 8.8**。
- 移除页面上早已失效的 push.js（实测它只剩一个统计 gif，不含任何链接提交调用）
- CI 里的推送从「部署 job 内一个 `continue-on-error` 的静默步骤」拆成**独立 job**，
  失败会显红；并补齐配额感知、退出码语义、探针与 job summary

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

本节 8.1~8.7 记录 P0 那轮，**代码已于当日 17:25 推送到 main 并完成线上验收**
（推送会触发 GitHub Actions 自动部署，同时把 nginx 配置 scp 到服务器并 reload，
属于生产变更，因此执行前经过了本地三重验证）。
8.8 是当晚追加的 P1 轮次。

### 8.1 改动清单

| 文件 | 改了什么 |
|---|---|
| `static/robots.txt` | 移除 `/tags/ /tags.html /page/ /news.html /weekly.html /topics.html /nav.html /ai-nav/` 的 Disallow，只保留 `/search*`、`/search-index.json`、`/admin/`。这些页面已带 noindex，Disallow 会让爬虫读不到 noindex，页面反而长期滞留索引 |
| `layouts/robots.txt` | 同步成与 `static/robots.txt` 相同的规则。**注意**：实测 Hugo 构建时 `static/robots.txt` 覆盖 `layouts/robots.txt`，后者实际不生效；两份保持规则一致是为了防止 Hugo 版本变更后优先级反转 |
| `deploy/nginx-jackssybin.conf` | ① 新增 9 条精确 location，把 `/archives` `/tags/` `/topics/` `/nav/` `/mysql/` `/netty/` `/linux/` `/springboot4/` 301 到真实存在的 `.html`；② 标签页规则由「301 到 `/search.html`」改为 `try_files /tags/$tag.html =404`；③ 新增通用目录 location，无 index.html 的目录返回 404 而不是 403；④ `location /` 去掉 `$uri/`；⑤ `?p=N` 返回 410；⑥ 增加 `error_page 403 =404` 兜底 |
| `layouts/_default/baseof.html` | noindex 判定改为「前缀 + 精确」两个列表，新增 `/articles/` `/tutorials/` `/generated/`（这三个是 Hugo 自动生成的 section 页，正文只有标题和脚本，是彻底的空壳） |
| `layouts/index.sitemap.xml` | 把 `/archives.html` `/about.html` `/links.html` `/my-github-repos/` 加回 sitemap。这四个是正常内容页且没有 noindex，此前却被排除，属于漏报 |
| `hugo.toml` | `baidu_verify` 填入 `YVM1HE4ka9smKP0m`（2026-09-18 由用户提供），首页产物确认输出 `baidu-site-verification` meta |
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

1. ~~**百度站长平台验证码（`baidu_verify`）**~~ **→ 已于 2026-09-18 完成。**
   值 `YVM1HE4ka9smKP0m` 已写入 `hugo.toml`，构建产物首页确认输出
   `<meta name=baidu-site-verification content="YVM1HE4ka9smKP0m">`。
   **剩余动作（需登录后台）**：站长平台点「验证」→ 通过后提交 `sitemap.xml`
   → 开通「普通收录 API」。若验证失败，说明平台选的是文件验证方式，
   需补 `static/baidu_verify_YVM1HE4ka9smKP0m.html`。

2. **确认 `BAIDU_PUSH_TOKEN` 这个 GitHub Secret 还在有效期内**。
   CI 里的「Submit changed URLs to Baidu」步骤设了 `continue-on-error: true`，
   token 失效不会让部署失败，所以它可能已经静默失败很久了。
   **站点验证修复后，这一项的优先级上升**——验证失效时推送 API 一定不生效，
   现在需要区分「token 过期」还是「之前单纯因未验证而推不动」。
   → **已由 8.8 处理**：该步骤重做为独立 job，token 失效会显红并写明是哪一类问题。
   剩下的是你拿到有效 token 填进 Secret。

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

### 8.6 部署时间线与线上验收（2026-09-18）

| 时间 | 事件 |
|---|---|
| 17:25 | 用户确认推送 |
| 17:25 | push `1f59b50`（含 `d6d9c49` nginx+模板、`1f59b50` 验证串），Actions 启动 |
| 17:29 | **部署成功**（全部 22 个步骤 OK） |
| 17:30 | 自动验收：**发现首页 404**，其余项通过 |
| 17:31–17:43 | 定位根因 → 搭真实 nginx 环境做对照实验 → 确定修复方案 |
| 17:44 | push `fc114a6`（首页修复） |
| 17:48 | **部署成功 + 线上验收全部通过** |

最终线上实测（Baiduspider UA，不跟随重定向）：

- 首页 `/` → **200**，无 noindex
- `/archives/` `/tags/` `/nav/` `/topics/` `/mysql/` `/netty/` `/linux/` `/springboot4/` → **301 到真实 .html**；`/page/` → 404。**无一条 403**
- `/tags/Linux.html` → 404（不再 301 到 robots 禁抓的 `/search.html`）；`/tags/centos7.html` → 200
- `/?p=2`、`/?p=6` → **410**
- robots.txt：含 `Sitemap:`，不再 Disallow `/tags/`
- 首页含 `<meta name=baidu-site-verification content="YVM1HE4ka9smKP0m">`
- `/articles/` `/tutorials/` `/generated/` → 200 且带 noindex
- 文章页、about、links → 200 且无 noindex
- sitemap 380 条，含补回的 `/about.html` `/links.html` `/archives.html` `/my-github-repos/`

### 8.7 ⚠️ 过程中的一次生产事故：首页 404（已修复）

这一节必须留在报告里，因为它暴露的是**验证方法本身的缺陷**，而不只是一个笔误。

**事故**：`d6d9c49` 把 `location /` 的 try_files 从 `$uri $uri/ $uri.html =404`
改成 `$uri $uri.html =404`（当时判断 `$uri/` 会引发目录 403）。
部署后**首页直接 404**，返回 404.html 的内容（Content-Length 2859 与其吻合），
而 `/index.html` 仍是 200。首页 404 对 SEO 的伤害比目录 403 高一个量级。

**根因 —— nginx try_files 的目录语义**：
try_files 只在参数**文本以 `/` 结尾**时才把目录视为命中。
`$uri` 这个参数名末字符是 `i` 而非 `/`，所以它**只匹配普通文件，遇到目录一律跳到下一项**。
于是 `/` 匹配不到 `$uri`，`$uri.html` 得到 `/.html`，直接落到 `=404`。
`$uri/` 才是让 `/` 交给 index 模块、进而命中 `index.html` 的那一项。

**为什么上一轮没拦住**：
`scripts/seo-check/simulate-nginx.py` 的仿真实现把 `$uri` 当成能匹配目录，
把 `/` 预测为 200 —— **与真实行为相反**。仿真算错比不算更危险，它给了虚假的通过信号。

**修复**：`try_files $uri $uri.html $uri/ =404;`
把 `$uri.html` 放在 `$uri/` 之前，保证 `/tags` 这种「同名 .html 存在」的无斜杠请求
优先命中文件（仍 200），目录请求才走 index 模块。

**验证手段升级 —— 不再只靠推理**：

1. 本机跑**真实 nginx**（官方 Windows 构建 1.28.0），实测而非推算。
2. 新增 `scripts/seo-check/gen-nginx-test.py`：从生产配置提取「location 最多的那个
   server 块」（配置里有 :80 跳转、www 跳转、主站共 3 个 server，只认 `listen 443`
   会误选 www 跳转块 —— 那块一条 location 都没有），剥掉 SSL/日志/server_name，
   替换 root 指向本地产物，生成可直接运行的本机配置。
3. 三方案对照实验（同一份产物、三个端口）：

   | 路径 | A `$uri $uri.html $uri/` | B 线上现状 | C `$uri $uri/ $uri.html` |
   |---|---|---|---|
   | `/` | **200** | **404** | 200 |
   | `/tags` | **200** | 200 | **301→/tags/** |
   | 其余 | 三者一致 | | |

   B 复现了线上事故，证明这套本机验证是保真的；A 是本次采用的方案。
4. `simulate-nginx.py` 修正目录语义，并新增**静态护栏** `check_conf_guards()`：
   直接读配置原文，若 `location /` 的 try_files 缺目录匹配项则 FAIL 退出。
   反向验证：把配置改回错误版本 → 护栏退出码 1 ✅；同时仿真仍显示 200，
   恰好说明分工 —— **护栏验「配置写法」，仿真验「路由行为」**，两者互补。

**留下的本地验证环境**：`_ngxtest/`（已加入 `.gitignore`，约 7.7 MB）。
以后改 nginx 配置可以零成本先在本机实测：
```bash
python scripts/seo-check/gen-nginx-test.py deploy/nginx-jackssybin.conf public _ngxtest/nginx-1.28.0/conf/prod-test.conf 8890
cd _ngxtest/nginx-1.28.0 && ./nginx.exe -t -c conf/prod-test.conf && ./nginx.exe -c conf/prod-test.conf
# 注意：本机探测要走 --noproxy "*"（环境里有 HTTP_PROXY，否则得到代理的 502）
```

### 8.8 P1 执行记录（2026-09-18 晚）

用户指示「先只做 P1」。P1 三项里，第 5、6 项已在 P0 那轮顺带做完并线上验收，
本轮实际工作量集中在**第 7 项：让百度主动推送真正可靠**。

#### 8.8.1 先核实状态，不重复劳动

| P1 项 | 核实方式 | 结论 |
|---|---|---|
| 5. robots.txt 重设计 | `curl -A Baiduspider https://jackssybin.cn/robots.txt` | ✅ 已上线：只 Disallow `/search*` `/search-index.json` `/admin/` |
| 6. `/?p=N` | `curl -A Baiduspider "https://jackssybin.cn/?p=2"` | ✅ 已上线：**410** |
| 7. API 主动推送 | 读 workflow + 脚本 + 实测 push.js | ❌ 链路存在但不可靠，本轮重做 |

#### 8.8.2 实测：页面上的 push.js 早就不是「推送」了

两个官方域名都还返回 200，所以只看状态码会误判为「正常」。看正文才知道真相：

```js
// https://zz.bdstatic.com/linksubmit/push.js   (308 字节，全文一行)
!function(){var e=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,r=window.location.href,t=document.referrer;if(!e.test(r)){var o="https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif";t?(o+="?r="+encodeURIComponent(document.referrer),r&&(o+="&l="+r)):r&&(o+="?l="+r);var i=new Image;i.src=o}}(window);

// http://push.zhanzhang.baidu.com/push.js      (281 字节，全文一行)
!function(){var e=/([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi,r=window.location.href,o=document.referrer;if(!e.test(r)){var n="//api.share.baidu.com/s.gif";o?(n+="?r="+encodeURIComponent(document.referrer),r&&(n+="&l="+r)):r&&(n+="?l="+r);var t=new Image;t.src=n}}(window);
```

**已验证**：这段代码只做一件事——往一个 1×1 gif 上挂 `?r=<referrer>&l=<当前URL>`，
没有任何涉及 `data.zz.baidu.com` 或链接提交接口的调用。
**推断**（依据充分但未获百度官方文档确认）：百度「自动推送」功能已在 2020 年前后下线，
这段 JS 只剩访问上报作用。
**不确定**：百度是否把这批 gif 上报间接用于发现新链接。可能性低，且百度统计（hm.js）
本身已在收集同样的信息。

结论：移除 push.js 不损失链接提交能力，反而每页少一次跨域请求。
产物已确认彻底移除（`grep -rl "linksubmit\|zhanzhang"` = 0 文件），
hm.js 百度统计在 622 个页面正常保留。
**如需回滚**：恢复 `layouts/_default/baseof.html` 里本段被删的 `<script>` 块即可。

#### 8.8.3 重做 CI 推送链路

旧的写法有一个隐蔽的致命问题：**推送成功和 token 失效在日志里长得一模一样**。

```yaml
# 旧：部署 job 内，continue-on-error: true
- name: Submit changed URLs to Baidu
  continue-on-error: true
  run: |
    if [ -z "$BAIDU_PUSH_TOKEN" ]; then
      echo "BAIDU_PUSH_TOKEN 未配置，跳过百度推送"
      exit 0        # ← 没配 token 也是绿色 ✓
    fi
    node scripts/baidu-push.mjs --changed
```

于是「token 早就过期」可以连续几个月不被人发现——这正是报告 8.4 第 2 条存疑的那件事。

改动：

| 位置 | 改动 |
|---|---|
| workflow | 推送从 `build-and-deploy` 内的步骤拆成**独立 job `baidu-push`**（`needs: build-and-deploy`）。部署是否成功只看主 job，推送成败在 Actions 列表里是独立一行，失效立刻显红 |
| workflow | 去掉 `continue-on-error`；token 缺失直接 `::error::` 并 exit 1，同时写 job summary 说明怎么配 |
| workflow | 推送结果写进 `$GITHUB_STEP_SUMMARY`（JSON 全文），不用翻日志 |
| workflow | 参数：`--changed --fallback-since=2 --probe-if-empty --max=50` |
| `scripts/baidu-push.mjs` | 新增 `--max=N` 配额上限、`--fallback-since=N` 空变更回退、`--probe-if-empty` 探针、`--verify` 单条验证、`--summary=<file>` 结果落盘、支持本地 sitemap 文件路径 |
| `scripts/baidu-push.mjs` | **退出码语义**：0 成功/无需推送，1 运行时错误，2 配置问题（token 失效/站点未验证），3 当日配额用尽。workflow 按码区分：2 报错，3 只 warning |
| `scripts/baidu-push.mjs` | 错误分类按 `message` 关键字匹配（`quota` / `token` / `verif` / `unauthor`），不硬编码百度错误码——码表没有稳定文档，关键字更抗变 |

为什么加「探针」：只在有正文变更时才推送，意味着 token 失效只会在「刚好改了文章」
的那次部署暴露。探针让每次部署都至少推 1 条，链路状态**每次都被验证**。

#### 8.8.4 本地验证记录

推送脚本无法在本地做端到端成功验证（没有有效 token），所以用**退出码 + 真实 API 响应**做验证：

| 用例 | 命令要点 | 结果 |
|---|---|---|
| 无 token | 不设 `BAIDU_PUSH_TOKEN` 跑 `--verify` | **exit 2**，summary 记录 `BAIDU_PUSH_TOKEN 未设置` ✅ |
| 变更回退 | `--changed --fallback-since=2`（HEAD~3 无正文变更） | 回退取到最近 2 天 5 条，`--max=5` 截断，dry-run 正常 ✅ |
| 探针 | `--changed --fallback-since=0 --probe-if-empty` | 候选 0 → 探针启用 → 推 1 条最新页，`mode: probe` ✅ |
| **配置错误分类** | **假 token 打真实百度 API** | 百度返回 `{"error":400,"message":"token invalid"}` → **exit 2** ✅ |
| YAML 语法 | `yaml.parse` 解析 workflow | 2 个 job，`baidu-push` 依赖关系与步骤数正确 ✅ |
| 构建产物 | `hugo --destination _ngxtest/public-p1` | 626 个 html（与线上产物一致），push.js 0 处，hm.js 622 处 ✅ |
| 回归 | `check-build.py` + `simulate-nginx.py` | **全部通过**，无回归 ✅ |

那条「假 token 打真实 API」的用例价值最高：它证明**退出码分类对百度的真实响应有效**，
而不只是对我编造的响应有效。同时也证明 `data.zz.baidu.com` 接口本身可达。

#### 8.8.5 部署与线上验收（2026-09-18 21:43 推送）

推送 `5c1542b` → Actions run **#1126**，13:43:07 起、13:46:46 完成，**两个 job 全绿**：

| Job | 结果 |
|---|---|
| `build-and-deploy` | success（15 个步骤 + post 步骤全 OK） |
| `Push URLs to Baidu` | **success** ← 本轮新增的独立 job |

修掉验收脚本的 sha bug 后又推了一次：`93b2460` → run **#1127**（13:52:14 起），
`build-and-deploy` 与 `Push URLs to Baidu` 同样全绿，线上验收也全部通过。
而 #1127 的推送日志，把「配额」这件事彻底讲清楚了：

```
  结果: {"remain":0,"success":4}
  今日剩余配额: 0
✅ 累计成功推送 4 条
```

**这就是四条值得记下来的结论：**

1. **本次走的是 fallback 路径**：这次改动只有脚本、workflow 和模板，没有 `.md` 变更，
   `--changed` 取到 0 条，由 `--fallback-since=2` 兜底推出最近 2 天更新的 4 篇。
   如果没有这条回退，这次推送结果就是「0 条」——链路是否通又要等下一次才知道。
2. **配额是 8 条/天，而且重复推送同一 URL 照常扣配额。**
   第一次 `{"remain":4,"success":4}`（用 4、剩 4）；第二次推的是**完全相同**的 4 条 URL，
   返回 `{"remain":0,"success":4}`（用 4、剩 0）。两次合起来定出总配额 = 8，
   同时证明**百度不按 URL 去重，重复推一样烧配额**。
   - `--max=50` 不现实：百度对超配额是**拒绝整批**而非接受前 N 条，撞上就整批白推。已下调到 10。
   - **更要紧的是去掉了 CI 里的 `--fallback-since=2`**：它在「本次没有正文变更」时
     兜底推最近 2 天更新的页面，而这些页面通常上次刚推过 ——
     等于每次纯代码部署都白烧 4 条配额（今天 8 条配额就是这么被同一批 URL 吃光的）。
     现在无变更时只靠 `--probe-if-empty` 推 1 条，成本降到 1。
3. **线上验收**（`post-deploy-verify.py`）：**总判定全部通过**——原 9 条 403 目录全部
   301/404、`?p=N` → 410、robots 口径正确、验证 meta 在、空壳页 noindex、
   文章页无 noindex、sitemap 380 条。
4. **验收脚本自身的 bug 已修**：`post-deploy-verify.py` 用 `r["head_sha"] == SHA` 全等比较，
   而 GitHub API 返回 40 位完整 sha，传 7 位短 sha 时永远匹配不上，
   把一次已经成功的运行报成「10 分钟内未找到该 sha 的运行」，白等 5 分钟。
   已改为前缀匹配（要求 `len(sha) >= 7`），重跑即通过。
   这个文件此前**从未提交进仓库**，本轮一并纳入。

#### 8.8.6 又一次自我制造的事故：配额限流被误报成 job 失败

前面刚去掉 fallback，推送量降到 1 条探针。但当天配额已经用光，
于是 `ca4fa55` 之前的 run `#1128`（`1853f99`）**整体 failure**：

```
Job: build-and-deploy    -> success     ← 部署本身没问题，站点正常
Job: Push URLs to Baidu  -> failure
```

推送 job 的日志说得很清楚：

```
  结果: {"error":400,"message":"over quota"}
  ❌ error=400 message=over quota
✅ 累计成功推送 0 条
  → 当日配额已用尽，属于正常限流，明天会自动恢复。
##[error]Process completed with exit code 3.
```

**注意：分类逻辑完全正确**——认出了 `over quota`、打印了正确的处置建议、退出码是 3。
坏在**取值方式**上。

**坑 1：GitHub Actions 对 `shell: bash` 会强制注入 `-e`（errexit）。**

以为是 `bash --noprofile --norc {0}` 的写法只影响 PATH，
实际实现是 `bash --noprofile --norc -eo pipefail {0}` —— `-e` 是**强制**的。

后果：`node ...` 返回 3 的瞬间整个步骤就结束了，
我写的 `CODE=$?` 与后面那段 `case "$CODE"` 分流**根本没执行到**。
日志里没有 `baidu-push exit code: 3` 这一行，就是最直接的证据。
所以「配额用尽」这个本应只报黄色 warning 的正常情况，被渲染成红色失败。

修法：取退出码必须写在**条件上下文**里

```bash
CODE=0
node scripts/baidu-push.mjs ... || CODE=$?    # ← 不能写成 `node ...; CODE=$?`
echo "baidu-push exit code: $CODE"
```

`||` 让命令处于条件上下文，`-e` 不会因它失败而终止脚本。
（`set +e` 也能关掉，但它依赖它和注入参数的先后顺序，不够稳。）
本地用 `bash -eo pipefail -c '... || CODE=$?'` 复现并验证。

**坑 2：`token invalid` 和 `over quota` 共用 `error=400`。**

实测两个语义完全相反的错误，错误码一模一样：

| 真实响应 | 含义 | 该怎么处理 |
|---|---|---|
| `{"error":400,"message":"token invalid"}` | 配置问题 | 报错，人工去站长平台 |
| `{"error":400,"message":"over quota"}` | 配额用尽 | 只 warning，明天自愈 |

原实现里写了 `errorCode === 400 → 配置问题`，这条会把配额问题误判成配置问题、
把人引向站长平台白查。**已完全移除错误码参与判断，纯按 `message` 关键字分类**
（`quota`/`remain` → 3；`token`/`site error`/`verif`/`unauthor` → 2；其余 → 1）。

**修复后的验证**（`ca4fa55` → run `#1129`，14:04:28）：

```
run #1129  push  success
  job: build-and-deploy       success
  job: Push URLs to Baidu     success      ← 从 failure 变回 success

  结果: {"error":400,"message":"over quota"}
  ❌ error=400 message=over quota
✅ 累计成功推送 0 条
  → 当日配额已用尽，属于正常限流，明天会自动恢复。
baidu-push exit code: 3                    ← 这行终于执行到了
##[warning]当日推送配额已用尽，属于正常限流，剩余 URL 明日自动继续
```

同一个「配额用尽」场景，修复前是红色 `::error` + job failure，
修复后是黄色 `::warning` + job success —— 行为回到了设计意图。

**教训**：错误码是给别人看的分类标签，不是契约；同一码值可以承载相反语义。
遇到这类第三方 API，**按文本内容分类比按状态码分类可靠**——
这也正是当初写「不硬编码错误码」的初衷，只是漏改了这一个条件分支。
另一半教训属于 CI：**不要假设 shell 的默认行为**。
`shell: bash` 在 Actions 里带 `-e`，这是本地跑脚本永远遇不到的差异。

#### 8.8.7 本轮未做 / 需你确认

1. ~~**`BAIDU_PUSH_TOKEN` 是否有效仍未知**~~ → **已确认有效**：首次推送就拿到
   `{"remain":4,"success":4}`，token 和站点验证都没问题。**这一项可以从待办里划掉了。**
2. 89 条中文 URL 迁移（P2）未动。
3. push.js 的移除是**推断性决策**，不是实测结论。若你更保守，可以只回滚这一处，其余照旧。
4. **需要你留意的新情况：百度给这个站的当日配额是 8 条**，而且重复推同一 URL 照扣。
   今天（09-18）这 8 条配额被同一批 4 篇文章重复消耗掉了（见 8.8.5）。
   已经去掉会导致重复推送的 `--fallback-since`，日常一篇篇发没问题；
   某天集中发多篇会撞配额，届时 job 显示**黄色 warning**、不报错，次日自动继续。
   要提升配额只能靠站点质量与持续更新，没有捷径。
   明天第一次部署会自动重推最新文章，届时可以再确认一次 `remain` 是否恢复。
5. 本轮推送记录（供对账）：`5c1542b`(#1126 成功推 4)、`93b2460`(#1127 成功推 4)、
   `1853f99`(#1128 撞配额)、`ca4fa55`(#1129 撞配额，修复验证)。共 4 次部署。

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

