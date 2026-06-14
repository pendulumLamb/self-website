<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, type StyleValue } from 'vue'

const props = withDefaults(defineProps<{
  radius?: number      // px — max distance for effect
  baseWeight?: number  // default font-weight
  maxWeight?: number   // font-weight at cursor center
}>(), {
  radius: 180,
  baseWeight: 400,
  maxWeight: 800
})

const wrapper = ref<HTMLElement | null>(null)
const mouseX = ref(-9999)
const mouseY = ref(-9999)

function onMove(e: PointerEvent) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

function onLeave() {
  mouseX.value = -9999
  mouseY.value = -9999
}

function spanStyle(el: HTMLElement): StyleValue {
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dist = Math.hypot(mouseX.value - cx, mouseY.value - cy)
  const t = Math.max(0, 1 - dist / props.radius)
  // ease-out quad
  const w = props.baseWeight + (props.maxWeight - props.baseWeight) * (t * t)
  return {
    fontWeight: Math.round(w),
    fontVariationSettings: `"wght" ${Math.round(w)}`
  }
}

// Expose for parent to use per-span
defineExpose({ spanStyle, mouseX, mouseY })

onMounted(() => {
  wrapper.value?.addEventListener('pointermove', onMove, { passive: true })
  wrapper.value?.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  wrapper.value?.removeEventListener('pointermove', onMove)
  wrapper.value?.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div ref="wrapper" class="variable-proximity-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.variable-proximity-wrapper {
  /* no extra styling needed */
}
</style>
