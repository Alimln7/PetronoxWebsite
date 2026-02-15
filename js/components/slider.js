import { registerInterval } from '../state.js';
import { on } from '../utils/dom.js';
import { loadImagesNow } from '../utils/lazy-load.js';

/**
 * Professional slider with CSS-transform sliding, dot indicators,
 * touch/swipe & mouse drag, smooth transitions, and keyboard nav.
 */
export function initSlider(config) {
  const {
    sliderId,
    prevSelector,
    nextSelector,
    containerSelector,
    imageFolder,
    imageFiles,
    itemClass,
    imageClass,
    altPrefix = 'Image',
    autoplaySpeed = 4000
  } = config;

  const track = document.getElementById(sliderId);
  if (!track) return null;

  const sliderRoot = document.querySelector(containerSelector);
  if (!sliderRoot) return null;

  const prevBtn = sliderRoot.querySelector('.slider__nav--prev') ||
                  document.querySelector(prevSelector);
  const nextBtn = sliderRoot.querySelector('.slider__nav--next') ||
                  document.querySelector(nextSelector);

  // ── Responsive items-per-view ──
  function getItemsPerView() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 900) return 2;
    return 3; // always max 3 on desktop so slider stays interactive
  }

  let itemsPerView = getItemsPerView();
  const totalSlides = imageFiles.length;
  let currentIndex = 0;
  let isTransitioning = false;
  const GAP_PX = 20; // must match CSS gap

  // ── Build all items once into the track ──
  function buildTrack() {
    track.innerHTML = '';
    imageFiles.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = itemClass;

      const img = document.createElement('img');
      img.setAttribute('data-src', `${imageFolder}/${file}`);
      img.alt = `${altPrefix} ${i + 1}`;
      img.className = imageClass;
      item.appendChild(img);

      track.appendChild(item);
    });

    loadImagesNow(track);
    updateTrackPosition(false);
  }

  // ── Dots / Indicators ──
  // Place dots AFTER the slider element (sibling, not child) so overflow:hidden doesn't clip them
  let dotsContainer = sliderRoot.parentNode.querySelector('.slider__dots');
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider__dots';
    sliderRoot.insertAdjacentElement('afterend', dotsContainer);
  }

  function getStopCount() {
    // Number of positions the slider can be in (each index is a stop)
    const maxIndex = totalSlides - itemsPerView;
    return maxIndex + 1; // e.g. 4 images, 3 per view = 2 stops (index 0 and 1)
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const stops = getStopCount();
    if (stops <= 1) return;

    const counter = document.createElement('span');
    counter.className = 'slider__counter';
    counter.textContent = `${currentIndex + 1} / ${stops}`;
    dotsContainer.appendChild(counter);

    for (let i = 0; i < stops; i++) {
      const dot = document.createElement('button');
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', `Go to position ${i + 1}`);
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.slider__dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));

    const counter = dotsContainer.querySelector('.slider__counter');
    const stops = getStopCount();
    if (counter && stops > 1) counter.textContent = `${currentIndex + 1} / ${stops}`;
  }

  // ── Track sliding ──
  function getTranslateValue(index) {
    // Measure real item width from DOM for pixel-perfect sliding
    const firstItem = track.children[0];
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth;
      const offset = index * (itemWidth + GAP_PX);
      return `${-offset}px`;
    }
    // Fallback to percentage calc
    const pct = -(index * (100 / itemsPerView));
    const gapOffset = index * GAP_PX;
    return `calc(${pct}% - ${gapOffset}px)`;
  }

  function updateTrackPosition(animate = true) {
    track.style.transition = animate
      ? 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)'
      : 'none';

    track.style.transform = `translateX(${getTranslateValue(currentIndex)})`;

    if (animate) {
      isTransitioning = true;
      setTimeout(() => { isTransitioning = false; }, 600);
    }

    updateDots();
  }

  // ── Navigation — advance 1 item at a time for smooth feel ──
  function nextSlide() {
    if (isTransitioning) return;
    const maxIndex = totalSlides - itemsPerView;
    if (maxIndex <= 0) return;

    if (currentIndex >= maxIndex) {
      currentIndex = 0; // wrap to start
    } else {
      currentIndex++;
    }
    updateTrackPosition(true);
  }

  function prevSlide() {
    if (isTransitioning) return;
    const maxIndex = totalSlides - itemsPerView;
    if (maxIndex <= 0) return;

    if (currentIndex <= 0) {
      currentIndex = maxIndex; // wrap to end
    } else {
      currentIndex--;
    }
    updateTrackPosition(true);
  }

  function goToPage(page) {
    if (isTransitioning) return;
    const maxIndex = totalSlides - itemsPerView;
    currentIndex = Math.min(page, maxIndex);
    updateTrackPosition(true);
  }

  // ── Button events ──
  if (prevBtn) on(prevBtn, 'click', prevSlide);
  if (nextBtn) on(nextBtn, 'click', nextSlide);

  // ── Touch / Swipe ──
  let touchStartX = 0;
  let touchDeltaX = 0;
  let isSwiping = false;

  on(track, 'touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    isSwiping = false;
    track.style.transition = 'none';
  }, { passive: true });

  on(track, 'touchmove', (e) => {
    const dx = e.touches[0].clientX - touchStartX;
    const dy = e.touches[0].clientY - (e.touches[0]._startY || e.touches[0].clientY);

    if (!isSwiping && Math.abs(dx) > 10) {
      isSwiping = true;
    }

    if (isSwiping) {
      touchDeltaX = dx;
      const baseVal = getTranslateValue(currentIndex);
      // If pixel-based, add delta directly
      if (baseVal.endsWith('px')) {
        const basePx = parseFloat(baseVal);
        track.style.transform = `translateX(${basePx + touchDeltaX}px)`;
      } else {
        track.style.transform = `translateX(calc(${baseVal} + ${touchDeltaX}px))`;
      }
    }
  }, { passive: true });

  on(track, 'touchend', () => {
    if (!isSwiping) return;
    const threshold = track.offsetWidth * 0.12;
    if (touchDeltaX < -threshold) {
      nextSlide();
    } else if (touchDeltaX > threshold) {
      prevSlide();
    } else {
      updateTrackPosition(true);
    }
    isSwiping = false;
  });

  // ── Mouse drag ──
  let mouseDown = false;
  let mouseStartX = 0;
  let mouseDeltaX = 0;

  on(track, 'mousedown', (e) => {
    mouseDown = true;
    mouseStartX = e.clientX;
    mouseDeltaX = 0;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });

  on(window, 'mousemove', (e) => {
    if (!mouseDown) return;
    mouseDeltaX = e.clientX - mouseStartX;
    const baseVal = getTranslateValue(currentIndex);
    if (baseVal.endsWith('px')) {
      const basePx = parseFloat(baseVal);
      track.style.transform = `translateX(${basePx + mouseDeltaX}px)`;
    } else {
      track.style.transform = `translateX(calc(${baseVal} + ${mouseDeltaX}px))`;
    }
  });

  on(window, 'mouseup', () => {
    if (!mouseDown) return;
    mouseDown = false;
    track.style.cursor = '';
    const threshold = track.offsetWidth * 0.12;
    if (mouseDeltaX < -threshold) {
      nextSlide();
    } else if (mouseDeltaX > threshold) {
      prevSlide();
    } else {
      updateTrackPosition(true);
    }
  });

  // Prevent image ghost drag
  on(track, 'dragstart', (e) => e.preventDefault());

  // ── Autoplay ──
  let autoInterval = null;

  function startAutoplay() {
    stopAutoplay();
    autoInterval = setInterval(nextSlide, autoplaySpeed);
    registerInterval(autoInterval);
  }

  function stopAutoplay() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  on(sliderRoot, 'mouseenter', stopAutoplay);
  on(sliderRoot, 'mouseleave', startAutoplay);
  on(sliderRoot, 'focusin', stopAutoplay);
  on(sliderRoot, 'focusout', startAutoplay);

  // ── Keyboard ──
  on(sliderRoot, 'keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); stopAutoplay(); }
    if (e.key === 'ArrowRight') { nextSlide(); stopAutoplay(); }
  });

  // ── Resize ──
  let resizeTimer;
  on(window, 'resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPerView = getItemsPerView();
      if (newPerView !== itemsPerView) {
        itemsPerView = newPerView;
        currentIndex = 0;
        sliderRoot.style.setProperty('--items-per-view', itemsPerView);
        buildDots();
      }
      // Always recalculate position (item widths change on resize)
      updateTrackPosition(false);
    }, 200);
  });

  // ── Init ──
  sliderRoot.style.setProperty('--items-per-view', itemsPerView);
  sliderRoot.setAttribute('tabindex', '0');
  sliderRoot.setAttribute('role', 'region');
  sliderRoot.setAttribute('aria-label', `${altPrefix} carousel`);
  buildTrack();
  buildDots();
  startAutoplay();

  return { nextSlide, prevSlide, goToPage, destroy: stopAutoplay };
}

