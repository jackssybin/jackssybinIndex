---
title: "做公众号还在五六个工具间来回搬？这个本地软件把选题、写作、去AI味、排版、传草稿全包了"
cover: /root/jackssybinIndex/static/images/helpwriting-local-ai-content-workbench-deep-dive/cover-wechat.png
source_url: https://github.com/lfdc-code/helpWriteing
---

做一个公众号选题，你要打开多少个工具？热榜和新榜看选题，ChatGPT 里写稿，到处抄「去 AI 味」提示词，壹伴或 96 编辑器里套排版，最后登录后台复制粘贴传草稿。五六个工具，一上午，每一个都在收订阅费。

这周我翻到一个想把整条链路焊进一个本地软件的项目：**HelpWriting**。读完它 `master-pro` 分支的源码（先说第一个坑：它默认分支几乎是空的，代码全在 master-pro），我得说，完成度比多数同类玩具高，但它的「开源协议」藏着一个你必须知道的陷阱，文末细讲。

## 一句话进，一篇排好版的图文出

它的后端是 Python，桌面端用 PyWebView 包本地 FastAPI，核心编排器写了 1026 行。一次任务过八道工序：热搜选题、联网搜证、CrewAI 多 Agent 写作、维度化创意改写、本地去 AI 味、HTML 模板排版、传微信草稿，另有小说和漫画两个扩展出口。

![HelpWriting 八段管线：选题、AIForge取证、多Agent写作、维度变换、去AI味、34套模板排版、微信草稿上传、小说漫画出口](/root/jackssybinIndex/static/images/helpwriting-local-ai-content-workbench-deep-dive/pipeline.png)

热搜接了知微数据和 tophub 两个源，微博、抖音、B站、知乎、小红书等 11 个平台按权重抽题。写作不是一句提示词的事，是 CrewAI 里多个 Agent 分工跑，前面还有 AIForge 联网搜资料，专治模型闭眼瞎编。

## 把「洗稿」做成排列组合

再创作最怕的是只换几个同义词的伪原创。它的维度创意引擎把改写拆成视角、结构、语气几个维度，每个维度配一组预设选项，随机组合成具体指令——所以产出的差异是「这篇真的换了个讲法」，而不是「综上所述」换成「总的来说」。

代价也摆在台面上：维度选项是配置文件里有限的条目，跑多了组合会重复。它把创意工程化了，但没有创造创意。

## 去 AI 味：三层设计，外加一张讽刺的截图

去味这块是全项目最值得看的。它叠了三层：

1. **硬编码替换表**：「赋能→帮到」「抓手→办法」「闭环→把事情做完」「底层逻辑→根本原因」，外加「进行→做」「然而→但」这类翻译腔。简单、零成本、命中率高；
2. **「说人话」短语库**：第三方词典补充；
3. **humanizer 技能文档喂模型**：最后过一遍模型重写。

能不用模型就不用，模型只在最后出场——和整套系统的省钱思路一脉相承，而且全程本地，稿子不用发给第三方改写网站。

那「去味」到底是为了骗过谁？仓库自带一张很妙的截图：腾讯朱雀检测器的内置「AI 生成文本」示例，检测结果却是**人工特征 80.44%、AI 特征 0%**，直接判成人工创作。页面自己都印着「结果仅为辅助判断」。

![腾讯朱雀检测：内置AI样本被判80.44%人工特征、AI特征0%，判定人工创作特征显著](/root/jackssybinIndex/static/images/helpwriting-local-ai-content-workbench-deep-dive/de-ai-flavor.jpg)

连检测器对自家样本都判不对，说明「去 AI 味」的真实考官从来不是检测器，而是真人读者。想通这点，第一张朴素的替换表可能比什么都管用。

## 自己跑：五行命令，注意分支

```shell
git clone 仓库地址
cd helpWriteing
git checkout master-pro
uv venv && uv pip install -r requirements.txt
python main.py
```

模板库实测有 **34 套 HTML、12 个话题分类**（职场、情感、财经、科技、养生等），可指定可随机，直接绕开「微信清洗 CSS、排版反复试」的坑。仓库里连 exe 打包和安装包脚本都备好了，明显在按发给非技术用户的形态做。

![能力边界对照：七项已实现、授权开源版空实现、Apache2.0加NOTICE非商业条款、Windows优先](/root/jackssybinIndex/static/images/helpwriting-local-ai-content-workbench-deep-dive/capability-map.png)

## 最重要的提醒：这不是真正意义上的开源

仓库 LICENSE 写的是 Apache 2.0，GitHub 也给它打了宽松开源标签。但同目录的 `NOTICE` 追加了三条：**仅限非商业使用；未经作者书面授权禁止分发（包括分享、传播）；禁止拿来做 SaaS 或 API 托管服务**。

这三条和 Apache 2.0 授予的权利直接冲突。所以它严格来说是「源码可见」，不是 OSI 意义上的开源：自己本地学着用没问题，接进公司业务、改完发给别人、部署成服务，按条款都要先拿授权。开源是获客入口，商业授权才是作者留的变现通道。

**我的判断**：个人号作者尤其 Windows 用户，现在就值得试，确实能省下五六个工具；有商用或二次分发计划的团队，先解决授权再上车；冲着小红书抖音自动化去的也先等等，除微信外的适配器目前大多只是格式化入口。

内容工具拼到最后就两件事：少搬几次家，写得像人话。这个项目两件都答得不错，前提是你看清了那条协议边界。

项目地址请点击文末「阅读原文」直达（记得切 master-pro 分支）。

---

我是 jk，一个持续折腾 AI 自动化与量化交易的独立开发者。这个号只写我亲自读源码、跑通实测的开源项目拆解，觉得有用记得**关注 + 星标**，点个「在看」是对我最大的支持。

**点击文末「阅读原文」**，直达项目 GitHub 仓库。

**延伸阅读：**

- [30MB内存替代Chromium！这个开源Rust无头浏览器太香了](https://mp.weixin.qq.com/s/8CtFLrv-MO_ljIuRA4yJlw)
- [把 tldraw 画布焊进 Codex：Cowart 让 AI 和你共享同一块画桌](https://mp.weixin.qq.com/s/WweBc9T2c_bgcaLkF337mw)
