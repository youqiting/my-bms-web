import defaultSettings from '@/settings'

const title = defaultSettings.title || '数据管理后台前端'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
