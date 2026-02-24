document.addEventListener('DOMContentLoaded', () => {
    // 1. On page load, apply the 'enter' class immediately to trigger the entry animation
    document.body.classList.add('page-transition-enter');

    // Briefly delay adding the 'active' class so the browser has time to register the initial state
    setTimeout(() => {
        document.body.classList.add('page-transition-enter-active');
    }, 10);

    // 2. Intercept internal link clicks to trigger the exit animation before navigating
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = link.getAttribute('target');

            // Ignore external links (like social media with target="_blank"), empty links, or pure anchor links on the same page
            if (
                target === '_blank' ||
                !href ||
                href.startsWith('#') ||
                href.startsWith('http') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:')
            ) {
                return;
            }

            // It's an internal page navigation (e.g., 'about.html')
            e.preventDefault();

            // Check if it's an anchor link to index.html (like index.html#features)
            // If we are currently ON index.html, just let it scroll smoothly (don't transition)
            const isIndexHashLink = href.includes('index.html#');
            const isOnIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

            if (isIndexHashLink && isOnIndexPage) {
                const hash = href.split('#')[1];
                const element = document.getElementById(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                return;
            }

            // Trigger the exit animation by removing the enter-active class and adding the exit class
            document.body.classList.remove('page-transition-enter-active');
            document.body.classList.add('page-transition-exit');

            // Wait for the animation to finish (e.g., 300ms) before actually setting window.location
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});
