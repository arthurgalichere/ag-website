/* Last edited: 2026-11-08 01:08 UTC (Claude, economics chat) */
/* =========================================================
   tfp-shocks.js: /economics/tfp-shocks.html
   The extraction of technology shocks step by step (King and
   Rebelo, 1999): TFP level, log TFP with its linear trend, the
   deviation from trend, persistence (scatter of u(t) against
   u(t-1) with slope rho), the shocks, and the estimated process.
   Reads the rbc-model JSON (technology[form].series[measure],
   with .steps). Page switches: productivity measure and form of
   technology. Uses AGDashboards (dashboards.js) and AGSite.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="tfp-shocks"]');
  if (!body || !D || !S) return;

  const state = { country: 'US', form: 'hicks', measure: 'measured', payload: null, charts: new Map() };
  const el = {
    pageStatus: body.querySelector('[data-role="page-status"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    table: body.querySelector('[data-role="shock-table"]'),
    process: body.querySelector('[data-role="model-process"]'),
  };
  const cards = new Map(Array.from(body.querySelectorAll('[data-step]')).map(card => [card.dataset.step, card]));
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => D.formatNumber(value, digits);
  const role = (card, name) => card.querySelector(`[data-role="${name}"]`);

  function current() {
    const block = state.payload.technology[state.form] || state.payload.technology.hicks;
    return { block, series: block.series[state.measure] };
  }

  const DASH_DOT = '8 4 0.1 4';   /* benchmark lines: dash-dot (round caps make the dot) */
  /* Typeset new content once MathJax has started; clear old content first. */
  function untypeset(element) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
  }
  function typeset(element) {
    const MJ = window.MathJax;
    if (!MJ || !MJ.startup || !MJ.startup.promise) return;
    MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }
  /* Notation: A for Hicks-neutral technology (TFP), Z for Harrod-neutral;
     superscript u for utilization-adjusted TFP. */
  const techLetter = () => (state.form === 'harrod' ? 'Z' : 'A');
  const shockTeX = () => {
    const letter = techLetter();
    return `\\varepsilon^{${state.measure === 'adjusted' ? `${letter}^u` : letter}}_t`;
  };

  /* item.html: a legend label that may hold maths (already safe HTML). */
  function legend(card, series) {
    const target = role(card, 'chart-legend');
    untypeset(target);
    target.innerHTML = series.map(item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${item.html || S.escapeHTML(item.label)}</li>`).join('');
    target.hidden = false;
    typeset(target);
  }

  function timeChart(step, series, subtitle, zeroLine) {
    const card = cards.get(step);
    if (!card) return;
    const dates = state.payload.dates;
    role(card, 'chart-subtitle').textContent = `${subtitle} · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;
    const prev = state.charts.get(step);
    if (prev) prev.destroy();
    role(card, 'chart-status').hidden = true;
    role(card, 'chart-frame').hidden = false;
    state.charts.set(step, D.lineChart(role(card, 'chart-frame'), {
      dates, series, period: 0.25, zeroLine, digits: 2,
      recessions: state.payload.recessions ? state.payload.recessions.intervals : [],
      readout: role(card, 'chart-readout'),
      label: `${card.querySelector('.chart-title').textContent}, with recessions shaded`,
    }));
    legend(card, series);
    role(card, 'chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';
  }

  /* Step 4: scatter of u(t) against u(t-1), with the line of slope rho. */
  function scatter(step, u, rho) {
    const card = cards.get(step);
    if (!card) return;
    const pairs = [];
    for (let i = 1; i < u.length; i += 1) {
      if (Number.isFinite(u[i]) && Number.isFinite(u[i - 1])) pairs.push([u[i - 1], u[i]]);
    }
    const frame = role(card, 'chart-frame');
    role(card, 'chart-status').hidden = true;
    frame.hidden = false;
    const blue = token('--chart-1');
    const line = token('--chart-benchmark');
    const draw = () => {
      const width = Math.max(280, frame.clientWidth);
      const height = Math.round(Math.min(440, Math.max(260, width * 0.6)));
      const m = { top: 14, right: 16, bottom: 40, left: 52 };
      const all = pairs.flat();
      const lim = Math.ceil(Math.max(...all.map(Math.abs)));
      const x = v => m.left + ((v + lim) / (2 * lim)) * (width - m.left - m.right);
      const y = v => m.top + ((lim - v) / (2 * lim)) * (height - m.top - m.bottom);
      const step = lim > 10 ? 5 : lim > 4 ? 2 : 1;
      let ticks = '';
      for (let t = -Math.floor(lim / step) * step; t <= lim; t += step) {
        ticks += `<line x1="${x(t)}" x2="${x(t)}" y1="${m.top}" y2="${height - m.bottom}" stroke="var(--chart-grid, rgba(28,28,30,0.08))"/>`
          + `<line x1="${m.left}" x2="${width - m.right}" y1="${y(t)}" y2="${y(t)}" stroke="var(--chart-grid, rgba(28,28,30,0.08))"/>`
          + `<text x="${x(t)}" y="${height - m.bottom + 16}" text-anchor="middle" class="chart-axis-text">${t}</text>`
          + `<text x="${m.left - 8}" y="${y(t) + 4}" text-anchor="end" class="chart-axis-text">${t}</text>`;
      }
      const dots = pairs.map(([a, b]) => `<circle cx="${x(a).toFixed(1)}" cy="${y(b).toFixed(1)}" r="2.6" fill="${blue}" fill-opacity="0.55"/>`).join('');
      frame.innerHTML = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img"
        aria-label="Scatter of the deviation from trend against its value one quarter earlier, with a line of slope ${fmt(rho, 3)}">
        ${ticks}
        <line x1="${x(-lim)}" x2="${x(lim)}" y1="${y(0)}" y2="${y(0)}" stroke="var(--chart-zero, rgba(28,28,30,0.45))"/>
        <line x1="${x(0)}" x2="${x(0)}" y1="${y(-lim)}" y2="${y(lim)}" stroke="var(--chart-zero, rgba(28,28,30,0.45))"/>
        ${dots}
        <line x1="${x(-lim)}" y1="${y(-rho * lim)}" x2="${x(lim)}" y2="${y(rho * lim)}" stroke="${line}" stroke-width="2.2" stroke-dasharray="${DASH_DOT}" stroke-linecap="round"/>
        <text x="${(m.left + width - m.right) / 2}" y="${height - 6}" text-anchor="middle" class="chart-axis-text">Last quarter, u(t − 1), percent</text>
        <text transform="translate(14 ${(m.top + height - m.bottom) / 2}) rotate(-90)" text-anchor="middle" class="chart-axis-text">This quarter, u(t), percent</text>
      </svg>`;
    };
    draw();
    const prev = state.charts.get(step);
    if (prev) prev.destroy();
    const observer = 'ResizeObserver' in window ? new ResizeObserver(draw) : null;
    if (observer) observer.observe(frame);
    state.charts.set(step, { destroy() { if (observer) observer.disconnect(); frame.textContent = ''; } });
    const dates = state.payload.dates;
    role(card, 'chart-subtitle').textContent = `Percent · one point per quarter, ${D.quarterLabel(dates[1])}–${D.quarterLabel(dates[dates.length - 1])}`;
    legend(card, [
      { label: 'Quarters', color: blue },
      { label: 'Fitted line', html: `Fitted line, slope \\(\\hat{\\rho} = ${fmt(rho, 3)}\\) (full history)`, color: line, dash: DASH_DOT },
    ]);
    role(card, 'chart-readout').textContent = '';
  }

  function table() {
    const rows = [];
    Object.entries(state.payload.technology).forEach(([form, block]) => {
      Object.entries(block.series).forEach(([key, t]) => {
        const isCurrent = form === state.form && key === state.measure;
        const half = Math.log(0.5) / Math.log(t.rho);
        rows.push(`<tr${isCurrent ? ' class="is-current"' : ''}>
          <th scope="row">${S.escapeHTML(t.label)}<br><span class="unit-label">${S.escapeHTML(block.label)}</span></th>
          <td>${fmt(t.rho, 3)}</td><td>${fmt(half, 0)}</td><td>${fmt(t.sigma, 2)}</td><td>${fmt(t.trend_growth_annual, 2)}</td>
          <td>${fmt(100 * t.share_negative_growth, 0)}</td>
          <td>${D.quarterLabel(t.estimation[0])}–${D.quarterLabel(t.estimation[1])}</td></tr>`);
      });
    });
    el.table.innerHTML = `<div class="table-scroll"><table class="data-table shares-table bc-table shock-table">
      <caption class="visually-hidden">Estimated technology processes</caption>
      <thead><tr><th scope="col" class="component-head">Technology</th>
        <th scope="col">Persistence<br><span class="unit-label">(ρ)</span></th>
        <th scope="col">Half-life<br><span class="unit-label">(quarters)</span></th>
        <th scope="col">Standard deviation of the shock<br><span class="unit-label">(σ, percent)</span></th>
        <th scope="col">Trend growth<br><span class="unit-label">(percent a year)</span></th>
        <th scope="col">Quarters with falling technology<br><span class="unit-label">(percent)</span></th>
        <th scope="col">Estimation sample</th></tr></thead>
      <tbody>${rows.join('')}</tbody></table></div>`;
  }

  function render() {
    if (!state.payload) return;
    const { block, series: t } = current();
    const s = t.steps;
    const blue = token('--chart-1');
    timeChart('1', [{ label: t.label, color: blue, values: s.level_index }], 'Index, 2017 = 100', false);
    const orange = token('--chart-benchmark');
    const letter = techLetter();
    const shock = shockTeX();
    timeChart('2', [
      { label: `100 × ln ${t.label}`, color: blue, weight: 1.1, values: s.log_level },
      { label: 'Linear trend', color: orange, dash: DASH_DOT, under: true, values: s.trend },
    ], '100 × natural logarithm', false);
    timeChart('3', [{ label: 'Deviation from trend, u(t)', html: 'Deviation from trend, \\(u_t\\)', color: blue, values: s.deviation }], 'Percent', true);
    scatter('4', s.deviation, t.rho);
    timeChart('5', [{ label: 'Technology shock', html: `Technology shock, \\(${shock}\\)`, color: blue, values: t.shock }], 'Percent', true);
    table();
    if (s.model) {
      timeChart('6', [
        { label: 'Model technology', html: `Model technology, \\(\\hat{${letter}}_t\\)`, color: blue, weight: 1.1, values: s.model },
        { label: 'Deviation of log TFP from trend', html: 'Cyclical component of TFP, \\(u_t\\)', color: orange, dash: DASH_DOT, under: true, values: s.deviation },
      ], 'Percent', true);
    }
    const shockNext = shock.replace(/_t$/, '_{t+1}');
    untypeset(el.process);
    el.process.innerHTML = `${S.escapeHTML(t.label)}, ${S.escapeHTML(block.label)}: `
      + `\\(\\hat{${letter}}_{t+1} = ${fmt(t.rho, 3)}\\, \\hat{${letter}}_t + ${shockNext}\\), with \\(\\operatorname{sd}(\\varepsilon) = ${fmt(t.sigma, 2)}\\) percent; `
      + `\\(\\hat{${letter}}_0 = ${shock.replace(/_t$/, '_0')}\\) in ${D.quarterLabel(t.first_shock || t.estimation[0])}. `
      + `Trend growth ${fmt(t.trend_growth_annual, 2)} percent a year. `
      + `Estimated ${D.quarterLabel(t.estimation[0])}–${D.quarterLabel(t.estimation[1])}; charts from ${D.quarterLabel(state.payload.dates[0])}.`;
    typeset(el.process);
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', state.country.toLowerCase());
      const response = await S.fetchFresh(url);
      const payload = await response.json();
      const ok = payload && payload.technology && payload.technology.hicks
        && payload.technology.hicks.series.measured && payload.technology.hicks.series.measured.steps;
      if (!ok) throw new Error('The data file does not contain the expected series.');
      state.payload = payload;
      el.pageStatus.hidden = true;
      if (!payload.technology.harrod) body.querySelector('[data-control="form"]').hidden = true;
      render();
      if (payload.generated_at_utc) {
        el.updateNote.textContent = `Data updated on ${new Date(payload.generated_at_utc).toLocaleDateString('en-GB')}`;
        el.updateNote.hidden = false;
      }
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

  D.segmented(body.querySelector('[data-control="measure"]'), value => { state.measure = value; render(); }).select('measured', false);
  D.segmented(body.querySelector('[data-control="form"]'), value => { state.form = value; render(); }).select('hicks', false);
  load();
})();
