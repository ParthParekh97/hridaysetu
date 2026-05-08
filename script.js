'use strict';

/* NAVBAR */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* MOBILE NAV */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.createElement('nav');
mobileNav.className = 'mobile-nav';
mobileNav.innerHTML = `
  <button class="mobile-nav-close" aria-label="Close">✕</button>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#services">Services</a>
  <a href="#gallery">Gallery</a>
  <a href="#testimonials">Testimonials</a>
  <a href="#contact">Contact</a>
`;
document.body.appendChild(mobileNav);
const closeBtn = mobileNav.querySelector('.mobile-nav-close');
hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* REVEAL ON SCROLL */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* COUNTER ANIMATION */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCounter(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hstat-num, .bstat-num').forEach(c => counterObserver.observe(c));

/* GALLERY FILTER */
const filterBtns = document.querySelectorAll('.gf-btn');
const galleryItems = document.querySelectorAll('.g-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !match);
    });
  });
});

/* TESTIMONIALS CAROUSEL */
const inner = document.getElementById('testimonialsInner');
const prevBtn = document.getElementById('tPrev');
const nextBtn = document.getElementById('tNext');
if (inner && prevBtn && nextBtn) {
  const cards = inner.querySelectorAll('.t-card');
  let currentIndex = 0;
  let autoPlay;
  const getCardWidth = () => (cards[0] ? cards[0].offsetWidth + 24 : 340);
  const getVisible = () => Math.max(1, Math.floor(inner.parentElement.offsetWidth / getCardWidth()));
  const goTo = (index) => {
    const max = cards.length - getVisible();
    currentIndex = Math.max(0, Math.min(index, max));
    inner.style.transform = `translateX(-${currentIndex * getCardWidth()}px)`;
  };
  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAuto(); });
  const startAuto = () => { autoPlay = setInterval(() => goTo(currentIndex >= cards.length - getVisible() ? 0 : currentIndex + 1), 4000); };
  const resetAuto = () => { clearInterval(autoPlay); startAuto(); };
  startAuto();
  window.addEventListener('resize', () => goTo(0), { passive: true });
}

/* ACTIVE NAV HIGHLIGHT */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* CONTACT FORM */
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
          <div class="s-icon">🙏</div>
          <h3>Jai Jinendra!</h3>
          <p>Your message has been received. Our team will connect with you shortly.</p>
          <p style="color:var(--gold-bright);font-size:0.85rem">।। जय जिनेन्द्र ।।</p>
        </div>
      `;
    }, 1200);
  });
}

/* CARD HOVER TILT */
document.querySelectorAll('.why-card,.service-card,.about-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
