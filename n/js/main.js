

// === CUSTOM CURSOR GLOW EFFECT ===
// Creates a glowing cursor that follows the mouse
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    // Update cursor position smoothly
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Scale up cursor on interactive elements
document.querySelectorAll('a, button, .project-card, .bento-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'scale(2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'scale(1)';
    });
});

// === SMOOTH SCROLL FOR NAVIGATION ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === 3D TILT EFFECT FOR PROJECT CARDS ===
// Adds realistic 3D tilt on mouse move
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
            translateY(-10px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
    });
});

// === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
// Reveals elements as they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-category, .bento-card').forEach(el => {
    // Set initial state
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Observe
    observer.observe(el);
});

// === PARALLAX EFFECT FOR HERO SHAPES ===
// Makes background shapes move with mouse
const hero = document.querySelector('.hero');
const shapes = document.querySelectorAll('.shape');

if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xMove = (x - 0.5) * speed;
            const yMove = (y - 0.5) * speed;
            
            shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
}

// === TERMINAL TYPING EFFECT ===
// Animate terminal text typing
const terminalLines = document.querySelectorAll('.terminal-line .command');

terminalLines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.opacity = '1';
    
    // Delay based on line index
    setTimeout(() => {
        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex < text.length) {
                line.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    }, index * 1000);
});

// === SCROLL PROGRESS INDICATOR ===
// Updates nav opacity based on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const nav = document.querySelector('.nav');
    
    if (scrolled > 100) {
        nav.style.background = 'rgba(18, 10, 33, 0.95)';
    } else {
        nav.style.background = 'rgba(18, 10, 33, 0.7)';
    }
});

// === ACTIVE NAV LINK HIGHLIGHTING ===
// Highlights current section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.background = 'linear-gradient(135deg, #ff0080, #b026ff, #00fff9)';
            link.style.webkitBackgroundClip = 'text';
            link.style.webkitTextFillColor = 'transparent';
            link.style.backgroundClip = 'text';
        }
    });
});

// === MAGNETIC BUTTON EFFECT ===
// Buttons follow cursor slightly when hovered
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translate(0, 0)';
    });
});

// === TECH TAG HOVER SPARKLE EFFECT ===
// Add random sparkle animation to tech tags
document.querySelectorAll('.tech-tag, .skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.animation = 'sparkle 0.6s ease';
    });
    
    tag.addEventListener('animationend', () => {
        tag.style.animation = '';
    });
});

// Add sparkle keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0%, 100% {
            filter: brightness(1);
        }
        50% {
            filter: brightness(1.5) drop-shadow(0 0 10px currentColor);
        }
    }
`;
document.head.appendChild(style);

// === PERFORMANCE OPTIMIZATION ===
// Debounce scroll and resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Scroll operations here if needed
}, 10);

window.addEventListener('scroll', debouncedScroll);

// === EASTER EGG: KONAMI CODE ===
// Secret activation: up, up, down, down, left, right, left, right, b, a
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex].toLowerCase()) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateEasterEgg() {
    // Crazy rainbow mode!
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    // Alert user
    setTimeout(() => {
        alert('🎮 KONAMI CODE ACTIVATED! 🌈');
        
        // Disable after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
            rainbowStyle.remove();
        }, 5000);
    }, 100);
}

// === LOG DESIGN CREDIT ===
console.log('%c🚀 REMINGTON WESTBROOK PORTFOLIO', 'font-size: 20px; font-weight: bold; color: #ff0080;');
console.log('%cDesigned with passion and excessive caffeine ☕', 'font-size: 12px; color: #00fff9;');
console.log('%cBuilt with: HTML, CSS, JavaScript, and a Y2K aesthetic', 'font-size: 10px; color: #b026ff;');
console.log('%cFeel free to peek at the code, but please be nice! 💖', 'font-size: 10px; color: #8888aa;');
