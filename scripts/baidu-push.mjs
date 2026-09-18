// 百度链接主动推送脚本
//
// 使用方式：
//   node scripts/baidu-push.mjs                    # 从 sitemap 读取，推送全部「正文」页
//   node scripts/baidu-push.mjs --since=7          # 只推最近 7 天有 <lastmod> 的页面
//   node scripts/baidu-push.mjs --changed          # 从 git diff 里挑出改动过的正文
//   node scripts/baidu-push.mjs --changed --fallback-since=3
//                                                  # diff 无结果时，回退推最近 3 天的页面
//   node scripts/baidu-push.mjs --verify           # 只推 1 条（最新页面），用于验证 token 是否有效
//   node scripts/baidu-push.mjs --changed --probe-if-empty
//                                                  # diff 无结果时推 1 条最新页面做连通性探针
//   node scripts/baidu-push.mjs --url=https://... --url=https://...  # 直接指定 URL
//   node scripts/baidu-push.mjs --sitemap=https://jackssybin.cn/sitemap.xml
//
// 环境变量：
//   BAIDU_PUSH_TOKEN     百度资源平台「链接提交 -> API 提交」的 token（必填）
//   BAIDU_PUSH_SITE      站点，默认 jackssybin.cn
//   BAIDU_PUSH_ORIGIN    站点的规范 origin，默认 https://jackssybin.cn
//   BAIDU_PUSH_DRY       设为 1 时只打印不推送
//   BAIDU_PUSH_MAX       单次最多推送多少条（命令行 --max 优先）
//   BAIDU_PUSH_DIFF_BASE / BAIDU_PUSH_DIFF_HEAD   --changed 时的 git diff 范围
//
// 退出码（CI 依赖这套语义，不要随意改）：
//   0  成功，或本来就没有需要推送的 URL
//   1  运行时错误（网络、响应无法解析、未知错误字段）
//   2  配置问题：token 缺失/无效、站点未验证 —— 必须人工去站长平台处理
//   3  当日推送配额已用尽 —— 属于正常限流，明天再来，不算失败
//
// 为什么要有退出码语义：「百度推送静默失败了很久」是这次 SEO 事故里最难查的一环。
// 旧的 CI 步骤设了 continue-on-error，token 失效和推送成功在日志里长得一模一样。

import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

const EXIT_OK = 0
const EXIT_RUNTIME = 1
const EXIT_CONFIG = 2
const EXIT_QUOTA = 3

const args = process.argv.slice(2)
const opts = {
  since: null,
  changed: false,
  verify: false,
  probeIfEmpty: false,
  fallbackSince: null,
  max: Number.parseInt(process.env.BAIDU_PUSH_MAX ?? '', 10),
  summaryFile: null,
  urls: [],
  sitemap: 'https://jackssybin.cn/sitemap.xml',
}
for (const raw of args) {
  if (raw.startsWith('--since=')) opts.since = Number(raw.slice(8))
  else if (raw.startsWith('--fallback-since=')) opts.fallbackSince = Number(raw.slice(17))
  else if (raw.startsWith('--max=')) opts.max = Number(raw.slice(6))
  else if (raw.startsWith('--summary=')) opts.summaryFile = raw.slice(10)
  else if (raw === '--changed') opts.changed = true
  else if (raw === '--verify') opts.verify = true
  else if (raw === '--probe-if-empty') opts.probeIfEmpty = true
  else if (raw.startsWith('--url=')) opts.urls.push(raw.slice(6))
  else if (raw.startsWith('--sitemap=')) opts.sitemap = raw.slice(10)
  else if (!raw.startsWith('--')) opts.sitemap = raw
}

