// Safe DOM helpers - replaces innerHTML usage
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dk, dv]) => {
        el.dataset[dk] = dv;
      });
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else {
      el.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  });
  
  return el;
}

export function setText(el, text) {
  if (el) el.textContent = text;
}

export function setHTML(el, html) {
  // Only use for trusted content (translations)
  if (el) el.innerHTML = html;
}

export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

export function on(el, event, handler, options) {
  if (el) {
    el.addEventListener(event, handler, options);
    return () => el.removeEventListener(event, handler, options);
  }
  return () => {};
}

export function show(el) {
  if (el) el.style.display = '';
}

export function hide(el) {
  if (el) el.style.display = 'none';
}

export function toggleDisplay(el, show) {
  if (el) el.style.display = show ? '' : 'none';
}

export function addClass(el, ...classes) {
  if (el) el.classList.add(...classes);
}

export function removeClass(el, ...classes) {
  if (el) el.classList.remove(...classes);
}

export function toggleClass(el, className, force) {
  if (el) el.classList.toggle(className, force);
}
