(() => {
  'use strict';

  const cvBody = document.querySelector('.cv-body');
  const targetBefore = document.getElementById('cv-target-before');
  const targetAfter = document.getElementById('cv-target-after');
  const updateElement = document.getElementById('cv-update');

  if (!cvBody || !targetBefore || !targetAfter || !updateElement) return;

  function cleanText(value) {
    return value == null ? '' : String(value).replace(/\s+/g, ' ').trim();
  }

  function cleanMultilineText(value) {
    if (value == null) return '';

    return String(value)
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(line => line.replace(/[\t ]+/g, ' ').trim())
      .filter(Boolean)
      .join('\n');
  }

  function escapeHTML(value, preserveLineBreaks = false) {
    const text = preserveLineBreaks ? cleanMultilineText(value) : cleanText(value);
    return text.replace(/[&<>'"]/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[character]);
  }

  function restartReveal(element) {
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.remove('reveal');
    void element.offsetWidth;
    element.classList.add('reveal');
  }

  function renderCVItem(item, options = {}) {
    if (!item || typeof item !== 'object') return '';

    if (item.isFormatHeader) {
      return `<div class="cv-format-header">${escapeHTML(item.role)}</div>`;
    }

    const role = cleanText(item.role);
    const institution = options.hideInstitution ? '' : cleanText(item.institution);
    const date = options.hideDate ? '' : cleanText(item.date);
    const details = cleanMultilineText(item.details);

    if (!role && !institution && !date && !details) return '';

    return `
      <div class="cv-item">
        <div>
          ${role ? `<div class="cv-item-role">${escapeHTML(role)}</div>` : ''}
          ${institution ? `<div class="cv-item-institution">${escapeHTML(institution)}</div>` : ''}
        </div>
        ${date ? `<div class="cv-item-date">${escapeHTML(date)}</div>` : ''}
        ${details ? `<div class="cv-item-details">${escapeHTML(details, true)}</div>` : ''}
      </div>
    `;
  }

  function presentationYear(item) {
    const date = cleanText(item && item.date);
    const match = date.match(/\b(?:19|20)\d{2}\b/);
    return match ? match[0] : (date || 'Other');
  }

  function renderResearchPresentations(items) {
    const groups = new Map();

    items.forEach(item => {
      const year = presentationYear(item);
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(item);
    });

    const orderedYears = [...groups.keys()].sort((a, b) => {
      const aIsYear = /^\d{4}$/.test(a);
      const bIsYear = /^\d{4}$/.test(b);
      if (aIsYear && bIsYear) return Number(b) - Number(a);
      if (aIsYear) return -1;
      if (bIsYear) return 1;
      return a.localeCompare(b);
    });

    return orderedYears.map((year, index) => `
      <h3 class="cv-subsection-title${index === 0 ? ' is-first' : ''}">${escapeHTML(year)}</h3>
      ${groups.get(year).map(item => renderCVItem(item, { hideDate: true })).join('')}
    `).join('');
  }

  function renderSection(section) {
    const title = cleanText(section.title) || 'Untitled Section';
    const titleLower = title.toLowerCase();
    const items = Array.isArray(section.items) ? section.items : [];
    const subsections = Array.isArray(section.subsections) ? section.subsections : [];
    const isTeaching = titleLower === 'teaching experience';
    const isResearchPresentations = titleLower === 'research presentations';

    const classes = ['cv-section'];
    if (isTeaching) classes.push('teaching-tight');
    if (isTeaching || isResearchPresentations) classes.push('role-light');

    let html = `
      <section class="${classes.join(' ')}">
        <h2 class="cv-section-title">${escapeHTML(title)}</h2>
    `;

    html += isResearchPresentations
      ? renderResearchPresentations(items)
      : items.map(item => renderCVItem(item)).join('');

    subsections.forEach((subsection, index) => {
      if (!subsection || typeof subsection !== 'object') return;

      const subsectionTitle = cleanText(subsection.title) || 'Untitled Category';
      const subsectionItems = Array.isArray(subsection.items) ? subsection.items : [];

      html += `<h3 class="cv-subsection-title${index === 0 ? ' is-first' : ''}">${escapeHTML(subsectionTitle)}</h3>`;
      html += subsectionItems
        .map(item => renderCVItem(item, { hideInstitution: isTeaching }))
        .join('');
    });

    return `${html}</section>`;
  }

  function formatUpdateDate(value) {
    const match = cleanText(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : '';
  }

  async function loadCV() {
    try {
      const cvUrl = cvBody.dataset.cvUrl;
      if (!cvUrl) throw new Error('The CV data URL is not configured.');

      const response = await fetch(`${cvUrl}?v=${Date.now()}`);
      if (!response.ok) throw new Error(`The server returned status ${response.status}.`);

      const data = await response.json();
      const sections = data && Array.isArray(data.sections) ? data.sections : null;
      if (!sections) throw new Error('cv.json does not contain a valid sections array.');

      targetBefore.innerHTML = '';
      targetAfter.innerHTML = '';

      sections.forEach(section => {
        if (!section || typeof section !== 'object') return;

        const titleLower = cleanText(section.title).toLowerCase();
        if (!titleLower || titleLower === 'education') return;

        const sectionHTML = renderSection(section);
        const target = titleLower === 'employment' ? targetBefore : targetAfter;
        target.insertAdjacentHTML('beforeend', sectionHTML);
      });

      const formattedDate = formatUpdateDate(data.last_updated);
      updateElement.textContent = formattedDate
        ? `Information updated on ${formattedDate}`
        : '';

      restartReveal(targetBefore);
      restartReveal(targetAfter);
    } catch (error) {
      console.error('CV render fault:', error);
      updateElement.textContent = '';
      targetAfter.innerHTML = `
        <div class="render-error" role="alert">
          <p class="render-error-title"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> CV data could not be loaded</p>
          <p class="render-error-message">${escapeHTML(error.message)}</p>
        </div>
      `;
    }
  }

  loadCV();
})();
