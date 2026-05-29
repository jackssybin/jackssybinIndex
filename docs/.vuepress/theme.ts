import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme({
  hostname: "https://jackssybin.cn/",
  logo: "/images/logo.png",
  favicon: "/images/favicon.svg?v=20260529-4",
  navbar: false,
  sidebar: false,
  breadcrumb: false,
  pageInfo: false,
  contributors: false,
  editLink: false,
  lastUpdated: false,
  print: false,
  pure: true,
  displayFooter: false,
  plugins: {
    copyCode: true,
    slimsearch: false
  },
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    gfm: true,
    mark: true,
    tasklist: true,
    tabs: true
  }
});
