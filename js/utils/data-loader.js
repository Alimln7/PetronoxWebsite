import { state } from '../state.js';

/* ============================================
   DATA LOADER — API Client
   Fetches vehicle data from the Python backend
   instead of loading 157MB of JSON in-browser.
   ============================================ */

const API = '/api';

// Local cache for dropdown data (avoids repeat API calls)
const cache = {
  categories: null,
  brands: {},
  models: {},
  types: {},
};

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API ${url}: ${res.status}`);
  return res.json();
}

// ── Dropdown data (called by oil-finder.js) ──

export async function loadCategories() {
  if (cache.categories) return cache.categories;
  cache.categories = await fetchJson(`${API}/categories`);
  return cache.categories;
}

export async function loadBrands(category) {
  const key = category;
  if (cache.brands[key]) return cache.brands[key];
  cache.brands[key] = await fetchJson(
    `${API}/brands?category=${encodeURIComponent(category)}`
  );
  return cache.brands[key];
}

export async function loadModels(category, brand) {
  const key = `${category}|${brand}`;
  if (cache.models[key]) return cache.models[key];
  cache.models[key] = await fetchJson(
    `${API}/models?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}`
  );
  return cache.models[key];
}

export async function loadTypes(category, brand, model) {
  const key = `${category}|${brand}|${model}`;
  if (cache.types[key]) return cache.types[key];
  cache.types[key] = await fetchJson(
    `${API}/types?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`
  );
  return cache.types[key];
}

// ── Vehicle detail ──

export async function getVehicleData(category, brand, model, type) {
  const data = await fetchJson(
    `${API}/vehicle?category=${encodeURIComponent(category)}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&type=${encodeURIComponent(type)}`
  );
  return Object.keys(data).length > 0 ? data : null;
}

// ── Search / autocomplete ──

export async function searchTypes(query) {
  if (!query) return [];
  const results = await fetchJson(
    `${API}/search?q=${encodeURIComponent(query)}`
  );
  return results.map(r => r.type);
}

export async function findVehicleByType(query) {
  if (!query) return null;
  const results = await fetchJson(
    `${API}/search?q=${encodeURIComponent(query)}`
  );
  // Exact match first (case-insensitive)
  const exact = results.find(r => r.type.toLowerCase() === query.toLowerCase());
  if (exact) return { category: exact.category, brand: exact.brand, model: exact.model, type: exact.type };
  // Otherwise first result
  return results.length > 0
    ? { category: results[0].category, brand: results[0].brand, model: results[0].model, type: results[0].type }
    : null;
}

// ── Boot-time loaders (called from main.js) ──

export async function loadVehicleData(onProgress) {
  // Now resolves in milliseconds — just pre-fetches categories (~1KB)
  if (onProgress) onProgress(30, 'Connecting to server...');
  await loadCategories();
  if (onProgress) onProgress(60, 'Vehicle data ready!');
  return {};
}

export async function loadProductsData(onProgress) {
  if (state.productsData) return state.productsData;
  if (onProgress) onProgress(70, 'Loading product information...');
  try {
    state.productsData = await fetchJson(`${API}/products`);
  } catch (e) {
    // Fallback: load from local JSON file if API is unavailable
    console.warn('API unavailable, loading products from local file');
    state.productsData = await fetchJson('data/products_description.json');
  }
  return state.productsData;
}

// ── Utility functions (unchanged) ──

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
