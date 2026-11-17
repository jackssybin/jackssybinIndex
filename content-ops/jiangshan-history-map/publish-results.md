# 江山时序 三端推广发布结果（2026-11-17）

## 项目
- 仓库：https://github.com/DeanChensj/jiangshan-map
- 定位：中国历史交互舆图（前403三家分晋—今），数字人文项目，时间轴+点地溯源+人物行迹+寻址测验
- 数据（发布时实测）：7096 Star / 831 Fork / JavaScript / GPL-3.0 / 建仓 2026-07-23，push 2026-11-16（活跃）
- 在线：https://deanchen.me/jiangshan-map/

## 源码核实的关键事实
- 零框架：无 package.json/node_modules，未引用 leaflet/mapbox/d3；17 个原生 JS 模块、约 3.45 万行（app.js 10772 行最大），自研 SVG/Canvas 投影
- 数据：18 朝代目录、206 个 GeoJSON（约32MB）、205 个时序快照（README 对外口径 198，内部已扩展到 205）
- 快照字段：caption/note/prefRef/regionRef/polities[]/regions[]/prefectures[]，数字 ID 索引
- 压缩：每字符 5 位自定义坐标编码、ring() 经纬度增量、shape 几何缓存、按朝代懒加载、字体子集化
- 四玩法：时间轴（朱砂虚线残影+帝王年号+水系演进）、点地溯源（沿革表+名关）、点人溯事（7人物：秦始皇/张骞/诸葛亮/玄奘/李白/苏轼/王阳明；3事件：楚汉/安史/靖康）、寻址测验
- 26 部典籍 works.json、34 个 topics 专题页、llms.txt、Deep Links（year/place/person/embed）、PWA
- 四语言 README（简繁英日）；Dockerfile 三行 nginx-alpine
- 祛魅：疆域为示意非精确国界；快照密度不均；GPL-3.0 强 copyleft；无后端靠 PR；TTS 依赖浏览器
- 数据修正：配图初稿出现无依据的"3486 个 ID"，核实源码最大引用 ID 为 3819 但非实体总数，已改为"政权/政区统一用数字 ID 索引"并复检

## 一、网站端（Hugo，已构建验证 + push）
- 源文件：content/articles/2026/11/17/jiangshan-history-map.md
- 图片：static/images/jiangshan-history-map/（cover-zhihu + 4 正文图）
- hugo --destination /tmp/hugo9 exit 0
- 预期 URL：https://jackssybin.cn/articles/2026/11/17/jiangshan-history-map/

## 二、微信公众号（仅草稿）✅ 成功
- Media ID：snS2bupQYF5HgHImnpl8sfQV5hij-jgk9MFKmJquksUD-GDn8iP5zT7aD4uY-e7l
- 首次 publish 报通用失败，重试即成功（临时抖动，非内容问题）
- 主题 newsroom/github；封面 IP 双翼 1280×544，随机选中 c3（paper 冷白 + 困惑 + 橙#F97316，左翼18），verify rc=0 + vision 通过，combo-history 已追加
- 正文 4 图全过 vision QA
- digest 86 字（≤120）、content_source_url=GitHub，draft/update errcode 0
- 踩坑：账号草稿已 363 篇，set_digest.py 原 count=5 查不到新稿；已改为 count=20 + 按标题匹配（不依赖固定位置/硬编码 id，因分页排序不稳定）
- 引流模块 + 2 条真实内链（剪映免费工具、开源编码 Agent）

## 三、知乎专栏（仅草稿）✅ 成功（cookie 正常，一次走完）
- 正式稿（compact HTML，采用）：https://zhuanlan.zhihu.com/p/2106009166812821405
  - id 2106009166812821405，4 图传 CDN 裸 img，6 个 h2，无紧凑性违规
- ⚠️ 多余草稿待手动删（首次 markdown 传图产生）：id 2106009009971124073
- 封面发布时手动选 cover-zhihu.png（1600×900）

## 配图 QA
- 宣纸古舆图风（宣纸米底+墨黑+朱砂红+石青+赭石），契合历史地图主题
- grep 检查无 yy 漏等号；5 图全部 vision_analyze 复检；3486 错误数据修复后已复检确认
