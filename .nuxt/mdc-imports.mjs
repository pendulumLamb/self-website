import _RemarkEmoji from 'remark-emoji'
import _Highlight from 'D:/1PROGRAM/PROJ/portfolio/node_modules/.pnpm/@nuxtjs+mdc@0.22.0_magicast@0.5.3/node_modules/@nuxtjs/mdc/dist/runtime/highlighter/rehype-nuxt.js'

export const remarkPlugins = {
  'remark-emoji': { instance: _RemarkEmoji },
}

export const rehypePlugins = {
  'highlight': { instance: _Highlight, options: {} },
}

export const highlight = {"theme":{"light":"material-theme-lighter","default":"material-theme","dark":"material-theme-palenight"}}