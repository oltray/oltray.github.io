// ============================================
// REMINGTON WESTBROOK - RETRO-NOIR PORTFOLIO JS
// Clean, mobile-friendly interactions
// ============================================

// === CLOCK ===
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const el = document.getElementById('clock');
  if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

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

// === CLOSE MOBILE NAV ON LINK CLICK ===
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks) navLinks.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  });
});

// === TERMINAL TYPING EFFECT (contact page) ===
const terminalCommands = document.querySelectorAll('.terminal-line .command');
terminalCommands.forEach((line, index) => {
  const text = line.textContent;
  line.textContent = '';
  line.style.opacity = '1';

  setTimeout(() => {
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < text.length) {
        line.textContent += text.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);
  }, index * 800);
});

// === EASTER EGG: KONAMI CODE ===
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      document.body.style.animation = 'hueShift 2s linear infinite';
      const style = document.createElement('style');
      style.textContent = '@keyframes hueShift { from { filter: hue-rotate(0deg); } to { filter: hue-rotate(360deg); } }';
      document.head.appendChild(style);
      setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
      }, 5000);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// === CONSOLE CREDIT ===
console.log('%c⬡ REMINGTON WESTBROOK', 'font-size: 16px; font-weight: bold; color: #e63946;');
console.log('%cRetro-Noir Portfolio — Big-O × Bebop × Akira', 'font-size: 11px; color: #d4a029;');
