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

const [{ data: navigation }, { data: files }] = await Promise.all([
  useAsyncData('navigation', () => {
    return Promise.all([
      queryCollectionNavigation('blog')
    ])
  }, {
    transform: data => data.flat()
  }),
  useLazyAsyncData('search', () => {
    return Promise.all([
      queryCollectionSearchSections('blog')
    ])
  }, {
    server: false,
    transform: data => data.flat()
  })
])
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

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        shortcut="meta_k"
        :navigation="navigation"
        :links="navLinks"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>

    <UToaster />
  </div>
</template>
