/* Last edited: 2026-11-27 14:10 UTC (Claude, economics chat) */
/* =========================================================
   calibration.js: /dsge/calibration.html
   Renders calibration.json (built by the private calibration.py):
   parameters (with the models that use them and their sources), data
   targets (total or per capita) with the steady-state values of the model
   pages, and the parameters implied by the targets. Page switches: model
   (all, or one model) and measure (total, per capita); in the implied
   table, trend growth g_X (default) or per-capita output growth. Each row
   also shows its values in the literature and its role in each model's
   calibration (calibration.json literature, roles; feedback W42-W44), and
   the literature view lists every value by row, filterable by model type
   and frequency (W43).
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
  const SHORT = { rbc: 'RBC', lag: 'Installation lag', stock: 'RBC stock market', nk: 'New Keynesian', smd: 'Stock-market dynamics', bbr: 'Banks and bubbles' };
  const ROLE = { targeted: 'targeted', check: 'check', known_miss: 'known miss', untargeted: 'untargeted', external: 'external target', set: 'set', implied: 'implied' };
  const HOW = { targeted: 'targeted', calibrated: 'calibrated jointly', estimated: 'estimated', set: 'set', implied: 'implied', from_literature: 'from the literature', from_data: 'from data', check: 'check' };
  const litState = { type: 'all', freq: 'all' };
  /* Literature values: as entered, up to 6 decimals (integers without). */
  const fv = v => (v == null ? '–' : Number.isInteger(Number(v)) ? String(v) : String(Number(Number(v).toPrecision(7))));
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
  /* "Used by" tag: the models whose decided calibration uses the row
     (calibration.json used_by; the page's defaults stay as they are). */
  const usedBy = item => (item.used_by && item.used_by.length && !(item.used_by.length >= 3 && item.used_by.includes('rbc'))
    ? `<span class="used-by">Used by: ${item.used_by.map(m => esc(SHORT[m] || m)).join(', ')}</span>` : '');
  /* Literature and roles under the source text of a row (W42, W44). */
  const literature = item => {
    const lit = (item.literature || []).map(e => `${esc(e.paper)}: ${esc(fv(e.value))}${e.freq && e.freq !== '-' ? ` (${e.freq === 'A' ? 'annual' : 'quarterly'})` : ''}, ${esc(HOW[e.how_set] || e.how_set)}${e.where ? `, ${esc(e.where)}` : ''}`);
    const roles = Object.entries(item.roles || {}).map(([m, r]) => `${esc(SHORT[m] || m)}: ${esc(ROLE[r.role] || r.role)}${r.weight != null ? ` (weight ${esc(r.weight)})` : ''}`);
    return (lit.length ? ` <span class="source-note literature-note">In the literature: ${lit.join('; ')}. <a class="text-link" href="#lit-${esc(item.id)}">Compare</a>.</span>` : '')
      + (roles.length ? ` <span class="source-note">Role: ${roles.join('; ')}.</span>` : '');
  };
  /* Row anchors (calibration.html#kappa_bds): targets and implied rows by id,
     parameters as param-<id> (some implied ids repeat parameter ids). */
  const rowId = (prefix, id) => `id="${esc(prefix + id)}"`;

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
    const rows = groupRows(items, 5, p => `<tr ${rowId('param-', p.id)}>
      <th scope="row">${esc(p.name)}</th>
      <td class="symbol-cell">\\(${p.symbol}\\)</td>
      <td>${fmt(p.value, p.digits ?? 3)}</td>
      <td>${tags(p.models)}</td>
      <td class="source-cell">${esc(p.source)}${literature(p)}</td></tr>`);
    setHTML(role('parameters'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table calibration-page-table">
      <caption class="visually-hidden">Parameters</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`);
  }

  function modelValue(target) {
    const specs = MODEL_VALUE[target.id] || [];
    const values = state.payload.model_values || {};
    const out = specs.map(([model, key, scale]) => {
      const v = values[model] && values[model][key];
      return v == null ? null : `${fmt(v * scale, target.digits ?? 2)}<br><span class="unit-label">(${esc(SHORT[model])})</span>`;
    }).filter(Boolean);
    return out.length ? out.join('<br><span class="model-value-gap"></span>') : '–';
  }

  function renderTargets() {
    const items = state.payload.targets.filter(shown);
    if (!items.length) { role('targets').innerHTML = '<p class="empty-message">No data targets for this model yet.</p>'; return; }
    const pc = state.measure === 'pc';
    const head = `<tr><th scope="col" class="component-head">Target</th><th scope="col">Symbol</th><th scope="col">US data<br><span class="unit-label">(sample)</span></th><th scope="col">Model</th><th scope="col">Models</th><th scope="col" class="source-col">Definition and source</th></tr>`;
    const rows = groupRows(items, 6, t => {
      const value = pc && t.value_pc != null ? t.value_pc : t.value;
      const marker = t.value_pc != null ? ` <span class="unit-label">(${pc ? 'per capita' : 'total'})</span>` : '';
      return `<tr ${rowId('', t.id)}>
        <th scope="row">${esc(t.name)}${usedBy(t)}</th>
        <td class="symbol-cell">\\(${t.symbol}\\)</td>
        <td>${fmt(value, t.digits ?? 2)}${marker}${t.sample ? `<br><span class="unit-label">${esc(t.sample)}</span>` : ''}</td>
        <td>${modelValue(t)}</td>
        <td>${tags(t.models)}</td>
        <td class="source-cell">${esc(t.definition)} <span class="source-note">Source: ${esc(t.source)}.</span>${t.note ? ` <span class="source-note">${esc(t.note)}</span>` : ''}${literature(t)}</td></tr>`;
    });
    setHTML(role('targets'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table calibration-page-table targets-table">
      <caption class="visually-hidden">Data targets</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>
      <p class="table-note">Growth rates and returns in percent a year; shares as fractions of output. Model values: the steady state of the model page with its baseline calibration (Hicks-neutral technology, measured TFP).</p>`);
  }

  function renderImplied() {
    /* Rows without "models" belong to the RBC family; κ rows to the
       stock-market-dynamics model. */
    const section = role('implied').closest('section');
    const byBasis0 = Array.isArray(state.payload.implied) ? { gy: state.payload.implied } : state.payload.implied;
    const rowModels = i => i.models || ['rbc', 'lag', 'stock'];
    const keep = i => state.model === 'all' || rowModels(i).includes(state.model);
    const any = Object.values(byBasis0).some(list => list.some(keep));
    section.hidden = !any;
    if (!any) return;
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
    const rows = byBasis[basis].filter(keep).map(i => `<tr ${rowId('', i.id)}>
      <th scope="row">${esc(i.name)}${usedBy(i)}</th>
      <td class="symbol-cell">\\(${i.formula}\\)</td>
      <td>${fmt(i.value, i.digits ?? 3)}${i.valid === false ? '<br><span class="unit-label">outside \\(s < \\kappa < 1\\)</span>' : ''}</td>
      <td>${calibrated[i.id] ? fmt(calibrated[i.id].value, i.digits ?? 3) : '–'}</td></tr>`).join('');
    setHTML(role('implied'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Parameters implied by the targets</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>
      <p class="table-note">Trend growth \\(g_X\\): ${info ? `${esc(info.text)}, ${fmt(info.annual, 2)} percent a year` : 'per-capita output growth'}. Quarterly rates: \\(r\\) and \\(g_X\\) are the annual rates divided by 400, \\(I/Y\\) the investment share and \\(K/Y\\) the capital–output ratio (all private fixed assets) times four. The implied capital share uses the real stock return; \\(\\theta\\) and the implied \\(\\delta\\) are for the RBC models without firm exit.${byBasis[basis].some(i => i.models && keep(i)) ? ' Relative cohort value \\(\\kappa\\) and relative firm value \\(m\\) (stock-market dynamics): \\(s\\) is the quarterly survival rate of firms, \\(\\varepsilon = I_0/p^A\\) the value of entrants over market value per quarter (each measure in the targets), \\(d/p^A\\) the quarterly dividend yield, \\(\\beta\\) that of the RBC models; see the ribbon on stock-market dynamics.' : ''}</p>`);
  }

  /* Literature view (W43): every value by row, across papers. */
  function renderLiterature() {
    const box = role('literature');
    if (!box) return;
    const p = state.payload;
    const rows = [...p.parameters.map(r => ({ ...r, kind: 'Parameter' })), ...p.targets.map(r => ({ ...r, kind: 'Target' })),
      ...(Array.isArray(p.implied) ? p.implied : Object.values(p.implied)[0] || []).map(r => ({ ...r, kind: 'Implied' }))]
      .filter(r => (r.literature || []).length);
    const section = box.closest('section');
    section.hidden = !rows.length;
    if (!rows.length) return;
    const filters = role('literature-filters');
    if (filters && !filters.dataset.built) {
      const types = Array.from(new Set(rows.flatMap(r => r.literature.map(e => e.model_type)))).sort();
      filters.innerHTML = `<label>Model type <select data-filter="type"><option value="all">All</option>${types.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select></label>
        <label>Frequency <select data-filter="freq"><option value="all">All</option><option value="Q">Quarterly</option><option value="A">Annual</option></select></label>`;
      filters.querySelectorAll('select').forEach(sel => sel.addEventListener('change', () => { litState[sel.dataset.filter] = sel.value; renderLiterature(); }));
      filters.dataset.built = '1';
    }
    const keep = e => (litState.type === 'all' || e.model_type === litState.type) && (litState.freq === 'all' || e.freq === litState.freq || e.freq === '-');
    const head = '<tr><th scope="col" class="component-head">Paper and model</th><th scope="col">Country, frequency</th><th scope="col">Value</th><th scope="col">How set</th><th scope="col" class="source-col">Moment, context and differences</th></tr>';
    const body_ = rows.map(r => {
      const entries = r.literature.filter(keep);
      if (!entries.length) return '';
      const title = `${esc(r.name)}${r.symbol ? ` \\(${r.symbol}\\)` : ''}`;
      return `<tr class="table-group" id="lit-${esc(r.id)}"><th scope="rowgroup" colspan="5">${title} <span class="unit-label">${esc(r.kind)} · site: ${fmt(r.value, r.digits ?? 4)}</span></th></tr>`
        + entries.map(e => `<tr><th scope="row">${esc(e.paper)}<br><span class="unit-label">${esc(e.model_type)}</span>${e.checked_against_paper ? '' : '<br><span class="unit-label">to check in the paper</span>'}</th>
          <td>${esc(e.country)}${e.freq === 'A' ? ', annual' : e.freq === 'Q' ? ', quarterly' : ''}${e.sample ? `<br><span class="unit-label">${esc(e.sample)}</span>` : ''}</td>
          <td>${fv(e.value)}${e.value_site_units != null ? `<br><span class="unit-label">${fmt(e.value_site_units, 4)} in the site’s units</span>` : ''}</td>
          <td>${esc(HOW[e.how_set] || e.how_set)}${e.where ? `<br><span class="unit-label">${esc(e.where)}</span>` : ''}</td>
          <td class="source-cell">${esc(e.moment)}${e.context ? `; ${esc(e.context)}` : ''}.${e.note_on_differences ? ` <span class="source-note">${esc(e.note_on_differences)}</span>` : ''}</td></tr>`).join('');
    }).join('');
    const papers = (p.papers || []).map(x => `<li>${esc(x.cite)}</li>`).join('');
    setHTML(box, `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table calibration-page-table literature-table">
      <caption class="visually-hidden">Values in the literature</caption><thead>${head}</thead><tbody>${body_ || '<tr><td colspan="5">No value for this selection.</td></tr>'}</tbody></table></div>
      <p class="table-note">Values in each paper’s own units and frequency. “To check in the paper”: transcribed from a calibration brief, not yet checked against the paper itself.</p>
      <ul class="reference-list">${papers}</ul>`);
  }

  function render() {
    renderParameters();
    renderTargets();
    renderImplied();
    renderLiterature();
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
      /* A link to a row (#kappa_bds): the rows exist only now. */
      const hashTarget = window.location.hash && document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (hashTarget && hashTarget.tagName === 'TR') { hashTarget.classList.add('is-target'); hashTarget.scrollIntoView({ block: 'center' }); }
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
