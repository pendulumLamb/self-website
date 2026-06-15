<script setup lang="ts">
const { navLinks } = useSiteI18n()
</script>

<template>
  <div class="relative bg-neutral-100 min-h-screen">
    <AppHeader :links="navLinks" />
    <div 
      class="relative z-10 bg-white sm:shadow-[0_14px_34px_rgba(15,23,42,0.18)]"
    >
      <slot />
    </div>
    <div class="relative z-0">
      <AppFooter />
    </div>
  </div>
</template>
