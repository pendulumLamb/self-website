<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

defineProps<{
  links: NavigationMenuItem[]
}>()

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
        aria-label="WYLONG 首页"
      >
        WYLONG
      </NuxtLink>

      <nav
        class="flex items-center gap-5 sm:gap-8"
        aria-label="主导航"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          class="nav-link text-xs font-medium tracking-[0.2em] uppercase text-white/80 transition hover:text-white sm:text-sm"
          active-class="text-white"
          @click="handleNavClick(link, $event)"
        >
          {{ link.label }}
        </NuxtLink>
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
</style>
