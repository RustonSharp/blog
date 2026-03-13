// main.js - Client-side dynamic blog rendering logic

/**
 * Get base path for assets/data - differs when page is in pages/ subdir vs root
 */
function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
}

/**
 * Get path to index.html - for links back to homepage
 */
function getIndexPath() {
    return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

/**
 * Get path to post.html - for links to article detail
 */
function getPostPath() {
    return window.location.pathname.includes('/pages/') ? 'post.html' : 'pages/post.html';
}

/**
 * Basic slug validation for post IDs from URL/query/data.
 */
function isValidSlug(value) {
    return typeof value === 'string' && /^[a-z0-9-]+$/i.test(value);
}

/**
 * Only allow markdown file names under posts/ without path traversal.
 */
function isSafePostFile(value) {
    return typeof value === 'string' && /^[a-z0-9._-]+\.md$/i.test(value) && !value.includes('/') && !value.includes('\\') && !value.includes('..');
}

/**
 * Normalize post shape to avoid runtime surprises from malformed JSON.
 */
function normalizePost(rawPost) {
    const post = rawPost && typeof rawPost === 'object' ? rawPost : {};
    return {
        id: typeof post.id === 'string' ? post.id.trim() : '',
        title: typeof post.title === 'string' ? post.title.trim() : '',
        subtitle: typeof post.subtitle === 'string' ? post.subtitle.trim() : '',
        date: typeof post.date === 'string' ? post.date.trim() : '',
        category: typeof post.category === 'string' ? post.category.trim() : '',
        collection: typeof post.collection === 'string' ? post.collection.trim() : '',
        excerpt: typeof post.excerpt === 'string' ? post.excerpt.trim() : '',
        file: typeof post.file === 'string' ? post.file.trim() : ''
    };
}

/**
 * Remove frontmatter block from markdown before parsing.
 */
function stripFrontmatter(markdown) {
    if (!markdown.startsWith('---')) return markdown;
    const endIdx = markdown.indexOf('\n---', 3);
    return endIdx !== -1 ? markdown.substring(endIdx + 4).trim() : markdown;
}

/**
 * Very small HTML sanitizer for marked output.
 * Removes dangerous tags, event attrs and javascript: URLs.
 */
function sanitizeHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    template.content.querySelectorAll('script, iframe, object, embed, form, input, button, textarea, select, link, meta, style').forEach((node) => {
        node.remove();
    });

    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
        const el = walker.currentNode;
        for (const attr of Array.from(el.attributes)) {
            const name = attr.name.toLowerCase();
            const value = (attr.value || '').trim().toLowerCase();

            if (name.startsWith('on')) {
                el.removeAttribute(attr.name);
                continue;
            }

            if ((name === 'href' || name === 'src' || name === 'xlink:href') && value.startsWith('javascript:')) {
                el.removeAttribute(attr.name);
            }
        }
    }

    return template.innerHTML;
}

/**
 * Render a centered status block without using innerHTML.
 */
function renderStatusMessage(container, message, showBackLink = false) {
    if (!container) return;
    container.textContent = '';

    const wrapper = document.createElement('div');
    wrapper.style.textAlign = 'center';
    wrapper.style.padding = '4rem 0';

    const p = document.createElement('p');
    p.className = 'text-secondary mb-4';
    p.textContent = message;
    wrapper.appendChild(p);

    if (showBackLink) {
        const link = document.createElement('a');
        link.href = getIndexPath();
        link.className = 'btn btn-primary';
        link.textContent = '返回首页';
        wrapper.appendChild(link);
    }

    container.appendChild(wrapper);
}

/**
 * Keep footer copyright year in sync with current year.
 */
function updateFooterYear() {
    const footerEls = document.querySelectorAll('.footer-text');
    if (!footerEls.length) return;
    const year = new Date().getFullYear();
    footerEls.forEach((el) => {
        el.textContent = `© ${year} · 版权所有`;
    });
}

/**
 * Dynamically inject favicon (only if Easter_Island.svg exists in assets/)
 */
function injectFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = getBasePath() + 'assets/Easter_Island.svg';
    document.head.appendChild(link);
}

/**
 * Fetch and return the list of posts from data/posts.json
 */