const configuredSite = process.env.BAIDU_PUSH_SITE || 'jackssybin.cn'
const apiSite = configuredSite.replace(/^https?:\/\//, '').replace(/\/$/, '')
const canonicalOrigin = (process.env.BAIDU_PUSH_ORIGIN || 'https://jackssybin.cn').replace(/\/$/, '')
const token = process.env.BAIDU_PUSH_TOKEN
const dryRun = process.env.BAIDU_PUSH_DRY === '1'

if (!Number.isFinite(opts.max) || opts.max <= 0) opts.max = null
if (!Number.isFinite(opts.since)) opts.since = null
if (!Number.isFinite(opts.fallbackSince)) opts.fallbackSince = null

const summary = {
  site: apiSite,
  mode: opts.verify ? 'verify' : opts.urls.length ? 'urls' : opts.changed ? 'changed' : 'sitemap',
  dryRun,
  candidates: 0,
  pushed: 0,
  success: 0,
  remain: null,
  exitCode: EXIT_OK,
  note: '',
}

function finish(code, note) {
  summary.exitCode = code
  if (note) summary.note = note
  if (opts.summaryFile) {
    try {
      writeFileSync(opts.summaryFile, JSON.stringify(summary, null, 2))
    } catch (err) {
      console.error('写 summary 文件失败:', err.message)
    }
  }
  process.exit(code)
}

if (!token && !dryRun) {
  console.error('错误: 未设置 BAIDU_PUSH_TOKEN 环境变量')
  console.error('请到 https://ziyuan.baidu.com/ 「链接提交 -> API 提交」获取 token，')
  console.error('然后配置到 GitHub Secret（仓库 Settings -> Secrets -> Actions）或本地环境变量。')
  finish(EXIT_CONFIG, 'BAIDU_PUSH_TOKEN 未设置')
}

// —— 过滤掉聚合/列表/低价值页，避免浪费百度当日推送配额 ——
const SKIP_PREFIXES = ['/tags/', '/nav/', '/topics/', '/archives/', '/page/', '/generated/']
const SKIP_EXACT = new Set([
  '/', '/index.html',
  '/tags.html', '/nav.html', '/topics.html', '/archives.html',
  '/search.html', '/news.html', '/weekly.html',
])

function isContentUrl(u) {
  try {
    const p = new URL(u).pathname
    if (SKIP_EXACT.has(p)) return false
    return !SKIP_PREFIXES.some((pre) => p.startsWith(pre))
  } catch {
    return false
  }
}

function chunk(arr, size) {
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

async function fetchSitemap(url) {
  let xml
  if (!/^https?:\/\//.test(url)) {
    xml = readFileSync(url, 'utf8')
  } else {
    const res = await fetch(url)
    if (!res.ok) throw new Error('sitemap fetch failed: ' + res.status)
    xml = await res.text()
  }
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const block = m[1]
    const loc = block.match(/<loc>(.+?)<\/loc>/)?.[1] ?? ''
    const lastmod = block.match(/<lastmod>(.+?)<\/lastmod>/)?.[1] ?? ''
    return { loc, lastmod }
  })
}

function lastmodTime(entry) {
  if (!entry.lastmod) return 0
  const t = Date.parse(entry.lastmod)
  return Number.isFinite(t) ? t : 0
}

function filterBySince(entries, days) {
  const cutoff = Date.now() - days * 86400_000
  return entries.filter((e) => lastmodTime(e) >= cutoff && lastmodTime(e) > 0)
}

function sortByRecency(entries) {
  return [...entries].sort((a, b) => lastmodTime(b) - lastmodTime(a))
}

