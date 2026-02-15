import { $ } from '../utils/dom.js';

export function updateLoadingProgress(percentage) {
  const progressBar = $('#loadingProgressBar');
  const percentageText = $('#loadingPercentage');

  if (progressBar) progressBar.style.width = percentage + '%';
  if (percentageText) percentageText.textContent = percentage + '%';
}

export function updateLoadingText(text, progress) {
  const subtext = $('#loadingSubtext');
  if (subtext) subtext.textContent = text;
  if (progress !== undefined) updateLoadingProgress(progress);
}

export function hideGlobalLoading() {
  const loadingOverlay = $('#globalLoading');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.parentNode.removeChild(loadingOverlay);
      }
    }, 600);
  }
}

export function showLoading() {
  // Loading overlay is in HTML by default
}
