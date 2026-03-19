const THEME_STORAGE_KEY = 'mistisle-theme';
let themeSwitchEl = null;

function getBasePath() {
    return window.location.pathname.includes('/pages/') ? '../' : './';
}

function getIndexPath() {
    return window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
}

export function getPostPath() {
    return window.location.pathname.includes('/pages/') ? 'post.html' : 'pages/post.html';
}

export function applyStoredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function getCurrentTheme() {
    const explicitTheme = document.documentElement.getAttribute('data-theme');
    if (explicitTheme === 'light' || explicitTheme === 'dark') return explicitTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncThemeSwitchState() {
    if (!themeSwitchEl) return;
    const isDark = getCurrentTheme() === 'dark';
    themeSwitchEl.setAttribute('aria-checked', isDark ? 'true' : 'false');
    themeSwitchEl.setAttribute('title', isDark ? '当前深色主题，点击切换浅色' : '当前浅色主题，点击切换深色');
}

function toggleBlackWhiteTheme() {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    syncThemeSwitchState();
}

export function isValidSlug(value) {
    return typeof value === 'string' && /^[a-z0-9-]+$/i.test(value);
}

export function isSafePostFile(value) {
    return typeof value === 'string' && /^[a-z0-9._-]+\.md$/i.test(value) && !value.includes('/') && !value.includes('\\') && !value.includes('..');
}

export function normalizePost(rawPost) {
    const post = rawPost && typeof rawPost === 'object' ? rawPost : {};
    const normalizedTags = Array.isArray(post.tags)
        ? post.tags
            .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
            .filter((tag, index, arr) => tag && arr.indexOf(tag) === index)
        : [];

    return {
        id: typeof post.id === 'string' ? post.id.trim() : '',
        title: typeof post.title === 'string' ? post.title.trim() : '',
        subtitle: typeof post.subtitle === 'string' ? post.subtitle.trim() : '',
        date: typeof post.date === 'string' ? post.date.trim() : '',
        category: typeof post.category === 'string' ? post.category.trim() : '',
        tags: normalizedTags,
        collection: typeof post.collection === 'string' ? post.collection.trim() : '',
        excerpt: typeof post.excerpt === 'string' ? post.excerpt.trim() : '',
        file: typeof post.file === 'string' ? post.file.trim() : ''
    };
}

export function getPostLabels(post) {
    const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];
    if (tags.length > 0) return `#${tags.join(' #')}`;
    return post.category || '未分类';
}

function stripFrontmatter(markdown) {
    if (!markdown.startsWith('---')) return markdown;
    const endIdx = markdown.indexOf('\n---', 3);
    return endIdx !== -1 ? markdown.substring(endIdx + 4).trim() : markdown;
}

function sanitizeHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    template.content.querySelectorAll('script, iframe, object, embed, form, input, button, textarea, select, link, meta, style').forEach((node) => {
        node.remove();
    });

    const isSafeUrl = (rawValue) => {
        const value = (rawValue || '').trim();
        if (!value) return true;
        if (value.startsWith('#') || value.startsWith('/')) return true;

        try {
            const parsed = new URL(value, window.location.origin);
            return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    };

    const sanitizeSrcset = (rawValue) => {
        const parts = String(rawValue || '')
            .split(',')
            .map((part) => part.trim())
            .filter(Boolean);

        const safeParts = parts.filter((part) => {
            const [urlCandidate] = part.split(/\s+/, 1);
            return isSafeUrl(urlCandidate);
        });

        return safeParts.join(', ');
    };

    const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
        const el = walker.currentNode;
        for (const attr of Array.from(el.attributes)) {
            const name = attr.name.toLowerCase();
            const value = (attr.value || '').trim();

            if (name.startsWith('on')) {
                el.removeAttribute(attr.name);
                continue;
            }

            if (name === 'srcset') {
                const safeSrcset = sanitizeSrcset(value);
                if (safeSrcset) {
                    el.setAttribute(attr.name, safeSrcset);
                } else {
                    el.removeAttribute(attr.name);
                }
                continue;
            }

            if ((name === 'href' || name === 'src' || name === 'xlink:href') && !isSafeUrl(value)) {
                el.removeAttribute(attr.name);
            }
        }
    }

    return template.innerHTML;
}

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

export function injectFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = getBasePath() + 'assets/Easter_Island.svg';
    document.head.appendChild(link);
}

