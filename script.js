'use strict';

/* ─── NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE NAV ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.createElement('nav');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <button class="mobile-nav-close" aria-label="Close">✕</button>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#matrimony">Matrimony</a>
  <a href="#events">Events</a>
  <a href="#gallery">Gallery</a>
  <a href="#contact">Contact</a>
`;
document.body.appendChild(mobileNav);

const closeBtn = mobileNav.querySelector('.mobile-nav-close');
hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav.classList.remove('open'));
});

/* ─── REVEAL ON SCROLL ─── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = (Array.from(entry.target.parentElement?.children || []).indexOf(entry.target)) * 80;
      setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('en-IN');
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

/* ─── FLOATING PARTICLES ─── */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 15 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}
createParticles();

/* ─── TESTIMONIALS CAROUSEL ─── */
const inner = document.getElementById('testimonialsInner');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');

if (inner && prevBtn && nextBtn) {
  const cards = inner.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoPlay;

  function getCardWidth() {
    const card = cards[0];
    if (!card) return 340;
    return card.offsetWidth + 24;
  }

  function goTo(index) {
    const maxIndex = cards.length - getVisibleCount();
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    inner.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  }

  function getVisibleCount() {
    const trackWidth = inner.parentElement.offsetWidth;
    return Math.max(1, Math.floor(trackWidth / getCardWidth()));
  }

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAuto(); });

  function startAuto() {
    autoPlay = setInterval(() => {
      const maxIndex = cards.length - getVisibleCount();
      goTo(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    }, 4000);
  }

  function resetAuto() { clearInterval(autoPlay); startAuto(); }
  startAuto();

  window.addEventListener('resize', () => goTo(0), { passive: true });
}

/* ─── SMOOTH ACTIVE NAV HIGHLIGHT ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success" style="display:flex">
          <div class="success-icon">🙏</div>
          <h3 style="color:#fff; font-family:'Playfair Display',serif">Jai Jinendra!</h3>
          <p>Your message has been received. Our team will connect with you shortly.</p>
          <p style="color:var(--gold-bright); font-size:0.85rem; margin-top:0.5rem">॥ जय जिनेन्द्र ॥</p>
        </div>
      `;
    }, 1200);
  });
}

/* ─── PARALLAX HERO MANDALAS ─── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const mandalas = document.querySelectorAll('.hero .mandala');
  mandalas.forEach((m, i) => {
    const speed = (i + 1) * 0.08;
    m.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02 * (i + 1)}deg)`;
  });
}, { passive: true });

/* ─── CARD TILT EFFECT ─── */
document.querySelectorAll('.value-card, .feature-card, .event-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
