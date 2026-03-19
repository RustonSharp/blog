import { createTopControls, injectFavicon, applyStoredTheme, hydratePostPage } from './shared.js';
import { renderHomePage } from './home.js';

document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();
    injectFavicon();
    createTopControls();
    renderHomePage();
    hydratePostPage();
});
