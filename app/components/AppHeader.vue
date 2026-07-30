<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

const { locale, toggleLocale } = useSiteI18n()
const hidden = ref(false)
const mobileMenu = ref<HTMLDetailsElement | null>(null)
const isHome = computed(() => {
  if (!import.meta.client) return false
  return window.location.pathname === '/' || window.location.pathname === ''
})
let committedY = 0

function handleLocaleToggle() {
  toggleLocale()
  hidden.value = false
  mobileMenu.value?.removeAttribute('open')
  committedY = import.meta.client ? window.scrollY : 0
}

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
}

function handleNavClick(link: NavigationMenuItem, event: MouseEvent) {
  mobileMenu.value?.removeAttribute('open')
  // Hash links on home page: scroll to anchor directly
  if (typeof link.to === 'string' && link.to.startsWith('/#')) {
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
        class="hidden items-center gap-3 lg:flex"
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
          class="language-toggle cursor-clickable ml-1 inline-flex items-center gap-1 text-xs font-bold tracking-[0.12em] text-white/55 transition hover:text-white sm:text-sm"
          :aria-label="locale === 'en' ? 'Switch to Chinese' : '切换到英文'"
          @click="handleLocaleToggle"
        >
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'zh' }"
          >中</span>
          <span class="language-toggle-separator">/</span>
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'en' }"
          >EN</span>
        </button>
      </nav>

      <div class="flex items-center gap-4 lg:hidden">
        <button
          type="button"
          class="language-toggle cursor-clickable inline-flex items-center gap-1 text-xs font-bold tracking-[0.12em] text-white/55 transition hover:text-white"
          :aria-label="locale === 'en' ? 'Switch to Chinese' : '切换到英文'"
          @click="handleLocaleToggle"
        >
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'zh' }"
          >中</span>
          <span class="language-toggle-separator">/</span>
          <span
            class="language-toggle-item"
            :class="{ 'language-toggle-item--active': locale === 'en' }"
          >EN</span>
        </button>
        <details
          ref="mobileMenu"
          class="mobile-menu lg:hidden"
        >
          <summary
            class="cursor-clickable flex size-9 list-none items-center justify-center rounded-full border border-white/20 bg-white/8 text-white transition hover:bg-white/14"
            :aria-label="locale === 'en' ? 'Toggle navigation' : '打开或关闭导航'"
          >
            <UIcon
              name="i-lucide-menu"
              class="mobile-menu-open-icon size-5"
            />
            <UIcon
              name="i-lucide-x"
              class="mobile-menu-close-icon hidden size-5"
            />
          </summary>

          <nav
            class="absolute left-4 right-4 top-[calc(100%+0.5rem)] grid grid-cols-2 gap-2 rounded-2xl border border-white/15 bg-neutral-950/94 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl"
            :aria-label="locale === 'en' ? 'Mobile navigation' : '移动端导航'"
          >
            <NuxtLink
              v-for="link in links"
              :key="`mobile-${link.label}`"
              :to="link.to"
              class="rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
              active-class="bg-white/10 text-white"
              @click="handleNavClick(link, $event)"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </details>
      </div>
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
  transition: color 180ms ease;
}

.language-toggle-item--active {
  color: #10b981;
}

.language-toggle-separator {
  color: rgb(255 255 255 / 0.32);
}

.mobile-menu summary::-webkit-details-marker {
  display: none;
}

.mobile-menu[open] .mobile-menu-open-icon {
  display: none;
}

.mobile-menu[open] .mobile-menu-close-icon {
  display: block;
}
</style>
