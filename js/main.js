/* ============================================================
   All ONDECK HUB — Main JavaScript
   ============================================================ */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  globalThis.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', globalThis.scrollY > 40);
  });
}

// ── Hamburger menu ────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// ── Active nav link ───────────────────────────────────────
const currentPage = globalThis.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll reveal ─────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Accordion ─────────────────────────────────────────────
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const body = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-btn').forEach(b => {
      b.classList.remove('open');
      if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
    });
    // Toggle clicked
    if (!isOpen) {
      btn.classList.add('open');
      body.classList.add('open');
    }
  });
});

// ── Toast notification ────────────────────────────────────
function showToast(icon, message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <span class="toast-close" onclick="this.closest('.toast').remove()">✕</span>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ── Form submissions ──────────────────────────────────────
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'Processing...';
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = original;
        btn.disabled = false;
      }
      const formId = form.id || form.dataset.type || 'form';
      if (formId.includes('booking')) {
        showToast('📅', 'Booking received! Redirecting to payment...');
        setTimeout(() => globalThis.open('https://paystack.shop/pay/payonsite', '_blank'), 1500);
      } else if (formId.includes('newsletter') || formId.includes('email')) {
        showToast('📧', 'You\'re subscribed! Welcome to All ONDECK HUB.');
      } else if (formId.includes('profile')) {
        showToast('🎾', 'Profile created successfully! Welcome to the Showcase.');
      } else {
        showToast('✅', 'Thank you! Your request has been received.');
      }
      form.reset();
    }, 1200);
  });
});

// ── Enrollment / CTA buttons ──────────────────────────────
document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', _e => {
    const action = btn.dataset.action;
    if (action === 'enroll') {
      const _course = btn.dataset.course || 'this course';
      globalThis.open('https://paystack.shop/pay/payonsite','_blank');
    } else if (action === 'join') {
      globalThis.open('https://paystack.shop/pay/payonsite','_blank');
    } else if (action === 'paystack') {
      globalThis.open('https://paystack.shop/pay/payonsite','_blank');
    }
  });
});

// ── Smooth scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Counter animation ─────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 25);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target, 10);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));
