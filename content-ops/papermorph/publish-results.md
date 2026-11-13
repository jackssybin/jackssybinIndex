# Papermorph 三端文章交付记录

日期：2026-11-13

## 当前状态

- 网站、公众号、知乎三端文章及上传前草稿均已完成。
- 四个真实案例均已通过官方公开页面核验，每端正文都包含四个案例与四张对应截图。
- 未上传公众号，未上传知乎，未公开发布网站，未提交或推送 Git。
- 当前稿件等待用户进行平台终审。

## 网站

- 主稿：`content/articles/2026/11/13/papermorph.md`
- 工作副本：`content-ops/papermorph/website.md`
- 正文汉字数：2619。
- 正文图片：4 张，使用 `/images/papermorph/...` 站点相对路径。
- 封面：`static/images/papermorph/cover-zhihu.png`，1600×900。
- 当前工作区不是完整 Hugo 站点，没有可核对的现有文章 frontmatter、站点配置与主题，因此未运行 Hugo 构建，也未填写虚构的预期发布 URL。

## 公众号

- 阅读稿：`content-ops/papermorph/wechat.md`
- 上传前草稿：`content-ops/papermorph/wechat-upload.md`
- 状态：仅保存本地，未调用上传工具。
- 标题：教材变动画课，故事变纸偶片：Papermorph 的 4 个真实案例。
- 封面：`content-ops/papermorph/media/cover-wechat.png`，1080×864。
- 正文图片：4 张，上传草稿内均为存在的绝对本地路径。
- 转换页脚包含账号人设、星标/在看提示、阅读原文提示和真实官方延伸阅读。
- 用户未提供公众号历史文章 URL，因此未伪造内链；相关阅读使用官方案例与示例书架替代。

## 知乎

- 阅读稿：`content-ops/papermorph/zhihu.md`
- 上传前草稿：`content-ops/papermorph/zhihu-upload.md`
- 状态：仅保存本地，未调用上传工具。
- 标题：Papermorph 值得试吗？从 4 个官方案例看互动内容的另一种做法。
- 封面：`content-ops/papermorph/media/cover-zhihu.png`，1600×900，与公众号封面不同。
- 正文图片：4 张，上传草稿内均为存在的绝对本地路径。
- 正文汉字数：1863。
- 首次上传应使用 Markdown 图片上传模式。尚未取得知乎 CDN 图片 URL，因此未生成 `zhihu-compact.html`，避免把本地路径伪装成可发布的远程图片。

## 真实案例

- 互动课程：https://papermorph.diamonddoge.org/linear-algebra/ch12/
- 儿童绘本：https://papermorph.diamonddoge.org/little-horse/ch01/
- 纪录片与短片：https://papermorph.diamonddoge.org/madness/
- 历史地图：https://papermorph.diamonddoge.org/time-of-the-magicians/

详细证据、页面步骤、时长和未验证事项见 `research.md`。

## 校验结果

- `node .../validate-payload.mjs --package .../content-ops/papermorph`：通过，0 个建议项；公众号上传草稿正文 2013 个汉字、4 张图片。
- 自定义路径与编码检查：网站主稿、网站副本、公众号上传稿、知乎上传稿均为 4 个案例、4 张正文图片；缺失图片为 0，Unicode 替换字符为 0，占位符为 0。
- 字数检查：网站 2619 个汉字；公众号阅读稿 2031 个汉字；知乎上传稿 1863 个汉字。
- 封面检查：公众号 1080×864，知乎 1600×900，尺寸与设计均不同。
- `narrative-spine.json` 已通过 PowerShell `ConvertFrom-Json` 解析。
- 已完成三端人工拟人化复读与禁用表述扫描，删除虚构客户/效果表述，保留不确定性和实测边界。

## 图片检查说明

- 四张案例图来自本次对官方公开页面的实际截图，未使用虚构示意图。
- 截图前移除了浏览器扩展按钮；自动播放受限提示仅作为自动化环境问题记录，没有据此评价产品音频质量。
- 封面中文字体源字符串、字体回退、尺寸和非空像素检查已通过。
- 当前 `view_image` 工具对 PNG/JPG 均返回 `Unsupported Image`，无法完成模型侧最终视觉确认。未上传任何图片；正式发布前需人工查看两张封面和四张案例图。

## 未执行事项

- 未进行公众号或知乎登录、草稿上传和公开发布。
- 未调用付费语音、绘画或视频 API。
- 未声称完成整本 Papermorph 作品、完整配音试听或 MP4 导出测试。
- 未运行 Hugo 构建，原因见网站部分。
