import { t } from '../i18n.js';

export function renderContact(container) {
  container.innerHTML = `
    <div class="section" id="contactSection">
      <div class="section__content">
        <div class="section-title" data-i18n="contactTitle">${t('contactTitle')}</div>
        <div class="contact-section">

          <!-- Contact Methods -->
          <div class="contact-methods">
            <div class="contact-card">
              <img src="icons/call_1.png" alt="Phone">
              <a href="tel:+96170077473">+961 70 077 473</a>
              <div class="contact-card-label">Phone</div>
            </div>
            <div class="contact-card">
              <img src="icons/whats_1.png" alt="WhatsApp">
              <a href="https://wa.me/96170077473" target="_blank" rel="noopener noreferrer">+961 70 077 473</a>
              <div class="contact-card-label">WhatsApp</div>
            </div>
            <div class="contact-card">
              <img src="icons/email_1.png" alt="Email">
              <a href="mailto:info@petronox-de.com">info@petronox-de.com</a>
              <div class="contact-card-label">Email</div>
            </div>
          </div>

          <!-- Social Media -->
          <div style="text-align:center; margin-top: var(--space-md);">
            <h3 data-i18n="socialMedia" style="font-size: var(--fs-h3); color: var(--color-text-dark); margin-bottom: var(--space-lg); font-weight: 700;">${t('socialMedia')}</h3>
          </div>
          <div class="social-links">
            <a href="https://www.facebook.com/speranza.lb" target="_blank" rel="noopener noreferrer" class="social-link">
              <img src="icons/facebook_1.png" alt="Facebook">
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com/speranza.lb" target="_blank" rel="noopener noreferrer" class="social-link">
              <img src="icons/instagram_1.png" alt="Instagram">
              <span>Instagram</span>
            </a>
            <a href="https://www.youtube.com/@Speranza" target="_blank" rel="noopener noreferrer" class="social-link">
              <img src="icons/youtube_1.png" alt="YouTube">
              <span>YouTube</span>
            </a>
            <a href="https://www.tiktok.com/@speranza.lb" target="_blank" rel="noopener noreferrer" class="social-link">
              <img src="icons/tiktok_1.png" alt="TikTok">
              <span>TikTok</span>
            </a>
            <a href="https://www.threads.net/@speranza.lb" target="_blank" rel="noopener noreferrer" class="social-link">
              <img src="icons/thread_1.png" alt="Threads">
              <span>Threads</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  `;
}

export function updateContactLanguage(container) {
  const title = container.querySelector('[data-i18n="contactTitle"]');
  const socialH3 = container.querySelector('[data-i18n="socialMedia"]');

  if (title) title.textContent = t('contactTitle');
  if (socialH3) socialH3.textContent = t('socialMedia');
}
