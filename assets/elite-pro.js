/**
 * Elite Pro - Premium Theme Engine
 * -----------------------------------------------------------------------------
 * This architecture follows ES6 Class standards for modularity and performance.
 * Features: AJAX Cart, Predictive Search, Intersection Observer, Custom Cursor.
 *
 * @namespace EliteTheme
 */

class EliteTheme {
  constructor() {
    this.init();
  }

  /**
   * Initializes all core theme modules
   */
  init() {
    this.initPreloader();
    this.initScrollReveal();
    this.initStickyHeader();
    this.initCustomCursor();
    this.initPredictiveSearch();
    this.initAjaxCart();
    this.initProductGallery();

    console.log("💎 Elite Pro Engine: Systems Operational");
  }

  /**
   * 1. Preloader Logic
   * Handles smooth entrance animation and DOM removal
   */
  initPreloader() {
    const preloader = document.getElementById('Preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
            document.body.classList.add('dom-loaded');
          }, 600);
        }, 800);
      });
    }
  }

  /**
   * 2. Cinematic Scroll Reveal
   * Uses Intersection Observer API for high-performance entrance animations
   */
  initScrollReveal() {
    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px' 
    };
    
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

  /**
   * 3. Sticky Header Animation
   * Toggles classes based on scroll depth for glassmorphism effects
   */
  initStickyHeader() {
    const header = document.getElementById('EliteHeader');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
      const isScrolled = window.pageYOffset > 50;
      header.classList.toggle('is-scrolled', isScrolled);
    }, { passive: true });
  }

  /**
   * 4. Custom Cinematic Cursor
   * Optimized mouse tracking with requestAnimationFrame
   */
  initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    // Disable on touch devices for accessibility
    if (!cursor || ('ontouchstart' in window)) return;

    document.addEventListener('mousemove', (e) => {
      requestAnimationFrame(() => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });
    });

    const hoverSelectors = 'a, button, [data-cursor-expand], .btn-elite, .nav-link';
    document.querySelectorAll(hoverSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  /**
   * 5. Predictive AJAX Search
   * Fetches product suggestions via Shopify Search API (JSON)
   */
  initPredictiveSearch() {
    const searchInput = document.querySelector('input[name="q"]');
    const resultsContainer = document.querySelector('#predictive-search-results');
    
    if (!searchInput || !resultsContainer) return;

    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();

      if (query.length < 3) {
        resultsContainer.style.display = 'none';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`${window.routes.predictive_search_url}?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=4`)
          .then(res => res.json())
          .then(data => {
            const products = data.resources.results.products;
            this.renderSearchResults(products, resultsContainer);
          })
          .catch(err => console.error("Predictive Search Error:", err));
      }, 300);
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
        resultsContainer.style.display = 'none';
      }
    });
  }

  renderSearchResults(products, container) {
    if (!products || products.length === 0) {
      container.style.display = 'none';
      return;
    }

    let html = '<div class="predictive-search-list">';
    products.forEach(product => {
      html += `
        <a href="${product.url}" class="predictive-item">
          <img src="${product.image}" alt="${product.title}" width="50" height="50">
          <div class="predictive-info">
            <span class="title">${product.title}</span>
            <span class="price gold-text">${product.price}</span>
          </div>
        </a>
      `;
    });
    html += '</div>';
    
    container.innerHTML = html;
    container.style.display = 'block';
  }

  /**
   * 6. AJAX Quick Add
   * Submits form data to Shopify Cart API without page reload
   */
  initAjaxCart() {
    document.querySelectorAll('.quick-add-form, .elite-product-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[name="add"]');
        if (!submitBtn || submitBtn.classList.contains('loading')) return;

        submitBtn.classList.add('loading');
        const formData = new FormData(form);

        try {
          const response = await fetch(`${window.routes.cart_add_url}.js`, {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          });
          
          if (response.ok) {
            this.updateCartCounter();
            const originalLabel = submitBtn.innerHTML;
            submitBtn.innerHTML = 'ADDED ✨';
            
            setTimeout(() => {
               submitBtn.innerHTML = originalLabel;
               submitBtn.classList.remove('loading');
            }, 2000);
          }
        } catch (err) {
          console.error('AJAX Cart Error:', err);
          submitBtn.classList.remove('loading');
        }
      });
    });
  }

  /**
   * 7. Product Gallery Logic
   * Smoothly transitions main product images on thumbnail interaction
   */
  initProductGallery() {
    window.updateProductImage = (src, element, sectionId) => {
      const mainImg = document.getElementById(`MainProductImage-${sectionId}`);
      if (!mainImg) return;
      
      mainImg.style.opacity = '0.4';
      const newImg = new Image();
      newImg.src = src;
      newImg.onload = () => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      };

      const thumbsWrapper = element.closest('.thumbnails-grid');
      if (thumbsWrapper) {
        thumbsWrapper.querySelectorAll('.thumb-item').forEach(item => item.classList.remove('active'));
        element.classList.add('active');
      }
    };
  }

  /**
   * Global Cart Counter Sync
   */
  async updateCartCounter() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('#CartCount').forEach(el => {
        el.textContent = `[${cart.item_count}]`;
      });
    } catch (e) {
      console.warn('Cart Sync Failed');
    }
  }
}

// Initialize Theme Engine on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  window.EliteEngine = new EliteTheme();
});
