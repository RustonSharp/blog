---
title: 如何新增一篇文章
date: 2026年3月9日
category: 教程
collection: 博客使用指南
excerpt: 一步步教你如何在这个博客中添加新的文章。
heroImage: https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200
---

## 新增文章指南

欢迎使用 MISTISLE 博客！本教程将帮助你快速上手，学会如何添加新的文章。

### 第一步：创建 Markdown 文件

在 `posts/` 目录下创建一个新的 Markdown 文件，文件名建议使用简洁的英文，比如：
- `my-first-post.md`
- `tech-tips.md`
- `design-thoughts.md`

### 第二步：添加 Frontmatter 元数据

在文件开头添加以下格式的元数据：

```markdown
---
title: 文章标题
date: 2026年3月9日
category: 分类名称
collection: 合集名称
excerpt: 文章摘要
heroImage: https://example.com/image.jpg
---
```

**字段说明：**
- `title`: 文章标题（必填）
- `date`: 发布日期（必填）
- `category`: 分类，需要在 `categories.json` 中定义（必填）
- `collection`: 合集，需要在 `collections.json` 中定义（可选）
- `excerpt`: 文章摘要，显示在首页（可选）
- `heroImage`: 封面图片 URL（可选）

### 第三步：撰写文章内容

在 frontmatter 下方开始写你的文章内容，使用 Markdown 语法。

### 第四步：生成 posts.json

写完文章后，在项目根目录运行：

```bash
python3 generate_posts.py
```

这个脚本会自动：
1. 读取所有 Markdown 文件
2. 提取 frontmatter 元数据
3. 计算字数和阅读时间
4. 生成新的 `posts.json` 文件

### 第五步：预览

打开 `index.html` 即可看到你的新文章！

### 小贴士

- 分类和合集需要先在 `categories.json` 和 `collections.json` 中定义
- 每次添加或修改文章后都需要重新运行 `generate_posts.py`
- Markdown 支持语法高亮、图片、链接等丰富功能
