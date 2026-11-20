/* Last edited: 2026-11-20 13:04 UTC (Claude, economics chat) */
/* =========================================================
   calibration.js: /dsge/calibration.html
   Renders calibration.json (built by the private calibration.py):
   parameters (with the models that use them and their sources), data
   targets (total or per capita) with the steady-state values of the model
   pages, and the parameters implied by the targets. Page switches: model
   (all, or one model) and measure (total, per capita); in the implied
   table, trend growth g_X (default) or per-capita output growth.
   Uses AGDashboards (dashboards.js) and AGSite (site.js).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="calibration"]');
  if (!body || !D || !S) return;

  const role = name => body.querySelector(`[data-role="${name}"]`);
  const esc = text => S.escapeHTML(String(text == null ? '' : text));
  const state = { model: 'all', measure: 'total', growth: 'gx', payload: null };
  /* Short names of the models, for the model tags in the tables. */
  const SHORT = { rbc: 'RBC', lag: 'Installation lag', stock: 'RBC stock market', nk: 'New Keynesian', smd: 'Stock-market dynamics' };
  /* Steady-state values of the model pages, by target (model, key, scale). */
  const MODEL_VALUE = {
    hours: [['rbc', 'hours', 1]],
    k_y: [['rbc', 'k_y_annual', 1]],
    i_ci: [['rbc', 'i_y', 1]],
    ret: [['rbc', 'r_annual', 1]],
    pd: [['stock', 'pd_annual', 1]],
    dp: [['stock', 'dp_annual', 1]],
    d_y: [['stock', 'd_y', 100]],
  };

  function setHTML(element, html) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  const fmt = (v, d) => (v == null || !Number.isFinite(Number(v)) ? '–' : D.formatNumber(Number(v), d));
  const tags = models => `<span class="model-tags">${models.map(m => `<span class="model-tag">${esc(SHORT[m] || m)}</span>`).join('')}</span>`;
  const shown = item => state.model === 'all' || (item.models || []).includes(state.model);

  function groupRows(items, columns, rowHTML) {
    const groups = [];
    items.forEach(item => {
      let g = groups.find(x => x.name === item.group);
      if (!g) { g = { name: item.group, items: [] }; groups.push(g); }
      g.items.push(item);
    });
    return groups.map(g => `<tr class="table-group"><th scope="rowgroup" colspan="${columns}">${esc(g.name)}</th></tr>${g.items.map(rowHTML).join('')}`).join('');
  }

  function renderParameters() {
    const items = state.payload.parameters.filter(shown);
    if (!items.length) { role('parameters').innerHTML = '<p class="empty-message">This model has no parameters of its own yet.</p>'; return; }
    const head = '<tr><th scope="col" class="component-head">Parameter</th><th scope="col">Symbol</th><th scope="col">Value</th><th scope="col">Models</th><th scope="col" class="source-col">Source or method</th></tr>';
    const rows = groupRows(items, 5, p => `<tr>
      <th scope="row">${esc(p.name)}</th>
      <td class="symbol-cell">\\(${p.symbol}\\)</td>
      <td>${fmt(p.value, p.digits ?? 3)}</td>
      <td>${tags(p.models)}</td>
      <td class="source-cell">${esc(p.source)}</td></tr>`);
    setHTML(role('parameters'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table calibration-page-table">
      <caption class="visually-hidden">Parameters</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`);
  }

  function modelValue(target) {
    const specs = MODEL_VALUE[target.id] || [];
    const values = state.payload.model_values || {};
    const out = specs.map(([model, key, scale]) => {
      const v = values[model] && values[model][key];
      return v == null ? null : `${fmt(v * scale, target.digits ?? 2)} <span class="unit-label">(${esc(SHORT[model])})</span>`;
    }).filter(Boolean);
    return out.length ? out.join('<br>') : '–';
  }

  function renderTargets() {
    const items = state.payload.targets.filter(shown);
    if (!items.length) { role('targets').innerHTML = '<p class="empty-message">No data targets for this model yet.</p>'; return; }
    const pc = state.measure === 'pc';
    const head = `<tr><th scope="col" class="component-head">Target</th><th scope="col">Symbol</th><th scope="col">US data<br><span class="unit-label">(sample)</span></th><th scope="col">Model</th><th scope="col">Models</th><th scope="col" class="source-col">Definition and source</th></tr>`;
    const rows = groupRows(items, 6, t => {
      const value = pc && t.value_pc != null ? t.value_pc : t.value;
      const marker = t.value_pc != null ? ` <span class="unit-label">(${pc ? 'per capita' : 'total'})</span>` : '';
      return `<tr>
        <th scope="row">${esc(t.name)}</th>
        <td class="symbol-cell">\\(${t.symbol}\\)</td>
        <td>${fmt(value, t.digits ?? 2)}${marker}${t.sample ? `<br><span class="unit-label">${esc(t.sample)}</span>` : ''}</td>
        <td>${modelValue(t)}</td>
        <td>${tags(t.models)}</td>
        <td class="source-cell">${esc(t.definition)} <span class="source-note">Source: ${esc(t.source)}.</span>${t.note ? ` <span class="source-note">${esc(t.note)}</span>` : ''}</td></tr>`;
    });
    setHTML(role('targets'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table calibration-page-table">
      <caption class="visually-hidden">Data targets</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>
      <p class="table-note">Growth rates and returns in percent a year; shares as fractions of output. Model values: the steady state of the model page with its baseline calibration (Hicks-neutral technology, measured TFP).</p>`);
  }

  function renderImplied() {
    const rbcFamily = ['all', 'rbc', 'lag', 'stock'].includes(state.model);
    const section = role('implied').closest('section');
    section.hidden = !rbcFamily;
    if (!rbcFamily) return;
    const params = Object.fromEntries(state.payload.parameters.map(p => [p.id, p]));
    const calibrated = { beta_ret: params.beta, beta_r_bill: params.beta, delta: params.delta, alpha: params.alpha };
    const head = '<tr><th scope="col" class="component-head">Parameter</th><th scope="col">Relation</th><th scope="col">Implied value</th><th scope="col">Calibrated value</th></tr>';
    /* Implied values with trend growth measured by the models' g_X (default)
       or by per-capita output growth; older files have one list. */
    const byBasis = Array.isArray(state.payload.implied) ? { gy: state.payload.implied } : state.payload.implied;
    const basis = byBasis[state.growth] ? state.growth : Object.keys(byBasis)[0];
    const info = (state.payload.growth_bases || {})[basis];
    const control = body.querySelector('[data-control="growth"]');
    if (control) control.hidden = !state.payload.growth_bases;
    const rows = byBasis[basis].map(i => `<tr>
      <th scope="row">${esc(i.name)}</th>
      <td class="symbol-cell">\\(${i.formula}\\)</td>
      <td>${fmt(i.value, i.digits ?? 3)}</td>
      <td>${calibrated[i.id] ? fmt(calibrated[i.id].value, i.digits ?? 3) : '–'}</td></tr>`).join('');
    setHTML(role('implied'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Parameters implied by the targets</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>
      <p class="table-note">Trend growth \\(g_X\\): ${info ? `${esc(info.text)}, ${fmt(info.annual, 2)} percent a year` : 'per-capita output growth'}. Quarterly rates: \\(r\\) and \\(g_X\\) are the annual rates divided by 400, \\(I/Y\\) the investment share and \\(K/Y\\) the capital–output ratio (all private fixed assets) times four. The implied capital share uses the real stock return.</p>`);
  }

  function render() {
    renderParameters();
    renderTargets();
    renderImplied();
  }

  function buildModelButtons() {
    const box = role('model-buttons');
    box.insertAdjacentHTML('beforeend', state.payload.models.map(m =>
      `<button type="button" data-value="${esc(m.id)}" aria-pressed="false" title="${esc(m.name)}">${esc(SHORT[m.id] || m.name)}</button>`).join(''));
    D.segmented(body.querySelector('[data-control="model"]'), value => { state.model = value; render(); }).select('all', false);
  }

  async function load() {
    try {
      const response = await S.fetchFresh(body.dataset.dataUrl.replace('{country}', 'us'));
      state.payload = await response.json();
      if (!state.payload || !state.payload.parameters) throw new Error('The data file does not contain the expected tables.');
      role('page-status').hidden = true;
      buildModelButtons();
      render();
      const note = role('update-note');
      if (note) {
        note.textContent = `Data updated on ${new Date(state.payload.data_generated_at_utc || state.payload.generated_at_utc).toLocaleDateString('en-GB')}`;
        note.hidden = false;
      }
    } catch (error) {
      const status = role('page-status');
      status.hidden = false;
      status.className = 'render-error';
      status.innerHTML = `<span class="render-error-title">The calibration data could not be loaded.</span><span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  D.segmented(body.querySelector('[data-control="measure"]'), value => { state.measure = value; renderTargets(); }).select('total', false);
  D.segmented(body.querySelector('[data-control="growth"]'), value => { state.growth = value; if (state.payload) renderImplied(); }).select('gx', false);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    const id = link && link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target || target.tagName !== 'DETAILS') return;
    event.preventDefault();
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  });
  load();
})();