export function createTopControls() {
    if (!document.body) return;

    if (!document.querySelector('.site-brand-link')) {
        const brandLink = document.createElement('a');
        brandLink.href = getIndexPath();
        brandLink.className = 'site-brand-link';
        brandLink.textContent = 'MISTISLE';
        brandLink.setAttribute('aria-label', '返回首页');
        document.body.appendChild(brandLink);
    }

    if (document.querySelector('.theme-toggle-fixed')) return;

    const themeWrap = document.createElement('div');
    themeWrap.className = 'theme-toggle-fixed';

    const themeSwitch = document.createElement('button');
    themeSwitch.type = 'button';
    themeSwitch.className = 'theme-switch';
    themeSwitch.setAttribute('role', 'switch');
    themeSwitch.setAttribute('aria-label', '切换黑白主题');
    themeSwitch.addEventListener('click', toggleBlackWhiteTheme);

    const switchScene = document.createElement('span');
    switchScene.className = 'theme-switch-scene';

    const switchHalo1 = document.createElement('span');
    switchHalo1.className = 'theme-switch-halo';
    const switchHalo2 = document.createElement('span');
    switchHalo2.className = 'theme-switch-halo';
    const switchOrb = document.createElement('span');
    switchOrb.className = 'theme-switch-orb';
    const crater1 = document.createElement('span');
    crater1.className = 'theme-switch-crater';
    const crater2 = document.createElement('span');
    crater2.className = 'theme-switch-crater';
    const crater3 = document.createElement('span');
    crater3.className = 'theme-switch-crater';
    const switchCloud = document.createElement('span');
    switchCloud.className = 'theme-switch-cloud';
    const switchStars = document.createElement('span');
    switchStars.className = 'theme-switch-stars';
    const star1 = document.createElement('span');
    star1.className = 'theme-switch-star';
    const star2 = document.createElement('span');
    star2.className = 'theme-switch-star';
    const star3 = document.createElement('span');
    star3.className = 'theme-switch-star';

    switchOrb.appendChild(crater1);
    switchOrb.appendChild(crater2);
    switchOrb.appendChild(crater3);
    switchStars.appendChild(star1);
    switchStars.appendChild(star2);
    switchStars.appendChild(star3);
    switchScene.appendChild(switchHalo1);
    switchScene.appendChild(switchHalo2);
    switchScene.appendChild(switchStars);
    switchScene.appendChild(switchCloud);
    switchScene.appendChild(switchOrb);
    themeSwitch.appendChild(switchScene);
    themeWrap.appendChild(themeSwitch);
    document.body.appendChild(themeWrap);

    themeSwitchEl = themeSwitch;
    syncThemeSwitchState();
}

export async function fetchPosts() {
    try {
        const response = await fetch(getBasePath() + 'data/posts.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading posts:', error);
        return [];
    }
}

export async function hydratePostPage() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');

    const titleEl = document.getElementById('post-title');
    const subtitleEl = document.getElementById('post-subtitle');
    const excerptEl = document.getElementById('post-excerpt');
    const contentEl = document.getElementById('post-content');
    const dateEl = document.getElementById('post-date');
    const categoryEl = document.getElementById('post-category');
    const metaEl = document.getElementById('post-meta');
    const metaSep1 = document.getElementById('post-meta-sep-1');
    const metaSep2 = document.getElementById('post-meta-sep-2');

    if (!postId || !contentEl) return;

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
        document.title = '404 未找到 | MISTISLE';
        if (titleEl) titleEl.textContent = 'Oops! 找不到该文章';
        if (excerptEl) excerptEl.style.display = 'none';
        if (metaEl) metaEl.style.display = 'none';
        renderStatusMessage(contentEl, '这篇文章可能已经被移动或删除。', true);
        return;
    }

    if (!isSafePostFile(currentPost.file)) {
        document.title = '404 未找到 | MISTISLE';
        if (titleEl) titleEl.textContent = 'Oops! 找不到该文章';
        if (excerptEl) excerptEl.style.display = 'none';
        if (metaEl) metaEl.style.display = 'none';
        renderStatusMessage(contentEl, '文章资源路径不合法。', true);
        return;
    }

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
    if (categoryEl) categoryEl.textContent = getPostLabels(currentPost);

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

    try {
        const response = await fetch(getBasePath() + `posts/${currentPost.file}`);
        if (!response.ok) throw new Error('Failed to fetch markdown file');

        let markdown = await response.text();
        markdown = stripFrontmatter(markdown);

        if (typeof marked !== 'undefined') {
            const parsedHtml = marked.parse(markdown);
            contentEl.innerHTML = sanitizeHtml(parsedHtml);

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
            console.error('marked.js is not loaded.');
            renderStatusMessage(contentEl, 'Markdown 解析器未加载。');
        }
    } catch (error) {
        console.error('Error loading markdown:', error);
        renderStatusMessage(contentEl, '加载文章内容时出现错误。', true);
    }
}
