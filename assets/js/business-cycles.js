/* Last edited: 2026-10-31 01:32 UTC (Claude, economics chat) */
/* =========================================================
   business-cycles.js: /economics/business-cycles.html
   Loads the generated business-cycles JSON for the selected
   country and draws the cyclical component of each indicator
   with the selected filter. Uses AGDashboards (dashboards.js)
   and AGSite (site.js).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="business-cycles"]');
  if (!body || !D || !S) return;

  /* Filters: key in the JSON, label, line style (never colour alone). */
  const FILTERS = {
    hp: { field: 'hp_cycle', label: 'HP (λ = 1600)', color: 'var(--chart-1)', dash: null },
    hamilton: { field: 'hamilton_cycle', label: 'Hamilton (h = 8, p = 4)', color: 'var(--chart-2)', dash: '6 4' },
    cf: { field: 'cf_cycle', label: 'Christiano–Fitzgerald (6–32 quarters)', color: 'var(--chart-3)', dash: '1.5 3.5' },
  };
  const FILTER_NAMES = { hp: 'HP filter', hamilton: 'Hamilton filter', cf: 'Christiano–Fitzgerald filter', comparison: 'filter comparison' };

  const el = {
    status: body.querySelector('[data-role="chart-status"]'),
    frame: body.querySelector('[data-role="chart-frame"]'),
    legend: body.querySelector('[data-role="chart-legend"]'),
    readout: body.querySelector('[data-role="chart-readout"]'),
    subtitle: body.querySelector('[data-role="chart-subtitle"]'),
    downloads: body.querySelector('[data-role="downloads"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    filterHint: body.querySelector('[data-role="filter-hint"]'),
  };

  const state = { country: 'US', filter: 'hp', data: {}, chart: null };
  const cache = new Map();

  const countryControl = D.segmented(body.querySelector('[data-control="country"]'), value => {
    state.country = value;
    applyCountryRules();
    load();
  });
  const filterControl = D.segmented(body.querySelector('[data-control="filter"]'), value => {
    state.filter = value;
    el.filterHint.hidden = true;
    render();
  });

  /* Filter comparison is unavailable in the cross-country view; the choice
     otherwise persists when the country changes. */
  function applyCountryRules() {
    const crossCountry = state.country === 'comparison';
    filterControl.setDisabled('comparison', crossCountry, 'Filter comparison is available for one country at a time.');
    if (crossCountry && state.filter === 'comparison') {
      state.filter = 'hp';
      filterControl.select('hp', false);
      el.filterHint.textContent = 'Filter comparison is available for one country at a time, so the HP filter is shown.';
      el.filterHint.hidden = false;
    }
  }

  /* Resolve a CSS colour token to a value usable inside SVG attributes. */
  function resolveColor(value) {
    const match = /^var\((--[^)]+)\)$/.exec(value);
    return match ? getComputedStyle(body).getPropertyValue(match[1]).trim() || '#3b5a75' : value;
  }

  function setStatus(message, kind = 'loading') {
    el.status.hidden = !message;
    el.status.className = kind === 'error' ? 'render-error' : 'loading-message';
    el.status.textContent = message || '';
  }

  async function fetchCountry(code) {
    if (cache.has(code)) return cache.get(code);
    const url = body.dataset.dataUrl.replace('{country}', code.toLowerCase());
    const response = await S.fetchFresh(url);
    const payload = await response.json();
    if (!payload || !payload.indicators || !payload.indicators.real_gdp) {
      throw new Error('The data file does not contain the expected indicators.');
    }
    cache.set(code, payload);
    return payload;
  }

  async function load() {
    setStatus('Loading data…');
    try {
      /* Cross-country comparison is not yet published; only US data exist. */
      const code = state.country === 'comparison' ? 'US' : state.country;
      state.payload = await fetchCountry(code);
      render();
      updateDownloads();
    } catch (error) {
      if (state.chart) { state.chart.destroy(); state.chart = null; }
      el.frame.hidden = true;
      el.legend.hidden = true;
      el.status.hidden = false;
      el.status.className = 'render-error';
      el.status.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${S.escapeHTML(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  function render() {
    const payload = state.payload;
    if (!payload) return;
    const indicator = payload.indicators.real_gdp;
    const rows = indicator.observations;
    const dates = rows.map(row => row.date);

    const keys = state.filter === 'comparison' ? ['hp', 'hamilton', 'cf'] : [state.filter];
    const series = keys.map(key => ({
      key,
      label: FILTERS[key].label,
      color: resolveColor(FILTERS[key].color),
      dash: FILTERS[key].dash,
      values: rows.map(row => (row[FILTERS[key].field] == null ? null : Number(row[FILTERS[key].field]))),
    }));

    const first = D.quarterLabel(indicator.sample.start);
    const last = D.quarterLabel(indicator.sample.end);
    const country = payload.country.name;
    el.subtitle.textContent = `${country} · ${FILTER_NAMES[state.filter]} · deviation from trend, percent · ${first}–${last}`;

    if (state.chart) state.chart.destroy();
    el.frame.hidden = false;
    state.chart = D.lineChart(el.frame, {
      dates,
      series,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      zeroLine: true,
      digits: 2,
      readout: el.readout,
      label: `Cyclical component of ${country} real GDP, ${FILTER_NAMES[state.filter]}, ${first} to ${last}, with recessions shaded`,
    });

    el.legend.innerHTML = series.map(item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`).join('')
      + '<li><span class="legend-band" aria-hidden="true"></span>Recession (NBER-based)</li>';
    el.legend.hidden = false;
    el.readout.textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values by quarter.';
    setStatus('');

    if (state.filter === 'hamilton' || state.filter === 'comparison') {
      el.readout.textContent += ' The Hamilton cycle starts 11 quarters after the first observation.';
    }
  }

  function updateDownloads() {
    const links = state.payload && state.payload.downloads;
    if (!links) { el.downloads.hidden = true; return; }
    el.downloads.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = false;

    const generated = state.payload.generated_at_utc;
    if (generated) {
      const date = new Date(generated);
      el.updateNote.textContent = `Data updated on ${date.toLocaleDateString('en-GB')}`;
      el.updateNote.hidden = false;
    }
  }

  countryControl.select('US', false);
  filterControl.select('hp', false);
  applyCountryRules();
  load();
})();
