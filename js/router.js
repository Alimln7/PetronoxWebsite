import { state, notify, clearAllIntervals } from './state.js';
import { $, $$ } from './utils/dom.js';

const routes = {
  'home': null,
  'about': null,
  'products': null,
  'oil-finder': null,
  'contact': null
};

export function initRouter() {
  // Handle browser back/forward
  window.addEventListener('hashchange', handleHashChange);
  
  // Handle initial hash
  const initialHash = window.location.hash.slice(1);
  if (initialHash && routes.hasOwnProperty(initialHash)) {
    // Will be triggered after initial data load
  }
}

function handleHashChange() {
  const hash = window.location.hash.slice(1);
  if (hash && routes.hasOwnProperty(hash)) {
    navigateTo(hash);
  }
}

export function navigateTo(section) {
  // Clean up existing intervals
  clearAllIntervals();
  
  // Update state
  state.currentSection = section;
  
  // Update URL hash without triggering hashchange
  const currentHash = window.location.hash.slice(1);
  if (currentHash !== section) {
    history.pushState(null, null, `#${section}`);
  }
  
  // Update active nav buttons
  updateActiveNav(section);
  
  // Notify section change
  notify('sectionChanged', section);
}

function updateActiveNav(section) {
  // Map section names to button IDs
  const sectionToBtn = {
    'home': 'btnHome',
    'about': 'btnAboutUs',
    'products': 'btnProducts',
    'oil-finder': 'btnOilFinder',
    'contact': 'btnContactUs'
  };
  
  const sectionToDrop = {
    'home': 'dropHome',
    'about': 'dropAboutUs',
    'products': 'dropProducts',
    'oil-finder': 'dropOilFinder',
    'contact': 'dropContactUs'
  };
  
  // Remove active from all
  $$('.nav-buttons .btn--nav').forEach(b => b.classList.remove('active'));
  $$('.dropdown-menu button').forEach(b => b.classList.remove('active'));
  
  // Add active to current
  const btnId = sectionToBtn[section];
  const dropId = sectionToDrop[section];
  
  if (btnId) {
    const btn = $(`#${btnId}`);
    if (btn) btn.classList.add('active');
  }
  if (dropId) {
    const drop = $(`#${dropId}`);
    if (drop) drop.classList.add('active');
  }
  
  // Close mobile menu
  const menu = $('#dropdownMenu');
  if (menu && window.innerWidth <= 900) {
    menu.style.display = 'none';
  }
}

export function scrollToContent() {
  const contentSection = $('#contentSection');
  const divider = $('.divider');
  
  if (contentSection && divider) {
    const dividerRect = divider.getBoundingClientRect();
    const scrollPosition = window.scrollY + dividerRect.bottom;
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }
}

export function registerRoute(name, handler) {
  routes[name] = handler;
}
