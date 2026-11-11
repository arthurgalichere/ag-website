/* Last edited: 2026-11-11 17:52 UTC (Claude, economics chat) */
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
  const modelCards = Array.from(body.querySelectorAll('[data-model-var]'));
  const irfCards = Array.from(body.querySelectorAll('[data-irf-var]'));
  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const el = {
    pageStatus: body.querySelector('[data-role="page-status"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    downloads: body.querySelector('[data-role="downloads"]'),
    simDownloads: body.querySelector('[data-role="sim-downloads"]'),
    statsTable: body.querySelector('[data-role="stats-table"]'),
    statsNote: body.querySelector('[data-role="stats-note"]'),
    corrTable: body.querySelector('[data-role="corr-table"]'),
    solution: body.querySelector('[data-role="solution-table"]'),
    solutionNote: body.querySelector('[data-role="solution-note"]'),
    irfIntro: body.querySelector('[data-role="irf-intro"]'),
    calibration: body.querySelector('[data-role="calibration-table"]'),
    calibrationNote: body.querySelector('[data-role="calibration-note"]'),
    krToggle: body.querySelector('[data-control="king-rebelo"]'),
  };
  const state = {
    country: 'US', form: 'hicks', tfp: 'measured', shocks: 'kr',
    showKR: false, payload: null, techChart: null, modelCharts: new Map(), irfCharts: new Map(),
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

  /* One chart per variable: the model (blue, or one colour per run in a
     comparison) against the data (orange, dash-dot). */
  function renderModelCard(card) {
    const payload = state.payload;
    const model = payload.model;
    const key = card.dataset.modelVar;
    const role = name => inCard(card, name);
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
    role('chart-subtitle').textContent = `${unit} · HP cyclical components · ${payload.technology[state.form].label} · ${sampleText(dates)}`;
    const previous = state.modelCharts.get(card);
    if (previous) previous.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    state.modelCharts.set(card, D.lineChart(role('chart-frame'), {
      dates, series, period: 0.25, zeroLine: true, digits: 2,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readout: role('chart-readout'),
      label: `${VARIABLES[key]}: the RBC model and the US data, HP cyclical components, with recessions shaded`,
    }));
    role('chart-legend').innerHTML = series.map(swatch).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    /* How close the model is: correlation with the data and volatility. */
    const dataRow = statRow(run(list[0].measure).stats.data, key);
    const rows = list.map(v => ({ v, row: statRow(run(v.measure).stats[v.kind], key) }));
    const units = key === 'r' ? ' percentage points' : '';
    let note;
    if (key === 'r') {
      /* The interest rate: say plainly what the numbers mean. */
      const m = rows[0].row;
      const which = list.length > 1 ? ` (${rows[0].v.suffix})` : '';
      note = `The model’s rate and the data’s move almost independently of each other: their correlation is ${fmt(m.corr_data)}${which}, close to zero. They also behave differently over the cycle. In the model, the real rate rises in expansions and falls in recessions (correlation with output ${fmt(m.corr_y)}) and moves little (standard deviation ${fmt(m.sd)} percentage points). In the data, the real Treasury-bill rate has almost no relation to output (correlation ${fmt(dataRow.corr_y)}) and is about ${fmt(dataRow.sd / m.sd, 0)} times as volatile (${fmt(dataRow.sd)} percentage points). The model’s rate is the expected return on saving, which moves only with technology; the data’s rate is set largely by monetary policy and, measured after the fact, also moves with unexpected inflation.`;
    } else {
      const parts = rows.map(({ v, row }) => `${v.suffix ? `model with ${v.suffix}` : 'model'}: correlation with the data ${fmt(row.corr_data)}, standard deviation ${fmt(row.sd)}${units}`);
      note = `${parts.join('; ')}; standard deviation of the data ${fmt(dataRow.sd)}${units}.`;
      note = note.charAt(0).toUpperCase() + note.slice(1);
    }
    const adjusted = list.find(v => v.measure === 'adjusted');
    if (adjusted && key === 'y' && statRow(run('adjusted').stats[adjusted.kind], 'y').corr_data < 0.3) {
      note += ' With utilization-adjusted TFP, the model’s output is almost unrelated to the data: once changes in the intensity with which capital and labour are used are removed, technology shocks explain little of the US business cycle, as Basu, Fernald and Kimball (2006) found.';
    }
    if (key === 'yh' || key === 'w') {
      note += ' In the model, labour productivity and the real wage are the same series: with a Cobb–Douglas production function, the wage is proportional to output per hour.';
    }
    if (key === 'k') {
      note += ' The data are capital services (Fernald’s capital input); the model’s series is the capital stock.';
    }
    role('chart-note').textContent = note;
  }

  function renderModel() {
    modelCards.forEach(renderModelCard);
  }

  /* Statistics tables --------------------------------------------- */

  const STAT_KEYS = ['y', 'c', 'i', 'k', 'h', 'w', 'r', 'yh', 'a'];
  const symbol = (key, measure) => {
    const tech = state.form === 'harrod' ? 'Z' : 'A';
    const map = { y: 'Y', c: 'C', i: 'I', k: 'K', h: 'H', w: 'w', r: 'r', yh: 'Y/H', a: measure === 'adjusted' ? `${tech}^{u}` : tech };
    return `\\(${map[key]}\\)`;
  };
  const modelTitle = v => (v.suffix ? `RBC model, ${v.suffix}` : 'RBC model');

  /* As in the lecture slides: one table, with a block of rows for the US
     economy and one for each model run (and King and Rebelo's model). */
  function statsTable() {
    const list = variants();
    const measures = Array.from(new Set(list.map(v => v.measure)));
    const cells = row => `<td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td>`;
    const block = (title, rows) => `<tr class="table-group"><th scope="rowgroup" colspan="5">${esc(title)}</th></tr>${rows}`;
    const dataRows = STAT_KEYS.flatMap(key => {
      const ms = key === 'a' ? measures : [measures[0]];
      return ms.map(m => `<tr><th scope="row" class="symbol-cell">${symbol(key, m)}</th>${cells(statRow(run(m).stats.data, key))}</tr>`);
    }).join('');
    const modelBlocks = list.map(v => block(`Business-cycle statistics for the ${modelTitle(v)}`,
      STAT_KEYS.map(key => `<tr><th scope="row" class="symbol-cell">${symbol(key, v.measure)}</th>${cells(statRow(run(v.measure).stats[v.kind], key))}</tr>`).join(''))).join('');
    const krBlock = state.showKR
      ? block('Business-cycle statistics of King and Rebelo’s (1999) model, Table 3',
        STAT_KEYS.filter(key => KING_REBELO[key]).map(key => `<tr class="kr-row"><th scope="row" class="symbol-cell">${symbol(key, 'measured')}</th>${KING_REBELO[key].map(v => `<td>${fmt(v)}</td>`).join('')}</tr>`).join(''))
      : '';
    return `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table">
      <caption class="visually-hidden">Business-cycle statistics of the US economy and of the RBC model</caption>
      <thead><tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>
        <th scope="col">Standard<br>deviation</th>
        <th scope="col">Relative<br>standard deviation</th>
        <th scope="col">First-order<br>autocorrelation</th>
        <th scope="col">Contemporaneous correlation<br>with output</th></tr></thead>
      <tbody>${block('Business-cycle statistics for the US economy', dataRows)}${modelBlocks}${krBlock}</tbody></table></div>`;
  }

  /* As on the next slide: relative volatility and correlation, model
     against data, one pair of columns per model run. */
  function corrTable() {
    const list = variants();
    const several = list.length > 1;
    const top = several
      ? `<tr><th scope="col" class="component-head"></th>${list.map(v => `<th scope="colgroup" colspan="2">${esc(modelTitle(v))}</th>`).join('')}</tr>`
      : '';
    const heads = list.map(() => `<th scope="col">Relative standard deviation<br><span class="unit-label">\\(\\sigma_{\\text{Model}} / \\sigma_{\\text{Data}}\\)</span></th>
        <th scope="col">Correlation model–data<br><span class="unit-label">\\(\\rho_{\\text{Model},\\,\\text{Data}}\\)</span></th>`).join('');
    const rows = STAT_KEYS.map(key => {
      const cells = list.map(v => {
        const model = statRow(run(v.measure).stats[v.kind], key);
        const data = statRow(run(v.measure).stats.data, key);
        return `<td>${fmt(model.sd / data.sd)}</td><td>${fmt(model.corr_data)}</td>`;
      }).join('');
      const label = list.every(v => v.measure === list[0].measure) ? symbol(key, list[0].measure) : symbol(key, 'measured');
      return `<tr><th scope="row" class="symbol-cell">${label}</th>${cells}</tr>`;
    }).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table corr-table">
      <caption class="visually-hidden">Volatility and correlation of the model’s series relative to the data</caption>
      <thead>${top}<tr><th scope="col" class="component-head"><span class="visually-hidden">Variable</span></th>${heads}</tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function renderStats() {
    setHTML(el.statsTable, statsTable());
    setHTML(el.corrTable, corrTable());
    const dates = state.payload.dates;
    const tech = state.form === 'harrod' ? 'labour-augmenting technology' : 'total factor productivity';
    let note = `Note: United States, ${sampleText(dates)}. All variables are in logarithms, except the real interest rate, and are HP filtered (λ = 1600). Y is real output per capita, C real consumption per capita, I real investment per capita, K capital input per capita, H hours worked per capita, w real hourly compensation and Y/H output per hour, both in the nonfarm business sector, r the ex-post real three-month Treasury-bill rate (percentage points a year), and A ${tech} (Aᵘ utilization-adjusted). The model’s statistics are computed on its simulated series over the same quarters as the data.`;
    if (state.form === 'harrod') note = note.replace('and A labour-augmenting technology (Aᵘ utilization-adjusted)', 'and Z labour-augmenting technology (Zᵘ utilization-adjusted)');
    if (state.showKR) {
      note += ' King and Rebelo’s (1999, Table 3) statistics are population moments of their model, with technology shocks estimated on 1947–96; their real interest rate is per quarter, so its standard deviation is about a quarter of an annual rate’s.';
    }
    el.statsNote.textContent = note;
  }

  /* Calibration and solution -------------------------------------- */

  function measureColumns() {
    const measures = Array.from(new Set(variants().map(v => v.measure)));
    const several = measures.length > 1;
    return {
      measures,
      head: measures.map(m => `<th scope="col">${several ? `Value<br><span class="unit-label">(${esc(MEASURES[m])})</span>` : 'Value'}</th>`).join(''),
      same: value => measures.map(() => `<td>${value}</td>`).join(''),
      each: fn => measures.map(m => `<td>${fn(run(m), state.payload.technology[state.form].series[m])}</td>`).join(''),
    };
  }

  function calibrationTable() {
    const cal = state.payload.model.calibration;
    const { measures, head, same, each } = measureColumns();
    const shockSymbol = state.form === 'harrod' ? '\\(\\sigma_{\\varepsilon^Z}\\)' : '\\(\\sigma_{\\varepsilon^A}\\)';
    const rows = [
      ['Discount factor', '\\(\\beta\\)', same(fmt(cal.beta, 3)), '0.984'],
      ['Capital’s share of income', '\\(\\alpha\\)', same(fmt(cal.alpha, 3)), '0.333'],
      ['Depreciation rate (per quarter)', '\\(\\delta\\)', same(fmt(cal.delta, 3)), '0.025'],
      ['Weight of leisure in utility', '\\(\\xi\\)', same(fmt(cal.xi, 2)), '3.48'],
      ['Trend growth (per quarter)', '\\(g_X\\)', each(r => `${fmt(r.g_x, 5)}<br><span class="unit-label">${fmt(r.trend_growth_x_annual, 2)}% a year</span>`), '0.004'],
      ['Persistence of technology', '\\(\\rho\\)', each(r => fmt(r.rho, 3)), '0.979'],
      ['Standard deviation of the shocks (percent)', shockSymbol, each((r, t) => fmt(t.sigma, 2)), state.form === 'harrod' ? '–' : '0.72'],
      ['Hours worked (share of time)', '\\(h\\)', each(r => fmt(r.steady_state.hours, 3)), '0.20'],
      ['Capital–output ratio (years)', '\\(K/Y\\)', each(r => fmt(r.steady_state.k_y_annual, 2)), '–'],
      ['Investment share of output', '\\(I/Y\\)', each(r => fmt(r.steady_state.i_y, 3)), '–'],
      ['Consumption share of output', '\\(C/Y\\)', each(r => fmt(r.steady_state.c_y, 3)), '–'],
      ['Real interest rate (percent a year)', '\\(r\\)', each(r => fmt(r.steady_state.r_annual, 2)), '6.5'],
    ];
    const table = (caption, list) => `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">${caption}</caption>
      <thead><tr><th scope="col" class="component-head">${caption === 'Parameters' ? 'Parameter' : 'Steady-state value'}</th><th scope="col">Symbol</th>${head}
        <th scope="col">King and Rebelo<br><span class="unit-label">(1999, Table 2)</span></th></tr></thead>
      <tbody>${list.map(([name, sym, values, kr]) => `<tr><th scope="row">${esc(name)}</th><td class="symbol-cell">${sym}</td>${values}<td>${kr}</td></tr>`).join('')}</tbody></table></div>`;
    return `<h4 class="table-title">Parameters</h4>${table('Parameters', rows.slice(0, 7))}
      <h4 class="table-title">Steady state and great ratios</h4>${table('Steady state and great ratios', rows.slice(7))}`;
  }

  function solutionTable() {
    const { measures, head, each } = measureColumns();
    const quarter = D.quarterLabel(run(measures[0]).initial.quarter);
    const tech = state.form === 'harrod' ? '\\hat{Z}_0' : '\\hat{A}_0';
    const rows = [
      ['Eigenvalues (absolute values)', '\\(|\\lambda|\\)', each(r => r.eigenvalues.map(v => fmt(v, 3)).join(', '))],
      ['Consumption rule', '\\(g_A,\\ g_K\\)', each(r => `${fmt(r.policy.c_a, 3)}, ${fmt(r.policy.c_k, 3)}`)],
      [`Starting values, ${quarter}: linear-trend shocks`, `\\(${tech},\\ \\hat{k}_0\\)`, each(r => `${fmt(r.initial.kr.a, 2)}, ${fmt(r.initial.kr.k, 2)}`)],
      [`Starting values, ${quarter}: HP-filtered shocks`, `\\(${tech},\\ \\hat{k}_0\\)`, each(r => `${fmt(r.initial.hp.a, 2)}, ${fmt(r.initial.hp.k, 2)}`)],
    ];
    return `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Solution of the model and starting values</caption>
      <thead><tr><th scope="col" class="component-head">Solution</th><th scope="col">Symbol</th>${head}</tr></thead>
      <tbody>${rows.map(([name, sym, values]) => `<tr><th scope="row">${esc(name)}</th><td class="symbol-cell">${sym}</td>${values}</tr>`).join('')}</tbody></table></div>`;
  }

  function renderCalibration() {
    setHTML(el.calibration, calibrationTable());
    const harrod = state.form === 'harrod'
      ? ' With Harrod-neutral technology, the shocks to \\(Z\\) enter the model as \\(A = Z^{1-\\alpha}\\), so their effect is that of shocks \\(1-\\alpha\\) times as large to total factor productivity.'
      : '';
    setHTML(el.calibrationNote, `Capital’s share, the depreciation rate and the weight of leisure are those of King and Rebelo (1999, Table 2), and utility is logarithmic in consumption and leisure. The discount factor is set to 0.988 rather than their 0.984 so that, with trend growth, the steady-state real interest rate, \\(r = (1+g_X)/\\beta - 1\\), is about 6.5 percent a year, the return King and Rebelo target; it implies that hours take 20 percent of available time, as in their calibration. Trend growth, persistence and the size of the shocks are estimated from the technology series selected above: the trend growth of \\(X\\) is the trend growth of TFP divided by labour’s share, \\(1-\\alpha\\), close to King and Rebelo’s 1.6 percent a year.${harrod}`);
    setHTML(el.solution, solutionTable());
    setHTML(el.solutionNote, 'The model is log-linearised around its steady state and solved by the method of Blanchard and Kahn (1980); see <a class="text-link" href="#method-solution" data-open-ribbon>Solving and simulating the model</a>. One eigenvalue lies outside the unit circle, one for the single jump variable, consumption, as the Blanchard–Kahn condition requires; the other two are the persistence of technology and the speed at which capital returns to its steady state. Consumption follows the rule \\(\\hat{c}_t = g_A \\hat{A}_t + g_K \\hat{k}_t\\). The starting values are the percent deviations of technology and capital per capita from trend in the first quarter of the data, measured in the same way as the shocks that follow.');
  }

  /* Impulse responses ---------------------------------------------- */

  function renderIRF() {
    const measures = Array.from(new Set(variants().map(v => v.measure)));
    const harrod = state.form === 'harrod';
    setHTML(el.irfIntro, harrod
      ? 'Consider a positive shock of 1 percent to labour-augmenting technology, \\(\\varepsilon^Z_1\\), hitting an economy on its balanced growth path in quarter 1, with no further shocks; total factor productivity rises by \\(1-\\alpha\\) percent.'
      : 'Consider a positive technology shock, \\(\\varepsilon^A_1\\), of 1 percent hitting an economy on its balanced growth path in quarter 1, with no further shocks.');
    irfCards.forEach(card => {
      const key = card.dataset.irfVar;
      const series = measures.map((m, i) => ({
        label: measures.length > 1 ? `${MEASURES[m].charAt(0).toUpperCase()}${MEASURES[m].slice(1)}` : 'Response',
        color: token(measures.length > 1 ? MULTI[i] : '--chart-1'),
        weight: measures.length > 1 ? 1 : 1.1,
        values: run(m).irf[key],
      }));
      const quarters = series[0].values.map((_, i) => i + 1);
      const previous = state.irfCharts.get(card);
      if (previous) previous.destroy();
      inCard(card, 'chart-status').hidden = true;
      inCard(card, 'chart-frame').hidden = false;
      if (key === 'a') card.querySelector('.chart-title').textContent = harrod ? 'Labour-augmenting technology' : 'Technology';
      state.irfCharts.set(card, D.lineChart(inCard(card, 'chart-frame'), {
        dates: quarters, xValues: quarters, series, xStep: 20, xTitle: 'Quarters', zeroLine: true, digits: 3, copyrightPosition: 'top',
        readout: inCard(card, 'chart-readout'),
        label: `Impulse response of ${card.querySelector('.chart-title').textContent.toLowerCase()} to a 1 percent technology shock`,
      }));
      inCard(card, 'chart-legend').innerHTML = series.length > 1 ? series.map(swatch).join('') : '';
      inCard(card, 'chart-legend').hidden = series.length < 2;
      inCard(card, 'chart-readout').textContent = '';
    });
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
      if (payload.model.runs[state.form].measured.irf) renderIRF();
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
    modelCards.forEach(card => { inCard(card, 'chart-status').textContent = 'The model simulations will appear after the next data update.'; });
    el.statsTable.innerHTML = message;
    el.corrTable.innerHTML = '';
    el.calibration.innerHTML = message;
    irfCards.forEach(card => { inCard(card, 'chart-status').textContent = 'The impulse responses will appear after the next data update.'; });
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
  /* Links to a ribbon open it before the page scrolls to it. */
  body.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
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
