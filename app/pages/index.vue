<script setup lang="ts">
import {
  getAboutIntroParagraphs,
  getArtCollections,
  getProjects,
  getTechGroups,
  getWorkCountLabel,
  getWorkExperiences
} from '~/data/portfolio'
import ProjectSection from '~/components/home/ProjectSection.vue'

const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const { scrollY, easedScrollY } = useScrollY()
const { height: windowHeight } = useWindowSize()
const { locale, isEnglish } = useSiteI18n()

const seoTitle = computed(() => locale.value === 'en'
  ? 'WYLONG Portfolio'
  : page.value?.seo.title || page.value?.title)
const seoDescription = computed(() => locale.value === 'en'
  ? 'Personal portfolio of WYLONG, covering full-stack engineering, IoT, AI systems, visual design, projects, and art collections.'
  : page.value?.seo.description || page.value?.description)

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDescription,
  ogDescription: seoDescription,
  ogImage: '/hero/random-1.avif'
})

const viewportHeight = computed(() => {
  return Number.isFinite(windowHeight.value) && windowHeight.value > 0 ? windowHeight.value : 900
})

const coverProgress = computed(() => {
  const height = viewportHeight.value
  const eased = Number.isFinite(easedScrollY.value) ? easedScrollY.value : 0

  // Start later (at 120% viewport height), take longer to complete (by 240%)
  return Math.min(Math.max((eased - height * 1.2) / (height * 1.2), 0), 1)
})

const coverPanelStyle = computed(() => {
  if (coverProgress.value >= 0.999) {
    return {
      transform: 'none',
      willChange: 'auto'
    }
  }

  const liftOffset = (1 - coverProgress.value) * viewportHeight.value * 0.25

  return {
    transform: `translate3d(0, ${liftOffset}px, 0)`,
    willChange: 'transform'
  }
})

const pageScrollProgress = computed(() => {
  if (!import.meta.client) {
    return 0
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight

  if (maxScroll <= 0) {
    return 0
  }

  const raw = Number.isFinite(scrollY.value) ? scrollY.value : 0

  return Math.min(Math.max(raw / maxScroll, 0), 1)
})

const sectionTitleClass = computed(() => isEnglish.value
  ? 'text-4xl leading-none font-black tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl'
  : 'text-5xl leading-none font-black tracking-tight text-neutral-950 sm:text-7xl lg:text-8xl')

const aboutTextClass = computed(() => isEnglish.value
  ? 'space-y-6 text-xl leading-9 text-neutral-700 sm:text-2xl sm:leading-10'
  : 'space-y-7 text-2xl leading-11 text-neutral-700')

const previewEntryLabel = computed(() => locale.value === 'en' ? 'Preview' : '预览入口')
const unavailablePreviewLabel = computed(() => locale.value === 'en' ? 'Preview unavailable' : '暂不可预览')
const workCountLabel = (count: number) => getWorkCountLabel(isEnglish.value, count)

const techSection = ref<HTMLElement | null>(null)
const techSectionTop = ref(0)
const techSectionHeight = ref(0)
const hasTechSectionMetrics = ref(false)
const aboutIntro = ref<HTMLElement | null>(null)
const aboutIntroTop = ref(0)
const hasAboutIntroMetrics = ref(false)

// ---- Art collection scroll-driven reveal ----
const artGrid = ref<HTMLElement | null>(null)
const artCardRevealed = ref<boolean[]>([])

function observeArtCards() {
  if (!artGrid.value) return
  const cards = artGrid.value.querySelectorAll<HTMLElement>('.art-collection-card')
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const idx = Number(target.dataset.index)
          if (!isNaN(idx)) {
            artCardRevealed.value[idx] = true
            observer.unobserve(target)
          }
        }
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
  )
  cards.forEach((card) => observer.observe(card))
}

// ---- Scatter → reassemble + Variable Proximity ----
const aboutMouseX = ref(-9999)
const aboutMouseY = ref(-9999)
const PROX_RADIUS = 160

// Flat correct chars, built after aboutIntroParagraphs is defined
let correctChars: { char: string; index: number }[] = []

// Each character's random starting scatter offset (set once during init)
interface CharScatter { x: number; y: number; rot: number }
let charScatters: CharScatter[] = []

