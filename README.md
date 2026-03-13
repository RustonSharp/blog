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

```text
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

```text
mistisle.com
```

部署到 GitHub Pages 后，博客将通过此域名访问。

### .nojekyll

空文件，告诉 GitHub Pages 不要使用 Jekyll 处理网站，直接发布原始文件。

## 快速开始

### 本地运行

本博客使用 `fetch()` 加载数据，需通过 HTTP 服务访问，直接双击打开 HTML 文件无法正常显示内容。

在项目根目录执行以下任一命令启动本地服务器：

```bash
# 使用 Python（推荐，无需额外安装）
python3 -m http.server 8000
```

或：

```bash
# 使用 Node.js
npx serve
```

然后在浏览器访问 `http://localhost:8000` 即可预览。

### 添加新文章

1. **创建 Markdown 文件**

   在 `posts/` 目录下创建新的 `.md` 文件，文件名建议使用英文，如 `my-article.md`。

2. **添加 frontmatter 元数据**

   在文件开头添加以下格式（注意：字段名后要有空格）：

   ```markdown
   ---
   title: 文章标题
   date: 2026年3月9日
   category: 分类名称
   collection: 合集名称
   excerpt: 文章摘要，显示在首页
   heroImage: https://example.com/image.jpg
   ---
   
   文章内容支持 Markdown 语法...
   ```

   **字段说明：**

   | 字段 | 必填 | 说明 |
   | --- | --- | --- |
   | `title` | ✅ | 文章标题 |
   | `date` | ✅ | 发布日期，格式：`YYYY年M月D日` |
   | `category` | ✅ | 分类名称，需先在 `data/categories.json` 中定义 |
   | `collection` | ❌ | 合集名称，需先在 `data/collections.json` 中定义 |
   | `excerpt` | ❌ | 文章摘要，显示在首页卡片中 |
   | `heroImage` | ❌ | 封面图片 URL |

3. **生成文章数据**

   运行脚本更新 `data/posts.json`：

   ```bash
   python3 scripts/generate_posts.py
   ```

   脚本会自动：
   - 读取所有 Markdown 文件
   - 提取 frontmatter 元数据
   - 计算字数和预估阅读时间
   - 生成 `data/posts.json`

4. **查看效果**

   刷新网页即可看到新文章。如果看不到，请检查：
   - frontmatter 格式是否正确（`---` 分隔符）
   - 分类名称是否与 `categories.json` 中定义的一致
   - 运行脚本时是否有错误提示

### 添加分类或合集

#### 添加分类

1. 编辑 `data/categories.json` 文件
2. 在数组中添加新的分类对象：

```json
{
  "id": "tutorial",
  "name": "教程",
  "icon": "school",
  "description": "博客使用教程"
}
```

**字段说明：**

| 字段 | 说明 |
| --- | --- |
| `id` | 唯一标识符，建议使用英文小写 |
| `name` | 分类显示名称 |
| `icon` | Material Icons 图标名称，参考 [Material Symbols](https://fonts.google.com/icons) |
| `description` | 分类描述，显示在侧边栏 |

#### 添加合集

1. 编辑 `data/collections.json` 文件
2. 格式与分类相同：

```json
{
  "id": "blog-guide",
  "name": "博客使用指南",
  "icon": "menu_book",
  "description": "如何使用这个博客系统"
}
```

**注意事项：**

- 添加后无需运行脚本，直接刷新网页即可生效
- 确保 `id` 唯一，不要与现有分类/合集重复
- 文章通过 `category` 和 `collection` 字段关联到分类和合集

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
