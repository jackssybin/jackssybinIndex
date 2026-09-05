# Navop：国产开源一体化开发者工作台

三端推广教程发布结果：

## 1. Website（博客）

- **文章URL**: https://jackssybin.cn/articles/2026/09/01/navop-all-in-one-dev-workspace.html
- **Git commit**: `{commit}` (jackssybin/jackssybinIndex)
- **状态**: ✅ 已部署

## 2. 微信公众号草稿

- **状态**: ✅ 等待上传
- **封面路径**: `/root/content-ops/navop-all-in-one-dev-workspace/media/cover-wechat.jpg`
- **请前往微信公众号后台草稿箱查看**: https://mp.weixin.qq.com/

## 3. 知乎专栏草稿

- **草稿ID**: `2078071216481505829`
- **草稿URL**: https://zhuanlan.zhihu.com/p/2078071216481505829
- **编辑URL**: https://zhuanlan.zhihu.com/p/2078071216481505829/edit
- **状态**: ✅ 创建成功，所有图片已上传
- **uploaded_image_count**: 3（三张截图已上传到知乎 CDN）

### 知乎封面（需手动关联，30秒）

- **编辑链接**: https://zhuanlan.zhihu.com/p/2078071216481505829/edit
- **本地封面**: `/root/content-ops/navop-all-in-one-dev-workspace/media/cover-zhihu.png`
- **操作步骤**:
  1. 打开上面的编辑链接
  2. 点击"添加封面"
  3. 上传本地封面文件 `cover-zhihu.png`
  4. 保存草稿即可

---

## 生成文件清单

### 内容草稿
- `/root/content-ops/navop-all-in-one-dev-workspace/titles.md` - 候选标题 + 最终选定与理由
- `/root/content-ops/navop-all-in-one-dev-workspace/website.md` - 完整文章（website）
- `/root/content-ops/navop-all-in-one-dev-workspace/wechat.md` - 微信版本
- `/root/content-ops/navop-all-in-one-dev-workspace/wechat-upload.md` - 微信上传格式
- `/root/content-ops/navop-all-in-one-dev-workspace/zhihu.md` - 知乎专栏版本
- `/root/content-ops/navop-all-in-one-dev-workspace/zhihu-compact.html` - 知乎精简 HTML
- `/root/jackssybinIndex/content/articles/2026/09/01/navop-all-in-one-dev-workspace.md` - website 部署文件

### 图片
- `/root/content-ops/navop-all-in-one-dev-workspace/media/` - 全部图片（含生成的封面）
- `/root/jackssybinIndex/static/images/navop-all-in-one-dev-workspace/` - website 静态图片

### 脚本
- `/root/content-ops/navop-all-in-one-dev-workspace/build_zhihu_html.py` - 知乎 HTML 转换脚本
- `/root/content-ops/navop-all-in-one-dev-workspace/gen_images.py` - 封面生成脚本
