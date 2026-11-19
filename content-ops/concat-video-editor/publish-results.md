# Concat 三端推广发布结果（2026-11-19）

## 项目
- 仓库：https://github.com/jub0t/Concat（注意：用户给的是 jubOt，正确用户名是 jub0t，数字 0 非字母 O）
- 定位：本地优先、开源、跨平台视频编辑器，内置 MCP 让 AI Agent 操作时间线；无水印/无账号/无订阅/不上传
- 数据（发布时实测）：18665 Star / 2282 Fork / Rust / AGPL-3.0-or-later / 建仓 2026-08-25（仅 3 个月），push 2026-11-19
- 版本：v0.2.12（beta）；应用最新 release v0.2.11；主页 https://concat.standalones.org

## 源码核实的关键事实
- 规模：276 个 Rust 源文件、约 18.9 万行；18 个 crate 单一 Cargo workspace；Rust 1.93；187 个测试文件
- 架构：concat(主程序4.4万行,Slint+Skia) / core / media(1.67万,FFmpeg7) / render(GPU合成器,可选feature) / effects(约百种特效) / vision / speech / text / project(2万) / mcp / api / server / cli / export / log / host(2.5万) / mobile / android
- 22 个本地 AI 模型（manifest.toml）：RVM 人物抠像、ISNet 物体、SAM 笔刷、Real-ESRGAN 超分、Chatterbox/Kokoro TTS+声音克隆、Whisper 转写、Spleeter 人声分离
  - 模型不打进安装包，按需下载；sha256 校验、无摘要拒绝运行；HF 锁 commit；镜像到自有 models-v1 release
  - 网络仅在检查版本/下载模型时发生，剪辑推理全离线
- MCP（docs/MCP.md）：`concat --mcp`，window/headless 双模式，concat.lock 防双写，家目录沙箱（CONCAT_MCP_ROOTS 白名单），40+ 工具，schema 由 Rust 类型自动生成；另有 JSON-RPC，源码编译加 gRPC/CLI
- 能力：多轨/关键帧曲线/磁吸时间线/百种特效/4K60 10bit/H.264 HEVC AV1/代理素材；5 平台（mac/win/linux/android/iOS侧载）26 语言
- 祛魅：beta v0.2.x、300+ 开放 issue；Windows 未签名 SmartScreen 告警、ARM Win 暂停、iOS 侧载；本地模型吃算力；AGPL 强 copyleft（SaaS 二次开发也触发开源，闭源商用需买商业授权 LICENSING.md）

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/19/concat-video-editor.md
- 图片：static/images/concat-video-editor/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo10 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/19/concat-video-editor/

## 二、微信公众号（仅草稿）✅ 成功（一次通过）
- Media ID：snS2bupQYF7HgHImnpl8sVBz3Aaw1QVA7KMrNfuLijSvblKyLDCcts0hLAl3YiDp
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c2（paper 冷白 + 疲惫 + 橙#F97316，左翼22），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- digest 79 字（≤120）、content_source_url=GitHub，draft/update errcode 0
- set_digest.py 沿用按标题匹配法（账号草稿 360+，规避分页/硬编码 id 问题）
- 引流模块 + 2 条真实内链（Rust 无头浏览器、AI 副业 GitHub 地图）

## 三、知乎专栏（仅草稿）✅ 成功（cookie 正常，一次走完）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2106673073042870687
  - id 2106673073042870687，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2106672928175806059
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 专业剪辑软件深色风（石墨黑底+品牌蓝+青+紫+琥珀），呼应视频编辑器 UI
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检无乱码/叠印/裁切；封面 LBLUE 三元表达式正常渲染已确认
