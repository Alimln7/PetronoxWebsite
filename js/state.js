// Central state management
export const state = {
  language: 'en',
  currentSection: null,
  productsData: null,
  sectionCache: {
    home: null,
    about: null,
    products: null,
    contact: null,
    oilFinder: null
  },
  loadedImages: new Set(),
  isFirstLoad: true,
  intervals: [] // Track intervals for cleanup
};

// Simple pub/sub
const listeners = {};

export function subscribe(key, callback) {
  if (!listeners[key]) listeners[key] = [];
  listeners[key].push(callback);
  return () => {
    listeners[key] = listeners[key].filter(cb => cb !== callback);
  };
}

export function notify(key, value) {
  if (listeners[key]) {
    listeners[key].forEach(cb => cb(value));
  }
}

export function registerInterval(id) {
  state.intervals.push(id);
}

export function clearAllIntervals() {
  state.intervals.forEach(id => clearInterval(id));
  state.intervals = [];
}

export function getState() {
  return state;
}
