export interface TechItem {
  label: string
  icon?: string
  logo?: string
  color?: string
}

export interface TechGroup {
  title: string
  items: TechItem[]
}

export interface WorkExperience {
  period: string
  company: string
  companyNote?: string
  role: string
  tasks: string[]
}

export interface Project {
  title: string
  subtitle: string
  logo?: string
  description: string
  note: string
  tags: string[]
  image: string
  previewImages?: string[]
  previewQr?: string
  previewUrl?: string
  previewDisabledTip?: string
}

export interface ArtCollection {
  slug: string
  title: string
  cover: string
  summary: string
  hint?: string
  href?: string
  images: string[]
}

function workImageList(folder: string, files: string[]) {
  return files.map(file => `/works/collections/${folder}/${file}`)
}

export function getWorkCountLabel(isEnglish: boolean, count: number) {
  return isEnglish ? `${count} works` : `${count} 张作品`
}

export function getAboutIntroParagraphs(isEnglish: boolean) {
  return isEnglish
    ? [
        'I graduated from Anhui Polytechnic University in 2023, majoring in Internet of Things Engineering while also taking courses in visual communication design. I was a member of the IoT Association in the School of Computer Science.',
        'A startup attempt during college did not work out. After graduation I entered the tech industry and worked across automotive testing, IoT development, and full-stack software development, building both software and hardware capabilities while also providing creative resources for e-commerce teams.',
        'I stay committed to product design, using minimal, restrained, and warm design to make technology easier to perceive.'
      ]
    : [
        '2023年毕业于安徽工程大学，学习物联网工程专业，另外辅修视觉传达设计课程。计算机学院物联网协会会员。',
        '大学期间创业未果，毕业后进入计算机相关行业，先后从事过车载测试、物联网开发、软件全栈开发工作，软硬兼修。并为电商公司提供资源设计。',
        '执着于产品设计，用极简、克制、温暖的设计让科技得以被感知。'
      ]
}

export function getTechGroups(isEnglish: boolean): TechGroup[] {
  return [{
    title: isEnglish ? 'Languages' : '编程语言',
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
    title: isEnglish ? 'Frontend' : '前端',
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
    title: isEnglish ? 'Cross-platform' : '跨端框架',
    items: [{
      label: 'uni-app',
      logo: '/tech-logos/uni-app.png'
    }, {
      label: 'Flutter',
      icon: 'simple-icons:flutter',
      color: '#02569B'
    }]
  }, {
    title: isEnglish ? 'Backend' : '后端',
    items: [{
      label: 'Fastapi',
      icon: 'simple-icons:fastapi',
      color: '#009688'
    }, {
      label: 'Gin',
      logo: '/tech-logos/gin.svg'
    }, {
      label: 'Node.Js',
      icon: 'simple-icons:nodedotjs',
      color: '#5FA04E'
    }, {
      label: isEnglish ? 'Nitro by Nuxt.js' : 'Nitro（Nuxt.Js提供）',
      logo: '/tech-logos/nitro.svg'
    }]
  }, {
    title: isEnglish ? 'Infrastructure' : '基础设施',
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
      label: 'Cloudflare',
      icon: 'simple-icons:cloudflare',
      color: '#F38020'
    }, {
      label: isEnglish ? 'WeChat Mini Program' : '微信小程序',
      icon: 'simple-icons:wechat',
      color: '#07C160'
    }, {
      label: 'Linux',
      icon: 'simple-icons:linux',
      color: '#FCC624'
    }, {
      label: 'Docker',
      icon: 'simple-icons:docker',
      color: '#2496ED'
    }, {
      label: 'Nginx',
      icon: 'simple-icons:nginx',
      color: '#009639'
    }]
  }, {
    title: isEnglish ? 'IoT' : '物联网',
    items: [{
      label: 'Arduino',
      icon: 'simple-icons:arduino',
      color: '#00979D'
    }, {
      label: 'esp32',
      icon: 'simple-icons:espressif',
      color: '#E7352C'
    }, {
      label: isEnglish ? 'Raspberry Pi' : '树莓派',
      icon: 'simple-icons:raspberrypi',
      color: '#A22846'
    }, {
      label: 'STM32',
      icon: 'simple-icons:stmicroelectronics',
      color: '#03234B'
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
      label: isEnglish ? 'Alibaba Cloud IoT' : '阿里云IoT',
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
    }, {
      label: 'Codex',
      logo: '/tech-logos/codex-color.png'
    }, {
      label: 'Claude Code',
      logo: '/tech-logos/claudecode-color.png'
    }, {
      label: 'Open Code',
      logo: '/tech-logos/opencode.png'
    }, {
      label: 'OpenClaw',
      logo: '/tech-logos/openclaw-color.png'
    }]
  }, {
    title: isEnglish ? 'Design' : '设计',
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
      label: isEnglish ? 'NeoDesign platform' : 'NeoDesign（自研平台）',
      logo: '/tech-logos/neodesign.png'
    }]
  }]
}