function initCharData() {
  correctChars = []
  for (const p of aboutIntroParagraphs.value) {
    for (const ch of Array.from(p)) {
      correctChars.push({ char: ch, index: correctChars.length })
    }
  }
  // Pre-generate scatter offsets: wide horizontal spread, slight vertical + rotation
  charScatters = correctChars.map(() => ({
    x: (Math.random() - 0.5) * 500,
    y: (Math.random() - 0.5) * 160,
    rot: (Math.random() - 0.5) * 50
  }))
}

function onAboutPointerMove(e: PointerEvent) {
  aboutMouseX.value = e.clientX
  aboutMouseY.value = e.clientY
}
function onAboutPointerLeave() {
  aboutMouseX.value = -9999
  aboutMouseY.value = -9999
}

const charEls: Record<number, HTMLElement> = {}
function setCharEl(index: number) {
  return (el: unknown) => {
    if (el instanceof HTMLElement) charEls[index] = el
    else delete charEls[index]
  }
}

function getProximityWeight(el: HTMLElement | undefined): number {
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dist = Math.hypot(aboutMouseX.value - cx, aboutMouseY.value - cy)
  const t = Math.max(0, 1 - dist / PROX_RADIUS)
  return t * t
}

function getCharRevealProgress(index: number): number {
  const total = correctChars.length
  const revealRange = 0.14
  const itemStart = total <= 1 ? 0 : (index / (total - 1)) * (1 - revealRange)
  return Math.min(Math.max((aboutIntroScrollProgress.value - itemStart) / revealRange, 0), 1)
}

function getCombinedCharStyle(index: number): Record<string, string | number> {
  const t = getCharRevealProgress(index)
  // easeOutBack: characters snap into place
  const c1 = 1.70158; const c3 = c1 + 1
  const ease = t >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)

  const s = charScatters[index] ?? { x: 0, y: 0, rot: 0 }
  const dx = s.x * (1 - ease)
  const dy = s.y * (1 - ease)
  const dr = s.rot * (1 - ease)

  const proxT = getProximityWeight(charEls[index])
  const r = Math.round(55 + proxT * (16 - 55))
  const g = Math.round(55 + proxT * (185 - 55))
  const b = Math.round(55 + proxT * (129 - 55))

  return {
    opacity: 0.25 + ease * 0.75,
    transform: `translate3d(${dx}px, ${dy}px, 0) rotate(${dr}deg)`,
    color: `rgb(${r},${g},${b})`
  }
}

const workTrack = ref<HTMLElement | null>(null)
const workTrackTop = ref(0)
const hasWorkTrackMetrics = ref(false)

const aboutIntroParagraphs = computed(() => getAboutIntroParagraphs(isEnglish.value))

watch(aboutIntroParagraphs, () => initCharData(), { immediate: true })

const techGroups = computed(() => getTechGroups(isEnglish.value))
const workExperiences = computed(() => getWorkExperiences(isEnglish.value))
const projects = computed(() => getProjects(isEnglish.value))
const artCollections = computed(() => getArtCollections(isEnglish.value))
const {
  activeCollection: activeWorkCollection,
  activeImage: activeGalleryImage,
  openCollection: openWorkCollection,
  closeCollection: closeWorkCollection,
  openImage: openGalleryImage,
  closeImage: closeGalleryImage
} = useArtGallery(artCollections)

// Init art card reveal state after artCollections is defined
watch(artCollections, collections => {
  artCardRevealed.value = collections.map(() => false)
  nextTick(() => observeArtCards())
}, { immediate: true })

const indexedTechGroups = computed(() => {
  let index = 0

  return techGroups.value.map((group) => {
    const groupIndex = index++
    const items = group.items.map(item => ({
      ...item,
      index: index++
    }))

    return {
      ...group,
      index: groupIndex,
      items
    }
  })
})

const techItemsCount = computed(() => {
  return techGroups.value.reduce((total, group) => total + group.items.length + 1, 0)
})

const indexedAboutIntroParagraphs = computed(() => {
  let index = 0

  return aboutIntroParagraphs.value.map(paragraph => ({
    text: paragraph,
    chars: Array.from(paragraph).map(ch => ({
      char: ch,
      index: index++
    }))
  }))
})

