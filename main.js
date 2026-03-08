// main.js - Client-side dynamic blog rendering logic

/**
 * Fetch and return the list of posts from posts.json
 */
async function fetchPosts() {
    try {
        const response = await fetch('./posts.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading posts:", error);
        return [];
    }
}

const POSTS_PER_PAGE = 2; // Set to 2 to demonstrate pagination with 4 posts

/**
 * Setup navigation links based on categories
 */
function renderCategoriesSidebar(posts) {
    const categoriesContainer = document.querySelector('.widget-categories .categories-list');
    if (!categoriesContainer) return;

    // Extract unique categories and counts
    const counts = {};
    posts.forEach(p => {
        const cat = p.category || '未分类';
        counts[cat] = (counts[cat] || 0) + 1;
    });

    categoriesContainer.innerHTML = Object.keys(counts).map(cat => `
        <li><a href="index.html?category=${encodeURIComponent(cat)}" class="category-link">${cat} <span>${counts[cat]}</span></a></li>
    `).join('');
}

/**
 * Render the post list on the homepage
 */
async function renderHomePage() {
    const container = document.getElementById('posts-container');
    if (!container) return; // Not on the homepage

    const allPosts = await fetchPosts();
    renderCategoriesSidebar(allPosts);

    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const categoryFilter = params.get('category');
    let currentPage = parseInt(params.get('page')) || 1;

    // Filter posts
    let filteredPosts = allPosts;
    if (categoryFilter) {
        filteredPosts = allPosts.filter(p => p.category === categoryFilter);
        // Optionally update a page title to show the filter
        const headerTitle = document.querySelector('h2.section-title');
        if (headerTitle) headerTitle.textContent = `分类：${categoryFilter}`;
    }

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

    if (paginatedPosts.length === 0) {
        container.innerHTML = '<p class="text-secondary">没有找到相关文章。</p>';
        updatePaginationUI(0, 0, categoryFilter);
        return;
    }

    const postsHtml = paginatedPosts.map(post => `
        <article class="article-card">
            <div class="article-meta">
                <time class="article-date">${post.date}</time>
                <span class="mx-2">•</span>
                <span class="article-category"><a href="index.html?category=${encodeURIComponent(post.category || '未分类')}">${post.category || '未分类'}</a></span>
            </div>
            <h3 class="article-title"><a href="post.html?id=${post.id}">${post.title}</a></h3>
            <p class="article-excerpt">${post.excerpt}</p>
            <a href="post.html?id=${post.id}" class="article-read-more">阅读文章 <span class="material-icons ml-1">arrow_forward</span></a>
        </article>
    `).join('');

    container.innerHTML = postsHtml;
    updatePaginationUI(currentPage, totalPages, categoryFilter);
}

function updatePaginationUI(currentPage, totalPages, categoryParam) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    const catQuery = categoryParam ? `&category=${encodeURIComponent(categoryParam)}` : '';

    const prevBtn = paginationContainer.querySelector('.btn-outline:first-child');
    const nextBtn = paginationContainer.querySelector('.btn-outline:last-child');

    // Update Previous
    if (currentPage > 1) {
        prevBtn.disabled = false;
        prevBtn.onclick = () => window.location.href = `index.html?page=${currentPage - 1}${catQuery}`;
    } else {
        prevBtn.disabled = true;
        prevBtn.onclick = null;
    }

    // Update Next
    if (currentPage < totalPages) {
        nextBtn.disabled = false;
        nextBtn.onclick = () => window.location.href = `index.html?page=${currentPage + 1}${catQuery}`;
    } else {
        nextBtn.disabled = true;
        nextBtn.onclick = null;
    }
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
    const contentEl = document.getElementById('post-content');
    const heroEl = document.getElementById('post-hero');
    const dateEl = document.getElementById('post-date');
    const readTimeEl = document.getElementById('post-readtime');
    const wordCountEl = document.getElementById('post-wordcount');

    if (!postId || !contentEl) return; // Not on a valid post page

    const posts = await fetchPosts();
    const currentPost = posts.find(p => p.id === postId);

    if (!currentPost) {
        document.title = "404 未找到 | Mist Isle";
        titleEl.textContent = "Oops! 找不到该文章";
        contentEl.innerHTML = `
            <div style="text-align: center; padding: 4rem 0;">
                <p class="text-secondary mb-4">这篇文章可能已经被移动或删除。</p>
                <a href="index.html" class="btn btn-primary">返回首页</a>
            </div>
        `;
        if (heroEl) heroEl.style.display = 'none';
        return;
    }

    // 2. Populate metadata
    document.title = `${currentPost.title} | Mist Isle`;
    if (titleEl) titleEl.textContent = currentPost.title;
    if (dateEl) dateEl.textContent = currentPost.date;
    if (readTimeEl) readTimeEl.textContent = `阅读需 ${currentPost.readTime}`;
    if (wordCountEl) wordCountEl.textContent = currentPost.wordCount;
    if (heroEl && currentPost.heroImage) {
        heroEl.style.backgroundImage = `url('${currentPost.heroImage}')`;
    }

    // 3. Setup Next/Prev Navigation
    setupPostNavigation(posts, currentPost);

    // 4. Fetch and render Markdown
    try {
        const response = await fetch(`./posts/${currentPost.file}`);
        if (!response.ok) throw new Error("Failed to fetch markdown file");

        let markdown = await response.text();

        // Strip YAML frontmatter if present
        if (markdown.startsWith('---')) {
            const endIdx = markdown.indexOf('\n---', 3);
            if (endIdx !== -1) {
                markdown = markdown.substring(endIdx + 4).trim();
            }
        }

        // Use marked.js to parse the markdown (must be included in the HTML)
        if (typeof marked !== 'undefined') {
            contentEl.innerHTML = marked.parse(markdown);

            // Execute syntax highlighting
            if (typeof hljs !== 'undefined') {
                document.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }

            // Execute medium zoom for images
            if (typeof mediumZoom !== 'undefined') {
                mediumZoom('#post-content img', {
                    margin: 24,
                    background: getComputedStyle(document.body).getPropertyValue('--color-bg-alt') || '#f9f9f9'
                });
            }
        } else {
            console.error("marked.js is not loaded.");
            contentEl.innerHTML = "<p>Error: Markdown parser not loaded.</p>";
        }
    } catch (error) {
        console.error("Error loading markdown:", error);
        contentEl.innerHTML = `
            <div style="text-align: center; padding: 4rem 0;">
                <p class="text-secondary mb-4">加载文章内容时出现错误。</p>
                <a href="index.html" class="btn btn-primary">返回首页</a>
            </div>
        `;
    }
}

