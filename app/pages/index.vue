<script setup lang="ts">
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
const { width: windowWidth, height: windowHeight } = useWindowSize()
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

const viewportWidth = computed(() => {
  return Number.isFinite(windowWidth.value) && windowWidth.value > 0 ? windowWidth.value : 1440
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

const scrollProgressStyle = computed(() => {
  const progress = dragScrollProgress.value ?? pageScrollProgress.value

  return {
    height: `${progress * 100}%`
  }
})

const scrollSlider = ref<HTMLElement | null>(null)
const isScrollDragging = ref(false)
const dragScrollProgress = ref<number | null>(null)

let scrollDragFrame = 0
let pendingScrollProgress = 0
let previousScrollBehavior = ''
let previousUserSelect = ''

const scrollProgressPercent = computed(() => Math.round(pageScrollProgress.value * 100))

function getMaxPageScroll() {
  if (!import.meta.client) return 0
  return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
}

function applyScrollProgress(progress: number) {
  if (!import.meta.client) return
  const clamped = Math.min(Math.max(progress, 0), 1)
  const top = clamped * getMaxPageScroll()

  window.scrollTo(0, top)
  document.documentElement.scrollTop = top
  document.body.scrollTop = top
}

function scrollToProgress(progress: number) {
  pendingScrollProgress = Math.min(Math.max(progress, 0), 1)
  dragScrollProgress.value = pendingScrollProgress

  if (scrollDragFrame) return

  scrollDragFrame = window.requestAnimationFrame(() => {
    scrollDragFrame = 0
    applyScrollProgress(pendingScrollProgress)
  })
}

function updateScrollFromPointer(event: PointerEvent) {
  if (!scrollSlider.value) return
  const rect = scrollSlider.value.getBoundingClientRect()
  const progress = (event.clientY - rect.top) / rect.height
  scrollToProgress(progress)
}

function onScrollSliderPointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  event.preventDefault()
  isScrollDragging.value = true
  scrollSlider.value?.setPointerCapture(event.pointerId)
  previousScrollBehavior = document.documentElement.style.scrollBehavior
  previousUserSelect = document.body.style.userSelect
  document.documentElement.style.scrollBehavior = 'auto'
  document.body.style.userSelect = 'none'
  document.documentElement.classList.add('is-scroll-dragging')
  updateScrollFromPointer(event)
}

function onScrollSliderPointerMove(event: PointerEvent) {
  if (!isScrollDragging.value) return
  event.preventDefault()
  updateScrollFromPointer(event)
}

function stopScrollSliderDrag(event?: PointerEvent) {
  if (!isScrollDragging.value) return
  if (event && scrollSlider.value?.hasPointerCapture(event.pointerId)) {
    scrollSlider.value.releasePointerCapture(event.pointerId)
  }
  if (scrollDragFrame) {
    window.cancelAnimationFrame(scrollDragFrame)
    scrollDragFrame = 0
    applyScrollProgress(pendingScrollProgress)
  }
  isScrollDragging.value = false
  dragScrollProgress.value = null
  document.documentElement.style.scrollBehavior = previousScrollBehavior
  document.body.style.userSelect = previousUserSelect
  document.documentElement.classList.remove('is-scroll-dragging')
}

function onScrollSliderKeydown(event: KeyboardEvent) {
  const maxScroll = getMaxPageScroll()
  if (maxScroll <= 0) return

  const current = pageScrollProgress.value
  const smallStep = 48 / maxScroll
  const largeStep = viewportHeight.value / maxScroll

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    scrollToProgress(current + smallStep)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    scrollToProgress(current - smallStep)
  } else if (event.key === 'PageDown') {
    event.preventDefault()
    scrollToProgress(current + largeStep)
  } else if (event.key === 'PageUp') {
    event.preventDefault()
    scrollToProgress(current - largeStep)
  } else if (event.key === 'Home') {
    event.preventDefault()
    scrollToProgress(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    scrollToProgress(1)
  }
}

const sectionTitleClass = computed(() => isEnglish.value
  ? 'text-4xl leading-none font-black tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl'
  : 'text-5xl leading-none font-black tracking-tight text-neutral-950 sm:text-7xl lg:text-8xl')

const aboutTextClass = computed(() => isEnglish.value
  ? 'space-y-6 text-xl leading-9 text-neutral-700 sm:text-2xl sm:leading-10'
  : 'space-y-7 text-2xl leading-11 text-neutral-700')

const previewEntryLabel = computed(() => locale.value === 'en' ? 'Preview' : '预览入口')
const unavailablePreviewLabel = computed(() => locale.value === 'en' ? 'Preview unavailable' : '暂不可预览')
const workCountLabel = (count: number) => locale.value === 'en' ? `${count} works` : `${count} 张作品`

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
          const idx = Number(entry.target.dataset.index)
          if (!isNaN(idx)) {
            artCardRevealed.value[idx] = true
            observer.unobserve(entry.target)
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

function getCombinedCharStyle(index: number): Record<string, string> {
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
const hoveredProjectIndex = ref<number | null>(null)
const projectPreviewPosition = ref({ x: 0, y: 0 })
const activeWorkCollectionSlug = ref<string | null>(null)
const activeGalleryImage = ref<string | null>(null)
const showMobileNotice = ref(false)
const hasDismissedMobileNotice = ref(false)

const aboutIntroParagraphs = computed(() => locale.value === 'en'
  ? [
      'I graduated from Anhui Polytechnic University in Wuhu in 2023, majoring in Internet of Things Engineering and also taking courses in visual communication design. I was a member of the IoT Association in the School of Computer Science.',
      'After graduation I moved into computer-related work, covering automotive testing, IoT development, and full-stack software development, while also providing resource design for e-commerce teams.',
      'I use minimal, restrained, and warm design to make technology easier to perceive.'
    ]
  : [
      '2023年毕业于安徽工程大学（安徽芜湖），学习物联网工程专业，另外辅修视觉传达设计课程。计算机学院物联网协会会员。',
      '毕业后进入计算机相关行业，先后从事过车载测试、物联网开发、软件全栈开发工作，并为电商公司提供资源设计。',
      '用极简、克制、温暖的设计让科技得以被感知。'
    ])

watch(aboutIntroParagraphs, () => initCharData(), { immediate: true })

const techGroups = computed(() => [{
  title: locale.value === 'en' ? 'Languages' : '编程语言',
  items: [{
    label: 'C',
    icon: 'simple-icons:c',
    color: '#A8B9CC'
  }, {
    label: 'Python',
    icon: 'simple-icons:python',
    color: '#3776AB'
  }, {
    label: 'Go',
    icon: 'simple-icons:go',
    color: '#00ADD8'
  }, {
    label: 'Js',
    icon: 'simple-icons:javascript',
    color: '#F7DF1E'
  }, {
    label: 'Ts',
    icon: 'simple-icons:typescript',
    color: '#3178C6'
  }]
}, {
  title: locale.value === 'en' ? 'Frontend' : '前端',
  items: [{
    label: 'Vue',
    icon: 'simple-icons:vuedotjs',
    color: '#4FC08D'
  }, {
    label: 'Nuxt.Js',
    icon: 'simple-icons:nuxt',
    color: '#00DC82'
  }, {
    label: 'React',
    icon: 'simple-icons:react',
    color: '#61DAFB'
  }, {
    label: 'Next.Js',
    icon: 'simple-icons:nextdotjs',
    color: '#000000'
  }]
}, {
  title: locale.value === 'en' ? 'Cross-platform' : '跨端框架',
  items: [{
    label: 'uni-app',
    logo: '/tech-logos/uni-app.png'
  }, {
    label: 'Flutter',
    icon: 'simple-icons:flutter',
    color: '#02569B'
  }]
}, {
  title: locale.value === 'en' ? 'Backend' : '后端',
  items: [{
    label: 'Fastapi',
    icon: 'simple-icons:fastapi',
    color: '#009688'
  }, {
    label: 'Gin',
    logo: '/tech-logos/gin.svg'
  }, {
    label: locale.value === 'en' ? 'Nitro by Nuxt.js' : 'Nitro（Nuxt.Js提供）',
    logo: '/tech-logos/nitro.svg'
  }]
}, {
  title: locale.value === 'en' ? 'Infrastructure' : '基础设施',
  items: [{
    label: 'Git',
    icon: 'simple-icons:git',
    color: '#F05032'
  }, {
    label: 'MySQL',
    icon: 'simple-icons:mysql',
    color: '#4479A1'
  }, {
    label: 'PostgreSQL',
    icon: 'simple-icons:postgresql',
    color: '#4169E1'
  }, {
    label: 'Redis',
    icon: 'simple-icons:redis',
    color: '#FF4438'
  }, {
    label: 'Supabase',
    icon: 'simple-icons:supabase',
    color: '#3FCF8E'
  }, {
    label: 'Vercel',
    icon: 'simple-icons:vercel',
    color: '#111111'
  }, {
    label: 'Docker',
    icon: 'simple-icons:docker',
    color: '#2496ED'
  }]
}, {
  title: locale.value === 'en' ? 'IoT' : '物联网',
  items: [{
    label: 'esp32',
    icon: 'simple-icons:espressif',
    color: '#E7352C'
  }, {
    label: locale.value === 'en' ? 'Raspberry Pi' : '树莓派',
    icon: 'simple-icons:raspberrypi',
    color: '#A22846'
  }, {
    label: 'MQTT',
    icon: 'simple-icons:mqtt',
    color: '#660066'
  }, {
    label: 'WIFI/BT/ZIGBEE',
    icon: 'lucide:radio-tower',
    color: '#111111'
  }, {
    label: 'NB-IoT',
    logo: '/tech-logos/nbiot.png'
  }, {
    label: locale.value === 'en' ? 'Alibaba Cloud IoT' : '阿里云IoT',
    icon: 'simple-icons:alibabacloud',
    color: '#FF6A00'
  }]
}, {
  title: 'AI Agent',
  items: [{
    label: 'coze',
    logo: '/tech-logos/coze.png'
  }, {
    label: 'dify',
    logo: '/tech-logos/dify.svg'
  }, {
    label: 'LangGragh',
    logo: '/tech-logos/langgraph.png'
  }]
}, {
  title: locale.value === 'en' ? 'Design' : '设计',
  items: [{
    label: 'MasterGo',
    logo: '/tech-logos/mastergo.ico'
  }, {
    label: 'Lovart',
    logo: '/tech-logos/lovart.png'
  }, {
    label: 'Tapnow',
    logo: '/tech-logos/tapnow.png'
  }, {
    label: locale.value === 'en' ? 'NeoDesign platform' : 'NeoDesign（自研平台）',
    logo: '/tech-logos/neodesign.png'
  }]
}])

const workExperiences = computed(() => locale.value === 'en' ? [{
  period: '2022.3-Present',
  company: 'Wuhu Xiangyi Software Co., Ltd.',
  role: 'Full-stack Engineer',
  tasks: ['Joined a roommate-led startup and took part in daily product development.', 'Handled UI/UX design and implementation for websites, mini programs, apps, and related software.', 'Occasionally contributed to hardware development.']
}, {
  period: '2023.2-2024.11',
  company: 'BHTC Automotive Electronics (Wuhu) Co., Ltd.',
  companyNote: 'Formerly Bosch Automotive Electronics (Wuhu) Co., Ltd.',
  role: 'Test Engineer',
  tasks: ['Worked with CAN networks and performed bench and vehicle tests for instrument clusters.', 'Designed test cases and test scripts.', 'Stationed at Chery and Changan vehicle ports for pre-export inspection and flashing.']
}, {
  period: '2025.1-2026.6',
  company: 'Shanghai Yongxing Trading Co., Ltd.',
  role: 'Visual Designer, AI Architect',
  tasks: ['Produced e-commerce images, videos, and other assets with AI creation tools.', 'Led internal AI system development, including department workflows, company AI agents, RAG knowledge bases, and supporting tools to improve operations.']
}] : [{
  period: '2022.3-至今',
  company: '芜湖享易软件有限公司',
  role: '全栈工程师',
  tasks: ['室友的创业公司，我被拉进去参与日常开发。', '负责网站、小程序、App 等软件的 UI/UX 设计与实际开发。', '偶尔参与硬件开发。']
}, {
  period: '2023.2-2024.11',
  company: '伯泰克汽车电子（芜湖）有限公司',
  companyNote: '前博世汽车电子（芜湖）有限公司',
  role: '测试工程师',
  tasks: ['了解 CAN 网络，进行汽车仪表的台架测试、实车测试。', '设计测试用例与测试脚本。', '奇瑞/长安汽车港口驻场，负责出口前检测与刷机。']
}, {
  period: '2025.1-2026.6',
  company: '上海邕兴贸易有限公司',
  role: '美工、AI 架构师',
  tasks: ['使用AI创作工具为公司产出图片、视频等电商资源。', '主导公司AI系统开发，各部门AI使用，设计公司专用的AI Agent、Rag知识库、必要软件等，提高运转效率。']
}])

const projects = computed(() => locale.value === 'en' ? [{
  title: 'NeoDesign',
  subtitle: 'AI creation platform',
  logo: '/tech-logos/neodesign.png',
  description: 'An infinite-canvas workspace for producing AI images, videos, and creative assets.',
  note: 'Built for my own e-commerce workflow after finding tools like Lovart and Tapnow too expensive for daily use.',
  tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  image: '/projects/infinite-canvas.jpg',
  previewDisabledTip: 'Not open-sourced or released yet.'
}, {
  title: 'EasyIoT',
  subtitle: 'IoT platform for intelligent teaching applications',
  logo: '/projects/easyiot-logo.png',
  description: 'An IoT application platform for teaching scenarios, supporting no-code and MCU low-code development.',
  note: 'Developed by the IoT Open Innovation Lab of Anhui Polytechnic University, with development boards and learning resources for fast IoT prototyping.',
  tags: ['C++', 'Vue', 'Node.js', 'Express', 'MQTT'],
  image: '/projects/easyiot-preview.png',
  previewUrl: 'https://www.easyiothings.com/'
}, {
  title: 'Warmzen',
  subtitle: 'Cross-border independent store',
  logo: '/projects/warmzen-logo.png',
  description: 'A cross-border commerce site built on the open-source Payload CMS commerce stack, including storefront and admin system.',
  note: 'The storefront focuses on brand presentation, product collections, and an immersive hero experience, while the admin side supports content management, payment flows, and multilingual display.',
  tags: ['Next.js', 'React', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  image: '/projects/warmzen-preview.png',
  previewUrl: 'https://warmzen.vercel.app/'
}, {
  title: 'HelloAgents',
  subtitle: 'Automated deep-research agent',
  description: 'A multi-agent research system based on HelloAgents that breaks down topics, searches sources, and generates structured reports.',
  note: 'Enter a research topic and the agents plan subtasks, query multiple search engines, show progress in real time, and output a structured Markdown report.',
  tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI'],
  image: '/projects/agent.png',
  previewDisabledTip: 'This project is not online yet.'
}] : [{
  title: 'NeoDesign',
  subtitle: 'AI 创作平台',
  logo: '/tech-logos/neodesign.png',
  description: '面向 AI 图片、视频与创意资产生产的无限画布工作台。',
  note: '因不满Lovart、Tapnow的昂贵收费，开发一款更好用、更便宜的自己用，以完成日常电商工作。',
  tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  image: '/projects/infinite-canvas.jpg',
  previewDisabledTip: '暂不开源/发布，不可预览，请理解。'
}, {
  title: '易联智能',
  subtitle: '智能化教学应用物联网平台',
  logo: '/projects/easyiot-logo.png',
  description: '面向教学场景的物联网应用平台，支持零代码与 MCU 低代码开发。',
  note: '由安徽工程大学物联网开放创新实验室开发，配套开发板等设施，帮助用户快速搭建和学习物联网应用。',
  tags: ['C++', 'Vue', 'Node.js', 'Express', 'MQTT'],
  image: '/projects/easyiot-preview.png',
  previewUrl: 'https://www.easyiothings.com/'
}, {
  title: 'Warmzen',
  subtitle: '跨境独立站',
  logo: '/projects/warmzen-logo.png',
  description: '基于 Payload CMS 开源商城系统开发的跨境独立站，包含前台商城与后台管理系统。',
  note: '前台聚焦品牌展示、商品集合和沉浸式首屏体验，后台支持商品内容管理、支付链路和多语言展示等能力。',
  tags: ['Next.js', 'React', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
  image: '/projects/warmzen-preview.png',
  previewUrl: 'https://warmzen.vercel.app/'
}, {
  title: 'HelloAgents',
  subtitle: '自动化深度研究智能体',
  description: '基于 HelloAgents 框架的多 Agent 协作深度研究系统，自动拆解课题、搜索资料并生成结构化报告。',
  note: '输入一个研究课题，智能体自动规划子任务、调用多个搜索引擎收集资料，实时展示进度，最终输出一份结构化的 Markdown 研究报告。',
  tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI'],
  image: '/projects/agent.png',
  previewDisabledTip: '项目暂不上线，请理解'
}])

function workImageList(folder: string, files: string[]) {
  return files.map(file => `/works/collections/${folder}/${file}`)
}

const artCollections = computed(() => locale.value === 'en' ? [{
  slug: 'drawing',
  title: 'Personal Drawings',
  cover: '/works/drawing/autumn.jpg',
  summary: 'Hand-drawn characters, daily sketches, and drawing practice.',
  images: workImageList('drawing', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.png', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg'])
}, {
  slug: 'ai',
  title: 'AI Art',
  cover: '/works/collections/ai/06.png',
  summary: 'Explorations of image style, scenes, and visual concepts made with AI tools.',
  images: workImageList('ai', ['01.png', '02.png', '03.png', '04.png', '05.jpg', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png'])
}, {
  slug: 'photo',
  title: 'Photography',
  cover: '/works/collections/photo/05.jpg',
  summary: 'Observations from nature, campus, and everyday scenes.',
  images: workImageList('photo', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg'])
}, {
  slug: 'commerce',
  title: 'E-commerce Visuals',
  cover: '/works/collections/commerce/11.png',
  summary: 'Visual design for product detail pages and brand sales pages.',
  images: workImageList('commerce', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png', '14.jpg', '15.jpg', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png'])
}, {
  slug: 'ai-video',
  title: 'AI Video',
  cover: '/works/collections/ai-video-cover.png',
  summary: 'Click through to my Bilibili profile.',
  hint: 'Open Bilibili profile',
  href: 'https://space.bilibili.com/3546668196694295/upload/video',
  images: []
}] : [{
  slug: 'drawing',
  title: '个人绘画',
  cover: '/works/drawing/autumn.jpg',
  summary: '手绘人物、日常小画和阶段性绘画练习。',
  images: workImageList('drawing', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.png', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg'])
}, {
  slug: 'ai',
  title: 'AI 艺术',
  cover: '/works/collections/ai/06.png',
  summary: '使用 AI 工具完成的图像风格、场景和视觉概念探索。',
  images: workImageList('ai', ['01.png', '02.png', '03.png', '04.png', '05.jpg', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png'])
}, {
  slug: 'photo',
  title: '摄影作品',
  cover: '/works/collections/photo/05.jpg',
  summary: '自然、校园和生活场景中的观察记录。',
  images: workImageList('photo', ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg'])
}, {
  slug: 'commerce',
  title: '电商图',
  cover: '/works/collections/commerce/11.png',
  summary: '面向电商产品详情页和品牌销售页面的视觉设计。',
  images: workImageList('commerce', ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png', '09.png', '10.png', '11.png', '12.png', '13.png', '14.jpg', '15.jpg', '16.png', '17.png', '18.png', '19.png', '20.png', '21.png', '22.png'])
}, {
  slug: 'ai-video',
  title: 'AI视频',
  cover: '/works/collections/ai-video-cover.png',
  summary: '点击跳转Bilibili主页。',
  hint: '点击跳转Bilibili主页',
  href: 'https://space.bilibili.com/3546668196694295/upload/video',
  images: []
}])

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

const aboutIntroCharsCount = computed(() => {
  return aboutIntroParagraphs.value.reduce((total, paragraph) => total + Array.from(paragraph).length, 0)
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

function handleProjectPointerMove(event: MouseEvent | PointerEvent, index: number) {
  hoveredProjectIndex.value = index
  projectPreviewPosition.value = {
    x: event.clientX,
    y: event.clientY
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

const hoveredProject = computed(() => {
  return hoveredProjectIndex.value === null ? null : projects.value[hoveredProjectIndex.value] || null
})

const activeWorkCollection = computed(() => {
  return artCollections.value.find(collection => collection.slug === activeWorkCollectionSlug.value) || null
})

function openWorkCollection(slug: string) {
  const collection = artCollections.value.find(item => item.slug === slug)

  if (collection?.href) {
    window.open(collection.href, '_blank', 'noopener,noreferrer')
    return
  }

  activeWorkCollectionSlug.value = slug
}

function closeWorkCollection() {
  activeWorkCollectionSlug.value = null
  activeGalleryImage.value = null
}

function handleWorkCollectionKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    if (activeGalleryImage.value) {
      closeGalleryImage()
    } else {
      closeWorkCollection()
    }
  }
}

function openGalleryImage(image: string) {
  activeGalleryImage.value = image
}

function closeGalleryImage() {
  activeGalleryImage.value = null
}

function closeMobileNotice() {
  hasDismissedMobileNotice.value = true
  showMobileNotice.value = false
}

watch(activeWorkCollectionSlug, (slug) => {
  if (!import.meta.client) {
    return
  }

  document.body.style.overflow = slug ? 'hidden' : ''
})

watch(viewportWidth, (width) => {
  if (!import.meta.client || hasDismissedMobileNotice.value) {
    return
  }

  showMobileNotice.value = width < 768
}, { immediate: true })

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

  const cornerGap = 4
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
  showMobileNotice.value = !hasDismissedMobileNotice.value && window.innerWidth < 768
  window.addEventListener('resize', updateScrollSectionMetrics)
  window.addEventListener('scroll', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('wheel', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('touchmove', closeProjectPreviewOnMobileScroll, { passive: true })
  window.addEventListener('keydown', handleWorkCollectionKeydown)
  requestAnimationFrame(updateScrollSectionMetrics)

  // Art collection per-card scroll reveal
  nextTick(() => observeArtCards())
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollSectionMetrics)
  window.removeEventListener('scroll', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('wheel', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('touchmove', closeProjectPreviewOnMobileScroll)
  window.removeEventListener('keydown', handleWorkCollectionKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="page">
    <div
      ref="scrollSlider"
      class="scroll-progress-control cursor-grab-custom fixed right-3 top-1/2 z-[120] h-40 w-8 -translate-y-1/2 touch-none select-none sm:right-5 sm:h-44"
      :class="{ 'is-dragging': isScrollDragging }"
      role="slider"
      tabindex="0"
      aria-orientation="vertical"
      :aria-label="locale === 'en' ? 'Page scroll progress' : '页面滚动进度'"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="scrollProgressPercent"
      @pointerdown="onScrollSliderPointerDown"
      @pointermove="onScrollSliderPointerMove"
      @pointerup="stopScrollSliderDrag"
      @pointercancel="stopScrollSliderDrag"
      @lostpointercapture="stopScrollSliderDrag"
      @keydown="onScrollSliderKeydown"
    >
      <div class="scroll-progress-rail">
        <div
          class="scroll-progress-fill"
          :style="scrollProgressStyle"
        />
      </div>
    </div>

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
              <div class="sticky top-[72px] h-[calc(100vh-72px)] min-h-[760px] overflow-hidden border-y border-neutral-200 bg-white">
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

          <section
            id="projects"
            class="soft-section-band relative mx-auto mt-0 max-w-7xl pb-28 pt-10 sm:pt-14"
          >
            <div class="mb-10 pt-10">
              <h2 :class="sectionTitleClass">
                {{ locale === 'en' ? 'Projects' : '个人项目' }}
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
                      <a
                        v-if="project.previewUrl"
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
          </section>

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

      <div
        class="pointer-events-none fixed left-0 top-0 z-[130] w-[34rem] max-w-[calc(100vw-2rem)] origin-top-left overflow-hidden rounded-sm border border-white/30 bg-neutral-950/20 shadow-2xl shadow-black/20 transition-opacity duration-150 ease-out"
        :style="projectPreviewStyle"
      >
        <img
          v-if="hoveredProject"
          :src="hoveredProject.image"
          :alt="locale === 'en' ? `${hoveredProject.title} project screenshot` : `${hoveredProject.title} 项目截图`"
          class="block w-full object-cover opacity-85"
        >
      </div>

      <Teleport to="body">
        <div
          v-if="activeWorkCollection"
          class="art-gallery-overlay fixed inset-0 z-[200] bg-white/96 backdrop-blur-xl"
        >
          <button
            type="button"
            class="art-gallery-close fixed right-6 top-6 z-30 flex size-13 items-center justify-center rounded-full border border-neutral-300/70 bg-transparent text-xl shadow-xl shadow-black/10 backdrop-blur-xl transition sm:right-8 sm:top-8"
            :aria-label="locale === 'en' ? 'Close collection' : '关闭作品集'"
            @click="closeWorkCollection"
          >
            <UIcon
              name="i-lucide-x"
              class="art-gallery-close-icon size-6"
            />
          </button>

          <div
            class="h-full overflow-y-auto px-6 py-20 sm:px-10"
            @click.self="closeWorkCollection"
          >
            <div class="mx-auto max-w-7xl">
              <div class="art-gallery-grid">
                <button
                  v-for="(image, index) in activeWorkCollection.images"
                  :key="image"
                  type="button"
                  class="art-gallery-item"
                  @click="openGalleryImage(image)"
                >
                  <img
                    :src="image"
                    :alt="locale === 'en' ? `${activeWorkCollection.title} work ${index + 1}` : `${activeWorkCollection.title}作品 ${index + 1}`"
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
          v-if="activeGalleryImage"
          class="art-image-lightbox fixed inset-0 z-[230] flex items-center justify-center bg-black/78 p-5 backdrop-blur-xl"
          @click.self="closeGalleryImage"
        >
          <button
            type="button"
            class="art-gallery-close fixed right-6 top-6 z-20 flex size-13 items-center justify-center rounded-full border border-neutral-300/70 bg-transparent text-xl shadow-xl shadow-black/20 backdrop-blur-xl transition sm:right-8 sm:top-8"
            :aria-label="locale === 'en' ? 'Close image preview' : '关闭图片预览'"
            @click="closeGalleryImage"
          >
            <UIcon
              name="i-lucide-x"
              class="art-gallery-close-icon size-6"
            />
          </button>
          <img
            :src="activeGalleryImage"
            :alt="locale === 'en' ? 'Large work preview' : '作品大图预览'"
            class="max-h-[90vh] max-w-[92vw] object-contain shadow-2xl shadow-black/30"
          >
        </div>
      </Teleport>

      <Teleport to="body">
        <div
          v-if="showMobileNotice"
          class="mobile-notice fixed inset-0 z-[260] flex items-center justify-center bg-black/78 px-6 text-white backdrop-blur-sm sm:hidden"
          @click.self="closeMobileNotice"
        >
          <div class="mobile-notice-panel w-full max-w-xs rounded-2xl bg-black/90 p-6 text-center shadow-2xl shadow-black/40">
            <p class="text-lg leading-8 font-semibold">
              {{ locale === 'en' ? 'Desktop viewing is recommended for the best experience.' : '推荐电脑端浏览，以体验最佳网页展示效果。' }}
            </p>
            <button
              type="button"
              class="mt-5 rounded-full border border-white/25 px-5 py-2 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
              @click="closeMobileNotice"
            >
              {{ locale === 'en' ? 'Got it' : '我知道了' }}
            </button>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<style scoped>
.scroll-progress-control {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.scroll-progress-rail {
  position: relative;
  width: 4px;
  height: 100%;
  overflow: hidden;
  border-radius: 999px;
  background: rgb(163 163 163 / 0.24);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.35);
  backdrop-filter: blur(8px);
  transition:
    width 220ms cubic-bezier(0.22, 1, 0.36, 1),
    height 220ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 180ms ease,
    box-shadow 180ms ease;
}

.scroll-progress-control:hover .scroll-progress-rail,
.scroll-progress-control:focus-visible .scroll-progress-rail,
.scroll-progress-control.is-dragging .scroll-progress-rail {
  width: 14px;
  height: calc(100% + 2.5rem);
  background: rgb(163 163 163 / 0.34);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.58),
    0 14px 34px rgb(15 23 42 / 0.16);
}

.scroll-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 999px;
  background: #10b981;
  box-shadow: 0 0 16px rgb(16 185 129 / 0.65);
  transition: height 120ms ease-out;
}

.scroll-progress-control.is-dragging .scroll-progress-fill {
  transition: none;
}

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
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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

.mobile-notice {
  animation: mobile-notice-fade 180ms ease both;
}

.mobile-notice-panel {
  animation: mobile-notice-pop 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes mobile-notice-fade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes mobile-notice-pop {
  from {
    opacity: 0;
    transform: translate3d(0, 12px, 0) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
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

  .art-gallery-grid {
    columns: 1;
  }
}
</style>
