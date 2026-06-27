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
        'I graduated from Anhui Polytechnic University in 2023, majoring in Internet of Things Engineering while also taking courses in visual communication design. I was a member of the IoT Association in the School of Computer Science. During my time at school I took part in various competitions with teachers and classmates, such as the Challenge Cup, Internet+, the Shuangbai Competition, and CCCC. Sadly, I never won a top prize.',
        'During college I started taking on freelance work, and later a startup attempt did not work out. After graduation I entered the tech industry and worked across automotive testing, IoT development, and full-stack software development, building both software and hardware capabilities while also providing creative resources for e-commerce teams.',
        'I stay committed to product design, using minimal, restrained, and warm design to make technology easier to perceive. I have broad interests and enjoy exploring new technologies, with an intense passion for development and an undying geek spirit.'
      ]
    : [
        '2023年毕业于安徽工程大学，学习物联网工程专业，另外辅修视觉传达设计课程。计算机学院物联网协会会员。在校期间和老师、同学参加过多种竞赛，诸如挑战杯、互联网+、双百大赛、CCCC等。可惜从未获得过顶级大奖。',
        '大学期间开始做外包，后创业未果。毕业后进入计算机相关行业，先后从事过车载测试、物联网开发、软件全栈开发工作，软硬兼修。并为电商公司提供资源设计。',
        '执着于产品设计，用极简、克制、温暖的设计让科技得以被感知。涉猎广泛，乐于探索新技术，拥有极致的开发热情和不灭的极客精神'
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
      label: 'K8s',
      icon: 'simple-icons:kubernetes',
      color: '#326CE5'
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
    }]
  }]
}

