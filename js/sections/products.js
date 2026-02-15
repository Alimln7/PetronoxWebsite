import { state } from '../state.js';
import { t } from '../i18n.js';
import { $, on } from '../utils/dom.js';
import { loadProductsData } from '../utils/data-loader.js';
import { observeImages, loadImagesNow } from '../utils/lazy-load.js';

export async function renderProducts(container) {
  // Load products data if not cached
  if (!state.productsData) {
    await loadProductsData();
  }

  container.innerHTML = `
    <div class="section" id="productsSection">
      <div class="section__content">
        <div class="section-title" data-i18n="productsTitle">${t('productsTitle')}</div>
        <div class="products-grid" id="productsGrid"></div>
      </div>
    </div>
  `;

  setupProductsGrid(container);
  setTimeout(() => observeImages(container), 100);
}

function setupProductsGrid(container) {
  const grid = container.querySelector('#productsGrid');
  if (!grid || !state.productsData) return;

  grid.innerHTML = '';

  Object.keys(state.productsData).forEach(productName => {
    const card = document.createElement('div');
    card.className = 'card card--product';
    card.dataset.productName = productName;

    const imageName = productName.replace(/\s+/g, '_') + '.jpeg';

    const img = document.createElement('img');
    img.setAttribute('data-src', `images/products/outside/${imageName}`);
    img.alt = productName;
    img.className = 'product-image';

    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = productName;

    card.appendChild(img);
    card.appendChild(name);

    on(card, 'click', () => {
      container.querySelectorAll('.card--product').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      showProductDetails(container, productName, state.productsData[productName], imageName);
    });

    grid.appendChild(card);
  });

  // Load images
  setTimeout(() => observeImages(grid), 50);
}

function showProductDetails(container, productName, productData, imageName) {
  const content = container.querySelector('.section__content');
  if (!content) return;

  const detailView = document.createElement('div');
  detailView.className = 'product-detail-view';

  // Image section
  const imgSection = document.createElement('div');
  imgSection.className = 'product-detail-image';

  const img = document.createElement('img');
  img.src = `images/products/inside/${imageName}`;
  img.alt = productName;
  imgSection.appendChild(img);

  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-products';
  backBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><polyline points="15 18 9 12 15 6"/></svg> ${t('viewOtherProducts')}`;
  imgSection.appendChild(backBtn);

  // Info section
  const infoSection = document.createElement('div');
  infoSection.className = 'product-detail-info';

  const title = document.createElement('h2');
  title.className = 'product-detail-name';
  title.textContent = productName;

  const desc = document.createElement('div');
  desc.className = 'product-detail-description';
  if (productData && productData.description) {
    desc.innerHTML = productData.description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  }

  infoSection.appendChild(title);
  infoSection.appendChild(desc);

  detailView.appendChild(imgSection);
  detailView.appendChild(infoSection);

  // Replace grid with detail
  content.innerHTML = '';
  const titleEl = document.createElement('div');
  titleEl.className = 'section-title';
  titleEl.textContent = t('productsTitle');
  titleEl.setAttribute('data-i18n', 'productsTitle');
  content.appendChild(titleEl);
  content.appendChild(detailView);

  // Back button
  on(backBtn, 'click', () => {
    content.innerHTML = '';
    const titleEl2 = document.createElement('div');
    titleEl2.className = 'section-title';
    titleEl2.textContent = t('productsTitle');
    titleEl2.setAttribute('data-i18n', 'productsTitle');
    content.appendChild(titleEl2);

    const grid = document.createElement('div');
    grid.className = 'products-grid';
    grid.id = 'productsGrid';
    content.appendChild(grid);

    setupProductsGrid(container);
  });

  detailView.scrollIntoView({ behavior: 'smooth' });
}

export function updateProductsLanguage(container) {
  const title = container.querySelector('[data-i18n="productsTitle"]');
  if (title) title.textContent = t('productsTitle');
}
