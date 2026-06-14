export function useTypewriter(phrases: string[], options?: {
  typeSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  startDelay?: number
}) {
  const {
    typeSpeed = 120,
    deleteSpeed = 60,
    pauseDuration = 2500,
    startDelay = 800
  } = options || {}

  const displayText = ref('')
  const cursorVisible = ref(true)
  const currentIndex = ref(0)

  let timer: ReturnType<typeof setTimeout> | null = null
  let cursorTimer: ReturnType<typeof setInterval> | null = null

  function clearTimers() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (cursorTimer) {
      clearInterval(cursorTimer)
      cursorTimer = null
    }
  }

  async function typePhrase(phrase: string): Promise<void> {
    return new Promise((resolve) => {
      let i = 0
      const type = () => {
        if (i <= phrase.length) {
          displayText.value = phrase.slice(0, i)
          i++
          timer = setTimeout(type, typeSpeed)
        } else {
          resolve()
        }
      }
      type()
    })
  }

  async function deletePhrase(): Promise<void> {
    return new Promise((resolve) => {
      const current = displayText.value
      let i = current.length
      const del = () => {
        if (i >= 0) {
          displayText.value = current.slice(0, i)
          i--
          timer = setTimeout(del, deleteSpeed)
        } else {
          resolve()
        }
      }
      del()
    })
  }

  async function run() {
    if (phrases.length === 0) return

    if (phrases.length === 1) {
      // Single phrase: type once and stop, keep cursor blinking
      await typePhrase(phrases[0] ?? '')
      return
    }

    while (true) {
      const phrase = phrases[currentIndex.value]
      if (phrase) {
        await typePhrase(phrase)
        await new Promise((resolve) => {
          timer = setTimeout(resolve, pauseDuration)
        })
        await deletePhrase()
        await new Promise((resolve) => {
          timer = setTimeout(resolve, 400)
        })
      }
      currentIndex.value = (currentIndex.value + 1) % phrases.length
    }
  }

  onMounted(() => {
    cursorTimer = setInterval(() => {
      cursorVisible.value = !cursorVisible.value
    }, 530)

    timer = setTimeout(() => {
      run()
    }, startDelay)
  })

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    displayText,
    cursorVisible
  }
}
