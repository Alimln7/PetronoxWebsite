import { state } from '../state.js';  // still used for loadedImages
import { t } from '../i18n.js';
import { $, on, $$ } from '../utils/dom.js';
import { loadCategories, loadBrands, loadModels, loadTypes, getVehicleData, getOilImage, waitForImagesIn } from '../utils/data-loader.js';

export async function renderOilFinder(container) {
  container.innerHTML = `
    <div class="section oil-finder-section" id="oilFinderSection">
      <div class="white-bg-text" data-i18n="preewText">${t('preewText')}</div>
      <div class="categories-container" id="categoriesContainer"></div>
      <div class="dropdowns-container" id="dropdownsContainer" style="display:none;">
        <select id="selectBrand" disabled><option>Select Brand</option></select>
        <select id="selectModel" disabled><option>Select Model</option></select>
        <select id="selectType" disabled><option>Select Type</option></select>
      </div>
      <button class="search-button disabled" id="searchButton" disabled style="display:none;" data-i18n="searchBtn">${t('searchBtn')}</button>
      <div class="search-results" id="searchResults"></div>
    </div>
  `;

  await initOilFinder(container);
}

async function initOilFinder(container) {
  const categoriesContainer = $('#categoriesContainer', container);
  const dropdownsContainer = $('#dropdownsContainer', container);
  const selectBrand = $('#selectBrand', container);
  const selectModel = $('#selectModel', container);
  const selectType = $('#selectType', container);
  const searchButton = $('#searchButton', container);
  const searchResults = $('#searchResults', container);

  // Load categories immediately
  try {
    const categories = await loadCategories();
    if (categoriesContainer && categories) {
      categoriesContainer.innerHTML = '';
      categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category-card';
        div.dataset.category = cat;
        const displayName = cat.replace(/_/g, ' / ');
        const iconName = `${cat.replace(/\s+/g, '')}.png`;

        const img = document.createElement('img');
        img.src = `icons/${iconName}`;
        img.alt = cat;

        const span = document.createElement('span');
        span.className = 'category-name';
        span.textContent = displayName;

        div.appendChild(img);
        div.appendChild(span);

        on(div, 'click', () => handleCategoryClick(div, cat));
        categoriesContainer.appendChild(div);
      });
    }
  } catch (e) {
    console.warn('Categories unavailable:', e.message);
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '<div class="empty-note" style="text-align:center;padding:20px;">Vehicle data unavailable. Please start the server.</div>';
    }
  }

  function resetDropdowns() {
    if (dropdownsContainer) dropdownsContainer.style.display = 'none';
    if (searchButton) { searchButton.style.display = 'none'; searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled'); }
    if (searchResults) searchResults.innerHTML = '';
    if (selectBrand) { selectBrand.innerHTML = '<option>Select Brand</option>'; selectBrand.disabled = true; }
    if (selectModel) { selectModel.innerHTML = '<option>Select Model</option>'; selectModel.disabled = true; }
    if (selectType) { selectType.innerHTML = '<option>Select Type</option>'; selectType.disabled = true; }
  }

  async function handleCategoryClick(div, catKey) {
    resetDropdowns();

    $$('.category-card', container).forEach(c => c.classList.remove('active'));
    div.classList.add('active');

    if (dropdownsContainer) dropdownsContainer.style.display = 'flex';
    if (searchButton) searchButton.style.display = 'block';

    const brands = await loadBrands(catKey);
    if (selectBrand) {
      selectBrand.innerHTML = '<option>Select Brand</option>';
      brands.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b;
        opt.textContent = b;
        selectBrand.appendChild(opt);
      });
      selectBrand.disabled = false;
    }
  }

  // Brand change
  if (selectBrand) {
    on(selectBrand, 'change', async () => {
      const catDiv = container.querySelector('.category-card.active');
      if (!catDiv) return;
      const catKey = catDiv.dataset.category.trim();

      if (selectBrand.value === 'Select Brand') {
        selectModel.innerHTML = '<option>Select Model</option>'; selectModel.disabled = true;
        selectType.innerHTML = '<option>Select Type</option>'; selectType.disabled = true;
        searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled');
        return;
      }

      const brand = selectBrand.value;
      const models = await loadModels(catKey, brand);
      selectModel.innerHTML = '<option>Select Model</option>';
      models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        selectModel.appendChild(opt);
      });
      selectModel.disabled = false;
      selectType.innerHTML = '<option>Select Type</option>'; selectType.disabled = true;
      searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled');
    });
  }

  // Model change
  if (selectModel) {
    on(selectModel, 'change', async () => {
      const catDiv = container.querySelector('.category-card.active');
      if (!catDiv) return;
      const catKey = catDiv.dataset.category.trim();

      if (selectModel.value === 'Select Model') {
        selectType.innerHTML = '<option>Select Type</option>'; selectType.disabled = true;
        searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled');
        return;
      }

      const brand = selectBrand.value;
      const model = selectModel.value;
      const types = await loadTypes(catKey, brand, model);
      selectType.innerHTML = '<option>Select Type</option>';
      types.forEach(tp => {
        const opt = document.createElement('option');
        opt.value = tp; opt.textContent = tp;
        selectType.appendChild(opt);
      });
      selectType.disabled = false;
      searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled');
    });
  }

  // Type change
  if (selectType) {
    on(selectType, 'change', () => {
      if (selectType.value !== 'Select Type') {
        searchButton.disabled = false; searchButton.classList.remove('disabled'); searchButton.classList.add('enabled');
      } else {
        searchButton.disabled = true; searchButton.classList.remove('enabled'); searchButton.classList.add('disabled');
      }
    });
  }

  // Search button click
  if (searchButton) {
    on(searchButton, 'click', async () => {
      if (searchButton.disabled) return;
      const catDiv = container.querySelector('.category-card.active');
      if (!catDiv) return;
      const category = catDiv.dataset.category.trim();
      const brand = selectBrand ? selectBrand.value : '';
      const model = selectModel ? selectModel.value : '';
      const type = selectType ? selectType.value : '';

      const vehicleData = await getVehicleData(category, brand, model, type);
      await displayVehicleData(searchResults, vehicleData, category, brand, model, type);
    });
  }
}

