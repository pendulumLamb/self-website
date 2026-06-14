<script setup lang="ts">
interface Segment {
  text: string
  color?: string
  /** Center angle in degrees. 0 = top, 90 = right, 180 = bottom, 270 = left. */
  center: number
  /** Angular span (degrees) the segment covers. */
  arc: number
  /** True for arcs where letters should face inward (upright on the bottom of the circle). */
  flip?: boolean
}

interface Props {
  segments: Segment[]
  spinDuration?: number
  className?: string
  fontFamily?: string
  fontWeight?: number | string
  fontSize?: number
  radius?: number
  defaultColor?: string
  /** When true, halt the spin and let each letter fly outward + fade. */
  exiting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  spinDuration: 20,
  className: '',
  fontFamily: '"Montserrat", sans-serif',
  fontWeight: 700,
  fontSize: 36,
  radius: 150,
  defaultColor: '#000',
  exiting: false
})

interface PlacedChar {
  ch: string
  color: string
  x: number
  y: number
  rotation: number
  /** Outward unit vector (sin, -cos) cached for the exit animation. */
  ux: number
  uy: number
}

const placed = computed<PlacedChar[]>(() => {
  const out: PlacedChar[] = []
  for (const seg of props.segments) {
    const chars = Array.from(seg.text)
    const n = chars.length
    if (n === 0) continue
    const color = seg.color || props.defaultColor
    const half = seg.arc / 2
    const sign = seg.flip ? -1 : 1
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0 : (i / (n - 1)) * seg.arc - half
      const angle = seg.center + sign * t
      const rad = (angle * Math.PI) / 180
      const ux = Math.sin(rad)
      const uy = -Math.cos(rad)
      const x = ux * props.radius
      const y = uy * props.radius
      const rotation = seg.flip ? angle + 180 : angle
      out.push({ ch: chars[i]!, color, x, y, rotation, ux, uy })
    }
  }
  return out
})

const containerSize = computed(() => `${props.radius * 2 + props.fontSize * 2}px`)

// How far each letter flies outward on exit.
const EXIT_DISTANCE = 600

function charTransform(c: PlacedChar) {
  if (props.exiting) {
    const ex = c.x + c.ux * EXIT_DISTANCE
    const ey = c.y + c.uy * EXIT_DISTANCE
    return `translate(-50%, -50%) translate(${ex}px, ${ey}px) rotate(${c.rotation}deg)`
  }
  return `translate(-50%, -50%) translate(${c.x}px, ${c.y}px) rotate(${c.rotation}deg)`
}
</script>

<template>
  <div
    class="circular-text"
    :class="[className, { 'is-exiting': exiting }]"
    :style="{
      '--spin-duration': `${spinDuration}s`,
      width: containerSize,
      height: containerSize,
      fontFamily,
      fontWeight: String(fontWeight)
    }"
  >
    <span
      v-for="(c, i) in placed"
      :key="i"
      class="circular-text__char"
      :style="{
        transform: charTransform(c),
        fontSize: `${fontSize}px`,
        color: c.color,
        transitionDelay: exiting ? `${(i % 6) * 30}ms` : '0ms'
      }"
    >{{ c.ch }}</span>
  </div>
</template>

<style scoped>
.circular-text {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.04em;
  animation: circular-spin var(--spin-duration, 20s) linear infinite;
  will-change: transform;
}

.circular-text.is-exiting {
  animation-play-state: paused;
}

.circular-text__char {
  position: absolute;
  left: 50%;
  top: 50%;
  display: inline-block;
  line-height: 1;
  white-space: pre;
  transition:
    transform 0.85s cubic-bezier(0.55, 0.05, 0.4, 1),
    opacity 0.7s ease-out;
}

.circular-text.is-exiting .circular-text__char {
  opacity: 0;
}

@keyframes circular-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>
