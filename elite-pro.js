/**
 * Elite Pro Shopify Theme JavaScript
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Loader
    const loader = document.getElementById('preloader');
    if(loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 1000);
        });
    }

    // 2. Elite Cursor
    const cursor = document.querySelector('.custom-cursor');
    document.addEventListener('mousemove', (e) => {
        if(cursor) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }
    });

    console.log('Elite Pro Shopify Theme Loaded Successfully');
});
