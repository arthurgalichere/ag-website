/* Last edited: 2026-11-21 11:06 UTC (Claude, economics chat) */
/* =========================================================
   business-dynamics.js: /economics/business-dynamics.html
   Renders business-dynamics.json (built by the private
   business_dynamics.py): annual series of the Census Bureau's Business
   Dynamics Statistics and quarterly series of the BLS Business Employment
   Dynamics, as chart cards (data-block: annual | quarterly; data-keys;
   data-cycles: HP cycles drawn with the cycle of real GDP), the size-class
   table, the statistics for calibration, the value of entrants
   (entry_value: data-table="entry-value"), the statistics of each series
   and their cycle statistics. Charts are drawn when they come into view.
   Uses AGDashboards (dashboards.js) and AGSite (site.js).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  /* Also drives Investor Sentiment and Equity Issuance (same payload layout:
     blocks annual and/or quarterly, variables, recessions, downloads, and a
     targets table). */
  const body = document.querySelector('[data-dashboard="business-dynamics"], [data-dashboard="investor-sentiment"]');
  if (!body || !D || !S) return;

  const COLOURS = ['--chart-1', '--series-1', '--series-2', '--series-4'];
  const BENCHMARK_DASH = '8 4 0.1 4';
  const GDP = { annual: 'gdp_a', quarterly: 'gdp_q' };
  const state = { payload: null, charts: new Map() };
  const cards = Array.from(body.querySelectorAll('.chart-card[data-keys]'));
  const esc = text => S.escapeHTML(String(text == null ? '' : text));
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (v, d = 2) => (v == null || !Number.isFinite(Number(v)) ? '–' : D.formatNumber(Number(v), d));
  const variable = key => state.payload.variables[key] || { label: key, units: '', digits: 2 };
  const label = key => variable(key).label;

  function setHTML(element, html) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  /* Chart cards ------------------------------------------- */

  function renderCard(card) {
    const role = name => card.querySelector(`[data-role="${name}"]`);
    const block = state.payload[card.dataset.block];
    if (!block) return;
    const annual = card.dataset.block === 'annual';
    const cycles = card.dataset.cycles === 'true';
    const keys = card.dataset.keys.split(',').map(k => k.trim()).filter(k => (cycles ? block.cycles : block.values)[k]);
    const source = cycles ? block.cycles : block.values;
    const series = keys.map((key, i) => ({
      label: label(key),
      color: token(keys.length === 1 ? '--chart-1' : COLOURS[i % COLOURS.length]),
      values: source[key],
    }));
    if (cycles && source[GDP[card.dataset.block]]) {
      series.push({ label: 'Real GDP', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true,
        values: source[GDP[card.dataset.block]] });
    }
    /* Trim leading and trailing periods without any value. */
    const has = i => series.some(s => s.values[i] != null);
    let first = 0;
    let last = block.dates.length - 1;
    while (first < last && !has(first)) first += 1;
    while (last > first && !has(last)) last -= 1;
    const dates = block.dates.slice(first, last + 1);
    series.forEach(s => { s.values = s.values.slice(first, last + 1); });

    const periodLabel = annual ? D.yearLabel : D.quarterLabel;
    const units = cycles
      ? 'Cycles: percentage points (rates), percent (counts, GDP)'
      : Array.from(new Set(keys.map(k => variable(k).units))).join('; ');
    role('chart-subtitle').textContent = `${units} · ${annual ? 'annual' : 'quarterly'} · ${periodLabel(dates[0])}–${periodLabel(dates[dates.length - 1])}`;

    const prev = state.charts.get(card);
    if (prev) prev.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    state.charts.set(card, D.lineChart(role('chart-frame'), {
      dates,
      series,
      period: annual ? 1 : 0.25,
      recessions: state.payload.recessions ? state.payload.recessions.intervals : [],
      zeroLine: card.dataset.zeroLine === 'true',
      digits: Math.min(...keys.map(k => variable(k).digits ?? 2), 2),
      readout: role('chart-readout'),
      label: `${card.querySelector('.chart-title').textContent}${cycles ? ', cyclical components' : ''}, with recessions shaded`,
    }));

    const swatch = item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;
    role('chart-legend').innerHTML = series.map(swatch).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = `Hover over the chart, or focus it and use the arrow keys, to read values by ${annual ? 'year' : 'quarter'}.`;
    const sources = Array.from(new Set([...keys, ...(cycles ? [GDP[card.dataset.block]] : [])].map(k => variable(k).source)));
    role('chart-source').textContent = `Source: ${sources.join('; ')}.${cycles ? ' Cycles: author’s calculations.' : ''}`;
  }

  /* Tables ------------------------------------------------- */

  const table = (caption, head, rows, extra = '') => `<div class="table-scroll"><table class="data-table shares-table bc-table ${extra}">
    <caption class="visually-hidden">${esc(caption)}</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;

  function renderSize() {
    const target = body.querySelector('[data-table="size"]');
    const rows = state.payload.annual && state.payload.annual.size_table;
    if (!target || !rows) return;
    const head = `<tr><th scope="col" class="component-head">Firm size</th><th scope="col">Share of firms<br><span class="unit-label">(%)</span></th>
      <th scope="col">Share of employment<br><span class="unit-label">(%)</span></th><th scope="col">Job creation rate<br><span class="unit-label">(%)</span></th>
      <th scope="col">Job destruction rate<br><span class="unit-label">(%)</span></th><th scope="col">Net job creation rate<br><span class="unit-label">(%)</span></th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.firms, 1)}<br><span class="unit-label">latest ${fmt(r.firms_latest, 1)}</span></td>
      <td>${fmt(r.emp, 1)}<br><span class="unit-label">latest ${fmt(r.emp_latest, 1)}</span></td><td>${fmt(r.jc)}</td><td>${fmt(r.jd)}</td><td>${fmt(r.net_jc)}</td></tr>`).join('');
    target.innerHTML = table('Firm size classes', head, body_)
      + '<p class="table-note">Averages of the annual values over the whole sample; “latest”: the last year.</p>';
  }

  function renderCalibration() {
    const target = body.querySelector('[data-table="calibration"]');
    const rows = state.payload.calibration || [];
    if (!target) return;
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Mean<br><span class="unit-label">(% per period)</span></th>
      <th scope="col">Per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Per year<br><span class="unit-label">(%)</span></th>
      <th scope="col">Sample</th><th scope="col" class="source-col">Note</th></tr>`;
    const body_ = rows.map(r => {
      const q = r.freq === 'Q' ? r.mean : r.quarterly;
      const a = r.freq === 'A' ? r.mean : r.annual;
      return `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${r.freq === 'A' ? 'annual, BDS' : 'quarterly, BED'}</span></th>
        <td>${fmt(r.mean)}</td><td>${fmt(q)}</td><td>${fmt(a)}</td><td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`;
    }).join('');
    setHTML(target, table('Statistics for calibration', head, body_, 'calibration-page-table')
      + '<p class="table-note">Per quarter and per year: the mean converted with \\(1-(1-s)^{1/4}\\) or \\(1-(1-s)^{4}\\) for probabilities of entry and exit; job flows are not converted.</p>');
  }

  function renderStats(name) {
    const target = body.querySelector(`[data-table="stats-${name}"]`);
    const block = state.payload[name];
    if (!target || !block) return;
    const growth = block.stats.some(r => r.growth_mean != null);
    const head = `<tr><th scope="col" class="component-head">Series</th><th scope="col">Mean</th><th scope="col">Standard deviation</th>
      <th scope="col">Minimum</th><th scope="col">Maximum</th><th scope="col">Last 10 years</th><th scope="col">Latest</th>
      ${growth ? '<th scope="col">Growth rate<br><span class="unit-label">(% a year, mean)</span></th>' : ''}</tr>`;
    const body_ = block.stats.map(r => {
      const d = variable(r.key).digits ?? 2;
      return `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${esc(variable(r.key).units)}, ${esc(r.start)}–${esc(r.end)}</span></th>
        <td>${fmt(r.mean, d)}</td><td>${fmt(r.sd, d)}</td>
        <td>${fmt(r.min, d)}<br><span class="unit-label">${esc(r.min_period)}</span></td><td>${fmt(r.max, d)}<br><span class="unit-label">${esc(r.max_period)}</span></td>
        <td>${fmt(r.mean_10, d)}</td><td>${fmt(r.latest, d)}<br><span class="unit-label">${esc(r.latest_period)}</span></td>
        ${growth ? `<td>${r.growth_mean == null ? '' : fmt(r.growth_mean)}</td>` : ''}</tr>`;
    }).join('');
    target.innerHTML = table(`Statistics of the ${name} series`, head, body_);
  }

  function lagText(k, unit) {
    if (k == null) return '–';
    if (k === 0) return 'coincident';
    return k < 0 ? `leads by ${-k} ${unit}` : `lags by ${k} ${unit}`;
  }

  function renderCycleStats(name) {
    const target = body.querySelector(`[data-table="cycles-${name}"]`);
    const block = state.payload[name];
    if (!target || !block) return;
    const { lags, rows } = block.cycle_stats;
    const unit = name === 'annual' ? 'year' : 'quarter';
    const unitPl = k => (Math.abs(k) === 1 ? unit : `${unit}s`);
    const head = `<tr><th scope="col" rowspan="2" class="component-head">Series x</th><th scope="col" rowspan="2">Standard deviation</th>
      <th scope="col" rowspan="2">Relative to GDP</th><th scope="col" rowspan="2">Autocorrelation</th>
      <th scope="colgroup" colspan="${lags.length}">Correlation of \\(x_{t+k}\\) with real GDP \\(y_t\\)</th><th scope="col" rowspan="2">Peak</th></tr>
      <tr>${lags.map(k => `<th scope="col">\\(k = ${k > 0 ? '+' : ''}${k}\\)</th>`).join('')}</tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${esc(r.start)}–${esc(r.end)}</span></th>
      <td>${fmt(r.sd)}</td><td>${r.rel_sd == null ? '–' : fmt(r.rel_sd)}</td><td>${fmt(r.ar1)}</td>
      ${r.corr.map((v, i) => `<td${lags[i] === r.peak_lag ? ' class="is-peak"' : ''}>${fmt(v)}</td>`).join('')}
      <td class="peak-lag">${lagText(r.peak_lag, unitPl(r.peak_lag || 0))}</td></tr>`).join('');
    setHTML(target, table(`Cycle statistics, ${name}`, head, body_, 'cross-table')
      + `<p class="table-note">Hodrick–Prescott filter, λ = ${D.formatNumber(block.cycle_stats.lambda, name === 'annual' ? 2 : 0)}. Standard deviations in percentage points for rates and in percent for counts; relative standard deviations for counts and employment only.</p>`);
  }

  function renderSurvival() {
    const surv = state.payload.survival || {};
    const steadyEl = body.querySelector('[data-table="survival-steady"]');
    const dynEl = body.querySelector('[data-table="survival-dynamics"]');
    if (steadyEl && surv.steady) {
      const head = `<tr><th scope="col" class="component-head">Unit and source</th><th scope="col">Survival per quarter<br><span class="unit-label">\\(s\\) (%)</span></th>
        <th scope="col">Exit per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Exit per year<br><span class="unit-label">(%)</span></th>
        <th scope="col">Sample</th><th scope="col" class="source-col">Definition</th></tr>`;
      const rows = surv.steady.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.survival_q, 3)}</td><td>${fmt(r.exit_q, 3)}</td>
        <td>${fmt(r.exit_annual)}</td><td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`).join('');
      setHTML(steadyEl, table('Steady-state survival rate', head, rows, 'calibration-page-table'));
    }
    if (dynEl && surv.dynamics) {
      const head = `<tr><th scope="col" class="component-head">Method</th><th scope="col">Persistence<br><span class="unit-label">\\(\\rho_s\\), quarterly</span></th>
        <th scope="col">Shock s.d.<br><span class="unit-label">\\(\\sigma_s\\), quarterly</span></th><th scope="col">Annual AR(1)<br><span class="unit-label">\\(\\rho\\), \\(\\sigma\\)</span></th>
        <th scope="col">Sample</th><th scope="col" class="source-col">Notes</th></tr>`;
      const tag = r => (r.recommended ? '<br><span class="unit-label">default (HP filter)</span>' : r.alternative ? '<br><span class="unit-label">alternative</span>' : '');
      const rows = surv.dynamics.map(r => `<tr${r.recommended ? ' class="baseline-row"' : ''}><th scope="row">${esc(r.key)}. ${esc(r.label)}${tag(r)}</th>
        <td>${fmt(r.rho, 3)}</td><td>${fmt(r.sigma, 3)}<br><span class="unit-label">${esc(r.units)}</span></td>
        <td>${r.rho_annual == null ? '–' : `${fmt(r.rho_annual, 3)}, ${fmt(r.sigma_annual, 3)}`}</td><td>${esc(r.sample)}</td>
        <td class="source-cell">${esc(r.note)}${r.flag ? ' The annual autocorrelation is not positive: ρ is set to 0.' : ''}</td></tr>`).join('');
      setHTML(dynEl, table('Dynamics of survival', head, rows, 'calibration-page-table')
        + '<p class="table-note">Standard deviations in percent of the survival rate (log points × 100), except C, in percentage points as in the previous approach (almost the same, since s is close to 1).</p>');
    }
  }

  /* Value of entrants (eps = I_0/p^A): per year, per quarter (converted
     year by year), subperiods, sample, formula, note, data key. */
  function renderEntry() {
    const target = body.querySelector('[data-table="entry-value"]');
    const rows = state.payload.entry_value;
    if (!target) return;
    if (!rows || !rows.length) { target.innerHTML = '<p class="empty-message">Not available yet.</p>'; return; }
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Per year<br><span class="unit-label">(% or ratio)</span></th>
      <th scope="col">Per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Subperiods<br><span class="unit-label">(per quarter, %)</span></th>
      <th scope="col">Sample</th><th scope="col" class="source-col">Method and note</th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}${r.symbol ? `<br><span class="unit-label">\\(${r.symbol}\\)</span>` : ''}<br><span class="unit-label">data: ${esc(r.data_key)}</span></th>
      <td>${fmt(r.annual, r.digits ?? 3)}</td><td>${r.quarterly == null ? '–' : fmt(r.quarterly, 3)}</td>
      <td>${(r.subperiods || []).map(x => `${fmt(x.quarterly, 3)} <span class="unit-label">(${esc(x.sample)})</span>`).join('<br>') || '–'}</td>
      <td>${esc(r.sample)}</td><td class="source-cell">${esc(r.formula)}. ${esc(r.note)}</td></tr>`).join('');
    setHTML(target, table('Value of entrants', head, body_, 'calibration-page-table')
      + '<p class="table-note">Rates per quarter: \\(1-(1-x)^{1/4}\\) for each year’s rate \\(x\\), then averaged; ratios of nominal values.</p>');
  }

  /* Calibration targets: label, value, units, sample, note. */
  function renderTargets() {
    const target = body.querySelector('[data-table="targets"]');
    const rows = state.payload.targets;
    if (!target || !rows) return;
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Value</th><th scope="col">Sample</th><th scope="col" class="source-col">Note</th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.value, r.digits ?? 2)}${r.units ? `<br><span class="unit-label">${esc(r.units)}</span>` : ''}</td>
      <td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`).join('');
    target.innerHTML = table('Statistics for calibration', head, body_, 'calibration-page-table');
  }

  function renderTables() {
    renderTargets();
    renderEntry();
    renderSize();
    renderCalibration();
    renderSurvival();
    renderStats('annual');
    renderStats('quarterly');
    renderCycleStats('annual');
    renderCycleStats('quarterly');
  }

  /* Page ---------------------------------------------------- */

  function updatePage() {
    const p = state.payload;
    const links = p.downloads || {};
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    const downloads = body.querySelector('[data-role="downloads"]');
    if (downloads) downloads.hidden = false;
    const note = body.querySelector('[data-role="update-note"]');
    if (note && p.generated_at_utc) {
      note.textContent = `Data updated on ${new Date(p.generated_at_utc).toLocaleDateString('en-GB')}`;
      note.hidden = false;
    }
    const vintage = body.querySelector('[data-role="bds-vintage"]');
    if (vintage && p.annual) vintage.textContent = `the ${p.annual.vintage} vintage (1978–${p.annual.dates[p.annual.dates.length - 1].slice(0, 4)})`;
    const bds = body.querySelector('[data-role="bds-note"]');
    if (bds && p.annual) {
      const y = Number(p.annual.dates[p.annual.dates.length - 1].slice(0, 4));
      bds.textContent = `Annual data (Business Dynamics Statistics, ${p.annual.vintage} release): a year runs from March of the previous year to March (employment on 12 March), so ${y} is March ${y - 1} to March ${y}.`;
    }
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !state.payload) return;
        renderCard(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' })
    : null;

  async function load() {
    const status = body.querySelector('[data-role="page-status"]');
    try {
      const response = await S.fetchFresh(body.dataset.dataUrl.replace('{country}', 'us'));
      state.payload = await response.json();
      if (!state.payload || !(state.payload.annual || state.payload.quarterly)) throw new Error('The data file does not contain the expected series.');
      status.hidden = true;
      updatePage();
      renderTables();
      cards.forEach(card => {
        if (observer) observer.observe(card);
        else renderCard(card);
      });
    } catch (error) {
      status.hidden = false;
      status.className = 'render-error';
      status.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  /* Links that open and scroll to a ribbon. */
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    const target = link && document.getElementById(link.getAttribute('href').slice(1));
    if (!target || target.tagName !== 'DETAILS') return;
    event.preventDefault();
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  });

  load();
})();
