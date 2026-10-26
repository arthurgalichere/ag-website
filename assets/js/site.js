/* =========================================================
   site.js: small helpers shared by every page script.
   Loaded before page scripts (cv.js, research.js, ...),
   which read them from window.AGSite.
   ========================================================= */
window.AGSite = (() => {
  'use strict';

  const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };

  /* Collapse whitespace into single spaces. */
  function cleanText(value) {
    return value == null ? '' : String(value).replace(/\s+/g, ' ').trim();
  }

  /* Tidy each line but keep line breaks (e.g. multi-line CV details). */
  function cleanMultilineText(value) {
    if (value == null) return '';
    return String(value)
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map(line => line.replace(/[\t ]+/g, ' ').trim())
      .filter(Boolean)
      .join('\n');
  }

  /* Make any text safe to insert into HTML, unchanged otherwise. */
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, character => HTML_ESCAPES[character]);
  }

  /* Clean then escape: for values read from cv.json. */
  function escapeText(value, preserveLineBreaks = false) {
    return escapeHTML(preserveLineBreaks ? cleanMultilineText(value) : cleanText(value));
  }

  /* Replay the reveal animation once content loaded from data appears. */
  function restartReveal(element) {
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.remove('reveal');
    void element.offsetWidth;
    element.classList.add('reveal');
  }

  /* Fetch a data file, bypassing stale caches. */
  async function fetchFresh(url) {
    if (!url) throw new Error('The data URL is not configured.');
    const response = await fetch(`${url}?v=${Date.now()}`);
    if (!response.ok) throw new Error(`The server returned status ${response.status}.`);
    return response;
  }

  return { cleanText, cleanMultilineText, escapeHTML, escapeText, restartReveal, fetchFresh };
})();
