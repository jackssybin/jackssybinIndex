// 一次性迁移脚本：把 content/articles 下「中文 slug」的文章改成拼音 ASCII slug。
//
// 背景：这批文章（2026-06 ~ 2026-08 共 89 篇）的 frontmatter 里
//   slug: ai-明星公司排队上市普通人最该警惕什么
// 于是对外 URL 变成 /articles/2026/06/07/ai-%E6%98%8E%E6%98%9F.../
// 百度对中文百分号编码 URL 的抓取与索引明显弱于 ASCII，这是改版后
// 收录丢失的主要质量项之一（详见 SEO-百度收录丢失诊断报告 第九节）。
//
// 改法（不改文件名、不移动文件）：
//   1. slug: 中文 -> slug: 拼音（算法与 scripts/new-post.mjs 完全一致）
//   2. 补一行显式 url:，把产物路径钉死在 ASCII 上
//      —— 显式 url 让 Hugo 与 scripts/sync-site.mjs 的 inferUrl 口径一致，
//         否则 sync-site 会按「文件名」推导出中文 URL，与 Hugo 产物对不上。
//   3. 生成「旧 URL -> 新 URL」映射，写进 seo-state/slug-migration.json，
//      并注入 deploy/nginx-jackssybin.conf 的 301 映射表。
//
// 用法：
//   node scripts/migrate-chinese-slugs.mjs --report    # 只统计与预演（默认）
//   node scripts/migrate-chinese-slugs.mjs --apply     # 改写 frontmatter
//   node scripts/migrate-chinese-slugs.mjs --nginx     # 注入 nginx 301 映射表
//
// 注意：--apply 与 --nginx 都会写入仓库文件，属于生产变更的前置动作，
// 跑完必须执行 hugo 重建 + scripts/seo-check/* 回归。

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { pinyin } from 'pinyin-pro'

const ROOT = process.cwd()
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles')
const NGINX_CONF = path.join(ROOT, 'deploy', 'nginx-jackssybin.conf')
const MAP_JSON = path.join(ROOT, 'seo-state', 'slug-migration.json')

const MAP_BEGIN = '# --- 中文 slug 迁移 301 映射（由 scripts/migrate-chinese-slugs.mjs 生成）---'
const MAP_END = '# --- 中文 slug 迁移映射结束 ---'

const argv = process.argv.slice(2)
// 两个动作可以一起做：`--apply --nginx` 必须在**同一次扫描**里完成，
// 因为 --apply 之后 frontmatter 里的 url 已经变成新值，
// 再单独跑 --nginx 就推导不出旧 URL 了（会得到一堆 old==new 的空映射）。
const doApply = argv.includes('--apply')
const doNginx = argv.includes('--nginx')
const MODE = doApply || doNginx ? 'write' : 'report'

// —— slug 生成：必须与 scripts/new-post.mjs 逐字一致 ——
function toSlugSource(value) {
  return pinyin(value, {
    toneType: 'none',
    type: 'array',
    nonZh: 'consecutive',
    v: true,
  }).join(' ')
}

function slugify(value) {
  const slug = toSlugSource(value)
    .toLowerCase()
    .replace(/['"]/gu, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
  return slug || null
}

// —— 文件遍历 ——
function listMarkdown(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...listMarkdown(full))
    else if (name.endsWith('.md')) out.push(full)
  }
  return out
}

function splitFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n)?/)
  if (!m) return null
  const head = m[0]
  const lines = m[1].split(/\r?\n/)
  return {
    lines,
    body: raw.slice(head.length),
    eol: head.includes('\r\n') ? '\r\n' : '\n',
  }
}

function fmValue(lines, key) {
  const re = new RegExp('^' + key + ':\\s*(.*)$')
  for (const line of lines) {
    const m = line.match(re)
    if (m) {
      let v = m[1].trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      return v
    }
  }
  return ''
}

function indexOfKey(lines, key) {
  const re = new RegExp('^' + key + ':')
  return lines.findIndex((l) => re.test(l))
}

const NON_ASCII = /[^\x00-\x7F]/

