<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { locale, toggleLocale } = useSiteI18n()
const hidden = ref(false)
const isHome = computed(() => {
  if (!import.meta.client) return false
  return window.location.pathname === '/' || window.location.pathname === ''
})
let lastY = 0
let committedY = 0

function onScroll() {
  const y = window.scrollY
  if (y < 10) {
    hidden.value = false
    committedY = y
  } else if (y > committedY + 40) {
    hidden.value = true
    committedY = y
  } else if (y < committedY - 40) {
    hidden.value = false
    committedY = y
  }
  lastY = y
}

function handleNavClick(link: NavigationMenuItem, event: MouseEvent) {
  // Hash links on home page: scroll to anchor directly
  if (link.to && link.to.startsWith('/#')) {
    const hash = link.to.slice(2) // Remove '/#'
    if (isHome.value) {
      event.preventDefault()
      const el = document.getElementById(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `/#${hash}`)
      } else {
        // Fallback: navigate to home with hash
        window.location.href = `/#${hash}`
      }
    }
  }
}

onMounted(() => {
  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed top-0 right-0 left-0 z-50 bg-black/24 px-6 py-4 text-white shadow-lg shadow-black/10 backdrop-blur-md transition-transform duration-300 ease-out sm:px-10"
    :class="{ '-translate-y-full': hidden }"
  >
    <div class="flex items-center justify-between gap-8">
      <NuxtLink
        to="/"
        class="text-sm tracking-[0.28em]"
        style="font-family: 'Montserrat', sans-serif; font-weight: 700;"
        :aria-label="locale === 'en' ? 'WYLONG home' : 'WYLONG 首页'"
      >
        WYLONG
      </NuxtLink>

      <nav
        class="flex items-center gap-3 sm:gap-5"
        :class="locale === 'en' ? 'lg:gap-5' : 'lg:gap-8'"
        :aria-label="locale === 'en' ? 'Primary navigation' : '主导航'"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="nav-link text-xs font-medium uppercase text-white/80 transition hover:text-white sm:text-sm"
          :class="locale === 'en' ? 'tracking-[0.1em]' : 'tracking-[0.2em]'"
          active-class="text-white"
          @click="handleNavClick(link, $event)"
        >
          {{ link.label }}
        </NuxtLink>

        <button
          type="button"
          class="language-toggle cursor-clickable ml-1 inline-flex items-center rounded-full border border-white/20 bg-white/8 p-0.5 text-[0.68rem] font-bold tracking-[0.12em] text-white/70 shadow-lg shadow-black/10 backdrop-blur transition hover:border-white/35 hover:text-white"
          :aria-label="locale === 'en' ? 'Switch to Chinese' : '切换到英文'"
          @click="toggleLocale"
        >
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'zh' }"
          >中</span>
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'en' }"
          >EN</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -4px;
  width: 0;
  height: 2px;
  background-color: #10b981;
  transition: width 0.3s ease;
}
.nav-link:hover::after {
  width: 100%;
}

.language-toggle-item {
  display: inline-flex;
  min-width: 2rem;
  height: 1.6rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  transition:
    color 180ms ease,
    background-color 180ms ease;
}

.language-toggle-item--active {
  background: rgb(255 255 255 / 0.92);
  color: #111827;
}
</style>
