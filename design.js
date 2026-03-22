/* ══════════════════════════════════════════
   GreenCart — design.js
   Link this file at the bottom of file.html as:
   <script src="design.js"></script>
══════════════════════════════════════════ */

/* ── 1. SCROLL REVEAL ANIMATION ─────────────────────────────────────────────
   Watches every element with class .reveal using IntersectionObserver.
   When the element enters the viewport, the class .visible is added,
   which triggers the CSS fade-up transition defined in style.css.
   A small staggered delay is applied per batch so cards animate in sequence.
──────────────────────────────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80); // staggered delay: each element 80ms after the previous
      revealObserver.unobserve(entry.target); // stop watching once revealed
    }
  });
}, { threshold: 0.1 }); // trigger when 10% of the element is visible

// Attach observer to all .reveal elements
document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ── 2. ACTIVE NAV LINK HIGHLIGHT ON SCROLL ─────────────────────────────────
   As the user scrolls, checks which section is currently in view and
   highlights the matching navigation link with the --leaf green color.
   Resets all other links back to their default color first.
──────────────────────────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.pageYOffset;

  sections.forEach((section) => {
    const sectionTop    = section.offsetTop - 100; // 100px offset for fixed nav
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionBottom) {
      navLinks.forEach((link) => {
        link.style.color = ''; // reset all links
        if (link.getAttribute('href') === '#' + section.id) {
          link.style.color = 'var(--leaf)'; // highlight active link
        }
      });
    }
  });
});


/* ── 3. ANIMATED STAT COUNTERS ───────────────────────────────────────────────
   When the stats band scrolls into view, each .stat-number counts up
   from 0 to its target value over ~2 seconds using setInterval.
   Handles:
     - Integer values  (e.g. "50+" → counts to 50, then appends "+")
     - Decimal values  (e.g. "4.2T" → counts to 4.2, appends "T")
     - Percentage values (e.g. "98%" → counts to 98, appends "%")
──────────────────────────────────────────────────────────────────────────── */

/**
 * Animates a DOM element's text content from 0 up to `target`.
 * @param {HTMLElement} el       - The element whose text to animate.
 * @param {number}      target   - The numeric end value.
 * @param {string}      suffix   - Non-numeric characters to append (e.g. "K+", "%", "T").
 */
function animateCounter(el, target, suffix = '') {
  const isDecimal  = !Number.isInteger(target);
  const duration   = 2000;                       // total animation duration in ms
  const fps        = 60;
  const totalSteps = (duration / 1000) * fps;    // ~120 steps
  const increment  = target / totalSteps;
  let   current    = 0;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    el.textContent = isDecimal
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;
  }, 1000 / fps); // ~16.67ms per frame
}

// Observe the stats band; fire counters only once when it first enters view
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {

      const statNumbers = entry.target.querySelectorAll('.stat-number');

      statNumbers.forEach((el) => {
        const rawText = el.textContent.trim();
        // Extract numeric portion (including decimals)
        const numericValue = parseFloat(rawText.replace(/[^0-9.]/g, ''));
        // Extract suffix: everything that's not a digit or decimal point
        const suffix       = rawText.replace(/[0-9.]/g, '');

        animateCounter(el, numericValue, suffix);
      });

      statsObserver.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.5 }); // trigger when 50% of the stats band is visible

document.querySelectorAll('.stats-band').forEach((el) => {
  statsObserver.observe(el);
});


/* ── 4. SMOOTH MOBILE NAV TOGGLE (OPTIONAL ENHANCEMENT) ─────────────────────
   On screens narrower than 900px the nav links are hidden via CSS.
   This block adds a hamburger-style toggle if a #nav-toggle button
   exists in the HTML. It's included here for future extensibility —
   safe to ignore if not yet needed.
──────────────────────────────────────────────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.querySelector('.nav-links');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked (for single-page navigation)
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}


/* ── 5. SUBSCRIPTION BUTTON FEEDBACK ────────────────────────────────────────
   Adds a brief visual confirmation when a subscription button is clicked.
   The button text temporarily changes to "✓ Added!" before reverting.
──────────────────────────────────────────────────────────────────────────── */
document.querySelectorAll('.sub-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const original = btn.textContent;
    btn.textContent = '✓ Added to Cart!';
    btn.style.opacity = '0.8';

    setTimeout(() => {
      btn.textContent = original;
      btn.style.opacity = '';
    }, 1800);
  });
});