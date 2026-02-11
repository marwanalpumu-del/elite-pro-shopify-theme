/*
  Elite Pro - Performance Engine
  Core Features: Custom Cursor, Preloader, Scroll Reveal, Header Scroll
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader Logic
    const preloader = document.getElementById('Preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }, 1000); // 1s delay for luxury feel
        });
    }

    // 2. Custom Cursor Logic (Only for Desktop)
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Expand cursor on hoverable elements
        const hoverables = document.querySelectorAll('a, button, .elite-pro-card, [data-cursor-expand]');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2.5)');
            el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
        });
    }

    // 3. Scroll Reveal System
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

    // 4. Header Scroll Effect
    const header = document.getElementById('EliteHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    });

});
