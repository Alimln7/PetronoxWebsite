import { on } from '../utils/dom.js';

export function initBackToTop() {
  // Create button
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8679;';
  document.body.appendChild(btn);

  // Show/hide on scroll
  on(window, 'scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  // Scroll to top on click
  on(btn, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
