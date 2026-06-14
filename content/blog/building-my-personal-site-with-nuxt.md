---
title: "用 Nuxt 初始化个人简历与技术博客"
description: "记录这个站点的技术选型、内容结构和后续可扩展方向。"
date: 2026-06-09
image: /projects/warmzen-preview.png
minRead: 5
author:
  name: 你的名字
  description: 前端 / 全栈开发者
  avatar:
    src: /avatar.jpg
    alt: 你的名字
---

这个站点使用 Nuxt、Nuxt UI 和 Nuxt Content 构建。它不是一个单纯的静态简历，而是一个可以持续更新的个人内容系统：简历负责说明“我是谁”，项目页负责说明“我做过什么”，博客负责沉淀“我如何思考和解决问题”。

## 为什么选择 Nuxt

Nuxt 对内容型站点很友好，路由、SEO、图片、组件系统和构建流程都比较完整。配合 Nuxt Content，可以直接用 Markdown 管理文章，用 YAML 管理首页、项目和简历信息。

## 当前结构

- `content/index.yml`：首页文案、工作经历和 FAQ
- `content/about.yml`：在线简历正文
- `content/projects/*.yml`：项目作品
- `content/blog/*.md`：博客文章
- `app/app.config.ts`：头像、邮箱、社交链接和页脚信息

## 后续计划

下一步可以继续补充真实头像、真实项目、文章分类、标签页和部署配置。等内容稳定后，再根据自己的视觉偏好调整色彩、字体和首页图片。
