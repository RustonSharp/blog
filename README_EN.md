# MISTISLE Blog

A personal blog focused on design philosophy, technology practices, and deep thinking.

## Features

- 🎨 Minimalist and modern design
- 🌙 Dark/Light theme toggle support
- 📱 Responsive layout for all devices
- 🏷️ Article categories and collections management
- 📊 Cloudflare Web Analytics integration
- ⚡ Pure static website for fast loading

## Project Structure

```
blog/
├── index.html              # Homepage
├── pages/                  # Pages directory
│   ├── post.html           # Article detail page
│   └── about.html          # About page
├── assets/                 # Static assets
│   ├── css/
│   │   └── style.css       # Stylesheet
│   ├── js/
│   │   └── main.js         # Main JavaScript logic
│   ├── Island_With_Tree.svg
│   └── Easter_Island.svg
├── data/                   # Data files
│   ├── categories.json     # Categories configuration
│   ├── collections.json    # Collections configuration
│   └── posts.json          # Posts data
├── scripts/                # Scripts directory
│   └── generate_posts.py   # Article generation script
├── posts/                  # Markdown articles directory
│   └── example.md
├── .nojekyll               # Disable GitHub Pages Jekyll processing
├── CNAME                   # Custom domain configuration
├── README.md               # Chinese documentation
└── README_EN.md            # English documentation
```

## Configuration Files

### CNAME
Used to configure a custom domain. The file content is the domain address, e.g.:
```
mistisle.com
```
After deploying to GitHub Pages, the blog will be accessible via this domain.

### .nojekyll
An empty file that tells GitHub Pages not to use Jekyll to process the site, and to publish the raw files directly.

## Quick Start

### Adding a New Article

1. Create a Markdown file in the `posts/` directory
2. Add frontmatter metadata:

```markdown
---
title: Article Title
date: March 9, 2026
category: Category Name
collection: Collection Name
excerpt: Article excerpt
heroImage: Cover image URL
---

Article content...
```

3. Run the generation script:

```bash
python3 scripts/generate_posts.py
```

4. Refresh the webpage to see the new article

### Adding Categories or Collections

Edit `data/categories.json` or `data/collections.json`:

```json
{
  "id": "category-id",
  "name": "Category Name",
  "icon": "material-icon-name",
  "description": "Category description"
}
```

## Deployment

This project can be directly deployed to GitHub Pages:

1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. (Optional) Configure custom domain in CNAME file

## Tech Stack

- HTML5
- CSS3 (CSS Variables, Flexbox, Grid)
- Vanilla JavaScript
- Python (article generation script)

## License

MIT License
