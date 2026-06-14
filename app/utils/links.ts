import type { NavigationMenuItem } from '@nuxt/ui'

export const navLinks: NavigationMenuItem[] = [{
  label: '首页',
  icon: 'i-lucide-home',
  to: '/'
}, {
  label: '介绍',
  icon: 'i-lucide-user',
  to: '/#about-intro'
}, {
  label: '技术栈',
  icon: 'i-lucide-code-2',
  to: '/#tech-stack'
}, {
  label: '履历',
  icon: 'i-lucide-briefcase-business',
  to: '/#work-experience'
}, {
  label: '项目',
  icon: 'i-lucide-folder',
  to: '/#projects'
}, {
  label: '风格',
  icon: 'i-lucide-globe',
  to: '/#design-styles'
}, {
  label: '作品',
  icon: 'i-lucide-images',
  to: '/#art-collections'
}]