/**
 * Setup Previous/Next links at the bottom of the post
 */
function setupPostNavigation(posts, currentPost) {
    const currentIndex = posts.findIndex(p => p.id === currentPost.id);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const navContainer = document.getElementById('post-navigation-container');
    if (!navContainer) return;

    let navHtml = '';

    if (nextPost) {
        navHtml += `
            <a href="post.html?id=${nextPost.id}" class="post-nav-card">
                <div class="nav-card-label">
                    <span class="material-icons">arrow_back</span>
                    <span class="mx-2">•</span>
                    <span class="material-icons">description</span>
                    <span>${nextPost.wordCount}</span> 上一篇
                </div>
                <h4 class="nav-card-title">${nextPost.title}</h4>
            </a>
        `;
    } else {
        navHtml += `<div class="post-nav-card" style="visibility: hidden;"></div>`;
    }

    if (prevPost) {
        navHtml += `
            <a href="post.html?id=${prevPost.id}" class="post-nav-card text-right">
                <div class="nav-card-label">
                    下一篇
                    <span class="mx-2">•</span>
                    <span class="material-icons">description</span>
                    <span>${prevPost.wordCount}</span>
                    <span class="material-icons ml-1">arrow_forward</span>
                </div>
                <h4 class="nav-card-title">${prevPost.title}</h4>
            </a>
        `;
    } else {
        navHtml += `<div class="post-nav-card text-right" style="visibility: hidden;"></div>`;
    }

    navContainer.innerHTML = navHtml;
}

/**
 * Setup Web Share API for the share button
 */
function setupShareButton() {
    const shareBtns = document.querySelectorAll('button[aria-label="Share"]');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const shareData = {
                title: document.title,
                url: window.location.href
            };
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error("Error sharing:", err);
                }
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(window.location.href);
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<span class="material-icons" style="color: var(--color-primary)">check</span>';
                setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
            }
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Add logic to fix header links
    const articleLinks = document.querySelectorAll('nav a[href="#"]');
    articleLinks.forEach(link => {
        if (link.textContent === '文章') link.href = 'index.html';
        if (link.textContent === '合集') link.href = 'index.html#collections';
        if (link.textContent === '关于') link.href = 'index.html#about';
    });

    setupShareButton();
    renderHomePage();
    renderPostPage();
});
