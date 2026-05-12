/* ============================================================
   ES HAPPY TOURS — GLOBAL SCRIPTS
   main.js  |  Syntrix PH © 2026
   ============================================================ */


/* ── NAV SCROLL BEHAVIOR ─────────────────────────────────── */
const header = document.getElementById('site-header');

function onScroll() {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();


/* ── MOBILE MENU ─────────────────────────────────────────── */
const btnHamburger = document.getElementById('btn-hamburger');
const navMobile    = document.getElementById('nav-mobile');

if (btnHamburger && navMobile) {
  btnHamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    btnHamburger.classList.toggle('open', isOpen);
    btnHamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      btnHamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}


/* ── SEARCH OVERLAY ──────────────────────────────────────── */
const btnSearch     = document.getElementById('btn-search');
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchClose   = document.getElementById('search-close');

function openSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.add('open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput && searchInput.focus(), 250);
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  searchOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (searchInput) searchInput.value = '';
}

if (btnSearch)   btnSearch.addEventListener('click', openSearch);
if (searchClose) searchClose.addEventListener('click', closeSearch);

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch();
    if (navMobile && navMobile.classList.contains('open')) {
      navMobile.classList.remove('open');
      btnHamburger && btnHamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

/* Search submit — redirect to packages page with query */
if (searchInput) {
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (q) {
        if (typeof window.applyPackageSearch === 'function') {
          window.applyPackageSearch(q);
          closeSearch();
        } else {
          window.location.href = `packages?search=${encodeURIComponent(q)}`;
        }
      }
    }
  });
}


/* ── SCROLL REVEAL (IntersectionObserver) ─────────────────── */
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}


/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
(function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'home';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'home')) {
      a.classList.add('active');
    }
  });
})();


/* Guest gallery lightbox */
(function initGuestGalleryLightbox() {
  const lightbox = document.getElementById('guest-lightbox');
  const triggers = document.querySelectorAll('[data-gallery-src]');
  if (!lightbox || !triggers.length) return;

  const image = lightbox.querySelector('.guest-lightbox__image');
  const caption = lightbox.querySelector('.guest-lightbox__caption');
  const closeButtons = lightbox.querySelectorAll('.guest-lightbox__close, .guest-lightbox__backdrop');

  const openLightbox = trigger => {
    const src = trigger.dataset.gallerySrc;
    const text = trigger.dataset.galleryCaption || trigger.querySelector('img')?.alt || 'Guest gallery image';
    if (!src || !image || !caption) return;

    image.src = src;
    image.alt = text;
    caption.textContent = text;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (image) image.src = '';
  };

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
})();


/* Guest gallery hero slideshow */
(function initGuestGallerySlideshow() {
  const slideshow = document.querySelector('[data-guest-slideshow]');
  if (!slideshow) return;

  const slides = Array.from(slideshow.querySelectorAll('.guest-gallery-slide'));
  if (slides.length < 2) return;

  let activeIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  const showSlide = index => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });
  };

  let timer = window.setInterval(() => showSlide(activeIndex + 1), 4200);

  slideshow.addEventListener('mouseenter', () => window.clearInterval(timer));
  slideshow.addEventListener('mouseleave', () => {
    timer = window.setInterval(() => showSlide(activeIndex + 1), 4200);
  });
})();


/* Contact form validation and real inquiry submission */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btnSubmit = document.getElementById('btn-submit');
  const feedback = document.getElementById('form-feedback');

  const initialButtonNodes = btnSubmit
    ? Array.from(btnSubmit.childNodes).map(node => node.cloneNode(true))
    : [];

  const setFeedback = (type, message) => {
    if (!feedback) return;
    feedback.className = type ? `form-feedback ${type}` : 'form-feedback';
    feedback.textContent = message;
  };

  const getValue = id => {
    const field = document.getElementById(id);
    return field ? field.value.trim() : '';
  };

  const setButtonLoading = isLoading => {
    if (!btnSubmit) return;

    btnSubmit.disabled = isLoading;
    btnSubmit.style.opacity = isLoading ? '0.65' : '1';

    if (isLoading) {
      btnSubmit.textContent = 'Sending inquiry...';
    } else {
      btnSubmit.replaceChildren(...initialButtonNodes.map(node => node.cloneNode(true)));
    }
  };

  const applyPackageFromUrl = () => {
    const packageField = document.getElementById('f-package');
    if (!packageField) return;

    const params = new URLSearchParams(window.location.search);
    const selectedPackage = params.get('package');
    if (!selectedPackage) return;

    packageField.value = selectedPackage;

    const lowerPackage = selectedPackage.toLowerCase();
    const tourTypeField = document.getElementById('f-tour-type');
    const destinationField = document.getElementById('f-destination');

    if (tourTypeField) {
      if (lowerPackage.includes('joiner')) tourTypeField.value = 'joiner';
      if (lowerPackage.includes('private')) tourTypeField.value = 'private';
    }

    if (destinationField) {
      if (lowerPackage.includes('cebu') && lowerPackage.includes('bohol')) {
        destinationField.value = 'both';
      } else if (lowerPackage.includes('bohol')) {
        destinationField.value = 'bohol';
      } else if (
        lowerPackage.includes('cebu') ||
        lowerPackage.includes('moalboal') ||
        lowerPackage.includes('oslob') ||
        lowerPackage.includes('kawasan')
      ) {
        destinationField.value = 'cebu';
      }
    }
  };

  applyPackageFromUrl();

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const name = getValue('f-name');
    const email = getValue('f-email');
    const phone = getValue('f-phone');
    const persons = getValue('f-persons');
    const tourType = getValue('f-tour-type');

    if (!name || !phone || !persons || !tourType) {
      setFeedback('error', 'Please fill in your name, phone number, number of persons, and tour type.');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('error', 'Please enter a valid email address.');
      return;
    }

    if (Number(persons) < 1) {
      setFeedback('error', 'Please enter a valid number of persons.');
      return;
    }

    const pageUrlField = document.getElementById('f-page-url');
    const referrerField = document.getElementById('f-referrer');
    const submittedAtField = document.getElementById('f-submitted-at');

    if (pageUrlField) pageUrlField.value = window.location.href;
    if (referrerField) referrerField.value = document.referrer || 'Direct visit';
    if (submittedAtField) submittedAtField.value = new Date().toISOString();

    setButtonLoading(true);
    setFeedback('', '');

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Server returned non-JSON response:', text);
        throw new Error('Server error. Please check if send-inquiry.php is uploaded correctly.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      setFeedback('success', 'Thank you! Your inquiry has been sent. Our team will contact you within 24 hours.');

      if (typeof fbq === 'function') {
        fbq('track', 'Lead', {
          content_name: getValue('f-package') || getValue('f-destination') || 'Travel Inquiry',
          tour_type: tourType,
          num_items: persons
        });
      }

      form.reset();
    } catch (error) {
      setFeedback('error', error.message || 'Unable to send inquiry. Please message us on Facebook or Viber.');
    } finally {
      setButtonLoading(false);
    }
  });

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      if (feedback && feedback.classList.contains('error')) {
        setFeedback('', '');
      }
    });
  });
})();


/* Hotel filter tabs */
(function initHotelFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.hotel-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach(card => {
        const destMatch = filter === 'all' || card.dataset.dest === filter;
        const tierMatch = filter === 'all' || card.dataset.tier === filter;
        const show = filter === 'all' ? true : (destMatch || tierMatch);
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();
