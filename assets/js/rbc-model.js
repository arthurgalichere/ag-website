/* Last edited: 2026-11-08 11:21 UTC (Claude, economics chat) */
/* =========================================================
   rbc-model.js: /economics/rbc-model.html
   Loads the generated rbc-model JSON for the selected country.
   For now: one chart of the technology shocks (innovations of
   the AR(1) process for detrended log technology), Hicks- or
   Harrod-neutral, measured or utilization-adjusted TFP, with a
   table of the estimated processes and downloads. Uses AGDashboards
   (dashboards.js) and AGSite.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="rbc-model"]');
  if (!body || !D || !S) return;

  const card = body.querySelector('[data-role="technology-card"]');
  const role = name => card.querySelector(`[data-role="${name}"]`);
  const el = {
    pageStatus: body.querySelector('[data-role="page-status"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    downloads: body.querySelector('[data-role="downloads"]'),
  };
  const state = { country: 'US', form: 'hicks', variant: 'measured', payload: null, chart: null };
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => D.formatNumber(value, digits);

  function statsTable() {
    const tech = state.payload.technology;
    const rows = [];
    /* Only the form selected above the chart (Hicks- or Harrod-neutral). */
    Object.entries(tech).filter(([form]) => form === state.form).forEach(([form, block]) => {
      Object.entries(block.series).forEach(([key, t]) => {
        const current = form === state.form && (state.variant === 'comparison' || state.variant === key);
        rows.push(`<tr${current ? ' class="is-current"' : ''}>
          <th scope="row">${S.escapeHTML(t.label)}<br><span class="unit-label">${S.escapeHTML(block.label)}</span></th>
          <td>${fmt(t.rho, 3)}</td><td>${fmt(t.sigma, 2)}</td><td>${fmt(t.trend_growth_annual, 2)}</td>
          <td>${fmt(100 * t.share_negative_growth, 0)}</td>
          <td>${D.quarterLabel(t.estimation[0])}–${D.quarterLabel(t.estimation[1])}</td></tr>`);
      });
    });
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

  function render() {
    const payload = state.payload;
    if (!payload) return;
    if (!payload.technology[state.form]) state.form = 'hicks';
    const block = payload.technology[state.form];
    const tech = block.series;
    const keys = state.variant === 'comparison' ? ['measured', 'adjusted'] : [state.variant];
    const colours = state.variant === 'comparison' ? ['--series-4', '--series-2'] : ['--chart-1'];
    const series = keys.map((key, i) => ({
      label: tech[key].label, color: token(colours[i]), values: tech[key].shock,
    }));
    const dates = payload.dates;
    role('chart-subtitle').textContent = `Percent · ${block.label} · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;

    if (state.chart) state.chart.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    /* Same symmetric axis for measured and utilization-adjusted shocks:
       at least -4 to +4, wider only if a series in this form goes beyond. */
    const lim = Math.max(4, Math.ceil(Math.max(...Object.values(tech)
      .flatMap(item => item.shock.filter(Number.isFinite).map(Math.abs)))));
    state.chart = D.lineChart(role('chart-frame'), {
      dates, series, period: 0.25, zeroLine: true, digits: 2, yRange: [-lim, lim],
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readout: role('chart-readout'),
      label: `Technology shocks, ${block.label}, with recessions shaded`,
    });
    role('chart-legend').innerHTML = series.map(item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    const sources = Array.from(new Set(keys.map(key => tech[key].source).filter(Boolean)));
    role('chart-source').textContent = `Source: ${sources.join('; ')}. Shocks: author’s calculations.`;
    role('shock-table').innerHTML = statsTable();
  }

  function updateDownloads() {
    const links = state.payload.downloads;
    if (!links) return;
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = false;
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', state.country.toLowerCase());
      const response = await S.fetchFresh(url);
      const payload = await response.json();
      if (!payload || !payload.technology) throw new Error('The data file does not contain the expected series.');
      state.payload = payload;
      el.pageStatus.hidden = true;
      if (!payload.technology.harrod) card.querySelector('[data-control="form"]').hidden = true;
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
        + `<span class="render-error-message">${S.escapeHTML(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  D.segmented(card.querySelector('[data-control="form"]'), value => {
    state.form = value;
    render();
  }).select('hicks', false);
  D.segmented(card.querySelector('[data-control="tfp"]'), value => {
    state.variant = value;
    render();
  }).select('measured', false);
  load();
})();
