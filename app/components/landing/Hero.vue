<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: IndexCollectionItem
  scrollY: number
}>()

const { height: windowHeight } = useWindowSize()

const backMountainLimit = computed(() => windowHeight.value < 768 ? 150 : 200)
const midMountainLimit = computed(() => windowHeight.value < 768 ? 90 : 100)

const progress = computed(() => Math.max(props.scrollY, 0))

const heroParallaxStyle = computed(() => {
  const height = windowHeight.value || 900
  const overlapStart = height * 1.5

  if (progress.value <= overlapStart) {
    return {}
  }

  const distance = progress.value - overlapStart

  return {
    transform: `translate3d(0, ${-distance * 0.5}px, 0)`
  }
})

const { displayText, cursorVisible } = useTypewriter([
  '欢迎来到我的网站',
  '请继续浏览'
], {
  typeSpeed: 100,
  deleteSpeed: 55,
  pauseDuration: 1500,
  startDelay: 1000
})
</script>

<template>
  <section
    class="sticky top-0 z-0 h-screen overflow-hidden bg-[#1A1A1A]"
    :style="heroParallaxStyle"
  >
    <div class="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]" />

    <div
      class="absolute inset-0 z-0 bg-gradient-to-b from-[#4B5563] via-[#6B7280] to-[#9CA3AF]"
      :style="{ opacity: Math.min(Math.max((progress - 300) / 600, 0), 1) }"
    />

    <div
      class="animate-pulse-slow absolute inset-0 z-0 opacity-80 transition-opacity duration-1000"
      :style="{ opacity: Math.min(Math.max((progress - 100) / 400, 0), 0.8) }"
    >
      <svg
        class="size-full text-white/40"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle
          cx="10"
          cy="15"
          r="0.2"
          fill="currentColor"
        />
        <circle
          cx="25"
          cy="5"
          r="0.1"
          fill="currentColor"
        />
        <circle
          cx="50"
          cy="20"
          r="0.15"
          fill="currentColor"
        />
        <circle
          cx="70"
          cy="10"
          r="0.2"
          fill="currentColor"
        />
        <circle
          cx="85"
          cy="25"
          r="0.1"
          fill="currentColor"
        />
        <circle
          cx="95"
          cy="5"
          r="0.15"
          fill="currentColor"
        />
        <circle
          cx="15"
          cy="45"
          r="0.1"
          fill="currentColor"
        />
        <circle
          cx="40"
          cy="50"
          r="0.15"
          fill="currentColor"
        />
        <circle
          cx="80"
          cy="40"
          r="0.1"
          fill="currentColor"
        />
      </svg>
    </div>

    <div
      class="absolute inset-0 z-0 transition-opacity duration-1000"
      :style="{ opacity: Math.min(Math.max((progress - 200) / 600, 0), 1) }"
    >
      <svg
        class="size-full text-white"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle
          cx="20"
          cy="15"
          r="0.3"
          fill="currentColor"
          class="animate-twinkle"
          style="animation-delay: 0s"
        />
        <circle
          cx="80"
          cy="20"
          r="0.4"
          fill="currentColor"
          class="animate-twinkle"
          style="animation-delay: 1.5s"
        />
        <circle
          cx="50"
          cy="35"
          r="0.25"
          fill="currentColor"
          class="animate-twinkle"
          style="animation-delay: 2.5s"
        />
        <circle
          cx="10"
          cy="45"
          r="0.35"
          fill="currentColor"
          class="animate-twinkle"
          style="animation-delay: 0.8s"
        />
        <circle
          cx="90"
          cy="48"
          r="0.3"
          fill="currentColor"
          class="animate-twinkle"
          style="animation-delay: 3s"
        />
      </svg>
    </div>

    <div
      class="absolute left-1/2 z-10 size-32 rounded-full transition-transform duration-75 ease-out md:size-48"
      :style="{
        top: '50%',
        transform: `translate(-50%, ${Math.max(150 - progress * 0.4, -300)}px)`,
        opacity: Math.min(Math.max((progress - 200) / 600, 0), 1),
        filter: `brightness(${0.5 + Math.min(progress / 1000, 1)}) drop-shadow(0 0 ${Math.min(progress / 15, 100)}px rgba(255,255,255,${Math.min(progress / 1200, 0.8)}))`
      }"
    >
      <div class="size-full rounded-full bg-[#ffffee] blur-[1px]" />
      <div class="absolute top-1/4 left-1/4 size-1/5 rounded-full bg-gray-400/10 blur-[2px]" />
    </div>

    <div
      class="absolute right-0 bottom-0 left-0 z-20 h-[40vh] text-[#2a2a2a] transition-transform duration-75 ease-out md:h-[60vh]"
      :style="{ transform: `translateY(${Math.min(progress * 0.15, backMountainLimit)}px)` }"
    >
      <svg
        class="size-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
      >
        <path
          d="M0,600 L0,300 C200,250 400,350 600,200 C800,50 1000,300 1200,250 L1440,350 L1440,600 Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div
      class="absolute right-0 bottom-0 left-0 z-30 h-[30vh] text-[#1f1f1f] transition-transform duration-75 ease-out md:h-[50vh]"
      :style="{ transform: `translateY(${Math.min(progress * 0.08, midMountainLimit)}px)` }"
    >
      <svg
        class="size-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 500"
      >
        <path
          d="M0,500 L0,200 L100,300 L200,150 L350,350 L500,200 L700,400 L900,150 L1100,300 L1300,200 L1440,250 L1440,500 Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div class="pointer-events-none absolute right-0 bottom-0 left-0 z-40 flex h-[20vh] items-end justify-center md:h-[40vh]">
      <div class="relative mb-[-1px] h-full w-12 text-[#0d0d0d] md:w-32">
        <svg
          class="size-full overflow-visible"
          preserveAspectRatio="none"
          viewBox="0 0 100 300"
        >
          <path
            d="M20,300 L30,50 L70,50 L80,300 Z"
            fill="currentColor"
          />
          <rect
            x="25"
            y="40"
            width="50"
            height="10"
            fill="currentColor"
          />
          <rect
            x="30"
            y="20"
            width="40"
            height="20"
            fill="currentColor"
          />
          <path
            d="M30,20 L50,0 L70,20 Z"
            fill="currentColor"
          />
          <line
            x1="20"
            y1="50"
            x2="80"
            y2="50"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>

        <div
          class="pointer-events-none absolute top-[10%] left-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen transition-opacity duration-500"
          :style="{ opacity: Math.min(Math.max((progress - 200) / 600, 0), 1) }"
        >
          <div class="size-full rounded-full bg-[radial-gradient(circle,rgba(255,255,200,0.8)_0%,rgba(255,255,0,0)_70%)] blur-[20px]" />
        </div>

        <div
          class="animate-scan pointer-events-none absolute top-[10%] left-1/2 h-[400px] w-[150vh] origin-left transition-opacity duration-500"
          :style="{ opacity: Math.min(Math.max((progress - 200) / 600, 0), 0.7) }"
        >
          <div class="size-full bg-gradient-to-r from-yellow-100/90 via-yellow-100/30 to-transparent lighthouse-beam" />
        </div>

        <div
          class="absolute top-[10%] left-1/2 h-2 w-4 -translate-x-1/2 -translate-y-1/2 bg-yellow-200 blur-[1px] transition-opacity duration-300 md:h-4 md:w-8 md:blur-[2px]"
          :style="{ opacity: Math.min(Math.max((progress - 200) / 600, 0), 1) }"
        />
      </div>
    </div>

    <div class="absolute right-0 bottom-0 left-0 z-40 h-[12vh] text-black md:h-[25vh]">
      <svg
        class="size-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 250"
      >
        <path
          d="M0,250 L0,100 C100,120 200,80 300,150 C400,100 500,180 600,120 C700,200 800,100 900,150 C1000,50 1100,120 1200,80 C1300,150 1400,100 1440,120 L1440,250 Z"
          fill="currentColor"
        />
        <path
          d="M100,120 L110,95 L105,95 L115,70 L110,70 L120,50 L130,70 L125,70 L135,95 L130,95 L140,120 Z"
          fill="currentColor"
        />
        <path
          d="M250,150 L260,120 L255,120 L265,90 L260,90 L270,60 L280,90 L275,90 L285,120 L280,120 L290,150 Z"
          fill="currentColor"
        />
        <path
          d="M850,150 L865,115 L860,115 L872,80 L867,80 L880,40 L893,80 L888,80 L900,115 L895,115 L910,150 Z"
          fill="currentColor"
        />
        <rect
          x="1267"
          y="100"
          width="6"
          height="15"
          fill="currentColor"
        />
        <path
          d="M1250,100 L1260,75 L1255,75 L1265,50 L1260,50 L1270,30 L1280,50 L1275,50 L1285,75 L1280,75 L1290,100 Z"
          fill="currentColor"
        />
      </svg>
    </div>

    <div class="pointer-events-none relative z-50 flex h-full flex-col items-center justify-center px-6 pt-20 text-center">
      <div class="animate-fade-in -mt-32 space-y-6 text-white mix-blend-difference md:-mt-40 md:space-y-8">
        <h1
          class="select-none text-5xl leading-none font-thin transition-all duration-100 ease-out md:text-7xl lg:text-9xl"
          :style="{
            letterSpacing: `${0.1 + progress * 0.002}em`,
            opacity: Math.max(1 - progress / 500, 0),
            filter: `blur(${progress * 0.02}px)`,
            transform: `scale(${1 + progress * 0.001})`
          }"
        >
          {{ displayText }}<span
            :class="{ 'opacity-0': !cursorVisible }"
            class="font-normal"
          >|</span>
        </h1>
      </div>
    </div>

    <div
      class="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-4 text-white/50 transition-opacity duration-300"
      :style="{ opacity: Math.max(1 - progress / 200, 0) }"
    >
      <div class="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 p-1">
        <div class="animate-scroll-down h-2 w-1 rounded-full bg-white" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-scan {
  animation: scan 8s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-scroll-down {
  animation: scroll-down 2s ease-in-out infinite;
}

.lighthouse-beam {
  clip-path: polygon(0% 49%, 100% 0%, 100% 100%, 0% 51%);
  mask-image: linear-gradient(to right, transparent, black 10%);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%);
}

@keyframes scan {
  0%,
  100% {
    transform: translateY(-50%) rotate(30deg);
  }

  50% {
    transform: translateY(-50%) rotate(150deg);
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scroll-down {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  50% {
    opacity: 0.5;
    transform: translateY(6px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
