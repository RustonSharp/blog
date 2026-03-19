import { fetchPosts, getPostLabels, getPostPath, isValidSlug, normalizePost } from './shared.js';

export async function renderHomePage() {
    const container = document.getElementById('posts-container');
    const summaryEl = document.getElementById('home-terminal-summary');
    if (!container) return;

    const allPosts = await fetchPosts();
    container.textContent = '';
    if (summaryEl) summaryEl.textContent = `total entries: ${allPosts.length}`;

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
        meta.textContent = `${post.date} — ${getPostLabels(post)}${post.collection ? ` · ${post.collection}` : ''}`;

        card.appendChild(link);
        card.appendChild(meta);
        container.appendChild(card);
    });
}
