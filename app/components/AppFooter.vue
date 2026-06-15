<script setup lang="ts">
const showWechatQr = ref(false)
const wechatButton = ref<HTMLElement | null>(null)
const wechatQr = ref<HTMLElement | null>(null)
const wechatQrPosition = ref({ left: 0, top: 0 })
const qrCanvas = ref<HTMLCanvasElement | null>(null)

function updateWechatQrPosition() {
  if (!wechatButton.value) return
  const rect = wechatButton.value.getBoundingClientRect()
  wechatQrPosition.value = {
    left: rect.left + rect.width / 2,
    top: rect.top - 12
  }
}

function openWechatQr() {
  updateWechatQrPosition()
  showWechatQr.value = true
}

function toggleWechatQr() {
  // Click toggles: if currently shown (or assembling), dissolve away; otherwise open.
  if (qrState === 'shown' || qrState === 'showing') {
    startDissolve()
    return
  }
  updateWechatQrPosition()
  showWechatQr.value = true
}

function handleDocumentPointerDown(event: PointerEvent) {
  if (!showWechatQr.value) return
  const target = event.target
  if (!(target instanceof Node)) return
  const isInsideButton = Boolean(wechatButton.value?.contains(target))
  const isInsideQr = Boolean(wechatQr.value?.contains(target))
  // Click anywhere outside the button or QR panel: dissolve away.
  if (isInsideButton || isInsideQr) return
  startDissolve()
}

function keepQrOpen() {
  if (qrState === 'hiding') {
    stopAnimation()
    qrState = 'shown'
    isDissolving.value = false
  }
}

// ---- Fragment assembly / dissolve animation ----
const FRAGMENT_SIZE = 10
const isDissolving = ref(false)
let qrImage: HTMLImageElement | null = null
let fragments: Fragment[] = []
let animFrame = 0

interface Fragment {
  sx: number; sy: number; sw: number; sh: number
  dx: number; dy: number; dw: number; dh: number
  startX: number; startY: number
  targetX: number; targetY: number
  rotation: number; targetRotation: number
  opacity: number; targetOpacity: number
}

function initFragments() {
  if (!qrCanvas.value || !qrImage) return
  const canvas = qrCanvas.value
  const pad = 4
  const drawSize = canvas.width - pad * 2
  const scale = drawSize / Math.max(qrImage.width, qrImage.height)
  const imgW = qrImage.width * scale
  const imgH = qrImage.height * scale
  const ox = pad + (drawSize - imgW) / 2
  const oy = pad + (drawSize - imgH) / 2
  const cols = Math.ceil(imgW / FRAGMENT_SIZE)
  const rows = Math.ceil(imgH / FRAGMENT_SIZE)
  const cx = canvas.width / 2
  const cy = canvas.height / 2

  fragments = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const dx = ox + col * FRAGMENT_SIZE
      const dy = oy + row * FRAGMENT_SIZE
      const dw = Math.min(FRAGMENT_SIZE, imgW - col * FRAGMENT_SIZE)
      const dh = Math.min(FRAGMENT_SIZE, imgH - row * FRAGMENT_SIZE)
      const sx = (col * FRAGMENT_SIZE) / scale
      const sy = (row * FRAGMENT_SIZE) / scale
      const sw = dw / scale
      const sh = dh / scale
      const angle = Math.random() * Math.PI * 2
      const dist = 50 + Math.random() * 80
      fragments.push({
        sx, sy, sw, sh,
        dx, dy, dw, dh,
        startX: cx + Math.cos(angle) * dist,
        startY: cy + Math.sin(angle) * dist,
        targetX: dx + dw / 2,
        targetY: dy + dh / 2,
        rotation: (Math.random() - 0.5) * Math.PI * 1.5,
        targetRotation: 0,
        opacity: 0,
        targetOpacity: 1
      })
    }
  }
}

function drawFrame(progress: number) {
  if (!qrCanvas.value || !qrImage) return
  const ctx = qrCanvas.value.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, qrCanvas.value.width, qrCanvas.value.height)

  const ease = 1 - Math.pow(1 - progress, 3)
  for (const f of fragments) {
    const alpha = f.opacity + (f.targetOpacity - f.opacity) * ease
    if (alpha <= 0.01) continue
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.translate(
      f.startX + (f.targetX - f.startX) * ease,
      f.startY + (f.targetY - f.startY) * ease
    )
    ctx.rotate(f.rotation + (f.targetRotation - f.rotation) * ease)
    ctx.drawImage(qrImage, f.sx, f.sy, f.sw, f.sh, -f.dw / 2, -f.dh / 2, f.dw, f.dh)
    ctx.restore()
  }
}

