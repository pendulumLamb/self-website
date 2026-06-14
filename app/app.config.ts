export default defineAppConfig({
  global: {
    picture: {
      dark: '/avatar.jpg',
      light: '/avatar.jpg',
      alt: '你的头像'
    },
    meetingLink: 'mailto:hello@example.com',
    email: 'hello@example.com',
    available: true
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `个人简历与技术博客 • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/your-name',
      'target': '_blank',
      'aria-label': 'GitHub'
    }, {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/your-name',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-lucide-mail',
      'to': 'mailto:hello@example.com',
      'target': '_blank',
      'aria-label': 'Email'
    }]
  }
})
