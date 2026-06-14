# Selfblog

🌐 **访问网站：[www.wylong.uno](https://www.wylong.uno)**

基于 [nuxt-ui-templates/portfolio](https://github.com/nuxt-ui-templates/portfolio) 初始化的个人简历与技术博客项目。

## 技术栈

- Nuxt 4
- Nuxt UI
- Nuxt Content
- TypeScript
- pnpm

## 本地开发

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

生产构建：

```bash
pnpm build
```

## 内容入口

- 首页内容：`content/index.yml`
- 简历内容：`content/about.yml`
- 项目作品：`content/projects/*.yml`
- 博客文章：`content/blog/*.md`
- 头像、邮箱、社交链接：`app/app.config.ts`

## 上线前替换

搜索并替换这些占位内容：

- `你的名字`
- `hello@example.com`
- `your-name`
- `当前公司`
- `上一家公司`
