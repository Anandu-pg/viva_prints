/* =============================================
   VIVAPRINTS – JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. PRELOADER
  ========================================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });
  document.body.style.overflow = 'hidden';


  /* ==========================================
     2. STICKY NAV – FROSTED GLASS ON SCROLL
  ========================================== */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });


  /* ==========================================
     3. HAMBURGER MOBILE MENU
  ========================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ==========================================
     4. HERO PARALLAX on MOUSE MOVE
  ========================================== */
  const heroSection = document.getElementById('hero');
  const parallaxCards = document.querySelectorAll('.parallax-card');
  const orbs = document.querySelectorAll('.orb');

  heroSection.addEventListener('mousemove', (e) => {
    const { innerWidth: W, innerHeight: H } = window;
    const cx = (e.clientX / W - 0.5);
    const cy = (e.clientY / H - 0.5);

    parallaxCards.forEach((card, i) => {
      const depth = (i + 1) * 18;
      card.style.transform = `
        rotate(${(i === 0 ? 6 : i === 1 ? -4 : 9) + cx * 4}deg)
        translate(${cx * depth}px, ${cy * depth}px)
      `;
    });

    orbs.forEach((orb, i) => {
      const d = (i + 1) * 10;
      orb.style.transform = `translate(${cx * d}px, ${cy * d}px)`;
    });
  });


  /* ==========================================
     5. PARALLAX DIVIDER on SCROLL
  ========================================== */
  const parallaxBg = document.querySelector('.parallax-bg');
  window.addEventListener('scroll', () => {
    if (!parallaxBg) return;
    const divider = document.getElementById('parallax-divider');
    const rect = divider.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset = (progress - 0.5) * -60;
    parallaxBg.style.transform = `translateY(${offset}px)`;
  }, { passive: true });


  /* ==========================================
     6. TILT ON HOVER (3D Cards)
  ========================================== */
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    const inner = card.querySelector('.tilt-inner');

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      inner.style.transform = `
        perspective(800px)
        rotateY(${x * 14}deg)
        rotateX(${-y * 14}deg)
        scale3d(1.04, 1.04, 1.04)
      `;
      inner.style.transition = 'transform 0.08s linear';
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
      inner.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });
  });


  /* ==========================================
     7. SCROLL REVEAL (Intersection Observer)
  ========================================== */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for sibling items
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const idx = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 80}ms`;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));


  /* ==========================================
     8. COUNTER ANIMATION (Stats)
  ========================================== */
  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          let start = 0;
          const duration = 1800;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(el => counterObserver.observe(el));


  /* ==========================================
     9. TESTIMONIALS SLIDER
  ========================================== */
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.testi-dot');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  const cards = track.querySelectorAll('.testimonial-card');

  let currentIdx = 0;
  let autoPlayTimer;

  const getCardsPerView = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const goToSlide = (idx) => {
    const perView = getCardsPerView();
    const maxIdx = cards.length - perView;
    currentIdx = Math.max(0, Math.min(idx, maxIdx));

    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // 1.5rem
    track.style.transform = `translateX(-${currentIdx * (cardWidth + gap)}px)`;

    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIdx));
  };

  prevBtn.addEventListener('click', () => {
    clearTimeout(autoPlayTimer);
    goToSlide(currentIdx - 1);
  });

  nextBtn.addEventListener('click', () => {
    clearTimeout(autoPlayTimer);
    goToSlide(currentIdx + 1);
    startAutoPlay();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearTimeout(autoPlayTimer);
      goToSlide(parseInt(dot.dataset.idx, 10));
    });
  });

  const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => {
      const perView = getCardsPerView();
      const maxIdx = cards.length - perView;
      goToSlide(currentIdx >= maxIdx ? 0 : currentIdx + 1);
    }, 4500);
  };

  startAutoPlay();
  window.addEventListener('resize', () => goToSlide(0));


  /* ==========================================
     10. WHATSAPP QUOTE FORM HANDLER
  ========================================== */
  window.handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const product = form.product.value;
    const qty = form.quantity.value.trim();
    const message = form.message.value.trim();

    const productLabels = {
      wedding: 'Wedding Cards & Invitations',
      corporate: 'Corporate ID Cards',
      business: 'Business Cards',
      housewarming: 'Housewarming Cards',
      special: 'Special Occasion Cards',
      other: 'Other'
    };

    const wa = [
      `Hi VivaPrints! 👋`,
      ``,
      `*Name:* ${name}`,
      `*Phone:* ${phone}`,
      `*Product:* ${productLabels[product] || product}`,
      qty ? `*Quantity:* ${qty}` : '',
      message ? `*Details:* ${message}` : '',
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/919745534679?text=${encodeURIComponent(wa)}`;
    window.open(url, '_blank');
    form.reset();

    // Feedback
    const btn = document.getElementById('form-submit-btn');
    const original = btn.textContent;
    btn.textContent = '✓ Opening WhatsApp...';
    btn.style.background = 'linear-gradient(135deg, #25D366, #1da851)';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 3000);
  };


  /* ==========================================
     11. NEWSLETTER HANDLER
  ========================================== */
  window.handleNewsletter = (e) => {
    e.preventDefault();
    const btn = document.getElementById('newsletter-submit');
    const input = document.getElementById('newsletter-email');
    const original = btn.textContent;

    btn.textContent = '✓';
    btn.style.background = '#25D366';
    input.value = '';

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 3000);
  };


  /* ==========================================
     12. SMOOTH SCROLL for nav links
  ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {     
        e.preventDefault();
        const navH = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ==========================================
     13. ACTIVE NAV LINK on SCROLL
  ========================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksAll.forEach(a => {
            a.style.color = a.getAttribute('href') === `#${id}`
              ? 'hsl(43, 80%, 72%)'
              : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => activeSectionObserver.observe(s));

  /* ==========================================
     14. PRODUCT FILTER TABS
  ========================================== */
  const filterTabs   = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('#products-grid .product-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      productCards.forEach(card => {
        const cat = card.dataset.cat;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden-filter', !show);
      });
    });
  });

});
