/* Last edited: 2026-11-02 23:54 UTC (Claude, economics chat) */
/* =========================================================
   business-cycles.js: /economics/business-cycles.html
   Loads the generated business-cycles JSON for the selected
   country and draws, for each card, the cyclical component of
   its variables against a benchmark cycle (output, or the
   aggregate for components of consumption and investment).
   Cards carry data-vars (variable keys), data-against (the
   benchmark key; none for output itself) and data-extra (an
   unfiltered series added to the chart, e.g. the unemployment
   gap). Page switch: filter (HP, Hamilton, Christiano–Fitzgerald,
   comparison). Card switches: measure (total, per capita) and
   variant (sets of variables). Tables have their own measure
   switch per group (data-group).
   Tables: data-table = a section key, "summary", "cross" or
   "matrix". Uses AGDashboards (dashboards.js) and AGSite.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="business-cycles"]');
  if (!body || !D || !S) return;

  const FILTERS = {
    hp: { label: 'HP', long: 'HP filter (λ = 1600)', dash: null },
    hamilton: { label: 'Hamilton', long: 'Hamilton filter (h = 8, p = 4)', dash: '6 4' },
    cf: { label: 'Christiano–Fitzgerald', long: 'Christiano–Fitzgerald filter (6–32 quarters)', dash: '1.5 3.5' },
  };
  /* One variable: the site blue. Several variables of equal importance:
     equal-weight colours (none in the site blue). The benchmark (output, or
     the aggregate of a component) is red and dashed, or light grey when it
     is only context (data-muted). Filter comparison: equal-weight colours. */
  const MULTI = ['--series-4', '--series-2', '--series-3', '--series-1'];
  const FILTER_COLOURS = ['--series-1', '--series-2', '--series-3'];
  /* Annualised rates: divided by 4 on the quarterly basis (inflation
     400 x dln P becomes 100 x dln P; interest rates per quarter). */
  const RATE_KEYS = new Set(['infl', 'infl_cpi', 'ff', 'tb', 'rff', 'rtb']);
  /* Correlation matrix: variables shown by default (the reader adds others). */
  const MATRIX_DEFAULT = ['y', 'c', 'i', 'h', 'w', 'yh', 'tfp', 'u', 'infl', 'ff'];
  const BENCHMARK_DASH = '9 4';
  /* Short labels for the correlation matrix. */
  const SYMBOLS = {
    y: 'Y', c: 'C', i: 'I', g: 'G', x: 'X', m: 'M', nx: 'NX/Y', k: 'K', h: 'H', w: 'w', yh: 'Y/H',
    tfp: 'TFP', tfp_util: 'TFPᵘ', u: 'u', u_gap: '(u − u*)/u*', lfpr: 'LFPR', infl: 'π', infl_cpi: 'π CPI',
    ff: 'FF', tb: 'TB', rff: 'r FF', rtb: 'r TB', debt: 'Debt',
  };

  const el = {
    downloads: body.querySelector('[data-role="downloads"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    pageStatus: body.querySelector('[data-role="page-status"]'),
    filterHint: body.querySelector('[data-role="filter-hint"]'),
  };
  const cards = Array.from(body.querySelectorAll('figure.chart-card[data-vars]'));
  const state = {
    country: 'US', filter: 'hp', payload: null, charts: new Map(), visible: new Set(),
    measure: new Map(), tableMeasure: new Map(), basis: new Map(), tableBasis: new Map(),
    matrixKeys: new Set(MATRIX_DEFAULT),
  };
  const cache = new Map();

  D.segmented(body.querySelector('[data-control="country"]'), value => { state.country = value; load(); });
  const filterControl = D.segmented(body.querySelector('[data-control="filter"]'), value => {
    state.filter = value;
    refresh();
  });
  cards.forEach(card => {
    const variant = card.querySelector('[data-control="variant"]');
    if (variant) {
      const control = D.segmented(variant, value => {
        const button = variant.querySelector(`[data-value="${value}"]`);
        card.dataset.vars = button.dataset.set;
        card.dataset.muted = button.dataset.muted === 'true' ? 'true' : 'false';
        if (state.visible.has(card)) renderCard(card);
      });
      const first = variant.querySelector('button');
      card.dataset.vars = first.dataset.set;
      control.select(first.dataset.value, false);
    }
    const basis = card.querySelector('[data-control="rate-basis"]');
    if (basis) {
      state.basis.set(card, 'annual');
      D.segmented(basis, value => {
        state.basis.set(card, value);
        if (state.visible.has(card)) renderCard(card);
      }).select('annual', false);
    }
    const measure = card.querySelector('[data-control="measure"]');
    if (measure) {
      state.measure.set(card, 'total');
      D.segmented(measure, value => {
        state.measure.set(card, value);
        if (state.visible.has(card)) renderCard(card);
      }).select('total', false);
    }
  });
  body.querySelectorAll('[data-control="table-basis"]').forEach(control => {
    const group = control.dataset.group;
    state.tableBasis.set(group, 'annual');
    D.segmented(control, value => {
      state.tableBasis.set(group, value);
      renderTables();
    }).select('annual', false);
  });
  body.querySelectorAll('[data-control="table-measure"]').forEach(control => {
    const group = control.dataset.group;
    state.tableMeasure.set(group, 'total');
    D.segmented(control, value => {
      state.tableMeasure.set(group, value);
      renderTables();
    }).select('total', false);
  });

  function token(name) {
    return getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  }

  async function fetchCountry(code) {
    if (cache.has(code)) return cache.get(code);
    const url = body.dataset.dataUrl.replace('{country}', code.toLowerCase());
    const response = await S.fetchFresh(url);
    const payload = await response.json();
    if (!payload || !payload.cycles || !payload.tables) throw new Error('The data file does not contain the expected cycles.');
    cache.set(code, payload);
    return payload;
  }

  /* Per-capita version of a variable when it exists and is selected. */
  function seriesKey(key, measure) {
    const pc = `${key}_pc`;
    return measure === 'pc' && state.payload.cycles.hp[pc] ? pc : key;
  }

  /* Output is labelled "Real GDP" on this page. */
  const LABELS = { y: 'Real GDP' };

  function label(key, measure) {
    const v = state.payload.variables[key];
    return (LABELS[key] || v.label) + (measure === 'pc' && v.per_capita ? ' per capita' : '');
  }

  function values(filter, key, measure) {
    return state.payload.cycles[filter][seriesKey(key, measure)] || [];
  }

  function tableFilter() {
    return state.filter === 'comparison' ? 'hp' : state.filter;
  }

  function refresh() {
    el.filterHint.hidden = state.filter !== 'comparison';
    cards.forEach(card => { if (state.visible.has(card)) renderCard(card); });
    renderTables();
  }

  function renderCard(card) {
    const role = name => card.querySelector(`[data-role="${name}"]`);
    const payload = state.payload;
    const measure = state.measure.get(card) || 'total';
    const vars = card.dataset.vars.split(',').map(x => x.trim());
    const against = card.dataset.against || '';
    const extra = card.dataset.extra || '';
    const muted = card.dataset.muted === 'true';
    const comparison = state.filter === 'comparison';
    const lab = key => label(key, measure);
    const quarterly = state.basis.get(card) === 'quarterly';
    const vals = (filter, key) => {
      const v = values(filter, key, measure);
      return quarterly && RATE_KEYS.has(key) ? v.map(x => (x == null ? null : x / 4)) : v;
    };
    const series = [];

    if (comparison) {
      /* One variable under the three filters (the first of the card). */
      const key = vars[0];
      Object.entries(FILTERS).forEach(([name, f], i) => series.push({
        label: `${lab(key)}, ${f.label}`,
        color: token(FILTER_COLOURS[i]),
        dash: f.dash,
        values: vals(name, key),
      }));
    } else {
      vars.forEach((key, i) => series.push({
        label: lab(key),
        color: token(vars.length === 1 ? '--chart-1' : MULTI[i % MULTI.length]),
        values: vals(state.filter, key),
      }));
      if (extra) {
        series.push({ label: lab(extra), color: token('--series-2'), dash: '1.5 3.5', values: values('hp', extra, measure) });
      }
      /* The benchmark comes last in the legend. */
      if (against) {
        series.push({
          label: lab(against),
          color: token(muted ? '--chart-benchmark-muted' : '--chart-benchmark'),
          dash: BENCHMARK_DASH,
          values: vals(state.filter, against),
        });
      }
    }

    const keys = comparison ? [vars[0]] : [...vars, extra, against].filter(Boolean);
    const unitOf = key => (quarterly && RATE_KEYS.has(key) ? 'Percentage points per quarter (annual rate ÷ 4)' : payload.variables[key].units);
    const units = Array.from(new Set(keys.map(unitOf)));
    /* One unit, or the variables grouped by unit. */
    const unitText = units.length === 1
      ? units[0]
      : units.map(unit => `${unit} (${keys.filter(key => unitOf(key) === unit).map(lab).join(', ')})`).join('; ');
    const dates = payload.dates;
    const filterText = comparison ? 'filter comparison' : FILTERS[state.filter].long;
    role('chart-subtitle').textContent = `${unitText} · ${filterText} · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;

    const prev = state.charts.get(card);
    if (prev) prev.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    state.charts.set(card, D.lineChart(role('chart-frame'), {
      dates,
      series,
      period: 0.25,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      zeroLine: true,
      digits: 2,
      readout: role('chart-readout'),
      label: `${card.querySelector('.chart-title').textContent}, cyclical components, ${filterText}, with recessions shaded`,
    }));

    const swatch = item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`;
    role('chart-legend').innerHTML = series.map(swatch).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    const sources = Array.from(new Set(keys.map(key => {
      const v = payload.variables[key];
      return measure === 'pc' && v.source_pc ? v.source_pc : v.source;
    }).filter(Boolean)));
    role('chart-source').textContent = `Source: ${sources.join('; ')}. Cycles: author’s calculations.`;
  }

  /* Tables ------------------------------------------------- */

  const fmt = (v, d = 2) => (v == null ? '–' : D.formatNumber(v, d));
  let tableMeasureNow = 'total';
  let tableQuarterly = false;
  /* Standard deviations of annualised rates scale with the basis;
     correlations and autocorrelations do not. */
  const scaled = (key, v) => (v != null && tableQuarterly && RATE_KEYS.has(key) ? v / 4 : v);
  const tlabel = key => label(key, tableMeasureNow);
  const unitMark = key => (state.payload.variables[key].units === 'Percentage points' ? ' <span class="unit-mark" title="Standard deviation in percentage points">†</span>' : '');

  function statsTable(rows, aggregate) {
    const aggLabel = aggregate ? tlabel(aggregate).toLowerCase() : '';
    const head = `<tr><th scope="col" class="component-head">Variable</th>
      <th scope="col">Standard deviation</th>
      <th scope="col">Relative standard deviation<br><span class="unit-label">(to output)</span></th>
      ${aggregate ? `<th scope="col">Relative standard deviation<br><span class="unit-label">(to ${S.escapeHTML(aggLabel)})</span></th>` : ''}
      <th scope="col">First-order autocorrelation</th>
      <th scope="col">Correlation with output</th>
      ${aggregate ? `<th scope="col">Correlation with ${S.escapeHTML(aggLabel)}</th>` : ''}</tr>`;
    const bodyRows = rows.map(row => `<tr>
      <th scope="row">${S.escapeHTML(tlabel(row.key))}${unitMark(row.key)}</th>
      <td>${fmt(scaled(row.key, row.sd))}</td><td>${fmt(scaled(row.key, row.rel_sd))}</td>
      ${aggregate ? `<td>${fmt(row.rel_sd_agg)}</td>` : ''}
      <td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td>
      ${aggregate ? `<td>${fmt(row.corr_agg)}</td>` : ''}</tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table">
      <caption class="visually-hidden">Business-cycle statistics</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
  }

  function lagText(k) {
    if (k == null) return '–';
    if (k === 0) return 'coincident';
    return k < 0 ? `leads by ${-k}` : `lags by ${k}`;
  }

  function crossTable(rows, lags) {
    const head = `<tr><th scope="col" rowspan="2" class="component-head">Variable x</th>
      <th scope="colgroup" colspan="${lags.length}">Correlation of x(t + k) with output y(t)</th>
      <th scope="col" rowspan="2">Peak<br><span class="unit-label">(quarters)</span></th></tr>
      <tr>${lags.map(k => `<th scope="col">k = ${k > 0 ? '+' : ''}${k}</th>`).join('')}</tr>`;
    const bodyRows = rows.map(row => `<tr>
      <th scope="row">${S.escapeHTML(tlabel(row.key))}</th>
      ${row.values.map((v, i) => `<td${lags[i] === row.peak_lag ? ' class="is-peak"' : ''}>${fmt(v)}</td>`).join('')}
      <td class="peak-lag">${lagText(row.peak_lag)}</td></tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table cross-table">
      <caption class="visually-hidden">Cross-correlations with output at leads and lags</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
  }

  /* Toggle buttons above the matrix: one per variable, then select all / none. */
  function renderPicker() {
    const target = body.querySelector('[data-role="matrix-picker"]');
    if (!target || !state.payload) return;
    const keys = state.payload.summary_keys;
    target.innerHTML = keys.map(key => `<button type="button" class="picker-chip" data-key="${key}" aria-pressed="${state.matrixKeys.has(key)}" title="${S.escapeHTML(label(key, 'total'))}">${S.escapeHTML(SYMBOLS[key] || key)}</button>`).join('')
      + '<span class="picker-actions"><button type="button" class="picker-action" data-action="all">Select all</button>'
      + '<button type="button" class="picker-action" data-action="none">Select none</button>'
      + '<button type="button" class="picker-action" data-action="default">Default</button></span>';
  }

  function onPicker(event) {
    const button = event.target.closest('button');
    if (!button) return;
    const keys = state.payload.summary_keys;
    if (button.dataset.key) {
      const key = button.dataset.key;
      if (state.matrixKeys.has(key)) state.matrixKeys.delete(key); else state.matrixKeys.add(key);
    } else if (button.dataset.action === 'all') {
      state.matrixKeys = new Set(keys);
    } else if (button.dataset.action === 'none') {
      state.matrixKeys = new Set();
    } else if (button.dataset.action === 'default') {
      state.matrixKeys = new Set(MATRIX_DEFAULT);
    }
    renderPicker();
    renderTables();
  }

  function matrixTable(allKeys, fullMatrix) {
    /* Keep the selected variables, in the order of the summary table. */
    const index = allKeys.map((key, i) => [key, i]).filter(([key]) => state.matrixKeys.has(key));
    if (!index.length) return '<p class="empty-message">Select at least one variable above.</p>';
    const keys = index.map(([key]) => key);
    const matrix = index.map(([, r]) => index.map(([, c]) => fullMatrix[r][c]));
    const pos = token('--chart-1');
    const neg = token('--series-1');
    const cell = v => {
      if (v == null) return '<td>–</td>';
      const alpha = Math.min(1, Math.abs(v)) * 0.55;
      const colour = v >= 0 ? pos : neg;
      return `<td style="background: color-mix(in srgb, ${colour} ${Math.round(alpha * 100)}%, transparent)">${fmt(v)}</td>`;
    };
    const head = `<tr><th scope="col"></th>${keys.map(key => `<th scope="col"><abbr title="${S.escapeHTML(tlabel(key))}">${S.escapeHTML(SYMBOLS[key] || key)}</abbr></th>`).join('')}</tr>`;
    const bodyRows = keys.map((key, r) => `<tr><th scope="row"><abbr title="${S.escapeHTML(tlabel(key))}">${S.escapeHTML(SYMBOLS[key] || key)}</abbr></th>${matrix[r].map(cell).join('')}</tr>`).join('');
    const legend = keys.map(key => `${S.escapeHTML(SYMBOLS[key] || key)}: ${S.escapeHTML(tlabel(key))}`).join(' · ');
    return `<div class="table-scroll"><table class="data-table matrix-table">
      <caption class="visually-hidden">Contemporaneous correlation matrix of cyclical components</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>
      <p class="table-note">${legend}.</p>`;
  }

  function renderTables() {
    const payload = state.payload;
    if (!payload) return;
    const note = state.filter === 'comparison'
      ? '<p class="table-note">Filter comparison selected: the tables show the HP filter.</p>' : '';
    body.querySelectorAll('[data-table]').forEach(target => {
      const which = target.dataset.table;
      tableMeasureNow = state.tableMeasure.get(target.dataset.group) || 'total';
      tableQuarterly = state.tableBasis.get(target.dataset.group) === 'quarterly';
      const tables = payload.tables[tableMeasureNow][tableFilter()];
      let html = '';
      if (which === 'summary') html = statsTable(tables.summary, null);
      else if (which === 'cross') html = crossTable(tables.cross, payload.methods.lags);
      else if (which === 'matrix') html = matrixTable(payload.summary_keys, tables.matrix);
      else if (tables.sections[which]) {
        const aggregate = target.dataset.aggregate || null;
        html = statsTable(tables.sections[which], aggregate);
      }
      const sample = `${D.quarterLabel(payload.sample.start)}–${D.quarterLabel(payload.sample.end)}`;
      target.innerHTML = html + note
        + (which === 'matrix' || which === 'cross' ? '' : `<p class="table-note">${S.escapeHTML(FILTERS[tableFilter()].long)}, ${S.escapeHTML(sample)} (each statistic uses the quarters both series cover). Standard deviations are in percent of trend, or in percentage points for variables marked †${tableQuarterly ? '; inflation and interest rates per quarter (annual rate ÷ 4)' : ''}.</p>`);
    });
  }

  function updateDownloads() {
    const links = state.payload.downloads;
    if (!links) { el.downloads.hidden = true; return; }
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = false;
    if (state.payload.generated_at_utc) {
      el.updateNote.textContent = `Data updated on ${new Date(state.payload.generated_at_utc).toLocaleDateString('en-GB')}`;
      el.updateNote.hidden = false;
    }
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !state.payload) return;
        state.visible.add(entry.target);
        renderCard(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' })
    : null;

  async function load() {
    try {
      state.payload = await fetchCountry(state.country);
      el.pageStatus.hidden = true;
      updateDownloads();
      renderPicker();
      renderTables();
      state.visible.clear();
      cards.forEach(card => {
        if (observer) observer.observe(card);
        else { state.visible.add(card); renderCard(card); }
      });
    } catch (error) {
      el.pageStatus.hidden = false;
      el.pageStatus.className = 'render-error';
      el.pageStatus.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${S.escapeHTML(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  const picker = body.querySelector('[data-role="matrix-picker"]');
  if (picker) picker.addEventListener('click', onPicker);
  filterControl.select('hp', false);
  load();
})();
