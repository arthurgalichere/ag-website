/* Last edited: 2026-11-27 14:10 UTC (Claude, economics chat) */
/* =========================================================
   business-dynamics.js: /economics/business-dynamics.html
   Renders business-dynamics.json (built by the private
   business_dynamics.py): annual series of the Census Bureau's Business
   Dynamics Statistics and quarterly series of the BLS Business Employment
   Dynamics, as chart cards (data-block: annual | quarterly; data-keys;
   data-cycles: HP cycles drawn with the cycle of real GDP), the size-class
   table, the statistics for calibration, the value of entrants
   (entry_value: data-table="entry-value"), the statistics of each series
   and their cycle statistics. Charts are drawn when they come into view.
   Uses AGDashboards (dashboards.js) and AGSite (site.js).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  /* Also drives Investor Sentiment and Equity Issuance (same payload layout:
     blocks annual and/or quarterly, variables, recessions, downloads, and a
     targets table), and Bank Rates, Returns and Leverage (banks-credit.json:
     reference lines, the bbr targets on several samples and their checks). */
  const body = document.querySelector('[data-dashboard="business-dynamics"], [data-dashboard="investor-sentiment"], [data-dashboard="banks-credit"]');
  if (!body || !D || !S) return;

  const COLOURS = ['--chart-1', '--series-1', '--series-2', '--series-4'];
  const BENCHMARK_DASH = '8 4 0.1 4';
  const GDP = { annual: 'gdp_a', quarterly: 'gdp_q' };
  const state = { payload: null, charts: new Map() };
  const cards = Array.from(body.querySelectorAll('.chart-card[data-keys]'));
  const esc = text => S.escapeHTML(String(text == null ? '' : text));
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (v, d = 2) => (v == null || !Number.isFinite(Number(v)) ? '–' : D.formatNumber(Number(v), d));
  const variable = key => state.payload.variables[key] || { label: key, units: '', digits: 2 };
  const label = key => variable(key).label;

  function setHTML(element, html) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  /* Chart cards ------------------------------------------- */

  function renderCard(card) {
    const role = name => card.querySelector(`[data-role="${name}"]`);
    const block = state.payload[card.dataset.block];
    if (!block) return;
    const annual = card.dataset.block === 'annual';
    const cycles = card.dataset.cycles === 'true';
    const keys = card.dataset.keys.split(',').map(k => k.trim()).filter(k => (cycles ? block.cycles : block.values)[k]);
    const source = cycles ? block.cycles : block.values;
    /* Reference lines (variables flagged reference: a constant or a sample
       mean): dashed, in the colour of the series they refer to (ref_of) or
       the benchmark colour; not counted in the colours or the trimming. */
    const isRef = key => !cycles && variable(key).reference;
    const data = keys.filter(k => !isRef(k));
    const colourOf = key => token(data.length === 1 ? '--chart-1' : COLOURS[data.indexOf(key) % COLOURS.length]);
    const series = keys.map(key => (isRef(key)
      ? { label: label(key), reference: true, dash: BENCHMARK_DASH, under: true, values: source[key],
        color: variable(key).ref_of && data.includes(variable(key).ref_of) ? colourOf(variable(key).ref_of) : token('--chart-reference') }
      : { label: label(key), color: colourOf(key), values: source[key] }));
    if (cycles && source[GDP[card.dataset.block]]) {
      series.push({ label: 'Real GDP', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true,
        values: source[GDP[card.dataset.block]] });
    }
    /* Trim leading and trailing periods without any value. */
    const has = i => series.some(s => !s.reference && s.values[i] != null);
    let first = 0;
    let last = block.dates.length - 1;
    while (first < last && !has(first)) first += 1;
    while (last > first && !has(last)) last -= 1;
    const dates = block.dates.slice(first, last + 1);
    series.forEach(s => { s.values = s.values.slice(first, last + 1); });

    const periodLabel = annual ? D.yearLabel : D.quarterLabel;
    const units = cycles
      ? 'Cycles: percentage points (rates), percent (counts, GDP)'
      : Array.from(new Set(keys.filter(k => !isRef(k)).map(k => variable(k).units))).join('; ');
    role('chart-subtitle').textContent = `${units} · ${annual ? 'annual' : 'quarterly'} · ${periodLabel(dates[0])}–${periodLabel(dates[dates.length - 1])}`;

    const prev = state.charts.get(card);
    if (prev) prev.destroy();
    role('chart-status').hidden = true;
    role('chart-frame').hidden = false;
    state.charts.set(card, D.lineChart(role('chart-frame'), {
      dates,
      series,
      period: annual ? 1 : 0.25,
      recessions: state.payload.recessions ? state.payload.recessions.intervals : [],
      zeroLine: card.dataset.zeroLine === 'true',
      digits: Math.min(...keys.map(k => variable(k).digits ?? 2), 2),
      readout: role('chart-readout'),
      label: `${card.querySelector('.chart-title').textContent}${cycles ? ', cyclical components' : ''}, with recessions shaded`,
    }));

    const swatch = item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;
    role('chart-legend').innerHTML = series.map(swatch).join('');
    role('chart-legend').hidden = false;
    role('chart-readout').textContent = `Hover over the chart, or focus it and use the arrow keys, to read values by ${annual ? 'year' : 'quarter'}.`;
    const sources = Array.from(new Set([...keys, ...(cycles ? [GDP[card.dataset.block]] : [])].map(k => variable(k).source)));
    role('chart-source').textContent = `Source: ${sources.join('; ')}.${cycles ? ' Cycles: author’s calculations.' : ''}`;
  }

  /* Tables ------------------------------------------------- */

  const table = (caption, head, rows, extra = '') => `<div class="table-scroll"><table class="data-table shares-table bc-table ${extra}">
    <caption class="visually-hidden">${esc(caption)}</caption><thead>${head}</thead><tbody>${rows}</tbody></table></div>`;

  function renderSize() {
    const target = body.querySelector('[data-table="size"]');
    const rows = state.payload.annual && state.payload.annual.size_table;
    if (!target || !rows) return;
    const head = `<tr><th scope="col" class="component-head">Firm size</th><th scope="col">Share of firms<br><span class="unit-label">(%)</span></th>
      <th scope="col">Share of employment<br><span class="unit-label">(%)</span></th><th scope="col">Job creation rate<br><span class="unit-label">(%)</span></th>
      <th scope="col">Job destruction rate<br><span class="unit-label">(%)</span></th><th scope="col">Net job creation rate<br><span class="unit-label">(%)</span></th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.firms, 1)}<br><span class="unit-label">latest ${fmt(r.firms_latest, 1)}</span></td>
      <td>${fmt(r.emp, 1)}<br><span class="unit-label">latest ${fmt(r.emp_latest, 1)}</span></td><td>${fmt(r.jc)}</td><td>${fmt(r.jd)}</td><td>${fmt(r.net_jc)}</td></tr>`).join('');
    target.innerHTML = table('Firm size classes', head, body_)
      + '<p class="table-note">Averages of the annual values over the whole sample; “latest”: the last year.</p>';
  }

  function renderCalibration() {
    const target = body.querySelector('[data-table="calibration"]');
    const rows = state.payload.calibration || [];
    if (!target) return;
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Mean<br><span class="unit-label">(% per period)</span></th>
      <th scope="col">Per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Per year<br><span class="unit-label">(%)</span></th>
      <th scope="col">Sample</th><th scope="col" class="source-col">Note</th></tr>`;
    const body_ = rows.map(r => {
      const q = r.freq === 'Q' ? r.mean : r.quarterly;
      const a = r.freq === 'A' ? r.mean : r.annual;
      return `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${r.freq === 'A' ? 'annual, BDS' : 'quarterly, BED'}</span></th>
        <td>${fmt(r.mean)}</td><td>${fmt(q)}</td><td>${fmt(a)}</td><td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`;
    }).join('');
    setHTML(target, table('Statistics for calibration', head, body_, 'calibration-page-table')
      + '<p class="table-note">Per quarter and per year: the mean converted with \\(1-(1-s)^{1/4}\\) or \\(1-(1-s)^{4}\\) for probabilities of entry and exit; job flows are not converted.</p>');
  }

  function renderStats(name) {
    const target = body.querySelector(`[data-table="stats-${name}"]`);
    const block = state.payload[name];
    if (!target || !block) return;
    const growth = block.stats.some(r => r.growth_mean != null);
    const head = `<tr><th scope="col" class="component-head">Series</th><th scope="col">Mean</th><th scope="col">Standard deviation</th>
      <th scope="col">Minimum</th><th scope="col">Maximum</th><th scope="col">Last 10 years</th><th scope="col">Latest</th>
      ${growth ? '<th scope="col">Growth rate<br><span class="unit-label">(% a year, mean)</span></th>' : ''}</tr>`;
    const body_ = block.stats.map(r => {
      const d = variable(r.key).digits ?? 2;
      return `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${esc(variable(r.key).units)}, ${esc(r.start)}–${esc(r.end)}</span></th>
        <td>${fmt(r.mean, d)}</td><td>${fmt(r.sd, d)}</td>
        <td>${fmt(r.min, d)}<br><span class="unit-label">${esc(r.min_period)}</span></td><td>${fmt(r.max, d)}<br><span class="unit-label">${esc(r.max_period)}</span></td>
        <td>${fmt(r.mean_10, d)}</td><td>${fmt(r.latest, d)}<br><span class="unit-label">${esc(r.latest_period)}</span></td>
        ${growth ? `<td>${r.growth_mean == null ? '' : fmt(r.growth_mean)}</td>` : ''}</tr>`;
    }).join('');
    target.innerHTML = table(`Statistics of the ${name} series`, head, body_);
  }

  function lagText(k, unit) {
    if (k == null) return '–';
    if (k === 0) return 'coincident';
    return k < 0 ? `leads by ${-k} ${unit}` : `lags by ${k} ${unit}`;
  }

  function renderCycleStats(name) {
    const target = body.querySelector(`[data-table="cycles-${name}"]`);
    const block = state.payload[name];
    if (!target || !block) return;
    const { lags, rows } = block.cycle_stats;
    const unit = name === 'annual' ? 'year' : 'quarter';
    const unitPl = k => (Math.abs(k) === 1 ? unit : `${unit}s`);
    const head = `<tr><th scope="col" rowspan="2" class="component-head">Series x</th><th scope="col" rowspan="2">Standard deviation</th>
      <th scope="col" rowspan="2">Relative to GDP</th><th scope="col" rowspan="2">Autocorrelation</th>
      <th scope="colgroup" colspan="${lags.length}">Correlation of \\(x_{t+k}\\) with real GDP \\(y_t\\)</th><th scope="col" rowspan="2">Peak</th></tr>
      <tr>${lags.map(k => `<th scope="col">\\(k = ${k > 0 ? '+' : ''}${k}\\)</th>`).join('')}</tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(label(r.key))}<br><span class="unit-label">${esc(r.start)}–${esc(r.end)}</span></th>
      <td>${fmt(r.sd)}</td><td>${r.rel_sd == null ? '–' : fmt(r.rel_sd)}</td><td>${fmt(r.ar1)}</td>
      ${r.corr.map((v, i) => `<td${lags[i] === r.peak_lag ? ' class="is-peak"' : ''}>${fmt(v)}</td>`).join('')}
      <td class="peak-lag">${lagText(r.peak_lag, unitPl(r.peak_lag || 0))}</td></tr>`).join('');
    setHTML(target, table(`Cycle statistics, ${name}`, head, body_, 'cross-table')
      + `<p class="table-note">Hodrick–Prescott filter, λ = ${D.formatNumber(block.cycle_stats.lambda, name === 'annual' ? 2 : 0)}. Standard deviations in percentage points for rates and in percent for counts; relative standard deviations for counts and employment only.</p>`);
  }

  function renderSurvival() {
    const surv = state.payload.survival || {};
    const steadyEl = body.querySelector('[data-table="survival-steady"]');
    const dynEl = body.querySelector('[data-table="survival-dynamics"]');
    if (steadyEl && surv.steady) {
      const head = `<tr><th scope="col" class="component-head">Unit and source</th><th scope="col">Survival per quarter<br><span class="unit-label">\\(s\\) (%)</span></th>
        <th scope="col">Exit per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Exit per year<br><span class="unit-label">(%)</span></th>
        <th scope="col">Sample</th><th scope="col" class="source-col">Definition</th></tr>`;
      const rows = surv.steady.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.survival_q, 3)}</td><td>${fmt(r.exit_q, 3)}</td>
        <td>${fmt(r.exit_annual)}</td><td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`).join('');
      setHTML(steadyEl, table('Steady-state survival rate', head, rows, 'calibration-page-table'));
    }
    if (dynEl && surv.dynamics) {
      const head = `<tr><th scope="col" class="component-head">Method</th><th scope="col">Persistence<br><span class="unit-label">\\(\\rho_s\\), quarterly</span></th>
        <th scope="col">Shock s.d.<br><span class="unit-label">\\(\\sigma_s\\), quarterly</span></th><th scope="col">Annual AR(1)<br><span class="unit-label">\\(\\rho\\), \\(\\sigma\\)</span></th>
        <th scope="col">Sample</th><th scope="col" class="source-col">Notes</th></tr>`;
      const tag = r => (r.recommended ? '<br><span class="unit-label">default (HP filter)</span>' : r.alternative ? '<br><span class="unit-label">alternative</span>' : '');
      const rows = surv.dynamics.map(r => `<tr${r.recommended ? ' class="baseline-row"' : ''}><th scope="row">${esc(r.key)}. ${esc(r.label)}${tag(r)}</th>
        <td>${fmt(r.rho, 3)}</td><td>${fmt(r.sigma, 3)}<br><span class="unit-label">${esc(r.units)}</span></td>
        <td>${r.rho_annual == null ? '–' : `${fmt(r.rho_annual, 3)}, ${fmt(r.sigma_annual, 3)}`}</td><td>${esc(r.sample)}</td>
        <td class="source-cell">${esc(r.note)}${r.flag ? ' The annual autocorrelation is not positive: ρ is set to 0.' : ''}</td></tr>`).join('');
      setHTML(dynEl, table('Dynamics of survival', head, rows, 'calibration-page-table')
        + '<p class="table-note">Standard deviations in percent of the survival rate (log points × 100), except C, in percentage points as in the previous approach (almost the same, since s is close to 1).</p>');
    }
  }

  /* Value of entrants (eps = I_0/p^A): per year, per quarter (converted
     year by year), subperiods, sample, formula, note, data key. */
  function renderEntry() {
    const target = body.querySelector('[data-table="entry-value"]');
    const rows = state.payload.entry_value;
    if (!target) return;
    if (!rows || !rows.length) { target.innerHTML = '<p class="empty-message">Not available yet.</p>'; return; }
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Per year<br><span class="unit-label">(% or ratio)</span></th>
      <th scope="col">Per quarter<br><span class="unit-label">(%)</span></th><th scope="col">Subperiods<br><span class="unit-label">(per quarter, %)</span></th>
      <th scope="col">Sample</th><th scope="col" class="source-col">Method and note</th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}${r.symbol ? `<br><span class="unit-label">\\(${r.symbol}\\)</span>` : ''}<br><span class="unit-label">data: ${esc(r.data_key)}</span></th>
      <td>${fmt(r.annual, r.digits ?? 3)}</td><td>${r.quarterly == null ? '–' : fmt(r.quarterly, 3)}</td>
      <td>${(r.subperiods || []).map(x => `${fmt(x.quarterly, 3)} <span class="unit-label">(${esc(x.sample)})</span>`).join('<br>') || '–'}</td>
      <td>${esc(r.sample)}</td><td class="source-cell">${esc(r.formula)}. ${esc(r.note)}</td></tr>`).join('');
    setHTML(target, table('Value of entrants', head, body_, 'calibration-page-table')
      + '<p class="table-note">Rates per quarter: \\(1-(1-x)^{1/4}\\) for each year’s rate \\(x\\), then averaged; ratios of nominal values.</p>');
  }

  /* Calibration targets: label, value, units, sample, note. */
  function renderTargets() {
    const target = body.querySelector('[data-table="targets"]');
    const rows = state.payload.targets;
    if (!target || !rows) return;
    const head = `<tr><th scope="col" class="component-head">Statistic</th><th scope="col">Value</th><th scope="col">Sample</th><th scope="col" class="source-col">Note</th></tr>`;
    const body_ = rows.map(r => `<tr><th scope="row">${esc(r.label)}</th><td>${fmt(r.value, r.digits ?? 2)}${r.units ? `<br><span class="unit-label">${esc(r.units)}</span>` : ''}</td>
      <td>${esc(r.sample)}</td><td class="source-cell">${esc(r.note)}</td></tr>`).join('');
    target.innerHTML = table('Statistics for calibration', head, body_, 'calibration-page-table');
  }

  /* bbr: targets on several samples (banks-credit.json, bbr_targets). */
  const ROLE = { targeted: 'targeted', check: 'check', reported: 'reported', input: 'input', external: 'external target' };
  function renderBbr() {
    const target = body.querySelector('[data-table="bbr-targets"]');
    const t = state.payload.bbr_targets;
    if (!target || !t) return;
    const samples = t.samples;
    const sampleHead = s => (s.id === 'replication' ? '1959–2012<br><span class="unit-label">replication</span>'
      : s.id === 'full' ? 'Full sample<br><span class="unit-label">default</span>' : esc(s.id));
    const digits = r => (r.unit_code === 'ratio' ? 3 : 2);
    const cell = (r, s) => {
      const v = r.samples && r.samples[s.id];
      if (!v) return '<td>–</td>';
      return `<td>${fmt(v.value, digits(r))}${v.gross != null ? `<br><span class="unit-label">gross ${fmt(v.gross, 4)}</span>` : ''}<br><span class="unit-label">${esc(v.first)}–${esc(v.last)}</span></td>`;
    };
    const head = `<tr><th scope="col" class="component-head">Target</th><th scope="col">Aoki–Nikolov<br><span class="unit-label">Table 1</span></th>
      ${samples.map(s => `<th scope="col">${sampleHead(s)}</th>`).join('')}<th scope="col" class="source-col">Method</th></tr>`;
    const unit = r => ({ pct_y: '% a year', pp_y: 'pp a year', ratio: 'ratio' }[r.unit_code] || '');
    const rows = t.rows.map(r => `<tr id="bbr-${esc(r.id)}"${r.role === 'targeted' ? ' class="is-target"' : ''}><th scope="row">${esc(r.name).replace(/R\^([dl])/g, '\\(R^$1\\)')}<br><span class="unit-label">${esc(unit(r))}, ${r.freq === 'A' ? 'annual' : 'quarterly'} · ${esc(ROLE[r.role] || r.role)} · ${esc(r.id)}</span></th>
      <td>${r.an_value == null ? '–' : fmt(r.an_value, digits(r))}${r.an_gross != null ? `<br><span class="unit-label">gross ${fmt(r.an_gross, 3)}</span>` : ''}</td>
      ${samples.map(s => cell(r, s)).join('')}<td class="source-cell">${esc(r.method)}.${r.note ? ` ${esc(r.note)}` : ''}</td></tr>`).join('');
    const inputs = (t.inputs || []).map(r => `<tr><th scope="row">${esc(r.name)}<br><span class="unit-label">% a year · input</span></th><td>–</td>
      ${samples.map(s => cell({ ...r, unit_code: 'pct', samples: r.samples }, s)).join('')}<td class="source-cell">sample mean of the quarterly values</td></tr>`).join('');
    target.innerHTML = table('Calibration targets of bbr on several samples', head, rows + inputs, 'calibration-page-table bbr-table')
      + '<p class="table-note">Means of the quarterly values (annual FDIC ratios: means of the years) over each sample; below each value, the first and last period actually used. Gross form: \\(1 + x/100\\), as in Aoki and Nikolov. Highlighted rows: targeted in the calibration of bbr (decided 27 November 2026); ROE is a check.</p>';
    const MJ = window.MathJax;
    if (MJ && MJ.typesetPromise) MJ.typesetPromise([target]).catch(() => {});

    const dep = body.querySelector('[data-table="deposit-overlap"]');
    const o = state.payload.deposit_overlap;
    if (dep && o) {
      dep.innerHTML = `<p class="table-note">Overlap ${esc(o.first)}–${esc(o.last)} (${o.n} quarters): mean M2 own rate ${fmt(o.mean_m2own)}%, mean FDIC deposit cost ${fmt(o.mean_fdic)}%; mean gap (FDIC − M2 own rate) ${fmt(o.mean_gap)} pp, standard deviation ${fmt(o.sd_gap)} pp; correlation ${fmt(o.corr, 3)}.</p>`;
    }
    const cons = body.querySelector('[data-table="consistency"]');
    const c = state.payload.consistency;
    if (cons && c) {
      const h = `<tr><th scope="col" class="component-head">Data</th><th scope="col">Loan rate<br><span class="unit-label">\\(R^l\\), gross</span></th>
        <th scope="col">Deposit rate<br><span class="unit-label">\\(R^d\\), gross</span></th><th scope="col">Leverage<br><span class="unit-label">\\(D/N\\)</span></th>
        <th scope="col">ROE<br><span class="unit-label">gross</span></th><th scope="col">Lower bound of ROE<br><span class="unit-label">\\(\\gamma = 1\\)</span></th>
        <th scope="col">Implied<br><span class="unit-label">\\(\\gamma\\)</span></th><th scope="col">Consistent</th></tr>`;
      const b = c.map(x => `<tr><th scope="row">${esc(x.case)}<br><span class="unit-label">${esc(x.roe_concept)}</span></th><td>${fmt(x.R_l, 4)}</td><td>${fmt(x.R_d, 4)}</td>
        <td>${fmt(x.D_N, 2)}</td><td>${fmt(x.ROE, 4)}</td><td>${fmt(x.roe_floor, 4)}</td><td>${x.gamma_implied == null ? '–' : fmt(x.gamma_implied, 2)}</td><td>${x.holds ? 'yes' : 'no'}</td></tr>`).join('');
      setHTML(cons, table('Consistency of the bank targets', h, b, 'calibration-page-table'));
    }
    const brk = body.querySelector('[data-table="h8-breaks"]');
    const k = state.payload.h8_breaks;
    if (brk && k) {
      brk.innerHTML = k.length
        ? `<p class="table-note">Quarters in which H.8 leverage moves by more than 15 percent: ${k.map(x => `${esc(x.quarter)} (${fmt(x.change_pct, 1)}%, ${fmt(x.level_before, 1)} → ${fmt(x.level, 1)}${x.note ? `; ${esc(x.note)}` : ''})`).join('; ')}.</p>`
        : '<p class="table-note">No quarter-to-quarter change of H.8 leverage above 15 percent.</p>';
    }
  }

  /* bbr, π stage 1: crisis frequencies (banks-credit.json, crisis_frequency). */
  function renderCrises() {
    const target = body.querySelector('[data-table="crises"]');
    const c = state.payload.crisis_frequency;
    if (!target) return;
    if (!c || !c.rows || !c.rows.length) { target.innerHTML = '<p class="empty-message">Not available yet.</p>'; return; }
    const head = `<tr><th scope="col" class="component-head">Source and scope</th><th scope="col">Sample</th><th scope="col">Crises</th>
      <th scope="col">Years</th><th scope="col">Frequency<br><span class="unit-label">per year</span></th>
      <th scope="col">1 − frequency<br><span class="unit-label">implied \\(\\pi\\)</span></th><th scope="col">Years per crisis</th></tr>`;
    const rows = c.rows.map(r => `<tr><th scope="row">${esc(r.source)}<br><span class="unit-label">${esc(r.scope)}</span></th><td>${esc(r.sample)}</td>
      <td>${r.crises}</td><td>${r.years == null ? '–' : r.years}</td><td>${r.frequency == null ? '–' : fmt(r.frequency, 4)}</td>
      <td>${r.pi_implied == null ? '–' : fmt(r.pi_implied, 3)}</td><td>${r.years_per_crisis == null ? '–' : fmt(r.years_per_crisis, 1)}</td></tr>`).join('');
    const us = Object.entries(c.us_crises || {}).map(([k, v]) => `${esc(k)}: ${v.map(esc).join(', ')}`).join('; ');
    setHTML(target, table('Frequency of systemic crises', head, rows, 'calibration-page-table')
      + `<p class="table-note">Crises started over years observed; 1 − frequency is the probability that no crisis starts in a year, the counterpart of the bubble’s survival probability \\(\\pi\\) if every burst were a systemic crisis. US crisis start years — ${us}.</p>`);
  }

  function renderTables() {
    renderTargets();
    renderBbr();
    renderCrises();
    renderEntry();
    renderSize();
    renderCalibration();
    renderSurvival();
    renderStats('annual');
    renderStats('quarterly');
    renderCycleStats('annual');
    renderCycleStats('quarterly');
  }

  /* Page ---------------------------------------------------- */

  function updatePage() {
    const p = state.payload;
    const links = p.downloads || {};
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    const downloads = body.querySelector('[data-role="downloads"]');
    if (downloads) downloads.hidden = false;
    const note = body.querySelector('[data-role="update-note"]');
    if (note && p.generated_at_utc) {
      note.textContent = `Data updated on ${new Date(p.generated_at_utc).toLocaleDateString('en-GB')}`;
      note.hidden = false;
    }
    const vintage = body.querySelector('[data-role="bds-vintage"]');
    if (vintage && p.annual) vintage.textContent = `the ${p.annual.vintage} vintage (1978–${p.annual.dates[p.annual.dates.length - 1].slice(0, 4)})`;
    const bds = body.querySelector('[data-role="bds-note"]');
    if (bds && p.annual) {
      const y = Number(p.annual.dates[p.annual.dates.length - 1].slice(0, 4));
      bds.textContent = `Annual data (Business Dynamics Statistics, ${p.annual.vintage} release): a year runs from March of the previous year to March (employment on 12 March), so ${y} is March ${y - 1} to March ${y}.`;
    }
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !state.payload) return;
        renderCard(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' })
    : null;

  async function load() {
    const status = body.querySelector('[data-role="page-status"]');
    try {
      const response = await S.fetchFresh(body.dataset.dataUrl.replace('{country}', 'us'));
      state.payload = await response.json();
      if (!state.payload || !(state.payload.annual || state.payload.quarterly)) throw new Error('The data file does not contain the expected series.');
      status.hidden = true;
      updatePage();
      renderTables();
      cards.forEach(card => {
        if (observer) observer.observe(card);
        else renderCard(card);
      });
    } catch (error) {
      status.hidden = false;
      status.className = 'render-error';
      status.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
    } finally {
      S.releaseReveal();
    }
  }

  /* Links that open and scroll to a ribbon. */
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    const target = link && document.getElementById(link.getAttribute('href').slice(1));
    if (!target || target.tagName !== 'DETAILS') return;
    event.preventDefault();
    target.open = true;
    target.scrollIntoView({ block: 'start' });
  });

  load();
})();