// Simple state: null (hidden), 'showing' (assembly in progress), 'shown' (fully visible), 'hiding' (dissolve in progress)
let qrState: null | 'showing' | 'shown' | 'hiding' = null

function stopAnimation() {
  cancelAnimationFrame(animFrame)
}

function startAssembly() {
  stopAnimation()
  qrState = 'showing'

  let start: number | null = null
  const dur = 550
  function step(time: number) {
    if (qrState !== 'showing') return
    if (!start) start = time
    const p = Math.min((time - start) / dur, 1)
    drawFrame(p)
    if (p < 1) {
      animFrame = requestAnimationFrame(step)
    } else {
      for (const f of fragments) {
        f.startX = f.targetX; f.startY = f.targetY
        f.rotation = 0; f.opacity = 1
      }
      drawFrame(1)
      qrState = 'shown'
    }
  }
  animFrame = requestAnimationFrame(step)
}

function startDissolve() {
  // Already hiding or hidden — nothing to do
  if (qrState === 'hiding' || qrState === null) return

  stopAnimation()
  isDissolving.value = true

  if (qrState === 'showing') {
    // Assembly was in progress — just hide immediately without dissolve
    isDissolving.value = false
    showWechatQr.value = false
    qrState = null
    return
  }

  // qrState === 'shown' — play dissolve animation
  qrState = 'hiding'

  const cx = qrCanvas.value?.width ? qrCanvas.value.width / 2 : 96
  const cy = qrCanvas.value?.height ? qrCanvas.value.height / 2 : 96
  for (const f of fragments) {
    f.startX = f.targetX; f.startY = f.targetY
    f.rotation = 0; f.opacity = 1
    const angle = Math.random() * Math.PI * 2
    const dist = 40 + Math.random() * 90
    f.targetX = cx + Math.cos(angle) * dist
    f.targetY = cy + Math.sin(angle) * dist
    f.targetRotation = (Math.random() - 0.5) * Math.PI * 2
    f.targetOpacity = 0
  }
  let start: number | null = null
  const dur = 380
  function step(time: number) {
    if (qrState !== 'hiding') return
    if (!start) start = time
    const p = Math.min((time - start) / dur, 1)
    drawFrame(p)
    if (p < 1) {
      animFrame = requestAnimationFrame(step)
    } else {
      qrState = null
      isDissolving.value = false
      showWechatQr.value = false
    }
  }
  animFrame = requestAnimationFrame(step)
}

onMounted(() => {
  window.addEventListener('pointerdown', handleDocumentPointerDown, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleDocumentPointerDown)
  stopAnimation()
})

watch(showWechatQr, async (visible) => {
  if (visible) {
    stopAnimation()
    isDissolving.value = false
    qrState = null

    // Wait for image to be ready
    if (!qrImage || !qrImage.complete) {
      qrImage = new Image()
      qrImage.src = '/contact-wechat-qr.jpg'
      await new Promise<void>((resolve) => { qrImage!.onload = () => resolve() })
    }

    await nextTick()
    // Guard: may have been hidden during async wait
    if (!showWechatQr.value || !qrCanvas.value) return

    qrCanvas.value.width = 192
    qrCanvas.value.height = 192
    initFragments()
    startAssembly()
  }
})

// Word cycling scramble: WYLONG → ART → TECH → DESIGN → WYLONG → ...
const WORDS = [
  { text: 'WYLONG', color: '#ffffff' },
  { text: 'ART',    color: '#fde047' },
  { text: 'TECH',   color: '#4FC08D' },
  { text: 'DESIGN', color: '#ec4899' }
]
const currentColor = ref(WORDS[0].color)
const displayChars = ref<string[]>(WORDS[0].text.split(''))
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// Hyperspeed background options — full cyberpunk / synthwave neon tunnel
const hyperspeedOptions = {
  distortion: 'deepDistortion' as const,
  length: 400,
  roadWidth: 9,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 155,
  speedUp: 2,
  carLightsFade: 0.35,
  totalSideLightSticks: 25,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.45,
  lightStickWidth: [0.12, 0.55] as [number, number],
  lightStickHeight: [1.2, 1.8] as [number, number],
  movingAwaySpeed: [60, 85] as [number, number],
  movingCloserSpeed: [-130, -170] as [number, number],
  carLightsLength: [400 * 0.03, 400 * 0.22] as [number, number],
  carLightsRadius: [0.05, 0.16] as [number, number],
  carWidthPercentage: [0.25, 0.5] as [number, number],
  carShiftX: [-0.7, 0.7] as [number, number],
  carFloorSeparation: [0, 5] as [number, number],
  colors: {
    // 深色路面带紫调
    roadColor: 0x0a0010,
    // 隔离带深蓝紫
    islandColor: 0x060018,
    // 背景纯黑
    background: 0x000000,
    // 路肩线：霓虹青
    shoulderLines: 0x00ffff,
    // 虚线：霓虹粉
    brokenLines: 0xff2d95,
    // 左侧车灯（远去）：霓虹青 → 电光蓝 → 紫色
    leftCars: [0x00ffff, 0x0080ff, 0xb400ff],
    // 右侧车灯（驶来）：霓虹粉 → 品红 → 橙红
    rightCars: [0xff2d95, 0xff00ff, 0xff6600],
    // 路灯柱：暗紫
    sticks: 0x8833ff
  }
}

