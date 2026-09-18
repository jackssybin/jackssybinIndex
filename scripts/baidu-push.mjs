// 百度链接主动推送脚本
//
// 使用方式：
//   node scripts/baidu-push.mjs                    # 从 sitemap 读取，推送全部「正文」页
//   node scripts/baidu-push.mjs --since=7          # 只推最近 7 天有 <lastmod> 的页面
//   node scripts/baidu-push.mjs --changed          # 从 git diff 里挑出改动过的正文
//   node scripts/baidu-push.mjs --changed --probe-if-empty
//                                                  # diff 无结果时推 1 条最新页面做连通性探针
//   node scripts/baidu-push.mjs --daily            # 【每日轮转】按 lastmod 倒序推未推过的，见下
//   node scripts/baidu-push.mjs --verify           # 只推 1 条（最新页面），用于验证 token 是否有效
//   node scripts/baidu-push.mjs --url=https://... --url=https://...  # 直接指定 URL
//   node scripts/baidu-push.mjs --sitemap=https://jackssybin.cn/sitemap.xml
//
// 环境变量：
//   BAIDU_PUSH_TOKEN     百度资源平台「链接提交 -> API 提交」的 token（必填）
//   BAIDU_PUSH_SITE      站点，默认 jackssybin.cn
//   BAIDU_PUSH_ORIGIN    站点的规范 origin，默认 https://jackssybin.cn
//   BAIDU_PUSH_DRY       设为 1 时只打印不推送，且不写状态文件
//   BAIDU_PUSH_MAX       单次最多推送多少条（命令行 --max 优先）
//   BAIDU_PUSH_QUOTA     当日总配额（命令行 --quota 优先），见下方「配额」
//   BAIDU_PUSH_STATE     状态文件路径，默认 seo-state/baidu-pushed.json
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
//
// ============================================================================
// --daily：把 300+ 条 URL 按「每日 8 条」的配额慢慢送完
// ============================================================================
//
// 站点有 ~380 条可推 URL，而百度给这个站的当日配额实测只有 8 条。
// 一次推不完，所以需要一个「每天推一点、不重复、优先推新的」的轮转。
//
// 规则：
//   1. 候选 = sitemap 里的正文页（排除聚合页）
//   2. 排序 = <lastmod> 倒序（也就是「文章更新日期倒序」）
//   3. 去重 = 状态文件里记过 **(URL, lastmod)** 的跳过；
//      lastmod 变了（文章被改过）才重推
//   4. 配额 = 当日已推条数记在状态文件里，本次只推 (配额 - 已推) 条
//
// 为什么去重要记 lastmod 而不是只记 URL：
//   只记 URL 的话，文章更新后永远不会再推；只按时间重推又会重复烧配额
//   （实测过：连续两次推完全相同的 4 条 URL，百度照常 success 并把配额扣光）。
//
// 为什么配额要落盘：
//   「部署时顺手推正文」和「每日轮转」是两个独立入口，共用一个状态文件才能
//   保证当天总量不超过 8 条。否则部署推了 4 条、轮转再推 8 条 = 12 条，
//   撞上 over quota —— 而百度对超配额是**拒绝整批**，那 8 条会全部白推。

import { execSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const EXIT_OK = 0
const EXIT_RUNTIME = 1
const EXIT_CONFIG = 2
const EXIT_QUOTA = 3

// 百度给 jackssybin.cn 的当日配额。实测两次各推 4 条后 remain 归零，
// 所以是 8 条/天。这个数字没有官方文档可查，只能靠 remain 反推。
const DEFAULT_DAILY_QUOTA = 8

const args = process.argv.slice(2)
const opts = {
  since: null,
  changed: false,
  daily: false,
  verify: false,
  probeIfEmpty: false,
  fallbackSince: null,
  max: Number.parseInt(process.env.BAIDU_PUSH_MAX ?? '', 10),
  quota: Number.parseInt(process.env.BAIDU_PUSH_QUOTA ?? '', 10),
  statePath: process.env.BAIDU_PUSH_STATE || 'seo-state/baidu-pushed.json',
  summaryFile: null,
  urls: [],
  sitemap: 'https://jackssybin.cn/sitemap.xml',
}
for (const raw of args) {
  if (raw.startsWith('--since=')) opts.since = Number(raw.slice(8))
  else if (raw.startsWith('--fallback-since=')) opts.fallbackSince = Number(raw.slice(17))
  else if (raw.startsWith('--max=')) opts.max = Number(raw.slice(6))
  else if (raw.startsWith('--quota=')) opts.quota = Number(raw.slice(8))
  else if (raw.startsWith('--state=')) opts.statePath = raw.slice(8)
  else if (raw.startsWith('--summary=')) opts.summaryFile = raw.slice(10)
  else if (raw === '--changed') opts.changed = true
  else if (raw === '--daily') opts.daily = true
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
if (!Number.isFinite(opts.quota) || opts.quota <= 0) opts.quota = DEFAULT_DAILY_QUOTA

const summary = {
  site: apiSite,
  mode: opts.verify
    ? 'verify'
    : opts.urls.length
      ? 'urls'
      : opts.daily
        ? 'daily'
        : opts.changed
          ? 'changed'
          : 'sitemap',
  dryRun,
  candidates: 0,
  pending: 0,
  alreadyPushed: 0,
  pushed: 0,
  success: 0,
  remain: null,
  quota: opts.quota,
  quotaUsedToday: 0,
  quotaRemaining: null,
  stateUrls: 0,
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

function absoluteUrl(p) {
  return new URL(p, canonicalOrigin).toString()
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

// —— 状态文件：记录「哪个 URL 在哪个 lastmod 版本上推过」 ——

// 北京时间的日期字符串（2026-09-18）。
// 不能用 UTC：百度的配额按自然日重置，而这个站在北京时间作息，
// 用 UTC 会让凌晨 0-8 点推送记到「前一天」，配额账目就错位了。
function todayInBeijing() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
}

function loadState() {
  try {
    const s = JSON.parse(readFileSync(opts.statePath, 'utf8'))
    return {
      version: s.version || 1,
      site: s.site || apiSite,
      lastRunAt: s.lastRunAt || null,
      daily: s.daily && s.daily.date ? s.daily : { date: '', pushed: 0 },
      urls: s.urls && typeof s.urls === 'object' ? s.urls : {},
      history: Array.isArray(s.history) ? s.history : [],
    }
  } catch {
    return { version: 1, site: apiSite, lastRunAt: null, daily: { date: '', pushed: 0 }, urls: {}, history: [] }
  }
}

function saveState(state) {
  if (dryRun) {
    console.log('[dry-run] 不写状态文件 ' + opts.statePath)
    return
  }
  try {
    mkdirSync(path.dirname(path.resolve(opts.statePath)), { recursive: true })
    writeFileSync(opts.statePath, JSON.stringify(state, null, 2) + '\n')
    console.log('状态文件已更新: ' + opts.statePath + '（累计记录 ' + Object.keys(state.urls).length + ' 条 URL）')
  } catch (err) {
    console.error('写状态文件失败（不影响本次推送结果）: ' + err.message)
  }
}

function quotaStatus(state) {
  const today = todayInBeijing()
  const used = state.daily.date === today ? Number(state.daily.pushed) || 0 : 0
  return { today, used, remaining: Math.max(0, opts.quota - used) }
}

// 已经推过、且推过之后没再改过的，不再推。
// 注意判定条件：**必须两边都有 lastmod 才比较**。
// 只记了 URL 没记 lastmod 的情况下宁可当「推过了」跳过 ——
// 重复推送会照常扣配额，而漏推一条只是晚一天，代价小得多。
function needsPush(state, entry) {
  const rec = state.urls[entry.loc]
  if (!rec) return true
  if (entry.lastmod && rec.lastmod && rec.lastmod !== entry.lastmod) return true
  return false
}

function recordPushed(state, urls, lastmodByUrl, source) {
  const now = new Date().toISOString()
  for (const u of urls) {
    const rec = state.urls[u] || { pushes: 0 }
    if (lastmodByUrl.get(u)) rec.lastmod = lastmodByUrl.get(u)
    rec.pushedAt = now
    rec.pushes = (rec.pushes || 0) + 1
    state.urls[u] = rec
  }
  const { today } = quotaStatus(state)
  if (state.daily.date !== today) state.daily = { date: today, pushed: 0 }
  state.daily.pushed += urls.length
  state.lastRunAt = now
  state.history.push({ date: today, pushed: urls.length, source })
  state.history = state.history.slice(-90)
  summary.quotaUsedToday = state.daily.pushed
  summary.quotaRemaining = Math.max(0, opts.quota - state.daily.pushed)
  summary.stateUrls = Object.keys(state.urls).length
  saveState(state)
}

// 百度错误字段 -> 退出码。
//
// **只按 message 关键字分类，绝不看 error 码。**
// 实测（2026-09-18）两个语义完全相反的错误共用 error=400：
//   {"error":400,"message":"token invalid"}   → 配置问题，必须人工处理
//   {"error":400,"message":"over quota"}      → 配额用尽，明天自愈
// 所以任何「按码表分类」的写法都必然把其中一个判错。
function classifyError(message) {
  const m = String(message || '').toLowerCase()
  if (m.includes('quota') || m.includes('remain')) return EXIT_QUOTA
  if (m.includes('token') || m.includes('site error') || m.includes('verif') ||
      m.includes('unauthor')) {
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
  const lastmodByUrl = new Map()
  let state = null
  let source = summary.mode

  if (opts.urls.length) {
    urls = opts.urls
  } else if (opts.verify) {
    const entries = (await fetchSitemap(opts.sitemap)).filter((e) => isContentUrl(e.loc))
    const sorted = sortByRecency(entries)
    if (sorted.length === 0) {
      console.log('sitemap 里没有正文页，无法验证。')
      finish(EXIT_CONFIG, 'sitemap 中无可用正文页')
    }
    sorted.forEach((e) => lastmodByUrl.set(e.loc, e.lastmod))
    urls = [sorted[0].loc]
    console.log('验证模式：推送最新页面 ' + urls[0])
  } else if (opts.daily) {
    // —— 每日轮转 ——
    state = loadState()
    summary.stateUrls = Object.keys(state.urls).length
    const q = quotaStatus(state)
    summary.quotaUsedToday = q.used
    summary.quotaRemaining = q.remaining
    console.log('日期(北京): ' + q.today + ' ｜ 配额 ' + opts.quota + ' 条 ｜ 今日已推 ' + q.used +
      ' 条 ｜ 剩余 ' + q.remaining + ' 条')
    console.log('状态文件: ' + opts.statePath + '（已记录 ' + summary.stateUrls + ' 条 URL）')

    if (q.remaining <= 0) {
      console.log('今日配额已用完，跳过（明日自动继续）。')
      finish(EXIT_QUOTA, q.today + ' 的 ' + opts.quota + ' 条推送配额已用完')
    }

    const entries = (await fetchSitemap(opts.sitemap)).filter((e) => isContentUrl(e.loc))
    entries.forEach((e) => lastmodByUrl.set(e.loc, e.lastmod))
    console.log('sitemap 正文页: ' + entries.length + ' 条')

    const pending = entries.filter((e) => needsPush(state, e))
    summary.pending = pending.length
    summary.alreadyPushed = entries.length - pending.length
    console.log('未推过或已更新的: ' + pending.length + ' 条；已推过且未变动的: ' +
      summary.alreadyPushed + ' 条')

    // 按 lastmod 倒序 —— 这就是「按文章更新日期倒排序」。
    // 同 lastmod 的（Hugo enableGitInfo 会让同一次批量提交的文章拿到同一个
    // 提交时间）按 URL 二次排序，保证每次运行结果确定、可复现。
    const sorted = [...pending].sort((a, b) => {
      const d = lastmodTime(b) - lastmodTime(a)
      return d !== 0 ? d : a.loc.localeCompare(b.loc)
    })

    urls = sorted.slice(0, q.remaining).map((e) => e.loc)
    console.log('本次取前 ' + urls.length + ' 条（受今日剩余配额 ' + q.remaining + ' 条限制）')
    if (pending.length > urls.length) {
      console.log('队列还剩 ' + (pending.length - urls.length) + ' 条，按每天 ' +
        opts.quota + ' 条约需 ' + Math.ceil((pending.length - urls.length) / opts.quota) + ' 天')
    }
  } else if (opts.changed) {
    // 部署触发的推送：只推这次真正改动的正文。
    // 与 --daily 共用同一个状态文件和同一个当日配额账本，
    // 所以「部署顺手推」不会把当天的 8 条配额提前吃光。
    state = loadState()
    summary.stateUrls = Object.keys(state.urls).length
    const q = quotaStatus(state)
    summary.quotaUsedToday = q.used
    summary.quotaRemaining = q.remaining
    console.log('日期(北京): ' + q.today + ' ｜ 今日已推 ' + q.used + '/' + opts.quota +
      ' 条 ｜ 剩余 ' + q.remaining + ' 条')

    const changed = urlsFromGit()
    console.log('从 git 提取到 ' + changed.length + ' 个变更 URL')

    let sitemapEntries = []
    try {
      sitemapEntries = await fetchSitemap(opts.sitemap)
      sitemapEntries.forEach((e) => lastmodByUrl.set(e.loc, e.lastmod))
    } catch (err) {
      console.log('（取 sitemap 失败，本次无法记录 lastmod: ' + err.message + '）')
    }

    const pending = sitemapEntries.length
      ? changed.filter((u) => needsPush(state, { loc: u, lastmod: lastmodByUrl.get(u) ?? '' }))
      : changed
    summary.candidates = pending.length
    summary.alreadyPushed = changed.length - pending.length
    if (summary.alreadyPushed > 0) {
      console.log('已推过且未变动、本次跳过: ' + summary.alreadyPushed + ' 条')
    }

    if (pending.length === 0 && opts.fallbackSince != null) {
      console.log('本次提交没有新的正文变更，回退到「最近 ' + opts.fallbackSince + ' 天更新」策略')
      const recent = filterBySince(sitemapEntries, opts.fallbackSince)
      urls = sortByRecency(recent).filter((e) => needsPush(state, e)).map((e) => e.loc)
      console.log('回退候选 ' + urls.length + ' 条')
    } else {
      urls = pending
    }

    if (urls.length > q.remaining) {
      console.log('按今日剩余配额 ' + q.remaining + ' 条截断（剩余 ' +
        (urls.length - q.remaining) + ' 条留给明天）')
      urls = urls.slice(0, q.remaining)
    }
  } else {
    const entries = await fetchSitemap(opts.sitemap)
    console.log('sitemap 总计 ' + entries.length + ' 条')
    entries.forEach((e) => lastmodByUrl.set(e.loc, e.lastmod))
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
  // 注意它会消耗 1 条配额，所以 --daily 生效后默认不再需要（每日轮转本身就是探针）。
  if (urls.length === 0 && opts.probeIfEmpty) {
    console.log('本次无可推 URL，启用探针：推 1 条最新正文页验证链路')
    const entries = await fetchSitemap(opts.sitemap)
    const newest = sortByRecency(entries.filter((e) => isContentUrl(e.loc)))[0]
    if (newest) {
      urls = [newest.loc]
      lastmodByUrl.set(newest.loc, newest.lastmod)
      summary.mode = 'probe'
      summary.candidates = 1
    }
  }

  if (urls.length === 0) {
    console.log('没有可推送的 URL，退出。')
    // 注意：这里刻意不写状态文件。
    // 只更新 lastRunAt 会产生一次无意义的提交，而配额账本并没有变化；
    // 让 CI 的提交步骤因为「没有 diff」自然跳过，比制造空提交干净。
    finish(EXIT_OK, '无需要推送的 URL')
  }

  // 百度单次最多 2000 条，这里保守分批 1000。
  const batches = chunk(urls, 1000)
  const accepted = []
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
      const code = classifyError(r.message)
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
      // 整批被拒时不能记账：记了就等于把这些 URL 标成「已推」，
      // 明天不会再推，它们就永远进不了索引。
      continue
    }
    // 百度会把不合规的 URL 列在 not_valid / not_same_site 里，
    // 这些没被接受，不能记进状态，否则同样会「永久漏推」。
    const rejected = new Set([...(r.not_valid || []), ...(r.not_same_site || [])])
    for (const u of batch) {
      if (!rejected.has(u)) accepted.push(u)
    }
    if (rejected.size) console.log('  百度拒绝 ' + rejected.size + ' 条（不记入状态，明天会重试）')
  }

  summary.success = ok
  console.log('✅ 累计成功推送 ' + ok + ' 条')

  if (state && accepted.length) {
    recordPushed(state, accepted, lastmodByUrl, source)
  } else if (state && !accepted.length) {
    console.log('本次没有任何 URL 被接受，状态文件保持不变。')
  }

  finish(worstExit, lastNote)
}

main().catch((err) => {
  console.error('推送过程出错:', err)
  finish(EXIT_RUNTIME, err.message)
})
