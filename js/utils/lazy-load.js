let observer = null;

export function initLazyLoad() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('lazy-loaded');
      img.removeAttribute('data-src');
    });
    return;
  }
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('lazy-loaded');
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });
}

export function observeImages(container = document) {
  if (!observer) initLazyLoad();
  
  const lazyImages = container.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    if (observer) {
      observer.observe(img);
    } else {
      // Fallback
      img.src = img.dataset.src;
      img.classList.add('lazy-loaded');
      img.removeAttribute('data-src');
    }
  });
}

export function loadImagesNow(container) {
  const images = container.querySelectorAll('img[data-src]');
  images.forEach(img => {
    img.src = img.dataset.src;
    img.classList.add('lazy-loaded');
    img.removeAttribute('data-src');
  });
}
