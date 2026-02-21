// ============================================
// REMINGTON WESTBROOK - PORTFOLIO JS
// Single-page: scrollspy, expand/collapse, hash nav
// ============================================

// === SCROLL REVEAL ===
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// === NAV BACKGROUND ON SCROLL ===
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(10,10,12,0.96)';
    } else {
      nav.style.background = 'rgba(10,10,12,0.85)';
    }
  }, { passive: true });
}

// === SECTION EXPAND/COLLAPSE ===
const sectionHeaders = document.querySelectorAll('.section-header');

function expandSection(panel) {
  const body = panel.querySelector('.section-body');
  const header = panel.querySelector('.section-header');
  const toggle = panel.querySelector('.section-toggle');
  if (!body || !header) return;

  panel.classList.add('open');
  header.setAttribute('aria-expanded', 'true');
  if (toggle) toggle.textContent = '−';
  body.style.maxHeight = body.scrollHeight + 'px';

  // Re-observe reveals inside the section
  panel.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function collapseSection(panel) {
  const body = panel.querySelector('.section-body');
  const header = panel.querySelector('.section-header');
  const toggle = panel.querySelector('.section-toggle');
  if (!body || !header) return;

  panel.classList.remove('open');
  header.setAttribute('aria-expanded', 'false');
  if (toggle) toggle.textContent = '+';
  body.style.maxHeight = '0';
}

function toggleSection(panel) {
  if (panel.classList.contains('open')) {
    collapseSection(panel);
  } else {
    expandSection(panel);
  }
}

sectionHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const panel = header.closest('.section-panel');
    if (panel) {
      toggleSection(panel);
      // Update hash
      const id = panel.id;
      if (id) {
        if (panel.classList.contains('open')) {
          history.replaceState(null, '', '#' + id);
        } else {
          history.replaceState(null, '', window.location.pathname);
        }
      }
    }
  });
});

// === SCROLLSPY ===
const sections = document.querySelectorAll('.section-panel');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const scrollspyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}, { threshold: 0.2, rootMargin: '-60px 0px 0px 0px' });

sections.forEach(section => scrollspyObserver.observe(section));

// === NAV CLICK: EXPAND + SMOOTH SCROLL ===
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetPanel = document.getElementById(targetId);

    if (targetPanel) {
      // Expand section if collapsed
      if (!targetPanel.classList.contains('open')) {
        expandSection(targetPanel);
      }

      // Smooth scroll after a brief delay to let expand animation start
      setTimeout(() => {
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);

      // Update hash
      history.replaceState(null, '', '#' + targetId);
    }

    // Close mobile nav
    const navLinksEl = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    if (navLinksEl) navLinksEl.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  });
});

// === CLOSE MOBILE NAV ON LINK CLICK (logo) ===
const logoLink = document.querySelector('.nav-logo');
if (logoLink) {
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', window.location.pathname);
    const navLinksEl = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    if (navLinksEl) navLinksEl.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  });
}

// === HASH NAVIGATION (on load + hashchange) ===
function handleHash() {
  const hash = window.location.hash.substring(1);
  if (hash) {
    const panel = document.getElementById(hash);
    if (panel && panel.classList.contains('section-panel')) {
      expandSection(panel);
      setTimeout(() => {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}

// Run on load
handleHash();

// Listen for hash changes
window.addEventListener('hashchange', handleHash);
