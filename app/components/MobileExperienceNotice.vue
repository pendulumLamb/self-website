<script setup lang="ts">
defineProps<{
  isEnglish: boolean
}>()

const { width } = useWindowSize()
const visible = ref(false)
const dismissed = ref(false)

function close() {
  dismissed.value = true
  visible.value = false
}

watch(width, (value) => {
  if (!dismissed.value) visible.value = value < 768
})

onMounted(() => {
  visible.value = !dismissed.value && window.innerWidth < 768
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="mobile-notice fixed inset-0 z-[260] flex items-center justify-center bg-black/78 px-6 text-white backdrop-blur-sm sm:hidden"
      @click.self="close"
    >
      <div class="mobile-notice-panel w-full max-w-xs rounded-2xl bg-black/90 p-6 text-center shadow-2xl shadow-black/40">
        <p class="text-lg leading-8 font-semibold">
          {{ isEnglish ? 'Desktop viewing is recommended for the best experience.' : '推荐电脑端浏览，以体验最佳网页展示效果。' }}
        </p>
        <button
          type="button"
          class="mt-5 rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
          @click="close"
        >
          {{ isEnglish ? 'Got it' : '我知道了' }}
        </button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mobile-notice {
  animation: mobile-notice-fade 180ms ease both;
}

.mobile-notice-panel {
  animation: mobile-notice-pop 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes mobile-notice-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes mobile-notice-pop {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
</style>
