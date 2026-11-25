# Archify 示例图片来源

本文档记录 2026-11-25 核对的 4 张上游示例图。二进制文件此前已随文章保存到本目录；本次仅把文章中的远程引用切换为本地文件，没有重新压缩或修改图片内容。

- 上游项目：https://github.com/tt-a1i/archify
- 不可变提交：`808f84e931e684bcd3b5790328211520d3222983`
- 提交对应日期：2026-07-03，与文章原始发布日期一致
- 许可证：MIT，原文见下节
- 核验方式：逐文件比较上游提交与本地文件的 SHA-256，并读取 PNG 尺寸

| 本地文件 | 上游 `docs/assets/` 文件 | 尺寸 | SHA-256 |
| --- | --- | --- | --- |
| `workflow.png` | `archify-workflow.png` | 2880×3120 | `643FBD0125D0B027FA7CEF815879372AE47A48A7D082ACA0DAB420D3C443BA82` |
| `sequence.png` | `archify-sequence.png` | 1400×1320 | `58A645F1C131E3836EE68C2FA8736EDC081A2FADD4E9BB6E3E8424307260C2E5` |
| `dataflow.png` | `archify-dataflow.png` | 1400×1320 | `F0CFE2F84ACEA670DFC8A44BACE7EF93F677FF7472C9573BA377F454653CEF60` |
| `lifecycle.png` | `archify-lifecycle.png` | 3920×2640 | `E5C27C252993339F119A1826E88A92BE8F62AC139A233A6CF16AF59B6970BD3C` |

上游文件 URL 形式：

```text
https://raw.githubusercontent.com/tt-a1i/archify/808f84e931e684bcd3b5790328211520d3222983/docs/assets/<上游文件名>
```

## MIT License

Copyright (c) 2026 tt-a1i (Archify)

Copyright (c) 2025 Cocoon AI (original "architecture-diagram-generator")

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
