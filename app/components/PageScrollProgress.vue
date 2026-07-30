<script setup lang="ts">
const props = defineProps<{
  progress: number
  viewportHeight: number
  label: string
}>()

const slider = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const dragProgress = ref<number | null>(null)

let scrollFrame = 0
let pendingProgress = 0
let previousScrollBehavior = ''
let previousUserSelect = ''

const visibleProgress = computed(() => dragProgress.value ?? props.progress)
const progressPercent = computed(() => Math.round(props.progress * 100))
const fillStyle = computed(() => ({ height: `${visibleProgress.value * 100}%` }))

function getMaxPageScroll() {
  return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
}

function applyProgress(progress: number) {
  const top = Math.min(Math.max(progress, 0), 1) * getMaxPageScroll()
  window.scrollTo(0, top)
  document.documentElement.scrollTop = top
  document.body.scrollTop = top
}

function scrollToProgress(progress: number) {
  pendingProgress = Math.min(Math.max(progress, 0), 1)
  dragProgress.value = pendingProgress

  if (scrollFrame) return

  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0
    applyProgress(pendingProgress)
  })
}

function updateFromPointer(event: PointerEvent) {
  if (!slider.value) return
  const rect = slider.value.getBoundingClientRect()
  scrollToProgress((event.clientY - rect.top) / rect.height)
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  event.preventDefault()
  isDragging.value = true
  slider.value?.setPointerCapture(event.pointerId)
  previousScrollBehavior = document.documentElement.style.scrollBehavior
  previousUserSelect = document.body.style.userSelect
  document.documentElement.style.scrollBehavior = 'auto'
  document.body.style.userSelect = 'none'
  document.documentElement.classList.add('is-scroll-dragging')
  updateFromPointer(event)
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  event.preventDefault()
  updateFromPointer(event)
}

function stopDragging(event?: PointerEvent) {
  if (!isDragging.value) return
  if (event && slider.value?.hasPointerCapture(event.pointerId)) {
    slider.value.releasePointerCapture(event.pointerId)
  }
  if (scrollFrame) {
    window.cancelAnimationFrame(scrollFrame)
    scrollFrame = 0
    applyProgress(pendingProgress)
  }
  isDragging.value = false
  dragProgress.value = null
  document.documentElement.style.scrollBehavior = previousScrollBehavior
  document.body.style.userSelect = previousUserSelect
  document.documentElement.classList.remove('is-scroll-dragging')
}

function onKeydown(event: KeyboardEvent) {
  const maxScroll = getMaxPageScroll()
  if (maxScroll <= 0) return

  const smallStep = 48 / maxScroll
  const largeStep = props.viewportHeight / maxScroll

  const targets: Partial<Record<string, number>> = {
    ArrowDown: props.progress + smallStep,
    ArrowUp: props.progress - smallStep,
    PageDown: props.progress + largeStep,
    PageUp: props.progress - largeStep,
    Home: 0,
    End: 1
  }
  const target = targets[event.key]
  if (target === undefined) return

  event.preventDefault()
  scrollToProgress(target)
}

onBeforeUnmount(() => {
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
  if (import.meta.client) {
    document.documentElement.style.scrollBehavior = previousScrollBehavior
    document.body.style.userSelect = previousUserSelect
    document.documentElement.classList.remove('is-scroll-dragging')
  }
})
</script>

<template>
  <div
    ref="slider"
    class="scroll-progress-control cursor-grab-custom fixed right-3 top-1/2 z-[120] h-40 w-8 -translate-y-1/2 touch-none select-none sm:right-5 sm:h-44"
    :class="{ 'is-dragging': isDragging }"
    role="slider"
    tabindex="0"
    aria-orientation="vertical"
    :aria-label="label"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="progressPercent"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="stopDragging"
    @pointercancel="stopDragging"
    @lostpointercapture="stopDragging"
    @keydown="onKeydown"
  >
    <div class="scroll-progress-rail">
      <div
        class="scroll-progress-fill"
        :style="fillStyle"
      />
    </div>
  </div>
</template>

<style scoped>
.scroll-progress-control {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.scroll-progress-rail {
  position: relative;
  width: 4px;
  height: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(163 163 163 / 0.24);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.35);
  backdrop-filter: blur(8px);
  transition:
    width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    height 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.scroll-progress-control:hover .scroll-progress-rail,
.scroll-progress-control:focus-visible .scroll-progress-rail,
.scroll-progress-control.is-dragging .scroll-progress-rail {
  width: 14px;
  height: calc(100% + 2.5rem);
  background: rgb(163 163 163 / 0.34);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.58),
    0 14px 34px rgb(15 23 42 / 0.16);
}

.scroll-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 999px;
  background: #10b981;
  box-shadow: 0 0 16px rgb(16 185 129 / 0.65);
  transition: height 120ms ease-out;
}

.scroll-progress-control.is-dragging .scroll-progress-fill {
  transition: none;
}
</style>
