<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'

const footerRef = ref<HTMLElement | null>(null)
const { height } = useElementSize(footerRef)
</script>

<template>
  <div class="relative bg-neutral-100 min-h-screen">
    <AppHeader :links="navLinks" />
    <div 
      class="relative z-10 bg-white sm:shadow-[0_14px_34px_rgba(15,23,42,0.18)]"
      :style="{ marginBottom: `${height}px` }"
    >
      <slot />
    </div>
    <div ref="footerRef" class="fixed bottom-0 left-0 w-full z-0">
      <AppFooter />
    </div>
  </div>
</template>
