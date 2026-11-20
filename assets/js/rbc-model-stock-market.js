/* Last edited: 2026-11-20 12:57 UTC (Claude, economics chat) */
/* =========================================================
   rbc-model-stock-market.js: /economics/rbc-model-stock-market.html
   The RBC Model with a Stock Market: dividends and stock prices (firm-owned capital,
   no adjustment costs, log utility, labour-augmenting growth).
   Loads rbc-model-stock-market.json (rbc_stock_market.py) and draws:
   calibration and steady state; simulations of output, the stock
   price and dividends driven by the measured technology shocks,
   against the HP cycles of the data, per capita or in totals;
   business-cycle statistics; impulse responses to a technology shock.
   Page settings as on the canonical RBC page: technical progress
   (Hicks or Harrod), productivity (measured, utilization-adjusted or
   comparison), shocks (linear trend, HP-filtered or comparison).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="rbc-model-stock-market"]');
  if (!body || !D || !S) return;

  const BENCHMARK_DASH = '8 4 0.1 4';
  const MULTI = ['--series-4', '--series-2', '--series-3', '--series-1'];
  const MEASURES = { measured: 'measured TFP', adjusted: 'utilization-adjusted TFP' };
  const KINDS = { kr: 'linear-trend shocks', hp: 'HP-filtered shocks' };
  const STAT_KEYS = ['y', 'p', 'd'];
  const SYMBOLS = { y: 'Y', p: 'p', d: 'd' };
  /* Data modes: NIPA aggregate dividends (default) or S&P 500 dividends per
     share, with output in total or per capita. */
  const DATA_TEXT = {
    pc: { y: 'real GDP per person', p: 'real S&P 500 price index', d: 'real corporate dividends per person' },
    total: { y: 'real GDP', p: 'real S&P 500 price index', d: 'real corporate dividends' },
    sp_pc: { y: 'real GDP per person', p: 'real S&P 500 price index', d: 'real S&P 500 dividends per share' },
    sp_total: { y: 'real GDP', p: 'real S&P 500 price index', d: 'real S&P 500 dividends per share' },
  };

  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const modelCards = Array.from(body.querySelectorAll('[data-model-var]'));
  const irfCards = Array.from(body.querySelectorAll('[data-irf]'));
  const role = name => body.querySelector(`[data-role="${name}"]`);
  const el = {
    pageStatus: role('page-status'),
    updateNote: role('update-note'),
    calibration: role('calibration-table'),
    steady: role('steady-table'),
    coefficients: role('coefficients-table'),
    statsTable: role('stats-table'),
    corrTable: role('corr-table'),
    statsNote: role('stats-note'),
    irfIntro: role('irf-intro'),
  };
  const state = { country: 'US', form: 'hicks', tfp: 'measured', shocks: 'kr', measure: 'pc', dividends: 'nipa', payload: null, charts: new Map() };
  /* Key of the data mode in the payload (data, data_sources, stats). */
  const mode = () => (state.dividends === 'sp' ? 'sp_' : '') + state.measure;
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
  const statsOf = r => r.stats[mode()] || r.stats[state.measure];
  const dataSeries = key => (state.payload.data[mode()] || state.payload.data[state.measure])[key];
  const dataText = () => DATA_TEXT[state.payload.data[mode()] ? mode() : state.measure];
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

  /* Calibration and steady state ------------------------------------ */

  function columns() {
    const measures = measuresInUse();
    const several = measures.length > 1;
    return {
      measures,
      head: measures.map(m => `<th scope="col">${several ? `Value<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : 'Value'}</th>`).join(''),
      same: value => measures.map(() => `<td>${value}</td>`).join(''),
      each: fn => measures.map(m => `<td>${fn(run(m), state.payload.technology[state.form].series[m])}</td>`).join(''),
    };
  }

  function table(element, caption, firstHead, rows, head) {
    setHTML(element, `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">${esc(caption)}</caption>
      <thead><tr><th scope="col" class="component-head">${firstHead}</th><th scope="col">Symbol</th>${head}</tr></thead>
      <tbody>${rows.map(([n, s, v]) => `<tr><th scope="row">${n}</th><td class="symbol-cell">${s}</td>${v}</tr>`).join('')}</tbody></table></div>`);
  }

  function renderCalibration() {
    const cal = state.payload.calibration;
    const { head, same, each } = columns();
    const harrod = state.form === 'harrod';
    table(el.calibration, 'Calibration of the model', 'Parameter', [
      ['Coefficient of relative risk aversion (logarithmic utility)', '\\(\\gamma\\)', same('1')],
      ['Discount factor', '\\(\\beta\\)', same(fmt(cal.beta, 4))],
      ['Capital’s share of income', '\\(\\alpha\\)', same(fmt(cal.alpha, 3))],
      ['Depreciation rate (per quarter)', '\\(\\delta\\)', same(fmt(cal.delta, 3))],
      ['Weight of leisure in utility', '\\(\\theta\\)', same(fmt(cal.xi, 2))],
      ['Trend growth (per quarter)', '\\(g_X\\)', each(r => fmt(r.g_x, 5))],
      ['Persistence of technology', '\\(\\rho\\)', each(r => fmt(r.rho, 3))],
      ['Standard deviation of the technology shocks (percent)', harrod ? '\\(\\sigma_{\\varepsilon^Z}\\)' : '\\(\\sigma_{\\varepsilon^A}\\)', each((r, t) => fmt(t.sigma, 2))],
    ], head);
  }

  function renderSteady() {
    const { head, each } = columns();
    const means = state.payload.data_means || {};
    const hasData = means.pd_annual != null;
    const dataHead = hasData ? '<th scope="col">US data<br><span class="unit-label">(average from 1950)</span></th>' : '';
    const row = (name, symbol, fn, data) => [name, symbol, each(fn) + (hasData ? `<td>${data == null ? '–' : data}</td>` : '')];
    table(el.steady, 'Steady state of the model', 'Steady-state value', [
      row('Hours worked (share of time)', '\\(h\\)', r => fmt(r.steady_state.hours, 3)),
      row('Capital–output ratio (years)', '\\(K/Y\\)', r => fmt(r.steady_state.k_y_annual, 2)),
      row('Investment share of output', '\\(I/Y\\)', r => fmt(r.steady_state.i_y, 3)),
      row('Dividends relative to output', '\\(d/Y\\)', r => fmt(r.steady_state.d_y, 3)),
      row('Stock market value relative to annual output', '\\(p/(4Y)\\)', r => fmt(r.steady_state.p_y_annual, 2)),
      row('Price–dividend ratio (annual dividends)', '\\(p/(4d)\\)', r => fmt(r.steady_state.pd_annual, 1), hasData ? fmt(means.pd_annual, 1) : null),
      row('Dividend–price ratio (percent a year)', '\\(4d/p\\)', r => fmt(r.steady_state.dp_annual, 2), hasData ? fmt(means.dp_annual, 2) : null),
      row('Expected return on stocks (percent a year)', '\\(4(R-1)\\)', r => fmt(r.steady_state.return_annual, 2)),
    ], head + dataHead);
    table(el.coefficients, 'Coefficients of the log-linearised stock price and dividends', 'Coefficient', [
      ['Stock price on capital', '\\((1-\\delta)/(1+g_X)\\)', each(r => fmt(r.steady_state.coef_p_k, 4))],
      ['Stock price on investment', '\\(\\tilde{I}/[(1+g_X)\\tilde{K}]\\)', each(r => fmt(r.steady_state.coef_p_i, 4))],
      ['Dividends on output', '\\(\\alpha \\tilde{Y}/\\tilde{d}\\)', each(r => fmt(r.steady_state.coef_d_y, 3))],
      ['Dividends on investment', '\\(\\tilde{I}/\\tilde{d}\\)', each(r => fmt(r.steady_state.coef_d_i, 3))],
    ], head);
  }

  /* Simulations ------------------------------------------------------ */

  function renderModelCard(card) {
    const payload = state.payload;
    const key = card.dataset.modelVar;
    const list = variants();
    const options = {
      dates: payload.dates, period: 0.25, zeroLine: true, digits: 2,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readoutText: 'Hover over the chart, or focus it and use the arrow keys, to read values.',
      label: `${payload.labels[key]}: the RBC model and the US data, HP cyclical components`,
    };
    inCard(card, 'chart-subtitle').textContent = `Percent deviation from trend · HP cyclical components · ${payload.technology[state.form].label} · ${sampleText(payload.dates)}`;
    const series = list.map(v => ({
      label: v.suffix ? `Model, ${v.suffix}` : 'Model',
      color: v.color, dash: v.dash, weight: list.length === 1 ? 1.1 : 1,
      values: run(v.measure).series[v.kind][key],
    }));
    series.push({ label: `US data: ${dataText()[key]}`, color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: dataSeries(key) });
    draw(card, options, series);
    const dataRow = statRow(statsOf(run(list[0].measure)).data, key);
    const parts = list.map(v => {
      const row = statRow(statsOf(run(v.measure))[v.kind], key);
      return `${v.suffix ? `model with ${v.suffix}` : 'model'}: standard deviation ${fmt(row.sd)} percent, correlation with output ${fmt(row.corr_y)}, correlation with the data ${fmt(row.corr_data)}`;
    });
    const note = `${parts.join('; ')}. Data: standard deviation ${fmt(dataRow.sd)} percent, correlation with output ${fmt(dataRow.corr_y)}.`;
    inCard(card, 'chart-note').textContent = note.charAt(0).toUpperCase() + note.slice(1);
    const source = inCard(card, 'chart-source');
    if (source) source.textContent = `Data: ${(payload.data_sources[key][mode()] || payload.data_sources[key][state.measure])}. Model: author’s calculations.`;
  }

  /* Statistics ------------------------------------------------------- */

  function renderStats() {
    const list = variants();
    const cells = row => `<td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td>`;
    const block = (title, rows) => `<tr class="table-group"><th scope="rowgroup" colspan="5">${esc(title)}</th></tr>${rows}`;
    const rowsFor = stats => STAT_KEYS.map(key => `<tr><th scope="row" class="symbol-cell">\\(${SYMBOLS[key]}\\)</th>${cells(statRow(stats, key))}</tr>`).join('');
    const dataRows = rowsFor(statsOf(run(list[0].measure)).data);
    const blocks = list.map(v => block(`Business-cycle statistics for the RBC model${v.suffix ? `, ${v.suffix}` : ''}`, rowsFor(statsOf(run(v.measure))[v.kind]))).join('');
    setHTML(el.statsTable, `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table">
      <caption class="visually-hidden">Business-cycle statistics of output, stock prices and dividends in the US economy and in the model</caption>
      <thead><tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>
        <th scope="col">Standard<br>deviation</th><th scope="col">Relative<br>standard deviation</th>
        <th scope="col">First-order<br>autocorrelation</th><th scope="col">Contemporaneous correlation<br>with output</th></tr></thead>
      <tbody>${block(`Business-cycle statistics for the US economy (${state.measure === 'pc' ? 'per capita' : 'totals'}; ${state.dividends === 'sp' ? 'S&P 500 dividends per share' : 'corporate dividends, NIPA'})`, dataRows)}${blocks}</tbody></table></div>`);

    const top = `<tr><th scope="col" class="component-head"></th>${list.map(v => `<th scope="colgroup" colspan="2">RBC model${v.suffix ? `, ${esc(v.suffix)}` : ''}</th>`).join('')}</tr>`;
    const heads = list.map(() => `<th scope="col">Relative standard deviation<br><span class="unit-label">\\(\\sigma_{\\text{Model}} / \\sigma_{\\text{Data}}\\)</span></th>
      <th scope="col">Correlation model–data<br><span class="unit-label">\\(\\rho_{\\text{Model},\\,\\text{Data}}\\)</span></th>`).join('');
    const rows = STAT_KEYS.map(key => `<tr><th scope="row" class="symbol-cell">\\(${SYMBOLS[key]}\\)</th>${list.map(v => {
      const model = statRow(statsOf(run(v.measure))[v.kind], key);
      const data = statRow(statsOf(run(v.measure)).data, key);
      return `<td>${fmt(model.sd / data.sd)}</td><td>${fmt(model.corr_data)}</td>`;
    }).join('')}</tr>`).join('');
    setHTML(el.corrTable, `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table corr-table">
      <caption class="visually-hidden">Volatility and correlation of the model’s series relative to the data</caption>
      <thead>${top}<tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>${heads}</tr></thead>
      <tbody>${rows}</tbody></table></div>`);
    el.statsNote.textContent = `Note: United States, ${sampleText(state.payload.dates)}. All variables are in logarithms and HP filtered (λ = 1600). Data: ${dataText().y}, the ${dataText().p} and ${dataText().d}, all deflated by the GDP price index. Model: \\(p_t = K_{t+1}\\) and \\(d_t = \\alpha Y_t - I_t\\), driven by the measured technology shocks.`;
    setHTML(el.statsNote, esc(el.statsNote.textContent));
  }

  /* Impulse responses ------------------------------------------------ */

  function renderIRF() {
    const measures = measuresInUse();
    const harrod = state.form === 'harrod';
    setHTML(el.irfIntro, harrod
      ? 'A positive shock of 1 percent to labour-augmenting technology, \\(\\varepsilon^Z_1\\), hits the economy on its balanced growth path in quarter 1, with no further shocks.'
      : 'A positive technology shock of 1 percent, \\(\\varepsilon^A_1\\), hits the economy on its balanced growth path in quarter 1, with no further shocks.');
    irfCards.forEach(card => {
      const key = card.dataset.irf;
      if (key === 'a') card.querySelector('.chart-title').textContent = harrod ? 'Labour-augmenting technology' : 'Technology';
      const series = measures.map((m, i) => ({
        label: measures.length > 1 ? MEASURES[m] : 'Response',
        color: token(measures.length > 1 ? MULTI[i] : '--chart-1'), weight: 1.1, values: run(m).irf[key],
      }));
      const n = series[0].values.length;
      draw(card, {
        dates: Array.from({ length: n }, (_, i) => i + 1), xValues: Array.from({ length: n }, (_, i) => i + 1),
        xStep: 20, xTitle: 'Quarters', zeroLine: true, digits: 3, copyrightPosition: 'top',
        label: `Impulse response of ${card.querySelector('.chart-title').textContent.toLowerCase()}`,
      }, series);
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
      render();
      if (payload.downloads) {
        body.querySelectorAll('[data-download]').forEach(link => {
          const path = payload.downloads[link.dataset.download];
          link.hidden = !path;
          if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
        });
        const box = role('downloads');
        if (box) box.hidden = false;
      }
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
  const measureControl = D.segmented(body.querySelector('[data-control="measure"]'), value => {
    state.measure = value;
    if (state.payload) { modelCards.forEach(renderModelCard); renderStats(); }
  });
  const dividendsControl = D.segmented(body.querySelector('[data-control="dividends"]'), value => {
    state.dividends = value;
    if (state.payload) { modelCards.forEach(renderModelCard); renderStats(); }
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
  measureControl.select('pc', false);
  dividendsControl.select('nipa', false);
  load();
})();
