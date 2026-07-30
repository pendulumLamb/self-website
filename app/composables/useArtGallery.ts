import type { ComputedRef } from 'vue'
import type { ArtCollection } from '~/data/portfolio'

export function useArtGallery(collections: ComputedRef<ArtCollection[]>) {
  const activeCollectionSlug = ref<string | null>(null)
  const activeImage = ref<string | null>(null)

  const activeCollection = computed(() => {
    return collections.value.find(collection => collection.slug === activeCollectionSlug.value) || null
  })

  function openCollection(slug: string) {
    const collection = collections.value.find(item => item.slug === slug)

    if (collection?.href) {
      window.open(collection.href, '_blank', 'noopener,noreferrer')
      return
    }

    activeCollectionSlug.value = slug
  }

  function closeCollection() {
    activeCollectionSlug.value = null
    activeImage.value = null
  }

  function openImage(image: string) {
    activeImage.value = image
  }

  function closeImage() {
    activeImage.value = null
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    if (activeImage.value) closeImage()
    else if (activeCollectionSlug.value) closeCollection()
  }

  watch(activeCollectionSlug, (slug) => {
    if (import.meta.client) document.body.style.overflow = slug ? 'hidden' : ''
  })

  onMounted(() => window.addEventListener('keydown', onKeydown))

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  })

  return {
    activeCollection,
    activeImage,
    openCollection,
    closeCollection,
    openImage,
    closeImage
  }
}
