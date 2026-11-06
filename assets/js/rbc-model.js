/* Last edited: 2026-11-06 23:22 UTC (Claude, economics chat) */
/* =========================================================
   rbc-model.js: /economics/rbc-model.html
   Loads the generated rbc-model JSON for the selected country.
   For now: one chart of the technology shocks (innovations of
   the AR(1) process for detrended log TFP), measured or
   utilization-adjusted, or both. Uses AGDashboards
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
  };
  const state = { country: 'US', variant: 'measured', payload: null, chart: null };
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => D.formatNumber(value, digits);

  function render() {
    const payload = state.payload;
    if (!payload) return;
    const tech = payload.technology;
    const keys = state.variant === 'comparison' ? ['measured', 'adjusted'] : [state.variant];
    const colours = state.variant === 'comparison' ? ['--series-4', '--series-2'] : ['--chart-1'];
    const series = keys.map((key, i) => ({
      label: tech[key].label, color: token(colours[i]), values: tech[key].shock,
    }));
    const dates = payload.dates;
    role('chart-subtitle').textContent = `Percent · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;

    if (state.chart) state.chart.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    state.chart = D.lineChart(role('chart-frame'), {
      dates, series, period: 0.25, zeroLine: true, digits: 2,
      recessions: payload.recessions ? payload.recessions.intervals : [],
      readout: role('chart-readout'),
      label: 'Technology shocks, with recessions shaded',
    });
    role('chart-legend').innerHTML = series.map(item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    const sources = Array.from(new Set(keys.map(key => tech[key].source).filter(Boolean)));
    role('chart-source').textContent = `Source: ${sources.join('; ')}. Shocks: author’s calculations.`;
    role('shock-stats').innerHTML = keys.map(key => {
      const t = tech[key];
      return `${t.label}, estimated ${D.quarterLabel(t.estimation[0])}–${D.quarterLabel(t.estimation[1])}: persistence ρ = ${fmt(t.rho, 3)}; standard deviation of the shock σ = ${fmt(t.sigma, 2)} percent; trend growth ${fmt(t.trend_growth_annual, 2)} percent a year; TFP fell in ${fmt(100 * t.share_negative_growth, 0)} percent of quarters.`;
    }).map(S.escapeHTML).join('<br>');
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', state.country.toLowerCase());
      const response = await S.fetchFresh(url);
      const payload = await response.json();
      if (!payload || !payload.technology) throw new Error('The data file does not contain the expected series.');
      state.payload = payload;
      el.pageStatus.hidden = true;
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

  D.segmented(card.querySelector('[data-control="tfp"]'), value => {
    state.variant = value;
    render();
  }).select('measured', false);
  load();
})();