export function getWorkExperiences(isEnglish: boolean): WorkExperience[] {
  return isEnglish
    ? [{
        period: '2025.1-2026.6',
        company: 'Wuhu Xiangyi Software Co., Ltd.',
        role: 'Full-stack Engineer',
        tasks: ['Joined a roommate-led startup and took part in daily full-stack development.', 'Handled UI/UX design and implementation for websites, mini programs, apps, and related software.', 'Occasionally contributed to hardware development.', 'Built many full-stack projects here and accumulated substantial hands-on delivery experience.']
      }, {
        period: '2023.2-2024.11',
        company: 'Bitech Automotive Electronics (Wuhu) Co., Ltd.',
        companyNote: 'Formerly Bosch Automotive Electronics (Wuhu) Co., Ltd. After Bosch divested, Bitech took over operations. The company mainly serves automakers including Chery, Changan, GAC, and Tesla, producing instrument clusters, screens, domain controllers, and related components.',
        role: 'Test Engineer',
        tasks: ['Worked with CAN networks and performed bench and vehicle tests for instrument clusters.', 'Designed test cases and test scripts.', 'Stationed at Chery and Changan vehicle ports for pre-export inspection and flashing.', 'Built a practical understanding of automotive consumer electronics.']
      }, {
        period: '2024.12-2026.6',
        company: 'Shanghai Yongxing Trading Co., Ltd.',
        role: 'Visual Designer, Operations, AI Systems Developer',
        tasks: ['Produced e-commerce images, videos, and other assets with AI creation tools.', 'Led internal AI system development, including department workflows, company AI agents, RAG knowledge bases, and supporting tools to improve operations.']
      }]
    : [{
        period: '2025.1-2026.6',
        company: '芜湖享易软件有限公司',
        role: '全栈工程师',
        tasks: ['室友的创业公司，我被拉进去参与日常全栈开发。', '负责网站、小程序、App 等软件的 UI/UX 设计与实际开发。', '偶尔参与硬件开发。', '在这里开发了很多全栈项目，积累了丰富的实战经验。']
      }, {
        period: '2023.2-2024.11',
        company: '伯泰克（Bitech）汽车电子（芜湖）有限公司',
        companyNote: '前博世（Bosch）汽车电子（芜湖）有限公司，博世撤资后由伯泰克接手运营，公司主要对接奇瑞、长安、广汽、特斯拉等车企，生产仪表、屏幕、域控制器等部件',
        role: '测试工程师',
        tasks: ['了解 CAN 网络，进行汽车仪表的台架测试、实车测试。', '设计测试用例与测试脚本。', '奇瑞/长安汽车港口驻场，负责出口前检测与刷机。', '对汽车消费电子有一定理解']
      }, {
        period: '2024.12-2026.6',
        company: '上海邕兴贸易有限公司',
        role: '美工、运营、AI系统开发',
        tasks: ['使用AI创作工具为公司产出图片、视频等电商资源。', '主导公司AI系统开发，各部门AI使用，设计公司专用的AI Agent、Rag知识库、必要软件等，提高运转效率。']
      }]
}

