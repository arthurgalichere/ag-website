/* Last edited: 2026-11-16 09:32 UTC (Claude, economics chat) */
/* =========================================================
   nk-shocks.js: /economics/nk-shocks.html
   Extracting Shocks for the New Keynesian Model: renders the shock
   extraction built by scripts/indicators/nk_model_data.py
   (nk-shocks.json): the identification problem, technology from labour
   productivity, the inversion, the fixed point for the persistences, the
   shock processes and their properties, tests and robustness.
   Everything is computed in the build; this script only draws.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="nk-shocks"]');
  if (!body || !D || !S) return;

  const STATES = ['a', 'th', 'z', 'nu'];
  const NAME = { a: 'Technology', th: 'Labour preference', z: 'Demand', nu: 'Monetary policy' };
  const SYM = { a: '\\hat{a}_t', th: '\\hat{\\theta}_t', z: '\\hat{\\zeta}_t', nu: '\\nu_t' };
  const RHO = { a: '\\rho_A', th: '\\rho_\\theta', z: '\\rho_\\zeta', nu: '\\rho_\\nu' };
  const INNOV = { a: '\\varepsilon^A_t', th: '\\varepsilon^\\theta_t', z: '\\varepsilon^\\zeta_t', nu: '\\nu_t' };
  const UNIT = { a: 'percent', th: 'percent', z: 'percent', nu: 'percentage points, annual rate' };
  const BENCHMARK_DASH = '8 4 0.1 4';
  const HINT = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

  const role = name => body.querySelector(`[data-role="${name}"]`);
  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => (Number.isFinite(value) ? D.formatNumber(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value, digits) : '–');
  const esc = text => S.escapeHTML(String(text));
  const charts = new Map();
  let P = null;

  function setHTML(element, html) {
    if (!element) return;
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  const swatch = item => `
    <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
      <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
        stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;

  function draw(card, series, options = {}) {
    const previous = charts.get(card);
    if (previous) previous.destroy();
    inCard(card, 'chart-status').hidden = true;
    inCard(card, 'chart-frame').hidden = false;
    const dates = options.dates || P.dates;
    charts.set(card, D.lineChart(inCard(card, 'chart-frame'), {
      dates, period: 0.25, zeroLine: true, digits: 2, recessions: P.recessions ? P.recessions.intervals : [],
      label: card.querySelector('.chart-title').textContent, ...options, series, readout: inCard(card, 'chart-readout'),
    }));
    const legend = inCard(card, 'chart-legend');
    legend.innerHTML = series.length > 1 || series.some(s => s.marks) ? series.map(swatch).join('') + (series.some(s => s.marks) ? `<li><span class="legend-estimate" aria-hidden="true"></span>${esc(options.markLegend || '')}</li>` : '') : '';
    legend.hidden = legend.innerHTML === '';
    inCard(card, 'chart-readout').textContent = HINT;
  }

  const sample = () => `${D.quarterLabel(P.dates[0])}–${D.quarterLabel(P.dates[P.dates.length - 1])}`;
  const tableWrap = (caption, head, rows, cls = '') => `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table ${cls}">
    <caption class="visually-hidden">${esc(caption)}</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;

  /* Step 1: identification ------------------------------------------ */
  function renderIdentification() {
    const id = P.identification;
    const head = '<tr><th scope="col" class="component-head">Effect of a 1 percent deviation of the state on</th><th scope="col">Technology \\(\\hat{a}_t\\)</th><th scope="col">Labour weight \\(\\hat{\\theta}_t\\)</th><th scope="col">Ratio</th></tr>';
    const rows = [['Output \\(\\hat{y}_t\\)', 0], ['Inflation \\(\\pi_t\\)', 1], ['Interest rate \\(\\hat{R}_t\\)', 2]].map(([label, i]) =>
      `<tr><th scope="row">${label}</th><td>${fmt(id.columns.a[i], 4)}</td><td>${fmt(id.columns.th[i], 4)}</td><td>${fmt(id.ratio[i], 3)}</td></tr>`).join('');
    setHTML(role('identification-table'), tableWrap('Effects of technology and of the labour-disutility weight', head, rows));
  }

  /* Step 2: technology ---------------------------------------------- */
  function renderTechnology() {
    const card = body.querySelector('[data-chart="technology"]');
    const tc = P.technology_check;
    const series = [{ label: 'Labour productivity (output per hour), HP cycle: technology in the model', color: token('--chart-1'), weight: 1.1, values: P.series.yh_hp }];
    if (tc) series.push({ label: 'Utilization-adjusted TFP (Fernald), HP cycle', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: P.series.tfp_util_hp });
    inCard(card, 'chart-subtitle').textContent = `Percent deviation from trend · quarterly · ${sample()}`;
    draw(card, series);
    inCard(card, 'chart-source').textContent = `Data: labour productivity, nonfarm business sector (OPHNFB), ${P.sources.yh_hp}; utilization-adjusted TFP, ${P.sources.tfp_util_hp || 'John Fernald, Federal Reserve Bank of San Francisco'}.`;
    if (!tc) return;
    const rows = [
      ['Standard deviation (percent)', fmt(tc.sd_yh), fmt(tc.sd_tfp)],
      ['First-order autocorrelation', fmt(tc.ar1_yh), fmt(tc.ar1_tfp)],
      ['Correlation with output', fmt(tc.corr_y_yh), fmt(tc.corr_y_tfp)],
      ['Correlation between the two', fmt(tc.corr), fmt(tc.corr)],
    ].map(([n, a, b]) => `<tr><th scope="row">${n}</th><td>${a}</td><td>${b}</td></tr>`).join('');
    setHTML(role('technology-table'), tableWrap('Labour productivity and utilization-adjusted TFP',
      '<tr><th scope="col" class="component-head">HP cyclical components</th><th scope="col">Labour productivity</th><th scope="col">Utilization-adjusted TFP</th></tr>', rows));
  }

  /* Step 3: inversion ----------------------------------------------- */
  function renderMatrix() {
    const m = P.matrix;
    const rowName = { y: 'Output \\(\\hat{y}_t\\)', yh: 'Labour productivity \\(\\hat{y}_t - \\hat{h}_t\\)', pi: 'Inflation \\(\\pi_t\\)', R: 'Interest rate \\(\\hat{R}_t\\)' };
    const head = `<tr><th scope="col" class="component-head">Observable</th>${m.columns.map(k => `<th scope="col">${NAME[k]} \\(${SYM[k]}\\)</th>`).join('')}</tr>`;
    const rows = m.rows.map((r, i) => `<tr><th scope="row">${rowName[r]}</th>${m.values[i].map(v => `<td>${fmt(v, 4)}</td>`).join('')}</tr>`).join('');
    setHTML(role('matrix-table'), tableWrap('The matrix M at the estimated persistences', head, rows));
  }

  function renderStateCards() {
    body.querySelectorAll('[data-state-chart]').forEach(card => {
      const k = card.dataset.stateChart;
      inCard(card, 'chart-subtitle').textContent = `${k === 'nu' ? 'Percentage points, annual rate' : 'Percent deviation from steady state'} · quarterly · ${sample()}`;
      const series = [{ label: NAME[k], color: token('--chart-1'), weight: 1.1, values: P.series[k] }];
      if (k === 'nu') {
        const marks = P.romer.filter(r => r.in_sample).map(r => P.dates.indexOf(r.quarter));
        series[0].marks = marks;
        series[0].markLabel = 'Romer and Romer (2023) date';
        series[0].label = 'Monetary policy shock';
        draw(card, series, { markLegend: 'Romer and Romer (2023) narrative dates' });
      } else {
        draw(card, series);
      }
      const pr = P.properties[k];
      inCard(card, 'chart-note').textContent = `Standard deviation ${fmt(pr.sd_state)} ${UNIT[k]}; first-order autocorrelation ${fmt(pr.rho)}.`;
    });
  }

  /* Step 4: fixed point --------------------------------------------- */
  function renderFixedPoint() {
    const fp = P.fixed_point;
    const head = '<tr><th scope="col" class="component-head">Iteration</th><th scope="col">\\(\\rho_A\\)</th><th scope="col">\\(\\rho_\\theta\\)</th><th scope="col">\\(\\rho_\\zeta\\)</th></tr>';
    // List iterations until the values no longer change at four decimals.
    const key = r => [r.a, r.th, r.z].map(v => fmt(v, 4)).join('|');
    const shown = fp.path.filter((r, i) => i === 0 || key(r) !== key(fp.path[i - 1]));
    const rows = shown.map(r => `<tr><th scope="row">${r.iteration === 0 ? '0 (notes)' : r.iteration}</th><td>${fmt(r.a, 4)}</td><td>${fmt(r.th, 4)}</td><td>${fmt(r.z, 4)}</td></tr>`).join('')
      + `<tr><td colspan="4" class="table-footnote">Unchanged at four decimals from iteration ${shown[shown.length - 1].iteration}; converged (changes below \\(10^{-8}\\)) after ${fp.iterations} iterations.</td></tr>`;
    setHTML(role('fixed-point-table'), tableWrap('Iterations of the persistences to the fixed point', head, rows, 'compact-table'));
  }

  /* Step 5: shocks -------------------------------------------------- */
  function renderInnovationCards() {
    body.querySelectorAll('[data-innov-chart]').forEach(card => {
      const k = card.dataset.innovChart;
      inCard(card, 'chart-subtitle').textContent = `${k === 'nu' ? 'Percentage points, annual rate' : 'Percent'} · quarterly · ${sample()}`;
      draw(card, [{ label: NAME[k], color: token('--chart-1'), weight: 1.1, values: P.series[`e_${k}`] }]);
      const pr = P.properties[k];
      inCard(card, 'chart-note').textContent = `Standard deviation ${fmt(pr.sd_innov)} ${UNIT[k]}. Average in recession quarters ${fmt(pr.mean_innov_rec)}, in expansions ${fmt(pr.mean_innov_exp)}.`;
    });
  }

  function renderProperties() {
    const pr = P.properties;
    const head = `<tr><th scope="col" class="component-head"></th>${STATES.map(k => `<th scope="col">${NAME[k]}</th>`).join('')}</tr>`;
    const row = (label, fn) => `<tr><th scope="row">${label}</th>${STATES.map(k => `<td>${fn(pr[k], k)}</td>`).join('')}</tr>`;
    const group = title => `<tr class="table-group"><th scope="rowgroup" colspan="5">${esc(title)}</th></tr>`;
    const rows = [
      group('The state'),
      row('Standard deviation', p => fmt(p.sd_state)),
      row('Persistence: AR(1) estimate (standard error)', p => `${fmt(p.rho)} (${fmt(p.rho_se)})`),
      row('Persistence in the notes', (p, k) => (k === 'z' ? `${fmt(p.rho_notes)}*` : fmt(p.rho_notes))),
      row('Persistence used (calibration)', p => fmt(p.rho_used)),
      group('The shock (innovation)'),
      row('Standard deviation', p => fmt(p.sd_innov)),
      row('First-order autocorrelation', p => fmt(p.innov_ar1)),
      row('Skewness', p => fmt(p.skew)),
      row('Excess kurtosis', p => fmt(p.ex_kurt)),
      row('Jarque–Bera test of normality, p-value', p => (p.jb_p < 0.001 ? '< 0.001' : fmt(p.jb_p, 3))),
      row('Average in recession quarters', p => fmt(p.mean_innov_rec)),
      row('Average in expansion quarters', p => fmt(p.mean_innov_exp)),
    ].join('');
    setHTML(role('properties-table'), tableWrap('Properties of the backed-out states and shocks', head, rows, 'slide-table'));
  }

  /* Step 6: tests --------------------------------------------------- */
  function renderCorrelations() {
    const c = P.correlations;
    const head = `<tr><th scope="col" class="component-head"></th>${STATES.map(k => `<th scope="col">\\(${INNOV[k]}\\)</th>`).join('')}</tr>`;
    const rows = STATES.map((k, i) => `<tr><th scope="row">${NAME[k]} \\(${INNOV[k]}\\)</th>${STATES.map((_, j) => {
      const v = c.values[i][j];
      if (j > i) return '<td></td>';
      const strong = i !== j && Math.abs(v) > c.threshold;
      return `<td${strong ? ' class="is-significant"' : ''}>${fmt(v)}</td>`;
    }).join('')}</tr>`).join('');
    setHTML(role('correlation-table'), tableWrap('Correlations between the shocks', head, rows));
    role('correlation-note').textContent = `${c.n} quarters. Correlations larger than ${fmt(c.threshold)} in absolute value (about 2/√T) are in bold: they differ from zero at roughly the 5 percent level.`;
  }

  function renderRomer() {
    const head = '<tr><th scope="col" class="component-head">Romer and Romer date</th><th scope="col">Quarter</th><th scope="col">Direction</th><th scope="col">Shock \\(\\nu_t\\)</th><th scope="col">Change in the quarter</th><th scope="col">Change in the next quarter</th><th scope="col">Change over the two quarters</th><th scope="col">Agrees?</th></tr>';
    let agree = 0, total = 0;
    const rows = P.romer.map(r => {
      if (!r.in_sample) return `<tr><th scope="row">${esc(r.label)}</th><td>${D.quarterLabel(r.quarter)}</td><td>${r.sign > 0 ? 'Contractionary' : 'Expansionary'}</td><td colspan="5">Before the sample</td></tr>`;
      const ok = Math.sign(r.change2) === r.sign;
      agree += ok ? 1 : 0; total += 1;
      return `<tr><th scope="row">${esc(r.label)}</th><td>${D.quarterLabel(r.quarter)}</td><td>${r.sign > 0 ? 'Contractionary' : 'Expansionary'}</td><td>${fmt(r.nu)}</td><td>${fmt(r.dnu)}</td><td>${fmt(r.dnu_next)}</td><td>${fmt(r.change2)}</td><td>${ok ? 'Yes' : 'No'}</td></tr>`;
    }).join('');
    setHTML(role('romer-table'), tableWrap('Backed-out monetary shocks at the Romer and Romer (2023) dates', head, rows));
    role('romer-note').textContent = `The change over the two quarters (from the quarter before the date to the quarter after) has the sign of the narrative shock at ${agree} of the ${total} dates in the sample. Percentage points, annual rate.`;
  }

  /* Step 7: robustness ---------------------------------------------- */
  function renderRobustness() {
    const head = `<tr><th scope="col" class="component-head" rowspan="2">Variant</th><th scope="colgroup" colspan="3">Persistence</th><th scope="col" rowspan="2">AR(1) of \\(\\nu_t\\)</th><th scope="colgroup" colspan="4">Standard deviation of the shocks</th><th scope="colgroup" colspan="2">Correlation of the shocks</th></tr>
      <tr><th scope="col">\\(\\rho_A\\)</th><th scope="col">\\(\\rho_\\theta\\)</th><th scope="col">\\(\\rho_\\zeta\\)</th>
      <th scope="col">\\(\\varepsilon^A\\)</th><th scope="col">\\(\\varepsilon^\\theta\\)</th><th scope="col">\\(\\varepsilon^\\zeta\\)</th><th scope="col">\\(\\nu\\)</th>
      <th scope="col">\\(\\varepsilon^\\theta, \\varepsilon^\\zeta\\)</th><th scope="col">\\(\\varepsilon^\\zeta, \\nu\\)</th></tr>`;
    const rows = P.robustness.map((r, i) => `<tr${i === 0 ? ' class="baseline-row"' : ''}><th scope="row">${esc(r.label)}${r.label.includes('ρ_ν') ? ` (\\(\\rho_\\nu = ${fmt(r.rho.nu)}\\))` : ''}</th>
      <td>${fmt(r.rho.a)}</td><td>${fmt(r.rho.th)}</td><td>${fmt(r.rho.z)}</td><td>${fmt(r.nu_ar1)}</td>
      <td>${fmt(r.sd_innov.a)}</td><td>${fmt(r.sd_innov.th)}</td><td>${fmt(r.sd_innov.z)}</td><td>${fmt(r.sd_innov.nu)}</td>
      <td>${fmt(r.corr.th_z)}</td><td>${fmt(r.corr.z_nu)}</td></tr>`).join('');
    setHTML(role('robustness-table'), tableWrap('Persistences and shocks under alternative choices', head, rows, 'robustness-table'));
  }

  /* Calibration ----------------------------------------------------- */
  function renderCalibration() {
    const c = P.calibration;
    const head = '<tr><th scope="col" class="component-head">Shock</th><th scope="col">Persistence</th><th scope="col">Standard deviation of the shock</th></tr>';
    const rows = STATES.map(k => `<tr><th scope="row">${NAME[k]}</th><td>\\(${RHO[k]} = ${fmt(c.rho[k], 3)}\\)${k === 'nu' ? ' (i.i.d., as in the notes)' : ''}</td><td>${fmt(c.sd[k], 3)} ${UNIT[k]}</td></tr>`).join('');
    setHTML(role('calibration-table'), tableWrap('Calibration of the shocks', head, rows));
  }

  function renderDownloads() {
    const box = role('downloads');
    if (!box || !P.downloads) return;
    const base = body.dataset.siteBase || '/';
    box.querySelectorAll('[data-download]').forEach(link => {
      const path = P.downloads[link.dataset.download];
      if (!path) return;
      link.href = D.siteUrl ? D.siteUrl(base, path) : path;
      link.hidden = false;
    });
    box.hidden = false;
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', 'us');
      const response = await S.fetchFresh(url);
      P = await response.json();
      if (!P || !P.series || !P.properties) throw new Error('The data file does not contain the expected results.');
      role('page-status').hidden = true;
      renderIdentification();
      renderTechnology();
      renderMatrix();
      renderStateCards();
      renderFixedPoint();
      renderInnovationCards();
      renderProperties();
      renderCorrelations();
      renderRomer();
      renderRobustness();
      renderCalibration();
      renderDownloads();
      const note = role('update-note');
      note.textContent = `Data updated on ${new Date(P.data_generated_at_utc || P.generated_at_utc).toLocaleDateString('en-GB')}`;
      note.hidden = false;
    } catch (error) {
      const status = role('page-status');
      status.hidden = false;
      status.className = 'render-error';
      status.innerHTML = '<span class="render-error-title">The results could not be loaded.</span>'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  body.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  });
  load();
})();
