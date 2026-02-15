import { t } from '../i18n.js';

export function renderAbout(container) {
  container.innerHTML = `
    <div class="section" id="aboutSection">
      <div class="section__content">
        <div class="about-page">

          <!-- Hero Header -->
          <div class="about-hero">
            <div class="about-hero__badge" data-i18n="aboutBadge">${t('aboutBadge')}</div>
            <h2 class="about-hero__title" data-i18n="aboutTitle">${t('aboutTitle')}</h2>
            <p class="about-hero__subtitle" data-i18n="aboutSubtitle">${t('aboutSubtitle')}</p>
          </div>

          <!-- Mission Statement -->
          <div class="about-mission">
            <div class="about-mission__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <blockquote class="about-mission__text" data-i18n="aboutMission">${t('aboutMission')}</blockquote>
          </div>

          <!-- Quality Assurance Section -->
          <div class="about-quality">
            <h3 class="about-quality__title" data-i18n="certSectionTitle">${t('certSectionTitle')}</h3>
            <p class="about-quality__subtitle" data-i18n="certSectionSubtitle">${t('certSectionSubtitle')}</p>
            <div class="cert-badges">
              <div class="cert-badge reveal-on-scroll">
                <div class="cert-badge__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <h4 class="cert-badge__label" data-i18n="certBadgeIRI">${t('certBadgeIRI')}</h4>
                <p class="cert-badge__desc" data-i18n="certDetailIRI">${t('certDetailIRI')}</p>
              </div>
              <div class="cert-badge reveal-on-scroll">
                <div class="cert-badge__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v5l4 9H5l4-9V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>
                </div>
                <h4 class="cert-badge__label" data-i18n="certBadgeASTM">${t('certBadgeASTM')}</h4>
                <p class="cert-badge__desc" data-i18n="certDetailASTM">${t('certDetailASTM')}</p>
              </div>
              <div class="cert-badge reveal-on-scroll">
                <div class="cert-badge__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <h4 class="cert-badge__label" data-i18n="certBadgeAPI">${t('certBadgeAPI')}</h4>
                <p class="cert-badge__desc" data-i18n="certDetailAPI">${t('certDetailAPI')}</p>
              </div>
              <div class="cert-badge reveal-on-scroll">
                <div class="cert-badge__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                </div>
                <h4 class="cert-badge__label" data-i18n="certBadgeVirgin">${t('certBadgeVirgin')}</h4>
                <p class="cert-badge__desc" data-i18n="certDetailVirgin">${t('certDetailVirgin')}</p>
              </div>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="about-stats">
            <div class="about-stat">
              <span class="about-stat__number" data-target="4" data-suffix="+">0</span>
              <span class="about-stat__label" data-i18n="aboutStatYears">${t('aboutStatYears')}</span>
            </div>
            <div class="about-stat">
              <span class="about-stat__number" data-target="20" data-suffix="+">0</span>
              <span class="about-stat__label" data-i18n="aboutStatProducts">${t('aboutStatProducts')}</span>
            </div>
            <div class="about-stat">
              <span class="about-stat__number" data-target="5" data-suffix="">0</span>
              <span class="about-stat__label" data-i18n="aboutStatCountries">${t('aboutStatCountries')}</span>
            </div>
            <div class="about-stat">
              <span class="about-stat__number" data-target="2000" data-suffix="+" data-format="k">0</span>
              <span class="about-stat__label" data-i18n="aboutStatClients">${t('aboutStatClients')}</span>
            </div>
          </div>

          <!-- Value Proposition Cards -->
          <div class="about-values">
            <div class="about-value reveal-on-scroll">
              <div class="about-value__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h4 class="about-value__title" data-i18n="aboutValue1Title">${t('aboutValue1Title')}</h4>
              <p class="about-value__desc" data-i18n="aboutValue1Desc">${t('aboutValue1Desc')}</p>
            </div>
            <div class="about-value reveal-on-scroll">
              <div class="about-value__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v5l4 9H5l4-9V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>
              </div>
              <h4 class="about-value__title" data-i18n="aboutValue2Title">${t('aboutValue2Title')}</h4>
              <p class="about-value__desc" data-i18n="aboutValue2Desc">${t('aboutValue2Desc')}</p>
            </div>
            <div class="about-value reveal-on-scroll">
              <div class="about-value__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <h4 class="about-value__title" data-i18n="aboutValue3Title">${t('aboutValue3Title')}</h4>
              <p class="about-value__desc" data-i18n="aboutValue3Desc">${t('aboutValue3Desc')}</p>
            </div>
            <div class="about-value reveal-on-scroll">
              <div class="about-value__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <h4 class="about-value__title" data-i18n="aboutValue4Title">${t('aboutValue4Title')}</h4>
              <p class="about-value__desc" data-i18n="aboutValue4Desc">${t('aboutValue4Desc')}</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  `;

  // Animated stats counter
  animateStats(container);

  // Scroll reveal for cert badges and value cards
  setupScrollReveal(container);
}

function animateStats(container) {
  const statsRow = container.querySelector('.about-stats');
  if (!statsRow) return;

  const statEls = statsRow.querySelectorAll('.about-stat__number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statEls.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          const format = el.dataset.format;
          const duration = 1500;
          const startTime = performance.now();

          function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);

            if (format === 'k' && current >= 1000) {
              el.textContent = (current / 1000).toFixed(progress >= 1 ? 0 : 1) + 'K' + suffix;
            } else {
              el.textContent = current + suffix;
            }

            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsRow);
}

function setupScrollReveal(container) {
  const elements = container.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal-on-scroll')) : [entry.target];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

export function updateAboutLanguage(container) {
  // Update all data-i18n elements
  const i18nEls = container.querySelectorAll('[data-i18n]');
  i18nEls.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });
}
