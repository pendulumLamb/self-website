import type { PageCollectionItemBase, DataCollectionItemBase } from '@nuxt/content'

declare module '@nuxt/content' {
   interface IndexCollectionItem extends PageCollectionItemBase {
    hero: {
    links: {
      label: string
      icon?: string
      to?: string
      color?: ("primary" | "neutral" | "success" | "warning" | "error" | "info")
      size?: ("xs" | "sm" | "md" | "lg" | "xl")
      variant?: ("solid" | "outline" | "subtle" | "soft" | "ghost" | "link")
      target?: ("_blank" | "_self")
    }[]
    images: {
      src: string
      alt: string
    }[]
    }
    about: {
    title: string
    description: string
    }
    experience: {
    title: string
    description: string
    items: {
      date: string
      position: string
      company: {
      name: string
      url: string
      logo: string
      color: string
      }
    }[]
    }
    testimonials: {
    quote: string
    author: {
      name: string
      description?: string
      username?: string
      twitter?: string
      to?: string
      avatar?: {
      src: string
      alt: string
      }
    }
    }[]
    blog: {
    title: string
    description: string
    }
    faq: {
    title: string
    description: string
    categories: {
      title: string
      questions: {
      label: string
      content: string
      }[]
    }[]
    }
  }
  
   interface ProjectsCollectionItem extends DataCollectionItemBase {
    title: string
    description: string
    image: string
    url: string
    tags: string[]
    date: string
  }
  
   interface BlogCollectionItem extends PageCollectionItemBase {
    minRead: number
    date: string
    image: string
    author: {
    name: string
    description?: string
    username?: string
    twitter?: string
    to?: string
    avatar?: {
      src: string
      alt: string
    }
    }
  }
  
   interface PagesCollectionItem extends PageCollectionItemBase {
    links: {
    label: string
    icon?: string
    to?: string
    color?: ("primary" | "neutral" | "success" | "warning" | "error" | "info")
    size?: ("xs" | "sm" | "md" | "lg" | "xl")
    variant?: ("solid" | "outline" | "subtle" | "soft" | "ghost" | "link")
    target?: ("_blank" | "_self")
    }[]
  }
  
   interface AboutCollectionItem extends PageCollectionItemBase {
    content: {}
    images: {
    src: string
    alt: string
    }[]
  }
  

  interface PageCollections {
    index: IndexCollectionItem
    blog: BlogCollectionItem
    pages: PagesCollectionItem
    about: AboutCollectionItem
  }

  interface Collections {
    index: IndexCollectionItem
    projects: ProjectsCollectionItem
    blog: BlogCollectionItem
    pages: PagesCollectionItem
    about: AboutCollectionItem
  }
}
