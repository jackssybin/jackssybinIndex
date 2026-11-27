# 2026-11 双站可见性首期基线

## 范围

- 归档时间：2026-11-27（Asia/Shanghai）。这是首次基线，不是完整自然月总结。
- 主站日志：3 个文件，实际覆盖 2026-11-24 17:15:02 至 2026-11-27 11:23:45（UTC+8）；读取 25,755 行，57 行无法解析。
- 资料馆日志：3 个文件，实际覆盖 2026-11-24 17:15:02 至 2026-11-27 11:20:09（UTC+8）；读取 4,616 行，65 行无法解析。
- 当前生产服务器只保留上述轮换窗口，因此不能用本次数据推算 11 月 1–23 日，也不能与后续完整月份直接比较。

## Nginx 日志结果

| 站点 | 月份内请求 | 可识别搜索爬虫 | AI 爬虫 | AI 用户触发抓取 | 未分类请求 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 主站 | 25,698 | 2,516 | 237 | 25 | 22,920 |
| 资料馆 | 4,551 | 150 | 8 | 0 | 4,393 |

- 主站：Baiduspider 2,239、Googlebot 15、bingbot 262；GPTBot 23、ClaudeBot 197、PerplexityBot 17；ChatGPT-User 20、Claude-User 5。
- 资料馆：Baiduspider 121、Googlebot 3、bingbot 26；GPTBot 8；本期未识别到 AI 用户触发抓取。
- 这些请求只代表可识别 User-Agent 的访问。UA 可能伪造，爬虫请求不等于收录、展示、点击、训练采用或 AI 引用。
- 逐文件首末时间、大小、压缩格式、解析失败和月份内请求数见两份报告的 `logCoverage`；报表不含 IP、Cookie、Referer、查询参数或原始日志行。

## 搜索平台官方数据

| 平台 | 主站 | 资料馆 |
| --- | --- | --- |
| 百度搜索资源平台 | 已读取站点级索引、流量与关键词、热门页面和抓取频次 | 站点列表未包含资料馆，记为未知 |
| Google Search Console | 当前账号对 URL 前缀资源和 Domain 资源均无权限，记为未知 | 无可读取资源，记为未知 |
| Bing Webmaster Tools | 当前未登录，记为未知 | 当前未登录，记为未知 |

百度原始 JSON 保存在本目录：

- `baidu-index-list.json` / `baidu-index-curve.json`：11 月 1–25 日共 23 个站点级日值；11 月 1 日为 290，11 月 25 日为 280，区间 271–290。站点索引量不能证明任何固定 URL 已收录。
- `baidu-crawl-frequency-last30days.json` / `baidu-crawl-time-last30days.json`：接口覆盖 10 月 28 日至 11 月 26 日；11 月 1–25 日抓取频次合计 179，11 月 26 日为空，不补零。
- `baidu-keyword-stats-last30days.json`：接口覆盖 10 月 28 日至 11 月 26 日；已返回的 11 月展示量和点击量数值均为 0，11 月 13 日为 `null`，因此不宣称完整自然月总计为 0。
- `baidu-keywords-last30days.json` / `baidu-pages-last30days.json`：近 30 天热门关键词和热门页面均为 `count: 0`，不能据此推断每个 URL 的展示或点击都为 0。

## 固定 URL 观察

- `2026-11.main.observations.json` 固定主站 9Router 文章、关于页、Linux 快速开始 3 个 URL。
- `2026-11.tools.observations.json` 固定资料馆关于页、AI 视频选型表 2 个 URL。
- 每个 URL 分别保留百度、GSC、Bing 记录；没有 URL 级官方导出时，`indexStatus` 为 `unknown`，展示和点击为 `null`，不使用站点级数据或日志抓取量代替。
- `aiCitations` 当前为空。T11 尚未执行固定问题抽测，空数组不表示没有 AI 引用。

## 后续复核线索

- 主站 bingbot 请求 `/images/book-to-skill-agent-skill/01-showcase.png` 出现 404；下一批优先核对文章内容、素材是否应本地化及是否需要恢复或重定向。
- 旧标签、旧文章路径和探测路径也有 404，应按真实页面价值与迁移清单分类处理，不批量把全部 404 改成 200。
- 后续月份保持相同 URL 集和指标口径，先补齐全月日志与官方平台权限，再评估 T7/T8 的内容和图片收益。
