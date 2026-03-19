# MISTISLE 博客

一个专注于设计哲学、技术实践和深度思考的个人博客。

## 特性

- 🎨 简约现代的设计风格
- 📱 响应式布局，适配各种设备
- 🏷️ 文章分类 + 标签
- ⚡ 纯静态网站，加载速度快

## 项目结构

```text
blog/
├── .github/
│   └── workflows/
│       └── ci.yml           # 基础 CI（生成 + 校验）
├── index.html              # 首页
├── pages/                  # 页面目录
│   └── post.html           # 文章详情页
├── assets/                 # 静态资源
│   ├── css/
│   │   ├── style.css       # 基础样式（跨主题）
│   │   └── theme-terminal.css # 终端主题覆盖层
│   ├── js/
│   │   ├── main.js         # 初始化入口
│   │   ├── shared.js       # 共享能力（主题、安全、数据）
│   │   └── home.js         # 首页渲染
│   ├── Island_With_Tree.svg
│   └── Easter_Island.svg
├── data/                   # 数据文件
│   └── posts.json          # 文章数据
├── scripts/                # 脚本文件
│   └── generate_posts.py   # 文章生成脚本
├── posts/                  # Markdown 文章目录
│   └── example.md
├── CNAME                   # 自定义域名配置
├── LICENSE                 # MIT 许可证
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
   subtitle: 副标题
   date: 2026年3月9日
   category: 主分类（可选）
   tags: 标签1, 标签2, 标签3
   collection: 合集名称
   excerpt: 文章摘要，显示在文章页标题区下方
   heroImage: https://example.com/image.jpg
   readTime: 3 分钟
   wordCount: 1200 字
   ---
   
   文章内容支持 Markdown 语法...
   ```

   **字段说明：**

   | 字段 | 必填 | 说明 |
   | --- | --- | --- |
   | `title` | ✅ | 文章标题 |
   | `subtitle` | ❌ | 副标题，显示在元信息中（日期与分类之间） |
   | `date` | ✅ | 发布日期，格式：`YYYY年M月D日` |
   | `category` | ❌ | 主分类（导航用途），缺省时使用 `未分类` |
   | `tags` | ❌ | 标签列表（推荐），多个标签用英文逗号分隔 |
   | `collection` | ❌ | 合集名称，显示在首页元信息中 |
   | `excerpt` | ❌ | 文章摘要，显示在文章页标题区下方 |
   | `heroImage` | ❌ | 封面图片 URL |
   | `readTime` | ❌ | 阅读时长（缺省时自动计算） |
   | `wordCount` | ❌ | 字数（缺省时自动计算） |

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
   - 分类名称是否正确
   - 运行脚本时是否有错误提示

## 部署

本项目可直接部署到 GitHub Pages：

1. 将代码推送到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 main 分支作为源
4. （可选）在 CNAME 文件中配置自定义域名

## 样式层级约定

- `assets/css/style.css`：基础层，只放布局、组件骨架和跨主题变量。
- `assets/css/theme-terminal.css`：主题层，只做终端风覆盖，不改结构语义。
- 页面加载顺序必须保持：`style.css` 在前，`theme-terminal.css` 在后。

## 自动化检查

- 仓库已包含 `.github/workflows/ci.yml`，会自动执行：
  - `scripts/generate_posts.py` 并校验 `data/posts.json` 是否最新
  - JavaScript 语法检查
  - Markdown lint

## 技术栈

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- Python (文章生成脚本)

## 许可证

MIT License