// 路径 -> 百分号编码（只编码非 ASCII 与保留字符，保留 /）
function encodePath(p) {
  return p
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

// 正则转义（用于 nginx map 的 ~ 正则键）
function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// —— 主扫描 ——
const files = listMarkdown(ARTICLES_DIR).sort()
const records = []
const problems = []
const usedNewPaths = new Map()

for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const fm = splitFrontmatter(raw)
  if (!fm) {
    problems.push('无法解析 frontmatter: ' + path.relative(ROOT, file))
    continue
  }

  const explicitUrl = fmValue(fm.lines, 'url')
  const slugValue = fmValue(fm.lines, 'slug')
  const baseName = path.basename(file, '.md')

  // 旧 URL：有显式 url 用它，否则按 Hugo 默认规则由「相对路径」推导
  let oldPath
  if (explicitUrl) {
    oldPath = explicitUrl
  } else {
    const rel = path.relative(ARTICLES_DIR, file).replace(/\\/g, '/').replace(/\.md$/, '')
    oldPath = '/articles/' + rel + '/'
  }

  // 需要迁移的判据：旧 URL 或文件名里含非 ASCII。
  //
  // 幂等保护：frontmatter 里已经有 **ASCII 的显式 url**，就说明这篇迁移过了。
  // 这一步不能省 —— 文件名仍是中文，只看文件名会把已迁移的文章再扫一遍；
  // 而那时 url 已是新值，推导出的「旧 URL」其实等于新 URL，
  // 结果生成一堆 old==new 的空映射，把 slug-migration.json 写坏。
  if (explicitUrl && !NON_ASCII.test(explicitUrl)) continue
  if (!NON_ASCII.test(oldPath) && !NON_ASCII.test(baseName)) continue

  const slugSource = slugValue || baseName
  const newSlug = slugify(slugSource)
  if (!newSlug) {
    problems.push('无法生成 slug: ' + path.relative(ROOT, file))
    continue
  }
  if (NON_ASCII.test(newSlug)) {
    problems.push('生成的 slug 仍含非 ASCII: ' + newSlug + ' <- ' + path.relative(ROOT, file))
    continue
  }

  const dir = path.posix.dirname(oldPath.replace(/\/$/, ''))
  if (!/^\/articles\/\d{4}\/\d{2}\/\d{2}$/.test(dir)) {
    problems.push(
      '旧 URL 的父目录不符合 /articles/YYYY/MM/DD，拒绝迁移（怕生成嵌套路径）: ' +
        oldPath + ' <- ' + path.relative(ROOT, file)
    )
    continue
  }

  const newPath = dir + '/' + newSlug + '.html'

  if (usedNewPaths.has(newPath)) {
    problems.push('新 URL 冲突: ' + newPath + ' 同时来自 ' + usedNewPaths.get(newPath) + ' 与 ' + path.relative(ROOT, file))
    continue
  }
  usedNewPaths.set(newPath, path.relative(ROOT, file))

  records.push({
    source: path.relative(ROOT, file).replace(/\\/g, '/'),
    oldPath,
    newPath,
    newSlug,
    slugBefore: slugValue,
    hadUrl: Boolean(explicitUrl),
    fm,
    raw,
  })
}

// 与「未迁移的文件」产物路径查重：避免新 URL 撞上已存在的文章
const untouchedPaths = new Set()
for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  if (records.some((r) => r.source === rel)) continue
  const raw = readFileSync(file, 'utf8')
  const fm = splitFrontmatter(raw)
  if (!fm) continue
  const u = fmValue(fm.lines, 'url')
  if (u) untouchedPaths.add(u)
}

for (const r of records) {
  if (untouchedPaths.has(r.newPath)) {
    problems.push('新 URL 与未迁移文章冲突: ' + r.newPath + ' <- ' + r.source)
  }
}

// —— 报告 ——
console.log('扫描 content/articles: ' + files.length + ' 篇')
console.log('需要迁移（URL 含非 ASCII）: ' + records.length + ' 篇')
if (problems.length) {
  console.log('\n⚠️  发现 ' + problems.length + ' 个问题，必须先解决：')
  problems.forEach((p) => console.log('  - ' + p))
}

