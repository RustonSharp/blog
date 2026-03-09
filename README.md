# MISTISLE 博客

一个专注于设计哲学、技术实践和深度思考的个人博客。

## 特性

- 🎨 简约现代的设计风格
- 🌙 支持深色/浅色主题切换
- 📱 响应式布局，适配各种设备
- 🏷️ 文章分类和合集管理
- 📊 Cloudflare Web Analytics 访客统计
- ⚡ 纯静态网站，加载速度快

## 项目结构

```
blog/
├── index.html              # 首页
├── pages/                  # 页面目录
│   ├── post.html           # 文章详情页
│   └── about.html          # 关于页面
├── assets/                 # 静态资源
│   ├── css/
│   │   └── style.css       # 样式文件
│   ├── js/
│   │   └── main.js         # 主要 JavaScript 逻辑
│   ├── Island_With_Tree.svg
│   └── Easter_Island.svg
├── data/                   # 数据文件
│   ├── categories.json     # 分类配置
│   ├── collections.json    # 合集配置
│   └── posts.json          # 文章数据
├── scripts/                # 脚本文件
│   └── generate_posts.py   # 文章生成脚本
├── posts/                  # Markdown 文章目录
│   └── example.md
├── .nojekyll               # 禁用 GitHub Pages Jekyll 处理
├── CNAME                   # 自定义域名配置
├── README.md               # 中文文档
└── README_EN.md            # 英文文档
```

## 配置文件说明

### CNAME
用于配置自定义域名。文件内容为域名地址，如：
```
mistisle.com
```
部署到 GitHub Pages 后，博客将通过此域名访问。

### .nojekyll
空文件，告诉 GitHub Pages 不要使用 Jekyll 处理网站，直接发布原始文件。

## 快速开始

### 添加新文章

1. 在 `posts/` 目录下创建 Markdown 文件
2. 添加 frontmatter 元数据：

```markdown
---
title: 文章标题
date: 2026年3月9日
category: 分类名称
collection: 合集名称
excerpt: 文章摘要
heroImage: 封面图片 URL
---

文章内容...
```

3. 运行生成脚本：

```bash
python3 scripts/generate_posts.py
```

4. 刷新网页查看新文章

### 添加分类或合集

编辑 `data/categories.json` 或 `data/collections.json` 文件：

```json
{
  "id": "分类ID",
  "name": "分类名称",
  "icon": "material-icon-name",
  "description": "分类描述"
}
```

## 部署

本项目可直接部署到 GitHub Pages：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为源
4. （可选）在 CNAME 文件中配置自定义域名

## 技术栈

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- Python (文章生成脚本)

## 许可证

MIT License
