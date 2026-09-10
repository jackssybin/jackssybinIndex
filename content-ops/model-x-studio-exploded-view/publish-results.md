# Model X Studio 三端发布结果

- 项目：https://github.com/ashemag/model-x-studio
- 在线 demo：https://model-x-studio.vercel.app
- 仓库数据（发布时 2026-09-10）：218 star / 62 fork，TypeScript，2026-09-04 创建
- slug：`model-x-studio-exploded-view`

## 论点与证据

- 论点：把手工 K 帧的 3D 爆炸图变成可验证的二维投影装箱问题（app/explosion-layout.ts，33 行），334 个零件零重叠、三宽高比（0.7/1.3/2）断言不出画；核心工程价值在布局算法 + 渲染取舍 + 资产管线 + WebMCP 工具注册。
- 一手证据：
  - 线上 demo 实测截图 3 张（整车 / 334 件全爆炸矩阵 / 部件详情 Illustrative 徽标）；
  - 通读源码：page.tsx(80)、vehicle-scene.tsx(194)、explosion-layout.ts(33)、parts.ts(40)、pointer-tap.ts(21)、scripts/convert-model.py、validate-explosion.mjs；
  - manifest 统计：334 件分布 body180/wheels94/cabin38/glass12/doors10；整车 bounds 5.056×2.276×1.680 m（VALIDATION.md）；glb 17MB。
- 标题候选（3 选 1，选用量化结果型）：
  1. （量化结果，已选）334 个零件零重叠：这个开源项目把特斯拉 Model X 拆给你看，核心布局算法只有 33 行
  2. （人群点名）做 3D 可视化的前端都该看看：33 行代码算完整车爆炸视图
  3. （悬念提问）3D 爆炸图还在手 K 动画？这个开源仓库把它变成了一道装箱题

## 网站（Hugo / jackssybinIndex）

- 文件：content/articles/2026/09/10/model-x-studio-exploded-view.md（约 4000 中文字，3 张正文图）
- 图片：static/images/model-x-studio-exploded-view/（5 张：3 正文 + 微信/知乎封面）
- frontmatter 含 url 所需 date/lastmod/description/topic/topicSlug/layout:article/contentType:article/cover；无 shell 占位符、无 shortcode 图片。
- 已 commit + push main：701a232（jk 偏好：不本地 hugo 校验，直接推 main 部署）。
- 预期 URL：https://jackssybin.com/articles/2026/09/10/model-x-studio-exploded-view/ （以实际域为准）

## 微信公众号草稿

- 文件：content-ops/model-x-studio-exploded-view/wechat-upload.md（frontmatter title + 绝对 cover 同文件，正文 2019 中文字，3 图）
- 封面：media/cover-wechat.jpg，1080×864 JPG（实拍爆炸矩阵 + 中文标题叠加，vision QA 无乱码）
- validate-payload.mjs：通过，0 建议项（阅读原文/星标/在看/相关阅读三件套齐全；相关阅读为纯文本，规避 45166）
- publish.js 结果：发布成功
- Media ID：snS2bupQYF7HgHImnpl8saGYj2tLwTKI0gCb2sRnwVsWn657R0tQwoYBe_V-AGtN
- 主题：newsroom（github）
- 后台：https://mp.weixin.qq.com/ 草稿箱

## 知乎专栏草稿

- 标题：开源项目 Model X Studio：334 个零件的浏览器 3D 爆炸视图是怎么实现的
- 模式：column + Markdown --upload-images（4 张本地图全部替换为 zhimg CDN）
- 草稿 ID：2081467006038062288
- 编辑 URL：https://zhuanlan.zhihu.com/p/2081467006038062288/edit
- 正文约 1589 中文字，论点先行、无公众号 CTA、结尾仅一句克制的专栏引导。
- Gate 3：payload 无 pipe 表格、无 `<table>`（grep 均为 0），4 张图均为单层 ![](abs) 写法。
- uploaded_image_count：4/4（cover-zhihu + 3 正文，响应 JSON 全部 uploaded:true）。
- 注：封面 1600×900 cover-zh.jpg 已作为正文首图随稿上传（知乎专栏无独立封面设置 API）。

## 图片清单（media/）

- cover-wechat.jpg 1080×864（微信专用，与知乎封面不同）
- cover-zhihu.jpg 1600×900（知乎专用）
- 01-assembled.jpg / 02-exploded.jpg / 03-detail-panel.jpg 1280×579（demo 实拍，两稿共用）

## 未验证 / 边界声明（已写入文章）

- 334 件为艺术家网格岛，非特斯拉 OEM 零件号；电池/电驱/悬挂为示意几何；车型为改款前、年款未核实（作者自述）。
- WebMCP 工具注册为特性检测，真实浏览器执行作者标注未验证，文中如实转述。
- glb 资产受 BlendKit Royalty Free 许可约束，商用需自行确认授权。
- 浏览器 FPS 未做基准测量；加载耗时受 17MB 模型与网络影响，未给具体跑分。

## 清理

- 临时克隆 /root/.cache/tct/model-x-studio 与截图目录保留至本会话结束后可删；仓库未写入任何凭据文件。
