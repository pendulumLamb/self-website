<script setup lang="ts">
const colorMode = useColorMode()
const { locale } = useSiteI18n()

const color = computed(() => colorMode.value === 'dark' ? '#020618' : 'white')
const htmlLang = computed(() => locale.value === 'en' ? 'en' : 'zh-CN')
const titleTemplate = computed(() => locale.value === 'en' ? '%s - Personal Portfolio and Tech Blog' : '%s - 个人简历与技术博客')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: htmlLang
  }
})

useSeoMeta({
  titleTemplate,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>

    <ClientOnly>
      <LoadingScreen />
    </ClientOnly>
  </UApp>
</template>
