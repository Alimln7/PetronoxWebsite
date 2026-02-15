import { $, on } from '../utils/dom.js';
import { state } from '../state.js';
import { setLanguage, t } from '../i18n.js';
import { navigateTo, scrollToContent } from '../router.js';

export function initHeader() {
  setupNavButtons();
  setupMobileMenu();
  setupLanguageToggle();
  setupStickyHeader();
  setupClickOutside();
}

function setupNavButtons() {
  const sections = [
    { btnId: 'btnHome', dropId: 'dropHome', section: 'home' },
    { btnId: 'btnAboutUs', dropId: 'dropAboutUs', section: 'about' },
    { btnId: 'btnProducts', dropId: 'dropProducts', section: 'products' },
    { btnId: 'btnOilFinder', dropId: 'dropOilFinder', section: 'oil-finder' },
    { btnId: 'btnContactUs', dropId: 'dropContactUs', section: 'contact' }
  ];

  sections.forEach(({ btnId, dropId, section }) => {
    const btn = $(`#${btnId}`);
    const drop = $(`#${dropId}`);

    if (btn) {
      on(btn, 'click', () => navigateTo(section));
    }
    if (drop) {
      on(drop, 'click', () => navigateTo(section));
    }
  });
}

function setupMobileMenu() {
  const menuBtn = $('.menu-button');
  const menu = $('#dropdownMenu');

  if (menuBtn && menu) {
    on(menuBtn, 'click', () => {
      menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
}

function setupLanguageToggle() {
  const langButton = $('#langButton');
  const langDropdown = $('#langDropdown');
  const mobileLangSelect = $('#mobileLangSelect');

  if (langButton && langDropdown) {
    on(langButton, 'click', () => {
      langDropdown.style.display = langDropdown.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // Desktop language buttons
  const langBtns = langDropdown ? langDropdown.querySelectorAll('button') : [];
  langBtns.forEach(btn => {
    on(btn, 'click', () => {
      const lang = btn.dataset.lang;
      if (lang) {
        setLanguage(lang);
        if (langDropdown) langDropdown.style.display = 'none';
      }
    });
  });

  // Mobile language select
  if (mobileLangSelect) {
    on(mobileLangSelect, 'change', () => {
      setLanguage(mobileLangSelect.value);
    });
  }
}

function setupStickyHeader() {
  const header = $('.header');
  if (!header) return;

  let lastScroll = 0;

  on(window, 'scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

function setupClickOutside() {
  on(window, 'click', (e) => {
    const menu = $('#dropdownMenu');
    const menuButton = $('.menu-button');
    const langMenu = $('#langDropdown');
    const langButton = $('#langButton');

    if (menu && menuButton && !menu.contains(e.target) && !menuButton.contains(e.target)) {
      menu.style.display = 'none';
    }

    if (langMenu && langButton && !langMenu.contains(e.target) && !langButton.contains(e.target)) {
      langMenu.style.display = 'none';
    }
  });
}

export function updateHeaderLanguage() {
  const elements = {
    '#siteTitle': 'siteTitle',
    '#siteSubtitle': 'siteSubtitle',
    '#btnHome .btn-text': 'btnHome',
    '#btnAboutUs .btn-text': 'btnAboutUs',
    '#btnProducts .btn-text': 'btnProducts',
    '#btnOilFinder .btn-text': 'btnOilFinder',
    '#btnContactUs .btn-text': 'btnContactUs',
    '#langLabel': 'langLabel',
    '#bannerTitle': 'bannerTitle',
    '#bannerSubtitle': 'bannerSubtitle',
    '#bannerCTA': 'bannerCTA',
    '#dropHome .btn-text': 'btnHome',
    '#dropAboutUs .btn-text': 'btnAboutUs',
    '#dropProducts .btn-text': 'btnProducts',
    '#dropOilFinder .btn-text': 'btnOilFinder',
    '#dropContactUs .btn-text': 'btnContactUs'
  };

  // Elements that contain HTML (spans, SVGs) need innerHTML
  const htmlElements = ['#bannerTitle', '#bannerSubtitle', '#bannerCTA'];

  Object.entries(elements).forEach(([selector, key]) => {
    const el = $(selector);
    if (!el) return;
    if (htmlElements.includes(selector)) {
      el.innerHTML = t(key);
    } else {
      el.textContent = t(key);
    }
  });

  const mobileLang = $('#mobileLangSelect');
  if (mobileLang) mobileLang.value = state.language;
}
