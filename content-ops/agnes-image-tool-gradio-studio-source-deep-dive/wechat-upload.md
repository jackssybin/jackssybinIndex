---
title: 读完2379行源码：这个29 Star的开源工作台，把AI出图和出视频装进了同一个网页
cover: /root/jackssybinIndex/content-ops/agnes-image-tool-gradio-studio-source-deep-dive/media/cover-wechat.jpg
source_url: https://github.com/you-want/agnes-image-tool
---

做短视频素材的人，工具链大概率是分裂的：图片在一个 AI 网站生成，视频要换另一个平台，想让图片动起来，还得先把图传到图床、复制一条公网链接。想省钱自己搭个本地的，ComfyUI 的节点画布学一下午，显卡还未必跑得动。

这周我翻到一个 29 Star 的小开源项目 agnes-image-tool，思路完全不同：它自己不跑任何模型，只做一个网页工作台，把模型厂商的图像和视频 API 全收进 `localhost:7860` 一个页面。我没有照着 README 念，而是把仓库 clone 下来，读完了全部 2379 行 Python 源码。

读完的结论是：这是一份被低估的「API 封装参考实现」，小，但有两处工程细节值得单独讲。

![七个标签页功能矩阵](/root/jackssybinIndex/content-ops/agnes-image-tool-gradio-studio-source-deep-dive/media/diagram-tabs.png)

## 先说清楚：它不耗 GPU，算力全在 API 侧

预期先摆正。整个项目的依赖只有四个：gradio、openai、requests、pillow，没有一块模型权重。真正出图出视频的是远端的 Agnes AI 接口（OpenAI 兼容协议），本地这个进程只负责拼参数、转图片、轮询任务、下载结果。

好处是部署成本几乎为零：本地五分钟跑起来，免费的 Hugging Face Spaces CPU 档位就能挂公网。代价也写在明面上：能力上限和稳定性全绑在 API 厂商身上，免费额度规则我没有真实 Key 验证，打算长期用的人得自己先确认计费。

背后是两个具体模型：图像走 `agnes-image-2.1-flash`，官方文档对它的定位是「高信息密度图像」优化——复杂构图、密集元素、语义对齐场景，文生图和图生图共用同一个模型；视频走 `agnes-video-v2.0`。接口完全兼容 OpenAI 的 images/generations 协议，这也是为什么客户端里同时出现了 openai SDK 和 requests：图像直连 HTTP 接口，视频走另一套异步任务接口。换句话说，只要你用过任何 OpenAI 兼容服务，这套代码的请求结构看一眼就懂，想换成别的兼容厂商，改动也集中在 base_url 一个常量上。

安装就四条命令：

```bash
git clone https://github.com/you-want/agnes-image-tool.git
cd agnes-image-tool
pip install -r requirements.txt
export AGNES_API_KEY="你的密钥"
python app.py
```

打开 `http://localhost:7860`，七个标签页：文生图、图生图、文生视频、图生视频、多图视频、批量、历史。

图像尺寸给了三档：1024×1024 方图、1024×1792 竖图、1792×1024 横图，正好覆盖通用场景和抖音横竖屏；文生图还留了 negative_prompt（反向提示词）输入框。视频侧规格更细：480p/720p/1080p 三档分辨率、16:9 到 9:16 五种比例、12–60 帧率可选，最长 18 秒。「批量」标签页支持每行一个提示词一次性出一组图，「历史」页把生成记录写进本地 history.json，最多留存 100 条，成品自动落到 outputs/ 目录可以直接下载。对一个定位为个人操作台的工具来说，这套功能闭环是完整的。

## 源码细节一：视频时长为什么只有六个固定档

翻 `config.py` 时，一张表先抓住了我：

```python
DURATION_TO_FRAMES = {
    3: 81, 5: 121, 8: 201, 10: 241, 15: 361, 18: 441
}
```

六个帧数全部满足 **8n+1**：81=8×10+1，121=8×15+1，441=8×55+1。这不是巧合。`api_client.py` 在发请求前还有一道工序：先按分辨率上限截断帧数，再重新对齐到最近的 8n+1。

![视频帧数 8n+1 约束](/root/jackssybinIndex/content-ops/agnes-image-tool-gradio-studio-source-deep-dive/media/diagram-8n1.png)

这是视频扩散模型的典型硬约束：模型按时间块解码，每块 8 帧，相邻块共享一帧，n 个块合法帧数就是 8n+1。你要是绕过这个工具裸调 API，按「10 秒 × 24fps = 240 帧」的常识传参——240 不满足规则，请求要么被拒，要么被静默改掉片长。

所以界面上那六个时长按钮，本质是把模型底层的数学约束封进了产品选项。想要精确片长，用预设档，别自己算帧数。

## 源码细节二：图片能传本地，视频只认公网链接

