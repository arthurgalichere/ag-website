(() => {
  'use strict';

  const researchBody = document.querySelector('.research-body');
  const papersTarget = document.getElementById('papers-target');
  const presentationTarget = document.getElementById('presentation-list');

  if (!researchBody || !papersTarget || !presentationTarget) return;

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

  function normalizeCategory(value) {
    const category = cleanText(value);
    const normalized = category.toLowerCase();

    if (normalized === 'working paper' || normalized === 'working papers') {
      return 'Working Papers';
    }
    if (normalized === 'work in progress') {
      return 'Work in Progress';
    }
    if (['published', 'publication', 'publications'].includes(normalized)) {
      return 'Published';
    }

    return category || 'Other Research';
  }

  function renderPaper(paper) {
    const title = cleanText(paper.title);
    const journal = cleanText(paper.journal);
    const date = cleanText(paper.date);
    const coauthors = cleanText(paper.coauthors);
    const abstract = cleanMultilineText(paper.abstract);
    const status = cleanText(paper.status);
    const url = cleanText(paper.url);

    if (!title) return '';

    const titleHTML = url
      ? `<a href="${escapeHTML(url)}" target="_blank" rel="noreferrer">${escapeHTML(title)}</a>`
      : escapeHTML(title);

    const metadata = [];
    if (journal) metadata.push(journal);
    if (date) metadata.push(date);
    if (coauthors) metadata.push(`With ${coauthors}`);
    if (status) metadata.push(status);

    return `
      <article class="paper-item">
        <h3 class="paper-title">${titleHTML}</h3>
        ${metadata.length ? `<p class="paper-meta">${metadata.map(value => escapeHTML(value)).join(' · ')}</p>` : ''}
        ${abstract ? `<p class="paper-abstract">${escapeHTML(abstract, true)}</p>` : ''}
      </article>
    `;
  }

  function renderPapers(papers) {
    const validPapers = Array.isArray(papers)
      ? papers.filter(paper => paper && typeof paper === 'object' && cleanText(paper.title))
      : [];

    if (!validPapers.length) {
      papersTarget.innerHTML = '';
      return;
    }

    const groups = new Map();
    validPapers.forEach(paper => {
      const category = normalizeCategory(paper.category);
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(paper);
    });

    const categoryOrder = ['Working Papers', 'Work in Progress', 'Published'];
    const orderedCategories = [...groups.keys()].sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    papersTarget.innerHTML = orderedCategories.map(category => `
      <section class="research-section">
        <h2 class="research-section-title">${escapeHTML(category)}</h2>
        ${groups.get(category).map(renderPaper).join('')}
      </section>
    `).join('');
  }

  function presentationYear(item) {
    const date = cleanText(item && item.date);
    const match = date.match(/\b(?:19|20)\d{2}\b/);
    return match ? match[0] : (date || 'Other');
  }

  function renderPresentation(item) {
    const role = cleanText(item && item.role);
    const institution = cleanText(item && item.institution);
    const details = cleanMultilineText(item && item.details);

    if (!role && !institution && !details) return '';

    return `
      <article class="presentation-item">
        ${role ? `<div class="presentation-role">${escapeHTML(role)}</div>` : ''}
        ${institution ? `<div class="presentation-institution">${escapeHTML(institution)}</div>` : ''}
        ${details ? `<div class="presentation-details">${escapeHTML(details, true)}</div>` : ''}
      </article>
    `;
  }

  function renderPresentations(items) {
    const validItems = Array.isArray(items)
      ? items.filter(item => item && typeof item === 'object')
      : [];

    if (!validItems.length) {
      presentationTarget.innerHTML = '<p class="empty-message">No presentation records found.</p>';
      return;
    }

    const groups = new Map();
    validItems.forEach(item => {
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

    presentationTarget.innerHTML = orderedYears.map((year, index) => `
      <h3 class="cv-subsection-title${index === 0 ? ' is-first' : ''}">${escapeHTML(year)}</h3>
      ${groups.get(year).map(renderPresentation).join('')}
    `).join('');
  }

  async function loadResearchData() {
    try {
      const cvUrl = researchBody.dataset.cvUrl;
      if (!cvUrl) throw new Error('The research data URL is not configured.');

      const response = await fetch(`${cvUrl}?v=${Date.now()}`);
      if (!response.ok) throw new Error(`The server returned status ${response.status}.`);

      const data = await response.json();
      const sections = Array.isArray(data.sections) ? data.sections : [];
      const papers = Array.isArray(data.papers) ? data.papers : [];
      const presentationSection = sections.find(section =>
        section && cleanText(section.title).toLowerCase() === 'research presentations'
      );

      renderPapers(papers);
      renderPresentations(presentationSection && presentationSection.items);
      restartReveal(papersTarget);
      restartReveal(presentationTarget.closest('.research-section'));
    } catch (error) {
      console.error('Research data render fault:', error);
      papersTarget.innerHTML = '';
      presentationTarget.innerHTML = `
        <div class="render-error" role="alert">
          Research records could not be loaded: ${escapeHTML(error.message)}
        </div>
      `;
    }
  }

  loadResearchData();
})();