function frontmatterUrl(file) {
  const raw = readFileSync(file, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return ''
  const url = match[1].match(/^url:\s*(?:"([^"]+)"|'([^']+)'|([^\s#]+))/m)
  return url?.[1] || url?.[2] || url?.[3] || ''
}

function absoluteUrl(path) {
  return new URL(path, canonicalOrigin).toString()
}

function urlsFromGit() {
  const base = process.env.BAIDU_PUSH_DIFF_BASE || 'HEAD~5'
  const head = process.env.BAIDU_PUSH_DIFF_HEAD || 'HEAD'
  const raw = execSync(`git diff --name-only ${base} ${head} -- "content/**/*.md"`, {
    stdio: ['ignore', 'pipe', 'ignore'],
  })
    .toString()
    .trim()
  if (!raw) return []
  const files = raw.split(/\r?\n/).filter(Boolean)
  const urls = []
  for (const file of files) {
    const rel = file.replace(/^content\//, '').replace(/\.md$/, '')
    const explicitUrl = frontmatterUrl(file)
    if (explicitUrl) {
      urls.push(absoluteUrl(explicitUrl))
    } else if (rel.startsWith('articles/')) {
      urls.push(absoluteUrl('/' + rel + '/'))
    } else {
      urls.push(absoluteUrl('/' + rel + '.html'))
    }
  }
  return urls
}

// 百度错误字段 -> 退出码。只按 message 里的关键字分类：错误码表官方没有稳定文档，
// 硬编码码值会随百度改版失效，关键字反而更抗变。
function classifyError(message, errorCode) {
  const m = String(message || '').toLowerCase()
  if (m.includes('quota') || m.includes('remain') || errorCode === 403) return EXIT_QUOTA
  if (m.includes('token') || m.includes('site error') || m.includes('verif') ||
      m.includes('unauthor') || errorCode === 401 || errorCode === 400) {
    return EXIT_CONFIG
  }
  return EXIT_RUNTIME
}

async function pushBatch(urls) {
  const api = 'http://data.zz.baidu.com/urls?site=' + encodeURIComponent(apiSite) + '&token=' + token
  const body = urls.join('\n')
  if (dryRun) {
    console.log('[dry-run] would POST', urls.length, 'urls for', apiSite)
    urls.forEach((u) => console.log('  ' + u))
    return { success: urls.length, remain: 'N/A', dryRun: true }
  }
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body,
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('百度响应非 JSON: ' + text)
  }
  return json
}

async function main() {
  let urls = []
  let lastmodSorted = null

  if (opts.urls.length) {
    urls = opts.urls
  } else if (opts.verify) {
    const entries = (await fetchSitemap(opts.sitemap)).filter((e) => isContentUrl(e.loc))
    lastmodSorted = sortByRecency(entries)
    if (lastmodSorted.length === 0) {
      console.log('sitemap 里没有正文页，无法验证。')
      finish(EXIT_CONFIG, 'sitemap 中无可用正文页')
    }
    urls = [lastmodSorted[0].loc]
    console.log('验证模式：推送最新页面 ' + urls[0])
  } else if (opts.changed) {
    urls = urlsFromGit()
    console.log('从 git 提取到 ' + urls.length + ' 个变更 URL')
    if (urls.length === 0 && opts.fallbackSince != null) {
      console.log('本次提交没有正文变更，回退到「最近 ' + opts.fallbackSince + ' 天更新」策略')
      const entries = await fetchSitemap(opts.sitemap)
      const recent = filterBySince(entries, opts.fallbackSince)
      urls = sortByRecency(recent).map((e) => e.loc)
      console.log('回退候选 ' + urls.length + ' 条')
    }
  } else {
    const entries = await fetchSitemap(opts.sitemap)
    console.log('sitemap 总计 ' + entries.length + ' 条')
    if (opts.since != null) {
      const filtered = filterBySince(entries, opts.since)
      console.log('按 since=' + opts.since + '天过滤后剩 ' + filtered.length + ' 条')
      urls = sortByRecency(filtered).map((e) => e.loc)
    } else {
      urls = entries.map((e) => e.loc)
    }
  }

  const before = urls.length
  urls = [...new Set(urls.filter(isContentUrl))]
  summary.candidates = urls.length
  console.log('去掉聚合页/去重后可推送: ' + urls.length + ' / ' + before)

  if (opts.max && urls.length > opts.max) {
    console.log('按 --max=' + opts.max + ' 截断（剩余 ' + (urls.length - opts.max) + ' 条留到下次）')
    urls = urls.slice(0, opts.max)
  }

  // 探针：本次没有正文变更时，也推 1 条最新页面。
  // 目的不是收录（那条页面多半已收录），而是让「推送链路是否通畅」每次部署都被验证一次。
  // 没有探针的话，token 失效只会在「刚好有正文变更」的那次部署里才暴露。
  if (urls.length === 0 && opts.probeIfEmpty) {
    console.log('本次无可推 URL，启用探针：推 1 条最新正文页验证链路')
    const entries = await fetchSitemap(opts.sitemap)
    const newest = sortByRecency(entries.filter((e) => isContentUrl(e.loc)))[0]
    if (newest) {
      urls = [newest.loc]
      summary.mode = 'probe'
      summary.candidates = 1
    }
  }

  if (urls.length === 0) {
    console.log('没有可推送的 URL，退出。')
    finish(EXIT_OK, '无需要推送的 URL')
  }

  // 百度单次最多 2000 条，这里保守分批 1000。
  const batches = chunk(urls, 1000)
  let ok = 0
  let worstExit = EXIT_OK
  let lastNote = ''

  for (const [i, batch] of batches.entries()) {
    console.log('推送批次 ' + (i + 1) + '/' + batches.length + ' (' + batch.length + ' 条)')
    let r
    try {
      r = await pushBatch(batch)
    } catch (err) {
      console.error('  推送出错:', err.message)
      worstExit = worstExit || EXIT_RUNTIME
      lastNote = err.message
      continue
    }
    console.log('  结果:', JSON.stringify(r))
    if (typeof r.success === 'number') {
      ok += r.success
      summary.pushed += batch.length
    }
    if (r.remain != null) {
      console.log('  今日剩余配额: ' + r.remain)
      summary.remain = r.remain
    }
    if (r.error) {
      const code = classifyError(r.message, r.error)
      console.error('  ❌ error=' + r.error + ' message=' + (r.message || ''))
      if (code === EXIT_CONFIG) {
        console.error('  → 这是配置问题：token 失效或站点未通过归属验证。')
        console.error('  → 处理方式：登录 https://ziyuan.baidu.com/ 检查「站点管理」验证状态，')
        console.error('     并确认 GitHub Secret BAIDU_PUSH_TOKEN 与平台一致。')
      } else if (code === EXIT_QUOTA) {
        console.error('  → 当日配额已用尽，属于正常限流，明天会自动恢复。')
      }
      // 配置问题优先于配额问题汇报：前者必须人工处理，后者会自动恢复。
      if (code === EXIT_CONFIG || worstExit === EXIT_OK) worstExit = code
      lastNote = 'error=' + r.error + ' ' + (r.message || '')
    }
  }

  summary.success = ok
  console.log('✅ 累计成功推送 ' + ok + ' 条')
  finish(worstExit, lastNote)
}

main().catch((err) => {
  console.error('推送过程出错:', err)
  finish(EXIT_RUNTIME, err.message)
})
