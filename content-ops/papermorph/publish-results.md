# Papermorph 三端文章交付记录

更新日期：2026-11-14

## 当前状态

- 网站文章已公开，部署工作流成功，正文及三个 MP4 均已通过公网访问验证。
- 知乎文章已公开，知乎草稿 API 返回 `published`，公开页已实际打开核验。
- 公众号草稿已上传，8 张正文图和封面均上传成功；公开发布仍等待公众号后台扫码登录。
- 未群发公众号，未删除任何草稿，未调用付费生成 API。

## 网站

- 公开地址：https://jackssybin.cn/articles/2026/11/13/papermorph/
- Git 提交：`6d84f36 feat: publish Papermorph local case study`
- 部署记录：https://github.com/jackssybin/jackssybinIndex/actions/runs/43462178709
- 正文包含 4 张本地案例图、4 张官方案例图和 3 个原生视频播放器；公开 HTML 共 9 张图片（含封面）及 3 个 `<video>`。
- Hugo 全站构建成功：653 页。

### 视频公网验证

- https://jackssybin.cn/videos/papermorph/linear-algebra.mp4 ：HTTP 200，`video/mp4`，875455 字节。
- https://jackssybin.cn/videos/papermorph/little-horse.mp4 ：HTTP 200，`video/mp4`，2215998 字节。
- https://jackssybin.cn/videos/papermorph/madness.mp4 ：HTTP 200，`video/mp4`，1229296 字节。

## 公众号

- 标题：Papermorph 实测：4 个官方案例与 4 个本地原创试样
- 草稿 media ID：`snS2bupQYF7HgHImnpl8sXd_PmyajtZmIsxkDsAGudi43z5Pe3vA79ub13PVZOTY`
- 正文图片：8 张，全部上传为公众号素材；封面 1080×864。
- 上传稿：`content-ops/papermorph/wechat-upload.md`
- 原文链接已指向网站公开地址。
- `freepublish/submit` 返回 `48001 api unauthorized`，因此没有 publish ID，不能视为公开发布成功。
- 当前状态：草稿保留，等待登录 https://mp.weixin.qq.com 后在后台执行“发布”；不执行“群发”。

## 知乎

- 标题：Papermorph 值得试吗？4 个官方案例与 4 个本地原创实测
- 文章 ID：`2104734349887289068`
- 公开地址：https://zhuanlan.zhihu.com/p/2104734349887289068
- 状态：`published`，编辑器已切换为“更新”模式。
- 正文图片：8 张，公开页全部为知乎 CDN 图片；封面 1600×900 已生效。
- 公开页包含 3 个指向网站 MP4 的视频链接。
- 紧凑 HTML：`content-ops/papermorph/zhihu-compact.html`，未出现 `<p><img`、`<br><img`、`<p><br`、空表格或本地图片路径。

## 本地案例

- 线性代数互动课：截图、网页及约 33.47 秒 MP4。
- 小马过河纸偶绘本：截图、网页及约 23.69 秒 MP4。
- 《疯癫与文明》短纪录片：截图、网页及约 45.58 秒 MP4。
- 欧洲思想史互动地图：截图和网页；地图以点击阅读为主，未硬剪成视频。

## 校验记录

- `validate-payload.mjs`：0 个建议项；公众号上传稿 2324 个汉字、8 张正文图。
- 网站文章和三个 MP4 均返回 HTTP 200。
- 知乎公开页实际显示完整标题、正文、8 张内容图、封面及 3 个视频链接。
- 公众号“草稿上传成功”和“公开发布成功”分别记录；当前仅有前者完成。
