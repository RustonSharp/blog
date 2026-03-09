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

1. **Create Markdown File**

   Create a new `.md` file in the `posts/` directory. Use English filename, e.g., `my-article.md`.

2. **Add Frontmatter Metadata**

   Add the following format at the beginning of the file (note: space after field names):

   ```markdown
   ---
   title: Article Title
   date: March 9, 2026
   category: Category Name
   collection: Collection Name
   excerpt: Article excerpt shown on homepage
   heroImage: https://example.com/image.jpg
   ---

   Article content supports Markdown syntax...
   ```

   **Field Description:**
   | Field | Required | Description |
   |-------|----------|-------------|
   | `title` | ✅ | Article title |
   | `date` | ✅ | Publish date, format: `Month D, YYYY` |
   | `category` | ✅ | Category name, must be defined in `data/categories.json` first |
   | `collection` | ❌ | Collection name, must be defined in `data/collections.json` first |
   | `excerpt` | ❌ | Article excerpt, displayed on homepage cards |
   | `heroImage` | ❌ | Cover image URL |

3. **Generate Article Data**

   Run the script to update `data/posts.json`:

   ```bash
   python3 scripts/generate_posts.py
   ```

   The script will automatically:
   - Read all Markdown files
   - Extract frontmatter metadata
   - Calculate word count and estimated reading time
   - Generate `data/posts.json`

4. **View Results**

   Refresh the webpage to see the new article. If not visible, check:
   - Whether frontmatter format is correct (`---` delimiters)
   - Whether category name matches the definition in `categories.json`
   - Whether there are any error messages when running the script

### Adding Categories or Collections

#### Adding a Category

1. Edit the `data/categories.json` file
2. Add a new category object to the array:

```json
{
  "id": "tutorial",
  "name": "Tutorial",
  "icon": "school",
  "description": "Blog usage tutorials"
}
```

**Field Description:**
| Field | Description |
|-------|-------------|
| `id` | Unique identifier, recommend lowercase English |
| `name` | Category display name |
| `icon` | Material Icons name, reference [Material Symbols](https://fonts.google.com/icons) |
| `description` | Category description, displayed in sidebar |

#### Adding a Collection

1. Edit the `data/collections.json` file
2. Same format as categories:

```json
{
  "id": "blog-guide",
  "name": "Blog Guide",
  "icon": "menu_book",
  "description": "How to use this blog system"
}
```

**Notes:**
- No need to run scripts after adding, just refresh the webpage
- Ensure `id` is unique, don't duplicate existing categories/collections
- Articles link to categories/collections via `category` and `collection` fields

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
