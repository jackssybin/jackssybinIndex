// 百度链接主动推送脚本
// 使用方法: node scripts/baidu-push.mjs <sitemap-url>
// 需要设置环境变量: BAIDU_PUSH_TOKEN

const sitemapUrl = process.argv[2] || 'https://jackssybin.cn/sitemap.xml'
const token = process.env.BAIDU_PUSH_TOKEN

if (!token) {
  console.error('错误: 未设置 BAIDU_PUSH_TOKEN 环境变量')
  console.error('请先在百度站长平台获取推送token: https://ziyuan.baidu.com/')
  process.exit(0)
}

async function fetchSitemapUrls(url) {
  const response = await fetch(url)
  const xml = await response.text()
  const urls = [...xml.matchAll(/<loc>(.+?)<\/loc>/g)].map(m => m[1])
  console.log('从 sitemap 提取到 ' + urls.length + ' 个 URL')
  return urls
}

async function pushToBaidu(urls) {
  const api = 'http://data.zz.baidu.com/urls?site=jackssybin.cn&token=' + token
  const body = urls.join('\n')
  
  const response = await fetch(api, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body
  })
  
  const result = await response.json()
  console.log('百度推送结果:', JSON.stringify(result, null, 2))
  
  if (result.success) {
    console.log('✅ 成功推送 ' + result.success + ' 个链接')
    if (result.remain) console.log('📊 今日剩余配额: ' + result.remain)
  }
  if (result.error) {
    console.error('❌ 推送失败: ' + result.error)
  }
}

console.log('🚀 开始百度链接推送...')
console.log('📄 Sitemap: ' + sitemapUrl)

try {
  const urls = await fetchSitemapUrls(sitemapUrl)
  await pushToBaidu(urls)
} catch (err) {
  console.error('推送过程出错:', err.message)
}
