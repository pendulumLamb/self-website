<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

const { locale, navLinks } = useSiteI18n()
const htmlLang = computed(() => locale.value === 'en' ? 'en' : 'zh-CN')
const errorTitle = computed(() => locale.value === 'en' ? 'Page not found' : '页面未找到')
const errorDescription = computed(() => locale.value === 'en'
  ? 'We are sorry but this page could not be found.'
  : '抱歉，页面不存在。')

useHead({
  htmlAttrs: {
    lang: htmlLang
  }
})

useSeoMeta({
  title: errorTitle,
  description: errorDescription
})
</script>

<template>
  <div>
    <AppHeader :links="navLinks" />

    <UMain>
      <UContainer>
        <UPage>
          <UError :error="error" />
        </UPage>
      </UContainer>
    </UMain>

    <AppFooter />

    <UToaster />
  </div>
</template>
