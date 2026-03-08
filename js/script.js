/**
 * script.js — Alex Carter Portfolio Website
 * Handles:
 *  1. Responsive hamburger menu toggle
 *  2. Skill-bar animation on scroll (About page)
 *  3. Contact form validation + dynamic submission output
 */

/* ============================================================
   1. HAMBURGER MENU
   ============================================================ */
(function initNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (mobile)
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   2. SKILL BAR ANIMATION (About page)
   Fills each .skill-fill to its data width when scrolled into view.
   ============================================================ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /** Each fill has inline --pct set in HTML (e.g. style="--pct:80%") */
        const el  = entry.target;
        const pct = getComputedStyle(el).getPropertyValue('--pct').trim();
        el.style.width = pct;
        observer.unobserve(el);   // animate only once
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ============================================================
   3. CONTACT FORM — VALIDATION & SUBMISSION
   ============================================================ */
(function initContactForm() {
  const form          = document.getElementById('contactForm');
  const successPanel  = document.getElementById('successPanel');
  const resetBtn      = document.getElementById('resetBtn');
  if (!form) return;

  // ── Helpers ────────────────────────────────────────────────

  /**
   * Validates a single field.
   * @param {HTMLInputElement|HTMLTextAreaElement} field
   * @returns {boolean} true if valid
   */
  function validateField(field) {
    const id      = field.id;
    const value   = field.value.trim();
    const errorEl = document.getElementById(id + 'Error');
    let   message = '';

    if (id === 'name') {
      if (!value) {
        message = '⚠️ Full Name is required.';
      } else if (value.length < 2) {
        message = '⚠️ Name must be at least 2 characters.';
      }
    }

    if (id === 'email') {
      // RFC-5322-inspired regex for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!value) {
        message = '⚠️ Email Address is required.';
      } else if (!emailRegex.test(value)) {
        message = '⚠️ Please enter a valid email address (e.g. user@domain.com).';
      }
    }

    if (id === 'message') {
      if (!value) {
        message = '⚠️ Message cannot be empty.';
      } else if (value.length < 10) {
        message = '⚠️ Message must be at least 10 characters long.';
      }
    }

    // Update UI
    if (errorEl) errorEl.textContent = message;
    field.classList.toggle('invalid', Boolean(message));
    field.classList.toggle('valid',  !message && value.length > 0);

    return !message;
  }

  // ── Inline real-time validation ────────────────────────────
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (!field) return;
    field.addEventListener('input', () => validateField(field));
    field.addEventListener('blur',  () => validateField(field));
  });

  // ── Form submit ────────────────────────────────────────────
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameField    = document.getElementById('name');
    const emailField   = document.getElementById('email');
    const messageField = document.getElementById('message');

    // Validate all fields
    const validName    = validateField(nameField);
    const validEmail   = validateField(emailField);
    const validMessage = validateField(messageField);

    if (!validName || !validEmail || !validMessage) {
      // Focus first invalid field to help the user
      if (!validName)    nameField.focus();
      else if (!validEmail) emailField.focus();
      else               messageField.focus();
      return;
    }

    // ── Collect data ────────────────────────────────────────
    const submittedData = {
      name:      nameField.value.trim(),
      email:     emailField.value.trim(),
      message:   messageField.value.trim(),
      timestamp: new Date().toLocaleString(),
    };

    // Log to console (as required)
    console.log('📩 Form Submitted:', submittedData);

    // ── Display success panel ─────────────────────────────
    if (successPanel) {
      const summary = document.getElementById('successSummary');
      if (summary) {
        summary.textContent =
          `Thank you, ${submittedData.name}! Your message has been received. ` +
          `We'll reply to ${submittedData.email} shortly.`;
      }
      form.hidden = true;
      successPanel.hidden = false;
    }
  });

  // ── Reset to form ──────────────────────────────────────────
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      // Clear validation states
      form.querySelectorAll('input, textarea').forEach(field => {
        field.classList.remove('valid', 'invalid');
        const errorEl = document.getElementById(field.id + 'Error');
        if (errorEl) errorEl.textContent = '';
      });
      form.hidden       = false;
      successPanel.hidden = true;
    });
  }
})();
