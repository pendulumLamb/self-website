<script setup lang="ts">
import type { Project } from '~/data/portfolio'

const props = defineProps<{
  projects: Project[]
  locale: string
  sectionTitleClass: string
  previewEntryLabel: string
  unavailablePreviewLabel: string
}>()

const { width: windowWidth, height: windowHeight } = useWindowSize()

const viewportHeight = computed(() => {
  return Number.isFinite(windowHeight.value) && windowHeight.value > 0 ? windowHeight.value : 900
})

const viewportWidth = computed(() => {
  return Number.isFinite(windowWidth.value) && windowWidth.value > 0 ? windowWidth.value : 1440
})

const hoveredProjectIndex = ref<number | null>(null)
const projectPreviewPosition = ref({ x: 0, y: 0 })
const activeQrProject = ref<Project | null>(null)

const hoveredProject = computed(() => {
  return hoveredProjectIndex.value === null ? null : props.projects[hoveredProjectIndex.value] || null
})

const projectPreviewStyle = computed(() => {
  const isMobilePreview = viewportWidth.value < 768
  const margin = 16

  if (isMobilePreview) {
    const previewWidth = Math.max(Math.min(viewportWidth.value - margin * 2, 544), 180)
    const previewHeight = previewWidth * 0.5625
    const centeredX = (viewportWidth.value - previewWidth) / 2
    const maxY = Math.max(viewportHeight.value - previewHeight - margin, margin)
    const aboveClickY = Math.min(Math.max(projectPreviewPosition.value.y - previewHeight - 6, margin), maxY)

    return {
      opacity: hoveredProjectIndex.value === null ? 0 : 1,
      width: `${previewWidth}px`,
      transform: `translate3d(${centeredX}px, ${aboveClickY}px, 0) scale(${hoveredProjectIndex.value === null ? 0.96 : 1})`
    }
  }

  const cornerGap = 2
  const previewWidth = Math.max(Math.min(544, viewportWidth.value - margin * 2), 260)
  const previewHeight = previewWidth * 0.5625
  const maxY = Math.max(viewportHeight.value - previewHeight - margin, margin)
  const rightX = projectPreviewPosition.value.x + cornerGap
  const leftX = projectPreviewPosition.value.x - previewWidth - cornerGap
  const x = rightX + previewWidth + margin > viewportWidth.value
    ? Math.max(leftX, margin)
    : Math.max(rightX, margin)
  const y = Math.min(Math.max(projectPreviewPosition.value.y - previewHeight - cornerGap, margin), maxY)

  return {
    opacity: hoveredProjectIndex.value === null ? 0 : 1,
    width: `${previewWidth}px`,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${hoveredProjectIndex.value === null ? 0.96 : 1})`
  }
})

function handleProjectPointerMove(event: MouseEvent | PointerEvent, index: number) {
  hoveredProjectIndex.value = index
  projectPreviewPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
}

function handleProjectPointerLeave(event?: MouseEvent | PointerEvent) {
  if (event && 'pointerType' in event && event.pointerType !== 'mouse') {
    return
  }

  hoveredProjectIndex.value = null
}

function closeProjectPreviewOnMobileScroll() {
  if (window.innerWidth < 768) {
    hoveredProjectIndex.value = null
  }
}

function openProjectQr(project: Project) {
  if (project.previewQr) {
    activeQrProject.value = project
  }
}

function closeProjectQr() {
  activeQrProject.value = null
}

function handleProjectKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeQrProject.value) {
    closeProjectQr()
  }
}

watch(activeQrProject, (project) => {
  if (import.meta.client) {
    document.body.style.overflow = project ? 'hidden' : ''
  }
})

onMounted(() => {
  window.addEventListener('scroll', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('wheel', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('touchmove', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('keydown', handleProjectKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('wheel', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('touchmove', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('keydown', handleProjectKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <section
    id="projects"
    class="soft-section-band relative mx-auto mt-0 max-w-7xl pb-28 pt-10 sm:pt-14"
  >
    <div class="mb-10 pt-10">
      <h2 :class="sectionTitleClass">
        {{ locale === 'en' ? 'Projects' : '项目经验' }}
      </h2>
    </div>

    <div class="relative">
      <article
        v-for="(project, index) in projects"
        :key="project.title"
        class="project-item group relative grid py-10 sm:grid-cols-[72px_1fr] sm:gap-8 lg:py-12"
        :class="{ 'is-project-active': hoveredProjectIndex === index }"
        @mousemove="handleProjectPointerMove($event, index)"
        @mouseenter="handleProjectPointerMove($event, index)"
        @mouseleave="handleProjectPointerLeave"
        @pointermove="handleProjectPointerMove($event, index)"
        @pointerenter="handleProjectPointerMove($event, index)"
        @pointerdown="handleProjectPointerMove($event, index)"
        @pointerleave="handleProjectPointerLeave"
        @click="handleProjectPointerMove($event, index)"
      >
        <p class="font-mono text-lg tracking-wide text-neutral-500">
          {{ String(index + 1).padStart(2, '0') }}.
        </p>

        <div>
          <h3
            class="project-title-fill inline-block pb-3 text-5xl leading-[1.12] font-black tracking-tight sm:text-7xl lg:text-8xl"
            :style="{ '--project-hover-color': '#10b981' }"
          >
            {{ project.title }}
          </h3>
          <p class="mt-4 flex items-center gap-3 text-lg font-semibold tracking-tight text-neutral-700 sm:text-xl">
            <img
              v-if="project.logo"
              :src="project.logo"
              :alt="`${project.title} logo`"
              class="size-8 shrink-0 object-contain"
            >
            {{ project.subtitle }}
          </p>
          <div class="project-detail-panel">
            <p class="project-copy mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              {{ project.description }}
            </p>
            <p class="project-copy mt-2 max-w-3xl text-base leading-7 text-neutral-500 sm:text-lg">
              {{ project.note }}
            </p>

            <div class="project-tags mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-neutral-500 sm:text-base">
              <template
                v-for="(tag, tagIndex) in project.tags"
                :key="tag"
              >
                <span>{{ tag }}</span>
                <span
                  v-if="tagIndex < project.tags.length - 1"
                  class="size-1.5 rounded-full bg-neutral-300"
                />
              </template>
            </div>

            <div class="preview-entry-shell mt-7 flex justify-end">
              <button
                v-if="project.previewQr"
                type="button"
                class="preview-entry relative inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 select-none sm:text-base"
                @click.stop="openProjectQr(project)"
              >
                <svg
                  class="preview-entry-stroke"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="1"
                    width="98"
                    height="38"
                    rx="19"
                    ry="19"
                  />
                </svg>
                <span class="preview-entry-label relative z-10">{{ previewEntryLabel }}</span>
              </button>

              <a
                v-else-if="project.previewUrl"
                :href="project.previewUrl"
                target="_blank"
                rel="noreferrer"
                class="preview-entry relative inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-neutral-500 select-none sm:text-base"
                @click.stop
              >
                <svg
                  class="preview-entry-stroke"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="1"
                    width="98"
                    height="38"
                    rx="19"
                    ry="19"
                  />
                </svg>
                <span class="preview-entry-label relative z-10">{{ previewEntryLabel }}</span>
              </a>

              <span
                v-else
                class="preview-entry relative inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-neutral-400 select-none sm:text-base"
              >
                <svg
                  class="preview-entry-stroke"
                  viewBox="0 0 100 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    x="1"
                    y="1"
                    width="98"
                    height="38"
                    rx="19"
                    ry="19"
                  />
                </svg>
                <span class="preview-entry-label relative z-10">{{ previewEntryLabel }}</span>
                <span class="preview-tooltip pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-max max-w-[18rem] -translate-x-1/2 rounded-full bg-neutral-950 px-4 py-2 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-xl transition duration-200">
                  {{ project.previewDisabledTip || unavailablePreviewLabel }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div
      class="pointer-events-none fixed left-0 top-0 z-[130] w-[34rem] max-w-[calc(100vw-2rem)] origin-top-left overflow-hidden rounded-sm border border-white/30 bg-neutral-950/20 shadow-2xl shadow-black/20 transition-opacity duration-150 ease-out"
      :style="projectPreviewStyle"
    >
      <div
        v-if="hoveredProject?.previewImages?.length"
        class="grid aspect-video gap-2 bg-neutral-100 p-2"
        :class="hoveredProject.previewImages.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'"
      >
        <img
          v-for="image in hoveredProject.previewImages"
          :key="image"
          :src="image"
          :alt="locale === 'en' ? `${hoveredProject.title} project screenshot` : `${hoveredProject.title} 项目截图`"
          class="h-full min-h-0 w-full object-contain opacity-90"
        >
      </div>
      <img
        v-else-if="hoveredProject"
        :src="hoveredProject.image"
        :alt="locale === 'en' ? `${hoveredProject.title} project screenshot` : `${hoveredProject.title} 项目截图`"
        class="block w-full object-cover opacity-85"
      >
    </div>

    <Teleport to="body">
      <div
        v-if="activeQrProject?.previewQr"
        class="fixed inset-0 z-[240] flex items-center justify-center bg-black/72 p-6 backdrop-blur-xl"
        @click.self="closeProjectQr"
      >
        <button
          type="button"
          class="fixed right-6 top-6 z-10 flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white shadow-xl backdrop-blur-xl transition hover:border-white/50 sm:right-8 sm:top-8"
          :aria-label="locale === 'en' ? 'Close mini program code' : '关闭小程序码'"
          @click="closeProjectQr"
        >
          <UIcon
            name="i-lucide-x"
            class="size-6"
          />
        </button>

        <div class="flex flex-col items-center gap-6 text-center">
          <div class="flex size-[min(82vw,30rem)] items-center justify-center rounded-full bg-white p-[11%] shadow-2xl shadow-black/25">
            <img
              :src="activeQrProject.previewQr"
              :alt="locale === 'en' ? `${activeQrProject.title} mini program code` : `${activeQrProject.title}小程序码`"
              class="h-full w-full object-contain"
            >
          </div>
          <p class="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {{ activeQrProject.title }}
          </p>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.soft-section-band {
  background: #ffffff;
  box-shadow: 0 0 0 100vmax #ffffff;
  clip-path: inset(0 -100vmax);
}

.project-title-fill {
  --project-base-color: #0a0a0a;
  background-image: linear-gradient(
    90deg,
    var(--project-hover-color) 0%,
    var(--project-hover-color) 50%,
    var(--project-base-color) 50%,
    var(--project-base-color) 100%
  );
  background-position: 100% 0;
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: var(--project-base-color);
  -webkit-text-fill-color: transparent;
  transition: background-position 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-item {
  border-top: 1px solid rgb(229 229 229);
}

.project-item::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  pointer-events: none;
}

.project-item::after {
  background: #10b981;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-item:last-child {
  border-bottom: 1px solid rgb(229 229 229);
}

.project-item:hover::after,
.project-item.is-project-active::after {
  transform: scaleX(1);
}

.project-detail-panel {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transform: translate3d(0, -0.5rem, 0);
  transition:
    max-height 680ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 360ms ease,
    transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-item:hover .project-title-fill,
.project-item.is-project-active .project-title-fill {
  background-position: 0 0;
}

.project-item:hover .project-detail-panel,
.project-item.is-project-active .project-detail-panel {
  max-height: 24rem;
  opacity: 1;
  overflow: visible;
  transform: translate3d(0, 0, 0);
}

.project-copy,
.project-tags,
.preview-entry-shell {
  opacity: 0;
  transform: translate3d(0, 0.85rem, 0);
  transition:
    opacity 420ms ease,
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-item:hover .project-copy,
.project-item:hover .project-tags,
.project-item:hover .preview-entry-shell,
.project-item.is-project-active .project-copy,
.project-item.is-project-active .project-tags,
.project-item.is-project-active .preview-entry-shell {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.project-item:hover .project-copy:nth-of-type(1),
.project-item.is-project-active .project-copy:nth-of-type(1) {
  transition-delay: 90ms;
}

.project-item:hover .project-copy:nth-of-type(2),
.project-item.is-project-active .project-copy:nth-of-type(2) {
  transition-delay: 170ms;
}

.project-item:hover .project-tags,
.project-item.is-project-active .project-tags {
  transition-delay: 250ms;
}

.project-item:hover .preview-entry-shell,
.project-item.is-project-active .preview-entry-shell {
  transition-delay: 330ms;
}

.preview-entry {
  background: #ffffff;
  border: 1px solid rgb(212 212 212);
  transition:
    border-color 240ms ease,
    color 240ms ease;
}

.preview-entry:hover {
  border-color: transparent;
}

.preview-entry-label {
  --preview-label-base: #737373;
  background-image: linear-gradient(
    90deg,
    #10b981 0%,
    #10b981 50%,
    var(--preview-label-base) 50%,
    var(--preview-label-base) 100%
  );
  background-position: 100% 0;
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: var(--preview-label-base);
  -webkit-text-fill-color: transparent;
  transition: background-position 360ms cubic-bezier(0.22, 1, 0.36, 1);
}

.preview-entry:hover .preview-entry-label {
  background-position: 0 0;
}

.preview-entry-stroke {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease;
}

.preview-entry-stroke rect {
  fill: none;
  stroke: #10b981;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 46 236;
  stroke-dashoffset: 0;
  transition:
    stroke-dasharray 560ms cubic-bezier(0.22, 1, 0.36, 1),
    stroke-dashoffset 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-item:hover .preview-entry-stroke,
.project-item.is-project-active .preview-entry-stroke {
  opacity: 1;
}

.preview-entry:hover .preview-entry-stroke {
  opacity: 1;
}

.project-item:hover .preview-entry-stroke rect,
.project-item.is-project-active .preview-entry-stroke rect {
  animation: preview-stroke 1.45s linear infinite;
}

.project-item:hover .preview-entry:hover .preview-entry-stroke rect,
.project-item.is-project-active .preview-entry:hover .preview-entry-stroke rect {
  animation: none;
  stroke-dasharray: 282 0;
  stroke-dashoffset: 0;
}

.preview-entry:hover .preview-tooltip {
  opacity: 1;
  transform: translate(-50%, 0.25rem);
}

@keyframes preview-stroke {
  to {
    stroke-dashoffset: -282;
  }
}
</style>
