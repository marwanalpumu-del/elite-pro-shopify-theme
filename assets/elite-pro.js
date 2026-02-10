/**
 * Elite Pro - Ultimate Theme Engine (Full Version)
 * Optimized for Shopify Performance & High Conversion
 */

class EliteTheme {
  constructor() {
    this.initPreloader();
    this.initReveal();
    this.initHeader();
    this.initCustomCursor();
    this.initPredictiveSearch();
    this.initQuickAdd();
    this.initProductGallery();
  }

  // 1. Preloader Logic
  initPreloader() {
    const preloader = document.getElementById('Preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          setTimeout(() => preloader.style.display = 'none', 600);
          document.body.classList.add('loaded');
        }, 800);
      });
    }
  }

  // 2. Cinematic Scroll Reveal (Intersection Observer)
  initReveal() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-item').forEach(el => revealObserver.observe(el));
  }

  // 3. Header Animation on Scroll
  initHeader() {
    const header = document.getElementById('EliteHeader');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // 4. Custom Cinematic Cursor
  initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor || ('ontouchstart' in window)) return;

    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
    });

    document.querySelectorAll('a, button, [data-cursor-expand]').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  // 5. Predictive AJAX Search
  initPredictiveSearch() {
    const searchInput = document.querySelector('input[name="q"]');
    const resultsContainer = document.querySelector('#predictive-search-results');
    
    if (!searchInput || !resultsContainer) return;

    let timeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(timeout);
      const searchTerm = searchInput.value.trim();

      if (!searchTerm) {
        resultsContainer.style.display = 'none';
        return;
      }

      timeout = setTimeout(() => {
        fetch(`/search/suggest.json?q=${searchTerm}&resources[type]=product&resources[limit]=4&section_id=predictive-search`)
          .then(res => res.text())
          .then(text => {
            const html = new DOMParser().parseFromString(text, 'text/html');
            const resultsHtml = html.querySelector('#shopify-section-predictive-search');
            if (resultsHtml) {
              resultsContainer.innerHTML = resultsHtml.innerHTML;
              resultsContainer.style.display = 'block';
            }
          });
      }, 300);
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.style.display = 'none';
      }
    });
  }

  // 6. AJAX Quick Add to Cart
  initQuickAdd() {
    document.querySelectorAll('.quick-add-form, .elite-product-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[name="add"]');
        if (submitBtn.classList.contains('loading')) return;

        submitBtn.classList.add('loading');
        const formData = new FormData(form);

        try {
          const response = await fetch(window.routes.cart_add_url + '.js', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            this.updateCartCounter();
            // Dispatch a custom event for other components to react
            document.dispatchEvent(new CustomEvent('cart:item-added'));
            submitBtn.innerHTML = 'ADDED ✨';
            setTimeout(() => submitBtn.innerHTML = 'ADD TO BAG', 2000);
          }
        } catch (err) {
          console.error('Add to cart failed:', err);
        } finally {
          submitBtn.classList.remove('loading');
        }
      });
    });
  }

  // 7. Dynamic Product Gallery Switcher
  initProductGallery() {
    window.updateProductImage = (src, element, sectionId) => {
      const mainImg = document.getElementById(`MainProductImage-${sectionId}`);
      if (!mainImg) return;
      
      mainImg.style.opacity = '0.3';
      const newImg = new Image();
      newImg.src = src;
      newImg.onload = () => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      };

      // Handle thumbnail active state
      element.closest('.thumbnails-grid').querySelectorAll('.thumb-item').forEach(item => {
        item.classList.remove('active');
      });
      element.classList.add('active');
    };
  }

  // Helper: Update Cart Count globally
  async updateCartCounter() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('#CartCount').forEach(el => {
        el.textContent = `[${cart.item_count}]`;
      });
    } catch (e) {
      console.warn('Could not update cart count');
    }
  }
}

// 8. Launch Engine
document.addEventListener('DOMContentLoaded', () => {
  window.EliteEngine = new EliteTheme();
});
