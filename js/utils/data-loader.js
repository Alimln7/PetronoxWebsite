import { state } from '../state.js';

/* ============================================
   DATA LOADER — Static JSON Client
   Fetches vehicle data from pre-built JSON files.
   No backend server required.
   ============================================ */

const BASE = 'data/vehicles';

// Local cache (avoids repeat fetches)
const cache = {
  categories: null,
  brands: {},
  models: {},    // stores { model: [types] } per category|brand
  details: {},   // stores full detail per category|brand|model
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return res.json();
}

// ── Dropdown data (called by oil-finder.js) ──

export async function loadCategories() {
  if (cache.categories) return cache.categories;
  cache.categories = await fetchJson(`${BASE}/categories.json`);
  return cache.categories;
}

export async function loadBrands(category) {
  if (cache.brands[category]) return cache.brands[category];
  cache.brands[category] = await fetchJson(
    `${BASE}/brands/${encodeURIComponent(category)}.json`
  );
  return cache.brands[category];
}

export async function loadModels(category, brand) {
  const key = `${category}|${brand}`;
  if (cache.models[key]) return Object.keys(cache.models[key]);
  cache.models[key] = await fetchJson(
    `${BASE}/models/${encodeURIComponent(category)}/${encodeURIComponent(brand)}.json`
  );
  return Object.keys(cache.models[key]);
}

export async function loadTypes(category, brand, model) {
  const key = `${category}|${brand}`;
  // models file is already cached from loadModels call
  if (!cache.models[key]) {
    cache.models[key] = await fetchJson(
      `${BASE}/models/${encodeURIComponent(category)}/${encodeURIComponent(brand)}.json`
    );
  }
  return cache.models[key][model] || [];
}

// ── Vehicle detail ──

export async function getVehicleData(category, brand, model, type) {
  const key = `${category}|${brand}|${model}`;
  if (!cache.details[key]) {
    cache.details[key] = await fetchJson(
      `${BASE}/details/${encodeURIComponent(category)}/${encodeURIComponent(brand)}/${encodeURIComponent(model)}.json`
    );
  }
  const data = cache.details[key][type];
  return data && Object.keys(data).length > 0 ? data : null;
}

// ── Boot-time loaders (called from main.js) ──

export async function loadVehicleData(onProgress) {
  if (onProgress) onProgress(30, 'Loading vehicle data...');
  await loadCategories();
  if (onProgress) onProgress(60, 'Vehicle data ready!');
  return {};
}

export async function loadProductsData(onProgress) {
  if (state.productsData) return state.productsData;
  if (onProgress) onProgress(70, 'Loading product information...');
  state.productsData = await fetchJson('data/products_description.json');
  return state.productsData;
}

// ── Utility functions ──

export function getOilImage(oilName) {
  if (oilName.includes("40")) {
    return 'icons/prod4.png';
  }
  const randomNum = Math.floor(Math.random() * 3) + 1;
  return `icons/prod${randomNum}.png`;
}

export function waitForImagesIn(container) {
  const imgs = Array.from(container.querySelectorAll('img'));
  if (!imgs.length) return Promise.resolve();
  return Promise.all(imgs.map(img => new Promise(resolve => {
    if (img.complete) return resolve();
    img.addEventListener('load', resolve);
    img.addEventListener('error', resolve);
  })));
}