const maxOldEnc = records.reduce((a, r) => Math.max(a, encodePath(r.oldPath).length), 0)
const maxNew = records.reduce((a, r) => Math.max(a, r.newPath.length), 0)
const maxSlug = records.reduce((a, r) => Math.max(a, r.newSlug.length), 0)
console.log('\n最长旧 URL（编码后，含正则转义前）: ' + maxOldEnc + ' 字符')
console.log('最长新 URL: ' + maxNew + ' 字符')
console.log('最长 slug: ' + maxSlug + ' 字符')

// nginx map_hash_bucket_size 必须 >= 最长「键」长度，且是 2 的幂
const neededBucket = Math.max(maxOldEnc + 8, 128)
let bucket = 32
while (bucket < neededBucket) bucket *= 2
console.log('建议 map_hash_bucket_size: ' + bucket)

console.log('\n前 5 条映射预览:')
for (const r of records.slice(0, 5)) {
  console.log('  ' + encodeURI(r.oldPath))
  console.log('    -> ' + r.newPath)
}
const longest = records.slice().sort((a, b) => encodePath(b.oldPath).length - encodePath(a.oldPath).length)[0]
if (longest) {
  console.log('\n最长的一条:')
  console.log('  ' + encodeURI(longest.oldPath) + '  (' + encodePath(longest.oldPath).length + ' 字符)')
  console.log('    -> ' + longest.newPath)
}

if (MODE === 'report') {
  console.log('\n（report 模式，未写入任何文件）')
  process.exit(problems.length ? 1 : 0)
}

if (problems.length) {
  console.error('\n有问题存在，拒绝写入。')
  process.exit(1)
}

if (records.length === 0) {
  console.error(
    '\n扫描到 0 篇待迁移文章。这通常意味着**已经迁移过了**（frontmatter 里已有 ASCII url）。\n' +
      '此时继续跑 --nginx 会生成空映射并覆盖 seo-state/slug-migration.json，因此拒绝执行。\n' +
      '若要重做：先 `git checkout -- content/articles/` 还原，再跑 `--apply --nginx`。'
  )
  process.exit(1)
}

// —— 改写 frontmatter ——
let rewritten = 0
if (doApply) {
  for (const r of records) {
    const lines = r.fm.lines.slice()
    const slugIdx = indexOfKey(lines, 'slug')
    const urlIdx = indexOfKey(lines, 'url')
    const urlLine = 'url: "' + r.newPath + '"'
    const slugLine = 'slug: "' + r.newSlug + '"'

    if (slugIdx >= 0) lines[slugIdx] = slugLine
    if (urlIdx >= 0) {
      lines[urlIdx] = urlLine
    } else if (slugIdx >= 0) {
      lines.splice(slugIdx + 1, 0, urlLine)
    } else {
      const dateIdx = indexOfKey(lines, 'date')
      lines.splice(dateIdx >= 0 ? dateIdx + 1 : 0, 0, slugLine, urlLine)
    }

    const out = '---' + r.fm.eol + lines.join(r.fm.eol) + r.fm.eol + '---' + r.fm.eol + r.fm.body
    writeFileSync(r.source, out)
    rewritten++
  }
  console.log('\n✅ 已改写 ' + rewritten + ' 个文件的 frontmatter')

  // —— 顺手修正文里硬编码的旧 URL ——
  //
  // 站内文章互相引用时是写绝对 URL 的（如「8 月开源项目盘点」里引用了这批文章），
  // 这些引用不会因为改 slug 自动更新：不修的话，页面上会留下指向旧地址的链接，
  // 每被爬到一次就是一次无谓的 301 跳转（虽然不会 404，但白白消耗抓取配额）。
  //
  // 候选写法有四种：原始中文 / 百分号编码 × 带尾斜杠 / 不带尾斜杠。
  // 必须先长后短地替换，否则「不带尾斜杠」会先把「带尾斜杠」的前缀吃掉。
  const refPairs = []
  for (const r of records) {
    const raw = r.oldPath
    const enc = encodePath(raw)
    const rawNo = raw.replace(/\/$/, '')
    const encNo = enc.replace(/\/$/, '')
    for (const s of new Set([raw, enc, rawNo, encNo])) {
      if (s && s !== r.newPath) refPairs.push([s, r.newPath])
    }
  }
  refPairs.sort((a, b) => b[0].length - a[0].length)

  let refFiles = 0
  let refHits = 0
  for (const file of files) {
    const before = readFileSync(file, 'utf8')
    let after = before
    let hit = 0
    for (const [from, to] of refPairs) {
      if (after.includes(from)) {
        hit += after.split(from).length - 1
        after = after.split(from).join(to)
      }
    }
    if (hit > 0) {
      writeFileSync(file, after)
      refFiles++
      refHits += hit
    }
  }
  console.log('✅ 已修正正文里的旧 URL 引用：' + refHits + ' 处，涉及 ' + refFiles + ' 个文件')
}

