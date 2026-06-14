---
title: "前端工程化笔记：从可运行到可维护"
description: "整理个人项目中常见的工程化检查点，包括依赖、规范、构建、部署和复盘。"
date: 2026-06-08
image: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop
minRead: 6
author:
  name: 你的名字
  description: 前端 / 全栈开发者
  avatar:
    src: https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=1480&auto=format&fit=crop
    alt: 你的名字
---

一个项目能跑起来只是第一步。真正长期可用的项目，需要在依赖管理、代码规范、类型检查、构建验证和部署流程上保持基本秩序。

## 依赖管理

依赖应该尽量统一包管理器，并把锁文件提交到仓库。本项目使用 `pnpm`，对应的锁文件是 `pnpm-lock.yaml`。新增依赖时，优先确认是否已有框架内置能力或项目已有工具可以复用。

## 代码质量

建议每次提交前至少运行：

```bash
pnpm lint
pnpm typecheck
pnpm build
```

小项目也需要这三类检查。它们能提前暴露格式问题、类型问题和生产构建问题，避免上线时才发现错误。

## 内容维护

博客和项目数据放在 `content` 目录中，这让内容维护不必侵入页面组件。写文章时只需要复制一篇 Markdown，修改 frontmatter 和正文即可。
