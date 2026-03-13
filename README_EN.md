# MISTISLE Blog

A personal blog focused on design philosophy, technology practices, and deep thinking.

## Features

- 🎨 Minimalist and modern design
- 📱 Responsive layout for all devices
- 🏷️ Article categories
- ⚡ Pure static website for fast loading

## Project Structure

```text
blog/
├── index.html              # Homepage
├── pages/                  # Pages directory
│   └── post.html           # Article detail page
├── assets/                 # Static assets
│   ├── css/
│   │   └── style.css       # Stylesheet
│   ├── js/
│   │   └── main.js         # Main JavaScript logic
│   ├── Island_With_Tree.svg
│   └── Easter_Island.svg
├── data/                   # Data files
│   └── posts.json          # Posts data
├── scripts/                # Scripts directory
│   └── generate_posts.py   # Article generation script
├── posts/                  # Markdown articles directory
│   └── example.md
├── CNAME                   # Custom domain configuration
├── README.md               # Chinese documentation
└── README_EN.md            # English documentation
```

## Configuration Files

### CNAME

Used to configure a custom domain. The file content is the domain address, e.g.:

```text
mistisle.com
```

After deploying to GitHub Pages, the blog will be accessible via this domain.

## Quick Start

### Run Locally

This blog loads data using `fetch()`.
You must serve it over HTTP;
opening HTML files directly will not work.

Run one of the commands below in the project root:

```bash
# Python (recommended)
python3 -m http.server 8000
```

or:

```bash
# Node.js
npx serve
```

Then open `http://localhost:8000` in your browser.

### Adding a New Article

1. **Create Markdown File**

   Create a new `.md` file in the `posts/` directory.
   Use an English filename, e.g., `my-article.md`.

2. **Add Frontmatter Metadata**

   Add the following format at the beginning of the file
   (note: space after field names):

   ```markdown
   ---
   title: Article Title
   subtitle: Article Subtitle
   date: 2026年3月9日
   category: Category Name
   collection: Collection Name
   excerpt: Article excerpt shown under the title area on post page
   heroImage: https://example.com/image.jpg
   ---

   Article content supports Markdown syntax...
   ```

   **Field Description:**

   | Field | Required | Description |
   | --- | --- | --- |
   | `title` | ✅ | Article title |
   | `subtitle` | ❌ | Subtitle shown in metadata (between date and category) |
   | `date` | ✅ | Publish date, e.g. `2026年3月9日` |
   | `category` | ✅ | Category name |
   | `excerpt` | ❌ | Article abstract shown in the post header area |
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
   - Whether category name is correct
   - Whether there are any error messages when running the script

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