const aboutIntroScrollProgress = computed(() => {
  if (!hasAboutIntroMetrics.value) {
    return 0
  }

  const height = viewportHeight.value
  const eased = Number.isFinite(easedScrollY.value) ? easedScrollY.value : 0

  if (import.meta.client && aboutIntro.value) {
    const introTop = aboutIntro.value.getBoundingClientRect().top
    const startTop = height * 0.82
    const endTop = height * 0.46

    return Math.min(Math.max((startTop - introTop) / (startTop - endTop), 0), 1)
  }

  const start = aboutIntroTop.value - height * 0.82
  const end = aboutIntroTop.value - height * 0.46

  return Math.min(Math.max((eased - start) / (end - start), 0), 1)
})

const techScrollProgress = computed(() => {
  if (!hasTechSectionMetrics.value) {
    return 0
  }

  const height = viewportHeight.value
  const sectionHeight = techSectionHeight.value || height
  const start = techSectionTop.value - height * 0.78
  const end = techSectionTop.value + sectionHeight - height * 0.22
  const eased = Number.isFinite(easedScrollY.value) ? easedScrollY.value : 0

  return Math.min(Math.max((eased - start) / (end - start), 0), 1)
})

function getTechItemStyle(index: number) {
  const total = techItemsCount.value
  const itemRatio = total <= 1 ? 0 : index / (total - 1)
  const revealRange = 0.055
  const exitRange = 0.055
  const revealStart = itemRatio * (0.56 - revealRange)
  const exitStart = 0.5 + itemRatio * (0.48 - exitRange)
  const revealProgress = Math.min(Math.max((techScrollProgress.value - revealStart) / revealRange, 0), 1)
  const exitProgress = Math.min(Math.max((techScrollProgress.value - exitStart) / exitRange, 0), 1)
  // easeOutBack: items "pop" into place with a slight jelly overshoot.
  const c1 = 1.70158
  const c3 = c1 + 1
  const t = revealProgress
  const revealEase = revealProgress === 0
    ? 0
    : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  const exitEase = exitProgress ** 2
  const opacity = Math.min(revealEase * 1.15, 1) * (1 - exitEase)
  const translateY = (1 - revealEase) * 72 + exitEase * 48
  const scale = 0.94 + revealEase * 0.06 - exitEase * 0.03

  return {
    opacity,
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`
  }
}

const workCollapsedGap = 156
const workExpandedGap = 560

const workStageHeight = computed(() => {
  return Math.max(viewportHeight.value - 72, 760)
})

const workScrollLength = computed(() => {
  return viewportHeight.value * Math.max(workExperiences.value.length - 1, 1) * 1.05
})

const workTrackStyle = computed(() => {
  return {
    height: `${workStageHeight.value + workScrollLength.value}px`
  }
})

const workScrollProgress = computed(() => {
  if (!hasWorkTrackMetrics.value) {
    return 0
  }

  const start = import.meta.client && workTrack.value
    ? workTrack.value.getBoundingClientRect().top + window.scrollY - 72
    : workTrackTop.value - 72
  const end = start + workScrollLength.value
  const raw = Number.isFinite(scrollY.value) ? scrollY.value : 0

  return Math.min(Math.max((raw - start) / (end - start), 0), 1)
})

function getWorkCardStyle(index: number) {
  const totalCards = workExperiences.value.length
  // Each card's motion window starts before the previous card has fully
  // settled. Without this overlap there's a dead zone of scrolling where
  // the previous card is locked in but the next one is still off-screen.
  const overlap = 0.55
  const lastSettlePhase = Math.max(totalCards - 2, 0) * overlap + 1
  const phase = workScrollProgress.value * lastSettlePhase
  const itemProgress = index === 0
    ? 1
    : Math.min(Math.max(phase - (index - 1) * overlap, 0), 1)
  const startTop = index * workExpandedGap
  const endTop = index * workCollapsedGap
  const top = startTop + (endTop - startTop) * itemProgress

  return {
    zIndex: 20 + index,
    transform: `translate3d(0, ${top}px, 0)`
  }
}

function handleArtCardMove(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--chroma-x', `${event.clientX - rect.left}px`)
  el.style.setProperty('--chroma-y', `${event.clientY - rect.top}px`)
  el.style.setProperty('--chroma-on', '1')
}

function handleArtCardLeave(event: PointerEvent) {
  const el = event.currentTarget as HTMLElement
  el.style.setProperty('--chroma-on', '0')
}

function updateScrollSectionMetrics() {
  if (aboutIntro.value) {
    aboutIntroTop.value = aboutIntro.value.getBoundingClientRect().top + window.scrollY
    hasAboutIntroMetrics.value = true
  }

  if (techSection.value) {
    techSectionTop.value = techSection.value.getBoundingClientRect().top + window.scrollY
    techSectionHeight.value = techSection.value.offsetHeight
    hasTechSectionMetrics.value = true
  }

  if (workTrack.value) {
    workTrackTop.value = workTrack.value.getBoundingClientRect().top + window.scrollY
    hasWorkTrackMetrics.value = true
  }
}

onMounted(() => {
  updateScrollSectionMetrics()
  window.addEventListener('resize', updateScrollSectionMetrics)
  requestAnimationFrame(updateScrollSectionMetrics)

  // Art collection per-card scroll reveal
  nextTick(() => observeArtCards())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollSectionMetrics)
})
</script>

<template>
  <div v-if="page">
    <PageScrollProgress
      :progress="pageScrollProgress"
      :viewport-height="viewportHeight"
      :label="locale === 'en' ? 'Page scroll progress' : '页面滚动进度'"
    />

    <div class="relative w-full overflow-x-clip">
      <div class="relative h-[300vh] bg-[#1A1A1A]">
        <LandingHero
          :page
          :scroll-y="easedScrollY"
        />
      </div>

      <section
        class="relative z-[1] -mt-[100vh] min-h-screen overflow-visible rounded-t-[2rem] bg-default ring-1 ring-default/60 sm:rounded-t-[3rem]"
        :style="coverPanelStyle"
      >
        <div class="min-h-screen bg-white px-6 py-20 text-neutral-950 sm:px-10 lg:px-16 lg:py-28">
          <div class="mx-auto max-w-6xl">
            <div class="max-w-4xl">
              <h2 id="about-intro" class="scroll-mt-20" :class="sectionTitleClass">
                {{ locale === 'en' ? 'About Me' : '个人简介' }}
              </h2>
            </div>

            <div class="mt-18 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <div class="relative mx-auto w-full max-w-md">
                <div class="relative overflow-hidden rounded-[1.75rem] border border-neutral-200 bg-white">
                  <AvatarFlip
                    front-src="/avatar.jpg"
                    back-src="/selfie.jpg"
                    :alt="locale === 'en' ? 'WYLONG avatar' : '吴永龙头像'"
                    :cols="10"
                    :rows="12"
                  />
                </div>
              </div>

              <div class="space-y-8">
                <p class="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  {{ locale === 'en' ? 'Hi, I am WYLONG' : 'Hi，我是吴永龙' }}
                </p>
                <div
                  ref="aboutIntro"
                  data-motion="about-intro"
                  :class="aboutTextClass"
                  @pointermove="onAboutPointerMove"
                  @pointerleave="onAboutPointerLeave"
                >
                  <p
                    v-for="paragraph in indexedAboutIntroParagraphs"
                    :key="paragraph.text"
                    class="whitespace-pre-wrap"
                  >
                    <span
                      v-for="char in paragraph.chars"
                      :key="char.index"
                      :ref="setCharEl(char.index)"
                      class="inline-block will-change-[opacity,transform,color] transition-colors duration-200"
                      :style="getCombinedCharStyle(char.index)"
                    >{{ char.char }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <section
            id="tech-stack"
            ref="techSection"
            class="soft-section-band relative mx-auto mt-24 max-w-7xl overflow-hidden px-0 py-10 sm:mt-32 lg:py-16 scroll-mt-16"
          >
            <div class="pointer-events-none absolute inset-0 opacity-55">
              <div class="absolute left-[8%] top-[12%] size-1 rounded-full bg-neutral-400" />
              <div class="absolute right-[12%] top-[20%] size-1.5 rounded-full bg-neutral-300" />
              <div class="absolute left-[28%] top-[45%] size-1 rounded-full bg-neutral-300" />
              <div class="absolute bottom-[18%] right-[24%] size-1 rounded-full bg-neutral-400" />
              <div class="absolute bottom-[10%] left-[18%] size-1.5 rounded-full bg-neutral-300" />
            </div>

            <div class="relative mb-14 max-w-4xl">
              <h2 :class="sectionTitleClass">
                {{ locale === 'en' ? 'Tech Stack' : '我的技术栈' }}
              </h2>
            </div>

            <div class="relative space-y-12 lg:space-y-14">
              <div
                v-for="group in indexedTechGroups"
                :key="group.title"
                class="grid gap-5 lg:grid-cols-[240px_1fr] lg:gap-8"
              >
                <div>
                  <h3
                    class="text-3xl leading-none font-black tracking-tight text-neutral-300 will-change-[opacity,transform] sm:text-4xl lg:text-5xl"
                    :style="getTechItemStyle(group.index)"
                  >
                    {{ group.title }}
                  </h3>
                </div>

                <div class="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
                  <div
                    v-for="item in group.items"
                    :key="item.label"
                    class="tech-item flex min-w-0 items-center gap-4 text-neutral-700 will-change-[opacity,transform]"
                    :style="getTechItemStyle(item.index)"
                  >
                    <img
                      v-if="item.logo"
                      :src="item.logo"
                      :alt="`${item.label} logo`"
                      class="tech-item-icon size-10 shrink-0 object-contain"
                    >
                    <UIcon
                      v-else
                      :name="item.icon"
                      class="tech-item-icon size-10 shrink-0"
                      :style="{ color: item.color }"
                    />
                    <span class="min-w-0 whitespace-nowrap text-xl font-semibold tracking-tight text-neutral-700 sm:text-2xl">
                      {{ item.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            id="work-experience"
            class="relative mx-auto mt-24 max-w-7xl pb-24 pt-12 sm:mt-32 lg:pt-20"
          >
            <div class="mb-16 pt-10">
              <h2 :class="sectionTitleClass">
                {{ locale === 'en' ? 'Career' : '工作履历' }}
              </h2>
            </div>

            <div
              ref="workTrack"
              class="relative"
              :style="workTrackStyle"
            >
              <div class="sticky top-0 h-screen min-h-[760px] overflow-hidden border-y border-neutral-200 bg-white">
                <article
                  v-for="(experience, index) in workExperiences"
                  :key="`${experience.period}-${experience.company}`"
                  class="absolute inset-x-0 top-0 min-h-[560px] border-t border-neutral-200 bg-white will-change-transform"
                  :style="getWorkCardStyle(index)"
                >
                  <div class="min-h-[156px] py-6">
                    <p class="font-mono text-lg tracking-wide text-neutral-500">
                      {{ String(index + 1).padStart(2, '0') }} / {{ experience.period }}
                    </p>
                    <h3 class="mt-4 inline-block whitespace-nowrap text-5xl leading-none font-black tracking-tight text-neutral-950 sm:text-6xl lg:text-[4.1rem] xl:text-[4.35rem]">
                      {{ experience.role }}
                    </h3>
                  </div>

                  <div class="grid gap-10 pb-14 lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr]">
                    <div class="hidden lg:block" />

                    <div>
                      <p class="text-3xl font-bold tracking-tight text-neutral-950 lg:text-4xl">
                        {{ experience.company }}
                      </p>
                      <p
                        v-if="experience.companyNote"
                        class="mt-2 text-lg leading-7 text-neutral-500"
                      >
                        {{ experience.companyNote }}
                      </p>

                      <ul class="mt-9 space-y-5 text-xl leading-8 font-semibold text-neutral-500 lg:text-2xl lg:leading-9">
                        <li
                          v-for="task in experience.tasks"
                          :key="task"
                          class="flex gap-4"
                        >
                          <span class="mt-3 h-px w-8 shrink-0 bg-neutral-300" />
                          <span>{{ task }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <ProjectSection
            :projects="projects"
            :locale="locale"
            :section-title-class="sectionTitleClass"
            :preview-entry-label="previewEntryLabel"
            :unavailable-preview-label="unavailablePreviewLabel"
          />

          <section
            class="relative mx-auto max-w-7xl pb-32 pt-8 sm:pt-12 lg:pb-40"
          >
            <div id="design-styles" class="scroll-mt-16">
              <h2 :class="sectionTitleClass">
                {{ locale === 'en' ? 'Design Styles' : '设计风格' }}
              </h2>
              <ArtWorldMap class="mt-12 sm:mt-16" />
            </div>

            <div id="art-collections" class="scroll-mt-16 mt-14 sm:mt-16">
              <h2 :class="sectionTitleClass">
                {{ locale === 'en' ? 'Art Collections' : '艺术作品集' }}
              </h2>
            </div>

            <div ref="artGrid" class="art-collection-grid mt-14 sm:mt-16">
              <button
                v-for="(collection, index) in artCollections"
                :key="collection.slug"
                type="button"
                class="art-collection-card group text-left"
                :class="artCardRevealed[index] ? 'art-card-show' : 'art-card-hide'"
                :data-index="index"
                @click="openWorkCollection(collection.slug)"
              >
                <div
                  class="art-collection-image-wrap"
                  @pointermove="handleArtCardMove"
                  @pointerenter="handleArtCardMove"
                  @pointerleave="handleArtCardLeave"
                >
                  <img
                    :src="collection.cover"
                    :alt="locale === 'en' ? `${collection.title} cover` : `${collection.title}封面`"
                    class="art-collection-image art-collection-image--gray"
                    loading="lazy"
                  >
                  <img
                    :src="collection.cover"
                    :alt="locale === 'en' ? `${collection.title} color cover` : `${collection.title}封面彩色`"
                    class="art-collection-image art-collection-image--color"
                    loading="lazy"
                    aria-hidden="true"
                  >
                </div>
                <div class="mt-4">
                  <p class="font-mono text-sm tracking-wide text-neutral-500">
                    {{ String(index + 1).padStart(2, '0') }}.
                  </p>
                  <h3 class="mt-2 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">
                    {{ collection.title }}
                  </h3>
                  <p class="mt-3 text-sm font-semibold text-neutral-500">
                    {{ collection.hint || workCountLabel(collection.images.length) }}
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
      </section>

      <ArtGalleryOverlay
        :collection="activeWorkCollection"
        :active-image="activeGalleryImage"
        :is-english="isEnglish"
        @close-collection="closeWorkCollection"
        @open-image="openGalleryImage"
        @close-image="closeGalleryImage"
      />
      <MobileExperienceNotice :is-english="isEnglish" />
    </div>
  </div>
</template>

<style scoped>
.soft-section-band {
  background: #ffffff;
  box-shadow: 0 0 0 100vmax #ffffff;
  clip-path: inset(0 -100vmax);
}

.tech-item-icon {
  transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

.tech-item:hover .tech-item-icon {
  transform: scale(1.18) rotate(-4deg);
}

.art-collection-grid {
  display: grid;
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(3rem, 6vw, 7rem) clamp(3rem, 9vw, 9rem);
  align-items: start;
}

.art-collection-card {
  display: block;
  appearance: none;
  padding: 0;
  border: 0;
  background: transparent;
}

/* Scroll reveal per card — slide in from left/right based on grid column */
.art-card-hide {
  opacity: 0;
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Odd cards (left column): slide in from left */
.art-collection-card:nth-child(odd).art-card-hide {
  transform: translateX(-80px);
}

/* Even cards (right column): slide in from right */
.art-collection-card:nth-child(even).art-card-hide {
  transform: translateX(80px);
}

.art-card-show {
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.art-collection-card:nth-child(1) {
  grid-column: 1;
}

.art-collection-card:nth-child(2) {
  grid-column: 2;
  margin-top: 8rem;
}

.art-collection-card:nth-child(3) {
  grid-column: 1;
  margin-top: -1rem;
}

.art-collection-card:nth-child(4) {
  grid-column: 2;
  margin-top: 7rem;
}

.art-collection-card:nth-child(5) {
  grid-column: 1;
  margin-top: -1rem;
}

.art-collection-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: #f5f5f4;
  --chroma-x: 50%;
  --chroma-y: 50%;
  --chroma-on: 0;
  --chroma-radius: 340px;
}

.art-collection-image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 850ms cubic-bezier(0.22, 1, 0.36, 1);
}

.art-collection-image--gray {
  filter: grayscale(1) contrast(0.96);
}

.art-collection-image--color {
  opacity: var(--chroma-on, 0);
  -webkit-mask-image: radial-gradient(
    circle var(--chroma-radius) at var(--chroma-x) var(--chroma-y),
    #000 0%,
    #000 45%,
    transparent 78%
  );
  mask-image: radial-gradient(
    circle var(--chroma-radius) at var(--chroma-x) var(--chroma-y),
    #000 0%,
    #000 45%,
    transparent 78%
  );
  transition:
    transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 850ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 220ms ease-out;
}

.art-collection-card:hover .art-collection-image {
  transform: scale(1.045);
}

.art-collection-card:hover .art-collection-image--color {
  filter: saturate(1.12) contrast(1.04);
}

@media (max-width: 768px) {
  .art-collection-grid {
    max-width: 100%;
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .art-collection-card:nth-child(n) {
    grid-column: auto;
    margin-top: 0;
  }

  .art-collection-card:nth-child(n) .art-collection-image-wrap {
    aspect-ratio: 1 / 1;
  }
}
</style>
