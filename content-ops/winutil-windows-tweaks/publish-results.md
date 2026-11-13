# WinUtil 三端推广发布结果（2026-11-13）

## 项目
- 仓库：https://github.com/ChrisTitusTech/winutil
- 定位：开源 Windows 系统工具（WPF GUI），软件批量安装、系统 tweaks、预装 Appx 移除、修复与更新管理
- 数据（发布时实测）：65966 Star / 3884 Fork / PowerShell / MIT / 建仓 2022-04-28，push 2026-11-13（头部活跃项目）
- 主页：https://winutil.christitus.com/

## 源码核实的关键事实
- 规模：194 个 .ps1、约 2.98 万行；63 个 Pester 测试；WPF+XAML GUI，Runspace 线程池后台执行
- 配置与逻辑分离（config/*.json）：
  - applications.json 239 个应用（winget，可切 Chocolatey，icons 目录正好 239 个 PNG）
  - tweaks.json 69 组 480 项注册表调整，其中 49 组带 OriginalValue 可 undo
  - appx.json 34 组 201 个预装移除项；feature.json 33 组；dns.json 8 组 42 条
- 编译链路：Compile.ps1 合并函数+内嵌 JSON/base64 图标+XAML → 单文件 winutil.ps1；GitHub Actions（pre-release.yaml）在 windows runner 编译签名发布
- 一键命令 irm christitus.com/win | iex = Invoke-RestMethod 拉内存 + Invoke-Expression 执行（不落盘）
- 安全设计：tweaks 前还原点优先（代码注释明示先于一切修改）、OriginalValue 记录+Undo All、Advanced/CAUTION 高危分区、Pester 测试
- preset.json 实测：Minimal 4 项 / Standard 12 项 / Advanced 17 项（含还原点）/ AppxDefault 18 项；支持 -Preset 无界面自动化
- 祛魅：irm|iex 远程内存执行的信任风险；管理员权限影响整机；去 Edge/OneDrive 难逆转；开源 MIT 版功能完整，作者另有付费 .NET 重写版（非阉割开源版）

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/13/winutil-windows-tweaks.md
- 图片：static/images/winutil-windows-tweaks/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo7 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/13/winutil-windows-tweaks/

## 二、微信公众号（仅草稿）✅ 成功
- Media ID：snS2bupQYF7HgHImnpl8sQAYmO43lbcHMXsyIKsWXY-NyLgR0vOa-rz41_6G1ylW
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c1（cream-grad 米黄渐变 + 委屈 + 橙#F97316，左翼6.6），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA（封面首版副标题被卡片裁切，已拆两行重渲染并复检通过）
- 独立 digest 71 字、content_source_url=GitHub，draft/update errcode 0
- 引流模块 + 2 条真实内链（媒体下载神器、剪映免费工具）

## 三、知乎专栏（仅草稿）✅ 2026-11-13 cookie 更新后补发成功
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2104664384266154267
  - id 2104664384266154267，4 图传 CDN 裸 img，7 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2104664271653180892
- 封面发布时手动选 cover-zhihu.png（1600×900）

### 历史（cookie 过期阶段，已解决）
~~## 三、知乎专栏（仅草稿）❌ 仍失败：cookie 过期未恢复（第 3 篇）~~
- 现象：/api/v3/me 仍返回登录页 HTML；cookie 文件停在 2026-10-13
- 处理：未静默标成功，未产出知乎草稿；微信走独立认证不受影响
- 已备补发物料：zhihu.md（终稿）、build_zhihu_html.py（IMG 待 CDN 回填）、zhihu-compact.html（本地占位备份）、zhihu-retry.sh
- 用户需做：重新导出知乎 Cookie 覆盖 /root/.hermes/secrets/zhihu_cookie.txt（真人登录/扫码，agent 无法自动完成），然后 bash zhihu-retry.sh，回填 CDN、删首次 markdown 多余草稿
- 封面发布时手动选 cover-zhihu.png（1600×900）
- 待补发队列（同一 cookie）：novel-to-game-skills、posewear-ai-tryon、winutil-windows-tweaks（共 3 篇，cookie 恢复后可一起补）

## 配图 QA
- Windows 蓝工程风（深靛蓝底+微软蓝+青+琥珀），契合系统工具主题
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检；封面发现副标题裁切后已修复复检
