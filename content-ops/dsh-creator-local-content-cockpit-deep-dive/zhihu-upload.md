# AI 内容工具都在做云平台，这个开源插件为什么坚持把内容留在本地文件夹？

最近两年 AI 内容工具的产品形态高度趋同：云端编辑器、云端素材库、云端渲染，然后按订阅收费。它们共同的隐含前提是——你的创作上下文应该托管在平台的数据库里。这个模式的代价在长期使用后才显现：导出的内容是丢失结构的快照，跨工具迁移几乎不可能，平台的功能列表决定了你的工作流边界。

最近读到的开源项目 [Jacky Creator（仓库名 DSH-Creator）](https://github.com/Jackywxsz/DSH-Creator)给出了另一种答案。它是 DeepSeek Harness 桌面端的社区插件，当前 v0.1.0-beta.8，MIT 协议，基于上游 dsh-oil-creator 继续开发。我在 Linux 上 clone 了仓库、安装依赖并跑通完整测试套件，通读了 src 约 1.7 万行 TypeScript 和全部文档。这篇文章不谈产品宣传，只分析它三个值得讨论的架构选择，以及对应的代价。

## 选择一：以文件系统作为唯一真相源

Jacky Creator 最根本的决策是：一条内容就是内容目录下的一个普通文件夹（默认 `~/Movies/视频项目/YYYY-MM-DD_标题/`）。topic.md 是选题，script.md 是脚本，mp4/mov 是成片，srt/ass 是字幕，三张不同画幅的 png 是封面，公众号文章也是标准 Markdown。文档原话是「磁盘上的文件是正文、脚本、文章、字幕、封面和发布包的准；插件工具不负责再读一遍这些文件」。

![内容文件夹契约](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-folder-contract.png)

插件自身的状态文件只存四类元数据：目录路径、创作者档案、工程绑定、发布标记与同步回来的播放数据，不保存任何正文。这是经典的「files over databases」思路在 AI Agent 时代的再现，和 Obsidian、纯文本笔记运动一脉相承。

这个选择的收益是确定的：无厂商锁定（卸载插件不删内容目录）、任何编辑器可介入、Agent 每次直接读磁盘现状所以不存在缓存幻觉。代价同样真实：一致性要靠约定维护，多人协作没有内建方案，跨设备同步需要用户自己配 Git 或网盘。它本质上是为个人创作者设计的单机工作台，不是团队 SaaS。

## 选择二：显式的人机分工，而不是「全自动」叙事

插件向 Agent 暴露 14 个统一前缀的工具，但文档花了相当篇幅定义 Agent **不能**做什么：

![14个工具与人机边界](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-tools-boundary.png)

四个动作被永久保留给人：在 Screen Studio 里录制并导出 MP4、字幕预览确认专有名词、核对封面标题与错别字、在各平台点最终「发表」。所有写操作遵守先预览后确认的模式，setup 工具只接受已存在的目录，organize_library 默认只预览重命名方案，字幕烧录产物另存为 `_subtitled` 文件而不覆盖原片。

从工程角度看，这种克制是有安全意义的。Agent 工具链最大的风险不是能力不足，而是**误操作的不可逆性**——覆盖成片、误发内容、批量重命名出错。它用两个机制把风险压住：一是长任务全部异步化，以文件落盘（文件大小稳定）作为完成信号，而不是信任一次进程启动；二是发布数据回收只读化，每次开独立的 Ego Browser 空间，翻完已发布列表写回数据即关闭，平台有但本地没有的条目不自动创建。

不那么好听的一面是：它因此不是一个「一句话出片」的产品。如果用户期待的是全自动矩阵号，这里的每一步确认门都会被视为摩擦。工具的目标用户显然是愿意参与质量控制的创作者，而非纯流量工厂。

## 选择三：能力检测的诚实性

源码里有个容易被普通用户忽略、但很能说明工程态度的设计。`src/capabilities.ts` 把每项扩展能力标成 ready / missing / unsupported 三态：Screen Studio 在非 macOS 上明确标 unsupported 并说明「其他内容管理能力仍可使用」；Jacky Cover 的品牌私有层没有可验证的公开安装源时，设置页只显示缺失，不提供伪造的一键安装；找不到 Jacky 版发布器时兼容公开的 video-publisher，但文档明确要求不得把兼容包改名伪装成自有 Skill。

在一个充斥着 demo 驱动开发、功能列表先于实现的领域，「不伪造入口」是个少见但重要的自我约束。

## 代码层面的验证

README 的说法需要代码佐证。实测环境 Node v22.22.0（满足 package.json 要求的 >=22.19.0）：

![pnpm test 实测结果](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-tests.png)

`pnpm install --frozen-lockfile` 39.2 秒完成；`pnpm test`（Vitest 4.1.10）结果为 56 个测试文件、351 个用例全部通过，耗时 31.71 秒。测试覆盖了能力安装、发布晋升、持久化、内容工作流和品牌术语一致性，其中包括对历史事故的回归测试（beta.5 的封面人物边缘误判）。运行时依赖仅 zod 一个，DSH 生态包全部声明为 peerDependency，插件包体很薄。

需要说明的验证边界：插件 UI 与制作链路的官方运行环境是 macOS + DSH Desktop 2.0.2，我的 Linux 环境只能验证构建与测试层；Screen Studio 绑定、Ego Browser 数据回收、字幕烧录这些 macOS 专属路径未实机运行，README 也明确声明 Windows x64 不是推荐环境。

![内容生命周期闭环](/root/jackssybinIndex/content-ops/dsh-creator-local-content-cockpit-deep-dive/media/diagram-pipeline.png)

## 适用边界

适合现在评估的，是 Mac 主力、已经在用或愿意尝试 DeepSeek Harness、且对内容主权敏感的个人创作者——尤其是素材散落在多个 SaaS、希望所有产物保持 md/mp4/srt/png 等开放格式的人。多平台分发者也能直接用上四平台状态管理与只读数据回收，而且授权默认是全关的。

需要等待的有三类：Windows/Linux 用户（核心管理可用，制作扩展半残）；期待全自动出片、不愿意过确认门的用户；以及要求生产级稳定性保证的团队——版本号仍是 0.1.0-beta.8，beta.7 刚做过一次不兼容的工具命名硬切换。另外注意一个法律细节：代码是 MIT，但名称、Logo、芽仔形象等品牌资产不随 MIT 授权（BRAND_ASSETS.md），二次分发前需要单独确认边界。

## 小结

Jacky Creator 提供的不是更强的模型能力，而是一种关于「AI 应该在什么边界内介入创作」的具体立场：内容留在本地文件，流程交给 Agent 推进，不可逆动作保留给人。在云端托管叙事成为默认值的当下，这种反方向的严肃尝试本身就值得关注，而 351 个全绿测试和「不伪造入口」的实现细节，让它至少不是一个停留在 README 层面的立场。

项目地址：https://github.com/Jackywxsz/DSH-Creator