export function getProjects(isEnglish: boolean): Project[] {
  return isEnglish
    ? [{
        title: 'Infinite-Canvas',
        subtitle: 'Open-source infinite canvas project',
        description: 'Contributed to Bilibili creator wuli大雄\'s open-source infinite canvas project, a node-based AI creation workspace on GitHub.',
        note: 'The repository has 1.3k stars and explores canvas editing, asset orchestration, and workflow-style creative tooling.',
        tags: ['Open Source', 'React', 'TypeScript', 'Python', 'HTML', 'AI Workflow', 'Full-stack'],
        image: '/projects/infinite-canvas-open-source.png',
        previewUrl: 'https://github.com/hero8152/Infinite-Canvas'
      }, {
        title: 'Chen Xuyuan Hair Loss Detection',
        subtitle: 'Hair loss self-screening mini program',
        description: 'An AI agent mini program built with uni-app and FastAPI. Users upload head photos from multiple angles, and the agent evaluates them against a medical knowledge base.',
        note: 'Designed according to Apple Human Interface Guidelines, with a polished interface, novel features, and straightforward interactions. Both frontend and backend performance have been optimized to deliver an exceptional mini program experience.',
        tags: ['Uni-app', 'WeChat Mini Program', 'Python', 'FastAPI', 'Agent', 'Knowledge Base', 'Database', 'Full-stack'],
        image: '/projects/hair-loss-login.jpg',
        previewImages: ['/projects/hair-loss-login.jpg', '/projects/hair-loss-upload.jpg', '/projects/hair-loss-profile.jpg'],
        previewQr: '/projects/hair-loss-qr.jpg'
      }, {
        title: 'EasyIoT',
        subtitle: 'Intelligent IoT cloud platform',
        logo: '/projects/easyiot-logo.png',
        description: 'A lightweight IoT application cloud platform that supports no-code and MCU low-code development, as well as self-built IoT systems.',
        note: 'Developed by the IoT Open Innovation Lab of Anhui Polytechnic University, with development boards and supporting facilities to help users quickly build and learn IoT applications. It covers Web, H5-mobile, and App clients, with rich teaching resources and project cases.',
        tags: ['C++', 'Vue', 'Node.js', 'Express', 'MQTT', 'Full-stack'],
        image: '/projects/easyiot-preview.png',
        previewUrl: 'https://www.easyiothings.com/'
      }, {
        title: 'Warmzen',
        subtitle: 'Cross-border independent store',
        logo: '/projects/warmzen-logo.png',
        description: 'A cross-border commerce site built on the open-source Payload CMS commerce stack, including storefront and admin system.',
        note: 'The storefront focuses on brand presentation, product collections, and an immersive hero experience, while the admin side supports content management, payment flows, and multilingual display.',
        tags: ['Next.js', 'React', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Tailwind CSS', 'Full-stack'],
        image: '/projects/warmzen-preview.png',
        previewUrl: 'https://warmzen.vercel.app/'
      }, {
        title: 'Uni Agents',
        subtitle: 'Automated deep-research agent',
        description: 'A multi-agent research system based on Uni Agents that breaks down topics, searches sources, and generates structured reports.',
        note: 'Enter a research topic and the agents plan subtasks, query multiple search engines, show progress in real time, and output a structured Markdown report.',
        tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI', 'Full-stack'],
        image: '/projects/agent.png',
        previewDisabledTip: 'Runs locally and is not online yet.'
      }, {
        title: 'NeoDesign',
        subtitle: 'AI creation platform',
        logo: '/tech-logos/neodesign.png',
        description: 'A workspace for producing AI images, videos, and creative assets, built to provide a seamless one-stop AI creation experience.',
        note: 'Built for my own e-commerce workflow after finding tools like Lovart and Tapnow too expensive for daily use.',
        tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Full-stack'],
        image: '/projects/infinite-canvas.jpg',
        previewDisabledTip: 'In development. Not open-sourced or released yet.'
      }]
    : [{
        title: 'Infinite-Canvas',
        subtitle: '开源无限画布项目',
        description: '参与 Bilibili UP 主 wuli大雄 发起的开源无限画布项目，围绕节点式 AI 创作、画布编辑与工作流体验进行协作。',
        note: '项目 GitHub 仓库已获得 1.3k stars，用无限画布承载图片、视频等 AI 生成流程和素材管理。',
        tags: ['开源项目', 'AI 创作', '工作流', 'Python', 'HTML', 'GitHub 1.3k stars', '全栈'],
        image: '/projects/infinite-canvas-open-source.png',
        previewUrl: 'https://github.com/hero8152/Infinite-Canvas'
      }, {
        title: '陈叙源脱发检测',
        subtitle: '脱发自检小程序',
        description: '基于 uni-app 和 FastAPI 开发的 AI Agent 小程序，用户可以上传各个角度的头部照片，Agent 检测后基于医学知识库给出评测结果。',
        note: '基于Apple-HIG规范设计，页面美观、功能新颖、操作简单。前后端性能均已优化，为用户打造极致的小程序使用体验',
        tags: ['Uni-app', '微信小程序', 'Python', 'Fastapi', 'Agent', '知识库', '数据库', '全栈'],
        image: '/projects/hair-loss-login.jpg',
        previewImages: ['/projects/hair-loss-login.jpg', '/projects/hair-loss-upload.jpg', '/projects/hair-loss-profile.jpg'],
        previewQr: '/projects/hair-loss-qr.jpg'
      }, {
        title: '易联智能',
        subtitle: '智能化物联网云平台',
        logo: '/projects/easyiot-logo.png',
        description: '轻量级物联网应用云平台，支持零代码与 MCU 低代码开发。支持自建物联网系统',
        note: '由安徽工程大学物联网开放创新实验室开发，配套开发板等设施，帮助用户快速搭建和学习物联网应用。覆盖Web、H5-mobile、App等多端，提供丰富的教学资源和项目案例。',
        tags: ['C++', 'Vue', 'Node.js', 'Express', 'MQTT', '全栈'],
        image: '/projects/easyiot-preview.png',
        previewUrl: 'https://www.easyiothings.com/'
      }, {
        title: 'Warmzen',
        subtitle: '跨境独立站',
        logo: '/projects/warmzen-logo.png',
        description: '基于 Payload CMS 开源商城系统开发的跨境独立站，包含前台商城与后台管理系统。',
        note: '前台聚焦品牌展示、商品集合和沉浸式首屏体验，后台支持商品内容管理、支付链路和多语言展示等能力。',
        tags: ['Next.js', 'React', 'Payload CMS', 'PostgreSQL', 'Stripe', 'Tailwind CSS', '全栈'],
        image: '/projects/warmzen-preview.png',
        previewUrl: 'https://warmzen.vercel.app/'
      }, {
        title: 'Uni Agents',
        subtitle: '自动化深度研究智能体',
        description: '基于 Uni Agents 框架的多 Agent 协作深度研究系统，自动拆解课题、搜索资料并生成结构化报告。',
        note: '输入一个研究课题，智能体自动规划子任务、调用多个搜索引擎收集资料，实时展示进度，最终输出一份结构化的 Markdown 研究报告。',
        tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI', '全栈'],
        image: '/projects/agent.png',
        previewDisabledTip: '本地运行，暂不上线，请理解'
      }, {
        title: 'NeoDesign',
        subtitle: 'AI 创作平台',
        logo: '/tech-logos/neodesign.png',
        description: '面向 AI 图片、视频与创意资产生产的工作空间，为用户打造无缝丝滑一站式AI创作体验。',
        note: '因不满Lovart、Tapnow的昂贵收费，开发一款更好用、更便宜的自己用，以完成日常电商工作。',
        tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', '全栈'],
        image: '/projects/infinite-canvas.jpg',
        previewDisabledTip: '开发中，暂不开源/发布，请理解。'
      }]
}

export function getArtCollections(isEnglish: boolean): ArtCollection[] {
  return isEnglish
    ? [{
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
      }]
    : [{
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
      }]
}