async function fetchPosts() {
    try {
        const response = await fetch(getBasePath() + 'data/posts.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading posts:", error);
        return [];
    }
}

/**
 * Render the post list on the homepage
 */
async function renderHomePage() {
    const container = document.getElementById('posts-container');
    if (!container) return; // Not on the homepage

    const allPosts = await fetchPosts();
    container.textContent = '';

    if (allPosts.length === 0) {
        const emptyEl = document.createElement('p');
        emptyEl.className = 'empty-text';
        emptyEl.textContent = '没有找到相关文章。';
        container.appendChild(emptyEl);
        return;
    }

    allPosts.forEach((rawPost) => {
        const post = normalizePost(rawPost);
        if (!post.title || !isValidSlug(post.id)) return;

        const card = document.createElement('article');
        card.className = 'article-card';

        const link = document.createElement('a');
        link.className = 'article-link';
        link.href = `${getPostPath()}?id=${encodeURIComponent(post.id)}`;

        const title = document.createElement('h2');
        title.className = 'article-title';
        title.textContent = post.title;
        link.appendChild(title);

        const meta = document.createElement('p');
        meta.className = 'article-meta-line';
        const category = post.category || '未分类';
        meta.textContent = `${post.date} — ${category}${post.collection ? ` · ${post.collection}` : ''}`;

        card.appendChild(link);
        card.appendChild(meta);
        container.appendChild(card);
    });
}

/**
 * Fetch markdown content and render it on the post detail page
 */
async function renderPostPage() {
    // 1. Get the post ID from the URL parameters
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    // We expect the elements to be present in post.html
    const titleEl = document.getElementById('post-title');
    const subtitleEl = document.getElementById('post-subtitle');
    const excerptEl = document.getElementById('post-excerpt');
    const contentEl = document.getElementById('post-content');
    const dateEl = document.getElementById('post-date');
    const categoryEl = document.getElementById('post-category');
    const metaEl = document.getElementById('post-meta');
    const metaSep1 = document.getElementById('post-meta-sep-1');
    const metaSep2 = document.getElementById('post-meta-sep-2');

    if (!postId || !contentEl) return; // Not on a valid post page

    if (!isValidSlug(postId)) {
        document.title = '404 未找到 | MISTISLE';
        if (titleEl) titleEl.textContent = 'Oops! 找不到该文章';
        if (excerptEl) excerptEl.style.display = 'none';
        if (metaEl) metaEl.style.display = 'none';
        renderStatusMessage(contentEl, '文章参数无效。', true);
        return;
    }

    const posts = await fetchPosts();
    const currentPost = posts.map(normalizePost).find((p) => p.id === postId);

    if (!currentPost) {
        document.title = "404 未找到 | MISTISLE";
        if (titleEl) titleEl.textContent = "Oops! 找不到该文章";
        if (excerptEl) excerptEl.style.display = 'none';
        if (metaEl) metaEl.style.display = 'none';
        renderStatusMessage(contentEl, '这篇文章可能已经被移动或删除。', true);
        return;
    }

    if (!isSafePostFile(currentPost.file)) {
        document.title = "404 未找到 | MISTISLE";
        if (titleEl) titleEl.textContent = "Oops! 找不到该文章";
        if (excerptEl) excerptEl.style.display = 'none';
        if (metaEl) metaEl.style.display = 'none';
        renderStatusMessage(contentEl, '文章资源路径不合法。', true);
        return;
    }

    // 2. Populate metadata
    document.title = `${currentPost.title} | MISTISLE`;
    if (titleEl) titleEl.textContent = currentPost.title;
    if (subtitleEl) {
        if (currentPost.subtitle) {
            subtitleEl.textContent = currentPost.subtitle;
            subtitleEl.style.display = '';
            if (metaSep1) metaSep1.style.display = '';
            if (metaSep2) metaSep2.style.display = '';
        } else {
            subtitleEl.style.display = 'none';
            if (metaSep1) metaSep1.style.display = 'none';
            if (metaSep2) metaSep2.style.display = 'none';
        }
    }
    if (dateEl) dateEl.textContent = currentPost.date || '未知日期';
    if (categoryEl) categoryEl.textContent = currentPost.category || '未分类';
    if (excerptEl) {
        if (currentPost.excerpt) {
            excerptEl.innerHTML = '';
            const label = document.createElement('p');
            label.className = 'post-excerpt-label';
            label.textContent = '摘要';
            const text = document.createElement('p');
            text.className = 'post-excerpt-text';
            text.textContent = currentPost.excerpt;
            excerptEl.appendChild(label);
            excerptEl.appendChild(text);
            excerptEl.style.display = 'block';
        } else {
            excerptEl.style.display = 'none';
        }
    }

    // 3. Fetch and render Markdown
    try {
        const response = await fetch(getBasePath() + `posts/${currentPost.file}`);
        if (!response.ok) throw new Error("Failed to fetch markdown file");

        let markdown = await response.text();
        markdown = stripFrontmatter(markdown);

        // Use marked.js to parse the markdown (must be included in the HTML)
        if (typeof marked !== 'undefined') {
            const parsedHtml = marked.parse(markdown);
            contentEl.innerHTML = sanitizeHtml(parsedHtml);

            // Render Typst/LaTeX math with KaTeX ($ inline, $$ block)
            if (typeof renderMathInElement === 'function') {
                renderMathInElement(contentEl, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true }
                    ],
                    throwOnError: false
                });
            }
        } else {
            console.error("marked.js is not loaded.");
            renderStatusMessage(contentEl, 'Markdown 解析器未加载。');
        }
    } catch (error) {
        console.error("Error loading markdown:", error);
        renderStatusMessage(contentEl, '加载文章内容时出现错误。', true);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    injectFavicon();
    updateFooterYear();
    renderHomePage();
    renderPostPage();
});
