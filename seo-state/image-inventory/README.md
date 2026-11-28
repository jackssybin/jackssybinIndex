# T8 图片素材清单

本目录记录主站文章中绝对 URL 图片的来源、可用性、授权状态和维护优先级，用于逐批决定保留、替换或本地化。清单本身不下载、不迁移图片，也不把项目许可证解释为其中每张第三方图片的再发布授权。

## 文件与范围

- `2026-11.json`：完整结构化清单。每个素材保留全部引用位置、来源文章、行号、alt、HTTP 检查结果和建议动作。
- `2026-11.csv`：与 JSON 相同的唯一素材集合，便于筛选和人工复核；多重引用合并到单元格，完整引用明细以 JSON 为准。
- `2026-11-p2-p3-review.json`：对原始清单的 P2/P3 第二轮复核及最终生产复验，记录两次部署、浏览器真实尺寸、68 个 Hacpai 替代地址检查、OSChina 防盗链修复、语义化表格和第三、四批 T7 结果。原始清单保持修复前快照，不用后续结果覆盖历史。
- `2026-11-p4-review.json`：OmniVoice Studio/Launchpad 两图的来源仓库、固定提交、许可证范围、尺寸和 SHA-256 复核。Studio 同哈希远程图已固定到文章日期提交，并随 `c375c44` 部署；生产图片 200、响应哈希一致，浏览器懒加载后真实尺寸为 1600×1000。Launchpad 在 P4 阶段未改，后续编辑决策见 P5。部署和加载成功不代表获得本地化授权。
- `2026-11-p5-review.json`：Launchpad 内容漂移的编辑决策、本地验收和生产复验。为保持教程写作时的界面和后续可复现性，选择文章日期固定提交并随 `4f8ae3d` 部署；真实 `lastmod` 更新为 2026-11-27。生产图片 200、436163 字节且 SHA-256 一致，浏览器懒加载后真实尺寸为 1600×1000。图片仍为远程引用，未获得或推断本地化授权。
- `2026-11-p6-review.json`：原异常清单中仍被引用的知乎图复核及 raw GitHub 漂移扫描。默认 Referer 下浏览器为 0×0，`no-referrer` 实测可加载 720×473，因此共享渲染钩子仅为该域名补充相同策略并随 `cdfd1ab` 部署。生产原图在 `no-referrer` 下懒加载为 720×473；原 URL、alt、正文和 lastmod 均不变，未下载或本地化。
- `2026-11-p7-review.json`：原清单中 Scrapy 四个 `check-error` 项对应的当前 `b3logfile.com` 图片生产复核。四图直接 GET 均为 200 PNG，记录字节数、尺寸和 SHA-256；生产页面逐张滚动触发既有懒加载后，自然尺寸分别为 545×236、1093×834、794×267、1146×257。P7 不替换、不下载、不本地化，也不做 T8 专属正文或 lastmod 修改；Scrapy 摘要与 lastmod 的更新属于第八批 T7。第八批已随 `e6a2a7b` 上线，Actions 运行 `46104101053` 成功；两篇生产字段通过复验，部署后四图再次逐张真实懒加载通过。授权仍未确认。
- 扫描 `content/articles/` 与 `content/generated/articles/` 中的 Markdown 图片、HTML `img` 绝对地址，以及 frontmatter `cover` / `image` 的 HTTP(S) 绝对地址。相对路径的站内图片由既有构建审计负责，不在此清单重复统计。
- HTTP 状态是生成清单时的单次快照，不是持续监控结论；远程服务后续可能恢复、失效或改变响应。

## 检查与授权边界

- 每个唯一 URL 执行一次跟随重定向的 HEAD；仅 405/501 允许一次 Range GET 回退。无重试、无认证绕过，也不保存响应图片。
- `available-image` 只表示本次响应为 2xx/3xx 且 Content-Type 以 `image/` 开头。
- `missing` 只表示本次明确返回 404/410；`restricted` 表示 401/403；`check-error` 可能是超时、TLS、DNS 或网络限制，不能直接称为坏图。
- `http-ok-non-image-or-unknown-type` 需要人工确认是否为防盗链 HTML、错误 Content-Type、动态响应或其他非图片内容，不能仅凭状态码迁移。
- 外部素材的 `authorizationStatus` 统一从 `unconfirmed` 开始。确认授权需要保存作者、原始页面、许可证或书面许可等具体证据。
- `own-site-existing` 仅表示素材已经位于本站域名、无需外链迁移，不额外证明其中第三方内容的版权归属。
- 动态徽章和部署按钮默认保留远程或改成文字，不为了本地化而冻结其动态状态。

## 页面价值口径

`searchCrawler200Observed` 和 `aiUser200Observed` 来自 `seo-state/visibility/2026-11.main.report.json` 中各 Bot 的 `topPaths`，只累计已列出的成功请求。

- `high-ai-user-observed`：来源文章出现在短窗口 AI 用户成功抓取记录中，优先人工复核。
- `medium-search-crawler-observed`：来源文章出现在短窗口搜索爬虫成功抓取记录中。
- `unranked-not-in-report-top-paths`：未进入上述榜单，不代表访问量为 0、页面无价值或图片可删除。
- 当前日志只覆盖 2026 年 11 月 24–27 日的轮换窗口，不是完整自然月。AI 爬虫请求、搜索爬虫请求均不等于收录、排名或 AI 回答引用。

## 字段说明

| 字段 | 含义 |
| --- | --- |
| `imageUrl` / `sourceDomain` | 原始图片 URL 与来源域名；重定向后的地址另见 `finalUrl` |
| `ownershipScope` / `assetKind` | 本站或外部素材；正文图片或动态徽章 |
| `authorizationStatus` | 授权状态；外部素材未确认前不得直接本地化 |
| `availability` / `httpStatus` / `contentType` | 单次 HTTP 检查分类及原始响应信息 |
| `checkMethod` / `curlExitCode` | HEAD 或 Range GET 回退，以及 curl 退出码 |
| `valuePriority` | 基于现有短窗口证据的人工复核优先级，不是页面价值评分 |
| `localFile` / `localFileExists` | 本站 `/images/` 绝对 URL 对应的静态文件及存在性 |
| `occurrenceCount` / `articleUrls` / `sourceLocations` / `altTexts` | CSV 中的合并引用信息；JSON 的 `occurrences` 保留逐项明细 |
| `recommendedAction` | 结合所有权和可用性给出的下一步建议；本站缺图进入恢复/替换队列，外部 404 进入替换/移除复核，异常响应先人工检查。不代表已执行 |

## 使用顺序

1. 先筛选外部 `missing`，结合来源文章价值和正文语义确认是替换、移除还是补回素材。
2. 再人工检查 `restricted`、`check-error` 和非图片响应，保留检查日期与真实证据。
3. 对确认需要保留的外链素材，先补授权证据，再逐篇本地化，记录来源、尺寸和 SHA-256，并运行完整构建及 SEO 回归。
4. 不为追求清单归零而批量下载第三方图片，也不把所有未上榜素材视为低价值。