第二个值得讲的是输入处理的不一致：

**图生图**直接读本地文件，转成 Base64 Data URI 发出去，开箱即用；**图生视频和多图视频**只收公网可访问的图片 URL，README 自己在功能表里标了「⚠ 需公网URL」。

原因很工程：视频是异步任务，服务器要在接下来几分钟里反复拉取参考图，请求里塞一大段 Base64 既臃肿又没法重试，传 URL 让服务端自己下载最稳。

代价是这成了部署时最容易踩的坑：你在 localhost 把服务跑起来，文生图图生图一切正常，到图生视频才发现喂不进图——本地图片的地址 API 服务器根本访问不到。公网部署也一样，参考图得先扔图床或对象存储。

视频轮询部分倒是写得扎实：5 秒一次轮询、失败指数退避最多重试 10 次、出片后自动下载落盘。也正因为生成一个 18 秒视频要等 1–10 分钟，自建 Nginx 反代时必须把读超时拉到 86400 秒——README 的配置这块写对了。

实际操作上补两条源码里读出来的细节。图生图的 strength 默认 0.75：想要「轻微换风格、保住原图构图」就往 0.3–0.5 拉，想要「只保留主体、场景重做」才推到 0.8 以上，这个滑块本质是 API 参数的直出，别当玄学按钮用。另外密钥管理有三层兜底：环境变量 `AGNES_API_KEY` 优先，其次读 `.env`，最后才是网页设置存下的 `.config.json`；仓库 `.gitignore` 已经把 `.env`、`outputs/`、`history.json` 全部排除，自己改代码时注意别把密钥提交上去就行。

## 部署：四条路，按场景选

![四条部署路径](/root/jackssybinIndex/content-ops/agnes-image-tool-gradio-studio-source-deep-dive/media/diagram-deploy.png)

- **本地直跑**：五分钟，自测最快；
- **Hugging Face Spaces**：公网使用首选，Gradio 是它的原生 SDK，CPU 免费档零休眠，Key 填进 Space 的 Secret；
- **Docker Compose**：supervisord 托管、4G 内存限制、健康检查、outputs 挂载，配置得像模像样；
- **VPS + Nginx**：记得开 WebSocket 升级头和长超时，证书直接上 Let's Encrypt。

还有两个源码层面的提醒。第一，仓库 `web/` 目录里藏着一个 Next.js 15 重写版（agnes-forge），API 调用走服务端路由，可以藏 Key；而 Gradio 版挂公网没有任何鉴权——**任何能打开你 Space 的人，都在花你的 Key 和额度**，要么自己加访问控制，要么只本地用。第二，项目最后一次推送停在约七周前，0 个开放 issue，不确定是稳定还是没人用，自己工作流用没问题，押长期依赖前先观察更新节奏。

顺带说个选型问题。最近封装同一家 Agnes API 的项目不止这一个：另一个 Agnes-AI-Platform 是 Vue + FastAPI 的全栈平台，162 个后端接口、无限画布、MCP Server、用户体系都有，部署也重得多。两个项目的边界其实很清楚——要「十分钟有个能用的个人操作台」，选这个 Gradio 版，四个依赖、免费 CPU 档跑起来；要给团队搭多人用的内部平台、需要账号和素材管理，再去看全栈版。小而美和大而全，按人头选就行。

## 我的判断

**现在就适合装**：已经在用或想试 Agnes API、嫌 curl 和 SDK 麻烦的人；需要图片视频一条龙出素材、且有顺手图床的自媒体作者；想学「OpenAI 兼容多模态 API 怎么做产品封装」的 Python 开发者——轮询和错误处理那部分是干净的范例。

**先等等**：期待本地离线出片的人（断网即停）；要做公开多人服务的人（无鉴权，Key 共用）；对画质有硬性生产要求的人（我没能用真实 Key 验画质，建议小额先试）。

一个 29 Star 的项目，把模型约束、异步轮询、四种部署方式都老老实实写进代码和文档里，这份完成度在同类小工具里算得上超标。工具不大，但「把脏活封进选项里」这件事，它做对了。

---

我是 jack，一个只信「自己跑过、读过源码」的开源/AI 工具实测派。
每次帮你筛一个能真正省钱省时间的开源项目，坑我先替你踩。
觉得有用，点个「在看」并**星标**公众号，下次更新不迷路。
项目地址和完整命令我放在了「**阅读原文**」。

相关阅读：
- [剪映逼我开会员后，我找到了这个免费工具](https://mp.weixin.qq.com/s/bkYGzCKGOoT9AEtq1fnqMQ)
- [把 tldraw 画布焊进 Codex：Cowart 让 AI 和你共享同一块画桌](https://mp.weixin.qq.com/s/WweBc9T2c_bgcaLkF337mw)
