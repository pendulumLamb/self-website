import type { NavigationMenuItem } from '@nuxt/ui'

export type SiteLocale = 'zh' | 'en'

const localeLabels: Record<SiteLocale, string> = {
  zh: '中',
  en: 'EN'
}

const navCopy: Record<SiteLocale, NavigationMenuItem[]> = {
  zh: [{
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
  }],
  en: [{
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/'
  }, {
    label: 'About',
    icon: 'i-lucide-user',
    to: '/#about-intro'
  }, {
    label: 'Stack',
    icon: 'i-lucide-code-2',
    to: '/#tech-stack'
  }, {
    label: 'Career',
    icon: 'i-lucide-briefcase-business',
    to: '/#work-experience'
  }, {
    label: 'Projects',
    icon: 'i-lucide-folder',
    to: '/#projects'
  }, {
    label: 'Styles',
    icon: 'i-lucide-globe',
    to: '/#design-styles'
  }, {
    label: 'Works',
    icon: 'i-lucide-images',
    to: '/#art-collections'
  }]
}

export function useSiteI18n() {
  const locale = useState<SiteLocale>('site-locale', () => 'zh')
  const hydrated = useState('site-locale-hydrated', () => false)

  if (import.meta.client && !hydrated.value) {
    const saved = window.localStorage.getItem('site-locale')
    if (saved === 'zh' || saved === 'en') {
      locale.value = saved
    }
    hydrated.value = true
  }

  if (import.meta.client) {
    watch(locale, value => window.localStorage.setItem('site-locale', value))
  }

  const isEnglish = computed(() => locale.value === 'en')
  const navLinks = computed(() => navCopy[locale.value])
  const currentLocaleLabel = computed(() => localeLabels[locale.value])
  const nextLocaleLabel = computed(() => localeLabels[locale.value === 'zh' ? 'en' : 'zh'])

  function setLocale(value: SiteLocale) {
    locale.value = value
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }

  return {
    locale,
    isEnglish,
    navLinks,
    currentLocaleLabel,
    nextLocaleLabel,
    setLocale,
    toggleLocale
  }
}