// —— 写映射 JSON ——
const mapping = {
  generatedAt: new Date().toISOString(),
  note: '中文 slug -> 拼音 ASCII slug 迁移映射。nginx 301 与线上验收脚本都以本文件为准。',
  count: records.length,
  entries: records.map((r) => ({
    source: r.source,
    oldPath: r.oldPath,
    newPath: r.newPath,
    oldPathEncoded: encodePath(r.oldPath),
    slugBefore: r.slugBefore,
    slugAfter: r.newSlug,
  })),
}

// —— 生成 nginx map 条目 ——
function nginxEntries() {
  const out = [MAP_BEGIN]
  for (const r of records) {
    // 旧 URL 可能以 / 结尾（Hugo 目录形态）或以 .html 结尾（显式 url 形态）
    if (r.oldPath.endsWith('/')) {
      // 带斜杠与不带斜杠两种请求形态都 301
      out.push('~*^' + reEscape(encodePath(r.oldPath.replace(/\/$/, ''))) + '/?$ ' + r.newPath + ';')
    } else {
      out.push('~*^' + reEscape(encodePath(r.oldPath)) + '$ ' + r.newPath + ';')
      if (r.oldPath.endsWith('.html')) {
        // try_files 里的 $uri.html 让「无扩展名」形态也能访问，一并 301
        out.push('~*^' + reEscape(encodePath(r.oldPath.slice(0, -5))) + '$ ' + r.newPath + ';')
      }
    }
  }
  out.push(MAP_END)
  return out
}

const entries = nginxEntries()

if (doNginx) {
  let conf = readFileSync(NGINX_CONF, 'utf8')

  // 幂等：先移除旧的注入块
  const begin = conf.indexOf(MAP_BEGIN)
  const end = conf.indexOf(MAP_END)
  if (begin >= 0 && end >= 0) {
    const after = conf.indexOf('\n', end)
    conf = conf.slice(0, begin) + conf.slice(after + 1)
  }

  // 插到 map 块闭合的 } 之前
  const mapStart = conf.indexOf('map $request_uri $legacy_redirect_uri {')
  if (mapStart < 0) {
    console.error('未找到 map $request_uri $legacy_redirect_uri 块，无法注入。')
    process.exit(1)
  }
  const mapEnd = conf.indexOf('\n}', mapStart)
  if (mapEnd < 0) {
    console.error('未找到 map 块闭合位置，无法注入。')
    process.exit(1)
  }
  conf = conf.slice(0, mapEnd) + '\n' + entries.join('\n') + conf.slice(mapEnd)

  // map_hash_bucket_size 必须 >= 最长键长度，否则 nginx 启动直接失败
  conf = conf.replace(/map_hash_bucket_size \d+;/, 'map_hash_bucket_size ' + bucket + ';')

  writeFileSync(NGINX_CONF, conf)
  console.log('\n✅ 已注入 ' + (entries.length - 2) + ' 条 nginx 301 映射，map_hash_bucket_size = ' + bucket)
}

mkdirSync(path.dirname(MAP_JSON), { recursive: true })
writeFileSync(MAP_JSON, JSON.stringify(mapping, null, 2) + '\n')
console.log('✅ 已写映射清单 ' + path.relative(ROOT, MAP_JSON) + '（' + records.length + ' 条）')
