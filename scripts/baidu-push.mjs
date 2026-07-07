// 百度链接主动推送脚本
// 使用方式：
//   node scripts/baidu-push.mjs                    # 从 sitemap 读取，推送全部“正文”页
//   node scripts/baidu-push.mjs --since=7          # 只推最近 7 天有 <lastmod> 的页面
//   node scripts/baidu-push.mjs --changed          # 从 git 最近提交里挑出改动过的正文
//   node scripts/baidu-push.mjs --url=https://... --url=https://...  # 直接指定 URL
//   node scripts/baidu-push.mjs --sitemap=https://jackssybin.cn/sitemap.xml
//
// 环境变量：
//   BAIDU_PUSH_TOKEN  百度资源平台「链接提交 -> API 提交」的 token（必填）
//   BAIDU_PUSH_SITE   站点，默认 jackssybin.cn
//   BAIDU_PUSH_DRY    设为 1 时只打印不推送

import { execSync } from 'node:child_process'

const args = process.argv.slice(2)
const opts = {
  since: null,
  changed: false,
  urls: [],
  sitemap: 'https://jackssybin.cn/sitemap.xml',
}
for (const raw of args) {
  if (raw.startsWith('--since=')) opts.since = Number(raw.slice(8))
  else if (raw === '--changed') opts.changed = true
  else if (raw.startsWith('--url=')) opts.urls.push(raw.slice(6))
  else if (raw.startsWith('--sitemap=')) opts.sitemap = raw.slice(10)
  else if (!raw.startsWith('--')) opts.sitemap = raw
}

const site = process.env.BAIDU_PUSH_SITE || 'jackssybin.cn'
const token = process.env.BAIDU_PUSH_TOKEN
const dryRun = process.env.BAIDU_PUSH_DRY === '1'

if (!token && !dryRun) {
  console.error('错误: 未设置 BAIDU_PUSH_TOKEN 环境变量')
  console.error('请到 https://ziyuan.baidu.com/ 「链接提交 -> API 提交」获取 token')
  process.exit(0)
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
  const res = await fetch(url)
  if (!res.ok) throw new Error('sitemap fetch failed: ' + res.status)
  const xml = await res.text()
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => {
    const block = m[1]
    const loc = block.match(/<loc>(.+?)<\/loc>/)?.[1] ?? ''
    const lastmod = block.match(/<lastmod>(.+?)<\/lastmod>/)?.[1] ?? ''
    return { loc, lastmod }
  })
  return entries
}

function filterBySince(entries, days) {
  const cutoff = Date.now() - days * 86400_000
  return entries.filter((e) => {
    if (!e.lastmod) return false
    const t = Date.parse(e.lastmod)
    return Number.isFinite(t) && t >= cutoff
  })
}

function urlsFromGit() {
  // diff 范围可由 CI 环境变量 BAIDU_PUSH_DIFF_BASE 指定，
  // 默认为 HEAD~5（本地开发覆盖最近若干次改动）
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
  for (const f of files) {
    // content/articles/2026/06/05/foo.md -> https://<site>/articles/2026/06/05/foo/
    // content/tutorials/xxx/yyy.md -> https://<site>/xxx/yyy.html
    const rel = f.replace(/^content\//, '').replace(/\.md$/, '')
    if (rel.startsWith('articles/')) {
      urls.push('https://' + site + '/' + rel + '/')
    } else if (rel.startsWith('tutorials/')) {
      urls.push('https://' + site + '/' + rel.replace(/^tutorials\//, '') + '.html')
    }
  }
  return urls
}

async function pushBatch(urls) {
  const api = 'http://data.zz.baidu.com/urls?site=' + site + '&token=' + token
  const body = urls.join('\n')
  if (dryRun) {
    console.log('[dry-run] would POST', urls.length, 'urls to', api)
    urls.forEach((u) => console.log('  ' + u))
    return { success: urls.length, remain: 'N/A' }
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
  if (opts.urls.length) {
    urls = opts.urls
  } else if (opts.changed) {
    urls = urlsFromGit()
    console.log('从 git 提取到 ' + urls.length + ' 个变更 URL')
  } else {
    let entries = await fetchSitemap(opts.sitemap)
    console.log('sitemap 总计 ' + entries.length + ' 条')
    if (opts.since != null && Number.isFinite(opts.since)) {
      entries = filterBySince(entries, opts.since)
      console.log('按 since=' + opts.since + '天过滤后剩 ' + entries.length + ' 条')
    }
    urls = entries.map((e) => e.loc)
  }

  const before = urls.length
  urls = [...new Set(urls.filter(isContentUrl))]
  console.log('去掉聚合页/去重后可推送: ' + urls.length + ' / ' + before)

  if (urls.length === 0) {
    console.log('没有可推送的 URL，退出。')
    return
  }

  // 百度单次最多 2000 条，这里保守分批 1000。
  const batches = chunk(urls, 1000)
  let ok = 0
  for (const [i, batch] of batches.entries()) {
    console.log('推送批次 ' + (i + 1) + '/' + batches.length + ' (' + batch.length + ' 条)')
    try {
      const r = await pushBatch(batch)
      console.log('  结果:', JSON.stringify(r))
      if (typeof r.success === 'number') ok += r.success
      if (r.remain != null) console.log('  今日剩余配额: ' + r.remain)
      if (r.error) console.error('  ❌ ' + r.error + ': ' + (r.message || ''))
    } catch (err) {
      console.error('  推送出错:', err.message)
    }
  }
  console.log('✅ 累计成功推送 ' + ok + ' 条')
}

main().catch((err) => {
  console.error('推送过程出错:', err)
  process.exit(1)
})