async function displayVehicleData(searchResults, vehicleData, category, brand, model, type) {
  if (!searchResults) return;
  searchResults.innerHTML = '';

  // Show loading
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = '<div class="spinner"><span class="ring"></span><span class="center"></span></div>';
  searchResults.appendChild(overlay);

  const wrapper = document.createElement('div');
  wrapper.className = 'result-wrapper';
  wrapper.style.display = 'none';

  if (!vehicleData) {
    const note = document.createElement('div');
    note.className = 'empty-note';
    note.textContent = t('noDataFound');
    wrapper.appendChild(note);
  } else {
    // Vehicle Info Card
    const vehicleDiv = document.createElement('div');
    vehicleDiv.className = 'vehicle-info';

    const imgEl = document.createElement('img');
    let imageSrc = '';
    if (vehicleData.image && vehicleData.image.src !== 'NOTHING') {
      imageSrc = vehicleData.image.src;
    } else {
      imageSrc = `icons/${category.replace(/\s+/g, '')}.png`;
    }
    imgEl.src = imageSrc;
    imgEl.alt = (vehicleData.image && vehicleData.image.alt) || 'Vehicle Image';
    imgEl.onerror = function () { this.src = `icons/${category.replace(/\s+/g, '')}.png`; };
    vehicleDiv.appendChild(imgEl);

    const textDiv = document.createElement('div');
    textDiv.className = 'vehicle-text';
    const hBrand = document.createElement('h3'); hBrand.textContent = brand;
    const pModel = document.createElement('p'); pModel.textContent = model;
    const pType = document.createElement('p'); pType.textContent = type;
    textDiv.appendChild(hBrand);
    textDiv.appendChild(pModel);
    textDiv.appendChild(pType);
    vehicleDiv.appendChild(textDiv);

    // Equipment Info
    if (vehicleData.equipment_info && vehicleData.equipment_info.data) {
      const equipDiv = document.createElement('div');
      equipDiv.className = 'equipment-info';
      Object.entries(vehicleData.equipment_info.data).forEach(([k, v]) => {
        const card = document.createElement('div');
        card.className = 'equipment-card';
        const h4 = document.createElement('h4'); h4.textContent = k;
        const p = document.createElement('p'); p.textContent = v;
        card.appendChild(h4); card.appendChild(p);
        equipDiv.appendChild(card);
      });
      vehicleDiv.appendChild(equipDiv);
    }

    wrapper.appendChild(vehicleDiv);

    // Component Accordions
    const entries = Object.entries(vehicleData).filter(([k]) => k !== 'image' && k !== 'equipment_info');

    entries.forEach(([compKey, compValue], compIndex) => {
      const accordion = document.createElement('div');
      accordion.className = 'accordion';
      accordion.tabIndex = 0;

      const header = document.createElement('div');
      header.className = 'accordion__header';
      const h4 = document.createElement('h4'); h4.textContent = compKey;
      const chev = document.createElement('span'); chev.className = 'accordion__chevron'; chev.textContent = '+';
      header.appendChild(h4);
      header.appendChild(chev);

      const body = document.createElement('div');
      body.className = 'accordion__body';

      const sectionKeys = Object.keys(compValue || {});

      if (sectionKeys.length === 0 || Object.keys(compValue).every(key =>
        !compValue[key] ||
        (compValue[key].oil_properties && compValue[key].oil_properties.length === 0 &&
          compValue[key].oil_names && compValue[key].oil_names.length === 0)
      )) {
        const msg = document.createElement('div');
        msg.className = 'empty-note';
        msg.textContent = t('dataUnavailable');
        msg.style.textAlign = 'center';
        msg.style.padding = '20px';
        body.appendChild(msg);
      } else {
        sectionKeys.forEach((sectionKey, idx) => {
          const sectionValue = compValue[sectionKey];
          const sectionDiv = document.createElement('div');
          sectionDiv.className = 'comp-section';

          // Properties badges
          if (sectionValue && sectionValue.oil_properties && sectionValue.oil_properties.length) {
            const propsRow = document.createElement('div');
            propsRow.className = 'props-row';
            sectionValue.oil_properties.forEach(prop => {
              const span = document.createElement('span');
              span.className = 'badge';
              span.textContent = prop;
              propsRow.appendChild(span);
            });
            sectionDiv.appendChild(propsRow);
          }

          // Oil names grid
          if (sectionValue && sectionValue.oil_names && sectionValue.oil_names.length) {
            const oilsGrid = document.createElement('div');
            oilsGrid.className = 'oils-grid';
            sectionValue.oil_names.forEach(oilName => {
              const oCard = document.createElement('div');
              oCard.className = 'oil-card';
              const imgOil = document.createElement('img');
              const oilImageSrc = getOilImage(oilName);
              imgOil.src = oilImageSrc;

              if (state.loadedImages.has(oilImageSrc)) {
                imgOil.style.opacity = '1';
              } else {
                imgOil.style.opacity = '0';
                imgOil.style.transition = 'opacity 0.3s';
                imgOil.onload = function () {
                  this.style.opacity = '1';
                  state.loadedImages.add(oilImageSrc);
                };
              }

              imgOil.alt = oilName;
              const span = document.createElement('div');
              span.className = 'oil-name';
              span.textContent = oilName;
              oCard.appendChild(imgOil);
              oCard.appendChild(span);
              oilsGrid.appendChild(oCard);
            });
            sectionDiv.appendChild(oilsGrid);
          } else {
            const note = document.createElement('div');
            note.className = 'empty-note';
            note.textContent = t('noOilsListed');
            sectionDiv.appendChild(note);
          }

          body.appendChild(sectionDiv);

          if (sectionKeys.length > 1 && idx < sectionKeys.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'section-sep';
            body.appendChild(sep);
          }
        });
      }

      accordion.appendChild(header);
      accordion.appendChild(body);

      // Toggle
      const toggleFunc = () => {
        const isOpen = accordion.classList.contains('open');
        if (isOpen) {
          body.style.display = 'none';
          accordion.classList.remove('open');
          chev.textContent = '+';
        } else {
          body.style.display = 'block';
          accordion.classList.add('open');
          chev.textContent = '\u2212';
          setTimeout(() => accordion.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
        }
      };

      on(header, 'click', toggleFunc);
      on(accordion, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFunc(); }
      });

      // Open first accordion by default
      if (compIndex === 0) {
        body.style.display = 'block';
        accordion.classList.add('open');
        chev.textContent = '\u2212';
      }

      wrapper.appendChild(accordion);
    });
  }

  searchResults.appendChild(wrapper);

  try { await waitForImagesIn(wrapper); } catch (e) { /* ignore */ }

  if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  wrapper.style.display = 'flex';

  const line = document.createElement('div');
  line.className = 'search-results-line';
  searchResults.insertBefore(line, wrapper);

  searchResults.scrollIntoView({ behavior: 'smooth' });
}

export function updateOilFinderLanguage(container) {
  const updates = {
    '[data-i18n="preewText"]': 'preewText',
    '[data-i18n="searchBtn"]': 'searchBtn'
  };

  Object.entries(updates).forEach(([selector, key]) => {
    const el = container.querySelector(selector);
    if (el) el.textContent = t(key);
  });
}