let cycleTimer: ReturnType<typeof setTimeout> | null = null
let scrambleIntervals: ReturnType<typeof setInterval>[] = []

function scrambleTo(index: number) {
  const target = WORDS[index].text
  const maxLen = Math.max(displayChars.value.length, target.length)
  scrambleIntervals.forEach(clearInterval)
  scrambleIntervals = []
  for (let i = 0; i < maxLen; i++) {
    const interval = setInterval(() => {
      if (i < displayChars.value.length) {
        displayChars.value[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
      }
    }, 50)
    scrambleIntervals.push(interval)
    setTimeout(() => {
      clearInterval(interval)
      if (i < target.length) { displayChars.value[i] = target[i] }
      currentColor.value = WORDS[index].color
    }, 250 + i * 100)
  }
  setTimeout(() => { displayChars.value = target.split('') }, 250 + (maxLen - 1) * 100 + 50)
}

function startCycle() {
  let i = 0
  const next = () => {
    cycleTimer = setTimeout(() => {
      i = (i + 1) % WORDS.length
      scrambleTo(i)
      next()
    }, 2000)
  }
  next()
}

onMounted(() => { setTimeout(startCycle, 1500) })
onBeforeUnmount(() => {
  if (cycleTimer) clearTimeout(cycleTimer)
  scrambleIntervals.forEach(clearInterval)
})
</script>

<template>
  <footer class="relative w-full bg-[#0a0a0a] text-white/80 px-6 py-16 sm:py-20 border-t border-white/10 overflow-hidden">
    <!-- Hyperspeed cyberpunk tunnel background -->
    <div class="absolute inset-0 z-0 opacity-70">
      <BitsHyperspeed :effect-options="hyperspeedOptions" />
    </div>

    <div class="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 text-center sm:grid-cols-[1fr_auto_1fr]">
      <div class="sm:justify-self-start sm:text-left">
        <p class="text-sm font-light tracking-widest text-white/50 sm:text-base">
          期待与您共创未来
        </p>
        <p class="mt-2 text-sm font-medium tracking-wide text-white/60 sm:text-base">
          1066877627@qq.com
        </p>
      </div>

      <p
        class="text-3xl font-black sm:text-4xl transition-colors duration-500 min-w-[12rem] text-center"
        style="font-family: 'Montserrat', sans-serif; font-weight: 700;"
        :style="{ color: currentColor }"
      >
        <span v-for="(char, i) in displayChars" :key="i" class="inline-block">{{ char }}</span>
      </p>

      <div class="flex items-center justify-center gap-4 sm:col-start-3 sm:justify-self-end">
        <div class="relative">
          <button ref="wechatButton" type="button" class="footer-social-button" aria-label="微信" @click="toggleWechatQr">
            <UIcon name="i-simple-icons-wechat" class="size-5" />
          </button>
        </div>
        <a href="https://space.bilibili.com/3546668196694295/upload/video" target="_blank" rel="noreferrer" class="footer-social-button" aria-label="Bilibili">
          <UIcon name="i-simple-icons-bilibili" class="size-5" />
        </a>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showWechatQr || isDissolving"
        ref="wechatQr"
        class="fixed z-[300] w-48 -translate-x-1/2 -translate-y-full rounded-2xl border border-neutral-200 bg-white/95 backdrop-blur-xl overflow-hidden"
        :style="{ left: `${wechatQrPosition.left}px`, top: `${wechatQrPosition.top}px` }"
      >
        <canvas ref="qrCanvas" class="block w-full" />
      </div>
    </Teleport>
  </footer>
</template>

<style scoped>
.footer-social-button {
  display: inline-flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  color: rgb(163, 163, 163);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-social-button:hover {
  color: rgb(16, 185, 129);
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.08);
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 10px 20px -10px rgba(16, 185, 129, 0.25);
}
</style>
