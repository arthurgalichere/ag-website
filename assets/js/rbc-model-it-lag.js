/* Last edited: 2026-11-12 17:25 UTC (Claude, economics chat) */
/* =========================================================
   rbc-model-it-lag.js: /economics/rbc-model-it-lag.html
   The RBC model with firm-owned capital and an investment
   installation lag. Loads rbc-model-it-lag.json (built with the
   canonical model in main_aggregate.py) and draws: calibration and
   steady state (against the canonical model); simulations driven by
   the measured technology shocks against the HP cycles of the data;
   business-cycle statistics (data, this model, the canonical model);
   impulse responses to a technology shock (against the canonical
   model) and to an installation shock.
   Page-level settings as on the canonical RBC page: technical
   progress (Hicks or Harrod), productivity (measured, utilization-
   adjusted or comparison), technology shocks (linear trend, HP-
   filtered or comparison); one comparison at a time.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="rbc-model-it-lag"]');
  if (!body || !D || !S) return;

  const BENCHMARK_DASH = '8 4 0.1 4';
  const MULTI = ['--series-4', '--series-2', '--series-3', '--series-1'];
  const MEASURES = { measured: 'measured TFP', adjusted: 'utilization-adjusted TFP' };
  const KINDS = { kr: 'linear-trend shocks', hp: 'HP-filtered shocks' };
  const VARIABLES = {
    y: 'Output', c: 'Consumption', i: 'Investment', h: 'Hours worked', k: 'Capital',
    yh: 'Labour productivity', w: 'Real wage', r: 'Real interest rate', a: 'Technology',
    f: 'Speed of installation', q: 'Tobin’s q',
  };
  const STAT_KEYS = ['y', 'c', 'i', 'k', 'h', 'w', 'r', 'yh', 'a'];

  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const modelCards = Array.from(body.querySelectorAll('[data-model-var]'));
  const tfpCards = Array.from(body.querySelectorAll('[data-irf-tfp]'));
  const phiCards = Array.from(body.querySelectorAll('[data-irf-phi]'));
  const role = name => body.querySelector(`[data-role="${name}"]`);
  const el = {
    pageStatus: role('page-status'),
    updateNote: role('update-note'),
    calibration: role('calibration-table'),
    calibrationNote: role('calibration-note'),
    steady: role('steady-table'),
    solution: role('solution-table'),
    statsTable: role('stats-table'),
    corrTable: role('corr-table'),
    statsNote: role('stats-note'),
    tfpIntro: role('irf-tfp-intro'),
    phiIntro: role('irf-phi-intro'),
  };
  const state = {
    country: 'US', form: 'hicks', tfp: 'measured', shocks: 'kr', compare: 'data', payload: null, charts: new Map(),
  };
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => D.formatNumber(value, digits);
  const esc = text => S.escapeHTML(String(text));

  function setHTML(element, html) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

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
  const measuresInUse = () => Array.from(new Set(variants().map(v => v.measure)));
  const run = measure => state.payload.runs[state.form][measure];
  const canonical = measure => state.payload.canonical[state.form][measure];
  const statRow = (rows, key) => (rows || []).find(row => row.key === key) || {};
  const sampleText = dates => `${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;
  const swatch = item => `
    <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
      <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
        stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;

  function draw(card, options, series) {
    const previous = state.charts.get(card);
    if (previous) previous.destroy();
    inCard(card, 'chart-status').hidden = true;
    inCard(card, 'chart-frame').hidden = false;
    state.charts.set(card, D.lineChart(inCard(card, 'chart-frame'), { ...options, series, readout: inCard(card, 'chart-readout') }));
    const legend = inCard(card, 'chart-legend');
    legend.innerHTML = series.length > 1 ? series.map(swatch).join('') : '';
    legend.hidden = series.length < 2;
    inCard(card, 'chart-readout').textContent = options.readoutText || '';
  }

  /* Calibration, steady state and solution ------------------------- */

  function columns() {
    const measures = measuresInUse();
    const several = measures.length > 1;
    return {
      measures,
      head: measures.map(m => `<th scope="col">${several ? `Value<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : 'Value'}</th>`).join(''),
      same: value => measures.map(() => `<td>${value}</td>`).join(''),
      each: fn => measures.map(m => `<td>${fn(run(m), canonical(m), state.payload.technology[state.form].series[m])}</td>`).join(''),
    };
  }

  function renderCalibration() {
    const cal = state.payload.calibration;
    const { head, same, each } = columns();
    const harrod = state.form === 'harrod';
    const rows = [
      ['Discount factor', '\\(\\beta\\)', same(fmt(cal.beta, 3))],
      ['Capital’s share of income', '\\(\\alpha\\)', same(fmt(cal.alpha, 3))],
      ['Depreciation rate (per quarter)', '\\(\\delta\\)', same(fmt(cal.delta, 3))],
      ['Weight of leisure in utility', '\\(\\theta\\)', same(fmt(cal.xi, 2))],
      ['Trend growth (per quarter)', '\\(g_X\\)', each(r => `${fmt(r.g_x, 5)}`)],
      ['Persistence of technology', '\\(\\rho_A\\)', each(r => fmt(r.rho, 3))],
      ['Standard deviation of the technology shocks (percent)', harrod ? '\\(\\sigma_{\\varepsilon^Z}\\)' : '\\(\\sigma_{\\varepsilon^A}\\)', each((r, c, t) => fmt(t.sigma, 2))],
      ['Steady-state speed of installation', '\\(\\phi\\)', same(fmt(cal.phi, 2))],
      ['Persistence of the speed of installation', '\\(\\rho_\\phi\\)', same(fmt(cal.rho_phi, 3))],
      ['Standard deviation of the installation shocks (percent)', '\\(\\sigma_{\\varepsilon^\\phi}\\)', same(fmt(cal.sigma_phi, 4))],
    ];
    setHTML(el.calibration, `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Calibration of the model</caption>
      <thead><tr><th scope="col" class="component-head">Parameter</th><th scope="col">Symbol</th>${head}</tr></thead>
      <tbody>${rows.map(([n, s, v]) => `<tr><th scope="row">${esc(n)}</th><td class="symbol-cell">${s}</td>${v}</tr>`).join('')}</tbody></table></div>`);
    setHTML(el.calibrationNote, 'The preferences, technology and trend growth are calibrated as for the <a class="text-link" href="/economics/rbc-model.html#calibration">canonical RBC model</a>: King and Rebelo (1999, Table 2), with a discount factor of 0.988, and the trend, persistence and size of the technology shocks estimated from the technology series selected above. The parameters of the speed of installation are the author’s estimates, provisional.');
  }

  function renderSteady() {
    const { measures, each } = columns();
    const several = measures.length > 1;
    const head = measures.map(m => `<th scope="col">This model${several ? `<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : ''}</th>
      <th scope="col">Canonical model${several ? `<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : ''}</th>`).join('');
    const both = fn => measures.map(m => `<td>${fn(run(m).steady_state)}</td><td>${fn(canonical(m).steady_state, true)}</td>`).join('');
    const rows = [
      ['Tobin’s q', '\\(q\\)', both((s, can) => (can ? '1' : fmt(s.q, 4)))],
      ['Marginal product of capital (percent a year)', '\\(\\alpha Y/K\\)', both((s, can) => (can ? '–' : fmt(s.mpk_annual, 2)))],
      ['Hours worked (share of time)', '\\(h\\)', both(s => fmt(s.hours, 3))],
      ['Capital–output ratio (years)', '\\(K/Y\\)', both(s => fmt(s.k_y_annual, 2))],
      ['Investment share of output', '\\(I/Y\\)', both(s => fmt(s.i_y, 3))],
      ['Consumption share of output', '\\(c/Y\\)', both(s => fmt(s.c_y, 3))],
      ['Dividends relative to output', '\\(d/Y\\)', both((s, can) => (can ? '–' : fmt(s.d_y, 3)))],
      ['Stock market value relative to annual output', '\\(p/(4Y)\\)', both((s, can) => (can ? '–' : fmt(s.p_y_annual, 2)))],
      ['Real interest rate (percent a year)', '\\(r\\)', both(s => fmt(s.r_annual, 2))],
    ];
    setHTML(el.steady, `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Steady state of the model with an installation lag and of the canonical model</caption>
      <thead><tr><th scope="col" class="component-head">Steady-state value</th><th scope="col">Symbol</th>${head}</tr></thead>
      <tbody>${rows.map(([n, s, v]) => `<tr><th scope="row">${esc(n)}</th><td class="symbol-cell">${s}</td>${v}</tr>`).join('')}</tbody></table></div>`);
    setHTML(el.solution, `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Eigenvalues of the solution</caption>
      <thead><tr><th scope="col" class="component-head">Solution</th><th scope="col">Symbol</th>${columns().head}</tr></thead>
      <tbody><tr><th scope="row">Stable eigenvalues (absolute values)</th><td class="symbol-cell">\\(|\\lambda|\\)</td>${each(r => r.eigenvalues.map(v => fmt(v, 3)).join(', '))}</tr></tbody></table></div>`);
  }

  /* Simulations ------------------------------------------------------ */

  /* Correlation and standard deviation of two series over the sample. */
  function moments(x, y) {
    const pairs = x.map((v, i) => [v, y[i]]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
    const n = pairs.length;
    if (n < 3) return { corr: NaN, sdX: NaN, sdY: NaN };
    const mx = pairs.reduce((t, p) => t + p[0], 0) / n;
    const my = pairs.reduce((t, p) => t + p[1], 0) / n;
    let sxx = 0, syy = 0, sxy = 0;
    pairs.forEach(([a, b]) => { sxx += (a - mx) ** 2; syy += (b - my) ** 2; sxy += (a - mx) * (b - my); });
    return { corr: sxy / Math.sqrt(sxx * syy), sdX: Math.sqrt(sxx / (n - 1)), sdY: Math.sqrt(syy / (n - 1)) };
  }

  function renderModelCard(card) {
    const payload = state.payload;
    const key = card.dataset.modelVar;
    const unit = payload.variables.find(v => v.key === key).units;
    const list = variants();
    const units = key === 'r' ? ' percentage points' : '';
    const readoutText = 'Hover over the chart, or focus it and use the arrow keys, to read values.';
    const options = {
      dates: payload.dates, period: 0.25, zeroLine: true, digits: 2,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readoutText,
    };
    inCard(card, 'chart-subtitle').textContent = `${unit} · HP cyclical components · ${payload.technology[state.form].label} · ${sampleText(payload.dates)}`;

    if (state.compare === 'canonical') {
      // This model (solid) against the canonical model (dash-dot), same shocks.
      const series = [];
      list.forEach(v => {
        const several = list.length > 1;
        series.push({
          label: v.suffix ? `Installation lag, ${v.suffix}` : 'Model with installation lag',
          color: v.color, weight: several ? 1 : 1.1, values: run(v.measure).series[v.kind][key],
        });
        series.push({
          label: v.suffix ? `Canonical, ${v.suffix}` : 'Canonical RBC model',
          color: several ? v.color : token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true,
          values: canonical(v.measure).series[v.kind][key],
        });
      });
      draw(card, { ...options, label: `${VARIABLES[key]}: the RBC model with an installation lag and the canonical RBC model, HP cyclical components` }, series);
      const parts = list.map(v => {
        const m = moments(run(v.measure).series[v.kind][key], canonical(v.measure).series[v.kind][key]);
        return `${v.suffix ? `with ${v.suffix}, ` : ''}correlation between the two models ${fmt(m.corr)}, standard deviation ${fmt(m.sdX)}${units} with the installation lag and ${fmt(m.sdY)}${units} in the canonical model`;
      });
      const note = `${parts.join('; ')}. Both models are driven by the same technology shocks, from the same starting values.`;
      inCard(card, 'chart-note').textContent = note.charAt(0).toUpperCase() + note.slice(1);
      return;
    }

    const series = list.map(v => ({
      label: v.suffix ? `Model, ${v.suffix}` : 'Model with installation lag',
      color: v.color, dash: v.dash, weight: list.length === 1 ? 1.1 : 1,
      values: run(v.measure).series[v.kind][key],
    }));
    series.push({ label: 'US data', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: payload.data[key] });
    draw(card, { ...options, label: `${VARIABLES[key]}: the RBC model with an installation lag and the US data, HP cyclical components` }, series);
    const dataRow = statRow(canonical(list[0].measure).stats.data, key);
    const parts = list.map(v => {
      const row = statRow(run(v.measure).stats[v.kind], key);
      const can = statRow(canonical(v.measure).stats[v.kind], key);
      return `${v.suffix ? `model with ${v.suffix}` : 'model'}: correlation with the data ${fmt(row.corr_data)} (canonical model ${fmt(can.corr_data)}), standard deviation ${fmt(row.sd)}${units} (canonical model ${fmt(can.sd)})`;
    });
    const note = `${parts.join('; ')}; standard deviation of the data ${fmt(dataRow.sd)}${units}.`;
    inCard(card, 'chart-note').textContent = note.charAt(0).toUpperCase() + note.slice(1);
  }

  /* Statistics ------------------------------------------------------- */

  const symbol = (key, measure) => {
    const tech = state.form === 'harrod' ? 'Z' : 'A';
    const map = { y: 'Y', c: 'C', i: 'I', k: 'K', h: 'H', w: 'w', r: 'r', yh: 'Y/H', a: measure === 'adjusted' ? `${tech}^{u}` : tech };
    return `\\(${map[key]}\\)`;
  };

  function renderStats() {
    const list = variants();
    const measures = measuresInUse();
    const cells = row => `<td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td>`;
    const block = (title, rows) => `<tr class="table-group"><th scope="rowgroup" colspan="5">${esc(title)}</th></tr>${rows}`;
    const dataRows = STAT_KEYS.flatMap(key => (key === 'a' ? measures : [measures[0]])
      .map(m => `<tr><th scope="row" class="symbol-cell">${symbol(key, m)}</th>${cells(statRow(canonical(m).stats.data, key))}</tr>`)).join('');
    const rowsFor = (stats, v) => STAT_KEYS.map(key => `<tr><th scope="row" class="symbol-cell">${symbol(key, v.measure)}</th>${cells(statRow(stats, key))}</tr>`).join('');
    const blocks = list.map(v => block(`Business-cycle statistics for the RBC model with an installation lag${v.suffix ? `, ${v.suffix}` : ''}`, rowsFor(run(v.measure).stats[v.kind], v))
      + block(`Business-cycle statistics for the canonical RBC model${v.suffix ? `, ${v.suffix}` : ''}`, rowsFor(canonical(v.measure).stats[v.kind], v))).join('');
    setHTML(el.statsTable, `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table">
      <caption class="visually-hidden">Business-cycle statistics of the US economy and of the models</caption>
      <thead><tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>
        <th scope="col">Standard<br>deviation</th><th scope="col">Relative<br>standard deviation</th>
        <th scope="col">First-order<br>autocorrelation</th><th scope="col">Contemporaneous correlation<br>with output</th></tr></thead>
      <tbody>${block('Business-cycle statistics for the US economy', dataRows)}${blocks}</tbody></table></div>`);

    const groups = list.flatMap(v => [
      { title: `RBC model with an installation lag${v.suffix ? `, ${v.suffix}` : ''}`, stats: run(v.measure).stats[v.kind], v },
      { title: `Canonical RBC model${v.suffix ? `, ${v.suffix}` : ''}`, stats: canonical(v.measure).stats[v.kind], v },
    ]);
    const top = `<tr><th scope="col" class="component-head"></th>${groups.map(g => `<th scope="colgroup" colspan="2">${esc(g.title)}</th>`).join('')}</tr>`;
    const heads = groups.map(() => `<th scope="col">Relative standard deviation<br><span class="unit-label">\\(\\sigma_{\\text{Model}} / \\sigma_{\\text{Data}}\\)</span></th>
      <th scope="col">Correlation model–data<br><span class="unit-label">\\(\\rho_{\\text{Model},\\,\\text{Data}}\\)</span></th>`).join('');
    const rows = STAT_KEYS.map(key => `<tr><th scope="row" class="symbol-cell">${symbol(key, list[0].measure)}</th>${groups.map(g => {
      const model = statRow(g.stats, key);
      const data = statRow(canonical(g.v.measure).stats.data, key);
      return `<td>${fmt(model.sd / data.sd)}</td><td>${fmt(model.corr_data)}</td>`;
    }).join('')}</tr>`).join('');
    setHTML(el.corrTable, `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table corr-table">
      <caption class="visually-hidden">Volatility and correlation of the models’ series relative to the data</caption>
      <thead>${top}<tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>${heads}</tr></thead>
      <tbody>${rows}</tbody></table></div>`);
    el.statsNote.textContent = `Note: United States, ${sampleText(state.payload.dates)}. All variables are in logarithms, except the real interest rate, and are HP filtered (λ = 1600); definitions as on the canonical RBC model page. Both models are driven by the same measured technology shocks, from the same starting values; the installation shocks are not used in the simulations, as they are not observed.`;
  }

  /* Impulse responses ------------------------------------------------ */

  function irfOptions(card, n) {
    return {
      dates: Array.from({ length: n }, (_, i) => i + 1), xValues: Array.from({ length: n }, (_, i) => i + 1),
      xStep: 20, xTitle: 'Quarters', zeroLine: true, digits: 3, copyrightPosition: 'top',
      label: `Impulse response of ${card.querySelector('.chart-title').textContent.toLowerCase()}`,
    };
  }

  function renderIRF() {
    const measures = measuresInUse();
    const harrod = state.form === 'harrod';
    setHTML(el.tfpIntro, harrod
      ? 'A positive shock of 1 percent to labour-augmenting technology, \\(\\varepsilon^Z_1\\), hits the economy on its balanced growth path in quarter 1, with no further shocks: the model with an installation lag (solid) against the canonical model (dash-dot).'
      : 'A positive technology shock of 1 percent, \\(\\varepsilon^A_1\\), hits the economy on its balanced growth path in quarter 1, with no further shocks: the model with an installation lag (solid) against the canonical model (dash-dot).');
    tfpCards.forEach(card => {
      const key = card.dataset.irfTfp;
      if (key === 'a') card.querySelector('.chart-title').textContent = harrod ? 'Labour-augmenting technology' : 'Technology';
      const series = [];
      measures.forEach((m, i) => {
        const color = token(measures.length > 1 ? MULTI[i] : '--chart-1');
        const label = measures.length > 1 ? `, ${MEASURES[m]}` : '';
        series.push({ label: `Installation lag${label}`, color, weight: 1.1, values: run(m).irf_tfp[key] });
        series.push({ label: `Canonical${label}`, color: measures.length > 1 ? color : token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: canonical(m).irf[key] });
      });
      draw(card, irfOptions(card, series[0].values.length), series);
    });
    phiCards.forEach(card => {
      const key = card.dataset.irfPhi;
      const series = measures.map((m, i) => ({
        label: measures.length > 1 ? MEASURES[m] : 'Response',
        color: token(measures.length > 1 ? MULTI[i] : '--chart-1'), weight: 1.1, values: run(m).irf_phi[key],
      }));
      draw(card, { ...irfOptions(card, series[0].values.length), digits: 4 }, series);
    });
  }

  /* Rendering -------------------------------------------------------- */

  function render() {
    if (!state.payload) return;
    if (!state.payload.runs[state.form]) state.form = 'hicks';
    renderCalibration();
    renderSteady();
    modelCards.forEach(renderModelCard);
    renderStats();
    renderIRF();
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', state.country.toLowerCase());
      const response = await S.fetchFresh(url);
      const payload = await response.json();
      if (!payload || !payload.runs) throw new Error('The data file does not contain the expected series.');
      state.payload = payload;
      el.pageStatus.hidden = true;
      if (!payload.runs.harrod) body.querySelector('[data-control="form"]').hidden = true;
      const canonicalSeries = Object.values(payload.canonical || {}).every(form => Object.values(form).every(r => r.series));
      if (!canonicalSeries) compareControl.setDisabled('canonical', true, 'Available after the next data update');
      render();
      if (payload.generated_at_utc) {
        el.updateNote.textContent = `Data updated on ${new Date(payload.generated_at_utc).toLocaleDateString('en-GB')}`;
        el.updateNote.hidden = false;
      }
    } catch (error) {
      el.pageStatus.hidden = false;
      el.pageStatus.className = 'render-error';
      el.pageStatus.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'The simulations will appear after the next data update. If the problem persists, please let me know.'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  const formControl = D.segmented(body.querySelector('[data-control="form"]'), value => { state.form = value; render(); });
  const compareControl = D.segmented(body.querySelector('[data-control="compare"]'), value => {
    state.compare = value;
    if (state.payload) modelCards.forEach(renderModelCard);
  });
  let shocksControl = null;
  const tfpControl = D.segmented(body.querySelector('[data-control="tfp"]'), value => {
    state.tfp = value;
    if (value === 'comparison' && state.shocks === 'comparison') { state.shocks = 'kr'; shocksControl.select('kr', false); }
    render();
  });
  shocksControl = D.segmented(body.querySelector('[data-control="shocks"]'), value => {
    state.shocks = value;
    if (value === 'comparison' && state.tfp === 'comparison') { state.tfp = 'measured'; tfpControl.select('measured', false); }
    render();
  });
  body.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  });
  formControl.select('hicks', false);
  tfpControl.select('measured', false);
  shocksControl.select('kr', false);
  compareControl.select('data', false);
  load();
})();
