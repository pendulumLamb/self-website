<script setup lang="ts">
import type { ArtCollection } from '~/data/portfolio'

defineProps<{
  collection: ArtCollection | null
  activeImage: string | null
  isEnglish: boolean
}>()

defineEmits<{
  closeCollection: []
  openImage: [image: string]
  closeImage: []
}>()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="collection"
      class="art-gallery-overlay fixed inset-0 z-[200] bg-white/96 backdrop-blur-xl"
    >
      <button
        type="button"
        class="art-gallery-close fixed right-6 top-6 z-30 flex size-13 items-center justify-center rounded-full border border-neutral-300/70 bg-transparent text-xl shadow-xl shadow-black/10 backdrop-blur-xl transition sm:right-8 sm:top-8"
        :aria-label="isEnglish ? 'Close collection' : '关闭作品集'"
        @click="$emit('closeCollection')"
      >
        <UIcon
          name="i-lucide-x"
          class="art-gallery-close-icon size-6"
        />
      </button>

      <div
        class="h-full overflow-y-auto px-6 py-20 sm:px-10"
        @click.self="$emit('closeCollection')"
      >
        <div class="mx-auto max-w-7xl">
          <div class="art-gallery-grid">
            <button
              v-for="(image, index) in collection.images"
              :key="image"
              type="button"
              class="art-gallery-item"
              @click="$emit('openImage', image)"
            >
              <img
                :src="image"
                :alt="isEnglish ? `${collection.title} work ${index + 1}` : `${collection.title}作品 ${index + 1}`"
                loading="lazy"
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="activeImage"
      class="art-image-lightbox fixed inset-0 z-[230] flex items-center justify-center bg-black/78 p-5 backdrop-blur-xl"
      @click.self="$emit('closeImage')"
    >
      <button
        type="button"
        class="art-gallery-close fixed right-6 top-6 z-20 flex size-13 items-center justify-center rounded-full border border-neutral-300/70 bg-transparent text-xl shadow-xl shadow-black/20 backdrop-blur-xl transition sm:right-8 sm:top-8"
        :aria-label="isEnglish ? 'Close image preview' : '关闭图片预览'"
        @click="$emit('closeImage')"
      >
        <UIcon
          name="i-lucide-x"
          class="art-gallery-close-icon size-6"
        />
      </button>
      <img
        :src="activeImage"
        :alt="isEnglish ? 'Large work preview' : '作品大图预览'"
        class="max-h-[90vh] max-w-[92vw] object-contain shadow-2xl shadow-black/30"
      >
    </div>
  </Teleport>
</template>

<style scoped>
.art-gallery-overlay {
  animation: art-gallery-fade 240ms ease both;
}

.art-gallery-close {
  color: rgb(38 38 38);
}

.art-gallery-close:hover {
  background: transparent;
}

.art-gallery-close-icon {
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

.art-gallery-close:hover .art-gallery-close-icon {
  transform: rotate(90deg);
}

.art-gallery-grid {
  columns: 3 18rem;
  column-gap: 1.25rem;
}

.art-gallery-item {
  display: block;
  width: 100%;
  break-inside: avoid;
  margin-bottom: 1.25rem;
  padding: 0;
  border: 0;
  background: #f5f5f4;
  overflow: hidden;
}

.art-gallery-item img {
  display: block;
  width: 100%;
  height: auto;
  transition:
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

.art-gallery-item:hover img {
  transform: scale(1.035);
  filter: saturate(1.05) contrast(1.03);
}

.art-image-lightbox {
  animation: art-gallery-fade 180ms ease both;
}

.art-image-lightbox img {
  animation: art-image-zoom 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes art-gallery-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes art-image-zoom {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .art-gallery-grid {
    columns: 1;
  }
}
</style>
