/* Last edited: 2026-11-15 20:48 UTC (Claude, economics chat) */
/* =========================================================
   financial-indicators.js: the four Financial and Credit
   Indicators subpages (stock market, debt and leverage, banks
   and credit supply, financial conditions and stress).
   Loads the page's generated JSON (data-data-url) and draws:
     levels  cards with data-indicators (indicator keys), each at
             its own frequency (quarterly); optional data-dashed
             (keys drawn dashed), data-benchmark (a reference series,
             red dash-dot), variants (switch between indicator sets),
             data-zero-line, data-digits; a section can end with the
             growth-rate statistics table (data-role="growth-table");
     cycles  cards with data-vars (cycle keys), each against the
             cyclical component of output; page switch: filter
             (HP, Hamilton, Christiano–Fitzgerald); statistics and
             cross-correlation tables for the selected filter.
   Uses AGDashboards (dashboards.js) and AGSite (site.js).
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="financial"]');
  if (!body || !D || !S) return;

  const FILTERS = {
    hp: { label: 'HP', long: 'HP filter (λ = 1600)' },
    hamilton: { label: 'Hamilton', long: 'Hamilton filter (h = 8, p = 4)' },
    cf: { label: 'Christiano–Fitzgerald', long: 'Christiano–Fitzgerald filter (6–32 quarters)' },
  };
  /* One series: the site blue. Several series of equal importance:
     equal-weight colours. Output, the benchmark cycle: red, dash-dot. */
  const MULTI = ['--series-1', '--series-2', '--series-3', '--series-4'];
  const BENCHMARK_DASH = '8 4 0.1 4';
  const TREND_DASH = '6 4';

  const el = {
    downloads: body.querySelector('[data-role="downloads"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    pageStatus: body.querySelector('[data-role="page-status"]'),
    stats: body.querySelector('[data-role="stats-table"]'),
    cross: body.querySelector('[data-role="cross-table"]'),
    growth: body.querySelector('[data-role="growth-table"]'),
    estimates: body.querySelector('[data-role="estimates"]'),
    missing: body.querySelector('[data-role="missing-section"]'),
  };
  const levelCards = Array.from(body.querySelectorAll('figure.chart-card[data-indicators]'));
  const cycleCards = Array.from(body.querySelectorAll('figure.chart-card[data-vars]'));
  const state = { filter: 'hp', payload: null, charts: new Map(), visible: new Set() };

  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  /* Values that round to zero are shown as 0.00, not −0.00. */
  const fmt = (v, d = 2) => (v == null ? '–' : D.formatNumber(Math.abs(v) < 0.5 * 10 ** -d ? 0 : v, d));

  function untypeset(element) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
  }
  function typeset(element) {
    const MJ = window.MathJax;
    if (!MJ || !MJ.startup || !MJ.startup.promise) return;
    MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  const filterControl = D.segmented(body.querySelector('[data-control="filter"]'), value => {
    state.filter = value;
    cycleCards.forEach(card => { if (state.visible.has(card)) renderCycleCard(card); });
    renderTables();
  });
  levelCards.forEach(card => {
    const variant = card.querySelector('[data-control="variant"]');
    if (!variant) return;
    const control = D.segmented(variant, value => {
      const button = variant.querySelector(`[data-value="${value}"]`);
      card.dataset.indicators = button.dataset.set;
      if (state.visible.has(card)) renderLevelCard(card);
    });
    const first = variant.querySelector('button');
    card.dataset.indicators = first.dataset.set;
    control.select(first.dataset.value, false);
  });

  function parts(card) {
    const role = name => card.querySelector(`[data-role="${name}"]`);
    return {
      subtitle: role('chart-subtitle'), status: role('chart-status'), frame: role('chart-frame'),
      legend: role('chart-legend'), readout: role('chart-readout'), source: role('chart-source'),
    };
  }

  function swatch(item) {
    return `<li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
      <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
        stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`;
  }

  function draw(card, chartOptions, series, legendItems, sourceText) {
    const p = parts(card);
    const prev = state.charts.get(card);
    if (prev) prev.destroy();
    p.status.hidden = true;
    p.frame.hidden = false;
    state.charts.set(card, D.lineChart(p.frame, {
      ...chartOptions,
      series,
      recessions: state.payload.recessions ? state.payload.recessions.intervals : [],
      readout: p.readout,
    }));
    p.legend.innerHTML = legendItems.join('');
    p.legend.hidden = !legendItems.length;
    p.readout.textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';
    p.source.innerHTML = sourceText;
  }

  function empty(card, text) {
    const p = parts(card);
    p.frame.hidden = true;
    p.legend.hidden = true;
    p.status.hidden = false;
    p.status.className = 'empty-message';
    p.status.textContent = text;
  }

  /* Levels ------------------------------------------------- */

  /* Several indicators on one chart: align them on the union of their dates. */
  function align(indicators) {
    const dates = Array.from(new Set(indicators.flatMap(item => item.observations.date))).sort();
    const position = new Map(dates.map((date, i) => [date, i]));
    const pick = (item, field) => {
      const values = new Array(dates.length).fill(null);
      const source = item.observations[field] || [];
      item.observations.date.forEach((date, i) => { values[position.get(date)] = source[i] ?? null; });
      return values;
    };
    return { dates, pick };
  }

  function renderLevelCard(card) {
    /* data-benchmark: a reference series (e.g. real GDP growth) drawn last,
       red and dash-dot, as output is on the cycle charts. */
    const bench = card.dataset.benchmark || '';
    const ids = card.dataset.indicators.split(',').map(id => id.trim()).filter(id => id && id !== bench);
    const pairs = ids.concat(bench ? [bench] : [])
      .map(id => [id, state.payload.indicators[id]]).filter(([, item]) => item);
    if (!pairs.length || pairs.every(([id]) => id === bench)) { empty(card, 'No data are available for this chart.'); return; }
    const indicators = pairs.map(([, item]) => item);
    const dashed = new Set((card.dataset.dashed || '').split(',').map(x => x.trim()).filter(Boolean));
    let { dates, pick } = align(indicators);
    /* With a benchmark, start at the first date of the card's own series. */
    const own = pairs.filter(([id]) => id !== bench).map(([, item]) => item);
    const start = own.map(item => item.observations.date[0]).sort()[0];
    const offset = Math.max(0, dates.indexOf(start));
    if (offset) {
      const full = pick;
      dates = dates.slice(offset);
      pick = (item, field) => full(item, field).slice(offset);
    }
    const single = pairs.filter(([id]) => !dashed.has(id) && id !== bench).length === 1;
    let colour = 0;
    const series = pairs.map(([key, item]) => {
      const flags = pick(item, 'estimated');
      const isTrend = dashed.has(key);
      const isBench = key === bench;
      const color = isBench ? token('--chart-benchmark')
        : isTrend ? token('--chart-2') : token(single ? '--chart-1' : MULTI[colour++ % MULTI.length]);
      return {
        label: item.short_title,
        color,
        dash: isBench ? BENCHMARK_DASH : isTrend ? TREND_DASH : null,
        under: isBench,
        weight: bench && !isBench ? 1.1 : 1,
        values: pick(item, 'value'),
        marks: flags.map((flag, j) => (flag ? j : -1)).filter(j => j >= 0),
      };
    });
    const monthly = indicators.every(item => item.frequency === 'Monthly');
    const label = monthly ? D.monthLabel : D.quarterLabel;
    const first = indicators[0];
    const units = Array.from(new Set(indicators.map(item => item.units)));
    const freqText = Array.from(new Set(indicators.map(item => item.frequency.toLowerCase()))).join(' and ');
    parts(card).subtitle.textContent = `${units.join('; ')} · ${freqText} · ${label(dates[0])}–${label(dates[dates.length - 1])}`;
    const anyEstimate = series.some(item => item.marks.length);
    const legend = series.map(swatch)
      .concat(anyEstimate ? ['<li><span class="legend-estimate" aria-hidden="true"></span>Estimated value</li>'] : []);
    const sources = Array.from(new Set(indicators.map(item => item.source)));
    const updated = indicators.map(item => item.source_last_updated).filter(Boolean).sort().pop();
    const hasEstimates = indicators.some(item => (item.estimates || []).length);
    const sourceText = `Source: ${S.escapeHTML(sources.join('; '))}.`
      + (updated ? ` Source last updated ${S.escapeHTML(updated.slice(0, 10))}.` : '')
      + (hasEstimates ? '<br><span class="chart-missing">Missing data: see <a class="text-link" href="#missing-title">Missing data and estimates</a> at the bottom of the page.</span>' : '');
    draw(card, {
      dates,
      period: monthly ? 1 / 12 : 0.25,
      zeroLine: card.dataset.zeroLine === 'true' ? true : 'auto',
      digits: Number(card.dataset.digits || first.digits || 2),
      label: `${card.querySelector('.chart-title').textContent}, United States, ${label(dates[0])} to ${label(dates[dates.length - 1])}, with recessions shaded`,
    }, series, legend, sourceText);
  }

  /* Cycles ------------------------------------------------- */

  function renderCycleCard(card) {
    const cyc = state.payload.cycles;
    const vars = card.dataset.vars.split(',').map(x => x.trim()).filter(key => cyc.variables[key]);
    if (!vars.length) { empty(card, 'No data are available for this chart.'); return; }
    const values = key => cyc[state.filter][key] || [];
    const series = vars.map((key, i) => ({
      label: cyc.variables[key].label,
      color: token(vars.length === 1 ? '--chart-1' : MULTI[i % MULTI.length]),
      weight: 1.1,
      values: values(key),
    }));
    series.push({
      label: cyc.variables.y.label, color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: values('y'),
    });
    /* Start at the first quarter with a value of the card's variables. */
    const firstIndex = Math.max(0, Math.min(...vars.map(key => values(key).findIndex(v => v != null)).filter(i => i >= 0)));
    const dates = cyc.dates.slice(firstIndex);
    series.forEach(item => { item.values = item.values.slice(firstIndex); });
    const keys = [...vars, 'y'];
    const units = Array.from(new Set(keys.map(key => cyc.variables[key].units)));
    const unitText = units.length === 1 ? units[0]
      : units.map(unit => `${unit} (${keys.filter(key => cyc.variables[key].units === unit).map(key => cyc.variables[key].label).join(', ')})`).join('; ');
    parts(card).subtitle.textContent = `${unitText} · quarterly · ${FILTERS[state.filter].long} · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;
    const sources = Array.from(new Set(keys.map(key => cyc.variables[key].source).filter(Boolean)));
    draw(card, {
      dates, period: 0.25, zeroLine: true, digits: 2,
      label: `${card.querySelector('.chart-title').textContent}, cyclical components, ${FILTERS[state.filter].long}, with recessions shaded`,
    }, series, series.map(swatch), `Source: ${S.escapeHTML(sources.join('; '))}. Cycles: author’s calculations.`);
  }

  /* Tables ------------------------------------------------- */

  const unitMark = key => (state.payload.cycles.variables[key].units === 'Percentage points'
    ? ' <span class="unit-mark" title="Standard deviation in percentage points">†</span>' : '');
  const sampleText = row => (row.start ? `${D.quarterLabel(row.start)}–${D.quarterLabel(row.end)}` : '–');

  function statsTable(rows) {
    const label = key => state.payload.cycles.variables[key].label;
    const head = `<tr><th scope="col" class="component-head">Variable</th>
      <th scope="col">Sample</th>
      <th scope="col">Standard<br>deviation</th>
      <th scope="col">Relative standard deviation<br><span class="unit-label">(to output)</span></th>
      <th scope="col">First-order<br>autocorrelation</th>
      <th scope="col">Correlation<br>with output</th></tr>`;
    const bodyRows = rows.map(row => `<tr>
      <th scope="row">${S.escapeHTML(label(row.key))}${unitMark(row.key)}</th>
      <td class="sample-cell">${sampleText(row)}</td>
      <td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td></tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table">
      <caption class="visually-hidden">Business-cycle statistics</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
  }

  function lagText(k) {
    if (k == null) return '–';
    if (k === 0) return 'coincident';
    return k < 0 ? `leads by ${-k}` : `lags by ${k}`;
  }

  function crossTable(rows, lags) {
    const label = key => state.payload.cycles.variables[key].label;
    const head = `<tr><th scope="col" rowspan="2" class="component-head">Variable x</th>
      <th scope="colgroup" colspan="${lags.length}">Correlation of \\(x_{t+k}\\) with output \\(y_t\\)</th>
      <th scope="col" rowspan="2">Peak<br><span class="unit-label">(quarters)</span></th></tr>
      <tr>${lags.map(k => `<th scope="col">\\(k = ${k > 0 ? '+' : ''}${k}\\)</th>`).join('')}</tr>`;
    const bodyRows = rows.map(row => `<tr>
      <th scope="row">${S.escapeHTML(label(row.key))}</th>
      ${row.values.map((v, i) => `<td${lags[i] === row.peak_lag ? ' class="is-peak"' : ''}>${fmt(v)}</td>`).join('')}
      <td class="peak-lag">${lagText(row.peak_lag)}</td></tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table cross-table">
      <caption class="visually-hidden">Cross-correlations with output at leads and lags</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
  }

  /* Growth rates: the same statistics against real GDP growth, with means. */
  function growthTable(growth) {
    const label = key => growth.variables[key].label;
    const mark = key => (growth.variables[key].units.startsWith('Percentage points')
      ? ' <span class="unit-mark" title="In percentage points">†</span>' : '');
    const head = `<tr><th scope="col" class="component-head">Variable</th>
      <th scope="col">Sample</th>
      <th scope="col">Mean</th>
      <th scope="col">Standard<br>deviation</th>
      <th scope="col">Relative standard deviation<br><span class="unit-label">(to output growth)</span></th>
      <th scope="col">First-order<br>autocorrelation</th>
      <th scope="col">Correlation with<br>output growth</th></tr>`;
    const bodyRows = growth.stats.map(row => `<tr>
      <th scope="row">${S.escapeHTML(label(row.key))}${mark(row.key)}</th>
      <td class="sample-cell">${sampleText(row)}</td>
      <td>${fmt(growth.means[row.key])}</td>
      <td>${fmt(row.sd)}</td><td>${fmt(row.rel_sd)}</td><td>${fmt(row.ar1)}</td><td>${fmt(row.corr_y)}</td></tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table bc-table">
      <caption class="visually-hidden">Statistics of quarterly growth rates and returns</caption>
      <thead>${head}</thead><tbody>${bodyRows}</tbody></table></div>`;
  }

  function renderTables() {
    if (el.growth) {
      if (state.payload.growth) el.growth.innerHTML = growthTable(state.payload.growth);
      else el.growth.closest('[data-role="growth-block"]').hidden = true;
    }
    const tables = state.payload.tables[state.filter];
    if (el.stats) el.stats.innerHTML = statsTable(tables.stats);
    if (el.cross) {
      untypeset(el.cross);
      el.cross.innerHTML = crossTable(tables.cross, state.payload.cycles.methods.lags);
      typeset(el.cross);
    }
    body.querySelectorAll('[data-role="filter-name"]').forEach(node => { node.textContent = FILTERS[state.filter].long; });
  }

  /* Missing data: one entry per estimated period, grouped by source series. */
  function renderEstimates() {
    if (!el.estimates) return;
    const groups = new Map();
    Object.values(state.payload.indicators).forEach(item => (item.estimates || []).forEach(e => {
      const id = e.series_id;
      if (!groups.has(id)) groups.set(id, { reason: e.reason, method: e.method, dates: new Set(), used: new Set() });
      groups.get(id).dates.add(e.date);
      groups.get(id).used.add(item.short_title);
    }));
    if (!groups.size) { if (el.missing) el.missing.hidden = true; return; }
    if (el.missing) el.missing.hidden = false;
    const quarter = date => (date.slice(5, 7) === '01' || date.slice(5, 7) === '04' || date.slice(5, 7) === '07' || date.slice(5, 7) === '10');
    el.estimates.innerHTML = Array.from(groups.entries()).map(([id, g]) => {
      const dates = Array.from(g.dates).sort();
      const label = dates.every(quarter) ? D.quarterLabel : D.monthLabel;
      return `<details class="ribbon"><summary><span class="ribbon-title">${S.escapeHTML(id)}: ${dates.length} estimated value${dates.length > 1 ? 's' : ''}</span>
        <i class="fas fa-chevron-down ribbon-chevron" aria-hidden="true"></i></summary>
        <div class="ribbon-content"><p><strong>Periods:</strong> ${dates.map(label).join(', ')}.</p>
        <p><strong>Reason:</strong> ${S.escapeHTML(g.reason)}</p><p><strong>Method:</strong> ${S.escapeHTML(g.method)}.</p>
        <p><strong>Used in:</strong> ${S.escapeHTML(Array.from(g.used).join('; '))}.</p></div></details>`;
    }).join('');
  }

  function updateDownloads() {
    const links = state.payload.downloads;
    if (!links || !el.downloads) return;
    body.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = false;
    if (state.payload.generated_at_utc && el.updateNote) {
      el.updateNote.textContent = `Data updated on ${new Date(state.payload.generated_at_utc).toLocaleDateString('en-GB')}`;
      el.updateNote.hidden = false;
    }
  }

  function render(card) {
    if (card.dataset.vars) renderCycleCard(card);
    else renderLevelCard(card);
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !state.payload) return;
        state.visible.add(entry.target);
        render(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' })
    : null;

  async function load() {
    try {
      const response = await S.fetchFresh(body.dataset.dataUrl);
      const payload = await response.json();
      if (!payload || !payload.indicators) throw new Error('The data file does not contain any indicators.');
      state.payload = payload;
      el.pageStatus.hidden = true;
      updateDownloads();
      renderTables();
      renderEstimates();
      [...levelCards, ...cycleCards].forEach(card => {
        if (observer) observer.observe(card);
        else { state.visible.add(card); render(card); }
      });
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

  filterControl.select('hp', false);
  load();

  /* A link to a ribbon opens it before scrolling. */
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    const id = link && link.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target || target.tagName !== 'DETAILS') return;
    event.preventDefault();
    target.open = true;
    target.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', `#${id}`);
  });
})();
