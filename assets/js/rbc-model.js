/* Last edited: 2026-11-10 01:13 UTC (Claude, economics chat) */
/* =========================================================
   rbc-model.js: /economics/rbc-model.html
   Loads the generated rbc-model JSON for the selected country and
   draws: the technology shocks; the basic RBC model (King and
   Rebelo 1999, with trend growth) fed with those shocks, against
   the HP cycles of the data; the business-cycle statistics of the
   model and the data; the calibration and solution.
   Page-level settings, applied to every chart and table:
   - technical progress: Hicks- or Harrod-neutral;
   - productivity: measured, utilization-adjusted or comparison;
   - technology shocks: linear trend (model HP filtered afterwards,
     King and Rebelo), HP-filtered (the shortcut) or comparison.
   One comparison at a time. Uses AGDashboards (dashboards.js),
   AGSite and MathJax (math: true on the page).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="rbc-model"]');
  if (!body || !D || !S) return;

  const BENCHMARK_DASH = '8 4 0.1 4';   /* dash-dot, as on the other dashboards */
  const MULTI = ['--series-4', '--series-2', '--series-3', '--series-1'];
  const MEASURES = { measured: 'measured TFP', adjusted: 'utilization-adjusted TFP' };
  const KINDS = { kr: 'linear-trend shocks', hp: 'HP-filtered shocks' };
  const VARIABLES = {
    y: 'Output', c: 'Consumption', i: 'Investment', h: 'Hours worked', k: 'Capital',
    yh: 'Labour productivity', w: 'Real wage', r: 'Real interest rate', a: 'Technology',
  };
  /* King and Rebelo (1999, Table 3): moments of the basic model, HP filter.
     [standard deviation, relative standard deviation, autocorrelation,
     correlation with output]; their real rate is per quarter. */
  const KING_REBELO = {
    y: [1.39, 1.00, 0.72, 1.00], c: [0.61, 0.44, 0.79, 0.94], i: [4.09, 2.95, 0.71, 0.99],
    h: [0.67, 0.48, 0.71, 0.97], yh: [0.75, 0.54, 0.76, 0.98], w: [0.75, 0.54, 0.76, 0.98],
    r: [0.05, 0.04, 0.71, 0.95], a: [0.94, 0.68, 0.72, 1.00],
  };

  const techCard = body.querySelector('[data-role="technology-card"]');
  const modelCard = body.querySelector('[data-role="model-card"]');
  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const el = {
    pageStatus: body.querySelector('[data-role="page-status"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    downloads: body.querySelector('[data-role="downloads"]'),
    simDownloads: body.querySelector('[data-role="sim-downloads"]'),
    statsTable: body.querySelector('[data-role="stats-table"]'),
    statsNote: body.querySelector('[data-role="stats-note"]'),
    calibration: body.querySelector('[data-role="calibration-table"]'),
    calibrationNote: body.querySelector('[data-role="calibration-note"]'),
    krToggle: body.querySelector('[data-control="king-rebelo"]'),
  };
  const state = {
    country: 'US', form: 'hicks', tfp: 'measured', shocks: 'kr', variable: 'y',
    showKR: false, payload: null, techChart: null, modelChart: null,
  };
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => D.formatNumber(value, digits);
  const esc = text => S.escapeHTML(String(text));

  /* MathJax: clear old content before replacing it, typeset new content. */
  function untypeset(element) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
  }
  function typeset(element) {
    const MJ = window.MathJax;
    if (!MJ || !MJ.startup || !MJ.startup.promise) return;
    MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }
  function setHTML(element, html) {
    untypeset(element);
    element.innerHTML = html;
    typeset(element);
  }

  /* The model runs selected by the settings: each a productivity measure
     and a type of shock. */
  function variants() {
    const measures = state.tfp === 'comparison' ? ['measured', 'adjusted'] : [state.tfp];
    const kinds = state.shocks === 'comparison' ? ['kr', 'hp'] : [state.shocks];
    const list = [];
    measures.forEach(measure => kinds.forEach(kind => list.push({ measure, kind })));
    const several = list.length > 1;
    list.forEach((item, i) => {
      const parts = [];
      if (measures.length > 1) parts.push(MEASURES[item.measure]);
      if (kinds.length > 1) parts.push(KINDS[item.kind]);
      item.suffix = parts.join(', ');
      item.color = token(several ? MULTI[i % MULTI.length] : '--chart-1');
      item.dash = several && item.kind === 'hp' && kinds.length > 1 ? '6 4' : null;
    });
    return list;
  }

  const swatch = item => `
    <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
      <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
        stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;
  const sampleText = dates => `${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;

  /* Technology shocks --------------------------------------------- */

  function shockTable() {
    const block = state.payload.technology[state.form];
    const used = new Set(variants().map(v => v.measure));
    const rows = Object.entries(block.series).map(([key, t]) => `<tr${used.has(key) ? ' class="is-current"' : ''}>
        <th scope="row">${esc(t.label)}<br><span class="unit-label">${esc(block.label)}</span></th>
        <td>${fmt(t.rho, 3)}</td><td>${fmt(t.sigma, 2)}</td><td>${fmt(t.trend_growth_annual, 2)}</td>
        <td>${fmt(100 * t.share_negative_growth, 0)}</td>
        <td>${D.quarterLabel(t.estimation[0])}–${D.quarterLabel(t.estimation[1])}</td></tr>`);
    return `<div class="table-scroll"><table class="data-table shares-table bc-table shock-table">
      <caption class="visually-hidden">Estimated technology processes</caption>
      <thead><tr><th scope="col" class="component-head">Technology</th>
        <th scope="col">Persistence<br><span class="unit-label">(ρ)</span></th>
        <th scope="col">Standard deviation of the shock<br><span class="unit-label">(σ, percent)</span></th>
        <th scope="col">Trend growth<br><span class="unit-label">(percent a year)</span></th>
        <th scope="col">Quarters with falling technology<br><span class="unit-label">(percent)</span></th>
        <th scope="col">Estimation sample</th></tr></thead>
      <tbody>${rows.join('')}</tbody></table></div>`;
  }

  function renderTechnology() {
    const payload = state.payload;
    const block = payload.technology[state.form];
    const tech = block.series;
    const series = variants().map(v => {
      const t = tech[v.measure];
      const values = v.kind === 'hp' ? (t.hp_shock || []) : t.shock;
      const name = v.kind === 'hp' ? `${t.label}, HP-filtered shocks` : t.label;
      return { label: name, color: v.color, dash: v.dash, values };
    });
    const dates = payload.dates;
    inCard(techCard, 'chart-subtitle').textContent = `Percent · ${block.label} · ${sampleText(dates)}`;
    if (state.techChart) state.techChart.destroy();
    inCard(techCard, 'chart-status').hidden = true;
    inCard(techCard, 'chart-frame').hidden = false;
    /* The same symmetric axis whatever the settings: at least -4 to +4,
       wider only if a series of this form goes beyond. */
    const lim = Math.max(4, Math.ceil(Math.max(...Object.values(tech)
      .flatMap(item => [...item.shock, ...(item.hp_shock || [])].filter(Number.isFinite).map(Math.abs)))));
    state.techChart = D.lineChart(inCard(techCard, 'chart-frame'), {
      dates, series, period: 0.25, zeroLine: true, digits: 2, yRange: [-lim, lim],
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readout: inCard(techCard, 'chart-readout'),
      label: `Technology shocks, ${block.label}, with recessions shaded`,
    });
    inCard(techCard, 'chart-legend').innerHTML = series.map(swatch).join('');
    inCard(techCard, 'chart-legend').hidden = false;
    inCard(techCard, 'chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';
    const sources = Array.from(new Set(variants().map(v => tech[v.measure].source).filter(Boolean)));
    inCard(techCard, 'chart-source').textContent = `Source: ${sources.join('; ')}. Shocks: author’s calculations.`;
    inCard(techCard, 'shock-table').innerHTML = shockTable();
  }

  /* The model and the data ---------------------------------------- */

  const run = measure => state.payload.model.runs[state.form][measure];
  const statRow = (rows, key) => (rows || []).find(row => row.key === key) || {};
  const techLabel = () => (state.form === 'harrod' ? 'Labour-augmenting technology' : 'Total factor productivity');

  function renderModel() {
    const payload = state.payload;
    const model = payload.model;
    const key = state.variable;
    const unit = model.variables.find(v => v.key === key).units;
    const list = variants();
    const series = list.map(v => ({
      label: v.suffix ? `Model, ${v.suffix}` : 'Model',
      color: v.color, dash: v.dash, weight: list.length === 1 ? 1.1 : 1,
      values: run(v.measure).series[v.kind][key],
    }));
    series.push({
      label: 'US data', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true,
      values: model.data[key],
    });
    const dates = payload.dates;
    inCard(modelCard, 'chart-title').textContent = VARIABLES[key];
    inCard(modelCard, 'chart-subtitle').textContent = `${unit} · HP cyclical components · ${payload.technology[state.form].label} · ${sampleText(dates)}`;
    if (state.modelChart) state.modelChart.destroy();
    inCard(modelCard, 'chart-status').hidden = true;
    inCard(modelCard, 'chart-frame').hidden = false;
    state.modelChart = D.lineChart(inCard(modelCard, 'chart-frame'), {
      dates, series, period: 0.25, zeroLine: true, digits: 2,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readout: inCard(modelCard, 'chart-readout'),
      label: `${VARIABLES[key]}: the RBC model and the US data, HP cyclical components, with recessions shaded`,
    });
    inCard(modelCard, 'chart-legend').innerHTML = series.map(swatch).join('');
    inCard(modelCard, 'chart-legend').hidden = false;
    inCard(modelCard, 'chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';
    inCard(modelCard, 'chart-source').textContent = 'Data: HP cyclical components (λ = 1600) from the Real Business Cycles page, where the sources are listed. Model: author’s calculations.';

    /* How close the model is: correlation with the data and volatility. */
    const dataSd = statRow(run(list[0].measure).stats.data, key).sd;
    const parts = list.map(v => {
      const row = statRow(run(v.measure).stats[v.kind], key);
      const name = v.suffix ? `model with ${v.suffix}` : 'model';
      return `${name}: correlation with the data ${fmt(row.corr_data)}, standard deviation ${fmt(row.sd)}`;
    });
    let note = `${parts.join('; ')}; standard deviation of the data ${fmt(dataSd)}${key === 'r' ? ' (percentage points)' : ''}.`;
    note = note.charAt(0).toUpperCase() + note.slice(1);
    const adjusted = list.find(v => v.measure === 'adjusted');
    if (adjusted && key === 'y' && statRow(run('adjusted').stats[adjusted.kind], 'y').corr_data < 0.3) {
      note += ' With utilization-adjusted TFP, the model’s output is almost unrelated to the data: once changes in the intensity with which capital and labour are used are removed, technology shocks explain little of the US business cycle, as Basu, Fernald and Kimball (2006) found.';
    }
    if (key === 'r') {
      note += ' The model’s rate is the expected real return implied by the Euler equation; the data’s is the ex-post real Treasury-bill rate, which also moves with monetary policy and unexpected inflation.';
    }
    if (key === 'yh' || key === 'w') {
      note += ' In the model, labour productivity and the real wage are the same series: with a Cobb–Douglas production function, the wage is proportional to output per hour.';
    }
    inCard(modelCard, 'chart-note').textContent = note;
  }

  /* Statistics table --------------------------------------------- */

  function statsTable() {
    const model = state.payload.model;
    const list = variants();
    const first = run(list[0].measure);
    const cells = (row, withData) => `<td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td>
      <td>${fmt(row.corr_y)}</td><td>${withData ? fmt(row.corr_data) : '–'}</td>`;
    const keys = ['y', 'c', 'i', 'h', 'k', 'yh', 'w', 'r', 'a'];
    const rows = keys.map(key => {
      const name = key === 'a' ? techLabel() : VARIABLES[key];
      const mark = key === 'r' ? ' <span class="unit-mark" title="Standard deviation in percentage points">†</span>' : '';
      /* The data row: technology differs by measure, the rest does not. */
      const dataRows = key === 'a' && list.some(v => v.measure !== list[0].measure)
        ? ['measured', 'adjusted'].map(m => `<tr><th scope="row">${esc(name)}${mark}<br><span class="unit-label">US data, ${esc(MEASURES[m])}</span></th>${cells(statRow(run(m).stats.data, key), false)}</tr>`)
        : [`<tr><th scope="row">${esc(name)}${mark}<br><span class="unit-label">US data</span></th>${cells(statRow(first.stats.data, key), false)}</tr>`];
      const modelRows = list.map(v => `<tr class="kr-row model-row"><th scope="row">${esc(v.suffix ? `Model, ${v.suffix}` : 'Model')}</th>${cells(statRow(run(v.measure).stats[v.kind], key), true)}</tr>`);
      const krRow = state.showKR && KING_REBELO[key]
        ? [`<tr class="kr-row"><th scope="row">King and Rebelo (1999)</th>${KING_REBELO[key].map(v => `<td>${fmt(v)}</td>`).join('')}<td>–</td></tr>`]
        : [];
      return [...dataRows, ...modelRows, ...krRow].join('');
    }).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table model-stats">
      <caption class="visually-hidden">Business-cycle statistics of the model and the data</caption>
      <thead><tr><th scope="col" class="component-head">Variable</th>
        <th scope="col">Standard<br>deviation</th>
        <th scope="col">Relative standard deviation<br><span class="unit-label">(to output)</span></th>
        <th scope="col">First-order<br>autocorrelation</th>
        <th scope="col">Correlation<br>with output</th>
        <th scope="col">Correlation<br>with the data</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function renderStats() {
    el.statsTable.innerHTML = statsTable();
    const dates = state.payload.dates;
    let note = `United States, ${sampleText(dates)}, HP filter (λ = 1600); output, consumption, investment, hours and capital per capita. The model’s statistics are computed on its simulated series over the same quarters as the data. † Standard deviation in percentage points (annual rate).`;
    if (state.showKR) {
      note += ' King and Rebelo’s (1999, Table 3) statistics are population moments of their model, with technology shocks estimated on 1947–96; their real interest rate is per quarter, so its standard deviation is about a quarter of an annual rate’s.';
    }
    el.statsNote.textContent = note;
  }

  /* Calibration and solution -------------------------------------- */

  function calibrationTable() {
    const model = state.payload.model;
    const cal = model.calibration;
    const measures = Array.from(new Set(variants().map(v => v.measure)));
    const tech = state.payload.technology[state.form].series;
    const several = measures.length > 1;
    const head = measures.map(m => `<th scope="col">${several ? `Value<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : 'Value'}</th>`).join('');
    const same = value => measures.map(() => `<td>${value}</td>`).join('');
    const each = fn => measures.map(m => `<td>${fn(run(m), tech[m])}</td>`).join('');
    const shockSymbol = state.form === 'harrod' ? '\\(\\sigma_{Z}\\)' : '\\(\\sigma_{A}\\)';
    const rows = [
      ['Discount factor', '\\(\\beta\\)', same(fmt(cal.beta, 3)), '0.984'],
      ['Capital’s share of income', '\\(\\alpha\\)', same(fmt(cal.alpha, 3)), '0.333'],
      ['Depreciation rate (per quarter)', '\\(\\delta\\)', same(fmt(cal.delta, 3)), '0.025'],
      ['Weight of leisure in utility', '\\(\\xi\\)', same(fmt(cal.xi, 2)), '3.48'],
      ['Trend growth (gross, per quarter)', '\\(\\gamma\\)', each(r => `${fmt(r.gamma, 5)}<br><span class="unit-label">${fmt(r.trend_growth_x_annual, 2)}% a year</span>`), '1.004'],
      ['Persistence of technology', '\\(\\rho\\)', each(r => fmt(r.rho, 3)), '0.979'],
      ['Standard deviation of the shocks (percent)', shockSymbol, each((r, t) => fmt(t.sigma, 2)), state.form === 'harrod' ? '–' : '0.72'],
      ['Hours (share of time)', '\\(N\\)', each(r => fmt(r.steady_state.hours, 3)), '0.20'],
      ['Capital–output ratio (years)', '\\(K/Y\\)', each(r => fmt(r.steady_state.k_y_annual, 2)), '–'],
      ['Investment share of output', '\\(I/Y\\)', each(r => fmt(r.steady_state.i_y, 3)), '–'],
      ['Consumption share of output', '\\(C/Y\\)', each(r => fmt(r.steady_state.c_y, 3)), '–'],
      ['Real interest rate (percent a year)', '\\(r\\)', each(r => fmt(r.steady_state.r_annual, 2)), '6.5'],
      ['Eigenvalues (absolute values)', '\\(|\\lambda|\\)', each(r => r.eigenvalues.map(v => fmt(v, 3)).join(', ')), '–'],
      ['Consumption rule', '\\(g_A,\\ g_K\\)', each(r => `${fmt(r.policy.c_a, 3)}, ${fmt(r.policy.c_k, 3)}`), '–'],
    ];
    const group = (title, list) => `<tr class="table-group"><th scope="rowgroup" colspan="${3 + measures.length}">${title}</th></tr>`
      + list.map(([name, symbol, values, kr]) => `<tr><th scope="row">${esc(name)}</th><td class="symbol-cell">${symbol}</td>${values}<td>${kr}</td></tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Calibration, steady state and solution of the model</caption>
      <thead><tr><th scope="col" class="component-head">Parameter</th><th scope="col">Symbol</th>${head}
        <th scope="col">King and Rebelo<br><span class="unit-label">(1999, Table 2)</span></th></tr></thead>
      <tbody>${group('Parameters', rows.slice(0, 7))}${group('Steady state', rows.slice(7, 12))}${group('Solution', rows.slice(12))}</tbody></table></div>`;
  }

  function renderCalibration() {
    setHTML(el.calibration, calibrationTable());
    const harrod = state.form === 'harrod'
      ? ' With Harrod-neutral technology, the shocks to \\(Z\\) enter the model as \\(A = Z^{1-\\alpha}\\), so their effect is that of shocks \\(1-\\alpha\\) times as large to total factor productivity.'
      : '';
    setHTML(el.calibrationNote, `The discount factor, capital’s share, the depreciation rate and the weight of leisure are those of King and Rebelo (1999, Table 2); utility is logarithmic in consumption and leisure. Trend growth, persistence and the size of the shocks are estimated from the technology series selected above: the trend growth of \\(X\\) is the trend growth of TFP divided by labour’s share, \\(1-\\alpha\\), close to King and Rebelo’s 1.6 percent a year. With trend growth, the same discount factor implies a higher interest rate, \\(r = \\gamma/\\beta - 1\\), than King and Rebelo’s 6.5 percent, and a lower capital–output ratio. One eigenvalue lies outside the unit circle, as the Blanchard–Kahn condition requires; the other two are the persistence of technology and the speed at which capital returns to its steady state.${harrod}`);
  }

  /* Rendering ------------------------------------------------------- */

  function render() {
    const payload = state.payload;
    if (!payload) return;
    if (!payload.technology[state.form]) state.form = 'hicks';
    renderTechnology();
    if (payload.model && payload.model.runs[state.form]) {
      renderModel();
      renderStats();
      renderCalibration();
    }
  }

  function updateDownloads() {
    const links = state.payload.downloads || {};
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = !links.shocks_csv;
    el.simDownloads.hidden = !links.simulations_csv;
  }

  function showModelMissing() {
    const message = '<p class="loading-message">The model simulations will appear after the next data update.</p>';
    inCard(modelCard, 'chart-status').textContent = 'The model simulations will appear after the next data update.';
    el.statsTable.innerHTML = message;
    el.calibration.innerHTML = '';
    if (el.krToggle) el.krToggle.hidden = true;
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', state.country.toLowerCase());
      const response = await S.fetchFresh(url);
      const payload = await response.json();
      if (!payload || !payload.technology) throw new Error('The data file does not contain the expected series.');
      state.payload = payload;
      el.pageStatus.hidden = true;
      if (!payload.technology.harrod) body.querySelector('[data-control="form"]').hidden = true;
      if (!payload.model) showModelMissing();
      render();
      updateDownloads();
      if (payload.generated_at_utc) {
        el.updateNote.textContent = `Data updated on ${new Date(payload.generated_at_utc).toLocaleDateString('en-GB')}`;
        el.updateNote.hidden = false;
      }
    } catch (error) {
      el.pageStatus.hidden = false;
      el.pageStatus.className = 'render-error';
      el.pageStatus.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  /* Settings: one comparison at a time. */
  const formControl = D.segmented(body.querySelector('[data-control="form"]'), value => {
    state.form = value;
    render();
  });
  let shocksControl = null;
  const tfpControl = D.segmented(body.querySelector('[data-control="tfp"]'), value => {
    state.tfp = value;
    if (value === 'comparison' && state.shocks === 'comparison') {
      state.shocks = 'kr';
      shocksControl.select('kr', false);
    }
    render();
  });
  shocksControl = D.segmented(body.querySelector('[data-control="shocks"]'), value => {
    state.shocks = value;
    if (value === 'comparison' && state.tfp === 'comparison') {
      state.tfp = 'measured';
      tfpControl.select('measured', false);
    }
    render();
  });
  D.segmented(modelCard.querySelector('[data-control="variable"]'), value => {
    state.variable = value;
    if (state.payload && state.payload.model) renderModel();
  });
  if (el.krToggle) {
    el.krToggle.addEventListener('click', () => {
      state.showKR = !state.showKR;
      el.krToggle.setAttribute('aria-pressed', String(state.showKR));
      if (state.payload && state.payload.model) renderStats();
    });
  }
  formControl.select('hicks', false);
  tfpControl.select('measured', false);
  shocksControl.select('kr', false);
  load();
})();