export function getWorkExperiences(isEnglish: boolean): WorkExperience[] {
  return isEnglish
    ? [{
        period: '2025.1-2026.6',
        company: 'Wuhu Xiangyi Software Co., Ltd.',
        role: 'Full-stack Engineer',
        tasks: ['Day-to-day full-stack development, including frontend design and engineering, backend development, distributed systems, microservice architecture, frontend-backend debugging, and online deployment and maintenance.', 'Handled UI/UX design and implementation for websites, mini programs, apps, and related software.', 'Occasionally contributed to hardware development.', 'Built many full-stack projects here and accumulated substantial hands-on delivery experience.']
      }, {
        period: '2023.2-2024.11',
        company: 'Bitech Automotive Electronics (Wuhu) Co., Ltd.',
        companyNote: 'Formerly Bosch Automotive Electronics (Wuhu) Co., Ltd. After Bosch divested, Bitech took over operations. The company mainly serves automakers including Chery, Changan, GAC, and Tesla, producing instrument clusters, screens, domain controllers, and related components.',
        role: 'Test Engineer',
        tasks: ['Worked with CAN networks and used CANoe and CANalyzer for bench and vehicle tests of instrument clusters.', 'Designed solutions using the CAPL language.', 'On-site at the service party\'s port for pre-export inspection and flashing.', 'Built a practical understanding of automotive consumer electronics.']
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
        tasks: ['日常全栈开发，包括前端设计和工程化、后端开发、分布式系统、微服务架构、前后端调试、线上部署和维护', '负责网站、小程序、App 等软件的 UI/UX 设计与实际开发。', '偶尔参与硬件开发。', '在这里开发了很多全栈项目，积累了丰富的实战经验。']
      }, {
        period: '2023.2-2024.11',
        company: '伯泰克（Bitech）汽车电子（芜湖）有限公司',
        companyNote: '前博世（Bosch）汽车电子（芜湖）有限公司，博世撤资后由伯泰克接手运营，公司主要对接奇瑞、长安、广汽、特斯拉等车企，生产仪表、屏幕、域控制器等部件',
        role: '测试工程师',
        tasks: ['了解 CAN 网络，利用CANoe和CANalyzer进行汽车仪表的台架测试、实车测试。', '使用CAPL语言设计方案。', '服务方港口驻场，负责出口前检测与刷机。', '对汽车消费电子有一定理解']
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
        note: 'The repository has 1.6k stars and uses an infinite canvas to host AI generation workflows and asset management for images, videos, and more. It integrates AI knowledge-base Q&A and preset ComfyUI workflows while also letting you plug in your own ComfyUI workflows, exploring directions like canvas editing, asset orchestration, workflow-style creative tooling, and AI Agents.',
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
        title: 'Evidence Tracking Agent',
        subtitle: 'Agent for building evidence chains',
        description: 'An agent that builds a complete evidence chain from real-world materials such as chat screenshots, contract documents, handwritten notes, and videos, helping users preserve memories.',
        note: 'Users upload the relevant files, and the built-in agent analyzes them to output an evidence timeline and an editable node-based evidence graph. The frontend is built with React.js, the backend uses Go with Gin, and agent orchestration is handled by Eino for high-performance processing.',
        tags: ['React', 'Go', 'Gin', 'Eino', 'PostgreSQL', 'pgvector', 'Agent', 'Alibaba Cloud OSS', 'Full-stack'],
        image: '/projects/evidence-agent-preview-v2.png',
        previewDisabledTip: 'Internally deployed.'
      }, {
        title: 'Unishop Agents',
        subtitle: 'Automated commerce data analysis agent',
        description: 'A multi-agent deep research system built for an e-commerce company. It can analyze real-world data such as product pricing, sales volume, store reports, and employee performance, then search supporting information, generate structured reports, and provide actionable optimization suggestions.',
        note: 'The project uses a ReAct architecture with a think-and-act, dynamic decision-making workflow, allowing long-term store monitoring and feedback.',
        tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI', 'Full-stack'],
        image: '/projects/agent.png',
        previewDisabledTip: 'Internally deployed.'
      }, {
        title: 'Blockchain IoT Tea Traceability System',
        subtitle: 'Tea traceability system based on blockchain and IoT',
        description: 'A university entrepreneurship project that combines smart contracts on blockchain with IoT data, making the data tamper-resistant, stable, and secure while keeping the full tea production-to-sales chain transparent.',
        note: 'IoT sensing devices upload data to the cloud and form blocks. Each node then generates data through sensing and recording, and those node records form a blockchain. Users scan the product label code in the app to view the full-chain data. This decentralized approach protects the natural integrity of the data. The blockchain uses Ethereum, the app is built with uni-app, and the service is built on Spring Boot.',
        tags: ['Ethereum', 'Go', 'IoT', 'Blockchain', 'Geth', 'Uni-app', 'Java'],
        image: '/projects/tea-traceability.jpg',
        previewUrl: 'https://b23.tv/yor2Hbh',
        previewDisabledTip: 'Watch the intro video.'
      }, {
        title: 'Go Commerce Project',
        subtitle: 'Full-stack commerce system for a client',
        description: 'A complete commerce project built for a client, covering Web, mini program, and admin management. Features included login, the full shopping flow, flash sales, coupons, and WeChat Pay. The project eventually stalled because of poor client-side operations.',
        note: 'Built with Gin, Vue, Gorm, Element Plus, and Uni-app, with a focus on high concurrency, fast response, and simplified workflows.',
        tags: ['Gin', 'Gorm', 'Vue', 'Element Plus', 'Uni-app', 'MySQL', 'Redis', 'Alibaba Cloud OSS', 'Full-stack'],
        image: '/projects/go-mall-web.png',
        previewImages: ['/projects/go-mall-web.png', '/projects/go-mall-mini.jpg'],
        previewDisabledTip: 'Client project. Not online anymore.'
      }, {
        title: 'Neptune',
        subtitle: 'Agent black-box security monitoring platform',
        logo: '/tech-logos/Neptune.png',
        description: 'A locally-run agent monitoring tool that brings together agent aggregation, status monitoring, operation tracking, API traffic monitoring, token consumption and cost calculation, cache monitoring, security protection, risk alerts, and git commit gatekeeping, and can monitor multiple agents and tasks in parallel. It does only three things: trace, guard, and manage — not surface-level viewing and management, but deep, system- and gateway-level monitoring and protection.',
        note: 'It adopts a multi-level decoupled architecture that is extensible and integrable, and ships with a desktop app, CLI, and local gateway. The desktop client is built with Wails, React powers the UI, and the Go backend handles local config reading, process scanning, session activity detection, and system integration. It supports Windows and macOS, and can monitor agents such as Codex, Claude Code, OpenClaw, and OpenCode.',
        tags: ['Go', 'React', 'Wails', 'Agent', 'Windows', 'macOS', 'Open-source', 'CLI'],
        image: '/projects/Neptune-console.png',
        previewDisabledTip: 'Open-source release coming soon.'
      }]
    : [{
        title: 'Infinite-Canvas',
        subtitle: '开源无限画布项目',
        description: '参与 Bilibili UP 主 wuli大雄 发起的开源无限画布项目，围绕节点式 AI 创作、画布编辑与工作流体验进行协作。',
        note: '项目 GitHub 仓库已获得 1.6k stars，用无限画布承载图片、视频等 AI 生成流程和素材管理。集成AI知识库问答、预设comfyUI工作流，也可自行接入comfyUI工作流。探索画布编辑、素材编排、工作流式创作工具、AI Agent等方向。',
        tags: ['开源项目', 'AI 创作', '工作流', 'Python', 'HTML', 'GitHub 1.6k stars', '全栈'],
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
        title: '证据追踪Agent',
        subtitle: '完整证据链分析智能体',
        description: '根据聊天截图、合同文档、手写纸条、视频等现实资料形成完整证据链的Agent，帮助用户做记忆留存。',
        note: '用户上传相应文件，经过内置Agent的分析后，为用户输出证据时间线列表，和可编辑节点式证据图。项目前端基于React.Js，后端使用Go，服务基于Gin，智能体编排使用Eino，确保高性能处理。',
        tags: ['React', 'Go', 'Gin', 'Eino', 'PostgreSQL', 'pgvector', 'Agent', '阿里云OSS', '全栈'],
        image: '/projects/evidence-agent-preview-v2.png',
        previewDisabledTip: '内部部署。'
      }, {
        title: 'Unishop Agents',
        subtitle: '自动化数据分析智能体',
        description: '为电商公司打造的多Agent协作深度研究系统，自动可以根据商品定价、销售量、店铺报表、员工绩效等一切现实数据，搜索资料并生成结构化报告,并给出可执行的优化建议。',
        note: '项目采用ReAct架构实现，具有“边想边做，动态决策”的特点，可对店铺进行长期监测反馈',
        tags: ['Vue 3', 'TypeScript', 'FastAPI', 'Python', 'LangGraph', 'OpenAI', '全栈'],
        image: '/projects/agent.png',
        previewDisabledTip: '内部部署'
      }, {
        title: '基于区块链和物联网系统的茶叶溯源系统',
        subtitle: '区块链 + 物联网茶叶溯源系统',
        description: '大学创业项目，将智能合约（区块链）和物联网数据结合，实现数据不可篡改、稳定安全，保障茶叶在生产到销售全链路数据透明。',
        note: '物联网感知端将数据上云形成区块，之后每个节点通过感知、记录等方式产生数据，各节点数据形成区块链。用户通过App扫描产品上标签码查看全链路数据。这种去中心化方式保障了数据的纯天然。区块链使用以太坊，App使用uni-app开发，服务基于SpringBoot搭建。',
        tags: ['以太坊', 'Go', 'IoT', '区块链', 'Geth', 'Uni-app', 'Java'],
        image: '/projects/tea-traceability.jpg',
        previewUrl: 'https://b23.tv/yor2Hbh',
        previewDisabledTip: '查看介绍视频'
      }, {
        title: 'go商城项目',
        subtitle: '为甲方打造的全套商城项目',
        description: '为甲方打造的一款全套商城项目，包括web端、小程序端、后台管理端。功能包括：登录、购物全流程、秒杀、优惠券、支付（只做了微信支付）等商城基础功能。甲方运营不当最终烂尾。',
        note: '项目基于Gin、Vue、Gorm、Element-plus、Uni-app等技术开发，具有高并发、快响应、极简化等特点。',
        tags: ['Gin', 'Gorm', 'Vue', 'Element-plus', 'Uni-app', 'Mysql', 'Redis', '阿里云OSS', '全栈'],
        image: '/projects/go-mall-web.png',
        previewImages: ['/projects/go-mall-web.png', '/projects/go-mall-mini.jpg'],
        previewDisabledTip: '甲方项目，当前已停止运营。'
      }, {
        title: 'Neptune',
        subtitle: 'Agent黑盒安全监控平台',
        logo: '/tech-logos/Neptune.png',
        description: '本地运行的Agent监控工具，集Agent汇总、状态监控、操作追踪、api流量监控、token消耗和成本计算、缓存监控、安全防护、风险提醒、git提交把关等功能于一体，可以多agent多任务同步监控。只做三件事：trace、guard、manage，不是纸面上的查看和管理，而是深入系统和网关级的监控和防护。',
        note: '采用多级解耦架构，可扩展可集成，配备桌面应用、cli、本地网关。桌面端通过 Wails 搭建，React 负责界面，Go 后端负责本地配置读取、进程扫描、会话活动判断和系统集成。支持Windows和macOS，可监控诸如codex、claudecode、openclaw、opencode等agent的情况。',
        tags: ['Go', 'React', 'Wails', 'Agent', 'windows', 'macos', '开源', 'cli'],
        image: '/projects/Neptune-console.png',
        previewDisabledTip: '即将开源'
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
