/**
 * Elite Pro - Cinematic Shopify Theme Logic
 * Version: 1.0.0
 * Features: Interactive Cursor, Scroll Reveal, AJAX Add to Cart, Sticky Header.
 */

class EliteProTheme {
    constructor() {
        this.init();
    }

    init() {
        this.loader();
        this.customCursor();
        this.scrollReveal();
        this.stickyHeader();
        this.imageParallax();
        console.log('✨ Elite Pro: Cinematic Experience Initialized');
    }

    // 1. Loader with Smooth Fade-Out Effect
    loader() {
        const loader = document.getElementById('preloader');
        if (loader) {
            window.addEventListener('load', () => {
                loader.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 800);
            });
        }
    }

    // 2. Premium Cursor Interaction Logic
    customCursor() {
        const cursor = document.querySelector('.custom-cursor');
        if (!cursor || window.matchMedia("(max-width: 1024px)").matches) return;

        document.addEventListener('mousemove', (e) => {
            // Use requestAnimationFrame for high-performance 60fps rendering
            requestAnimationFrame(() => {
                cursor.style.left = `${e.clientX}px`;
                cursor.style.top = `${e.clientY}px`;
            });
        });

        // Expand cursor on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .product-card, .btn-elite');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-active'));
        });
    }

    // 3. Modern Scroll Reveal (Intersection Observer API)
    scrollReveal() {
        const revealOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Stop observing once the element is revealed to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }

    // 4. Sticky Header Visibility Logic
    stickyHeader() {
        const header = document.getElementById('EliteHeader');
        if (!header) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // 5. Hero Title Parallax Depth Effect
    imageParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.hero-main-title');
            parallaxElements.forEach(el => {
                const speed = 0.3;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

// Initialize Theme on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    new EliteProTheme();
});
