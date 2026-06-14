export const useScrollY = () => {
  const scrollY = ref(0)
  const easedScrollY = ref(0)
  let frame = 0

  const sync = () => {
    const next = window.scrollY

    if (scrollY.value !== next) {
      scrollY.value = next
    }

    const distance = next - easedScrollY.value

    if (Math.abs(distance) < 0.5) {
      easedScrollY.value = next
    } else {
      easedScrollY.value += distance * 0.14
    }

    frame = window.requestAnimationFrame(sync)
  }

  onMounted(() => {
    scrollY.value = window.scrollY
    easedScrollY.value = window.scrollY
    frame = window.requestAnimationFrame(sync)
  })

  onBeforeUnmount(() => {
    window.cancelAnimationFrame(frame)
  })

  return {
    scrollY,
    easedScrollY
  }
}
