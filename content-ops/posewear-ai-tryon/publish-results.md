# PoseWear 三端推广发布结果（2026-11-13）

## 项目
- 仓库：https://github.com/atuizz/posewear
- 定位：纯静态参考图库（姿势/深度姿势/服装/CC0 人像）+ 浏览器内 AI 试穿工作台，Cloudflare Pages 部署
- 数据（发布时实测）：108 Star / 42 Fork / Python+原生JS / MIT / 建仓 2026-10-30，push 2026-10-31（很新）
- 在线：https://posewear.pages.dev

## 源码核实的关键事实
- 前端无框架原生 JS：app.js(186行)/studio.js(237)/extras.js，PWA + Service Worker，数据存 localStorage + IndexedDB
- 深度姿势 1439 条（depth/packs/gia-depth/items.json，四类，带日文原名）
- 四家服务商：OpenAI(images/edits,审核最严)/Gemini(Nano Banana)/豆包Seedream(默认代理解决跨域)/自定义中转
- 代理 functions/api/proxy.js 四道闸：同源校验、官方域名白名单(OFFICIAL正则)、拒内网/非标https、每IP 60s 限流(API 20/图40)，no-store 不记录
- CSP（post.py 生成 _headers）：connect-src 限厂商域名、object-src none、frame-ancestors none、脚本哈希白名单
- NEUTRAL 双语正则中性化：性感→时尚、低胸→V领、比基尼→泳池边时装、内衣→内搭、裸露删除；只改措辞不动服装姿势，不绕过真违规审核，可关
- 测试：Playwright 拦截接口模拟成功/密钥错/限流/5xx/超时/安全拦截，不需真 Key

## 关键版权边界（重点）
- MIT 只覆盖代码/文案/构建脚本，不含任何图片数据
- 姿势+服装图版权归 @giaaibusi，原站未标开放许可，商用/转载须先授权
- 深度姿势热链原站不进仓库；人像 CC0（AI 虚构，勿冒充真人，原作者希望别原样批量转载）
- 仓库不含素材，自部署需先 fetch-assets.py 下载数 GB

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/13/posewear-ai-tryon.md
- 图片：static/images/posewear-ai-tryon/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo6 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/13/posewear-ai-tryon/

## 二、微信公众号（仅草稿）✅ 成功
- Media ID：snS2bupQYF7HgHImnpl8sYZzTXquSgTyRo94UbjKzr6xms9O7S8TxqRZX5DSKgFO
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c2（amber 深琥珀棕 + 开心 + 绿#07C160，左翼4），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- 独立 digest 63 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（AI 出图 Skill、DeepSeek 接入指南）

## 三、知乎专栏（仅草稿）❌ 仍失败：cookie 过期未恢复
- 现象：/api/v3/me 仍返回登录页 HTML；cookie 文件停在 2026-10-13（与上一篇 novel-to-game 同一问题，用户尚未更新）
- 处理：未静默标成功，未产出知乎草稿；微信走独立认证不受影响
- 已备补发物料：zhihu.md（终稿）、build_zhihu_html.py（IMG 待 CDN 回填）、zhihu-compact.html（本地占位备份）、zhihu-retry.sh（一键补发）
- 用户需做：重新导出知乎 Cookie 覆盖 /root/.hermes/secrets/zhihu_cookie.txt（真人登录/扫码，agent 无法自动完成），然后 bash zhihu-retry.sh，回填 CDN、删首次 markdown 多余草稿
- 封面发布时手动选 cover-zhihu.png（1600×900）
- 备注：novel-to-game 上一篇的知乎也在等同一 cookie 更新，可一起补

## 配图 QA
- 时尚杂志亮底风（奶油底+墨黑+品牌红+暖金），区别于前几篇科技暗色风
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切，封面无卡片遮挡，浅底对比度达标
