document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. HAMBURGER MENU ─────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }


  /* ── 2. SCROLL-TRIGGERED ANIMATIONS ───────────── */
  const animateOnScroll = (selector, delay = 100) => {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(20px)';
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(el);
    });
  };

  // Respect reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    animateOnScroll('.pillar-card', 100);
    animateOnScroll('.roadmap-item', 80);
    animateOnScroll('.tool-card', 80);
    animateOnScroll('.stat-num', 60);
  }


  /* ── 3. ACTIVE NAV LINK HIGHLIGHT ─────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.opacity = '0.75';
          link.removeAttribute('aria-current');
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) {
          activeLink.style.opacity = '1';
          activeLink.setAttribute('aria-current', 'true');
        }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => sectionObserver.observe(section));


  /* ── 4. SMOOTH SCROLL POLYFILL ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── 5. COUNTER ANIMATION FOR STATS ───────────── */
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.textContent, 10);
        let current  = 0;
        const step   = Math.ceil(target / 20);
        const ticker = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(ticker);
          } else {
            el.textContent = current;
          }
        }, 50);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  if (!prefersReduced) {
    statNums.forEach(el => counterObserver.observe(el));
  }

});