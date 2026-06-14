<script setup lang="ts">
const props = withDefaults(defineProps<{
  frontSrc: string
  backSrc: string
  cols?: number
  rows?: number
  alt?: string
}>(), {
  cols: 10,
  rows: 12,
  alt: '头像'
})

const container = ref<HTMLDivElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const COLS = props.cols
const ROWS = props.rows
const TILE_COUNT = COLS * ROWS

const tileProgress = ref(new Float32Array(TILE_COUNT))
const isHovering = ref(false)
const isCanvasReady = ref(false)
const hasLoadError = ref(false)

let frontImg: HTMLImageElement | null = null
let backImg: HTMLImageElement | null = null
let imagesReady = false
let animFrame = 0
let canvasW = 0
let canvasH = 0
let tileW = 0
let tileH = 0

async function loadImages() {
  isCanvasReady.value = false
  hasLoadError.value = false

  const load = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Failed to load ${src}`))
      img.src = src
    })

  try {
    const [f, b] = await Promise.all([load(props.frontSrc), load(props.backSrc)])
    frontImg = f
    backImg = b

    // Compute 1:1 source crop for each image (top-crop)
    frontCrop = squareCrop(f)
    backCrop = squareCrop(b)

    imagesReady = true
    fitCanvas()
    draw()
    isCanvasReady.value = true
  } catch (e) {
    hasLoadError.value = true
    console.error('AvatarFlip: image load failed', e)
  }
}

// Return the source rect for a 1:1 crop from the given image.
// "上部分裁一下" → crop from top (y=0), center horizontally.
function squareCrop(img: HTMLImageElement): { sx: number; sy: number; size: number } {
  const { naturalWidth: iw, naturalHeight: ih } = img
  const size = Math.min(iw, ih)
  // Vertical: cut 20% from top, 80% from bottom (keeps head area)
  const excessV = ih - size
  const sy = excessV > 0 ? excessV * 0.2 : 0
  // Horizontal: center
  const excessH = iw - size
  const sx = excessH > 0 ? excessH / 2 : 0
  return { sx, sy, size }
}

let frontCrop: { sx: number; sy: number; size: number } | null = null
let backCrop: { sx: number; sy: number; size: number } | null = null

function fitCanvas() {
  if (!canvas.value || !container.value || !frontImg) return
  const w = container.value.clientWidth
  if (w <= 0) return

  // 1:1 square canvas
  canvasW = w
  canvasH = w

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = Math.round(canvasW * dpr)
  canvas.value.height = Math.round(canvasH * dpr)
  canvas.value.style.cssText = 'display:block;width:100%;height:100%'

  tileW = canvasW / COLS
  tileH = canvasH / ROWS
}

function getDelay(col: number, row: number): number {
  const cx = (COLS - 1) / 2
  const cy = (ROWS - 1) / 2
  const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2)
  const maxDist = Math.sqrt(cx ** 2 + cy ** 2)
  return (dist / maxDist) * 0.4
}

let animStart = 0
const FLIP_DURATION = 0.5

function tick(now: number) {
  if (!animStart) animStart = now
  const elapsed = (now - animStart) / 1000
  const arr = tileProgress.value
  let anyAnimating = false

  for (let i = 0; i < TILE_COUNT; i++) {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    const delay = getDelay(col, row)

    if (isHovering.value) {
      const t = Math.max(0, Math.min(1, (elapsed - delay) / FLIP_DURATION))
      arr[i] = easeOutBack(t)
      if (t < 1) anyAnimating = true
    } else {
      const revDelay = getDelay(COLS - 1 - col, ROWS - 1 - row)
      const t = Math.max(0, Math.min(1, (elapsed - revDelay) / FLIP_DURATION))
      arr[i] = arr[i] * (1 - easeInOutCubic(t))
      if (arr[i] > 0.001) anyAnimating = true
      else arr[i] = 0
    }
  }

  draw()

  if (anyAnimating) {
    animFrame = requestAnimationFrame(tick)
  } else {
    animStart = 0
    animFrame = 0
    arr.fill(isHovering.value ? 1 : 0)
    draw()
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function draw() {
  const cvs = canvas.value
  if (!cvs || !frontImg || !backImg || !frontCrop || !backCrop) return
  const ctx = cvs.getContext('2d')
  if (!ctx) return

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.round(canvasW * dpr)
  const h = Math.round(canvasH * dpr)

  ctx.clearRect(0, 0, w, h)

  ctx.save()
  ctx.scale(dpr, dpr)

  const arr = tileProgress.value
  const anyAnimating = arr.some(v => v > 0.001 && v < 0.999)

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col
      const p = arr[idx]

      const x = col * tileW
      const y = row * tileH

      const flipScale = Math.cos(p * Math.PI)
      const absScale = Math.abs(flipScale)

      ctx.save()

      if (anyAnimating) {
        const gap = 1
        ctx.beginPath()
        ctx.rect(x + gap, y + gap, tileW - gap * 2, tileH - gap * 2)
        ctx.clip()
      } else {
        ctx.beginPath()
        ctx.rect(x, y, tileW, tileH)
        ctx.clip()
      }

      const cx = x + tileW / 2
      const cy = y + tileH / 2

      const img = flipScale >= 0 ? frontImg : backImg
      const crop = flipScale >= 0 ? frontCrop : backCrop
      const size = crop.size
      const sw = size / COLS
      const sh = size / ROWS
      const sx = crop.sx + col * sw
      const sy = crop.sy + row * sh

      ctx.translate(cx, cy)
      ctx.scale(absScale || 0.001, 1)
      ctx.translate(-cx, -cy)

      ctx.drawImage(img, sx, sy, sw, sh, x, y, tileW, tileH)
      ctx.restore()
    }
  }

  ctx.restore()
}

function onEnter() {
  if (!imagesReady) return
  isHovering.value = true
  cancelAnimationFrame(animFrame)
  animStart = 0
  animFrame = requestAnimationFrame(tick)
}

function onLeave() {
  if (!imagesReady) return
  isHovering.value = false
  cancelAnimationFrame(animFrame)
  animStart = 0
  animFrame = requestAnimationFrame(tick)
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    fitCanvas()
    draw()
  }, 150)
}

onMounted(() => {
  loadImages()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(animFrame)
  if (resizeTimer) clearTimeout(resizeTimer)
})
</script>

<template>
  <div ref="container" class="avatar-flip-wrap cursor-clickable" @mouseenter="onEnter" @mouseleave="onLeave">
    <img
      v-if="!isCanvasReady || hasLoadError"
      :src="frontSrc"
      :alt="alt"
      class="avatar-flip-fallback"
      @error="hasLoadError = true"
    >
    <canvas
      ref="canvas"
      class="avatar-flip-canvas"
      :class="{ 'avatar-flip-canvas--ready': isCanvasReady && !hasLoadError }"
    />
  </div>
</template>

<style scoped>
.avatar-flip-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f8f8f8;
  line-height: 0;
}

.avatar-flip-canvas,
.avatar-flip-fallback {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.avatar-flip-canvas {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.avatar-flip-canvas--ready {
  opacity: 1;
}

.avatar-flip-fallback {
  object-fit: cover;
}
</style>
