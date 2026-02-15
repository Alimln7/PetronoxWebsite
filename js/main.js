// Petronox v2 - App Entry Point
import { state, subscribe } from './state.js';
import { initI18n, setLanguage, t } from './i18n.js';
import { initRouter, navigateTo, registerRoute, scrollToContent } from './router.js';
import { $ } from './utils/dom.js';
import { loadVehicleData, loadProductsData } from './utils/data-loader.js';
import { initHeader, updateHeaderLanguage } from './components/header.js';
import { updateLoadingProgress, updateLoadingText, hideGlobalLoading } from './components/loading.js';
import { initBackToTop } from './components/back-to-top.js';

// Section renderers
import { renderHome, updateHomeLanguage } from './sections/home.js';
import { renderAbout, updateAboutLanguage } from './sections/about.js';
import { renderProducts, updateProductsLanguage } from './sections/products.js';
import { renderOilFinder, updateOilFinderLanguage } from './sections/oil-finder.js';
import { renderContact, updateContactLanguage } from './sections/contact.js';

// Section renderer map
const sectionRenderers = {
  'home': renderHome,
  'about': renderAbout,
  'products': renderProducts,
  'oil-finder': renderOilFinder,
  'contact': renderContact
};

const sectionLanguageUpdaters = {
  'home': updateHomeLanguage,
  'about': updateAboutLanguage,
  'products': updateProductsLanguage,
  'oil-finder': updateOilFinderLanguage,
  'contact': updateContactLanguage
};

async function boot() {
  try {
    // Phase 1: Initialize core systems
    updateLoadingText('Initializing...', 5);
    initI18n();
    initRouter();
    initHeader();

    // Phase 2: Load vehicle data with progress
    updateLoadingText('Loading vehicle data...', 10);
    try {
      await loadVehicleData((progress, text) => {
        updateLoadingText(text, progress);
      });
    } catch (e) {
      console.warn('Vehicle data unavailable:', e.message);
      updateLoadingText('Vehicle data unavailable — continuing...', 60);
    }

    // Phase 3: Load products data
    updateLoadingText('Loading products...', 65);
    try {
      await loadProductsData((progress, text) => {
        updateLoadingText(text, progress);
      });
    } catch (e) {
      console.warn('Products data unavailable:', e.message);
      updateLoadingText('Products data unavailable — continuing...', 75);
    }

    // Phase 4: Setup section routing
    updateLoadingText('Setting up sections...', 80);
    setupSectionRouting();

    // Phase 5: Navigate to initial section
    updateLoadingText('Almost ready...', 90);
    const initialHash = window.location.hash.slice(1);
    const targetSection = sectionRenderers[initialHash] ? initialHash : 'home';
    await renderSection(targetSection);
    navigateTo(targetSection);

    // Phase 6: Initialize extras
    updateLoadingText('Ready!', 100);
    initBackToTop();

    // Subscribe to language changes
    subscribe('languageChanged', handleLanguageChange);

    // Smooth hide loading
    setTimeout(() => {
      hideGlobalLoading();
    }, 300);

    state.isFirstLoad = false;
  } catch (err) {
    console.error('Boot failed:', err);
    updateLoadingText('Loading failed. Please refresh.', 0);
  }
}

function setupSectionRouting() {
  // Register routes
  Object.keys(sectionRenderers).forEach(section => {
    registerRoute(section, () => renderSection(section));
  });

  // Listen for section changes
  subscribe('sectionChanged', async (section) => {
    await renderSection(section);
  });
}

async function renderSection(section) {
  const container = $('#contentSection');
  if (!container) return;

  const renderer = sectionRenderers[section];
  if (!renderer) return;

  // Show banner only on home page
  const banner = $('.banner');
  if (banner) {
    banner.style.display = section === 'home' ? '' : 'none';
  }

  // Add fade-out
  container.classList.add('content--loading');

  // Short delay for animation
  await new Promise(r => setTimeout(r, 150));

  // Render section
  await renderer(container);

  // Scroll to content area
  if (!state.isFirstLoad) {
    scrollToContent();
  }

  // Add fade-in
  container.classList.remove('content--loading');
  container.classList.add('content--ready');

  // Clean up animation class
  setTimeout(() => {
    container.classList.remove('content--ready');
  }, 500);
}

function handleLanguageChange(lang) {
  // Update header
  updateHeaderLanguage();

  // Update current section
  const container = $('#contentSection');
  if (!container) return;

  const updater = sectionLanguageUpdaters[state.currentSection];
  if (updater) {
    updater(container);
  }
}

// Boot the app
boot();
