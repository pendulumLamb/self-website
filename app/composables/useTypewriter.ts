import type { MaybeRefOrGetter } from 'vue'

export function useTypewriter(phrasesInput: MaybeRefOrGetter<string[]>, options?: {
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
  const phrases = computed(() => toValue(phrasesInput))

  let timer: ReturnType<typeof setTimeout> | null = null
  let cursorTimer: ReturnType<typeof setInterval> | null = null
  let runToken = 0

  function clearTypingTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function clearTimers() {
    clearTypingTimer()
    if (cursorTimer) {
      clearInterval(cursorTimer)
      cursorTimer = null
    }
  }

  function wait(ms: number, token: number): Promise<void> {
    return new Promise((resolve) => {
      timer = setTimeout(() => {
        if (token === runToken) resolve()
      }, ms)
    })
  }

  async function typePhrase(phrase: string, token: number): Promise<void> {
    return new Promise((resolve) => {
      let i = 0
      const type = () => {
        if (token !== runToken) return
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

  async function deletePhrase(token: number): Promise<void> {
    return new Promise((resolve) => {
      const current = displayText.value
      let i = current.length
      const del = () => {
        if (token !== runToken) return
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

  async function run(token: number) {
    const list = phrases.value
    if (list.length === 0) return

    if (list.length === 1) {
      // Single phrase: type once and stop, keep cursor blinking
      await typePhrase(list[0] ?? '', token)
      return
    }

    while (token === runToken) {
      const currentList = phrases.value
      const phrase = currentList[currentIndex.value]
      if (phrase) {
        await typePhrase(phrase, token)
        await wait(pauseDuration, token)
        await deletePhrase(token)
        await wait(400, token)
      }
      currentIndex.value = (currentIndex.value + 1) % currentList.length
    }
  }

  function restart() {
    runToken++
    clearTypingTimer()
    displayText.value = ''
    currentIndex.value = 0
    const token = runToken
    timer = setTimeout(() => {
      run(token)
    }, startDelay)
  }

  onMounted(() => {
    cursorTimer = setInterval(() => {
      cursorVisible.value = !cursorVisible.value
    }, 530)

    restart()
  })

  watch(phrases, () => restart())

  onBeforeUnmount(() => {
    runToken++
    clearTimers()
  })

  return {
    displayText,
    cursorVisible
  }
}
