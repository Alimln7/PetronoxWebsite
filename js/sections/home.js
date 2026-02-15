import { state } from '../state.js';
import { t } from '../i18n.js';
import { $, on, setHTML } from '../utils/dom.js';
import { initSlider } from '../components/slider.js';
import { observeImages } from '../utils/lazy-load.js';
import { navigateTo, scrollToContent } from '../router.js';

export function renderHome(container) {
  container.innerHTML = `
    <div class="section" id="homeSection">
      <div class="section__content">
        <div class="home-card">

          <!-- Hero Welcome -->
          <div class="home-welcome">
            <h2 data-i18n="homeWelcome">${t('homeWelcome')}</h2>
            <p class="black-bold-text" data-i18n="homeWelcomeSubtitle">${t('homeWelcomeSubtitle')}</p>
          </div>

          <!-- IRI Certification Section -->
          <div class="home-certifications">
            <h3 class="home-certifications__title" data-i18n="certSectionTitle">${t('certSectionTitle')}</h3>
            <p class="home-certifications__subtitle" data-i18n="certSectionSubtitle">${t('certSectionSubtitle')}</p>
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

          <!-- ASTM Standards Strip -->
          <div class="astm-strip reveal-on-scroll">
            <div class="astm-strip__title" data-i18n="astmStripTitle">${t('astmStripTitle')}</div>
            <div class="astm-strip__items">
              <div class="astm-item"><span class="astm-item__code">D445</span><span class="astm-item__name" data-i18n="astmD445">${t('astmD445')}</span></div>
              <div class="astm-item"><span class="astm-item__code">D92</span><span class="astm-item__name" data-i18n="astmD92">${t('astmD92')}</span></div>
              <div class="astm-item"><span class="astm-item__code">D97</span><span class="astm-item__name" data-i18n="astmD97">${t('astmD97')}</span></div>
              <div class="astm-item"><span class="astm-item__code">D1298</span><span class="astm-item__name" data-i18n="astmD1298">${t('astmD1298')}</span></div>
              <div class="astm-item"><span class="astm-item__code">D892</span><span class="astm-item__name" data-i18n="astmD892">${t('astmD892')}</span></div>
              <div class="astm-item"><span class="astm-item__code">D2270</span><span class="astm-item__name" data-i18n="astmD2270">${t('astmD2270')}</span></div>
            </div>
          </div>

          <!-- Product Slider Section -->
          <div class="home-block">
            <div class="home-block__header">
              <h3 class="home-block__title" data-i18n="homeQualityOils">${t('homeQualityOils')}</h3>
            </div>
            <div class="slider">
              <button class="slider__nav slider__nav--prev" aria-label="Previous slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div class="slider__track" id="horizontalSlider"></div>
              <button class="slider__nav slider__nav--next" aria-label="Next slide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>

          <!-- Feature Cards Row -->
          <div class="home-features">
            <a href="#about" class="home-feature reveal-on-scroll" data-nav="about">
              <div class="home-feature__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <div class="home-feature__text">
                <h4>${t('btnAboutUs')}</h4>
                <p id="homeLearnMore">${t('homeLearnMore')}</p>
              </div>
              <span class="home-feature__arrow">&rsaquo;</span>
            </a>
            <a href="#products" class="home-feature reveal-on-scroll" data-nav="products">
              <div class="home-feature__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </div>
              <div class="home-feature__text">
                <h4>${t('btnProducts')}</h4>
                <p id="homeSeeProducts">${t('homeSeeProducts')}</p>
              </div>
              <span class="home-feature__arrow">&rsaquo;</span>
            </a>
            <a href="#oil-finder" class="home-feature reveal-on-scroll" data-nav="oil-finder">
              <div class="home-feature__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div class="home-feature__text">
                <h4>${t('btnOilFinder')}</h4>
                <p id="homeFindOil">${t('homeFindOil')}</p>
              </div>
              <span class="home-feature__arrow">&rsaquo;</span>
            </a>
            <a href="#contact" class="home-feature reveal-on-scroll" data-nav="contact">
              <div class="home-feature__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="home-feature__text">
                <h4>${t('btnContactUs')}</h4>
                <p id="homeNeedHelp">${t('homeNeedHelp')}</p>
              </div>
              <span class="home-feature__arrow">&rsaquo;</span>
            </a>
          </div>

          <!-- Footer Text -->
          <div class="home-final-text" data-i18n="homeFinal">${t('homeFinal')}</div>

        </div>
      </div>
    </div>
  `;

  // Setup navigation links
  setupNavLinks(container);

  // Initialize slider with product images
  initSlider({
    sliderId: 'horizontalSlider',
    prevSelector: '.slider__nav--prev',
    nextSelector: '.slider__nav--next',
    containerSelector: '.slider',
    imageFolder: 'horizontalShowInHomeSection',
    imageFiles: ['1.png', '2.png', '3.png', '4.png'],
    itemClass: 'slider__item',
    imageClass: 'slider__image',
    altPrefix: 'Product'
  });

  // Lazy load images
  setTimeout(() => observeImages(container), 100);

  // Setup scroll reveal animations
  setupScrollReveal(container);
}

function setupNavLinks(container) {
  const links = container.querySelectorAll('[data-nav]');
  links.forEach(link => {
    on(link, 'click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.nav);
    });
  });
}

function setupScrollReveal(container) {
  const elements = container.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings
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

export function updateHomeLanguage(container) {
  const simpleUpdates = {
    '.home-welcome h2': 'homeWelcome',
    '.home-welcome .black-bold-text': 'homeWelcomeSubtitle',
    '[data-i18n="homeQualityOils"]': 'homeQualityOils',
    '.home-final-text': 'homeFinal',
    '.home-certifications__title': 'certSectionTitle',
    '.home-certifications__subtitle': 'certSectionSubtitle',
    '.astm-strip__title': 'astmStripTitle'
  };

  Object.entries(simpleUpdates).forEach(([selector, key]) => {
    const el = container.querySelector(selector);
    if (el) el.textContent = t(key);
  });

  // Update feature card descriptions
  const featureUpdates = {
    '#homeLearnMore': 'homeLearnMore',
    '#homeSeeProducts': 'homeSeeProducts',
    '#homeFindOil': 'homeFindOil',
    '#homeNeedHelp': 'homeNeedHelp'
  };

  Object.entries(featureUpdates).forEach(([selector, key]) => {
    const el = container.querySelector(selector);
    if (el) el.textContent = t(key);
  });

  // Update feature card titles
  const features = container.querySelectorAll('.home-feature');
  const titleKeys = ['btnAboutUs', 'btnProducts', 'btnOilFinder', 'btnContactUs'];
  features.forEach((f, i) => {
    const h4 = f.querySelector('h4');
    if (h4 && titleKeys[i]) h4.textContent = t(titleKeys[i]);
  });

  // Update all data-i18n elements in cert/astm sections
  container.querySelectorAll('.cert-badge [data-i18n], .astm-strip [data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) el.textContent = t(key);
  });

  setupNavLinks(container);
}
